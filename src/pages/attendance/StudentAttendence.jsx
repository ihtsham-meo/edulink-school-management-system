import { useState } from "react";
import { Check, X, Clock, Calendar, Save, CheckSquare } from "lucide-react";
import PageHeader from "../../components/common/PageHeader";
import {
  mockAttendanceStudents,
  attendanceStatusStyles,
} from "../../data/mockData";

const classes = ["10-A", "9-B", "8-C", "7-A", "11-A"];
const statuses = ["present", "absent", "late", "leave"];

const statusConfig = {
  present: {
    label: "Present",
    icon: Check,
    active: "bg-green-500 text-white border-green-500",
    inactive:
      "border-light-border dark:border-dark-border text-light-text-tertiary dark:text-dark-text-tertiary hover:border-green-400 hover:text-green-500",
  },
  absent: {
    label: "Absent",
    icon: X,
    active: "bg-red-500 text-white border-red-500",
    inactive:
      "border-light-border dark:border-dark-border text-light-text-tertiary dark:text-dark-text-tertiary hover:border-red-400 hover:text-red-500",
  },
  late: {
    label: "Late",
    icon: Clock,
    active: "bg-amber-500 text-white border-amber-500",
    inactive:
      "border-light-border dark:border-dark-border text-light-text-tertiary dark:text-dark-text-tertiary hover:border-amber-400 hover:text-amber-500",
  },
  leave: {
    label: "Leave",
    icon: Calendar,
    active: "bg-blue-500 text-white border-blue-500",
    inactive:
      "border-light-border dark:border-dark-border text-light-text-tertiary dark:text-dark-text-tertiary hover:border-blue-400 hover:text-blue-500",
  },
};

function StudentAttendance() {
  const [selectedClass, setClass] = useState("10-A");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [saved, setSaved] = useState(false);

  // Initialize all students as present
  const [attendance, setAttendance] = useState(() =>
    Object.fromEntries(mockAttendanceStudents.map((s) => [s.id, "present"])),
  );

  const markStudent = (studentId, status) => {
    setAttendance((prev) => ({ ...prev, [studentId]: status }));
    setSaved(false);
  };

  const markAll = (status) => {
    const all = Object.fromEntries(
      mockAttendanceStudents.map((s) => [s.id, status]),
    );
    setAttendance(all);
    setSaved(false);
  };

  const handleSave = () => {
    console.log("Saving attendance:", {
      class: selectedClass,
      date,
      attendance,
    });
    setSaved(true);
  };

  // Summary counts
  const counts = statuses.reduce((acc, s) => {
    acc[s] = Object.values(attendance).filter((v) => v === s).length;
    return acc;
  }, {});

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <PageHeader
        title="Student Attendance"
        subtitle="Mark daily attendance for your class"
        action={
          <button
            onClick={handleSave}
            className={`flex items-center gap-2 px-4 py-2 text-white text-sm font-medium rounded-lg transition-colors ${
              saved ? "bg-green-500" : "bg-accent hover:bg-accent-hover"
            }`}
          >
            <Save size={16} />
            {saved ? "Saved!" : "Save Attendance"}
          </button>
        }
      />

      {/* Filters */}
      <div className="bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Class selector */}
          <select
            value={selectedClass}
            onChange={(e) => {
              setClass(e.target.value);
              setSaved(false);
            }}
            className="px-3 py-2 rounded-lg bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border text-light-text-primary dark:text-dark-text-primary text-sm outline-none focus:border-accent transition-colors"
          >
            {classes.map((c) => (
              <option key={c} value={c}>
                Class {c}
              </option>
            ))}
          </select>

          {/* Date picker */}
          <input
            type="date"
            value={date}
            onChange={(e) => {
              setDate(e.target.value);
              setSaved(false);
            }}
            className="px-3 py-2 rounded-lg bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border text-light-text-primary dark:text-dark-text-primary text-sm outline-none focus:border-accent transition-colors"
          />

          <div className="flex-1" />

          {/* Mark all buttons */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary">
              Mark all:
            </span>
            {statuses.map((s) => (
              <button
                key={s}
                onClick={() => markAll(s)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${statusConfig[s].inactive}`}
              >
                {statusConfig[s].label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          {
            key: "present",
            label: "Present",
            color: "text-green-600 dark:text-green-400",
            bg: "bg-green-50 dark:bg-green-950",
          },
          {
            key: "absent",
            label: "Absent",
            color: "text-red-600 dark:text-red-400",
            bg: "bg-red-50 dark:bg-red-950",
          },
          {
            key: "late",
            label: "Late",
            color: "text-amber-600 dark:text-amber-400",
            bg: "bg-amber-50 dark:bg-amber-950",
          },
          {
            key: "leave",
            label: "Leave",
            color: "text-blue-600 dark:text-blue-400",
            bg: "bg-blue-50 dark:bg-blue-950",
          },
        ].map((item) => (
          <div
            key={item.key}
            className={`${item.bg} rounded-xl p-4 flex items-center justify-between`}
          >
            <span className={`text-sm font-medium ${item.color}`}>
              {item.label}
            </span>
            <span className={`text-2xl font-semibold ${item.color}`}>
              {counts[item.key]}
            </span>
          </div>
        ))}
      </div>

      {/* Student list */}
      <div className="bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl overflow-hidden">
        {/* Table header */}
        <div className="grid grid-cols-12 px-4 py-3 border-b border-light-border dark:border-dark-border">
          <span className="col-span-1 text-xs font-medium text-light-text-tertiary dark:text-dark-text-tertiary uppercase tracking-wide">
            #
          </span>
          <span className="col-span-5 text-xs font-medium text-light-text-tertiary dark:text-dark-text-tertiary uppercase tracking-wide">
            Student
          </span>
          <span className="col-span-6 text-xs font-medium text-light-text-tertiary dark:text-dark-text-tertiary uppercase tracking-wide">
            Status
          </span>
        </div>

        {/* Student rows */}
        {mockAttendanceStudents.map((student, index) => {
          const current = attendance[student.id];
          return (
            <div
              key={student.id}
              className="grid grid-cols-12 px-4 py-3 border-b border-light-border dark:border-dark-border last:border-0 hover:bg-light-hover dark:hover:bg-dark-hover transition-colors items-center"
            >
              {/* Index */}
              <span className="col-span-1 text-sm text-light-text-tertiary dark:text-dark-text-tertiary">
                {index + 1}
              </span>

              {/* Student info */}
              <div className="col-span-5 flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-accent text-xs font-medium flex-shrink-0">
                  {student.name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-medium text-light-text-primary dark:text-dark-text-primary">
                    {student.name}
                  </p>
                  <p className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary">
                    {student.rollNo}
                  </p>
                </div>
              </div>

              {/* Status buttons */}
              <div className="col-span-6 flex items-center gap-2">
                {statuses.map((s) => {
                  const config = statusConfig[s];
                  const Icon = config.icon;
                  const active = current === s;
                  return (
                    <button
                      key={s}
                      onClick={() => markStudent(student.id, s)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                        active ? config.active : config.inactive
                      }`}
                    >
                      <Icon size={12} />
                      {config.label}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default StudentAttendance;
