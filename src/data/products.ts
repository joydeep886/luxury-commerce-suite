
export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  images?: string[];
  category: string;
  subcategory?: string;
  brand: string;
  description: string;
  shortDescription: string;
  rating: number;
  reviewCount: number;
  isNew?: boolean;
  isSale?: boolean;
  isPopular?: boolean;
  discount?: number;
  sizes?: string[];
  colors?: string[];
  material?: string;
  sku: string;
  stock: number;
  tags: string[];
}

export const sampleProducts: Product[] = [
  {
    id: '1',
    name: 'Signature Silk Evening Dress',
    price: 1299.99,
    originalPrice: 1599.99,
    image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    images: [
      'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1566479179817-1a50a6b85ce3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1594633313593-bab3825d0caf?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
    ],
    category: 'Women',
    subcategory: 'Dresses',
    brand: 'Luxuria Signature',
    description: 'An exquisite silk evening dress that embodies elegance and sophistication. Crafted from the finest mulberry silk with intricate hand-sewn details, this dress is perfect for special occasions and formal events.',
    shortDescription: 'Elegant silk dress with hand-sewn details',
    rating: 4.8,
    reviewCount: 124,
    isNew: true,
    isSale: true,
    isPopular: true,
    discount: 19,
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Black', 'Navy', 'Burgundy'],
    material: '100% Mulberry Silk',
    sku: 'LUX-DRESS-001',
    stock: 15,
    tags: ['evening wear', 'silk', 'formal', 'luxury']
  },
  {
    id: '2',
    name: 'Premium Italian Leather Handbag',
    price: 899.99,
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    images: [
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
    ],
    category: 'Accessories',
    subcategory: 'Handbags',
    brand: 'Milano Crafters',
    description: 'Handcrafted in Italy using traditional techniques, this premium leather handbag combines timeless design with modern functionality. Features multiple compartments and adjustable straps.',
    shortDescription: 'Handcrafted Italian leather handbag',
    rating: 4.9,
    reviewCount: 89,
    isNew: true,
    isPopular: true,
    colors: ['Black', 'Brown', 'Tan', 'Navy'],
    material: 'Full-grain Italian Leather',
    sku: 'LUX-BAG-002',
    stock: 28,
    tags: ['handbag', 'leather', 'italian', 'luxury']
  },
  {
    id: '3',
    name: 'Swiss Luxury Watch Collection',
    price: 2499.99,
    image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    category: 'Jewelry',
    subcategory: 'Watches',
    brand: 'Chronos Elite',
    description: 'A masterpiece of Swiss watchmaking, featuring automatic movement, sapphire crystal, and 18k gold accents. Water resistant to 100 meters with a 42-hour power reserve.',
    shortDescription: 'Swiss automatic watch with gold accents',
    rating: 4.7,
    reviewCount: 156,
    isPopular: true,
    colors: ['Silver', 'Gold', 'Rose Gold'],
    material: 'Stainless Steel, Sapphire Crystal',
    sku: 'LUX-WATCH-003',
    stock: 8,
    tags: ['watch', 'swiss', 'automatic', 'luxury']
  },
  {
    id: '4',
    name: 'Designer Aviator Sunglasses',
    price: 349.99,
    originalPrice: 449.99,
    image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    category: 'Accessories',
    subcategory: 'Sunglasses',
    brand: 'Visionaire',
    description: 'Premium aviator sunglasses with polarized lenses and titanium frame. Offers 100% UV protection with anti-reflective coating for superior clarity.',
    shortDescription: 'Polarized aviator sunglasses with titanium frame',
    rating: 4.6,
    reviewCount: 203,
    isSale: true,
    discount: 22,
    colors: ['Gold/Brown', 'Silver/Gray', 'Black/Green'],
    material: 'Titanium, Polarized Glass',
    sku: 'LUX-SUN-004',
    stock: 42,
    tags: ['sunglasses', 'aviator', 'polarized', 'titanium']
  },
  {
    id: '5',
    name: 'Cashmere Blend Sweater',
    price: 599.99,
    image: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    category: 'Men',
    subcategory: 'Sweaters',
    brand: 'Heritage Knits',
    description: 'Luxuriously soft cashmere blend sweater, perfect for both casual and formal occasions. Features a classic crew neck design with ribbed cuffs and hem.',
    shortDescription: 'Premium cashmere blend crew neck sweater',
    rating: 4.8,
    reviewCount: 167,
    isNew: true,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Charcoal', 'Navy', 'Cream', 'Burgundy'],
    material: '70% Cashmere, 30% Merino Wool',
    sku: 'LUX-SWEEP-005',
    stock: 35,
    tags: ['sweater', 'cashmere', 'mens', 'luxury']
  },
  {
    id: '6',
    name: 'Diamond Stud Earrings',
    price: 1899.99,
    image: 'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    category: 'Jewelry',
    subcategory: 'Earrings',
    brand: 'Eternal Diamonds',
    description: 'Brilliant cut diamond stud earrings set in 14k white gold. Each diamond is hand-selected for exceptional clarity and brilliance, certified by GIA.',
    shortDescription: 'GIA certified diamond stud earrings',
    rating: 4.9,
    reviewCount: 94,
    isPopular: true,
    material: '14k White Gold, GIA Certified Diamonds',
    sku: 'LUX-EAR-006',
    stock: 12,
    tags: ['diamonds', 'earrings', 'gia', 'luxury']
  },
  {
    id: '7',
    name: 'Handcrafted Italian Leather Shoes',
    price: 789.99,
    originalPrice: 999.99,
    image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    category: 'Men',
    subcategory: 'Shoes',
    brand: 'Artisan Footwear',
    description: 'Handcrafted Oxford shoes made from premium Italian leather. Features traditional Goodyear welt construction for durability and comfort.',
    shortDescription: 'Handcrafted Italian leather Oxford shoes',
    rating: 4.7,
    reviewCount: 118,
    isSale: true,
    discount: 21,
    sizes: ['7', '7.5', '8', '8.5', '9', '9.5', '10', '10.5', '11', '12'],
    colors: ['Black', 'Brown', 'Cognac'],
    material: 'Full-grain Italian Leather',
    sku: 'LUX-SHOE-007',
    stock: 24,
    tags: ['shoes', 'leather', 'italian', 'oxford']
  },
  {
    id: '8',
    name: 'Luxury Perfume Collection Set',
    price: 299.99,
    image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    category: 'Beauty',
    subcategory: 'Fragrances',
    brand: 'Essence Luxe',
    description: 'A curated collection of three signature fragrances, each capturing a different mood and occasion. Includes travel-size bottles perfect for on-the-go luxury.',
    shortDescription: 'Three signature fragrances collection',
    rating: 4.8,
    reviewCount: 201,
    isNew: true,
    material: 'Premium Essential Oils',
    sku: 'LUX-PERF-008',
    stock: 67,
    tags: ['perfume', 'fragrance', 'collection', 'luxury']
  }
];

export const categories = [
  {
    id: 'women',
    name: 'Women',
    slug: 'women',
    description: 'Elegant fashion for the modern woman',
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    subcategories: ['Dresses', 'Tops', 'Bottoms', 'Outerwear', 'Shoes', 'Bags']
  },
  {
    id: 'men',
    name: 'Men',
    slug: 'men',
    description: 'Sophisticated style for the modern gentleman',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    subcategories: ['Shirts', 'Pants', 'Suits', 'Outerwear', 'Shoes', 'Accessories']
  },
  {
    id: 'accessories',
    name: 'Accessories',
    slug: 'accessories',
    description: 'The perfect finishing touch',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    subcategories: ['Handbags', 'Sunglasses', 'Belts', 'Scarves', 'Hats', 'Wallets']
  },
  {
    id: 'jewelry',
    name: 'Jewelry',
    slug: 'jewelry',
    description: 'Timeless pieces for every occasion',
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    subcategories: ['Rings', 'Necklaces', 'Earrings', 'Bracelets', 'Watches']
  },
  {
    id: 'beauty',
    name: 'Beauty',
    slug: 'beauty',
    description: 'Premium beauty and skincare',
    image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    subcategories: ['Skincare', 'Makeup', 'Fragrances', 'Hair Care', 'Tools']
  }
];

// Utility functions for product operations
export const getProductsByCategory = (categorySlug: string): Product[] => {
  return sampleProducts.filter(product => 
    product.category.toLowerCase() === categorySlug.toLowerCase()
  );
};

export const getProductById = (id: string): Product | undefined => {
  return sampleProducts.find(product => product.id === id);
};

export const getFeaturedProducts = (): Product[] => {
  return sampleProducts.filter(product => product.isPopular);
};

export const getNewProducts = (): Product[] => {
  return sampleProducts.filter(product => product.isNew);
};

export const getSaleProducts = (): Product[] => {
  return sampleProducts.filter(product => product.isSale);
};

export const searchProducts = (query: string): Product[] => {
  const searchTerm = query.toLowerCase();
  return sampleProducts.filter(product =>
    product.name.toLowerCase().includes(searchTerm) ||
    product.description.toLowerCase().includes(searchTerm) ||
    product.category.toLowerCase().includes(searchTerm) ||
    product.brand.toLowerCase().includes(searchTerm) ||
    product.tags.some(tag => tag.toLowerCase().includes(searchTerm))
  );
};
