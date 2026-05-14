import { useState, useMemo } from "react";
import {
  Search,
  Plus,
  Filter,
  Eye,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Users,
} from "lucide-react";
import PageHeader from "../../components/common/PageHeader";
import StatusPill from "../../components/common/StatusPill";
import { mockStudents, feeStatusStyles } from "../../data/mockData";

const statusStyles = {
  active: "bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-400",
  inactive: "bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-400",
};

const classes = ["All Classes", "7-A", "8-C", "9-B", "10-A", "11-A"];
const statuses = ["All", "active", "inactive"];

function StudentList() {
  const [search, setSearch] = useState("");
  const [selectedClass, setClass] = useState("All Classes");
  const [selectedStatus, setStatus] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 10;

  // ── Filtered students ──
  const filtered = useMemo(() => {
    return mockStudents.filter((s) => {
      const matchSearch =
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.rollNo.toLowerCase().includes(search.toLowerCase());
      const matchClass =
        selectedClass === "All Classes" || s.class === selectedClass;
      const matchStatus =
        selectedStatus === "All" || s.status === selectedStatus;
      return matchSearch && matchClass && matchStatus;
    });
  }, [search, selectedClass, selectedStatus]);

  // ── Pagination ──
  const totalPages = Math.ceil(filtered.length / perPage);
  const paginatedStudents = useMemo(() => {
    const startIdx = (currentPage - 1) * perPage;
    return filtered.slice(startIdx, startIdx + perPage);
  }, [filtered, currentPage, perPage]);

  // Reset to page 1 when filters change
  useMemo(() => {
    setCurrentPage(1);
  }, [search, selectedClass, selectedStatus]);

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <PageHeader
        title="Students"
        subtitle={`${filtered.length} students found`}
        action={
          <button className="flex items-center gap-2 px-4 py-2 bg-accent hover:bg-accent-hover text-white text-sm font-medium rounded-lg transition-colors">
            <Plus size={16} />
            Add Student
          </button>
        }
      />

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
              placeholder="Search by name or roll number..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-lg bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border text-light-text-primary dark:text-dark-text-primary placeholder:text-light-text-tertiary dark:placeholder:text-dark-text-tertiary text-sm outline-none focus:border-accent transition-colors"
            />
          </div>

          {/* Class filter */}
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

          {/* Status filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setStatus(e.target.value)}
            className="px-3 py-2 rounded-lg bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border text-light-text-primary dark:text-dark-text-primary text-sm outline-none focus:border-accent transition-colors"
          >
            {statuses.map((s) => (
              <option key={s} value={s}>
                {s === "All"
                  ? "All Status"
                  : s.charAt(0).toUpperCase() + s.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl overflow-hidden">
        {/* Table header */}
        <div className="grid grid-cols-6 px-4 py-3 border-b border-light-border dark:border-dark-border">
          {["Roll No", "Name", "Class", "Phone", "Fee Status", "Actions"].map(
            (h) => (
              <span
                key={h}
                className="text-xs font-medium text-light-text-tertiary dark:text-dark-text-tertiary uppercase tracking-wide"
              >
                {h}
              </span>
            ),
          )}
        </div>

        {/* Table rows */}
        {paginatedStudents.length > 0 ? (
          paginatedStudents.map((student) => (
            <div
              key={student.id}
              className="grid grid-cols-6 px-4 py-3 border-b border-light-border dark:border-dark-border last:border-0 hover:bg-light-hover dark:hover:bg-dark-hover transition-colors items-center"
            >
              {/* Roll No */}
              <span className="text-sm text-light-text-tertiary dark:text-dark-text-tertiary">
                {student.rollNo}
              </span>

              {/* Student name + avatar */}
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-accent text-xs font-medium flex-shrink-0">
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

              {/* Class */}
              <span className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                {student.class}
              </span>

              {/* Phone */}
              <span className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                {student.phone}
              </span>

              {/* Fee Status */}
              <StatusPill status={student.fee} styles={feeStatusStyles} />

              {/* Actions */}
              <div className="flex items-center gap-1">
                <button className="w-7 h-7 flex items-center justify-center rounded-lg text-light-text-tertiary dark:text-dark-text-tertiary hover:bg-blue-50 dark:hover:bg-blue-950 hover:text-blue-600 transition-colors">
                  <Eye size={14} />
                </button>
                <button className="w-7 h-7 flex items-center justify-center rounded-lg text-light-text-tertiary dark:text-dark-text-tertiary hover:bg-amber-50 dark:hover:bg-amber-950 hover:text-amber-600 transition-colors">
                  <Pencil size={14} />
                </button>
                <button className="w-7 h-7 flex items-center justify-center rounded-lg text-light-text-tertiary dark:text-dark-text-tertiary hover:bg-red-50 dark:hover:bg-red-950 hover:text-red-600 transition-colors">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))
        ) : (
          // Empty state
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
            <p className="text-light-text-tertiary dark:text-dark-text-tertiary text-xs">
              Try adjusting your search or filters
            </p>
          </div>
        )}

        {/* Pagination Footer */}
        {filtered.length > 0 && (
          <div className="flex items-center justify-between px-5 py-3.5 border-t border-light-border dark:border-dark-border">
            <p className="text-light-text-tertiary dark:text-dark-text-tertiary text-xs">
              Showing{" "}
              {Math.min((currentPage - 1) * perPage + 1, filtered.length)}–
              {Math.min(currentPage * perPage, filtered.length)} of{" "}
              {filtered.length} students
            </p>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="w-7 h-7 rounded-lg bg-light-hover dark:bg-dark-hover hover:bg-light-border dark:hover:bg-dark-border border border-light-border dark:border-dark-border flex items-center justify-center text-light-text-tertiary dark:text-dark-text-tertiary hover:text-light-text-primary dark:hover:text-dark-text-primary disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                <ChevronLeft size={13} />
              </button>
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-7 h-7 rounded-lg border text-xs font-medium transition-all
                    ${
                      currentPage === i + 1
                        ? "bg-accent border-accent text-white"
                        : "bg-light-hover dark:bg-dark-hover border-light-border dark:border-dark-border text-light-text-tertiary dark:text-dark-text-tertiary hover:bg-light-border dark:hover:bg-dark-border hover:text-light-text-primary dark:hover:text-dark-text-primary"
                    }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
                className="w-7 h-7 rounded-lg bg-light-hover dark:bg-dark-hover hover:bg-light-border dark:hover:bg-dark-border border border-light-border dark:border-dark-border flex items-center justify-center text-light-text-tertiary dark:text-dark-text-tertiary hover:text-light-text-primary dark:hover:text-dark-text-primary disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                <ChevronRight size={13} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default StudentList;
