import { useMemo } from "react";
import { TrendingUp, TrendingDown, Banknote, Printer } from "lucide-react";
import PageHeader from "../../components/common/PageHeader";
import { mockFeePayments } from "../../data/mockData";

const mockExpenseItems = [
  { id: 1, title: "Staff Salaries", amount: 120000, method: "Bank Transfer" },
  { id: 2, title: "Electricity Bill", amount: 15000, method: "Cash" },
  { id: 3, title: "Maintenance", amount: 8000, method: "Cash" },
  { id: 4, title: "Stationery", amount: 5000, method: "Cash" },
];

function BalanceSheet() {
  const totalIncome = mockFeePayments
    .filter((f) => f.status === "paid")
    .reduce((sum, f) => sum + f.amount, 0);
  const totalExpense = mockExpenseItems.reduce((sum, e) => sum + e.amount, 0);
  const balance = totalIncome - totalExpense;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Balance Sheet"
        subtitle="Today's income and expense summary"
        action={
          <button className="flex items-center gap-2 px-4 py-2 bg-accent hover:bg-accent-hover text-white text-sm font-medium rounded-lg transition-colors">
            <Printer size={15} />
            Print
          </button>
        }
      />

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4">
        {[
          {
            label: "Total Income",
            value: `Rs ${totalIncome.toLocaleString()}`,
            bg: "bg-green-50 dark:bg-green-950",
            text: "text-green-600 dark:text-green-400",
            icon: TrendingUp,
          },
          {
            label: "Total Expense",
            value: `Rs ${totalExpense.toLocaleString()}`,
            bg: "bg-red-50 dark:bg-red-950",
            text: "text-red-600 dark:text-red-400",
            icon: TrendingDown,
          },
          {
            label: "Net Balance",
            value: `Rs ${balance.toLocaleString()}`,
            bg:
              balance >= 0
                ? "bg-blue-50 dark:bg-blue-950"
                : "bg-red-50 dark:bg-red-950",
            text:
              balance >= 0
                ? "text-blue-600 dark:text-blue-400"
                : "text-red-600 dark:text-red-400",
            icon: Banknote,
          },
        ].map((card) => (
          <div
            key={card.label}
            className={`${card.bg} rounded-xl p-4 flex items-center gap-3`}
          >
            <div
              className={`w-10 h-10 rounded-lg flex items-center justify-center ${card.bg}`}
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Income */}
        <div className="bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl p-5">
          <h3 className="text-sm font-semibold text-light-text-primary dark:text-dark-text-primary mb-4 flex items-center gap-2">
            <TrendingUp size={15} className="text-green-500" />
            Income
          </h3>
          <div className="flex flex-col gap-2">
            {mockFeePayments
              .filter((f) => f.status === "paid")
              .map((fee) => (
                <div
                  key={fee.id}
                  className="flex items-center justify-between py-2 border-b border-light-border dark:border-dark-border last:border-0"
                >
                  <div>
                    <p className="text-sm text-light-text-primary dark:text-dark-text-primary">
                      {fee.name}
                    </p>
                    <p className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary">
                      {fee.month} · {fee.method}
                    </p>
                  </div>
                  <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                    + Rs {fee.amount.toLocaleString()}
                  </span>
                </div>
              ))}
          </div>
        </div>

        {/* Expenses */}
        <div className="bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl p-5">
          <h3 className="text-sm font-semibold text-light-text-primary dark:text-dark-text-primary mb-4 flex items-center gap-2">
            <TrendingDown size={15} className="text-red-500" />
            Expenses
          </h3>
          <div className="flex flex-col gap-2">
            {mockExpenseItems.map((expense) => (
              <div
                key={expense.id}
                className="flex items-center justify-between py-2 border-b border-light-border dark:border-dark-border last:border-0"
              >
                <div>
                  <p className="text-sm text-light-text-primary dark:text-dark-text-primary">
                    {expense.title}
                  </p>
                  <p className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary">
                    {expense.method}
                  </p>
                </div>
                <span className="text-sm font-semibold text-red-600 dark:text-red-400">
                  - Rs {expense.amount.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default BalanceSheet;
