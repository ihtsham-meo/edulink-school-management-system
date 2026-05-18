import { useState, useMemo } from "react";
import {
  Plus,
  Pin,
  Megaphone,
  Search,
  Pencil,
  Trash2,
  Users,
  GraduationCap,
  UserCheck,
} from "lucide-react";
import PageHeader from "../../components/common/PageHeader";
import { mockNotices } from "../../data/mockData";

const targetStyles = {
  all: {
    label: "Everyone",
    icon: Users,
    bg: "bg-blue-50 dark:bg-blue-950",
    text: "text-blue-600 dark:text-blue-400",
  },
  staff: {
    label: "Staff",
    icon: UserCheck,
    bg: "bg-purple-50 dark:bg-purple-950",
    text: "text-purple-600 dark:text-purple-400",
  },
  student: {
    label: "Students",
    icon: GraduationCap,
    bg: "bg-green-50 dark:bg-green-950",
    text: "text-green-600 dark:text-green-400",
  },
};

const filters = ["All", "all", "staff", "student"];

function Noticeboard() {
  const [search, setSearch] = useState("");
  const [selectedTarget, setTarget] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [notices, setNotices] = useState(mockNotices);
  const [form, setForm] = useState({ title: "", content: "", target: "all" });

  const filtered = useMemo(() => {
    return notices.filter((n) => {
      const matchSearch =
        n.title.toLowerCase().includes(search.toLowerCase()) ||
        n.content.toLowerCase().includes(search.toLowerCase());
      const matchTarget =
        selectedTarget === "All" || n.target === selectedTarget;
      return matchSearch && matchTarget;
    });
  }, [search, selectedTarget, notices]);

  const pinned = filtered.filter((n) => n.pinned);
  const unpinned = filtered.filter((n) => !n.pinned);

  const handleDelete = (id) => {
    setNotices((prev) => prev.filter((n) => n.id !== id));
  };

  const handleTogglePin = (id) => {
    setNotices((prev) =>
      prev.map((n) => (n.id === id ? { ...n, pinned: !n.pinned } : n)),
    );
  };

  const handlePost = () => {
    if (!form.title.trim() || !form.content.trim()) return;
    const newNotice = {
      id: notices.length + 1,
      title: form.title,
      content: form.content,
      target: form.target,
      postedBy: "Admin",
      date: new Date().toISOString().split("T")[0],
      image: false,
      pinned: false,
    };
    setNotices((prev) => [newNotice, ...prev]);
    setForm({ title: "", content: "", target: "all" });
    setShowModal(false);
  };

  const NoticeCard = ({ notice }) => {
    const target = targetStyles[notice.target];
    const TargetIcon = target.icon;
    return (
      <div
        className={`bg-light-card dark:bg-dark-card border rounded-xl p-5 transition-colors ${
          notice.pinned
            ? "border-accent/40 dark:border-accent/40"
            : "border-light-border dark:border-dark-border"
        }`}
      >
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            {/* Icon */}
            <div className="w-9 h-9 bg-accent/10 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
              <Megaphone size={16} className="text-accent" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-sm font-semibold text-light-text-primary dark:text-dark-text-primary">
                  {notice.title}
                </h3>
                {notice.pinned && (
                  <span className="flex items-center gap-1 text-xs bg-accent/10 text-accent px-2 py-0.5 rounded-md font-medium">
                    <Pin size={10} />
                    Pinned
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary">
                  {notice.postedBy} · {notice.date}
                </span>
                <span
                  className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-md font-medium ${target.bg} ${target.text}`}
                >
                  <TargetIcon size={10} />
                  {target.label}
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={() => handleTogglePin(notice.id)}
              className={`w-7 h-7 flex items-center justify-center rounded-lg transition-colors ${
                notice.pinned
                  ? "text-accent bg-accent/10"
                  : "text-light-text-tertiary dark:text-dark-text-tertiary hover:bg-light-hover dark:hover:bg-dark-hover"
              }`}
            >
              <Pin size={13} />
            </button>
            <button className="w-7 h-7 flex items-center justify-center rounded-lg text-light-text-tertiary dark:text-dark-text-tertiary hover:bg-amber-50 dark:hover:bg-amber-950 hover:text-amber-600 transition-colors">
              <Pencil size={13} />
            </button>
            <button
              onClick={() => handleDelete(notice.id)}
              className="w-7 h-7 flex items-center justify-center rounded-lg text-light-text-tertiary dark:text-dark-text-tertiary hover:bg-red-50 dark:hover:bg-red-950 hover:text-red-600 transition-colors"
            >
              <Trash2 size={13} />
            </button>
          </div>
        </div>

        <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary leading-relaxed pl-12">
          {notice.content}
        </p>
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <PageHeader
        title="Noticeboard"
        subtitle="Post and manage school announcements"
        action={
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-accent hover:bg-accent-hover text-white text-sm font-medium rounded-lg transition-colors"
          >
            <Plus size={16} />
            Post Notice
          </button>
        }
      />

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
              placeholder="Search notices..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-lg bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border text-light-text-primary dark:text-dark-text-primary placeholder:text-light-text-tertiary dark:placeholder:text-dark-text-tertiary text-sm outline-none focus:border-accent transition-colors"
            />
          </div>
          <div className="flex gap-2">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setTarget(f)}
                className={`px-3 py-2 rounded-lg text-xs font-medium border transition-colors ${
                  selectedTarget === f
                    ? "bg-accent text-white border-accent"
                    : "bg-light-bg dark:bg-dark-bg border-light-border dark:border-dark-border text-light-text-secondary dark:text-dark-text-secondary hover:border-accent"
                }`}
              >
                {f === "All" ? "All" : targetStyles[f]?.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Pinned notices */}
      {pinned.length > 0 && (
        <div className="flex flex-col gap-3">
          <p className="text-xs font-medium text-light-text-tertiary dark:text-dark-text-tertiary uppercase tracking-wide flex items-center gap-2">
            <Pin size={12} />
            Pinned
          </p>
          {pinned.map((n) => (
            <NoticeCard key={n.id} notice={n} />
          ))}
        </div>
      )}

      {/* All notices */}
      <div className="flex flex-col gap-3">
        {pinned.length > 0 && (
          <p className="text-xs font-medium text-light-text-tertiary dark:text-dark-text-tertiary uppercase tracking-wide">
            All Notices
          </p>
        )}
        {unpinned.length > 0 ? (
          unpinned.map((n) => <NoticeCard key={n.id} notice={n} />)
        ) : pinned.length === 0 ? (
          <div className="bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl flex flex-col items-center justify-center py-16 gap-3">
            <div className="w-12 h-12 bg-light-hover dark:bg-dark-hover rounded-full flex items-center justify-center">
              <Megaphone
                size={22}
                className="text-light-text-tertiary dark:text-dark-text-tertiary"
              />
            </div>
            <p className="text-light-text-secondary dark:text-dark-text-secondary text-sm font-medium">
              No notices found
            </p>
            <p className="text-light-text-tertiary dark:text-dark-text-tertiary text-xs">
              Post a new notice using the button above
            </p>
          </div>
        ) : null}
      </div>

      {/* Post Notice Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl p-6 w-full max-w-lg">
            <h2 className="text-base font-semibold text-light-text-primary dark:text-dark-text-primary mb-5">
              Post New Notice
            </h2>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-light-text-primary dark:text-dark-text-primary">
                  Title
                </label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, title: e.target.value }))
                  }
                  placeholder="Notice title"
                  className="w-full px-4 py-2.5 rounded-lg bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border text-light-text-primary dark:text-dark-text-primary text-sm outline-none focus:border-accent transition-colors"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-light-text-primary dark:text-dark-text-primary">
                  Content
                </label>
                <textarea
                  value={form.content}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, content: e.target.value }))
                  }
                  placeholder="Write your notice here..."
                  rows={4}
                  className="w-full px-4 py-2.5 rounded-lg bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border text-light-text-primary dark:text-dark-text-primary text-sm outline-none focus:border-accent transition-colors resize-none"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-light-text-primary dark:text-dark-text-primary">
                  Target Audience
                </label>
                <select
                  value={form.target}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, target: e.target.value }))
                  }
                  className="w-full px-4 py-2.5 rounded-lg bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border text-light-text-primary dark:text-dark-text-primary text-sm outline-none focus:border-accent transition-colors"
                >
                  <option value="all">Everyone</option>
                  <option value="staff">Staff only</option>
                  <option value="student">Students only</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={handlePost}
                className="flex-1 py-2.5 bg-accent hover:bg-accent-hover text-white text-sm font-medium rounded-lg transition-colors"
              >
                Post Notice
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

export default Noticeboard;
