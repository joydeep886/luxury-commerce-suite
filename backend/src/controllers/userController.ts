
import { Request, Response } from 'express';
import { db } from '../config/database';
import { users, userAddresses, wishlist, products } from '../models/schema';
import { eq, desc } from 'drizzle-orm';
import { z } from 'zod';

const updateProfileSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  phone: z.string().optional(),
});

const addressSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  company: z.string().optional(),
  address1: z.string().min(1),
  address2: z.string().optional(),
  city: z.string().min(1),
  state: z.string().min(1),
  zipCode: z.string().min(1),
  country: z.string().min(1),
  phone: z.string().optional(),
  isDefault: z.boolean().optional().default(false),
});

export const updateProfile = async (req: any, res: Response) => {
  try {
    const userId = req.user.id;
    const profileData = updateProfileSchema.parse(req.body);

    const updatedUser = await db.update(users)
      .set({
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        phone: profileData.phone,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId))
      .returning({
        id: users.id,
        email: users.email,
        firstName: users.firstName,
        lastName: users.lastName,
        phone: users.phone,
      });

    res.json({
      message: 'Profile updated successfully',
      user: updatedUser[0],
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid profile data', details: error.errors });
    }
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getUserAddresses = async (req: any, res: Response) => {
  try {
    const userId = req.user.id;

    const addresses = await db.select()
      .from(userAddresses)
      .where(eq(userAddresses.userId, userId))
      .orderBy(desc(userAddresses.isDefault), desc(userAddresses.createdAt));

    res.json({ addresses });
  } catch (error) {
    console.error('Get user addresses error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const addAddress = async (req: any, res: Response) => {
  try {
    const userId = req.user.id;
    const addressData = addressSchema.parse(req.body);

    // If this is set as default, remove default from other addresses
    if (addressData.isDefault) {
      await db.update(userAddresses)
        .set({ isDefault: false })
        .where(eq(userAddresses.userId, userId));
    }

    const newAddress = await db.insert(userAddresses).values({
      ...addressData,
      userId,
    }).returning();

    res.status(201).json({
      message: 'Address added successfully',
      address: newAddress[0],
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid address data', details: error.errors });
    }
    console.error('Add address error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateAddress = async (req: any, res: Response) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const addressData = addressSchema.parse(req.body);

    // Verify address belongs to user
    const existingAddress = await db.select()
      .from(userAddresses)
      .where(eq(userAddresses.id, id))
      .limit(1);

    if (!existingAddress.length || existingAddress[0].userId !== userId) {
      return res.status(404).json({ error: 'Address not found' });
    }

    // If this is set as default, remove default from other addresses
    if (addressData.isDefault) {
      await db.update(userAddresses)
        .set({ isDefault: false })
        .where(eq(userAddresses.userId, userId));
    }

    const updatedAddress = await db.update(userAddresses)
      .set(addressData)
      .where(eq(userAddresses.id, id))
      .returning();

    res.json({
      message: 'Address updated successfully',
      address: updatedAddress[0],
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid address data', details: error.errors });
    }
    console.error('Update address error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteAddress = async (req: any, res: Response) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    // Verify address belongs to user
    const existingAddress = await db.select()
      .from(userAddresses)
      .where(eq(userAddresses.id, id))
      .limit(1);

    if (!existingAddress.length || existingAddress[0].userId !== userId) {
      return res.status(404).json({ error: 'Address not found' });
    }

    await db.delete(userAddresses).where(eq(userAddresses.id, id));

    res.json({ message: 'Address deleted successfully' });
  } catch (error) {
    console.error('Delete address error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getWishlist = async (req: any, res: Response) => {
  try {
    const userId = req.user.id;

    const wishlistItems = await db.select({
      id: wishlist.id,
      productId: products.id,
      productName: products.name,
      productPrice: products.price,
      productImage: products.images,
      createdAt: wishlist.createdAt,
    })
      .from(wishlist)
      .leftJoin(products, eq(wishlist.productId, products.id))
      .where(eq(wishlist.userId, userId))
      .orderBy(desc(wishlist.createdAt));

    res.json({ wishlist: wishlistItems });
  } catch (error) {
    console.error('Get wishlist error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const addToWishlist = async (req: any, res: Response) => {
  try {
    const userId = req.user.id;
    const { productId } = req.body;

    // Check if already in wishlist
    const existing = await db.select()
      .from(wishlist)
      .where(eq(wishlist.userId, userId) && eq(wishlist.productId, productId))
      .limit(1);

    if (existing.length > 0) {
      return res.status(400).json({ error: 'Product already in wishlist' });
    }

    await db.insert(wishlist).values({
      userId,
      productId,
    });

    res.status(201).json({ message: 'Product added to wishlist' });
  } catch (error) {
    console.error('Add to wishlist error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const removeFromWishlist = async (req: any, res: Response) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;

    await db.delete(wishlist)
      .where(eq(wishlist.userId, userId) && eq(wishlist.productId, productId));

    res.json({ message: 'Product removed from wishlist' });
  } catch (error) {
    console.error('Remove from wishlist error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
