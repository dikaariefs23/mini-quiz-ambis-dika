import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { changePassword, getProfile, updateProfile } from "../api/profile";

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [msg, setMsg] = useState("");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const load = async () => {
    setLoading(true);
    setErr("");
    setMsg("");
    try {
      const res = await getProfile();
      const d = res?.data?.data || res?.data;
      setName(d?.name || "");
      setEmail(d?.email || "");
    } catch (e) {
      setErr(e?.response?.data?.error || e?.message || "Gagal load profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const onSaveProfile = async () => {
    setErr("");
    setMsg("");
    try {
      await updateProfile({ name, email });
      setMsg("Profile berhasil diupdate!");
    } catch (e) {
      setErr(e?.response?.data?.error || e?.message || "Update profile gagal");
    }
  };

  const onChangePassword = async () => {
    setErr("");
    setMsg("");
    try {
      await changePassword({ old_password: oldPassword, new_password: newPassword });
      setMsg("Password berhasil diupdate!");
      setOldPassword("");
      setNewPassword("");
    } catch (e) {
      setErr(e?.response?.data?.error || e?.message || "Ganti password gagal");
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-red-50 py-12">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header - FIXED PUTIH */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-3 bg-gradient-to-r from-orange-500 to-red-600 px-8 py-4 rounded-3xl shadow-2xl mb-6 backdrop-blur-sm">
              <div className="w-14 h-14 bg-white/20 rounded-3xl flex items-center justify-center backdrop-blur-sm">
                <span className="text-2xl font-black text-white drop-shadow-lg">MQA</span>
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-black text-white drop-shadow-2xl tracking-tight">
                  Mini Quiz Ambis
                </h1>
                <p className="text-sm font-semibold text-orange-100 tracking-wide uppercase">by Dika Arief Sugiyatna</p>
              </div>
            </div>
            <p className="text-xl md:text-2xl text-slate-700 font-semibold max-w-2xl mx-auto leading-relaxed">
              Kelola profil dan keamanan akunmu dengan mudah
            </p>
          </div>

          {/* Quick Stats - sama */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="bg-white/80 backdrop-blur-xl p-8 rounded-3xl border border-orange-100 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-black text-slate-900 text-center mb-6">Profil Saya</h3>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Nama Lengkap</label>
                  <input 
                    value={name} 
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 border border-orange-200 rounded-2xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 bg-white/50 backdrop-blur-sm text-lg placeholder-slate-400"
                    placeholder="Masukkan nama lengkap"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Email</label>
                  <input 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 border border-orange-200 rounded-2xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 bg-white/50 backdrop-blur-sm text-lg placeholder-slate-400"
                    placeholder="example@email.com"
                  />
                </div>
                <button 
                  onClick={onSaveProfile}
                  className="w-full py-4 px-8 bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold text-lg rounded-2xl hover:from-orange-600 hover:to-red-700 shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-105"
                >
                  💾 Simpan Profil
                </button>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-xl p-8 rounded-3xl border border-orange-100 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-2xl font-black text-slate-900 text-center mb-6">Ubah Password</h3>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Password Lama</label>
                  <input 
                    type="password"
                    value={oldPassword} 
                    onChange={(e) => setOldPassword(e.target.value)}
                    className="w-full px-4 py-3 border border-orange-200 rounded-2xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 bg-white/50 backdrop-blur-sm text-lg placeholder-slate-400"
                    placeholder="Masukkan password lama"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Password Baru</label>
                  <input 
                    type="password"
                    value={newPassword} 
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-3 border border-orange-200 rounded-2xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 bg-white/50 backdrop-blur-sm text-lg placeholder-slate-400"
                    placeholder="Masukkan password baru"
                  />
                </div>
                <button 
                  onClick={onChangePassword}
                  className="w-full py-4 px-8 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold text-lg rounded-2xl hover:from-amber-600 hover:to-orange-700 shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-105"
                >
                  🔐 Update Password
                </button>
              </div>
            </div>
          </div>

          {/* Alerts - sama */}
          {err ? (
            <div className="max-w-2xl mx-auto mb-12 p-8 bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-200 rounded-3xl shadow-xl animate-pulse">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center p-3">
                  <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <span className="font-semibold text-lg text-red-800 leading-relaxed">{err}</span>
              </div>
            </div>
          ) : null}
          
          {msg ? (
            <div className="max-w-2xl mx-auto mb-12 p-8 bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-200 rounded-3xl shadow-xl">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center p-3">
                  <svg className="w-6 h-6 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="font-semibold text-lg text-emerald-800 leading-relaxed">{msg}</span>
              </div>
            </div>
          ) : null}

          {loading ? (
            <div className="flex justify-center py-24">
              <div className="flex items-center gap-4 text-orange-600">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
                <span className="text-xl font-semibold">Loading Profile...</span>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </Layout>
  );
}
