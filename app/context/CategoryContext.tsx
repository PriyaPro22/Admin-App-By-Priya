"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import axios from 'axios';
import { api } from '../utils/api';


const BASE_URL = "https://api.bijliwalaaya.in/api/product-listing";
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
}

// Sub Category Interface
export interface SubCategory {
  documentId: string;
  name: string;
  mainCategoryId: string;
  visible: boolean;
  isSubCategoryVisible: boolean;
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
  imageUri?: string | null;
  isChildCategoryVisible?: boolean;
  visible?: boolean;
}

// Deep Child Category Interface
export interface DeepChildCategory {
  id: string;
  childCategoryId: string;
  childCategoryName: string; // denormalized
  firstTitle: string;
  secondTitle: string;
  description: string;
  visible?: boolean;
}

// Sub Deep Child Category Interface
export interface SubDeepChildCategory {
  id: string;
  deepChildCategoryId: string;
  deepChildCategoryName: string; // denormalized
  title: string;
  description: string;
  visible?: boolean;
}

interface CategoryContextType {
  mainCategories: MainCategory[];
  subCategories: SubCategory[];
  childCategories: ChildCategory[];
  deepChildCategories: DeepChildCategory[];
  subDeepChildCategories: SubDeepChildCategory[];

  fetchMainCategories: () => Promise<void>;
  fetchSubCategories: (mainId: string) => Promise<void>;
  fetchChildCategories: (mainId: string, subId: string | null) => Promise<void>;

  // Implementation uses (mainId, childId, subId)
  fetchDeepChildCategories: (mainId: string, childId: string, subId?: string | null) => Promise<void>;

  fetchSubDeepChildCategories: (mainId: string, subId: string | null, childId: string, deepId: string) => void;

  addMainCategory: (category: Omit<MainCategory, 'id'>) => Promise<void>;
  addSubCategory: (category: Omit<SubCategory, 'id'>) => Promise<void>;
  addChildCategory: (category: Omit<ChildCategory, 'id'>) => Promise<void>;
  addDeepChildCategory: (category: Omit<DeepChildCategory, 'id'>) => Promise<void>;
  addSubDeepChildCategory: (category: Omit<SubDeepChildCategory, 'id'>) => void;

  deleteMainCategory: (id: string) => Promise<void>;
  deleteSubCategory: (id: string) => Promise<void>;
  deleteChildCategory: (id: string) => Promise<void>;
  deleteDeepChildCategory: (id: string) => Promise<void>;
  deleteSubDeepChildCategory: (id: string) => void;

  toggleMainVisibility: (id: string) => Promise<void>;
  toggleMainImageVisibility: (id: string) => Promise<void>;
  toggleMainIsSub: (id: string) => Promise<void>;
  toggleSubVisibility: (id: string) => Promise<void>;
  toggleSubImageVisibility: (id: string) => Promise<void>;
  toggleSubHasSubCategory: (id: string) => Promise<void>;

  toggleChildVisibility: (id: string) => Promise<void>;
  toggleDeepChildVisibility: (id: string) => Promise<void>;
  toggleSubDeepChildVisibility: (id: string) => void;
}

const CategoryContext = createContext<CategoryContextType | undefined>(undefined);

export const CategoryProvider = ({ children }: { children: ReactNode }) => {
  const [mainCategories, setMainCategories] = useState<MainCategory[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [childCategories, setChildCategories] = useState<ChildCategory[]>([]);
  const [deepChildCategories, setDeepChildCategories] = useState<DeepChildCategory[]>([]);
  const [subDeepChildCategories, setSubDeepChildCategories] = useState<SubDeepChildCategory[]>([]); // Local state for SubDeep


  // FETCH MAIN DATA ON MOUNT
  useEffect(() => {
    fetchMainCategories();
  }, []);

  const fetchMainCategories = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("https://api.bijliwalaaya.in/api/product-listing/main", {
        headers: {
          "Content-Type": "application/json",
          "x-api-token": "super_secure_token",
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




  // Helper to fetch subs for a main
  // =======================
  // 🔥 FETCH SUB CATEGORIES (FINAL & CORRECT)
  // =======================
  const fetchSubCategories = async (mainId: string) => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        `https://api.bijliwalaaya.in/api/product-listing/main/${mainId}/sub`,
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
            "x-api-token": "super_secure_token",
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
          parentName: parentName,
          isSubCategoryVisible: item.isSubCategoryVisible ?? item.visible ?? true,
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
        ? `https://api.bijliwalaaya.in/api/product-listing/main/${mainId}/sub/${subId}/child`
        : `https://api.bijliwalaaya.in/api/product-listing/main/${mainId}/child`;

      console.log("🚀 CHILD CATEGORY URL:", url);

      const response = await axios.get(url, {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
          "x-api-token": "super_secure_token",
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
      const list = Array.isArray(rawData)
        ? rawData.map((item: any) => ({ ...item, parentName }))
        : Object.entries(rawData).map(([id, value]: any) => ({
          documentId: id,
          ...value,
          parentName
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
      if (!mainId || !childId) return;

      let url = "";

      // 🔥 CASE 1: WITH SUB CATEGORY
      if (subId) {
        url = `https://api.bijliwalaaya.in/api/product-listing/main/${mainId}/sub/${subId}/child/${childId}/deep`;
      }
      // 🔥 CASE 2: WITHOUT SUB CATEGORY
      else {
        url = `https://api.bijliwalaaya.in/api/product-listing/main/${mainId}/child/${childId}/deep`;
      }

      console.log("🚀 FETCH DEEP URL:", url);

      const res = await api.get(url);
      const rawData = res.data?.data || {};

      // 🔥 OBJECT → ARRAY FIX
      const list = Array.isArray(rawData)
        ? rawData
        : Object.entries(rawData).map(([id, value]: any) => ({
          documentId: id,
          ...value,
        }));

      console.log("✅ FINAL DEEP CHILD LIST:", list);

      setDeepChildCategories(list);
    } catch (error: any) {
      console.error("❌ Error fetching deep child categories:", error);
      setDeepChildCategories([]);
    }
  };
  // subDeepChildCategories
  const fetchSubDeepChildCategories = async (
    mainId: string,
    childKey: string,
    deepKey: string,
    subId?: string | null
  ) => {
    setSubDeepChildCategories([]);
    try {
      if (!mainId || !childKey || !deepKey) return;

      let url = "";

      // 🔥 WITH SUB CATEGORY
      if (subId) {
        url = `https://api.bijliwalaaya.in/api/product-listing/main/${mainId}/sub/${subId}/child/${childKey}/deep/${deepKey}/sub`;
      }
      // 🔥 WITHOUT SUB CATEGORY
      else {
        url = `https://api.bijliwalaaya.in/api/product-listing/main/${mainId}/child-key/${childKey}/deep/${deepKey}/sub`;
      }

      console.log("🚀 FETCH SUB-DEEP URL:", url);

      const res = await api.get(url);
      const rawData = res.data?.data || {};

      const list = Array.isArray(rawData)
        ? rawData
        : Object.entries(rawData).map(([id, value]: any) => ({
          subDeepKey: id,
          ...value,
        }));

      console.log("✅ FINAL SUB-DEEP LIST:", list);
      setSubDeepChildCategories(list);
      return list;
    } catch (error) {
      console.error("❌ Error fetching sub deep child:", error);
      return [];
    }
  };


  // ACTIONS
  const addMainCategory = async (category: {
    _id: string;              // 🔥 REQUIRED
    name: string;
    visible: boolean;
    imageVisibility: boolean;
    isSubCategory: boolean;
    parentId?: string | null;
    imageUri?: string | null;
  }) => {
    try {
      const token = localStorage.getItem("token");

      const payload = {
        _id: category._id, // ✅ THIS IS THE FIX
        docuemntId: category._id,
        hasSubCategory: category.isSubCategory,
        imageUri: category.imageUri || null,
        isMainCategoryImageVisible: category.imageVisibility,
        isMainCategoryNameVisible: true,
        isMainCategoryVisible: category.visible,
        name: category.name,
        parentId: category.parentId,

      };

      console.log("🚀 FINAL PAYLOAD:", payload);

      const res = await axios.post(
        "https://api.bijliwalaaya.in/api/product-listing/main",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "x-api-token": "super_secure_token",
            "Content-Type": "application/json",
          },
        }
      );

      await fetchMainCategories();
      return res.data;
    } catch (error: any) {
      console.error("API Error:", error.response?.data || error.message);
      throw new Error(
        error.response?.data?.message || "Failed to save main category"
      );
    }
  };
  const addSubCategory = async (category: {
    _id: string;              // subCategoryId
    name: string;
    mainCategoryId: string;   // mainCategoryId
    visible: boolean;
    imageUri?: string | null;
  }) => {
    try {
      const token = localStorage.getItem("token");

      const payloadSubcat = {
        documentId: category._id,
        name: category.name,

        mainCategory: category.mainCategoryId, // ✅ VERY IMPORTANT

        isSubCategoryVisible: category.visible,
        isSubCategoryNameVisible: true,
        isSubCategoryImageVisible: true,

        imageUri: category.imageUri || null,
      };


      // 🔥 DEBUG (VERY IMPORTANT)
      console.log(
        "🚀 FINAL URL:",
        `https://api.bijliwalaaya.in/api/product-listing/main/${payloadSubcat.mainCategory}/sub/${payloadSubcat.documentId}`
      );
      console.log("📦 PAYLOAD:", payloadSubcat);

      const res = await axios.post(
        `https://api.bijliwalaaya.in/api/product-listing/main/${payloadSubcat.mainCategory}/sub/${payloadSubcat.documentId}`,
        payloadSubcat,
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
            "x-api-token": "super_secure_token",
            "Content-Type": "application/json",
          },
        }
      );

      return res.data;
    } catch (error: any) {
      console.error(
        "❌ SubCategory Error:",
        error.response?.data || error.message
      );
      throw new Error("Failed to save sub category");
    }
  };
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
  //       ? `https://api.bijliwalaaya.in/api/product-listing/main/${category.mainCategoryId}/sub/${category.subCategoryId}/child/${childId}`
  //       : `https://api.bijliwalaaya.in/api/product-listing/main/${category.mainCategoryId}/child/${childId}`;

  //     const payload = {
  //       name: category.name,
  //       Visibility: true, 
  //     };

  //     console.log("🚀 CHILD CATEGORY URL:", url);
  //     console.log("📦 PAYLOAD:", payload);

  //     await axios.post(url, payload, {
  //       headers: {
  //         Authorization: token ? `Bearer ${token}` : "",
  //         "x-api-token": "super_secure_token",
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
  //     url = `https://api.bijliwalaaya.in/api/product-listing/main/${mainCategoryId}/sub/${subCategoryId}/child/${childCategoryId}/deep/${deepId}`;
  //   }
  //   // ✅ WITHOUT SUB CATEGORY
  //   else {
  //     url = `https://api.bijliwalaaya.in/api/product-listing/main/${mainCategoryId}/child/${childCategoryId}/deep/${deepId}`;
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
  //         "x-api-token": "super_secure_token",
  //         "Content-Type": "application/json",
  //       },
  //     }
  //   );
  // };
  const addChildCategory = async (category: {
    name: string;
    mainCategoryId: string;
    subCategoryId?: string | null;
    visible: boolean;
  }) => {
    try {
      const token = localStorage.getItem("token");

      // ✅ URL SAFE ID
      const childId = encodeURIComponent(category.name);

      const url = category.subCategoryId
        ? `https://api.bijliwalaaya.in/api/product-listing/main/${category.mainCategoryId}/sub/${category.subCategoryId}/child/${childId}`
        : `https://api.bijliwalaaya.in/api/product-listing/main/${category.mainCategoryId}/child/${childId}`;

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
          "x-api-token": "super_secure_token",
          "Content-Type": "application/json",
        },
      });
    } catch (error: any) {
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
  //     url = `https://api.bijliwalaaya.in/api/product-listing/main/${mainCategoryId}/sub/${subCategoryId}/child/${childCategoryId}/deep/${deepChildId}`;
  //   } 
  //   // ✅ WITHOUT SUB CATEGORY
  //   else {
  //     url = `https://api.bijliwalaaya.in/api/product-listing/main/${mainCategoryId}/child/${childCategoryId}/deep/${deepChildId}`;
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
  //         "x-api-token": "super_secure_token",
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
  //     url = `https://api.bijliwalaaya.in/api/product-listing/main/${mainCategoryId}/sub/${subCategoryId}/child/${childCategoryId}/deep/${deepChildCategoryId}/sub/${subDeepKey}`;
  //   }
  //   // ✅ WITHOUT SUB CATEGORY
  //   else {
  //     url = `https://api.bijliwalaaya.in/api/product-listing/main/${mainCategoryId}/child-key/${childCategoryId}/deep/${deepChildCategoryId}/sub/${subDeepKey}`;
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
  //         "x-api-token": "super_secure_token",
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
  //     url = `https://api.bijliwalaaya.in/api/product-listing/main/${mainCategoryId}/sub/${subCategoryId}/child/${childCategoryId}/deep/${deepChildId}`;
  //   } else {
  //     url = `https://api.bijliwalaaya.in/api/product-listing/main/${mainCategoryId}/child/${childCategoryId}/deep/${deepChildId}`;
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
  //       "x-api-token": "super_secure_token",
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

    let url = "";

    if (subCategoryId) {
      url = `https://api.bijliwalaaya.in/api/product-listing/main/${mainCategoryId}/sub/${subCategoryId}/child/${childCategoryId}/deep/${deepChildId}`;
    } else {
      url = `https://api.bijliwalaaya.in/api/product-listing/main/${mainCategoryId}/child/${childCategoryId}/deep/${deepChildId}`;
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
        "x-api-token": "super_secure_token",
        "Content-Type": "application/json",
      },
    });
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
  //     url = `https://api.bijliwalaaya.in/api/product-listing/main/${mainCategoryId}/sub/${subCategoryId}/child/${childCategoryId}/deep/${deepChildCategoryId}/sub/${subDeepKey}`;
  //   }
  //   // ✅ WITHOUT SUB CATEGORY
  //   else {
  //     url = `https://api.bijliwalaaya.in/api/product-listing/main/${mainCategoryId}/child-key/${childCategoryId}/deep/${deepChildCategoryId}/sub/${subDeepKey}`;
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
  //         "x-api-token": "super_secure_token",
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

    let url = "";

    if (subCategoryId) {
      url = `https://api.bijliwalaaya.in/api/product-listing/main/${mainCategoryId}/sub/${subCategoryId}/child/${childCategoryId}/deep/${deepChildCategoryId}/sub/${subDeepKey}`;
    } else {
      url = `https://api.bijliwalaaya.in/api/product-listing/main/${mainCategoryId}/child-key/${childCategoryId}/deep/${deepChildCategoryId}/sub/${subDeepKey}`;
    }

    return axios.post(
      url,
      {
        // 📝 CONTENT
        firstTitle: data.firstTitle,
        secondTitle: data.secondTitle,
        description: data.description,
        visible: data.subDeepCategoryVisible,
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
          "x-api-token": "super_secure_token",
          "Content-Type": "application/json",
        },
      }
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

      // Try to find sub - if not found, it might be a direct child of main? 
      // Current context assumes hierarchical structure for deletion, need to be careful.
      // For now, finding sub is safest if we follow the full path.
      // If we don't have subId, maybe we can delete directly if backend supports it or if we stored parentId.

      const sub = subCategories.find(s => (s.documentId || (s as any)._id || (s as any).id) === child.subCategoryId);
      // NOTE: strict dependency on sub might be issue if we navigated directly. 
      // But for now, let's assume we have it or modify backend to simple delete.

      if (sub) {
        await api.delete(`/main/${sub.mainCategoryId}/sub/${sub.documentId}/child/${id}`);
      } else {
        // Fallback: maybe direct child of main? user needs to fix this if architecture supports it
        console.warn("Parent SubCategory not found for deletion, trying direct?");
        // await api.delete(...) // Risk.
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

      setDeepChildCategories((prev) => prev.filter((cat) => (cat.id || (cat as any)._id || (cat as any).documentId) !== id));
      // Add API call if needed
    } catch (e) {
      console.error(e);
    }
  };

  // SubDeepChildCategory deletion (local only)
  const deleteSubDeepChildCategory = (id: string) => {
    setSubDeepChildCategories((prev) => prev.filter((cat) => (cat.id || (cat as any)._id) !== id));
  };

  // TOGGLE VISIBILITY
  const toggleMainVisibility = async (id: string) => {
    const cat = mainCategories.find(c => c._id === id);
    if (!cat) return;

    // Toggle
    const newVal = !cat.isMainCategoryVisible;
    // We use isMainCategoryVisible based on interface, but previously used visible. 
    // Let's normalize update.

    const updated = { ...cat, isMainCategoryVisible: newVal, visible: newVal };

    // Optimistic update
    setMainCategories(prev => prev.map(c => c._id === id ? updated : c));
    try {
      await api.put(`/main/${id}`, updated);
    } catch (e) {
      console.error("Failed to toggle main visibility", e);
      // Revert on failure
      setMainCategories(prev => prev.map(c => c._id === id ? cat : c));
      alert("Failed to update visibility");
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
      await api.put(`/main/${cat.mainCategoryId}/sub/${id}`, {
        ...updated,
        // Ensure backend fields are correct
        isSubCategoryVisible: newVal,
        visible: newVal
      });
    } catch (e) {
      console.error("Failed to toggle sub visibility", e);
      // Revert
      setSubCategories(prev => prev.map(c => (c.documentId || (c as any)._id) === id ? cat : c));
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
      await api.put(`/main/${cat.mainCategoryId}/sub/${id}`, updated);
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
      await api.put(`/main/${cat.mainCategoryId}/sub/${id}`, updated);
    } catch (e) {
      console.error("Failed to toggle sub hasSubCategory", e);
      setSubCategories(prev => prev.map(c => (c.documentId || (c as any)._id) === id ? cat : c));
    }
  };

  const toggleChildVisibility = async (id: string) => {
    const cat = childCategories.find(c => (c.documentId || (c as any)._id) === id);
    if (!cat) return;

    // Optimistically toggle
    const updated = { ...cat, visible: !(cat as any).visible /* or isChildCategoryVisible */ };
    setChildCategories(prev => prev.map(c => (c.documentId || (c as any)._id) === id ? updated : c));

    // Need sub info for path
    const sub = subCategories.find(s => (s.documentId || (s as any)._id) === cat.subCategoryId);
    if (sub) {
      try {
        await api.put(`/main/${sub.mainCategoryId}/sub/${sub.documentId}/child/${id}`, updated);
      } catch (e) {
        console.error(e);
        // Revert
        setChildCategories(prev => prev.map(c => (c.documentId || (c as any)._id) === id ? cat : c));
      }
    }
  };

  const toggleDeepChildVisibility = async (id: string) => {
    // Implementation similar to above, fixing ID checks
    const cat = deepChildCategories.find(c => (c.id || (c as any).documentId) === id);
    if (!cat) return;
    const updated = { ...cat, visible: !cat.visible };
    setDeepChildCategories(prev => prev.map(c => (c.id || (c as any).documentId) === id ? updated : c));
  };

  const toggleSubDeepChildVisibility = (id: string) => {
    setSubDeepChildCategories((prev) =>
      prev.map((cat) => (cat.id === id ? { ...cat, visible: !cat.visible } : cat))
    );
  };

  return (
    <CategoryContext.Provider
      value={{
        mainCategories,
        subCategories,
        childCategories,
        deepChildCategories,
        subDeepChildCategories, // Ensure this is here
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
        toggleMainImageVisibility,
        toggleMainIsSub,
        toggleMainIsSub,
        toggleSubVisibility,
        toggleSubImageVisibility,
        toggleSubHasSubCategory,
        toggleChildVisibility,
        toggleDeepChildVisibility,
        toggleSubDeepChildVisibility,
        fetchSubCategories,
        fetchChildCategories,
        fetchDeepChildCategories
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
