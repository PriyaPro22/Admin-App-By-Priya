"use client";

import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  Star,
  Check,
  X,
  CheckCircle2,
  XCircle,
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Clock,
  ShieldCheck,
  FileText,
  CreditCard,
  Car,
  Landmark,
  AlertCircle,
  Eye,
  Download,
  Receipt,
  Briefcase,
  Wrench,
  Monitor,
  Smartphone
} from "lucide-react";
import { useTheme } from "../../../context/ThemeContext";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function PartnerDetailsPage({ params }: { params: { id: string } }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const router = useRouter();
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [partner, setPartner] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [verificationData, setVerificationData] = useState<any>(null);
  const [currentStep, setCurrentStep] = useState(6);

  const stepKeyMap = [
    "registration_done",        // REGISTRATION
    "job_category_done",        // JOB CATEGORY
    "select_service_done",      // JOB SERVICES
    "job_location_done",        // JOB LOCATION
    "payment_done",             // PAYMENT
    "documents_done",           // DOCUMENT VERIFICATION
    "vehicle_done",             // VEHICLE VERIFIED
    "bank_done",                // BANK
    "education_done",           // EDUCATION
    "address_done",             // ADDRESS
    "kyc_success",              // KYC SUCCESS
  ];

// ye hta skte h 
const roles = {
  technician: true,   // ya false
  rider: false        // ya true
};



  // job location
  const [jobLocation, setJobLocation] = useState<{
    state: string;
    district: string;
  } | null>(null);

  //verification progress
  useEffect(() => {
    const fetchVerificationStatus = async () => {
      try {
        const res = await fetch(
          `https://api.bijliwalaaya.in/api/partner/verification-status/${params.id}`,
          {
            headers: {
              "x-api-token": "super_secure_token",
            },
          }
        );

        const json = await res.json();

        if (json.success) {
          setVerificationData(json.data);
        }
      } catch (err) {
        console.error("Verification status error", err);
      }
    };

    fetchVerificationStatus();
  }, [params.id]);



  //verification steps 
  const verificationSteps = stepKeyMap.map((label, i) => {
    let status: "completed" | "failed" | "pending" | "active" = "pending";

    if (verificationData) {
      const key = stepKeyMap[i];
      const value = verificationData[key];

      if (value === true) {
        status = "completed";
      } else if (value === false) {
        status = "failed";
      }
    }

    return {
      label,
      step: i + 1,
      status,
    };
  });

  useEffect(() => {
    const fetchJobLocation = async () => {
      try {
        const res = await fetch(
          `https://api.bijliwalaaya.in/api/partner/job-location/${params.id}`,
          {
            headers: {
              "x-api-token": "super_secure_token",
            },
          }
        );

        const json = await res.json();

        if (json.success) {
          setJobLocation(json.job_location);
        }
      } catch (error) {
        console.error("Error fetching job location", error);
      }
    };

    fetchJobLocation();
  }, [params.id]);


  useEffect(() => {
    const fetchPartnerDetails = async () => {
      try {
        const res = await fetch(
          "https://api.bijliwalaaya.in/api/partner/admin/all-partners",
          {
            headers: {
              "x-api-token": "super_secure_token",
            },
          }
        );

        const json = await res.json();

        if (json.success) {
          const foundPartner = json.data.find(
            (p: any) => p.personal_details.partner_id === params.id
          );

          if (foundPartner) {
            setPartner(foundPartner);
          }
        }
      } catch (error) {
        console.error("Error fetching partner details", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPartnerDetails();
  }, [params.id]);


  const handleStepClick = (stepNum: number) => {
    setCurrentStep(stepNum);
  };

  const stats = [
    { label: "AVERAGE RATING", value: "4.8", icon: Star, color: "text-amber-400" },
    { label: "EXPERIENCE", value: "6+ Years", icon: null },
    { label: "COMPLETED SERVICES", value: "124", icon: null, active: true },
    { label: "PENDING SERVICES", value: "03", icon: null },
    { label: "ONGOING SERVICES", value: "01", icon: null },
    { label: "LANGUAGES", value: "Hindi, English...", icon: null },
  ];

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-[#0B1437]' : 'bg-[#F4F7FE]'}`}>
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0070f3] mb-4"></div>
          <p className={`font-bold ${isDark ? 'text-white' : 'text-[#2B3674]'}`}>Loading Profile...</p>
        </div>
      </div>
    );
  }

  if (!partner) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-[#0B1437]' : 'bg-[#F4F7FE]'}`}>
        <div className="text-center">
          <h2 className={`text-2xl font-bold mb-4 ${isDark ? 'text-white' : 'text-[#2B3674]'}`}>Partner Not Found</h2>
          <button
            onClick={() => router.back()}
            className="px-6 py-3 bg-[#0070f3] text-white rounded-xl font-bold hover:bg-blue-600 transition-all"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const { personal_details } = partner;
  const profileImage = personal_details.profile_url?.startsWith('http')
    ? personal_details.profile_url
    : "https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg";

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDark ? 'bg-[#0B1437]' : 'bg-[#F4F7FE]'} pb-12`}>
      {/* --- TOP HEADER BAR --- */}
      <div className={`${isDark ? 'bg-[#111C44] border-gray-800' : 'bg-white border-b border-gray-100'} px-8 py-4 flex justify-between items-center sticky top-0 z-40`}>
        <div className="flex items-center gap-6">
          <button
            onClick={() => router.back()}
            className={`p-2.5 rounded-xl transition-all ${isDark ? 'bg-[#1B254B] text-white hover:bg-[#232D65]' : 'bg-[#F4F7FE] text-[#2B3674] hover:bg-gray-100'}`}
          >
            <ArrowLeft size={20} strokeWidth={2.5} />
          </button>

          <div>
            <div className="flex items-center gap-3">
              <h1 className={`text-xl font-black ${isDark ? 'text-white' : 'text-[#2B3674]'}`}>{personal_details.name || "Unknown Name"}</h1>
              <span className={`px-3 py-1 ${personal_details.verified ? 'bg-[#EEFBF3] text-[#42BE65]' : 'bg-red-100 text-red-500'} text-[10px] font-black rounded-lg uppercase tracking-wider`}>
                Verified: {personal_details.verified ? "True" : "False"}
              </span>
            </div>
            <p className="text-[12px] font-bold text-[#A3AED0] flex items-center gap-2 mt-0.5">
              Partner ID: <span className={isDark ? 'text-gray-300' : 'text-[#707EAE]'}>{personal_details.partner_id}</span>
              <span className="h-1 w-1 rounded-full bg-[#A3AED0]"></span>
              <span className="text-[#0070f3] capitalize">{personal_details.status}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => alert("Edit Profile Clicked")}
            className={`px-5 py-2.5 text-[13px] font-bold rounded-xl transition-all hover:bg-gray-50/5 ${isDark ? 'text-white' : 'text-[#2B3674]'}`}
          >
            Edit Profile
          </button>
          <button
            onClick={() => alert("Block Partner Clicked")}
            className="px-5 py-2.5 text-[13px] font-bold border-2 border-red-500 text-red-500 rounded-xl hover:bg-red-50 transition-all"
          >
            Block Partner
          </button>
          <button
            onClick={() => setShowRejectModal(true)}
            className={`px-5 py-2.5 text-[13px] font-bold border-2 ${isDark ? 'border-gray-700 text-gray-400' : 'border-gray-200 text-[#707EAE]'} rounded-xl hover:bg-gray-50 transition-all`}
          >
            Reject
          </button>
          <button
            onClick={() => setShowApproveModal(true)}
            className="px-6 py-2.5 text-[13px] font-bold bg-[#0070f3] text-white rounded-xl shadow-lg shadow-blue-500/20 hover:bg-blue-600 transition-all"
          >
            Approve Partner
          </button>
        </div>
      </div>

      <div className="p-8 max-w-[1600px] mx-auto space-y-8">

        {/* --- MAIN INFO CARD --- */}
        <div className={`${isDark ? 'bg-[#111C44] border-gray-800' : 'bg-white border-transparent'} rounded-[32px] p-8 shadow-sm border space-y-10`}>
          <div className="flex gap-10">
            {/* Avatar */}
            <div className="relative">
              <div className={`h-40 w-40 rounded-[24px] ${isDark ? 'bg-[#1B254B]' : 'bg-[#51908C]'} flex items-center justify-center overflow-hidden shadow-inner`}>
                {personal_details.profile_url ? (
                  <img
                    src={profileImage}
                    alt="Profile"
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg";
                    }}
                  />
                ) : (
                  <span className="text-white text-[10px] font-black uppercase tracking-[0.2em] leading-tight text-center">Partner<br />Profile</span>
                )}
              </div>
              <div className="absolute -bottom-2 -right-2 h-8 w-8 bg-[#42BE65] rounded-full border-4 border-white dark:border-[#111C44] flex items-center justify-center text-white shadow-lg">
                <Check size={16} strokeWidth={4} />
              </div>
            </div>

            {/* Detailed Fields */}
            <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-y-10 gap-x-6">
              <div>
                <label className="block text-[11px] font-black text-[#A3AED0] uppercase tracking-widest mb-1.5">EMAIL ADDRESS</label>
                <p className={`text-[15px] font-bold ${isDark ? 'text-white' : 'text-[#2B3674]'}`}>{personal_details.email || "N/A"}</p>
              </div>
              <div>
                <label className="block text-[11px] font-black text-[#A3AED0] uppercase tracking-widest mb-1.5">PHONE NUMBER</label>
                <p className={`text-[15px] font-bold ${isDark ? 'text-white' : 'text-[#2B3674]'}`}>{personal_details.phone || "N/A"}</p>
              </div>
              <div>
                <label className="block text-[11px] font-black text-[#A3AED0] uppercase tracking-widest mb-1.5">DATE OF BIRTH</label>
                <p className={`text-[15px] font-bold ${isDark ? 'text-white' : 'text-[#2B3674]'}`}>{personal_details.dob || "N/A"}</p>
              </div>
              <div>
                <label className="block text-[11px] font-black text-[#A3AED0] uppercase tracking-widest mb-1.5">REG. DATE & TIME</label>
                <p className={`text-[13px] font-bold ${isDark ? 'text-white' : 'text-[#2B3674]'}`}>{personal_details.registration_date || "N/A"}</p>
              </div>
              <div className="md:col-span-2">
                <label className="block text-[11px] font-black text-[#A3AED0] uppercase tracking-widest mb-1.5">CURRENT ADDRESS</label>
                <p className={`text-[14px] font-bold ${isDark ? 'text-white' : 'text-[#2B3674]'} leading-relaxed`}>
                  {personal_details.location || "N/A"}
                </p>
              </div>
              <div className="md:col-span-2">
                <label className="block text-[11px] font-black text-[#A3AED0] uppercase tracking-widest mb-1.5">JOB LOCATION</label>
                <p className={`text-[14px] font-bold ${isDark ? 'text-white' : 'text-[#2B3674]'} leading-relaxed`}>
                  {/* <div style={{ display: "flex", gap: "16px" }}>
                            <p>State</p>
                            <p>District</p>
                                </div> */}
                  <div className="flex gap-1">
                    <div className="flex items-center gap-2">
                      <MapPin size={16} className="text-[#0070f3]" />
                      <span>
                        <strong>State:</strong>{" "}
                        {jobLocation?.state || "N/A"}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <MapPin size={16} className="text-[#0070f3]" />
                      <span>
                        <strong>District:</strong>{" "}
                        {jobLocation?.district || "N/A"}
                      </span>
                    </div>
                  </div>

                </p>
              </div>
            </div>
          </div>

          {/* Quick Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-6 gap-5">
            {stats.map((stat, i) => (
              <div
                key={i}
                className={`${stat.active ? 'bg-[#EBF3FF] border-[#0070f3]' : (isDark ? 'bg-[#1B254B] border-transparent' : 'bg-[#F8FAFC] border-transparent')} p-5 rounded-2xl border transition-all flex flex-col justify-center`}
              >
                <p className={`text-[9px] font-black ${isDark ? 'text-[#8F9BBA]' : 'text-[#A3AED0]'} uppercase tracking-wider mb-2`}>{stat.label}</p>
                <div className="flex items-center gap-2">
                  {stat.icon && <stat.icon className={`h-4 w-4 ${stat.color || 'text-[#0070f3]'}`} fill="currentColor" />}
                  <h4 className={`text-xl font-black ${isDark ? 'text-white' : 'text-[#2B3674]'}`}>{stat.value}</h4>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* --- VERIFICATION PROGRESS --- */}
        <div className={`${isDark ? 'bg-[#111C44]' : 'bg-white'} rounded-[32px] px-10 py-6 shadow-sm`}>

          <h3
            className={`text-[15px] font-black ${isDark ? 'text-white' : 'text-[#2B3674]'
              } uppercase tracking-widest mb-12`}
          >
            Verification Progress
          </h3>

          <div className="relative pb-16">
            {/* GREEN PROGRESS LINE */}
            <div className="absolute top-5 left-8 right-8 h-1 bg-[#42BE65]"></div>

            <div className="relative flex justify-between">
              {verificationSteps.map((step, i) => (
                <div
                  key={i}
                  className="flex flex-col items-center relative w-full cursor-pointer transition-transform active:scale-95"
                  onClick={() => handleStepClick(i + 1)}
                >
                  {/* Circle */}
                  <div className="relative z-10 flex flex-col items-center">
                    {step.status === "completed" ? (
                      <div className="h-10 w-10 rounded-full bg-[#42BE65] flex items-center justify-center text-white shadow-lg ring-4 ring-white">
                        <Check size={20} strokeWidth={4} />
                      </div>
                    ) : step.status === "failed" ? (
                      <div className="h-10 w-10 rounded-full bg-[#E31A1A] flex items-center justify-center text-white shadow-lg ring-4 ring-white">
                        <X size={20} strokeWidth={4} />
                      </div>
                    ) : step.status === "active" ? (
                      <div className="h-10 w-10 rounded-full bg-[#0070f3] flex items-center justify-center text-white shadow-lg ring-4 ring-white font-black">
                        {step.step}
                      </div>
                    ) : (
                      <div
                        className={`h-10 w-10 rounded-full ${isDark
                          ? 'bg-gray-700 text-gray-300'
                          : 'bg-gray-100 text-[#A3AED0]'
                          } flex items-center justify-center text-sm font-black`}
                      >
                        {step.step}
                      </div>
                    )}

                    {/* Label */}
                    <div className="absolute top-[72px] w-36 text-center pointer-events-none px-1">

                      <p
                        className={`text-[9px] font-black tracking-wider leading-tight uppercase ${step.status === "failed"
                          ? 'text-[#E31A1A]'
                          : step.status === "completed"
                            ? 'text-[#42BE65]'
                            : step.status === "active"
                              ? 'text-[#0070f3]'
                              : 'text-[#A3AED0]'
                          }`}
                      >
                        {step.label.replace("_done", "").replace(/_/g, " ")}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>



        {/* --- JOB ROLE & KYC SUMMARY --- */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* JOB ROLE & SERVICES */}
          <div className={`${isDark ? 'bg-[#111C44] border-gray-800' : 'bg-white border-transparent'} rounded-[32px] p-8 shadow-sm border xl:col-span-2`}>
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className={`h-10 w-10 rounded-full ${isDark ? 'bg-[#1B254B] text-blue-400' : 'bg-blue-50 text-[#0070f3]'} flex items-center justify-center`}>
                  <Briefcase size={20} strokeWidth={2.5} />
                </div>
                <h3 className={`text-xl font-black ${isDark ? 'text-white' : 'text-[#2B3674]'}`}>
                  Job Role & Services
                </h3>
              </div>
             <div className="flex gap-3">
  {/* Technician */}
  <span
    className={`px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-wider
      ${
        roles.technician
          ? 'bg-[#EEFBF3] text-[#42BE65]'
          : 'bg-[#FFF1F1] text-[#E31A1A]'
      }`}
  >
    Technician
  </span>

  {/* Rider */}
  <span
    className={`px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-wider
      ${
        roles.rider
          ? 'bg-[#EEFBF3] text-[#42BE65]'
          : 'bg-[#FFF1F1] text-[#E31A1A]'
      }`}
  >
    Rider
  </span>
</div>

            </div>

            <div className="space-y-4">

  {/* ROW */}
  <div className={`flex items-center rounded-xl px-5 py-3 ${
    isDark ? 'bg-[#1B254B]' : 'bg-[#F4F7FE]'
  }`}>
    <div className="flex items-center gap-2 w-[220px] text-[#A3AED0]">
      <Wrench size={14} />
      <span className="text-[11px] font-black uppercase tracking-widest">
        Home Appliances
      </span>
    </div>

    <div className={`text-[13px] font-bold ${
      isDark ? 'text-gray-200' : 'text-[#2B3674]'
    }`}>
      AC Repair, Washing Machine, Refrigerator
    </div>
  </div>

  {/* ROW */}
  <div className={`flex items-center rounded-xl px-5 py-3 ${
    isDark ? 'bg-[#1B254B]' : 'bg-[#F4F7FE]'
  }`}>
    <div className="flex items-center gap-2 w-[220px] text-[#A3AED0]">
      <Monitor size={14} />
      <span className="text-[11px] font-black uppercase tracking-widest">
        Computer
      </span>
    </div>

    <div className={`text-[13px] font-bold ${
      isDark ? 'text-gray-200' : 'text-[#2B3674]'
    }`}>
      Desktop Repair, Data Recovery
    </div>
  </div>

  {/* ROW */}
  <div className={`flex items-center rounded-xl px-5 py-3 ${
    isDark ? 'bg-[#1B254B]' : 'bg-[#F4F7FE]'
  }`}>
    <div className="flex items-center gap-2 w-[220px] text-[#A3AED0]">
      <Smartphone size={14} />
      <span className="text-[11px] font-black uppercase tracking-widest">
        Mobile
      </span>
    </div>

    <div className="text-[13px] font-bold text-[#A3AED0]">
      No services selected
    </div>
  </div>

</div>

          </div>

          {/* KYC Summary (New Design) */}
         <div
  className={`${
    isDark ? 'bg-[#111C44] border-gray-800' : 'bg-white border-gray-100'
  } rounded-[24px] p-6 shadow-sm border`}
>
  {/* Header */}
  <div className="flex items-center gap-3 mb-6">
    <div
      className={`h-10 w-10 rounded-xl flex items-center justify-center ${
        isDark ? 'bg-[#1B254B]' : 'bg-blue-50'
      }`}
    >
      <CheckCircle2 size={20} className="text-[#0070f3]" />
    </div>
    <h4
      className={`text-lg font-black ${
        isDark ? 'text-white' : 'text-[#2B3674]'
      }`}
    >
      KYC Summary
    </h4>
  </div>

  {/* KYC DETAILS */}
  <div className="space-y-5">
    {/* Aadhaar */}
    <div className="flex items-center justify-between">
      <div>
        <p className="text-[11px] font-black uppercase text-[#A3AED0]">
          Aadhaar Number
        </p>
        <p
          className={`text-[14px] font-bold ${
            isDark ? 'text-white' : 'text-[#2B3674]'
          }`}
        >
          860578036645
        </p>
      </div>
      <span className="flex items-center gap-1.5 bg-[#EEFBF3] text-[#42BE65] px-3 py-1.5 rounded-lg text-[11px] font-black uppercase">
        <CheckCircle2 size={14} />
        Verified
      </span>
    </div>

    {/* PAN */}
    <div className="flex items-center justify-between">
      <div>
        <p className="text-[11px] font-black uppercase text-[#A3AED0]">
          PAN Number
        </p>
        <p
          className={`text-[14px] font-bold ${
            isDark ? 'text-white' : 'text-[#2B3674]'
          }`}
        >
          HFRPM8350C
        </p>
      </div>
      <span className="flex items-center gap-1.5 bg-[#EEFBF3] text-[#42BE65] px-3 py-1.5 rounded-lg text-[11px] font-black uppercase">
        <CheckCircle2 size={14} />
        Verified
      </span>
    </div>

    {/* Driving License */}
    <div className="flex items-center justify-between">
      <div>
        <p className="text-[11px] font-black uppercase text-[#A3AED0]">
          Driving License
        </p>
        <p className="text-[14px] font-bold text-[#A3AED0]">—</p>
      </div>
      <span className="flex items-center gap-1.5 bg-[#FFF1F1] text-[#E31A1A] px-3 py-1.5 rounded-lg text-[11px] font-black uppercase">
        <XCircle size={14} />
        Not Verified
      </span>
    </div>
  </div>
 
  {/* Divider */}
  <div className="my-6 h-px bg-gray-100 dark:bg-gray-800"></div>
{/* Timestamp */}
  <div className="mt-4">
  {/* Label */}
  <p className="text-[11px] font-black uppercase tracking-wider text-[#A3AED0] mb-1">
    Verification Timestamp
  </p>

  {/* Date Row */}
  <div className="flex items-center gap-2 text-[13px] font-bold text-[#2B3674] dark:text-gray-300">
    <Calendar size={14} className="text-[#A3AED0]" />
    <span>05-02-2026 14:05:21</span>
  </div>
</div>

</div>

        </div>


        {/* --- DOCUMENT VERIFICATION & SIDEBAR --- */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8  pb-12">
  {/* LEFT COLUMN - VERIFICATION CARDS */}
  <div className="xl:col-span-2 bg-white space-y-8">
    <div className="flex items-center gap-3 mb-6">
      <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center text-[#0070f3]">
        <FileText size={20} strokeWidth={2.5} />
      </div>
      <h3 className={`text-xl font-black ${isDark ? 'text-white' : 'text-[#2B3674]'}`}>
        Document Verification
      </h3>
    </div>

    {/* --- AADHAAR CARD --- */}
    <div className={`${isDark ? 'bg-[#111C44] border-gray-800' : 'bg-white border-transparent'} rounded-[24px] p-8 shadow-sm border relative overflow-hidden group hover:shadow-lg transition-all duration-300`}>
      <div className="absolute top-0 right-0 p-6">
        <span className="bg-[#EEFBF3] text-[#42BE65] px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-wider flex items-center gap-2">
          <CheckCircle2 size={14} strokeWidth={3} />
          Approved
        </span>
      </div>

      <div className="flex items-start gap-5 mb-8">
        <div className="h-14 w-14 rounded-2xl bg-blue-50 flex items-center justify-center text-[#0070f3] flex-shrink-0">
          <CreditCard size={28} strokeWidth={2} />
        </div>
        <div>
          <h4 className={`text-lg font-black ${isDark ? 'text-white' : 'text-[#2B3674]'} mb-1`}>
            Aadhaar Card
          </h4>
          <p className={`text-[13px] font-medium ${isDark ? 'text-gray-400' : 'text-[#A3AED0]'}`}>
            Identity Proof
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12 mb-8 pr-32">
        <div>
          <label className="block text-[10px] font-black text-[#A3AED0] uppercase tracking-widest mb-1.5">NAME</label>
          <p className={`text-[14px] font-bold ${isDark ? 'text-white' : 'text-[#2B3674]'}`}>
            UKVK Services Technology
          </p>
        </div>
        <div>
          <label className="block text-[10px] font-black text-[#A3AED0] uppercase tracking-widest mb-1.5">UID</label>
          <p className={`text-[14px] font-bold ${isDark ? 'text-white' : 'text-[#2B3674]'}`}>
            xxxx xxxx 6645
          </p>
        </div>
        <div>
          <label className="block text-[10px] font-black text-[#A3AED0] uppercase tracking-widest mb-1.5">GENDER</label>
          <p className={`text-[14px] font-bold ${isDark ? 'text-white' : 'text-[#2B3674]'}`}>
            M
          </p>
        </div>
        <div>
          <label className="block text-[10px] font-black text-[#A3AED0] uppercase tracking-widest mb-1.5">DOB</label>
          <p className={`text-[14px] font-bold ${isDark ? 'text-white' : 'text-[#2B3674]'}`}>
            01-01-1900
          </p>
        </div>
        <div className="md:col-span-2">
          <label className="block text-[10px] font-black text-[#A3AED0] uppercase tracking-widest mb-1.5">ADDRESS</label>
          <p className={`text-[14px] font-bold ${isDark ? 'text-white' : 'text-[#2B3674]'} leading-relaxed`}>
            140A, Rajiv Nagar, Harihar Nagar, Kamta, Lucknow, Uttar Pradesh 226016, India
          </p>
        </div>
      </div>

      {/* Document Previews (Right Side Absolute on Desktop) */}
      <div className="hidden md:flex flex-col gap-3 absolute top-24 right-8 w-32">
        <div className="h-20 bg-gray-100 rounded-lg overflow-hidden border border-gray-200 cursor-pointer hover:ring-2 ring-[#0070f3] transition-all">
          {/* Mock Image */}
        </div>
        <div className="h-20 bg-gray-100 rounded-lg overflow-hidden border border-gray-200 cursor-pointer hover:ring-2 ring-[#0070f3] transition-all">
          {/* Mock Image */}
        </div>
        <div className="h-20 bg-gray-100 rounded-lg overflow-hidden border border-gray-200 cursor-pointer hover:ring-2 ring-[#0070f3] transition-all">
          {/* Mock Image */}
        </div>
      </div>
    </div>

    {/* --- PAN CARD --- */}
    <div className={`${isDark ? 'bg-[#111C44] border-gray-800' : 'bg-white border-transparent'} rounded-[24px] p-8 shadow-sm border relative overflow-hidden group hover:shadow-lg transition-all duration-300`}>
      <div className="absolute top-0 right-0 p-6">
        <span className="bg-[#EEFBF3] text-[#42BE65] px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-wider flex items-center gap-2">
          <CheckCircle2 size={14} strokeWidth={3} />
          Approved
        </span>
      </div>

      <div className="flex items-start gap-5 mb-8">
        <div className="h-14 w-14 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-600 flex-shrink-0">
          <FileText size={28} strokeWidth={2} />
        </div>
        <div>
          <h4 className={`text-lg font-black ${isDark ? 'text-white' : 'text-[#2B3674]'} mb-1`}>
            PAN Card
          </h4>
          <p className={`text-[13px] font-medium ${isDark ? 'text-gray-400' : 'text-[#A3AED0]'}`}>
            Tax Identity
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-y-6 gap-x-8 mb-8 pr-32">
        <div>
          <label className="block text-[10px] font-black text-[#A3AED0] uppercase tracking-widest mb-1.5">NAME</label>
          <p className={`text-[14px] font-bold ${isDark ? 'text-white' : 'text-[#2B3674]'} uppercase`}>
            Priya Singh
          </p>
        </div>
        <div>
          <label className="block text-[10px] font-black text-[#A3AED0] uppercase tracking-widest mb-1.5">PAN NUMBER</label>
          <p className={`text-[14px] font-bold ${isDark ? 'text-white' : 'text-[#2B3674]'}`}>
            HFRPM8350C
          </p>
        </div>
        <div>
          <label className="block text-[10px] font-black text-[#A3AED0] uppercase tracking-widest mb-1.5">DOB</label>
          <p className={`text-[14px] font-bold ${isDark ? 'text-white' : 'text-[#2B3674]'}`}>
            17-10-2002
          </p>
        </div>
        <div>
          <label className="block text-[10px] font-black text-[#A3AED0] uppercase tracking-widest mb-1.5">TYPE</label>
          <p className={`text-[14px] font-bold ${isDark ? 'text-white' : 'text-[#2B3674]'}`}>
            Individual
          </p>
        </div>
      </div>

      {/* Document Previews */}
      <div className="hidden md:flex flex-col gap-3 absolute top-24 right-8 w-32">
        <div className="h-20 bg-gray-100 rounded-lg overflow-hidden border border-gray-200 cursor-pointer hover:ring-2 ring-purple-500 transition-all flex items-center justify-center">
          <FileText size={20} className="text-gray-300" />
        </div>
      </div>
    </div>

    {/* --- DRIVING LICENSE --- */}
    <div className={`${isDark ? 'bg-[#111C44] border-gray-800' : 'bg-white border-transparent'} rounded-[24px] p-8 shadow-sm border relative overflow-hidden group hover:shadow-lg transition-all duration-300`}>
      <div className="absolute top-0 right-0 p-6">
        <span className="bg-[#FFF8E7] text-[#FFB800] px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-wider flex items-center gap-2">
          <Clock size={14} strokeWidth={3} />
          Pending Review
        </span>
      </div>

      <div className="flex items-start gap-5 mb-8">
        <div className="h-14 w-14 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-500 flex-shrink-0">
          <Car size={28} strokeWidth={2} />
        </div>
        <div>
          <h4 className={`text-lg font-black ${isDark ? 'text-white' : 'text-[#2B3674]'} mb-1`}>
            Driving License
          </h4>
          <p className={`text-[13px] font-medium ${isDark ? 'text-gray-400' : 'text-[#A3AED0]'}`}>
            Vehicle Authorization
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-y-6 gap-x-8 mb-8 pr-32">
        <div>
          <label className="block text-[10px] font-black text-[#A3AED0] uppercase tracking-widest mb-1.5">NAME</label>
          <p className={`text-[14px] font-bold ${isDark ? 'text-white' : 'text-[#2B3674]'} uppercase`}>
            VIVEK KUMAR
          </p>
        </div>
        <div>
          <label className="block text-[10px] font-black text-[#A3AED0] uppercase tracking-widest mb-1.5">DL NO</label>
          <p className={`text-[14px] font-bold ${isDark ? 'text-white' : 'text-[#2B3674]'}`}>
            UP34 20240012003
          </p>
        </div>
        <div>
          <label className="block text-[10px] font-black text-[#A3AED0] uppercase tracking-widest mb-1.5">DOB</label>
          <p className={`text-[14px] font-bold ${isDark ? 'text-white' : 'text-[#2B3674]'}`}>
            13-07-2003
          </p>
        </div>
        <div>
          <label className="block text-[10px] font-black text-[#A3AED0] uppercase tracking-widest mb-1.5">EXPIRY</label>
          <p className={`text-[14px] font-bold ${isDark ? 'text-white' : 'text-[#2B3674]'}`}>
            12-07-2043
          </p>
        </div>
        <div className="md:col-span-2">
          <label className="block text-[10px] font-black text-[#A3AED0] uppercase tracking-widest mb-1.5">VEHICLE CLASSES</label>
          <p className={`text-[14px] font-bold ${isDark ? 'text-white' : 'text-[#2B3674]'}`}>
            LMV, MCWG
          </p>
        </div>
      </div>

      {/* Document Previews */}
      <div className="hidden md:flex flex-col gap-3 absolute top-24 h-50 right-8 w-32">
        <div className="h-20 bg-gray-100 rounded-lg overflow-hidden border border-gray-200 cursor-pointer hover:ring-2 ring-orange-400 transition-all flex items-center justify-center">
          <Car size={20} className="text-gray-300" />
        </div>
        <div className="h-20 bg-gray-100 rounded-lg overflow-hidden border border-gray-200 cursor-pointer hover:ring-2 ring-orange-400 transition-all flex items-center justify-center">
          <User size={20} className="text-gray-300" />
        </div>
        <div className="h-20 bg-gray-100 rounded-lg overflow-hidden border border-gray-200 cursor-pointer hover:ring-2 ring-orange-400 transition-all flex items-center justify-center">
          <User size={20} className="text-gray-300" />
        </div>
        
      </div>
    </div>

    {/* DOCUMENT VERIFICATION ACTIONS */}
    <div className={`${isDark ? 'bg-[#111C44] border-gray-800' : 'bg-white border-transparent'} rounded-[24px] p-6 shadow-sm border flex items-center gap-4`}>
      <button
        onClick={() => setShowApproveModal(true)}
        className="flex-1 bg-[#0070f3] text-white py-4 rounded-xl font-bold text-[14px] hover:bg-blue-600 transition-all shadow-lg shadow-blue-500/20 active:scale-[0.98] uppercase tracking-wider"
      >
        Approve
      </button>
      <button
        onClick={() => setShowRejectModal(true)}
        className={`flex-1 ${isDark ? 'bg-transparent border-gray-700 text-red-400' : 'bg-transparent border-red-100 text-red-500'} border py-4 rounded-xl font-bold text-[14px] hover:bg-red-50 transition-all active:scale-[0.98] uppercase tracking-wider`}
      >
        Reject
      </button>
    </div>
  </div>

  {/* RIGHT COLUMN - BANK DETAILS ONLY */}
  <div className="flex flex-col  bg-white gap-8">
    {/* Bank Details - Separate Div */}
    <div className={`${isDark ? 'bg-[#111C44] border-gray-800' : 'bg-white border-transparent'} rounded-[24px] p-8  shadow-sm border`}>
      <div className="flex items-center gap-3 mb-6">
        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-[#0070f3]">
          <Landmark size={20} strokeWidth={2.5} />
        </div>
        <h4 className={`text-lg font-black ${isDark ? 'text-white' : 'text-[#2B3674]'}`}>
          Bank Details
        </h4>
      </div>

      <div className={`p-6 rounded-2xl ${isDark ? 'bg-[#1B254B] border-gray-700' : 'bg-white border-blue-100'} border mb-4 relative overflow-hidden`}>
        <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-full -mr-10 -mt-10 opacity-50 pointer-events-none"></div>

        <label className="block text-[10px] font-black text-[#0070f3] uppercase tracking-widest mb-4">PRIMARY BANK ACCOUNT</label>

        <p className={`text-[11px] font-bold text-[#A3AED0] uppercase tracking-wider mb-1`}>HDFC BANK LTD</p>
        <p className={`text-[18px] font-black ${isDark ? 'text-white' : 'text-[#2B3674]'} mb-4 tracking-widest`}>
          XXXX XXXX 5521
        </p>

        <div className="flex justify-between items-end">
          <div>
            <label className="block text-[9px] font-black text-[#A3AED0] uppercase tracking-widest mb-0.5">IFSC CODE</label>
            <p className={`text-[13px] font-bold ${isDark ? 'text-white' : 'text-[#2B3674]'}`}>HDFC0001202</p>
          </div>
          <span className="text-[12px] font-bold text-[#0070f3]">Savings</span>
        </div>
      </div>

      <div className="flex gap-3 items-start p-3 rounded-xl bg-blue-50 text-blue-600">
        <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
        <p className="text-[11px] font-bold leading-relaxed">
          Payments are processed every Friday for the previous week's billing.
        </p>
      </div>
    </div>

    {/* Empty div for spacing or future content */}
    <div className="flex-1"></div>
  </div>
</div>
      </div>

      {/* --- APPROVE CONFIRMATION MODAL --- */}
      {showApproveModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
            onClick={() => setShowApproveModal(false)}
          ></div>

          {/* Modal Content */}
          <div className={`relative w-full max-w-[340px] transform overflow-hidden rounded-[28px] ${isDark ? 'bg-[#111C44] border-gray-800' : 'bg-white'} p-6 shadow-2xl transition-all border animate-in fade-in zoom-in duration-200 text-center`}>
            <div className={`mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full ${isDark ? 'bg-[#1B254B]' : 'bg-blue-50'}`}>
              <ShieldCheck size={28} className="text-[#0070f3]" />
            </div>

            <h3 className={`text-xl font-black mb-2 ${isDark ? 'text-white' : 'text-[#2B3674]'}`}>
              Approve Partner
            </h3>
            <p className={`text-[13px] font-medium mb-8 leading-relaxed ${isDark ? 'text-gray-400' : 'text-[#707EAE]'}`}>
              Are you sure you want to approve partners?
            </p>

            <div className="flex flex-col gap-2.5">
              <button
                onClick={() => {
                  // Handle approval logic here
                  setShowApproveModal(false);
                }}
                className="w-full py-3 text-[13px] font-black bg-[#0070f3] text-white rounded-2xl shadow-lg shadow-blue-500/25 hover:bg-blue-600 active:scale-[0.98] transition-all uppercase tracking-wider"
              >
                Approved
              </button>
              <button
                onClick={() => setShowApproveModal(false)}
                className={`w-full py-3 text-[13px] font-black rounded-2xl transition-all uppercase tracking-wider ${isDark ? 'bg-[#1B254B] text-white hover:bg-[#232D65]' : 'bg-gray-100 text-[#2B3674] hover:bg-gray-200'
                  }`}
              >
                Review Again
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- REJECT CONFIRMATION MODAL --- */}
      {showRejectModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
            onClick={() => setShowRejectModal(false)}
          ></div>

          {/* Modal Content */}
          <div className={`relative w-full max-w-[340px] transform overflow-hidden rounded-[28px] ${isDark ? 'bg-[#111C44] border-gray-800' : 'bg-white'} p-6 shadow-2xl transition-all border animate-in fade-in zoom-in duration-200 text-center`}>
            <div className={`mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full ${isDark ? 'bg-red-900/20' : 'bg-red-50'}`}>
              <XCircle size={28} className="text-red-500" />
            </div>

            <h3 className={`text-xl font-black mb-2 ${isDark ? 'text-white' : 'text-[#2B3674]'}`}>
              Reject Partner
            </h3>
            <p className={`text-[13px] font-medium mb-8 leading-relaxed ${isDark ? 'text-gray-400' : 'text-[#707EAE]'}`}>
              Are you sure you want to reject this partner?
            </p>

            <div className="flex flex-col gap-2.5">
              <button
                onClick={() => {
                  // Handle rejection logic here
                  setShowRejectModal(false);
                }}
                className="w-full py-3 text-[13px] font-black bg-red-500 text-white rounded-2xl shadow-lg shadow-red-500/25 hover:bg-red-600 active:scale-[0.98] transition-all uppercase tracking-wider"
              >
                Reject
              </button>
              <button
                onClick={() => setShowRejectModal(false)}
                className={`w-full py-3 text-[13px] font-black rounded-2xl transition-all uppercase tracking-wider ${isDark ? 'bg-[#1B254B] text-white hover:bg-[#232D65]' : 'bg-gray-100 text-[#2B3674] hover:bg-gray-200'
                  }`}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
