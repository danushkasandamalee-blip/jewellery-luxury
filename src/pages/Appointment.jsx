import { useState } from "react";

import { supabase } from "../lib/supabaseClient";

export default function Appointment() {
  const [result, setResult] =
    useState("");

  const [submitting, setSubmitting] =
    useState(false);

  const [form, setForm] =
    useState({
      customer_name: "",
      email: "",
      phone: "",
      appointment_date: "",
      appointment_time: "",
      service:
        "Jewellery consultation",
      message: "",
    });

  function updateField(event) {
    setForm({
      ...form,
      [event.target.name]:
        event.target.value,
    });
  }

  async function submit(event) {
    event.preventDefault();

    setResult("");
    setSubmitting(true);

    const {
      error,
    } = await supabase
      .from("appointments")
      .insert({
        customer_name:
          form.customer_name.trim(),

        email:
          form.email.trim() ||
          null,

        phone:
          form.phone.trim(),

        appointment_date:
          form.appointment_date,

        appointment_time:
          form.appointment_time,

        service:
          form.service,

        message:
          form.message.trim() ||
          null,
      });

    if (error) {
      console.error(error);

      setResult(
        "Unable to submit your appointment. Please try again."
      );

      setSubmitting(false);
      return;
    }

    setResult(
      "Your appointment request has been submitted successfully."
    );

    setForm({
      customer_name: "",
      email: "",
      phone: "",
      appointment_date: "",
      appointment_time: "",
      service:
        "Jewellery consultation",
      message: "",
    });

    setSubmitting(false);
  }

  return (
    <section className="form-page">
      <div className="page-title">
        <p className="eyebrow">
          Private Service
        </p>

        <h1>
          Book an Appointment
        </h1>

        <p>
          Arrange a private consultation
          to discover our jewellery and
          gemstones.
        </p>
      </div>

      <form
        className="luxury-form centered"
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
          Phone *

          <input
            required
            name="phone"
            placeholder="Phone number"
            value={form.phone}
            onChange={updateField}
          />
        </label>

        <label>
          Service

          <select
            name="service"
            value={form.service}
            onChange={updateField}
          >
            <option value="Jewellery consultation">
              Jewellery consultation
            </option>

            <option value="Engagement ring consultation">
              Engagement ring
              consultation
            </option>

            <option value="Gemstone consultation">
              Gemstone consultation
            </option>

            <option value="Custom jewellery">
              Custom jewellery
            </option>

            <option value="Jewellery viewing">
              Jewellery viewing
            </option>
          </select>
        </label>

        <div className="appointment-date-grid">
          <label>
            Date *

            <input
              required
              type="date"
              name="appointment_date"
              value={
                form.appointment_date
              }
              onChange={updateField}
              min={
                new Date()
                  .toISOString()
                  .split("T")[0]
              }
            />
          </label>

          <label>
            Time *

            <input
              required
              type="time"
              name="appointment_time"
              value={
                form.appointment_time
              }
              onChange={updateField}
            />
          </label>
        </div>

        <label>
          Message

          <textarea
            rows="6"
            name="message"
            placeholder="Tell us anything that may help us prepare for your appointment."
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
            ? "Submitting..."
            : "Request Appointment"}
        </button>

        {result && (
          <p className="form-message">
            {result}
          </p>
        )}
      </form>
    </section>
  );
}