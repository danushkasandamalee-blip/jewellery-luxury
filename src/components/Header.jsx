import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import "../styles/Header.css";

export default function Header() {
  const [businessName, setBusinessName] = useState(
    "YOUR JEWELLERY BRAND"
  );

  const [menuOpen, setMenuOpen] = useState(false);

  const location = useLocation();

  /* Load business name */
  useEffect(() => {
    loadBusinessName();
  }, []);

  /* Close mobile menu whenever route changes */
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  async function loadBusinessName() {
    try {
      const { data, error } = await supabase
        .from("site_settings")
        .select("setting_value")
        .eq("setting_key", "business_name")
        .maybeSingle();

      if (error) {
        console.error("Error loading business name:", error);
        return;
      }

      if (data?.setting_value) {
        setBusinessName(data.setting_value);
      }
    } catch (error) {
      console.error("Business name load failed:", error);
    }
  }

  function toggleMenu() {
    setMenuOpen((current) => !current);
  }

  function closeMenu() {
    setMenuOpen(false);
  }

  function navClass({ isActive }) {
    return isActive
      ? "jwl-nav-link jwl-nav-link-active"
      : "jwl-nav-link";
  }

  return (
    <header className="jwl-header">
      {/* =========================
          TOP HEADER
      ========================= */}
      <div className="jwl-header-top">

        {/* MOBILE MENU BUTTON */}
        <button
          type="button"
          className="jwl-menu-button"
          onClick={toggleMenu}
          aria-label={
            menuOpen
              ? "Close navigation menu"
              : "Open navigation menu"
          }
          aria-expanded={menuOpen}
          aria-controls="main-navigation"
        >
          <span
            className="jwl-menu-icon"
            aria-hidden="true"
          >
            {menuOpen ? "✕" : "☰"}
          </span>
        </button>

        {/* BUSINESS NAME / LOGO */}
        <Link
          to="/"
          className="jwl-logo"
          onClick={closeMenu}
        >
          {businessName}
        </Link>

        {/* APPOINTMENT BUTTON */}
        <Link
          to="/appointment"
          className="jwl-appointment"
          onClick={closeMenu}
        >
          <span className="jwl-appointment-desktop">
            Appointment
          </span>

          <span className="jwl-appointment-mobile">
            Book
          </span>
        </Link>
      </div>

      {/* =========================
          NAVIGATION
      ========================= */}
      <nav
        id="main-navigation"
        className={
          menuOpen
            ? "jwl-nav jwl-nav-open"
            : "jwl-nav"
        }
        aria-label="Main navigation"
      >
        <NavLink
          to="/shop"
          className={navClass}
          onClick={closeMenu}
        >
          Jewellery
        </NavLink>

        <NavLink
          to="/collections"
          className={navClass}
          onClick={closeMenu}
        >
          Collections
        </NavLink>

        <NavLink
          to="/category/rings"
          className={navClass}
          onClick={closeMenu}
        >
          Rings
        </NavLink>

        <NavLink
          to="/category/earrings"
          className={navClass}
          onClick={closeMenu}
        >
          Earrings
        </NavLink>

        <NavLink
          to="/category/necklaces"
          className={navClass}
          onClick={closeMenu}
        >
          Necklaces
        </NavLink>

        <NavLink
          to="/about"
          className={navClass}
          onClick={closeMenu}
        >
          Our Story
        </NavLink>

        <NavLink
          to="/contact"
          className={navClass}
          onClick={closeMenu}
        >
          Contact
        </NavLink>
      </nav>
    </header>
  );
}