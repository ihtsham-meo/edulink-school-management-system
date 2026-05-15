import { useState } from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "./Sidebar/AdminSidebar";
import Topbar from "./Topbar/Topbar";

function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [collapsed, setCollapsed] = useState(false);

  const handleMenuClick = () => {
    if (window.innerWidth < 1024) {
      setSidebarOpen((prev) => !prev); // mobile → slide in/out
    } else {
      setCollapsed((prev) => !prev); // desktop → collapse to icons
    }
  };

  return (
    <div className="flex h-screen bg-light-bg dark:bg-dark-bg overflow-hidden">
      <AdminSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        collapsed={collapsed}
      />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Topbar onMenuClick={handleMenuClick} />
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
