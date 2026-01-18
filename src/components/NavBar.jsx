import { NavLink, useNavigate } from "react-router-dom";
import { logout } from "../api/auth";
import { useAuth } from "../auth/AuthProvider";

const TOKEN_KEY = "ambis_access_token";

export default function NavBar() {
  const nav = useNavigate();
  const { isAuthed, logoutLocal } = useAuth();

  const onLogout = async () => {
    try {
      await logout();
    } catch (_) {
      // ignore
    } finally {
      localStorage.removeItem(TOKEN_KEY);
      logoutLocal();
      nav("/login");
    }
  };

  const linkClass = ({ isActive }) =>
    [
      "px-4 py-3 text-base font-bold rounded-2xl transition-all duration-300 transform hover:-translate-y-0.5 hover:scale-[1.02]",
      isActive
        ? "bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg hover:shadow-xl"
        : "text-slate-700 hover:text-orange-900 hover:bg-orange-100/80 backdrop-blur-sm border border-orange-200/50 hover:border-orange-300/70 shadow-md",
    ].join(" ");

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/90 border-b border-orange-100/50 shadow-lg">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 py-4">
        {/* Logo - sama */}
        <NavLink 
          to="/dashboard" 
          className="group flex items-center gap-3 text-left transition-all duration-300 hover:-translate-x-1"
        >
          <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center shadow-xl group-hover:shadow-2xl group-hover:scale-110 transition-all duration-300 backdrop-blur-sm">
            <span className="text-2xl font-black text-white drop-shadow-lg">MQA</span>
          </div>
          <div className="hidden md:block">
            <div className="text-2xl font-black bg-gradient-to-r from-orange-600 via-red-600 to-orange-700 bg-clip-text text-transparent tracking-tight">
              Mini Quiz Ambis
            </div>
            <div className="text-xs font-semibold text-orange-600 uppercase tracking-wider">
              by Dika Arief Sugiyatna
            </div>
          </div>
        </NavLink>

        {/* Desktop Nav - FIXED dengan Logout */}
        <nav className="hidden md:flex items-center gap-2">
          {isAuthed ? (
            <>
              <NavLink to="/dashboard" className={linkClass}>
                📊 Dashboard
              </NavLink>
              <NavLink to="/quiz" className={linkClass}>
                ⏱️ Quiz
              </NavLink>
              <NavLink to="/history" className={linkClass}>
                📜 History
              </NavLink>
              <NavLink to="/profile" className={linkClass}>
                👤 Profile
              </NavLink>
              <button
                onClick={onLogout}
                className="px-4 py-3 text-base font-bold rounded-2xl bg-gradient-to-r from-red-500 to-orange-600 text-white shadow-lg hover:shadow-xl hover:from-red-600 hover:to-orange-700 transition-all duration-300 transform hover:-translate-y-0.5 hover:scale-[1.02]"
              >
                🚪 Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={linkClass}>
                🔑 Login
              </NavLink>
              <NavLink 
                to="/register" 
                className="px-6 py-3 text-base font-black rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-xl hover:from-emerald-600 hover:to-teal-700 hover:shadow-2xl hover:scale-[1.05] transition-all duration-300 transform active:scale-[0.98] border-0"
              >
                ✨ Daftar Gratis
              </NavLink>
            </>
          )}
        </nav>

        {/* Mobile Buttons - sudah ada logout */}
        <div className="md:hidden flex items-center gap-2">
          {isAuthed ? (
            <button
              onClick={onLogout}
              className="px-4 py-2 bg-gradient-to-r from-red-500 to-orange-600 text-white font-bold text-sm rounded-xl hover:from-red-600 hover:to-orange-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 hover:scale-105 active:scale-95"
            >
              🚪 Logout
            </button>
          ) : (
            <>
              <NavLink 
                to="/login" 
                className="px-4 py-2 text-sm font-bold text-orange-700 bg-orange-100/80 backdrop-blur-sm rounded-xl hover:bg-orange-200 hover:text-orange-900 shadow-md hover:shadow-lg transition-all duration-300"
              >
                Login
              </NavLink>
              <NavLink 
                to="/register"
                className="px-4 py-2 text-sm font-bold bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
              >
                Daftar
              </NavLink>
            </>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button className="md:hidden p-2 rounded-xl hover:bg-orange-100 transition-colors">
          <svg className="w-6 h-6 text-orange-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} stroke="currentColor" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Gradient Underline */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-400 via-red-500 to-orange-500 opacity-60" />
    </header>
  );
}
