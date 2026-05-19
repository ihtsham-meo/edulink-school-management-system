import { useEffect, useMemo, useState } from "react";
import { ArrowUpRight, Search } from "lucide-react";
import PageHeader from "../../components/common/PageHeader";
import { studentService } from "../../services/studentService";
import { normalizeStudents } from "./studentUtils";

function PromoteStudents() {
  const [students, setStudents] = useState([]);
  const [query, setQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);
  const [targetClass, setTargetClass] = useState("");
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
    return students.filter(
      (student) =>
        student.name.toLowerCase().includes(text) ||
        student.class.toLowerCase().includes(text),
    );
  }, [students, query]);

  const toggleStudent = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const promoteSelected = () => {
    if (!selectedIds.length || !targetClass.trim()) {
      setMessage("Select students and enter a promotion class.");
      return;
    }

    setStudents((prev) =>
      prev.map((student) =>
        selectedIds.includes(student.id)
          ? { ...student, class: targetClass.trim() }
          : student,
      ),
    );
    setMessage(`${selectedIds.length} students marked for promotion to ${targetClass}.`);
    setSelectedIds([]);
  };

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Promote Students"
        subtitle="Select students and assign their next class"
        action={
          <button
            onClick={promoteSelected}
            className="flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-hover"
          >
            <ArrowUpRight size={16} />
            Save Changes
          </button>
        }
      />

      {message && (
        <div className="rounded-lg border border-light-border bg-light-card px-4 py-3 text-sm text-light-text-secondary dark:border-dark-border dark:bg-dark-card dark:text-dark-text-secondary">
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[320px_1fr_280px]">
        <div className="rounded-xl border border-light-border bg-light-card p-4 dark:border-dark-border dark:bg-dark-card">
          <h2 className="mb-3 text-sm font-semibold text-light-text-primary dark:text-dark-text-primary">Search</h2>
          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-light-text-tertiary" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search students..."
              className="w-full rounded-lg border border-light-border bg-light-bg py-2 pl-9 pr-3 text-sm outline-none focus:border-accent dark:border-dark-border dark:bg-dark-bg"
            />
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border border-light-border bg-light-card dark:border-dark-border dark:bg-dark-card">
          <div className="grid grid-cols-[40px_1fr_1fr] border-b border-light-border px-4 py-3 text-xs font-medium uppercase text-light-text-tertiary dark:border-dark-border dark:text-dark-text-tertiary">
            <span />
            <span>Student Name</span>
            <span>Current Class</span>
          </div>
          {filtered.map((student) => (
            <label key={student.id} className="grid cursor-pointer grid-cols-[40px_1fr_1fr] border-b border-light-border px-4 py-3 text-sm last:border-0 hover:bg-light-hover dark:border-dark-border dark:hover:bg-dark-hover">
              <input
                type="checkbox"
                checked={selectedIds.includes(student.id)}
                onChange={() => toggleStudent(student.id)}
                className="h-4 w-4 accent-gray-700"
              />
              <span className="font-medium text-light-text-primary dark:text-dark-text-primary">{student.name}</span>
              <span className="text-light-text-secondary dark:text-dark-text-secondary">{student.class || "-"}</span>
            </label>
          ))}
        </div>

        <div className="rounded-xl border border-light-border bg-light-card p-4 dark:border-dark-border dark:bg-dark-card">
          <h2 className="mb-3 text-sm font-semibold text-light-text-primary dark:text-dark-text-primary">Promote In</h2>
          <label className="block">
            <span className="text-xs font-medium text-light-text-secondary dark:text-dark-text-secondary">Target Class</span>
            <input
              value={targetClass}
              onChange={(event) => setTargetClass(event.target.value)}
              placeholder="e.g. 10-A"
              className="mt-1 w-full rounded-lg border border-light-border bg-light-bg px-3 py-2 text-sm outline-none focus:border-accent dark:border-dark-border dark:bg-dark-bg"
            />
          </label>
          <p className="mt-3 text-xs text-light-text-tertiary dark:text-dark-text-tertiary">
            Selected: {selectedIds.length}
          </p>
        </div>
      </div>
    </div>
  );
}

export default PromoteStudents;
