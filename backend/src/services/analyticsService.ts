
import { db } from '../config/database';
import { products, orders, orderItems, productViews, users } from '../models/schema';
import { eq, gte, lte, desc, sql, and } from 'drizzle-orm';

export class AnalyticsService {
  async getConversionFunnel(startDate: Date, endDate: Date) {
    // Product views
    const views = await db.select({
      count: sql<number>`COUNT(DISTINCT ${productViews.sessionId})`,
    })
      .from(productViews)
      .where(and(
        gte(productViews.viewedAt, startDate),
        lte(productViews.viewedAt, endDate)
      ));

    // Cart additions (orders in pending state)
    const cartAdditions = await db.select({
      count: sql<number>`COUNT(DISTINCT ${orders.id})`,
    })
      .from(orders)
      .where(and(
        gte(orders.createdAt, startDate),
        lte(orders.createdAt, endDate)
      ));

    // Purchases (paid orders)
    const purchases = await db.select({
      count: sql<number>`COUNT(DISTINCT ${orders.id})`,
    })
      .from(orders)
      .where(and(
        eq(orders.paymentStatus, 'paid'),
        gte(orders.createdAt, startDate),
        lte(orders.createdAt, endDate)
      ));

    const totalViews = views[0]?.count || 0;
    const totalCartAdditions = cartAdditions[0]?.count || 0;
    const totalPurchases = purchases[0]?.count || 0;

    return {
      views: totalViews,
      cartAdditions: totalCartAdditions,
      purchases: totalPurchases,
      viewToCartRate: totalViews > 0 ? (totalCartAdditions / totalViews) * 100 : 0,
      cartToPurchaseRate: totalCartAdditions > 0 ? (totalPurchases / totalCartAdditions) * 100 : 0,
      overallConversionRate: totalViews > 0 ? (totalPurchases / totalViews) * 100 : 0,
    };
  }

  async getCustomerLifetimeValue() {
    const customerLTV = await db.select({
      userId: orders.userId,
      totalSpent: sql<number>`SUM(${orders.totalAmount})`,
      orderCount: sql<number>`COUNT(${orders.id})`,
      avgOrderValue: sql<number>`AVG(${orders.totalAmount})`,
      firstOrderDate: sql<Date>`MIN(${orders.createdAt})`,
      lastOrderDate: sql<Date>`MAX(${orders.createdAt})`,
    })
      .from(orders)
      .where(eq(orders.paymentStatus, 'paid'))
      .groupBy(orders.userId)
      .orderBy(desc(sql`SUM(${orders.totalAmount})`));

    return customerLTV;
  }

  async getProductPerformance(period: 'week' | 'month' | 'quarter' = 'month') {
    const days = period === 'week' ? 7 : period === 'month' ? 30 : 90;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const performance = await db.select({
      productId: orderItems.productId,
      productName: orderItems.productName,
      totalSold: sql<number>`SUM(${orderItems.quantity})`,
      totalRevenue: sql<number>`SUM(${orderItems.totalPrice})`,
      avgPrice: sql<number>`AVG(${orderItems.price})`,
      orderCount: sql<number>`COUNT(DISTINCT ${orderItems.orderId})`,
    })
      .from(orderItems)
      .innerJoin(orders, eq(orderItems.orderId, orders.id))
      .where(and(
        eq(orders.paymentStatus, 'paid'),
        gte(orders.createdAt, startDate)
      ))
      .groupBy(orderItems.productId, orderItems.productName)
      .orderBy(desc(sql`SUM(${orderItems.totalPrice})`))
      .limit(50);

    return performance;
  }

  async getUserSegmentation() {
    const segments = await db.select({
      loyaltyTier: users.loyaltyTier,
      userCount: sql<number>`COUNT(*)`,
      avgSpent: sql<number>`AVG(${users.totalSpent})`,
      avgPoints: sql<number>`AVG(${users.loyaltyPoints})`,
    })
      .from(users)
      .groupBy(users.loyaltyTier);

    return segments;
  }

  async getAbandonedCarts() {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const abandonedCarts = await db.select({
      orderId: orders.id,
      userId: orders.userId,
      guestEmail: orders.guestEmail,
      subtotal: orders.subtotal,
      createdAt: orders.createdAt,
      itemCount: sql<number>`COUNT(${orderItems.id})`,
    })
      .from(orders)
      .leftJoin(orderItems, eq(orders.id, orderItems.orderId))
      .where(and(
        eq(orders.status, 'pending'),
        eq(orders.paymentStatus, 'unpaid'),
        gte(orders.createdAt, thirtyDaysAgo)
      ))
      .groupBy(orders.id, orders.userId, orders.guestEmail, orders.subtotal, orders.createdAt)
      .orderBy(desc(orders.createdAt));

    return abandonedCarts;
  }

  async getRevenueAnalytics(startDate: Date, endDate: Date) {
    const dailyRevenue = await db.select({
      date: sql<string>`DATE(${orders.createdAt})`,
      revenue: sql<number>`SUM(${orders.totalAmount})`,
      orderCount: sql<number>`COUNT(*)`,
      avgOrderValue: sql<number>`AVG(${orders.totalAmount})`,
    })
      .from(orders)
      .where(and(
        eq(orders.paymentStatus, 'paid'),
        gte(orders.createdAt, startDate),
        lte(orders.createdAt, endDate)
      ))
      .groupBy(sql`DATE(${orders.createdAt})`)
      .orderBy(sql`DATE(${orders.createdAt})`);

    return dailyRevenue;
  }
}

export const analyticsService = new AnalyticsService();
