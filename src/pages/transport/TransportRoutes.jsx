import { useState, useMemo } from "react";
import {
  Search,
  Plus,
  Bus,
  Users,
  Banknote,
  Pencil,
  Trash2,
  MapPin,
} from "lucide-react";
import PageHeader from "../../components/common/PageHeader";
import { mockTransportRoutes } from "../../data/mockData";

function TransportRoutes() {
  const [search, setSearch] = useState("");
  const [routes, setRoutes] = useState(mockTransportRoutes);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    routeName: "",
    vehicles: 1,
    description: "",
    fare: "",
  });

  const filtered = useMemo(() => {
    return routes.filter(
      (r) =>
        r.routeName.toLowerCase().includes(search.toLowerCase()) ||
        r.description.toLowerCase().includes(search.toLowerCase()),
    );
  }, [search, routes]);

  const summary = useMemo(
    () => ({
      totalRoutes: routes.length,
      totalVehicles: routes.reduce((sum, r) => sum + r.vehicles, 0),
      totalStudents: routes.reduce((sum, r) => sum + r.students, 0),
      avgFare: Math.round(
        routes.reduce((sum, r) => sum + r.fare, 0) / routes.length,
      ),
    }),
    [routes],
  );

  const handleAdd = () => {
    if (!form.routeName || !form.fare) return;
    setRoutes((prev) => [
      {
        id: prev.length + 1,
        routeName: form.routeName,
        vehicles: Number(form.vehicles),
        description: form.description,
        fare: Number(form.fare),
        students: 0,
      },
      ...prev,
    ]);
    setForm({ routeName: "", vehicles: 1, description: "", fare: "" });
    setShowModal(false);
  };

  const handleDelete = (id) => {
    setRoutes((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Transport Management"
        subtitle="Manage school transport routes and vehicles"
        action={
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-accent hover:bg-accent-hover text-white text-sm font-medium rounded-lg transition-colors"
          >
            <Plus size={16} />
            Add Route
          </button>
        }
      />

      {/* Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Total Routes",
            value: summary.totalRoutes,
            bg: "bg-blue-50 dark:bg-blue-950",
            text: "text-blue-600 dark:text-blue-400",
          },
          {
            label: "Total Vehicles",
            value: summary.totalVehicles,
            bg: "bg-green-50 dark:bg-green-950",
            text: "text-green-600 dark:text-green-400",
          },
          {
            label: "Students",
            value: summary.totalStudents,
            bg: "bg-purple-50 dark:bg-purple-950",
            text: "text-purple-600 dark:text-purple-400",
          },
          {
            label: "Avg Fare",
            value: `Rs ${summary.avgFare}`,
            bg: "bg-amber-50 dark:bg-amber-950",
            text: "text-amber-600 dark:text-amber-400",
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

      {/* Search */}
      <div className="bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl p-4">
        <div className="relative">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-light-text-tertiary dark:text-dark-text-tertiary"
          />
          <input
            type="text"
            placeholder="Search by route name or area..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border text-light-text-primary dark:text-dark-text-primary placeholder:text-light-text-tertiary dark:placeholder:text-dark-text-tertiary text-sm outline-none focus:border-accent transition-colors"
          />
        </div>
      </div>

      {/* Routes grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.length > 0 ? (
          filtered.map((route) => (
            <div
              key={route.id}
              className="bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl p-5 hover:border-accent/40 transition-colors"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center shrink-0">
                    <Bus size={18} className="text-accent" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-light-text-primary dark:text-dark-text-primary">
                      {route.routeName}
                    </p>
                    <p className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary mt-0.5 flex items-center gap-1">
                      <MapPin size={10} />
                      {route.description}
                    </p>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-2 mb-4">
                {[
                  { icon: Bus, label: "Vehicles", value: route.vehicles },
                  { icon: Users, label: "Students", value: route.students },
                  { icon: Banknote, label: "Fare", value: `Rs ${route.fare}` },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="bg-light-bg dark:bg-dark-bg rounded-lg p-2.5 text-center"
                  >
                    <p className="text-sm font-semibold text-light-text-primary dark:text-dark-text-primary">
                      {stat.value}
                    </p>
                    <p className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary mt-0.5">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-3 border-t border-light-border dark:border-dark-border">
                <button className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-medium text-light-text-secondary dark:text-dark-text-secondary hover:bg-amber-50 dark:hover:bg-amber-950 hover:text-amber-600 transition-colors">
                  <Pencil size={12} />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(route.id)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-medium text-light-text-secondary dark:text-dark-text-secondary hover:bg-red-50 dark:hover:bg-red-950 hover:text-red-600 transition-colors"
                >
                  <Trash2 size={12} />
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-3 bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl flex flex-col items-center justify-center py-16 gap-3">
            <div className="w-12 h-12 bg-light-hover dark:bg-dark-hover rounded-full flex items-center justify-center">
              <Bus
                size={22}
                className="text-light-text-tertiary dark:text-dark-text-tertiary"
              />
            </div>
            <p className="text-light-text-secondary dark:text-dark-text-secondary text-sm font-medium">
              No routes found
            </p>
          </div>
        )}
      </div>

      {/* Add Route Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl p-6 w-full max-w-lg">
            <h2 className="text-base font-semibold text-light-text-primary dark:text-dark-text-primary mb-5">
              Add Transport Route
            </h2>
            <div className="flex flex-col gap-4">
              {[
                {
                  label: "Route Name",
                  key: "routeName",
                  type: "text",
                  placeholder: "e.g. Route A — Model Town",
                },
                {
                  label: "Description",
                  key: "description",
                  type: "text",
                  placeholder: "Areas covered",
                },
                {
                  label: "Vehicles",
                  key: "vehicles",
                  type: "number",
                  placeholder: "1",
                },
                {
                  label: "Route Fare",
                  key: "fare",
                  type: "number",
                  placeholder: "1500",
                },
              ].map((field) => (
                <div key={field.key} className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-light-text-primary dark:text-dark-text-primary">
                    {field.label}
                  </label>
                  <input
                    type={field.type}
                    value={form[field.key]}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        [field.key]: e.target.value,
                      }))
                    }
                    placeholder={field.placeholder}
                    className="w-full px-4 py-2.5 rounded-lg bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border text-light-text-primary dark:text-dark-text-primary text-sm outline-none focus:border-accent transition-colors"
                  />
                </div>
              ))}
            </div>
            <div className="flex gap-3 mt-5">
              <button
                onClick={handleAdd}
                className="flex-1 py-2.5 bg-accent hover:bg-accent-hover text-white text-sm font-medium rounded-lg transition-colors"
              >
                Add Route
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

export default TransportRoutes;
