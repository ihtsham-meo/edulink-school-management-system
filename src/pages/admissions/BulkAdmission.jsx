import { useState, useRef, useMemo } from "react";
import {
  Upload,
  Download,
  CheckCircle,
  XCircle,
  AlertCircle,
  FileText,
  Loader2,
  Trash2,
  Plus,
  X,
  ChevronRight,
} from "lucide-react";
import PageHeader from "../../components/common/PageHeader";

// ── Helpers ───────────────────────────────────────────────────────────────────
const REQUIRED_COLS = [
  "studentName",
  "fatherName",
  "phone",
  "gender",
  "dob",
  "applyingClass",
];
const ALL_COLS = [
  ...REQUIRED_COLS,
  "email",
  "address",
  "prevSchool",
  "prevGrade",
];

const COL_LABELS = {
  studentName: "Student Name",
  fatherName: "Father's Name",
  phone: "Phone",
  gender: "Gender",
  dob: "Date of Birth",
  applyingClass: "Applying Class",
  email: "Email",
  address: "Address",
  prevSchool: "Previous School",
  prevGrade: "Previous Grade",
};

const SAMPLE_CSV = `Student Name,Father's Name,Phone,Gender,Date of Birth,Applying Class,Email,Address,Previous School,Previous Grade
Zara Ahmed,Ahmed Ali,03001234567,Female,2012-04-15,Class 8,zara@gmail.com,Lahore,Model School,A
Omar Baig,Baig Noor,03011234567,Male,2011-08-20,Class 9,omar@gmail.com,Rawalpindi,City School,B+
Fatima Shah,Shah Raza,03021234567,Female,2013-01-10,Class 7,,Islamabad,Roots School,A+`;

function parseCSV(text) {
  const lines = text.trim().split("\n").filter(Boolean);
  if (lines.length < 2) return { headers: [], rows: [] };
  const headers = lines[0].split(",").map((h) => h.trim().replace(/"/g, ""));
  const rows = lines.slice(1).map((line) => {
    const values = line.split(",").map((v) => v.trim().replace(/"/g, ""));
    const row = {};
    headers.forEach((h, i) => {
      row[h] = values[i] || "";
    });
    return row;
  });
  return { headers, rows };
}

function validateRow(row, mapping) {
  const errors = [];
  if (!row[mapping.studentName]?.trim()) errors.push("Student name missing");
  if (!row[mapping.fatherName]?.trim()) errors.push("Father's name missing");
  if (!row[mapping.phone]?.trim()) errors.push("Phone missing");
  if (!row[mapping.gender]?.trim()) errors.push("Gender missing");
  if (!row[mapping.dob]?.trim()) errors.push("Date of birth missing");
  if (!row[mapping.applyingClass]?.trim()) errors.push("Class missing");
  if (
    row[mapping.phone] &&
    !/^03\d{9}$/.test(row[mapping.phone]?.replace(/\s/g, ""))
  ) {
    errors.push("Phone format invalid (e.g. 03001234567)");
  }
  return errors;
}

// ── Steps ─────────────────────────────────────────────────────────────────────
const STEPS = ["Upload CSV", "Map Columns", "Review & Import"];

// ── Main Component ────────────────────────────────────────────────────────────
function BulkAdmission() {
  const [step, setStep] = useState(0); // 0,1,2
  const [csvHeaders, setCsvHeaders] = useState([]);
  const [csvRows, setCsvRows] = useState([]);
  const [fileName, setFileName] = useState("");
  const [mapping, setMapping] = useState({});
  const [importing, setImporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [imported, setImported] = useState(null); // { success, failed }
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef(null);

  // Manual rows state (for add-row mode)
  const [manualRows, setManualRows] = useState([
    {
      id: 1,
      studentName: "",
      fatherName: "",
      phone: "",
      gender: "Female",
      dob: "",
      applyingClass: "",
      email: "",
      address: "",
    },
  ]);

  const [mode, setMode] = useState("csv"); // "csv" | "manual"

  // ── CSV handling ────────────────────────────────────────────────────────────
  const processFile = (file) => {
    if (!file || !file.name.endsWith(".csv")) return;
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      const { headers, rows } = parseCSV(e.target.result);
      setCsvHeaders(headers);
      setCsvRows(rows);
      // Auto-map: try to match header names to our column keys
      const autoMap = {};
      ALL_COLS.forEach((col) => {
        const label = COL_LABELS[col].toLowerCase();
        const match = headers.find(
          (h) =>
            h.toLowerCase().replace(/[^a-z]/g, "") ===
              label.replace(/[^a-z]/g, "") ||
            h.toLowerCase().includes(
              col
                .toLowerCase()
                .replace(/([A-Z])/g, " $1")
                .trim()
                .toLowerCase(),
            ),
        );
        if (match) autoMap[col] = match;
      });
      setMapping(autoMap);
      setStep(1);
    };
    reader.readAsText(file);
  };

  const onFileInput = (e) => processFile(e.target.files[0]);
  const onDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    processFile(e.dataTransfer.files[0]);
  };

  const downloadSample = () => {
    const blob = new Blob([SAMPLE_CSV], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "admission_sample.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  // ── Preview & validation ────────────────────────────────────────────────────
  const previewRows = useMemo(() => {
    if (mode === "manual")
      return manualRows.map((r) => ({
        ...r,
        _errors: validateRow(r, {
          studentName: "studentName",
          fatherName: "fatherName",
          phone: "phone",
          gender: "gender",
          dob: "dob",
          applyingClass: "applyingClass",
        }),
      }));
    return csvRows.map((row) => ({
      ...row,
      _errors: validateRow(row, mapping),
    }));
  }, [csvRows, mapping, mode, manualRows]);

  const validCount = previewRows.filter((r) => r._errors.length === 0).length;
  const invalidCount = previewRows.filter((r) => r._errors.length > 0).length;

  // ── Import ──────────────────────────────────────────────────────────────────
  const handleImport = () => {
    setImporting(true);
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          setImporting(false);
          setImported({ success: validCount, failed: invalidCount });
          return 100;
        }
        return p + 5;
      });
    }, 60);
  };

  const reset = () => {
    setStep(0);
    setCsvHeaders([]);
    setCsvRows([]);
    setFileName("");
    setMapping({});
    setProgress(0);
    setImported(null);
    setMode("csv");
    setManualRows([
      {
        id: 1,
        studentName: "",
        fatherName: "",
        phone: "",
        gender: "Female",
        dob: "",
        applyingClass: "",
        email: "",
        address: "",
      },
    ]);
  };

  // ── Manual rows ─────────────────────────────────────────────────────────────
  const addRow = () =>
    setManualRows((p) => [
      ...p,
      {
        id: Date.now(),
        studentName: "",
        fatherName: "",
        phone: "",
        gender: "Female",
        dob: "",
        applyingClass: "",
        email: "",
        address: "",
      },
    ]);
  const removeRow = (id) => setManualRows((p) => p.filter((r) => r.id !== id));
  const updateRow = (id, field, val) =>
    setManualRows((p) =>
      p.map((r) => (r.id === id ? { ...r, [field]: val } : r)),
    );

  const classes = [
    "Class 6",
    "Class 7",
    "Class 8",
    "Class 9",
    "Class 10",
    "Class 11",
    "Class 12",
  ];

  // ── Done screen ─────────────────────────────────────────────────────────────
  if (imported) {
    return (
      <div className="flex flex-col gap-6">
        <PageHeader title="Bulk Admission" subtitle="Import complete" />
        <div className="bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl p-10 flex flex-col items-center gap-4 text-center">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-950 rounded-full flex items-center justify-center">
            <CheckCircle
              size={32}
              className="text-green-600 dark:text-green-400"
            />
          </div>
          <h2 className="text-lg font-semibold text-light-text-primary dark:text-dark-text-primary">
            Import Complete
          </h2>
          <div className="flex gap-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                {imported.success}
              </p>
              <p className="text-sm text-light-text-tertiary dark:text-dark-text-tertiary">
                Imported
              </p>
            </div>
            {imported.failed > 0 && (
              <div className="text-center">
                <p className="text-3xl font-bold text-red-500">
                  {imported.failed}
                </p>
                <p className="text-sm text-light-text-tertiary dark:text-dark-text-tertiary">
                  Failed
                </p>
              </div>
            )}
          </div>
          <button
            onClick={reset}
            className="mt-2 px-6 py-2.5 bg-accent hover:bg-accent-hover text-white text-sm font-medium rounded-lg transition-colors"
          >
            Import More
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Bulk Admission"
        subtitle="Import multiple students via CSV or manual entry"
        action={
          <button
            onClick={downloadSample}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-light-border dark:border-dark-border bg-light-card dark:bg-dark-card text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary hover:bg-light-hover dark:hover:bg-dark-hover transition-colors"
          >
            <Download size={15} /> Download Sample CSV
          </button>
        }
      />

      {/* Step indicator */}
      <div className="flex items-center gap-0">
        {STEPS.map((label, idx) => (
          <div key={label} className="flex items-center">
            <div
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                step === idx
                  ? "bg-accent/10 text-accent"
                  : step > idx
                    ? "text-green-600 dark:text-green-400"
                    : "text-light-text-tertiary dark:text-dark-text-tertiary"
              }`}
            >
              <span
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  step > idx
                    ? "bg-green-100 dark:bg-green-950 text-green-600"
                    : step === idx
                      ? "bg-accent text-white"
                      : "bg-light-hover dark:bg-dark-hover"
                }`}
              >
                {step > idx ? "✓" : idx + 1}
              </span>
              {label}
            </div>
            {idx < STEPS.length - 1 && (
              <ChevronRight
                size={16}
                className="text-light-text-tertiary dark:text-dark-text-tertiary mx-1"
              />
            )}
          </div>
        ))}
      </div>

      {/* ─ Step 0: Upload ────────────────────────────────────────────────── */}
      {step === 0 && (
        <div className="flex flex-col gap-4">
          {/* Mode toggle */}
          <div className="flex gap-2">
            {["csv", "manual"].map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                  mode === m
                    ? "bg-accent text-white border-accent"
                    : "border-light-border dark:border-dark-border text-light-text-secondary dark:text-dark-text-secondary hover:bg-light-hover dark:hover:bg-dark-hover"
                }`}
              >
                {m === "csv" ? "Upload CSV" : "Manual Entry"}
              </button>
            ))}
          </div>

          {mode === "csv" ? (
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={onDrop}
              onClick={() => fileRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-12 flex flex-col items-center gap-4 cursor-pointer transition-colors ${
                dragOver
                  ? "border-accent bg-accent/5"
                  : "border-light-border dark:border-dark-border hover:border-accent/50 hover:bg-light-hover dark:hover:bg-dark-hover"
              }`}
            >
              <div className="w-14 h-14 bg-accent/10 rounded-full flex items-center justify-center">
                <Upload size={26} className="text-accent" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-light-text-primary dark:text-dark-text-primary">
                  Drag & drop a CSV file here, or click to browse
                </p>
                <p className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary mt-1">
                  Only .csv files are supported
                </p>
              </div>
              <input
                ref={fileRef}
                type="file"
                accept=".csv"
                onChange={onFileInput}
                className="hidden"
              />
            </div>
          ) : (
            /* Manual entry table */
            <div className="bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[900px] text-sm">
                  <thead>
                    <tr className="border-b border-light-border dark:border-dark-border">
                      {[
                        "Student Name",
                        "Father's Name",
                        "Phone",
                        "Gender",
                        "DOB",
                        "Class",
                        "Email",
                        "",
                      ].map((h) => (
                        <th
                          key={h}
                          className="px-3 py-2.5 text-left text-xs font-medium text-light-text-tertiary dark:text-dark-text-tertiary uppercase tracking-wide"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {manualRows.map((row) => (
                      <tr
                        key={row.id}
                        className="border-b border-light-border dark:border-dark-border last:border-0"
                      >
                        {[
                          { field: "studentName", type: "text" },
                          { field: "fatherName", type: "text" },
                          { field: "phone", type: "text" },
                          { field: "dob", type: "date" },
                        ].map(({ field, type }) => (
                          <td key={field} className="px-2 py-1.5">
                            <input
                              type={type}
                              value={row[field]}
                              onChange={(e) =>
                                updateRow(row.id, field, e.target.value)
                              }
                              className="w-full rounded-lg border border-light-border dark:border-dark-border bg-light-bg dark:bg-dark-bg px-2 py-1 text-sm text-light-text-primary dark:text-dark-text-primary outline-none focus:border-accent transition-colors"
                            />
                          </td>
                        ))}
                        <td className="px-2 py-1.5">
                          <select
                            value={row.gender}
                            onChange={(e) =>
                              updateRow(row.id, "gender", e.target.value)
                            }
                            className="w-full rounded-lg border border-light-border dark:border-dark-border bg-light-bg dark:bg-dark-bg px-2 py-1 text-sm text-light-text-primary dark:text-dark-text-primary outline-none focus:border-accent"
                          >
                            <option>Female</option>
                            <option>Male</option>
                          </select>
                        </td>
                        <td className="px-2 py-1.5">
                          <select
                            value={row.applyingClass}
                            onChange={(e) =>
                              updateRow(row.id, "applyingClass", e.target.value)
                            }
                            className="w-full rounded-lg border border-light-border dark:border-dark-border bg-light-bg dark:bg-dark-bg px-2 py-1 text-sm text-light-text-primary dark:text-dark-text-primary outline-none focus:border-accent"
                          >
                            <option value="">Select...</option>
                            {classes.map((c) => (
                              <option key={c}>{c}</option>
                            ))}
                          </select>
                        </td>
                        <td className="px-2 py-1.5">
                          <input
                            type="email"
                            value={row.email}
                            onChange={(e) =>
                              updateRow(row.id, "email", e.target.value)
                            }
                            placeholder="Optional"
                            className="w-full rounded-lg border border-light-border dark:border-dark-border bg-light-bg dark:bg-dark-bg px-2 py-1 text-sm text-light-text-primary dark:text-dark-text-primary outline-none focus:border-accent placeholder:text-light-text-tertiary"
                          />
                        </td>
                        <td className="px-2 py-1.5">
                          <button
                            onClick={() => removeRow(row.id)}
                            className="w-7 h-7 flex items-center justify-center rounded-lg text-light-text-tertiary hover:bg-red-50 dark:hover:bg-red-950 hover:text-red-500 transition-colors"
                          >
                            <X size={13} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="p-3 border-t border-light-border dark:border-dark-border">
                <button
                  onClick={addRow}
                  className="flex items-center gap-1.5 text-sm text-accent hover:text-accent-hover font-medium transition-colors"
                >
                  <Plus size={15} /> Add Row
                </button>
              </div>
            </div>
          )}

          {mode === "manual" && (
            <div className="flex justify-end">
              <button
                onClick={() => setStep(2)}
                className="flex items-center gap-2 px-5 py-2.5 bg-accent hover:bg-accent-hover text-white text-sm font-medium rounded-lg transition-colors"
              >
                Review Entries <ChevronRight size={15} />
              </button>
            </div>
          )}
        </div>
      )}

      {/* ─ Step 1: Map columns ───────────────────────────────────────────── */}
      {step === 1 && (
        <div className="flex flex-col gap-4">
          <div className="bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl p-4">
            <div className="flex items-center gap-3 mb-4">
              <FileText
                size={16}
                className="text-light-text-tertiary dark:text-dark-text-tertiary"
              />
              <span className="text-sm font-medium text-light-text-primary dark:text-dark-text-primary">
                {fileName}
              </span>
              <span className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary">
                {csvRows.length} rows detected
              </span>
            </div>
            <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary mb-4">
              Map your CSV columns to the required fields. Required fields are
              marked with *.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {ALL_COLS.map((col) => (
                <div key={col} className="flex items-center gap-3">
                  <span className="text-xs font-medium text-light-text-secondary dark:text-dark-text-secondary w-36 shrink-0">
                    {COL_LABELS[col]}
                    {REQUIRED_COLS.includes(col) ? " *" : ""}
                  </span>
                  <select
                    value={mapping[col] || ""}
                    onChange={(e) =>
                      setMapping((p) => ({ ...p, [col]: e.target.value }))
                    }
                    className={`flex-1 rounded-lg border px-3 py-1.5 text-sm outline-none focus:border-accent transition-colors bg-light-bg dark:bg-dark-bg text-light-text-primary dark:text-dark-text-primary ${
                      REQUIRED_COLS.includes(col) && !mapping[col]
                        ? "border-amber-400 dark:border-amber-600"
                        : "border-light-border dark:border-dark-border"
                    }`}
                  >
                    <option value="">— Not mapped —</option>
                    {csvHeaders.map((h) => (
                      <option key={h} value={h}>
                        {h}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          </div>

          {/* CSV preview */}
          <div className="bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl overflow-hidden">
            <p className="px-4 py-3 text-xs font-medium text-light-text-tertiary dark:text-dark-text-tertiary border-b border-light-border dark:border-dark-border">
              CSV PREVIEW (first 3 rows)
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-xs min-w-[600px]">
                <thead>
                  <tr className="border-b border-light-border dark:border-dark-border">
                    {csvHeaders.map((h) => (
                      <th
                        key={h}
                        className="px-3 py-2 text-left font-medium text-light-text-tertiary dark:text-dark-text-tertiary"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {csvRows.slice(0, 3).map((row, i) => (
                    <tr
                      key={i}
                      className="border-b border-light-border dark:border-dark-border last:border-0"
                    >
                      {csvHeaders.map((h) => (
                        <td
                          key={h}
                          className="px-3 py-2 text-light-text-secondary dark:text-dark-text-secondary"
                        >
                          {row[h] || "—"}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex justify-between">
            <button
              onClick={() => setStep(0)}
              className="px-4 py-2 rounded-lg border border-light-border dark:border-dark-border text-sm font-medium text-light-text-secondary hover:bg-light-hover dark:hover:bg-dark-hover transition-colors"
            >
              Back
            </button>
            <button
              onClick={() => setStep(2)}
              disabled={REQUIRED_COLS.some((col) => !mapping[col])}
              className="flex items-center gap-2 px-5 py-2.5 bg-accent hover:bg-accent-hover text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Review Data <ChevronRight size={15} />
            </button>
          </div>
        </div>
      )}

      {/* ─ Step 2: Review & import ──────────────────────────────────────── */}
      {step === 2 && (
        <div className="flex flex-col gap-4">
          {/* Summary */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div className="bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl p-4">
              <p className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary mb-1">
                Total Rows
              </p>
              <p className="text-2xl font-bold text-light-text-primary dark:text-dark-text-primary">
                {previewRows.length}
              </p>
            </div>
            <div className="bg-green-50 dark:bg-green-950/40 border border-green-200 dark:border-green-800 rounded-xl p-4">
              <p className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary mb-1">
                Valid
              </p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                {validCount}
              </p>
            </div>
            {invalidCount > 0 && (
              <div className="bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-xl p-4">
                <p className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary mb-1">
                  Errors
                </p>
                <p className="text-2xl font-bold text-red-500">
                  {invalidCount}
                </p>
              </div>
            )}
          </div>

          {/* Preview table */}
          <div className="bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[800px]">
                <thead>
                  <tr className="border-b border-light-border dark:border-dark-border">
                    <th className="px-3 py-2.5 text-left text-xs font-medium text-light-text-tertiary dark:text-dark-text-tertiary uppercase">
                      #
                    </th>
                    {[
                      "Student Name",
                      "Father",
                      "Phone",
                      "Gender",
                      "DOB",
                      "Class",
                      "Status",
                    ].map((h) => (
                      <th
                        key={h}
                        className="px-3 py-2.5 text-left text-xs font-medium text-light-text-tertiary dark:text-dark-text-tertiary uppercase"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {previewRows.map((row, i) => {
                    const isManual = mode === "manual";
                    const name = isManual
                      ? row.studentName
                      : row[mapping.studentName];
                    const father = isManual
                      ? row.fatherName
                      : row[mapping.fatherName];
                    const phone = isManual ? row.phone : row[mapping.phone];
                    const gender = isManual ? row.gender : row[mapping.gender];
                    const dob = isManual ? row.dob : row[mapping.dob];
                    const cls = isManual
                      ? row.applyingClass
                      : row[mapping.applyingClass];
                    const valid = row._errors.length === 0;
                    return (
                      <tr
                        key={i}
                        className={`border-b border-light-border dark:border-dark-border last:border-0 ${!valid ? "bg-red-50/50 dark:bg-red-950/20" : ""}`}
                      >
                        <td className="px-3 py-2 text-xs text-light-text-tertiary dark:text-dark-text-tertiary">
                          {i + 1}
                        </td>
                        <td className="px-3 py-2 text-sm font-medium text-light-text-primary dark:text-dark-text-primary">
                          {name || "—"}
                        </td>
                        <td className="px-3 py-2 text-sm text-light-text-secondary dark:text-dark-text-secondary">
                          {father || "—"}
                        </td>
                        <td className="px-3 py-2 text-sm text-light-text-secondary dark:text-dark-text-secondary">
                          {phone || "—"}
                        </td>
                        <td className="px-3 py-2 text-sm text-light-text-secondary dark:text-dark-text-secondary">
                          {gender || "—"}
                        </td>
                        <td className="px-3 py-2 text-sm text-light-text-secondary dark:text-dark-text-secondary">
                          {dob || "—"}
                        </td>
                        <td className="px-3 py-2 text-sm text-light-text-secondary dark:text-dark-text-secondary">
                          {cls || "—"}
                        </td>
                        <td className="px-3 py-2">
                          {valid ? (
                            <span className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
                              <CheckCircle size={13} /> Valid
                            </span>
                          ) : (
                            <span
                              title={row._errors.join(", ")}
                              className="flex items-center gap-1 text-xs text-red-500 cursor-help"
                            >
                              <AlertCircle size={13} /> {row._errors.length}{" "}
                              error{row._errors.length > 1 ? "s" : ""}
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Progress bar */}
          {importing && (
            <div className="bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-light-text-primary dark:text-dark-text-primary">
                  Importing...
                </span>
                <span className="text-sm text-light-text-tertiary dark:text-dark-text-tertiary">
                  {progress}%
                </span>
              </div>
              <div className="w-full bg-light-hover dark:bg-dark-hover rounded-full h-2">
                <div
                  className="bg-accent h-2 rounded-full transition-all duration-100"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          <div className="flex justify-between">
            <button
              onClick={() => setStep(mode === "manual" ? 0 : 1)}
              className="px-4 py-2 rounded-lg border border-light-border dark:border-dark-border text-sm font-medium text-light-text-secondary hover:bg-light-hover dark:hover:bg-dark-hover transition-colors"
            >
              Back
            </button>
            <button
              onClick={handleImport}
              disabled={importing || validCount === 0}
              className="flex items-center gap-2 px-5 py-2.5 bg-accent hover:bg-accent-hover text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {importing ? (
                <Loader2 size={15} className="animate-spin" />
              ) : (
                <Upload size={15} />
              )}
              {importing
                ? "Importing..."
                : `Import ${validCount} Student${validCount !== 1 ? "s" : ""}`}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default BulkAdmission;
