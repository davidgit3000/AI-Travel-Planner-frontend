"use client";
import React, { useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "react-toastify";

interface FormErrors {
  email?: string;
  password?: string;
}

export default function SignInPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const validatePassword = (password: string) => {
    return password.length >= 8;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Real-time validation
    const newErrors = { ...errors };

    if (name === "password") {
      if (!validatePassword(value)) {
        newErrors.password = "Password must be at least 8 characters long";
      } else {
        delete newErrors.password;
      }
    }
    setErrors(newErrors);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (Object.keys(errors).length === 0) {
      setIsLoading(true);
      try {
        const response = await fetch("http://localhost:8000/users/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.detail || "Failed to sign in");
        }

        const data = await response.json();

        // Store the token and user data
        login(data.access_token, data.user);

        // Show success message
        toast.success("Successfully signed in!");

        // Redirect to dashboard
        router.push("/dashboard");
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Invalid email or password";
        toast.error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className=" w-full min-h-screen flex items-center justify-center p-4">
      <div className="bg-slate-100 rounded-xl shadow-lg shadow-slate-500 dark:shadow-slate-400 p-8 w-full max-w-md transform transition-all duration-300 hover:scale-[1.02]">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
          Welcome Back
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={`text-gray-800 w-full px-4 py-3 rounded-lg border ${
                errors.email ? "border-red-500" : "border-gray-300"
              } focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300`}
              placeholder="Enter your email"
              autoComplete="email"
              aria-invalid={errors.email ? "true" : "false"}
              aria-describedby={errors.email ? "email-error" : undefined}
            />
            {errors.email && (
              <p
                id="email-error"
                className="mt-1 text-sm text-red-500"
                role="alert"
              >
                {errors.email}
              </p>
            )}
          </div>

          <div className="relative">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className={`text-gray-800 w-full px-4 py-3 rounded-lg border ${
                  errors.password ? "border-red-500" : "border-gray-300"
                } focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300`}
                placeholder="Enter your password"
                autoComplete="current-password"
                aria-invalid={errors.password ? "true" : "false"}
                aria-describedby={
                  errors.password ? "password-error" : undefined
                }
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none cursor-pointer"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.password && (
              <p
                id="password-error"
                className="mt-1 text-sm text-red-500"
                role="alert"
              >
                {errors.password}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading || Object.keys(errors).length > 0}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all 
                duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center cursor-pointer"
            aria-label={isLoading ? "Logging in..." : "Login"}
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin mr-2" size={20} />
                Signing in...
              </>
            ) : (
              "Sign in"
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <Link
            href="/sign-up"
            className="text-blue-600 hover:text-blue-700 font-medium focus:outline-none hover:underline transition-colors duration-300"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
