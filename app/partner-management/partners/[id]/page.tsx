"use client";

import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  Star,
  Check,
  X,
  Bike,
  CheckCircle2,
  XCircle,
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Clock,
  Shield,
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
  Smartphone,
  Minus,
  Plus,
  Image
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
const [currentSection, setCurrentSection] = useState<
  | "documents_done"
  | "vehicle_done"
  | "bank_done"
  | "education_done"
  | "address_done"
  | "kyc_success"
  | null
>(null);

const [actionLoading, setActionLoading] = useState(false);
const [kycNotes, setKycNotes] = useState<Record<string, any>>({});
const [showFinalRejectModal, setShowFinalRejectModal] = useState(false);


// Kyc Notes
const fetchSingleKycNote = async (pageKey: string) => {
  try {
    const res = await fetch(
      `https://api.bijliwalaaya.in/api/partner/kyc-live-status/${params.id}/${pageKey}`,
      {
        headers: {
          "x-api-token": "super_secure_token",
        },
      }
    );

    const json = await res.json();

    if (json.success) {
      return json.data;   // 👈 single section data
    }

    return null;
  } catch (error) {
    console.error("Single KYC fetch error", error);
    return null;
  }
};

useEffect(() => {
  const sections = [
    "documents_done",
    "vehicle_done",
    "bank_done",
    "education_done",
    "address_done",
  ];

  const loadAllNotes = async () => {
    for (const key of sections) {
      const data = await fetchSingleKycNote(key);
      if (data) {
        setKycNotes(prev => ({
          ...prev,
          [key]: data,
        }));
      }
    }
  };

  loadAllNotes();
}, [params.id]);




const [showConfirm, setShowConfirm] = useState(false);
// Image modal
const [previewImage, setPreviewImage] = useState<string | null>(null);
// Aadhar Modal
// ✅ FIRST declare kycData
const [kycData, setKycData] = useState<any>(null);

const [showStepModal, setShowStepModal] = useState(false);
const [stepAction, setStepAction] = useState<"approve" | "reject" | null>(null);
const [selectedStep, setSelectedStep] = useState<any>(null);


// ================= RESIDENTIAL PROOF =================
const [residentialData, setResidentialData] = useState<any>(null);
const [residentialLoading, setResidentialLoading] = useState(true);

const BASE_URL = "https://api.bijliwalaaya.in/api/partner";
const TOKEN = "super_secure_token"; // 🔥 yahan apna token lagao

useEffect(() => {
  const fetchResidentialProof = async () => {
    try {
      setResidentialLoading(true);

      const res = await fetch(
        `${BASE_URL}/residential-proof/${params.id}`,
        {
          headers: {
            "x-api-token": "super_secure_token",
          },
        }
      );

      const json = await res.json();
      console.log("Residential Response:", json);

      if (json.success) {
        setResidentialData(json.data);
      } else {
        setResidentialData(null);
      }
    } catch (error) {
      console.error("Residential fetch error", error);
      setResidentialData(null);
    } finally {
      setResidentialLoading(false);
    }
  };

  fetchResidentialProof();
}, [params.id]);


const saveResidentialProof = async (payload: {
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  proofType: string;
  proofImage: File | string;
}) => {
  const formData = new FormData();

  Object.entries(payload).forEach(([key, value]) => {
    if (value) formData.append(key, value as any);
  });

  const res = await fetch(
    `${BASE_URL}/residential-proof/${params.id}`,
    {
      method: "POST", // or PUT
      headers: {
        Authorization: `Bearer ${TOKEN}`,
      },
      body: formData,
    }
  );

  const json = await res.json();
  if (json.success) {
    setResidentialData(json.data);
  }
};

const updateResidentialProof = async (payload: any) => {
  const res = await fetch(
    `${BASE_URL}/residential-proof/${params.id}`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }
  );

  const json = await res.json();
  if (json.success) {
    setResidentialData(json.data);
  }
};

const deleteResidentialProof = async () => {
  const res = await fetch(
    `${BASE_URL}/residential-proof/${params.id}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${TOKEN}`,
      },
    }
  );

  const json = await res.json();
  if (json.success) {
    setResidentialData(null);
  }
};
// Education Details
const [educationData, setEducationData] = useState<any>(null);
const [educationLoading, setEducationLoading] = useState(true);
useEffect(() => {
  const fetchEducationDetails = async () => {
    try {
      setEducationLoading(true);

     const res = await fetch(
  `https://api.bijliwalaaya.in/api/partner/educational-qualification/${params.id}`,
  {
    headers: {
      "x-api-token": "super_secure_token",
    },
  }
);


      const json = await res.json();

      if (json.success) {
        setEducationData(json.data);
      } else {
        setEducationData(null);
      }
    } catch (error) {
      console.error("Education fetch error", error);
      setEducationData(null);
    } finally {
      setEducationLoading(false);
    }
  };

  fetchEducationDetails();
}, [params.id]);

// Document Verification Api
const saveKycLiveStatus = async (
  pageKey: string,
  approved: boolean,
  note: string
) => {
  try {
    const res = await fetch(
      `https://api.bijliwalaaya.in/api/partner/kyc-live-status/${params.id}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-token": "super_secure_token",
        },
        body: JSON.stringify({
          pageKey,          // ✅ dynamic
          approved,
          note,
          status: approved,
          role: "admin",
          adminId: "ADMIN_001", // ❌ blank mat bhejo
        }),
      }
    );

    const json = await res.json();
    if (json.success) {
      console.log("Saved:", json.data);
    }
  } catch (error) {
    console.error(error);
  }
};
// Key Changes
const updatePartnerFinalStatus = async (approved: boolean) => {
  try {
    const res = await fetch(
      `https://api.bijliwalaaya.in/api/partner/verification-status/${params.id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-api-token": "super_secure_token",
        },
        body: JSON.stringify({
          kyc_success: approved,
          kyc_success_at: new Date().toISOString(),

          admin_approved: approved,
          admin_approved_at: new Date().toISOString(),
        }),
      }
    );

    const json = await res.json();

    if (json.success) {
      fetchVerificationStatus(); // UI refresh
    }
  } catch (error) {
    console.error("Final status update failed", error);
  }
};

// update verificationstatus 
const updateVerificationStatus = async (
  pageKey: string,
  value: boolean
) => {
  try {
    const res = await fetch(
      `https://api.bijliwalaaya.in/api/partner/verification-status/${params.id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-api-token": "super_secure_token",
        },
        body: JSON.stringify({
          [pageKey]: value,
        }),
      }
    );

    const json = await res.json();

    if (json.success) {
      console.log("Verification updated:", json.updated_fields);

      // UI refresh
      fetchVerificationStatus();
    }
  } catch (error) {
    console.error("Verification update failed", error);
  }
};

// Aadhaar modal
const [docPreview, setDocPreview] = useState<string | null>(null);

// ✅ NOW safely use kycData
const aadhaarImages =
  kycData?.kyc_details?.image_urls
    ? [
        kycData.kyc_details.image_urls.AADHAAR_FRONT,
        kycData.kyc_details.image_urls.AADHAAR_BACK,
        kycData.kyc_details.image_urls.AADHAAR_photo,
      ].filter(Boolean)
    : [];
const panImage =
  kycData?.kyc_details?.image_urls?.PAN || null;
  const dlImages =
  kycData?.kyc_details?.image_urls
    ? [
        kycData.kyc_details.image_urls.DL_FRONT,
        kycData.kyc_details.image_urls.DL_BACK,
      ].filter(Boolean)
    : [];




// Kyc Data
useEffect(() => {
  const fetchKycDetails = async () => {
    try {
      const res = await fetch(
        `https://api.bijliwalaaya.in/api/partner/kyc-details/${params.id}`,
        {
          headers: {
            "x-api-token": "super_secure_token",
          },
        }
      );

      const json = await res.json();

      if (json.success) {
        setKycData(json.data);
      }
    } catch (err) {
      console.error("KYC fetch error", err);
    }
  };

  fetchKycDetails();
}, [params.id]);

const kycDetails = kycData?.kyc_details;
const docStatus = kycData?.doc_verification?.verification_status;

const aadhaarMatched = docStatus?.aadhaar_matched === true;
const panMatched = docStatus?.pan_matched === true;
const dlMatched = docStatus?.dl_matched === true;


const aadhaarNumber = kycData?.doc_verification?.local_input?.aadhaarNumber;
const panNumber = kycData?.doc_verification?.local_input?.panNumber;
const dlNumber = kycData?.doc_verification?.local_input?.dlNumber;

const verificationTime =
  docStatus?.verification_timestamp || kycDetails?.completion_timestamp;


// Component के top level पर state add करें
const [attemptCount, setAttemptCount] = useState(0);

// Handler functions
const handleIncrement = async () => {
  try {
    const res = await fetch(
      `https://api.bijliwalaaya.in/api/partner/verification-status/${params.id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-api-token": "super_secure_token",
        },
        body: JSON.stringify({
          documents_verification_attempts: backendAttempts + 1,
        }),
      }
    );

    const json = await res.json();

    if (json.success) {
      // ✅ modal band karo
      setShowConfirm(false);

      // ✅ verification status dubara lao
      // taaki UI updated value dikhaye
      fetchVerificationStatus(); // (same function jo useEffect me hai)
    }
  } catch (error) {
    console.error("Increment failed", error);
    alert("Failed to update verification attempt");
  }
};



const updateStepStatus = async () => {
  if (!selectedStep || !stepAction) return;

  const stepKey = selectedStep.label; 
  // ex: registration_done

  const value = stepAction === "approve";

  try {
    const res = await fetch(
      `https://api.bijliwalaaya.in/api/partner/verification-status/${params.id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-api-token": "super_secure_token",
        },
        body: JSON.stringify({
          [stepKey]: value,
          [`${stepKey}_at`]: value
            ? new Date().toLocaleString("en-IN")
            : "",
        }),
      }
    );

    const json = await res.json();

    if (json.success) {
      // 🔥 UI ko manually update karo (no refetch)
      setVerificationData((prev: any) => ({
        ...prev,
        [stepKey]: value,
        [`${stepKey}_at`]: value
          ? new Date().toLocaleString("en-IN")
          : "",
      }));

      setShowStepModal(false);
       setSelectedStep(null);
  setStepAction(null);
    }
  } catch (error) {
    console.error("Step update failed", error);
  }
};


const fetchVerificationStatus=async ()=>{
  try {
    const res =await fetch(
      `https://api.bijliwalaaya.in/api/partner/verification-status/${params.id}`,
      {
        headers:{
          "x-api-token":"super_secure_token",
        },
      }
    );
    const json =await res.json();
    if(json.success){
      setVerificationData(json.data);
    }
  } catch (error) {
    console.error("Verification status fetch error ",error);
  }
};

// Reject
const [showRejectReason, setShowRejectReason] = useState(false);
const [rejectReason, setRejectReason] = useState("");


const handleDecrement = () => {
  setAttemptCount(prev => prev > 0 ? prev - 1 : 0);
};

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
    "kyc_success",  
    

            // KYC SUCCESS
  ];

// Job Category
const [roles, setRoles] = useState<{
  technician: boolean;
  rider: boolean;
  selectedText: string;
}>({
  technician: false,
  rider: false,
  selectedText: "No Role Selected",
});



useEffect(() => {
  const fetchJobCategory = async () => {
    try {
      const res = await fetch(
        `https://api.bijliwalaaya.in/api/partner/job-category/${params.id}`,
        {
          headers: {
            "x-api-token": "super_secure_token",
          },
        }
      );

      const json = await res.json();

      if (json.success && json.job_category) {
        setRoles({
          technician: json.job_category.isTechnicians,
          rider: json.job_category.isRider,
          selectedText: json.job_category.selectedText,
        });
      }
    } catch (error) {
      console.error("Job category fetch error", error);
    }
  };

  fetchJobCategory();
}, [params.id]);

// Payment
const [paymentData, setPaymentData] = useState<any>(null);
const [paymentLoading, setPaymentLoading] = useState(true);

useEffect(() => {
  const fetchPaymentDetails = async () => {
    try {
      const res = await fetch(
        `https://api.bijliwalaaya.in/api/partner/payments/${params.id}`,
        {
          headers: {
            "x-api-token": "super_secure_token",
          },
        }
      );

      const json = await res.json();

      if (json.success && json.data) {
        // API object ke andar first payment nikal lo
        const payment = Object.values(json.data)[0];
        setPaymentData(payment);
      }
    } catch (err) {
      console.error("Payment fetch error", err);
    } finally {
      setPaymentLoading(false);
    }
  };

  fetchPaymentDetails();
}, [params.id]);


const paymentStatus = paymentData?.status;
const isSuccess = paymentStatus === "SUCCESS";

const paymentId = paymentData?.paymentId;
const amount = paymentData?.amount;
const currency = paymentData?.currency;
const gateway = paymentData?.payment_gateway;
const merchantRefId = paymentData?.merchant_reference_id;
const paymentType = paymentData?.payment_type?.replace("_", " ");
const timestamp = paymentData?.timestamp;


// Rc & Non RC Tab
const [activeTab, setActiveTab] = useState<"rc" | "nonrc">("rc");
const [approveContext, setApproveContext] = useState<
  "partner" | "vehicle" | null
>(null);


type FieldProps = {
  label: string;
  value?: string | number;
  blue?: boolean;
};

const Field = ({ label, value, blue }: FieldProps) => {
  return (
    <div>
      <p className="text-gray-400 font-bold mb-1">{label}</p>
      <p
        className={`font-bold ${
          blue ? "text-blue-600" : "text-[#2B3674]"
        }`}
      >
        {value || "—"}
      </p>
    </div>
  );
};


const [rcVehicle, setRcVehicle] = useState<any>(null);
const [rcLoading, setRcLoading] = useState(true);

useEffect(() => {
  const fetchRcVehicle = async () => {
    try {
      setRcLoading(true);

      const res = await fetch(
        `https://api.bijliwalaaya.in/api/partner/vehicle-details/${params.id}/RC`,
        {
          headers: {
            "x-api-token": "super_secure_token",
          },
        }
      );

      const json = await res.json();

      if (json.success) {
        setRcVehicle(json.data);
      }
    } catch (error) {
      console.error("RC vehicle fetch error", error);
    } finally {
      setRcLoading(false);
    }
  };

  fetchRcVehicle();
}, [params.id]);

// Non Rc Vehicle
const [nonRcVehicle, setNonRcVehicle] = useState<any>(null);
const [nonRcLoading, setNonRcLoading] = useState(false);


const fetchNonRcVehicle = async () => {
  try {
    setNonRcLoading(true);

    const res = await fetch(
      `https://api.bijliwalaaya.in/api/partner/vehicle-details/${params.id}/NONRC`,
      {
        headers: {
          "x-api-token": "super_secure_token",
        },
      }
    );

    const json = await res.json();

    if (json.success) {
      setNonRcVehicle(json.data);
    }
  } catch (error) {
    console.error("Non-RC vehicle fetch error", error);
  } finally {
    setNonRcLoading(false);
  }
};


const getStatusStyles = (status?: string) => {
  if (!status) return "bg-gray-200 text-gray-600";

  switch (status.toUpperCase()) {
    case "VALID":
      return "bg-green-100 text-green-700";
    case "INVALID":
      return "bg-red-100 text-red-700";
    case "PENDING":
      return "bg-yellow-100 text-yellow-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};


const [bankDetails, setBankDetails] = useState<any>(null);
const [bankLoading, setBankLoading] = useState(true);

useEffect(() => {
  const fetchBankDetails = async () => {
    try {
      setBankLoading(true);

      const res = await fetch(
        `https://api.bijliwalaaya.in/api/partner/bank-details/${params.id}`,
        {
          headers: {
            "x-api-token": "super_secure_token",
          },
        }
      );

      const json = await res.json();
      if (json.success) {
        setBankDetails(json.data);
      }
    } catch (err) {
      console.error("Bank fetch error", err);
    } finally {
      setBankLoading(false);
    }
  };

  fetchBankDetails();
}, [params.id]);








  // job location
  const [jobLocation, setJobLocation] = useState<{
    state: string;
    district: string;
  } | null>(null);

// Kyc Details
const aadhaarData = kycDetails?.digilocker_response?.AADHAAR;
const panData = kycDetails?.digilocker_response?.PAN;

const aadhaarStatus = docStatus?.aadhaar_matched;
const panStatus = docStatus?.pan_matched;
const dlStatus = docStatus?.dl_matched;


const aadhaarAddress = aadhaarData?.split_address
  ? `${aadhaarData.split_address.house || ""} ${aadhaarData.split_address.street || ""},${aadhaarData.split_address.landmark || ""} , ${aadhaarData.split_address.vtc || ""},
     ${aadhaarData.split_address.po}, ${aadhaarData.split_address.subdist},
     ${aadhaarData.split_address.dist} - ${aadhaarData.split_address.state},
     ${aadhaarData.split_address.pincode}`
  : "—";






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
          // console.log("Priya singh",setVerificationData);
          console.log("Verification Data:", json.data);

          console.log("Priya", json.data);
        }
      } catch (err) {
        console.error("Verification status error", err);
      }
    };

    fetchVerificationStatus();
  }, [params.id]);


//   Job Services
const [jobServices, setJobServices] = useState<Record<string, any[]>>({});

const [loadingServices, setLoadingServices] = useState(true);


useEffect(() => {
  const fetchJobServices = async () => {
    try {
      const res = await fetch(
        `https://api.bijliwalaaya.in/api/partner/job-services/${params.id}`,
        {
          headers: {
            "x-api-token": "super_secure_token",
          },
        }
      );

      const json = await res.json();

     if (json.success) {
  setJobServices(json.job_services || {});
}

    } catch (err) {
      console.error("Job services fetch error", err);
    } finally {
      setLoadingServices(false);
    }
  };

  fetchJobServices();
}, [params.id]);


const categoryConfig: Record<string, any> = {
  Home_Appliances: {
    label: "Home Appliances",
    icon: Wrench,
  },
  Computer: {
    label: "Computer",
    icon: Monitor,
  },
  Mobile: {
    label: "Mobile",
    icon: Smartphone,
  },
};

// Approvel button
// 🔥 All step keys (jo partner approval ke liye important hain)
const approvalKeys = [
   "payment_done",       // 🔥 ADD THIS
  "documents_done",
  "vehicle_done",
  "bank_done",
  "education_done",
  "address_done",
];

// ✅ Check if all approved


// ❌ Check if any rejected
// const anyRejected =
//   approvalKeys.some((key) => verificationData?.[key] === false) ||
//   verificationData?.kyc_success === false;
const anyRejected =
  approvalKeys.some((key) => verificationData?.[key] === false);

const allApproved =
  approvalKeys.every((key) => verificationData?.[key] === true);

// ✅ Approve disabled if NOT all approved
const disableApproveButton = !allApproved;

// ✅ Reject disabled if any section already rejected OR not fully approved
const disableRejectButton = allApproved;



const renderKycNote = (key: string) => {
  const noteData = kycNotes?.[key];
  if (!noteData?.note) return null;

  const isApproved = noteData.approved === true;

  return (
    <div
      className={`w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl mb-4
      ${
        isApproved
          ? "bg-green-50 text-green-700"
          : "bg-red-50 text-red-600"
      }`}
    >
      <span className="text-lg">
        {isApproved ? "✅" : "❌"}
      </span>

      <span className="text-[14px] font-semibold text-center">
        {noteData.note}
      </span>
    </div>
  );
};








const verificationSteps = stepKeyMap.map((key, i) => {
  let status: "completed" | "failed" | "pending" = "pending";
  let timestamp: string | null = null;

  if (verificationData) {
    const value = verificationData[key];
    const timeKey = `${key}_at`;   // registration_done_at etc
    timestamp = verificationData?.[timeKey] ?? null;  

    if (value === true) {
      status = "completed";
    } else if (value === false) {
      status = "failed";
    }
  }

  return {
    label: key,
    step: i + 1,
    status,
    timestamp,
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
const backendAttempts =
  verificationData?.documents_verification_attempts ?? 0;


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
 
{/* <button
  disabled={disableRejectButton}
  onClick={() => {
    setCurrentSection("kyc_success");
    setShowRejectModal(true);
  }}
  className={`px-5 py-2.5 text-[13px] font-bold border-2 rounded-xl transition-all
  ${
    disableRejectButton
      ? "border-gray-300 text-gray-400 cursor-not-allowed"
      : "border-red-500 text-red-500 hover:bg-red-50"
  }`}
>
  Reject Partner
</button> */}
<button
  disabled={actionLoading}
  onClick={() => {
    setShowFinalRejectModal(true); // 👈 only open modal
  }}
  className={`px-6 py-2.5 text-[13px] font-bold rounded-xl
  shadow-lg transition-all uppercase
  ${
    actionLoading
      ? "bg-red-300 text-white cursor-not-allowed"
      : "bg-red-500 text-white hover:bg-red-600 shadow-red-500/20"
  }`}
>
  {/* {actionLoading ? "PROCESSING..." : "Reject Partner"} */}
  Reject Partner
</button>



{/* --- FINAL PARTNER REJECT MODAL --- */}
{/* --- FINAL PARTNER REJECT MODAL --- */}
{showFinalRejectModal && (
  <div className="fixed inset-0 z-[500] flex items-center justify-center p-4">
    
    {/* Backdrop */}
    <div
      className="absolute inset-0 bg-black/40 backdrop-blur-sm"
      onClick={() => {
        if (!actionLoading) setShowFinalRejectModal(false);
      }}
    />

    {/* Modal */}
    <div
      className={`relative w-full max-w-[360px] rounded-[28px] p-6 shadow-2xl border text-center
      ${isDark ? "bg-[#111C44] border-gray-800" : "bg-white"}`}
    >
      {/* Icon */}
      <div
        className={`mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full
        ${isDark ? "bg-red-900/20" : "bg-red-50"}`}
      >
        <XCircle size={28} className="text-red-500" />
      </div>

      <h3
        className={`text-xl font-black mb-3 ${
          isDark ? "text-white" : "text-[#2B3674]"
        }`}
      >
        Reject Partner
      </h3>

      <p
        className={`text-[13px] mb-8 ${
          isDark ? "text-gray-400" : "text-[#707EAE]"
        }`}
      >
        Are you sure you want to reject this partner?
      </p>

      <div className="flex gap-3">
        
        {/* REVIEW */}
        <button
          disabled={actionLoading}
          onClick={() => setShowFinalRejectModal(false)}
          className={`flex-1 py-3 rounded-2xl font-black text-[13px] uppercase
          ${
            isDark
              ? "bg-[#1B254B] text-white hover:bg-[#232D65]"
              : "bg-gray-100 text-[#2B3674] hover:bg-gray-200"
          }
          ${actionLoading ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          REVIEW
        </button>

        {/* FINAL REJECT */}
        <button
          disabled={actionLoading}
          onClick={async () => {
            try {
              setActionLoading(true);

              await updatePartnerFinalStatus(false);

              setShowFinalRejectModal(false);
            } catch (error) {
              console.error("Final reject failed", error);
            } finally {
              setActionLoading(false);
            }
          }}
          className={`flex-1 py-3 rounded-2xl font-black text-[13px] uppercase
          flex items-center justify-center gap-2 transition-all duration-200
          ${
            actionLoading
              ? "bg-red-400 cursor-not-allowed"
              : "bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/20"
          } text-white`}
        >
          {actionLoading ? (
            <>
              <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              PROCESSING...
            </>
          ) : (
            "REJECT"
          )}
        </button>
      </div>
    </div>
  </div>
)}





{/* APPROVE PARTNER */}
<button
  disabled={disableApproveButton}
  onClick={() => {
    setCurrentSection("kyc_success");  // 🔥 ADD THIS
    setShowApproveModal(true);
  }}

  className={`px-6 py-2.5 text-[13px] font-bold rounded-xl shadow-lg transition-all
  ${
  disableApproveButton
    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
    : "bg-[#0070f3] text-white hover:bg-blue-600 shadow-blue-500/20"
}
`}
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
           {stats.map((stat) => (
  <div key={stat.label}
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
       <div className={`${isDark ? 'bg-[#111C44]' : 'bg-white'} rounded-[32px] px-10 py-14 shadow-sm`}>

  <div className="flex justify-between items-start mb-5">
    <h3
      className={`text-[15px] font-black ${isDark ? 'text-white' : 'text-[#2B3674]'
        } uppercase tracking-widest`}
    >
      Verification Progress
    </h3>

    {/* Verification Attempt Counter - RIGHT SIDE */}
     
    </div>

  <div className="relative pb-16">
    {/* GREEN PROGRESS LINE */}
    <div className="absolute top-5 left-8 right-8 h-1 bg-[#42BE65]"></div>

    <div className="relative flex justify-between">
     {verificationSteps.map((step,i) => (
  <div key={step.label}
          className="flex flex-col items-center relative w-full cursor-pointer transition-transform active:scale-95"
          // onClick={() => handleStepClick(i + 1)}
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
            {/* <div className="absolute top-[72px] w-36 text-center pointer-events-none px-1">
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
            </div> */}
            {/* Label + Time + Buttons */}
<div className="absolute top-[70px] w-40 text-center px-1  flex flex-col items-center justify-between min-h-[85px]">

  {/* TOP SECTION */}
  <div className="flex flex-col items-center gap-1">

    {/* Label */}
    <p
      className={`text-[8px] font-black tracking-wider uppercase
        ${
          step.status === "failed"
            ? "text-[#E31A1A]"
            : step.status === "completed"
            ? "text-[#42BE65]"
            : step.status === "active"
            ? "text-[#0070f3]"
            : "text-[#A3AED0]"
        }`}
    >
      {step.label.replace("_done", "").replace(/_/g, " ")}
    </p>

    {/* Timestamp – always reserve height */}
    <p className="text-[6px] text-gray-400 font-medium h-4">
      {step.timestamp || "time not show"}
    </p>

  </div>

  {/* BOTTOM SECTION (Button Always Same Position) */}
  <div className="flex flex-col items-center gap-1 mt-1 mb-3">

    {step.status !== "completed" && (
      <span className="text-[9px] font-bold text-[#A3AED0]">
        Pending
      </span>
    )}

    {step.status === "completed" ? (
      <button
        onClick={(e) => {
          e.stopPropagation();
          setSelectedStep(step);
          setShowRejectModal(true);
        }} disabled
        className="px-3 py-[3px] text-[9px] font-bold border border-[#E31A1A] text-[#E31A1A] rounded-full hover:bg-[#E31A1A] hover:text-white transition-all"
      >
        REJECT
      </button>
    ) : (
      <button
 onClick={(e) => {
  e.stopPropagation();

  // Always create NEW object reference
  setSelectedStep({ ...step });
  setStepAction("approve");
  setShowStepModal(true);
}}

        className="px-3 py-[3px] text-[9px] font-bold border border-[#0070f3] text-[#0070f3] rounded-full hover:bg-[#0070f3] hover:text-white transition-all"
      >
        APPROVE
      </button>
    )}

  </div>

</div>


          </div>
        </div>
      ))}
    </div>
  </div>

  
</div>
 <div className="flex flex-col items-end">
        <p className={`text-xs font-bold text-xl ${isDark ? 'text-gray-300' : 'text-[#2B3674]'} mb-2`}>
          Verification Attempt
        </p>
        <div className="flex items-center gap-3">
          {/* Minus Button */}
          <button
            onClick={() => handleDecrement()}
            disabled={attemptCount === 0}
            className={`h-8 w-8 rounded-full flex items-center justify-center ${attemptCount === 0
                ? 'bg-gray-200 cursor-not-allowed text-gray-400'
                : 'bg-[#0070f3] hover:bg-blue-600 text-white'
              } transition-colors`}
          >
            <Minus size={16} />
          </button>
   
          {/* Count Display */}
          <div className={`h-10 w-12 flex items-center justify-center rounded-lg ${isDark
              ? 'bg-gray-800 text-white'
              : 'bg-gray-50 text-[#2B3674]'
            } font-bold text-lg`}>
           {backendAttempts}
          </div>

          {/* Plus Button */}
          <button
            onClick={() => setShowConfirm(true)}
            className="h-8 w-8 rounded-full bg-[#0070f3] hover:bg-blue-600 text-white flex items-center justify-center transition-colors"
          >
            <Plus size={16} />
          </button>
          
        </div>
      </div>


        {/* --- JOB ROLE & KYC SUMMARY --- */}
  {/* --- MAIN CONTENT AREA --- */}
<div className="grid grid-cols-1 xl:grid-cols-3 gap-8 pb-12">
  {/* LEFT COLUMN - ALL LEFT SIDE CONTENT (2/3 width) */}
  <div className="xl:col-span-2 space-y-8">
    {/* SECTION 1: JOB ROLE & SERVICES */}
    <div className={`${isDark ? 'bg-[#111C44] border-gray-800' : 'bg-white border-transparent'} rounded-[32px] p-8 shadow-sm border`}>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className={`h-10 w-10 rounded-full ${isDark ? 'bg-[#1B254B] text-blue-400' : 'bg-blue-50 text-[#0070f3]'} flex items-center justify-center`}>
            <Briefcase size={20} strokeWidth={2.5} />
          </div>
          <h3 className={`text-xl font-black ${isDark ? 'text-white' : 'text-[#2B3674]'}`}>
            Job Role & Services
          </h3>
        </div>
        <div className="flex flex-col items-end gap-1">
          <div className="flex gap-3">
            <span className={`px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-wider ${roles.technician ? 'bg-[#EEFBF3] text-[#42BE65]' : 'bg-[#FFF1F1] text-[#E31A1A]'}`}>
              Technician
            </span>
            <span className={`px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-wider ${roles.rider ? 'bg-[#EEFBF3] text-[#42BE65]' : 'bg-[#FFF1F1] text-[#E31A1A]'}`}>
              Rider
            </span>
          </div>
          <p className="text-[11px] font-bold text-[#A3AED0] uppercase tracking-wider">
            {roles.selectedText}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {loadingServices ? (
          <p className="text-[13px] font-bold text-[#A3AED0]">
            Loading services...
          </p>
        ) : (
          Object.keys(categoryConfig).map((categoryKey) => {
            const servicesArray = jobServices[categoryKey] || [];
            const servicesText = servicesArray.length > 0
              ? servicesArray.map((s: any) => s.name).join(", ")
              : "No services selected";
            const Icon = categoryConfig[categoryKey].icon;

            return (
              <div key={categoryKey} className={`flex items-center rounded-xl px-5 py-3 ${isDark ? "bg-[#1B254B]" : "bg-[#F4F7FE]"}`}>
                <div className="flex items-center gap-2 w-[220px] text-[#A3AED0]">
                  <Icon size={14} />
                  <span className="text-[11px] font-black uppercase tracking-widest">
                    {categoryConfig[categoryKey].label}
                  </span>
                </div>
                <div className={`text-[13px] font-bold ${servicesArray.length === 0 ? "text-[#A3AED0]" : isDark ? "text-gray-200" : "text-[#2B3674]"}`}>
                  {servicesText}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>

    {/* SECTION 2: DOCUMENT VERIFICATION */}
    {kycData?.kyc_details && (

    <div  className="bg-white border-transparent">
      <div className="flex items-center   gap-3 mb-6">
        <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center    justify-center text-[#0070f3]">
          <FileText size={20} strokeWidth={2.5} />
        </div>
        <h3 className={`text-xl font-black ${isDark ? 'text-white' : 'text-[#2B3674]'}`}>
          Document Verification
        </h3>
      </div>

      {/* AADHAAR CARD */}
      <div className={`${isDark ? 'bg-[#111C44] border-gray-800' : 'bg-white border-transparent'} rounded-[24px] p-8 shadow-sm border relative overflow-hidden group hover:shadow-lg transition-all duration-300 mb-8`}>
        <div className="absolute top-0 right-0 p-6">
          <span className="bg-[#EEFBF3] text-[#42BE65] px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-wider flex items-center gap-2">
            <CheckCircle2 size={14} strokeWidth={3} /> Approved
          </span>
        </div>

        <div className="flex items-start gap-5 mb-8">
          <div className="h-14 w-14 rounded-2xl bg-blue-50 flex items-center justify-center text-[#0070f3] flex-shrink-0">
            <CreditCard size={28} strokeWidth={2} />
          </div>
          <div>
            <h4 className={`text-lg font-black ${isDark ? 'text-white' : 'text-[#2B3674]'} mb-1`}>Aadhaar Card</h4>
            <p className={`text-[13px] font-medium ${isDark ? 'text-gray-400' : 'text-[#A3AED0]'}`}>Identity Proof</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12 mb-8 pr-32">
          <div>
            <label className="block text-[10px] font-black text-[#A3AED0] uppercase tracking-widest mb-1.5">NAME</label>
            <p className={`text-[14px] font-bold ${isDark ? 'text-white' : 'text-[#2B3674]'}`}>  {aadhaarData?.name || "—"}</p>
          </div>
          <div>
            <label className="block text-[10px] font-black text-[#A3AED0] uppercase tracking-widest mb-1.5">UID</label>
            <p className={`text-[14px] font-bold ${isDark ? 'text-white' : 'text-[#2B3674]'}`}>   {aadhaarData?.uid || "—"}</p>
          </div>
          <div>
            <label className="block text-[10px] font-black text-[#A3AED0] uppercase tracking-widest mb-1.5">GENDER</label>
            <p className={`text-[14px] font-bold ${isDark ? 'text-white' : 'text-[#2B3674]'}`}>  {aadhaarData?.gender || "—"}</p>
          </div>
          <div>
            <label className="block text-[10px] font-black text-[#A3AED0] uppercase tracking-widest mb-1.5">DOB</label>
            <p className={`text-[14px] font-bold ${isDark ? 'text-white' : 'text-[#2B3674]'}`}>{aadhaarData?.dob || "—"}</p>
          </div>
          <div className="md:col-span-2">
            <label className="block text-[10px] font-black text-[#A3AED0] uppercase tracking-widest mb-1.5">ADDRESS</label>
            <p className={`text-[14px] font-bold ${isDark ? 'text-white' : 'text-[#2B3674]'} leading-relaxed`}>
                {aadhaarAddress}
            </p>
          </div>
        </div>

       {/* ================= AADHAAR IMAGES ================= */}
<div className="hidden md:flex flex-col gap-3 absolute top-24 right-8 w-32">
  {aadhaarImages.length > 0 ? (
    aadhaarImages.map((img, index) => (
      <div
        key={index}
        onClick={() => setDocPreview(img)}
        className="h-20 rounded-lg overflow-hidden border border-gray-200
                   cursor-pointer bg-gray-100 hover:ring-2 ring-[#0070f3] transition-all"
      >
        <img
          src={img}
          alt="Aadhaar Preview"
          className="w-full h-full object-cover"
        />
      </div>
    ))
  ) : (
    <p className="text-sm text-gray-400">No images</p>
  )}
</div>

{docPreview && (
  <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/60 backdrop-blur-sm">
    
    {/* BACKDROP */}
    <div
      className="absolute inset-0"
      onClick={() => setDocPreview(null)}
    />

    {/* MODAL */}
    <div className="relative bg-white rounded-2xl p-4 max-w-3xl w-[90%] z-10 shadow-2xl">
      
      {/* CLOSE */}
      <button
        onClick={() => setDocPreview(null)}
        className="absolute top-3 right-3 h-9 w-9 rounded-full
        bg-black/70 text-white flex items-center justify-center hover:bg-black"
      >
        ✕
      </button>

      {/* IMAGE */}
      <img
        src={docPreview}
        alt="Aadhaar Preview"
        className="max-h-[70vh] w-full object-contain rounded-xl"
      />

      {/* DOWNLOAD */}
      <div className="mt-4 flex justify-end">
        <a
          href={docPreview}
          download
          className="px-5 py-2 bg-[#0070f3] text-white rounded-lg
          font-bold text-sm hover:bg-blue-600 transition"
        >
          ⬇ Download
        </a>
      </div>
    </div>
  </div>
)}

      </div>

      {/* PAN CARD */}
      <div className={`${isDark ? 'bg-[#111C44] border-gray-800' : 'bg-white border-transparent'} rounded-[24px] p-8 shadow-sm border relative overflow-hidden group hover:shadow-lg transition-all duration-300 mb-8`}>
        <div className="absolute top-0 right-0 p-6">
          <span className="bg-[#EEFBF3] text-[#42BE65] px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-wider flex items-center gap-2">
            <CheckCircle2 size={14} strokeWidth={3} /> Approved
          </span>
        </div>

        <div className="flex items-start gap-5 mb-8">
          <div className="h-14 w-14 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-600 flex-shrink-0">
            <FileText size={28} strokeWidth={2} />
          </div>
          <div>
            <h4 className={`text-lg font-black ${isDark ? 'text-white' : 'text-[#2B3674]'} mb-1`}>PAN Card</h4>
            <p className={`text-[13px] font-medium ${isDark ? 'text-gray-400' : 'text-[#A3AED0]'}`}>Tax Identity</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-y-6 gap-x-8 mb-8 pr-32">
          <div>
            <label className="block text-[10px] font-black text-[#A3AED0] uppercase tracking-widest mb-1.5">NAME</label>
            <p className={`text-[14px] font-bold ${isDark ? 'text-white' : 'text-[#2B3674]'} uppercase`}>{panData?.name_pan_card || "—"}</p>
          </div>
          <div>
            <label className="block text-[10px] font-black text-[#A3AED0] uppercase tracking-widest mb-1.5">PAN NUMBER</label>
            <p className={`text-[14px] font-bold ${isDark ? 'text-white' : 'text-[#2B3674]'}`}>{panData?.pan || panNumber || "—"}</p>
          </div>
          <div>
            <label className="block text-[10px] font-black text-[#A3AED0] uppercase tracking-widest mb-1.5">DOB</label>
            <p className={`text-[14px] font-bold ${isDark ? 'text-white' : 'text-[#2B3674]'}`}>{panData?.dob || "—"}</p>
          </div>
          <div>
            <label className="block text-[10px] font-black text-[#A3AED0] uppercase tracking-widest mb-1.5">TYPE</label>
            <p className={`text-[14px] font-bold ${isDark ? 'text-white' : 'text-[#2B3674]'}`}>{panData?.type || "—"}</p>
          </div>
        </div>

      {/* ================= PAN IMAGE ================= */}
<div className="hidden md:flex flex-col gap-3 absolute top-24 right-8 w-32">
  {panImage ? (
    <div
      onClick={() => setDocPreview(panImage)}
      className="h-20 rounded-lg overflow-hidden border border-gray-200
      cursor-pointer bg-gray-100 hover:ring-2 ring-purple-500 transition-all"
    >
      <img
        src={panImage}
        alt="PAN Card"
        className="h-full w-full object-cover"
      />
    </div>
  ) : (
    <div className="h-20 flex items-center justify-center text-xs text-gray-400 bg-gray-100 rounded-lg">
      No Image
    </div>
  )}
</div>


      </div>

      {/* DRIVING LICENSE */}
      <div className={`${isDark ? 'bg-[#111C44] border-gray-800' : 'bg-white border-transparent'} rounded-[24px]  h-95   p-8 shadow-sm border relative overflow-hidden group hover:shadow-lg transition-all duration-300 mb-8`}>
        <div className="absolute top-0 right-0 p-6">
          <span className="bg-[#FFF8E7] text-[#FFB800] px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-wider flex items-center gap-2">
            <Clock size={14} strokeWidth={3} /> Pending Review
          </span>
        </div>

        <div className="flex items-start gap-5 mb-8">
          <div className="h-14 w-14 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-500 flex-shrink-0">
            <Car size={28} strokeWidth={2} />
          </div>
          <div>
            <h4 className={`text-lg font-black ${isDark ? 'text-white' : 'text-[#2B3674]'} mb-1`}>Driving License</h4>
            <p className={`text-[13px] font-medium ${isDark ? 'text-gray-400' : 'text-[#A3AED0]'}`}>Vehicle Authorization</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-y-6 gap-x-8 mb-8 pr-32">
          <div>
            <label className="block text-[10px] font-black text-[#A3AED0] uppercase tracking-widest mb-1.5">NAME</label>
            <p className={`text-[14px] font-bold ${isDark ? 'text-white' : 'text-[#2B3674]'} uppercase`}>Priya</p>
          </div>
          <div>
            <label className="block text-[10px] font-black text-[#A3AED0] uppercase tracking-widest mb-1.5">DL NO</label>
            <p className={`text-[14px] font-bold ${isDark ? 'text-white' : 'text-[#2B3674]'}`}></p>
          </div>
          <div>
            <label className="block text-[10px] font-black text-[#A3AED0] uppercase tracking-widest mb-1.5">DOB</label>
            <p className={`text-[14px] font-bold ${isDark ? 'text-white' : 'text-[#2B3674]'}`}>13-07-2003</p>
          </div>
          <div>
            <label className="block text-[10px] font-black text-[#A3AED0] uppercase tracking-widest mb-1.5">EXPIRY</label>
            <p className={`text-[14px] font-bold ${isDark ? 'text-white' : 'text-[#2B3674]'}`}>12-07-2043</p>
          </div>
          <div className="md:col-span-2">
            <label className="block text-[10px] font-black text-[#A3AED0] uppercase tracking-widest mb-1.5">VEHICLE CLASSES</label>
            <p className={`text-[14px] font-bold ${isDark ? 'text-white' : 'text-[#2B3674]'}`}>LMV, MCWG</p>
          </div>
        </div>

       {/* ================= DRIVING LICENSE IMAGES ================= */}
<div className="hidden md:flex flex-col gap-3 absolute top-24 right-8 w-32">
  {dlImages.length > 0 ? (
    dlImages.map((img, index) => (
      <div
        key={index}
        onClick={() => setDocPreview(img)}
        className="h-20 rounded-lg overflow-hidden border border-gray-200
        cursor-pointer bg-gray-100 hover:ring-2 ring-orange-400 transition-all"
      >
        <img
          src={img}
          alt="DL Preview"
          className="w-full h-full object-cover"
        />
      </div>
    ))
  ) : (
    <div className="h-20 flex items-center justify-center text-xs text-gray-400 bg-gray-100 rounded-lg">
      No Image
    </div>
  )}
</div>

      </div>
{/* 🔥 KYC Note */}

{renderKycNote("documents_done")}
      {/* DOCUMENT VERIFICATION ACTIONS */}
      <div className={`${isDark ? 'bg-[#111C44] border-gray-800' : 'bg-white border-transparent'} rounded-[24px] p-6 shadow-sm border flex items-center gap-4`}>
        <button
  onClick={() => {
    setCurrentSection("documents_done"); // 🔥 IMPORTANT
    setShowApproveModal(true);
  }}
  className="flex-1 bg-[#0070f3] text-white py-4 rounded-xl font-bold text-[14px] hover:bg-blue-600 transition-all shadow-lg shadow-blue-500/20 active:scale-[0.98] uppercase tracking-wider"
>
  Approve
</button>

      
      <button
  onClick={() => {
    setCurrentSection("documents_done");  // 🔥 IMPORTANT
    setShowRejectModal(true);
  }}
  className={`flex-1 ${
    isDark
      ? "bg-transparent border-gray-700 text-red-400"
      : "bg-transparent border-red-100 text-red-500"
  } border py-4 rounded-xl font-bold text-[14px]
  hover:bg-red-50 transition-all active:scale-[0.98] uppercase tracking-wider`}
>
  Reject
</button>

      </div>
    </div>
    )}
    {/* Section 3:Vehicle Verification */}
   {/* ================= VEHICLE VERIFICATION ================= */}
   {(rcVehicle || nonRcVehicle) && (
<div className="bg-white rounded-2xl border p-6">
  {/* HEADER */}
  <div className="flex items-center gap-2 mb-4">
    <Car className="text-blue-600" size={22} />
    <h3 className="text-[16px] font-bold text-[#2B3674]">
      Vehicle Verification
    </h3>
  </div>

  {/* TABS */}
  <div className="flex gap-8 border-b mb-6 text-sm font-bold">
  <button
    onClick={() => setActiveTab("rc")}
    className={`pb-2 ${
      activeTab === "rc"
        ? "text-blue-600 border-b-2 border-blue-600"
        : "text-gray-400"
    }`}
  >
    RC Vehicle
  </button>

  <button
  onClick={() => {
    setActiveTab("nonrc");
    if (!nonRcVehicle) {
      fetchNonRcVehicle();
    }
  }}
  className={`pb-2 ${
    activeTab === "nonrc"
      ? "text-blue-600 border-b-2 border-blue-600"
      : "text-gray-400"
  }`}
>
  Non-RC Vehicle
</button>

</div>


  {/* CONTENT */}
  
  <div className="w-full">

    {/* LEFT – RC DETAILS */}
    {/* RC LOADING */}
{activeTab === "rc" && rcLoading && (
  <p className="text-sm text-gray-400">
    Loading RC vehicle details...
  </p>
)}

{/* RC DATA – FULL WIDTH */}
{activeTab === "rc" && rcVehicle && (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6 text-sm">

    <Field label="REG NO" value={rcVehicle.reg_no} blue />
    <Field label="OWNER" value={rcVehicle.owner} />

    <Field label="MANUFACTURER" value={rcVehicle.manufacturer} />
    <Field label="MANUFACTURER DATE" value={rcVehicle.manufacturing_date} />

    <div className="md:col-span-2">
      <Field label="MODEL" value={rcVehicle.model} />
    </div>

    <Field label="COLOR" value={rcVehicle.color} />
    <Field label="FUEL TYPE" value={rcVehicle.fuel_type} />

    <Field label="ENGINE NO" value={rcVehicle.engine} />
    <Field label="CHASSIS NO" value={rcVehicle.chassis} />

    <Field label="RC EXPIRY" value={rcVehicle.rc_expiry_date} />
    <Field label="RC STATUS" value={rcVehicle.rc_status} />

    <Field label="VEHICLE CATEGORY" value={rcVehicle.vehicle_category} />
    <Field label="VERIFICATION TIME" value={rcVehicle.verification_timestamp} />

    <div className="md:col-span-2">
      <Field label="PRESENT ADDRESS" value={rcVehicle.present_address} />
    </div>

    <Field label="REGISTRATION AUTHORITY" value={rcVehicle.reg_authority} />

    {/* INSURANCE */}
    <div className="md:col-span-2 bg-gray-50 rounded-xl p-4 flex justify-between items-center mt-2">
      <div>
        <p className="text-xs font-bold text-gray-400">
          INSURANCE INFORMATION
        </p>
        <p className="font-bold text-sm">
          {rcVehicle.insurance_company}
        </p>
        <p className="text-xs text-gray-500">
          Valid Upto: {rcVehicle.insurance_upto}
        </p>
      </div>

      <span className="bg-green-100 text-green-600 text-xs font-bold px-3 py-1 rounded-md">
        ACTIVE
      </span>
    </div>

  </div>
)}


    {/* RIGHT – NON RC SUMMARY */}
   {activeTab === "nonrc" && nonRcVehicle && (
  <div className="bg-blue-50 rounded-xl p-5 text-sm">
    <h4 className="text-blue-600 font-bold mb-4">
      NON-RC VEHICLE SUMMARY
    </h4>

    <div className="grid grid-cols-2 gap-y-5 gap-x-6">
      <div>
        <p className="text-gray-400 font-bold">UNIQUE MARKER</p>
        <p className="font-bold">{nonRcVehicle.unique_marker}</p>
      </div>

      <div>
        <p className="text-gray-400 font-bold">MODEL</p>
        <p className="font-bold">{nonRcVehicle.model}</p>
      </div>

      <div>
        <p className="text-gray-400 font-bold">COLOR</p>
        <p className="font-bold">{nonRcVehicle.color}</p>
      </div>

      <div>
        <p className="text-gray-400 font-bold">VEHICLE TYPE</p>
        <p className="font-bold">{nonRcVehicle.vehicle_type}</p>
      </div>

      <div>
        <p className="text-gray-400 font-bold">BRAND</p>
        <p className="font-bold">{nonRcVehicle.brand}</p>
      </div>

      <div>
        <p className="text-gray-400 font-bold">GENERATED ID</p>
        <p className="font-bold">{nonRcVehicle.generated_id}</p>
      </div>

      <div>
        <p className="text-gray-400 font-bold">VERIFICATION TYPE</p>
        <p className="font-bold capitalize">
          {nonRcVehicle.verification_type.replace("_", " ")}
        </p>
      </div>

      <div>
        <p className="text-gray-400 font-bold">APPROVAL CHANCE</p>
        <p className="font-bold text-orange-500">
          {nonRcVehicle.approval_chance}
        </p>
      </div>

      <div className="col-span-2">
        <p className="text-gray-400 font-bold">VERIFICATION TIME</p>
        <p className="font-bold">{nonRcVehicle.verification_timestamp}</p>
      </div>

      <div className="col-span-2">
        <p className="text-gray-400 font-bold">SUBMISSION DATE</p>
        <p className="font-bold">{nonRcVehicle.submission_date}</p>
      </div>

      {/* ================= FRONT IMAGE ================= */}
     {/* ================= FRONT IMAGE ================= */}
{/* ================= FRONT IMAGE ================= */}
<div>
  <p className="text-gray-400 font-bold mb-2">FRONT IMAGE</p>

  <div
    onClick={() => nonRcVehicle.front_url && setPreviewImage(nonRcVehicle.front_url)}
    className="w-full h-44 rounded-xl border border-dashed border-blue-300
    bg-white flex items-center justify-center overflow-hidden cursor-pointer
    hover:ring-2 hover:ring-blue-400 transition"
  >
    {nonRcVehicle.front_url ? (
      <img
        src={nonRcVehicle.front_url}
        alt="Front View"
        className="h-full w-full object-cover"
      />
    ) : (
      <span className="text-xs text-gray-400">No Image</span>
    )}
  </div>
</div>

{/* ================= SIDE IMAGE ================= */}
<div>
  <p className="text-gray-400 font-bold mb-2">SIDE IMAGE</p>

  <div
    onClick={() => nonRcVehicle.side_url && setPreviewImage(nonRcVehicle.side_url)}
    className="w-full h-44 rounded-xl border border-dashed border-blue-300
    bg-white flex items-center justify-center overflow-hidden cursor-pointer
    hover:ring-2 hover:ring-blue-400 transition"
  >
    {nonRcVehicle.side_url ? (
      <img
        src={nonRcVehicle.side_url}
        alt="Side View"
        className="h-full w-full object-cover"
      />
    ) : (
      <span className="text-xs text-gray-400">No Image</span>
    )}
  </div>
</div>
{/* Image Modal */}
{/* Image Modal */}
{previewImage && (
  <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/70 backdrop-blur-md">
    
    {/* Backdrop */}
    <div
      className="absolute inset-0"
      onClick={() => setPreviewImage(null)}
    />

    {/* Modal */}
    <div
      className="relative bg-white rounded-3xl p-6
      max-w-5xl w-[95%] shadow-2xl z-10"
    >
      
      {/* Close Button */}
      <button
        onClick={() => setPreviewImage(null)}
        className="absolute top-4 right-4 h-10 w-10 rounded-full
        bg-black/80 text-white flex items-center justify-center
        hover:bg-black transition text-lg"
      >
        ✕
      </button>

      {/* Image */}
      <img
        src={previewImage}
        alt="Preview"
        className="max-h-[85vh] w-full object-contain rounded-2xl"
      />

      {/* Download Button */}
      <div className="mt-5 flex justify-end">
        <a
          href={previewImage}
          download
          className="px-6 py-2.5 bg-blue-600 text-white
          rounded-xl font-bold text-sm hover:bg-blue-700 transition"
        >
          ⬇ Download Image
        </a>
      </div>
    </div>
  </div>
)}




      {/* STATUS */}
      <div className="col-span-2 flex justify-end">
        <span className="bg-orange-100 text-orange-600 text-xs font-bold px-3 py-1 rounded-md uppercase">
          {nonRcVehicle.status}
        </span>
      </div>
    </div>
  </div>
)}

  </div>
  

  {/* ACTION BUTTONS */}
 {/* <div className="flex gap-6 mt-10">
  
  <button
    onClick={() => {
      setApproveContext("vehicle");
      setShowApproveModal(true);
    }}
    className="flex-1 bg-blue-600 text-white py-4 rounded-xl font-bold
    flex items-center justify-center gap-2"
  >
    <CheckCircle2 size={18} />
    Approve Vehicle
  </button>

  
  <button
    onClick={() => {
      setApproveContext("vehicle");
      setShowRejectModal(true);
    }}
    className="flex-1 border border-red-300 text-red-500 py-4 rounded-xl
    font-bold flex items-center justify-center gap-2"
  >
    <XCircle size={18} />
    Reject
  </button>
</div> */}
{renderKycNote("vehicle_done")}
<div className="flex gap-6 mt-10">
  <button
    onClick={() => {
      setCurrentSection("vehicle_done");
      setShowApproveModal(true);
    }}
    className="flex-1 bg-blue-600 text-white py-4 rounded-xl font-bold
    flex items-center justify-center gap-2"
  >
    <CheckCircle2 size={18} />
    Approve Vehicle
  </button>

  <button
    onClick={() => {
      setCurrentSection("vehicle_done");
      setShowRejectModal(true);
    }}
    className="flex-1 border border-red-300 text-red-500 py-4 rounded-xl
    font-bold flex items-center justify-center gap-2"
  >
    <XCircle size={18} />
    Reject
  </button>
</div>

</div>
   )}



  </div>

  {/* RIGHT COLUMN - ALL RIGHT SIDE CONTENT (1/3 width) */}
  <div className="xl:col-span-1 flex flex-col gap-8 sticky top-8 h-fit">
    {/* SECTION 1: PAYMENT DETAILS */}
   {/* SECTION 1: PAYMENT DETAILS */}
<div className={`${isDark ? 'bg-[#111C44] border-gray-800' : 'bg-white border-transparent'} rounded-[24px] p-6 shadow-sm border`}>
  <div className="flex items-center gap-2 mb-6">
    <div className="h-8 w-8 rounded-lg bg-blue-50 flex items-center justify-center text-[#0070f3]">
      💳
    </div>
    <h3 className={`text-[16px] font-black ${isDark ? 'text-white' : 'text-[#2B3674]'}`}>
      Payment Details
    </h3>
  </div>

  {paymentLoading ? (
    <p className="text-[13px] font-bold text-[#A3AED0]">Loading payment...</p>
  ) : paymentData ? (
    <>
      {/* STATUS */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-[11px] font-black uppercase text-[#A3AED0]">Status</p>
        <span
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black uppercase
          ${isSuccess ? 'bg-[#EEFBF3] text-[#42BE65]' : 'bg-[#FFF1F1] text-[#E31A1A]'}`}
        >
          <span className={`h-2 w-2 rounded-full ${isSuccess ? 'bg-[#42BE65]' : 'bg-[#E31A1A]'}`} />
          {paymentStatus}
        </span>
      </div>

      {/* PAYMENT ID */}
      <div className="mb-4">
        <p className="text-[11px] font-black uppercase text-[#A3AED0] mb-1">
          Payment ID
        </p>
        <div className={`${isDark ? 'bg-[#1B254B] text-gray-300' : 'bg-[#F4F7FE] text-[#2B3674]'} px-3 py-2 rounded-lg text-[12px] font-bold break-all`}>
          {paymentId}
        </div>
      </div>

      {/* AMOUNT + GATEWAY */}
      <div className="grid grid-cols-2 gap-6 mb-4">
        <div>
          <p className="text-[11px] font-black uppercase text-[#A3AED0] mb-1">Amount</p>
          <p className={`text-[14px] font-black ${isDark ? 'text-white' : 'text-[#2B3674]'}`}>
            {amount} {currency}
          </p>
        </div>
        <div>
          <p className="text-[11px] font-black uppercase text-[#A3AED0] mb-1">Gateway</p>
          <p className={`text-[14px] font-black ${isDark ? 'text-white' : 'text-[#2B3674]'}`}>
            {gateway}
          </p>
        </div>
      </div>

      {/* MERCHANT REF ID */}
      <div className="mb-4">
        <p className="text-[11px] font-black uppercase text-[#A3AED0] mb-1">
          Merchant Reference ID
        </p>
        <p className={`text-[12px] font-bold ${isDark ? 'text-gray-300' : 'text-[#2B3674]'} break-all`}>
          {merchantRefId}
        </p>
      </div>

      {/* TYPE + TIME */}
      <div className="grid grid-cols-2 gap-6">
        <div>
          <p className="text-[11px] font-black uppercase text-[#A3AED0] mb-1">
            Payment Type
          </p>
          <span className={`inline-block px-2.5 py-1 rounded-md ${isDark ? 'bg-[#1B254B] text-blue-400' : 'bg-[#EBF3FF] text-[#0070f3]'} text-[11px] font-black uppercase`}>
            {paymentType}
          </span>
        </div>

        <div>
          <p className="text-[11px] font-black uppercase text-[#A3AED0] mb-1">
            Timestamp
          </p>
          <p className={`text-[12px] font-bold ${isDark ? 'text-gray-300' : 'text-[#2B3674]'}`}>
            {timestamp}
          </p>
        </div>
      </div>
    </>
  ) : (
    <p className="text-[13px] font-bold text-[#A3AED0]">
      No payment found
    </p>
  )}
</div>


    {/* SECTION 2: KYC SUMMARY */}
    <div className={`${isDark ? 'bg-[#111C44] border-gray-800' : 'bg-white border-transparent'} rounded-[24px] p-6 shadow-sm border`}>
      <div className="flex items-center gap-3 mb-6">
        <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${isDark ? 'bg-[#1B254B]' : 'bg-blue-50'}`}>
          <CheckCircle2 size={20} className="text-[#0070f3]" />
        </div>
        <h4 className={`text-lg font-black ${isDark ? 'text-white' : 'text-[#2B3674]'}`}>KYC Summary</h4>
      </div>

      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[11px] font-black uppercase text-[#A3AED0]">Aadhaar Number</p>
            <p className={`text-[14px] font-bold ${isDark ? 'text-white' : 'text-[#2B3674]'}`}>860578036645</p>
          </div>
          <span className="flex items-center gap-1.5 bg-[#EEFBF3] text-[#42BE65] px-3 py-1.5 rounded-lg text-[11px] font-black uppercase">
            <CheckCircle2 size={14} /> Verified
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-[11px] font-black uppercase text-[#A3AED0]">PAN Number</p>
            <p className={`text-[14px] font-bold ${isDark ? 'text-white' : 'text-[#2B3674]'}`}>HFRPM8350C</p>
          </div>
          <span className="flex items-center gap-1.5 bg-[#EEFBF3] text-[#42BE65] px-3 py-1.5 rounded-lg text-[11px] font-black uppercase">
            <CheckCircle2 size={14} /> Verified
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-[11px] font-black uppercase text-[#A3AED0]">Driving License</p>
            <p className={`text-[14px] font-bold ${isDark ? 'text-white' : 'text-[#2B3674]'}`}>—</p>
          </div>
          <span className="flex items-center gap-1.5 bg-[#FFF1F1] text-[#E31A1A] px-3 py-1.5 rounded-lg text-[11px] font-black uppercase">
            <XCircle size={14} /> Not Verified
          </span>
        </div>
      </div>

      <div className="my-6 h-px bg-gray-100 dark:bg-gray-800"></div>

      <div className="mt-4">
        <p className="text-[11px] font-black uppercase tracking-wider text-[#A3AED0] mb-1">
          Verification Timestamp
        </p>
        <div className="flex items-center gap-2 text-[13px] font-bold text-[#2B3674] dark:text-gray-300">
          <Calendar size={14} className="text-[#A3AED0]" />
          <span>09-02-2026 16:35:59</span>
        </div>
      </div>
    </div>

    {/* SECTION 3: BANK DETAILS */}
{/* SECTION 3: BANK DETAILS */}
{bankLoading ? (
  <div className="text-sm text-gray-400 p-6">
    Loading bank details...
  </div>
) : !bankDetails ? (
  <div className="text-sm text-red-500 p-6">
    Bank details not available
  </div>
) : (
  <div
    className={`rounded-[24px] p-6 border shadow-sm
    ${isDark ? "bg-[#111C44] border-gray-800" : "bg-white border-gray-200"}`}
  >
    {/* Header */}
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
          <Landmark size={20} strokeWidth={2.5} />
        </div>
        <h4
          className={`text-lg font-extrabold ${
            isDark ? "text-white" : "text-[#2B3674]"
          }`}
        >
          Bank Details
        </h4>
      </div>

      <span
        className={`px-3 py-1 text-xs font-bold rounded-full
        ${getStatusStyles(bankDetails.accountStatus)}`}
      >
        {bankDetails.accountStatus}
      </span>
    </div>

    {/* Account Holder */}
    <div className="mb-4">
      <p className="text-[11px] font-bold text-gray-400 uppercase mb-1">
        Account Holder Name
      </p>
      <p
        className={`text-[15px] font-extrabold ${
          isDark ? "text-white" : "text-[#2B3674]"
        }`}
      >
        {bankDetails.nameAtBank}
      </p>
    </div>

    {/* Bank Card */}
    <div
      className={`rounded-2xl p-5 border mb-4
      ${isDark ? "bg-[#1B254B] border-gray-700" : "bg-[#F9FBFF] border-blue-100"}`}
    >
      <p className="text-[11px] font-extrabold text-blue-600 uppercase tracking-widest mb-2">
        {bankDetails.bankName}
      </p>

      <p
        className={`text-[20px] font-black tracking-widest mb-4
        ${isDark ? "text-white" : "text-[#2B3674]"}`}
      >
        {bankDetails.accountNumber}
      </p>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">
            IFSC Code
          </p>
          <p
            className={`text-[13px] font-bold ${
              isDark ? "text-white" : "text-[#2B3674]"
            }`}
          >
            {bankDetails.ifscCode}
          </p>
        </div>

        <div>
          <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">
            Branch
          </p>
          <p
            className={`text-[13px] font-bold ${
              isDark ? "text-white" : "text-[#2B3674]"
            }`}
          >
            {bankDetails.branchName}
          </p>
        </div>
      </div>
    </div>

    {/* City / State */}
    <div className="grid grid-cols-2 gap-4 mb-4">
      <div>
        <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">
          City
        </p>
        <p
          className={`text-[13px] font-bold ${
            isDark ? "text-white" : "text-[#2B3674]"
          }`}
        >
          {bankDetails.city}
        </p>
      </div>

      <div>
        <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">
          State
        </p>
        <p
          className={`text-[13px] font-bold ${
            isDark ? "text-white" : "text-[#2B3674]"
          }`}
        >
          {bankDetails.ifscDetails?.state || "—"}
        </p>
      </div>
    </div>

    {/* Address */}
    <div className="mb-4">
      <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">
        Full Address
      </p>
      <p
        className={`text-[13px] font-semibold leading-relaxed ${
          isDark ? "text-gray-200" : "text-[#2B3674]"
        }`}
      >
        {bankDetails.ifscDetails?.address || "—"}
      </p>
    </div>

   
  
  {renderKycNote("bank_done")}

<div className="flex gap-4">
  <button
    onClick={() => {
      setCurrentSection("bank_done");
      setShowApproveModal(true);
    }}
    className="flex-1 bg-[#0070f3] text-white py-3 rounded-xl
    font-bold text-sm hover:bg-blue-600 transition-all"
  >
    Approve
  </button>

  <button
    onClick={() => {
      setCurrentSection("bank_done");
      setShowRejectModal(true);
    }}
    className="flex-1 border border-red-300 text-red-500 py-3
    rounded-xl font-bold text-sm hover:bg-red-50 transition-all"
  >
    Reject
  </button>
</div>

  </div>
)}

{/* Section 4 */}
{/* ================= EDUCATION DETAILS ================= */}


{!educationLoading && educationData && (
  <div
    className={`rounded-[24px] p-6 border shadow-sm mt-8
    ${isDark ? "bg-[#111C44] border-gray-800" : "bg-white border-gray-200"}`}
  >
    <div className="flex items-center gap-3 mb-6">
      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
        🎓
      </div>
      <h4 className={`text-lg font-extrabold ${isDark ? "text-white" : "text-[#2B3674]"}`}>
        Education Details
      </h4>
    </div>

    <div className="mb-4">
      <p className="text-[11px] font-bold text-gray-400 uppercase mb-1">
        Highest Qualification
      </p>
      <p className="text-[15px] font-extrabold">
        {educationData.highestQualification}
      </p>
    </div>

    <div className="mb-4">
      <p className="text-[11px] font-bold text-gray-400 uppercase mb-1">
        Status
      </p>
      <span className="inline-block bg-green-100 text-green-600 text-xs font-bold px-3 py-1 rounded-md">
        {educationData.status}
      </span>
    </div>

    <div className="mb-6">
      <p className="text-[11px] font-bold text-gray-400 uppercase mb-1">
        Upload Timestamp
      </p>
      <p className="text-[13px] font-bold">
        {educationData.upload_timestamp}
      </p>
    </div>
      {renderKycNote("education_done")}

  <div className="flex gap-4">
  <button
    onClick={() => {
      setCurrentSection("education_done");
      setShowApproveModal(true);
    }}
    className="flex-1 bg-[#0070f3] text-white py-3 rounded-xl
    font-bold text-sm hover:bg-blue-600 transition-all"
  >
    Approve
  </button>

  <button
    onClick={() => {
      setCurrentSection("education_done");
      setShowRejectModal(true);
    }}
    className="flex-1 border border-red-300 text-red-500 py-3
    rounded-xl font-bold text-sm hover:bg-red-50 transition-all"
  >
    Reject
  </button>
</div>
  </div>
)}

{/* Residential Proof */}
 {!residentialLoading && residentialData && (
  <div
    className={`rounded-[24px] p-6 border shadow-sm mt-8
    ${isDark ? "bg-[#111C44] border-gray-800" : "bg-white border-gray-200"}`}
  >
    <div className="flex items-center gap-3 mb-6">
      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
        📍
      </div>
      <h4 className={`text-lg font-extrabold ${isDark ? "text-white" : "text-[#2B3674]"}`}>
        Residential Proof
      </h4>
    </div>

    <div className="grid grid-cols-2 gap-y-4 gap-x-6 mb-4">
      <div>
        <p className="text-[11px] font-bold text-gray-400 uppercase mb-1">City</p>
        <p className="text-[14px] font-bold">
          {residentialData.city}
        </p>
      </div>

      <div>
        <p className="text-[11px] font-bold text-gray-400 uppercase mb-1">State</p>
        <p className="text-[14px] font-bold">
          {residentialData.state}
        </p>
      </div>

      <div>
        <p className="text-[11px] font-bold text-gray-400 uppercase mb-1">Pin Code</p>
        <p className="text-[14px] font-bold">
          {residentialData.pincode}
        </p>
      </div>

      <div>
        <p className="text-[11px] font-bold text-gray-400 uppercase mb-1">Proof Type</p>
        <p className="text-[14px] font-bold text-blue-600 capitalize">
          {residentialData.proofType?.replace("_", " ")}
        </p>
      </div>
    </div>
     <div className="flex gap-4 mt-6">
    <button
      className="flex-1 bg-[#0070f3] text-white py-3 rounded-xl font-bold text-sm hover:bg-blue-600 transition-all"
    >
      Approve
    </button>

    <button
      className="flex-1 border border-red-300 text-red-500 py-3 rounded-xl font-bold text-sm hover:bg-red-50 transition-all"
    >
      Reject
    </button>
  </div>
  </div>
)}
 





  </div>
</div>
      </div>

      {/* --- APPROVE CONFIRMATION MODAL --- */}
{/* --- APPROVE / REJECT CHOICE MODAL --- */}
{showApproveModal && (
  <div className="fixed inset-0 z-[400] flex items-center justify-center p-4">
    {/* Backdrop */}
    <div
      className="absolute inset-0 bg-black/40 backdrop-blur-sm"
      onClick={() => setShowApproveModal(false)}
    />

    {/* Modal */}
    <div
      className={`relative w-full max-w-[360px] rounded-[28px] p-6 shadow-2xl border text-center
      ${isDark ? "bg-[#111C44] border-gray-800" : "bg-white"}`}
    >
      {/* Icon */}
      <div
        className={`mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full
        ${isDark ? "bg-[#1B254B]" : "bg-blue-50"}`}
      >
        <ShieldCheck size={28} className="text-[#0070f3]" />
      </div>

      {/* Title */}
   <h3 className={`text-xl font-black mb-2 ${
  isDark ? "text-white" : "text-[#2B3674]"
}`}>
  {currentSection === "vehicle_done"
    ? "Approve Vehicle"
    : currentSection === "bank_done"
    ? "Approve Bank Details"
    : currentSection === "education_done"
    ? "Approve Education"
    : currentSection === "address_done"
    ? "Approve Address"
    : currentSection === "documents_done"
    ? "Approve Documents"
    : "Approve Partner"}
</h3>



      {/* Description */}
      <p
        className={`text-[13px] mb-8 ${
          isDark ? "text-gray-400" : "text-[#707EAE]"
        }`}
      >
        Choose an action for this partner
      </p>

      {/* BUTTON ROW */}
      <div className="flex gap-3">
        {/* REVIEW */}
        <button
          onClick={() => {
            // 👉 future me review flow / notes screen
            setShowApproveModal(false);
          }}
          className={`flex-1 py-3 rounded-2xl font-black text-[13px] uppercase
          ${
            isDark
              ? "bg-[#1B254B] text-white hover:bg-[#232D65]"
              : "bg-gray-100 text-[#2B3674] hover:bg-gray-200"
          } transition-all`}
        >
          REVIEW
        </button>

        {/* APPROVE */}
<button
  disabled={actionLoading}
  onClick={async () => {
    if (!currentSection) return;

    try {
      setActionLoading(true);

      // 1️⃣ Update section status
      // await updateVerificationStatus(currentSection, true);
if (currentSection === "kyc_success") {
  await updatePartnerFinalStatus(true);
} else {
  await updateVerificationStatus(currentSection, true);

  await saveKycLiveStatus(
    currentSection,
    true,
    `${currentSection.replace("_done", "")} verified`
  );
}

      


      
      // 🔥 refresh that section note only
const updatedNote = await fetchSingleKycNote(currentSection);

if (updatedNote) {
  setKycNotes(prev => ({
    ...prev,
    [currentSection]: updatedNote
  }));
}
     // 3️⃣ Get fresh verification status directly
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
  const freshData = json.data;

  const updatedAllApproved =
    approvalKeys.every((key) => freshData?.[key] === true);

  if (updatedAllApproved) {
    await updatePartnerFinalStatus(true);
  }

  setVerificationData(freshData); // update UI
}


      // Close modal
      setShowApproveModal(false);
      setCurrentSection(null);

    } catch (error) {
      console.error("Approve failed", error);
    } finally {
      setActionLoading(false);
    }
  }}
  className="flex-1 py-3 rounded-2xl font-black text-[13px]
  bg-[#0070f3] text-white hover:bg-blue-600 transition-all uppercase
  disabled:opacity-60 disabled:cursor-not-allowed"
>
  {actionLoading ? (
    <div className="flex items-center justify-center gap-2">
      <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
      Processing...
    </div>
  ) : (
    "APPROVE"
  )}
</button>




      </div>
    </div>
  </div>
)}

{/* --- STEP APPROVE / REJECT MODAL --- */}
{showStepModal && (

  <div key={selectedStep?.label + stepAction} className="fixed inset-0 z-[500] flex items-center justify-center p-4">
    
    <div
      className="absolute inset-0 bg-black/40 backdrop-blur-sm"
    onClick={() => {
  setShowStepModal(false);
  setSelectedStep(null);
  setStepAction(null);
}}
    ></div>

    <div className={`relative w-full max-w-[380px] rounded-[28px] p-6 shadow-2xl border text-center
      ${isDark ? "bg-[#111C44] border-gray-800" : "bg-white"}`}>

      <h3 className={`text-xl font-black mb-3 ${
        isDark ? "text-white" : "text-[#2B3674]"
      }`}>
        {stepAction === "approve"
          ? "Approve Confirmation"
          : "Reject Confirmation"}
      </h3>

      <p className={`text-[13px] mb-8 ${
        isDark ? "text-gray-400" : "text-[#707EAE]"
      }`}>
        {stepAction === "approve"
          ? `Are you sure you want to approve the "${selectedStep?.label
              .replace("_done", "")
              .replace(/_/g, " ")}" step?`
          : `Are you sure you want to reject the "${selectedStep?.label
              .replace("_done", "")
              .replace(/_/g, " ")}" step?`}
      </p>

      <div className="flex gap-3">
        <button
        onClick={() => {
  setShowStepModal(false);
  setSelectedStep(null);
  setStepAction(null);
}}
          className={`flex-1 py-3 rounded-2xl font-black text-[13px]
            ${isDark
              ? "bg-[#1B254B] text-white"
              : "bg-gray-100 text-[#2B3674]"}`}
        >
          Cancel
        </button>

        <button
          onClick={() => {
            console.log("Step:", selectedStep);
            console.log("Action:", stepAction);
            updateStepStatus()
            // 👉 API CALL YAHAN LAGANI HAI

          
          }}
          className={`flex-1 py-3 rounded-2xl font-black text-[13px] text-white
            ${
              stepAction === "approve"
                ? "bg-[#0070f3] hover:bg-blue-600"
                : "bg-red-500 hover:bg-red-600"
            }`}
        >
          Confirm
        </button>
      </div>
    </div>
  </div>
)}




{/* --- REJECT CONFIRMATION MODAL --- */}
{showRejectModal && (
  <div className="fixed inset-0 z-[400] flex items-center justify-center p-4">
    {/* Backdrop */}
    <div
      className="absolute inset-0 bg-black/40 backdrop-blur-sm"
      onClick={() => {
        setShowRejectModal(false);
        setRejectReason("");
      }}
    ></div>

    {/* Modal */}
    <div
      className={`relative w-full max-w-[360px] rounded-[28px] p-6 shadow-2xl border text-center
      ${isDark ? "bg-[#111C44] border-gray-800" : "bg-white"}`}
    >
      <div
        className={`mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full
        ${isDark ? "bg-red-900/20" : "bg-red-50"}`}
      >
        <XCircle size={28} className="text-red-500" />
      </div>

      {/* <h3
        className={`text-xl font-black mb-2 ${
          isDark ? "text-white" : "text-[#2B3674]"
        }`}
      >
        Reject Partner
      </h3> */}
<h3 className={`text-xl font-black mb-2 ${
  isDark ? "text-white" : "text-[#2B3674]"
}`}>
  {currentSection === "vehicle_done"
    ? "Reject Vehicle"
    : currentSection === "bank_done"
    ? "Reject Bank Details"
    : currentSection === "education_done"
    ? "Reject Education"
    : currentSection === "address_done"
    ? "Reject Address"
    : currentSection === "documents_done"
    ? "Reject Documents"
    : "Reject Partner"}
</h3>

      <p
        className={`text-[13px] mb-4 ${
          isDark ? "text-gray-400" : "text-[#707EAE]"
        }`}
      >
        Please provide a reason for rejection
      </p>

      <textarea
        value={rejectReason}
        onChange={(e) => setRejectReason(e.target.value)}
        placeholder="Enter rejection reason..."
        rows={4}
        className={`w-full p-3 rounded-xl text-[13px] font-medium mb-6 resize-none outline-none
        ${
          isDark
            ? "bg-[#1B254B] text-white placeholder-gray-400"
            : "bg-gray-100 text-[#2B3674] placeholder-gray-500"
        }`}
      />

      {/* BUTTON ROW */}
      <div className="flex gap-3">
        {/* BACK – LEFT */}
        <button
          onClick={() => {
            setShowRejectModal(false);
            setRejectReason("");
          }}
          className={`flex-1 py-3 rounded-2xl font-black text-[13px]
          ${isDark ? "bg-[#1B254B] text-white" : "bg-gray-100 text-[#2B3674]"}`}
        >
          BACK
        </button>
<button
  disabled={!rejectReason.trim() || actionLoading}
 onClick={async () => {
  if (!currentSection) return;

  try {
    setActionLoading(true);

    // 1️⃣ Update section false
 if (currentSection === "kyc_success") {
  await updatePartnerFinalStatus(false);
} else {
  await updateVerificationStatus(currentSection, false);

  await saveKycLiveStatus(
    currentSection,
    false,
    rejectReason
  );
}

    // 🔥 refresh that section note only
const updatedNote = await fetchSingleKycNote(currentSection);

if (updatedNote) {
  setKycNotes(prev => ({
    ...prev,
    [currentSection]: updatedNote
  }));
}

    // 3️⃣ 🔥 Fetch latest verification status
    const res = await fetch(
      `https://api.bijliwalaaya.in/api/partner/verification-status/${params.id}`,
      {
        headers: { "x-api-token": "super_secure_token" },
      }
    );

    const json = await res.json();

    if (json.success) {
      const freshData = json.data;

      const updatedAllApproved =
        approvalKeys.every((key) => freshData?.[key] === true);

      // ❌ If NOT all approved → partner should be false
      if (!updatedAllApproved) {
        await updatePartnerFinalStatus(false);
      }

      setVerificationData(freshData);
    }

    // Close modal
    setShowRejectModal(false);
    setRejectReason("");
    setCurrentSection(null);

  } catch (error) {
    console.error("Reject failed", error);
  } finally {
    setActionLoading(false);
  }
}}


  
  className={`flex-1 py-3 rounded-2xl font-black text-[13px]
  ${
    rejectReason.trim() && !actionLoading
      ? "bg-red-500 text-white hover:bg-red-600"
      : "bg-gray-300 text-gray-500 cursor-not-allowed"
  }`}
>
  {actionLoading ? (
    <div className="flex items-center justify-center gap-2">
      <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
      Processing...
    </div>
  ) : (
    "REJECT"
  )}
</button>



      </div>
    </div>
  </div>
)}



      {showConfirm && (
  <div className="fixed inset-0 z-[400] flex items-center justify-center p-4">
    {/* Backdrop */}
    <div
      className="absolute inset-0 bg-black/40 backdrop-blur-sm"
      onClick={() => setShowConfirm(false)}
    ></div>

    {/* Modal */}
    <div className={`relative w-full max-w-[340px] rounded-[28px] p-6 shadow-2xl border text-center
      ${isDark ? 'bg-[#111C44] border-gray-800' : 'bg-white'}`}>

      <h3 className={`text-xl font-black mb-2 ${isDark ? 'text-white' : 'text-[#2B3674]'}`}>
        Confirmation
      </h3>

      <p className={`text-[13px] mb-8 ${isDark ? 'text-gray-400' : 'text-[#707EAE]'}`}>
        Are you sure you want to increase verification attempt?
      </p>

      <div className="flex flex-col gap-3">
        <button
          onClick={handleIncrement}
          className="w-full py-3 bg-[#0070f3] text-white rounded-2xl font-black hover:bg-blue-600"
        >
          Confirm
        </button>

        <button
          onClick={() => setShowConfirm(false)}
          className={`w-full py-3 rounded-2xl font-black
            ${isDark ? 'bg-[#1B254B] text-white' : 'bg-gray-100 text-[#2B3674]'}`}
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
