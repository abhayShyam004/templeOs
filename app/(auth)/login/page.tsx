"use client";

import { FormEvent, useState, useEffect } from "react";
import Link from "next/link";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { PolicyModal } from "@/components/temple/policy-modal";

export default function LoginPage() {
  const router = useRouter();
  const { status } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activePolicyModal, setActivePolicyModal] = useState<"privacy" | "terms" | null>(null);

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/");
    }
  }, [status, router]);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("Invalid email or password");
      setLoading(false);
      return;
    }

    router.push("/");
    router.refresh();
  };

  return (
    <div className="bg-background text-on-surface selection:bg-primary/30 selection:text-on-background min-h-screen flex flex-col relative overflow-x-hidden font-body">
      {/* Backdrop Image Section */}
      <div className="fixed inset-0 z-0">
        <img 
          className="w-full h-full object-cover opacity-10 grayscale-[20%]" 
          alt="Temple silhoutte at night" 
          src="https://scontent-bom2-1.xx.fbcdn.net/v/t39.30808-6/476079027_953372436798039_9129291854953138235_n.jpg?stp=dst-jpg_s640x640_tt6&_nc_cat=107&ccb=1-7&_nc_sid=7b2446&_nc_ohc=RIbWOsZ49SMQ7kNvwFqDNSs&_nc_oc=Adqs85yXHMUA2D-UZf00Pf3RcdrXWqJnNDCeI_OE7cM0wXaygjrZx3yTzEqxa-ReOhwJGdLz11PWL8JSqmg7uc2f&_nc_zt=23&_nc_ht=scontent-bom2-1.xx&_nc_gid=-35d60nZw0aFXUNZ_hdIHQ&_nc_ss=7a389&oh=00_Af17qdSB2mZJj8K_xSyeAG9iqKcO1VKZAu94QjTM7SP-0w&oe=69D69938" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent"></div>
      </div>

      {/* Navigation Shell */}
      <header className="relative z-20 flex flex-col items-start gap-2 px-4 pt-4 pb-2 sm:px-6 sm:pt-5 sm:pb-3 md:fixed md:top-0 md:w-full md:flex-row md:items-center md:justify-between md:px-8 md:pt-12 md:pb-6">
        <Link href="/" className="font-headline text-lg font-bold leading-tight tracking-tighter text-primary sm:text-xl md:text-2xl">
          ശ്രീ muthappa madapura Indiranagar
        </Link>
        <Link href="/" className="flex items-center gap-2 text-xs font-medium text-on-surface-variant transition-colors duration-300 hover:text-secondary group sm:text-sm">
          <span className="material-symbols-outlined transition-transform group-hover:-translate-x-1">arrow_back</span>
          <span className="font-label font-medium">Back to temple home</span>
        </Link>
      </header>

      {/* Main Content Canvas */}
      <main className="relative z-10 flex flex-grow items-center justify-center px-4 pt-6 pb-12 sm:px-6 md:px-6 md:pt-20">
        <div className="w-full max-w-md">
          {/* Central Login Card */}
          <div className="bg-white/80 backdrop-blur-2xl p-10 rounded-xl border border-outline-variant/30 shadow-xl relative group overflow-hidden">
            {/* Subtle Glow Effect */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/5 blur-[100px] rounded-full"></div>
            <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-secondary/5 blur-[100px] rounded-full"></div>
            
            <div className="text-center mb-10 relative z-10">
              <h1 className="text-3xl font-bold tracking-tight text-on-surface mb-2 font-headline">Welcome Back</h1>
              <p className="text-on-surface-variant font-label text-sm">Enter your sanctuary to continue your journey</p>
            </div>

            <form onSubmit={onSubmit} className="space-y-6 relative z-10">
              {/* Email Field */}
              <div className="space-y-2">
                <label className="block font-label text-xs font-semibold uppercase tracking-wider text-on-surface-variant ml-1" htmlFor="email">Email</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline text-lg">mail</span>
                  <input 
                    className="w-full bg-surface-container-low border border-outline-variant/20 focus:border-secondary focus:ring-2 focus:ring-secondary/20 rounded-xl py-4 pl-12 pr-4 text-on-surface placeholder:text-outline transition-all font-body outline-none" 
                    id="email" 
                    name="email" 
                    placeholder="devotee@temple.org" 
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <div className="flex justify-between items-center ml-1">
                  <label className="block font-label text-xs font-semibold uppercase tracking-wider text-on-surface-variant" htmlFor="password">Password</label>
                  <Link className="font-label text-[10px] uppercase font-bold text-secondary hover:text-primary transition-colors" href="#">Forgot?</Link>
                </div>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline text-lg">lock</span>
                  <input 
                    className="w-full bg-surface-container-low border border-outline-variant/20 focus:border-secondary focus:ring-2 focus:ring-secondary/20 rounded-xl py-4 pl-12 pr-12 text-on-surface placeholder:text-outline transition-all font-body outline-none" 
                    id="password" 
                    name="password" 
                    placeholder="••••••••" 
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    aria-pressed={showPassword}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-outline hover:text-secondary transition-colors z-[100] cursor-pointer flex items-center justify-center p-1"
                  >
                    <span className="material-symbols-outlined text-[20px] leading-none">
                      {showPassword ? "visibility_off" : "visibility"}
                    </span>
                  </button>
                </div>
              </div>

              {error && (
                <p className="text-xs font-bold uppercase tracking-widest text-error text-center bg-error/5 py-3 rounded-lg border border-error/10">
                  {error}
                </p>
              )}

              {/* CTA Button */}
              <button 
                className="w-full bg-gradient-to-r from-primary to-[#ff766c] text-white font-headline font-bold py-4 rounded-xl shadow-lg shadow-primary/30 hover:scale-[0.98] active:scale-95 transition-all duration-200 mt-4 flex items-center justify-center gap-2 disabled:opacity-50" 
                type="submit"
                disabled={loading}
              >
                {loading ? "Verifying..." : "Sign In"}
                <span className="material-symbols-outlined">keyboard_double_arrow_right</span>
              </button>
            </form>

            {/* Social Sign In Divider */}
            <div className="relative my-8 z-10">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-outline-variant/30"></div></div>
              <div className="relative flex justify-center text-xs uppercase tracking-widest font-label"><span className="bg-white/0 px-2 text-outline"></span></div>
            </div>

            {/* Footer Link */}
            <div className="text-center relative z-10">
              <p className="text-on-surface-variant font-label text-sm">
                No account? 
                <Link className="text-secondary font-bold hover:text-primary transition-colors ml-1 decoration-primary/30 underline-offset-4 decoration-2" href="/register">Register</Link>
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer - Simplified for Login */}
      <footer className="w-full px-12 py-8 flex flex-col md:flex-row justify-between items-center gap-4 relative z-10 bg-white/40 backdrop-blur-sm">
        <div className="font-label text-[10px] tracking-widest text-outline uppercase">© 2026 ശ്രീ muthappa madapura Indiranagar. All Rights Reserved.</div>
        <div className="flex gap-6 font-label">
          <button
            className="text-[10px] uppercase tracking-widest font-bold text-outline transition-colors hover:text-primary"
            onClick={() => setActivePolicyModal("privacy")}
            type="button"
          >
            Privacy Policy
          </button>
          <button
            className="text-[10px] uppercase tracking-widest font-bold text-outline transition-colors hover:text-primary"
            onClick={() => setActivePolicyModal("terms")}
            type="button"
          >
            Terms of Service
          </button>
        </div>
      </footer>
      <PolicyModal activePolicy={activePolicyModal} onClose={() => setActivePolicyModal(null)} />
    </div>
  );
}
