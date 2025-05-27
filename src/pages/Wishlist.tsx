
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, ShoppingCart } from 'lucide-react';

const Wishlist = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Wishlist</h1>
      
      <div className="text-center py-12">
        <Heart className="mx-auto h-24 w-24 text-gray-300 mb-4" />
        <h2 className="text-xl font-semibold text-gray-600 mb-2">Your wishlist is empty</h2>
        <p className="text-gray-500 mb-6">Save items you love to your wishlist</p>
        <Button>
          <ShoppingCart className="mr-2 h-4 w-4" />
          Continue Shopping
        </Button>
      </div>
    </div>
  );
};

export default Wishlist;
