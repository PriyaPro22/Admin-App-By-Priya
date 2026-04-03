"use client";

import React, { useState, useEffect } from "react";
import { XCircle, Trash2, Edit2, Plus, Save, X, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import ToggleSwitch from "../../components/ui/ToggleSwitch";
import axios from 'axios';
import { API_BASE_URL, API_TOKEN, getAuthHeaders } from '../../utils/api';

interface CancellationReason {
    _id: string;
    reason: string;
    visibility: boolean;
}

export default function CancellationReasonManagement() {
    const router = useRouter();

    // Data State
    const [reasons, setReasons] = useState<CancellationReason[]>([]);
    const [loading, setLoading] = useState(true);

    // Form State
    const [newReason, setNewReason] = useState("");
    const [formVisibility, setFormVisibility] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    // Editing State
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editValue, setEditValue] = useState("");
    const [updating, setUpdating] = useState(false);

    const API_URL = `${API_BASE_URL}/cancellation-reasons`;

    useEffect(() => {
        fetchReasons();
    }, []);

    const fetchReasons = async () => {
        try {
            setLoading(true);
            const response = await axios.get(API_URL, {
                headers: getAuthHeaders()
            });
            if (response.data.success) {
                setReasons(response.data.data);
            }
        } catch (error) {
            console.error("Error fetching reasons:", error);
            alert("Failed to fetch cancellation reasons");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newReason.trim()) return alert("Please enter a reason");

        try {
            setSubmitting(true);
            const response = await axios.post(API_URL, {
                reason: newReason.trim(),
                visibility: formVisibility
            }, {
                headers: getAuthHeaders()
            });

            if (response.data.success) {
                setNewReason("");
                fetchReasons(); // Refresh list
                alert("Cancellation Reason Added!");
            }
        } catch (error) {
            console.error("Error adding reason:", error);
            alert("Failed to add cancellation reason");
        } finally {
            setSubmitting(false);
        }
    };

    const handleToggleVisibility = async (id: string, currentVisibility: boolean) => {
        try {
            const response = await axios.put(`${API_URL}/${id}`, {
                visibility: !currentVisibility
            }, {
                headers: getAuthHeaders()
            });

            if (response.data.success) {
                setReasons(reasons.map(item =>
                    item._id === id ? { ...item, visibility: !currentVisibility } : item
                ));
            }
        } catch (error) {
            console.error("Error toggling visibility:", error);
            alert("Failed to update visibility");
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm("Are you sure you want to delete this reason?")) return;

        try {
            const response = await axios.delete(`${API_URL}/${id}`, {
                headers: getAuthHeaders()
            });

            if (response.data.success) {
                setReasons(reasons.filter(item => item._id !== id));
                alert("Reason deleted successfully");
            }
        } catch (error) {
            console.error("Error deleting reason:", error);
            alert("Failed to delete reason");
        }
    };

    const startEditing = (reason: CancellationReason) => {
        setEditingId(reason._id);
        setEditValue(reason.reason);
    };

    const saveEdit = async () => {
        if (!editValue.trim()) return alert("Reason cannot be empty");
        
        try {
            setUpdating(true);
            const response = await axios.put(`${API_URL}/${editingId}`, {
                reason: editValue.trim()
            }, {
                headers: getAuthHeaders()
            });

            if (response.data.success) {
                setReasons(reasons.map(item =>
                    item._id === editingId ? { ...item, reason: editValue.trim() } : item
                ));
                setEditingId(null);
                setEditValue("");
            }
        } catch (error) {
            console.error("Error updating reason:", error);
            alert("Failed to update reason");
        } finally {
            setUpdating(false);
        }
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditValue("");
    };

    return (
        <div className="mx-auto max-w-2xl animate-fade-in pb-12 px-4 mt-6">
            {/* Header Banner */}
            <div className="mb-8 flex items-center gap-4 rounded-xl bg-red-50 px-6 py-4 text-red-700 border border-red-100 shadow-sm">
                <button 
                    onClick={() => router.back()}
                    className="hover:bg-red-100 p-2 rounded-full transition-colors"
                >
                    <XCircle className="h-6 w-6 text-red-600" />
                </button>
                <h1 className="text-xl font-bold tracking-tight">Cancellation Reason</h1>
            </div>

            {/* Input Form Card */}
            <div className="mb-10 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg">
                <div className="bg-gradient-to-r from-red-600 to-red-500 px-6 py-4">
                    <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                        <Plus className="h-5 w-5" />
                        Add New Reason
                    </h2>
                </div>
                
                <form onSubmit={handleSubmit} className="p-6">
                    <div className="mb-6">
                        <label className="mb-2 block text-sm font-semibold text-gray-700">Reason Description</label>
                        <input
                            type="text"
                            value={newReason}
                            onChange={(e) => setNewReason(e.target.value)}
                            placeholder="e.g., Order placed by mistake"
                            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none transition-all focus:border-red-500 focus:bg-white focus:ring-4 focus:ring-red-50/50"
                        />
                    </div>

                    <div className="mb-8 flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3 border border-gray-100">
                        <div>
                            <span className="block font-semibold text-gray-800">Status</span>
                            <span className="text-xs text-gray-500">Toggle visibility in the app</span>
                        </div>
                        <ToggleSwitch isOn={formVisibility} onToggle={() => setFormVisibility(!formVisibility)} />
                    </div>

                    <button
                        type="submit"
                        disabled={submitting}
                        className="w-full rounded-xl bg-blue-900 py-4 font-bold text-white shadow-xl shadow-blue-900/10 transition-all hover:bg-blue-800 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                        {submitting ? "Submitting..." : "Submit Reason"}
                    </button>
                </form>
            </div>

            {/* List Section */}
            <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden mb-12">
                <div className="border-b border-gray-200 bg-gray-50 px-6 py-4 flex justify-between items-center">
                    <h2 className="text-lg font-bold text-gray-800">View Reasons</h2>
                    <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold tracking-wider">
                        {reasons.length} Total
                    </span>
                </div>

                <div className="divide-y divide-gray-100">
                    {loading ? (
                        <div className="p-12 text-center text-gray-400 flex flex-col items-center gap-4">
                            <Loader2 className="h-8 w-8 animate-spin text-red-500" />
                            <p>Loading reasons...</p>
                        </div>
                    ) : reasons.length === 0 ? (
                        <div className="p-12 text-center text-gray-400">
                            No reasons found.
                        </div>
                    ) : (
                        reasons.map((item) => (
                            <div key={item._id} className="p-6 hover:bg-gray-50/50 transition-colors">
                                <div className="flex items-center justify-between mb-4">
                                     <div className="flex items-center gap-2">
                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-gray-100 px-2 py-0.5 rounded max-w-[100px] truncate">
                                            ID: {item._id}
                                        </span>
                                        <span className={`h-2 w-2 rounded-full ${item.visibility ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="text-xs text-gray-500 font-medium">Visibility:</span>
                                        <ToggleSwitch isOn={item.visibility} onToggle={() => handleToggleVisibility(item._id, item.visibility)} />
                                    </div>
                                </div>

                                {editingId === item._id ? (
                                    <div className="flex gap-3 items-center">
                                        <input
                                            type="text"
                                            value={editValue}
                                            onChange={(e) => setEditValue(e.target.value)}
                                            className="flex-1 rounded-lg border border-red-200 bg-white px-4 py-2 outline-none focus:ring-2 focus:ring-red-100 shadow-inner"
                                            autoFocus
                                            disabled={updating}
                                        />
                                        <button 
                                            onClick={saveEdit}
                                            disabled={updating}
                                            className="bg-green-600 text-white p-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                                        >
                                            {updating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                                        </button>
                                        <button 
                                            onClick={cancelEdit}
                                            className="bg-gray-200 text-gray-600 p-2 rounded-lg hover:bg-gray-300 transition-colors"
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                    </div>
                                ) : (
                                    <div>
                                        <h3 className={`text-lg font-semibold mb-6 ${item.visibility ? 'text-gray-800' : 'text-gray-400'}`}>
                                            {item.reason}
                                        </h3>
                                        
                                        <div className="flex gap-3">
                                            <button 
                                                onClick={() => startEditing(item)}
                                                className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-blue-900 border border-blue-900 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-blue-800 transition-all active:scale-[0.98]"
                                            >
                                                <Edit2 className="h-4 w-4" />
                                                Edit
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(item._id)}
                                                className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-white border border-red-200 py-2.5 text-sm font-bold text-red-600 shadow-sm hover:bg-red-50 transition-all active:scale-[0.98]"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
