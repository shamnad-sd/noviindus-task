'use client'

import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0a1628] via-[#0f1e33] to-[#1a2942] relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl"></div>
      </div>

      {/* Main content */}
      <div className="relative z-10 text-center px-4">
        <div className="mb-8">
          <h1 className="text-9xl md:text-[90px] font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-blue-300 to-cyan-300 mb-4 drop-shadow-2xl">
            404
          </h1>
          <div className="w-20 h-1 bg-gradient-to-r from-blue-400 to-cyan-400 mx-auto mb-8 rounded-full"></div>
        </div>

        <div className="space-y-4 mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">
            Page Not Found
          </h2>
          <p className="text-blue-200/80 text-base max-w-xl mx-auto leading-relaxed">
            Oops! The page you're looking for doesn't exist or has been moved. Let's get you back on track.
          </p>
        </div>

        <Link
          href="/"
          className="inline-flex items-center gap-3 px-8 py-4  bg-[#177A9C] hover:bg-[#11566d] text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl group"
        >
          <span>Back to Home</span>
          <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
        </Link>
      </div>

      <div className="absolute inset-0 opacity-5">
        <div
          className="h-full w-full"
          style={{
            backgroundImage:
              'linear-gradient(0deg, transparent 24%, rgba(100, 200, 255, .1) 25%, rgba(100, 200, 255, .1) 26%, transparent 27%, transparent 74%, rgba(100, 200, 255, .1) 75%, rgba(100, 200, 255, .1) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(100, 200, 255, .1) 25%, rgba(100, 200, 255, .1) 26%, transparent 27%, transparent 74%, rgba(100, 200, 255, .1) 75%, rgba(100, 200, 255, .1) 76%, transparent 77%, transparent)',
            backgroundSize: '50px 50px',
          }}
        ></div>
      </div>
    </div>
  )
}
