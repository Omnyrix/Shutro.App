// File: src/pages/phy/1st/phy1st_ch1_formulas.tsx

import React, { useRef, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Capacitor } from "@capacitor/core"
import TopBar from "../../../components/topbar"
import NoInternetWarning from "../../../components/noInternetWarning"
import { motion, AnimatePresence } from "framer-motion"
import { getCookie, readScrollMap, writeScrollMap } from "../../../utils/cookie"
import FormulaInfo from "../../../components/formula_info"
import katex from "katex"
import "katex/dist/katex.min.css"
import { App as CapacitorApp } from "@capacitor/app"
import { StatusBar, Style } from "@capacitor/status-bar"  // added Style import

interface Formula {
  id: string
  formula: string
  description: string
  derivation: string
}

const FORMULAS: Formula[] = [
  {
    id: "v_u_at",
    formula: "v = u + a t",
    description: "Final velocity under constant acceleration.",
    derivation: `
Starting from \\(a = \\frac{dv}{dt}\\):
\\[
  \\int_u^v dv = \\int_0^t a\\,dt
  \\quad\\Rightarrow\\quad
  v - u = a t
  \\quad\\Rightarrow\\quad
  v = u + a t
\\]
    `,
  },
  {
    id: "s_ut_12at2",
    formula: "s = u t + \\tfrac{1}{2} a t^2",
    description: "Displacement under constant acceleration.",
    derivation: `
From velocity \\(v = u + a t\\) and \\(v = \\frac{ds}{dt}\\):
\\[
  s = \\int_0^t (u + a t')\\,dt'
    = u t + \\tfrac{1}{2}a t^2
\\]
    `,
  },
  {
    id: "v2_u2_2as",
    formula: "v^2 = u^2 + 2 a s",
    description: "Relation between velocity and displacement.",
    derivation: `
Using \\(v\,dv = a\,ds\\), integrate:
\\[
  \\int_u^v v\\,dv = \\int_0^s a\\,ds
  \\quad\\Rightarrow\\quad
  \\tfrac12 (v^2 - u^2) = a s
\\]
    `,
  },
  {
    id: "s_avg_t",
    formula: "s = \\tfrac{u + v}{2}\\,t",
    description: "Distance using average velocity.",
    derivation: `
Average velocity is \\(\\frac{u+v}{2}\\), so:
\\[
  s = \\frac{u+v}{2}\\,t
\\]
    `,
  },
  {
    id: "f_ma",
    formula: "F = m a",
    description: "Newton's second law.",
    derivation: "Force equals mass times acceleration.",
  },
  {
    id: "p_mv",
    formula: "p = m v",
    description: "Linear momentum.",
    derivation: "Momentum is mass times velocity.",
  },
  {
    id: "e_12mv2",
    formula: "E_k = \\tfrac12 m v^2",
    description: "Kinetic energy.",
    derivation: `
Work done accelerating from 0 to \\(v\\):
\\[
  W = \\int_0^v m v'\\,dv' = \\tfrac12 m v^2
\\]
    `,
  },
]

const chapterName = "Kinematics"

export default function Phy1stCh1FormulasPage() {
  const navigate = useNavigate()
  const [isDemo, setIsDemo] = useState(false)
  const [selectedFormulaId, setSelectedFormulaId] = useState<string | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Clear any old back-button listeners
  useEffect(() => {
    CapacitorApp.removeAllListeners()
  }, [])

  // Configure native status bar (match MainApp logic) :contentReference[oaicite:0]{index=0}
  useEffect(() => {
    StatusBar.setOverlaysWebView({ overlay: false })
    StatusBar.show()
    StatusBar.setBackgroundColor({ color: "#111827" })
    StatusBar.setStyle({ style: Style.Dark })
    const meta = document.querySelector('meta[name="theme-color"]')
    meta?.setAttribute("content", "#111827")
  }, [])

  // Demo-mode check
  useEffect(() => {
    getCookie("session").then(e => setIsDemo(!e))
  }, [])

  // Restore scroll position
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    readScrollMap().then(m => {
      if (typeof (m as any).phy1ch1formulasscroll === "number") {
        el.scrollTop = (m as any).phy1ch1formulasscroll
      }
    })
    const onScroll = async () => {
      const m = await readScrollMap()
      ;(m as any).phy1ch1formulasscroll = el.scrollTop
      await writeScrollMap(m)
    }
    el.addEventListener("scroll", onScroll)
    window.addEventListener("resize", onScroll)
    return () => {
      el.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
    }
  }, [])

  const openDetail = (id: string) => setSelectedFormulaId(id)
  const closeDetail = () => setSelectedFormulaId(null)

  // Back-button logic: close detail if open, else navigate back
  useEffect(() => {
    const backSub = CapacitorApp.addListener("backButton", () => {
      if (selectedFormulaId) {
        closeDetail()
      } else {
        navigate(-1)
      }
    })
    return () => {
      backSub.remove()
    }
  }, [selectedFormulaId, navigate])

  const renderLatex = (tex: string) =>
    katex.renderToString(tex, { throwOnError: false, output: "html" })

  return (
    <>
      {/* Safe-area top filler (only the notch part) */}
      <div
        className="fixed inset-x-0 top-0 bg-gray-900"
        style={{ height: "env(safe-area-inset-top)" }}
      />

      <div
        className="relative min-h-screen font-bengali bg-gray-800 text-white"
        style={{
          paddingTop: "env(safe-area-inset-top)",
          paddingBottom: "env(safe-area-inset-bottom)",
          paddingLeft: "env(safe-area-inset-left)",
          paddingRight: "env(safe-area-inset-right)",
          boxSizing: "border-box",
        }}
      >
        {isDemo && <NoInternetWarning />}

        {/* TopBar now sits just under the notch/status bar */}
        <div
          className="fixed inset-x-0 z-20 bg-gray-900"
          style={{ top: "env(safe-area-inset-top)" }}
        >
          <TopBar />
        </div>

        {/* Page title */}
        <div className="pt-[5rem] pb-2 text-center z-10">
          <h1 className="text-2xl font-bold">{chapterName} Formulas</h1>
        </div>

        {/* Formula list */}
        <div
          ref={containerRef}
          className="px-4 sm:px-6 md:px-8 pt-4 pb-10 overflow-y-auto z-10"
        >
          <div className="space-y-3 max-w-full sm:max-w-md md:max-w-lg lg:max-w-xl mx-auto">
            {FORMULAS.map((f, i) => (
              <motion.button
                key={f.id}
                onClick={() => openDetail(f.id)}
                className="w-full text-left bg-gray-700 rounded-lg border border-gray-600 px-4 py-4 shadow-md hover:bg-gray-600 transition-all duration-100"
                whileTap={{ scale: 0.97 }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.05 + i * 0.03,
                  duration: 0.1,
                  ease: [0.68, -0.55, 0.27, 1.55],
                }}
              >
                <div
                  className="text-white text-base sm:text-lg font-mono break-words"
                  dangerouslySetInnerHTML={{ __html: renderLatex(f.formula) }}
                />
              </motion.button>
            ))}
          </div>
        </div>

        {/* Detail overlay */}
        <AnimatePresence>
          {selectedFormulaId &&
            (() => {
              const formula = FORMULAS.find(f => f.id === selectedFormulaId)!
              return (
                <FormulaInfo
                  key="detail"
                  formula={formula.formula}
                  description={formula.description}
                  derivation={formula.derivation}
                  onClose={closeDetail}
                />
              )
            })()}
        </AnimatePresence>
      </div>
    </>
  )
}
