"use client";

import React, { useState } from "react";
import { Shield, Save, CheckSquare, Square } from "lucide-react";

import { api } from "../utils/api";
import { useTheme } from "../context/ThemeContext";

export default function AddRole() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [roleName, setRoleName] = useState("");
  const [permissions, setPermissions] = useState({
    canManageUsers: false,
    canManageServices: false,
    canManageInventory: false,
  });
  const [loading, setLoading] = useState(false);

  const togglePermission = (key: keyof typeof permissions) => {
    setPermissions((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSave = async () => {
    if (!roleName.trim()) {
      alert("Role Name is required");
      return;
    }

    try {
      setLoading(true);
      const payload = {
        name: roleName,
        permissions
      };
      await api.post("/role", payload);
      alert("Role Saved Successfully!");
      setRoleName("");
      setPermissions({
        canManageUsers: false,
        canManageServices: false,
        canManageInventory: false,
      });
    } catch (error) {
      console.error("Failed to save role", error);
      alert("Failed to save role. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-lg animate-fade-in p-2">
      <div className={`rounded-3xl p-8 shadow-xl border ${isDark ? 'bg-[#111C44] border-gray-800' : 'bg-white border-gray-100'}`}>
        <div className="mb-8 flex items-center gap-4">
          <div className="p-3 bg-blue-600/10 rounded-2xl">
            <Shield className="text-blue-600" size={32} />
          </div>
          <div>
            <h1 className={`text-2xl font-black ${isDark ? 'text-white' : 'text-[#2B3674]'}`}>Add Role</h1>
            <p className="text-sm text-gray-400 font-medium">Define new access levels</p>
          </div>
        </div>

        <div className="space-y-8">
          {/* Role Name Input */}
          <div className="space-y-3">
            <label className={`text-sm font-bold ml-1 ${isDark ? 'text-gray-400' : 'text-[#2B3674]'}`} htmlFor="roleName">
              Role Name
            </label>
            <input
              type="text"
              id="roleName"
              value={roleName}
              onChange={(e) => setRoleName(e.target.value)}
              placeholder="e.g. Sales Manager"
              className={`w-full rounded-2xl border px-5 py-4 outline-none transition-all focus:ring-2 focus:ring-blue-500/20 ${isDark
                ? 'bg-[#1B2559] border-gray-700 text-white placeholder-gray-500 focus:border-blue-500'
                : 'bg-gray-50 border-gray-200 text-[#2B3674] placeholder-gray-400 focus:border-blue-600'
                }`}
            />
          </div>

          {/* Permissions Grid */}
          <div className="space-y-4 pt-2">
            <h3 className={`text-sm font-bold ml-1 mb-4 ${isDark ? 'text-gray-400' : 'text-[#2B3674]'}`}>Permissions</h3>
            <div className="grid gap-3">
              {[
                { key: "canManageUsers", label: "Can Manage Users" },
                { key: "canManageServices", label: "Can Manage Services" },
                { key: "canManageInventory", label: "Can Manage Inventory" }
              ].map((perm) => (
                <label
                  key={perm.key}
                  className={`flex cursor-pointer items-center justify-between p-4 rounded-2xl border transition-all hover:scale-[1.01] ${isDark
                    ? 'bg-[#111C44] border-gray-800 hover:bg-[#1B2559]'
                    : 'bg-white border-gray-100 hover:shadow-md'
                    }`}
                >
                  <span className={`font-bold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{perm.label}</span>
                  <div
                    onClick={(e) => {
                      e.preventDefault();
                      togglePermission(perm.key as keyof typeof permissions);
                    }}
                    className={`flex h-7 w-7 items-center justify-center rounded-lg border-2 transition-all ${permissions[perm.key as keyof typeof permissions]
                      ? "border-blue-600 bg-blue-600 text-white"
                      : isDark ? "border-gray-700 bg-transparent" : "border-gray-200 bg-gray-50"
                      }`}
                  >
                    {permissions[perm.key as keyof typeof permissions] && <CheckSquare size={18} strokeWidth={3} />}
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Save Button */}
          <button
            onClick={handleSave}
            disabled={loading}
            className={`flex w-full items-center justify-center gap-3 rounded-2xl py-4 text-lg font-black transition-all active:scale-95 shadow-lg ${loading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20'
              }`}
          >
            <Save size={20} />
            {loading ? "Saving Role..." : "Save Role"}
          </button>
        </div>
      </div>
    </div>
  );
}
