"use client";

import React, { useState } from "react";
import { UserPlus } from "lucide-react";
import { api } from "../utils/api";

export default function AddMember() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (!formData.name || !formData.email || !formData.password) {
            alert("Please fill all fields");
            return;
        }

        try {
            setLoading(true);
            await api.post("/user", formData);
            alert("Member Added Successfully!");
            setFormData({ name: "", email: "", password: "" });
        } catch (error) {
            console.error("Failed to add member", error);
            alert("Failed to add member. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mx-auto max-w-md animate-fade-in space-y-6">
            <div className="rounded-lg bg-white p-6 shadow-lg border border-gray-100">
                <h1 className="mb-8 text-center text-xl font-bold text-gray-800">
                    Add Admin Member
                </h1>

                <div className="space-y-5">
                    {/* Name Input (Assuming 3rd field is Name based on context, or maybe it should be first? 
               The screenshot had Email, Password, then Empty. 
               Usually Name comes first. I will put Name first for better UX, 
               or I can follow the screenshot strictly if I knew what the 3rd field was.
               Let's try: Email, Password, Name/Phone. 
               The screenshot order: Top Box (Email per placeholder), Middle Box (Password per placeholder), Bottom Box box (Empty).
               I'll put Name at the top though for standard flow, or maybe the empty box was Confirm Password?
               Let's stick to a standard: Name, Email, Password. 
               Wait, looking at image 1 again:
               1. "Enter Email"
               2. "Enter Password"
               3. [Empty] - This likely is Confirm Password.
               
               However, I'll add "Name" as well because creating a member without a name is weird.
               Actually, I'll implement:
               1. Email
               2. Password
               3. Confirm Password (to match the 3 inputs visual)
               
               BUT often admins need to set a Name. 
               Let's check the fields.
               The user said "activate chahie" (make it active). 
               I'll do: Name, Email, Password. It's safer.
           */}

                    <div className="space-y-1">
                        <input
                            type="text"
                            name="name" // Adding Name as it's essential usually
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Enter Full Name"
                            className="w-full rounded-md border border-gray-300 px-4 py-3 text-gray-700 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        />
                    </div>

                    <div className="space-y-1">
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Enter Email"
                            className="w-full rounded-md border border-gray-300 px-4 py-3 text-gray-700 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        />
                    </div>

                    <div className="space-y-1">
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Enter Password"
                            className="w-full rounded-md border border-gray-300 px-4 py-3 text-gray-700 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        />
                    </div>

                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="bg-blue-900 text-white h-15 w-40 rounded-full"
                    >
                        {loading ? "Adding Member..." : "Add Member"}
                    </button>
                </div>
            </div>
        </div>
    );
}
