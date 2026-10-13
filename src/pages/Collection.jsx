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

export default function Collection() {
  const { slug } = useParams();

  const [collection, setCollection] =
    useState(null);

  const [products, setProducts] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    loadCollection();
  }, [slug]);

  async function loadCollection() {
    setLoading(true);

    const {
      data: collectionData,
      error: collectionError,
    } = await supabase
      .from("collections")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();

    if (collectionError) {
      console.error(
        collectionError
      );

      setCollection(null);
      setLoading(false);
      return;
    }

    setCollection(
      collectionData
    );

    if (!collectionData) {
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
        "collection_id",
        collectionData.id
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

  if (!collection) {
    return (
      <section className="section">
        <div className="empty-message">
          <h1>
            Collection not found
          </h1>

          <p>
            The requested collection
            does not exist.
          </p>
        </div>
      </section>
    );
  }

  return (
    <>
      {(collection.banner_url ||
        collection.image_url) && (
        <section
          className="collection-hero"
          style={{
            backgroundImage: `
              linear-gradient(
                rgba(0,0,0,.18),
                rgba(0,0,0,.26)
              ),
              url("${
                collection.banner_url ||
                collection.image_url
              }")
            `,
          }}
        >
          <div className="collection-hero-content">
            <p className="eyebrow">
              Collection
            </p>

            <h1>
              {collection.name}
            </h1>
          </div>
        </section>
      )}

      <section className="section">
        <div className="page-title">
          {!collection.banner_url &&
            !collection.image_url && (
              <>
                <p className="eyebrow">
                  Collection
                </p>

                <h1>
                  {
                    collection.name
                  }
                </h1>
              </>
            )}

          {collection.description && (
            <p>
              {
                collection.description
              }
            </p>
          )}
        </div>

        <ProductGrid
          products={products}
        />
      </section>
    </>
  );
}