import { useMemo, useState } from "react";
import { Camera, Loader2, Save } from "lucide-react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../../components/common/PageHeader";
import { ROUTES } from "../../constants/routes";
import { studentService } from "../../services/studentService";

const initialForm = {
  photo: null,
  photoPreview: "",
  name: "",
  email: "",
  phone: "",
  password: "",
  admissionNumber: "",
  rollNumber: "",
  dateOfBirth: "",
  gender: "",
  bloodGroup: "",
  religion: "",
  nationality: "",
  cnicBForm: "",
  address: "",
  previousSchool: "",
  medicalNotes: "",
  classId: "",
  sectionId: "",
  admissionDate: "",
  academicYear: "",
  transportRequired: false,
  hostelRequired: false,
  parentName: "",
  parentEmail: "",
  parentPhone: "",
  parentCnic: "",
  parentRelation: "Father",
  parentOccupation: "",
  guardianName: "",
  guardianPhone: "",
  emergencyContact: "",
};

function AddStudent() {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const requiredFields = useMemo(
    () => ["name", "email", "parentName", "parentPhone", "classId", "sectionId"],
    [],
  );

  const set = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  const handlePhoto = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    set("photo", file);
    set("photoPreview", URL.createObjectURL(file));
  };

  const validate = () => {
    const nextErrors = {};
    requiredFields.forEach((field) => {
      if (!String(form[field] || "").trim()) {
        nextErrors[field] = "Required";
      }
    });
    if (form.email && !/^\S+@\S+\.\S+$/.test(form.email)) {
      nextErrors.email = "Enter a valid email";
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) return;

    setIsSaving(true);
    setMessage("");

    try {
      await studentService.createAdmission({
        user: {
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim() || form.parentPhone.trim(),
          password: form.password || undefined,
        },
        profile: {
          class_id: form.classId,
          section_id: form.sectionId,
          admission_number: form.admissionNumber,
          roll_number: form.rollNumber,
          date_of_birth: form.dateOfBirth,
          gender: form.gender,
          blood_group: form.bloodGroup,
          address: form.address,
          previous_school: form.previousSchool,
          medical_notes: form.medicalNotes,
          admission_date: form.admissionDate,
          academic_year: form.academicYear,
          religion: form.religion,
          nationality: form.nationality,
          cnic_b_form: form.cnicBForm,
          transport_required: form.transportRequired,
          hostel_required: form.hostelRequired,
          parent_name: form.parentName,
          parent_email: form.parentEmail,
          parent_phone: form.parentPhone,
          parent_cnic: form.parentCnic,
          parent_relation: form.parentRelation,
          parent_occupation: form.parentOccupation,
          guardian_name: form.guardianName,
          guardian_phone: form.guardianPhone,
          emergency_contact: form.emergencyContact,
        },
      });
      setMessage("Student admission saved.");
      setForm(initialForm);
    } catch (error) {
      setMessage(error.response?.data?.message || "Could not save student admission.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Add Student"
        subtitle="Complete student admission form"
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

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <section className="rounded-xl border border-light-border bg-light-card p-5 dark:border-dark-border dark:bg-dark-card">
          <h2 className="mb-4 text-sm font-semibold text-light-text-primary dark:text-dark-text-primary">
            Student Information
          </h2>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-[180px_1fr]">
            <label className="flex h-44 cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-light-border bg-light-bg text-center text-sm text-light-text-tertiary dark:border-dark-border dark:bg-dark-bg dark:text-dark-text-tertiary">
              {form.photoPreview ? (
                <img
                  src={form.photoPreview}
                  alt="Student"
                  className="h-full w-full rounded-xl object-cover"
                />
              ) : (
                <>
                  <Camera size={24} />
                  <span className="mt-2">Student photo</span>
                </>
              )}
              <input type="file" accept="image/*" onChange={handlePhoto} className="hidden" />
            </label>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <Field label="Full Name" value={form.name} error={errors.name} onChange={(value) => set("name", value)} />
              <Field label="Email" type="email" value={form.email} error={errors.email} onChange={(value) => set("email", value)} />
              <Field label="Phone" value={form.phone} onChange={(value) => set("phone", value)} />
              <Field label="Password" type="password" value={form.password} onChange={(value) => set("password", value)} />
              <Field label="Admission No" value={form.admissionNumber} onChange={(value) => set("admissionNumber", value)} />
              <Field label="Roll No" value={form.rollNumber} onChange={(value) => set("rollNumber", value)} />
              <Field label="Date of Birth" type="date" value={form.dateOfBirth} onChange={(value) => set("dateOfBirth", value)} />
              <Select label="Gender" value={form.gender} options={["", "Male", "Female", "Other"]} onChange={(value) => set("gender", value)} />
              <Select label="Blood Group" value={form.bloodGroup} options={["", "A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]} onChange={(value) => set("bloodGroup", value)} />
              <Field label="Religion" value={form.religion} onChange={(value) => set("religion", value)} />
              <Field label="Nationality" value={form.nationality} onChange={(value) => set("nationality", value)} />
              <Field label="CNIC/B-Form" value={form.cnicBForm} onChange={(value) => set("cnicBForm", value)} />
            </div>
          </div>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Address" value={form.address} onChange={(value) => set("address", value)} />
            <Field label="Previous School" value={form.previousSchool} onChange={(value) => set("previousSchool", value)} />
            <Field label="Medical Notes" value={form.medicalNotes} onChange={(value) => set("medicalNotes", value)} />
            <Field label="Emergency Contact" value={form.emergencyContact} onChange={(value) => set("emergencyContact", value)} />
          </div>
        </section>

        <section className="rounded-xl border border-light-border bg-light-card p-5 dark:border-dark-border dark:bg-dark-card">
          <h2 className="mb-4 text-sm font-semibold text-light-text-primary dark:text-dark-text-primary">
            Parent and Guardian Information
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Field label="Parent Name" value={form.parentName} error={errors.parentName} onChange={(value) => set("parentName", value)} />
            <Select label="Relation" value={form.parentRelation} options={["Father", "Mother", "Guardian"]} onChange={(value) => set("parentRelation", value)} />
            <Field label="Parent Phone" value={form.parentPhone} error={errors.parentPhone} onChange={(value) => set("parentPhone", value)} />
            <Field label="Parent Email" type="email" value={form.parentEmail} onChange={(value) => set("parentEmail", value)} />
            <Field label="Parent CNIC" value={form.parentCnic} onChange={(value) => set("parentCnic", value)} />
            <Field label="Occupation" value={form.parentOccupation} onChange={(value) => set("parentOccupation", value)} />
            <Field label="Guardian Name" value={form.guardianName} onChange={(value) => set("guardianName", value)} />
            <Field label="Guardian Phone" value={form.guardianPhone} onChange={(value) => set("guardianPhone", value)} />
          </div>
        </section>

        <section className="rounded-xl border border-light-border bg-light-card p-5 dark:border-dark-border dark:bg-dark-card">
          <h2 className="mb-4 text-sm font-semibold text-light-text-primary dark:text-dark-text-primary">
            Class and Admission Information
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Field label="Class ID" value={form.classId} error={errors.classId} onChange={(value) => set("classId", value)} />
            <Field label="Section ID" value={form.sectionId} error={errors.sectionId} onChange={(value) => set("sectionId", value)} />
            <Field label="Admission Date" type="date" value={form.admissionDate} onChange={(value) => set("admissionDate", value)} />
            <Field label="Academic Year" value={form.academicYear} placeholder="2025-2026" onChange={(value) => set("academicYear", value)} />
          </div>
          <div className="mt-4 flex flex-wrap gap-4">
            <Checkbox label="Transport Required" checked={form.transportRequired} onChange={(value) => set("transportRequired", value)} />
            <Checkbox label="Hostel Required" checked={form.hostelRequired} onChange={(value) => set("hostelRequired", value)} />
          </div>
        </section>

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={() => setForm(initialForm)}
            className="rounded-lg border border-light-border px-4 py-2 text-sm font-medium text-light-text-secondary hover:bg-light-hover dark:border-dark-border dark:text-dark-text-secondary dark:hover:bg-dark-hover"
          >
            Clear
          </button>
          <button
            type="submit"
            disabled={isSaving}
            className="flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-hover disabled:opacity-70"
          >
            {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            Save Admission
          </button>
        </div>
      </form>
    </div>
  );
}

function Field({ label, value, onChange, type = "text", error, placeholder }) {
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
        className={`mt-1 w-full rounded-lg border bg-light-bg px-3 py-2 text-sm text-light-text-primary outline-none focus:border-accent dark:bg-dark-bg dark:text-dark-text-primary ${
          error ? "border-danger" : "border-light-border dark:border-dark-border"
        }`}
      />
      {error && <span className="mt-1 block text-xs text-danger">{error}</span>}
    </label>
  );
}

function Select({ label, value, options, onChange }) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-light-text-secondary dark:text-dark-text-secondary">
        {label}
      </span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-1 w-full rounded-lg border border-light-border bg-light-bg px-3 py-2 text-sm text-light-text-primary outline-none focus:border-accent dark:border-dark-border dark:bg-dark-bg dark:text-dark-text-primary"
      >
        {options.map((option) => (
          <option key={option || "blank"} value={option}>
            {option || "Select"}
          </option>
        ))}
      </select>
    </label>
  );
}

function Checkbox({ label, checked, onChange }) {
  return (
    <label className="flex items-center gap-2 text-sm text-light-text-secondary dark:text-dark-text-secondary">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="h-4 w-4 accent-gray-700"
      />
      {label}
    </label>
  );
}

export default AddStudent;
