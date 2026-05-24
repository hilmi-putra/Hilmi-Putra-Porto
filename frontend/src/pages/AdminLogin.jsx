import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { KeyRound, AlertTriangle, ShieldCheck, Loader2, Eye, EyeOff } from "lucide-react";
import { SANDBOX_ENABLED } from "../lib/sandboxMode";

export const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) throw signInError;

      // Clean up sandbox flag
      localStorage.removeItem("portfolio_sandbox_session");
      navigate("/admin/dashboard");
    } catch (err) {
      console.error("Login error:", err);
      setError(err.message || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  const handleSandboxBypass = () => {
    if (!SANDBOX_ENABLED) {
      return;
    }

    localStorage.setItem("portfolio_sandbox_session", "true");
    navigate("/admin/dashboard");
  };

  return (
    <div className="w-full min-h-screen bg-brand-blue flex items-center justify-center py-24 px-6 text-white grainy-overlay">
      <div className="bg-slate-900/40 backdrop-blur-xl shadow-2xl max-w-md w-full rounded-3xl p-8 md:p-10 border border-white/10 relative overflow-hidden flex flex-col gap-6 text-left">
        {/* Glow */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-lime/20 rounded-full blur-[60px]" />

        {/* Title */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-brand-lime">
            <KeyRound size={20} />
            <span className="text-[11px] uppercase tracking-widest font-bold text-brand-lime">Admin Portal</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white">Sign In</h1>
          <p className="text-blue-100 text-xs font-light">Authenticate to access the projects CRUD management dashboard.</p>
        </div>

        {/* Error Callout */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-start gap-3">
            <AlertTriangle className="text-red-400 shrink-0 mt-0.5" size={16} />
            <div className="flex flex-col gap-1">
              <span className="text-xs font-bold text-red-400">Authentication Failed</span>
              <span className="text-[11px] text-red-300/80 leading-normal">{error}</span>
            </div>
          </div>
        )}

        {/* Standard Form */}
        <form onSubmit={handleLogin} className="flex flex-col gap-6">
          <Input
            label="Email Address"
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@example.com"
            required
            className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-brand-lime"
          />
          <div className="flex flex-col w-full">
            <label className="text-[11px] uppercase tracking-widest text-text-secondary mb-1">Security Password</label>
            <div className="relative">
              <Input
                name="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-brand-lime"
              />
              <button
                type="button"
                onClick={() => setShowPassword((current) => !current)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-0 top-1/2 -translate-y-1/2 pr-1 text-white/60 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <Button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-2 mt-2 bg-brand-lime text-slate-900 hover:bg-brand-lime/90 font-bold">
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={16} /> Logging In...
              </>
            ) : (
              "Authenticate Securely"
            )}
          </Button>
        </form>

        {SANDBOX_ENABLED && (
          <>
            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-white/20"></div>
              <span className="flex-shrink mx-4 text-[9px] uppercase tracking-widest text-blue-100">Or Test Sandbox</span>
              <div className="flex-grow border-t border-white/20"></div>
            </div>

            {/* Sandbox Access callout and Button */}
            <div className="flex flex-col gap-3">
              <Button variant="outline" onClick={handleSandboxBypass} className="w-full flex items-center justify-center gap-2 border-white/30 text-white hover:bg-white/10">
                <ShieldCheck size={16} className="text-brand-lime" />
                Bypass to Demo Sandbox
              </Button>
              <span className="text-[10px] text-blue-100/80 leading-relaxed font-light text-center">
                * Use Sandbox Mode to test full database additions, edits, and deletions instantly in your browser without active credentials.
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
export default AdminLogin;
