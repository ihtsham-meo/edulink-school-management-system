import { useState, useMemo } from "react";
import {
  Search,
  BarChart3,
  Award,
  BookOpen,
  CheckCircle,
  Eye,
  Printer,
} from "lucide-react";
import PageHeader from "../../components/common/PageHeader";
import { mockResults, mockGradeRules } from "../../data/mockData";

const tabs = ["Results", "Grade Boundaries"];

const getGrade = (marks) => {
  const rule = mockGradeRules.find((r) => marks >= r.from && marks <= r.to);
  return rule ? rule.grade : "F";
};

const getGradeColor = (grade) => {
  const colors = {
    "A+": "text-green-600 dark:text-green-400",
    A: "text-green-600 dark:text-green-400",
    "B+": "text-blue-600 dark:text-blue-400",
    B: "text-blue-600 dark:text-blue-400",
    C: "text-amber-600 dark:text-amber-400",
    D: "text-orange-600 dark:text-orange-400",
    F: "text-red-600 dark:text-red-400",
  };
  return colors[grade] || "text-gray-600";
};

const getAverage = (subjects) => {
  const marks = Object.values(subjects);
  return Math.round(marks.reduce((a, b) => a + b, 0) / marks.length);
};

const isPassed = (subjects) => {
  return Object.values(subjects).every((m) => m >= 40);
};

function GradesResults() {
  const [activeTab, setTab] = useState("Results");
  const [search, setSearch] = useState("");
  const [selectedClass, setClass] = useState("All Classes");
  const [selectedStatus, setStatus] = useState("All");
  const [results, setResults] = useState(mockResults);
  const [expandedId, setExpanded] = useState(null);

  const classes = ["All Classes", "7-A", "8-C", "9-B", "10-A", "11-A"];

  const filtered = useMemo(() => {
    return results.filter((r) => {
      const matchSearch = r.studentName
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchClass =
        selectedClass === "All Classes" || r.class === selectedClass;
      const matchStatus =
        selectedStatus === "All" ||
        (selectedStatus === "published" && r.published) ||
        (selectedStatus === "unpublished" && !r.published);
      return matchSearch && matchClass && matchStatus;
    });
  }, [search, selectedClass, selectedStatus, results]);

  const summary = useMemo(
    () => ({
      total: results.length,
      published: results.filter((r) => r.published).length,
      unpublished: results.filter((r) => !r.published).length,
      passed: results.filter((r) => isPassed(r.subjects)).length,
    }),
    [results],
  );

  const handlePublish = (id) => {
    setResults((prev) =>
      prev.map((r) => (r.id === id ? { ...r, published: !r.published } : r)),
    );
  };

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Grades & Results"
        subtitle="Manage student results and grade boundaries"
        action={
          <button className="flex items-center gap-2 px-4 py-2 bg-accent hover:bg-accent-hover text-white text-sm font-medium rounded-lg transition-colors">
            <Printer size={16} />
            Print Result Cards
          </button>
        }
      />

      {/* Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Total Results",
            value: summary.total,
            bg: "bg-blue-50 dark:bg-blue-950",
            text: "text-blue-600 dark:text-blue-400",
          },
          {
            label: "Published",
            value: summary.published,
            bg: "bg-green-50 dark:bg-green-950",
            text: "text-green-600 dark:text-green-400",
          },
          {
            label: "Unpublished",
            value: summary.unpublished,
            bg: "bg-amber-50 dark:bg-amber-950",
            text: "text-amber-600 dark:text-amber-400",
          },
          {
            label: "Passed",
            value: summary.passed,
            bg: "bg-purple-50 dark:bg-purple-950",
            text: "text-purple-600 dark:text-purple-400",
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

      {/* Results Tab */}
      {activeTab === "Results" && (
        <>
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
                value={selectedClass}
                onChange={(e) => setClass(e.target.value)}
                className="px-3 py-2 rounded-lg bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border text-light-text-primary dark:text-dark-text-primary text-sm outline-none focus:border-accent transition-colors"
              >
                {classes.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <select
                value={selectedStatus}
                onChange={(e) => setStatus(e.target.value)}
                className="px-3 py-2 rounded-lg bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border text-light-text-primary dark:text-dark-text-primary text-sm outline-none focus:border-accent transition-colors"
              >
                {["All", "published", "unpublished"].map((s) => (
                  <option key={s} value={s}>
                    {s === "All"
                      ? "All Status"
                      : s.charAt(0).toUpperCase() + s.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Results list */}
          <div className="flex flex-col gap-3">
            {filtered.length > 0 ? (
              filtered.map((result) => {
                const avg = getAverage(result.subjects);
                const grade = getGrade(avg);
                const passed = isPassed(result.subjects);
                return (
                  <div
                    key={result.id}
                    className="bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl overflow-hidden"
                  >
                    <div
                      className="flex items-center gap-4 px-5 py-4 cursor-pointer hover:bg-light-hover dark:hover:bg-dark-hover transition-colors"
                      onClick={() =>
                        setExpanded(expandedId === result.id ? null : result.id)
                      }
                    >
                      <div className="w-9 h-9 rounded-full bg-accent/10 flex items-center justify-center text-accent text-sm font-semibold shrink-0">
                        {result.studentName.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-light-text-primary dark:text-dark-text-primary">
                          {result.studentName}
                        </p>
                        <p className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary mt-0.5">
                          Class {result.class} · {result.session}
                        </p>
                      </div>

                      {/* Average */}
                      <div className="text-center">
                        <p
                          className={`text-lg font-bold ${getGradeColor(grade)}`}
                        >
                          {grade}
                        </p>
                        <p className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary">
                          {avg}%
                        </p>
                      </div>

                      {/* Pass/Fail */}
                      <span
                        className={`text-xs px-2 py-0.5 rounded-md font-medium ${
                          passed
                            ? "bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-400"
                            : "bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-400"
                        }`}
                      >
                        {passed ? "Pass" : "Fail"}
                      </span>

                      {/* Published */}
                      <span
                        className={`text-xs px-2 py-0.5 rounded-md font-medium ${
                          result.published
                            ? "bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-400"
                            : "bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-400"
                        }`}
                      >
                        {result.published ? "Published" : "Draft"}
                      </span>
                    </div>

                    {/* Expanded */}
                    {expandedId === result.id && (
                      <div className="border-t border-light-border dark:border-dark-border px-5 py-4 bg-light-bg dark:bg-dark-bg">
                        <p className="text-xs font-semibold text-light-text-tertiary dark:text-dark-text-tertiary uppercase tracking-wide mb-3">
                          Subject-wise Marks
                        </p>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-4">
                          {Object.entries(result.subjects).map(
                            ([subject, marks]) => {
                              const g = getGrade(marks);
                              return (
                                <div
                                  key={subject}
                                  className="bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-lg p-3 text-center"
                                >
                                  <p className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary mb-1">
                                    {subject}
                                  </p>
                                  <p className="text-lg font-bold text-light-text-primary dark:text-dark-text-primary">
                                    {marks}
                                  </p>
                                  <p
                                    className={`text-xs font-semibold ${getGradeColor(g)}`}
                                  >
                                    {g}
                                  </p>
                                  <div className="w-full h-1 bg-light-hover dark:bg-dark-hover rounded-full mt-2 overflow-hidden">
                                    <div
                                      className={`h-full rounded-full ${marks >= 80 ? "bg-green-500" : marks >= 60 ? "bg-blue-500" : marks >= 40 ? "bg-amber-500" : "bg-red-500"}`}
                                      style={{ width: `${marks}%` }}
                                    />
                                  </div>
                                </div>
                              );
                            },
                          )}
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handlePublish(result.id)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                              result.published
                                ? "bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 hover:bg-amber-500 hover:text-white"
                                : "bg-green-50 dark:bg-green-950 text-green-600 dark:text-green-400 hover:bg-green-500 hover:text-white"
                            }`}
                          >
                            <CheckCircle size={12} />
                            {result.published ? "Unpublish" : "Publish Result"}
                          </button>
                          <button className="flex items-center gap-1.5 px-3 py-1.5 bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border text-light-text-secondary dark:text-dark-text-secondary text-xs font-medium rounded-lg hover:bg-light-hover dark:hover:bg-dark-hover transition-colors">
                            <Printer size={12} />
                            Print Result Card
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
                  <BarChart3
                    size={22}
                    className="text-light-text-tertiary dark:text-dark-text-tertiary"
                  />
                </div>
                <p className="text-light-text-secondary dark:text-dark-text-secondary text-sm font-medium">
                  No results found
                </p>
              </div>
            )}
          </div>
        </>
      )}

      {/* Grade Boundaries Tab */}
      {activeTab === "Grade Boundaries" && (
        <div className="bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl overflow-hidden">
          <div className="grid grid-cols-4 px-4 py-3 border-b border-light-border dark:border-dark-border">
            {["Grade", "From %", "To %", "Remarks"].map((h) => (
              <span
                key={h}
                className="text-xs font-medium text-light-text-tertiary dark:text-dark-text-tertiary uppercase tracking-wide"
              >
                {h}
              </span>
            ))}
          </div>
          {mockGradeRules.map((rule) => (
            <div
              key={rule.id}
              className="grid grid-cols-4 px-4 py-3 border-b border-light-border dark:border-dark-border last:border-0 hover:bg-light-hover dark:hover:bg-dark-hover transition-colors items-center"
            >
              <span
                className={`text-lg font-bold ${getGradeColor(rule.grade)}`}
              >
                {rule.grade}
              </span>
              <span className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                {rule.from}%
              </span>
              <span className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                {rule.to}%
              </span>
              <span className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                {rule.remarks}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default GradesResults;
