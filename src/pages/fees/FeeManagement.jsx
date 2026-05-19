import { useState, useMemo } from "react";
import {
  Search,
  Download,
  Plus,
  Eye,
  Pencil,
  Trash2,
  Banknote,
  TrendingUp,
  AlertCircle,
  Clock,
} from "lucide-react";
import PageHeader from "../../components/common/PageHeader";
import StatusPill from "../../components/common/StatusPill";
import { mockFeePayments, feeStatusStyles } from "../../data/mockData";
import {
  CrudModal,
  DetailGrid,
  Field,
  ModalButton,
  SelectField,
} from "../../components/common/CrudModal";

const months = ["All Months", "May 2026", "April 2026", "March 2026"];
const statuses = ["All", "paid", "pending", "overdue"];

function FeeManagement() {
  const [payments, setPayments] = useState(mockFeePayments);
  const [search, setSearch] = useState("");
  const [selectedMonth, setMonth] = useState("All Months");
  const [selectedStatus, setStatus] = useState("All");
  const [modalMode, setModalMode] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [form, setForm] = useState({
    name: "",
    class: "",
    month: "May 2026",
    amount: "",
    method: "Cash",
    status: "pending",
  });
  const [errors, setErrors] = useState({});

  // ── Filtered payments ──
  const filtered = useMemo(() => {
    return payments.filter((p) => {
      const matchSearch =
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.class.toLowerCase().includes(search.toLowerCase());
      const matchMonth =
        selectedMonth === "All Months" || p.month === selectedMonth;
      const matchStatus =
        selectedStatus === "All" || p.status === selectedStatus;
      return matchSearch && matchMonth && matchStatus;
    });
  }, [payments, search, selectedMonth, selectedStatus]);

  // ── Summary counts ──
  const summary = useMemo(
    () => ({
      total: payments.reduce((sum, p) => sum + p.amount, 0),
      paid: payments
        .filter((p) => p.status === "paid")
        .reduce((sum, p) => sum + p.amount, 0),
      pending: payments.filter((p) => p.status === "pending").length,
      overdue: payments.filter((p) => p.status === "overdue").length,
    }),
    [payments],
  );

  const openForm = (payment = null) => {
    setSelectedPayment(payment);
    setErrors({});
    setForm(
      payment
        ? { ...payment, amount: String(payment.amount) }
        : {
            name: "",
            class: "",
            month: "May 2026",
            amount: "",
            method: "Cash",
            status: "pending",
          },
    );
    setModalMode("form");
  };

  const validate = () => {
    const nextErrors = {};
    if (!form.name.trim()) nextErrors.name = "Student name is required";
    if (!form.class.trim()) nextErrors.class = "Class is required";
    if (!form.amount || Number(form.amount) < 1) nextErrors.amount = "Amount is required";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    const payload = {
      ...form,
      name: form.name.trim(),
      class: form.class.trim(),
      amount: Number(form.amount),
    };

    if (selectedPayment) {
      setPayments((prev) =>
        prev.map((payment) =>
          payment.id === selectedPayment.id ? { ...payment, ...payload } : payment,
        ),
      );
    } else {
      setPayments((prev) => [{ ...payload, id: Date.now() }, ...prev]);
    }
    setModalMode(null);
  };

  const handleDelete = () => {
    setPayments((prev) => prev.filter((payment) => payment.id !== selectedPayment.id));
    setModalMode(null);
  };

  const handleExport = () => {
    const csv = [
      ["Student", "Class", "Month", "Amount", "Method", "Status"],
      ...filtered.map((payment) => [
        payment.name,
        payment.class,
        payment.month,
        payment.amount,
        payment.method || "",
        payment.status,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "fee-report.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <PageHeader
        title="Fee Management"
        subtitle="Track and manage student fee payments"
        action={
          <div className="flex gap-2">
            <button
              onClick={() => openForm()}
              className="flex items-center gap-2 px-4 py-2 bg-accent hover:bg-accent-hover text-white text-sm font-medium rounded-lg transition-colors"
            >
              <Plus size={16} />
              Add Payment
            </button>
            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border text-light-text-secondary dark:text-dark-text-secondary text-sm font-medium hover:bg-light-hover dark:hover:bg-dark-hover transition-colors"
            >
              <Download size={16} />
              Export
            </button>
          </div>
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
        <div className="grid grid-cols-7 px-4 py-3 border-b border-light-border dark:border-dark-border">
          {["Student", "Class", "Month", "Amount", "Method", "Status", "Actions"].map(
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
              className="grid grid-cols-7 px-4 py-3 border-b border-light-border dark:border-dark-border last:border-0 hover:bg-light-hover dark:hover:bg-dark-hover transition-colors items-center"
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

              <div className="flex items-center gap-1">
                <button
                  onClick={() => {
                    setSelectedPayment(payment);
                    setModalMode("view");
                  }}
                  className="w-7 h-7 flex items-center justify-center rounded-lg text-light-text-tertiary dark:text-dark-text-tertiary hover:bg-blue-50 dark:hover:bg-blue-950 hover:text-blue-600 transition-colors"
                >
                  <Eye size={14} />
                </button>
                <button
                  onClick={() => openForm(payment)}
                  className="w-7 h-7 flex items-center justify-center rounded-lg text-light-text-tertiary dark:text-dark-text-tertiary hover:bg-amber-50 dark:hover:bg-amber-950 hover:text-amber-600 transition-colors"
                >
                  <Pencil size={14} />
                </button>
                <button
                  onClick={() => {
                    setSelectedPayment(payment);
                    setModalMode("delete");
                  }}
                  className="w-7 h-7 flex items-center justify-center rounded-lg text-light-text-tertiary dark:text-dark-text-tertiary hover:bg-red-50 dark:hover:bg-red-950 hover:text-red-600 transition-colors"
                >
                  <Trash2 size={14} />
                </button>
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
              No payments found
            </p>
            <p className="text-light-text-tertiary dark:text-dark-text-tertiary text-xs">
              Try adjusting your search or filters
            </p>
          </div>
        )}
      </div>

      {modalMode === "form" && (
        <CrudModal
          title={selectedPayment ? "Edit Payment" : "Add Payment"}
          onClose={() => setModalMode(null)}
          footer={
            <>
              <ModalButton onClick={() => setModalMode(null)}>Cancel</ModalButton>
              <ModalButton variant="primary" onClick={handleSave}>
                {selectedPayment ? "Save Changes" : "Add Payment"}
              </ModalButton>
            </>
          }
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Student Name" value={form.name} error={errors.name} onChange={(value) => setForm((prev) => ({ ...prev, name: value }))} />
            <Field label="Class" value={form.class} error={errors.class} placeholder="10-A" onChange={(value) => setForm((prev) => ({ ...prev, class: value }))} />
            <SelectField label="Month" value={form.month} options={months.slice(1)} onChange={(value) => setForm((prev) => ({ ...prev, month: value }))} />
            <Field label="Amount" type="number" value={form.amount} error={errors.amount} onChange={(value) => setForm((prev) => ({ ...prev, amount: value }))} />
            <SelectField label="Method" value={form.method} options={["Cash", "Bank", "EasyPaisa", "JazzCash"]} onChange={(value) => setForm((prev) => ({ ...prev, method: value }))} />
            <SelectField label="Status" value={form.status} options={statuses.slice(1)} onChange={(value) => setForm((prev) => ({ ...prev, status: value }))} />
          </div>
        </CrudModal>
      )}

      {modalMode === "view" && selectedPayment && (
        <CrudModal title="Payment Details" onClose={() => setModalMode(null)}>
          <DetailGrid
            items={[
              ["Student", selectedPayment.name],
              ["Class", selectedPayment.class],
              ["Month", selectedPayment.month],
              ["Amount", `Rs ${selectedPayment.amount.toLocaleString()}`],
              ["Method", selectedPayment.method],
              ["Status", selectedPayment.status],
            ]}
          />
        </CrudModal>
      )}

      {modalMode === "delete" && selectedPayment && (
        <CrudModal
          title="Delete Payment"
          onClose={() => setModalMode(null)}
          footer={
            <>
              <ModalButton onClick={() => setModalMode(null)}>Cancel</ModalButton>
              <ModalButton variant="danger" onClick={handleDelete}>Delete</ModalButton>
            </>
          }
        >
          <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
            Delete fee payment for{" "}
            <span className="font-semibold text-light-text-primary dark:text-dark-text-primary">
              {selectedPayment.name}
            </span>
            ?
          </p>
        </CrudModal>
      )}
    </div>
  );
}

export default FeeManagement;
