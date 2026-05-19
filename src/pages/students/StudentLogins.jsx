import { useEffect, useMemo, useState } from "react";
import { Eye, EyeOff, Printer, Search } from "lucide-react";
import PageHeader from "../../components/common/PageHeader";
import { studentService } from "../../services/studentService";
import { normalizeStudents, printHtml } from "./studentUtils";

function StudentLogins() {
  const [students, setStudents] = useState([]);
  const [query, setQuery] = useState("");
  const [showPasswords, setShowPasswords] = useState(false);

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
        student.class.toLowerCase().includes(text) ||
        student.username.toLowerCase().includes(text),
    );
  }, [students, query]);

  const printLogins = () => {
    const rows = filtered
      .map(
        (student, index) => `
          <tr>
            <td>${index + 1}</td>
            <td>${student.name || "-"}</td>
            <td>${student.class || "-"}</td>
            <td>${student.username || "-"}</td>
            <td>${student.password || "********"}</td>
          </tr>
        `,
      )
      .join("");

    printHtml(
      "Student Login Credentials",
      `<h1>Student Login Credentials</h1><p class="muted">Handle this printout carefully.</p><table><thead><tr><th>#</th><th>Student</th><th>Class</th><th>Username</th><th>Password</th></tr></thead><tbody>${rows}</tbody></table>`,
    );
  };

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Manage Student Logins"
        subtitle="View and print student portal credentials"
        action={
          <div className="flex gap-2">
            <button
              onClick={() => setShowPasswords((value) => !value)}
              className="flex items-center gap-2 rounded-lg border border-light-border bg-light-card px-4 py-2 text-sm font-medium text-light-text-secondary hover:bg-light-hover dark:border-dark-border dark:bg-dark-card dark:text-dark-text-secondary dark:hover:bg-dark-hover"
            >
              {showPasswords ? <EyeOff size={16} /> : <Eye size={16} />}
              {showPasswords ? "Hide" : "Show"}
            </button>
            <button
              onClick={printLogins}
              className="flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-hover"
            >
              <Printer size={16} />
              Print
            </button>
          </div>
        }
      />

      <div className="relative max-w-md">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-light-text-tertiary" />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search credentials..."
          className="w-full rounded-lg border border-light-border bg-light-card py-2 pl-9 pr-3 text-sm outline-none focus:border-accent dark:border-dark-border dark:bg-dark-card"
        />
      </div>

      <div className="overflow-hidden rounded-xl border border-light-border bg-light-card dark:border-dark-border dark:bg-dark-card">
        <div className="grid grid-cols-[1fr_1fr_1.3fr_1fr] border-b border-light-border px-4 py-3 text-xs font-medium uppercase text-light-text-tertiary dark:border-dark-border dark:text-dark-text-tertiary">
          <span>Student</span>
          <span>Class</span>
          <span>Username</span>
          <span>Password</span>
        </div>
        {filtered.map((student) => (
          <div key={student.id} className="grid grid-cols-[1fr_1fr_1.3fr_1fr] border-b border-light-border px-4 py-3 text-sm last:border-0 dark:border-dark-border">
            <span className="font-medium text-light-text-primary dark:text-dark-text-primary">{student.name}</span>
            <span className="text-light-text-secondary dark:text-dark-text-secondary">{student.class || "-"}</span>
            <span className="text-light-text-secondary dark:text-dark-text-secondary">{student.username || "-"}</span>
            <span className="text-light-text-secondary dark:text-dark-text-secondary">{showPasswords ? student.password : "********"}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default StudentLogins;
