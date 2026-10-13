import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import { supabase } from "../lib/supabaseClient";

import Loading from "../components/Loading";

function slugify(value = "") {
  return value
    .toString()
    .trim()
    .toLowerCase()
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
  sku: "",

  short_description: "",
  description: "",

  category_id: "",
  collection_id: "",

  price: "",
  sale_price: "",
  currency: "LKR",

  gemstone: "",
  gemstone_type: "",
  gemstone_color: "",

  metal: "",
  metal_purity: "",

  gross_weight: "",
  stone_weight: "",

  size: "",
  quantity: 1,

  status: "available",

  featured: false,
  new_arrival: false,
  best_seller: false,

  is_active: true,

  seo_title: "",
  seo_description: "",
};

export default function ProductForm() {
  const { id } = useParams();

  const navigate =
    useNavigate();

  const editing =
    Boolean(id);

  const [
    initialLoading,
    setInitialLoading,
  ] = useState(true);

  const [saving, setSaving] =
    useState(false);

  const [
    categories,
    setCategories,
  ] = useState([]);

  const [
    collections,
    setCollections,
  ] = useState([]);

  const [form, setForm] =
    useState(emptyForm);

  const [
    existingImages,
    setExistingImages,
  ] = useState([]);

  const [
    selectedImages,
    setSelectedImages,
  ] = useState([]);

  useEffect(() => {
    initialise();
  }, [id]);

  async function initialise() {
    setInitialLoading(true);

    const [
      categoryResult,
      collectionResult,
    ] = await Promise.all([
      supabase
        .from("categories")
        .select("*")
        .order("sort_order"),

      supabase
        .from("collections")
        .select("*")
        .order("sort_order"),
    ]);

    if (categoryResult.error) {
      console.error(
        categoryResult.error
      );
    }

    if (collectionResult.error) {
      console.error(
        collectionResult.error
      );
    }

    setCategories(
      categoryResult.data || []
    );

    setCollections(
      collectionResult.data || []
    );

    if (editing) {
      await loadProduct();
    } else {
      setForm(emptyForm);
      setExistingImages([]);
    }

    setInitialLoading(false);
  }

  async function loadProduct() {
    const {
      data,
      error,
    } = await supabase
      .from("products")
      .select(`
        *,
        product_images(*)
      `)
      .eq("id", id)
      .single();

    if (error) {
      alert(
        "Unable to load product."
      );

      console.error(error);
      return;
    }

    setForm({
      name:
        data.name || "",

      slug:
        data.slug || "",

      sku:
        data.sku || "",

      short_description:
        data.short_description ||
        "",

      description:
        data.description || "",

      category_id:
        data.category_id || "",

      collection_id:
        data.collection_id || "",

      price:
        data.price ?? "",

      sale_price:
        data.sale_price ?? "",

      currency:
        data.currency || "LKR",

      gemstone:
        data.gemstone || "",

      gemstone_type:
        data.gemstone_type ||
        "",

      gemstone_color:
        data.gemstone_color ||
        "",

      metal:
        data.metal || "",

      metal_purity:
        data.metal_purity || "",

      gross_weight:
        data.gross_weight ?? "",

      stone_weight:
        data.stone_weight ?? "",

      size:
        data.size || "",

      quantity:
        data.quantity ?? 1,

      status:
        data.status ||
        "available",

      featured:
        Boolean(data.featured),

      new_arrival:
        Boolean(
          data.new_arrival
        ),

      best_seller:
        Boolean(
          data.best_seller
        ),

      is_active:
        data.is_active !== false,

      seo_title:
        data.seo_title || "",

      seo_description:
        data.seo_description ||
        "",
    });

    setExistingImages(
      [
        ...(data.product_images ||
          []),
      ].sort(
        (a, b) =>
          Number(
            a.sort_order || 0
          ) -
          Number(
            b.sort_order || 0
          )
      )
    );
  }

  function handleChange(event) {
    const {
      name,
      value,
      type,
      checked,
    } = event.target;

    setForm((current) => ({
      ...current,

      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  }

  function handleNameChange(
    event
  ) {
    const value =
      event.target.value;

    setForm((current) => ({
      ...current,
      name: value,

      slug:
        !editing ||
        current.slug ===
          slugify(
            current.name
          )
          ? slugify(value)
          : current.slug,
    }));
  }

  function preparePayload() {
    return {
      name:
        form.name.trim(),

      slug:
        form.slug.trim() ||
        slugify(form.name),

      sku:
        form.sku.trim() ||
        null,

      short_description:
        form.short_description.trim() ||
        null,

      description:
        form.description.trim() ||
        null,

      category_id:
        form.category_id ||
        null,

      collection_id:
        form.collection_id ||
        null,

      price:
        form.price === ""
          ? null
          : Number(
              form.price
            ),

      sale_price:
        form.sale_price === ""
          ? null
          : Number(
              form.sale_price
            ),

      currency:
        form.currency.trim() ||
        "LKR",

      gemstone:
        form.gemstone.trim() ||
        null,

      gemstone_type:
        form.gemstone_type.trim() ||
        null,

      gemstone_color:
        form.gemstone_color.trim() ||
        null,

      metal:
        form.metal.trim() ||
        null,

      metal_purity:
        form.metal_purity.trim() ||
        null,

      gross_weight:
        form.gross_weight === ""
          ? null
          : Number(
              form.gross_weight
            ),

      stone_weight:
        form.stone_weight === ""
          ? null
          : Number(
              form.stone_weight
            ),

      size:
        form.size.trim() ||
        null,

      quantity:
        Number(
          form.quantity || 0
        ),

      status:
        form.status,

      featured:
        form.featured,

      new_arrival:
        form.new_arrival,

      best_seller:
        form.best_seller,

      is_active:
        form.is_active,

      seo_title:
        form.seo_title.trim() ||
        null,

      seo_description:
        form.seo_description.trim() ||
        null,
    };
  }

  async function saveProduct(
    event
  ) {
    event.preventDefault();

    if (!form.name.trim()) {
      alert(
        "Product name is required."
      );

      return;
    }

    setSaving(true);

    const payload =
      preparePayload();

    let productId = id;

    if (editing) {
      const {
        error,
      } = await supabase
        .from("products")
        .update(payload)
        .eq("id", id);

      if (error) {
        alert(error.message);

        setSaving(false);
        return;
      }
    } else {
      const {
        data,
        error,
      } = await supabase
        .from("products")
        .insert(payload)
        .select("id")
        .single();

      if (error) {
        alert(error.message);

        setSaving(false);
        return;
      }

      productId = data.id;
    }

    if (
      selectedImages.length >
      0
    ) {
      const success =
        await uploadImages(
          productId
        );

      if (!success) {
        setSaving(false);

        return;
      }
    }

    setSaving(false);

    navigate(
      "/admin/products"
    );
  }

  async function uploadImages(
    productId
  ) {
    let sortOrder =
      existingImages.length;

    for (
      let index = 0;
      index <
      selectedImages.length;
      index++
    ) {
      const file =
        selectedImages[index];

      if (
        !file.type.startsWith(
          "image/"
        )
      ) {
        alert(
          `${file.name} is not an image.`
        );

        continue;
      }

      const maxSize =
        8 * 1024 * 1024;

      if (file.size > maxSize) {
        alert(
          `${file.name} is larger than 8 MB.`
        );

        continue;
      }

      const safeName =
        file.name.replace(
          /[^a-zA-Z0-9._-]/g,
          "-"
        );

      const storagePath =
        `${productId}/` +
        `${crypto.randomUUID()}-${safeName}`;

      const {
        error: uploadError,
      } = await supabase.storage
        .from("product-media")
        .upload(
          storagePath,
          file,
          {
            cacheControl:
              "3600",

            upsert: false,
          }
        );

      if (uploadError) {
        console.error(
          uploadError
        );

        alert(
          `Image upload failed: ${uploadError.message}`
        );

        return false;
      }

      const {
        data: publicData,
      } =
        supabase.storage
          .from(
            "product-media"
          )
          .getPublicUrl(
            storagePath
          );

      const shouldBePrimary =
        existingImages.length ===
          0 &&
        index === 0;

      const {
        error: imageInsertError,
      } = await supabase
        .from("product_images")
        .insert({
          product_id:
            productId,

          image_url:
            publicData.publicUrl,

          storage_path:
            storagePath,

          alt_text:
            form.name,

          sort_order:
            sortOrder,

          is_primary:
            shouldBePrimary,
        });

      if (imageInsertError) {
        console.error(
          imageInsertError
        );

        alert(
          `Unable to save image record: ${imageInsertError.message}`
        );

        return false;
      }

      sortOrder++;
    }

    return true;
  }

  async function deleteImage(
    image
  ) {
    const confirmed =
      window.confirm(
        "Delete this image?"
      );

    if (!confirmed) {
      return;
    }

    if (
      image.storage_path
    ) {
      const {
        error: storageError,
      } = await supabase.storage
        .from("product-media")
        .remove([
          image.storage_path,
        ]);

      if (storageError) {
        console.error(
          storageError
        );
      }
    }

    const {
      error,
    } = await supabase
      .from("product_images")
      .delete()
      .eq("id", image.id);

    if (error) {
      alert(error.message);
      return;
    }

    const remaining =
      existingImages.filter(
        (item) =>
          item.id !== image.id
      );

    setExistingImages(
      remaining
    );

    if (
      image.is_primary &&
      remaining.length > 0
    ) {
      await makePrimary(
        remaining[0]
      );
    }
  }

  async function makePrimary(
    image
  ) {
    if (!editing) {
      return;
    }

    const {
      error: clearError,
    } = await supabase
      .from("product_images")
      .update({
        is_primary: false,
      })
      .eq(
        "product_id",
        id
      );

    if (clearError) {
      alert(
        clearError.message
      );

      return;
    }

    const {
      error,
    } = await supabase
      .from("product_images")
      .update({
        is_primary: true,
      })
      .eq("id", image.id);

    if (error) {
      alert(error.message);
      return;
    }

    setExistingImages(
      existingImages.map(
        (item) => ({
          ...item,

          is_primary:
            item.id ===
            image.id,
        })
      )
    );
  }

  async function moveImage(
    image,
    direction
  ) {
    const currentIndex =
      existingImages.findIndex(
        (item) =>
          item.id === image.id
      );

    const targetIndex =
      currentIndex +
      direction;

    if (
      targetIndex < 0 ||
      targetIndex >=
        existingImages.length
    ) {
      return;
    }

    const reordered =
      [...existingImages];

    [
      reordered[currentIndex],
      reordered[targetIndex],
    ] = [
      reordered[targetIndex],
      reordered[currentIndex],
    ];

    const updates =
      reordered.map(
        (item, index) => ({
          ...item,
          sort_order: index,
        })
      );

    setExistingImages(
      updates
    );

    for (
      let index = 0;
      index <
      updates.length;
      index++
    ) {
      await supabase
        .from("product_images")
        .update({
          sort_order:
            index,
        })
        .eq(
          "id",
          updates[index].id
        );
    }
  }

  if (initialLoading) {
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
            {editing
              ? "Edit Product"
              : "Add Product"}
          </h1>
        </div>

        <button
          type="button"
          className="admin-secondary-button"
          onClick={() =>
            navigate(
              "/admin/products"
            )
          }
        >
          Back
        </button>
      </div>

      <form
        className="admin-form"
        onSubmit={saveProduct}
      >
        <section className="admin-form-section">
          <h2>
            Basic Information
          </h2>

          <div className="form-grid">
            <Field
              label="Product Name *"
            >
              <input
                required
                name="name"
                value={form.name}
                onChange={
                  handleNameChange
                }
              />
            </Field>

            <Field label="Slug *">
              <input
                required
                name="slug"
                value={form.slug}
                onChange={
                  handleChange
                }
              />
            </Field>

            <Field label="SKU">
              <input
                name="sku"
                value={form.sku}
                onChange={
                  handleChange
                }
              />
            </Field>

            <Field label="Status">
              <select
                name="status"
                value={
                  form.status
                }
                onChange={
                  handleChange
                }
              >
                <option value="available">
                  Available
                </option>

                <option value="reserved">
                  Reserved
                </option>

                <option value="sold">
                  Sold
                </option>

                <option value="made_to_order">
                  Made to Order
                </option>

                <option value="hidden">
                  Hidden
                </option>
              </select>
            </Field>

            <Field label="Category">
              <select
                name="category_id"
                value={
                  form.category_id
                }
                onChange={
                  handleChange
                }
              >
                <option value="">
                  No Category
                </option>

                {categories.map(
                  (category) => (
                    <option
                      key={
                        category.id
                      }
                      value={
                        category.id
                      }
                    >
                      {
                        category.name
                      }
                    </option>
                  )
                )}
              </select>
            </Field>

            <Field label="Collection">
              <select
                name="collection_id"
                value={
                  form.collection_id
                }
                onChange={
                  handleChange
                }
              >
                <option value="">
                  No Collection
                </option>

                {collections.map(
                  (collection) => (
                    <option
                      key={
                        collection.id
                      }
                      value={
                        collection.id
                      }
                    >
                      {
                        collection.name
                      }
                    </option>
                  )
                )}
              </select>
            </Field>
          </div>

          <Field label="Short Description">
            <textarea
              name="short_description"
              rows="3"
              value={
                form.short_description
              }
              onChange={
                handleChange
              }
            />
          </Field>

          <Field label="Full Description">
            <textarea
              name="description"
              rows="8"
              value={
                form.description
              }
              onChange={
                handleChange
              }
            />
          </Field>
        </section>

        <section className="admin-form-section">
          <h2>
            Pricing
          </h2>

          <div className="form-grid">
            <Field label="Price">
              <input
                type="number"
                min="0"
                step="0.01"
                name="price"
                value={form.price}
                onChange={
                  handleChange
                }
              />
            </Field>

            <Field label="Sale Price">
              <input
                type="number"
                min="0"
                step="0.01"
                name="sale_price"
                value={
                  form.sale_price
                }
                onChange={
                  handleChange
                }
              />
            </Field>

            <Field label="Currency">
              <input
                name="currency"
                value={
                  form.currency
                }
                onChange={
                  handleChange
                }
              />
            </Field>

            <Field label="Quantity">
              <input
                type="number"
                min="0"
                name="quantity"
                value={
                  form.quantity
                }
                onChange={
                  handleChange
                }
              />
            </Field>
          </div>
        </section>

        <section className="admin-form-section">
          <h2>
            Jewellery Details
          </h2>

          <div className="form-grid">
            <Field label="Gemstone">
              <input
                name="gemstone"
                value={
                  form.gemstone
                }
                onChange={
                  handleChange
                }
              />
            </Field>

            <Field label="Gemstone Type">
              <input
                name="gemstone_type"
                value={
                  form.gemstone_type
                }
                onChange={
                  handleChange
                }
              />
            </Field>

            <Field label="Gemstone Colour">
              <input
                name="gemstone_color"
                value={
                  form.gemstone_color
                }
                onChange={
                  handleChange
                }
              />
            </Field>

            <Field label="Metal">
              <input
                name="metal"
                value={form.metal}
                onChange={
                  handleChange
                }
              />
            </Field>

            <Field label="Metal Purity">
              <input
                name="metal_purity"
                value={
                  form.metal_purity
                }
                onChange={
                  handleChange
                }
              />
            </Field>

            <Field label="Size">
              <input
                name="size"
                value={form.size}
                onChange={
                  handleChange
                }
              />
            </Field>

            <Field label="Gross Weight (g)">
              <input
                type="number"
                step="0.001"
                min="0"
                name="gross_weight"
                value={
                  form.gross_weight
                }
                onChange={
                  handleChange
                }
              />
            </Field>

            <Field label="Stone Weight">
              <input
                type="number"
                step="0.001"
                min="0"
                name="stone_weight"
                value={
                  form.stone_weight
                }
                onChange={
                  handleChange
                }
              />
            </Field>
          </div>
        </section>

        <section className="admin-form-section">
          <h2>
            Visibility
          </h2>

          <div className="checkbox-row">
            <label>
              <input
                type="checkbox"
                name="featured"
                checked={
                  form.featured
                }
                onChange={
                  handleChange
                }
              />

              Featured
            </label>

            <label>
              <input
                type="checkbox"
                name="new_arrival"
                checked={
                  form.new_arrival
                }
                onChange={
                  handleChange
                }
              />

              New Arrival
            </label>

            <label>
              <input
                type="checkbox"
                name="best_seller"
                checked={
                  form.best_seller
                }
                onChange={
                  handleChange
                }
              />

              Best Seller
            </label>

            <label>
              <input
                type="checkbox"
                name="is_active"
                checked={
                  form.is_active
                }
                onChange={
                  handleChange
                }
              />

              Active
            </label>
          </div>
        </section>

        <section className="admin-form-section">
          <h2>
            Product Images
          </h2>

          {editing &&
            existingImages.length >
              0 && (
              <div className="admin-image-grid">
                {existingImages.map(
                  (
                    image,
                    index
                  ) => (
                    <div
                      key={
                        image.id
                      }
                      className="admin-image-card"
                    >
                      <img
                        src={
                          image.image_url
                        }
                        alt=""
                      />

                      {image.is_primary && (
                        <span className="primary-image-badge">
                          Primary
                        </span>
                      )}

                      <div className="image-order-buttons">
                        <button
                          type="button"
                          disabled={
                            index === 0
                          }
                          onClick={() =>
                            moveImage(
                              image,
                              -1
                            )
                          }
                        >
                          ←
                        </button>

                        <button
                          type="button"
                          disabled={
                            index ===
                            existingImages.length -
                              1
                          }
                          onClick={() =>
                            moveImage(
                              image,
                              1
                            )
                          }
                        >
                          →
                        </button>
                      </div>

                      {!image.is_primary && (
                        <button
                          type="button"
                          onClick={() =>
                            makePrimary(
                              image
                            )
                          }
                        >
                          Set Primary
                        </button>
                      )}

                      <button
                        type="button"
                        className="danger-button"
                        onClick={() =>
                          deleteImage(
                            image
                          )
                        }
                      >
                        Delete
                      </button>
                    </div>
                  )
                )}
              </div>
            )}

          <Field label="Upload Images">
            <input
              type="file"
              multiple
              accept="image/jpeg,image/png,image/webp,image/avif"
              onChange={(event) =>
                setSelectedImages(
                  Array.from(
                    event.target
                      .files || []
                  )
                )
              }
            />

            {selectedImages.length >
              0 && (
              <small>
                {
                  selectedImages.length
                }{" "}
                image
                {selectedImages.length ===
                1
                  ? ""
                  : "s"}{" "}
                selected
              </small>
            )}
          </Field>
        </section>

        <section className="admin-form-section">
          <h2>
            SEO
          </h2>

          <Field label="SEO Title">
            <input
              name="seo_title"
              value={
                form.seo_title
              }
              onChange={
                handleChange
              }
            />
          </Field>

          <Field label="SEO Description">
            <textarea
              rows="4"
              name="seo_description"
              value={
                form.seo_description
              }
              onChange={
                handleChange
              }
            />
          </Field>
        </section>

        <div className="admin-form-actions">
          <button
            type="submit"
            className="luxury-button"
            disabled={saving}
          >
            {saving
              ? "Saving..."
              : editing
              ? "Update Product"
              : "Create Product"}
          </button>

          <button
            type="button"
            className="admin-secondary-button"
            onClick={() =>
              navigate(
                "/admin/products"
              )
            }
          >
            Cancel
          </button>
        </div>
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