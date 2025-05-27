
import { db } from '../config/database';
import { users, orders } from '../models/schema';
import { eq, sql } from 'drizzle-orm';

export interface LoyaltyProgram {
  id: string;
  userId: string;
  points: number;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  totalSpent: number;
  createdAt: Date;
  updatedAt: Date;
}

export class LoyaltyService {
  private readonly POINTS_PER_DOLLAR = 10;
  private readonly TIER_THRESHOLDS = {
    bronze: 0,
    silver: 1000,
    gold: 5000,
    platinum: 15000
  };

  async addPoints(userId: string, orderAmount: number, orderType: 'purchase' | 'referral' | 'review' = 'purchase') {
    let points = 0;
    
    switch (orderType) {
      case 'purchase':
        points = Math.floor(orderAmount * this.POINTS_PER_DOLLAR);
        break;
      case 'referral':
        points = 500; // Fixed bonus for referrals
        break;
      case 'review':
        points = 50; // Fixed bonus for reviews
        break;
    }

    // Update user's loyalty points
    const currentUser = await db.select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (currentUser.length > 0) {
      const newPoints = (currentUser[0].loyaltyPoints || 0) + points;
      const newTier = this.calculateTier(newPoints);

      await db.update(users)
        .set({
          loyaltyPoints: newPoints,
          loyaltyTier: newTier,
          updatedAt: new Date()
        })
        .where(eq(users.id, userId));

      return { points, newPoints, tier: newTier };
    }

    return null;
  }

  async redeemPoints(userId: string, pointsToRedeem: number) {
    const user = await db.select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (user.length === 0 || (user[0].loyaltyPoints || 0) < pointsToRedeem) {
      throw new Error('Insufficient points');
    }

    const newPoints = (user[0].loyaltyPoints || 0) - pointsToRedeem;
    const discountAmount = pointsToRedeem / 100; // 100 points = $1

    await db.update(users)
      .set({
        loyaltyPoints: newPoints,
        updatedAt: new Date()
      })
      .where(eq(users.id, userId));

    return { 
      remainingPoints: newPoints, 
      discountAmount,
      message: `You saved $${discountAmount.toFixed(2)} using ${pointsToRedeem} points!`
    };
  }

  private calculateTier(points: number): 'bronze' | 'silver' | 'gold' | 'platinum' {
    if (points >= this.TIER_THRESHOLDS.platinum) return 'platinum';
    if (points >= this.TIER_THRESHOLDS.gold) return 'gold';
    if (points >= this.TIER_THRESHOLDS.silver) return 'silver';
    return 'bronze';
  }

  async getLoyaltyStatus(userId: string) {
    const user = await db.select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (user.length === 0) {
      return null;
    }

    const points = user[0].loyaltyPoints || 0;
    const tier = user[0].loyaltyTier || 'bronze';
    const nextTier = this.getNextTier(tier);
    const pointsToNextTier = nextTier ? this.TIER_THRESHOLDS[nextTier] - points : 0;

    return {
      points,
      tier,
      nextTier,
      pointsToNextTier,
      benefits: this.getTierBenefits(tier)
    };
  }

  private getNextTier(currentTier: string) {
    const tiers = ['bronze', 'silver', 'gold', 'platinum'];
    const currentIndex = tiers.indexOf(currentTier);
    return currentIndex < tiers.length - 1 ? tiers[currentIndex + 1] : null;
  }

  private getTierBenefits(tier: string) {
    const benefits = {
      bronze: ['10 points per $1 spent', 'Birthday discount'],
      silver: ['15 points per $1 spent', 'Free shipping', 'Early access to sales'],
      gold: ['20 points per $1 spent', 'Free shipping', 'Priority customer service', 'Exclusive events'],
      platinum: ['25 points per $1 spent', 'Free shipping', 'VIP customer service', 'Personal shopper', 'Luxury gift wrapping']
    };

    return benefits[tier as keyof typeof benefits] || benefits.bronze;
  }
}

export const loyaltyService = new LoyaltyService();
