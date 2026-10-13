import { Link } from "react-router-dom";

export default function CollectionBanner({
  collection,
}) {
  if (!collection) {
    return null;
  }

  const image =
    collection.banner_url ||
    collection.image_url ||
    "";

  const style = image
    ? {
        backgroundImage: `
          linear-gradient(
            rgba(0, 0, 0, 0.18),
            rgba(0, 0, 0, 0.28)
          ),
          url("${image}")
        `,
      }
    : {};

  return (
    <section
      className="collection-banner"
      style={style}
    >
      <div className="collection-banner-content">
        <p className="eyebrow">
          Signature Collection
        </p>

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

        <Link
          to={`/collections/${collection.slug}`}
          className="luxury-button light"
        >
          Discover
        </Link>
      </div>
    </section>
  );
}