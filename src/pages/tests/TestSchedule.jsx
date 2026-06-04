import { useState, useMemo } from "react";
import {
  ChevronLeft, ChevronRight, Plus, X, Loader2,
  AlertCircle, Clock, BookOpen, Tag, Calendar,
  Pencil, Trash2, ArrowLeft,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../../components/common/PageHeader";
import { mockTests } from "../../data/mockData";

// ── Constants ─────────────────────────────────────────────────────────────────
const TEST_TYPES = ["written", "oral", "practical", "lab", "mcq"];
const SUBJECTS   = ["Mathematics","English","Physics","Chemistry","Biology","Computer","Urdu","Islamiat"];
const CLASSES    = ["6-A","6-B","7-A","7-B","8-A","8-B","9-A","9-B","10-A","10-B","11-A","11-B"];
const DAYS       = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
const MONTHS     = ["January","February","March","April","May","June","July","August","September","October","November","December"];

const TYPE_COLORS = {
  written:   { dot: "bg-blue-500",   badge: "bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-400",   border: "border-blue-300 dark:border-blue-700"   },
  oral:      { dot: "bg-purple-500", badge: "bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-400", border: "border-purple-300 dark:border-purple-700" },
  practical: { dot: "bg-green-500",  badge: "bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-400",   border: "border-green-300 dark:border-green-700"   },
  lab:       { dot: "bg-amber-500",  badge: "bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400",   border: "border-amber-300 dark:border-amber-700"   },
  mcq:       { dot: "bg-red-500",    badge: "bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-400",         border: "border-red-300 dark:border-red-700"       },
};

const INITIAL_FORM = { title: "", subject: "Mathematics", class: "9-A", type: "written", date: "", duration: "45 min", maxMarks: "", notes: "" };

// ── Helpers ───────────────────────────────────────────────────────────────────
function daysInMonth(year, month) { return new Date(year, month + 1, 0).getDate(); }
function firstDayOfMonth(year, month) { return new Date(year, month, 1).getDay(); }
function toDateStr(year, month, day) {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

// ── Main Component ────────────────────────────────────────────────────────────
function TestSchedule() {
  const navigate  = useNavigate();
  const today     = new Date();
  const [viewYear, setYear]   = useState(today.getFullYear());
  const [viewMonth, setMonth] = useState(today.getMonth());
  const [tests, setTests]     = useState(mockTests.map((t) => ({ ...t, id: t.id })));
  const [nextId, setNextId]   = useState(100);
  const [modal, setModal]     = useState(null);  // "add" | "edit" | "delete"
  const [selected, setSelected]   = useState(null); // test for edit/delete
  const [selectedDay, setDay]     = useState(null); // date string for add
  const [form, setForm]       = useState(INITIAL_FORM);
  const [errors, setErrors]   = useState({});
  const [saving, setSaving]   = useState(false);
  const [filterType, setFilter]   = useState("All");
  const [filterClass, setFClass]  = useState("All Classes");

  const set = (f, v) => { setForm((p) => ({ ...p, [f]: v })); setErrors((p) => ({ ...p, [f]: "" })); };

  // ── Calendar grid ─────────────────────────────────────────────────────────
  const numDays   = daysInMonth(viewYear, viewMonth);
  const firstDay  = firstDayOfMonth(viewYear, viewMonth);
  const cells     = Array.from({ length: firstDay + numDays }, (_, i) =>
    i < firstDay ? null : i - firstDay + 1
  );

  // Pad to complete last week
  while (cells.length % 7 !== 0) cells.push(null);

  // Group tests by date
  const testsByDate = useMemo(() => {
    const map = {};
    tests.forEach((t) => {
      const filtered =
        (filterType === "All" || t.type === filterType) &&
        (filterClass === "All Classes" || t.class === filterClass);
      if (filtered) {
        if (!map[t.date]) map[t.date] = [];
        map[t.date].push(t);
      }
    });
    return map;
  }, [tests, filterType, filterClass]);

  // Conflict detection: same class, same date → conflict
  const conflicts = useMemo(() => {
    const set = new Set();
    const seen = {};
    tests.forEach((t) => {
      const key = `${t.date}-${t.class}`;
      if (seen[key]) { set.add(key); set.add(seen[key].id); set.add(t.id); }
      else seen[key] = t;
    });
    return set;
  }, [tests]);

  const prevMonth = () => { if (viewMonth === 0) { setYear((y) => y - 1); setMonth(11); } else setMonth((m) => m - 1); };
  const nextMonth = () => { if (viewMonth === 11) { setYear((y) => y + 1); setMonth(0); } else setMonth((m) => m + 1); };

  const openAdd = (dateStr) => {
    setDay(dateStr);
    setForm({ ...INITIAL_FORM, date: dateStr });
    setErrors({});
    setModal("add");
  };

  const openEdit = (test, e) => {
    e.stopPropagation();
    setSelected(test);
    setForm({ title: test.title, subject: test.subject, class: test.class, type: test.type, date: test.date, duration: test.duration, maxMarks: String(test.maxMarks), notes: test.notes || "" });
    setErrors({});
    setModal("edit");
  };

  const openDelete = (test, e) => {
    e.stopPropagation();
    setSelected(test);
    setModal("delete");
  };

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = "Required";
    if (!form.date)         e.date  = "Required";
    if (!form.maxMarks || Number(form.maxMarks) < 1) e.maxMarks = "Required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    setSaving(true);
    setTimeout(() => {
      if (modal === "add") {
        setTests((prev) => [...prev, { ...form, id: nextId, maxMarks: Number(form.maxMarks), status: "scheduled", teacher: "Ms. Fatima", section: form.class.split("-")[1] || "A" }]);
        setNextId((n) => n + 1);
      } else {
        setTests((prev) => prev.map((t) => t.id === selected.id ? { ...t, ...form, maxMarks: Number(form.maxMarks) } : t));
      }
      setSaving(false);
      setModal(null);
    }, 500);
  };

  const handleDelete = () => {
    setSaving(true);
    setTimeout(() => {
      setTests((prev) => prev.filter((t) => t.id !== selected.id));
      setSaving(false);
      setModal(null);
    }, 400);
  };

  const todayStr = toDateStr(today.getFullYear(), today.getMonth(), today.getDate());

  return (
    <div className="flex flex-col gap-5">
      <PageHeader
        title="Test Schedule"
        subtitle="Calendar view — click a day to schedule a test"
        action={
          <div className="flex items-center gap-2">
            <button onClick={() => navigate(-1)} className="flex items-center gap-2 px-3 py-2 rounded-lg border border-light-border dark:border-dark-border bg-light-card dark:bg-dark-card text-sm text-light-text-secondary dark:text-dark-text-secondary hover:bg-light-hover dark:hover:bg-dark-hover transition-colors">
              <ArrowLeft size={15} /> Back
            </button>
            <button onClick={() => openAdd(todayStr)} className="flex items-center gap-2 px-4 py-2 bg-accent hover:bg-accent-hover text-white text-sm font-medium rounded-lg transition-colors">
              <Plus size={16} /> Add Test
            </button>
          </div>
        }
      />

      {/* Filters + legend */}
      <div className="flex flex-wrap gap-3 items-center">
        <select value={filterType} onChange={(e) => setFilter(e.target.value)} className="px-3 py-2 rounded-lg border border-light-border dark:border-dark-border bg-light-card dark:bg-dark-card text-sm text-light-text-primary dark:text-dark-text-primary outline-none focus:border-accent transition-colors">
          <option value="All">All Types</option>
          {TEST_TYPES.map((t) => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
        </select>
        <select value={filterClass} onChange={(e) => setFClass(e.target.value)} className="px-3 py-2 rounded-lg border border-light-border dark:border-dark-border bg-light-card dark:bg-dark-card text-sm text-light-text-primary dark:text-dark-text-primary outline-none focus:border-accent transition-colors">
          <option value="All Classes">All Classes</option>
          {CLASSES.map((c) => <option key={c}>{c}</option>)}
        </select>

        {/* Legend */}
        <div className="flex flex-wrap gap-2 ml-auto">
          {Object.entries(TYPE_COLORS).map(([type, { dot }]) => (
            <span key={type} className="flex items-center gap-1.5 text-xs text-light-text-secondary dark:text-dark-text-secondary">
              <span className={`w-2.5 h-2.5 rounded-full ${dot}`} />
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </span>
          ))}
        </div>
      </div>

      {/* Conflict warning */}
      {conflicts.size > 0 && (
        <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-sm text-amber-700 dark:text-amber-400">
          <AlertCircle size={15} /> {Math.floor(conflicts.size / 2)} scheduling conflict{conflicts.size / 2 > 1 ? "s" : ""} detected — same class scheduled on the same day.
        </div>
      )}

      {/* Calendar */}
      <div className="bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl overflow-hidden">
        {/* Month navigation */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-light-border dark:border-dark-border">
          <button onClick={prevMonth} className="w-8 h-8 rounded-lg flex items-center justify-center border border-light-border dark:border-dark-border text-light-text-secondary dark:text-dark-text-secondary hover:bg-light-hover dark:hover:bg-dark-hover transition-colors">
            <ChevronLeft size={16} />
          </button>
          <h2 className="text-sm font-semibold text-light-text-primary dark:text-dark-text-primary">
            {MONTHS[viewMonth]} {viewYear}
          </h2>
          <button onClick={nextMonth} className="w-8 h-8 rounded-lg flex items-center justify-center border border-light-border dark:border-dark-border text-light-text-secondary dark:text-dark-text-secondary hover:bg-light-hover dark:hover:bg-dark-hover transition-colors">
            <ChevronRight size={16} />
          </button>
        </div>

        {/* Day headers */}
        <div className="grid grid-cols-7 border-b border-light-border dark:border-dark-border">
          {DAYS.map((d) => (
            <div key={d} className="px-1 py-2 text-center text-xs font-medium text-light-text-tertiary dark:text-dark-text-tertiary">
              {d}
            </div>
          ))}
        </div>

        {/* Weeks */}
        <div className="grid grid-cols-7">
          {cells.map((day, idx) => {
            const dateStr = day ? toDateStr(viewYear, viewMonth, day) : null;
            const dayTests = dateStr ? (testsByDate[dateStr] || []) : [];
            const isToday = dateStr === todayStr;
            const isWeekend = (idx % 7 === 0) || (idx % 7 === 6);
            const hasConflict = dayTests.some((t) => conflicts.has(t.id));

            return (
              <div
                key={idx}
                onClick={() => day && openAdd(dateStr)}
                className={`min-h-[90px] p-1.5 border-b border-r border-light-border dark:border-dark-border last:border-r-0 cursor-pointer transition-colors ${
                  !day ? "bg-light-hover/30 dark:bg-dark-hover/30 cursor-default" :
                  isWeekend ? "bg-light-hover/50 dark:bg-dark-hover/30 hover:bg-light-hover dark:hover:bg-dark-hover" :
                  "hover:bg-light-hover dark:hover:bg-dark-hover"
                } ${(idx + 1) % 7 === 0 ? "border-r-0" : ""}`}
              >
                {day && (
                  <>
                    {/* Day number */}
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-xs font-medium w-6 h-6 flex items-center justify-center rounded-full ${
                        isToday ? "bg-accent text-white" : "text-light-text-secondary dark:text-dark-text-secondary"
                      }`}>
                        {day}
                      </span>
                      {hasConflict && <AlertCircle size={11} className="text-amber-500 shrink-0" />}
                    </div>

                    {/* Tests */}
                    <div className="flex flex-col gap-0.5">
                      {dayTests.slice(0, 3).map((t) => {
                        const tc = TYPE_COLORS[t.type] || TYPE_COLORS.written;
                        return (
                          <div
                            key={t.id}
                            onClick={(e) => e.stopPropagation()}
                            className={`group flex items-center gap-1 px-1.5 py-0.5 rounded text-xs border ${tc.border} ${tc.badge} relative`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${tc.dot} shrink-0`} />
                            <span className="truncate flex-1">{t.title}</span>
                            {/* Hover actions */}
                            <div className="hidden group-hover:flex items-center gap-0.5 ml-auto shrink-0">
                              <button onClick={(e) => openEdit(t, e)} className="w-4 h-4 flex items-center justify-center hover:text-accent"><Pencil size={10} /></button>
                              <button onClick={(e) => openDelete(t, e)} className="w-4 h-4 flex items-center justify-center hover:text-red-500"><Trash2 size={10} /></button>
                            </div>
                          </div>
                        );
                      })}
                      {dayTests.length > 3 && (
                        <span className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary pl-1">+{dayTests.length - 3} more</span>
                      )}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Upcoming list */}
      <div className="bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl overflow-hidden">
        <div className="px-4 py-3 border-b border-light-border dark:border-dark-border">
          <h3 className="text-sm font-semibold text-light-text-primary dark:text-dark-text-primary">Upcoming Tests</h3>
        </div>
        <div className="divide-y divide-light-border dark:divide-dark-border">
          {[...tests]
            .filter((t) => t.date >= todayStr)
            .sort((a, b) => a.date.localeCompare(b.date))
            .slice(0, 8)
            .map((t) => {
              const tc = TYPE_COLORS[t.type] || TYPE_COLORS.written;
              const isConflict = conflicts.has(t.id);
              return (
                <div key={t.id} className={`flex items-center gap-3 px-4 py-3 hover:bg-light-hover dark:hover:bg-dark-hover transition-colors ${isConflict ? "bg-amber-50/40 dark:bg-amber-950/20" : ""}`}>
                  <div className={`w-2 h-10 rounded-full ${tc.dot} shrink-0`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-light-text-primary dark:text-dark-text-primary truncate">{t.title}</p>
                      {isConflict && <AlertCircle size={13} className="text-amber-500 shrink-0" title="Scheduling conflict" />}
                    </div>
                    <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-light-text-tertiary dark:text-dark-text-tertiary mt-0.5">
                      <span className="flex items-center gap-1"><BookOpen size={11} />{t.subject}</span>
                      <span className="flex items-center gap-1"><Tag size={11} />Class {t.class}</span>
                      <span className="flex items-center gap-1"><Clock size={11} />{t.duration}</span>
                      <span className="flex items-center gap-1"><Calendar size={11} />{t.date}</span>
                    </div>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${tc.badge}`}>{t.type}</span>
                  <div className="flex items-center gap-1 shrink-0">
                    <button onClick={(e) => openEdit(t, e)} className="w-7 h-7 flex items-center justify-center rounded-lg text-light-text-tertiary hover:bg-light-hover dark:hover:bg-dark-hover hover:text-accent transition-colors"><Pencil size={13} /></button>
                    <button onClick={(e) => openDelete(t, e)} className="w-7 h-7 flex items-center justify-center rounded-lg text-light-text-tertiary hover:bg-red-50 dark:hover:bg-red-950 hover:text-red-500 transition-colors"><Trash2 size={13} /></button>
                  </div>
                </div>
              );
            })}
          {tests.filter((t) => t.date >= todayStr).length === 0 && (
            <p className="text-sm text-light-text-tertiary dark:text-dark-text-tertiary text-center py-8">No upcoming tests</p>
          )}
        </div>
      </div>

      {/* ── Add / Edit Modal ───────────────────────────────────────────── */}
      {(modal === "add" || modal === "edit") && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-xl rounded-xl border border-light-border bg-light-card shadow-xl dark:border-dark-border dark:bg-dark-card">
            <div className="flex items-center justify-between border-b border-light-border px-5 py-4 dark:border-dark-border">
              <h2 className="text-sm font-semibold text-light-text-primary dark:text-dark-text-primary">
                {modal === "add" ? "Schedule Test" : "Edit Test"}
              </h2>
              <button onClick={() => setModal(null)} className="flex h-8 w-8 items-center justify-center rounded-lg text-light-text-tertiary hover:bg-light-hover dark:text-dark-text-tertiary dark:hover:bg-dark-hover"><X size={16} /></button>
            </div>
            <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[65vh] overflow-y-auto">
              {/* Title */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-light-text-secondary dark:text-dark-text-secondary mb-1">Test Title *</label>
                <input value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="e.g. Chapter 5 Unit Test" className={`w-full rounded-lg border bg-light-bg px-3 py-2 text-sm text-light-text-primary outline-none focus:border-accent transition-colors dark:bg-dark-bg dark:text-dark-text-primary ${errors.title ? "border-danger" : "border-light-border dark:border-dark-border"}`} />
                {errors.title && <p className="mt-1 text-xs text-danger">{errors.title}</p>}
              </div>

              {/* Subject */}
              <div>
                <label className="block text-xs font-medium text-light-text-secondary dark:text-dark-text-secondary mb-1">Subject</label>
                <select value={form.subject} onChange={(e) => set("subject", e.target.value)} className="w-full rounded-lg border border-light-border dark:border-dark-border bg-light-bg dark:bg-dark-bg px-3 py-2 text-sm text-light-text-primary dark:text-dark-text-primary outline-none focus:border-accent transition-colors">
                  {SUBJECTS.map((s) => <option key={s}>{s}</option>)}
                </select>
              </div>

              {/* Class */}
              <div>
                <label className="block text-xs font-medium text-light-text-secondary dark:text-dark-text-secondary mb-1">Class</label>
                <select value={form.class} onChange={(e) => set("class", e.target.value)} className="w-full rounded-lg border border-light-border dark:border-dark-border bg-light-bg dark:bg-dark-bg px-3 py-2 text-sm text-light-text-primary dark:text-dark-text-primary outline-none focus:border-accent transition-colors">
                  {CLASSES.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>

              {/* Type */}
              <div>
                <label className="block text-xs font-medium text-light-text-secondary dark:text-dark-text-secondary mb-1">Test Type</label>
                <select value={form.type} onChange={(e) => set("type", e.target.value)} className="w-full rounded-lg border border-light-border dark:border-dark-border bg-light-bg dark:bg-dark-bg px-3 py-2 text-sm text-light-text-primary dark:text-dark-text-primary outline-none focus:border-accent transition-colors">
                  {TEST_TYPES.map((t) => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
                </select>
              </div>

              {/* Date */}
              <div>
                <label className="block text-xs font-medium text-light-text-secondary dark:text-dark-text-secondary mb-1">Date *</label>
                <input type="date" value={form.date} onChange={(e) => set("date", e.target.value)} className={`w-full rounded-lg border bg-light-bg px-3 py-2 text-sm text-light-text-primary outline-none focus:border-accent transition-colors dark:bg-dark-bg dark:text-dark-text-primary ${errors.date ? "border-danger" : "border-light-border dark:border-dark-border"}`} />
                {errors.date && <p className="mt-1 text-xs text-danger">{errors.date}</p>}
              </div>

              {/* Duration */}
              <div>
                <label className="block text-xs font-medium text-light-text-secondary dark:text-dark-text-secondary mb-1">Duration</label>
                <input value={form.duration} onChange={(e) => set("duration", e.target.value)} placeholder="45 min" className="w-full rounded-lg border border-light-border dark:border-dark-border bg-light-bg dark:bg-dark-bg px-3 py-2 text-sm text-light-text-primary dark:text-dark-text-primary outline-none focus:border-accent transition-colors" />
              </div>

              {/* Max marks */}
              <div>
                <label className="block text-xs font-medium text-light-text-secondary dark:text-dark-text-secondary mb-1">Total Marks *</label>
                <input type="number" value={form.maxMarks} onChange={(e) => set("maxMarks", e.target.value)} placeholder="50" className={`w-full rounded-lg border bg-light-bg px-3 py-2 text-sm text-light-text-primary outline-none focus:border-accent transition-colors dark:bg-dark-bg dark:text-dark-text-primary ${errors.maxMarks ? "border-danger" : "border-light-border dark:border-dark-border"}`} />
                {errors.maxMarks && <p className="mt-1 text-xs text-danger">{errors.maxMarks}</p>}
              </div>

              {/* Notes */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-light-text-secondary dark:text-dark-text-secondary mb-1">Notes (optional)</label>
                <textarea rows={2} value={form.notes} onChange={(e) => set("notes", e.target.value)} placeholder="Any special instructions…" className="w-full rounded-lg border border-light-border dark:border-dark-border bg-light-bg dark:bg-dark-bg px-3 py-2 text-sm text-light-text-primary dark:text-dark-text-primary outline-none focus:border-accent transition-colors resize-none" />
              </div>
            </div>
            <div className="flex justify-end gap-2 border-t border-light-border px-5 py-4 dark:border-dark-border">
              <button onClick={() => setModal(null)} className="rounded-lg border border-light-border px-4 py-2 text-sm font-medium text-light-text-secondary hover:bg-light-hover dark:border-dark-border dark:text-dark-text-secondary dark:hover:bg-dark-hover">Cancel</button>
              <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 rounded-lg bg-accent hover:bg-accent-hover px-4 py-2 text-sm font-medium text-white disabled:opacity-70">
                {saving && <Loader2 size={14} className="animate-spin" />}
                {modal === "add" ? "Schedule Test" : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete Modal ───────────────────────────────────────────────── */}
      {modal === "delete" && selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md rounded-xl border border-light-border bg-light-card shadow-xl dark:border-dark-border dark:bg-dark-card">
            <div className="flex items-center justify-between border-b border-light-border px-5 py-4 dark:border-dark-border">
              <h2 className="text-sm font-semibold text-light-text-primary dark:text-dark-text-primary">Delete Test</h2>
              <button onClick={() => setModal(null)} className="flex h-8 w-8 items-center justify-center rounded-lg text-light-text-tertiary hover:bg-light-hover dark:text-dark-text-tertiary dark:hover:bg-dark-hover"><X size={16} /></button>
            </div>
            <div className="p-5">
              <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                Delete <span className="font-semibold text-light-text-primary dark:text-dark-text-primary">{selected.title}</span> scheduled for {selected.date}? This cannot be undone.
              </p>
              <div className="flex justify-end gap-2 mt-5 border-t border-light-border pt-4 dark:border-dark-border">
                <button onClick={() => setModal(null)} className="rounded-lg border border-light-border px-4 py-2 text-sm font-medium text-light-text-secondary hover:bg-light-hover dark:border-dark-border dark:text-dark-text-secondary dark:hover:bg-dark-hover">Cancel</button>
                <button onClick={handleDelete} disabled={saving} className="flex items-center gap-2 rounded-lg bg-red-500 hover:bg-red-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-70">
                  {saving && <Loader2 size={14} className="animate-spin" />} Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TestSchedule;