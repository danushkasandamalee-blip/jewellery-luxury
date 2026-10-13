import {
  useEffect,
  useState,
} from "react";

import { supabase } from "../lib/supabaseClient";

import Loading from "../components/Loading";

const initialHero = {
  section_key: "hero",

  title:
    "Timeless Jewellery",

  subtitle:
    "Created for life's unforgettable moments.",

  image_url: "",

  button_text:
    "Discover",

  button_url:
    "/shop",

  is_enabled: true,

  sort_order: 1,

  content: {},
};

export default function Homepage() {
  const [hero, setHero] =
    useState(initialHero);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [
    uploading,
    setUploading,
  ] = useState(false);

  const [message, setMessage] =
    useState("");

  useEffect(() => {
    loadHomepage();
  }, []);

  async function loadHomepage() {
    const {
      data,
      error,
    } = await supabase
      .from("homepage_sections")
      .select("*")
      .eq(
        "section_key",
        "hero"
      )
      .maybeSingle();

    if (error) {
      console.error(error);
    }

    if (data) {
      setHero({
        ...initialHero,
        ...data,
      });
    }

    setLoading(false);
  }

  async function uploadHero(
    file
  ) {
    if (!file) {
      return;
    }

    setUploading(true);

    const safeName =
      file.name.replace(
        /[^a-zA-Z0-9._-]/g,
        "-"
      );

    const path =
      `hero/` +
      `${crypto.randomUUID()}-${safeName}`;

    const {
      error,
    } = await supabase.storage
      .from("site-media")
      .upload(
        path,
        file
      );

    if (error) {
      alert(error.message);

      setUploading(false);
      return;
    }

    const {
      data,
    } = supabase.storage
      .from("site-media")
      .getPublicUrl(path);

    setHero(
      (current) => ({
        ...current,

        image_url:
          data.publicUrl,
      })
    );

    setUploading(false);
  }

  async function saveHomepage(
    event
  ) {
    event.preventDefault();

    setSaving(true);
    setMessage("");

    const {
      error,
    } = await supabase
      .from("homepage_sections")
      .upsert(
        {
          ...hero,

          section_key:
            "hero",
        },

        {
          onConflict:
            "section_key",
        }
      );

    if (error) {
      setMessage(
        error.message
      );

      setSaving(false);
      return;
    }

    setMessage(
      "Homepage updated successfully."
    );

    setSaving(false);
  }

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <p className="eyebrow">
            Website
          </p>

          <h1>
            Homepage Editor
          </h1>
        </div>
      </div>

      <form
        className="admin-form narrow"
        onSubmit={
          saveHomepage
        }
      >
        <section className="admin-form-section">
          <h2>
            Hero Section
          </h2>

          <Field label="Hero Title">
            <input
              value={
                hero.title || ""
              }
              onChange={(event) =>
                setHero({
                  ...hero,

                  title:
                    event.target
                      .value,
                })
              }
            />
          </Field>

          <Field label="Subtitle">
            <textarea
              rows="4"
              value={
                hero.subtitle || ""
              }
              onChange={(event) =>
                setHero({
                  ...hero,

                  subtitle:
                    event.target
                      .value,
                })
              }
            />
          </Field>

          <Field label="Hero Image">
            {hero.image_url && (
              <img
                className="homepage-preview"
                src={
                  hero.image_url
                }
                alt=""
              />
            )}

            <input
              type="file"
              accept="image/*"
              disabled={uploading}
              onChange={(event) =>
                uploadHero(
                  event.target
                    .files?.[0]
                )
              }
            />

            {uploading && (
              <small>
                Uploading hero
                image...
              </small>
            )}
          </Field>

          <div className="form-grid">
            <Field label="Button Text">
              <input
                value={
                  hero.button_text ||
                  ""
                }
                onChange={(event) =>
                  setHero({
                    ...hero,

                    button_text:
                      event.target
                        .value,
                  })
                }
              />
            </Field>

            <Field label="Button URL">
              <input
                value={
                  hero.button_url ||
                  ""
                }
                onChange={(event) =>
                  setHero({
                    ...hero,

                    button_url:
                      event.target
                        .value,
                  })
                }
              />
            </Field>
          </div>

          <label className="simple-checkbox">
            <input
              type="checkbox"
              checked={
                hero.is_enabled !==
                false
              }
              onChange={(event) =>
                setHero({
                  ...hero,

                  is_enabled:
                    event.target
                      .checked,
                })
              }
            />

            Hero Enabled
          </label>
        </section>

        <button
          type="submit"
          className="luxury-button"
          disabled={saving}
        >
          {saving
            ? "Saving..."
            : "Save Homepage"}
        </button>

        {message && (
          <p className="admin-success-message">
            {message}
          </p>
        )}
      </form>
    </div>
  );
}

function Field({
  label,
  children,
}) {
  return (
    <label className="form-field">
      <span>{label}</span>

      {children}
    </label>
  );
}