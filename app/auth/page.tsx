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
    <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-950 text-zinc-100 font-sans selection:bg-indigo-500 selection:text-white p-4 relative overflow-hidden">
      <div className="w-full max-w-md flex flex-col p-8 md:p-12 bg-zinc-900/40 border border-zinc-800/50 rounded-3xl shadow-2xl backdrop-blur-xl relative z-10">
        {/* Back Button */}
        <div className="flex items-center mb-8">
          <Link
            href={"/"}
            className="flex gap-1.5 items-center text-sm font-semibold text-zinc-400 hover:text-white transition-colors"
          >
            <SquareArrowDownLeft size={20} /> Back
          </Link>
        </div>

        {/* Center Form */}
        <div className="space-y-10">
          <div className="space-y-2">
            <h2 className="text-3xl font-extrabold font-heading tracking-tight uppercase text-white">
              {mode === "login" ? "Sign In" : "Register"}
            </h2>
            <p className="text-xs text-zinc-500 font-semibold leading-normal">
              {mode === "login"
                ? "Enter your credentials to control your monitoring nodes."
                : "Initialize a new administrator node account."}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="flex gap-2.5 items-start p-4 bg-red-950/20 border border-red-500/30 text-red-400 rounded-xl text-xs leading-relaxed font-semibold">
                <AlertCircle className="h-4.5 w-4.5 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="flex gap-2.5 items-start p-4 bg-emerald-950/20 border border-emerald-500/30 text-emerald-400 rounded-xl text-xs leading-relaxed font-semibold">
                <CheckCircle2 className="h-4.5 w-4.5 shrink-0 mt-0.5" />
                <span>{success}</span>
              </div>
            )}

            <div className="space-y-4">
              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-[9px] font-bold uppercase tracking-widest text-zinc-500 block">
                  Email Address
                </label>
                <div className="relative group">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500 group-focus-within:text-indigo-400 transition-colors" />
                  <input
                    name="email"
                    type="email"
                    required
                    placeholder="you@example.com"
                    className="w-full bg-zinc-950 border border-zinc-800 focus:border-indigo-500/80 rounded-xl py-3 pl-10 pr-4 text-xs font-semibold placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 transition-all text-white"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label className="text-[9px] font-bold uppercase tracking-widest text-zinc-500 block">
                  Password
                </label>
                <div className="relative group">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500 group-focus-within:text-indigo-400 transition-colors" />
                  <input
                    name="password"
                    type="password"
                    required
                    placeholder="••••••••"
                    className="w-full bg-zinc-950 border border-zinc-800 focus:border-indigo-500/80 rounded-xl py-3 pl-10 pr-4 text-xs font-semibold placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 transition-all text-white"
                  />
                </div>
              </div>

              {/* Confirm Password */}
              {mode === "signup" && (
                <div className="space-y-1.5">
                  <label className="text-[9px] font-bold uppercase tracking-widest text-zinc-500 block">
                    Confirm Password
                  </label>
                  <div className="relative group">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500 group-focus-within:text-indigo-400 transition-colors" />
                    <input
                      name="confirmPassword"
                      type="password"
                      required
                      placeholder="••••••••"
                      className="w-full bg-zinc-950 border border-zinc-800 focus:border-indigo-500/80 rounded-xl py-3 pl-10 pr-4 text-xs font-semibold placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 transition-all text-white"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Button */}
            <button
              type="submit"
              disabled={isPending}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 mt-2 rounded-xl text-xs font-bold uppercase tracking-wider bg-indigo-600 hover:bg-indigo-500 text-white disabled:opacity-60 transition-all shadow-lg shadow-indigo-650/20 hover:scale-[1.01] active:scale-[0.99]"
            >
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin text-white" />
                  <span>Configuring System...</span>
                </>
              ) : (
                <>
                  <span>
                    {mode === "login"
                      ? "Initialize Access"
                      : "Create Node Administrator"}
                  </span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* Toggle Link */}
          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => {
                setMode(mode === "login" ? "signup" : "login");
                setError(null);
                setSuccess(null);
              }}
              className="text-xs text-zinc-400 hover:text-white font-bold transition-colors underline decoration-dotted underline-offset-4"
            >
              {mode === "login"
                ? "Request a new node credentials (Sign Up)"
                : "Return to Secure Sign In"}
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 text-[9px] text-zinc-600 font-semibold tracking-wider uppercase text-center">
        OceanUptime v1.0 &copy; {new Date().getFullYear()}
      </div>
    </div>
  );
}
