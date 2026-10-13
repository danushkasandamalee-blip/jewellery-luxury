import { Link } from "react-router-dom";

export default function CategoryCard({
  category,
}) {
  if (!category) {
    return null;
  }

  return (
    <Link
      to={`/category/${category.slug}`}
      className="category-card"
    >
      <div className="category-image">
        {category.image_url ? (
          <img
            src={category.image_url}
            alt={category.name}
            loading="lazy"
          />
        ) : (
          <div className="image-placeholder">
            {category.name}
          </div>
        )}
      </div>

      <h3>
        {category.name}
      </h3>

      {category.description && (
        <p className="category-description">
          {category.description}
        </p>
      )}
    </Link>
  );
}