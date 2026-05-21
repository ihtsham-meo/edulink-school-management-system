import { useMemo } from "react";
import {
  CalendarCheck,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";
import PageHeader from "../../components/common/PageHeader";
import { mockAttendance, attendanceStatusStyles } from "../../data/mockData";
import StatusPill from "../../components/common/StatusPill";

function StudentAttendanceView() {
  // Simulate student ID = 1
  const studentId = 1;
  const myAttendance = mockAttendance.filter((a) => a.studentId === studentId);

  const stats = useMemo(() => {
    const total = myAttendance.length;
    const present = myAttendance.filter((a) => a.status === "present").length;
    const absent = myAttendance.filter((a) => a.status === "absent").length;
    const late = myAttendance.filter((a) => a.status === "late").length;
    const percent = total > 0 ? Math.round((present / total) * 100) : 0;
    return { total, present, absent, late, percent };
  }, [myAttendance]);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="My Attendance"
        subtitle="Track your daily attendance record"
      />

      {/* Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Attendance %",
            value: `${stats.percent}%`,
            bg:
              stats.percent >= 75
                ? "bg-green-50 dark:bg-green-950"
                : "bg-red-50 dark:bg-red-950",
            text:
              stats.percent >= 75
                ? "text-green-600 dark:text-green-400"
                : "text-red-600 dark:text-red-400",
          },
          {
            label: "Present",
            value: stats.present,
            bg: "bg-green-50 dark:bg-green-950",
            text: "text-green-600 dark:text-green-400",
          },
          {
            label: "Absent",
            value: stats.absent,
            bg: "bg-red-50 dark:bg-red-950",
            text: "text-red-600 dark:text-red-400",
          },
          {
            label: "Late",
            value: stats.late,
            bg: "bg-amber-50 dark:bg-amber-950",
            text: "text-amber-600 dark:text-amber-400",
          },
        ].map((card) => (
          <div key={card.label} className={`${card.bg} rounded-xl p-4`}>
            <p className={`text-2xl font-semibold ${card.text}`}>
              {card.value}
            </p>
            <p className={`text-xs ${card.text} opacity-75 mt-1`}>
              {card.label}
            </p>
          </div>
        ))}
      </div>

      {/* Attendance warning */}
      {stats.percent < 75 && (
        <div className="flex items-start gap-3 px-4 py-3 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-xl">
          <AlertTriangle
            size={18}
            className="text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5"
          />
          <div>
            <p className="text-sm font-semibold text-red-700 dark:text-red-400">
              Low Attendance Warning
            </p>
            <p className="text-xs text-red-600 dark:text-red-400 mt-0.5">
              Your attendance is below 75%. Minimum required is 75% to appear in
              exams.
            </p>
          </div>
        </div>
      )}

      {/* Progress bar */}
      <div className="bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl p-5">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-semibold text-light-text-primary dark:text-dark-text-primary">
            Overall Attendance
          </p>
          <span
            className={`text-sm font-bold ${stats.percent >= 75 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}
          >
            {stats.percent}%
          </span>
        </div>
        <div className="w-full h-3 bg-light-hover dark:bg-dark-hover rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${stats.percent >= 75 ? "bg-green-500" : "bg-red-500"}`}
            style={{ width: `${stats.percent}%` }}
          />
        </div>
        <div className="flex justify-between mt-2">
          <span className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary">
            0%
          </span>
          <span className="text-xs text-amber-600 dark:text-amber-400 font-medium">
            75% minimum
          </span>
          <span className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary">
            100%
          </span>
        </div>
      </div>

      {/* Attendance log */}
      <div className="bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl overflow-hidden">
        <div className="grid grid-cols-3 px-4 py-3 border-b border-light-border dark:border-dark-border">
          {["Date", "Class", "Status"].map((h) => (
            <span
              key={h}
              className="text-xs font-medium text-light-text-tertiary dark:text-dark-text-tertiary uppercase tracking-wide"
            >
              {h}
            </span>
          ))}
        </div>
        {myAttendance.length > 0 ? (
          myAttendance.map((record) => (
            <div
              key={record.id}
              className="grid grid-cols-3 px-4 py-3 border-b border-light-border dark:border-dark-border last:border-0 hover:bg-light-hover dark:hover:bg-dark-hover transition-colors items-center"
            >
              <span className="text-sm text-light-text-primary dark:text-dark-text-primary font-medium">
                {record.date}
              </span>
              <span className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                {record.class}
              </span>
              <StatusPill
                status={record.status}
                styles={attendanceStatusStyles}
              />
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <CalendarCheck
              size={22}
              className="text-light-text-tertiary dark:text-dark-text-tertiary"
            />
            <p className="text-light-text-secondary dark:text-dark-text-secondary text-sm">
              No attendance records
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default StudentAttendanceView;
