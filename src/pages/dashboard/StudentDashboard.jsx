import { CalendarCheck, FileText, BarChart3, Banknote } from "lucide-react";
import StatCard from "../../components/common/StatCard";
import {
  mockTimetable,
  mockAssignments,
  assignmentStatusStyles,
} from "../../data/mockData";

function StudentDashboard() {
  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h1 className="text-light-text-primary dark:text-dark-text-primary text-xl font-semibold">
          Dashboard
        </h1>
        <p className="text-light-text-secondary dark:text-dark-text-secondary text-sm mt-0.5">
          Good morning, Ali Hassan — Wednesday, 14 May 2026
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Attendance"
          value="88%"
          subtitle="This month"
          icon={CalendarCheck}
          gradient="green"
        />
        <StatCard
          title="Assignments Due"
          value="3"
          subtitle="This week"
          icon={FileText}
          gradient="orange"
        />
        <StatCard
          title="Latest Result"
          value="A+"
          subtitle="Mathematics"
          icon={BarChart3}
          gradient="blue"
        />
        <StatCard
          title="Fee Status"
          value="Paid"
          subtitle="May 2026"
          icon={Banknote}
          gradient="purple"
        />
      </div>

      {/* Middle row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Today's Timetable */}
        <div className="bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl p-5">
          <h2 className="text-light-text-primary dark:text-dark-text-primary text-sm font-semibold mb-4">
            Today's Timetable
          </h2>
          <div className="flex flex-col gap-2">
            {mockTimetable.map((p, i) => (
              <div
                key={p.period}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg ${i === 2 ? "bg-accent/10 border border-accent/20" : "hover:bg-light-hover dark:hover:bg-dark-hover"}`}
              >
                <span
                  className={`text-xs font-medium px-2 py-1 rounded-md min-w-[55px] text-center ${i === 2 ? "bg-accent text-white" : "bg-accent/10 text-accent"}`}
                >
                  {p.time}
                </span>
                <div className="flex-1">
                  <p className="text-sm font-medium text-light-text-primary dark:text-dark-text-primary">
                    {p.subject}
                  </p>
                  <p className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary">
                    {p.teacher}
                  </p>
                </div>
                {i === 2 && (
                  <span className="text-xs bg-accent text-white px-2 py-0.5 rounded-full">
                    Now
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Assignments */}
        <div className="bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-light-text-primary dark:text-dark-text-primary text-sm font-semibold">
              My Assignments
            </h2>
            <button className="text-xs text-accent hover:underline">
              View all
            </button>
          </div>
          <div className="flex flex-col gap-2">
            {mockAssignments.map((a) => (
              <div
                key={a.id}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-light-hover dark:hover:bg-dark-hover transition-colors"
              >
                <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FileText size={14} className="text-accent" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-light-text-primary dark:text-dark-text-primary truncate">
                    {a.title}
                  </p>
                  <p className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary">
                    {a.subject} · Due {a.deadline}
                  </p>
                </div>
                <span
                  className={`text-xs px-2 py-0.5 rounded-md font-medium flex-shrink-0 ${assignmentStatusStyles[a.status]}`}
                >
                  {a.status.charAt(0).toUpperCase() + a.status.slice(1)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentDashboard;
