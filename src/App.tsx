import { Routes, Route, Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AssistantWidget from "./components/AssistantWidget";
import Home from "./features/storefront/Home";
import Category from "./features/storefront/Category";
import ProductPage from "./features/storefront/ProductPage";
import Cart from "./features/storefront/Cart";
import AdminLayout from "./features/admin/AdminLayout";
import Dashboard from "./features/admin/Dashboard";
import AdminProducts from "./features/admin/Products";
import AdminBundles from "./features/admin/Bundles";
import AdminOffers from "./features/admin/Offers";

function StorefrontLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-navy text-cloud font-sans">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <AssistantWidget />
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route element={<StorefrontLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/c/:slug" element={<Category />} />
        <Route path="/p/:id" element={<ProductPage />} />
        <Route path="/cart" element={<Cart />} />
      </Route>
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="bundles" element={<AdminBundles />} />
        <Route path="offers" element={<AdminOffers />} />
      </Route>
    </Routes>
  );
}
