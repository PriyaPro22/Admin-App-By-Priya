<div className="relative bg-white/10 dark:bg-slate-900/20 backdrop-blur-[80px] rounded-[3rem] p-10 pb-12 border border-white/60 dark:border-white/10 shadow-[0_32px_128px_-16px_rgba(0,0,0,0.1)] overflow-hidden"></div>"use client";

import React, { useState } from "react";
import { ArrowLeft, Save } from "lucide-react";
import { useRouter } from "next/navigation";

interface KeywordData {
    category: string;
    keywords: string[];
}

export default function SearchKeywordsManagement() {
    const router = useRouter();

    // Mock data
    const [data, setData] = useState<KeywordData[]>([
        { category: "Service", keywords: ["Ac", "category", "air conditioner"] },
        { category: "Resale", keywords: ["Iphone"] },
        { category: "Ecommerce", keywords: ["Ipad", "MacBook Pro M1"] },
    ]);

    const [selectedCategory, setSelectedCategory] = useState("");
    const [newKeyword, setNewKeyword] = useState("");

    const handleSave = () => {
        if (!selectedCategory || !newKeyword) return;

        setData(prev => {
            const existingCatIndex = prev.findIndex(item => item.category === selectedCategory);
            if (existingCatIndex >= 0) {
                const updated = [...prev];
                if (!updated[existingCatIndex].keywords.includes(newKeyword)) {
                    updated[existingCatIndex].keywords.push(newKeyword);
                }
                return updated;
            } else {
                return [...prev, { category: selectedCategory, keywords: [newKeyword] }];
            }
        });
        setNewKeyword("");
        alert("Keyword Saved!");
    };

    return (
        <div className="mx-auto max-w-lg animate-fade-in pb-8">
            {/* Header */}
            <div className="mb-6 flex items-center gap-3 text-gray-900">
                <button onClick={() => router.back()} className="rounded-full p-1 hover:bg-gray-200">
                    <ArrowLeft className="h-6 w-6" />
                </button>
                <h1 className="text-xl font-bold">Search Keywords Management</h1>
            </div>

            <hr className="mb-6 border-gray-300" />

            {/* Form Card */}
            <div className="mb-8 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
                <h2 className="mb-4 text-center text-lg font-bold text-gray-700">Fill Search key words</h2>
                <hr className="mb-6 border-gray-300" />

                <div className="space-y-4">
                    <div className="rounded-md border border-blue-800 bg-white px-3 py-2">
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="w-full bg-transparent font-medium text-gray-700 outline-none"
                        >
                            <option value="" disabled>Select Category</option>
                            <option value="Service">Service</option>
                            <option value="Resale">Resale</option>
                            <option value="Ecommerce">Ecommerce</option>
                        </select>
                    </div>

                    <div className="rounded-md border border-blue-800 bg-white px-3 py-2">
                        <input
                            type="text"
                            placeholder="Enter Search Keyword"
                            value={newKeyword}
                            onChange={(e) => setNewKeyword(e.target.value)}
                            className="w-full bg-transparent text-gray-700 outline-none placeholder:text-gray-400"
                        />
                    </div>

                    <div className="flex justify-end">
                        <button
                            onClick={handleSave}
                            className="flex items-center gap-2 rounded-md bg-blue-900 px-6 py-2 font-bold text-white shadow-md hover:bg-blue-800"
                        >
                            <Save size={18} />
                            Save
                        </button>
                    </div>
                </div>
            </div>

            {/* Categories Display */}
            <div className="grid grid-cols-3 gap-2 text-center text-sm font-bold text-gray-800">
                <div className="bg-gray-200 py-2">Service</div>
                <div className="bg-gray-200 py-2">Resale</div>
                <div className="bg-gray-200 py-2">Ecommerce</div>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-4">
                {/* Service Keywords */}
                <div className="space-y-2">
                    {data.find(d => d.category === "Service")?.keywords.map((k, i) => (
                        <div key={i} className="rounded-lg bg-gray-200 px-3 py-2 text-sm text-gray-700 shadow-sm">
                            {k}
                        </div>
                    ))}
                </div>

                {/* Resale Keywords */}
                <div className="space-y-2">
                    {data.find(d => d.category === "Resale")?.keywords.map((k, i) => (
                        <div key={i} className="rounded-lg bg-gray-200 px-3 py-2 text-sm text-gray-700 shadow-sm">
                            {k}
                        </div>
                    ))}
                </div>

                {/* Ecommerce Keywords */}
                <div className="space-y-2">
                    {data.find(d => d.category === "Ecommerce")?.keywords.map((k, i) => (
                        <div key={i} className="rounded-lg bg-gray-200 px-3 py-2 text-sm text-gray-700 shadow-sm">
                            {k}
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
}
