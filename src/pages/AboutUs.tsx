
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

const AboutUs = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">About Us</h1>
      
      <div className="space-y-8">
        <Card>
          <CardContent className="p-8">
            <h2 className="text-2xl font-semibold mb-4">Our Story</h2>
            <p className="text-gray-600 leading-relaxed">
              Founded in 2020, our company has been dedicated to providing high-quality products
              and exceptional customer service. We believe in making shopping accessible and
              enjoyable for everyone.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-8">
            <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
            <p className="text-gray-600 leading-relaxed">
              To deliver the best shopping experience through innovative technology, 
              carefully curated products, and unmatched customer support.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-8">
            <h2 className="text-2xl font-semibold mb-4">Our Values</h2>
            <ul className="text-gray-600 space-y-2">
              <li>• Quality products at fair prices</li>
              <li>• Exceptional customer service</li>
              <li>• Environmental responsibility</li>
              <li>• Innovation and continuous improvement</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AboutUs;
