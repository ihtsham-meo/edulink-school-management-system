import { useMemo } from "react";
import {
  Banknote,
  CheckCircle,
  Clock,
  AlertCircle,
  Download,
} from "lucide-react";
import PageHeader from "../../components/common/PageHeader";
import StatusPill from "../../components/common/StatusPill";
import { mockFeePayments, feeStatusStyles } from "../../data/mockData";

function StudentFees() {
  // Simulate student = Ali Hassan
  const myFees = mockFeePayments.filter((f) => f.studentId === 1);

  const summary = useMemo(
    () => ({
      total: myFees.reduce((sum, f) => sum + f.amount, 0),
      paid: myFees
        .filter((f) => f.status === "paid")
        .reduce((sum, f) => sum + f.amount, 0),
      pending: myFees
        .filter((f) => f.status === "pending")
        .reduce((sum, f) => sum + f.amount, 0),
      overdue: myFees
        .filter((f) => f.status === "overdue")
        .reduce((sum, f) => sum + f.amount, 0),
    }),
    [myFees],
  );

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Fee Status" subtitle="View your fee payment history" />

      {/* Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Total Fee",
            value: `Rs ${summary.total.toLocaleString()}`,
            bg: "bg-blue-50 dark:bg-blue-950",
            text: "text-blue-600 dark:text-blue-400",
            icon: Banknote,
          },
          {
            label: "Paid",
            value: `Rs ${summary.paid.toLocaleString()}`,
            bg: "bg-green-50 dark:bg-green-950",
            text: "text-green-600 dark:text-green-400",
            icon: CheckCircle,
          },
          {
            label: "Pending",
            value: `Rs ${summary.pending.toLocaleString()}`,
            bg: "bg-amber-50 dark:bg-amber-950",
            text: "text-amber-600 dark:text-amber-400",
            icon: Clock,
          },
          {
            label: "Overdue",
            value: `Rs ${summary.overdue.toLocaleString()}`,
            bg: "bg-red-50 dark:bg-red-950",
            text: "text-red-600 dark:text-red-400",
            icon: AlertCircle,
          },
        ].map((card) => (
          <div
            key={card.label}
            className={`${card.bg} rounded-xl p-4 flex items-center gap-3`}
          >
            <div
              className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${card.bg}`}
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

      {/* Overdue warning */}
      {summary.overdue > 0 && (
        <div className="flex items-start gap-3 px-4 py-3 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-xl">
          <AlertCircle
            size={18}
            className="text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5"
          />
          <div>
            <p className="text-sm font-semibold text-red-700 dark:text-red-400">
              Overdue Payment
            </p>
            <p className="text-xs text-red-600 dark:text-red-400 mt-0.5">
              You have Rs {summary.overdue.toLocaleString()} overdue. Please
              contact the accounts office immediately.
            </p>
          </div>
        </div>
      )}

      {/* Fee history table */}
      <div className="bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl overflow-hidden">
        <div className="grid grid-cols-5 px-4 py-3 border-b border-light-border dark:border-dark-border">
          {["Month", "Amount", "Method", "Date", "Status"].map((h) => (
            <span
              key={h}
              className="text-xs font-medium text-light-text-tertiary dark:text-dark-text-tertiary uppercase tracking-wide"
            >
              {h}
            </span>
          ))}
        </div>
        {myFees.length > 0 ? (
          myFees.map((fee) => (
            <div
              key={fee.id}
              className="grid grid-cols-5 px-4 py-3 border-b border-light-border dark:border-dark-border last:border-0 hover:bg-light-hover dark:hover:bg-dark-hover transition-colors items-center"
            >
              <span className="text-sm font-medium text-light-text-primary dark:text-dark-text-primary">
                {fee.month}
              </span>
              <span className="text-sm font-semibold text-light-text-primary dark:text-dark-text-primary">
                Rs {fee.amount.toLocaleString()}
              </span>
              <span className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                {fee.method || "—"}
              </span>
              <span className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                {fee.date || "—"}
              </span>
              <div className="flex items-center gap-2">
                <StatusPill status={fee.status} styles={feeStatusStyles} />
                {fee.status === "paid" && (
                  <button className="w-6 h-6 flex items-center justify-center rounded text-light-text-tertiary dark:text-dark-text-tertiary hover:text-accent transition-colors">
                    <Download size={12} />
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <Banknote
              size={22}
              className="text-light-text-tertiary dark:text-dark-text-tertiary"
            />
            <p className="text-light-text-secondary dark:text-dark-text-secondary text-sm">
              No fee records found
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default StudentFees;
