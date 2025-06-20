import React from "react";
import ReactDOM from "react-dom/client";
import {
  HashRouter,
  Routes,
  Route,
  Outlet,
  useRouteError,
  Navigate,
} from "react-router-dom";

import Home from "./home/home";
import Welcome from "./welcome/welcome";

// Layout component - just a wrapper div (no html/head tags)
function Layout() {
  return (
    <div className="app-container">
      <Outlet />
    </div>
  );
}

// Error boundary component using useRouteError hook
function ErrorBoundary() {
  const error = useRouteError() as Error | null;

  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (error) {
    message = error.name || message;
    details = error.message || details;
    stack = (error as any).stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}

// Session check wrapper for protected routes
function RequireSession({ children }: { children: JSX.Element }) {
  const sessionCookie = document.cookie.match(/(?:^|;\s*)session=([^;]+)/);
  if (!sessionCookie) {
    return <Navigate to="/welcome" replace />;
  }
  return children;
}

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Layout />} errorElement={<ErrorBoundary />}>
          <Route
            index
            element={
              <RequireSession>
                <Home />
              </RequireSession>
            }
          />
          <Route path="welcome" element={<Welcome />} />
          {/* Catch all unmatched routes */}
          <Route path="*" element={<Navigate to="/welcome" replace />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(<React.StrictMode><App /></React.StrictMode>);
