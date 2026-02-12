// "use client";

// import React, { useEffect, useMemo, useState, useRef } from "react";
// import { Save, Upload, IndianRupee, Clock, AlertCircle } from "lucide-react";
// import { useCategory } from "../../context/CategoryContext";
// import { generateCategoryId } from "../../utils/generateCategoryId";
// import { BASE_URL, API_TOKEN } from "../../utils/api";

// interface DeepChildCategoryFormProps {
//   initialChildCategoryId?: string | null;
//   editingCategory?: any;
//   onSuccess?: () => void;
// }

// const DeepChildCategoryForm: React.FC<DeepChildCategoryFormProps> = ({
//   initialChildCategoryId,
//   editingCategory,
//   onSuccess,
// }) => {
//   const context = useCategory();
//   const { addDeepChildCategory, updateDeepChildCategory, mainCategories } = context;

//   const generateLocalId = (title: string): string => {
//     const cleanTitle = title.replace(/[^a-zA-Z0-9]/g, '').substring(0, 10);
//     const randomChars = Math.random().toString(36).substring(2, 6);
//     return `${cleanTitle}_${randomChars}`;
//   };

//   // ✅ RESET FUNCTION
//   const resetForm = () => {
//     setFormData(initialFormState);
//     setMainSearch("");
//     setSubSearch("");
//     setChildSearch("");
//     setSelectedMainCategory(null);
//     setSelectedChildCategory(null);
//     setHasChildSelected(false);
//     setSubCategories([]);
//     setChildCategoriesLocal([]);
//   };

//   const initialFormState = {
//     mainCategoryId: "",
//     subCategoryId: "",
//     childCategoryId: "",
//     deepChildCategoryId: "",
//     documentId: "",
//     isDeepVisible: true,

//     firstTitle: "",
//     firstTitleVisible: true,
//     secondTitle: "",
//     secondTitleVisible: true,
//     description: "",
//     descriptionVisible: true,

//     webviewUrl: "",
//     webviewUrlVisible: true,

//     // ✅ IMAGE & VIDEO URLS
//     imageUrl: "",
//     videoUrl: "",

//     originalPrice: "",
//     originalPriceVisible: true,
//     discountType: "percentage",
//     discountValue: "",
//     gst: "0",
//     gstType: "inclusive",

//     minTime: null as number | null,
//     minTimeVisible: true,
//     maxTime: null as number | null,
//     maxTimeVisible: true,

//     // ✅ FILE UPLOADS
//     photo: null as File | null,
//     video: null as File | null,
//     photoVisible: true,
//     videoVisible: true,

//     localId: "",
//   };

//   const [formData, setFormData] = useState(initialFormState);

//   const [isSaving, setIsSaving] = useState(false);
//   const [mainSearch, setMainSearch] = useState("");
//   const [mainOpen, setMainOpen] = useState(false);
//   const [selectedMainCategory, setSelectedMainCategory] = useState<any>(null);
//   const [subCategories, setSubCategories] = useState<any[]>([]);
//   const [subSearch, setSubSearch] = useState("");
//   const [subOpen, setSubOpen] = useState(false);
//   const [childCategoriesLocal, setChildCategoriesLocal] = useState<any[]>([]);
//   const [childSearch, setChildSearch] = useState("");
//   const [childOpen, setChildOpen] = useState(false);
//   const [selectedChildCategory, setSelectedChildCategory] = useState<any>(null);
//   const [hasChildSelected, setHasChildSelected] = useState(false);

//   const mainDropdownRef = useRef<HTMLDivElement>(null);
//   const subDropdownRef = useRef<HTMLDivElement>(null);
//   const childDropdownRef = useRef<HTMLDivElement>(null);
//   const mainInputRef = useRef<HTMLInputElement>(null);
//   const subInputRef = useRef<HTMLInputElement>(null);
//   const childInputRef = useRef<HTMLInputElement>(null);

//   const gstOptions = ["0", "5", "12", "18", "28"];
//   const gstTypeOptions = [
//     { value: "inclusive", label: "Include GST" },
//     { value: "exclusive", label: "Exclude GST" },
//   ];

//   useEffect(() => {
//     if (editingCategory) {
//       setFormData({
//         mainCategoryId: editingCategory.mainCategoryId || "",
//         subCategoryId: editingCategory.subCategoryId || "",
//         childCategoryId: editingCategory.childCategoryId || initialChildCategoryId || "",
//         deepChildCategoryId: editingCategory.id || editingCategory._id || editingCategory.documentId || "",
//         documentId: editingCategory.documentId || editingCategory.id || editingCategory._id || "",
//         isDeepVisible: editingCategory.deepCategoryVisible ?? editingCategory.visible ?? true,

//         firstTitle: editingCategory.firstTitle || "",
//         firstTitleVisible: editingCategory.firstTitleVisible ?? true,
//         secondTitle: editingCategory.secondTitle || "",
//         secondTitleVisible: editingCategory.secondTitleVisible ?? true,
//         description: editingCategory.description || "",
//         descriptionVisible: editingCategory.descriptionVisible ?? true,

//         webviewUrl: editingCategory.webviewUrl || "",
//         webviewUrlVisible: editingCategory.webviewUrlVisible ?? true,

//         // ✅ LOAD EXISTING IMAGE/VIDEO URLS
//         imageUrl: editingCategory.imageUri || editingCategory.image || "",
//         videoUrl: editingCategory.videoUri || editingCategory.video || "",

//         originalPrice: editingCategory.originalPrice?.toString() || "",
//         originalPriceVisible: editingCategory.originalPriceVisible ?? true,
//         discountType: editingCategory.discountType || "percentage",
//         discountValue: editingCategory.discountValue?.toString() || "",
//         gst: editingCategory.gst?.toString() || "0",
//         gstType: editingCategory.gstType || "inclusive",

//         minTime: editingCategory.minTime ?? null,
//         maxTime: editingCategory.maxTime ?? null,
//         minTimeVisible: editingCategory.minTimeVisible ?? true,
//         maxTimeVisible: editingCategory.maxTimeVisible ?? true,

//         photo: null,
//         video: null,
//         photoVisible: editingCategory.photoVisible ?? true,
//         videoVisible: editingCategory.videoVisible ?? true,

//         localId: editingCategory.id || editingCategory._id || editingCategory.documentId || "",
//       });

//       if (editingCategory.mainCategoryId) {
//         const main = mainCategories.find(m => m._id === editingCategory.mainCategoryId);
//         if (main) {
//           setSelectedMainCategory(main);
//           setMainSearch(main.name);
//         }
//       }

//       if (editingCategory.childCategoryId) {
//         setChildSearch(editingCategory.childCategoryName || editingCategory.childCategoryId);
//         setSelectedChildCategory({ name: editingCategory.childCategoryName || editingCategory.childCategoryId });
//         setHasChildSelected(true);
//       }
//     }
//   }, [editingCategory, mainCategories, initialChildCategoryId]);

//   // ✅ REST OF YOUR USEFFECTS (same as before)
//   useEffect(() => {
//     if (!selectedMainCategory) return;

//     if (selectedMainCategory.hasSubCategory !== true) {
//       setSubCategories([]);
//       setSubSearch("");
//       setFormData(prev => ({ ...prev, subCategoryId: "" }));
//       return;
//     }

//     const fetchSubCategoriesAPI = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         const url = `${BASE_URL}/main/${selectedMainCategory._id}/sub`;
//         const res = await fetch(url, {
//           headers: {
//             Authorization: token ? `Bearer ${token}` : "",
//             "x-api-token": API_TOKEN,
//             "Content-Type": "application/json",
//           },
//         });
//         const json = await res.json();
//         const rawData = json?.data || {};
//         const list = Object.entries(rawData).map(([_, value]: any) => ({
//           documentId: value.documentId,
//           name: value.name,
//         }));
//         setSubCategories(list);
//       } catch (err) {
//         console.error("Sub category API failed", err);
//         setSubCategories([]);
//       }
//     };

//     fetchSubCategoriesAPI();
//   }, [selectedMainCategory]);

//   useEffect(() => {
//     if (!formData.mainCategoryId) {
//       setChildCategoriesLocal([]);
//       return;
//     }

//     if (selectedMainCategory?.hasSubCategory !== true) {
//       const fetchChildCategoriesDirect = async () => {
//         try {
//           const token = localStorage.getItem("token");
//           const url = `${BASE_URL}/main/${formData.mainCategoryId}/child`;
//           const res = await fetch(url, {
//             headers: {
//               Authorization: token ? `Bearer ${token}` : "",
//               "x-api-token": API_TOKEN,
//               "Content-Type": "application/json",
//             },
//           });
//           const json = await res.json();
//           const rawData = json?.data || {};
//           const list = Object.entries(rawData).map(([key, value]: any) => ({
//             documentId: value.documentId || key,
//             name: value.name || key,
//           }));
//           setChildCategoriesLocal(list);
//         } catch (err) {
//           console.error("Direct child category API failed", err);
//           setChildCategoriesLocal([]);
//         }
//       };
//       fetchChildCategoriesDirect();
//     } else if (formData.subCategoryId) {
//       const fetchChildCategoriesAPI = async () => {
//         try {
//           const token = localStorage.getItem("token");
//           const url = `${BASE_URL}/main/${formData.mainCategoryId}/sub/${formData.subCategoryId}/child`;
//           const res = await fetch(url, {
//             headers: {
//               Authorization: token ? `Bearer ${token}` : "",
//               "x-api-token": API_TOKEN,
//               "Content-Type": "application/json",
//             },
//           });
//           const json = await res.json();
//           const rawData = json?.data || {};
//           const list = Object.entries(rawData).map(([_, value]: any) => ({
//             documentId: value.documentId,
//             name: value.name,
//           }));
//           setChildCategoriesLocal(list);
//         } catch (err) {
//           console.error("Child category API failed", err);
//           setChildCategoriesLocal([]);
//         }
//       };
//       fetchChildCategoriesAPI();
//     } else {
//       setChildCategoriesLocal([]);
//     }
//   }, [formData.subCategoryId, formData.mainCategoryId, selectedMainCategory]);

//   useEffect(() => {
//     if (formData.firstTitle.trim() && !editingCategory) {
//       const localId = generateLocalId(formData.firstTitle);
//       setFormData(prev => ({ ...prev, localId }));
//     }
//   }, [formData.firstTitle, editingCategory]);

//   // ✅ PRICE CALCULATIONS
//   const finalPrice = useMemo(() => {
//     const original = parseFloat(formData.originalPrice) || 0;
//     const discountVal = parseFloat(formData.discountValue) || 0;

//     if (formData.discountType === "percentage") {
//       const discounted = original - (original * discountVal / 100);
//       return Math.max(0, discounted);
//     } else {
//       const discounted = original - discountVal;
//       return Math.max(0, discounted);
//     }
//   }, [formData.originalPrice, formData.discountValue, formData.discountType]);

//   const gstAmount = useMemo(() => {
//     const gstRate = parseFloat(formData.gst) || 0;
//     if (formData.gstType === "inclusive") {
//       return (finalPrice * gstRate) / (100 + gstRate);
//     } else {
//       return (finalPrice * gstRate) / 100;
//     }
//   }, [finalPrice, formData.gst, formData.gstType]);

//   const totalPrice = useMemo(() => {
//     if (formData.gstType === "inclusive") {
//       return finalPrice;
//     } else {
//       const gstRate = parseFloat(formData.gst) || 0;
//       return finalPrice + (finalPrice * gstRate / 100);
//     }
//   }, [finalPrice, formData.gst, formData.gstType]);

//   // ✅ FILTERED LISTS
//   const filteredMainCategories = useMemo(() => {
//     if (!mainSearch?.trim()) return [];
//     return mainCategories.filter(cat =>
//       cat?.name && cat.name.toLowerCase().includes(mainSearch.toLowerCase())
//     );
//   }, [mainSearch, mainCategories]);

//   const filteredSubCategories = useMemo(() => {
//     if (!subSearch.trim()) return subCategories;
//     const search = subSearch.toLowerCase().replace(/\s+/g, "");
//     return subCategories.filter(sub =>
//       sub.name.toLowerCase().replace(/\s+/g, "").includes(search)
//     );
//   }, [subSearch, subCategories]);

//   const filteredChildCategoriesLocal = useMemo(() => {
//     if (!childSearch) return childCategoriesLocal;
//     return childCategoriesLocal.filter(child =>
//       child?.name && child.name.toLowerCase().includes(childSearch.toLowerCase())
//     );
//   }, [childSearch, childCategoriesLocal]);

//   // ✅ HANDLERS
//   const handleMainSelect = (cat: any) => {
//     setMainSearch(cat.name);
//     setMainOpen(false);
//     setSelectedMainCategory(cat);
//     setFormData(prev => ({
//       ...prev,
//       mainCategoryId: cat._id,
//       subCategoryId: "",
//       childCategoryId: "",
//     }));
//     setSubSearch("");
//     setChildSearch("");
//     setHasChildSelected(false);
//   };

//   const handleSubSelect = (sub: any) => {
//     setSubSearch(sub.name);
//     setSubOpen(false);
//     setFormData(prev => ({
//       ...prev,
//       subCategoryId: sub.documentId,
//       childCategoryId: "",
//       localId: "",
//     }));
//   };

//   const handleChildSelect = (child: any) => {
//     if (!child?.name) return;
    
//     setSelectedChildCategory({
//       name: child.name,
//       documentId: child.documentId || child.name
//     });

//     setFormData(prev => ({
//       ...prev,
//       childCategoryId: child.documentId || child.name,
//     }));

//     setChildSearch(child.name);
//     setChildOpen(false);
//     setHasChildSelected(true);
//   };

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
//     const { name, value } = e.target;

//     if (name === "minTime" || name === "maxTime") {
//       setFormData(prev => ({
//         ...prev,
//         [name]: value === "" ? null : Number(value),
//       }));
//       return;
//     }

//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   const handleToggle = (field: string) => {
//     setFormData(prev => ({
//       ...prev,
//       [field]: !prev[field as keyof typeof prev],
//     }));
//   };

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'photo' | 'video') => {
//     if (e.target.files && e.target.files[0]) {
//       setFormData(prev => ({ ...prev, [type]: e.target.files![0] }));
//     }
//   };

//   // ✅ URL INPUT HANDLERS
//   const handleImageUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setFormData(prev => ({ ...prev, imageUrl: e.target.value }));
//   };

//   const handleVideoUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setFormData(prev => ({ ...prev, videoUrl: e.target.value }));
//   };

//   const calculatePriceAfterGst = () => {
//     const original = Number(formData.originalPrice) || 0;
//     const gst = Number(formData.gst) || 0;

//     if (!original) return 0;

//     if (formData.gstType === "inclusive") {
//       return original;
//     }

//     const price = original + (original * gst) / 100;
//     return Math.round(price * 100) / 100;
//   };

//   const calculateCurrentPrice = (priceAfterGst: number) => {
//     if (!priceAfterGst) return 0;

//     let discount = Number(formData.discountValue) || 0;

//     if (formData.discountType === "percentage") {
//       discount = Math.min(discount, 100);
//       const price = priceAfterGst - (priceAfterGst * discount) / 100;
//       return Math.max(0, Math.round(price * 100) / 100);
//     }

//     const price = priceAfterGst - discount;
//     return Math.max(0, Math.round(price * 100) / 100);
//   };

//   // ✅ FIXED SAVE HANDLER - WITH IMAGE/VIDEO URL SUPPORT
// // ✅ FIXED SAVE HANDLER - FormData ke liye
// const handleSave = async () => {
//   if (!formData.mainCategoryId) {
//     alert("Select main category");
//     return;
//   }

//   if (selectedMainCategory?.hasSubCategory && !formData.subCategoryId) {
//     alert("Select sub category");
//     return;
//   }

//   if (!formData.childCategoryId) {
//     alert("Select child category");
//     return;
//   }

//   if (!formData.firstTitle.trim()) {
//     alert("Enter first title");
//     return;
//   }

//   setIsSaving(true);

//   try {
//     const deepChildId = editingCategory ? formData.documentId : generateCategoryId(formData.firstTitle);
//     const priceAfterGst = calculatePriceAfterGst();
//     const currentPrice = calculateCurrentPrice(priceAfterGst);

//     // ✅ Backend expects 'image' and 'video' fields via FormData
//     const deepChildData: any = {
//       mainCategoryId: formData.mainCategoryId,
//       subCategoryId: formData.subCategoryId || null,
//       childCategoryId: formData.childCategoryId,
//       deepChildId,
//       documentId: formData.documentId,

//       firstTitle: formData.firstTitle,
//       secondTitle: formData.secondTitle,
//       description: formData.description,
//       deepCategoryVisible: formData.isDeepVisible,
//       webviewUrl: formData.webviewUrl,

//       minTime: formData.minTime,
//       maxTime: formData.maxTime,
//       minTimeVisible: formData.minTimeVisible,
//       maxTimeVisible: formData.maxTimeVisible,

//       originalPrice: Number(formData.originalPrice) || 0,
//       discountType: formData.discountType,
//       discountValue: Number(formData.discountValue) || 0,
//       gst: Number(formData.gst) || 0,
//       gstType: formData.gstType,

//       currentPrice,
//       priceAfterGst,
//       currentPriceVisible: true,

//       firstTitleVisible: formData.firstTitleVisible,
//       secondTitleVisible: formData.secondTitleVisible,
//       descriptionVisible: formData.descriptionVisible,
//       webviewUrlVisible: formData.webviewUrlVisible,
//       originalPriceVisible: formData.originalPriceVisible,

//       photoVisible: formData.photoVisible,
//       videoVisible: formData.videoVisible,
//     };

//     // ✅ IMPORTANT: Backend expects 'image' field, not 'imageUri' or 'imageFile'
//     // ✅ File Upload (Priority 1)
//     if (formData.photo instanceof File) {
//       deepChildData.imageFile = formData.photo;  // Context will use this for FormData
//     } 
//     // ✅ URL (Priority 2)
//     else if (formData.imageUrl && formData.imageUrl.trim() !== "") {
//       deepChildData.imageUri = formData.imageUrl.trim();  // Context will use this for FormData
//     }

//     // ✅ Video - Backend expects 'video' field
//     if (formData.video instanceof File) {
//       deepChildData.videoFile = formData.video;
//     }
//     else if (formData.videoUrl && formData.videoUrl.trim() !== "") {
//       deepChildData.videoUri = formData.videoUrl.trim();
//     }

//     console.log("📦 SENDING DEEP CHILD DATA:", {
//       ...deepChildData,
//       imageFile: deepChildData.imageFile ? deepChildData.imageFile.name : null,
//       videoFile: deepChildData.videoFile ? deepChildData.videoFile.name : null,
//       imageUri: deepChildData.imageUri,
//       videoUri: deepChildData.videoUri
//     });

//     if (editingCategory) {
//       await updateDeepChildCategory(deepChildData);
//       alert("✅ Deep Child Category Updated");
//     } else {
//       await addDeepChildCategory(deepChildData);
//       alert("✅ Deep Child Category Added");
//     }

//     // ✅ RESET FORM AFTER SAVE (ADD MODE ONLY)
//     if (!editingCategory) {
//       resetForm();
//     }
    
//     onSuccess?.();
//   } catch (e) {
//     console.error(e);
//     alert("Failed to save Deep Child Category");
//   } finally {
//     setIsSaving(false);
//   }
// };

//   const shouldShowContentFields = hasChildSelected && selectedChildCategory;

//   return (
//     <div className="rounded-lg border border-green-500 bg-gray-100 p-4 shadow-md">
//       <div className="mb-6 flex items-center justify-between rounded-md border-2 border-blue-900 bg-white px-4 py-3">
//         <span className="text-xl font-bold text-gray-900">
//           {editingCategory ? "Edit" : "Manage"} Deep Child Category
//         </span>
//         <div className="flex items-center gap-4">
//           {formData.localId && !editingCategory && (
//             <div className="rounded-md bg-blue-100 px-3 py-1">
//               <span className="text-sm font-semibold text-blue-800">ID: {formData.localId}</span>
//             </div>
//           )}
//           <div className="flex items-center gap-2">
//             <span className="text-sm font-semibold text-gray-700">Visibility</span>
//             <button
//               onClick={() => {
//                 setFormData(prev => ({ ...prev, isDeepVisible: !prev.isDeepVisible }));
//               }}
//               className={`relative inline-block h-6 w-12 cursor-pointer rounded-full transition-colors duration-200 ${
//                 formData.isDeepVisible ? "bg-green-500" : "bg-gray-300"
//               }`}
//             >
//               <div
//                 className={`absolute top-0 h-6 w-6 rounded-full bg-white shadow-md transition-transform duration-200 ${
//                   formData.isDeepVisible ? "translate-x-6" : "translate-x-0"
//                 }`}
//               />
//             </button>
//           </div>
//         </div>
//       </div>

//       <div className="mb-6 space-y-6 rounded-lg border border-gray-300 bg-white p-4">
//         <h3 className="font-bold text-gray-900 border-b pb-2">Category Selection</h3>

//         <div className="relative">
//           <label className="mb-2 block font-bold text-gray-900">Select Main Category *</label>
//           <input
//             ref={mainInputRef}
//             type="text"
//             value={mainSearch}
//             placeholder="Type to search main categories..."
//             onChange={(e) => {
//               setMainSearch(e.target.value);
//               setMainOpen(true);
//             }}
//             onFocus={() => setMainOpen(true)}
//             className="w-full rounded-md border-2 border-blue-900 px-3 py-2"
//           />

//           {mainOpen && (
//             <div ref={mainDropdownRef} className="absolute z-50 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
//               {filteredMainCategories.length > 0 ? (
//                 filteredMainCategories.map(cat => (
//                   <div
//                     key={cat._id}
//                     className="cursor-pointer px-4 py-3 hover:bg-blue-50 border-b border-gray-100"
//                     onMouseDown={(e) => {
//                       e.preventDefault();
//                       handleMainSelect(cat);
//                     }}
//                   >
//                     <div className="flex items-center justify-between">
//                       <span className="font-medium">{cat.name}</span>
//                       <span className={`text-xs px-2 py-1 rounded ${
//                         cat.hasSubCategory ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
//                       }`}>
//                         {cat.hasSubCategory ? "Has Subcategory" : "No Subcategory"}
//                       </span>
//                     </div>
//                   </div>
//                 ))
//               ) : (
//                 <div className="px-4 py-3 text-gray-500">
//                   {mainSearch ? "No matching categories found" : "Type to search..."}
//                 </div>
//               )}
//             </div>
//           )}
//         </div>

//         {selectedMainCategory?.hasSubCategory && (
//           <div className="relative">
//             <label className="mb-2 block font-bold text-gray-900">Select Sub Category *</label>
//             <input
//               ref={subInputRef}
//               type="text"
//               value={subSearch}
//               placeholder="Search sub category..."
//               onClick={() => setSubOpen(true)}
//               onChange={(e) => {
//                 setSubSearch(e.target.value);
//                 setSubOpen(true);
//               }}
//               className="w-full rounded-md border-2 border-blue-900 px-3 py-2"
//             />

//             {subOpen && (
//               <div ref={subDropdownRef} className="absolute z-40 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
//                 {filteredSubCategories.length > 0 ? (
//                   filteredSubCategories.map(sub => (
//                     <div
//                       key={sub.documentId}
//                       className="cursor-pointer px-4 py-3 hover:bg-blue-50 border-b border-gray-100"
//                       onMouseDown={(e) => {
//                         e.preventDefault();
//                         handleSubSelect(sub);
//                       }}
//                     >
//                       <span className="font-medium">{sub.name}</span>
//                     </div>
//                   ))
//                 ) : (
//                   <div className="px-4 py-3 text-gray-500">
//                     {subCategories.length === 0 ? "Loading subcategories..." : "No matches found"}
//                   </div>
//                 )}
//               </div>
//             )}
//           </div>
//         )}

//         <div className="relative">
//           <label className="mb-2 block font-bold text-gray-900">Select Child Category *</label>
//           <input
//             ref={childInputRef}
//             type="text"
//             value={childSearch}
//             placeholder="Search child category..."
//             onChange={(e) => {
//               setChildSearch(e.target.value);
//               setChildOpen(true);
//             }}
//             onFocus={() => setChildOpen(true)}
//             className="w-full rounded-md border-2 border-blue-900 px-3 py-2"
//           />

//           {childOpen && (
//             <div ref={childDropdownRef} className="absolute z-30 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
//               {filteredChildCategoriesLocal.length > 0 ? (
//                 filteredChildCategoriesLocal.map(child => (
//                   <div
//                     key={child.documentId || child.name}
//                     className="cursor-pointer px-4 py-3 hover:bg-blue-50"
//                     onMouseDown={(e) => {
//                       e.preventDefault();
//                       handleChildSelect(child);
//                     }}
//                   >
//                     <span className="font-medium">{child.name}</span>
//                   </div>
//                 ))
//               ) : (
//                 <div className="px-4 py-3 text-gray-500">
//                   {selectedMainCategory?.hasSubCategory && !formData.subCategoryId
//                     ? "Select subcategory first"
//                     : "No child categories found"}
//                 </div>
//               )}
//             </div>
//           )}
//         </div>
//       </div>

//       {shouldShowContentFields && (
//         <>
//           <div className="mb-6 rounded-md border-2 border-green-600 bg-green-50 p-4">
//             <div className="flex items-center justify-between">
//               <div>
//                 <h3 className="text-lg font-bold text-green-800">✓ Child Category Selected!</h3>
//                 <p className="text-xl font-semibold text-gray-900 mt-1">{selectedChildCategory?.name}</p>
//                 {formData.localId && !editingCategory && (
//                   <p className="text-sm text-gray-600 mt-1">
//                     Local ID: <span className="font-bold">{formData.localId}</span>
//                   </p>
//                 )}
//               </div>
//             </div>
//           </div>

//           <div className="mb-6 space-y-6">
//             <div className="space-y-4 rounded-lg border border-gray-300 bg-white p-4">
//               <h3 className="font-bold text-gray-900 border-b pb-2">Content Details</h3>

//               <div className="rounded-md border border-gray-200 bg-gray-50 p-4">
//                 <div className="flex items-center justify-between mb-2">
//                   <label className="block font-semibold text-gray-900">First Headline *</label>
//                   <div className="flex items-center gap-2">
//                     <span className="text-xs font-medium text-gray-700">Visibility</span>
//                     <button
//                       onClick={() => handleToggle('firstTitleVisible')}
//                       className={`w-10 h-5 rounded-full flex items-center justify-start p-1 transition-colors duration-200 ${
//                         formData.firstTitleVisible ? 'bg-blue-600 justify-end' : 'bg-gray-400 justify-start'
//                       }`}
//                     >
//                       <div className={`bg-white w-3 h-3 rounded-full shadow-md transform transition-transform duration-200 ${
//                         formData.firstTitleVisible ? 'translate-x-5' : 'translate-x-0'
//                       }`}></div>
//                     </button>
//                   </div>
//                 </div>
//                 <input
//                   type="text"
//                   name="firstTitle"
//                   value={formData.firstTitle}
//                   onChange={handleChange}
//                   className="w-full rounded-md border-2 border-blue-900 px-3 py-2"
//                   placeholder="Enter First Headline"
//                   required
//                 />
//               </div>

//               <div className="rounded-md border border-gray-200 bg-gray-50 p-4">
//                 <div className="flex items-center justify-between mb-2">
//                   <label className="block font-semibold text-gray-900">Second Headline *</label>
//                   <div className="flex items-center gap-2">
//                     <span className="text-xs font-medium text-gray-700">Visibility</span>
//                     <button
//                       onClick={() => handleToggle('secondTitleVisible')}
//                       className={`w-10 h-5 rounded-full flex items-center justify-start p-1 transition-colors duration-200 ${
//                         formData.secondTitleVisible ? 'bg-blue-600 justify-end' : 'bg-gray-400 justify-start'
//                       }`}
//                     >
//                       <div className={`bg-white w-3 h-3 rounded-full shadow-md transform transition-transform duration-200 ${
//                         formData.secondTitleVisible ? 'translate-x-5' : 'translate-x-0'
//                       }`}></div>
//                     </button>
//                   </div>
//                 </div>
//                 <input
//                   type="text"
//                   name="secondTitle"
//                   value={formData.secondTitle}
//                   onChange={handleChange}
//                   className="w-full rounded-md border-2 border-blue-900 px-3 py-2"
//                   placeholder="Enter Second Headline"
//                   required
//                 />
//               </div>

//               <div className="rounded-md border border-gray-200 bg-gray-50 p-4">
//                 <div className="flex items-center justify-between mb-2">
//                   <label className="block font-semibold text-gray-900">Description *</label>
//                   <div className="flex items-center gap-2">
//                     <span className="text-xs font-medium text-gray-700">Visibility</span>
//                     <button
//                       onClick={() => handleToggle('descriptionVisible')}
//                       className={`w-10 h-5 rounded-full flex items-center justify-start p-1 transition-colors duration-200 ${
//                         formData.descriptionVisible ? 'bg-blue-600 justify-end' : 'bg-gray-400 justify-start'
//                       }`}
//                     >
//                       <div className={`bg-white w-3 h-3 rounded-full shadow-md transform transition-transform duration-200 ${
//                         formData.descriptionVisible ? 'translate-x-5' : 'translate-x-0'
//                       }`}></div>
//                     </button>
//                   </div>
//                 </div>
//                 <textarea
//                   name="description"
//                   value={formData.description}
//                   onChange={handleChange}
//                   className="w-full rounded-md border-2 border-blue-900 px-3 py-2"
//                   placeholder="Enter Description"
//                   rows={4}
//                   required
//                 />
//               </div>

//               <div className="rounded-md border border-gray-200 bg-gray-50 p-4">
//                 <div className="flex items-center justify-between mb-2">
//                   <label className="block font-semibold text-gray-900">Webview URL</label>
//                   <div className="flex items-center gap-2">
//                     <span className="text-xs font-medium text-gray-700">Visibility</span>
//                     <button
//                       onClick={() => handleToggle('webviewUrlVisible')}
//                       className={`w-10 h-5 rounded-full flex items-center justify-start p-1 transition-colors duration-200 ${
//                         formData.webviewUrlVisible ? 'bg-blue-600 justify-end' : 'bg-gray-400 justify-start'
//                       }`}
//                     >
//                       <div className={`bg-white w-3 h-3 rounded-full shadow-md transform transition-transform duration-200 ${
//                         formData.webviewUrlVisible ? 'translate-x-5' : 'translate-x-0'
//                       }`}></div>
//                     </button>
//                   </div>
//                 </div>
//                 <input
//                   type="text"
//                   name="webviewUrl"
//                   value={formData.webviewUrl}
//                   onChange={handleChange}
//                   className="w-full rounded-md border-2 border-blue-900 px-3 py-2"
//                   placeholder="Enter Webview URL (Optional)"
//                 />
//               </div>
//             </div>

//             <div className="space-y-4 rounded-lg border border-gray-300 bg-white p-4">
//               <h3 className="font-bold text-gray-900 border-b pb-2">Pricing Details</h3>

//               <div className="rounded-md border border-gray-200 bg-gray-50 p-4">
//                 <div className="flex items-center justify-between mb-2">
//                   <label className="block font-semibold text-gray-900">Original Price *</label>
//                   <div className="flex items-center gap-2">
//                     <span className="text-xs font-medium text-gray-700">Visibility</span>
//                     <button
//                       onClick={() => handleToggle('originalPriceVisible')}
//                       className={`w-10 h-5 rounded-full flex items-center justify-start p-1 transition-colors duration-200 ${
//                         formData.originalPriceVisible ? 'bg-blue-600 justify-end' : 'bg-gray-400 justify-start'
//                       }`}
//                     >
//                       <div className={`bg-white w-3 h-3 rounded-full shadow-md transform transition-transform duration-200 ${
//                         formData.originalPriceVisible ? 'translate-x-5' : 'translate-x-0'
//                       }`}></div>
//                     </button>
//                   </div>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <IndianRupee size={20} className="text-gray-600" />
//                   <input
//                     type="number"
//                     name="originalPrice"
//                     value={formData.originalPrice}
//                     onChange={handleChange}
//                     className="w-full rounded-md border-2 border-blue-900 px-3 py-2"
//                     placeholder="00.00"
//                     min="0"
//                     step="0.01"
//                   />
//                 </div>
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div className="rounded-md border border-gray-200 bg-gray-50 p-4">
//                   <label className="block font-semibold text-gray-900 mb-2">Discount Type</label>
//                   <select
//                     name="discountType"
//                     value={formData.discountType}
//                     onChange={handleChange}
//                     className="w-full rounded-md border-2 border-blue-900 px-3 py-2"
//                   >
//                     <option value="percentage">Percentage (%)</option>
//                     <option value="fixed">Fixed Amount (₹)</option>
//                   </select>
//                 </div>
//                 <div className="rounded-md border border-gray-200 bg-gray-50 p-4">
//                   <label className="block font-semibold text-gray-900 mb-2">Discount Value</label>
//                   <input
//                     type="number"
//                     name="discountValue"
//                     value={formData.discountValue}
//                     onChange={handleChange}
//                     className="w-full rounded-md border-2 border-blue-900 px-3 py-2"
//                     placeholder={formData.discountType === 'percentage' ? 'Enter %' : 'Enter ₹'}
//                     min="0"
//                     step={formData.discountType === 'percentage' ? "1" : "0.01"}
//                   />
//                 </div>
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div className="rounded-md border border-gray-200 bg-gray-50 p-4">
//                   <label className="block font-semibold text-gray-900 mb-2">Select GST</label>
//                   <select
//                     name="gst"
//                     value={formData.gst}
//                     onChange={handleChange}
//                     className="w-full rounded-md border-2 border-blue-900 px-3 py-2"
//                   >
//                     {gstOptions.map(gst => (
//                       <option key={gst} value={gst}>{gst}%</option>
//                     ))}
//                   </select>
//                 </div>
//                 <div className="rounded-md border border-gray-200 bg-gray-50 p-4">
//                   <label className="block font-semibold text-gray-900 mb-2">GST Type</label>
//                   <select
//                     name="gstType"
//                     value={formData.gstType}
//                     onChange={handleChange}
//                     className="w-full rounded-md border-2 border-blue-900 px-3 py-2"
//                   >
//                     {gstTypeOptions.map(option => (
//                       <option key={option.value} value={option.value}>
//                         {option.label}
//                       </option>
//                     ))}
//                   </select>
//                 </div>
//               </div>

//               <div className="rounded-md border-2 border-green-600 bg-green-50 p-4">
//                 <h4 className="font-bold text-green-800 mb-3">Price Summary</h4>
//                 <div className="space-y-2">
//                   <div className="flex justify-between">
//                     <span className="text-gray-700">Original Price:</span>
//                     <span className="font-semibold">₹{parseFloat(formData.originalPrice || '0').toFixed(2)}</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span className="text-gray-700">Discount:</span>
//                     <span className="font-semibold text-red-600">
//                       {formData.discountType === 'percentage'
//                         ? `${formData.discountValue || '0'}%`
//                         : `₹${parseFloat(formData.discountValue || '0').toFixed(2)}`}
//                     </span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span className="text-gray-700">After Discount:</span>
//                     <span className="font-semibold">₹{finalPrice.toFixed(2)}</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span className="text-gray-700">GST ({formData.gst}%):</span>
//                     <span className="font-semibold">₹{gstAmount.toFixed(2)}</span>
//                   </div>
//                   <div className="flex justify-between border-t pt-2">
//                     <span className="text-lg font-bold text-gray-900">Total Price:</span>
//                     <span className="text-lg font-bold text-green-700">₹{totalPrice.toFixed(2)}</span>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <div className="space-y-4 rounded-lg border border-gray-300 bg-white p-4">
//               <h3 className="font-bold text-gray-900 border-b pb-2">Delivery Time</h3>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div className="rounded-md border border-gray-200 bg-gray-50 p-4">
//                   <div className="flex items-center justify-between mb-2">
//                     <label className="block font-semibold text-gray-900 flex items-center gap-2">
//                       <Clock size={16} />
//                       Min Time (minutes)
//                     </label>
//                     <div className="flex items-center gap-2">
//                       <span className="text-xs font-medium text-gray-700">Visibility</span>
//                       <button
//                         onClick={() => handleToggle('minTimeVisible')}
//                         className={`w-10 h-5 rounded-full flex items-center justify-start p-1 transition-colors duration-200 ${
//                           formData.minTimeVisible ? 'bg-blue-600 justify-end' : 'bg-gray-400 justify-start'
//                         }`}
//                       >
//                         <div className={`bg-white w-3 h-3 rounded-full shadow-md transform transition-transform duration-200 ${
//                           formData.minTimeVisible ? 'translate-x-5' : 'translate-x-0'
//                         }`}></div>
//                       </button>
//                     </div>
//                   </div>
//                   <input
//                     type="number"
//                     name="minTime"
//                     value={formData.minTime ?? ""}
//                     onChange={handleChange}
//                     className="w-full rounded-md border-2 border-blue-900 px-3 py-2"
//                     placeholder="Minimum time"
//                     min="0"
//                   />
//                 </div>

//                 <div className="rounded-md border border-gray-200 bg-gray-50 p-4">
//                   <div className="flex items-center justify-between mb-2">
//                     <label className="block font-semibold text-gray-900 flex items-center gap-2">
//                       <Clock size={16} />
//                       Max Time (minutes)
//                     </label>
//                     <div className="flex items-center gap-2">
//                       <span className="text-xs font-medium text-gray-700">Visibility</span>
//                       <button
//                         onClick={() => handleToggle('maxTimeVisible')}
//                         className={`w-10 h-5 rounded-full flex items-center justify-start p-1 transition-colors duration-200 ${
//                           formData.maxTimeVisible ? 'bg-blue-600 justify-end' : 'bg-gray-400 justify-start'
//                         }`}
//                       >
//                         <div className={`bg-white w-3 h-3 rounded-full shadow-md transform transition-transform duration-200 ${
//                           formData.maxTimeVisible ? 'translate-x-5' : 'translate-x-0'
//                         }`}></div>
//                       </button>
//                     </div>
//                   </div>
//                   <input
//                     type="number"
//                     name="maxTime"
//                     value={formData.maxTime ?? ""}
//                     onChange={handleChange}
//                     className="w-full rounded-md border-2 border-blue-900 px-3 py-2"
//                     placeholder="Maximum time"
//                     min="0"
//                   />
//                 </div>
//               </div>
//             </div>

//             {/* ✅ FIXED MEDIA UPLOADS SECTION - WITH URL INPUTS */}
//             <div className="space-y-4 rounded-lg border-2 border-blue-900 bg-white p-4">
//               <h3 className="font-bold text-gray-900 border-b pb-2">Media Uploads</h3>

//               {/* IMAGE UPLOAD - File + URL */}
//               <div className="rounded-md border border-gray-300 p-4">
//                 <div className="flex items-center justify-between mb-3">
//                   <div>
//                     <label className="block font-medium text-gray-900">Image Upload</label>
//                     <p className="text-xs text-gray-500">Upload file OR enter URL</p>
//                   </div>
//                   <div className="flex items-center gap-2">
//                     <span className="text-xs font-medium text-gray-700">Visibility</span>
//                     <button
//                       onClick={() => handleToggle('photoVisible')}
//                       className={`w-10 h-5 rounded-full flex items-center justify-start p-1 transition-colors duration-200 ${
//                         formData.photoVisible ? 'bg-blue-600 justify-end' : 'bg-gray-400 justify-start'
//                       }`}
//                     >
//                       <div className={`bg-white w-3 h-3 rounded-full shadow-md transform transition-transform duration-200 ${
//                         formData.photoVisible ? 'translate-x-5' : 'translate-x-0'
//                       }`}></div>
//                     </button>
//                   </div>
//                 </div>
                
//                 {/* File Upload */}
//                 <div className="flex items-center gap-4 mb-3">
//                   <label className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded cursor-pointer transition-colors">
//                     <Upload size={16} />
//                     <span>{formData.photo ? formData.photo.name : "Choose Photo"}</span>
//                     <input
//                       type="file"
//                       className="hidden"
//                       accept="image/*"
//                       onChange={(e) => handleFileChange(e, 'photo')}
//                     />
//                   </label>
//                   {formData.photo && (
//                     <span className="text-sm text-green-600 font-medium">
//                       ✓ File selected
//                     </span>
//                   )}
//                 </div>

//                 {/* OR Divider */}
//                 <div className="flex items-center gap-2 my-2">
//                   <div className="flex-1 h-px bg-gray-300"></div>
//                   <span className="text-xs text-gray-500">OR</span>
//                   <div className="flex-1 h-px bg-gray-300"></div>
//                 </div>

//                 {/* URL Input */}
//                 <div className="flex items-center gap-2">
//                   <input
//                     type="text"
//                     value={formData.imageUrl}
//                     onChange={handleImageUrlChange}
//                     placeholder="Enter image URL (https://...)"
//                     className="flex-1 rounded-md border-2 border-gray-300 px-3 py-2 text-sm focus:border-blue-900 focus:outline-none"
//                   />
//                   {formData.imageUrl && (
//                     <div className="h-10 w-10 rounded border overflow-hidden">
//                       <img 
//                         src={formData.imageUrl} 
//                         alt="preview" 
//                         className="h-full w-full object-cover"
//                         onError={(e) => (e.currentTarget.src = "https://via.placeholder.com/40")}
//                       />
//                     </div>
//                   )}
//                 </div>
//                 {formData.imageUrl && (
//                   <p className="text-xs text-green-600 mt-1">✓ URL added: {formData.imageUrl.substring(0, 30)}...</p>
//                 )}
//               </div>

//               {/* VIDEO UPLOAD - File + URL */}
//               <div className="rounded-md border border-gray-300 p-4">
//                 <div className="flex items-center justify-between mb-3">
//                   <label className="block font-medium text-gray-900">Video Upload</label>
//                   <div className="flex items-center gap-2">
//                     <span className="text-xs font-medium text-gray-700">Visibility</span>
//                     <button
//                       onClick={() => handleToggle('videoVisible')}
//                       className={`w-10 h-5 rounded-full flex items-center justify-start p-1 transition-colors duration-200 ${
//                         formData.videoVisible ? 'bg-blue-600 justify-end' : 'bg-gray-400 justify-start'
//                       }`}
//                     >
//                       <div className={`bg-white w-3 h-3 rounded-full shadow-md transform transition-transform duration-200 ${
//                         formData.videoVisible ? 'translate-x-5' : 'translate-x-0'
//                       }`}></div>
//                     </button>
//                   </div>
//                 </div>

//                 {/* File Upload */}
//                 <div className="flex items-center gap-4 mb-3">
//                   <label className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded cursor-pointer transition-colors">
//                     <Upload size={16} />
//                     <span>{formData.video ? formData.video.name : "Choose Video"}</span>
//                     <input
//                       type="file"
//                       className="hidden"
//                       accept="video/*"
//                       onChange={(e) => handleFileChange(e, 'video')}
//                     />
//                   </label>
//                   {formData.video && (
//                     <span className="text-sm text-green-600 font-medium">
//                       ✓ File selected
//                     </span>
//                   )}
//                 </div>

//                 {/* OR Divider */}
//                 <div className="flex items-center gap-2 my-2">
//                   <div className="flex-1 h-px bg-gray-300"></div>
//                   <span className="text-xs text-gray-500">OR</span>
//                   <div className="flex-1 h-px bg-gray-300"></div>
//                 </div>

//                 {/* URL Input */}
//                 <input
//                   type="text"
//                   value={formData.videoUrl}
//                   onChange={handleVideoUrlChange}
//                   placeholder="Enter video URL (YouTube, etc.)"
//                   className="w-full rounded-md border-2 border-gray-300 px-3 py-2 text-sm focus:border-blue-900 focus:outline-none"
//                 />
//                 {formData.videoUrl && (
//                   <p className="text-xs text-green-600 mt-1">✓ URL added: {formData.videoUrl.substring(0, 30)}...</p>
//                 )}
//               </div>
//             </div>
//           </div>

//           <div className="flex justify-end">
//             <button
//               onClick={handleSave}
//               disabled={isSaving}
//               className="flex items-center gap-2 rounded-lg bg-green-600 hover:bg-green-700 px-6 py-3 font-bold text-white transition-all hover:scale-105 active:scale-95 shadow-lg disabled:opacity-70"
//             >
//               <Save size={20} />
//               {isSaving ? "Saving..." : editingCategory ? "Update" : "Save"} Deep Child Category
//             </button>
//           </div>
//         </>
//       )}
//     </div>
//   );
// };

// export default DeepChildCategoryForm;

"use client";

import React, { useEffect, useMemo, useState, useRef } from "react";
import { Save, Upload, IndianRupee, Clock, AlertCircle } from "lucide-react";
import { useCategory } from "../../context/CategoryContext";
import { generateCategoryId } from "../../utils/generateCategoryId";
import { BASE_URL, API_TOKEN } from "../../utils/api";

interface DeepChildCategoryFormProps {
  initialChildCategoryId?: string | null;
  editingCategory?: any;
  onSuccess?: () => void;
}

const DeepChildCategoryForm: React.FC<DeepChildCategoryFormProps> = ({
  initialChildCategoryId,
  editingCategory,
  onSuccess,
}) => {
  const context = useCategory();
  const { addDeepChildCategory, updateDeepChildCategory, mainCategories } = context;

  const generateLocalId = (title: string): string => {
    const cleanTitle = title.replace(/[^a-zA-Z0-9]/g, '').substring(0, 10);
    const randomChars = Math.random().toString(36).substring(2, 6);
    return `${cleanTitle}_${randomChars}`;
  };

  // ✅ RESET FUNCTION
  const resetForm = () => {
    setFormData(initialFormState);
    setMainSearch("");
    setSubSearch("");
    setChildSearch("");
    setSelectedMainCategory(null);
    setSelectedChildCategory(null);
    setHasChildSelected(false);
    setSubCategories([]);
    setChildCategoriesLocal([]);
  };

  const initialFormState = {
    mainCategoryId: "",
    subCategoryId: "",
    childCategoryId: "",
    deepChildCategoryId: "",
    documentId: "",
    isDeepVisible: true,

    firstTitle: "",
    firstTitleVisible: true,
    secondTitle: "",
    secondTitleVisible: true,
    description: "",
    descriptionVisible: true,

    webviewUrl: "",
    webviewUrlVisible: true,

    // ✅ IMAGE & VIDEO URLS
    imageUrl: "",
    videoUrl: "",

    originalPrice: "",
    originalPriceVisible: true,
    discountType: "percentage",
    discountValue: "",
    gst: "0",
    gstType: "inclusive",

    minTime: null as number | null,
    minTimeVisible: true,
    maxTime: null as number | null,
    maxTimeVisible: true,

    // ✅ FILE UPLOADS
    photo: null as File | null,
    video: null as File | null,
    photoVisible: true,
    videoVisible: true,

    localId: "",
  };

  const [formData, setFormData] = useState(initialFormState);

  const [isSaving, setIsSaving] = useState(false);
  const [mainSearch, setMainSearch] = useState("");
  const [mainOpen, setMainOpen] = useState(false);
  const [selectedMainCategory, setSelectedMainCategory] = useState<any>(null);
  const [subCategories, setSubCategories] = useState<any[]>([]);
  const [subSearch, setSubSearch] = useState("");
  const [subOpen, setSubOpen] = useState(false);
  const [childCategoriesLocal, setChildCategoriesLocal] = useState<any[]>([]);
  const [childSearch, setChildSearch] = useState("");
  const [childOpen, setChildOpen] = useState(false);
  const [selectedChildCategory, setSelectedChildCategory] = useState<any>(null);
  const [hasChildSelected, setHasChildSelected] = useState(false);

  const mainDropdownRef = useRef<HTMLDivElement>(null);
  const subDropdownRef = useRef<HTMLDivElement>(null);
  const childDropdownRef = useRef<HTMLDivElement>(null);
  const mainInputRef = useRef<HTMLInputElement>(null);
  const subInputRef = useRef<HTMLInputElement>(null);
  const childInputRef = useRef<HTMLInputElement>(null);

  const gstOptions = ["0", "5", "12", "18", "28"];
  const gstTypeOptions = [
    { value: "inclusive", label: "Include GST" },
    { value: "exclusive", label: "Exclude GST" },
  ];

  useEffect(() => {
    if (editingCategory) {
      setFormData({
        mainCategoryId: editingCategory.mainCategoryId || "",
        subCategoryId: editingCategory.subCategoryId || "",
        childCategoryId: editingCategory.childCategoryId || initialChildCategoryId || "",
        deepChildCategoryId: editingCategory.id || editingCategory._id || editingCategory.documentId || "",
        documentId: editingCategory.documentId || editingCategory.id || editingCategory._id || "",
        isDeepVisible: editingCategory.deepCategoryVisible ?? editingCategory.visible ?? true,

        firstTitle: editingCategory.firstTitle || "",
        firstTitleVisible: editingCategory.firstTitleVisible ?? true,
        secondTitle: editingCategory.secondTitle || "",
        secondTitleVisible: editingCategory.secondTitleVisible ?? true,
        description: editingCategory.description || "",
        descriptionVisible: editingCategory.descriptionVisible ?? true,

        webviewUrl: editingCategory.webviewUrl || "",
        webviewUrlVisible: editingCategory.webviewUrlVisible ?? true,

        // ✅ LOAD EXISTING IMAGE/VIDEO URLS - FIXED FIELD NAMES
        imageUrl: editingCategory.image || editingCategory.imageUri || "",
        videoUrl: editingCategory.video || editingCategory.videoUri || "",

        originalPrice: editingCategory.originalPrice?.toString() || "",
        originalPriceVisible: editingCategory.originalPriceVisible ?? true,
        discountType: editingCategory.discountType || "percentage",
        discountValue: editingCategory.discountValue?.toString() || "",
        gst: editingCategory.gst?.toString() || "0",
        gstType: editingCategory.gstType || "inclusive",

        minTime: editingCategory.minTime ?? null,
        maxTime: editingCategory.maxTime ?? null,
        minTimeVisible: editingCategory.minTimeVisible ?? true,
        maxTimeVisible: editingCategory.maxTimeVisible ?? true,

        photo: null,
        video: null,
        photoVisible: editingCategory.photoVisible ?? true,
        videoVisible: editingCategory.videoVisible ?? true,

        localId: editingCategory.id || editingCategory._id || editingCategory.documentId || "",
      });

      if (editingCategory.mainCategoryId) {
        const main = mainCategories.find(m => m._id === editingCategory.mainCategoryId);
        if (main) {
          setSelectedMainCategory(main);
          setMainSearch(main.name);
        }
      }

      if (editingCategory.childCategoryId) {
        setChildSearch(editingCategory.childCategoryName || editingCategory.childCategoryId);
        setSelectedChildCategory({ name: editingCategory.childCategoryName || editingCategory.childCategoryId });
        setHasChildSelected(true);
      }
    }
  }, [editingCategory, mainCategories, initialChildCategoryId]);

  // ✅ REST OF YOUR USEFFECTS
  useEffect(() => {
    if (!selectedMainCategory) return;

    if (selectedMainCategory.hasSubCategory !== true) {
      setSubCategories([]);
      setSubSearch("");
      setFormData(prev => ({ ...prev, subCategoryId: "" }));
      return;
    }

    const fetchSubCategoriesAPI = async () => {
      try {
        const token = localStorage.getItem("token");
        const url = `${BASE_URL}/main/${selectedMainCategory._id}/sub`;
        const res = await fetch(url, {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
            "x-api-token": API_TOKEN,
            "Content-Type": "application/json",
          },
        });
        const json = await res.json();
        const rawData = json?.data || {};
        const list = Object.entries(rawData).map(([_, value]: any) => ({
          documentId: value.documentId,
          name: value.name,
        }));
        setSubCategories(list);
      } catch (err) {
        console.error("Sub category API failed", err);
        setSubCategories([]);
      }
    };

    fetchSubCategoriesAPI();
  }, [selectedMainCategory]);

  useEffect(() => {
    if (!formData.mainCategoryId) {
      setChildCategoriesLocal([]);
      return;
    }

    if (selectedMainCategory?.hasSubCategory !== true) {
      const fetchChildCategoriesDirect = async () => {
        try {
          const token = localStorage.getItem("token");
          const url = `${BASE_URL}/main/${formData.mainCategoryId}/child`;
          const res = await fetch(url, {
            headers: {
              Authorization: token ? `Bearer ${token}` : "",
              "x-api-token": API_TOKEN,
              "Content-Type": "application/json",
            },
          });
          const json = await res.json();
          const rawData = json?.data || {};
          const list = Object.entries(rawData).map(([key, value]: any) => ({
            documentId: value.documentId || key,
            name: value.name || key,
          }));
          setChildCategoriesLocal(list);
        } catch (err) {
          console.error("Direct child category API failed", err);
          setChildCategoriesLocal([]);
        }
      };
      fetchChildCategoriesDirect();
    } else if (formData.subCategoryId) {
      const fetchChildCategoriesAPI = async () => {
        try {
          const token = localStorage.getItem("token");
          const url = `${BASE_URL}/main/${formData.mainCategoryId}/sub/${formData.subCategoryId}/child`;
          const res = await fetch(url, {
            headers: {
              Authorization: token ? `Bearer ${token}` : "",
              "x-api-token": API_TOKEN,
              "Content-Type": "application/json",
            },
          });
          const json = await res.json();
          const rawData = json?.data || {};
          const list = Object.entries(rawData).map(([_, value]: any) => ({
            documentId: value.documentId,
            name: value.name,
          }));
          setChildCategoriesLocal(list);
        } catch (err) {
          console.error("Child category API failed", err);
          setChildCategoriesLocal([]);
        }
      };
      fetchChildCategoriesAPI();
    } else {
      setChildCategoriesLocal([]);
    }
  }, [formData.subCategoryId, formData.mainCategoryId, selectedMainCategory]);

  useEffect(() => {
    if (formData.firstTitle.trim() && !editingCategory) {
      const localId = generateLocalId(formData.firstTitle);
      setFormData(prev => ({ ...prev, localId }));
    }
  }, [formData.firstTitle, editingCategory]);

  // ✅ PRICE CALCULATIONS
  const finalPrice = useMemo(() => {
    const original = parseFloat(formData.originalPrice) || 0;
    const discountVal = parseFloat(formData.discountValue) || 0;

    if (formData.discountType === "percentage") {
      const discounted = original - (original * discountVal / 100);
      return Math.max(0, discounted);
    } else {
      const discounted = original - discountVal;
      return Math.max(0, discounted);
    }
  }, [formData.originalPrice, formData.discountValue, formData.discountType]);

  const gstAmount = useMemo(() => {
    const gstRate = parseFloat(formData.gst) || 0;
    if (formData.gstType === "inclusive") {
      return (finalPrice * gstRate) / (100 + gstRate);
    } else {
      return (finalPrice * gstRate) / 100;
    }
  }, [finalPrice, formData.gst, formData.gstType]);

  const totalPrice = useMemo(() => {
    if (formData.gstType === "inclusive") {
      return finalPrice;
    } else {
      const gstRate = parseFloat(formData.gst) || 0;
      return finalPrice + (finalPrice * gstRate / 100);
    }
  }, [finalPrice, formData.gst, formData.gstType]);

  // ✅ FILTERED LISTS
  const filteredMainCategories = useMemo(() => {
    if (!mainSearch?.trim()) return [];
    return mainCategories.filter(cat =>
      cat?.name && cat.name.toLowerCase().includes(mainSearch.toLowerCase())
    );
  }, [mainSearch, mainCategories]);

  const filteredSubCategories = useMemo(() => {
    if (!subSearch.trim()) return subCategories;
    const search = subSearch.toLowerCase().replace(/\s+/g, "");
    return subCategories.filter(sub =>
      sub.name.toLowerCase().replace(/\s+/g, "").includes(search)
    );
  }, [subSearch, subCategories]);

  const filteredChildCategoriesLocal = useMemo(() => {
    if (!childSearch) return childCategoriesLocal;
    return childCategoriesLocal.filter(child =>
      child?.name && child.name.toLowerCase().includes(childSearch.toLowerCase())
    );
  }, [childSearch, childCategoriesLocal]);

  // ✅ HANDLERS
  const handleMainSelect = (cat: any) => {
    setMainSearch(cat.name);
    setMainOpen(false);
    setSelectedMainCategory(cat);
    setFormData(prev => ({
      ...prev,
      mainCategoryId: cat._id,
      subCategoryId: "",
      childCategoryId: "",
    }));
    setSubSearch("");
    setChildSearch("");
    setHasChildSelected(false);
  };

  const handleSubSelect = (sub: any) => {
    setSubSearch(sub.name);
    setSubOpen(false);
    setFormData(prev => ({
      ...prev,
      subCategoryId: sub.documentId,
      childCategoryId: "",
      localId: "",
    }));
  };

  const handleChildSelect = (child: any) => {
    if (!child?.name) return;
    
    setSelectedChildCategory({
      name: child.name,
      documentId: child.documentId || child.name
    });

    setFormData(prev => ({
      ...prev,
      childCategoryId: child.documentId || child.name,
    }));

    setChildSearch(child.name);
    setChildOpen(false);
    setHasChildSelected(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    if (name === "minTime" || name === "maxTime") {
      setFormData(prev => ({
        ...prev,
        [name]: value === "" ? null : Number(value),
      }));
      return;
    }

    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleToggle = (field: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: !prev[field as keyof typeof prev],
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'photo' | 'video') => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, [type]: e.target.files![0] }));
    }
  };

  // ✅ URL INPUT HANDLERS
  const handleImageUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, imageUrl: e.target.value }));
  };

  const handleVideoUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, videoUrl: e.target.value }));
  };

  const calculatePriceAfterGst = () => {
    const original = Number(formData.originalPrice) || 0;
    const gst = Number(formData.gst) || 0;

    if (!original) return 0;

    if (formData.gstType === "inclusive") {
      return original;
    }

    const price = original + (original * gst) / 100;
    return Math.round(price * 100) / 100;
  };

  const calculateCurrentPrice = (priceAfterGst: number) => {
    if (!priceAfterGst) return 0;

    let discount = Number(formData.discountValue) || 0;

    if (formData.discountType === "percentage") {
      discount = Math.min(discount, 100);
      const price = priceAfterGst - (priceAfterGst * discount) / 100;
      return Math.max(0, Math.round(price * 100) / 100);
    }

    const price = priceAfterGst - discount;
    return Math.max(0, Math.round(price * 100) / 100);
  };

  // ✅ FIXED SAVE HANDLER - Backend expects 'image' and 'video' fields
  const handleSave = async () => {
    if (!formData.mainCategoryId) {
      alert("Select main category");
      return;
    }

    if (selectedMainCategory?.hasSubCategory && !formData.subCategoryId) {
      alert("Select sub category");
      return;
    }

    if (!formData.childCategoryId) {
      alert("Select child category");
      return;
    }

    if (!formData.firstTitle.trim()) {
      alert("Enter first title");
      return;
    }

    setIsSaving(true);

    try {
      const deepChildId = editingCategory ? formData.documentId : generateCategoryId(formData.firstTitle);
      const priceAfterGst = calculatePriceAfterGst();
      const currentPrice = calculateCurrentPrice(priceAfterGst);

      const deepChildData: any = {
        mainCategoryId: formData.mainCategoryId,
        subCategoryId: formData.subCategoryId || null,
        childCategoryId: formData.childCategoryId,
        deepChildId,
        documentId: formData.documentId,

        firstTitle: formData.firstTitle,
        secondTitle: formData.secondTitle,
        description: formData.description,
        deepCategoryVisible: formData.isDeepVisible,
        webviewUrl: formData.webviewUrl,

        minTime: formData.minTime,
        maxTime: formData.maxTime,
        minTimeVisible: formData.minTimeVisible,
        maxTimeVisible: formData.maxTimeVisible,

        originalPrice: Number(formData.originalPrice) || 0,
        discountType: formData.discountType,
        discountValue: Number(formData.discountValue) || 0,
        gst: Number(formData.gst) || 0,
        gstType: formData.gstType,

        currentPrice,
        priceAfterGst,
        currentPriceVisible: true,

        firstTitleVisible: formData.firstTitleVisible,
        secondTitleVisible: formData.secondTitleVisible,
        descriptionVisible: formData.descriptionVisible,
        webviewUrlVisible: formData.webviewUrlVisible,
        originalPriceVisible: formData.originalPriceVisible,

        photoVisible: formData.photoVisible,
        videoVisible: formData.videoVisible,
      };

      // ✅ FIXED: Backend expects 'image' field, not 'imageUri'
      // ✅ File Upload (Priority 1)
      if (formData.photo instanceof File) {
        deepChildData.imageFile = formData.photo;
      } 
      // ✅ URL (Priority 2)
      else if (formData.imageUrl && formData.imageUrl.trim() !== "") {
        deepChildData.image = formData.imageUrl.trim();  // 🔥 imageUri → image
      }

      // ✅ FIXED: Backend expects 'video' field, not 'videoUri'
      if (formData.video instanceof File) {
        deepChildData.videoFile = formData.video;
      }
      else if (formData.videoUrl && formData.videoUrl.trim() !== "") {
        deepChildData.video = formData.videoUrl.trim();  // 🔥 videoUri → video
      }

      console.log("📦 SENDING DEEP CHILD DATA:", {
        ...deepChildData,
        imageFile: deepChildData.imageFile ? deepChildData.imageFile.name : null,
        videoFile: deepChildData.videoFile ? deepChildData.videoFile.name : null,
        image: deepChildData.image,
        video: deepChildData.video
      });

      if (editingCategory) {
        await updateDeepChildCategory(deepChildData);
        alert("✅ Deep Child Category Updated");
      } else {
        await addDeepChildCategory(deepChildData);
        alert("✅ Deep Child Category Added");
      }

      // ✅ RESET FORM AFTER SAVE (ADD MODE ONLY)
      if (!editingCategory) {
        resetForm();
      }
      
      onSuccess?.();
    } catch (e) {
      console.error(e);
      alert("Failed to save Deep Child Category");
    } finally {
      setIsSaving(false);
    }
  };

  const shouldShowContentFields = hasChildSelected && selectedChildCategory;

  return (
    <div className="rounded-lg border border-green-500 bg-gray-100 p-4 shadow-md">
      <div className="mb-6 flex items-center justify-between rounded-md border-2 border-blue-900 bg-white px-4 py-3">
        <span className="text-xl font-bold text-gray-900">
          {editingCategory ? "Edit" : "Manage"} Deep Child Category
        </span>
        <div className="flex items-center gap-4">
          {formData.localId && !editingCategory && (
            <div className="rounded-md bg-blue-100 px-3 py-1">
              <span className="text-sm font-semibold text-blue-800">ID: {formData.localId}</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-gray-700">Visibility</span>
            <button
              onClick={() => {
                setFormData(prev => ({ ...prev, isDeepVisible: !prev.isDeepVisible }));
              }}
              className={`relative inline-block h-6 w-12 cursor-pointer rounded-full transition-colors duration-200 ${
                formData.isDeepVisible ? "bg-green-500" : "bg-gray-300"
              }`}
            >
              <div
                className={`absolute top-0 h-6 w-6 rounded-full bg-white shadow-md transition-transform duration-200 ${
                  formData.isDeepVisible ? "translate-x-6" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      <div className="mb-6 space-y-6 rounded-lg border border-gray-300 bg-white p-4">
        <h3 className="font-bold text-gray-900 border-b pb-2">Category Selection</h3>

        <div className="relative">
          <label className="mb-2 block font-bold text-gray-900">Select Main Category *</label>
          <input
            ref={mainInputRef}
            type="text"
            value={mainSearch}
            placeholder="Type to search main categories..."
            onChange={(e) => {
              setMainSearch(e.target.value);
              setMainOpen(true);
            }}
            onFocus={() => setMainOpen(true)}
            className="w-full rounded-md border-2 border-blue-900 px-3 py-2"
          />

          {mainOpen && (
            <div ref={mainDropdownRef} className="absolute z-50 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
              {filteredMainCategories.length > 0 ? (
                filteredMainCategories.map(cat => (
                  <div
                    key={cat._id}
                    className="cursor-pointer px-4 py-3 hover:bg-blue-50 border-b border-gray-100"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      handleMainSelect(cat);
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{cat.name}</span>
                      <span className={`text-xs px-2 py-1 rounded ${
                        cat.hasSubCategory ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {cat.hasSubCategory ? "Has Subcategory" : "No Subcategory"}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="px-4 py-3 text-gray-500">
                  {mainSearch ? "No matching categories found" : "Type to search..."}
                </div>
              )}
            </div>
          )}
        </div>

        {selectedMainCategory?.hasSubCategory && (
          <div className="relative">
            <label className="mb-2 block font-bold text-gray-900">Select Sub Category *</label>
            <input
              ref={subInputRef}
              type="text"
              value={subSearch}
              placeholder="Search sub category..."
              onClick={() => setSubOpen(true)}
              onChange={(e) => {
                setSubSearch(e.target.value);
                setSubOpen(true);
              }}
              className="w-full rounded-md border-2 border-blue-900 px-3 py-2"
            />

            {subOpen && (
              <div ref={subDropdownRef} className="absolute z-40 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                {filteredSubCategories.length > 0 ? (
                  filteredSubCategories.map(sub => (
                    <div
                      key={sub.documentId}
                      className="cursor-pointer px-4 py-3 hover:bg-blue-50 border-b border-gray-100"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        handleSubSelect(sub);
                      }}
                    >
                      <span className="font-medium">{sub.name}</span>
                    </div>
                  ))
                ) : (
                  <div className="px-4 py-3 text-gray-500">
                    {subCategories.length === 0 ? "Loading subcategories..." : "No matches found"}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        <div className="relative">
          <label className="mb-2 block font-bold text-gray-900">Select Child Category *</label>
          <input
            ref={childInputRef}
            type="text"
            value={childSearch}
            placeholder="Search child category..."
            onChange={(e) => {
              setChildSearch(e.target.value);
              setChildOpen(true);
            }}
            onFocus={() => setChildOpen(true)}
            className="w-full rounded-md border-2 border-blue-900 px-3 py-2"
          />

          {childOpen && (
            <div ref={childDropdownRef} className="absolute z-30 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
              {filteredChildCategoriesLocal.length > 0 ? (
                filteredChildCategoriesLocal.map(child => (
                  <div
                    key={child.documentId || child.name}
                    className="cursor-pointer px-4 py-3 hover:bg-blue-50"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      handleChildSelect(child);
                    }}
                  >
                    <span className="font-medium">{child.name}</span>
                  </div>
                ))
              ) : (
                <div className="px-4 py-3 text-gray-500">
                  {selectedMainCategory?.hasSubCategory && !formData.subCategoryId
                    ? "Select subcategory first"
                    : "No child categories found"}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {shouldShowContentFields && (
        <>
          <div className="mb-6 rounded-md border-2 border-green-600 bg-green-50 p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-green-800">✓ Child Category Selected!</h3>
                <p className="text-xl font-semibold text-gray-900 mt-1">{selectedChildCategory?.name}</p>
                {formData.localId && !editingCategory && (
                  <p className="text-sm text-gray-600 mt-1">
                    Local ID: <span className="font-bold">{formData.localId}</span>
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="mb-6 space-y-6">
            <div className="space-y-4 rounded-lg border border-gray-300 bg-white p-4">
              <h3 className="font-bold text-gray-900 border-b pb-2">Content Details</h3>

              <div className="rounded-md border border-gray-200 bg-gray-50 p-4">
                <div className="flex items-center justify-between mb-2">
                  <label className="block font-semibold text-gray-900">First Headline *</label>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-gray-700">Visibility</span>
                    <button
                      onClick={() => handleToggle('firstTitleVisible')}
                      className={`w-10 h-5 rounded-full flex items-center justify-start p-1 transition-colors duration-200 ${
                        formData.firstTitleVisible ? 'bg-blue-600 justify-end' : 'bg-gray-400 justify-start'
                      }`}
                    >
                      <div className={`bg-white w-3 h-3 rounded-full shadow-md transform transition-transform duration-200 ${
                        formData.firstTitleVisible ? 'translate-x-5' : 'translate-x-0'
                      }`}></div>
                    </button>
                  </div>
                </div>
                <input
                  type="text"
                  name="firstTitle"
                  value={formData.firstTitle}
                  onChange={handleChange}
                  className="w-full rounded-md border-2 border-blue-900 px-3 py-2"
                  placeholder="Enter First Headline"
                  required
                />
              </div>

              <div className="rounded-md border border-gray-200 bg-gray-50 p-4">
                <div className="flex items-center justify-between mb-2">
                  <label className="block font-semibold text-gray-900">Second Headline *</label>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-gray-700">Visibility</span>
                    <button
                      onClick={() => handleToggle('secondTitleVisible')}
                      className={`w-10 h-5 rounded-full flex items-center justify-start p-1 transition-colors duration-200 ${
                        formData.secondTitleVisible ? 'bg-blue-600 justify-end' : 'bg-gray-400 justify-start'
                      }`}
                    >
                      <div className={`bg-white w-3 h-3 rounded-full shadow-md transform transition-transform duration-200 ${
                        formData.secondTitleVisible ? 'translate-x-5' : 'translate-x-0'
                      }`}></div>
                    </button>
                  </div>
                </div>
                <input
                  type="text"
                  name="secondTitle"
                  value={formData.secondTitle}
                  onChange={handleChange}
                  className="w-full rounded-md border-2 border-blue-900 px-3 py-2"
                  placeholder="Enter Second Headline"
                  required
                />
              </div>

              <div className="rounded-md border border-gray-200 bg-gray-50 p-4">
                <div className="flex items-center justify-between mb-2">
                  <label className="block font-semibold text-gray-900">Description *</label>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-gray-700">Visibility</span>
                    <button
                      onClick={() => handleToggle('descriptionVisible')}
                      className={`w-10 h-5 rounded-full flex items-center justify-start p-1 transition-colors duration-200 ${
                        formData.descriptionVisible ? 'bg-blue-600 justify-end' : 'bg-gray-400 justify-start'
                      }`}
                    >
                      <div className={`bg-white w-3 h-3 rounded-full shadow-md transform transition-transform duration-200 ${
                        formData.descriptionVisible ? 'translate-x-5' : 'translate-x-0'
                      }`}></div>
                    </button>
                  </div>
                </div>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full rounded-md border-2 border-blue-900 px-3 py-2"
                  placeholder="Enter Description"
                  rows={4}
                  required
                />
              </div>

              <div className="rounded-md border border-gray-200 bg-gray-50 p-4">
                <div className="flex items-center justify-between mb-2">
                  <label className="block font-semibold text-gray-900">Webview URL</label>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-gray-700">Visibility</span>
                    <button
                      onClick={() => handleToggle('webviewUrlVisible')}
                      className={`w-10 h-5 rounded-full flex items-center justify-start p-1 transition-colors duration-200 ${
                        formData.webviewUrlVisible ? 'bg-blue-600 justify-end' : 'bg-gray-400 justify-start'
                      }`}
                    >
                      <div className={`bg-white w-3 h-3 rounded-full shadow-md transform transition-transform duration-200 ${
                        formData.webviewUrlVisible ? 'translate-x-5' : 'translate-x-0'
                      }`}></div>
                    </button>
                  </div>
                </div>
                <input
                  type="text"
                  name="webviewUrl"
                  value={formData.webviewUrl}
                  onChange={handleChange}
                  className="w-full rounded-md border-2 border-blue-900 px-3 py-2"
                  placeholder="Enter Webview URL (Optional)"
                />
              </div>
            </div>

            <div className="space-y-4 rounded-lg border border-gray-300 bg-white p-4">
              <h3 className="font-bold text-gray-900 border-b pb-2">Pricing Details</h3>

              <div className="rounded-md border border-gray-200 bg-gray-50 p-4">
                <div className="flex items-center justify-between mb-2">
                  <label className="block font-semibold text-gray-900">Original Price *</label>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-gray-700">Visibility</span>
                    <button
                      onClick={() => handleToggle('originalPriceVisible')}
                      className={`w-10 h-5 rounded-full flex items-center justify-start p-1 transition-colors duration-200 ${
                        formData.originalPriceVisible ? 'bg-blue-600 justify-end' : 'bg-gray-400 justify-start'
                      }`}
                    >
                      <div className={`bg-white w-3 h-3 rounded-full shadow-md transform transition-transform duration-200 ${
                        formData.originalPriceVisible ? 'translate-x-5' : 'translate-x-0'
                      }`}></div>
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <IndianRupee size={20} className="text-gray-600" />
                  <input
                    type="number"
                    name="originalPrice"
                    value={formData.originalPrice}
                    onChange={handleChange}
                    className="w-full rounded-md border-2 border-blue-900 px-3 py-2"
                    placeholder="00.00"
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-md border border-gray-200 bg-gray-50 p-4">
                  <label className="block font-semibold text-gray-900 mb-2">Discount Type</label>
                  <select
                    name="discountType"
                    value={formData.discountType}
                    onChange={handleChange}
                    className="w-full rounded-md border-2 border-blue-900 px-3 py-2"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (₹)</option>
                  </select>
                </div>
                <div className="rounded-md border border-gray-200 bg-gray-50 p-4">
                  <label className="block font-semibold text-gray-900 mb-2">Discount Value</label>
                  <input
                    type="number"
                    name="discountValue"
                    value={formData.discountValue}
                    onChange={handleChange}
                    className="w-full rounded-md border-2 border-blue-900 px-3 py-2"
                    placeholder={formData.discountType === 'percentage' ? 'Enter %' : 'Enter ₹'}
                    min="0"
                    step={formData.discountType === 'percentage' ? "1" : "0.01"}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-md border border-gray-200 bg-gray-50 p-4">
                  <label className="block font-semibold text-gray-900 mb-2">Select GST</label>
                  <select
                    name="gst"
                    value={formData.gst}
                    onChange={handleChange}
                    className="w-full rounded-md border-2 border-blue-900 px-3 py-2"
                  >
                    {gstOptions.map(gst => (
                      <option key={gst} value={gst}>{gst}%</option>
                    ))}
                  </select>
                </div>
                <div className="rounded-md border border-gray-200 bg-gray-50 p-4">
                  <label className="block font-semibold text-gray-900 mb-2">GST Type</label>
                  <select
                    name="gstType"
                    value={formData.gstType}
                    onChange={handleChange}
                    className="w-full rounded-md border-2 border-blue-900 px-3 py-2"
                  >
                    {gstTypeOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="rounded-md border-2 border-green-600 bg-green-50 p-4">
                <h4 className="font-bold text-green-800 mb-3">Price Summary</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-700">Original Price:</span>
                    <span className="font-semibold">₹{parseFloat(formData.originalPrice || '0').toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">Discount:</span>
                    <span className="font-semibold text-red-600">
                      {formData.discountType === 'percentage'
                        ? `${formData.discountValue || '0'}%`
                        : `₹${parseFloat(formData.discountValue || '0').toFixed(2)}`}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">After Discount:</span>
                    <span className="font-semibold">₹{finalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">GST ({formData.gst}%):</span>
                    <span className="font-semibold">₹{gstAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <span className="text-lg font-bold text-gray-900">Total Price:</span>
                    <span className="text-lg font-bold text-green-700">₹{totalPrice.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4 rounded-lg border border-gray-300 bg-white p-4">
              <h3 className="font-bold text-gray-900 border-b pb-2">Delivery Time</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-md border border-gray-200 bg-gray-50 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <label className="block font-semibold text-gray-900 flex items-center gap-2">
                      <Clock size={16} />
                      Min Time (minutes)
                    </label>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-gray-700">Visibility</span>
                      <button
                        onClick={() => handleToggle('minTimeVisible')}
                        className={`w-10 h-5 rounded-full flex items-center justify-start p-1 transition-colors duration-200 ${
                          formData.minTimeVisible ? 'bg-blue-600 justify-end' : 'bg-gray-400 justify-start'
                        }`}
                      >
                        <div className={`bg-white w-3 h-3 rounded-full shadow-md transform transition-transform duration-200 ${
                          formData.minTimeVisible ? 'translate-x-5' : 'translate-x-0'
                        }`}></div>
                      </button>
                    </div>
                  </div>
                  <input
                    type="number"
                    name="minTime"
                    value={formData.minTime ?? ""}
                    onChange={handleChange}
                    className="w-full rounded-md border-2 border-blue-900 px-3 py-2"
                    placeholder="Minimum time"
                    min="0"
                  />
                </div>

                <div className="rounded-md border border-gray-200 bg-gray-50 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <label className="block font-semibold text-gray-900 flex items-center gap-2">
                      <Clock size={16} />
                      Max Time (minutes)
                    </label>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-gray-700">Visibility</span>
                      <button
                        onClick={() => handleToggle('maxTimeVisible')}
                        className={`w-10 h-5 rounded-full flex items-center justify-start p-1 transition-colors duration-200 ${
                          formData.maxTimeVisible ? 'bg-blue-600 justify-end' : 'bg-gray-400 justify-start'
                        }`}
                      >
                        <div className={`bg-white w-3 h-3 rounded-full shadow-md transform transition-transform duration-200 ${
                          formData.maxTimeVisible ? 'translate-x-5' : 'translate-x-0'
                        }`}></div>
                      </button>
                    </div>
                  </div>
                  <input
                    type="number"
                    name="maxTime"
                    value={formData.maxTime ?? ""}
                    onChange={handleChange}
                    className="w-full rounded-md border-2 border-blue-900 px-3 py-2"
                    placeholder="Maximum time"
                    min="0"
                  />
                </div>
              </div>
            </div>

            {/* ✅ MEDIA UPLOADS SECTION - WITH URL INPUTS */}
            <div className="space-y-4 rounded-lg border-2 border-blue-900 bg-white p-4">
              <h3 className="font-bold text-gray-900 border-b pb-2">Media Uploads</h3>

              {/* IMAGE UPLOAD - File + URL */}
              <div className="rounded-md border border-gray-300 p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <label className="block font-medium text-gray-900">Image Upload</label>
                    <p className="text-xs text-gray-500">Upload file OR enter URL</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-gray-700">Visibility</span>
                    <button
                      onClick={() => handleToggle('photoVisible')}
                      className={`w-10 h-5 rounded-full flex items-center justify-start p-1 transition-colors duration-200 ${
                        formData.photoVisible ? 'bg-blue-600 justify-end' : 'bg-gray-400 justify-start'
                      }`}
                    >
                      <div className={`bg-white w-3 h-3 rounded-full shadow-md transform transition-transform duration-200 ${
                        formData.photoVisible ? 'translate-x-5' : 'translate-x-0'
                      }`}></div>
                    </button>
                  </div>
                </div>
                
                {/* File Upload */}
                <div className="flex items-center gap-4 mb-3">
                  <label className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded cursor-pointer transition-colors">
                    <Upload size={16} />
                    <span>{formData.photo ? formData.photo.name : "Choose Photo"}</span>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, 'photo')}
                    />
                  </label>
                  {formData.photo && (
                    <span className="text-sm text-green-600 font-medium">
                      ✓ File selected
                    </span>
                  )}
                </div>

                {/* OR Divider */}
                <div className="flex items-center gap-2 my-2">
                  <div className="flex-1 h-px bg-gray-300"></div>
                  <span className="text-xs text-gray-500">OR</span>
                  <div className="flex-1 h-px bg-gray-300"></div>
                </div>

                {/* URL Input */}
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={formData.imageUrl}
                    onChange={handleImageUrlChange}
                    placeholder="Enter image URL (https://...)"
                    className="flex-1 rounded-md border-2 border-gray-300 px-3 py-2 text-sm focus:border-blue-900 focus:outline-none"
                  />
                  {formData.imageUrl && (
                    <div className="h-10 w-10 rounded border overflow-hidden">
                      <img 
                        src={formData.imageUrl} 
                        alt="preview" 
                        className="h-full w-full object-cover"
                        onError={(e) => (e.currentTarget.src = "https://via.placeholder.com/40")}
                      />
                    </div>
                  )}
                </div>
                {formData.imageUrl && (
                  <p className="text-xs text-green-600 mt-1">✓ URL added: {formData.imageUrl.substring(0, 30)}...</p>
                )}
              </div>

              {/* VIDEO UPLOAD - File + URL */}
              <div className="rounded-md border border-gray-300 p-4">
                <div className="flex items-center justify-between mb-3">
                  <label className="block font-medium text-gray-900">Video Upload</label>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-gray-700">Visibility</span>
                    <button
                      onClick={() => handleToggle('videoVisible')}
                      className={`w-10 h-5 rounded-full flex items-center justify-start p-1 transition-colors duration-200 ${
                        formData.videoVisible ? 'bg-blue-600 justify-end' : 'bg-gray-400 justify-start'
                      }`}
                    >
                      <div className={`bg-white w-3 h-3 rounded-full shadow-md transform transition-transform duration-200 ${
                        formData.videoVisible ? 'translate-x-5' : 'translate-x-0'
                      }`}></div>
                    </button>
                  </div>
                </div>

                {/* File Upload */}
                <div className="flex items-center gap-4 mb-3">
                  <label className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded cursor-pointer transition-colors">
                    <Upload size={16} />
                    <span>{formData.video ? formData.video.name : "Choose Video"}</span>
                    <input
                      type="file"
                      className="hidden"
                      accept="video/*"
                      onChange={(e) => handleFileChange(e, 'video')}
                    />
                  </label>
                  {formData.video && (
                    <span className="text-sm text-green-600 font-medium">
                      ✓ File selected
                    </span>
                  )}
                </div>

                {/* OR Divider */}
                <div className="flex items-center gap-2 my-2">
                  <div className="flex-1 h-px bg-gray-300"></div>
                  <span className="text-xs text-gray-500">OR</span>
                  <div className="flex-1 h-px bg-gray-300"></div>
                </div>

                {/* URL Input */}
                <input
                  type="text"
                  value={formData.videoUrl}
                  onChange={handleVideoUrlChange}
                  placeholder="Enter video URL (YouTube, etc.)"
                  className="w-full rounded-md border-2 border-gray-300 px-3 py-2 text-sm focus:border-blue-900 focus:outline-none"
                />
                {formData.videoUrl && (
                  <p className="text-xs text-green-600 mt-1">✓ URL added: {formData.videoUrl.substring(0, 30)}...</p>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-2 rounded-lg bg-green-600 hover:bg-green-700 px-6 py-3 font-bold text-white transition-all hover:scale-105 active:scale-95 shadow-lg disabled:opacity-70"
            >
              <Save size={20} />
              {isSaving ? "Saving..." : editingCategory ? "Update" : "Save"} Deep Child Category
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default DeepChildCategoryForm;