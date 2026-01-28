"use client";

import React from "react";
import Link from "next/link";

export default function UserManagement() {
    const menuItems = [
        {
            label: "Users Management",
            href: "/user-management/users",
            fullWidth: true,
        },
        {
            label: "User App Management",
            href: "/user-management/user-app",
            fullWidth: true,
        },
        {
            // This row is special, will handle manually or via grid
        }
    ];

    return (
        <div className="mx-auto max-w-lg animate-fade-in space-y-6">
            {/* Users Management */}
            <Link href="/user-management/users">
                <div className="mb-4 flex w-full cursor-pointer items-center justify-center rounded-lg border border-gray-200 bg-white py-4 text-center font-bold text-gray-800 shadow-sm transition-transform active:scale-95 hover:bg-gray-50">
                    Users Management
                </div>
            </Link>

            {/* User App Management */}
            <Link href="/user-management/user-app">
                <div className="mb-4 flex w-full cursor-pointer items-center justify-center rounded-lg border border-gray-200 bg-white py-4 text-center font-bold text-gray-800 shadow-sm transition-transform active:scale-95 hover:bg-gray-50">
                    User App Management
                </div>
            </Link>

            {/* Row with two buttons: Search Keywords & Banner Images */}
            <div className="mb-4 grid grid-cols-2 gap-4">
                <Link href="/user-management/search-keywords">
                    <div className="flex h-full cursor-pointer items-center justify-center rounded-lg border border-gray-200 bg-white px-2 py-4 text-center font-bold text-gray-800 shadow-sm transition-transform active:scale-95 hover:bg-gray-50">
                        Search Keywords
                    </div>
                </Link>
                <Link href="/user-management/banner-images">
                    <div className="flex h-full cursor-pointer items-center justify-center rounded-lg border border-gray-200 bg-white px-2 py-4 text-center font-bold text-gray-800 shadow-sm transition-transform active:scale-95 hover:bg-gray-50">
                        Banner Images
                    </div>
                </Link>
            </div>

            {/* Advance Payment... */}
            <Link href="/user-management/advance-payment">
                <div className="mb-4 flex w-full cursor-pointer items-center justify-center rounded-lg border border-gray-200 bg-white px-4 py-4 text-center font-bold text-gray-800 shadow-sm transition-transform active:scale-95 hover:bg-gray-50">
                    Advance Payment, Platform fee and Instant and Scheduled Services
                </div>
            </Link>

            {/* Cancellation Form */}
            <Link href="/user-management/cancellation-form">
                <div className="mb-4 flex w-full cursor-pointer items-center justify-center rounded-lg border border-gray-200 bg-white py-4 text-center font-bold text-gray-800 shadow-sm transition-transform active:scale-95 hover:bg-gray-50">
                    Cancellation Form
                </div>
            </Link>
        </div>
    );
}
