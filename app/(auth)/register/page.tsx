"use client";

import { FormEvent, useState, useEffect } from "react";
import Link from "next/link";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const { status } = useSession();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/");
    }
  }, [status, router]);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      if (response.ok === false) {
        const message = await response.text();
        setError(message || "Registration failed");
        setLoading(false);
        return;
      }

      await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      router.push("/");
      router.refresh();
    } catch (e) {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="bg-background text-on-background font-body min-h-screen flex flex-col relative overflow-x-hidden">
      {/* Navigation Shell - Matching Login Page */}
      <header className="fixed top-0 w-full z-50 flex justify-between items-center px-8 pt-12 pb-6">
        <Link href="/" className="font-headline text-2xl font-bold tracking-tighter text-primary">
          ശ്രീ Muthappa Madapura Indiranagar
        </Link>
        <Link href="/" className="text-on-surface-variant font-medium hover:text-secondary transition-colors duration-300 flex items-center gap-2 group">
          <span className="material-symbols-outlined transition-transform group-hover:-translate-x-1">arrow_back</span>
          <span className="font-label text-sm font-medium">Temple Home</span>
        </Link>
      </header>

      <main 
        className="flex-grow flex items-center justify-center p-6 bg-temple-silhouette pt-32" 
        style={{
          backgroundImage: `linear-gradient(rgba(255, 251, 255, 0.9), rgba(255, 251, 255, 0.95)), url(https://lh3.googleusercontent.com/aida-public/AB6AXuApFncSIGQmvIlBBpZWPKMGUd1ZpKL1kSelk2NhSy9ME83LPiDNcakbMX-zVLsHNvEZ5k-NLYrUw_CLxCtF90tOQYHkX-ajgwmV3JZ_fZCAtNHaTZLNJlz2oGrJ9PvEio--RhL4yD74Uurv4-FbdBXOGWhNmNy23k7eYS6pM6WGixfTSVv4Xhg8lns7Z5_tZ3HEVd4c3xH22eOcPc_IupmcxzhbUBWn8N1yW9woolEqCLIL17axgPHTclT3YriVTS0nEon8NkUkRyo)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="w-full max-w-md">
          {/* Sign Up Label */}
          <div className="text-center mb-6">
            <p className="text-on-surface-variant font-label text-sm tracking-widest uppercase opacity-60">devotee sign up</p>
          </div>

          {/* Registration Card */}
          <div className="bg-white rounded-xl p-8 border border-outline-variant/30 shadow-xl shadow-black/5">
            <h1 className="font-headline text-3xl font-bold mb-8 text-on-surface">Create Account</h1>
            
            <form onSubmit={onSubmit} className="space-y-5">
              {/* Full Name Field */}
              <div className="space-y-1.5">
                <label className="block font-label text-xs font-medium text-on-surface-variant uppercase tracking-wider" htmlFor="full_name">Full Name</label>
                <div className="relative group">
                  <input 
                    className="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl px-4 py-3 text-on-surface placeholder:text-outline focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all duration-300 outline-none" 
                    id="full_name" 
                    name="full_name" 
                    placeholder="Balan nair" 
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Email Field */}
              <div className="space-y-1.5">
                <label className="block font-label text-xs font-medium text-on-surface-variant uppercase tracking-wider" htmlFor="email">Email Address</label>
                <div className="relative group">
                  <input 
                    className="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl px-4 py-3 text-on-surface placeholder:text-outline focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all duration-300 outline-none" 
                    id="email" 
                    name="email" 
                    placeholder="devotee@gmail.com" 
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Password Fields Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block font-label text-xs font-medium text-on-surface-variant uppercase tracking-wider" htmlFor="password">Password</label>
                  <div className="relative">
                    <input 
                      className="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl px-4 py-3 text-on-surface placeholder:text-outline focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all duration-300 outline-none pr-10" 
                      id="password" 
                      name="password" 
                      placeholder="••••••••" 
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={6}
                    />
                    <button
                      type="button"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      aria-pressed={showPassword}
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary transition-colors z-[100] cursor-pointer flex items-center justify-center p-1"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="block font-label text-xs font-medium text-on-surface-variant uppercase tracking-wider" htmlFor="confirm_password">Confirm</label>
                  <div className="relative">
                    <input 
                      className="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl px-4 py-3 text-on-surface placeholder:text-outline focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all duration-300 outline-none pr-10" 
                      id="confirm_password" 
                      name="confirm_password" 
                      placeholder="••••••••" 
                      type={showPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      aria-pressed={showPassword}
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary transition-colors z-[100] cursor-pointer flex items-center justify-center p-1"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Terms Agreement */}
              <div className="flex items-center gap-3 pt-2">
                <div className="relative flex items-center">
                  <input 
                    className="w-4 h-4 rounded-sm bg-surface-container-low border-outline-variant text-primary focus:ring-primary focus:ring-offset-white" 
                    id="terms" 
                    type="checkbox" 
                    required
                  />
                </div>
                <label className="text-sm text-on-surface-variant font-label" htmlFor="terms">
                  I agree to the <Link className="text-secondary hover:underline font-semibold" href="#">Terms</Link> and <Link className="text-secondary hover:underline font-semibold" href="#">Privacy Policy</Link>
                </label>
              </div>

              {error && (
                <p className="text-xs font-bold uppercase tracking-widest text-error text-center bg-error/5 py-3 rounded-lg border border-error/10">
                  {error}
                </p>
              )}

              {/* CTA */}
              <button 
                className="w-full mt-4 bg-gradient-to-r from-primary to-[#ff766c] text-white font-headline font-bold py-4 rounded-xl shadow-lg shadow-primary/20 hover:scale-[0.98] active:scale-95 transition-all duration-200 disabled:opacity-50" 
                type="submit"
                disabled={loading}
              >
                {loading ? "Creating..." : "Create Account"}
              </button>
            </form>

            {/* Footer Link */}
            <div className="mt-8 text-center">
              <p className="text-on-surface-variant text-sm font-label">
                Already have an account? 
                <Link className="text-secondary font-bold hover:text-primary transition-colors ml-1" href="/login">Login</Link>
              </p>
            </div>
          </div>

          {/* Decorative Element */}
          <div className="mt-12 flex justify-center items-center gap-4 opacity-40">
            <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-outline"></div>
            <span className="material-symbols-outlined text-secondary">auto_awesome</span>
            <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-outline"></div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-surface-container-low w-full px-12 py-8 flex flex-col md:flex-row justify-between items-center gap-4 border-t border-outline-variant/20">
        <span className="text-xl font-bold text-primary font-headline">The Sacred Sanctuary</span>
        <div className="text-on-surface-variant font-label text-xs">© 2026 The Sacred Sanctuary. All rights reserved.</div>
        <div className="flex gap-6 text-on-surface-variant font-label text-xs">
          <Link className="hover:text-primary transition-colors" href="#">Privacy Policy</Link>
          <Link className="hover:text-primary transition-colors" href="#">Terms of Service</Link>
        </div>
      </footer>
    </div>
  );
}
