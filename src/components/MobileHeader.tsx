
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Menu, Search, ShoppingBag, User, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

const MobileHeader = () => {
  const [isOpen, setIsOpen] = useState(false);
  const cartItemCount = 3; // Example count
  const wishlistCount = 5; // Example count

  const menuItems = [
    { label: 'Home', href: '/' },
    { label: 'Women', href: '/category/women' },
    { label: 'Men', href: '/category/men' },
    { label: 'Accessories', href: '/category/accessories' },
    { label: 'New Arrivals', href: '/new' },
    { label: 'Sale', href: '/sale' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-background border-b md:hidden">
      <div className="flex items-center justify-between p-4">
        {/* Menu Button */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="sm" className="p-2">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-80">
            <div className="space-y-6 pt-6">
              <div className="space-y-4">
                {menuItems.map((item) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    className="block text-lg font-medium hover:text-primary transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
              
              <div className="border-t pt-6 space-y-4">
                <Link
                  to="/login"
                  className="flex items-center gap-3 text-lg"
                  onClick={() => setIsOpen(false)}
                >
                  <User className="h-5 w-5" />
                  Sign In
                </Link>
                <Link
                  to="/wishlist"
                  className="flex items-center gap-3 text-lg"
                  onClick={() => setIsOpen(false)}
                >
                  <Heart className="h-5 w-5" />
                  Wishlist
                  {wishlistCount > 0 && (
                    <Badge variant="secondary" className="text-xs">
                      {wishlistCount}
                    </Badge>
                  )}
                </Link>
              </div>
            </div>
          </SheetContent>
        </Sheet>

        {/* Logo */}
        <Link to="/" className="flex-1 text-center">
          <h1 className="text-xl font-luxury font-bold">Luxuria</h1>
        </Link>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="p-2">
            <Search className="h-5 w-5" />
          </Button>
          
          <Link to="/cart">
            <Button variant="ghost" size="sm" className="p-2 relative">
              <ShoppingBag className="h-5 w-5" />
              {cartItemCount > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                >
                  {cartItemCount}
                </Badge>
              )}
            </Button>
          </Link>
        </div>
      </div>

      {/* Mobile Search Bar (Optional) */}
      <div className="px-4 pb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <input
            type="text"
            placeholder="Search products..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
      </div>
    </header>
  );
};

export default MobileHeader;
