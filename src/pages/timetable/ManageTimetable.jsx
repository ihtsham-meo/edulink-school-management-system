import { useEffect, useMemo, useState } from "react";
import { Plus, Clock, Printer, AlertCircle } from "lucide-react";
import PageHeader from "../../components/common/PageHeader";
import { timetableService } from "../../services/timetableService";

const days = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const subjectColors = {
  Mathematics:
    "bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-400",
  English:
    "bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800 text-green-700 dark:text-green-400",
  Physics:
    "bg-purple-50 dark:bg-purple-950 border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-400",
  Chemistry:
    "bg-amber-50 dark:bg-amber-950 border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-400",
  Computer:
    "bg-cyan-50 dark:bg-cyan-950 border-cyan-200 dark:border-cyan-800 text-cyan-700 dark:text-cyan-400",
};

const normalizeSlots = (payload) => {
  const items = Array.isArray(payload)
    ? payload
    : payload?.data?.data ||
      payload?.data?.timetable ||
      payload?.data ||
      payload?.timetable ||
      [];

  if (!Array.isArray(items)) return [];

  return items.map((slot) => ({
    id: slot.id,
    day: slot.day || slot.day_of_week || "",
    period: slot.period || slot.period_number || "",
    time:
      slot.time ||
      [slot.start_time, slot.end_time].filter(Boolean).join(" - "),
    subject:
      slot.subject?.name ||
      slot.subject_name ||
      slot.subject ||
      "",
    teacher:
      slot.teacher?.name ||
      slot.teacher_name ||
      slot.staff?.name ||
      "",
    room: slot.room || slot.room_number || "",
    className:
      slot.class?.name ||
      slot.class_name ||
      slot.section?.class?.name ||
      "",
  }));
};

function ManageTimetable() {
  const [slots, setSlots] = useState([]);
  const [selectedClass, setClass] = useState("");
  const [view, setView] = useState("grid");
  const [error, setError] = useState("");

  useEffect(() => {
    const loadTimetable = async () => {
      try {
        const response = await timetableService.getAll();
        const apiSlots = normalizeSlots(response.data);
        setSlots(apiSlots);
        setClass(apiSlots.find((slot) => slot.className)?.className || "");
      } catch (err) {
        setSlots([]);
        setError(err.response?.data?.message || "Could not load timetable from the backend.");
      }
    };

    loadTimetable();
  }, []);

  const classes = useMemo(
    () => [...new Set(slots.map((slot) => slot.className).filter(Boolean))],
    [slots],
  );

  const weeklyTimetable = useMemo(() => {
    return days.reduce((acc, day) => {
      acc[day] = slots
        .filter((slot) => slot.day === day && (!selectedClass || slot.className === selectedClass))
        .sort((a, b) => Number(a.period) - Number(b.period));
      return acc;
    }, {});
  }, [slots, selectedClass]);

  const maxPeriods = Math.max(
    1,
    ...days.map((day) => weeklyTimetable[day]?.length || 0),
  );

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Timetable"
        subtitle="Weekly class schedule management"
        action={
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-2 bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border text-light-text-secondary dark:text-dark-text-secondary text-sm font-medium rounded-lg hover:bg-light-hover dark:hover:bg-dark-hover transition-colors">
              <Printer size={15} />
              Print
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-accent hover:bg-accent-hover text-white text-sm font-medium rounded-lg transition-colors">
              <Plus size={15} />
              Add Slot
            </button>
          </div>
        }
      />

      {error && (
        <div className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-300">
          <AlertCircle size={17} className="mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Filters */}
      <div className="bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl p-4">
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          {/* Class selector */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
              Class:
            </span>
            <div className="flex flex-wrap gap-2">
              {classes.length ? classes.map((c) => (
                <button
                  key={c}
                  onClick={() => setClass(c)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    selectedClass === c
                      ? "bg-accent text-white border-accent"
                      : "bg-light-bg dark:bg-dark-bg border-light-border dark:border-dark-border text-light-text-secondary dark:text-dark-text-secondary hover:border-accent"
                  }`}
                >
                  {c}
                </button>
              )) : (
                <span className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary">
                  No classes loaded
                </span>
              )}
            </div>
          </div>

          <div className="flex-1" />

          {/* View toggle */}
          <div className="flex gap-1 bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border rounded-lg p-1">
            {["grid", "list"].map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                  view === v
                    ? "bg-accent text-white"
                    : "text-light-text-secondary dark:text-dark-text-secondary"
                }`}
              >
                {v.charAt(0).toUpperCase() + v.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid view */}
      {view === "grid" && (
        <div className="bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-175">
              <thead>
                <tr className="border-b border-light-border dark:border-dark-border">
                  <th className="px-4 py-3 text-left text-xs font-medium text-light-text-tertiary dark:text-dark-text-tertiary uppercase tracking-wide w-24">
                    Period
                  </th>
                  {days.map((day) => (
                    <th
                      key={day}
                      className="px-4 py-3 text-left text-xs font-medium text-light-text-tertiary dark:text-dark-text-tertiary uppercase tracking-wide"
                    >
                      {day}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: maxPeriods }, (_, periodIndex) => (
                  <tr
                    key={periodIndex}
                    className="border-b border-light-border dark:border-dark-border last:border-0"
                  >
                    {/* Period label */}
                    <td className="px-4 py-3">
                      <div className="flex flex-col">
                        <span className="text-xs font-semibold text-light-text-primary dark:text-dark-text-primary">
                          P{periodIndex + 1}
                        </span>
                        <span className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary flex items-center gap-1 mt-0.5">
                          <Clock size={10} />
                          {weeklyTimetable.Monday?.[periodIndex]?.time?.split(" - ")[0] || "-"}
                        </span>
                      </div>
                    </td>

                    {/* Day cells */}
                    {days.map((day) => {
                      const slot = weeklyTimetable[day]?.[periodIndex];
                      const colorClass = slot
                        ? subjectColors[slot.subject] ||
                          "bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400"
                        : "";
                      return (
                        <td key={day} className="px-3 py-3">
                          {slot ? (
                            <div
                              className={`border rounded-lg px-3 py-2 ${colorClass}`}
                            >
                              <p className="text-xs font-semibold">
                                {slot.subject}
                              </p>
                              <p className="text-xs opacity-75 mt-0.5">
                                {slot.teacher}
                              </p>
                              <p className="text-xs opacity-60 mt-0.5">
                                {slot.room}
                              </p>
                            </div>
                          ) : (
                            <div className="border border-dashed border-light-border dark:border-dark-border rounded-lg px-3 py-2 text-center">
                              <span className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary">
                                Free
                              </span>
                            </div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* List view */}
      {view === "list" && (
        <div className="flex flex-col gap-4">
          {days.map((day) => (
            <div
              key={day}
              className="bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl overflow-hidden"
            >
              <div className="px-5 py-3 border-b border-light-border dark:border-dark-border bg-light-bg dark:bg-dark-bg">
                <h3 className="text-sm font-semibold text-light-text-primary dark:text-dark-text-primary">
                  {day}
                </h3>
              </div>
              <div className="flex flex-col divide-y divide-light-border dark:divide-dark-border">
                {(weeklyTimetable[day] || []).map((slot, i) => {
                  const colorClass =
                    subjectColors[slot.subject] ||
                    "bg-gray-50 dark:bg-gray-900";
                  return (
                    <div
                      key={i}
                      className="flex items-center gap-4 px-5 py-3 hover:bg-light-hover dark:hover:bg-dark-hover transition-colors"
                    >
                      <div className="w-16 text-center shrink-0">
                        <span className="text-xs font-semibold text-light-text-primary dark:text-dark-text-primary">
                          {slot.period}
                        </span>
                        <p className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary">
                          {slot.time.split(" - ")[0]}
                        </p>
                      </div>
                      <div
                        className={`px-3 py-1 rounded-lg border text-xs font-medium ${colorClass} w-28 text-center shrink-0`}
                      >
                        {slot.subject}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-light-text-primary dark:text-dark-text-primary">
                          {slot.teacher}
                        </p>
                        <p className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary">
                          {slot.room}
                        </p>
                      </div>
                      <span className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary hidden sm:block">
                        {slot.time}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ManageTimetable;
