import {
  useEffect,
  useState,
} from "react";

import {
  Navigate,
} from "react-router-dom";

import {
  supabase,
} from "../lib/supabaseClient";

import Loading from "../components/Loading";

export default function ProtectedAdminRoute({
  children,
}) {
  const [loading, setLoading] =
    useState(true);

  const [allowed, setAllowed] =
    useState(false);

  useEffect(() => {
    let mounted = true;

    async function checkAdmin() {
      try {
        const {
          data: {
            session,
          },
        } =
          await supabase.auth.getSession();

        if (!session?.user) {
          if (mounted) {
            setAllowed(false);
            setLoading(false);
          }

          return;
        }

        const {
          data: profile,
          error,
        } = await supabase
          .from("profiles")
          .select("role")
          .eq(
            "id",
            session.user.id
          )
          .maybeSingle();

        if (
          mounted &&
          !error &&
          profile?.role === "admin"
        ) {
          setAllowed(true);
        } else if (mounted) {
          setAllowed(false);
        }

        if (mounted) {
          setLoading(false);
        }
      } catch (error) {
        console.error(
          "Admin access check failed:",
          error
        );

        if (mounted) {
          setAllowed(false);
          setLoading(false);
        }
      }
    }

    checkAdmin();

    const {
      data: authListener,
    } =
      supabase.auth.onAuthStateChange(
        async (
          event,
          session
        ) => {
          if (
            event ===
              "SIGNED_OUT" ||
            !session
          ) {
            if (mounted) {
              setAllowed(false);
            }
          }
        }
      );

    return () => {
      mounted = false;

      authListener?.subscription
        ?.unsubscribe();
    };
  }, []);

  if (loading) {
    return <Loading />;
  }

  if (!allowed) {
    return (
      <Navigate
        to="/admin/login"
        replace
      />
    );
  }

  return children;
}