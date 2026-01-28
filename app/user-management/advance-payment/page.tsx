"use client";

import React, { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import ToggleSwitch from "../../components/ui/ToggleSwitch";

export default function AdvancePaymentManagement() {
    const router = useRouter();

    const [advancePercent, setAdvancePercent] = useState("0");
    const [instantEnabled, setInstantEnabled] = useState(true);
    const [scheduledEnabled, setScheduledEnabled] = useState(true);
    const [platformFee, setPlatformFee] = useState("100.0");

    return (
        <div className="mx-auto max-w-lg animate-fade-in pb-8">
            {/* Header */}
            <div className="mb-4 flex items-center gap-3 text-gray-900">
                <button onClick={() => router.back()} className="rounded-full p-1 hover:bg-gray-200">
                    <ArrowLeft className="h-6 w-6" />
                </button>
                <h1 className="text-sm font-bold sm:text-base">Advance Pay, Platform fee and Services Management</h1>
            </div>
            <hr className="mb-6 border-gray-300" />

            <div className="space-y-6">
                {/* Advance Payment Settings */}
                <div className="rounded-lg border border-gray-200 bg-gray-100 p-6 shadow-sm">
                    <h2 className="text-lg font-bold text-gray-700">Advance Payment Settings</h2>
                    <p className="mb-6 text-sm text-gray-400">Set advance payment percentage of total amount</p>

                    <div className="relative mb-2">
                        <input
                            type="number"
                            value={advancePercent}
                            onChange={(e) => setAdvancePercent(e.target.value)}
                            className="w-full border-b border-gray-400 bg-transparent py-2 text-xl outline-none focus:border-blue-500"
                        />
                        <span className="absolute right-0 top-2 text-gray-600">%</span>
                    </div>

                    <p className="mb-6 text-sm font-medium text-green-600">Current: {advancePercent}%</p>

                    <button className="w-full rounded-full bg-blue-900 py-3 font-semibold text-white shadow-md hover:bg-blue-800">
                        Save Advance Percentage
                    </button>
                </div>

                {/* Service Type Settings */}
                <div className="rounded-lg border border-gray-200 bg-gray-100 p-6 shadow-sm">
                    <h2 className="mb-2 text-lg font-bold text-gray-700">Service Type Settings</h2>
                    <p className="mb-6 text-sm text-gray-400">Enable/disable service types</p>

                    <div className="space-y-6">
                        {/* Instant Services */}
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-700">Instant Services</p>
                                <p className={`text-sm ${instantEnabled ? "text-green-600" : "text-red-500"}`}>
                                    Status: {instantEnabled ? 'Enabled' : 'Disabled'}
                                </p>
                            </div>
                            <ToggleSwitch isOn={instantEnabled} onToggle={() => setInstantEnabled(!instantEnabled)} />
                        </div>

                        {/* Scheduled Services */}
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-700">Scheduled Services</p>
                                <p className={`text-sm ${scheduledEnabled ? "text-green-600" : "text-red-500"}`}>
                                    Status: {scheduledEnabled ? 'Enabled' : 'Disabled'}
                                </p>
                            </div>
                            <ToggleSwitch isOn={scheduledEnabled} onToggle={() => setScheduledEnabled(!scheduledEnabled)} />
                        </div>
                    </div>

                    <button className="mt-8 w-full rounded-full bg-blue-900 py-3 font-semibold text-white shadow-md hover:bg-blue-800">
                        Save Service Settings
                    </button>
                </div>

                {/* Platform Fee Settings */}
                <div className="rounded-lg border border-gray-200 bg-gray-100 p-6 shadow-sm">
                    <h2 className="text-lg font-bold text-gray-700">Platform Fee Settings</h2>
                    <p className="mb-6 text-sm text-gray-400">Set platform fee and GST details</p>

                    <div className="relative mb-6">
                        <input
                            type="number"
                            value={platformFee}
                            onChange={(e) => setPlatformFee(e.target.value)}
                            className="w-full border-b border-gray-400 bg-transparent py-2 text-xl outline-none focus:border-blue-500"
                        />
                    </div>
                    <button className="w-full rounded-full bg-blue-900 py-3 font-semibold text-white shadow-md hover:bg-blue-800">
                        Save Platform Fee
                    </button>
                </div>

            </div>

        </div>
    );
}
