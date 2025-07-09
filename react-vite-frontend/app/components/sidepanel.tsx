import React, { useState, useEffect, useRef } from "react"; 
import { useNavigate } from "react-router-dom";               
import { eraseCookie } from "../utils/cookie";                
import { FaArrowLeft } from "react-icons/fa";                                              
import guestAvatar from "../assets/guest-avatar.png";          
import gsap from "gsap";                                       

const backendUrl = import.meta.env.VITE_BACKEND_URL;

interface SidePanelProps {
  isPanelOpen: boolean;
  setPanelOpen: React.Dispatch<React.SetStateAction<boolean>>;
  username: string;
  isDemo: boolean;
}

const slideAnimMs = 100;     
const aboutAnimMs = 200;     
const statusBarAnimMs = 150; 

const SidePanel = ({
  isPanelOpen,
  setPanelOpen,
  username,
  isDemo,
}: SidePanelProps) => {
  const navigate = useNavigate();
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [aboutExpanded, setAboutExpanded] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  // Optimized GSAP slide animation
  useEffect(() => {
    const el = panelRef.current;
    if (!el) return;
    gsap.to(el, {
      x: isPanelOpen ? 0 : "100%",
      duration: slideAnimMs / 1000,
      ease: "power3.inOut", // Use smoother easing
      force3D: true,
      immediateRender: false, // Prevent initial render issues
    });
  }, [isPanelOpen]);

  // Override back button when panel is open
  useEffect(() => {
    if (!isPanelOpen) return;
    const isCapacitor = !!(window as any).Capacitor;
    if (!isCapacitor) return;
    const { App: CapacitorApp } = (window as any).Capacitor.Plugins;
    const backHandler = CapacitorApp.addListener("backButton", (event: any) => {
      setPanelOpen(false);
      event.preventDefault?.();
    });
    return () => backHandler?.remove();
  }, [isPanelOpen, setPanelOpen]);

  // Optimized Status Bar color transition
  useEffect(() => {
    const isCapacitor = !!(window as any).Capacitor;
    if (!isCapacitor) return;
    const StatusBar = (window as any).Capacitor.Plugins.StatusBar;
    const panelBgColor = "#1f2937";
    const defaultBgColor = "#111827";
    const fromColor = isPanelOpen ? defaultBgColor : panelBgColor;
    const toColor = isPanelOpen ? panelBgColor : defaultBgColor;
    let start: number | null = null;
    let animationFrame: number;

    // Optimized color interpolation
    function lerpColor(a: string, b: string, t: number) {
      const ah = a.slice(1), bh = b.slice(1);
      const ar = parseInt(ah.substr(0,2),16), ag = parseInt(ah.substr(2,2),16), ab = parseInt(ah.substr(4,2),16);
      const br = parseInt(bh.substr(0,2),16), bg = parseInt(bh.substr(2,2),16), bb = parseInt(bh.substr(4,2),16);
      const rr = Math.round(ar + (br-ar)*t), rg = Math.round(ag + (bg-ag)*t), rb = Math.round(ab + (bb-ab)*t);
      return `#${rr.toString(16).padStart(2,"0")}${rg.toString(16).padStart(2,"0")}${rb.toString(16).padStart(2,"0")}`;
    }

    function animateColor(ts: number) {
      if (start === null) start = ts;
      const t = Math.min((ts - start) / statusBarAnimMs, 1);
      StatusBar.setBackgroundColor({ color: lerpColor(fromColor, toColor, t) });
      if (t < 1) animationFrame = requestAnimationFrame(animateColor);
    }

    animationFrame = requestAnimationFrame(animateColor);
    return () => cancelAnimationFrame(animationFrame);
  }, [isPanelOpen]);

  // Handle logout
  async function handleLogout() {
    setLogoutLoading(true);
    eraseCookie("session");
    setLogoutLoading(false);
    navigate("/auth/login");
  }

  const isLoggedIn = !isDemo;

  return (
    <div
      ref={panelRef}
      className="absolute inset-0 bg-gray-800 z-50 shadow-2xl"
      style={{
        transform: "translateX(100%)",
        willChange: "transform",
      }}
    >
      {/* Spacer for status bar/notch */}
      <div
        className="w-full"
        style={{ height: "env(safe-area-inset-top, 0px)", background: "#1f2937" }}
      />
      <div className="p-4 flex flex-col h-full justify-between">
        <div>
          <button onClick={() => setPanelOpen(false)} className="rounded-md p-1 mb-4">
            <FaArrowLeft className="text-2xl cursor-pointer" />
          </button>
          {/* Profile Section */}
          <div className="flex flex-col items-center gap-2 mb-6">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br flex items-center justify-center text-3xl font-bold text-white">
              {isLoggedIn
                ? username.charAt(0)
                : <img src={guestAvatar} alt="Guest avatar" className="w-full h-full object-cover rounded-full" />}
            </div>
            <span className="text-xl font-semibold text-white">{isLoggedIn ? username : "Guest"}</span>
          </div>

          {/* Buttons Section */}
          {isLoggedIn ? (
            <button
              onClick={() => { setPanelOpen(false); navigate("/profile"); }}
              className="w-full py-2 px-3 rounded-lg bg-blue-500 text-white font-semibold hover:bg-blue-600 mb-4 transition-all"
            >
              Change Password
            </button>
          ) : (
            <div className="flex flex-col gap-3 mb-4">
              <button
                onClick={() => { setPanelOpen(false); navigate("/auth/login"); }}
                className="w-full py-2 px-3 rounded-lg bg-blue-500 text-white font-semibold hover:bg-blue-600 transition-all"
              >Login</button>
              <button
                onClick={() => { setPanelOpen(false); navigate("/auth/register"); }}
                className="w-full py-2 px-3 rounded-lg bg-blue-500 text-white font-semibold hover:bg-blue-600 transition-all"
              >Register</button>
            </div>
          )}

          {/* ABOUT */}
          <div>
            <hr className="border-t border-gray-600 opacity-40 mb-2" />
            <button
              onClick={() => setAboutExpanded(!aboutExpanded)}
              className="w-full flex items-center justify-between py-2 px-3 bg-gray-800 text-gray-300"
            >
              <span>About</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', transition: `transform ${aboutAnimMs}ms cubic-bezier(0.4,0,0.2,1)` }}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  style={{ transform: aboutExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                  <path d="M6 8l4 4 4-4" stroke="#60A5FA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </button>
            <hr className="border-t border-gray-600 opacity-40 mt-2" />
            <div
              style={{
                maxHeight: aboutExpanded ? 300 : 0,
                opacity: aboutExpanded ? 1 : 0,
                marginTop: aboutExpanded ? 8 : 0,
                transition: `max-height ${aboutAnimMs}ms, opacity ${aboutAnimMs}ms, margin-top ${aboutAnimMs}ms`,
                overflow: 'hidden'
              }}
            >
              <p className="text-sm text-gray-400">
                Shutro.App is an app that will contain all your mathematical formulas for all the subjects; Physics , Chemistry, Higher Math and Biology.
              </p>
              <p className="text-sm text-gray-400 mt-2">
                Developed by MRKAS05.
              </p>
            </div>
          </div>
        </div>

        {/* Logout Button */}
        {isLoggedIn && (
          <div className="mb-6">
            <button
              onClick={handleLogout}
              className="w-full py-2 px-3 rounded-lg bg-red-500 text-white font-semibold hover:bg-red-600 transition-all"
              disabled={logoutLoading}
            >
              {logoutLoading ? "Logging out..." : "Logout"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SidePanel;
