// "use client";

// import React, { useState, useEffect } from "react";
// import { Save } from "lucide-react";
// import { useCategory } from "../../context/CategoryContext";

// interface SubDeepChildCategoryFormProps {
//     initialDeepChildCategoryId?: string | null;
//     onSuccess?: () => void;
// }

// const SubDeepChildCategoryForm: React.FC<SubDeepChildCategoryFormProps> = ({ initialDeepChildCategoryId, onSuccess }) => {
//     const context = useCategory();

//     if (!context) return <div>Error</div>;

//     const {
//         addSubDeepChildCategory,
//         mainCategories,
//         subCategories,
//         childCategories,
//         deepChildCategories
//     } = context;

//     const [formData, setFormData] = useState({
//         mainCategoryId: "",
//         subCategoryId: "",
//         childCategoryId: "",
//         deepChildCategoryId: initialDeepChildCategoryId || "",
//         firstTitle: "",
//         firstTitleVisible: false,
//         secondTitle: "",
//         secondTitleVisible: false,
//         description: "",
//         descriptionVisible: false,
//         webviewUrl: "",
//         webviewUrlVisible: false,
//         originalPrice: "",
//         originalPriceVisible: false,
//         gst: "0%", // Default
//         gstType: "Include", // Default
//         discount: "", // Percentage or fixed? Assuming value
//         finalPrice: "00.00",
//         minTime: "",
//         minTimeVisible: false,
//         maxTime: "",
//         maxTimeVisible: false,
//         photo: null as File | null,
//         photoVisible: false,
//         video: null as File | null,
//         videoVisible: false
//     });

//     const [filteredSubCategories, setFilteredSubCategories] = useState<any[]>([]);
//     const [filteredChildCategories, setFilteredChildCategories] = useState<any[]>([]);
//     const [filteredDeepChildCategories, setFilteredDeepChildCategories] = useState<any[]>([]);

//     // Auto-populate
//     useEffect(() => {
//         if (initialDeepChildCategoryId) {
//             const deep = deepChildCategories.find(d => d.id === initialDeepChildCategoryId);
//             if (deep) {
//                 const child = childCategories.find(c => c.id === deep.childCategoryId);
//                 if (child) {
//                     const sub = subCategories.find(s => s.id === child.subCategoryId);
//                     if (sub) {
//                         setFormData(prev => ({
//                             ...prev,
//                             mainCategoryId: sub.mainCategoryId,
//                             subCategoryId: sub.id,
//                             childCategoryId: child.id,
//                             deepChildCategoryId: initialDeepChildCategoryId
//                         }));
//                     }
//                 }
//             }
//         }
//     }, [initialDeepChildCategoryId, deepChildCategories, childCategories, subCategories]);

//     // Cascading filters
//     useEffect(() => {
//         if (formData.mainCategoryId) {
//             setFilteredSubCategories(subCategories.filter(s => s.mainCategoryId === formData.mainCategoryId));
//         } else setFilteredSubCategories([]);
//     }, [formData.mainCategoryId, subCategories]);

//     useEffect(() => {
//         if (formData.subCategoryId) {
//             setFilteredChildCategories(childCategories.filter(c => c.subCategoryId === formData.subCategoryId));
//         } else setFilteredChildCategories([]);
//     }, [formData.subCategoryId, childCategories]);

//     useEffect(() => {
//         if (formData.childCategoryId) {
//             setFilteredDeepChildCategories(deepChildCategories.filter(d => d.childCategoryId === formData.childCategoryId));
//         } else setFilteredDeepChildCategories([]);
//     }, [formData.childCategoryId, deepChildCategories]);


//     // Calculation Effect (Simple placeholder logic)
//     useEffect(() => {
//         const price = parseFloat(formData.originalPrice) || 0;
//         const discount = parseFloat(formData.discount) || 0;
//         // Simple calculation logic, can be adjusted
//         let final = price;
//         if (formData.gstType === 'Exclude') {
//             // Add GST
//             const gstRate = parseFloat(formData.gst) || 0;
//             final = final + (final * gstRate / 100);
//         }
//         // Apply discount (assuming flat amount for now, or percentage if user enters %)
//         // If discount is just a number:
//         final = final - discount;

//         setFormData(prev => ({ ...prev, finalPrice: final.toFixed(2) }));

//     }, [formData.originalPrice, formData.gst, formData.gstType, formData.discount]);


//     const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
//         const { name, value } = e.target;
//         setFormData(prev => ({ ...prev, [name]: value }));
//     };

//     const handleToggle = (field: string) => {
//         setFormData(prev => ({
//             ...prev,
//             [field]: !prev[field as keyof typeof prev]
//         }));
//     };

//     const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'photo' | 'video') => {
//         if (e.target.files && e.target.files[0]) {
//             setFormData(prev => ({ ...prev, [type]: e.target.files![0] }));
//         }
//     }

//     const handleSave = () => {
//         if (!formData.deepChildCategoryId || !formData.firstTitle) {
//             alert("Please fill required fields.");
//             return;
//         }

//         const selectedDeep = deepChildCategories.find(d => d.id === formData.deepChildCategoryId);

//         // This likely needs more complex payload construction for the real API
//         addSubDeepChildCategory({
//             deepChildCategoryId: formData.deepChildCategoryId,
//             deepChildCategoryName: selectedDeep ? selectedDeep.firstTitle : "Unknown",
//             title: formData.firstTitle,
//             description: formData.description,
//             visible: true,
//             // Pass other headers via a generic object or updated interface
//             // @ts-ignore
//             detailedData: {
//                 ...formData
//             }
//         });

//         alert("Sub Deep Child Category Added!");
//         if (onSuccess) onSuccess();

//         // Reset form (simplified)
//         setFormData(prev => ({ ...prev, firstTitle: "", originalPrice: "", description: "" }));
//     };

//     return (
//         <div className="rounded-lg border border-red-500 bg-gray-200 p-4 shadow-md">
//             <div className="mb-4 flex items-center justify-between rounded-md border-2 border-blue-900 bg-white px-4 py-2">
//                 <span className="font-bold text-gray-900">Manage Sub Deep child category</span>
//                 <div className="flex items-center gap-2">
//                     <span className="text-sm font-semibold text-gray-700">
//                         Visibility
//                     </span>
//                     <div className="relative inline-block h-6 w-12 cursor-pointer rounded-full bg-gray-300 transition-colors duration-200 ease-in-out">
//                         <div className={`absolute left-0 top-0 h-6 w-6 rounded-full bg-white shadow-md transition-transform duration-200 ease-in-out translate-x-0`}></div>
//                     </div>
//                 </div>
//             </div>

//             {/* Hierarchy */}
//             <div className="mb-4 space-y-4">
//                 <div>
//                     <label className="mb-1 block font-bold text-gray-900">Select Main Category:</label>
//                     <select name="mainCategoryId" value={formData.mainCategoryId} onChange={handleChange} className="w-full rounded-md border-2 border-blue-900 px-3 py-2 text-gray-700">
//                         <option value="">Search Main Category</option>
//                         {mainCategories.map(m => <option key={m._id} value={m._id}>{m.name}</option>)}
//                     </select>
//                 </div>
//                 <div>
//                     <label className="mb-1 block font-bold text-gray-900">Select Sub Category:</label>
//                     <select name="subCategoryId" value={formData.subCategoryId} onChange={handleChange} className="w-full rounded-md border-2 border-blue-900 px-3 py-2 text-gray-700 disabled:opacity-50" disabled={!formData.mainCategoryId}>
//                         <option value="">Select Sub Category</option>
//                         {filteredSubCategories.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
//                     </select>
//                 </div>
//                 <div>
//                     <label className="mb-1 block font-bold text-gray-900">Select Child Category:</label>
//                     <select name="childCategoryId" value={formData.childCategoryId} onChange={handleChange} className="w-full rounded-md border-2 border-blue-900 px-3 py-2 text-gray-700 disabled:opacity-50" disabled={!formData.subCategoryId}>
//                         <option value="">Select Child Category</option>
//                         {filteredChildCategories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
//                     </select>
//                 </div>
//                 <div>
//                     <label className="mb-1 block font-bold text-gray-900">Select Deep Child Category:</label>
//                     <select name="deepChildCategoryId" value={formData.deepChildCategoryId} onChange={handleChange} className="w-full rounded-md border-2 border-blue-900 px-3 py-2 text-gray-700 disabled:opacity-50" disabled={!formData.childCategoryId}>
//                         <option value="">Select Deep Child Category</option>
//                         {filteredDeepChildCategories.map(d => <option key={d.id} value={d.id}>{d.firstTitle}</option>)}
//                     </select>
//                 </div>
//             </div>

//             {/* Inputs */}
//             <div className="space-y-4">
//                 {/* First Headline */}
//                 <div className="flex items-center gap-2">
//                     <input name="firstTitle" value={formData.firstTitle} onChange={handleChange} placeholder="Enter First Headline" className="flex-1 rounded-md border-2 border-blue-900 px-3 py-2 text-gray-700" />
//                     <div className="flex items-center gap-1">
//                         <span className="text-xs font-bold text-gray-900">Visibility</span>
//                         <button onClick={() => handleToggle('firstTitleVisible')} className={`w-10 h-5 rounded-full flex items-center p-1 transition-colors ${formData.firstTitleVisible ? 'bg-blue-600' : 'bg-gray-400'}`}>
//                             <div className={`bg-white w-3 h-3 rounded-full shadow-md transform transition-transform ${formData.firstTitleVisible ? 'translate-x-5' : 'translate-x-0'}`}></div>
//                         </button>
//                     </div>
//                 </div>

//                 {/* Second Headline */}
//                 <div className="flex items-center gap-2">
//                     <input name="secondTitle" value={formData.secondTitle} onChange={handleChange} placeholder="Enter Second Headline" className="flex-1 rounded-md border-2 border-blue-900 px-3 py-2 text-gray-700" />
//                     <div className="flex items-center gap-1">
//                         <span className="text-xs font-bold text-gray-900">Visibility</span>
//                         <button onClick={() => handleToggle('secondTitleVisible')} className={`w-10 h-5 rounded-full flex items-center p-1 transition-colors ${formData.secondTitleVisible ? 'bg-blue-600' : 'bg-gray-400'}`}>
//                             <div className={`bg-white w-3 h-3 rounded-full shadow-md transform transition-transform ${formData.secondTitleVisible ? 'translate-x-5' : 'translate-x-0'}`}></div>
//                         </button>
//                     </div>
//                 </div>

//                 {/* Description */}
//                 <div className="flex items-center gap-2">
//                     <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Enter Description" className="flex-1 rounded-md border-2 border-blue-900 px-3 py-2 text-gray-700" rows={3} />
//                     <div className="flex items-center gap-1">
//                         <span className="text-xs font-bold text-gray-900">Visibility</span>
//                         <button onClick={() => handleToggle('descriptionVisible')} className={`w-10 h-5 rounded-full flex items-center p-1 transition-colors ${formData.descriptionVisible ? 'bg-blue-600' : 'bg-gray-400'}`}>
//                             <div className={`bg-white w-3 h-3 rounded-full shadow-md transform transition-transform ${formData.descriptionVisible ? 'translate-x-5' : 'translate-x-0'}`}></div>
//                         </button>
//                     </div>
//                 </div>

//                 {/* Webview URL */}
//                 <div className="flex items-center gap-2">
//                     <input name="webviewUrl" value={formData.webviewUrl} onChange={handleChange} placeholder="Enter Webview URL" className="flex-1 rounded-md border-2 border-blue-900 px-3 py-2 text-gray-700" />
//                     <div className="flex items-center gap-1">
//                         <span className="text-xs font-bold text-gray-900">Visibility</span>
//                         <button onClick={() => handleToggle('webviewUrlVisible')} className={`w-10 h-5 rounded-full flex items-center p-1 transition-colors ${formData.webviewUrlVisible ? 'bg-blue-600' : 'bg-gray-400'}`}>
//                             <div className={`bg-white w-3 h-3 rounded-full shadow-md transform transition-transform ${formData.webviewUrlVisible ? 'translate-x-5' : 'translate-x-0'}`}></div>
//                         </button>
//                     </div>
//                 </div>

//                 {/* Pricing Section */}
//                 <div className="grid grid-cols-1 gap-4">
//                     {/* Original Price */}
//                     <div className="flex items-center gap-2">
//                         <input name="originalPrice" value={formData.originalPrice} onChange={handleChange} placeholder="Enter Original Price" className="flex-1 rounded-md border-2 border-blue-900 px-3 py-2 text-gray-700" />
//                         <div className="flex items-center gap-1">
//                             <span className="text-xs font-bold text-gray-900">Visibility</span>
//                             <button onClick={() => handleToggle('originalPriceVisible')} className={`w-10 h-5 rounded-full flex items-center p-1 transition-colors ${formData.originalPriceVisible ? 'bg-blue-600' : 'bg-gray-400'}`}>
//                                 <div className={`bg-white w-3 h-3 rounded-full shadow-md transform transition-transform ${formData.originalPriceVisible ? 'translate-x-5' : 'translate-x-0'}`}></div>
//                             </button>
//                         </div>
//                     </div>

//                     <div className="flex flex-wrap items-center gap-2">
//                         <span className="font-bold text-gray-900">Select GST -{'>'}</span>
//                         <select name="gst" value={formData.gst} onChange={handleChange} className="rounded-md border-2 border-blue-900 px-2 py-1">
//                             <option value="0%">0%</option>
//                             <option value="5%">5%</option>
//                             <option value="12%">12%</option>
//                             <option value="18%">18%</option>
//                         </select>
//                         <span className="font-bold text-gray-900">Select GST Type -{'>'}</span>
//                         <select name="gstType" value={formData.gstType} onChange={handleChange} className="rounded-md border-2 border-blue-900 px-2 py-1">
//                             <option value="Include">Include..</option>
//                             <option value="Exclude">Exclude..</option>
//                         </select>
//                     </div>

//                     <div className="flex items-center gap-4">
//                         <div className="rounded-md border-2 border-blue-900 px-3 py-2 bg-white font-bold w-1/3">
//                             Final Price: ₹{formData.finalPrice}
//                         </div>
//                         <div className="rounded-md border-2 border-blue-900 px-3 py-2 bg-white text-gray-500 w-1/3 text-center">
//                             Discount
//                         </div>
//                         <input name="discount" value={formData.discount} onChange={handleChange} placeholder="" className="w-1/3 rounded-md border-2 border-blue-900 px-3 py-2" />
//                     </div>

//                     <div className="w-32 rounded-md border-2 border-blue-900 px-3 py-2 bg-white font-bold">
//                         ₹{formData.finalPrice}
//                     </div>
//                 </div>


//                 {/* Time Section */}
//                 <div className="flex items-center gap-2">
//                     <input name="minTime" value={formData.minTime} onChange={handleChange} placeholder="Min Time" className="flex-1 rounded-md border-2 border-blue-900 px-3 py-2 text-gray-700" />
//                     <div className="flex items-center gap-1">
//                         <span className="text-xs font-bold text-gray-900">Visibility</span>
//                         <button onClick={() => handleToggle('minTimeVisible')} className={`w-10 h-5 rounded-full flex items-center p-1 transition-colors ${formData.minTimeVisible ? 'bg-blue-600' : 'bg-gray-400'}`}>
//                             <div className={`bg-white w-3 h-3 rounded-full shadow-md transform transition-transform ${formData.minTimeVisible ? 'translate-x-5' : 'translate-x-0'}`}></div>
//                         </button>
//                     </div>
//                 </div>
//                 <div className="flex items-center gap-2">
//                     <input name="maxTime" value={formData.maxTime} onChange={handleChange} placeholder="Max Time" className="flex-1 rounded-md border-2 border-blue-900 px-3 py-2 text-gray-700" />
//                     <div className="flex items-center gap-1">
//                         <span className="text-xs font-bold text-gray-900">Visibility</span>
//                         <button onClick={() => handleToggle('maxTimeVisible')} className={`w-10 h-5 rounded-full flex items-center p-1 transition-colors ${formData.maxTimeVisible ? 'bg-blue-600' : 'bg-gray-400'}`}>
//                             <div className={`bg-white w-3 h-3 rounded-full shadow-md transform transition-transform ${formData.maxTimeVisible ? 'translate-x-5' : 'translate-x-0'}`}></div>
//                         </button>
//                     </div>
//                 </div>

//                 {/* Media Section */}
//                 <div className="flex items-center justify-between">
//                     <div className="flex flex-col gap-1">
//                         <label className="flex items-center gap-2 bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded cursor-pointer">
//                             Choose Photo
//                             <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'photo')} />
//                         </label>
//                         <span className="text-xs text-gray-500">Size: 100dp x 120dp</span>
//                     </div>
//                     <div className="flex items-center gap-1">
//                         <span className="text-xs font-bold text-gray-900">Visibility</span>
//                         <button onClick={() => handleToggle('photoVisible')} className={`w-10 h-5 rounded-full flex items-center p-1 transition-colors ${formData.photoVisible ? 'bg-blue-600' : 'bg-gray-400'}`}>
//                             <div className={`bg-white w-3 h-3 rounded-full shadow-md transform transition-transform ${formData.photoVisible ? 'translate-x-5' : 'translate-x-0'}`}></div>
//                         </button>
//                     </div>
//                 </div>

//                 <div className="flex items-center justify-between">
//                     <div className="flex items-center gap-4">
//                         <label className="flex items-center gap-2 bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded cursor-pointer">
//                             Choose Video
//                             <input type="file" className="hidden" accept="video/*" onChange={(e) => handleFileChange(e, 'video')} />
//                         </label>
//                         <span>00</span>
//                     </div>
//                     <div className="flex items-center gap-1">
//                         <span className="text-xs font-bold text-gray-900">Visibility</span>
//                         <button onClick={() => handleToggle('videoVisible')} className={`w-10 h-5 rounded-full flex items-center p-1 transition-colors ${formData.videoVisible ? 'bg-blue-600' : 'bg-gray-400'}`}>
//                             <div className={`bg-white w-3 h-3 rounded-full shadow-md transform transition-transform ${formData.videoVisible ? 'translate-x-5' : 'translate-x-0'}`}></div>
//                         </button>
//                     </div>
//                 </div>
//             </div>

//             <div className="mt-4 flex justify-end">
//                 <button
//                     onClick={handleSave}
//                     className="flex items-center gap-2 rounded-lg bg-blue-900 px-6 py-2 font-bold text-white transition-transform hover:scale-105"
//                 >
//                     <Save size={20} />
//                     Save
//                 </button>
//             </div>
//         </div>
//     );
// };

// export default SubDeepChildCategoryForm;


// "use client";

// import React, { useState, useEffect, useMemo, useRef } from "react";
// import { Save, Upload, IndianRupee, Clock, ChevronDown, ChevronUp } from "lucide-react";
// import { useCategory } from "../../context/CategoryContext";

// interface SubDeepChildCategoryFormProps {
//     initialDeepChildCategoryId?: string | null;
//     onSuccess?: () => void;
// }

// const SubDeepChildCategoryForm: React.FC<SubDeepChildCategoryFormProps> = ({ initialDeepChildCategoryId, onSuccess }) => {
//     const context = useCategory();

//     if (!context) return <div className="p-4 text-red-500">Error: Category Context not found.</div>;

//     const { addSubDeepChildCategory, mainCategories } = context;

//     // ✅ Function to generate unique local ID (e.g., "Priya Singh_1gh4")
//     const generateLocalId = (title: string): string => {
//         const cleanTitle = title.replace(/[^a-zA-Z0-9]/g, '').substring(0, 10);
//         const randomChars = Math.random().toString(36).substring(2, 6);
//         return `${cleanTitle}_${randomChars}`;
//     };

//     // ✅ MAIN VISIBILITY TOGGLE
//     const [isVisible, setIsVisible] = useState(true);

//     // ✅ STATE VARIABLES
//     const [mainSearch, setMainSearch] = useState("");
//     const [mainOpen, setMainOpen] = useState(false);
//     const [selectedMainCategory, setSelectedMainCategory] = useState<any>(null);

//     const [subCategories, setSubCategories] = useState<any[]>([]);
//     const [subSearch, setSubSearch] = useState("");
//     const [subOpen, setSubOpen] = useState(false);

//     const [childCategories, setChildCategories] = useState<any[]>([]);
//     const [childSearch, setChildSearch] = useState("");
//     const [childOpen, setChildOpen] = useState(false);

//     const [deepChildCategories, setDeepChildCategories] = useState<any[]>([]);
//     const [deepChildSearch, setDeepChildSearch] = useState("");
//     const [deepChildOpen, setDeepChildOpen] = useState(false);

//     // ✅ REFS FOR CLICK HANDLING
//     const mainDropdownRef = useRef<HTMLDivElement>(null);
//     const subDropdownRef = useRef<HTMLDivElement>(null);
//     const childDropdownRef = useRef<HTMLDivElement>(null);
//     const deepChildDropdownRef = useRef<HTMLDivElement>(null);
//     const mainInputRef = useRef<HTMLInputElement>(null);
//     const subInputRef = useRef<HTMLInputElement>(null);
//     const childInputRef = useRef<HTMLInputElement>(null);
//     const deepChildInputRef = useRef<HTMLInputElement>(null);

//     // ✅ FORM DATA WITH ALL FIELDS
//     const [formData, setFormData] = useState({
//         mainCategoryId: "",
//         subCategoryId: "",
//         childCategoryId: "",
//         deepChildCategoryId: initialDeepChildCategoryId || "",
//         firstTitle: "",
//         firstTitleVisible: true,
//         secondTitle: "",
//         secondTitleVisible: true,
//         description: "",
//         descriptionVisible: true,
//         webviewUrl: "",
//         webviewUrlVisible: true,
//         originalPrice: "",
//         originalPriceVisible: true,
//         discountType: "percentage",
//         discountValue: "",
//         gst: "0",
//         gstType: "inclusive",
//         minTime: "",
//         maxTime: "",
//         deliveryTimeVisible: true,
//         photo: null as File | null,
//         photoVisible: true,
//         video: null as File | null,
//         videoVisible: true,
//         localId: "",
//         finalPrice: "0.00",
//         totalPrice: "0.00"
//     });

//     // ✅ GST OPTIONS
//     const gstOptions = ["0", "5", "12", "18", "28"];
//     const gstTypeOptions = [
//         { value: "inclusive", label: "Include GST" },
//         { value: "exclusive", label: "Exclude GST" }
//     ];

//     // ✅ PRICE CALCULATIONS
//     const finalPrice = useMemo(() => {
//         const original = parseFloat(formData.originalPrice) || 0;
//         const discountVal = parseFloat(formData.discountValue) || 0;

//         if (formData.discountType === "percentage") {
//             const discounted = original - (original * discountVal / 100);
//             return Math.max(0, discounted);
//         } else {
//             const discounted = original - discountVal;
//             return Math.max(0, discounted);
//         }
//     }, [formData.originalPrice, formData.discountValue, formData.discountType]);

//     const gstAmount = useMemo(() => {
//         const gstRate = parseFloat(formData.gst) || 0;
//         const price = formData.gstType === "inclusive" ? finalPrice : finalPrice * (1 + gstRate/100);
//         return (price * gstRate) / (100 + gstRate);
//     }, [finalPrice, formData.gst, formData.gstType]);

//     const totalPrice = useMemo(() => {
//         if (formData.gstType === "inclusive") {
//             return finalPrice;
//         } else {
//             const gstRate = parseFloat(formData.gst) || 0;
//             return finalPrice + (finalPrice * gstRate / 100);
//         }
//     }, [finalPrice, formData.gst, formData.gstType]);

//     // ✅ CLICK OUTSIDE HANDLER
//     useEffect(() => {
//         const handleClickOutside = (event: MouseEvent) => {
//             if (mainOpen && mainDropdownRef.current && 
//                 !mainDropdownRef.current.contains(event.target as Node) &&
//                 !mainInputRef.current?.contains(event.target as Node)) {
//                 setMainOpen(false);
//             }

//             if (subOpen && subDropdownRef.current && 
//                 !subDropdownRef.current.contains(event.target as Node) &&
//                 !subInputRef.current?.contains(event.target as Node)) {
//                 setSubOpen(false);
//             }

//             if (childOpen && childDropdownRef.current && 
//                 !childDropdownRef.current.contains(event.target as Node) &&
//                 !childInputRef.current?.contains(event.target as Node)) {
//                 setChildOpen(false);
//             }

//             if (deepChildOpen && deepChildDropdownRef.current && 
//                 !deepChildDropdownRef.current.contains(event.target as Node) &&
//                 !deepChildInputRef.current?.contains(event.target as Node)) {
//                 setDeepChildOpen(false);
//             }
//         };

//         document.addEventListener('mousedown', handleClickOutside);
//         return () => document.removeEventListener('mousedown', handleClickOutside);
//     }, [mainOpen, subOpen, childOpen, deepChildOpen]);

//     // ✅ FILTERED LISTS
//     const filteredMainCategories = useMemo(() => {
//         const q = mainSearch.trim().toLowerCase();
//         const list = mainCategories.filter(cat => 
//             typeof cat.name === "string" && cat.name.trim() !== ""
//         );

//         if (!q) return list.sort((a, b) => a.name.localeCompare(b.name));

//         const startsWith = list.filter(cat => 
//             cat.name.toLowerCase().startsWith(q)
//         );
//         const contains = list.filter(cat => 
//             !cat.name.toLowerCase().startsWith(q) && 
//             cat.name.toLowerCase().includes(q)
//         );

//         return [
//             ...startsWith.sort((a, b) => a.name.localeCompare(b.name)),
//             ...contains.sort((a, b) => a.name.localeCompare(b.name)),
//         ];
//     }, [mainSearch, mainCategories]);

//     const filteredSubCategories = useMemo(() => {
//         if (!subSearch) return subCategories;
//         return subCategories.filter(sub =>
//             sub.name.toLowerCase().includes(subSearch.toLowerCase())
//         );
//     }, [subSearch, subCategories]);

//    const filteredChildCategories = useMemo(() => {
//   if (!childSearch) return childCategories;

//   return childCategories.filter(child => {
//     if (!child || typeof child.name !== "string") return false; // ✅ SAFETY
//     return child.name.toLowerCase().includes(childSearch.toLowerCase());
//   });
// }, [childSearch, childCategories]);


//     const filteredDeepChildCategories = useMemo(() => {
//         if (!deepChildSearch) return deepChildCategories;
//         return deepChildCategories.filter(deep =>
//             deep.firstTitle?.toLowerCase().includes(deepChildSearch.toLowerCase())
//         );
//     }, [deepChildSearch, deepChildCategories]);

//     // ✅ MAIN CATEGORY SELECT HANDLER
//     const handleMainSelect = (cat: any) => {
//         console.log("✅ MAIN CATEGORY SELECTED:", cat);
//         setMainSearch(cat.name);
//         setMainOpen(false);
//         setSelectedMainCategory(cat);

//         setFormData(prev => ({
//             ...prev,
//             mainCategoryId: cat._id,
//             subCategoryId: "",
//             childCategoryId: "",
//             deepChildCategoryId: "",
//             localId: ""
//         }));

//         setSubCategories([]);
//         setSubSearch("");
//         setChildCategories([]);
//         setChildSearch("");
//         setDeepChildCategories([]);
//         setDeepChildSearch("");
//     };

//     // ✅ SUB CATEGORY API CALL
//     useEffect(() => {
//         if (!selectedMainCategory) return;

//         if (selectedMainCategory.hasSubCategory !== true) {
//             console.log("ℹ️ Main category has no subcategories");
//             setSubCategories([]);
//             setFormData(prev => ({ ...prev, subCategoryId: "" }));
//             return;
//         }

//         console.log("🚀 Fetching subcategories for main:", selectedMainCategory._id);

//         const fetchSubCategoriesAPI = async () => {
//             try {
//                 const token = localStorage.getItem("token");
//                 const url = `https://api.bijliwalaaya.in/api/product-listing/main/${selectedMainCategory._id}/sub`;
//                 console.log("📡 Subcategory API URL:", url);

//                 const res = await fetch(url, {
//                     headers: {
//                         Authorization: token ? `Bearer ${token}` : "",
//                         "x-api-token": "super_secure_token",
//                         "Content-Type": "application/json",
//                     },
//                 });

//                 const json = await res.json();
//                 console.log("📥 Raw subcategory response:", json);

//                 const rawData = json?.data || {};
//                 const list = Object.entries(rawData).map(([_, value]: any) => ({
//                     documentId: value.documentId,
//                     name: value.name,
//                 }));

//                 console.log("✅ Subcategories loaded:", list.length);
//                 setSubCategories(list);
//             } catch (err) {
//                 console.error("❌ Subcategory API failed:", err);
//                 setSubCategories([]);
//             }
//         };

//         fetchSubCategoriesAPI();
//     }, [selectedMainCategory]);

//     // ✅ CHILD CATEGORY API CALL
//     useEffect(() => {
//         if (!formData.subCategoryId && selectedMainCategory?.hasSubCategory === true) {
//             setChildCategories([]);
//             return;
//         }

//         // If main has NO subcategories, fetch child directly
//         if (selectedMainCategory?.hasSubCategory !== true) {
//             console.log("🚀 Fetching child categories directly for main:", formData.mainCategoryId);

//             const fetchChildCategoriesDirect = async () => {
//                 try {
//                     const token = localStorage.getItem("token");
//                     const url = `https://api.bijliwalaaya.in/api/product-listing/main/${formData.mainCategoryId}/child`;
//                     console.log("📡 Direct child category API URL:", url);

//                     const res = await fetch(url, {
//                         headers: {
//                             Authorization: token ? `Bearer ${token}` : "",
//                             "x-api-token": "super_secure_token",
//                             "Content-Type": "application/json",
//                         },
//                     });

//                     const json = await res.json();
//                     console.log("📥 Raw child category response:", json);

//                     const rawData = json?.data || {};
//                     const list = Object.entries(rawData).map(([key, value]: any) => ({
//                         name: key,
//                     }));

//                     console.log("✅ Child categories loaded:", list.length);
//                     setChildCategories(list);
//                 } catch (err) {
//                     console.error("❌ Child category API failed:", err);
//                     setChildCategories([]);
//                 }
//             };

//             fetchChildCategoriesDirect();
//         } 
//         // If main has subcategories AND subcategory is selected
//         else if (formData.subCategoryId) {
//             console.log("🚀 Fetching child categories for sub:", formData.subCategoryId);

//             const fetchChildCategoriesAPI = async () => {
//                 try {
//                     const token = localStorage.getItem("token");
//                     const url = `https://api.bijliwalaaya.in/api/product-listing/main/${formData.mainCategoryId}/sub/${formData.subCategoryId}/child`;
//                     console.log("📡 Child category API URL:", url);

//                     const res = await fetch(url, {
//                         headers: {
//                             Authorization: token ? `Bearer ${token}` : "",
//                             "x-api-token": "super_secure_token",
//                             "Content-Type": "application/json",
//                         },
//                     });

//                     const json = await res.json();
//                     console.log("📥 Raw child category response:", json);

//                     const rawData = json?.data || {};
//                     const list = Object.entries(rawData).map(([_, value]: any) => ({
//                         documentId: value.documentId,
//                         name: value.name,
//                     }));

//                     console.log("✅ Child categories loaded:", list.length);
//                     setChildCategories(list);
//                 } catch (err) {
//                     console.error("❌ Child category API failed:", err);
//                     setChildCategories([]);
//                 }
//             };

//             fetchChildCategoriesAPI();
//         }
//     }, [formData.subCategoryId, formData.mainCategoryId, selectedMainCategory]);

//     // ✅ DEEP CHILD CATEGORY API CALL
//     useEffect(() => {
//         if (!formData.childCategoryId) {
//             setDeepChildCategories([]);
//             return;
//         }

//         console.log("🚀 Fetching deep child categories for child:", formData.childCategoryId);

//         const fetchDeepChildCategoriesAPI = async () => {
//             try {
//                 const token = localStorage.getItem("token");
//                 let url = "";

//                 if (formData.subCategoryId && selectedMainCategory?.hasSubCategory === true) {
//                     url = `https://api.bijliwalaaya.in/api/product-listing/main/${formData.mainCategoryId}/sub/${formData.subCategoryId}/child/${formData.childCategoryId}/deep`;
//                 } else {
//                     url = `https://api.bijliwalaaya.in/api/product-listing/main/${formData.mainCategoryId}/child/${formData.childCategoryId}/deep`;
//                 }

//                 console.log("📡 Deep child category API URL:", url);

//                 const res = await fetch(url, {
//                     headers: {
//                         Authorization: token ? `Bearer ${token}` : "",
//                         "x-api-token": "super_secure_token",
//                         "Content-Type": "application/json",
//                     },
//                 });

//                 const json = await res.json();
//                 console.log("📥 Raw deep child response:", json);

//                 const rawData = json?.data || {};
//                 const list = Object.entries(rawData).map(([_, value]: any) => ({
//                     documentId: value.documentId,
//                     firstTitle: value.firstTitle,
//                     secondTitle: value.secondTitle,
//                     localId: value.localId
//                 }));

//                 console.log("✅ Deep child categories loaded:", list.length);
//                 setDeepChildCategories(list);
//             } catch (err) {
//                 console.error("❌ Deep child category API failed:", err);
//                 setDeepChildCategories([]);
//             }
//         };

//         fetchDeepChildCategoriesAPI();
//     }, [formData.childCategoryId, formData.mainCategoryId, formData.subCategoryId, selectedMainCategory]);

//     // ✅ GENERATE LOCAL ID WHEN FIRST TITLE CHANGES
//     useEffect(() => {
//         if (formData.firstTitle.trim()) {
//             const localId = generateLocalId(formData.firstTitle);
//             setFormData(prev => ({ ...prev, localId }));
//             console.log("✅ Generated Local ID:", localId);
//         }
//     }, [formData.firstTitle]);

//     // ✅ HANDLERS
//     const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
//         const { name, value } = e.target;
//         setFormData(prev => ({ ...prev, [name]: value }));
//     };

//     const handleToggle = (field: string) => {
//         setFormData(prev => ({
//             ...prev,
//             [field]: !prev[field as keyof typeof prev]
//         }));
//     };

//     const handleMainVisibilityToggle = () => {
//         setIsVisible(prev => !prev);
//         console.log("Sub Deep Child Visibility Toggled:", !isVisible);
//     };

//     const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'photo' | 'video') => {
//         if (e.target.files && e.target.files[0]) {
//             setFormData(prev => ({ ...prev, [type]: e.target.files![0] }));
//         }
//     };

//     const handleSubSelect = (sub: any) => {
//         setSubSearch(sub.name);
//         setSubOpen(false);
//         setFormData(prev => ({
//             ...prev,
//             subCategoryId: sub.documentId,
//             childCategoryId: "",
//             deepChildCategoryId: ""
//         }));
//         setChildSearch("");
//         setChildCategories([]);
//         setDeepChildCategories([]);
//         setDeepChildSearch("");
//     };

//     const handleChildSelect = (child: any) => {
//         setChildSearch(child.name || child.documentId);
//         setChildOpen(false);
//         setFormData(prev => ({
//             ...prev,
//             childCategoryId: child.documentId || child.name,
//             deepChildCategoryId: ""
//         }));
//         setDeepChildSearch("");
//         setDeepChildCategories([]);
//     };

//     const handleDeepChildSelect = (deep: any) => {
//         setDeepChildSearch(deep.firstTitle);
//         setDeepChildOpen(false);
//         setFormData(prev => ({
//             ...prev,
//             deepChildCategoryId: deep.documentId
//         }));
//     };

//     // ✅ SAVE HANDLER
//     const handleSave = () => {
//         if (!formData.mainCategoryId) {
//             alert("Select main category");
//             return;
//         }

//         if (selectedMainCategory?.hasSubCategory === true && !formData.subCategoryId) {
//             alert("Select sub category");
//             return;
//         }

//         if (!formData.childCategoryId) {
//             alert("Select child category");
//             return;
//         }

//         if (!formData.deepChildCategoryId) {
//             alert("Select deep child category");
//             return;
//         }

//         if (!formData.firstTitle.trim() || !formData.secondTitle.trim() || !formData.description.trim()) {
//             alert("Please fill in all required fields (First Headline, Second Headline, Description).");
//             return;
//         }

//         if (!formData.originalPrice) {
//             alert("Please enter Original Price");
//             return;
//         }

//         // Generate final local ID
//         const finalLocalId = formData.localId || generateLocalId(formData.firstTitle);

//         const selectedDeep = deepChildCategories.find(d => d.documentId === formData.deepChildCategoryId);

//         // Prepare data for API
//         const subDeepChildData = {
//             mainCategoryId: formData.mainCategoryId,
//             subCategoryId: formData.subCategoryId || null,
//             childCategoryId: formData.childCategoryId,
//             deepChildCategoryId: formData.deepChildCategoryId,
//             deepChildCategoryName: selectedDeep ? selectedDeep.firstTitle : "Unknown",

//             // Content
//             firstTitle: formData.firstTitle,
//             secondTitle: formData.secondTitle,
//             description: formData.description,
//             visible: isVisible,
//             webviewUrl: formData.webviewUrl,

//             // Pricing
//             originalPrice: formData.originalPrice,
//             discountValue: formData.discountValue,
//             discountType: formData.discountType,
//             gst: formData.gst,
//             gstType: formData.gstType,
//             minTime: formData.minTime,
//             maxTime: formData.maxTime,
//             finalPrice: finalPrice.toFixed(2),
//             totalPrice: totalPrice.toFixed(2),
//             subDeepKey: finalLocalId,

//             // Visibility toggles
//             firstTitleVisible: formData.firstTitleVisible,
//             secondTitleVisible: formData.secondTitleVisible,
//             descriptionVisible: formData.descriptionVisible,
//             webviewUrlVisible: formData.webviewUrlVisible,
//             originalPriceVisible: formData.originalPriceVisible,
//             deliveryTimeVisible: formData.deliveryTimeVisible,

//             // Media
//             photo: formData.photo,
//             video: formData.video,
//             photoVisible: formData.photoVisible,
//             videoVisible: formData.videoVisible
//         };

//         console.log("📦 Sending Sub Deep Child Data:", subDeepChildData);

//         addSubDeepChildCategory(subDeepChildData);

//         alert(`Sub Deep Child Category Added!\nKey: ${finalLocalId}`);

//         if (onSuccess) onSuccess();
//     };

//     // ✅ Condition for showing content fields
//     const shouldShowContentFields = formData.deepChildCategoryId;

//     return (
//         <div className="rounded-lg border border-red-500 bg-gray-100 p-4 shadow-md">
//             {/* HEADER WITH VISIBILITY TOGGLE */}
//             <div className="mb-6 flex items-center justify-between rounded-md border-2 border-blue-900 bg-white px-4 py-3">
//                 <span className="text-xl font-bold text-gray-900">
//                     Manage Sub Deep child category
//                 </span>
//                 <div className="flex items-center gap-4">
//                     {formData.localId && (
//                         <div className="rounded-md bg-blue-100 px-3 py-1">
//                             <span className="text-sm font-semibold text-blue-800">
//                                 ID: {formData.localId}
//                             </span>
//                         </div>
//                     )}
//                     <div className="flex items-center gap-2">
//                         <span className="text-sm font-semibold text-gray-700">
//                             Visibility
//                         </span>
//                         <div
//                             onClick={handleMainVisibilityToggle}
//                             className={`relative inline-block h-6 w-12 cursor-pointer rounded-full transition-colors duration-200
//                                 ${isVisible ? "bg-green-500" : "bg-gray-300"}
//                             `}
//                         >
//                             <div
//                                 className={`absolute top-0 h-6 w-6 rounded-full bg-white shadow-md transition-transform duration-200
//                                     ${isVisible ? "translate-x-6" : "translate-x-0"}
//                                 `}
//                             />
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             {/* HIERARCHICAL SELECTION */}
//             <div className="mb-6 space-y-6 rounded-lg border border-gray-300 bg-white p-4">
//                 <h3 className="font-bold text-gray-900 border-b pb-2">Category Selection</h3>

//                 {/* MAIN CATEGORY */}
//                 <div className="relative">
//                     <label className="mb-2 block font-bold text-gray-900">Select Main Category *</label>
//                     <div className="relative">
//                         <input
//                             ref={mainInputRef}
//                             type="text"
//                             value={mainSearch}
//                             placeholder="Search main category..."
//                             onChange={(e) => {
//                                 setMainSearch(e.target.value);
//                                 setMainOpen(true);
//                             }}
//                             onFocus={() => setMainOpen(true)}
//                             className="w-full rounded-md border-2 border-blue-900 px-3 py-2 pr-10"
//                         />
//                         <button
//                             onClick={() => setMainOpen(!mainOpen)}
//                             className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
//                         >
//                             {mainOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
//                         </button>
//                     </div>

//                     {mainOpen && (
//                         <div ref={mainDropdownRef} className="absolute z-50 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
//                             {filteredMainCategories.length > 0 ? (
//                                 filteredMainCategories.map(cat => (
//                                     <div
//                                         key={cat._id}
//                                         className="cursor-pointer px-4 py-3 hover:bg-blue-50 border-b border-gray-100 last:border-b-0"
//                                         onMouseDown={(e) => {
//                                             e.preventDefault();
//                                             handleMainSelect(cat);
//                                         }}
//                                     >
//                                         <div className="flex items-center justify-between">
//                                             <span className="font-medium">{cat.name}</span>
//                                             <span className={`text-xs px-2 py-1 rounded ${
//                                                 cat.hasSubCategory === true ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
//                                             }`}>
//                                                 {cat.hasSubCategory === true ? "Has Subcategory" : "No Subcategory"}
//                                             </span>
//                                         </div>
//                                         <div className="mt-1 text-xs text-gray-500">
//                                             ID: {cat._id}
//                                         </div>
//                                     </div>
//                                 ))
//                             ) : (
//                                 <div className="px-4 py-3 text-gray-500">
//                                     {mainSearch ? "No matching categories found" : "Type to search..."}
//                                 </div>
//                             )}
//                         </div>
//                     )}
//                 </div>

//                 {/* SUB CATEGORY */}
//                 {selectedMainCategory?.hasSubCategory === true && (
//                     <div className="relative">
//                         <label className="mb-2 block font-bold text-gray-900">Select Sub Category *</label>
//                         <div className="relative">
//                             <input
//                                 ref={subInputRef}
//                                 type="text"
//                                 value={subSearch}
//                                 placeholder="Search sub category..."
//                                 onChange={(e) => {
//                                     setSubSearch(e.target.value);
//                                     setSubOpen(true);
//                                 }}
//                                 onFocus={() => setSubOpen(true)}
//                                 className="w-full rounded-md border-2 border-blue-900 px-3 py-2 pr-10"
//                             />
//                             <button
//                                 onClick={() => setSubOpen(!subOpen)}
//                                 className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
//                             >
//                                 {subOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
//                             </button>
//                         </div>

//                         {subOpen && (
//                             <div ref={subDropdownRef} className="absolute z-40 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
//                                 {subCategories.length > 0 ? (
//                                     filteredSubCategories.map(sub => (
//                                         <div
//                                             key={sub.documentId}
//                                             className="cursor-pointer px-4 py-3 hover:bg-blue-50 border-b border-gray-100 last:border-b-0"
//                                             onMouseDown={(e) => {
//                                                 e.preventDefault();
//                                                 handleSubSelect(sub);
//                                             }}
//                                         >
//                                             <span className="font-medium">{sub.name}</span>
//                                         </div>
//                                     ))
//                                 ) : (
//                                     <div className="px-4 py-3 text-gray-500">
//                                         Loading subcategories...
//                                     </div>
//                                 )}
//                             </div>
//                         )}
//                     </div>
//                 )}

//                 {/* CHILD CATEGORY */}
//                 {(selectedMainCategory?.hasSubCategory !== true || formData.subCategoryId) && (
//                     <div className="relative">
//                         <label className="mb-2 block font-bold text-gray-900">Select Child Category *</label>
//                         <div className="relative">
//                             <input
//                                 ref={childInputRef}
//                                 type="text"
//                                 value={childSearch}
//                                 placeholder="Search child category..."
//                                 onChange={(e) => {
//                                     setChildSearch(e.target.value);
//                                     setChildOpen(true);
//                                 }}
//                                 onFocus={() => setChildOpen(true)}
//                                 className="w-full rounded-md border-2 border-blue-900 px-3 py-2 pr-10"
//                             />
//                             <button
//                                 onClick={() => setChildOpen(!childOpen)}
//                                 className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
//                             >
//                                 {childOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
//                             </button>
//                         </div>

//                         {childOpen && (
//                             <div ref={childDropdownRef} className="absolute z-30 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
//                                 {childCategories.length > 0 ? (
//                                   filteredChildCategories.map(child => {
//   if (!child || !child.name) return null; // ✅ GUARD

//   return (
//     <div
//       key={child.documentId || child.name}
//       className="cursor-pointer px-4 py-3 hover:bg-blue-50"
//       onMouseDown={(e) => {
//         e.preventDefault();
//         handleChildSelect(child);
//       }}
//     >
//       <span className="font-medium">{child.name}</span>
//       {child.documentId && (
//         <div className="text-xs text-gray-500">ID: {child.documentId}</div>
//       )}
//     </div>
//   );
// })

//                                 ) : (
//                                     <div className="px-4 py-3 text-gray-500">
//                                         Loading child categories...
//                                     </div>
//                                 )}
//                             </div>
//                         )}
//                     </div>
//                 )}

//                 {/* DEEP CHILD CATEGORY */}
//                 {formData.childCategoryId && (
//                     <div className="relative">
//                         <label className="mb-2 block font-bold text-gray-900">Select Deep Child Category *</label>
//                         <div className="relative">
//                             <input
//                                 ref={deepChildInputRef}
//                                 type="text"
//                                 value={deepChildSearch}
//                                 placeholder="Search deep child category..."
//                                 onChange={(e) => {
//                                     setDeepChildSearch(e.target.value);
//                                     setDeepChildOpen(true);
//                                 }}
//                                 onFocus={() => setDeepChildOpen(true)}
//                                 className="w-full rounded-md border-2 border-blue-900 px-3 py-2 pr-10"
//                             />
//                             <button
//                                 onClick={() => setDeepChildOpen(!deepChildOpen)}
//                                 className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
//                             >
//                                 {deepChildOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
//                             </button>
//                         </div>

//                         {deepChildOpen && (
//                             <div ref={deepChildDropdownRef} className="absolute z-20 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
//                                 {deepChildCategories.length > 0 ? (
//                                     filteredDeepChildCategories.map(deep => (
//                                         <div
//                                             key={deep.documentId}
//                                             className="cursor-pointer px-4 py-3 hover:bg-blue-50 border-b border-gray-100 last:border-b-0"
//                                             onMouseDown={(e) => {
//                                                 e.preventDefault();
//                                                 handleDeepChildSelect(deep);
//                                             }}
//                                         >
//                                             <div className="font-medium">{deep.firstTitle}</div>
//                                             {deep.secondTitle && (
//                                                 <div className="text-sm text-gray-600 mt-1">{deep.secondTitle}</div>
//                                             )}
//                                             {deep.localId && (
//                                                 <div className="text-xs text-gray-500 mt-1">ID: {deep.localId}</div>
//                                             )}
//                                         </div>
//                                     ))
//                                 ) : (
//                                     <div className="px-4 py-3 text-gray-500">
//                                         Loading deep child categories...
//                                     </div>
//                                 )}
//                             </div>
//                         )}
//                     </div>
//                 )}
//             </div>

//             {/* CONTENT FIELDS - WILL SHOW WHEN DEEP CHILD IS SELECTED */}
//             {shouldShowContentFields && (
//                 <>
//                     {/* SELECTED DEEP CHILD CATEGORY INFO */}
//                     <div className="mb-6 rounded-md border-2 border-green-600 bg-green-50 p-4">
//                         <div className="flex items-center justify-between">
//                             <div>
//                                 <h3 className="text-lg font-bold text-green-800">✓ Deep Child Category Selected!</h3>
//                                 <p className="text-xl font-semibold text-gray-900 mt-1">
//                                     {deepChildCategories.find(d => d.documentId === formData.deepChildCategoryId)?.firstTitle || "Unknown"}
//                                 </p>
//                                 <p className="text-sm text-gray-600 mt-1">
//                                     Local ID: <span className="font-bold">{formData.localId}</span>
//                                 </p>
//                             </div>
//                             <div className="rounded-full bg-green-100 px-4 py-2">
//                                 <span className="text-sm font-medium text-green-800">Ready to Add Sub Content</span>
//                             </div>
//                         </div>
//                     </div>

//                     {/* CONTENT FORM */}
//                     <div className="mb-6 space-y-6">
//                         {/* CONTENT SECTION */}
//                         <div className="space-y-4 rounded-lg border border-gray-300 bg-white p-4">
//                             <h3 className="font-bold text-gray-900 border-b pb-2">Content Details</h3>

//                             {/* First Headline */}
//                             <div className="rounded-md border border-gray-200 bg-gray-50 p-4">
//                                 <div className="flex items-center justify-between mb-2">
//                                     <label className="block font-semibold text-gray-900">First Headline *</label>
//                                     <div className="flex items-center gap-2">
//                                         <span className="text-xs font-medium text-gray-700">Visibility</span>
//                                         <button 
//                                             onClick={() => handleToggle('firstTitleVisible')} 
//                                             className={`w-10 h-5 rounded-full flex items-center justify-start p-1 transition-colors duration-200 ${
//                                                 formData.firstTitleVisible ? 'bg-blue-600 justify-end' : 'bg-gray-400 justify-start'
//                                             }`}
//                                         >
//                                             <div className={`bg-white w-3 h-3 rounded-full shadow-md transform transition-transform duration-200 ${
//                                                 formData.firstTitleVisible ? 'translate-x-5' : 'translate-x-0'
//                                             }`}></div>
//                                         </button>
//                                     </div>
//                                 </div>
//                                 <input
//                                     type="text"
//                                     name="firstTitle"
//                                     value={formData.firstTitle}
//                                     onChange={handleChange}
//                                     className="w-full rounded-md border-2 border-blue-900 px-3 py-2"
//                                     placeholder="Enter First Headline"
//                                     required
//                                 />
//                             </div>

//                             {/* Second Headline */}
//                             <div className="rounded-md border border-gray-200 bg-gray-50 p-4">
//                                 <div className="flex items-center justify-between mb-2">
//                                     <label className="block font-semibold text-gray-900">Second Headline *</label>
//                                     <div className="flex items-center gap-2">
//                                         <span className="text-xs font-medium text-gray-700">Visibility</span>
//                                         <button 
//                                             onClick={() => handleToggle('secondTitleVisible')} 
//                                             className={`w-10 h-5 rounded-full flex items-center justify-start p-1 transition-colors duration-200 ${
//                                                 formData.secondTitleVisible ? 'bg-blue-600 justify-end' : 'bg-gray-400 justify-start'
//                                             }`}
//                                         >
//                                             <div className={`bg-white w-3 h-3 rounded-full shadow-md transform transition-transform duration-200 ${
//                                                 formData.secondTitleVisible ? 'translate-x-5' : 'translate-x-0'
//                                             }`}></div>
//                                         </button>
//                                     </div>
//                                 </div>
//                                 <input
//                                     type="text"
//                                     name="secondTitle"
//                                     value={formData.secondTitle}
//                                     onChange={handleChange}
//                                     className="w-full rounded-md border-2 border-blue-900 px-3 py-2"
//                                     placeholder="Enter Second Headline"
//                                     required
//                                 />
//                             </div>

//                             {/* Description */}
//                             <div className="rounded-md border border-gray-200 bg-gray-50 p-4">
//                                 <div className="flex items-center justify-between mb-2">
//                                     <label className="block font-semibold text-gray-900">Description *</label>
//                                     <div className="flex items-center gap-2">
//                                         <span className="text-xs font-medium text-gray-700">Visibility</span>
//                                         <button 
//                                             onClick={() => handleToggle('descriptionVisible')} 
//                                             className={`w-10 h-5 rounded-full flex items-center justify-start p-1 transition-colors duration-200 ${
//                                                 formData.descriptionVisible ? 'bg-blue-600 justify-end' : 'bg-gray-400 justify-start'
//                                             }`}
//                                         >
//                                             <div className={`bg-white w-3 h-3 rounded-full shadow-md transform transition-transform duration-200 ${
//                                                 formData.descriptionVisible ? 'translate-x-5' : 'translate-x-0'
//                                             }`}></div>
//                                         </button>
//                                     </div>
//                                 </div>
//                                 <textarea
//                                     name="description"
//                                     value={formData.description}
//                                     onChange={handleChange}
//                                     className="w-full rounded-md border-2 border-blue-900 px-3 py-2"
//                                     placeholder="Enter Description"
//                                     rows={4}
//                                     required
//                                 />
//                             </div>

//                             {/* Webview URL */}
//                             <div className="rounded-md border border-gray-200 bg-gray-50 p-4">
//                                 <div className="flex items-center justify-between mb-2">
//                                     <label className="block font-semibold text-gray-900">Webview URL</label>
//                                     <div className="flex items-center gap-2">
//                                         <span className="text-xs font-medium text-gray-700">Visibility</span>
//                                         <button 
//                                             onClick={() => handleToggle('webviewUrlVisible')} 
//                                             className={`w-10 h-5 rounded-full flex items-center justify-start p-1 transition-colors duration-200 ${
//                                                 formData.webviewUrlVisible ? 'bg-blue-600 justify-end' : 'bg-gray-400 justify-start'
//                                             }`}
//                                         >
//                                             <div className={`bg-white w-3 h-3 rounded-full shadow-md transform transition-transform duration-200 ${
//                                                 formData.webviewUrlVisible ? 'translate-x-5' : 'translate-x-0'
//                                             }`}></div>
//                                         </button>
//                                     </div>
//                                 </div>
//                                 <input
//                                     type="text"
//                                     name="webviewUrl"
//                                     value={formData.webviewUrl}
//                                     onChange={handleChange}
//                                     className="w-full rounded-md border-2 border-blue-900 px-3 py-2"
//                                     placeholder="Enter Webview URL (Optional)"
//                                 />
//                             </div>
//                         </div>

//                         {/* PRICING SECTION */}
//                         <div className="space-y-4 rounded-lg border border-gray-300 bg-white p-4">
//                             <h3 className="font-bold text-gray-900 border-b pb-2">Pricing Details</h3>

//                             {/* Original Price */}
//                             <div className="rounded-md border border-gray-200 bg-gray-50 p-4">
//                                 <div className="flex items-center justify-between mb-2">
//                                     <label className="block font-semibold text-gray-900">Original Price *</label>
//                                     <div className="flex items-center gap-2">
//                                         <span className="text-xs font-medium text-gray-700">Visibility</span>
//                                         <button 
//                                             onClick={() => handleToggle('originalPriceVisible')} 
//                                             className={`w-10 h-5 rounded-full flex items-center justify-start p-1 transition-colors duration-200 ${
//                                                 formData.originalPriceVisible ? 'bg-blue-600 justify-end' : 'bg-gray-400 justify-start'
//                                             }`}
//                                         >
//                                             <div className={`bg-white w-3 h-3 rounded-full shadow-md transform transition-transform duration-200 ${
//                                                 formData.originalPriceVisible ? 'translate-x-5' : 'translate-x-0'
//                                             }`}></div>
//                                         </button>
//                                     </div>
//                                 </div>
//                                 <div className="flex items-center gap-2">
//                                     <IndianRupee size={20} className="text-gray-600" />
//                                     <input
//                                         type="number"
//                                         name="originalPrice"
//                                         value={formData.originalPrice}
//                                         onChange={handleChange}
//                                         className="w-full rounded-md border-2 border-blue-900 px-3 py-2"
//                                         placeholder="00.00"
//                                         min="0"
//                                         step="0.01"
//                                         required
//                                     />
//                                 </div>
//                             </div>

//                             {/* Discount */}
//                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                                 <div className="rounded-md border border-gray-200 bg-gray-50 p-4">
//                                     <label className="block font-semibold text-gray-900 mb-2">Discount Type</label>
//                                     <select
//                                         name="discountType"
//                                         value={formData.discountType}
//                                         onChange={handleChange}
//                                         className="w-full rounded-md border-2 border-blue-900 px-3 py-2"
//                                     >
//                                         <option value="percentage">Percentage (%)</option>
//                                         <option value="fixed">Fixed Amount (₹)</option>
//                                     </select>
//                                 </div>
//                                 <div className="rounded-md border border-gray-200 bg-gray-50 p-4">
//                                     <label className="block font-semibold text-gray-900 mb-2">Discount Value</label>
//                                     <input
//                                         type="number"
//                                         name="discountValue"
//                                         value={formData.discountValue}
//                                         onChange={handleChange}
//                                         className="w-full rounded-md border-2 border-blue-900 px-3 py-2"
//                                         placeholder={formData.discountType === 'percentage' ? 'Enter %' : 'Enter ₹'}
//                                         min="0"
//                                         step={formData.discountType === 'percentage' ? "1" : "0.01"}
//                                     />
//                                 </div>
//                             </div>

//                             {/* GST */}
//                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                                 <div className="rounded-md border border-gray-200 bg-gray-50 p-4">
//                                     <label className="block font-semibold text-gray-900 mb-2">Select GST</label>
//                                     <select
//                                         name="gst"
//                                         value={formData.gst}
//                                         onChange={handleChange}
//                                         className="w-full rounded-md border-2 border-blue-900 px-3 py-2"
//                                     >
//                                         {gstOptions.map(gst => (
//                                             <option key={gst} value={gst}>{gst}%</option>
//                                         ))}
//                                     </select>
//                                 </div>
//                                 <div className="rounded-md border border-gray-200 bg-gray-50 p-4">
//                                     <label className="block font-semibold text-gray-900 mb-2">GST Type</label>
//                                     <select
//                                         name="gstType"
//                                         value={formData.gstType}
//                                         onChange={handleChange}
//                                         className="w-full rounded-md border-2 border-blue-900 px-3 py-2"
//                                     >
//                                         {gstTypeOptions.map(option => (
//                                             <option key={option.value} value={option.value}>
//                                                 {option.label}
//                                             </option>
//                                         ))}
//                                     </select>
//                                 </div>
//                             </div>

//                             {/* Price Summary */}
//                             <div className="rounded-md border-2 border-green-600 bg-green-50 p-4">
//                                 <h4 className="font-bold text-green-800 mb-3">Price Summary</h4>
//                                 <div className="space-y-2">
//                                     <div className="flex justify-between">
//                                         <span className="text-gray-700">Original Price:</span>
//                                         <span className="font-semibold">₹{parseFloat(formData.originalPrice || '0').toFixed(2)}</span>
//                                     </div>
//                                     <div className="flex justify-between">
//                                         <span className="text-gray-700">Discount:</span>
//                                         <span className="font-semibold text-red-600">
//                                             {formData.discountType === 'percentage' 
//                                                 ? `${formData.discountValue || '0'}%` 
//                                                 : `₹${parseFloat(formData.discountValue || '0').toFixed(2)}`}
//                                         </span>
//                                     </div>
//                                     <div className="flex justify-between">
//                                         <span className="text-gray-700">After Discount:</span>
//                                         <span className="font-semibold">₹{finalPrice.toFixed(2)}</span>
//                                     </div>
//                                     <div className="flex justify-between">
//                                         <span className="text-gray-700">GST ({formData.gst}%):</span>
//                                         <span className="font-semibold">₹{gstAmount.toFixed(2)}</span>
//                                     </div>
//                                     <div className="flex justify-between border-t pt-2">
//                                         <span className="text-lg font-bold text-gray-900">Total Price:</span>
//                                         <span className="text-lg font-bold text-green-700">₹{totalPrice.toFixed(2)}</span>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>

//                         {/* DELIVERY TIME */}
//                         <div className="space-y-4 rounded-lg border border-gray-300 bg-white p-4">
//                             <div className="flex items-center justify-between">
//                                 <h3 className="font-bold text-gray-900">Delivery Time</h3>
//                                 <div className="flex items-center gap-2">
//                                     <span className="text-xs font-medium text-gray-700">Visibility</span>
//                                     <button 
//                                         onClick={() => handleToggle('deliveryTimeVisible')} 
//                                         className={`w-10 h-5 rounded-full flex items-center justify-start p-1 transition-colors duration-200 ${
//                                             formData.deliveryTimeVisible ? 'bg-blue-600 justify-end' : 'bg-gray-400 justify-start'
//                                         }`}
//                                     >
//                                         <div className={`bg-white w-3 h-3 rounded-full shadow-md transform transition-transform duration-200 ${
//                                             formData.deliveryTimeVisible ? 'translate-x-5' : 'translate-x-0'
//                                         }`}></div>
//                                     </button>
//                                 </div>
//                             </div>
//                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                                 <div className="rounded-md border border-gray-200 bg-gray-50 p-4">
//                                     <label className="block font-semibold text-gray-900 mb-2 flex items-center gap-2">
//                                         <Clock size={16} />
//                                         Min Time (minutes)
//                                     </label>
//                                     <input
//                                         type="number"
//                                         name="minTime"
//                                         value={formData.minTime}
//                                         onChange={handleChange}
//                                         className="w-full rounded-md border-2 border-blue-900 px-3 py-2"
//                                         placeholder="Minimum time"
//                                         min="0"
//                                     />
//                                 </div>
//                                 <div className="rounded-md border border-gray-200 bg-gray-50 p-4">
//                                     <label className="block font-semibold text-gray-900 mb-2 flex items-center gap-2">
//                                         <Clock size={16} />
//                                         Max Time (minutes)
//                                     </label>
//                                     <input
//                                         type="number"
//                                         name="maxTime"
//                                         value={formData.maxTime}
//                                         onChange={handleChange}
//                                         className="w-full rounded-md border-2 border-blue-900 px-3 py-2"
//                                         placeholder="Maximum time"
//                                         min="0"
//                                     />
//                                 </div>
//                             </div>
//                         </div>

//                         {/* MEDIA UPLOADS */}
//                         <div className="space-y-4 rounded-lg border-2 border-blue-900 bg-white p-4">
//                             <h3 className="font-bold text-gray-900 border-b pb-2">Media Uploads</h3>

//                             {/* Photo Upload */}
//                             <div className="rounded-md border border-gray-300 p-4">
//                                 <div className="flex items-center justify-between mb-3">
//                                     <div>
//                                         <label className="block font-medium text-gray-900">Photo Upload</label>
//                                         <p className="text-xs text-gray-500">Size: 100dp x 120dp</p>
//                                     </div>
//                                     <div className="flex items-center gap-2">
//                                         <span className="text-xs font-medium text-gray-700">Visibility</span>
//                                         <button 
//                                             onClick={() => handleToggle('photoVisible')} 
//                                             className={`w-10 h-5 rounded-full flex items-center justify-start p-1 transition-colors duration-200 ${
//                                                 formData.photoVisible ? 'bg-blue-600 justify-end' : 'bg-gray-400 justify-start'
//                                             }`}
//                                         >
//                                             <div className={`bg-white w-3 h-3 rounded-full shadow-md transform transition-transform duration-200 ${
//                                                 formData.photoVisible ? 'translate-x-5' : 'translate-x-0'
//                                             }`}></div>
//                                         </button>
//                                     </div>
//                                 </div>
//                                 <div className="flex items-center gap-4">
//                                     <label className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded cursor-pointer transition-colors">
//                                         <Upload size={16} />
//                                         <span>{formData.photo ? formData.photo.name : "Choose Photo"}</span>
//                                         <input 
//                                             type="file" 
//                                             className="hidden" 
//                                             accept="image/*" 
//                                             onChange={(e) => handleFileChange(e, 'photo')} 
//                                         />
//                                     </label>
//                                     {formData.photo && (
//                                         <span className="text-sm text-green-600 font-medium">
//                                             ✓ Photo selected
//                                         </span>
//                                     )}
//                                 </div>
//                             </div>

//                             {/* Video Upload */}
//                             <div className="rounded-md border border-gray-300 p-4">
//                                 <div className="flex items-center justify-between mb-3">
//                                     <label className="block font-medium text-gray-900">Video Upload</label>
//                                     <div className="flex items-center gap-2">
//                                         <span className="text-xs font-medium text-gray-700">Visibility</span>
//                                         <button 
//                                             onClick={() => handleToggle('videoVisible')} 
//                                             className={`w-10 h-5 rounded-full flex items-center justify-start p-1 transition-colors duration-200 ${
//                                                 formData.videoVisible ? 'bg-blue-600 justify-end' : 'bg-gray-400 justify-start'
//                                             }`}
//                                         >
//                                             <div className={`bg-white w-3 h-3 rounded-full shadow-md transform transition-transform duration-200 ${
//                                                 formData.videoVisible ? 'translate-x-5' : 'translate-x-0'
//                                             }`}></div>
//                                         </button>
//                                     </div>
//                                 </div>
//                                 <div className="flex items-center gap-4">
//                                     <label className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded cursor-pointer transition-colors">
//                                         <Upload size={16} />
//                                         <span>{formData.video ? formData.video.name : "Choose Video"}</span>
//                                         <input 
//                                             type="file" 
//                                             className="hidden" 
//                                             accept="video/*" 
//                                             onChange={(e) => handleFileChange(e, 'video')} 
//                                         />
//                                     </label>
//                                     {formData.video && (
//                                         <span className="text-sm text-green-600 font-medium">
//                                             ✓ Video selected
//                                         </span>
//                                     )}
//                                 </div>
//                             </div>
//                         </div>
//                     </div>

//                     {/* SAVE BUTTON */}
//                     <div className="flex justify-end">
//                         <button
//                             onClick={handleSave}
//                             className="flex items-center gap-2 rounded-lg bg-red-600 hover:bg-red-700 px-6 py-3 font-bold text-white transition-all hover:scale-105 active:scale-95 shadow-lg"
//                         >
//                             <Save size={20} />
//                             Save Sub Deep Child Category
//                         </button>
//                     </div>
//                 </>
//             )}

//             {/* IF NO DEEP CHILD SELECTED YET */}
//             {!shouldShowContentFields && formData.childCategoryId && (
//                 <div className="mb-6 rounded-md border-2 border-yellow-600 bg-yellow-50 p-4">
//                     <p className="text-yellow-800">
//                         <strong>Almost there!</strong> Please select a deep child category from the dropdown above to add content.
//                     </p>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default SubDeepChildCategoryForm;

"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { Save, Upload, IndianRupee, Clock, ChevronDown, ChevronUp } from "lucide-react";
import { useCategory } from "../../context/CategoryContext";

interface SubDeepChildCategoryFormProps {
    initialDeepChildCategoryId?: string | null;
    onSuccess?: () => void;
}

const SubDeepChildCategoryForm: React.FC<SubDeepChildCategoryFormProps> = ({ initialDeepChildCategoryId, onSuccess }) => {
    const context = useCategory();

    if (!context) return <div className="p-4 text-red-500">Error: Category Context not found.</div>;

    const { addSubDeepChildCategory, mainCategories } = context;

    // ✅ Function to generate unique local ID (e.g., "Priya Singh_h9h7")
    const generateLocalId = (title: string): string => {
        const cleanTitle = title
            .toLowerCase()
            .replace(/[^a-z0-9]/g, '')
            .substring(0, 10);

        const randomChars = Math.random().toString(36).slice(2, 6); // ✅ EXACT 4 characters
        return `${cleanTitle}_${randomChars}`;
    };

    // ✅ MAIN VISIBILITY TOGGLE
    const [isVisible, setIsVisible] = useState(true);

    // ✅ STATE VARIABLES
    const [mainSearch, setMainSearch] = useState("");
    const [mainOpen, setMainOpen] = useState(false);
    const [selectedMainCategory, setSelectedMainCategory] = useState<any>(null);

    const [subCategories, setSubCategories] = useState<any[]>([]);
    const [subSearch, setSubSearch] = useState("");
    const [subOpen, setSubOpen] = useState(false);

    const [childCategories, setChildCategories] = useState<any[]>([]);
    const [childSearch, setChildSearch] = useState("");
    const [childOpen, setChildOpen] = useState(false);

    const [deepChildCategories, setDeepChildCategories] = useState<any[]>([]);
    const [deepChildSearch, setDeepChildSearch] = useState("");
    const [deepChildOpen, setDeepChildOpen] = useState(false);

    // ✅ TRACK IF DEEP CHILD IS SELECTED
    const [isDeepChildSelected, setIsDeepChildSelected] = useState(false);

    // ✅ REFS FOR CLICK HANDLING
    const mainDropdownRef = useRef<HTMLDivElement>(null);
    const subDropdownRef = useRef<HTMLDivElement>(null);
    const childDropdownRef = useRef<HTMLDivElement>(null);
    const deepChildDropdownRef = useRef<HTMLDivElement>(null);
    const mainInputRef = useRef<HTMLInputElement>(null);
    const subInputRef = useRef<HTMLInputElement>(null);
    const childInputRef = useRef<HTMLInputElement>(null);
    const deepChildInputRef = useRef<HTMLInputElement>(null);

    // ✅ FORM DATA WITH ALL FIELDS
    const [formData, setFormData] = useState({
        mainCategoryId: "",
        subCategoryId: "",
        childCategoryId: "",
        deepChildCategoryId: initialDeepChildCategoryId || "",

        firstTitle: "",
        firstTitleVisible: true,
        secondTitle: "",
        secondTitleVisible: true,
        description: "",
        descriptionVisible: true,

        webviewUrl: "",
        webviewUrlVisible: true,

        originalPrice: "",
        originalPriceVisible: true,

        discountType: "percentage",
        discountValue: "",

        gst: "0",
        gstType: "inclusive",

        // 🔥🔥🔥 FIXED
        minTime: null as number | null,
        maxTime: null as number | null,

        photo: null as File | null,
        photoVisible: true,
        video: null as File | null,
        videoVisible: true,

        localId: "",
    });


    // ✅ GST OPTIONS
    const gstOptions = ["0", "5", "12", "18", "28"];
    const gstTypeOptions = [
        { value: "inclusive", label: "Include GST" },
        { value: "exclusive", label: "Exclude GST" }
    ];

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
        const price = formData.gstType === "inclusive" ? finalPrice : finalPrice * (1 + gstRate / 100);
        return (price * gstRate) / (100 + gstRate);
    }, [finalPrice, formData.gst, formData.gstType]);

    const totalPrice = useMemo(() => {
        if (formData.gstType === "inclusive") {
            return finalPrice;
        } else {
            const gstRate = parseFloat(formData.gst) || 0;
            return finalPrice + (finalPrice * gstRate / 100);
        }
    }, [finalPrice, formData.gst, formData.gstType]);

    // ✅ CLICK OUTSIDE HANDLER
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (mainOpen && mainDropdownRef.current &&
                !mainDropdownRef.current.contains(event.target as Node) &&
                !mainInputRef.current?.contains(event.target as Node)) {
                setMainOpen(false);
            }

            if (subOpen && subDropdownRef.current &&
                !subDropdownRef.current.contains(event.target as Node) &&
                !subInputRef.current?.contains(event.target as Node)) {
                setSubOpen(false);
            }

            if (childOpen && childDropdownRef.current &&
                !childDropdownRef.current.contains(event.target as Node) &&
                !childInputRef.current?.contains(event.target as Node)) {
                setChildOpen(false);
            }

            if (deepChildOpen && deepChildDropdownRef.current &&
                !deepChildDropdownRef.current.contains(event.target as Node) &&
                !deepChildInputRef.current?.contains(event.target as Node)) {
                setDeepChildOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [mainOpen, subOpen, childOpen, deepChildOpen]);

    // ✅ FILTERED LISTS
    const filteredMainCategories = useMemo(() => {
        const q = mainSearch.trim().toLowerCase();
        const list = mainCategories.filter(cat =>
            typeof cat.name === "string" && cat.name.trim() !== ""
        );

        if (!q) return list.sort((a, b) => a.name.localeCompare(b.name));

        const startsWith = list.filter(cat =>
            cat.name.toLowerCase().startsWith(q)
        );
        const contains = list.filter(cat =>
            !cat.name.toLowerCase().startsWith(q) &&
            cat.name.toLowerCase().includes(q)
        );

        return [
            ...startsWith.sort((a, b) => a.name.localeCompare(b.name)),
            ...contains.sort((a, b) => a.name.localeCompare(b.name)),
        ];
    }, [mainSearch, mainCategories]);

    const filteredSubCategories = useMemo(() => {
        if (!subSearch) return subCategories;
        return subCategories.filter(sub => {
            if (!sub || typeof sub.name !== "string") return false;
            return sub.name.toLowerCase().includes(subSearch.toLowerCase());
        });
    }, [subSearch, subCategories]);

    const filteredChildCategories = useMemo(() => {
        if (!childSearch) return childCategories;
        return childCategories.filter(child => {
            if (!child || typeof child.name !== "string") return false;
            return child.name.toLowerCase().includes(childSearch.toLowerCase());
        });
    }, [childSearch, childCategories]);

    const filteredDeepChildCategories = useMemo(() => {
        if (!deepChildSearch) return deepChildCategories;
        return deepChildCategories.filter(deep =>
            deep.firstTitle?.toLowerCase().includes(deepChildSearch.toLowerCase())
        );
    }, [deepChildSearch, deepChildCategories]);

    // ✅ MAIN CATEGORY SELECT HANDLER
    const handleMainSelect = (cat: any) => {
        console.log("✅ MAIN CATEGORY SELECTED:", cat);
        setMainSearch(cat.name);
        setMainOpen(false);
        setSelectedMainCategory(cat);

        setFormData(prev => ({
            ...prev,
            mainCategoryId: cat._id,
            subCategoryId: "",
            childCategoryId: "",
            deepChildCategoryId: "",
            localId: ""
        }));

        setIsDeepChildSelected(false);
        setSubCategories([]);
        setSubSearch("");
        setChildCategories([]);
        setChildSearch("");
        setDeepChildCategories([]);
        setDeepChildSearch("");
    };

    // ✅ SUB CATEGORY API CALL - FIXED
    useEffect(() => {
        if (!selectedMainCategory) return;

        if (selectedMainCategory.hasSubCategory !== true) {
            console.log("ℹ️ Main category has no subcategories");
            setSubCategories([]);
            setFormData(prev => ({ ...prev, subCategoryId: "" }));
            return;
        }

        console.log("🚀 Fetching subcategories for main:", selectedMainCategory._id);

        const fetchSubCategoriesAPI = async () => {
            try {
                const token = localStorage.getItem("token");
                const url = `https://api.bijliwalaaya.in/api/product-listing/main/${selectedMainCategory._id}/sub`;
                console.log("📡 Subcategory API URL:", url);

                const res = await fetch(url, {
                    headers: {
                        Authorization: token ? `Bearer ${token}` : "",
                        "x-api-token": "super_secure_token",
                        "Content-Type": "application/json",
                    },
                });

                const json = await res.json();
                console.log("📥 Raw subcategory response:", json);

                if (json.success && json.data) {
                    // ✅ FIXED: Handle both array and object responses
                    let list = [];

                    if (Array.isArray(json.data)) {
                        list = json.data.map((item: any) => ({
                            documentId: item._id || item.documentId,
                            name: item.name || item.firstTitle,
                        }));
                    } else if (typeof json.data === 'object') {
                        list = Object.entries(json.data).map(([key, value]: any) => ({
                            documentId: key,
                            name: value.name || value.firstTitle,
                        }));
                    }

                    console.log("✅ Subcategories loaded:", list.length);
                    console.log("📊 Subcategories:", list);
                    setSubCategories(list);
                } else {
                    console.log("❌ No subcategories found");
                    setSubCategories([]);
                }
            } catch (err) {
                console.error("❌ Subcategory API failed:", err);
                setSubCategories([]);
            }
        };

        fetchSubCategoriesAPI();
    }, [selectedMainCategory]);

    // ✅ CHILD CATEGORY API CALL - FIXED
    useEffect(() => {
        console.log("🔄 Child API Triggered:", {
            mainCategoryId: formData.mainCategoryId,
            subCategoryId: formData.subCategoryId,
            hasSubCategory: selectedMainCategory?.hasSubCategory
        });

        if (!formData.mainCategoryId) {
            console.log("⛔ No main category selected");
            setChildCategories([]);
            return;
        }

        // If main has subcategories but sub is not selected
        if (selectedMainCategory?.hasSubCategory === true && !formData.subCategoryId) {
            console.log("⏳ Waiting for subcategory selection");
            setChildCategories([]);
            return;
        }

        const fetchChildCategories = async () => {
            try {
                const token = localStorage.getItem("token");
                let url = "";

                if (selectedMainCategory?.hasSubCategory !== true) {
                    // Case 1: Direct child categories (no subcategory)
                    url = `https://api.bijliwalaaya.in/api/product-listing/main/${formData.mainCategoryId}/child`;
                } else {
                    // Case 2: Child categories through subcategory
                    url = `https://api.bijliwalaaya.in/api/product-listing/main/${formData.mainCategoryId}/sub/${formData.subCategoryId}/child`;
                }

                console.log("📡 Child category API URL:", url);

                const res = await fetch(url, {
                    headers: {
                        Authorization: token ? `Bearer ${token}` : "",
                        "x-api-token": "super_secure_token",
                        "Content-Type": "application/json",
                    },
                });

                const json = await res.json();
                console.log("📥 Raw child category response:", json);

                if (json.success && json.data) {
                    let list = [];

                    if (Array.isArray(json.data)) {
                        list = json.data.map((item: any) => ({
                            documentId: item._id || item.documentId,
                            name: item.name,
                        }));
                    } else if (typeof json.data === 'object') {
                        list = Object.entries(json.data).map(([key, value]: any) => ({
                            documentId: key,
                            name: value.name,
                        }));
                    }

                    console.log("✅ Child categories loaded:", list.length);
                    console.log("📊 Child categories:", list);
                    setChildCategories(list);
                } else {
                    console.log("❌ No child categories found");
                    setChildCategories([]);
                }
            } catch (err) {
                console.error("❌ Child category API failed:", err);
                setChildCategories([]);
            }
        };

        fetchChildCategories();
    }, [formData.mainCategoryId, formData.subCategoryId, selectedMainCategory]);

    // ✅ DEEP CHILD CATEGORY API CALL - FIXED
    useEffect(() => {
        if (!formData.childCategoryId) {
            console.log("⛔ No child category selected for deep child fetch");
            setDeepChildCategories([]);
            return;
        }

        console.log("🚀 Fetching deep child categories for child:", formData.childCategoryId);

        const fetchDeepChildCategoriesAPI = async () => {
            try {
                const token = localStorage.getItem("token");
                let url = "";

                if (formData.subCategoryId && selectedMainCategory?.hasSubCategory === true) {
                    url = `https://api.bijliwalaaya.in/api/product-listing/main/${formData.mainCategoryId}/sub/${formData.subCategoryId}/child/${formData.childCategoryId}/deep`;
                } else {
                    url = `https://api.bijliwalaaya.in/api/product-listing/main/${formData.mainCategoryId}/child/${formData.childCategoryId}/deep`;
                }

                console.log("📡 Deep child category API URL:", url);

                const res = await fetch(url, {
                    headers: {
                        Authorization: token ? `Bearer ${token}` : "",
                        "x-api-token": "super_secure_token",
                        "Content-Type": "application/json",
                    },
                });

                const json = await res.json();
                console.log("📥 Raw deep child response:", json);

                if (json.success && json.data) {
                    let list = [];

                    if (Array.isArray(json.data)) {
                        list = json.data.map((item: any) => ({
                            documentId: item._id || item.documentId,
                            firstTitle: item.firstTitle,
                            secondTitle: item.secondTitle,
                            localId: item.localId
                        }));
                    } else if (typeof json.data === 'object') {
                        list = Object.entries(json.data).map(([key, value]: any) => ({
                            documentId: key,
                            firstTitle: value.firstTitle,
                            secondTitle: value.secondTitle,
                            localId: value.localId
                        }));
                    }

                    console.log("✅ Deep child categories loaded:", list.length);
                    console.log("📊 Deep child categories:", list);
                    setDeepChildCategories(list);
                } else {
                    console.log("❌ No deep child categories found");
                    setDeepChildCategories([]);
                }
            } catch (err) {
                console.error("❌ Deep child category API failed:", err);
                setDeepChildCategories([]);
            }
        };

        fetchDeepChildCategoriesAPI();
    }, [formData.childCategoryId, formData.mainCategoryId, formData.subCategoryId, selectedMainCategory]);

    // ✅ GENERATE LOCAL ID WHEN FIRST TITLE CHANGES
    useEffect(() => {
        if (formData.firstTitle.trim() && !formData.localId) {
            const localId = generateLocalId(formData.firstTitle);
            setFormData(prev => ({ ...prev, localId }));
            console.log("✅ Generated Local ID:", localId);
        }
    }, [formData.firstTitle]);

    // ✅ TRACK WHEN DEEP CHILD IS SELECTED
    useEffect(() => {
        if (formData.deepChildCategoryId && formData.deepChildCategoryId.trim() !== "") {
            setIsDeepChildSelected(true);
            console.log("✅ Deep child category selected:", formData.deepChildCategoryId);
        } else {
            setIsDeepChildSelected(false);
        }
    }, [formData.deepChildCategoryId]);

    // ✅ HANDLERS
    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;

        // 🔥 MIN / MAX TIME
        if (name === "minTime" || name === "maxTime") {
            setFormData(prev => ({
                ...prev,
                [name]: value === "" ? null : Number(value),
            }));
            return;
        }

        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };


    const handleToggle = (field: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: !prev[field as keyof typeof prev]
        }));
    };

    const handleMainVisibilityToggle = () => {
        setIsVisible(prev => !prev);
        console.log("Sub Deep Child Visibility Toggled:", !isVisible);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'photo' | 'video') => {
        if (e.target.files && e.target.files[0]) {
            setFormData(prev => ({ ...prev, [type]: e.target.files![0] }));
        }
    };

    const handleSubSelect = (sub: any) => {
        console.log("✅ SUB CATEGORY SELECTED:", sub);
        setSubSearch(sub.name);
        setSubOpen(false);

        setFormData(prev => ({
            ...prev,
            subCategoryId: sub.documentId,
            childCategoryId: "",
            deepChildCategoryId: ""
        }));

        setIsDeepChildSelected(false);
        setChildCategories([]);
        setDeepChildCategories([]);
    };

    const handleChildSelect = (child: any) => {
        setChildSearch(child.name);
        setChildOpen(false);

        setFormData(prev => ({
            ...prev,
            childCategoryId: child.documentId, // ✅ ONLY ID
            deepChildCategoryId: ""
        }));

        setIsDeepChildSelected(false);
    };


    const handleDeepChildSelect = (deep: any) => {
        console.log("✅ DEEP CHILD CATEGORY SELECTED:", deep);
        setDeepChildSearch(deep.firstTitle);
        setDeepChildOpen(false);

        setFormData(prev => ({
            ...prev,
            deepChildCategoryId: deep.documentId
        }));

        setIsDeepChildSelected(true);
        console.log("🎯 Deep child selected, content fields should open now");
    };
    // Price 
    const calculatePriceAfterGst = () => {
        const original = Number(formData.originalPrice) || 0;
        const gst = Number(formData.gst) || 0;

        if (original <= 0) return 0;

        // GST already included
        if (formData.gstType === "inclusive") {
            return +original.toFixed(2);
        }

        // GST exclusive → add GST
        const price = original + (original * gst) / 100;
        return +price.toFixed(2);
    };
    const calculateCurrentPrice = (priceAfterGst: number) => {
        let discount = Number(formData.discountValue) || 0;

        if (priceAfterGst <= 0) return 0;

        // Percentage discount
        if (formData.discountType === "percentage") {
            discount = Math.min(discount, 100);
            const price = priceAfterGst - (priceAfterGst * discount) / 100;
            return Math.max(0, +price.toFixed(2));
        }

        // Fixed discount
        const price = priceAfterGst - discount;
        return Math.max(0, +price.toFixed(2));
    };

    // ✅ SAVE HANDLER
    //     const handleSave = () => {
    //         // Validation
    //         if (!formData.mainCategoryId) {
    //             alert("Select main category");
    //             return;
    //         }

    //         if (selectedMainCategory?.hasSubCategory === true && !formData.subCategoryId) {
    //             alert("Select sub category");
    //             return;
    //         }

    //         if (!formData.childCategoryId) {
    //             alert("Select child category");
    //             return;
    //         }

    //         if (!formData.deepChildCategoryId) {
    //             alert("Select deep child category");
    //             return;
    //         }

    //         if (!formData.firstTitle.trim() || !formData.secondTitle.trim() || !formData.description.trim()) {
    //             alert("Please fill in all required fields (First Headline, Second Headline, Description).");
    //             return;
    //         }

    //         if (!formData.originalPrice) {
    //             alert("Please enter Original Price");
    //             return;
    //         }

    //         // Generate final local ID if not already generated
    //        const finalLocalId = formData.localId || generateLocalId(formData.firstTitle);

    // const selectedDeep = deepChildCategories.find(
    //   d => d.documentId === formData.deepChildCategoryId
    // );

    // const subDeepChildData = {
    //   // 🔑 REQUIRED IDS
    //   mainCategoryId: formData.mainCategoryId,
    //   subCategoryId: formData.subCategoryId || null,
    //   childCategoryId: formData.childCategoryId,
    //   deepChildCategoryId: formData.deepChildCategoryId,

    //   subDeepKey: finalLocalId, // ✅🔥 MUST (backend requires)

    //   deepChildCategoryName: selectedDeep
    //     ? selectedDeep.firstTitle
    //     : "Unknown",

    //   // 📝 CONTENT
    //   firstTitle: formData.firstTitle,
    //   secondTitle: formData.secondTitle,
    //   description: formData.description,
    //   visible: isVisible,
    //   webviewUrl: formData.webviewUrl,

    //   // 💰 PRICING
    //   originalPrice: formData.originalPrice,
    //   discountValue: formData.discountValue,
    //   discountType: formData.discountType,
    //   gst: formData.gst,
    //   gstType: formData.gstType,
    //   minTime: formData.minTime,
    //   maxTime: formData.maxTime,
    //   finalPrice: finalPrice.toFixed(2),
    //   totalPrice: totalPrice.toFixed(2),
    //   localId: finalLocalId,

    //   // 👁️ VISIBILITY TOGGLES
    //   firstTitleVisible: formData.firstTitleVisible,
    //   secondTitleVisible: formData.secondTitleVisible,
    //   descriptionVisible: formData.descriptionVisible,
    //   webviewUrlVisible: formData.webviewUrlVisible,
    //   originalPriceVisible: formData.originalPriceVisible,
    //   deliveryTimeVisible: formData.deliveryTimeVisible,

    //   // 📷 MEDIA
    //   photo: formData.photo,
    //   video: formData.video,
    //   photoVisible: formData.photoVisible,
    //   videoVisible: formData.videoVisible,
    // };


    //         console.log("📦 Sending Sub Deep Child Data to MongoDB:", subDeepChildData);

    //         addSubDeepChildCategory(subDeepChildData);
    //         alert(`Sub Deep Child Category Added!\nLocal ID: ${finalLocalId}`);

    //         if (onSuccess) onSuccess();
    //     };

    // const handleSave = () => {
    //   if (!formData.mainCategoryId) return alert("Select main category");
    //   if (selectedMainCategory?.hasSubCategory && !formData.subCategoryId)
    //     return alert("Select sub category");
    //   if (!formData.childCategoryId) return alert("Select child category");
    //   if (!formData.deepChildCategoryId) return alert("Select deep child category");
    //   if (!formData.firstTitle.trim()) return alert("Enter first title");
    //   if (!formData.originalPrice) return alert("Enter original price");

    //   const finalLocalId =
    //     formData.localId || generateLocalId(formData.firstTitle);

    //   // 🔥 PRICE FLOW
    //   const priceAfterGst = calculatePriceAfterGst();
    //   const currentPrice = calculateCurrentPrice(priceAfterGst);

    //   const subDeepChildData = {
    //     // 🔑 IDS
    //     mainCategoryId: formData.mainCategoryId,
    //     subCategoryId: formData.subCategoryId || null,
    //     childCategoryId: formData.childCategoryId,
    //     deepChildCategoryId: formData.deepChildCategoryId,
    //     subDeepKey: finalLocalId,

    //     // 📝 CONTENT
    //     firstTitle: formData.firstTitle,
    //     secondTitle: formData.secondTitle,
    //     description: formData.description,
    //     subDeepCategoryVisible: isVisible,
    //     webviewUrl: formData.webviewUrl,

    //     // 💰 RAW PRICING
    //     originalPrice: Number(formData.originalPrice),
    //     discountType: formData.discountType,
    //     discountValue: Number(formData.discountValue),
    //     gst: Number(formData.gst),
    //     gstType: formData.gstType,

    //     // 🔥 CALCULATED (NO UI FIELD)
    //     priceAfterGst,          // ✅ ORIGINAL + GST
    //     currentPrice,           // ✅ AFTER DISCOUNT
    //     currentPriceVisible: true,

    //     // 👁️ VISIBILITY
    //     firstTitleVisible: formData.firstTitleVisible,
    //     secondTitleVisible: formData.secondTitleVisible,
    //     descriptionVisible: formData.descriptionVisible,
    //     webviewUrlVisible: formData.webviewUrlVisible,
    //     originalPriceVisible: formData.originalPriceVisible,
    //     minTimeVisible: true,
    //     maxTimeVisible: true,

    //     // 📷 MEDIA
    //     photoVisible: formData.photoVisible,
    //     videoVisible: formData.videoVisible,

    //     // 🆔 MONGO IDS
    //     documentId: finalLocalId,
    //     localId: finalLocalId,
    //   };

    //   console.log("📦 FINAL DATA GOING TO MONGO:", subDeepChildData);
    //   addSubDeepChildCategory(subDeepChildData);
    //   alert(`Sub Deep Child Category Added!\nLocal ID: ${finalLocalId}`);
    // };
    const handleSave = () => {
        if (!formData.mainCategoryId) return alert("Select main category");
        if (selectedMainCategory?.hasSubCategory && !formData.subCategoryId)
            return alert("Select sub category");
        if (!formData.childCategoryId) return alert("Select child category");
        if (!formData.deepChildCategoryId) return alert("Select deep child category");
        if (!formData.firstTitle.trim()) return alert("Enter first title");
        if (!formData.originalPrice) return alert("Enter original price");

        const finalLocalId =
            formData.localId || generateLocalId(formData.firstTitle);

        const priceAfterGst = calculatePriceAfterGst();
        const currentPrice = calculateCurrentPrice(priceAfterGst);

        // 🔥🔥🔥 TIME CONVERSION
        const minTimeValue =
            formData.minTime !== null ? Number(formData.minTime) : null;
        const maxTimeValue =
            formData.maxTime !== null ? Number(formData.maxTime) : null;

        const selectedDeep = deepChildCategories.find(d => d.documentId === formData.deepChildCategoryId);

        const subDeepChildData = {
            // 🔑 IDS
            mainCategoryId: formData.mainCategoryId,
            subCategoryId: formData.subCategoryId || null,
            childCategoryId: formData.childCategoryId,
            deepChildCategoryId: formData.deepChildCategoryId,
            deepChildCategoryName: selectedDeep ? selectedDeep.firstTitle : "Deep Category", // Added missing field
            subDeepKey: finalLocalId,

            // 📝 CONTENT
            firstTitle: formData.firstTitle,
            secondTitle: formData.secondTitle,
            description: formData.description,
            subDeepCategoryVisible: true,
            visible: isVisible, // Ensure main toggle is respected
            webviewUrl: formData.webviewUrl,

            // ⏰🔥 DELIVERY TIME
            minTime: minTimeValue,
            maxTime: maxTimeValue,
            minTimeVisible: formData.deliveryTimeVisible, // Map deliveryTimeVisible to min/max
            maxTimeVisible: formData.deliveryTimeVisible,

            // 💰 PRICING
            originalPrice: Number(formData.originalPrice),
            discountType: formData.discountType,
            discountValue: Number(formData.discountValue),
            gst: Number(formData.gst),
            gstType: formData.gstType,

            priceAfterGst,
            currentPrice,
            currentPriceVisible: true,

            // 👁️ VISIBILITY
            firstTitleVisible: formData.firstTitleVisible,
            secondTitleVisible: formData.secondTitleVisible,
            descriptionVisible: formData.descriptionVisible,
            webviewUrlVisible: formData.webviewUrlVisible,
            originalPriceVisible: formData.originalPriceVisible,

            // 📷 MEDIA
            photoVisible: formData.photoVisible,
            videoVisible: formData.videoVisible,

            // 🆔 IDS
            documentId: finalLocalId,
            localId: finalLocalId,
        };

        console.log("📦 FINAL DATA:", subDeepChildData);
        console.log("⏰ TIME:", subDeepChildData.minTime, subDeepChildData.maxTime);

        addSubDeepChildCategory(subDeepChildData);
        alert("✅ Sub Deep Child Category Added");
    };



    // ✅ Condition for showing content fields
    const shouldShowContentFields = formData.deepChildCategoryId && formData.deepChildCategoryId.trim() !== "";

    return (
        <div className="rounded-lg border border-red-500 bg-gray-100 p-4 shadow-md">
            {/* HEADER WITH VISIBILITY TOGGLE */}
            <div className="mb-6 flex items-center justify-between rounded-md border-2 border-blue-900 bg-white px-4 py-3">
                <span className="text-xl font-bold text-gray-900">
                    Manage Sub Deep Child Category
                </span>
                <div className="flex items-center gap-4">
                    {formData.localId && (
                        <div className="rounded-md bg-blue-100 px-3 py-1">
                            <span className="text-sm font-semibold text-blue-800">
                                ID: {formData.localId}
                            </span>
                        </div>
                    )}
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-gray-700">
                            Visibility
                        </span>
                        <div
                            onClick={handleMainVisibilityToggle}
                            className={`relative inline-block h-6 w-12 cursor-pointer rounded-full transition-colors duration-200
                                ${isVisible ? "bg-green-500" : "bg-gray-300"}
                            `}
                        >
                            <div
                                className={`absolute top-0 h-6 w-6 rounded-full bg-white shadow-md transition-transform duration-200
                                    ${isVisible ? "translate-x-6" : "translate-x-0"}
                                `}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* HIERARCHICAL SELECTION */}
            <div className="mb-6 space-y-6 rounded-lg border border-gray-300 bg-white p-4">
                <h3 className="font-bold text-gray-900 border-b pb-2">Category Selection</h3>

                {/* MAIN CATEGORY */}
                <div className="relative">
                    <label className="mb-2 block font-bold text-gray-900">Select Main Category *</label>
                    <div className="relative">
                        <input
                            ref={mainInputRef}
                            type="text"
                            value={mainSearch}
                            placeholder="Search main category..."
                            onChange={(e) => {
                                setMainSearch(e.target.value);
                                setMainOpen(true);
                            }}
                            onFocus={() => setMainOpen(true)}
                            className="w-full rounded-md border-2 border-blue-900 px-3 py-2 pr-10"
                        />
                        <button
                            onClick={() => setMainOpen(!mainOpen)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                        >
                            {mainOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                        </button>
                    </div>

                    {mainOpen && (
                        <div ref={mainDropdownRef} className="absolute z-50 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                            {filteredMainCategories.length > 0 ? (
                                filteredMainCategories.map(cat => (
                                    <div
                                        key={cat._id}
                                        className="cursor-pointer px-4 py-3 hover:bg-blue-50 border-b border-gray-100 last:border-b-0"
                                        onMouseDown={(e) => {
                                            e.preventDefault();
                                            handleMainSelect(cat);
                                        }}
                                    >
                                        <div className="flex items-center justify-between">
                                            <span className="font-medium">{cat.name}</span>
                                            <span className={`text-xs px-2 py-1 rounded ${cat.hasSubCategory === true ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                                }`}>
                                                {cat.hasSubCategory === true ? "Has Subcategory" : "No Subcategory"}
                                            </span>
                                        </div>
                                        <div className="mt-1 text-xs text-gray-500">
                                            ID: {cat._id}
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

                {/* SUB CATEGORY */}
                {selectedMainCategory?.hasSubCategory === true && (
                    <div className="relative">
                        <label className="mb-2 block font-bold text-gray-900">Select Sub Category *</label>
                        <div className="relative">
                            <input
                                ref={subInputRef}
                                type="text"
                                value={subSearch}
                                placeholder="Search sub category..."
                                onChange={(e) => {
                                    setSubSearch(e.target.value);
                                    setSubOpen(true);
                                }}
                                onFocus={() => setSubOpen(true)}
                                className="w-full rounded-md border-2 border-blue-900 px-3 py-2 pr-10"
                            />
                            <button
                                onClick={() => setSubOpen(!subOpen)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                            >
                                {subOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                            </button>
                        </div>

                        {subOpen && (
                            <div ref={subDropdownRef} className="absolute z-40 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                                {subCategories.length > 0 ? (
                                    filteredSubCategories.map(sub => (
                                        <div
                                            key={sub.documentId}
                                            className="cursor-pointer px-4 py-3 hover:bg-blue-50 border-b border-gray-100 last:border-b-0"
                                            onMouseDown={(e) => {
                                                e.preventDefault();
                                                handleSubSelect(sub);
                                            }}
                                        >
                                            <div className="font-medium">{sub.name}</div>
                                            {sub.documentId && (
                                                <div className="text-xs text-gray-500 mt-1">ID: {sub.documentId}</div>
                                            )}
                                        </div>
                                    ))
                                ) : (
                                    <div className="px-4 py-3 text-gray-500">
                                        {subSearch ? "No subcategories found" : "Select main category first"}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {/* CHILD CATEGORY - ALWAYS SHOW IF MAIN IS SELECTED */}
                {formData.mainCategoryId && (
                    <div className="relative">
                        <label className="mb-2 block font-bold text-gray-900">Select Child Category *</label>
                        <div className="relative">
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
                                className="w-full rounded-md border-2 border-blue-900 px-3 py-2 pr-10"
                            />
                            <button
                                onClick={() => setChildOpen(!childOpen)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                            >
                                {childOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                            </button>
                        </div>

                        {childOpen && (
                            <div ref={childDropdownRef} className="absolute z-30 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                                {childCategories.length > 0 ? (
                                    filteredChildCategories.map(child => (
                                        <div
                                            key={child.documentId}
                                            className="cursor-pointer px-4 py-3 hover:bg-blue-50"
                                            onMouseDown={(e) => {
                                                e.preventDefault();
                                                handleChildSelect(child);
                                            }}
                                        >
                                            <span className="font-medium">{child.name}</span>
                                            {child.documentId && (
                                                <div className="text-xs text-gray-500">ID: {child.documentId}</div>
                                            )}
                                        </div>
                                    ))
                                ) : (
                                    <div className="px-4 py-3 text-gray-500">
                                        {childSearch ? "No child categories found" : "Loading child categories..."}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {/* DEEP CHILD CATEGORY - SHOW WHEN CHILD IS SELECTED */}
                {formData.childCategoryId && (
                    <div className="relative">
                        <label className="mb-2 block font-bold text-gray-900">Select Deep Child Category *</label>
                        <div className="relative">
                            <input
                                ref={deepChildInputRef}
                                type="text"
                                value={deepChildSearch}
                                placeholder="Search deep child category..."
                                onChange={(e) => {
                                    setDeepChildSearch(e.target.value);
                                    setDeepChildOpen(true);
                                }}
                                onFocus={() => setDeepChildOpen(true)}
                                className="w-full rounded-md border-2 border-blue-900 px-3 py-2 pr-10"
                            />
                            <button
                                onClick={() => setDeepChildOpen(!deepChildOpen)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                            >
                                {deepChildOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                            </button>
                        </div>

                        {deepChildOpen && (
                            <div ref={deepChildDropdownRef} className="absolute z-20 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                                {deepChildCategories.length > 0 ? (
                                    filteredDeepChildCategories.map(deep => (
                                        <div
                                            key={deep.documentId}
                                            className="cursor-pointer px-4 py-3 hover:bg-blue-50 border-b border-gray-100 last:border-b-0"
                                            onMouseDown={(e) => {
                                                e.preventDefault();
                                                handleDeepChildSelect(deep);
                                            }}
                                        >
                                            <div className="font-medium">{deep.firstTitle}</div>
                                            {deep.secondTitle && (
                                                <div className="text-sm text-gray-600 mt-1">{deep.secondTitle}</div>
                                            )}
                                            {deep.localId && (
                                                <div className="text-xs text-gray-500 mt-1">ID: {deep.localId}</div>
                                            )}
                                        </div>
                                    ))
                                ) : (
                                    <div className="px-4 py-3 text-gray-500">
                                        {deepChildSearch ? "No deep child categories found" : "Loading deep child categories..."}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* CONTENT FIELDS - WILL SHOW WHEN DEEP CHILD IS SELECTED */}
            {shouldShowContentFields && (
                <>
                    {/* SELECTED DEEP CHILD CATEGORY INFO */}
                    <div className="mb-6 rounded-md border-2 border-green-600 bg-green-50 p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-bold text-green-800">✓ Deep Child Category Selected!</h3>
                                <p className="text-xl font-semibold text-gray-900 mt-1">
                                    {deepChildCategories.find(d => d.documentId === formData.deepChildCategoryId)?.firstTitle || "Unknown"}
                                </p>
                                <p className="text-sm text-gray-600 mt-1">
                                    Local ID: <span className="font-bold">{formData.localId}</span>
                                </p>
                            </div>
                            <div className="rounded-full bg-green-100 px-4 py-2">
                                <span className="text-sm font-medium text-green-800">Ready to Add Sub Content</span>
                            </div>
                        </div>
                    </div>

                    {/* CONTENT FORM */}
                    <div className="mb-6 space-y-6">
                        {/* CONTENT SECTION */}
                        <div className="space-y-4 rounded-lg border border-gray-300 bg-white p-4">
                            <h3 className="font-bold text-gray-900 border-b pb-2">Content Details</h3>

                            {/* First Headline */}
                            <div className="rounded-md border border-gray-200 bg-gray-50 p-4">
                                <div className="flex items-center justify-between mb-2">
                                    <label className="block font-semibold text-gray-900">First Headline *</label>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-medium text-gray-700">Visibility</span>
                                        <button
                                            onClick={() => handleToggle('firstTitleVisible')}
                                            className={`w-10 h-5 rounded-full flex items-center justify-start p-1 transition-colors duration-200 ${formData.firstTitleVisible ? 'bg-blue-600 justify-end' : 'bg-gray-400 justify-start'
                                                }`}
                                        >
                                            <div className={`bg-white w-3 h-3 rounded-full shadow-md transform transition-transform duration-200 ${formData.firstTitleVisible ? 'translate-x-5' : 'translate-x-0'
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

                            {/* Second Headline */}
                            <div className="rounded-md border border-gray-200 bg-gray-50 p-4">
                                <div className="flex items-center justify-between mb-2">
                                    <label className="block font-semibold text-gray-900">Second Headline *</label>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-medium text-gray-700">Visibility</span>
                                        <button
                                            onClick={() => handleToggle('secondTitleVisible')}
                                            className={`w-10 h-5 rounded-full flex items-center justify-start p-1 transition-colors duration-200 ${formData.secondTitleVisible ? 'bg-blue-600 justify-end' : 'bg-gray-400 justify-start'
                                                }`}
                                        >
                                            <div className={`bg-white w-3 h-3 rounded-full shadow-md transform transition-transform duration-200 ${formData.secondTitleVisible ? 'translate-x-5' : 'translate-x-0'
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

                            {/* Description */}
                            <div className="rounded-md border border-gray-200 bg-gray-50 p-4">
                                <div className="flex items-center justify-between mb-2">
                                    <label className="block font-semibold text-gray-900">Description *</label>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-medium text-gray-700">Visibility</span>
                                        <button
                                            onClick={() => handleToggle('descriptionVisible')}
                                            className={`w-10 h-5 rounded-full flex items-center justify-start p-1 transition-colors duration-200 ${formData.descriptionVisible ? 'bg-blue-600 justify-end' : 'bg-gray-400 justify-start'
                                                }`}
                                        >
                                            <div className={`bg-white w-3 h-3 rounded-full shadow-md transform transition-transform duration-200 ${formData.descriptionVisible ? 'translate-x-5' : 'translate-x-0'
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

                            {/* Webview URL */}
                            <div className="rounded-md border border-gray-200 bg-gray-50 p-4">
                                <div className="flex items-center justify-between mb-2">
                                    <label className="block font-semibold text-gray-900">Webview URL</label>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-medium text-gray-700">Visibility</span>
                                        <button
                                            onClick={() => handleToggle('webviewUrlVisible')}
                                            className={`w-10 h-5 rounded-full flex items-center justify-start p-1 transition-colors duration-200 ${formData.webviewUrlVisible ? 'bg-blue-600 justify-end' : 'bg-gray-400 justify-start'
                                                }`}
                                        >
                                            <div className={`bg-white w-3 h-3 rounded-full shadow-md transform transition-transform duration-200 ${formData.webviewUrlVisible ? 'translate-x-5' : 'translate-x-0'
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

                        {/* PRICING SECTION */}
                        <div className="space-y-4 rounded-lg border border-gray-300 bg-white p-4">
                            <h3 className="font-bold text-gray-900 border-b pb-2">Pricing Details</h3>

                            {/* Original Price */}
                            <div className="rounded-md border border-gray-200 bg-gray-50 p-4">
                                <div className="flex items-center justify-between mb-2">
                                    <label className="block font-semibold text-gray-900">Original Price *</label>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-medium text-gray-700">Visibility</span>
                                        <button
                                            onClick={() => handleToggle('originalPriceVisible')}
                                            className={`w-10 h-5 rounded-full flex items-center justify-start p-1 transition-colors duration-200 ${formData.originalPriceVisible ? 'bg-blue-600 justify-end' : 'bg-gray-400 justify-start'
                                                }`}
                                        >
                                            <div className={`bg-white w-3 h-3 rounded-full shadow-md transform transition-transform duration-200 ${formData.originalPriceVisible ? 'translate-x-5' : 'translate-x-0'
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
                                        required
                                    />
                                </div>
                            </div>

                            {/* Discount */}
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

                            {/* GST */}
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

                            {/* Price Summary */}
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

                        {/* DELIVERY TIME */}
                        <div className="space-y-4 rounded-lg border border-gray-300 bg-white p-4">
                            <div className="flex items-center justify-between">
                                <h3 className="font-bold text-gray-900">Delivery Time</h3>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-medium text-gray-700">Visibility</span>
                                    <button
                                        onClick={() => handleToggle('deliveryTimeVisible')}
                                        className={`w-10 h-5 rounded-full flex items-center justify-start p-1 transition-colors duration-200 ${formData.deliveryTimeVisible ? 'bg-blue-600 justify-end' : 'bg-gray-400 justify-start'
                                            }`}
                                    >
                                        <div className={`bg-white w-3 h-3 rounded-full shadow-md transform transition-transform duration-200 ${formData.deliveryTimeVisible ? 'translate-x-5' : 'translate-x-0'
                                            }`}></div>
                                    </button>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="rounded-md border border-gray-200 bg-gray-50 p-4">
                                    <label className="block font-semibold text-gray-900 mb-2 flex items-center gap-2">
                                        <Clock size={16} />
                                        Min Time (minutes)
                                    </label>
                                    <input
                                        type="number"
                                        name="minTime"
                                        value={formData.minTime}
                                        onChange={handleChange}
                                        className="w-full rounded-md border-2 border-blue-900 px-3 py-2"
                                        placeholder="Minimum time"
                                        min="0"
                                    />
                                </div>
                                <div className="rounded-md border border-gray-200 bg-gray-50 p-4">
                                    <label className="block font-semibold text-gray-900 mb-2 flex items-center gap-2">
                                        <Clock size={16} />
                                        Max Time (minutes)
                                    </label>
                                    <input
                                        type="number"
                                        name="maxTime"
                                        value={formData.maxTime}
                                        onChange={handleChange}
                                        className="w-full rounded-md border-2 border-blue-900 px-3 py-2"
                                        placeholder="Maximum time"
                                        min="0"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* MEDIA UPLOADS */}
                        <div className="space-y-4 rounded-lg border-2 border-blue-900 bg-white p-4">
                            <h3 className="font-bold text-gray-900 border-b pb-2">Media Uploads</h3>

                            {/* Photo Upload */}
                            <div className="rounded-md border border-gray-300 p-4">
                                <div className="flex items-center justify-between mb-3">
                                    <div>
                                        <label className="block font-medium text-gray-900">Photo Upload</label>
                                        <p className="text-xs text-gray-500">Size: 100dp x 120dp</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-medium text-gray-700">Visibility</span>
                                        <button
                                            onClick={() => handleToggle('photoVisible')}
                                            className={`w-10 h-5 rounded-full flex items-center justify-start p-1 transition-colors duration-200 ${formData.photoVisible ? 'bg-blue-600 justify-end' : 'bg-gray-400 justify-start'
                                                }`}
                                        >
                                            <div className={`bg-white w-3 h-3 rounded-full shadow-md transform transition-transform duration-200 ${formData.photoVisible ? 'translate-x-5' : 'translate-x-0'
                                                }`}></div>
                                        </button>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
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
                                            ✓ Photo selected
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Video Upload */}
                            <div className="rounded-md border border-gray-300 p-4">
                                <div className="flex items-center justify-between mb-3">
                                    <label className="block font-medium text-gray-900">Video Upload</label>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-medium text-gray-700">Visibility</span>
                                        <button
                                            onClick={() => handleToggle('videoVisible')}
                                            className={`w-10 h-5 rounded-full flex items-center justify-start p-1 transition-colors duration-200 ${formData.videoVisible ? 'bg-blue-600 justify-end' : 'bg-gray-400 justify-start'
                                                }`}
                                        >
                                            <div className={`bg-white w-3 h-3 rounded-full shadow-md transform transition-transform duration-200 ${formData.videoVisible ? 'translate-x-5' : 'translate-x-0'
                                                }`}></div>
                                        </button>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
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
                                            ✓ Video selected
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* SAVE BUTTON */}
                    <div className="flex justify-end">
                        <button
                            onClick={handleSave}
                            className="flex items-center gap-2 rounded-lg bg-red-600 hover:bg-red-700 px-6 py-3 font-bold text-white transition-all hover:scale-105 active:scale-95 shadow-lg"
                        >
                            <Save size={20} />
                            Save Sub Deep Child Category
                        </button>
                    </div>
                </>
            )}

            {/* IF NO DEEP CHILD SELECTED YET */}
            {!shouldShowContentFields && formData.childCategoryId && (
                <div className="mb-6 rounded-md border-2 border-yellow-600 bg-yellow-50 p-4">
                    <p className="text-yellow-800">
                        <strong>Almost there!</strong> Please select a deep child category from the dropdown above to add content.
                    </p>
                </div>
            )}
        </div>
    );
};

export default SubDeepChildCategoryForm;