import { useState, useMemo, useRef } from "react";
import {
  ArrowLeft, Printer, Search, Check, Loader2,
  CheckSquare, Square, TrendingUp, Award,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../../components/common/PageHeader";
import { mockStudents, mockExams } from "../../data/mockData";

// ── Mock result data ──────────────────────────────────────────────────────────
const SUBJECTS = ["Mathematics","English","Physics","Chemistry","Computer Science"];
const MOCK_EXAM_RESULTS = {
  1:  { Mathematics: 78, English: 65, Physics: 55, Chemistry: 62, "Computer Science": 80 },
  2:  { Mathematics: 88, English: 75, Physics: 70, Chemistry: 68, "Computer Science": 91 },
  3:  { Mathematics: 55, English: 58, Physics: 40, Chemistry: 45, "Computer Science": 60 },
  4:  { Mathematics: 92, English: 85, Physics: 88, Chemistry: 82, "Computer Science": 95 },
  5:  { Mathematics: 42, English: 48, Physics: 35, Chemistry: 38, "Computer Science": 50 },
  6:  { Mathematics: 70, English: 68, Physics: 60, Chemistry: 58, "Computer Science": 72 },
  7:  { Mathematics: 83, English: 79, Physics: 75, Chemistry: 71, "Computer Science": 85 },
  8:  { Mathematics: 61, English: 62, Physics: 50, Chemistry: 55, "Computer Science": 65 },
  9:  { Mathematics: 95, English: 90, Physics: 92, Chemistry: 88, "Computer Science": 97 },
  10: { Mathematics: 30, English: 38, Physics: 28, Chemistry: 32, "Computer Science": 40 },
};
const MAX_MARKS = 100;
const SCHOOL    = { name: "EduLink School & College", address: "Rawalpindi, Punjab, Pakistan", phone: "051-1234567", session: "2025–2026", exam: "Annual Examination" };

function gradeFromPct(pct) {
  if (pct >= 90) return { g: "A+", c: "#16a34a" };
  if (pct >= 80) return { g: "A",  c: "#16a34a" };
  if (pct >= 70) return { g: "B+", c: "#2563eb" };
  if (pct >= 60) return { g: "B",  c: "#2563eb" };
  if (pct >= 50) return { g: "C",  c: "#d97706" };
  if (pct >= 33) return { g: "D",  c: "#ea580c" };
  return           { g: "F",  c: "#dc2626" };
}

function getResult(studentId) {
  const marks   = MOCK_EXAM_RESULTS[studentId] || {};
  const total   = Object.values(marks).reduce((a, b) => a + b, 0);
  const maxTotal= SUBJECTS.length * MAX_MARKS;
  const pct     = maxTotal > 0 ? Math.round((total / maxTotal) * 100) : 0;
  const { g, c }= gradeFromPct(pct);
  return { marks, total, maxTotal, pct, grade: g, gradeColor: c, pass: pct >= 33 };
}

// ── Design 1: Classic tabular marksheet ──────────────────────────────────────
function MarksheetDesign1({ student, result }) {
  return (
    <div className="w-full max-w-[520px] bg-white border-2 border-gray-700 rounded-lg overflow-hidden font-sans text-gray-900">
      {/* Header */}
      <div className="text-center border-b-2 border-gray-700 px-4 py-4">
        <div className="w-10 h-10 bg-gray-800 rounded-full mx-auto mb-2 flex items-center justify-center text-white font-black text-lg">E</div>
        <h1 className="text-base font-black uppercase tracking-wider">{SCHOOL.name}</h1>
        <p className="text-xs text-gray-500 mt-0.5">{SCHOOL.address} · {SCHOOL.phone}</p>
        <div className="mt-2 inline-block px-4 py-1 bg-gray-800 text-white text-xs font-bold rounded-full">{SCHOOL.exam} — {SCHOOL.session}</div>
      </div>

      {/* Student info */}
      <div className="px-4 py-3 border-b border-gray-200 grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
        <div><span className="text-gray-500">Student Name:</span> <strong>{student.name}</strong></div>
        <div><span className="text-gray-500">Roll No:</span> <strong>{student.rollNo}</strong></div>
        <div><span className="text-gray-500">Class:</span> <strong>{student.class}</strong></div>
        <div><span className="text-gray-500">Session:</span> <strong>{SCHOOL.session}</strong></div>
      </div>

      {/* Marks table */}
      <table className="w-full text-xs border-b border-gray-200">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-3 py-1.5 text-left font-semibold text-gray-700 border-r border-gray-200">Subject</th>
            <th className="px-3 py-1.5 text-center font-semibold text-gray-700 border-r border-gray-200">Max</th>
            <th className="px-3 py-1.5 text-center font-semibold text-gray-700 border-r border-gray-200">Obt.</th>
            <th className="px-3 py-1.5 text-center font-semibold text-gray-700 border-r border-gray-200">%</th>
            <th className="px-3 py-1.5 text-center font-semibold text-gray-700">Grade</th>
          </tr>
        </thead>
        <tbody>
          {SUBJECTS.map((sub) => {
            const m   = result.marks[sub] || 0;
            const pct = Math.round((m / MAX_MARKS) * 100);
            const { g, c } = gradeFromPct(pct);
            return (
              <tr key={sub} className="border-t border-gray-100">
                <td className="px-3 py-1.5 border-r border-gray-200">{sub}</td>
                <td className="px-3 py-1.5 text-center border-r border-gray-200">{MAX_MARKS}</td>
                <td className="px-3 py-1.5 text-center border-r border-gray-200 font-semibold">{m}</td>
                <td className="px-3 py-1.5 text-center border-r border-gray-200">{pct}%</td>
                <td className="px-3 py-1.5 text-center font-bold" style={{ color: c }}>{g}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Summary */}
      <div className="px-4 py-3 flex items-center justify-between">
        <div className="text-xs">
          <p><span className="text-gray-500">Total Marks:</span> <strong>{result.total} / {result.maxTotal}</strong></p>
          <p><span className="text-gray-500">Percentage:</span> <strong>{result.pct}%</strong></p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-black" style={{ color: result.gradeColor }}>{result.grade}</p>
          <p className={`text-xs font-bold ${result.pass ? "text-green-600" : "text-red-600"}`}>{result.pass ? "PASS" : "FAIL"}</p>
        </div>
        <div className="text-center border border-dashed border-gray-300 rounded px-4 py-2">
          <p className="text-[10px] text-gray-400">Principal Stamp</p>
          <div className="w-12 h-8 mt-1" />
        </div>
      </div>

      <div className="border-t border-gray-200 px-4 py-2 flex justify-between text-[10px] text-gray-400">
        <span>Issue Date: {new Date().toLocaleDateString()}</span>
        <span>Controller of Examinations</span>
      </div>
    </div>
  );
}

// ── Design 2: Modern card-style ───────────────────────────────────────────────
function MarksheetDesign2({ student, result }) {
  return (
    <div className="w-full max-w-[520px] bg-white rounded-xl overflow-hidden font-sans border border-gray-200">
      {/* Gradient header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-700 px-5 py-4 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-sm font-black uppercase tracking-wider">{SCHOOL.name}</h1>
            <p className="text-xs opacity-80 mt-0.5">{SCHOOL.exam} · {SCHOOL.session}</p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-black" style={{ color: result.pct >= 33 ? "#86efac" : "#fca5a5" }}>{result.grade}</p>
            <p className="text-xs opacity-80">{result.pct}%</p>
          </div>
        </div>
      </div>

      {/* Student row */}
      <div className="flex items-center gap-3 px-5 py-3 border-b border-gray-100">
        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-black text-base shrink-0">{student.name.charAt(0)}</div>
        <div>
          <p className="text-sm font-bold text-gray-900">{student.name}</p>
          <p className="text-xs text-gray-500">{student.rollNo} · {student.class}</p>
        </div>
        <div className={`ml-auto px-3 py-1 rounded-full text-xs font-bold ${result.pass ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
          {result.pass ? "✓ PASS" : "✗ FAIL"}
        </div>
      </div>

      {/* Subject bars */}
      <div className="px-5 py-3 flex flex-col gap-2">
        {SUBJECTS.map((sub) => {
          const m   = result.marks[sub] || 0;
          const pct = Math.round((m / MAX_MARKS) * 100);
          const { g, c } = gradeFromPct(pct);
          return (
            <div key={sub} className="flex items-center gap-3">
              <span className="text-xs text-gray-600 w-32 shrink-0 truncate">{sub}</span>
              <div className="flex-1 bg-gray-100 rounded-full h-1.5">
                <div className="h-1.5 rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: c }} />
              </div>
              <span className="text-xs font-semibold text-gray-700 w-8 text-right">{m}</span>
              <span className="text-xs font-bold w-6" style={{ color: c }}>{g}</span>
            </div>
          );
        })}
      </div>

      {/* Footer summary */}
      <div className="px-5 py-3 border-t border-gray-100 flex items-center justify-between">
        <div className="text-xs text-gray-500">
          <strong className="text-gray-800">{result.total}</strong> / {result.maxTotal} marks
        </div>
        <div className="text-center border border-dashed border-gray-200 rounded px-3 py-1.5">
          <p className="text-[9px] text-gray-400">Stamp & Signature</p>
          <div className="w-10 h-6 mt-0.5" />
        </div>
        <p className="text-[10px] text-gray-400">{new Date().toLocaleDateString()}</p>
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
function Marksheets() {
  const navigate  = useNavigate();
  const printRef  = useRef(null);

  const [design, setDesign]         = useState(1);
  const [search, setSearch]         = useState("");
  const [classFilter, setClass]     = useState("All Classes");
  const [selected, setSelected]     = useState(new Set());
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated]   = useState(false);

  const students = mockStudents.slice(0, 10);
  const classes  = ["All Classes", ...new Set(students.map((s) => s.class))];

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return students.filter((s) => {
      const matchSearch = s.name.toLowerCase().includes(q) || s.rollNo.toLowerCase().includes(q);
      const matchClass  = classFilter === "All Classes" || s.class === classFilter;
      return matchSearch && matchClass;
    });
  }, [search, classFilter]);

  const allSelected = filtered.length > 0 && filtered.every((s) => selected.has(s.id));
  const toggleAll   = () => allSelected
    ? setSelected((p) => { const n = new Set(p); filtered.forEach((s) => n.delete(s.id)); return n; })
    : setSelected((p) => { const n = new Set(p); filtered.forEach((s) => n.add(s.id)); return n; });
  const toggleOne   = (id) => setSelected((p) => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n; });

  const selectedStudents = students.filter((s) => selected.has(s.id));

  const handleGenerate = () => {
    if (selected.size === 0) return;
    setGenerating(true);
    setTimeout(() => { setGenerating(false); setGenerated(true); }, 700);
  };

  const handlePrint = () => {
    const content = printRef.current?.innerHTML;
    const w = window.open("", "_blank");
    w.document.write(`
      <html><head><title>Marksheets</title>
      <style>*{box-sizing:border-box}body{font-family:Arial,sans-serif;margin:0;padding:16px;background:#fff}.sheet{page-break-after:always;margin-bottom:20px}@media print{@page{margin:10mm}body{padding:0}}</style>
      </head><body>${content}</body></html>
    `);
    w.document.close();
    w.print();
  };

  const CardComponent = design === 1 ? MarksheetDesign1 : MarksheetDesign2;

  // Preview student
  const previewStudent = selectedStudents[0] || students[0];
  const previewResult  = getResult(previewStudent.id);

  return (
    <div className="flex flex-col gap-5">
      <PageHeader
        title="Marksheets"
        subtitle="Generate and print exam result marksheets"
        action={
          <div className="flex items-center gap-2 flex-wrap">
            <button onClick={() => navigate(-1)} className="flex items-center gap-2 px-3 py-2 rounded-lg border border-light-border dark:border-dark-border bg-light-card dark:bg-dark-card text-sm text-light-text-secondary dark:text-dark-text-secondary hover:bg-light-hover dark:hover:bg-dark-hover transition-colors">
              <ArrowLeft size={15} /> Back
            </button>
            {generated && (
              <button onClick={handlePrint} className="flex items-center gap-2 px-3 py-2 rounded-lg border border-light-border dark:border-dark-border bg-light-card dark:bg-dark-card text-sm text-light-text-secondary dark:text-dark-text-secondary hover:bg-light-hover dark:hover:bg-dark-hover transition-colors">
                <Printer size={15} /> Print All
              </button>
            )}
            <button
              onClick={handleGenerate}
              disabled={selected.size === 0 || generating}
              className="flex items-center gap-2 px-4 py-2 bg-accent hover:bg-accent-hover text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {generating ? <Loader2 size={15} className="animate-spin" /> : generated ? <Check size={15} /> : <TrendingUp size={15} />}
              {generating ? "Generating…" : `Generate ${selected.size > 0 ? selected.size : ""} Sheet${selected.size !== 1 ? "s" : ""}`}
            </button>
          </div>
        }
      />

      {/* Controls */}
      <div className="flex flex-wrap gap-3">
        <select value={classFilter} onChange={(e) => setClass(e.target.value)} className="px-3 py-2 rounded-lg border border-light-border dark:border-dark-border bg-light-card dark:bg-dark-card text-sm text-light-text-primary dark:text-dark-text-primary outline-none focus:border-accent transition-colors">
          {classes.map((c) => <option key={c}>{c}</option>)}
        </select>
        <div className="flex gap-2">
          {[1, 2].map((d) => (
            <button key={d} onClick={() => { setDesign(d); setGenerated(false); }} className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${design === d ? "bg-accent text-white border-accent" : "border-light-border dark:border-dark-border text-light-text-secondary dark:text-dark-text-secondary hover:bg-light-hover dark:hover:bg-dark-hover"}`}>
              Design {d}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Student selector */}
        <div className="bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl overflow-hidden">
          <div className="px-4 py-3 border-b border-light-border dark:border-dark-border flex items-center gap-3">
            <div className="relative flex-1">
              <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-light-text-tertiary dark:text-dark-text-tertiary" />
              <input type="text" placeholder="Search student…" value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-7 pr-3 py-1.5 rounded-lg border border-light-border dark:border-dark-border bg-light-bg dark:bg-dark-bg text-sm text-light-text-primary dark:text-dark-text-primary placeholder:text-light-text-tertiary outline-none focus:border-accent transition-colors" />
            </div>
            <button onClick={toggleAll} className="flex items-center gap-1.5 text-xs text-accent hover:text-accent-hover font-medium transition-colors whitespace-nowrap">
              {allSelected ? <CheckSquare size={14} /> : <Square size={14} />}
              {allSelected ? "Deselect All" : "Select All"}
            </button>
          </div>
          <div className="divide-y divide-light-border dark:divide-dark-border max-h-[420px] overflow-y-auto">
            {filtered.map((s) => {
              const r = getResult(s.id);
              return (
                <div key={s.id} onClick={() => toggleOne(s.id)} className={`flex items-center gap-3 px-4 py-2.5 cursor-pointer transition-colors hover:bg-light-hover dark:hover:bg-dark-hover ${selected.has(s.id) ? "bg-accent/5" : ""}`}>
                  <div className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-colors ${selected.has(s.id) ? "bg-accent border-accent" : "border-light-border dark:border-dark-border"}`}>
                    {selected.has(s.id) && <Check size={10} className="text-white" />}
                  </div>
                  <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-accent text-xs font-bold shrink-0">{s.name.charAt(0)}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-light-text-primary dark:text-dark-text-primary truncate">{s.name}</p>
                    <p className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary">{s.rollNo} · {s.class}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-bold" style={{ color: r.gradeColor }}>{r.grade}</p>
                    <p className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary">{r.pct}%</p>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="px-4 py-2.5 border-t border-light-border dark:border-dark-border">
            <p className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary">{selected.size} of {filtered.length} selected</p>
          </div>
        </div>

        {/* Live preview */}
        <div className="bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl overflow-hidden">
          <div className="px-4 py-3 border-b border-light-border dark:border-dark-border">
            <h3 className="text-sm font-semibold text-light-text-primary dark:text-dark-text-primary">Live Preview</h3>
            <p className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary mt-0.5">Design {design} — {previewStudent.name}</p>
          </div>
          <div className="p-4 flex justify-center overflow-auto">
            <CardComponent student={previewStudent} result={previewResult} />
          </div>
        </div>
      </div>

      {/* Generated sheets */}
      {generated && selectedStudents.length > 0 && (
        <div className="bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl overflow-hidden">
          <div className="px-4 py-3 border-b border-light-border dark:border-dark-border flex items-center justify-between">
            <h3 className="text-sm font-semibold text-light-text-primary dark:text-dark-text-primary">Generated Marksheets ({selectedStudents.length})</h3>
            <button onClick={handlePrint} className="flex items-center gap-2 px-3 py-1.5 bg-accent hover:bg-accent-hover text-white text-xs font-medium rounded-lg transition-colors">
              <Printer size={13} /> Print All
            </button>
          </div>
          <div ref={printRef} className="p-5 flex flex-col gap-8">
            {selectedStudents.map((s) => (
              <div key={s.id} className="flex justify-center">
                <CardComponent student={s} result={getResult(s.id)} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Marksheets;