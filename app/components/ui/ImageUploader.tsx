"use client";

import React, { useRef, useState } from "react";
import { Image as ImageIcon, Camera, Upload } from "lucide-react";

interface ImageUploaderProps {
    onImageSelected: (file: File) => void;
    previewUrl?: string | null;
    label?: string;
    id?: string;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
    onImageSelected,
    previewUrl,
    label = "Choose Photo",
    id = "image-upload",
}) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [localPreview, setLocalPreview] = useState<string | null>(previewUrl || null);

    const handleDivClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setLocalPreview(url);
            onImageSelected(file);
        }
    };

    return (
        <div className="flex flex-col gap-2">
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept="image/*"
                id={id}
            />
            <div
                onClick={handleDivClick}
                className="cursor-pointer flex items-center justify-center gap-2"
            >
                {/* Helper Button style trigger */}
                <button
                    type="button"
                    className="pointer-events-none flex items-center gap-2 rounded-lg bg-gray-400 px-4 py-2 font-bold text-white transition-colors hover:bg-gray-500"
                >
                    {label === "Choose Video" ? <Upload size={20} /> : <Camera size={20} />}
                    {label}
                </button>
            </div>

            {/* Preview Area (Optional - shows nicely below or beside) */}
            {localPreview && label !== "Choose Video" && (
                <div className="mt-2 h-20 w-20 relative overflow-hidden rounded-xl border border-gray-300 shadow-sm">
                    <img
                        src={localPreview}
                        alt="Preview"
                        className="h-full w-full object-cover"
                    />
                </div>
            )}
        </div>
    );
};

// Also exporting a specialized larger box version if needed for the square UI element
export const ImageBoxUploader = ({ onImageSelected, previewUrl }: { onImageSelected: (file: File) => void, previewUrl?: string | null }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [localPreview, setLocalPreview] = useState<string | null>(previewUrl || null);

    const handleDivClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setLocalPreview(url);
            onImageSelected(file);
        }
    };

    return (
        <>
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept="image/*"
            />
            <div
                onClick={handleDivClick}
                className="flex h-20 w-20 cursor-pointer items-center justify-center rounded-xl bg-white shadow-sm border border-gray-300 overflow-hidden hover:border-blue-500 transition-colors"
                title="Click to upload image"
            >
                {localPreview ? (
                    <img src={localPreview} alt="Preview" className="h-full w-full object-cover" />
                ) : (
                    <ImageIcon className="h-10 w-10 text-green-500" />
                )}
            </div>
        </>
    )
}

export default ImageUploader;
