"use client";

import React, { useState, useEffect } from "react";
import { Save, Upload, IndianRupee, Clock, ImageIcon, EyeOff } from "lucide-react";
import { useCategory } from "../../context/CategoryContext";
import { generateCategoryId } from "../../utils/generateCategoryId";

interface SubDeepChildCategoryFormProps {
  initialDeepChildCategoryId?: string | null;
  editingCategory?: any;
  onSuccess?: () => void;
}

const SubDeepChildCategoryForm: React.FC<SubDeepChildCategoryFormProps> = ({
  initialDeepChildCategoryId,
  editingCategory,
  onSuccess,
}) => {
  const {
    addSubDeepChildCategory,
    updateSubDeepChildCategory,
    mainCategories,
    subDeepChildCategories,
  } = useCategory();

  const [isSaving, setIsSaving] = useState(false);

  // Drag
  // ✅ Prevent browser from opening file in new tab
  useEffect(() => {
    const preventDefault = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
    };

    window.addEventListener("dragover", preventDefault);
    window.addEventListener("drop", preventDefault);

    return () => {
      window.removeEventListener("dragover", preventDefault);
      window.removeEventListener("drop", preventDefault);
    };
  }, []);


  // ✅ Drag Over
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };


  // ✅ Drop Handler (ONLY ONE)
  const handleDrop = (
    e: React.DragEvent<HTMLDivElement>,
    type: "photo" | "video"
  ) => {
    e.preventDefault();
    e.stopPropagation();

    const files = e.dataTransfer.files;

    if (files && files.length > 0) {
      const file = files[0];

      setFormData(prev => ({
        ...prev,
        [type]: file,
      }));

      e.dataTransfer.clearData();
    }
  };

  // ✅ INITIAL STATE - For reset
  const initialFormState = {
    mainCategoryId: "",
    subCategoryId: "",
    childCategoryId: "",
    deepChildCategoryId: initialDeepChildCategoryId || "",
    subDeepKey: "",

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

    subDeepCategoryVisible: true,
  };

  const [formData, setFormData] = useState(initialFormState);

  // ✅ UI State
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
  const [deepCategoriesLocal, setDeepCategoriesLocal] = useState<any[]>([]);
  const [deepSearch, setDeepSearch] = useState("");
  const [deepOpen, setDeepOpen] = useState(false);
  const [selectedDeepCategory, setSelectedDeepCategory] = useState<any>(null);

  const gstOptions = ["0", "5", "12", "18", "28"];
  const gstTypeOptions = [
    { value: "inclusive", label: "Include GST" },
    { value: "exclusive", label: "Exclude GST" },
  ];

  // ✅ RESET FORM FUNCTION
  const resetForm = () => {
    setFormData(initialFormState);
    setMainSearch("");
    setSubSearch("");
    setChildSearch("");
    setDeepSearch("");
    setSelectedMainCategory(null);
    setSelectedChildCategory(null);
    setSelectedDeepCategory(null);
    setSubCategories([]);
    setChildCategoriesLocal([]);
    setDeepCategoriesLocal([]);
    setMainOpen(false);
    setSubOpen(false);
    setChildOpen(false);
    setDeepOpen(false);
  };

  // ✅ LOAD EDITING DATA
  useEffect(() => {
    if (editingCategory) {
      setFormData({
        mainCategoryId: editingCategory.mainCategoryId || "",
        subCategoryId: editingCategory.subCategoryId || "",
        childCategoryId: editingCategory.childCategoryId || "",
        deepChildCategoryId: editingCategory.deepChildCategoryId || initialDeepChildCategoryId || "",
        subDeepKey: editingCategory.id || editingCategory.subDeepKey || editingCategory.documentId || "",

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

        subDeepCategoryVisible: editingCategory.subDeepCategoryVisible ?? editingCategory.visible ?? true,
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
      }

      if (editingCategory.deepChildCategoryId) {
        setDeepSearch(editingCategory.deepChildCategoryName || editingCategory.deepChildCategoryId);
        setSelectedDeepCategory({ name: editingCategory.deepChildCategoryName || editingCategory.deepChildCategoryId });
      }
    }
  }, [editingCategory, mainCategories, initialDeepChildCategoryId]);

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
        const url = `https://api.bijliwalaaya.in/api/product-listing/main/${selectedMainCategory._id}/sub`;
        const res = await fetch(url, {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
            "x-api-token": "super_secure_token",
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
          const url = `https://api.bijliwalaaya.in/api/product-listing/main/${formData.mainCategoryId}/child`;
          const res = await fetch(url, {
            headers: {
              Authorization: token ? `Bearer ${token}` : "",
              "x-api-token": "super_secure_token",
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
          const url = `https://api.bijliwalaaya.in/api/product-listing/main/${formData.mainCategoryId}/sub/${formData.subCategoryId}/child`;
          const res = await fetch(url, {
            headers: {
              Authorization: token ? `Bearer ${token}` : "",
              "x-api-token": "super_secure_token",
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
    if (!formData.mainCategoryId || !formData.childCategoryId) {
      setDeepCategoriesLocal([]);
      return;
    }

    const fetchDeepCategories = async () => {
      try {
        const token = localStorage.getItem("token");
        let url = "";
        if (formData.subCategoryId) {
          url = `https://api.bijliwalaaya.in/api/product-listing/main/${formData.mainCategoryId}/sub/${formData.subCategoryId}/child/${formData.childCategoryId}/deep`;
        } else {
          url = `https://api.bijliwalaaya.in/api/product-listing/main/${formData.mainCategoryId}/child/${formData.childCategoryId}/deep`;
        }

        const res = await fetch(url, {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
            "x-api-token": "super_secure_token",
            "Content-Type": "application/json",
          },
        });
        const json = await res.json();
        const rawData = json?.data || {};
        const list = Object.entries(rawData).map(([key, value]: any) => ({
          id: key,
          documentId: key,
          firstTitle: value.firstTitle || key,
          name: value.firstTitle || key,
        }));
        setDeepCategoriesLocal(list);
      } catch (err) {
        console.error("Deep category API failed", err);
        setDeepCategoriesLocal([]);
      }
    };

    fetchDeepCategories();
  }, [formData.mainCategoryId, formData.subCategoryId, formData.childCategoryId]);

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
      deepChildCategoryId: "",
      subDeepKey: "",
    }));
    setSubSearch("");
    setChildSearch("");
    setDeepSearch("");
    setSelectedChildCategory(null);
    setSelectedDeepCategory(null);
  };

  const handleSubSelect = (sub: any) => {
    setSubSearch(sub.name);
    setSubOpen(false);
    setFormData(prev => ({
      ...prev,
      subCategoryId: sub.documentId,
      childCategoryId: "",
      deepChildCategoryId: "",
      subDeepKey: "",
    }));
    setChildSearch("");
    setDeepSearch("");
    setSelectedChildCategory(null);
    setSelectedDeepCategory(null);
  };

  const handleChildSelect = (child: any) => {
    setSelectedChildCategory({ name: child.name });
    setFormData(prev => ({
      ...prev,
      childCategoryId: child.documentId || child.name,
      deepChildCategoryId: "",
      subDeepKey: "",
    }));
    setChildSearch(child.name);
    setChildOpen(false);
    setDeepSearch("");
    setSelectedDeepCategory(null);
  };

  const handleDeepSelect = (deep: any) => {
    setSelectedDeepCategory({ name: deep.firstTitle || deep.name });
    setFormData(prev => ({
      ...prev,
      deepChildCategoryId: deep.id || deep.documentId || deep.name,
      subDeepKey: generateCategoryId(prev.firstTitle || "sub-deep"),
    }));
    setDeepSearch(deep.firstTitle || deep.name);
    setDeepOpen(false);
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

  // ✅ FIXED SAVE HANDLER - WITH IMAGE/VIDEO URL SUPPORT
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

  //   if (!formData.deepChildCategoryId) {
  //     alert("Select deep child category");
  //     return;
  //   }

  //   if (!formData.firstTitle.trim()) {
  //     alert("Enter first title");
  //     return;
  //   }

  //   setIsSaving(true);

  //   try {
  //     const subDeepKey = editingCategory
  //       ? formData.subDeepKey
  //       : generateCategoryId(formData.firstTitle);

  //     const priceAfterGst = calculatePriceAfterGst();
  //     const currentPrice = calculateCurrentPrice(priceAfterGst);

  //     const subDeepData: any = {
  //       mainCategoryId: formData.mainCategoryId,
  //       subCategoryId: formData.subCategoryId || null,
  //       childCategoryId: formData.childCategoryId,
  //       deepChildCategoryId: formData.deepChildCategoryId,
  //       subDeepKey,

  //       firstTitle: formData.firstTitle,
  //       secondTitle: formData.secondTitle,
  //       description: formData.description,
  //       subDeepCategoryVisible: formData.subDeepCategoryVisible,
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

  //       priceAfterGst,
  //       currentPrice,
  //       currentPriceVisible: true,

  //       firstTitleVisible: formData.firstTitleVisible,
  //       secondTitleVisible: formData.secondTitleVisible,
  //       descriptionVisible: formData.descriptionVisible,
  //       webviewUrlVisible: formData.webviewUrlVisible,
  //       originalPriceVisible: formData.originalPriceVisible,

  //       photoVisible: formData.photoVisible,
  //       videoVisible: formData.videoVisible,
  //     };

  //     // ✅ FIXED: Backend expects 'image' field, not 'imageUri'
  //     // ✅ File Upload (Priority 1)
  //     if (formData.photo instanceof File) {
  //       subDeepData.imageFile = formData.photo;
  //     } 
  //     // ✅ URL (Priority 2)
  //     else if (formData.imageUrl && formData.imageUrl.trim() !== "") {
  //       subDeepData.image = formData.imageUrl.trim();  // 🔥 imageUri → image
  //     }

  //     // ✅ FIXED: Backend expects 'video' field, not 'videoUri'
  //     if (formData.video instanceof File) {
  //       subDeepData.videoFile = formData.video;
  //     }
  //     else if (formData.videoUrl && formData.videoUrl.trim() !== "") {
  //       subDeepData.video = formData.videoUrl.trim();  // 🔥 videoUri → video
  //     }

  //     console.log("📦 SENDING SUB DEEP CHILD DATA:", {
  //       ...subDeepData,
  //       imageFile: subDeepData.imageFile ? subDeepData.imageFile.name : null,
  //       videoFile: subDeepData.videoFile ? subDeepData.videoFile.name : null,
  //       image: subDeepData.image,
  //       video: subDeepData.video
  //     });

  //     if (editingCategory) {
  //       await updateSubDeepChildCategory({
  //         ...subDeepData,
  //         documentId: formData.subDeepKey,
  //       });
  //       alert("✅ Sub Deep Category Updated");
  //     } else {
  //       await addSubDeepChildCategory(subDeepData);
  //       alert("✅ Sub Deep Category Added");

  //       // ✅ RESET FORM AFTER SUCCESSFUL ADD
  //       resetForm();
  //     }

  //     onSuccess?.();
  //   } catch (e) {
  //     console.error(e);
  //     alert("Failed to save Sub Deep Category");
  //   } finally {
  //     setIsSaving(false);
  //   }
  // };
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

    if (!formData.deepChildCategoryId) {
      alert("Select deep child category");
      return;
    }

    if (!formData.firstTitle.trim()) {
      alert("Enter first title");
      return;
    }

    setIsSaving(true);

    try {
      const subDeepKey = editingCategory
        ? formData.subDeepKey
        : generateCategoryId(formData.firstTitle);

      const subDeepData: any = {
        mainCategoryId: formData.mainCategoryId,
        subCategoryId: formData.subCategoryId || null,
        childCategoryId: formData.childCategoryId,
        deepChildCategoryId: formData.deepChildCategoryId,
        subDeepKey,

        firstTitle: formData.firstTitle,
        secondTitle: formData.secondTitle,
        description: formData.description,
        subDeepCategoryVisible: formData.subDeepCategoryVisible,
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

        firstTitleVisible: formData.firstTitleVisible,
        secondTitleVisible: formData.secondTitleVisible,
        descriptionVisible: formData.descriptionVisible,
        webviewUrlVisible: formData.webviewUrlVisible,
        originalPriceVisible: formData.originalPriceVisible,
        photoVisible: formData.photoVisible,
        videoVisible: formData.videoVisible,
      };

      // 🔹 Image
      if (formData.photo instanceof File) {
        subDeepData.imageFile = formData.photo;
      } else if (formData.imageUrl?.trim()) {
        subDeepData.image = formData.imageUrl.trim();
      }

      // 🔹 Video
      if (formData.video instanceof File) {
        subDeepData.videoFile = formData.video;
      } else if (formData.videoUrl?.trim()) {
        subDeepData.video = formData.videoUrl.trim();
      }

      if (editingCategory) {
        await updateSubDeepChildCategory({
          ...subDeepData,
          documentId: formData.subDeepKey,
        });
        alert("✅ Sub Deep Category Updated");
      } else {
        await addSubDeepChildCategory(subDeepData);
        alert("✅ Sub Deep Category Added");
        resetForm();
      }

      onSuccess?.();

    } catch (e) {
      console.error(e);
      alert("Failed to save Sub Deep Category");
    } finally {
      setIsSaving(false);
    }
  };

  const filteredMainCategories = mainCategories
    .filter(cat => cat?.name && cat.name.toLowerCase().includes(mainSearch.toLowerCase()))
    .filter((_, i, arr) => mainSearch ? true : i < 5);

  const filteredSubCategories = subCategories
    .filter(sub => sub?.name && sub.name.toLowerCase().includes(subSearch.toLowerCase()));

  const filteredChildCategories = childCategoriesLocal
    .filter(child => child?.name && child.name.toLowerCase().includes(childSearch.toLowerCase()));

  const filteredDeepCategories = deepCategoriesLocal
    .filter(deep => deep?.firstTitle?.toLowerCase().includes(deepSearch.toLowerCase()) ||
      deep?.name?.toLowerCase().includes(deepSearch.toLowerCase()));

  const shouldShowDeepSelect = formData.childCategoryId && childCategoriesLocal.length > 0;

  return (
    <div className="rounded-lg border border-purple-500 bg-gray-100 p-4 shadow-md">
      <div className="mb-6 flex items-center justify-between rounded-md border-2 border-blue-900 bg-white px-4 py-3">
        <span className="text-xl font-bold text-gray-900">
          {editingCategory ? "Edit" : "Manage"} Sub Deep Child Category
        </span>
        <div className="flex items-center gap-4">
          {formData.subDeepKey && !editingCategory && (
            <div className="rounded-md bg-blue-100 px-3 py-1">
              <span className="text-sm font-semibold text-blue-800">ID: {formData.subDeepKey}</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-gray-700">Visibility</span>
            <button
              onClick={() => handleToggle('subDeepCategoryVisible')}
              className={`relative inline-block h-6 w-12 cursor-pointer rounded-full transition-colors duration-200 ${formData.subDeepCategoryVisible ? "bg-green-500" : "bg-gray-300"
                }`}
            >
              <div
                className={`absolute top-0 h-6 w-6 rounded-full bg-white shadow-md transition-transform duration-200 ${formData.subDeepCategoryVisible ? "translate-x-6" : "translate-x-0"
                  }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* ✅ Live Preview for Sub Deep Child Category — clean admin style */}
      <div style={{ background: "#fff", border: "1.5px solid #bfcfff", borderRadius: "10px", padding: "12px 14px", marginBottom: "16px" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1d4ed8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" /></svg>
            <span style={{ fontSize: "12px", fontWeight: "600", color: "#1d4ed8" }}>Live Preview</span>
          </div>
          <span style={{ fontSize: "11px", fontWeight: "600", color: formData.subDeepCategoryVisible ? "#16a34a" : "#dc2626" }}>
            {formData.subDeepCategoryVisible ? "Visible" : "Hidden"}
          </span>
        </div>
        {/* Content */}
        <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
          {/* Image */}
          <div style={{ width: "56px", height: "56px", borderRadius: "8px", flexShrink: 0, background: "#f8fafc", border: "1.5px dashed #cbd5e1", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
            {formData.photo instanceof File ? (
              <img src={URL.createObjectURL(formData.photo)} alt="preview" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "7px" }} />
            ) : formData.imageUrl ? (
              <img src={formData.imageUrl} alt="preview" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "7px" }} onError={(e) => { (e.target as HTMLImageElement).style.display = "none" }} />
            ) : (
              <ImageIcon size={20} color="#94a3b8" />
            )}
          </div>
          {/* Info */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ margin: "0 0 2px 0", fontWeight: "700", fontSize: "14px", color: formData.firstTitle ? "#111827" : "#9ca3af", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {formData.firstTitle || "First Title..."}
            </p>
            {formData.secondTitle && (
              <p style={{ margin: "0 0 4px 0", fontSize: "12px", color: "#64748b", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{formData.secondTitle}</p>
            )}
            {formData.description && (
              <p style={{ margin: "0 0 6px 0", fontSize: "11px", color: "#9ca3af" }}>{formData.description.slice(0, 80)}{formData.description.length > 80 ? "..." : ""}</p>
            )}
            {/* Price */}
            {formData.originalPrice && (() => {
              const orig = parseFloat(formData.originalPrice) || 0;
              const discVal = parseFloat(formData.discountValue) || 0;
              const afterDisc = formData.discountType === "percentage" ? Math.max(0, orig - orig * discVal / 100) : Math.max(0, orig - discVal);
              const gstRate = parseFloat(formData.gst) || 0;
              const total = formData.gstType === "inclusive" ? afterDisc : afterDisc + (afterDisc * gstRate / 100);
              return (
                <div style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap" as const, marginBottom: "4px" }}>
                  <span style={{ fontSize: "14px", fontWeight: "800", color: "#111827" }}>₹{total.toFixed(0)}</span>
                  {discVal > 0 && <span style={{ fontSize: "11px", textDecoration: "line-through", color: "#9ca3af" }}>₹{orig}</span>}
                  {discVal > 0 && <span style={{ fontSize: "10px", padding: "1px 6px", borderRadius: "20px", background: "#eff6ff", color: "#1d4ed8", border: "1px solid #dbeafe", fontWeight: "600" }}>{formData.discountType === "percentage" ? `${discVal}% OFF` : `₹${discVal} OFF`}</span>}
                  {gstRate > 0 && <span style={{ fontSize: "10px", padding: "1px 6px", borderRadius: "20px", background: "#f0fdf4", color: "#15803d", border: "1px solid #bbf7d0", fontWeight: "600" }}>GST {gstRate}%</span>}
                </div>
              );
            })()}
            {/* Time */}
            {(formData.minTime || formData.maxTime) && (
              <div style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "11px", color: "#64748b" }}>
                <Clock size={11} />
                <span>{formData.minTime || "?"} – {formData.maxTime || "?"} mins</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mb-6 space-y-6 rounded-lg border border-gray-300 bg-white p-4">
        <h3 className="font-bold text-gray-900 border-b pb-2">Category Selection</h3>

        <div className="relative">
          <label className="mb-2 block font-bold text-gray-900">Select Main Category *</label>
          <input
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
            <div className="absolute z-50 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
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
                      <span className={`text-xs px-2 py-1 rounded ${cat.hasSubCategory ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
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
              <div className="absolute z-40 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
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
            <div className="absolute z-30 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
              {filteredChildCategories.length > 0 ? (
                filteredChildCategories.map(child => (
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

        {shouldShowDeepSelect && (
          <div className="relative">
            <label className="mb-2 block font-bold text-gray-900">Select Deep Child Category *</label>
            <input
              type="text"
              value={deepSearch}
              placeholder="Search deep child category..."
              onChange={(e) => {
                setDeepSearch(e.target.value);
                setDeepOpen(true);
              }}
              onFocus={() => setDeepOpen(true)}
              className="w-full rounded-md border-2 border-blue-900 px-3 py-2"
            />

            {deepOpen && (
              <div className="absolute z-20 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                {filteredDeepCategories.length > 0 ? (
                  filteredDeepCategories.map(deep => (
                    <div
                      key={deep.id || deep.documentId}
                      className="cursor-pointer px-4 py-3 hover:bg-blue-50"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        handleDeepSelect(deep);
                      }}
                    >
                      <span className="font-medium">{deep.firstTitle || deep.name}</span>
                    </div>
                  ))
                ) : (
                  <div className="px-4 py-3 text-gray-500">
                    {deepCategoriesLocal.length === 0 ? "Loading deep categories..." : "No matches found"}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>


      <>
        <div className="mb-6 rounded-md border-2 border-purple-600 bg-purple-50 p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-purple-800">✓ Deep Category Selected!</h3>
              <p className="text-xl font-semibold text-gray-900 mt-1">{selectedDeepCategory?.name}</p>
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

          <div className="space-y-4 rounded-lg border border-gray-300 bg-white p-4">
            <h3 className="font-bold text-gray-900 border-b pb-2">Pricing Details</h3>

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
                  type="text"
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
                      className={`w-10 h-5 rounded-full flex items-center justify-start p-1 transition-colors duration-200 ${formData.minTimeVisible ? 'bg-blue-600 justify-end' : 'bg-gray-400 justify-start'
                        }`}
                    >
                      <div className={`bg-white w-3 h-3 rounded-full shadow-md transform transition-transform duration-200 ${formData.minTimeVisible ? 'translate-x-5' : 'translate-x-0'
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
                      className={`w-10 h-5 rounded-full flex items-center justify-start p-1 transition-colors duration-200 ${formData.maxTimeVisible ? 'bg-blue-600 justify-end' : 'bg-gray-400 justify-start'
                        }`}
                    >
                      <div className={`bg-white w-3 h-3 rounded-full shadow-md transform transition-transform duration-200 ${formData.maxTimeVisible ? 'translate-x-5' : 'translate-x-0'
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
            {/* <div className="rounded-md border border-gray-300 p-4"> */}
            <div
              className="rounded-md border-2 border-dashed border-gray-400 p-4 hover:border-blue-600 transition-colors"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, "photo")}
            >

              <div className="flex items-center justify-between mb-3">
                <div>
                  <label className="block font-medium text-gray-900">Image Upload</label>
                  <p className="text-xs text-gray-500">Upload file OR enter URL</p>
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
            {/* <div className="rounded-md border border-gray-300 p-4"> */}
            <div
              className="rounded-md border-2 border-dashed border-gray-400 p-4 hover:border-blue-600 transition-colors"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, "video")}
            >

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
            className="flex items-center gap-2 rounded-lg bg-purple-600 hover:bg-purple-700 px-6 py-3 font-bold text-white transition-all hover:scale-105 active:scale-95 shadow-lg disabled:opacity-70"
          >
            <Save size={20} />
            {isSaving ? "Saving..." : editingCategory ? "Update" : "Save"} Sub Deep Category
          </button>
        </div>
      </>

    </div>
  );
};

export default SubDeepChildCategoryForm;