import {
  useEffect,
  useState,
} from "react";

import { supabase } from "../lib/supabaseClient";

import Loading from "../components/Loading";

function slugify(value = "") {
  return value
    .toLowerCase()
    .trim()
    .replace(
      /[^a-z0-9]+/g,
      "-"
    )
    .replace(
      /^-+|-+$/g,
      ""
    );
}

const emptyForm = {
  name: "",
  slug: "",
  short_description: "",
  description: "",

  image_url: "",
  banner_url: "",

  is_featured: false,
  is_active: true,

  sort_order: 0,
};

export default function Collections() {
  const [items, setItems] =
    useState([]);

  const [form, setForm] =
    useState(emptyForm);

  const [
    editingId,
    setEditingId,
  ] = useState(null);

  const [loading, setLoading] =
    useState(true);

  const [
    uploading,
    setUploading,
  ] = useState("");

  useEffect(() => {
    loadCollections();
  }, []);

  async function loadCollections() {
    setLoading(true);

    const {
      data,
      error,
    } = await supabase
      .from("collections")
      .select("*")
      .order("sort_order");

    if (error) {
      alert(error.message);
    }

    setItems(data || []);

    setLoading(false);
  }

  function resetForm() {
    setEditingId(null);

    setForm(emptyForm);
  }

  function startEdit(item) {
    setEditingId(item.id);

    setForm({
      name:
        item.name || "",

      slug:
        item.slug || "",

      short_description:
        item.short_description ||
        "",

      description:
        item.description || "",

      image_url:
        item.image_url || "",

      banner_url:
        item.banner_url || "",

      is_featured:
        Boolean(
          item.is_featured
        ),

      is_active:
        item.is_active !== false,

      sort_order:
        item.sort_order || 0,
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  async function uploadImage(
    file,
    field,
    folder
  ) {
    if (!file) {
      return;
    }

    setUploading(field);

    const safeName =
      file.name.replace(
        /[^a-zA-Z0-9._-]/g,
        "-"
      );

    const path =
      `${folder}/` +
      `${crypto.randomUUID()}-${safeName}`;

    const {
      error,
    } = await supabase.storage
      .from("site-media")
      .upload(path, file);

    if (error) {
      alert(error.message);

      setUploading("");
      return;
    }

    const {
      data,
    } = supabase.storage
      .from("site-media")
      .getPublicUrl(path);

    setForm(
      (current) => ({
        ...current,

        [field]:
          data.publicUrl,
      })
    );

    setUploading("");
  }

  async function saveCollection(
    event
  ) {
    event.preventDefault();

    const payload = {
      name:
        form.name.trim(),

      slug:
        form.slug.trim() ||
        slugify(form.name),

      short_description:
        form.short_description.trim() ||
        null,

      description:
        form.description.trim() ||
        null,

      image_url:
        form.image_url ||
        null,

      banner_url:
        form.banner_url ||
        null,

      is_featured:
        form.is_featured,

      is_active:
        form.is_active,

      sort_order:
        Number(
          form.sort_order || 0
        ),
    };

    let error;

    if (editingId) {
      ({
        error,
      } = await supabase
        .from("collections")
        .update(payload)
        .eq(
          "id",
          editingId
        ));
    } else {
      ({
        error,
      } = await supabase
        .from("collections")
        .insert(payload));
    }

    if (error) {
      alert(error.message);
      return;
    }

    resetForm();

    loadCollections();
  }

  async function removeCollection(
    item
  ) {
    if (
      !window.confirm(
        `Delete "${item.name}"?`
      )
    ) {
      return;
    }

    const {
      error,
    } = await supabase
      .from("collections")
      .delete()
      .eq("id", item.id);

    if (error) {
      alert(error.message);
      return;
    }

    loadCollections();
  }

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <p className="eyebrow">
            Catalogue
          </p>

          <h1>
            Collections
          </h1>
        </div>
      </div>

      <div className="admin-two-column">
        <form
          className="admin-form"
          onSubmit={
            saveCollection
          }
        >
          <h2>
            {editingId
              ? "Edit Collection"
              : "Add Collection"}
          </h2>

          <Field label="Collection Name *">
            <input
              required
              value={form.name}
              onChange={(event) =>
                setForm(
                  (current) => ({
                    ...current,

                    name:
                      event.target
                        .value,

                    slug:
                      editingId
                        ? current.slug
                        : slugify(
                            event
                              .target
                              .value
                          ),
                  })
                )
              }
            />
          </Field>

          <Field label="Slug *">
            <input
              required
              value={form.slug}
              onChange={(event) =>
                setForm({
                  ...form,

                  slug:
                    event.target
                      .value,
                })
              }
            />
          </Field>

          <Field label="Short Description">
            <input
              value={
                form.short_description
              }
              onChange={(event) =>
                setForm({
                  ...form,

                  short_description:
                    event.target
                      .value,
                })
              }
            />
          </Field>

          <Field label="Description">
            <textarea
              rows="6"
              value={
                form.description
              }
              onChange={(event) =>
                setForm({
                  ...form,

                  description:
                    event.target
                      .value,
                })
              }
            />
          </Field>

          <Field label="Collection Image">
            {form.image_url && (
              <img
                className="settings-preview"
                src={
                  form.image_url
                }
                alt=""
              />
            )}

            <input
              type="file"
              accept="image/*"
              onChange={(event) =>
                uploadImage(
                  event.target
                    .files?.[0],

                  "image_url",

                  "collections"
                )
              }
            />

            {uploading ===
              "image_url" && (
              <small>
                Uploading...
              </small>
            )}
          </Field>

          <Field label="Banner Image">
            {form.banner_url && (
              <img
                className="homepage-preview"
                src={
                  form.banner_url
                }
                alt=""
              />
            )}

            <input
              type="file"
              accept="image/*"
              onChange={(event) =>
                uploadImage(
                  event.target
                    .files?.[0],

                  "banner_url",

                  "collection-banners"
                )
              }
            />

            {uploading ===
              "banner_url" && (
              <small>
                Uploading...
              </small>
            )}
          </Field>

          <Field label="Sort Order">
            <input
              type="number"
              value={
                form.sort_order
              }
              onChange={(event) =>
                setForm({
                  ...form,

                  sort_order:
                    event.target
                      .value,
                })
              }
            />
          </Field>

          <div className="checkbox-row">
            <label>
              <input
                type="checkbox"
                checked={
                  form.is_featured
                }
                onChange={(event) =>
                  setForm({
                    ...form,

                    is_featured:
                      event.target
                        .checked,
                  })
                }
              />

              Featured
            </label>

            <label>
              <input
                type="checkbox"
                checked={
                  form.is_active
                }
                onChange={(event) =>
                  setForm({
                    ...form,

                    is_active:
                      event.target
                        .checked,
                  })
                }
              />

              Active
            </label>
          </div>

          <div className="admin-form-actions">
            <button
              type="submit"
              className="luxury-button"
            >
              {editingId
                ? "Update Collection"
                : "Add Collection"}
            </button>

            {editingId && (
              <button
                type="button"
                className="admin-secondary-button"
                onClick={
                  resetForm
                }
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        <div className="admin-list">
          {items.map(
            (item) => (
              <div
                className="admin-list-card"
                key={item.id}
              >
                <div className="admin-list-card-main">
                  {item.image_url && (
                    <img
                      className="admin-list-image"
                      src={
                        item.image_url
                      }
                      alt=""
                    />
                  )}

                  <div>
                    <strong>
                      {item.name}
                    </strong>

                    <small>
                      /{item.slug}
                    </small>

                    {item.is_featured && (
                      <small>
                        Featured
                      </small>
                    )}
                  </div>
                </div>

                <div>
                  <button
                    type="button"
                    onClick={() =>
                      startEdit(
                        item
                      )
                    }
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    className="danger-link"
                    onClick={() =>
                      removeCollection(
                        item
                      )
                    }
                  >
                    Delete
                  </button>
                </div>
              </div>
            )
          )}
        </div>
      </div>
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