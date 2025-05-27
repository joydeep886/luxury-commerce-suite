import { Request, Response } from 'express';
import { db } from '../config/database';
import { products, orders, users, orderItems, reviews, categories, brands, coupons, userAddresses, wishlist } from '../models/schema';
import { eq, gte, lte, desc, asc, sql, and, or, like, ilike, count, avg, sum } from 'drizzle-orm';

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

// Product Management
export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const { page = '1', limit = '10', search, category, status, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
    const offset = (parseInt(page as string) - 1) * parseInt(limit as string);

    let whereConditions: any[] = [];

    if (search) {
      whereConditions.push(
        or(
          ilike(products.name, `%${search}%`),
          ilike(products.sku, `%${search}%`),
          ilike(products.description, `%${search}%`)
        )
      );
    }

    if (category) {
      whereConditions.push(eq(products.categoryId, category as string));
    }

    if (status) {
      whereConditions.push(eq(products.status, status as any));
    }

    const orderDirection = sortOrder === 'desc' ? desc : asc;
    const orderColumn = products[sortBy as keyof typeof products] || products.createdAt;

    const productList = await db.select({
      id: products.id,
      name: products.name,
      sku: products.sku,
      price: products.price,
      originalPrice: products.originalPrice,
      stock: products.stock,
      status: products.status,
      images: products.images,
      categoryName: categories.name,
      brandName: brands.name,
      createdAt: products.createdAt,
      isPopular: products.isPopular,
      isNew: products.isNew,
      isSale: products.isSale,
      rating: products.rating,
      reviewCount: products.reviewCount,
    })
      .from(products)
      .leftJoin(categories, eq(products.categoryId, categories.id))
      .leftJoin(brands, eq(products.brandId, brands.id))
      .where(whereConditions.length > 0 ? and(...whereConditions) : undefined)
      .orderBy(orderDirection(orderColumn))
      .limit(parseInt(limit as string))
      .offset(offset);

    const totalCount = await db.select({ count: sql<number>`count(*)` })
      .from(products)
      .where(whereConditions.length > 0 ? and(...whereConditions) : undefined);

    res.json({
      products: productList,
      total: totalCount[0].count,
      page: parseInt(page as string),
      limit: parseInt(limit as string),
      totalPages: Math.ceil(totalCount[0].count / parseInt(limit as string)),
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const createProduct = async (req: Request, res: Response) => {
  try {
    const {
      name,
      description,
      shortDescription,
      price,
      originalPrice,
      sku,
      categoryId,
      brandId,
      images,
      variants,
      stock,
      sizes,
      colors,
      material,
      tags,
      adminScore = 1,
      status = 'draft'
    } = req.body;

    const newProduct = await db.insert(products).values({
      name,
      description,
      shortDescription,
      price,
      originalPrice,
      sku,
      categoryId,
      brandId,
      images,
      variants,
      stock,
      sizes,
      colors,
      material,
      tags,
      adminScore,
      status,
    }).returning();

    res.status(201).json({ product: newProduct[0] });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;
    const updateData = req.body;

    const updatedProduct = await db.update(products)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(products.id, productId))
      .returning();

    if (!updatedProduct.length) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({ product: updatedProduct[0] });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;

    await db.delete(products).where(eq(products.id, productId));

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const bulkUpdateProducts = async (req: Request, res: Response) => {
  try {
    const { productIds, updateData } = req.body;

    for (const productId of productIds) {
      await db.update(products)
        .set({ ...updateData, updatedAt: new Date() })
        .where(eq(products.id, productId));
    }

    res.json({ message: 'Products updated successfully' });
  } catch (error) {
    console.error('Bulk update products error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Order Management
export const getAllOrders = async (req: Request, res: Response) => {
  try {
    const { page = '1', limit = '10', status, search, startDate, endDate } = req.query;
    const offset = (parseInt(page as string) - 1) * parseInt(limit as string);

    let whereConditions: any[] = [];

    if (status) {
      whereConditions.push(eq(orders.status, status as any));
    }

    if (search) {
      whereConditions.push(
        or(
          ilike(orders.orderNumber, `%${search}%`),
          ilike(orders.guestEmail, `%${search}%`)
        )
      );
    }

    if (startDate) {
      whereConditions.push(gte(orders.createdAt, new Date(startDate as string)));
    }

    if (endDate) {
      whereConditions.push(lte(orders.createdAt, new Date(endDate as string)));
    }

    const orderList = await db.select({
      id: orders.id,
      orderNumber: orders.orderNumber,
      userId: orders.userId,
      guestEmail: orders.guestEmail,
      status: orders.status,
      paymentStatus: orders.paymentStatus,
      totalAmount: orders.totalAmount,
      createdAt: orders.createdAt,
      shippedAt: orders.shippedAt,
      deliveredAt: orders.deliveredAt,
      customerName: sql<string>`COALESCE(${users.firstName} || ' ' || ${users.lastName}, 'Guest')`,
    })
      .from(orders)
      .leftJoin(users, eq(orders.userId, users.id))
      .where(whereConditions.length > 0 ? and(...whereConditions) : undefined)
      .orderBy(desc(orders.createdAt))
      .limit(parseInt(limit as string))
      .offset(offset);

    const totalCount = await db.select({ count: sql<number>`count(*)` })
      .from(orders)
      .where(whereConditions.length > 0 ? and(...whereConditions) : undefined);

    res.json({
      orders: orderList,
      total: totalCount[0].count,
      page: parseInt(page as string),
      limit: parseInt(limit as string),
      totalPages: Math.ceil(totalCount[0].count / parseInt(limit as string)),
    });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;
    const { status, trackingNumber } = req.body;

    const updateData: any = { status, updatedAt: new Date() };

    if (status === 'shipped' && trackingNumber) {
      updateData.trackingNumber = trackingNumber;
      updateData.shippedAt = new Date();
    }

    if (status === 'delivered') {
      updateData.deliveredAt = new Date();
    }

    const updatedOrder = await db.update(orders)
      .set(updateData)
      .where(eq(orders.id, orderId))
      .returning();

    if (!updatedOrder.length) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json({ order: updatedOrder[0] });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const processRefund = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;
    const { refundAmount, reason } = req.body;

    // Update order payment status
    await db.update(orders)
      .set({ 
        paymentStatus: 'refunded',
        notes: reason,
        updatedAt: new Date()
      })
      .where(eq(orders.id, orderId));

    // Here you would integrate with payment processor to process actual refund
    
    res.json({ message: 'Refund processed successfully' });
  } catch (error) {
    console.error('Process refund error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Customer Management
export const getAllCustomers = async (req: Request, res: Response) => {
  try {
    const { page = '1', limit = '10', search, loyaltyTier } = req.query;
    const offset = (parseInt(page as string) - 1) * parseInt(limit as string);

    let whereConditions: any[] = [];

    if (search) {
      whereConditions.push(
        or(
          ilike(users.email, `%${search}%`),
          ilike(users.firstName, `%${search}%`),
          ilike(users.lastName, `%${search}%`)
        )
      );
    }

    if (loyaltyTier) {
      whereConditions.push(eq(users.loyaltyTier, loyaltyTier as any));
    }

    const customerList = await db.select({
      id: users.id,
      email: users.email,
      firstName: users.firstName,
      lastName: users.lastName,
      phone: users.phone,
      isVerified: users.isVerified,
      loyaltyPoints: users.loyaltyPoints,
      loyaltyTier: users.loyaltyTier,
      totalSpent: users.totalSpent,
      lastLoginAt: users.lastLoginAt,
      createdAt: users.createdAt,
      orderCount: sql<number>`(SELECT COUNT(*) FROM ${orders} WHERE ${orders.userId} = ${users.id})`,
    })
      .from(users)
      .where(and(eq(users.role, 'customer'), ...whereConditions))
      .orderBy(desc(users.createdAt))
      .limit(parseInt(limit as string))
      .offset(offset);

    const totalCount = await db.select({ count: sql<number>`count(*)` })
      .from(users)
      .where(and(eq(users.role, 'customer'), ...whereConditions));

    res.json({
      customers: customerList,
      total: totalCount[0].count,
      page: parseInt(page as string),
      limit: parseInt(limit as string),
      totalPages: Math.ceil(totalCount[0].count / parseInt(limit as string)),
    });
  } catch (error) {
    console.error('Get customers error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getCustomerDetails = async (req: Request, res: Response) => {
  try {
    const { customerId } = req.params;

    const customer = await db.select()
      .from(users)
      .where(eq(users.id, customerId))
      .limit(1);

    if (!customer.length) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    // Get customer orders
    const customerOrders = await db.select()
      .from(orders)
      .where(eq(orders.userId, customerId))
      .orderBy(desc(orders.createdAt))
      .limit(10);

    // Get customer addresses
    const customerAddresses = await db.select()
      .from(userAddresses)
      .where(eq(userAddresses.userId, customerId));

    // Get customer wishlist
    const customerWishlist = await db.select({
      productId: wishlist.productId,
      productName: products.name,
      productPrice: products.price,
      productImage: products.images,
    })
      .from(wishlist)
      .leftJoin(products, eq(wishlist.productId, products.id))
      .where(eq(wishlist.userId, customerId));

    res.json({
      customer: customer[0],
      orders: customerOrders,
      addresses: customerAddresses,
      wishlist: customerWishlist,
    });
  } catch (error) {
    console.error('Get customer details error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateCustomer = async (req: Request, res: Response) => {
  try {
    const { customerId } = req.params;
    const updateData = req.body;

    const updatedCustomer = await db.update(users)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(users.id, customerId))
      .returning();

    if (!updatedCustomer.length) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    res.json({ customer: updatedCustomer[0] });
  } catch (error) {
    console.error('Update customer error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteCustomer = async (req: Request, res: Response) => {
  try {
    const { customerId } = req.params;

    // Note: In a real application, you might want to anonymize rather than delete
    await db.delete(users).where(eq(users.id, customerId));

    res.json({ message: 'Customer deleted successfully' });
  } catch (error) {
    console.error('Delete customer error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Analytics
export const getSalesAnalytics = async (req: Request, res: Response) => {
  try {
    const { startDate, endDate, groupBy = 'day' } = req.query;

    let dateFilter = [];
    if (startDate) {
      dateFilter.push(gte(orders.createdAt, new Date(startDate as string)));
    }
    if (endDate) {
      dateFilter.push(lte(orders.createdAt, new Date(endDate as string)));
    }

    let dateGroupFormat = 'DATE(%s)';
    if (groupBy === 'month') {
      dateGroupFormat = 'DATE_TRUNC(\'month\', %s)';
    } else if (groupBy === 'week') {
      dateGroupFormat = 'DATE_TRUNC(\'week\', %s)';
    }

    const salesData = await db.select({
      period: sql<string>`${dateGroupFormat.replace('%s', orders.createdAt.name)}`,
      totalSales: sql<number>`SUM(${orders.totalAmount})`,
      orderCount: sql<number>`COUNT(*)`,
      avgOrderValue: sql<number>`AVG(${orders.totalAmount})`,
    })
      .from(orders)
      .where(and(eq(orders.paymentStatus, 'paid'), ...dateFilter))
      .groupBy(sql`${dateGroupFormat.replace('%s', orders.createdAt.name)}`)
      .orderBy(sql`${dateGroupFormat.replace('%s', orders.createdAt.name)}`);

    res.json({ salesData });
  } catch (error) {
    console.error('Sales analytics error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getCustomerAnalytics = async (req: Request, res: Response) => {
  try {
    const { startDate, endDate } = req.query;

    let dateFilter = [];
    if (startDate) {
      dateFilter.push(gte(users.createdAt, new Date(startDate as string)));
    }
    if (endDate) {
      dateFilter.push(lte(users.createdAt, new Date(endDate as string)));
    }

    // Customer growth
    const customerGrowth = await db.select({
      date: sql<string>`DATE(${users.createdAt})`,
      newCustomers: sql<number>`COUNT(*)`,
    })
      .from(users)
      .where(and(eq(users.role, 'customer'), ...dateFilter))
      .groupBy(sql`DATE(${users.createdAt})`)
      .orderBy(sql`DATE(${users.createdAt})`);

    // Customer lifetime value
    const customerLTV = await db.select({
      loyaltyTier: users.loyaltyTier,
      avgLifetimeValue: sql<number>`AVG(${users.totalSpent})`,
      customerCount: sql<number>`COUNT(*)`,
    })
      .from(users)
      .where(eq(users.role, 'customer'))
      .groupBy(users.loyaltyTier);

    res.json({
      customerGrowth,
      customerLTV,
    });
  } catch (error) {
    console.error('Customer analytics error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getProductAnalytics = async (req: Request, res: Response) => {
  try {
    // Best performing products
    const bestProducts = await db.select({
      productId: orderItems.productId,
      productName: orderItems.productName,
      totalSold: sql<number>`SUM(${orderItems.quantity})`,
      totalRevenue: sql<number>`SUM(${orderItems.totalPrice})`,
      avgRating: sql<number>`AVG(${products.rating})`,
    })
      .from(orderItems)
      .leftJoin(products, eq(orderItems.productId, products.id))
      .leftJoin(orders, eq(orderItems.orderId, orders.id))
      .where(eq(orders.paymentStatus, 'paid'))
      .groupBy(orderItems.productId, orderItems.productName)
      .orderBy(desc(sql`SUM(${orderItems.quantity})`))
      .limit(20);

    // Category performance
    const categoryPerformance = await db.select({
      categoryId: products.categoryId,
      categoryName: categories.name,
      totalSold: sql<number>`SUM(${orderItems.quantity})`,
      totalRevenue: sql<number>`SUM(${orderItems.totalPrice})`,
    })
      .from(orderItems)
      .leftJoin(products, eq(orderItems.productId, products.id))
      .leftJoin(categories, eq(products.categoryId, categories.id))
      .leftJoin(orders, eq(orderItems.orderId, orders.id))
      .where(eq(orders.paymentStatus, 'paid'))
      .groupBy(products.categoryId, categories.name)
      .orderBy(desc(sql`SUM(${orderItems.totalPrice})`));

    res.json({
      bestProducts,
      categoryPerformance,
    });
  } catch (error) {
    console.error('Product analytics error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Additional stub functions for completeness
export const getInventoryStats = async (req: Request, res: Response) => {
  try {
    res.json({ message: 'Inventory stats endpoint' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const createCoupon = async (req: Request, res: Response) => {
  try {
    res.json({ message: 'Create coupon endpoint' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getAllCoupons = async (req: Request, res: Response) => {
  try {
    res.json({ message: 'Get all coupons endpoint' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateCoupon = async (req: Request, res: Response) => {
  try {
    res.json({ message: 'Update coupon endpoint' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteCoupon = async (req: Request, res: Response) => {
  try {
    res.json({ message: 'Delete coupon endpoint' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const sendBulkEmail = async (req: Request, res: Response) => {
  try {
    res.json({ message: 'Send bulk email endpoint' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getContentPages = async (req: Request, res: Response) => {
  try {
    res.json({ message: 'Get content pages endpoint' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateContentPage = async (req: Request, res: Response) => {
  try {
    res.json({ message: 'Update content page endpoint' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getMediaLibrary = async (req: Request, res: Response) => {
  try {
    res.json({ message: 'Get media library endpoint' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const uploadMedia = async (req: Request, res: Response) => {
  try {
    res.json({ message: 'Upload media endpoint' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteMedia = async (req: Request, res: Response) => {
  try {
    res.json({ message: 'Delete media endpoint' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getSystemSettings = async (req: Request, res: Response) => {
  try {
    res.json({ message: 'Get system settings endpoint' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateSystemSettings = async (req: Request, res: Response) => {
  try {
    res.json({ message: 'Update system settings endpoint' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getSecurityLogs = async (req: Request, res: Response) => {
  try {
    res.json({ message: 'Get security logs endpoint' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getUserRoles = async (req: Request, res: Response) => {
  try {
    res.json({ message: 'Get user roles endpoint' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const createUserRole = async (req: Request, res: Response) => {
  try {
    res.json({ message: 'Create user role endpoint' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateUserRole = async (req: Request, res: Response) => {
  try {
    res.json({ message: 'Update user role endpoint' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteUserRole = async (req: Request, res: Response) => {
  try {
    res.json({ message: 'Delete user role endpoint' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};
