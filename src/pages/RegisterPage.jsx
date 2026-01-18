import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { register } from "../api/auth";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    setError("");
    setLoading(true);

    try {
      await register({ name, email, password });
      setMsg("✅ Register berhasil! Cek email untuk token verifikasi, lalu aktifkan akun di halaman Verify Email.");
    } catch (err) {
      if (err?.response?.status === 409) {
        setError("⚠️ Email sudah terdaftar. Silakan login atau gunakan email lain.");
        return;
      }
      const data = err?.response?.data;
      const m =
        (typeof data === "string" && data) ||
        data?.error ||
        data?.message ||
        err?.message ||
        "Register gagal";
      setError(m);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-orange-50 via-amber-50 to-red-50 py-12">
        <div className="w-full max-w-md">
          {/* Hero Header - FIXED PUTIH */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-3 bg-gradient-to-r from-emerald-500 to-teal-600 px-8 py-5 rounded-3xl shadow-2xl mb-6 backdrop-blur-sm mx-auto max-w-sm">
              <div className="w-16 h-16 bg-white/20 rounded-3xl flex items-center justify-center backdrop-blur-sm">
                <span className="text-3xl font-black text-white drop-shadow-2xl">✨</span>
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-black text-white drop-shadow-2xl tracking-tight">
                  Mini Quiz Ambis
                </h1>
                <p className="text-xs font-semibold bg-gradient-to-r from-emerald-200 to-teal-200 bg-clip-text text-transparent mt-1 tracking-wide uppercase">
                  by Dika Arief Sugiyatna
                </p>
              </div>
            </div>
            <p className="text-xl md:text-2xl text-slate-700 font-semibold max-w-sm mx-auto leading-relaxed">
              Buat akun gratis untuk latihan UTBK/PTN
            </p>
          </div>

          {/* Register Card - sama */}
          <div className="bg-white/80 backdrop-blur-xl border border-emerald-100/50 rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-500 hover:-translate-y-1 p-8 md:p-10 max-w-md mx-auto">
            <form onSubmit={onSubmit} className="space-y-6">
              {/* Name - sama */}
              <div>
                <label className="block text-sm font-bold text-slate-800 mb-3 tracking-wide flex items-center gap-2">
                  👤 Nama Lengkap
                </label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-5 py-4 text-lg bg-white/60 border-2 border-emerald-200 rounded-2xl focus:ring-4 focus:ring-emerald-200/50 focus:border-emerald-400 transition-all duration-400 placeholder-slate-400 hover:border-emerald-300 hover:bg-white/80 shadow-lg hover:shadow-xl backdrop-blur-sm"
                  placeholder="Dika Arief Sugiyatna"
                  required
                />
              </div>

              {/* Email - sama */}
              <div>
                <label className="block text-sm font-bold text-slate-800 mb-3 tracking-wide flex items-center gap-2">
                  📧 Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-5 py-4 text-lg bg-white/60 border-2 border-emerald-200 rounded-2xl focus:ring-4 focus:ring-emerald-200/50 focus:border-emerald-400 transition-all duration-400 placeholder-slate-400 hover:border-emerald-300 hover:bg-white/80 shadow-lg hover:shadow-xl backdrop-blur-sm"
                  placeholder="dika@email.com"
                  required
                />
              </div>

              {/* Password - sama */}
              <div>
                <label className="block text-sm font-bold text-slate-800 mb-3 tracking-wide flex items-center gap-2">
                  🔒 Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-5 py-4 text-lg bg-white/60 border-2 border-emerald-200 rounded-2xl focus:ring-4 focus:ring-emerald-200/50 focus:border-emerald-400 transition-all duration-400 placeholder-slate-400 hover:border-emerald-300 hover:bg-white/80 shadow-lg hover:shadow-xl backdrop-blur-sm"
                  placeholder="Buat password kuat (min 8 karakter)"
                  minLength="8"
                  required
                />
              </div>

              {/* Success/Error - sama */}
              {msg ? (
                <div className="p-5 bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-200 rounded-2xl shadow-xl backdrop-blur-sm animate-bounce">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-6 h-6 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <span className="font-bold text-emerald-800 text-sm leading-relaxed block">{msg}</span>
                      <Link 
                        to="/verify-email"
                        className="inline-flex items-center gap-1 mt-2 text-emerald-700 font-semibold underline hover:text-emerald-800 text-sm"
                      >
                        📧 Verify Email Sekarang →
                      </Link>
                    </div>
                  </div>
                </div>
              ) : null}

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
                className={`w-full py-5 px-8 rounded-2xl font-black text-xl shadow-2xl transition-all duration-400 transform relative overflow-hidden group uppercase tracking-wide ${
                  loading
                    ? "bg-gradient-to-r from-slate-400 to-slate-500 cursor-not-allowed opacity-80 shadow-none"
                    : "bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-600 hover:via-teal-600 hover:to-emerald-700 hover:shadow-3xl hover:shadow-emerald-500/25 hover:scale-[1.02] active:scale-[0.98]"
                } border-0 text-white flex items-center justify-center gap-3`}
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                    <span>Mendaftar...</span>
                  </>
                ) : (
                  <>
                    ✨ Buat Akun Gratis
                  </>
                )}
                <div className={`absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10`}></div>
              </button>
            </form>

            {/* Login Link - sama */}
            <div className="mt-10 pt-8 border-t-2 border-emerald-100 text-center">
              <p className="text-lg text-slate-700 font-semibold">
                Sudah punya akun?{" "}
                <Link 
                  to="/login" 
                  className="font-black bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent hover:from-orange-600 hover:to-red-700 transition-all duration-300 hover:underline decoration-2 underline-offset-4 inline-flex items-center gap-1"
                >
                  Masuk Sekarang
                  <span>→</span>
                </Link>
              </p>
              <p className="text-sm text-slate-500 mt-2">
                Mulai latihan UTBK/PTN dalam 1 menit!
              </p>
            </div>
          </div>

          {/* Features - opsional hapus kalau mau clean */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="text-center p-6 bg-white/60 backdrop-blur-xl rounded-2xl border border-emerald-100/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-2xl">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 className="font-bold text-xl text-slate-900 mb-2">Gratis Selamanya</h4>
              <p className="text-slate-600 text-sm">Tanpa biaya tersembunyi</p>
            </div>
            <div className="text-center p-6 bg-white/60 backdrop-blur-xl rounded-2xl border border-emerald-100/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-2xl">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h4 className="font-bold text-xl text-slate-900 mb-2">Mudah</h4>
              <p className="text-slate-600 text-sm">Daftar 30 detik, langsung latihan</p>
            </div>
            <div className="text-center p-6 bg-white/60 backdrop-blur-xl rounded-2xl border border-emerald-100/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-2xl">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h4 className="font-bold text-xl text-slate-900 mb-2">Lengkap</h4>
              <p className="text-slate-600 text-sm">Semua subtest UTBK/PTN tersedia</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
