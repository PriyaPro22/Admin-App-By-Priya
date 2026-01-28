"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Briefcase,
  ShoppingBag,
  Tags,
  Box,
  UserPlus,
  ShieldCheck,
  LogOut,
  X,
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const pathname = usePathname();

  const menuItems = [
    { name: "Dashboard", icon: LayoutDashboard, href: "/" },
    { name: "User Management", icon: Users, href: "/user-management" },
    { name: "Partner Management", icon: Briefcase, href: "/partner-management" },
    { name: "Service Booking", icon: Briefcase, href: "/service-booking" },
    { name: "Brands Manage", icon: ShoppingBag, href: "/brands-manage" },
    { name: "Inventory Management", icon: Box, href: "/inventory-management" },
    { name: "Add Member", icon: UserPlus, href: "/add-member" },
    { name: "Add Role", icon: ShieldCheck, href: "/add-role" },
  ];

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 left-0 z-50 h-screen w-64 bg-white shadow-lg transition-transform duration-300 md:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo Section */}
        <div className="flex h-40 flex-col items-center justify-center bg-blue-800 text-white relative">
            <button 
                onClick={onClose}
                className="absolute top-4 right-4 md:hidden text-white"
            >
                <X size={24} />
            </button>
          <div className="relative mb-2 flex h-20 w-20 items-center justify-center rounded-lg border-4 border-gray-400/30">
             {/* Placeholder for Shield Logo - simplified with text for now or SVG if available */}
             <div className="text-3xl font-bold tracking-tighter">BWA</div>
          </div>
          <h1 className="text-2xl font-bold tracking-wide">Admin</h1>
        </div>

        {/* Navigation Items */}
        <nav className="mt-4 flex-1 overflow-y-auto px-4 py-2">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`flex items-center gap-3 rounded-md px-4 py-3 text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-blue-50 text-blue-700"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                    onClick={onClose} // Close sidebar on mobile when item clicked
                  >
                    <item.icon className={`h-5 w-5 ${isActive ? "text-blue-700" : "text-gray-500"}`} />
                    {item.name}
                  </Link>
                </li>
              );
            })}
             <li className="mt-8 border-t pt-4">
                  <button
                    className="flex w-full items-center gap-3 rounded-md px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    <LogOut className="h-5 w-5 text-gray-500" />
                    Logout
                  </button>
                </li>
          </ul>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
