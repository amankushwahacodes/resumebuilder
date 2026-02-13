import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../app/features/authSlice";
import api from "../configs/api";
import toast from "react-hot-toast";
import { Lock, Mail, User2Icon } from "lucide-react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import Loader from "../components/Loader";

function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [ isSigningUp, setIsSigningUp ] = useState(false);
  
  
  const { user, loading } = useSelector((state) => state.auth);


  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsSigningUp(true);
      const { data } = await api.post("/api/users/register", formData);
      dispatch(login(data));
      localStorage.setItem("token", data.token);
      toast.success(data.message);
      navigate("/app", { replace: true });
    } catch (error) {
      toast(error?.response?.data?.message || error.message);
    }
    finally{
      setIsSigningUp(false)
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  
  if (loading) return <Loader />;

  if (user) {
    return <Navigate to="/app" replace />;
  }


  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-gray-100">
      <form
        onSubmit={handleSubmit}
        className="sm:w-[370px] w-full text-center rounded-2xl px-8 py-8 bg-white shadow-lg border border-gray-200 backdrop-blur-sm  transition-all duration-300 hover:shadow-2xl"
      >
        <h1 className="text-gray-900 text-3xl mt-10 font-medium">Sign up</h1>
        <p className="text-gray-500 text-sm mt-2">Please Sign Up to continue</p>
        <div className="flex items-center mt-6 w-full bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden pl-6 gap-2">
          <User2Icon size={16} color="#6B7280" />

          <input
            type="text"
            name="name"
            placeholder="Name"
            className="border-none outline-none ring-0"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="flex items-center w-full mt-4 bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden pl-6 gap-2">
          <Mail size={13} color="#6b7280" />
          <input
            type="email"
            name="email"
            placeholder="Email id"
            className="border-none outline-none ring-0"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="flex items-center mt-4 w-full bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden pl-6 gap-2">
          <Lock size={13} color="#6b7280" />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="border-none outline-none ring-0"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <button
          type="submit"
          disabled={isSigningUp}
          className="mt-2 w-full h-11 rounded-full text-white bg-blue-500 hover:opacity-90 transition-opacity disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {isSigningUp ? (
            <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
          ) : (
            "Sign up"
          )}
        </button>

        <Link to="/login" className="block text-gray-500 text-sm mt-3 mb-11">
          Already have an account?
          <span className="text-blue-500 hover:underline">click here</span>
        </Link>
      </form>
    </div>
  );
}

export default Register;
