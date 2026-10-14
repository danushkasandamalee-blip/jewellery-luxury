// import {
//   useEffect,
//   useState,
// } from "react";

// import { supabase } from "../lib/supabaseClient";

// import Loading from "../components/Loading";

// const settingFields = [
//   {
//     key: "business_name",
//     label: "Business Name",
//     type: "text",
//   },

//   {
//     key: "phone",
//     label: "Telephone",
//     type: "text",
//   },

//   {
//     key: "whatsapp",
//     label: "WhatsApp Number",
//     type: "text",
//   },

//   {
//     key: "email",
//     label: "Email",
//     type: "email",
//   },

//   {
//     key: "address",
//     label: "Address",
//     type: "textarea",
//   },

//   {
//     key: "business_hours",
//     label: "Business Hours",
//     type: "textarea",
//   },

//   {
//     key: "currency",
//     label: "Currency",
//     type: "text",
//   },

//   {
//     key: "about_text",
//     label: "About Text",
//     type: "textarea",
//   },

//   {
//     key: "footer_text",
//     label: "Footer Text",
//     type: "textarea",
//   },

//   {
//     key: "seo_title",
//     label: "SEO Title",
//     type: "text",
//   },

//   {
//     key: "seo_description",
//     label: "SEO Description",
//     type: "textarea",
//   },
// ];

// export default function WebsiteSettings() {
//   const [settings, setSettings] =
//     useState({});

//   const [loading, setLoading] =
//     useState(true);

//   const [saving, setSaving] =
//     useState(false);

//   const [message, setMessage] =
//     useState("");

//   useEffect(() => {
//     loadSettings();
//   }, []);

//   async function loadSettings() {
//     const {
//       data,
//       error,
//     } = await supabase
//       .from("site_settings")
//       .select("*");

//     if (error) {
//       console.error(error);
//     }

//     const map = {};

//     for (const item of data || []) {
//       map[
//         item.setting_key
//       ] = item.setting_value || "";
//     }

//     setSettings(map);

//     setLoading(false);
//   }

//   async function saveSettings(
//     event
//   ) {
//     event.preventDefault();

//     setSaving(true);
//     setMessage("");

//     const rows =
//       settingFields.map(
//         (field) => ({
//           setting_key:
//             field.key,

//           setting_value:
//             settings[
//               field.key
//             ] || "",
//         })
//       );

//     const {
//       error,
//     } = await supabase
//       .from("site_settings")
//       .upsert(
//         rows,
//         {
//           onConflict:
//             "setting_key",
//         }
//       );

//     if (error) {
//       setMessage(
//         error.message
//       );

//       setSaving(false);
//       return;
//     }

//     setMessage(
//       "Website settings saved."
//     );

//     setSaving(false);
//   }

//   if (loading) {
//     return <Loading />;
//   }

//   return (
//     <div className="admin-page">
//       <div className="admin-page-header">
//         <div>
//           <p className="eyebrow">
//             Website
//           </p>

//           <h1>
//             Website Settings
//           </h1>
//         </div>
//       </div>

//       <form
//         className="admin-form narrow"
//         onSubmit={
//           saveSettings
//         }
//       >
//         {settingFields.map(
//           (field) => (
//             <Field
//               key={field.key}
//               label={
//                 field.label
//               }
//             >
//               {field.type ===
//               "textarea" ? (
//                 <textarea
//                   rows="5"
//                   value={
//                     settings[
//                       field.key
//                     ] || ""
//                   }
//                   onChange={(event) =>
//                     setSettings({
//                       ...settings,

//                       [field.key]:
//                         event.target
//                           .value,
//                     })
//                   }
//                 />
//               ) : (
//                 <input
//                   type={
//                     field.type
//                   }
//                   value={
//                     settings[
//                       field.key
//                     ] || ""
//                   }
//                   onChange={(event) =>
//                     setSettings({
//                       ...settings,

//                       [field.key]:
//                         event.target
//                           .value,
//                     })
//                   }
//                 />
//               )}
//             </Field>
//           )
//         )}

//         <button
//           type="submit"
//           className="luxury-button"
//           disabled={saving}
//         >
//           {saving
//             ? "Saving..."
//             : "Save Settings"}
//         </button>

//         {message && (
//           <p className="admin-success-message">
//             {message}
//           </p>
//         )}
//       </form>
//     </div>
//   );
// }

// function Field({
//   label,
//   children,
// }) {
//   return (
//     <label className="form-field">
//       <span>{label}</span>

//       {children}
//     </label>
//   );
// }
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
    icon: "🏢",
    placeholder: "Enter your business name",
    section: "General Information",
  },
  {
    key: "phone",
    label: "Telephone",
    type: "text",
    icon: "📞",
    placeholder: "+1 (555) 000-0000",
    section: "General Information",
  },
  {
    key: "whatsapp",
    label: "WhatsApp Number",
    type: "text",
    icon: "💬",
    placeholder: "+1 (555) 000-0000",
    section: "General Information",
  },
  {
    key: "email",
    label: "Email",
    type: "email",
    icon: "✉️",
    placeholder: "contact@business.com",
    section: "General Information",
  },
  {
    key: "address",
    label: "Address",
    type: "textarea",
    icon: "📍",
    placeholder: "Enter your full address",
    section: "General Information",
  },
  {
    key: "business_hours",
    label: "Business Hours",
    type: "textarea",
    icon: "🕐",
    placeholder: "Mon - Fri: 9:00 AM - 6:00 PM",
    section: "General Information",
  },
  {
    key: "currency",
    label: "Currency",
    type: "text",
    icon: "💰",
    placeholder: "USD, EUR, GBP...",
    section: "General Information",
  },
  {
    key: "about_text",
    label: "About Text",
    type: "textarea",
    icon: "📝",
    placeholder: "Tell visitors about your business...",
    section: "Content",
  },
  {
    key: "footer_text",
    label: "Footer Text",
    type: "textarea",
    icon: "🔻",
    placeholder: "Footer copyright or tagline...",
    section: "Content",
  },
  {
    key: "seo_title",
    label: "SEO Title",
    type: "text",
    icon: "🔍",
    placeholder: "Page title for search engines",
    section: "SEO",
  },
  {
    key: "seo_description",
    label: "SEO Description",
    type: "textarea",
    icon: "📊",
    placeholder: "Meta description for search engines...",
    section: "SEO",
  },
];

const sectionIcons = {
  "General Information": "⚙️",
  Content: "📄",
  SEO: "🚀",
};

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

  // Group fields by section for display
  const sections = [];
  settingFields.forEach((field) => {
    const sectionName = field.section || "General";
    let section = sections.find((s) => s.name === sectionName);
    if (!section) {
      section = { name: sectionName, fields: [] };
      sections.push(section);
    }
    section.fields.push(field);
  });

  return (
    <div className="admin-page">
      {/* Decorative gradient background */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background:
            "radial-gradient(ellipse at top left, rgba(212,175,55,0.06) 0%, transparent 50%), radial-gradient(ellipse at bottom right, rgba(212,175,55,0.04) 0%, transparent 50%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 1,
        }}
      >
        <div className="admin-page-header">
          <div>
            <p className="eyebrow">
              Website
            </p>

            <h1
              style={{
                display: "flex",
                alignItems: "center",
                gap: "14px",
              }}
            >
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "48px",
                  height: "48px",
                  borderRadius: "14px",
                  background:
                    "linear-gradient(135deg, #d4af37 0%, #b8960c 100%)",
                  fontSize: "22px",
                  boxShadow:
                    "0 8px 24px rgba(212,175,55,0.35)",
                }}
              >
                🌐
              </span>
              Website Settings
            </h1>
          </div>
        </div>

        <form
          className="admin-form narrow"
          onSubmit={saveSettings}
        >
          {sections.map((section) => (
            <div
              key={section.name}
              style={{
                marginBottom: "2rem",
                borderRadius: "18px",
                border:
                  "1px solid rgba(212,175,55,0.18)",
                background:
                  "linear-gradient(145deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)",
                backdropFilter: "blur(10px)",
                overflow: "hidden",
                boxShadow:
                  "0 4px 24px rgba(0,0,0,0.08)",
              }}
            >
              {/* Section Header */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "1rem 1.5rem",
                  borderBottom:
                    "1px solid rgba(212,175,55,0.12)",
                  background:
                    "linear-gradient(90deg, rgba(212,175,55,0.08) 0%, transparent 100%)",
                }}
              >
                <span
                  style={{
                    fontSize: "18px",
                  }}
                >
                  {sectionIcons[section.name] || "📌"}
                </span>
                <span
                  style={{
                    fontWeight: 700,
                    fontSize: "0.95rem",
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    color: "#d4af37",
                  }}
                >
                  {section.name}
                </span>
              </div>

              {/* Section Fields */}
              <div
                style={{
                  padding: "1.5rem",
                  display: "flex",
                  flexDirection: "column",
                  gap: "1.25rem",
                }}
              >
                {section.fields.map((field) => (
                  <Field
                    key={field.key}
                    label={field.label}
                    icon={field.icon}
                    type={field.type}
                  >
                    {field.type === "textarea" ? (
                      <textarea
                        rows="5"
                        placeholder={field.placeholder}
                        value={
                          settings[field.key] || ""
                        }
                        onChange={(event) =>
                          setSettings({
                            ...settings,
                            [field.key]:
                              event.target.value,
                          })
                        }
                        style={{
                          resize: "vertical",
                          minHeight: "100px",
                        }}
                      />
                    ) : (
                      <input
                        type={field.type}
                        placeholder={field.placeholder}
                        value={
                          settings[field.key] || ""
                        }
                        onChange={(event) =>
                          setSettings({
                            ...settings,
                            [field.key]:
                              event.target.value,
                          })
                        }
                      />
                    )}
                  </Field>
                ))}
              </div>
            </div>
          ))}

          {/* Save Button */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              marginTop: "0.5rem",
            }}
          >
            <button
              type="submit"
              className="luxury-button"
              disabled={saving}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "14px 32px",
                fontSize: "0.95rem",
                letterSpacing: "0.05em",
              }}
            >
              {saving ? (
                <>
                  <span
                    style={{
                      display: "inline-block",
                      width: "16px",
                      height: "16px",
                      border:
                        "2px solid rgba(255,255,255,0.3)",
                      borderTopColor:
                        "#fff",
                      borderRadius: "50%",
                      animation:
                        "spin 0.6s linear infinite",
                    }}
                  />
                  Saving...
                </>
              ) : (
                <>
                  <span>💾</span>
                  Save Settings
                </>
              )}
            </button>
          </div>

          {message && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "12px 18px",
                borderRadius: "12px",
                background:
                  message
                    .toLowerCase()
                    .includes("error") ||
                  message
                    .toLowerCase()
                    .includes("fail")
                    ? "rgba(220, 53, 69, 0.12)"
                    : "rgba(40, 167, 69, 0.12)",
                border:
                  message
                    .toLowerCase()
                    .includes("error") ||
                  message
                    .toLowerCase()
                    .includes("fail")
                    ? "1px solid rgba(220, 53, 69, 0.3)"
                    : "1px solid rgba(40, 167, 69, 0.3)",
                color:
                  message
                    .toLowerCase()
                    .includes("error") ||
                  message
                    .toLowerCase()
                    .includes("fail")
                    ? "#dc3545"
                    : "#28a745",
                fontSize: "0.9rem",
                fontWeight: 500,
                marginTop: "0.5rem",
              }}
            >
              <span>
                {message
                  .toLowerCase()
                  .includes("error") ||
                message
                  .toLowerCase()
                  .includes("fail")
                  ? "⚠️"
                  : "✅"}
              </span>
              {message}
            </div>
          )}
        </form>

        {/* Spin animation */}
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    </div>
  );
}

function Field({
  label,
  icon,
  type,
  children,
}) {
  return (
    <label
      className="form-field"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "8px",
      }}
    >
      <span
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          fontSize: "0.85rem",
          fontWeight: 600,
          letterSpacing: "0.04em",
          textTransform: "uppercase",
          color: "rgba(212,175,55,0.85)",
        }}
      >
        {icon && (
          <span
            style={{
              fontSize: "14px",
              opacity: 0.9,
            }}
          >
            {icon}
          </span>
        )}
        {label}
      </span>

      <div
        style={{
          position: "relative",
          borderRadius: "12px",
          transition: "all 0.2s ease",
        }}
        className="field-input-wrapper"
      >
        {children}
      </div>
    </label>
  );
}