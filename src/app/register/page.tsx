
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
  User,
  Mail,
  Camera,
  LockKeyhole,
  Sparkles,
  CheckCircle2,
} from "lucide-react";

import { authClient } from "@/lib/auth-client";
import { toast } from "@/components/ui/toast";

export default function RegisterForm() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [accepted, setAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Password Strength
  const passwordStrength = [
    password.length >= 8,
    /[A-Z]/.test(password),
    /[0-9]/.test(password),
    /[^A-Za-z0-9]/.test(password),
  ].filter(Boolean).length;

  const strengthLabels = [
    "Very Weak",
    "Weak",
    "Fair",
    "Good",
    "Strong",
  ];

  const strengthColors = [
    "bg-red-500",
    "bg-orange-500",
    "bg-yellow-500",
    "bg-emerald-400",
    "bg-green-600",
  ];

  // Register Handler
  const handleRegister = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);
    setErrorMessage("");

    const formData = new FormData(e.currentTarget);

    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const photoUrl = (formData.get("photoUrl") as string)?.trim();
    const password = formData.get("password") as string;

    try {
      const { data, error } = await authClient.signUp.email({
        name,
        email,
        password,
        image: photoUrl || undefined,
      });

      if (error) {
        console.error("Registration error:", error);
        const message =
          error.message || "Registration failed. Please try again.";
        setErrorMessage(message);
        toast.add({
          type: "error",
          title: "Registration Failed!",
          description: message,
        });
        return;
      }

      if (data) {
        toast.add({
          type: "success",
          title: "Registration Successful!",
          description: "Your account has been created. Welcome to BookNook!",
        });
        router.push("/");
        router.refresh();
      }
    } catch (error) {
      console.error("Registration failed:", error);
      setErrorMessage("Something went wrong. Please try again.");
      toast.add({
        type: "error",
        title: "Registration Failed!",
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

      {/* Register Card */}
      <Card className="relative z-10 w-full max-w-md overflow-hidden border border-emerald-100 bg-white/90 shadow-[0_20px_60px_rgba(15,75,45,0.12)] backdrop-blur-xl rounded-2xl">

        {/* Top Gradient */}
        <div className="h-2 w-full bg-linear-to-r from-emerald-700 via-green-500 to-lime-400" />

        <CardHeader className="text-center pt-8 pb-5">

          {/* Logo Icon */}
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-700 to-green-500 text-white shadow-lg shadow-emerald-200">
            <User size={32} />
          </div>

          <p className="text-sm font-semibold uppercase tracking-[3px] text-emerald-600">
            Welcome
          </p>

          <CardTitle className="mt-2 text-3xl font-bold font-serif text-gray-900">
            Create an Account
          </CardTitle>

          <p className="mt-2 text-sm text-gray-500">
            Join us and get started today!
          </p>

        </CardHeader>

        <CardContent className="px-6 sm:px-8 pb-8">

          <form onSubmit={handleRegister} className="space-y-5">

            <FieldGroup className="gap-4">

              {/* Name */}
              <Field className="gap-2">
                <FieldLabel htmlFor="name" className="font-semibold text-gray-700">
                  Full Name
                </FieldLabel>

                <div className="relative group">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-emerald-600 transition-colors" />

                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Enter your full name"
                    required
                    autoComplete="name"
                    className="h-12 pl-10 rounded-xl border-gray-200 bg-gray-50/70 focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:border-emerald-500 transition-all"
                  />
                </div>
              </Field>

              {/* Email */}
              <Field className="gap-2">
                <FieldLabel htmlFor="email" className="font-semibold text-gray-700">
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

              {/* Photo URL */}
              <Field className="gap-2">
                <FieldLabel htmlFor="photoUrl" className="font-semibold text-gray-700">
                  Profile Photo URL
                  <span className="ml-2 text-xs font-normal text-gray-400">
                    (Optional)
                  </span>
                </FieldLabel>

                <div className="relative group">
                  <Camera className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-emerald-600 transition-colors" />

                  <Input
                    id="photoUrl"
                    name="photoUrl"
                    type="url"
                    placeholder="https://your-photo-url.com"
                    className="h-12 pl-10 rounded-xl border-gray-200 bg-gray-50/70 focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:border-emerald-500 transition-all"
                  />
                </div>
              </Field>

              {/* Password */}
              <Field className="gap-2">
                <FieldLabel htmlFor="password" className="font-semibold text-gray-700">
                  Password
                </FieldLabel>

                <div className="relative group">
                  <LockKeyhole className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-emerald-600 transition-colors" />

                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a strong password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={8}
                    autoComplete="new-password"
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

                {/* Password Strength */}
                {password.length > 0 && (
                  <div className="space-y-2 mt-2">

                    <div className="flex gap-1.5">
                      {[1, 2, 3, 4].map((item) => (
                        <div
                          key={item}
                          className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                            passwordStrength >= item
                              ? strengthColors[passwordStrength]
                              : "bg-gray-200"
                          }`}
                        />
                      ))}
                    </div>

                    <p className="text-xs text-gray-500">
                      Password Strength:{" "}
                      <span className="font-semibold text-emerald-700">
                        {strengthLabels[passwordStrength]}
                      </span>
                    </p>

                  </div>
                )}
              </Field>

            </FieldGroup>

            {/* Terms & Conditions */}
            <div className="flex items-start gap-2">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                checked={accepted}
                onChange={(e) => setAccepted(e.target.checked)}
                required
                className="mt-1 h-4 w-4 accent-emerald-600 cursor-pointer"
              />

              <label
                htmlFor="terms"
                className="text-sm text-gray-500 cursor-pointer"
              >
                I agree to the{" "}
                <Link
                  href="/terms"
                  className="font-semibold text-emerald-700 hover:underline"
                >
                  Terms & Conditions
                </Link>{" "}
                and{" "}
                <Link
                  href="/privacy"
                  className="font-semibold text-emerald-700 hover:underline"
                >
                  Privacy Policy
                </Link>.
              </label>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <p className="text-sm text-red-500 text-center">
                {errorMessage}
              </p>
            )}

            {/* Register Button */}
            <Button
              type="submit"
              disabled={!accepted || loading}
              className="h-12 w-full rounded-xl bg-gradient-to-r from-emerald-700 to-green-600 text-white font-semibold shadow-lg shadow-emerald-200 hover:from-emerald-800 hover:to-green-700 hover:shadow-emerald-300 hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
            >
              <CheckCircle2 className="mr-2 h-4 w-4" />
              {loading ? "Creating Account..." : "Create Account"}
            </Button>

            {/* Divider */}
            <FieldSeparator className="text-xs text-gray-400">
              OR CONTINUE WITH
            </FieldSeparator>

            {/* Google Button */}
            <Button
              type="button"
              variant="outline"
              className="h-12 w-full rounded-xl border-gray-200 bg-white hover:bg-emerald-50 hover:border-emerald-200 transition-all duration-300"
              onClick={async () => {
                await authClient.signIn.social({
                  provider: "google",
                  callbackURL: "/",
                });
              }}
            >
              <svg viewBox="0 0 48 48" className="h-5 w-5 mr-2">
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

            {/* Login Link */}
            <FieldDescription className="text-center pt-3 text-sm text-gray-500">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-bold text-emerald-700 hover:text-emerald-900 hover:underline transition-colors"
              >
                Login Now
              </Link>
            </FieldDescription>

          </form>
        </CardContent>
      </Card>
    </div>
  );
}
