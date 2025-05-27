
import React from 'react';
import { Button } from '@/components/ui/button';
import ProductCard from './ProductCard';

const FeaturedProducts = () => {
  const featuredProducts = [
    {
      id: '1',
      name: 'Signature Silk Dress',
      price: 1299.99,
      originalPrice: 1599.99,
      image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      category: 'Women\'s Fashion',
      rating: 4.8,
      isNew: true,
      isSale: true,
      discount: 19
    },
    {
      id: '2',
      name: 'Premium Leather Handbag',
      price: 899.99,
      image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      category: 'Accessories',
      rating: 4.9,
      isNew: true
    },
    {
      id: '3',
      name: 'Luxury Watch Collection',
      price: 2499.99,
      image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      category: 'Jewelry',
      rating: 4.7
    },
    {
      id: '4',
      name: 'Designer Sunglasses',
      price: 349.99,
      originalPrice: 449.99,
      image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      category: 'Accessories',
      rating: 4.6,
      isSale: true,
      discount: 22
    },
    {
      id: '5',
      name: 'Cashmere Sweater',
      price: 599.99,
      image: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      category: 'Men\'s Fashion',
      rating: 4.8,
      isNew: true
    },
    {
      id: '6',
      name: 'Diamond Earrings',
      price: 1899.99,
      image: 'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      category: 'Jewelry',
      rating: 4.9
    },
    {
      id: '7',
      name: 'Italian Leather Shoes',
      price: 789.99,
      originalPrice: 999.99,
      image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      category: 'Men\'s Fashion',
      rating: 4.7,
      isSale: true,
      discount: 21
    },
    {
      id: '8',
      name: 'Luxury Perfume Set',
      price: 299.99,
      image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      category: 'Beauty',
      rating: 4.8,
      isNew: true
    }
  ];

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-luxury font-bold mb-4">
            Featured <span className="luxury-text-gradient">Collection</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Discover our handpicked selection of premium products, curated for the discerning individual who values quality and elegance.
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
          {featuredProducts.map((product, index) => (
            <div 
              key={product.id}
              className="animate-scale-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center">
          <Button 
            variant="outline" 
            size="lg"
            className="px-8 py-3 border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300"
          >
            View All Products
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
