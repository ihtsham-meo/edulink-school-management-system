import { useState } from "react";
import {
  User,
  Phone,
  MapPin,
  GraduationCap,
  Banknote,
  CheckCircle,
  ChevronRight,
  ChevronLeft,
  Camera,
  Eye,
  EyeOff,
  Copy,
  Printer,
  UserPlus,
  X,
} from "lucide-react";
import PageHeader from "../../components/common/PageHeader";

const STEPS = [
  { id: 1, label: "Personal Info", icon: User },
  { id: 2, label: "Parent Details", icon: UserPlus },
  { id: 3, label: "Academic Info", icon: GraduationCap },
  { id: 4, label: "Fee Settings", icon: Banknote },
  { id: 5, label: "Review", icon: CheckCircle },
];

const initialForm = {
  // Personal
  firstName: "",
  lastName: "",
  dob: "",
  gender: "",
  religion: "",
  bloodGroup: "",
  cnic: "",
  phone: "",
  mobile: "",
  whatsapp: "",
  email: "",
  address: "",
  city: "",
  photo: null,
  // Parent
  parentName: "",
  parentCnic: "",
  parentPhone: "",
  parentMobile: "",
  parentWhatsapp: "",
  parentEmail: "",
  parentAddress: "",
  profession: "",
  createParentLogin: true,
  // Academic
  campus: "Main Campus",
  class_: "",
  section: "",
  session: "2025-2026",
  rollNo: "",
  grNo: "",
  studentCode: "",
  // Fee
  monthlyFee: "",
  admissionFee: "",
  hasDiscount: false,
  discountAmount: "",
  transport: "none",
  notifyVia: "whatsapp",
};

// ── Reusable field components ──
function Field({ label, required, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-light-text-primary dark:text-dark-text-primary">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
    </div>
  );
}

function Input({ value, onChange, placeholder, type = "text", disabled }) {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      className="w-full px-4 py-2.5 rounded-lg bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border text-light-text-primary dark:text-dark-text-primary placeholder:text-light-text-tertiary dark:placeholder:text-dark-text-tertiary text-sm outline-none focus:border-accent disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
    />
  );
}

function Select({ value, onChange, options, placeholder }) {
  return (
    <select
      value={value}
      onChange={onChange}
      className="w-full px-4 py-2.5 rounded-lg bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border text-light-text-primary dark:text-dark-text-primary text-sm outline-none focus:border-accent transition-colors"
    >
      {placeholder && <option value="">{placeholder}</option>}
      {options.map((o) => (
        <option key={o.value || o} value={o.value || o}>
          {o.label || o}
        </option>
      ))}
    </select>
  );
}

function Toggle({ value, onChange, label, subtitle }) {
  return (
    <div className="flex items-center justify-between py-3 border border-light-border dark:border-dark-border rounded-xl px-4">
      <div>
        <p className="text-sm font-medium text-light-text-primary dark:text-dark-text-primary">
          {label}
        </p>
        {subtitle && (
          <p className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary mt-0.5">
            {subtitle}
          </p>
        )}
      </div>
      <button
        type="button"
        onClick={() => onChange(!value)}
        className={`w-11 h-6 rounded-full transition-colors relative flex-shrink-0 ${value ? "bg-accent" : "bg-light-border dark:bg-dark-border"}`}
      >
        <div
          className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${value ? "left-6" : "left-1"}`}
        />
      </button>
    </div>
  );
}

// ── Step 1: Personal Info ──
function Step1({ form, set }) {
  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-base font-semibold text-light-text-primary dark:text-dark-text-primary">
        Personal Information
      </h2>

      {/* Photo upload */}
      <div className="flex items-start gap-6">
        <div className="flex flex-col items-center gap-2">
          <div className="w-24 h-24 rounded-xl bg-light-bg dark:bg-dark-bg border-2 border-dashed border-light-border dark:border-dark-border flex items-center justify-center overflow-hidden">
            {form.photo ? (
              <img
                src={form.photo}
                alt="Student"
                className="w-full h-full object-cover"
              />
            ) : (
              <User
                size={32}
                className="text-light-text-tertiary dark:text-dark-text-tertiary"
              />
            )}
          </div>
          <div className="flex gap-2">
            <label className="flex items-center gap-1 px-3 py-1.5 bg-accent/10 text-accent text-xs font-medium rounded-lg cursor-pointer hover:bg-accent hover:text-white transition-colors">
              <Camera size={12} />
              Upload
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) set("photo", URL.createObjectURL(file));
                }}
              />
            </label>
            {form.photo && (
              <button
                onClick={() => set("photo", null)}
                className="flex items-center gap-1 px-3 py-1.5 bg-red-50 dark:bg-red-950 text-red-500 text-xs font-medium rounded-lg hover:bg-red-500 hover:text-white transition-colors"
              >
                <X size={12} /> Remove
              </button>
            )}
          </div>
        </div>
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="First Name" required>
            <Input
              value={form.firstName}
              onChange={(e) => set("firstName", e.target.value)}
              placeholder="Ali"
            />
          </Field>
          <Field label="Last Name" required>
            <Input
              value={form.lastName}
              onChange={(e) => set("lastName", e.target.value)}
              placeholder="Hassan"
            />
          </Field>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Field label="Date of Birth" required>
          <Input
            type="date"
            value={form.dob}
            onChange={(e) => set("dob", e.target.value)}
          />
        </Field>
        <Field label="Gender" required>
          <Select
            value={form.gender}
            onChange={(e) => set("gender", e.target.value)}
            placeholder="Select gender"
            options={["Male", "Female"]}
          />
        </Field>
        <Field label="Blood Group">
          <Select
            value={form.bloodGroup}
            onChange={(e) => set("bloodGroup", e.target.value)}
            placeholder="Select"
            options={["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]}
          />
        </Field>
        <Field label="Religion">
          <Input
            value={form.religion}
            onChange={(e) => set("religion", e.target.value)}
            placeholder="Islam"
          />
        </Field>
        <Field label="CNIC / B-Form No">
          <Input
            value={form.cnic}
            onChange={(e) => set("cnic", e.target.value)}
            placeholder="35201-XXXXXXX-X"
          />
        </Field>
        <Field label="Phone">
          <Input
            value={form.phone}
            onChange={(e) => set("phone", e.target.value)}
            placeholder="042-XXXXXXXX"
          />
        </Field>
        <Field label="Mobile" required>
          <Input
            value={form.mobile}
            onChange={(e) => set("mobile", e.target.value)}
            placeholder="03XXXXXXXXX"
          />
        </Field>
        <Field label="WhatsApp">
          <Input
            value={form.whatsapp}
            onChange={(e) => set("whatsapp", e.target.value)}
            placeholder="03XXXXXXXXX"
          />
        </Field>
        <Field label="Email">
          <Input
            type="email"
            value={form.email}
            onChange={(e) => set("email", e.target.value)}
            placeholder="ali@gmail.com"
          />
        </Field>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Address" required>
          <Input
            value={form.address}
            onChange={(e) => set("address", e.target.value)}
            placeholder="House No, Street, Area"
          />
        </Field>
        <Field label="City">
          <Input
            value={form.city}
            onChange={(e) => set("city", e.target.value)}
            placeholder="Lahore"
          />
        </Field>
      </div>
    </div>
  );
}

// ── Step 2: Parent Details ──
function Step2({ form, set }) {
  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-base font-semibold text-light-text-primary dark:text-dark-text-primary">
        Parent / Guardian Details
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Parent / Guardian Name" required>
          <Input
            value={form.parentName}
            onChange={(e) => set("parentName", e.target.value)}
            placeholder="Mr. Hassan Ali"
          />
        </Field>
        <Field label="CNIC" required>
          <Input
            value={form.parentCnic}
            onChange={(e) => set("parentCnic", e.target.value)}
            placeholder="35201-XXXXXXX-X"
          />
        </Field>
        <Field label="Phone">
          <Input
            value={form.parentPhone}
            onChange={(e) => set("parentPhone", e.target.value)}
            placeholder="042-XXXXXXXX"
          />
        </Field>
        <Field label="Mobile" required>
          <Input
            value={form.parentMobile}
            onChange={(e) => set("parentMobile", e.target.value)}
            placeholder="03XXXXXXXXX"
          />
        </Field>
        <Field label="WhatsApp">
          <Input
            value={form.parentWhatsapp}
            onChange={(e) => set("parentWhatsapp", e.target.value)}
            placeholder="03XXXXXXXXX"
          />
        </Field>
        <Field label="Email">
          <Input
            type="email"
            value={form.parentEmail}
            onChange={(e) => set("parentEmail", e.target.value)}
            placeholder="parent@gmail.com"
          />
        </Field>
        <Field label="Profession">
          <Input
            value={form.profession}
            onChange={(e) => set("profession", e.target.value)}
            placeholder="Business / Job"
          />
        </Field>
        <Field label="Address">
          <Input
            value={form.parentAddress}
            onChange={(e) => set("parentAddress", e.target.value)}
            placeholder="Same as student / Different"
          />
        </Field>
      </div>

      <div className="flex flex-col gap-3 mt-2">
        <Toggle
          value={form.createParentLogin}
          onChange={(v) => set("createParentLogin", v)}
          label="Create Parent Portal Login"
          subtitle="Parent will receive login credentials via WhatsApp/Email to access the parent portal"
        />
      </div>
    </div>
  );
}

// ── Step 3: Academic Info ──
function Step3({ form, set }) {
  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-base font-semibold text-light-text-primary dark:text-dark-text-primary">
        Academic Information
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Field label="Campus" required>
          <Select
            value={form.campus}
            onChange={(e) => set("campus", e.target.value)}
            options={["Main Campus", "Branch Campus"]}
          />
        </Field>
        <Field label="Session" required>
          <Select
            value={form.session}
            onChange={(e) => set("session", e.target.value)}
            options={["2024-2025", "2025-2026", "2026-2027"]}
          />
        </Field>
        <Field label="Class" required>
          <Select
            value={form.class_}
            onChange={(e) => set("class_", e.target.value)}
            placeholder="Select class"
            options={[
              "Class 6",
              "Class 7",
              "Class 8",
              "Class 9",
              "Class 10",
              "Class 11",
              "Class 12",
            ]}
          />
        </Field>
        <Field label="Section">
          <Select
            value={form.section}
            onChange={(e) => set("section", e.target.value)}
            placeholder="Select section"
            options={["A", "B", "C", "D"]}
          />
        </Field>
        <Field label="Roll Number">
          <Input
            value={form.rollNo}
            onChange={(e) => set("rollNo", e.target.value)}
            placeholder="Auto-generated"
          />
        </Field>
        <Field label="GR Number">
          <Input
            value={form.grNo}
            onChange={(e) => set("grNo", e.target.value)}
            placeholder="General Register No."
          />
        </Field>
        <Field label="Student Code">
          <Input
            value={form.studentCode}
            disabled
            placeholder="Auto-generated on submit"
          />
        </Field>
      </div>

      {/* Info box */}
      <div className="flex items-start gap-3 px-4 py-3 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-xl">
        <CheckCircle size={16} className="text-blue-500 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-blue-700 dark:text-blue-400">
            Auto-generated on submission
          </p>
          <p className="text-xs text-blue-600 dark:text-blue-400 mt-0.5">
            Student Code, Login credentials, and ID Card will be automatically
            generated after successful admission.
          </p>
        </div>
      </div>
    </div>
  );
}

// ── Step 4: Fee Settings ──
function Step4({ form, set }) {
  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-base font-semibold text-light-text-primary dark:text-dark-text-primary">
        Fee Settings
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Monthly Tuition Fee" required>
          <Input
            type="number"
            value={form.monthlyFee}
            onChange={(e) => set("monthlyFee", e.target.value)}
            placeholder="4500"
          />
        </Field>
        <Field label="Admission Fee">
          <Input
            type="number"
            value={form.admissionFee}
            onChange={(e) => set("admissionFee", e.target.value)}
            placeholder="2000"
          />
        </Field>
      </div>

      <Toggle
        value={form.hasDiscount}
        onChange={(v) => set("hasDiscount", v)}
        label="Apply Discount"
        subtitle="Enable if student is eligible for fee discount or scholarship"
      />

      {form.hasDiscount && (
        <Field label="Discount Amount (Rs)">
          <Input
            type="number"
            value={form.discountAmount}
            onChange={(e) => set("discountAmount", e.target.value)}
            placeholder="500"
          />
        </Field>
      )}

      <Field label="Transport">
        <Select
          value={form.transport}
          onChange={(e) => set("transport", e.target.value)}
          options={[
            { value: "none", label: "No Transport" },
            { value: "route_a", label: "Route A — Model Town (Rs 1,500)" },
            { value: "route_b", label: "Route B — Gulberg (Rs 1,200)" },
            { value: "route_c", label: "Route C — DHA (Rs 2,000)" },
          ]}
        />
      </Field>

      <Field label="Notify Parent via">
        <Select
          value={form.notifyVia}
          onChange={(e) => set("notifyVia", e.target.value)}
          options={[
            { value: "whatsapp", label: "WhatsApp" },
            { value: "email", label: "Email" },
            { value: "both", label: "WhatsApp + Email" },
            { value: "none", label: "Don't Notify" },
          ]}
        />
      </Field>
    </div>
  );
}

// ── Step 5: Review ──
function Step5({ form }) {
  const Section = ({ title, children }) => (
    <div className="bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border rounded-xl p-4">
      <h3 className="text-xs font-semibold text-light-text-tertiary dark:text-dark-text-tertiary uppercase tracking-wide mb-3">
        {title}
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">{children}</div>
    </div>
  );
  const Row = ({ label, value }) => (
    <div>
      <p className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary">
        {label}
      </p>
      <p className="text-sm font-medium text-light-text-primary dark:text-dark-text-primary mt-0.5">
        {value || "—"}
      </p>
    </div>
  );

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-base font-semibold text-light-text-primary dark:text-dark-text-primary">
        Review & Submit
      </h2>

      {/* Student photo + name */}
      <div className="flex items-center gap-4 bg-accent/5 border border-accent/20 rounded-xl p-4">
        <div className="w-16 h-16 rounded-xl bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border flex items-center justify-center overflow-hidden flex-shrink-0">
          {form.photo ? (
            <img
              src={form.photo}
              alt="Student"
              className="w-full h-full object-cover"
            />
          ) : (
            <User
              size={28}
              className="text-light-text-tertiary dark:text-dark-text-tertiary"
            />
          )}
        </div>
        <div>
          <p className="text-base font-semibold text-light-text-primary dark:text-dark-text-primary">
            {form.firstName} {form.lastName}
          </p>
          <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
            {form.class_} {form.section && `— Section ${form.section}`} ·{" "}
            {form.session}
          </p>
          <p className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary mt-0.5">
            {form.campus}
          </p>
        </div>
      </div>

      <Section title="Personal Information">
        <Row label="Date of Birth" value={form.dob} />
        <Row label="Gender" value={form.gender} />
        <Row label="Blood Group" value={form.bloodGroup} />
        <Row label="CNIC / B-Form" value={form.cnic} />
        <Row label="Mobile" value={form.mobile} />
        <Row label="Email" value={form.email} />
        <Row label="Address" value={form.address} />
        <Row label="City" value={form.city} />
      </Section>

      <Section title="Parent / Guardian">
        <Row label="Name" value={form.parentName} />
        <Row label="CNIC" value={form.parentCnic} />
        <Row label="Mobile" value={form.parentMobile} />
        <Row label="Email" value={form.parentEmail} />
        <Row label="Profession" value={form.profession} />
        <Row
          label="Parent Login"
          value={
            form.createParentLogin ? "✅ Will be created" : "❌ Not creating"
          }
        />
      </Section>

      <Section title="Academic Info">
        <Row label="Campus" value={form.campus} />
        <Row label="Class" value={form.class_} />
        <Row label="Section" value={form.section} />
        <Row label="Session" value={form.session} />
        <Row label="Roll No" value={form.rollNo || "Auto"} />
        <Row label="GR No" value={form.grNo} />
      </Section>

      <Section title="Fee Settings">
        <Row
          label="Monthly Fee"
          value={form.monthlyFee ? `Rs ${form.monthlyFee}` : "—"}
        />
        <Row
          label="Admission Fee"
          value={form.admissionFee ? `Rs ${form.admissionFee}` : "—"}
        />
        <Row
          label="Discount"
          value={form.hasDiscount ? `Rs ${form.discountAmount}` : "None"}
        />
        <Row
          label="Transport"
          value={form.transport === "none" ? "None" : form.transport}
        />
        <Row label="Notify via" value={form.notifyVia} />
      </Section>

      <div className="flex items-start gap-3 px-4 py-3 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-xl">
        <CheckCircle
          size={16}
          className="text-green-500 flex-shrink-0 mt-0.5"
        />
        <p className="text-sm text-green-700 dark:text-green-400">
          On submission: Student ID, login credentials, and ID card will be
          auto-generated.
          {form.createParentLogin &&
            " Parent login credentials will also be created."}
        </p>
      </div>
    </div>
  );
}

// ── Success Modal ──
function SuccessModal({ data, onClose }) {
  const [showStudentPass, setShowStudentPass] = useState(false);
  const [showParentPass, setShowParentPass] = useState(false);
  const [copied, setCopied] = useState("");

  const copy = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(""), 2000);
  };

  const CredBox = ({ label, value, copyKey, isPassword, show, onToggle }) => (
    <div className="flex items-center justify-between bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border rounded-lg px-3 py-2">
      <div>
        <p className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary">
          {label}
        </p>
        <p className="text-sm font-medium text-light-text-primary dark:text-dark-text-primary font-mono">
          {isPassword && !show ? "••••••••" : value}
        </p>
      </div>
      <div className="flex gap-1">
        {isPassword && (
          <button
            onClick={onToggle}
            className="w-7 h-7 flex items-center justify-center text-light-text-tertiary dark:text-dark-text-tertiary hover:text-accent transition-colors"
          >
            {show ? <EyeOff size={14} /> : <Eye size={14} />}
          </button>
        )}
        <button
          onClick={() => copy(value, copyKey)}
          className={`w-7 h-7 flex items-center justify-center rounded-md transition-colors ${copied === copyKey ? "text-green-500" : "text-light-text-tertiary dark:text-dark-text-tertiary hover:text-accent"}`}
        >
          {copied === copyKey ? <CheckCircle size={14} /> : <Copy size={14} />}
        </button>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-2xl p-6 w-full max-w-lg">
        {/* Success header */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-16 h-16 bg-green-50 dark:bg-green-950 rounded-full flex items-center justify-center mb-3">
            <CheckCircle size={32} className="text-green-500" />
          </div>
          <h2 className="text-lg font-semibold text-light-text-primary dark:text-dark-text-primary">
            Admission Successful!
          </h2>
          <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary mt-1">
            {data.studentName} has been admitted to {data.class}
          </p>
          <span className="mt-2 text-xs font-mono bg-accent/10 text-accent px-3 py-1 rounded-full">
            Student ID: {data.studentCode}
          </span>
        </div>

        {/* Student credentials */}
        <div className="mb-4">
          <p className="text-xs font-semibold text-light-text-tertiary dark:text-dark-text-tertiary uppercase tracking-wide mb-2">
            Student Login Credentials
          </p>
          <div className="flex flex-col gap-2">
            <CredBox
              label="Email / Username"
              value={data.studentEmail}
              copyKey="se"
            />
            <CredBox
              label="Password"
              value={data.studentPassword}
              copyKey="sp"
              isPassword
              show={showStudentPass}
              onToggle={() => setShowStudentPass((p) => !p)}
            />
          </div>
        </div>

        {/* Parent credentials */}
        {data.parentCredentials && (
          <div className="mb-6">
            <p className="text-xs font-semibold text-light-text-tertiary dark:text-dark-text-tertiary uppercase tracking-wide mb-2">
              Parent Login Credentials
            </p>
            <div className="flex flex-col gap-2">
              <CredBox
                label="Email / Username"
                value={data.parentEmail}
                copyKey="pe"
              />
              <CredBox
                label="Password"
                value={data.parentPassword}
                copyKey="pp"
                isPassword
                show={showParentPass}
                onToggle={() => setShowParentPass((p) => !p)}
              />
            </div>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex gap-3">
          <button className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-accent hover:bg-accent-hover text-white text-sm font-medium rounded-lg transition-colors">
            <Printer size={15} />
            Print Admission Form
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-2.5 bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border text-light-text-secondary dark:text-dark-text-secondary text-sm font-medium rounded-lg hover:bg-light-hover dark:hover:bg-dark-hover transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Component ──
function AdmitStudent() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(initialForm);
  const [showSuccess, setShowSuccess] = useState(false);
  const [admittedData, setAdmittedData] = useState(null);

  const set = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const isStepValid = () => {
    if (step === 1)
      return (
        form.firstName &&
        form.lastName &&
        form.dob &&
        form.gender &&
        form.mobile
      );
    if (step === 2)
      return form.parentName && form.parentCnic && form.parentMobile;
    if (step === 3) return form.class_;
    if (step === 4) return form.monthlyFee;
    return true;
  };

  const handleSubmit = () => {
    const studentCode = `ST${String(Math.floor(Math.random() * 9000) + 1000)}`;
    const studentEmail = `${form.firstName.toLowerCase()}.${studentCode.toLowerCase()}@student.edulink.com`;
    const studentPass = `Edu${Math.floor(Math.random() * 9000) + 1000}`;
    const parentEmail =
      form.parentEmail || `parent.${studentCode.toLowerCase()}@edulink.com`;
    const parentPass = `Par${Math.floor(Math.random() * 9000) + 1000}`;

    setAdmittedData({
      studentName: `${form.firstName} ${form.lastName}`,
      studentCode,
      class: `${form.class_} ${form.section ? `— Section ${form.section}` : ""}`,
      studentEmail,
      studentPassword: studentPass,
      parentCredentials: form.createParentLogin,
      parentEmail,
      parentPassword: parentPass,
    });
    setShowSuccess(true);
  };

  const handleClose = () => {
    setShowSuccess(false);
    setStep(1);
    setForm(initialForm);
  };

  const stepComponents = {
    1: <Step1 form={form} set={set} />,
    2: <Step2 form={form} set={set} />,
    3: <Step3 form={form} set={set} />,
    4: <Step4 form={form} set={set} />,
    5: <Step5 form={form} />,
  };

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Admit New Student"
        subtitle="Fill in the complete admission form"
      />

      {/* Progress steps */}
      <div className="bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl p-4">
        <div className="flex items-center justify-between">
          {STEPS.map((s, i) => {
            const Icon = s.icon;
            const isActive = step === s.id;
            const isDone = step > s.id;
            return (
              <div key={s.id} className="flex items-center flex-1">
                <div className="flex flex-col items-center gap-1.5">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                      isDone
                        ? "bg-green-500 text-white"
                        : isActive
                          ? "bg-accent text-white"
                          : "bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border text-light-text-tertiary dark:text-dark-text-tertiary"
                    }`}
                  >
                    {isDone ? <CheckCircle size={16} /> : <Icon size={16} />}
                  </div>
                  <span
                    className={`text-xs font-medium hidden sm:block ${
                      isActive
                        ? "text-accent"
                        : isDone
                          ? "text-green-600 dark:text-green-400"
                          : "text-light-text-tertiary dark:text-dark-text-tertiary"
                    }`}
                  >
                    {s.label}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div
                    className={`flex-1 h-0.5 mx-2 rounded transition-all ${step > s.id ? "bg-green-500" : "bg-light-border dark:bg-dark-border"}`}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Step content */}
      <div className="bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl p-6">
        {stepComponents[step]}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setStep((prev) => prev - 1)}
          disabled={step === 1}
          className="flex items-center gap-2 px-5 py-2.5 bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border text-light-text-secondary dark:text-dark-text-secondary text-sm font-medium rounded-lg hover:bg-light-hover dark:hover:bg-dark-hover disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft size={16} />
          Previous
        </button>

        <span className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary">
          Step {step} of {STEPS.length}
        </span>

        {step < STEPS.length ? (
          <button
            onClick={() => setStep((prev) => prev + 1)}
            disabled={!isStepValid()}
            className="flex items-center gap-2 px-5 py-2.5 bg-accent hover:bg-accent-hover text-white text-sm font-medium rounded-lg disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Next
            <ChevronRight size={16} />
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            className="flex items-center gap-2 px-6 py-2.5 bg-green-500 hover:bg-green-600 text-white text-sm font-medium rounded-lg transition-colors"
          >
            <CheckCircle size={16} />
            Submit Admission
          </button>
        )}
      </div>

      {/* Success modal */}
      {showSuccess && admittedData && (
        <SuccessModal data={admittedData} onClose={handleClose} />
      )}
    </div>
  );
}

export default AdmitStudent;
