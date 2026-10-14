import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import "./Header.css";

export default function Header() {
  const [businessName, setBusinessName] = useState("JEWELLERY");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    loadBusinessName();
  }, []);

  async function loadBusinessName() {
    const { data, error } = await supabase
      .from("site_settings")
      .select("setting_value")
      .eq("setting_key", "business_name")
      .maybeSingle();

    if (!error && data?.setting_value) {
      setBusinessName(data.setting_value);
    }
  }

  function closeMenu() {
    setMenuOpen(false);
  }

  function getNavClass({ isActive }) {
    return isActive
      ? "luxury-nav-link luxury-nav-link-active"
      : "luxury-nav-link";
  }

  return (
    <header className="luxury-header">
      <div className="luxury-header-top">

        <button
          type="button"
          className="luxury-menu-button"
          onClick={() => setMenuOpen((current) => !current)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
        >
          {menuOpen ? "✕" : "☰"}
        </button>

        <Link
          to="/"
          className="luxury-logo"
          onClick={closeMenu}
        >
          {businessName}
        </Link>

        <Link
          to="/appointment"
          className="luxury-appointment"
          onClick={closeMenu}
        >
          Appointment
        </Link>

      </div>

      <nav
        className={
          menuOpen
            ? "luxury-nav luxury-nav-open"
            : "luxury-nav"
        }
      >

        <NavLink
          className={getNavClass}
          to="/shop"
          onClick={closeMenu}
        >
          Jewellery
        </NavLink>

        <NavLink
          className={getNavClass}
          to="/collections"
          onClick={closeMenu}
        >
          Collections
        </NavLink>

        <NavLink
          className={getNavClass}
          to="/category/rings"
          onClick={closeMenu}
        >
          Rings
        </NavLink>

        <NavLink
          className={getNavClass}
          to="/category/earrings"
          onClick={closeMenu}
        >
          Earrings
        </NavLink>

        <NavLink
          className={getNavClass}
          to="/about"
          onClick={closeMenu}
        >
          Our Story
        </NavLink>

        <NavLink
          className={getNavClass}
          to="/contact"
          onClick={closeMenu}
        >
          Contact
        </NavLink>

      </nav>
    </header>
  );
}