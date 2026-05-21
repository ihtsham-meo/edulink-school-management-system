import { useEffect, useState, useMemo } from "react";
import {
  Plus,
  Building2,
  Users,
  Banknote,
  Pencil,
  Trash2,
  ChevronDown,
  ChevronUp,
  AlertCircle,
} from "lucide-react";
import PageHeader from "../../components/common/PageHeader";
import { classService } from "../../services/classService";
import {
  CrudModal,
  DetailGrid,
  Field,
  ModalButton,
} from "../../components/common/CrudModal";

const normalizeClasses = (payload) => {
  const items = Array.isArray(payload)
    ? payload
    : payload?.data?.classes ||
      payload?.classes ||
      payload?.data ||
      [];

  if (!Array.isArray(items)) return [];

  return items.map((item) => ({
    ...item,
    id: item.id,
    name: item.name || "",
    level: item.level,
    sections: Array.isArray(item.sections)
      ? item.sections
      : String(item.sections || "")
          .split(",")
          .map((section) => section.trim())
          .filter(Boolean),
    students: Number(item.students || item.students_count || item.students_count_total || 0),
    fee: Number(item.fee || item.monthly_fee || 0),
  }));
};

const getClassLevel = (name) => {
  const match = String(name).match(/\d+/);
  return match ? Number(match[0]) : 1;
};

function ClassList() {
  const [classes, setClasses] = useState([]);
  const [apiMode, setApiMode] = useState("api");
  const [error, setError] = useState("");
  const [expandedId, setExpanded] = useState(null);
  const [search, setSearch] = useState("");
  const [modalMode, setModalMode] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);
  const [form, setForm] = useState({ name: "", sections: "", students: "", fee: "" });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const loadClasses = async () => {
      setError("");

      try {
        const response = await classService.getAll();
        const apiClasses = normalizeClasses(response.data);
        setClasses(apiClasses);
        setApiMode("api");
      } catch (err) {
        setClasses([]);
        setError(err.response?.data?.message || "Could not load classes from the backend.");
      }
    };

    loadClasses();
  }, []);

  const filtered = useMemo(() => {
    return classes.filter((c) =>
      c.name.toLowerCase().includes(search.toLowerCase()),
    );
  }, [classes, search]);

  const summary = useMemo(
    () => ({
      totalClasses: classes.length,
      totalSections: classes.reduce((sum, c) => sum + c.sections.length, 0),
      totalStudents: classes.reduce((sum, c) => sum + c.students, 0),
      avgFee: classes.length
        ? Math.round(classes.reduce((sum, c) => sum + c.fee, 0) / classes.length)
        : 0,
    }),
    [classes],
  );

  const openClassForm = (cls = null) => {
    setSelectedClass(cls);
    setErrors({});
    setForm(
      cls
        ? {
            name: cls.name,
            sections: cls.sections.join(", "),
            students: String(cls.students),
            fee: String(cls.fee),
          }
        : { name: "", sections: "A", students: "0", fee: "" },
    );
    setModalMode("form");
  };

  const validate = () => {
    const nextErrors = {};
    if (!form.name.trim()) nextErrors.name = "Class name is required";
    if (!form.sections.trim()) nextErrors.sections = "At least one section is required";
    if (!form.fee || Number(form.fee) < 1) nextErrors.fee = "Fee must be greater than 0";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    const payload = {
      academic_year_id: selectedClass?.academic_year_id || 1,
      name: form.name.trim(),
      level: selectedClass?.level || getClassLevel(form.name),
      sections: form.sections
        .split(",")
        .map((section) => section.trim().toUpperCase())
        .filter(Boolean),
      students: Number(form.students) || 0,
      fee: Number(form.fee),
    };

    try {
      if (selectedClass) {
        if (apiMode === "api") {
          await classService.update(selectedClass.id, {
            name: payload.name,
            level: payload.level,
          });
        }
        setClasses((prev) =>
          prev.map((cls) =>
            cls.id === selectedClass.id ? { ...cls, ...payload } : cls,
          ),
        );
      } else {
        let createdClass = { ...payload, id: Date.now() };
        if (apiMode === "api") {
          const response = await classService.create({
            academic_year_id: payload.academic_year_id,
            name: payload.name,
            level: payload.level,
          });
          createdClass =
            normalizeClasses(response.data).at(0) ||
            response.data?.data ||
            response.data ||
            createdClass;
        }
        setClasses((prev) => [createdClass, ...prev]);
      }
      setModalMode(null);
    } catch {
      setError("Something went wrong while saving the class. Please try again.");
    }
  };

  const handleDelete = async () => {
    try {
      if (apiMode === "api") {
        await classService.delete(selectedClass.id);
      }
      setClasses((prev) => prev.filter((cls) => cls.id !== selectedClass.id));
      setExpanded((id) => (id === selectedClass.id ? null : id));
      setModalMode(null);
    } catch {
      setError("Something went wrong while deleting the class. Please try again.");
    }
  };

  const handleAddSection = (cls) => {
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const nextSection =
      alphabet
        .split("")
        .find((letter) => !cls.sections.includes(letter)) || `S${cls.sections.length + 1}`;
    setClasses((prev) =>
      prev.map((item) =>
        item.id === cls.id
          ? { ...item, sections: [...item.sections, nextSection] }
          : item,
      ),
    );
  };

  const handleDeleteSection = (cls, section) => {
    setClasses((prev) =>
      prev.map((item) =>
        item.id === cls.id
          ? {
              ...item,
              sections: item.sections.filter((current) => current !== section),
            }
          : item,
      ),
    );
  };

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Classes & Sections"
        subtitle="Manage all classes and their sections"
        action={
          <button
            onClick={() => openClassForm()}
            className="flex items-center gap-2 px-4 py-2 bg-accent hover:bg-accent-hover text-white text-sm font-medium rounded-lg transition-colors"
          >
            <Plus size={16} />
            Add Class
          </button>
        }
      />

      {error && (
        <div className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-300">
          <AlertCircle size={17} className="mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Total Classes",
            value: summary.totalClasses,
            bg: "bg-blue-50 dark:bg-blue-950",
            text: "text-blue-600 dark:text-blue-400",
          },
          {
            label: "Total Sections",
            value: summary.totalSections,
            bg: "bg-green-50 dark:bg-green-950",
            text: "text-green-600 dark:text-green-400",
          },
          {
            label: "Total Students",
            value: summary.totalStudents,
            bg: "bg-purple-50 dark:bg-purple-950",
            text: "text-purple-600 dark:text-purple-400",
          },
          {
            label: "Avg Monthly Fee",
            value: `Rs ${summary.avgFee}`,
            bg: "bg-amber-50 dark:bg-amber-950",
            text: "text-amber-600 dark:text-amber-400",
          },
        ].map((card) => (
          <div key={card.label} className={`${card.bg} rounded-xl p-4`}>
            <p className={`text-2xl font-semibold ${card.text}`}>
              {card.value}
            </p>
            <p className={`text-xs ${card.text} opacity-75 mt-1`}>
              {card.label}
            </p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl p-4">
        <input
          type="text"
          placeholder="Search classes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-2 rounded-lg bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border text-light-text-primary dark:text-dark-text-primary placeholder:text-light-text-tertiary dark:placeholder:text-dark-text-tertiary text-sm outline-none focus:border-accent transition-colors"
        />
      </div>

      {/* Classes list */}
      <div className="flex flex-col gap-3">
        {filtered.map((cls) => (
          <div
            key={cls.id}
            className="bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl overflow-hidden"
          >
            {/* Class row */}
            <div
              className="flex items-center gap-4 px-5 py-4 cursor-pointer hover:bg-light-hover dark:hover:bg-dark-hover transition-colors"
              onClick={() => setExpanded(expandedId === cls.id ? null : cls.id)}
            >
              {/* Icon */}
              <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center shrink-0">
                <Building2 size={18} className="text-accent" />
              </div>

              {/* Name */}
              <div className="flex-1">
                <p className="text-sm font-semibold text-light-text-primary dark:text-dark-text-primary">
                  {cls.name}
                </p>
                <p className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary mt-0.5">
                  {cls.sections.length} section
                  {cls.sections.length > 1 ? "s" : ""}
                </p>
              </div>

              {/* Students */}
              <div className="hidden sm:flex items-center gap-1.5 text-xs text-light-text-secondary dark:text-dark-text-secondary">
                <Users size={13} />
                {cls.students} students
              </div>

              {/* Fee */}
              <div className="hidden sm:flex items-center gap-1.5 text-xs text-light-text-secondary dark:text-dark-text-secondary">
                <Banknote size={13} />
                Rs {cls.fee.toLocaleString()}/mo
              </div>

              {/* Sections pills */}
              <div className="hidden sm:flex gap-1">
                {cls.sections.map((s) => (
                  <span
                    key={s}
                    className="text-xs px-2 py-0.5 rounded-md bg-accent/10 text-accent font-medium"
                  >
                    {s}
                  </span>
                ))}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    openClassForm(cls);
                  }}
                  className="w-7 h-7 flex items-center justify-center rounded-lg text-light-text-tertiary dark:text-dark-text-tertiary hover:bg-amber-50 dark:hover:bg-amber-950 hover:text-amber-600 transition-colors"
                >
                  <Pencil size={13} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedClass(cls);
                    setModalMode("delete");
                  }}
                  className="w-7 h-7 flex items-center justify-center rounded-lg text-light-text-tertiary dark:text-dark-text-tertiary hover:bg-red-50 dark:hover:bg-red-950 hover:text-red-600 transition-colors"
                >
                  <Trash2 size={13} />
                </button>
                {expandedId === cls.id ? (
                  <ChevronUp
                    size={15}
                    className="text-light-text-tertiary dark:text-dark-text-tertiary ml-1"
                  />
                ) : (
                  <ChevronDown
                    size={15}
                    className="text-light-text-tertiary dark:text-dark-text-tertiary ml-1"
                  />
                )}
              </div>
            </div>

            {/* Expanded sections */}
            {expandedId === cls.id && (
              <div className="border-t border-light-border dark:border-dark-border px-5 py-4 bg-light-bg dark:bg-dark-bg">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-semibold text-light-text-secondary dark:text-dark-text-secondary uppercase tracking-wide">
                    Sections
                  </p>
                  <button
                    onClick={() => handleAddSection(cls)}
                    className="flex items-center gap-1.5 text-xs text-accent hover:underline"
                  >
                    <Plus size={12} />
                    Add Section
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {cls.sections.map((section) => (
                    <div
                      key={section}
                      className="bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-lg px-4 py-3 flex items-center justify-between"
                    >
                      <div>
                        <p className="text-sm font-medium text-light-text-primary dark:text-dark-text-primary">
                          {cls.name} — Section {section}
                        </p>
                        <p className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary mt-0.5">
                          {
                            cls.sections_count?.[section] ||
                            cls.section_counts?.[section] ||
                            0
                          }{" "}
                          students
                        </p>
                      </div>
                      <div className="flex gap-1">
                        <button
                          onClick={() => {
                            setSelectedClass(cls);
                            setModalMode("view");
                          }}
                          className="w-6 h-6 flex items-center justify-center rounded-md text-light-text-tertiary dark:text-dark-text-tertiary hover:bg-amber-50 dark:hover:bg-amber-950 hover:text-amber-600 transition-colors"
                        >
                          <Pencil size={12} />
                        </button>
                        <button
                          onClick={() => handleDeleteSection(cls, section)}
                          className="w-6 h-6 flex items-center justify-center rounded-md text-light-text-tertiary dark:text-dark-text-tertiary hover:bg-red-50 dark:hover:bg-red-950 hover:text-red-600 transition-colors"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Class details */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4 pt-4 border-t border-light-border dark:border-dark-border">
                  <div>
                    <p className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary mb-1">
                      Monthly Fee
                    </p>
                    <p className="text-sm font-medium text-light-text-primary dark:text-dark-text-primary">
                      Rs {cls.fee.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary mb-1">
                      Total Students
                    </p>
                    <p className="text-sm font-medium text-light-text-primary dark:text-dark-text-primary">
                      {cls.students}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary mb-1">
                      Total Sections
                    </p>
                    <p className="text-sm font-medium text-light-text-primary dark:text-dark-text-primary">
                      {cls.sections.length}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Empty state */}
        {filtered.length === 0 && (
          <div className="bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl flex flex-col items-center justify-center py-16 gap-3">
            <div className="w-12 h-12 bg-light-hover dark:bg-dark-hover rounded-full flex items-center justify-center">
              <Building2
                size={22}
                className="text-light-text-tertiary dark:text-dark-text-tertiary"
              />
            </div>
            <p className="text-light-text-secondary dark:text-dark-text-secondary text-sm font-medium">
              No classes found
            </p>
            <p className="text-light-text-tertiary dark:text-dark-text-tertiary text-xs">
              Try adjusting your search
            </p>
          </div>
        )}
      </div>

      {modalMode === "form" && (
        <CrudModal
          title={selectedClass ? "Edit Class" : "Add Class"}
          onClose={() => setModalMode(null)}
          footer={
            <>
              <ModalButton onClick={() => setModalMode(null)}>Cancel</ModalButton>
              <ModalButton variant="primary" onClick={handleSave}>
                {selectedClass ? "Save Changes" : "Add Class"}
              </ModalButton>
            </>
          }
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Class Name" value={form.name} error={errors.name} placeholder="Class 10" onChange={(value) => setForm((prev) => ({ ...prev, name: value }))} />
            <Field label="Sections" value={form.sections} error={errors.sections} placeholder="A, B, C" onChange={(value) => setForm((prev) => ({ ...prev, sections: value }))} />
            <Field label="Students" type="number" value={form.students} onChange={(value) => setForm((prev) => ({ ...prev, students: value }))} />
            <Field label="Monthly Fee" type="number" value={form.fee} error={errors.fee} onChange={(value) => setForm((prev) => ({ ...prev, fee: value }))} />
          </div>
        </CrudModal>
      )}

      {modalMode === "view" && selectedClass && (
        <CrudModal title="Class Details" onClose={() => setModalMode(null)}>
          <DetailGrid
            items={[
              ["Name", selectedClass.name],
              ["Sections", selectedClass.sections.join(", ")],
              ["Students", selectedClass.students],
              ["Monthly Fee", `Rs ${selectedClass.fee.toLocaleString()}`],
            ]}
          />
        </CrudModal>
      )}

      {modalMode === "delete" && selectedClass && (
        <CrudModal
          title="Delete Class"
          onClose={() => setModalMode(null)}
          footer={
            <>
              <ModalButton onClick={() => setModalMode(null)}>Cancel</ModalButton>
              <ModalButton variant="danger" onClick={handleDelete}>Delete</ModalButton>
            </>
          }
        >
          <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
            Are you sure you want to delete{" "}
            <span className="font-semibold text-light-text-primary dark:text-dark-text-primary">
              {selectedClass.name}
            </span>
            ?
          </p>
        </CrudModal>
      )}
    </div>
  );
}

export default ClassList;
