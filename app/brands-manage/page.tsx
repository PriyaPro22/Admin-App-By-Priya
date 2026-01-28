"use client";

import React, { useState, useEffect } from "react";
import { Save, Trash2, Edit } from "lucide-react";
import { api } from "../utils/api";

interface Brand {
    _id: string; // MongoDB ID usually
    name: string;
}

export default function BrandsManage() {
    const [brands, setBrands] = useState<Brand[]>([]);
    const [newBrand, setNewBrand] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchBrands();
    }, []);

    const fetchBrands = async () => {
        try {
            setLoading(true);
            const response = await api.get("/brand"); // Assuming endpoint
            const data = response.data?.data || response.data || [];
            // Ensure data is an array
            if (Array.isArray(data)) {
                setBrands(data);
            } else {
                console.error("Unexpected brands data format:", data);
                setBrands([]);
            }
        } catch (error) {
            console.error("Failed to fetch brands", error);
            // Optional: alert("Failed to fetch brands");
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!newBrand.trim()) return;

        try {
            setLoading(true);
            const payload = {
                name: newBrand
            };
            await api.post("/brand", payload);
            setNewBrand("");
            await fetchBrands(); // Refresh list
            alert("Brand added successfully!");
        } catch (error) {
            console.error("Failed to add brand", error);
            alert("Failed to add brand. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this brand?")) return;

        try {
            setLoading(true);
            await api.delete(`/brand/${id}`);
            await fetchBrands(); // Refresh list
        } catch (error) {
            console.error("Failed to delete brand", error);
            alert("Failed to delete brand.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mx-auto max-w-lg animate-fade-in pb-12">
            <div className="mb-4 text-center">
                <h1 className="text-xl font-bold text-gray-900">Manage Brands</h1>
            </div>

            {/* Add Brand Card */}
            <div className="mb-6 rounded-lg bg-gray-200 p-6 shadow-sm">
                <div className="mb-4">
                    <input
                        type="text"
                        value={newBrand}
                        onChange={(e) => setNewBrand(e.target.value)}
                        placeholder="Enter Brands Name...."
                        disabled={loading}
                        className="w-full rounded-md border border-blue-900 px-4 py-3 outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50"
                    />
                </div>
                <div className="flex justify-end">
                    <button
                        onClick={handleSave}
                        disabled={loading || !newBrand.trim()}
                        className="flex items-center gap-2 rounded-md bg-blue-900 px-6 py-2 font-bold text-white shadow hover:bg-blue-800 disabled:bg-gray-400"
                    >
                        <Save size={18} />
                        {loading ? "Saving..." : "Save"}
                    </button>
                </div>
            </div>

            {/* Brands List */}
            <div className="space-y-3">
                {loading && brands.length === 0 ? (
                    <p className="text-center text-gray-500">Loading brands...</p>
                ) : brands.length === 0 ? (
                    <p className="text-center text-gray-500">No brands found.</p>
                ) : (
                    brands.map((brand, index) => (
                        <div key={brand._id || index} className="flex items-center justify-between rounded-md bg-gray-200 px-4 py-3 shadow-sm">
                            <div className="flex items-center gap-4">
                                <span className="font-bold text-gray-900">{index + 1}.</span>
                                <span className="font-bold text-gray-900">{brand.name}</span>
                            </div>
                            <div className="flex gap-4">
                                {/* <button className="font-bold text-lime-500 hover:text-lime-600">Edit</button> */}
                                <button
                                    onClick={() => handleDelete(brand._id)}
                                    className="font-bold text-red-600 hover:text-red-700"
                                    title="Delete Brand"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

        </div>
    );
}
