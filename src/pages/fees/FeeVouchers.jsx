import { useState, useMemo, useRef } from "react";
import {
  ArrowLeft,
  Printer,
  Search,
  Check,
  Loader2,
  CheckSquare,
  Square,
  Banknote,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../../components/common/PageHeader";
import {
  mockStudents,
  mockFeePayments,
  feeStatusStyles,
} from "../../data/mockData";
import StatusPill from "../../components/common/StatusPill";

// ── Constants ─────────────────────────────────────────────────────────────────
const MONTHS = [
  "May 2026",
  "April 2026",
  "March 2026",
  "February 2026",
  "January 2026",
];
const CLASSES = [
  "All Classes",
  ...[...new Set(mockStudents.map((s) => s.class))],
];
const COPY_OPTIONS = [
  { id: 1, label: "1 Copy", desc: "Student copy only" },
  { id: 3, label: "3 Copies", desc: "Student · School · Accounts" },
  { id: "thermal", label: "Thermal", desc: "Narrow thermal receipt" },
  { id: "family", label: "Family", desc: "All children in one slip" },
];
const SCHOOL = {
  name: "EduLink School & College",
  address: "Rawalpindi, Punjab",
  phone: "051-1234567",
};

// ── Voucher components ────────────────────────────────────────────────────────
function VoucherCopy({ student, payment, month, copyLabel, thermal = false }) {
  const dueDate = `10 ${month}`;
  if (thermal) {
    return (
      <div className="w-[230px] bg-white border border-dashed border-gray-400 font-mono text-[10px] text-black p-2">
        <div className="text-center mb-1">
          <p className="font-bold text-[11px] uppercase">{SCHOOL.name}</p>
          <p className="text-gray-500">{SCHOOL.phone}</p>
          <div className="border-b border-dashed border-gray-300 my-1" />
          <p className="font-bold">FEE VOUCHER</p>
        </div>
        <div className="flex flex-col gap-0.5 mb-1">
          {[
            ["Name", student.name],
            ["Class", student.class],
            ["Roll No", student.rollNo],
            ["Month", month],
            ["Due", dueDate],
          ].map(([k, v]) => (
            <div key={k} className="flex justify-between">
              <span className="text-gray-500">{k}:</span>
              <span className="font-semibold">{v}</span>
            </div>
          ))}
        </div>
        <div className="border-t border-dashed border-gray-300 pt-1 flex justify-between font-bold text-[11px]">
          <span>AMOUNT</span>
          <span>Rs. {(payment?.amount || 4500).toLocaleString()}</span>
        </div>
        <p className="text-center text-gray-400 text-[9px] mt-1">
          Keep this receipt safe
        </p>
      </div>
    );
  }
  return (
    <div className="w-full bg-white border border-gray-300 rounded font-sans text-[11px] text-gray-900 overflow-hidden">
      <div className="bg-gray-800 text-white px-3 py-2 flex justify-between">
        <div>
          <p className="font-bold text-[10px] uppercase tracking-wide">
            {SCHOOL.name}
          </p>
          <p className="text-[9px] opacity-70">
            {SCHOOL.address} · {SCHOOL.phone}
          </p>
        </div>
        <div className="text-right">
          <p className="font-bold text-[10px]">FEE VOUCHER</p>
          <p className="text-[9px] opacity-70">{month}</p>
        </div>
      </div>
      <div className="px-3 py-2 grid grid-cols-2 gap-x-3 gap-y-1">
        {[
          ["Student Name", student.name],
          ["Roll No", student.rollNo],
          ["Class", student.class],
          ["Month", month],
          ["Due Date", dueDate],
          ["Voucher No", `V${String(student.id).padStart(4, "0")}`],
        ].map(([k, v]) => (
          <div key={k}>
            <p className="text-gray-400 text-[9px]">{k}</p>
            <p className="font-semibold text-[10px]">{v}</p>
          </div>
        ))}
      </div>
      <div className="mx-3 mb-2 p-2 bg-gray-50 border border-gray-200 rounded flex justify-between items-center">
        <span className="font-bold text-[11px]">Total Amount</span>
        <span className="font-black text-sm">
          Rs. {(payment?.amount || 4500).toLocaleString()}
        </span>
      </div>
      <div className="px-3 pb-2 flex justify-between text-[9px] text-gray-400">
        <span>{copyLabel || "Student Copy"}</span>
        <span>Signature: ___________</span>
      </div>
    </div>
  );
}

function FamilyVoucher({ students, payments, month }) {
  const total = students.reduce((acc, s) => {
    const p = payments.find((p) => p.studentId === s.id);
    return acc + (p?.amount || 4500);
  }, 0);
  return (
    <div className="w-full bg-white border border-gray-300 rounded font-sans text-[11px] text-gray-900 overflow-hidden">
      <div className="bg-gray-800 text-white px-3 py-2">
        <p className="font-bold text-[10px] uppercase">
          {SCHOOL.name} — Family Fee Voucher
        </p>
        <p className="text-[9px] opacity-70">{month}</p>
      </div>
      <div className="px-3 py-2">
        <table className="w-full text-[10px] border-collapse mb-2">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-0.5 text-gray-500">Student</th>
              <th className="text-left text-gray-500">Class</th>
              <th className="text-right text-gray-500">Amount</th>
            </tr>
          </thead>
          <tbody>
            {students.map((s) => {
              const p = payments.find((p) => p.studentId === s.id);
              return (
                <tr key={s.id} className="border-b border-gray-100">
                  <td className="py-0.5 font-medium">{s.name}</td>
                  <td>{s.class}</td>
                  <td className="text-right">
                    Rs. {(p?.amount || 4500).toLocaleString()}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className="flex justify-between font-bold text-[11px] border-t border-gray-200 pt-1">
          <span>Total ({students.length} students)</span>
          <span>Rs. {total.toLocaleString()}</span>
        </div>
      </div>
      <div className="px-3 pb-2 flex justify-between text-[9px] text-gray-400">
        <span>Family Voucher</span>
        <span>Signature: ___________</span>
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
function FeeVouchers() {
  const navigate = useNavigate();
  const printRef = useRef(null);
  const [month, setMonth] = useState(MONTHS[0]);
  const [classFilter, setClass] = useState("All Classes");
  const [copyOption, setCopy] = useState(3);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(new Set());
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);

  const students = mockStudents.slice(0, 12);
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
  const isThermal = copyOption === "thermal";
  const isFamily = copyOption === "family";
  const copies = isFamily || isThermal ? 1 : Number(copyOption);
  const copyLabels = ["Student Copy", "School Copy", "Accounts Copy"];

  const handleGenerate = () => {
    if (selected.size === 0) return;
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      setGenerated(true);
    }, 700);
  };

  const handlePrint = () => {
    const content = printRef.current?.innerHTML;
    const w = window.open("", "_blank");
    w.document.write(`<html><head><title>Fee Vouchers — ${month}</title>
      <style>*{box-sizing:border-box}body{font-family:Arial,sans-serif;margin:0;padding:12px;background:#fff}
      .wrap{display:flex;flex-wrap:wrap;gap:12px}.item{page-break-inside:avoid}
      @media print{@page{margin:8mm}body{padding:0}}</style></head>
      <body><div class="wrap">${content}</div></body></html>`);
    w.document.close();
    w.print();
  };

  return (
    <div className="flex flex-col gap-5">
      <PageHeader
        title="Fee Vouchers"
        subtitle="Generate and print fee slips for students"
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
                <Banknote size={15} />
              )}
              {generating
                ? "Generating…"
                : `Generate ${selected.size > 0 ? selected.size : ""} Voucher${selected.size !== 1 ? "s" : ""}`}
            </button>
          </div>
        }
      />

      {/* Controls */}
      <div className="flex flex-wrap gap-3">
        <select
          value={month}
          onChange={(e) => {
            setMonth(e.target.value);
            setGenerated(false);
          }}
          className="px-3 py-2 rounded-lg border border-light-border dark:border-dark-border bg-light-card dark:bg-dark-card text-sm text-light-text-primary dark:text-dark-text-primary outline-none focus:border-accent transition-colors"
        >
          {MONTHS.map((m) => (
            <option key={m}>{m}</option>
          ))}
        </select>
        <select
          value={classFilter}
          onChange={(e) => setClass(e.target.value)}
          className="px-3 py-2 rounded-lg border border-light-border dark:border-dark-border bg-light-card dark:bg-dark-card text-sm text-light-text-primary dark:text-dark-text-primary outline-none focus:border-accent transition-colors"
        >
          {CLASSES.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
        <div className="flex gap-2 flex-wrap">
          {COPY_OPTIONS.map((opt) => (
            <button
              key={opt.id}
              onClick={() => {
                setCopy(opt.id);
                setGenerated(false);
              }}
              className={`px-3 py-2 rounded-lg border text-xs font-medium transition-colors ${copyOption === opt.id ? "bg-accent text-white border-accent" : "border-light-border dark:border-dark-border text-light-text-secondary dark:text-dark-text-secondary hover:bg-light-hover dark:hover:bg-dark-hover"}`}
            >
              {opt.label}
              <span className="block text-[10px] opacity-70 font-normal">
                {opt.desc}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Student selector */}
        <div className="bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl overflow-hidden">
          <div className="px-4 py-3 border-b border-light-border dark:border-dark-border flex items-center gap-3">
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
              className="flex items-center gap-1.5 text-xs text-accent hover:text-accent-hover font-medium whitespace-nowrap"
            >
              {allSelected ? <CheckSquare size={14} /> : <Square size={14} />}
              {allSelected ? "Deselect All" : "Select All"}
            </button>
          </div>
          <div className="divide-y divide-light-border dark:divide-dark-border max-h-[400px] overflow-y-auto">
            {filtered.map((s) => {
              const payment = mockFeePayments.find(
                (p) => p.studentId === s.id && p.month === month,
              );
              return (
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
                  <div className="shrink-0">
                    {payment ? (
                      <StatusPill
                        status={payment.status}
                        styles={feeStatusStyles}
                      />
                    ) : (
                      <span className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary">
                        No record
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="px-4 py-2.5 border-t border-light-border dark:border-dark-border">
            <p className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary">
              {selected.size} of {filtered.length} selected
            </p>
          </div>
        </div>

        {/* Live preview */}
        <div className="bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl overflow-hidden">
          <div className="px-4 py-3 border-b border-light-border dark:border-dark-border">
            <h3 className="text-sm font-semibold text-light-text-primary dark:text-dark-text-primary">
              Live Preview
            </h3>
            <p className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary mt-0.5">
              {isThermal
                ? "Thermal receipt"
                : isFamily
                  ? "Family voucher"
                  : `${copies} ${copies === 1 ? "copy" : "copies"} per student`}
            </p>
          </div>
          <div className="p-4 flex flex-col gap-3 overflow-auto max-h-[400px]">
            {selectedStudents.length > 0 ? (
              isFamily ? (
                <FamilyVoucher
                  students={selectedStudents}
                  payments={mockFeePayments}
                  month={month}
                />
              ) : (
                Array.from({ length: copies }).map((_, i) => (
                  <VoucherCopy
                    key={i}
                    student={selectedStudents[0]}
                    payment={mockFeePayments.find(
                      (p) => p.studentId === selectedStudents[0].id,
                    )}
                    month={month}
                    copyLabel={copyLabels[i]}
                    thermal={isThermal}
                  />
                ))
              )
            ) : (
              <div className="flex flex-col items-center justify-center py-12 gap-2">
                <Banknote
                  size={22}
                  className="text-light-text-tertiary dark:text-dark-text-tertiary"
                />
                <p className="text-sm text-light-text-tertiary dark:text-dark-text-tertiary">
                  Select students to preview
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Generated vouchers */}
      {generated && selectedStudents.length > 0 && (
        <div className="bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl overflow-hidden">
          <div className="px-4 py-3 border-b border-light-border dark:border-dark-border flex items-center justify-between">
            <h3 className="text-sm font-semibold text-light-text-primary dark:text-dark-text-primary">
              Generated — {selectedStudents.length} student
              {selectedStudents.length !== 1 ? "s" : ""} · {month}
            </h3>
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-3 py-1.5 bg-accent hover:bg-accent-hover text-white text-xs font-medium rounded-lg transition-colors"
            >
              <Printer size={13} /> Batch Print
            </button>
          </div>
          <div
            ref={printRef}
            className={`p-5 grid gap-6 ${isThermal ? "grid-cols-3 sm:grid-cols-4" : "grid-cols-1 sm:grid-cols-2"}`}
          >
            {isFamily ? (
              <FamilyVoucher
                students={selectedStudents}
                payments={mockFeePayments}
                month={month}
              />
            ) : (
              selectedStudents.map((s) => (
                <div key={s.id} className="flex flex-col gap-2">
                  {Array.from({ length: copies }).map((_, i) => (
                    <VoucherCopy
                      key={i}
                      student={s}
                      payment={mockFeePayments.find(
                        (p) => p.studentId === s.id,
                      )}
                      month={month}
                      copyLabel={copyLabels[i]}
                      thermal={isThermal}
                    />
                  ))}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default FeeVouchers;
