import { useEffect, useState } from "react";
import {
  Users,
  UserCheck,
  Building2,
  Banknote,
  GraduationCap,
  TrendingUp,
  AlertCircle,
  BookOpen,
  TrendingDown,
  User,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import StatCard from "../../components/common/StatCard";
import {
  mockAttendanceChart,
  mockFeePayments,
  mockExams,
  mockAnnouncements,
  feeStatusStyles,
} from "../../data/mockData";
import { dashboardService } from "../../services/dashboardService";


const AdminDashboard = () => {
  const [stats, setStats] = useState({});
  const [time, setTime] = useState(() => new Date());


    useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);


   const formattedDate = time.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  useEffect(() => {
    const loadStats = async () => {
      try {
        const response = await dashboardService.getAdminStats();
        setStats(response.data?.data || response.data || {});
      } catch {
        setStats({});
      }
    };

    loadStats();
  }, []);

  return (
    <div className="flex flex-col gap-6">
      {/* Page header */}
      <div>
        <h1 className="text-light-text-primary dark:text-dark-text-primary text-xl font-semibold">
          Dashboard
        </h1>
        <p className="text-light-text-secondary dark:text-dark-text-secondary text-sm mt-0.5">
          Welcome back, Super Admin — {formattedDate}
        </p>
      </div>


      {/* KPI Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Students"
          value={stats.total_students ?? stats.students_count ?? 0}
          subtitle="From backend"
          icon={GraduationCap}
          gradient="blue"
        />
        <StatCard
          title="Total Teachers"
          value={stats.total_teachers ?? stats.teachers_count ?? 0}
          subtitle="From backend"
          icon={UserCheck}
          gradient="green"
        />
        <StatCard
          title="Fee Collected"
          value={stats.fee_collected ? `Rs ${stats.fee_collected}` : "Rs 0"}
          subtitle="From backend"
          icon={Banknote}
          gradient="orange"
        />
        <StatCard
          title="Active Classes"
          value={stats.active_classes ?? stats.classes_count ?? 0}
          subtitle="From backend"
          icon={Building2}
          gradient="purple"
        />
        <StatCard
          title="Monthly Income"
          value={stats.monthly_income ? `Rs ${stats.monthly_income}` : "Rs 0"}
          subtitle="From backend"
          icon={TrendingUp}
          gradient="ocean"
        />
        <StatCard
          title="Monthly Expense"
          value={stats.monthly_expense ? `Rs ${stats.monthly_expense}` : "Rs 0"}
          subtitle="From backend"
          icon={TrendingDown}
          gradient="fire"
        />
        <StatCard
          title="Unpaid Invoices"
          value={stats.unpaid_invoices ?? 0}
          subtitle="From backend"
          icon={AlertCircle}
          gradient="candy"
        />
        <StatCard
          title="Total Staff"
          value={stats.total_staff ?? stats.staff_count ?? 0}
          subtitle="From backend"
          icon={Users}
          gradient="aurora"
        />
      </div>

      {/* Middle row — Chart + Fee table */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Attendance Chart */}
        <div className="bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-light-text-primary dark:text-dark-text-primary text-sm font-semibold">
              Today's Attendance
            </h2>
            <span className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary">
              By class
            </span>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={mockAttendanceChart} barSize={28}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#E2E8F0"
                vertical={false}
              />
              <XAxis
                dataKey="class"
                tick={{ fontSize: 11, fill: "#94A3B8" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "#94A3B8" }}
                axisLine={false}
                tickLine={false}
                domain={[0, 100]}
                tickFormatter={(v) => `${v}%`}
              />
              <Tooltip
                formatter={(v) => [`${v}%`, "Attendance"]}
                contentStyle={{
                  background: "#fff",
                  border: "1px solid #E2E8F0",
                  borderRadius: 8,
                  fontSize: 12,
                }}
                cursor={{ fill: "transparent" }}
              />
              <Bar dataKey="percent" fill="#4361EE" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Recent Fee Payments */}
        <div className="bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-light-text-primary dark:text-dark-text-primary text-sm font-semibold">
              Recent Fee Payments
            </h2>
            <button className="text-xs text-accent hover:underline">
              View all
            </button>
          </div>
          <div className="flex flex-col gap-1">
            {/* Table header */}
            <div className="grid grid-cols-4 px-2 pb-2 border-b border-light-border dark:border-dark-border">
              {["Student", "Class", "Amount", "Status"].map((h) => (
                <span
                  key={h}
                  className="text-xs font-medium text-light-text-tertiary dark:text-dark-text-tertiary uppercase tracking-wide"
                >
                  {h}
                </span>
              ))}
            </div>
            {/* Rows */}
            {mockFeePayments.map((p) => (
              <div
                key={p.id}
                className="grid grid-cols-4 px-2 py-2.5 rounded-lg hover:bg-light-hover dark:hover:bg-dark-hover transition-colors"
              >
                <span className="text-sm text-light-text-primary dark:text-dark-text-primary font-medium truncate">
                  {p.name}
                </span>
                <span className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                  {p.class}
                </span>
                <span className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                  {p.amount}
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

      {/* Bottom row — Exams + Announcements + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Upcoming Exams */}
        <div className="bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-light-text-primary dark:text-dark-text-primary text-sm font-semibold">
              Upcoming Exams
            </h2>
            <BookOpen
              size={16}
              className="text-light-text-tertiary dark:text-dark-text-tertiary"
            />
          </div>
          <div className="flex flex-col  gap-3">
            {mockExams.map((exam) => {
              const formattedDate = new Date(exam.date).toLocaleDateString([], {
                month: "short",
                day: "numeric",
              });

              return (
                <div
                  key={exam.id}
                  className="flex items-center justify-between gap-3 rounded-xl p-3 bg-light-hover dark:bg-dark-hover"
                >
                  <div>
                    <p className="text-light-text-primary dark:text-dark-text-primary text-sm font-medium">
                      {exam.subject}
                    </p>
                    <p className="text-light-text-tertiary dark:text-dark-text-tertiary text-xs">
                      {exam.class} · {exam.time}
                    </p>
                  </div>
                  <span className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary">
                    {formattedDate}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Announcements */}
        <div className="bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-light-text-primary dark:text-dark-text-primary text-sm font-semibold">
              Announcements
            </h2>
            <button className="text-xs text-accent hover:underline">
              + Post
            </button>
          </div>
          <div className="flex flex-col gap-3">
            {mockAnnouncements.map((a) => (
              <div key={a.id} className="flex items-start gap-3">
                <div
                  className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${a.color}`}
                />
                <div>
                  <p className="text-light-text-primary dark:text-dark-text-primary text-sm">
                    {a.title}
                  </p>
                  <p className="text-light-text-tertiary dark:text-dark-text-tertiary text-xs mt-0.5">
                    {a.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl p-5">
          <h2 className="text-light-text-primary dark:text-dark-text-primary text-sm font-semibold mb-4">
            Quick Actions
          </h2>
          <div className="flex flex-col gap-2">
            {[
              {
                label: "Add new student",
                icon: Users,
                color: "text-blue-500 bg-blue-50 dark:bg-blue-950",
              },
              {
                label: "Add new teacher",
                icon: UserCheck,
                color: "text-green-500 bg-green-50 dark:bg-green-950",
              },
              {
                label: "Post announcement",
                icon: TrendingUp,
                color: "text-purple-500 bg-purple-50 dark:bg-purple-950",
              },
              {
                label: "Record fee payment",
                icon: Banknote,
                color: "text-amber-500 bg-amber-50 dark:bg-amber-950",
              },
              {
                label: "View fee defaulters",
                icon: AlertCircle,
                color: "text-red-500 bg-red-50 dark:bg-red-950",
              },
            ].map((action) => (
              <button
                key={action.label}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg border border-light-border dark:border-dark-border hover:bg-light-hover dark:hover:bg-dark-hover transition-colors text-left"
              >
                <div
                  className={`w-7 h-7 rounded-md flex items-center justify-center shrink-0 ${action.color}`}
                >
                  <action.icon size={14} />
                </div>
                <span className="text-light-text-secondary dark:text-dark-text-secondary text-sm">
                  {action.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
