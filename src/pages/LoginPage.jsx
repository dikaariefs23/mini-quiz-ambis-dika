import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { login } from "../api/auth";
import { useAuth } from "../auth/AuthProvider";

export default function LoginPage() {
  const nav = useNavigate();
  const { setToken } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await login({ email, password });
      const token = res?.data?.data?.access_token;

      if (!token) {
        setError("Token tidak ditemukan dari response login.");
        return;
      }

      setToken(token);
      nav("/dashboard");
    } catch (err) {
      const data = err?.response?.data;
      setError(data?.error || data?.message || err?.message || "Login gagal");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-orange-50 via-amber-50 to-red-50 py-12">
        <div className="w-full max-w-md">
          {/* Hero Header - FIXED */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-3 bg-gradient-to-r from-orange-500 to-red-600 px-8 py-5 rounded-3xl shadow-2xl mb-6 backdrop-blur-sm mx-auto max-w-sm">
              <div className="w-16 h-16 bg-white/20 rounded-3xl flex items-center justify-center backdrop-blur-sm">
                <span className="text-3xl font-black text-white drop-shadow-2xl">🔑</span>
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-black text-white drop-shadow-2xl tracking-tight">
                  Mini Quiz Ambis
                </h1>
                <p className="text-xs font-semibold bg-gradient-to-r from-orange-200 to-red-200 bg-clip-text text-transparent mt-1 tracking-wide">
                  BY DIKA ARIEF SUGIYATNA
                </p>
              </div>
            </div>
            <p className="text-xl md:text-2xl text-slate-700 font-semibold max-w-sm mx-auto leading-relaxed">
              Masuk untuk mulai latihan UTBK/PTN
            </p>
          </div>

          {/* Login Card - sama */}
          <div className="bg-white/80 backdrop-blur-xl border border-orange-100/50 rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-500 hover:-translate-y-1 p-8 md:p-10 max-w-md mx-auto">
            <form onSubmit={onSubmit} className="space-y-6">
              {/* Email - sama */}
              <div>
                <label className="block text-sm font-bold text-slate-800 mb-3 tracking-wide">
                  📧 Email
                </label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-5 py-4 text-lg bg-white/60 border-2 border-orange-200 rounded-2xl focus:ring-4 focus:ring-orange-200/50 focus:border-orange-400 transition-all duration-400 placeholder-slate-400 hover:border-orange-300 hover:bg-white/80 shadow-lg hover:shadow-xl backdrop-blur-sm"
                  placeholder="contoh@email.com"
                  type="email"
                  required
                />
              </div>

              {/* Password - sama */}
              <div>
                <label className="block text-sm font-bold text-slate-800 mb-3 tracking-wide">
                  🔒 Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-5 py-4 text-lg bg-white/60 border-2 border-orange-200 rounded-2xl focus:ring-4 focus:ring-orange-200/50 focus:border-orange-400 transition-all duration-400 placeholder-slate-400 hover:border-orange-300 hover:bg-white/80 shadow-lg hover:shadow-xl backdrop-blur-sm"
                  placeholder="Masukkan password"
                  required
                />
              </div>

              {/* Error - sama */}
              {error ? (
                <div className="p-5 bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-200 rounded-2xl shadow-xl animate-pulse backdrop-blur-sm">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                    </div>
                    <span className="font-semibold text-red-800 leading-relaxed text-sm">{error}</span>
                  </div>
                </div>
              ) : null}

              {/* Submit Button - sama */}
              <button
                disabled={loading}
                type="submit"
                className={`w-full py-5 px-8 rounded-2xl font-black text-xl shadow-2xl transition-all duration-400 transform relative overflow-hidden group ${
                  loading
                    ? "bg-gradient-to-r from-slate-400 to-slate-500 cursor-not-allowed opacity-80 shadow-none"
                    : "bg-gradient-to-r from-orange-500 via-red-500 to-orange-600 hover:from-orange-600 hover:via-red-600 hover:to-orange-700 hover:shadow-3xl hover:shadow-orange-500/25 hover:scale-[1.02] active:scale-[0.98]"
                } border-0 text-white flex items-center justify-center gap-3 uppercase tracking-wide`}
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                    <span>Memasuk...</span>
                  </>
                ) : (
                  <>
                    🚀 Masuk Sekarang
                  </>
                )}
                <div className={`absolute inset-0 bg-gradient-to-r from-orange-400 to-red-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10`}></div>
              </button>
            </form>

            {/* Register Link - sama */}
            <div className="mt-10 pt-8 border-t-2 border-orange-100 text-center">
              <p className="text-lg text-slate-700 font-semibold">
                Belum punya akun?{" "}
                <Link 
                  to="/register" 
                  className="font-black bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent hover:from-orange-600 hover:to-red-700 transition-all duration-300 hover:underline decoration-2 underline-offset-4 inline-flex items-center gap-1"
                >
                  Daftar Gratis
                  <span>→</span>
                </Link>
              </p>
              <p className="text-sm text-slate-500 mt-2">
                Latihan UTBK/PTN dimulai dari sini!
              </p>
            </div>
          </div>

          {/* FEATURES DIHAPUS - page lebih clean */}
        </div>
      </div>
    </Layout>
  );
}
