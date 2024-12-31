"use client";
import React, { useState } from "react";
import Image from "next/image";
const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    // Thêm logic đăng nhập ở đây (ví dụ: gọi API)
    setTimeout(() => {
      if (email === "test@example.com" && password === "password") {
        alert("Login successful");
      } else {
        setError("Invalid username or password");
      }
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="flex items-center justify-center  min-h-screen bg-gray-100 rounded-4xl">
      <div className="bg-white shadow-md rounded p-6 w-[650px] max-w-sm">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
          Login
        </h2>
        <form className="flex flex-col gap-4 bg-white " onSubmit={handleSubmit}>
          {/* Email Input */}
          <div className="flex flex-col">
            <label className="text-black font-semibold">Email</label>
            <div className="flex items-center border border-gray-300 rounded-lg h-12 px-3 focus-within:border-blue-500 transition ease-in-out">
              <Image src="/mail.png" alt="" width={20} height={20} />
              <input
                type="email"
                id="email"
                className="ml-2 w-full h-full outline-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="flex flex-col">
            <label className="text-black font-semibold">Password</label>
            <div className="flex items-center border border-gray-300 rounded-lg h-12 px-3 focus-within:border-blue-500 transition ease-in-out">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="currentColor"
                viewBox="0 0 512 512"
              >
                <path d="M336 512H48c-26.5 0-48-21.5-48-48V240c0-26.5 21.5-48 48-48h288c26.5 0 48 21.5 48 48v224c0 26.5-21.5 48-48 48zM48 192c-8.8 0-16 7.2-16 16v224c0 8.8 7.2 16 16 16h288c8.8 0 16-7.2 16-16V208c0-8.8-7.2-16-16-16z" />
                <path d="M304 224c-8.8 0-16-7.2-16-16v-80c0-52.9-43.1-96-96-96s-96 43.1-96 96v80c0 8.8-7.2 16-16 16s-16-7.2-16-16v-80c0-70.6 57.4-128 128-128s128 57.4 128 128v80c0 8.8-7.2 16-16 16z" />
              </svg>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your Password"
                className="ml-2 w-full h-full outline-none"
              />
            </div>
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="mt-5 bg-black text-lamaGreenLight font-bold  text-sm rounded-lg h-12 w-full cursor-pointer"
          >
            {loading ? "Logining..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
