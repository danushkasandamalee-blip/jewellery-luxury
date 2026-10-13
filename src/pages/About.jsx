import {
  useEffect,
  useState,
} from "react";

import { Link } from "react-router-dom";

import { supabase } from "../lib/supabaseClient";

import Loading from "../components/Loading";

export default function About() {
  const [settings, setSettings] =
    useState({});

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  async function loadSettings() {
    const {
      data,
      error,
    } = await supabase
      .from("site_settings")
      .select("*");

    if (error) {
      console.error(error);
    }

    const settingsMap = {};

    for (const item of data || []) {
      settingsMap[
        item.setting_key
      ] = item.setting_value;
    }

    setSettings(settingsMap);
    setLoading(false);
  }

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <section className="editorial-page">
        <p className="eyebrow">
          Our Story
        </p>

        <h1>
          {settings.business_name ||
            "Jewellery"}
        </h1>

        <div className="editorial-text">
          <p>
            {settings.about_text ||
              "Fine jewellery created with care, character and timeless design."}
          </p>
        </div>
      </section>

      <section className="story-banner">
        <div>
          <p className="eyebrow">
            Personal Service
          </p>

          <h2>
            Find a piece that feels
            entirely yours.
          </h2>

          <p>
            Arrange a private
            consultation to explore
            jewellery and gemstones.
          </p>

          <Link
            to="/appointment"
            className="luxury-button"
          >
            Book an Appointment
          </Link>
        </div>
      </section>
    </>
  );
}