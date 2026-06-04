import { useState, useRef, useCallback, useMemo } from "react";
import {
  ArrowLeft,
  Save,
  Upload,
  Download,
  Check,
  Loader2,
  AlertCircle,
  Search,
  Keyboard,
  ChevronDown,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../../components/common/PageHeader";
import { mockExams, mockStudents } from "../../data/mockData";

// ── Helpers ───────────────────────────────────────────────────────────────────
function gradeFromPct(pct) {
  if (pct >= 90)
    return {
      g: "A+",
      bg: "bg-green-100 dark:bg-green-950",
      text: "text-green-700 dark:text-green-400",
    };
  if (pct >= 80)
    return {
      g: "A",
      bg: "bg-green-100 dark:bg-green-950",
      text: "text-green-700 dark:text-green-400",
    };
  if (pct >= 70)
    return {
      g: "B+",
      bg: "bg-blue-100 dark:bg-blue-950",
      text: "text-blue-700 dark:text-blue-400",
    };
  if (pct >= 60)
    return {
      g: "B",
      bg: "bg-blue-100 dark:bg-blue-950",
      text: "text-blue-700 dark:text-blue-400",
    };
  if (pct >= 50)
    return {
      g: "C",
      bg: "bg-amber-100 dark:bg-amber-950",
      text: "text-amber-700 dark:text-amber-400",
    };
  if (pct >= 33)
    return {
      g: "D",
      bg: "bg-orange-100 dark:bg-orange-950",
      text: "text-orange-700 dark:text-orange-400",
    };
  return {
    g: "F",
    bg: "bg-red-100 dark:bg-red-950",
    text: "text-red-700 dark:text-red-400",
  };
}

const PASSING_PCT = 33;
const MAX_MARKS = 100;

function buildRows(students) {
  return students.map((s) => ({
    id: s.id,
    rollNo: s.rollNo,
    name: s.name,
    marks: "",
    absent: false,
  }));
}

// ── Main Component ────────────────────────────────────────────────────────────
function ExamMarksEntry() {
  const navigate = useNavigate();
  const fileRef = useRef(null);

  const [selectedExamId, setExamId] = useState(mockExams[0].id);
  const exam = useMemo(
    () => mockExams.find((e) => e.id === selectedExamId),
    [selectedExamId],
  );

  const [rows, setRows] = useState(() => buildRows(mockStudents.slice(0, 10)));
  const [search, setSearch] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [csvError, setCsvError] = useState("");

  const handleExamChange = (id) => {
    setExamId(Number(id));
    setRows(buildRows(mockStudents.slice(0, 10)));
    setSaved(false);
  };

  const stats = useMemo(() => {
    const entered = rows.filter((r) => !r.absent && r.marks !== "");
    const passing = entered.filter(
      (r) => (Number(r.marks) / MAX_MARKS) * 100 >= PASSING_PCT,
    );
    const avg = entered.length
      ? Math.round(
          entered.reduce((s, r) => s + Number(r.marks), 0) / entered.length,
        )
      : 0;
    const highest = entered.length
      ? Math.max(...entered.map((r) => Number(r.marks)))
      : 0;
    const lowest = entered.length
      ? Math.min(...entered.map((r) => Number(r.marks)))
      : 0;
    return {
      total: rows.length,
      entered: entered.length,
      passing: passing.length,
      avg,
      highest,
      lowest,
    };
  }, [rows]);

  const filtered = useMemo(() => {
    if (!search) return rows;
    const q = search.toLowerCase();
    return rows.filter(
      (r) =>
        r.name.toLowerCase().includes(q) || r.rollNo.toLowerCase().includes(q),
    );
  }, [rows, search]);

  const updateMarks = useCallback((id, value) => {
    let v = value.replace(/[^0-9.]/g, "");
    if (v !== "" && Number(v) > MAX_MARKS) v = String(MAX_MARKS);
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, marks: v } : r)));
    setSaved(false);
  }, []);

  const toggleAbsent = (id) => {
    setRows((prev) =>
      prev.map((r) =>
        r.id === id
          ? { ...r, absent: !r.absent, marks: !r.absent ? "" : r.marks }
          : r,
      ),
    );
    setSaved(false);
  };

  const cellRefs = useRef({});
  const handleKeyDown = (e, id) => {
    const ids = filtered.map((r) => r.id);
    const idx = ids.indexOf(id);
    if ((e.key === "Tab" && !e.shiftKey) || e.key === "Enter") {
      e.preventDefault();
      const next = ids[idx + 1];
      if (next) cellRefs.current[next]?.focus();
    } else if (e.key === "Tab" && e.shiftKey) {
      e.preventDefault();
      const prev = ids[idx - 1];
      if (prev) cellRefs.current[prev]?.focus();
    }
  };

  const handlePaste = (e, startId) => {
    const text = e.clipboardData.getData("text");
    const values = text.split(/[\n\r]+/).map((v) => v.trim());
    if (values.length <= 1) return;
    e.preventDefault();
    const ids = rows.map((r) => r.id);
    const startIdx = ids.indexOf(startId);
    setRows((prev) => {
      const next = [...prev];
      values.forEach((val, i) => {
        const idx = startIdx + i;
        if (idx < next.length) {
          const clamped = Math.min(Math.max(0, Number(val) || 0), MAX_MARKS);
          next[idx] = { ...next[idx], marks: String(clamped), absent: false };
        }
      });
      return next;
    });
    setSaved(false);
  };

  const handleCSV = (file) => {
    setCsvError("");
    const reader = new FileReader();
    reader.onload = (e) => {
      const lines = e.target.result.trim().split("\n").slice(1);
      const updates = {};
      lines.forEach((line) => {
        const [rollNo, marksRaw] = line.split(",").map((v) => v.trim());
        const student = rows.find((r) => r.rollNo === rollNo);
        if (student)
          updates[student.id] = String(
            Math.min(Math.max(0, Number(marksRaw) || 0), MAX_MARKS),
          );
      });
      if (!Object.keys(updates).length) {
        setCsvError("No matching Roll Numbers found.");
        return;
      }
      setRows((prev) =>
        prev.map((r) =>
          updates[r.id] !== undefined
            ? { ...r, marks: updates[r.id], absent: false }
            : r,
        ),
      );
      setSaved(false);
    };
    reader.readAsText(file);
  };

  const downloadSample = () => {
    const csv = ["Roll No,Marks", ...rows.map((r) => `${r.rollNo},`)].join(
      "\n",
    );
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "exam_marks_template.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setSaved(true);
    }, 700);
  };

  const passingPct = stats.entered
    ? Math.round((stats.passing / stats.entered) * 100)
    : 0;

  return (
    <div className="flex flex-col gap-5">
      <PageHeader
        title="Exam Marks Entry"
        subtitle="Enter marks for formal examinations"
        action={
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg border border-light-border dark:border-dark-border bg-light-card dark:bg-dark-card text-sm text-light-text-secondary dark:text-dark-text-secondary hover:bg-light-hover dark:hover:bg-dark-hover transition-colors"
            >
              <ArrowLeft size={15} /> Back
            </button>
            <button
              onClick={downloadSample}
              className="flex items-center gap-2 px-3 py-2 rounded-lg border border-light-border dark:border-dark-border bg-light-card dark:bg-dark-card text-sm text-light-text-secondary dark:text-dark-text-secondary hover:bg-light-hover dark:hover:bg-dark-hover transition-colors"
            >
              <Download size={15} /> Sample CSV
            </button>
            <button
              onClick={() => fileRef.current?.click()}
              className="flex items-center gap-2 px-3 py-2 rounded-lg border border-light-border dark:border-dark-border bg-light-card dark:bg-dark-card text-sm text-light-text-secondary dark:text-dark-text-secondary hover:bg-light-hover dark:hover:bg-dark-hover transition-colors"
            >
              <Upload size={15} /> Import CSV
            </button>
            <input
              ref={fileRef}
              type="file"
              accept=".csv"
              className="hidden"
              onChange={(e) =>
                e.target.files[0] && handleCSV(e.target.files[0])
              }
            />
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 bg-accent hover:bg-accent-hover text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-70"
            >
              {saving ? (
                <Loader2 size={15} className="animate-spin" />
              ) : saved ? (
                <Check size={15} />
              ) : (
                <Save size={15} />
              )}
              {saving ? "Saving…" : saved ? "Saved" : "Save Marks"}
            </button>
          </div>
        }
      />

      {/* Exam selector + search */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <select
            value={selectedExamId}
            onChange={(e) => handleExamChange(e.target.value)}
            className="w-full appearance-none px-3 py-2 pr-8 rounded-lg border border-light-border dark:border-dark-border bg-light-card dark:bg-dark-card text-sm text-light-text-primary dark:text-dark-text-primary outline-none focus:border-accent transition-colors"
          >
            {mockExams.map((e) => (
              <option key={e.id} value={e.id}>
                {e.subject} — Class {e.class} · {e.date} · {e.time} · {e.room}
              </option>
            ))}
          </select>
          <ChevronDown
            size={14}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-light-text-tertiary dark:text-dark-text-tertiary pointer-events-none"
          />
        </div>
        <div className="relative">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-light-text-tertiary dark:text-dark-text-tertiary"
          />
          <input
            type="text"
            placeholder="Search student…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 pr-3 py-2 rounded-lg border border-light-border dark:border-dark-border bg-light-card dark:bg-dark-card text-sm text-light-text-primary dark:text-dark-text-primary outline-none focus:border-accent transition-colors w-52"
          />
        </div>
        <button
          onClick={() => setShowHelp((p) => !p)}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-light-border dark:border-dark-border bg-light-card dark:bg-dark-card text-sm text-light-text-tertiary dark:text-dark-text-tertiary hover:bg-light-hover dark:hover:bg-dark-hover transition-colors"
        >
          <Keyboard size={14} /> Shortcuts
        </button>
      </div>

      {/* Exam info strip */}
      {exam && (
        <div className="bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl px-5 py-3 flex flex-wrap gap-x-6 gap-y-1 text-sm text-light-text-secondary dark:text-dark-text-secondary">
          <span>
            <strong className="text-light-text-primary dark:text-dark-text-primary">
              Subject:
            </strong>{" "}
            {exam.subject}
          </span>
          <span>
            <strong className="text-light-text-primary dark:text-dark-text-primary">
              Class:
            </strong>{" "}
            {exam.class}
          </span>
          <span>
            <strong className="text-light-text-primary dark:text-dark-text-primary">
              Date:
            </strong>{" "}
            {exam.date}
          </span>
          <span>
            <strong className="text-light-text-primary dark:text-dark-text-primary">
              Time:
            </strong>{" "}
            {exam.time}
          </span>
          <span>
            <strong className="text-light-text-primary dark:text-dark-text-primary">
              Room:
            </strong>{" "}
            {exam.room}
          </span>
          <span>
            <strong className="text-light-text-primary dark:text-dark-text-primary">
              Total Marks:
            </strong>{" "}
            {MAX_MARKS}
          </span>
        </div>
      )}

      {/* Keyboard shortcuts hint */}
      {showHelp && (
        <div className="bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 rounded-xl p-3 flex flex-wrap gap-x-6 gap-y-1 text-xs text-blue-700 dark:text-blue-400">
          <span>
            <kbd className="font-mono bg-white dark:bg-dark-card px-1 rounded border border-blue-200 dark:border-blue-800">
              Tab
            </kbd>{" "}
            Next row
          </span>
          <span>
            <kbd className="font-mono bg-white dark:bg-dark-card px-1 rounded border border-blue-200 dark:border-blue-800">
              Shift+Tab
            </kbd>{" "}
            Previous row
          </span>
          <span>
            <kbd className="font-mono bg-white dark:bg-dark-card px-1 rounded border border-blue-200 dark:border-blue-800">
              Enter
            </kbd>{" "}
            Move down
          </span>
          <span>
            <kbd className="font-mono bg-white dark:bg-dark-card px-1 rounded border border-blue-200 dark:border-blue-800">
              Ctrl+V
            </kbd>{" "}
            Paste column from Excel
          </span>
        </div>
      )}

      {/* CSV error */}
      {csvError && (
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-xs text-red-600 dark:text-red-400">
          <AlertCircle size={13} /> {csvError}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          {
            label: "Total",
            value: stats.total,
            color: "text-light-text-primary dark:text-dark-text-primary",
          },
          {
            label: "Entered",
            value: stats.entered,
            color: "text-blue-600 dark:text-blue-400",
          },
          {
            label: "Passing",
            value: `${stats.passing} (${passingPct}%)`,
            color: "text-green-600 dark:text-green-400",
          },
          { label: "Average", value: stats.avg || "—", color: "text-accent" },
          {
            label: "Highest",
            value: stats.highest || "—",
            color: "text-purple-600 dark:text-purple-400",
          },
          {
            label: "Lowest",
            value: stats.entered ? stats.lowest : "—",
            color: "text-red-500",
          },
        ].map(({ label, value, color }) => (
          <div
            key={label}
            className="bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl p-3 text-center"
          >
            <p className={`text-lg font-bold ${color}`}>{value}</p>
            <p className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary mt-0.5">
              {label}
            </p>
          </div>
        ))}
      </div>

      {/* Grid */}
      <div className="bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl overflow-hidden">
        <div className="grid grid-cols-[2rem_1fr_1fr_2fr_1.5fr_1.5fr_1.5fr] items-center gap-2 px-4 py-3 border-b border-light-border dark:border-dark-border min-w-[640px]">
          <span className="text-xs font-medium text-light-text-tertiary dark:text-dark-text-tertiary">
            #
          </span>
          {["Roll No", "Name", "Marks", "Absent", "Grade", "Pass/Fail"].map(
            (h) => (
              <span
                key={h}
                className="text-xs font-medium text-light-text-tertiary dark:text-dark-text-tertiary uppercase tracking-wide"
              >
                {h}
              </span>
            ),
          )}
        </div>
        <div className="overflow-x-auto">
          {filtered.map((row, idx) => {
            const marksNum = Number(row.marks);
            const pct =
              row.marks !== "" && !row.absent
                ? Math.round((marksNum / MAX_MARKS) * 100)
                : null;
            const grade = pct !== null ? gradeFromPct(pct) : null;
            const pass = pct !== null ? pct >= PASSING_PCT : null;
            return (
              <div
                key={row.id}
                className={`grid grid-cols-[2rem_1fr_1fr_2fr_1.5fr_1.5fr_1.5fr] items-center gap-2 px-4 py-2.5 border-b border-light-border dark:border-dark-border last:border-0 min-w-[640px] transition-colors ${
                  row.absent
                    ? "bg-red-50/40 dark:bg-red-950/20"
                    : pass === false
                      ? "bg-red-50/30 dark:bg-red-950/10"
                      : "hover:bg-light-hover dark:hover:bg-dark-hover"
                }`}
              >
                <span className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary">
                  {idx + 1}
                </span>
                <span className="text-xs font-mono text-light-text-tertiary dark:text-dark-text-tertiary">
                  {row.rollNo}
                </span>
                <span className="text-sm text-light-text-primary dark:text-dark-text-primary truncate">
                  {row.name}
                </span>
                <div className="flex items-center gap-2">
                  <input
                    ref={(el) => {
                      cellRefs.current[row.id] = el;
                    }}
                    type="text"
                    inputMode="numeric"
                    value={row.absent ? "—" : row.marks}
                    disabled={row.absent}
                    onChange={(e) => updateMarks(row.id, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e, row.id)}
                    onPaste={(e) => handlePaste(e, row.id)}
                    placeholder={`/ ${MAX_MARKS}`}
                    className={`w-20 rounded-lg border px-2 py-1.5 text-sm text-center font-medium outline-none transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
                      pass === false && !row.absent
                        ? "border-red-400 dark:border-red-600 bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400 focus:border-red-500"
                        : pass === true
                          ? "border-green-400 dark:border-green-600 bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400 focus:border-green-500"
                          : "border-light-border dark:border-dark-border bg-light-bg dark:bg-dark-bg text-light-text-primary dark:text-dark-text-primary focus:border-accent"
                    }`}
                  />
                  <span className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary">
                    / {MAX_MARKS}
                  </span>
                </div>
                <button
                  onClick={() => toggleAbsent(row.id)}
                  className={`flex items-center justify-center h-7 w-14 rounded-full text-xs font-medium transition-colors ${
                    row.absent
                      ? "bg-red-500 text-white"
                      : "bg-light-hover dark:bg-dark-hover text-light-text-tertiary dark:text-dark-text-tertiary hover:bg-red-100 dark:hover:bg-red-950 hover:text-red-600"
                  }`}
                >
                  {row.absent ? "Absent" : "Present"}
                </button>
                {grade ? (
                  <span
                    className={`inline-flex items-center justify-center w-9 h-7 rounded-lg text-xs font-bold ${grade.bg} ${grade.text}`}
                  >
                    {grade.g}
                  </span>
                ) : (
                  <span className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary">
                    —
                  </span>
                )}
                {pass !== null ? (
                  <span
                    className={`text-xs font-semibold ${pass ? "text-green-600 dark:text-green-400" : "text-red-500"}`}
                  >
                    {pass ? "✓ Pass" : "✗ Fail"}
                  </span>
                ) : (
                  <span className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary">
                    —
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom save bar */}
      <div className="flex items-center justify-between bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl px-5 py-3">
        <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
          {stats.entered} / {stats.total} marks entered
          {stats.entered > 0 && ` · ${passingPct}% passing`}
        </p>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-5 py-2 bg-accent hover:bg-accent-hover text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-70"
        >
          {saving ? (
            <Loader2 size={15} className="animate-spin" />
          ) : saved ? (
            <Check size={15} />
          ) : (
            <Save size={15} />
          )}
          {saving ? "Saving…" : saved ? "All Saved" : "Save Marks"}
        </button>
      </div>
    </div>
  );
}

export default ExamMarksEntry;
