"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
    Users,
    Briefcase,
    Search,
    Bell,
    Moon,
    Sun,
    ChevronDown,
    LayoutDashboard,
    Package,
    UserPlus,
    ShieldCheck,
    TrendingUp,
    DollarSign,
    AlertCircle,
    CheckCircle2,
    Clock,
    ArrowRight,
    X,
    ChevronLeft,
    ChevronRight,
    Calendar as CalendarIcon
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";

const Dashboard = () => {
    const { theme, toggleTheme } = useTheme();
    const [searchQuery, setSearchQuery] = useState("");

    const isDark = theme === "dark";
    const [showOverviewDropdown, setShowOverviewDropdown] = useState(false);
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);
    const [currentDate, setCurrentDate] = useState(new Date());

    const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

    return (
        <div className={`min-h-screen transition-all duration-300 -m-4 md:-m-8 p-4 md:p-10 font-sans ${isDark ? 'bg-[#0B1437] text-white' : 'bg-[#F4F7FE] text-gray-800'}`}>
            <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: ${isDark ? '#1B2559' : '#E2E8F0'};
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: ${isDark ? '#2B3674' : '#CBD5E0'};
        }
      `}</style>

            {/* 1. Header Section */}
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div className="relative flex-1 max-w-xl">
                    <Search className={`absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 ${isDark ? 'text-gray-400' : 'text-gray-400'}`} />
                    <input
                        type="text"
                        placeholder="Search data, reports, bookings..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className={`w-full pl-10 pr-4 py-2.5 border-none rounded-lg focus:ring-2 focus:ring-blue-500 outline-none placeholder:text-gray-500 transition-all ${isDark ? 'bg-[#111C44] text-white' : 'bg-gray-100 text-gray-800'}`}
                    />
                </div>

                <div className="flex items-center gap-6">
                    <button className={`p-2 rounded-full transition-colors ${isDark ? 'text-gray-400 hover:bg-[#111C44]' : 'text-gray-600 hover:bg-gray-200'}`}>
                        <Bell className="h-6 w-6" />
                    </button>
                    <div className={`h-10 w-[1px] hidden md:block ${isDark ? 'bg-gray-700' : 'bg-gray-300'}`}></div>
                    <div className="relative">
                        <button
                            onClick={() => setShowOverviewDropdown(!showOverviewDropdown)}
                            className={`flex items-center gap-2 font-semibold px-4 py-2 rounded-lg transition-colors ${isDark ? 'text-white hover:bg-[#111C44]' : 'text-gray-900 hover:bg-gray-100'}`}
                        >
                            Dashboard Overview
                            <ChevronDown className={`h-5 w-5 transition-transform ${showOverviewDropdown ? 'rotate-180' : ''}`} />
                        </button>

                        {showOverviewDropdown && (
                            <div className={`absolute right-0 mt-2 w-48 rounded-xl shadow-2xl z-[100] border p-2 transition-all animate-in fade-in zoom-in-95 duration-200 ${isDark ? 'bg-[#111C44] border-gray-700' : 'bg-white border-gray-100'}`}>
                                {['Weekly Overview', 'Monthly Overview', 'Yearly Overview'].map((opt) => (
                                    <button
                                        key={opt}
                                        className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-bold transition-colors ${isDark ? 'text-gray-300 hover:bg-[#1B2559] hover:text-white' : 'text-gray-600 hover:bg-gray-50 hover:text-blue-600'}`}
                                    >
                                        {opt}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </header>

            {/* 2. Management Sections Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* User Management */}
                <div className={`p-6 rounded-2xl shadow-sm border transition-all ${isDark ? 'bg-[#111C44] border-gray-800' : 'bg-white border-gray-100'}`}>
                    <div className="flex items-center gap-2 mb-6 text-blue-600 font-bold tracking-wider uppercase text-sm">
                        <Users className="h-5 w-5" />
                        USER MANAGEMENT
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className={`p-4 rounded-xl shadow-sm border transition-all ${isDark ? 'bg-[#1B2559] border-gray-700' : 'bg-white border-gray-100'}`}>
                            <div className="text-gray-500 text-sm mb-1">Total Users</div>
                            <div className="flex items-end gap-2">
                                <span className="text-3xl font-extrabold">1,250</span>
                                <span className="text-green-500 text-sm font-bold mb-1">+12%</span>
                            </div>
                        </div>
                        <div className={`p-4 rounded-xl shadow-sm border transition-all ${isDark ? 'bg-[#1B2559] border-gray-700' : 'bg-white border-gray-100'}`}>
                            <div className="text-gray-500 text-sm mb-1">Active Users</div>
                            <div className="flex items-end gap-2">
                                <span className="text-3xl font-extrabold">890</span>
                                <span className="text-green-500 text-sm font-bold mb-1">+5%</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Partner Management */}
                <div className={`p-6 rounded-2xl shadow-sm border transition-all ${isDark ? 'bg-[#111C44] border-gray-800' : 'bg-white border-gray-100'}`}>
                    <div className="flex items-center gap-2 mb-6 font-bold tracking-wider uppercase text-sm text-slate-500">
                        <Briefcase className="h-5 w-5" />
                        PARTNER MANAGEMENT
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                        <div className={`p-4 rounded-xl shadow-sm border transition-all ${isDark ? 'bg-[#1B2559] border-gray-700' : 'bg-white border-gray-100'}`}>
                            <div className="text-gray-500 text-sm mb-2">Total</div>
                            <div className="text-3xl font-extrabold">150</div>
                        </div>
                        <div className={`p-4 rounded-xl shadow-sm border transition-all ${isDark ? 'bg-[#1B2559] border-gray-700' : 'bg-white border-gray-100'}`}>
                            <div className="text-gray-500 text-sm mb-2">Pending</div>
                            <div className="text-3xl font-extrabold text-[#F59E0B]">12</div>
                        </div>
                        <div className={`p-4 rounded-xl shadow-sm border border-l-4 border-l-green-500 transition-all ${isDark ? 'bg-[#1B2559] border-gray-700' : 'bg-white border-gray-100'}`}>
                            <div className="text-gray-500 text-sm mb-2">Active</div>
                            <div className="text-3xl font-extrabold text-green-600">138</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 3. Service Delivery Section */}
            <div className={`p-6 rounded-2xl shadow-sm border mb-6 relative overflow-hidden transition-all ${isDark ? 'bg-[#111C44] border-gray-800' : 'bg-white border-gray-100'}`}>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <div className="flex items-center gap-2 text-blue-600 font-bold tracking-wider uppercase text-sm">
                        <TrendingUp className="h-5 w-5" />
                        SERVICE DELIVERY (LIVE STATUS)
                    </div>
                    <button
                        onClick={() => setIsCalendarOpen(true)}
                        className={`text-xs px-3 py-1.5 rounded-md font-bold transition-all hover:scale-105 active:scale-95 ${isDark ? 'bg-blue-900/30 text-blue-400 hover:bg-blue-900/50' : 'bg-blue-50 text-blue-600 hover:bg-blue-100'}`}
                    >
                        Today: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <div className={`p-4 rounded-xl border transition-all cursor-default hover:scale-105 ${isDark ? 'bg-[#1B2559] border-gray-700' : 'bg-[#FBFBFC] border-gray-50'}`}>
                        <div className="text-gray-500 text-xs mb-1">Total Services</div>
                        <div className="text-2xl font-black">450+</div>
                    </div>
                    <div className={`p-4 rounded-xl border transition-all ${isDark ? 'bg-blue-900/20 border-blue-900/50' : 'bg-[#EBF5FF] border-blue-100'}`}>
                        <div className={`font-bold text-xs mb-1 ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>Today's Bookings</div>
                        <div className={`text-2xl font-black ${isDark ? 'text-blue-400' : 'text-blue-700'}`}>32</div>
                    </div>
                    <div className={`p-4 rounded-xl border transition-all ${isDark ? 'bg-[#1B2559] border-gray-700' : 'bg-[#FBFBFC] border-gray-50'}`}>
                        <div className="text-gray-500 text-xs mb-1">Ongoing</div>
                        <div className="text-2xl font-black text-blue-500">18</div>
                    </div>
                    <div className={`p-4 rounded-xl border transition-all ${isDark ? 'bg-[#1B2559] border-gray-700' : 'bg-[#FBFBFC] border-gray-50'}`}>
                        <div className="text-gray-500 text-xs mb-1">Completed</div>
                        <div className="text-2xl font-black text-green-600">400</div>
                    </div>
                    <div className={`p-4 rounded-xl border transition-all ${isDark ? 'bg-[#1B2559] border-gray-700' : 'bg-[#FBFBFC] border-gray-50'}`}>
                        <div className="text-gray-500 text-xs mb-1">Canceled</div>
                        <div className="text-2xl font-black text-red-500">5</div>
                    </div>
                </div>
            </div>

            {/* 4. Financials Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                {/* Revenue Card */}
                <div className="bg-blue-600 p-6 rounded-2xl shadow-lg relative text-white">
                    <div className="flex justify-between items-start mb-8">
                        <span className="text-sm font-semibold opacity-90">Total Revenue (MTD)</span>
                        <div className="bg-white/20 p-2 rounded-lg">
                            <DollarSign className="h-5 w-5" />
                        </div>
                    </div>
                    <div className="text-4xl font-black mb-2">$128,450.00</div>
                    <div className="text-sm font-medium opacity-80">+18.4% from last month</div>
                </div>

                {/* Collection Card */}
                <div className={`p-6 rounded-2xl shadow-sm border transition-all ${isDark ? 'bg-[#111C44] border-gray-800' : 'bg-white border-gray-100'}`}>
                    <div className="text-sm font-semibold text-gray-500 mb-2">Today's Collection</div>
                    <div className={`text-3xl font-black mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>$4,210.50</div>
                    <div className={`w-full h-2 rounded-full mb-2 overflow-hidden ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
                        <div className="w-[75%] h-full bg-green-500 rounded-full"></div>
                    </div>
                    <div className="text-xs text-gray-500 font-medium tracking-wide">Target: $5,500.00</div>
                </div>

                {/* Pending Payments Card */}
                <div className={`p-6 rounded-2xl shadow-sm border transition-all ${isDark ? 'bg-[#111C44] border-gray-800' : 'bg-white border-gray-100'}`}>
                    <div className="text-sm font-semibold text-gray-500 mb-2">Pending Payments</div>
                    <div className="text-3xl font-black text-red-500 mb-2">$1,890.00</div>
                    <div className="text-sm text-gray-500 font-medium">12 overdue invoices</div>
                </div>
            </div>

            {/* 5. Trends & Actions Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                {/* Booking Trends Bar Chart Mockup */}
                <div className={`lg:col-span-2 p-6 rounded-2xl shadow-sm border flex flex-col h-[400px] transition-all ${isDark ? 'bg-[#111C44] border-gray-800' : 'bg-white border-gray-100'}`}>
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className={`text-lg font-black leading-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>Booking Trends</h3>
                            <p className="text-xs text-gray-400">Volume of services over the last 30 days</p>
                        </div>
                        <button className={`flex items-center gap-2 border px-3 py-1.5 rounded-lg text-sm font-bold transition-all ${isDark ? 'border-gray-700 text-gray-400 hover:bg-[#1B2559]' : 'border-gray-200 text-gray-700 hover:bg-gray-100'}`}>
                            Last 30 Days
                            <ChevronDown className="h-4 w-4" />
                        </button>
                    </div>

                    <div className="flex-1 flex items-end justify-between gap-1 mt-4">
                        {/* Mock bars */}
                        {[40, 30, 45, 60, 50, 75, 40, 55, 65, 45, 35, 80, 50, 60, 45].map((h, i) => (
                            <div key={i} className="flex flex-col items-center flex-1 group">
                                <div
                                    style={{ height: `${h}%` }}
                                    className={`w-full max-w-[12px] rounded-t-sm transition-all duration-500 ${i === 11 || i === 5 ? 'bg-blue-600 shadow-[0_0_10px_rgba(37,99,235,0.4)]' : (isDark ? 'bg-blue-900/40 group-hover:bg-blue-900/60' : 'bg-blue-100 group-hover:bg-blue-200')}`}
                                ></div>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between mt-6 text-[10px] text-gray-400 font-bold uppercase tracking-widest px-1">
                        <span>May 15</span>
                        <span>May 25</span>
                        <span>Jun 05</span>
                        <span>Jun 15</span>
                    </div>
                </div>

                {/* Pending Actions List */}
                <div className={`p-6 rounded-2xl shadow-sm border flex flex-col h-[400px] transition-all ${isDark ? 'bg-[#111C44] border-gray-800' : 'bg-white border-gray-100'}`}>
                    <div className="flex items-center gap-3 mb-8">
                        <AlertCircle className="h-6 w-6 text-orange-500" />
                        <h3 className={`text-lg font-black leading-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>Pending Actions</h3>
                    </div>

                    <div className="flex flex-col gap-4 overflow-y-auto pr-2 custom-scrollbar">
                        <Link href="/partner-management" className={`flex items-center justify-between border p-4 rounded-xl transition-all hover:scale-[1.02] hover:shadow-md ${isDark ? 'bg-[#1B2559] border-orange-900/30 hover:bg-[#232D65]' : 'border-[#FFF3E0] bg-[#FFF8F1] hover:bg-[#FFF3E6]'}`}>
                            <div className="flex items-center gap-3">
                                <div className="bg-orange-500 p-2 rounded-lg">
                                    <CheckCircle2 className="h-5 w-5 text-white" />
                                </div>
                                <div>
                                    <div className={`text-sm font-black ${isDark ? 'text-white' : 'text-gray-900'}`}>3 Partner Appro...</div>
                                    <div className="text-[10px] text-gray-400 font-medium">Pending initial review</div>
                                </div>
                            </div>
                            <span className="text-orange-600 text-[10px] font-black uppercase tracking-wider">Review</span>
                        </Link>

                        <Link href="/user-management" className={`flex items-center justify-between border p-4 rounded-xl transition-all hover:scale-[1.02] hover:shadow-md ${isDark ? 'bg-[#1B2559] border-blue-900/30 hover:bg-[#232D65]' : 'border-[#E3F2FD] bg-[#F1F9FF] hover:bg-[#EBF5FF]'}`}>
                            <div className="flex items-center gap-3">
                                <div className="bg-blue-600 p-2 rounded-lg text-white">
                                    <ShieldCheck className="h-5 w-5" />
                                </div>
                                <div>
                                    <div className={`text-sm font-black ${isDark ? 'text-white' : 'text-gray-900'}`}>5 KYC Verificati...</div>
                                    <div className="text-[10px] text-gray-400 font-medium">Identity checks required</div>
                                </div>
                            </div>
                            <span className="text-blue-600 text-[10px] font-black uppercase tracking-wider">Review</span>
                        </Link>

                        <Link href="/service-booking" className={`flex items-center justify-between border p-4 rounded-xl transition-all hover:scale-[1.02] hover:shadow-md ${isDark ? 'bg-[#1B2559] border-red-900/30 hover:bg-[#232D65]' : 'border-[#FEE2E2] bg-[#FFF5F5] hover:bg-[#FFF0F0]'}`}>
                            <div className="flex items-center gap-3">
                                <div className="bg-red-500 p-2 rounded-lg text-white">
                                    <AlertCircle className="h-5 w-5" />
                                </div>
                                <div>
                                    <div className={`text-sm font-black ${isDark ? 'text-white' : 'text-gray-900'}`}>2 Stuck Services</div>
                                    <div className="text-[10px] text-gray-400 font-medium">Delayed for &gt; 24 hours</div>
                                </div>
                            </div>
                            <span className="text-red-600 text-[10px] font-black uppercase tracking-wider">Resolve</span>
                        </Link>
                    </div>

                    <button className={`mt-auto flex items-center justify-center gap-2 text-sm font-bold py-4 border-t transition-colors ${isDark ? 'border-gray-800 text-gray-500 hover:text-blue-400' : 'border-gray-100 text-gray-400 hover:text-blue-600'}`}>
                        View all notifications
                        <ArrowRight className="h-4 w-4" />
                    </button>
                </div>
            </div>

            {/* 6. Quick Action Buttons */}
            <div>
                <div className="text-slate-500 font-black text-[10px] tracking-[0.2em] mb-4 uppercase">QUICK ACTIONS</div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Link href="/partner-management" className="flex items-center justify-center gap-3 h-14 rounded-xl bg-blue-600 text-white font-bold text-sm shadow-md transition-all hover:-translate-y-1 hover:bg-blue-700 active:scale-95">
                        <UserPlus className="h-5 w-5" />
                        Add New Partner
                    </Link>
                    <Link href="/inventory-management" className="flex items-center justify-center gap-3 h-14 rounded-xl bg-blue-600 text-white font-bold text-sm shadow-md transition-all hover:-translate-y-1 hover:bg-blue-700 active:scale-95">
                        <Package className="h-5 w-5" />
                        Add New Inventory
                    </Link>
                    <Link href="/add-role" className="flex items-center justify-center gap-3 h-14 rounded-xl bg-blue-600 text-white font-bold text-sm shadow-md transition-all hover:-translate-y-1 hover:bg-blue-700 active:scale-95">
                        <ShieldCheck className="h-5 w-5" />
                        Add New Role
                    </Link>
                </div>
            </div>

            {/* --- CALENDAR MODAL --- */}
            {isCalendarOpen && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 animate-in fade-in duration-300">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsCalendarOpen(false)}></div>
                    <div className={`relative w-full max-w-sm rounded-[32px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 ${isDark ? 'bg-[#111C44] border border-gray-800' : 'bg-white'}`}>
                        {/* Header */}
                        <div className="p-6 pb-4 flex items-center justify-between border-b border-gray-100 dark:border-gray-800">
                            <h3 className={`text-xl font-black ${isDark ? 'text-white' : 'text-[#2B3674]'}`}>
                                {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                            </h3>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
                                    className={`p-2 rounded-xl transition-all ${isDark ? 'hover:bg-[#1B2559] text-gray-400' : 'hover:bg-gray-50 text-gray-500'}`}
                                >
                                    <ChevronLeft size={20} strokeWidth={2.5} />
                                </button>
                                <button
                                    onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
                                    className={`p-2 rounded-xl transition-all ${isDark ? 'hover:bg-[#1B2559] text-gray-400' : 'hover:bg-gray-50 text-gray-500'}`}
                                >
                                    <ChevronRight size={20} strokeWidth={2.5} />
                                </button>
                                <button
                                    onClick={() => setIsCalendarOpen(false)}
                                    className="ml-2 p-2 rounded-xl bg-red-50 text-red-500 hover:bg-red-100 transition-all active:scale-95"
                                >
                                    <X size={20} strokeWidth={2.5} />
                                </button>
                            </div>
                        </div>

                        {/* Calendar Body */}
                        <div className="p-6">
                            <div className="grid grid-cols-7 mb-4">
                                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                                    <div key={day} className="text-center text-[10px] font-black text-[#A3AED0] uppercase tracking-widest leading-none">
                                        {day}
                                    </div>
                                ))}
                            </div>
                            <div className="grid grid-cols-7 gap-1">
                                {[...Array(firstDayOfMonth(currentDate.getFullYear(), currentDate.getMonth()))].map((_, i) => (
                                    <div key={`empty-${i}`} className="aspect-square"></div>
                                ))}
                                {[...Array(daysInMonth(currentDate.getFullYear(), currentDate.getMonth()))].map((_, i) => {
                                    const day = i + 1;
                                    const isToday = day === new Date().getDate() &&
                                        currentDate.getMonth() === new Date().getMonth() &&
                                        currentDate.getFullYear() === new Date().getFullYear();

                                    return (
                                        <button
                                            key={day}
                                            className={`aspect-square rounded-xl flex items-center justify-center text-sm font-bold transition-all active:scale-90
                                                ${isToday
                                                    ? 'bg-[#0070f3] text-white shadow-lg shadow-blue-500/30'
                                                    : (isDark ? 'text-white hover:bg-[#1B2559]' : 'text-[#2B3674] hover:bg-gray-50')
                                                }`}
                                        >
                                            {day}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="p-6 pt-0">
                            <button
                                onClick={() => setCurrentDate(new Date())}
                                className={`w-full py-3.5 rounded-2xl font-bold text-sm transition-all active:scale-[0.98] ${isDark ? 'bg-[#1B2559] text-white hover:bg-[#232D65]' : 'bg-[#F4F7FE] text-[#0070f3] hover:bg-blue-100'}`}
                            >
                                Back to Today
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
