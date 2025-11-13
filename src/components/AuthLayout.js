// components/AuthLayout.js
import Image from 'next/image';

export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a1628] via-[#0f1e33] to-[#1a2942] flex items-center justify-center p-4">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Left side - Branding & Illustration */}
          <div className="hidden md:flex flex-col items-center justify-center bg-gradient-to-br from-[#2a3f54] to-[#1e2d3d] rounded-3xl p-12 shadow-2xl">
            {/* Logo */}
            <div className="mb-12">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center shadow-lg">
                  <svg className="w-8 h-8 text-[#1B5A7E]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z"/>
                  </svg>
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white">NexLearn</h1>
                  <p className="text-blue-200 text-sm">futuristic learning</p>
                </div>
              </div>
            </div>

            {/* Illustration placeholder - You should add the actual illustration SVG here */}
            <div className="w-full max-w-md">
              <div className="relative aspect-square">
                {/* This is a placeholder. Replace with your actual illustration */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg className="w-full h-full" viewBox="0 0 400 400" fill="none">
                    {/* Student illustration placeholder */}
                    <circle cx="200" cy="150" r="40" fill="#4A90E2" opacity="0.3"/>
                    <rect x="160" y="200" width="80" height="100" rx="10" fill="#E8833A" opacity="0.3"/>
                    <circle cx="100" cy="250" r="30" fill="#F5A623" opacity="0.3"/>
                    <rect x="250" y="220" width="60" height="80" rx="8" fill="#7B68EE" opacity="0.3"/>
                    <circle cx="300" cy="180" r="25" fill="#50C878" opacity="0.3"/>
                    
                    {/* Books */}
                    <rect x="80" y="320" width="30" height="40" rx="3" fill="#E74C3C"/>
                    <rect x="115" y="315" width="30" height="45" rx="3" fill="#3498DB"/>
                    <rect x="150" y="310" width="30" height="50" rx="3" fill="#F39C12"/>
                    
                    {/* Globe */}
                    <circle cx="320" cy="300" r="35" fill="#27AE60" opacity="0.5"/>
                    <ellipse cx="320" cy="300" rx="35" ry="15" fill="none" stroke="white" strokeWidth="2"/>
                    <line x1="320" y1="265" x2="320" y2="335" stroke="white" strokeWidth="2"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Form */}
          <div className="w-full">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}