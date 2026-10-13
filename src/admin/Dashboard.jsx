import {
  useEffect,
  useState,
} from "react";

import { Link } from "react-router-dom";

import { supabase } from "../lib/supabaseClient";

import Loading from "../components/Loading";

export default function Dashboard() {
  const [loading, setLoading] =
    useState(true);

  const [stats, setStats] =
    useState({
      products: 0,
      categories: 0,
      collections: 0,
      inquiries: 0,
      appointments: 0,
      newsletter: 0,
    });

  const [recentProducts, setRecentProducts] =
    useState([]);

  const [recentInquiries, setRecentInquiries] =
    useState([]);

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    setLoading(true);

    const [
      productsCount,
      categoriesCount,
      collectionsCount,
      inquiriesCount,
      appointmentsCount,
      newsletterCount,
      productsResult,
      inquiriesResult,
    ] = await Promise.all([
      supabase
        .from("products")
        .select("*", {
          count: "exact",
          head: true,
        }),

      supabase
        .from("categories")
        .select("*", {
          count: "exact",
          head: true,
        }),

      supabase
        .from("collections")
        .select("*", {
          count: "exact",
          head: true,
        }),

      supabase
        .from("inquiries")
        .select("*", {
          count: "exact",
          head: true,
        }),

      supabase
        .from("appointments")
        .select("*", {
          count: "exact",
          head: true,
        }),

      supabase
        .from(
          "newsletter_subscribers"
        )
        .select("*", {
          count: "exact",
          head: true,
        }),

      supabase
        .from("products")
        .select(`
          id,
          name,
          sku,
          status,
          created_at
        `)
        .order("created_at", {
          ascending: false,
        })
        .limit(5),

      supabase
        .from("inquiries")
        .select(`
          id,
          customer_name,
          status,
          created_at
        `)
        .order("created_at", {
          ascending: false,
        })
        .limit(5),
    ]);

    setStats({
      products:
        productsCount.count || 0,

      categories:
        categoriesCount.count || 0,

      collections:
        collectionsCount.count || 0,

      inquiries:
        inquiriesCount.count || 0,

      appointments:
        appointmentsCount.count || 0,

      newsletter:
        newsletterCount.count || 0,
    });

    setRecentProducts(
      productsResult.data || []
    );

    setRecentInquiries(
      inquiriesResult.data || []
    );

    setLoading(false);
  }

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <p className="eyebrow">
            Overview
          </p>

          <h1>
            Dashboard
          </h1>
        </div>

        <Link
          to="/admin/products/new"
          className="luxury-button"
        >
          + Add Product
        </Link>
      </div>

      <div className="stats-grid">
        <StatCard
          label="Products"
          value={stats.products}
          link="/admin/products"
        />

        <StatCard
          label="Categories"
          value={stats.categories}
          link="/admin/categories"
        />

        <StatCard
          label="Collections"
          value={stats.collections}
          link="/admin/collections"
        />

        <StatCard
          label="Enquiries"
          value={stats.inquiries}
          link="/admin/enquiries"
        />

        <StatCard
          label="Appointments"
          value={
            stats.appointments
          }
          link="/admin/appointments"
        />

        <StatCard
          label="Subscribers"
          value={
            stats.newsletter
          }
          link="/admin/newsletter"
        />
      </div>

      <div className="dashboard-columns">
        <section className="dashboard-panel">
          <div className="dashboard-panel-header">
            <h2>
              Recent Products
            </h2>

            <Link to="/admin/products">
              View all
            </Link>
          </div>

          {recentProducts.length === 0 ? (
            <p className="admin-muted">
              No products added yet.
            </p>
          ) : (
            recentProducts.map(
              (product) => (
                <div
                  key={product.id}
                  className="dashboard-row"
                >
                  <div>
                    <strong>
                      {product.name}
                    </strong>

                    <small>
                      {product.sku ||
                        "No SKU"}
                    </small>
                  </div>

                  <span className="status-label">
                    {product.status
                      ?.replaceAll(
                        "_",
                        " "
                      )}
                  </span>
                </div>
              )
            )
          )}
        </section>

        <section className="dashboard-panel">
          <div className="dashboard-panel-header">
            <h2>
              Recent Enquiries
            </h2>

            <Link to="/admin/enquiries">
              View all
            </Link>
          </div>

          {recentInquiries.length === 0 ? (
            <p className="admin-muted">
              No enquiries yet.
            </p>
          ) : (
            recentInquiries.map(
              (item) => (
                <div
                  key={item.id}
                  className="dashboard-row"
                >
                  <div>
                    <strong>
                      {
                        item.customer_name
                      }
                    </strong>

                    <small>
                      {new Date(
                        item.created_at
                      ).toLocaleDateString()}
                    </small>
                  </div>

                  <span className="status-label">
                    {item.status}
                  </span>
                </div>
              )
            )
          )}
        </section>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  link,
}) {
  return (
    <Link
      to={link}
      className="stat-card"
    >
      <p>{label}</p>

      <strong>{value}</strong>
    </Link>
  );
}