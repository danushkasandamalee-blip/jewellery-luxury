import { Link } from "react-router-dom";

function formatCurrency(
  amount,
  currency = "LKR"
) {
  if (
    amount === null ||
    amount === undefined
  ) {
    return "";
  }

  return new Intl.NumberFormat("en-LK", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(Number(amount));
}

function getPrimaryImage(product) {
  const images =
    product?.product_images || [];

  if (!images.length) {
    return "";
  }

  const primary =
    images.find(
      (image) => image.is_primary
    );

  if (primary) {
    return primary.image_url;
  }

  const sorted =
    [...images].sort(
      (a, b) =>
        (a.sort_order || 0) -
        (b.sort_order || 0)
    );

  return sorted[0]?.image_url || "";
}

export default function ProductCard({
  product,
}) {
  const image =
    getPrimaryImage(product);

  return (
    <Link
      to={`/product/${product.slug}`}
      className="product-card"
    >

      <div className="product-card-image">

        {image ? (
          <img
            src={image}
            alt={product.name}
          />
        ) : (
          <div className="image-placeholder">
            Jewellery
          </div>
        )}

        {product.new_arrival && (
          <span className="product-badge">
            New
          </span>
        )}

      </div>

      <div className="product-card-info">

        <h3>
          {product.name}
        </h3>

        {product.metal && (
          <p>{product.metal}</p>
        )}

        <strong>
          {formatCurrency(
            product.sale_price ||
              product.price,
            product.currency
          )}
        </strong>

      </div>

    </Link>
  );
}