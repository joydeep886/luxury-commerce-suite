
import { Request, Response } from 'express';
import { db } from '../config/database';
import { orders, orderItems, products } from '../models/schema';
import { eq, desc } from 'drizzle-orm';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';

const createOrderSchema = z.object({
  items: z.array(z.object({
    productId: z.string(),
    quantity: z.number().min(1),
    variantInfo: z.any().optional(),
  })),
  shippingAddress: z.object({
    firstName: z.string(),
    lastName: z.string(),
    address1: z.string(),
    address2: z.string().optional(),
    city: z.string(),
    state: z.string(),
    zipCode: z.string(),
    country: z.string(),
    phone: z.string().optional(),
  }),
  billingAddress: z.object({
    firstName: z.string(),
    lastName: z.string(),
    address1: z.string(),
    address2: z.string().optional(),
    city: z.string(),
    state: z.string(),
    zipCode: z.string(),
    country: z.string(),
    phone: z.string().optional(),
  }).optional(),
  paymentMethod: z.string(),
  couponCode: z.string().optional(),
  guestEmail: z.string().email().optional(),
});

export const createOrder = async (req: any, res: Response) => {
  try {
    const orderData = createOrderSchema.parse(req.body);
    const userId = req.user?.id;
    const isGuest = !userId;

    if (isGuest && !orderData.guestEmail) {
      return res.status(400).json({ error: 'Guest email is required for guest orders' });
    }

    // Get product details and calculate totals
    let subtotal = 0;
    const orderItemsData = [];

    for (const item of orderData.items) {
      const product = await db.select().from(products).where(eq(products.id, item.productId)).limit(1);
      
      if (!product.length) {
        return res.status(400).json({ error: `Product ${item.productId} not found` });
      }

      if (product[0].stock < item.quantity) {
        return res.status(400).json({ error: `Insufficient stock for ${product[0].name}` });
      }

      const itemTotal = Number(product[0].price) * item.quantity;
      subtotal += itemTotal;

      orderItemsData.push({
        productId: item.productId,
        quantity: item.quantity,
        price: product[0].price,
        totalPrice: itemTotal.toString(),
        productName: product[0].name,
        productImage: Array.isArray(product[0].images) ? product[0].images[0] : null,
        variantInfo: item.variantInfo,
      });
    }

    // Calculate taxes and shipping
    const taxRate = 0.08; // 8% tax
    const taxAmount = subtotal * taxRate;
    const shippingAmount = subtotal > 500 ? 0 : 25; // Free shipping over $500
    const totalAmount = subtotal + taxAmount + shippingAmount;

    // Generate order number
    const orderNumber = `LUX-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    const trackingToken = isGuest ? uuidv4() : null;

    // Create order
    const newOrder = await db.insert(orders).values({
      userId: userId || null,
      guestEmail: orderData.guestEmail || null,
      orderNumber,
      subtotal: subtotal.toString(),
      taxAmount: taxAmount.toString(),
      shippingAmount: shippingAmount.toString(),
      totalAmount: totalAmount.toString(),
      shippingAddress: orderData.shippingAddress,
      billingAddress: orderData.billingAddress || orderData.shippingAddress,
      paymentMethod: orderData.paymentMethod,
      trackingToken,
    }).returning();

    // Create order items
    const itemsWithOrderId = orderItemsData.map(item => ({
      ...item,
      orderId: newOrder[0].id,
    }));

    await db.insert(orderItems).values(itemsWithOrderId);

    // Update product stock
    for (const item of orderData.items) {
      await db.update(products)
        .set({ stock: sql`stock - ${item.quantity}` })
        .where(eq(products.id, item.productId));
    }

    res.status(201).json({
      message: 'Order created successfully',
      order: newOrder[0],
      trackingToken: trackingToken,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid order data', details: error.errors });
    }
    console.error('Create order error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getUserOrders = async (req: any, res: Response) => {
  try {
    const userId = req.user.id;

    const userOrders = await db.select({
      id: orders.id,
      orderNumber: orders.orderNumber,
      status: orders.status,
      totalAmount: orders.totalAmount,
      paymentStatus: orders.paymentStatus,
      createdAt: orders.createdAt,
    })
      .from(orders)
      .where(eq(orders.userId, userId))
      .orderBy(desc(orders.createdAt));

    res.json({ orders: userOrders });
  } catch (error) {
    console.error('Get user orders error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getOrder = async (req: any, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    let order;
    if (userId) {
      order = await db.select().from(orders).where(eq(orders.id, id)).limit(1);
      if (!order.length || order[0].userId !== userId) {
        return res.status(404).json({ error: 'Order not found' });
      }
    } else {
      // Guest order tracking would be implemented here
      return res.status(401).json({ error: 'Authentication required' });
    }

    // Get order items
    const items = await db.select({
      id: orderItems.id,
      productId: orderItems.productId,
      quantity: orderItems.quantity,
      price: orderItems.price,
      totalPrice: orderItems.totalPrice,
      productName: orderItems.productName,
      productImage: orderItems.productImage,
      variantInfo: orderItems.variantInfo,
    })
      .from(orderItems)
      .where(eq(orderItems.orderId, id));

    res.json({
      order: order[0],
      items,
    });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
