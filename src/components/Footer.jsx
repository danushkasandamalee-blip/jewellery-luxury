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

  return (
    <footer className="site-footer">
      <div className="footer-grid">
        <div>
          <h3>
            {settings.business_name ||
              "Jewellery"}
          </h3>

          <p>
            {settings.footer_text ||
              "Fine jewellery for unforgettable moments."}
          </p>
        </div>

        <div>
          <h4>Explore</h4>

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
        </div>

        <div>
          <h4>Contact</h4>

          {settings.phone && (
            <a href={`tel:${settings.phone}`}>
              {settings.phone}
            </a>
          )}

          {settings.email && (
            <a
              href={`mailto:${settings.email}`}
            >
              {settings.email}
            </a>
          )}

          {settings.address && (
            <p>{settings.address}</p>
          )}

          {settings.business_hours && (
            <p>
              {settings.business_hours}
            </p>
          )}
        </div>

        <div>
          <h4>Newsletter</h4>

          <p>
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
                ? "..."
                : "Join"}
            </button>
          </form>

          {message && (
            <small>{message}</small>
          )}
        </div>
      </div>

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

      <div className="footer-bottom">
        © {new Date().getFullYear()}{" "}
        {settings.business_name ||
          "Jewellery"}
        . All rights reserved.
      </div>
    </footer>
  );
}