import { useState, useMemo } from "react";
import {
  Search,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  ChevronLeft,
  ChevronRight,
  Users,
  X,
  Loader2,
  CheckSquare,
  Filter,
} from "lucide-react";
import PageHeader from "../../components/common/PageHeader";
import StatusPill from "../../components/common/StatusPill";

// ── Mock Data ─────────────────────────────────────────────────────────────────
const mockRequests = [
  {
    id: 1,
    studentName: "Zara Imran",
    fatherName: "Imran Hussain",
    phone: "03001234501",
    email: "imran.h@gmail.com",
    applyingClass: "Class 8",
    gender: "Female",
    dob: "2012-04-10",
    address: "Lahore",
    appliedOn: "2026-05-10",
    status: "pending",
    prevSchool: "Roots School",
    prevGrade: "B+",
  },
  {
    id: 2,
    studentName: "Omar Farooq",
    fatherName: "Farooq Ahmed",
    phone: "03011234502",
    email: "farooq.a@gmail.com",
    applyingClass: "Class 9",
    gender: "Male",
    dob: "2011-08-22",
    address: "Rawalpindi",
    appliedOn: "2026-05-09",
    status: "pending",
    prevSchool: "City School",
    prevGrade: "A",
  },
  {
    id: 3,
    studentName: "Amna Siddiqui",
    fatherName: "Siddiqui Raza",
    phone: "03021234503",
    email: "sid.raza@gmail.com",
    applyingClass: "Class 7",
    gender: "Female",
    dob: "2013-01-15",
    address: "Islamabad",
    appliedOn: "2026-05-09",
    status: "approved",
    prevSchool: "Beacon House",
    prevGrade: "A+",
  },
  {
    id: 4,
    studentName: "Hassan Mehmood",
    fatherName: "Mehmood Ali",
    phone: "03031234504",
    email: "m.ali@gmail.com",
    applyingClass: "Class 10",
    gender: "Male",
    dob: "2010-11-03",
    address: "Lahore",
    appliedOn: "2026-05-08",
    status: "rejected",
    prevSchool: "LGS",
    prevGrade: "C",
  },
  {
    id: 5,
    studentName: "Fatima Tariq",
    fatherName: "Tariq Mahmood",
    phone: "03041234505",
    email: "t.mahmood@gmail.com",
    applyingClass: "Class 8",
    gender: "Female",
    dob: "2012-06-28",
    address: "Faisalabad",
    appliedOn: "2026-05-08",
    status: "pending",
    prevSchool: "Divisional School",
    prevGrade: "B",
  },
  {
    id: 6,
    studentName: "Ali Usman",
    fatherName: "Usman Ghani",
    phone: "03051234506",
    email: "u.ghani@gmail.com",
    applyingClass: "Class 11",
    gender: "Male",
    dob: "2009-03-17",
    address: "Multan",
    appliedOn: "2026-05-07",
    status: "approved",
    prevSchool: "Allied School",
    prevGrade: "A",
  },
  {
    id: 7,
    studentName: "Hira Baig",
    fatherName: "Baig Nawaz",
    phone: "03061234507",
    email: "b.nawaz@gmail.com",
    applyingClass: "Class 9",
    gender: "Female",
    dob: "2011-09-12",
    address: "Lahore",
    appliedOn: "2026-05-07",
    status: "pending",
    prevSchool: "Educators",
    prevGrade: "B+",
  },
  {
    id: 8,
    studentName: "Bilal Rana",
    fatherName: "Rana Khalid",
    phone: "03071234508",
    email: "r.khalid@gmail.com",
    applyingClass: "Class 7",
    gender: "Male",
    dob: "2013-02-05",
    address: "Gujranwala",
    appliedOn: "2026-05-06",
    status: "pending",
    prevSchool: "Rehman School",
    prevGrade: "A",
  },
  {
    id: 9,
    studentName: "Sana Ijaz",
    fatherName: "Ijaz Ahmad",
    phone: "03081234509",
    email: "i.ahmad@gmail.com",
    applyingClass: "Class 10",
    gender: "Female",
    dob: "2010-07-19",
    address: "Karachi",
    appliedOn: "2026-05-06",
    status: "rejected",
    prevSchool: "Karachi Grammar",
    prevGrade: "B",
  },
  {
    id: 10,
    studentName: "Hamza Saleem",
    fatherName: "Saleem Akhtar",
    phone: "03091234510",
    email: "s.akhtar@gmail.com",
    applyingClass: "Class 8",
    gender: "Male",
    dob: "2012-12-30",
    address: "Rawalpindi",
    appliedOn: "2026-05-05",
    status: "approved",
    prevSchool: "Roots School",
    prevGrade: "A+",
  },
  {
    id: 11,
    studentName: "Maham Qureshi",
    fatherName: "Qureshi Aziz",
    phone: "03101234511",
    email: "q.aziz@gmail.com",
    applyingClass: "Class 9",
    gender: "Female",
    dob: "2011-05-08",
    address: "Lahore",
    appliedOn: "2026-05-05",
    status: "pending",
    prevSchool: "Model School",
    prevGrade: "B+",
  },
  {
    id: 12,
    studentName: "Daud Sheikh",
    fatherName: "Sheikh Noman",
    phone: "03111234512",
    email: "s.noman@gmail.com",
    applyingClass: "Class 11",
    gender: "Male",
    dob: "2009-10-14",
    address: "Islamabad",
    appliedOn: "2026-05-04",
    status: "pending",
    prevSchool: "STEP School",
    prevGrade: "A",
  },
];

const statusStyles = {
  pending: "bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400",
  approved: "bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-400",
  rejected: "bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-400",
};

const PER_PAGE = 10;

// ── Main Component ────────────────────────────────────────────────────────────
function AdmissionRequests() {
  const [requests, setRequests] = useState(mockRequests);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatus] = useState("All");
  const [classFilter, setClass] = useState("All Classes");
  const [currentPage, setPage] = useState(1);
  const [selected, setSelected] = useState(new Set());
  const [modal, setModal] = useState(null); // { type: "view"|"action"|"bulk", data? }
  const [isSaving, setIsSaving] = useState(false);
  const [actionTarget, setTarget] = useState(null); // { request, newStatus }

  // Derived filter options
  const classes = useMemo(() => {
    const unique = [...new Set(requests.map((r) => r.applyingClass))].sort();
    return ["All Classes", ...unique];
  }, [requests]);

  // Filtered list
  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return requests.filter((r) => {
      const matchSearch =
        r.studentName.toLowerCase().includes(q) ||
        r.fatherName.toLowerCase().includes(q) ||
        r.phone.includes(q);
      const matchStatus = statusFilter === "All" || r.status === statusFilter;
      const matchClass =
        classFilter === "All Classes" || r.applyingClass === classFilter;
      return matchSearch && matchStatus && matchClass;
    });
  }, [requests, search, statusFilter, classFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const paginated = filtered.slice(
    (currentPage - 1) * PER_PAGE,
    currentPage * PER_PAGE,
  );

  // Stats
  const stats = useMemo(
    () => ({
      total: requests.length,
      pending: requests.filter((r) => r.status === "pending").length,
      approved: requests.filter((r) => r.status === "approved").length,
      rejected: requests.filter((r) => r.status === "rejected").length,
    }),
    [requests],
  );

  // Selection
  const allPageSelected = paginated.every((r) => selected.has(r.id));
  const toggleSelectAll = () => {
    if (allPageSelected) {
      setSelected((prev) => {
        const s = new Set(prev);
        paginated.forEach((r) => s.delete(r.id));
        return s;
      });
    } else {
      setSelected((prev) => {
        const s = new Set(prev);
        paginated.forEach((r) => s.add(r.id));
        return s;
      });
    }
  };
  const toggleOne = (id) =>
    setSelected((prev) => {
      const s = new Set(prev);
      s.has(id) ? s.delete(id) : s.add(id);
      return s;
    });

  // Status change
  const confirmChange = (request, newStatus) => {
    setTarget({ request, newStatus });
    setModal({ type: "action" });
  };

  const applyChange = () => {
    setIsSaving(true);
    setTimeout(() => {
      setRequests((prev) =>
        prev.map((r) =>
          r.id === actionTarget.request.id
            ? { ...r, status: actionTarget.newStatus }
            : r,
        ),
      );
      setIsSaving(false);
      setModal(null);
      setTarget(null);
    }, 600);
  };

  const applyBulk = (newStatus) => {
    setIsSaving(true);
    setTimeout(() => {
      setRequests((prev) =>
        prev.map((r) =>
          selected.has(r.id) && r.status === "pending"
            ? { ...r, status: newStatus }
            : r,
        ),
      );
      setSelected(new Set());
      setIsSaving(false);
      setModal(null);
    }, 600);
  };

  const pendingSelected = [...selected].filter(
    (id) => requests.find((r) => r.id === id)?.status === "pending",
  );

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Admission Requests"
        subtitle={`${stats.pending} pending review`}
        action={
          selected.size > 0 ? (
            <div className="flex items-center gap-2">
              <span className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary">
                {selected.size} selected
              </span>
              <button
                onClick={() =>
                  setModal({ type: "bulk", newStatus: "approved" })
                }
                className="flex items-center gap-2 px-3 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors"
              >
                <CheckCircle size={15} /> Approve All
              </button>
              <button
                onClick={() =>
                  setModal({ type: "bulk", newStatus: "rejected" })
                }
                className="flex items-center gap-2 px-3 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-medium rounded-lg transition-colors"
              >
                <XCircle size={15} /> Reject All
              </button>
            </div>
          ) : null
        }
      />

      {/* Stat cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          {
            label: "Total",
            value: stats.total,
            color: "text-light-text-primary dark:text-dark-text-primary",
            bg: "bg-light-card dark:bg-dark-card",
          },
          {
            label: "Pending",
            value: stats.pending,
            color: "text-amber-600 dark:text-amber-400",
            bg: "bg-amber-50 dark:bg-amber-950/40",
          },
          {
            label: "Approved",
            value: stats.approved,
            color: "text-green-600 dark:text-green-400",
            bg: "bg-green-50 dark:bg-green-950/40",
          },
          {
            label: "Rejected",
            value: stats.rejected,
            color: "text-red-600 dark:text-red-400",
            bg: "bg-red-50 dark:bg-red-950/40",
          },
        ].map(({ label, value, color, bg }) => (
          <div
            key={label}
            className={`${bg} border border-light-border dark:border-dark-border rounded-xl p-4`}
          >
            <p className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary mb-1">
              {label}
            </p>
            <p className={`text-2xl font-bold ${color}`}>{value}</p>
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
              placeholder="Search by name, father's name, or phone..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full pl-9 pr-4 py-2 rounded-lg bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border text-light-text-primary dark:text-dark-text-primary placeholder:text-light-text-tertiary dark:placeholder:text-dark-text-tertiary text-sm outline-none focus:border-accent transition-colors"
            />
          </div>
          <select
            value={classFilter}
            onChange={(e) => {
              setClass(e.target.value);
              setPage(1);
            }}
            className="px-3 py-2 rounded-lg bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border text-light-text-primary dark:text-dark-text-primary text-sm outline-none focus:border-accent transition-colors"
          >
            {classes.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(1);
            }}
            className="px-3 py-2 rounded-lg bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border text-light-text-primary dark:text-dark-text-primary text-sm outline-none focus:border-accent transition-colors"
          >
            {["All", "pending", "approved", "rejected"].map((s) => (
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
        <div className="grid grid-cols-[2rem_1.8fr_1.4fr_1fr_1fr_1fr_1.2fr] items-center px-4 py-3 border-b border-light-border dark:border-dark-border min-w-[900px] gap-2">
          <input
            type="checkbox"
            checked={allPageSelected && paginated.length > 0}
            onChange={toggleSelectAll}
            className="w-4 h-4 rounded accent-accent cursor-pointer"
          />
          {[
            "Student",
            "Father / Phone",
            "Applying For",
            "Applied On",
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

        <div className="overflow-x-auto">
          {paginated.length > 0 ? (
            paginated.map((req) => (
              <div
                key={req.id}
                className="grid grid-cols-[2rem_1.8fr_1.4fr_1fr_1fr_1fr_1.2fr] items-center px-4 py-3 border-b border-light-border dark:border-dark-border last:border-0 hover:bg-light-hover dark:hover:bg-dark-hover transition-colors min-w-[900px] gap-2"
              >
                <input
                  type="checkbox"
                  checked={selected.has(req.id)}
                  onChange={() => toggleOne(req.id)}
                  className="w-4 h-4 rounded accent-accent cursor-pointer"
                />

                {/* Student */}
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-accent text-xs font-semibold shrink-0">
                    {req.studentName.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-light-text-primary dark:text-dark-text-primary truncate">
                      {req.studentName}
                    </p>
                    <p className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary">
                      {req.gender} · {req.dob}
                    </p>
                  </div>
                </div>

                {/* Father / Phone */}
                <div className="min-w-0">
                  <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary truncate">
                    {req.fatherName}
                  </p>
                  <p className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary">
                    {req.phone}
                  </p>
                </div>

                <span className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                  {req.applyingClass}
                </span>
                <span className="text-sm text-light-text-tertiary dark:text-dark-text-tertiary">
                  {req.appliedOn}
                </span>
                <StatusPill status={req.status} styles={statusStyles} />

                {/* Actions */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => {
                      setTarget({ request: req });
                      setModal({ type: "view" });
                    }}
                    title="View details"
                    className="w-7 h-7 flex items-center justify-center rounded-lg text-light-text-tertiary dark:text-dark-text-tertiary hover:bg-blue-50 dark:hover:bg-blue-950 hover:text-blue-600 transition-colors"
                  >
                    <Eye size={14} />
                  </button>
                  {req.status === "pending" && (
                    <>
                      <button
                        onClick={() => confirmChange(req, "approved")}
                        title="Approve"
                        className="w-7 h-7 flex items-center justify-center rounded-lg text-light-text-tertiary dark:text-dark-text-tertiary hover:bg-green-50 dark:hover:bg-green-950 hover:text-green-600 transition-colors"
                      >
                        <CheckCircle size={14} />
                      </button>
                      <button
                        onClick={() => confirmChange(req, "rejected")}
                        title="Reject"
                        className="w-7 h-7 flex items-center justify-center rounded-lg text-light-text-tertiary dark:text-dark-text-tertiary hover:bg-red-50 dark:hover:bg-red-950 hover:text-red-600 transition-colors"
                      >
                        <XCircle size={14} />
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <div className="w-12 h-12 bg-light-hover dark:bg-dark-hover rounded-full flex items-center justify-center">
                <Users
                  size={22}
                  className="text-light-text-tertiary dark:text-dark-text-tertiary"
                />
              </div>
              <p className="text-light-text-secondary dark:text-dark-text-secondary text-sm font-medium">
                No requests found
              </p>
              <p className="text-light-text-tertiary dark:text-dark-text-tertiary text-xs">
                Try adjusting filters
              </p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {filtered.length > 0 && (
          <div className="flex items-center justify-between px-5 py-3.5 border-t border-light-border dark:border-dark-border">
            <p className="text-light-text-tertiary dark:text-dark-text-tertiary text-xs">
              Showing{" "}
              {Math.min((currentPage - 1) * PER_PAGE + 1, filtered.length)}–
              {Math.min(currentPage * PER_PAGE, filtered.length)} of{" "}
              {filtered.length}
            </p>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="w-7 h-7 rounded-lg bg-light-hover dark:bg-dark-hover border border-light-border dark:border-dark-border flex items-center justify-center text-light-text-tertiary dark:text-dark-text-tertiary disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={13} />
              </button>
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={`w-7 h-7 rounded-lg border text-xs font-medium transition-all ${
                    currentPage === i + 1
                      ? "bg-accent border-accent text-white"
                      : "bg-light-hover dark:bg-dark-hover border-light-border dark:border-dark-border text-light-text-tertiary dark:text-dark-text-tertiary hover:bg-light-border"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="w-7 h-7 rounded-lg bg-light-hover dark:bg-dark-hover border border-light-border dark:border-dark-border flex items-center justify-center text-light-text-tertiary dark:text-dark-text-tertiary disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronRight size={13} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* View modal */}
      {modal?.type === "view" && actionTarget?.request && (
        <ViewModal
          request={actionTarget.request}
          onClose={() => {
            setModal(null);
            setTarget(null);
          }}
        />
      )}

      {/* Single action confirm */}
      {modal?.type === "action" && actionTarget && (
        <ConfirmModal
          title={
            actionTarget.newStatus === "approved"
              ? "Approve Request"
              : "Reject Request"
          }
          message={
            <>
              Are you sure you want to{" "}
              <span
                className={`font-semibold ${actionTarget.newStatus === "approved" ? "text-green-600" : "text-red-500"}`}
              >
                {actionTarget.newStatus}
              </span>{" "}
              the request for{" "}
              <span className="font-semibold text-light-text-primary dark:text-dark-text-primary">
                {actionTarget.request.studentName}
              </span>
              ?
            </>
          }
          confirmLabel={
            actionTarget.newStatus === "approved" ? "Approve" : "Reject"
          }
          confirmClass={
            actionTarget.newStatus === "approved"
              ? "bg-green-600 hover:bg-green-700"
              : "bg-red-500 hover:bg-red-600"
          }
          isSaving={isSaving}
          onClose={() => {
            setModal(null);
            setTarget(null);
          }}
          onConfirm={applyChange}
        />
      )}

      {/* Bulk action confirm */}
      {modal?.type === "bulk" && (
        <ConfirmModal
          title={
            modal.newStatus === "approved" ? "Bulk Approve" : "Bulk Reject"
          }
          message={
            <>
              This will{" "}
              <span
                className={`font-semibold ${modal.newStatus === "approved" ? "text-green-600" : "text-red-500"}`}
              >
                {modal.newStatus}
              </span>{" "}
              <span className="font-semibold text-light-text-primary dark:text-dark-text-primary">
                {pendingSelected.length} pending
              </span>{" "}
              request{pendingSelected.length !== 1 ? "s" : ""} from the
              selection. This cannot be undone.
            </>
          }
          confirmLabel={
            modal.newStatus === "approved" ? "Approve All" : "Reject All"
          }
          confirmClass={
            modal.newStatus === "approved"
              ? "bg-green-600 hover:bg-green-700"
              : "bg-red-500 hover:bg-red-600"
          }
          isSaving={isSaving}
          onClose={() => setModal(null)}
          onConfirm={() => applyBulk(modal.newStatus)}
        />
      )}
    </div>
  );
}

// ── Modals ────────────────────────────────────────────────────────────────────
function ModalShell({ title, children, onClose, maxWidth = "max-w-2xl" }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div
        className={`w-full ${maxWidth} rounded-xl border border-light-border bg-light-card shadow-xl dark:border-dark-border dark:bg-dark-card`}
      >
        <div className="flex items-center justify-between border-b border-light-border px-5 py-4 dark:border-dark-border">
          <h2 className="text-sm font-semibold text-light-text-primary dark:text-dark-text-primary">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-light-text-tertiary hover:bg-light-hover hover:text-light-text-primary dark:text-dark-text-tertiary dark:hover:bg-dark-hover"
          >
            <X size={16} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function ViewModal({ request, onClose }) {
  const fields = [
    ["Father's Name", request.fatherName],
    ["Phone", request.phone],
    ["Email", request.email],
    ["Gender", request.gender],
    ["Date of Birth", request.dob],
    ["Applying For", request.applyingClass],
    ["Previous School", request.prevSchool],
    ["Previous Grade", request.prevGrade],
    ["Address", request.address],
    ["Applied On", request.appliedOn],
  ];
  return (
    <ModalShell title="Admission Request Details" onClose={onClose}>
      <div className="p-5">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center text-accent text-base font-bold">
            {request.studentName.charAt(0)}
          </div>
          <div>
            <h3 className="text-base font-semibold text-light-text-primary dark:text-dark-text-primary">
              {request.studentName}
            </h3>
            <StatusPill
              status={request.status}
              styles={{
                pending:
                  "bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400",
                approved:
                  "bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-400",
                rejected:
                  "bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-400",
              }}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {fields.map(([label, value]) => (
            <div
              key={label}
              className="rounded-lg border border-light-border px-3 py-2 dark:border-dark-border"
            >
              <p className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary">
                {label}
              </p>
              <p className="mt-1 text-sm font-medium text-light-text-primary dark:text-dark-text-primary">
                {value || "—"}
              </p>
            </div>
          ))}
        </div>
      </div>
    </ModalShell>
  );
}

function ConfirmModal({
  title,
  message,
  confirmLabel,
  confirmClass,
  isSaving,
  onClose,
  onConfirm,
}) {
  return (
    <ModalShell title={title} onClose={onClose} maxWidth="max-w-md">
      <div className="p-5">
        <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
          {message}
        </p>
        <div className="mt-5 flex justify-end gap-2 border-t border-light-border pt-4 dark:border-dark-border">
          <button
            onClick={onClose}
            className="rounded-lg border border-light-border px-4 py-2 text-sm font-medium text-light-text-secondary hover:bg-light-hover dark:border-dark-border dark:text-dark-text-secondary dark:hover:bg-dark-hover"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isSaving}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white disabled:opacity-70 disabled:cursor-not-allowed ${confirmClass}`}
          >
            {isSaving && <Loader2 size={15} className="animate-spin" />}
            {confirmLabel}
          </button>
        </div>
      </div>
    </ModalShell>
  );
}

export default AdmissionRequests;
