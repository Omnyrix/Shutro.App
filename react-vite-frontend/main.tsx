// main.tsx
import "./index.css"; // Import your global styles
import React, { useEffect } from "react";
import { createRoot } from "react-dom/client";
import { HashRouter, Routes, Route, useNavigate } from "react-router-dom";
import { App as CapacitorApp } from "@capacitor/app"; // Renamed the imported Capacitor App

// — your pages under app/routes/ — 
import Login       from "./app/routes/auth/login";
import Register    from "./app/routes/auth/register";
import Verify      from "./app/routes/auth/verify";
import Home        from "./app/routes/home";
import Physics     from "./app/routes/subjects/physics";
import Chemistry   from "./app/routes/subjects/chemistry";
import HigherMath  from "./app/routes/subjects/higher_math";
import Biology     from "./app/routes/subjects/biology";
import Profile     from "./app/routes/profile";
import NotFound    from "./app/routes/404";
import Loading     from "./app/components/loading_screen"; // Import your Loading component

// MainApp Component
const MainApp = () => {
  const navigate = useNavigate();
  const [bootLoading, setBootLoading] = React.useState(true);

  useEffect(() => {
    // Force full screen and hide the status bar on all devices
    const { StatusBar, ScreenOrientation } = window.Capacitor.Plugins;

    // Hide the status bar for immersive fullscreen
    if (StatusBar && StatusBar.hide) {
      StatusBar.hide();
    }

    // Lock orientation to portrait (optional, can be changed)
    if (ScreenOrientation && ScreenOrientation.lock) {
      ScreenOrientation.lock({ orientation: 'PORTRAIT' });
    }

    // Add safe-area-inset styles to root element to avoid notches/camera cutouts
    const root = document.getElementById('root');
    if (root) {
      root.style.paddingTop = 'env(safe-area-inset-top)';
      root.style.paddingBottom = 'env(safe-area-inset-bottom)';
      root.style.paddingLeft = 'env(safe-area-inset-left)';
      root.style.paddingRight = 'env(safe-area-inset-right)';
      root.style.background = '#1f2937'; // bg-gray-800 fallback
      root.style.minHeight = '100vh';
      root.style.boxSizing = 'border-box';
    }

    // Listen for the back button press on Android
    const backButtonListener = CapacitorApp.addListener("backButton", () => {
      if (window.location.hash === "#/") {
        CapacitorApp.exitApp();
      } else {
        navigate(-1);
      }
    });

    // Show loading screen for a minimum time, then hide
    const timer = setTimeout(() => setBootLoading(false), 1200); // Adjust time as needed

    // Clean up the listener and timer when the component is unmounted
    return () => {
      backButtonListener.remove();
      clearTimeout(timer);
    };
  }, [navigate]);

  if (bootLoading) {
    return <Loading />;
  }

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="auth">
        <Route path="login"   element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="verify"   element={<Verify />} />
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
