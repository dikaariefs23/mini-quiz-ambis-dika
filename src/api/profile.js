import { http } from "../lib/http";

export const getProfile = () => http.get("/auth/profile"); 
export const updateProfile = (payload) => http.put("/auth/profile", payload); 
export const changePassword = (payload) => http.post("/auth/change-password", payload); 
