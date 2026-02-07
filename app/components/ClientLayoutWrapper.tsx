"use client";

import React, { useState } from "react";
import Sidebar from "./Sidebar";
import { Menu } from "lucide-react";
import { CategoryProvider } from "../context/CategoryContext";
import { useTheme } from "../context/ThemeContext";

export default function ClientLayoutWrapper({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [isSidebarHovered, setIsSidebarHovered] = useState(false);
    const { theme } = useTheme();

    const isDark = theme === "dark";

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const toggleCollapse = () => {
        setIsSidebarCollapsed(!isSidebarCollapsed);
    };

    return (
        <CategoryProvider>
            <div className={`flex min-h-screen transition-colors duration-300 ${isDark ? 'bg-[#0B1437]' : 'bg-[#F4F7FE]'}`}>
                {/* Sidebar */}
                <Sidebar
                    isOpen={isSidebarOpen}
                    onClose={() => setIsSidebarOpen(false)}
                    isCollapsed={isSidebarCollapsed}
                    onToggleCollapse={toggleCollapse}
                    isHovered={isSidebarHovered}
                    onHoverChange={setIsSidebarHovered}
                />

                {/* Main Content Area */}
                <main className={`flex-1 transition-all duration-300 ${isSidebarCollapsed && !isSidebarHovered ? 'md:ml-24' : 'md:ml-72'} overflow-hidden`}>
                    {/* Mobile Header to toggle sidebar */}
                    <div className={`sticky top-0 z-30 flex items-center justify-between px-6 py-4 shadow-md md:hidden transition-colors ${isDark ? 'bg-[#111C44] text-white border-b border-gray-800' : 'bg-white text-gray-800'
                        }`}>
                        <div className="flex items-center gap-4">
                            <button
                                onClick={toggleSidebar}
                                className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-[#1B2559]' : 'hover:bg-gray-100'}`}
                            >
                                <Menu className="h-6 w-6" />
                            </button>
                            <span className="text-xl font-black tracking-tight uppercase">Admin Panel</span>
                        </div>
                    </div>

                    {/* Page Content */}
                    {children}
                </main>
            </div>
        </CategoryProvider>
    );
}
