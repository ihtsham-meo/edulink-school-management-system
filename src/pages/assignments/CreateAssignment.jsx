import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Plus,
  Trash2,
  Upload,
  X,
  FileText,
  Eye,
  Loader2,
  GripVertical,
  Check,
  AlertCircle,
  Paperclip,
} from "lucide-react";
import PageHeader from "../../components/common/PageHeader";

// ── Constants ─────────────────────────────────────────────────────────────────
const SUBJECTS    = ["Mathematics","English","Physics","Chemistry","Biology","Computer","Urdu","Islamiat","History","Geography"];
const CLASSES     = ["6-A","6-B","7-A","7-B","8-A","8-B","9-A","9-B","10-A","10-B","11-A","11-B","12-A","12-B"];
const TEACHERS    = ["Ms. Fatima Zahra","Mr. Kamran Iqbal","Ms. Sana Pervez","Mr. Bilal Hassan","Ms. Rabia Nawaz"];

const INITIAL_RUBRIC = [
  { id: 1, criterion: "Content Accuracy",  weightage: 40, description: "Correctness and depth of the answer" },
  { id: 2, criterion: "Presentation",      weightage: 30, description: "Neatness and structure" },
  { id: 3, criterion: "Originality",       weightage: 30, description: "Creative and own thinking" },
];

// ── Helper: form field ────────────────────────────────────────────────────────
function FF({ label, error, required, children }) {
  return (
    <div>
      <label className="block text-xs font-medium text-light-text-secondary dark:text-dark-text-secondary mb-1">
        {label}{required && <span className="text-danger ml-0.5">*</span>}
      </label>
      {children}
      {error && (
        <p className="mt-1 text-xs text-danger flex items-center gap-1">
          <AlertCircle size={11} />{error}
        </p>
      )}
    </div>
  );
}

function Input({ value, onChange, type = "text", placeholder, error, className = "" }) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={`w-full rounded-lg border bg-light-bg px-3 py-2 text-sm text-light-text-primary outline-none transition-colors placeholder:text-light-text-tertiary focus:border-accent dark:bg-dark-bg dark:text-dark-text-primary dark:placeholder:text-dark-text-tertiary ${
        error ? "border-danger" : "border-light-border dark:border-dark-border"
      } ${className}`}
    />
  );
}

function Select({ value, onChange, options, placeholder, error }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`w-full rounded-lg border bg-light-bg px-3 py-2 text-sm text-light-text-primary outline-none transition-colors focus:border-accent dark:bg-dark-bg dark:text-dark-text-primary ${
        error ? "border-danger" : "border-light-border dark:border-dark-border"
      }`}
    >
      {placeholder && <option value="">{placeholder}</option>}
      {options.map((o) => (
        <option key={o} value={o}>{o}</option>
      ))}
    </select>
  );
}

// ── Section wrapper ───────────────────────────────────────────────────────────
function Section({ title, subtitle, children }) {
  return (
    <div className="bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl overflow-hidden">
      <div className="px-5 py-4 border-b border-light-border dark:border-dark-border">
        <h3 className="text-sm font-semibold text-light-text-primary dark:text-dark-text-primary">{title}</h3>
        {subtitle && <p className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary mt-0.5">{subtitle}</p>}
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

// ── Preview Modal ─────────────────────────────────────────────────────────────
function PreviewModal({ form, rubric, files, onClose }) {
  const totalWeight = rubric.reduce((s, r) => s + Number(r.weightage), 0);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-xl border border-light-border bg-light-card shadow-xl dark:border-dark-border dark:bg-dark-card">
        <div className="flex items-center justify-between border-b border-light-border px-5 py-4 dark:border-dark-border sticky top-0 bg-light-card dark:bg-dark-card">
          <h2 className="text-sm font-semibold text-light-text-primary dark:text-dark-text-primary">Assignment Preview</h2>
          <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-lg text-light-text-tertiary hover:bg-light-hover dark:text-dark-text-tertiary dark:hover:bg-dark-hover"><X size={16} /></button>
        </div>
        <div className="p-5 flex flex-col gap-5">
          {/* Title block */}
          <div>
            <h1 className="text-lg font-bold text-light-text-primary dark:text-dark-text-primary">{form.title || "Untitled Assignment"}</h1>
            <div className="flex flex-wrap gap-3 mt-2 text-xs text-light-text-tertiary dark:text-dark-text-tertiary">
              <span>Subject: <strong>{form.subject}</strong></span>
              <span>Class: <strong>{form.class}</strong></span>
              <span>Teacher: <strong>{form.teacher}</strong></span>
              <span>Deadline: <strong>{form.deadline}</strong></span>
              <span>Marks: <strong>{form.totalMarks}</strong></span>
            </div>
          </div>
          {/* Instructions */}
          {form.description && (
            <div>
              <p className="text-xs font-medium text-light-text-tertiary dark:text-dark-text-tertiary mb-1 uppercase tracking-wide">Instructions</p>
              <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary whitespace-pre-wrap">{form.description}</p>
            </div>
          )}
          {/* Files */}
          {files.length > 0 && (
            <div>
              <p className="text-xs font-medium text-light-text-tertiary dark:text-dark-text-tertiary mb-2 uppercase tracking-wide">Attachments ({files.length})</p>
              <div className="flex flex-col gap-1.5">
                {files.map((f, i) => (
                  <div key={i} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-light-hover dark:bg-dark-hover text-sm text-light-text-secondary dark:text-dark-text-secondary">
                    <Paperclip size={13} className="text-light-text-tertiary dark:text-dark-text-tertiary shrink-0" />
                    {f.name}
                    <span className="ml-auto text-xs text-light-text-tertiary dark:text-dark-text-tertiary">{(f.size / 1024).toFixed(1)} KB</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          {/* Rubric */}
          {rubric.length > 0 && (
            <div>
              <p className="text-xs font-medium text-light-text-tertiary dark:text-dark-text-tertiary mb-2 uppercase tracking-wide">Grading Rubric</p>
              <div className="flex flex-col gap-2">
                {rubric.map((r) => (
                  <div key={r.id} className="flex items-center gap-3 p-3 rounded-lg bg-light-hover dark:bg-dark-hover">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-light-text-primary dark:text-dark-text-primary">{r.criterion}</p>
                      {r.description && <p className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary">{r.description}</p>}
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-bold text-accent">{r.weightage}%</p>
                      <p className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary">{Math.round((r.weightage / 100) * form.totalMarks)} marks</p>
                    </div>
                  </div>
                ))}
                <div className="flex justify-between px-3 pt-2 border-t border-light-border dark:border-dark-border">
                  <span className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary">Total weightage</span>
                  <span className={`text-xs font-bold ${totalWeight === 100 ? "text-green-600 dark:text-green-400" : "text-red-500"}`}>{totalWeight}%</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
function CreateAssignment() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "", subject: "Mathematics", class: "9-A", teacher: TEACHERS[0],
    deadline: "", totalMarks: "", description: "", allowLate: false,
  });
  const [errors, setErrors]   = useState({});
  const [rubric, setRubric]   = useState(INITIAL_RUBRIC);
  const [files, setFiles]     = useState([]);
  const [dragOver, setDragOver] = useState(false);
  const [preview, setPreview] = useState(false);
  const [saving, setSaving]   = useState(false);
  const [saved, setSaved]     = useState(false);
  const fileRef = useRef(null);

  const set = (f, v) => { setForm((p) => ({ ...p, [f]: v })); setErrors((p) => ({ ...p, [f]: "" })); };

  // ── File handling ───────────────────────────────────────────────────────────
  const addFiles = (newFiles) => {
    const arr = Array.from(newFiles).filter((f) => !files.find((e) => e.name === f.name));
    setFiles((p) => [...p, ...arr]);
  };
  const removeFile = (name) => setFiles((p) => p.filter((f) => f.name !== name));
  const onDrop = (e) => { e.preventDefault(); setDragOver(false); addFiles(e.dataTransfer.files); };

  // ── Rubric ──────────────────────────────────────────────────────────────────
  const totalWeight = rubric.reduce((s, r) => s + Number(r.weightage || 0), 0);

  const addCriterion = () => setRubric((p) => [...p, { id: Date.now(), criterion: "", weightage: 0, description: "" }]);
  const removeCriterion = (id) => setRubric((p) => p.filter((r) => r.id !== id));
  const updateCriterion = (id, field, val) => setRubric((p) => p.map((r) => r.id === id ? { ...r, [field]: field === "weightage" ? Number(val) : val } : r));

  // ── Validation ──────────────────────────────────────────────────────────────
  const validate = () => {
    const e = {};
    if (!form.title.trim())    e.title    = "Title is required";
    if (!form.deadline)        e.deadline = "Deadline is required";
    if (!form.totalMarks || Number(form.totalMarks) < 1) e.totalMarks = "Total marks required";
    if (rubric.length > 0 && totalWeight !== 100) e.rubric = `Rubric weightage must total 100% (currently ${totalWeight}%)`;
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // ── Submit ──────────────────────────────────────────────────────────────────
  const handlePublish = () => {
    if (!validate()) return;
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setSaved(true);
      setTimeout(() => navigate(-1), 1200);
    }, 800);
  };

  const handleDraft = () => {
    setSaving(true);
    setTimeout(() => { setSaving(false); setSaved(true); setTimeout(() => navigate(-1), 1000); }, 600);
  };

  if (saved) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-24">
        <div className="w-16 h-16 bg-green-100 dark:bg-green-950 rounded-full flex items-center justify-center">
          <Check size={30} className="text-green-600 dark:text-green-400" />
        </div>
        <p className="text-base font-semibold text-light-text-primary dark:text-dark-text-primary">Assignment Published!</p>
        <p className="text-sm text-light-text-tertiary dark:text-dark-text-tertiary">Redirecting back…</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Create Assignment"
        subtitle="Fill in details, attach files, and build a grading rubric"
        action={
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg border border-light-border dark:border-dark-border bg-light-card dark:bg-dark-card text-sm text-light-text-secondary dark:text-dark-text-secondary hover:bg-light-hover dark:hover:bg-dark-hover transition-colors"
            >
              <ArrowLeft size={15} /> Back
            </button>
            <button
              onClick={() => { setPreview(true); }}
              className="flex items-center gap-2 px-3 py-2 rounded-lg border border-light-border dark:border-dark-border bg-light-card dark:bg-dark-card text-sm text-light-text-secondary dark:text-dark-text-secondary hover:bg-light-hover dark:hover:bg-dark-hover transition-colors"
            >
              <Eye size={15} /> Preview
            </button>
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ── Left column (main form) ── */}
        <div className="lg:col-span-2 flex flex-col gap-5">

          {/* Basic details */}
          <Section title="Assignment Details" subtitle="Fill in the basic information">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <FF label="Assignment Title" error={errors.title} required>
                  <Input value={form.title} onChange={(v) => set("title", v)} placeholder="e.g. Chapter 5 — Algebra Worksheet" error={errors.title} />
                </FF>
              </div>
              <FF label="Subject">
                <Select value={form.subject} onChange={(v) => set("subject", v)} options={SUBJECTS} />
              </FF>
              <FF label="Class">
                <Select value={form.class} onChange={(v) => set("class", v)} options={CLASSES} />
              </FF>
              <FF label="Assigned Teacher">
                <Select value={form.teacher} onChange={(v) => set("teacher", v)} options={TEACHERS} />
              </FF>
              <FF label="Deadline" error={errors.deadline} required>
                <Input type="date" value={form.deadline} onChange={(v) => set("deadline", v)} error={errors.deadline} />
              </FF>
              <FF label="Total Marks" error={errors.totalMarks} required>
                <Input type="number" value={form.totalMarks} onChange={(v) => set("totalMarks", v)} placeholder="20" error={errors.totalMarks} />
              </FF>
              <FF label="Late Submission">
                <div className="flex items-center gap-2 mt-1">
                  <button
                    type="button"
                    onClick={() => set("allowLate", !form.allowLate)}
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${form.allowLate ? "bg-accent" : "bg-light-border dark:bg-dark-border"}`}
                  >
                    <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${form.allowLate ? "translate-x-4" : "translate-x-1"}`} />
                  </button>
                  <span className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                    {form.allowLate ? "Allowed" : "Not allowed"}
                  </span>
                </div>
              </FF>
              <div className="sm:col-span-2">
                <FF label="Instructions / Description">
                  <textarea
                    rows={4}
                    value={form.description}
                    onChange={(e) => set("description", e.target.value)}
                    placeholder="Write clear instructions for students..."
                    className="w-full rounded-lg border border-light-border bg-light-bg px-3 py-2 text-sm text-light-text-primary outline-none transition-colors placeholder:text-light-text-tertiary focus:border-accent dark:border-dark-border dark:bg-dark-bg dark:text-dark-text-primary resize-none"
                  />
                </FF>
              </div>
            </div>
          </Section>

          {/* File upload */}
          <Section title="Attachments" subtitle="Upload worksheets, PDFs, or reference files">
            {/* Drop zone */}
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={onDrop}
              onClick={() => fileRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center gap-3 cursor-pointer transition-colors ${
                dragOver ? "border-accent bg-accent/5" : "border-light-border dark:border-dark-border hover:border-accent/50 hover:bg-light-hover dark:hover:bg-dark-hover"
              }`}
            >
              <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center">
                <Upload size={20} className="text-accent" />
              </div>
              <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary text-center">
                Drag & drop files here, or <span className="text-accent font-medium">browse</span>
              </p>
              <p className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary">PDF, Word, Images supported</p>
              <input ref={fileRef} type="file" multiple className="hidden" onChange={(e) => addFiles(e.target.files)} />
            </div>

            {/* File list */}
            {files.length > 0 && (
              <div className="flex flex-col gap-2 mt-3">
                {files.map((f) => (
                  <div key={f.name} className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-light-hover dark:bg-dark-hover border border-light-border dark:border-dark-border">
                    <FileText size={15} className="text-accent shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-light-text-primary dark:text-dark-text-primary truncate">{f.name}</p>
                      <p className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary">{(f.size / 1024).toFixed(1)} KB</p>
                    </div>
                    <button onClick={() => removeFile(f.name)} className="flex h-6 w-6 items-center justify-center rounded-md text-light-text-tertiary hover:bg-red-50 dark:hover:bg-red-950 hover:text-red-500 transition-colors">
                      <X size={13} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </Section>

          {/* Rubric builder */}
          <Section title="Grading Rubric" subtitle="Define marking criteria with weightage sliders">
            {errors.rubric && (
              <div className="mb-3 flex items-center gap-2 rounded-lg border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/40 px-3 py-2 text-xs text-red-600 dark:text-red-400">
                <AlertCircle size={13} /> {errors.rubric}
              </div>
            )}

            {rubric.length === 0 ? (
              <p className="text-sm text-light-text-tertiary dark:text-dark-text-tertiary text-center py-4">No criteria yet. Add one below.</p>
            ) : (
              <div className="flex flex-col gap-3 mb-3">
                {rubric.map((r, idx) => (
                  <div key={r.id} className="rounded-xl border border-light-border dark:border-dark-border p-4 bg-light-hover dark:bg-dark-hover">
                    <div className="flex items-start gap-3">
                      <GripVertical size={16} className="mt-2 text-light-text-tertiary dark:text-dark-text-tertiary cursor-grab shrink-0" />
                      <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <input
                          value={r.criterion}
                          onChange={(e) => updateCriterion(r.id, "criterion", e.target.value)}
                          placeholder="Criterion name"
                          className="rounded-lg border border-light-border dark:border-dark-border bg-light-bg dark:bg-dark-bg px-3 py-2 text-sm text-light-text-primary dark:text-dark-text-primary outline-none focus:border-accent transition-colors"
                        />
                        <input
                          value={r.description}
                          onChange={(e) => updateCriterion(r.id, "description", e.target.value)}
                          placeholder="Short description (optional)"
                          className="rounded-lg border border-light-border dark:border-dark-border bg-light-bg dark:bg-dark-bg px-3 py-2 text-sm text-light-text-primary dark:text-dark-text-primary outline-none focus:border-accent transition-colors"
                        />
                        <div className="sm:col-span-2">
                          <div className="flex items-center gap-3">
                            <span className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary w-20 shrink-0">Weightage</span>
                            <input
                              type="range" min="0" max="100" step="5"
                              value={r.weightage}
                              onChange={(e) => updateCriterion(r.id, "weightage", e.target.value)}
                              className="flex-1 accent-accent"
                            />
                            <span className="text-sm font-bold text-accent w-12 text-right">{r.weightage}%</span>
                            {form.totalMarks && (
                              <span className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary w-16 text-right">
                                {Math.round((r.weightage / 100) * Number(form.totalMarks))} marks
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <button onClick={() => removeCriterion(r.id)} className="mt-1 flex h-7 w-7 items-center justify-center rounded-lg text-light-text-tertiary hover:bg-red-50 dark:hover:bg-red-950 hover:text-red-500 transition-colors shrink-0">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Total weightage indicator */}
            {rubric.length > 0 && (
              <div className="flex items-center gap-3 mb-3 px-1">
                <div className="flex-1 bg-light-border dark:bg-dark-border rounded-full h-1.5">
                  <div
                    className={`h-1.5 rounded-full transition-all ${totalWeight > 100 ? "bg-red-500" : totalWeight === 100 ? "bg-green-500" : "bg-accent"}`}
                    style={{ width: `${Math.min(totalWeight, 100)}%` }}
                  />
                </div>
                <span className={`text-xs font-bold w-12 text-right ${totalWeight === 100 ? "text-green-600 dark:text-green-400" : totalWeight > 100 ? "text-red-500" : "text-light-text-tertiary dark:text-dark-text-tertiary"}`}>
                  {totalWeight}%
                </span>
              </div>
            )}

            <button
              onClick={addCriterion}
              className="flex items-center gap-2 text-sm text-accent hover:text-accent-hover font-medium transition-colors"
            >
              <Plus size={15} /> Add Criterion
            </button>
          </Section>
        </div>

        {/* ── Right column (summary + actions) ── */}
        <div className="flex flex-col gap-4">
          <div className="bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl p-5 sticky top-4">
            <h3 className="text-sm font-semibold text-light-text-primary dark:text-dark-text-primary mb-4">Summary</h3>

            <div className="flex flex-col gap-3 mb-5">
              {[
                { label: "Subject",   value: form.subject },
                { label: "Class",     value: form.class },
                { label: "Teacher",   value: form.teacher },
                { label: "Deadline",  value: form.deadline || "—" },
                { label: "Marks",     value: form.totalMarks || "—" },
                { label: "Files",     value: `${files.length} attached` },
                { label: "Criteria",  value: `${rubric.length} defined` },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between text-sm">
                  <span className="text-light-text-tertiary dark:text-dark-text-tertiary">{label}</span>
                  <span className="font-medium text-light-text-primary dark:text-dark-text-primary truncate max-w-[60%] text-right">{value}</span>
                </div>
              ))}
            </div>

            {/* Rubric weight check */}
            {rubric.length > 0 && (
              <div className={`flex items-center gap-2 px-3 py-2 rounded-lg mb-4 text-xs ${
                totalWeight === 100
                  ? "bg-green-50 dark:bg-green-950/40 text-green-700 dark:text-green-400"
                  : "bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400"
              }`}>
                {totalWeight === 100
                  ? <><Check size={13} /> Rubric weightage is correct</>
                  : <><AlertCircle size={13} /> Rubric total: {totalWeight}% (need 100%)</>
                }
              </div>
            )}

            <div className="flex flex-col gap-2">
              <button
                onClick={handlePublish}
                disabled={saving}
                className="flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-accent hover:bg-accent-hover text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {saving ? <Loader2 size={15} className="animate-spin" /> : <Check size={15} />}
                Publish Assignment
              </button>
              <button
                onClick={handleDraft}
                disabled={saving}
                className="flex items-center justify-center gap-2 w-full px-4 py-2.5 border border-light-border dark:border-dark-border bg-light-card dark:bg-dark-card text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary hover:bg-light-hover dark:hover:bg-dark-hover rounded-lg transition-colors disabled:opacity-70"
              >
                Save as Draft
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Preview modal */}
      {preview && (
        <PreviewModal form={form} rubric={rubric} files={files} onClose={() => setPreview(false)} />
      )}
    </div>
  );
}

export default CreateAssignment;