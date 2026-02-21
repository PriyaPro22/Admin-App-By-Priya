"use client";

import React from "react";
import Link from "next/link";
import { Users, Smartphone, Search, Image, CreditCard, FileX, FileText } from "lucide-react";

export default function UserManagementPage() {
    const modules = [
       
        { name: "Search Keywords", href: "/user-management/search-keywords", icon: Search, color: "text-purple-600", bg: "bg-purple-50" },
        { name: "Banner Image", href: "/user-management/banner-image", icon: Image, color: "text-orange-600", bg: "bg-orange-50" },
        { name: "Advance Payment", href: "/user-management/advance-payment", icon: CreditCard, color: "text-indigo-600", bg: "bg-indigo-50" },
        { name: "Cancellation Form", href: "/user-management/cancellation-form", icon: FileX, color: "text-red-600", bg: "bg-red-50" },
         { name: "Cancellation Policy", href: "/user-management/cancellation-policy", icon: FileText, color: "text-red-600", bg: "bg-red-50" },
          { name: "Offers", href: "/user-management/offers", icon: FileText, color: "text-red-600", bg: "bg-red-50" },
           { name: "Banner", href: "/user-management/banner", icon: FileText, color: "text-red-600", bg: "bg-red-50" },
    ];

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">User Management</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {modules.map((module) => (
                    <Link
                        key={module.name}
                        href={module.href}
                        className="flex flex-col items-center justify-center p-8 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md hover:border-blue-200 transition-all duration-300 group"
                    >
                        <div className={`h-16 w-16 rounded-full ${module.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                            <module.icon className={`h-8 w-8 ${module.color}`} />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900">{module.name}</h3>
                        <span className="text-sm text-gray-500 mt-2">Manage {module.name.toLowerCase()}</span>
                    </Link>
                ))}
            </div>
        </div>
    );
}
