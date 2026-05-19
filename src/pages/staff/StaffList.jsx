import { useEffect, useState, useMemo } from "react";
import {
  Search,
  Plus,
  Eye,
  Pencil,
  Trash2,
  UserCheck,
  Mail,
  Phone,
  AlertCircle,
} from "lucide-react";
import PageHeader from "../../components/common/PageHeader";
import StatusPill from "../../components/common/StatusPill";
import { staffService } from "../../services/staffService";
import {
  CrudModal,
  DetailGrid,
  Field,
  ModalButton,
  SelectField,
} from "../../components/common/CrudModal";

const departments = [
  "All Departments",
  "Mathematics",
  "English",
  "Science",
  "Computer Science",
];

const staffStatusStyles = {
  active: "bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-400",
  inactive: "bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-400",
};

const normalizeStaff = (payload) => {
  const items = Array.isArray(payload)
    ? payload
    : payload?.data?.data ||
      payload?.data?.users ||
      payload?.data ||
      payload?.users ||
      [];

  if (!Array.isArray(items)) return [];

  return items.map((staff) => {
    const profile = staff.profile || staff.staff_profile || {};
    return {
      id: staff.id,
      name: staff.name || "",
      empCode: profile.employee_code || profile.staff_code || String(staff.id || ""),
      designation: profile.designation || "",
      department: profile.department || "General",
      email: staff.email || "",
      phone: staff.phone || "",
      status: staff.status || "active",
      classes: staff.classes || profile.classes || [],
    };
  });
};

function StaffList() {
  const [staffList, setStaffList] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedDept, setDept] = useState("All Departments");
  const [selectedStatus, setStatus] = useState("All");
  const [error, setError] = useState("");
  const [modalMode, setModalMode] = useState(null);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [form, setForm] = useState({
    name: "",
    empCode: "",
    designation: "",
    department: "Mathematics",
    email: "",
    phone: "",
    status: "active",
    classes: "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const loadStaff = async () => {
      setError("");

      try {
        const response = await staffService.getAll();
        setStaffList(normalizeStaff(response.data));
      } catch (err) {
        setStaffList([]);
        setError(err.response?.data?.message || "Could not load staff from the backend.");
      }
    };

    loadStaff();
  }, []);

  const filtered = useMemo(() => {
    return staffList.filter((t) => {
      const matchSearch =
        t.name.toLowerCase().includes(search.toLowerCase()) ||
        t.empCode.toLowerCase().includes(search.toLowerCase());
      const matchDept =
        selectedDept === "All Departments" || t.department === selectedDept;
      const matchStatus =
        selectedStatus === "All" || t.status === selectedStatus;
      return matchSearch && matchDept && matchStatus;
    });
  }, [staffList, search, selectedDept, selectedStatus]);

  const summary = useMemo(
    () => ({
      total: staffList.length,
      active: staffList.filter((t) => t.status === "active").length,
      inactive: staffList.filter((t) => t.status === "inactive").length,
      depts: [...new Set(staffList.map((t) => t.department))].length,
    }),
    [staffList],
  );

  const openAddModal = () => {
    setSelectedStaff(null);
    setErrors({});
    setForm({
      name: "",
      empCode: "",
      designation: "",
      department: "Mathematics",
      email: "",
      phone: "",
      status: "active",
      classes: "",
    });
    setModalMode("form");
  };

  const openEditModal = (staff) => {
    setSelectedStaff(staff);
    setErrors({});
    setForm({
      ...staff,
      classes: staff.classes.join(", "),
    });
    setModalMode("form");
  };

  const validate = () => {
    const nextErrors = {};
    if (!form.name.trim()) nextErrors.name = "Name is required";
    if (!form.email.trim()) nextErrors.email = "Email is required";
    if (form.email && !/^\S+@\S+\.\S+$/.test(form.email)) {
      nextErrors.email = "Enter a valid email";
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    const payload = {
      ...form,
      name: form.name.trim(),
      empCode: form.empCode.trim(),
      designation: form.designation.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      classes: form.classes
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
    };

    try {
      if (selectedStaff) {
        await staffService.update(selectedStaff.id, payload);
        setStaffList((prev) =>
          prev.map((staff) =>
            staff.id === selectedStaff.id ? { ...staff, ...payload } : staff,
          ),
        );
      } else {
        const response = await staffService.create(payload);
        const createdStaff =
          normalizeStaff(response.data).at(0) ||
          normalizeStaff(response.data?.data).at(0) ||
          { ...payload, id: response.data?.data?.id || Date.now() };
        setStaffList((prev) => [createdStaff, ...prev]);
      }
      setModalMode(null);
    } catch (err) {
      setError(err.response?.data?.message || "Could not save staff.");
    }
  };

  const handleDelete = async () => {
    try {
      await staffService.delete(selectedStaff.id);
      setStaffList((prev) => prev.filter((staff) => staff.id !== selectedStaff.id));
      setModalMode(null);
    } catch (err) {
      setError(err.response?.data?.message || "Could not delete staff.");
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <PageHeader
        title="Staff Management"
        subtitle="Manage all teachers and staff members"
        action={
          <button
            onClick={openAddModal}
            className="flex items-center gap-2 px-4 py-2 bg-accent hover:bg-accent-hover text-white text-sm font-medium rounded-lg transition-colors"
          >
            <Plus size={16} />
            Add Staff
          </button>
        }
      />

      {error && (
        <div className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-300">
          <AlertCircle size={17} className="mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Total Staff",
            value: summary.total,
            bg: "bg-blue-50 dark:bg-blue-950",
            text: "text-blue-600 dark:text-blue-400",
          },
          {
            label: "Active",
            value: summary.active,
            bg: "bg-green-50 dark:bg-green-950",
            text: "text-green-600 dark:text-green-400",
          },
          {
            label: "Inactive",
            value: summary.inactive,
            bg: "bg-red-50 dark:bg-red-950",
            text: "text-red-600 dark:text-red-400",
          },
          {
            label: "Departments",
            value: summary.depts,
            bg: "bg-purple-50 dark:bg-purple-950",
            text: "text-purple-600 dark:text-purple-400",
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
              placeholder="Search by name or employee code..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-lg bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border text-light-text-primary dark:text-dark-text-primary placeholder:text-light-text-tertiary dark:placeholder:text-dark-text-tertiary text-sm outline-none focus:border-accent transition-colors"
            />
          </div>

          {/* Department filter */}
          <select
            value={selectedDept}
            onChange={(e) => setDept(e.target.value)}
            className="px-3 py-2 rounded-lg bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border text-light-text-primary dark:text-dark-text-primary text-sm outline-none focus:border-accent transition-colors"
          >
            {departments.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>

          {/* Status filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setStatus(e.target.value)}
            className="px-3 py-2 rounded-lg bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border text-light-text-primary dark:text-dark-text-primary text-sm outline-none focus:border-accent transition-colors"
          >
            {["All", "active", "inactive"].map((s) => (
              <option key={s} value={s}>
                {s === "All"
                  ? "All Status"
                  : s.charAt(0).toUpperCase() + s.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Staff grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((staff) => (
            <div
              key={staff.id}
              className="bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl p-5 hover:border-accent/40 transition-colors"
            >
              {/* Top row */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-accent/10 flex items-center justify-center text-accent text-base font-semibold shrink-0">
                    {staff.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-light-text-primary dark:text-dark-text-primary">
                      {staff.name}
                    </p>
                    <p className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary">
                      {staff.empCode}
                    </p>
                  </div>
                </div>
                <StatusPill status={staff.status} styles={staffStatusStyles} />
              </div>

              {/* Details */}
              <div className="flex flex-col gap-2 mb-4">
                <div className="flex items-center gap-2 text-xs text-light-text-secondary dark:text-dark-text-secondary">
                  <UserCheck
                    size={13}
                    className="text-light-text-tertiary dark:text-dark-text-tertiary shrink-0"
                  />
                  {staff.designation} · {staff.department}
                </div>
                <div className="flex items-center gap-2 text-xs text-light-text-secondary dark:text-dark-text-secondary">
                  <Mail
                    size={13}
                    className="text-light-text-tertiary dark:text-dark-text-tertiary shrink-0"
                  />
                  {staff.email}
                </div>
                <div className="flex items-center gap-2 text-xs text-light-text-secondary dark:text-dark-text-secondary">
                  <Phone
                    size={13}
                    className="text-light-text-tertiary dark:text-dark-text-tertiary shrink-0"
                  />
                  {staff.phone}
                </div>
              </div>

              {/* Classes */}
              {staff.classes.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-4">
                  {staff.classes.map((c) => (
                    <span
                      key={c}
                      className="text-xs px-2 py-0.5 rounded-md bg-accent/10 text-accent font-medium"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center gap-2 pt-3 border-t border-light-border dark:border-dark-border">
                <button
                  onClick={() => {
                    setSelectedStaff(staff);
                    setModalMode("view");
                  }}
                  className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-medium text-light-text-secondary dark:text-dark-text-secondary hover:bg-blue-50 dark:hover:bg-blue-950 hover:text-blue-600 transition-colors"
                >
                  <Eye size={13} />
                  View
                </button>
                <button
                  onClick={() => openEditModal(staff)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-medium text-light-text-secondary dark:text-dark-text-secondary hover:bg-amber-50 dark:hover:bg-amber-950 hover:text-amber-600 transition-colors"
                >
                  <Pencil size={13} />
                  Edit
                </button>
                <button
                  onClick={() => {
                    setSelectedStaff(staff);
                    setModalMode("delete");
                  }}
                  className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-medium text-light-text-secondary dark:text-dark-text-secondary hover:bg-red-50 dark:hover:bg-red-950 hover:text-red-600 transition-colors"
                >
                  <Trash2 size={13} />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl flex flex-col items-center justify-center py-16 gap-3">
          <div className="w-12 h-12 bg-light-hover dark:bg-dark-hover rounded-full flex items-center justify-center">
            <UserCheck
              size={22}
              className="text-light-text-tertiary dark:text-dark-text-tertiary"
            />
          </div>
          <p className="text-light-text-secondary dark:text-dark-text-secondary text-sm font-medium">
            No staff found
          </p>
          <p className="text-light-text-tertiary dark:text-dark-text-tertiary text-xs">
            Try adjusting your search or filters
          </p>
        </div>
      )}

      {modalMode === "form" && (
        <CrudModal
          title={selectedStaff ? "Edit Staff" : "Add Staff"}
          onClose={() => setModalMode(null)}
          footer={
            <>
              <ModalButton onClick={() => setModalMode(null)}>Cancel</ModalButton>
              <ModalButton variant="primary" onClick={handleSave}>
                {selectedStaff ? "Save Changes" : "Add Staff"}
              </ModalButton>
            </>
          }
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Name" value={form.name} error={errors.name} onChange={(value) => setForm((prev) => ({ ...prev, name: value }))} />
            <Field label="Employee Code" value={form.empCode} error={errors.empCode} onChange={(value) => setForm((prev) => ({ ...prev, empCode: value }))} />
            <Field label="Designation" value={form.designation} error={errors.designation} onChange={(value) => setForm((prev) => ({ ...prev, designation: value }))} />
            <SelectField label="Department" value={form.department} options={departments.slice(1)} onChange={(value) => setForm((prev) => ({ ...prev, department: value }))} />
            <Field label="Email" type="email" value={form.email} error={errors.email} onChange={(value) => setForm((prev) => ({ ...prev, email: value }))} />
            <Field label="Phone" value={form.phone} error={errors.phone} onChange={(value) => setForm((prev) => ({ ...prev, phone: value }))} />
            <SelectField label="Status" value={form.status} options={["active", "inactive"]} onChange={(value) => setForm((prev) => ({ ...prev, status: value }))} />
            <Field label="Classes" value={form.classes} placeholder="10-A, 9-B" onChange={(value) => setForm((prev) => ({ ...prev, classes: value }))} />
          </div>
        </CrudModal>
      )}

      {modalMode === "view" && selectedStaff && (
        <CrudModal title="Staff Details" onClose={() => setModalMode(null)}>
          <DetailGrid
            items={[
              ["Name", selectedStaff.name],
              ["Employee Code", selectedStaff.empCode],
              ["Designation", selectedStaff.designation],
              ["Department", selectedStaff.department],
              ["Email", selectedStaff.email],
              ["Phone", selectedStaff.phone],
              ["Status", selectedStaff.status],
              ["Classes", selectedStaff.classes.join(", ")],
            ]}
          />
        </CrudModal>
      )}

      {modalMode === "delete" && selectedStaff && (
        <CrudModal
          title="Delete Staff"
          onClose={() => setModalMode(null)}
          footer={
            <>
              <ModalButton onClick={() => setModalMode(null)}>Cancel</ModalButton>
              <ModalButton variant="danger" onClick={handleDelete}>Delete</ModalButton>
            </>
          }
        >
          <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
            Are you sure you want to delete{" "}
            <span className="font-semibold text-light-text-primary dark:text-dark-text-primary">
              {selectedStaff.name}
            </span>
            ?
          </p>
        </CrudModal>
      )}
    </div>
  );
}

export default StaffList;
