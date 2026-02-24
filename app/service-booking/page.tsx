"use client";

import React, { useState } from "react";
import {
    Wrench,
    Calendar,
    Clock,
    CheckCircle2,
    AlertCircle,
    Search,
    Filter,
    Plus,
    MapPin,
    Phone,
    User,
    ChevronRight,
    MoreVertical,
    Activity,
    Layers,
    ArrowRight,
    Loader2,
    Check
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import toast, { Toaster } from "react-hot-toast";

export default function ServiceManagementPage() {
    const { theme } = useTheme();
    const isDark = theme === "dark";

    // Form states
    const [formData, setFormData] = useState({
        fullName: "",
        phone: "",
        location: "",
        house: "",
        street: "",
        city: "",
        state: "",
        pincode: "",
        mainCategory: "",
        subCategory: "",
        contactMethod: "Phone"
    });
    const [loading, setLoading] = useState(false);
    const [gettingLocation, setGettingLocation] = useState(false);

    const stats = [
        { title: "Total Bookings", value: "248", icon: Calendar, color: "blue", change: "+12%" },
        { title: "In Progress", value: "42", icon: Activity, color: "amber", change: "5 active" },
        { title: "Completed", value: "194", icon: CheckCircle2, color: "emerald", change: "98% rate" },
        { title: "Urgent", value: "12", icon: AlertCircle, color: "rose", change: "High priority" }
    ];

    const recentBookings = [
        { id: "BOK-2023", customer: "Vikram Mehta", service: "AC Repair", status: "In Progress", date: "Today, 11:30 AM" },
        { id: "BOK-2022", customer: "Suman Rao", service: "Full House Cleaning", status: "Completed", date: "Today, 09:15 AM" },
        { id: "BOK-2021", customer: "Anil Kapoor", service: "Electrical Wiring", status: "Pending", date: "Yesterday" },
    ];

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleBooking = async () => {
        if (!formData.fullName || !formData.phone || !formData.mainCategory) {
            toast.error("Please fill all required fields");
            return;
        }
        setLoading(true);
        // Simulate API
        setTimeout(() => {
            setLoading(false);
            toast.success("Service Booked Successfully!");
            setFormData({
                fullName: "", phone: "", location: "", house: "", street: "", city: "", state: "", pincode: "", mainCategory: "", subCategory: "", contactMethod: "Phone"
            });
        }, 1500);
    };

    const getCurrentLocation = () => {
        setGettingLocation(true);
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                setFormData(prev => ({
                    ...prev,
                    location: `${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`
                }));
                setGettingLocation(false);
                toast.success("Location Pinpointed!");
            },
            () => {
                setGettingLocation(false);
                toast.error("Location Access Denied");
            }
        );
    };

    return (
        <div className={`min-h-screen p-6 lg:p-10 transition-colors duration-300 ${isDark ? 'bg-[#0b1437] text-white' : 'bg-[#F4F7FE] text-[#2B3674]'}`}>
            <Toaster position="top-right" />

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
                <div>
                    <h1 className={`text-3xl font-extrabold tracking-tight ${isDark ? 'text-white' : 'text-[#2B3674]'}`}>
                        Service Management
                    </h1>
                    <p className="text-gray-500 mt-1 font-medium">Handle service requests, bookings, and field operations</p>
                </div>

                <div className="flex items-center gap-3">
                    <button className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold shadow-sm transition-all active:scale-95 ${isDark ? 'bg-[#111C44] text-white border border-gray-800' : 'bg-white text-[#707EAE] border border-gray-100'}`}>
                        <Filter size={18} className="text-[#0070f3]" />
                        Filters
                    </button>
                    <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold bg-[#0070f3] text-white shadow-lg shadow-blue-500/20 transition-all hover:bg-blue-600 active:scale-95">
                        <Plus size={18} />
                        Quick Action
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                {stats.map((stat, idx) => (
                    <div
                        key={idx}
                        className={`p-6 rounded-[30px] shadow-sm border ${isDark ? 'bg-[#111C44] border-gray-800' : 'bg-white border-transparent'} transition-all hover:translate-y-[-4px]`}
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className={`p-3 rounded-2xl ${stat.color === 'blue' ? 'bg-blue-100/50 text-blue-600' :
                                    stat.color === 'emerald' ? 'bg-emerald-100/50 text-emerald-600' :
                                        stat.color === 'amber' ? 'bg-amber-100/50 text-amber-600' :
                                            'bg-rose-100/50 text-rose-600'
                                }`}>
                                <stat.icon size={22} strokeWidth={2.5} />
                            </div>
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{stat.change}</span>
                        </div>
                        <p className="text-sm font-bold text-gray-400 uppercase mb-1 tracking-tight">{stat.title}</p>
                        <h3 className={`text-2xl font-black ${isDark ? 'text-white' : 'text-[#2B3674]'}`}>{stat.value}</h3>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                {/* Left Column: Booking Form */}
                <div className="lg:col-span-7">
                    <div className={`p-8 rounded-[35px] shadow-sm border ${isDark ? 'bg-[#111C44] border-gray-800' : 'bg-white border-transparent'}`}>
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-12 h-12 bg-[#0070f3]/10 text-[#0070f3] rounded-2xl flex items-center justify-center">
                                <Wrench size={24} />
                            </div>
                            <div>
                                <h2 className={`text-xl font-black ${isDark ? 'text-white' : 'text-[#2B3674]'}`}>Direct Service Booking</h2>
                                <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">Instant Provisioning Tool</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            {/* Full Name */}
                            <div className="space-y-2">
                                <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Customer Full Name *</label>
                                <div className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl border-2 transition-all ${isDark ? 'bg-[#0b1437] border-gray-800 focus-within:border-blue-500' : 'bg-[#F4F7FE] border-transparent focus-within:border-blue-500'}`}>
                                    <User size={18} className="text-gray-400" />
                                    <input
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={handleChange}
                                        placeholder="Enter name"
                                        className="bg-transparent border-none outline-none text-sm font-bold w-full"
                                    />
                                </div>
                            </div>

                            {/* Phone */}
                            <div className="space-y-2">
                                <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Contact Number *</label>
                                <div className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl border-2 transition-all ${isDark ? 'bg-[#0b1437] border-gray-800 focus-within:border-blue-500' : 'bg-[#F4F7FE] border-transparent focus-within:border-blue-500'}`}>
                                    <Phone size={18} className="text-gray-400" />
                                    <input
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        placeholder="+91 00000 00000"
                                        className="bg-transparent border-none outline-none text-sm font-bold w-full"
                                    />
                                </div>
                            </div>

                            {/* Main Category */}
                            <div className="space-y-2">
                                <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Service Type *</label>
                                <div className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl border-2 transition-all ${isDark ? 'bg-[#0b1437] border-gray-800 focus-within:border-blue-500' : 'bg-[#F4F7FE] border-transparent focus-within:border-blue-500'}`}>
                                    <Layers size={18} className="text-gray-400" />
                                    <select
                                        name="mainCategory"
                                        value={formData.mainCategory}
                                        onChange={handleChange}
                                        className="bg-transparent border-none outline-none text-sm font-bold w-full appearance-none cursor-pointer"
                                    >
                                        <option value="">Select Category</option>
                                        <option value="AC">Air Conditioning</option>
                                        <option value="Plumbing">Plumbing Services</option>
                                        <option value="Cleaning">Deep Cleaning</option>
                                        <option value="Electrical">Electrical Works</option>
                                    </select>
                                </div>
                            </div>

                            {/* Location Button */}
                            <div className="space-y-2">
                                <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Geo-Location Pin</label>
                                <button
                                    onClick={getCurrentLocation}
                                    disabled={gettingLocation}
                                    className={`w-full flex items-center justify-center gap-3 py-3.5 rounded-2xl font-bold text-sm border-2 transition-all active:scale-95 ${formData.location
                                            ? 'bg-emerald-500/10 border-emerald-500 text-emerald-600'
                                            : isDark ? 'bg-[#0b1437] border-gray-800 text-gray-400 hover:border-blue-500 hover:text-blue-400' : 'bg-[#F4F7FE] border-dashed border-gray-300 text-gray-400 hover:border-blue-500 hover:text-blue-500'
                                        }`}
                                >
                                    {gettingLocation ? <Loader2 size={18} className="animate-spin" /> : formData.location ? <Check size={18} /> : <MapPin size={18} />}
                                    {formData.location || (gettingLocation ? "Detecting..." : "Detect Current Location")}
                                </button>
                            </div>
                        </div>

                        <div className="space-y-4 mb-8">
                            <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Full Service Address</label>
                            <input
                                name="house"
                                value={formData.house}
                                onChange={handleChange}
                                placeholder="Flat/House No., Building Name"
                                className={`w-full px-6 py-4 rounded-2xl font-bold outline-none border-2 transition-all ${isDark ? 'bg-[#0b1437] border-gray-800 focus:border-blue-500' : 'bg-[#F4F7FE] border-transparent focus:border-blue-500'}`}
                            />
                            <div className="grid grid-cols-2 gap-4">
                                <input
                                    name="city"
                                    value={formData.city}
                                    onChange={handleChange}
                                    placeholder="City"
                                    className={`w-full px-6 py-4 rounded-2xl font-bold outline-none border-2 transition-all ${isDark ? 'bg-[#0b1437] border-gray-800 focus:border-blue-500' : 'bg-[#F4F7FE] border-transparent focus:border-blue-500'}`}
                                />
                                <input
                                    name="pincode"
                                    value={formData.pincode}
                                    onChange={handleChange}
                                    placeholder="Pincode"
                                    className={`w-full px-6 py-4 rounded-2xl font-bold outline-none border-2 transition-all ${isDark ? 'bg-[#0b1437] border-gray-800 focus:border-blue-500' : 'bg-[#F4F7FE] border-transparent focus:border-blue-500'}`}
                                />
                            </div>
                        </div>

                        <button
                            onClick={handleBooking}
                            disabled={loading}
                            className="w-full bg-[#0070f3] text-white py-5 rounded-[22px] font-black text-lg shadow-xl shadow-blue-500/30 hover:bg-blue-600 active:scale-[0.98] transition-all flex items-center justify-center gap-3"
                        >
                            {loading ? <Loader2 className="animate-spin" size={24} /> : <Plus size={24} strokeWidth={3} />}
                            {loading ? "PROCESSING BOOKING..." : "CONFIRM & BOOK SERVICE"}
                        </button>
                    </div>
                </div>

                {/* Right Column: Recent Activity & Calendar */}
                <div className="lg:col-span-5 flex flex-col gap-8">

                    {/* Quick Schedule */}
                    <div className={`p-8 rounded-[35px] shadow-sm border ${isDark ? 'bg-[#111C44] border-gray-800' : 'bg-white border-transparent'}`}>
                        <h3 className={`text-lg font-black mb-6 ${isDark ? 'text-white' : 'text-[#2B3674]'}`}>Active Service Track</h3>
                        <div className="space-y-5">
                            {recentBookings.map((booking, i) => (
                                <div key={i} className="group flex items-center justify-between p-4 rounded-2xl border border-dashed border-gray-200 dark:border-gray-800 hover:border-blue-500/50 transition-all cursor-pointer">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs ${booking.status === 'Completed' ? 'bg-emerald-100 text-emerald-600' :
                                                booking.status === 'In Progress' ? 'bg-blue-100 text-blue-600' : 'bg-amber-100 text-amber-600'
                                            }`}>
                                            {booking.customer.charAt(0)}
                                        </div>
                                        <div>
                                            <p className={`font-bold text-sm ${isDark ? 'text-white' : 'text-[#2B3674]'}`}>{booking.customer}</p>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{booking.service}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className={`text-[10px] font-black px-2 py-1 rounded-lg ${booking.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-500' :
                                                booking.status === 'In Progress' ? 'bg-blue-500/10 text-blue-500' : 'bg-amber-500/10 text-amber-500'
                                            }`}>{booking.status}</p>
                                        <p className="text-[10px] text-gray-400 font-bold mt-1 uppercase">{booking.date}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <button className="w-full mt-6 py-4 text-[#0070f3] text-sm font-black border-2 border-dashed border-[#0070f3]/30 rounded-2xl hover:bg-[#0070f3]/5 transition-all flex items-center justify-center gap-2">
                            View All Bookings <ArrowRight size={16} />
                        </button>
                    </div>

                    {/* Operational Insights */}
                    <div className="p-8 rounded-[35px] bg-gradient-to-br from-indigo-900 to-[#111C44] text-white shadow-xl shadow-indigo-500/20">
                        <div className="flex items-center gap-3 mb-6">
                            <Clock className="text-blue-400" size={24} />
                            <h3 className="text-xl font-bold">Field Insights</h3>
                        </div>
                        <p className="text-white/60 text-sm font-medium leading-relaxed mb-6">
                            Average service time in your region is currently <strong>42 minutes</strong>. High demand for <span className="text-blue-400">AC Repair</span> in West Mumbai.
                        </p>
                        <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl">
                            <div className="flex items-center gap-3 text-xs font-bold">
                                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></div>
                                Field Partners Online
                            </div>
                            <span className="text-xl font-black">18</span>
                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
}
