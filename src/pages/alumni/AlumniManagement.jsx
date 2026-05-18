import { useState, useMemo } from "react";
import {
  Search,
  Users,
  Briefcase,
  Trophy,
  MapPin,
  Mail,
  Phone,
  Plus,
  ExternalLink,
} from "lucide-react";
import PageHeader from "../../components/common/PageHeader";
import { mockAlumni, mockJobBoard } from "../../data/mockData";

const tabs = ["Alumni Directory", "Job Board"];
const batches = ["All Batches", "2020-2021", "2021-2022", "2022-2023"];
const jobTypeStyles = {
  "Full Time": "bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400",
  "Part Time":
    "bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400",
  Internship:
    "bg-green-50 dark:bg-green-950 text-green-600 dark:text-green-400",
};

function AlumniManagement() {
  const [activeTab, setTab] = useState("Alumni Directory");
  const [search, setSearch] = useState("");
  const [selectedBatch, setBatch] = useState("All Batches");
  const [expandedId, setExpanded] = useState(null);

  const filteredAlumni = useMemo(() => {
    return mockAlumni.filter((a) => {
      const matchSearch =
        a.name.toLowerCase().includes(search.toLowerCase()) ||
        a.profession.toLowerCase().includes(search.toLowerCase()) ||
        a.city.toLowerCase().includes(search.toLowerCase());
      const matchBatch =
        selectedBatch === "All Batches" || a.batch === selectedBatch;
      return matchSearch && matchBatch;
    });
  }, [search, selectedBatch]);

  const filteredJobs = useMemo(() => {
    return mockJobBoard.filter(
      (j) =>
        j.title.toLowerCase().includes(search.toLowerCase()) ||
        j.company.toLowerCase().includes(search.toLowerCase()) ||
        j.postedBy.toLowerCase().includes(search.toLowerCase()),
    );
  }, [search]);

  const summary = useMemo(
    () => ({
      total: mockAlumni.length,
      batches: [...new Set(mockAlumni.map((a) => a.batch))].length,
      withAchievements: mockAlumni.filter((a) => a.achievements.length > 0)
        .length,
      jobs: mockJobBoard.length,
    }),
    [],
  );

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Alumni Management"
        subtitle="Manage graduated students and alumni network"
        action={
          <button className="flex items-center gap-2 px-4 py-2 bg-accent hover:bg-accent-hover text-white text-sm font-medium rounded-lg transition-colors">
            <Plus size={16} />
            Add Alumni
          </button>
        }
      />

      {/* Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Total Alumni",
            value: summary.total,
            bg: "bg-blue-50 dark:bg-blue-950",
            text: "text-blue-600 dark:text-blue-400",
          },
          {
            label: "Batches",
            value: summary.batches,
            bg: "bg-purple-50 dark:bg-purple-950",
            text: "text-purple-600 dark:text-purple-400",
          },
          {
            label: "With Achievements",
            value: summary.withAchievements,
            bg: "bg-amber-50 dark:bg-amber-950",
            text: "text-amber-600 dark:text-amber-400",
          },
          {
            label: "Job Postings",
            value: summary.jobs,
            bg: "bg-green-50 dark:bg-green-950",
            text: "text-green-600 dark:text-green-400",
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

      {/* Tabs */}
      <div className="flex gap-2 bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl p-1.5">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => {
              setTab(tab);
              setSearch("");
            }}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === tab
                ? "bg-accent text-white"
                : "text-light-text-secondary dark:text-dark-text-secondary hover:bg-light-hover dark:hover:bg-dark-hover"
            }`}
          >
            {tab}
          </button>
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
              placeholder={
                activeTab === "Alumni Directory"
                  ? "Search by name, profession or city..."
                  : "Search by title or company..."
              }
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-lg bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border text-light-text-primary dark:text-dark-text-primary placeholder:text-light-text-tertiary dark:placeholder:text-dark-text-tertiary text-sm outline-none focus:border-accent transition-colors"
            />
          </div>
          {activeTab === "Alumni Directory" && (
            <div className="flex gap-2">
              {batches.map((b) => (
                <button
                  key={b}
                  onClick={() => setBatch(b)}
                  className={`px-3 py-2 rounded-lg text-xs font-medium border transition-colors ${
                    selectedBatch === b
                      ? "bg-accent text-white border-accent"
                      : "bg-light-bg dark:bg-dark-bg border-light-border dark:border-dark-border text-light-text-secondary dark:text-dark-text-secondary hover:border-accent"
                  }`}
                >
                  {b === "All Batches" ? "All" : b}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Alumni Directory */}
      {activeTab === "Alumni Directory" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAlumni.length > 0 ? (
            filteredAlumni.map((alumni) => (
              <div
                key={alumni.id}
                className="bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl p-5 hover:border-accent/40 transition-colors"
              >
                {/* Header */}
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-11 h-11 rounded-full bg-accent/10 flex items-center justify-center text-accent text-base font-semibold shrink-0">
                    {alumni.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-light-text-primary dark:text-dark-text-primary">
                      {alumni.name}
                    </p>
                    <p className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary">
                      Batch {alumni.batch}
                    </p>
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded-md bg-accent/10 text-accent font-medium shrink-0">
                    {alumni.batch}
                  </span>
                </div>

                {/* Details */}
                <div className="flex flex-col gap-2 mb-4">
                  <div className="flex items-center gap-2 text-xs text-light-text-secondary dark:text-dark-text-secondary">
                    <Briefcase
                      size={13}
                      className="text-light-text-tertiary dark:text-dark-text-tertiary shrink-0"
                    />
                    {alumni.profession} · {alumni.university}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-light-text-secondary dark:text-dark-text-secondary">
                    <MapPin
                      size={13}
                      className="text-light-text-tertiary dark:text-dark-text-tertiary shrink-0"
                    />
                    {alumni.city}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-light-text-secondary dark:text-dark-text-secondary">
                    <Mail
                      size={13}
                      className="text-light-text-tertiary dark:text-dark-text-tertiary shrink-0"
                    />
                    {alumni.email}
                  </div>
                </div>

                {/* Achievements */}
                {alumni.achievements.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-4">
                    {alumni.achievements.map((a) => (
                      <span
                        key={a}
                        className="text-xs px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-400 flex items-center gap-1"
                      >
                        <Trophy size={9} />
                        {a}
                      </span>
                    ))}
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2 pt-3 border-t border-light-border dark:border-dark-border">
                  <button className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-medium text-light-text-secondary dark:text-dark-text-secondary hover:bg-light-hover dark:hover:bg-dark-hover transition-colors">
                    <Phone size={12} />
                    Call
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-medium text-light-text-secondary dark:text-dark-text-secondary hover:bg-light-hover dark:hover:bg-dark-hover transition-colors">
                    <Mail size={12} />
                    Email
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-3 bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl flex flex-col items-center justify-center py-16 gap-3">
              <div className="w-12 h-12 bg-light-hover dark:bg-dark-hover rounded-full flex items-center justify-center">
                <Users
                  size={22}
                  className="text-light-text-tertiary dark:text-dark-text-tertiary"
                />
              </div>
              <p className="text-light-text-secondary dark:text-dark-text-secondary text-sm font-medium">
                No alumni found
              </p>
            </div>
          )}
        </div>
      )}

      {/* Job Board */}
      {activeTab === "Job Board" && (
        <div className="flex flex-col gap-4">
          {filteredJobs.length > 0 ? (
            filteredJobs.map((job) => (
              <div
                key={job.id}
                className="bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl p-5 hover:border-accent/40 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center shrink-0">
                      <Briefcase size={18} className="text-accent" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-sm font-semibold text-light-text-primary dark:text-dark-text-primary">
                          {job.title}
                        </h3>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-md font-medium ${jobTypeStyles[job.type]}`}
                        >
                          {job.type}
                        </span>
                      </div>
                      <p className="text-xs text-light-text-secondary dark:text-dark-text-secondary mt-0.5">
                        {job.company} · {job.location}
                      </p>
                      <p className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary mt-1">
                        Posted by {job.postedBy} · Deadline: {job.deadline}
                      </p>
                      <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary mt-2">
                        {job.description}
                      </p>
                    </div>
                  </div>
                  <button className="flex items-center gap-1.5 px-3 py-1.5 bg-accent hover:bg-accent-hover text-white text-xs font-medium rounded-lg transition-colors shrink-0">
                    <ExternalLink size={12} />
                    Apply
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl flex flex-col items-center justify-center py-16 gap-3">
              <div className="w-12 h-12 bg-light-hover dark:bg-dark-hover rounded-full flex items-center justify-center">
                <Briefcase
                  size={22}
                  className="text-light-text-tertiary dark:text-dark-text-tertiary"
                />
              </div>
              <p className="text-light-text-secondary dark:text-dark-text-secondary text-sm font-medium">
                No job postings found
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default AlumniManagement;
