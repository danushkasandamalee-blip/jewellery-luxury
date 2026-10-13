import {
  useEffect,
  useState,
} from "react";

import { supabase } from "../lib/supabaseClient";

import Loading from "../components/Loading";

const settingFields = [
  {
    key: "business_name",
    label: "Business Name",
    type: "text",
  },

  {
    key: "phone",
    label: "Telephone",
    type: "text",
  },

  {
    key: "whatsapp",
    label: "WhatsApp Number",
    type: "text",
  },

  {
    key: "email",
    label: "Email",
    type: "email",
  },

  {
    key: "address",
    label: "Address",
    type: "textarea",
  },

  {
    key: "business_hours",
    label: "Business Hours",
    type: "textarea",
  },

  {
    key: "currency",
    label: "Currency",
    type: "text",
  },

  {
    key: "about_text",
    label: "About Text",
    type: "textarea",
  },

  {
    key: "footer_text",
    label: "Footer Text",
    type: "textarea",
  },

  {
    key: "seo_title",
    label: "SEO Title",
    type: "text",
  },

  {
    key: "seo_description",
    label: "SEO Description",
    type: "textarea",
  },
];

export default function WebsiteSettings() {
  const [settings, setSettings] =
    useState({});

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [message, setMessage] =
    useState("");

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

    const map = {};

    for (const item of data || []) {
      map[
        item.setting_key
      ] = item.setting_value || "";
    }

    setSettings(map);

    setLoading(false);
  }

  async function saveSettings(
    event
  ) {
    event.preventDefault();

    setSaving(true);
    setMessage("");

    const rows =
      settingFields.map(
        (field) => ({
          setting_key:
            field.key,

          setting_value:
            settings[
              field.key
            ] || "",
        })
      );

    const {
      error,
    } = await supabase
      .from("site_settings")
      .upsert(
        rows,
        {
          onConflict:
            "setting_key",
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
      "Website settings saved."
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
            Website Settings
          </h1>
        </div>
      </div>

      <form
        className="admin-form narrow"
        onSubmit={
          saveSettings
        }
      >
        {settingFields.map(
          (field) => (
            <Field
              key={field.key}
              label={
                field.label
              }
            >
              {field.type ===
              "textarea" ? (
                <textarea
                  rows="5"
                  value={
                    settings[
                      field.key
                    ] || ""
                  }
                  onChange={(event) =>
                    setSettings({
                      ...settings,

                      [field.key]:
                        event.target
                          .value,
                    })
                  }
                />
              ) : (
                <input
                  type={
                    field.type
                  }
                  value={
                    settings[
                      field.key
                    ] || ""
                  }
                  onChange={(event) =>
                    setSettings({
                      ...settings,

                      [field.key]:
                        event.target
                          .value,
                    })
                  }
                />
              )}
            </Field>
          )
        )}

        <button
          type="submit"
          className="luxury-button"
          disabled={saving}
        >
          {saving
            ? "Saving..."
            : "Save Settings"}
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