import { useEffect, useMemo, useState } from "react";
import { Search, UsersRound } from "lucide-react";
import PageHeader from "../../components/common/PageHeader";
import { studentService } from "../../services/studentService";
import { normalizeStudents } from "./studentUtils";

function ManageFamilies() {
  const [students, setStudents] = useState([]);
  const [query, setQuery] = useState("");

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
        student.fatherName.toLowerCase().includes(text) ||
        student.parentPhone.toLowerCase().includes(text),
    );
  }, [students, query]);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Manage Families"
        subtitle="Review parent and guardian information linked with students"
      />

      <div className="relative max-w-md">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-light-text-tertiary" />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search student, family, or phone..."
          className="w-full rounded-lg border border-light-border bg-light-card py-2 pl-9 pr-3 text-sm outline-none focus:border-accent dark:border-dark-border dark:bg-dark-card"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {filtered.map((student) => (
          <div
            key={student.id}
            className="rounded-xl border border-light-border bg-light-card p-5 dark:border-dark-border dark:bg-dark-card"
          >
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 text-accent">
                <UsersRound size={18} />
              </div>
              <div className="min-w-0">
                <h2 className="text-sm font-semibold text-light-text-primary dark:text-dark-text-primary">
                  {student.name || "Student"}
                </h2>
                <p className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary">
                  {student.class || "-"} · {student.rollNo || "-"}
                </p>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Info label="Father/Guardian" value={student.fatherName} />
              <Info label="Mother" value={student.motherName} />
              <Info label="Parent Phone" value={student.parentPhone || student.phone} />
              <Info label="Address" value={student.address} />
            </div>
          </div>
        ))}
      </div>

      {!filtered.length && (
        <div className="rounded-xl border border-light-border bg-light-card py-14 text-center text-sm text-light-text-secondary dark:border-dark-border dark:bg-dark-card dark:text-dark-text-secondary">
          No family records found.
        </div>
      )}
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div className="rounded-lg border border-light-border px-3 py-2 dark:border-dark-border">
      <p className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary">{label}</p>
      <p className="mt-1 text-sm font-medium text-light-text-primary dark:text-dark-text-primary">
        {value || "-"}
      </p>
    </div>
  );
}

export default ManageFamilies;
