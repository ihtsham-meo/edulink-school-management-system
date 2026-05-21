import { useState, useMemo } from "react";
import { Search, Upload, CheckCircle, Clock, Eye, Star } from "lucide-react";
import PageHeader from "../../components/common/PageHeader";
import StatusPill from "../../components/common/StatusPill";
import {
  mockSubmissions,
  mockAssignments,
  assignmentStatusStyles,
} from "../../data/mockData";

function Submissions() {
  const [search, setSearch] = useState("");
  const [selectedAssignment, setAssignment] = useState("All");
  const [expandedId, setExpanded] = useState(null);
  const [grades, setGrades] = useState({});

  const assignmentOptions = ["All", ...mockAssignments.map((a) => a.title)];

  const filtered = useMemo(() => {
    return mockSubmissions.filter((s) => {
      const matchSearch = s.studentName
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchAssignment =
        selectedAssignment === "All" ||
        mockAssignments.find((a) => a.id === s.assignmentId)?.title ===
          selectedAssignment;
      return matchSearch && matchAssignment;
    });
  }, [search, selectedAssignment]);

  const summary = useMemo(
    () => ({
      total: mockSubmissions.length,
      submitted: mockSubmissions.filter((s) => s.status === "submitted").length,
      graded: mockSubmissions.filter((s) => s.status === "graded").length,
      pending: mockSubmissions.filter((s) => s.status === "pending").length,
    }),
    [],
  );

  const handleGrade = (id) => {
    console.log("Grading submission:", id, grades[id]);
  };

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Submissions"
        subtitle="Review and grade student assignment submissions"
      />

      {/* Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Total",
            value: summary.total,
            bg: "bg-blue-50 dark:bg-blue-950",
            text: "text-blue-600 dark:text-blue-400",
          },
          {
            label: "Submitted",
            value: summary.submitted,
            bg: "bg-amber-50 dark:bg-amber-950",
            text: "text-amber-600 dark:text-amber-400",
          },
          {
            label: "Graded",
            value: summary.graded,
            bg: "bg-green-50 dark:bg-green-950",
            text: "text-green-600 dark:text-green-400",
          },
          {
            label: "Pending",
            value: summary.pending,
            bg: "bg-red-50 dark:bg-red-950",
            text: "text-red-600 dark:text-red-400",
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

      {/* Filters */}
      <div className="bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-light-text-tertiary dark:text-dark-text-tertiary"
            />
            <input
              type="text"
              placeholder="Search by student name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-lg bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border text-light-text-primary dark:text-dark-text-primary placeholder:text-light-text-tertiary dark:placeholder:text-dark-text-tertiary text-sm outline-none focus:border-accent transition-colors"
            />
          </div>
          <select
            value={selectedAssignment}
            onChange={(e) => setAssignment(e.target.value)}
            className="px-3 py-2 rounded-lg bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border text-light-text-primary dark:text-dark-text-primary text-sm outline-none focus:border-accent transition-colors"
          >
            {assignmentOptions.map((a) => (
              <option key={a} value={a}>
                {a === "All" ? "All Assignments" : a}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Submissions list */}
      <div className="flex flex-col gap-3">
        {filtered.length > 0 ? (
          filtered.map((sub) => {
            const assignment = mockAssignments.find(
              (a) => a.id === sub.assignmentId,
            );
            return (
              <div
                key={sub.id}
                className="bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl overflow-hidden"
              >
                <div
                  className="flex items-center gap-4 px-5 py-4 cursor-pointer hover:bg-light-hover dark:hover:bg-dark-hover transition-colors"
                  onClick={() =>
                    setExpanded(expandedId === sub.id ? null : sub.id)
                  }
                >
                  <div className="w-9 h-9 rounded-full bg-accent/10 flex items-center justify-center text-accent text-sm font-semibold flex-shrink-0">
                    {sub.studentName.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-light-text-primary dark:text-dark-text-primary">
                      {sub.studentName}
                    </p>
                    <p className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary mt-0.5">
                      {assignment?.title}
                    </p>
                  </div>
                  {sub.submittedAt && (
                    <span className="hidden sm:flex items-center gap-1 text-xs text-light-text-tertiary dark:text-dark-text-tertiary">
                      <Clock size={12} />
                      {sub.submittedAt}
                    </span>
                  )}
                  {sub.marks && (
                    <span className="flex items-center gap-1 text-sm font-bold text-accent">
                      <Star size={13} />
                      {sub.marks}/{assignment?.totalMarks}
                    </span>
                  )}
                  <StatusPill
                    status={sub.status}
                    styles={assignmentStatusStyles}
                  />
                </div>

                {expandedId === sub.id && (
                  <div className="border-t border-light-border dark:border-dark-border px-5 py-4 bg-light-bg dark:bg-dark-bg">
                    {sub.feedback && (
                      <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary mb-4 italic">
                        Feedback: "{sub.feedback}"
                      </p>
                    )}
                    {sub.status === "submitted" && (
                      <div className="flex gap-3 items-end">
                        <div className="flex flex-col gap-1.5">
                          <label className="text-xs font-medium text-light-text-primary dark:text-dark-text-primary">
                            Marks / {assignment?.totalMarks}
                          </label>
                          <input
                            type="number"
                            placeholder="Enter marks"
                            value={grades[sub.id] || ""}
                            onChange={(e) =>
                              setGrades((prev) => ({
                                ...prev,
                                [sub.id]: e.target.value,
                              }))
                            }
                            className="w-32 px-3 py-2 rounded-lg bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border text-light-text-primary dark:text-dark-text-primary text-sm outline-none focus:border-accent transition-colors"
                          />
                        </div>
                        <div className="flex flex-col gap-1.5 flex-1">
                          <label className="text-xs font-medium text-light-text-primary dark:text-dark-text-primary">
                            Feedback
                          </label>
                          <input
                            type="text"
                            placeholder="Written feedback..."
                            className="w-full px-3 py-2 rounded-lg bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border text-light-text-primary dark:text-dark-text-primary text-sm outline-none focus:border-accent transition-colors"
                          />
                        </div>
                        <button
                          onClick={() => handleGrade(sub.id)}
                          className="flex items-center gap-1.5 px-4 py-2 bg-accent hover:bg-accent-hover text-white text-sm font-medium rounded-lg transition-colors"
                        >
                          <CheckCircle size={14} />
                          Submit Grade
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl flex flex-col items-center justify-center py-16 gap-3">
            <div className="w-12 h-12 bg-light-hover dark:bg-dark-hover rounded-full flex items-center justify-center">
              <Upload
                size={22}
                className="text-light-text-tertiary dark:text-dark-text-tertiary"
              />
            </div>
            <p className="text-light-text-secondary dark:text-dark-text-secondary text-sm font-medium">
              No submissions found
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Submissions;
