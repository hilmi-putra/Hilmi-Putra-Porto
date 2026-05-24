import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import { Loader2 } from "lucide-react";
import { SANDBOX_ENABLED, hasSandboxSession } from "../lib/sandboxMode";

const sandboxSession = { user: { email: "sandbox-admin@portfolio.local" } };

export const ProtectedRoutes = ({ children }) => {
  const [session, setSession] = useState(() => (hasSandboxSession() ? sandboxSession : null));
  const [loading, setLoading] = useState(() => !hasSandboxSession());

  useEffect(() => {
    if (!SANDBOX_ENABLED && localStorage.getItem("portfolio_sandbox_session") === "true") {
      localStorage.removeItem("portfolio_sandbox_session");
    }

    if (hasSandboxSession()) {
      return;
    }

    let active = true;

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!active) return;
      setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      // Prioritize sandbox override if active
      if (hasSandboxSession()) {
        setSession(sandboxSession);
      } else {
        setSession(session);
      }
      setLoading(false);
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4 text-white">
        <Loader2 className="animate-spin text-brand-orange" size={40} />
        <span className="text-sm uppercase tracking-widest text-text-secondary">Authenticating Session...</span>
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};
export default ProtectedRoutes;
