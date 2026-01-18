import NavBar from "./NavBar";

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50/50 to-red-50/70">
      <NavBar />
      
      <main className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8 lg:py-12 relative z-10">
        {children}
      </main>
      
      {/* Floating Decorations */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-orange-400/20 to-red-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-amber-300/20 via-orange-400/10 to-red-400/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-10 w-64 h-64 bg-gradient-to-r from-emerald-300/10 to-teal-300/10 rounded-full blur-xl animate-pulse delay-2000" />
      </div>
    </div>
  );
}
