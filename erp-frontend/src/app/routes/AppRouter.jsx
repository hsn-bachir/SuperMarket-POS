import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import { useAuth } from "@/features/auth/authContext";

import MainLayout from "@/app/layouts/MainLayout";
import Login from "@/features/auth/pages/Login";
import Dashboard from "@/features/dashboard/pages/Dashboard";

import Products from "@/features/products/pages/Products";
import CreateProduct from "@/features/products/pages/CreateProduct";
import EditProduct from "@/features/products/pages/EditProduct";

import Category from "@/features/category/pages/Category";
import CreateCategory from "@/features/category/pages/CreateCategory";
import EditCategory from "@/features/category/pages/EditCategory";

import Suppliers from "@/features/supplier/pages/Suppliers";
import CreateSupplier from "@/features/supplier/pages/CreateSupplier";
import EditSupplier from "@/features/supplier/pages/EditSupplier";

import Purchases from "@/features/purchases/pages/Purchases";
import CreatePurchases from "@/features/purchases/pages/CreatePurchase";
import PurcahseDetails from "@/features/purchases/pages/PurchaseDetails";

import POS from "@/features/sales/pages/POS";
import Sales from "@/features/sales/pages/Sales";
import SaleDetails from "@/features/sales/pages/SaleDetails";
import EditSale from "@/features/sales/pages/EditSale";
import Print from "@/features/sales/pages/InvoicePage";

import Inventory from "@/features/inventory/pages/Inventory";

import Reports from "@/features/reports/pages/Reports";

import Users from "@/features/users/pages/Users";
import AddUser from "@/features/users/pages/AddUser";
import EditUser from "@/features/users/pages/EditUser";

function RootRedirect() {
  const { user } = useAuth();
  return <Navigate to={user ? "/" : "/login"} replace />;
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public route */}
        <Route path="/login" element={<Login />} />

        {/* Protected layout routes */}
        <Route
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="products" element={<Products />} />
          <Route path="products" element={<Products />} />
          <Route path="products/new" element={<CreateProduct />} />
          <Route path="products/:id/edit" element={<EditProduct />} />
          <Route path="category" element={<Category />} />
          <Route path="category/new" element={<CreateCategory />} />
          <Route path="category/:id/edit" element={<EditCategory />} />
          <Route path="suppliers" element={<Suppliers />} />
          <Route path="suppliers/new" element={<CreateSupplier />} />
          <Route path="suppliers/:id/edit" element={<EditSupplier />} />
          <Route path="purchases" element={<Purchases />} />
          <Route path="purchases/new" element={<CreatePurchases />} />
          <Route path="purchases/:id" element={<PurcahseDetails />} />
          <Route path="sales" element={<Sales />} />
          <Route path="sales/:id" element={<SaleDetails />} />
          <Route path="sales/:id/edit" element={<EditSale />} />
          <Route path="pos" element={<POS />} />
          <Route path="inventory" element={<Inventory />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/users" element={<Users />} />
          <Route path="/users/new" element={<AddUser />} />
          <Route path="/users/:id/edit" element={<EditUser />} />
        </Route>
        <Route path="/sales/:id/invoice" element={<Print />} />

        {/* fallback */}
        <Route path="*" element={<RootRedirect />} />
      </Routes>
    </BrowserRouter>
  );
}
