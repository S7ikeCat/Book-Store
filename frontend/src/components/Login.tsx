import { useState } from "react";
import { Link } from "react-router-dom";
import { FaGoogle } from "react-icons/fa";
import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router-dom";

type LoginFormInputs = {
    email: string;
    password: string;
  };
  
  const Login = () => {
    const navigate = useNavigate();
    const [message, setMessage] = useState("");
  
    const {
      register,
      handleSubmit,
      formState: { errors },
    } = useForm<LoginFormInputs>();
  
    const onSubmit: SubmitHandler<LoginFormInputs> = async (data) => {
        setMessage("");
      
        try {
          const response = await fetch("http://localhost:3000/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
          });
      
          const result = await response.json();
      
          if (!response.ok) {
            setMessage(result.message || "Login failed");
            return;
          }
      
          // 🔑 КЛЮЧЕВОЕ МЕСТО
          localStorage.setItem("token", result.token);
      
          navigate("/dashboard");
        } catch (err) {
          console.error(err);
          setMessage("Login failed");
        }
      };
      

  return (
    <div className="h-[calc(100vh-120px)] flex justify-center items-center">
      <div className="w-full max-w-sm bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <h2 className="text-xl font-semibold mb-4">Please Login</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
              Email
            </label>
            <input
              {...register("email", { required: "Email is required" })}
              type="email"
              id="email"
              placeholder="Email address"
              className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow"
            />
            {errors.email && (
              <p className="text-red-500 text-xs italic mt-1">{errors.email.message}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <input
              {...register("password", { required: "Password is required" })}
              type="password"
              id="password"
              placeholder="Password"
              className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow"
            />
            {errors.password && (
              <p className="text-red-500 text-xs italic mt-1">{errors.password.message}</p>
            )}
          </div>

          {message && <p className="text-red-500 text-xs italic mb-3">{message}</p>}

          <div>
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-8 rounded focus:outline-none"
            >
              Login
            </button>
          </div>
        </form>

        <p className="mt-4 text-sm font-medium">
          Haven't an account? Please{" "}
          <Link to="/signup" className="text-blue-500 hover:text-blue-700">
            Sign up
          </Link>
        </p>

        <div className="mt-4">
          <button className="w-full flex gap-2 items-center justify-center bg-secondary hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none">
            <FaGoogle /> Sign in with Google
          </button>
        </div>

        <p className="mt-5 text-center text-gray-500 text-xs">☣️2025 Book Store. All rights reserved</p>
      </div>
    </div>
  );
};

export default Login;
