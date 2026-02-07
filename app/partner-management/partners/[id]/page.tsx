"use client";

import React, { useState } from "react";
import {
    ArrowLeft,
    Star,
    Check,
    X,
    CheckCircle2,
    XCircle,
    User,
    Mail,
    Phone,
    Calendar,
    MapPin,
    Clock,
    ShieldCheck
} from "lucide-react";
import { useTheme } from "../../../context/ThemeContext";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function PartnerDetailsPage({ params }: { params: { id: string } }) {
    const { theme } = useTheme();
    const isDark = theme === "dark";
    const router = useRouter();
    const [showApproveModal, setShowApproveModal] = useState(false);
    const [showRejectModal, setShowRejectModal] = useState(false);

    const [currentStep, setCurrentStep] = useState(6);

    const stepLabels = [
        "REGISTRATION", "JOB CATEGORY", "JOB SERVICES", "JOB LOCATION",
        "PAYMENT", "DOCUMENT VERIFICATION", "VEHICLE VERIFIED",
        "BANK", "EDUCATION", "ADDRESS", "KYC SUCCESS"
    ];

    const verificationSteps = stepLabels.map((label, i) => {
        const stepNum = i + 1;
        let status: "completed" | "active" | "pending" | "failed" = "pending";

        if (stepNum < currentStep) {
            // Keeping the 'failed' example for step 7 if it was already passed
            status = (label === "VEHICLE VERIFIED") ? "failed" : "completed";
        } else if (stepNum === currentStep) {
            status = "active";
        }

        return { label, status, step: stepNum };
    });

    const handleStepClick = (stepNum: number) => {
        setCurrentStep(stepNum);
    };

    const stats = [
        { label: "AVERAGE RATING", value: "4.8", icon: Star, color: "text-amber-400" },
        { label: "EXPERIENCE", value: "6+ Years", icon: null },
        { label: "COMPLETED SERVICES", value: "124", icon: null, active: true },
        { label: "PENDING SERVICES", value: "03", icon: null },
        { label: "ONGOING SERVICES", value: "01", icon: null },
        { label: "LANGUAGES", value: "Hindi, English...", icon: null },
    ];

    return (
        <div className={`min-h-screen transition-colors duration-300 ${isDark ? 'bg-[#0B1437]' : 'bg-[#F4F7FE]'} pb-12`}>
            {/* --- TOP HEADER BAR --- */}
            <div className={`${isDark ? 'bg-[#111C44] border-gray-800' : 'bg-white border-b border-gray-100'} px-8 py-4 flex justify-between items-center sticky top-0 z-40`}>
                <div className="flex items-center gap-6">
                    <button
                        onClick={() => router.back()}
                        className={`p-2.5 rounded-xl transition-all ${isDark ? 'bg-[#1B254B] text-white hover:bg-[#232D65]' : 'bg-[#F4F7FE] text-[#2B3674] hover:bg-gray-100'}`}
                    >
                        <ArrowLeft size={20} strokeWidth={2.5} />
                    </button>

                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className={`text-xl font-black ${isDark ? 'text-white' : 'text-[#2B3674]'}`}>Mr. Programmer</h1>
                            <span className="px-3 py-1 bg-[#EEFBF3] text-[#42BE65] text-[10px] font-black rounded-lg uppercase tracking-wider">Verified: True</span>
                        </div>
                        <p className="text-[12px] font-bold text-[#A3AED0] flex items-center gap-2 mt-0.5">
                            Partner ID: <span className={isDark ? 'text-gray-300' : 'text-[#707EAE]'}>BWAPARLKW566960001</span>
                            <span className="h-1 w-1 rounded-full bg-[#A3AED0]"></span>
                            <span className="text-[#0070f3]">Technician Tier 1</span>
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => alert("Edit Profile Clicked")}
                        className={`px-5 py-2.5 text-[13px] font-bold rounded-xl transition-all hover:bg-gray-50/5 ${isDark ? 'text-white' : 'text-[#2B3674]'}`}
                    >
                        Edit Profile
                    </button>
                    <button
                        onClick={() => alert("Block Partner Clicked")}
                        className="px-5 py-2.5 text-[13px] font-bold border-2 border-red-500 text-red-500 rounded-xl hover:bg-red-50 transition-all"
                    >
                        Block Partner
                    </button>
                    <button
                        onClick={() => setShowRejectModal(true)}
                        className={`px-5 py-2.5 text-[13px] font-bold border-2 ${isDark ? 'border-gray-700 text-gray-400' : 'border-gray-200 text-[#707EAE]'} rounded-xl hover:bg-gray-50 transition-all`}
                    >
                        Reject
                    </button>
                    <button
                        onClick={() => setShowApproveModal(true)}
                        className="px-6 py-2.5 text-[13px] font-bold bg-[#0070f3] text-white rounded-xl shadow-lg shadow-blue-500/20 hover:bg-blue-600 transition-all"
                    >
                        Approve Partner
                    </button>
                </div>
            </div>

            <div className="p-8 max-w-[1600px] mx-auto space-y-8">

                {/* --- MAIN INFO CARD --- */}
                <div className={`${isDark ? 'bg-[#111C44] border-gray-800' : 'bg-white border-transparent'} rounded-[32px] p-8 shadow-sm border space-y-10`}>
                    <div className="flex gap-10">
                        {/* Avatar */}
                        <div className="relative">
                            <div className={`h-40 w-40 rounded-[24px] ${isDark ? 'bg-[#1B254B]' : 'bg-[#51908C]'} flex items-center justify-center p-6 text-center shadow-inner`}>
                                <span className="text-white text-[10px] font-black uppercase tracking-[0.2em] leading-tight">Partner<br />Profile</span>
                            </div>
                            <div className="absolute -bottom-2 -right-2 h-8 w-8 bg-[#42BE65] rounded-full border-4 border-white dark:border-[#111C44] flex items-center justify-center text-white shadow-lg">
                                <Check size={16} strokeWidth={4} />
                            </div>
                        </div>

                        {/* Detailed Fields */}
                        <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-y-10 gap-x-6">
                            <div>
                                <label className="block text-[11px] font-black text-[#A3AED0] uppercase tracking-widest mb-1.5">EMAIL ADDRESS</label>
                                <p className={`text-[15px] font-bold ${isDark ? 'text-white' : 'text-[#2B3674]'}`}>omaurya367@gmail.com</p>
                            </div>
                            <div>
                                <label className="block text-[11px] font-black text-[#A3AED0] uppercase tracking-widest mb-1.5">PHONE NUMBER</label>
                                <p className={`text-[15px] font-bold ${isDark ? 'text-white' : 'text-[#2B3674]'}`}>9369456696</p>
                            </div>
                            <div>
                                <label className="block text-[11px] font-black text-[#A3AED0] uppercase tracking-widest mb-1.5">DATE OF BIRTH</label>
                                <p className={`text-[15px] font-bold ${isDark ? 'text-white' : 'text-[#2B3674]'}`}>16-01-1900</p>
                            </div>
                            <div>
                                <label className="block text-[11px] font-black text-[#A3AED0] uppercase tracking-widest mb-1.5">REG. DATE & TIME</label>
                                <p className={`text-[13px] font-bold ${isDark ? 'text-white' : 'text-[#2B3674]'}`}>07/02/2026 11:50:17 AM</p>
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-[11px] font-black text-[#A3AED0] uppercase tracking-widest mb-1.5">CURRENT ADDRESS</label>
                                <p className={`text-[14px] font-bold ${isDark ? 'text-white' : 'text-[#2B3674]'} leading-relaxed`}>
                                    JAIPURIA INNOVATION AND INCUBATION CENTRE, Lucknow, Uttar Pradesh
                                </p>
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-[11px] font-black text-[#A3AED0] uppercase tracking-widest mb-1.5">JOB LOCATION</label>
                                <p className={`text-[14px] font-bold ${isDark ? 'text-white' : 'text-[#2B3674]'} leading-relaxed`}>
                                    Lucknow Metro Region (Central & East)
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Quick Stats Row */}
                    <div className="grid grid-cols-2 md:grid-cols-6 gap-5">
                        {stats.map((stat, i) => (
                            <div
                                key={i}
                                className={`${stat.active ? 'bg-[#EBF3FF] border-[#0070f3]' : (isDark ? 'bg-[#1B254B] border-transparent' : 'bg-[#F8FAFC] border-transparent')} p-5 rounded-2xl border transition-all flex flex-col justify-center`}
                            >
                                <p className={`text-[9px] font-black ${isDark ? 'text-[#8F9BBA]' : 'text-[#A3AED0]'} uppercase tracking-wider mb-2`}>{stat.label}</p>
                                <div className="flex items-center gap-2">
                                    {stat.icon && <stat.icon className={`h-4 w-4 ${stat.color || 'text-[#0070f3]'}`} fill="currentColor" />}
                                    <h4 className={`text-xl font-black ${isDark ? 'text-white' : 'text-[#2B3674]'}`}>{stat.value}</h4>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* --- VERIFICATION PROGRESS --- */}
                <div className={`${isDark ? 'bg-[#111C44] border-gray-800' : 'bg-white border-transparent'} rounded-[32px] p-10 shadow-sm border`}>
                    <h3 className={`text-[15px] font-black ${isDark ? 'text-white' : 'text-[#2B3674]'} uppercase tracking-widest mb-12`}>Verification Progress</h3>

                    <div className="relative pb-16">
                        {/* Progress Line */}
                        <div className={`absolute top-5 left-8 right-8 h-1 ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}></div>

                        <div className="relative flex justify-between">
                            {verificationSteps.map((step, i) => (
                                <div
                                    key={i}
                                    className="flex flex-col items-center group relative w-full cursor-pointer transition-transform active:scale-95"
                                    onClick={() => handleStepClick(i + 1)}
                                >
                                    {/* Circle Container */}
                                    <div className="relative z-10 flex flex-col items-center">
                                        {step.status === "completed" ? (
                                            <div className="h-10 w-10 rounded-full bg-[#42BE65] flex items-center justify-center text-white shadow-lg shadow-[#42BE65]/20 ring-4 ring-white dark:ring-[#111C44]">
                                                <Check size={20} strokeWidth={4} />
                                            </div>
                                        ) : step.status === "failed" ? (
                                            <div className="h-10 w-10 rounded-full bg-[#E31A1A] flex items-center justify-center text-white shadow-lg shadow-[#E31A1A]/20 ring-4 ring-white dark:ring-[#111C44]">
                                                <X size={20} strokeWidth={4} />
                                            </div>
                                        ) : step.status === "active" ? (
                                            <div className="h-10 w-10 rounded-full bg-[#0070f3] flex items-center justify-center text-white shadow-lg border-4 border-white dark:border-[#111C44] ring-2 ring-[#0070f3] font-black">
                                                {step.step}
                                            </div>
                                        ) : (
                                            <div className={`h-10 w-10 rounded-full ${isDark ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-[#A3AED0]'} flex items-center justify-center text-sm font-black`}>
                                                {step.step}
                                            </div>
                                        )}

                                        {/* Label */}
                                        <div className="absolute top-14 w-32 text-center pointer-events-none">
                                            <p className={`text-[9px] font-black tracking-wider leading-tight uppercase ${step.status === "failed" ? 'text-[#E31A1A]' :
                                                step.status === "completed" ? 'text-[#42BE65]' :
                                                    step.status === "active" ? 'text-[#0070f3]' : 'text-[#A3AED0]'
                                                }`}>
                                                {step.label}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

            </div>

            {/* --- APPROVE CONFIRMATION MODAL --- */}
            {showApproveModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
                        onClick={() => setShowApproveModal(false)}
                    ></div>

                    {/* Modal Content */}
                    <div className={`relative w-full max-w-[340px] transform overflow-hidden rounded-[28px] ${isDark ? 'bg-[#111C44] border-gray-800' : 'bg-white'} p-6 shadow-2xl transition-all border animate-in fade-in zoom-in duration-200 text-center`}>
                        <div className={`mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full ${isDark ? 'bg-[#1B254B]' : 'bg-blue-50'}`}>
                            <ShieldCheck size={28} className="text-[#0070f3]" />
                        </div>

                        <h3 className={`text-xl font-black mb-2 ${isDark ? 'text-white' : 'text-[#2B3674]'}`}>
                            Approve Partner
                        </h3>
                        <p className={`text-[13px] font-medium mb-8 leading-relaxed ${isDark ? 'text-gray-400' : 'text-[#707EAE]'}`}>
                            Are you sure you want to approve partners?
                        </p>

                        <div className="flex flex-col gap-2.5">
                            <button
                                onClick={() => {
                                    // Handle approval logic here
                                    setShowApproveModal(false);
                                }}
                                className="w-full py-3 text-[13px] font-black bg-[#0070f3] text-white rounded-2xl shadow-lg shadow-blue-500/25 hover:bg-blue-600 active:scale-[0.98] transition-all uppercase tracking-wider"
                            >
                                Approved
                            </button>
                            <button
                                onClick={() => setShowApproveModal(false)}
                                className={`w-full py-3 text-[13px] font-black rounded-2xl transition-all uppercase tracking-wider ${isDark ? 'bg-[#1B254B] text-white hover:bg-[#232D65]' : 'bg-gray-100 text-[#2B3674] hover:bg-gray-200'
                                    }`}
                            >
                                Review Again
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* --- REJECT CONFIRMATION MODAL --- */}
            {showRejectModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
                        onClick={() => setShowRejectModal(false)}
                    ></div>

                    {/* Modal Content */}
                    <div className={`relative w-full max-w-[340px] transform overflow-hidden rounded-[28px] ${isDark ? 'bg-[#111C44] border-gray-800' : 'bg-white'} p-6 shadow-2xl transition-all border animate-in fade-in zoom-in duration-200 text-center`}>
                        <div className={`mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full ${isDark ? 'bg-red-900/20' : 'bg-red-50'}`}>
                            <XCircle size={28} className="text-red-500" />
                        </div>

                        <h3 className={`text-xl font-black mb-2 ${isDark ? 'text-white' : 'text-[#2B3674]'}`}>
                            Reject Partner
                        </h3>
                        <p className={`text-[13px] font-medium mb-8 leading-relaxed ${isDark ? 'text-gray-400' : 'text-[#707EAE]'}`}>
                            Are you sure you want to reject this partner?
                        </p>

                        <div className="flex flex-col gap-2.5">
                            <button
                                onClick={() => {
                                    // Handle rejection logic here
                                    setShowRejectModal(false);
                                }}
                                className="w-full py-3 text-[13px] font-black bg-red-500 text-white rounded-2xl shadow-lg shadow-red-500/25 hover:bg-red-600 active:scale-[0.98] transition-all uppercase tracking-wider"
                            >
                                Reject
                            </button>
                            <button
                                onClick={() => setShowRejectModal(false)}
                                className={`w-full py-3 text-[13px] font-black rounded-2xl transition-all uppercase tracking-wider ${isDark ? 'bg-[#1B254B] text-white hover:bg-[#232D65]' : 'bg-gray-100 text-[#2B3674] hover:bg-gray-200'
                                    }`}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
