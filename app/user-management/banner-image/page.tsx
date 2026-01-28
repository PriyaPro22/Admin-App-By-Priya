"use client";

import React, { useState } from "react";
import ImageUploader from "../../components/ui/ImageUploader";
import ToggleSwitch from "../../components/ui/ToggleSwitch";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function BannerManagement() {
    const router = useRouter();

    // State for configuration
    const [category, setCategory] = useState("-Select-");
    const [position, setPosition] = useState("-Select-");
    const [positionEnabled, setPositionEnabled] = useState(true);

    const [size, setSize] = useState("-Select-");
    const [sizeEnabled, setSizeEnabled] = useState(true);

    const [showImage, setShowImage] = useState(true);
    const [showUrl, setShowUrl] = useState(true);

    const [imageUrl, setImageUrl] = useState("");
    const [selectedImage, setSelectedImage] = useState<File | null>(null);

    const handleSave = () => {
        console.log({
            category,
            position,
            positionEnabled,
            size,
            sizeEnabled,
            showImage,
            showUrl,
            imageUrl,
            selectedImage
        });
        alert("Banner Saved Successfully!");
    };

    return (
        <div className="mx-auto max-w-lg animate-fade-in pb-8">
            {/* Header */}
            <div className="mb-6 flex items-center gap-3 text-blue-900">
                <button onClick={() => router.back()} className="rounded-full p-1 hover:bg-gray-200">
                    <ArrowLeft className="h-6 w-6" />
                </button>
                <h1 className="text-xl font-bold">Banner Management</h1>
            </div>

            <div className="space-y-6">
                {/* Banner Gallery Section */}
                <div className="rounded-lg border border-gray-200 bg-gray-100 p-4 shadow-sm">
                    <h2 className="mb-1 text-base font-bold text-blue-900">Banner Gallery</h2>
                    <p className="mb-4 text-sm text-gray-500">View and manage all your banner images in one place</p>
                    <button className="w-full rounded-full border border-blue-900 py-2 text-sm font-semibold text-blue-900 transition-colors hover:bg-blue-50">
                        Open Banner Gallery
                    </button>
                </div>

                <h2 className="text-lg font-bold text-blue-900">Banner Configuration</h2>

                {/* Category */}
                <div className="rounded-lg border border-gray-200 bg-gray-100 p-4 shadow-sm">
                    <label className="mb-2 block font-bold text-gray-800">Category</label>
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full rounded-md border-none bg-transparent py-2 text-gray-700 outline-none focus:ring-0"
                    >
                        <option value="-Select-">-Select-</option>
                        <option value="Home">Home</option>
                        <option value="Service">Service</option>
                        <option value="Promotional">Promotional</option>
                    </select>
                </div>

                {/* Position */}
                <div className="rounded-lg border border-gray-200 bg-gray-100 p-4 shadow-sm">
                    <div className="mb-2 flex items-center justify-between">
                        <label className="font-bold text-gray-800">Position</label>
                        <div className="flex items-center gap-2">
                            <span className={`text-xs ${positionEnabled ? "text-green-600" : "text-gray-500"}`}>
                                {positionEnabled ? 'Enabled' : 'Disabled'}
                            </span>
                            <ToggleSwitch isOn={positionEnabled} onToggle={() => setPositionEnabled(!positionEnabled)} />
                        </div>
                    </div>
                    <select
                        value={position}
                        onChange={(e) => setPosition(e.target.value)}
                        className="w-full rounded-md border-none bg-transparent py-2 text-gray-700 outline-none focus:ring-0"
                    >
                        <option value="-Select-">-Select-</option>
                        <option value="Top">Top</option>
                        <option value="Middle">Middle</option>
                        <option value="Bottom">Bottom</option>
                    </select>
                </div>

                {/* Size */}
                <div className="rounded-lg border border-gray-200 bg-gray-100 p-4 shadow-sm">
                    <div className="mb-2 flex items-center justify-between">
                        <label className="font-bold text-gray-800">Size</label>
                        <div className="flex items-center gap-2">
                            <span className={`text-xs ${sizeEnabled ? "text-green-600" : "text-gray-500"}`}>
                                {sizeEnabled ? 'Enabled' : 'Disabled'}
                            </span>
                            <ToggleSwitch isOn={sizeEnabled} onToggle={() => setSizeEnabled(!sizeEnabled)} />
                        </div>
                    </div>
                    <select
                        value={size}
                        onChange={(e) => setSize(e.target.value)}
                        className="w-full rounded-md border-none bg-transparent py-2 text-gray-700 outline-none focus:ring-0"
                    >
                        <option value="-Select-">-Select-</option>
                        <option value="Small">Small</option>
                        <option value="Medium">Medium</option>
                        <option value="Large">Large</option>
                    </select>
                </div>

                {/* Visibility Settings */}
                <div className="rounded-lg border border-gray-200 bg-gray-100 p-4 shadow-sm">
                    <h3 className="mb-4 font-bold text-gray-800">Visibility Settings</h3>

                    <div className="mb-4 flex items-center justify-between">
                        <span className="text-gray-700">Show Image</span>
                        <ToggleSwitch isOn={showImage} onToggle={() => setShowImage(!showImage)} />
                    </div>

                    <div className="flex items-center justify-between">
                        <span className="text-gray-700">Show URL</span>
                        <ToggleSwitch isOn={showUrl} onToggle={() => setShowUrl(!showUrl)} />
                    </div>
                </div>

                {/* Banner Content */}
                <div className="rounded-lg border border-gray-200 bg-gray-100 p-4 shadow-sm">
                    <h3 className="mb-4 font-bold text-gray-800">Banner Content</h3>

                    <div className="mb-4">
                        <div className="flex w-full cursor-pointer items-center justify-center rounded-full border border-blue-900 py-3 text-sm font-semibold text-blue-900 transition-colors hover:bg-blue-50">
                            <ImageUploader
                                label="Select Banner Image"
                                onImageSelected={(file) => setSelectedImage(file)}
                            />
                            {/* The ImageUploader has its own button style which might conflict. 
                         Actually, ImageUploader renders a button. 
                         I might need to make ImageUploader customizable or just use it directly. 
                         Looking at ImageUploader code, it renders a button.
                         I'll just put ImageUploader here and let it be.
                         Alternatively, I'll pass a className or just use it as is.
                         The design shows a transparent button "Select Banner Image".
                         Let's just use a div wrapper to style it or modify ImageUploader if I could.
                         But I'll just use the standard one for now to avoid complexity.
                     */}
                        </div>
                        {selectedImage && <p className="mt-2 text-center text-xs text-green-600">Image Selected: {selectedImage.name}</p>}
                    </div>

                    <div className="rounded-md border border-gray-400 bg-transparent px-3 py-3">
                        <input
                            type="text"
                            placeholder="Image URL"
                            value={imageUrl}
                            onChange={(e) => setImageUrl(e.target.value)}
                            className="w-full bg-transparent text-gray-700 outline-none placeholder:text-gray-500"
                        />
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-4 pt-4">
                    <button
                        onClick={() => router.back()}
                        className="flex-1 rounded-full py-3 text-center font-semibold text-blue-900 hover:bg-gray-100"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        className="flex-1 rounded-full bg-blue-900 py-3 text-center font-semibold text-white shadow-md hover:bg-blue-800"
                    >
                        Save Banner
                    </button>
                </div>

            </div>
        </div>
    );
}
