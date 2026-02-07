"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import axios from 'axios';
import { api } from '../utils/api';
import { generateCategoryId } from '../utils/generateCategoryId';




const BASE_URL = process.env.NEXT_PUBLIC_API_DOMAIN
  ? `${process.env.NEXT_PUBLIC_API_DOMAIN}/api/product-listing`
  : 'https://api.bijliwalaaya.in/api/product-listing';
const API_TOKEN = process.env.NEXT_PUBLIC_API_TOKEN || "super_secure_token";
// Define Types
// export interface MainCategory {
//   _id: string;                 
//   name: string;
//   image: string | null;
//   visible: boolean;
//   isSubCategory: boolean;
//   parentCategory?: string | null;
// }
export interface MainCategory {
  _id: string;
  name: string;

  isMainCategoryVisible: boolean;
  isMainCategoryNameVisible: boolean;
  isMainCategoryImageVisible: boolean;

  hasSubCategory: boolean;
  parentId?: string | null;

  imageUri?: string | null;
  imageFile?: File | null;
}

// Sub Category Interface
export interface SubCategory {
  documentId: string;
  name: string;
  mainCategoryId: string;
  visible: boolean;
  isSubCategoryVisible: boolean;
  isSubCategoryNameVisible: boolean; // Added this field
  isSubCategoryImageVisible: boolean;
  imageUri?: string | null;
  hasChild?: boolean;
  hasSubCategory?: boolean;
}

// Child Category Interface
export interface ChildCategory {
  documentId: string;
  name: string;
  subCategoryId?: string;
  mainCategoryId?: string; // ✅ Added mainCategoryId
  imageUri?: string | null;
  isChildCategoryVisible?: boolean;
  visible?: boolean;
}

// Deep Child Category Interface
// Deep Child Category Interface
export interface DeepChildCategory {
  id: string;
  documentId?: string; // Add this if inconsistent
  childCategoryId: string;
  childCategoryName: string; // denormalized

  // Content
  firstTitle: string;
  secondTitle: string;
  description: string;

  // URLs & Media
  webviewUrl?: string;
  imageUri?: string | null;

  // Pricing & Time
  originalPrice?: number;
  discountType?: string; // "%" | "Flat"
  discountValue?: number;
  gst?: number;
  gstType?: string;
  priceAfterGst?: number;
  currentPrice?: number;
  minTime?: number | string;
  maxTime?: number | string;

  // Visibility (Main)
  visible?: boolean;
  deepCategoryVisible?: boolean; // Sometimes used as main visibility

  // Field Visibility Flags
  firstTitleVisible?: boolean;
  secondTitleVisible?: boolean;
  descriptionVisible?: boolean;
  webviewUrlVisible?: boolean;
  originalPriceVisible?: boolean;
  currentPriceVisible?: boolean;
  minTimeVisible?: boolean;
  maxTimeVisible?: boolean;
  photoVisible?: boolean;
  videoVisible?: boolean;
  childCatVideosVisible?: boolean;

  // Navigation Context (For Updates)
  mainCategoryId?: string;
  subCategoryId?: string | null;
}

// Sub Deep Child Category Interface
export interface SubDeepChildCategory {
  id: string;
  subDeepKey?: string;
  documentId?: string;

  // Navigation
  deepChildCategoryId: string;
  childCategoryId: string; // needed for path
  mainCategoryId?: string; // needed for path
  subCategoryId?: string | null;

  deepChildCategoryName: string;

  // Content
  firstTitle: string;
  secondTitle: string;
  description: string;
  webviewUrl?: string;

  // Visibility
  visible?: boolean; // main toggle usage
  subDeepCategoryVisible?: boolean;

  // Pricing & Time
  originalPrice?: number;
  discountType?: string;
  discountValue?: number;
  gst?: number;
  gstType?: string;
  priceAfterGst?: number;
  currentPrice?: number;
  minTime?: number | string;
  maxTime?: number | string;

  // Field Visibility flags
  firstTitleVisible?: boolean;
  secondTitleVisible?: boolean;
  descriptionVisible?: boolean;
  webviewUrlVisible?: boolean;
  originalPriceVisible?: boolean;
  currentPriceVisible?: boolean;
  minTimeVisible?: boolean;
  maxTimeVisible?: boolean;
  photoVisible?: boolean;
  videoVisible?: boolean;
  childCatVideosVisible?: boolean;
}

// Child Category V2 Interface
export interface ChildCategoryV2 {
  key: string; // The URL parameter
  name: string;
  visibility: boolean;
  images: {
    name: string;
    visibility: boolean;
    // Index-based keys "0", "1", ...
    [key: string]: any;
  };
  videos: {
    name: string;
    visibility: boolean;
    // Index-based keys "0", "1", ...
    [key: string]: any;
  };
  links: {
    name: string;
    visibility: boolean;
    // Index-based keys "0", "1", ...
    [key: string]: any;
  };
  updatedAt?: string;
}

interface CategoryContextType {
  addChildCategoryMedia: (
    mainId: string,
    type: "images" | "videos" | "links",
    item: {
      imageTitle?: string;
      videoTitle?: string;
      url?: string;
      file?: File;  // For file uploads
      visibility?: boolean;
    },
    subCategoryId?: string
  ) => Promise<void>;

  mainCategories: MainCategory[];
  subCategories: SubCategory[];
  childCategories: ChildCategory[];
  deepChildCategories: DeepChildCategory[];
  subDeepChildCategories: SubDeepChildCategory[];
  // V2 State
  childCategoriesV2: Record<string, ChildCategoryV2>; // Map key -> data

  fetchMainCategories: () => Promise<void>;
  fetchSubCategories: (mainId: string) => Promise<void>;
  fetchChildCategories: (mainId: string, subId: string | null) => Promise<void>;

  // Implementation uses (mainId, childId, subId)
  fetchDeepChildCategories: (mainId: string, childId: string, subId?: string | null) => Promise<void>;

  fetchSubDeepChildCategories: (mainId: string, childId: string, deepId: string, subId?: string | null) => void;

  updateMainCategory: (item: any) => Promise<void>;
  updateSubCategory: (item: any) => Promise<void>;
  updateChildCategory: (item: any) => Promise<void>;
  updateChildCategoryWithSub: (item: any) => Promise<void>;
  updateDeepChildCategory: (item: any) => Promise<void>;
  updateDeepChildCategoryWithSub: (item: any) => Promise<void>;
  updateSubDeepChildCategory: (item: any) => Promise<void>;

  // V2 Methods
  fetchChildCategoryMedia: (mainId: string, subId?: string) => Promise<any>;
  updateChildCategoryMediaByIndex: (
    mainId: string,
    type: "images" | "videos" | "links",
    index: number | string,
    payload: {
      imageTitle?: string;
      videoTitle?: string;
      linkTitle?: string;
      url?: string;
      visibility?: boolean;
    },
    subId?: string
  ) => Promise<void>;
  updateChildCategoryMediaGroup: (
    mainId: string,
    type: "images" | "videos" | "links",
    payload: {
      name?: string;
      visibility?: boolean;
    },
    subId?: string
  ) => Promise<void>;
  deleteChildCategoryMediaByIndex: (
    mainId: string,
    type: "images" | "videos" | "links",
    index: number | string,
    subId?: string
  ) => Promise<void>;

  deleteChildCategoryV2: (mainId: string, key: string, subCategoryId?: string) => Promise<void>;

  addMainCategory: (category: Omit<MainCategory, 'id'>) => Promise<void>;
  addSubCategory: (category: Omit<SubCategory, 'id'>) => Promise<void>;
  addChildCategory: (category: Omit<ChildCategory, 'id' | 'documentId'>) => Promise<void>;
  addDeepChildCategory: (category: Omit<DeepChildCategory, 'id'>) => Promise<void>;
  addSubDeepChildCategory: (category: Omit<SubDeepChildCategory, 'id'>) => void;

  deleteMainCategory: (id: string) => Promise<void>;
  deleteSubCategory: (id: string) => Promise<void>;
  deleteChildCategory: (id: string) => Promise<void>;
  deleteDeepChildCategory: (id: string) => Promise<void>;
  deleteSubDeepChildCategory: (id: string) => void;

  toggleMainVisibility: (id: string) => Promise<void>;
  toggleMainNameVisibility: (id: string) => Promise<void>;
  toggleMainImageVisibility: (id: string) => Promise<void>;
  toggleMainIsSub: (id: string) => Promise<void>;
  toggleSubVisibility: (id: string) => Promise<void>;
  toggleSubNameVisibility: (id: string) => Promise<void>; // Added this
  toggleSubImageVisibility: (id: string) => Promise<void>;
  toggleSubHasSubCategory: (id: string) => Promise<void>;

  toggleChildVisibility: (id: string) => Promise<void>;
  toggleDeepChildVisibility: (id: string, field?: string) => Promise<void>;
  toggleSubDeepChildVisibility: (id: string, field?: string) => void;
  isLoadingSubDeep: boolean;
}

const CategoryContext = createContext<CategoryContextType | undefined>(undefined);

const getAuthHeaders = (isFormData = false) => {
  const token = localStorage.getItem("token");

  const headers: any = {
    "x-api-token": API_TOKEN,
    Authorization: token ? `Bearer ${token}` : "",
  };

  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }

  return headers;
};

export const CategoryProvider = ({ children }: { children: ReactNode }) => {
  const [mainCategories, setMainCategories] = useState<MainCategory[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [childCategories, setChildCategories] = useState<ChildCategory[]>([]);
  const [deepChildCategories, setDeepChildCategories] = useState<DeepChildCategory[]>([]);
  const [subDeepChildCategories, setSubDeepChildCategories] = useState<SubDeepChildCategory[]>([]); // Local state for SubDeep
  const [isLoadingSubDeep, setIsLoadingSubDeep] = useState<boolean>(false);
  const [childCategoriesV2, setChildCategoriesV2] = useState<Record<string, ChildCategoryV2>>({});
  const [childCategoryMedia, setChildCategoryMedia] = useState<any>(null);

  // FETCH MAIN DATA ON MOUNT
  useEffect(() => {
    fetchMainCategories();
  }, []);

  const fetchMainCategories = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(BASE_URL + "/main", {
        headers: {
          "Content-Type": "application/json",
          "x-api-token": API_TOKEN,
          Authorization: token ? `Bearer ${token}` : "",
        },
      });

      const data = response.data;
      const rawList =
        Array.isArray(data?.data)
          ? data.data
          : Array.isArray(data?.result)
            ? data.result
            : [];

      // Map to ensure interface compliance
      const list = rawList.map((item: any) => ({
        _id: item.documentId || item._id,
        documentId: item.documentId,
        name: item.name,
        imageUri: item.imageUri || item.image,

        // Normalizing visibility
        isMainCategoryVisible: item.isMainCategoryVisible ?? item.visible ?? true,
        isMainCategoryNameVisible: item.isMainCategoryNameVisible ?? true,
        isMainCategoryImageVisible: item.isMainCategoryImageVisible ?? true,

        // Normalizing sub-category flag
        hasSubCategory: item.hasSubCategory ?? item.isSubCategory ?? false,
        parentId: item.parentId,

      }));

      console.log("🔥 MAIN CATEGORY LIST:", list);

      setMainCategories(list);

    } catch (error: any) {
      console.error(
        "Failed to fetch main categories:",
        error?.response?.status,
        error?.response?.data
      );
      // alert("Failed to fetch main categories."); 
    }
  };

  // const updateMainCategory = async (item: any) => {
  //   try {
  //     const token = localStorage.getItem("token");

  //     // ✅ SAME FIELDS JO FETCH ME USE HO RAHE HAIN
  //     const payload = {
  //       name: item.name,
  //       imageUri: item.imageUri || null,

  //       // visibility fields
  //       isMainCategoryVisible: item.isMainCategoryVisible,
  //       isMainCategoryNameVisible: item.isMainCategoryNameVisible,
  //       isMainCategoryImageVisible: item.isMainCategoryImageVisible,

  //       // sub-category flag
  //       hasSubCategory: item.hasSubCategory,

  //       // optional
  //       parentId: item.parentId || null,
  //     };

  //     console.log("📦 MAIN UPDATE PAYLOAD:", payload);

  //     await axios.put(
  //       `${BASE_URL}/main/${item._id}`,
  //       payload,
  //       {
  //         headers: {
  //           "Content-Type": "application/json",
  //           "x-api-token": API_TOKEN,
  //           Authorization: token ? `Bearer ${token}` : "",
  //         },
  //       }
  //     );

  //     // 🔥 REFRESH UI FROM MONGO
  //     await fetchMainCategories();

  //     console.log("✅ Main category updated successfully");

  //   } catch (error: any) {
  //     console.error(
  //       "❌ Failed to update main category:",
  //       error?.response?.status,
  //       error?.response?.data || error.message
  //     );
  //   }
  // };



  // Helper to fetch subs for a main
  // =======================
  // 🔥 FETCH SUB CATEGORIES (FINAL & CORRECT)
  // =======================

  const updateMainCategory = async (item: any) => {
    const token = localStorage.getItem("token");

    const formData = new FormData();
    formData.append("name", item.name);

    // Boolean fields need string conversion for FormData
    formData.append("isMainCategoryVisible", String(item.isMainCategoryVisible));
    formData.append("isMainCategoryNameVisible", String(item.isMainCategoryNameVisible));
    formData.append("isMainCategoryImageVisible", String(item.isMainCategoryImageVisible));
    formData.append("hasSubCategory", String(item.hasSubCategory));

    if (item.parentId) {
      formData.append("parentId", item.parentId);
    }

    // Only append image if it's a new file (File object)
    if (item.imageFile instanceof File) {
      formData.append("imageUri", item.imageFile);
    }

    try {
      await axios.put(
        `${BASE_URL}/main/${item._id}`,
        formData,
        {
          headers: {
            "x-api-token": API_TOKEN,
            Authorization: token ? `Bearer ${token}` : "",
          },
        }
      );

      await fetchMainCategories();
    } catch (error: any) {
      console.error(
        "❌ Failed to update main category:",
        error?.response?.status,
        error?.response?.data || error.message
      );
      throw error; // Propagate error so form knows it failed
    }
  };
  const updateSubCategory = async (item: any) => {
    const formData = new FormData();

    formData.append("name", item.name);
    formData.append("mainCategory", item.mainCategoryId);

    formData.append("isSubCategoryVisible", String(item.isSubCategoryVisible));
    formData.append("isSubCategoryNameVisible", String(item.isSubCategoryNameVisible));
    formData.append("isSubCategoryImageVisible", String(item.isSubCategoryImageVisible));

    if (item.imageFile instanceof File) {
      formData.append("imageUri", item.imageFile);
    }

    try {
      await axios.put(
        `${BASE_URL}/main/${item.mainCategoryId}/sub/${item.documentId}`,
        formData,
        { headers: getAuthHeaders() }
      );
    } catch (err) {
      console.error("❌ Failed to update sub category", err);
      throw err;
    }
  };
  const updateChildCategory = async (item: any) => {
    const formData = new FormData();

    formData.append("name", item.name);
    formData.append("visibility", String(item.visible));

    if (item.imageFile instanceof File) {
      formData.append("imageUri", item.imageFile);
    }

    try {
      await axios.put(
        `${BASE_URL}/main/${item.mainCategoryId}/child/${item.documentId}`,
        formData,
        { headers: getAuthHeaders() }
      );
    } catch (err) {
      console.error("❌ Failed to update child category", err);
      throw err;
    }
  };
  const updateChildCategoryWithSub = async (item: any) => {
    const formData = new FormData();

    formData.append("name", item.name);
    formData.append("visibility", String(item.visible));

    if (item.imageFile instanceof File) {
      formData.append("imageUri", item.imageFile);
    }

    try {
      await axios.put(
        `${BASE_URL}/main/${item.mainCategoryId}/sub/${item.subCategoryId}/child/${item.documentId}`,
        formData,
        { headers: getAuthHeaders() }
      );
    } catch (err) {
      console.error("❌ Failed to update child category (sub)", err);
      throw err;
    }
  };
  const updateDeepChildCategory = async (item: any) => {
    const formData = new FormData();

    formData.append("documentId", item.documentId);
    formData.append("firstTitle", item.firstTitle);
    formData.append("secondTitle", item.secondTitle);
    formData.append("description", item.description);

    formData.append("deepCategoryVisible", String(item.deepCategoryVisible));

    formData.append("firstTitleVisible", String(item.firstTitleVisible));
    formData.append("secondTitleVisible", String(item.secondTitleVisible));
    formData.append("descriptionVisible", String(item.descriptionVisible));

    formData.append("originalPrice", String(item.originalPrice ?? ""));
    formData.append("currentPrice", String(item.currentPrice ?? ""));
    formData.append("priceAfterGst", String(item.priceAfterGst ?? ""));

    if (item.imageFile instanceof File) {
      formData.append("imageUri", item.imageFile);
    }

    try {
      await axios.put(
        `${BASE_URL}/main/${item.mainCategoryId}/child/${item.childCategoryId}/deep/${item.documentId}`,
        formData,
        { headers: getAuthHeaders() }
      );
    } catch (err) {
      console.error("❌ Failed to update deep child", err);
      throw err;
    }
  };
  const updateDeepChildCategoryWithSub = async (item: any) => {
    const formData = new FormData();

    formData.append("documentId", item.documentId);
    formData.append("firstTitle", item.firstTitle);
    formData.append("secondTitle", item.secondTitle);
    formData.append("description", item.description);

    formData.append("deepCategoryVisible", String(item.deepCategoryVisible));

    if (item.imageFile instanceof File) {
      formData.append("imageUri", item.imageFile);
    }

    try {
      await axios.put(
        `${BASE_URL}/main/${item.mainCategoryId}/sub/${item.subCategoryId}/child/${item.childCategoryId}/deep/${item.documentId}`,
        formData,
        { headers: getAuthHeaders() }
      );
    } catch (err) {
      console.error("❌ Failed to update deep child (sub)", err);
      throw err;
    }
  };
  const updateSubDeepChildCategory = async (item: any) => {
    const formData = new FormData();

    formData.append("documentId", item.documentId);
    formData.append("firstTitle", item.firstTitle);
    formData.append("secondTitle", item.secondTitle);
    formData.append("description", item.description);

    formData.append("subDeepCategoryVisible", String(item.subDeepCategoryVisible));

    if (item.imageFile instanceof File) {
      formData.append("imageUri", item.imageFile);
    }

    const baseUrl = item.subCategoryId
      ? `${BASE_URL}/main/${item.mainCategoryId}/sub/${item.subCategoryId}/child/${item.childCategoryId}/deep/${item.deepChildCategoryId}/sub/${item.documentId}`
      : `${BASE_URL}/main/${item.mainCategoryId}/child/${item.childCategoryId}/deep/${item.deepChildCategoryId}/sub/${item.documentId}`;

    try {
      await axios.put(baseUrl, formData, {
        headers: getAuthHeaders(),
      });
    } catch (err) {
      console.error("❌ Failed to update sub-deep child", err);
      throw err;
    }
  };



  const fetchSubCategories = async (mainId: string) => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        `${BASE_URL}/main/${mainId}/sub`,
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
            "x-api-token": API_TOKEN,
          },
        }
      );

      // Robust data extraction
      let raw = res.data?.data;
      if (!raw && Array.isArray(res.data?.result)) raw = res.data?.result;
      if (!raw && (Array.isArray(res.data) || typeof res.data === 'object')) raw = res.data;
      if (!raw) raw = {};

      console.log("🔥 FETCH SUB RAW:", raw);

      let subs: any[] = [];

      // Find parent name
      const parentName = mainCategories.find(m => m._id === mainId)?.name || "Root";

      if (Array.isArray(raw)) {
        subs = raw.map((item: any) => ({
          documentId: item.documentId || item._id || item.id,
          name: item.name,
          imageUri: item.imageUri || item.image,
          visible: item.visible ?? item.isSubCategoryVisible ?? true,
          hasChild: true,
          hasSubCategory: true,
          mainCategoryId: mainId,
          parentName: parentName, // Add explicit parent name
          isSubCategoryVisible: item.isSubCategoryVisible ?? item.visible ?? true,
          isSubCategoryNameVisible: item.isSubCategoryNameVisible ?? true, // Default to true
          isSubCategoryImageVisible: item.isSubCategoryImageVisible ?? true,
        }));
      } else {
        // Object entries map - IMPORTANT: 'raw' is object with keys as IDs
        subs = Object.entries(raw).map(([key, value]: any) => ({
          documentId: key,
          name: value.name,
          imageUri: value.imageUri || value.image,
          visible: value.visible ?? value.isSubCategoryVisible ?? true,
          hasChild: true,
          hasSubCategory: value.hasSubCategory ?? value.isSubCategory ?? true,
          mainCategoryId: mainId,
          rawChild: value,
          parentName: parentName,
          isSubCategoryVisible: value.isSubCategoryVisible ?? value.visible ?? true,
          isSubCategoryNameVisible: value.isSubCategoryNameVisible ?? true, // Default to true
          isSubCategoryImageVisible: value.isSubCategoryImageVisible ?? true,
        }));
      }

      setSubCategories(subs);



    } catch (err) {
      console.error("❌ Error fetching sub categories:", err);
      setSubCategories([]);
      setChildCategories([]);
    }
  };





  // subCategories






  // Helper for children
  const fetchChildCategories = async (
    mainId: string,
    subId?: string | null
  ) => {
    setChildCategories([]);
    try {
      if (!mainId) {
        console.warn("❗ mainId missing");
        setChildCategories([]);
        return;
      }

      const token = localStorage.getItem("token");

      const url = subId
        ? `${BASE_URL}/main/${mainId}/sub/${subId}/child`
        : `${BASE_URL}/main/${mainId}/child`;

      console.log("🚀 CHILD CATEGORY URL:", url);

      const response = await axios.get(url, {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
          "x-api-token": API_TOKEN,
          "Content-Type": "application/json",
        },
      });

      console.log("🔥 RAW CHILD CATEGORY RESPONSE:", response.data);

      /**
       * ✅ BACKEND RESPONSE FORMAT
       * {
       *   success: true,
       *   data: {
       *     childId1: {...},
       *     childId2: {...}
       *   }
       * }
       */

      const rawData = response.data?.data || {};

      // Determine parent name
      let parentName = "Root";
      if (subId) {
        parentName = subCategories.find(s => (s.documentId || (s as any)._id) === subId)?.name || "Sub Category";
      } else {
        parentName = mainCategories.find(m => m._id === mainId)?.name || "Main Category";
      }

      // ✅ OBJECT → ARRAY CONVERSION (IMPORTANT FIX)
      // ✅ OBJECT → ARRAY CONVERSION (IMPORTANT FIX)
      const list = Array.isArray(rawData)
        ? rawData.map((item: any) => ({
          ...item,
          parentName,
          mainCategoryId: mainId,
          subCategoryId: subId
        }))
        : Object.entries(rawData).map(([id, value]: any) => ({
          documentId: id,
          ...value,
          parentName,
          mainCategoryId: mainId,
          subCategoryId: subId
        }));

      console.log("✅ FINAL CHILD CATEGORY LIST:", list);

      setChildCategories(list);
    } catch (error: any) {
      console.error(
        "❌ Error fetching child categories:",
        error?.response?.status,
        error?.response?.data || error.message
      );
      setChildCategories([]);
    }
  };



  // Helper for deep children
  const fetchDeepChildCategories = async (
    mainId: string,
    childId: string,
    subId?: string | null
  ) => {
    setDeepChildCategories([]);
    try {
      if (!mainId || !childId) {
        console.error("❌ Missing IDs for Deep Fetch:", { mainId, childId });
        return;
      }

      let url = "";

      // 🔥 CASE 1: WITH SUB CATEGORY
      if (subId) {
        url = `${BASE_URL}/main/${mainId}/sub/${subId}/child/${childId}/deep`;
      }
      // 🔥 CASE 2: WITHOUT SUB CATEGORY
      else {
        url = `${BASE_URL}/main/${mainId}/child/${childId}/deep`;
      }

      console.log("🚀 FETCH DEEP URL:", url);

      const res = await api.get(url);
      console.log("🔥 FULL API RESPONSE:", res); // Debug full response
      const rawData = res.data?.data || {};
      console.log("🔥 RAW DATA FROM API:", rawData); // Debug raw data

      // 🔥 OBJECT → ARRAY FIX & INJECT PARENT IDs
      const list = (Array.isArray(rawData)
        ? rawData
        : Object.entries(rawData).map(([id, value]: any) => ({
          documentId: id,
          ...value,
        }))).map((item: any) => ({
          ...item,
          mainCategoryId: mainId,
          childCategoryId: childId,
          subCategoryId: subId
        }));

      console.log("✅ FINAL DEEP CHILD LIST (Set to State):", list);

      setDeepChildCategories(list);
    } catch (error: any) {
      console.error("❌ Error fetching deep child categories:", error);
      setDeepChildCategories([]);
    }
  };
  /* ===============================
      FETCH SUB DEEP CHILD CATEGORIES (FIXED)
  =============================== */

  const fetchSubDeepChildCategories = async (
    mainId: string,
    childKey: string,
    deepKey: string,
    subId?: string | null
  ) => {
    try {
      if (!mainId || !childKey || !deepKey) {
        console.error("❌ Missing keys for Sub Deep Fetch:", { mainId, childKey, deepKey });
        return [];
      }

      setIsLoadingSubDeep(true); // START LOADING
      let url = "";

      // Ensure subId is a valid non-empty string
      if (subId && typeof subId === 'string' && subId.trim() !== "") {
        url = `${BASE_URL}/main/${mainId}/sub/${subId}/child/${childKey}/deep/${deepKey}/sub`;
      } else {
        url = `${BASE_URL}/main/${mainId}/child-key/${childKey}/deep/${deepKey}/sub`;
      }

      console.log("🚀 FETCH SUB-DEEP URL:", url);

      const res = await api.get(url);

      // Detailed Debugging
      console.log("🧪 SUB-DEEP RESPONSE STATUS:", res.status);
      try {
        console.log("🧪 SUB-DEEP RESPONSE BODY:", JSON.stringify(res.data, null, 2));
      } catch (e) { console.log("🧪 SUB-DEEP RESPONSE BODY (Unstringifyable):", res.data); }


      // Helper to find the payload
      const findPayload = (obj: any): any => {
        if (!obj) return [];

        // 1. Direct Array
        if (Array.isArray(obj)) return obj;

        // 2. Known Wrapper Keys (Prioritized)
        // Check for plural/singular specific keys
        if (obj.subDeepChildCategories && typeof obj.subDeepChildCategories === 'object') {
          return findPayload(obj.subDeepChildCategories); // Recurse to handle if it's an array or map
        }
        if (obj.subDeepChildCategory && typeof obj.subDeepChildCategory === 'object') {
          return findPayload(obj.subDeepChildCategory);
        }

        // 3. Generic Data Keys (Only if they contain substantial data)
        if (obj.data && typeof obj.data === 'object' && Object.keys(obj.data).length > 0) {
          return findPayload(obj.data);
        }
        if (obj.result && typeof obj.result === 'object' && Object.keys(obj.result).length > 0) {
          return findPayload(obj.result);
        }

        // 4. Fallback: Assume the object itself is the map if it has keys that aren't metadata
        const keys = Object.keys(obj);
        const isMetadata = (k: string) => ["success", "message", "status", "count", "docId"].includes(k);
        const hasDataKeys = keys.some(k => !isMetadata(k));

        if (hasDataKeys) {
          // Return object without metadata
          const { success, message, status, count, docId, ...rest } = obj;
          return rest;
        }

        return [];
      };

      let rawData = findPayload(res.data);
      console.log("🧪 EXTRACTED RAW DATA:", { type: Array.isArray(rawData) ? 'Array' : typeof rawData, keys: Object.keys(rawData || {}) });

      // Final processing
      let list: any[] = [];

      // Helper to flatten item data
      const flattenItem = (item: any) => {
        if (!item) return {};
        // Prioritize detailedData, then data, then the item itself
        const core = item.detailedData || item.data || item;
        // Ensure we keep the ID and external keys if core was nested
        return { ...item, ...core };
      };

      if (Array.isArray(rawData)) {
        list = rawData.map((rawItem: any) => {
          const item = flattenItem(rawItem);
          return {
            ...item,
            id: item.documentId || item._id || item.id,
            subDeepKey: item.documentId || item._id || item.id,
            mainCategoryId: mainId,
            childCategoryId: childKey,
            deepChildCategoryId: deepKey,
            subCategoryId: subId || null,
            subDeepCategoryVisible: item.subDeepCategoryVisible ?? item.visible ?? false
          }
        });
      } else if (typeof rawData === 'object' && rawData !== null) {
        list = Object.entries(rawData).map(([key, value]: any) => {
          if (typeof value !== 'object' || value === null) return null;
          const item = flattenItem(value);
          return {
            id: key,
            documentId: key,
            subDeepKey: key,
            ...item,
            mainCategoryId: mainId,
            childCategoryId: childKey,
            deepChildCategoryId: deepKey,
            subCategoryId: subId || null,
            subDeepCategoryVisible: item.subDeepCategoryVisible ?? item.visible ?? false
          };
        }).filter(item => item !== null);
      }

      console.log(`✅ FINAL SUB-DEEP LIST (${list.length} Items):`, list);

      setSubDeepChildCategories(list);
      setIsLoadingSubDeep(false); // STOP LOADING
      return list;

    } catch (error: any) {
      console.error("❌ Error fetching sub deep child:", error?.message || error);
      setSubDeepChildCategories([]);
      setIsLoadingSubDeep(false); // STOP LOADING
      return [];
    }
  };




  const addMainCategory = async (category: any) => {
    try {
      // Check if duplicate exists (safely) : Trim ensures "Name " == "Name"
      const normalize = (str: string) => (str || "").trim().toLowerCase();
      if (mainCategories.some(c => normalize(c.name) === normalize(category.name))) {
        alert("Main Category with this name already exists!");
        return; // Stop execution
      }

      // 🔒 OPTIMISTIC UPDATE
      const tempId = `temp-${Date.now()}`;
      const tempItem: any = {
        _id: tempId,
        id: tempId,
        name: category.name,
        hasSubCategory: category.hasSubCategory,
        isMainCategoryVisible: category.isMainCategoryVisible,
        imageUri: category.imageFile ? "uploading..." : null,
      };

      setMainCategories(prev => [...prev, tempItem]);

      const token = localStorage.getItem("token");

      const formData = new FormData();

      formData.append("_id", category._id);
      formData.append("documentId", category._id);
      formData.append("name", category.name);
      formData.append("parentId", category.parentId || "");
      formData.append("hasSubCategory", String(category.hasSubCategory));
      formData.append("isMainCategoryVisible", String(category.isMainCategoryVisible));
      formData.append("isMainCategoryNameVisible", String(category.isMainCategoryNameVisible ?? true));
      formData.append(
        "isMainCategoryImageVisible",
        String(category.isMainCategoryImageVisible)
      );

      if (category.imageFile) {
        formData.append("imageUri", category.imageFile); // 🔥 multer field
      }

      const res = await axios.post(
        BASE_URL + "/main",
        formData,
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
            "x-api-token": API_TOKEN,
            // ❌ Content-Type MAT LIKHO
          },
        }
      );

      await fetchMainCategories();
      return res.data;
    } catch (error: any) {
      console.error(
        "❌ ADD MAIN CATEGORY ERROR:",
        error?.response?.status,
        error?.response?.data || error.message
      );
      // 🔙 Revert on error - remove safe check as tempId is unique
      setMainCategories(prev => prev.filter(item => !(item._id || "").startsWith("temp-")));
      throw error;
    }
  };


  // const addSubCategory = async (category: {
  //   _id: string;              // subCategoryId
  //   name: string;
  //   mainCategoryId: string;   // mainCategoryId
  //   visible: boolean;
  //   imageUri?: string | null;
  // }) => {
  //   try {
  //     const token = localStorage.getItem("token");

  //     const payloadSubcat = {
  //       documentId: category._id,
  //       name: category.name,

  //       mainCategory: category.mainCategoryId, // ✅ VERY IMPORTANT

  //       isSubCategoryVisible: category.visible,
  //       isSubCategoryNameVisible: true,
  //       isSubCategoryImageVisible: true,

  //       imageUri: category.imageUri || null,
  //     };


  //     // 🔥 DEBUG (VERY IMPORTANT)
  //     console.log(
  //       "🚀 FINAL URL:",
  //       `${BASE_URL}/main/${payloadSubcat.mainCategory}/sub/${payloadSubcat.documentId}`
  //     );
  //     console.log("📦 PAYLOAD:", payloadSubcat);

  //     const res = await axios.post(
  //       `${BASE_URL}/main/${payloadSubcat.mainCategory}/sub/${payloadSubcat.documentId}`,
  //       payloadSubcat,
  //       {
  //         headers: {
  //           Authorization: token ? `Bearer ${token}` : "",
  //           "x-api-token": API_TOKEN,
  //           "Content-Type": "application/json",
  //         },
  //       }
  //     );

  //     return res.data;
  //   } catch (error: any) {
  //     console.error(
  //       "❌ SubCategory Error:",
  //       error.response?.data || error.message
  //     );
  //     throw new Error("Failed to save sub category");
  //   }
  // };
  // const addChildCategory = async (category: {
  //   name: string;
  //   mainCategoryId: string;
  //   subCategoryId?: string | null;
  //   visible: boolean;
  // }) => {
  //   try {
  //     const token = localStorage.getItem("token");


  //     const childId = category.name; 

  //     const url = category.subCategoryId
  //       ? `${BASE_URL}/main/${category.mainCategoryId}/sub/${category.subCategoryId}/child/${childId}`
  //       : `${BASE_URL}/main/${category.mainCategoryId}/child/${childId}`;

  //     const payload = {
  //       name: category.name,
  //       Visibility: true, 
  //     };

  //     console.log("🚀 CHILD CATEGORY URL:", url);
  //     console.log("📦 PAYLOAD:", payload);

  //     await axios.post(url, payload, {
  //       headers: {
  //         Authorization: token ? `Bearer ${token}` : "",
  //         "x-api-token": API_TOKEN,
  //         "Content-Type": "application/json",
  //       },
  //     });
  //   } catch (error: any) {
  //     console.error("❌ Failed to add child category:", error);
  //     throw new Error("Failed to add child category");
  //   }
  // };
  // const addDeepChildCategory = async (data: any) => {
  //   const token = localStorage.getItem("token");

  //   const mainCategoryId = data.mainCategoryId;
  //   const subCategoryId = data.subCategoryId || null;
  //   const childCategoryId = data.childCategoryId;
  //   const deepId = data.deepChildId; // 🔥 URL PARAM

  //   if (!mainCategoryId || !childCategoryId || !deepId) {
  //     console.error("❌ MAIN / CHILD / DEEP ID MISSING");
  //     return;
  //   }

  //   let url = "";

  //   // ✅ WITH SUB CATEGORY
  //   if (subCategoryId) {
  //     url = `${BASE_URL}/main/${mainCategoryId}/sub/${subCategoryId}/child/${childCategoryId}/deep/${deepId}`;
  //   }
  //   // ✅ WITHOUT SUB CATEGORY
  //   else {
  //     url = `${BASE_URL}/main/${mainCategoryId}/child/${childCategoryId}/deep/${deepId}`;
  //   }

  //   console.log("🌐 FINAL POST URL:", url);

  //   return axios.post(
  //     url,
  //     {
  //       firstTitle: data.firstTitle,
  //       secondTitle: data.secondTitle,
  //       description: data.description,
  //       visible: data.visible,
  //       webviewUrl: data.webviewUrl,

  //       originalPrice: data.originalPrice,
  //       discountType: data.discountType,
  //       discountValue: data.discountValue,
  //       gst: data.gst,
  //       gstType: data.gstType,
  //       minTime: data.minTime,
  //       maxTime: data.maxTime,
  //       finalPrice: data.finalPrice,
  //       totalPrice: data.totalPrice,

  //       firstTitleVisible: data.firstTitleVisible,
  //       secondTitleVisible: data.secondTitleVisible,
  //       descriptionVisible: data.descriptionVisible,
  //       webviewUrlVisible: data.webviewUrlVisible,
  //       originalPriceVisible: data.originalPriceVisible,
  //       minTimeVisible: data.minTimeVisible,
  //       maxTimeVisible: data.maxTimeVisible,

  //       photoVisible: data.photoVisible,
  //       videoVisible: data.videoVisible,
  //     },
  //     {
  //       headers: {
  //         Authorization: token ? `Bearer ${token}` : "",
  //         "x-api-token": API_TOKEN,
  //         "Content-Type": "application/json",
  //       },
  //     }
  //   );
  // };



  const addSubCategory = async (category: Omit<SubCategory, 'documentId' | 'isSubCategoryVisible' | 'isSubCategoryNameVisible' | 'isSubCategoryImageVisible'> & { imageFile?: File | null; _id?: string }) => {
    // Check if duplicate exists (safely) within the SAME Main Category
    const normalize = (str: string) => (str || "").trim().toLowerCase();

    // We check if name matches AND mainCategoryId matches
    // Since 'subCategories' usually contains the list for the ACTIVE main category, 
    // we should validly check against it.
    // However, to be absolutely safe against state having mixed items:
    const isDuplicate = subCategories.some(c =>
      normalize(c.name) === normalize(category.name) &&
      (c.mainCategoryId === category.mainCategoryId || (c as any).mainCategory === category.mainCategoryId)
    );

    if (isDuplicate) {
      alert("Sub Category with this name already exists in this Main Category!");
      return;
    }

    const token = localStorage.getItem("token");
    const formData = new FormData();

    // Generate ID if not provided
    const docId = category._id || generateCategoryId(category.name);

    formData.append("documentId", docId);
    formData.append("name", category.name);
    formData.append("mainCategory", category.mainCategoryId);
    formData.append("isSubCategoryVisible", String(category.visible));
    formData.append("isSubCategoryNameVisible", "true");
    formData.append("isSubCategoryImageVisible", "true");

    // ✅ multer expects "image"
    if (category.imageFile) {
      formData.append("imageUri", category.imageFile); // 🔥 THIS WILL APPEAR NOW
    }

    console.log("📦 FORM DATA:", [...formData.entries()]);
    console.log("🚀 SUB CATEGORY API CALL:", {
      mainCategoryId: category.mainCategoryId,
      documentId: docId,
      apiUrl: `${BASE_URL}/main/${category.mainCategoryId}/sub/${docId}`
    });

    const res = await axios.post(
      `${BASE_URL}/main/${category.mainCategoryId}/sub/${docId}`,
      formData,
      {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
          "x-api-token": API_TOKEN,
        },
      }
    );

    await fetchSubCategories(category.mainCategoryId);
    return res.data;
  };

  const addChildCategory = async (category: {
    name: string;
    mainCategoryId: string;
    subCategoryId?: string | null;
    visible: boolean;
  }) => {
    // Check if duplicate exists (safely)
    const normalize = (str: string) => (str || "").trim().toLowerCase();
    if (childCategories.some(c => normalize(c.name) === normalize(category.name))) {
      alert("Child Category with this name already exists!");
      return;
    }

    // 🔒 OPTIMISTIC UPDATE
    const tempId = `temp-${Date.now()}`;
    const tempItem: any = {
      _id: tempId,
      documentId: tempId,
      name: category.name,
      visible: category.visible,
      subCategoryId: category.subCategoryId,
      mainCategoryId: category.mainCategoryId,
      isChildCategoryVisible: true
    };

    setChildCategories(prev => [...prev, tempItem]);

    try {
      const token = localStorage.getItem("token");

      // ✅ URL SAFE ID
      const childId = encodeURIComponent(category.name);

      const url = category.subCategoryId
        ? `${BASE_URL}/main/${category.mainCategoryId}/sub/${category.subCategoryId}/child/${childId}`
        : `${BASE_URL}/main/${category.mainCategoryId}/child/${childId}`;

      // ✅ FIXED PAYLOAD
      const payload = {
        name: category.name,
        visibility: true, // ✅ lowercase (VERY IMPORTANT)
      };

      console.log("🚀 CHILD CATEGORY URL:", url);
      console.log("📦 PAYLOAD:", payload);

      await axios.post(url, payload, {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
          "x-api-token": API_TOKEN,
          "Content-Type": "application/json",
        },
      });

      await fetchChildCategories(category.mainCategoryId, category.subCategoryId);
    } catch (error: any) {
      // 🔙 REVERT
      setChildCategories(prev => prev.filter(item => item.documentId !== tempId));

      console.error("❌ Failed to add child category:", error?.response?.data || error);
      throw new Error("Failed to add child category");
    }
  };






  // const addDeepChildCategory = async (data: any) => {
  //   const token = localStorage.getItem("token");

  //   const {
  //     mainCategoryId,
  //     subCategoryId,
  //     childCategoryId,
  //     deepChildId,
  //   } = data;

  //   if (!mainCategoryId || !childCategoryId || !deepChildId) {
  //     console.error("❌ MAIN / CHILD / DEEP ID MISSING");
  //     return;
  //   }

  //   let url = "";

  //   // ✅ WITH SUB CATEGORY
  //   if (subCategoryId) {
  //     url = `${BASE_URL}/main/${mainCategoryId}/sub/${subCategoryId}/child/${childCategoryId}/deep/${deepChildId}`;
  //   } 
  //   // ✅ WITHOUT SUB CATEGORY
  //   else {
  //     url = `${BASE_URL}/main/${mainCategoryId}/child/${childCategoryId}/deep/${deepChildId}`;
  //   }

  //   console.log("🌐 FINAL POST URL:", url);

  //   const payload = {
  //     // 📝 CONTENT
  //     firstTitle: data.firstTitle,
  //     secondTitle: data.secondTitle,
  //     description: data.description,
  //     visible: data.visible,
  //     webviewUrl: data.webviewUrl,

  //     // 💰 RAW PRICING
  //     originalPrice: data.originalPrice,
  //     discountType: data.discountType,
  //     discountValue: data.discountValue,
  //     gst: data.gst,
  //     gstType: data.gstType,

  //     // 🔥 CALCULATED (NO UI FIELD)
  //     currentPrice: data.currentPrice,      // after discount
  //     priceAfterGst: data.priceAfterGst,    // final payable
  //     currentPriceVisible: true,

  //     // 👁️ VISIBILITY FLAGS
  //     firstTitleVisible: data.firstTitleVisible,
  //     secondTitleVisible: data.secondTitleVisible,
  //     descriptionVisible: data.descriptionVisible,
  //     webviewUrlVisible: data.webviewUrlVisible,
  //     originalPriceVisible: data.originalPriceVisible,
  //     minTimeVisible: data.minTimeVisible,
  //     maxTimeVisible: data.maxTimeVisible,

  //     // 📷 MEDIA
  //     photoVisible: data.photoVisible,
  //     videoVisible: data.videoVisible,
  //   };

  //   console.log("📦 FINAL DATA GOING TO MONGO:", payload);

  //   return axios.post(
  //     url,
  //     payload,
  //     {
  //       headers: {
  //         Authorization: token ? `Bearer ${token}` : "",
  //         "x-api-token": API_TOKEN,
  //         "Content-Type": "application/json",
  //       },
  //     }
  //   );
  // };

  // const addSubDeepChildCategory = async (data: any) => {
  //   const token = localStorage.getItem("token");

  //   const {
  //     mainCategoryId,
  //     subCategoryId,
  //     childCategoryId,
  //     deepChildCategoryId,
  //     subDeepKey,
  //   } = data;

  //   if (!mainCategoryId || !childCategoryId || !deepChildCategoryId || !subDeepKey) {
  //     console.error("❌ REQUIRED IDS MISSING", {
  //       mainCategoryId,
  //       childCategoryId,
  //       deepChildCategoryId,
  //       subDeepKey,
  //     });
  //     return;
  //   }

  //   let url = "";

  //   // ✅ WITH SUB CATEGORY
  //   if (subCategoryId) {
  //     url = `${BASE_URL}/main/${mainCategoryId}/sub/${subCategoryId}/child/${childCategoryId}/deep/${deepChildCategoryId}/sub/${subDeepKey}`;
  //   }
  //   // ✅ WITHOUT SUB CATEGORY
  //   else {
  //     url = `${BASE_URL}/main/${mainCategoryId}/child-key/${childCategoryId}/deep/${deepChildCategoryId}/sub/${subDeepKey}`;
  //   }

  //   console.log("🌐 SUB-DEEP POST URL:", url);
  //   console.log("📦 FINAL DATA GOING TO MONGO:", data);

  //   return axios.post(
  //     url,
  //     {
  //       // 📝 CONTENT
  //       firstTitle: data.firstTitle,
  //       secondTitle: data.secondTitle,
  //       description: data.description,
  //       visible: data.visible,
  //       webviewUrl: data.webviewUrl,

  //       // 💰 PRICING
  //       originalPrice: data.originalPrice,
  //       discountType: data.discountType,
  //       discountValue: data.discountValue,
  //       gst: data.gst,
  //       gstType: data.gstType,
  //       minTime: data.minTime,
  //       maxTime: data.maxTime,
  //       finalPrice: data.finalPrice,
  //       totalPrice: data.totalPrice,

  //       // 👁️ VISIBILITY FLAGS
  //       firstTitleVisible: data.firstTitleVisible,
  //       secondTitleVisible: data.secondTitleVisible,
  //       descriptionVisible: data.descriptionVisible,
  //       webviewUrlVisible: data.webviewUrlVisible,
  //       originalPriceVisible: data.originalPriceVisible,
  //       minTimeVisible: true,
  //       maxTimeVisible: true,

  //       // 📷 MEDIA FLAGS
  //       photoVisible: data.photoVisible,
  //       videoVisible: data.videoVisible,

  //       // 🆔 IDS (Mongo me dikh rahe the images me)
  //       documentId: subDeepKey,
  //       localId: subDeepKey,
  //     },
  //     {
  //       headers: {
  //         Authorization: token ? `Bearer ${token}` : "",
  //         "x-api-token": API_TOKEN,
  //         "Content-Type": "application/json",
  //       },
  //     }
  //   );
  // };
  // const addDeepChildCategory = async (data: any) => {
  //   const token = localStorage.getItem("token");

  //   const {
  //     mainCategoryId,
  //     subCategoryId,
  //     childCategoryId,
  //     deepChildId,
  //   } = data;

  //   if (!mainCategoryId || !childCategoryId || !deepChildId) {
  //     console.error("❌ MAIN / CHILD / DEEP ID MISSING");
  //     return;
  //   }

  //   let url = "";

  //   if (subCategoryId) {
  //     url = `${BASE_URL}/main/${mainCategoryId}/sub/${subCategoryId}/child/${childCategoryId}/deep/${deepChildId}`;
  //   } else {
  //     url = `${BASE_URL}/main/${mainCategoryId}/child/${childCategoryId}/deep/${deepChildId}`;
  //   }

  //   // ✅ ✅ ✅ FINAL PAYLOAD (YAHIN ADD KARNA HAI)
  //   const payload = {
  //     documentId: deepChildId, // 🔥 MOST IMPORTANT LINE

  //     // 📝 CONTENT
  //     firstTitle: data.firstTitle,
  //     secondTitle: data.secondTitle,
  //     description: data.description,
  //     visible: data.deepCategoryVisible,
  //     webviewUrl: data.webviewUrl,

  //     // 💰 PRICING
  //     originalPrice: data.originalPrice,
  //     discountType: data.discountType,
  //     discountValue: data.discountValue,
  //     gst: data.gst,
  //     gstType: data.gstType,

  //     currentPrice: data.currentPrice,
  //     priceAfterGst: data.priceAfterGst,
  //     currentPriceVisible: true,

  //     // 👁️ VISIBILITY
  //     firstTitleVisible: data.firstTitleVisible,
  //     secondTitleVisible: data.secondTitleVisible,
  //     descriptionVisible: data.descriptionVisible,
  //     webviewUrlVisible: data.webviewUrlVisible,
  //     originalPriceVisible: data.originalPriceVisible,
  //     minTimeVisible: data.minTimeVisible,
  //     maxTimeVisible: data.maxTimeVisible,

  //     photoVisible: data.photoVisible,
  //     videoVisible: data.videoVisible,
  //   };

  //   console.log("📦 FINAL PAYLOAD WITH DOCUMENT ID:", payload);

  //   return axios.post(url, payload, {
  //     headers: {
  //       Authorization: token ? `Bearer ${token}` : "",
  //       "x-api-token": API_TOKEN,
  //       "Content-Type": "application/json",
  //     },
  //   });
  // };

  const addDeepChildCategory = async (data: any) => {
    const token = localStorage.getItem("token");

    const {
      mainCategoryId,
      subCategoryId,
      childCategoryId,
      deepChildId,
    } = data;

    if (!mainCategoryId || !childCategoryId || !deepChildId) {
      console.error("❌ MAIN / CHILD / DEEP ID MISSING");
      return;
    }

    // Check for duplicate
    // Assuming deepChildId is the "name" or key we want to be unique in this list
    if (deepChildCategories.some(c => (c.id || c.documentId || "").toLowerCase() === deepChildId.toLowerCase())) {
      alert("Deep Child Category with this name/ID already exists!");
      return;
    }

    let url = "";

    if (subCategoryId) {
      url = `${BASE_URL}/main/${mainCategoryId}/sub/${subCategoryId}/child/${childCategoryId}/deep/${deepChildId}`;
    } else {
      url = `${BASE_URL}/main/${mainCategoryId}/child/${childCategoryId}/deep/${deepChildId}`;
    }

    // ✅ FINAL PAYLOAD (AS YOU WANT)
    const payload = {
      documentId: deepChildId,

      // 📝 CONTENT
      firstTitle: data.firstTitle,
      secondTitle: data.secondTitle,
      description: data.description,
      deepCategoryVisible: data.deepCategoryVisible,
      webviewUrl: data.webviewUrl,

      // ⏰🔥 TIME (MISSING THA – YAHI BUG THA)
      minTime: data.minTime ?? null,
      maxTime: data.maxTime ?? null,
      minTimeVisible: data.minTimeVisible,
      maxTimeVisible: data.maxTimeVisible,

      // 💰 PRICING
      originalPrice: data.originalPrice,
      discountType: data.discountType,
      discountValue: data.discountValue,
      gst: data.gst,
      gstType: data.gstType,

      currentPrice: data.currentPrice,
      priceAfterGst: data.priceAfterGst,
      currentPriceVisible: true,

      // 👁️ VISIBILITY
      firstTitleVisible: data.firstTitleVisible,
      secondTitleVisible: data.secondTitleVisible,
      descriptionVisible: data.descriptionVisible,
      webviewUrlVisible: data.webviewUrlVisible,
      originalPriceVisible: data.originalPriceVisible,

      photoVisible: data.photoVisible,
      videoVisible: data.videoVisible,
    };


    console.log("📦 FINAL PAYLOAD:", payload);

    return axios.post(url, payload, {
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
        "x-api-token": API_TOKEN,
        "Content-Type": "application/json",
      },
    });
  };

  /* ================= V2 API METHODS ================= */

  const fetchChildCategoryMedia = async (
    mainId: string,
    subId?: string
  ) => {
    // ✅ FIX: Use relative path (baseURL already has /api/product-listing)
    const url = subId
      ? `/main/${mainId}/sub/${subId}/child-category/media`
      : `/main/${mainId}/child-category/media`;

    console.log("🚀 FETCH MEDIA URL:", url);
    const res = await api.get(url);

    console.log("🔥 CHILD CAT MEDIA FETCH:", res.data);

    const data = res.data?.data || null;

    setChildCategoryMedia(data);   // ✅ THIS WAS MISSING
    return data;
  };

  /**
   * Add Image or Video to Child Category Media
   * POST /main/:mainId/child-category/media
   * POST /main/:mainId/sub/:subId/child-category/media
   *
   * According to API Documentation:
   * - Backend auto-generates indices (0, 1, 2, ...)
   * - Client must NOT send index
   * - Supports both file uploads (multer) and direct URLs (YouTube, etc.)
   * - For files: use FormData with multipart/form-data
   * - For URLs: use JSON with application/json
   * - Payload structure: { childCatMedia: { images/videos: { imageTitle/videoTitle, url, visibility } } }
   */
  const addChildCategoryMedia = async (
    mainId: string,
    type: "images" | "videos" | "links",
    item: {
      imageTitle?: string;
      videoTitle?: string;
      linkTitle?: string;
      url?: string;
      file?: File;  // For file uploads
      visibility?: boolean;
    },
    subId?: string
  ) => {
    console.log("📥 addChildCategoryMedia RECEIVED - mainId:", mainId);
    console.log("📥 addChildCategoryMedia RECEIVED - type:", type);
    console.log("📥 addChildCategoryMedia RECEIVED - item:", item);

    // Build URL based on whether we have subCategory or not
    const url = subId
      ? `/main/${mainId}/sub/${subId}/child-category/media`
      : `/main/${mainId}/child-category/media`;

    try {
      // ✅ Case 1: FILE UPLOAD (naman123 - 2-Step Auto-Fix for proper URL mapping)
      if (item.file instanceof File) {
        console.log("📤 Step 1: Creating metadata node...");

        // Metadata Payload (Just labels and visibility)
        const createBody = {
          childCatMedia: {
            [type]: {
              [type === "images" ? "imageTitle" : "videoTitle"]: type === "images" ? item.imageTitle : item.videoTitle,
              visibility: item.visibility ?? true,
              url: "pending" // Placeholder
            }
          }
        };

        const createRes = await axios.post(`${BASE_URL}${url}`, createBody, { headers: getAuthHeaders() });

        if (createRes.data.success) {
          console.log("📤 Step 2: Extracting index and uploading binary file...");

          // Find the new index (the highest number in the returned object)
          const currentMedia = createRes.data.data[type];
          const indices = Object.keys(currentMedia).map(Number).filter(n => !isNaN(n));
          const newIndex = Math.max(...indices);

          // Construct Update URL: e.g. /main/:id/child-category/media/images/0
          const updateUrl = `${url}/${type}/${newIndex}`;

          const formData = new FormData();
          formData.append("url", item.file); // Root key at the top level for attachUploads compatibility

          // ✅ Also send labels and visibility in Step 2 to ensure they aren't lost if backend overwrites
          formData.append(type === "images" ? "imageTitle" : "videoTitle", (type === "images" ? item.imageTitle : item.videoTitle) || "");
          formData.append("visibility", String(item.visibility ?? true));

          const updateRes = await axios.put(`${BASE_URL}${updateUrl}`, formData, {
            headers: {
              ...getAuthHeaders(true),
            }
          });

          console.log("✅ 2-STEP SUCCESS (URL Stored):", updateRes.data);
        }
      }
      // ✅ CASE 2: DIRECT URL (YouTube, external links, etc.)
      // ✅ CASE 2: DIRECT URL (JSON)
      else if (item.url) {
        console.log("📤 Using JSON for direct URL");

        // Building exact payload structure like Thunder Client
        const body = {
          childCatMedia: {
            [type]: type === "images"
              ? {
                imageTitle: item.imageTitle || "",
                url: item.url,
                visibility: item.visibility ?? true
              }
              : {
                videoTitle: item.videoTitle || "",
                url: item.url,
                visibility: item.visibility ?? true
              }
          }
        };

        const fullUrl = `${BASE_URL}${url}`;

        console.log("📦 MEDIA POST (JSON) PAYLOAD:", JSON.stringify(body, null, 2));
        console.log("🚀 FULL URL:", fullUrl);
        console.log("🔍 Body structure check:", {
          hasChildCatMedia: !!body.childCatMedia,
          type: type,
          hasType: !!(body.childCatMedia as any)[type],
          content: (body.childCatMedia as any)[type]
        });

        const token = localStorage.getItem("token");
        const headers = {
          "Content-Type": "application/json",
          "x-api-token": API_TOKEN,
          Authorization: token ? `Bearer ${token}` : "",
        };

        console.log("🔐 Headers:", headers);

        const response = await axios.post(fullUrl, body, { headers });

        console.log("✅ POST SUCCESS (URL):", response.data);
        console.log("✅ Response status:", response.status);
        console.log("✅ Response data detail:", JSON.stringify(response.data, null, 2));
      } else {
        throw new Error("Either 'file' or 'url' must be provided");
      }
    } catch (error: any) {
      console.error("❌ POST FAILED:", error);
      console.error("❌ Error Response:", error.response?.data);
      console.error("❌ Error Status:", error.response?.status);
      console.error("❌ Full Error:", error);
      throw error;
    }

    // ✅ REFRESH DATA after successful post
    console.log("🔄 Refreshing data...");
    await fetchChildCategoryMedia(mainId, subId);
  };

  /**
   * Update a specific media item by index
   * PUT /main/:mainId/child-category/media/:type/:index
   * PUT /main/:mainId/sub/:subId/child-category/media/:type/:index
   */
  const updateChildCategoryMediaByIndex = async (
    mainId: string,
    type: "images" | "videos" | "links",
    index: number | string,
    payload: {
      imageTitle?: string;
      videoTitle?: string;
      linkTitle?: string;
      url?: string;
      visibility?: boolean;
    },
    subId?: string
  ) => {
    const url = subId
      ? `/main/${mainId}/sub/${subId}/child-category/media/${type}/${index}`
      : `/main/${mainId}/child-category/media/${type}/${index}`;

    console.log(`📝 UPDATE MEDIA [${type}][${index}]:`, url, payload);

    // Send both visibility and visible to ensure it hits the right field in MongoDB
    const body = {
      ...payload,
      visibility: payload.visibility,
      visible: payload.visibility
    };

    await api.put(url, body);
    // Removed automatic fetchChildCategoryMedia refresh to prevent "flickering" or reverting 
    // due to stale data from the server during slow PUT operations.
  };

  /**
   * Update Group Visibility or Title for Media
   * PUT /main/:mainId/child-category/media/:type
   */
  const updateChildCategoryMediaGroup = async (
    mainId: string,
    type: "images" | "videos" | "links",
    payload: {
      name?: string;
      visibility?: boolean;
    },
    subId?: string
  ) => {
    // ✅ Fix: Group updates should go to the base media URL with a wrapped payload
    const url = subId
      ? `/main/${mainId}/sub/${subId}/child-category/media`
      : `/main/${mainId}/child-category/media`;

    const body = {
      childCatMedia: {
        [type]: {
          name: payload.name,
          visibility: payload.visibility,
          visible: payload.visibility // Send both version for group too
        }
      }
    };

    console.log(`📝 UPDATE MEDIA GROUP [${type}]:`, url, body);
    try {
      // Try PUT first as per documentation attempt
      await api.put(url, body);
      console.log(`✅ GROUP UPDATE SUCCESS [${type}]`);
    } catch (error: any) {
      if (error.response?.status === 404) {
        console.warn(`⚠️ PUT not found for group update, trying POST/PATCH as fallback or skipping:`, url);
        // If PUT 404s, backend might not have this specific grouped update route yet
        // We catch it here so the UI doesn't crash
      } else {
        throw error;
      }
    }
  };

  /**
   * Delete a specific media item by index
   * DELETE /main/:mainId/child-category/media/:type/:index
   * DELETE /main/:mainId/sub/:subId/child-category/media/:type/:index
   */
  const deleteChildCategoryMediaByIndex = async (
    mainId: string,
    type: "images" | "videos" | "links",
    index: number | string,
    subId?: string
  ) => {
    // ✅ FIX: Use relative path
    const url = subId
      ? `/main/${mainId}/sub/${subId}/child-category/media/${type}/${index}`
      : `/main/${mainId}/child-category/media/${type}/${index}`;

    console.log(`🗑️ DELETE MEDIA [${type}][${index}]:`, url);

    await api.delete(url);

    // Refresh data after delete
    await fetchChildCategoryMedia(mainId, subId);
  };


  const deleteChildCategoryV2 = async (mainId: string, key: string, subCategoryId?: string) => {
    try {
      let url = "";
      if (subCategoryId) {
        url = `${BASE_URL}/main/${mainId}/sub/${subCategoryId}/child-category/media`;
      } else {
        url = `${BASE_URL}/main/${mainId}/child-category/media`;
      }
      console.log("🗑️ DELETE V2:", url);
      await api.delete(url);

      // Remove from state
      setChildCategoriesV2(prev => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    } catch (e: any) {
      console.error("❌ Failed to delete Child Category V2:", e);
      throw e;
    }
  };

  // const addSubDeepChildCategory = async (data: any) => {
  //   const token = localStorage.getItem("token");

  //   const {
  //     mainCategoryId,
  //     subCategoryId,
  //     childCategoryId,
  //     deepChildCategoryId,
  //     subDeepKey,
  //   } = data;

  //   if (!mainCategoryId || !childCategoryId || !deepChildCategoryId || !subDeepKey) {
  //     console.error("❌ REQUIRED IDS MISSING", {
  //       mainCategoryId,
  //       childCategoryId,
  //       deepChildCategoryId,
  //       subDeepKey,
  //     });
  //     return;
  //   }

  //   let url = "";

  //   // ✅ WITH SUB CATEGORY
  //   if (subCategoryId) {
  //     url = `${BASE_URL}/main/${mainCategoryId}/sub/${subCategoryId}/child/${childCategoryId}/deep/${deepChildCategoryId}/sub/${subDeepKey}`;
  //   }
  //   // ✅ WITHOUT SUB CATEGORY
  //   else {
  //     url = `${BASE_URL}/main/${mainCategoryId}/child-key/${childCategoryId}/deep/${deepChildCategoryId}/sub/${subDeepKey}`;
  //   }

  //   console.log("🌐 SUB-DEEP POST URL:", url);
  //   console.log("📦 FINAL DATA GOING TO MONGO:", data);

  //   return axios.post(
  //     url,
  //     {
  //       // 📝 CONTENT
  //       firstTitle: data.firstTitle,
  //       secondTitle: data.secondTitle,
  //       description: data.description,
  //       visible: data.visible,
  //       webviewUrl: data.webviewUrl,

  //       // 💰 RAW PRICING
  //       originalPrice: data.originalPrice,
  //       discountType: data.discountType,
  //       discountValue: data.discountValue,
  //       gst: data.gst,
  //       gstType: data.gstType,

  //       // 🔥 CALCULATED (NO UI FIELD)
  //       priceAfterGst: data.priceAfterGst,   // ✅ ORIGINAL + GST
  //       currentPrice: data.currentPrice,     // ✅ AFTER DISCOUNT
  //       currentPriceVisible: true,

  //       // 👁️ VISIBILITY FLAGS
  //       firstTitleVisible: data.firstTitleVisible,
  //       secondTitleVisible: data.secondTitleVisible,
  //       descriptionVisible: data.descriptionVisible,
  //       webviewUrlVisible: data.webviewUrlVisible,
  //       originalPriceVisible: data.originalPriceVisible,
  //       minTimeVisible: true,
  //       maxTimeVisible: true,

  //       // 📷 MEDIA FLAGS
  //       photoVisible: data.photoVisible,
  //       videoVisible: data.videoVisible,

  //       // 🆔 IDS (IMPORTANT FOR MONGO)
  //       documentId: subDeepKey,
  //       localId: subDeepKey,
  //     },
  //     {
  //       headers: {
  //         Authorization: token ? `Bearer ${token}` : "",
  //         "x-api-token": API_TOKEN,
  //         "Content-Type": "application/json",
  //       },
  //     }
  //   );
  // };

  const addSubDeepChildCategory = async (data: any) => {
    const token = localStorage.getItem("token");

    const {
      mainCategoryId,
      subCategoryId,
      childCategoryId,
      deepChildCategoryId,
      subDeepKey,
    } = data;

    // Check for duplicate
    if (subDeepChildCategories.some(c => (c.id || c.subDeepKey || "").toLowerCase() === subDeepKey.toLowerCase())) {
      alert("Sub Deep Child Category with this name/ID already exists!");
      return;
    }

    let url = "";

    if (subCategoryId) {
      // ✅ User confirmed: Use 'child' for sub-category path
      url = `${BASE_URL}/main/${mainCategoryId}/sub/${subCategoryId}/child/${encodeURIComponent(childCategoryId)}/deep/${encodeURIComponent(deepChildCategoryId)}/sub/${encodeURIComponent(subDeepKey)}`;
    } else {
      // ✅ User confirmed: Use 'child-key' for direct path
      url = `${BASE_URL}/main/${mainCategoryId}/child-key/${encodeURIComponent(childCategoryId)}/deep/${encodeURIComponent(deepChildCategoryId)}/sub/${encodeURIComponent(subDeepKey)}`;
    }

    await axios.post(
      url,
      {
        // 📝 CONTENT
        firstTitle: data.firstTitle,

        secondTitle: data.secondTitle,
        description: data.description,
        visible: data.subDeepCategoryVisible ?? data.visible,
        webviewUrl: data.webviewUrl,

        // ⏰🔥 DELIVERY TIME (MAIN FIX)
        minTime: data.minTime ?? null,
        maxTime: data.maxTime ?? null,
        minTimeVisible: data.minTimeVisible,
        maxTimeVisible: data.maxTimeVisible,

        // 💰 PRICING
        originalPrice: data.originalPrice,
        discountType: data.discountType,
        discountValue: data.discountValue,
        gst: data.gst,
        gstType: data.gstType,

        priceAfterGst: data.priceAfterGst,
        currentPrice: data.currentPrice,
        currentPriceVisible: true,

        // 👁️ VISIBILITY
        firstTitleVisible: data.firstTitleVisible,
        secondTitleVisible: data.secondTitleVisible,
        descriptionVisible: data.descriptionVisible,
        webviewUrlVisible: data.webviewUrlVisible,
        originalPriceVisible: data.originalPriceVisible,

        // 📷 MEDIA
        photoVisible: data.photoVisible,
        videoVisible: data.videoVisible,

        // 🆔 IDS
        documentId: subDeepKey,
        // localId: subDeepKey,
      },
      {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
          "x-api-token": API_TOKEN,
          "Content-Type": "application/json",
        },
      }
    );

    // 🔥 REFRESH LIST
    await fetchSubDeepChildCategories(
      mainCategoryId,
      childCategoryId,
      deepChildCategoryId,
      subCategoryId
    );

  };




  const deleteMainCategory = async (id: string) => {
    try {
      await api.delete(`/main/${id}`);
      setMainCategories((prev) => prev.filter((cat) => (cat._id || (cat as any).id) !== id));
    } catch (e) {
      alert("Failed to delete Main Category");
      console.error(e);
    }
  };

  const deleteSubCategory = async (id: string) => {
    try {
      const sub = subCategories.find(s => (s.documentId || (s as any)._id || (s as any).id) === id);
      if (!sub) {
        // alert("Sub Category not found for deletion.");
        return;
      }
      await api.delete(`/main/${sub.mainCategoryId}/sub/${id}`);
      setSubCategories((prev) => prev.filter((cat) => (cat.documentId || (cat as any)._id || (cat as any).id) !== id));
    } catch (e) {
      alert("Failed to delete Sub Category");
      console.error(e);
    }
  };

  const deleteChildCategory = async (id: string) => {
    try {
      const child = childCategories.find(c => (c.documentId || (c as any)._id || (c as any).id) === id);
      if (!child) return;

      // Extract IDs from the child object (injected during fetch)
      const { mainCategoryId, subCategoryId } = child as any;

      if (subCategoryId) {
        // Case 1: With Subcategory
        console.log(`🗑️ Deleting Child (with sub): Main=${mainCategoryId}, Sub=${subCategoryId}, Child=${id}`);
        await api.delete(`/main/${mainCategoryId}/sub/${subCategoryId}/child/${id}`);
      } else {
        // Case 2: Direct Child
        console.log(`🗑️ Deleting Child (direct): Main=${mainCategoryId}, Child=${id}`);
        await api.delete(`/main/${mainCategoryId}/child/${id}`);
      }

      setChildCategories((prev) => prev.filter((cat) => (cat.documentId || (cat as any)._id || (cat as any).id) !== id));
    } catch (e) {
      alert("Failed to delete Child Category");
      console.error(e);
    }
  };

  const deleteDeepChildCategory = async (id: string) => {
    try {
      const deep = deepChildCategories.find(d => (d.id || (d as any)._id || (d as any).documentId) === id);
      if (!deep) return;

      const { mainCategoryId, subCategoryId, childCategoryId } = deep as any;

      if (subCategoryId) {
        await api.delete(`/main/${mainCategoryId}/sub/${subCategoryId}/child/${childCategoryId}/deep/${id}`);
      } else {
        await api.delete(`/main/${mainCategoryId}/child/${childCategoryId}/deep/${id}`);
      }

      setDeepChildCategories((prev) => prev.filter((cat) => (cat.id || (cat as any)._id || (cat as any).documentId) !== id));
    } catch (e) {
      console.error("Failed to delete deep child category", e);
      alert("Failed to delete Deep Child Category");
    }
  };

  // SubDeepChildCategory deletion
  const deleteSubDeepChildCategory = async (id: string) => {
    try {
      const subDeep = subDeepChildCategories.find(s => (s.id || (s as any)._id || (s as any).documentId || (s as any).subDeepKey) === id);
      if (!subDeep) return;

      const { mainCategoryId, subCategoryId, childCategoryId, deepChildCategoryId } = subDeep as any;

      if (subCategoryId) {
        await api.delete(`/main/${mainCategoryId}/sub/${subCategoryId}/child/${childCategoryId}/deep/${deepChildCategoryId}/sub/${id}`);
      } else {
        await api.delete(`/main/${mainCategoryId}/child/${childCategoryId}/deep/${deepChildCategoryId}/sub/${id}`);
      }

      setSubDeepChildCategories((prev) => prev.filter((cat) => (cat.id || (cat as any)._id || (cat as any).subDeepKey) !== id));
    } catch (e) {
      console.error("Failed to delete sub deep child category", e);
      alert("Failed to delete Sub Deep Child Category");
    }
  };

  // TOGGLE VISIBILITY
  // const toggleMainVisibility = async (id: string) => {
  //   const cat = mainCategories.find(c => c._id === id);
  //   if (!cat) return;

  //   // Toggle
  //   const newVal = !cat.isMainCategoryVisible;
  //   // We use isMainCategoryVisible based on interface, but previously used visible. 
  //   // Let's normalize update.

  //   const updated = { ...cat, isMainCategoryVisible: newVal, visible: newVal };

  //   // Optimistic update
  //   setMainCategories(prev => prev.map(c => c._id === id ? updated : c));
  //   try {
  //     await api.put(`/main/${id}`, updated);
  //   } catch (e) {
  //     console.error("Failed to toggle main visibility", e);
  //     // Revert on failure
  //     setMainCategories(prev => prev.map(c => c._id === id ? cat : c));
  //     alert("Failed to update visibility");
  //   }
  // };
  const toggleMainVisibility = async (id: string) => {
    const cat = mainCategories.find(c => c._id === id);
    if (!cat) return;

    const newVal = !cat.isMainCategoryVisible;

    // ✅ Optimistic UI
    setMainCategories(prev =>
      prev.map(c =>
        c._id === id ? { ...c, isMainCategoryVisible: newVal } : c
      )
    );

    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `${BASE_URL}/main/${id}`,
        { isMainCategoryVisible: newVal }, // 🔥 ONLY THIS FIELD
        {
          headers: {
            "Content-Type": "application/json",
            "x-api-token": API_TOKEN,
            Authorization: token ? `Bearer ${token}` : "",
          },
        }
      );
    } catch (err) {
      console.error("❌ toggleMainVisibility failed", err);

      // 🔁 revert UI
      setMainCategories(prev =>
        prev.map(c => (c._id === id ? cat : c))
      );
    }
  };

  const toggleMainNameVisibility = async (id: string) => {
    const cat = mainCategories.find(c => c._id === id);
    if (!cat) return;

    const newVal = !cat.isMainCategoryNameVisible;

    // ✅ Optimistic UI
    setMainCategories(prev =>
      prev.map(c =>
        c._id === id ? { ...c, isMainCategoryNameVisible: newVal } : c
      )
    );

    try {
      const token = localStorage.getItem("token");

      const payload = {
        name: cat.name,
        imageUri: cat.imageUri || null,

        isMainCategoryVisible: cat.isMainCategoryVisible,
        isMainCategoryNameVisible: newVal,          // 🔥 ONLY CHANGE
        isMainCategoryImageVisible: cat.isMainCategoryImageVisible,

        hasSubCategory: cat.hasSubCategory,
        parentId: cat.parentId || null,
      };

      await axios.put(
        `${BASE_URL}/main/${id}`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            "x-api-token": API_TOKEN,
            Authorization: token ? `Bearer ${token}` : "",
          },
        }
      );
    } catch (err) {
      console.error("❌ toggleMainNameVisibility failed", err);

      // 🔁 revert UI
      setMainCategories(prev =>
        prev.map(c => (c._id === id ? cat : c))
      );
    }
  };



  const toggleMainIsSub = async (id: string) => {
    const cat = mainCategories.find(c => c._id === id);
    if (!cat) return;
    const updated = { ...cat, hasSubCategory: !cat.hasSubCategory };
    setMainCategories(prev => prev.map(c => c._id === id ? updated : c));
    try {
      await api.put(`/main/${id}`, updated);
    } catch (e) {
      console.error("Failed to toggle isSubCategory", e);
      setMainCategories(prev => prev.map(c => c._id === id ? cat : c));
      alert("Failed to update");
    }
  };

  const toggleMainImageVisibility = async (id: string) => {
    const cat = mainCategories.find(c => c._id === id);
    if (!cat) return;

    const newVal = !cat.isMainCategoryImageVisible;
    const updated = {
      ...cat,
      isMainCategoryImageVisible: newVal
    };

    setMainCategories(prev => prev.map(c => c._id === id ? updated : c));

    try {
      await api.put(`/main/${id}`, updated);
    } catch (e) {
      console.error("Failed to toggle main image visibility", e);
      setMainCategories(prev => prev.map(c => c._id === id ? cat : c));
    }
  };

  const toggleSubVisibility = async (id: string) => {
    const cat = subCategories.find(c => (c.documentId || (c as any)._id) === id);
    if (!cat) return;

    // Toggle
    const newVal = !cat.isSubCategoryVisible;
    const updated = {
      ...cat,
      visible: newVal,
      isSubCategoryVisible: newVal
    };

    // Optimistic Update
    setSubCategories(prev => prev.map(c => (c.documentId || (c as any)._id) === id ? updated : c));

    try {
      // ✅ Construct Clean Payload matching addSubCategory structure
      const payload = {
        name: cat.name,
        mainCategory: cat.mainCategoryId, // Ensure this matches addSubCategory param
        isSubCategoryVisible: newVal,
        visible: newVal, // ✅ Add visible alias to ensure backend sync
        isSubCategoryNameVisible: cat.isSubCategoryNameVisible ?? true, // Maintain state
        isSubCategoryImageVisible: cat.isSubCategoryImageVisible,
        hasSubCategory: cat.hasSubCategory,
        imageUri: cat.imageUri || null,
      };

      console.log("🚀 Toggle Sub Visibility Payload:", payload);

      await api.put(`/main/${cat.mainCategoryId}/sub/${id}`, payload);
    } catch (e) {
      console.error("Failed to toggle sub visibility", e);
      // Revert
      setSubCategories(prev => prev.map(c => (c.documentId || (c as any)._id) === id ? cat : c));
    }
  };

  // const toggleSubNameVisibility = async (id: string) => {
  //   const cat = subCategories.find(c => (c.documentId || (c as any)._id) === id);
  //   if (!cat) return;

  //   const newVal = !cat.isSubCategoryNameVisible;
  //   const updated = {
  //     ...cat,
  //     isSubCategoryNameVisible: newVal
  //   };

  //   setSubCategories(prev => prev.map(c => (c.documentId || (c as any)._id) === id ? updated : c));

  //   try {
  //     // ✅ Construct Clean Payload matching addSubCategory structure
  //     const payload = {
  //       name: cat.name,
  //       mainCategory: cat.mainCategoryId, // Ensure this matches addSubCategory param
  //       isSubCategoryVisible: newVal, // ✅ Sync with Name Visibility
  //       isSubCategoryNameVisible: newVal, // ✅ Toggle this
  //       isSubCategoryImageVisible: cat.isSubCategoryImageVisible,
  //       hasSubCategory: cat.hasSubCategory,
  //       imageUri: cat.imageUri || null,
  //     };

  //     console.log("🚀 Toggle Sub Name Visibility Payload:", payload);

  //     await api.put(`/main/${cat.mainCategoryId}/sub/${id}`, payload);
  //   } catch (e) {
  //     console.error("Failed to toggle sub name visibility", e);
  //     // Revert
  //     setSubCategories(prev => prev.map(c => (c.documentId || (c as any)._id) === id ? cat : c));
  //   }
  // };
  const toggleSubNameVisibility = async (id: string) => {
    const cat = subCategories.find(c => c.documentId === id);
    if (!cat) return;

    const newVal = !cat.isSubCategoryNameVisible;

    const updated = {
      ...cat,
      isSubCategoryNameVisible: newVal
    };

    // Optimistic UI
    setSubCategories(prev =>
      prev.map(c => c.documentId === id ? updated : c)
    );

    try {
      const payload = {
        name: cat.name,
        mainCategory: cat.mainCategoryId,

        // 🔒 KEEP EXISTING VALUES
        isSubCategoryVisible: cat.isSubCategoryVisible,
        visible: cat.isSubCategoryVisible, // ✅ Ensure visible is passed
        isSubCategoryNameVisible: newVal,
        isSubCategoryImageVisible: cat.isSubCategoryImageVisible,

        hasSubCategory: cat.hasSubCategory,
        imageUri: cat.imageUri || null,
      };

      await api.put(`/main/${cat.mainCategoryId}/sub/${id}`, payload);
    } catch (e) {
      setSubCategories(prev =>
        prev.map(c => c.documentId === id ? cat : c)
      );
    }
  };

  const toggleSubImageVisibility = async (id: string) => {
    const cat = subCategories.find(c => (c.documentId || (c as any)._id) === id);
    if (!cat) return;

    const newVal = !cat.isSubCategoryImageVisible;
    const updated = {
      ...cat,
      isSubCategoryImageVisible: newVal
    };

    setSubCategories(prev => prev.map(c => (c.documentId || (c as any)._id) === id ? updated : c));

    try {
      // ✅ Construct Clean Payload
      const payload = {
        name: cat.name,
        mainCategory: cat.mainCategoryId,
        isSubCategoryVisible: cat.isSubCategoryVisible, // Keep existing
        visible: cat.isSubCategoryVisible, // ✅ Ensure visible is passed
        isSubCategoryNameVisible: cat.isSubCategoryNameVisible ?? true, // Maintain state
        isSubCategoryImageVisible: newVal,              // ✅ Toggle this
        hasSubCategory: cat.hasSubCategory,
        imageUri: cat.imageUri || null,
      };

      console.log("🚀 Toggle Sub Image Visibility Payload:", payload);

      await api.put(`/main/${cat.mainCategoryId}/sub/${id}`, payload);
    } catch (e) {
      console.error("Failed to toggle sub image visibility", e);
      setSubCategories(prev => prev.map(c => (c.documentId || (c as any)._id) === id ? cat : c));
    }
  };

  const toggleSubHasSubCategory = async (id: string) => {
    const cat = subCategories.find(c => (c.documentId || (c as any)._id) === id);
    if (!cat) return;

    const newVal = !cat.hasSubCategory;
    const updated = {
      ...cat,
      hasSubCategory: newVal
    };

    setSubCategories(prev => prev.map(c => (c.documentId || (c as any)._id) === id ? updated : c));

    try {
      // ✅ Construct Clean Payload
      const payload = {
        name: cat.name,
        mainCategory: cat.mainCategoryId,
        isSubCategoryVisible: cat.isSubCategoryVisible,
        visible: cat.isSubCategoryVisible, // ✅ Ensure visible is passed
        isSubCategoryNameVisible: cat.isSubCategoryNameVisible ?? true, // Maintain state
        isSubCategoryImageVisible: cat.isSubCategoryImageVisible,
        hasSubCategory: newVal, // ✅ Toggle this
        imageUri: cat.imageUri || null,
      };

      console.log("🚀 Toggle Sub Has SubCategory Payload:", payload);

      await api.put(`/main/${cat.mainCategoryId}/sub/${id}`, payload);
    } catch (e) {
      console.error("Failed to toggle sub hasSubCategory", e);
      setSubCategories(prev => prev.map(c => (c.documentId || (c as any)._id) === id ? cat : c));
    }
  };

  const toggleChildVisibility = async (id: string) => {
    const cat = childCategories.find(c => (c.documentId || (c as any)._id) === id);
    if (!cat) return;

    // ✅ CRITICAL FIX: Correctly resolve current visibility
    // If we only check .visible and it's undefined, it defaults to false, so toggle makes it true. 
    // If it's undefined but 'visibility' is true, we falsely think it's false and toggle to true (staying true).
    const currentVisibility = (cat as any).visible ?? (cat as any).visibility ?? (cat as any).Visibility ?? false;
    const newVal = !currentVisibility;

    // Create updated object for local state (update BOTH keys to be safe)
    const updatedLocal = {
      ...cat,
      visible: newVal,
      visibility: newVal
    };

    // Optimistically update local state
    setChildCategories(prev => prev.map(c => (c.documentId || (c as any)._id) === id ? updatedLocal : c));

    try {
      const sub = subCategories.find(s => (s.documentId || (s as any)._id) === cat.subCategoryId);

      let url = "";
      if (sub) {
        url = `/main/${sub.mainCategoryId}/sub/${sub.documentId}/child/${id}`;
      } else {
        const main = mainCategories.find(m => (m._id || (m as any).id) === (cat as any).mainCategoryId);
        if (main) {
          url = `/main/${main._id}/child/${id}`;
        }
      }

      if (url) {
        // Send CLEAN payload as requested (Name + Visibility only)
        const payload = {
          name: cat.name,
          visibility: newVal
        };

        console.log("🚀 Toggling Child Visibility:", url, payload);
        await api.put(url, payload);
      } else {
        console.warn("Could not determine parent path for child category toggle");
      }

    } catch (e) {
      console.error("Failed to toggle child visibility", e);
      // Revert on failure
      setChildCategories(prev => prev.map(c => (c.documentId || (c as any)._id) === id ? cat : c));
      alert("Failed to update visibility");
    }
  };

  const toggleDeepChildVisibility = async (id: string, field: string = "visible") => {
    const cat = deepChildCategories.find(c => (c.id || (c as any).documentId) === id);
    if (!cat) return;

    // ✅ Map UI fields to Backend fields
    let backendField = field;
    if (field === "childCatVideosVisible") backendField = "videoVisible"; // Map video toggle
    if (field === "visible") backendField = "deepCategoryVisible";

    // ✅ Determine New Value
    // Check both keys to be safe
    const currentVal = (cat as any)[field] ?? (cat as any)[backendField] ?? false;
    const newVal = !currentVal;

    // ✅ Create Updated Local Object
    const updated = {
      ...cat,
      [field]: newVal,
      [backendField]: newVal
    };

    // Sync aliases
    if (backendField === "deepCategoryVisible") {
      updated.visible = newVal;
      updated.deepCategoryVisible = newVal;
    }
    if (backendField === "videoVisible") {
      updated.childCatVideosVisible = newVal;
      updated.videoVisible = newVal;
    }

    // ✅ Optimistic UI Update
    setDeepChildCategories(prev => prev.map(c => (c.id || (c as any).documentId) === id ? updated : c));

    try {
      const token = localStorage.getItem("token");
      const mainCategoryId = cat.mainCategoryId;
      const childCategoryId = cat.childCategoryId;
      const subCategoryId = cat.subCategoryId;
      const deepId = cat.id || (cat as any).documentId;

      if (!mainCategoryId || !childCategoryId) {
        console.error("Missing parent IDs for deep child update", cat);
        return;
      }

      let url = "";
      if (subCategoryId) {
        url = `${BASE_URL}/main/${mainCategoryId}/sub/${subCategoryId}/child/${childCategoryId}/deep/${deepId}`;
      } else {
        url = `${BASE_URL}/main/${mainCategoryId}/child/${childCategoryId}/deep/${deepId}`;
      }

      // ✅ Construct Clean Payload with ALL Visibility Flags
      // This ensures we don't accidentally unset other flags or send incomplete data
      const payload = {
        ...cat, // Start with existing data

        // Explicitly set the field we are changing
        [backendField]: newVal,

        // Ensure specific fields are present (fallback to existing or logic)
        deepCategoryVisible: backendField === "deepCategoryVisible" ? newVal : (cat.deepCategoryVisible ?? cat.visible ?? true),
        visible: backendField === "deepCategoryVisible" ? newVal : (cat.visible ?? cat.deepCategoryVisible ?? true),

        firstTitleVisible: backendField === "firstTitleVisible" ? newVal : (cat.firstTitleVisible ?? true),
        secondTitleVisible: backendField === "secondTitleVisible" ? newVal : (cat.secondTitleVisible ?? true),
        descriptionVisible: backendField === "descriptionVisible" ? newVal : (cat.descriptionVisible ?? true),

        webviewUrlVisible: backendField === "webviewUrlVisible" ? newVal : (cat.webviewUrlVisible ?? true),
        originalPriceVisible: backendField === "originalPriceVisible" ? newVal : (cat.originalPriceVisible ?? true),
        currentPriceVisible: backendField === "currentPriceVisible" ? newVal : (cat.currentPriceVisible ?? true),

        minTimeVisible: backendField === "minTimeVisible" ? newVal : (cat.minTimeVisible ?? true),
        maxTimeVisible: backendField === "maxTimeVisible" ? newVal : (cat.maxTimeVisible ?? true),

        photoVisible: backendField === "photoVisible" ? newVal : (cat.photoVisible ?? true),

        // Handle Video Mapping Correctly
        videoVisible: backendField === "videoVisible" ? newVal : (cat.videoVisible ?? cat.childCatVideosVisible ?? true),
        childCatVideosVisible: backendField === "videoVisible" ? newVal : (cat.childCatVideosVisible ?? cat.videoVisible ?? true),
      };

      console.log(`🚀 Updating Deep Child Field [${backendField}] to [${newVal}]`, url, payload);

      await axios.put(url, payload, {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
          "x-api-token": API_TOKEN,
          "Content-Type": "application/json",
        }
      });

    } catch (e: any) {
      console.error("Failed to update deep child category", e.response?.data || e);
      // Revert if needed
      setDeepChildCategories(prev => prev.map(c => (c.id || (c as any).documentId) === id ? cat : c));
    }
  };

  const toggleSubDeepChildVisibility = async (id: string, field: string = "visible") => {
    // Find item
    const cat = subDeepChildCategories.find((cat) => (cat.id || (cat as any).subDeepKey || (cat as any).documentId) === id);
    if (!cat) return;

    // ✅ Map UI fields to Backend fields
    let backendField = field;
    if (field === "childCatVideosVisible") backendField = "videoVisible";
    if (field === "visible") backendField = "subDeepCategoryVisible";

    // Determine current value
    const currentVal = (cat as any)[backendField] ?? (cat as any)[field] ?? (cat as any).visible ?? false;
    const newVal = !currentVal;

    // Local Update Object
    const updated = {
      ...cat,
      [field]: newVal,
      [backendField]: newVal
    };

    // Sync aliases
    if (backendField === "subDeepCategoryVisible") {
      updated.visible = newVal;
      updated.subDeepCategoryVisible = newVal;
    }
    if (backendField === "videoVisible") {
      updated.childCatVideosVisible = newVal;
      updated.videoVisible = newVal;
    }

    // Optimistic Update
    setSubDeepChildCategories((prev) =>
      prev.map((c) => (c.id === id || (c as any).subDeepKey === id || (c as any).documentId === id) ? updated : c)
    );

    // Persist to Backend
    try {
      const token = localStorage.getItem("token");
      const { mainCategoryId, subCategoryId, childCategoryId, deepChildCategoryId, subDeepKey, documentId } = cat;
      const subDeepId = subDeepKey || documentId || id;

      if (!mainCategoryId || !childCategoryId || !deepChildCategoryId) {
        console.error("Missing parent context for sub-deep update", cat);
        return;
      }

      let url = "";

      // 🔥 Fix: Use /child-key/ when subCategoryId is missing, matching addSubDeepChildCategory
      if (subCategoryId) {
        url = `${BASE_URL}/main/${mainCategoryId}/sub/${subCategoryId}/child/${encodeURIComponent(childCategoryId)}/deep/${encodeURIComponent(deepChildCategoryId)}/sub/${encodeURIComponent(subDeepId)}`;
      } else {
        url = `${BASE_URL}/main/${mainCategoryId}/child-key/${encodeURIComponent(childCategoryId)}/deep/${encodeURIComponent(deepChildCategoryId)}/sub/${encodeURIComponent(subDeepId)}`;
      }

      // ✅ Construct Clean JSON Payload (No ...cat spread to avoid garbage)
      const source = {
        ...cat,
        [backendField]: newVal,
        subDeepCategoryVisible: backendField === "subDeepCategoryVisible" ? newVal : (cat.subDeepCategoryVisible ?? cat.visible ?? true),
        visible: backendField === "subDeepCategoryVisible" ? newVal : (cat.visible ?? cat.subDeepCategoryVisible ?? true),
        videoVisible: backendField === "videoVisible" ? newVal : (cat.videoVisible ?? cat.childCatVideosVisible ?? true),
        childCatVideosVisible: backendField === "videoVisible" ? newVal : (cat.childCatVideosVisible ?? cat.videoVisible ?? true),
      };

      const payload = {
        // Core Identity
        documentId: subDeepId,

        // Content
        firstTitle: source.firstTitle,
        secondTitle: source.secondTitle,
        description: source.description,
        webviewUrl: source.webviewUrl,

        // Visibility Sync
        subDeepCategoryVisible: source.subDeepCategoryVisible,
        visible: source.visible,

        // Pricing (Pass through existing)
        originalPrice: source.originalPrice,
        discountType: source.discountType,
        discountValue: source.discountValue,
        gst: source.gst,
        gstType: source.gstType,
        // Ensure calculated prices are passed if they exist
        priceAfterGst: source.priceAfterGst,
        currentPrice: source.currentPrice,
        currentPriceVisible: true,

        // Time
        minTime: source.minTime,
        maxTime: source.maxTime,

        // Visibility Flags
        firstTitleVisible: source.firstTitleVisible ?? true,
        secondTitleVisible: source.secondTitleVisible ?? true,
        descriptionVisible: source.descriptionVisible ?? true,
        webviewUrlVisible: source.webviewUrlVisible ?? true,
        originalPriceVisible: source.originalPriceVisible ?? true,
        minTimeVisible: source.minTimeVisible ?? true,
        maxTimeVisible: source.maxTimeVisible ?? true,

        // Media Flags
        photoVisible: source.photoVisible ?? true,
        videoVisible: source.videoVisible, // from source (synced)
      };

      console.log(`🚀 Updating Sub-Deep Field [${backendField}] to [${newVal}] via JSON Clean Payload`, url, payload);

      await axios.put(url, payload, {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
          "x-api-token": API_TOKEN,
          "Content-Type": "application/json",
        }
      });
    } catch (e: any) {
      console.error("Failed to update sub-deep child category", e.response?.data || e);
      // Revert
      setSubDeepChildCategories(prev => prev.map(c => (c.id === id || (c as any).subDeepKey === id || (c as any).documentId === id) ? cat : c));
    }
  };

  return (
    <CategoryContext.Provider
      value={{
        addChildCategoryMedia,
        mainCategories,
        subCategories,
        childCategories,
        deepChildCategories,
        subDeepChildCategories, // Ensure this is here

        // ✅ EXPOSE THIS

        addMainCategory: addMainCategory as any,
        fetchMainCategories,
        addSubCategory: addSubCategory as any,
        addChildCategory: addChildCategory as any,
        addDeepChildCategory: addDeepChildCategory as any,
        fetchSubDeepChildCategories, // Add this missing one
        addSubDeepChildCategory, // Ensure this is here
        deleteMainCategory,
        deleteSubCategory,
        deleteChildCategory,
        deleteDeepChildCategory,
        deleteSubDeepChildCategory, // Ensure this is here
        toggleMainVisibility,
        toggleMainNameVisibility,
        toggleMainImageVisibility,
        toggleMainIsSub,   // ✅ only once
        toggleSubVisibility,
        toggleSubNameVisibility, // ✅ Expose this function
        toggleSubImageVisibility,
        toggleSubHasSubCategory,
        toggleChildVisibility,
        toggleDeepChildVisibility,
        toggleSubDeepChildVisibility,
        isLoadingSubDeep,
        fetchSubCategories,
        updateMainCategory,
        updateSubCategory,
        updateChildCategory,
        updateChildCategoryWithSub,
        updateDeepChildCategory,
        updateDeepChildCategoryWithSub,
        updateSubDeepChildCategory,
        fetchChildCategories,
        fetchDeepChildCategories,

        // V2 Exports
        childCategoriesV2,
        fetchChildCategoryMedia,
        updateChildCategoryMediaByIndex,
        updateChildCategoryMediaGroup,
        deleteChildCategoryMediaByIndex,
        deleteChildCategoryV2
      }}
    >
      {children}
    </CategoryContext.Provider>
  );
};

export const useCategory = () => {
  const context = useContext(CategoryContext);
  if (!context) {
    throw new Error('useCategory must be used within a CategoryProvider');
  }
  return context;
};
