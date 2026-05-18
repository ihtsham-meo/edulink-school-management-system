import { useState, useMemo } from "react";
import {
  Search,
  Banknote,
  Users,
  TrendingUp,
  Clock,
  Eye,
  Printer,
} from "lucide-react";
import PageHeader from "../../components/common/PageHeader";
import StatusPill from "../../components/common/StatusPill";
import { mockSalaries } from "../../data/mockData";

const salaryStatusStyles = {
  paid: "bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-400",
  unpaid: "bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-400",
};

const months = ["All Months", "May 2026", "April 2026", "March 2026"];

function ManageSalaries() {
  const [search, setSearch] = useState("");
  const [selectedMonth, setMonth] = useState("All Months");
  const [selectedStatus, setStatus] = useState("All");

  const filtered = useMemo(() => {
    return mockSalaries.filter((s) => {
      const matchSearch =
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.empCode.toLowerCase().includes(search.toLowerCase());
      const matchMonth =
        selectedMonth === "All Months" || s.month === selectedMonth;
      const matchStatus =
        selectedStatus === "All" || s.status === selectedStatus;
      return matchSearch && matchMonth && matchStatus;
    });
  }, [search, selectedMonth, selectedStatus]);

  const summary = useMemo(
    () => ({
      total: mockSalaries.reduce((sum, s) => sum + s.generated, 0),
      paid: mockSalaries
        .filter((s) => s.status === "paid")
        .reduce((sum, s) => sum + s.paid, 0),
      unpaidCount: mockSalaries.filter((s) => s.status === "unpaid").length,
      staff: mockSalaries.length,
    }),
    [],
  );

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Salary Management"
        subtitle="Manage and track staff salary payments"
        action={
          <button className="flex items-center gap-2 px-4 py-2 bg-accent hover:bg-accent-hover text-white text-sm font-medium rounded-lg transition-colors">
            <Banknote size={16} />
            Generate Salary
          </button>
        }
      />

      {/* Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Total Generated",
            value: `Rs ${summary.total.toLocaleString()}`,
            bg: "bg-blue-50 dark:bg-blue-950",
            text: "text-blue-600 dark:text-blue-400",
            icon: TrendingUp,
          },
          {
            label: "Total Paid",
            value: `Rs ${summary.paid.toLocaleString()}`,
            bg: "bg-green-50 dark:bg-green-950",
            text: "text-green-600 dark:text-green-400",
            icon: Banknote,
          },
          {
            label: "Unpaid",
            value: summary.unpaidCount,
            bg: "bg-red-50 dark:bg-red-950",
            text: "text-red-600 dark:text-red-400",
            icon: Clock,
          },
          {
            label: "Total Staff",
            value: summary.staff,
            bg: "bg-purple-50 dark:bg-purple-950",
            text: "text-purple-600 dark:text-purple-400",
            icon: Users,
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
          <div className="relative flex-1">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-light-text-tertiary dark:text-dark-text-tertiary"
            />
            <input
              type="text"
              placeholder="Search by name or employee code..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-lg bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border text-light-text-primary dark:text-dark-text-primary placeholder:text-light-text-tertiary dark:placeholder:text-dark-text-tertiary text-sm outline-none focus:border-accent transition-colors"
            />
          </div>
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
          <select
            value={selectedStatus}
            onChange={(e) => setStatus(e.target.value)}
            className="px-3 py-2 rounded-lg bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border text-light-text-primary dark:text-dark-text-primary text-sm outline-none focus:border-accent transition-colors"
          >
            {["All", "paid", "unpaid"].map((s) => (
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
        <div className="grid grid-cols-8 px-4 py-3 border-b border-light-border dark:border-dark-border">
          {[
            "Staff",
            "Month",
            "Basic",
            "Present",
            "Absent",
            "Generated",
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

        {/* Rows */}
        {filtered.length > 0 ? (
          filtered.map((salary) => (
            <div
              key={salary.id}
              className="grid grid-cols-8 px-4 py-3 border-b border-light-border dark:border-dark-border last:border-0 hover:bg-light-hover dark:hover:bg-dark-hover transition-colors items-center"
            >
              {/* Staff */}
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-accent/10 flex items-center justify-center text-accent text-xs font-medium shrink-0">
                  {salary.name.charAt(0)}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-medium text-light-text-primary dark:text-dark-text-primary truncate">
                    {salary.name}
                  </p>
                  <p className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary">
                    {salary.empCode}
                  </p>
                </div>
              </div>

              {/* Month */}
              <span className="text-xs text-light-text-secondary dark:text-dark-text-secondary">
                {salary.month}
              </span>

              {/* Basic */}
              <span className="text-xs text-light-text-secondary dark:text-dark-text-secondary">
                Rs {salary.basic.toLocaleString()}
              </span>

              {/* Present */}
              <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                {salary.present} days
              </span>

              {/* Absent */}
              <span className="text-xs text-red-600 dark:text-red-400 font-medium">
                {salary.absent} days
              </span>

              {/* Generated */}
              <span className="text-xs font-semibold text-light-text-primary dark:text-dark-text-primary">
                Rs {salary.generated.toLocaleString()}
              </span>

              {/* Status */}
              <StatusPill status={salary.status} styles={salaryStatusStyles} />

              {/* Actions */}
              <div className="flex items-center gap-1">
                <button className="w-7 h-7 flex items-center justify-center rounded-lg text-light-text-tertiary dark:text-dark-text-tertiary hover:bg-blue-50 dark:hover:bg-blue-950 hover:text-blue-600 transition-colors">
                  <Eye size={13} />
                </button>
                <button className="w-7 h-7 flex items-center justify-center rounded-lg text-light-text-tertiary dark:text-dark-text-tertiary hover:bg-green-50 dark:hover:bg-green-950 hover:text-green-600 transition-colors">
                  <Printer size={13} />
                </button>
                {salary.status === "unpaid" && (
                  <button className="px-2 py-1 text-xs bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors">
                    Pay
                  </button>
                )}
              </div>
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
              No salary records found
            </p>
            <p className="text-light-text-tertiary dark:text-dark-text-tertiary text-xs">
              Try adjusting your filters
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ManageSalaries;
