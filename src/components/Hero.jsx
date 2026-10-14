// import { Link } from "react-router-dom";

// export default function Hero({
//   title = "Timeless Jewellery",
//   subtitle =
//     "Created for life's unforgettable moments.",
//   imageUrl = "",
//   buttonText = "Discover",
//   buttonUrl = "/shop",
// }) {
//   const heroStyle = imageUrl
//     ? {
//         backgroundImage: `
//           linear-gradient(
//             rgba(0, 0, 0, 0.12),
//             rgba(0, 0, 0, 0.22)
//           ),
//           url("${imageUrl}")
//         `,
//       }
//     : {};

//   return (
//     <section
//       className="hero-section"
//       style={heroStyle}
//     >
//       <div className="hero-content">
//         <p className="eyebrow">
//           Fine Jewellery
//         </p>

//         <h1>{title}</h1>

//         <p className="hero-subtitle">
//           {subtitle}
//         </p>

//         <Link
//           to={buttonUrl || "/shop"}
//           className="luxury-button light"
//         >
//           {buttonText || "Discover"}
//         </Link>
//       </div>
//     </section>
//   );
// }
import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

export default function Header() {
  const [businessName, setBusinessName] =
    useState("JEWELLERY");

  const [menuOpen, setMenuOpen] =
    useState(false);

  const [scrolled, setScrolled] =
    useState(false);

  useEffect(() => {
    loadBusinessName();
  }, []);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 20);
    }

    window.addEventListener("scroll", onScroll);
    onScroll();

    return () =>
      window.removeEventListener(
        "scroll",
        onScroll
      );
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
    <header
      className={
        scrolled
          ? "site-header site-header-scrolled"
          : "site-header"
      }
    >
      {/* Decorative gold accent line */}
      <div className="header-accent-line" />

      <div className="header-top">
        <button
          type="button"
          className="mobile-menu-button"
          onClick={() =>
            setMenuOpen((current) => !current)
          }
          aria-label="Open menu"
        >
          <span
            className={
              menuOpen
                ? "hamburger hamburger-open"
                : "hamburger"
            }
          >
            <span />
            <span />
            <span />
          </span>
        </button>

        <Link
          to="/"
          className="site-logo"
          onClick={closeMenu}
        >
          <span className="logo-mark">◆</span>
          <span className="logo-text">
            {businessName}
          </span>
        </Link>

        <Link
          to="/appointment"
          className="header-appointment"
          onClick={closeMenu}
        >
          <span className="appointment-icon">
            ✦
          </span>
          <span className="appointment-label">
            Appointment
          </span>
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
          <span>Jewellery</span>
        </NavLink>

        <NavLink
          className={navClass}
          to="/collections"
          onClick={closeMenu}
        >
          <span>Collections</span>
        </NavLink>

        <NavLink
          className={navClass}
          to="/category/rings"
          onClick={closeMenu}
        >
          <span>Rings</span>
        </NavLink>

        <NavLink
          className={navClass}
          to="/category/earrings"
          onClick={closeMenu}
        >
          <span>Earrings</span>
        </NavLink>

        <NavLink
          className={navClass}
          to="/about"
          onClick={closeMenu}
        >
          <span>Our Story</span>
        </NavLink>

        <NavLink
          className={navClass}
          to="/contact"
          onClick={closeMenu}
        >
          <span>Contact</span>
        </NavLink>
      </nav>
    </header>
  );
}