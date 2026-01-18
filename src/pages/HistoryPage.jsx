import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Layout from "../components/Layout";
import { getHistory } from "../api/quiz";

export default function HistoryPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const load = async () => {
    setLoading(true);
    setErr("");
    try {
      const res = await getHistory({ limit: 20, offset: 0 });

      const raw = res?.data?.data ?? res?.data ?? [];
      const list = Array.isArray(raw)
        ? raw
        : Array.isArray(raw?.items)
          ? raw.items
          : Array.isArray(raw?.results)
            ? raw.results
            : [];

      setItems(list);
    } catch (e) {
      const status = e?.response?.status;
      const data = e?.response?.data;

      if (status === 401) setErr("Session kamu habis/invalid. Silakan login ulang.");
      else if (status === 504) setErr("Server sedang lambat (504). Coba klik Retry.");
      else setErr(data?.error || data?.message || e?.message || "Gagal load history");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-red-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-3 bg-gradient-to-r from-orange-500 to-red-600 px-8 py-4 rounded-3xl shadow-2xl mb-6 backdrop-blur-sm">
              <div className="w-14 h-14 bg-white/20 rounded-3xl flex items-center justify-center backdrop-blur-sm">
                <span className="text-2xl font-black text-white drop-shadow-lg">📜</span>
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-black text-white drop-shadow-2xl tracking-tight">
                  Riwayat Quiz
                </h1>
                <p className="text-sm font-semibold text-orange-100 tracking-wide uppercase">by Dika Arief Sugiyatna</p>
              </div>
            </div>
            <p className="text-xl md:text-2xl text-slate-700 font-semibold max-w-2xl mx-auto leading-relaxed">
              Lihat semua sesi quiz, skor, dan detail lengkapmu
            </p>
          </div>

          {/* Error Alert */}
          {err ? (
            <div className="max-w-2xl mx-auto mb-12 p-8 bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-200 rounded-3xl shadow-xl animate-pulse">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center p-3 flex-shrink-0">
                  <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <span className="font-semibold text-lg text-red-800 leading-relaxed block">{err}</span>
                </div>
                <button
                  onClick={load}
                  className="px-6 py-3 bg-gradient-to-r from-red-500 to-orange-600 text-white font-bold text-sm rounded-2xl hover:from-red-600 hover:to-orange-700 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 whitespace-nowrap"
                >
                  🔄 Retry
                </button>
              </div>
            </div>
          ) : null}

          {/* Loading */}
          {loading ? (
            <div className="flex justify-center py-24">
              <div className="flex items-center gap-4 text-orange-600">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
                <span className="text-xl font-semibold">Loading Riwayat...</span>
              </div>
            </div>
          ) : null}

          {/* Empty State */}
          {!loading && !items.length ? (
            <div className="text-center py-32 max-w-2xl mx-auto">
              <div className="w-32 h-32 bg-gradient-to-br from-orange-100 to-red-100 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl">
                <svg className="w-20 h-20 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-3xl font-black text-slate-700 mb-4">Belum Ada Riwayat</h3>
              <p className="text-xl text-slate-600 max-w-lg mx-auto mb-8">
                Selesaikan quiz dulu di dashboard, lalu kembali ke sini untuk melihat hasilnya!
              </p>
              <Link 
                to="/dashboard"
                className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold text-lg rounded-2xl hover:from-orange-600 hover:to-red-700 shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-1"
              >
                🚀 Mulai Quiz
              </Link>
            </div>
          ) : null}

          {/* History List - RAPiH */}
          {!loading && items.length ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((it, idx) => {
                const sessionId = it.session_id || it.sessionId;
                const score = it.score ?? it.result_score ?? "-";
                const ts = it.timestamp || it.created_at || it.createdAt;
                const subtestName = it.subtest_name || it.subtestName || "Unknown";

                const scoreColor = score === "-" ? "text-slate-500" : 
                  parseFloat(score) >= 80 ? "text-emerald-600" : 
                  parseFloat(score) >= 60 ? "text-amber-600" : "text-red-600";

                const inner = (
                  <div>
                    <div className="flex items-start justify-between mb-3 gap-3">
                      <div className="flex items-start gap-2 flex-1 min-w-0">
                        <div className="w-10 h-10 bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-sm font-bold text-slate-700 leading-none">{sessionId?.slice(-6) || 'N/A'}</span>
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className="font-bold text-lg text-slate-900 line-clamp-1 max-w-[140px] leading-tight">{subtestName}</h4>
                          <p className="text-xs text-slate-500 leading-tight mt-0.5">{ts ? new Date(ts).toLocaleString('id-ID', { timeStyle: 'short' }) : '-'}</p>
                        </div>
                      </div>
                      <div className={`text-3xl font-black ${scoreColor} flex-shrink-0 leading-none`}>
                        {score}
                      </div>
                    </div>
                  </div>
                );

                if (!sessionId) {
                  return (
                    <div key={it.id || idx} className="bg-white/80 backdrop-blur-xl p-6 rounded-2xl border-2 border-orange-100 shadow-xl hover:shadow-2xl transition-all duration-400 hover:-translate-y-1">
                      {inner}
                      <div className="mt-4 p-3 bg-red-50 border-2 border-red-200 rounded-xl">
                        <p className="text-red-800 font-semibold text-sm text-center leading-tight">
                          ⚠️ Session ID tidak ditemukan
                        </p>
                      </div>
                    </div>
                  );
                }

                return (
                  <Link 
                    key={sessionId} 
                    to={`/history/${sessionId}`}
                    className="block bg-white/80 backdrop-blur-xl p-6 rounded-2xl border-2 border-orange-100 shadow-xl hover:shadow-2xl hover:border-orange-200 hover:-translate-y-1 transition-all duration-400 hover:bg-white/95 group"
                  >
                    {inner}
                    <div className="mt-6 pt-4 border-t-2 border-orange-100 group-hover:border-orange-200 transition-colors">
                      <span className="inline-flex items-center gap-1.5 text-orange-600 font-bold text-base group-hover:text-orange-700 transition-colors">
                        📊 Lihat Detail →
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : null}

          {items.length >= 20 && (
            <div className="text-center mt-12">
              <button
                onClick={load}
                className="px-8 py-4 bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold text-lg rounded-2xl hover:from-orange-600 hover:to-red-700 shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-1"
              >
                🔄 Load More History
              </button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
