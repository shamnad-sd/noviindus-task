'use client'

import Link from 'next/link'
import { AlertTriangle, ChevronRight } from 'lucide-react'

export default function Error(){
 
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0a1628] via-[#0f1e33] to-[#1a2942] relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-red-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 text-center px-4">
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <h1 className="text-9xl md:text-[90px] font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-orange-300 to-yellow-300 mb-4 drop-shadow-2xl">
              500
            </h1>
            <AlertTriangle className="absolute -top-4 -right-8 w-16 h-16 text-red-400/60 animate-bounce" />
          </div>
        </div>
        <div className="w-20 h-1 bg-gradient-to-r from-red-400 to-orange-400 mx-auto mb-8 rounded-full"></div>

        <div className="space-y-4 mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">
            Server Error
          </h2>
          <p className="text-blue-200/80 max-w-xl mx-auto leading-relaxed">
            Something went wrong on our end. We're working to fix it. Please try again or return to the home page.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
         
          <Link
            href="/"
            className="inline-flex items-center gap-3 px-8 py-4 bg-[#177A9C] hover:bg-[#11566d] text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 border border-blue-500/50"
          >
            <span>Back to Home</span>
            <ChevronRight className="w-5 h-5" />
          </Link>
        </div>
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
