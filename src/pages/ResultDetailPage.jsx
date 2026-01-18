import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Layout from "../components/Layout";
import { getResult } from "../api/quiz";

function pickResult(raw) {
  const d = raw?.data?.data ?? raw?.data ?? raw ?? null;
  return d?.result ?? d;
}

export default function ResultDetailPage() {
  const { sessionId } = useParams();
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [result, setResult] = useState(null);

  const load = async () => {
    setLoading(true);
    setErr("");
    try {
      const res = await getResult(sessionId); 
      setResult(pickResult(res));
    } catch (e) {
      const status = e?.response?.status;
      const data = e?.response?.data;
      if (status === 401) setErr("Session kamu habis/invalid. Silakan login ulang.");
      else setErr(data?.error || data?.message || e?.message || "Gagal load result detail");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [sessionId]);

  const meta = useMemo(() => {
    const r = result || {};
    return {
      session_id: r.session_id || r.sessionId || sessionId,
      subtest_name: r.subtest_name || r.subtestName || "-",
      score: r.score ?? "-",
      percentage: r.percentage ?? null,
      total_questions: r.total_questions ?? r.totalQuestions ?? null,
      correct_answers: r.correct_answers ?? r.correctAnswers ?? null,
      total_time_seconds: r.total_time_seconds ?? r.totalTimeSeconds ?? null,
      avg_time: r.average_time_per_question ?? r.avgTimePerQuestion ?? null,
      completed_at: r.completed_at || r.completedAt || null,
      created_at: r.created_at || r.createdAt || null,
    };
  }, [result, sessionId]);

  return (
    <Layout>
      <div className="flex justify-between items-center gap-4 flex-wrap mb-6">
        <h2 className="text-2xl font-bold text-gray-900 m-0">Result Detail</h2>
        <Link to="/history" className="text-indigo-600 hover:text-indigo-500 font-medium flex items-center gap-1">
          ← Back to History
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      ) : null}

      {err ? (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-6">
          {String(err)}
        </div>
      ) : null}

      {!loading && result ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="space-y-4">
            {/* Header Row */}
            <div className="flex justify-between items-start gap-4 flex-wrap">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">{meta.subtest_name}</h3>
                <p className="text-sm text-gray-500">Session: {meta.session_id}</p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-indigo-600">{meta.score}</div>
                {meta.percentage !== null && (
                  <div className="text-sm text-gray-600 mt-1">{meta.percentage}%</div>
                )}
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
              {meta.correct_answers !== null && meta.total_questions !== null ? (
                <div className="bg-indigo-50 p-3 rounded-lg border border-indigo-100">
                  <div className="text-2xl font-bold text-indigo-700">{meta.correct_answers}/{meta.total_questions}</div>
                  <div className="text-indigo-600 font-medium">Correct Answers</div>
                </div>
              ) : null}
              {meta.total_time_seconds !== null ? (
                <div className="bg-green-50 p-3 rounded-lg border border-green-100">
                  <div className="text-2xl font-bold text-green-700">{meta.total_time_seconds}s</div>
                  <div className="text-green-600 font-medium">Total Time</div>
                </div>
              ) : null}
              {meta.avg_time !== null ? (
                <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                  <div className="text-2xl font-bold text-blue-700">{meta.avg_time}s</div>
                  <div className="text-blue-600 font-medium">Avg per Question</div>
                </div>
              ) : null}
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                <div className="text-2xl font-bold text-gray-700">
                  {meta.completed_at ? new Date(meta.completed_at).toLocaleDateString('id-ID') : '-'}
                </div>
                <div className="text-gray-600 font-medium">Completed</div>
              </div>
            </div>

            {/* Timestamps */}
            <div className="text-xs text-gray-500 space-y-1 pt-2 border-t border-gray-100">
              {meta.completed_at ? (
                <div>Completed: {new Date(meta.completed_at).toLocaleString('id-ID')}</div>
              ) : null}
              {meta.created_at ? (
                <div>Created: {new Date(meta.created_at).toLocaleString('id-ID')}</div>
              ) : null}
            </div>

            {/* Debug */}
            <details className="mt-6 pt-4 border-t border-gray-200">
              <summary className="cursor-pointer text-sm font-medium text-gray-700 mb-2">Raw JSON (debug)</summary>
              <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg text-xs overflow-auto max-h-60">
                {JSON.stringify(result, null, 2)}
              </pre>
            </details>
          </div>
        </div>
      ) : null}

      {!loading && !result && !err ? (
        <div className="text-center py-12 text-gray-500">Data result tidak ditemukan.</div>
      ) : null}
    </Layout>
  );
}
