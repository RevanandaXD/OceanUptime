"use client";

import { useState, useTransition } from "react";
import {
  Activity,
  Lock,
  Mail,
  ArrowRight,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Server,
  Shield,
  Globe,
  Cpu,
  Clock,
  MoveLeft,
  SquareArrowDownLeft,
} from "lucide-react";
import { login, signup } from "./action";
import Link from "next/link";

export default function AuthPage() {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    const formData = new FormData(event.currentTarget);

    if (mode === "signup") {
      const password = formData.get("password") as string;
      const confirmPassword = formData.get("confirmPassword") as string;
      
      if (password !== confirmPassword) {
        setError("Password dan Konfirmasi Password tidak cocok.");
        return;
      }
    }

    startTransition(async () => {
      if (mode === "login") {
        const result = await login(formData);
        if (result?.error) {
          setError(result.error);
        }
      } else {
        const result = await signup(formData);
        if (result?.error) {
          setError(result.error);
        } else if (result?.success) {
          setSuccess(result.success);
        }
      }
    });
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[#09090b] text-zinc-100 font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
      
      {/* LEFT SIDE - BRANDING (Hidden on Mobile) */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden bg-zinc-950 items-center justify-center border-r border-zinc-900 p-12">
        {/* Modern grid background pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(#27272a_1px,transparent_1px)] [background-size:32px_32px] opacity-25 pointer-events-none" />
        
        {/* Glowing Orbs */}
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-600/20 blur-[120px] rounded-full mix-blend-screen pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-600/10 blur-[120px] rounded-full mix-blend-screen pointer-events-none" />
        
        <div className="relative z-10 w-full max-w-lg space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight leading-[1.1]">
              Monitor your entire stack in one place.
            </h1>
            <p className="text-zinc-400 text-lg leading-relaxed max-w-md">
              Real-time uptime tracking, SSL monitoring, and deployment syncing for modern development teams.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-8">
            <div className="p-4 rounded-2xl bg-zinc-900/50 border border-zinc-800/50 backdrop-blur-sm">
              <Clock className="w-5 h-5 text-indigo-400 mb-2" />
              <div className="text-sm font-semibold text-white">5-Minute Checks</div>
              <div className="text-xs text-zinc-500">Automated global pings</div>
            </div>
            <div className="p-4 rounded-2xl bg-zinc-900/50 border border-zinc-800/50 backdrop-blur-sm">
              <Shield className="w-5 h-5 text-indigo-400 mb-2" />
              <div className="text-sm font-semibold text-white">SSL Tracking</div>
              <div className="text-xs text-zinc-500">Proactive expiration alerts</div>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE - FORM */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-12 relative bg-[#09090b]">
        {/* Mobile Header (Hidden on Desktop) */}
        <Link href="/" className="lg:hidden absolute top-8 left-6 sm:left-12 flex items-center gap-2 group">
           <SquareArrowDownLeft className="w-5 h-5 text-zinc-500 group-hover:text-white transition-colors" />
           <span className="text-sm font-medium text-zinc-500 group-hover:text-white transition-colors">Back to Home</span>
        </Link>
        
        {/* Desktop Back Button */}
        <Link href="/" className="hidden lg:flex absolute top-12 right-12 items-center gap-2 group px-4 py-2 rounded-full border border-zinc-800 hover:bg-zinc-900 transition-all">
           <SquareArrowDownLeft className="w-4 h-4 text-zinc-400 group-hover:text-white transition-colors" />
           <span className="text-xs font-semibold text-zinc-400 group-hover:text-white transition-colors">Back to Home</span>
        </Link>

        <div className="w-full max-w-[400px] space-y-8 mt-12 lg:mt-0">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold font-heading tracking-tight text-white">
              {mode === "login" ? "Welcome back" : "Create an account"}
            </h2>
            <p className="text-sm text-zinc-400 font-medium">
              {mode === "login"
                ? "Enter your credentials to access your dashboard."
                : "Enter your email below to create your account."}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="flex gap-3 items-start p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-xs font-medium">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="flex gap-3 items-start p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg text-xs font-medium">
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{success}</span>
              </div>
            )}

            <div className="space-y-4">
              {/* Email */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-zinc-300 block">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                  <input
                    name="email"
                    type="email"
                    required
                    placeholder="name@example.com"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg py-2.5 pl-10 pr-4 text-sm font-medium placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-white"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-zinc-300 block flex justify-between">
                  <span>Password</span>
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                  <input
                    name="password"
                    type="password"
                    required
                    placeholder="••••••••"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg py-2.5 pl-10 pr-4 text-sm font-medium placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-white"
                  />
                </div>
              </div>

              {/* Confirm Password */}
              {mode === "signup" && (
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-zinc-300 block">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                    <input
                      name="confirmPassword"
                      type="password"
                      required
                      placeholder="••••••••"
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg py-2.5 pl-10 pr-4 text-sm font-medium placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-white"
                    />
                  </div>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full flex items-center justify-center gap-2 py-2.5 mt-2 rounded-lg text-sm font-semibold bg-indigo-600 hover:bg-indigo-500 text-white disabled:opacity-50 transition-colors shadow-sm"
            >
              {isPending ? (
                <Loader2 className="h-4 w-4 animate-spin text-white" />
              ) : (
                <span>
                  {mode === "login" ? "Sign In" : "Sign Up"}
                </span>
              )}
            </button>
          </form>

          <div className="relative py-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-zinc-800" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-[#09090b] px-2 text-zinc-500 font-semibold">
                Or continue with
              </span>
            </div>
          </div>

          <div className="text-center">
            <button
              type="button"
              onClick={() => {
                setMode(mode === "login" ? "signup" : "login");
                setError(null);
                setSuccess(null);
              }}
              className="text-sm text-zinc-400 hover:text-white transition-colors"
            >
              {mode === "login" ? (
                <>Don't have an account? <span className="font-semibold text-white">Sign up</span></>
              ) : (
                <>Already have an account? <span className="font-semibold text-white">Sign in</span></>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
