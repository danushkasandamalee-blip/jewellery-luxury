import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { supabase } from "../lib/supabaseClient";

import Loading from "../components/Loading";

export default function Appointments() {
  const [items, setItems] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [statusFilter, setStatusFilter] =
    useState("");

  useEffect(() => {
    loadAppointments();
  }, []);

  async function loadAppointments() {
    setLoading(true);

    const {
      data,
      error,
    } = await supabase
      .from("appointments")
      .select("*")
      .order(
        "appointment_date",
        {
          ascending: true,
        }
      )
      .order(
        "appointment_time",
        {
          ascending: true,
        }
      );

    if (error) {
      console.error(error);

      alert(
        "Unable to load appointments."
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
      .from("appointments")
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

  async function removeAppointment(
    id
  ) {
    if (
      !window.confirm(
        "Delete this appointment?"
      )
    ) {
      return;
    }

    const {
      error,
    } = await supabase
      .from("appointments")
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
            Appointments
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
            All Appointments
          </option>

          <option value="pending">
            Pending
          </option>

          <option value="confirmed">
            Confirmed
          </option>

          <option value="completed">
            Completed
          </option>

          <option value="cancelled">
            Cancelled
          </option>
        </select>
      </div>

      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Date</th>

              <th>Time</th>

              <th>
                Customer
              </th>

              <th>
                Service
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
                    {
                      item.appointment_date
                    }
                  </td>

                  <td>
                    {
                      item.appointment_time
                    }
                  </td>

                  <td>
                    <strong>
                      {
                        item.customer_name
                      }
                    </strong>
                  </td>

                  <td>
                    {
                      item.service
                    }
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
                      <option value="pending">
                        Pending
                      </option>

                      <option value="confirmed">
                        Confirmed
                      </option>

                      <option value="completed">
                        Completed
                      </option>

                      <option value="cancelled">
                        Cancelled
                      </option>
                    </select>
                  </td>

                  <td>
                    <button
                      type="button"
                      className="danger-link"
                      onClick={() =>
                        removeAppointment(
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
                  colSpan="8"
                  className="admin-empty-cell"
                >
                  No appointments found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}