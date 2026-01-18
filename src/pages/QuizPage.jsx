import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { getActiveQuiz, submitQuiz } from "../api/quiz";
import { logout as apiLogout } from "../api/auth";
import { useAuth } from "../auth/AuthProvider";

const TOKEN_KEY = "ambis_access_token";

export default function QuizPage() {
  const nav = useNavigate();
  const { logoutLocal } = useAuth();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState("");
  const [info, setInfo] = useState("");
  const [session, setSession] = useState(null);
  const [answers, setAnswers] = useState({});

  const pickErrorMessage = (data, fallback) => {
    if (!data) return fallback;
    if (typeof data === "string") return data;
    if (data?.error?.message) return data.error.message;
    if (typeof data?.error === "string") return data.error;
    if (data?.message) return data.message;
    return fallback;
  };

  // --- timer: berdasarkan expires_at (sesuai brief) ---
  const expiresAt = useMemo(() => {
    const raw =
      session?.expiresAt ||
      session?.expires_at ||
      session?.expiresat ||
      session?.data?.expiresAt ||
      session?.data?.expires_at ||
      session?.data?.expiresat;

    return raw ? new Date(raw).getTime() : null;
  }, [session]);

  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  const leftSec = expiresAt ? Math.max(0, Math.floor((expiresAt - now) / 1000)) : null;
  const isExpired = leftSec === 0;

  // --- load active quiz (resume) ---
  const load = async () => {
    setLoading(true);
    setErr("");
    setInfo("");
    try {
      const res = await getActiveQuiz(); // GET /quiz/active [file:46]
      const data = res?.data?.data || res?.data || null;
      setSession(data);
      setAnswers({});
    } catch (e) {
      const status = e?.response?.status;
      const data = e?.response?.data;

      if (status === 401) {
        setErr("Session kamu habis/invalid. Silakan login ulang.");
      } else {
        setErr(pickErrorMessage(data, e?.message || "Gagal load active quiz"));
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  // AUTO BALIK: kalau expired, jangan stay di Quiz (biar statusnya tampil di Dashboard)
  useEffect(() => {
    if (session && isExpired) {
      nav("/dashboard");
    }
  }, [session, isExpired, nav]);

  const questions = session?.questions || session?.data?.questions || [];

  const onPick = (qNum, opt) => {
    if (isExpired) return;
    setAnswers((prev) => ({ ...prev, [qNum]: opt }));
  };

  const onLogout = async () => {
    try {
      await apiLogout(); // POST /auth/logout [file:46]
    } catch (_) {
      // ignore
    } finally {
      localStorage.removeItem(TOKEN_KEY);
      logoutLocal?.();
      nav("/login");
    }
  };

  const onSubmit = async () => {
    setErr("");
    setInfo("");

    if (!session) {
      setErr("Tidak ada sesi quiz aktif.");
      return;
    }

    // waktu habis => tidak bisa submit (sesuai brief) [file:46]
    if (isExpired) {
      setErr("Waktu sudah habis. Sesi expired dan tidak bisa submit.");
      return;
    }

    if (!answers || Object.keys(answers).length === 0) {
      setErr("Pilih minimal 1 jawaban sebelum submit.");
      return;
    }

    setSubmitting(true);
    try {
      await submitQuiz(answers); // POST /quiz/submit { answers } [file:46]
      setInfo("Submit berhasil. Membuka History...");
      nav("/history");
    } catch (e) {
      const data = e?.response?.data;
      setErr(pickErrorMessage(data, e?.message || "Gagal submit"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Layout>
      <h2 style={{ marginTop: 0 }}>Quiz</h2>

      {loading ? <div>Loading...</div> : null}
      {err ? <div style={{ color: "crimson", marginBottom: 12 }}>{String(err)}</div> : null}
      {info ? <div style={{ color: "#065f46", marginBottom: 12 }}>{String(info)}</div> : null}

      {!loading && !session ? (
        <div style={{ color: "#555" }}>
          Tidak ada sesi quiz aktif. Kembali ke Dashboard dan klik Start.
        </div>
      ) : null}

      {!loading && session ? (
        <div style={{ background: "white", borderRadius: 12, padding: 14, border: "1px solid #eee" }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
            <div>
              <b>Subtest:</b> {session?.subtest_name || session?.subtestName || "-"}
            </div>
            <div>
              <b>Timer:</b> {leftSec !== null ? `${leftSec}s` : "-"}
            </div>
          </div>

          {/* Fallback aja: harusnya udah redirect ke dashboard kalau expired */}
          {isExpired ? (
            <div
              style={{
                marginTop: 12,
                background: "#fff7ed",
                border: "1px solid #fed7aa",
                padding: 12,
                borderRadius: 10,
              }}
            >
              <div style={{ fontWeight: 700, color: "#9a3412" }}>Waktu habis (expired).</div>
              <div style={{ color: "#9a3412", marginTop: 4 }}>
                Sesi ini sudah tidak bisa disubmit. Mengarahkan ke Dashboard...
              </div>

              <div style={{ display: "flex", gap: 8, marginTop: 10, flexWrap: "wrap" }}>
                <button
                  onClick={() => nav("/dashboard")}
                  style={{
                    padding: "8px 10px",
                    borderRadius: 8,
                    border: "1px solid #111827",
                    background: "#111827",
                    color: "white",
                  }}
                >
                  Back to Dashboard
                </button>
                <button
                  onClick={load}
                  style={{ padding: "8px 10px", borderRadius: 8, border: "1px solid #9a3412", background: "white" }}
                >
                  Refresh session
                </button>
                <button
                  onClick={onLogout}
                  style={{ padding: "8px 10px", borderRadius: 8, border: "1px solid #9a3412", background: "white" }}
                >
                  Logout
                </button>
              </div>
            </div>
          ) : null}

          <div style={{ marginTop: 14, display: "grid", gap: 12, opacity: isExpired ? 0.6 : 1 }}>
            {questions.map((q) => {
              const num = q.question_number ?? q.questionNumber ?? q.number;
              const text = q.question_text ?? q.questionText ?? q.text;
              const options = q.options || [];

              return (
                <div key={num} style={{ padding: 12, border: "1px solid #eee", borderRadius: 12 }}>
                  <div style={{ fontWeight: 700, marginBottom: 8 }}>
                    {num}. {text}
                  </div>

                  <div style={{ display: "grid", gap: 8 }}>
                    {options.map((opt) => (
                      <label key={opt} style={{ display: "flex", gap: 8, alignItems: "center" }}>
                        <input
                          type="radio"
                          name={`q-${num}`}
                          checked={answers[num] === opt}
                          disabled={isExpired}
                          onChange={() => onPick(num, opt)}
                        />
                        <span>{opt}</span>
                      </label>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          <button
            onClick={onSubmit}
            disabled={submitting || isExpired}
            style={{
              marginTop: 14,
              width: "100%",
              padding: 10,
              borderRadius: 8,
              border: "none",
              background: "#111827",
              color: "white",
              cursor: submitting || isExpired ? "not-allowed" : "pointer",
              opacity: submitting || isExpired ? 0.7 : 1,
            }}
          >
            {submitting ? "Submitting..." : "Submit"}
          </button>
        </div>
      ) : null}
    </Layout>
  );
}
