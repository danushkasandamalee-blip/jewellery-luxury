import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Link,
} from "react-router-dom";

import { supabase } from "../lib/supabaseClient";

import Loading from "../components/Loading";

function formatPrice(
  price,
  currency = "LKR"
) {
  if (
    price === null ||
    price === undefined
  ) {
    return "—";
  }

  return `${currency || "LKR"} ${Number(
    price
  ).toLocaleString()}`;
}

function getPrimaryImage(product) {
  const images =
    product.product_images || [];

  const primary =
    images.find(
      (image) => image.is_primary
    );

  return (
    primary?.image_url ||
    images[0]?.image_url ||
    ""
  );
}

export default function Products() {
  const [products, setProducts] =
    useState([]);

  const [search, setSearch] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    setLoading(true);

    const {
      data,
      error,
    } = await supabase
      .from("products")
      .select(`
        *,
        categories(name),
        collections(name),
        product_images(*)
      `)
      .order("created_at", {
        ascending: false,
      });

    if (error) {
      console.error(error);

      alert(
        "Unable to load products."
      );
    }

    setProducts(data || []);

    setLoading(false);
  }

  async function deleteProduct(
    product
  ) {
    const confirmed =
      window.confirm(
        `Delete "${product.name}" permanently?`
      );

    if (!confirmed) {
      return;
    }

    const storagePaths =
      (
        product.product_images ||
        []
      )
        .map(
          (image) =>
            image.storage_path
        )
        .filter(Boolean);

    if (
      storagePaths.length > 0
    ) {
      const {
        error: storageError,
      } = await supabase.storage
        .from("product-media")
        .remove(storagePaths);

      if (storageError) {
        console.error(
          storageError
        );
      }
    }

    const {
      error,
    } = await supabase
      .from("products")
      .delete()
      .eq("id", product.id);

    if (error) {
      alert(error.message);
      return;
    }

    setProducts(
      products.filter(
        (item) =>
          item.id !== product.id
      )
    );
  }

  async function toggleActive(
    product
  ) {
    const {
      error,
    } = await supabase
      .from("products")
      .update({
        is_active:
          !product.is_active,
      })
      .eq("id", product.id);

    if (error) {
      alert(error.message);
      return;
    }

    loadProducts();
  }

  const filteredProducts =
    useMemo(() => {
      let result =
        [...products];

      if (search.trim()) {
        const term =
          search
            .trim()
            .toLowerCase();

        result = result.filter(
          (product) =>
            product.name
              ?.toLowerCase()
              .includes(term) ||
            product.sku
              ?.toLowerCase()
              .includes(term) ||
            product.gemstone
              ?.toLowerCase()
              .includes(term)
        );
      }

      if (statusFilter) {
        result = result.filter(
          (product) =>
            product.status ===
            statusFilter
        );
      }

      return result;
    }, [
      products,
      search,
      statusFilter,
    ]);

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
            Products
          </h1>
        </div>

        <Link
          to="/admin/products/new"
          className="luxury-button"
        >
          + Add Product
        </Link>
      </div>

      <div className="admin-toolbar">
        <input
          className="admin-search"
          type="search"
          placeholder="Search by product, SKU or gemstone..."
          value={search}
          onChange={(event) =>
            setSearch(
              event.target.value
            )
          }
        />

        <select
          value={statusFilter}
          onChange={(event) =>
            setStatusFilter(
              event.target.value
            )
          }
        >
          <option value="">
            All Statuses
          </option>

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
      </div>

      <p className="admin-muted">
        {filteredProducts.length}
        {" "}
        product
        {filteredProducts.length ===
        1
          ? ""
          : "s"}
      </p>

      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>
                Image
              </th>

              <th>
                SKU
              </th>

              <th>
                Product
              </th>

              <th>
                Category
              </th>

              <th>
                Price
              </th>

              <th>
                Qty
              </th>

              <th>
                Status
              </th>

              <th>
                Visible
              </th>

              <th>
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {filteredProducts.map(
              (product) => {
                const image =
                  getPrimaryImage(
                    product
                  );

                return (
                  <tr
                    key={product.id}
                  >
                    <td>
                      {image ? (
                        <img
                          className="admin-thumb"
                          src={image}
                          alt=""
                        />
                      ) : (
                        <div className="admin-thumb admin-thumb-empty">
                          —
                        </div>
                      )}
                    </td>

                    <td>
                      {product.sku ||
                        "—"}
                    </td>

                    <td>
                      <strong>
                        {
                          product.name
                        }
                      </strong>

                      {product.new_arrival && (
                        <small className="table-tag">
                          New
                        </small>
                      )}

                      {product.featured && (
                        <small className="table-tag">
                          Featured
                        </small>
                      )}
                    </td>

                    <td>
                      {product.categories
                        ?.name || "—"}
                    </td>

                    <td>
                      {formatPrice(
                        product.sale_price ??
                          product.price,
                        product.currency
                      )}
                    </td>

                    <td>
                      {
                        product.quantity
                      }
                    </td>

                    <td>
                      <span className="status-label">
                        {product.status
                          ?.replaceAll(
                            "_",
                            " "
                          )}
                      </span>
                    </td>

                    <td>
                      {product.is_active
                        ? "Yes"
                        : "No"}
                    </td>

                    <td className="table-actions">
                      <Link
                        to={`/admin/products/${product.id}/edit`}
                      >
                        Edit
                      </Link>

                      <button
                        type="button"
                        onClick={() =>
                          toggleActive(
                            product
                          )
                        }
                      >
                        {product.is_active
                          ? "Hide"
                          : "Show"}
                      </button>

                      <button
                        type="button"
                        className="danger-link"
                        onClick={() =>
                          deleteProduct(
                            product
                          )
                        }
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              }
            )}

            {filteredProducts.length ===
              0 && (
              <tr>
                <td
                  colSpan="9"
                  className="admin-empty-cell"
                >
                  No products found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}