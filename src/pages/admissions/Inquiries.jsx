import { useState, useMemo } from "react";
import {
  Plus,
  X,
  Loader2,
  Phone,
  Mail,
  GraduationCap,
  Search,
  MessageCircle,
  Pencil,
  Trash2,
} from "lucide-react";
import PageHeader from "../../components/common/PageHeader";

// ── Stages ────────────────────────────────────────────────────────────────────
const STAGES = [
  {
    id: "new",
    label: "New",
    color: "bg-blue-500",
    light: "bg-blue-50 dark:bg-blue-950/40",
    border: "border-blue-200 dark:border-blue-800",
  },
  {
    id: "contacted",
    label: "Contacted",
    color: "bg-purple-500",
    light: "bg-purple-50 dark:bg-purple-950/40",
    border: "border-purple-200 dark:border-purple-800",
  },
  {
    id: "interested",
    label: "Interested",
    color: "bg-amber-500",
    light: "bg-amber-50 dark:bg-amber-950/40",
    border: "border-amber-200 dark:border-amber-800",
  },
  {
    id: "test_scheduled",
    label: "Test Scheduled",
    color: "bg-indigo-500",
    light: "bg-indigo-50 dark:bg-indigo-950/40",
    border: "border-indigo-200 dark:border-indigo-800",
  },
  {
    id: "admitted",
    label: "Admitted",
    color: "bg-green-500",
    light: "bg-green-50 dark:bg-green-950/40",
    border: "border-green-200 dark:border-green-800",
  },
  {
    id: "dropped",
    label: "Dropped",
    color: "bg-red-500",
    light: "bg-red-50 dark:bg-red-950/40",
    border: "border-red-200 dark:border-red-800",
  },
];

// ── Mock data ─────────────────────────────────────────────────────────────────
const mockInquiries = [
  {
    id: 1,
    studentName: "Maryam Ilyas",
    fatherName: "Ilyas Khan",
    phone: "03001110001",
    email: "ilyas@gmail.com",
    applyingClass: "Class 8",
    stage: "new",
    note: "Called to inquire about fees and curriculum.",
    date: "2026-05-14",
  },
  {
    id: 2,
    studentName: "Kamil Raza",
    fatherName: "Raza Noor",
    phone: "03011110002",
    email: "razanoor@gmail.com",
    applyingClass: "Class 9",
    stage: "new",
    note: "Wants to visit school.",
    date: "2026-05-14",
  },
  {
    id: 3,
    studentName: "Layla Shah",
    fatherName: "Shah Jahan",
    phone: "03021110003",
    email: "shahjahan@gmail.com",
    applyingClass: "Class 7",
    stage: "contacted",
    note: "Follow up call done. Father is interested.",
    date: "2026-05-13",
  },
  {
    id: 4,
    studentName: "Yusuf Jamil",
    fatherName: "Jamil Ahmad",
    phone: "03031110004",
    email: "jamil.a@gmail.com",
    applyingClass: "Class 10",
    stage: "contacted",
    note: "Shared brochure via WhatsApp.",
    date: "2026-05-13",
  },
  {
    id: 5,
    studentName: "Nadia Bashir",
    fatherName: "Bashir Ahmed",
    phone: "03041110005",
    email: "bashir@gmail.com",
    applyingClass: "Class 8",
    stage: "interested",
    note: "Very interested. Requested admission form.",
    date: "2026-05-12",
  },
  {
    id: 6,
    studentName: "Tariq Mehmood",
    fatherName: "Mehmood Shah",
    phone: "03051110006",
    email: "mshah@gmail.com",
    applyingClass: "Class 11",
    stage: "interested",
    note: "Visited school. Liked the facilities.",
    date: "2026-05-12",
  },
  {
    id: 7,
    studentName: "Rania Qasim",
    fatherName: "Qasim Ali",
    phone: "03061110007",
    email: "qasimali@gmail.com",
    applyingClass: "Class 9",
    stage: "test_scheduled",
    note: "Entry test scheduled for 18 May.",
    date: "2026-05-11",
  },
  {
    id: 8,
    studentName: "Asim Farrukh",
    fatherName: "Farrukh Baig",
    phone: "03071110008",
    email: "fbaig@gmail.com",
    applyingClass: "Class 8",
    stage: "test_scheduled",
    note: "Test on 20 May at 9 AM.",
    date: "2026-05-11",
  },
  {
    id: 9,
    studentName: "Sadia Waheed",
    fatherName: "Waheed Butt",
    phone: "03081110009",
    email: "wbutt@gmail.com",
    applyingClass: "Class 7",
    stage: "admitted",
    note: "Admission confirmed. Fee paid.",
    date: "2026-05-10",
  },
  {
    id: 10,
    studentName: "Faisal Rauf",
    fatherName: "Rauf Ahmad",
    phone: "03091110010",
    email: "rauf.a@gmail.com",
    applyingClass: "Class 10",
    stage: "admitted",
    note: "Documents submitted.",
    date: "2026-05-10",
  },
  {
    id: 11,
    studentName: "Kiran Nasir",
    fatherName: "Nasir Iqbal",
    phone: "03101110011",
    email: "n.iqbal@gmail.com",
    applyingClass: "Class 9",
    stage: "dropped",
    note: "Family moved to another city.",
    date: "2026-05-09",
  },
  {
    id: 12,
    studentName: "Daniyal Arif",
    fatherName: "Arif Hussain",
    phone: "03111110012",
    email: "arif.h@gmail.com",
    applyingClass: "Class 11",
    stage: "new",
    note: "Online inquiry form submitted.",
    date: "2026-05-14",
  },
];

const initialForm = {
  studentName: "",
  fatherName: "",
  phone: "",
  email: "",
  applyingClass: "",
  note: "",
};

// ── Main Component ────────────────────────────────────────────────────────────
function Inquiries() {
  const [inquiries, setInquiries] = useState(mockInquiries);
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(null); // "add" | "edit" | "delete"
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [formErrors, setFormErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [dragId, setDragId] = useState(null);

  // Filtered inquiries
  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    if (!q) return inquiries;
    return inquiries.filter(
      (i) =>
        i.studentName.toLowerCase().includes(q) ||
        i.fatherName.toLowerCase().includes(q) ||
        i.phone.includes(q),
    );
  }, [inquiries, search]);

  // Group by stage
  const grouped = useMemo(() => {
    const map = {};
    STAGES.forEach((s) => {
      map[s.id] = [];
    });
    filtered.forEach((i) => {
      if (map[i.stage]) map[i.stage].push(i);
    });
    return map;
  }, [filtered]);

  // Drag handlers
  const onDragStart = (e, id) => {
    setDragId(id);
    e.dataTransfer.effectAllowed = "move";
  };
  const onDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };
  const onDrop = (e, stageId) => {
    e.preventDefault();
    if (dragId == null) return;
    setInquiries((prev) =>
      prev.map((i) => (i.id === dragId ? { ...i, stage: stageId } : i)),
    );
    setDragId(null);
  };

  // Form handlers
  const openAdd = () => {
    setForm(initialForm);
    setFormErrors({});
    setModal("add");
  };
  const openEdit = (inq) => {
    setSelected(inq);
    setForm({
      studentName: inq.studentName,
      fatherName: inq.fatherName,
      phone: inq.phone,
      email: inq.email,
      applyingClass: inq.applyingClass,
      note: inq.note,
    });
    setFormErrors({});
    setModal("edit");
  };
  const openDel = (inq) => {
    setSelected(inq);
    setModal("delete");
  };
  const closeModal = () => {
    setModal(null);
    setSelected(null);
  };

  const validate = () => {
    const e = {};
    if (!form.studentName.trim()) e.studentName = "Required";
    if (!form.fatherName.trim()) e.fatherName = "Required";
    if (!form.phone.trim()) e.phone = "Required";
    if (!form.applyingClass.trim()) e.applyingClass = "Required";
    setFormErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    setIsSaving(true);
    setTimeout(() => {
      if (modal === "add") {
        setInquiries((prev) => [
          {
            id: Date.now(),
            ...form,
            stage: "new",
            date: new Date().toISOString().slice(0, 10),
          },
          ...prev,
        ]);
      } else {
        setInquiries((prev) =>
          prev.map((i) => (i.id === selected.id ? { ...i, ...form } : i)),
        );
      }
      setIsSaving(false);
      closeModal();
    }, 500);
  };

  const handleDelete = () => {
    setIsSaving(true);
    setTimeout(() => {
      setInquiries((prev) => prev.filter((i) => i.id !== selected.id));
      setIsSaving(false);
      closeModal();
    }, 400);
  };

  const whatsappLink = (phone, name) =>
    `https://wa.me/92${phone.slice(1)}?text=Dear%20parent%20of%20${encodeURIComponent(name)}%2C%20thank%20you%20for%20your%20inquiry%20at%20EduLink.`;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Admission Inquiries"
        subtitle={`${inquiries.length} total inquiries — drag cards between stages`}
        action={
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-light-text-tertiary dark:text-dark-text-tertiary"
              />
              <input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8 pr-3 py-2 rounded-lg bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border text-light-text-primary dark:text-dark-text-primary placeholder:text-light-text-tertiary dark:placeholder:text-dark-text-tertiary text-sm outline-none focus:border-accent transition-colors w-48"
              />
            </div>
            <button
              onClick={openAdd}
              className="flex items-center gap-2 px-4 py-2 bg-accent hover:bg-accent-hover text-white text-sm font-medium rounded-lg transition-colors"
            >
              <Plus size={16} /> Add Inquiry
            </button>
          </div>
        }
      />

      {/* Stage summary pills */}
      <div className="flex flex-wrap gap-2">
        {STAGES.map((s) => (
          <div
            key={s.id}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full border ${s.light} ${s.border}`}
          >
            <span className={`w-2 h-2 rounded-full ${s.color}`} />
            <span className="text-xs font-medium text-light-text-secondary dark:text-dark-text-secondary">
              {s.label}
            </span>
            <span className="text-xs font-bold text-light-text-primary dark:text-dark-text-primary">
              {grouped[s.id]?.length ?? 0}
            </span>
          </div>
        ))}
      </div>

      {/* Kanban board */}
      <div className="flex gap-4 overflow-x-auto pb-4">
        {STAGES.map((stage) => (
          <div
            key={stage.id}
            onDragOver={onDragOver}
            onDrop={(e) => onDrop(e, stage.id)}
            className="flex flex-col gap-3 min-w-[260px] w-[260px] shrink-0"
          >
            {/* Column header */}
            <div
              className={`flex items-center gap-2 px-3 py-2 rounded-lg ${stage.light} border ${stage.border}`}
            >
              <span className={`w-2.5 h-2.5 rounded-full ${stage.color}`} />
              <span className="text-sm font-semibold text-light-text-primary dark:text-dark-text-primary flex-1">
                {stage.label}
              </span>
              <span
                className={`text-xs font-bold px-1.5 py-0.5 rounded-md ${stage.light} text-light-text-secondary dark:text-dark-text-secondary`}
              >
                {grouped[stage.id].length}
              </span>
            </div>

            {/* Cards */}
            <div className="flex flex-col gap-2 min-h-[80px]">
              {grouped[stage.id].length === 0 && (
                <div className="flex items-center justify-center h-16 border-2 border-dashed border-light-border dark:border-dark-border rounded-lg">
                  <p className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary">
                    Drop here
                  </p>
                </div>
              )}
              {grouped[stage.id].map((inq) => (
                <div
                  key={inq.id}
                  draggable
                  onDragStart={(e) => onDragStart(e, inq.id)}
                  className={`bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl p-3 cursor-grab active:cursor-grabbing shadow-sm hover:shadow-md transition-shadow ${dragId === inq.id ? "opacity-50" : ""}`}
                >
                  {/* Top row */}
                  <div className="flex items-start gap-2 mb-2">
                    <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-accent text-xs font-bold shrink-0 mt-0.5">
                      {inq.studentName.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-light-text-primary dark:text-dark-text-primary truncate">
                        {inq.studentName}
                      </p>
                      <p className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary truncate">
                        {inq.fatherName}
                      </p>
                    </div>
                  </div>

                  {/* Class badge */}
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-light-hover dark:bg-dark-hover text-xs text-light-text-secondary dark:text-dark-text-secondary mb-2">
                    <GraduationCap size={11} /> {inq.applyingClass}
                  </span>

                  {/* Note */}
                  {inq.note && (
                    <p className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary mb-2 line-clamp-2">
                      {inq.note}
                    </p>
                  )}

                  {/* Date */}
                  <p className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary mb-3">
                    {inq.date}
                  </p>

                  {/* Actions */}
                  <div className="flex items-center gap-1 border-t border-light-border dark:border-dark-border pt-2">
                    <a
                      href={whatsappLink(inq.phone, inq.studentName)}
                      target="_blank"
                      rel="noreferrer"
                      title="WhatsApp"
                      className="w-7 h-7 flex items-center justify-center rounded-lg text-light-text-tertiary dark:text-dark-text-tertiary hover:bg-green-50 dark:hover:bg-green-950 hover:text-green-600 transition-colors"
                    >
                      <MessageCircle size={13} />
                    </a>
                    <a
                      href={`tel:${inq.phone}`}
                      title="Call"
                      className="w-7 h-7 flex items-center justify-center rounded-lg text-light-text-tertiary dark:text-dark-text-tertiary hover:bg-blue-50 dark:hover:bg-blue-950 hover:text-blue-600 transition-colors"
                    >
                      <Phone size={13} />
                    </a>
                    <button
                      onClick={() => openEdit(inq)}
                      title="Edit"
                      className="w-7 h-7 flex items-center justify-center rounded-lg text-light-text-tertiary dark:text-dark-text-tertiary hover:bg-amber-50 dark:hover:bg-amber-950 hover:text-amber-600 transition-colors"
                    >
                      <Pencil size={13} />
                    </button>
                    <button
                      onClick={() => openDel(inq)}
                      title="Delete"
                      className="w-7 h-7 flex items-center justify-center rounded-lg text-light-text-tertiary dark:text-dark-text-tertiary hover:bg-red-50 dark:hover:bg-red-950 hover:text-red-600 transition-colors"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit modal */}
      {(modal === "add" || modal === "edit") && (
        <InquiryFormModal
          form={form}
          errors={formErrors}
          isSaving={isSaving}
          isEditing={modal === "edit"}
          onChange={(field, val) => {
            setForm((p) => ({ ...p, [field]: val }));
            setFormErrors((p) => ({ ...p, [field]: "" }));
          }}
          onSave={handleSave}
          onClose={closeModal}
        />
      )}

      {/* Delete modal */}
      {modal === "delete" && selected && (
        <ModalShell
          title="Delete Inquiry"
          onClose={closeModal}
          maxWidth="max-w-md"
        >
          <div className="p-5">
            <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
              Delete inquiry for{" "}
              <span className="font-semibold text-light-text-primary dark:text-dark-text-primary">
                {selected.studentName}
              </span>
              ? This cannot be undone.
            </p>
            <div className="mt-5 flex justify-end gap-2 border-t border-light-border pt-4 dark:border-dark-border">
              <button
                onClick={closeModal}
                className="rounded-lg border border-light-border px-4 py-2 text-sm font-medium text-light-text-secondary hover:bg-light-hover dark:border-dark-border dark:text-dark-text-secondary dark:hover:bg-dark-hover"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isSaving}
                className="flex items-center gap-2 rounded-lg bg-red-500 hover:bg-red-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-70"
              >
                {isSaving && <Loader2 size={14} className="animate-spin" />}{" "}
                Delete
              </button>
            </div>
          </div>
        </ModalShell>
      )}
    </div>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────
function ModalShell({ title, children, onClose, maxWidth = "max-w-xl" }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div
        className={`w-full ${maxWidth} rounded-xl border border-light-border bg-light-card shadow-xl dark:border-dark-border dark:bg-dark-card`}
      >
        <div className="flex items-center justify-between border-b border-light-border px-5 py-4 dark:border-dark-border">
          <h2 className="text-sm font-semibold text-light-text-primary dark:text-dark-text-primary">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-light-text-tertiary hover:bg-light-hover dark:text-dark-text-tertiary dark:hover:bg-dark-hover"
          >
            <X size={16} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function InquiryFormModal({
  form,
  errors,
  isSaving,
  isEditing,
  onChange,
  onSave,
  onClose,
}) {
  const classes = [
    "Class 6",
    "Class 7",
    "Class 8",
    "Class 9",
    "Class 10",
    "Class 11",
    "Class 12",
  ];
  return (
    <ModalShell
      title={isEditing ? "Edit Inquiry" : "Add Inquiry"}
      onClose={onClose}
    >
      <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FF
          label="Student Name"
          value={form.studentName}
          error={errors.studentName}
          onChange={(v) => onChange("studentName", v)}
        />
        <FF
          label="Father's Name"
          value={form.fatherName}
          error={errors.fatherName}
          onChange={(v) => onChange("fatherName", v)}
        />
        <FF
          label="Phone"
          value={form.phone}
          error={errors.phone}
          onChange={(v) => onChange("phone", v)}
        />
        <FF
          label="Email"
          value={form.email}
          type="email"
          onChange={(v) => onChange("email", v)}
        />
        <div className="sm:col-span-1">
          <label className="block">
            <span className="text-xs font-medium text-light-text-secondary dark:text-dark-text-secondary">
              Applying For
            </span>
            <select
              value={form.applyingClass}
              onChange={(e) => onChange("applyingClass", e.target.value)}
              className={`mt-1 w-full rounded-lg border bg-light-bg px-3 py-2 text-sm text-light-text-primary outline-none transition-colors focus:border-accent dark:bg-dark-bg dark:text-dark-text-primary ${errors.applyingClass ? "border-danger" : "border-light-border dark:border-dark-border"}`}
            >
              <option value="">Select class...</option>
              {classes.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
            {errors.applyingClass && (
              <span className="mt-1 block text-xs text-danger">
                {errors.applyingClass}
              </span>
            )}
          </label>
        </div>
        <div className="sm:col-span-2">
          <label className="block">
            <span className="text-xs font-medium text-light-text-secondary dark:text-dark-text-secondary">
              Note
            </span>
            <textarea
              rows={3}
              value={form.note}
              onChange={(e) => onChange("note", e.target.value)}
              placeholder="Any notes about this inquiry..."
              className="mt-1 w-full rounded-lg border border-light-border bg-light-bg px-3 py-2 text-sm text-light-text-primary outline-none transition-colors placeholder:text-light-text-tertiary focus:border-accent dark:border-dark-border dark:bg-dark-bg dark:text-dark-text-primary resize-none"
            />
          </label>
        </div>
      </div>
      <div className="flex justify-end gap-2 border-t border-light-border px-5 py-4 dark:border-dark-border">
        <button
          onClick={onClose}
          className="rounded-lg border border-light-border px-4 py-2 text-sm font-medium text-light-text-secondary hover:bg-light-hover dark:border-dark-border dark:text-dark-text-secondary dark:hover:bg-dark-hover"
        >
          Cancel
        </button>
        <button
          onClick={onSave}
          disabled={isSaving}
          className="flex items-center gap-2 rounded-lg bg-accent hover:bg-accent-hover px-4 py-2 text-sm font-medium text-white disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isSaving && <Loader2 size={14} className="animate-spin" />}
          {isEditing ? "Save Changes" : "Add Inquiry"}
        </button>
      </div>
    </ModalShell>
  );
}

function FF({ label, value, error, onChange, type = "text" }) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-light-text-secondary dark:text-dark-text-secondary">
        {label}
      </span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`mt-1 w-full rounded-lg border bg-light-bg px-3 py-2 text-sm text-light-text-primary outline-none transition-colors placeholder:text-light-text-tertiary focus:border-accent dark:bg-dark-bg dark:text-dark-text-primary ${error ? "border-danger" : "border-light-border dark:border-dark-border"}`}
      />
      {error && <span className="mt-1 block text-xs text-danger">{error}</span>}
    </label>
  );
}

export default Inquiries;
