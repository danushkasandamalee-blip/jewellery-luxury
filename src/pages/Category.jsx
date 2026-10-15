import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { supabase } from "../lib/supabaseClient";

import ProductGrid from "../components/ProductGrid";
import Loading from "../components/Loading";

export default function Category() {
  const { slug } = useParams();

  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadCategory() {
      setLoading(true);
      setError("");
      setCategory(null);
      setProducts([]);

      try {
        /* =========================================
           1. LOAD CATEGORY
           ========================================= */

        const {
          data: categoryData,
          error: categoryError,
        } = await supabase
          .from("categories")
          .select("*")
          .eq("slug", slug)
          .maybeSingle();

        if (categoryError) {
          throw categoryError;
        }

        if (!isMounted) {
          return;
        }

        /* Category does not exist */
        if (!categoryData) {
          setCategory(null);
          setProducts([]);
          setLoading(false);
          return;
        }

        setCategory(categoryData);

        /* =========================================
           2. LOAD PRODUCTS FROM THIS CATEGORY
           ========================================= */

        const {
          data: productData,
          error: productError,
        } = await supabase
          .from("products")
          .select(`
            *,
            product_images(*)
          `)
          .eq("category_id", categoryData.id)
          .order("created_at", {
            ascending: false,
          });

        if (productError) {
          throw productError;
        }

        if (!isMounted) {
          return;
        }

        setProducts(productData || []);
      } catch (err) {
        console.error(
          "Category page loading error:",
          err
        );

        if (isMounted) {
          setError(
            "We could not load this category. Please try again."
          );

          setProducts([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    if (slug) {
      loadCategory();
    } else {
      setLoading(false);
    }

    return () => {
      isMounted = false;
    };
  }, [slug]);

  /* =========================================
     LOADING
     ========================================= */

  if (loading) {
    return <Loading />;
  }

  /* =========================================
     ERROR
     ========================================= */

  if (error) {
    return (
      <main>
        <section className="section">
          <div className="empty-message">
            <p className="eyebrow">
              Jewellery
            </p>

            <h1>
              Something went wrong
            </h1>

            <p>
              {error}
            </p>
          </div>
        </section>
      </main>
    );
  }

  /* =========================================
     CATEGORY NOT FOUND
     ========================================= */

  if (!category) {
    return (
      <main>
        <section className="section">
          <div className="empty-message">
            <p className="eyebrow">
              Jewellery
            </p>

            <h1>
              Category not found
            </h1>

            <p>
              The requested jewellery category
              does not exist.
            </p>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="category-page">

      {/* =====================================
          CATEGORY HERO
          ===================================== */}

      {category.image_url ? (
        <section
          className="category-hero"
          style={{
            backgroundImage: `
              linear-gradient(
                rgba(0, 0, 0, 0.12),
                rgba(0, 0, 0, 0.28)
              ),
              url("${category.image_url}")
            `,
          }}
        >
          <div className="category-hero-content">

            <p className="eyebrow">
              Jewellery
            </p>

            <h1>
              {category.name}
            </h1>

          </div>
        </section>
      ) : (
        <section className="section">
          <div className="page-title">

            <p className="eyebrow">
              Jewellery
            </p>

            <h1>
              {category.name}
            </h1>

            {category.description && (
              <p>
                {category.description}
              </p>
            )}

          </div>
        </section>
      )}


      {/* =====================================
          CATEGORY PRODUCTS
          ===================================== */}

      <section className="section">

        {category.image_url &&
          category.description && (
            <div className="category-intro">
              <p>
                {category.description}
              </p>
            </div>
          )}


        {/* PRODUCT COUNT */}

        <div className="category-products-header">
          <p>
            {products.length}{" "}
            {products.length === 1
              ? "piece"
              : "pieces"}
          </p>
        </div>


        {/* PRODUCTS */}

        {products.length > 0 ? (
          <ProductGrid
            products={products}
          />
        ) : (
          <div className="empty-message">

            <h2>
              Coming Soon
            </h2>

            <p>
              New pieces are being added to
              this collection.
            </p>

          </div>
        )}

      </section>

    </main>
  );
}