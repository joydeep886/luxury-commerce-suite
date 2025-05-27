
export interface SEOData {
  title: string;
  description: string;
  keywords: string[];
  canonicalUrl: string;
  ogImage?: string;
  schema?: any;
}

export class SEOService {
  generateProductSEO(product: any, baseUrl: string): SEOData {
    const title = `${product.name} | Luxuria - Premium Fashion`;
    const description = product.shortDescription || 
      `Shop ${product.name} at Luxuria. Premium quality ${product.categoryName} with fast shipping and easy returns.`;
    
    const keywords = [
      product.name.toLowerCase(),
      product.categoryName.toLowerCase(),
      product.brandName?.toLowerCase(),
      'luxury fashion',
      'premium quality',
      'designer',
      ...(product.tags || [])
    ];

    const schema = {
      "@context": "https://schema.org/",
      "@type": "Product",
      "name": product.name,
      "description": description,
      "brand": {
        "@type": "Brand",
        "name": product.brandName || "Luxuria"
      },
      "category": product.categoryName,
      "offers": {
        "@type": "Offer",
        "price": product.price,
        "priceCurrency": "USD",
        "availability": product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
        "url": `${baseUrl}/product/${product.id}`
      },
      "aggregateRating": product.reviewCount > 0 ? {
        "@type": "AggregateRating",
        "ratingValue": product.rating,
        "reviewCount": product.reviewCount
      } : undefined,
      "image": product.images?.[0] || null
    };

    return {
      title,
      description,
      keywords,
      canonicalUrl: `${baseUrl}/product/${product.id}`,
      ogImage: product.images?.[0],
      schema
    };
  }

  generateCategorySEO(category: any, baseUrl: string): SEOData {
    const title = category.seoTitle || `${category.name} | Luxuria - Premium Fashion`;
    const description = category.seoDescription || 
      `Discover our ${category.name} collection. Premium quality fashion with exceptional style and comfort.`;
    
    const keywords = [
      category.name.toLowerCase(),
      'luxury fashion',
      'premium quality',
      'designer',
      'fashion',
      'style'
    ];

    return {
      title,
      description,
      keywords,
      canonicalUrl: `${baseUrl}/category/${category.slug}`,
      ogImage: category.bannerImage || category.image
    };
  }

  generateHomeSEO(baseUrl: string): SEOData {
    return {
      title: "Luxuria - Premium Fashion & Lifestyle",
      description: "Discover the finest in luxury fashion and lifestyle products. Premium quality, exceptional style, and unmatched elegance.",
      keywords: [
        'luxury fashion',
        'premium clothing',
        'designer fashion',
        'high-end fashion',
        'luxury lifestyle',
        'premium brands'
      ],
      canonicalUrl: baseUrl,
      ogImage: `${baseUrl}/og-image.jpg`
    };
  }

  generateSitemap(products: any[], categories: any[], baseUrl: string) {
    const urls = [
      { loc: baseUrl, priority: 1.0, changefreq: 'daily' },
      { loc: `${baseUrl}/products`, priority: 0.9, changefreq: 'daily' },
      { loc: `${baseUrl}/categories`, priority: 0.8, changefreq: 'weekly' },
    ];

    // Add category URLs
    categories.forEach(category => {
      urls.push({
        loc: `${baseUrl}/category/${category.slug}`,
        priority: 0.8,
        changefreq: 'weekly'
      });
    });

    // Add product URLs
    products.forEach(product => {
      urls.push({
        loc: `${baseUrl}/product/${product.id}`,
        priority: 0.7,
        changefreq: 'weekly'
      });
    });

    return urls;
  }
}

export const seoService = new SEOService();
