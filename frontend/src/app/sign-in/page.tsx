"use client";
import React, { useEffect, useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { signIn, useSession } from "next-auth/react";
import { getUserByEmail } from "@/app/api/client";
import LoadingScreen from "@/components/plan/LoadingScreen";

interface FormErrors {
  email?: string;
  password?: string;
}

const loadingSteps = [
  "Verifying your credentials",
  "Setting up your session",
  "Getting your profile ready",
  "Almost there! Preparing your dashboard",
];

export default function SignInPage() {
  const router = useRouter();
  const { login } = useAuth();
  const { data: session } = useSession();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [loadingText, setLoadingText] = useState(loadingSteps[0]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isLoading) {
      timer = setInterval(() => {
        setLoadingStep((prev) => (prev + 1) % loadingSteps.length);
      }, 2000);
    }
    return () => clearInterval(timer);
  }, [isLoading]);

  useEffect(() => {
    if (isLoading) {
      setLoadingText(loadingSteps[loadingStep]);
    }
  }, [loadingStep, isLoading]);

  useEffect(() => {
    const handleGoogleAuth = async () => {
      if (!session?.user?.email || !session?.accessToken) return;
      
      const alreadyLoggedIn = localStorage.getItem("token");
      // Prevent re-login if already logged in
      if (alreadyLoggedIn) return;

      if (session?.user?.email && session?.accessToken) {
        try {
          setIsLoading(true);
          // Get the user from our database using their email
          const dbUser = await getUserByEmail(session.user.email);

          if (!dbUser) {
            setIsLoading(false);
            toast.error("User not found in database");
            return;
          }

          const user = {
            userId: dbUser.userId, // Use the ID from our database
            fullName: dbUser.fullName, // Use the name from our database
            email: dbUser.email,
          };

          login(session.accessToken, user);
          toast.success("Successfully signed in!");
          router.push("/dashboard");
        } catch (error) {
          console.error("Error fetching user:", error);
          toast.error("Failed to fetch user data");
          setIsLoading(false);
        }
      }
    };

    handleGoogleAuth();
  }, [session, login, router]);

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
        const response = await fetch("/api/auth/sign-in", {
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
          throw new Error(errorData.error || "Failed to sign in");
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
    <>
    <div className=" w-full min-h-screen flex items-center justify-center p-4">
      <div className="bg-slate-100 rounded-xl shadow-lg shadow-slate-500 dark:shadow-slate-400 p-8 w-full max-w-md transform transition-all duration-300 hover:scale-[1.02]">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
          Welcome Back
        </h2>

        <Button
          onClick={() => signIn("google")}
          className="cursor-pointer w-full mb-6 bg-white text-gray-800 border border-gray-600 hover:bg-slate-700 hover:text-white font-medium py-5 px-4 rounded-lg flex items-center justify-center gap-2 shadow-sm transition-all duration-300"
        >
          <svg
            className="w-5 h-5"
            viewBox="0 0 48 48"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill="#EA4335"
              d="M24 9.5c3.15 0 5.91 1.08 8.1 2.87l6.03-6.03C34.05 3.44 29.34 1.5 24 1.5 14.85 1.5 7.09 7.52 4.3 15.05l7.42 5.77C13.06 14.21 18.14 9.5 24 9.5z"
            />
            <path
              fill="#34A853"
              d="M46.5 24c0-1.64-.15-3.21-.42-4.73H24v9.27h12.7c-.55 3.06-2.28 5.65-4.78 7.41l7.42 5.77C44.63 37.05 46.5 30.9 46.5 24z"
            />
            <path
              fill="#4A90E2"
              d="M4.3 15.05a22.38 22.38 0 000 17.9l7.42-5.77a13.49 13.49 0 010-6.36L4.3 15.05z"
            />
            <path
              fill="#FBBC05"
              d="M24 46.5c5.34 0 10.05-1.94 13.64-5.14l-7.42-5.77c-2.15 1.45-4.89 2.31-8.22 2.31-5.86 0-10.94-4.71-12.28-10.32L4.3 32.95C7.09 40.48 14.85 46.5 24 46.5z"
            />
            <path fill="none" d="M1.5 1.5h45v45h-45z" />
          </svg>
          Continue with Google
        </Button>

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
    {isLoading && (
      <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center">
        <LoadingScreen 
          message={loadingText} 
          onCancel={() => {
            setIsLoading(false);
            toast.error('Sign in cancelled');
          }} 
        />
      </div>
    )}
    </>
  );
}
