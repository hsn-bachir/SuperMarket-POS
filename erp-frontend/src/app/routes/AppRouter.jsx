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
        </Route>

        {/* fallback */}
        <Route path="*" element={<RootRedirect />} />
      </Routes>
    </BrowserRouter>
  );
}
