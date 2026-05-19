import { useEffect, useState } from "react";
import {
  Settings,
  MessageCircle,
  BookOpen,
  Zap,
  Save,
  AlertCircle,
} from "lucide-react";
import PageHeader from "../../components/common/PageHeader";
import { settingsService } from "../../services/settingsService";

const tabs = [
  { id: "general", label: "General", icon: Settings },
  { id: "whatsapp", label: "WhatsApp", icon: MessageCircle },
  { id: "exam", label: "Exam", icon: BookOpen },
  { id: "automation", label: "Automation", icon: Zap },
];

function InputField({ label, type = "text", value, onChange, placeholder }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-light-text-primary dark:text-dark-text-primary">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full px-4 py-2.5 rounded-lg bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border text-light-text-primary dark:text-dark-text-primary placeholder:text-light-text-tertiary dark:placeholder:text-dark-text-tertiary text-sm outline-none focus:border-accent transition-colors"
      />
    </div>
  );
}

function SelectField({ label, value, onChange, options }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-light-text-primary dark:text-dark-text-primary">
        {label}
      </label>
      <select
        value={value}
        onChange={onChange}
        className="w-full px-4 py-2.5 rounded-lg bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border text-light-text-primary dark:text-dark-text-primary text-sm outline-none focus:border-accent transition-colors"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function ToggleField({ label, subtitle, value, onChange }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-light-border dark:border-dark-border last:border-0">
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
        onClick={() => onChange(!value)}
        className={`w-11 h-6 rounded-full transition-colors relative shrink-0 ${
          value ? "bg-accent" : "bg-light-border dark:bg-dark-border"
        }`}
      >
        <div
          className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${
            value ? "left-6" : "left-1"
          }`}
        />
      </button>
    </div>
  );
}

function SectionCard({ title, children }) {
  return (
    <div className="bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl p-6">
      <h3 className="text-sm font-semibold text-light-text-primary dark:text-dark-text-primary mb-5">
        {title}
      </h3>
      {children}
    </div>
  );
}

function GeneralTab({ form, onChange }) {
  const set = (key, val) => onChange((prev) => ({ ...prev, [key]: val }));

  return (
    <div className="flex flex-col gap-5">
      <SectionCard title="School Information">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InputField
            label="School Name"
            value={form.schoolName}
            onChange={(e) => set("schoolName", e.target.value)}
            placeholder="Enter school name"
          />
          <InputField
            label="Email Address"
            type="email"
            value={form.schoolEmail}
            onChange={(e) => set("schoolEmail", e.target.value)}
            placeholder="info@school.com"
          />
          <InputField
            label="Phone Number"
            value={form.phone}
            onChange={(e) => set("phone", e.target.value)}
            placeholder="042-XXXXXXXX"
          />
          <InputField
            label="Address"
            value={form.address}
            onChange={(e) => set("address", e.target.value)}
            placeholder="School address"
          />
        </div>
      </SectionCard>

      <SectionCard title="System Configuration">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <SelectField
            label="Institution Type"
            value={form.institutionType}
            onChange={(e) => set("institutionType", e.target.value)}
            options={[
              { value: "school", label: "School" },
              { value: "college", label: "College" },
              { value: "academy", label: "Academy" },
              { value: "institute", label: "Institute" },
            ]}
          />
          <InputField
            label="Running Session"
            value={form.session}
            onChange={(e) => set("session", e.target.value)}
            placeholder="2025-2026"
          />
          <SelectField
            label="Currency"
            value={form.currency}
            onChange={(e) => set("currency", e.target.value)}
            options={[
              { value: "PKR", label: "PKR - Pakistani Rupee" },
              { value: "USD", label: "USD - US Dollar" },
              { value: "GBP", label: "GBP - British Pound" },
            ]}
          />
          <InputField
            label="Roll ID Start Sequence"
            type="number"
            value={form.rollSequence}
            onChange={(e) => set("rollSequence", e.target.value)}
            placeholder="1"
          />
        </div>
      </SectionCard>
    </div>
  );
}

const defaultGeneralForm = {
    schoolName: "",
    schoolEmail: "",
    phone: "",
    address: "",
    currency: "PKR",
    session: "",
    institutionType: "school",
    rollSequence: "1",
};

function WhatsAppTab() {
  const [form, setForm] = useState({
    apiToken: "",
    phoneNumber: "",
    method: "qr",
  });
  const [templates, setTemplates] = useState({
    admission: true,
    feeReminder: true,
    absent: true,
    examMarks: true,
    salary: false,
    diary: true,
  });

  const set = (key, val) => setForm((prev) => ({ ...prev, [key]: val }));
  const setTpl = (key, val) =>
    setTemplates((prev) => ({ ...prev, [key]: val }));

  return (
    <div className="flex flex-col gap-5">
      <SectionCard title="WhatsApp API Configuration">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InputField
            label="API Token"
            value={form.apiToken}
            onChange={(e) => set("apiToken", e.target.value)}
            placeholder="Enter WhatsApp API token"
          />
          <InputField
            label="Phone Number"
            value={form.phoneNumber}
            onChange={(e) => set("phoneNumber", e.target.value)}
            placeholder="e.g. 923001234567"
          />
          <SelectField
            label="Connection Method"
            value={form.method}
            onChange={(e) => set("method", e.target.value)}
            options={[
              { value: "qr", label: "QR Code" },
              { value: "pairing", label: "Pairing Code" },
            ]}
          />
        </div>
        <button className="mt-4 px-4 py-2 bg-green-500 hover:bg-green-600 text-white text-sm font-medium rounded-lg transition-colors">
          Connect WhatsApp
        </button>
      </SectionCard>

      <SectionCard title="Message Templates">
        <ToggleField
          label="Admission notification"
          subtitle="Send WhatsApp on new student admission"
          value={templates.admission}
          onChange={(v) => setTpl("admission", v)}
        />
        <ToggleField
          label="Fee reminder"
          subtitle="Send reminders for pending fee"
          value={templates.feeReminder}
          onChange={(v) => setTpl("feeReminder", v)}
        />
        <ToggleField
          label="Absent notification"
          subtitle="Notify parents when student is absent"
          value={templates.absent}
          onChange={(v) => setTpl("absent", v)}
        />
        <ToggleField
          label="Exam marks"
          subtitle="Send marks to parents after result"
          value={templates.examMarks}
          onChange={(v) => setTpl("examMarks", v)}
        />
        <ToggleField
          label="Salary slip"
          subtitle="Send salary slip to staff"
          value={templates.salary}
          onChange={(v) => setTpl("salary", v)}
        />
        <ToggleField
          label="Homework diary"
          subtitle="Send daily diary to parents"
          value={templates.diary}
          onChange={(v) => setTpl("diary", v)}
        />
      </SectionCard>
    </div>
  );
}

function ExamTab() {
  const [form, setForm] = useState({
    admitCardNote: "Please bring this admit card to the examination hall.",
    passFail: "any_subject",
  });
  const set = (key, val) => setForm((prev) => ({ ...prev, [key]: val }));

  return (
    <div className="flex flex-col gap-5">
      <SectionCard title="Exam Configuration">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-light-text-primary dark:text-dark-text-primary">
              Admit Card Note
            </label>
            <textarea
              value={form.admitCardNote}
              onChange={(e) => set("admitCardNote", e.target.value)}
              rows={3}
              className="w-full px-4 py-2.5 rounded-lg bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border text-light-text-primary dark:text-dark-text-primary text-sm outline-none focus:border-accent transition-colors resize-none"
            />
          </div>
          <SelectField
            label="Pass / Fail Rule"
            value={form.passFail}
            onChange={(e) => set("passFail", e.target.value)}
            options={[
              { value: "any_subject", label: "Fail in any subject" },
              { value: "total_marks", label: "Less than total passing marks" },
            ]}
          />
        </div>
      </SectionCard>
    </div>
  );
}

function AutomationTab() {
  const [settings, setSettings] = useState({
    autoFee: true,
    autoBackup: true,
    birthdayWish: true,
    feeGenDay: "1",
    dueDate: "10",
    lateFee: "100",
  });

  const set = (key, val) => setSettings((prev) => ({ ...prev, [key]: val }));

  return (
    <div className="flex flex-col gap-5">
      <SectionCard title="Automation Toggles">
        <ToggleField
          label="Auto fee generation"
          subtitle="Automatically generate monthly fee"
          value={settings.autoFee}
          onChange={(v) => set("autoFee", v)}
        />
        <ToggleField
          label="Auto database backup"
          subtitle="Backup database daily automatically"
          value={settings.autoBackup}
          onChange={(v) => set("autoBackup", v)}
        />
        <ToggleField
          label="Birthday wishes"
          subtitle="Auto send birthday wishes via WhatsApp"
          value={settings.birthdayWish}
          onChange={(v) => set("birthdayWish", v)}
        />
      </SectionCard>

      <SectionCard title="Fee Automation Settings">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <SelectField
            label="Fee Generation Day"
            value={settings.feeGenDay}
            onChange={(e) => set("feeGenDay", e.target.value)}
            options={Array.from({ length: 10 }, (_, i) => ({
              value: String(i + 1),
              label: `${i + 1} of every month`,
            }))}
          />
          <SelectField
            label="Due Date"
            value={settings.dueDate}
            onChange={(e) => set("dueDate", e.target.value)}
            options={Array.from({ length: 15 }, (_, i) => ({
              value: String(i + 1),
              label: `${i + 1} of every month`,
            }))}
          />
          <InputField
            label="Late Fee Amount (Rs)"
            type="number"
            value={settings.lateFee}
            onChange={(e) => set("lateFee", e.target.value)}
            placeholder="100"
          />
        </div>
      </SectionCard>
    </div>
  );
}

function GeneralSettings() {
  const [activeTab, setTab] = useState("general");
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [generalForm, setGeneralForm] = useState(defaultGeneralForm);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await settingsService.getSchoolProfile();
        const profile = response.data?.data || response.data || {};
        setGeneralForm((prev) => ({
          ...prev,
          schoolName: profile.name || profile.school_name || "",
          schoolEmail: profile.email || "",
          phone: profile.phone || "",
          address: profile.address || "",
          institutionType: profile.institution_type || "school",
          currency: profile.currency || "PKR",
          session: profile.session || profile.current_session || "",
          rollSequence: String(profile.roll_sequence || 1),
        }));
      } catch (err) {
        setError(err.response?.data?.message || "Could not load school profile.");
      }
    };

    loadProfile();
  }, []);

  const handleSave = async () => {
    try {
      await settingsService.updateSchoolProfile({
        name: generalForm.schoolName,
        email: generalForm.schoolEmail,
        phone: generalForm.phone,
        address: generalForm.address,
        institution_type: generalForm.institutionType,
        currency: generalForm.currency,
        session: generalForm.session,
        roll_sequence: generalForm.rollSequence,
      });
      setSaved(true);
      setError("");
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Could not save school profile.");
    }
  };

  const renderTab = () => {
    switch (activeTab) {
      case "general":
        return <GeneralTab form={generalForm} onChange={setGeneralForm} />;
      case "whatsapp":
        return <WhatsAppTab />;
      case "exam":
        return <ExamTab />;
      case "automation":
        return <AutomationTab />;
      default:
        return <GeneralTab />;
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <PageHeader
        title="Settings"
        subtitle="Configure your school management system"
        action={
          <button
            onClick={handleSave}
            className={`flex items-center gap-2 px-4 py-2 text-white text-sm font-medium rounded-lg transition-colors ${
              saved ? "bg-green-500" : "bg-accent hover:bg-accent-hover"
            }`}
          >
            <Save size={16} />
            {saved ? "Saved!" : "Save Changes"}
          </button>
        }
      />

      {error && (
        <div className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-300">
          <AlertCircle size={17} className="mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl p-1.5">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors flex-1 justify-center ${
              activeTab === tab.id
                ? "bg-accent text-white"
                : "text-light-text-secondary dark:text-dark-text-secondary hover:bg-light-hover dark:hover:bg-dark-hover"
            }`}
          >
            <tab.icon size={15} />
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab content */}
      {renderTab()}
    </div>
  );
}

export default GeneralSettings;
