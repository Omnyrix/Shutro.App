import { useEffect, useRef } from "react";

// Declare that window.turnstile exists for TypeScript.
declare global {
  interface Window {
    turnstile: any;
  }
}

interface TurnstileProps {
  sitekey: string;
  onVerify: (token: string) => void;
  // Optional scaling factor; default is 1 (normal size).
  scale?: number;
}

export default function Turnstile({ sitekey, onVerify, scale = 1 }: TurnstileProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Function to dynamically load the Cloudflare Turnstile script.
    const loadTurnstileScript = (): Promise<void> => {
      return new Promise((resolve, reject) => {
        if (document.getElementById("cf-turnstile-script")) {
          console.log("Turnstile script already exists.");
          return resolve();
        }
        const script = document.createElement("script");
        script.id = "cf-turnstile-script";
        script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
        script.async = true;
        script.defer = true;
        script.onload = () => {
          console.log("Turnstile script loaded.");
          resolve();
        };
        script.onerror = () =>
          reject(new Error("Failed to load Cloudflare Turnstile script."));
        document.head.appendChild(script);
      });
    };

    loadTurnstileScript()
      .then(() => {
        console.log("Checking for window.turnstile:", window.turnstile);
        if (window.turnstile && containerRef.current) {
          // Prevent duplicate widget render by checking if children already exist.
          if (containerRef.current.childElementCount > 0) {
            console.log("Turnstile widget already rendered.");
            return;
          }
          console.log("Rendering Turnstile widget...");
          window.turnstile.render(containerRef.current, {
            sitekey,
            size: "normal", // Set the widget to normal size.
            callback: (token: string) => {
              console.log("Turnstile callback token received:", token);
              onVerify(token);
            },
            "expired-callback": () => {
              console.log("Turnstile token expired.");
              onVerify("");
            },
          });
        } else {
          console.error("window.turnstile is not available or container is not ready.");
        }
      })
      .catch((error) => {
        console.error("Error loading Turnstile script:", error);
      });
  }, [sitekey, onVerify]);

  return <div ref={containerRef} style={{ transform: `scale(${scale})`, transformOrigin: "0 0" }} />;
}
