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
  description: "",
  image_url: "",
  sort_order: 0,
  is_active: true,
};

export default function Categories() {
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
  ] = useState(false);

  useEffect(() => {
    loadCategories();
  }, []);

  async function loadCategories() {
    setLoading(true);

    const {
      data,
      error,
    } = await supabase
      .from("categories")
      .select("*")
      .order("sort_order", {
        ascending: true,
      });

    if (error) {
      console.error(error);

      alert(
        "Unable to load categories."
      );
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

      description:
        item.description || "",

      image_url:
        item.image_url || "",

      sort_order:
        item.sort_order || 0,

      is_active:
        item.is_active !== false,
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  async function uploadImage(
    file
  ) {
    if (!file) {
      return;
    }

    if (
      !file.type.startsWith(
        "image/"
      )
    ) {
      alert(
        "Please select an image."
      );

      return;
    }

    setUploading(true);

    const safeName =
      file.name.replace(
        /[^a-zA-Z0-9._-]/g,
        "-"
      );

    const path =
      `categories/` +
      `${crypto.randomUUID()}-${safeName}`;

    const {
      error,
    } = await supabase.storage
      .from("site-media")
      .upload(path, file);

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

    setForm((current) => ({
      ...current,
      image_url:
        data.publicUrl,
    }));

    setUploading(false);
  }

  async function saveCategory(
    event
  ) {
    event.preventDefault();

    if (!form.name.trim()) {
      return;
    }

    const payload = {
      name:
        form.name.trim(),

      slug:
        form.slug.trim() ||
        slugify(form.name),

      description:
        form.description.trim() ||
        null,

      image_url:
        form.image_url ||
        null,

      sort_order:
        Number(
          form.sort_order || 0
        ),

      is_active:
        form.is_active,
    };

    let error;

    if (editingId) {
      ({
        error,
      } = await supabase
        .from("categories")
        .update(payload)
        .eq(
          "id",
          editingId
        ));
    } else {
      ({
        error,
      } = await supabase
        .from("categories")
        .insert(payload));
    }

    if (error) {
      alert(error.message);
      return;
    }

    resetForm();

    loadCategories();
  }

  async function deleteCategory(
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
      .from("categories")
      .delete()
      .eq("id", item.id);

    if (error) {
      alert(error.message);
      return;
    }

    loadCategories();
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
            Categories
          </h1>
        </div>
      </div>

      <div className="admin-two-column">
        <form
          className="admin-form"
          onSubmit={
            saveCategory
          }
        >
          <h2>
            {editingId
              ? "Edit Category"
              : "Add Category"}
          </h2>

          <Field label="Category Name *">
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

          <Field label="Description">
            <textarea
              rows="5"
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

          <Field label="Category Image">
            {form.image_url && (
              <img
                className="settings-preview"
                src={
                  form.image_url
                }
                alt="Category"
              />
            )}

            <input
              type="file"
              accept="image/*"
              disabled={uploading}
              onChange={(event) =>
                uploadImage(
                  event.target
                    .files?.[0]
                )
              }
            />

            {uploading && (
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

          <label className="simple-checkbox">
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

          <div className="admin-form-actions">
            <button
              className="luxury-button"
              type="submit"
            >
              {editingId
                ? "Update Category"
                : "Add Category"}
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
                      src={
                        item.image_url
                      }
                      alt=""
                      className="admin-list-image"
                    />
                  )}

                  <div>
                    <strong>
                      {item.name}
                    </strong>

                    <small>
                      /{item.slug}
                    </small>

                    <small>
                      {item.is_active
                        ? "Active"
                        : "Hidden"}
                    </small>
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
                      deleteCategory(
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