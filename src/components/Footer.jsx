
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

export default function Footer() {
  const [settings, setSettings] =
    useState({});

  const [socials, setSocials] =
    useState([]);

  const [email, setEmail] =
    useState("");

  const [message, setMessage] =
    useState("");

  const [submitting, setSubmitting] =
    useState(false);

  useEffect(() => {
    loadFooter();
  }, []);

  async function loadFooter() {
    const [
      settingsResult,
      socialResult,
    ] = await Promise.all([
      supabase
        .from("site_settings")
        .select("*"),

      supabase
        .from("social_links")
        .select("*")
        .order("sort_order"),
    ]);

    const settingsMap = {};

    for (
      const item of
      settingsResult.data || []
    ) {
      settingsMap[item.setting_key] =
        item.setting_value;
    }

    setSettings(settingsMap);
    setSocials(socialResult.data || []);
  }

  async function subscribe(event) {
    event.preventDefault();

    if (!email.trim()) {
      return;
    }

    setSubmitting(true);
    setMessage("");

    const { error } = await supabase
      .from("newsletter_subscribers")
      .insert({
        email: email
          .trim()
          .toLowerCase(),
      });

    if (error) {
      if (error.code === "23505") {
        setMessage(
          "This email is already subscribed."
        );
      } else {
        setMessage(error.message);
      }

      setSubmitting(false);
      return;
    }

    setEmail("");

    setMessage(
      "Thank you for subscribing."
    );

    setSubmitting(false);
  }

  const isError =
    message &&
    (message
      .toLowerCase()
      .includes("error") ||
      message
        .toLowerCase()
        .includes("already") ||
      message
        .toLowerCase()
        .includes("invalid"));

  return (
    <footer className="site-footer">
      {/* Decorative top divider */}
      <div className="footer-divider">
        <span className="divider-line" />
        <span className="divider-mark">◆</span>
        <span className="divider-line" />
      </div>

      <div className="footer-grid">
        {/* Brand column */}
        <div className="footer-brand">
          <h3 className="footer-brand-name">
            {settings.business_name ||
              "Jewellery"}
          </h3>

          <p className="footer-brand-text">
            {settings.footer_text ||
              "Fine jewellery for unforgettable moments."}
          </p>
        </div>

        {/* Explore column */}
        <div className="footer-column">
          <h4 className="footer-column-title">
            Explore
          </h4>

          <nav className="footer-links">
            <Link to="/shop">
              Jewellery
            </Link>

            <Link to="/collections">
              Collections
            </Link>

            <Link to="/about">
              Our Story
            </Link>

            <Link to="/contact">
              Contact
            </Link>

            <Link to="/appointment">
              Appointments
            </Link>
          </nav>
        </div>

        {/* Contact column */}
        <div className="footer-column">
          <h4 className="footer-column-title">
            Contact
          </h4>

          <div className="footer-contact">
            {settings.phone && (
              <a href={`tel:${settings.phone}`}>
                <span className="contact-icon">
                  ✆
                </span>
                {settings.phone}
              </a>
            )}

            {settings.email && (
              <a
                href={`mailto:${settings.email}`}
              >
                <span className="contact-icon">
                  ✉
                </span>
                {settings.email}
              </a>
            )}

            {settings.address && (
              <p>
                <span className="contact-icon">
                  ⌖
                </span>
                {settings.address}
              </p>
            )}

            {settings.business_hours && (
              <p>
                <span className="contact-icon">
                  ◷
                </span>
                {settings.business_hours}
              </p>
            )}
          </div>
        </div>

        {/* Newsletter column */}
        <div className="footer-column">
          <h4 className="footer-column-title">
            Newsletter
          </h4>

          <p className="footer-newsletter-text">
            Discover new jewellery and
            collections.
          </p>

          <form
            className="newsletter-form"
            onSubmit={subscribe}
          >
            <input
              type="email"
              required
              placeholder="Your email"
              value={email}
              onChange={(event) =>
                setEmail(
                  event.target.value
                )
              }
            />

            <button
              type="submit"
              disabled={submitting}
            >
              {submitting
                ? "…"
                : "Join"}
            </button>
          </form>

          {message && (
            <small
              className={
                isError
                  ? "newsletter-message newsletter-message-error"
                  : "newsletter-message newsletter-message-success"
              }
            >
              {message}
            </small>
          )}
        </div>
      </div>

      {/* Social row */}
      <div className="footer-social">
        {socials
          .filter(
            (social) =>
              social.is_active &&
              social.url
          )
          .map((social) => (
            <a
              key={social.id}
              href={social.url}
              target="_blank"
              rel="noreferrer"
            >
              {social.platform}
            </a>
          ))}
      </div>

      {/* Bottom bar */}
      <div className="footer-bottom">
        © {new Date().getFullYear()}{" "}
        {settings.business_name ||
          "Jewellery"}
        . All rights reserved.
      </div>
    </footer>
  );
}