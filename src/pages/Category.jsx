import {
  useEffect,
  useState,
} from "react";

import {
  useParams,
} from "react-router-dom";

import { supabase } from "../lib/supabaseClient";

import ProductGrid from "../components/ProductGrid";
import Loading from "../components/Loading";

export default function Category() {
  const { slug } = useParams();

  const [category, setCategory] =
    useState(null);

  const [products, setProducts] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    loadCategory();
  }, [slug]);

  async function loadCategory() {
    setLoading(true);

    const {
      data: categoryData,
      error: categoryError,
    } = await supabase
      .from("categories")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();

    if (categoryError) {
      console.error(
        categoryError
      );

      setCategory(null);
      setLoading(false);
      return;
    }

    setCategory(categoryData);

    if (!categoryData) {
      setProducts([]);
      setLoading(false);
      return;
    }

    const {
      data: productData,
      error: productError,
    } = await supabase
      .from("products")
      .select(`
        *,
        product_images(*)
      `)
      .eq(
        "category_id",
        categoryData.id
      )
      .order("created_at", {
        ascending: false,
      });

    if (productError) {
      console.error(
        productError
      );
    }

    setProducts(
      productData || []
    );

    setLoading(false);
  }

  if (loading) {
    return <Loading />;
  }

  if (!category) {
    return (
      <section className="section">
        <div className="empty-message">
          <h1>
            Category not found
          </h1>

          <p>
            The requested category does
            not exist.
          </p>
        </div>
      </section>
    );
  }

  return (
    <>
      {category.image_url && (
        <section
          className="category-hero"
          style={{
            backgroundImage: `
              linear-gradient(
                rgba(0,0,0,.15),
                rgba(0,0,0,.20)
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
      )}

      <section className="section">
        {!category.image_url && (
          <div className="page-title">
            <p className="eyebrow">
              Jewellery
            </p>

            <h1>
              {category.name}
            </h1>

            {category.description && (
              <p>
                {
                  category.description
                }
              </p>
            )}
          </div>
        )}

        {category.image_url &&
          category.description && (
            <div className="category-intro">
              <p>
                {
                  category.description
                }
              </p>
            </div>
          )}

        <ProductGrid
          products={products}
        />
      </section>
    </>
  );
}