"use client";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import BlockIcon from "@mui/icons-material/Block";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DeleteIcon from "@mui/icons-material/Delete";
import DownloadIcon from "@mui/icons-material/Download";
import NotificationsIcon from "@mui/icons-material/Notifications";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";


export default function UsersPage() {
  const users = [
    {
      uid: "cfb262ce56ecde86c25da692",
      initials: "NS",
      name: "PRIYA SINGH",
      phone: "9696247645",
      addressType: "HOME",
      date: "2026-02-13",
      bookings: 0,
      wallet: "0.00",
      status: "ACTIVE",
      statusColor: "green",
    },
    {
  uid: "cfb262ce56ecde86c25da692",
  initials: "NS",
  name: "NAMAN SINGH",
  phone: "8604199815",
  addressType: "HOME",
  address: "100, Sector C, Aliganj, Lucknow, Uttar Pradesh",
  date: "2026-02-13",
  bookings: 0,
  wallet: "0.00",
  status: "ACTIVE",
  statusColor: "green",
},

    {
      uid: "e3b921fa44ecde86c25da691",
      initials: "AK",
      name: "ANANYA KAPOOR",
      phone: "9876543210",
      addressType: "OFFICE",
      date: "2026-02-12",
      bookings: 12,
      wallet: "1,240.00",
      status: "ACTIVE",
      statusColor: "green",
    },
    {
      uid: "a1d921fa44ecde86c25da723",
      initials: "RJ",
      name: "RAHUL JAIN",
      phone: "7009123456",
      addressType: "HOME",
      date: "2026-02-10",
      bookings: 3,
      wallet: "45.50",
      status: "SUSPENDED",
      statusColor: "red",
    },
  ];

  return (
    <div className="min-h-screen bg-background-light p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900">User Management</h1>
          <p className="text-slate-500 mt-1">Manage and monitor registered users across the platform</p>
        </div>
  <div className="flex gap-4">

  {/* Export Button */}
  <button className="flex items-center gap-2 px-5 h-11 rounded-xl border border-slate-200 bg-white text-slate-700 font-semibold text-sm hover:bg-slate-50 hover:shadow-sm transition-all duration-200">
    <DownloadIcon sx={{ fontSize: 20 }} />
    Export User Data
  </button>

  {/* Send Notification Button */}
  <button className="flex items-center gap-2 px-5 h-11 rounded-xl bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 shadow-md shadow-blue-600/20 transition-all duration-200">
    <NotificationsIcon sx={{ fontSize: 20 }} />
    Send Notification
  </button>

</div>


      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">

  {/* Total Registered Users */}
  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
    <p className="text-slate-500 text-sm font-medium mb-2">
      Total Registered Users
    </p>
    <div className="flex items-center justify-between">
      <h3 className="text-3xl font-bold text-slate-900">12,450</h3>
      <span className="flex items-center gap-1 text-green-600 text-sm font-semibold bg-green-50 px-2.5 py-1 rounded-lg">
        <TrendingUpIcon sx={{ fontSize: 16 }} />
        12%
      </span>
    </div>
  </div>

  {/* Active Users Today */}
  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
    <p className="text-slate-500 text-sm font-medium mb-2">
      Active Users (Today)
    </p>
    <div className="flex items-center justify-between">
      <h3 className="text-3xl font-bold text-slate-900">1,200</h3>
      <span className="flex items-center gap-1 text-green-600 text-sm font-semibold bg-green-50 px-2.5 py-1 rounded-lg">
        <TrendingUpIcon sx={{ fontSize: 16 }} />
        5%
      </span>
    </div>
  </div>

  {/* New Signups */}
  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
    <p className="text-slate-500 text-sm font-medium mb-2">
      New Signups (This Month)
    </p>
    <div className="flex items-center justify-between">
      <h3 className="text-3xl font-bold text-slate-900">450</h3>
      <span className="flex items-center gap-1 text-green-600 text-sm font-semibold bg-green-50 px-2.5 py-1 rounded-lg">
        <TrendingUpIcon sx={{ fontSize: 16 }} />
        18%
      </span>
    </div>
  </div>

  {/* Inactive Users */}
  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
    <p className="text-slate-500 text-sm font-medium mb-2">
      Inactive Users
    </p>
    <div className="flex items-center justify-between">
      <h3 className="text-3xl font-bold text-slate-900">89</h3>
      <span className="flex items-center gap-1 text-red-600 text-sm font-semibold bg-red-50 px-2.5 py-1 rounded-lg">
        <TrendingDownIcon sx={{ fontSize: 16 }} />
        2%
      </span>
    </div>
  </div>

</div>


      {/* Search Bar - Full Width */}
    {/* Search + Filters Combined Bar */}
<div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-4 mb-8">
  <div className="flex items-center gap-4">

    {/* Search Input */}
    <div className="relative flex-1">
      <input
        type="text"
        placeholder="Search by Name, Phone, or UID..."
        className="w-full h-11 pl-11 pr-4 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
      />
      <svg
        className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m1.85-5.65a7.5 7.5 0 11-15 0 7.5 7.5 0 0115 0z" />
      </svg>
    </div>

    {/* Registration Date */}
    <select className="h-11 px-4 rounded-xl border border-blue-200 bg-blue-50 text-sm font-medium text-slate-700 focus:outline-none">
      <option>Registration Date</option>
      <option>Today</option>
      <option>This Week</option>
      <option>This Month</option>
    </select>

    {/* All Cities */}
    <select className="h-11 px-4 rounded-xl border border-slate-200 bg-slate-50 text-sm font-medium text-slate-700 focus:outline-none">
      <option>All Cities</option>
      <option>Lucknow</option>
      <option>Delhi</option>
      <option>Mumbai</option>
    </select>

    {/* Account Status */}
    <select className="h-11 px-4 rounded-xl border border-slate-200 bg-slate-50 text-sm font-medium text-slate-700 focus:outline-none">
      <option>Account Status</option>
      <option>Active</option>
      <option>Suspended</option>
    </select>

    {/* More Filters Button */}
    <button className="flex items-center gap-2 h-11 px-4 rounded-xl bg-slate-100 text-slate-600 text-sm font-semibold hover:bg-slate-200 transition">
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 4h18M6 12h12M10 20h4" />
      </svg>
      More Filters
    </button>

  </div>
</div>


      {/* Users Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">USER UID</th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">USER NAME</th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">PHONE NUMBER</th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">PRIMARY ADDRESS</th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">REGISTRATION DATE</th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-center">BOOKINGS</th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-right">WALLET</th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-center">STATUS</th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map((user, index) => (
                <tr key={index} className="hover:bg-slate-50/50 transition-colors">
                  {/* USER UID */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="font-mono text-xs text-slate-500">{user.uid}</span>
                  </td>
                  
                  {/* USER NAME with Initials */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full ${
                        user.initials === "NS" ? "bg-blue-100 text-blue-600" :
                        user.initials === "AK" ? "bg-amber-100 text-amber-600" :
                        "bg-slate-100 text-slate-600"
                      } flex items-center justify-center font-bold text-xs uppercase`}>
                        {user.initials}
                      </div>
                      <span className="text-sm font-semibold text-slate-900 uppercase">{user.name}</span>
                    </div>
                  </td>
                  
                  {/* PHONE NUMBER */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                    {user.phone}
                  </td>
                  
                  {/* PRIMARY ADDRESS - Only type, no address text */}
                 <td className="px-6 py-4 max-w-[220px]">
  <div className="flex flex-col gap-2">

    {/* Badge */}
    <span
      className={`text-[10px] font-bold uppercase px-2 py-1 rounded-md w-fit ${
        user.addressType === "HOME"
          ? "bg-blue-50 text-blue-600"
          : "bg-slate-100 text-slate-600"
      }`}
    >
      {user.addressType}
    </span>

    {/* Address (Truncated) */}
    <p className="text-sm text-slate-600 truncate">
      {user.address}
    </p>

  </div>
</td>

                  
                  {/* REGISTRATION DATE */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                    {user.date}
                  </td>
                  
                  {/* BOOKINGS - Centered */}
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium text-slate-700">
                    {user.bookings}
                  </td>
                  
                  {/* WALLET - Right aligned */}
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-slate-900">
                    ₹{user.wallet}
                  </td>
                  
                  {/* STATUS - Centered with badge */}
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      user.statusColor === "green" 
                        ? "bg-green-100 text-green-700" 
                        : "bg-red-100 text-red-700"
                    }`}>
                      {user.status}
                    </span>
                  </td>
                  
                  {/* ACTIONS - Exact sequence as image */}
   <td className="px-6 py-4 whitespace-nowrap text-right">
  <div className="flex items-center justify-end gap-4">

    {/* View All Details */}
    <button
      className="flex items-center gap-1 text-blue-600 text-sm font-semibold hover:text-blue-700 transition"
      title="View All Details"
    >
      <span>View All Details</span>
      <ArrowForwardIcon sx={{ fontSize: 18 }} />
    </button>
  </div>
</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
 <div className="px-6 py-4 border-t border-slate-200 bg-white flex items-center justify-between">
  
  {/* Showing Text */}
  <p className="text-xs text-slate-500">
    Showing <span className="font-medium text-slate-900">1 to 10</span> of{" "}
    <span className="font-medium text-slate-900">12,450</span> entries
  </p>

  {/* Dropdown */}
  <div className="flex items-center gap-2">
    <span className="text-xs text-slate-500">Show:</span>
    
    <select
      className="text-xs font-medium border border-slate-200 rounded-md px-2 py-1 bg-white focus:outline-none focus:ring-2 focus:ring-primary/20"
    >
      <option value="10">10</option>
      <option value="20">20</option>
      <option value="50">50</option>
      <option value="100">100</option>
      <option value="all">All</option>
    </select>
  </div>

</div>


      </div>
    </div>
  );
}