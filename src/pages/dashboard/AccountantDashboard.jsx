import { Banknote, TrendingUp, TrendingDown, AlertCircle } from "lucide-react";
import StatCard from "../../components/common/StatCard";
import { mockFeePayments, mockSalaries } from "../../data/mockData";

const recentPayments = mockFeePayments.slice(0, 5);

const feeStatusStyles = {
  paid: "bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-400",
  pending: "bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400",
  overdue: "bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-400",
};

function AccountantDashboard() {
  const totalCollected = mockFeePayments
    .filter((f) => f.status === "paid")
    .reduce((sum, f) => sum + f.amount, 0);
  const totalPending = mockFeePayments.filter(
    (f) => f.status === "pending",
  ).length;
  const totalOverdue = mockFeePayments.filter(
    (f) => f.status === "overdue",
  ).length;
  const totalExpenses = 180000;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-light-text-primary dark:text-dark-text-primary text-xl font-semibold">
          Dashboard
        </h1>
        <p className="text-light-text-secondary dark:text-dark-text-secondary text-sm mt-0.5">
          Welcome back — Wednesday, 14 May 2026
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Fee Collected"
          value={`Rs ${(totalCollected / 1000).toFixed(0)}K`}
          subtitle="This month"
          icon={Banknote}
          gradient="green"
        />
        <StatCard
          title="Total Expenses"
          value={`Rs ${(totalExpenses / 1000).toFixed(0)}K`}
          subtitle="This month"
          icon={TrendingDown}
          gradient="red"
        />
        <StatCard
          title="Pending Fees"
          value={totalPending}
          subtitle="Students pending"
          icon={AlertCircle}
          gradient="orange"
        />
        <StatCard
          title="Overdue Fees"
          value={totalOverdue}
          subtitle="Need follow up"
          icon={TrendingUp}
          gradient="purple"
        />
      </div>

      {/* Recent Payments */}
      <div className="bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-light-text-primary dark:text-dark-text-primary">
            Recent Fee Payments
          </h2>
          <button className="text-xs text-accent hover:underline">
            View all
          </button>
        </div>
        <div className="flex flex-col gap-1">
          <div className="grid grid-cols-4 pb-2 border-b border-light-border dark:border-dark-border">
            {["Student", "Class", "Amount", "Status"].map((h) => (
              <span
                key={h}
                className="text-xs font-medium text-light-text-tertiary dark:text-dark-text-tertiary uppercase tracking-wide"
              >
                {h}
              </span>
            ))}
          </div>
          {recentPayments.map((p) => (
            <div
              key={p.id}
              className="grid grid-cols-4 py-2.5 border-b border-light-border dark:border-dark-border last:border-0 hover:bg-light-hover dark:hover:bg-dark-hover rounded-lg px-1 transition-colors items-center"
            >
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-accent/10 flex items-center justify-center text-accent text-xs font-medium flex-shrink-0">
                  {p.name.charAt(0)}
                </div>
                <span className="text-sm font-medium text-light-text-primary dark:text-dark-text-primary truncate">
                  {p.name}
                </span>
              </div>
              <span className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                {p.class}
              </span>
              <span className="text-sm font-medium text-light-text-primary dark:text-dark-text-primary">
                Rs {p.amount.toLocaleString()}
              </span>
              <span
                className={`text-xs px-2 py-0.5 rounded-md font-medium w-fit ${feeStatusStyles[p.status]}`}
              >
                {p.status.charAt(0).toUpperCase() + p.status.slice(1)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AccountantDashboard;
