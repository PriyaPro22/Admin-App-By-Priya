"use client";

import React, { useState, useEffect } from "react";
import {
    Plus,
    ClipboardList,
    Ban,
    Download,
    Handshake,
    Hourglass,
    CheckCircle2,
    Search,
    Bell,
    User,
    Calendar,
    Filter,
    ArrowRight,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    CircleSlash,
    FileSpreadsheet,
    FileText,
    UserX,
    Check
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Partner {
    id: string;
    code: string;
    name: string;
    initials: string;
    mobile: string;
    city: string;
    joinDate: string;
    approval: "Pending" | "Approved" | "Blocked" | "Rejected";
    active: boolean;
}



const StatCard = ({ label, value, icon: Icon, bg, color, isDark }: any) => {
    return (
        <div className={`${isDark ? 'bg-[#111C44] border-gray-800' : 'bg-white border-transparent'} rounded-[24px] p-7 shadow-sm border flex items-center gap-5 w-full transition-all hover:shadow-lg hover:-translate-y-1 duration-300`}>
            <div className={`h-[60px] w-[60px] min-w-[60px] rounded-full flex items-center justify-center ${bg}`}>
                <Icon className={`h-7 w-7 ${color}`} strokeWidth={2.5} />
            </div>
            <div className="min-w-0">
                <p className={`text-[12px] font-bold ${isDark ? 'text-gray-400' : 'text-[#A3AED0]'} uppercase tracking-wider mb-0.5 truncate`}>{label}</p>
                <h3 className={`text-2xl font-black ${isDark ? 'text-white' : 'text-[#2B3674]'}`}>{value}</h3>
            </div>
        </div>
    );
};

const StatusBadge = ({ status }: { status: Partner["approval"] }) => {
    let styles = "";
    switch (status) {
        case "Approved": styles = "bg-[#EEFBF3] text-[#42BE65]"; break;
        case "Pending": styles = "bg-[#FFF8E7] text-[#FFB800]"; break;
        case "Blocked": styles = "bg-[#F4F7FE] text-[#A3AED0]"; break;
        case "Rejected": styles = "bg-[#FFF1F1] text-[#E31A1A]"; break;
    }
    return (
        <span className={`px-5 py-2 rounded-full text-[12px] font-bold ${styles}`}>
            {status}
        </span>
    );
};

export default function PartnerManagement() {
    const { theme } = useTheme();
    const router = useRouter();
    const isDark = theme === "dark";
    const [searchTerm, setSearchTerm] = useState("");
    const [isExportOpen, setIsExportOpen] = useState(false);
    const [isRowsPerPageOpen, setIsRowsPerPageOpen] = useState(false);
    const [itemsPerPage, setItemsPerPage] = useState(50);
    const [selectedExportFormat, setSelectedExportFormat] = useState<"Excel" | "PDF">("Excel");

    // Stats State
    const [totalPartnersCount, setTotalPartnersCount] = useState<number | string>("...");
    const [pendingPartnersCount, setPendingPartnersCount] = useState<number | string>("...");
    const [activePartnersCount, setActivePartnersCount] = useState<number | string>("...");
    const [blockedPartnersCount, setBlockedPartnersCount] = useState<number | string>("...");

    // Partners Data State
    const [partners, setPartners] = useState<Partner[]>([]);
    const [isLoadingPartners, setIsLoadingPartners] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const headers = { 'x-api-token': 'super_secure_token' };

                // Fetch Stats (Existing logic)
                const totalRes = await fetch('https://api.bijliwalaaya.in/api/partner/stats/count', { headers });
                const totalData = await totalRes.json();
                if (totalData.success) setTotalPartnersCount(totalData.totalPartners);

                const pendingRes = await fetch('https://api.bijliwalaaya.in/api/partner/admin/pending-count', { headers });
                const pendingData = await pendingRes.json();
                if (pendingData.success) setPendingPartnersCount(pendingData.pendingPartners);

                const activeRes = await fetch('https://api.bijliwalaaya.in/api/partner/admin/active-count', { headers });
                const activeData = await activeRes.json();
                if (activeData.success) setActivePartnersCount(activeData.activePartners);

                const blockedRes = await fetch('https://api.bijliwalaaya.in/api/partner/admin/block-count', { headers });
                const blockedData = await blockedRes.json();
                if (blockedData.success) setBlockedPartnersCount(blockedData.blockedPartners);

                // Fetch All Partners List
                const listRes = await fetch('https://api.bijliwalaaya.in/api/partner/admin/all-partners', { headers });
                const listData = await listRes.json();

                if (listData.success && Array.isArray(listData.data)) {
                    console.log("API Data:", listData.data);
                    const mappedPartners: Partner[] = listData.data.map((item: any) => {
                        const details = item.personal_details || {};
                        console.log("Mapping Item:", item._id, details.name);

                        // Determine status/approval
                        let approvalVal: Partner["approval"] = "Pending";
                        let activeVal = false;

                        const timerStatus = details.status?.toLowerCase();
                        if (timerStatus === "active") {
                            approvalVal = "Approved";
                            activeVal = true;
                        } else if (timerStatus === "blocked") {
                            approvalVal = "Blocked";
                            activeVal = false;
                        } else if (timerStatus === "pending") {
                            approvalVal = "Pending";
                            activeVal = false;
                        } else if (timerStatus === "rejected") {
                            approvalVal = "Rejected";
                            activeVal = false;
                        }

                        // Initials
                        const nameParts = (details.name || "Unknown").split(" ");
                        let initials = "??";
                        if (nameParts.length > 0) {
                            initials = nameParts[0][0];
                            if (nameParts.length > 1) {
                                initials += nameParts[nameParts.length - 1][0];
                            }
                        }
                        initials = initials.toUpperCase();

                        return {
                            id: item._id || Math.random().toString(),
                            code: details.partner_id || "N/A",
                            name: details.name || "Unknown Partner",
                            initials: initials,
                            mobile: details.phone || "N/A",
                            city: details.location || "N/A",
                            joinDate: details.registration_date ? details.registration_date.split(" ")[0] : "N/A",
                            approval: approvalVal,
                            active: activeVal
                        };
                    });
                    console.log("Mapped Partners:", mappedPartners);
                    setPartners(mappedPartners);
                }


            } catch (error) {
                console.error("Error fetching data:", error);
                if (totalPartnersCount === "...") setTotalPartnersCount(0);
                if (pendingPartnersCount === "...") setPendingPartnersCount(0);
                if (activePartnersCount === "...") setActivePartnersCount(0);
                if (blockedPartnersCount === "...") setBlockedPartnersCount(0);
            } finally {
                setIsLoadingPartners(false);
            }
        };

        fetchData();
    }, []);

    // Helper to truncate long location strings
    const truncateLocation = (loc: string) => {
        if (!loc) return "N/A";
        return loc.length > 30 ? loc.substring(0, 30) + "..." : loc;
    };

    return (
        <div className={`min-h-screen transition-colors duration-300 ${isDark ? 'bg-[#0B1437]' : 'bg-[#F4F7FE]'}`}>
            {/* --- TOP HEADER BAR --- */}
            <div className={`${isDark ? 'bg-[#111C44] border-gray-800' : 'bg-white border-b border-gray-100'} px-8 py-5 flex justify-between items-center sticky top-0 z-40`}>
                <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-[#2B3674]'}`}>Partners</h1>

                <div className="flex items-center gap-6">
                    <button className="relative p-2 text-[#A3AED0] hover:text-[#0070f3] transition-all">
                        <Bell size={22} strokeWidth={2.5} />
                        <span className={`absolute top-1.5 right-1.5 h-2.5 w-2.5 bg-[#E31A1A] rounded-full border-2 ${isDark ? 'border-[#111C44]' : 'border-white'}`}></span>
                    </button>

                    <div className={`h-8 w-px ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}></div>

                    <div className={`${isDark ? 'bg-[#1B254B] border-gray-700' : 'bg-white border-gray-50'} border shadow-sm rounded-2xl py-2 px-6 flex items-center gap-3`}>
                        <div className={`h-9 w-9 rounded-full ${isDark ? 'bg-[#111C44] text-white' : 'bg-[#F4F7FE] text-[#2B3674]'} flex items-center justify-center font-bold`}>
                            <User size={18} strokeWidth={2.5} />
                        </div>
                        <span className={`text-[15px] font-bold ${isDark ? 'text-white' : 'text-[#2B3674]'}`}>Admin Profile</span>
                    </div>
                </div>
            </div>

            <div className="p-8">

                {/* --- ACTION BUTTONS (SINGLE ROW) --- */}
                <div className="flex justify-between items-center mb-10">
                    <div className="flex gap-4">
                        <Link
                            href="/partner-management/partners/add"
                            className="px-7 py-4 bg-[#0070f3] text-white font-bold rounded-2xl shadow-lg shadow-blue-500/20 hover:bg-blue-600 transition-all flex items-center gap-3"
                        >
                            <div className="h-6 w-6 rounded-full border-2 border-white flex items-center justify-center">
                                <Plus size={14} strokeWidth={4} />
                            </div>
                            Add New Partner
                        </Link>

                        <button className={`${isDark ? 'bg-[#111C44] text-white border-gray-800 hover:bg-[#1B2559]' : 'bg-white text-[#2B3674] border-gray-100 hover:bg-gray-50'} px-7 py-4 font-bold rounded-2xl border shadow-sm transition-all flex items-center gap-3`}>
                            <ClipboardList size={20} className="text-[#A3AED0]" strokeWidth={2.5} />
                            Pending Approvals
                        </button>

                        <button className={`${isDark ? 'bg-[#111C44] text-white border-gray-800 hover:bg-[#1B2559]' : 'bg-white text-[#2B3674] border-gray-100 hover:bg-gray-50'} px-7 py-4 font-bold rounded-2xl border shadow-sm transition-all flex items-center gap-3`}>
                            <Ban size={20} className="text-[#A3AED0]" strokeWidth={2.5} />
                            Blocked Partners
                        </button>
                    </div>

                    <div className="relative">
                        <button
                            onClick={() => setIsExportOpen(!isExportOpen)}
                            className={`px-7 py-4 font-bold rounded-2xl border transition-all flex items-center gap-3 ${isExportOpen
                                ? "bg-[#0070f3] text-white border-[#0070f3] shadow-lg shadow-blue-500/20"
                                : (isDark ? "bg-[#111C44] text-white border-gray-800 hover:bg-[#1B2559]" : "bg-white text-[#2B3674] border-gray-100 hover:bg-gray-50")
                                }`}
                        >
                            <Download size={20} className={isExportOpen ? "text-white" : "text-[#A3AED0]"} strokeWidth={2.5} />
                            Export Data
                            <ChevronDown size={16} className={`ml-1 transition-transform ${isExportOpen ? "rotate-180" : ""}`} />
                        </button>

                        {isExportOpen && (
                            <div className={`absolute right-0 mt-3 w-56 rounded-[24px] shadow-2xl overflow-hidden z-50 animate-in fade-in zoom-in duration-200 origin-top-right p-2 ${isDark ? 'bg-[#111C44] border border-gray-800' : 'bg-white border-gray-50'}`}>
                                <button
                                    onClick={() => setSelectedExportFormat("Excel")}
                                    className={`w-full flex items-center justify-between gap-3 px-5 py-3.5 rounded-xl text-[14px] font-bold transition-all ${selectedExportFormat === "Excel" ? "bg-blue-50 text-[#0070f3]" : (isDark ? "text-white hover:bg-[#1B2559]" : "text-[#2B3674] hover:bg-gray-50")}`}
                                >
                                    <div className="flex items-center gap-3">
                                        <FileSpreadsheet size={18} className={selectedExportFormat === "Excel" ? "text-[#0070f3]" : "text-[#05CD99]"} />
                                        Excel Format
                                    </div>
                                    {selectedExportFormat === "Excel" && <Check size={16} strokeWidth={3} />}
                                </button>
                                <button
                                    onClick={() => setSelectedExportFormat("PDF")}
                                    className={`w-full flex items-center justify-between gap-3 px-5 py-3.5 rounded-xl text-[14px] font-bold transition-all mt-1 ${selectedExportFormat === "PDF" ? "bg-blue-50 text-[#0070f3]" : (isDark ? "text-white hover:bg-[#1B2559]" : "text-[#2B3674] hover:bg-gray-50")}`}
                                >
                                    <div className="flex items-center gap-3">
                                        <FileText size={18} className={selectedExportFormat === "PDF" ? "text-[#0070f3]" : "text-[#E31A1A]"} />
                                        PDF Document
                                    </div>
                                    {selectedExportFormat === "PDF" && <Check size={16} strokeWidth={3} />}
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* --- STATS GRID --- */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
                    <StatCard
                        label="Total Partners"
                        value={totalPartnersCount}
                        icon={Handshake}
                        bg="bg-[#EBF3FF]"
                        color="text-[#0070f3]"
                        isDark={isDark}
                    />
                    <StatCard
                        label="Pending Approvals"
                        value={pendingPartnersCount}
                        icon={Hourglass}
                        bg="bg-[#FFF8E7]"
                        color="text-[#FFB800]"
                        isDark={isDark}
                    />
                    <StatCard
                        label="Active Partners"
                        value={activePartnersCount}
                        icon={CheckCircle2}
                        bg="bg-[#E6FAF5]"
                        color="text-[#05CD99]"
                        isDark={isDark}
                    />
                    <StatCard
                        label="Blocked Partners"
                        value={blockedPartnersCount}
                        icon={UserX}
                        bg="bg-[#F4F7FE]"
                        color="text-[#707EAE]"
                        isDark={isDark}
                    />
                </div>

                {/* --- FILTER SECTION --- */}
                <div className={`${isDark ? 'bg-[#111C44] border-gray-800' : 'bg-white border-gray-50'} p-10 rounded-[32px] shadow-sm border mb-10`}>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-8">
                        <div>
                            <label className="block text-[12px] font-bold text-[#A3AED0] uppercase tracking-widest mb-3">SEARCH PARTNER</label>
                            <div className="relative">
                                <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-6 w-6 text-[#A3AED0]" />
                                <input
                                    type="text"
                                    placeholder="Name, ID, or Mobile number..."
                                    className={`w-full pl-14 pr-5 py-4 ${isDark ? 'bg-[#1B2559] text-white' : 'bg-[#F4F7FE] text-[#2B3674]'} border-transparent rounded-2xl font-bold focus:outline-none transition-all placeholder:text-[#A3AED0]`}
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-[12px] font-bold text-[#A3AED0] uppercase tracking-widest mb-3">STATUS</label>
                            <div className="relative">
                                <select className={`w-full pl-5 pr-12 py-4 ${isDark ? 'bg-[#1B2559] text-white' : 'bg-[#F4F7FE] text-[#2B3674]'} border-transparent rounded-2xl font-bold appearance-none focus:outline-none cursor-pointer`}>
                                    <option>All Status</option>
                                    <option>Approved</option>
                                    <option>Pending</option>
                                    <option>Blocked</option>
                                </select>
                                <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 h-6 w-6 text-[#A3AED0] pointer-events-none" strokeWidth={3} />
                            </div>
                        </div>

                        <div>
                            <label className="block text-[12px] font-bold text-[#A3AED0] uppercase tracking-widest mb-3">CITY</label>
                            <div className="relative">
                                <select className={`w-full pl-5 pr-12 py-4 ${isDark ? 'bg-[#1B2559] text-white' : 'bg-[#F4F7FE] text-[#2B3674]'} border-transparent rounded-2xl font-bold appearance-none focus:outline-none cursor-pointer`}>
                                    <option>New York</option>
                                    <option>London</option>
                                    <option>Mumbai</option>
                                </select>
                                <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 h-6 w-6 text-[#A3AED0] pointer-events-none" strokeWidth={3} />
                            </div>
                        </div>
                    </div>

                    <div className="flex items-end gap-5">
                        <div className="w-80 relative">
                            <label className="block text-[12px] font-bold text-[#A3AED0] uppercase tracking-widest mb-3">JOIN DATE RANGE</label>
                            <div className="relative">
                                <Calendar className="absolute left-5 top-1/2 -translate-y-1/2 h-6 w-6 text-[#A3AED0]" />
                                <input
                                    type="date"
                                    className={`w-full pl-14 pr-5 py-4 ${isDark ? 'bg-[#1B2559] text-white' : 'bg-[#F4F7FE] text-[#2B3674]'} border-transparent rounded-2xl font-bold focus:outline-none transition-all cursor-pointer appearance-none`}
                                    onClick={(e) => (e.target as HTMLInputElement).showPicker()}
                                    onChange={(e) => console.log(e.target.value)}
                                />
                            </div>
                        </div>
                        <button className="p-4 bg-[#EBF3FF] text-[#0070f3] rounded-2xl hover:bg-blue-100 transition-all shadow-sm">
                            <Filter size={24} strokeWidth={3} />
                        </button>
                    </div>
                </div>

                {/* --- TABLE --- */}
                <div className={`${isDark ? 'bg-[#111C44] border-gray-800' : 'bg-white border-gray-50'} rounded-[32px] shadow-sm border overflow-hidden`}>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className={`border-b ${isDark ? 'border-gray-800' : 'border-gray-50'}`}>
                                    <th className="text-left py-8 px-10 text-[11px] font-bold text-[#A3AED0] uppercase tracking-[0.2em]">ID</th>
                                    <th className="text-left py-8 px-10 text-[11px] font-bold text-[#A3AED0] uppercase tracking-[0.2em]">Partner Name</th>
                                    <th className="text-left py-8 px-10 text-[11px] font-bold text-[#A3AED0] uppercase tracking-[0.2em]">Mobile</th>
                                    <th className="text-left py-8 px-10 text-[11px] font-bold text-[#A3AED0] uppercase tracking-[0.2em]">City/Area</th>
                                    <th className="text-left py-8 px-10 text-[11px] font-bold text-[#A3AED0] uppercase tracking-[0.2em]">Join Date</th>
                                    <th className="text-center py-8 px-10 text-[11px] font-bold text-[#A3AED0] uppercase tracking-[0.2em]">Approval</th>
                                    <th className="text-center py-8 px-10 text-[11px] font-bold text-[#A3AED0] uppercase tracking-[0.2em]">Active</th>
                                    <th className="text-right py-8 px-10 text-[11px] font-bold text-[#A3AED0] uppercase tracking-[0.2em]">Actions</th>
                                </tr>
                            </thead>
                            <tbody className={`divide-y ${isDark ? 'divide-gray-800' : 'divide-gray-50'}`}>
                                {isLoadingPartners ? (
                                    <tr>
                                        <td colSpan={8} className="py-20 text-center">
                                            <div className="flex flex-col items-center justify-center">
                                                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#0070f3] mb-4"></div>
                                                <p className={`font-bold ${isDark ? 'text-white' : 'text-[#2B3674]'}`}>Loading partners...</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : partners.length === 0 ? (
                                    <tr>
                                        <td colSpan={8} className="py-20 text-center">
                                            <p className={`font-bold ${isDark ? 'text-white' : 'text-[#2B3674]'}`}>No partners found.</p>
                                        </td>
                                    </tr>
                                ) : (
                                    partners.map((partner) => (
                                        <tr key={partner.id} className={`${isDark ? 'hover:bg-[#1B2559]/30' : 'hover:bg-gray-50/50'} transition-colors`}>
                                            <td className={`py-10 px-10 text-[15px] font-bold ${isDark ? 'text-white' : 'text-[#2B3674]'} whitespace-nowrap`}>{partner.code}</td>
                                            <td className="py-10 px-10 whitespace-nowrap">
                                                <div className="flex items-center gap-4">
                                                    <div className={`h-11 w-11 min-w-[44px] rounded-full ${isDark ? 'bg-[#1B2559] text-blue-400 border-gray-700' : 'bg-[#EBF3FF] text-[#0070f3] border-white'} flex items-center justify-center font-bold text-[14px] border-2 shadow-sm`}>
                                                        {partner.initials}
                                                    </div>
                                                    <span className={`font-bold ${isDark ? 'text-white' : 'text-[#2B3674]'} text-[15px]`}>{partner.name}</span>
                                                </div>
                                            </td>
                                            <td className="py-10 px-10 text-[15px] text-[#707EAE] font-bold whitespace-nowrap">{partner.mobile}</td>
                                            <td className="py-10 px-10 text-[15px] text-[#707EAE] font-bold whitespace-nowrap max-w-[200px] truncate" title={partner.city}>{truncateLocation(partner.city)}</td>
                                            <td className="py-10 px-10 text-[15px] text-[#707EAE] font-bold whitespace-nowrap">{partner.joinDate}</td>
                                            <td className="py-10 px-10 text-center">
                                                <StatusBadge status={partner.approval} />
                                            </td>
                                            <td className="py-10 px-10 text-center">
                                                <div className={`h-2.5 w-2.5 rounded-full mx-auto ${partner.active ? 'bg-[#42BE65]' : 'bg-[#A3AED0]'}`}></div>
                                            </td>
                                            <td className="py-10 px-10 text-right">
                                               <Link
  href={`/partner-management/partners/${partner.code}`}
  className="group inline-flex items-center gap-2 text-[#0070f3] font-bold"
>
                                                    View All Details
                                                    <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" strokeWidth={2.5} />
                                                </Link>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* --- PAGINATION --- */}
                    <div className={`p-10 flex flex-col md:flex-row items-center justify-between border-t ${isDark ? 'border-gray-800' : 'border-gray-50'} gap-6`}>
                        <div className="flex items-center gap-8">
                            <p className="text-[15px] text-[#A3AED0] font-semibold">
                                Showing <span className={`${isDark ? 'text-white' : 'text-[#2B3674]'} font-bold`}>1 to {itemsPerPage}</span> of <span className={`${isDark ? 'text-white' : 'text-[#2B3674]'} font-bold`}>1,240</span> partners
                            </p>

                            <div className="relative">
                                <button
                                    onClick={() => setIsRowsPerPageOpen(!isRowsPerPageOpen)}
                                    className={`flex items-center gap-2 px-4 py-2 ${isDark ? 'bg-[#1B2559] text-white hover:bg-[#232D65]' : 'bg-[#F4F7FE] text-[#2B3674] hover:bg-gray-100'} rounded-xl text-[14px] font-bold transition-all border border-transparent`}
                                >
                                    Show: {itemsPerPage}
                                    <ChevronDown size={14} className={`transition-transform duration-200 ${isRowsPerPageOpen ? 'rotate-180' : ''}`} />
                                </button>

                                {isRowsPerPageOpen && (
                                    <div className={`absolute bottom-full left-0 mb-2 w-32 rounded-2xl shadow-2xl border p-2 z-[60] animate-in fade-in slide-in-from-bottom-2 duration-200 ${isDark ? 'bg-[#111C44] border-gray-800' : 'bg-white border-gray-50'}`}>
                                        {[10, 20, 50, 100].map((num) => (
                                            <button
                                                key={num}
                                                onClick={() => {
                                                    setItemsPerPage(num);
                                                    setIsRowsPerPageOpen(false);
                                                }}
                                                className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-[14px] font-bold transition-all ${itemsPerPage === num ? 'bg-blue-50 text-[#0070f3]' : (isDark ? 'text-white hover:bg-[#1B2559]' : 'text-[#2B3674] hover:bg-gray-50')}`}
                                            >
                                                {num}
                                                {itemsPerPage === num && <Check size={14} strokeWidth={3} />}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <button className={`p-3 rounded-2xl border transition-all disabled:opacity-50 ${isDark ? 'border-gray-800 text-gray-500 hover:bg-[#1B2559]' : 'border-gray-100 text-[#A3AED0] hover:bg-gray-50'}`} disabled>
                                <ChevronLeft size={24} />
                            </button>
                            <button className="h-12 w-12 rounded-2xl bg-[#0070f3] text-white font-bold text-[15px] shadow-lg shadow-blue-500/20">1</button>
                            <button className={`h-12 w-12 rounded-2xl font-bold text-[15px] border transition-all ${isDark ? 'bg-[#111C44] border-gray-800 text-gray-400 hover:bg-[#1B2559]' : 'bg-white text-[#707EAE] border-gray-100 hover:bg-gray-50'}`}>2</button>
                            <button className={`h-12 w-12 rounded-2xl font-bold text-[15px] border transition-all ${isDark ? 'bg-[#111C44] border-gray-800 text-gray-400 hover:bg-[#1B2559]' : 'bg-white text-[#707EAE] border-gray-100 hover:bg-gray-50'}`}>3</button>
                            <button className={`p-3 rounded-2xl border transition-all ${isDark ? 'border-gray-800 text-gray-500 hover:bg-[#1B2559]' : 'border-gray-100 text-[#A3AED0] hover:bg-gray-50'}`}>
                                <ChevronRight size={24} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
