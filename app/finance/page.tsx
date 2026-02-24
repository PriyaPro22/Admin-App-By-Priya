"use client";

import React, { useState } from "react";
import {
    Banknote,
    TrendingUp,
    TrendingDown,
    DollarSign,
    ArrowUpRight,
    ArrowDownLeft,
    Calendar,
    Filter,
    Download,
    CreditCard,
    Wallet,
    ArrowRight,
    MoreVertical,
    Search,
    CheckCircle2,
    Clock,
    AlertCircle
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";

export default function FinancePage() {
    const { theme } = useTheme();
    const isDark = theme === "dark";

    // Mock data for the dashboard
    const stats = [
        {
            title: "Total Revenue",
            value: "₹4,25,890",
            change: "+12.5%",
            isPositive: true,
            icon: DollarSign,
            color: "blue"
        },
        {
            title: "Active Subscriptions",
            value: "1,284",
            change: "+8.2%",
            isPositive: true,
            icon: TrendingUp,
            color: "emerald"
        },
        {
            title: "Pending Payouts",
            value: "₹45,210",
            change: "-3.1%",
            isPositive: false,
            icon: Clock,
            color: "amber"
        },
        {
            title: "Operational Costs",
            value: "₹82,400",
            change: "+2.4%",
            isPositive: false,
            icon: TrendingDown,
            color: "rose"
        }
    ];

    const transactions = [
        { id: "TXN-8901", user: "Rahul Sharma", amount: "₹2,499", status: "Completed", date: "23 Feb, 2026", type: "Credit" },
        { id: "TXN-8902", user: "Priya Patel", amount: "₹1,200", status: "Pending", date: "22 Feb, 2026", type: "Credit" },
        { id: "TXN-8903", user: "Amit Kumar", amount: "₹4,500", status: "Completed", date: "22 Feb, 2026", type: "Credit" },
        { id: "TXN-8904", user: "Vendor: CloudPaisa", amount: "₹12,000", status: "Failed", date: "21 Feb, 2026", type: "Debit" },
        { id: "TXN-8905", user: "Suresh Singh", amount: "₹899", status: "Completed", date: "21 Feb, 2026", type: "Credit" },
    ];

    return (
        <div className={`min-h-screen p-6 lg:p-10 transition-colors duration-300 ${isDark ? 'bg-[#0b1437] text-white' : 'bg-[#F4F7FE] text-[#2B3674]'}`}>

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className={`text-3xl font-extrabold tracking-tight ${isDark ? 'text-white' : 'text-[#2B3674]'}`}>
                        Finance Dashboard
                    </h1>
                    <p className="text-gray-500 mt-1 font-medium">Monitor your business performance and cash flow</p>
                </div>

                <div className="flex items-center gap-3">
                    <button className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold shadow-sm transition-all active:scale-95 ${isDark ? 'bg-[#111C44] text-white border border-gray-800' : 'bg-white text-[#707EAE] border border-gray-100'}`}>
                        <Calendar size={18} className="text-[#0070f3]" />
                        Last 30 Days
                    </button>
                    <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold bg-[#0070f3] text-white shadow-lg shadow-blue-500/20 transition-all hover:bg-blue-600 active:scale-95">
                        <Download size={18} />
                        Export Report
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat, idx) => (
                    <div
                        key={idx}
                        className={`p-6 rounded-3xl transition-all duration-300 hover:translate-y-[-4px] shadow-sm flex flex-col justify-between ${isDark ? 'bg-[#111C44] border border-gray-800' : 'bg-white'}`}
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className={`p-3 rounded-2xl ${stat.color === 'blue' ? 'bg-blue-100/50 text-blue-600' :
                                    stat.color === 'emerald' ? 'bg-emerald-100/50 text-emerald-600' :
                                        stat.color === 'amber' ? 'bg-amber-100/50 text-amber-600' :
                                            'bg-rose-100/50 text-rose-600'
                                }`}>
                                <stat.icon size={24} />
                            </div>
                            <div className={`flex items-center gap-1 text-sm font-bold ${stat.isPositive ? 'text-emerald-500' : 'text-rose-500'}`}>
                                {stat.isPositive ? <ArrowUpRight size={16} /> : <ArrowDownLeft size={16} />}
                                {stat.change}
                            </div>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">{stat.title}</p>
                            <h3 className={`text-2xl font-bold mt-1 ${isDark ? 'text-white' : 'text-[#2B3674]'}`}>{stat.value}</h3>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                {/* Main Chart Section */}
                <div className={`lg:col-span-2 p-8 rounded-3xl shadow-sm ${isDark ? 'bg-[#111C44] border border-gray-800' : 'bg-white'}`}>
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-[#2B3674]'}`}>Revenue Overview</h3>
                            <p className="text-sm text-gray-400 font-medium">Monthly performance analytics</p>
                        </div>
                        <div className="flex items-center gap-2 bg-[#F4F7FE] dark:bg-[#0b1437] p-1 rounded-xl">
                            <button className="px-3 py-1.5 text-xs font-bold rounded-lg bg-white dark:bg-[#1B254B] text-[#0070f3] shadow-sm">Revenue</button>
                            <button className="px-3 py-1.5 text-xs font-bold rounded-lg text-gray-500">Expenses</button>
                        </div>
                    </div>

                    {/* Simulated Chart */}
                    <div className="h-[250px] w-full flex items-end gap-3 px-2">
                        {[40, 65, 45, 90, 75, 55, 110, 85, 95, 120, 100, 115].map((val, i) => (
                            <div key={i} className="flex-1 flex flex-col items-center group relative">
                                <div
                                    className="w-full bg-[#0070f3]/20 hover:bg-[#0070f3] rounded-t-lg transition-all duration-500 cursor-pointer"
                                    style={{ height: `${val * 1.5}px` }}
                                >
                                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-[#2B3674] text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                        ₹{val}k
                                    </div>
                                </div>
                                <span className="text-[10px] text-gray-400 mt-2 font-bold">{['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'][i]}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Sidebar FinTech Cards */}
                <div className="space-y-6">
                    {/* Virtual Card */}
                    <div className="relative h-56 rounded-3xl bg-gradient-to-br from-[#0070f3] to-[#12c2e9] p-8 text-white shadow-xl shadow-blue-500/20 overflow-hidden group">
                        <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>
                        <div className="relative z-10 flex flex-col justify-between h-full">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-white/70 text-xs font-bold uppercase tracking-widest">Main Balance</p>
                                    <h4 className="text-3xl font-extrabold mt-1">₹12,45,280</h4>
                                </div>
                                <div className="bg-white/20 p-2 rounded-xl backdrop-blur-md">
                                    <Banknote size={20} />
                                </div>
                            </div>
                            <div className="flex justify-between items-end">
                                <div>
                                    <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest">Account Number</p>
                                    <p className="font-mono tracking-widest mt-1">•••• •••• •••• 4590</p>
                                </div>
                                <div className="flex -space-x-2">
                                    <div className="w-8 h-8 rounded-full bg-orange-400/80 border border-white/20"></div>
                                    <div className="w-8 h-8 rounded-full bg-rose-400/80 border border-white/20"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className={`p-6 rounded-3xl shadow-sm ${isDark ? 'bg-[#111C44] border border-gray-800' : 'bg-white'}`}>
                        <h4 className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-[#2B3674]'}`}>Quick Transfers</h4>
                        <div className="space-y-4">
                            {[
                                { name: "Vendor Payment", icon: CreditCard, color: "blue" },
                                { name: "Settlement", icon: Wallet, color: "emerald" },
                                { name: "Refunds", icon: AlertCircle, color: "rose" }
                            ].map((action, i) => (
                                <button
                                    key={i}
                                    className={`w-full flex items-center justify-between p-3 rounded-2xl transition-all hover:bg-gray-50 dark:hover:bg-[#1B254B] border border-transparent hover:border-gray-100 dark:hover:border-gray-800`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2.5 rounded-xl bg-${action.color}-100/50 text-${action.color}-600`}>
                                            <action.icon size={18} />
                                        </div>
                                        <span className="text-sm font-bold text-gray-500">{action.name}</span>
                                    </div>
                                    <ArrowRight size={16} className="text-gray-300" />
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Transactions Table */}
            <div className={`p-8 rounded-3xl shadow-sm ${isDark ? 'bg-[#111C44] border border-gray-800' : 'bg-white'}`}>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-[#2B3674]'}`}>Recent Transactions</h3>
                        <p className="text-sm text-gray-400 font-medium tracking-tight">Real-time status of your financial movements</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className={`relative flex items-center ${isDark ? 'bg-[#0b1437]' : 'bg-[#F4F7FE]'} rounded-xl px-3 py-2`}>
                            <Search size={16} className="text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search txns..."
                                className="bg-transparent border-none outline-none text-xs ml-2 font-medium w-40"
                            />
                        </div>
                        <button className={`p-2.5 rounded-xl border ${isDark ? 'bg-[#1B254B] border-gray-700' : 'bg-white border-gray-100'} hover:bg-gray-50 dark:hover:bg-[#111C44] transition-colors`}>
                            <Filter size={18} className="text-[#0070f3]" />
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="text-left border-b border-gray-100 dark:border-gray-800">
                                <th className="pb-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Transaction ID</th>
                                <th className="pb-4 text-xs font-bold text-gray-400 uppercase tracking-widest pl-4">Reciever / Sender</th>
                                <th className="pb-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Status</th>
                                <th className="pb-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Date</th>
                                <th className="pb-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">Amount</th>
                                <th className="pb-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                            {transactions.map((txn, i) => (
                                <tr key={i} className="group hover:bg-gray-50/50 dark:hover:bg-[#1B254B]/30 transition-colors">
                                    <td className="py-5 font-bold text-sm tracking-tight">{txn.id}</td>
                                    <td className="py-5 pl-4">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold ${txn.type === 'Credit' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'
                                                }`}>
                                                {txn.user.charAt(0)}
                                            </div>
                                            <span className={`text-sm font-bold ${isDark ? 'text-white' : 'text-[#2B3674]'}`}>{txn.user}</span>
                                        </div>
                                    </td>
                                    <td className="py-5">
                                        <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full w-fit text-[11px] font-bold ${txn.status === 'Completed' ? 'bg-emerald-100/50 text-emerald-600' :
                                                txn.status === 'Pending' ? 'bg-amber-100/50 text-amber-600' :
                                                    'bg-rose-100/50 text-rose-600'
                                            }`}>
                                            {txn.status === 'Completed' && <CheckCircle2 size={12} />}
                                            {txn.status === 'Pending' && <Clock size={12} />}
                                            {txn.status === 'Failed' && <AlertCircle size={12} />}
                                            {txn.status}
                                        </div>
                                    </td>
                                    <td className="py-5 text-sm font-semibold text-gray-500">{txn.date}</td>
                                    <td className={`py-5 text-right font-extrabold text-sm ${txn.type === 'Credit' ? (isDark ? 'text-white' : 'text-[#2B3674]') : 'text-rose-500'
                                        }`}>
                                        {txn.type === 'Credit' ? `+ ${txn.amount}` : `- ${txn.amount}`}
                                    </td>
                                    <td className="py-5 text-center">
                                        <button className="p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <MoreVertical size={16} className="text-gray-400" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
