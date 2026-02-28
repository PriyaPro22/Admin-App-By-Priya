// "use client";

// import React, { useState } from "react";
// import { Search, Plus, MoreVertical } from "lucide-react";

// export default function DealerPanel() {
//   const [search, setSearch] = useState("");

//   const dealers = [
//     {
//       id: 1,
//       name: "Rahul Traders",
//       city: "Lucknow",
//       status: "Active",
//       revenue: "₹1,25,000",
//     },
//     {
//       id: 2,
//       name: "Sharma Electronics",
//       city: "Kanpur",
//       status: "Pending",
//       revenue: "₹58,000",
//     },
//     {
//       id: 3,
//       name: "Verma Appliances",
//       city: "Delhi",
//       status: "Blocked",
//       revenue: "₹2,10,000",
//     },
//   ];

//   const filteredDealers = dealers.filter((dealer) =>
//     dealer.name.toLowerCase().includes(search.toLowerCase())
//   );

//   return (
//     <div className="p-8 bg-gray-50 min-h-screen">
//       {/* Header */}
//       <div className="flex justify-between items-center mb-8">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-800">
//             Dealer Management
//           </h1>
//           <p className="text-gray-500 text-sm">
//             Manage all registered dealers
//           </p>
//         </div>

//         <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg shadow-sm transition">
//           <Plus size={18} />
//           Add Dealer
//         </button>
//       </div>

//       {/* Stats Cards */}
//       <div className="grid grid-cols-4 gap-6 mb-8">
//         <div className="bg-white p-5 rounded-xl shadow-sm border">
//           <h3 className="text-sm text-gray-500">Total Dealers</h3>
//           <p className="text-2xl font-bold mt-2">128</p>
//         </div>

//         <div className="bg-white p-5 rounded-xl shadow-sm border">
//           <h3 className="text-sm text-gray-500">Active Dealers</h3>
//           <p className="text-2xl font-bold mt-2 text-green-600">96</p>
//         </div>

//         <div className="bg-white p-5 rounded-xl shadow-sm border">
//           <h3 className="text-sm text-gray-500">Pending Approval</h3>
//           <p className="text-2xl font-bold mt-2 text-yellow-500">18</p>
//         </div>

//         <div className="bg-white p-5 rounded-xl shadow-sm border">
//           <h3 className="text-sm text-gray-500">Blocked</h3>
//           <p className="text-2xl font-bold mt-2 text-red-500">14</p>
//         </div>
//       </div>

//       {/* Search + Table */}
//       <div className="bg-white rounded-xl shadow-sm border p-6">
//         <div className="flex justify-between items-center mb-4">
//           <div className="relative w-72">
//             <Search
//               size={16}
//               className="absolute top-3 left-3 text-gray-400"
//             />
//             <input
//               type="text"
//               placeholder="Search dealers..."
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//               className="w-full pl-9 pr-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//           </div>
//         </div>

//         <table className="w-full text-sm">
//           <thead>
//             <tr className="text-left text-gray-500 border-b">
//               <th className="py-3">Dealer Name</th>
//               <th>City</th>
//               <th>Status</th>
//               <th>Revenue</th>
//               <th></th>
//             </tr>
//           </thead>

//           <tbody>
//             {filteredDealers.map((dealer) => (
//               <tr
//                 key={dealer.id}
//                 className="border-b hover:bg-gray-50 transition"
//               >
//                 <td className="py-4 font-medium text-gray-800">
//                   {dealer.name}
//                 </td>
//                 <td>{dealer.city}</td>
//                 <td>
//                   <span
//                     className={`px-3 py-1 rounded-full text-xs font-medium ${
//                       dealer.status === "Active"
//                         ? "bg-green-100 text-green-700"
//                         : dealer.status === "Pending"
//                         ? "bg-yellow-100 text-yellow-700"
//                         : "bg-red-100 text-red-700"
//                     }`}
//                   >
//                     {dealer.status}
//                   </span>
//                 </td>
//                 <td className="font-medium">{dealer.revenue}</td>
//                 <td>
//                   <button className="p-2 hover:bg-gray-100 rounded-lg">
//                     <MoreVertical size={16} />
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>

//         {filteredDealers.length === 0 && (
//           <div className="text-center py-10 text-gray-400">
//             No dealers found.
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }
"use client";

import React, { useState } from "react";
import { X } from "lucide-react";

interface Props {
  onClose: () => void;
}

export default function AddDealerForm({ onClose }: Props) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    city: "",
    gst: "",
    status: "Active",
    address: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    console.log("Dealer Submitted:", formData);

    // 🔥 Yahan API call lagegi later
    // await axios.post("/api/dealers", formData)

    alert("Dealer Added Successfully 🚀");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl p-8 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full"
        >
          <X size={18} />
        </button>

        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          Add New Dealer
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name + Email */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-600">
                Dealer Name
              </label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-600">
                Email
              </label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          {/* Phone + City */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-600">
                Phone Number
              </label>
              <input
                type="text"
                name="phone"
                required
                value={formData.phone}
                onChange={handleChange}
                className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-600">
                City
              </label>
              <input
                type="text"
                name="city"
                required
                value={formData.city}
                onChange={handleChange}
                className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          {/* GST + Status */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-600">
                GST Number
              </label>
              <input
                type="text"
                name="gst"
                value={formData.gst}
                onChange={handleChange}
                className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-600">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="Active">Active</option>
                <option value="Pending">Pending</option>
                <option value="Blocked">Blocked</option>
              </select>
            </div>
          </div>

          {/* Address */}
          <div>
            <label className="text-sm font-medium text-gray-600">
              Address
            </label>
            <textarea
              name="address"
              rows={3}
              value={formData.address}
              onChange={handleChange}
              className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-lg border text-gray-600 hover:bg-gray-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
            >
              Save Dealer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}