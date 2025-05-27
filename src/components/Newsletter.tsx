
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail } from 'lucide-react';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      // TODO: Implement newsletter subscription
      console.log('Newsletter subscription:', email);
      setIsSubscribed(true);
      setEmail('');
      
      // Reset success message after 3 seconds
      setTimeout(() => setIsSubscribed(false), 3000);
    }
  };

  return (
    <section className="py-16 bg-gradient-to-r from-luxury-black to-luxury-dark text-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          {/* Content */}
          <div className="animate-fade-in">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full luxury-gradient mb-6">
              <Mail className="w-8 h-8 text-luxury-black" />
            </div>
            
            <h2 className="text-3xl md:text-4xl font-luxury font-bold mb-4">
              Stay in the <span className="luxury-text-gradient">Loop</span>
            </h2>
            
            <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
              Subscribe to our newsletter and be the first to know about new arrivals, 
              exclusive offers, and luxury fashion insights.
            </p>

            {/* Newsletter Form */}
            <div className="max-w-md mx-auto">
              {!isSubscribed ? (
                <form onSubmit={handleSubmit} className="flex gap-4">
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-primary"
                    required
                  />
                  <Button 
                    type="submit"
                    className="luxury-gradient text-luxury-black font-semibold px-8 hover:scale-105 transition-all duration-300"
                  >
                    Subscribe
                  </Button>
                </form>
              ) : (
                <div className="p-4 rounded-lg bg-green-500/20 border border-green-500/30">
                  <p className="text-green-400 font-medium">
                    ✓ Thank you for subscribing! Welcome to the Luxuria family.
                  </p>
                </div>
              )}
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 text-sm">
              <div className="flex items-center justify-center gap-2 text-gray-400">
                <div className="w-2 h-2 rounded-full bg-primary"></div>
                Exclusive early access
              </div>
              <div className="flex items-center justify-center gap-2 text-gray-400">
                <div className="w-2 h-2 rounded-full bg-primary"></div>
                Style tips & trends
              </div>
              <div className="flex items-center justify-center gap-2 text-gray-400">
                <div className="w-2 h-2 rounded-full bg-primary"></div>
                VIP member benefits
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
