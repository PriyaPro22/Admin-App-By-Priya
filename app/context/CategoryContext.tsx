
"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import axios from 'axios';
import { api, BASE_URL, API_TOKEN, getAuthHeaders } from '../utils/api';
import { generateCategoryId } from '../utils/generateCategoryId';

// ==================== INTERFACES ====================
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

export interface SubCategory {
  documentId: string;
  name: string;
  mainCategoryId: string;
  isSubCategoryVisible: boolean;
  isSubCategoryNameVisible: boolean;
  isSubCategoryImageVisible: boolean;
  hasSubCategory?: boolean;
  imageUri?: string | null;
  parentName?: string;
}

export interface ChildCategory {
  documentId: string;
  name: string;
  subCategoryId?: string | null;
  mainCategoryId?: string;
  imageUri?: string | null;
  isChildCategoryVisible?: boolean;
  visible?: boolean;
}

export interface DeepChildCategory {
  id: string;
  documentId?: string;
  childCategoryId: string;
  childCategoryName?: string;
  firstTitle: string;
  secondTitle: string;
  description: string;
  webviewUrl?: string;
  image?: string | null;        // ✅ FIXED: 'image' field, not 'imageUri'
  video?: string | null;        // ✅ FIXED: 'video' field, not 'videoUri'
  originalPrice?: number;
  discountType?: string;
  discountValue?: number;
  gst?: number;
  gstType?: string;
  priceAfterGst?: number;
  currentPrice?: number;
  minTime?: number | null;
  maxTime?: number | null;
  deepCategoryVisible?: boolean;
  visible?: boolean;
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
  mainCategoryId?: string;
  subCategoryId?: string | null;
}

export interface SubDeepChildCategory {
  id: string;
  subDeepKey?: string;
  documentId?: string;
  deepChildCategoryId: string;
  childCategoryId: string;
  mainCategoryId?: string;
  subCategoryId?: string | null;
  deepChildCategoryName?: string;
  firstTitle: string;
  secondTitle: string;
  description: string;
  webviewUrl?: string;
  subDeepCategoryVisible?: boolean;
   image?: string | null;      // 🔥 IMPORTANT: 'image' field, not 'imageUri'
  video?: string | null;
  visible?: boolean;
  originalPrice?: number;
  discountType?: string;
  discountValue?: number;
  gst?: number;
  gstType?: string;
  priceAfterGst?: number;
  currentPrice?: number;
  minTime?: number | null;
  maxTime?: number | null;
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

export interface ChildCategoryV2 {
  key: string;
  name: string;
  visibility: boolean;
  images: {
    name: string;
    visibility: boolean;
    [key: string]: any;
  };
  videos: {
    name: string;
    visibility: boolean;
    [key: string]: any;
  };
  links: {
    name: string;
    visibility: boolean;
    [key: string]: any;
  };
  updatedAt?: string;
}

interface CategoryContextType {
  // Data
  mainCategories: MainCategory[];
  subCategories: SubCategory[];
  childCategories: ChildCategory[];
  deepChildCategories: DeepChildCategory[];
  subDeepChildCategories: SubDeepChildCategory[];
  childCategoriesV2: Record<string, ChildCategoryV2>;
  isLoadingSubDeep: boolean;
  
  // Fetch
  fetchMainCategories: () => Promise<void>;
  fetchSubCategories: (mainId: string) => Promise<void>;
  fetchChildCategories: (mainId: string, subId?: string | null) => Promise<void>;
  fetchDeepChildCategories: (mainId: string, childId: string, subId?: string | null) => Promise<void>;
  fetchSubDeepChildCategories: (mainId: string, childId: string, deepId: string, subId?: string | null) => Promise<void>;
  fetchChildCategoryMedia: (mainId: string, subId?: string) => Promise<any>;
  
  // Add
  addMainCategory: (category: any) => Promise<void>;
  addSubCategory: (category: any) => Promise<void>;
  addChildCategory: (category: any) => Promise<void>;
  addDeepChildCategory: (category: any) => Promise<void>;
  addSubDeepChildCategory: (category: any) => Promise<void>;
  addChildCategoryMedia: (
    mainId: string,
    type: "images" | "videos" | "links",
    item: any,
    subId?: string
  ) => Promise<void>;
  
  // Update
  updateMainCategory: (item: any) => Promise<void>;
  updateSubCategory: (item: any) => Promise<void>;
  updateChildCategory: (item: any) => Promise<void>;
  updateChildCategoryWithSub: (item: any) => Promise<void>;
  updateDeepChildCategory: (item: any) => Promise<void>;
  updateDeepChildCategoryWithSub: (item: any) => Promise<void>;
  updateSubDeepChildCategory: (item: any) => Promise<void>;
  updateChildCategoryMediaByIndex: (
    mainId: string,
    type: "images" | "videos" | "links",
    index: number | string,
    payload: any,
    subId?: string
  ) => Promise<void>;
  updateChildCategoryMediaGroup: (
    mainId: string,
    type: "images" | "videos" | "links",
    payload: any,
    subId?: string
  ) => Promise<void>;
  
  // Delete
  deleteMainCategory: (id: string) => Promise<void>;
  deleteSubCategory: (id: string) => Promise<void>;
  deleteChildCategory: (id: string) => Promise<void>;
  deleteDeepChildCategory: (id: string) => Promise<void>;
  deleteSubDeepChildCategory: (id: string) => Promise<void>;
  deleteChildCategoryMediaByIndex: (
    mainId: string,
    type: "images" | "videos" | "links",
    index: number | string,
    subId?: string
  ) => Promise<void>;
  deleteChildCategoryV2: (mainId: string, key: string, subId?: string) => Promise<void>;
  
  // Toggle
  toggleMainVisibility: (id: string) => Promise<void>;
  toggleMainNameVisibility: (id: string) => Promise<void>;
  toggleMainImageVisibility: (id: string) => Promise<void>;
  toggleMainIsSub: (id: string) => Promise<void>;
  toggleSubVisibility: (id: string) => Promise<void>;
  toggleSubNameVisibility: (id: string) => Promise<void>;
  toggleSubImageVisibility: (id: string) => Promise<void>;
  toggleSubHasSubCategory: (id: string) => Promise<void>;
  toggleChildVisibility: (id: string) => Promise<void>;
  toggleDeepChildVisibility: (id: string, field?: string) => Promise<void>;
  toggleSubDeepChildVisibility: (id: string, field?: string) => Promise<void>;
}

const CategoryContext = createContext<CategoryContextType | undefined>(undefined);

export const CategoryProvider = ({ children }: { children: ReactNode }) => {
  // ==================== STATE ====================
  const [mainCategories, setMainCategories] = useState<MainCategory[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [childCategories, setChildCategories] = useState<ChildCategory[]>([]);
  const [deepChildCategories, setDeepChildCategories] = useState<DeepChildCategory[]>([]);
  const [subDeepChildCategories, setSubDeepChildCategories] = useState<SubDeepChildCategory[]>([]);
  const [isLoadingSubDeep, setIsLoadingSubDeep] = useState<boolean>(false);
  const [childCategoriesV2, setChildCategoriesV2] = useState<Record<string, ChildCategoryV2>>({});

  // ==================== FETCH ====================
  
  // MAIN CATEGORIES
  const fetchMainCategories = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/main`, {
        headers: getAuthHeaders(),
      });
      
      const data = response.data;
      let rawList = [];
      
      if (Array.isArray(data?.data)) {
        rawList = data.data;
      } else if (Array.isArray(data?.result)) {
        rawList = data.result;
      } else if (Array.isArray(data)) {
        rawList = data;
      }
      
      const list = rawList.map((item: any) => ({
        _id: item.documentId || item._id,
        documentId: item.documentId,
        name: item.name || '',
        imageUri: item.imageUri || item.image || null,
        isMainCategoryVisible: item.isMainCategoryVisible === true || item.isMainCategoryVisible === "true",
        isMainCategoryNameVisible: item.isMainCategoryNameVisible === true || item.isMainCategoryNameVisible === "true",
        isMainCategoryImageVisible: item.isMainCategoryImageVisible === true || item.isMainCategoryImageVisible === "true",
        hasSubCategory: item.hasSubCategory === true || item.hasSubCategory === "true",
        parentId: item.parentId || null,
      }));
      
      setMainCategories(list);
    } catch (error) {
      console.error("Failed to fetch main categories:", error);
      setMainCategories([]);
    }
  };

  // SUB CATEGORIES
  const fetchSubCategories = async (mainId: string) => {
    if (!mainId) {
      setSubCategories([]);
      return;
    }
    
    try {
      const response = await axios.get(`${BASE_URL}/main/${mainId}/sub`, {
        headers: getAuthHeaders(),
      });
      
      const rawData = response.data?.data || {};
      const parentName = mainCategories.find(m => m._id === mainId)?.name || 'Root';
      
      let subs: any[] = [];
      
      if (Array.isArray(rawData)) {
        subs = rawData.map((item: any) => ({
          documentId: item.documentId || item._id,
          name: item.name || '',
          imageUri: item.imageUri || item.image || null,
          mainCategoryId: mainId,
          parentName: parentName,
          isSubCategoryVisible: item.isSubCategoryVisible ?? item.visible ?? true,
          isSubCategoryNameVisible: item.isSubCategoryNameVisible ?? true,
          isSubCategoryImageVisible: item.isSubCategoryImageVisible ?? true,
          hasSubCategory: item.hasSubCategory ?? false,
        }));
      } else {
        subs = Object.entries(rawData).map(([key, value]: any) => ({
          documentId: key,
          name: value.name || '',
          imageUri: value.imageUri || value.image || null,
          mainCategoryId: mainId,
          parentName: parentName,
          isSubCategoryVisible: value.isSubCategoryVisible ?? value.visible ?? true,
          isSubCategoryNameVisible: value.isSubCategoryNameVisible ?? true,
          isSubCategoryImageVisible: value.isSubCategoryImageVisible ?? true,
          hasSubCategory: value.hasSubCategory ?? false,
        }));
      }
      
      setSubCategories(subs);
    } catch (error) {
      console.error("Error fetching sub categories:", error);
      setSubCategories([]);
    }
  };

  // CHILD CATEGORIES
  const fetchChildCategories = async (mainId: string, subId?: string | null) => {
    if (!mainId) {
      setChildCategories([]);
      return;
    }
    
    try {
      const url = subId
        ? `${BASE_URL}/main/${mainId}/sub/${subId}/child`
        : `${BASE_URL}/main/${mainId}/child`;
      
      const response = await axios.get(url, { headers: getAuthHeaders() });
      
      const rawData = response.data?.data || {};
      
      let parentName = 'Root';
      if (subId) {
        const sub = subCategories.find(s => s.documentId === subId);
        parentName = sub?.name || 'Sub Category';
      } else {
        const main = mainCategories.find(m => m._id === mainId);
        parentName = main?.name || 'Main Category';
      }
      
      let list: any[] = [];
      
      if (Array.isArray(rawData)) {
        list = rawData.map((item: any) => ({
          documentId: item.documentId || item._id,
          _id: item.documentId || item._id,
          name: item.name || '',
          imageUri: item.imageUri || null,
          visible: item.visibility ?? item.visible ?? true,
          isChildCategoryVisible: item.isChildCategoryVisible ?? item.visibility ?? item.visible ?? true,
          mainCategoryId: mainId,
          subCategoryId: subId,
          parentName,
        }));
      } else {
        list = Object.entries(rawData).map(([key, value]: any) => ({
          documentId: key,
          _id: key,
          name: value.name || key,
          imageUri: value.imageUri || null,
          visible: value.visibility ?? value.visible ?? true,
          isChildCategoryVisible: value.isChildCategoryVisible ?? value.visibility ?? value.visible ?? true,
          mainCategoryId: mainId,
          subCategoryId: subId,
          parentName,
        }));
      }
      
      setChildCategories(list);
    } catch (error) {
      console.error("Error fetching child categories:", error);
      setChildCategories([]);
    }
  };

  // DEEP CHILD CATEGORIES
  const fetchDeepChildCategories = async (mainId: string, childId: string, subId?: string | null) => {
    if (!mainId || !childId) {
      setDeepChildCategories([]);
      return;
    }
    
    try {
      let url = '';
      if (subId) {
        url = `${BASE_URL}/main/${mainId}/sub/${subId}/child/${childId}/deep`;
      } else {
        url = `${BASE_URL}/main/${mainId}/child/${childId}/deep`;
      }
      
      const response = await axios.get(url, { headers: getAuthHeaders() });
      
      const rawData = response.data?.data || {};
      
      let list: any[] = [];
      
      if (Array.isArray(rawData)) {
        list = rawData.map((item: any) => ({
          id: item.documentId || item._id,
          documentId: item.documentId || item._id,
          ...item,
          mainCategoryId: mainId,
          childCategoryId: childId,
          subCategoryId: subId,
          deepCategoryVisible: item.deepCategoryVisible ?? item.visible ?? true,
          visible: item.visible ?? item.deepCategoryVisible ?? true,
          firstTitleVisible: item.firstTitleVisible ?? true,
          secondTitleVisible: item.secondTitleVisible ?? true,
          descriptionVisible: item.descriptionVisible ?? true,
          webviewUrlVisible: item.webviewUrlVisible ?? true,
          originalPriceVisible: item.originalPriceVisible ?? true,
          minTimeVisible: item.minTimeVisible ?? true,
          maxTimeVisible: item.maxTimeVisible ?? true,
          photoVisible: item.photoVisible ?? true,
          videoVisible: item.videoVisible ?? true,
        }));
      } else {
        list = Object.entries(rawData).map(([key, value]: any) => ({
          id: key,
          documentId: key,
          ...value,
          mainCategoryId: mainId,
          childCategoryId: childId,
          subCategoryId: subId,
          deepCategoryVisible: value.deepCategoryVisible ?? value.visible ?? true,
          visible: value.visible ?? value.deepCategoryVisible ?? true,
          firstTitleVisible: value.firstTitleVisible ?? true,
          secondTitleVisible: value.secondTitleVisible ?? true,
          descriptionVisible: value.descriptionVisible ?? true,
          webviewUrlVisible: value.webviewUrlVisible ?? true,
          originalPriceVisible: value.originalPriceVisible ?? true,
          minTimeVisible: value.minTimeVisible ?? true,
          maxTimeVisible: value.maxTimeVisible ?? true,
          photoVisible: value.photoVisible ?? true,
          videoVisible: value.videoVisible ?? true,
        }));
      }
      
      setDeepChildCategories(list);
    } catch (error) {
      console.error("Error fetching deep child categories:", error);
      setDeepChildCategories([]);
    }
  };

  // SUB DEEP CHILD CATEGORIES
// FETCH SUB DEEP CHILD CATEGORIES - FIXED
const fetchSubDeepChildCategories = async (
  mainId: string,
  childId: string,        // ✅ Display Name (Repair/Services/Installation)
  deepId: string,         // ✅ Document ID (Deep Category ki ID)
  subId?: string | null
) => {
  if (!mainId || !childId || !deepId) {
    setSubDeepChildCategories([]);
    return;
  }
  
  setIsLoadingSubDeep(true);
  
  try {
    let url = '';
    if (subId && subId.trim() !== '') {
      // With Sub Category
      url = `${BASE_URL}/main/${mainId}/sub/${subId}/child/${encodeURIComponent(childId)}/deep/${encodeURIComponent(deepId)}/sub`;
      console.log("🔍 FETCH SUB DEEP URL (with sub):", url);
    } else {
      // Without Sub Category - child-key route
      url = `${BASE_URL}/main/${mainId}/child-key/${encodeURIComponent(childId)}/deep/${encodeURIComponent(deepId)}/sub`;
      console.log("🔍 FETCH SUB DEEP URL (no sub):", url);
    }
    
    const response = await axios.get(url, { headers: getAuthHeaders() });
    const rawData = response.data?.data || {};
    
    let list: any[] = [];
    
    if (Array.isArray(rawData)) {
      list = rawData.map((item: any) => ({
        id: item.documentId || item._id,
        documentId: item.documentId || item._id,
        subDeepKey: item.documentId || item._id,
        ...item,
        mainCategoryId: mainId,
        childCategoryId: childId,        // ✅ Display Name
        deepChildCategoryId: deepId,     // ✅ Document ID
        subCategoryId: subId || null,
        subDeepCategoryVisible: item.subDeepCategoryVisible ?? item.visible ?? true,
        visible: item.visible ?? item.subDeepCategoryVisible ?? true,
        image: item.image || item.imageUri || null,
        video: item.video || item.videoUri || null,
      }));
    } else {
      list = Object.entries(rawData).map(([key, value]: any) => ({
        id: key,
        documentId: key,
        subDeepKey: key,
        ...value,
        mainCategoryId: mainId,
        childCategoryId: childId,        // ✅ Display Name
        deepChildCategoryId: deepId,     // ✅ Document ID
        subCategoryId: subId || null,
        subDeepCategoryVisible: value.subDeepCategoryVisible ?? value.visible ?? true,
        visible: value.visible ?? value.subDeepCategoryVisible ?? true,
        image: value.image || value.imageUri || null,
        video: value.video || value.videoUri || null,
      }));
    }
    
    console.log(`✅ FETCHED ${list.length} SUB DEEP CATEGORIES`);
    setSubDeepChildCategories(list);
    
  } catch (error) {
    console.error("❌ Error fetching sub deep child categories:", error);
    setSubDeepChildCategories([]);
  } finally {
    setIsLoadingSubDeep(false);
  }
};
  // CHILD CATEGORY MEDIA
  const fetchChildCategoryMedia = async (mainId: string, subId?: string) => {
    if (!mainId) return null;
    
    try {
      const url = subId
        ? `/main/${mainId}/sub/${subId}/child-category/media`
        : `/main/${mainId}/child-category/media`;
      
      const response = await api.get(url);
      const data = response.data?.data || null;
      
      if (data) {
        setChildCategoriesV2(prev => ({
          ...prev,
          [mainId]: data,
        }));
      }
      
      return data;
    } catch (error) {
      console.error("Error fetching child category media:", error);
      return null;
    }
  };

  // ==================== ADD ====================
  
  // ADD MAIN CATEGORY
  const addMainCategory = async (category: any) => {
    const normalize = (str: string) => (str || '').trim().toLowerCase();
    if (mainCategories.some(c => normalize(c.name) === normalize(category.name))) {
      alert('Main Category with this name already exists!');
      return;
    }
    
    const tempId = `temp-${Date.now()}`;
    const tempItem: any = {
      _id: tempId,
      name: category.name,
      hasSubCategory: category.hasSubCategory || false,
      isMainCategoryVisible: category.isMainCategoryVisible ?? true,
      imageUri: category.imageFile ? 'uploading...' : null,
    };
    
    setMainCategories(prev => [...prev, tempItem]);
    
    try {
      const formData = new FormData();
      formData.append("_id", category._id);
      formData.append('name', category.name);
      formData.append('documentId', category._id || generateCategoryId(category.name));
      formData.append('parentId', category.parentId || '');
      formData.append('hasSubCategory', String(category.hasSubCategory || false));
      formData.append('isMainCategoryVisible', String(category.isMainCategoryVisible ?? true));
      formData.append('isMainCategoryNameVisible', String(category.isMainCategoryNameVisible ?? true));
      formData.append('isMainCategoryImageVisible', String(category.isMainCategoryImageVisible ?? true));
      
      if (category.imageFile instanceof File) {
        formData.append('imageUri', category.imageFile);
      }
      
      await axios.post(`${BASE_URL}/main`, formData, {
        headers: getAuthHeaders(true),
      });
      
      await fetchMainCategories();
    } catch (error) {
      setMainCategories(prev => prev.filter(item => !item._id?.startsWith('temp-')));
      console.error('Failed to add main category:', error);
      throw error;
    }
  };

  // ADD SUB CATEGORY
  const addSubCategory = async (category: any) => {
    const normalize = (str: string) => (str || '').trim().toLowerCase();
    const isDuplicate = subCategories.some(c =>
      normalize(c.name) === normalize(category.name) &&
      c.mainCategoryId === category.mainCategoryId
    );
    
    if (isDuplicate) {
      alert('Sub Category with this name already exists in this Main Category!');
      return;
    }
    
    try {
      const docId = category._id || generateCategoryId(category.name);
      const formData = new FormData();
      
      formData.append('documentId', docId);
      formData.append('name', category.name);
      formData.append('mainCategory', category.mainCategoryId);
      formData.append('isSubCategoryVisible', String(category.visible ?? true));
      formData.append('isSubCategoryNameVisible', String(category.isSubCategoryNameVisible ?? true));
      formData.append('isSubCategoryImageVisible', String(category.isSubCategoryImageVisible ?? true));
      
      if (category.imageFile instanceof File) {
        formData.append('imageUri', category.imageFile);
      }
      
      await axios.post(
        `${BASE_URL}/main/${category.mainCategoryId}/sub/${docId}`,
        formData,
        { headers: getAuthHeaders(true) }
      );
      
      await fetchSubCategories(category.mainCategoryId);
    } catch (error) {
      console.error('Failed to add sub category:', error);
      throw error;
    }
  };

  // ADD CHILD CATEGORY
  const addChildCategory = async (category: any) => {
    const normalize = (str: string) => (str || '').trim().toLowerCase();
    if (childCategories.some(c => normalize(c.name) === normalize(category.name))) {
      alert('Child Category with this name already exists!');
      return;
    }
    
    const tempId = `temp-${Date.now()}`;
    const tempItem: any = {
      documentId: tempId,
      name: category.name,
      visible: category.visible ?? true,
      subCategoryId: category.subCategoryId,
      mainCategoryId: category.mainCategoryId,
    };
    
    setChildCategories(prev => [...prev, tempItem]);
    
    try {
      const childId = encodeURIComponent(category.name);
      const url = category.subCategoryId
        ? `${BASE_URL}/main/${category.mainCategoryId}/sub/${category.subCategoryId}/child/${childId}`
        : `${BASE_URL}/main/${category.mainCategoryId}/child/${childId}`;
      
      await axios.post(
        url,
        { name: category.name, visibility: category.visible ?? true },
        { headers: getAuthHeaders() }
      );
      
      await fetchChildCategories(category.mainCategoryId, category.subCategoryId);
    } catch (error) {
      setChildCategories(prev => prev.filter(item => item.documentId !== tempId));
      console.error('Failed to add child category:', error);
      throw error;
    }
  };

  // ✅ FIXED: ADD DEEP CHILD CATEGORY - WITH IMAGE/VIDEO SUPPORT
  const addDeepChildCategory = async (data: any) => {
    const { mainCategoryId, subCategoryId, childCategoryId, deepChildId } = data;
    
    if (!mainCategoryId || !childCategoryId || !deepChildId) {
      console.error('Missing required IDs');
      return;
    }
    
    try {
      let url = '';
      if (subCategoryId) {
        url = `${BASE_URL}/main/${mainCategoryId}/sub/${subCategoryId}/child/${childCategoryId}/deep/${deepChildId}`;
      } else {
        url = `${BASE_URL}/main/${mainCategoryId}/child/${childCategoryId}/deep/${deepChildId}`;
      }
      
      const formData = new FormData();
      
      // Basic Fields
      formData.append('documentId', deepChildId);
      formData.append('firstTitle', data.firstTitle || '');
      formData.append('secondTitle', data.secondTitle || '');
      formData.append('description', data.description || '');
      formData.append('deepCategoryVisible', String(data.deepCategoryVisible ?? true));
      formData.append('visible', String(data.visible ?? data.deepCategoryVisible ?? true));
      formData.append('webviewUrl', data.webviewUrl || '');
      
      // Time Fields
      if (data.minTime !== undefined && data.minTime !== null) {
        formData.append('minTime', String(data.minTime));
      }
      if (data.maxTime !== undefined && data.maxTime !== null) {
        formData.append('maxTime', String(data.maxTime));
      }
      formData.append('minTimeVisible', String(data.minTimeVisible ?? true));
      formData.append('maxTimeVisible', String(data.maxTimeVisible ?? true));
      
      // Pricing Fields
      formData.append('originalPrice', String(data.originalPrice || 0));
      formData.append('discountType', data.discountType || 'percentage');
      formData.append('discountValue', String(data.discountValue || 0));
      formData.append('gst', String(data.gst || 0));
      formData.append('gstType', data.gstType || 'inclusive');
      formData.append('currentPrice', String(data.currentPrice || 0));
      formData.append('priceAfterGst', String(data.priceAfterGst || 0));
      formData.append('currentPriceVisible', 'true');
      
      // Visibility Flags
      formData.append('firstTitleVisible', String(data.firstTitleVisible ?? true));
      formData.append('secondTitleVisible', String(data.secondTitleVisible ?? true));
      formData.append('descriptionVisible', String(data.descriptionVisible ?? true));
      formData.append('webviewUrlVisible', String(data.webviewUrlVisible ?? true));
      formData.append('originalPriceVisible', String(data.originalPriceVisible ?? true));
      formData.append('photoVisible', String(data.photoVisible ?? true));
      formData.append('videoVisible', String(data.videoVisible ?? true));
      
      // ✅ FIXED: Backend expects 'image' field
      if (data.imageFile instanceof File) {
        formData.append('image', data.imageFile);
        console.log("📤 Adding image file:", data.imageFile.name);
      } else if (data.image) {
        formData.append('image', data.image);
        console.log("📤 Adding image URL:", data.image);
      }
      
      // ✅ FIXED: Backend expects 'video' field
      if (data.videoFile instanceof File) {
        formData.append('video', data.videoFile);
        console.log("📤 Adding video file:", data.videoFile.name);
      } else if (data.video) {
        formData.append('video', data.video);
        console.log("📤 Adding video URL:", data.video);
      }
      
      console.log("📦 SENDING FORM DATA:");
      for (let pair of formData.entries()) {
        if (pair[1] instanceof File) {
          console.log(`   ${pair[0]}: [FILE] ${pair[1].name}`);
        } else {
          console.log(`   ${pair[0]}: ${pair[1]}`);
        }
      }
      
      await axios.post(url, formData, { 
        headers: getAuthHeaders(true)
      });
      
      await fetchDeepChildCategories(mainCategoryId, childCategoryId, subCategoryId);
    } catch (error) {
      console.error('Failed to add deep child category:', error);
      throw error;
    }
  };

  // ADD SUB DEEP CHILD CATEGORY
// ADD SUB DEEP CHILD CATEGORY - FIXED
const addSubDeepChildCategory = async (data: any) => {
  const {
    mainCategoryId,
    subCategoryId,
    childCategoryId,    // ✅ YEH Display Name hai (Repair/Services/Installation)
    deepChildCategoryId, // ✅ YEH Document ID hai (Deep Category ki ID)
    subDeepKey,
  } = data;
  
  if (!mainCategoryId || !childCategoryId || !deepChildCategoryId || !subDeepKey) {
    console.error('Missing required IDs');
    return;
  }
  
  try {
    // ✅ URL CONSTRUCTION - FIXED
    let url = '';
    if (subCategoryId) {
      // With Sub Category
      url = `${BASE_URL}/main/${mainCategoryId}/sub/${subCategoryId}/child/${encodeURIComponent(childCategoryId)}/deep/${encodeURIComponent(deepChildCategoryId)}/sub/${encodeURIComponent(subDeepKey)}`;
      console.log("🌐 SUB DEEP URL (with sub):", url);
    } else {
      // Without Sub Category - child-key route
      url = `${BASE_URL}/main/${mainCategoryId}/child-key/${encodeURIComponent(childCategoryId)}/deep/${encodeURIComponent(deepChildCategoryId)}/sub/${encodeURIComponent(subDeepKey)}`;
      console.log("🌐 SUB DEEP URL (no sub):", url);
    }
    
    // ✅ BACKEND EXPECTS FormData (upload.any() middleware)
    const formData = new FormData();
    
    // Basic Fields
    formData.append('documentId', subDeepKey);
    formData.append('firstTitle', data.firstTitle || '');
    formData.append('secondTitle', data.secondTitle || '');
    formData.append('description', data.description || '');
    formData.append('subDeepCategoryVisible', String(data.subDeepCategoryVisible ?? true));
    formData.append('visible', String(data.visible ?? data.subDeepCategoryVisible ?? true));
    formData.append('webviewUrl', data.webviewUrl || '');
    
    // Time Fields
    if (data.minTime !== undefined && data.minTime !== null) {
      formData.append('minTime', String(data.minTime));
    }
    if (data.maxTime !== undefined && data.maxTime !== null) {
      formData.append('maxTime', String(data.maxTime));
    }
    formData.append('minTimeVisible', String(data.minTimeVisible ?? true));
    formData.append('maxTimeVisible', String(data.maxTimeVisible ?? true));
    
    // Pricing Fields
    formData.append('originalPrice', String(data.originalPrice || 0));
    formData.append('discountType', data.discountType || 'percentage');
    formData.append('discountValue', String(data.discountValue || 0));
    formData.append('gst', String(data.gst || 0));
    formData.append('gstType', data.gstType || 'inclusive');
    formData.append('priceAfterGst', String(data.priceAfterGst || 0));
    formData.append('currentPrice', String(data.currentPrice || 0));
    formData.append('currentPriceVisible', 'true');
    
    // Visibility Flags
    formData.append('firstTitleVisible', String(data.firstTitleVisible ?? true));
    formData.append('secondTitleVisible', String(data.secondTitleVisible ?? true));
    formData.append('descriptionVisible', String(data.descriptionVisible ?? true));
    formData.append('webviewUrlVisible', String(data.webviewUrlVisible ?? true));
    formData.append('originalPriceVisible', String(data.originalPriceVisible ?? true));
    formData.append('photoVisible', String(data.photoVisible ?? true));
    formData.append('videoVisible', String(data.videoVisible ?? true));
    
    // ✅ IMAGE - File Upload (Priority 1)
    if (data.imageFile instanceof File) {
      formData.append('image', data.imageFile);
      console.log("📤 Adding image file:", data.imageFile.name);
    }
    // ✅ IMAGE - URL (Priority 2)
    else if (data.image) {
      formData.append('image', data.image);
      console.log("📤 Adding image URL:", data.image);
    }
    
    // ✅ VIDEO - File Upload (Priority 1)
    if (data.videoFile instanceof File) {
      formData.append('video', data.videoFile);
      console.log("📤 Adding video file:", data.videoFile.name);
    }
    // ✅ VIDEO - URL (Priority 2)
    else if (data.video) {
      formData.append('video', data.video);
      console.log("📤 Adding video URL:", data.video);
    }
    
    console.log("📦 SENDING SUB DEEP FORM DATA:");
    for (let pair of formData.entries()) {
      if (pair[1] instanceof File) {
        console.log(`   ${pair[0]}: [FILE] ${pair[1].name}`);
      } else {
        console.log(`   ${pair[0]}: ${pair[1]}`);
      }
    }
    
    // ✅ POST with FormData
    await axios.post(url, formData, { 
      headers: getAuthHeaders(true) 
    });
    
    // ✅ Refresh list
    await fetchSubDeepChildCategories(
      mainCategoryId,
      childCategoryId,      // ✅ Display Name
      deepChildCategoryId,  // ✅ Document ID
      subCategoryId
    );
    
  } catch (error) {
    console.error('Failed to add sub deep child category:', error);
    throw error;
  }
};

  // ADD CHILD CATEGORY MEDIA
  const addChildCategoryMedia = async (
    mainId: string,
    type: "images" | "videos" | "links",
    item: any,
    subId?: string
  ) => {
    const url = subId
      ? `/main/${mainId}/sub/${subId}/child-category/media`
      : `/main/${mainId}/child-category/media`;
    
    try {
      if (item.file instanceof File) {
        const createBody = {
          childCatMedia: {
            [type]: {
              [type === 'images' ? 'imageTitle' : 'videoTitle']: 
                type === 'images' ? item.imageTitle : item.videoTitle,
              visibility: item.visibility ?? true,
              url: 'pending',
            },
          },
        };
        
        const createRes = await api.post(url, createBody);
        
        if (createRes.data.success) {
          const currentMedia = createRes.data.data[type];
          const indices = Object.keys(currentMedia)
            .map(Number)
            .filter(n => !isNaN(n));
          const newIndex = Math.max(...indices);
          
          const updateUrl = `${url}/${type}/${newIndex}`;
          const formData = new FormData();
          formData.append('url', item.file);
          formData.append(
            type === 'images' ? 'imageTitle' : 'videoTitle',
            type === 'images' ? item.imageTitle || '' : item.videoTitle || ''
          );
          formData.append('visibility', String(item.visibility ?? true));
          
          await api.put(updateUrl, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
          });
        }
      } else if (item.url) {
        const body = {
          childCatMedia: {
            [type]: type === 'images'
              ? {
                  imageTitle: item.imageTitle || '',
                  url: item.url,
                  visibility: item.visibility ?? true,
                }
              : {
                  videoTitle: item.videoTitle || '',
                  url: item.url,
                  visibility: item.visibility ?? true,
                },
          },
        };
        
        await api.post(url, body);
      }
      
      await fetchChildCategoryMedia(mainId, subId);
    } catch (error) {
      console.error(`Failed to add ${type}:`, error);
      throw error;
    }
  };

  // ==================== UPDATE ====================
  
  // UPDATE MAIN CATEGORY
  const updateMainCategory = async (item: any) => {
    try {
      const formData = new FormData();
      formData.append('name', item.name);
      formData.append('isMainCategoryVisible', String(item.isMainCategoryVisible ?? true));
      formData.append('isMainCategoryNameVisible', String(item.isMainCategoryNameVisible ?? true));
      formData.append('isMainCategoryImageVisible', String(item.isMainCategoryImageVisible ?? true));
      formData.append('hasSubCategory', String(item.hasSubCategory ?? false));
      
      if (item.parentId) {
        formData.append('parentId', item.parentId);
      }
      
      if (item.imageFile instanceof File) {
        formData.append('imageUri', item.imageFile);
      }
      
      await axios.put(`${BASE_URL}/main/${item._id}`, formData, {
        headers: getAuthHeaders(true),
      });
      
      await fetchMainCategories();
    } catch (error) {
      console.error('Failed to update main category:', error);
      throw error;
    }
  };

  // UPDATE SUB CATEGORY
  const updateSubCategory = async (item: any) => {
    try {
      const formData = new FormData();
      formData.append('name', item.name);
      formData.append('mainCategory', item.mainCategoryId);
      formData.append('isSubCategoryVisible', String(item.isSubCategoryVisible ?? true));
      formData.append('isSubCategoryNameVisible', String(item.isSubCategoryNameVisible ?? true));
      formData.append('isSubCategoryImageVisible', String(item.isSubCategoryImageVisible ?? true));
      
      if (item.imageFile instanceof File) {
        formData.append('imageUri', item.imageFile);
      }
      
      await axios.put(
        `${BASE_URL}/main/${item.mainCategoryId}/sub/${item.documentId}`,
        formData,
        { headers: getAuthHeaders(true) }
      );
      
      await fetchSubCategories(item.mainCategoryId);
    } catch (error) {
      console.error('Failed to update sub category:', error);
      throw error;
    }
  };

  // UPDATE CHILD CATEGORY
  const updateChildCategory = async (item: any) => {
    try {
      const formData = new FormData();
      formData.append('name', item.name);
      formData.append('visibility', String(item.visible ?? true));
      
      if (item.imageFile instanceof File) {
        formData.append('imageUri', item.imageFile);
      }
      
      await axios.put(
        `${BASE_URL}/main/${item.mainCategoryId}/child/${item.documentId}`,
        formData,
        { headers: getAuthHeaders(true) }
      );
      
      await fetchChildCategories(item.mainCategoryId, item.subCategoryId);
    } catch (error) {
      console.error('Failed to update child category:', error);
      throw error;
    }
  };

  // UPDATE CHILD CATEGORY WITH SUB
  const updateChildCategoryWithSub = async (item: any) => {
    try {
      const formData = new FormData();
      formData.append('name', item.name);
      formData.append('visibility', String(item.visible ?? true));
      
      if (item.imageFile instanceof File) {
        formData.append('imageUri', item.imageFile);
      }
      
      await axios.put(
        `${BASE_URL}/main/${item.mainCategoryId}/sub/${item.subCategoryId}/child/${item.documentId}`,
        formData,
        { headers: getAuthHeaders(true) }
      );
      
      await fetchChildCategories(item.mainCategoryId, item.subCategoryId);
    } catch (error) {
      console.error('Failed to update child category with sub:', error);
      throw error;
    }
  };

  // ✅ FIXED: UPDATE DEEP CHILD CATEGORY - WITH IMAGE/VIDEO SUPPORT
  const updateDeepChildCategory = async (item: any) => {
    try {
      const formData = new FormData();
      formData.append('documentId', item.documentId);
      formData.append('firstTitle', item.firstTitle || '');
      formData.append('secondTitle', item.secondTitle || '');
      formData.append('description', item.description || '');
      formData.append('deepCategoryVisible', String(item.deepCategoryVisible ?? true));
      formData.append('visible', String(item.visible ?? item.deepCategoryVisible ?? true));
      formData.append('webviewUrl', item.webviewUrl || '');
      
      // Time fields
      if (item.minTime !== undefined && item.minTime !== null) {
        formData.append('minTime', String(item.minTime));
      }
      if (item.maxTime !== undefined && item.maxTime !== null) {
        formData.append('maxTime', String(item.maxTime));
      }
      
      formData.append('minTimeVisible', String(item.minTimeVisible ?? true));
      formData.append('maxTimeVisible', String(item.maxTimeVisible ?? true));
      
      // Pricing
      formData.append('originalPrice', String(item.originalPrice || 0));
      formData.append('discountType', item.discountType || 'percentage');
      formData.append('discountValue', String(item.discountValue || 0));
      formData.append('gst', String(item.gst || 0));
      formData.append('gstType', item.gstType || 'inclusive');
      formData.append('currentPrice', String(item.currentPrice || 0));
      formData.append('priceAfterGst', String(item.priceAfterGst || 0));
      formData.append('currentPriceVisible', 'true');
      
      // Visibility flags
      formData.append('firstTitleVisible', String(item.firstTitleVisible ?? true));
      formData.append('secondTitleVisible', String(item.secondTitleVisible ?? true));
      formData.append('descriptionVisible', String(item.descriptionVisible ?? true));
      formData.append('webviewUrlVisible', String(item.webviewUrlVisible ?? true));
      formData.append('originalPriceVisible', String(item.originalPriceVisible ?? true));
      formData.append('photoVisible', String(item.photoVisible ?? true));
      formData.append('videoVisible', String(item.videoVisible ?? true));
      
      // ✅ FIXED: Backend expects 'image' field
      if (item.imageFile instanceof File) {
        formData.append('image', item.imageFile);
      } else if (item.image) {
        formData.append('image', item.image);
      }
      
      // ✅ FIXED: Backend expects 'video' field
      if (item.videoFile instanceof File) {
        formData.append('video', item.videoFile);
      } else if (item.video) {
        formData.append('video', item.video);
      }
      
      let url = '';
      if (item.subCategoryId) {
        url = `${BASE_URL}/main/${item.mainCategoryId}/sub/${item.subCategoryId}/child/${item.childCategoryId}/deep/${item.documentId}`;
      } else {
        url = `${BASE_URL}/main/${item.mainCategoryId}/child/${item.childCategoryId}/deep/${item.documentId}`;
      }
      
      await axios.put(url, formData, { headers: getAuthHeaders(true) });
      await fetchDeepChildCategories(item.mainCategoryId, item.childCategoryId, item.subCategoryId);
    } catch (error) {
      console.error('Failed to update deep child category:', error);
      throw error;
    }
  };

  // UPDATE DEEP CHILD CATEGORY WITH SUB
  const updateDeepChildCategoryWithSub = async (item: any) => {
    try {
      const formData = new FormData();
      formData.append('documentId', item.documentId);
      formData.append('firstTitle', item.firstTitle || '');
      formData.append('secondTitle', item.secondTitle || '');
      formData.append('description', item.description || '');
      formData.append('deepCategoryVisible', String(item.deepCategoryVisible ?? true));
      
      if (item.imageFile instanceof File) {
        formData.append('imageUri', item.imageFile);
      }
      
      const url = `${BASE_URL}/main/${item.mainCategoryId}/sub/${item.subCategoryId}/child/${item.childCategoryId}/deep/${item.documentId}`;
      
      await axios.put(url, formData, { headers: getAuthHeaders(true) });
      await fetchDeepChildCategories(item.mainCategoryId, item.childCategoryId, item.subCategoryId);
    } catch (error) {
      console.error('Failed to update deep child category with sub:', error);
      throw error;
    }
  };

  // UPDATE SUB DEEP CHILD CATEGORY
// UPDATE SUB DEEP CHILD CATEGORY - FIXED
const updateSubDeepChildCategory = async (item: any) => {
  try {
    // ✅ URL CONSTRUCTION - FIXED
    let url = '';
    if (item.subCategoryId) {
      // With Sub Category
      url = `${BASE_URL}/main/${item.mainCategoryId}/sub/${item.subCategoryId}/child/${encodeURIComponent(item.childCategoryId)}/deep/${encodeURIComponent(item.deepChildCategoryId)}/sub/${encodeURIComponent(item.documentId)}`;
      console.log("🌐 UPDATE SUB DEEP URL (with sub):", url);
    } else {
      // Without Sub Category - child-key route
      url = `${BASE_URL}/main/${item.mainCategoryId}/child-key/${encodeURIComponent(item.childCategoryId)}/deep/${encodeURIComponent(item.deepChildCategoryId)}/sub/${encodeURIComponent(item.documentId)}`;
      console.log("🌐 UPDATE SUB DEEP URL (no sub):", url);
    }
    
    // ✅ FormData for PUT request
    const formData = new FormData();
    
    // Basic Fields
    formData.append('documentId', item.documentId);
    formData.append('firstTitle', item.firstTitle || '');
    formData.append('secondTitle', item.secondTitle || '');
    formData.append('description', item.description || '');
    formData.append('subDeepCategoryVisible', String(item.subDeepCategoryVisible ?? true));
    formData.append('visible', String(item.visible ?? item.subDeepCategoryVisible ?? true));
    formData.append('webviewUrl', item.webviewUrl || '');
    
    // Time fields
    if (item.minTime !== undefined && item.minTime !== null) {
      formData.append('minTime', String(item.minTime));
    }
    if (item.maxTime !== undefined && item.maxTime !== null) {
      formData.append('maxTime', String(item.maxTime));
    }
    formData.append('minTimeVisible', String(item.minTimeVisible ?? true));
    formData.append('maxTimeVisible', String(item.maxTimeVisible ?? true));
    
    // Pricing
    formData.append('originalPrice', String(item.originalPrice || 0));
    formData.append('discountType', item.discountType || 'percentage');
    formData.append('discountValue', String(item.discountValue || 0));
    formData.append('gst', String(item.gst || 0));
    formData.append('gstType', item.gstType || 'inclusive');
    formData.append('priceAfterGst', String(item.priceAfterGst || 0));
    formData.append('currentPrice', String(item.currentPrice || 0));
    formData.append('currentPriceVisible', 'true');
    
    // Visibility flags
    formData.append('firstTitleVisible', String(item.firstTitleVisible ?? true));
    formData.append('secondTitleVisible', String(item.secondTitleVisible ?? true));
    formData.append('descriptionVisible', String(item.descriptionVisible ?? true));
    formData.append('webviewUrlVisible', String(item.webviewUrlVisible ?? true));
    formData.append('originalPriceVisible', String(item.originalPriceVisible ?? true));
    formData.append('photoVisible', String(item.photoVisible ?? true));
    formData.append('videoVisible', String(item.videoVisible ?? true));
    
    // ✅ IMAGE - File Upload (Priority 1)
    if (item.imageFile instanceof File) {
      formData.append('image', item.imageFile);
    }
    // ✅ IMAGE - URL (Priority 2)
    else if (item.image) {
      formData.append('image', item.image);
    }
    
    // ✅ VIDEO - File Upload (Priority 1)
    if (item.videoFile instanceof File) {
      formData.append('video', item.videoFile);
    }
    // ✅ VIDEO - URL (Priority 2)
    else if (item.video) {
      formData.append('video', item.video);
    }
    
    console.log("📦 UPDATING SUB DEEP CATEGORY:", url);
    
    // ✅ PUT with FormData
    await axios.put(url, formData, { 
      headers: getAuthHeaders(true) 
    });
    
    // ✅ Refresh list
    await fetchSubDeepChildCategories(
      item.mainCategoryId,
      item.childCategoryId,      // ✅ Display Name
      item.deepChildCategoryId,  // ✅ Document ID
      item.subCategoryId
    );
    
  } catch (error) {
    console.error('Failed to update sub deep child category:', error);
    throw error;
  }
};

  // UPDATE CHILD CATEGORY MEDIA BY INDEX
  const updateChildCategoryMediaByIndex = async (
    mainId: string,
    type: "images" | "videos" | "links",
    index: number | string,
    payload: any,
    subId?: string
  ) => {
    try {
      const url = subId
        ? `/main/${mainId}/sub/${subId}/child-category/media/${type}/${index}`
        : `/main/${mainId}/child-category/media/${type}/${index}`;
      
      await api.put(url, {
        ...payload,
        visibility: payload.visibility,
        visible: payload.visibility,
      });
    } catch (error) {
      console.error(`Failed to update ${type} media:`, error);
      throw error;
    }
  };

  // UPDATE CHILD CATEGORY MEDIA GROUP
  const updateChildCategoryMediaGroup = async (
    mainId: string,
    type: "images" | "videos" | "links",
    payload: any,
    subId?: string
  ) => {
    try {
      const url = subId
        ? `/main/${mainId}/sub/${subId}/child-category/media`
        : `/main/${mainId}/child-category/media`;
      
      const body = {
        childCatMedia: {
          [type]: {
            name: payload.name,
            visibility: payload.visibility,
            visible: payload.visibility,
          },
        },
      };
      
      await api.put(url, body);
    } catch (error: any) {
      if (error.response?.status !== 404) {
        console.error(`Failed to update ${type} group:`, error);
        throw error;
      }
    }
  };

  // ==================== DELETE ====================
  
  // DELETE MAIN CATEGORY
  const deleteMainCategory = async (id: string) => {
    try {
      await api.delete(`/main/${id}`);
      setMainCategories(prev => prev.filter(cat => cat._id !== id));
    } catch (error) {
      console.error('Failed to delete main category:', error);
      throw error;
    }
  };

  // DELETE SUB CATEGORY
  const deleteSubCategory = async (id: string) => {
    try {
      const sub = subCategories.find(s => s.documentId === id);
      if (!sub) return;
      
      await api.delete(`/main/${sub.mainCategoryId}/sub/${id}`);
      setSubCategories(prev => prev.filter(cat => cat.documentId !== id));
    } catch (error) {
      console.error('Failed to delete sub category:', error);
      throw error;
    }
  };

  // DELETE CHILD CATEGORY
  const deleteChildCategory = async (id: string) => {
    try {
      const child = childCategories.find(c => c.documentId === id);
      if (!child) return;
      
      const { mainCategoryId, subCategoryId } = child;
      
      if (subCategoryId) {
        await api.delete(`/main/${mainCategoryId}/sub/${subCategoryId}/child/${id}`);
      } else {
        await api.delete(`/main/${mainCategoryId}/child/${id}`);
      }
      
      setChildCategories(prev => prev.filter(cat => cat.documentId !== id));
    } catch (error) {
      console.error('Failed to delete child category:', error);
      throw error;
    }
  };

  // DELETE DEEP CHILD CATEGORY
  const deleteDeepChildCategory = async (id: string) => {
    try {
      const deep = deepChildCategories.find(d => d.id === id || d.documentId === id);
      if (!deep) return;
      
      const { mainCategoryId, subCategoryId, childCategoryId } = deep;
      
      if (subCategoryId) {
        await api.delete(`/main/${mainCategoryId}/sub/${subCategoryId}/child/${childCategoryId}/deep/${id}`);
      } else {
        await api.delete(`/main/${mainCategoryId}/child/${childCategoryId}/deep/${id}`);
      }
      
      setDeepChildCategories(prev => prev.filter(cat => cat.id !== id && cat.documentId !== id));
    } catch (error) {
      console.error('Failed to delete deep child category:', error);
      throw error;
    }
  };

  // DELETE SUB DEEP CHILD CATEGORY
  const deleteSubDeepChildCategory = async (id: string) => {
    try {
      const subDeep = subDeepChildCategories.find(s => 
        s.id === id || s.subDeepKey === id || s.documentId === id
      );
      if (!subDeep) return;
      
      const { mainCategoryId, subCategoryId, childCategoryId, deepChildCategoryId } = subDeep;
      
      if (subCategoryId) {
        await api.delete(`/main/${mainCategoryId}/sub/${subCategoryId}/child/${childCategoryId}/deep/${deepChildCategoryId}/sub/${id}`);
      } else {
        await api.delete(`/main/${mainCategoryId}/child/${childCategoryId}/deep/${deepChildCategoryId}/sub/${id}`);
      }
      
      setSubDeepChildCategories(prev => prev.filter(cat => 
        cat.id !== id && cat.subDeepKey !== id && cat.documentId !== id
      ));
    } catch (error) {
      console.error('Failed to delete sub deep child category:', error);
      throw error;
    }
  };

  // DELETE CHILD CATEGORY MEDIA BY INDEX
  const deleteChildCategoryMediaByIndex = async (
    mainId: string,
    type: "images" | "videos" | "links",
    index: number | string,
    subId?: string
  ) => {
    try {
      const url = subId
        ? `/main/${mainId}/sub/${subId}/child-category/media/${type}/${index}`
        : `/main/${mainId}/child-category/media/${type}/${index}`;
      
      await api.delete(url);
      await fetchChildCategoryMedia(mainId, subId);
    } catch (error) {
      console.error(`Failed to delete ${type} media:`, error);
      throw error;
    }
  };

  // DELETE CHILD CATEGORY V2
  const deleteChildCategoryV2 = async (mainId: string, key: string, subId?: string) => {
    try {
      const url = subId
        ? `/main/${mainId}/sub/${subId}/child-category/media`
        : `/main/${mainId}/child-category/media`;
      
      await api.delete(url);
      
      setChildCategoriesV2(prev => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    } catch (error) {
      console.error('Failed to delete child category V2:', error);
      throw error;
    }
  };

  // ==================== TOGGLE ====================
  
  // TOGGLE MAIN VISIBILITY
  const toggleMainVisibility = async (id: string) => {
    const cat = mainCategories.find(c => c._id === id);
    if (!cat) return;
    
    const newVal = !cat.isMainCategoryVisible;
    
    setMainCategories(prev =>
      prev.map(c => c._id === id ? { ...c, isMainCategoryVisible: newVal } : c)
    );
    
    try {
      await axios.put(
        `${BASE_URL}/main/${id}`,
        { isMainCategoryVisible: newVal },
        { headers: getAuthHeaders() }
      );
    } catch (error) {
      setMainCategories(prev => prev.map(c => c._id === id ? cat : c));
      console.error('Failed to toggle main visibility:', error);
    }
  };

  // TOGGLE MAIN NAME VISIBILITY
  const toggleMainNameVisibility = async (id: string) => {
    const cat = mainCategories.find(c => c._id === id);
    if (!cat) return;
    
    const newVal = !cat.isMainCategoryNameVisible;
    
    setMainCategories(prev =>
      prev.map(c => c._id === id ? { ...c, isMainCategoryNameVisible: newVal } : c)
    );
    
    try {
      await axios.put(
        `${BASE_URL}/main/${id}`,
        { isMainCategoryNameVisible: newVal },
        { headers: getAuthHeaders() }
      );
    } catch (error) {
      setMainCategories(prev => prev.map(c => c._id === id ? cat : c));
      console.error('Failed to toggle main name visibility:', error);
    }
  };

  // TOGGLE MAIN IMAGE VISIBILITY
  const toggleMainImageVisibility = async (id: string) => {
    const cat = mainCategories.find(c => c._id === id);
    if (!cat) return;
    
    const newVal = !cat.isMainCategoryImageVisible;
    
    setMainCategories(prev =>
      prev.map(c => c._id === id ? { ...c, isMainCategoryImageVisible: newVal } : c)
    );
    
    try {
      await axios.put(
        `${BASE_URL}/main/${id}`,
        { isMainCategoryImageVisible: newVal },
        { headers: getAuthHeaders() }
      );
    } catch (error) {
      setMainCategories(prev => prev.map(c => c._id === id ? cat : c));
      console.error('Failed to toggle main image visibility:', error);
    }
  };

  // TOGGLE MAIN IS SUB
  const toggleMainIsSub = async (id: string) => {
    const cat = mainCategories.find(c => c._id === id);
    if (!cat) return;
    
    const newVal = !cat.hasSubCategory;
    
    setMainCategories(prev =>
      prev.map(c => c._id === id ? { ...c, hasSubCategory: newVal } : c)
    );
    
    try {
      await axios.put(
        `${BASE_URL}/main/${id}`,
        { hasSubCategory: newVal },
        { headers: getAuthHeaders() }
      );
    } catch (error) {
      setMainCategories(prev => prev.map(c => c._id === id ? cat : c));
      console.error('Failed to toggle main hasSubCategory:', error);
    }
  };

  // TOGGLE SUB VISIBILITY
  const toggleSubVisibility = async (id: string) => {
    const cat = subCategories.find(c => c.documentId === id);
    if (!cat) return;
    
    const newVal = !cat.isSubCategoryVisible;
    
    setSubCategories(prev =>
      prev.map(c => c.documentId === id ? { ...c, isSubCategoryVisible: newVal, visible: newVal } : c)
    );
    
    try {
      await axios.put(
        `${BASE_URL}/main/${cat.mainCategoryId}/sub/${id}`,
        {
          isSubCategoryVisible: newVal,
          visible: newVal,
        },
        { headers: getAuthHeaders() }
      );
    } catch (error) {
      setSubCategories(prev => prev.map(c => c.documentId === id ? cat : c));
      console.error('Failed to toggle sub visibility:', error);
    }
  };

  // TOGGLE SUB NAME VISIBILITY
  const toggleSubNameVisibility = async (id: string) => {
    const cat = subCategories.find(c => c.documentId === id);
    if (!cat) return;
    
    const newVal = !cat.isSubCategoryNameVisible;
    
    setSubCategories(prev =>
      prev.map(c => c.documentId === id ? { ...c, isSubCategoryNameVisible: newVal } : c)
    );
    
    try {
      await axios.put(
        `${BASE_URL}/main/${cat.mainCategoryId}/sub/${id}`,
        { isSubCategoryNameVisible: newVal },
        { headers: getAuthHeaders() }
      );
    } catch (error) {
      setSubCategories(prev => prev.map(c => c.documentId === id ? cat : c));
      console.error('Failed to toggle sub name visibility:', error);
    }
  };

  // TOGGLE SUB IMAGE VISIBILITY
  const toggleSubImageVisibility = async (id: string) => {
    const cat = subCategories.find(c => c.documentId === id);
    if (!cat) return;
    
    const newVal = !cat.isSubCategoryImageVisible;
    
    setSubCategories(prev =>
      prev.map(c => c.documentId === id ? { ...c, isSubCategoryImageVisible: newVal } : c)
    );
    
    try {
      await axios.put(
        `${BASE_URL}/main/${cat.mainCategoryId}/sub/${id}`,
        { isSubCategoryImageVisible: newVal },
        { headers: getAuthHeaders() }
      );
    } catch (error) {
      setSubCategories(prev => prev.map(c => c.documentId === id ? cat : c));
      console.error('Failed to toggle sub image visibility:', error);
    }
  };

  // TOGGLE SUB HAS SUB CATEGORY
  const toggleSubHasSubCategory = async (id: string) => {
    const cat = subCategories.find(c => c.documentId === id);
    if (!cat) return;
    
    const newVal = !cat.hasSubCategory;
    
    setSubCategories(prev =>
      prev.map(c => c.documentId === id ? { ...c, hasSubCategory: newVal } : c)
    );
    
    try {
      await axios.put(
        `${BASE_URL}/main/${cat.mainCategoryId}/sub/${id}`,
        { hasSubCategory: newVal },
        { headers: getAuthHeaders() }
      );
    } catch (error) {
      setSubCategories(prev => prev.map(c => c.documentId === id ? cat : c));
      console.error('Failed to toggle sub hasSubCategory:', error);
    }
  };

  // TOGGLE CHILD VISIBILITY
  const toggleChildVisibility = async (id: string) => {
    const cat = childCategories.find(c => c.documentId === id);
    if (!cat) return;
    
    const currentVisibility = cat.visible ?? cat.isChildCategoryVisible ?? true;
    const newVal = !currentVisibility;
    
    setChildCategories(prev =>
      prev.map(c => c.documentId === id ? { ...c, visible: newVal, isChildCategoryVisible: newVal } : c)
    );
    
    try {
      let url = '';
      if (cat.subCategoryId) {
        url = `${BASE_URL}/main/${cat.mainCategoryId}/sub/${cat.subCategoryId}/child/${id}`;
      } else {
        url = `${BASE_URL}/main/${cat.mainCategoryId}/child/${id}`;
      }
      
      await axios.put(
        url,
        { visibility: newVal },
        { headers: getAuthHeaders() }
      );
    } catch (error) {
      setChildCategories(prev => prev.map(c => c.documentId === id ? cat : c));
      console.error('Failed to toggle child visibility:', error);
    }
  };

  // TOGGLE DEEP CHILD VISIBILITY
  const toggleDeepChildVisibility = async (id: string, field: string = 'visible') => {
    const cat = deepChildCategories.find(c => c.id === id || c.documentId === id);
    if (!cat) return;
    
    let backendField = field;
    if (field === 'childCatVideosVisible') backendField = 'videoVisible';
    if (field === 'visible') backendField = 'deepCategoryVisible';
    
    const currentVal = (cat as any)[backendField] ?? (cat as any)[field] ?? true;
    const newVal = !currentVal;
    
    const updated = {
      ...cat,
      [field]: newVal,
      [backendField]: newVal,
    };
    
    if (backendField === 'deepCategoryVisible') {
      updated.visible = newVal;
      updated.deepCategoryVisible = newVal;
    }
    if (backendField === 'videoVisible') {
      updated.childCatVideosVisible = newVal;
      updated.videoVisible = newVal;
    }
    
    setDeepChildCategories(prev =>
      prev.map(c => (c.id === id || c.documentId === id) ? updated : c)
    );
    
    try {
      const payload: any = { [backendField]: newVal };
      
      if (backendField === 'deepCategoryVisible') {
        payload.visible = newVal;
      }
      if (backendField === 'videoVisible') {
        payload.childCatVideosVisible = newVal;
      }
      
      let url = '';
      if (cat.subCategoryId) {
        url = `${BASE_URL}/main/${cat.mainCategoryId}/sub/${cat.subCategoryId}/child/${cat.childCategoryId}/deep/${id}`;
      } else {
        url = `${BASE_URL}/main/${cat.mainCategoryId}/child/${cat.childCategoryId}/deep/${id}`;
      }
      
      await axios.put(url, payload, { headers: getAuthHeaders() });
    } catch (error) {
      setDeepChildCategories(prev =>
        prev.map(c => (c.id === id || c.documentId === id) ? cat : c)
      );
      console.error('Failed to toggle deep child visibility:', error);
    }
  };

  // TOGGLE SUB DEEP CHILD VISIBILITY
  const toggleSubDeepChildVisibility = async (id: string, field: string = 'visible') => {
    const cat = subDeepChildCategories.find(c => 
      c.id === id || c.subDeepKey === id || c.documentId === id
    );
    if (!cat) return;
    
    let backendField = field;
    if (field === 'childCatVideosVisible') backendField = 'videoVisible';
    if (field === 'visible') backendField = 'subDeepCategoryVisible';
    
    const currentVal = (cat as any)[backendField] ?? (cat as any)[field] ?? true;
    const newVal = !currentVal;
    
    const updated = {
      ...cat,
      [field]: newVal,
      [backendField]: newVal,
    };
    
    if (backendField === 'subDeepCategoryVisible') {
      updated.visible = newVal;
      updated.subDeepCategoryVisible = newVal;
    }
    if (backendField === 'videoVisible') {
      updated.childCatVideosVisible = newVal;
      updated.videoVisible = newVal;
    }
    
    setSubDeepChildCategories(prev =>
      prev.map(c => (c.id === id || c.subDeepKey === id || c.documentId === id) ? updated : c)
    );
    
    try {
      let url = '';
      if (cat.subCategoryId) {
        url = `${BASE_URL}/main/${cat.mainCategoryId}/sub/${cat.subCategoryId}/child/${encodeURIComponent(cat.childCategoryId)}/deep/${encodeURIComponent(cat.deepChildCategoryId)}/sub/${encodeURIComponent(id)}`;
      } else {
        url = `${BASE_URL}/main/${cat.mainCategoryId}/child-key/${encodeURIComponent(cat.childCategoryId)}/deep/${encodeURIComponent(cat.deepChildCategoryId)}/sub/${encodeURIComponent(id)}`;
      }
      
      const payload = {
        [backendField]: newVal,
      };
      
      if (backendField === 'subDeepCategoryVisible') {
        payload['visible'] = newVal;
      }
      if (backendField === 'videoVisible') {
        payload['childCatVideosVisible'] = newVal;
      }
      
      await axios.put(url, payload, { headers: getAuthHeaders() });
    } catch (error) {
      setSubDeepChildCategories(prev =>
        prev.map(c => (c.id === id || c.subDeepKey === id || c.documentId === id) ? cat : c)
      );
      console.error('Failed to toggle sub deep child visibility:', error);
    }
  };

  // ==================== INITIAL FETCH ====================
  useEffect(() => {
    fetchMainCategories();
  }, []);

  return (
    <CategoryContext.Provider
      value={{
        // Data
        mainCategories,
        subCategories,
        childCategories,
        deepChildCategories,
        subDeepChildCategories,
        childCategoriesV2,
        isLoadingSubDeep,
        
        // Fetch
        fetchMainCategories,
        fetchSubCategories,
        fetchChildCategories,
        fetchDeepChildCategories,
        fetchSubDeepChildCategories,
        fetchChildCategoryMedia,
        
        // Add
        addMainCategory,
        addSubCategory,
        addChildCategory,
        addDeepChildCategory,
        addSubDeepChildCategory,
        addChildCategoryMedia,
        
        // Update
        updateMainCategory,
        updateSubCategory,
        updateChildCategory,
        updateChildCategoryWithSub,
        updateDeepChildCategory,
        updateDeepChildCategoryWithSub,
        updateSubDeepChildCategory,
        updateChildCategoryMediaByIndex,
        updateChildCategoryMediaGroup,
        
        // Delete
        deleteMainCategory,
        deleteSubCategory,
        deleteChildCategory,
        deleteDeepChildCategory,
        deleteSubDeepChildCategory,
        deleteChildCategoryMediaByIndex,
        deleteChildCategoryV2,
        
        // Toggle
        toggleMainVisibility,
        toggleMainNameVisibility,
        toggleMainImageVisibility,
        toggleMainIsSub,
        toggleSubVisibility,
        toggleSubNameVisibility,
        toggleSubImageVisibility,
        toggleSubHasSubCategory,
        toggleChildVisibility,
        toggleDeepChildVisibility,
        toggleSubDeepChildVisibility,
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