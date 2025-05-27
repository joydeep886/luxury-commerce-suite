
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Grid, List, Filter, X, ChevronDown } from 'lucide-react';
import { useParams, Link } from 'react-router-dom';
import ProductCard from '@/components/ProductCard';

interface CategoryData {
  id: string;
  name: string;
  slug: string;
  description: string;
  bannerImage: string;
  customPageTitle: string;
  customPageDescription: string;
  layoutType: 'grid' | 'list' | 'mixed';
  productsPerPage: number;
  showSubcategories: boolean;
  subcategories: Array<{
    id: string;
    name: string;
    slug: string;
    productCount: number;
  }>;
}

const CategoryPage = () => {
  const { slug } = useParams();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('relevance');
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // Mock category data - in real app this would come from API
  const categoryData: CategoryData = {
    id: '1',
    name: "Women's Fashion",
    slug: slug || 'womens-fashion',
    description: 'Discover our exclusive collection of premium women\'s fashion, featuring elegant designs and luxury materials.',
    bannerImage: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    customPageTitle: 'Premium Women\'s Fashion Collection',
    customPageDescription: 'Explore our curated selection of luxury women\'s clothing, accessories, and shoes from the world\'s finest designers.',
    layoutType: 'grid',
    productsPerPage: 24,
    showSubcategories: true,
    subcategories: [
      { id: '1', name: 'Dresses', slug: 'dresses', productCount: 156 },
      { id: '2', name: 'Tops', slug: 'tops', productCount: 89 },
      { id: '3', name: 'Bottoms', slug: 'bottoms', productCount: 67 },
      { id: '4', name: 'Outerwear', slug: 'outerwear', productCount: 43 },
      { id: '5', name: 'Accessories', slug: 'accessories', productCount: 124 }
    ]
  };

  const products = [
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
      name: 'Premium Cashmere Sweater',
      price: 899.99,
      image: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      category: 'Women\'s Fashion',
      rating: 4.9,
      isNew: true
    },
    {
      id: '3',
      name: 'Designer Blazer',
      price: 799.99,
      image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      category: 'Women\'s Fashion',
      rating: 4.7
    },
    {
      id: '4',
      name: 'Luxury Handbag',
      price: 1199.99,
      image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      category: 'Women\'s Fashion',
      rating: 4.8
    },
    {
      id: '5',
      name: 'Elegant Evening Gown',
      price: 1899.99,
      image: 'https://images.unsplash.com/photo-1566479179817-c2d7b0bb0eee?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      category: 'Women\'s Fashion',
      rating: 4.9
    },
    {
      id: '6',
      name: 'Luxury Scarf',
      price: 299.99,
      originalPrice: 399.99,
      image: 'https://images.unsplash.com/photo-1583744946564-b52ac1c389c8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      category: 'Women\'s Fashion',
      rating: 4.6,
      isSale: true,
      discount: 25
    }
  ];

  const brands = ['Luxuria', 'Elegance', 'Premium', 'Designer Co', 'Fashion House'];
  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  const colors = ['Black', 'White', 'Navy', 'Beige', 'Red', 'Pink', 'Blue', 'Green'];

  const toggleBrand = (brand: string) => {
    setSelectedBrands(prev => 
      prev.includes(brand) 
        ? prev.filter(b => b !== brand)
        : [...prev, brand]
    );
  };

  const toggleSize = (size: string) => {
    setSelectedSizes(prev => 
      prev.includes(size) 
        ? prev.filter(s => s !== size)
        : [...prev, size]
    );
  };

  const toggleColor = (color: string) => {
    setSelectedColors(prev => 
      prev.includes(color) 
        ? prev.filter(c => c !== color)
        : [...prev, color]
    );
  };

  const clearFilters = () => {
    setPriceRange([0, 5000]);
    setSelectedBrands([]);
    setSelectedSizes([]);
    setSelectedColors([]);
  };

  const activeFiltersCount = selectedBrands.length + selectedSizes.length + selectedColors.length + 
    (priceRange[0] > 0 || priceRange[1] < 5000 ? 1 : 0);

  return (
    <div className="min-h-screen bg-background">
      {/* Category Header */}
      <div className="relative h-64 md:h-80 overflow-hidden">
        <img
          src={categoryData.bannerImage}
          alt={categoryData.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white max-w-4xl mx-auto px-4">
            <h1 className="text-4xl md:text-6xl font-luxury font-bold mb-4">
              {categoryData.customPageTitle}
            </h1>
            <p className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto">
              {categoryData.customPageDescription}
            </p>
          </div>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="container mx-auto px-4 py-4">
        <div className="text-sm text-muted-foreground">
          <Link to="/" className="hover:text-primary">Home</Link>
          {' / '}
          <span>{categoryData.name}</span>
        </div>
      </div>

      {/* Subcategories */}
      {categoryData.showSubcategories && (
        <div className="container mx-auto px-4 mb-8">
          <div className="flex flex-wrap gap-3">
            {categoryData.subcategories.map((subcategory) => (
              <Link key={subcategory.id} to={`/category/${subcategory.slug}`}>
                <Card className="luxury-card hover:bg-muted/50 transition-colors cursor-pointer">
                  <CardContent className="p-4">
                    <div className="text-center">
                      <h3 className="font-medium mb-1">{subcategory.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {subcategory.productCount} items
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 pb-16">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className={`lg:w-72 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="sticky top-4 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Filters</h2>
                {activeFiltersCount > 0 && (
                  <Button variant="ghost" size="sm" onClick={clearFilters}>
                    Clear all ({activeFiltersCount})
                  </Button>
                )}
              </div>

              {/* Price Range */}
              <Card className="luxury-card">
                <CardContent className="p-4">
                  <h3 className="font-medium mb-4">Price Range</h3>
                  <Slider
                    value={priceRange}
                    onValueChange={setPriceRange}
                    max={5000}
                    step={50}
                    className="mb-4"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>${priceRange[0]}</span>
                    <span>${priceRange[1]}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Brands */}
              <Card className="luxury-card">
                <CardContent className="p-4">
                  <h3 className="font-medium mb-4">Brands</h3>
                  <div className="space-y-3">
                    {brands.map((brand) => (
                      <div key={brand} className="flex items-center space-x-2">
                        <Checkbox
                          id={brand}
                          checked={selectedBrands.includes(brand)}
                          onCheckedChange={() => toggleBrand(brand)}
                        />
                        <label htmlFor={brand} className="text-sm cursor-pointer">
                          {brand}
                        </label>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Sizes */}
              <Card className="luxury-card">
                <CardContent className="p-4">
                  <h3 className="font-medium mb-4">Sizes</h3>
                  <div className="grid grid-cols-3 gap-2">
                    {sizes.map((size) => (
                      <Button
                        key={size}
                        variant={selectedSizes.includes(size) ? "default" : "outline"}
                        size="sm"
                        onClick={() => toggleSize(size)}
                        className="w-full"
                      >
                        {size}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Colors */}
              <Card className="luxury-card">
                <CardContent className="p-4">
                  <h3 className="font-medium mb-4">Colors</h3>
                  <div className="grid grid-cols-4 gap-2">
                    {colors.map((color) => (
                      <Button
                        key={color}
                        variant={selectedColors.includes(color) ? "default" : "outline"}
                        size="sm"
                        onClick={() => toggleColor(color)}
                        className="w-full text-xs"
                      >
                        {color}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Products Section */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}
                </Button>
                <p className="text-muted-foreground">
                  Showing {products.length} of 156 products
                </p>
              </div>

              <div className="flex items-center gap-4">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="relevance">Most Relevant</SelectItem>
                    <SelectItem value="price_asc">Price: Low to High</SelectItem>
                    <SelectItem value="price_desc">Price: High to Low</SelectItem>
                    <SelectItem value="rating">Highest Rated</SelectItem>
                    <SelectItem value="newest">Newest</SelectItem>
                    <SelectItem value="popular">Most Popular</SelectItem>
                  </SelectContent>
                </Select>

                <div className="flex border rounded-lg">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                    className="rounded-r-none"
                  >
                    <Grid className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                    className="rounded-l-none"
                  >
                    <List className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Active Filters */}
            {activeFiltersCount > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {selectedBrands.map((brand) => (
                  <Badge key={brand} variant="secondary" className="cursor-pointer" onClick={() => toggleBrand(brand)}>
                    {brand} <X className="w-3 h-3 ml-1" />
                  </Badge>
                ))}
                {selectedSizes.map((size) => (
                  <Badge key={size} variant="secondary" className="cursor-pointer" onClick={() => toggleSize(size)}>
                    Size {size} <X className="w-3 h-3 ml-1" />
                  </Badge>
                ))}
                {selectedColors.map((color) => (
                  <Badge key={color} variant="secondary" className="cursor-pointer" onClick={() => toggleColor(color)}>
                    {color} <X className="w-3 h-3 ml-1" />
                  </Badge>
                ))}
                {(priceRange[0] > 0 || priceRange[1] < 5000) && (
                  <Badge variant="secondary" className="cursor-pointer" onClick={() => setPriceRange([0, 5000])}>
                    ${priceRange[0]} - ${priceRange[1]} <X className="w-3 h-3 ml-1" />
                  </Badge>
                )}
              </div>
            )}

            {/* Products Grid */}
            <div className={`grid gap-6 ${
              viewMode === 'grid' 
                ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                : 'grid-cols-1'
            }`}>
              {products.map((product, index) => (
                <div 
                  key={product.id}
                  className="animate-scale-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center mt-12">
              <div className="flex items-center gap-2">
                <Button variant="outline" disabled>
                  Previous
                </Button>
                <Button variant="default">1</Button>
                <Button variant="outline">2</Button>
                <Button variant="outline">3</Button>
                <span className="px-2">...</span>
                <Button variant="outline">12</Button>
                <Button variant="outline">
                  Next
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;
