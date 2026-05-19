import { useState, useMemo } from "react";
import {
  Database,
  Download,
  RefreshCw,
  Shield,
  LogIn,
  Trash2,
  RotateCcw,
  CheckCircle,
  XCircle,
  Search,
  AlertTriangle,
} from "lucide-react";
import PageHeader from "../../components/common/PageHeader";
import {
  mockBackups,
  mockAuditLogs,
  mockLoginLogs,
  mockRecycleBin,
} from "../../data/mockData";

const tabs = ["Backups", "Audit Log", "Login Logs", "Recycle Bin"];

const actionStyles = {
  create: "bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-400",
  update: "bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-400",
  delete: "bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-400",
};

const roleStyles = {
  admin: "bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400",
  teacher: "bg-green-50 dark:bg-green-950 text-green-600 dark:text-green-400",
  unknown: "bg-red-50 dark:bg-red-950 text-red-600 dark:text-red-400",
};

function SystemBackups() {
  const [activeTab, setTab] = useState("Backups");
  const [search, setSearch] = useState("");
  const [backups, setBackups] = useState(mockBackups);
  const [recycleBin, setRecycleBin] = useState(mockRecycleBin);
  const [backingUp, setBackingUp] = useState(false);

  const filteredAudit = useMemo(() => {
    return mockAuditLogs.filter(
      (l) =>
        l.user.toLowerCase().includes(search.toLowerCase()) ||
        l.module.toLowerCase().includes(search.toLowerCase()) ||
        l.record.toLowerCase().includes(search.toLowerCase()),
    );
  }, [search]);

  const filteredLogin = useMemo(() => {
    return mockLoginLogs.filter(
      (l) =>
        l.name.toLowerCase().includes(search.toLowerCase()) ||
        l.ip.includes(search),
    );
  }, [search]);

  const handleBackupNow = () => {
    setBackingUp(true);
    setTimeout(() => {
      const newBackup = {
        id: backups.length + 1,
        filename: `backup_2026_05_15.sql`,
        size: "24.7 MB",
        createdAt: new Date().toLocaleString(),
        status: "success",
      };
      setBackups((prev) => [newBackup, ...prev]);
      setBackingUp(false);
    }, 2000);
  };

  const handleRestore = (id) => {
    setRecycleBin((prev) => prev.filter((r) => r.id !== id));
  };

  const handlePermanentDelete = (id) => {
    setRecycleBin((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="System & Utilities"
        subtitle="Manage backups, logs and system data"
      />

      {/* Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Total Backups",
            value: backups.length,
            bg: "bg-blue-50 dark:bg-blue-950",
            text: "text-blue-600 dark:text-blue-400",
          },
          {
            label: "Successful",
            value: backups.filter((b) => b.status === "success").length,
            bg: "bg-green-50 dark:bg-green-950",
            text: "text-green-600 dark:text-green-400",
          },
          {
            label: "Audit Logs",
            value: mockAuditLogs.length,
            bg: "bg-purple-50 dark:bg-purple-950",
            text: "text-purple-600 dark:text-purple-400",
          },
          {
            label: "Recycle Bin",
            value: recycleBin.length,
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
      {activeTab !== "Backups" && activeTab !== "Recycle Bin" && (
        <div className="bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl p-4">
          <div className="relative">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-light-text-tertiary dark:text-dark-text-tertiary"
            />
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-lg bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border text-light-text-primary dark:text-dark-text-primary placeholder:text-light-text-tertiary dark:placeholder:text-dark-text-tertiary text-sm outline-none focus:border-accent transition-colors"
            />
          </div>
        </div>
      )}

      {/* Backups Tab */}
      {activeTab === "Backups" && (
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
              Backups are created automatically every day at 2:00 AM
            </p>
            <button
              onClick={handleBackupNow}
              disabled={backingUp}
              className="flex items-center gap-2 px-4 py-2 bg-accent hover:bg-accent-hover text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-60"
            >
              <RefreshCw
                size={15}
                className={backingUp ? "animate-spin" : ""}
              />
              {backingUp ? "Creating Backup..." : "Backup Now"}
            </button>
          </div>

          <div className="bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl overflow-hidden">
            <div className="grid grid-cols-4 px-4 py-3 border-b border-light-border dark:border-dark-border">
              {["Filename", "Size", "Created At", "Actions"].map((h) => (
                <span
                  key={h}
                  className="text-xs font-medium text-light-text-tertiary dark:text-dark-text-tertiary uppercase tracking-wide"
                >
                  {h}
                </span>
              ))}
            </div>
            {backups.map((backup) => (
              <div
                key={backup.id}
                className="grid grid-cols-4 px-4 py-3 border-b border-light-border dark:border-dark-border last:border-0 hover:bg-light-hover dark:hover:bg-dark-hover transition-colors items-center"
              >
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 bg-accent/10 rounded-lg flex items-center justify-center shrink-0">
                    <Database size={13} className="text-accent" />
                  </div>
                  <span className="text-sm font-medium text-light-text-primary dark:text-dark-text-primary truncate">
                    {backup.filename}
                  </span>
                </div>
                <span className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                  {backup.size}
                </span>
                <div className="flex items-center gap-2">
                  {backup.status === "success" ? (
                    <CheckCircle
                      size={14}
                      className="text-green-500 shrink-0"
                    />
                  ) : (
                    <XCircle size={14} className="text-red-500 shrink-0" />
                  )}
                  <span className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                    {backup.createdAt}
                  </span>
                </div>
                <div className="flex gap-2">
                  {backup.status === "success" && (
                    <>
                      <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-accent/10 text-accent rounded-lg hover:bg-accent hover:text-white transition-colors font-medium">
                        <Download size={12} />
                        Download
                      </button>
                      <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border text-light-text-secondary dark:text-dark-text-secondary rounded-lg hover:bg-light-hover dark:hover:bg-dark-hover transition-colors font-medium">
                        <RotateCcw size={12} />
                        Restore
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Audit Log Tab */}
      {activeTab === "Audit Log" && (
        <div className="bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl overflow-hidden">
          <div className="grid grid-cols-6 px-4 py-3 border-b border-light-border dark:border-dark-border">
            {["User", "Module", "Action", "Record", "Change", "Time"].map(
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
          {filteredAudit.map((log) => (
            <div
              key={log.id}
              className="grid grid-cols-6 px-4 py-3 border-b border-light-border dark:border-dark-border last:border-0 hover:bg-light-hover dark:hover:bg-dark-hover transition-colors items-center"
            >
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-accent/10 flex items-center justify-center text-accent text-xs font-medium shrink-0">
                  {log.user.charAt(0)}
                </div>
                <span className="text-xs font-medium text-light-text-primary dark:text-dark-text-primary truncate">
                  {log.user}
                </span>
              </div>
              <span className="text-xs text-light-text-secondary dark:text-dark-text-secondary">
                {log.module}
              </span>
              <span
                className={`text-xs px-2 py-0.5 rounded-md font-medium w-fit ${actionStyles[log.action]}`}
              >
                {log.action.charAt(0).toUpperCase() + log.action.slice(1)}
              </span>
              <span className="text-xs text-light-text-secondary dark:text-dark-text-secondary truncate">
                {log.record}
              </span>
              <div className="flex flex-col gap-0.5">
                {log.oldValue && (
                  <span className="text-xs text-red-500 line-through truncate">
                    {log.oldValue}
                  </span>
                )}
                <span className="text-xs text-green-600 dark:text-green-400 truncate">
                  {log.newValue}
                </span>
              </div>
              <span className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary">
                {log.createdAt}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Login Logs Tab */}
      {activeTab === "Login Logs" && (
        <div className="bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl overflow-hidden">
          <div className="grid grid-cols-5 px-4 py-3 border-b border-light-border dark:border-dark-border">
            {["User", "Role", "IP Address", "Device", "Last Active"].map(
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
          {filteredLogin.map((log) => (
            <div
              key={log.id}
              className={`grid grid-cols-5 px-4 py-3 border-b border-light-border dark:border-dark-border last:border-0 hover:bg-light-hover dark:hover:bg-dark-hover transition-colors items-center ${
                log.status === "failed" ? "bg-red-50/30 dark:bg-red-950/20" : ""
              }`}
            >
              <div className="flex items-center gap-2">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium shrink-0 ${
                    log.status === "failed"
                      ? "bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-400"
                      : "bg-accent/10 text-accent"
                  }`}
                >
                  {log.status === "failed" ? (
                    <AlertTriangle size={12} />
                  ) : (
                    log.name.charAt(0)
                  )}
                </div>
                <span className="text-sm font-medium text-light-text-primary dark:text-dark-text-primary">
                  {log.name}
                </span>
              </div>
              <span
                className={`text-xs px-2 py-0.5 rounded-md font-medium w-fit ${roleStyles[log.role]}`}
              >
                {log.role.charAt(0).toUpperCase() + log.role.slice(1)}
              </span>
              <span className="text-xs text-light-text-secondary dark:text-dark-text-secondary">
                {log.ip}
              </span>
              <span className="text-xs text-light-text-secondary dark:text-dark-text-secondary truncate">
                {log.device}
              </span>
              <div className="flex items-center gap-1.5">
                {log.status === "success" ? (
                  <CheckCircle
                    size={12}
                    className="text-green-500 shrink-0"
                  />
                ) : (
                  <XCircle size={12} className="text-red-500 shrink-0" />
                )}
                <span className="text-xs text-light-text-secondary dark:text-dark-text-secondary">
                  {log.lastActive}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Recycle Bin Tab */}
      {activeTab === "Recycle Bin" && (
        <div className="bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl overflow-hidden">
          <div className="grid grid-cols-4 px-4 py-3 border-b border-light-border dark:border-dark-border">
            {["Item", "Type", "Deleted By", "Actions"].map((h) => (
              <span
                key={h}
                className="text-xs font-medium text-light-text-tertiary dark:text-dark-text-tertiary uppercase tracking-wide"
              >
                {h}
              </span>
            ))}
          </div>
          {recycleBin.length > 0 ? (
            recycleBin.map((item) => (
              <div
                key={item.id}
                className="grid grid-cols-4 px-4 py-3 border-b border-light-border dark:border-dark-border last:border-0 hover:bg-light-hover dark:hover:bg-dark-hover transition-colors items-center"
              >
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 bg-red-50 dark:bg-red-950 rounded-lg flex items-center justify-center shrink-0">
                    <Trash2 size={13} className="text-red-500" />
                  </div>
                  <span className="text-sm font-medium text-light-text-primary dark:text-dark-text-primary truncate">
                    {item.name}
                  </span>
                </div>
                <span className="text-xs px-2 py-0.5 rounded-md bg-accent/10 text-accent font-medium w-fit">
                  {item.type}
                </span>
                <div>
                  <p className="text-xs text-light-text-secondary dark:text-dark-text-secondary">
                    {item.deletedBy}
                  </p>
                  <p className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary">
                    {item.deletedAt}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleRestore(item.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-green-50 dark:bg-green-950 text-green-600 dark:text-green-400 rounded-lg hover:bg-green-500 hover:text-white transition-colors font-medium"
                  >
                    <RotateCcw size={11} />
                    Restore
                  </button>
                  <button
                    onClick={() => handlePermanentDelete(item.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-red-50 dark:bg-red-950 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-500 hover:text-white transition-colors font-medium"
                  >
                    <Trash2 size={11} />
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <div className="w-12 h-12 bg-light-hover dark:bg-dark-hover rounded-full flex items-center justify-center">
                <Trash2
                  size={22}
                  className="text-light-text-tertiary dark:text-dark-text-tertiary"
                />
              </div>
              <p className="text-light-text-secondary dark:text-dark-text-secondary text-sm font-medium">
                Recycle bin is empty
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default SystemBackups;
