import {
  useEffect,
  useState,
} from "react";

import { supabase } from "../lib/supabaseClient";

import Loading from "../components/Loading";

export default function SocialMedia() {
  const [items, setItems] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [message, setMessage] =
    useState("");

  useEffect(() => {
    loadSocialLinks();
  }, []);

  async function loadSocialLinks() {
    const {
      data,
      error,
    } = await supabase
      .from("social_links")
      .select("*")
      .order("sort_order");

    if (error) {
      console.error(error);
    }

    setItems(data || []);

    setLoading(false);
  }

  function updateItem(
    id,
    field,
    value
  ) {
    setItems(
      items.map(
        (item) =>
          item.id === id
            ? {
                ...item,

                [field]:
                  value,
              }
            : item
      )
    );
  }

  async function saveLinks() {
    setSaving(true);
    setMessage("");

    for (const item of items) {
      const {
        error,
      } = await supabase
        .from("social_links")
        .update({
          url:
            item.url?.trim() ||
            "",

          is_active:
            item.is_active,

          sort_order:
            item.sort_order,
        })
        .eq(
          "id",
          item.id
        );

      if (error) {
        setMessage(
          error.message
        );

        setSaving(false);
        return;
      }
    }

    setMessage(
      "Social media links saved."
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
            Social Media
          </h1>
        </div>
      </div>

      <div className="admin-form narrow">
        {items.map(
          (item) => (
            <div
              key={item.id}
              className="social-setting"
            >
              <div className="social-setting-title">
                <strong>
                  {
                    item.platform
                  }
                </strong>
              </div>

              <input
                type="url"
                placeholder="https://..."
                value={
                  item.url || ""
                }
                onChange={(event) =>
                  updateItem(
                    item.id,
                    "url",
                    event.target
                      .value
                  )
                }
              />

              <div className="social-setting-options">
                <label className="simple-checkbox">
                  <input
                    type="checkbox"
                    checked={
                      item.is_active
                    }
                    onChange={(event) =>
                      updateItem(
                        item.id,
                        "is_active",
                        event.target
                          .checked
                      )
                    }
                  />

                  Active
                </label>

                <label>
                  Order

                  <input
                    className="small-number-input"
                    type="number"
                    value={
                      item.sort_order ||
                      0
                    }
                    onChange={(event) =>
                      updateItem(
                        item.id,
                        "sort_order",
                        Number(
                          event.target
                            .value
                        )
                      )
                    }
                  />
                </label>
              </div>
            </div>
          )
        )}

        <button
          type="button"
          className="luxury-button"
          disabled={saving}
          onClick={saveLinks}
        >
          {saving
            ? "Saving..."
            : "Save Social Links"}
        </button>

        {message && (
          <p className="admin-success-message">
            {message}
          </p>
        )}
      </div>
    </div>
  );
}