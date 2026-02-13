import React, { useState } from "react";
import { Lock, Mail } from "lucide-react";
import api from "../configs/api";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../app/features/authSlice";
import toast from "react-hot-toast";
import { Link, Navigate, useNavigate } from "react-router-dom";
import Loader from "../components/Loader";

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [ isLoggingIn, setIsLoggingIn ] = useState(false);

  const { user, loading } = useSelector((state) => state.auth);
  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    password: "",
  });

  if (loading) return <Loader />;

  if (user) {
    return <Navigate to="/app" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoggingIn(true);
      const { data } = await api.post(`/api/users/login`, formData);
      dispatch(login(data));
      localStorage.setItem("token", data.token);
      toast.success(data.message);
      navigate("/app", { replace: true });
    } catch (error) {
      toast(error?.response?.data?.message || error.message);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDemoLogin = async () => {
    try {
      setIsLoggingIn(true);
      const { data } = await api.post(`/api/users/login`, {
        email: import.meta.env.VITE_DEMO_EMAIL,
        password: import.meta.env.VITE_DEMO_PASSWORD,
      });

      dispatch(login(data));
      localStorage.setItem("token", data.token);
      toast.success("Logged in as Demo User");
      navigate("/app", { replace: true });
    } catch (error) {
      toast("Demo login failed");
    }
    finally{
      setIsLoggingIn(false);
    }
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-gray-100"
    >
      <form
        onSubmit={handleSubmit}
        className="sm:w-[370px] w-full text-center rounded-2xl px-8 py-8 bg-white shadow-lg border border-gray-200 backdrop-blur-sm  transition-all duration-300 hover:shadow-2xl"
      >
        <h1 className="text-gray-900 text-3xl mt-10 font-medium">Login</h1>
        <p className="text-gray-500 text-sm mt-2">Please Log in to continue</p>
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
        {/* <div className="mt-4 text-left text-blue-500">
          <button className="text-sm" type="reset">
            Forget password?
          </button>
        </div> */}
        <div className="mt-4 space-y-2">
          <button
            type="submit"
            disabled={isLoggingIn}
            className="mt-2 w-full h-11 rounded-full text-white bg-blue-500 hover:opacity-90 transition-opacity disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isLoggingIn ? (
              <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            ) : (
              "Login"
            )}
          </button>
          <button
            type="button"
            onClick={handleDemoLogin}
            disabled={isLoggingIn}
            className="w-full h-10 rounded-full border border-gray-300 text-gray-600 hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoggingIn ? (
              <div className="flex items-center justify-center gap-2">
                <span className="h-4 w-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></span>
                Logging in...
              </div>
            ) : (
              "Try Demo"
            )}
          </button>
        </div>

        <Link to="/register" className="block text-gray-500 text-sm mt-5 mb-11">
          Don't have an account?
          <span href="#" className="text-blue-500 hover:underline">
            click here
          </span>
        </Link>
      </form>
    </div>
  );
}

export default Login;
