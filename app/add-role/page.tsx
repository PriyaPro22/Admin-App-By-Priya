"use client";

import React, { useState } from "react";
import { Shield, Save, CheckSquare, Square } from "lucide-react";

import { api } from "../utils/api";

export default function AddRole() {
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
    <div className="mx-auto max-w-md animate-fade-in space-y-6">
      <div className="rounded-lg bg-white p-6 shadow-lg border border-gray-100">
        <div className="mb-6 flex items-center justify-center space-x-3 text-blue-900">
          <h1 className="text-2xl font-bold">Add Role</h1>
        </div>

        <div className="space-y-6">
          {/* Role Name Input */}
          <div className="space-y-2">
            <label className="sr-only" htmlFor="roleName">
              Role Name
            </label>
            <input
              type="text"
              id="roleName"
              value={roleName}
              onChange={(e) => setRoleName(e.target.value)}
              placeholder="Enter Role Name"
              className="w-full rounded-md border border-gray-300 px-4 py-3 text-gray-700 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Permissions Checkboxes */}
          <div className="space-y-4 pt-2">
            <label className="flex cursor-pointer items-center space-x-3 group">
              <div
                onClick={() => togglePermission("canManageUsers")}
                className={`flex h-6 w-6 items-center justify-center rounded border transition-colors ${permissions.canManageUsers
                  ? "border-blue-700 bg-blue-700 text-white"
                  : "border-gray-400 bg-white group-hover:border-blue-500"
                  }`}
              >
                {permissions.canManageUsers && <CheckSquare size={16} />}
              </div>
              <span
                className="text-gray-700 select-none"
                onClick={() => togglePermission("canManageUsers")}
              >
                Can Manage Users
              </span>
            </label>

            <label className="flex cursor-pointer items-center space-x-3 group">
              <div
                onClick={() => togglePermission("canManageServices")}
                className={`flex h-6 w-6 items-center justify-center rounded border transition-colors ${permissions.canManageServices
                  ? "border-blue-700 bg-blue-700 text-white"
                  : "border-gray-400 bg-white group-hover:border-blue-500"
                  }`}
              >
                {permissions.canManageServices && <CheckSquare size={16} />}
              </div>
              <span
                className="text-gray-700 select-none"
                onClick={() => togglePermission("canManageServices")}
              >
                Can Manage Services
              </span>
            </label>

            <label className="flex cursor-pointer items-center space-x-3 group">
              <div
                onClick={() => togglePermission("canManageInventory")}
                className={`flex h-6 w-6 items-center justify-center rounded border transition-colors ${permissions.canManageInventory
                  ? "border-blue-700 bg-blue-700 text-white"
                  : "border-gray-400 bg-white group-hover:border-blue-500"
                  }`}
              >
                {permissions.canManageInventory && <CheckSquare size={16} />}
              </div>
              <span
                className="text-gray-700 select-none"
                onClick={() => togglePermission("canManageInventory")}
              >
                Can Manage Inventory
              </span>
            </label>
          </div>

          {/* Save Button */}
          <button
            disabled={loading}
            className="bg-blue-900 text-white h-15 w-40 rounded-full"
          >
            {loading ? "Saving Role..." : "Save Role"}
          </button>
        </div>
      </div>
    </div>
  );
}
