import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { supabase } from "../lib/supabaseClient";

import Hero from "../components/Hero";
import CategoryCard from "../components/CategoryCard";
import ProductGrid from "../components/ProductGrid";
import CollectionBanner from "../components/CollectionBanner";
import Loading from "../components/Loading";

export default function Home() {
  const [loading, setLoading] = useState(true);

  const [hero, setHero] = useState(null);
  const [categories, setCategories] = useState([]);
  const [newProducts, setNewProducts] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [featuredCollection, setFeaturedCollection] = useState(null);

  useEffect(() => {
    loadHome();
  }, []);

  async function loadHome() {
    try {
      const [
        heroResult,
        categoriesResult,
        newProductsResult,
        featuredProductsResult,
        featuredCollectionResult,
      ] = await Promise.all([
        supabase
          .from("homepage_sections")
          .select("*")
          .eq("section_key", "hero")
          .maybeSingle(),

        supabase
          .from("categories")
          .select("*")
          .order("sort_order", {
            ascending: true,
          })
          .limit(6),

        supabase
          .from("products")
          .select(`
            *,
            product_images(*)
          `)
          .eq("new_arrival", true)
          .order("created_at", {
            ascending: false,
          })
          .limit(8),

        supabase
          .from("products")
          .select(`
            *,
            product_images(*)
          `)
          .eq("featured", true)
          .order("created_at", {
            ascending: false,
          })
          .limit(8),

        supabase
          .from("collections")
          .select("*")
          .eq("is_featured", true)
          .order("sort_order", {
            ascending: true,
          })
          .limit(1)
          .maybeSingle(),
      ]);

      if (heroResult.error) {
        console.error(
          "Hero error:",
          heroResult.error
        );
      }

      if (categoriesResult.error) {
        console.error(
          "Categories error:",
          categoriesResult.error
        );
      }

      if (newProductsResult.error) {
        console.error(
          "New products error:",
          newProductsResult.error
        );
      }

      if (featuredProductsResult.error) {
        console.error(
          "Featured products error:",
          featuredProductsResult.error
        );
      }

      if (featuredCollectionResult.error) {
        console.error(
          "Featured collection error:",
          featuredCollectionResult.error
        );
      }

      setHero(heroResult.data || null);

      setCategories(
        categoriesResult.data || []
      );

      setNewProducts(
        newProductsResult.data || []
      );

      setFeaturedProducts(
        featuredProductsResult.data || []
      );

      setFeaturedCollection(
        featuredCollectionResult.data || null
      );
    } catch (error) {
      console.error(
        "Homepage loading failed:",
        error
      );
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <Hero
        title={
          hero?.title ||
          "Timeless Jewellery"
        }
        subtitle={
          hero?.subtitle ||
          "Created for life's unforgettable moments."
        }
        imageUrl={
          hero?.image_url || ""
        }
        buttonText={
          hero?.button_text ||
          "Discover"
        }
        buttonUrl={
          hero?.button_url ||
          "/shop"
        }
      />

      <section className="section">
        <div className="section-heading">
          <p className="eyebrow">
            Discover
          </p>

          <h2>
            Shop by Category
          </h2>

          <p>
            Explore jewellery created
            for every style and occasion.
          </p>
        </div>

        <div className="category-grid">
          {categories.map(
            (category) => (
              <CategoryCard
                key={category.id}
                category={category}
              />
            )
          )}
        </div>
      </section>

      {newProducts.length > 0 && (
        <section className="section">
          <div className="section-heading">
            <p className="eyebrow">
              Latest
            </p>

            <h2>
              New Arrivals
            </h2>
          </div>

          <ProductGrid
            products={newProducts}
          />

          <div className="section-action">
            <Link
              to="/shop"
              className="luxury-button"
            >
              View All Jewellery
            </Link>
          </div>
        </section>
      )}

      {featuredCollection && (
        <CollectionBanner
          collection={
            featuredCollection
          }
        />
      )}

      {featuredProducts.length > 0 && (
        <section className="section section-soft">
          <div className="section-heading">
            <p className="eyebrow">
              Selected
            </p>

            <h2>
              Featured Jewellery
            </h2>
          </div>

          <ProductGrid
            products={
              featuredProducts
            }
          />
        </section>
      )}

      <section className="story-banner">
        <div>
          <p className="eyebrow">
            Our Story
          </p>

          <h2>
            Jewellery with character.
          </h2>

          <p>
            Discover fine jewellery,
            gemstones and timeless pieces
            chosen for life's meaningful
            moments.
          </p>

          <Link
            to="/about"
            className="luxury-button"
          >
            Discover Our Story
          </Link>
        </div>
      </section>
    </>
  );
}