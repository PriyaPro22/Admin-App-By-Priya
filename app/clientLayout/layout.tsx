"use client";

import { useState } from "react";
import Sidebar from "../components/Sidebar";
import { Menu } from "lucide-react";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isSidebarHovered, setIsSidebarHovered] = useState(false);

  return (
    <div className="flex min-h-screen">
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() =>
          setIsSidebarCollapsed(prev => !prev)
        }
        isHovered={isSidebarHovered}
        onHoverChange={setIsSidebarHovered}
      />

      <main className={`flex-1 ${isSidebarCollapsed ? "md:ml-24" : "md:ml-72"}`}>
        <div className="md:hidden p-4">
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            <Menu />
          </button>
        </div>
        {children}
      </main>
    </div>
  );
}
