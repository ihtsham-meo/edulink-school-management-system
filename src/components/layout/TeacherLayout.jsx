import { useState } from "react";
import { Outlet } from "react-router-dom";
import TeacherSidebar from "./Sidebar/TeacherSidebar";
import Topbar from "./Topbar/Topbar";

function TeacherLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen bg-light-bg dark:bg-dark-bg overflow-hidden">
      <TeacherSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Topbar onMenuClick={() => setSidebarOpen((prev) => !prev)} />
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default TeacherLayout;
