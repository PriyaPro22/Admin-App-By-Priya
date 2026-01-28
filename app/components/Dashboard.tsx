"use client";

import React from "react";
import { Users, Briefcase, ShoppingBag, Clock } from "lucide-react";

// Mock Data for "New Register Users" table
const users = [
    { id: 1, profile: "", name: "prince", number: "+918954539547", location: "1/26, Sector..." },
    { id: 2, profile: "", name: "Om", number: "+911234567891", location: "34, Polytechnic..." },
    { id: 3, profile: "", name: "Vivek yadav", number: "+917307229576", location: "74WH+W8..." },
    { id: 4, profile: "", name: "Mr. Programmer", number: "+919369456696", location: "5936+JRP..." },
    { id: 5, profile: "", name: "Nikhil verma", number: "+917985718679", location: "Plot No. 02..." },
];

const Dashboard = () => {
    return (
        <div className="mx-auto max-w-5xl text-gray-800">

            {/* 1. Quick Starts */}
            <section className="mb-8">
                <h2 className="mb-4 text-center text-xl font-bold rounded-lg border-2 border-blue-900 py-1 bg-white">
                    Quick Starts
                </h2>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard label="Total Users" value="9" />
                    <StatCard label="Total Partners" value="0" />
                    <StatCard label="Total Services" value="0" />
                    <StatCard label="Pending" value="0" />
                </div>
            </section>

            {/* 2. Quick Action Buttons */}
            <section className="mb-8">
                <h2 className="mb-4 text-center text-xl font-bold rounded-lg border-2 border-blue-900 py-1 bg-white">
                    Quick Action Buttons
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <DashboardButton label="User App Manage" />
                    <DashboardButton label="Partner App Manage" />
                    <DashboardButton label="Categorys Manage" />
                    <DashboardButton label="Services Manage" />
                </div>
            </section>

            {/* 3. New Register Users */}
            <section className="mb-8">
                <h2 className="mb-2 text-center text-xl font-bold rounded-lg border-2 border-blue-900 py-1 bg-white">
                    New Register Users
                </h2>
                <div className="overflow-x-auto rounded-lg shadow border border-gray-200 bg-gray-200">
                    <table className="min-w-full text-left text-sm whitespace-nowrap">
                        <thead className="bg-gray-300 text-gray-700 font-bold uppercase tracking-wider border-b border-gray-400">
                            <tr>
                                <th className="px-4 py-3">SN.</th>
                                <th className="px-4 py-3">Profile</th>
                                <th className="px-4 py-3">User name</th>
                                <th className="px-4 py-3">Number</th>
                                <th className="px-4 py-3">Location</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-300 font-bold text-gray-800">
                            {users.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-100/50">
                                    <td className="px-4 py-3">{user.id}</td>
                                    <td className="px-4 py-3">
                                        <div className="h-8 w-8 rounded-full bg-gray-400"></div> {/* Placeholder for profile */}
                                    </td>
                                    <td className="px-4 py-3">{user.name}</td>
                                    <td className="px-4 py-3">{user.number}</td>
                                    <td className="px-4 py-3 text-gray-600 font-normal">{user.location}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>

            {/* 3. New Register Partners Button */}
            <section className="mb-8">
                <h2 className="mb-4 text-center text-xl font-bold rounded-lg border-2 border-blue-900 py-1 bg-white">
                    New Register Partners
                </h2>
                {/* Potentially a table here too, but image cuts off. Just header implies section. */}
            </section>
        </div>
    );
};

const StatCard = ({ label, value }: { label: string; value: string }) => (
    <div className="flex flex-col justify-between rounded-xl bg-gray-200 p-4 h-32 shadow-sm font-bold text-gray-800">
        <span className="text-4xl">{value}</span>
        <span className="text-lg">{label}</span>
    </div>
);

const DashboardButton = ({ label }: { label: string }) => (
    <button className="flex h-32 w-full items-center justify-center rounded-xl bg-gray-200 text-lg font-bold text-gray-800 shadow-sm transition-transform hover:scale-105 active:scale-95">
        {label}
    </button>
);

export default Dashboard;
