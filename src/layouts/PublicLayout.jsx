import {
  Outlet,
  useLocation,
} from "react-router-dom";

import {
  useEffect,
} from "react";

import Header from "../components/Header";
import Footer from "../components/Footer";

export default function PublicLayout() {
  const location =
    useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "instant",
    });
  }, [location.pathname]);

  return (
    <>
      <Header />

      <main className="public-main">
        <Outlet />
      </main>

      <Footer />
    </>
  );
}