import {
  useEffect,
  useState,
} from "react";

import {
  Link,
} from "react-router-dom";

import { supabase } from "../lib/supabaseClient";

import Loading from "../components/Loading";

export default function Collections() {
  const [collections, setCollections] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    loadCollections();
  }, []);

  async function loadCollections() {
    const {
      data,
      error,
    } = await supabase
      .from("collections")
      .select("*")
      .order("sort_order", {
        ascending: true,
      });

    if (error) {
      console.error(error);
    }

    setCollections(
      data || []
    );

    setLoading(false);
  }

  if (loading) {
    return <Loading />;
  }

  return (
    <section className="section">
      <div className="page-title">
        <p className="eyebrow">
          Discover
        </p>

        <h1>
          Collections
        </h1>

        <p>
          Explore jewellery brought
          together by design, character
          and inspiration.
        </p>
      </div>

      {collections.length === 0 ? (
        <div className="empty-message">
          <h3>
            No collections yet
          </h3>

          <p>
            Collections added in the
            admin panel will appear here.
          </p>
        </div>
      ) : (
        <div className="collection-grid">
          {collections.map(
            (collection) => (
              <Link
                key={collection.id}
                to={`/collections/${collection.slug}`}
                className="collection-card"
              >
                <div className="collection-image">
                  {collection.image_url ? (
                    <img
                      src={
                        collection.image_url
                      }
                      alt={
                        collection.name
                      }
                      loading="lazy"
                    />
                  ) : (
                    <div className="image-placeholder">
                      {
                        collection.name
                      }
                    </div>
                  )}
                </div>

                <h2>
                  {collection.name}
                </h2>

                {collection.short_description && (
                  <p>
                    {
                      collection.short_description
                    }
                  </p>
                )}
              </Link>
            )
          )}
        </div>
      )}
    </section>
  );
}