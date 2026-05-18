import { useState, useMemo } from "react";
import { Plus, BookCopy, ChevronDown, ChevronUp, Send } from "lucide-react";
import PageHeader from "../../components/common/PageHeader";
import { mockDiaryEntries } from "../../data/mockData";

const classes = ["All Classes", "9-B", "10-A", "11-A"];

function HomeworkDiary() {
  const [selectedClass, setClass] = useState("All Classes");
  const [date, setDate] = useState("2026-05-14");
  const [expandedId, setExpanded] = useState(null);
  const [entries, setEntries] = useState(mockDiaryEntries);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    class: "10-A",
    date: "2026-05-14",
    homework: {
      Mathematics: "",
      English: "",
      Physics: "",
      Chemistry: "",
      Computer: "",
    },
  });

  const filtered = useMemo(() => {
    return entries.filter((e) => {
      const matchClass =
        selectedClass === "All Classes" || e.class === selectedClass;
      const matchDate = e.date === date;
      return matchClass && matchDate;
    });
  }, [selectedClass, date, entries]);

  const handleSave = () => {
    const filledHomework = Object.fromEntries(
      Object.entries(form.homework).filter(([_, v]) => v.trim() !== ""),
    );
    if (Object.keys(filledHomework).length === 0) return;
    setEntries((prev) => [
      {
        id: prev.length + 1,
        class: form.class,
        section: "A",
        date: form.date,
        createdBy: "Admin",
        homework: filledHomework,
      },
      ...prev,
    ]);
    setShowModal(false);
  };

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Homework Diary"
        subtitle="Daily homework entries for all classes"
        action={
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-accent hover:bg-accent-hover text-white text-sm font-medium rounded-lg transition-colors"
          >
            <Plus size={16} />
            Add Diary
          </button>
        }
      />

      {/* Filters */}
      <div className="bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex gap-2 flex-wrap">
            {classes.map((c) => (
              <button
                key={c}
                onClick={() => setClass(c)}
                className={`px-3 py-2 rounded-lg text-xs font-medium border transition-colors ${
                  selectedClass === c
                    ? "bg-accent text-white border-accent"
                    : "bg-light-bg dark:bg-dark-bg border-light-border dark:border-dark-border text-light-text-secondary dark:text-dark-text-secondary hover:border-accent"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
          <div className="flex-1" />
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="px-3 py-2 rounded-lg bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border text-light-text-primary dark:text-dark-text-primary text-sm outline-none focus:border-accent transition-colors"
          />
        </div>
      </div>

      {/* Diary entries */}
      <div className="flex flex-col gap-3">
        {filtered.length > 0 ? (
          filtered.map((entry) => (
            <div
              key={entry.id}
              className="bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl overflow-hidden"
            >
              <div
                className="flex items-center gap-4 px-5 py-4 cursor-pointer hover:bg-light-hover dark:hover:bg-dark-hover transition-colors"
                onClick={() =>
                  setExpanded(expandedId === entry.id ? null : entry.id)
                }
              >
                <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <BookCopy size={18} className="text-accent" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-light-text-primary dark:text-dark-text-primary">
                    Class {entry.class} — Section {entry.section}
                  </p>
                  <p className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary mt-0.5">
                    {Object.keys(entry.homework).length} subjects · Added by{" "}
                    {entry.createdBy} · {entry.date}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-green-50 dark:bg-green-950 text-green-600 dark:text-green-400 rounded-lg hover:bg-green-500 hover:text-white transition-colors">
                    <Send size={11} />
                    Send via WhatsApp
                  </button>
                  {expandedId === entry.id ? (
                    <ChevronUp
                      size={15}
                      className="text-light-text-tertiary dark:text-dark-text-tertiary"
                    />
                  ) : (
                    <ChevronDown
                      size={15}
                      className="text-light-text-tertiary dark:text-dark-text-tertiary"
                    />
                  )}
                </div>
              </div>

              {expandedId === entry.id && (
                <div className="border-t border-light-border dark:border-dark-border px-5 py-4 bg-light-bg dark:bg-dark-bg">
                  <div className="flex flex-col gap-3">
                    {Object.entries(entry.homework).map(([subject, hw]) => (
                      <div key={subject} className="flex gap-3">
                        <span className="text-xs font-semibold text-accent w-24 flex-shrink-0 pt-0.5">
                          {subject}
                        </span>
                        <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary flex-1">
                          {hw}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl flex flex-col items-center justify-center py-16 gap-3">
            <div className="w-12 h-12 bg-light-hover dark:bg-dark-hover rounded-full flex items-center justify-center">
              <BookCopy
                size={22}
                className="text-light-text-tertiary dark:text-dark-text-tertiary"
              />
            </div>
            <p className="text-light-text-secondary dark:text-dark-text-secondary text-sm font-medium">
              No diary entries for this date
            </p>
          </div>
        )}
      </div>

      {/* Add Diary Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <h2 className="text-base font-semibold text-light-text-primary dark:text-dark-text-primary mb-5">
              Add Homework Diary
            </h2>
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-light-text-primary dark:text-dark-text-primary">
                    Class
                  </label>
                  <select
                    value={form.class}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, class: e.target.value }))
                    }
                    className="w-full px-3 py-2 rounded-lg bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border text-light-text-primary dark:text-dark-text-primary text-sm outline-none focus:border-accent transition-colors"
                  >
                    {["9-B", "10-A", "11-A"].map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-light-text-primary dark:text-dark-text-primary">
                    Date
                  </label>
                  <input
                    type="date"
                    value={form.date}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, date: e.target.value }))
                    }
                    className="w-full px-3 py-2 rounded-lg bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border text-light-text-primary dark:text-dark-text-primary text-sm outline-none focus:border-accent transition-colors"
                  />
                </div>
              </div>
              {Object.keys(form.homework).map((subject) => (
                <div key={subject} className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-light-text-primary dark:text-dark-text-primary">
                    {subject}
                  </label>
                  <input
                    type="text"
                    value={form.homework[subject]}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        homework: {
                          ...prev.homework,
                          [subject]: e.target.value,
                        },
                      }))
                    }
                    placeholder={`${subject} homework...`}
                    className="w-full px-3 py-2 rounded-lg bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border text-light-text-primary dark:text-dark-text-primary text-sm outline-none focus:border-accent transition-colors"
                  />
                </div>
              ))}
            </div>
            <div className="flex gap-3 mt-5">
              <button
                onClick={handleSave}
                className="flex-1 py-2.5 bg-accent hover:bg-accent-hover text-white text-sm font-medium rounded-lg transition-colors"
              >
                Save Diary
              </button>
              <button
                onClick={() => setShowModal(false)}
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

export default HomeworkDiary;
