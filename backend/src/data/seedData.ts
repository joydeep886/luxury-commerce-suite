
import { db } from '../config/database';
import { categories, brands, products } from '../models/schema';
import bcrypt from 'bcryptjs';

export const seedDatabase = async () => {
  try {
    console.log('🌱 Seeding database...');

    // Seed Categories
    const categoryData = [
      {
        name: 'Women',
        slug: 'women',
        description: 'Elegant fashion for the modern woman',
        image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
        isActive: true,
        sortOrder: 1,
      },
      {
        name: 'Men',
        slug: 'men',
        description: 'Sophisticated style for the modern gentleman',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
        isActive: true,
        sortOrder: 2,
      },
      {
        name: 'Accessories',
        slug: 'accessories',
        description: 'The perfect finishing touch',
        image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
        isActive: true,
        sortOrder: 3,
      },
      {
        name: 'Jewelry',
        slug: 'jewelry',
        description: 'Timeless pieces for every occasion',
        image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
        isActive: true,
        sortOrder: 4,
      },
      {
        name: 'Beauty',
        slug: 'beauty',
        description: 'Premium beauty and skincare',
        image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
        isActive: true,
        sortOrder: 5,
      },
    ];

    const insertedCategories = await db.insert(categories).values(categoryData).returning();
    console.log('✅ Categories seeded');

    // Seed Brands
    const brandData = [
      { name: 'Luxuria Signature', slug: 'luxuria-signature', isActive: true },
      { name: 'Milano Crafters', slug: 'milano-crafters', isActive: true },
      { name: 'Chronos Elite', slug: 'chronos-elite', isActive: true },
      { name: 'Visionaire', slug: 'visionaire', isActive: true },
      { name: 'Heritage Knits', slug: 'heritage-knits', isActive: true },
      { name: 'Eternal Diamonds', slug: 'eternal-diamonds', isActive: true },
      { name: 'Artisan Footwear', slug: 'artisan-footwear', isActive: true },
      { name: 'Essence Luxe', slug: 'essence-luxe', isActive: true },
    ];

    const insertedBrands = await db.insert(brands).values(brandData).returning();
    console.log('✅ Brands seeded');

    // Seed Products
    const productData = [
      {
        name: 'Signature Silk Evening Dress',
        description: 'An exquisite silk evening dress that embodies elegance and sophistication. Crafted from the finest mulberry silk with intricate hand-sewn details, this dress is perfect for special occasions and formal events.',
        shortDescription: 'Elegant silk dress with hand-sewn details',
        price: '1299.99',
        originalPrice: '1599.99',
        sku: 'LUX-DRESS-001',
        categoryId: insertedCategories.find(c => c.slug === 'women')?.id,
        brandId: insertedBrands.find(b => b.slug === 'luxuria-signature')?.id,
        images: [
          'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
          'https://images.unsplash.com/photo-1566479179817-1a50a6b85ce3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        ],
        stock: 15,
        rating: '4.8',
        reviewCount: 124,
        isNew: true,
        isSale: true,
        isPopular: true,
        discount: 19,
        sizes: ['XS', 'S', 'M', 'L', 'XL'],
        colors: ['Black', 'Navy', 'Burgundy'],
        material: '100% Mulberry Silk',
        tags: ['evening wear', 'silk', 'formal', 'luxury'],
        adminScore: 5,
        status: 'active',
      },
      {
        name: 'Premium Italian Leather Handbag',
        description: 'Handcrafted in Italy using traditional techniques, this premium leather handbag combines timeless design with modern functionality.',
        shortDescription: 'Handcrafted Italian leather handbag',
        price: '899.99',
        sku: 'LUX-BAG-002',
        categoryId: insertedCategories.find(c => c.slug === 'accessories')?.id,
        brandId: insertedBrands.find(b => b.slug === 'milano-crafters')?.id,
        images: [
          'https://images.unsplash.com/photo-1584917865442-de89df76afd3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
          'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        ],
        stock: 28,
        rating: '4.9',
        reviewCount: 89,
        isNew: true,
        isPopular: true,
        colors: ['Black', 'Brown', 'Tan', 'Navy'],
        material: 'Full-grain Italian Leather',
        tags: ['handbag', 'leather', 'italian', 'luxury'],
        adminScore: 5,
        status: 'active',
      },
      {
        name: 'Swiss Luxury Watch Collection',
        description: 'A masterpiece of Swiss watchmaking, featuring automatic movement, sapphire crystal, and 18k gold accents.',
        shortDescription: 'Swiss automatic watch with gold accents',
        price: '2499.99',
        sku: 'LUX-WATCH-003',
        categoryId: insertedCategories.find(c => c.slug === 'jewelry')?.id,
        brandId: insertedBrands.find(b => b.slug === 'chronos-elite')?.id,
        images: [
          'https://images.unsplash.com/photo-1524592094714-0f0654e20314?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        ],
        stock: 8,
        rating: '4.7',
        reviewCount: 156,
        isPopular: true,
        colors: ['Silver', 'Gold', 'Rose Gold'],
        material: 'Stainless Steel, Sapphire Crystal',
        tags: ['watch', 'swiss', 'automatic', 'luxury'],
        adminScore: 4,
        status: 'active',
      },
      {
        name: 'Designer Aviator Sunglasses',
        description: 'Premium aviator sunglasses with polarized lenses and titanium frame. Offers 100% UV protection.',
        shortDescription: 'Polarized aviator sunglasses with titanium frame',
        price: '349.99',
        originalPrice: '449.99',
        sku: 'LUX-SUN-004',
        categoryId: insertedCategories.find(c => c.slug === 'accessories')?.id,
        brandId: insertedBrands.find(b => b.slug === 'visionaire')?.id,
        images: [
          'https://images.unsplash.com/photo-1511499767150-a48a237f0083?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        ],
        stock: 42,
        rating: '4.6',
        reviewCount: 203,
        isSale: true,
        discount: 22,
        colors: ['Gold/Brown', 'Silver/Gray', 'Black/Green'],
        material: 'Titanium, Polarized Glass',
        tags: ['sunglasses', 'aviator', 'polarized', 'titanium'],
        adminScore: 4,
        status: 'active',
      },
      {
        name: 'Cashmere Blend Sweater',
        description: 'Luxuriously soft cashmere blend sweater, perfect for both casual and formal occasions.',
        shortDescription: 'Premium cashmere blend crew neck sweater',
        price: '599.99',
        sku: 'LUX-SWEEP-005',
        categoryId: insertedCategories.find(c => c.slug === 'men')?.id,
        brandId: insertedBrands.find(b => b.slug === 'heritage-knits')?.id,
        images: [
          'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        ],
        stock: 35,
        rating: '4.8',
        reviewCount: 167,
        isNew: true,
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        colors: ['Charcoal', 'Navy', 'Cream', 'Burgundy'],
        material: '70% Cashmere, 30% Merino Wool',
        tags: ['sweater', 'cashmere', 'mens', 'luxury'],
        adminScore: 5,
        status: 'active',
      },
    ];

    await db.insert(products).values(productData);
    console.log('✅ Products seeded');

    console.log('🎉 Database seeding completed successfully!');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
};

// Run seeding if this file is executed directly
if (require.main === module) {
  seedDatabase()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}
