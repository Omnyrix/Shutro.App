// File: ../../../components/formula_info.tsx

import React, { useEffect, useRef } from "react"
import { motion } from "framer-motion"
import katex from "katex"
import "katex/dist/katex.min.css"
import { StatusBar } from "@capacitor/status-bar"
import { App } from "@capacitor/app"
import { useNavigate } from "react-router-dom"

interface FormulaInfoProps {
  formula: string
  description: string
  derivation: string
  onClose: () => void
}

export default function FormulaInfo({
  formula,
  description,
  derivation,
  onClose,
}: FormulaInfoProps) {
  const navigate = useNavigate()
  const isOpenRef = useRef(true)

  const handleClose = () => {
    isOpenRef.current = false
    onClose()
  }

  useEffect(() => {
    // ⚙️ Configure status bar for overlay
    StatusBar.setOverlaysWebView({ overlay: false })
    StatusBar.setBackgroundColor({ color: "#1f2937" })
    const metaTag = document.querySelector('meta[name="theme-color"]')
    metaTag?.setAttribute("content", "#1f2937")

    // 🎯 Intercept Android back button
    const backSub = App.addListener("backButton", () => {
      if (isOpenRef.current) {
        // overlay is open → close it
        isOpenRef.current = false
        onClose()
      } else {
        // overlay already closed → navigate back
        navigate(-1)
      }
    })

    return () => {
      backSub.remove()
      // restore status bar on unmount
      StatusBar.setBackgroundColor({ color: "#111827" })
      metaTag?.setAttribute("content", "#111827")
    }
  }, [onClose, navigate])

  const renderLatex = (tex: string) =>
    katex.renderToString(tex, { throwOnError: false, output: "html" })

  return (
    <motion.div
      key="detail"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 40 }}
      transition={{ duration: 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-0 z-30 bg-gray-800 overflow-auto"
      style={{ paddingTop: "calc(env(safe-area-inset-top, 0px) + 1rem)" }}
    >
      <div className="px-4 py-2">
        <button
          onClick={handleClose}
          className="text-white text-xl bg-gray-700 px-3 py-1 rounded hover:bg-gray-600"
        >
          ←
        </button>
      </div>

      <div className="px-4 sm:px-6 md:px-8 space-y-4 pb-6">
        <div
          className="w-full bg-gray-700 rounded-lg border border-gray-600 p-4 shadow-md"
          dangerouslySetInnerHTML={{ __html: renderLatex(formula) }}
        />
        <p className="text-center text-sm sm:text-base text-gray-300">
          {description}
        </p>
        <pre className="bg-gray-900 p-4 rounded-lg overflow-x-auto text-sm whitespace-pre-wrap">
          {derivation.trim()}
        </pre>
      </div>
    </motion.div>
  )
}
