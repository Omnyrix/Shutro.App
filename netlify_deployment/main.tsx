// main.tsx
import "./index.css"; // Import your global styles
import React, { useEffect } from "react";
import { createRoot } from "react-dom/client";
import { HashRouter, Routes, Route, useNavigate } from "react-router-dom";
import { App as CapacitorApp } from "@capacitor/app"; // Renamed the imported Capacitor App

// — your pages under app/routes/ —
import Welcome     from "./app/routes/welcome";
import Login       from "./app/routes/auth/login";
import Register    from "./app/routes/auth/register";
import Verify      from "./app/routes/auth/verify";
import NoAuth      from "./app/routes/auth/no-auth";
import Home        from "./app/routes/home";
import Physics     from "./app/routes/subjects/physics";
import Chemistry   from "./app/routes/subjects/chemistry";
import HigherMath  from "./app/routes/subjects/higher_math";
import Biology     from "./app/routes/subjects/biology";
import Profile     from "./app/routes/profile";
import NotFound    from "./app/routes/404";

// MainApp Component
const MainApp = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Listen for the back button press on Android
    const backButtonListener = CapacitorApp.addListener("backButton", () => {
      // If we're on the home page (root path), exit the app
      if (window.location.hash === "#/") {
        CapacitorApp.exitApp(); // Exit the app if we are on the root page
      } else {
        // Otherwise, navigate to the previous route in history stack
        navigate(-1); // Go back to the previous page in the history stack
      }
    });

    // Clean up the listener when the component is unmounted
    return () => {
      backButtonListener.remove();
    };
  }, [navigate]);

  return (
    <Routes>
      <Route path="/" element={<Welcome />} />
      <Route path="welcome" element={<Welcome />} />
      <Route path="auth">
        <Route path="login"   element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="verify"   element={<Verify />} />
        <Route path="no-auth"  element={<NoAuth />} />
      </Route>
      <Route path="home" element={<Home />} />
      <Route path="physics"    element={<Physics />} />
      <Route path="chemistry"  element={<Chemistry />} />
      <Route path="highermath" element={<HigherMath />} />
      <Route path="biology"    element={<Biology />} />
      <Route path="profile" element={<Profile />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

// Wrap everything with HashRouter in your main.tsx
const rootEl = document.getElementById("root");
if (!rootEl) throw new Error("Root element not found");

createRoot(rootEl).render(
  <HashRouter>
    <MainApp />
  </HashRouter>
);
