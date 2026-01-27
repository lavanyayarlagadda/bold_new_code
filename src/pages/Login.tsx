import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import { LogIn, Eye, EyeOff } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "react-toastify";

import {
  useForgotPasswordMutation,
  useVerifyOtpMutation,
  useResetPasswordMutation,
} from "../redux/services/authApi";

export default function Login() {
  const [forgotPassword, { isLoading: forgotLoading }] =
    useForgotPasswordMutation();
  const [verifyOtp, { isLoading: verifyOtpLoading }] = useVerifyOtpMutation();
  const [resetPassord, { isLoading: resetPasswordLoading }] =
    useResetPasswordMutation();

  const [screen, setScreen] = useState<"login" | "forgot" | "otp" | "reset">(
    "login",
  );

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { user, login } = useAuth();

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   setError("");
  //   setLoading(true);

  //   const success = await login(email, password);
  //   console.log("success", success);

  //   toast.success("Logged in successfully");
  //   setLoading(false);
  // };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(email, password);
      toast.success("Logged in successfully");
    } catch (err: any) {
      const message = err?.message || "Invalid email or password";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleForgot = async () => {
    if (!email) return toast.error("Enter your email");

    // TODO: Call API to send OTP here
    try {
      const response = await forgotPassword({ email }).unwrap();

      if (response.statusCode === 200) {
        toast.success(response.message);
        setScreen("otp");
      } else {
        toast.error("Failed to send OTP");
      }
    } catch (error: any) {
      toast.error("Something went wrong");
    }
  };
  const handleVerifyOtp = async () => {
    if (!otp) return toast.error("Enter OTP");

    try {
      const response = await verifyOtp({ email, otp }).unwrap();

      if (response.statusCode === 200) {
        toast.success(response.message);
        setScreen("reset");
      } else {
        toast.error("Invalid OTP");
      }
    } catch (error: any) {
      toast.error("OTP verification failed");
    }
  };
  const handleResetPassword = async () => {
    if (!newPassword || !confirmPassword)
      return toast.error("Enter both fields");

    if (newPassword !== confirmPassword)
      return toast.error("Passwords do not match");

    try {
      const response = await resetPassord({
        email,
        newPassword,
      }).unwrap();

      if (response.statusCode === 200) {
        toast.success("Password reset successful!");
        setScreen("login");
      } else {
        toast.error("Failed to reset password");
      }
    } catch (error: any) {
      toast.error("Something went wrong while resetting password");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 to-indigo-700 p-12 items-center justify-center">
        <div className="text-center text-white">
          <div className="mb-8">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <LogIn className="h-10 w-10" />
            </div>
            <h1 className="text-4xl font-bold mb-4">TaskFlow</h1>
            <p className="text-xl text-blue-100">
              Streamline your client collaboration and task management
            </p>
          </div>

          <div className="space-y-4 text-left bg-white/10 rounded-lg p-6 backdrop-blur-sm">
            <h3 className="text-lg font-semibold mb-4">Key Features:</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-200 rounded-full"></div>
                <span className="text-blue-100">Role-based access control</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-200 rounded-full"></div>
                <span className="text-blue-100">
                  Automated service templates
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-200 rounded-full"></div>
                <span className="text-blue-100">Document management hub</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-200 rounded-full"></div>
                <span className="text-blue-100">Real-time notifications</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Login form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-8">
              {screen === "login" ? (
                <>
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <LogIn className="h-6 w-6 text-blue-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Welcome back
                  </h2>
                  <p className="text-gray-600 mt-2">Sign in to your account</p>
                </>
              ) : screen === "forgot" ? (
                <>
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <LogIn className="h-6 w-6 text-blue-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Forgot Password
                  </h2>
                  {/* <p className="text-gray-600 mt-2">Forgot Password</p> */}
                </>
              ) : screen === "otp" ? (
                <>
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <LogIn className="h-6 w-6 text-blue-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">OTP</h2>
                  {/* <p className="text-gray-600 mt-2">OTP</p> */}
                </>
              ) : screen === "reset" ? (
                <>
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <LogIn className="h-6 w-6 text-blue-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Reset Password
                  </h2>
                  {/* <p className="text-gray-600 mt-2">Reset Password</p> */}
                </>
              ) : (
                ""
              )}
            </div>

            {/* <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {error && (
                <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? "Signing in..." : "Sign in"}
              </button>
            </form> */}

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (screen === "login") handleSubmit(e);
                if (screen === "forgot") handleForgot();
                if (screen === "otp") handleVerifyOtp();
                if (screen === "reset") handleResetPassword();
              }}
              className="space-y-6"
            >
              {/* ================= LOGIN SCREEN ================= */}
              {screen === "login" && (
                <>
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Email address
                    </label>
                    <input
                      id="email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg
                     focus:outline-none focus:ring-2 focus:ring-blue-500
                     focus:border-transparent transition-colors"
                      placeholder="Enter your email"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Password
                    </label>
                    <div className="relative">
                      <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg
                       focus:outline-none focus:ring-2 focus:ring-blue-500
                       focus:border-transparent transition-colors"
                        placeholder="Enter your password"
                      />

                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400
                       hover:text-gray-600"
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {error && (
                    <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg
                   hover:bg-blue-700 focus:outline-none focus:ring-2
                   focus:ring-blue-500 focus:ring-offset-2
                   disabled:opacity-50 disabled:cursor-not-allowed
                   transition-colors"
                  >
                    {loading ? "Signing in..." : "Sign in"}
                  </button>

                  <p
                    className="text-center text-sm text-blue-600 hover:text-blue-700
                   cursor-pointer mt-2"
                    onClick={() => setScreen("forgot")}
                  >
                    Forgot your password?
                  </p>
                </>
              )}

              {/* ================= FORGOT PASSWORD SCREEN ================= */}
              {screen === "forgot" && (
                <>
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Enter your email
                    </label>
                    <input
                      id="email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg
                     focus:outline-none focus:ring-2 focus:ring-blue-500
                     focus:border-transparent transition-colors"
                      placeholder="Enter email address"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={forgotLoading}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg
     hover:bg-blue-700 focus:outline-none focus:ring-2
     focus:ring-blue-500 focus:ring-offset-2 
     disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {forgotLoading ? "Processing..." : "Send OTP"}
                  </button>

                  <p
                    className="text-center text-sm text-gray-600 hover:text-gray-800
                   cursor-pointer"
                    onClick={() => setScreen("login")}
                  >
                    ← Back to Login
                  </p>
                </>
              )}

              {/* ================= OTP SCREEN ================= */}
              {screen === "otp" && (
                <>
                  <div>
                    <label
                      htmlFor="otp"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Enter OTP
                    </label>
                    <input
                      id="otp"
                      type="text"
                      required
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg
                     focus:outline-none focus:ring-2 focus:ring-blue-500
                     focus:border-transparent transition-colors"
                      placeholder="Enter 6-digit OTP"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={verifyOtpLoading}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg
         hover:bg-blue-700 focus:outline-none focus:ring-2
         focus:ring-blue-500 focus:ring-offset-2 
         disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {verifyOtpLoading ? "Processing..." : "Verify OTP"}
                  </button>
                </>
              )}

              {/* ================= RESET PASSWORD SCREEN ================= */}

              {screen === "reset" && (
                <>
                  {/* New Password */}
                  <div>
                    <label
                      htmlFor="newPassword"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      New Password
                    </label>

                    <div className="relative">
                      <input
                        id="newPassword"
                        type={showNewPassword ? "text" : "password"}
                        required
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg
                     focus:outline-none focus:ring-2 focus:ring-blue-500
                     focus:border-transparent transition-colors"
                        placeholder="Enter new password"
                      />

                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center 
                     text-gray-400 hover:text-gray-600"
                      >
                        {showNewPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label
                      htmlFor="confirmPassword"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Confirm Password
                    </label>

                    <div className="relative">
                      <input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg
                     focus:outline-none focus:ring-2 focus:ring-blue-500
                     focus:border-transparent transition-colors"
                        placeholder="Confirm new password"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute inset-y-0 right-0 pr-3 flex items-center 
                     text-gray-400 hover:text-gray-600"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg
                 hover:bg-blue-700 focus:outline-none focus:ring-2
                 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                  >
                    {resetPasswordLoading ? "Processing..." : "Reset Password"}
                  </button>
                </>
              )}
            </form>

            {/* Demo accounts */}
            {/* <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-600 text-center mb-4">Demo Accounts (password: password)</p>
              <div className="grid grid-cols-2 gap-2">
                {demoAccounts.map((account) => (
                  <button
                    key={account.email}
                    onClick={() => handleDemoLogin(account.email)}
                    className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors hover:opacity-80 ${account.color}`}
                  >
                    {account.role}
                  </button>
                ))}
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
}
