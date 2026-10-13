import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { supabase } from "../lib/supabaseClient";

import Loading from "../components/Loading";

export default function Enquiries() {
  const [items, setItems] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [statusFilter, setStatusFilter] =
    useState("");

  useEffect(() => {
    loadEnquiries();
  }, []);

  async function loadEnquiries() {
    setLoading(true);

    const {
      data,
      error,
    } = await supabase
      .from("inquiries")
      .select(`
        *,
        products(
          name,
          sku,
          slug
        )
      `)
      .order("created_at", {
        ascending: false,
      });

    if (error) {
      console.error(error);

      alert(
        "Unable to load enquiries."
      );
    }

    setItems(data || []);

    setLoading(false);
  }

  async function updateStatus(
    id,
    status
  ) {
    const {
      error,
    } = await supabase
      .from("inquiries")
      .update({
        status,
      })
      .eq("id", id);

    if (error) {
      alert(error.message);
      return;
    }

    setItems(
      items.map(
        (item) =>
          item.id === id
            ? {
                ...item,
                status,
              }
            : item
      )
    );
  }

  async function deleteInquiry(
    id
  ) {
    if (
      !window.confirm(
        "Delete this enquiry?"
      )
    ) {
      return;
    }

    const {
      error,
    } = await supabase
      .from("inquiries")
      .delete()
      .eq("id", id);

    if (error) {
      alert(error.message);
      return;
    }

    setItems(
      items.filter(
        (item) =>
          item.id !== id
      )
    );
  }

  const filtered =
    useMemo(() => {
      if (!statusFilter) {
        return items;
      }

      return items.filter(
        (item) =>
          item.status ===
          statusFilter
      );
    }, [
      items,
      statusFilter,
    ]);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <p className="eyebrow">
            Customers
          </p>

          <h1>
            Enquiries
          </h1>
        </div>
      </div>

      <div className="admin-toolbar compact-toolbar">
        <select
          value={statusFilter}
          onChange={(event) =>
            setStatusFilter(
              event.target.value
            )
          }
        >
          <option value="">
            All Enquiries
          </option>

          <option value="new">
            New
          </option>

          <option value="contacted">
            Contacted
          </option>

          <option value="completed">
            Completed
          </option>

          <option value="ignored">
            Ignored
          </option>
        </select>
      </div>

      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>
                Date
              </th>

              <th>
                Customer
              </th>

              <th>
                Product
              </th>

              <th>
                Contact
              </th>

              <th>
                Message
              </th>

              <th>
                Status
              </th>

              <th />
            </tr>
          </thead>

          <tbody>
            {filtered.map(
              (item) => (
                <tr
                  key={item.id}
                >
                  <td>
                    {new Date(
                      item.created_at
                    ).toLocaleString()}
                  </td>

                  <td>
                    <strong>
                      {
                        item.customer_name
                      }
                    </strong>
                  </td>

                  <td>
                    {item.products
                      ?.name ||
                      "General enquiry"}

                    {item.products
                      ?.sku && (
                      <small className="table-subtext">
                        {
                          item.products
                            .sku
                        }
                      </small>
                    )}
                  </td>

                  <td>
                    {item.phone && (
                      <a
                        href={`tel:${item.phone}`}
                      >
                        {
                          item.phone
                        }
                      </a>
                    )}

                    {item.email && (
                      <a
                        className="table-contact-link"
                        href={`mailto:${item.email}`}
                      >
                        {
                          item.email
                        }
                      </a>
                    )}
                  </td>

                  <td className="message-cell">
                    {item.message ||
                      "—"}
                  </td>

                  <td>
                    <select
                      value={
                        item.status
                      }
                      onChange={(event) =>
                        updateStatus(
                          item.id,

                          event.target
                            .value
                        )
                      }
                    >
                      <option value="new">
                        New
                      </option>

                      <option value="contacted">
                        Contacted
                      </option>

                      <option value="completed">
                        Completed
                      </option>

                      <option value="ignored">
                        Ignored
                      </option>
                    </select>
                  </td>

                  <td>
                    <button
                      type="button"
                      className="danger-link"
                      onClick={() =>
                        deleteInquiry(
                          item.id
                        )
                      }
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              )
            )}

            {filtered.length ===
              0 && (
              <tr>
                <td
                  colSpan="7"
                  className="admin-empty-cell"
                >
                  No enquiries found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}