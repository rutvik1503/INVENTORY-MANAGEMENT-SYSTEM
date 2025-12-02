import React, { useState, useEffect } from "react"; // include useEffect
import axios from "axios";
import { useNavigate } from "react-router-dom";

const LogIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();

  // ✅ useEffect must be at top level
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      // Optional: remove token if user visits login page
      localStorage.removeItem("token");
      showToast("You are logged out for security reason !", false);
      console.log("Token removed due to visiting login page");
    } 
  }, []);

  const handleSubmit = async () => {
    if (!email || !password) {
      showToast("Please fill all details!", false);
      return;
    }

    try {
      const res = await axios.post("https://inventory-management-system-8t3d.onrender.com/logIn", {
        email,
        password,
      });

      const success = !!res.data.superToken;
      showToast(res.data.message, success);

      if (success) {
        localStorage.setItem("token", "user_logged_in");
        setTimeout(() => navigate("/home"), 1000);
      }
    } catch (err) {
      showToast("Something went wrong!", false);
    }
  };

  const showToast = (msg, success) => {
    setMessage(msg);
    setIsSuccess(success);
    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 5000);
  };

  return (
    <div className="w-full h-screen inset-0 bg-gradient-to-r from-[rgba(0,0,0,0.99)] via-[rgba(0,0,0,0.9)] to-transparent p-[25px] flex justify-start items-center relative">
      {/* Logo */}
      <div className="absolute top-[25px] left-[25px] z-50 p-[5px]">
        <img src="https://res.cloudinary.com/dwx0y39ww/image/upload/v1764657357/Logo_d9mbbn.png" className="w-[50px] h-[50px]" />
      </div>

      {/* Toast Message */}
      {showPopup && (
        <div
          className={`fixed top-5 left-1/2 -translate-x-1/2 px-5 py-3 
    rounded-xl backdrop-blur-md border 
    shadow-xl text-white font-semibold transition-all
    ${
      isSuccess
        ? "bg-green-500/30 border-green-400"
        : "bg-red-500/30 border-red-400"
    }`}
        >
          {message}
        </div>
      )}

      {/* Login Form */}
      <div className="w-[30%] flex flex-col gap-[15px] items-start p-[15px]">
        <h1 className="text-white font-light text-[15px] mb-[20px]">
          Welcome Back{" "}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600 uppercase text-[35px] tracking-[0.5px] font-extrabold">
            Admin
          </span>
        </h1>

        {/* Email */}
        <label
          htmlFor="email"
          className="text-[#FFD700] font-medium text-[20px] transition-all hover:text-white cursor-pointer"
        >
          Email...
        </label>
        <input
          type="email"
          name="email"
          id="email"
          className="border border-[rgba(255,255,255,0.5)] rounded-[5px] w-[75%] text-white p-[10px] font-light tracking-[0.5px]
                     placeholder:text-gray-300 placeholder:opacity-60
                     transition-all focus:outline-none 
                     hover:border-[#3d87e0] 
                     focus:border-[#3d87e0] focus:ring-2 focus:ring-[#3d87e0]"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          placeholder="Enter your email"
        />

        {/* Password */}
        <label
          htmlFor="password"
          className="text-[#FFD700] font-medium text-[20px] transition-all hover:text-white cursor-pointer"
        >
          Password...
        </label>
        <input
          type="password"
          name="password"
          id="password"
          className="border border-[rgba(255,255,255,0.5)] rounded-[5px] w-[75%] text-white p-[10px] font-light tracking-[0.5px]
                     placeholder:text-gray-300 placeholder:opacity-60
                     transition-all focus:outline-none 
                     hover:border-[#3d87e0] 
                     focus:border-[#3d87e0] focus:ring-2 focus:ring-[#3d87e0]"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          placeholder="Enter your password"
        />

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          className="bg-[#3d87e0] text-white border border-[#3d87e0] 
             px-6 py-2 rounded-[15px] font-medium tracking-wide
             transition-all duration-300 shadow-md focus:outline-0
             hover:bg-transparent hover:text-[#3d87e0] hover:shadow-[#3d87e0]/40 hover:scale-[1.02]
             focus:bg-transparent focus:text-[#3d87e0] focus:shadow-[#3d87e0]/40 focus:scale-[1.02]"
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default LogIn;
