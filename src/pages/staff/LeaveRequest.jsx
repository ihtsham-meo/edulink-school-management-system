import { useState, useMemo } from "react";
import { Plus, CalendarDays, CheckCircle, XCircle, Clock } from "lucide-react";
import PageHeader from "../../components/common/PageHeader";

const mockMyLeaves = [
  {
    id: 1,
    reason: "Medical appointment",
    from: "2026-05-20",
    to: "2026-05-20",
    days: 1,
    status: "approved",
  },
  {
    id: 2,
    reason: "Family emergency",
    from: "2026-04-10",
    to: "2026-04-11",
    days: 2,
    status: "approved",
  },
  {
    id: 3,
    reason: "Personal work",
    from: "2026-05-25",
    to: "2026-05-25",
    days: 1,
    status: "pending",
  },
];

const leaveStatusStyles = {
  approved: "bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-400",
  rejected: "bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-400",
  pending: "bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400",
};

const leaveStatusIcons = {
  approved: CheckCircle,
  rejected: XCircle,
  pending: Clock,
};

function LeaveRequest() {
  const [leaves, setLeaves] = useState(mockMyLeaves);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ reason: "", from: "", to: "" });

  const summary = useMemo(
    () => ({
      total: leaves.length,
      approved: leaves.filter((l) => l.status === "approved").length,
      pending: leaves.filter((l) => l.status === "pending").length,
      rejected: leaves.filter((l) => l.status === "rejected").length,
    }),
    [leaves],
  );

  const handleSubmit = () => {
    if (!form.reason || !form.from || !form.to) return;
    const from = new Date(form.from);
    const to = new Date(form.to);
    const days = Math.ceil((to - from) / (1000 * 60 * 60 * 24)) + 1;
    setLeaves((prev) => [
      {
        id: prev.length + 1,
        reason: form.reason,
        from: form.from,
        to: form.to,
        days,
        status: "pending",
      },
      ...prev,
    ]);
    setForm({ reason: "", from: "", to: "" });
    setShowModal(false);
  };

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Leave Requests"
        subtitle="Apply and track your leave requests"
        action={
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-accent hover:bg-accent-hover text-white text-sm font-medium rounded-lg transition-colors"
          >
            <Plus size={16} />
            Apply Leave
          </button>
        }
      />

      {/* Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Total Leaves",
            value: summary.total,
            bg: "bg-blue-50 dark:bg-blue-950",
            text: "text-blue-600 dark:text-blue-400",
          },
          {
            label: "Approved",
            value: summary.approved,
            bg: "bg-green-50 dark:bg-green-950",
            text: "text-green-600 dark:text-green-400",
          },
          {
            label: "Pending",
            value: summary.pending,
            bg: "bg-amber-50 dark:bg-amber-950",
            text: "text-amber-600 dark:text-amber-400",
          },
          {
            label: "Rejected",
            value: summary.rejected,
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

      {/* Leave list */}
      <div className="bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl overflow-hidden">
        <div className="grid grid-cols-5 px-4 py-3 border-b border-light-border dark:border-dark-border">
          {["Reason", "From", "To", "Days", "Status"].map((h) => (
            <span
              key={h}
              className="text-xs font-medium text-light-text-tertiary dark:text-dark-text-tertiary uppercase tracking-wide"
            >
              {h}
            </span>
          ))}
        </div>
        {leaves.map((leave) => {
          const StatusIcon = leaveStatusIcons[leave.status];
          return (
            <div
              key={leave.id}
              className="grid grid-cols-5 px-4 py-3 border-b border-light-border dark:border-dark-border last:border-0 hover:bg-light-hover dark:hover:bg-dark-hover transition-colors items-center"
            >
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <CalendarDays size={13} className="text-accent" />
                </div>
                <span className="text-sm font-medium text-light-text-primary dark:text-dark-text-primary truncate">
                  {leave.reason}
                </span>
              </div>
              <span className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                {leave.from}
              </span>
              <span className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                {leave.to}
              </span>
              <span className="text-sm font-medium text-light-text-primary dark:text-dark-text-primary">
                {leave.days} day{leave.days > 1 ? "s" : ""}
              </span>
              <span
                className={`flex items-center gap-1.5 text-xs px-2 py-0.5 rounded-md font-medium w-fit ${leaveStatusStyles[leave.status]}`}
              >
                <StatusIcon size={11} />
                {leave.status.charAt(0).toUpperCase() + leave.status.slice(1)}
              </span>
            </div>
          );
        })}
      </div>

      {/* Apply Leave Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl p-6 w-full max-w-md">
            <h2 className="text-base font-semibold text-light-text-primary dark:text-dark-text-primary mb-5">
              Apply for Leave
            </h2>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-light-text-primary dark:text-dark-text-primary">
                  Reason
                </label>
                <input
                  type="text"
                  value={form.reason}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, reason: e.target.value }))
                  }
                  placeholder="Reason for leave"
                  className="w-full px-4 py-2.5 rounded-lg bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border text-light-text-primary dark:text-dark-text-primary text-sm outline-none focus:border-accent transition-colors"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-light-text-primary dark:text-dark-text-primary">
                    From Date
                  </label>
                  <input
                    type="date"
                    value={form.from}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, from: e.target.value }))
                    }
                    className="w-full px-4 py-2.5 rounded-lg bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border text-light-text-primary dark:text-dark-text-primary text-sm outline-none focus:border-accent transition-colors"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-light-text-primary dark:text-dark-text-primary">
                    To Date
                  </label>
                  <input
                    type="date"
                    value={form.to}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, to: e.target.value }))
                    }
                    className="w-full px-4 py-2.5 rounded-lg bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border text-light-text-primary dark:text-dark-text-primary text-sm outline-none focus:border-accent transition-colors"
                  />
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button
                onClick={handleSubmit}
                className="flex-1 py-2.5 bg-accent hover:bg-accent-hover text-white text-sm font-medium rounded-lg transition-colors"
              >
                Submit Request
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

export default LeaveRequest;
