import React, { useState } from "react";
import { Mail, Lock, Key, LogIn, Sparkles, Smile, Compass, LogOut, CheckCircle2, ShieldAlert } from "lucide-react";
import { useTheme } from "./ThemeContext";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (email: string, name: string) => void;
}

export function AuthModal({ isOpen, onClose, onLoginSuccess }: AuthModalProps) {
  const { theme } = useTheme();
  const [isRegister, setIsRegister] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setInfo("");

    if (!email) {
      setError("Please key in a valid email address.");
      return;
    }

    if (isForgotPassword) {
      setInfo(`A password recovery token has been compiled and dispatched to ${email}. Please examine your inbox.`);
      setTimeout(() => {
        setIsForgotPassword(false);
      }, 3500);
      return;
    }

    if (isRegister) {
      if (!fullName) {
        setError("Please supply your full name.");
        return;
      }
      if (password.length < 6) {
        setError("Password must consist of at least 6 characters.");
        return;
      }
      onLoginSuccess(email, fullName);
      onClose();
    } else {
      if (password.length < 2) {
        setError("Please enter a valid password.");
        return;
      }
      const inferredName = email.split("@")[0];
      const nameCapitalized = inferredName.charAt(0).toUpperCase() + inferredName.slice(1);
      onLoginSuccess(email, nameCapitalized);
      onClose();
    }
  };

  const handleGoogleLogin = () => {
    setError("");
    setInfo("");
    onLoginSuccess("kparinithatejaswi@gmail.com", "Tejaswi Parinitha");
    onClose();
  };

  return (
    <div id="auth-modal-overlay" className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <div 
        id="auth-modal-card" 
        className="w-full max-w-md overflow-hidden rounded-2xl border border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl transition-all"
      >
        <div className="p-6 sm:p-8">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <span className="font-sans font-bold text-lg text-gray-900 dark:text-white">RetireWise AI Secure Access</span>
            </div>
            <button 
              id="close-auth-modal"
              onClick={onClose}
              className="rounded-full p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            >
              ✕
            </button>
          </div>

          <h3 className="font-sans font-semibold text-2xl text-gray-900 dark:text-white mb-2">
            {isForgotPassword ? "Retrieve Password" : isRegister ? "Create Free Account" : "Access Your Roadmap"}
          </h3>
          <p className="font-sans text-sm text-gray-500 dark:text-slate-400 mb-6">
            {isForgotPassword 
              ? "Specify your email to retrieve recovery credentials." 
              : isRegister 
              ? "Join over 25,000+ smart planners using AI for safe retirement planning." 
              : "Login using your email or Google to activate personalized projections."}
          </p>

          {error && (
            <div className="mb-4 flex items-start gap-2 rounded-lg bg-red-50 dark:bg-red-950/30 p-3 text-xs text-red-600 dark:text-red-400">
              <ShieldAlert className="h-4 w-4 shrink-0 transition-all" />
              <span>{error}</span>
            </div>
          )}

          {info && (
            <div className="mb-4 flex items-start gap-2 rounded-lg bg-blue-50 dark:bg-blue-950/30 p-3 text-xs text-blue-600 dark:text-blue-400">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              <span>{info}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && !isForgotPassword && (
              <div>
                <label className="block font-sans text-xs font-medium text-gray-700 dark:text-slate-300 mb-1">YOUR FULL NAME</label>
                <input
                  id="auth-fullname"
                  type="text"
                  required
                  placeholder="e.g. Tejaswi Parinitha"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 dark:border-slate-800 bg-gray-50 dark:bg-slate-950 px-3 py-2 text-sm text-gray-900 dark:text-white transition focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            )}

            <div>
              <label className="block font-sans text-xs font-medium text-gray-700 dark:text-slate-300 mb-1">EMAIL ADDRESS</label>
              <input
                id="auth-email"
                type="email"
                required
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-gray-300 dark:border-slate-800 bg-gray-50 dark:bg-slate-950 px-3 py-2 text-sm text-gray-900 dark:text-white transition focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {!isForgotPassword && (
              <div>
                <label className="block font-sans text-xs font-medium text-gray-700 dark:text-slate-300 mb-1">SECURE PASSWORD</label>
                <input
                  id="auth-password"
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 dark:border-slate-800 bg-gray-50 dark:bg-slate-950 px-3 py-2 text-sm text-gray-900 dark:text-white transition focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            )}

            {!isForgotPassword && !isRegister && (
              <div className="flex justify-end">
                <button
                  id="forgot-password-toggle"
                  type="button"
                  onClick={() => setIsForgotPassword(true)}
                  className="font-sans text-xs text-blue-600 dark:text-blue-400 hover:underline hover:cursor-pointer"
                >
                  Forgot your password?
                </button>
              </div>
            )}

            <button
              id="auth-submit-btn"
              type="submit"
              className="w-full flex justify-center items-center gap-2 rounded-lg bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-md transition hover:scale-[1.01]"
            >
              <LogIn className="h-4 w-4" />
              {isForgotPassword ? "Transmit Retrieval Instructions" : isRegister ? "Create Account & Start" : "Authenticate Account"}
            </button>
          </form>

          {!isForgotPassword && (
            <div className="mt-4">
              <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t border-gray-200 dark:border-slate-850"></div>
                <span className="flex-shrink mx-4 text-xs text-gray-400 uppercase">Or continue with</span>
                <div className="flex-grow border-t border-gray-200 dark:border-slate-850"></div>
              </div>

              <button
                id="auth-google-btn"
                type="button"
                onClick={handleGoogleLogin}
                className="w-full flex items-center justify-center gap-2 rounded-lg border border-gray-300 dark:border-slate-850 bg-white dark:bg-slate-950 hover:bg-gray-50 dark:hover:bg-slate-900 px-4 py-2 text-sm font-medium text-gray-700 dark:text-slate-300 shadow-sm transition hover:scale-[1.01]"
              >
                <svg className="h-4 w-4 mr-1 shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22l.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                Google Instant Authorization
              </button>
            </div>
          )}

          <div className="mt-6 text-center">
            {isForgotPassword ? (
              <button
                id="back-to-login"
                onClick={() => setIsForgotPassword(false)}
                className="font-sans text-xs text-blue-600 dark:text-blue-400 hover:underline"
              >
                Return to account login
              </button>
            ) : (
              <p className="font-sans text-xs text-gray-500 dark:text-slate-400">
                {isRegister ? "Already configured an account? " : "New to RetireWise AI? "}
                <button
                  id="toggle-register"
                  type="button"
                  onClick={() => setIsRegister(!isRegister)}
                  className="font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                >
                  {isRegister ? "Login here" : "Sign up instantly"}
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
