import { pgTable, uuid, varchar, text, decimal, integer, boolean, timestamp, jsonb, pgEnum } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Enums
export const userRoleEnum = pgEnum('user_role', ['customer', 'admin']);
export const orderStatusEnum = pgEnum('order_status', ['pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled']);
export const paymentStatusEnum = pgEnum('payment_status', ['unpaid', 'paid', 'refunded']);
export const productStatusEnum = pgEnum('product_status', ['active', 'draft', 'archived']);
export const couponTypeEnum = pgEnum('coupon_type', ['percentage', 'fixed']);
export const layoutTypeEnum = pgEnum('layout_type', ['grid', 'list', 'mixed']);
export const loyaltyTierEnum = pgEnum('loyalty_tier', ['bronze', 'silver', 'gold', 'platinum']);

// Users Table - Enhanced with loyalty program
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: varchar('email', { length: 255 }).unique().notNull(),
  password: varchar('password', { length: 255 }).notNull(),
  firstName: varchar('first_name', { length: 100 }).notNull(),
  lastName: varchar('last_name', { length: 100 }).notNull(),
  phone: varchar('phone', { length: 20 }),
  role: userRoleEnum('role').default('customer').notNull(),
  isVerified: boolean('is_verified').default(false).notNull(),
  loyaltyPoints: integer('loyalty_points').default(0),
  loyaltyTier: loyaltyTierEnum('loyalty_tier').default('bronze'),
  totalSpent: decimal('total_spent', { precision: 10, scale: 2 }).default('0'),
  lastLoginAt: timestamp('last_login_at'),
  preferences: jsonb('preferences').$type<any>(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Categories Table
export const categories = pgTable('categories', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 100 }).notNull(),
  slug: varchar('slug', { length: 100 }).unique().notNull(),
  description: text('description'),
  image: varchar('image', { length: 500 }),
  bannerImage: varchar('banner_image', { length: 500 }),
  parentId: uuid('parent_id'),
  sortOrder: integer('sort_order').default(0),
  isActive: boolean('is_active').default(true).notNull(),
  seoTitle: varchar('seo_title', { length: 200 }),
  seoDescription: text('seo_description'),
  customPageTitle: varchar('custom_page_title', { length: 200 }),
  customPageDescription: text('custom_page_description'),
  layoutType: layoutTypeEnum('layout_type').default('grid'),
  productsPerPage: integer('products_per_page').default(24),
  showSubcategories: boolean('show_subcategories').default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Brands Table
export const brands = pgTable('brands', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 100 }).notNull(),
  slug: varchar('slug', { length: 100 }).unique().notNull(),
  description: text('description'),
  logo: varchar('logo', { length: 500 }),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Products Table
export const products = pgTable('products', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 200 }).notNull(),
  description: text('description'),
  shortDescription: varchar('short_description', { length: 500 }),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  originalPrice: decimal('original_price', { precision: 10, scale: 2 }),
  sku: varchar('sku', { length: 100 }).unique().notNull(),
  categoryId: uuid('category_id').notNull(),
  brandId: uuid('brand_id').notNull(),
  images: jsonb('images').$type<string[]>(),
  variants: jsonb('variants').$type<any>(),
  stock: integer('stock').default(0).notNull(),
  rating: decimal('rating', { precision: 3, scale: 2 }).default('0'),
  reviewCount: integer('review_count').default(0),
  isNew: boolean('is_new').default(false),
  isSale: boolean('is_sale').default(false),
  isPopular: boolean('is_popular').default(false),
  discount: integer('discount').default(0),
  sizes: jsonb('sizes').$type<string[]>(),
  colors: jsonb('colors').$type<string[]>(),
  material: varchar('material', { length: 200 }),
  tags: jsonb('tags').$type<string[]>(),
  adminScore: integer('admin_score').default(1),
  status: productStatusEnum('status').default('active').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Orders Table - Enhanced with loyalty points
export const orders = pgTable('orders', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id'),
  guestEmail: varchar('guest_email', { length: 255 }),
  orderNumber: varchar('order_number', { length: 50 }).unique().notNull(),
  status: orderStatusEnum('status').default('pending').notNull(),
  subtotal: decimal('subtotal', { precision: 10, scale: 2 }).notNull(),
  taxAmount: decimal('tax_amount', { precision: 10, scale: 2 }).default('0'),
  shippingAmount: decimal('shipping_amount', { precision: 10, scale: 2 }).default('0'),
  discountAmount: decimal('discount_amount', { precision: 10, scale: 2 }).default('0'),
  loyaltyPointsUsed: integer('loyalty_points_used').default(0),
  loyaltyPointsEarned: integer('loyalty_points_earned').default(0),
  totalAmount: decimal('total_amount', { precision: 10, scale: 2 }).notNull(),
  currency: varchar('currency', { length: 3 }).default('USD'),
  paymentStatus: paymentStatusEnum('payment_status').default('unpaid'),
  paymentMethod: varchar('payment_method', { length: 50 }),
  shippingAddress: jsonb('shipping_address').$type<any>(),
  billingAddress: jsonb('billing_address').$type<any>(),
  trackingToken: varchar('tracking_token', { length: 100 }),
  trackingNumber: varchar('tracking_number', { length: 100 }),
  shippedAt: timestamp('shipped_at'),
  deliveredAt: timestamp('delivered_at'),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Order Items Table
export const orderItems = pgTable('order_items', {
  id: uuid('id').primaryKey().defaultRandom(),
  orderId: uuid('order_id').notNull(),
  productId: uuid('product_id').notNull(),
  quantity: integer('quantity').notNull(),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  totalPrice: decimal('total_price', { precision: 10, scale: 2 }).notNull(),
  productName: varchar('product_name', { length: 200 }).notNull(),
  productImage: varchar('product_image', { length: 500 }),
  variantInfo: jsonb('variant_info').$type<any>(),
});

// Reviews Table
export const reviews = pgTable('reviews', {
  id: uuid('id').primaryKey().defaultRandom(),
  productId: uuid('product_id').notNull(),
  userId: uuid('user_id').notNull(),
  rating: integer('rating').notNull(),
  title: varchar('title', { length: 200 }),
  content: text('content'),
  isVerified: boolean('is_verified').default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Coupons Table
export const coupons = pgTable('coupons', {
  id: uuid('id').primaryKey().defaultRandom(),
  code: varchar('code', { length: 50 }).unique().notNull(),
  type: couponTypeEnum('type').notNull(),
  value: decimal('value', { precision: 10, scale: 2 }).notNull(),
  minimumAmount: decimal('minimum_amount', { precision: 10, scale: 2 }).default('0'),
  usageLimit: integer('usage_limit'),
  usedCount: integer('used_count').default(0),
  isFirstTimeOnly: boolean('is_first_time_only').default(false),
  applicableCategories: jsonb('applicable_categories').$type<string[]>(),
  startsAt: timestamp('starts_at'),
  expiresAt: timestamp('expires_at'),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Recently Viewed Products
export const recentlyViewed = pgTable('recently_viewed', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull(),
  productId: uuid('product_id').notNull(),
  viewedAt: timestamp('viewed_at').defaultNow().notNull(),
});

// Product Views Analytics
export const productViews = pgTable('product_views', {
  id: uuid('id').primaryKey().defaultRandom(),
  productId: uuid('product_id').notNull(),
  sessionId: varchar('session_id', { length: 255 }),
  userId: uuid('user_id'),
  ipAddress: varchar('ip_address', { length: 45 }),
  userAgent: text('user_agent'),
  referrer: text('referrer'),
  viewedAt: timestamp('viewed_at').defaultNow().notNull(),
});

// Inventory Tracking
export const inventoryLogs = pgTable('inventory_logs', {
  id: uuid('id').primaryKey().defaultRandom(),
  productId: uuid('product_id').notNull(),
  changeType: varchar('change_type', { length: 20 }).notNull(), // 'sale', 'restock', 'adjustment'
  quantityBefore: integer('quantity_before').notNull(),
  quantityAfter: integer('quantity_after').notNull(),
  quantityChanged: integer('quantity_changed').notNull(),
  reason: text('reason'),
  orderId: uuid('order_id'),
  userId: uuid('user_id'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Newsletter Subscriptions
export const newsletterSubscriptions = pgTable('newsletter_subscriptions', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: varchar('email', { length: 255 }).unique().notNull(),
  firstName: varchar('first_name', { length: 100 }),
  lastName: varchar('last_name', { length: 100 }),
  isActive: boolean('is_active').default(true),
  preferences: jsonb('preferences').$type<any>(),
  subscribedAt: timestamp('subscribed_at').defaultNow().notNull(),
  unsubscribedAt: timestamp('unsubscribed_at'),
});

// Wishlist Table
export const wishlist = pgTable('wishlist', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull(),
  productId: uuid('product_id').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// User Addresses Table
export const userAddresses = pgTable('user_addresses', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull(),
  firstName: varchar('first_name', { length: 100 }).notNull(),
  lastName: varchar('last_name', { length: 100 }).notNull(),
  company: varchar('company', { length: 100 }),
  address1: varchar('address1', { length: 200 }).notNull(),
  address2: varchar('address2', { length: 200 }),
  city: varchar('city', { length: 100 }).notNull(),
  state: varchar('state', { length: 100 }).notNull(),
  zipCode: varchar('zip_code', { length: 20 }).notNull(),
  country: varchar('country', { length: 100 }).notNull(),
  phone: varchar('phone', { length: 20 }),
  isDefault: boolean('is_default').default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  orders: many(orders),
  reviews: many(reviews),
  wishlist: many(wishlist),
  addresses: many(userAddresses),
  recentlyViewed: many(recentlyViewed),
}));

export const categoriesRelations = relations(categories, ({ many }) => ({
  products: many(products),
}));

export const brandsRelations = relations(brands, ({ many }) => ({
  products: many(products),
}));

export const productsRelations = relations(products, ({ one, many }) => ({
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
  brand: one(brands, {
    fields: [products.brandId],
    references: [brands.id],
  }),
  reviews: many(reviews),
  orderItems: many(orderItems),
  wishlist: many(wishlist),
}));

export const ordersRelations = relations(orders, ({ one, many }) => ({
  user: one(users, {
    fields: [orders.userId],
    references: [users.id],
  }),
  items: many(orderItems),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  product: one(products, {
    fields: [orderItems.productId],
    references: [products.id],
  }),
}));

export const reviewsRelations = relations(reviews, ({ one }) => ({
  product: one(products, {
    fields: [reviews.productId],
    references: [products.id],
  }),
  user: one(users, {
    fields: [reviews.userId],
    references: [users.id],
  }),
}));

export const wishlistRelations = relations(wishlist, ({ one }) => ({
  user: one(users, {
    fields: [wishlist.userId],
    references: [users.id],
  }),
  product: one(products, {
    fields: [wishlist.productId],
    references: [products.id],
  }),
}));

export const userAddressesRelations = relations(userAddresses, ({ one }) => ({
  user: one(users, {
    fields: [userAddresses.userId],
    references: [users.id],
  }),
}));

export const recentlyViewedRelations = relations(recentlyViewed, ({ one }) => ({
  user: one(users, {
    fields: [recentlyViewed.userId],
    references: [users.id],
  }),
  product: one(products, {
    fields: [recentlyViewed.productId],
    references: [products.id],
  }),
}));

export const productViewsRelations = relations(productViews, ({ one }) => ({
  product: one(products, {
    fields: [productViews.productId],
    references: [products.id],
  }),
  user: one(users, {
    fields: [productViews.userId],
    references: [users.id],
  }),
}));

export const inventoryLogsRelations = relations(inventoryLogs, ({ one }) => ({
  product: one(products, {
    fields: [inventoryLogs.productId],
    references: [products.id],
  }),
  order: one(orders, {
    fields: [inventoryLogs.orderId],
    references: [orders.id],
  }),
  user: one(users, {
    fields: [inventoryLogs.userId],
    references: [users.id],
  }),
}));
