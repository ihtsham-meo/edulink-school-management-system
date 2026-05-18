import { useState, useMemo } from "react";
import {
  Search,
  HeartPulse,
  AlertTriangle,
  FileText,
  Plus,
  Eye,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import PageHeader from "../../components/common/PageHeader";
import { mockHealthRecords, mockIncidents } from "../../data/mockData";

const bloodGroupColors = {
  "A+": "bg-red-50 dark:bg-red-950 text-red-600 dark:text-red-400",
  "A-": "bg-red-50 dark:bg-red-950 text-red-600 dark:text-red-400",
  "B+": "bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400",
  "B-": "bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400",
  "AB+": "bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400",
  "AB-": "bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400",
  "O+": "bg-green-50 dark:bg-green-950 text-green-600 dark:text-green-400",
  "O-": "bg-green-50 dark:bg-green-950 text-green-600 dark:text-green-400",
};

const tabs = ["Health Profiles", "Incident Log"];

function HealthRecords() {
  const [activeTab, setTab] = useState("Health Profiles");
  const [search, setSearch] = useState("");
  const [expandedId, setExpanded] = useState(null);

  const filteredRecords = useMemo(() => {
    return mockHealthRecords.filter(
      (r) =>
        r.studentName.toLowerCase().includes(search.toLowerCase()) ||
        r.bloodGroup.toLowerCase().includes(search.toLowerCase()) ||
        r.conditions.some((c) =>
          c.toLowerCase().includes(search.toLowerCase()),
        ),
    );
  }, [search]);

  const filteredIncidents = useMemo(() => {
    return mockIncidents.filter(
      (i) =>
        i.studentName.toLowerCase().includes(search.toLowerCase()) ||
        i.incident.toLowerCase().includes(search.toLowerCase()),
    );
  }, [search]);

  const summary = useMemo(
    () => ({
      total: mockHealthRecords.length,
      conditions: mockHealthRecords.filter((r) => r.conditions.length > 0)
        .length,
      allergies: mockHealthRecords.filter((r) => r.allergies.length > 0).length,
      incidents: mockIncidents.length,
    }),
    [],
  );

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Health Records"
        subtitle="Manage student medical information and incidents"
        action={
          <button className="flex items-center gap-2 px-4 py-2 bg-accent hover:bg-accent-hover text-white text-sm font-medium rounded-lg transition-colors">
            <Plus size={16} />
            Add Record
          </button>
        }
      />

      {/* Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Total Records",
            value: summary.total,
            bg: "bg-blue-50 dark:bg-blue-950",
            text: "text-blue-600 dark:text-blue-400",
            icon: HeartPulse,
          },
          {
            label: "With Conditions",
            value: summary.conditions,
            bg: "bg-amber-50 dark:bg-amber-950",
            text: "text-amber-600 dark:text-amber-400",
            icon: AlertTriangle,
          },
          {
            label: "With Allergies",
            value: summary.allergies,
            bg: "bg-purple-50 dark:bg-purple-950",
            text: "text-purple-600 dark:text-purple-400",
            icon: AlertTriangle,
          },
          {
            label: "Total Incidents",
            value: summary.incidents,
            bg: "bg-red-50 dark:bg-red-950",
            text: "text-red-600 dark:text-red-400",
            icon: FileText,
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

      {/* Search */}
      <div className="bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl p-4">
        <div className="relative">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-light-text-tertiary dark:text-dark-text-tertiary"
          />
          <input
            type="text"
            placeholder={
              activeTab === "Health Profiles"
                ? "Search by name, blood group or condition..."
                : "Search by student or incident..."
            }
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border text-light-text-primary dark:text-dark-text-primary placeholder:text-light-text-tertiary dark:placeholder:text-dark-text-tertiary text-sm outline-none focus:border-accent transition-colors"
          />
        </div>
      </div>

      {/* Health Profiles Tab */}
      {activeTab === "Health Profiles" && (
        <div className="flex flex-col gap-3">
          {filteredRecords.length > 0 ? (
            filteredRecords.map((record) => (
              <div
                key={record.id}
                className="bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl overflow-hidden"
              >
                {/* Row */}
                <div
                  className="flex items-center gap-4 px-5 py-4 cursor-pointer hover:bg-light-hover dark:hover:bg-dark-hover transition-colors"
                  onClick={() =>
                    setExpanded(expandedId === record.id ? null : record.id)
                  }
                >
                  {/* Avatar */}
                  <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent text-sm font-semibold shrink-0">
                    {record.studentName.charAt(0)}
                  </div>

                  {/* Name */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-light-text-primary dark:text-dark-text-primary">
                      {record.studentName}
                    </p>
                    <p className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary mt-0.5">
                      {record.height}cm · {record.weight}kg
                    </p>
                  </div>

                  {/* Blood group */}
                  <span
                    className={`text-xs px-2.5 py-1 rounded-lg font-semibold ${bloodGroupColors[record.bloodGroup]}`}
                  >
                    {record.bloodGroup}
                  </span>

                  {/* Conditions */}
                  <div className="hidden sm:flex gap-1 flex-wrap">
                    {record.conditions.map((c) => (
                      <span
                        key={c}
                        className="text-xs px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800 font-medium"
                      >
                        {c}
                      </span>
                    ))}
                    {record.conditions.length === 0 && (
                      <span className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary">
                        No conditions
                      </span>
                    )}
                  </div>

                  {/* Allergies */}
                  <div className="hidden sm:flex gap-1 flex-wrap">
                    {record.allergies.slice(0, 2).map((a) => (
                      <span
                        key={a}
                        className="text-xs px-2 py-0.5 rounded-md bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800 font-medium"
                      >
                        {a}
                      </span>
                    ))}
                    {record.allergies.length === 0 && (
                      <span className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary">
                        No allergies
                      </span>
                    )}
                  </div>

                  {expandedId === record.id ? (
                    <ChevronUp
                      size={15}
                      className="text-light-text-tertiary dark:text-dark-text-tertiary shrink-0"
                    />
                  ) : (
                    <ChevronDown
                      size={15}
                      className="text-light-text-tertiary dark:text-dark-text-tertiary shrink-0"
                    />
                  )}
                </div>

                {/* Expanded details */}
                {expandedId === record.id && (
                  <div className="border-t border-light-border dark:border-dark-border px-5 py-4 bg-light-bg dark:bg-dark-bg">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                      {/* Medical info */}
                      <div>
                        <p className="text-xs font-semibold text-light-text-tertiary dark:text-dark-text-tertiary uppercase tracking-wide mb-3">
                          Medical Info
                        </p>
                        <div className="flex flex-col gap-2">
                          <div>
                            <p className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary">
                              Blood Group
                            </p>
                            <p className="text-sm font-medium text-light-text-primary dark:text-dark-text-primary">
                              {record.bloodGroup}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary">
                              Conditions
                            </p>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {record.conditions.length > 0 ? (
                                record.conditions.map((c) => (
                                  <span
                                    key={c}
                                    className="text-xs px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-400 font-medium"
                                  >
                                    {c}
                                  </span>
                                ))
                              ) : (
                                <span className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary">
                                  None
                                </span>
                              )}
                            </div>
                          </div>
                          <div>
                            <p className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary">
                              Allergies
                            </p>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {record.allergies.length > 0 ? (
                                record.allergies.map((a) => (
                                  <span
                                    key={a}
                                    className="text-xs px-2 py-0.5 rounded-md bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-400 font-medium"
                                  >
                                    {a}
                                  </span>
                                ))
                              ) : (
                                <span className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary">
                                  None
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Emergency contact */}
                      <div>
                        <p className="text-xs font-semibold text-light-text-tertiary dark:text-dark-text-tertiary uppercase tracking-wide mb-3">
                          Emergency Contact
                        </p>
                        <div className="flex flex-col gap-2">
                          <div>
                            <p className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary">
                              Doctor
                            </p>
                            <p className="text-sm font-medium text-light-text-primary dark:text-dark-text-primary">
                              {record.emergencyDoctor}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary">
                              Phone
                            </p>
                            <p className="text-sm font-medium text-light-text-primary dark:text-dark-text-primary">
                              {record.emergencyPhone}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary">
                              Preferred Hospital
                            </p>
                            <p className="text-sm font-medium text-light-text-primary dark:text-dark-text-primary">
                              {record.hospital}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Vaccinations */}
                      <div>
                        <p className="text-xs font-semibold text-light-text-tertiary dark:text-dark-text-tertiary uppercase tracking-wide mb-3">
                          Vaccinations
                        </p>
                        {record.vaccinations.length > 0 ? (
                          record.vaccinations.map((v, i) => (
                            <div
                              key={i}
                              className="bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-lg p-3 mb-2"
                            >
                              <p className="text-xs font-medium text-light-text-primary dark:text-dark-text-primary">
                                {v.name}
                              </p>
                              <p className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary mt-0.5">
                                Given: {v.date}
                              </p>
                              <p className="text-xs text-amber-600 dark:text-amber-400 mt-0.5">
                                Next due: {v.nextDue}
                              </p>
                            </div>
                          ))
                        ) : (
                          <p className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary">
                            No vaccination records
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2 mt-4">
                      <button className="px-3 py-1.5 bg-accent hover:bg-accent-hover text-white text-xs font-medium rounded-lg transition-colors">
                        Edit Record
                      </button>
                      <button className="px-3 py-1.5 bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border text-light-text-secondary dark:text-dark-text-secondary text-xs font-medium rounded-lg hover:bg-light-hover dark:hover:bg-dark-hover transition-colors">
                        Print Health Card
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl flex flex-col items-center justify-center py-16 gap-3">
              <div className="w-12 h-12 bg-light-hover dark:bg-dark-hover rounded-full flex items-center justify-center">
                <HeartPulse
                  size={22}
                  className="text-light-text-tertiary dark:text-dark-text-tertiary"
                />
              </div>
              <p className="text-light-text-secondary dark:text-dark-text-secondary text-sm font-medium">
                No health records found
              </p>
            </div>
          )}
        </div>
      )}

      {/* Incident Log Tab */}
      {activeTab === "Incident Log" && (
        <div className="bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl overflow-hidden">
          <div className="grid grid-cols-5 px-4 py-3 border-b border-light-border dark:border-dark-border">
            {[
              "Student",
              "Date",
              "Incident",
              "Action Taken",
              "Parent Notified",
            ].map((h) => (
              <span
                key={h}
                className="text-xs font-medium text-light-text-tertiary dark:text-dark-text-tertiary uppercase tracking-wide"
              >
                {h}
              </span>
            ))}
          </div>
          {filteredIncidents.length > 0 ? (
            filteredIncidents.map((incident) => (
              <div
                key={incident.id}
                className="grid grid-cols-5 px-4 py-3 border-b border-light-border dark:border-dark-border last:border-0 hover:bg-light-hover dark:hover:bg-dark-hover transition-colors items-center"
              >
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-accent/10 flex items-center justify-center text-accent text-xs font-medium shrink-0">
                    {incident.studentName.charAt(0)}
                  </div>
                  <span className="text-sm font-medium text-light-text-primary dark:text-dark-text-primary">
                    {incident.studentName}
                  </span>
                </div>
                <span className="text-xs text-light-text-secondary dark:text-dark-text-secondary">
                  {incident.date}
                </span>
                <span className="text-xs text-light-text-secondary dark:text-dark-text-secondary pr-2">
                  {incident.incident}
                </span>
                <span className="text-xs text-light-text-secondary dark:text-dark-text-secondary pr-2">
                  {incident.action}
                </span>
                <span
                  className={`text-xs px-2 py-0.5 rounded-md font-medium w-fit ${
                    incident.parentNotified
                      ? "bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-400"
                      : "bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-400"
                  }`}
                >
                  {incident.parentNotified ? "Yes" : "No"}
                </span>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <div className="w-12 h-12 bg-light-hover dark:bg-dark-hover rounded-full flex items-center justify-center">
                <FileText
                  size={22}
                  className="text-light-text-tertiary dark:text-dark-text-tertiary"
                />
              </div>
              <p className="text-light-text-secondary dark:text-dark-text-secondary text-sm font-medium">
                No incidents recorded
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default HealthRecords;
