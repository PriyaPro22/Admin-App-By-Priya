"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { Save, Upload, IndianRupee, Clock, ChevronDown, ChevronUp } from "lucide-react";
import { useCategory } from "../../context/CategoryContext";
import { BASE_URL, API_TOKEN } from "../../utils/api";

interface SubDeepChildCategoryFormProps {
    initialDeepChildCategoryId?: string | null;
    editingCategory?: any;
    onSuccess?: () => void;
}

const SubDeepChildCategoryForm: React.FC<SubDeepChildCategoryFormProps> = ({ initialDeepChildCategoryId, editingCategory, onSuccess }) => {
    const context = useCategory();

    if (!context) return <div className="p-4 text-red-500">Error: Category Context not found.</div>;

    const { addSubDeepChildCategory, updateSubDeepChildCategory, mainCategories } = context;

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
    const [isLoadingDeepChild, setIsLoadingDeepChild] = useState(false);

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
        deliveryTimeVisible: true,

        photo: null as File | null,
        photoVisible: true,
        video: null as File | null,
        videoVisible: true,

        localId: "",
    });

    // ✅ POPULATE FORM FOR EDITING
    useEffect(() => {
        if (editingCategory) {
            console.log("📝 EDITING SUB DEEP:", editingCategory);
            setFormData({
                mainCategoryId: editingCategory.mainCategoryId || "",
                subCategoryId: editingCategory.subCategoryId || "",
                childCategoryId: editingCategory.childCategoryId || "",
                deepChildCategoryId: editingCategory.deepChildCategoryId || initialDeepChildCategoryId || "",

                firstTitle: editingCategory.firstTitle || "",
                firstTitleVisible: editingCategory.firstTitleVisible ?? true,
                secondTitle: editingCategory.secondTitle || "",
                secondTitleVisible: editingCategory.secondTitleVisible ?? true,
                description: editingCategory.description || "",
                descriptionVisible: editingCategory.descriptionVisible ?? true,

                webviewUrl: editingCategory.webviewUrl || "",
                webviewUrlVisible: editingCategory.webviewUrlVisible ?? true,

                originalPrice: editingCategory.originalPrice?.toString() || "",
                originalPriceVisible: editingCategory.originalPriceVisible ?? true,

                discountType: editingCategory.discountType || "percentage",
                discountValue: editingCategory.discountValue?.toString() || "",

                gst: editingCategory.gst?.toString() || "0",
                gstType: editingCategory.gstType || "inclusive",

                minTime: editingCategory.minTime ?? null,
                maxTime: editingCategory.maxTime ?? null,
                deliveryTimeVisible: editingCategory.minTimeVisible ?? true,

                photo: null,
                photoVisible: editingCategory.photoVisible ?? true,
                video: null,
                videoVisible: editingCategory.videoVisible ?? true,

                localId: editingCategory.localId || editingCategory.subDeepKey || "",
            });
            setIsVisible(editingCategory.visible ?? true);

            // 🚀 AUTOMATICALLY RESOLVE PARENT DROPDOWNS & SEARCH INPUTS
            // 1. Resolve Main Category
            if (editingCategory.mainCategoryId) {
                const main = mainCategories.find(m => m._id === editingCategory.mainCategoryId);
                if (main) {
                    setSelectedMainCategory(main);
                    setMainSearch(main.name);
                } else if (editingCategory.mainCategoryName) {
                    setMainSearch(editingCategory.mainCategoryName);
                }
            }

            // 2. Set Names for other levels (Visual Only)
            if (editingCategory.subCategoryName) setSubSearch(editingCategory.subCategoryName);
            if (editingCategory.childCategoryName) setChildSearch(editingCategory.childCategoryName);
            if (editingCategory.deepChildCategoryName) setDeepChildSearch(editingCategory.deepChildCategoryName);
        }
    }, [editingCategory, initialDeepChildCategoryId, mainCategories]);


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
        const q = subSearch.trim().toLowerCase();
        const list = subCategories;
        if (!q) return list.sort((a, b) => (a.name || "").localeCompare(b.name || ""));

        const startsWith = list.filter(sub =>
            (sub.name || "").toLowerCase().startsWith(q)
        );
        const contains = list.filter(sub =>
            !(sub.name || "").toLowerCase().startsWith(q) &&
            (sub.name || "").toLowerCase().includes(q)
        );

        return [
            ...startsWith.sort((a, b) => (a.name || "").localeCompare(b.name || "")),
            ...contains.sort((a, b) => (a.name || "").localeCompare(b.name || "")),
        ];
    }, [subSearch, subCategories]);

    const filteredChildCategories = useMemo(() => {
        const q = childSearch.trim().toLowerCase();
        const list = childCategories;
        if (!q) return list.sort((a, b) => (a.name || "").localeCompare(b.name || ""));

        const startsWith = list.filter(child =>
            (child.name || "").toLowerCase().startsWith(q)
        );
        const contains = list.filter(child =>
            !(child.name || "").toLowerCase().startsWith(q) &&
            (child.name || "").toLowerCase().includes(q)
        );

        return [
            ...startsWith.sort((a, b) => (a.name || "").localeCompare(b.name || "")),
            ...contains.sort((a, b) => (a.name || "").localeCompare(b.name || "")),
        ];
    }, [childSearch, childCategories]);

    const filteredDeepChildCategories = useMemo(() => {
        const q = deepChildSearch.trim().toLowerCase();
        const list = deepChildCategories;
        // Deep Child uses firstTitle instead of name
        if (!q) return list.sort((a, b) => (a.firstTitle || "").localeCompare(b.firstTitle || ""));

        const startsWith = list.filter(deep =>
            (deep.firstTitle || "").toLowerCase().startsWith(q)
        );
        const contains = list.filter(deep =>
            !(deep.firstTitle || "").toLowerCase().startsWith(q) &&
            (deep.firstTitle || "").toLowerCase().includes(q)
        );

        return [
            ...startsWith.sort((a, b) => (a.firstTitle || "").localeCompare(b.firstTitle || "")),
            ...contains.sort((a, b) => (a.firstTitle || "").localeCompare(b.firstTitle || "")),
        ];
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

    // ✅ AUTO-POPULATE FORM IF INITIAL DEEP ID IS PROVIDED
    useEffect(() => {
        // 🔒 Prevent overwriting if we are already EDITING
        if (editingCategory) return;

        if (initialDeepChildCategoryId && deepChildCategories.length > 0) {
            console.log("🚀 Attempting to Auto-Populate Form with Deep ID:", initialDeepChildCategoryId);
            const deep = deepChildCategories.find(d => (d.id || (d as any).documentId) === initialDeepChildCategoryId);

            if (deep) {
                console.log("✅ Found Deep Category context:", deep);
                const main = mainCategories.find(m => m._id === deep.mainCategoryId);

                // 1. Set Main Category Context
                if (main) {
                    setSelectedMainCategory(main);
                    setMainSearch(main.name);
                }

                // 2. Set Form Data (Atomic update)
                setFormData(prev => ({
                    ...prev,
                    mainCategoryId: deep.mainCategoryId || "",
                    subCategoryId: deep.subCategoryId || "",
                    childCategoryId: deep.childCategoryId || "",
                    deepChildCategoryId: deep.id || (deep as any).documentId || initialDeepChildCategoryId,
                    localId: ""
                }));
            }
        }
    }, [initialDeepChildCategoryId, deepChildCategories, mainCategories]);

    // ✅ SUB CATEGORY API CALL - FIXED
    useEffect(() => {
        if (!selectedMainCategory) return;

        // Check removed to force fetch
        if (false) {
            return;
        }

        console.log("🚀 Fetching subcategories for main:", selectedMainCategory._id);

        const fetchSubCategoriesAPI = async () => {
            try {
                const token = localStorage.getItem("token");
                const url = `${BASE_URL}/main/${selectedMainCategory._id}/sub`;
                console.log("📡 Subcategory API URL:", url);

                const res = await fetch(url, {
                    headers: {
                        Authorization: token ? `Bearer ${token}` : "",
                        "x-api-token": API_TOKEN,
                        "Content-Type": "application/json",
                    },
                });

                const json = await res.json();
                console.log("📥 Raw subcategory response:", json);

                // ✅ ROBUST PARSING (Matches DeepChild Form logic + Safety)
                // ✅ ROBUST PARSING (Handle data, result, or direct object)
                const rawData = json?.data || json?.result || json;
                let list: any[] = [];

                if (Array.isArray(rawData)) {
                    list = rawData.map((item: any) => ({
                        documentId: item._id || item.documentId || item.id,
                        name: item.name || item.firstTitle,
                    }));
                } else if (rawData && typeof rawData === 'object') {
                    // Handle Map (Key -> Value)
                    list = Object.entries(rawData).map(([key, value]: any) => {
                        const valObj = (typeof value === 'object' && value !== null) ? value : { name: value };
                        return {
                            documentId: valObj._id || valObj.documentId || valObj.id || key,
                            name: valObj.name || valObj.firstTitle || key,
                        };
                    });
                }

                // Filter out invalid items
                list = list.filter(item => item.documentId && item.name);

                console.log("✅ Subcategories loaded:", list.length);
                console.log("📊 Subcategories:", list);
                setSubCategories(list);
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
        //  Don't block - still load all available child categories
        if (selectedMainCategory?.hasSubCategory && !formData.subCategoryId) {
            console.log("⚠️ Main has subcategories but none selected. Will load all child categories anyway.");
            // Continue to fetch - don't return early
        }

        const fetchChildCategories = async () => {
            try {
                const token = localStorage.getItem("token");
                let url = "";

                // Smart URL determination
                if (formData.subCategoryId) {
                    // Case 2: Child categories through subcategory (Explicit selection)
                    url = `${BASE_URL}/main/${formData.mainCategoryId}/sub/${formData.subCategoryId}/child`;
                } else if ((selectedMainCategory?.hasSubCategory !== true && (selectedMainCategory?.hasSubCategory as any) !== "true") || subCategories.length === 0) {
                    // Case 1: Direct child categories (no subcategory flag and no data)
                    url = `${BASE_URL}/main/${formData.mainCategoryId}/child`;
                } else {
                    // Has subcategories (flag or data) but none selected -> Wait
                    setChildCategories([]);
                    return;
                }

                console.log("📡 Child category API URL:", url);

                const res = await fetch(url, {
                    headers: {
                        Authorization: token ? `Bearer ${token}` : "",
                        "x-api-token": API_TOKEN,
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
            setIsLoadingDeepChild(true);
            try {
                const token = localStorage.getItem("token");
                let url = "";

                if (formData.subCategoryId && (selectedMainCategory?.hasSubCategory === true || (selectedMainCategory?.hasSubCategory as any) === "true")) {
                    url = `${BASE_URL}/main/${formData.mainCategoryId}/sub/${formData.subCategoryId}/child/${encodeURIComponent(formData.childCategoryId)}/deep`;
                } else {
                    // ✅ User confirmed: Use 'child-key' for direct path
                    url = `${BASE_URL}/main/${formData.mainCategoryId}/child-key/${encodeURIComponent(formData.childCategoryId)}/deep`;
                }

                console.log("📡 Deep child category API URL:", url);

                const res = await fetch(url, {
                    headers: {
                        Authorization: token ? `Bearer ${token}` : "",
                        "x-api-token": API_TOKEN,
                        "Content-Type": "application/json",
                    },
                });

                const json = await res.json();
                console.log("📥 Raw deep child response:", json);

                // 🔥 NUCLEAR OPTION: Scan ENTIRE JSON for Deep Child Items
                // ignores structure, finds items by signature properties
                const collectedItems: any[] = [];
                const seenIds = new Set();

                const deepScan = (obj: any, depth: number = 0) => {
                    if (!obj || typeof obj !== 'object' || depth > 15) return;

                    // CHECK IF THIS IS A DEEP CHILD CANDIDATE
                    // Must have content properties.
                    // If ID is missing, we try to grab it from Key if inside Map.
                    const contentScore = (obj.firstTitle ? 1 : 0) + (obj.deepChildCategoryName ? 1 : 0) + (obj.deepCategoryVisible !== undefined ? 1 : 0) + (obj.name ? 0.5 : 0);
                    const hasId = (obj._id || obj.documentId || obj.id);

                    if (contentScore >= 1 && hasId) {
                        const id = obj.documentId || obj._id || obj.id;
                        if (!seenIds.has(id)) {
                            seenIds.add(id);
                            collectedItems.push(obj);
                        }
                    }

                    // RECURSION
                    if (Array.isArray(obj)) {
                        obj.forEach(item => deepScan(item, depth + 1));
                    } else {
                        Object.entries(obj).forEach(([key, val]: [string, any]) => {
                            if (val && typeof val === 'object' && !Array.isArray(val)) {
                                // Inject Key as ID if missing and looks like content
                                const valScore = (val.firstTitle ? 1 : 0) + (val.deepChildCategoryName ? 1 : 0) + (val.deepCategoryVisible !== undefined ? 1 : 0);
                                if (valScore >= 1 && (!val.documentId && !val._id && !val.id)) {
                                    val.documentId = key; // Inject Key
                                    val.id = key;
                                    // Now recurse, it will be picked up
                                }
                            }
                            deepScan(val, depth + 1);
                        });
                    }
                };

                deepScan(json);

                let list = collectedItems.map((item: any) => ({
                    documentId: item.documentId || item._id || item.id,
                    id: item.documentId || item._id || item.id,
                    firstTitle: item.firstTitle || item.name || item.deepChildCategoryName || "Untitled",
                    localId: item.documentId || item._id || item.id,
                    ...item
                }));

                console.log("☢️ Nuclear Scan Results:", list.length, list);
                setDeepChildCategories(list);
            } catch (err) {
                console.error("❌ Deep child category API failed:", err);
                setDeepChildCategories([]);
            } finally {
                setIsLoadingDeepChild(false);
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
    const handleSave = async () => {
        // Validation with Fallbacks for Edit Mode
        const finalMainId = formData.mainCategoryId || selectedMainCategory?._id;
        if (!finalMainId) return alert("Select main category");

        // Smart subcategory validation - only if actual subcategories exist
        const hasSub = selectedMainCategory?.hasSubCategory === true || (selectedMainCategory?.hasSubCategory as any) === "true";
        if (hasSub && subCategories.length > 0 && !formData.subCategoryId && !selectedMainCategory?._id) { // relaxed check
            return alert(
                "⚠️ Sub category selection required.\n\n" +
                `Available: ${subCategories.map(s => s.name).join(', ')}\n\n` +
                "Please select one."
            );
        }

        const finalChildId = formData.childCategoryId || childSearch;
        if (!finalChildId) return alert("Select child category");

        const finalDeepId = formData.deepChildCategoryId || editingCategory?.deepChildCategoryId;
        if (!finalDeepId) return alert("Select deep child category");
        if (!formData.firstTitle.trim()) return alert("Enter first title");
        if (!formData.originalPrice) return alert("Enter original price");

        const finalLocalId =
            formData.localId || generateLocalId(formData.firstTitle);

        const priceAfterGst = calculatePriceAfterGst();
        const currentPrice = calculateCurrentPrice(priceAfterGst);

        // 🔥🔥🔥 TIME CONVERSION
        const minTimeValue =
            formData.minTime !== null ? Number(formData.minTime) : undefined;
        const maxTimeValue =
            formData.maxTime !== null ? Number(formData.maxTime) : undefined;

        const selectedDeep = deepChildCategories.find(d => d.documentId === finalDeepId);

        const subDeepChildData = {
            // 🔑 IDS - Use Resolved Fallbacks
            mainCategoryId: finalMainId,
            subCategoryId: formData.subCategoryId || null,
            childCategoryId: finalChildId,
            deepChildCategoryId: finalDeepId,
            deepChildCategoryName: selectedDeep ? selectedDeep.firstTitle : "Deep Category",
            subDeepKey: finalLocalId,

            // 📝 CONTENT
            firstTitle: formData.firstTitle,
            secondTitle: formData.secondTitle,
            description: formData.description,
            subDeepCategoryVisible: isVisible,
            visible: isVisible,
            webviewUrl: formData.webviewUrl,

            // ⏰🔥 DELIVERY TIME
            minTime: minTimeValue,
            maxTime: maxTimeValue,
            minTimeVisible: formData.deliveryTimeVisible,
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

        try {
            if (editingCategory) {
                await updateSubDeepChildCategory({
                    ...subDeepChildData,
                    id: editingCategory.id || editingCategory._id || editingCategory.documentId
                });
                alert("✅ Sub Deep Child Category Updated");
            } else {
                await addSubDeepChildCategory(subDeepChildData);
                alert("✅ Sub Deep Child Category Added");
            }

            if (onSuccess) onSuccess();
        } catch (error) {
            console.error("Save failed:", error);
            alert("❌ Failed to save data. Please check console for details.");
        }
    };



    // ✅ Condition for showing content fields
    const shouldShowContentFields = formData.deepChildCategoryId && formData.deepChildCategoryId.trim() !== "";

    return (
        <div className="rounded-lg border border-red-500 bg-gray-100 p-4 shadow-md">
            {/* HEADER WITH VISIBILITY TOGGLE */}
            <div className="mb-6 flex items-center justify-between rounded-md border-2 border-blue-900 bg-white px-4 py-3">
                <span className="text-xl font-bold text-gray-900">
                    {editingCategory ? "Edit Sub Deep Child Category" : "Manage Sub Deep Child Category"}
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
                                            {(cat.hasSubCategory === true || (cat.hasSubCategory as any) === "true") && (
                                                <span className="text-xs px-2 py-1 rounded bg-green-100 text-green-800">
                                                    Has Subcategory
                                                </span>
                                            )}
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

                {/* SUB CATEGORY - Show if flag is true OR if we found subcategories */}
                {((selectedMainCategory?.hasSubCategory === true || (selectedMainCategory?.hasSubCategory as any) === "true") || subCategories.length > 0) && (
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
                                        {childSearch ? "No matching child categories" : "⚠️ Please select a subcategory first"}
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
                                        {isLoadingDeepChild ? (
                                            <span className="flex items-center gap-2">
                                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                                                Loading...
                                            </span>
                                        ) : (
                                            deepChildSearch ? "No matching deep child categories" : "No deep child categories found"
                                        )}
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
                                        value={formData.minTime ?? ""}
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
                                        value={formData.maxTime ?? ""}
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
                            {editingCategory ? "Update Sub Deep Child Category" : "Save Sub Deep Child Category"}
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