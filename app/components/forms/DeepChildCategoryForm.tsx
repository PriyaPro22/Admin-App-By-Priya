
    // "use client";

    // import React, { useEffect, useMemo, useState, useRef } from "react";
    // import { Save } from "lucide-react";
    // import { useCategory } from "../../context/CategoryContext";
    // import { generateCategoryId } from "../../utils/generateCategoryId";

    // interface DeepChildCategoryFormProps {
    //     initialChildCategoryId?: string | null;
    //     onSuccess?: () => void;
    // }

    // const DeepChildCategoryForm: React.FC<DeepChildCategoryFormProps> = ({ initialChildCategoryId, onSuccess }) => {
    //     const context = useCategory();

    //     if (!context) {
    //         return <div className="p-4 text-red-500">Error: Category Context not found.</div>;
    //     }

    //     const { addDeepChildCategory, mainCategories } = context;

    //     // ✅ MAIN VISIBILITY TOGGLE
    //     const [isVisible, setIsVisible] = useState(true);

    //     const [formData, setFormData] = useState({
    //         mainCategoryId: "",
    //         subCategoryId: "",
    //         childCategoryId: initialChildCategoryId || "",
    //         firstTitle: "",
    //         firstTitleVisible: true,
    //         secondTitle: "",
    //         secondTitleVisible: true,
    //         description: "",
    //         descriptionVisible: true,
    //         webviewUrl: "",
    //         webviewUrlVisible: true,
    //         photo: null as File | null,
    //         photoVisible: true,
    //         video: null as File | null,
    //         videoVisible: true
    //     });

    //     // ✅ STATE VARIABLES
    //     const [mainSearch, setMainSearch] = useState("");
    //     const [mainOpen, setMainOpen] = useState(false);
    //     const [selectedMainCategory, setSelectedMainCategory] = useState<any>(null);

    //     const [subCategories, setSubCategories] = useState<any[]>([]);
    //     const [subSearch, setSubSearch] = useState("");
    //     const [subOpen, setSubOpen] = useState(false);

    //     const [childCategoriesLocal, setChildCategoriesLocal] = useState<any[]>([]);
    //     const [childSearch, setChildSearch] = useState("");
    //     const [childOpen, setChildOpen] = useState(false);
    //     const [selectedChildCategory, setSelectedChildCategory] = useState<any>(null);
    //     const [hasChildSelected, setHasChildSelected] = useState(false);

    //     // ✅ REFS FOR CLICK HANDLING
    //     const mainDropdownRef = useRef<HTMLDivElement>(null);
    //     const subDropdownRef = useRef<HTMLDivElement>(null);
    //     const childDropdownRef = useRef<HTMLDivElement>(null);
    //     const mainInputRef = useRef<HTMLInputElement>(null);
    //     const subInputRef = useRef<HTMLInputElement>(null);
    //     const childInputRef = useRef<HTMLInputElement>(null);

    //     // ✅ CLICK OUTSIDE HANDLER
    //     useEffect(() => {
    //         const handleClickOutside = (event: MouseEvent) => {
    //             // Main dropdown
    //             if (mainOpen && mainDropdownRef.current && 
    //                 !mainDropdownRef.current.contains(event.target as Node) &&
    //                 !mainInputRef.current?.contains(event.target as Node)) {
    //                 setMainOpen(false);
    //             }
                
    //             // Sub dropdown
    //             if (subOpen && subDropdownRef.current && 
    //                 !subDropdownRef.current.contains(event.target as Node) &&
    //                 !subInputRef.current?.contains(event.target as Node)) {
    //                 setSubOpen(false);
    //             }
                
    //             // Child dropdown
    //             if (childOpen && childDropdownRef.current && 
    //                 !childDropdownRef.current.contains(event.target as Node) &&
    //                 !childInputRef.current?.contains(event.target as Node)) {
    //                 setChildOpen(false);
    //             }
    //         };

    //         document.addEventListener('mousedown', handleClickOutside);
    //         return () => {
    //             document.removeEventListener('mousedown', handleClickOutside);
    //         };
    //     }, [mainOpen, subOpen, childOpen]);

    //     // ✅ MAIN CATEGORY SELECT HANDLER
    //     const handleMainSelect = (cat: any) => {
    //         console.log("✅ MAIN CATEGORY SELECTED:", cat);

    //         setMainSearch(cat.name);
    //         setMainOpen(false);
    //         setSelectedMainCategory(cat);

    //         setFormData(prev => ({
    //             ...prev,
    //             mainCategoryId: cat._id || cat.documentId,
    //             subCategoryId: "",
    //             childCategoryId: "",
    //             firstTitle: "",
    //             secondTitle: "",
    //             description: "",
    //             webviewUrl: "",
    //             photo: null,
    //             video: null
    //         }));

    //         // Reset all
    //         setSubCategories([]);
    //         setSubSearch("");
    //         setChildCategoriesLocal([]);
    //         setChildSearch("");
    //         setSelectedChildCategory(null);
    //         setHasChildSelected(false);
    //     };

    //     // ✅ SUB CATEGORY API
    //     useEffect(() => {
    //         if (!selectedMainCategory) return;

    //         if (selectedMainCategory.hasSubCategory !== true) {
    //             console.log("ℹ️ Main category has NO subcategories");
    //             setSubCategories([]);
    //             setSubSearch("");
    //             setFormData(prev => ({ ...prev, subCategoryId: "" }));
    //             return;
    //         }

    //         console.log("👀 Fetching subcategories for main:", selectedMainCategory._id);

    //         const fetchSubCategoriesAPI = async () => {
    //             try {
    //                 const token = localStorage.getItem("token");
    //                 const url = `https://api.bijliwalaaya.in/api/product-listing/main/${selectedMainCategory._id}/sub`;
    //                 console.log("🚀 SUB CATEGORY API URL:", url);

    //                 const res = await fetch(url, {
    //                     headers: {
    //                         Authorization: token ? `Bearer ${token}` : "",
    //                         "x-api-token": "super_secure_token",
    //                         "Content-Type": "application/json",
    //                     },
    //                 });

    //                 const json = await res.json();
    //                 console.log("🔥 RAW SUB CATEGORY RESPONSE:", json);

    //                 const rawData = json?.data || {};
    //                 const list = Object.entries(rawData).map(
    //                     ([_, value]: any) => ({
    //                         documentId: value.documentId,
    //                         name: value.name,
    //                     })
    //                 );

    //                 console.log("✅ FINAL SUB CATEGORY LIST:", list);
    //                 setSubCategories(list);
    //             } catch (err) {
    //                 console.error("❌ Sub category API failed", err);
    //                 setSubCategories([]);
    //             }
    //         };

    //         fetchSubCategoriesAPI();
    //     }, [selectedMainCategory]);

    //     // ✅ CHILD CATEGORY API
    //     useEffect(() => {
    //         if (!formData.mainCategoryId) {
    //             setChildCategoriesLocal([]);
    //             return;
    //         }

    //        // If main category has NO subcategories, fetch direct child categories
    // if (selectedMainCategory?.hasSubCategory !== true) {
    //     console.log("👀 Fetching child categories directly for main:", formData.mainCategoryId);

    //     const fetchChildCategoriesDirect = async () => {
    //         try {
    //             const token = localStorage.getItem("token");
    //             const url = `https://api.bijliwalaaya.in/api/product-listing/main/${formData.mainCategoryId}/child`;
    //             console.log("🚀 DIRECT CHILD CATEGORY API URL:", url);

    //             const res = await fetch(url, {
    //                 headers: {
    //                     Authorization: token ? `Bearer ${token}` : "",
    //                     "x-api-token": "super_secure_token",
    //                     "Content-Type": "application/json",
    //                 },
    //             });

    //             const json = await res.json();
    //             console.log("🔥 RAW DIRECT CHILD CATEGORY RESPONSE:", json);

    //             // ✅ CORRECT MAPPING (ID COMES FROM KEY)
    //            const rawData = json?.data || {};

    // const list = Object.entries(rawData).map(
    //   ([key, value]: any) => ({
    //     name: key, // ✅ NAME HI ID HAI
    //   })
    // );

    // console.log("✅ FINAL DIRECT CHILD CATEGORY LIST:", list);
    // setChildCategoriesLocal(list);


    //         } catch (err) {
    //             console.error("❌ Direct child category API failed", err);
    //             setChildCategoriesLocal([]);
    //         }
    //     };

    //     fetchChildCategoriesDirect();
    // }

    //         // If main has subcategories AND subcategory is selected
    //         else if (formData.subCategoryId) {
    //             console.log("👀 Fetching child categories for sub:", formData.subCategoryId);

    //             const fetchChildCategoriesAPI = async () => {
    //                 try {
    //                     const token = localStorage.getItem("token");
    //                     const url = `https://api.bijliwalaaya.in/api/product-listing/main/${formData.mainCategoryId}/sub/${formData.subCategoryId}/child`;
    //                     console.log("🚀 CHILD CATEGORY API URL:", url);

    //                     const res = await fetch(url, {
    //                         headers: {
    //                             Authorization: token ? `Bearer ${token}` : "",
    //                             "x-api-token": "super_secure_token",
    //                             "Content-Type": "application/json",
    //                         },
    //                     });

    //                     const json = await res.json();
    //                     console.log("🔥 RAW CHILD CATEGORY RESPONSE:", json);

    //                     const rawData = json?.data || {};
    //                     const list = Object.entries(rawData).map(
    //                         ([_, value]: any) => ({
    //                             documentId: value.documentId,
    //                             name: value.name,
    //                         })
    //                     );

    //                     console.log("✅ FINAL CHILD CATEGORY LIST:", list);
    //                     setChildCategoriesLocal(list);
    //                 } catch (err) {
    //                     console.error("❌ Child category API failed", err);
    //                     setChildCategoriesLocal([]);
    //                 }
    //             };

    //             fetchChildCategoriesAPI();
    //         } else {
    //             setChildCategoriesLocal([]);
    //         }
    //     }, [formData.subCategoryId, formData.mainCategoryId, selectedMainCategory]);

    //     // ✅ FILTERED LISTS
    //     const filteredMainCategories = useMemo(() => {
    //         if (!mainSearch) return [];
    //         return mainCategories.filter(cat =>
    //             cat.name.toLowerCase().includes(mainSearch.toLowerCase())
    //         );
    //     }, [mainSearch, mainCategories]);

    //     const filteredSubCategories = useMemo(() => {
    //         if (!subSearch) return subCategories;
    //         return subCategories.filter(sub =>
    //             sub.name.toLowerCase().includes(subSearch.toLowerCase())
    //         );
    //     }, [subSearch, subCategories]);

    //     const filteredChildCategoriesLocal = useMemo(() => {
    //         if (!childSearch) return childCategoriesLocal;
    //         return childCategoriesLocal.filter(child =>
    //             child.name.toLowerCase().includes(childSearch.toLowerCase())
    //         );
    //     }, [childSearch, childCategoriesLocal]);

    //     // ✅ HANDLERS
    //     const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    //         const { name, value } = e.target;
    //         setFormData(prev => ({
    //             ...prev,
    //             [name]: value
    //         }));
    //     };

    //     // ✅ TOGGLE HANDLER - FIXED
    //     const handleToggle = (field: string) => {
    //         setFormData(prev => ({
    //             ...prev,
    //             [field]: !prev[field as keyof typeof prev]
    //         }));
    //     };

    //     const handleMainVisibilityToggle = () => {
    //         setIsVisible(prev => !prev);
    //         console.log("Deep Child Visibility Toggled:", !isVisible);
    //     };

    //     const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'photo' | 'video') => {
    //         if (e.target.files && e.target.files[0]) {
    //             setFormData(prev => ({ ...prev, [type]: e.target.files![0] }));
    //         }
    //     };

    //     // ✅ SUB CATEGORY SELECT HANDLER
    //     const handleSubSelect = (sub: any) => {
    //         console.log("✅ SUB CATEGORY SELECTED:", sub);
    //         setSubSearch(sub.name);
    //         setSubOpen(false);
    //         setFormData(prev => ({
    //             ...prev,
    //             subCategoryId: sub.documentId,
    //             childCategoryId: ""
    //         }));
    //         setChildSearch("");
    //         setSelectedChildCategory(null);
    //         setHasChildSelected(false);
    //         setChildCategoriesLocal([]);
    //     };

    //     // ✅ CHILD CATEGORY SELECT HANDLER
    // const handleChildSelect = (child: any) => {
    //   if (!child?.name) return;

    //   const localId = generateCategoryId(child.name);

    //   setSelectedChildCategory({
    //     documentId: localId,
    //     name: child.name
    //   });

    //   setFormData(prev => ({
    //     ...prev,
    //     childCategoryId: localId
    //   }));

    //   setChildSearch("");      // ✅ SEARCH CLEAR
    //   setChildOpen(false);     // ✅ DROPDOWN CLOSE
    //   setHasChildSelected(true);
    // };




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

    //         if (!formData.childCategoryId || !selectedChildCategory) {
    //             alert("Select child category");
    //             return;
    //         }

    //         if (!formData.firstTitle.trim() || !formData.secondTitle.trim() || !formData.description.trim()) {
    //             alert("Please fill in all required fields (First Headline, Second Headline, Description).");
    //             return;
    //         }

    //  addDeepChildCategory({
    //   mainCategoryId: formData.mainCategoryId,
    //   subCategoryId: formData.subCategoryId || null,

    //   childCategory: {
    //     documentId: selectedChildCategory.documentId, // ✅ LOCAL ID
    //     name: selectedChildCategory.name               // ✅ DISPLAY NAME
    //   },

    //   firstTitle: formData.firstTitle,
    //   secondTitle: formData.secondTitle,
    //   description: formData.description,
    //   visible: isVisible,
    //   webviewUrl: formData.webviewUrl,

    //   firstTitleVisible: formData.firstTitleVisible,
    //   secondTitleVisible: formData.secondTitleVisible,
    //   descriptionVisible: formData.descriptionVisible,
    //   webviewUrlVisible: formData.webviewUrlVisible,

    //   photo: formData.photo,
    //   video: formData.video,
    //   photoVisible: formData.photoVisible,
    //   videoVisible: formData.videoVisible
    // });


    //         alert("Deep Child Category Added!");

    //         if (onSuccess) onSuccess();
    //     };

    //     // ✅ Condition for showing content fields
    //     const shouldShowContentFields = hasChildSelected && selectedChildCategory;

    //     return (
    //         <div className="rounded-lg border border-green-500 bg-gray-200 p-4 shadow-md">
    //             {/* HEADER WITH VISIBILITY TOGGLE */}
    //             <div className="mb-4 flex items-center justify-between rounded-md border-2 border-blue-900 bg-white px-4 py-2">
    //                 <span className="font-bold text-gray-900">
    //                     Manage Deep child category
    //                 </span>
    //                 <div className="flex items-center gap-2">
    //                     <span className="text-sm font-semibold text-gray-700">
    //                         Visibility
    //                     </span>
    //                     <div
    //                         onClick={handleMainVisibilityToggle}
    //                         className={`relative inline-block h-6 w-12 cursor-pointer rounded-full transition-colors duration-200
    //                             ${isVisible ? "bg-green-500" : "bg-gray-300"}
    //                         `}
    //                     >
    //                         <div
    //                             className={`absolute top-0 h-6 w-6 rounded-full bg-white shadow-md transition-transform duration-200
    //                                 ${isVisible ? "translate-x-6" : "translate-x-0"}
    //                             `}
    //                         />
    //                     </div>
    //                 </div>
    //             </div>

    //             {/* HIERARCHICAL SELECTION */}
    //             <div className="mb-6 space-y-4">
    //                 {/* MAIN CATEGORY */}
    //                 <div className="relative">
    //                     <label className="mb-2 block font-bold text-gray-900">Select Main Category *</label>
    //                     <input
    //                         ref={mainInputRef}
    //                         type="text"
    //                         value={mainSearch}
    //                         placeholder="Search main category..."
    //                         onChange={(e) => {
    //                             setMainSearch(e.target.value);
    //                             setMainOpen(true);
    //                         }}
    //                         onFocus={() => setMainOpen(true)}
    //                         className="w-full rounded-md border-2 border-blue-900 px-3 py-2"
    //                     />

    //                     {mainOpen && (
    //                         <div ref={mainDropdownRef} className="absolute z-50 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
    //                             {filteredMainCategories.length > 0 ? (
    //                                 filteredMainCategories.map(cat => (
    //                                     <div
    //                                         key={cat._id}
    //                                         className="cursor-pointer px-4 py-3 hover:bg-blue-50 border-b border-gray-100 last:border-b-0"
    //                                         onMouseDown={(e) => {
    //                                             e.preventDefault(); // Prevent blur
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

    //                 {/* SUB CATEGORY (ONLY IF MAIN HAS SUBCATEGORY) */}
    //                 {selectedMainCategory?.hasSubCategory === true && (
    //                     <div className="relative">
    //                         <label className="mb-2 block font-bold text-gray-900">Select Sub Category *</label>
    //                         <input
    //                             ref={subInputRef}
    //                             type="text"
    //                             value={subSearch}
    //                             placeholder="Search sub category..."
    //                             onChange={(e) => {
    //                                 setSubSearch(e.target.value);
    //                                 setSubOpen(true);
    //                             }}
    //                             onFocus={() => setSubOpen(true)}
    //                             className="w-full rounded-md border-2 border-blue-900 px-3 py-2"
    //                         />

    //                         {subOpen && (
    //                             <div ref={subDropdownRef} className="absolute z-40 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
    //                                 {subCategories.length > 0 ? (
    //                                     subCategories.filter(sub => 
    //                                         sub.name.toLowerCase().includes(subSearch.toLowerCase())
    //                                     ).map(sub => (
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

    //                 {/* CHILD CATEGORY - SHOW ONLY WHEN MAIN HAS NO SUBCATEGORIES OR SUBCATEGORY IS SELECTED */}
    //                 {(selectedMainCategory?.hasSubCategory !== true || formData.subCategoryId) && (
    //                     <div className="relative">
    //                         <label className="mb-2 block font-bold text-gray-900">Select Child Category *</label>
    //                         <input
    //                             ref={childInputRef}
    //                             type="text"
    //                             value={childSearch}
    //                             placeholder="Search child category..."
    //                             onChange={(e) => {
    //                                 setChildSearch(e.target.value);
    //                                 setChildOpen(true);
    //                             }}
    //                             onFocus={() => setChildOpen(true)}
    //                             className="w-full rounded-md border-2 border-blue-900 px-3 py-2"
    //                         />

    //                         {childOpen && (
    //                             <div ref={childDropdownRef} className="absolute z-30 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
    //                                 {childCategoriesLocal.length > 0 ? (
    //                                     childCategoriesLocal.filter(child => 
    //                                         child.name.toLowerCase().includes(childSearch.toLowerCase())
    //                                     ).map(child => (
    //                                         <div
    //                                             key={child.documentId}
    //                                             className="cursor-pointer px-4 py-3 hover:bg-blue-50 border-b border-gray-100 last:border-b-0"
    //                                             onMouseDown={(e) => {
    //                                                 e.preventDefault(); // CRITICAL: Prevent blur before click
    //                                                 handleChildSelect(child);
    //                                             }}
    //                                         >
    //                                             <span className="font-medium">{child.name}</span>
    //                                             <span className="block text-xs text-gray-500 mt-1">
    //                                                 ID: {child.documentId}
    //                                             </span>
    //                                         </div>
    //                                     ))
    //                                 ) : (
    //                                     <div className="px-4 py-3 text-gray-500">
    //                                         {formData.subCategoryId || selectedMainCategory?.hasSubCategory !== true 
    //                                             ? "Loading child categories..." 
    //                                             : "Select subcategory first"}
    //                                     </div>
    //                                 )}
    //                             </div>
    //                         )}
    //                     </div>
    //                 )}
    //             </div>

    //             {/* DEBUG INFO - REMOVE IN PRODUCTION */}
    //             <div className="mb-4 rounded-md bg-yellow-50 p-3 border border-yellow-200">
    //                 <p className="text-sm text-yellow-800">
    //                     <strong>Debug Info:</strong> Child Selected: {selectedChildCategory ? "YES" : "NO"} | 
    //                     hasChildSelected: {hasChildSelected ? "YES" : "NO"} | 
    //                     Child ID: {formData.childCategoryId || "Not selected"} |
    //                     Toggles: Title1:{formData.firstTitleVisible?'ON':'OFF'} Title2:{formData.secondTitleVisible?'ON':'OFF'}
    //                 </p>
    //             </div>

    //             {/* CONTENT FIELDS - WILL SHOW WHEN CHILD IS SELECTED */}
    //             {shouldShowContentFields && (
    //                 <>
    //                     {/* SELECTED CHILD CATEGORY INFO */}
    //                     <div className="mb-6 rounded-md border-2 border-green-600 bg-green-50 p-4">
    //                         <div className="flex items-center justify-between">
    //                             <div>
    //                                 <h3 className="text-lg font-bold text-green-800">✓ Child Category Selected!</h3>
    //                                 <p className="text-xl font-semibold text-gray-900 mt-1">{selectedChildCategory?.name}</p>
    //                                 <p className="text-sm text-gray-600 mt-1">ID: {selectedChildCategory?.documentId}</p>
    //                             </div>
    //                             <div className="rounded-full bg-green-100 px-4 py-2">
    //                                 <span className="text-sm font-medium text-green-800">Ready to Add Content</span>
    //                             </div>
    //                         </div>
    //                     </div>

    //                     {/* CONTENT FORM */}
    //                     <div className="mb-6 space-y-4">
    //                         {/* First Headline */}
    //                         <div className="rounded-md border border-gray-300 bg-white p-4">
    //                             <div className="flex items-center justify-between mb-2">
    //                                 <label className="block font-semibold text-gray-900">First Headline *</label>
    //                                 <div className="flex items-center gap-2">
    //                                     <span className="text-xs font-medium text-gray-700">Visibility</span>
    //                                     <button 
    //                                         onClick={() => handleToggle('firstTitleVisible')} 
    //                                         className={`w-10 h-5 rounded-full flex items-center justify-start p-1 transition-colors duration-200 ${
    //                                             formData.firstTitleVisible ? 'bg-blue-600 justify-end' : 'bg-gray-400 justify-start'
    //                                         }`}
    //                                     >
    //                                         <div className={`bg-white w-3 h-3 rounded-full shadow-md transform transition-transform duration-200 ${
    //                                             formData.firstTitleVisible ? 'translate-x-5' : 'translate-x-0'
    //                                         }`}></div>
    //                                     </button>
    //                                 </div>
    //                             </div>
    //                             <input
    //                                 type="text"
    //                                 name="firstTitle"
    //                                 value={formData.firstTitle}
    //                                 onChange={handleChange}
    //                                 className="w-full rounded-md border-2 border-blue-900 px-3 py-2"
    //                                 placeholder="Enter First Headline"
    //                                 required
    //                             />
    //                         </div>

    //                         {/* Second Headline */}
    //                         <div className="rounded-md border border-gray-300 bg-white p-4">
    //                             <div className="flex items-center justify-between mb-2">
    //                                 <label className="block font-semibold text-gray-900">Second Headline *</label>
    //                                 <div className="flex items-center gap-2">
    //                                     <span className="text-xs font-medium text-gray-700">Visibility</span>
    //                                     <button 
    //                                         onClick={() => handleToggle('secondTitleVisible')} 
    //                                         className={`w-10 h-5 rounded-full flex items-center justify-start p-1 transition-colors duration-200 ${
    //                                             formData.secondTitleVisible ? 'bg-blue-600 justify-end' : 'bg-gray-400 justify-start'
    //                                         }`}
    //                                     >
    //                                         <div className={`bg-white w-3 h-3 rounded-full shadow-md transform transition-transform duration-200 ${
    //                                             formData.secondTitleVisible ? 'translate-x-5' : 'translate-x-0'
    //                                         }`}></div>
    //                                     </button>
    //                                 </div>
    //                             </div>
    //                             <input
    //                                 type="text"
    //                                 name="secondTitle"
    //                                 value={formData.secondTitle}
    //                                 onChange={handleChange}
    //                                 className="w-full rounded-md border-2 border-blue-900 px-3 py-2"
    //                                 placeholder="Enter Second Headline"
    //                                 required
    //                             />
    //                         </div>

    //                         {/* Description */}
    //                         <div className="rounded-md border border-gray-300 bg-white p-4">
    //                             <div className="flex items-center justify-between mb-2">
    //                                 <label className="block font-semibold text-gray-900">Description *</label>
    //                                 <div className="flex items-center gap-2">
    //                                     <span className="text-xs font-medium text-gray-700">Visibility</span>
    //                                     <button 
    //                                         onClick={() => handleToggle('descriptionVisible')} 
    //                                         className={`w-10 h-5 rounded-full flex items-center justify-start p-1 transition-colors duration-200 ${
    //                                             formData.descriptionVisible ? 'bg-blue-600 justify-end' : 'bg-gray-400 justify-start'
    //                                         }`}
    //                                     >
    //                                         <div className={`bg-white w-3 h-3 rounded-full shadow-md transform transition-transform duration-200 ${
    //                                             formData.descriptionVisible ? 'translate-x-5' : 'translate-x-0'
    //                                         }`}></div>
    //                                     </button>
    //                                 </div>
    //                             </div>
    //                             <textarea
    //                                 name="description"
    //                                 value={formData.description}
    //                                 onChange={handleChange}
    //                                 className="w-full rounded-md border-2 border-blue-900 px-3 py-2"
    //                                 placeholder="Enter Description"
    //                                 rows={4}
    //                                 required
    //                             />
    //                         </div>

    //                         {/* Webview URL */}
    //                         <div className="rounded-md border border-gray-300 bg-white p-4">
    //                             <div className="flex items-center justify-between mb-2">
    //                                 <label className="block font-semibold text-gray-900">Webview URL</label>
    //                                 <div className="flex items-center gap-2">
    //                                     <span className="text-xs font-medium text-gray-700">Visibility</span>
    //                                     <button 
    //                                         onClick={() => handleToggle('webviewUrlVisible')} 
    //                                         className={`w-10 h-5 rounded-full flex items-center justify-start p-1 transition-colors duration-200 ${
    //                                             formData.webviewUrlVisible ? 'bg-blue-600 justify-end' : 'bg-gray-400 justify-start'
    //                                         }`}
    //                                     >
    //                                         <div className={`bg-white w-3 h-3 rounded-full shadow-md transform transition-transform duration-200 ${
    //                                             formData.webviewUrlVisible ? 'translate-x-5' : 'translate-x-0'
    //                                         }`}></div>
    //                                     </button>
    //                                 </div>
    //                             </div>
    //                             <input
    //                                 type="text"
    //                                 name="webviewUrl"
    //                                 value={formData.webviewUrl}
    //                                 onChange={handleChange}
    //                                 className="w-full rounded-md border-2 border-blue-900 px-3 py-2"
    //                                 placeholder="Enter Webview URL (Optional)"
    //                             />
    //                         </div>

    //                         {/* Media Uploads */}
    //                         <div className="space-y-4 rounded-md border-2 border-blue-900 bg-white p-4">
    //                             <h3 className="font-bold text-gray-900">Media Uploads</h3>
                                
    //                             {/* Photo Upload */}
    //                             <div className="rounded-md border border-gray-300 p-3">
    //                                 <div className="flex items-center justify-between mb-2">
    //                                     <div>
    //                                         <label className="block font-medium text-gray-900">Photo Upload</label>
    //                                         <p className="text-xs text-gray-500">Recommended: 100dp x 120dp</p>
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
    //                             <div className="rounded-md border border-gray-300 p-3">
    //                                 <div className="flex items-center justify-between mb-2">
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
    //                             className="flex items-center gap-2 rounded-lg bg-green-600 hover:bg-green-700 px-6 py-3 font-bold text-white transition-all hover:scale-105 active:scale-95"
    //                         >
    //                             <Save size={20} />
    //                             Save Deep Child Category
    //                         </button>
    //                     </div>
    //                 </>
    //             )}

    //             {/* IF NO CHILD SELECTED YET */}
    //             {!shouldShowContentFields && formData.childCategoryId && (
    //                 <div className="mb-6 rounded-md border-2 border-yellow-600 bg-yellow-50 p-4">
    //                     <p className="text-yellow-800">
    //                         <strong>Almost there!</strong> Please select a child category from the dropdown above to add content.
    //                     </p>
    //                 </div>
    //             )}
    //         </div>
    //     );
    // };

    // export default DeepChildCategoryForm;
// "use client";

// import React, { useEffect, useMemo, useState, useRef } from "react";
// import { Save, Upload, IndianRupee, Clock, AlertCircle, RefreshCw } from "lucide-react";
// import { useCategory } from "../../context/CategoryContext";
// import { generateCategoryId } from "../../utils/generateCategoryId";

// interface DeepChildCategoryFormProps {
//     initialChildCategoryId?: string | null;
//     onSuccess?: () => void;
// }

// const DeepChildCategoryForm: React.FC<DeepChildCategoryFormProps> = ({ initialChildCategoryId, onSuccess }) => {
//     const context = useCategory();

//     if (!context) {
//         return <div className="p-4 text-red-500">Error: Category Context not found.</div>;
//     }

//     const { addDeepChildCategory, mainCategories, isLoadingMainCategories, error: categoryError } = context;

//     // ✅ Function to generate unique local ID (e.g., "Priya Singh_1gh4")
//     const generateLocalId = (title: string): string => {
//         // Remove special characters and spaces, keep only alphanumeric
//         const cleanTitle = title.replace(/[^a-zA-Z0-9]/g, '').substring(0, 10);
        
//         // Generate random 4-character alphanumeric
//         const randomChars = Math.random().toString(36).substring(2, 6);
        
//         return `${cleanTitle}_${randomChars}`;
//     };

//     // ✅ Normalize function for search
//    const normalizeString = (str?: string) =>
//   (str ?? "").toLowerCase().replace(/\s+/g, "");


//     // ✅ MAIN VISIBILITY TOGGLE
//     const [isVisible, setIsVisible] = useState(true);

   
//  const [formData, setFormData] = useState({
//   mainCategoryId: "",        
//   subCategoryId: "",        
//   childCategoryId: "",       

//   deepChildCategoryId: "",   
//   isDeepVisible : true,
//   firstTitle: "",
//   firstTitleVisible: true,
//   secondTitle: "",
//   secondTitleVisible: true,
//   description: "",
//   descriptionVisible: true,

//   webviewUrl: "",
//   webviewUrlVisible: true,

//   originalPrice: "",
//   originalPriceVisible: true,
//   discountType: "percentage",
//   discountValue: "",

//   gst: "0",
//   gstType: "include",

//   minTime: "",
//   minTimeVisible: true,
//   maxTime: "",
//   maxTimeVisible: true,

//   photo: null as File | null,
//   photoVisible: true,
//   video: null as File | null,
//   videoVisible: true,
// });



//     // ✅ STATE VARIABLES
//     const [mainSearch, setMainSearch] = useState("");
//     const [mainOpen, setMainOpen] = useState(false);
//     const [selectedMainCategory, setSelectedMainCategory] = useState<any>(null);

//     const [subCategories, setSubCategories] = useState<any[]>([]);
//     const [subSearch, setSubSearch] = useState("");
//     const [subOpen, setSubOpen] = useState(false);

//     const [childCategoriesLocal, setChildCategoriesLocal] = useState<any[]>([]);
//     const [childSearch, setChildSearch] = useState("");
//     const [childOpen, setChildOpen] = useState(false);
//     const [selectedChildCategory, setSelectedChildCategory] = useState<any>(null);
//     const [hasChildSelected, setHasChildSelected] = useState(false);

//     // ✅ GST OPTIONS
//     const gstOptions = ["0", "5", "12", "18", "28"];
//     const gstTypeOptions = [
//         { value: "include", label: "Include GST" },
//         { value: "exclude", label: "Exclude GST" }
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

//     // ✅ REFS FOR CLICK HANDLING
//     const mainDropdownRef = useRef<HTMLDivElement>(null);
//     const subDropdownRef = useRef<HTMLDivElement>(null);
//     const childDropdownRef = useRef<HTMLDivElement>(null);
//     const mainInputRef = useRef<HTMLInputElement>(null);
//     const subInputRef = useRef<HTMLInputElement>(null);
//     const childInputRef = useRef<HTMLInputElement>(null);

//     // ✅ CLICK OUTSIDE HANDLER
// useEffect(() => {
//   const handleClickOutside = (event: MouseEvent) => {
//     const target = event.target as Node;

//     if (
//       childOpen &&
//       childDropdownRef.current &&
//       !childDropdownRef.current.contains(target) &&
//       !childInputRef.current?.contains(target)
//     ) {
//       setChildOpen(false);
//     }
//   };

//   document.addEventListener("mousedown", handleClickOutside);

//   return () => {
//     document.removeEventListener("mousedown", handleClickOutside);
//   };
// }, [childOpen]);



//     // ✅ MAIN CATEGORY SELECT HANDLER
//    const handleMainSelect = (cat: any) => {
//   console.log("✅ MAIN SELECTED", cat._id);

//   setMainSearch(cat.name);
//   setMainOpen(false);
//   setSelectedMainCategory(cat);

//   setFormData(prev => ({
//     ...prev,
//     mainCategoryId: cat._id,   // ✅ ONLY BACKEND ID
//     subCategoryId: "",
//     childCategoryId: "",
//   }));

//   // UI reset
//   setSubSearch("");
//   setChildSearch("");
//   setHasChildSelected(false);
// };

//     // ✅ SUB CATEGORY API
//     useEffect(() => {
//         if (!selectedMainCategory) return;

//         if (selectedMainCategory.hasSubCategory !== true) {
//             console.log("ℹ️ Main category has NO subcategories");
//             setSubCategories([]);
//             setSubSearch("");
//             setFormData(prev => ({ ...prev, subCategoryId: "" }));
//             return;
//         }

//         console.log("👀 Fetching subcategories for main:", selectedMainCategory._id);

//         const fetchSubCategoriesAPI = async () => {
//             try {
//                 const token = localStorage.getItem("token");
//                 const url = `https://api.bijliwalaaya.in/api/product-listing/main/${selectedMainCategory._id}/sub`;
//                 console.log("🚀 SUB CATEGORY API URL:", url);

//                 const res = await fetch(url, {
//                     headers: {
//                         Authorization: token ? `Bearer ${token}` : "",
//                         "x-api-token": "super_secure_token",
//                         "Content-Type": "application/json",
//                     },
//                 });

//                 const json = await res.json();
//                 console.log("🔥 RAW SUB CATEGORY RESPONSE:", json);

//                 const rawData = json?.data || {};
//                 const list = Object.entries(rawData).map(
//                     ([_, value]: any) => ({
//                         documentId: value.documentId,
//                         name: value.name,
//                     })
//                 );

//                 console.log("✅ FINAL SUB CATEGORY LIST:", list);
//                 setSubCategories(list);
//             } catch (err) {
//                 console.error("❌ Sub category API failed", err);
//                 setSubCategories([]);
//             }
//         };

//         fetchSubCategoriesAPI();
//     }, [selectedMainCategory]);

//     // ✅ CHILD CATEGORY API
//     useEffect(() => {
//         if (!formData.mainCategoryId) {
//             setChildCategoriesLocal([]);
//             return;
//         }

//         // If main category has NO subcategories, fetch direct child categories
//         if (selectedMainCategory?.hasSubCategory !== true) {
//             console.log("👀 Fetching child categories directly for main:", formData.mainCategoryId);

//             const fetchChildCategoriesDirect = async () => {
//                 try {
//                     const token = localStorage.getItem("token");
//                     const url = `https://api.bijliwalaaya.in/api/product-listing/main/${formData.mainCategoryId}/child`;
//                     console.log("🚀 DIRECT CHILD CATEGORY API URL:", url);

//                     const res = await fetch(url, {
//                         headers: {
//                             Authorization: token ? `Bearer ${token}` : "",
//                             "x-api-token": "super_secure_token",
//                             "Content-Type": "application/json",
//                         },
//                     });

//                     const json = await res.json();
//                     console.log("🔥 RAW DIRECT CHILD CATEGORY RESPONSE:", json);

//                     const rawData = json?.data || {};
//                     const list = Object.entries(rawData).map(
//                         ([key, value]: any) => ({
//                             name: key,
//                         })
//                     );

//                     console.log("✅ FINAL DIRECT CHILD CATEGORY LIST:", list);
//                     setChildCategoriesLocal(list);
//                 } catch (err) {
//                     console.error("❌ Direct child category API failed", err);
//                     setChildCategoriesLocal([]);
//                 }
//             };

//             fetchChildCategoriesDirect();
//         }

//         // If main has subcategories AND subcategory is selected
//         else if (formData.subCategoryId) {
//             console.log("👀 Fetching child categories for sub:", formData.subCategoryId);

//             const fetchChildCategoriesAPI = async () => {
//                 try {
//                     const token = localStorage.getItem("token");
//                     const url = `https://api.bijliwalaaya.in/api/product-listing/main/${formData.mainCategoryId}/sub/${formData.subCategoryId}/child`;
//                     console.log("🚀 CHILD CATEGORY API URL:", url);

//                     const res = await fetch(url, {
//                         headers: {
//                             Authorization: token ? `Bearer ${token}` : "",
//                             "x-api-token": "super_secure_token",
//                             "Content-Type": "application/json",
//                         },
//                     });

//                     const json = await res.json();
//                     console.log("🔥 RAW CHILD CATEGORY RESPONSE:", json);

//                     const rawData = json?.data || {};
//                     const list = Object.entries(rawData).map(
//                         ([_, value]: any) => ({
//                             documentId: value.documentId,
//                             name: value.name,
//                         })
//                     );

//                     console.log("✅ FINAL CHILD CATEGORY LIST:", list);
//                     setChildCategoriesLocal(list);
//                 } catch (err) {
//                     console.error("❌ Child category API failed", err);
//                     setChildCategoriesLocal([]);
//                 }
//             };

//             fetchChildCategoriesAPI();
//         } else {
//             setChildCategoriesLocal([]);
//         }
//     }, [formData.subCategoryId, formData.mainCategoryId, selectedMainCategory]);

//     // ✅ GENERATE LOCAL ID WHEN FIRST TITLE CHANGES
//     useEffect(() => {
//         if (formData.firstTitle.trim()) {
//             const localId = generateLocalId(formData.firstTitle);
//             setFormData(prev => ({ ...prev, localId }));
//             console.log("✅ Generated Local ID:", localId);
//         }
//     }, [formData.firstTitle]);

//     // ✅ FILTERED LISTS
//  const filteredMainCategories = useMemo(() => {
//   if (!mainSearch?.trim()) return [];

//   return mainCategories.filter(cat =>
//     cat?.name &&
//     cat.name.toLowerCase().includes(mainSearch.toLowerCase())
//   );
// }, [mainSearch, mainCategories]);


//     const filteredSubCategories = useMemo(() => {
//         if (!subSearch.trim()) return subCategories;

//         return subCategories.filter(sub =>
//             normalizeString(sub.name).includes(normalizeString(subSearch))
//         );
//     }, [subSearch, subCategories]);

//    const filteredChildCategoriesLocal = useMemo(() => {
//   if (!childSearch) return childCategoriesLocal;

//   return childCategoriesLocal.filter(child => {
//     if (!child || !child.name) return false; // ✅ SAFETY
//     return child.name.toLowerCase().includes(childSearch.toLowerCase());
//   });
// }, [childSearch, childCategoriesLocal]);


//     // ✅ HANDLERS
//     // const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
//     //     const { name, value } = e.target;
//     //     setFormData(prev => ({
//     //         ...prev,
//     //         [name]: value
//     //     }));
//     // };
// const handleChange = (
//   e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
// ) => {
//   const { name, value } = e.target;

//   // 🔥 Fields that MUST stay numbers
//   const numberFields = [
//     "originalPrice",
//     "discountValue",
//     "gst",
//     "minTime",
//     "maxTime",
//   ];

//   setFormData(prev => ({
//     ...prev,
//     [name]: numberFields.includes(name)
//       ? value === "" ? "" : Number(value)
//       : value,
//   }));
// };

//     // ✅ TOGGLE HANDLER
//     const handleToggle = (field: string) => {
//         setFormData(prev => ({
//             ...prev,
//             [field]: !prev[field as keyof typeof prev]
//         }));
//     };

//     const handleMainVisibilityToggle = () => {
//         setIsVisible(prev => !prev);
//         console.log("Deep Child Visibility Toggled:", !isVisible);
//     };

//     const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'Image' | 'video') => {
//         if (e.target.files && e.target.files[0]) {
//             setFormData(prev => ({ ...prev, [type]: e.target.files![0] }));
//         }
//     };

//     // ✅ SUB CATEGORY SELECT HANDLER
// const handleSubSelect = (sub: any) => {
//   console.log("🟢 SUB RAW:", sub);

//   setSubSearch(sub.name);
//   setSubOpen(false);

//   setFormData(prev => ({
//     ...prev,
//     subCategoryId: sub.documentId, // ✅ REAL MONGO ID
//     childCategoryId: "",
//     localId: ""
//   }));
// };



//     // ✅ CHILD CATEGORY SELECT HANDLER
//     const handleChildSelect = (child: any) => {
//   if (!child?.name) return;

//   // ✅ USE EXISTING CHILD NODE NAME ONLY
//   setSelectedChildCategory({
//     name: child.name
//   });

//   setFormData(prev => ({
//     ...prev,
//     childCategoryId: child.name // ✅ Repair | Services | Installation
//   }));

//   setChildSearch(child.name);
//   setChildOpen(false);
//   setHasChildSelected(true);
// };


//     // ✅ SAVE HANDLER WITH ALL FIELDS
// // const handleSave = () => {
// //   if (!formData.mainCategoryId) {
// //     alert("Select main category");
// //     return;
// //   }

// //   if (selectedMainCategory?.hasSubCategory && !formData.subCategoryId) {
// //     alert("Select sub category");
// //     return;
// //   }

// //   if (!formData.childCategoryId) {
// //     alert("Select child category");
// //     return;
// //   }

// //   if (!formData.firstTitle.trim()) {
// //     alert("Enter first title");
// //     return;
// //   }

// //   // ✅ ONLY DEEP CHILD GETS NEW ID
// //   const deepChildId = generateCategoryId(formData.firstTitle);

// //   const deepChildData = {
// //     mainCategoryId: formData.mainCategoryId,
// //     subCategoryId: formData.subCategoryId || null,

// //     // ✅ EXISTING CHILD NODE
// //     childCategoryId: formData.childCategoryId, // Repair | Services | Installation

// //     // ✅ NEW DEEP CHILD NODE
// //     deepChildId,

// //     firstTitle: formData.firstTitle,
// //     secondTitle: formData.secondTitle,
// //     description: formData.description,
// //     visible: isVisible,
// //     webviewUrl: formData.webviewUrl,

// //     originalPrice: Number(formData.originalPrice),
// //     discountType: formData.discountType,
// //     discountValue: Number(formData.discountValue),
// //     gst: Number(formData.gst),
// //     gstType: formData.gstType,
// //     minTime: formData.minTime,
// //     maxTime: formData.maxTime,
// //     finalPrice,
// //     totalPrice,

// //     firstTitleVisible: formData.firstTitleVisible,
// //     secondTitleVisible: formData.secondTitleVisible,
// //     descriptionVisible: formData.descriptionVisible,
// //     webviewUrlVisible: formData.webviewUrlVisible,
// //     originalPriceVisible: formData.originalPriceVisible,
// //     minTimeVisible: formData.minTimeVisible,
// //     maxTimeVisible: formData.maxTimeVisible,

// //     photoVisible: formData.photoVisible,
// //     videoVisible: formData.videoVisible,
// //   };

// //   console.log("📦 ADDING DEEP CHILD INTO EXISTING CHILD:", deepChildData);
// //   addDeepChildCategory(deepChildData);
// // };



// // const calculateCurrentPrice = (priceAfterGst: number) => {
// //   let discount = Number(formData.discountValue) || 0;

// //   if (priceAfterGst <= 0) return 0;

// //   // 🔹 Percentage discount
// //   if (formData.discountType === "percentage") {
// //     discount = Math.min(discount, 100); // 🔥 hard cap
// //     const price = priceAfterGst - (priceAfterGst * discount) / 100;
// //     return Math.max(0, +price.toFixed(2));
// //   }

// //   // 🔹 Fixed discount
// //   const price = priceAfterGst - discount;
// //   return Math.max(0, +price.toFixed(2));
// // };
// const calculateCurrentPrice = (priceAfterGst: number) => {
//   if (!priceAfterGst) return 0;

//   let discount = Number(formData.discountValue) || 0;

//   // 🔹 Percentage discount
//   if (formData.discountType === "percentage") {
//     discount = Math.min(discount, 100);

//     // ✅ SINGLE MINUS ONLY
//     const price = priceAfterGst - (priceAfterGst * discount) / 100;

//     return Math.max(0, Math.round(price * 100) / 100);
//   }

//   // 🔹 Fixed discount
//   const price = priceAfterGst - discount;
//   return Math.max(0, Math.round(price * 100) / 100);
// };




// // const calculatePriceAfterGst = () => {
// //   const original = Number(formData.originalPrice) || 0;
// //   const gst = Number(formData.gst) || 0;

// //   if (original <= 0) return 0;

// //   // 🔹 GST already included
// //   if (formData.gstType === "inclusive") {
// //     return +original.toFixed(2);
// //   }

// //   // 🔹 GST exclusive → add GST
// //   const price = original + (original * gst) / 100;
// //   return +price.toFixed(2);
// // };



//     // ✅ Condition for showing content fields
//   const calculatePriceAfterGst = () => {
//   const original = Number(formData.originalPrice);
//   const gst = Number(formData.gst) || 0;

//   if (!original) return 0;

//   // ✅ GST already included
//   if (formData.gstType === "include") {
//     return original;
//   }

//   // ✅ GST exclusive
//   const price = original + (original * gst) / 100;

//   // 🔥 avoid floating bug
//   return Math.round(price * 100) / 100;
// };
 
   
//     const shouldShowContentFields = hasChildSelected && selectedChildCategory;
// const handleSave = () => {
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

//   // ✅ IDS
//   const deepChildId = generateCategoryId(formData.firstTitle);

//   // ✅ PRICE CALCULATION
//   const priceAfterGst = calculatePriceAfterGst();
//   const currentPrice = calculateCurrentPrice(priceAfterGst);
  

//   const deepChildData = {
//     mainCategoryId: formData.mainCategoryId,
//     subCategoryId: formData.subCategoryId || null,
//     childCategoryId: formData.childCategoryId,
//     deepChildId,

//     // 📝 CONTENT
//     firstTitle: formData.firstTitle,
//     secondTitle: formData.secondTitle,
//     description: formData.description,
//     deepCategoryVisible: formData.isDeepVisible,
//     webviewUrl: formData.webviewUrl,

//     // 💰 PRICING (ONLY REQUIRED)
//     originalPrice: Number(formData.originalPrice),
//     discountType: formData.discountType,
//     discountValue: Number(formData.discountValue),
//     gst: Number(formData.gst),
//     gstType: formData.gstType,

//     currentPrice,        // ✅ AFTER DISCOUNT
//     priceAfterGst,       // ✅ FINAL PRICE
//     currentPriceVisible: true,

//     // 👁️ VISIBILITY
//     firstTitleVisible: formData.firstTitleVisible,
//     secondTitleVisible: formData.secondTitleVisible,
//     descriptionVisible: formData.descriptionVisible,
//     webviewUrlVisible: formData.webviewUrlVisible,
//     originalPriceVisible: formData.originalPriceVisible,
//     minTimeVisible: formData.minTimeVisible,
//     maxTimeVisible: formData.maxTimeVisible,

//     ImageVisible: formData.ImageVisible,
//     videoVisible: formData.videoVisible,
//   };

//   console.log("📦 FINAL DATA GOING TO MONGO:", deepChildData);

//   addDeepChildCategory(deepChildData);
// };


//     // ✅ Function to refresh main categories
//     const refreshMainCategories = () => {
//         // You might need to implement this in your context
//         console.log("Refreshing main categories...");
//         window.location.reload(); // Simple reload for now
//     };

//     return (
//         <div className="rounded-lg border border-green-500 bg-gray-100 p-4 shadow-md">
//             {/* HEADER WITH VISIBILITY TOGGLE */}
//             <div className="mb-6 flex items-center justify-between rounded-md border-2 border-blue-900 bg-white px-4 py-3">
//                 <span className="text-xl font-bold text-gray-900">
//                     Manage Deep child category
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

//             {/* ERROR MESSAGE IF MAIN CATEGORIES FAILED TO LOAD */}
//             {categoryError && (
//                 <div className="mb-6 rounded-md border-2 border-red-500 bg-red-50 p-4">
//                     <div className="flex items-center justify-between">
//                         <div className="flex items-center gap-3">
//                             <AlertCircle className="text-red-600" size={24} />
//                             <div>
//                                 <h3 className="font-bold text-red-800">Failed to load main categories</h3>
//                                 <p className="text-red-600 text-sm mt-1">
//                                     Please check your internet connection and try again.
//                                 </p>
//                             </div>
//                         </div>
//                         <button
//                             onClick={refreshMainCategories}
//                             className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition-colors"
//                         >
//                             <RefreshCw size={16} />
//                             Retry
//                         </button>
//                     </div>
//                 </div>
//             )}

//             {/* HIERARCHICAL SELECTION */}
//             <div className="mb-6 space-y-6 rounded-lg border border-gray-300 bg-white p-4">
//                 <h3 className="font-bold text-gray-900 border-b pb-2">Category Selection</h3>
                
//                 {/* MAIN CATEGORY */}
//                 <div className="relative">
//                     <label className="mb-2 block font-bold text-gray-900">Select Main Category *</label>
//                     <input
//                         ref={mainInputRef}
//                         type="text"
//                         value={mainSearch}
//                         placeholder="Type to search main categories..."
//                         onChange={(e) => {
//                             setMainSearch(e.target.value);
//                             setMainOpen(true);
//                         }}
//                         onFocus={() => setMainOpen(true)}
//                         className="w-full rounded-md border-2 border-blue-900 px-3 py-2"
//                         disabled={isLoadingMainCategories}
//                     />

//                     {mainOpen && (
//                         <div ref={mainDropdownRef} className="absolute z-50 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
//                             {isLoadingMainCategories ? (
//                                 <div className="px-4 py-3 text-gray-500 flex items-center justify-center gap-2">
//                                     <RefreshCw className="animate-spin" size={16} />
//                                     Loading main categories...
//                                 </div>
//                             ) : mainCategories.length === 0 ? (
//                                 <div className="px-4 py-3 text-gray-500">
//                                     <div className="flex flex-col items-center justify-center p-4">
//                                         <AlertCircle className="text-gray-400 mb-2" size={24} />
//                                         <p className="text-center">No main categories available</p>
//                                         <p className="text-xs text-gray-500 mt-1 text-center">
//                                             Please check if categories exist in the system
//                                         </p>
//                                     </div>
//                                 </div>
//                             ) : filteredMainCategories.length > 0 ? (
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
                    
//                     {/* HELP TEXT */}
//                     <p className="text-xs text-gray-500 mt-1">
//                         {isLoadingMainCategories 
//                             ? "Loading main categories..." 
//                             : mainCategories.length === 0 
//                                 ? "No categories available. Please add main categories first."
//                                 : `Found ${mainCategories.length} main categories. Type to search.`
//                         }
//                     </p>
//                 </div>

//                 {/* SUB CATEGORY (ONLY IF MAIN HAS SUBCATEGORY) */}
//                 {selectedMainCategory?.hasSubCategory === true && (
//                     <div className="relative">
//                         <label className="mb-2 block font-bold text-gray-900">Select Sub Category *</label>
//     <input
//   ref={subInputRef}
//   type="text"
//   value={subSearch}
//   spellCheck={false}
//   placeholder="Search sub category..."
//   onClick={() => setSubOpen(true)}   // ✅ YAHI MAIN FIX HAI
//   onChange={(e) => {
//     setSubSearch(e.target.value);
//     setSubOpen(true);
//   }}
//   className="w-full rounded-md border-2 border-blue-900 px-3 py-2"
// />



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
//                         <input
//                             ref={childInputRef}
//                             type="text"
//                             value={childSearch}
//                             placeholder="Search child category..."
//                             onChange={(e) => {
//                                 setChildSearch(e.target.value);
//                                 setChildOpen(true);
//                             }}
//                             onFocus={() => setChildOpen(true)}
//                             className="w-full rounded-md border-2 border-blue-900 px-3 py-2"
//                         />

//                         {childOpen && (
//                             <div ref={childDropdownRef} className="absolute z-30 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
//                                 {childCategoriesLocal.length > 0 ? (
//                                    filteredChildCategoriesLocal.map(child => {
//   if (!child?.name) return null;

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
//     </div>
//   );
// })

//                                 ) : (
//                                     <div className="px-4 py-3 text-gray-500">
//                                         {formData.subCategoryId || selectedMainCategory?.hasSubCategory !== true 
//                                             ? "Loading child categories..." 
//                                             : "Select subcategory first"}
//                                     </div>
//                                 )}
//                             </div>
//                         )}
//                     </div>
//                 )}
//             </div>

//             {/* CONTENT FIELDS - WILL SHOW WHEN CHILD IS SELECTED */}
//             {shouldShowContentFields && (
//                 <>
//                     {/* SELECTED CHILD CATEGORY INFO */}
//                     <div className="mb-6 rounded-md border-2 border-green-600 bg-green-50 p-4">
//                         <div className="flex items-center justify-between">
//                             <div>
//                                 <h3 className="text-lg font-bold text-green-800">✓ Child Category Selected!</h3>
//                                 <p className="text-xl font-semibold text-gray-900 mt-1">{selectedChildCategory?.name}</p>
//                                 <p className="text-sm text-gray-600 mt-1">
//                                     Local ID: <span className="font-bold">{formData.localId}</span>
//                                 </p>
//                             </div>
//                             <div className="rounded-full bg-green-100 px-4 py-2">
//                                 <span className="text-sm font-medium text-green-800">Ready to Add Content</span>
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

//                         {/* DELIVERY TIME - FIXED AS PER IMAGE 3 */}
//                         <div className="space-y-4 rounded-lg border border-gray-300 bg-white p-4">
                           
//                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                                 {/* Min Time with Visibility Toggle */}
//                                 <div className="rounded-md border border-gray-200 bg-gray-50 p-4">
//                                     <div className="flex items-center justify-between mb-2">
//                                         <label className="block font-semibold text-gray-900 flex items-center gap-2">
//                                             <Clock size={16} />
//                                             Min Time (minutes)
//                                         </label>
//                                         <div className="flex items-center gap-2">
//                                             <span className="text-xs font-medium text-gray-700">Visibility</span>
//                                             <button 
//                                                 onClick={() => handleToggle('minTimeVisible')} 
//                                                 className={`w-10 h-5 rounded-full flex items-center justify-start p-1 transition-colors duration-200 ${
//                                                     formData.minTimeVisible ? 'bg-blue-600 justify-end' : 'bg-gray-400 justify-start'
//                                                 }`}
//                                             >
//                                                 <div className={`bg-white w-3 h-3 rounded-full shadow-md transform transition-transform duration-200 ${
//                                                     formData.minTimeVisible ? 'translate-x-5' : 'translate-x-0'
//                                                 }`}></div>
//                                             </button>
//                                         </div>
//                                     </div>
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
                                
//                                 {/* Max Time with Visibility Toggle */}
//                                 <div className="rounded-md border border-gray-200 bg-gray-50 p-4">
//                                     <div className="flex items-center justify-between mb-2">
//                                         <label className="block font-semibold text-gray-900 flex items-center gap-2">
//                                             <Clock size={16} />
//                                             Max Time (minutes)
//                                         </label>
//                                         <div className="flex items-center gap-2">
//                                             <span className="text-xs font-medium text-gray-700">Visibility</span>
//                                             <button 
//                                                 onClick={() => handleToggle('maxTimeVisible')} 
//                                                 className={`w-10 h-5 rounded-full flex items-center justify-start p-1 transition-colors duration-200 ${
//                                                     formData.maxTimeVisible ? 'bg-blue-600 justify-end' : 'bg-gray-400 justify-start'
//                                                 }`}
//                                             >
//                                                 <div className={`bg-white w-3 h-3 rounded-full shadow-md transform transition-transform duration-200 ${
//                                                     formData.maxTimeVisible ? 'translate-x-5' : 'translate-x-0'
//                                                 }`}></div>
//                                             </button>
//                                         </div>
//                                     </div>
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
//                                         <label className="block font-medium text-gray-900">Image Upload</label>
//                                         <p className="text-xs text-gray-500">Size: 100dp x 120dp</p>
//                                     </div>
//                                     <div className="flex items-center gap-2">
//                                         <span className="text-xs font-medium text-gray-700">Visibility</span>
//                                         <button 
//                                             onClick={() => handleToggle('ImageVisible')} 
//                                             className={`w-10 h-5 rounded-full flex items-center justify-start p-1 transition-colors duration-200 ${
//                                                 formData.ImageVisible ? 'bg-blue-600 justify-end' : 'bg-gray-400 justify-start'
//                                             }`}
//                                         >
//                                             <div className={`bg-white w-3 h-3 rounded-full shadow-md transform transition-transform duration-200 ${
//                                                 formData.ImageVisible ? 'translate-x-5' : 'translate-x-0'
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
//                                             onChange={(e) => handleFileChange(e, 'Image')} 
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
//                             className="flex items-center gap-2 rounded-lg bg-green-600 hover:bg-green-700 px-6 py-3 font-bold text-white transition-all hover:scale-105 active:scale-95 shadow-lg"
//                         >
//                             <Save size={20} />
//                             Save Deep Child Category
//                         </button>
//                     </div>
//                 </>
//             )}

//             {/* IF NO CHILD SELECTED YET */}
//             {!shouldShowContentFields && formData.childCategoryId && (
//                 <div className="mb-6 rounded-md border-2 border-yellow-600 bg-yellow-50 p-4">
//                     <p className="text-yellow-800">
//                         <strong>Almost there!</strong> Please select a child category from the dropdown above to add content.
//                     </p>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default DeepChildCategoryForm;





// "use client";

// import React, { useEffect, useMemo, useState, useRef } from "react";
// import { Save, Upload, IndianRupee, Clock, AlertCircle, RefreshCw } from "lucide-react";
// import { useCategory } from "../../context/CategoryContext";
// import { generateCategoryId } from "../../utils/generateCategoryId";

// interface DeepChildCategoryFormProps {
//     initialChildCategoryId?: string | null;
//     onSuccess?: () => void;
// }

// const DeepChildCategoryForm: React.FC<DeepChildCategoryFormProps> = ({ initialChildCategoryId, onSuccess }) => {
//     const context = useCategory();

//     if (!context) {
//         return <div className="p-4 text-red-500">Error: Category Context not found.</div>;
//     }

//     const { addDeepChildCategory, mainCategories, isLoadingMainCategories, error: categoryError } = context;

//     // ✅ Function to generate unique local ID (e.g., "Priya Singh_1gh4")
//     const generateLocalId = (title: string): string => {
//         // Remove special characters and spaces, keep only alphanumeric
//         const cleanTitle = title.replace(/[^a-zA-Z0-9]/g, '').substring(0, 10);
        
//         // Generate random 4-character alphanumeric
//         const randomChars = Math.random().toString(36).substring(2, 6);
        
//         return `${cleanTitle}_${randomChars}`;
//     };

//     // ✅ Normalize function for search
//    const normalizeString = (str?: string) =>
//   (str ?? "").toLowerCase().replace(/\s+/g, "");


//     // ✅ MAIN VISIBILITY TOGGLE
//     const [isVisible, setIsVisible] = useState(true);

   
//  const [formData, setFormData] = useState({
//   mainCategoryId: "",        
//   subCategoryId: "",        
//   childCategoryId: "",       

//   deepChildCategoryId: "",   
//   isDeepVisible: true,
//   firstTitle: "",
//   firstTitleVisible: true,
//   secondTitle: "",
//   secondTitleVisible: true,
//   description: "",
//   descriptionVisible: true,

//   webviewUrl: "",
//   webviewUrlVisible: true,

//   originalPrice: "",
//   originalPriceVisible: true,
//   discountType: "percentage",
//   discountValue: "",

//   gst: "0",
//   gstType: "include",

//   minTime: "",
//   minTimeVisible: true,
//   maxTime: "",
//   maxTimeVisible: true,

//   photo: null as File | null,
//   photoVisible: true,
//   video: null as File | null,
//   videoVisible: true,
// });



//     // ✅ STATE VARIABLES
//     const [mainSearch, setMainSearch] = useState("");
//     const [mainOpen, setMainOpen] = useState(false);
//     const [selectedMainCategory, setSelectedMainCategory] = useState<any>(null);

//     const [subCategories, setSubCategories] = useState<any[]>([]);
//     const [subSearch, setSubSearch] = useState("");
//     const [subOpen, setSubOpen] = useState(false);

//     const [childCategoriesLocal, setChildCategoriesLocal] = useState<any[]>([]);
//     const [childSearch, setChildSearch] = useState("");
//     const [childOpen, setChildOpen] = useState(false);
//     const [selectedChildCategory, setSelectedChildCategory] = useState<any>(null);
//     const [hasChildSelected, setHasChildSelected] = useState(false);

//     // ✅ GST OPTIONS
//     const gstOptions = ["0", "5", "12", "18", "28"];
//     const gstTypeOptions = [
//         { value: "include", label: "Include GST" },
//         { value: "exclude", label: "Exclude GST" }
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

//     // ✅ REFS FOR CLICK HANDLING
//     const mainDropdownRef = useRef<HTMLDivElement>(null);
//     const subDropdownRef = useRef<HTMLDivElement>(null);
//     const childDropdownRef = useRef<HTMLDivElement>(null);
//     const mainInputRef = useRef<HTMLInputElement>(null);
//     const subInputRef = useRef<HTMLInputElement>(null);
//     const childInputRef = useRef<HTMLInputElement>(null);

//     // ✅ CLICK OUTSIDE HANDLER
// useEffect(() => {
//   const handleClickOutside = (event: MouseEvent) => {
//     const target = event.target as Node;

//     if (
//       childOpen &&
//       childDropdownRef.current &&
//       !childDropdownRef.current.contains(target) &&
//       !childInputRef.current?.contains(target)
//     ) {
//       setChildOpen(false);
//     }
//   };

//   document.addEventListener("mousedown", handleClickOutside);

//   return () => {
//     document.removeEventListener("mousedown", handleClickOutside);
//   };
// }, [childOpen]);



//     // ✅ MAIN CATEGORY SELECT HANDLER
//    const handleMainSelect = (cat: any) => {
//   console.log("✅ MAIN SELECTED", cat._id);

//   setMainSearch(cat.name);
//   setMainOpen(false);
//   setSelectedMainCategory(cat);

//   setFormData(prev => ({
//     ...prev,
//     mainCategoryId: cat._id,   // ✅ ONLY BACKEND ID
//     subCategoryId: "",
//     childCategoryId: "",
//   }));

//   // UI reset
//   setSubSearch("");
//   setChildSearch("");
//   setHasChildSelected(false);
// };

//     // ✅ SUB CATEGORY API
//     useEffect(() => {
//         if (!selectedMainCategory) return;

//         if (selectedMainCategory.hasSubCategory !== true) {
//             console.log("ℹ️ Main category has NO subcategories");
//             setSubCategories([]);
//             setSubSearch("");
//             setFormData(prev => ({ ...prev, subCategoryId: "" }));
//             return;
//         }

//         console.log("👀 Fetching subcategories for main:", selectedMainCategory._id);

//         const fetchSubCategoriesAPI = async () => {
//             try {
//                 const token = localStorage.getItem("token");
//                 const url = `https://api.bijliwalaaya.in/api/product-listing/main/${selectedMainCategory._id}/sub`;
//                 console.log("🚀 SUB CATEGORY API URL:", url);

//                 const res = await fetch(url, {
//                     headers: {
//                         Authorization: token ? `Bearer ${token}` : "",
//                         "x-api-token": "super_secure_token",
//                         "Content-Type": "application/json",
//                     },
//                 });

//                 const json = await res.json();
//                 console.log("🔥 RAW SUB CATEGORY RESPONSE:", json);

//                 const rawData = json?.data || {};
//                 const list = Object.entries(rawData).map(
//                     ([_, value]: any) => ({
//                         documentId: value.documentId,
//                         name: value.name,
//                     })
//                 );

//                 console.log("✅ FINAL SUB CATEGORY LIST:", list);
//                 setSubCategories(list);
//             } catch (err) {
//                 console.error("❌ Sub category API failed", err);
//                 setSubCategories([]);
//             }
//         };

//         fetchSubCategoriesAPI();
//     }, [selectedMainCategory]);

//     // ✅ CHILD CATEGORY API
//     useEffect(() => {
//         if (!formData.mainCategoryId) {
//             setChildCategoriesLocal([]);
//             return;
//         }

//         // If main category has NO subcategories, fetch direct child categories
//         if (selectedMainCategory?.hasSubCategory !== true) {
//             console.log("👀 Fetching child categories directly for main:", formData.mainCategoryId);

//             const fetchChildCategoriesDirect = async () => {
//                 try {
//                     const token = localStorage.getItem("token");
//                     const url = `https://api.bijliwalaaya.in/api/product-listing/main/${formData.mainCategoryId}/child`;
//                     console.log("🚀 DIRECT CHILD CATEGORY API URL:", url);

//                     const res = await fetch(url, {
//                         headers: {
//                             Authorization: token ? `Bearer ${token}` : "",
//                             "x-api-token": "super_secure_token",
//                             "Content-Type": "application/json",
//                         },
//                     });

//                     const json = await res.json();
//                     console.log("🔥 RAW DIRECT CHILD CATEGORY RESPONSE:", json);

//                     const rawData = json?.data || {};
//                     const list = Object.entries(rawData).map(
//                         ([key, value]: any) => ({
//                             name: key,
//                         })
//                     );

//                     console.log("✅ FINAL DIRECT CHILD CATEGORY LIST:", list);
//                     setChildCategoriesLocal(list);
//                 } catch (err) {
//                     console.error("❌ Direct child category API failed", err);
//                     setChildCategoriesLocal([]);
//                 }
//             };

//             fetchChildCategoriesDirect();
//         }

//         // If main has subcategories AND subcategory is selected
//         else if (formData.subCategoryId) {
//             console.log("👀 Fetching child categories for sub:", formData.subCategoryId);

//             const fetchChildCategoriesAPI = async () => {
//                 try {
//                     const token = localStorage.getItem("token");
//                     const url = `https://api.bijliwalaaya.in/api/product-listing/main/${formData.mainCategoryId}/sub/${formData.subCategoryId}/child`;
//                     console.log("🚀 CHILD CATEGORY API URL:", url);

//                     const res = await fetch(url, {
//                         headers: {
//                             Authorization: token ? `Bearer ${token}` : "",
//                             "x-api-token": "super_secure_token",
//                             "Content-Type": "application/json",
//                         },
//                     });

//                     const json = await res.json();
//                     console.log("🔥 RAW CHILD CATEGORY RESPONSE:", json);

//                     const rawData = json?.data || {};
//                     const list = Object.entries(rawData).map(
//                         ([_, value]: any) => ({
//                             documentId: value.documentId,
//                             name: value.name,
//                         })
//                     );

//                     console.log("✅ FINAL CHILD CATEGORY LIST:", list);
//                     setChildCategoriesLocal(list);
//                 } catch (err) {
//                     console.error("❌ Child category API failed", err);
//                     setChildCategoriesLocal([]);
//                 }
//             };

//             fetchChildCategoriesAPI();
//         } else {
//             setChildCategoriesLocal([]);
//         }
//     }, [formData.subCategoryId, formData.mainCategoryId, selectedMainCategory]);

//     // ✅ GENERATE LOCAL ID WHEN FIRST TITLE CHANGES
//     useEffect(() => {
//         if (formData.firstTitle.trim()) {
//             const localId = generateLocalId(formData.firstTitle);
//             setFormData(prev => ({ ...prev, localId }));
//             console.log("✅ Generated Local ID:", localId);
//         }
//     }, [formData.firstTitle]);

//     // ✅ FILTERED LISTS
//  const filteredMainCategories = useMemo(() => {
//   if (!mainSearch?.trim()) return [];

//   return mainCategories.filter(cat =>
//     cat?.name &&
//     cat.name.toLowerCase().includes(mainSearch.toLowerCase())
//   );
// }, [mainSearch, mainCategories]);


//     const filteredSubCategories = useMemo(() => {
//         if (!subSearch.trim()) return subCategories;

//         return subCategories.filter(sub =>
//             normalizeString(sub.name).includes(normalizeString(subSearch))
//         );
//     }, [subSearch, subCategories]);

//    const filteredChildCategoriesLocal = useMemo(() => {
//   if (!childSearch) return childCategoriesLocal;

//   return childCategoriesLocal.filter(child => {
//     if (!child || !child.name) return false; // ✅ SAFETY
//     return child.name.toLowerCase().includes(childSearch.toLowerCase());
//   });
// }, [childSearch, childCategoriesLocal]);


//     // ✅ HANDLERS
//     const handleChange = (
//       e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
//     ) => {
//       const { name, value, type } = e.target;
      
//       // Handle number inputs correctly
//       if (type === 'number') {
//         setFormData(prev => ({
//           ...prev,
//           [name]: value === '' ? '' : Number(value)
//         }));
//       } else {
//         setFormData(prev => ({
//           ...prev,
//           [name]: value
//         }));
//       }
//     };

//     // ✅ TOGGLE HANDLER - FIXED FOR ALL VISIBILITY FIELDS
//     const handleToggle = (field: string) => {
//         setFormData(prev => ({
//             ...prev,
//             [field]: !prev[field as keyof typeof prev]
//         }));
//     };

//     const handleMainVisibilityToggle = () => {
//         setIsVisible(prev => !prev);
//         setFormData(prev => ({
//             ...prev,
//             isDeepVisible: !prev.isDeepVisible
//         }));
//         console.log("Deep Child Visibility Toggled:", !isVisible);
//     };

//     const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'photo' | 'video') => {
//         if (e.target.files && e.target.files[0]) {
//             setFormData(prev => ({ ...prev, [type]: e.target.files![0] }));
//         }
//     };

//     // ✅ SUB CATEGORY SELECT HANDLER
// const handleSubSelect = (sub: any) => {
//   console.log("🟢 SUB RAW:", sub);

//   setSubSearch(sub.name);
//   setSubOpen(false);

//   setFormData(prev => ({
//     ...prev,
//     subCategoryId: sub.documentId, // ✅ REAL MONGO ID
//     childCategoryId: "",
//     localId: ""
//   }));
// };



//     // ✅ CHILD CATEGORY SELECT HANDLER
//     const handleChildSelect = (child: any) => {
//   if (!child?.name) return;

//   // ✅ USE EXISTING CHILD NODE NAME ONLY
//   setSelectedChildCategory({
//     name: child.name
//   });

//   setFormData(prev => ({
//     ...prev,
//     childCategoryId: child.name // ✅ Repair | Services | Installation
//   }));

//   setChildSearch(child.name);
//   setChildOpen(false);
//   setHasChildSelected(true);
// };


// const calculateCurrentPrice = (priceAfterGst: number) => {
//   if (!priceAfterGst) return 0;

//   let discount = Number(formData.discountValue) || 0;

//   // 🔹 Percentage discount
//   if (formData.discountType === "percentage") {
//     discount = Math.min(discount, 100);

//     // ✅ SINGLE MINUS ONLY
//     const price = priceAfterGst - (priceAfterGst * discount) / 100;

//     return Math.max(0, Math.round(price * 100) / 100);
//   }

//   // 🔹 Fixed discount
//   const price = priceAfterGst - discount;
//   return Math.max(0, Math.round(price * 100) / 100);
// };

// const calculatePriceAfterGst = () => {
//   const original = Number(formData.originalPrice);
//   const gst = Number(formData.gst) || 0;

//   if (!original) return 0;

//   // ✅ GST already included
//   if (formData.gstType === "include") {
//     return original;
//   }

//   // ✅ GST exclusive
//   const price = original + (original * gst) / 100;

//   // 🔥 avoid floating bug
//   return Math.round(price * 100) / 100;
// };
 
   
//     const shouldShowContentFields = hasChildSelected && selectedChildCategory;

//     // ✅ FIXED SAVE HANDLER WITH ALL VALUES INCLUDING MIN/MAX TIME
//     const handleSave = () => {
//       if (!formData.mainCategoryId) {
//         alert("Select main category");
//         return;
//       }

//       if (selectedMainCategory?.hasSubCategory && !formData.subCategoryId) {
//         alert("Select sub category");
//         return;
//       }

//       if (!formData.childCategoryId) {
//         alert("Select child category");
//         return;
//       }

//       if (!formData.firstTitle.trim()) {
//         alert("Enter first title");
//         return;
//       }

//       // ✅ IDS
//       const deepChildId = generateCategoryId(formData.firstTitle);

//       // ✅ PRICE CALCULATION
//       const priceAfterGst = calculatePriceAfterGst();
//       const currentPrice = calculateCurrentPrice(priceAfterGst);
      
//       // ✅ PREPARE FORM DATA
//       const deepChildData = {
//         mainCategoryId: formData.mainCategoryId,
//         subCategoryId: formData.subCategoryId || null,
//         childCategoryId: formData.childCategoryId,
//         deepChildId,

//         // 📝 CONTENT
//         firstTitle: formData.firstTitle,
//         secondTitle: formData.secondTitle,
//         description: formData.description,
//         deepCategoryVisible: formData.isDeepVisible,
//         webviewUrl: formData.webviewUrl,

//         // ⏰ TIME FIELDS - FIXED: SENDING VALUES TOO
//         minTime: formData.minTime ? Number(formData.minTime) : null,
//         maxTime: formData.maxTime ? Number(formData.maxTime) : null,

//         // 💰 PRICING
//         originalPrice: Number(formData.originalPrice),
//         discountType: formData.discountType,
//         discountValue: Number(formData.discountValue),
//         gst: Number(formData.gst),
//         gstType: formData.gstType,

//         currentPrice,        // ✅ AFTER DISCOUNT
//         priceAfterGst,       // ✅ FINAL PRICE
//         currentPriceVisible: true,

//         // 👁️ VISIBILITY - ALL FIELDS INCLUDING TIME
//         firstTitleVisible: formData.firstTitleVisible,
//         secondTitleVisible: formData.secondTitleVisible,
//         descriptionVisible: formData.descriptionVisible,
//         webviewUrlVisible: formData.webviewUrlVisible,
//         originalPriceVisible: formData.originalPriceVisible,
        
//         // ✅ TIME VISIBILITY - FIXED
//         minTimeVisible: formData.minTimeVisible,
//         maxTimeVisible: formData.maxTimeVisible,

//         // ✅ MEDIA VISIBILITY - FIXED FIELD NAMES
//         photoVisible: formData.photoVisible,  // Fixed: was ImageVisible
//         videoVisible: formData.videoVisible,
//       };

//       console.log("📦 FINAL DATA GOING TO MONGO:", deepChildData);
//       console.log("⏰ Time values being sent:", {
//         minTime: deepChildData.minTime,
//         maxTime: deepChildData.maxTime,
//         minTimeVisible: deepChildData.minTimeVisible,
//         maxTimeVisible: deepChildData.maxTimeVisible
//       });

//       // Call the context function to save
//       addDeepChildCategory(deepChildData);
      
//       // Call onSuccess if provided
//       if (onSuccess) {
//         onSuccess();
//       }
//     };

//     // ✅ Function to refresh main categories
//     const refreshMainCategories = () => {
//         // You might need to implement this in your context
//         console.log("Refreshing main categories...");
//         window.location.reload(); // Simple reload for now
//     };

//     return (
//         <div className="rounded-lg border border-green-500 bg-gray-100 p-4 shadow-md">
//             {/* HEADER WITH VISIBILITY TOGGLE */}
//             <div className="mb-6 flex items-center justify-between rounded-md border-2 border-blue-900 bg-white px-4 py-3">
//                 <span className="text-xl font-bold text-gray-900">
//                     Manage Deep child category
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
//                                 ${formData.isDeepVisible ? "bg-green-500" : "bg-gray-300"}
//                             `}
//                         >
//                             <div
//                                 className={`absolute top-0 h-6 w-6 rounded-full bg-white shadow-md transition-transform duration-200
//                                     ${formData.isDeepVisible ? "translate-x-6" : "translate-x-0"}
//                                 `}
//                             />
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             {/* ERROR MESSAGE IF MAIN CATEGORIES FAILED TO LOAD */}
//             {categoryError && (
//                 <div className="mb-6 rounded-md border-2 border-red-500 bg-red-50 p-4">
//                     <div className="flex items-center justify-between">
//                         <div className="flex items-center gap-3">
//                             <AlertCircle className="text-red-600" size={24} />
//                             <div>
//                                 <h3 className="font-bold text-red-800">Failed to load main categories</h3>
//                                 <p className="text-red-600 text-sm mt-1">
//                                     Please check your internet connection and try again.
//                                 </p>
//                             </div>
//                         </div>
//                         <button
//                             onClick={refreshMainCategories}
//                             className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition-colors"
//                         >
//                             <RefreshCw size={16} />
//                             Retry
//                         </button>
//                     </div>
//                 </div>
//             )}

//             {/* HIERARCHICAL SELECTION */}
//             <div className="mb-6 space-y-6 rounded-lg border border-gray-300 bg-white p-4">
//                 <h3 className="font-bold text-gray-900 border-b pb-2">Category Selection</h3>
                
//                 {/* MAIN CATEGORY */}
//                 <div className="relative">
//                     <label className="mb-2 block font-bold text-gray-900">Select Main Category *</label>
//                     <input
//                         ref={mainInputRef}
//                         type="text"
//                         value={mainSearch}
//                         placeholder="Type to search main categories..."
//                         onChange={(e) => {
//                             setMainSearch(e.target.value);
//                             setMainOpen(true);
//                         }}
//                         onFocus={() => setMainOpen(true)}
//                         className="w-full rounded-md border-2 border-blue-900 px-3 py-2"
//                         disabled={isLoadingMainCategories}
//                     />

//                     {mainOpen && (
//                         <div ref={mainDropdownRef} className="absolute z-50 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
//                             {isLoadingMainCategories ? (
//                                 <div className="px-4 py-3 text-gray-500 flex items-center justify-center gap-2">
//                                     <RefreshCw className="animate-spin" size={16} />
//                                     Loading main categories...
//                                 </div>
//                             ) : mainCategories.length === 0 ? (
//                                 <div className="px-4 py-3 text-gray-500">
//                                     <div className="flex flex-col items-center justify-center p-4">
//                                         <AlertCircle className="text-gray-400 mb-2" size={24} />
//                                         <p className="text-center">No main categories available</p>
//                                         <p className="text-xs text-gray-500 mt-1 text-center">
//                                             Please check if categories exist in the system
//                                         </p>
//                                     </div>
//                                 </div>
//                             ) : filteredMainCategories.length > 0 ? (
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
                    
//                     {/* HELP TEXT */}
//                     <p className="text-xs text-gray-500 mt-1">
//                         {isLoadingMainCategories 
//                             ? "Loading main categories..." 
//                             : mainCategories.length === 0 
//                                 ? "No categories available. Please add main categories first."
//                                 : `Found ${mainCategories.length} main categories. Type to search.`
//                         }
//                     </p>
//                 </div>

//                 {/* SUB CATEGORY (ONLY IF MAIN HAS SUBCATEGORY) */}
//                 {selectedMainCategory?.hasSubCategory === true && (
//                     <div className="relative">
//                         <label className="mb-2 block font-bold text-gray-900">Select Sub Category *</label>
//     <input
//   ref={subInputRef}
//   type="text"
//   value={subSearch}
//   spellCheck={false}
//   placeholder="Search sub category..."
//   onClick={() => setSubOpen(true)}   // ✅ YAHI MAIN FIX HAI
//   onChange={(e) => {
//     setSubSearch(e.target.value);
//     setSubOpen(true);
//   }}
//   className="w-full rounded-md border-2 border-blue-900 px-3 py-2"
// />



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
//                         <input
//                             ref={childInputRef}
//                             type="text"
//                             value={childSearch}
//                             placeholder="Search child category..."
//                             onChange={(e) => {
//                                 setChildSearch(e.target.value);
//                                 setChildOpen(true);
//                             }}
//                             onFocus={() => setChildOpen(true)}
//                             className="w-full rounded-md border-2 border-blue-900 px-3 py-2"
//                         />

//                         {childOpen && (
//                             <div ref={childDropdownRef} className="absolute z-30 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
//                                 {childCategoriesLocal.length > 0 ? (
//                                    filteredChildCategoriesLocal.map(child => {
//   if (!child?.name) return null;

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
//     </div>
//   );
// })

//                                 ) : (
//                                     <div className="px-4 py-3 text-gray-500">
//                                         {formData.subCategoryId || selectedMainCategory?.hasSubCategory !== true 
//                                             ? "Loading child categories..." 
//                                             : "Select subcategory first"}
//                                     </div>
//                                 )}
//                             </div>
//                         )}
//                     </div>
//                 )}
//             </div>

//             {/* CONTENT FIELDS - WILL SHOW WHEN CHILD IS SELECTED */}
//             {shouldShowContentFields && (
//                 <>
//                     {/* SELECTED CHILD CATEGORY INFO */}
//                     <div className="mb-6 rounded-md border-2 border-green-600 bg-green-50 p-4">
//                         <div className="flex items-center justify-between">
//                             <div>
//                                 <h3 className="text-lg font-bold text-green-800">✓ Child Category Selected!</h3>
//                                 <p className="text-xl font-semibold text-gray-900 mt-1">{selectedChildCategory?.name}</p>
//                                 <p className="text-sm text-gray-600 mt-1">
//                                     Local ID: <span className="font-bold">{formData.localId}</span>
//                                 </p>
//                             </div>
//                             <div className="rounded-full bg-green-100 px-4 py-2">
//                                 <span className="text-sm font-medium text-green-800">Ready to Add Content</span>
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

//                         {/* DELIVERY TIME - FIXED */}
//                         <div className="space-y-4 rounded-lg border border-gray-300 bg-white p-4">
//                             <h3 className="font-bold text-gray-900 border-b pb-2">Delivery Time</h3>
//                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                                 {/* Min Time with Visibility Toggle */}
//                                 <div className="rounded-md border border-gray-200 bg-gray-50 p-4">
//                                     <div className="flex items-center justify-between mb-2">
//                                         <label className="block font-semibold text-gray-900 flex items-center gap-2">
//                                             <Clock size={16} />
//                                             Min Time (minutes)
//                                         </label>
//                                         <div className="flex items-center gap-2">
//                                             <span className="text-xs font-medium text-gray-700">Visibility</span>
//                                             <button 
//                                                 onClick={() => handleToggle('minTimeVisible')} 
//                                                 className={`w-10 h-5 rounded-full flex items-center justify-start p-1 transition-colors duration-200 ${
//                                                     formData.minTimeVisible ? 'bg-blue-600 justify-end' : 'bg-gray-400 justify-start'
//                                                 }`}
//                                             >
//                                                 <div className={`bg-white w-3 h-3 rounded-full shadow-md transform transition-transform duration-200 ${
//                                                     formData.minTimeVisible ? 'translate-x-5' : 'translate-x-0'
//                                                 }`}></div>
//                                             </button>
//                                         </div>
//                                     </div>
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
                                
//                                 {/* Max Time with Visibility Toggle */}
//                                 <div className="rounded-md border border-gray-200 bg-gray-50 p-4">
//                                     <div className="flex items-center justify-between mb-2">
//                                         <label className="block font-semibold text-gray-900 flex items-center gap-2">
//                                             <Clock size={16} />
//                                             Max Time (minutes)
//                                         </label>
//                                         <div className="flex items-center gap-2">
//                                             <span className="text-xs font-medium text-gray-700">Visibility</span>
//                                             <button 
//                                                 onClick={() => handleToggle('maxTimeVisible')} 
//                                                 className={`w-10 h-5 rounded-full flex items-center justify-start p-1 transition-colors duration-200 ${
//                                                     formData.maxTimeVisible ? 'bg-blue-600 justify-end' : 'bg-gray-400 justify-start'
//                                                 }`}
//                                             >
//                                                 <div className={`bg-white w-3 h-3 rounded-full shadow-md transform transition-transform duration-200 ${
//                                                     formData.maxTimeVisible ? 'translate-x-5' : 'translate-x-0'
//                                                 }`}></div>
//                                             </button>
//                                         </div>
//                                     </div>
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

//                         {/* MEDIA UPLOADS - FIXED VISIBILITY FIELD NAMES */}
//                         <div className="space-y-4 rounded-lg border-2 border-blue-900 bg-white p-4">
//                             <h3 className="font-bold text-gray-900 border-b pb-2">Media Uploads</h3>
                            
//                             {/* Photo Upload */}
//                             <div className="rounded-md border border-gray-300 p-4">
//                                 <div className="flex items-center justify-between mb-3">
//                                     <div>
//                                         <label className="block font-medium text-gray-900">Image Upload</label>
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
//                             className="flex items-center gap-2 rounded-lg bg-green-600 hover:bg-green-700 px-6 py-3 font-bold text-white transition-all hover:scale-105 active:scale-95 shadow-lg"
//                         >
//                             <Save size={20} />
//                             Save Deep Child Category
//                         </button>
//                     </div>
//                 </>
//             )}

//             {/* IF NO CHILD SELECTED YET */}
//             {!shouldShowContentFields && formData.childCategoryId && (
//                 <div className="mb-6 rounded-md border-2 border-yellow-600 bg-yellow-50 p-4">
//                     <p className="text-yellow-800">
//                         <strong>Almost there!</strong> Please select a child category from the dropdown above to add content.
//                     </p>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default DeepChildCategoryForm;

"use client";

import React, { useEffect, useMemo, useState, useRef } from "react";
import { Save, Upload, IndianRupee, Clock, AlertCircle, RefreshCw } from "lucide-react";
import { useCategory } from "../../context/CategoryContext";
import { generateCategoryId } from "../../utils/generateCategoryId";

interface DeepChildCategoryFormProps {
    initialChildCategoryId?: string | null;
    onSuccess?: () => void;
}

const DeepChildCategoryForm: React.FC<DeepChildCategoryFormProps> = ({ initialChildCategoryId, onSuccess }) => {
    const context = useCategory();

    if (!context) {
        return <div className="p-4 text-red-500">Error: Category Context not found.</div>;
    }

    const { addDeepChildCategory, mainCategories, isLoadingMainCategories, error: categoryError } = context;

    // ✅ Function to generate unique local ID (e.g., "Priya Singh_1gh4")
    const generateLocalId = (title: string): string => {
        const cleanTitle = title.replace(/[^a-zA-Z0-9]/g, '').substring(0, 10);
        const randomChars = Math.random().toString(36).substring(2, 6);
        return `${cleanTitle}_${randomChars}`;
    };

    // ✅ Normalize function for search
    const normalizeString = (str?: string) =>
        (str ?? "").toLowerCase().replace(/\s+/g, "");

    // ✅ MAIN VISIBILITY TOGGLE
    const [isVisible, setIsVisible] = useState(true);

   const [formData, setFormData] = useState({
  mainCategoryId: "",
  subCategoryId: "",
  childCategoryId: "",
  deepChildCategoryId: "",
  isDeepVisible: true,

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

  // 🔥 FIXED (IMPORTANT)
  minTime: null as number | null,
  minTimeVisible: true,
  maxTime: null as number | null,
  maxTimeVisible: true,

  photo: null as File | null,
  photoVisible: true,
  video: null as File | null,
  videoVisible: true,

  localId: "",
});


    // ✅ STATE VARIABLES
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

    // ✅ GST OPTIONS - FIXED VALUES
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
        const price = formData.gstType === "inclusive" ? finalPrice : finalPrice * (1 + gstRate/100);
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

    // ✅ REFS FOR CLICK HANDLING
    const mainDropdownRef = useRef<HTMLDivElement>(null);
    const subDropdownRef = useRef<HTMLDivElement>(null);
    const childDropdownRef = useRef<HTMLDivElement>(null);
    const mainInputRef = useRef<HTMLInputElement>(null);
    const subInputRef = useRef<HTMLInputElement>(null);
    const childInputRef = useRef<HTMLInputElement>(null);

    // ✅ CLICK OUTSIDE HANDLER
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Node;

            if (
                childOpen &&
                childDropdownRef.current &&
                !childDropdownRef.current.contains(target) &&
                !childInputRef.current?.contains(target)
            ) {
                setChildOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [childOpen]);

    // ✅ MAIN CATEGORY SELECT HANDLER
    const handleMainSelect = (cat: any) => {
        console.log("✅ MAIN SELECTED", cat._id);

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

    // ✅ SUB CATEGORY API
    useEffect(() => {
        if (!selectedMainCategory) return;

        if (selectedMainCategory.hasSubCategory !== true) {
            console.log("ℹ️ Main category has NO subcategories");
            setSubCategories([]);
            setSubSearch("");
            setFormData(prev => ({ ...prev, subCategoryId: "" }));
            return;
        }

        console.log("👀 Fetching subcategories for main:", selectedMainCategory._id);

        const fetchSubCategoriesAPI = async () => {
            try {
                const token = localStorage.getItem("token");
                const url = `https://api.bijliwalaaya.in/api/product-listing/main/${selectedMainCategory._id}/sub`;
                console.log("🚀 SUB CATEGORY API URL:", url);

                const res = await fetch(url, {
                    headers: {
                        Authorization: token ? `Bearer ${token}` : "",
                        "x-api-token": "super_secure_token",
                        "Content-Type": "application/json",
                    },
                });

                const json = await res.json();
                console.log("🔥 RAW SUB CATEGORY RESPONSE:", json);

                const rawData = json?.data || {};
                const list = Object.entries(rawData).map(
                    ([_, value]: any) => ({
                        documentId: value.documentId,
                        name: value.name,
                    })
                );

                console.log("✅ FINAL SUB CATEGORY LIST:", list);
                setSubCategories(list);
            } catch (err) {
                console.error("❌ Sub category API failed", err);
                setSubCategories([]);
            }
        };

        fetchSubCategoriesAPI();
    }, [selectedMainCategory]);

    // ✅ CHILD CATEGORY API
    useEffect(() => {
        if (!formData.mainCategoryId) {
            setChildCategoriesLocal([]);
            return;
        }

        if (selectedMainCategory?.hasSubCategory !== true) {
            console.log("👀 Fetching child categories directly for main:", formData.mainCategoryId);

            const fetchChildCategoriesDirect = async () => {
                try {
                    const token = localStorage.getItem("token");
                    const url = `https://api.bijliwalaaya.in/api/product-listing/main/${formData.mainCategoryId}/child`;
                    console.log("🚀 DIRECT CHILD CATEGORY API URL:", url);

                    const res = await fetch(url, {
                        headers: {
                            Authorization: token ? `Bearer ${token}` : "",
                            "x-api-token": "super_secure_token",
                            "Content-Type": "application/json",
                        },
                    });

                    const json = await res.json();
                    console.log("🔥 RAW DIRECT CHILD CATEGORY RESPONSE:", json);

                    const rawData = json?.data || {};
                    const list = Object.entries(rawData).map(
                        ([key, value]: any) => ({
                            name: key,
                        })
                    );

                    console.log("✅ FINAL DIRECT CHILD CATEGORY LIST:", list);
                    setChildCategoriesLocal(list);
                } catch (err) {
                    console.error("❌ Direct child category API failed", err);
                    setChildCategoriesLocal([]);
                }
            };

            fetchChildCategoriesDirect();
        } else if (formData.subCategoryId) {
            console.log("👀 Fetching child categories for sub:", formData.subCategoryId);

            const fetchChildCategoriesAPI = async () => {
                try {
                    const token = localStorage.getItem("token");
                    const url = `https://api.bijliwalaaya.in/api/product-listing/main/${formData.mainCategoryId}/sub/${formData.subCategoryId}/child`;
                    console.log("🚀 CHILD CATEGORY API URL:", url);

                    const res = await fetch(url, {
                        headers: {
                            Authorization: token ? `Bearer ${token}` : "",
                            "x-api-token": "super_secure_token",
                            "Content-Type": "application/json",
                        },
                    });

                    const json = await res.json();
                    console.log("🔥 RAW CHILD CATEGORY RESPONSE:", json);

                    const rawData = json?.data || {};
                    const list = Object.entries(rawData).map(
                        ([_, value]: any) => ({
                            documentId: value.documentId,
                            name: value.name,
                        })
                    );

                    console.log("✅ FINAL CHILD CATEGORY LIST:", list);
                    setChildCategoriesLocal(list);
                } catch (err) {
                    console.error("❌ Child category API failed", err);
                    setChildCategoriesLocal([]);
                }
            };

            fetchChildCategoriesAPI();
        } else {
            setChildCategoriesLocal([]);
        }
    }, [formData.subCategoryId, formData.mainCategoryId, selectedMainCategory]);

    // ✅ GENERATE LOCAL ID WHEN FIRST TITLE CHANGES
    useEffect(() => {
        if (formData.firstTitle.trim()) {
            const localId = generateLocalId(formData.firstTitle);
            setFormData(prev => ({ ...prev, localId }));
            console.log("✅ Generated Local ID:", localId);
        }
    }, [formData.firstTitle]);

    // ✅ FILTERED LISTS
    const filteredMainCategories = useMemo(() => {
        if (!mainSearch?.trim()) return [];

        return mainCategories.filter(cat =>
            cat?.name &&
            cat.name.toLowerCase().includes(mainSearch.toLowerCase())
        );
    }, [mainSearch, mainCategories]);

    const filteredSubCategories = useMemo(() => {
        if (!subSearch.trim()) return subCategories;

        return subCategories.filter(sub =>
            normalizeString(sub.name).includes(normalizeString(subSearch))
        );
    }, [subSearch, subCategories]);

    const filteredChildCategoriesLocal = useMemo(() => {
        if (!childSearch) return childCategoriesLocal;

        return childCategoriesLocal.filter(child => {
            if (!child || !child.name) return false;
            return child.name.toLowerCase().includes(childSearch.toLowerCase());
        });
    }, [childSearch, childCategoriesLocal]);

    // ✅ FIXED HANDLER FOR ALL INPUT TYPES INCLUDING NUMBER
   const handleChange = (
  e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
) => {
  const { name, value } = e.target;

  // ✅ FIX FOR minTime & maxTime
  if (name === "minTime" || name === "maxTime") {
    setFormData(prev => ({
      ...prev,
      [name]: value === "" ? null : Number(value)
    }));
    return;
  }

  setFormData(prev => ({
    ...prev,
    [name]: value
  }));
};


    // ✅ TOGGLE HANDLER
    const handleToggle = (field: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: !prev[field as keyof typeof prev]
        }));
    };

    const handleMainVisibilityToggle = () => {
        setIsVisible(prev => !prev);
        setFormData(prev => ({
            ...prev,
            isDeepVisible: !prev.isDeepVisible
        }));
        console.log("Deep Child Visibility Toggled:", !isVisible);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'photo' | 'video') => {
        if (e.target.files && e.target.files[0]) {
            setFormData(prev => ({ ...prev, [type]: e.target.files![0] }));
        }
    };

    // ✅ SUB CATEGORY SELECT HANDLER
    const handleSubSelect = (sub: any) => {
        console.log("🟢 SUB RAW:", sub);

        setSubSearch(sub.name);
        setSubOpen(false);

        setFormData(prev => ({
            ...prev,
            subCategoryId: sub.documentId,
            childCategoryId: "",
            localId: ""
        }));
    };

    // ✅ CHILD CATEGORY SELECT HANDLER
    const handleChildSelect = (child: any) => {
        if (!child?.name) return;

        setSelectedChildCategory({
            name: child.name
        });

        setFormData(prev => ({
            ...prev,
            childCategoryId: child.name
        }));

        setChildSearch(child.name);
        setChildOpen(false);
        setHasChildSelected(true);
    };

    // ✅ FIXED PRICE CALCULATION FUNCTIONS
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

    const calculatePriceAfterGst = () => {
        const original = Number(formData.originalPrice);
        const gst = Number(formData.gst) || 0;

        if (!original) return 0;

        if (formData.gstType === "inclusive") {
            return original;
        }

        const price = original + (original * gst) / 100;
        return Math.round(price * 100) / 100;
    };

    const shouldShowContentFields = hasChildSelected && selectedChildCategory;

    // ✅ FIXED SAVE HANDLER WITH PROPER MIN/MAX TIME HANDLING
    const handleSave = () => {
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

        // ✅ Generate IDs
        const deepChildId = generateCategoryId(formData.firstTitle);

        // ✅ Price Calculation
        const priceAfterGst = calculatePriceAfterGst();
        const currentPrice = calculateCurrentPrice(priceAfterGst);
        
        // ✅ Convert minTime and maxTime to numbers (handle empty strings)
        const minTimeValue = formData.minTime ? Number(formData.minTime) : null;
        const maxTimeValue = formData.maxTime ? Number(formData.maxTime) : null;

        // ✅ Prepare Form Data
        const deepChildData = {
            mainCategoryId: formData.mainCategoryId,
            subCategoryId: formData.subCategoryId || null,
            childCategoryId: formData.childCategoryId,
            deepChildId,

            // 📝 Content
            firstTitle: formData.firstTitle,
            secondTitle: formData.secondTitle,
            description: formData.description,
            deepCategoryVisible: formData.isDeepVisible,
            webviewUrl: formData.webviewUrl,

            // ⏰ Time Fields - FIXED: Now properly sending as numbers
            minTime: minTimeValue,
            maxTime: maxTimeValue,

            // 💰 Pricing
            originalPrice: Number(formData.originalPrice) || 0,
            discountType: formData.discountType,
            discountValue: Number(formData.discountValue) || 0,
            gst: Number(formData.gst) || 0,
            gstType: formData.gstType, // ✅ Now "inclusive" or "exclusive"

            currentPrice: currentPrice,
            priceAfterGst: priceAfterGst,
            currentPriceVisible: true,

            // 👁️ Visibility
            firstTitleVisible: formData.firstTitleVisible,
            secondTitleVisible: formData.secondTitleVisible,
            descriptionVisible: formData.descriptionVisible,
            webviewUrlVisible: formData.webviewUrlVisible,
            originalPriceVisible: formData.originalPriceVisible,
            
            // ✅ Time Visibility
            minTimeVisible: formData.minTimeVisible,
            maxTimeVisible: formData.maxTimeVisible,

            // ✅ Media Visibility
            photoVisible: formData.photoVisible,
            videoVisible: formData.videoVisible,
        };

        console.log("📦 FINAL DATA GOING TO MONGO:", deepChildData);
        console.log("⏰ Time values being sent:", {
            minTime: deepChildData.minTime,
            maxTime: deepChildData.maxTime,
            minTimeVisible: deepChildData.minTimeVisible,
            maxTimeVisible: deepChildData.maxTimeVisible
        });

        // Call the context function to save
        addDeepChildCategory(deepChildData);
        
        // Call onSuccess if provided
        if (onSuccess) {
            onSuccess();
        }
    };

    const refreshMainCategories = () => {
        console.log("Refreshing main categories...");
        window.location.reload();
    };

    return (
        <div className="rounded-lg border border-green-500 bg-gray-100 p-4 shadow-md">
            {/* HEADER WITH VISIBILITY TOGGLE */}
            <div className="mb-6 flex items-center justify-between rounded-md border-2 border-blue-900 bg-white px-4 py-3">
                <span className="text-xl font-bold text-gray-900">
                    Manage Deep child category
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
                                ${formData.isDeepVisible ? "bg-green-500" : "bg-gray-300"}
                            `}
                        >
                            <div
                                className={`absolute top-0 h-6 w-6 rounded-full bg-white shadow-md transition-transform duration-200
                                    ${formData.isDeepVisible ? "translate-x-6" : "translate-x-0"}
                                `}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* ERROR MESSAGE IF MAIN CATEGORIES FAILED TO LOAD */}
            {categoryError && (
                <div className="mb-6 rounded-md border-2 border-red-500 bg-red-50 p-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <AlertCircle className="text-red-600" size={24} />
                            <div>
                                <h3 className="font-bold text-red-800">Failed to load main categories</h3>
                                <p className="text-red-600 text-sm mt-1">
                                    Please check your internet connection and try again.
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={refreshMainCategories}
                            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition-colors"
                        >
                            <RefreshCw size={16} />
                            Retry
                        </button>
                    </div>
                </div>
            )}

            {/* HIERARCHICAL SELECTION */}
            <div className="mb-6 space-y-6 rounded-lg border border-gray-300 bg-white p-4">
                <h3 className="font-bold text-gray-900 border-b pb-2">Category Selection</h3>
                
                {/* MAIN CATEGORY */}
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
                        disabled={isLoadingMainCategories}
                    />

                    {mainOpen && (
                        <div ref={mainDropdownRef} className="absolute z-50 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                            {isLoadingMainCategories ? (
                                <div className="px-4 py-3 text-gray-500 flex items-center justify-center gap-2">
                                    <RefreshCw className="animate-spin" size={16} />
                                    Loading main categories...
                                </div>
                            ) : mainCategories.length === 0 ? (
                                <div className="px-4 py-3 text-gray-500">
                                    <div className="flex flex-col items-center justify-center p-4">
                                        <AlertCircle className="text-gray-400 mb-2" size={24} />
                                        <p className="text-center">No main categories available</p>
                                        <p className="text-xs text-gray-500 mt-1 text-center">
                                            Please check if categories exist in the system
                                        </p>
                                    </div>
                                </div>
                            ) : filteredMainCategories.length > 0 ? (
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
                                            <span className={`text-xs px-2 py-1 rounded ${
                                                cat.hasSubCategory === true ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
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
                    
                    {/* HELP TEXT */}
                    <p className="text-xs text-gray-500 mt-1">
                        {isLoadingMainCategories 
                            ? "Loading main categories..." 
                            : mainCategories.length === 0 
                                ? "No categories available. Please add main categories first."
                                : `Found ${mainCategories.length} main categories. Type to search.`
                        }
                    </p>
                </div>

                {/* SUB CATEGORY (ONLY IF MAIN HAS SUBCATEGORY) */}
                {selectedMainCategory?.hasSubCategory === true && (
                    <div className="relative">
                        <label className="mb-2 block font-bold text-gray-900">Select Sub Category *</label>
                        <input
                            ref={subInputRef}
                            type="text"
                            value={subSearch}
                            spellCheck={false}
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
                                            <span className="font-medium">{sub.name}</span>
                                        </div>
                                    ))
                                ) : (
                                    <div className="px-4 py-3 text-gray-500">
                                        Loading subcategories...
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {/* CHILD CATEGORY */}
                {(selectedMainCategory?.hasSubCategory !== true || formData.subCategoryId) && (
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
                                {childCategoriesLocal.length > 0 ? (
                                    filteredChildCategoriesLocal.map(child => {
                                        if (!child?.name) return null;

                                        return (
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
                                        );
                                    })
                                ) : (
                                    <div className="px-4 py-3 text-gray-500">
                                        {formData.subCategoryId || selectedMainCategory?.hasSubCategory !== true 
                                            ? "Loading child categories..." 
                                            : "Select subcategory first"}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* CONTENT FIELDS - WILL SHOW WHEN CHILD IS SELECTED */}
            {shouldShowContentFields && (
                <>
                    {/* SELECTED CHILD CATEGORY INFO */}
                    <div className="mb-6 rounded-md border-2 border-green-600 bg-green-50 p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-bold text-green-800">✓ Child Category Selected!</h3>
                                <p className="text-xl font-semibold text-gray-900 mt-1">{selectedChildCategory?.name}</p>
                                <p className="text-sm text-gray-600 mt-1">
                                    Local ID: <span className="font-bold">{formData.localId}</span>
                                </p>
                            </div>
                            <div className="rounded-full bg-green-100 px-4 py-2">
                                <span className="text-sm font-medium text-green-800">Ready to Add Content</span>
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

                            {/* Second Headline */}
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

                            {/* Description */}
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

                            {/* Webview URL */}
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

                        {/* DELIVERY TIME - FIXED */}
                        <div className="space-y-4 rounded-lg border border-gray-300 bg-white p-4">
                            <h3 className="font-bold text-gray-900 border-b pb-2">Delivery Time</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Min Time with Visibility Toggle */}
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
                                        value={formData.minTime}
                                        onChange={handleChange}
                                        className="w-full rounded-md border-2 border-blue-900 px-3 py-2"
                                        placeholder="Minimum time"
                                        min="0"
                                    />
                                </div>
                                
                                {/* Max Time with Visibility Toggle */}
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
                                        <label className="block font-medium text-gray-900">Image Upload</label>
                                        <p className="text-xs text-gray-500">Size: 100dp x 120dp</p>
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
                            className="flex items-center gap-2 rounded-lg bg-green-600 hover:bg-green-700 px-6 py-3 font-bold text-white transition-all hover:scale-105 active:scale-95 shadow-lg"
                        >
                            <Save size={20} />
                            Save Deep Child Category
                        </button>
                    </div>
                </>
            )}

            {/* IF NO CHILD SELECTED YET */}
            {!shouldShowContentFields && formData.childCategoryId && (
                <div className="mb-6 rounded-md border-2 border-yellow-600 bg-yellow-50 p-4">
                    <p className="text-yellow-800">
                        <strong>Almost there!</strong> Please select a child category from the dropdown above to add content.
                    </p>
                </div>
            )}
        </div>
    );
};

export default DeepChildCategoryForm;
