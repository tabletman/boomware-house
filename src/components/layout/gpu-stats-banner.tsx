'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Zap, TrendingUp, Server, ArrowRight, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function GPUStatsBanner() {
  const [isVisible, setIsVisible] = useState(true)
  const [liveStats, setLiveStats] = useState({
    rtx4090Rate: 0.54,
    h100Rate: 3.76,
    availableGPUs: 245,
    monthlyEarnings: 389
  })

  // Simulate live updates
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveStats(() => ({
        rtx4090Rate: 0.34 + Math.random() * 0.41, // $0.34-0.75
        h100Rate: 3.35 + Math.random() * 0.83,    // $3.35-4.18
        availableGPUs: 230 + Math.floor(Math.random() * 30),
        monthlyEarnings: 300 + Math.floor(Math.random() * 200)
      }))
    }, 8000)

    return () => clearInterval(interval)
  }, [])

  if (!isVisible) return null

  return (
    <div className="bg-gradient-to-r from-green-600 to-emerald-700 text-white">
      <div className="container pl-8 pr-4">
        <div className="flex items-center justify-between py-2">
          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse" />
              <span className="font-semibold">LIVE GPU MARKET</span>
            </div>

            <div className="flex items-center gap-4 divide-x divide-white/20">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-yellow-300" />
                <span>RTX 4090: ${liveStats.rtx4090Rate.toFixed(3)}/hr</span>
              </div>

              <div className="flex items-center gap-2 pl-4">
                <TrendingUp className="h-4 w-4 text-blue-300" />
                <span>H100: ${liveStats.h100Rate.toFixed(2)}/hr</span>
              </div>

              <div className="flex items-center gap-2 pl-4">
                <Server className="h-4 w-4 text-purple-300" />
                <span>{liveStats.availableGPUs} GPUs available</span>
              </div>

              <div className="hidden md:flex items-center gap-2 pl-4 text-green-200">
                <span>Avg: ${liveStats.monthlyEarnings}/month per GPU</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/gpu-rental">
              <Button
                size="sm"
                className="bg-white/10 hover:bg-white/20 text-white border-white/20 text-xs px-3 py-1 h-7"
              >
                Start Earning
                <ArrowRight className="ml-1 h-3 w-3" />
              </Button>
            </Link>

            <button
              onClick={() => setIsVisible(false)}
              className="p-1 hover:bg-white/10 rounded transition-colors"
              aria-label="Close banner"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}