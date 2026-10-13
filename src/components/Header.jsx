import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

export default function Header() {
  const [businessName, setBusinessName] =
    useState("JEWELLERY");

  const [menuOpen, setMenuOpen] =
    useState(false);

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

  function navClass({ isActive }) {
    return isActive ? "active" : "";
  }

  return (
    <header className="site-header">

      <div className="header-top">

        <button
          type="button"
          className="mobile-menu-button"
          onClick={() =>
            setMenuOpen((current) => !current)
          }
          aria-label="Open menu"
        >
          ☰
        </button>

        <Link
          to="/"
          className="site-logo"
          onClick={closeMenu}
        >
          {businessName}
        </Link>

        <Link
          to="/appointment"
          className="header-appointment"
          onClick={closeMenu}
        >
          Appointment
        </Link>

      </div>

      <nav
        className={
          menuOpen
            ? "main-nav main-nav-open"
            : "main-nav"
        }
      >

        <NavLink
          className={navClass}
          to="/shop"
          onClick={closeMenu}
        >
          Jewellery
        </NavLink>

        <NavLink
          className={navClass}
          to="/collections"
          onClick={closeMenu}
        >
          Collections
        </NavLink>

        <NavLink
          className={navClass}
          to="/category/rings"
          onClick={closeMenu}
        >
          Rings
        </NavLink>

        <NavLink
          className={navClass}
          to="/category/earrings"
          onClick={closeMenu}
        >
          Earrings
        </NavLink>

        <NavLink
          className={navClass}
          to="/about"
          onClick={closeMenu}
        >
          Our Story
        </NavLink>

        <NavLink
          className={navClass}
          to="/contact"
          onClick={closeMenu}
        >
          Contact
        </NavLink>

      </nav>

    </header>
  );
}