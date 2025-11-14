"use client";
import { authAPI } from "@/lib/api";
import { useAuthStore } from "@/lib/store";
import React from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Image from "next/image";

const Navbar = () => {
  const router = useRouter();
  const { logout } = useAuthStore();

  const handleLogout = async () => {
    try {
      await authAPI.logout();
      logout();
      toast.success("Logged out successfully");
      router.push("/auth/login");
    } catch (error) {
      console.error("Logout error:", error);
      logout();
      router.push("/auth/login");
    }
  };
  return (
   <nav className="bg-white shadow-sm border-b border-gray-200 relative">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="flex justify-center items-center h-20 relative">
      <Image
        src="/logo.png"
        alt="logo"
        width={180}
        height={200}
        className="object-contain"
      />
      <button
        onClick={handleLogout}
        className="absolute cursor-pointer right-0 px-5 py-3 bg-[#177A9C] text-white rounded-lg  hover:bg-[#13465F] transition-colors"
      >
        Logout
      </button>
    </div>
  </div>
</nav>

  );
};

export default Navbar;
