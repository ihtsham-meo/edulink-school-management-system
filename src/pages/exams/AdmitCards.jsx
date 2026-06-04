import { useState, useMemo, useRef } from "react";
import {
  ArrowLeft,
  Download,
  Printer,
  Search,
  Filter,
  QrCode,
  User,
  Hash,
  Calendar,
  MapPin,
  Clock,
  CheckSquare,
  Square,
  Loader2,
  Check,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../../components/common/PageHeader";
import { mockExams, mockStudents } from "../../data/mockData";

// ── Helpers ───────────────────────────────────────────────────────────────────
// Simple QR-like block (visual placeholder — real QR needs a library)
function QRPlaceholder({ value, size = 48 }) {
  const seed = value.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const cells = Array.from(
    { length: 25 },
    (_, i) => (seed * (i + 7) * 31) % 17 > 7,
  );
  return (
    <div
      style={{ width: size, height: size }}
      className="grid grid-cols-5 gap-px p-1 bg-white rounded"
    >
      {cells.map((filled, i) => (
        <div
          key={i}
          className={`rounded-sm ${filled ? "bg-black" : "bg-white"}`}
        />
      ))}
    </div>
  );
}

// ── Card designs ──────────────────────────────────────────────────────────────
function CardDesign1({ student, exam, schoolName }) {
  return (
    <div className="w-[340px] bg-white border-2 border-gray-800 rounded-xl overflow-hidden shadow-sm print:shadow-none font-sans">
      {/* Header */}
      <div className="bg-gray-800 text-white px-4 py-3 flex items-center justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest">
            {schoolName}
          </p>
          <p className="text-[10px] opacity-75 mt-0.5">
            Admit Card — {exam.subject}
          </p>
        </div>
        <QRPlaceholder value={`${student.rollNo}-${exam.id}`} size={40} />
      </div>
      {/* Body */}
      <div className="px-4 py-3 flex gap-3">
        <div className="w-14 h-16 bg-gray-100 border border-gray-300 rounded-lg flex items-center justify-center shrink-0">
          <User size={24} className="text-gray-400" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-gray-900 truncate">
            {student.name}
          </p>
          <p className="text-xs text-gray-500 mt-0.5">
            Roll No:{" "}
            <span className="font-semibold text-gray-700">
              {student.rollNo}
            </span>
          </p>
          <p className="text-xs text-gray-500">
            Class:{" "}
            <span className="font-semibold text-gray-700">{student.class}</span>
          </p>
        </div>
      </div>
      {/* Exam details */}
      <div className="mx-4 mb-3 p-2.5 bg-gray-50 border border-gray-200 rounded-lg">
        <div className="grid grid-cols-2 gap-1.5 text-xs">
          <div>
            <span className="text-gray-500">Subject:</span>{" "}
            <span className="font-semibold text-gray-800">{exam.subject}</span>
          </div>
          <div>
            <span className="text-gray-500">Date:</span>{" "}
            <span className="font-semibold text-gray-800">{exam.date}</span>
          </div>
          <div>
            <span className="text-gray-500">Time:</span>{" "}
            <span className="font-semibold text-gray-800">{exam.time}</span>
          </div>
          <div>
            <span className="text-gray-500">Room:</span>{" "}
            <span className="font-semibold text-gray-800">{exam.room}</span>
          </div>
        </div>
      </div>
      {/* Footer */}
      <div className="mx-4 mb-3 flex justify-between items-center">
        <p className="text-[10px] text-gray-400">Signature: ___________</p>
        <p className="text-[10px] text-gray-400">Controller of Exams</p>
      </div>
    </div>
  );
}

function CardDesign2({ student, exam, schoolName }) {
  return (
    <div className="w-[340px] bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm print:shadow-none font-sans">
      {/* Accent strip */}
      <div className="h-1.5 bg-gradient-to-r from-blue-600 to-purple-600" />
      <div className="px-4 pt-3 pb-2 flex items-center justify-between border-b border-gray-100">
        <div>
          <p className="text-xs font-black text-blue-700 uppercase tracking-wider">
            {schoolName}
          </p>
          <p className="text-[10px] text-gray-400 mt-0.5">
            Examination Admit Card
          </p>
        </div>
        <QRPlaceholder value={`${student.rollNo}-${exam.id}`} size={44} />
      </div>
      <div className="px-4 py-3">
        {/* Student info */}
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-sm shrink-0">
            {student.name.charAt(0)}
          </div>
          <div>
            <p className="text-sm font-bold text-gray-900">{student.name}</p>
            <p className="text-xs text-gray-500">
              {student.rollNo} · Class {student.class}
            </p>
          </div>
        </div>
        {/* Exam pills */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          {[
            { icon: "📘", label: exam.subject },
            { icon: "📅", label: exam.date },
            { icon: "🕘", label: exam.time },
            { icon: "🚪", label: `Room: ${exam.room}` },
          ].map(({ icon, label }) => (
            <div
              key={label}
              className="flex items-center gap-1.5 px-2 py-1.5 bg-gray-50 rounded-lg border border-gray-100"
            >
              <span>{icon}</span>
              <span className="font-medium text-gray-700 truncate">
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>
      <div className="px-4 pb-3 flex justify-between text-[10px] text-gray-400">
        <span>Student Signature: ____________</span>
        <span>Principal</span>
      </div>
    </div>
  );
}

const CARDS_PER_PAGE_OPTIONS = [2, 4, 6];

// ── Main Component ────────────────────────────────────────────────────────────
function AdmitCards() {
  const navigate = useNavigate();
  const printRef = useRef(null);

  const [selectedExamId, setExamId] = useState(mockExams[0].id);
  const exam = useMemo(
    () => mockExams.find((e) => e.id === selectedExamId),
    [selectedExamId],
  );

  const [design, setDesign] = useState(1);
  const [search, setSearch] = useState("");
  const [classFilter, setClass] = useState("All Classes");
  const [selected, setSelected] = useState(new Set());
  const [cardsPerPage, setPerPage] = useState(2);
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);
  const schoolName = "EduLink School";

  const students = mockStudents.slice(0, 10);
  const classes = ["All Classes", ...new Set(students.map((s) => s.class))];

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return students.filter((s) => {
      const matchSearch =
        s.name.toLowerCase().includes(q) || s.rollNo.toLowerCase().includes(q);
      const matchClass =
        classFilter === "All Classes" || s.class === classFilter;
      return matchSearch && matchClass;
    });
  }, [search, classFilter]);

  const allSelected =
    filtered.length > 0 && filtered.every((s) => selected.has(s.id));
  const toggleAll = () =>
    allSelected
      ? setSelected((p) => {
          const n = new Set(p);
          filtered.forEach((s) => n.delete(s.id));
          return n;
        })
      : setSelected((p) => {
          const n = new Set(p);
          filtered.forEach((s) => n.add(s.id));
          return n;
        });
  const toggleOne = (id) =>
    setSelected((p) => {
      const n = new Set(p);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });

  const selectedStudents = students.filter((s) => selected.has(s.id));

  const handleGenerate = () => {
    if (selected.size === 0) return;
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      setGenerated(true);
    }, 800);
  };

  const handlePrint = () => {
    const content = printRef.current?.innerHTML;
    const w = window.open("", "_blank");
    w.document.write(`
      <html><head><title>Admit Cards — ${exam?.subject}</title>
      <style>
        *{box-sizing:border-box}body{font-family:Arial,sans-serif;margin:0;padding:16px;background:#fff}
        .page{display:flex;flex-wrap:wrap;gap:16px;justify-content:flex-start}
        .card{page-break-inside:avoid}
        @media print{@page{margin:12mm}body{padding:0}}
      </style></head>
      <body><div class="page">${content}</div></body></html>
    `);
    w.document.close();
    w.print();
  };

  const CardComponent = design === 1 ? CardDesign1 : CardDesign2;

  return (
    <div className="flex flex-col gap-5">
      <PageHeader
        title="Admit Cards"
        subtitle="Generate and print student admit slips for exams"
        action={
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg border border-light-border dark:border-dark-border bg-light-card dark:bg-dark-card text-sm text-light-text-secondary dark:text-dark-text-secondary hover:bg-light-hover dark:hover:bg-dark-hover transition-colors"
            >
              <ArrowLeft size={15} /> Back
            </button>
            {generated && (
              <button
                onClick={handlePrint}
                className="flex items-center gap-2 px-3 py-2 rounded-lg border border-light-border dark:border-dark-border bg-light-card dark:bg-dark-card text-sm text-light-text-secondary dark:text-dark-text-secondary hover:bg-light-hover dark:hover:bg-dark-hover transition-colors"
              >
                <Printer size={15} /> Print All
              </button>
            )}
            <button
              onClick={handleGenerate}
              disabled={selected.size === 0 || generating}
              className="flex items-center gap-2 px-4 py-2 bg-accent hover:bg-accent-hover text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {generating ? (
                <Loader2 size={15} className="animate-spin" />
              ) : generated ? (
                <Check size={15} />
              ) : (
                <QrCode size={15} />
              )}
              {generating
                ? "Generating…"
                : `Generate ${selected.size > 0 ? selected.size : ""} Card${selected.size !== 1 ? "s" : ""}`}
            </button>
          </div>
        }
      />

      {/* Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Exam selector */}
        <select
          value={selectedExamId}
          onChange={(e) => {
            setExamId(Number(e.target.value));
            setGenerated(false);
          }}
          className="px-3 py-2 rounded-lg border border-light-border dark:border-dark-border bg-light-card dark:bg-dark-card text-sm text-light-text-primary dark:text-dark-text-primary outline-none focus:border-accent transition-colors"
        >
          {mockExams.map((e) => (
            <option key={e.id} value={e.id}>
              {e.subject} · {e.date}
            </option>
          ))}
        </select>

        {/* Class filter */}
        <select
          value={classFilter}
          onChange={(e) => setClass(e.target.value)}
          className="px-3 py-2 rounded-lg border border-light-border dark:border-dark-border bg-light-card dark:bg-dark-card text-sm text-light-text-primary dark:text-dark-text-primary outline-none focus:border-accent transition-colors"
        >
          {classes.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>

        {/* Design toggle */}
        <div className="flex gap-2">
          {[1, 2].map((d) => (
            <button
              key={d}
              onClick={() => {
                setDesign(d);
                setGenerated(false);
              }}
              className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-colors ${design === d ? "bg-accent text-white border-accent" : "border-light-border dark:border-dark-border text-light-text-secondary dark:text-dark-text-secondary hover:bg-light-hover dark:hover:bg-dark-hover"}`}
            >
              Design {d}
            </button>
          ))}
        </div>

        {/* Cards per page */}
        <select
          value={cardsPerPage}
          onChange={(e) => setPerPage(Number(e.target.value))}
          className="px-3 py-2 rounded-lg border border-light-border dark:border-dark-border bg-light-card dark:bg-dark-card text-sm text-light-text-primary dark:text-dark-text-primary outline-none focus:border-accent transition-colors"
        >
          {CARDS_PER_PAGE_OPTIONS.map((n) => (
            <option key={n} value={n}>
              {n} per page
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* ── Left: Student selector ── */}
        <div className="bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl overflow-hidden">
          <div className="px-4 py-3 border-b border-light-border dark:border-dark-border flex items-center justify-between gap-3">
            <div className="relative flex-1">
              <Search
                size={13}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 text-light-text-tertiary dark:text-dark-text-tertiary"
              />
              <input
                type="text"
                placeholder="Search student…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-7 pr-3 py-1.5 rounded-lg border border-light-border dark:border-dark-border bg-light-bg dark:bg-dark-bg text-sm text-light-text-primary dark:text-dark-text-primary placeholder:text-light-text-tertiary outline-none focus:border-accent transition-colors"
              />
            </div>
            <button
              onClick={toggleAll}
              className="flex items-center gap-1.5 text-xs text-accent hover:text-accent-hover font-medium transition-colors whitespace-nowrap"
            >
              {allSelected ? <CheckSquare size={14} /> : <Square size={14} />}
              {allSelected ? "Deselect All" : "Select All"}
            </button>
          </div>
          <div className="divide-y divide-light-border dark:divide-dark-border max-h-[420px] overflow-y-auto">
            {filtered.map((s) => (
              <div
                key={s.id}
                onClick={() => toggleOne(s.id)}
                className={`flex items-center gap-3 px-4 py-2.5 cursor-pointer transition-colors hover:bg-light-hover dark:hover:bg-dark-hover ${selected.has(s.id) ? "bg-accent/5" : ""}`}
              >
                <div
                  className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-colors ${selected.has(s.id) ? "bg-accent border-accent" : "border-light-border dark:border-dark-border"}`}
                >
                  {selected.has(s.id) && (
                    <Check size={10} className="text-white" />
                  )}
                </div>
                <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-accent text-xs font-bold shrink-0">
                  {s.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-light-text-primary dark:text-dark-text-primary truncate">
                    {s.name}
                  </p>
                  <p className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary">
                    {s.rollNo} · {s.class}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="px-4 py-2.5 border-t border-light-border dark:border-dark-border">
            <p className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary">
              {selected.size} of {filtered.length} selected
            </p>
          </div>
        </div>

        {/* ── Right: Live card preview ── */}
        <div className="bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl overflow-hidden">
          <div className="px-4 py-3 border-b border-light-border dark:border-dark-border">
            <h3 className="text-sm font-semibold text-light-text-primary dark:text-dark-text-primary">
              Live Preview
            </h3>
            <p className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary mt-0.5">
              Design {design} · Select a student to preview
            </p>
          </div>
          <div className="p-5 flex justify-center">
            {selectedStudents.length > 0 && exam ? (
              <CardComponent
                student={selectedStudents[0]}
                exam={exam}
                schoolName={schoolName}
              />
            ) : (
              <div className="flex flex-col items-center justify-center py-12 gap-3">
                <div className="w-12 h-12 bg-light-hover dark:bg-dark-hover rounded-full flex items-center justify-center">
                  <QrCode
                    size={22}
                    className="text-light-text-tertiary dark:text-dark-text-tertiary"
                  />
                </div>
                <p className="text-sm text-light-text-tertiary dark:text-dark-text-tertiary">
                  Select students to preview
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Generated cards grid ── */}
      {generated && selectedStudents.length > 0 && exam && (
        <div className="bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl overflow-hidden">
          <div className="px-4 py-3 border-b border-light-border dark:border-dark-border flex items-center justify-between">
            <h3 className="text-sm font-semibold text-light-text-primary dark:text-dark-text-primary">
              Generated Cards ({selectedStudents.length})
            </h3>
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-3 py-1.5 bg-accent hover:bg-accent-hover text-white text-xs font-medium rounded-lg transition-colors"
            >
              <Printer size={13} /> Print / Download
            </button>
          </div>
          <div
            ref={printRef}
            className={`p-5 grid gap-5 ${cardsPerPage >= 4 ? "grid-cols-2" : cardsPerPage >= 6 ? "grid-cols-3" : "grid-cols-1 sm:grid-cols-2"}`}
          >
            {selectedStudents.map((s) => (
              <div key={s.id} className="flex justify-center">
                <CardComponent
                  student={s}
                  exam={exam}
                  schoolName={schoolName}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default AdmitCards;
