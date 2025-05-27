
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
  BarChart3,
  ShoppingCart,
  Users,
  Package,
  Settings,
  Shield,
  FileText,
  Tag,
  TrendingUp,
  ChevronDown,
  Home,
  Database,
  Bell
} from 'lucide-react';

interface NavItem {
  title: string;
  href?: string;
  icon: any;
  children?: NavItem[];
}

const navigation: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/admin',
    icon: Home,
  },
  {
    title: 'Analytics',
    icon: TrendingUp,
    children: [
      { title: 'Overview', href: '/admin/analytics', icon: BarChart3 },
      { title: 'Sales Reports', href: '/admin/analytics/sales', icon: TrendingUp },
      { title: 'Customer Analytics', href: '/admin/analytics/customers', icon: Users },
      { title: 'Product Analytics', href: '/admin/analytics/products', icon: Package },
    ],
  },
  {
    title: 'Products',
    icon: Package,
    children: [
      { title: 'All Products', href: '/admin/products', icon: Package },
      { title: 'Add Product', href: '/admin/products/add', icon: Package },
      { title: 'Categories', href: '/admin/products/categories', icon: Tag },
      { title: 'Brands', href: '/admin/products/brands', icon: Tag },
      { title: 'Reviews', href: '/admin/products/reviews', icon: FileText },
    ],
  },
  {
    title: 'Orders',
    icon: ShoppingCart,
    children: [
      { title: 'All Orders', href: '/admin/orders', icon: ShoppingCart },
      { title: 'Pending', href: '/admin/orders/pending', icon: ShoppingCart },
      { title: 'Shipping', href: '/admin/orders/shipping', icon: ShoppingCart },
      { title: 'Returns', href: '/admin/orders/returns', icon: ShoppingCart },
    ],
  },
  {
    title: 'Customers',
    icon: Users,
    children: [
      { title: 'All Customers', href: '/admin/customers', icon: Users },
      { title: 'Customer Groups', href: '/admin/customers/groups', icon: Users },
      { title: 'Loyalty Program', href: '/admin/customers/loyalty', icon: Users },
      { title: 'Support Tickets', href: '/admin/customers/support', icon: Bell },
    ],
  },
  {
    title: 'Inventory',
    icon: Database,
    children: [
      { title: 'Stock Overview', href: '/admin/inventory', icon: Database },
      { title: 'Low Stock Alerts', href: '/admin/inventory/alerts', icon: Bell },
      { title: 'Stock Adjustments', href: '/admin/inventory/adjustments', icon: Database },
      { title: 'Suppliers', href: '/admin/inventory/suppliers', icon: Users },
    ],
  },
  {
    title: 'Marketing',
    icon: Tag,
    children: [
      { title: 'Coupons', href: '/admin/coupons', icon: Tag },
      { title: 'Email Campaigns', href: '/admin/marketing/emails', icon: FileText },
      { title: 'Promotions', href: '/admin/marketing/promotions', icon: Tag },
      { title: 'Newsletter', href: '/admin/marketing/newsletter', icon: FileText },
    ],
  },
  {
    title: 'Content',
    icon: FileText,
    children: [
      { title: 'Pages', href: '/admin/content/pages', icon: FileText },
      { title: 'Media Library', href: '/admin/content/media', icon: FileText },
      { title: 'SEO Settings', href: '/admin/content/seo', icon: Settings },
      { title: 'Homepage', href: '/admin/content/homepage', icon: Home },
    ],
  },
  {
    title: 'Settings',
    icon: Settings,
    children: [
      { title: 'General', href: '/admin/settings', icon: Settings },
      { title: 'Payment Methods', href: '/admin/settings/payments', icon: Settings },
      { title: 'Shipping', href: '/admin/settings/shipping', icon: Settings },
      { title: 'Taxes', href: '/admin/settings/taxes', icon: Settings },
    ],
  },
  {
    title: 'Security',
    icon: Shield,
    children: [
      { title: 'Overview', href: '/admin/security', icon: Shield },
      { title: 'User Roles', href: '/admin/security/roles', icon: Users },
      { title: 'Activity Logs', href: '/admin/security/logs', icon: FileText },
      { title: 'Backups', href: '/admin/security/backups', icon: Database },
    ],
  },
];

const AdminSidebar = () => {
  const location = useLocation();
  const [openItems, setOpenItems] = useState<string[]>(['Dashboard']);

  const toggleItem = (title: string) => {
    setOpenItems(prev =>
      prev.includes(title)
        ? prev.filter(item => item !== title)
        : [...prev, title]
    );
  };

  const NavItem = ({ item }: { item: NavItem }) => {
    const isActive = item.href === location.pathname;
    const isOpen = openItems.includes(item.title);

    if (item.children) {
      return (
        <Collapsible open={isOpen} onOpenChange={() => toggleItem(item.title)}>
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              className={cn(
                'w-full justify-between text-left font-normal',
                isOpen && 'bg-gray-100'
              )}
            >
              <div className="flex items-center">
                <item.icon className="mr-2 h-4 w-4" />
                {item.title}
              </div>
              <ChevronDown
                className={cn(
                  'h-4 w-4 transition-transform',
                  isOpen && 'transform rotate-180'
                )}
              />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="ml-6 space-y-1">
            {item.children.map((child) => (
              <Button
                key={child.title}
                variant="ghost"
                className={cn(
                  'w-full justify-start text-left font-normal',
                  location.pathname === child.href && 'bg-blue-100 text-blue-700'
                )}
                asChild
              >
                <Link to={child.href || '#'}>
                  <child.icon className="mr-2 h-4 w-4" />
                  {child.title}
                </Link>
              </Button>
            ))}
          </CollapsibleContent>
        </Collapsible>
      );
    }

    return (
      <Button
        variant="ghost"
        className={cn(
          'w-full justify-start text-left font-normal',
          isActive && 'bg-blue-100 text-blue-700'
        )}
        asChild
      >
        <Link to={item.href || '#'}>
          <item.icon className="mr-2 h-4 w-4" />
          {item.title}
        </Link>
      </Button>
    );
  };

  return (
    <div className="w-64 bg-white shadow-lg">
      <div className="p-6 border-b">
        <h1 className="text-2xl font-bold text-gray-800">Admin Panel</h1>
      </div>
      <ScrollArea className="h-[calc(100vh-80px)]">
        <nav className="p-4 space-y-2">
          {navigation.map((item) => (
            <NavItem key={item.title} item={item} />
          ))}
        </nav>
      </ScrollArea>
    </div>
  );
};

export default AdminSidebar;
