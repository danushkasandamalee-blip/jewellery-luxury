import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { supabase } from "../lib/supabaseClient";

import ProductGrid from "../components/ProductGrid";
import Loading from "../components/Loading";

export default function Shop() {
  const [products, setProducts] =
    useState([]);

  const [categories, setCategories] =
    useState([]);

  const [search, setSearch] =
    useState("");

  const [category, setCategory] =
    useState("");

  const [sort, setSort] =
    useState("newest");

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    loadShop();
  }, []);

  async function loadShop() {
    setLoading(true);
    setError("");

    const [
      productsResult,
      categoriesResult,
    ] = await Promise.all([
      supabase
        .from("products")
        .select(`
          *,
          product_images(*)
        `),

      supabase
        .from("categories")
        .select("*")
        .order("sort_order", {
          ascending: true,
        }),
    ]);

    if (productsResult.error) {
      console.error(
        productsResult.error
      );

      setError(
        "Unable to load products."
      );
    }

    if (categoriesResult.error) {
      console.error(
        categoriesResult.error
      );
    }

    setProducts(
      productsResult.data || []
    );

    setCategories(
      categoriesResult.data || []
    );

    setLoading(false);
  }

  const filteredProducts =
    useMemo(() => {
      let result = [...products];

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
              .includes(term) ||
            product.gemstone_type
              ?.toLowerCase()
              .includes(term) ||
            product.metal
              ?.toLowerCase()
              .includes(term)
        );
      }

      if (category) {
        result = result.filter(
          (product) =>
            product.category_id ===
            category
        );
      }

      if (sort === "newest") {
        result.sort(
          (a, b) =>
            new Date(
              b.created_at
            ) -
            new Date(
              a.created_at
            )
        );
      }

      if (sort === "low") {
        result.sort(
          (a, b) =>
            Number(
              a.sale_price ??
                a.price ??
                0
            ) -
            Number(
              b.sale_price ??
                b.price ??
                0
            )
        );
      }

      if (sort === "high") {
        result.sort(
          (a, b) =>
            Number(
              b.sale_price ??
                b.price ??
                0
            ) -
            Number(
              a.sale_price ??
                a.price ??
                0
            )
        );
      }

      return result;
    }, [
      products,
      search,
      category,
      sort,
    ]);

  if (loading) {
    return <Loading />;
  }

  return (
    <section className="section">
      <div className="page-title">
        <p className="eyebrow">
          Explore
        </p>

        <h1>
          Jewellery
        </h1>

        <p>
          Discover our collection of
          fine jewellery and gemstones.
        </p>
      </div>

      <div className="shop-toolbar">
        <input
          type="search"
          placeholder="Search jewellery..."
          value={search}
          onChange={(event) =>
            setSearch(
              event.target.value
            )
          }
        />

        <select
          value={category}
          onChange={(event) =>
            setCategory(
              event.target.value
            )
          }
        >
          <option value="">
            All Categories
          </option>

          {categories.map(
            (item) => (
              <option
                key={item.id}
                value={item.id}
              >
                {item.name}
              </option>
            )
          )}
        </select>

        <select
          value={sort}
          onChange={(event) =>
            setSort(
              event.target.value
            )
          }
        >
          <option value="newest">
            Newest
          </option>

          <option value="low">
            Price: Low to High
          </option>

          <option value="high">
            Price: High to Low
          </option>
        </select>
      </div>

      <p className="result-count">
        {filteredProducts.length}{" "}
        {filteredProducts.length === 1
          ? "piece"
          : "pieces"}
      </p>

      {error ? (
        <div className="empty-message">
          <p>{error}</p>
        </div>
      ) : (
        <ProductGrid
          products={
            filteredProducts
          }
        />
      )}
    </section>
  );
}