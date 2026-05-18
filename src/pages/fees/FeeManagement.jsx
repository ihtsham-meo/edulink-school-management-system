import { useState, useMemo } from "react";
import {
  Search,
  Download,
  Banknote,
  TrendingUp,
  AlertCircle,
  Clock,
} from "lucide-react";
import PageHeader from "../../components/common/PageHeader";
import StatusPill from "../../components/common/StatusPill";
import { mockFeePayments, feeStatusStyles } from "../../data/mockData";

const months = ["All Months", "May 2026", "April 2026", "March 2026"];
const statuses = ["All", "paid", "pending", "overdue"];

function FeeManagement() {
  const [search, setSearch] = useState("");
  const [selectedMonth, setMonth] = useState("All Months");
  const [selectedStatus, setStatus] = useState("All");

  // ── Filtered payments ──
  const filtered = useMemo(() => {
    return mockFeePayments.filter((p) => {
      const matchSearch =
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.class.toLowerCase().includes(search.toLowerCase());
      const matchMonth =
        selectedMonth === "All Months" || p.month === selectedMonth;
      const matchStatus =
        selectedStatus === "All" || p.status === selectedStatus;
      return matchSearch && matchMonth && matchStatus;
    });
  }, [search, selectedMonth, selectedStatus]);

  // ── Summary counts ──
  const summary = useMemo(
    () => ({
      total: mockFeePayments.reduce((sum, p) => sum + p.amount, 0),
      paid: mockFeePayments
        .filter((p) => p.status === "paid")
        .reduce((sum, p) => sum + p.amount, 0),
      pending: mockFeePayments.filter((p) => p.status === "pending").length,
      overdue: mockFeePayments.filter((p) => p.status === "overdue").length,
    }),
    [],
  );

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <PageHeader
        title="Fee Management"
        subtitle="Track and manage student fee payments"
        action={
          <button className="flex items-center gap-2 px-4 py-2 bg-accent hover:bg-accent-hover text-white text-sm font-medium rounded-lg transition-colors">
            <Download size={16} />
            Export Report
          </button>
        }
      />

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Total Expected",
            value: `Rs ${summary.total.toLocaleString()}`,
            icon: Banknote,
            bg: "bg-blue-50 dark:bg-blue-950",
            text: "text-blue-600 dark:text-blue-400",
            iconBg: "bg-blue-100 dark:bg-blue-900",
          },
          {
            label: "Total Collected",
            value: `Rs ${summary.paid.toLocaleString()}`,
            icon: TrendingUp,
            bg: "bg-green-50 dark:bg-green-950",
            text: "text-green-600 dark:text-green-400",
            iconBg: "bg-green-100 dark:bg-green-900",
          },
          {
            label: "Pending",
            value: summary.pending,
            icon: Clock,
            bg: "bg-amber-50 dark:bg-amber-950",
            text: "text-amber-600 dark:text-amber-400",
            iconBg: "bg-amber-100 dark:bg-amber-900",
          },
          {
            label: "Overdue",
            value: summary.overdue,
            icon: AlertCircle,
            bg: "bg-red-50 dark:bg-red-950",
            text: "text-red-600 dark:text-red-400",
            iconBg: "bg-red-100 dark:bg-red-900",
          },
        ].map((card) => (
          <div
            key={card.label}
            className={`${card.bg} rounded-xl p-4 flex items-center gap-4`}
          >
            <div
              className={`w-10 h-10 ${card.iconBg} rounded-lg flex items-center justify-center shrink-0`}
            >
              <card.icon size={18} className={card.text} />
            </div>
            <div>
              <p className={`text-xl font-semibold ${card.text}`}>
                {card.value}
              </p>
              <p className={`text-xs ${card.text} opacity-75`}>{card.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-light-text-tertiary dark:text-dark-text-tertiary"
            />
            <input
              type="text"
              placeholder="Search by student name or class..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-lg bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border text-light-text-primary dark:text-dark-text-primary placeholder:text-light-text-tertiary dark:placeholder:text-dark-text-tertiary text-sm outline-none focus:border-accent transition-colors"
            />
          </div>

          {/* Month filter */}
          <select
            value={selectedMonth}
            onChange={(e) => setMonth(e.target.value)}
            className="px-3 py-2 rounded-lg bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border text-light-text-primary dark:text-dark-text-primary text-sm outline-none focus:border-accent transition-colors"
          >
            {months.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>

          {/* Status filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setStatus(e.target.value)}
            className="px-3 py-2 rounded-lg bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border text-light-text-primary dark:text-dark-text-primary text-sm outline-none focus:border-accent transition-colors"
          >
            {statuses.map((s) => (
              <option key={s} value={s}>
                {s === "All"
                  ? "All Status"
                  : s.charAt(0).toUpperCase() + s.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl overflow-hidden">
        {/* Header */}
        <div className="grid grid-cols-6 px-4 py-3 border-b border-light-border dark:border-dark-border">
          {["Student", "Class", "Month", "Amount", "Method", "Status"].map(
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

        {/* Rows */}
        {filtered.length > 0 ? (
          filtered.map((payment) => (
            <div
              key={payment.id}
              className="grid grid-cols-6 px-4 py-3 border-b border-light-border dark:border-dark-border last:border-0 hover:bg-light-hover dark:hover:bg-dark-hover transition-colors items-center"
            >
              {/* Student */}
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-accent text-xs font-medium shrink-0">
                  {payment.name.charAt(0)}
                </div>
                <span className="text-sm font-medium text-light-text-primary dark:text-dark-text-primary truncate">
                  {payment.name}
                </span>
              </div>

              {/* Class */}
              <span className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                {payment.class}
              </span>

              {/* Month */}
              <span className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                {payment.month}
              </span>

              {/* Amount */}
              <span className="text-sm font-medium text-light-text-primary dark:text-dark-text-primary">
                Rs {payment.amount.toLocaleString()}
              </span>

              {/* Method */}
              <span className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                {payment.method || "—"}
              </span>

              {/* Status */}
              <StatusPill status={payment.status} styles={feeStatusStyles} />
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <div className="w-12 h-12 bg-light-hover dark:bg-dark-hover rounded-full flex items-center justify-center">
              <Banknote
                size={22}
                className="text-light-text-tertiary dark:text-dark-text-tertiary"
              />
            </div>
            <p className="text-light-text-secondary dark:text-dark-text-secondary text-sm font-medium">
              No payments found
            </p>
            <p className="text-light-text-tertiary dark:text-dark-text-tertiary text-xs">
              Try adjusting your search or filters
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default FeeManagement;
