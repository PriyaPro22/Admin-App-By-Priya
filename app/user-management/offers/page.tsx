'use client';

import React, { useState,useEffect } from 'react';

// Type definitions
type ChildCategory = string;
type SubCategory = { id: string; name: string; childCategories?: ChildCategory[] };
type MainCategory = { id: string; name: string; subCategories?: SubCategory[] };
type Department = { id: string; name: string; mainCategories?: MainCategory[] };

// const categoryData: { departments: Department[] } = {
//     departments: [
//         {
//             id: 'homeAppliances',
//             name: 'Home Appliances',
//             mainCategories: [
//                 {
//                     id: 'ac',
//                     name: 'AC',
//                     subCategories: [
//                         { id: 'windowAC', name: 'Window AC', childCategories: ['Gas Refill', 'Installation', 'PCB Repair'] },
//                         { id: 'splitAC', name: 'Split AC', childCategories: ['Gas Refill', 'Installation', 'PCB Repair'] },
//                         { id: 'cassetteAC', name: 'Cassette AC', childCategories: ['Gas Refill', 'Installation'] },
//                     ],
//                 },
//                 {
//                     id: 'refrigerator',
//                     name: 'Refrigerator',
//                     subCategories: [
//                         { id: 'singleDoor', name: 'Single Door', childCategories: ['Thermostat', 'Door Seal'] },
//                         { id: 'doubleDoor', name: 'Double Door', childCategories: ['Ice Maker', 'Water Filter'] },
//                     ],
//                 },
//                 {
//                     id: 'washingMachine',
//                     name: 'Washing Machine',
//                     subCategories: [
//                         { id: 'frontLoad', name: 'Front Load', childCategories: ['Drum', 'Motor', 'Heater'] },
//                         { id: 'topLoad', name: 'Top Load', childCategories: ['Agitator', 'Lid', 'Belt'] },
//                     ],
//                 },
//             ],
//         },
//         {
//             id: 'computer',
//             name: 'Computer',
//             mainCategories: [
//                 {
//                     id: 'laptop',
//                     name: 'Laptop',
//                     subCategories: [
//                         { id: 'screenIssue', name: 'Screen Issue', childCategories: ['Display', 'Backlight', 'Hinge'] },
//                         { id: 'motherboardIssue', name: 'Motherboard Issue', childCategories: ['Chip', 'Capacitor', 'Socket'] },
//                         { id: 'batteryIssue', name: 'Battery Issue', childCategories: ['Cell', 'Charger', 'Connector'] },
//                     ],
//                 },
//                 {
//                     id: 'desktop',
//                     name: 'Desktop',
//                     subCategories: [
//                         { id: 'powerSupply', name: 'Power Supply', childCategories: ['Fan', 'Cable', 'Fuse'] },
//                     ],
//                 },
//                 {
//                     id: 'printer',
//                     name: 'Printer',
//                     subCategories: [
//                         { id: 'paperJam', name: 'Paper Jam', childCategories: ['Roller', 'Sensor', 'Tray'] },
//                     ],
//                 },
//             ],
//         },
//         {
//             id: 'mobile',
//             name: 'Mobile',
//             mainCategories: [
//                 {
//                     id: 'smartphone',
//                     name: 'Smartphone Repair',
//                     subCategories: [
//                         { id: 'screen', name: 'Screen', childCategories: ['Glass', 'LCD', 'Digitizer'] },
//                         { id: 'battery', name: 'Battery', childCategories: ['Connector', 'Cell', 'Controller'] },
//                     ],
//                 },
//                 {
//                     id: 'tablet',
//                     name: 'Tablet Repair',
//                     subCategories: [
//                         { id: 'digitizer', name: 'Digitizer', childCategories: ['Touch', 'Controller', 'Cable'] },
//                     ],
//                 },
//             ],
//         },
//     ],
// };




const cityData: Record<string, string[]> = {
    maharashtra: ['Mumbai', 'Pune', 'Nagpur', 'Nashik'],
    delhi: ['New Delhi', 'North Delhi', 'South Delhi', 'East Delhi'],
    karnataka: ['Bangalore', 'Mysore', 'Hubli', 'Mangalore'],
    tamilnadu: ['Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli'],
};

// Sub-component for Child Category List (Search Removed)
const ChildCategoryList = ({
    childCategories,
    baseId,
    treeState,
    toggleNode
}: {
    childCategories: string[];
    baseId: string;
    treeState: Record<string, boolean>;
    toggleNode: (id: string) => void;
}) => {
    return (
        <div className="ml-7 mt-2 border-l-2 border-dotted border-slate-300 pl-5 bg-slate-50/50 p-4 rounded-xl border border-slate-100 shadow-sm">
            <div className="max-h-[240px] overflow-y-auto pr-2 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-slate-300 hover:scrollbar-thumb-slate-400">
                <div className="flex flex-col gap-1">
                    {childCategories.map((child) => {
                        const childId = `${baseId}-${child}`;
                        return (
                            <div key={child} className="flex items-center hover:bg-white hover:shadow-sm p-2 rounded-lg transition-all border border-transparent hover:border-slate-100">
                                <label className="flex items-center gap-3 cursor-pointer select-none text-slate-600 text-sm w-full font-medium">
                                    <input
                                        type="checkbox"
                                        checked={!!treeState[childId]}
                                        onChange={() => toggleNode(childId)}
                                        className="w-[1.1rem] h-[1.1rem] accent-blue-600 rounded cursor-pointer transition-transform active:scale-95"
                                    />
                                    <span>{child}</span>
                                </label>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

// New City Selector Component with Search
const CitySelector = ({
    cities,
    selectedCities,
    onChange,
    disabled
}: {
    cities: string[];
    selectedCities: string[];
    onChange: (cities: string[]) => void;
    disabled: boolean;
}) => {
    const [search, setSearch] = useState('');

    const filtered = cities.filter(c =>
        c.toLowerCase().includes(search.toLowerCase())
    );

    const handleToggle = (city: string) => {
        const newSelection = selectedCities.includes(city)
            ? selectedCities.filter(c => c !== city)
            : [...selectedCities, city];
        onChange(newSelection);
    };

    if (disabled) return (
        <div className="w-full h-[240px] border-[1.5px] border-slate-200 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 italic">
            Select a state to load cities...
        </div>
    );

    return (
        <div className="w-full border-[1.5px] border-slate-200 rounded-2xl bg-white p-4 shadow-sm">
            <div className="mb-3 relative group">
                <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors"></i>
                <input
                    type="text"
                    placeholder="Search cities..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 bg-slate-50 focus:bg-white transition-all focus:ring-4 focus:ring-blue-500/10"
                />
            </div>
            <div className="max-h-[200px] overflow-y-auto pr-2 scrollbar-thin scrollbar-track-slate-50 scrollbar-thumb-slate-300 hover:scrollbar-thumb-slate-400">
                {filtered.length > 0 ? (
                    <div className="flex flex-col gap-1">
                        {filtered.map(city => (
                            <label key={city} className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors select-none">
                                <input
                                    type="checkbox"
                                    checked={selectedCities.includes(city)}
                                    onChange={() => handleToggle(city)}
                                    className="w-[1.1rem] h-[1.1rem] accent-blue-600 rounded cursor-pointer transition-transform active:scale-95"
                                />
                                <span className="text-slate-700">{city}</span>
                            </label>
                        ))}
                    </div>
                ) : (
                    <div className="text-center text-slate-400 py-6 italic border border-dashed border-slate-200 rounded-lg">No cities found</div>
                )}
            </div>
        </div>
    );
};

export default function CreateOfferPage() {

    // --- STATE ---
    const [headerSection, setHeaderSection] = useState({
  headTitle: "",
  headDescription: "",
  headImage: "",
  headVideo: "",
});

    const [offers, setOffers] = useState<any[]>([]);
const [mainCategories, setMainCategories] = useState<any[]>([]);
const [subCategories, setSubCategories] = useState<Record<string, any[]>>({});
const [childCategories, setChildCategories] = useState<Record<string, any[]>>({});
const [loading, setLoading] = useState(false);
const [saving, setSaving] = useState(false);

useEffect(() => {
  fetchMainCategories();
}, []);

const fetchMainCategories = async () => {
  try {
    setLoading(true);

    const res = await fetch(
      "https://api.bijliwalaaya.in/api/product-listing/main",
      {
        headers: {
          "x-api-token": "super_secure_token",
        },
      }
    );

    const data = await res.json();

    if (data.success) {
      setMainCategories(data.data);
    }
  } catch (error) {
    console.error("Error fetching main categories:", error);
  } finally {
    setLoading(false);
  }
};
const fetchSubCategories = async (mainId: string) => {
  try {
    const res = await fetch(
      `https://api.bijliwalaaya.in/api/product-listing/main/${mainId}/sub`,
      {
        headers: {
          "x-api-token": "super_secure_token",
        },
      }
    );

    const data = await res.json();

    if (data.success) {
      setSubCategories(prev => ({
        ...prev,
        [mainId]: data.data
      }));
    }
  } catch (error) {
    console.error("Error fetching sub categories:", error);
  }
};
const fetchChildCategories = async (mainId: string, subId: string) => {
  try {
    const res = await fetch(
      `https://api.bijliwalaaya.in/api/product-listing/main/${mainId}/sub/${subId}/child`,
      {
        headers: {
          "x-api-token": "super_secure_token",
        },
      }
    );

    const data = await res.json();

    if (data.success) {
      setChildCategories(prev => ({
        ...prev,
        [`${mainId}-${subId}`]: data.data
      }));
    }
  } catch (error) {
    console.error("Error fetching child categories:", error);
  }
};

// Offers Api
const handleSaveOffer = async () => {
  if (saving) return;

  if (!details.title.trim()) {
    alert("Title is required");
    return;
  }

  if (!details.description.trim()) {
    alert("Description is required");
    return;
  }

  try {
    setSaving(true);

    const payload = buildPayload();

    const res = await fetch(
      "https://api.bijliwalaaya.in/api/offers/add-offer",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-token": "super_secure_token"
        },
        body: JSON.stringify(payload)
      }
    );

    const data = await res.json();

    if (data.success) {
      alert("Offer Created Successfully");
    } else {
      alert(data.message || "Something went wrong");
    }

  } catch (error) {
    console.error("Error saving offer:", error);
    alert("Server error");
  } finally {
    setSaving(false);
  }
};


const formatDate = (dateStr: string) => {
  const [day, month, year] = dateStr.split("/");
  return `${year}-${month}-${day}`;
};


const buildPayload = () => {
  return {
    title: details.title.trim(),
    description: details.description.trim(),

    offerActive: true,
    visibleToUser: promo.visible,
    offerVisible: true,
    
    headTitle: headerSection.headTitle,
headDescription: headerSection.headDescription,
headImage: headerSection.headImage,
headVideo: headerSection.headVideo,
 
    select_services: Object.keys(offerTarget)
      .filter(key => offerTarget[key as keyof typeof offerTarget] && key !== "all"),

    select_departments: Object.keys(deptSelection)
      .filter(key => deptSelection[key] && key !== "all"),

    select_main_category: mainCategories
      .filter(main => treeState[main._id])
      .map(main => ({
        documentId: main._id,
        name: main.name
      })),

    select_sub_category: Object.values(subCategories)
      .flat()
      .filter((sub: any) => treeState[sub._id])
      .map((sub: any) => ({
        documentId: sub._id,
        name: sub.name
      })),

    select_child_category: Object.values(childCategories)
      .flat()
      .filter((child: any) => treeState[child._id])
      .map((child: any) => ({
        documentId: child._id,
        name: child.name
      })),

    promocode: promo.code,

    imageUrl: bannerImages[0] || "",
    videoUrl: videos[0] || "",
    promoLogo: promoImages[0] || "",

    states: cityTarget.state
      ? [{ stateName: cityTarget.state }]
      : [],

    cities: cityTarget.selectedCities.map(city => ({
      cityName: city
    })),

    discountType: {
      type: discount.type.toUpperCase(),
      maxDiscount: Number(discount.value)
    },

    discountValue: Number(discount.value),

    limit: limits.totalType === "limited"
      ? Number(limits.totalValue)
      : null,

    user_usage_limit: limits.userType === "limited"
      ? Number(limits.userValue)
      : null,

    min_spend: minSpend.active
      ? Number(minSpend.value)
      : 0,

    validity: [{
      startDate: formatDate(validity.fromDate),
      endDate: formatDate(validity.toDate),
      startTime: validity.fromTime,
      endTime: validity.toTime
    }],

    payment_via: payment.all
      ? ["ALL"]
      : [
          payment.cash && "CASH",
          payment.online && "ONLINE",
          payment.others && payment.othersText
        ].filter(Boolean)
  };
};



useEffect(() => {
  fetchOffers();
}, []);

const handleUpdateOffer = async (id: string) => {
  await fetch(
    `https://api.bijliwalaaya.in/api/offers/${id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "x-api-token": "super_secure_token"
      },
      body: JSON.stringify(buildPayload())
    }
  );
};





const fetchOffers = async () => {
  const res = await fetch(
    "https://api.bijliwalaaya.in/api/offers/all",
    {
      headers: {
        "x-api-token": "super_secure_token"
      }
    }
  );

  const data = await res.json();

  if (data.success) {
    setOffers(data.data);
  }
};


    // Offer Target
    const [offerTarget, setOfferTarget] = useState({
        services: false,
        rider: false,
        resale: false,
        ecommerce: false,
        all: false,
    });

    // Department Selection (Top level checkboxes)
    const [deptSelection, setDeptSelection] = useState<Record<string, boolean>>({
        homeAppliances: false,
        computer: false,
        mobile: false,
        all: false,
    });

    // Category Tree State (Tracks checked status of every node)
    const [treeState, setTreeState] = useState<Record<string, boolean>>({});

    // Tree UI State (Collapsed/Expanded departments)
    const [collapsedDepts, setCollapsedDepts] = useState<Record<string, boolean>>({});

    // Basic Details
    const [details, setDetails] = useState({
        title: 'Weekend Flash',
        description: 'Get 20% off on all repairs',
        link: 'https://example.com/offer',
    });

    // Media
    const [bannerImages, setBannerImages] = useState<string[]>([]);
    const [videos, setVideos] = useState<string[]>([]);
    const [promoImages, setPromoImages] = useState<string[]>([]);
    const [tempInputs, setTempInputs] = useState({ banner: '', video: '', promo: '' });

    // City Targeting
    const [cityTarget, setCityTarget] = useState({
        allCities: false,
        state: '',
        selectedCities: [] as string[],
    });

    // Promo Config
    const [promo, setPromo] = useState({
        code: 'SUMMER20',
        visible: true,
    });

    // Discount
    const [discount, setDiscount] = useState({
        type: 'percentage',
        value: 20,
    });

    // Usage Limits
    const [limits, setLimits] = useState({
        totalType: 'unlimited', // 'unlimited' | 'limited'
        totalValue: '',
        userType: 'unlimited',
        userValue: '',
    });

    // Validity
    const [validity, setValidity] = useState({
        fromDate: '25/03/2025',
        fromTime: '10:00',
        toDate: '30/03/2025',
        toTime: '18:00',
    });

    // Payment
    const [payment, setPayment] = useState({
        cash: false,
        online: false,
        others: false,
        all: false,
        othersText: '',
    });

    // Min Spend
    const [minSpend, setMinSpend] = useState({
        active: false,
        value: 500,
    });

    // --- HANDLERS ---

    // Offer Target Handlers
    const handleOfferTargetChange = (key: keyof typeof offerTarget) => {
        if (key === 'all') {
            const newValue = !offerTarget.all;
            setOfferTarget({
                services: newValue,
                rider: newValue,
                resale: newValue,
                ecommerce: newValue,
                all: newValue,
            });
        } else {
            const newState = { ...offerTarget, [key]: !offerTarget[key] };
            // Check if all individual are checked
            const allChecked = ['services', 'rider', 'resale', 'ecommerce'].every((k) => newState[k as keyof typeof newState]);
            setOfferTarget({ ...newState, all: allChecked });
        }
    };

    // Department Selection Handlers
    const handleDeptSelectionChange = (key: string) => {
  if (key === 'all') {
    const newValue = !deptSelection.all;

    setDeptSelection({
      homeAppliances: newValue,
      computer: newValue,
      mobile: newValue,
      all: newValue,
    });

  } else {
    const newState = {
      ...deptSelection,
      [key]: !deptSelection[key],
    };

    const allChecked =
      newState.homeAppliances &&
      newState.computer &&
      newState.mobile;

    setDeptSelection({
      ...newState,
      all: allChecked,
    });
  }
};


            // Auto check/uncheck all tree nodes for all departments
        

    // Tree LogicHelpers
  
    const updateTreeState = (ids: string[], isChecked: boolean) => {
        setTreeState(prev => {
            const next = { ...prev };
            ids.forEach(id => next[id] = isChecked);
            return next;
        });
    };

   const toggleNode = (id: string) => {
  setTreeState(prev => ({
    ...prev,
    [id]: !prev[id]
  }));
};


    const toggleAllSiblings = (ids: string[], isChecked: boolean) => {
        setTreeState(prev => {
            const next = { ...prev };
            ids.forEach(id => next[id] = isChecked);
            return next;
        });
    };

    // Media Handlers
    const addMedia = (type: 'banner' | 'video' | 'promo') => {
        if (type === 'banner' && tempInputs.banner) {
            setBannerImages([...bannerImages, tempInputs.banner]);
            setTempInputs({ ...tempInputs, banner: '' });
        }
        if (type === 'video' && tempInputs.video) {
            setVideos([...videos, tempInputs.video]);
            setTempInputs({ ...tempInputs, video: '' });
        }
        if (type === 'promo' && tempInputs.promo) {
            setPromoImages([...promoImages, tempInputs.promo]);
            setTempInputs({ ...tempInputs, promo: '' });
        }
    };

    const removeMedia = (type: 'banner' | 'video' | 'promo', index: number) => {
        if (type === 'banner') setBannerImages(bannerImages.filter((_, i) => i !== index));
        if (type === 'video') setVideos(videos.filter((_, i) => i !== index));
        if (type === 'promo') setPromoImages(promoImages.filter((_, i) => i !== index));
    };

    // File Upload Handlers
    const handleFileUpload = (files: FileList | null, type: 'banner' | 'video' | 'promo') => {
        if (!files) return;
        const newUrls: string[] = [];
        Array.from(files).forEach(file => {
            const url = URL.createObjectURL(file);
            newUrls.push(url);
        });

        if (type === 'banner') setBannerImages(prev => [...prev, ...newUrls]);
        if (type === 'video') setVideos(prev => [...prev, ...newUrls]);
        if (type === 'promo') setPromoImages(prev => [...prev, ...newUrls]);
    };

    const onDropHandler = (e: React.DragEvent, type: 'banner' | 'video' | 'promo') => {
        e.preventDefault();
        handleFileUpload(e.dataTransfer.files, type);
    };

    const onDragOverHandler = (e: React.DragEvent) => {
        e.preventDefault();
    };


    // Derived UI State
    const isDeptSectionDisabled = offerTarget.all;
    const isDeptSectionHidden = !offerTarget.all && offerTarget.rider;

    return (
        <>
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" />
            <div className="min-h-screen bg-[#f4f5f9] pb-24 relative font-sans text-slate-800">

                {/* Header */}
                <header className="sticky top-0 z-30 bg-white px-8 py-4 shadow-[0_4px_16px_rgba(0,0,0,0.02)] border-b border-gray-100 flex items-center flex-wrap gap-2">
                    <h1 className="text-2xl font-semibold text-slate-900 flex items-center flex-wrap gap-2">
                        <i className="fas fa-tags text-blue-600 mr-2"></i> Offer Management – Create Offer & Details
                        <span className="bg-blue-50 text-blue-600 text-sm font-semibold px-4 py-1 rounded-full ml-3">complete flow</span>
                    </h1>
                </header>

                <main className="flex-1 w-full max-w-[1440px] mx-auto p-4 md:p-8 pb-24">

                    {/* Create Offer Section */}
                    <div className="bg-white rounded-3xl shadow-[0_8px_28px_rgba(0,0,0,0.02)] p-7 mb-8 border border-slate-100 transition-shadow hover:shadow-[0_16px_32px_rgba(0,0,0,0.04)]">
                        <div className="text-xl font-semibold text-slate-800 flex items-center gap-2 border-b-2 border-slate-100 pb-3 mb-6">
                            <i className="fas fa-bullseye text-blue-500"></i> Offer Target
                        </div>
                        <div className="flex flex-wrap gap-8 items-center">
                            {['services', 'rider', 'resale', 'ecommerce'].map((key) => (
                                <label key={key} className="flex items-center gap-2 text-base text-slate-800 cursor-pointer select-none">
                                    <input
                                        type="checkbox"
                                        checked={offerTarget[key as keyof typeof offerTarget] as boolean}
                                        onChange={() => handleOfferTargetChange(key as keyof typeof offerTarget)}
                                        className="w-[1.1rem] h-[1.1rem] accent-blue-600 rounded cursor-pointer hover:shadow-[0_0_0_3px_rgba(37,99,235,0.15)] transition-shadow"
                                    />
                                    <span className="capitalize">{key}</span>
                                </label>
                            ))}
                            <label className="flex items-center gap-2 text-base text-slate-800 cursor-pointer select-none">
                                <input
                                    type="checkbox"
                                    checked={offerTarget.all}
                                    onChange={() => handleOfferTargetChange('all')}
                                    className="w-[1.1rem] h-[1.1rem] accent-blue-600 rounded cursor-pointer hover:shadow-[0_0_0_3px_rgba(37,99,235,0.15)] transition-shadow"
                                />
                                <span>All</span>
                            </label>
                        </div>
                        <div className="text-sm text-slate-500 mt-3 pt-2">
                            <i className="fa-regular fa-lightbulb mr-1"></i> “All” disables Department; “Rider” hides Department.
                        </div>
                    </div>

                    <div
                        className={`bg-white rounded-3xl shadow-[0_8px_28px_rgba(0,0,0,0.02)] p-7 mb-8 border border-slate-100 transition-shadow hover:shadow-[0_16px_32px_rgba(0,0,0,0.04)]
            ${isDeptSectionDisabled ? 'opacity-50 pointer-events-none bg-slate-50' : ''} 
            ${isDeptSectionHidden ? 'hidden' : ''}`}
                    >
                        <div className="text-xl font-semibold text-slate-800 flex items-center gap-2 border-b-2 border-slate-100 pb-3 mb-6">
                            <i className="fas fa-layer-group text-blue-500"></i> Department Selection
                        </div>
                        <div className="flex flex-wrap gap-8 items-center">
                            {['homeAppliances', 'computer', 'mobile'].map((key) => {
                                const label = key === 'homeAppliances' ? 'Home Appliances' : key === 'computer' ? 'Computer' : 'Mobile';
                                return (
                                    <label key={key} className="flex items-center gap-2 text-base text-slate-800 cursor-pointer select-none">
                                        <input
                                            type="checkbox"
                                            checked={deptSelection[key]}
                                            onChange={() => handleDeptSelectionChange(key)}
                                            className="w-[1.1rem] h-[1.1rem] accent-blue-600 rounded cursor-pointer hover:shadow-[0_0_0_3px_rgba(37,99,235,0.15)] transition-shadow"
                                        />
                                        <span>{label}</span>
                                    </label>
                                );
                            })}
                            <label className="flex items-center gap-2 text-base text-slate-800 cursor-pointer select-none">
                                <input
                                    type="checkbox"
                                    checked={deptSelection.all}
                                    onChange={() => handleDeptSelectionChange('all')}
                                    className="w-[1.1rem] h-[1.1rem] accent-blue-600 rounded cursor-pointer hover:shadow-[0_0_0_3px_rgba(37,99,235,0.15)] transition-shadow"
                                />
                                <span>All</span>
                            </label>
                        </div>
                        <div className="text-sm text-slate-500 mt-3 pt-2">Select departments to show categories. “All” shows all departments.</div>
                    </div>

                    <div className="bg-white rounded-3xl shadow-[0_8px_28px_rgba(0,0,0,0.02)] p-7 mb-8 border border-slate-100 transition-shadow hover:shadow-[0_16px_32px_rgba(0,0,0,0.04)]">
                        <div className="text-xl font-semibold text-slate-800 flex items-center gap-2 border-b-2 border-slate-100 pb-3 mb-6">
                            <i className="fas fa-sitemap text-blue-500"></i> Category hierarchy (Main → Sub → Child)
                        </div>
                        <div className="max-h-[600px] overflow-y-auto pr-2 scrollbar-thin scrollbar-track-slate-50 scrollbar-thumb-slate-300">
                          {mainCategories.map((main) => (
  <div key={main._id} className="mb-5 border rounded-xl p-4">

    {/* MAIN CATEGORY */}
    <div className="flex items-center gap-3">
      <input
        type="checkbox"
        checked={!!treeState[main._id]}
        onChange={() => toggleNode(main._id)}
      />
      <span>{main.name}</span>


      {/* {main.hasSubCategory === true && ( */}
      {main.hasSubCategory && (
        <button
          onClick={() => fetchSubCategories(main._id)}
          className="text-blue-600 text-sm ml-3"
        >
          Load Sub
        </button>
      )}
    </div>

    {/* SUB CATEGORY */}
   {Array.isArray(subCategories[main._id]) &&
  subCategories[main._id].map((sub: any) => (

      <div key={sub._id} className="ml-6 mt-2">

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={!!treeState[sub._id]}
            onChange={() => toggleNode(sub._id)}
          />
          <span>{sub.name}</span>

          <button
            onClick={() => fetchChildCategories(main._id, sub._id)}
            className="text-green-600 text-xs ml-3"
          >
            Load Child
          </button>
        </div>

        {/* CHILD CATEGORY */}
{Array.isArray(childCategories[`${main._id}-${sub._id}`]) &&
  childCategories[`${main._id}-${sub._id}`].map((child: any) => (

          <div key={child._id} className="ml-6 mt-1 flex items-center gap-2">
            <input
              type="checkbox" 
              checked={!!treeState[child._id]}
              onChange={() => toggleNode(child._id)}
            />
            <span>{child.name}</span>
          </div>
        ))}

      </div>
    ))}

  </div>
))}
                        </div>
                    </div>

                    {/* Offer Details */}
                    <div className="bg-white rounded-3xl shadow-[0_8px_28px_rgba(0,0,0,0.02)] p-7 mb-8 border border-slate-100 transition-shadow hover:shadow-[0_16px_32px_rgba(0,0,0,0.04)]">
                        <div className="text-xl font-semibold text-slate-800 flex items-center gap-2 border-b-2 border-slate-100 pb-3 mb-6">
                            <i className="fas fa-info-circle text-blue-500"></i> Basic Offer Details
                        </div>
                        <div className="flex flex-wrap gap-4 mb-6">
                            <div className="flex-1 min-w-[300px]">
                                <label className="block font-medium text-slate-700 mb-1.5 text-sm">Title <span className="text-red-500">*</span></label>
                                <input
                                    className="w-full px-4 py-3 border-[1.5px] border-slate-200 rounded-2xl text-[0.95rem] bg-white transition-colors hover:border-slate-400 focus:outline-none focus:border-blue-600 focus:shadow-[0_0_0_4px_rgba(37,99,235,0.1)]"
                                    type="text"
                                    value={details.title}
                                    onChange={(e) => setDetails({ ...details, title: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-4 mb-6">
                            <div className="flex-1 min-w-[300px]">
                                <label className="block font-medium text-slate-700 mb-1.5 text-sm">Description <span className="text-red-500">*</span></label>
                                <textarea
                                    className="w-full px-4 py-3 border-[1.5px] border-slate-200 rounded-2xl text-[0.95rem] bg-white min-h-[100px] resize-y transition-colors hover:border-slate-400 focus:outline-none focus:border-blue-600 focus:shadow-[0_0_0_4px_rgba(37,99,235,0.1)]"
                                    value={details.description}
                                    onChange={(e) => setDetails({ ...details, description: e.target.value })}
                                ></textarea>
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-4 mb-6">
                            <div className="flex-1 min-w-[300px]">
                                <label className="block font-medium text-slate-700 mb-1.5 text-sm">Link (URL) <span className="text-slate-400 font-normal ml-1">optional</span></label>
                                <input
                                    className="w-full px-4 py-3 border-[1.5px] border-slate-200 rounded-2xl text-[0.95rem] bg-white transition-colors hover:border-slate-400 focus:outline-none focus:border-blue-600 focus:shadow-[0_0_0_4px_rgba(37,99,235,0.1)]"
                                    type="url"
                                    value={details.link}
                                    onChange={(e) => setDetails({ ...details, link: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>
{/* Header Section */}
<div className="bg-white rounded-3xl shadow p-7 mb-8 border">
  <div className="text-xl font-semibold mb-6">
    Header Section (Top Banner)
  </div>

  <div className="flex flex-col gap-4">

    <div>
      <label className="block text-sm font-medium mb-1">Head Title</label>
      <input
        type="text"
        className="w-full px-4 py-2 border rounded-xl"
        value={headerSection.headTitle}
        onChange={(e) =>
          setHeaderSection({ ...headerSection, headTitle: e.target.value })
        }
      />
    </div>

    <div>
      <label className="block text-sm font-medium mb-1">Head Description</label>
      <textarea
        className="w-full px-4 py-2 border rounded-xl"
        value={headerSection.headDescription}
        onChange={(e) =>
          setHeaderSection({
            ...headerSection,
            headDescription: e.target.value,
          })
        }
      />
    </div>

    <div>
      <label className="block text-sm font-medium mb-1">Head Image URL</label>
      <input
        type="text"
        className="w-full px-4 py-2 border rounded-xl"
        value={headerSection.headImage}
        onChange={(e) =>
          setHeaderSection({ ...headerSection, headImage: e.target.value })
        }
      />
    </div>

    <div>
      <label className="block text-sm font-medium mb-1">Head Video URL</label>
      <input
        type="text"
        className="w-full px-4 py-2 border rounded-xl"
        value={headerSection.headVideo}
        onChange={(e) =>
          setHeaderSection({ ...headerSection, headVideo: e.target.value })
        }
      />
    </div>

  </div>
</div>

                    {/* Media Images */}
                    <div className="bg-white rounded-3xl shadow-[0_8px_28px_rgba(0,0,0,0.02)] p-7 mb-8 border border-slate-100 transition-shadow hover:shadow-[0_16px_32px_rgba(0,0,0,0.04)]">
                        <div className="text-xl font-semibold text-slate-800 flex items-center gap-2 border-b-2 border-slate-100 pb-3 mb-6">
                            <i className="fas fa-image text-blue-500"></i> Offer Media
                        </div>
                        <div className="flex flex-col gap-8">

                            <div className="bg-blue-50/30 rounded-3xl p-6 border border-blue-100/50">
                                <h4 className="text-base font-semibold text-slate-800 mb-4 flex items-center gap-2"><i className="fas fa-images text-blue-500"></i> Banner Images</h4>
                                <div
                                    className="border-2 border-dashed border-slate-300 rounded-3xl p-6 text-center bg-white cursor-pointer mb-4 hover:bg-slate-50 transition-colors group"
                                    onDrop={(e) => onDropHandler(e, 'banner')}
                                    onDragOver={onDragOverHandler}
                                    onClick={() => document.getElementById('banner-upload')?.click()}
                                >
                                    <input
                                        type="file"
                                        id="banner-upload"
                                        multiple
                                        accept="image/*"
                                        className="hidden"
                                        onChange={(e) => handleFileUpload(e.target.files, 'banner')}
                                    />
                                    <i className="fas fa-cloud-upload-alt text-3xl text-slate-400 mb-2 group-hover:text-blue-500 transition-colors"></i>
                                    <p className="text-slate-500 group-hover:text-slate-700">Drag & drop or click to upload (multiple)</p>
                                </div>
                                <div className="flex gap-2 mb-4">
                                    <input
                                        type="text"
                                        className="flex-1 px-4 py-2 border-[1.5px] border-slate-200 rounded-2xl text-[0.95rem] bg-white focus:outline-none focus:border-blue-600"
                                        placeholder="Image URL"
                                        value={tempInputs.banner}
                                        onChange={(e) => setTempInputs({ ...tempInputs, banner: e.target.value })}
                                    />
                                    <button className="bg-blue-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-blue-700 transition-colors" onClick={() => addMedia('banner')}>Add</button>
                                </div>
                                <div className="flex flex-wrap gap-4 mt-2 max-h-[180px] overflow-y-auto p-1">
                                    {bannerImages.map((url, i) => (
                                        <div key={i} className="w-[70px] h-[70px] rounded-xl bg-slate-100 relative border border-slate-200 overflow-hidden group">
                                            <img src={url} alt="preview" className="w-full h-full object-cover" onError={(e) => e.currentTarget.src = 'https://placehold.co/70x70/e2e8f0/64748b?text=Error'} />
                                            <span className="absolute -top-1.5 -right-1.5 bg-white rounded-full w-6 h-6 flex items-center justify-center shadow-md cursor-pointer border border-slate-200 text-slate-500 hover:text-red-500 hover:bg-red-50 transition-colors z-10" onClick={() => removeMedia('banner', i)}><i className="fas fa-times text-xs"></i></span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-blue-50/30 rounded-3xl p-6 border border-blue-100/50">
                                <h4 className="text-base font-semibold text-slate-800 mb-4 flex items-center gap-2"><i className="fas fa-video text-blue-500"></i> Videos</h4>
                                <div
                                    className="border-2 border-dashed border-slate-300 rounded-3xl p-6 text-center bg-white cursor-pointer mb-4 hover:bg-slate-50 transition-colors group"
                                    onDrop={(e) => onDropHandler(e, 'video')}
                                    onDragOver={onDragOverHandler}
                                    onClick={() => document.getElementById('video-upload')?.click()}
                                >
                                    <input
                                        type="file"
                                        id="video-upload"
                                        multiple
                                        accept="video/*"
                                        className="hidden"
                                        onChange={(e) => handleFileUpload(e.target.files, 'video')}
                                    />
                                    <i className="fas fa-cloud-upload-alt text-3xl text-slate-400 mb-2 group-hover:text-blue-500 transition-colors"></i>
                                    <p className="text-slate-500 group-hover:text-slate-700">Drag & drop videos or click to upload</p>
                                </div>
                                <div className="flex gap-2 mb-4">
                                    <input
                                        type="text"
                                        className="flex-1 px-4 py-2 border-[1.5px] border-slate-200 rounded-2xl text-[0.95rem] bg-white focus:outline-none focus:border-blue-600"
                                        placeholder="Video URL"
                                        value={tempInputs.video}
                                        onChange={(e) => setTempInputs({ ...tempInputs, video: e.target.value })}
                                    />
                                    <button className="bg-blue-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-blue-700 transition-colors" onClick={() => addMedia('video')}>Add</button>
                                </div>
                                <div className="flex flex-wrap gap-4 mt-2 max-h-[180px] overflow-y-auto p-1">
                                    {videos.map((url, i) => (
                                        <div key={i} className="w-[70px] h-[70px] rounded-xl bg-slate-100 flex items-center justify-center relative border border-slate-200 group">
                                            <i className="fas fa-play text-blue-600 text-xl"></i>
                                            <span className="absolute -top-1.5 -right-1.5 bg-white rounded-full w-6 h-6 flex items-center justify-center shadow-md cursor-pointer border border-slate-200 text-slate-500 hover:text-red-500 hover:bg-red-50 transition-colors z-10" onClick={() => removeMedia('video', i)}><i className="fas fa-times text-xs"></i></span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                        </div>
                    </div>

                    {/* City Targeting */}
                    <div className="bg-white rounded-3xl shadow-[0_8px_28px_rgba(0,0,0,0.02)] p-7 mb-8 border border-slate-100 transition-shadow hover:shadow-[0_16px_32px_rgba(0,0,0,0.04)]">
                        <div className="text-xl font-semibold text-slate-800 flex items-center gap-2 border-b-2 border-slate-100 pb-3 mb-6">
                            <i className="fas fa-city text-blue-500"></i> City Targeting (State-wise)
                        </div>
                        <div className="flex flex-wrap gap-8 items-start">
                            <div className="flex items-center gap-2 pt-3">
                                <input
                                    type="checkbox"
                                    checked={cityTarget.allCities}
                                    onChange={() => setCityTarget({ ...cityTarget, allCities: !cityTarget.allCities, state: '' })}
                                    className="w-[1.1rem] h-[1.1rem] accent-blue-600 rounded cursor-pointer"
                                />
                                <span className="text-slate-800">All Cities</span>
                            </div>
                            <div className="min-w-[200px]">
                                <select
                                    className="w-full px-4 py-3 border-[1.5px] border-slate-200 rounded-2xl text-[0.95rem] bg-white focus:outline-none focus:border-blue-600 disabled:bg-slate-100 disabled:text-slate-400"
                                    disabled={cityTarget.allCities}
                                    value={cityTarget.state}
                                    onChange={(e) => setCityTarget({ ...cityTarget, state: e.target.value, selectedCities: [] })}
                                >
                                    <option value="">-- Select State --</option>
                                    {Object.keys(cityData).map(k => (
                                        <option key={k} value={k} className="capitalize">{k}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex-1 min-w-[300px]">
                                <CitySelector
                                    cities={cityTarget.state ? cityData[cityTarget.state] || [] : []}
                                    selectedCities={cityTarget.selectedCities}
                                    onChange={(newSelection) => setCityTarget({ ...cityTarget, selectedCities: newSelection })}
                                    disabled={cityTarget.allCities || !cityTarget.state}
                                />
                            </div>
                        </div>
                        <div className="text-sm text-slate-500 mt-4 pt-2 border-t border-slate-50">Select a state to load cities. “All Cities” disables both dropdowns.</div>
                    </div>

                    {/* Promo Config */}
                    <div className="bg-white rounded-3xl shadow-[0_8px_28px_rgba(0,0,0,0.02)] p-7 mb-8 border border-slate-100 transition-shadow hover:shadow-[0_16px_32px_rgba(0,0,0,0.04)]">
                        <div className="text-xl font-semibold text-slate-800 flex items-center gap-2 border-b-2 border-slate-100 pb-3 mb-6">
                            <i className="fas fa-ticket text-blue-500"></i> Promo Configuration
                        </div>
                        <div className="flex flex-wrap gap-4 mb-6">
                            <div className="flex-1 min-w-[300px]">
                                <label className="block font-medium text-slate-700 mb-1.5 text-sm">Promo Code</label>
                                <input
                                    className="w-full px-4 py-3 border-[1.5px] border-slate-200 rounded-2xl text-[0.95rem] bg-white uppercase focus:outline-none focus:border-blue-600"
                                    type="text"
                                    value={promo.code}
                                    onChange={(e) => setPromo({ ...promo, code: e.target.value.toUpperCase() })}
                                />
                            </div>
                            <div className="flex-1 min-w-[300px] flex items-center gap-4 pt-6">
                                <span className="font-medium text-slate-700">Visible to Users</span>
                                <label className="relative inline-block w-[52px] h-[28px]">
                                    <input
                                        type="checkbox"
                                        checked={promo.visible}
                                        onChange={() => setPromo({ ...promo, visible: !promo.visible })}
                                        className="opacity-0 w-0 h-0 peer"
                                    />
                                    <span className="absolute cursor-pointer top-0 left-0 right-0 bottom-0 bg-slate-300 transition-all duration-200 rounded-[34px] peer-checked:bg-blue-600 before:absolute before:content-[''] before:h-[22px] before:w-[22px] before:left-[3px] before:bottom-[3px] before:bg-white before:transition-all before:duration-200 before:rounded-full peer-checked:before:translate-x-[24px]"></span>
                                </label>
                            </div>
                        </div>
                        <div className="bg-blue-50/30 rounded-3xl p-6 border border-blue-100/50 mt-4">
                            <h4 className="text-base font-semibold text-slate-800 mb-4 flex items-center gap-2"><i className="fas fa-image text-blue-500"></i> Promo Images</h4>
                            <div
                                className="border-2 border-dashed border-slate-300 rounded-3xl p-6 text-center bg-white cursor-pointer mb-4 hover:bg-slate-50 transition-colors group"
                                onDrop={(e) => onDropHandler(e, 'promo')}
                                onDragOver={onDragOverHandler}
                                onClick={() => document.getElementById('promo-upload')?.click()}
                            >
                                <input
                                    type="file"
                                    id="promo-upload"
                                    multiple
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => handleFileUpload(e.target.files, 'promo')}
                                />
                                <i className="fas fa-cloud-upload-alt text-3xl text-slate-400 mb-2 group-hover:text-blue-500 transition-colors"></i>
                                <p className="text-slate-500 group-hover:text-slate-700">Drag & drop or click to upload (multiple)</p>
                            </div>
                            <div className="flex gap-2 mb-4">
                                <input
                                    type="text"
                                    className="flex-1 px-4 py-2 border-[1.5px] border-slate-200 rounded-2xl text-[0.95rem] bg-white focus:outline-none focus:border-blue-600"
                                    placeholder="Promo Image URL"
                                    value={tempInputs.promo}
                                    onChange={(e) => setTempInputs({ ...tempInputs, promo: e.target.value })}
                                />
                                <button className="bg-blue-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-blue-700 transition-colors" onClick={() => addMedia('promo')}>Add</button>
                            </div>
                            <div className="flex flex-wrap gap-4 mt-2 max-h-[180px] overflow-y-auto p-1">
                                {promoImages.map((url, i) => (
                                    <div key={i} className="w-[70px] h-[70px] rounded-xl bg-slate-100 relative border border-slate-200 overflow-hidden group">
                                        <img src={url} alt="preview" className="w-full h-full object-cover" onError={(e) => e.currentTarget.src = 'https://placehold.co/70x70/8b5cf6/white?text=promo'} />
                                        <span className="absolute -top-1.5 -right-1.5 bg-white rounded-full w-6 h-6 flex items-center justify-center shadow-md cursor-pointer border border-slate-200 text-slate-500 hover:text-red-500 hover:bg-red-50 transition-colors z-10" onClick={() => removeMedia('promo', i)}><i className="fas fa-times text-xs"></i></span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Discount Settings */}
                    <div className="bg-white rounded-3xl shadow-[0_8px_28px_rgba(0,0,0,0.02)] p-7 mb-8 border border-slate-100 transition-shadow hover:shadow-[0_16px_32px_rgba(0,0,0,0.04)]">
                        <div className="text-xl font-semibold text-slate-800 flex items-center gap-2 border-b-2 border-slate-100 pb-3 mb-6">
                            <i className="fas fa-percent text-blue-500"></i> Discount Settings
                        </div>
                        <div className="flex flex-wrap gap-4 mb-6">
                            <div className="flex-1 max-w-[200px]">
                                <label className="block font-medium text-slate-700 mb-1.5 text-sm">Discount Type</label>
                                <select
                                    className="w-full px-4 py-3 border-[1.5px] border-slate-200 rounded-2xl text-[0.95rem] bg-white focus:outline-none focus:border-blue-600"
                                    value={discount.type}
                                    onChange={(e) => setDiscount({ ...discount, type: e.target.value })}
                                >
                                    <option value="percentage">Percentage (%)</option>
                                    <option value="fixed">Fixed Amount (₹)</option>
                                    <option value="upto">Upto</option>
                                </select>
                            </div>
                            <div className="flex-1 min-w-[300px]">
                                <label className="block font-medium text-slate-700 mb-1.5 text-sm">Discount Value <span className="text-red-500">*</span></label>
                                <div className="flex items-center">
                                    <span className="bg-slate-100 px-4 py-3 border-[1.5px] border-r-0 border-slate-200 rounded-l-2xl font-medium text-slate-600">
                                        {discount.type === 'percentage' ? '%' : discount.type === 'fixed' ? '₹' : 'upto ₹'}
                                    </span>
                                    <input
                                        className="w-[150px] px-4 py-3 border-[1.5px] border-slate-200 rounded-r-2xl text-[0.95rem] bg-white focus:outline-none focus:border-blue-600 border-l-0"
                                        type="number"
                                        value={discount.value}
                                        onChange={(e) => setDiscount({ ...discount, value: Number(e.target.value) })}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Usage Limits */}
                    <div className="bg-white rounded-3xl shadow-[0_8px_28px_rgba(0,0,0,0.02)] p-7 mb-8 border border-slate-100 transition-shadow hover:shadow-[0_16px_32px_rgba(0,0,0,0.04)]">
                        <div className="text-xl font-semibold text-slate-800 flex items-center gap-2 border-b-2 border-slate-100 pb-3 mb-6">
                            <i className="fas fa-chart-line text-blue-500"></i> Usage Limits
                        </div>
                        <div className="flex flex-wrap gap-4 mb-6">
                            <div className="flex-1 min-w-[300px]">
                                <label className="block font-medium text-slate-700 mb-1.5 text-sm">Total Use Limit</label>
                                <div className="flex gap-8 items-center flex-wrap mt-2">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="totalLimit"
                                            value="unlimited"
                                            checked={limits.totalType === 'unlimited'}
                                            onChange={() => setLimits({ ...limits, totalType: 'unlimited' })}
                                            className="w-[1.1rem] h-[1.1rem] accent-blue-600"
                                        /> <span className="text-slate-700">No Limit</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="totalLimit"
                                            value="limited"
                                            checked={limits.totalType === 'limited'}
                                            onChange={() => setLimits({ ...limits, totalType: 'limited' })}
                                            className="w-[1.1rem] h-[1.1rem] accent-blue-600"
                                        /> <span className="text-slate-700">Limited</span>
                                    </label>
                                </div>
                                {limits.totalType === 'limited' && (
                                    <div className="mt-3">
                                     <input
  className="w-[200px] px-4 py-2 border-[1.5px] border-slate-200 rounded-2xl text-[0.95rem] bg-white focus:outline-none focus:border-blue-600"
  type="number"
  placeholder="Max uses"
  value={limits.totalValue}
  onChange={(e) =>
    setLimits({ ...limits, totalValue: e.target.value })
  }
/>

                                    </div>
                                )}
                            </div>
                            <div className="flex-1 min-w-[300px]">
                                <label className="block font-medium text-slate-700 mb-1.5 text-sm">Per User Limit</label>
                                <div className="flex gap-8 items-center flex-wrap mt-2">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="userLimit"
                                            value="unlimited"
                                            checked={limits.userType === 'unlimited'}
                                            onChange={() => setLimits({ ...limits, userType: 'unlimited' })}
                                            className="w-[1.1rem] h-[1.1rem] accent-blue-600"
                                        /> <span className="text-slate-700">No Limit</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="userLimit"
                                            value="limited"
                                            checked={limits.userType === 'limited'}
                                            onChange={() => setLimits({ ...limits, userType: 'limited' })}
                                            className="w-[1.1rem] h-[1.1rem] accent-blue-600"
                                        /> <span className="text-slate-700">Limited</span>
                                    </label>
                                </div>
                                {limits.userType === 'limited' && (
                                    <div className="mt-3">
                                     <input
  className="w-[200px] px-4 py-2 border-[1.5px] border-slate-200 rounded-2xl text-[0.95rem] bg-white focus:outline-none focus:border-blue-600"
  type="number"
  placeholder="Per user"
  value={limits.userValue}
  onChange={(e) =>
    setLimits({ ...limits, userValue: e.target.value })
  }
/>

                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Validity */}
                    <div className="bg-white rounded-3xl shadow-[0_8px_28px_rgba(0,0,0,0.02)] p-7 mb-8 border border-slate-100 transition-shadow hover:shadow-[0_16px_32px_rgba(0,0,0,0.04)]">
                        <div className="text-xl font-semibold text-slate-800 flex items-center gap-2 border-b-2 border-slate-100 pb-3 mb-6">
                            <i className="fas fa-calendar-alt text-blue-500"></i> Offer Validity
                        </div>
                        <div className="flex flex-wrap gap-4 mb-6">
                            <div className="flex-1 min-w-[300px]">
                                <label className="block font-medium text-slate-700 mb-1.5 text-sm">From</label>
                                <input
                                    className="w-full px-4 py-3 border-[1.5px] border-slate-200 rounded-2xl text-[0.95rem] bg-white focus:outline-none focus:border-blue-600"
                                    type="text"
                                    placeholder="DD/MM/YYYY"
                                    value={validity.fromDate}
                                    onChange={(e) => setValidity({ ...validity, fromDate: e.target.value })}
                                />
                                <input
                                    className="w-full px-4 py-3 border-[1.5px] border-slate-200 rounded-2xl text-[0.95rem] bg-white mt-2 focus:outline-none focus:border-blue-600"
                                    type="text"
                                    placeholder="HH:MM"
                                    value={validity.fromTime}
                                    onChange={(e) => setValidity({ ...validity, fromTime: e.target.value })}
                                />
                            </div>
                            <div className="flex-1 min-w-[300px]">
                                <label className="block font-medium text-slate-700 mb-1.5 text-sm">To</label>
                                <input
                                    className="w-full px-4 py-3 border-[1.5px] border-slate-200 rounded-2xl text-[0.95rem] bg-white focus:outline-none focus:border-blue-600"
                                    type="text"
                                    placeholder="DD/MM/YYYY"
                                    value={validity.toDate}
                                    onChange={(e) => setValidity({ ...validity, toDate: e.target.value })}
                                />
                                <input
                                    className="w-full px-4 py-3 border-[1.5px] border-slate-200 rounded-2xl text-[0.95rem] bg-white mt-2 focus:outline-none focus:border-blue-600"
                                    type="text"
                                    placeholder="HH:MM"
                                    value={validity.toTime}
                                    onChange={(e) => setValidity({ ...validity, toTime: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Payment Type */}
                    <div className="bg-white rounded-3xl shadow-[0_8px_28px_rgba(0,0,0,0.02)] p-7 mb-8 border border-slate-100 transition-shadow hover:shadow-[0_16px_32px_rgba(0,0,0,0.04)]">
                        <div className="text-xl font-semibold text-slate-800 flex items-center gap-2 border-b-2 border-slate-100 pb-3 mb-6">
                            <i className="fas fa-credit-card text-blue-500"></i> Payment Type
                        </div>
                        <div className="flex flex-wrap gap-8 items-center">
                            <label className="flex items-center gap-2 cursor-pointer text-slate-800">
                                <input
                                    type="checkbox"
                                    checked={payment.cash}
                                    disabled={payment.all}
                                    onChange={() => setPayment({ ...payment, cash: !payment.cash })}
                                    className="w-[1.1rem] h-[1.1rem] accent-blue-600 rounded cursor-pointer"
                                /> <span>Cash</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer text-slate-800">
                                <input
                                    type="checkbox"
                                    checked={payment.online}
                                    disabled={payment.all}
                                    onChange={() => setPayment({ ...payment, online: !payment.online })}
                                    className="w-[1.1rem] h-[1.1rem] accent-blue-600 rounded cursor-pointer"
                                /> <span>Online</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer text-slate-800">
                                <input
                                    type="checkbox"
                                    checked={payment.others}
                                    disabled={payment.all}
                                    onChange={() => setPayment({ ...payment, others: !payment.others })}
                                    className="w-[1.1rem] h-[1.1rem] accent-blue-600 rounded cursor-pointer"
                                /> <span>Others</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer text-slate-800">
                                <input
                                    type="checkbox"
                                    checked={payment.all}
                                    onChange={() => setPayment({
                                        cash: false,
                                        online: false,
                                        others: false,
                                        all: !payment.all,
                                        othersText: ''
                                    })}
                                    className="w-[1.1rem] h-[1.1rem] accent-blue-600 rounded cursor-pointer"
                                /> <span>All</span>
                            </label>
                        </div>
                        {payment.others && !payment.all && (
                            <div className="mt-4 ml-0 md:ml-8 w-full md:w-[250px]">
                                <input
                                    type="text"
                                    className="w-full px-4 py-3 border-[1.5px] border-slate-200 rounded-2xl text-[0.95rem] bg-white focus:outline-none focus:border-blue-600"
                                    placeholder="Specify other payment type"
                                    value={payment.othersText}
                                    onChange={(e) => setPayment({ ...payment, othersText: e.target.value })}
                                />
                            </div>
                        )}
                    </div>

                    {/* Min Spend */}
                    <div className="bg-white rounded-3xl shadow-[0_8px_28px_rgba(0,0,0,0.02)] p-7 mb-8 border border-slate-100 transition-shadow hover:shadow-[0_16px_32px_rgba(0,0,0,0.04)]">
                        <div className="text-xl font-semibold text-slate-800 flex items-center gap-2 border-b-2 border-slate-100 pb-3 mb-6">
                            <i className="fas fa-cart-arrow-down text-blue-500"></i> Minimum Spend Requirement
                        </div>
                        <div className="flex flex-wrap gap-4 mb-4">
                            <div className="flex gap-8 items-center flex-wrap">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="minSpend"
                                        checked={!minSpend.active}
                                        onChange={() => setMinSpend({ ...minSpend, active: false })}
                                        className="w-[1.1rem] h-[1.1rem] accent-blue-600"
                                    /> <span className="text-slate-700">No Limit</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="minSpend"
                                        checked={minSpend.active}
                                        onChange={() => setMinSpend({ ...minSpend, active: true })}
                                        className="w-[1.1rem] h-[1.1rem] accent-blue-600"
                                    /> <span className="text-slate-700">Minimum Spend Required</span>
                                </label>
                            </div>
                        </div>
                        {minSpend.active && (
                            <div className="flex items-center mt-2">
                                <span className="bg-slate-100 px-4 py-3 border-[1.5px] border-r-0 border-slate-200 rounded-l-2xl font-medium text-slate-600">₹</span>
                                <input
                                    className="w-[150px] px-4 py-3 border-[1.5px] border-slate-200 rounded-r-2xl text-[0.95rem] bg-white focus:outline-none focus:border-blue-600 border-l-0"
                                    type="number"
                                    value={minSpend.value}
                                    onChange={(e) => setMinSpend({ ...minSpend, value: Number(e.target.value) })}
                                />
                            </div>
                        )}
                    </div>

                </main>

                <div className="fixed bottom-6 right-6 md:right-8 bg-white px-8 py-4 rounded-full shadow-[0_8px_28px_rgba(0,0,0,0.12)] flex gap-6 border border-slate-200 z-50">
                    <button className="bg-white text-slate-700 px-8 py-2.5 rounded-full font-semibold border border-slate-300 hover:bg-slate-50 transition-colors">Cancel</button>
                   <button disabled={saving} onClick={handleSaveOffer} className="bg-blue-600 text-white px-6 py-2 rounded-full disabled:opacity-50">{saving ? "Saving..." : "Save Offer"}</button>


                </div>
            </div>
        </>
    );
}
