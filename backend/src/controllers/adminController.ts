
import { Request, Response } from 'express';
import { db } from '../config/database';
import { products, orders, users, orderItems, reviews } from '../models/schema';
import { eq, gte, lte, desc, sql, and } from 'drizzle-orm';

export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    const today = new Date();
    const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Total sales
    const totalSales = await db.select({
      total: sql<number>`SUM(${orders.totalAmount})`,
    })
      .from(orders)
      .where(eq(orders.paymentStatus, 'paid'));

    // Monthly sales
    const monthlySales = await db.select({
      total: sql<number>`SUM(${orders.totalAmount})`,
    })
      .from(orders)
      .where(
        and(
          eq(orders.paymentStatus, 'paid'),
          gte(orders.createdAt, thirtyDaysAgo)
        )
      );

    // Total orders
    const totalOrders = await db.select({
      count: sql<number>`COUNT(*)`,
    })
      .from(orders);

    // Total users
    const totalUsers = await db.select({
      count: sql<number>`COUNT(*)`,
    })
      .from(users);

    // Top selling products
    const topProducts = await db.select({
      productId: orderItems.productId,
      productName: orderItems.productName,
      totalSold: sql<number>`SUM(${orderItems.quantity})`,
      revenue: sql<number>`SUM(${orderItems.totalPrice})`,
    })
      .from(orderItems)
      .innerJoin(orders, eq(orderItems.orderId, orders.id))
      .where(eq(orders.paymentStatus, 'paid'))
      .groupBy(orderItems.productId, orderItems.productName)
      .orderBy(desc(sql`SUM(${orderItems.quantity})`))
      .limit(10);

    // Recent orders
    const recentOrders = await db.select({
      id: orders.id,
      orderNumber: orders.orderNumber,
      totalAmount: orders.totalAmount,
      status: orders.status,
      createdAt: orders.createdAt,
      guestEmail: orders.guestEmail,
      userId: orders.userId,
    })
      .from(orders)
      .orderBy(desc(orders.createdAt))
      .limit(10);

    res.json({
      stats: {
        totalSales: totalSales[0]?.total || 0,
        monthlySales: monthlySales[0]?.total || 0,
        totalOrders: totalOrders[0]?.count || 0,
        totalUsers: totalUsers[0]?.count || 0,
      },
      topProducts,
      recentOrders,
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getOrderAnalytics = async (req: Request, res: Response) => {
  try {
    const { startDate, endDate } = req.query;

    let dateFilter = [];
    if (startDate) {
      dateFilter.push(gte(orders.createdAt, new Date(startDate as string)));
    }
    if (endDate) {
      dateFilter.push(lte(orders.createdAt, new Date(endDate as string)));
    }

    // Daily sales data
    const dailySales = await db.select({
      date: sql<string>`DATE(${orders.createdAt})`,
      sales: sql<number>`SUM(${orders.totalAmount})`,
      orderCount: sql<number>`COUNT(*)`,
    })
      .from(orders)
      .where(and(eq(orders.paymentStatus, 'paid'), ...dateFilter))
      .groupBy(sql`DATE(${orders.createdAt})`)
      .orderBy(sql`DATE(${orders.createdAt})`);

    // Status breakdown
    const statusBreakdown = await db.select({
      status: orders.status,
      count: sql<number>`COUNT(*)`,
    })
      .from(orders)
      .where(and(...dateFilter))
      .groupBy(orders.status);

    res.json({
      dailySales,
      statusBreakdown,
    });
  } catch (error) {
    console.error('Order analytics error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getInventoryAlerts = async (req: Request, res: Response) => {
  try {
    const lowStockProducts = await db.select({
      id: products.id,
      name: products.name,
      sku: products.sku,
      stock: products.stock,
      images: products.images,
    })
      .from(products)
      .where(and(eq(products.status, 'active'), lte(products.stock, 10)))
      .orderBy(products.stock);

    res.json({ lowStockProducts });
  } catch (error) {
    console.error('Inventory alerts error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateProductStock = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;
    const { stock } = req.body;

    await db.update(products)
      .set({ stock })
      .where(eq(products.id, productId));

    res.json({ message: 'Stock updated successfully' });
  } catch (error) {
    console.error('Update stock error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
