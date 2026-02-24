"use client";

import React, { useState } from "react";
import {
    Settings,
    Database,
    Shield,
    Bell,
    Cpu,
    Globe,
    HardDrive,
    Activity,
    RefreshCcw,
    ShieldCheck,
    Key,
    Mail,
    Cloud,
    ChevronRight,
    Zap,
    Lock,
    Search,
    CheckCircle2,
    AlertTriangle,
    Info
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";

export default function UtilitiesPage() {
    const { theme } = useTheme();
    const isDark = theme === "dark";

    const utilityCards = [
        {
            title: "General Settings",
            description: "App name, logo, and core business metadata configurations.",
            icon: Settings,
            color: "blue",
            category: "System"
        },
        {
            title: "API Connections",
            description: "Manage external service integrations and webhooks.",
            icon: Key,
            color: "indigo",
            category: "Integration"
        },
        {
            title: "Access Control",
            description: "Advanced RBAC settings and authentication protocols.",
            icon: Lock,
            color: "rose",
            category: "Security"
        },
        {
            title: "Database Health",
            description: "Monitor MongoDB clusters, indexes, and storage usage.",
            icon: Database,
            color: "emerald",
            category: "Infrastructure"
        },
        {
            title: "Media Optimizer",
            description: "Cleanup unused Cloudinary assets and optimize cache.",
            icon: HardDrive,
            color: "amber",
            category: "Optimization"
        },
        {
            title: "Notification Hub",
            description: "Configure SMTP, Firebase, and WhatsApp templates.",
            icon: Bell,
            color: "purple",
            category: "System"
        },
        {
            title: "System Audit",
            description: "Detailed logs of every administrative action performed.",
            icon: ShieldCheck,
            color: "cyan",
            category: "Security"
        },
        {
            title: "Performance Monitor",
            description: "Real-time server load, latency, and uptime tracking.",
            icon: Activity,
            color: "orange",
            category: "Infrastructure"
        }
    ];

    const [activeTab, setActiveTab] = useState("All Tools");

    return (
        <div className={`min-h-screen p-6 lg:p-10 transition-colors duration-300 ${isDark ? 'bg-[#0b1437] text-white' : 'bg-[#F4F7FE] text-[#2B3674]'}`}>

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
                <div>
                    <h1 className={`text-3xl font-extrabold tracking-tight ${isDark ? 'text-white' : 'text-[#2B3674]'}`}>
                        System Utilities
                    </h1>
                    <p className="text-gray-500 mt-1 font-medium italic">Advanced tools to maintain and tune your platform</p>
                </div>

                <div className="flex items-center gap-3">
                    <div className={`relative flex items-center ${isDark ? 'bg-[#111C44] border-gray-800' : 'bg-white border-gray-200'} border px-4 py-2.5 rounded-2xl shadow-sm`}>
                        <Search size={18} className="text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search tools..."
                            className="bg-transparent border-none outline-none text-sm ml-2 font-medium w-48"
                        />
                    </div>
                    <button className="flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-bold bg-[#0070f3] text-white shadow-lg shadow-blue-500/20 transition-all hover:bg-blue-600 active:scale-95">
                        <RefreshCcw size={18} />
                        System Update
                    </button>
                </div>
            </div>

            {/* Categories / Tabs */}
            <div className="flex flex-wrap items-center gap-2 mb-8 bg-black/5 dark:bg-white/5 p-1.5 rounded-[20px] w-fit">
                {["All Tools", "System", "Infrastructure", "Security", "Integration"].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-6 py-2.5 rounded-[16px] text-sm font-bold transition-all ${activeTab === tab
                                ? (isDark ? 'bg-[#111C44] text-white shadow-lg' : 'bg-white text-[#0070f3] shadow-md')
                                : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Tools Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                {utilityCards
                    .filter(card => activeTab === "All Tools" || card.category === activeTab)
                    .map((card, idx) => (
                        <div
                            key={idx}
                            className={`group relative p-8 rounded-[32px] transition-all duration-300 hover:translate-y-[-8px] border-2 cursor-pointer ${isDark
                                    ? 'bg-[#111C44] border-gray-800 hover:border-blue-500/50'
                                    : 'bg-white border-transparent hover:border-blue-500/10 hover:shadow-2xl hover:shadow-blue-500/5'
                                }`}
                        >
                            {/* Category Tag */}
                            <div className={`absolute top-6 right-6 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${isDark ? 'bg-[#1B254B] text-gray-400' : 'bg-[#F4F7FE] text-gray-500'
                                }`}>
                                {card.category}
                            </div>

                            <div className={`h-[64px] w-[64px] rounded-[22px] flex items-center justify-center mb-6 transition-all group-hover:scale-110 ${card.color === 'blue' ? 'bg-blue-100/50 text-blue-600' :
                                    card.color === 'indigo' ? 'bg-indigo-100/50 text-indigo-600' :
                                        card.color === 'emerald' ? 'bg-emerald-100/50 text-emerald-600' :
                                            card.color === 'rose' ? 'bg-rose-100/50 text-rose-600' :
                                                card.color === 'amber' ? 'bg-amber-100/50 text-amber-600' :
                                                    card.color === 'purple' ? 'bg-purple-100/50 text-purple-600' :
                                                        card.color === 'cyan' ? 'bg-cyan-100/50 text-cyan-600' :
                                                            'bg-orange-100/50 text-orange-600'
                                }`}>
                                <card.icon size={28} />
                            </div>

                            <h3 className={`text-xl font-black mb-2 ${isDark ? 'text-white' : 'text-[#2B3674]'}`}>{card.title}</h3>
                            <p className="text-sm font-medium text-gray-500 leading-relaxed mb-6">{card.description}</p>

                            <div className="flex items-center gap-1.5 text-xs font-bold text-[#0070f3] group-hover:translate-x-1 transition-transform">
                                Launch Tool <ChevronRight size={14} />
                            </div>
                        </div>
                    ))}
            </div>

            {/* Bottom Section: Service Status & Alerts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Service Health */}
                <div className={`lg:col-span-2 p-8 rounded-[32px] border ${isDark ? 'bg-[#111C44] border-gray-800' : 'bg-white border-transparent'} shadow-sm`}>
                    <div className="flex items-center justify-between mb-8">
                        <h3 className={`text-xl font-black ${isDark ? 'text-white' : 'text-[#2B3674]'}`}>Service Status</h3>
                        <div className="flex items-center gap-2 bg-emerald-100 text-emerald-600 px-3 py-1 rounded-full text-xs font-bold">
                            <CheckCircle2 size={14} /> All Systems Operational
                        </div>
                    </div>

                    <div className="space-y-6">
                        {[
                            { name: "Global API Gateway", status: "Operational", load: "12%", color: "emerald" },
                            { name: "Media Processing Cluster", status: "Operational", load: "45%", color: "emerald" },
                            { name: "Auth Service (JWT)", status: "Operational", load: "8%", color: "emerald" },
                            { name: "Cloudinary Image CDN", status: "Slow", load: "89%", color: "amber" },
                        ].map((service, i) => (
                            <div key={i} className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className={`w-2.5 h-2.5 rounded-full bg-${service.color}-500 animate-pulse`}></div>
                                    <span className={`text-sm font-bold ${isDark ? 'text-gray-300' : 'text-[#2B3674]'}`}>{service.name}</span>
                                </div>
                                <div className="flex items-center gap-8">
                                    <div className="hidden md:block w-32 bg-gray-100 dark:bg-gray-800 h-1.5 rounded-full overflow-hidden">
                                        <div className={`bg-${service.color}-500 h-full rounded-full`} style={{ width: service.load }}></div>
                                    </div>
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest min-w-[80px] text-right">{service.status}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Quick Tips / Alerts */}
                <div className={`p-8 rounded-[32px] bg-gradient-to-br from-[#0070f3] to-blue-700 text-white shadow-xl shadow-blue-500/20`}>
                    <div className="flex items-center gap-3 mb-6">
                        <Zap className="fill-white" size={24} />
                        <h3 className="text-xl font-bold">System Insights</h3>
                    </div>
                    <p className="text-white/80 text-sm leading-relaxed mb-8">
                        Our autonomous AI is monitoring your database. Consider optimizing <strong>UserSessions</strong> index to reduce latency by ~140ms.
                    </p>
                    <div className="space-y-4">
                        <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl flex items-center gap-4">
                            <div className="bg-white/20 p-2 rounded-xl">
                                <Info size={16} />
                            </div>
                            <div className="text-xs">
                                <p className="font-bold">Next Backup</p>
                                <p className="text-white/60">Today at 03:00 AM</p>
                            </div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl flex items-center gap-4">
                            <div className="bg-amber-400 text-blue-900 p-2 rounded-xl">
                                <AlertTriangle size={16} />
                            </div>
                            <div className="text-xs">
                                <p className="font-bold text-amber-400">Security Update</p>
                                <p className="text-white/60">Patch v12.4 is available</p>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
