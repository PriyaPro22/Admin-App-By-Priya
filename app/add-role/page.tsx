"use client";

import React, { useState } from "react";
import {
  Shield,
  Save,
  CheckSquare,
  Users,
  Package,
  Power,
  Eye,
  Edit3,
  Trash2,
  Plus,
  Lock,
  ChevronRight,
  Info,
  CheckCircle2,
  XCircle,
  Clock
} from "lucide-react";
import { api } from "../utils/api";
import { useTheme } from "../context/ThemeContext";
import toast, { Toaster } from "react-hot-toast";

export default function RolesPermissionsPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [roleName, setRoleName] = useState("");
  const [loading, setLoading] = useState(false);

  // Advanced permission categories
  const [permissions, setPermissions] = useState([
    { id: "users", label: "User Management", description: "Create, edit and delete registered users", read: true, write: false, delete: false },
    { id: "partners", label: "Partner Management", description: "Verify partners and manage their profiles", read: true, write: false, delete: false },
    { id: "inventory", label: "Inventory", description: "Manage product stock and warehouse listings", read: true, write: false, delete: false },
    { id: "finance", label: "Financial Data", description: "View revenue reports and process payouts", read: false, write: false, delete: false },
    { id: "settings", label: "System Utilities", description: "Access app settings and global configurations", read: false, write: false, delete: false },
  ]);

  const togglePermission = (id: string, type: "read" | "write" | "delete") => {
    setPermissions(prev => prev.map(p =>
      p.id === id ? { ...p, [type]: !p[type] } : p
    ));
  };

  const handleSave = async () => {
    if (!roleName.trim()) {
      toast.error("Please enter a role name");
      return;
    }

    try {
      setLoading(true);
      // Map permissions to expected backend format
      const payload = {
        name: roleName,
        permissions: permissions.reduce((acc: any, p) => {
          acc[p.id] = { read: p.read, write: p.write, delete: p.delete };
          return acc;
        }, {})
      };

      // await api.post("/role", payload); // Uncomment when real API is ready

      toast.success("Role Created Successfully!");
      setRoleName("");
      // Reset permissions
    } catch (error) {
      console.error("Failed to save role", error);
      toast.error("Failed to save role");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen p-6 lg:p-10 transition-colors duration-300 ${isDark ? 'bg-[#0b1437] text-white' : 'bg-[#F4F7FE] text-[#2B3674]'}`}>
      <Toaster position="top-right" />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div>
          <h1 className={`text-3xl font-extrabold tracking-tight ${isDark ? 'text-white' : 'text-[#2B3674]'}`}>
            Roles & Permissions
          </h1>
          <p className="text-gray-500 mt-1 font-medium font-sans">Define access levels and security protocols for administrators</p>
        </div>

        <div className="flex items-center gap-3">
          <div className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold ${isDark ? 'bg-[#111C44] text-blue-400 border border-gray-800' : 'bg-white text-blue-600 border border-gray-100 shadow-sm'}`}>
            <Shield size={14} /> SECURITY AUDIT: ON
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

        {/* Left Column: Create Role Form */}
        <div className="lg:col-span-8 flex flex-col gap-8">
          <div className={`p-8 rounded-[32px] border ${isDark ? 'bg-[#111C44] border-gray-800' : 'bg-white border-transparent'} shadow-sm`}>
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-blue-500/10 text-blue-500 rounded-2xl">
                <Plus size={24} strokeWidth={3} />
              </div>
              <h2 className={`text-xl font-black ${isDark ? 'text-white' : 'text-[#2B3674]'}`}>Create New Role</h2>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-3">Role Designation</label>
                <input
                  type="text"
                  value={roleName}
                  onChange={(e) => setRoleName(e.target.value)}
                  placeholder="e.g. Senior Operations Manager"
                  className={`w-full px-6 py-4 rounded-2xl font-bold outline-none border-2 transition-all ${isDark ? 'bg-[#0b1437] border-gray-800 focus:border-blue-500 text-white' : 'bg-[#F4F7FE] border-transparent focus:border-blue-500 text-[#2B3674]'
                    }`}
                />
              </div>

              <div>
                <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-4">Permission Matrix</label>

                <div className="overflow-hidden rounded-2xl border border-gray-100 dark:border-gray-800">
                  <table className="w-full">
                    <thead>
                      <tr className={`${isDark ? 'bg-[#1B254B]' : 'bg-[#F4F7FE]'} text-left`}>
                        <th className="py-4 px-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Module</th>
                        <th className="py-4 px-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Read</th>
                        <th className="py-4 px-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Write</th>
                        <th className="py-4 px-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Delete</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                      {permissions.map((p) => (
                        <tr key={p.id} className="hover:bg-gray-50/50 dark:hover:bg-white/5 transition-colors">
                          <td className="py-5 px-6">
                            <div className="flex flex-col">
                              <span className={`font-bold text-sm ${isDark ? 'text-white' : 'text-[#2B3674]'}`}>{p.label}</span>
                              <span className="text-[11px] text-gray-400 font-medium">{p.description}</span>
                            </div>
                          </td>
                          <td className="py-5 px-6 text-center">
                            <button
                              onClick={() => togglePermission(p.id, 'read')}
                              className={`w-6 h-6 rounded-md border-2 mx-auto flex items-center justify-center transition-all ${p.read ? 'bg-blue-600 border-blue-600 text-white' : 'border-gray-300 dark:border-gray-700'
                                }`}
                            >
                              {p.read && <CheckCircle2 size={14} strokeWidth={3} />}
                            </button>
                          </td>
                          <td className="py-5 px-6 text-center">
                            <button
                              onClick={() => togglePermission(p.id, 'write')}
                              className={`w-6 h-6 rounded-md border-2 mx-auto flex items-center justify-center transition-all ${p.write ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-gray-300 dark:border-gray-700'
                                }`}
                            >
                              {p.write && <CheckCircle2 size={14} strokeWidth={3} />}
                            </button>
                          </td>
                          <td className="py-5 px-6 text-center">
                            <button
                              onClick={() => togglePermission(p.id, 'delete')}
                              className={`w-6 h-6 rounded-md border-2 mx-auto flex items-center justify-center transition-all ${p.delete ? 'bg-rose-500 border-rose-500 text-white' : 'border-gray-300 dark:border-gray-700'
                                }`}
                            >
                              {p.delete && <CheckCircle2 size={14} strokeWidth={3} />}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="pt-4">
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="w-full bg-[#0070f3] text-white py-4 rounded-2xl font-black shadow-lg shadow-blue-500/20 hover:bg-blue-600 active:scale-95 transition-all flex items-center justify-center gap-3"
                >
                  <Save size={20} />
                  {loading ? "PROVISIONING ROLE..." : "CREATE & SAVE ROLE"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Existing Roles & Security Info */}
        <div className="lg:col-span-4 flex flex-col gap-8">

          {/* Active Roles */}
          <div className={`p-8 rounded-[32px] border ${isDark ? 'bg-[#111C44] border-gray-800' : 'bg-white border-transparent'} shadow-sm`}>
            <h3 className={`text-lg font-black mb-6 ${isDark ? 'text-white' : 'text-[#2B3674]'}`}>Active Roles</h3>
            <div className="space-y-4">
              {[
                { name: "Super Admin", color: "blue", count: 2, badge: "Full Access" },
                { name: "Content Manager", color: "emerald", count: 5, badge: "Inventory Only" },
                { name: "Support Lead", color: "amber", count: 8, badge: "Read Only" },
              ].map((role, i) => (
                <div key={i} className={`flex items-center justify-between p-4 rounded-2xl border ${isDark ? 'bg-[#1B254B] border-gray-700' : 'bg-[#F4F7FE] border-transparent'}`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-10 rounded-full bg-${role.color}-500`}></div>
                    <div>
                      <p className={`font-bold text-sm ${isDark ? 'text-white' : 'text-[#2B3674]'}`}>{role.name}</p>
                      <p className="text-[10px] font-black text-gray-400 tracking-wider uppercase">{role.badge}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-black text-gray-400">{role.count} Users</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Security Protocols Panel */}
          <div className="p-8 rounded-[32px] bg-gradient-to-br from-indigo-600 to-purple-700 text-white shadow-xl shadow-indigo-500/20 overflow-hidden relative">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Lock size={120} />
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <Lock className="fill-white" size={24} />
                <h3 className="text-xl font-bold">Security Shield</h3>
              </div>
              <p className="text-white/80 text-sm leading-relaxed mb-8 font-medium">
                Changes to administrative roles are logged under high-priority audit trails. Ensure the <strong>Principle of Least Privilege (PoLP)</strong> is followed.
              </p>

              <div className="space-y-3">
                <div className="flex items-center gap-3 text-xs bg-white/10 p-3 rounded-xl border border-white/5">
                  <Clock size={14} className="text-amber-300" />
                  <span>Session Timeout: 15 mins</span>
                </div>
                <div className="flex items-center gap-3 text-xs bg-white/10 p-3 rounded-xl border border-white/5">
                  <CheckCircle2 size={14} className="text-emerald-300" />
                  <span>2FA required for 'Write' access</span>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
