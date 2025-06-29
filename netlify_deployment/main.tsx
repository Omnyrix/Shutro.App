// main.tsx
import React from "react";
import { createRoot } from "react-dom/client";
import {
  HashRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

// — your pages under app/routes/ —
import Home        from "./app/routes/index";
import Welcome     from "./app/routes/welcome";
import Login       from "./app/routes/auth/login";
import Register    from "./app/routes/auth/register";
import Verify      from "./app/routes/auth/verify";
import NoAuth      from "./app/routes/auth/no-auth";
import HomePage    from "./app/routes/home";
import Physics     from "./app/routes/subjects/physics";
import Chemistry   from "./app/routes/subjects/chemistry";
import HigherMath  from "./app/routes/subjects/higher_math";
import Biology     from "./app/routes/subjects/biology";
import Profile     from "./app/routes/profile";
import NotFound    from "./app/routes/404";

const App = () => (
  <HashRouter>
    <Routes>
      <Route index element={<Welcome />} />

      <Route path="welcome" element={<Welcome />} />

      <Route path="auth">
        <Route path="login"   element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="verify"   element={<Verify />} />
        <Route path="no-auth"  element={<NoAuth />} />
      </Route>

      <Route path="home" element={<HomePage />} />

      <Route path="physics"    element={<Physics />} />
      <Route path="chemistry"  element={<Chemistry />} />
      <Route path="highermath" element={<HigherMath />} />
      <Route path="biology"    element={<Biology />} />

      <Route path="profile" element={<Profile />} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  </HashRouter>
);

const rootEl = document.getElementById("root");
if (!rootEl) throw new Error("Root element not found");
createRoot(rootEl).render(<App />);
