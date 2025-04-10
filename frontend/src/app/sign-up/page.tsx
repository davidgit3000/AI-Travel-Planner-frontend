"use client";
import LoadingScreen from "@/components/plan/LoadingScreen";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

const loadingSteps = [
  "Creating your account",
  "Setting up your profile",
  "Preparing your dashboard",
  "Almost there! Getting everything ready",
];

interface FormErrors {
  email?: string;
  otp?: string;
  fullName?: string;
  password?: string;
  confirmPassword?: string;
}

/**
 * SignUpPage is a React component that renders a registration form for users to create an account.
 * It includes fields for full name, email, password, and confirm password, with validation for each field.
 * Users can also sign up using Google authentication. Upon successful registration, the user is logged in
 * and redirected to the dashboard. The component handles form submission, input changes, and error display.
 */
export default function SignUpPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [step, setStep] = useState<"email" | "otp" | "details">("email");
  const [formData, setFormData] = useState({
    email: "",
    otp: "",
    fullName: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSendingOTP, setIsSendingOTP] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [loadingText, setLoadingText] = useState(loadingSteps[0]);
  const [otpSent, setOtpSent] = useState(false);

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

  const validatePassword = (password: string) => {
    return password.length >= 8;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      const updated = { ...prev, [name]: value };

      const newErrors: FormErrors = { ...errors };

      if (name === "password") {
        if (!validatePassword(value)) {
          newErrors.password = "Password must be at least 8 characters long";
        } else {
          delete newErrors.password;
        }
      }
      if (name === "confirmPassword") {
        if (updated.password !== updated.confirmPassword) {
          newErrors.confirmPassword = "Passwords do not match";
        } else {
          delete newErrors.confirmPassword;
        }
      }
      if (name === "fullName") {
        if (!value) {
          newErrors.fullName = "Full name is required";
        } else {
          delete newErrors.fullName;
        }
      }
      setErrors(newErrors);
      return updated;
    });
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.email && !errors.email) {
      setIsSendingOTP(true);
      try {
        // TODO: Implement API endpoint
        const response = await fetch("/api/auth/send-otp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: formData.email }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          toast.error(errorData.message || "Failed to send OTP");
          return;
        }

        setOtpSent(true);
        setStep("otp");
        toast.success("OTP sent to your email");
      } catch (error) {
        toast.error("Failed to send OTP");
      } finally {
        setIsSendingOTP(false);
      }
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.otp && !errors.otp) {
      setIsLoading(true);
      try {
        // TODO: Implement API endpoint
        const response = await fetch("/api/auth/verify-otp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: formData.email,
            otp: formData.otp,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          toast.error(errorData.message || "Invalid OTP");
          return;
        }

        setStep("details");
        toast.success("Email verified successfully");
      } catch (error) {
        toast.error("Failed to verify OTP");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      Object.keys(errors).length === 0 &&
      validatePassword(formData.password) &&
      formData.password === formData.confirmPassword
    ) {
      setIsLoading(true);
      try {
        const response = await fetch("/api/auth/sign-up", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fullName: formData.fullName,
            email: formData.email,
            password: formData.password,
            address: "",
            phoneNumber: "",
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to create account");
        }

        const data = await response.json();

        // Login the user and store the token
        login(data.access_token, data.user);

        // Show success message
        toast.success("Account created successfully!");

        // Redirect to dashboard after successful registration
        router.push("/dashboard");
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Failed to create account";
        toast.error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <>
      <div className="w-full min-h-screen flex items-center justify-center p-4">
        <div className="bg-slate-100 rounded-xl shadow-lg shadow-slate-500 dark:shadow-slate-400 p-8 w-full max-w-md transform transition-all duration-300 hover:scale-[1.02]">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800">
              {step === "email" && "Create an account"}
              {step === "otp" && "Verify your email"}
              {step === "details" && "Complete your profile"}
            </h2>
            {step === "otp" && (
              <p className="mt-2 text-sm text-gray-600">
                We've sent a verification code to {formData.email}
              </p>
            )}
          </div>

          {step === "email" && (
            <form onSubmit={handleEmailSubmit} className="space-y-6">
              <div className="relative">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-3"
                >
                  What is your email address?
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`text-gray-800 w-full px-4 py-3 rounded-lg border 
                  ${errors.email ? "border-red-500" : "border-gray-300"}
                  focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300`}
                  placeholder="Enter your email"
                  required
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-500" role="alert">
                    {errors.email}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSendingOTP || !formData.email}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all 
                duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center cursor-pointer"
              >
                {isSendingOTP ? (
                  <>
                    <Loader2 className="animate-spin mr-2" size={20} />
                    Sending OTP...
                  </>
                ) : (
                  "Continue"
                )}
              </button>
            </form>
          )}

          {step === "otp" && (
            <form onSubmit={handleOtpSubmit} className="space-y-6">
              <div className="relative">
                <label
                  htmlFor="otp"
                  className="block text-sm font-medium text-gray-700 mb-3"
                >
                  Enter OTP
                </label>
                <input
                  type="text"
                  id="otp"
                  name="otp"
                  value={formData.otp}
                  onChange={handleInputChange}
                  className={`text-gray-800 w-full px-4 py-3 rounded-lg border 
                  ${errors.otp ? "border-red-500" : "border-gray-300"}
                  focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300`}
                  placeholder="Enter the 6-digit code"
                  required
                  maxLength={6}
                />
                {errors.otp && (
                  <p className="mt-1 text-sm text-red-500" role="alert">
                    {errors.otp}
                  </p>
                )}
              </div>

              <div className="flex justify-between items-center">
                <Button
                  type="button"
                  onClick={() => setStep("email")}
                  className="cursor-pointer hover:bg-blue-500 hover:text-white text-blue-600  text-sm font-medium"
                >
                  Change Email
                </Button>
                <Button
                  type="button"
                  onClick={handleEmailSubmit}
                  className="cursor-pointer hover:bg-blue-500 hover:text-white text-blue-600 text-sm font-medium"
                  disabled={isLoading}
                >
                  Resend OTP
                </Button>
              </div>

              <button
                type="submit"
                disabled={isLoading || !formData.otp}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all 
                duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin mr-2" size={20} />
                    Verifying...
                  </>
                ) : (
                  <>Verify OTP</>
                )}
              </button>
            </form>
          )}

          {step === "details" && (
            <div>
              <form onSubmit={handleFinalSubmit} className="space-y-6">
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
                    disabled={otpSent}
                    // onChange={handleInputChange}
                    className="text-gray-500 w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-300 focus:outline-none focus:ring-0 transition-all duration-300 cursor-not-allowed"
                    placeholder="Enter your email"
                    autoComplete="email"
                    aria-invalid={errors.email ? "true" : "false"}
                    aria-describedby={errors.email ? "email-error" : undefined}
                  />
                  {/* {errors.email && (
                    <p
                      id="email-error"
                      className="mt-1 text-sm text-red-500"
                      role="alert"
                    >
                      {errors.email}
                    </p>
                  )} */}
                </div>

                <div>
                  <label
                    htmlFor="fullName"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className={`text-gray-800 w-full px-4 py-3 rounded-lg border ${
                      errors.fullName ? "border-red-500" : "border-gray-300"
                    } focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300`}
                    placeholder="Enter your full name"
                    autoComplete="name"
                    aria-invalid={errors.fullName ? "true" : "false"}
                    aria-describedby={
                      errors.fullName ? "fullName-error" : undefined
                    }
                  />
                  {errors.fullName && (
                    <p
                      id="fullName-error"
                      className="mt-1 text-sm text-red-500"
                      role="alert"
                    >
                      {errors.fullName}
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
                      placeholder="Create a password"
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
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
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

                <div className="relative">
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className={`text-gray-800 w-full px-4 py-3 rounded-lg border 
                      ${
                        errors.confirmPassword
                          ? "border-red-500"
                          : "border-gray-300"
                      }
                      focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300`}
                      placeholder="Confirm your password"
                      autoComplete="current-confirmPassword"
                      aria-invalid={errors.confirmPassword ? "true" : "false"}
                      aria-describedby={
                        errors.confirmPassword
                          ? "confirmPassword-error"
                          : undefined
                      }
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none cursor-pointer"
                      aria-label={
                        showConfirmPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={20} />
                      ) : (
                        <Eye size={20} />
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p
                      id="confirmPassword-error"
                      className="mt-1 text-sm text-red-500"
                      role="alert"
                    >
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isLoading || Object.keys(errors).length > 0}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all 
                duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center cursor-pointer"
                  aria-label={isLoading ? "Registering..." : "Register"}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="animate-spin mr-2" size={20} />
                      Registering...
                    </>
                  ) : (
                    "Register"
                  )}
                </button>
              </form>

              <p className="mt-6 text-center text-sm text-gray-600">
                Already have an account?{" "}
                <Link
                  href="/sign-in"
                  className="text-blue-600 hover:text-blue-700 font-medium focus:outline-none hover:underline transition-colors duration-300"
                >
                  Sign in
                </Link>
              </p>
            </div>
          )}
        </div>
      </div>

      {isLoading && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <LoadingScreen
            message={loadingText}
            onCancel={() => {
              setIsLoading(false);
              toast.error("Sign up cancelled");
            }}
          />
        </div>
      )}
    </>
  );
}
