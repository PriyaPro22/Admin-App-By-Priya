"use client";

import React, { useState, useEffect } from "react";
import {
    CreditCard,
    ArrowUpRight,
    TrendingUp,
    Users,
    Search,
    Filter,
    Download,
    Calendar,
    ChevronRight,
    MoreVertical,
    CheckCircle2,
    Clock,
    AlertCircle
} from "lucide-react";
import { useTheme } from "../../../context/ThemeContext";

const RegistrationFeePage = () => {
    const { theme } = useTheme();
    const isDark = theme === "dark";
    const [searchQuery, setSearchQuery] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [partners, setPartners] = useState<any[]>([]);

    // Fee Settings State
    const [standardFee, setStandardFee] = useState("2500");
    const [premiumFee, setPremiumFee] = useState("5000");
    const [isSaving, setIsSaving] = useState(false);

  const fetchPartners = async () => {

  try {

    setIsLoading(true);

    const res = await fetch(
      "https://live.bijliwalaaya.in/api/partner/admin/all-partners",
      {
        headers: { "x-api-token": "super_secure_token" },
      }
    );

    const json = await res.json();

    if (json.success && Array.isArray(json.data)) {

      let revenue = 0;
      let pending = 0;
      let pendingCount = 0;

      const formattedPartners = json.data.map((p) => {

        const isPaid = p.personal_details?.status === "active";
        // const isPremium = p.personal_details?.experience > 5;
        const isPremium = p.personal_details?.partner_type === "premium";

        const fee = isPremium ? Number(premiumFee) : Number(standardFee);

        if (isPaid) {
          revenue += fee;
        } else {
          pending += fee;
          pendingCount++;
        }

        return {
          id: p._id,
          name: p.personal_details?.name || "Unknown",
          date: p.personal_details?.registration_date ?? new Date(),
         amount: `₹${fee}`,
          status: isPaid ? "Paid" : "Pending",
          type: isPremium ? "Premium" : "Standard"
        };

      });

      setPartners(formattedPartners);
      setTotalRevenue(revenue);
      setPendingRevenue(pending);
      setPendingPartners(pendingCount);

    }

  } catch (err) {
    console.error("Failed to fetch partners", err);
  } finally {
    setIsLoading(false);
  }

};  


const fetchRegistrationFee = async () => {
  try {

    const res = await fetch(
      "https://live.bijliwalaaya.in/api/registration-fee"
    );

    const result = await res.json();

    console.log("Fee API:", result);

    if (result.success && result.data) {

      const fee = Number(result.data.amount ?? 0);

      setStandardFee(fee);
      setPremiumFee(fee);

      fetchPartners();
    }

  } catch (error) {
    console.error("Fee fetch error:", error);
  }
};

useEffect(() => {
  fetchRegistrationFee();
}, []);

const handleSaveFees = async () => {

  try {

    setIsSaving(true);

    const res = await fetch(
      "https://live.bijliwalaaya.in/api/registration-fee",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-token": "super_secure_token"
        },
        body: JSON.stringify({
          standardFee: Number(standardFee),
          premiumFee: Number(premiumFee)
        })
      }
    );

    const result = await res.json();

    if (result.success) {

      alert("✅ Registration fee updated");

      fetchRegistrationFee(); // refresh

    } else {
      alert("❌ Failed to update fee");
    }

  } catch (error) {
    console.error(error);
  } finally {
    setIsSaving(false);
  }

};

const deleteRegistrationFee = async () => {

  if (!confirm("Delete registration fee?")) return;

  try {

    const res = await fetch(
      "https://live.bijliwalaaya.in/api/registration-fee",
      {
        method: "DELETE",
        headers: {
          "x-api-token": "super_secure_token"
        }
      }
    );

    const result = await res.json();

    if (result.success) {

      alert("✅ Fee deleted");

      fetchRegistrationFee(); // reload data

    }

  } catch (error) {
    console.error(error);
  }

};



const [totalRevenue, setTotalRevenue] = useState(0);
const [pendingRevenue, setPendingRevenue] = useState(0);
const [pendingPartners, setPendingPartners] = useState(0);


const metrics = [
  {
    title: "Total Revenue",
    value: `₹${totalRevenue}`,
    trend: "",
    icon: TrendingUp,
    color: "text-green-500",
    bg: "bg-green-500/10"
  },
  {
    title: "Active Partners",
    value: partners.length.toString(),
    trend: "",
    icon: Users,
    color: "text-blue-500",
    bg: "bg-blue-500/10"
  },
  {
    title: "Pending Fees",
    value: `₹${pendingRevenue}`,
    trend: `${pendingPartners} Partners`,
    icon: Clock,
    color: "text-orange-500",
    bg: "bg-orange-500/10"
  }
];

    return (
        <div className={`min-h-screen p-4 md:p-8 transition-all duration-300 ${isDark ? 'bg-[#0B1437] text-white' : 'bg-[#F4F7FE] text-gray-800'}`}>
            <style jsx global>{`
                .glass-card {
                    background: ${isDark ? 'rgba(17, 28, 68, 0.7)' : 'rgba(255, 255, 255, 0.7)'};
                    backdrop-filter: blur(20px);
                    -webkit-backdrop-filter: blur(20px);
                    border: 1px solid ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.3)'};
                    box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.07);
                }
                .glass-input {
                    background: ${isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)'} !important;
                    border: 1px solid ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'} !important;
                }
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: ${isDark ? '#1B2559' : '#E2E8F0'};
                    border-radius: 10px;
                }
            `}</style>

            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                <div>
                    <h1 className="text-4xl font-black tracking-tight mb-2">Registration Fees</h1>
                    <p className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        Configure and monitor partner onboarding payments.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all hover:scale-105 active:scale-95 ${isDark ? 'bg-white text-slate-900' : 'bg-slate-900 text-white'}`}>
                        <Download className="h-4 w-4" />
                        Export Report
                    </button>
                </div>
            </div>

            {/* Fee Configuration & Metrics */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-10">
                {/* Fee Settings Card */}
                <div className="lg:col-span-2 glass-card p-8 rounded-[2.5rem] relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                        <CreditCard className="h-32 w-32 -rotate-12" />
                    </div>

                    <h3 className="text-2xl font-black mb-6 flex items-center gap-3">
                        <CreditCard className="h-6 w-6 text-blue-500" />
                        Fee Configuration
                    </h3>

                    <div className="grid grid-cols-2 gap-6 mb-8">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Standard Fee</label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-gray-400">₹</span>
                                <input
                                    type="text"
                                    value={standardFee}
                                    onChange={(e) => setStandardFee(e.target.value)}
                                    className="w-full pl-8 pr-4 py-3 rounded-xl glass-input font-black text-lg focus:ring-2 focus:ring-blue-500/50 transition-all outline-none"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Premium Fee</label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-gray-400">₹</span>
                                <input
                                    type="text"
                                    value={premiumFee}
                                    onChange={(e) => setPremiumFee(e.target.value)}
                                    className="w-full pl-8 pr-4 py-3 rounded-xl glass-input font-black text-lg focus:ring-2 focus:ring-blue-500/50 transition-all outline-none"
                                />
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={handleSaveFees}
                        disabled={isSaving}
                        className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black text-lg shadow-xl shadow-blue-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
                    >
                        {isSaving ? "Saving Settings..." : "Save Configuration"}
                    </button>
                </div>

                {/* Metrics */}
                <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {metrics.map((metric, i) => (
                        <div key={i} className="glass-card p-6 rounded-[2rem] flex items-center gap-5 group transition-all hover:scale-[1.02]">
                            <div className={`h-14 w-14 rounded-2xl ${metric.bg} flex items-center justify-center`}>
                                <metric.icon className={`h-7 w-7 ${metric.color}`} />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">{metric.title}</p>
                                <div className="flex items-baseline gap-2">
                                    <h3 className="text-2xl font-black tracking-tight">{metric.value}</h3>
                                    <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-md ${metric.color} bg-current/10`}>
                                        {metric.trend}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Main Content Area */}
            <div className="glass-card rounded-[2.5rem] overflow-hidden border">
                {/* Table Toolbar */}
                <div className="p-6 md:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-white/10">
                    <div className="relative flex-1 max-w-lg">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by partner name..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className={`w-full h-14 pl-12 pr-6 rounded-[1.5rem] glass-input outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-semibold ${isDark ? 'text-white placeholder:text-gray-500' : 'text-gray-800 placeholder:text-gray-400'}`}
                        />
                    </div>
                    <div className="flex items-center gap-4">
                        <button className={`p-4 rounded-2xl transition-all hover:bg-white/5 ${isDark ? 'text-gray-400' : 'text-gray-600 bg-gray-50'}`}>
                            <Filter className="h-5 w-5" />
                        </button>
                        <button className={`flex items-center gap-2 px-6 py-4 rounded-[1.5rem] font-bold text-sm transition-all hover:scale-105 active:scale-95 ${isDark ? 'bg-white/5 text-white border border-white/10' : 'bg-white border border-gray-100 text-gray-900 shadow-sm'}`}>
                            <Calendar className="h-4 w-4" />
                            Select Date Range
                        </button>
                    </div>
                </div>

                {/* Table Container */}
                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className={`${isDark ? 'text-gray-400' : 'text-gray-500'} text-[10px] font-black uppercase tracking-[0.2em]`}>
                                <th className="px-8 py-6">Partner Details</th>
                                <th className="px-8 py-6">Type</th>
                                <th className="px-8 py-6">Amount Paid</th>
                                <th className="px-8 py-6">Status</th>
                                <th className="px-8 py-6">Reg. Date</th>
                                <th className="px-8 py-6 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={6} className="px-8 py-20 text-center font-bold text-gray-400 animate-pulse">
                                        Fetching registration data...
                                    </td>
                                </tr>
                            ) : partners.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase())).map((partner) => (
                                <tr key={partner.id} className="group hover:bg-white/[0.02] transition-colors">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-full bg-blue-500/20 flex items-center justify-center font-bold text-blue-500">
                                                {partner.name.charAt(0)}
                                            </div>
                                            <span className="font-bold tracking-tight text-lg">{partner.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider ${partner.type === 'Premium' ? (isDark ? 'bg-purple-500/10 text-purple-400' : 'bg-purple-50 text-purple-600') : (isDark ? 'bg-blue-500/10 text-blue-400' : 'bg-blue-50 text-blue-600')}`}>
                                            {partner.type}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 font-black text-xl text-blue-600 dark:text-blue-400">
                                        {partner.amount}
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${partner.status === 'Paid'
                                            ? (isDark ? 'bg-green-500/10 text-green-400' : 'bg-green-50 text-green-600')
                                            : (isDark ? 'bg-orange-500/10 text-orange-400' : 'bg-orange-50 text-orange-600')
                                            }`}>
                                            {partner.status === 'Paid' ? <CheckCircle2 className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                                            {partner.status}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-sm font-bold text-gray-400">
                                        {new Date(partner.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <button className={`p-2 rounded-lg transition-colors hover:bg-white/10 ${isDark ? 'text-gray-400' : 'text-gray-400 hover:text-gray-900'}`}>
                                            <MoreVertical className="h-5 w-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Footer / Pagination */}
                <div className="p-8 border-t border-white/5 flex items-center justify-between">
                    <p className="text-sm font-bold text-gray-400 tracking-tight">
                        Showing <span className={`${isDark ? 'text-white' : 'text-gray-900'}`}>{partners.length}</span> results
                    </p>
                    <div className="flex items-center gap-2">
                        <button className={`h-10 px-4 rounded-xl font-bold text-sm transition-all ${isDark ? 'hover:bg-white/5 text-gray-500' : 'hover:bg-black/5 text-gray-400'}`}>Previous</button>
                        <button className={`h-10 px-4 rounded-xl font-bold text-sm transition-all ${isDark ? 'hover:bg-white/5 text-white' : 'hover:bg-black/5 text-gray-900'}`}>Next</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegistrationFeePage;
