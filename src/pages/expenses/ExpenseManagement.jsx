import { useMemo, useState } from "react";
import {
  Banknote,
  Clock,
  Download,
  Plus,
  Search,
  TrendingDown,
} from "lucide-react";
import PageHeader from "../../components/common/PageHeader";
import StatusPill from "../../components/common/StatusPill";

const expenseStatusStyles = {
  paid: "bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-400",
  pending: "bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400",
  rejected: "bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-400",
};

const mockExpenses = [
  {
    id: 1,
    title: "Science lab supplies",
    category: "Academic",
    date: "2026-05-14",
    amount: 28500,
    vendor: "Metro Scientific",
    status: "paid",
  },
  {
    id: 2,
    title: "Bus fuel refill",
    category: "Transport",
    date: "2026-05-13",
    amount: 42000,
    vendor: "City Fuel Station",
    status: "pending",
  },
  {
    id: 3,
    title: "Classroom repairs",
    category: "Maintenance",
    date: "2026-05-11",
    amount: 18500,
    vendor: "Apex Works",
    status: "paid",
  },
  {
    id: 4,
    title: "Sports equipment",
    category: "Activities",
    date: "2026-05-08",
    amount: 33600,
    vendor: "Champion Store",
    status: "rejected",
  },
];

const categories = ["All Categories", "Academic", "Transport", "Maintenance", "Activities"];
const statuses = ["All", "paid", "pending", "rejected"];

function ExpenseManagement() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setCategory] = useState("All Categories");
  const [selectedStatus, setStatus] = useState("All");

  const filtered = useMemo(() => {
    return mockExpenses.filter((expense) => {
      const matchSearch =
        expense.title.toLowerCase().includes(search.toLowerCase()) ||
        expense.vendor.toLowerCase().includes(search.toLowerCase());
      const matchCategory =
        selectedCategory === "All Categories" ||
        expense.category === selectedCategory;
      const matchStatus =
        selectedStatus === "All" || expense.status === selectedStatus;

      return matchSearch && matchCategory && matchStatus;
    });
  }, [search, selectedCategory, selectedStatus]);

  const summary = useMemo(
    () => ({
      total: mockExpenses.reduce((sum, expense) => sum + expense.amount, 0),
      paid: mockExpenses
        .filter((expense) => expense.status === "paid")
        .reduce((sum, expense) => sum + expense.amount, 0),
      pending: mockExpenses.filter((expense) => expense.status === "pending")
        .length,
      rejected: mockExpenses.filter((expense) => expense.status === "rejected")
        .length,
    }),
    [],
  );

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Expense Management"
        subtitle="Track school expenses, vendors and approvals"
        action={
          <button className="flex items-center gap-2 px-4 py-2 bg-accent hover:bg-accent-hover text-white text-sm font-medium rounded-lg transition-colors">
            <Plus size={16} />
            Add Expense
          </button>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Total Expenses",
            value: `Rs ${summary.total.toLocaleString()}`,
            icon: TrendingDown,
            bg: "bg-blue-50 dark:bg-blue-950",
            text: "text-blue-600 dark:text-blue-400",
          },
          {
            label: "Paid",
            value: `Rs ${summary.paid.toLocaleString()}`,
            icon: Banknote,
            bg: "bg-green-50 dark:bg-green-950",
            text: "text-green-600 dark:text-green-400",
          },
          {
            label: "Pending",
            value: summary.pending,
            icon: Clock,
            bg: "bg-amber-50 dark:bg-amber-950",
            text: "text-amber-600 dark:text-amber-400",
          },
          {
            label: "Rejected",
            value: summary.rejected,
            icon: TrendingDown,
            bg: "bg-red-50 dark:bg-red-950",
            text: "text-red-600 dark:text-red-400",
          },
        ].map((card) => (
          <div
            key={card.label}
            className={`${card.bg} rounded-xl p-4 flex items-center gap-4`}
          >
            <div className="w-10 h-10 bg-white/50 dark:bg-black/10 rounded-lg flex items-center justify-center shrink-0">
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

      <div className="bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-light-text-tertiary dark:text-dark-text-tertiary"
            />
            <input
              type="text"
              placeholder="Search by expense or vendor..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-lg bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border text-light-text-primary dark:text-dark-text-primary placeholder:text-light-text-tertiary dark:placeholder:text-dark-text-tertiary text-sm outline-none focus:border-accent transition-colors"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setCategory(e.target.value)}
            className="px-3 py-2 rounded-lg bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border text-light-text-primary dark:text-dark-text-primary text-sm outline-none focus:border-accent transition-colors"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          <select
            value={selectedStatus}
            onChange={(e) => setStatus(e.target.value)}
            className="px-3 py-2 rounded-lg bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border text-light-text-primary dark:text-dark-text-primary text-sm outline-none focus:border-accent transition-colors"
          >
            {statuses.map((status) => (
              <option key={status} value={status}>
                {status === "All"
                  ? "All Status"
                  : status.charAt(0).toUpperCase() + status.slice(1)}
              </option>
            ))}
          </select>
          <button className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border text-light-text-secondary dark:text-dark-text-secondary text-sm font-medium hover:bg-light-hover dark:hover:bg-dark-hover transition-colors">
            <Download size={15} />
            Export
          </button>
        </div>
      </div>

      <div className="bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl overflow-hidden">
        <div className="grid grid-cols-6 px-4 py-3 border-b border-light-border dark:border-dark-border">
          {["Expense", "Category", "Date", "Vendor", "Amount", "Status"].map(
            (heading) => (
              <span
                key={heading}
                className="text-xs font-medium text-light-text-tertiary dark:text-dark-text-tertiary uppercase tracking-wide"
              >
                {heading}
              </span>
            ),
          )}
        </div>

        {filtered.length > 0 ? (
          filtered.map((expense) => (
            <div
              key={expense.id}
              className="grid grid-cols-6 px-4 py-3 border-b border-light-border dark:border-dark-border last:border-0 hover:bg-light-hover dark:hover:bg-dark-hover transition-colors items-center"
            >
              <span className="text-sm font-medium text-light-text-primary dark:text-dark-text-primary truncate">
                {expense.title}
              </span>
              <span className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                {expense.category}
              </span>
              <span className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                {expense.date}
              </span>
              <span className="text-sm text-light-text-secondary dark:text-dark-text-secondary truncate">
                {expense.vendor}
              </span>
              <span className="text-sm font-medium text-light-text-primary dark:text-dark-text-primary">
                Rs {expense.amount.toLocaleString()}
              </span>
              <StatusPill status={expense.status} styles={expenseStatusStyles} />
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
              No expenses found
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ExpenseManagement;
