import { useEffect, useMemo, useState } from "react";
import { Loader2, Printer, Search } from "lucide-react";
import PageHeader from "../../components/common/PageHeader";
import { studentService } from "../../services/studentService";
import { normalizeStudents, printHtml } from "./studentUtils";

function AdmissionLetters() {
  const [students, setStudents] = useState([]);
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadStudents = async () => {
      try {
        const response = await studentService.getAll();
        const list = normalizeStudents(response.data);
        setStudents(list);
        setSelectedId(String(list[0]?.id || ""));
      } finally {
        setIsLoading(false);
      }
    };

    loadStudents();
  }, []);

  const filtered = useMemo(() => {
    const text = query.toLowerCase();
    return students.filter(
      (student) =>
        student.name.toLowerCase().includes(text) ||
        student.rollNo.toLowerCase().includes(text) ||
        student.class.toLowerCase().includes(text),
    );
  }, [students, query]);

  const selectedStudent =
    students.find((student) => String(student.id) === selectedId) || filtered[0];

  const printLetter = () => {
    if (!selectedStudent) return;
    printHtml(
      "Admission Letter",
      `
        <div style="text-align:center;margin-bottom:24px">
          <h1>EduLink</h1>
          <p class="muted">"YOUR SCHOOL SOFTWARE"</p>
          <h2 style="color:#3730a3;margin-top:10px">Admission Letter</h2>
        </div>
        <div class="card">
          <div class="grid">
            ${field("Serial No", selectedStudent.id)}
            ${field("Date Of Birth", selectedStudent.dob)}
            ${field("Date Of Admission", new Date().toLocaleDateString())}
            ${field("Registration No", selectedStudent.admissionNumber || selectedStudent.rollNo)}
            ${field("Student Name", selectedStudent.name)}
            ${field("Gender", selectedStudent.gender)}
            ${field("Class", selectedStudent.class)}
            ${field("Section", selectedStudent.section)}
            ${field("Blood Group", selectedStudent.bloodGroup)}
          </div>
        </div>
        <div class="card">
          <h3>Address</h3>
          <p>${selectedStudent.address || "-"}</p>
        </div>
        <div class="card">
          <div class="grid">
            ${field("Father/Guardian Name", selectedStudent.fatherName)}
            ${field("Parent Mobile No", selectedStudent.parentPhone || selectedStudent.phone)}
            ${field("Username", selectedStudent.username)}
          </div>
        </div>
        <h3>Rules And Regulations:</h3>
        <p>Students are expected to attend school regularly, respect peers and teachers, follow uniform rules, and maintain school discipline.</p>
        <div class="signatures">
          <span>Signature of Authority__________________</span>
          <span>Institute Stamp__________________</span>
        </div>
      `,
    );
  };

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Admission Letters"
        subtitle="Search a student and print admission form"
        action={
          <button
            onClick={printLetter}
            className="flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-hover"
          >
            <Printer size={16} />
            Print Letter
          </button>
        }
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[320px_1fr]">
        <div className="rounded-xl border border-light-border bg-light-card p-4 dark:border-dark-border dark:bg-dark-card">
          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-light-text-tertiary" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search student..."
              className="w-full rounded-lg border border-light-border bg-light-bg py-2 pl-9 pr-3 text-sm outline-none focus:border-accent dark:border-dark-border dark:bg-dark-bg"
            />
          </div>
          <div className="mt-3 flex max-h-[520px] flex-col gap-2 overflow-y-auto">
            {isLoading ? (
              <div className="flex items-center gap-2 text-sm text-light-text-secondary">
                <Loader2 size={16} className="animate-spin" />
                Loading students...
              </div>
            ) : (
              filtered.map((student) => (
                <button
                  key={student.id}
                  onClick={() => setSelectedId(String(student.id))}
                  className={`rounded-lg border px-3 py-2 text-left text-sm ${
                    String(student.id) === selectedId
                      ? "border-accent bg-accent/10 text-accent"
                      : "border-light-border text-light-text-secondary hover:bg-light-hover dark:border-dark-border dark:text-dark-text-secondary dark:hover:bg-dark-hover"
                  }`}
                >
                  <span className="block font-medium">{student.name}</span>
                  <span className="text-xs opacity-70">{student.class || "-"} · {student.rollNo || "-"}</span>
                </button>
              ))
            )}
          </div>
        </div>

        <div className="rounded-xl border border-light-border bg-light-card p-6 dark:border-dark-border dark:bg-dark-card">
          {selectedStudent ? (
            <div className="mx-auto max-w-3xl">
              <div className="text-center">
                <h2 className="text-2xl font-semibold text-light-text-primary dark:text-dark-text-primary">EduLink</h2>
                <p className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary">Admission Letter Preview</p>
              </div>
              <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
                <Preview label="Student Name" value={selectedStudent.name} />
                <Preview label="Registration No" value={selectedStudent.admissionNumber || selectedStudent.rollNo} />
                <Preview label="Class" value={selectedStudent.class} />
                <Preview label="Date of Birth" value={selectedStudent.dob} />
                <Preview label="Gender" value={selectedStudent.gender} />
                <Preview label="Phone" value={selectedStudent.phone} />
                <Preview label="Address" value={selectedStudent.address} wide />
              </div>
            </div>
          ) : (
            <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">No student selected.</p>
          )}
        </div>
      </div>
    </div>
  );
}

const field = (label, value) => `
  <div>
    <div class="field-label">${label}</div>
    <div class="field-value">${value || "-"}</div>
  </div>
`;

function Preview({ label, value, wide = false }) {
  return (
    <div className={`rounded-lg border border-light-border px-3 py-2 dark:border-dark-border ${wide ? "sm:col-span-3" : ""}`}>
      <p className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary">{label}</p>
      <p className="mt-1 text-sm font-semibold text-light-text-primary dark:text-dark-text-primary">{value || "-"}</p>
    </div>
  );
}

export default AdmissionLetters;
