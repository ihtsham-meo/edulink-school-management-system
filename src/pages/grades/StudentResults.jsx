import { useMemo } from "react";
import { BarChart3, Award, TrendingUp, Star } from "lucide-react";
import PageHeader from "../../components/common/PageHeader";
import { mockResults, mockGradeRules } from "../../data/mockData";

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

function StudentResults() {
  // Simulate student = Ali Hassan (id: 1)
  const myResult = mockResults.find((r) => r.studentName === "Ali Hassan");

  const stats = useMemo(() => {
    if (!myResult) return null;
    const marks = Object.values(myResult.subjects);
    const avg = Math.round(marks.reduce((a, b) => a + b, 0) / marks.length);
    const highest = Math.max(...marks);
    const lowest = Math.min(...marks);
    const passed = marks.every((m) => m >= 40);
    return { avg, highest, lowest, passed, grade: getGrade(avg) };
  }, [myResult]);

  if (!myResult)
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-light-text-secondary dark:text-dark-text-secondary">
          No results published yet.
        </p>
      </div>
    );

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="My Results"
        subtitle="View your academic performance"
      />

      {/* Overall stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Average",
            value: `${stats.avg}%`,
            bg: "bg-blue-50 dark:bg-blue-950",
            text: "text-blue-600 dark:text-blue-400",
          },
          {
            label: "Grade",
            value: stats.grade,
            bg: "bg-purple-50 dark:bg-purple-950",
            text: "text-purple-600 dark:text-purple-400",
          },
          {
            label: "Highest",
            value: `${stats.highest}%`,
            bg: "bg-green-50 dark:bg-green-950",
            text: "text-green-600 dark:text-green-400",
          },
          {
            label: "Result",
            value: stats.passed ? "Pass" : "Fail",
            bg: stats.passed
              ? "bg-green-50 dark:bg-green-950"
              : "bg-red-50 dark:bg-red-950",
            text: stats.passed
              ? "text-green-600 dark:text-green-400"
              : "text-red-600 dark:text-red-400",
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

      {/* Result card */}
      <div className="bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-base font-semibold text-light-text-primary dark:text-dark-text-primary">
              Result Card
            </h2>
            <p className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary mt-0.5">
              Session: {myResult.session} · Class: {myResult.class}
            </p>
          </div>
          <span className={`text-3xl font-bold ${getGradeColor(stats.grade)}`}>
            {stats.grade}
          </span>
        </div>

        {/* Subject marks */}
        <div className="flex flex-col gap-3">
          {Object.entries(myResult.subjects).map(([subject, marks]) => {
            const grade = getGrade(marks);
            return (
              <div key={subject} className="flex items-center gap-4">
                <span className="text-sm text-light-text-secondary dark:text-dark-text-secondary w-24 flex-shrink-0">
                  {subject}
                </span>
                <div className="flex-1 h-2 bg-light-hover dark:bg-dark-hover rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      marks >= 80
                        ? "bg-green-500"
                        : marks >= 60
                          ? "bg-blue-500"
                          : marks >= 40
                            ? "bg-amber-500"
                            : "bg-red-500"
                    }`}
                    style={{ width: `${marks}%` }}
                  />
                </div>
                <span className="text-sm font-semibold text-light-text-primary dark:text-dark-text-primary w-10 text-right">
                  {marks}
                </span>
                <span
                  className={`text-sm font-bold w-8 text-right ${getGradeColor(grade)}`}
                >
                  {grade}
                </span>
                <span
                  className={`text-xs px-2 py-0.5 rounded-md font-medium w-12 text-center ${
                    marks >= 40
                      ? "bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-400"
                      : "bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-400"
                  }`}
                >
                  {marks >= 40 ? "Pass" : "Fail"}
                </span>
              </div>
            );
          })}
        </div>

        {/* Total row */}
        <div className="flex items-center gap-4 mt-4 pt-4 border-t border-light-border dark:border-dark-border">
          <span className="text-sm font-semibold text-light-text-primary dark:text-dark-text-primary w-24">
            Average
          </span>
          <div className="flex-1 h-2 bg-light-hover dark:bg-dark-hover rounded-full overflow-hidden">
            <div
              className="h-full bg-accent rounded-full"
              style={{ width: `${stats.avg}%` }}
            />
          </div>
          <span className="text-sm font-bold text-accent w-10 text-right">
            {stats.avg}
          </span>
          <span
            className={`text-sm font-bold w-8 text-right ${getGradeColor(stats.grade)}`}
          >
            {stats.grade}
          </span>
          <span
            className={`text-xs px-2 py-0.5 rounded-md font-medium w-12 text-center ${
              stats.passed
                ? "bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-400"
                : "bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-400"
            }`}
          >
            {stats.passed ? "Pass" : "Fail"}
          </span>
        </div>
      </div>
    </div>
  );
}

export default StudentResults;
