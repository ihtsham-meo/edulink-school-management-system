import { useState, useMemo } from "react";
import { Search, Users, Eye, MessageCircle } from "lucide-react";
import PageHeader from "../../components/common/PageHeader";
import StatusPill from "../../components/common/StatusPill";
import { mockStudents, attendanceStatusStyles } from "../../data/mockData";

const sections = ["All Sections", "9-A", "10-A", "10-B", "11-A", "8-C"];

function TeacherStudents() {
  const [search, setSearch] = useState("");
  const [selectedSection, setSection] = useState("All Sections");

  const filtered = useMemo(() => {
    return mockStudents.filter((s) => {
      const matchSearch =
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.rollNo.toLowerCase().includes(search.toLowerCase());
      const matchSection =
        selectedSection === "All Sections" || s.class === selectedSection;
      return matchSearch && matchSection;
    });
  }, [search, selectedSection]);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="My Students"
        subtitle={`${filtered.length} students in your classes`}
      />

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        {[
          {
            label: "Total Students",
            value: mockStudents.length,
            bg: "bg-blue-50 dark:bg-blue-950",
            text: "text-blue-600 dark:text-blue-400",
          },
          {
            label: "Active",
            value: mockStudents.filter((s) => s.status === "active").length,
            bg: "bg-green-50 dark:bg-green-950",
            text: "text-green-600 dark:text-green-400",
          },
          {
            label: "My Sections",
            value: 4,
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
              placeholder="Search by name or roll number..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-lg bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border text-light-text-primary dark:text-dark-text-primary placeholder:text-light-text-tertiary dark:placeholder:text-dark-text-tertiary text-sm outline-none focus:border-accent transition-colors"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {sections.map((s) => (
              <button
                key={s}
                onClick={() => setSection(s)}
                className={`px-3 py-2 rounded-lg text-xs font-medium border transition-colors ${
                  selectedSection === s
                    ? "bg-accent text-white border-accent"
                    : "bg-light-bg dark:bg-dark-bg border-light-border dark:border-dark-border text-light-text-secondary dark:text-dark-text-secondary hover:border-accent"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl overflow-hidden">
        <div className="grid grid-cols-5 px-4 py-3 border-b border-light-border dark:border-dark-border">
          {["Student", "Roll No", "Class", "Phone", "Actions"].map((h) => (
            <span
              key={h}
              className="text-xs font-medium text-light-text-tertiary dark:text-dark-text-tertiary uppercase tracking-wide"
            >
              {h}
            </span>
          ))}
        </div>
        {filtered.length > 0 ? (
          filtered.map((student) => (
            <div
              key={student.id}
              className="grid grid-cols-5 px-4 py-3 border-b border-light-border dark:border-dark-border last:border-0 hover:bg-light-hover dark:hover:bg-dark-hover transition-colors items-center"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-accent text-xs font-medium shrink-0">
                  {student.name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-medium text-light-text-primary dark:text-dark-text-primary">
                    {student.name}
                  </p>
                  <p className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary">
                    {student.gender}
                  </p>
                </div>
              </div>
              <span className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                {student.rollNo}
              </span>
              <span className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                {student.class}
              </span>
              <span className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                {student.phone}
              </span>
              <div className="flex items-center gap-1">
                <button className="w-7 h-7 flex items-center justify-center rounded-lg text-light-text-tertiary dark:text-dark-text-tertiary hover:bg-blue-50 dark:hover:bg-blue-950 hover:text-blue-600 transition-colors">
                  <Eye size={14} />
                </button>
                <button className="w-7 h-7 flex items-center justify-center rounded-lg text-light-text-tertiary dark:text-dark-text-tertiary hover:bg-green-50 dark:hover:bg-green-950 hover:text-green-600 transition-colors">
                  <MessageCircle size={14} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <div className="w-12 h-12 bg-light-hover dark:bg-dark-hover rounded-full flex items-center justify-center">
              <Users
                size={22}
                className="text-light-text-tertiary dark:text-dark-text-tertiary"
              />
            </div>
            <p className="text-light-text-secondary dark:text-dark-text-secondary text-sm font-medium">
              No students found
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default TeacherStudents;
