import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link } from "react-router-dom"; // 👈 Import for navigation
import mainImage from "../assets/img/rebs_login.png";

export default function LoginUI() {
  const [showPassword, setShowPassword] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

  const slides = [
    {
      title: "User-Friendly Interface",
      description:
        "Intuitive design for effortless navigation and enhanced user experience.",
    },
    {
      title: "Integration Capabilities",
      description: "Seamless connectivity with third-party tools and platforms",
    },
    {
      title: "Analytics and Reporting",
      description:
        "Data-driven insights to optimize performance and decision-making.",
    },
    {
      title: "Mobile Accessibility",
      description:
        "Stay connected and productive on the go with mobile-friendly solutions.",
    },
    {
      title: "Data Security",
      description:
        "Robust protection measures to safeguard sensitive information",
    },
  ];

  const showSlide = (index) => setCurrentSlide(index);

  return (
    <div className="w-full h-screen bg-black overflow-hidden flex">
      <div className="flex w-full h-full">
        {/* Left - Image + Slides */}
        <div className="relative h-full overflow-hidden" style={{ width: "55%" }}>
          <img src={mainImage} alt="Office" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/40 flex flex-col">
            <div className="relative flex flex-col justify-end h-full p-4">
              {slides.map((slide, index) => (
                <div
                  key={index}
                  className={`absolute w-full flex flex-col items-center text-center transition-opacity duration-500 ${
                    currentSlide === index ? "opacity-100" : "opacity-0"
                  }`}
                >
                  <h2 className="text-white text-2xl mb-4">{slide.title}</h2>
                  <p className="text-white text-sm mb-20">{slide.description}</p>
                </div>
              ))}

              {/* Navigation dots */}
              <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 flex gap-2">
                {slides.map((_, index) => (
                  <span
                    key={index}
                    onClick={() => showSlide(index)}
                    className={`w-2 h-2 rounded-full cursor-pointer ${
                      currentSlide === index ? "bg-white" : "bg-gray-400"
                    }`}
                  ></span>
                ))}
              </div>

              {/* Website */}
              <div className="absolute bottom-2 left-2 text-white text-sm">
                www.rebs.in
              </div>
            </div>
          </div>
        </div>

        {/* Right - Login Form */}
        <div className="h-full flex flex-col relative" style={{ width: "45%" }}>
          <div className="bg-white w-full h-full flex flex-col">
            {/* Centered login card */}
            <div className="flex-grow flex justify-center items-center px-6 md:px-8 lg:px-12">
              <div className="w-full max-w-md transform scale-90 p-6">
                {/* Header */}
                <div className="text-start mb-4">
                  <h1 className="text-3xl font-normal text-black mb-1">
                    Welcome back,
                  </h1>
                  <h1 className="text-3xl font-normal text-black mb-2">Admin</h1>
                  <p className="text-gray-500 text-sm">
                    Welcome back! Please enter your details
                  </p>
                </div>

                {/* Form */}
                <div className="space-y-4">
                  {/* Email */}
                  <div>
                    <input
                      type="text"
                      placeholder="Email"
                      className="w-full text-black border-b border-gray-400 focus:outline-none focus:border-black bg-transparent py-1.5"
                    />
                  </div>

                  {/* Password */}
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      className="w-full text-black border-b border-gray-400 focus:outline-none focus:border-black bg-transparent py-1.5 pr-8"
                    />
                    <div
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer"
                      onClick={togglePasswordVisibility}
                    >
                      {showPassword ? (
                        <FaEyeSlash size={16} />
                      ) : (
                        <FaEye size={16} />
                      )}
                    </div>
                  </div>

                  {/* Remember me + Recovery */}
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        className="h-4 w-4 text-black border-gray-300 rounded"
                      />
                      <label className="ml-2 block text-gray-700">
                        Remember me
                      </label>
                    </div>

                    {/* 👇 Link to Forgot Password page */}
                    <Link
                      to="/forgetpass"
                      className="font-semibold text-black hover:text-gray-800"
                    >
                      recovery password
                    </Link>
                  </div>

                  {/* Submit */}
                  <button className="w-full py-2.5 bg-black hover:bg-gray-800 text-white font-medium rounded-xl transition duration-150">
                    Login
                  </button>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="absolute bottom-2 left-0 w-full px-6 md:px-8 flex justify-between text-center md:text-left">
              <div>
                <p className="text-[12px] text-gray-800">
                  Powered by{" "}
                  <a href="https://teqbae.com/" className="text-black font-medium">
                    Teqbae
                  </a>{" "}
                  innovations and solution India Pvt Ltd
                </p>
              </div>
              <div className="ml-auto space-x-4">
                <a href="#" className="text-[12px] text-gray-800">
                  Privacy Policy
                </a>
                <a href="#" className="text-[12px] text-gray-800">
                  Support
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
