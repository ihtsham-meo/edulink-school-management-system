import { useMemo, useState } from "react";
import {
  BarChart3,
  BookOpen,
  ChevronDown,
  ChevronUp,
  Clock,
  ClipboardCheck,
  Plus,
  Search,
  Users,
} from "lucide-react";
import PageHeader from "../../components/common/PageHeader";
import StatusPill from "../../components/common/StatusPill";
import { mockTestResults, mockTests } from "../../data/mockData";

const testStatusStyles = {
  draft: "bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-400",
  scheduled: "bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-400",
  active: "bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-400",
  checked: "bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-400",
};

const filters = ["All", "draft", "scheduled", "active", "checked"];

function TestList() {
  const [search, setSearch] = useState("");
  const [selectedStatus, setStatus] = useState("All");
  const [expandedId, setExpanded] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    title: "",
    subject: "",
    class: "9-A",
    type: "written",
    maxMarks: 50,
    date: "",
    duration: "45 min",
  });

  const filtered = useMemo(() => {
    return mockTests.filter((test) => {
      const query = search.toLowerCase();
      const matchesSearch =
        test.title.toLowerCase().includes(query) ||
        test.subject.toLowerCase().includes(query) ||
        test.class.toLowerCase().includes(query);
      const matchesStatus =
        selectedStatus === "All" || test.status === selectedStatus;

      return matchesSearch && matchesStatus;
    });
  }, [search, selectedStatus]);

  const summary = useMemo(
    () => ({
      total: mockTests.length,
      scheduled: mockTests.filter((test) => test.status === "scheduled")
        .length,
      active: mockTests.filter((test) => test.status === "active").length,
      checked: mockTests.filter((test) => test.status === "checked").length,
    }),
    [],
  );

  const getTestResults = (testId) =>
    mockTestResults.filter((result) => result.testId === testId);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Test Management"
        subtitle="Create, schedule, and review class tests"
        action={
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-accent hover:bg-accent-hover text-white text-sm font-medium rounded-lg transition-colors"
          >
            <Plus size={16} />
            Create Test
          </button>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Total Tests",
            value: summary.total,
            bg: "bg-blue-50 dark:bg-blue-950",
            text: "text-blue-600 dark:text-blue-400",
          },
          {
            label: "Scheduled",
            value: summary.scheduled,
            bg: "bg-amber-50 dark:bg-amber-950",
            text: "text-amber-600 dark:text-amber-400",
          },
          {
            label: "Active",
            value: summary.active,
            bg: "bg-green-50 dark:bg-green-950",
            text: "text-green-600 dark:text-green-400",
          },
          {
            label: "Checked",
            value: summary.checked,
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

      <div className="bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl p-4">
        <div className="flex flex-col lg:flex-row gap-3">
          <div className="relative flex-1">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-light-text-tertiary dark:text-dark-text-tertiary"
            />
            <input
              type="text"
              placeholder="Search by title, subject, or class..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-lg bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border text-light-text-primary dark:text-dark-text-primary placeholder:text-light-text-tertiary dark:placeholder:text-dark-text-tertiary text-sm outline-none focus:border-accent transition-colors"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setStatus(filter)}
                className={`px-3 py-2 rounded-lg text-xs font-medium border whitespace-nowrap transition-colors ${
                  selectedStatus === filter
                    ? "bg-accent text-white border-accent"
                    : "bg-light-bg dark:bg-dark-bg border-light-border dark:border-dark-border text-light-text-secondary dark:text-dark-text-secondary hover:border-accent"
                }`}
              >
                {filter === "All"
                  ? "All"
                  : filter.charAt(0).toUpperCase() + filter.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {filtered.length > 0 ? (
          filtered.map((test) => {
            const results = getTestResults(test.id);

            return (
              <div
                key={test.id}
                className="bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl overflow-hidden"
              >
                <div
                  className="flex items-center gap-4 px-5 py-4 cursor-pointer hover:bg-light-hover dark:hover:bg-dark-hover transition-colors"
                  onClick={() =>
                    setExpanded(expandedId === test.id ? null : test.id)
                  }
                >
                  <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center shrink-0">
                    <ClipboardCheck size={18} className="text-accent" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-light-text-primary dark:text-dark-text-primary">
                      {test.title}
                    </p>
                    <p className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary mt-0.5">
                      {test.subject} - Class {test.class} - {test.type}
                    </p>
                  </div>

                  <div className="hidden md:flex items-center gap-1.5 text-xs text-light-text-secondary dark:text-dark-text-secondary">
                    <BookOpen size={13} />
                    {test.maxMarks} marks
                  </div>
                  <div className="hidden md:flex items-center gap-1.5 text-xs text-light-text-secondary dark:text-dark-text-secondary">
                    <Clock size={13} />
                    {test.date}
                  </div>
                  <StatusPill status={test.status} styles={testStatusStyles} />
                  {expandedId === test.id ? (
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

                {expandedId === test.id && (
                  <div className="border-t border-light-border dark:border-dark-border px-5 py-4 bg-light-bg dark:bg-dark-bg">
                    <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
                      {[
                        ["Subject", test.subject],
                        ["Class", `${test.class} / Section ${test.section}`],
                        ["Teacher", test.teacher],
                        ["Duration", test.duration],
                        ["Max Marks", test.maxMarks],
                      ].map(([label, value]) => (
                        <div key={label}>
                          <p className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary mb-1">
                            {label}
                          </p>
                          <p className="text-sm font-medium text-light-text-primary dark:text-dark-text-primary">
                            {value}
                          </p>
                        </div>
                      ))}
                    </div>

                    {results.length > 0 ? (
                      <div className="mb-4">
                        <p className="text-xs font-semibold text-light-text-tertiary dark:text-dark-text-tertiary uppercase tracking-wide mb-3 flex items-center gap-2">
                          <BarChart3 size={12} />
                          Results
                        </p>
                        <div className="flex flex-col gap-2">
                          {results.map((result) => (
                            <div
                              key={result.id}
                              className="flex items-center gap-3"
                            >
                              <div className="w-7 h-7 rounded-full bg-accent/10 flex items-center justify-center text-accent text-xs font-medium shrink-0">
                                {result.studentName.charAt(0)}
                              </div>
                              <span className="text-sm text-light-text-primary dark:text-dark-text-primary flex-1">
                                {result.studentName}
                              </span>
                              <span className="text-xs text-light-text-secondary dark:text-dark-text-secondary">
                                {result.marks}/{result.total}
                              </span>
                              <div className="w-24 h-1.5 bg-light-card dark:bg-dark-card rounded-full overflow-hidden">
                                <div
                                  className={`h-full rounded-full ${
                                    result.percentage >= 80
                                      ? "bg-green-500"
                                      : result.percentage >= 50
                                        ? "bg-amber-500"
                                        : "bg-red-500"
                                  }`}
                                  style={{ width: `${result.percentage}%` }}
                                />
                              </div>
                              <span className="text-xs font-semibold text-light-text-secondary dark:text-dark-text-secondary w-8 text-right">
                                {result.grade}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-light-text-tertiary dark:text-dark-text-tertiary mb-4">
                        No marks have been entered for this test yet.
                      </p>
                    )}

                    <div className="flex flex-wrap gap-2">
                      <button className="px-3 py-1.5 bg-accent hover:bg-accent-hover text-white text-xs font-medium rounded-lg transition-colors">
                        Enter Marks
                      </button>
                      <button className="px-3 py-1.5 bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border text-light-text-secondary dark:text-dark-text-secondary text-xs font-medium rounded-lg hover:bg-light-hover dark:hover:bg-dark-hover transition-colors">
                        Edit Test
                      </button>
                      <button className="px-3 py-1.5 bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border text-light-text-secondary dark:text-dark-text-secondary text-xs font-medium rounded-lg hover:bg-light-hover dark:hover:bg-dark-hover transition-colors">
                        <Users size={12} className="inline mr-1" />
                        Assigned Students
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
              <ClipboardCheck
                size={22}
                className="text-light-text-tertiary dark:text-dark-text-tertiary"
              />
            </div>
            <p className="text-light-text-secondary dark:text-dark-text-secondary text-sm font-medium">
              No tests found
            </p>
            <p className="text-light-text-tertiary dark:text-dark-text-tertiary text-xs">
              Try adjusting your search or filters
            </p>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl p-6 w-full max-w-lg">
            <h2 className="text-base font-semibold text-light-text-primary dark:text-dark-text-primary mb-5">
              Create New Test
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                {
                  label: "Test Title",
                  key: "title",
                  type: "text",
                  placeholder: "e.g. Algebra Unit Test",
                },
                {
                  label: "Subject",
                  key: "subject",
                  type: "text",
                  placeholder: "e.g. Mathematics",
                },
                {
                  label: "Max Marks",
                  key: "maxMarks",
                  type: "number",
                  placeholder: "50",
                },
                {
                  label: "Date",
                  key: "date",
                  type: "date",
                  placeholder: "",
                },
                {
                  label: "Duration",
                  key: "duration",
                  type: "text",
                  placeholder: "45 min",
                },
              ].map((field) => (
                <div key={field.key} className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-light-text-primary dark:text-dark-text-primary">
                    {field.label}
                  </label>
                  <input
                    type={field.type}
                    value={form[field.key]}
                    onChange={(event) =>
                      setForm((prev) => ({
                        ...prev,
                        [field.key]: event.target.value,
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
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, class: event.target.value }))
                  }
                  className="w-full px-4 py-2.5 rounded-lg bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border text-light-text-primary dark:text-dark-text-primary text-sm outline-none focus:border-accent transition-colors"
                >
                  {["8-C", "9-A", "10-B", "11-A"].map((className) => (
                    <option key={className} value={className}>
                      {className}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-light-text-primary dark:text-dark-text-primary">
                  Test Type
                </label>
                <select
                  value={form.type}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, type: event.target.value }))
                  }
                  className="w-full px-4 py-2.5 rounded-lg bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border text-light-text-primary dark:text-dark-text-primary text-sm outline-none focus:border-accent transition-colors"
                >
                  {["written", "oral", "practical", "lab"].map((type) => (
                    <option key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
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
                Create Test
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

export default TestList;
