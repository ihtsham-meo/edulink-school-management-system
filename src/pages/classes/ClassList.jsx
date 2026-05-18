import { useState, useMemo } from "react";
import {
  Plus,
  Building2,
  Users,
  Banknote,
  Pencil,
  Trash2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import PageHeader from "../../components/common/PageHeader";
import { mockClasses, mockStudents } from "../../data/mockData";

function ClassList() {
  const [expandedId, setExpanded] = useState(null);
  const [search, setSearch] = useState("");

  // Count students per class
  const studentCounts = useMemo(() => {
    return mockStudents.reduce((acc, s) => {
      const className = s.class.split("-")[0]; // e.g. "10" from "10-A"
      acc[className] = (acc[className] || 0) + 1;
      return acc;
    }, {});
  }, []);

  const filtered = useMemo(() => {
    return mockClasses.filter((c) =>
      c.name.toLowerCase().includes(search.toLowerCase()),
    );
  }, [search]);

  const summary = useMemo(
    () => ({
      totalClasses: mockClasses.length,
      totalSections: mockClasses.reduce((sum, c) => sum + c.sections.length, 0),
      totalStudents: mockStudents.length,
      avgFee: Math.round(
        mockClasses.reduce((sum, c) => sum + c.fee, 0) / mockClasses.length,
      ),
    }),
    [],
  );

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Classes & Sections"
        subtitle="Manage all classes and their sections"
        action={
          <button className="flex items-center gap-2 px-4 py-2 bg-accent hover:bg-accent-hover text-white text-sm font-medium rounded-lg transition-colors">
            <Plus size={16} />
            Add Class
          </button>
        }
      />

      {/* Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Total Classes",
            value: summary.totalClasses,
            bg: "bg-blue-50 dark:bg-blue-950",
            text: "text-blue-600 dark:text-blue-400",
          },
          {
            label: "Total Sections",
            value: summary.totalSections,
            bg: "bg-green-50 dark:bg-green-950",
            text: "text-green-600 dark:text-green-400",
          },
          {
            label: "Total Students",
            value: summary.totalStudents,
            bg: "bg-purple-50 dark:bg-purple-950",
            text: "text-purple-600 dark:text-purple-400",
          },
          {
            label: "Avg Monthly Fee",
            value: `Rs ${summary.avgFee}`,
            bg: "bg-amber-50 dark:bg-amber-950",
            text: "text-amber-600 dark:text-amber-400",
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

      {/* Search */}
      <div className="bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl p-4">
        <input
          type="text"
          placeholder="Search classes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-2 rounded-lg bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border text-light-text-primary dark:text-dark-text-primary placeholder:text-light-text-tertiary dark:placeholder:text-dark-text-tertiary text-sm outline-none focus:border-accent transition-colors"
        />
      </div>

      {/* Classes list */}
      <div className="flex flex-col gap-3">
        {filtered.map((cls) => (
          <div
            key={cls.id}
            className="bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl overflow-hidden"
          >
            {/* Class row */}
            <div
              className="flex items-center gap-4 px-5 py-4 cursor-pointer hover:bg-light-hover dark:hover:bg-dark-hover transition-colors"
              onClick={() => setExpanded(expandedId === cls.id ? null : cls.id)}
            >
              {/* Icon */}
              <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center shrink-0">
                <Building2 size={18} className="text-accent" />
              </div>

              {/* Name */}
              <div className="flex-1">
                <p className="text-sm font-semibold text-light-text-primary dark:text-dark-text-primary">
                  {cls.name}
                </p>
                <p className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary mt-0.5">
                  {cls.sections.length} section
                  {cls.sections.length > 1 ? "s" : ""}
                </p>
              </div>

              {/* Students */}
              <div className="hidden sm:flex items-center gap-1.5 text-xs text-light-text-secondary dark:text-dark-text-secondary">
                <Users size={13} />
                {cls.students} students
              </div>

              {/* Fee */}
              <div className="hidden sm:flex items-center gap-1.5 text-xs text-light-text-secondary dark:text-dark-text-secondary">
                <Banknote size={13} />
                Rs {cls.fee.toLocaleString()}/mo
              </div>

              {/* Sections pills */}
              <div className="hidden sm:flex gap-1">
                {cls.sections.map((s) => (
                  <span
                    key={s}
                    className="text-xs px-2 py-0.5 rounded-md bg-accent/10 text-accent font-medium"
                  >
                    {s}
                  </span>
                ))}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  className="w-7 h-7 flex items-center justify-center rounded-lg text-light-text-tertiary dark:text-dark-text-tertiary hover:bg-amber-50 dark:hover:bg-amber-950 hover:text-amber-600 transition-colors"
                >
                  <Pencil size={13} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  className="w-7 h-7 flex items-center justify-center rounded-lg text-light-text-tertiary dark:text-dark-text-tertiary hover:bg-red-50 dark:hover:bg-red-950 hover:text-red-600 transition-colors"
                >
                  <Trash2 size={13} />
                </button>
                {expandedId === cls.id ? (
                  <ChevronUp
                    size={15}
                    className="text-light-text-tertiary dark:text-dark-text-tertiary ml-1"
                  />
                ) : (
                  <ChevronDown
                    size={15}
                    className="text-light-text-tertiary dark:text-dark-text-tertiary ml-1"
                  />
                )}
              </div>
            </div>

            {/* Expanded sections */}
            {expandedId === cls.id && (
              <div className="border-t border-light-border dark:border-dark-border px-5 py-4 bg-light-bg dark:bg-dark-bg">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-semibold text-light-text-secondary dark:text-dark-text-secondary uppercase tracking-wide">
                    Sections
                  </p>
                  <button className="flex items-center gap-1.5 text-xs text-accent hover:underline">
                    <Plus size={12} />
                    Add Section
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {cls.sections.map((section) => (
                    <div
                      key={section}
                      className="bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-lg px-4 py-3 flex items-center justify-between"
                    >
                      <div>
                        <p className="text-sm font-medium text-light-text-primary dark:text-dark-text-primary">
                          {cls.name} — Section {section}
                        </p>
                        <p className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary mt-0.5">
                          {
                            mockStudents.filter(
                              (s) =>
                                s.class ===
                                `${cls.name.split(" ")[1]}-${section}`,
                            ).length
                          }{" "}
                          students
                        </p>
                      </div>
                      <div className="flex gap-1">
                        <button className="w-6 h-6 flex items-center justify-center rounded-md text-light-text-tertiary dark:text-dark-text-tertiary hover:bg-amber-50 dark:hover:bg-amber-950 hover:text-amber-600 transition-colors">
                          <Pencil size={12} />
                        </button>
                        <button className="w-6 h-6 flex items-center justify-center rounded-md text-light-text-tertiary dark:text-dark-text-tertiary hover:bg-red-50 dark:hover:bg-red-950 hover:text-red-600 transition-colors">
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Class details */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4 pt-4 border-t border-light-border dark:border-dark-border">
                  <div>
                    <p className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary mb-1">
                      Monthly Fee
                    </p>
                    <p className="text-sm font-medium text-light-text-primary dark:text-dark-text-primary">
                      Rs {cls.fee.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary mb-1">
                      Total Students
                    </p>
                    <p className="text-sm font-medium text-light-text-primary dark:text-dark-text-primary">
                      {cls.students}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary mb-1">
                      Total Sections
                    </p>
                    <p className="text-sm font-medium text-light-text-primary dark:text-dark-text-primary">
                      {cls.sections.length}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Empty state */}
        {filtered.length === 0 && (
          <div className="bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl flex flex-col items-center justify-center py-16 gap-3">
            <div className="w-12 h-12 bg-light-hover dark:bg-dark-hover rounded-full flex items-center justify-center">
              <Building2
                size={22}
                className="text-light-text-tertiary dark:text-dark-text-tertiary"
              />
            </div>
            <p className="text-light-text-secondary dark:text-dark-text-secondary text-sm font-medium">
              No classes found
            </p>
            <p className="text-light-text-tertiary dark:text-dark-text-tertiary text-xs">
              Try adjusting your search
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ClassList;
