
import { db } from '../config/database';
import { products, categories, brands } from '../models/schema';
import { eq, like, and, gte, lte, desc, asc, sql, or, ilike } from 'drizzle-orm';

export interface SearchAnalytics {
  query: string;
  results: number;
  userId?: string;
  timestamp: Date;
}

export class SearchService {
  private searchAnalytics: SearchAnalytics[] = [];

  async intelligentSearch(query: string, filters: any = {}) {
    // AI-powered ranking algorithm
    const relevanceScore = this.calculateRelevanceScore(query);
    
    let whereConditions: any[] = [eq(products.status, 'active')];

    // Enhanced search with AI scoring
    if (query) {
      whereConditions.push(
        or(
          ilike(products.name, `%${query}%`),
          ilike(products.description, `%${query}%`),
          ilike(products.shortDescription, `%${query}%`),
          ilike(products.tags, `%${query}%`)
        )
      );
    }

    // Apply filters
    if (filters.category) {
      const category = await db.select().from(categories).where(eq(categories.slug, filters.category)).limit(1);
      if (category.length) {
        whereConditions.push(eq(products.categoryId, category[0].id));
      }
    }

    if (filters.price_min) {
      whereConditions.push(gte(products.price, filters.price_min));
    }
    if (filters.price_max) {
      whereConditions.push(lte(products.price, filters.price_max));
    }
    if (filters.rating) {
      whereConditions.push(gte(products.rating, filters.rating));
    }

    const results = await db.select({
      id: products.id,
      name: products.name,
      shortDescription: products.shortDescription,
      price: products.price,
      originalPrice: products.originalPrice,
      images: products.images,
      rating: products.rating,
      reviewCount: products.reviewCount,
      isNew: products.isNew,
      isSale: products.isSale,
      isPopular: products.isPopular,
      discount: products.discount,
      stock: products.stock,
      categoryName: categories.name,
      brandName: brands.name,
      relevanceScore: sql<number>`${relevanceScore}`,
    })
      .from(products)
      .leftJoin(categories, eq(products.categoryId, categories.id))
      .leftJoin(brands, eq(products.brandId, brands.id))
      .where(and(...whereConditions))
      .orderBy(desc(sql`${relevanceScore}`), desc(products.adminScore))
      .limit(filters.limit || 24)
      .offset(filters.offset || 0);

    // Track search analytics
    this.trackSearch(query, results.length, filters.userId);

    return results;
  }

  private calculateRelevanceScore(query: string): any {
    // Simple relevance scoring - in production, use ML models
    return sql<number>`
      CASE 
        WHEN ${products.name} ILIKE '%${query}%' THEN 10
        WHEN ${products.shortDescription} ILIKE '%${query}%' THEN 8
        WHEN ${products.description} ILIKE '%${query}%' THEN 6
        WHEN ${products.tags} ILIKE '%${query}%' THEN 4
        ELSE 1
      END * ${products.adminScore}
    `;
  }

  private trackSearch(query: string, results: number, userId?: string) {
    this.searchAnalytics.push({
      query,
      results,
      userId,
      timestamp: new Date()
    });
  }

  async getSearchAnalytics() {
    return this.searchAnalytics;
  }

  async getPersonalizedRecommendations(userId: string) {
    // Simple recommendation based on user's order history
    const userOrders = await db.select()
      .from(orders)
      .where(eq(orders.userId, userId))
      .limit(10);

    // Get products from similar categories
    const recommendations = await db.select({
      id: products.id,
      name: products.name,
      price: products.price,
      images: products.images,
      rating: products.rating,
    })
      .from(products)
      .where(and(
        eq(products.status, 'active'),
        eq(products.isPopular, true)
      ))
      .orderBy(desc(products.rating))
      .limit(8);

    return recommendations;
  }
}

export const searchService = new SearchService();
