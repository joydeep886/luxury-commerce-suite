
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import DashboardOverview from '@/components/admin/dashboard/DashboardOverview';
import ProductManagement from '@/components/admin/products/ProductManagement';
import OrderManagement from '@/components/admin/orders/OrderManagement';
import CustomerManagement from '@/components/admin/customers/CustomerManagement';
import AnalyticsDashboard from '@/components/admin/analytics/AnalyticsDashboard';
import InventoryManagement from '@/components/admin/inventory/InventoryManagement';
import CouponManagement from '@/components/admin/coupons/CouponManagement';
import ContentManagement from '@/components/admin/content/ContentManagement';
import SystemSettings from '@/components/admin/settings/SystemSettings';
import SecurityDashboard from '@/components/admin/security/SecurityDashboard';

const AdminDashboard = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      <AdminSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
          <Routes>
            <Route path="/" element={<DashboardOverview />} />
            <Route path="/products/*" element={<ProductManagement />} />
            <Route path="/orders/*" element={<OrderManagement />} />
            <Route path="/customers/*" element={<CustomerManagement />} />
            <Route path="/analytics/*" element={<AnalyticsDashboard />} />
            <Route path="/inventory/*" element={<InventoryManagement />} />
            <Route path="/coupons/*" element={<CouponManagement />} />
            <Route path="/content/*" element={<ContentManagement />} />
            <Route path="/settings/*" element={<SystemSettings />} />
            <Route path="/security/*" element={<SecurityDashboard />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
