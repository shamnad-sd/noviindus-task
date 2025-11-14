'use client';

import Image from "next/image";

const AuthLayout = ({ children }) => {
  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center p-4 relative"
      style={{ backgroundImage: "url('/Form-bg.jpg')" }}

    >
      <div className="absolute inset-0 bg-black/70 z-0"></div>
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-20 left-10 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-[60rem] mx-auto z-10">
        <div className="grid md:grid-cols-2 items-center rounded-3xl shadow-2xl overflow-hidden bg-[#1c3141]/80">
          <div className="hidden md:flex flex-col items-center justify-center">
            <Image
              src="/FormImg.png"
              alt="NexLearn Illustration"
              width={500}
              height={400}
              className="w-full h-auto"
              priority
            />
          </div>

          <div className="w-full flex flex-col justify-center p-2">
            {children}
          </div>
        </div>
      </div>
    </div>

  );
}

export default AuthLayout
