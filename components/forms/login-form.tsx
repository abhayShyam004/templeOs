"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Loader2, ShieldCheck, ArrowRight } from "lucide-react";
import Link from "next/link";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("IDENTITY MISMATCH / INVALID CREDENTIALS");
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch (err) {
      setError("SYSTEM FAILURE / PLEASE RE-AUTHENTICATE");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border border-hairline border-black/10 bg-white p-8 md:p-16 shadow-2xl relative overflow-hidden">
      
      {/* Decorative Stamp */}
      <div className="absolute -top-10 -right-10 w-48 h-48 border border-hairline border-black/5 rounded-full flex items-center justify-center opacity-40 pointer-events-none group">
         <span className="font-serif italic text-7xl text-accent transition-transform duration-1000 group-hover:scale-110">ശ്രീ</span>
      </div>

      <div className="mb-16 relative z-10">
        <div className="flex items-center gap-4 mb-6">
           <ShieldCheck size={18} className="text-accent" />
           <p className="label-mono text-accent font-black tracking-[0.2em]">SECURE ACCESS</p>
        </div>
        <h2 className="font-serif text-[clamp(2.5rem,5vw,4rem)] text-black leading-none tracking-tighter">Authenticate</h2>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-12 relative z-10">
        {error && (
          <div className="p-5 border border-hairline border-accent bg-accent/5 text-accent label-mono text-[9px] tracking-widest text-center animate-in fade-in slide-in-from-top-2">
            {error}
          </div>
        )}
        
        <div className="space-y-4">
          <label className="label-mono opacity-40 block font-bold">IDENTIFIER / EMAIL</label>
          <input
            className="w-full border-b-2 border-black/5 bg-transparent py-4 font-serif text-2xl focus:outline-none focus:border-accent transition-all placeholder:opacity-10 text-black"
            placeholder="devotee@sanctum.org"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        
        <div className="space-y-4">
          <label className="label-mono opacity-40 block font-bold">ACCESS KEY / PASS</label>
          <input
            className="w-full border-b-2 border-black/5 bg-transparent py-4 font-serif text-2xl tracking-[0.2em] focus:outline-none focus:border-accent transition-all placeholder:opacity-10 text-black"
            placeholder="••••••••"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        
        <div className="pt-6">
          <button className="btn-primary w-full py-6 flex justify-center items-center gap-4" type="submit" disabled={loading}>
            {loading ? (
              <span className="flex items-center justify-center gap-4 font-bold">
                <Loader2 className="h-5 w-5 animate-spin" /> GENERATING SESSION...
              </span>
            ) : (
              <span className="font-bold">VERIFY IDENTITY —→</span>
            )}
          </button>
        </div>
        
        <div className="relative py-8 flex items-center justify-center">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-hairline border-black/10" />
          </div>
          <span className="relative bg-white px-8 label-mono opacity-30 text-[9px]">PROTOCOL CROSS-VERIFICATION</span>
        </div>
        
        <button 
          className="btn-secondary w-full py-5 text-[10px] font-bold tracking-widest" 
          type="button"
          onClick={() => signIn("google")}
        >
          GOOGLE IDENTITY PROFILE
        </button>
      </form>
    </div>
  );
}
