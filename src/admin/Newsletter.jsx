import {
  useEffect,
  useState,
} from "react";

import { supabase } from "../lib/supabaseClient";

import Loading from "../components/Loading";

export default function Newsletter() {
  const [items, setItems] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    loadSubscribers();
  }, []);

  async function loadSubscribers() {
    setLoading(true);

    const {
      data,
      error,
    } = await supabase
      .from(
        "newsletter_subscribers"
      )
      .select("*")
      .order("created_at", {
        ascending: false,
      });

    if (error) {
      console.error(error);

      alert(
        "Unable to load subscribers."
      );
    }

    setItems(data || []);

    setLoading(false);
  }

  async function toggleSubscription(
    item
  ) {
    const {
      error,
    } = await supabase
      .from(
        "newsletter_subscribers"
      )
      .update({
        subscribed:
          !item.subscribed,
      })
      .eq("id", item.id);

    if (error) {
      alert(error.message);
      return;
    }

    setItems(
      items.map(
        (subscriber) =>
          subscriber.id ===
          item.id
            ? {
                ...subscriber,

                subscribed:
                  !subscriber.subscribed,
              }
            : subscriber
      )
    );
  }

  async function removeSubscriber(
    item
  ) {
    if (
      !window.confirm(
        `Remove ${item.email}?`
      )
    ) {
      return;
    }

    const {
      error,
    } = await supabase
      .from(
        "newsletter_subscribers"
      )
      .delete()
      .eq("id", item.id);

    if (error) {
      alert(error.message);
      return;
    }

    setItems(
      items.filter(
        (subscriber) =>
          subscriber.id !==
          item.id
      )
    );
  }

  function exportCSV() {
    if (!items.length) {
      return;
    }

    const rows = [
      [
        "Email",
        "Subscribed",
        "Created At",
      ],

      ...items.map(
        (item) => [
          item.email,

          item.subscribed
            ? "Yes"
            : "No",

          item.created_at,
        ]
      ),
    ];

    const csv =
      rows
        .map((row) =>
          row
            .map((value) =>
              `"${String(
                value ?? ""
              ).replaceAll(
                '"',
                '""'
              )}"`
            )
            .join(",")
        )
        .join("\n");

    const blob =
      new Blob(
        [csv],
        {
          type:
            "text/csv;charset=utf-8;",
        }
      );

    const url =
      URL.createObjectURL(
        blob
      );

    const link =
      document.createElement(
        "a"
      );

    link.href = url;

    link.download =
      "newsletter-subscribers.csv";

    link.click();

    URL.revokeObjectURL(
      url
    );
  }

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <p className="eyebrow">
            Marketing
          </p>

          <h1>
            Newsletter
          </h1>
        </div>

        <button
          type="button"
          className="admin-secondary-button"
          onClick={exportCSV}
        >
          Export CSV
        </button>
      </div>

      <p className="admin-muted">
        {items.length}
        {" "}
        subscriber
        {items.length === 1
          ? ""
          : "s"}
      </p>

      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>
                Email
              </th>

              <th>
                Joined
              </th>

              <th>
                Status
              </th>

              <th />
            </tr>
          </thead>

          <tbody>
            {items.map(
              (item) => (
                <tr
                  key={item.id}
                >
                  <td>
                    <a
                      href={`mailto:${item.email}`}
                    >
                      {
                        item.email
                      }
                    </a>
                  </td>

                  <td>
                    {new Date(
                      item.created_at
                    ).toLocaleDateString()}
                  </td>

                  <td>
                    <button
                      type="button"
                      className={
                        item.subscribed
                          ? "status-toggle active"
                          : "status-toggle"
                      }
                      onClick={() =>
                        toggleSubscription(
                          item
                        )
                      }
                    >
                      {item.subscribed
                        ? "Subscribed"
                        : "Unsubscribed"}
                    </button>
                  </td>

                  <td>
                    <button
                      type="button"
                      className="danger-link"
                      onClick={() =>
                        removeSubscriber(
                          item
                        )
                      }
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              )
            )}

            {items.length ===
              0 && (
              <tr>
                <td
                  colSpan="4"
                  className="admin-empty-cell"
                >
                  No newsletter
                  subscribers yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}