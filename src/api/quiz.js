import { http } from "../lib/http";


export const getSubtests = () => http.get("/subtests"); 


export const startQuiz = (subtestId) => http.get(`/quiz/start/${subtestId}`); 
export const getActiveQuiz = () => http.get("/quiz/active");


export const submitQuiz = (answers) => http.post("/quiz/submit", { answers });


export const getHistory = (params = { limit: 10, offset: 0 }) =>
  http.get("/quiz/history", { params });

export const getResult = (sessionId) => http.get(`/quiz/result/${sessionId}`);
