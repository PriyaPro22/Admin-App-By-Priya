"use client";

import React, { useState } from "react";
import {
    Users,
    UserCheck,
    Clock,
    Ban,
    Search,
    Plus,
    Eye,
    ShieldCheck,
    MoreHorizontal,
    Bell,
    ChevronDown,
    Filter
} from "lucide-react";

// --- Mock Data ---
interface Partner {
    id: string;
    code: string;
    name: string;
    avatar?: string;
    phone: string;
    category: string;
    kycStatus: "Verified" | "Pending" | "Rejected";
    accountStatus: "Active" | "Blocked" | "Inactive";
}

const MOCK_PARTNERS: Partner[] = [
    {
        id: "1",
        code: "BW-45281",
        name: "Rajesh Kumar",
        phone: "+91 98765-43210",
        category: "Electrician",
        kycStatus: "Verified",
        accountStatus: "Active"
    },
    {
        id: "2",
        code: "BW-45282",
        name: "Amit Singh",
        phone: "+91 98123-45678",
        category: "Plumber",
        kycStatus: "Pending",
        accountStatus: "Active"
    },
    {
        id: "3",
        code: "BW-45283",
        name: "Sunil Verma",
        phone: "+91 99887-76655",
        category: "AC Repair",
        kycStatus: "Verified",
        accountStatus: "Blocked"
    },
    {
        id: "4",
        code: "BW-45284",
        name: "Priya Sharma",
        phone: "+91 98765-12345",
        category: "Beautician",
        kycStatus: "Verified",
        accountStatus: "Active"
    },
    {
        id: "5",
        code: "BW-45285",
        name: "Rahul Gupta",
        phone: "+91 88776-65544",
        category: "Carpenter",
        kycStatus: "Rejected",
        accountStatus: "Inactive"
    }
];

// --- Components ---

const StatCard = ({
    title,
    value,
    change,
    icon: Icon,
    colorClass,
    bgClass,
    trend
}: {
    title: string;
    value: string;
    change: string;
    icon: any;
    colorClass: string;
    bgClass: string;
    trend?: "up" | "down" | "neutral";
}) => {
    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between h-[160px]">
            <div className="flex justify-between items-start">
                <div className={`p-3 rounded-xl ${bgClass}`}>
                    <Icon className={`h-6 w-6 ${colorClass}`} />
                </div>
                {trend && (
                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${trend === 'up' ? 'bg-green-50 text-green-600' : trend === 'down' ? 'bg-red-50 text-red-600' : 'bg-orange-50 text-orange-600'}`}>
                        {change}
                    </span>
                )}
            </div>
            <div>
                <p className="text-gray-500 font-medium text-sm mb-1">{title}</p>
                <h3 className="text-3xl font-bold text-gray-900">{value}</h3>
            </div>
        </div>
    );
};

const StatusBadge = ({ status, type }: { status: string; type: "kyc" | "account" }) => {
    let styles = "";

    if (type === "kyc") {
        switch (status) {
            case "Verified": styles = "bg-green-100 text-green-700 border-green-200"; break;
            case "Pending": styles = "bg-orange-100 text-orange-700 border-orange-200"; break;
            case "Rejected": styles = "bg-red-100 text-red-700 border-red-200"; break;
            default: styles = "bg-gray-100 text-gray-700";
        }
    } else {
        switch (status) {
            case "Active": styles = "bg-green-50 text-green-600"; break;
            case "Blocked": styles = "bg-red-50 text-red-600"; break;
            case "Inactive": styles = "bg-gray-50 text-gray-600"; break;
            default: styles = "bg-gray-50 text-gray-600";
        }
    }

    const Icon = status === "Verified" ? ShieldCheck : status === "Pending" ? Clock : status === "Active" ? undefined : status === "Blocked" ? Ban : undefined;

    return (
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${styles}`}>
            {status === "Verified" && <div className="h-1.5 w-1.5 rounded-full bg-green-500" />}
            {status}
        </span>
    );
};

export default function PartnerManagement() {
    const [searchTerm, setSearchTerm] = useState("");

    return (
        <div className="min-h-screen bg-[#F8F9FC] p-8">
            {/* --- Header --- */}
            <header className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Partner Management</h1>
                    <p className="text-gray-500 text-sm mt-1">Manage and verify service providers</p>
                </div>

                <div className="flex items-center gap-6">
                    <button className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors">
                        <Bell className="h-6 w-6" />
                        <span className="absolute top-2 right-2 h-2.5 w-2.5 bg-red-500 rounded-full border-2 border-white"></span>
                    </button>

                    <div className="flex items-center gap-3 pl-6 border-l border-gray-200">
                        <div className="text-right hidden md:block">
                            <p className="text-sm font-bold text-gray-900">Admin User</p>
                            <p className="text-xs text-gray-500">Super Administrator</p>
                        </div>
                        <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold border-2 border-white shadow-sm">
                            <Users className="h-5 w-5" />
                        </div>
                    </div>
                </div>
            </header>

            {/* --- Stats Cards --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard
                    title="Total Partners"
                    value="1,284"
                    change="+12%"
                    trend="up"
                    icon={Users}
                    bgClass="bg-blue-50"
                    colorClass="text-blue-600"
                />
                <StatCard
                    title="Active Partners"
                    value="1,120"
                    change="+5%"
                    trend="up"
                    icon={UserCheck}
                    bgClass="bg-green-50"
                    colorClass="text-green-600"
                />
                <StatCard
                    title="Pending Verification"
                    value="142"
                    change="Urgent"
                    trend="neutral"
                    icon={Clock}
                    bgClass="bg-orange-50"
                    colorClass="text-orange-600"
                />
                <StatCard
                    title="Blocked Partners"
                    value="22"
                    change="-2%"
                    trend="down"
                    icon={Ban}
                    bgClass="bg-red-50"
                    colorClass="text-red-600"
                />
            </div>

            {/* --- Filters & Actions --- */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-6 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4 flex-1">
                    {/* Search */}
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by name, code or phone..."
                            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    {/* Filter Dropdowns (Mock) */}
                    <button className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 flex items-center gap-2 hover:bg-gray-100 transition-colors">
                        Status: All <ChevronDown className="h-4 w-4 text-gray-500" />
                    </button>
                    <button className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 flex items-center gap-2 hover:bg-gray-100 transition-colors">
                        Category: All <ChevronDown className="h-4 w-4 text-gray-500" />
                    </button>
                    <button className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 flex items-center gap-2 hover:bg-gray-100 transition-colors">
                        City: All <ChevronDown className="h-4 w-4 text-gray-500" />
                    </button>
                </div>

                <button className="px-6 py-2.5 bg-blue-800 text-white font-bold rounded-xl shadow-lg shadow-blue-800/20 hover:bg-blue-900 transition-all flex items-center gap-2">
                    <Plus className="h-5 w-5" />
                    Add New Partner
                </button>
            </div>

            {/* --- Table --- */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100">
                                <th className="text-left py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Partner Code</th>
                                <th className="text-left py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Partner Name</th>
                                <th className="text-left py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Phone</th>
                                <th className="text-left py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Category</th>
                                <th className="text-left py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">KYC Status</th>
                                <th className="text-left py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Account Status</th>
                                <th className="text-right py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {MOCK_PARTNERS.map((partner) => (
                                <tr key={partner.id} className="hover:bg-gray-50/50 transition-colors group">
                                    <td className="py-4 px-6 text-sm font-medium text-gray-500">
                                        {partner.code}
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">
                                                {partner.name.split(" ").map(n => n[0]).join("")}
                                            </div>
                                            <span className="font-bold text-gray-900">{partner.name}</span>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6 text-sm text-gray-600 font-medium font-mono">
                                        {partner.phone}
                                    </td>
                                    <td className="py-4 px-6">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                                            {partner.category}
                                        </span>
                                    </td>
                                    <td className="py-4 px-6">
                                        <StatusBadge status={partner.kycStatus} type="kyc" />
                                    </td>
                                    <td className="py-4 px-6">
                                        <StatusBadge status={partner.accountStatus} type="account" />
                                    </td>
                                    <td className="py-4 px-6 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="View Details">
                                                <Eye className="h-4 w-4" />
                                            </button>
                                            <button className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors" title="Verify / Approve">
                                                <ShieldCheck className="h-4 w-4" />
                                            </button>
                                            <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Block / Other Actions">
                                                <Ban className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* --- Pagination (Mock) --- */}
                <div className="border-t border-gray-100 p-4 flex items-center justify-between">
                    <p className="text-sm text-gray-500">Showing <span className="font-bold text-gray-900">1-5</span> of <span className="font-bold text-gray-900">1,284</span></p>
                    <div className="flex gap-2">
                        <button className="px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-200 rounded-lg disabled:opacity-50" disabled>Previous</button>
                        <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50">Next</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
