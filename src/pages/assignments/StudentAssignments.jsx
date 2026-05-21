import { useState, useMemo } from "react";
import { FileText, Upload, CheckCircle, Clock, Star, Eye } from "lucide-react";
import PageHeader from "../../components/common/PageHeader";
import StatusPill from "../../components/common/StatusPill";
import {
  mockAssignments,
  mockSubmissions,
  assignmentStatusStyles,
} from "../../data/mockData";

const tabs = ["Pending", "Submitted", "Graded"];

function StudentAssignments() {
  const [activeTab, setTab] = useState("Pending");
  const [expandedId, setExpanded] = useState(null);
  const [uploadedIds, setUploaded] = useState([]);

  // Simulate student ID = 1 (Ali Hassan)
  const studentId = 1;

  const mySubmissions = mockSubmissions.filter(
    (s) => s.studentId === studentId,
  );

  const assignments = useMemo(() => {
    return mockAssignments.map((a) => {
      const submission = mySubmissions.find((s) => s.assignmentId === a.id);
      return { ...a, submission };
    });
  }, [mySubmissions]);

  const filtered = useMemo(() => {
    return assignments.filter((a) => {
      if (activeTab === "Pending")
        return !a.submission || a.submission.status === "pending";
      if (activeTab === "Submitted")
        return a.submission?.status === "submitted";
      if (activeTab === "Graded") return a.submission?.status === "graded";
      return true;
    });
  }, [assignments, activeTab]);

  const handleUpload = (id) => {
    setUploaded((prev) => [...prev, id]);
  };

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="My Assignments"
        subtitle="View and submit your assignments"
      />

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        {[
          {
            label: "Pending",
            value: assignments.filter(
              (a) => !a.submission || a.submission.status === "pending",
            ).length,
            bg: "bg-amber-50 dark:bg-amber-950",
            text: "text-amber-600 dark:text-amber-400",
          },
          {
            label: "Submitted",
            value: assignments.filter(
              (a) => a.submission?.status === "submitted",
            ).length,
            bg: "bg-blue-50 dark:bg-blue-950",
            text: "text-blue-600 dark:text-blue-400",
          },
          {
            label: "Graded",
            value: assignments.filter((a) => a.submission?.status === "graded")
              .length,
            bg: "bg-green-50 dark:bg-green-950",
            text: "text-green-600 dark:text-green-400",
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

      {/* Tabs */}
      <div className="flex gap-2 bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl p-1.5">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setTab(tab)}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === tab
                ? "bg-accent text-white"
                : "text-light-text-secondary dark:text-dark-text-secondary hover:bg-light-hover dark:hover:bg-dark-hover"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Assignments */}
      <div className="flex flex-col gap-3">
        {filtered.length > 0 ? (
          filtered.map((assignment) => (
            <div
              key={assignment.id}
              className="bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl overflow-hidden"
            >
              <div
                className="flex items-center gap-4 px-5 py-4 cursor-pointer hover:bg-light-hover dark:hover:bg-dark-hover transition-colors"
                onClick={() =>
                  setExpanded(
                    expandedId === assignment.id ? null : assignment.id,
                  )
                }
              >
                <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FileText size={18} className="text-accent" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-light-text-primary dark:text-dark-text-primary">
                    {assignment.title}
                  </p>
                  <p className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary mt-0.5">
                    {assignment.subject} · {assignment.teacher}
                  </p>
                </div>
                <div className="hidden sm:flex items-center gap-1.5 text-xs text-light-text-secondary dark:text-dark-text-secondary">
                  <Clock size={13} />
                  Due: {assignment.deadline}
                </div>
                {assignment.submission?.marks && (
                  <span className="flex items-center gap-1 text-sm font-bold text-accent">
                    <Star size={13} />
                    {assignment.submission.marks}/{assignment.totalMarks}
                  </span>
                )}
                <StatusPill
                  status={assignment.submission?.status || "pending"}
                  styles={{
                    ...assignmentStatusStyles,
                    pending:
                      "bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400",
                  }}
                />
              </div>

              {expandedId === assignment.id && (
                <div className="border-t border-light-border dark:border-dark-border px-5 py-4 bg-light-bg dark:bg-dark-bg">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                    {[
                      { label: "Subject", value: assignment.subject },
                      { label: "Total Marks", value: assignment.totalMarks },
                      { label: "Deadline", value: assignment.deadline },
                      { label: "Teacher", value: assignment.teacher },
                    ].map((item) => (
                      <div key={item.label}>
                        <p className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary mb-1">
                          {item.label}
                        </p>
                        <p className="text-sm font-medium text-light-text-primary dark:text-dark-text-primary">
                          {item.value}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Feedback if graded */}
                  {assignment.submission?.feedback && (
                    <div className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg px-4 py-3 mb-4">
                      <p className="text-xs font-semibold text-green-700 dark:text-green-400 mb-1">
                        Teacher Feedback
                      </p>
                      <p className="text-sm text-green-700 dark:text-green-400 italic">
                        "{assignment.submission.feedback}"
                      </p>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <button className="flex items-center gap-1.5 px-3 py-1.5 bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border text-light-text-secondary dark:text-dark-text-secondary text-xs font-medium rounded-lg hover:bg-light-hover dark:hover:bg-dark-hover transition-colors">
                      <Eye size={12} />
                      View Assignment
                    </button>
                    {!assignment.submission ||
                    assignment.submission.status === "pending" ? (
                      <button
                        onClick={() => handleUpload(assignment.id)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                          uploadedIds.includes(assignment.id)
                            ? "bg-green-500 text-white"
                            : "bg-accent hover:bg-accent-hover text-white"
                        }`}
                      >
                        {uploadedIds.includes(assignment.id) ? (
                          <>
                            <CheckCircle size={12} /> Uploaded!
                          </>
                        ) : (
                          <>
                            <Upload size={12} /> Upload Submission
                          </>
                        )}
                      </button>
                    ) : null}
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
              No {activeTab.toLowerCase()} assignments
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default StudentAssignments;
