
"use client";

import { useState, useEffect } from "react";

// Types based on your backend data structure
interface Offer {
  _id: string;
  promoCode?: string;
  title: string;
  description?: string;
  type: "CASHBACK" | "DISCOUNT" | "FLAT_OFF" | "FREE_SERVICE";
  value: number;
  maxDiscount?: number | null;
  
  brandName?: string;
  brandLogo?: string;
  bannerImage?: string;
  bannerColor?: string;
  showOnHome?: boolean;
  priority?: number;
  
  applicableModes?: string[];
  mainCategories?: string[];
  subCategories?: string[];
  childCategories?: string[];
  deepChildCategories?: string[];
  subDeepChildCategories?: string[];
  
  mainCategoryIds?: string[];
  subCategoryIds?: string[];
  childCategoryIds?: string[];
  deepChildCategoryIds?: string[];
  subDeepChildCategoryIds?: string[];
  
  paymentMethods?: string[];
  minOrderValue?: number;
  maxOrderValue?: number | null;
  totalLimit?: number;
  usedCount?: number;
  perUserLimit?: number;
  newUserOnly?: boolean;
  userType?: "ALL" | "NEW" | "EXISTING";
  
  city?: string[];
  serviceAreas?: string[];
  
  riderConditions?: {
    minDistance?: number | null;
    maxDistance?: number | null;
    startDate?: string;
    endDate?: string;
  };
  
  vehicleType?: string[];
  startDate?: string;
  endDate?: string;
  validDays?: string[];
  validTimeSlots?: { start: string; end: string; _id?: string }[];
  validTimeslots?: { start: string; end: string; _id?: string }[];
  
  visible?: boolean;
  autoApply?: boolean;
  exclusive?: boolean;
  canCombineWithOther?: boolean;
  status?: "ACTIVE" | "INACTIVE" | "SCHEDULED" | "EXPIRED";
  
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

export default function OffersAdminPage() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingOffer, setEditingOffer] = useState<Offer | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<string>("ALL");
  const [activeTab, setActiveTab] = useState<"targeting" | "discount" | "scheduling">("targeting");

  // Fetch offers from API
  const fetchOffers = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("https://api.bijliwalaaya.in/api/offers", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-api-token": "super_secure_token",
        },
      });

      if (!res.ok) {
        console.error("HTTP Error:", res.status);
        setOffers([]);
        return;
      }

      const data = await res.json();

      if (data?.success && Array.isArray(data?.data)) {
        const formatted = data.data.map((item: any) => ({
          ...item,
          validTimeSlots: item.validTimeSlots || item.validTimeslots || [],
        }));
        setOffers(formatted);
      } else {
        setOffers([]);
      }
    } catch (error) {
      console.error("Fetch error:", error);
      setOffers([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  // Form state
  const [formData, setFormData] = useState<Partial<Offer>>({
    promoCode: "",
    title: "",
    description: "",
    type: "CASHBACK",
    value: 0,
    maxDiscount: null,
    brandName: "",
    brandLogo: "",
    bannerImage: "",
    bannerColor: "#00BAF2",
    showOnHome: false,
    priority: 0,
    applicableModes: ["SERVICE"],
    mainCategories: [],
    subCategories: [],
    childCategories: [],
    paymentMethods: [],
    minOrderValue: 0,
    maxOrderValue: null,
    totalLimit: 1000,
    perUserLimit: 1,
    newUserOnly: false,
    userType: "ALL",
    city: [],
    serviceAreas: [],
    riderConditions: {
      minDistance: null,
      maxDistance: null,
      startDate: new Date().toISOString().slice(0, 16),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16)
    },
    validDays: [],
    validTimeSlots: [{ start: "09:00", end: "18:00" }],
    visible: true,
    autoApply: false,
    exclusive: false,
    canCombineWithOther: false,
    status: "ACTIVE"
  });

  // Input states
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedSubCategories, setSelectedSubCategories] = useState<string[]>([]);
  const [selectedChildCategories, setSelectedChildCategories] = useState<string[]>([]);
  const [selectedCities, setSelectedCities] = useState<string[]>([]);
  const [selectedPaymentMethods, setSelectedPaymentMethods] = useState<string[]>([]);
  const [frequency, setFrequency] = useState<"ALWAYS" | "WEEKENDS" | "MORNING">("ALWAYS");

  const resetForm = () => {
    setFormData({
      promoCode: "",
      title: "",
      description: "",
      type: "CASHBACK",
      value: 0,
      maxDiscount: null,
      brandName: "",
      brandLogo: "",
      bannerImage: "",
      bannerColor: "#00BAF2",
      showOnHome: false,
      priority: 0,
      applicableModes: ["SERVICE"],
      mainCategories: [],
      subCategories: [],
      childCategories: [],
      paymentMethods: [],
      minOrderValue: 0,
      maxOrderValue: null,
      totalLimit: 1000,
      perUserLimit: 1,
      newUserOnly: false,
      userType: "ALL",
      city: [],
      serviceAreas: [],
      riderConditions: {
        minDistance: null,
        maxDistance: null,
        startDate: new Date().toISOString().slice(0, 16),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16)
      },
      validDays: [],
      validTimeSlots: [{ start: "09:00", end: "18:00" }],
      visible: true,
      autoApply: false,
      exclusive: false,
      canCombineWithOther: false,
      status: "ACTIVE"
    });
    setSelectedCategories([]);
    setSelectedSubCategories([]);
    setSelectedChildCategories([]);
    setSelectedCities([]);
    setSelectedPaymentMethods([]);
    setFrequency("ALWAYS");
    setEditingOffer(null);
    setActiveTab("targeting");
  };

  const openCreateModal = () => {
    resetForm();
    setIsCreateModalOpen(true);
  };

  const openEditModal = (offer: Offer) => {
    setEditingOffer(offer);
    setFormData(offer);
    setSelectedCategories(offer.mainCategories || []);
    setSelectedSubCategories(offer.subCategories || []);
    setSelectedChildCategories(offer.childCategories || []);
    setSelectedCities(offer.city || []);
    setSelectedPaymentMethods(offer.paymentMethods || []);
    setIsCreateModalOpen(true);
  };

  const openDetailsModal = (offer: Offer) => {
    setSelectedOffer(offer);
    setIsDetailsModalOpen(true);
  };

  const closeModal = () => {
    setIsDetailsModalOpen(false);
    setIsCreateModalOpen(false);
    resetForm();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev: any) => ({ ...prev, [name]: checked }));
    } else if (type === "number") {
      setFormData((prev: any) => ({ ...prev, [name]: value ? Number(value) : null }));
    } else if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev: any) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData((prev: any) => ({ ...prev, [name]: value }));
    }
  };

  const handleTimeslotChange = (index: number, field: "start" | "end", value: string) => {
    const updatedTimeslots = [...(formData.validTimeSlots || [])];
    updatedTimeslots[index] = { ...updatedTimeslots[index], [field]: value };
    setFormData((prev: any) => ({ ...prev, validTimeSlots: updatedTimeslots }));
  };

  const addTimeslot = () => {
    setFormData((prev: any) => ({
      ...prev,
      validTimeSlots: [...(prev.validTimeSlots || []), { start: "09:00", end: "18:00" }]
    }));
  };

  const removeTimeslot = (index: number) => {
    const updatedTimeslots = (formData.validTimeSlots || []).filter((_: any, i: number) => i !== index);
    setFormData((prev: any) => ({ ...prev, validTimeSlots: updatedTimeslots }));
  };

  const saveOffer = async () => {
    try {
      if (!formData.title?.trim() || !formData.value) {
        alert("Title and Value are required");
        return;
      }

      const processedData = {
        ...formData,
        promoCode: formData.promoCode || null,
        maxDiscount: formData.maxDiscount === null ? null : Number(formData.maxDiscount),
        maxOrderValue: formData.maxOrderValue === null ? null : Number(formData.maxOrderValue),
        minOrderValue: Number(formData.minOrderValue) || 0,
        value: Number(formData.value),
        priority: Number(formData.priority) || 0,
        totalLimit: Number(formData.totalLimit) || 1000,
        perUserLimit: Number(formData.perUserLimit) || 1,
        city: selectedCities,
        paymentMethods: selectedPaymentMethods,
        mainCategories: selectedCategories,
        subCategories: selectedSubCategories,
        childCategories: selectedChildCategories,
        applicableModes: ["SERVICE"],
        validDays: frequency === "ALWAYS" ? [] : frequency === "WEEKENDS" ? ["Saturday", "Sunday"] : ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        riderConditions: {
          ...formData.riderConditions,
          startDate: formData.riderConditions?.startDate 
            ? new Date(formData.riderConditions.startDate).toISOString()
            : new Date().toISOString(),
          endDate: formData.riderConditions?.endDate
            ? new Date(formData.riderConditions.endDate).toISOString()
            : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
        }
      };

      const url = editingOffer
        ? `https://api.bijliwalaaya.in/api/offers/${editingOffer._id}`
        : `https://api.bijliwalaaya.in/api/offers`;

      const method = editingOffer ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "x-api-token": "super_secure_token"
        },
        body: JSON.stringify(processedData)
      });

      const data = await res.json();

      if (data.success) {
        alert(editingOffer ? "Updated ✅" : "Created ✅");
        fetchOffers();
        closeModal();
      } else {
        alert(data.message || "Error");
      }

    } catch (err) {
      console.error(err);
      alert("Network error");
    }
  };

  const deleteOffer = async (id: string) => {
    if (!confirm("Delete this offer?")) return;

    try {
      const res = await fetch(
        `https://api.bijliwalaaya.in/api/offers/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "x-api-token": "super_secure_token"
          }
        }
      );

      const data = await res.json();

      if (data.success) {
        alert("Deleted ✅");
        fetchOffers();
      } else {
        alert("Delete failed");
      }

    } catch (err) {
      console.error(err);
    }
  };

  const toggleVisibility = async (id: string, currentVisible: boolean) => {
    try {
      const res = await fetch(
        `https://api.bijliwalaaya.in/api/offers/${id}/visibility`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            "x-api-token": "super_secure_token"
          },
          body: JSON.stringify({ visible: !currentVisible })
        }
      );

      const data = await res.json();

      if (data.success) {
        setOffers(offers.map(offer => 
          offer._id === id ? { ...offer, visible: !currentVisible } : offer
        ));
      }

    } catch (err) {
      console.error(err);
    }
  };

  const getStatusColor = (status?: string) => {
    switch(status) {
      case "ACTIVE": return "bg-green-100 text-green-700";
      case "INACTIVE": return "bg-red-100 text-red-700";
      case "SCHEDULED": return "bg-yellow-100 text-yellow-700";
      case "EXPIRED": return "bg-gray-100 text-gray-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const filteredOffers = selectedFilter === "ALL" 
    ? offers 
    : offers.filter(o => o.status === selectedFilter);

  const totalOffers = offers.length;
  const activeOffers = offers.filter(o => o.status === "ACTIVE").length;

  // Mock data for dropdowns
  const modules = ["SERVICE", "SHOPPING", "RIDER", "RESELL"];
  const categories = ["Home Appliances", "Electronics", "Fashion", "Furniture"];
  const subCategories = ["Repair", "Installation", "Maintenance"];
  const childCategories = ["AC Repair", "Fridge Repair", "TV Repair", "Washing Machine Repair", "Microwave Repair"];
  const locations = ["Lucknow", "Delhi", "Mumbai", "Bangalore", "Chennai", "Kolkata", "Pune"];
  const paymentMethods = ["PAYTM", "PHONEPE", "GOOGLEPAY", "AMAZONPAY", "CREDIT_CARD", "DEBIT_CARD"];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 text-center">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
          <h3 className="text-gray-800 font-medium">Loading offers...</h3>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-['Inter']">
      {/* Main Content */}
      <main className="w-full flex flex-col">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-8 sticky top-0 z-10">
          <h1 className="text-xl font-bold text-gray-800">Offers Management</h1>
          <button
            onClick={openCreateModal}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg font-medium text-sm hover:bg-blue-600 transition-colors shadow-sm flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create New Offer
          </button>
        </header>

        {/* Scrollable Content */}
        <div className="px-4 py-6 overflow-y-auto space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-xl border border-gray-200">
              <div className="text-2xl font-bold text-gray-900">{totalOffers}</div>
              <div className="text-sm text-gray-500">Total Offers</div>
            </div>
            <div className="bg-white p-5 rounded-xl border border-gray-200">
              <div className="text-2xl font-bold text-green-600">{activeOffers}</div>
              <div className="text-sm text-gray-500">Active</div>
            </div>
            <div className="bg-white p-5 rounded-xl border border-gray-200">
              <div className="text-2xl font-bold text-yellow-600">{offers.filter(o => o.status === "SCHEDULED").length}</div>
              <div className="text-sm text-gray-500">Scheduled</div>
            </div>
            <div className="bg-white p-5 rounded-xl border border-gray-200">
              <div className="text-2xl font-bold text-gray-600">{offers.filter(o => o.status === "EXPIRED").length}</div>
              <div className="text-sm text-gray-500">Expired</div>
            </div>
          </div>

          {/* Filters */}
          <div className="flex gap-2">
            {["ALL", "ACTIVE", "INACTIVE", "SCHEDULED", "EXPIRED"].map(filter => (
              <button
                key={filter}
                onClick={() => setSelectedFilter(filter)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedFilter === filter 
                    ? "bg-blue-500 text-white" 
                    : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          {/* Offers Grid */}
          {filteredOffers.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
              <div className="text-5xl mb-4">🎫</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No offers yet</h3>
              <p className="text-gray-500">Create your first offer to get started</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredOffers.map((offer) => (
                <div
                  key={offer._id}
                  className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => openDetailsModal(offer)}
                >
                  {/* Banner */}
                  <div 
                    className="h-32 relative" 
                    style={{ backgroundColor: offer.bannerColor || '#00BAF2' }}
                  >
                    {offer.bannerImage && (
                      <img src={offer.bannerImage} alt={offer.title} className="w-full h-full object-cover" />
                    )}
                    {offer.brandLogo && (
                      <img 
                        src={offer.brandLogo} 
                        alt={offer.brandName} 
                        className="absolute bottom-2 right-2 w-8 h-8 rounded-full bg-white p-1 border border-gray-200" 
                      />
                    )}
                    <div className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(offer.status)}`}>
                      {offer.status}
                    </div>
                  </div>

                  <div className="p-5">
                    {/* Header with Visibility Toggle */}
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-semibold text-gray-900 line-clamp-1">{offer.title}</h3>
                      <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                        <span className="text-xs text-gray-500">Visible</span>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={offer.visible}
                            onChange={() => toggleVisibility(offer._id, offer.visible || false)}
                          />
                          <div className={`w-9 h-5 rounded-full peer after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-full peer-checked:after:border-white ${
                            offer.visible ? 'bg-blue-500' : 'bg-gray-300'
                          }`}></div>
                        </label>
                      </div>
                    </div>

                    {/* Promo Code */}
                    {offer.promoCode && (
                      <div className="bg-gray-50 rounded-lg p-2 mb-3 flex items-center justify-between">
                        <span className="text-xs text-gray-500">USE CODE</span>
                        <span className="text-sm font-mono font-bold text-blue-600">{offer.promoCode}</span>
                      </div>
                    )}

                    {/* Offer Value */}
                    <div className="text-xl font-bold text-blue-600 mb-2">
                      {offer.type === "CASHBACK" && `₹${offer.value} Cashback`}
                      {offer.type === "DISCOUNT" && `${offer.value}% OFF`}
                      {offer.type === "FLAT_OFF" && `₹${offer.value} OFF`}
                    </div>

                    {/* Categories */}
                    {offer.mainCategories && offer.mainCategories.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-2">
                        {offer.mainCategories.slice(0, 2).map((cat, idx) => (
                          <span key={idx} className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded text-xs font-medium">
                            {cat}
                          </span>
                        ))}
                        {offer.subCategories?.slice(0, 1).map((sub, idx) => (
                          <span key={idx} className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">
                            {sub}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Location & Validity */}
                    <div className="space-y-1 text-xs text-gray-500">
                      {offer.city && offer.city.length > 0 && (
                        <div className="flex items-center gap-1">
                          <span>📍</span>
                          <span>{offer.city.slice(0, 2).join(", ")}{offer.city.length > 2 ? ` +${offer.city.length - 2}` : ''}</span>
                        </div>
                      )}
                      {offer.riderConditions?.endDate && (
                        <div className="flex items-center gap-1">
                          <span>📅</span>
                          <span>Valid until {new Date(offer.riderConditions.endDate).toLocaleDateString()}</span>
                        </div>
                      )}
                      {offer.minOrderValue && offer.minOrderValue > 0 && (
                        <div className="flex items-center gap-1">
                          <span>💰</span>
                          <span>Min order ₹{offer.minOrderValue}</span>
                        </div>
                      )}
                    </div>

                    {/* Usage Bar */}
                    {offer.totalLimit && offer.totalLimit > 0 && (
                      <div className="mt-3">
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-gray-500">Used</span>
                          <span className="text-gray-700 font-medium">{offer.usedCount || 0}/{offer.totalLimit}</span>
                        </div>
                        <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-blue-500 rounded-full"
                            style={{ width: `${((offer.usedCount || 0) / offer.totalLimit) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Details Modal - Clean Design Matching Your Images */}
      {isDetailsModalOpen && selectedOffer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-bold text-gray-800">
                  Offer Details - <span className="text-blue-500">{selectedOffer.promoCode || selectedOffer.title}</span>
                </h2>
                <span className={`px-2 py-0.5 rounded text-xs font-semibold uppercase ${getStatusColor(selectedOffer.status)}`}>
                  {selectedOffer.status}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    closeModal();
                    openEditModal(selectedOffer);
                  }}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-600 flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit
                </button>
                <button
                  onClick={() => {
                    if (confirm("Delete this offer?")) {
                      deleteOffer(selectedOffer._id);
                      closeModal();
                    }
                  }}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-600 flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Delete
                </button>
                <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Modal Content - Clean Layout */}
            <div className="p-6 space-y-6">
              {/* Top Row - Basic Info & Order Limits */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Basic Information - Takes 2/3 width */}
                <div className="lg:col-span-2">
                  <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <div className="px-6 py-3 border-b border-gray-100 bg-gray-50">
                      <h2 className="font-semibold text-gray-800">Basic Information</h2>
                    </div>
                    <div className="p-6 grid grid-cols-2 gap-6">
                      <div>
                        <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">PROMO CODE</div>
                        <div className="text-gray-900 font-medium">{selectedOffer.promoCode || "—"}</div>
                      </div>
                      <div>
                        <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">TITLE</div>
                        <div className="text-gray-900 font-medium">{selectedOffer.title}</div>
                      </div>
                      <div className="col-span-2">
                        <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">DESCRIPTION</div>
                        <div className="text-gray-900">{selectedOffer.description || "—"}</div>
                      </div>
                      <div>
                        <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">TYPE</div>
                        <div className="text-gray-900 font-medium">{selectedOffer.type}</div>
                      </div>
                      <div>
                        <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">VALUE</div>
                        <div className="text-gray-900 font-medium">{selectedOffer.value}</div>
                      </div>
                      <div>
                        <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">MAX DISCOUNT</div>
                        <div className="text-gray-500 italic">{selectedOffer.maxDiscount ? `₹${selectedOffer.maxDiscount}` : "No max limit"}</div>
                      </div>
                      <div>
                        <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">PRIORITY</div>
                        <div className="text-gray-900 font-medium">{selectedOffer.priority || 0}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Order Limits - Takes 1/3 width */}
                <div className="lg:col-span-1">
                  <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <div className="px-6 py-3 border-b border-gray-100 bg-gray-50">
                      <h2 className="font-semibold text-gray-800">Order Limits</h2>
                    </div>
                    <div className="p-6 space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Min Order Value</span>
                        <span className="text-sm font-semibold text-gray-900">₹{selectedOffer.minOrderValue || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Max Order Value</span>
                        <span className="text-sm text-gray-500 italic">{selectedOffer.maxOrderValue ? `₹${selectedOffer.maxOrderValue}` : "No Max"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Total Usage Limit</span>
                        <span className="text-sm font-semibold text-gray-900">{selectedOffer.totalLimit || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Limit Per User</span>
                        <span className="text-sm font-semibold text-gray-900">{selectedOffer.perUserLimit || 1}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Categories Section - Clean Design */}
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="px-6 py-3 border-b border-gray-100 bg-gray-50">
                  <h2 className="font-semibold text-gray-800">Categories & Targeting</h2>
                </div>
                <div className="p-6 space-y-4">
                  {selectedOffer.mainCategories && selectedOffer.mainCategories.length > 0 && (
                    <div>
                      <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">MAIN CATEGORIES</div>
                      <div className="flex flex-wrap gap-2">
                        {selectedOffer.mainCategories.map((cat, idx) => (
                          <span key={idx} className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-sm font-medium border border-blue-100">
                            {cat}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {selectedOffer.subCategories && selectedOffer.subCategories.length > 0 && (
                    <div>
                      <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">SUB CATEGORIES</div>
                      <div className="flex flex-wrap gap-2">
                        {selectedOffer.subCategories.map((sub, idx) => (
                          <span key={idx} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">
                            {sub}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {selectedOffer.childCategories && selectedOffer.childCategories.length > 0 && (
                    <div>
                      <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">CHILD CATEGORIES</div>
                      <div className="flex flex-wrap gap-2">
                        {selectedOffer.childCategories.map((child, idx) => (
                          <span key={idx} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                            {child}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Bottom Row - Branding, Settings, Date & Location */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Branding */}
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                  <div className="px-6 py-3 border-b border-gray-100 bg-gray-50">
                    <h2 className="font-semibold text-gray-800">Branding</h2>
                  </div>
                  <div className="p-6 space-y-3">
                    <div>
                      <div className="text-xs font-medium text-gray-500 uppercase mb-1">BRAND NAME</div>
                      <div className="text-sm font-medium text-gray-900">{selectedOffer.brandName || "—"}</div>
                    </div>
                    <div>
                      <div className="text-xs font-medium text-gray-500 uppercase mb-1">BANNER COLOR</div>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded border border-gray-200" style={{ backgroundColor: selectedOffer.bannerColor || '#00BAF2' }}></div>
                        <span className="text-xs font-mono text-gray-600">{selectedOffer.bannerColor || '#00BAF2'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Offer Settings */}
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                  <div className="px-6 py-3 border-b border-gray-100 bg-gray-50">
                    <h2 className="font-semibold text-gray-800">Offer Settings</h2>
                  </div>
                  <div className="p-6 space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-700">Show on Home</span>
                      <span className={`text-sm font-semibold ${selectedOffer.showOnHome ? 'text-green-600' : 'text-red-500'}`}>
                        {selectedOffer.showOnHome ? 'Enabled' : 'Disabled'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-700">Auto Apply</span>
                      <span className={`text-sm font-semibold ${selectedOffer.autoApply ? 'text-green-600' : 'text-red-500'}`}>
                        {selectedOffer.autoApply ? 'Enabled' : 'Disabled'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-700">Exclusive Offer</span>
                      <span className={`text-sm font-semibold ${selectedOffer.exclusive ? 'text-green-600' : 'text-red-500'}`}>
                        {selectedOffer.exclusive ? 'Yes' : 'No'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-700">Can Combine</span>
                      <span className={`text-sm font-semibold ${selectedOffer.canCombineWithOther ? 'text-green-600' : 'text-red-500'}`}>
                        {selectedOffer.canCombineWithOther ? 'Yes' : 'No'}
                      </span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-gray-100">
                      <span className="text-sm text-gray-700 font-medium">Visibility</span>
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-semibold ${selectedOffer.visible ? 'text-green-600' : 'text-red-500'}`}>
                          {selectedOffer.visible ? 'Visible' : 'Hidden'}
                        </span>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={selectedOffer.visible}
                            onChange={() => toggleVisibility(selectedOffer._id, selectedOffer.visible || false)}
                          />
                          <div className={`w-9 h-5 rounded-full peer after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-full peer-checked:after:border-white ${
                            selectedOffer.visible ? 'bg-blue-500' : 'bg-gray-300'
                          }`}></div>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Date, Time & Validity */}
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                  <div className="px-6 py-3 border-b border-gray-100 bg-gray-50">
                    <h2 className="font-semibold text-gray-800">Date, Time & Validity</h2>
                  </div>
                  <div className="p-6 space-y-3">
                    <div>
                      <div className="text-xs font-medium text-gray-500 uppercase mb-1">START DATE</div>
                      <div className="text-sm font-medium text-gray-900">
                        {selectedOffer.riderConditions?.startDate 
                          ? new Date(selectedOffer.riderConditions.startDate).toLocaleString() 
                          : "—"}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs font-medium text-gray-500 uppercase mb-1">END DATE</div>
                      <div className="text-sm font-medium text-gray-900">
                        {selectedOffer.riderConditions?.endDate 
                          ? new Date(selectedOffer.riderConditions.endDate).toLocaleString() 
                          : "—"}
                      </div>
                    </div>
                    {selectedOffer.validDays && selectedOffer.validDays.length > 0 && (
                      <div>
                        <div className="text-xs font-medium text-gray-500 uppercase mb-2">VALID DAYS</div>
                        <div className="flex gap-1">
                          {["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"].map(day => {
                            const isActive = selectedOffer.validDays?.some(d => d.toUpperCase().startsWith(day));
                            return (
                              <span
                                key={day}
                                className={`w-8 h-8 flex items-center justify-center text-xs font-bold rounded-full ${
                                  isActive 
                                    ? 'bg-blue-500 text-white' 
                                    : 'bg-gray-100 text-gray-400'
                                }`}
                              >
                                {day.substring(0, 3)}
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    )}
                    {selectedOffer.validTimeSlots && selectedOffer.validTimeSlots.length > 0 && (
                      <div>
                        <div className="text-xs font-medium text-gray-500 uppercase mb-2">ACTIVE TIME SLOTS</div>
                        {selectedOffer.validTimeSlots.map((slot, idx) => (
                          <div key={idx} className="text-sm text-gray-700 mb-1">
                            {slot.start} — {slot.end}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Location & Payment Methods */}
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="px-6 py-3 border-b border-gray-100 bg-gray-50">
                  <h2 className="font-semibold text-gray-800">Location & Payment Methods</h2>
                </div>
                <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                  {selectedOffer.city && selectedOffer.city.length > 0 && (
                    <div>
                      <div className="text-xs font-medium text-gray-500 uppercase mb-2">CITIES</div>
                      <div className="flex flex-wrap gap-1">
                        {selectedOffer.city.map((city, idx) => (
                          <span key={idx} className="px-2 py-1 bg-green-50 text-green-700 text-xs font-medium border border-green-100 rounded">
                            {city}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {selectedOffer.serviceAreas && selectedOffer.serviceAreas.length > 0 && (
                    <div>
                      <div className="text-xs font-medium text-gray-500 uppercase mb-2">SERVICE AREAS</div>
                      <div className="text-sm text-gray-700">{selectedOffer.serviceAreas.join(", ")}</div>
                    </div>
                  )}
                  {selectedOffer.paymentMethods && selectedOffer.paymentMethods.length > 0 && (
                    <div>
                      <div className="text-xs font-medium text-gray-500 uppercase mb-2">ACCEPTED PAYMENT METHODS</div>
                      <div className="flex flex-wrap gap-1">
                        {selectedOffer.paymentMethods.map((method, idx) => (
                          <span key={idx} className="px-2 py-1 bg-purple-50 text-purple-700 text-xs font-medium border border-purple-100 rounded">
                            {method}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex justify-end gap-2">
              <button 
                onClick={closeModal} 
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Back to List
              </button>
              <button
                onClick={() => {
                  closeModal();
                  openEditModal(selectedOffer);
                }}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Edit Offer
              </button>
              <button
                onClick={() => {
                  if (confirm("Delete this offer?")) {
                    deleteOffer(selectedOffer._id);
                    closeModal();
                  }
                }}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create/Edit Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
              <h2 className="text-xl font-bold text-gray-800">
                {editingOffer ? "Edit Offer" : "Create New Offer"}
              </h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-4 px-6 border-b border-gray-200">
              <button
                className={`py-3 px-2 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === "targeting" 
                    ? "border-blue-500 text-blue-600" 
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => setActiveTab("targeting")}
              >
                TARGETING & SELECTION
              </button>
              <button
                className={`py-3 px-2 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === "discount" 
                    ? "border-blue-500 text-blue-600" 
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => setActiveTab("discount")}
              >
                DISCOUNT & PAYMENT
              </button>
              <button
                className={`py-3 px-2 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === "scheduling" 
                    ? "border-blue-500 text-blue-600" 
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => setActiveTab("scheduling")}
              >
                SCHEDULING & LIMITS
              </button>
            </div>

            <div className="p-6">
              {/* Targeting & Selection Tab */}
              {activeTab === "targeting" && (
                <div className="space-y-6">
                  {/* Module Selection */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-3">MODULE SELECTION</h3>
                    <div className="flex gap-4">
                      {modules.map(module => (
                        <label key={module} className="flex items-center gap-2">
                          <input type="radio" name="module" className="text-blue-500" />
                          <span className="text-sm text-gray-700">{module}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Categories */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-3">MAIN CATEGORIES</h3>
                    <div className="grid grid-cols-2 gap-3">
                      {categories.map(cat => (
                        <label key={cat} className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={selectedCategories.includes(cat)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedCategories([...selectedCategories, cat]);
                              } else {
                                setSelectedCategories(selectedCategories.filter(c => c !== cat));
                              }
                            }}
                            className="text-blue-500 rounded"
                          />
                          <span className="text-sm text-gray-700">{cat}</span>
                        </label>
                      ))}
                    </div>

                    {selectedCategories.length > 0 && (
                      <>
                        <h3 className="text-sm font-semibold text-gray-700 mt-4 mb-3">SUB CATEGORIES</h3>
                        <div className="grid grid-cols-2 gap-3">
                          {subCategories.map(sub => (
                            <label key={sub} className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={selectedSubCategories.includes(sub)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setSelectedSubCategories([...selectedSubCategories, sub]);
                                  } else {
                                    setSelectedSubCategories(selectedSubCategories.filter(s => s !== sub));
                                  }
                                }}
                                className="text-blue-500 rounded"
                              />
                              <span className="text-sm text-gray-700">{sub}</span>
                            </label>
                          ))}
                        </div>

                        <h3 className="text-sm font-semibold text-gray-700 mt-4 mb-3">CHILD CATEGORIES</h3>
                        <div className="grid grid-cols-2 gap-3">
                          {childCategories.map(child => (
                            <label key={child} className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={selectedChildCategories.includes(child)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setSelectedChildCategories([...selectedChildCategories, child]);
                                  } else {
                                    setSelectedChildCategories(selectedChildCategories.filter(c => c !== child));
                                  }
                                }}
                                className="text-blue-500 rounded"
                              />
                              <span className="text-sm text-gray-700">{child}</span>
                            </label>
                          ))}
                        </div>
                      </>
                    )}
                  </div>

                  {/* Location Targeting */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-3">LOCATION TARGETING</h3>
                    <div className="grid grid-cols-2 gap-3">
                      {locations.map(location => (
                        <label key={location} className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={selectedCities.includes(location)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedCities([...selectedCities, location]);
                              } else {
                                setSelectedCities(selectedCities.filter(c => c !== location));
                              }
                            }}
                            className="text-blue-500 rounded"
                          />
                          <span className="text-sm text-gray-700">{location}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Discount & Payment Tab */}
              {activeTab === "discount" && (
                <div className="space-y-6">
                  {/* Discount Configuration */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-3">DISCOUNT CONFIGURATION</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">TYPE</label>
                        <select
                          name="type"
                          value={formData.type}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        >
                          <option value="CASHBACK">Cashback</option>
                          <option value="DISCOUNT">Percentage Discount</option>
                          <option value="FLAT_OFF">Flat Discount</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">
                          {formData.type === "DISCOUNT" ? "VALUE (%)" : "VALUE (₹)"}
                        </label>
                        <input
                          type="number"
                          name="value"
                          value={formData.value}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        />
                      </div>
                      {formData.type === "DISCOUNT" && (
                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-1">MAX DISCOUNT (₹)</label>
                          <input
                            type="number"
                            name="maxDiscount"
                            value={formData.maxDiscount || ""}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Payment Methods */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-3">PAYMENT METHODS</h3>
                    <div className="grid grid-cols-2 gap-3">
                      {paymentMethods.map(method => (
                        <label key={method} className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={selectedPaymentMethods.includes(method)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedPaymentMethods([...selectedPaymentMethods, method]);
                              } else {
                                setSelectedPaymentMethods(selectedPaymentMethods.filter(m => m !== method));
                              }
                            }}
                            className="text-blue-500 rounded"
                          />
                          <span className="text-sm text-gray-700">{method}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Order Value */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-3">ORDER VALUE</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">MIN ORDER (₹)</label>
                        <input
                          type="number"
                          name="minOrderValue"
                          value={formData.minOrderValue}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Scheduling & Limits Tab */}
              {activeTab === "scheduling" && (
                <div className="space-y-6">
                  {/* Usage Limits */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-3">USAGE LIMITS</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">TOTAL USAGE LIMIT</label>
                        <input
                          type="number"
                          name="totalLimit"
                          value={formData.totalLimit}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">LIMIT PER USER</label>
                        <input
                          type="number"
                          name="perUserLimit"
                          value={formData.perUserLimit}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Scheduling */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-3">SCHEDULING</h3>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">START DATE</label>
                        <input
                          type="datetime-local"
                          name="riderConditions.startDate"
                          value={formData.riderConditions?.startDate || ""}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">END DATE</label>
                        <input
                          type="datetime-local"
                          name="riderConditions.endDate"
                          value={formData.riderConditions?.endDate || ""}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        />
                      </div>
                    </div>

                    <div className="mb-4">
                      <label className="block text-xs font-medium text-gray-500 mb-2">FREQUENCY</label>
                      <div className="flex gap-4">
                        <label className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="frequency"
                            checked={frequency === "ALWAYS"}
                            onChange={() => setFrequency("ALWAYS")}
                            className="text-blue-500"
                          />
                          <span className="text-sm text-gray-700">ALWAYS</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="frequency"
                            checked={frequency === "WEEKENDS"}
                            onChange={() => setFrequency("WEEKENDS")}
                            className="text-blue-500"
                          />
                          <span className="text-sm text-gray-700">WEEKENDS</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="frequency"
                            checked={frequency === "MORNING"}
                            onChange={() => setFrequency("MORNING")}
                            className="text-blue-500"
                          />
                          <span className="text-sm text-gray-700">MORNING ONLY</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Form Actions */}
              <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-200">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={saveOffer}
                  className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  {editingOffer ? "Update Offer" : "Publish Offer"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}