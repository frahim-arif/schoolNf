"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  School,
  Lock,
  Mail,
  ArrowRight,
  Eye,
  EyeOff,
  ShieldCheck,
  BookOpen,
  GraduationCap,
  Users,
  MapPin,
  Award,
} from "lucide-react";

const SCHOOL_NAME = "Niz Dhing GyanDeep Jatiya Bidyalaya";
const SCHOOL_ADDRESS = "Vill + P.O. Niz Dhing, Nagaon, Assam - 782123";
const UDISE_CODE = "18100102011";
const API_BASE = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000").replace(/\/+$/, "");

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail || !password) {
      setError("Please enter your email and password.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: normalizedEmail, password }),
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok || !data.success || !data.token) {
        throw new Error(data.message || "Login failed. Please check your details.");
      }

      localStorage.setItem("token", data.token);
      if (data.user) {
        const userData = {
          id: data.user._id,
          name: data.user.name,
          email: data.user.email,
          role: data.user.role,
          status: data.user.status,
        };
        localStorage.setItem("user", JSON.stringify(userData));
      }
      router.push("/admin/dashboard");
    } catch (err) {
      console.error("Login error:", err);
      setError(
        err.message === "Failed to fetch"
          ? "Backend connection nahi ho raha. Backend server aur API URL check karein."
          : err.message || "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const features = [
    { icon: GraduationCap, title: "Student Records", detail: "Student information & progress" },
    { icon: Users, title: "Staff Management", detail: "Teachers and school staff" },
    { icon: BookOpen, title: "Academic Portal", detail: "School activities & records" },
  ];

  return (
    <main className="relative flex min-h-screen overflow-hidden bg-[#f7f6ef] text-[#172d27]">
      <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-[#d9e7d9]/70 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 right-0 h-96 w-96 rounded-full bg-[#e8dfc4]/60 blur-3xl" />

      {/* School identity panel */}
      <section className="relative hidden w-[52%] flex-col justify-between overflow-hidden bg-gradient-to-br from-[#071c19] via-[#0b302a] to-[#174b3c] p-10 text-white lg:flex xl:p-14">
        <div className="absolute -right-32 top-16 h-[28rem] w-[28rem] rounded-full border border-[#c8ae6a]/20" />
        <div className="absolute -right-20 top-28 h-80 w-80 rounded-full border border-white/10" />
        <div className="absolute -bottom-40 -left-24 h-96 w-96 rounded-full bg-emerald-300/10 blur-3xl" />
        <div className="absolute right-14 top-1/2 h-40 w-40 -translate-y-1/2 rounded-full border border-[#c8ae6a]/10" />

        <div className="relative z-10 flex items-center gap-4">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-[#c8ae6a]/50 bg-white/10 text-[#e3ce91] shadow-xl backdrop-blur">
            <School size={34} strokeWidth={1.7} />
          </div>
          <div>
            <p className="max-w-md text-lg font-black leading-snug tracking-wide xl:text-xl">{SCHOOL_NAME}</p>
            <p className="mt-1 text-[10px] font-bold tracking-[0.28em] text-[#dfd0a5]">OFFICIAL SCHOOL PORTAL</p>
          </div>
        </div>

        <div className="relative z-10 my-12 max-w-xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#c8ae6a]/30 bg-white/[0.07] px-4 py-2 text-[11px] font-bold tracking-[0.16em] text-[#e8d9ad]">
            <ShieldCheck size={15} /> TRUST • LEARNING • EXCELLENCE
          </div>
          <h1 className="mt-7 text-4xl font-black leading-[1.13] xl:text-6xl">
            Building Bright
            <span className="block text-[#d7c184]">Futures Together.</span>
          </h1>
          <p className="mt-6 max-w-lg text-sm leading-8 text-emerald-50/75 xl:text-base">
            A secure digital space to manage school activities, support teachers and students, and keep our school community connected.
          </p>

          <div className="mt-10 grid grid-cols-3 gap-3">
            {features.map(({ icon: Icon, title, detail }) => (
              <div key={title} className="rounded-2xl border border-white/10 bg-white/[0.07] p-4 backdrop-blur-sm">
                <Icon size={23} className="text-[#d7c184]" />
                <p className="mt-4 text-xs font-extrabold">{title}</p>
                <p className="mt-1 text-[10px] leading-5 text-emerald-50/60">{detail}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 flex flex-col gap-2 border-t border-white/15 pt-5 text-xs text-emerald-50/65 sm:flex-row sm:items-center sm:justify-between">
          <span className="flex items-center gap-2"><MapPin size={14} className="text-[#d7c184]" /> {SCHOOL_ADDRESS}</span>
          <span>UDISE: {UDISE_CODE}</span>
        </div>
      </section>

      {/* Login panel */}
      <section className="relative z-10 flex min-h-screen flex-1 items-center justify-center px-5 py-10 sm:px-8 lg:px-10">
        <div className="w-full max-w-md">
          <div className="mb-8 flex items-center justify-center gap-3 lg:hidden">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#0b302a] text-[#e4d19a] shadow-lg">
              <School size={29} />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-black leading-snug text-[#172d27]">{SCHOOL_NAME}</p>
              <p className="mt-1 text-[10px] font-bold tracking-[0.2em] text-[#987c3d]">SCHOOL PORTAL</p>
            </div>
          </div>

          <div className="overflow-hidden rounded-[30px] border border-[#e6e0cf] bg-white shadow-[0_25px_80px_-30px_rgba(7,28,25,0.28)]">
            <div className="h-2 bg-gradient-to-r from-[#0b302a] via-[#c8ae6a] to-[#0b302a]" />
            <div className="p-6 sm:p-10">
              <div className="mb-8">
                <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-[#e8dfc4] bg-[#f7f6ef] text-[#0b4939]">
                  <Lock size={26} />
                </div>
                <p className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-[#987c3d]">Welcome to your school</p>
                <h2 className="mt-3 text-3xl font-black tracking-tight text-[#172d27] sm:text-4xl">Sign in</h2>
                <p className="mt-3 text-sm leading-6 text-slate-500">Enter your authorised account details to access the school portal.</p>
              </div>

              <form onSubmit={handleLogin} className="space-y-5">
                <div>
                  <label htmlFor="email" className="mb-2 block text-sm font-bold text-[#263d35]">Email address</label>
                  <div className="flex items-center rounded-xl border border-[#e4e5dc] bg-[#fafaf7] transition focus-within:border-[#987c3d] focus-within:bg-white focus-within:ring-4 focus-within:ring-[#c8ae6a]/15">
                    <Mail size={19} className="ml-4 shrink-0 text-[#8b927f]" />
                    <input id="email" name="email" type="email" autoComplete="username" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-transparent px-3 py-4 text-sm outline-none placeholder:text-slate-400" required />
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="mb-2 block text-sm font-bold text-[#263d35]">Password</label>
                  <div className="flex items-center rounded-xl border border-[#e4e5dc] bg-[#fafaf7] transition focus-within:border-[#987c3d] focus-within:bg-white focus-within:ring-4 focus-within:ring-[#c8ae6a]/15">
                    <Lock size={19} className="ml-4 shrink-0 text-[#8b927f]" />
                    <input id="password" name="password" type={showPassword ? "text" : "password"} autoComplete="current-password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full min-w-0 bg-transparent px-3 py-4 text-sm outline-none placeholder:text-slate-400" required />
                    <button type="button" onClick={() => setShowPassword((prev) => !prev)} aria-label={showPassword ? "Hide password" : "Show password"} className="mr-3 rounded-lg p-1.5 text-slate-400 transition hover:bg-[#f0eee5] hover:text-[#172d27]">
                      {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                    </button>
                  </div>
                </div>

                {error && <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm leading-6 text-red-700">{error}</div>}

                <button type="submit" disabled={loading} className="group flex w-full items-center justify-center gap-3 rounded-xl bg-[#0b302a] py-4 font-bold text-white shadow-lg shadow-[#0b302a]/15 transition hover:bg-[#174b3c] hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60">
                  {loading ? "Signing in..." : "Sign in to your account"}
                  {!loading && <ArrowRight size={19} className="transition-transform group-hover:translate-x-1" />}
                </button>
              </form>

              <div className="mt-7 flex items-center justify-center gap-2 text-xs text-slate-400">
                <ShieldCheck size={16} className="text-[#987c3d]" />
                <span>Secure and protected school account access</span>
              </div>
            </div>
          </div>

          <div className="mt-6 text-center text-xs leading-6 text-slate-500">
            <p className="font-semibold text-[#263d35]">{SCHOOL_NAME}</p>
            <p>{SCHOOL_ADDRESS}</p>
            <p className="mt-2">© {new Date().getFullYear()} All rights reserved.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
