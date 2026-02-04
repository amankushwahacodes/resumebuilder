import React from "react";
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

  const {user,loading} = useSelector(state => state.auth);
    const [formData, setFormData] = React.useState({
      name: "",
      email: "",
      password: "",
    });

  if(loading) return <Loader/>


  if(user){
    return <Navigate to='/app' replace />
  }



  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post(`/api/users/login`, formData);
      dispatch(login(data));
      localStorage.setItem("token", data.token);
      toast.success(data.message);
      navigate("/app", { replace: true });
    } catch (error) {
      toast(error?.response?.data?.message || error.message);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="sm:w-[350px] w-full text-center border border-gray-300/60 rounded-2xl px-8 bg-white"
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
        <button
          type="submit"
          className="mt-2 w-full h-11 rounded-full text-white bg-blue-500 hover:opacity-90 transition-opacity"
        >
          Login
        </button>
        <Link to="/register" className="text-gray-500 text-sm mt-3 mb-11">
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
