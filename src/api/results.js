import { http } from "../lib/http";

export const getHistory = (params) => http.get("/quiz/history", { params }); 
export const getResult = (sessionId) => http.get(`/quiz/result/${sessionId}`);
