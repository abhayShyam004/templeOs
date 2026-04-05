"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface LocationTagProps {
  city?: string
  country?: string
  timezone?: string
}

export function LocationTag({ city = "Tirumalagiri", country = "Secunderabad", timezone = "IST" }: LocationTagProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [currentTime, setCurrentTime] = useState("")
  const [showMap, setShowMap] = useState(false)

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      setCurrentTime(
        now.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }),
      )
    }
    updateTime()
    const interval = setInterval(updateTime, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <>
      <button
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => setShowMap(true)}
        className="group relative flex items-center gap-3 rounded-full border border-border/60 bg-secondary/10 px-4 py-2 transition-all duration-500 ease-out hover:border-secondary/40 hover:bg-secondary/20 hover:shadow-[0_0_20px_rgba(255,153,51,0.1)]"
      >
        {/* Live pulse indicator */}
        <div className="relative flex items-center justify-center">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          </span>
        </div>

        {/* Location text */}
        <div className="flex items-center gap-2 overflow-hidden min-w-[140px] h-5 relative">
          <span
            className="text-xs font-bold uppercase tracking-widest text-foreground transition-all duration-500 whitespace-nowrap"
            style={{
              transform: isHovered ? "translateY(-150%)" : "translateY(0)",
              opacity: isHovered ? 0 : 1,
            }}
          >
            {city}, {country}
          </span>

          <span
            className="absolute inset-0 text-xs font-bold uppercase tracking-widest text-secondary transition-all duration-500 whitespace-nowrap"
            style={{
              transform: isHovered ? "translateY(0)" : "translateY(150%)",
              opacity: isHovered ? 1 : 0,
            }}
          >
            {currentTime} {timezone}
          </span>
        </div>

        {/* Arrow indicator */}
        <svg
          className="h-3 w-3 text-muted-foreground transition-all duration-300 group-hover:text-secondary"
          style={{
            transform: isHovered ? "translateX(2px) rotate(-45deg)" : "translateX(0) rotate(0)",
            opacity: isHovered ? 1 : 0.5,
          }}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={3}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
        </svg>
      </button>

      {/* Map Modal */}
      <AnimatePresence>
        {showMap && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMap(false)}
              className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-3xl overflow-hidden rounded-3xl border bg-card shadow-2xl"
            >
              <div className="flex items-center justify-between border-b p-4 px-6">
                <h3 className="font-serif text-xl font-bold text-foreground">Temple Location</h3>
                <button
                  onClick={() => setShowMap(false)}
                  className="rounded-full p-2 hover:bg-muted transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="aspect-video w-full bg-muted">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3805.492914312208!2d78.49091097644839!3d17.483968283419834!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb9a8dca603c13%3A0x21c6bc3067bba1e1!2sSree%20Muthappan%20Temple%20Indira%20Nagar!5e0!3m2!1sen!2sin!4v1774682896249!5m2!1sen!2sin"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
              <div className="p-6 bg-secondary/5">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Sree Muthappan Temple Indira Nagar, 31-795, Bank Colony, Kanajiguda, Old Bowenpally, Secunderabad, Telangana 500015
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}
