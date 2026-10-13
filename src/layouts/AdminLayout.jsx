import {
  NavLink,
  Outlet,
  useNavigate,
} from "react-router-dom";

import {
  supabase,
} from "../lib/supabaseClient";

export default function AdminLayout() {
  const navigate =
    useNavigate();

  function navClass({
    isActive,
  }) {
    return isActive
      ? "active"
      : "";
  }

  async function logout() {
    await supabase.auth.signOut();

    navigate(
      "/admin/login",
      {
        replace: true,
      }
    );
  }

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <div className="admin-brand-small">
            JEWELLERY
          </div>

          <div className="admin-brand-name">
            Administration
          </div>
        </div>

        <nav className="admin-nav">
          <NavLink
            to="/admin/dashboard"
            className={navClass}
          >
            Dashboard
          </NavLink>

          <NavLink
            to="/admin/products"
            className={navClass}
          >
            Products
          </NavLink>

          <NavLink
            to="/admin/categories"
            className={navClass}
          >
            Categories
          </NavLink>

          <NavLink
            to="/admin/collections"
            className={navClass}
          >
            Collections
          </NavLink>

          <div className="admin-nav-divider" />

          <NavLink
            to="/admin/homepage"
            className={navClass}
          >
            Homepage
          </NavLink>

          <NavLink
            to="/admin/settings"
            className={navClass}
          >
            Website Settings
          </NavLink>

          <NavLink
            to="/admin/social"
            className={navClass}
          >
            Social Media
          </NavLink>

          <div className="admin-nav-divider" />

          <NavLink
            to="/admin/enquiries"
            className={navClass}
          >
            Enquiries
          </NavLink>

          <NavLink
            to="/admin/appointments"
            className={navClass}
          >
            Appointments
          </NavLink>

          <NavLink
            to="/admin/newsletter"
            className={navClass}
          >
            Newsletter
          </NavLink>
        </nav>

        <div className="admin-sidebar-bottom">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
          >
            View Website
          </a>

          <button
            type="button"
            onClick={logout}
          >
            Logout
          </button>
        </div>
      </aside>

      <main className="admin-content">
        <Outlet />
      </main>
    </div>
  );
}