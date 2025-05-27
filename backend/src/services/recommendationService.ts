
import { db } from '../config/database';
import { products, orders, orderItems, reviews, wishlist } from '../models/schema';
import { eq, and, desc, sql } from 'drizzle-orm';

export class RecommendationService {
  async getPersonalizedRecommendations(userId: string, limit: number = 8) {
    // Get user's purchase history
    const userPurchases = await db.select({
      productId: orderItems.productId,
      categoryId: products.categoryId,
      brandId: products.brandId,
    })
      .from(orderItems)
      .innerJoin(orders, eq(orderItems.orderId, orders.id))
      .innerJoin(products, eq(orderItems.productId, products.id))
      .where(eq(orders.userId, userId));

    // Get user's wishlist
    const userWishlist = await db.select({
      productId: wishlist.productId,
    })
      .from(wishlist)
      .where(eq(wishlist.userId, userId));

    // Get frequently bought together items
    const recommendations = await this.getCollaborativeRecommendations(userId, limit);
    
    return recommendations;
  }

  async getCollaborativeRecommendations(userId: string, limit: number) {
    // Find users with similar purchase patterns
    const similarUsers = await db.select({
      userId: orders.userId,
      commonProducts: sql<number>`COUNT(DISTINCT ${orderItems.productId})`,
    })
      .from(orders)
      .innerJoin(orderItems, eq(orders.id, orderItems.orderId))
      .where(
        and(
          sql`${orders.userId} != ${userId}`,
          sql`${orderItems.productId} IN (
            SELECT ${orderItems.productId} 
            FROM ${orderItems} 
            INNER JOIN ${orders} ON ${orderItems.orderId} = ${orders.id}
            WHERE ${orders.userId} = ${userId}
          )`
        )
      )
      .groupBy(orders.userId)
      .orderBy(desc(sql`COUNT(DISTINCT ${orderItems.productId})`))
      .limit(10);

    // Get products purchased by similar users
    const recommendations = await db.select({
      id: products.id,
      name: products.name,
      price: products.price,
      images: products.images,
      rating: products.rating,
      reviewCount: products.reviewCount,
    })
      .from(products)
      .innerJoin(orderItems, eq(products.id, orderItems.productId))
      .innerJoin(orders, eq(orderItems.orderId, orders.id))
      .where(
        and(
          eq(products.status, 'active'),
          sql`${orders.userId} IN (${similarUsers.map(u => u.userId).join(',')})`
        )
      )
      .groupBy(products.id, products.name, products.price, products.images, products.rating, products.reviewCount)
      .orderBy(desc(sql`COUNT(*)`))
      .limit(limit);

    return recommendations;
  }

  async getFrequentlyBoughtTogether(productId: string) {
    const frequentlyBought = await db.select({
      id: products.id,
      name: products.name,
      price: products.price,
      images: products.images,
      frequency: sql<number>`COUNT(*)`,
    })
      .from(products)
      .innerJoin(orderItems, eq(products.id, orderItems.productId))
      .where(
        and(
          eq(products.status, 'active'),
          sql`${orderItems.orderId} IN (
            SELECT DISTINCT ${orderItems.orderId}
            FROM ${orderItems}
            WHERE ${orderItems.productId} = ${productId}
          )`,
          sql`${products.id} != ${productId}`
        )
      )
      .groupBy(products.id, products.name, products.price, products.images)
      .orderBy(desc(sql`COUNT(*)`))
      .limit(6);

    return frequentlyBought;
  }

  async getTrendingProducts(limit: number = 8) {
    const trending = await db.select({
      id: products.id,
      name: products.name,
      price: products.price,
      images: products.images,
      rating: products.rating,
      trendScore: sql<number>`(${products.reviewCount} * ${products.rating}) + ${products.adminScore}`,
    })
      .from(products)
      .where(eq(products.status, 'active'))
      .orderBy(desc(sql`(${products.reviewCount} * ${products.rating}) + ${products.adminScore}`))
      .limit(limit);

    return trending;
  }
}

export const recommendationService = new RecommendationService();
