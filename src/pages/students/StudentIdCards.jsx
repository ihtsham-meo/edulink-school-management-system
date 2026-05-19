import { useEffect, useMemo, useState } from "react";
import { Printer, Search } from "lucide-react";
import PageHeader from "../../components/common/PageHeader";
import { studentService } from "../../services/studentService";
import { normalizeStudents, printHtml } from "./studentUtils";

function StudentIdCards() {
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
        student.rollNo.toLowerCase().includes(text),
    );
  }, [students, query]);

  const printCards = () => {
    const cards = filtered
      .map(
        (student) => `
          <div style="width:320px;height:190px;border:1px solid #111827;border-radius:14px;padding:14px;display:inline-block;margin:8px;vertical-align:top">
            <h3 style="text-align:center;margin-bottom:10px">EduLink Student ID</h3>
            <div style="display:flex;gap:12px;align-items:center">
              <div style="width:72px;height:72px;border-radius:50%;background:#e5e7eb;text-align:center;line-height:72px;font-size:28px;font-weight:700">${student.name?.charAt(0) || "S"}</div>
              <div>
                <div><strong>${student.name || "-"}</strong></div>
                <div>Roll: ${student.rollNo || "-"}</div>
                <div>Class: ${student.class || "-"}</div>
                <div>Phone: ${student.phone || "-"}</div>
              </div>
            </div>
            <div style="margin-top:16px;font-size:11px;color:#6b7280">Valid for current academic session</div>
          </div>
        `,
      )
      .join("");

    printHtml("Student ID Cards", cards);
  };

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Student ID Cards"
        subtitle="Preview and print student ID cards"
        action={
          <button
            onClick={printCards}
            className="flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-hover"
          >
            <Printer size={16} />
            Print Cards
          </button>
        }
      />

      <div className="relative max-w-md">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-light-text-tertiary" />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search by name or roll number..."
          className="w-full rounded-lg border border-light-border bg-light-card py-2 pl-9 pr-3 text-sm outline-none focus:border-accent dark:border-dark-border dark:bg-dark-card"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((student) => (
          <div key={student.id} className="rounded-xl border border-light-border bg-light-card p-4 dark:border-dark-border dark:bg-dark-card">
            <div className="mb-3 text-center text-sm font-semibold text-light-text-primary dark:text-dark-text-primary">
              EduLink Student ID
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent/10 text-xl font-semibold text-accent">
                {student.name?.charAt(0) || "S"}
              </div>
              <div>
                <p className="text-sm font-semibold text-light-text-primary dark:text-dark-text-primary">{student.name || "-"}</p>
                <p className="text-xs text-light-text-secondary dark:text-dark-text-secondary">Roll: {student.rollNo || "-"}</p>
                <p className="text-xs text-light-text-secondary dark:text-dark-text-secondary">Class: {student.class || "-"}</p>
                <p className="text-xs text-light-text-secondary dark:text-dark-text-secondary">Phone: {student.phone || "-"}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default StudentIdCards;
