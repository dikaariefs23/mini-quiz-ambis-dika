import { http } from "../lib/http";

export const register = (payload) => http.post("/auth/register", payload);
export const login = (payload) => http.post("/auth/login", payload);
export const verifyEmail = (payload) => http.post("/auth/verify-email", payload);
export const logout = () => http.post("/auth/logout");
export const getProfile = () => http.get("/auth/profile");
export const updateProfile = (payload) => http.put("/auth/profile", payload);
export const changePassword = (payload) => http.post("/auth/change-password", payload);
