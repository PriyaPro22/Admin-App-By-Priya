'use client';

import React, { useState, useEffect } from 'react';

// Type definitions
type ChildCategory = string;
type SubCategory = { id: string; name: string; childCategories?: ChildCategory[] };
type MainCategory = { id: string; name: string; subCategories?: SubCategory[] };
type Department = { id: string; name: string; mainCategories?: MainCategory[] };




// export const cityData: Record<string, string[]> = {
const cityData: Record<string, string[]> = {
  // ───────────── UTTAR PRADESH (75 Districts) ─────────────
  "Uttar Pradesh": [
   "All", "Agra","Aligarh","Ambedkar Nagar","Amethi","Amroha","Auraiya","Ayodhya",
    "Azamgarh","Baghpat","Bahraich","Ballia","Balrampur","Banda","Barabanki",
    "Bareilly","Basti","Bhadohi","Bijnor","Budaun","Bulandshahr","Chandauli",
    "Chitrakoot","Deoria","Etah","Etawah","Farrukhabad","Fatehpur","Firozabad",
    "Gautam Buddha Nagar","Ghaziabad","Ghazipur","Gonda","Gorakhpur","Hamirpur",
    "Hapur","Hardoi","Hathras","Jalaun","Jaunpur","Jhansi","Kannauj",
    "Kanpur Dehat","Kanpur Nagar","Kasganj","Kaushambi","Kheri",
    "Kushinagar","Lalitpur","Lucknow","Maharajganj","Mahoba",
    "Mainpuri","Mathura","Mau","Meerut","Mirzapur","Moradabad",
    "Muzaffarnagar","Pilibhit","Pratapgarh","Prayagraj",
    "Raebareli","Rampur","Saharanpur","Sambhal",
    "Sant Kabir Nagar","Shahjahanpur","Shamli","Shravasti",
    "Siddharthnagar","Sitapur","Sonbhadra","Sultanpur",
    "Unnao","Varanasi"
  ],

  // ───────────── HARYANA (22 Districts) ─────────────
  "Haryana": [
    "Ambala","Bhiwani","Charkhi Dadri","Faridabad","Fatehabad",
    "Gurugram","Hisar","Jhajjar","Jind","Kaithal",
    "Karnal","Kurukshetra","Mahendragarh","Nuh",
    "Palwal","Panchkula","Panipat","Rewari",
    "Rohtak","Sirsa","Sonipat","Yamunanagar"
  ],

  // ───────────── BIHAR (38 Districts) ─────────────
  "Bihar": [
    "Araria","Arwal","Aurangabad","Banka","Begusarai","Bhagalpur","Bhojpur",
    "Buxar","Darbhanga","East Champaran","Gaya","Gopalganj","Jamui",
    "Jehanabad","Kaimur","Katihar","Khagaria","Kishanganj",
    "Lakhisarai","Madhepura","Madhubani","Munger","Muzaffarpur",
    "Nalanda","Nawada","Patna","Purnia","Rohtas",
    "Saharsa","Samastipur","Saran","Sheikhpura",
    "Sheohar","Sitamarhi","Siwan","Supaul",
    "Vaishali","West Champaran"
  ],

  // ───────────── DELHI (11 Districts) ─────────────
  "Delhi": [
    "Central Delhi","East Delhi","New Delhi","North Delhi",
    "North East Delhi","North West Delhi","Shahdara",
    "South Delhi","South East Delhi",
    "South West Delhi","West Delhi"
  ],
  "Chhattisgarh": [
  "Balod",
  "Baloda Bazar",
  "Balrampur",
  "Bastar",
  "Bemetara",
  "Bijapur",
  "Bilaspur",
  "Dantewada",
  "Dhamtari",
  "Durg",
  "Gariaband",
  "Gaurela-Pendra-Marwahi",
  "Janjgir-Champa",
  "Jashpur",
  "Kabirdham",
  "Kanker",
  "Kondagaon",
  "Korba",
  "Korea",
  "Mahasamund",
  "Manendragarh-Chirmiri-Bharatpur",
  "Mohla-Manpur-Ambagarh Chowki",
  "Mungeli",
  "Narayanpur",
  "Raigarh",
  "Raipur",
  "Rajnandgaon",
  "Sakti",
  "Sarangarh-Bilaigarh",
  "Sukma",
  "Surajpur",
  "Surguja",
  "Khairagarh-Chhuikhadan-Gandai"
]
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
  // Media — blob preview URLs (for display only)
  const [bannerImages, setBannerImages] = useState<string[]>([]);
  const [bannerFiles, setBannerFiles] = useState<File[]>([]);
  const [bannerCloudUrls, setBannerCloudUrls] = useState<string[]>([]); // ← real Cloudinary URLs

  const [videos, setVideos] = useState<string[]>([]);
  const [videoFiles, setVideoFiles] = useState<File[]>([]);
  const [videoCloudUrls, setVideoCloudUrls] = useState<string[]>([]); // ← real Cloudinary URLs

  const [promoImages, setPromoImages] = useState<string[]>([]);
  const [promoFiles, setPromoFiles] = useState<File[]>([]);
  const [promoCloudUrls, setPromoCloudUrls] = useState<string[]>([]);  // ← real Cloudinary URLs

  // Header Cloudinary URLs
  const [headImageCloudUrl, setHeadImageCloudUrl] = useState<string>("");
  const [headVideoCloudUrl, setHeadVideoCloudUrl] = useState<string>("");

  const [tempInputs, setTempInputs] = useState({
    banner: "",
    video: "",
    promo: "",
  });
  // ── Upload a single file → Cloudinary URL (temp offer auto-deleted) ─────────
  const uploadFileToCDN = async (
    file: File,
    fieldName: string
  ): Promise<string | null> => {
    try {
      const fd = new FormData();
      fd.append(fieldName, file);
      fd.append("title", "__temp_upload__");
      fd.append("description", "__temp__");

      const res = await fetch(
        "https://live.bijliwalaaya.in/api/offers/add-offer",
        { method: "POST", headers: { "x-api-token": "super_secure_token" }, body: fd }
      );
      if (!res.ok) return null;

      const data = await res.json();
      console.log("CDN upload response:", JSON.stringify(data).slice(0, 400));

      // Try all common response shapes to find the _id and URL
      const offer = data?.data ?? data?.offer ?? data;
      const _id = offer?._id;
      const cdnUrl = offer?.[fieldName] ?? null;

      // ✅ Immediately delete the temp offer (awaited so it actually completes)
      if (_id) {
        try {
          await fetch(`https://live.bijliwalaaya.in/api/offers/${_id}`, {
            method: "DELETE",
            headers: { "x-api-token": "super_secure_token" },
          });
          console.log("Temp offer deleted:", _id);
        } catch { /* ignore delete errors */ }
      }

      return cdnUrl;
    } catch {
      return null;
    }
  };

  const handleFileUpload = (
    files: FileList | null,
    type: "banner" | "video" | "promo"
  ) => {
    if (!files) return;
    Array.from(files).forEach(file => {
      const preview = URL.createObjectURL(file);
      if (type === "banner") { setBannerImages(p => [...p, preview]); setBannerFiles(p => [...p, file]); }
      if (type === "video") { setVideos(p => [...p, preview]); setVideoFiles(p => [...p, file]); }
      if (type === "promo") { setPromoImages(p => [...p, preview]); setPromoFiles(p => [...p, file]); }
    });
  };

  const [offers, setOffers] = useState<any[]>([]);
  const [mainCategories, setMainCategories] = useState<any[]>([]);
  const [subCategories, setSubCategories] = useState<Record<string, any[]>>({});
  const [childCategories, setChildCategories] = useState<Record<string, any[]>>({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [headerImageFile, setHeaderImageFile] = useState<File | null>(null);
  const [headerVideoFile, setHeaderVideoFile] = useState<File | null>(null);

  useEffect(() => {
    fetchMainCategories();
  }, []);
  const fetchMainCategories = async () => {
    try {
      setLoading(true);

      const res = await fetch(
        "https://live.bijliwalaaya.in/api/product-listing/main",
        {
          headers: {
            "x-api-token": "super_secure_token",
          },
        }
      );

      const data = await res.json();

      if (data.success) {
        if (data.success) {
          const mains = data.data;
          setMainCategories(mains);

          // 🔥 Auto fetch sub categories
          mains.forEach((main: any) => {
            if (main.hasSubCategory) {
              fetchSubCategories(main._id);
            }
          });
        }
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
        `https://live.bijliwalaaya.in/api/product-listing/main/${mainId}/sub`,
        {
          headers: {
            "x-api-token": "super_secure_token",
          },
        }
      );

      const data = await res.json();

      if (data.success) {
        // API returns data.data as an object with documentId keys (not nested under subCategory)
        const subObject = data.data || {};

        const subArray = Object.values(subObject);

        setSubCategories(prev => ({
          ...prev,
          [mainId]: subArray
        }));
      }
    } catch (error) {
      console.error("Error fetching sub categories:", error);
    }
  };
  // Parses child category API response (name-keyed object) into a flat array
  const parseChildData = (rawData: any): any[] => {
    if (!rawData || typeof rawData !== 'object') return [];
    return Object.entries(rawData)
      // Filter out non-category entries that have no name or are media objects
      .filter(([key, val]: [string, any]) =>
        val && typeof val === 'object' && val.name &&
        typeof val.name === 'string' &&
        // skip childCatMedia-type entries (media containers, not categories)
        !key.toLowerCase().includes('media') &&
        val.name !== 'childCat' && val.name !== 'images'
      )
      .map(([, val]: [string, any]) => ({
        name: val.name,
        visibility: val.visibility,
      }));
  };

  const fetchChildCategories = async (mainId: string, subId: string) => {
    try {
      const res = await fetch(
        `https://live.bijliwalaaya.in/api/product-listing/main/${mainId}/sub/${subId}/child`,
        {
          headers: { "x-api-token": "super_secure_token" },
        }
      );
      const data = await res.json();
      if (data.success) {
        setChildCategories(prev => ({
          ...prev,
          [`${mainId}-${subId}`]: parseChildData(data.data)
        }));
      }
    } catch (error) {
      console.error("Error fetching child categories:", error);
    }
  };

  // New: fetch child categories directly under a main category (no sub)
  const fetchDirectChildCategories = async (mainId: string) => {
    try {
      const res = await fetch(
        `https://live.bijliwalaaya.in/api/product-listing/main/${mainId}/child`,
        {
          headers: { "x-api-token": "super_secure_token" },
        }
      );
      const data = await res.json();
      if (data.success) {
        setChildCategories(prev => ({
          ...prev,
          [`${mainId}-direct`]: parseChildData(data.data)
        }));
      }
    } catch (error) {
      console.error("Error fetching direct child categories:", error);
    }
  };

  // Offers Api

  // const handleSaveOffer = async () => {
  //   if (saving) return;

  //   try {
  //     setSaving(true);

  //     const formData = new FormData();

  //     // text fields
  //     formData.append("title", details.title);
  //     formData.append("description", details.description);
  //     formData.append("promocode", promo.code);

  //     // objects / arrays
  //     formData.append("states", JSON.stringify(details.states));
  //     formData.append("cities", JSON.stringify(details.cities));
  //     formData.append("discountType", JSON.stringify(details.discountType));

  //     // 🔥 REAL FILES ONLY
  //     bannerFiles.forEach(file =>
  //       formData.append("imageUrl", file)
  //     );

  //     videoFiles.forEach(file =>
  //       formData.append("videoUrl", file)
  //     );

  //     promoFiles.forEach(file =>
  //       formData.append("promoLogo", file)
  //     );

  //     const res = await fetch(
  //       "https://live.bijliwalaaya.in/api/offers/add-offer",
  //       {
  //         method: "POST",
  //         headers: {
  //           "x-api-token": "super_secure_token"
  //         },
  //         body: formData
  //       }
  //     );

  //     const data = await res.json();

  //     if (data.success) alert("Offer Created Successfully");
  //     else alert(data.message);

  //   } catch (err) {
  //     console.error(err);
  //     alert("Server error");
  //   } finally {
  //     setSaving(false);
  //   }
  // };
  const handleSaveOffer = async () => {
    if (saving) return;

    if (!details.title?.trim()) { alert("Title is required"); return; }
    if (!details.description?.trim()) { alert("Description is required"); return; }

    try {
      setSaving(true);

      // ─────────────────────────────────────────────────────────────────────
      // STEP 1: Create offer with all structured data (JSON body)
      //         Mongoose embedded arrays/objects REQUIRE real JSON types.
      // ─────────────────────────────────────────────────────────────────────
      const payload = buildPayload();
      const createRes = await fetch(
        "https://live.bijliwalaaya.in/api/offers/add-offer",
        {
          method: "POST",
          headers: { "x-api-token": "super_secure_token", "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      let createData: any = null;
      try { createData = await createRes.json(); } catch {
        alert(`Server crashed (${createRes.status}) — check backend logs.`); return;
      }
      if (!createRes.ok) { alert(createData?.message || `Backend error (${createRes.status})`); return; }

      const offerId = createData?.data?._id ?? createData?.offer?._id ?? createData?._id;
      console.log("Offer created:", offerId, createData);

      // ─────────────────────────────────────────────────────────────────────
      // STEP 2: If files exist, upload them via FormData PUT to the same offer
      //         multer handles them → Cloudinary → URLs stored in the offer
      // ─────────────────────────────────────────────────────────────────────
      const hasFiles = bannerFiles.length || videoFiles.length || promoFiles.length
        || headerImageFile || headerVideoFile;

      if (offerId && hasFiles) {
        const fd = new FormData();
        bannerFiles.forEach(f => fd.append("imageUrl", f));
        videoFiles.forEach(f => fd.append("videoUrl", f));
        promoFiles.forEach(f => fd.append("promoLogo", f));
        if (headerImageFile) fd.append("headImage", headerImageFile);
        if (headerVideoFile) fd.append("headVideo", headerVideoFile);

        const updateRes = await fetch(
          `https://live.bijliwalaaya.in/api/offers/${offerId}`,
          {
            method: "PUT",
            headers: { "x-api-token": "super_secure_token" },
            body: fd,
          }
        );
        const updateData = await updateRes.json().catch(() => null);
        console.log("File update response:", updateData);
      }

      alert("Offer Created Successfully ✅");

      // Reset — all form state
      setDetails({ title: "", description: "", link: "" });
      setBannerImages([]); setBannerFiles([]); setBannerCloudUrls([]);
      setVideos([]); setVideoFiles([]); setVideoCloudUrls([]);
      setPromoImages([]); setPromoFiles([]); setPromoCloudUrls([]);
      setHeaderSection({ headTitle: "", headDescription: "", headImage: "", headVideo: "" });
      setHeaderImageFile(null); setHeaderVideoFile(null);
      setHeadImageCloudUrl(""); setHeadVideoCloudUrl("");
      setOfferTarget({ services: false, rider: false, resale: false, ecommerce: false, all: false });
      setDeptSelection({ homeAppliances: false, computer: false, mobile: false, all: false });
      setTreeState({});
      setCollapsedDepts({});
      setSubCategories({});
      setChildCategories({});
      setCityTarget({ allCities: false, state: "", selectedCities: [] });
      setPromo({ code: "", visible: true });
      setDiscount({ type: "percentage", value: 20 });
      setLimits({ totalType: "unlimited", totalValue: "", userType: "unlimited", userValue: "" });
      setValidity({ fromDate: "", fromTime: "", toDate: "", toTime: "" });
      setPayment({ cash: false, online: false, others: false, all: false, othersText: "" });
      setMinSpend({ active: false, value: 500 });

    } catch (err) {
      console.error("SERVER ERROR:", err);
      alert("Server error");
    } finally {
      setSaving(false);
    }
  };

  // const formatDate = (dateStr: string) => {
  //   const [day, month, year] = dateStr.split("/");
  //   return `${year}-${month}-${day}`;
  // };
  const formatDate = (dateStr: string) => {
    if (!dateStr) return null;
    const parts = dateStr.split("/");
    if (parts.length !== 3) return null;

    const [day, month, year] = parts;
    return `${year}-${month}-${day}`;
  };

  //   const buildPayload = () => {
  //     return {
  //       title: details.title.trim(),
  //       description: details.description.trim(),

  //       offerActive: true,
  //       visibleToUser: promo.visible,
  //       offerVisible: true,

  //       headTitle: headerSection.headTitle,
  //       headDescription: headerSection.headDescription,


  //       select_services: Object.keys(offerTarget)
  //         .filter(key => offerTarget[key as keyof typeof offerTarget] && key !== "all"),

  //       select_departments: Object.keys(deptSelection)
  //         .filter(key => deptSelection[key] && key !== "all"),

  //       select_main_category: mainCategories
  //         .filter(main => !!treeState[main._id])
  //         .map(main => ({
  //           documentId: main._id,
  //           name: main.name
  //         })),

  //       select_sub_category: Object.values(subCategories)
  //         .flat()
  //         .filter((sub: any) => treeState[sub._id])
  //         .map((sub: any) => ({
  //           documentId: sub._id,
  //           name: sub.name
  //         })),

  //       select_child_category: Object.values(childCategories)
  //         .flat()
  //         .filter((child: any) => treeState[child._id])
  //         .map((child: any) => ({
  //           documentId: child._id,
  //           name: child.name
  //         })),

  //       promocode: promo.code,

  //       imageUrl: bannerFiles.length === 0 && bannerImages.length > 0
  //         ? bannerImages[0]
  //         : null,

  //       videoUrl: videoFiles.length === 0 && videos.length > 0
  //         ? videos[0]
  //         : null,

  //       promoLogo: promoFiles.length === 0 && promoImages.length > 0
  //         ? promoImages[0]
  //         : null,

  //       states: cityTarget.allCities
  //         ? []
  //         : cityTarget.state
  //           ? [{ stateName: cityTarget.state }]
  //           : [],

  //       cities: cityTarget.selectedCities.map(city => ({
  //         cityName: city
  //       })),

  //       discountType: {
  //         type: discount.type.toUpperCase(),
  //         maxDiscount: Number(discount.value)
  //       },

  //       discountValue: Number(discount.value),

  //       limit: limits.totalType === "limited"
  //         ? Number(limits.totalValue)
  //         : null,

  //       user_usage_limit: limits.userType === "limited"
  //         ? Number(limits.userValue)
  //         : null,

  //       min_spend: minSpend.active
  //         ? Number(minSpend.value)
  //         : 0,

  //       validity: [{
  //         startDate: formatDate(validity.fromDate),
  //         endDate: formatDate(validity.toDate),
  //         startTime: validity.fromTime,
  //         endTime: validity.toTime
  //       }],

  //       payment_via: payment.all
  //         ? ["ALL"]
  //         : [
  //           payment.cash && "CASH",
  //           payment.online && "ONLINE",
  //           payment.others && payment.othersText
  //         ].filter(Boolean)
  //     };
  //   };

  const buildPayload = () => {
    // ── Core flags ────────────────────────────────────────────────────────
    const payload: any = {
      title: details.title.trim(),
      description: details.description.trim(),
      offerActive: true,
      visibleToUser: promo.visible,
      offerVisible: true,
    };

    // ── Header section ────────────────────────────────────────────────────
    if (headerSection.headTitle) payload.headTitle = headerSection.headTitle;
    if (headerSection.headDescription) payload.headDescription = headerSection.headDescription;
    // Use Cloudinary URL if file was uploaded, else fall back to URL input
    if (headImageCloudUrl) payload.headImage = headImageCloudUrl;
    else if (headerSection.headImage) payload.headImage = headerSection.headImage;
    if (headVideoCloudUrl) payload.headVideo = headVideoCloudUrl;
    else if (headerSection.headVideo) payload.headVideo = headerSection.headVideo;

    // ── Media URLs: Cloudinary (from file upload) OR pasted URL ───────────
    if (bannerCloudUrls.length > 0) payload.imageUrl = bannerCloudUrls[0];
    else if (bannerImages.length > 0 && !bannerImages[0].startsWith('blob:')) payload.imageUrl = bannerImages[0];
    if (videoCloudUrls.length > 0) payload.videoUrl = videoCloudUrls[0];
    else if (videos.length > 0 && !videos[0].startsWith('blob:')) payload.videoUrl = videos[0];
    if (promoCloudUrls.length > 0) payload.promoLogo = promoCloudUrls[0];
    else if (promoImages.length > 0 && !promoImages[0].startsWith('blob:')) payload.promoLogo = promoImages[0];

    // ── Promo ─────────────────────────────────────────────────────────────
    if (promo.code) payload.promocode = promo.code;

    // ── Services (offerTarget) ────────────────────────────────────────────
    const selectedServices = (
      Object.keys(offerTarget) as Array<keyof typeof offerTarget>
    ).filter(k => k !== "all" && offerTarget[k]);
    payload.select_services = selectedServices;

    // ── Departments ───────────────────────────────────────────────────────
    const deptMap: Record<string, string> = {
      homeAppliances: "Home Appliances",
      computer: "Computer",
      mobile: "Mobile",
    };
    const selectedDepts = Object.keys(deptSelection)
      .filter(k => k !== "all" && deptSelection[k])
      .map(k => deptMap[k] ?? k);
    payload.select_departments = selectedDepts;

    // ── Categories (real arrays → Mongoose embedded docs) ─────────────────
    payload.select_main_category = mainCategories
      .filter(main => treeState[main._id])
      .map(main => ({ documentId: main._id, name: main.name }));

    payload.select_sub_category = Object.values(subCategories)
      .flat()
      .filter((sub: any) => treeState[sub.documentId ?? sub._id])
      .map((sub: any) => ({ documentId: sub.documentId ?? sub._id, name: sub.name }));

    payload.select_child_category = Object.values(childCategories)
      .flat()
      // child.name is the identifier (API returns name-keyed objects with no _id/documentId)
      .filter((child: any) => treeState[child.documentId ?? child._id ?? child.name])
      .map((child: any) => ({ documentId: child.documentId ?? child._id ?? child.name, name: child.name }));

    // ── Location (real arrays → Mongoose embedded docs) ───────────────────
    payload.states = cityTarget.allCities
      ? []
      : cityTarget.state
        ? [{ stateName: cityTarget.state }]
        : [];

    payload.cities = cityTarget.selectedCities.map(city => ({ cityName: city }));

    // ── Discount ──────────────────────────────────────────────────────────
    payload.discountValue = Number(discount.value) || 0;
    payload.discountType = {
      type: discount.type.toUpperCase(),
      maxDiscount: Number(discount.value) || 0,
    };

    // ── Limits ────────────────────────────────────────────────────────────
   // ── Limits ────────────────────────────────────────────────────────────
// ── Limits ────────────────────────────────────────────────────────────
payload.limit =
  limits.totalType === "limited"
    ? Number(limits.totalValue) || 0
    : "No Limit";

payload.user_usage_limit =
  limits.userType === "limited"
    ? Number(limits.userValue) || 0
    : "No Limit";

// ── Minimum Spend ─────────────────────────────────────────────────────
payload.min_spend =
  minSpend.active
    ? Number(minSpend.value) || 0
    : "No Limit";

    // ── Validity (real array → Mongoose embedded docs) ────────────────────
    payload.validity = [{
      startDate: formatDate(validity.fromDate),
      endDate: formatDate(validity.toDate),
      startTime: validity.fromTime,
      endTime: validity.toTime,
    }];

    // ── Payment ───────────────────────────────────────────────────────────
    if (payment.all) {
      payload.payment_via = ["ALL"];
    } else {
      payload.payment_via = [
        payment.cash && "CASH",
        payment.online && "ONLINE",
        payment.others && payment.othersText,
      ].filter(Boolean);
    }

    return payload;
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  const handleUpdateOffer = async (id: string) => {
    await fetch(
      `https://live.bijliwalaaya.in/api/offers/${id}`,
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
      "https://live.bijliwalaaya.in/api/offers/all",
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
          {/* Header Section */}
          {/* Header Section */}
          <div className="bg-white rounded-3xl shadow p-7 mb-8 border">

            <div className="text-xl font-semibold mb-6 flex items-center gap-2">
              <i className="fas fa-heading text-blue-500"></i>
              Header Section (Top Banner)
            </div>

            {/* Head Title */}
            <div className="mb-5">
              <label className="block text-sm font-medium mb-2">
                Head Title
              </label>
              <input
                type="text"
                className="w-full px-4 py-3 border rounded-2xl focus:outline-none focus:border-blue-600"
                value={headerSection.headTitle}
                onChange={(e) =>
                  setHeaderSection(prev => ({
                    ...prev,
                    headTitle: e.target.value
                  }))
                }
              />
            </div>

            {/* Head Description */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">
                Head Description
              </label>
              <textarea
                className="w-full px-4 py-3 border rounded-2xl min-h-[90px] focus:outline-none focus:border-blue-600"
                value={headerSection.headDescription}
                onChange={(e) =>
                  setHeaderSection(prev => ({
                    ...prev,
                    headDescription: e.target.value
                  }))
                }
              />
            </div>

            {/* ================= HEADER IMAGE ================= */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">
                Header Image
              </label>

              {/* Hidden Input */}
              <input
                type="file"
                id="header-image-upload"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  setHeaderImageFile(file);
                  setHeaderSection(prev => ({ ...prev, headImage: URL.createObjectURL(file) }));
                }}
              />

              {/* Drop Area */}
              <div
                className="border-2 border-dashed border-slate-300 rounded-3xl p-6 text-center bg-slate-50 cursor-pointer hover:bg-slate-100 transition"
                onClick={() => document.getElementById("header-image-upload")?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  const file = e.dataTransfer.files?.[0];
                  if (!file) return;
                  setHeaderImageFile(file);
                  setHeaderSection(prev => ({ ...prev, headImage: URL.createObjectURL(file) }));
                }}
              >
                <i className="fas fa-cloud-upload-alt text-3xl text-slate-400 mb-2"></i>
                <p className="text-slate-500">Drag &amp; drop image or click to upload</p>
              </div>

              {/* Preview */}
              {headerSection.headImage && (
                <div className="mt-4 relative w-[140px] h-[90px] border rounded-xl overflow-hidden">
                  <img src={headerSection.headImage} className="w-full h-full object-cover" />
                  <span
                    className="absolute -top-2 -right-2 bg-white w-6 h-6 flex items-center justify-center rounded-full shadow cursor-pointer text-red-500"
                    onClick={() => {
                      setHeaderSection(prev => ({ ...prev, headImage: "" }));
                      setHeadImageCloudUrl("");
                    }}
                  >
                    ✕
                  </span>
                </div>
              )}
            </div>

            {/* ================= HEADER VIDEO ================= */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">
                Header Video
              </label>

              {/* Hidden Input */}
              <input
                type="file"
                id="header-video-upload"
                accept="video/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  setHeaderVideoFile(file);
                  setHeaderSection(prev => ({ ...prev, headVideo: URL.createObjectURL(file) }));
                }}
              />

              {/* Drop Area */}
              <div
                className="border-2 border-dashed border-slate-300 rounded-3xl p-6 text-center bg-slate-50 cursor-pointer hover:bg-slate-100 transition"
                onClick={() => document.getElementById("header-video-upload")?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  const file = e.dataTransfer.files?.[0];
                  if (!file) return;
                  setHeaderVideoFile(file);
                  setHeaderSection(prev => ({ ...prev, headVideo: URL.createObjectURL(file) }));
                }}
              >
                <i className="fas fa-cloud-upload-alt text-3xl text-slate-400 mb-2"></i>
                <p className="text-slate-500">Drag &amp; drop video or click to upload</p>
              </div>

              {/* Preview */}
              {headerSection.headVideo && (
                <div className="mt-4 relative w-[140px] h-[90px] border rounded-xl flex items-center justify-center bg-slate-100">
                  <i className="fas fa-play text-blue-600 text-xl"></i>
                  <span
                    className="absolute -top-2 -right-2 bg-white w-6 h-6 flex items-center justify-center rounded-full shadow cursor-pointer text-red-500"
                    onClick={() => {
                      setHeaderSection(prev => ({
                        ...prev,
                        headVideo: ""
                      }));
                      setHeaderVideoFile(null);
                    }}
                  >
                    ✕
                  </span>
                </div>
              )}
            </div>

          </div>
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

          {/* Category Hierarchy Section */}
          <div className="flex flex-col gap-6 mb-8">
            <div className="flex items-center gap-2 mb-2">
              <i className="fas fa-sitemap text-blue-500 text-xl"></i>
              <h3 className="text-xl font-semibold text-slate-800">Category hierarchy (Main → Sub → Child)</h3>
            </div>

            {/* Department Cards Loop */}
            {['homeAppliances', 'computer', 'mobile'].map((deptId) => {
              // visual handling for department names
              const deptName = deptId === 'homeAppliances' ? 'Home Appliances' : deptId === 'computer' ? 'Computer' : 'Mobile';

              // Only render if selected or if 'All' is selected
              if (!deptSelection[deptId] && !deptSelection.all) return null;

              // Let's define: collapsedDepts[id] === true means EXPANDED. (Matches typical boolean toggle for 'isOpen')
              const isOpen = !!collapsedDepts[deptId];

              return (
                <div key={deptId} className="bg-white rounded-3xl shadow-[0_8px_28px_rgba(0,0,0,0.02)] border border-slate-100 transition-shadow hover:shadow-[0_16px_32px_rgba(0,0,0,0.04)] overflow-hidden">

                  {/* Department Header */}
                  <div
                    className="bg-[#f9fbfd] px-7 py-4 border-b border-slate-100 flex items-center justify-between cursor-pointer select-none hover:bg-slate-50 transition-colors"
                    onClick={() => setCollapsedDepts(prev => ({ ...prev, [deptId]: !prev[deptId] }))}
                  >
                    <div className="flex items-center gap-3 font-semibold text-slate-700 text-lg">
                      <i className={`fas fa-chevron-right text-slate-400 text-sm transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`}></i>
                      {deptName}
                    </div>

                    <label
                      className="dept-all-checkbox flex items-center gap-2 bg-white px-4 py-1.5 rounded-full border border-slate-200 text-sm text-slate-600 hover:border-blue-400 cursor-pointer transition-colors shadow-sm"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <input
                        type="checkbox"
                        className="w-4 h-4 accent-blue-600 rounded cursor-pointer"
                        // Logic: Select All categories under this department?
                        // Since we don't have dept filtering, this might select ALL main categories for now. 
                        // The User's Logic: `document.querySelectorAll...`
                        // We'll leave it visual or implement a 'toggleAllInDept' helper if possible.
                        onChange={() => {
                          // Placeholder for 'Select All in Dept' logic
                        }}
                      />
                      <span>All</span>
                    </label>
                  </div>

                  {/* Department Body (Collapsible) */}
                  <div className={`transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-50 overflow-hidden'}`}>
                    <div className="p-7">
                      {loading ? (
                        <div className="text-center py-4 text-slate-400">Loading categories...</div>
                      ) : mainCategories.length === 0 ? (
                        <div className="text-center py-4 text-slate-400">No categories found</div>
                      ) : (
                        // Render Main Categories List
                        <div className="flex flex-col gap-4">
                          {mainCategories
                            .filter(
                              (main) =>
                                main.parentId?.toLowerCase().trim() ===
                                deptName.toLowerCase().trim()
                            )
                            .map((main) => {


                              return (
                                <div key={main._id} className="border-l-[3px] border-slate-200 pl-5 relative">

                                  {/* Main Category Row */}
                                  <div className="flex items-center gap-3 py-1">
                                    <label className="flex items-center gap-2 cursor-pointer text-slate-700 font-medium hover:text-blue-600 transition-colors">
                                      <input
                                        type="checkbox"
                                        className="w-[1.1rem] h-[1.1rem] accent-blue-600 rounded cursor-pointer"
                                        checked={!!treeState[main._id]}
                                        onChange={() => toggleNode(main._id)}
                                      />
                                      <span>{main.name}</span>
                                    </label>

                                    {main.hasSubCategory && (
                                      <button
                                        onClick={() => fetchSubCategories(main._id)}
                                        className="text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded-full text-xs font-semibold transition-colors"
                                      >
                                        {subCategories[main._id] ? 'Refresh' : 'Load Sub'}
                                      </button>
                                    )}

                                    {/* Direct child load button (for mains without sub) */}
                                    {!main.hasSubCategory && (
                                      <button
                                        onClick={() => fetchDirectChildCategories(main._id)}
                                        className="text-purple-600 bg-purple-50 hover:bg-purple-100 px-3 py-1 rounded-full text-xs font-semibold transition-colors"
                                      >
                                        {childCategories[`${main._id}-direct`] ? 'Reload Child' : 'Load Child'}
                                      </button>
                                    )}
                                  </div>

                                  {/* Sub Categories Container */}
                                  {Array.isArray(subCategories[main._id]) && subCategories[main._id].length > 0 && (
                                    <div className="mt-2 flex flex-col gap-3 ml-1">
                                      {subCategories[main._id].map((sub: any) => {
                                        // API returns documentId field (not _id)
                                        const subKey = sub.documentId ?? sub._id;
                                        const childKey = `${main._id}-${subKey}`;
                                        return (
                                          <div key={subKey} className="relative pl-6 before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:border-l-2 before:border-dashed before:border-slate-300">

                                            {/* Sub Category Row */}
                                            <div className="flex items-center gap-3 py-1">
                                              <label className="flex items-center gap-2 cursor-pointer text-slate-700 text-[0.95rem] hover:text-blue-600 transition-colors">
                                                <input
                                                  type="checkbox"
                                                  className="w-[1.05rem] h-[1.05rem] accent-blue-600 rounded cursor-pointer"
                                                  checked={!!treeState[subKey]}
                                                  onChange={() => toggleNode(subKey)}
                                                />
                                                <span>{sub.name}</span>
                                              </label>

                                              <button
                                                onClick={() => fetchChildCategories(main._id, subKey)}
                                                className="text-emerald-600 bg-emerald-50 hover:bg-emerald-100 px-3 py-0.5 rounded-full text-[11px] font-semibold transition-colors"
                                              >
                                                {childCategories[childKey] ? 'Reload' : 'Load Child'}
                                              </button>
                                            </div>

                                            {/* Child Categories Container */}
                                            {Array.isArray(childCategories[childKey]) && childCategories[childKey].length > 0 && (
                                              <div className="mt-1 ml-1 flex flex-col gap-1.5 relative pl-6 before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:border-l-2 before:border-dotted before:border-slate-300">
                                                {childCategories[childKey].map((child: any) => {
                                                  // API returns name as identifier (no documentId/_id)
                                                  const childId = child.name;
                                                  return (
                                                    <div key={childId} className="flex items-center gap-2 py-0.5">
                                                      <label className="flex items-center gap-2 cursor-pointer text-slate-600 text-sm hover:text-blue-600 transition-colors">
                                                        <input
                                                          type="checkbox"
                                                          className="w-4 h-4 accent-blue-600 rounded cursor-pointer"
                                                          checked={!!treeState[childId]}
                                                          onChange={() => toggleNode(childId)}
                                                        />
                                                        <span>{child.name}</span>
                                                      </label>
                                                    </div>
                                                  );
                                                })}
                                              </div>
                                            )}
                                          </div>
                                        );
                                      })}
                                    </div>
                                  )}

                                  {/* Direct child categories (loaded via /main/{id}/child) */}
                                  {Array.isArray(childCategories[`${main._id}-direct`]) && childCategories[`${main._id}-direct`].length > 0 && (
                                    <div className="mt-2 ml-1 flex flex-col gap-1.5 relative pl-6 before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:border-l-2 before:border-dotted before:border-purple-300">
                                      {childCategories[`${main._id}-direct`].map((child: any) => {
                                        const childId = child.name;
                                        return (
                                          <div key={childId} className="flex items-center gap-2 py-0.5">
                                            <label className="flex items-center gap-2 cursor-pointer text-slate-600 text-sm hover:text-purple-600 transition-colors">
                                              <input
                                                type="checkbox"
                                                className="w-4 h-4 accent-purple-600 rounded cursor-pointer"
                                                checked={!!treeState[childId]}
                                                onChange={() => toggleNode(childId)}
                                              />
                                              <span>{child.name}</span>
                                            </label>
                                          </div>
                                        );
                                      })}
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
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
          {/* <div className="bg-white rounded-3xl shadow-[0_8px_28px_rgba(0,0,0,0.02)] p-7 mb-8 border border-slate-100 transition-shadow hover:shadow-[0_16px_32px_rgba(0,0,0,0.04)]">
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
          </div> */}
          <div className="bg-white rounded-3xl shadow p-7 mb-8 border">
   <div className="text-xl font-semibold text-slate-800 flex items-center gap-2 border-b-2 border-slate-100 pb-3 mb-6">
              <i className="fas fa-city text-blue-500"></i> City Targeting (State-wise)
            </div>
  <div className="flex items-center gap-4 mb-4">

    {/* All Cities */}
    <label className="flex items-center gap-2">
      <input
        type="checkbox"
        checked={cityTarget.allCities}
        onChange={() =>
          setCityTarget({
            allCities: !cityTarget.allCities,
            state: "",
            selectedCities: []
          })
        }
        className="w-4 h-4 accent-blue-600"
      />
      All Cities
    </label>

    {/* State Dropdown */}
    <select
      value={cityTarget.state}
      disabled={cityTarget.allCities}
      onChange={(e) =>
        setCityTarget({
          ...cityTarget,
          state: e.target.value,
          selectedCities: []
        })
      }
      className="px-4 py-2 border rounded-xl"
    >
      <option value="">Select State</option>
      {Object.keys(cityData).map(state => (
        <option key={state} value={state}>
          {state}
        </option>
      ))}
    </select>
  </div>

  {/* Select All Buttons */}
  {!cityTarget.allCities && cityTarget.state && (
    <div className="flex gap-3 mb-2">
      <button
        type="button"
        onClick={() =>
          setCityTarget(prev => ({
            ...prev,
            selectedCities: [...cityData[prev.state]]
          }))
        }
        className="bg-blue-600 text-white px-3 py-1 rounded-lg"
      >
        Select All
      </button>

      <button
        type="button"
        onClick={() =>
          setCityTarget(prev => ({
            ...prev,
            selectedCities: []
          }))
        }
        className="bg-gray-300 px-3 py-1 rounded-lg"
      >
        Clear All
      </button>
    </div>
  )}

  {/* City List */}
  <CitySelector
    cities={cityTarget.state ? cityData[cityTarget.state] : []}
    selectedCities={cityTarget.selectedCities}
    onChange={(newSelection) =>
      setCityTarget(prev => ({
        ...prev,
        selectedCities: newSelection
      }))
    }
    disabled={cityTarget.allCities || !cityTarget.state}
  />
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
                /> <span>Pay After Service</span>
              </label>
                <label className="flex items-center gap-2 cursor-pointer text-slate-800">
                <input
                  type="checkbox"
                  checked={payment.cash}
                  disabled={payment.all}
                  onChange={() => setPayment({ ...payment, cash: !payment.cash })}
                  className="w-[1.1rem] h-[1.1rem] accent-blue-600 rounded cursor-pointer"
                /> <span>Advance Payment</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-slate-800">
                <input
                  type="checkbox"
                  checked={payment.online}
                  disabled={payment.all}
                  onChange={() => setPayment({ ...payment, online: !payment.online })}
                  className="w-[1.1rem] h-[1.1rem] accent-blue-600 rounded cursor-pointer"
                /> <span> Upi</span>
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

        {/* ─── Fixed Bottom Save Bar ───────────────────────────── */}
        <div className="fixed bottom-6 right-6 md:right-8 bg-white px-8 py-4 rounded-full shadow-[0_8px_28px_rgba(0,0,0,0.12)] flex gap-6 border border-slate-200 z-50">
          <button className="bg-white text-slate-700 px-8 py-2.5 rounded-full font-semibold border border-slate-300 hover:bg-slate-50 transition-colors">Cancel</button>
          <button disabled={saving} onClick={handleSaveOffer} className="bg-blue-600 text-white px-6 py-2 rounded-full disabled:opacity-50">{saving ? "Saving..." : "Save Offer"}</button>
        </div>

        {/* ─── Offers List Section ─────────────────────────────── */}
        <OffersList key={offers.length} offers={offers} onRefresh={fetchOffers} />

      </div>
    </>
  );
}

/* ══════════════════════════════════════════════════════════════
   OFFERS LIST COMPONENT
══════════════════════════════════════════════════════════════ */

function OffersList({ offers, onRefresh }: { offers: any[]; onRefresh: () => void }) {
  const [deleting, setDeleting] = React.useState<string | null>(null);
  const [editOffer, setEditOffer] = React.useState<any | null>(null);
  const [updating, setUpdating] = React.useState(false);
  const [editForm, setEditForm] = React.useState<any>({});

  const openEdit = (offer: any) => {
    setEditOffer(offer);
    setEditForm({
      title: offer.title || "",
      description: offer.description || "",
      promocode: offer.promocode || "",
      discountValue: offer.discountValue ?? 0,
      discountType: offer.discountType?.type || "PERCENTAGE",
      min_spend: offer.min_spend ?? 0,
      offerActive: offer.offerActive ?? true,
      visibleToUser: offer.visibleToUser ?? true,
      offerVisible: offer.offerVisible ?? true,
      headTitle: offer.headTitle || "",
      headDescription: offer.headDescription || "",
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this offer?")) return;
    setDeleting(id);
    try {
      const res = await fetch(`https://live.bijliwalaaya.in/api/offers/${id}`, {
        method: "DELETE",
        headers: { "x-api-token": "super_secure_token" },
      });
      if (res.ok) {
        alert("Offer deleted successfully ✅");
        onRefresh();
      } else {
        const data = await res.json().catch(() => ({}));
        alert("Delete failed: " + (data.message || `Status ${res.status}`));
      }
    } catch (err) {
      alert("Network error while deleting.");
      console.error(err);
    } finally {
      setDeleting(null);
    }
  };

  const handleUpdate = async () => {
    if (!editOffer) return;
    setUpdating(true);
    try {
      const payload = {
        ...editForm,
        discountType: { type: editForm.discountType, maxDiscount: Number(editForm.discountValue) },
        discountValue: Number(editForm.discountValue),
        min_spend: Number(editForm.min_spend),
      };
      const res = await fetch(`https://live.bijliwalaaya.in/api/offers/${editOffer._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", "x-api-token": "super_secure_token" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success || res.ok) {
        alert("Offer updated successfully ✅");
        setEditOffer(null);
        onRefresh();
      } else {
        alert("Update failed: " + (data.message || "Unknown error"));
      }
    } catch {
      alert("Server error");
    } finally {
      setUpdating(false);
    }
  };

  const fmt = (iso: string) => {
    if (!iso) return "—";
    return new Date(iso).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
  };

  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 md:px-8 pb-32 mt-4">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200">
            <i className="fas fa-list text-white text-sm"></i>
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800">All Offers</h2>
            <p className="text-sm text-slate-400">{offers.length} offer{offers.length !== 1 ? "s" : ""} found</p>
          </div>
        </div>
        <button onClick={onRefresh} className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2 rounded-full text-sm font-semibold text-slate-600 hover:border-blue-400 hover:text-blue-600 transition-colors shadow-sm">
          <i className="fas fa-sync-alt text-xs"></i> Refresh
        </button>
      </div>

      {offers.length === 0 ? (
        <div className="bg-white rounded-3xl border border-dashed border-slate-200 p-16 text-center">
          <i className="fas fa-tag text-5xl text-slate-200 mb-4 block"></i>
          <p className="text-slate-400 text-lg">No offers yet. Create your first offer above!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {offers.map((offer: any) => (
            <div key={offer._id} className="bg-white rounded-3xl border border-slate-100 shadow-[0_8px_28px_rgba(0,0,0,0.04)] hover:shadow-[0_16px_40px_rgba(0,0,0,0.08)] transition-all duration-300 overflow-hidden group">

              {/* Card Top Banner */}
              <div className="relative h-[160px] bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 overflow-hidden">
                {offer.imageUrl && (
                  <img src={offer.imageUrl} alt="" className="absolute inset-0 w-full h-full object-cover opacity-30" />
                )}
                <div className="absolute inset-0 p-5 flex flex-col justify-between">
                  <div className="flex items-start justify-between">
                    <span className={`text-xs font-bold px-3 py-1 rounded-full shadow ${offer.offerActive ? "bg-emerald-400/90 text-white" : "bg-slate-500/80 text-white"}`}>
                      {offer.offerActive ? "● Active" : "● Inactive"}
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => openEdit(offer)}
                        className="w-8 h-8 bg-white/20 backdrop-blur hover:bg-white/40 rounded-xl flex items-center justify-center text-white transition-colors"
                        title="Edit"
                      >
                        <i className="fas fa-pen text-xs"></i>
                      </button>
                      <button
                        onClick={() => handleDelete(offer._id)}
                        disabled={deleting === offer._id}
                        className="w-8 h-8 bg-white/20 backdrop-blur hover:bg-red-500/80 rounded-xl flex items-center justify-center text-white transition-colors disabled:opacity-50"
                        title="Delete"
                      >
                        {deleting === offer._id
                          ? <i className="fas fa-spinner fa-spin text-xs"></i>
                          : <i className="fas fa-trash text-xs"></i>
                        }
                      </button>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-white text-xl font-bold drop-shadow line-clamp-1">{offer.title}</h3>
                    <p className="text-white/70 text-sm mt-0.5 line-clamp-1">{offer.description}</p>
                  </div>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 flex flex-col gap-4">

                {/* Promo + Discount row */}
                <div className="flex flex-wrap gap-3">
                  {offer.promocode && (
                    <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-xl">
                      <i className="fas fa-ticket-alt text-amber-500 text-xs"></i>
                      <span className="font-bold text-amber-700 text-sm tracking-wider">{offer.promocode}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 px-3 py-1.5 rounded-xl">
                    <i className="fas fa-tags text-blue-500 text-xs"></i>
                    <span className="font-bold text-blue-700 text-sm">
                      {offer.discountValue}{offer.discountType?.type === "PERCENTAGE" ? "% OFF" : " ₹ OFF"}
                    </span>
                  </div>
                  {offer.min_spend > 0 && (
                    <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl">
                      <i className="fas fa-cart-plus text-slate-400 text-xs"></i>
                      <span className="text-slate-600 text-sm">Min ₹{offer.min_spend}</span>
                    </div>
                  )}
                </div>

                {/* Validity */}
                {offer.validity?.length > 0 && (
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <i className="fas fa-calendar-alt text-indigo-400"></i>
                    <span>{fmt(offer.validity[0].startDate)} — {fmt(offer.validity[0].endDate)}</span>
                    {offer.validity[0].startTime && (
                      <span className="text-xs text-slate-400">({offer.validity[0].startTime} – {offer.validity[0].endTime})</span>
                    )}
                  </div>
                )}

                {/* Categories */}
                <div className="flex flex-col gap-2">
                  {offer.select_departments?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 items-center">
                      <span className="text-[10px] font-semibold uppercase text-slate-400 w-full">Departments</span>
                      {offer.select_departments.map((d: string) => (
                        <span key={d} className="bg-violet-50 text-violet-700 border border-violet-200 text-xs px-2.5 py-0.5 rounded-full font-medium">{d}</span>
                      ))}
                    </div>
                  )}
                  {offer.select_main_category?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 items-center">
                      <span className="text-[10px] font-semibold uppercase text-slate-400 w-full">Main Categories</span>
                      {offer.select_main_category.map((c: any) => (
                        <span key={c.documentId} className="bg-blue-50 text-blue-700 border border-blue-200 text-xs px-2.5 py-0.5 rounded-full font-medium">{c.name}</span>
                      ))}
                    </div>
                  )}
                  {offer.select_sub_category?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 items-center">
                      <span className="text-[10px] font-semibold uppercase text-slate-400 w-full">Sub Categories</span>
                      {offer.select_sub_category.map((c: any) => (
                        <span key={c.documentId} className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs px-2.5 py-0.5 rounded-full font-medium">{c.name}</span>
                      ))}
                    </div>
                  )}
                  {offer.select_child_category?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 items-center">
                      <span className="text-[10px] font-semibold uppercase text-slate-400 w-full">Child Categories</span>
                      {offer.select_child_category.map((c: any, i: number) => (
                        <span key={`${c.documentId}-${i}`} className="bg-orange-50 text-orange-700 border border-orange-200 text-xs px-2.5 py-0.5 rounded-full font-medium">{c.name}</span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Location + Payment */}
                <div className="flex flex-wrap gap-3 pt-2 border-t border-slate-100">
                  {offer.states?.length > 0 && (
                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                      <i className="fas fa-map-marker-alt text-rose-400"></i>
                      {offer.states.map((s: any) => s.stateName).join(", ")}
                      {offer.cities?.length > 0 && ` › ${offer.cities.map((c: any) => c.cityName).join(", ")}`}
                    </div>
                  )}
                  {offer.payment_via?.length > 0 && (
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 ml-auto">
                      <i className="fas fa-credit-card text-blue-400"></i>
                      {offer.payment_via.join(" · ")}
                    </div>
                  )}
                </div>

              </div>
            </div>
          ))}
        </div>
      )}


      {/* ─── Edit Offer Modal ────────────────────────────────── */}
      {editOffer && (
        <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl my-8">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-8 py-6 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-md shadow-blue-200">
                  <i className="fas fa-pen text-white text-sm"></i>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-800">Edit Offer</h3>
                  <p className="text-xs text-slate-400 mt-0.5 truncate max-w-[260px]">{editOffer.title}</p>
                </div>
              </div>
              <button onClick={() => setEditOffer(null)} className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors">
                <i className="fas fa-times"></i>
              </button>
            </div>

            {/* Modal Body */}
            <div className="px-8 py-6 flex flex-col gap-5 max-h-[60vh] overflow-y-auto">

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Title <span className="text-red-500">*</span></label>
                  <input value={editForm.title} onChange={e => setEditForm({ ...editForm, title: e.target.value })}
                    className="w-full px-4 py-2.5 border-[1.5px] border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                    placeholder="Offer title" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Promo Code</label>
                  <input value={editForm.promocode} onChange={e => setEditForm({ ...editForm, promocode: e.target.value })}
                    className="w-full px-4 py-2.5 border-[1.5px] border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                    placeholder="PROMO20" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Description</label>
                <textarea value={editForm.description} onChange={e => setEditForm({ ...editForm, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2.5 border-[1.5px] border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 resize-none"
                  placeholder="Offer description" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Discount Type</label>
                  <select value={editForm.discountType} onChange={e => setEditForm({ ...editForm, discountType: e.target.value })}
                    className="w-full px-4 py-2.5 border-[1.5px] border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 bg-white">
                    <option value="PERCENTAGE">Percentage</option>
                    <option value="FLAT">Flat</option>
                    <option value="FLAT">UpTo</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Discount Value</label>
                  <input type="number" value={editForm.discountValue} onChange={e => setEditForm({ ...editForm, discountValue: e.target.value })}
                    className="w-full px-4 py-2.5 border-[1.5px] border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Min Spend (₹)</label>
                  <input type="number" value={editForm.min_spend} onChange={e => setEditForm({ ...editForm, min_spend: e.target.value })}
                    className="w-full px-4 py-2.5 border-[1.5px] border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Head Title</label>
                  <input value={editForm.headTitle} onChange={e => setEditForm({ ...editForm, headTitle: e.target.value })}
                    className="w-full px-4 py-2.5 border-[1.5px] border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                    placeholder="Header title" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Head Description</label>
                  <input value={editForm.headDescription} onChange={e => setEditForm({ ...editForm, headDescription: e.target.value })}
                    className="w-full px-4 py-2.5 border-[1.5px] border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                    placeholder="Header description" />
                </div>
              </div>

              {/* Toggles */}
              <div className="flex flex-wrap gap-4 pt-2 border-t border-slate-100">
                {[
                  { key: "offerActive", label: "Offer Active", icon: "fas fa-power-off", color: "emerald" },
                  { key: "visibleToUser", label: "Visible to User", icon: "fas fa-eye", color: "blue" },
                  { key: "offerVisible", label: "Offer Visible", icon: "fas fa-toggle-on", color: "indigo" },
                ].map(({ key, label, icon, color }) => (
                  <label key={key} className={`flex items-center gap-2.5 cursor-pointer px-4 py-2 rounded-xl border transition-all text-sm font-semibold select-none ${editForm[key] ? `bg-${color}-50 border-${color}-200 text-${color}-700` : "bg-slate-50 border-slate-200 text-slate-500"}`}>
                    <input type="checkbox" className="hidden" checked={!!editForm[key]} onChange={() => setEditForm({ ...editForm, [key]: !editForm[key] })} />
                    <i className={`${icon} text-xs`}></i>
                    {label}
                    <span className={`ml-1 w-8 h-4 rounded-full transition-colors relative ${editForm[key] ? "bg-${color}-500" : "bg-slate-300"}`}>
                      <span className={`absolute top-0.5 w-3 h-3 bg-white rounded-full shadow transition-all ${editForm[key] ? "left-4" : "left-0.5"}`}></span>
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-8 py-5 border-t border-slate-100 flex gap-3 justify-end bg-slate-50/50 rounded-b-3xl">
              <button onClick={() => setEditOffer(null)} className="px-6 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-100 transition-colors text-sm">
                Cancel
              </button>
              <button onClick={handleUpdate} disabled={updating} className="px-8 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg shadow-blue-200 disabled:opacity-60 text-sm flex items-center gap-2">
                {updating ? <><i className="fas fa-spinner fa-spin text-xs"></i> Saving...</> : <><i className="fas fa-check text-xs"></i> Save Changes</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
