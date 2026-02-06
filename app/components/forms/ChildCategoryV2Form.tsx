"use client";

import React, { useState, useEffect } from "react";
import { Save, Trash2, Plus, X } from "lucide-react";
import { useCategory, ChildCategoryV2 } from "../../context/CategoryContext";
import ToggleSwitch from "../ui/ToggleSwitch";
import axios from "axios";

const ChildCategoryV2Form = ({ onSuccess }: { onSuccess?: () => void }) => {

    const {
        mainCategories,
        fetchChildCategoryMedia,
        deleteChildCategoryV2,
        childCategories,
        addChildCategory,
        fetchChildCategories,
        addChildCategoryMedia
    } = useCategory();

    // Selection State
    const [selectedMainId, setSelectedMainId] = useState("");

    const [isLoaded, setIsLoaded] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Form State
    const [formData, setFormData] = useState<ChildCategoryV2>({
        key: "",
        name: "",
        visibility: true,
        images: { name: "images", visibility: true, items: {} },
        videos: { name: "videos", visibility: true, items: {} },
        links: { name: "links", visibility: true, items: {} },
    });

    const [imagesList, setImagesList] = useState<any[]>([]);
    const [videosList, setVideosList] = useState<any[]>([]);

    const objectToList = (section: any) => {
        if (!section) return [];
        const { name, visibility, ...rest } = section;
        return Object.values(rest).map((item: any, idx) => ({
            ...item,
            _tempId: Date.now() + idx
        }));
    };

    const handleLoad = async () => {
        if (!selectedMainId) {
            alert("Please select Main Category");
            return;
        }

        setIsLoading(true);
        const data = await fetchChildCategoryMedia(selectedMainId);
        setIsLoading(false);

        if (data) {
            setImagesList(objectToList(data.images));
            setVideosList(objectToList(data.videos));
        } else {
            setImagesList([]);
            setVideosList([]);
        }

        setIsLoaded(true);
    };

    const handleSave = async () => {
        console.log("🔥 SAVING DATA FOR ID:", selectedMainId);
        console.log("🚀 SENDING POST REQUESTS...");

        try {
            // 1️⃣ SAVE IMAGES
            for (const img of imagesList) {
                if (!img.url && !img.file) continue;

                console.log("📤 POSTing Image:", img.imageTitle);
                await addChildCategoryMedia(
                    selectedMainId,
                    "images",
                    {
                        imageTitle: img.imageTitle || "",
                        url: img.url,
                        file: img.file,
                        visibility: img.visibility ?? true,
                    }
                );
            }

            // 2️⃣ SAVE VIDEOS
            for (const vid of videosList) {
                if (!vid.url && !vid.file) continue;

                console.log("📤 POSTing Video:", vid.videoTitle);
                await addChildCategoryMedia(
                    selectedMainId,
                    "videos",
                    {
                        videoTitle: vid.videoTitle || "",
                        url: vid.url,
                        file: vid.file,
                        visibility: vid.visibility ?? true,
                    }
                );
            }

            // 3️⃣ AUTO CREATE V1 CHILD CATEGORY IF NEEDED
            if (formData.name) {
                const exists = (childCategories || []).some(
                    c =>
                        c.name.toLowerCase() === formData.name.toLowerCase() &&
                        c.mainCategoryId === selectedMainId
                );

                if (!exists) {
                    await addChildCategory({
                        name: formData.name,
                        mainCategoryId: selectedMainId,
                        visible: true,
                    });
                    await fetchChildCategories(selectedMainId, null);
                }
            }

            alert("✅ Saved successfully with POST method!");
            onSuccess?.();
        } catch (err) {
            console.error("❌ Save failed", err);
            alert("❌ Failed to save. Check console.");
        }
    };

    const handleDelete = async () => {
        if (!selectedMainId) return;
        if (!confirm("Are you sure you want to delete ALL media for this category?")) return;

        try {
            await deleteChildCategoryV2(selectedMainId);
            alert("Deleted successfully");
            handleLoad();
        } catch (err) {
            alert("Delete failed");
        }
    };

    // Helper to update items in list
    const UpdateItem = (list: any[], setList: any, idx: number, key: string, value: any) => {
        const newList = [...list];
        newList[idx] = { ...newList[idx], [key]: value };
        setList(newList);
    };

    const AddItem = (list: any[], setList: any, emptyObj: any) => {
        setList([...list, { ...emptyObj, _tempId: Date.now(), visibility: true }]);
    };

    const RemoveItem = (list: any[], setList: any, idx: number) => {
        const newList = [...list];
        newList.splice(idx, 1);
        setList(newList);
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-lg border border-orange-100 max-w-4xl mx-auto">
            <h2 className="text-xl font-bold text-orange-900 mb-6">Manage Child Category Media</h2>

            {/* SELECTION */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 p-4 bg-orange-50 rounded-lg">
                <div className="flex flex-col gap-1">
                    <label className="text-sm font-bold text-gray-600">Main Category</label>
                    <select
                        className="border p-2 rounded-lg bg-white shadow-sm focus:ring-2 focus:ring-blue-500"
                        value={selectedMainId}
                        onChange={(e) => {
                            setSelectedMainId(e.target.value);
                            setIsLoaded(false);
                            setImagesList([]);
                            setVideosList([]);
                        }}
                    >
                        <option value="">Select Main Category</option>
                        {mainCategories.map((cat: any) => (
                            <option key={cat._id} value={cat.name}>
                                {cat.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="flex flex-col gap-1">
                    <label className="text-sm font-bold text-gray-600">Load Data</label>
                    <button
                        onClick={handleLoad}
                        disabled={!selectedMainId || isLoading}
                        className="bg-blue-600 text-white p-2 rounded-lg font-bold hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
                    >
                        {isLoading ? "Loading..." : "Load Media"}
                    </button>
                </div>
            </div>

            {isLoaded && (
                <div className="space-y-8 animate-in fade-in duration-500">

                    {/* IMAGES SECTION */}
                    <div className="border rounded-lg p-4 bg-gray-50">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold text-gray-800 flex items-center gap-2">🖼️ Images</h3>
                        </div>

                        <div className="space-y-3">
                            {imagesList.map((img, idx) => (
                                <div key={img._tempId} className="flex gap-2 items-start bg-white p-2 rounded border shadow-sm">
                                    <div className="flex-1 grid grid-cols-2 gap-2">
                                        <input
                                            placeholder="Image Title"
                                            className="border p-2 rounded text-sm"
                                            value={img.imageTitle || ""}
                                            onChange={(e) => UpdateItem(imagesList, setImagesList, idx, "imageTitle", e.target.value)}
                                        />
                                        <div className="flex flex-col gap-2">
                                            <input
                                                placeholder="Image URL"
                                                className="border p-2 rounded text-sm"
                                                value={img.url || ""}
                                                onChange={(e) => UpdateItem(imagesList, setImagesList, idx, "url", e.target.value)}
                                            />
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs text-gray-500">OR</span>
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    className="text-xs"
                                                    onChange={(e) => {
                                                        const file = e.target.files?.[0];
                                                        if (file) {
                                                            UpdateItem(imagesList, setImagesList, idx, "file", file);
                                                            UpdateItem(imagesList, setImagesList, idx, "url", "");
                                                        }
                                                    }}
                                                />
                                            </div>
                                            {img.file && <span className="text-xs text-green-600">📎 {img.file.name}</span>}
                                        </div>
                                    </div>
                                    <div className="pt-2">
                                        <ToggleSwitch
                                            isOn={img.visibility ?? true}
                                            onToggle={() => UpdateItem(imagesList, setImagesList, idx, "visibility", !(img.visibility ?? true))}
                                        />
                                    </div>
                                    <button onClick={() => RemoveItem(imagesList, setImagesList, idx)} className="text-red-500 p-2"><Trash2 size={16} /></button>
                                </div>
                            ))}
                            <button
                                onClick={() => AddItem(imagesList, setImagesList, { imageTitle: "", url: "" })}
                                className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 font-bold hover:bg-gray-100 flex items-center justify-center gap-2"
                            >
                                <Plus size={16} /> Add Image
                            </button>
                        </div>
                    </div>

                    {/* VIDEOS SECTION */}
                    <div className="border rounded-lg p-4 bg-gray-50">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold text-gray-800 flex items-center gap-2">🎥 Videos</h3>
                        </div>

                        <div className="space-y-3">
                            {videosList.map((vid, idx) => (
                                <div key={vid._tempId} className="flex gap-2 items-start bg-white p-2 rounded border shadow-sm">
                                    <div className="flex-1 grid grid-cols-2 gap-2">
                                        <input
                                            placeholder="Video Title"
                                            className="border p-2 rounded text-sm"
                                            value={vid.videoTitle || ""}
                                            onChange={(e) => UpdateItem(videosList, setVideosList, idx, "videoTitle", e.target.value)}
                                        />
                                        <div className="flex flex-col gap-2">
                                            <input
                                                placeholder="Video URL (YouTube, etc.)"
                                                className="border p-2 rounded text-sm"
                                                value={vid.url || ""}
                                                onChange={(e) => UpdateItem(videosList, setVideosList, idx, "url", e.target.value)}
                                            />
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs text-gray-500">OR</span>
                                                <input
                                                    type="file"
                                                    accept="video/*"
                                                    className="text-xs"
                                                    onChange={(e) => {
                                                        const file = e.target.files?.[0];
                                                        if (file) {
                                                            UpdateItem(videosList, setVideosList, idx, "file", file);
                                                            UpdateItem(videosList, setVideosList, idx, "url", "");
                                                        }
                                                    }}
                                                />
                                            </div>
                                            {vid.file && <span className="text-xs text-green-600">📎 {vid.file.name}</span>}
                                        </div>
                                    </div>
                                    <div className="pt-2">
                                        <ToggleSwitch
                                            isOn={vid.visibility ?? true}
                                            onToggle={() => UpdateItem(videosList, setVideosList, idx, "visibility", !(vid.visibility ?? true))}
                                        />
                                    </div>
                                    <button onClick={() => RemoveItem(videosList, setVideosList, idx)} className="text-red-500 p-2"><Trash2 size={16} /></button>
                                </div>
                            ))}
                            <button
                                onClick={() => AddItem(videosList, setVideosList, { videoTitle: "", url: "" })}
                                className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 font-bold hover:bg-gray-100 flex items-center justify-center gap-2"
                            >
                                <Plus size={16} /> Add Video
                            </button>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-6 border-t">
                        <button
                            onClick={handleDelete}
                            className="bg-red-50 text-red-600 px-4 py-2 rounded-lg font-bold hover:bg-red-100"
                        >
                            Delete All
                        </button>
                        <button
                            onClick={handleSave}
                            className="bg-green-600 text-white px-8 py-2 rounded-lg font-bold hover:bg-green-700 shadow-md flex items-center gap-2"
                        >
                            <Save size={18} /> Save Media (POST)
                        </button>
                    </div>

                </div>
            )}
        </div>
    );
};

export default ChildCategoryV2Form;
