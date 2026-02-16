"use client";

import { useState, useEffect } from "react";

interface CancellationPolicy {
  _id?: string;
  id?: string;
  title: string;
  description: string;
  isActive?: boolean;
}

export default function CancellationPolicyPage() {
  const [policies, setPolicies] = useState<CancellationPolicy[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isActive, setIsActive] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // API URL
  const API_BASE = "https://api.bijliwalaaya.in/api/cancellation-policy";

  // GET All Policies - FIXED
  const fetchPolicies = async () => {
    setError(null);
    try {
      const res = await fetch(API_BASE, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-api-token": "super_secure_token"
        },
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const response = await res.json();
      console.log("API Response:", response); // Debug k liye
      
      // ✅ FIX: Response mein { success: true, data: [...] } aata hai
      if (response.success && Array.isArray(response.data)) {
        // Har policy mein id set karo (_id se)
        const formattedPolicies = response.data.map((policy: any) => ({
          ...policy,
          id: policy._id || policy.id, // Dono ko handle karo
        }));
        setPolicies(formattedPolicies);
      } else {
        setPolicies([]);
        setError("Invalid response format from server");
      }
    } catch (error) {
      console.error("Error fetching:", error);
      setError("Failed to connect to server. Please check your internet connection.");
      setPolicies([]);
    }
  };

  useEffect(() => {
    fetchPolicies();
  }, []);

  // Create Policy
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const payload = { title, description };

    try {
      let url = API_BASE;
      let method = "POST";

      if (editingId) {
        url = `${API_BASE}/${editingId}`;
        method = "PUT";
      }

      const res = await fetch(url, {
        method: method,
        headers: { 
          "Content-Type": "application/json",
          "x-api-token": "super_secure_token"
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Server responded with ${res.status}: ${errorText}`);
      }

      const response = await res.json();
      console.log("Save Response:", response);
      
      alert("Policy saved successfully!");
      
      // Reset form
      setTitle("");
      setDescription("");
      setIsActive(false);
      setEditingId(null);
      
      // Refresh list
      await fetchPolicies();
    } catch (error: any) {
      console.error("Error:", error);
      setError(error.message || "Failed to save policy. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Edit Policy
  const handleEdit = (policy: CancellationPolicy) => {
    setTitle(policy.title);
    setDescription(policy.description);
    setIsActive(policy.isActive || false);
    setEditingId(policy.id || policy._id || null);
  };

  // Delete Policy
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this policy?")) return;
    
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/${id}`, {
        method: "DELETE",
        headers: { 
          "Content-Type": "application/json",
          "x-api-token": "super_secure_token"
        },
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      alert("Policy deleted successfully!");
      await fetchPolicies();
    } catch (error) {
      console.error("Error deleting:", error);
      setError("Failed to delete policy. Please try again.");
    }
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Breadcrumb */}
      <div className="px-8 py-4 border-b border-gray-200">
        <div className="flex items-center gap-1 text-sm">
          <span className="text-gray-600">User Management</span>
          <span className="text-gray-400 mx-1">›</span>
          <span className="text-gray-600">User App</span>
          <span className="text-gray-400 mx-1">›</span>
          <span className="text-[#0052CC] font-medium">Cancellation Policy</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-8 max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900 mb-1">Cancellation Policy</h1>
          <p className="text-gray-500 text-sm">Configure and manage rules for user order cancellations.</p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
            <button 
              onClick={fetchPolicies}
              className="mt-2 text-xs text-red-500 hover:text-red-700 underline"
            >
              Try again
            </button>
          </div>
        )}

        {/* Form Card */}
        <div className="border border-gray-200 rounded-lg mb-8">
          <div className="border-b border-gray-200 px-6 py-4">
            <h2 className="text-base font-medium text-gray-900">
              {editingId ? "Edit Cancellation Policy" : "Add Cancellation Policy"}
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="p-6">
            <div className="space-y-6">
              {/* Policy Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Policy Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#0052CC] focus:border-transparent"
                  placeholder="e.g., Standard 24-Hour Cancellation"
                  required
                />
              </div>

              {/* Policy Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Policy Description <span className="text-red-500">*</span>
                </label>
                
                {/* Toolbar */}
                <div className="flex items-center gap-1 px-3 py-2 bg-gray-50 border border-gray-300 rounded-t-md border-b-0">
                  
                 
                
                  <div className="w-px h-5 bg-gray-300 mx-1"></div>
                
                </div>

                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-b-md text-sm focus:outline-none focus:ring-2 focus:ring-[#0052CC] focus:border-transparent"
                  placeholder="Enter the full terms and conditions of this policy..."
                  rows={4}
                  required
                />

                <p className="text-xs text-gray-500 mt-2">
                  This description will be displayed to users in the mobile app during the cancellation flow.
                </p>
              </div>

              {/* Active Toggle */}
              

              {/* Form Buttons */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 bg-[#0052CC] text-white text-sm font-medium rounded-md hover:bg-[#0052CC]/90 disabled:opacity-50"
                >
                  {loading ? "Saving..." : editingId ? "Update Policy" : "Save Policy"}
                </button>
                
                {editingId && (
                  <button
                    type="button"
                    onClick={() => {
                      setTitle("");
                      setDescription("");
                      setIsActive(false);
                      setEditingId(null);
                    }}
                    className="px-6 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>

        {/* Policies Table */}
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <div className="border-b border-gray-200 px-6 py-4 bg-gray-50">
            <h2 className="text-base font-medium text-gray-900">All Cancellation Policies</h2>
          </div>

          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Title</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Description</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {policies.length > 0 ? (
                policies.map((policy) => (
                  <tr key={policy._id || policy.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{policy.title}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 max-w-md truncate">{policy.description}</td>
                    <td className="px-6 py-4">
                      {policy.isActive ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-[#0052CC]/10 text-[#0052CC]">
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600">
                          Inactive
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleEdit(policy)}
                        className="text-[#0052CC] hover:text-[#0052CC]/80 mr-3 text-sm font-medium"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(policy._id || policy.id || '')}
                        className="text-red-600 hover:text-red-800 text-sm font-medium"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                    {error ? "Unable to load policies" : "No policies found. Create your first policy above."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}