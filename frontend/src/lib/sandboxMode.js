export const SANDBOX_ENABLED = import.meta.env.DEV;

export const hasSandboxSession = () => {
  if (!SANDBOX_ENABLED) {
    return false;
  }

  return localStorage.getItem("portfolio_sandbox_session") === "true";
};
