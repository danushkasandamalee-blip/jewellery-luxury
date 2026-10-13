import {
  useEffect,
  useState,
} from "react";

import { supabase } from "../lib/supabaseClient";

export default function Contact() {
  const [settings, setSettings] =
    useState({});

  const [message, setMessage] =
    useState("");

  const [submitting, setSubmitting] =
    useState(false);

  const [form, setForm] =
    useState({
      customer_name: "",
      email: "",
      phone: "",
      message: "",
    });

  useEffect(() => {
    loadSettings();
  }, []);

  async function loadSettings() {
    const { data, error } =
      await supabase
        .from("site_settings")
        .select("*");

    if (error) {
      console.error(error);
    }

    const map = {};

    for (const item of data || []) {
      map[item.setting_key] =
        item.setting_value;
    }

    setSettings(map);
  }

  function updateField(event) {
    setForm({
      ...form,
      [event.target.name]:
        event.target.value,
    });
  }

  async function submit(event) {
    event.preventDefault();

    setMessage("");
    setSubmitting(true);

    const {
      error,
    } = await supabase
      .from("inquiries")
      .insert({
        customer_name:
          form.customer_name.trim(),

        email:
          form.email.trim() ||
          null,

        phone:
          form.phone.trim() ||
          null,

        message:
          form.message.trim() ||
          null,
      });

    if (error) {
      console.error(error);

      setMessage(
        "Unable to send your message. Please try again."
      );

      setSubmitting(false);
      return;
    }

    setForm({
      customer_name: "",
      email: "",
      phone: "",
      message: "",
    });

    setMessage(
      "Thank you. Your message has been sent successfully."
    );

    setSubmitting(false);
  }

  return (
    <section className="contact-page">
      <div className="contact-details">
        <p className="eyebrow">
          Contact
        </p>

        <h1>
          Speak with us.
        </h1>

        <p>
          We would be delighted to help
          you discover the right piece.
        </p>

        {settings.phone && (
          <div className="contact-item">
            <span>
              Telephone
            </span>

            <a
              href={`tel:${settings.phone}`}
            >
              {settings.phone}
            </a>
          </div>
        )}

        {settings.email && (
          <div className="contact-item">
            <span>
              Email
            </span>

            <a
              href={`mailto:${settings.email}`}
            >
              {settings.email}
            </a>
          </div>
        )}

        {settings.address && (
          <div className="contact-item">
            <span>
              Address
            </span>

            <p>
              {settings.address}
            </p>
          </div>
        )}

        {settings.business_hours && (
          <div className="contact-item">
            <span>
              Opening Hours
            </span>

            <p>
              {
                settings.business_hours
              }
            </p>
          </div>
        )}
      </div>

      <form
        className="luxury-form"
        onSubmit={submit}
      >
        <label>
          Name *

          <input
            required
            name="customer_name"
            placeholder="Your name"
            value={
              form.customer_name
            }
            onChange={updateField}
          />
        </label>

        <label>
          Email

          <input
            type="email"
            name="email"
            placeholder="Email address"
            value={form.email}
            onChange={updateField}
          />
        </label>

        <label>
          Phone

          <input
            name="phone"
            placeholder="Phone number"
            value={form.phone}
            onChange={updateField}
          />
        </label>

        <label>
          Message

          <textarea
            rows="7"
            name="message"
            placeholder="How can we help?"
            value={form.message}
            onChange={updateField}
          />
        </label>

        <button
          type="submit"
          className="luxury-button"
          disabled={submitting}
        >
          {submitting
            ? "Sending..."
            : "Send Message"}
        </button>

        {message && (
          <p className="form-message">
            {message}
          </p>
        )}
      </form>
    </section>
  );
}