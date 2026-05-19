import { useMemo, useState } from "react";
import {
  Banknote,
  Clock,
  Download,
  Eye,
  Pencil,
  Plus,
  Search,
  Trash2,
  TrendingDown,
} from "lucide-react";
import PageHeader from "../../components/common/PageHeader";
import StatusPill from "../../components/common/StatusPill";
import {
  CrudModal,
  DetailGrid,
  Field,
  ModalButton,
  SelectField,
} from "../../components/common/CrudModal";

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
  const [expenses, setExpenses] = useState(mockExpenses);
  const [search, setSearch] = useState("");
  const [selectedCategory, setCategory] = useState("All Categories");
  const [selectedStatus, setStatus] = useState("All");
  const [modalMode, setModalMode] = useState(null);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [form, setForm] = useState({
    title: "",
    category: "Academic",
    date: "",
    amount: "",
    vendor: "",
    status: "pending",
  });
  const [errors, setErrors] = useState({});

  const filtered = useMemo(() => {
    return expenses.filter((expense) => {
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
  }, [expenses, search, selectedCategory, selectedStatus]);

  const summary = useMemo(
    () => ({
      total: expenses.reduce((sum, expense) => sum + expense.amount, 0),
      paid: expenses
        .filter((expense) => expense.status === "paid")
        .reduce((sum, expense) => sum + expense.amount, 0),
      pending: expenses.filter((expense) => expense.status === "pending")
        .length,
      rejected: expenses.filter((expense) => expense.status === "rejected")
        .length,
    }),
    [expenses],
  );

  const openForm = (expense = null) => {
    setSelectedExpense(expense);
    setErrors({});
    setForm(
      expense
        ? { ...expense, amount: String(expense.amount) }
        : {
            title: "",
            category: "Academic",
            date: new Date().toISOString().split("T")[0],
            amount: "",
            vendor: "",
            status: "pending",
          },
    );
    setModalMode("form");
  };

  const validate = () => {
    const nextErrors = {};
    if (!form.title.trim()) nextErrors.title = "Expense title is required";
    if (!form.vendor.trim()) nextErrors.vendor = "Vendor is required";
    if (!form.date) nextErrors.date = "Date is required";
    if (!form.amount || Number(form.amount) < 1) nextErrors.amount = "Amount is required";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    const payload = {
      ...form,
      title: form.title.trim(),
      vendor: form.vendor.trim(),
      amount: Number(form.amount),
    };

    if (selectedExpense) {
      setExpenses((prev) =>
        prev.map((expense) =>
          expense.id === selectedExpense.id ? { ...expense, ...payload } : expense,
        ),
      );
    } else {
      setExpenses((prev) => [{ ...payload, id: Date.now() }, ...prev]);
    }
    setModalMode(null);
  };

  const handleDelete = () => {
    setExpenses((prev) =>
      prev.filter((expense) => expense.id !== selectedExpense.id),
    );
    setModalMode(null);
  };

  const handleExport = () => {
    const csv = [
      ["Expense", "Category", "Date", "Vendor", "Amount", "Status"],
      ...filtered.map((expense) => [
        expense.title,
        expense.category,
        expense.date,
        expense.vendor,
        expense.amount,
        expense.status,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "expense-report.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Expense Management"
        subtitle="Track school expenses, vendors and approvals"
        action={
          <button
            onClick={() => openForm()}
            className="flex items-center gap-2 px-4 py-2 bg-accent hover:bg-accent-hover text-white text-sm font-medium rounded-lg transition-colors"
          >
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
          <button
            onClick={handleExport}
            className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border text-light-text-secondary dark:text-dark-text-secondary text-sm font-medium hover:bg-light-hover dark:hover:bg-dark-hover transition-colors"
          >
            <Download size={15} />
            Export
          </button>
        </div>
      </div>

      <div className="bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl overflow-hidden">
        <div className="grid grid-cols-7 px-4 py-3 border-b border-light-border dark:border-dark-border">
          {["Expense", "Category", "Date", "Vendor", "Amount", "Status", "Actions"].map(
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
              className="grid grid-cols-7 px-4 py-3 border-b border-light-border dark:border-dark-border last:border-0 hover:bg-light-hover dark:hover:bg-dark-hover transition-colors items-center"
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
              <div className="flex items-center gap-1">
                <button
                  onClick={() => {
                    setSelectedExpense(expense);
                    setModalMode("view");
                  }}
                  className="w-7 h-7 flex items-center justify-center rounded-lg text-light-text-tertiary dark:text-dark-text-tertiary hover:bg-blue-50 dark:hover:bg-blue-950 hover:text-blue-600 transition-colors"
                >
                  <Eye size={14} />
                </button>
                <button
                  onClick={() => openForm(expense)}
                  className="w-7 h-7 flex items-center justify-center rounded-lg text-light-text-tertiary dark:text-dark-text-tertiary hover:bg-amber-50 dark:hover:bg-amber-950 hover:text-amber-600 transition-colors"
                >
                  <Pencil size={14} />
                </button>
                <button
                  onClick={() => {
                    setSelectedExpense(expense);
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
              No expenses found
            </p>
          </div>
        )}
      </div>

      {modalMode === "form" && (
        <CrudModal
          title={selectedExpense ? "Edit Expense" : "Add Expense"}
          onClose={() => setModalMode(null)}
          footer={
            <>
              <ModalButton onClick={() => setModalMode(null)}>Cancel</ModalButton>
              <ModalButton variant="primary" onClick={handleSave}>
                {selectedExpense ? "Save Changes" : "Add Expense"}
              </ModalButton>
            </>
          }
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Expense Title" value={form.title} error={errors.title} onChange={(value) => setForm((prev) => ({ ...prev, title: value }))} />
            <SelectField label="Category" value={form.category} options={categories.slice(1)} onChange={(value) => setForm((prev) => ({ ...prev, category: value }))} />
            <Field label="Date" type="date" value={form.date} error={errors.date} onChange={(value) => setForm((prev) => ({ ...prev, date: value }))} />
            <Field label="Vendor" value={form.vendor} error={errors.vendor} onChange={(value) => setForm((prev) => ({ ...prev, vendor: value }))} />
            <Field label="Amount" type="number" value={form.amount} error={errors.amount} onChange={(value) => setForm((prev) => ({ ...prev, amount: value }))} />
            <SelectField label="Status" value={form.status} options={statuses.slice(1)} onChange={(value) => setForm((prev) => ({ ...prev, status: value }))} />
          </div>
        </CrudModal>
      )}

      {modalMode === "view" && selectedExpense && (
        <CrudModal title="Expense Details" onClose={() => setModalMode(null)}>
          <DetailGrid
            items={[
              ["Expense", selectedExpense.title],
              ["Category", selectedExpense.category],
              ["Date", selectedExpense.date],
              ["Vendor", selectedExpense.vendor],
              ["Amount", `Rs ${selectedExpense.amount.toLocaleString()}`],
              ["Status", selectedExpense.status],
            ]}
          />
        </CrudModal>
      )}

      {modalMode === "delete" && selectedExpense && (
        <CrudModal
          title="Delete Expense"
          onClose={() => setModalMode(null)}
          footer={
            <>
              <ModalButton onClick={() => setModalMode(null)}>Cancel</ModalButton>
              <ModalButton variant="danger" onClick={handleDelete}>Delete</ModalButton>
            </>
          }
        >
          <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
            Delete expense{" "}
            <span className="font-semibold text-light-text-primary dark:text-dark-text-primary">
              {selectedExpense.title}
            </span>
            ?
          </p>
        </CrudModal>
      )}
    </div>
  );
}

export default ExpenseManagement;
