import { useState, useMemo } from "react";
import { Search, Trophy, Star, Award, TrendingUp, Medal } from "lucide-react";
import PageHeader from "../../components/common/PageHeader";
import { mockStudentPoints, mockBadges } from "../../data/mockData";

const tabs = ["Leaderboard", "Badges", "Points Log"];

const levelConfig = {
  Gold: {
    bg: "bg-amber-50 dark:bg-amber-950",
    text: "text-amber-600 dark:text-amber-400",
    border: "border-amber-200 dark:border-amber-800",
    icon: "🥇",
  },
  Silver: {
    bg: "bg-gray-50 dark:bg-gray-900",
    text: "text-gray-600 dark:text-gray-400",
    border: "border-gray-200 dark:border-gray-700",
    icon: "🥈",
  },
  Bronze: {
    bg: "bg-orange-50 dark:bg-orange-950",
    text: "text-orange-600 dark:text-orange-400",
    border: "border-orange-200 dark:border-orange-800",
    icon: "🥉",
  },
};

const mockPointsLog = [
  {
    id: 1,
    studentName: "Ali Hassan",
    activity: "Assignment Submitted on time",
    points: +20,
    date: "2026-05-14",
  },
  {
    id: 2,
    studentName: "Ayesha Mir",
    activity: "Quiz Score 100%",
    points: +50,
    date: "2026-05-14",
  },
  {
    id: 3,
    studentName: "Sara Khan",
    activity: "Perfect Attendance — May",
    points: +30,
    date: "2026-05-13",
  },
  {
    id: 4,
    studentName: "Usman Raza",
    activity: "Disruptive Behavior",
    points: -10,
    date: "2026-05-13",
  },
  {
    id: 5,
    studentName: "Hina Malik",
    activity: "Assignment Submitted on time",
    points: +20,
    date: "2026-05-12",
  },
  {
    id: 6,
    studentName: "Bilal Ahmed",
    activity: "Late Submission",
    points: -5,
    date: "2026-05-12",
  },
];

function Gamification() {
  const [activeTab, setTab] = useState("Leaderboard");
  const [search, setSearch] = useState("");
  const [selectedLevel, setLevel] = useState("All");

  const filtered = useMemo(() => {
    return mockStudentPoints.filter((s) => {
      const matchSearch =
        s.studentName.toLowerCase().includes(search.toLowerCase()) ||
        s.class.toLowerCase().includes(search.toLowerCase());
      const matchLevel = selectedLevel === "All" || s.level === selectedLevel;
      return matchSearch && matchLevel;
    });
  }, [search, selectedLevel]);

  const filteredLog = useMemo(() => {
    return mockPointsLog.filter((l) =>
      l.studentName.toLowerCase().includes(search.toLowerCase()),
    );
  }, [search]);

  const summary = useMemo(
    () => ({
      total: mockStudentPoints.length,
      gold: mockStudentPoints.filter((s) => s.level === "Gold").length,
      silver: mockStudentPoints.filter((s) => s.level === "Silver").length,
      bronze: mockStudentPoints.filter((s) => s.level === "Bronze").length,
    }),
    [],
  );

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Gamification"
        subtitle="Student points, badges and leaderboard"
      />

      {/* Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Total Students",
            value: summary.total,
            bg: "bg-blue-50 dark:bg-blue-950",
            text: "text-blue-600 dark:text-blue-400",
          },
          {
            label: "🥇 Gold",
            value: summary.gold,
            bg: "bg-amber-50 dark:bg-amber-950",
            text: "text-amber-600 dark:text-amber-400",
          },
          {
            label: "🥈 Silver",
            value: summary.silver,
            bg: "bg-gray-50 dark:bg-gray-900",
            text: "text-gray-600 dark:text-gray-400",
          },
          {
            label: "🥉 Bronze",
            value: summary.bronze,
            bg: "bg-orange-50 dark:bg-orange-950",
            text: "text-orange-600 dark:text-orange-400",
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
            onClick={() => {
              setTab(tab);
              setSearch("");
            }}
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

      {/* Search + Level filter */}
      {activeTab !== "Badges" && (
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
            {activeTab === "Leaderboard" && (
              <div className="flex gap-2">
                {["All", "Gold", "Silver", "Bronze"].map((l) => (
                  <button
                    key={l}
                    onClick={() => setLevel(l)}
                    className={`px-3 py-2 rounded-lg text-xs font-medium border transition-colors ${
                      selectedLevel === l
                        ? "bg-accent text-white border-accent"
                        : "bg-light-bg dark:bg-dark-bg border-light-border dark:border-dark-border text-light-text-secondary dark:text-dark-text-secondary hover:border-accent"
                    }`}
                  >
                    {l}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Leaderboard Tab */}
      {activeTab === "Leaderboard" && (
        <div className="flex flex-col gap-3">
          {/* Top 3 podium */}
          <div className="grid grid-cols-3 gap-4 mb-2">
            {mockStudentPoints.slice(0, 3).map((student, i) => {
              const config = levelConfig[student.level];
              const sizes = ["order-2 scale-110", "order-1", "order-3"];
              const heights = ["pt-0", "pt-4", "pt-6"];
              return (
                <div
                  key={student.id}
                  className={`${sizes[i]} ${heights[i]} flex flex-col items-center`}
                >
                  <div className="text-3xl mb-1">{config.icon}</div>
                  <div
                    className={`w-full ${config.bg} border ${config.border} rounded-xl p-4 text-center`}
                  >
                    <div
                      className={`w-12 h-12 rounded-full bg-accent flex items-center justify-center text-white text-lg font-bold mx-auto mb-2`}
                    >
                      {student.studentName.charAt(0)}
                    </div>
                    <p className={`text-sm font-semibold ${config.text}`}>
                      {student.studentName}
                    </p>
                    <p className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary">
                      {student.class}
                    </p>
                    <p className={`text-xl font-bold ${config.text} mt-1`}>
                      {student.points}
                    </p>
                    <p className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary">
                      points
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Full leaderboard */}
          <div className="bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl overflow-hidden">
            <div className="grid grid-cols-5 px-4 py-3 border-b border-light-border dark:border-dark-border">
              {["Rank", "Student", "Class", "Points", "Level"].map((h) => (
                <span
                  key={h}
                  className="text-xs font-medium text-light-text-tertiary dark:text-dark-text-tertiary uppercase tracking-wide"
                >
                  {h}
                </span>
              ))}
            </div>
            {filtered.map((student) => {
              const config = levelConfig[student.level];
              return (
                <div
                  key={student.id}
                  className="grid grid-cols-5 px-4 py-3 border-b border-light-border dark:border-dark-border last:border-0 hover:bg-light-hover dark:hover:bg-dark-hover transition-colors items-center"
                >
                  <span className="text-lg font-bold text-light-text-tertiary dark:text-dark-text-tertiary">
                    #{student.rank}
                  </span>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-accent text-xs font-medium flex-shrink-0">
                      {student.studentName.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-light-text-primary dark:text-dark-text-primary truncate">
                        {student.studentName}
                      </p>
                      <div className="flex gap-1 mt-0.5 flex-wrap">
                        {student.badges.slice(0, 2).map((b) => {
                          const badge = mockBadges.find((bd) => bd.name === b);
                          return badge ? (
                            <span key={b} className="text-xs">
                              {badge.icon}
                            </span>
                          ) : null;
                        })}
                      </div>
                    </div>
                  </div>
                  <span className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                    {student.class}
                  </span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-1.5 bg-light-hover dark:bg-dark-hover rounded-full overflow-hidden">
                      <div
                        className="h-full bg-accent rounded-full"
                        style={{ width: `${(student.points / 1000) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-semibold text-light-text-primary dark:text-dark-text-primary">
                      {student.points}
                    </span>
                  </div>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-md font-medium w-fit border ${config.bg} ${config.text} ${config.border}`}
                  >
                    {config.icon} {student.level}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Badges Tab */}
      {activeTab === "Badges" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {mockBadges.map((badge) => (
            <div
              key={badge.id}
              className={`${badge.color} border rounded-xl p-5`}
            >
              <div className="flex items-start gap-4">
                <div className="text-4xl">{badge.icon}</div>
                <div className="flex-1">
                  <p className="text-sm font-semibold">{badge.name}</p>
                  <p className="text-xs opacity-75 mt-1">{badge.description}</p>
                  <p className="text-xs font-medium mt-2 opacity-75">
                    Earned by {badge.earned} students
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Points Log Tab */}
      {activeTab === "Points Log" && (
        <div className="bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl overflow-hidden">
          <div className="grid grid-cols-4 px-4 py-3 border-b border-light-border dark:border-dark-border">
            {["Student", "Activity", "Points", "Date"].map((h) => (
              <span
                key={h}
                className="text-xs font-medium text-light-text-tertiary dark:text-dark-text-tertiary uppercase tracking-wide"
              >
                {h}
              </span>
            ))}
          </div>
          {filteredLog.map((log) => (
            <div
              key={log.id}
              className="grid grid-cols-4 px-4 py-3 border-b border-light-border dark:border-dark-border last:border-0 hover:bg-light-hover dark:hover:bg-dark-hover transition-colors items-center"
            >
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-accent/10 flex items-center justify-center text-accent text-xs font-medium flex-shrink-0">
                  {log.studentName.charAt(0)}
                </div>
                <span className="text-sm font-medium text-light-text-primary dark:text-dark-text-primary truncate">
                  {log.studentName}
                </span>
              </div>
              <span className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                {log.activity}
              </span>
              <span
                className={`text-sm font-bold ${log.points > 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}
              >
                {log.points > 0 ? `+${log.points}` : log.points}
              </span>
              <span className="text-xs text-light-text-secondary dark:text-dark-text-secondary">
                {log.date}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Gamification;
