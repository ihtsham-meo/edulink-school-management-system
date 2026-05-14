import { useState } from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "./Sidebar/AdminSidebar";
import Topbar from "./Topbar/Topbar";

function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen bg-light-bg dark:bg-dark-bg overflow-hidden">
      {/* Sidebar */}
      <AdminSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main area */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* Topbar */}
        <Topbar onMenuClick={() => setSidebarOpen((prev) => !prev)} />

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
