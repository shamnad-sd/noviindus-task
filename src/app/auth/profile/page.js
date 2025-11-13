// app/auth/profile/page.js
"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import AuthLayout from "@/components/AuthLayout";
import { authAPI } from "@/lib/api";
import { useAuthStore } from "@/lib/store";
import toast from "react-hot-toast";

export default function ProfilePage() {
  const router = useRouter();
  const mobile = useAuthStore((state) => state.mobile);
  const setTokens = useAuthStore((state) => state.setTokens);
  const setUser = useAuthStore((state) => state.setUser);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    qualification: "",
  });
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!mobile) {
      router.push("/auth/login");
    }
  }, [mobile, router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast.error("Please select an image file");
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }

      setProfileImage(file);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);

      // Clear error
      if (errors.profileImage) {
        setErrors((prev) => ({ ...prev, profileImage: "" }));
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.qualification.trim()) {
      newErrors.qualification = "Qualification is required";
    }

    if (!profileImage) {
      newErrors.profileImage = "Profile image is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fill all required fields");
      return;
    }

    setLoading(true);

    try {
      const response = await authAPI.createProfile(
        mobile,
        formData.name,
        formData.email,
        formData.qualification,
        profileImage
      );

      if (response.success) {
        setTokens(response.access_token, response.refresh_token);
        setUser(response.user);
        toast.success("Profile created successfully!");
        router.push("/instructions");
      } else {
        toast.error(response.message || "Failed to create profile");
      }
    } catch (err) {
      console.error("Profile creation error:", err);
      const errorMessage =
        err.response?.data?.message ||
        "Failed to create profile. Please try again.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="bg-white rounded-xl shadow-2xl p-7">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">
          Add Your Details
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Profile Image Upload */}
          <div className="flex flex-col items-center mb-6">
            <div
              onClick={() => fileInputRef.current?.click()}
              className={`w-32 h-32 rounded-2xl border-2 border-dashed cursor-pointer transition-all hover:border-[#1B5A7E] hover:bg-gray-50 flex items-center justify-center overflow-hidden ${
                errors.profileImage ? "border-red-300" : "border-gray-300"
              }`}
            >
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Profile preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex flex-col justify-center items-center text-gray-400">
                  <svg
                    width="25"
                    height="22"
                    viewBox="0 0 25 22"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M17.1324 12.3734C17.1324 12.6259 17.0322 12.868 16.8537 13.0465C16.6752 13.225 16.4331 13.3252 16.1806 13.3252H13.3252V16.1806C13.3252 16.4331 13.225 16.6752 13.0465 16.8537C12.868 17.0322 12.6259 17.1324 12.3734 17.1324C12.121 17.1324 11.8789 17.0322 11.7004 16.8537C11.5219 16.6752 11.4216 16.4331 11.4216 16.1806V13.3252H8.56622C8.31379 13.3252 8.07169 13.225 7.8932 13.0465C7.7147 12.868 7.61442 12.6259 7.61442 12.3734C7.61442 12.121 7.7147 11.8789 7.8932 11.7004C8.07169 11.5219 8.31379 11.4216 8.56622 11.4216H11.4216V8.56622C11.4216 8.31379 11.5219 8.07169 11.7004 7.8932C11.8789 7.7147 12.121 7.61442 12.3734 7.61442C12.6259 7.61442 12.868 7.7147 13.0465 7.8932C13.225 8.07169 13.3252 8.31379 13.3252 8.56622V11.4216H16.1806C16.4331 11.4216 16.6752 11.5219 16.8537 11.7004C17.0322 11.8789 17.1324 12.121 17.1324 12.3734ZM24.7469 5.71081V19.036C24.7469 19.7933 24.446 20.5196 23.9105 21.0551C23.375 21.5906 22.6488 21.8915 21.8915 21.8915H2.85541C2.09811 21.8915 1.37182 21.5906 0.836329 21.0551C0.300837 20.5196 0 19.7933 0 19.036V5.71081C0 4.95351 0.300837 4.22723 0.836329 3.69174C1.37182 3.15624 2.09811 2.85541 2.85541 2.85541H6.1534L7.49544 0.847104C7.66898 0.587005 7.90391 0.373656 8.17948 0.225913C8.45504 0.0781687 8.76276 0.000578915 9.07543 0H15.6714C15.9841 0.000578915 16.2918 0.0781687 16.5674 0.225913C16.843 0.373656 17.0779 0.587005 17.2514 0.847104L18.5935 2.85541H21.8915C22.6488 2.85541 23.375 3.15624 23.9105 3.69174C24.446 4.22723 24.7469 4.95351 24.7469 5.71081ZM22.8433 5.71081C22.8433 5.45838 22.743 5.21629 22.5645 5.03779C22.386 4.85929 22.1439 4.75901 21.8915 4.75901H18.0842C17.9275 4.75911 17.7732 4.72051 17.6349 4.64662C17.4967 4.57273 17.3789 4.46584 17.2919 4.33546L15.6714 1.9036H9.07543L7.45499 4.33546C7.368 4.46584 7.25016 4.57273 7.11193 4.64662C6.9737 4.72051 6.81936 4.75911 6.66262 4.75901H2.85541C2.60297 4.75901 2.36088 4.85929 2.18238 5.03779C2.00388 5.21629 1.9036 5.45838 1.9036 5.71081V19.036C1.9036 19.2885 2.00388 19.5306 2.18238 19.7091C2.36088 19.8876 2.60297 19.9878 2.85541 19.9878H21.8915C22.1439 19.9878 22.386 19.8876 22.5645 19.7091C22.743 19.5306 22.8433 19.2885 22.8433 19.036V5.71081Z"
                      fill="#343330"
                    />
                  </svg>

                  <span className="text-[9px] pt-3 text-[#CECECE]">Add Your Profile picture</span>
                </div>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
            {errors.profileImage && (
              <p className="mt-2 text-sm text-red-600">{errors.profileImage}</p>
            )}
          </div>

          {/* Name Input */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Name<span className="text-red-500">*</span>
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your Full Name"
              className={`w-full px-4 py-4 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all ${
                errors.name
                  ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                  : "border-gray-200 focus:border-[#1B5A7E] focus:ring-blue-100"
              }`}
              disabled={loading}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name}</p>
            )}
          </div>

          {/* Email Input */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Email<span className="text-red-500">*</span>
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your Email Address"
              className={`w-full px-4 py-4 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all ${
                errors.email
                  ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                  : "border-gray-200 focus:border-[#1B5A7E] focus:ring-blue-100"
              }`}
              disabled={loading}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email}</p>
            )}
          </div>

          {/* Qualification Input */}
          <div>
            <label
              htmlFor="qualification"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Your qualification<span className="text-red-500">*</span>
            </label>
            <input
              id="qualification"
              name="qualification"
              type="text"
              value={formData.qualification}
              onChange={handleChange}
              placeholder="e.g., Bachelor's in Computer Science"
              className={`w-full px-4 py-4 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all ${
                errors.qualification
                  ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                  : "border-gray-200 focus:border-[#1B5A7E] focus:ring-blue-100"
              }`}
              disabled={loading}
            />
            {errors.qualification && (
              <p className="mt-1 text-sm text-red-600">
                {errors.qualification}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 px-6 cursor-pointer rounded-xl text-white font-semibold text-lg transition-all duration-200 ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[#1C3141] hover:bg-[#13465F]  hover:shadow-lg transform hover:-translate-y-0.5"
            }`}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Creating Profile...
              </span>
            ) : (
              "Get Started"
            )}
          </button>
        </form>
      </div>
    </AuthLayout>
  );
}
