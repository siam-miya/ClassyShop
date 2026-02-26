import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/firebase.config";
import { useNavigate } from "react-router";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert("successfully logged in!");
      navigate("/admin");
    } catch (error) {
      alert("Login failed!");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-50 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100">
        <h2 className="text-3xl font-black text-slate-900 mb-6 text-center">Admin <span className="text-blue-600">Login</span></h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <input 
            required type="email" placeholder="Email Address" 
            className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => setEmail(e.target.value)} 
          />
          <input 
            required type="password" placeholder="Password" 
            className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => setPassword(e.target.value)} 
          />
          <button type="submit" className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold hover:bg-blue-600 transition-all">
            Login Now
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;