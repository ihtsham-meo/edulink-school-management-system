import { useMemo, useState } from "react";
import { Loader2, Plus, Trash2, Upload } from "lucide-react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../../components/common/PageHeader";
import { ROUTES } from "../../constants/routes";
import { studentService } from "../../services/studentService";

const createRow = (index) => ({
  id: Date.now() + index,
  name: "",
  email: "",
  phone: "",
  classId: "",
  sectionId: "",
  rollNumber: "",
  gender: "",
  parentName: "",
  parentPhone: "",
});

function AddBulkStudents() {
  const navigate = useNavigate();
  const [count, setCount] = useState(5);
  const [rows, setRows] = useState(() => Array.from({ length: 5 }, (_, i) => createRow(i)));
  const [csvFile, setCsvFile] = useState(null);
  const [message, setMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const requiredColumns = useMemo(
    () => ["name", "email", "class_id", "section_id"],
    [],
  );

  const resizeRows = (nextCount) => {
    const safeCount = Math.max(1, Math.min(100, Number(nextCount) || 1));
    setCount(safeCount);
    setRows((prev) => {
      if (safeCount <= prev.length) return prev.slice(0, safeCount);
      return [
        ...prev,
        ...Array.from({ length: safeCount - prev.length }, (_, i) =>
          createRow(prev.length + i),
        ),
      ];
    });
  };

  const updateRow = (id, key, value) => {
    setRows((prev) =>
      prev.map((row) => (row.id === id ? { ...row, [key]: value } : row)),
    );
  };

  const addRow = () => resizeRows(rows.length + 1);

  const removeRow = (id) => {
    const nextRows = rows.filter((row) => row.id !== id);
    setRows(nextRows.length ? nextRows : [createRow(0)]);
    setCount(Math.max(1, nextRows.length));
  };

  const validateRows = () => {
    return rows.every(
      (row) =>
        row.name.trim() &&
        row.email.trim() &&
        row.classId.trim() &&
        row.sectionId.trim(),
    );
  };

  const handleManualSubmit = async () => {
    setMessage("");
    if (!validateRows()) {
      setMessage("Name, email, class ID, and section ID are mandatory for every row.");
      return;
    }

    setIsSaving(true);
    try {
      await Promise.all(
        rows.map((row) =>
          studentService.createAdmission({
            user: {
              name: row.name.trim(),
              email: row.email.trim(),
              phone: row.phone.trim(),
            },
            profile: {
              class_id: row.classId,
              section_id: row.sectionId,
              roll_number: row.rollNumber,
              gender: row.gender,
              parent_name: row.parentName,
              parent_phone: row.parentPhone,
            },
          }),
        ),
      );
      setMessage(`${rows.length} students submitted.`);
    } catch (error) {
      setMessage(error.response?.data?.message || "Could not submit bulk students.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCsvUpload = async () => {
    setMessage("");
    if (!csvFile) {
      setMessage("Choose a CSV file first.");
      return;
    }

    setIsSaving(true);
    try {
      const response = await studentService.importCsv(csvFile);
      const data = response.data?.data || response.data;
      setMessage(data?.job_id ? `CSV import queued. Job ID: ${data.job_id}` : "CSV import queued.");
    } catch (error) {
      setMessage(error.response?.data?.message || "Could not upload CSV file.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Add Bulk Students"
        subtitle="Add multiple students manually or upload CSV"
        action={
          <button
            onClick={() => navigate(ROUTES.ADMIN_STUDENTS)}
            className="rounded-lg border border-light-border bg-light-card px-4 py-2 text-sm font-medium text-light-text-secondary hover:bg-light-hover dark:border-dark-border dark:bg-dark-card dark:text-dark-text-secondary dark:hover:bg-dark-hover"
          >
            All Students
          </button>
        }
      />

      {message && (
        <div className="rounded-lg border border-light-border bg-light-card px-4 py-3 text-sm text-light-text-secondary dark:border-dark-border dark:bg-dark-card dark:text-dark-text-secondary">
          {message}
        </div>
      )}

      <section className="rounded-xl border border-light-border bg-light-card p-5 dark:border-dark-border dark:bg-dark-card">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-sm font-semibold text-light-text-primary dark:text-dark-text-primary">
              Manual Bulk Entry
            </h2>
            <p className="mt-1 text-xs text-light-text-tertiary dark:text-dark-text-tertiary">
              Mandatory fields: name, email, class ID, section ID.
            </p>
          </div>
          <label className="block">
            <span className="text-xs font-medium text-light-text-secondary dark:text-dark-text-secondary">
              Number of students
            </span>
            <input
              type="number"
              min="1"
              max="100"
              value={count}
              onChange={(event) => resizeRows(event.target.value)}
              className="mt-1 w-32 rounded-lg border border-light-border bg-light-bg px-3 py-2 text-sm text-light-text-primary outline-none focus:border-accent dark:border-dark-border dark:bg-dark-bg dark:text-dark-text-primary"
            />
          </label>
        </div>

        <div className="mt-4 overflow-x-auto">
          <div className="min-w-[1050px]">
            <div className="grid grid-cols-[1.2fr_1.4fr_1fr_0.7fr_0.7fr_0.8fr_0.8fr_1fr_1fr_40px] gap-2 border-b border-light-border pb-2 text-xs font-medium uppercase text-light-text-tertiary dark:border-dark-border dark:text-dark-text-tertiary">
              <span>Name</span>
              <span>Email</span>
              <span>Phone</span>
              <span>Class ID</span>
              <span>Section ID</span>
              <span>Roll No</span>
              <span>Gender</span>
              <span>Parent Name</span>
              <span>Parent Phone</span>
              <span />
            </div>
            <div className="mt-2 flex flex-col gap-2">
              {rows.map((row) => (
                <div
                  key={row.id}
                  className="grid grid-cols-[1.2fr_1.4fr_1fr_0.7fr_0.7fr_0.8fr_0.8fr_1fr_1fr_40px] gap-2"
                >
                  <Cell value={row.name} onChange={(value) => updateRow(row.id, "name", value)} />
                  <Cell type="email" value={row.email} onChange={(value) => updateRow(row.id, "email", value)} />
                  <Cell value={row.phone} onChange={(value) => updateRow(row.id, "phone", value)} />
                  <Cell value={row.classId} onChange={(value) => updateRow(row.id, "classId", value)} />
                  <Cell value={row.sectionId} onChange={(value) => updateRow(row.id, "sectionId", value)} />
                  <Cell value={row.rollNumber} onChange={(value) => updateRow(row.id, "rollNumber", value)} />
                  <Cell value={row.gender} onChange={(value) => updateRow(row.id, "gender", value)} />
                  <Cell value={row.parentName} onChange={(value) => updateRow(row.id, "parentName", value)} />
                  <Cell value={row.parentPhone} onChange={(value) => updateRow(row.id, "parentPhone", value)} />
                  <button
                    onClick={() => removeRow(row.id)}
                    className="flex h-9 w-9 items-center justify-center rounded-lg text-light-text-tertiary hover:bg-red-50 hover:text-red-600 dark:text-dark-text-tertiary dark:hover:bg-red-950"
                    type="button"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-4 flex justify-end gap-2">
          <button
            type="button"
            onClick={addRow}
            className="flex items-center gap-2 rounded-lg border border-light-border px-4 py-2 text-sm font-medium text-light-text-secondary hover:bg-light-hover dark:border-dark-border dark:text-dark-text-secondary dark:hover:bg-dark-hover"
          >
            <Plus size={15} />
            Add Row
          </button>
          <button
            type="button"
            onClick={handleManualSubmit}
            disabled={isSaving}
            className="flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-hover disabled:opacity-70"
          >
            {isSaving && <Loader2 size={15} className="animate-spin" />}
            Submit Students
          </button>
        </div>
      </section>

      <section className="rounded-xl border border-light-border bg-light-card p-5 dark:border-dark-border dark:bg-dark-card">
        <h2 className="text-sm font-semibold text-light-text-primary dark:text-dark-text-primary">
          CSV Import
        </h2>
        <p className="mt-1 text-xs text-light-text-tertiary dark:text-dark-text-tertiary">
          Required columns: {requiredColumns.join(", ")}. Optional: phone, roll_number, date_of_birth, gender, admission_number, blood_group, address.
        </p>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <input
            type="file"
            accept=".csv,text/csv"
            onChange={(event) => setCsvFile(event.target.files?.[0] || null)}
            className="flex-1 rounded-lg border border-light-border bg-light-bg px-3 py-2 text-sm text-light-text-primary dark:border-dark-border dark:bg-dark-bg dark:text-dark-text-primary"
          />
          <button
            type="button"
            onClick={handleCsvUpload}
            disabled={isSaving}
            className="flex items-center justify-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-hover disabled:opacity-70"
          >
            {isSaving ? <Loader2 size={15} className="animate-spin" /> : <Upload size={15} />}
            Upload CSV
          </button>
        </div>
      </section>
    </div>
  );
}

function Cell({ value, onChange, type = "text" }) {
  return (
    <input
      type={type}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="h-9 rounded-lg border border-light-border bg-light-bg px-2 text-sm text-light-text-primary outline-none focus:border-accent dark:border-dark-border dark:bg-dark-bg dark:text-dark-text-primary"
    />
  );
}

export default AddBulkStudents;
