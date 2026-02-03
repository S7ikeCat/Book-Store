import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaGoogle } from "react-icons/fa";
import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";


type RegisterFormInputs = {
  email: string;
  password: string;
};

const Register = () => {
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormInputs>();

  const onSubmit: SubmitHandler<RegisterFormInputs> = async (data) => {
    setMessage("");
    try {
      const response = await fetch("http://localhost:3000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const resData = await response.json();
      if (!response.ok) {
        setMessage(resData.message || "Registration failed");
        return;
      }
      
      // Сохранять роль здесь необязательно
      setMessage("Registration successful!");
      navigate("/login");
       // перенаправление на login
    } catch {
      setMessage("Registration failed. Please try again.");
    }
  };

  return (
    <div className="h-[calc(100vh-120px)] flex justify-center items-center">
      <div className="w-full max-w-sm bg-white shadow-md rounded px-8 pt-6 pb-8">
        <h2 className="text-xl font-semibold mb-4">Please Sign Up</h2>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">Email</label>
            <input
              {...register("email", { required: "Email is required" })}
              type="email"
              id="email"
              className="shadow border rounded w-full py-2 px-3 focus:outline-none"
              placeholder="Email address"
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">Password</label>
            <input
              {...register("password", { required: "Password is required" })}
              type="password"
              id="password"
              className="shadow border rounded w-full py-2 px-3 focus:outline-none"
              placeholder="Password"
            />
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
          </div>

          {message && <p className="text-red-500 text-xs italic mb-3">{message}</p>}

          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-8 rounded w-full"
          >
            Sign Up
          </button>
        </form>

        <div className="mt-4 flex justify-center">
          <button className="flex items-center gap-2 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
            <FaGoogle />
            Sign Up with Google
          </button>
        </div>

        <p className="mt-4 text-sm text-center">
          Already have an account? <Link to="/login" className="text-blue-500 hover:text-blue-700">Login</Link>
        </p>

        <p className="mt-5 text-center text-gray-500 text-xs">☣️2025 Book Store. All rights reserved</p>
      </div>
    </div>
  );
};

export default Register;
