import { useState, useMemo } from "react";
import {
  Search,
  Plus,
  Eye,
  EyeOff,
  Smile,
  Calendar,
  Pencil,
  Trash2,
} from "lucide-react";
import DatePicker from "../../components/common/DatePicker";
import PageHeader from "../../components/common/PageHeader";
import { ROLES } from "../../constants/routes";
import { useAuth } from "../../hooks/useAuth";
import {
  mockBehaviorRecords,
  mockBehaviorTypes,
  mockAttendanceStudents,
} from "../../data/mockData";

const sentimentStyles = {
  positive:
    "bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800",
  negative:
    "bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800",
};

function BehaviorRecording() {
  const { role } = useAuth();
  const [search, setSearch] = useState("");
  const [date, setDate] = useState("2026-05-14");
  const [records, setRecords] = useState(mockBehaviorRecords);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    studentId: "",
    tags: [],
    note: "",
    visibleToParent: true,
  });
  const isTeacher = role === ROLES.TEACHER;
  const isAdmin = role === ROLES.ADMIN;
  const canEditRecords = isTeacher || isAdmin;

  const filtered = useMemo(() => {
    return records.filter((r) => {
      const matchSearch = r.studentName
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchDate = r.date === date;
      return matchSearch && matchDate;
    });
  }, [search, date, records]);

  const summary = useMemo(
    () => ({
      total: filtered.length,
      positive: filtered.filter((r) =>
        r.tags.some(
          (t) =>
            mockBehaviorTypes.find((b) => b.name === t)?.sentiment ===
            "positive",
        ),
      ).length,
      negative: filtered.filter((r) =>
        r.tags.some(
          (t) =>
            mockBehaviorTypes.find((b) => b.name === t)?.sentiment ===
            "negative",
        ),
      ).length,
    }),
    [filtered],
  );

  const toggleTag = (tag) => {
    setForm((prev) => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter((t) => t !== tag)
        : [...prev.tags, tag],
    }));
  };

  const resetForm = () => {
    setForm({ studentId: "", tags: [], note: "", visibleToParent: true });
    setEditingId(null);
  };

  const openAddModal = () => {
    resetForm();
    setShowModal(true);
  };

  const openEditModal = (record) => {
    setEditingId(record.id);
    setForm({
      studentId: String(record.studentId),
      tags: record.tags,
      note: record.note,
      visibleToParent: record.visibleToParent,
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    resetForm();
  };

  const handleSave = () => {
    if (!form.studentId || form.tags.length === 0) return;
    const student = mockAttendanceStudents.find(
      (s) => s.id === Number(form.studentId),
    );
    if (editingId) {
      setRecords((prev) =>
        prev.map((record) =>
          record.id === editingId
            ? {
                ...record,
                studentId: Number(form.studentId),
                studentName: student?.name || "",
                tags: form.tags,
                note: form.note,
                visibleToParent: form.visibleToParent,
              }
            : record,
        ),
      );
      closeModal();
      return;
    }

    const newRecord = {
      id: records.length + 1,
      studentId: Number(form.studentId),
      studentName: student?.name || "",
      date,
      tags: form.tags,
      note: form.note,
      visibleToParent: form.visibleToParent,
    };
    setRecords((prev) => [newRecord, ...prev]);
    closeModal();
  };

  const handleDelete = (recordId) => {
    setRecords((prev) => prev.filter((record) => record.id !== recordId));
  };

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Student Behavior"
        subtitle={
          isAdmin
            ? "Review behavior records and manage serious cases"
            : "Add and update daily student behavior records"
        }
        action={
          isTeacher ? (
            <button
              onClick={openAddModal}
              className="flex items-center gap-2 px-4 py-2 bg-accent hover:bg-accent-hover text-white text-sm font-medium rounded-lg transition-colors"
            >
              <Plus size={16} />
              Add Record
            </button>
          ) : null
        }
      />

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        {[
          {
            label: "Total Records",
            value: summary.total,
            bg: "bg-blue-50 dark:bg-blue-950",
            text: "text-blue-600 dark:text-blue-400",
          },
          {
            label: "Positive",
            value: summary.positive,
            bg: "bg-green-50 dark:bg-green-950",
            text: "text-green-600 dark:text-green-400",
          },
          {
            label: "Negative",
            value: summary.negative,
            bg: "bg-red-50 dark:bg-red-950",
            text: "text-red-600 dark:text-red-400",
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

      {/* Filters */}
      <div className="bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-light-text-tertiary dark:text-dark-text-tertiary"
            />
            <input
              type="text"
              placeholder="Search by student name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-lg bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border text-light-text-primary dark:text-dark-text-primary placeholder:text-light-text-tertiary dark:placeholder:text-dark-text-tertiary text-sm outline-none focus:border-accent transition-colors"
            />
          </div>
          <DatePicker value={date} onChange={setDate} className="sm:w-65" />
        </div>
      </div>

      {/* Records */}
      <div className="flex flex-col gap-3">
        {filtered.length > 0 ? (
          filtered.map((record) => (
            <div
              key={record.id}
              className="bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl px-5 py-4"
            >
              <div className="flex items-start gap-3">
                {/* Avatar */}
                <div className="w-9 h-9 rounded-full bg-accent/10 flex items-center justify-center text-accent text-sm font-semibold shrink-0">
                  {record.studentName.charAt(0)}
                </div>

                <div className="flex-1 min-w-0">
                  {/* Name + date */}
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-light-text-primary dark:text-dark-text-primary">
                      {record.studentName}
                    </p>
                    <div className="flex items-center gap-3">
                      {canEditRecords && (
                        <button
                          onClick={() => openEditModal(record)}
                          title="Edit record"
                          className="text-light-text-tertiary dark:text-dark-text-tertiary hover:text-accent transition-colors"
                        >
                          <Pencil size={13} />
                        </button>
                      )}
                      {isAdmin && (
                        <button
                          onClick={() => handleDelete(record.id)}
                          title="Delete record"
                          className="text-light-text-tertiary dark:text-dark-text-tertiary hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={13} />
                        </button>
                      )}
                      {/* Parent visibility */}
                      <span
                        className={`flex items-center gap-1 text-xs ${record.visibleToParent ? "text-green-600 dark:text-green-400" : "text-light-text-tertiary dark:text-dark-text-tertiary"}`}
                      >
                        {record.visibleToParent ? (
                          <Eye size={12} />
                        ) : (
                          <EyeOff size={12} />
                        )}
                        {record.visibleToParent
                          ? "Visible to parent"
                          : "Hidden"}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-light-text-tertiary dark:text-dark-text-tertiary">
                        <Calendar size={12} />
                        {record.date}
                      </span>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {record.tags.map((tag) => {
                      const type = mockBehaviorTypes.find(
                        (b) => b.name === tag,
                      );
                      return (
                        <span
                          key={tag}
                          className={`text-xs px-2.5 py-0.5 rounded-full border font-medium ${sentimentStyles[type?.sentiment || "positive"]}`}
                        >
                          {type?.sentiment === "positive" ? "✓" : "!"} {tag}
                        </span>
                      );
                    })}
                  </div>

                  {/* Note */}
                  {record.note && (
                    <p className="text-xs text-light-text-secondary dark:text-dark-text-secondary mt-2 italic">
                      "{record.note}"
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl flex flex-col items-center justify-center py-16 gap-3">
            <div className="w-12 h-12 bg-light-hover dark:bg-dark-hover rounded-full flex items-center justify-center">
              <Smile
                size={22}
                className="text-light-text-tertiary dark:text-dark-text-tertiary"
              />
            </div>
            <p className="text-light-text-secondary dark:text-dark-text-secondary text-sm font-medium">
              No behavior records for this date
            </p>
            <p className="text-light-text-tertiary dark:text-dark-text-tertiary text-xs">
              {isTeacher
                ? "Add a new record using the button above"
                : "Try changing the search or date filter"}
            </p>
          </div>
        )}
      </div>

      {/* Add Record Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl p-6 w-full max-w-lg">
            <h2 className="text-base font-semibold text-light-text-primary dark:text-dark-text-primary mb-5">
              {editingId ? "Edit Behavior Record" : "Add Behavior Record"}
            </h2>
            <div className="flex flex-col gap-4">
              {/* Student */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-light-text-primary dark:text-dark-text-primary">
                  Student
                </label>
                <select
                  value={form.studentId}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, studentId: e.target.value }))
                  }
                  className="w-full px-4 py-2.5 rounded-lg bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border text-light-text-primary dark:text-dark-text-primary text-sm outline-none focus:border-accent transition-colors"
                >
                  <option value="">Select a student</option>
                  {mockAttendanceStudents.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Tags */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-light-text-primary dark:text-dark-text-primary">
                  Behavior Tags
                </label>
                <div className="flex flex-wrap gap-2">
                  {mockBehaviorTypes.map((type) => (
                    <button
                      key={type.id}
                      onClick={() => toggleTag(type.name)}
                      className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-colors ${
                        form.tags.includes(type.name)
                          ? sentimentStyles[type.sentiment]
                          : "bg-light-bg dark:bg-dark-bg border-light-border dark:border-dark-border text-light-text-secondary dark:text-dark-text-secondary"
                      }`}
                    >
                      {type.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Note */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-light-text-primary dark:text-dark-text-primary">
                  Note (optional)
                </label>
                <textarea
                  value={form.note}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, note: e.target.value }))
                  }
                  placeholder="Add a note..."
                  rows={2}
                  className="w-full px-4 py-2.5 rounded-lg bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border text-light-text-primary dark:text-dark-text-primary text-sm outline-none focus:border-accent transition-colors resize-none"
                />
              </div>

              {/* Visible to parent toggle */}
              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="text-sm font-medium text-light-text-primary dark:text-dark-text-primary">
                    Visible to parent
                  </p>
                  <p className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary">
                    Parent can see this record
                  </p>
                </div>
                <button
                  onClick={() =>
                    setForm((prev) => ({
                      ...prev,
                      visibleToParent: !prev.visibleToParent,
                    }))
                  }
                  className={`w-11 h-6 rounded-full transition-colors relative ${form.visibleToParent ? "bg-accent" : "bg-light-border dark:bg-dark-border"}`}
                >
                  <div
                    className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${form.visibleToParent ? "left-6" : "left-1"}`}
                  />
                </button>
              </div>
            </div>

            <div className="flex gap-3 mt-5">
              <button
                onClick={handleSave}
                className="flex-1 py-2.5 bg-accent hover:bg-accent-hover text-white text-sm font-medium rounded-lg transition-colors"
              >
                {editingId ? "Update Record" : "Save Record"}
              </button>
              <button
                onClick={closeModal}
                className="flex-1 py-2.5 bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border text-light-text-secondary dark:text-dark-text-secondary text-sm font-medium rounded-lg hover:bg-light-hover dark:hover:bg-dark-hover transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default BehaviorRecording;
