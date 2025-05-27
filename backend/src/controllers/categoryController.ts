
import { Request, Response } from 'express';
import { db } from '../config/database';
import { categories, products } from '../models/schema';
import { eq, and, isNull } from 'drizzle-orm';

export const getCategories = async (req: Request, res: Response) => {
  try {
    const categoryList = await db.select({
      id: categories.id,
      name: categories.name,
      slug: categories.slug,
      description: categories.description,
      image: categories.image,
      parentId: categories.parentId,
      sortOrder: categories.sortOrder,
      isActive: categories.isActive,
    })
      .from(categories)
      .where(eq(categories.isActive, true))
      .orderBy(categories.sortOrder);

    // Build hierarchy
    const rootCategories = categoryList.filter(cat => !cat.parentId);
    const subcategories = categoryList.filter(cat => cat.parentId);

    const categoriesWithSubs = rootCategories.map(category => ({
      ...category,
      subcategories: subcategories.filter(sub => sub.parentId === category.id),
    }));

    res.json({ categories: categoriesWithSubs });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getCategoryBySlug = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;

    const category = await db.select().from(categories).where(eq(categories.slug, slug)).limit(1);

    if (!category.length) {
      return res.status(404).json({ error: 'Category not found' });
    }

    // Get subcategories
    const subcategoryList = await db.select()
      .from(categories)
      .where(and(eq(categories.parentId, category[0].id), eq(categories.isActive, true)))
      .orderBy(categories.sortOrder);

    // Get category products with pagination
    const page = parseInt(req.query.page as string) || 1;
    const limit = category[0].productsPerPage || 24;
    const offset = (page - 1) * limit;

    const categoryProducts = await db.select({
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
    })
      .from(products)
      .where(and(eq(products.categoryId, category[0].id), eq(products.status, 'active')))
      .limit(limit)
      .offset(offset);

    res.json({
      category: category[0],
      subcategories: subcategoryList,
      products: categoryProducts,
    });
  } catch (error) {
    console.error('Get category error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
