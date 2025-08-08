// main.tsx
import "./index.css"; // Import your global styles
import React, { useEffect } from "react";
import { createRoot } from "react-dom/client";
import {
  HashRouter,
  Routes,
  Route,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { App as CapacitorApp } from "@capacitor/app"; // Renamed the imported Capacitor App
import { StatusBar, Style } from "@capacitor/status-bar";

// — your pages under app/routes/ —
import Login from "./app/routes/auth/login";
import Register from "./app/routes/auth/register";
import Verify from "./app/routes/auth/verify";
import Home from "./app/routes/home";
import Physics from "./app/routes/subjects/physics";
import Chemistry from "./app/routes/subjects/chemistry";
import HigherMath from "./app/routes/subjects/higher_math";
import Biology from "./app/routes/subjects/biology";
import Profile from "./app/routes/profile";
import ChapterSelectionPhysics1st from "./app/subjects/papers/physics_1st/chapter-selection-page";
import ChapterSelectionPhysics2nd from "./app/subjects/papers/physics_2nd/chapter-selection-page";
import PHY1STCH1 from "./app/subjects/papers/physics_1st/ch-1";
//import PHY1STCH2 from "./app/subjects/papers/physics_1st/ch-2";
//import PHY1STCH3 from "./app/subjects/papers/physics_1st/ch-3";
//import PHY1STCH4 from "./app/subjects/papers/physics_1st/ch-4";
//import PHY1STCH5 from "./app/subjects/papers/physics_1st/ch-5";
//import PHY1STCH6 from "./app/subjects/papers/physics_1st/ch-6";
//import PHY1STCH7 from "./app/subjects/papers/physics_1st/ch-7";
//import PHY1STCH8 from "./app/subjects/papers/physics_1st/ch-8";
//import PHY1STCH9 from "./app/subjects/papers/physics_1st/ch-9";
//import PHY1STCH10 from "./app/subjects/papers/physics_1st/ch-10";
//import PHY1STCH11 from "./app/subjects/papers/physics_2nd/chapter-selection-page";
import ChapterSelectionHigherMath1st from "./app/subjects/papers/higher_math_1st/chapter-selection-page";
import ChapterSelectionHigherMath2nd from "./app/subjects/papers/higher_math_2nd/chapter-selection-page";
import ChapterSelectionChemistry1st from "./app/subjects/papers/chemistry_1st/chapter-selection-page";
import ChapterSelectionChemistry2nd from "./app/subjects/papers/chemistry_2nd/chapter-selection-page";
import NotFound from "./app/routes/404";
import Loading from "./app/components/loading_screen";

// List of routes that should use gray-900
const GRAY_900_ROUTES = [
  "/profile",
  "/physics",
  "/physics/1st-paper",
  "/physics/1st-paper/ch-1",
  "/physics/1st-paper/ch-2",
  "/physics/1st-paper/ch-3",
  "/physics/1st-paper/ch-4",
  "/physics/1st-paper/ch-5",
  "/physics/1st-paper/ch-6",
  "/physics/1st-paper/ch-7",
  "/physics/1st-paper/ch-8",
  "/physics/1st-paper/ch-9",
  "/physics/1st-paper/ch-10",
  "/physics/2nd-paper",
  "/physics/2nd-paper/ch-1",
  "/physics/2nd-paper/ch-2",
  "/physics/2nd-paper/ch-3",
  "/physics/2nd-paper/ch-4",
  "/physics/2nd-paper/ch-5",
  "/physics/2nd-paper/ch-6",
  "/physics/2nd-paper/ch-7",
  "/physics/2nd-paper/ch-8",
  "/physics/2nd-paper/ch-9",
  "/physics/2nd-paper/ch-10",
  "/chemistry",
  "/chemistry/1st-paper",
  "/chemistry/1st-paper/ch-1",
  "/chemistry/1st-paper/ch-2",
  "/chemistry/1st-paper/ch-3",
  "/chemistry/1st-paper/ch-4",
  "/chemistry/1st-paper/ch-5",
  "/chemistry/2nd-paper",
  "/chemistry/2nd-paper/ch-1",
  "/chemistry/2nd-paper/ch-2",
  "/chemistry/2nd-paper/ch-3",
  "/chemistry/2nd-paper/ch-4",
  "/chemistry/2nd-paper/ch-5",
  "/highermath",
  "/highermath/1st-paper",
  "/highermath/1st-paper/ch-1",
  "/highermath/1st-paper/ch-2",
  "/highermath/1st-paper/ch-3",
  "/highermath/1st-paper/ch-4",
  "/highermath/1st-paper/ch-5",
  "/highermath/1st-paper/ch-6",
  "/highermath/1st-paper/ch-7",
  "/highermath/1st-paper/ch-8",
  "/highermath/1st-paper/ch-9",
  "/highermath/1st-paper/ch-10",
  "/highermath/2nd-paper",
  "/highermath/2nd-paper/ch-1",
  "/highermath/2nd-paper/ch-2",
  "/highermath/2nd-paper/ch-3",
  "/highermath/2nd-paper/ch-4",
  "/highermath/2nd-paper/ch-5",
  "/highermath/2nd-paper/ch-6",
  "/highermath/2nd-paper/ch-7",
  "/highermath/2nd-paper/ch-8",
  "/highermath/2nd-paper/ch-9",
  "/highermath/2nd-paper/ch-10",
  "/biology"
];

// List of hash routes to exclude from Android back-button handling
const EXCLUDED_BACK_BUTTON_ROUTES: string[] = [
  "#/physics/1st-paper/ch-1",
  "/physics/1st-paper/ch-1"
];

// MainApp Component
const MainApp = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [bootLoading, setBootLoading] = React.useState(true);

  // — Mount: overlays, safe-area insets, back-button, orientation, loading timer —
  useEffect(() => {
    // Make status bar sit below your webview
    StatusBar.setOverlaysWebView({ overlay: false });
    StatusBar.show();

    // Lock portrait if available
    const { ScreenOrientation } = (window as any).Capacitor.Plugins;
    if (ScreenOrientation?.lock) {
      ScreenOrientation.lock({ orientation: "PORTRAIT" });
    }

    // Apply safe-area padding to the root element
    const root = document.getElementById("root");
    if (root) {
      root.style.paddingTop = "env(safe-area-inset-top)";
      root.style.paddingBottom = "env(safe-area-inset-bottom)";
      root.style.paddingLeft = "env(safe-area-inset-left)";
      root.style.paddingRight = "env(safe-area-inset-right)";
      root.style.minHeight = "100vh";
      root.style.boxSizing = "border-box";
      // fallback background
      root.style.background = "#1f2937";
    }

    // Android back button: exit on Home, otherwise go back (unless excluded)
    const backButtonListener = CapacitorApp.addListener(
      "backButton",
      () => {
        const hash = window.location.hash;
        if (EXCLUDED_BACK_BUTTON_ROUTES.includes(hash)) {
          // ignore back button for these hash routes
          return;
        }
        if (hash === "#/" || hash === "#/home") {
          navigate("/home");
        } else {
          navigate(-1);
        }
      }
    );

    // Minimum splash/loading time
    const timer = setTimeout(() => setBootLoading(false), 1200);

    return () => {
      backButtonListener.remove();
      clearTimeout(timer);
    };
  }, [navigate]);

  // — On route change: update status-bar color & icon style —
  useEffect(() => {
    const isGray900 = GRAY_900_ROUTES.includes(location.pathname);
    StatusBar.setBackgroundColor({
      color: isGray900 ? "#111827" : "#1f2937",
    });
    // white icons for our dark backgrounds
    StatusBar.setStyle({ style: Style.Dark });
  }, [location.pathname]);

  if (bootLoading) {
    return <Loading />;
  }

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="auth">
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="verify" element={<Verify />} />
      </Route>
      <Route path="home" element={<Home />} />
      <Route path="physics" element={<Physics />} />
      <Route path="physics/1st-paper" element={<ChapterSelectionPhysics1st />} />
      <Route path="physics/1st-paper/ch-1" element={<PHY1STCH1 />} />
      <Route path="physics/2nd-paper" element={<ChapterSelectionPhysics2nd />} />
      <Route path="chemistry" element={<Chemistry />} />
      <Route path="chemistry/1st-paper" element={<ChapterSelectionChemistry1st />} />
      <Route path="chemistry/2nd-paper" element={<ChapterSelectionChemistry2nd />} />
      <Route path="highermath" element={<HigherMath />} />
      <Route path="highermath/1st-paper" element={<ChapterSelectionHigherMath1st />} />
      <Route path="highermath/2nd-paper" element={<ChapterSelectionHigherMath2nd />} />
      <Route path="biology" element={<Biology />} />
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
