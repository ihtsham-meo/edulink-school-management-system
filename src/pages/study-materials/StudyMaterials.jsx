import { useState, useMemo } from "react";
import {
  Search,
  Plus,
  FileText,
  Video,
  Image,
  Download,
  Trash2,
  Eye,
  Filter,
} from "lucide-react";
import PageHeader from "../../components/common/PageHeader";
import { mockStudyMaterials } from "../../data/mockData";

const typeConfig = {
  document: {
    icon: FileText,
    bg: "bg-blue-50 dark:bg-blue-950",
    text: "text-blue-600 dark:text-blue-400",
    label: "Document",
  },
  video: {
    icon: Video,
    bg: "bg-purple-50 dark:bg-purple-950",
    text: "text-purple-600 dark:text-purple-400",
    label: "Video",
  },
  picture: {
    icon: Image,
    bg: "bg-green-50 dark:bg-green-950",
    text: "text-green-600 dark:text-green-400",
    label: "Picture",
  },
};

const subjects = [
  "All Subjects",
  "Mathematics",
  "English",
  "Physics",
  "Chemistry",
  "Computer",
];
const types = ["All Types", "document", "video", "picture"];
const classes = ["All Classes", "9-A", "10-B", "11-A"];

function StudyMaterials() {
  const [search, setSearch] = useState("");
  const [selectedSubject, setSubject] = useState("All Subjects");
  const [selectedType, setType] = useState("All Types");
  const [selectedClass, setClass] = useState("All Classes");
  const [viewMode, setViewMode] = useState("grid");

  const filtered = useMemo(() => {
    return mockStudyMaterials.filter((m) => {
      const matchSearch =
        m.title.toLowerCase().includes(search.toLowerCase()) ||
        m.teacher.toLowerCase().includes(search.toLowerCase());
      const matchSubject =
        selectedSubject === "All Subjects" || m.subject === selectedSubject;
      const matchType = selectedType === "All Types" || m.type === selectedType;
      const matchClass =
        selectedClass === "All Classes" || m.class === selectedClass;
      return matchSearch && matchSubject && matchType && matchClass;
    });
  }, [search, selectedSubject, selectedType, selectedClass]);

  const summary = useMemo(
    () => ({
      total: mockStudyMaterials.length,
      documents: mockStudyMaterials.filter((m) => m.type === "document").length,
      videos: mockStudyMaterials.filter((m) => m.type === "video").length,
      pictures: mockStudyMaterials.filter((m) => m.type === "picture").length,
    }),
    [],
  );

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Study Materials"
        subtitle="Upload and manage learning resources"
        action={
          <button className="flex items-center gap-2 px-4 py-2 bg-accent hover:bg-accent-hover text-white text-sm font-medium rounded-lg transition-colors">
            <Plus size={16} />
            Upload Material
          </button>
        }
      />

      {/* Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Total Materials",
            value: summary.total,
            bg: "bg-blue-50 dark:bg-blue-950",
            text: "text-blue-600 dark:text-blue-400",
            icon: FileText,
          },
          {
            label: "Documents",
            value: summary.documents,
            bg: "bg-blue-50 dark:bg-blue-950",
            text: "text-blue-600 dark:text-blue-400",
            icon: FileText,
          },
          {
            label: "Videos",
            value: summary.videos,
            bg: "bg-purple-50 dark:bg-purple-950",
            text: "text-purple-600 dark:text-purple-400",
            icon: Video,
          },
          {
            label: "Pictures",
            value: summary.pictures,
            bg: "bg-green-50 dark:bg-green-950",
            text: "text-green-600 dark:text-green-400",
            icon: Image,
          },
        ].map((card) => (
          <div
            key={card.label}
            className={`${card.bg} rounded-xl p-4 flex items-center gap-3`}
          >
            <div
              className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${card.bg}`}
            >
              <card.icon size={18} className={card.text} />
            </div>
            <div>
              <p className={`text-2xl font-semibold ${card.text}`}>
                {card.value}
              </p>
              <p className={`text-xs ${card.text} opacity-75`}>{card.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl p-4">
        <div className="flex flex-col gap-3">
          {/* Search + View toggle */}
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-light-text-tertiary dark:text-dark-text-tertiary"
              />
              <input
                type="text"
                placeholder="Search by title or teacher..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-lg bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border text-light-text-primary dark:text-dark-text-primary placeholder:text-light-text-tertiary dark:placeholder:text-dark-text-tertiary text-sm outline-none focus:border-accent transition-colors"
              />
            </div>
            <div className="flex gap-1 bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border rounded-lg p-1">
              {["grid", "list"].map((v) => (
                <button
                  key={v}
                  onClick={() => setViewMode(v)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                    viewMode === v
                      ? "bg-accent text-white"
                      : "text-light-text-secondary dark:text-dark-text-secondary"
                  }`}
                >
                  {v.charAt(0).toUpperCase() + v.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Dropdowns */}
          <div className="flex flex-wrap gap-3">
            {[
              {
                value: selectedSubject,
                onChange: setSubject,
                options: subjects,
              },
              { value: selectedType, onChange: setType, options: types },
              { value: selectedClass, onChange: setClass, options: classes },
            ].map((filter, i) => (
              <select
                key={i}
                value={filter.value}
                onChange={(e) => filter.onChange(e.target.value)}
                className="px-3 py-2 rounded-lg bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border text-light-text-primary dark:text-dark-text-primary text-sm outline-none focus:border-accent transition-colors"
              >
                {filter.options.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            ))}
          </div>
        </div>
      </div>

      {/* Grid View */}
      {viewMode === "grid" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.length > 0 ? (
            filtered.map((material) => {
              const config = typeConfig[material.type];
              const Icon = config.icon;
              return (
                <div
                  key={material.id}
                  className="bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl p-5 hover:border-accent/40 transition-colors"
                >
                  {/* Icon + type */}
                  <div className="flex items-start justify-between mb-3">
                    <div
                      className={`w-12 h-12 ${config.bg} rounded-xl flex items-center justify-center`}
                    >
                      <Icon size={22} className={config.text} />
                    </div>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-md font-medium ${config.bg} ${config.text}`}
                    >
                      {config.label}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-sm font-semibold text-light-text-primary dark:text-dark-text-primary mb-1 line-clamp-2">
                    {material.title}
                  </h3>

                  {/* Meta */}
                  <p className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary mb-3">
                    {material.subject} · Class {material.class} ·{" "}
                    {material.teacher}
                  </p>

                  {/* Stats */}
                  <div className="flex items-center justify-between text-xs text-light-text-tertiary dark:text-dark-text-tertiary mb-4">
                    <span>{material.size}</span>
                    <span className="flex items-center gap-1">
                      <Download size={11} />
                      {material.downloads} downloads
                    </span>
                    <span>{material.uploadDate}</span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-3 border-t border-light-border dark:border-dark-border">
                    <button className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-medium bg-accent/10 text-accent hover:bg-accent hover:text-white transition-colors">
                      <Eye size={12} />
                      Preview
                    </button>
                    <button className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-medium bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border text-light-text-secondary dark:text-dark-text-secondary hover:bg-light-hover dark:hover:bg-dark-hover transition-colors">
                      <Download size={12} />
                      Download
                    </button>
                    <button className="w-8 flex items-center justify-center py-1.5 rounded-lg text-xs text-light-text-tertiary dark:text-dark-text-tertiary hover:bg-red-50 dark:hover:bg-red-950 hover:text-red-600 transition-colors">
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-3 bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl flex flex-col items-center justify-center py-16 gap-3">
              <div className="w-12 h-12 bg-light-hover dark:bg-dark-hover rounded-full flex items-center justify-center">
                <FileText
                  size={22}
                  className="text-light-text-tertiary dark:text-dark-text-tertiary"
                />
              </div>
              <p className="text-light-text-secondary dark:text-dark-text-secondary text-sm font-medium">
                No materials found
              </p>
              <p className="text-light-text-tertiary dark:text-dark-text-tertiary text-xs">
                Try adjusting your filters
              </p>
            </div>
          )}
        </div>
      )}

      {/* List View */}
      {viewMode === "list" && (
        <div className="bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl overflow-hidden">
          <div className="grid grid-cols-6 px-4 py-3 border-b border-light-border dark:border-dark-border">
            {["Title", "Subject", "Class", "Type", "Downloads", "Actions"].map(
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
          {filtered.length > 0 ? (
            filtered.map((material) => {
              const config = typeConfig[material.type];
              const Icon = config.icon;
              return (
                <div
                  key={material.id}
                  className="grid grid-cols-6 px-4 py-3 border-b border-light-border dark:border-dark-border last:border-0 hover:bg-light-hover dark:hover:bg-dark-hover transition-colors items-center"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-8 h-8 ${config.bg} rounded-lg flex items-center justify-center shrink-0`}
                    >
                      <Icon size={14} className={config.text} />
                    </div>
                    <span className="text-sm font-medium text-light-text-primary dark:text-dark-text-primary truncate">
                      {material.title}
                    </span>
                  </div>
                  <span className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                    {material.subject}
                  </span>
                  <span className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                    {material.class}
                  </span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-md font-medium w-fit ${config.bg} ${config.text}`}
                  >
                    {config.label}
                  </span>
                  <span className="text-sm text-light-text-secondary dark:text-dark-text-secondary flex items-center gap-1">
                    <Download size={12} />
                    {material.downloads}
                  </span>
                  <div className="flex gap-1">
                    <button className="w-7 h-7 flex items-center justify-center rounded-lg text-light-text-tertiary dark:text-dark-text-tertiary hover:bg-blue-50 dark:hover:bg-blue-950 hover:text-blue-600 transition-colors">
                      <Eye size={13} />
                    </button>
                    <button className="w-7 h-7 flex items-center justify-center rounded-lg text-light-text-tertiary dark:text-dark-text-tertiary hover:bg-green-50 dark:hover:bg-green-950 hover:text-green-600 transition-colors">
                      <Download size={13} />
                    </button>
                    <button className="w-7 h-7 flex items-center justify-center rounded-lg text-light-text-tertiary dark:text-dark-text-tertiary hover:bg-red-50 dark:hover:bg-red-950 hover:text-red-600 transition-colors">
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <div className="w-12 h-12 bg-light-hover dark:bg-dark-hover rounded-full flex items-center justify-center">
                <FileText
                  size={22}
                  className="text-light-text-tertiary dark:text-dark-text-tertiary"
                />
              </div>
              <p className="text-light-text-secondary dark:text-dark-text-secondary text-sm font-medium">
                No materials found
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default StudyMaterials;
