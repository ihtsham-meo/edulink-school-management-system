import { useState, useMemo } from "react";
import {
  ArrowLeft,
  Play,
  Eye,
  Check,
  Loader2,
  AlertCircle,
  ChevronRight,
  RefreshCw,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../../components/common/PageHeader";
import { mockStudents } from "../../data/mockData";
import StatusPill from "../../components/common/StatusPill";

const CLASSES = [...new Set(mockStudents.map((s) => s.class))].sort();
const MONTHS = [
  "May 2026",
  "June 2026",
  "July 2026",
  "August 2026",
  "September 2026",
  "October 2026",
];
const FEE_TYPES = [
  {
    id: "monthly",
    label: "Monthly Tuition",
    desc: "Regular monthly fee for all students",
    baseAmount: 4500,
  },
  {
    id: "transport",
    label: "Transport Fee",
    desc: "Bus route fee for transport students",
    baseAmount: 1200,
  },
  {
    id: "exam",
    label: "Exam Fee",
    desc: "Charged once per term examination",
    baseAmount: 800,
  },
  {
    id: "library",
    label: "Library Fee",
    desc: "Annual library membership fee",
    baseAmount: 500,
  },
  {
    id: "custom",
    label: "Custom Amount",
    desc: "Enter a custom fee amount",
    baseAmount: null,
  },
];

const resultStyles = {
  pending: "bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400",
  generated: "bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-400",
  skipped: "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400",
};

function FeeRow({ student, amount, status }) {
  return (
    <div className="grid grid-cols-[1.8fr_0.8fr_1fr_1fr_1fr] items-center gap-2 px-4 py-2.5 border-b border-light-border dark:border-dark-border last:border-0 hover:bg-light-hover dark:hover:bg-dark-hover transition-colors min-w-[520px]">
      <div className="flex items-center gap-2 min-w-0">
        <div className="w-7 h-7 rounded-full bg-accent/10 flex items-center justify-center text-accent text-xs font-bold shrink-0">
          {student.name.charAt(0)}
        </div>
        <p className="text-sm font-medium text-light-text-primary dark:text-dark-text-primary truncate">
          {student.name}
        </p>
      </div>
      <span className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary">
        {student.class}
      </span>
      <span className="text-xs font-mono text-light-text-tertiary dark:text-dark-text-tertiary">
        {student.rollNo}
      </span>
      <span className="text-sm font-semibold text-light-text-primary dark:text-dark-text-primary">
        Rs. {amount.toLocaleString()}
      </span>
      <StatusPill status={status} styles={resultStyles} />
    </div>
  );
}

function GenerateFee() {
  const navigate = useNavigate();
  const [feeType, setFeeType] = useState("monthly");
  const [month, setMonth] = useState(MONTHS[0]);
  const [selectedClasses, setSelCls] = useState(new Set(CLASSES));
  const [customAmount, setCustom] = useState("");
  const [isDryRun, setIsDryRun] = useState(true);
  const [step, setStep] = useState("configure");
  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState([]);

  const feeConfig = FEE_TYPES.find((f) => f.id === feeType);
  const amount =
    feeType === "custom"
      ? Number(customAmount) || 0
      : feeConfig?.baseAmount || 0;
  const affected = useMemo(
    () => mockStudents.filter((s) => selectedClasses.has(s.class)),
    [selectedClasses],
  );
  const totalAmt = amount * affected.length;
  const allSel = CLASSES.every((c) => selectedClasses.has(c));

  const toggleCls = (c) =>
    setSelCls((p) => {
      const n = new Set(p);
      n.has(c) ? n.delete(c) : n.add(c);
      return n;
    });
  const toggleAll = () => setSelCls(allSel ? new Set() : new Set(CLASSES));

  const handleGenerate = () => {
    setRunning(true);
    setProgress(0);
    const iv = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(iv);
          setResults(
            affected.map((s) => ({
              student: s,
              amount,
              status: isDryRun ? "pending" : "generated",
            })),
          );
          setRunning(false);
          setStep("done");
          return 100;
        }
        return p + 5;
      });
    }, 40);
  };

  const reset = () => {
    setStep("configure");
    setProgress(0);
    setResults([]);
    setRunning(false);
  };

  const StepDot = ({ idx, label }) => {
    const map = { configure: 0, preview: 1, done: 2 };
    const cur = map[step];
    const done = cur > idx;
    const active = cur === idx;
    return (
      <div className="flex items-center">
        <div
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium ${active ? "bg-accent/10 text-accent" : done ? "text-green-600 dark:text-green-400" : "text-light-text-tertiary dark:text-dark-text-tertiary"}`}
        >
          <span
            className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${done ? "bg-green-100 dark:bg-green-950 text-green-600" : active ? "bg-accent text-white" : "bg-light-hover dark:bg-dark-hover"}`}
          >
            {done ? "✓" : idx + 1}
          </span>
          {label}
        </div>
        {idx < 2 && (
          <ChevronRight
            size={14}
            className="text-light-text-tertiary dark:text-dark-text-tertiary mx-0.5"
          />
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-5">
      <PageHeader
        title="Generate Fee"
        subtitle="Create fee records for one or more classes"
        action={
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg border border-light-border dark:border-dark-border bg-light-card dark:bg-dark-card text-sm text-light-text-secondary dark:text-dark-text-secondary hover:bg-light-hover dark:hover:bg-dark-hover transition-colors"
          >
            <ArrowLeft size={15} /> Back
          </button>
        }
      />

      {/* Steps */}
      <div className="flex items-center gap-0.5">
        {["Configure", "Preview", "Generate"].map((l, i) => (
          <StepDot key={l} idx={i} label={l} />
        ))}
      </div>

      {/* ── STEP 1: Configure ─────────────────────────────────────────── */}
      {step === "configure" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2 flex flex-col gap-4">
            {/* Fee type */}
            <div className="bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl p-5">
              <h3 className="text-sm font-semibold text-light-text-primary dark:text-dark-text-primary mb-4">
                Fee Type
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {FEE_TYPES.map((ft) => (
                  <button
                    key={ft.id}
                    onClick={() => setFeeType(ft.id)}
                    className={`flex items-start gap-3 p-3 rounded-xl border text-left transition-colors ${feeType === ft.id ? "border-accent bg-accent/5" : "border-light-border dark:border-dark-border hover:bg-light-hover dark:hover:bg-dark-hover"}`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full border-2 mt-0.5 shrink-0 flex items-center justify-center ${feeType === ft.id ? "border-accent" : "border-light-border dark:border-dark-border"}`}
                    >
                      {feeType === ft.id && (
                        <div className="w-2 h-2 rounded-full bg-accent" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-light-text-primary dark:text-dark-text-primary">
                        {ft.label}
                      </p>
                      <p className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary mt-0.5">
                        {ft.desc}
                      </p>
                      {ft.baseAmount && (
                        <p className="text-xs font-semibold text-accent mt-1">
                          Rs. {ft.baseAmount.toLocaleString()}
                        </p>
                      )}
                    </div>
                  </button>
                ))}
              </div>
              {feeType === "custom" && (
                <div className="mt-4">
                  <label className="block text-xs font-medium text-light-text-secondary dark:text-dark-text-secondary mb-1">
                    Custom Amount (Rs.)
                  </label>
                  <input
                    type="number"
                    value={customAmount}
                    onChange={(e) => setCustom(e.target.value)}
                    placeholder="Enter amount…"
                    className="w-48 rounded-lg border border-light-border dark:border-dark-border bg-light-bg dark:bg-dark-bg px-3 py-2 text-sm text-light-text-primary dark:text-dark-text-primary outline-none focus:border-accent transition-colors"
                  />
                </div>
              )}
            </div>

            {/* Month */}
            <div className="bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl p-5">
              <h3 className="text-sm font-semibold text-light-text-primary dark:text-dark-text-primary mb-3">
                Month
              </h3>
              <div className="flex flex-wrap gap-2">
                {MONTHS.map((m) => (
                  <button
                    key={m}
                    onClick={() => setMonth(m)}
                    className={`px-3 py-1.5 rounded-lg border text-sm font-medium transition-colors ${month === m ? "bg-accent text-white border-accent" : "border-light-border dark:border-dark-border text-light-text-secondary dark:text-dark-text-secondary hover:bg-light-hover dark:hover:bg-dark-hover"}`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            {/* Classes */}
            <div className="bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-light-text-primary dark:text-dark-text-primary">
                  Target Classes
                </h3>
                <button
                  onClick={toggleAll}
                  className="text-xs text-accent hover:text-accent-hover font-medium transition-colors"
                >
                  {allSel ? "Deselect All" : "Select All"}
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {CLASSES.map((c) => (
                  <button
                    key={c}
                    onClick={() => toggleCls(c)}
                    className={`px-3 py-1.5 rounded-lg border text-sm font-medium transition-colors ${selectedClasses.has(c) ? "bg-accent text-white border-accent" : "border-light-border dark:border-dark-border text-light-text-secondary dark:text-dark-text-secondary hover:bg-light-hover dark:hover:bg-dark-hover"}`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Summary card */}
          <div>
            <div className="bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl p-5 sticky top-4">
              <h3 className="text-sm font-semibold text-light-text-primary dark:text-dark-text-primary mb-4">
                Summary
              </h3>
              <div className="flex flex-col gap-3 mb-5">
                {[
                  ["Fee Type", feeConfig?.label || "Custom"],
                  ["Month", month],
                  ["Classes", `${selectedClasses.size} selected`],
                  ["Students", affected.length],
                  [
                    "Per Student",
                    amount ? `Rs. ${amount.toLocaleString()}` : "—",
                  ],
                  [
                    "Total",
                    totalAmt ? `Rs. ${totalAmt.toLocaleString()}` : "—",
                  ],
                ].map(([l, v]) => (
                  <div key={l} className="flex justify-between text-sm">
                    <span className="text-light-text-tertiary dark:text-dark-text-tertiary">
                      {l}
                    </span>
                    <span className="font-medium text-light-text-primary dark:text-dark-text-primary">
                      {v}
                    </span>
                  </div>
                ))}
              </div>
              <div
                className={`flex items-center gap-2 px-3 py-2 rounded-lg mb-3 text-xs ${isDryRun ? "bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400" : "bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400"}`}
              >
                {isDryRun ? (
                  <>
                    <Eye size={12} /> Dry run — preview only
                  </>
                ) : (
                  <>
                    <AlertCircle size={12} /> Live mode — creates real records
                  </>
                )}
              </div>
              <button
                onClick={() => setIsDryRun((p) => !p)}
                className="w-full mb-3 px-3 py-1.5 rounded-lg border border-light-border dark:border-dark-border text-xs font-medium text-light-text-secondary dark:text-dark-text-secondary hover:bg-light-hover dark:hover:bg-dark-hover transition-colors"
              >
                Switch to {isDryRun ? "Live Mode" : "Dry Run"}
              </button>
              <button
                onClick={() => setStep("preview")}
                disabled={
                  !amount || selectedClasses.size === 0 || affected.length === 0
                }
                className="flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-accent hover:bg-accent-hover text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Eye size={15} /> Preview {affected.length} Students
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── STEP 2: Preview ───────────────────────────────────────────── */}
      {step === "preview" && (
        <div className="flex flex-col gap-4">
          <div
            className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-sm font-medium ${isDryRun ? "bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-400" : "bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-400"}`}
          >
            {isDryRun ? <Eye size={16} /> : <AlertCircle size={16} />}
            <div>
              <p>
                {isDryRun
                  ? "Dry Run — No records will be saved"
                  : "Live Mode — Fee records WILL be created"}
              </p>
              <p className="text-xs font-normal mt-0.5">
                {affected.length} students · {feeConfig?.label} · {month} · Rs.{" "}
                {amount.toLocaleString()} each · Total Rs.{" "}
                {totalAmt.toLocaleString()}
              </p>
            </div>
          </div>

          <div className="bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl overflow-hidden">
            <div className="px-4 py-3 border-b border-light-border dark:border-dark-border flex justify-between">
              <h3 className="text-sm font-semibold text-light-text-primary dark:text-dark-text-primary">
                Students to process ({affected.length})
              </h3>
              <span className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary">
                Total: Rs. {totalAmt.toLocaleString()}
              </span>
            </div>
            <div className="grid grid-cols-[1.8fr_0.8fr_1fr_1fr_1fr] items-center gap-2 px-4 py-2.5 border-b border-light-border dark:border-dark-border min-w-[520px]">
              {["Student", "Class", "Roll No", "Amount", "Status"].map((h) => (
                <span
                  key={h}
                  className="text-xs font-medium text-light-text-tertiary dark:text-dark-text-tertiary uppercase"
                >
                  {h}
                </span>
              ))}
            </div>
            <div className="overflow-x-auto max-h-[360px] overflow-y-auto">
              {affected.map((s) => (
                <FeeRow
                  key={s.id}
                  student={s}
                  amount={amount}
                  status="pending"
                />
              ))}
            </div>
          </div>

          {running && (
            <div className="bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl p-4">
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-light-text-primary dark:text-dark-text-primary">
                  {isDryRun ? "Simulating…" : "Generating records…"}
                </span>
                <span className="text-sm text-light-text-tertiary dark:text-dark-text-tertiary">
                  {progress}%
                </span>
              </div>
              <div className="w-full bg-light-hover dark:bg-dark-hover rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all ${isDryRun ? "bg-blue-500" : "bg-accent"}`}
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          <div className="flex justify-between">
            <button
              onClick={() => setStep("configure")}
              className="px-4 py-2 rounded-lg border border-light-border dark:border-dark-border text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary hover:bg-light-hover dark:hover:bg-dark-hover transition-colors"
            >
              Back
            </button>
            <button
              onClick={handleGenerate}
              disabled={running}
              className={`flex items-center gap-2 px-5 py-2.5 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-70 ${isDryRun ? "bg-blue-600 hover:bg-blue-700" : "bg-accent hover:bg-accent-hover"}`}
            >
              {running ? (
                <Loader2 size={15} className="animate-spin" />
              ) : isDryRun ? (
                <Eye size={15} />
              ) : (
                <Play size={15} />
              )}
              {running
                ? "Processing…"
                : isDryRun
                  ? "Run Dry Preview"
                  : `Generate for ${affected.length} Students`}
            </button>
          </div>
        </div>
      )}

      {/* ── STEP 3: Done ─────────────────────────────────────────────── */}
      {step === "done" && (
        <div className="flex flex-col gap-4">
          <div
            className={`flex items-center gap-3 px-4 py-4 rounded-xl border ${isDryRun ? "bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800" : "bg-green-50 dark:bg-green-950/40 border-green-200 dark:border-green-800"}`}
          >
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${isDryRun ? "bg-blue-100 dark:bg-blue-950" : "bg-green-100 dark:bg-green-950"}`}
            >
              {isDryRun ? (
                <Eye size={20} className="text-blue-600 dark:text-blue-400" />
              ) : (
                <Check
                  size={20}
                  className="text-green-600 dark:text-green-400"
                />
              )}
            </div>
            <div>
              <p
                className={`font-semibold text-sm ${isDryRun ? "text-blue-700 dark:text-blue-400" : "text-green-700 dark:text-green-400"}`}
              >
                {isDryRun
                  ? "Dry Run Complete — No records were saved"
                  : `Fee Generated for ${results.length} Students`}
              </p>
              <p className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary mt-0.5">
                {feeConfig?.label} · {month} · Rs. {totalAmt.toLocaleString()}{" "}
                total
              </p>
            </div>
          </div>

          <div className="bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl overflow-hidden">
            <div className="px-4 py-3 border-b border-light-border dark:border-dark-border">
              <h3 className="text-sm font-semibold text-light-text-primary dark:text-dark-text-primary">
                Results ({results.length})
              </h3>
            </div>
            <div className="grid grid-cols-[1.8fr_0.8fr_1fr_1fr_1fr] items-center gap-2 px-4 py-2.5 border-b border-light-border dark:border-dark-border min-w-[520px]">
              {["Student", "Class", "Roll No", "Amount", "Status"].map((h) => (
                <span
                  key={h}
                  className="text-xs font-medium text-light-text-tertiary dark:text-dark-text-tertiary uppercase"
                >
                  {h}
                </span>
              ))}
            </div>
            <div className="overflow-x-auto max-h-[360px] overflow-y-auto">
              {results.map(({ student, amount: a, status }) => (
                <FeeRow
                  key={student.id}
                  student={student}
                  amount={a}
                  status={status}
                />
              ))}
            </div>
          </div>

          <div className="flex justify-between">
            <button
              onClick={reset}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-light-border dark:border-dark-border text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary hover:bg-light-hover dark:hover:bg-dark-hover transition-colors"
            >
              <RefreshCw size={14} /> Generate Again
            </button>
            {isDryRun && (
              <button
                onClick={() => {
                  setIsDryRun(false);
                  setStep("preview");
                }}
                className="flex items-center gap-2 px-5 py-2.5 bg-accent hover:bg-accent-hover text-white text-sm font-medium rounded-lg transition-colors"
              >
                <Play size={15} /> Go Live — Create Real Records
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default GenerateFee;
