import { useState, useMemo, useRef } from "react";
import {
  Printer, Download, Pencil, Check, ChevronDown, BarChart2,
  ArrowLeft, Save, Loader2, FileSpreadsheet,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../../components/common/PageHeader";
import { mockTests, mockStudents } from "../../data/mockData";

// ── Mock tabulation data ──────────────────────────────────────────────────────
const SUBJECTS = ["Mathematics", "English", "Physics", "Chemistry", "Computer"];
const MOCK_MARKS = {
  1:  { Mathematics: 42, English: 28, Physics: 20, Chemistry: 18, Computer: 35 },
  2:  { Mathematics: 38, English: 24, Physics: 17, Chemistry: 15, Computer: 30 },
  3:  { Mathematics: 45, English: 29, Physics: 22, Chemistry: 20, Computer: 38 },
  4:  { Mathematics: 30, English: 20, Physics: 14, Chemistry: 12, Computer: 25 },
  5:  { Mathematics: 48, English: 30, Physics: 24, Chemistry: 21, Computer: 39 },
  6:  { Mathematics: 35, English: 26, Physics: 18, Chemistry: 16, Computer: 28 },
  7:  { Mathematics: 22, English: 18, Physics: 11, Chemistry: 10, Computer: 20 },
  8:  { Mathematics: 40, English: 27, Physics: 21, Chemistry: 19, Computer: 33 },
  9:  { Mathematics: 33, English: 22, Physics: 15, Chemistry: 14, Computer: 27 },
  10: { Mathematics: 47, English: 29, Physics: 23, Chemistry: 20, Computer: 37 },
};
const MAX_PER_SUBJECT = { Mathematics: 50, English: 30, Physics: 25, Chemistry: 25, Computer: 40 };
const TOTAL_MAX = Object.values(MAX_PER_SUBJECT).reduce((a, b) => a + b, 0);

function gradeFromPct(pct) {
  if (pct >= 90) return "A+";
  if (pct >= 80) return "A";
  if (pct >= 70) return "B+";
  if (pct >= 60) return "B";
  if (pct >= 50) return "C";
  if (pct >= 33) return "D";
  return "F";
}

function gradeColor(g) {
  if (["A+","A"].includes(g)) return "text-green-600 dark:text-green-400";
  if (["B+","B"].includes(g)) return "text-blue-600 dark:text-blue-400";
  if (g === "C") return "text-amber-600 dark:text-amber-400";
  if (g === "D") return "text-orange-500";
  return "text-red-500";
}

function buildRows(students, marks) {
  return students.map((s) => {
    const subjectMarks = marks[s.id] || {};
    const total = Object.values(subjectMarks).reduce((a, b) => a + b, 0);
    const pct   = TOTAL_MAX > 0 ? Math.round((total / TOTAL_MAX) * 100) : 0;
    const grade = gradeFromPct(pct);
    return { ...s, subjectMarks, total, pct, grade, pass: pct >= 33 };
  });
}

// ── Main Component ────────────────────────────────────────────────────────────
function TestTabulation() {
  const navigate  = useNavigate();
  const printRef  = useRef(null);

  const students  = mockStudents.slice(0, 10);
  const [editMode, setEditMode]     = useState(false);
  const [editMarks, setEditMarks]   = useState(() => ({ ...MOCK_MARKS }));
  const [saving, setSaving]         = useState(false);
  const [selectedClass, setClass]   = useState("9-A");
  const [sortBy, setSortBy]         = useState("rank"); // rank | name | total
  const [combined, setCombined]     = useState(false);
  const [selectedTest, setTest]     = useState(mockTests[0].id);

  const rows = useMemo(() => buildRows(students, editMarks), [students, editMarks]);

  const sorted = useMemo(() => {
    const r = [...rows];
    if (sortBy === "rank")  r.sort((a, b) => b.total - a.total);
    if (sortBy === "name")  r.sort((a, b) => a.name.localeCompare(b.name));
    if (sortBy === "total") r.sort((a, b) => b.total - a.total);
    return r.map((s, i) => ({ ...s, rank: i + 1 }));
  }, [rows, sortBy]);

  // Class summary
  const summary = useMemo(() => {
    const pcts = sorted.map((s) => s.pct);
    return {
      avg:     Math.round(pcts.reduce((a, b) => a + b, 0) / pcts.length),
      highest: Math.max(...pcts),
      lowest:  Math.min(...pcts),
      passing: sorted.filter((s) => s.pass).length,
    };
  }, [sorted]);

  const handleMarkEdit = (studentId, subject, value) => {
    const max = MAX_PER_SUBJECT[subject] || 100;
    const clamped = Math.min(Math.max(0, Number(value) || 0), max);
    setEditMarks((prev) => ({
      ...prev,
      [studentId]: { ...prev[studentId], [subject]: clamped },
    }));
  };

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => { setSaving(false); setEditMode(false); }, 600);
  };

  const handlePrint = () => {
    const content = printRef.current?.innerHTML;
    const w = window.open("", "_blank");
    w.document.write(`
      <html><head><title>Test Tabulation</title>
      <style>
        body{font-family:Arial,sans-serif;font-size:12px;padding:20px;color:#111}
        h1{font-size:16px;margin-bottom:4px}
        table{width:100%;border-collapse:collapse;margin-top:12px}
        th,td{border:1px solid #ccc;padding:5px 8px;text-align:center}
        th{background:#f0f0f0;font-weight:600}
        .pass{color:green}.fail{color:red}.muted{color:#666;font-size:11px}
        @media print{.no-print{display:none}}
      </style></head>
      <body>${content}</body></html>
    `);
    w.document.close();
    w.print();
  };

  const exportCSV = () => {
    const header = ["Rank","Roll No","Name", ...SUBJECTS,"Total","Pct","Grade","Result"];
    const csvRows = sorted.map((s) => [
      s.rank, s.rollNo, s.name,
      ...SUBJECTS.map((sub) => s.subjectMarks[sub] ?? ""),
      s.total, `${s.pct}%`, s.grade, s.pass ? "Pass" : "Fail",
    ]);
    const csv = [header, ...csvRows].map((r) => r.join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    const a = document.createElement("a"); a.href = url; a.download = "tabulation.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col gap-5">
      <PageHeader
        title="Test Tabulation"
        subtitle="Consolidated result sheet — edit, print, or export"
        action={
          <div className="flex items-center gap-2 flex-wrap">
            <button onClick={() => navigate(-1)} className="flex items-center gap-2 px-3 py-2 rounded-lg border border-light-border dark:border-dark-border bg-light-card dark:bg-dark-card text-sm text-light-text-secondary dark:text-dark-text-secondary hover:bg-light-hover dark:hover:bg-dark-hover transition-colors">
              <ArrowLeft size={15} /> Back
            </button>
            {editMode ? (
              <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-4 py-2 bg-accent hover:bg-accent-hover text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-70">
                {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
                {saving ? "Saving…" : "Save Changes"}
              </button>
            ) : (
              <button onClick={() => setEditMode(true)} className="flex items-center gap-2 px-3 py-2 rounded-lg border border-light-border dark:border-dark-border bg-light-card dark:bg-dark-card text-sm text-light-text-secondary dark:text-dark-text-secondary hover:bg-light-hover dark:hover:bg-dark-hover transition-colors">
                <Pencil size={15} /> Edit Marks
              </button>
            )}
            <button onClick={handlePrint} className="flex items-center gap-2 px-3 py-2 rounded-lg border border-light-border dark:border-dark-border bg-light-card dark:bg-dark-card text-sm text-light-text-secondary dark:text-dark-text-secondary hover:bg-light-hover dark:hover:bg-dark-hover transition-colors">
              <Printer size={15} /> Print
            </button>
            <button onClick={exportCSV} className="flex items-center gap-2 px-3 py-2 rounded-lg border border-light-border dark:border-dark-border bg-light-card dark:bg-dark-card text-sm text-light-text-secondary dark:text-dark-text-secondary hover:bg-light-hover dark:hover:bg-dark-hover transition-colors">
              <FileSpreadsheet size={15} /> Export CSV
            </button>
          </div>
        }
      />

      {/* Controls row */}
      <div className="flex flex-wrap gap-3 items-center">
        <select value={selectedClass} onChange={(e) => setClass(e.target.value)} className="px-3 py-2 rounded-lg border border-light-border dark:border-dark-border bg-light-card dark:bg-dark-card text-sm text-light-text-primary dark:text-dark-text-primary outline-none focus:border-accent transition-colors">
          {["9-A","9-B","10-A","10-B","11-A","11-B"].map((c) => <option key={c}>{c}</option>)}
        </select>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="px-3 py-2 rounded-lg border border-light-border dark:border-dark-border bg-light-card dark:bg-dark-card text-sm text-light-text-primary dark:text-dark-text-primary outline-none focus:border-accent transition-colors">
          <option value="rank">Sort by Rank</option>
          <option value="name">Sort by Name</option>
          <option value="total">Sort by Total</option>
        </select>
        <button
          onClick={() => setCombined((p) => !p)}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${combined ? "bg-accent text-white border-accent" : "border-light-border dark:border-dark-border bg-light-card dark:bg-dark-card text-light-text-secondary dark:text-dark-text-secondary hover:bg-light-hover dark:hover:bg-dark-hover"}`}
        >
          <BarChart2 size={14} /> Combined View
        </button>
      </div>

      {/* Class summary strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Class Average", value: `${summary.avg}%`,       color: "text-accent" },
          { label: "Highest",       value: `${summary.highest}%`,   color: "text-green-600 dark:text-green-400" },
          { label: "Lowest",        value: `${summary.lowest}%`,    color: "text-red-500" },
          { label: "Pass Rate",     value: `${summary.passing}/${sorted.length}`, color: "text-blue-600 dark:text-blue-400" },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl p-3 text-center">
            <p className={`text-lg font-bold ${color}`}>{value}</p>
            <p className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Tabulation sheet */}
      <div ref={printRef} className="bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl overflow-hidden">
        {/* Print header (visible in print only) */}
        <div className="px-5 py-4 border-b border-light-border dark:border-dark-border">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-light-text-primary dark:text-dark-text-primary">
                Test Result Tabulation — Class {selectedClass}
              </h2>
              <p className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary mt-0.5">
                Session 2025–26 · {new Date().toLocaleDateString()}
                {editMode && <span className="ml-2 text-accent font-medium">· Edit Mode</span>}
              </p>
            </div>
            {editMode && (
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-medium">
                <Pencil size={11} /> Editing
              </span>
            )}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm" style={{ minWidth: combined ? "900px" : "700px" }}>
            <thead>
              <tr className="border-b border-light-border dark:border-dark-border bg-light-hover dark:bg-dark-hover">
                <th className="px-3 py-2.5 text-left text-xs font-medium text-light-text-tertiary dark:text-dark-text-tertiary uppercase w-10">Rank</th>
                <th className="px-3 py-2.5 text-left text-xs font-medium text-light-text-tertiary dark:text-dark-text-tertiary uppercase">Roll No</th>
                <th className="px-3 py-2.5 text-left text-xs font-medium text-light-text-tertiary dark:text-dark-text-tertiary uppercase">Student Name</th>
                {combined && SUBJECTS.map((sub) => (
                  <th key={sub} className="px-2 py-2.5 text-center text-xs font-medium text-light-text-tertiary dark:text-dark-text-tertiary uppercase">
                    {sub.slice(0, 4)}<br />
                    <span className="text-light-text-tertiary dark:text-dark-text-tertiary font-normal normal-case">/{MAX_PER_SUBJECT[sub]}</span>
                  </th>
                ))}
                <th className="px-3 py-2.5 text-center text-xs font-medium text-light-text-tertiary dark:text-dark-text-tertiary uppercase">Total<br /><span className="font-normal normal-case">/{TOTAL_MAX}</span></th>
                <th className="px-3 py-2.5 text-center text-xs font-medium text-light-text-tertiary dark:text-dark-text-tertiary uppercase">%</th>
                <th className="px-3 py-2.5 text-center text-xs font-medium text-light-text-tertiary dark:text-dark-text-tertiary uppercase">Grade</th>
                <th className="px-3 py-2.5 text-center text-xs font-medium text-light-text-tertiary dark:text-dark-text-tertiary uppercase">Result</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((s) => {
                const gradeStr = gradeFromPct(s.pct);
                return (
                  <tr
                    key={s.id}
                    className={`border-b border-light-border dark:border-dark-border last:border-0 transition-colors ${
                      s.rank === 1 ? "bg-yellow-50/60 dark:bg-yellow-950/20" :
                      !s.pass ? "bg-red-50/30 dark:bg-red-950/10" :
                      "hover:bg-light-hover dark:hover:bg-dark-hover"
                    }`}
                  >
                    {/* Rank */}
                    <td className="px-3 py-2.5 text-center">
                      {s.rank === 1 ? <span className="text-base">🥇</span> :
                       s.rank === 2 ? <span className="text-base">🥈</span> :
                       s.rank === 3 ? <span className="text-base">🥉</span> :
                       <span className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary">{s.rank}</span>}
                    </td>

                    <td className="px-3 py-2.5 text-xs font-mono text-light-text-tertiary dark:text-dark-text-tertiary">{s.rollNo}</td>
                    <td className="px-3 py-2.5 font-medium text-light-text-primary dark:text-dark-text-primary whitespace-nowrap">{s.name}</td>

                    {/* Subject marks (combined view or edit mode) */}
                    {combined && SUBJECTS.map((sub) => (
                      <td key={sub} className="px-2 py-2.5 text-center">
                        {editMode ? (
                          <input
                            type="number"
                            min="0"
                            max={MAX_PER_SUBJECT[sub]}
                            value={editMarks[s.id]?.[sub] ?? ""}
                            onChange={(e) => handleMarkEdit(s.id, sub, e.target.value)}
                            className="w-12 rounded border border-light-border dark:border-dark-border bg-light-bg dark:bg-dark-bg px-1 py-1 text-xs text-center text-light-text-primary dark:text-dark-text-primary outline-none focus:border-accent transition-colors"
                          />
                        ) : (
                          <span className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                            {s.subjectMarks[sub] ?? "—"}
                          </span>
                        )}
                      </td>
                    ))}

                    {/* Total */}
                    <td className="px-3 py-2.5 text-center font-semibold text-light-text-primary dark:text-dark-text-primary">{s.total}</td>

                    {/* Percentage */}
                    <td className="px-3 py-2.5 text-center">
                      <div className="flex flex-col items-center gap-1">
                        <span className="text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary">{s.pct}%</span>
                        <div className="w-16 h-1 bg-light-hover dark:bg-dark-hover rounded-full overflow-hidden">
                          <div
                            className={`h-1 rounded-full ${s.pct >= 80 ? "bg-green-500" : s.pct >= 50 ? "bg-amber-500" : "bg-red-500"}`}
                            style={{ width: `${s.pct}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    {/* Grade */}
                    <td className="px-3 py-2.5 text-center">
                      <span className={`text-sm font-bold ${gradeColor(gradeStr)}`}>{gradeStr}</span>
                    </td>

                    {/* Result */}
                    <td className="px-3 py-2.5 text-center">
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                        s.pass ? "bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-400" : "bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-400"
                      }`}>
                        {s.pass ? "Pass" : "Fail"}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            {/* Totals footer */}
            <tfoot>
              <tr className="border-t-2 border-light-border dark:border-dark-border bg-light-hover dark:bg-dark-hover">
                <td colSpan={3} className="px-3 py-2.5 text-xs font-semibold text-light-text-secondary dark:text-dark-text-secondary">
                  Class Average
                </td>
                {combined && SUBJECTS.map((sub) => (
                  <td key={sub} className="px-2 py-2.5 text-center text-xs font-semibold text-light-text-secondary dark:text-dark-text-secondary">
                    {Math.round(sorted.reduce((acc, s) => acc + (s.subjectMarks[sub] || 0), 0) / sorted.length)}
                  </td>
                ))}
                <td className="px-3 py-2.5 text-center text-xs font-semibold text-accent">
                  {Math.round(sorted.reduce((acc, s) => acc + s.total, 0) / sorted.length)}
                </td>
                <td className="px-3 py-2.5 text-center text-xs font-semibold text-accent">{summary.avg}%</td>
                <td colSpan={2} className="px-3 py-2.5 text-center text-xs text-light-text-tertiary dark:text-dark-text-tertiary">
                  {summary.passing}/{sorted.length} passed
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}

export default TestTabulation;