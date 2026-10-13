import ProductCard from "./ProductCard";

export default function ProductGrid({
  products = [],
}) {
  if (!products.length) {
    return (
      <div className="empty-message">
        <h3>
          No jewellery found
        </h3>

        <p>
          Products will appear here
          once they are added.
        </p>
      </div>
    );
  }

  return (
    <div className="product-grid">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
        />
      ))}
    </div>
  );
}