"use client";

import React, { useState } from "react";
import { XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import ToggleSwitch from "../../components/ui/ToggleSwitch";

export default function CancellationFormManagement() {
    const router = useRouter();

    // Form State
    const [formVisibility, setFormVisibility] = useState(false);
    const [description, setDescription] = useState("");
    const [webViewUrl, setWebViewUrl] = useState("");

    // Data State
    const [cancellationData, setCancellationData] = useState([
        {
            id: 1,
            title: "Cancellation form 11",
            url: "https://youtu.be/CZHHhmcw5zE?si=-nRPDY9D_HiAnYo4",
            visibility: true,
        },
        {
            id: 2,
            title: "26novembrr 2035",
            url: "https://uvh.com",
            visibility: true,
        },
    ]);

    const handleSubmit = () => {
        // Logic to add new cancellation form data
        if (!description) return alert("Please enter a description");

        // Simulating adding data
        const newItem = {
            id: Date.now(),
            title: description.substring(0, 20) + (description.length > 20 ? "..." : ""),
            url: webViewUrl || "No URL",
            visibility: formVisibility
        };

        setCancellationData([newItem, ...cancellationData]);
        setDescription("");
        setWebViewUrl("");
        alert("Cancellation Data Added!");
    };

    const handleToggleItemVisibility = (id: number) => {
        setCancellationData(cancellationData.map(item =>
            item.id === id ? { ...item, visibility: !item.visibility } : item
        ));
    };

    const handleDelete = (id: number) => {
        setCancellationData(cancellationData.filter(item => item.id !== id));
    };

    return (
        <div className="mx-auto max-w-lg animate-fade-in pb-12">
            {/* Header Banner */}
            <div className="mb-6 flex items-center gap-3 rounded-md bg-red-100 px-4 py-3 text-red-700">
                <button onClick={() => router.back()}>
                    <XCircle className="h-6 w-6 text-red-600" />
                </button>
                <h1 className="text-lg font-bold">Cancellation Form</h1>
            </div>

            {/* Input Form Card */}
            <div className="mb-8 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">

                {/* Visibility Toggle */}
                <div className="mb-6 rounded-md bg-gray-50 p-3 border border-gray-100 flex items-center justify-between">
                    <span className="font-bold text-gray-800">Form Visibility</span>
                    <ToggleSwitch isOn={formVisibility} onToggle={() => setFormVisibility(!formVisibility)} />
                </div>

                {/* Description Field */}
                <div className="mb-6 rounded-md bg-gray-50 p-3 border border-gray-100">
                    <label className="mb-2 block font-bold text-gray-600">Description</label>
                    <div className="rounded-md border border-gray-300 bg-white p-2">
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Enter description details..."
                            className="h-24 w-full resize-none border-none outline-none placeholder:text-gray-400"
                        ></textarea>
                    </div>
                    <p className="mt-2 text-xs text-gray-400">Enter the distribution information for this cancellation</p>
                </div>

                {/* WebView URL Field */}
                <div className="mb-6 rounded-md bg-gray-50 p-3 border border-gray-100">
                    <label className="mb-2 block font-bold text-gray-600">WebView URL</label>
                    <div className="rounded-md border border-gray-300 bg-white p-2">
                        <input
                            type="text"
                            value={webViewUrl}
                            onChange={(e) => setWebViewUrl(e.target.value)}
                            placeholder="https://example.com"
                            className="w-full border-none outline-none placeholder:text-gray-400"
                        />
                    </div>
                    <p className="mt-2 text-xs text-gray-400">Enter the URL to display in WebView</p>
                </div>

                <button
                    onClick={handleSubmit}
                    className="w-full rounded-lg bg-blue-900 py-3 font-bold text-white shadow-md hover:bg-blue-800"
                >
                    Submit Cancellation
                </button>

            </div>

            {/* List Header */}
            <div className="mb-4 bg-gray-200 py-3 text-center text-red-600 rounded-t-lg font-bold">
                View Cancellation Data
            </div>

            {/* Data List */}
            <div className="space-y-4 bg-gray-200 p-4 rounded-b-lg -mt-4 min-h-[200px]">
                {cancellationData.map((item) => (
                    <div key={item.id} className="rounded-lg bg-indigo-50/50 p-4 shadow-sm border border-indigo-100">
                        <div className="mb-2 flex items-center justify-between">
                            <span className="font-bold text-gray-600">Visibility:</span>
                            <ToggleSwitch isOn={item.visibility} onToggle={() => handleToggleItemVisibility(item.id)} />
                        </div>

                        <div className="mb-2">
                            <h3 className="text-lg text-gray-800 font-medium">{item.title}</h3>
                        </div>

                        <div className="mb-4">
                            <span className="text-sm font-bold text-blue-500 mr-1">URL:</span>
                            <a href={item.url} className="text-sm text-blue-500 underline break-all">{item.url}</a>
                        </div>

                        <div className="flex gap-2">
                            <button className="flex-1 rounded-md bg-blue-900 py-2 text-sm font-bold text-white shadow hover:bg-blue-800">
                                Edit
                            </button>
                            <button
                                onClick={() => handleDelete(item.id)}
                                className="flex-1 rounded-md bg-blue-900 py-2 text-sm font-bold text-white shadow hover:bg-blue-800"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>

        </div>
    );
}
