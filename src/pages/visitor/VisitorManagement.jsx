import { useState, useMemo } from "react";
import {
  Search,
  Plus,
  Eye,
  LogOut,
  Shield,
  AlertTriangle,
  Users,
  UserCheck,
} from "lucide-react";
import PageHeader from "../../components/common/PageHeader";
import StatusPill from "../../components/common/StatusPill";
import { mockVisitors, mockBlacklist } from "../../data/mockData";

const visitorStatusStyles = {
  inside: "bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-400",
  exited: "bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-400",
};

const tabs = ["Today's Log", "Currently Inside", "Blacklist"];

function VisitorManagement() {
  const [activeTab, setTab] = useState("Today's Log");
  const [search, setSearch] = useState("");
  const [visitors, setVisitors] = useState(mockVisitors);
  const [blacklist, setBlacklist] = useState(mockBlacklist);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    name: "",
    cnic: "",
    phone: "",
    purpose: "",
    host: "",
    vehicle: "",
  });

  const today = "2026-05-14";

  const filtered = useMemo(() => {
    return visitors.filter((v) => {
      const matchSearch =
        v.name.toLowerCase().includes(search.toLowerCase()) ||
        v.cnic.includes(search) ||
        v.purpose.toLowerCase().includes(search.toLowerCase());
      const matchTab =
        activeTab === "Today's Log"
          ? v.entry.startsWith(today)
          : activeTab === "Currently Inside"
            ? v.status === "inside"
            : false;
      return matchSearch && matchTab;
    });
  }, [search, visitors, activeTab]);

  const filteredBlacklist = useMemo(() => {
    return blacklist.filter(
      (b) =>
        b.name.toLowerCase().includes(search.toLowerCase()) ||
        b.cnic.includes(search),
    );
  }, [search, blacklist]);

  const summary = useMemo(
    () => ({
      todayTotal: visitors.filter((v) => v.entry.startsWith(today)).length,
      inside: visitors.filter((v) => v.status === "inside").length,
      exited: visitors.filter(
        (v) => v.entry.startsWith(today) && v.status === "exited",
      ).length,
      blacklisted: blacklist.length,
    }),
    [visitors, blacklist],
  );

  const handleMarkExit = (id) => {
    setVisitors((prev) =>
      prev.map((v) =>
        v.id === id
          ? { ...v, status: "exited", exit: new Date().toLocaleString() }
          : v,
      ),
    );
  };

  const handleAddVisitor = () => {
    if (!form.name || !form.cnic || !form.purpose) return;
    const isBlacklisted = blacklist.some((b) => b.cnic === form.cnic);
    if (isBlacklisted) {
      alert("⚠️ This visitor is BLACKLISTED! Entry not allowed.");
      return;
    }
    const newVisitor = {
      id: visitors.length + 1,
      name: form.name,
      cnic: form.cnic,
      phone: form.phone,
      purpose: form.purpose,
      host: form.host,
      hostType: "staff",
      entry: `${today} ${new Date().toLocaleTimeString()}`,
      exit: null,
      vehicle: form.vehicle,
      status: "inside",
      blacklisted: false,
    };
    setVisitors((prev) => [newVisitor, ...prev]);
    setForm({
      name: "",
      cnic: "",
      phone: "",
      purpose: "",
      host: "",
      vehicle: "",
    });
    setShowModal(false);
  };

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Visitor Management"
        subtitle="Track and manage school visitors"
        action={
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-accent hover:bg-accent-hover text-white text-sm font-medium rounded-lg transition-colors"
          >
            <Plus size={16} />
            Log Visitor
          </button>
        }
      />

      {/* Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Today's Visitors",
            value: summary.todayTotal,
            bg: "bg-blue-50 dark:bg-blue-950",
            text: "text-blue-600 dark:text-blue-400",
            icon: Users,
          },
          {
            label: "Currently Inside",
            value: summary.inside,
            bg: "bg-green-50 dark:bg-green-950",
            text: "text-green-600 dark:text-green-400",
            icon: UserCheck,
          },
          {
            label: "Exited Today",
            value: summary.exited,
            bg: "bg-gray-50 dark:bg-gray-900",
            text: "text-gray-600 dark:text-gray-400",
            icon: LogOut,
          },
          {
            label: "Blacklisted",
            value: summary.blacklisted,
            bg: "bg-red-50 dark:bg-red-950",
            text: "text-red-600 dark:text-red-400",
            icon: Shield,
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
            placeholder="Search by name, CNIC or purpose..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border text-light-text-primary dark:text-dark-text-primary placeholder:text-light-text-tertiary dark:placeholder:text-dark-text-tertiary text-sm outline-none focus:border-accent transition-colors"
          />
        </div>
      </div>

      {/* Visitor Log / Currently Inside */}
      {activeTab !== "Blacklist" && (
        <div className="bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl overflow-hidden">
          <div className="grid grid-cols-7 px-4 py-3 border-b border-light-border dark:border-dark-border">
            {[
              "Visitor",
              "CNIC",
              "Purpose",
              "Host",
              "Entry Time",
              "Status",
              "Actions",
            ].map((h) => (
              <span
                key={h}
                className="text-xs font-medium text-light-text-tertiary dark:text-dark-text-tertiary uppercase tracking-wide"
              >
                {h}
              </span>
            ))}
          </div>
          {filtered.length > 0 ? (
            filtered.map((visitor) => (
              <div
                key={visitor.id}
                className={`grid grid-cols-7 px-4 py-3 border-b border-light-border dark:border-dark-border last:border-0 hover:bg-light-hover dark:hover:bg-dark-hover transition-colors items-center ${visitor.blacklisted ? "bg-red-50/50 dark:bg-red-950/20" : ""}`}
              >
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-accent/10 flex items-center justify-center text-accent text-xs font-medium shrink-0">
                    {visitor.name.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-light-text-primary dark:text-dark-text-primary truncate">
                      {visitor.name}
                    </p>
                    {visitor.blacklisted && (
                      <span className="text-xs text-red-500 flex items-center gap-0.5">
                        <AlertTriangle size={10} /> Blacklisted
                      </span>
                    )}
                  </div>
                </div>
                <span className="text-xs text-light-text-secondary dark:text-dark-text-secondary">
                  {visitor.cnic}
                </span>
                <span className="text-xs text-light-text-secondary dark:text-dark-text-secondary truncate">
                  {visitor.purpose}
                </span>
                <span className="text-xs text-light-text-secondary dark:text-dark-text-secondary truncate">
                  {visitor.host || "—"}
                </span>
                <span className="text-xs text-light-text-secondary dark:text-dark-text-secondary">
                  {visitor.entry.split(" ")[1]}
                </span>
                <StatusPill
                  status={visitor.status}
                  styles={visitorStatusStyles}
                />
                <div className="flex gap-1">
                  <button className="w-7 h-7 flex items-center justify-center rounded-lg text-light-text-tertiary dark:text-dark-text-tertiary hover:bg-blue-50 dark:hover:bg-blue-950 hover:text-blue-600 transition-colors">
                    <Eye size={13} />
                  </button>
                  {visitor.status === "inside" && (
                    <button
                      onClick={() => handleMarkExit(visitor.id)}
                      className="flex items-center gap-1 px-2 py-1 text-xs bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 rounded-lg hover:bg-amber-500 hover:text-white transition-colors"
                    >
                      <LogOut size={11} />
                      Exit
                    </button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <div className="w-12 h-12 bg-light-hover dark:bg-dark-hover rounded-full flex items-center justify-center">
                <Users
                  size={22}
                  className="text-light-text-tertiary dark:text-dark-text-tertiary"
                />
              </div>
              <p className="text-light-text-secondary dark:text-dark-text-secondary text-sm font-medium">
                No visitors found
              </p>
            </div>
          )}
        </div>
      )}

      {/* Blacklist Tab */}
      {activeTab === "Blacklist" && (
        <div className="bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl overflow-hidden">
          <div className="grid grid-cols-4 px-4 py-3 border-b border-light-border dark:border-dark-border">
            {["Name", "CNIC", "Reason", "Date Added"].map((h) => (
              <span
                key={h}
                className="text-xs font-medium text-light-text-tertiary dark:text-dark-text-tertiary uppercase tracking-wide"
              >
                {h}
              </span>
            ))}
          </div>
          {filteredBlacklist.length > 0 ? (
            filteredBlacklist.map((person) => (
              <div
                key={person.id}
                className="grid grid-cols-4 px-4 py-3 border-b border-light-border dark:border-dark-border last:border-0 hover:bg-light-hover dark:hover:bg-dark-hover transition-colors items-center"
              >
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-red-100 dark:bg-red-950 flex items-center justify-center text-red-600 dark:text-red-400 text-xs font-medium shrink-0">
                    <Shield size={13} />
                  </div>
                  <span className="text-sm font-medium text-light-text-primary dark:text-dark-text-primary">
                    {person.name}
                  </span>
                </div>
                <span className="text-xs text-light-text-secondary dark:text-dark-text-secondary">
                  {person.cnic}
                </span>
                <span className="text-xs text-light-text-secondary dark:text-dark-text-secondary">
                  {person.reason}
                </span>
                <span className="text-xs text-light-text-secondary dark:text-dark-text-secondary">
                  {person.addedDate}
                </span>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <div className="w-12 h-12 bg-light-hover dark:bg-dark-hover rounded-full flex items-center justify-center">
                <Shield
                  size={22}
                  className="text-light-text-tertiary dark:text-dark-text-tertiary"
                />
              </div>
              <p className="text-light-text-secondary dark:text-dark-text-secondary text-sm font-medium">
                No blacklisted visitors
              </p>
            </div>
          )}
        </div>
      )}

      {/* Log Visitor Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl p-6 w-full max-w-lg">
            <h2 className="text-base font-semibold text-light-text-primary dark:text-dark-text-primary mb-5">
              Log New Visitor
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {[
                {
                  label: "Full Name",
                  key: "name",
                  placeholder: "Visitor name",
                  type: "text",
                },
                {
                  label: "CNIC",
                  key: "cnic",
                  placeholder: "35201-XXXXXXX-X",
                  type: "text",
                },
                {
                  label: "Phone",
                  key: "phone",
                  placeholder: "03XXXXXXXXX",
                  type: "text",
                },
                {
                  label: "Vehicle No.",
                  key: "vehicle",
                  placeholder: "LHR-XXXX (optional)",
                  type: "text",
                },
                {
                  label: "Purpose",
                  key: "purpose",
                  placeholder: "Reason for visit",
                  type: "text",
                },
                {
                  label: "Host / Whom to meet",
                  key: "host",
                  placeholder: "Staff name",
                  type: "text",
                },
              ].map((field) => (
                <div key={field.key} className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-light-text-primary dark:text-dark-text-primary">
                    {field.label}
                  </label>
                  <input
                    type={field.type}
                    value={form[field.key]}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        [field.key]: e.target.value,
                      }))
                    }
                    placeholder={field.placeholder}
                    className="w-full px-3 py-2 rounded-lg bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border text-light-text-primary dark:text-dark-text-primary placeholder:text-light-text-tertiary dark:placeholder:text-dark-text-tertiary text-sm outline-none focus:border-accent transition-colors"
                  />
                </div>
              ))}
            </div>
            <div className="flex gap-3 mt-5">
              <button
                onClick={handleAddVisitor}
                className="flex-1 py-2.5 bg-accent hover:bg-accent-hover text-white text-sm font-medium rounded-lg transition-colors"
              >
                Log Visitor
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

export default VisitorManagement;
