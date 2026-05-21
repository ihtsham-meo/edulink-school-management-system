import { CalendarCheck, FileText, Banknote, BarChart3 } from "lucide-react";
import StatCard from "../../components/common/StatCard";
import StatusPill from "../../components/common/StatusPill";
import {
  mockAttendance,
  mockFeePayments,
  mockAssignments,
  mockExams,
  feeStatusStyles,
  assignmentStatusStyles,
} from "../../data/mockData";

function ParentDashboard() {
  // Simulate child = Ali Hassan (studentId: 1)
  const childName = "Ali Hassan";
  const childClass = "10-A";
  const myAttendance = mockAttendance.filter((a) => a.studentId === 1);
  const myFees = mockFeePayments.filter((f) => f.studentId === 1);
  const attendancePct =
    myAttendance.length > 0
      ? Math.round(
          (myAttendance.filter((a) => a.status === "present").length /
            myAttendance.length) *
            100,
        )
      : 0;
  const pendingFees = myFees.filter((f) => f.status !== "paid").length;
  const recentAssignments = mockAssignments.slice(0, 3);

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl p-5">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-accent flex items-center justify-center text-white text-xl font-semibold flex-shrink-0">
            {childName.charAt(0)}
          </div>
          <div>
            <h1 className="text-lg font-semibold text-light-text-primary dark:text-dark-text-primary">
              {childName}
            </h1>
            <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
              Class {childClass} · Roll No: ST001
            </p>
            <p className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary mt-0.5">
              Session: 2025-2026
            </p>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Attendance"
          value={`${attendancePct}%`}
          subtitle="This month"
          icon={CalendarCheck}
          gradient={attendancePct >= 75 ? "green" : "red"}
        />
        <StatCard
          title="Pending Fees"
          value={pendingFees}
          subtitle="Payments due"
          icon={Banknote}
          gradient="orange"
        />
        <StatCard
          title="Assignments"
          value="3"
          subtitle="Pending"
          icon={FileText}
          gradient="blue"
        />
        <StatCard
          title="Latest Grade"
          value="A+"
          subtitle="Mathematics"
          icon={BarChart3}
          gradient="purple"
        />
      </div>

      {/* Middle row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Attendance overview */}
        <div className="bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl p-5">
          <h2 className="text-sm font-semibold text-light-text-primary dark:text-dark-text-primary mb-4">
            Attendance Overview
          </h2>
          <div className="flex items-center gap-4 mb-4">
            <div className="relative w-20 h-20">
              <svg viewBox="0 0 36 36" className="w-20 h-20 -rotate-90">
                <circle
                  cx="18"
                  cy="18"
                  r="15.9"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  className="text-light-hover dark:text-dark-hover"
                />
                <circle
                  cx="18"
                  cy="18"
                  r="15.9"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeDasharray={`${attendancePct} ${100 - attendancePct}`}
                  className={
                    attendancePct >= 75 ? "text-green-500" : "text-red-500"
                  }
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span
                  className={`text-sm font-bold ${attendancePct >= 75 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}
                >
                  {attendancePct}%
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              {[
                {
                  label: "Present",
                  value: myAttendance.filter((a) => a.status === "present")
                    .length,
                  color: "text-green-600 dark:text-green-400",
                },
                {
                  label: "Absent",
                  value: myAttendance.filter((a) => a.status === "absent")
                    .length,
                  color: "text-red-600 dark:text-red-400",
                },
                {
                  label: "Late",
                  value: myAttendance.filter((a) => a.status === "late").length,
                  color: "text-amber-600 dark:text-amber-400",
                },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-2">
                  <span className={`text-sm font-semibold ${item.color} w-6`}>
                    {item.value}
                  </span>
                  <span className="text-xs text-light-text-secondary dark:text-dark-text-secondary">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
          {attendancePct < 75 && (
            <div className="px-3 py-2 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-xs text-red-600 dark:text-red-400 font-medium">
                ⚠️ Attendance below 75% — please ensure regular attendance
              </p>
            </div>
          )}
        </div>

        {/* Fee status */}
        <div className="bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-light-text-primary dark:text-dark-text-primary">
              Fee Status
            </h2>
            <button className="text-xs text-accent hover:underline">
              View all
            </button>
          </div>
          <div className="flex flex-col gap-2">
            {myFees.map((fee) => (
              <div
                key={fee.id}
                className="flex items-center justify-between px-3 py-2.5 rounded-lg bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border"
              >
                <div>
                  <p className="text-sm font-medium text-light-text-primary dark:text-dark-text-primary">
                    {fee.month}
                  </p>
                  <p className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary">
                    Rs {fee.amount.toLocaleString()}
                  </p>
                </div>
                <StatusPill status={fee.status} styles={feeStatusStyles} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Upcoming exams + Recent assignments */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming exams */}
        <div className="bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl p-5">
          <h2 className="text-sm font-semibold text-light-text-primary dark:text-dark-text-primary mb-4">
            Upcoming Exams
          </h2>
          <div className="flex flex-col gap-3">
            {mockExams.slice(0, 3).map((exam) => (
              <div key={exam.id} className="flex items-center gap-3">
                <div className="w-10 h-10 bg-accent/10 rounded-lg flex flex-col items-center justify-center flex-shrink-0">
                  <span className="text-accent text-sm font-semibold leading-none">
                    {exam.date.split("-")[2]}
                  </span>
                  <span className="text-accent text-xs opacity-70">May</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-light-text-primary dark:text-dark-text-primary">
                    {exam.subject}
                  </p>
                  <p className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary">
                    {exam.class} · {exam.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent assignments */}
        <div className="bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl p-5">
          <h2 className="text-sm font-semibold text-light-text-primary dark:text-dark-text-primary mb-4">
            Recent Assignments
          </h2>
          <div className="flex flex-col gap-2">
            {recentAssignments.map((a) => (
              <div
                key={a.id}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-light-text-primary dark:text-dark-text-primary truncate">
                    {a.title}
                  </p>
                  <p className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary">
                    {a.subject} · Due {a.deadline}
                  </p>
                </div>
                <StatusPill status={a.status} styles={assignmentStatusStyles} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ParentDashboard;
