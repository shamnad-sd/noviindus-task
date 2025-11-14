'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import { authAPI } from '@/lib/api';
import toast from 'react-hot-toast';
import Navbar from '@/components/Navbar';

const Instructions = () => {
  const router = useRouter();
  const { isAuthenticated, checkAuth, logout } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const authenticated = checkAuth();
    if (!authenticated) {
      router.push('/auth/login');
    }
  }, [checkAuth, router]);

  const handleStartTest = () => {
    toast.success('Starting exam...');
    router.push('/exam');
  };

  if (!mounted || !isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#F4FCFF]">
      <Navbar/>
      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
        <div className=" overflow-hidden">
          {/* Header */}
          <div className="px-8 py-3">
            <h1 className="text-[26px] font-semibold text-[#5C5C5C] text-center">
              Ancient Indian History MCQ
            </h1>
          </div>

          {/* Stats Card */}
          <div className="px-8 py-6">
            <div className="bg-[#1C3141] rounded-xl p-6 md:p-9 grid grid-cols-3 gap-4 text-white">
              <div className="text-center border-r border-white/20">
                <p className="text-[11px] md:text-[15px] mb-2">Total MCQ's:</p>
                <p className="text-[30px] md:text-[42px]">50</p>
              </div>
              <div className="text-center border-r border-white/20">
                <p className="text-[11px] md:text-[15px] mb-2">Total marks:</p>
                <p className="text-[30px] md:text-[42px] ">50</p>
              </div>
              <div className="text-center">
                <p className="text-[11px] md:text-[15px] mb-2">Total time:</p>
                <p className="text-[30px] md:text-[42px] ">90:00</p>
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="px-8 py-6">
            <h2 className="text-[18px] font-bold text-[#5C5C5C] mb-4">Instructions:</h2>
            <ol className="space-y-2 text-[#5C5C5C]">
              <li className="flex gap-1">
                <span className=" text-[#5C5C5C] min-w-[1.5rem]">1.</span>
                <span>You have 100 minutes to complete the test.</span>
              </li>
              <li className="flex gap-1">
                <span className=" text-[#5C5C5C] min-w-[1.5rem]">2.</span>
                <span>Test consists of 100 multiple-choice q's.</span>
              </li>
              <li className="flex gap-1">
                <span className=" text-[#5C5C5C] min-w-[1.5rem]">3.</span>
                <span>You are allowed 2 retest attempts if you do not pass on the first try.</span>
              </li>
              <li className="flex gap-1">
                <span className=" text-[#5C5C5C] min-w-[1.5rem]">4.</span>
                <span>Each incorrect answer will incur a negative mark of -1/4.</span>
              </li>
              <li className="flex gap-1">
                <span className=" text-[#5C5C5C] min-w-[1.5rem]">5.</span>
                <span>Ensure you are in a quiet environment and have a stable internet connection.</span>
              </li>
              <li className="flex gap-1">
                <span className=" text-[#5C5C5C] min-w-[1.5rem]">6.</span>
                <span>Keep an eye on the timer, and try to answer all questions within the given time.</span>
              </li>
              <li className="flex gap-1">
                <span className=" text-[#5C5C5C] min-w-[1.5rem]">7.</span>
                <span>Do not use any external resources such as dictionaries, websites, or assistance.</span>
              </li>
              <li className="flex gap-1">
                <span className=" text-[#5C5C5C] min-w-[1.5rem]">8.</span>
                <span>Complete the test honestly to accurately assess your proficiency level.</span>
              </li>
              <li className="flex gap-1">
                <span className=" text-[#5C5C5C] min-w-[1.5rem]">9.</span>
                <span>Check answers before submitting.</span>
              </li>
              <li className="flex gap-1">
                <span className=" text-[#5C5C5C] min-w-[1.5rem]">10.</span>
                <span>Your test results will be displayed immediately after submission, indicating whether you have passed or need to retake the test.</span>
              </li>
            </ol>
          </div>

          {/* Start Test Button */}
          <div className="px-8 py-3 flex justify-center">
            <button
              onClick={handleStartTest}
              className="px-12 py-4 md:px-36 md:py-3 bg-[#1C3141] cursor-pointer text-white rounded-xl font-semibold text-lg hover:bg-[#13465F] transition-all hover:shadow-lg transform hover:-translate-y-0.5"
            >
              Start Test
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
export default Instructions