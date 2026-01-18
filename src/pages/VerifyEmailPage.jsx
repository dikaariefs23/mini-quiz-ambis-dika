import { useState } from "react";
import Layout from "../components/Layout";
import { verifyEmail } from "../api/auth";

export default function VerifyEmailPage() {
  const [token, setToken]  = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    setError("");
    setLoading(true);
    try {
      await verifyEmail({ token });
      setMsg("✅ Email verified. Sekarang kamu bisa login.");
      setToken(""); // Clear input on success
    } catch (err) {
      const m = err?.response?.data?.error || err?.message || "Verify gagal";
      setError(m);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-orange-50 to-red-50">
        <div className="w-full max-w-md space-y-8 bg-white/80 backdrop-blur-xl shadow-xl rounded-2xl p-8 border border-white/50 hover:shadow-2xl transition-all duration-500">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Verify Email</h2>
            <p className="text-gray-600 max-w-sm mx-auto">
              Paste token verifikasi dari email kamu 📧
            </p>
          </div>

          <form onSubmit={onSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Verification Token</label>
              <textarea
                value={token}
                onChange={(e) => setToken(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 resize-vertical min-h-[120px] placeholder:text-gray-400"
                placeholder="Paste verification_token_from_email disini..."
                disabled={loading}
              />
            </div>

            {msg ? (
              <div className="bg-green-50 border-2 border-green-200 text-green-800 p-4 rounded-xl animate-pulse">
                {msg}
              </div>
            ) : null}

            {error ? (
              <div className="bg-red-50 border-2 border-red-200 text-red-800 p-4 rounded-xl flex items-start gap-2">
                <span className="text-lg">⚠️</span>
                {error}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={loading || !token.trim()}
              className="group relative w-full flex justify-center py-4 px-4 border border-transparent text-lg font-bold rounded-xl text-white bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 focus:outline-none focus:ring-4 focus:ring-orange-500 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transform transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
            >
              <span className="absolute inset-0 border border-white/30 rounded-xl" />
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Verifying...
                </>
              ) : (
                "Verify Email"
              )}
            </button>
          </form>

          {/* Features teaser */}
          <div className="grid grid-cols-3 gap-4 pt-8 border-t border-gray-200">
            <div className="text-center p-3 bg-orange-50/50 rounded-lg backdrop-blur-sm hover:bg-orange-100 transition-colors">
              <span className="text-2xl">⚡</span>
              <div className="text-xs font-medium text-gray-700 mt-1">Cepat</div>
            </div>
            <div className="text-center p-3 bg-green-50/50 rounded-lg backdrop-blur-sm hover:bg-green-100 transition-colors">
              <span className="text-2xl">🔒</span>
              <div className="text-xs font-medium text-gray-700 mt-1">Aman</div>
            </div>
            <div className="text-center p-3 bg-blue-50/50 rounded-lg backdrop-blur-sm hover:bg-blue-100 transition-colors">
              <span className="text-2xl">📱</span>
              <div className="text-xs font-medium text-gray-700 mt-1">Mobile</div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
