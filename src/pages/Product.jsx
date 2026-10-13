import {
  useEffect,
  useState,
} from "react";

import {
  Link,
  useParams,
} from "react-router-dom";

import { supabase } from "../lib/supabaseClient";

import Loading from "../components/Loading";
import WhatsAppButton from "../components/WhatsAppButton";

function formatCurrency(
  amount,
  currency = "LKR"
) {
  if (
    amount === null ||
    amount === undefined ||
    amount === ""
  ) {
    return "Price on request";
  }

  try {
    return new Intl.NumberFormat(
      "en-LK",
      {
        style: "currency",
        currency:
          currency || "LKR",
        maximumFractionDigits: 0,
      }
    ).format(Number(amount));
  } catch {
    return `${
      currency || "LKR"
    } ${Number(
      amount
    ).toLocaleString()}`;
  }
}

export default function Product() {
  const { slug } = useParams();

  const [product, setProduct] =
    useState(null);

  const [settings, setSettings] =
    useState({});

  const [activeImage, setActiveImage] =
    useState("");

  const [lightbox, setLightbox] =
    useState(false);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    loadProduct();
  }, [slug]);

  async function loadProduct() {
    setLoading(true);

    const [
      productResult,
      settingsResult,
    ] = await Promise.all([
      supabase
        .from("products")
        .select(`
          *,
          categories(name, slug),
          collections(name, slug),
          product_images(*)
        `)
        .eq("slug", slug)
        .maybeSingle(),

      supabase
        .from("site_settings")
        .select("*"),
    ]);

    if (productResult.error) {
      console.error(
        productResult.error
      );
    }

    const productData =
      productResult.data;

    if (productData) {
      const images =
        [
          ...(productData.product_images ||
            []),
        ].sort(
          (a, b) =>
            Number(
              a.sort_order || 0
            ) -
            Number(
              b.sort_order || 0
            )
        );

      productData.product_images =
        images;

      const primary =
        images.find(
          (image) =>
            image.is_primary
        ) || images[0];

      setActiveImage(
        primary?.image_url || ""
      );
    }

    setProduct(productData);

    const settingsMap = {};

    for (
      const item of
      settingsResult.data || []
    ) {
      settingsMap[
        item.setting_key
      ] = item.setting_value;
    }

    setSettings(settingsMap);

    setLoading(false);
  }

  if (loading) {
    return <Loading />;
  }

  if (!product) {
    return (
      <section className="section">
        <div className="empty-message">
          <h1>
            Product not found
          </h1>

          <Link
            to="/shop"
            className="luxury-button"
          >
            Return to Shop
          </Link>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="product-detail">
        <div className="product-gallery">
          <div
            className="product-main-image"
            onClick={() => {
              if (activeImage) {
                setLightbox(true);
              }
            }}
          >
            {activeImage ? (
              <img
                src={activeImage}
                alt={product.name}
              />
            ) : (
              <div className="image-placeholder">
                Jewellery
              </div>
            )}
          </div>

          {product.product_images
            ?.length > 1 && (
            <div className="product-thumbnails">
              {product.product_images.map(
                (image) => (
                  <button
                    type="button"
                    key={image.id}
                    className={
                      activeImage ===
                      image.image_url
                        ? "thumbnail-active"
                        : ""
                    }
                    onClick={() =>
                      setActiveImage(
                        image.image_url
                      )
                    }
                  >
                    <img
                      src={
                        image.image_url
                      }
                      alt={
                        image.alt_text ||
                        product.name
                      }
                    />
                  </button>
                )
              )}
            </div>
          )}
        </div>

        <div className="product-information">
          <p className="eyebrow">
            {product.categories
              ?.name ||
              "Fine Jewellery"}
          </p>

          <h1>
            {product.name}
          </h1>

          <div className="product-price">
            {product.sale_price ? (
              <>
                <span className="old-price">
                  {formatCurrency(
                    product.price,
                    product.currency
                  )}
                </span>

                <strong>
                  {formatCurrency(
                    product.sale_price,
                    product.currency
                  )}
                </strong>
              </>
            ) : (
              <strong>
                {formatCurrency(
                  product.price,
                  product.currency
                )}
              </strong>
            )}
          </div>

          {product.short_description && (
            <p className="product-intro">
              {
                product.short_description
              }
            </p>
          )}

          <div className="product-specs">
            {product.sku && (
              <div>
                <span>
                  Reference
                </span>

                <strong>
                  {product.sku}
                </strong>
              </div>
            )}

            {product.metal && (
              <div>
                <span>
                  Metal
                </span>

                <strong>
                  {product.metal}

                  {product.metal_purity
                    ? ` · ${product.metal_purity}`
                    : ""}
                </strong>
              </div>
            )}

            {product.gemstone && (
              <div>
                <span>
                  Gemstone
                </span>

                <strong>
                  {product.gemstone}

                  {product.gemstone_type
                    ? ` · ${product.gemstone_type}`
                    : ""}
                </strong>
              </div>
            )}

            {product.gemstone_color && (
              <div>
                <span>
                  Colour
                </span>

                <strong>
                  {
                    product.gemstone_color
                  }
                </strong>
              </div>
            )}

            {product.gross_weight && (
              <div>
                <span>
                  Gross Weight
                </span>

                <strong>
                  {
                    product.gross_weight
                  }{" "}
                  g
                </strong>
              </div>
            )}

            {product.stone_weight && (
              <div>
                <span>
                  Stone Weight
                </span>

                <strong>
                  {
                    product.stone_weight
                  }
                </strong>
              </div>
            )}

            {product.size && (
              <div>
                <span>
                  Size
                </span>

                <strong>
                  {product.size}
                </strong>
              </div>
            )}

            <div>
              <span>
                Availability
              </span>

              <strong>
                {product.status
                  ?.replaceAll(
                    "_",
                    " "
                  )}
              </strong>
            </div>
          </div>

          {product.description && (
            <div className="product-description">
              {product.description}
            </div>
          )}

          <WhatsAppButton
            phone={
              settings.whatsapp ||
              settings.phone
            }
            product={product}
          />

          <Link
            to="/appointment"
            className="luxury-button outline full"
          >
            Book an Appointment
          </Link>

          {product.collections && (
            <Link
              className="product-collection-link"
              to={`/collections/${product.collections.slug}`}
            >
              Explore{" "}
              {
                product.collections
                  .name
              }
            </Link>
          )}
        </div>
      </section>

      {lightbox && activeImage && (
        <div
          className="lightbox"
          onClick={() =>
            setLightbox(false)
          }
        >
          <button
            type="button"
            className="lightbox-close"
            onClick={() =>
              setLightbox(false)
            }
            aria-label="Close image"
          >
            ×
          </button>

          <img
            src={activeImage}
            alt={product.name}
            onClick={(event) =>
              event.stopPropagation()
            }
          />
        </div>
      )}
    </>
  );
}