import React, { createContext, useContext, useMemo, useState } from "react";

const AuthContext = createContext(null);
const TOKEN_KEY = "ambis_access_token";

export function AuthProvider({ children }) {
  const [token, _setToken] = useState(() => localStorage.getItem(TOKEN_KEY));

  const setToken = (t) => {
    _setToken(t);
    if (t) localStorage.setItem(TOKEN_KEY, t);
    else localStorage.removeItem(TOKEN_KEY);
  };

  const value = useMemo(
    () => ({
      token,
      isAuthed: !!token,
      setToken,
      logoutLocal: () => setToken(null),
    }),
    [token]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
