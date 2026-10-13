import { Link } from "react-router-dom";

export default function Hero({
  title = "Timeless Jewellery",
  subtitle =
    "Created for life's unforgettable moments.",
  imageUrl = "",
  buttonText = "Discover",
  buttonUrl = "/shop",
}) {
  const heroStyle = imageUrl
    ? {
        backgroundImage: `
          linear-gradient(
            rgba(0, 0, 0, 0.12),
            rgba(0, 0, 0, 0.22)
          ),
          url("${imageUrl}")
        `,
      }
    : {};

  return (
    <section
      className="hero-section"
      style={heroStyle}
    >
      <div className="hero-content">
        <p className="eyebrow">
          Fine Jewellery
        </p>

        <h1>{title}</h1>

        <p className="hero-subtitle">
          {subtitle}
        </p>

        <Link
          to={buttonUrl || "/shop"}
          className="luxury-button light"
        >
          {buttonText || "Discover"}
        </Link>
      </div>
    </section>
  );
}