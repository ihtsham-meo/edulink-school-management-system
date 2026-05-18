import { useState, useMemo } from "react";
import { Search, Plus, BookOpen, Clock, MapPin, Users } from "lucide-react";
import PageHeader from "../../components/common/PageHeader";
import StatusPill from "../../components/common/StatusPill";
import { mockExams } from "../../data/mockData";

const examStatusStyles = {
  upcoming: "bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-400",
  ongoing: "bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-400",
  completed: "bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-400",
  cancelled: "bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-400",
};

const filters = ["All", "upcoming", "ongoing", "completed"];

function ExamList() {
  const [search, setSearch] = useState("");
  const [selectedStatus, setStatus] = useState("All");
  const [expandedId, setExpanded] = useState(null);

  const filtered = useMemo(() => {
    return mockExams.filter((e) => {
      const matchSearch =
        e.subject.toLowerCase().includes(search.toLowerCase()) ||
        e.class.toLowerCase().includes(search.toLowerCase());
      const matchStatus =
        selectedStatus === "All" || e.status === selectedStatus;
      return matchSearch && matchStatus;
    });
  }, [search, selectedStatus]);

  const summary = useMemo(
    () => ({
      total: mockExams.length,
      upcoming: mockExams.filter((e) => e.status === "upcoming").length,
      ongoing: mockExams.filter((e) => e.status === "ongoing").length,
      completed: mockExams.filter((e) => e.status === "completed").length,
    }),
    [],
  );

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <PageHeader
        title="Exam Management"
        subtitle="Schedule and manage all exams"
        action={
          <button className="flex items-center gap-2 px-4 py-2 bg-accent hover:bg-accent-hover text-white text-sm font-medium rounded-lg transition-colors">
            <Plus size={16} />
            Schedule Exam
          </button>
        }
      />

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Total Exams",
            value: summary.total,
            bg: "bg-blue-50 dark:bg-blue-950",
            text: "text-blue-600 dark:text-blue-400",
          },
          {
            label: "Upcoming",
            value: summary.upcoming,
            bg: "bg-amber-50 dark:bg-amber-950",
            text: "text-amber-600 dark:text-amber-400",
          },
          {
            label: "Ongoing",
            value: summary.ongoing,
            bg: "bg-green-50 dark:bg-green-950",
            text: "text-green-600 dark:text-green-400",
          },
          {
            label: "Completed",
            value: summary.completed,
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
              placeholder="Search by subject or class..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-lg bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border text-light-text-primary dark:text-dark-text-primary placeholder:text-light-text-tertiary dark:placeholder:text-dark-text-tertiary text-sm outline-none focus:border-accent transition-colors"
            />
          </div>

          {/* Status filter */}
          <div className="flex gap-2">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setStatus(f)}
                className={`px-3 py-2 rounded-lg text-xs font-medium border transition-colors ${
                  selectedStatus === f
                    ? "bg-accent text-white border-accent"
                    : "bg-light-bg dark:bg-dark-bg border-light-border dark:border-dark-border text-light-text-secondary dark:text-dark-text-secondary hover:border-accent"
                }`}
              >
                {f === "All" ? "All" : f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Exam cards */}
      <div className="flex flex-col gap-3">
        {filtered.length > 0 ? (
          filtered.map((exam) => (
            <div
              key={exam.id}
              className="bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl overflow-hidden"
            >
              {/* Card row */}
              <div
                className="flex items-center gap-4 px-5 py-4 cursor-pointer hover:bg-light-hover dark:hover:bg-dark-hover transition-colors"
                onClick={() =>
                  setExpanded(expandedId === exam.id ? null : exam.id)
                }
              >
                {/* Date badge */}
                <div className="w-12 h-12 bg-accent/10 rounded-xl flex flex-col items-center justify-center shrink-0">
                  <span className="text-accent text-base font-semibold leading-none">
                    {exam.date.split("-")[2]}
                  </span>
                  <span className="text-accent text-xs opacity-70">May</span>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-light-text-primary dark:text-dark-text-primary">
                    {exam.subject}
                  </p>
                  <p className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary mt-0.5">
                    {exam.class}
                  </p>
                </div>

                {/* Time */}
                <div className="hidden sm:flex items-center gap-1.5 text-xs text-light-text-secondary dark:text-dark-text-secondary">
                  <Clock size={13} />
                  {exam.time}
                </div>

                {/* Room */}
                <div className="hidden sm:flex items-center gap-1.5 text-xs text-light-text-secondary dark:text-dark-text-secondary">
                  <MapPin size={13} />
                  {exam.room}
                </div>

                {/* Status */}
                <StatusPill status={exam.status} styles={examStatusStyles} />
              </div>

              {/* Expanded */}
              {expandedId === exam.id && (
                <div className="border-t border-light-border dark:border-dark-border px-5 py-4 bg-light-bg dark:bg-dark-bg">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary mb-1">
                        Subject
                      </p>
                      <p className="text-sm font-medium text-light-text-primary dark:text-dark-text-primary">
                        {exam.subject}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary mb-1">
                        Class
                      </p>
                      <p className="text-sm font-medium text-light-text-primary dark:text-dark-text-primary">
                        {exam.class}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary mb-1">
                        Date & Time
                      </p>
                      <p className="text-sm font-medium text-light-text-primary dark:text-dark-text-primary">
                        {exam.date} · {exam.time}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary mb-1">
                        Room
                      </p>
                      <p className="text-sm font-medium text-light-text-primary dark:text-dark-text-primary">
                        {exam.room}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="px-3 py-1.5 bg-accent hover:bg-accent-hover text-white text-xs font-medium rounded-lg transition-colors">
                      View Results
                    </button>
                    <button className="px-3 py-1.5 bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border text-light-text-secondary dark:text-dark-text-secondary text-xs font-medium rounded-lg hover:bg-light-hover dark:hover:bg-dark-hover transition-colors">
                      Edit Exam
                    </button>
                    <button className="px-3 py-1.5 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-xs font-medium rounded-lg transition-colors">
                      Cancel Exam
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl flex flex-col items-center justify-center py-16 gap-3">
            <div className="w-12 h-12 bg-light-hover dark:bg-dark-hover rounded-full flex items-center justify-center">
              <BookOpen
                size={22}
                className="text-light-text-tertiary dark:text-dark-text-tertiary"
              />
            </div>
            <p className="text-light-text-secondary dark:text-dark-text-secondary text-sm font-medium">
              No exams found
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

export default ExamList;
