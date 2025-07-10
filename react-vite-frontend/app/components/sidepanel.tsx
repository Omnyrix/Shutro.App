import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { eraseCookie } from "../utils/cookie";
import { FaArrowLeft } from "react-icons/fa";
import guestAvatar from "../assets/guest-avatar.png";
import { motion, AnimatePresence } from "framer-motion";
import { StatusBar, Style } from "@capacitor/status-bar";

const SLIDE_DURATION = 0.1;  // seconds (100ms)
const ABOUT_DURATION = 0.1;  // seconds
const STATUSBAR_MS = 100;    // ms

interface SidePanelProps {
  isPanelOpen: boolean;
  setPanelOpen: React.Dispatch<React.SetStateAction<boolean>>;
  username: string;
  isDemo: boolean;
}

export default function SidePanel({
  isPanelOpen,
  setPanelOpen,
  username,
  isDemo,
}: SidePanelProps) {
  const navigate = useNavigate();
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [aboutExpanded, setAboutExpanded] = useState(false);
  const isLoggedIn = !isDemo;

  // Initial StatusBar setup
  useEffect(() => {
    StatusBar.setBackgroundColor({ color: "#111827" });
    StatusBar.setStyle({ style: Style.Dark });
  }, []);

  // Animate StatusBar color on open/close
  useEffect(() => {
    const cap = (window as any).Capacitor;
    if (!cap) return;
    const sb = cap.Plugins.StatusBar;
    const from = isPanelOpen ? "#111827" : "#1f2937";
    const to   = isPanelOpen ? "#1f2937" : "#111827";
    let start: number | null = null;
    let raf: number;

    const lerp = (a: string, b: string, t: number) => {
      const p = (s: string) => [0,2,4].map(i => parseInt(s.slice(1).substr(i,2),16));
      const [ar,ag,ab] = p(a), [br,bg,bb] = p(b);
      const rr = Math.round(ar + (br-ar)*t).toString(16).padStart(2,'0');
      const rg = Math.round(ag + (bg-ag)*t).toString(16).padStart(2,'0');
      const rb = Math.round(ab + (bb-ab)*t).toString(16).padStart(2,'0');
      return `#${rr}${rg}${rb}`;
    };

    const step = (ts: number) => {
      if (start === null) start = ts;
      const t = Math.min((ts - start) / STATUSBAR_MS, 1);
      sb.setBackgroundColor({ color: lerp(from, to, t) });
      if (t < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [isPanelOpen]);

  // Hardware back button closes panel
  useEffect(() => {
    if (!isPanelOpen) return;
    const cap = (window as any).Capacitor;
    if (!cap) return;
    const { App } = cap.Plugins;
    const h = App.addListener("backButton", (e: any) => {
      setPanelOpen(false);
      e.preventDefault?.();
    });
    return () => h.remove();
  }, [isPanelOpen]);

  async function handleLogout() {
    setLogoutLoading(true);
    eraseCookie("session");
    setLogoutLoading(false);
    navigate("/auth/login");
  }

  return (
    <AnimatePresence>
      {isPanelOpen && (
        <motion.div
          key="sidepanel"
          initial={{ x: "75%" }}
          animate={{ x: "0%" }}
          exit={{ x: "75%" }}
          transition={{ x: { duration: SLIDE_DURATION, ease: "linear" } }}
          style={{
            position: "absolute",
            inset: 0,
            background: "#1F2937",
            zIndex: 50,
            willChange: "transform",
          }}
        >
          {/* Spacer for notch */}
          <div
            style={{
              height: "env(safe-area-inset-top,0px)",
              background: "#111827",
            }}
          />

          <div
            style={{
              padding: 16,
              display: "flex",
              flexDirection: "column",
              height: "calc(100% - env(safe-area-inset-top,0px))",
              justifyContent: "space-between",
            }}
          >
            <div>
              <button
                onClick={() => setPanelOpen(false)}
                style={{ marginBottom: 16 }}
              >
                <FaArrowLeft className="text-2xl text-white" />
              </button>

              {/* Profile */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 24,
                }}
              >
                <div
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: 32,
                    overflow: "hidden",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  {isLoggedIn ? (
                    <span
                      style={{
                        color: "#fff",
                        fontSize: 24,
                        fontWeight: "bold",
                      }}
                    >
                      {username.charAt(0)}
                    </span>
                  ) : (
                    <img
                      src={guestAvatar}
                      alt="Guest"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  )}
                </div>
                <span
                  style={{ color: "#fff", fontSize: 18, fontWeight: 600 }}
                >
                  {isLoggedIn ? username : "Guest"}
                </span>
              </div>

              {/* Actions */}
              {isLoggedIn ? (
                <button
                  onClick={() => {
                    setPanelOpen(false);
                    navigate("/profile");
                  }}
                  style={{
                    width: "100%",
                    padding: "8px 0",
                    background: "#3B82F6",
                    color: "#fff",
                    fontWeight: 600,
                    borderRadius: 8,
                    marginBottom: 24,
                  }}
                >
                  Change Password
                </button>
              ) : (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 12,
                    marginBottom: 24,
                  }}
                >
                  <button
                    onClick={() => {
                      setPanelOpen(false);
                      navigate("/auth/login");
                    }}
                    style={{
                      width: "100%",
                      padding: "8px 0",
                      background: "#3B82F6",
                      color: "#fff",
                      fontWeight: 600,
                      borderRadius: 8,
                    }}
                  >
                    Login
                  </button>
                  <button
                    onClick={() => {
                      setPanelOpen(false);
                      navigate("/auth/register");
                    }}
                    style={{
                      width: "100%",
                      padding: "8px 0",
                      background: "#3B82F6",
                      color: "#fff",
                      fontWeight: 600,
                      borderRadius: 8,
                    }}
                  >
                    Register
                  </button>
                </div>
              )}

              {/* About (just under actions) */}
              <button
                onClick={() => setAboutExpanded((v) => !v)}
                className="w-full flex items-center justify-between py-3 px-4 rounded-md transition-colors duration-200 ease-in-out"
                style={{
                  backgroundColor: aboutExpanded ? "#374151" : "#2d3748",
                  color: "#D1D5DB",
                  marginBottom: 8,
                }}
              >
                <span>About</span>
                <motion.svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  initial={false}
                  animate={{ rotate: aboutExpanded ? 180 : 0 }}
                  transition={{ duration: ABOUT_DURATION, ease: "easeInOut" }}
                >
                  <path
                    d="M6 8l4 4 4-4"
                    stroke="#60A5FA"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </motion.svg>
              </button>
              <AnimatePresence initial={false}>
                {aboutExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0, y: -10 }}
                    animate={{ height: "auto", opacity: 1, y: 0 }}
                    exit={{ height: 0, opacity: 0, y: -10 }}
                    transition={{ duration: ABOUT_DURATION, ease: "easeInOut" }}
                    style={{
                      overflow: "hidden",
                      background: "#2d3748",
                      padding: "12px",
                      borderRadius: 8,
                      marginBottom: 24,
                    }}
                  >
                    <p
                      style={{
                        color: "#9CA3AF",
                        fontSize: 14,
                        lineHeight: 1.5,
                        margin: 0,
                      }}
                    >
                      Shutro.app is a mobile application that provides an
                      extensive collection of mathematical formulas for various
                      subjects including Physics, Chemistry, Higher Mathematics,
                      and Biology. It's your go-to source for formulas, making
                      it easier to study and reference them on the go.
                    </p>
                    <p
                      style={{
                        color: "#9CA3AF",
                        fontSize: 14,
                        lineHeight: 1.5,
                        marginTop: 8,
                      }}
                    >
                      Developed by MRKAS05.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Logout */}
            {isLoggedIn && (
              <button
                onClick={handleLogout}
                style={{
                  width: "100%",
                  padding: "8px 0",
                  background: "#DC2626",
                  color: "#fff",
                  fontWeight: 600,
                  borderRadius: 8,
                }}
                disabled={logoutLoading}
              >
                {logoutLoading ? "Logging out..." : "Logout"}
              </button>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
