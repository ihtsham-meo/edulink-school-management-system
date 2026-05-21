import { useState } from "react";
import { Search, Banknote, CheckCircle } from "lucide-react";
import PageHeader from "../../components/common/PageHeader";
import StatusPill from "../../components/common/StatusPill";
import {
  mockFeePayments,
  mockStudents,
  feeStatusStyles,
} from "../../data/mockData";

function AccountantFeePayment() {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [paid, setPaid] = useState(false);
  const [method, setMethod] = useState("Cash");

  const filtered = mockStudents.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.rollNo.toLowerCase().includes(search.toLowerCase()),
  );

  const studentFees = selected
    ? mockFeePayments.filter((f) => f.studentId === selected.id)
    : [];

  const handlePay = (feeId) => {
    setPaid(true);
    setTimeout(() => setPaid(false), 2000);
  };

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Fee Payment"
        subtitle="Search student and record fee payment"
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Search student */}
        <div className="bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl p-5">
          <h3 className="text-sm font-semibold text-light-text-primary dark:text-dark-text-primary mb-4">
            Search Student
          </h3>
          <div className="relative mb-4">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-light-text-tertiary dark:text-dark-text-tertiary"
            />
            <input
              type="text"
              placeholder="Search by name or roll number..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-lg bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border text-light-text-primary dark:text-dark-text-primary placeholder:text-light-text-tertiary dark:placeholder:text-dark-text-tertiary text-sm outline-none focus:border-accent transition-colors"
            />
          </div>
          <div className="flex flex-col gap-1 max-h-64 overflow-y-auto">
            {filtered.slice(0, 6).map((student) => (
              <button
                key={student.id}
                onClick={() => setSelected(student)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors ${
                  selected?.id === student.id
                    ? "bg-accent/10 border border-accent/20"
                    : "hover:bg-light-hover dark:hover:bg-dark-hover"
                }`}
              >
                <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-accent text-xs font-medium flex-shrink-0">
                  {student.name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-medium text-light-text-primary dark:text-dark-text-primary">
                    {student.name}
                  </p>
                  <p className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary">
                    {student.rollNo} · Class {student.class}
                  </p>
                </div>
                <StatusPill status={student.fee} styles={feeStatusStyles} />
              </button>
            ))}
          </div>
        </div>

        {/* Fee details */}
        <div className="bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl p-5">
          <h3 className="text-sm font-semibold text-light-text-primary dark:text-dark-text-primary mb-4">
            {selected ? `Fee Details — ${selected.name}` : "Select a student"}
          </h3>
          {selected ? (
            <div className="flex flex-col gap-3">
              {studentFees.length > 0 ? (
                <>
                  {studentFees.map((fee) => (
                    <div
                      key={fee.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border"
                    >
                      <div>
                        <p className="text-sm font-medium text-light-text-primary dark:text-dark-text-primary">
                          {fee.month}
                        </p>
                        <p className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary">
                          Rs {fee.amount.toLocaleString()}
                        </p>
                      </div>
                      <StatusPill
                        status={fee.status}
                        styles={feeStatusStyles}
                      />
                    </div>
                  ))}
                  <div className="flex flex-col gap-3 mt-2 pt-3 border-t border-light-border dark:border-dark-border">
                    <select
                      value={method}
                      onChange={(e) => setMethod(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-lg bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border text-light-text-primary dark:text-dark-text-primary text-sm outline-none focus:border-accent transition-colors"
                    >
                      {["Cash", "Bank Transfer", "Card"].map((m) => (
                        <option key={m}>{m}</option>
                      ))}
                    </select>
                    <button
                      onClick={handlePay}
                      className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-white text-sm font-medium transition-colors ${
                        paid
                          ? "bg-green-500"
                          : "bg-accent hover:bg-accent-hover"
                      }`}
                    >
                      {paid ? (
                        <>
                          <CheckCircle size={15} /> Payment Recorded!
                        </>
                      ) : (
                        <>
                          <Banknote size={15} /> Record Payment
                        </>
                      )}
                    </button>
                  </div>
                </>
              ) : (
                <p className="text-sm text-light-text-tertiary dark:text-dark-text-tertiary text-center py-8">
                  No fee records for this student
                </p>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 gap-3">
              <Banknote
                size={32}
                className="text-light-text-tertiary dark:text-dark-text-tertiary"
              />
              <p className="text-sm text-light-text-tertiary dark:text-dark-text-tertiary">
                Search and select a student
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AccountantFeePayment;
