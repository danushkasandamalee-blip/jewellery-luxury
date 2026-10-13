export default function WhatsAppButton({
  phone = "",
  product = null,
  className = "",
}) {
  function normalizePhone(value) {
    let number =
      String(value || "").replace(
        /\D/g,
        ""
      );

    /*
      Sri Lankan local format:
      0712345678
      becomes
      94712345678
    */
    if (
      number.startsWith("0") &&
      number.length === 10
    ) {
      number =
        "94" + number.slice(1);
    }

    return number;
  }

  function openWhatsApp() {
    const number =
      normalizePhone(phone);

    if (!number) {
      alert(
        "WhatsApp number has not been configured yet."
      );

      return;
    }

    let message =
      "Hello, I would like more information about your jewellery.";

    if (product) {
      message =
        `Hello, I'm interested in:\n\n` +
        `${product.name}\n` +
        `SKU: ${
          product.sku || "N/A"
        }\n\n` +
        `Could you please provide more information?`;
    }

    const url =
      `https://wa.me/${number}` +
      `?text=${encodeURIComponent(
        message
      )}`;

    window.open(
      url,
      "_blank",
      "noopener,noreferrer"
    );
  }

  return (
    <button
      type="button"
      onClick={openWhatsApp}
      className={`luxury-button full ${className}`}
    >
      Inquire on WhatsApp
    </button>
  );
}