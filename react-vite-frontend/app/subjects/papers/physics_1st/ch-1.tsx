// app/routes/subjects/physics_1st/ch-1-formulas-page.tsx

import React, { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NoInternetWarning from "../../../components/noInternetWarning";
import { motion } from "framer-motion";
import { App } from "@capacitor/app";
import { getCookie, readScrollMap, writeScrollMap } from "../../../utils/cookie";
import katex from "katex";
import "katex/dist/katex.min.css";

interface Formula {
  id: string;
  formula: string;
  description: string;
  derivation: string;
}

const FORMULAS: Formula[] = [
  { id: "v_u_at", formula: "v = u + at", description: "Final velocity under constant acceleration.", derivation: "..." },
  { id: "s_ut_12at2", formula: "s = ut + \\tfrac{1}{2}at^2", description: "Displacement with time.", derivation: "..." },
  { id: "v2_u2_2as", formula: "v^2 = u^2 + 2as", description: "Velocity-displacement relation.", derivation: "..." },
  { id: "s_avg_t", formula: "s = \\tfrac{u + v}{2}t", description: "Distance using avg. velocity.", derivation: "..." },
  { id: "f_ma", formula: "F = ma", description: "Newton's second law.", derivation: "..." },
  { id: "p_mv", formula: "p = mv", description: "Linear momentum.", derivation: "..." },
  { id: "e_12mv2", formula: "E_k = \\tfrac{1}{2}mv^2", description: "Kinetic energy.", derivation: "..." },
];

const chapterName = "Kinematics";
const backRoute = "/physics/1st-paper";

export default function Phy1stCh1FormulasPage() {
  const navigate = useNavigate();
  const [isDemo, setIsDemo] = useState(false);
  const [selectedFormulaId, setSelectedFormulaId] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const mapKey = "phy1ch1formulasscroll";
  const scrollOffset = 1;

  useEffect(() => {
    getCookie("session").then(email => setIsDemo(!email));
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    readScrollMap().then(m => {
      if (typeof m[mapKey] === "number") el.scrollTop = m[mapKey];
    });
    const onScroll = async () => {
      const m = await readScrollMap();
      m[mapKey] = el.scrollTop;
      await writeScrollMap(m);
    };
    el.addEventListener("scroll", onScroll);
    window.addEventListener("resize", onScroll);
    return () => {
      el.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  useEffect(() => {
    const handler = App.addListener("backButton", () => {
      if (selectedFormulaId) {
        setSelectedFormulaId(null);
      } else {
        navigate(backRoute, { replace: true });
      }
    });
    return () => {
      handler.remove();
    };
  }, [selectedFormulaId]);

  const renderLatex = (tex: string) =>
    katex.renderToString(tex, { throwOnError: false, output: "html" });

  if (selectedFormulaId) {
    const detail = FORMULAS.find(f => f.id === selectedFormulaId)!;
    return (
      <div className="relative min-h-screen font-bengali bg-gray-800 text-white">
        {isDemo && <NoInternetWarning />}
        <div className="fixed top-0 left-0 p-4 z-20">
          <button onClick={() => setSelectedFormulaId(null)} className="text-2xl">
            ←
          </button>
        </div>
        <div className="p-6 pt-20">
          <motion.h1 className="text-2xl font-bold mb-4">{detail.description}</motion.h1>
          <motion.div
            className="text-xl font-mono mb-4"
            dangerouslySetInnerHTML={{ __html: renderLatex(detail.formula) }}
          />
          <motion.pre className="bg-gray-900 p-4 rounded-lg overflow-x-auto text-sm whitespace-pre-wrap">
            {detail.derivation.trim()}
          </motion.pre>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen font-bengali bg-gray-800 text-white">
      {isDemo && <NoInternetWarning />}
      <div className="fixed top-0 left-0 p-4 z-20">
        <button onClick={() => navigate(backRoute)} className="text-2xl">
          ←
        </button>
      </div>
      <div className="pt-20 text-center">
        <h1 className="text-2xl font-bold">{chapterName} Formulas</h1>
      </div>
      <div ref={containerRef} className="px-4 pt-4 pb-10 overflow-y-auto">
        <div className="flex flex-wrap gap-3 justify-center">
          {FORMULAS.map((f, i) => (
            <motion.button
              key={f.id}
              className="px-4 py-3 bg-gray-800 text-white shadow-md rounded-xl border border-gray-600"
              style={{ whiteSpace: "nowrap" }}
              onClick={() => setSelectedFormulaId(f.id)}
              whileTap={{ scale: 0.97 }}
              whileHover={{ scale: 1.02 }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.02, duration: 0.2 }}
              dangerouslySetInnerHTML={{ __html: renderLatex(f.formula) }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}