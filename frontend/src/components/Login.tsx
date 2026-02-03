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

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormInputs>();

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

      // сохраняем токен и роль
      localStorage.setItem("token", result.token);
      localStorage.setItem("role", result.role);

      // редирект по роли
      if (result.role === "ADMIN") {
        navigate("/dashboard"); // админ
      } else {
        navigate("/"); // обычный пользователь
      }
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
            <label htmlFor="email">Email</label>
            <input {...register("email", { required: "Email is required" })}
                   type="email" id="email" placeholder="Email" className="shadow border rounded w-full py-2 px-3"/>
            {errors.email && <p className="text-red-500">{errors.email.message}</p>}
          </div>

          <div className="mb-4">
            <label htmlFor="password">Password</label>
            <input {...register("password", { required: "Password is required" })}
                   type="password" id="password" placeholder="Password" className="shadow border rounded w-full py-2 px-3"/>
            {errors.password && <p className="text-red-500">{errors.password.message}</p>}
          </div>

          {message && <p className="text-red-500 mb-3">{message}</p>}

          <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-8 rounded">
            Login
          </button>
        </form>

        <p className="mt-4 text-sm">
          Haven't an account? <Link to="/signup" className="text-blue-500 hover:text-blue-700">Sign up</Link>
        </p>

        <div className="mt-4">
          <button className="w-full flex gap-2 items-center justify-center bg-secondary hover:bg-blue-700 text-white py-2 px-4 rounded">
            <FaGoogle /> Sign in with Google
          </button>
        </div>

        <p className="mt-5 text-center text-gray-500 text-xs">☣️2025 Book Store. All rights reserved</p>
      </div>
    </div>
  );
};

export default Login;
