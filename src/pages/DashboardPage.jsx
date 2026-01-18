import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { getSubtests, startQuiz, getActiveQuiz } from "../api/quiz";

export default function DashboardPage() {
  const nav = useNavigate();

  const [subtests, setSubtests] = useState([]);
  const [loading, setLoading] = useState(true);

  const [err, setErr] = useState("");
  const [info, setInfo] = useState("");

  const [startingId, setStartingId] = useState(null);

  // status sesi ditampilkan di dashboard
  const [activeSession, setActiveSession] = useState(null);
  const [checkingSession, setCheckingSession] = useState(false);
  const [now, setNow] = useState(Date.now());

  const pickErrorMessage = (data, fallback) => {
    if (!data) return fallback;
    if (typeof data === "string") return data;
    if (data?.error?.message) return data.error.message;
    if (typeof data?.error === "string") return data.error;
    if (data?.message) return data.message;
    return fallback;
  };

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  const activeExpiresAtMs = useMemo(() => {
    const raw =
      activeSession?.expiresAt ||
      activeSession?.expires_at ||
      activeSession?.expiresat ||
      activeSession?.data?.expiresAt ||
      activeSession?.data?.expires_at ||
      activeSession?.data?.expiresat;

    return raw ? new Date(raw).getTime() : null;
  }, [activeSession]);

  const activeLeftSec = activeExpiresAtMs
    ? Math.max(0, Math.floor((activeExpiresAtMs - now) / 1000))
    : null;

  const activeIsExpired = activeLeftSec === 0;
  const hasActive = Boolean(activeSession);

  const normalizeList = (res) => {
    const raw = res?.data?.data ?? res?.data ?? [];
    if (Array.isArray(raw)) return raw;
    if (Array.isArray(raw?.items)) return raw.items;
    if (Array.isArray(raw?.results)) return raw.results;
    return [];
  };

  const normalizeSession = (res) => res?.data?.data || res?.data || null;

  const loadSubtests = async () => {
    const res = await getSubtests();
    setSubtests(normalizeList(res));
  };

  const checkActiveSession = async () => {
    if (checkingSession) return;
    setCheckingSession(true);
    try {
      const res = await getActiveQuiz();
      setActiveSession(normalizeSession(res));
    } catch (e) {
      setActiveSession(null);
    } finally {
      setCheckingSession(false);
    }
  };

  const load = async () => {
    setLoading(true);
    setErr("");
    setInfo("");
    try {
      await Promise.all([loadSubtests(), checkActiveSession()]);
    } catch (e) {
      const status = e?.response?.status;
      const data = e?.response?.data;

      if (status === 401) {
        setErr("Session kamu habis/invalid. Silakan login ulang.");
        return;
      }

      setErr(pickErrorMessage(data, e?.message || "Gagal load dashboard"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const onStart = async (subtestId) => {
    setErr("");
    setInfo("");

    if (!subtestId) {
      setErr("Subtest ID tidak ditemukan. Coba refresh halaman.");
      return;
    }

    if (startingId) return;
    setStartingId(subtestId);

    try {
      await startQuiz(subtestId);
      nav("/quiz");
    } catch (e) {
      const status = e?.response?.status;
      const data = e?.response?.data;

      if (status === 409) {
        setInfo(pickErrorMessage(data, "Masih ada sesi aktif. Membuka Quiz untuk resume..."));
        nav("/quiz");
        return;
      }

      setInfo(pickErrorMessage(data, "Tidak bisa start sesi. Membuka Quiz untuk cek sesi..."));
      nav("/quiz");
    } finally {
      setStartingId(null);
      checkActiveSession();
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-red-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Brand Header - MINI QUIZ AMBIS PUTIH */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-orange-500 to-red-600 px-6 py-3 rounded-full shadow-2xl mb-6 backdrop-blur-sm">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
              <span className="text-2xl font-bold text-white drop-shadow-lg">M</span>
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-black text-white drop-shadow-2xl tracking-tight">
                Mini Quiz Ambis
              </h1>
              <p className="text-sm font-semibold text-orange-100 tracking-wide uppercase">Dashboard</p>
            </div>
          </div>
          <p className="text-xl md:text-2xl text-slate-700 font-semibold max-w-3xl mx-auto leading-relaxed">
            Raih prestasi UTBK/PTN impianmu. Pilih subtest dan mulai latihan sekarang!
          </p>
        </div>


          {/* Quick Stats */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white/80 backdrop-blur-xl p-8 rounded-3xl border border-orange-100 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-red-500 rounded-2xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-600 uppercase tracking-wide">Subtests Tersedia</p>
                  <p className="text-3xl font-black text-slate-900">{subtests.length}</p>
                </div>
              </div>
            </div>
            
            <div className={`bg-white/80 backdrop-blur-xl p-8 rounded-3xl border shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 ${
              hasActive ? (activeIsExpired ? 'border-red-200' : 'border-emerald-200') : 'border-slate-200'
            }`}>
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white p-2`}>
                  {hasActive ? (
                    activeIsExpired ? (
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg className="w-6 h-6 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.048a8.49 8.49 0 011.656-1.436 9.98 9.98 0 013.672-1.186 7.007 7.007 0 014.248.876 6.867 6.867 0 012.484 3.331 7.54 7.54 0 01.652 3.741 6.867 6.867 0 01-2.484 3.331 7.007 7.007 0 01-4.248.876 9.98 9.98 0 01-3.672-1.186 8.49 8.49 0 01-1.656-1.436 7.292 7.292 0 01-.8-3.299 7.292 7.292 0 01.8-3.299z" clipRule="evenodd" />
                      </svg>
                    )
                  ) : (
                    <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-600 uppercase tracking-wide">Status Sesi</p>
                  <p className="text-3xl font-black text-slate-900">
                    {hasActive ? (activeIsExpired ? 'Expired' : 'Aktif') : 'Tidak Ada'}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-xl p-8 rounded-3xl border border-slate-200 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-600 uppercase tracking-wide">Sesi Selesai</p>
                  <p className="text-3xl font-black text-slate-900">0</p>
                </div>
              </div>
            </div>
          </div>

          {/* Alerts */}
          {err ? (
            <div className="mb-12 p-6 bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-200 rounded-3xl shadow-xl animate-pulse">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center p-3">
                  <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <span className="font-semibold text-lg text-red-800 leading-relaxed">{String(err)}</span>
              </div>
            </div>
          ) : null}
          
          {info ? (
            <div className="mb-12 p-6 bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-200 rounded-3xl shadow-xl">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center p-3">
                  <svg className="w-6 h-6 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="font-semibold text-lg text-emerald-800 leading-relaxed">{String(info)}</span>
              </div>
            </div>
          ) : null}

          {loading ? (
            <div className="flex justify-center py-24">
              <div className="flex items-center gap-4 text-orange-600">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
                <span className="text-xl font-semibold">Loading Dashboard...</span>
              </div>
            </div>
          ) : null}

          {/* Active Session Card */}
          {!loading && hasActive && (
            <div className={`mb-12 p-10 rounded-3xl shadow-2xl backdrop-blur-sm border-4 transition-all duration-500 ${
              activeIsExpired 
                ? 'bg-gradient-to-br from-red-50 via-orange-50 to-red-100 border-gradient-to-r from-red-300 to-orange-400' 
                : 'bg-gradient-to-br from-emerald-50 via-teal-50 to-emerald-100 border-gradient-to-r from-emerald-300 to-teal-400'
            }`}>
              <div className="flex items-start gap-4 mb-8">
                <div className={`px-4 py-2 rounded-xl text-sm font-bold shadow-lg ${
                  activeIsExpired 
                    ? 'bg-red-500/20 text-red-800 border-2 border-red-300' 
                    : 'bg-emerald-500/20 text-emerald-800 border-2 border-emerald-300'
                }`}>
                  {activeIsExpired ? '⚠️ SESSION EXPIRED' : '✅ ACTIVE SESSION'}
                </div>
              </div>
              
              <div className="grid lg:grid-cols-2 gap-8 mb-8">
                <div>
                  <h3 className="text-xl font-bold text-slate-800 mb-2">Subtest Aktif</h3>
                  <p className="text-3xl lg:text-4xl font-black bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                    {activeSession?.subtest_name || activeSession?.subtestName || "-"}
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-800 mb-2">Sisa Waktu</h3>
                  <div className={`text-4xl lg:text-5xl font-mono font-black p-4 rounded-2xl shadow-2xl ${
                    activeIsExpired 
                      ? 'bg-red-100 text-red-700 border-4 border-red-200' 
                      : 'bg-emerald-100 text-emerald-700 border-4 border-emerald-200 animate-pulse'
                  }`}>
                    {activeLeftSec !== null ? activeLeftSec.toString().padStart(2, '0') + 's' : '-'}
                  </div>
                </div>
              </div>

              <p className={`text-base leading-relaxed mb-10 ${
                activeIsExpired ? 'text-red-800 font-semibold' : 'text-emerald-800 font-semibold'
              }`}>
                {activeIsExpired 
                  ? "Sesi sebelumnya expired. Mulai sesi baru dari subtest di bawah. Jika masih error 409, tunggu atau login ulang."
                  : "Sesi aktif terdeteksi! Lanjutkan quiz sekarang."
                }
              </p>

              <div className="flex flex-wrap gap-4">
                {!activeIsExpired && (
                  <button
                    onClick={() => nav("/quiz")}
                    className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold text-lg rounded-2xl hover:from-emerald-600 hover:to-teal-700 shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-105 flex items-center gap-3"
                  >
                    🚀 Resume Quiz Sekarang
                  </button>
                )}
                <button
                  onClick={checkActiveSession}
                  disabled={checkingSession}
                  className="px-8 py-4 bg-white/90 border-2 border-orange-300 text-orange-700 font-bold text-lg rounded-2xl hover:bg-orange-50 hover:border-orange-400 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3"
                >
                  {checkingSession ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-orange-500"></div>
                      Checking...
                    </>
                  ) : (
                    '🔄 Refresh Status'
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Subtests Grid */}
          <div>
            <div className="flex items-center gap-4 mb-10">
              <h2 className="text-4xl font-black bg-gradient-to-r from-orange-600 via-red-600 to-orange-700 bg-clip-text text-transparent flex-1">
                Subtest Tersedia
              </h2>
              <div className="text-2xl font-bold text-orange-600">{subtests.length}</div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {subtests.map((s) => {
                const id = s.subtest_id ?? s.subtestId ?? s.id;
                const name = s.name || s.subtest_name || s.subtestName || "Subtest";
                const isStarting = startingId === id;

                return (
                  <div
                    key={id || name}
                    className="group bg-white/80 backdrop-blur-xl border-2 border-orange-100 rounded-3xl p-8 hover:shadow-3xl hover:border-orange-300 hover:-translate-y-3 transition-all duration-500 shadow-2xl hover:bg-white/95"
                  >
                    <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-red-600 rounded-3xl flex items-center justify-center mb-8 shadow-2xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 mx-auto">
                      <svg className="w-10 h-10 text-white drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                    </div>
                    
                    <h3 className="text-2xl font-bold text-slate-900 mb-4 text-center leading-tight group-hover:text-orange-700 transition-colors">{name}</h3>
                    <p className="text-slate-600 mb-8 text-center leading-relaxed line-clamp-3 px-2">{s.description || "Latihan soal lengkap untuk subtest ini. Mulai sekarang!"}</p>
                    
                    <button
                      onClick={() => onStart(id)}
                      disabled={Boolean(startingId)}
                      className={`w-full py-5 px-8 rounded-2xl font-bold text-lg shadow-2xl transition-all duration-400 transform mx-auto block ${
                        isStarting
                          ? "bg-gradient-to-r from-slate-300 to-slate-400 text-slate-600 cursor-not-allowed shadow-none"
                          : "bg-gradient-to-r from-orange-500 to-red-600 text-white hover:from-orange-600 hover:to-red-700 hover:shadow-3xl hover:-translate-y-2 hover:scale-105 active:scale-95 group-hover:shadow-orange-500/25"
                      }`}
                    >
                      {isStarting ? (
                        <>
                          <div className="inline-flex items-center gap-3">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                            <span>Starting...</span>
                          </div>
                        </>
                      ) : (
                        <>
                          🚀 <span className="tracking-wide">Start Subtest</span>
                        </>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
            
            {subtests.length === 0 && !loading && (
              <div className="text-center py-32">
                <div className="w-32 h-32 bg-gradient-to-br from-orange-200 to-red-200 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl">
                  <svg className="w-20 h-20 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2 2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                </div>
                <h3 className="text-3xl font-black text-slate-700 mb-4">Belum Ada Subtest</h3>
                <p className="text-xl text-slate-600 max-w-lg mx-auto mb-8">Subtest akan tersedia setelah admin menambahkannya. Cek lagi nanti!</p>
                <button 
                  onClick={load}
                  className="px-8 py-4 bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold text-lg rounded-2xl hover:from-orange-600 hover:to-red-700 shadow-2xl hover:shadow-3xl transition-all duration-300"
                >
                  🔄 Refresh
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
