import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <section className="not-found">
      <p className="eyebrow">
        Error 404
      </p>

      <h1>
        Page not found.
      </h1>

      <p>
        The page you're looking for
        doesn't exist.
      </p>

      <Link
        to="/"
        className="luxury-button"
      >
        Return Home
      </Link>
    </section>
  );
}