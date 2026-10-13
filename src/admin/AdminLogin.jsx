import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { supabase } from "../lib/supabaseClient";

export default function AdminLogin() {
  const navigate = useNavigate();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  useEffect(() => {
    checkExistingSession();
  }, []);

  async function checkExistingSession() {
    const {
      data: { session },
    } =
      await supabase.auth.getSession();

    if (!session?.user) {
      return;
    }

    const {
      data: profile,
    } = await supabase
      .from("profiles")
      .select("role")
      .eq(
        "id",
        session.user.id
      )
      .maybeSingle();

    if (profile?.role === "admin") {
      navigate(
        "/admin/dashboard",
        {
          replace: true,
        }
      );
    }
  }

  async function login(event) {
    event.preventDefault();

    setLoading(true);
    setError("");

    const {
      data,
      error: loginError,
    } =
      await supabase.auth
        .signInWithPassword({
          email:
            email.trim(),
          password,
        });

    if (loginError) {
      setError(
        loginError.message
      );

      setLoading(false);
      return;
    }

    const {
      data: profile,
      error: profileError,
    } = await supabase
      .from("profiles")
      .select("role")
      .eq(
        "id",
        data.user.id
      )
      .maybeSingle();

    if (
      profileError ||
      profile?.role !== "admin"
    ) {
      await supabase.auth
        .signOut();

      setError(
        "Administrator access required."
      );

      setLoading(false);
      return;
    }

    navigate(
      "/admin/dashboard",
      {
        replace: true,
      }
    );
  }

  return (
    <main className="admin-login-page">
      <div className="admin-login-card">
        <p className="eyebrow">
          Jewellery
        </p>

        <h1>
          Administration
        </h1>

        <p>
          Sign in to manage your
          jewellery website.
        </p>

        <form onSubmit={login}>
          <label>
            Email
          </label>

          <input
            required
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) =>
              setEmail(
                event.target.value
              )
            }
          />

          <label>
            Password
          </label>

          <input
            required
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) =>
              setPassword(
                event.target.value
              )
            }
          />

          {error && (
            <div className="form-error">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="luxury-button full"
            disabled={loading}
          >
            {loading
              ? "Signing In..."
              : "Sign In"}
          </button>
        </form>
      </div>
    </main>
  );
}