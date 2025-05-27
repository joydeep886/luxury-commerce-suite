
import { Request, Response } from 'express';
import { db } from '../config/database';
import { products, categories, brands, reviews , users } from '../models/schema';
import { eq, like, and, gte, lte, desc, asc, sql, or, ilike } from 'drizzle-orm';
import { z } from 'zod';

const searchSchema = z.object({
  q: z.string().optional(),
  category: z.string().optional(),
  brand: z.string().optional(),
  price_min: z.string().optional(),
  price_max: z.string().optional(),
  rating: z.string().optional(),
  sort: z.enum(['relevance', 'price_asc', 'price_desc', 'rating', 'newest', 'popular']).optional().default('relevance'),
  page: z.string().optional().default('1'),
  limit: z.string().optional().default('24'),
  in_stock: z.string().optional(),
});

export const searchProducts = async (req: Request, res: Response) => {
  try {
    const query = searchSchema.parse(req.query);
    const page = parseInt(query.page);
    const limit = parseInt(query.limit);
    const offset = (page - 1) * limit;

    let whereConditions: any[] = [eq(products.status, 'active')];

    // Search term
    if (query.q) {
      whereConditions.push(
        or(
          ilike(products.name, `%${query.q}%`),
          ilike(products.description, `%${query.q}%`),
          ilike(products.shortDescription, `%${query.q}%`)
        )
      );
    }

    // Category filter
    if (query.category) {
      const category = await db.select().from(categories).where(eq(categories.slug, query.category)).limit(1);
      if (category.length) {
        whereConditions.push(eq(products.categoryId, category[0].id));
      }
    }

    // Price filters
    if (query.price_min) {
      whereConditions.push(gte(products.price, query.price_min));
    }
    if (query.price_max) {
      whereConditions.push(lte(products.price, query.price_max));
    }

    // Stock filter
    if (query.in_stock === 'true') {
      whereConditions.push(gte(products.stock, 1));
    }

    // Rating filter
    if (query.rating) {
      whereConditions.push(gte(products.rating, query.rating));
    }

    // Build query
    let orderBy: any = desc(products.createdAt);
    switch (query.sort) {
      case 'price_asc':
        orderBy = asc(products.price);
        break;
      case 'price_desc':
        orderBy = desc(products.price);
        break;
      case 'rating':
        orderBy = desc(products.rating);
        break;
      case 'newest':
        orderBy = desc(products.createdAt);
        break;
      case 'popular':
        orderBy = desc(products.isPopular);
        break;
      case 'relevance':
      default:
        orderBy = desc(products.adminScore);
        break;
    }

    // Get products with category and brand info
    const productList = await db.select({
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
    })
      .from(products)
      .leftJoin(categories, eq(products.categoryId, categories.id))
      .leftJoin(brands, eq(products.brandId, brands.id))
      .where(and(...whereConditions))
      .orderBy(orderBy)
      .limit(limit)
      .offset(offset);

    // Get total count
    const totalCount = await db.select({ count: sql<number>`count(*)` })
      .from(products)
      .where(and(...whereConditions));

    const total = Number(totalCount[0].count);
    const totalPages = Math.ceil(total / limit);

    res.json({
      products: productList,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: total,
        itemsPerPage: limit,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
        nextPage: page < totalPages ? page + 1 : null,
        prevPage: page > 1 ? page - 1 : null,
      },
    });
  } catch (error) {
    console.error('Search products error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const product = await db.select({
      id: products.id,
      name: products.name,
      description: products.description,
      shortDescription: products.shortDescription,
      price: products.price,
      originalPrice: products.originalPrice,
      sku: products.sku,
      images: products.images,
      variants: products.variants,
      stock: products.stock,
      rating: products.rating,
      reviewCount: products.reviewCount,
      isNew: products.isNew,
      isSale: products.isSale,
      isPopular: products.isPopular,
      discount: products.discount,
      sizes: products.sizes,
      colors: products.colors,
      material: products.material,
      tags: products.tags,
      categoryName: categories.name,
      categorySlug: categories.slug,
      brandName: brands.name,
    })
      .from(products)
      .leftJoin(categories, eq(products.categoryId, categories.id))
      .leftJoin(brands, eq(products.brandId, brands.id))
      .where(eq(products.id, id))
      .limit(1);

    if (!product.length) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Get product reviews
    const productReviews = await db.select({
      id: reviews.id,
      rating: reviews.rating,
      title: reviews.title,
      content: reviews.content,
      isVerified: reviews.isVerified,
      createdAt: reviews.createdAt,
      userName: sql<string>`${users.firstName} || ' ' || ${users.lastName}`,
    })
      .from(reviews)
      .leftJoin(users, eq(reviews.userId, users.id))
      .where(eq(reviews.productId, id))
      .orderBy(desc(reviews.createdAt))
      .limit(10);

    res.json({
      product: product[0],
      reviews: productReviews,
    });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getFeaturedProducts = async (req: Request, res: Response) => {
  try {
    const featuredProducts = await db.select({
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
      categoryName: categories.name,
      brandName: brands.name,
    })
      .from(products)
      .leftJoin(categories, eq(products.categoryId, categories.id))
      .leftJoin(brands, eq(products.brandId, brands.id))
      .where(and(eq(products.status, 'active'), eq(products.isPopular, true)))
      .orderBy(desc(products.adminScore))
      .limit(8);

    res.json({ products: featuredProducts });
  } catch (error) {
    console.error('Get featured products error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getNewProducts = async (req: Request, res: Response) => {
  try {
    const newProducts = await db.select({
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
      categoryName: categories.name,
      brandName: brands.name,
    })
      .from(products)
      .leftJoin(categories, eq(products.categoryId, categories.id))
      .leftJoin(brands, eq(products.brandId, brands.id))
      .where(and(eq(products.status, 'active'), eq(products.isNew, true)))
      .orderBy(desc(products.createdAt))
      .limit(8);

    res.json({ products: newProducts });
  } catch (error) {
    console.error('Get new products error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
