"use client";

import React from "react";

interface ToggleSwitchProps {
    isOn: boolean;
    onToggle: () => void;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ isOn, onToggle }) => {
    return (
        <button
            onClick={onToggle}
            className={`flex h-6 w-11 items-center rounded-full transition-colors ${isOn ? "bg-[#FCD3BC]" : "bg-gray-300"
                }`}
            type="button"
        >
            <div
                className={`h-4 w-4 rounded-full bg-white shadow-md transition-transform ${isOn ? "translate-x-6 bg-[#E88F46]" : "translate-x-1"
                    }`}
            />
        </button>
    );
};

export default ToggleSwitch;
