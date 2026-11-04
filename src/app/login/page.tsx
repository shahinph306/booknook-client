
"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";

import { Input } from "@/components/ui/input";

import {
  Eye,
  EyeOff,
  Mail,
  LockKeyhole,
  Sparkles,
  LogIn,
} from "lucide-react";

import { authClient } from "@/lib/auth-client";
import { toast } from "@/components/ui/toast";

export default function LoginForm() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);
    setErrorMessage("");

    const formData = new FormData(e.currentTarget);

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const { data, error } = await authClient.signIn.email({
        email,
        password,
        rememberMe,
      });

      if (error) {
        const message = error.message || "Invalid email or password";
        setErrorMessage(message);
        toast.add({
          type: "error",
          title: "Login Failed!",
          description: message,
        });
        return;
      }

      if (data) {
        toast.add({
          type: "success",
          title: "Login Successful!",
          description: "Welcome back! You are now logged in.",
        });
        router.push("/");
        router.refresh();
      }
    } catch (error) {
      console.error("Login error:", error);
      setErrorMessage("Something went wrong. Please try again.");
      toast.add({
        type: "error",
        title: "Login Failed!",
        description: "Something went wrong. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden flex items-center justify-center bg-[#f4f8f3] px-4 py-12">

      {/* Background Decorations */}
      <div className="absolute -top-32 -left-32 h-80 w-80 rounded-full bg-emerald-200/40 blur-3xl" />

      <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-lime-200/40 blur-3xl" />

      <div className="absolute top-20 right-20 text-emerald-300 hidden md:block">
        <Sparkles size={45} />
      </div>

      {/* Login Card */}
      <Card className="relative z-10 w-full max-w-md overflow-hidden border border-emerald-100 bg-white/90 shadow-[0_20px_60px_rgba(15,75,45,0.12)] backdrop-blur-xl rounded-2xl">

        {/* Top Gradient */}
        <div className="h-2 w-full bg-linear-to-r from-emerald-700 via-green-500 to-lime-400" />

        <CardHeader className="text-center pt-9 pb-5">

          {/* Logo */}
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-br from-emerald-700 to-green-500 text-white shadow-lg shadow-emerald-200">
            <LogIn size={32} />
          </div>

          <p className="text-sm font-semibold uppercase tracking-[3px] text-emerald-600">
            Welcome Back
          </p>

          <CardTitle className="mt-2 text-3xl font-bold font-serif text-gray-900">
            Login to Your Account
          </CardTitle>

          <p className="mt-2 text-sm text-gray-500">
            Enter your details to access your account.
          </p>

        </CardHeader>

        <CardContent className="px-6 sm:px-8 pb-8">

          <form onSubmit={handleLogin} className="space-y-5">

            <FieldGroup className="gap-5">

              {/* Email */}
              <Field className="gap-2">
                <FieldLabel
                  htmlFor="email"
                  className="font-semibold text-gray-700"
                >
                  Email Address
                </FieldLabel>

                <div className="relative group">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-emerald-600 transition-colors" />

                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="example@gmail.com"
                    required
                    autoComplete="email"
                    className="h-12 pl-10 rounded-xl border-gray-200 bg-gray-50/70 focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:border-emerald-500 transition-all"
                  />
                </div>
              </Field>

              {/* Password */}
              <Field className="gap-2">
                <div className="flex items-center justify-between">
                  <FieldLabel
                    htmlFor="password"
                    className="font-semibold text-gray-700"
                  >
                    Password
                  </FieldLabel>

                  <Link
                    href="/forgot-password"
                    className="text-xs font-semibold text-emerald-700 hover:text-emerald-900 hover:underline transition-colors"
                  >
                    Forgot Password?
                  </Link>
                </div>

                <div className="relative group">
                  <LockKeyhole className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-emerald-600 transition-colors" />

                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    required
                    autoComplete="current-password"
                    className="h-12 pl-10 pr-12 rounded-xl border-gray-200 bg-gray-50/70 focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:border-emerald-500 transition-all"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-emerald-600 transition-colors"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </Field>

            </FieldGroup>

            {/* Remember Me */}
            <div className="flex items-center gap-2">
              <input
                id="remember"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 accent-emerald-600 cursor-pointer"
              />

              <label
                htmlFor="remember"
                className="text-sm text-gray-500 cursor-pointer"
              >
                Remember me
              </label>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <p className="text-sm text-red-500 text-center">
                {errorMessage}
              </p>
            )}

            {/* Login Button */}
            <Button
              type="submit"
              disabled={loading}
              className="h-12 w-full rounded-xl bg-linear-to-r from-emerald-700 to-green-600 text-white font-semibold shadow-lg shadow-emerald-200 hover:from-emerald-800 hover:to-green-700 hover:shadow-emerald-300 hover:-translate-y-0.5 transition-all duration-300"
            >
              <LogIn className="mr-2 h-4 w-4" />
              {loading ? "Logging in..." : "Login to Account"}
            </Button>

            {/* Divider */}
            <FieldSeparator className="text-xs text-gray-400">
              OR CONTINUE WITH
            </FieldSeparator>

            {/* Google Login */}
            <Button
              type="button"
              variant="outline"
              onClick={async () => {
                await authClient.signIn.social({
                  provider: "google",
                  callbackURL: "/",
                });
              }}
              className="h-12 w-full rounded-xl border-gray-200 bg-white hover:bg-emerald-50 hover:border-emerald-200 transition-all duration-300"
            >
              <svg
                viewBox="0 0 48 48"
                className="h-5 w-5 mr-2"
              >
                <path
                  fill="#EA4335"
                  d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                />
                <path
                  fill="#4285F4"
                  d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.7 7.18l7.27 5.64c4.25-3.92 7.47-9.69 7.47-17.29z"
                />
                <path
                  fill="#FBBC05"
                  d="M10.53 28.59A14.5 14.5 0 0 1 9.75 24c0-1.59.27-3.12.75-4.59l-7.98-6.19A23.93 23.93 0 0 0 0 24c0 3.87.93 7.52 2.56 10.78z"
                />
                <path
                  fill="#34A853"
                  d="M24 48c6.48 0 11.93-2.13 15.9-5.8l-7.27-5.64c-2.02 1.35-4.61 2.15-8.63 2.15-6.26 0-11.57-4.22-13.46-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                />
              </svg>

              Continue with Google
            </Button>

            {/* Register Link */}
            <FieldDescription className="text-center pt-3 text-sm text-gray-500">
              Don&apos;t have an account?{" "}
              <Link
                href="/register"
                className="font-bold text-emerald-700 hover:text-emerald-900 hover:underline transition-colors"
              >
                Create Account
              </Link>
            </FieldDescription>

          </form>
        </CardContent>
      </Card>
    </div>
  );
}
