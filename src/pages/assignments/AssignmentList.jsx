import { useState, useMemo } from "react";
import {
  Search,
  Plus,
  FileText,
  Users,
  Clock,
  CheckSquare,
} from "lucide-react";
import PageHeader from "../../components/common/PageHeader";
import StatusPill from "../../components/common/StatusPill";
import { mockAssignments, assignmentStatusStyles } from "../../data/mockData";

const subjects = [
  "All Subjects",
  "Mathematics",
  "English",
  "Chemistry",
  "Physics",
  "History",
];
const statuses = ["All", "open", "grading", "overdue", "closed"];

function AssignmentList() {
  const [search, setSearch] = useState("");
  const [selectedSubject, setSubject] = useState("All Subjects");
  const [selectedStatus, setStatus] = useState("All");
  const [expandedId, setExpanded] = useState(null);

  // ── Filtered assignments ──
  const filtered = useMemo(() => {
    return mockAssignments.filter((a) => {
      const matchSearch =
        a.title.toLowerCase().includes(search.toLowerCase()) ||
        a.class.toLowerCase().includes(search.toLowerCase());
      const matchSubject =
        selectedSubject === "All Subjects" || a.subject === selectedSubject;
      const matchStatus =
        selectedStatus === "All" || a.status === selectedStatus;
      return matchSearch && matchSubject && matchStatus;
    });
  }, [search, selectedSubject, selectedStatus]);

  // ── Summary ──
  const summary = useMemo(
    () => ({
      total: mockAssignments.length,
      open: mockAssignments.filter((a) => a.status === "open").length,
      grading: mockAssignments.filter((a) => a.status === "grading").length,
      overdue: mockAssignments.filter((a) => a.status === "overdue").length,
    }),
    [],
  );

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <PageHeader
        title="Assignments"
        subtitle="Manage and track all assignments"
        action={
          <button className="flex items-center gap-2 px-4 py-2 bg-accent hover:bg-accent-hover text-white text-sm font-medium rounded-lg transition-colors">
            <Plus size={16} />
            New Assignment
          </button>
        }
      />

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Total",
            value: summary.total,
            bg: "bg-blue-50 dark:bg-blue-950",
            text: "text-blue-600 dark:text-blue-400",
            icon: FileText,
          },
          {
            label: "Open",
            value: summary.open,
            bg: "bg-green-50 dark:bg-green-950",
            text: "text-green-600 dark:text-green-400",
            icon: CheckSquare,
          },
          {
            label: "Grading",
            value: summary.grading,
            bg: "bg-amber-50 dark:bg-amber-950",
            text: "text-amber-600 dark:text-amber-400",
            icon: Clock,
          },
          {
            label: "Overdue",
            value: summary.overdue,
            bg: "bg-red-50 dark:bg-red-950",
            text: "text-red-600 dark:text-red-400",
            icon: Clock,
          },
        ].map((card) => (
          <div
            key={card.label}
            className={`${card.bg} rounded-xl p-4 flex items-center gap-4`}
          >
            <div
              className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${card.bg}`}
            >
              <card.icon size={20} className={card.text} />
            </div>
            <div>
              <p className={`text-2xl font-semibold ${card.text}`}>
                {card.value}
              </p>
              <p className={`text-xs ${card.text} opacity-75`}>{card.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-light-text-tertiary dark:text-dark-text-tertiary"
            />
            <input
              type="text"
              placeholder="Search by title or class..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-lg bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border text-light-text-primary dark:text-dark-text-primary placeholder:text-light-text-tertiary dark:placeholder:text-dark-text-tertiary text-sm outline-none focus:border-accent transition-colors"
            />
          </div>

          {/* Subject filter */}
          <select
            value={selectedSubject}
            onChange={(e) => setSubject(e.target.value)}
            className="px-3 py-2 rounded-lg bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border text-light-text-primary dark:text-dark-text-primary text-sm outline-none focus:border-accent transition-colors"
          >
            {subjects.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          {/* Status filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setStatus(e.target.value)}
            className="px-3 py-2 rounded-lg bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border text-light-text-primary dark:text-dark-text-primary text-sm outline-none focus:border-accent transition-colors"
          >
            {statuses.map((s) => (
              <option key={s} value={s}>
                {s === "All"
                  ? "All Status"
                  : s.charAt(0).toUpperCase() + s.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Assignment cards */}
      <div className="flex flex-col gap-3">
        {filtered.length > 0 ? (
          filtered.map((assignment) => (
            <div
              key={assignment.id}
              className="bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl overflow-hidden"
            >
              {/* Card header */}
              <div
                className="flex items-center gap-4 px-5 py-4 cursor-pointer hover:bg-light-hover dark:hover:bg-dark-hover transition-colors"
                onClick={() =>
                  setExpanded(
                    expandedId === assignment.id ? null : assignment.id,
                  )
                }
              >
                {/* Icon */}
                <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center shrink-0">
                  <FileText size={18} className="text-accent" />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-light-text-primary dark:text-dark-text-primary truncate">
                    {assignment.title}
                  </p>
                  <p className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary mt-0.5">
                    {assignment.subject} · Class {assignment.class} ·{" "}
                    {assignment.teacher}
                  </p>
                </div>

                {/* Submission progress */}
                <div className="hidden sm:flex items-center gap-2">
                  <Users
                    size={14}
                    className="text-light-text-tertiary dark:text-dark-text-tertiary"
                  />
                  <span className="text-xs text-light-text-secondary dark:text-dark-text-secondary">
                    {assignment.submitted}/{assignment.total}
                  </span>
                  {/* Progress bar */}
                  <div className="w-20 h-1.5 bg-light-hover dark:bg-dark-hover rounded-full overflow-hidden">
                    <div
                      className="h-full bg-accent rounded-full"
                      style={{
                        width: `${(assignment.submitted / assignment.total) * 100}%`,
                      }}
                    />
                  </div>
                </div>

                {/* Deadline */}
                <div className="hidden sm:flex items-center gap-1.5 text-xs text-light-text-tertiary dark:text-dark-text-tertiary">
                  <Clock size={13} />
                  {assignment.deadline}
                </div>

                {/* Status */}
                <StatusPill
                  status={assignment.status}
                  styles={assignmentStatusStyles}
                />

                {/* Marks */}
                <span className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary">
                  {assignment.totalMarks} marks
                </span>
              </div>

              {/* Expanded details */}
              {expandedId === assignment.id && (
                <div className="border-t border-light-border dark:border-dark-border px-5 py-4 bg-light-bg dark:bg-dark-bg">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary mb-1">
                        Subject
                      </p>
                      <p className="text-sm font-medium text-light-text-primary dark:text-dark-text-primary">
                        {assignment.subject}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary mb-1">
                        Class
                      </p>
                      <p className="text-sm font-medium text-light-text-primary dark:text-dark-text-primary">
                        {assignment.class}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary mb-1">
                        Deadline
                      </p>
                      <p className="text-sm font-medium text-light-text-primary dark:text-dark-text-primary">
                        {assignment.deadline}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary mb-1">
                        Total Marks
                      </p>
                      <p className="text-sm font-medium text-light-text-primary dark:text-dark-text-primary">
                        {assignment.totalMarks}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="px-3 py-1.5 bg-accent hover:bg-accent-hover text-white text-xs font-medium rounded-lg transition-colors">
                      View Submissions
                    </button>
                    <button className="px-3 py-1.5 bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border text-light-text-secondary dark:text-dark-text-secondary text-xs font-medium rounded-lg hover:bg-light-hover dark:hover:bg-dark-hover transition-colors">
                      Edit Assignment
                    </button>
                    <button className="px-3 py-1.5 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-xs font-medium rounded-lg hover:bg-red-100 transition-colors">
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl flex flex-col items-center justify-center py-16 gap-3">
            <div className="w-12 h-12 bg-light-hover dark:bg-dark-hover rounded-full flex items-center justify-center">
              <FileText
                size={22}
                className="text-light-text-tertiary dark:text-dark-text-tertiary"
              />
            </div>
            <p className="text-light-text-secondary dark:text-dark-text-secondary text-sm font-medium">
              No assignments found
            </p>
            <p className="text-light-text-tertiary dark:text-dark-text-tertiary text-xs">
              Try adjusting your search or filters
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default AssignmentList;
