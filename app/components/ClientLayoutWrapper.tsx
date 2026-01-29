"use client";

import React, { useState } from "react";
import Sidebar from "./Sidebar";
import { Menu } from "lucide-react";
import { CategoryProvider } from "../context/CategoryContext";

export default function ClientLayoutWrapper({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <CategoryProvider>
            <div className="flex min-h-screen">
                {/* Sidebar */}
                <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

                {/* Main Content Area */}
                <main className="flex-1 transition-all duration-300 md:ml-64">
                    {/* Mobile Header to toggle sidebar */}
                    <div className="sticky top-0 z-30 flex items-center justify-between bg-blue-900 px-4 py-3 text-white shadow-md md:hidden">
                        <div className="flex items-center gap-3">
                            <button onClick={toggleSidebar}>
                                <Menu className="h-6 w-6" />
                            </button>
                            <span className="text-lg font-bold">Admin Panel</span>
                        </div>
                    </div>

                    {/* Page Content */}
                    <div className="p-4 md:p-8">
                        {children}
                    </div>
                </main>
            </div>
        </CategoryProvider>
    );
}
