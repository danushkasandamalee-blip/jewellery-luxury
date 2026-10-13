import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import PublicLayout from "./layouts/PublicLayout";
import AdminLayout from "./layouts/AdminLayout";
import ProtectedAdminRoute from "./routes/ProtectedAdminRoute";

import Home from "./pages/Home";
import Shop from "./pages/Shop";
import Category from "./pages/Category";
import CollectionsPage from "./pages/Collections";
import Collection from "./pages/Collection";
import Product from "./pages/Product";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Appointment from "./pages/Appointment";
import NotFound from "./pages/NotFound";

import AdminLogin from "./admin/AdminLogin";
import Dashboard from "./admin/Dashboard";
import Products from "./admin/Products";
import ProductForm from "./admin/ProductForm";
import Categories from "./admin/Categories";
import AdminCollections from "./admin/Collections";
import Homepage from "./admin/Homepage";
import WebsiteSettings from "./admin/WebsiteSettings";
import SocialMedia from "./admin/SocialMedia";
import Enquiries from "./admin/Enquiries";
import AdminAppointments from "./admin/Appointments";
import Newsletter from "./admin/Newsletter";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* PUBLIC WEBSITE */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />

          <Route
            path="/category/:slug"
            element={<Category />}
          />

          <Route
            path="/collections"
            element={<CollectionsPage />}
          />

          <Route
            path="/collections/:slug"
            element={<Collection />}
          />

          <Route
            path="/product/:slug"
            element={<Product />}
          />

          <Route
            path="/about"
            element={<About />}
          />

          <Route
            path="/contact"
            element={<Contact />}
          />

          <Route
            path="/appointment"
            element={<Appointment />}
          />
        </Route>

        {/* ADMIN LOGIN */}
        <Route
          path="/admin/login"
          element={<AdminLogin />}
        />

        {/* PROTECTED ADMIN */}
        <Route
          path="/admin"
          element={
            <ProtectedAdminRoute>
              <AdminLayout />
            </ProtectedAdminRoute>
          }
        >
          <Route
            index
            element={
              <Navigate
                to="/admin/dashboard"
                replace
              />
            }
          />

          <Route
            path="dashboard"
            element={<Dashboard />}
          />

          <Route
            path="products"
            element={<Products />}
          />

          <Route
            path="products/new"
            element={<ProductForm />}
          />

          <Route
            path="products/:id/edit"
            element={<ProductForm />}
          />

          <Route
            path="categories"
            element={<Categories />}
          />

          <Route
            path="collections"
            element={<AdminCollections />}
          />

          <Route
            path="homepage"
            element={<Homepage />}
          />

          <Route
            path="settings"
            element={<WebsiteSettings />}
          />

          <Route
            path="social"
            element={<SocialMedia />}
          />

          <Route
            path="enquiries"
            element={<Enquiries />}
          />

          <Route
            path="appointments"
            element={<AdminAppointments />}
          />

          <Route
            path="newsletter"
            element={<Newsletter />}
          />
        </Route>

        <Route
          path="*"
          element={<NotFound />}
        />

      </Routes>
    </BrowserRouter>
  );
}