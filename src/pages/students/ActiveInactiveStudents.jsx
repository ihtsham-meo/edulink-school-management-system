import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import PageHeader from "../../components/common/PageHeader";
import StatusPill from "../../components/common/StatusPill";
import { studentService } from "../../services/studentService";
import { normalizeStudents } from "./studentUtils";

const statusStyles = {
  active: "bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-400",
  inactive: "bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-400",
  suspended: "bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400",
};

function ActiveInactiveStudents() {
  const [students, setStudents] = useState([]);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("All");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const loadStudents = async () => {
      const response = await studentService.getAll();
      setStudents(normalizeStudents(response.data));
    };

    loadStudents();
  }, []);

  const filtered = useMemo(() => {
    const text = query.toLowerCase();
    return students.filter((student) => {
      const matchesQuery =
        student.name.toLowerCase().includes(text) ||
        student.rollNo.toLowerCase().includes(text) ||
        student.class.toLowerCase().includes(text);
      const matchesStatus = status === "All" || student.status === status;
      return matchesQuery && matchesStatus;
    });
  }, [students, query, status]);

  const updateStatus = async (student, nextStatus) => {
    try {
      await studentService.update(student.id, { ...student, status: nextStatus });
      setStudents((prev) =>
        prev.map((item) =>
          item.id === student.id ? { ...item, status: nextStatus } : item,
        ),
      );
      setMessage(`${student.name} marked ${nextStatus}.`);
    } catch (error) {
      setMessage(error.response?.data?.message || "Could not update student status.");
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Active / Inactive Students"
        subtitle="Manage student account status"
      />

      {message && (
        <div className="rounded-lg border border-light-border bg-light-card px-4 py-3 text-sm text-light-text-secondary dark:border-dark-border dark:bg-dark-card dark:text-dark-text-secondary">
          {message}
        </div>
      )}

      <div className="rounded-xl border border-light-border bg-light-card p-4 dark:border-dark-border dark:bg-dark-card">
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-light-text-tertiary" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search students..."
              className="w-full rounded-lg border border-light-border bg-light-bg py-2 pl-9 pr-3 text-sm outline-none focus:border-accent dark:border-dark-border dark:bg-dark-bg"
            />
          </div>
          <select
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            className="rounded-lg border border-light-border bg-light-bg px-3 py-2 text-sm outline-none focus:border-accent dark:border-dark-border dark:bg-dark-bg"
          >
            {["All", "active", "inactive", "suspended"].map((item) => (
              <option key={item} value={item}>
                {item === "All" ? "All Status" : item.charAt(0).toUpperCase() + item.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-light-border bg-light-card dark:border-dark-border dark:bg-dark-card">
        <div className="grid grid-cols-[1.3fr_0.8fr_0.8fr_1fr] border-b border-light-border px-4 py-3 text-xs font-medium uppercase text-light-text-tertiary dark:border-dark-border dark:text-dark-text-tertiary">
          <span>Student</span>
          <span>Class</span>
          <span>Status</span>
          <span>Actions</span>
        </div>
        {filtered.map((student) => (
          <div
            key={student.id}
            className="grid grid-cols-[1.3fr_0.8fr_0.8fr_1fr] items-center border-b border-light-border px-4 py-3 text-sm last:border-0 dark:border-dark-border"
          >
            <div>
              <p className="font-medium text-light-text-primary dark:text-dark-text-primary">{student.name}</p>
              <p className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary">{student.rollNo || "-"}</p>
            </div>
            <span className="text-light-text-secondary dark:text-dark-text-secondary">{student.class || "-"}</span>
            <StatusPill status={student.status || "active"} styles={statusStyles} />
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => updateStatus(student, "active")}
                className="rounded-lg border border-light-border px-3 py-1.5 text-xs font-medium text-light-text-secondary hover:bg-light-hover dark:border-dark-border dark:text-dark-text-secondary dark:hover:bg-dark-hover"
              >
                Active
              </button>
              <button
                onClick={() => updateStatus(student, "inactive")}
                className="rounded-lg border border-light-border px-3 py-1.5 text-xs font-medium text-light-text-secondary hover:bg-light-hover dark:border-dark-border dark:text-dark-text-secondary dark:hover:bg-dark-hover"
              >
                Inactive
              </button>
              <button
                onClick={() => updateStatus(student, "suspended")}
                className="rounded-lg border border-light-border px-3 py-1.5 text-xs font-medium text-light-text-secondary hover:bg-light-hover dark:border-dark-border dark:text-dark-text-secondary dark:hover:bg-dark-hover"
              >
                Suspend
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ActiveInactiveStudents;
