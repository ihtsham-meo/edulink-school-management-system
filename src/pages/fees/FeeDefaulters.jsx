import { useState, useMemo } from "react";
import {
  ArrowLeft,
  Search,
  MessageCircle,
  Phone,
  CheckCircle,
  Send,
  Loader2,
  Check,
  CheckSquare,
  Square,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../../components/common/PageHeader";

// ── Mock data ─────────────────────────────────────────────────────────────────
const MOCK_DEFAULTERS = [
  {
    id: 1,
    name: "Ali Hassan",
    class: "10-A",
    rollNo: "ST001",
    phone: "03001234501",
    fatherName: "Hassan Ali",
    monthsOverdue: ["March 2026", "April 2026", "May 2026"],
    totalDue: 13500,
  },
  {
    id: 2,
    name: "Ahmed Raza",
    class: "8-B",
    rollNo: "ST003",
    phone: "03021234503",
    fatherName: "Raza Ahmed",
    monthsOverdue: ["April 2026", "May 2026"],
    totalDue: 9000,
  },
  {
    id: 3,
    name: "Usman Tariq",
    class: "9-A",
    rollNo: "ST005",
    phone: "03041234505",
    fatherName: "Tariq Usman",
    monthsOverdue: ["May 2026"],
    totalDue: 4500,
  },
  {
    id: 4,
    name: "Kamran Baig",
    class: "7-A",
    rollNo: "ST007",
    phone: "03061234507",
    fatherName: "Baig Kamran",
    monthsOverdue: ["February 2026", "March 2026", "April 2026", "May 2026"],
    totalDue: 18000,
  },
  {
    id: 5,
    name: "Sadia Noor",
    class: "10-B",
    rollNo: "ST009",
    phone: "03081234509",
    fatherName: "Noor Ahmad",
    monthsOverdue: ["March 2026", "April 2026"],
    totalDue: 9000,
  },
  {
    id: 6,
    name: "Daniyal Shah",
    class: "11-A",
    rollNo: "ST011",
    phone: "03101234511",
    fatherName: "Shah Nawaz",
    monthsOverdue: ["May 2026"],
    totalDue: 4500,
  },
  {
    id: 7,
    name: "Rabia Malik",
    class: "6-A",
    rollNo: "ST013",
    phone: "03121234513",
    fatherName: "Malik Farhan",
    monthsOverdue: ["April 2026", "May 2026"],
    totalDue: 9000,
  },
  {
    id: 8,
    name: "Bilal Hussain",
    class: "9-B",
    rollNo: "ST015",
    phone: "03141234515",
    fatherName: "Hussain Bilal",
    monthsOverdue: [
      "January 2026",
      "February 2026",
      "March 2026",
      "April 2026",
      "May 2026",
    ],
    totalDue: 22500,
  },
];

const TEMPLATES = {
  1: (n, d) =>
    `Dear Parent of ${n}, this is a gentle reminder that a fee of Rs. ${d.toLocaleString()} is due. Please pay at your earliest convenience. — EduLink School`,
  2: (n, d) =>
    `URGENT: Dear Parent of ${n}, your fee of Rs. ${d.toLocaleString()} is overdue for 2+ months. Kindly clear dues to avoid suspension. — EduLink School`,
  3: (n, d) =>
    `FINAL NOTICE: Dear Parent of ${n}, Rs. ${d.toLocaleString()} is critically overdue. Student may be suspended. Contact school office immediately. — EduLink School`,
};

function overdueLevel(months) {
  return months >= 4 ? 3 : months >= 2 ? 2 : 1;
}
function overdueStyle(level) {
  if (level === 3)
    return {
      badge: "bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-400",
      bar: "bg-red-500",
      label: "Critical",
    };
  if (level === 2)
    return {
      badge:
        "bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400",
      bar: "bg-amber-500",
      label: "Overdue",
    };
  return {
    badge: "bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-400",
    bar: "bg-blue-400",
    label: "1 Month",
  };
}

function FeeDefaulters() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [classFilter, setClass] = useState("All Classes");
  const [levelFilter, setLevel] = useState("All");
  const [selected, setSelected] = useState(new Set());
  const [sending, setSending] = useState(null);
  const [bulkSending, setBulk] = useState(false);
  const [sentIds, setSentIds] = useState(new Set());
  const [toast, setToast] = useState(null);

  const classes = [
    "All Classes",
    ...new Set(MOCK_DEFAULTERS.map((d) => d.class)),
  ];

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return MOCK_DEFAULTERS.filter((d) => {
      const level = overdueLevel(d.monthsOverdue.length);
      return (
        (d.name.toLowerCase().includes(q) ||
          d.rollNo.toLowerCase().includes(q) ||
          d.fatherName.toLowerCase().includes(q)) &&
        (classFilter === "All Classes" || d.class === classFilter) &&
        (levelFilter === "All" || String(level) === levelFilter)
      );
    });
  }, [search, classFilter, levelFilter]);

  const stats = useMemo(
    () => ({
      total: MOCK_DEFAULTERS.length,
      critical: MOCK_DEFAULTERS.filter((d) => d.monthsOverdue.length >= 4)
        .length,
      overdue: MOCK_DEFAULTERS.filter(
        (d) => d.monthsOverdue.length >= 2 && d.monthsOverdue.length < 4,
      ).length,
      oneMonth: MOCK_DEFAULTERS.filter((d) => d.monthsOverdue.length === 1)
        .length,
      totalDue: MOCK_DEFAULTERS.reduce((a, d) => a + d.totalDue, 0),
    }),
    [],
  );

  const allSelected =
    filtered.length > 0 && filtered.every((d) => selected.has(d.id));
  const toggleAll = () =>
    allSelected
      ? setSelected((p) => {
          const n = new Set(p);
          filtered.forEach((d) => n.delete(d.id));
          return n;
        })
      : setSelected((p) => {
          const n = new Set(p);
          filtered.forEach((d) => n.add(d.id));
          return n;
        });
  const toggleOne = (id) =>
    setSelected((p) => {
      const n = new Set(p);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });

  const sendReminder = (d) => {
    const lvl = overdueLevel(d.monthsOverdue.length);
    const msg = TEMPLATES[lvl](d.name, d.totalDue);
    window.open(
      `https://wa.me/92${d.phone.slice(1)}?text=${encodeURIComponent(msg)}`,
      "_blank",
    );
    setSentIds((p) => new Set([...p, d.id]));
  };

  const sendSingle = (d) => {
    setSending(d.id);
    setTimeout(() => {
      sendReminder(d);
      setSending(null);
    }, 400);
  };

  const sendBulk = () => {
    const targets = filtered.filter((d) => selected.has(d.id));
    if (!targets.length) return;
    setBulk(true);
    targets.forEach((d, i) =>
      setTimeout(() => setSentIds((p) => new Set([...p, d.id])), i * 200),
    );
    setTimeout(
      () => {
        setBulk(false);
        setToast(targets.length);
        setTimeout(() => setToast(null), 3500);
      },
      targets.length * 200 + 300,
    );
  };

  return (
    <div className="flex flex-col gap-5">
      <PageHeader
        title="Fee Defaulters"
        subtitle="Track overdue payments and send WhatsApp reminders"
        action={
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg border border-light-border dark:border-dark-border bg-light-card dark:bg-dark-card text-sm text-light-text-secondary dark:text-dark-text-secondary hover:bg-light-hover dark:hover:bg-dark-hover transition-colors"
            >
              <ArrowLeft size={15} /> Back
            </button>
            {selected.size > 0 && (
              <button
                onClick={sendBulk}
                disabled={bulkSending}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-70"
              >
                {bulkSending ? (
                  <Loader2 size={15} className="animate-spin" />
                ) : (
                  <Send size={15} />
                )}
                {bulkSending
                  ? "Sending…"
                  : `Remind ${selected.size} Parent${selected.size !== 1 ? "s" : ""}`}
              </button>
            )}
          </div>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {[
          {
            label: "Total Defaulters",
            value: stats.total,
            color: "text-light-text-primary dark:text-dark-text-primary",
            bg: "bg-light-card dark:bg-dark-card",
          },
          {
            label: "Critical (4+ mo)",
            value: stats.critical,
            color: "text-red-600 dark:text-red-400",
            bg: "bg-red-50 dark:bg-red-950/40",
          },
          {
            label: "Overdue (2–3 mo)",
            value: stats.overdue,
            color: "text-amber-600 dark:text-amber-400",
            bg: "bg-amber-50 dark:bg-amber-950/40",
          },
          {
            label: "1 Month",
            value: stats.oneMonth,
            color: "text-blue-600 dark:text-blue-400",
            bg: "bg-blue-50 dark:bg-blue-950/40",
          },
          {
            label: "Total Due",
            value: `Rs. ${(stats.totalDue / 1000).toFixed(0)}K`,
            color: "text-red-600 dark:text-red-400",
            bg: "bg-red-50 dark:bg-red-950/40",
          },
        ].map(({ label, value, color, bg }) => (
          <div
            key={label}
            className={`${bg} border border-light-border dark:border-dark-border rounded-xl p-3 text-center`}
          >
            <p className={`text-xl font-bold ${color}`}>{value}</p>
            <p className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary mt-0.5">
              {label}
            </p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-light-text-tertiary dark:text-dark-text-tertiary"
          />
          <input
            type="text"
            placeholder="Search name, roll no, father…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-2 rounded-lg border border-light-border dark:border-dark-border bg-light-card dark:bg-dark-card text-sm text-light-text-primary dark:text-dark-text-primary outline-none focus:border-accent transition-colors"
          />
        </div>
        <select
          value={classFilter}
          onChange={(e) => setClass(e.target.value)}
          className="px-3 py-2 rounded-lg border border-light-border dark:border-dark-border bg-light-card dark:bg-dark-card text-sm text-light-text-primary dark:text-dark-text-primary outline-none focus:border-accent transition-colors"
        >
          {classes.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
        <select
          value={levelFilter}
          onChange={(e) => setLevel(e.target.value)}
          className="px-3 py-2 rounded-lg border border-light-border dark:border-dark-border bg-light-card dark:bg-dark-card text-sm text-light-text-primary dark:text-dark-text-primary outline-none focus:border-accent transition-colors"
        >
          <option value="All">All Levels</option>
          <option value="3">Critical (4+ months)</option>
          <option value="2">Overdue (2–3 months)</option>
          <option value="1">1 Month</option>
        </select>
        <button
          onClick={toggleAll}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-light-border dark:border-dark-border bg-light-card dark:bg-dark-card text-xs font-medium text-light-text-secondary dark:text-dark-text-secondary hover:bg-light-hover dark:hover:bg-dark-hover transition-colors"
        >
          {allSelected ? (
            <CheckSquare size={14} className="text-accent" />
          ) : (
            <Square size={14} />
          )}
          {allSelected ? "Deselect All" : "Select All"}
        </button>
      </div>

      {/* Table */}
      <div className="bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl overflow-hidden">
        <div className="grid grid-cols-[2rem_1.8fr_0.8fr_0.9fr_1.2fr_1.5fr_1.2fr_1.5fr] items-center gap-2 px-4 py-3 border-b border-light-border dark:border-dark-border min-w-[800px]">
          <span />
          {[
            "Student",
            "Class",
            "Roll No",
            "Father",
            "Months Overdue",
            "Total Due",
            "Actions",
          ].map((h) => (
            <span
              key={h}
              className="text-xs font-medium text-light-text-tertiary dark:text-dark-text-tertiary uppercase tracking-wide"
            >
              {h}
            </span>
          ))}
        </div>
        <div className="overflow-x-auto">
          {filtered.map((d) => {
            const level = overdueLevel(d.monthsOverdue.length);
            const style = overdueStyle(level);
            const isSent = sentIds.has(d.id);
            return (
              <div
                key={d.id}
                className={`grid grid-cols-[2rem_1.8fr_0.8fr_0.9fr_1.2fr_1.5fr_1.2fr_1.5fr] items-center gap-2 px-4 py-3 border-b border-light-border dark:border-dark-border last:border-0 min-w-[800px] transition-colors hover:bg-light-hover dark:hover:bg-dark-hover ${
                  level === 3
                    ? "bg-red-50/30 dark:bg-red-950/10"
                    : level === 2
                      ? "bg-amber-50/20 dark:bg-amber-950/10"
                      : ""
                }`}
              >
                <div
                  onClick={() => toggleOne(d.id)}
                  className={`w-4 h-4 rounded border-2 flex items-center justify-center cursor-pointer transition-colors ${selected.has(d.id) ? "bg-accent border-accent" : "border-light-border dark:border-dark-border"}`}
                >
                  {selected.has(d.id) && (
                    <Check size={10} className="text-white" />
                  )}
                </div>
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-7 h-7 rounded-full bg-accent/10 flex items-center justify-center text-accent text-xs font-bold shrink-0">
                    {d.name.charAt(0)}
                  </div>
                  <p className="text-sm font-medium text-light-text-primary dark:text-dark-text-primary truncate">
                    {d.name}
                  </p>
                </div>
                <span className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                  {d.class}
                </span>
                <span className="text-xs font-mono text-light-text-tertiary dark:text-dark-text-tertiary">
                  {d.rollNo}
                </span>
                <span className="text-sm text-light-text-secondary dark:text-dark-text-secondary truncate">
                  {d.fatherName}
                </span>
                <div>
                  <div className="flex items-center gap-1.5 mb-1">
                    <div className="flex-1 bg-light-hover dark:bg-dark-hover rounded-full h-1.5">
                      <div
                        className={`h-1.5 rounded-full ${style.bar}`}
                        style={{
                          width: `${Math.min((d.monthsOverdue.length / 5) * 100, 100)}%`,
                        }}
                      />
                    </div>
                    <span
                      className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${style.badge}`}
                    >
                      {style.label}
                    </span>
                  </div>
                  <p className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary">
                    {d.monthsOverdue.length} month
                    {d.monthsOverdue.length !== 1 ? "s" : ""}
                  </p>
                </div>
                <p className="text-sm font-bold text-red-600 dark:text-red-400">
                  Rs. {d.totalDue.toLocaleString()}
                </p>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => sendSingle(d)}
                    disabled={sending === d.id}
                    className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium transition-colors ${isSent ? "bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-400" : "bg-green-50 dark:bg-green-950/40 hover:bg-green-100 dark:hover:bg-green-950 text-green-700 dark:text-green-400"}`}
                  >
                    {sending === d.id ? (
                      <Loader2 size={11} className="animate-spin" />
                    ) : isSent ? (
                      <Check size={11} />
                    ) : (
                      <MessageCircle size={11} />
                    )}
                    {level === 1 ? "1st" : level === 2 ? "2nd" : "3rd"} Remind
                  </button>
                  <a
                    href={`tel:${d.phone}`}
                    className="w-7 h-7 flex items-center justify-center rounded-lg text-light-text-tertiary hover:bg-blue-50 dark:hover:bg-blue-950 hover:text-blue-600 transition-colors"
                  >
                    <Phone size={13} />
                  </a>
                </div>
              </div>
            );
          })}
          {filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center py-14 gap-2">
              <CheckCircle size={24} className="text-green-500" />
              <p className="text-sm font-medium text-light-text-primary dark:text-dark-text-primary">
                No defaulters found
              </p>
              <p className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary">
                All fees cleared for the selected filters
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Legend */}
      <div className="bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl px-5 py-3 flex flex-wrap gap-x-6 gap-y-2 text-xs text-light-text-secondary dark:text-dark-text-secondary">
        <span className="font-medium text-light-text-primary dark:text-dark-text-primary">
          Reminder levels:
        </span>
        <span>
          <span className="font-semibold text-blue-600 dark:text-blue-400">
            1st
          </span>{" "}
          — Gentle reminder (1 month)
        </span>
        <span>
          <span className="font-semibold text-amber-600 dark:text-amber-400">
            2nd
          </span>{" "}
          — Urgent notice (2–3 months)
        </span>
        <span>
          <span className="font-semibold text-red-600 dark:text-red-400">
            3rd
          </span>{" "}
          — Final warning (4+ months)
        </span>
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-green-600 text-white rounded-xl px-4 py-3 shadow-xl flex items-center gap-3">
          <Check size={16} />
          <p className="text-sm font-medium">
            {toast} reminder{toast !== 1 ? "s" : ""} sent via WhatsApp
          </p>
          <button
            onClick={() => setToast(null)}
            className="ml-1 opacity-70 hover:opacity-100"
          >
            <X size={13} />
          </button>
        </div>
      )}
    </div>
  );
}

export default FeeDefaulters;
