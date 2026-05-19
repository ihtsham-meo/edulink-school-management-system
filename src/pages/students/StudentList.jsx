import { useEffect, useMemo, useState } from "react";
import {
  Search,
  Plus,
  Eye,
  Pencil,
  Trash2,
  Printer,
  Upload,
  ChevronLeft,
  ChevronRight,
  Users,
  X,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../../components/common/PageHeader";
import StatusPill from "../../components/common/StatusPill";
import { feeStatusStyles } from "../../data/mockData";
import { studentService } from "../../services/studentService";
import { ROUTES } from "../../constants/routes";
import { normalizeStudents, printHtml } from "./studentUtils";

const statusStyles = {
  active: "bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-400",
  inactive: "bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-400",
};

const initialForm = {
  name: "",
  rollNo: "",
  class: "",
  section: "",
  gender: "Male",
  status: "active",
  phone: "",
  email: "",
  fee: "pending",
  dob: "",
  address: "",
};

function StudentList() {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedClass, setClass] = useState("All Classes");
  const [selectedStatus, setStatus] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [modalMode, setModalMode] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [formErrors, setFormErrors] = useState({});
  const perPage = 10;

  useEffect(() => {
    const loadStudents = async () => {
      setIsLoading(true);
      setError("");

      try {
        const response = await studentService.getAll();
        const apiStudents = normalizeStudents(response.data);
        setStudents(apiStudents);
      } catch (err) {
        setStudents([]);
        setError(err.response?.data?.message || "Could not load students from the backend.");
      } finally {
        setIsLoading(false);
      }
    };

    loadStudents();
  }, []);

  const classes = useMemo(() => {
    const uniqueClasses = [...new Set(students.map((s) => s.class).filter(Boolean))];
    return ["All Classes", ...uniqueClasses.sort()];
  }, [students]);

  const filtered = useMemo(() => {
    return students.filter((s) => {
      const query = search.toLowerCase();
      const matchSearch =
        s.name?.toLowerCase().includes(query) ||
        s.rollNo?.toLowerCase().includes(query) ||
        s.phone?.toLowerCase().includes(query);
      const matchClass =
        selectedClass === "All Classes" || s.class === selectedClass;
      const matchStatus =
        selectedStatus === "All" || s.status === selectedStatus;
      return matchSearch && matchClass && matchStatus;
    });
  }, [students, search, selectedClass, selectedStatus]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const paginatedStudents = useMemo(() => {
    const startIdx = (currentPage - 1) * perPage;
    return filtered.slice(startIdx, startIdx + perPage);
  }, [filtered, currentPage]);

  const openEditModal = (student) => {
    setForm({ ...initialForm, ...student });
    setFormErrors({});
    setSelectedStudent(student);
    setModalMode("form");
  };

  const openViewModal = (student) => {
    setSelectedStudent(student);
    setModalMode("view");
  };

  const openDeleteModal = (student) => {
    setSelectedStudent(student);
    setModalMode("delete");
  };

  const closeModal = () => {
    setModalMode(null);
    setSelectedStudent(null);
    setFormErrors({});
  };

  const validateForm = () => {
    const errors = {};
    if (!form.name.trim()) errors.name = "Name is required";
    if (!form.rollNo.trim()) errors.rollNo = "Roll number is required";
    if (!form.class.trim()) errors.class = "Class is required";
    if (!form.phone.trim()) errors.phone = "Phone is required";
    if (form.email && !/^\S+@\S+\.\S+$/.test(form.email)) {
      errors.email = "Enter a valid email";
    }

    const duplicateRollNo = students.some(
      (student) =>
        student.rollNo?.toLowerCase() === form.rollNo.trim().toLowerCase() &&
        student.id !== selectedStudent?.id,
    );
    if (duplicateRollNo) errors.rollNo = "Roll number already exists";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleFormChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setFormErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm()) return;

    const payload = {
      ...form,
      name: form.name.trim(),
      rollNo: form.rollNo.trim(),
      class: form.class.trim(),
      section: form.section.trim(),
      phone: form.phone.trim(),
      email: form.email.trim(),
      address: form.address.trim(),
    };

    setIsSaving(true);
    try {
      if (selectedStudent) {
        await studentService.update(selectedStudent.id, payload);
        setStudents((prev) =>
          prev.map((student) =>
            student.id === selectedStudent.id
              ? { ...student, ...payload }
              : student,
          ),
        );
      } else {
        const response = await studentService.create(payload);
        const createdStudent =
          normalizeStudents(response.data).at(0) ||
          normalizeStudents(response.data?.data).at(0) ||
          { ...payload, id: response.data?.data?.id || Date.now() };
        setStudents((prev) => [createdStudent, ...prev]);
      }
      closeModal();
    } catch {
      setError("Something went wrong while saving. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedStudent) return;

    setIsSaving(true);
    try {
      await studentService.delete(selectedStudent.id);
      setStudents((prev) =>
        prev.filter((student) => student.id !== selectedStudent.id),
      );
      closeModal();
    } catch {
      setError("Something went wrong while deleting. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const printStudents = (rows = filtered, title = "Students") => {
    const tableRows = rows
      .map(
        (student, index) => `
          <tr>
            <td>${index + 1}</td>
            <td>${student.rollNo || ""}</td>
            <td>${student.name || ""}</td>
            <td>${student.class || ""}</td>
            <td>${student.section || ""}</td>
            <td>${student.gender || ""}</td>
            <td>${student.phone || ""}</td>
            <td>${student.email || ""}</td>
          </tr>
        `,
      )
      .join("");

    printHtml(
      title,
      `
          <h1>${title}</h1>
          <p class="muted">Printed on ${new Date().toLocaleString()}</p>
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Roll No</th>
                <th>Name</th>
                <th>Class</th>
                <th>Section</th>
                <th>Gender</th>
                <th>Phone</th>
                <th>Email</th>
              </tr>
            </thead>
            <tbody>${tableRows}</tbody>
          </table>
      `,
    );
  };

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Students"
        subtitle={`${filtered.length} students found`}
        action={
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => printStudents()}
              className="flex items-center gap-2 rounded-lg border border-light-border bg-light-card px-4 py-2 text-sm font-medium text-light-text-secondary transition-colors hover:bg-light-hover dark:border-dark-border dark:bg-dark-card dark:text-dark-text-secondary dark:hover:bg-dark-hover"
            >
              <Printer size={16} />
              Print
            </button>
            <button
              onClick={() => navigate(ROUTES.ADMIN_STUDENT_BULK)}
              className="flex items-center gap-2 rounded-lg border border-light-border bg-light-card px-4 py-2 text-sm font-medium text-light-text-secondary transition-colors hover:bg-light-hover dark:border-dark-border dark:bg-dark-card dark:text-dark-text-secondary dark:hover:bg-dark-hover"
            >
              <Upload size={16} />
              Bulk Add
            </button>
            <button
              onClick={() => navigate(ROUTES.ADMIN_STUDENT_ADD)}
              className="flex items-center gap-2 px-4 py-2 bg-accent hover:bg-accent-hover text-white text-sm font-medium rounded-lg transition-colors"
            >
              <Plus size={16} />
              Add Student
            </button>
          </div>
        }
      />

      {error && (
        <div className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-300">
          <AlertCircle size={17} className="mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-light-text-tertiary dark:text-dark-text-tertiary"
            />
            <input
              type="text"
              placeholder="Search by name, roll number, or phone..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-9 pr-4 py-2 rounded-lg bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border text-light-text-primary dark:text-dark-text-primary placeholder:text-light-text-tertiary dark:placeholder:text-dark-text-tertiary text-sm outline-none focus:border-accent transition-colors"
            />
          </div>

          <select
            value={selectedClass}
            onChange={(e) => {
              setClass(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-2 rounded-lg bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border text-light-text-primary dark:text-dark-text-primary text-sm outline-none focus:border-accent transition-colors"
          >
            {classes.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => {
              setStatus(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-2 rounded-lg bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border text-light-text-primary dark:text-dark-text-primary text-sm outline-none focus:border-accent transition-colors"
          >
            {["All", "active", "inactive"].map((s) => (
              <option key={s} value={s}>
                {s === "All"
                  ? "All Status"
                  : s.charAt(0).toUpperCase() + s.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl overflow-hidden">
        <div className="grid grid-cols-[1fr_1.6fr_0.8fr_1fr_0.9fr_0.8fr] px-4 py-3 border-b border-light-border dark:border-dark-border min-w-[780px]">
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

        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="flex items-center justify-center gap-2 py-16 text-sm text-light-text-secondary dark:text-dark-text-secondary">
              <Loader2 size={18} className="animate-spin" />
              Loading students...
            </div>
          ) : paginatedStudents.length > 0 ? (
            paginatedStudents.map((student) => (
              <div
                key={student.id}
                className="grid grid-cols-[1fr_1.6fr_0.8fr_1fr_0.9fr_0.8fr] px-4 py-3 border-b border-light-border dark:border-dark-border last:border-0 hover:bg-light-hover dark:hover:bg-dark-hover transition-colors items-center min-w-[780px]"
              >
                <span className="text-sm text-light-text-tertiary dark:text-dark-text-tertiary">
                  {student.rollNo}
                </span>

                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-accent text-xs font-medium shrink-0">
                    {student.name?.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-light-text-primary dark:text-dark-text-primary truncate">
                      {student.name}
                    </p>
                    <p className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary">
                      {student.gender}
                    </p>
                  </div>
                </div>

                <span className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                  {student.class}
                </span>

                <span className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                  {student.phone}
                </span>

                <StatusPill status={student.fee || "pending"} styles={feeStatusStyles} />

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openViewModal(student)}
                    title="View student"
                    className="w-7 h-7 flex items-center justify-center rounded-lg text-light-text-tertiary dark:text-dark-text-tertiary hover:bg-blue-50 dark:hover:bg-blue-950 hover:text-blue-600 transition-colors"
                  >
                    <Eye size={14} />
                  </button>
                  <button
                    onClick={() => printStudents([student], `${student.name || "Student"} Details`)}
                    title="Print student"
                    className="w-7 h-7 flex items-center justify-center rounded-lg text-light-text-tertiary dark:text-dark-text-tertiary hover:bg-green-50 dark:hover:bg-green-950 hover:text-green-600 transition-colors"
                  >
                    <Printer size={14} />
                  </button>
                  <button
                    onClick={() => openEditModal(student)}
                    title="Edit student"
                    className="w-7 h-7 flex items-center justify-center rounded-lg text-light-text-tertiary dark:text-dark-text-tertiary hover:bg-amber-50 dark:hover:bg-amber-950 hover:text-amber-600 transition-colors"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    onClick={() => openDeleteModal(student)}
                    title="Delete student"
                    className="w-7 h-7 flex items-center justify-center rounded-lg text-light-text-tertiary dark:text-dark-text-tertiary hover:bg-red-50 dark:hover:bg-red-950 hover:text-red-600 transition-colors"
                  >
                    <Trash2 size={14} />
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
              <p className="text-light-text-tertiary dark:text-dark-text-tertiary text-xs">
                Try adjusting your search or filters
              </p>
            </div>
          )}
        </div>

        {!isLoading && filtered.length > 0 && (
          <div className="flex items-center justify-between px-5 py-3.5 border-t border-light-border dark:border-dark-border">
            <p className="text-light-text-tertiary dark:text-dark-text-tertiary text-xs">
              Showing{" "}
              {Math.min((currentPage - 1) * perPage + 1, filtered.length)}-
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
                  className={`w-7 h-7 rounded-lg border text-xs font-medium transition-all ${
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

      {modalMode === "form" && (
        <StudentFormModal
          form={form}
          errors={formErrors}
          isSaving={isSaving}
          isEditing={Boolean(selectedStudent)}
          onClose={closeModal}
          onChange={handleFormChange}
          onSubmit={handleSubmit}
        />
      )}

      {modalMode === "view" && selectedStudent && (
        <StudentViewModal student={selectedStudent} onClose={closeModal} />
      )}

      {modalMode === "delete" && selectedStudent && (
        <DeleteStudentModal
          student={selectedStudent}
          isSaving={isSaving}
          onClose={closeModal}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
}

function ModalShell({ title, children, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-2xl rounded-xl border border-light-border bg-light-card shadow-xl dark:border-dark-border dark:bg-dark-card">
        <div className="flex items-center justify-between border-b border-light-border px-5 py-4 dark:border-dark-border">
          <h2 className="text-sm font-semibold text-light-text-primary dark:text-dark-text-primary">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-light-text-tertiary hover:bg-light-hover hover:text-light-text-primary dark:text-dark-text-tertiary dark:hover:bg-dark-hover dark:hover:text-dark-text-primary"
          >
            <X size={16} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function StudentFormModal({
  form,
  errors,
  isSaving,
  isEditing,
  onClose,
  onChange,
  onSubmit,
}) {
  return (
    <ModalShell
      title={isEditing ? "Edit Student" : "Add Student"}
      onClose={onClose}
    >
      <form onSubmit={onSubmit} className="p-5">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField
            label="Name"
            value={form.name}
            error={errors.name}
            onChange={(value) => onChange("name", value)}
          />
          <FormField
            label="Roll No"
            value={form.rollNo}
            error={errors.rollNo}
            onChange={(value) => onChange("rollNo", value)}
          />
          <FormField
            label="Class"
            value={form.class}
            error={errors.class}
            placeholder="10-A"
            onChange={(value) => onChange("class", value)}
          />
          <FormField
            label="Section"
            value={form.section}
            placeholder="A"
            onChange={(value) => onChange("section", value)}
          />
          <FormField
            label="Phone"
            value={form.phone}
            error={errors.phone}
            onChange={(value) => onChange("phone", value)}
          />
          <FormField
            label="Email"
            type="email"
            value={form.email}
            error={errors.email}
            onChange={(value) => onChange("email", value)}
          />
          <SelectField
            label="Gender"
            value={form.gender}
            options={["Male", "Female"]}
            onChange={(value) => onChange("gender", value)}
          />
          <SelectField
            label="Status"
            value={form.status}
            options={["active", "inactive"]}
            onChange={(value) => onChange("status", value)}
          />
          <SelectField
            label="Fee Status"
            value={form.fee}
            options={["paid", "pending", "overdue"]}
            onChange={(value) => onChange("fee", value)}
          />
          <FormField
            label="Date of Birth"
            type="date"
            value={form.dob}
            onChange={(value) => onChange("dob", value)}
          />
          <div className="sm:col-span-2">
            <FormField
              label="Address"
              value={form.address}
              onChange={(value) => onChange("address", value)}
            />
          </div>
        </div>

        <div className="mt-5 flex justify-end gap-2 border-t border-light-border pt-4 dark:border-dark-border">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-light-border px-4 py-2 text-sm font-medium text-light-text-secondary hover:bg-light-hover dark:border-dark-border dark:text-dark-text-secondary dark:hover:bg-dark-hover"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSaving}
            className="flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSaving && <Loader2 size={15} className="animate-spin" />}
            {isEditing ? "Save Changes" : "Add Student"}
          </button>
        </div>
      </form>
    </ModalShell>
  );
}

function StudentViewModal({ student, onClose }) {
  const fields = [
    ["Roll No", student.rollNo],
    ["Class", student.class],
    ["Section", student.section],
    ["Gender", student.gender],
    ["Status", student.status],
    ["Fee", student.fee],
    ["Phone", student.phone],
    ["Email", student.email],
    ["Date of Birth", student.dob],
    ["Address", student.address],
  ];

  return (
    <ModalShell title="Student Details" onClose={onClose}>
      <div className="p-5">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/10 text-base font-semibold text-accent">
            {student.name?.charAt(0)}
          </div>
          <div>
            <h3 className="text-base font-semibold text-light-text-primary dark:text-dark-text-primary">
              {student.name}
            </h3>
            <div className="mt-1 flex items-center gap-2">
              <StatusPill status={student.status || "active"} styles={statusStyles} />
              <StatusPill status={student.fee || "pending"} styles={feeStatusStyles} />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {fields.map(([label, value]) => (
            <div
              key={label}
              className="rounded-lg border border-light-border px-3 py-2 dark:border-dark-border"
            >
              <p className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary">
                {label}
              </p>
              <p className="mt-1 text-sm font-medium text-light-text-primary dark:text-dark-text-primary">
                {value || "-"}
              </p>
            </div>
          ))}
        </div>
      </div>
    </ModalShell>
  );
}

function DeleteStudentModal({ student, isSaving, onClose, onConfirm }) {
  return (
    <ModalShell title="Delete Student" onClose={onClose}>
      <div className="p-5">
        <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
          Are you sure you want to delete{" "}
          <span className="font-semibold text-light-text-primary dark:text-dark-text-primary">
            {student.name}
          </span>
          ? This action cannot be undone.
        </p>
        <div className="mt-5 flex justify-end gap-2 border-t border-light-border pt-4 dark:border-dark-border">
          <button
            onClick={onClose}
            className="rounded-lg border border-light-border px-4 py-2 text-sm font-medium text-light-text-secondary hover:bg-light-hover dark:border-dark-border dark:text-dark-text-secondary dark:hover:bg-dark-hover"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isSaving}
            className="flex items-center gap-2 rounded-lg bg-danger px-4 py-2 text-sm font-medium text-white hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSaving && <Loader2 size={15} className="animate-spin" />}
            Delete
          </button>
        </div>
      </div>
    </ModalShell>
  );
}

function FormField({ label, value, error, onChange, type = "text", placeholder }) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-light-text-secondary dark:text-dark-text-secondary">
        {label}
      </span>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className={`mt-1 w-full rounded-lg border bg-light-bg px-3 py-2 text-sm text-light-text-primary outline-none transition-colors placeholder:text-light-text-tertiary focus:border-accent dark:bg-dark-bg dark:text-dark-text-primary dark:placeholder:text-dark-text-tertiary ${
          error
            ? "border-danger"
            : "border-light-border dark:border-dark-border"
        }`}
      />
      {error && <span className="mt-1 block text-xs text-danger">{error}</span>}
    </label>
  );
}

function SelectField({ label, value, options, onChange }) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-light-text-secondary dark:text-dark-text-secondary">
        {label}
      </span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-1 w-full rounded-lg border border-light-border bg-light-bg px-3 py-2 text-sm text-light-text-primary outline-none transition-colors focus:border-accent dark:border-dark-border dark:bg-dark-bg dark:text-dark-text-primary"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option.charAt(0).toUpperCase() + option.slice(1)}
          </option>
        ))}
      </select>
    </label>
  );
}

export default StudentList;
