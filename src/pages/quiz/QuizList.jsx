import { useState, useMemo } from "react";
import {
  Plus,
  HelpCircle,
  Clock,
  Users,
  ChevronDown,
  ChevronUp,
  BarChart3,
} from "lucide-react";
import PageHeader from "../../components/common/PageHeader";
import StatusPill from "../../components/common/StatusPill";
import { mockQuizzes, mockQuizResults } from "../../data/mockData";

const quizStatusStyles = {
  upcoming: "bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-400",
  active: "bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-400",
  ended: "bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-400",
};

const filters = ["All", "upcoming", "active", "ended"];

function QuizList() {
  const [selectedStatus, setStatus] = useState("All");
  const [expandedId, setExpanded] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    name: "",
    description: "",
    class: "9-A",
    questions: 10,
    scheduledAt: "",
  });

  const filtered = useMemo(() => {
    return mockQuizzes.filter(
      (q) => selectedStatus === "All" || q.status === selectedStatus,
    );
  }, [selectedStatus]);

  const summary = useMemo(
    () => ({
      total: mockQuizzes.length,
      upcoming: mockQuizzes.filter((q) => q.status === "upcoming").length,
      active: mockQuizzes.filter((q) => q.status === "active").length,
      ended: mockQuizzes.filter((q) => q.status === "ended").length,
    }),
    [],
  );

  const getQuizResults = (quizId) =>
    mockQuizResults.filter((r) => r.quizId === quizId);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Quiz Management"
        subtitle="Create and manage online quizzes"
        action={
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-accent hover:bg-accent-hover text-white text-sm font-medium rounded-lg transition-colors"
          >
            <Plus size={16} />
            Create Quiz
          </button>
        }
      />

      {/* Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Total Quizzes",
            value: summary.total,
            bg: "bg-blue-50 dark:bg-blue-950",
            text: "text-blue-600 dark:text-blue-400",
          },
          {
            label: "Upcoming",
            value: summary.upcoming,
            bg: "bg-blue-50 dark:bg-blue-950",
            text: "text-blue-600 dark:text-blue-400",
          },
          {
            label: "Active",
            value: summary.active,
            bg: "bg-green-50 dark:bg-green-950",
            text: "text-green-600 dark:text-green-400",
          },
          {
            label: "Ended",
            value: summary.ended,
            bg: "bg-gray-50 dark:bg-gray-900",
            text: "text-gray-600 dark:text-gray-400",
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

      {/* Filter buttons */}
      <div className="flex gap-2 bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl p-1.5">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setStatus(f)}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedStatus === f
                ? "bg-accent text-white"
                : "text-light-text-secondary dark:text-dark-text-secondary hover:bg-light-hover dark:hover:bg-dark-hover"
            }`}
          >
            {f === "All" ? "All" : f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Quiz cards */}
      <div className="flex flex-col gap-3">
        {filtered.length > 0 ? (
          filtered.map((quiz) => {
            const results = getQuizResults(quiz.id);
            return (
              <div
                key={quiz.id}
                className="bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl overflow-hidden"
              >
                <div
                  className="flex items-center gap-4 px-5 py-4 cursor-pointer hover:bg-light-hover dark:hover:bg-dark-hover transition-colors"
                  onClick={() =>
                    setExpanded(expandedId === quiz.id ? null : quiz.id)
                  }
                >
                  <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center shrink-0">
                    <HelpCircle size={18} className="text-accent" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-light-text-primary dark:text-dark-text-primary">
                      {quiz.name}
                    </p>
                    <p className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary mt-0.5">
                      {quiz.description} · Class {quiz.class}
                    </p>
                  </div>
                  <div className="hidden sm:flex items-center gap-1.5 text-xs text-light-text-secondary dark:text-dark-text-secondary">
                    <HelpCircle size={13} />
                    {quiz.questions} questions
                  </div>
                  <div className="hidden sm:flex items-center gap-1.5 text-xs text-light-text-secondary dark:text-dark-text-secondary">
                    <Clock size={13} />
                    {quiz.scheduledAt}
                  </div>
                  <StatusPill status={quiz.status} styles={quizStatusStyles} />
                  {expandedId === quiz.id ? (
                    <ChevronUp
                      size={15}
                      className="text-light-text-tertiary dark:text-dark-text-tertiary"
                    />
                  ) : (
                    <ChevronDown
                      size={15}
                      className="text-light-text-tertiary dark:text-dark-text-tertiary"
                    />
                  )}
                </div>

                {expandedId === quiz.id && (
                  <div className="border-t border-light-border dark:border-dark-border px-5 py-4 bg-light-bg dark:bg-dark-bg">
                    {results.length > 0 ? (
                      <>
                        <p className="text-xs font-semibold text-light-text-tertiary dark:text-dark-text-tertiary uppercase tracking-wide mb-3 flex items-center gap-2">
                          <BarChart3 size={12} />
                          Results
                        </p>
                        <div className="flex flex-col gap-2">
                          {results.map((r) => (
                            <div key={r.id} className="flex items-center gap-3">
                              <div className="w-7 h-7 rounded-full bg-accent/10 flex items-center justify-center text-accent text-xs font-medium shrink-0">
                                {r.studentName.charAt(0)}
                              </div>
                              <span className="text-sm text-light-text-primary dark:text-dark-text-primary flex-1">
                                {r.studentName}
                              </span>
                              <span className="text-xs text-light-text-secondary dark:text-dark-text-secondary">
                                {r.score}/{r.total}
                              </span>
                              <div className="w-24 h-1.5 bg-light-card dark:bg-dark-card rounded-full overflow-hidden">
                                <div
                                  className={`h-full rounded-full ${r.percentage >= 80 ? "bg-green-500" : r.percentage >= 50 ? "bg-amber-500" : "bg-red-500"}`}
                                  style={{ width: `${r.percentage}%` }}
                                />
                              </div>
                              <span
                                className={`text-xs font-medium w-10 text-right ${r.percentage >= 80 ? "text-green-600 dark:text-green-400" : r.percentage >= 50 ? "text-amber-600 dark:text-amber-400" : "text-red-600 dark:text-red-400"}`}
                              >
                                {r.percentage}%
                              </span>
                            </div>
                          ))}
                        </div>
                      </>
                    ) : (
                      <p className="text-sm text-light-text-tertiary dark:text-dark-text-tertiary">
                        No results yet — quiz{" "}
                        {quiz.status === "upcoming"
                          ? "has not started"
                          : "is in progress"}
                        .
                      </p>
                    )}
                    <div className="flex gap-2 mt-4">
                      <button className="px-3 py-1.5 bg-accent hover:bg-accent-hover text-white text-xs font-medium rounded-lg transition-colors">
                        Edit Quiz
                      </button>
                      <button className="px-3 py-1.5 bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border text-light-text-secondary dark:text-dark-text-secondary text-xs font-medium rounded-lg hover:bg-light-hover dark:hover:bg-dark-hover transition-colors">
                        Add Questions
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl flex flex-col items-center justify-center py-16 gap-3">
            <div className="w-12 h-12 bg-light-hover dark:bg-dark-hover rounded-full flex items-center justify-center">
              <HelpCircle
                size={22}
                className="text-light-text-tertiary dark:text-dark-text-tertiary"
              />
            </div>
            <p className="text-light-text-secondary dark:text-dark-text-secondary text-sm font-medium">
              No quizzes found
            </p>
          </div>
        )}
      </div>

      {/* Create Quiz Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl p-6 w-full max-w-lg">
            <h2 className="text-base font-semibold text-light-text-primary dark:text-dark-text-primary mb-5">
              Create New Quiz
            </h2>
            <div className="flex flex-col gap-4">
              {[
                {
                  label: "Quiz Name",
                  key: "name",
                  type: "text",
                  placeholder: "e.g. Mathematics Quiz 1",
                },
                {
                  label: "Description",
                  key: "description",
                  type: "text",
                  placeholder: "Brief description",
                },
                {
                  label: "Questions",
                  key: "questions",
                  type: "number",
                  placeholder: "10",
                },
                {
                  label: "Start Time",
                  key: "scheduledAt",
                  type: "datetime-local",
                  placeholder: "",
                },
              ].map((field) => (
                <div key={field.key} className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-light-text-primary dark:text-dark-text-primary">
                    {field.label}
                  </label>
                  <input
                    type={field.type}
                    value={form[field.key]}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        [field.key]: e.target.value,
                      }))
                    }
                    placeholder={field.placeholder}
                    className="w-full px-4 py-2.5 rounded-lg bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border text-light-text-primary dark:text-dark-text-primary text-sm outline-none focus:border-accent transition-colors"
                  />
                </div>
              ))}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-light-text-primary dark:text-dark-text-primary">
                  Class
                </label>
                <select
                  value={form.class}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, class: e.target.value }))
                  }
                  className="w-full px-4 py-2.5 rounded-lg bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border text-light-text-primary dark:text-dark-text-primary text-sm outline-none focus:border-accent transition-colors"
                >
                  {["9-A", "10-B", "11-A"].map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 py-2.5 bg-accent hover:bg-accent-hover text-white text-sm font-medium rounded-lg transition-colors"
              >
                Create Quiz
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 py-2.5 bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border text-light-text-secondary dark:text-dark-text-secondary text-sm font-medium rounded-lg hover:bg-light-hover dark:hover:bg-dark-hover transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default QuizList;
