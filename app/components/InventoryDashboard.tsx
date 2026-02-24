"use client";

import React, { useState, useEffect } from "react";

import { Trash2, Edit, Plus, GripVertical, Check, X, ChevronDown, ChevronRight, Search, ArrowLeft, MoreVertical, Eye, EyeOff, Box, ArrowRight } from "lucide-react";
import MainCategoryForm from "./forms/MainCategoryForm";
import SubCategoryForm from "./forms/SubCategoryForm";
import ChildCategoryForm from "./forms/ChildCategoryForm";
import DeepChildCategoryForm from "./forms/DeepChildCategoryForm";
import SubDeepChildCategoryForm from "./forms/SubDeepChildCategoryForm";
import { useRouter } from "next/navigation";


import { useCategory, CategoryProvider } from "../context/CategoryContext";
import CategoryList from "./CategoryList";
import { useTheme } from "../context/ThemeContext";



const sanitizeUrl = (url?: string) => {
    if (!url) return "";
    return url.trim();
};



const InventoryDashboard = () => {
    const InventoryDashboard = () => {

const [mainCategories, setMainCategories] = useState<any[]>([]);
const [searchTerm, setSearchTerm] = useState("");

// Filter
const filteredMainCategories = mainCategories
  .filter((item) => {
    if (!searchTerm) return true;

    return item.firstTitle
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());
  })
  .sort((a, b) => {
    if (!searchTerm) return 0;

    const term = searchTerm.toLowerCase();

    const aStarts = a.firstTitle?.toLowerCase().startsWith(term);
    const bStarts = b.firstTitle?.toLowerCase().startsWith(term);

    if (aStarts && !bStarts) return -1;
    if (!aStarts && bStarts) return 1;

    return 0;
  });

return (
  <div>
    {filteredMainCategories.map((item) => (
      <div key={item.documentId}>
        {item.firstTitle}
      </div>
    ))}
  </div>
);


    }
     const router = useRouter(); 
    const [activeForm, setActiveForm] = useState<string | null>(null);
    const [activeView, setActiveView] = useState<string | null>(null); // 'mainList', 'subList', 'childList'
    const [isProductListingSelected, setIsProductListingSelected] = useState(false);
    const [isSparePartSelected, setIsSparePartSelected] = useState(false);

    const [searchTerm, setSearchTerm] = useState("");
    const { theme } = useTheme();
    const isDark = theme === "dark";

    // Navigation State
    const [selectedMainCategoryId, setSelectedMainCategoryId] = useState<string | null>(null);
    const [selectedMainCategoryName, setSelectedMainCategoryName] = useState<string | null>(null);

    const [selectedSubCategoryId, setSelectedSubCategoryId] = useState<string | null>(null);
    const [selectedSubCategoryName, setSelectedSubCategoryName] = useState<string | null>(null);

    const [selectedChildCategoryId, setSelectedChildCategoryId] = useState<string | null>(null);
    const [selectedChildCategoryName, setSelectedChildCategoryName] = useState<string | null>(null);

    const [selectedDeepChildCategoryId, setSelectedDeepChildCategoryId] = useState<string | null>(null);
    const [selectedDeepChildCategoryName, setSelectedDeepChildCategoryName] = useState<string | null>(null);

    // ✅ DEEP CATEGORY (Parent) - JO URL ME deepKey BANEGA
const [selectedDeepCategoryId, setSelectedDeepCategoryId] = useState<string | null>(null);
const [selectedDeepCategoryName, setSelectedDeepCategoryName] = useState<string | null>(null);

// ✅ DEEP CHILD CATEGORY (Child) - JO LIST ME DIKHTA HAI

    const [editingMainCategory, setEditingMainCategory] = useState<any | null>(null);
    const [editingSubCategory, setEditingSubCategory] = useState<any | null>(null);
    const [editingChildCategory, setEditingChildCategory] = useState<any | null>(null);
    const [editingDeepChildCategory, setEditingDeepChildCategory] = useState<any | null>(null);
    const [editingSubDeepChildCategory, setEditingSubDeepChildCategory] = useState<any | null>(null);

    const [showAddMissingModal, setShowAddMissingModal] = useState(false);
    const [showVideoModal, setShowVideoModal] = useState(false);
    const REQUIRED_SERVICES = ["Installation", "Repair", "Services", "childCatVideos"];

    // image modal
const [imageUrlInput, setImageUrlInput] = useState("");



    // Mock Video State (Should eventually be in context or fetched)
    const [videos, setVideos] = useState<PendingVideo[]>([]);

    // ✅ PENDING VIDEO UPLOAD STATE
    interface PendingVideo {
        id: string;
        videoTitle?: string;
        imageTitle?: string;
        linkTitle?: string;
        file: File | null;
        title: string;
        visible: boolean;
        url?: string;
        previewUrl?: string;
        thumbnail?: File | null;
        thumbnailUrl?: string;
        dbIndex?: number | string;
    }
    const [pendingVideos, setPendingVideos] = useState<PendingVideo[]>([]);
    const [pendingImages, setPendingImages] = useState<PendingVideo[]>([]); // Reusing PendingVideo interface as it's just ID/File/Title/Visible

    // ✅ NEW: Video Group Title State
    const [videoGroupTitle, setVideoGroupTitle] = useState("");
    const [videoGroupTitleVisible, setVideoGroupTitleVisible] = useState(true);

    // ✅ NEW: Image Group Title State
    const [imageGroupTitle, setImageGroupTitle] = useState("");
    const [imageGroupTitleVisible, setImageGroupTitleVisible] = useState(true);

    // ✅ NEW: Link Group Title State
    const [linkGroupTitle, setLinkGroupTitle] = useState("");
    const [linkGroupTitleVisible, setLinkGroupTitleVisible] = useState(true);
    const [newLinkVisible, setNewLinkVisible] = useState(true); // For the Add Link modal

    // ✅ Video Preview State
    const [previewVideoUrl, setPreviewVideoUrl] = useState<string | null>(null);
    const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null); // ✅ Image Preview State

    // ✅ Updated Images State to store full object
    const [images, setImages] = useState<PendingVideo[]>([]);
    const [links, setLinks] = useState<PendingVideo[]>([]);
    const [videoLinkInput, setVideoLinkInput] = useState("");
    const [playingVideoUrl, setPlayingVideoUrl] = useState<string | null>(null); // ✅ NEW: Inline Playback State
    const [deleteMediaInfo, setDeleteMediaInfo] = useState<{ type: "images" | "videos" | "links", index: number, dbIndex?: string | number, title: string } | null>(null);
    const [isDeletingMedia, setIsDeletingMedia] = useState(false);

    // ✅ Smart Video Select: Merges with thumbnail-only entries if available
    const handleVideoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files);

            setPendingVideos(prev => {
                const newPending = [...prev];
                const availableThumbnailIndices = newPending
                    .map((v, i) => (!v.file && !v.url ? i : -1))
                    .filter(i => i !== -1);

                let usedIndices = 0;

                newFiles.forEach((file) => {
                    const previewUrl = URL.createObjectURL(file);

                    if (usedIndices < availableThumbnailIndices.length) {
                        // Merge with existing thumbnail-only entry
                        const index = availableThumbnailIndices[usedIndices];
                        newPending[index] = {
                            ...newPending[index],
                            file,
                            previewUrl,
                            // Keep existing title if it's not default/empty, else use filename
                            title: newPending[index].title || file.name.replace(/\.[^/.]+$/, "")
                        };
                        usedIndices++;
                    } else {
                        // Create new entry
                        newPending.push({
                            id: Math.random().toString(36).substr(2, 9),
                            file,
                            title: file.name.replace(/\.[^/.]+$/, ""),
                            visible: false, // ✅ Default to false for new upload
                            previewUrl
                        });
                    }
                });
                return newPending;
            });
            // Reset input
            e.target.value = "";
        }
    };


    // ✅ DELETE YEH WALA DUPLICATE CODE - YE PURANA HAI
/*
const handleDeepChildCategoryClick = (item: any) => {
  // ✅ YEH DEEP CHILD CATEGORY HAI (Child) - jo list me dikh raha hai
  const deepChildId = item.documentId || item.id || item._id;
  
  setSelectedDeepChildCategoryId(deepChildId);
  setSelectedDeepChildCategoryName(item.firstTitle || item.name || "Deep Child Category");

  // ✅ IMPORTANT - YEHI DEEP CATEGORY ID URL ME deepKey BANEGA
  if (!selectedDeepCategoryId) {
    console.error("❌ No Deep Category selected!");
    alert("Please select a Deep Category first");
    return;
  }

  if (selectedMainCategoryId && selectedChildCategoryId) {
    console.log("🔍 FETCHING SUB DEEP FOR:", {
      mainId: selectedMainCategoryId,
      childKey: selectedChildCategoryName, // "Repair"
      deepKey: selectedDeepCategoryId,     // ✅ YEH DEEP CATEGORY ID HAI (Parent)
      subId: selectedSubCategoryId
    });

    // ✅ Correct order: mainId, childKey, deepKey (Parent ID), subId
    fetchSubDeepChildCategories(
      selectedMainCategoryId,
      selectedChildCategoryName!,  // Display Name (Repair)
      selectedDeepCategoryId!,     // ✅ DEEP CATEGORY ID (Parent) - IMPORTANT!
      selectedSubCategoryId
    );
  }
  setActiveView('subDeepList');
};
*/

// ✅ YEHI RAKHO - SIRF EK FUNCTION
// ✅ DEEP CATEGORY CLICK - YEH SUB DEEP FETCH KAREGA

// ✅ DEEP CATEGORY CLICK - YEH SUB DEEP FETCH KAREGA
const handleDeepCategoryClick = (item: any) => {
    // ✅ YEH DEEP CATEGORY HAI (Parent) - jo Installation/Repair ke under hai
    const deepCategoryId = item.documentId || item.id || item._id;
    
    setSelectedDeepCategoryId(deepCategoryId);
    setSelectedDeepCategoryName(item.firstTitle || item.name || "Deep Category");
    
    console.log("🎯 DEEP CATEGORY SELECTED:", {
        id: deepCategoryId,
        name: item.firstTitle || item.name,
        firstTitle: item.firstTitle
    });

    // ✅ IMPORTANT - SUB DEEP FETCH YAHI SE KARO!
    if (selectedMainCategoryId && selectedChildCategoryName) {
        console.log("🔍 FETCHING SUB DEEP FROM DEEP CATEGORY CLICK:", {
            mainId: selectedMainCategoryId,
            childKey: selectedChildCategoryName,
            deepKey: deepCategoryId,
            subId: selectedSubCategoryId
        });

        fetchSubDeepChildCategories(
            selectedMainCategoryId,
            selectedChildCategoryName!,
            deepCategoryId!,
            selectedSubCategoryId
        );
    }
    
    // ✅ VIEW CHANGE KARO - PEHLE VIEW CHANGE, PHIR FETCH
    setActiveView('subDeepList');
    
    // ✅ FORCE RE-RENDER KE LIYE THODA DELAY
    setTimeout(() => {
        console.log("🔄 SubDeep Categories after fetch:", subDeepChildCategories);
    }, 500);
};
// ✅ DEEP CHILD CATEGORY CLICK - YEH AB USE NAHI HOGA (YA FUTURE USE)
const handleDeepChildCategoryClick = (item: any) => {
  // Future use - agar Deep Child Category ke under kuch ho
  console.log("Deep Child Category Clicked:", item);
};

// ✅ DEEP CHILD CATEGORY CLICK - YEH SUB DEEP FETCH KAREGA


    // ✅ Smart Thumbnail Select: Merges with video-only entries if available
    const handleVideoThumbnailSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files);

            setPendingVideos(prev => {
                const newPending = [...prev];
                const availableVideoIndices = newPending
                    .map((v, i) => (!v.thumbnail && !v.thumbnailUrl ? i : -1))
                    .filter(i => i !== -1);

                let usedIndices = 0;

                newFiles.forEach((file) => {
                    const thumbnailUrl = URL.createObjectURL(file);

                    if (usedIndices < availableVideoIndices.length) {
                        // Merge with existing video-only entry
                        const index = availableVideoIndices[usedIndices];
                        newPending[index] = {
                            ...newPending[index],
                            thumbnail: file,
                            thumbnailUrl
                        };
                        usedIndices++;
                    } else {
                        // Create new entry
                        newPending.push({
                            id: Math.random().toString(36).substr(2, 9),
                            file: null,
                            thumbnail: file,
                            thumbnailUrl,
                            title: file.name.replace(/\.[^/.]+$/, ""),
                            visible: false // ✅ Default to false for new upload
                        });
                    }
                });
                return newPending;
            });
            // Reset input
            e.target.value = "";
        }
    };

    // ✅ Image Select for "Add Image" Modal
    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files);
            const newPending: PendingVideo[] = newFiles.map(file => ({
                id: Math.random().toString(36).substr(2, 9),
                file,
                title: file.name.replace(/\.[^/.]+$/, ""),
                visible: false, // ✅ Default to false for new upload
                previewUrl: URL.createObjectURL(file) // ✅ Generate preview
            }));
            setPendingImages(prev => [...prev, ...newPending]);
            e.target.value = "";
        }
    };

    const removePendingImage = (id: string) => {
        setPendingImages(prev => prev.filter(img => img.id !== id));
    };

    const removePendingVideo = (id: string) => {
        setPendingVideos(prev => prev.filter(v => v.id !== id));
    };

    const updatePendingVideo = (id: string, field: 'title' | 'visible' | 'url', value: any) => {
        setPendingVideos(prev => prev.map(v =>
            v.id === id ? { ...v, [field]: value } : v
        ));
    };

    const [targetCategoryName, setTargetCategoryName] = useState("");
    const [isManualCategoryInput, setIsManualCategoryInput] = useState(false);

    const handleVideoSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedMainCategoryId) {
            alert("Main Category missing");
            return;
        }

        // Gather all videos to process
        let finalVideosToProcess = [...pendingVideos];

        // ✅ AUTO-ADD: If there's a link in the input box but not yet added to list, add it now
        if (videoLinkInput.trim()) {
            const newId = Math.random().toString(36).substr(2, 9);
            finalVideosToProcess.push({
                id: newId,
                file: null,
                title: "Video Link",
                visible: false, // ✅ Default to false
                url: videoLinkInput.trim(),
                previewUrl: videoLinkInput.trim()
            });
            setVideoLinkInput(""); // Clear the input
        }

        if (finalVideosToProcess.length === 0) {
            alert("Please select a video file or add a video link first.");
            return;
        }

        console.log("🚀 SUBMITTING VIDEOS. Total Count:", finalVideosToProcess.length);

        try {
            for (const vid of finalVideosToProcess) {
                // If it's a file, we send the file. If it's a URL (like YouTube), we send the url string.
                if (!vid.url && !vid.file) continue;

                console.log("📤 Sending Video:", vid.title || "Untitled Video");

                await addChildCategoryMedia(
                    selectedMainCategoryId,
                    "videos",
                    {
                        videoTitle: videoGroupTitle.trim() || vid.title || "Untitled Video",
                        url: vid.file ? undefined : vid.url, // Don't send local blob URL if it's a file
                        file: vid.file || undefined,
                        visibility: vid.visible ?? false // ✅ Default to false
                    },
                    selectedSubCategoryId || undefined
                );
            }

            // Refresh UI using centralized fetcher
            await fetchCurrentMedia();

            alert("✅ Videos added successfully!");
            setPendingVideos([]);
            setVideoGroupTitle(""); // ✅ Clear section title
            setShowVideoModal(false);
        } catch (err) {
            console.error("❌ Video submission failed:", err);
            alert("❌ Video save failed.");
        }
    };



    // ✅ IMAGE HANDLERS


    // ✅ Reusable Toggle for Modals
    const OrangeToggle = ({ checked, onChange }: { checked: boolean; onChange?: () => void }) => (
        <label className="relative inline-flex cursor-pointer items-center">
            <input type="checkbox" checked={checked} onChange={onChange} className="peer sr-only" />
            <div className="h-6 w-10 rounded-full bg-gray-300 after:absolute after:left-1 after:top-1 after:h-4 after:w-4 after:rounded-full after:bg-gray-500 after:transition-all peer-checked:bg-[#FCD3BC] peer-checked:after:bg-[#E88F46] peer-checked:after:translate-x-4" />
        </label>
    );

    const toggleForm = (formName: string) => {
        if (activeForm === formName) {
            // Closing form
            const currentView = activeView;
            setActiveForm(null);
            setEditingMainCategory(null);
            setEditingSubCategory(null);
            setEditingChildCategory(null);
            setEditingDeepChildCategory(null);
            setEditingSubDeepChildCategory(null);

            // If we have selected IDs, restore the view
            if (formName === 'subDeep' && selectedDeepChildCategoryId && selectedMainCategoryId && selectedChildCategoryId) {
                fetchSubDeepChildCategories(selectedMainCategoryId, selectedChildCategoryId, selectedDeepChildCategoryId, selectedSubCategoryId);
                setActiveView('subDeepList');
            }
            else if (selectedSubCategoryId) setActiveView('childList');
            else if (selectedMainCategoryId) setActiveView('subList');
            else if (currentView === 'mainList') setActiveView('mainList'); // Restore main view
            else setActiveView(null);
        } else {
            // Opening form
            setActiveForm(formName);
            // Only hide view if we are NOT in mainList (to allow modal over list)
            if (activeView !== 'mainList') {
                setActiveView(null);
            }
        }
    }

    const toggleView = (viewName: string) => {
        setActiveView(activeView === viewName ? null : viewName);
        setActiveForm(null);
        resetNavigation();
    }

    const resetNavigation = () => {
        setSelectedMainCategoryId(null);
        setSelectedMainCategoryName(null);
        setSelectedSubCategoryId(null);
        setSelectedSubCategoryName(null);
        setSelectedChildCategoryId(null);
        setSelectedChildCategoryName(null);
        setSelectedDeepChildCategoryId(null);
          setSelectedDeepCategoryId(null);        // ✅ ADD THIS
  setSelectedDeepCategoryName(null);    
        setSelectedDeepChildCategoryName(null);
    }

    const {
        // fetch
        fetchMainCategories,
        fetchSubCategories,
        fetchChildCategories,
        fetchDeepChildCategories,
        fetchSubDeepChildCategories,

        // add
        addChildCategory,
        addDeepChildCategory,
        addChildCategoryMedia,

        // delete
        deleteMainCategory,
        deleteSubCategory,
        deleteChildCategory,
        deleteDeepChildCategory,
        deleteSubDeepChildCategory,
        deleteChildCategoryMediaByIndex,
        updateChildCategoryMediaByIndex,

        // toggle
        toggleMainVisibility,
        toggleMainNameVisibility,
        toggleMainIsSub,
        toggleMainImageVisibility,
        toggleSubVisibility,
        toggleSubNameVisibility,
        toggleSubImageVisibility,
        toggleSubHasSubCategory,
        toggleChildVisibility,
        toggleDeepChildVisibility,
        toggleSubDeepChildVisibility,

        // data
        mainCategories,
        subCategories,
        childCategories,
        deepChildCategories,
        subDeepChildCategories,

        // 🔥 MEDIA (YE IMPORTANT HAI)
        fetchChildCategoryMedia,
        updateChildCategoryMediaGroup,
        childCategoriesV2

    } = useCategory();


    // ✅ FIX: Sanitize URLs to replace legacy 'serverapi' with current API domain if needed
    const sanitizeUrl = (url: string) => {
        if (!url) return "";
        // Replace legacy domain
        let finalUrl = url.replace("serverapi.bijliwalaaya.in", "api.bijliwalaaya.in");

        // If relative path (starts with uploads/), prepend domain
        if (!finalUrl.startsWith("http")) {
            // Remove leading slash if present to avoid double slash
            const cleanPath = finalUrl.startsWith("/") ? finalUrl.slice(1) : finalUrl;
            finalUrl = `https://api.bijliwalaaya.in/${cleanPath}`;
        }
        return finalUrl;
    };

    const mergedChildList = React.useMemo(() => {
        // Only merge for child list view
        const existingMap = new Map((childCategories || []).filter(c => c.name !== "childCatVideos").map(c => [c.name, c]));

        return REQUIRED_SERVICES.filter(n => n !== "childCatVideos").map(name => {
            if (existingMap.has(name)) return existingMap.get(name);
            return {
                name,
                _id: `missing-${name}`,
                documentId: `missing-${name}`,
                isMissing: true,
                visible: false,
                visibility: false,
                // Add dummy props to prevent errors
                mainCategoryId: selectedMainCategoryId,
                subCategoryId: selectedSubCategoryId
            };
        });
    }, [childCategories, REQUIRED_SERVICES, selectedMainCategoryId, selectedSubCategoryId]);

    useEffect(() => {
        fetchMainCategories();
    }, []);

    const fetchCurrentMedia = async (mainId?: string | null, subId?: string | null) => {
        const mId = mainId || selectedMainCategoryId;
        const sId = subId !== undefined ? subId : selectedSubCategoryId;

        if (!mId) return;

        console.log(`🔄 Global Fetch Media for Main: ${mId}, Sub: ${sId}`);
        try {
            const media = await fetchChildCategoryMedia(mId, sId || undefined);
            if (media) {
                // ✅ Update Group States from DB
                if (media.images) {
                    setImageGroupTitle(media.images.name || "");
                    setImageGroupTitleVisible(media.images.visibility ?? true);
                }
                if (media.videos) {
                    setVideoGroupTitle(media.videos.name || "");
                    setVideoGroupTitleVisible(media.videos.visibility ?? true);
                }

                // ✅ ROBUST MAPPER: Map DB 'visibility' to UI 'visible' using Object.entries to preserve keys
                const mapMedia = (obj: any, isVideo: boolean) =>
                    Object.entries(obj || {})
                        .filter(([key, v]: any) => v && typeof v === "object" && (v.url || v.uri || v.imageTitle || v.videoTitle))
                        .map(([key, v]: any) => ({
                            ...v,
                            dbIndex: key, // ✅ Crucial: Store the actual index from the database
                            id: v.id || v._id || key,
                            title: isVideo ? (v.videoTitle || "Untitled Video") : (v.imageTitle || "Untitled Image"),
                            visible: v.visibility !== undefined ? v.visibility : true // Map DB field
                        }));

                setImages(mapMedia(media.images, false));
                setVideos(mapMedia(media.videos, true));

                // Mapping Links
                if (media.links) {
                    const mappedLinks = Object.entries(media.links)
                        .filter(([k, v]: any) => v && typeof v === 'object' && (v.url || v.linkTitle))
                        .map(([k, v]: any) => ({
                            ...v,
                            id: v.id || v._id || k,
                            dbIndex: k,
                            title: v.linkTitle || "Untitled Link",
                            url: v.url || "",
                            visible: v.visibility ?? v.visible ?? true
                        }));
                    setLinks(mappedLinks as any);
                    setLinkGroupTitleVisible(media.links.visibility ?? true);
                }
            }
        } catch (err) {
            console.error("❌ Failed to fetch current media:", err);
        }
    };

    const handleMainCategoryClick = async (item: any) => {
        const mainId = item._id || item.id;
        setSelectedMainCategoryId(mainId);
        setSelectedMainCategoryName(item.name);

        // ✅ FIX: Clear Sub Category State to prevent navigation bugs
        setSelectedSubCategoryId(null);
        setSelectedSubCategoryName(null);

        if (item.hasSubCategory) {
            fetchSubCategories(mainId);
            setActiveView("subList");
        } else {
            fetchChildCategories(mainId, null);
            setActiveView("childList");
            // ✅ Load media immediately when joining childList
            await fetchCurrentMedia(mainId, null);
        }
    };

    const handleSubCategoryClick = async (item: any) => {
        const id = item.documentId || item._id || item.id;
        setSelectedSubCategoryId(id);
        setSelectedSubCategoryName(item.name);
        if (selectedMainCategoryId) {
            fetchChildCategories(selectedMainCategoryId, id);
            // ✅ Load media immediately when joining childList from sub-cat
            await fetchCurrentMedia(selectedMainCategoryId, id);
        }
        setActiveView('childList');
    };
const handleChildCategoryClick = async (item: any) => {
  const childId = item.documentId || item._id || item.id;
  
  setSelectedChildCategoryId(childId);
  setSelectedChildCategoryName(item.name);

  if (!selectedMainCategoryId) {
    alert("Main category not selected");
    return;
  }

  console.log("🔍 Clicked Child Category:", {
    name: item.name,
    documentId: item.documentId,
    _id: item._id,
    usingId: childId
  });

  // ✅ STEP 1: Pehle view change karo
  setActiveView("deepList");
  
  // ✅ STEP 2: Thoda delay dekar data fetch karo
  setTimeout(() => {
    fetchDeepChildCategories(
      selectedMainCategoryId,
      childId,
      selectedSubCategoryId
    );
  }, 50);
};

useEffect(() => {
  console.log("🔄 deepChildCategories changed:", deepChildCategories);
}, [deepChildCategories]);



    const handleBack = () => {
        if (activeView === 'subDeepList') {
            setActiveView('deepList');
            setSelectedDeepChildCategoryId(null);
            setSelectedDeepChildCategoryName(null);
        } else if (activeView === 'deepList') {
            setActiveView('childList');
              setSelectedDeepCategoryId(null);      // ✅ DEEP CATEGORY CLEAR KARO
    setSelectedDeepCategoryName(null); 
            setSelectedDeepChildCategoryId(null);
            setSelectedDeepChildCategoryName(null);
        } else if (activeView === 'childList') {
            // Check if we came from Sub Category or Main Category
            if (selectedSubCategoryId) {
                setActiveView('subList');
                // ✅ We are going back to the LIST of subcategories, so we unselect the specific one
                setSelectedSubCategoryId(null);
                setSelectedSubCategoryName(null);
            } else {
                setActiveView('mainList');
            }
            setSelectedChildCategoryId(null);
            setSelectedChildCategoryName(null);
        } else if (activeView === 'subList') {
            setActiveView('mainList');
            setSelectedSubCategoryId(null);
            setSelectedSubCategoryName(null);
        } else if (activeView === 'mainList') {
            setActiveView(null);
            resetNavigation();
        } else {
            setActiveView(null);
            resetNavigation();
        }
    };

    // Helper to wrapping delete for easier passing or adding confirmation later
    const handleDeleteMain = (item: any) => deleteMainCategory(item._id || item.id);
    const handleDeleteSub = (item: any) => deleteSubCategory(item.documentId || item._id || item.id);
    const handleDeleteChild = (item: any) => deleteChildCategory(item.documentId || item._id || item.id);
    const handleDeleteDeep = (item: any) => deleteDeepChildCategory(item.id || item._id);
    const handleDeleteSubDeep = (item: any) => deleteSubDeepChildCategory(item.id);

    // Helpers for edit (open form) - implementing basic logic
    const handleEditMain = (item: any) => {
        setEditingMainCategory(item);
        // Explicitly set active form without clearing view
        setActiveForm('main');
    };

    const handleEditSub = (item: any) => {
        setEditingSubCategory(item);
        setActiveForm('sub');
    };

    const handleEditChild = (item: any) => {
        setEditingChildCategory(item);
        setActiveForm('child');
    };

    const handleEditDeep = (item: any) => {
        setEditingDeepChildCategory(item);
        setActiveForm('deep');
    };

    const handleToggleMediaVisibility = async (type: "images" | "videos" | "links", index: number, currentVisible: boolean) => {
        if (!selectedMainCategoryId) return;

        const mediaItem = type === "images" ? images[index] : (type === "videos" ? videos[index] : links[index]);
        const dbIndex = mediaItem?.dbIndex ?? index;
        const newVisible = !currentVisible;

        // 🚀 Optimistic Update
        if (type === "images") {
            setImages(prev => prev.map((img, i) => i === index ? { ...img, visible: newVisible } : img));
        } else if (type === "videos") {
            setVideos(prev => prev.map((vid, i) => i === index ? { ...vid, visible: newVisible } : vid));
        } else if (type === "links") {
            setLinks(prev => prev.map((lnk, i) => i === index ? { ...lnk, visible: newVisible } : lnk));
        }

        try {
            await updateChildCategoryMediaByIndex(
                selectedMainCategoryId,
                type as any,
                dbIndex,
                { visibility: newVisible },
                selectedSubCategoryId || undefined
            );
            console.log(`✅ ${type} item [${dbIndex}] visible toggled to ${newVisible}`);
        } catch (err) {
            console.error(`❌ Failed to toggle ${type} item visibility:`, err);
            // Revert on failure
            if (type === "images") {
                setImages(prev => prev.map((img, i) => i === index ? { ...img, visible: currentVisible } : img));
            } else if (type === "videos") {
                setVideos(prev => prev.map((vid, i) => i === index ? { ...vid, visible: currentVisible } : vid));
            } else if (type === "links") {
                setLinks(prev => prev.map((lnk, i) => i === index ? { ...lnk, visible: currentVisible } : lnk));
            }
        }
    };

    const handleToggleGroupVisibility = async (type: "images" | "videos" | "links", currentVisible: boolean) => {
        if (!selectedMainCategoryId) return;

        const newVisible = !currentVisible;

        // 🚀 Optimistic Update
        if (type === "images") {
            setImageGroupTitleVisible(newVisible);
        } else if (type === "videos") {
            setVideoGroupTitleVisible(newVisible);
        } else if (type === "links") {
            setLinkGroupTitleVisible(newVisible);
        }

        try {
            const currentName = type === "images" ? imageGroupTitle : (type === "videos" ? videoGroupTitle : linkGroupTitle);
            await updateChildCategoryMediaGroup(
                selectedMainCategoryId,
                type,
                { name: currentName, visibility: newVisible },
                selectedSubCategoryId || undefined
            );
            console.log(`✅ ${type} group visible toggled to ${newVisible}`);
            // Removed automatic fetchCurrentMedia refresh to prevent race conditions 
            // and "automatic on/off" flickering.

        } catch (err) {
            console.error(`❌ Failed to toggle ${type} group visibility:`, err);
            // Revert
            if (type === "images") {
                setImageGroupTitleVisible(currentVisible);
            } else if (type === "videos") {
                setVideoGroupTitleVisible(currentVisible);
            } else if (type === "links") {
                setLinkGroupTitleVisible(currentVisible);
            }
        }
    };

    const handleConfirmDeleteMedia = async () => {
        if (!deleteMediaInfo || !selectedMainCategoryId) return;
        setIsDeletingMedia(true);

        try {
            if (deleteMediaInfo.type === 'links') {
                // Just local delete for links as API support is uncertain based on current code
                const newL = [...links];
                newL.splice(deleteMediaInfo.index, 1);
                setLinks(newL);
                setDeleteMediaInfo(null);
                setIsDeletingMedia(false);
                return;
            }

            console.log(`🗑️ Deleting ${deleteMediaInfo.type} at index ${deleteMediaInfo.index}`);

            // 🚀 Optimistic update
            if (deleteMediaInfo.type === "images") {
                setImages(prev => prev.filter((_, i) => i !== deleteMediaInfo.index));
            } else {
                setVideos(prev => prev.filter((_, i) => i !== deleteMediaInfo.index));
            }

            const dbIndex = deleteMediaInfo.dbIndex ?? deleteMediaInfo.index;

            await deleteChildCategoryMediaByIndex(
                selectedMainCategoryId,
                deleteMediaInfo.type,
                dbIndex,
                selectedSubCategoryId || undefined
            );

            // Refresh UI
            const media = await fetchChildCategoryMedia(selectedMainCategoryId, selectedSubCategoryId || undefined);
            if (media) {
                // Skip nulls and administrative keys
                const filterFn = (v: any) => v && typeof v === "object" && (v.url || v.uri || v.imageTitle || v.videoTitle);
                if (deleteMediaInfo.type === "images") {
                    setImages(Object.values(media.images || {}).filter(filterFn) as any);
                } else {
                    setVideos(Object.values(media.videos || {}).filter(filterFn) as any);
                }
            }

            setDeleteMediaInfo(null);
            alert("✅ Deleted successfully!");
        } catch (error) {
            console.error("❌ Delete Failed:", error);
            alert("Delete failed. Please try again.");
        } finally {
            setIsDeletingMedia(false);
        }
    };

    const handleEditSubDeep = (item: any) => {
        // Inject parent names from context to ensure form populates correctly
        const enrichedItem = {
            ...item,
            mainCategoryName: selectedMainCategoryName || item.mainCategoryName,
            subCategoryName: selectedSubCategoryName || item.subCategoryName,
            childCategoryName: selectedChildCategoryName || item.childCategoryName,
            deepChildCategoryName: selectedDeepChildCategoryName || item.deepChildCategoryName || item.deepChildName,

            // 🔥 CRITICAL: Inject IDs from state if missing to prevent "Select Main Category" errors
            mainCategoryId: item.mainCategoryId || selectedMainCategoryId,
            subCategoryId: item.subCategoryId || selectedSubCategoryId,
            childCategoryId: item.childCategoryId || selectedChildCategoryId,
            deepChildCategoryId: item.deepChildCategoryId || selectedDeepChildCategoryId
        };
        console.log("✏️ Editing SubDeep with Context:", enrichedItem);
        setEditingSubDeepChildCategory(enrichedItem);
        setActiveForm('subDeep');
    };

    const handleAddMissingService = async (serviceName: string) => {
        // Updated to use Child Category Logic (Installation, Repair, etc.)
        if (!selectedMainCategoryId) return;

        try {
            await addChildCategory({
                name: serviceName,
                mainCategoryId: selectedMainCategoryId,
                subCategoryId: selectedSubCategoryId || undefined,
                visible: true
            });
            // Refresh
            fetchChildCategories(selectedMainCategoryId, selectedSubCategoryId);
        } catch (error) {
            console.error("Failed to add missing service", error);
        }
    };

    const handleAddAllMissingServices = async () => {
        const missing = REQUIRED_SERVICES.filter(svc =>
            !childCategories.some(cat => cat.name === svc)
        );

        for (const svc of missing) {
            await handleAddMissingService(svc);
        }
        setShowAddMissingModal(false);
    };

    const handleAddVideo = () => {
        if (selectedChildCategoryName) {
            setTargetCategoryName(selectedChildCategoryName);
        }
        setVideoLinkInput(""); // ✅ Reset Link Input
        setPendingVideos([]); // ✅ Reset Pending Videos
        setShowVideoModal(true);
    };

    // ✅ ADD IMAGE & LINK HANDLERS

    // ✅ ADD IMAGE & LINK HANDLERS
    const [showImageModal, setShowImageModal] = useState(false);
    const [showLinkModal, setShowLinkModal] = useState(false);

    // const handleImageSubmit = async (e: React.FormEvent) => {
    //     e.preventDefault();

    //     if (!selectedMainCategoryId) {
    //         alert("Main Category missing");
    //         return;
    //     }

    //     console.log("🚀 SUBMITTING PENDING IMAGES FOR ID:", selectedMainCategoryId);

    //     try {
    //         for (const img of pendingImages) {
    //             if (!img.url && !img.file) continue;

    //             console.log("📤 POSTing Image:", img.title || "Untitled");
    //             await addChildCategoryMedia(
    //                 selectedMainCategoryId,
    //                 "images",
    //                 {
    //                     imageTitle: imageGroupTitle.trim() || img.title || "",
    //                     url: img.url,
    //                     file: img.file as any,
    //                     visibility: img.visible ?? false // ✅ Default to false
    //                 },
    //                 selectedSubCategoryId || undefined
    //             );
    //         }

    //         // Refresh media after all uploads using centralized fetcher
    //         await fetchCurrentMedia();

    //         alert("✅ Images added successfully with POST!");
    //         setPendingImages([]);
    //         setImageGroupTitle(""); // ✅ Clear section title
    //         setShowImageModal(false);

    //     } catch (err) {
    //         console.error("❌ Image submission failed:", err);
    //         alert("❌ Failed to add images. Check console.");
    //     }
    // };

 const handleImageSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedMainCategoryId) {
        alert("Main Category missing");
        return;
    }

    // ✅ Remove empty entries first
    const validImages = pendingImages.filter(
        (img) => img.file || (img.url && img.url.trim() !== "")
    );

    if (validImages.length === 0) {
        alert("Please add at least one valid image (file or URL)");
        return;
    }

    console.log("🚀 SUBMITTING IMAGES FOR:", selectedMainCategoryId);

    try {
        for (const img of validImages) {

            console.log("📤 Uploading:", img.title || "Untitled");

            await addChildCategoryMedia(
                selectedMainCategoryId,
                "images",
                {
                    imageTitle:
                        imageGroupTitle?.trim() ||
                        img.title?.trim() ||
                        "Untitled Image",

                    // ✅ Only send file if exists
                    file: img.file ? img.file : undefined,

                    // ✅ Only send URL if no file
                    url: img.file
                        ? undefined
                        : img.url?.trim() || undefined,

                    visibility: img.visible ?? false
                },
                selectedSubCategoryId || undefined
            );
        }

        // ✅ Refresh media properly
        await fetchCurrentMedia(
            selectedMainCategoryId,
            selectedSubCategoryId || undefined
        );

        alert("✅ Images uploaded successfully!");

        // ✅ Reset
        setPendingImages([]);
        setImageGroupTitle("");
        setImageUrlInput("");
        setShowImageModal(false);

    } catch (err) {
        console.error("❌ Image submission failed:", err);
        alert("❌ Failed to upload images. Check console.");
    }
};

    const handleLinkSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // ❌ LINKS API NOT SUPPORTED - Only images and videos are supported by childCatMedia API
        alert("⚠️ Links functionality is not supported by the media API. Only images and videos are supported.");
        setShowLinkModal(false);

        /* DISABLED - Links not supported in media API
        const formData = new FormData(e.currentTarget);
        const title = formData.get('linkTitle') as string;
        const url = formData.get('linkUrl') as string;

        if (!selectedMainCategoryId) {
            alert("Main Category is not selected");
            return;
        }
        const targetName = selectedChildCategoryName;


        try {
            // 1. Fetch Existing
            const existing = await fetchChildCategoryV2(selectedMainCategoryId, targetName, selectedSubCategoryId || undefined);
            const currentLinks = existing?.links?.items || existing?.links || {};
            const safeCurrentLinks: any = {};
            Object.keys(currentLinks).forEach(k => {
                if (typeof currentLinks[k] === 'object' && currentLinks[k] !== null) safeCurrentLinks[k] = currentLinks[k];
            });


            // 2. Prepare New
            const newLinksObj: any = {};
            const startIndex = Object.keys(safeCurrentLinks).length;

            newLinksObj[startIndex] = {
                linkTitle: title,
                url: url,
                visibility: newLinkVisible
            };

            // 3. Merge
            const mergedLinks = {
                name: "links",
                visibility: linkGroupTitleVisible,
                ...safeCurrentLinks,
                ...newLinksObj
            };

            // 4. Payload
            const payload: any = {
                name: targetName,
                visibility: existing?.visibility ?? true,
                links: mergedLinks
            };

            if (existing?.images) payload.images = existing.images;
            if (existing?.videos) payload.videos = existing.videos;

            const apiFormData = new FormData();
            // Helper to build FormData
            const buildFormData = (formData: FormData, data: any, parentKey?: string) => {
                if (data === undefined) return;
                if (data && typeof data === 'object' && !(data instanceof Date) && !(data instanceof File) && !(data instanceof Blob)) {
                    Object.keys(data).forEach(key => {
                        buildFormData(formData, data[key], parentKey ? `${ parentKey }[${ key }]` : key);
                    });
                } else {
                    const value = data == null ? '' : data;
                    formData.append(parentKey || '', value);
                }
            };
            buildFormData(apiFormData, payload);

            // 5. Save
            for (const vid of videosToProcess) {
                if (!vid.url) continue;

                await addChildCategoryMedia(
                    selectedMainCategoryId,
                    "videos",
                    {
                        videoTitle: vid.title,
                        url: vid.url,
                        visibility: vid.visible
                    },
                    selectedSubCategoryId || undefined
                );
            }


            // ✅ REFRESH LOCAL LINKS STATE
            const updatedData = await fetchChildCategoryV2(selectedMainCategoryId, targetName, selectedSubCategoryId || undefined);
            if (updatedData) {
                const newLinks = Object.values(updatedData.links).filter((x: any) => typeof x === 'object').map((lnk: any) => ({
                    title: lnk.linkTitle || "Link",
                    url: lnk.url,
                    visible: lnk.visibility ?? true
                }));
                // @ts-ignore
                setLinks(newLinks);
            }

            alert("Link Added Successfully!");
            setNewLinkVisible(true);
            setShowLinkModal(false);
            setTargetCategoryName("");

        } catch (error) {
            console.error("Failed to add link", error);
            alert("Failed to add link.");
        }
        */
    };

    // Helpers for toggle
    const handleToggleMain = (item: any) => toggleMainVisibility(item._id || item.id);
    const handleToggleSub = (item: any) => toggleSubVisibility(item.documentId || item._id || item.id);
    const handleToggleChild = async (item: any) => {
        if (item.isMissing) {
            // Auto-create category
            await addChildCategory({
                name: item.name,
                mainCategoryId: selectedMainCategoryId || "",
                subCategoryId: selectedSubCategoryId || undefined,
                visible: true
            });
            // Fetch will update list
            if (selectedMainCategoryId) fetchChildCategories(selectedMainCategoryId, selectedSubCategoryId);
        } else {
            toggleChildVisibility(item.documentId || item._id || item.id);
        }
    };
    const handleToggleDeep = (item: any, field?: string) => toggleDeepChildVisibility(item.documentId || item.id || item._id, field);


    const handleToggleSubDeep = (item: any, field?: string) => toggleSubDeepChildVisibility(item.id || item.subDeepKey || item.documentId, field);

    return (
        <div className={`mx-auto max-w-4xl pb-20 min-h-screen px-4 md:px-0 transition-colors duration-300 ${isDark ? 'bg-[#0B1437]' : 'bg-gray-50'}`}>
            {/* DASHBOARD HOME VIEW */}

            {!isProductListingSelected ? (
                <div className="pt-10 transition-all duration-500 animate-in fade-in slide-in-from-bottom-5">
                    <h1 className={`mb-8 text-2xl font-black uppercase tracking-tight ${isDark ? 'text-white' : 'text-blue-950'}`}>Inventory Management</h1>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <button
                            onClick={() => setIsProductListingSelected(true)}
                            className={`border rounded-[2.5rem] p-10 flex flex-col items-center justify-center group transition-all duration-500 hover:-translate-y-2 active:scale-[0.98] relative overflow-hidden ring-4 ring-transparent ${isDark
                                ? 'bg-[#111C44] border-gray-800 hover:shadow-[0_40px_80px_-15px_rgba(37,99,235,0.3)] hover:ring-blue-900/20'
                                : 'bg-white border-gray-100 hover:shadow-[0_40px_80px_-15px_rgba(37,99,235,0.15)] hover:ring-blue-50'
                                }`}
                        >
                            <div className="absolute top-0 right-0 -m-8 h-32 w-32 bg-blue-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                            <div className="relative bg-blue-50 p-8 rounded-[2rem] mb-8 group-hover:bg-blue-600 group-hover:rotate-[15deg] transition-all duration-500 shadow-sm group-hover:shadow-blue-200 group-hover:shadow-2xl text-center">
                                <Box className="h-14 w-14 text-blue-600 group-hover:text-white transition-colors duration-300 mx-auto" />
                            </div>

                            <div className="relative text-center">
                                <span className={`text-3xl font-black tracking-tight block mb-3 transition-colors ${isDark ? 'text-white group-hover:text-blue-400' : 'text-blue-950 group-hover:text-blue-700'}`}>
                                    Product Listing
                                </span>
                                <p className={`text-lg font-medium max-w-[240px] leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                    Manage your dynamic categories and subcategories
                                </p>
                            </div>

                            <div className="mt-10 flex items-center gap-2 text-blue-600 font-bold uppercase text-xs tracking-widest opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-4 group-hover:translate-y-0">
                                Open System <ArrowRight className="h-4 w-4" />
                            </div>
                        </button>

                        <button
    onClick={() => router.push("/partner-management/partner-app/spare-part")}

    className={`border rounded-[2.5rem] p-10 flex flex-col items-center justify-center group transition-all duration-500 hover:-translate-y-2 active:scale-[0.98] relative overflow-hidden ring-4 ring-transparent ${isDark
        ? 'bg-[#111C44] border-gray-800 hover:shadow-[0_40px_80px_-15px_rgba(16,185,129,0.3)] hover:ring-emerald-900/20'
        : 'bg-white border-gray-100 hover:shadow-[0_40px_80px_-15px_rgba(16,185,129,0.15)] hover:ring-emerald-50'
        }`}
>
    <div className="absolute top-0 right-0 -m-8 h-32 w-32 bg-emerald-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

    <div className="relative bg-emerald-50 p-8 rounded-[2rem] mb-8 group-hover:bg-emerald-600 group-hover:rotate-[15deg] transition-all duration-500 shadow-sm group-hover:shadow-emerald-200 group-hover:shadow-2xl text-center">
        <Box className="h-14 w-14 text-emerald-600 group-hover:text-white transition-colors duration-300 mx-auto" />
    </div>

    <div className="relative text-center">
        <span className={`text-3xl font-black tracking-tight block mb-3 transition-colors ${isDark ? 'text-white group-hover:text-emerald-400' : 'text-blue-950 group-hover:text-emerald-700'}`}>
            Spare Part
        </span>
        <p className={`text-lg font-medium max-w-[240px] leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            Manage spare parts inventory and stock levels
        </p>
    </div>

    <div className="mt-10 flex items-center gap-2 text-emerald-600 font-bold uppercase text-xs tracking-widest opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-4 group-hover:translate-y-0">
        Open System <ArrowRight className="h-4 w-4" />
    </div>
</button>


                        <div className={`border border-dashed rounded-[2.5rem] p-10 flex flex-col items-center justify-center opacity-60 grayscale hidden md:flex ${isDark ? 'bg-[#111C44]/50 border-gray-700' : 'bg-gray-100/50 border-gray-200'}`}>
                            <div className={`p-8 rounded-[2rem] mb-8 ${isDark ? 'bg-gray-800' : 'bg-gray-200/50'}`}>
                                <div className={`h-14 w-14 rounded-lg animate-pulse ${isDark ? 'bg-gray-700' : 'bg-gray-300'}`} />
                            </div>
                            <div className={`h-6 w-32 rounded animate-pulse mb-3 ${isDark ? 'bg-gray-800' : 'bg-gray-200'}`}></div>
                            <div className={`h-4 w-48 rounded animate-pulse ${isDark ? 'bg-gray-800' : 'bg-gray-200'}`}></div>
                        </div>
                    </div>

                    <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6 opacity-40 grayscale pointer-events-none">
                        <div className={`p-6 rounded-2xl border shadow-sm flex items-center gap-4 ${isDark ? 'bg-[#111C44] border-gray-800' : 'bg-white border-gray-100'}`}>
                            <div className={`h-10 w-10 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}></div>
                            <div className={`h-4 w-32 rounded ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}></div>
                        </div>
                        <div className={`p-6 rounded-2xl border shadow-sm flex items-center gap-4 ${isDark ? 'bg-[#111C44] border-gray-800' : 'bg-white border-gray-100'}`}>
                            <div className={`h-10 w-10 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}></div>
                            <div className={`h-4 w-32 rounded ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}></div>
                        </div>
                    </div>
                </div>
            ) : (
                <>
                    {!activeView && (
                        <>
                            {/* ... (existing sections) ... */}
                            {/* Keep existing sections as is */}
                            <div className="flex items-center gap-4 pt-6 mb-4">
                                <button
                                    onClick={() => setIsProductListingSelected(false)}
                                    className={`p-2 rounded-full transition-colors ${isDark ? 'hover:bg-gray-800 text-white' : 'hover:bg-gray-200 text-gray-900'}`}
                                    title="Go back to Product Listing"
                                >
                                    <ArrowLeft size={24} />
                                </button>
                                <h1 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Inventory Management</h1>
                            </div>

                            {/* ... Update/Delete Section ... */}
                            <section className="mb-6">

                                <div className="w-full">
                                    <button
                                        onClick={() => toggleView("mainList")}
                                        className={`flex h-20 w-full items-center justify-center rounded-xl text-lg font-bold shadow-sm transition-all hover:scale-[1.01] active:scale-[0.98] ${isDark
                                            ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30 hover:bg-blue-600/30 shadow-[0_0_20px_rgba(59,130,246,0.1)]'
                                            : 'bg-white text-blue-950 border border-gray-100 hover:bg-gray-50'
                                            }`}
                                    >
                                        Category Management
                                    </button>
                                </div>

                            </section>

                            {/* ... Insert Section ... (Keep as is) */}
                            <section>
                                <h2 className={`mb-6 text-center text-xl font-black uppercase tracking-wider md:text-left ${isDark ? 'text-white' : 'text-gray-900'}`}>Insert new categorys</h2>
                                <div className="space-y-4">
                                    {/* ... (buttons for forms) ... */}
                                    <div>
                                        <button onClick={() => toggleForm('main')} className={`w-full py-4 rounded-xl font-bold text-lg shadow-md transition-all active:scale-[0.98] border ${activeForm === 'main' ? 'bg-red-600 text-white border-red-700' : (isDark ? 'bg-[#1B2559] text-gray-300 border-gray-700 hover:bg-[#232D65]' : 'bg-white text-gray-700 border-gray-100 hover:bg-gray-50')}`}>Manage Main Category</button>
                                        {activeForm === 'main' && <div className={`mt-4 p-6 rounded-2xl border ${isDark ? 'bg-[#111C44] border-gray-800' : 'bg-white border-gray-100'}`}><MainCategoryForm onSuccess={() => { }} /></div>}
                                    </div>
                                    <div>
                                        <button onClick={() => toggleForm('sub')} className={`w-full py-4 rounded-xl font-bold text-lg shadow-md transition-all active:scale-[0.98] border ${activeForm === 'sub' ? 'bg-green-600 text-white border-green-700' : (isDark ? 'bg-[#1B2559] text-gray-300 border-gray-700 hover:bg-[#232D65]' : 'bg-white text-gray-700 border-gray-100 hover:bg-gray-50')} `}>Manage Sub Category</button>
                                        {activeForm === 'sub' && <div className={`mt-4 p-6 rounded-2xl border ${isDark ? 'bg-[#111C44] border-gray-800' : 'bg-white border-gray-100'}`}><SubCategoryForm onSuccess={() => { }} /></div>}
                                    </div>
                                    <div>
                                        <button onClick={() => toggleForm('child')} className={`w-full py-4 rounded-xl font-bold text-lg shadow-md transition-all active:scale-[0.98] border ${activeForm === 'child' ? 'bg-blue-600 text-white border-blue-700' : (isDark ? 'bg-[#1B2559] text-gray-300 border-gray-700 hover:bg-[#232D65]' : 'bg-white text-gray-700 border-gray-100 hover:bg-gray-50')} `}>Manage Child Category</button>
                                        {activeForm === 'child' && <div className={`mt-4 p-6 rounded-2xl border ${isDark ? 'bg-[#111C44] border-gray-800' : 'bg-white border-gray-100'}`}><ChildCategoryForm onSuccess={() => { }} /></div>}
                                    </div>
                                    <div>
                                        <button onClick={() => toggleForm('deep')} className={`w-full py-4 rounded-xl font-bold text-lg shadow-md transition-all active:scale-[0.98] border ${activeForm === 'deep' ? 'bg-amber-600 text-white border-amber-700' : (isDark ? 'bg-[#1B2559] text-gray-300 border-gray-700 hover:bg-[#232D65]' : 'bg-white text-gray-700 border-gray-100 hover:bg-gray-50')} `}>Manage Deep child category</button>
                                        {activeForm === 'deep' && <div className={`mt-4 p-6 rounded-2xl border ${isDark ? 'bg-[#111C44] border-gray-800' : 'bg-white border-gray-100'}`}><DeepChildCategoryForm initialChildCategoryId={undefined} onSuccess={() => { }} /></div>}
                                    </div>
                                    <div>
                                        <button onClick={() => toggleForm('subDeep')} className={`w-full py-4 rounded-xl font-bold text-lg shadow-md transition-all active:scale-[0.98] border ${activeForm === 'subDeep' ? 'bg-purple-600 text-white border-purple-700' : (isDark ? 'bg-[#1B2559] text-gray-300 border-gray-700 hover:bg-[#232D65]' : 'bg-white text-gray-700 border-gray-100 hover:bg-gray-50')} `}>Manage Sub Deep child category</button>
                                        {activeForm === 'subDeep' && <div className={`mt-4 p-6 rounded-2xl border ${isDark ? 'bg-[#111C44] border-gray-800' : 'bg-white border-gray-100'}`}><SubDeepChildCategoryForm initialDeepChildCategoryId={undefined} onSuccess={() => { }} /></div>}
                                    </div>

                                </div>
                            </section>
                        </>
                    )}

                    {/* LIST VIEWS */}

                    {/* MAIN LIST VIEW */}
                    {activeView === 'mainList' && (
                        <div className="mb-8 pt-6">
                            {/* Header */}
                            <div className="flex items-center gap-3 mb-6">
                                <button onClick={handleBack} className={`p-2 rounded-full transition-colors ${isDark ? 'hover:bg-gray-800 text-white' : 'hover:bg-gray-200 text-gray-800'}`}>
                                    <ArrowLeft size={24} />
                                </button>
                                <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Main Category Management</h3>
                            </div>

                            {/* Search Bar */}
                            <div className="relative mb-6">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-5 pointer-events-none">
                                    <Search className="h-6 w-6 text-gray-400" />
                                </div>
                             <input
  type="text"
  placeholder="Search.."
  value={searchTerm}
  autoComplete="off"
  onChange={(e) => setSearchTerm(e.target.value)}
  className={`w-full rounded-3xl py-4 pl-14 pr-6 text-lg outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-inner ${
    isDark
      ? "bg-[#111C44] text-white placeholder-gray-500"
      : "bg-gray-200 text-gray-700 placeholder-gray-500"
  }`}
/>
                            </div>

                            <CategoryList
                                type="main"
                                onItemClick={handleMainCategoryClick}
                                onToggleVisibility={(item, type) => {
                                    const id = item._id || item.id;
                                    if (type === 'imageVisible') {
                                        toggleMainImageVisibility(id);
                                    } else if (type === 'hasSubCategory') {
                                        toggleMainIsSub(id);
                                    } else if (type === 'nameVisible') {
                                        toggleMainNameVisibility(id);
                                    } else {
                                        toggleMainVisibility(id);
                                    }
                                }}
                                onDeleteClick={handleDeleteMain}
                                onEditClick={handleEditMain}
                            // onToggleSubCat={toggleMainIsSub} // Removed in favor of unified handler
                            />
                        </div>
                    )}

                    {/* SUB LIST VIEW */}
                    {activeView === 'subList' && (
                        <div className="mb-8 pt-6">
                            <div className="flex items-center gap-2 mb-2">
                                {selectedMainCategoryId && (
                                    <button onClick={handleBack} className="p-1 rounded-full hover:bg-gray-200">
                                        <ArrowLeft size={24} className="text-blue-900" />
                                    </button>
                                )}
                                <h3 className="text-lg font-bold text-blue-900">
                                    Sub Category
                                </h3>
                            </div>
                            <CategoryList
                                type="sub"
                                filterId={selectedMainCategoryId}
                                onItemClick={handleSubCategoryClick}
                                onToggleVisibility={(item, type) => {
                                    const id = item.documentId || item._id || item.id;
                                    if (type === 'imageVisible') {
                                        toggleSubImageVisibility(id);
                                    } else if (type === 'hasSubCategory') {
                                        toggleSubHasSubCategory(id);
                                    } else if (type === 'nameVisible') {
                                        // ✅ Call the new function for name visibility
                                        toggleSubNameVisibility(id);
                                    } else {
                                        toggleSubVisibility(id);
                                    }
                                }}
                                onDeleteClick={handleDeleteSub}
                                onEditClick={handleEditSub}
                                parentNameOverride={selectedMainCategoryName}
                            />
                        </div>
                    )}

                    {/* CHILD LIST VIEW - Shows Deep Categories (Installation, Repair, Services) */}
                    {activeView === 'childList' && (
                        <div className="mb-8 pt-4">
                            {/* Header with Divide Line */}
                            <div className={`pb-3 border-b mb-6 ${isDark ? 'border-gray-800' : 'border-gray-300'}`}>
                                <div className="flex items-center gap-4">
                                    <button onClick={handleBack} className={`p-1 rounded-full transition-colors ${isDark ? 'hover:bg-gray-800 text-white' : 'hover:bg-gray-100 text-black'}`}>
                                        <ArrowLeft size={24} />
                                    </button>
                                    <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-blue-950'}`}>
                                        Child Category Management
                                    </h3>
                                </div>
                            </div>



                            {/* Deep Category List (Using 'child' data but we will style it like deep) */}
                            <CategoryList
                                type="child"
                                filterId={selectedSubCategoryId || selectedMainCategoryId}
                                onItemClick={handleChildCategoryClick}
                                onToggleVisibility={handleToggleChild}
                                onDeleteClick={handleDeleteChild}
                                onEditClick={handleEditChild}
                            />

                            {/* ACTION BUTTONS: Grid Layout for 4 Buttons */}
                            <div className="mt-8 px-2 space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <button
                                        onClick={handleAddVideo}
                                        className={`font-bold py-3 rounded-xl shadow-sm transition-all text-sm active:scale-[0.98] ${isDark ? 'bg-red-600/20 text-red-400 border border-red-500/30 hover:bg-red-600/30' : 'bg-[#E0E0E0] text-[#D00000] hover:bg-gray-300'}`}
                                    >
                                        Add Video
                                    </button>
                                    <button
                                        onClick={() => setShowAddMissingModal(true)}
                                        className={`font-bold py-3 rounded-xl shadow-sm transition-all text-sm active:scale-[0.98] ${isDark ? 'bg-red-600/20 text-red-400 border border-red-500/30 hover:bg-red-600/30' : 'bg-[#E0E0E0] text-[#D00000] hover:bg-gray-300'}`}
                                    >
                                        Add Category
                                    </button>
                                    <button
                                        onClick={() => {
                                            if (selectedChildCategoryName) setTargetCategoryName(selectedChildCategoryName);
                                            setShowImageModal(true);
                                        }}
                                        className={`font-bold py-3 rounded-xl shadow-sm transition-all text-sm active:scale-[0.98] ${isDark ? 'bg-red-600/20 text-red-400 border border-red-500/30 hover:bg-red-600/30' : 'bg-[#E0E0E0] text-[#D00000] hover:bg-gray-300'}`}
                                    >
                                        Add Image
                                    </button>

                                </div>

                                {/* Videos Label Button: Outlined Blue */}
                                <div className="w-full flex items-center gap-4">
                                    <button className="w-[100px] bg-white text-blue-950 font-bold py-2 rounded-lg border-2 border-blue-900 text-center text-sm shadow-sm">
                                        Videos
                                    </button>
                                    {/* Group Visibility Toggle */}
                                    <div className="flex flex-col items-center">
                                        <span className="text-[8px] font-bold text-gray-500 uppercase">Visible</span>
                                        <OrangeToggle
                                            checked={videoGroupTitleVisible}
                                            onChange={() => handleToggleGroupVisibility("videos", videoGroupTitleVisible)}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* VIDEO LIST - REFINED CARDS (HORIZONTAL SCROLL) */}
                            <div className="flex gap-4 overflow-x-auto px-2 pb-4 mt-2">
                                {videos.map((vid, idx) => (
                                    <div key={idx} className="min-w-[140px] w-[140px] h-[200px] bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden relative flex flex-col flex-shrink-0">
                                        <div className="flex-1 w-full bg-white relative p-2 flex items-center justify-center">
                                            {/* Placeholder/Actual Video */}
                                            {vid.url ? (
                                                <div className="w-full h-full flex flex-col justify-center items-center relative overflow-hidden group bg-black">
                                                    {(() => {
                                                        const cleanUrl = sanitizeUrl(vid.url);
                                                        const ytId = cleanUrl.match(/^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/)?.[2];
                                                        if (ytId) {
                                                            return <img src={`https://img.youtube.com/vi/${ytId}/0.jpg`} className="w-full h-full object-cover" alt="Video" />;
                                                        }
                                                        return (
                                                            <div className="w-full h-full relative">
                                                                <video src={cleanUrl} className="w-full h-full object-cover" preload="metadata" />
                                                            </div>
                                                        );
                                                    })()}
                                                    <div
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setPreviewVideoUrl(vid.url || null);
                                                        }}
                                                        className="absolute inset-0 bg-black/10 group-hover:bg-black/30 transition-colors flex items-center justify-center cursor-pointer"
                                                    >
                                                        <div className="h-10 w-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/50 text-white shadow-xl group-hover:scale-110 transition-transform">
                                                            <span className="text-lg">▶</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="flex flex-col items-center">
                                                    <div className="text-4xl text-gray-200">▶️</div>
                                                </div>
                                            )}
                                            <button className="absolute top-2 right-2 h-7 w-7 bg-white flex items-center justify-center border-2 border-blue-900 rounded-[4px] z-10 hover:bg-red-50 transition-colors"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setDeleteMediaInfo({
                                                        type: 'videos',
                                                        index: idx,
                                                        dbIndex: vid.dbIndex,
                                                        title: vid.title
                                                    });
                                                }}
                                            >
                                                <span className="text-sm font-bold text-red-600">X</span>
                                            </button>
                                        </div>

                                        {/* Footer with Title and Visibility */}
                                        <div className="w-full bg-[#666666] text-white py-1.5 px-2 flex items-center justify-between gap-1">
                                            <div className="truncate font-mono text-[10px] flex-1" title={vid.title}>
                                                {vid.title}
                                            </div>
                                            <div className="flex-shrink-0 scale-75 origin-right">
                                                <OrangeToggle
                                                    checked={vid.visible}
                                                    onChange={() => handleToggleMediaVisibility("videos", idx, vid.visible)}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* IMAGES SECTION (HORIZONTAL SCROLL) */}
                            {
                                images.length > 0 && (
                                    <div className="mt-4 px-2">
                                        <div className="w-full mb-2 flex items-center gap-4">
                                            <button className="w-[100px] bg-white text-blue-950 font-bold py-2 rounded-lg border-2 border-blue-900 text-center text-sm shadow-sm">
                                                Images
                                            </button>
                                            {/* Group Visibility Toggle */}
                                            <div className="flex flex-col items-center">
                                                <span className="text-[8px] font-bold text-gray-500 uppercase">Visible</span>
                                                <OrangeToggle
                                                    checked={imageGroupTitleVisible}
                                                    onChange={() => handleToggleGroupVisibility("images", imageGroupTitleVisible)}
                                                />
                                            </div>
                                        </div>
                                        <div className="flex gap-4 overflow-x-auto pb-4">
                                            {images.map((img, idx) => (
                                                <div key={idx} className="min-w-[140px] w-[140px] h-[200px] bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden relative flex flex-col flex-shrink-0">
                                                    <div className="flex-1 w-full bg-white relative p-2 flex items-center justify-center">
                                                        {/* Placeholder/Actual Image */}
                                                        {img.url ? (
                                                            <img src={img.url} alt={img.title} className="w-full h-full object-cover" />
                                                        ) : (
                                                            <div className="text-4xl text-gray-200">🖼️</div>
                                                        )}
                                                        <button className="absolute top-2 right-2 h-7 w-7 bg-white flex items-center justify-center border-2 border-blue-900 rounded-[4px] z-10 hover:bg-red-50 transition-colors"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setDeleteMediaInfo({
                                                                    type: 'images',
                                                                    index: idx,
                                                                    dbIndex: img.dbIndex,
                                                                    title: img.title
                                                                });
                                                            }}
                                                        >
                                                            <span className="text-sm font-bold text-red-600">X</span>
                                                        </button>
                                                    </div>

                                                    {/* Footer with Title and Visibility */}
                                                    <div className="w-full bg-[#666666] text-white py-1.5 px-2 flex items-center justify-between gap-1">
                                                        <div className="truncate font-mono text-[10px] flex-1" title={img.title}>
                                                            {img.title}
                                                        </div>
                                                        <div className="flex-shrink-0 scale-75 origin-right">
                                                            <OrangeToggle
                                                                checked={img.visible}
                                                                onChange={() => handleToggleMediaVisibility("images", idx, img.visible)}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )
                            }

                            {/* LINKS SECTION (HORIZONTAL SCROLL) */}
                            {
                                links.length > 0 && (
                                    <div className="mt-4 px-2">
                                        <div className="w-full mb-2 flex items-center gap-4">
                                            <button className={`w-[100px] font-bold py-2 rounded-lg border-2 text-center text-sm shadow-sm transition-colors ${isDark ? 'bg-[#1B2559] text-white border-blue-900' : 'bg-white text-blue-950 border-blue-900'}`}>
                                                Links
                                            </button>
                                            {/* Group Visibility Toggle */}
                                            <div className="flex flex-col items-center">
                                                <span className="text-[8px] font-bold text-gray-500 uppercase">Visible</span>
                                                <OrangeToggle
                                                    checked={linkGroupTitleVisible}
                                                    onChange={() => handleToggleGroupVisibility("links", linkGroupTitleVisible)}
                                                />
                                            </div>
                                        </div>
                                        <div className="flex gap-4 overflow-x-auto pb-4">
                                            {links.map((lnk, idx) => (
                                                <div key={idx} className={`min-w-[140px] w-[140px] h-[200px] rounded-lg shadow-sm border overflow-hidden relative flex flex-col flex-shrink-0 transition-colors ${isDark ? 'bg-[#111C44] border-gray-800' : 'bg-white border-gray-200'}`}>
                                                    <div className={`flex-1 w-full relative p-2 flex items-center justify-center ${isDark ? 'bg-[#1B2559]' : 'bg-white'}`}>
                                                        {/* Placeholder for Link Thumbnail (Video/GIF/Image) */}
                                                        <div className={`text-4xl ${isDark ? 'text-gray-700' : 'text-gray-200'}`}>🔗</div>

                                                        <button className={`absolute top-2 right-2 h-7 w-7 flex items-center justify-center border-2 border-blue-900 rounded-[4px] z-10 transition-colors ${isDark ? 'bg-[#111C44] hover:bg-red-900/20' : 'bg-white hover:bg-red-50'}`}
                                                            onClick={() => {
                                                                const newL = [...links];
                                                                newL.splice(idx, 1);
                                                                setLinks(newL);
                                                            }}
                                                        >
                                                            <span className="text-sm font-bold text-red-600">X</span>
                                                        </button>
                                                    </div>

                                                    {/* Title & URL Footer with Visibility */}
                                                    <div className="w-full bg-[#666666] text-white py-1.5 px-2 flex flex-col justify-center">
                                                        <div className="flex items-center justify-between gap-1 w-full">
                                                            <div className="text-[10px] font-bold truncate flex-1" title={lnk.title}>{lnk.title}</div>
                                                            <div className="flex-shrink-0 scale-75 origin-right">
                                                                <OrangeToggle
                                                                    checked={lnk.visible}
                                                                    onChange={() => handleToggleMediaVisibility("links", idx, lnk.visible)}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="text-[8px] truncate opacity-80 mt-0.5">
                                                            <a href={lnk.url} target="_blank" className="underline text-blue-200">Open Link ↗</a>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )
                            }
                        </div >
                    )}

                    {/* DEEP CHILD LIST VIEW */}
                    {/* DEEP CHILD LIST VIEW - MATCHING EXACT SCREENSHOT */}
                    {
                        activeView === 'deepList' && (
                            <div className="mb-8 pt-6">
                                {/* Header with Divide Line */}
                                <div className={`pb-3 border-b mb-6 ${isDark ? 'border-gray-800' : 'border-gray-300'}`}>
                                    <div className="flex items-center gap-4">
                                        <button onClick={handleBack} className={`p-1 rounded-full transition-colors ${isDark ? 'hover:bg-gray-800 text-white' : 'hover:bg-gray-100 text-black'}`}>
                                            <ArrowLeft size={24} />
                                        </button>
                                        <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-blue-950'}`}>
                                            Deep Child Category Management
                                        </h3>
                                    </div>
                                </div>

                                {/* Breadcrumb Chip */}
                                <div className="flex justify-center mb-6">
                                    <div className="bg-[#F3E8FF] border border-purple-200 rounded px-3 py-1 flex items-center gap-2 text-[10px] font-semibold text-gray-600">
                                        <span>1_e449</span>
                                        <span>→</span>
                                        <span>Priya</span>
                                    </div>
                                </div>

                                {(selectedChildCategoryId) && (
                                    <CategoryList
                                        type="deep"
                                        filterId={selectedChildCategoryId}
                                         onItemClick={handleDeepCategoryClick} 
                                        onToggleVisibility={handleToggleDeep}
                                        onDeleteClick={(item: any) => deleteDeepChildCategory(item.id || item._id)}
                                        onEditClick={handleEditDeep}
                                    />
                                )}

                                {/* ACTION BUTTONS: Darker Gray Background */}
                                <div className="mt-8 px-2 space-y-4">
                                    <div className="flex justify-between gap-4">
                                        <button className="flex-1 bg-[#E0E0E0] text-[#D00000] font-bold py-3 rounded-xl shadow-sm hover:bg-gray-300 transition-colors text-sm">
                                            Add Video
                                        </button>
                                        <button
                                            onClick={() => toggleForm('deep')}
                                            className="flex-1 bg-[#E0E0E0] text-[#D00000] font-bold py-3 rounded-xl shadow-sm hover:bg-gray-300 transition-colors text-sm"
                                        >
                                            Add Category
                                        </button>
                                    </div>

                                    {/* Videos Label Button: Outlined Blue */}
                                    <div className="w-full">
                                        <button className={`w-[100px] font-bold py-2 rounded-lg border-2 text-center text-sm shadow-sm transition-colors ${isDark ? 'bg-[#1B2559] text-white border-blue-900' : 'bg-white text-blue-950 border-blue-900'}`}>
                                            Videos
                                        </button>
                                    </div>
                                </div>

                                {/* VIDEO LIST - REFINED CARDS */}
                                <div className="flex gap-4 overflow-x-auto px-2 pb-4 mt-2">
                                    {videos.length === 0 ? (
                                        <div className="text-gray-400 text-sm italic p-2">No videos added yet.</div>
                                    ) : (
                                        videos.map((video, idx) => (
                                            <div key={video.id} className={`min-w-[140px] w-[140px] h-[200px] rounded-lg shadow-sm border overflow-hidden relative flex flex-col flex-shrink-0 transition-colors ${isDark ? 'bg-[#111C44] border-gray-800' : 'bg-white border-gray-200'}`}>
                                                <div className={`flex-1 w-full relative p-2 flex items-center justify-center ${isDark ? 'bg-[#1B2559]' : 'bg-white'}`}>
                                                    {/* Thumbnail or Icon */}
                                                    <div className="w-full h-full flex items-center justify-center overflow-hidden group bg-black relative">
                                                        {video.url ? (
                                                            <>
                                                                {(() => {
                                                                    const cleanUrl = sanitizeUrl(video.url);
                                                                    const ytId = cleanUrl.match(/^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/)?.[2];
                                                                    if (ytId) {
                                                                        return <img src={`https://img.youtube.com/vi/${ytId}/0.jpg`} className="w-full h-full object-cover" alt="Video" />;
                                                                    }
                                                                    return (
                                                                        <div className="w-full h-full relative">
                                                                            <video src={cleanUrl} className="w-full h-full object-cover" preload="metadata" />
                                                                        </div>
                                                                    );
                                                                })()}
                                                                <div
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        setPreviewVideoUrl(video.url || null);
                                                                    }}
                                                                    className="absolute inset-0 bg-black/10 group-hover:bg-black/30 transition-colors flex items-center justify-center cursor-pointer"
                                                                >
                                                                    <div className="h-8 w-8 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/50 text-white shadow-lg group-hover:scale-110 transition-transform">
                                                                        <span className="text-sm">▶</span>
                                                                    </div>
                                                                </div>
                                                            </>
                                                        ) : (
                                                            <div className="h-12 w-12 bg-gray-200 rounded-full flex items-center justify-center text-gray-500">
                                                                <span className="text-lg">▶</span>
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* X Button */}
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setDeleteMediaInfo({
                                                                type: 'videos',
                                                                index: idx,
                                                                dbIndex: video.dbIndex,
                                                                title: video.title
                                                            });
                                                        }}
                                                        className={`absolute top-2 right-2 h-7 w-7 flex items-center justify-center border-2 border-blue-900 rounded-[4px] z-10 transition-colors ${isDark ? 'bg-[#111C44] hover:bg-red-900/20' : 'bg-white hover:bg-red-50'}`}
                                                    >
                                                        <span className="text-sm font-bold text-red-600">X</span>
                                                    </button>
                                                </div>
                                                {/* Footer with Title and Visibility */}
                                                <div className="w-full bg-[#666666] text-white py-1.5 px-2 flex items-center justify-between gap-1">
                                                    <div className="truncate font-mono text-[10px] flex-1" title={video.title}>
                                                        {video.title}
                                                    </div>
                                                    <div className="flex-shrink-0 scale-75 origin-right">
                                                        <OrangeToggle
                                                            checked={video.visible}
                                                            onChange={() => handleToggleMediaVisibility("videos", idx, video.visible)}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        )
                    }

                    {/* SUB DEEP CHILD LIST VIEW */}
                  
{/* SUB DEEP CHILD LIST VIEW - FIXED */}
{activeView === 'subDeepList' && (
    <div className="mb-8 pt-6">
        <div className="flex items-center gap-4 mb-8">
            <button onClick={handleBack} className={`p-1 rounded-full transition-colors ${isDark ? 'hover:bg-gray-800 text-white' : 'hover:bg-gray-200 text-black'}`}>
                <ArrowLeft size={28} />
            </button>
            <div>
                <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-blue-950'}`}>
                    {selectedDeepCategoryName || "Deep Category"}
                </h3>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    {selectedChildCategoryName} • {selectedMainCategoryName}
                </p>
            </div>
        </div>
        
        {selectedDeepCategoryId && (
            <div className="space-y-4">
                <div className="flex justify-end">
                    <button
                        onClick={() => toggleForm('subDeep')}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        <Plus size={20} />
                        Add Sub Deep Category
                    </button>
                </div>
                
                {/* ✅ IMPORTANT - filterId = selectedDeepCategoryId, NOT selectedDeepChildCategoryId */}
                <CategoryList
                    type="subDeep"
                    filterId={selectedDeepCategoryId}  // 🔥 FIXED: DEEP CATEGORY ID SE FILTER
                    onDeleteClick={handleDeleteSubDeep}
                    onToggleVisibility={handleToggleSubDeep}
                    onEditClick={handleEditSubDeep}
                    // ✅ Optional: Data pass karo directly agar state update slow ho
                    // dataOverride={subDeepChildCategories}
                />
                
                {/* ✅ DEBUG: Show count */}
                <div className="text-xs text-gray-500 mt-2">
                    Total Sub Deep Categories: {subDeepChildCategories?.length || 0}
                </div>
            </div>
        )}
    </div>
)}

                    {
                        (activeView && activeForm) && (
                            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                                <div className={`relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl transition-all border ${isDark ? 'bg-[#0B1437] border-gray-800' : 'bg-white border-gray-100'}`}>
                                    <button
                                        onClick={() => toggleForm(activeForm)}
                                        className="absolute right-4 top-4 p-2 text-gray-500 hover:text-gray-700 z-10"
                                    >
                                        <span className="text-2xl">&times;</span>
                                    </button>

                                    <div className="p-6">
                                        {activeForm === 'subDeep' && (
                                            <SubDeepChildCategoryForm
                                                initialDeepChildCategoryId={selectedDeepChildCategoryId || undefined}
                                                editingCategory={editingSubDeepChildCategory}
                                                onSuccess={() => {
                                                    if (selectedMainCategoryId && selectedChildCategoryId && selectedDeepChildCategoryId) {
                                                        fetchSubDeepChildCategories(selectedMainCategoryId, selectedChildCategoryId, selectedDeepChildCategoryId, selectedSubCategoryId);
                                                    }
                                                    toggleForm('subDeep');
                                                }}
                                            />
                                        )}
                                        {activeForm === 'main' && (
                                            <MainCategoryForm
                                                editingCategory={editingMainCategory}
                                                onSuccess={() => {
                                                    fetchMainCategories();
                                                    toggleForm('main');
                                                }}
                                            />
                                        )}
                                        {activeForm === 'sub' && (
                                            <SubCategoryForm
                                                editingCategory={editingSubCategory}
                                                onSuccess={() => {
                                                    if (selectedMainCategoryId) fetchSubCategories(selectedMainCategoryId);
                                                    toggleForm('sub');
                                                }}
                                            />
                                        )}
                                        {activeForm === 'child' && <ChildCategoryForm
                                            editingCategory={editingChildCategory}
                                            onSuccess={() => {
                                                if (selectedMainCategoryId) fetchChildCategories(selectedMainCategoryId, selectedSubCategoryId);
                                                toggleForm('child');
                                            }} />}
                                        {activeForm === 'deep' && (
                                            <DeepChildCategoryForm
                                                initialChildCategoryId={selectedChildCategoryId || undefined}
                                                editingCategory={editingDeepChildCategory}
                                                onSuccess={() => {
                                                    if (selectedMainCategoryId && selectedChildCategoryId) {
                                                        fetchDeepChildCategories(selectedMainCategoryId, selectedChildCategoryId, selectedSubCategoryId);
                                                    }
                                                    toggleForm('deep');
                                                }}
                                            />
                                        )}
                                    </div>
                                </div>
                            </div>
                        )
                    }

                    {/* ADD VIDEO MODAL */}
                    {
                        showVideoModal && (
                            <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4">
                                <div className="w-full max-w-[400px] bg-white rounded-xl shadow-2xl p-4 relative max-h-[90vh] overflow-y-auto">
                                    {previewVideoUrl ? (
                                        <div className="flex flex-col">
                                            <div className="flex justify-between items-center mb-4">
                                                <h3 className="text-lg font-bold text-gray-900">Preview</h3>
                                                <button
                                                    onClick={() => setPreviewVideoUrl(null)}
                                                    className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-600 transition-colors"
                                                >
                                                    <X size={20} />
                                                </button>
                                            </div>
                                            <div className="w-full aspect-video bg-black rounded-lg overflow-hidden relative shadow-inner">
                                                {(previewVideoUrl && (previewVideoUrl.includes("youtube.com") || previewVideoUrl.includes("youtu.be"))) ? (
                                                    <iframe
                                                        src={`https://www.youtube.com/embed/${previewVideoUrl.split('v=')[1]?.split('&')[0] || previewVideoUrl.split('/').pop()}?autoplay=1&mute=1&modestbranding=1&rel=0&iv_load_policy=3&controls=1&disablekb=1`}
                                                        className="w-full h-full border-0"
                                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                        allowFullScreen
                                                    />
                                                ) : (
                                                    <video
                                                        src={previewVideoUrl || ""}
                                                        controls
                                                        autoPlay
                                                        className="w-full h-full object-contain"
                                                    />
                                                )}
                                            </div>
                                            <button
                                                onClick={() => setPreviewVideoUrl(null)}
                                                className="w-full mt-4 bg-gray-900 text-white font-bold py-3 rounded-lg shadow hover:bg-gray-800 transition-colors"
                                            >
                                                Close Preview
                                            </button>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="flex justify-between items-center mb-6">
                                                <h3 className="text-xl font-bold text-blue-950">Add Videos</h3>
                                                <button onClick={() => setShowVideoModal(false)} className="text-gray-400 hover:text-gray-600">
                                                    <X size={24} />
                                                </button>
                                            </div>

                                            {/* Form Fields */}
                                            <div className="space-y-4">
                                                {/* 1. Section Title */}
                                                <div>
                                                    <label className="block text-sm font-bold text-gray-700 mb-1">Section Title</label>
                                                    <div className="flex items-center gap-2">
                                                        <input
                                                            type="text"
                                                            value={videoGroupTitle}
                                                            onChange={(e) => setVideoGroupTitle(e.target.value)}
                                                            placeholder="e.g., Installation Videos"
                                                            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                                                        />
                                                        <div className="flex flex-col items-center">
                                                            <span className="text-[10px] text-gray-500 mb-1">Visible</span>
                                                            <OrangeToggle
                                                                checked={videoGroupTitleVisible}
                                                                onChange={() => setVideoGroupTitleVisible(!videoGroupTitleVisible)}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* 2. Add Thumbnail - HIDDEN FOR NOW */}
                                                {/* 
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Add Thumbnail</label>
                                        <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl p-6 hover:border-purple-500 hover:bg-purple-50 cursor-pointer transition-all">
                                            <span className="text-sm font-bold text-purple-600">Choose Thumbnail</span>
                                            <input type="file" className="hidden" accept="image/*" multiple onChange={handleVideoThumbnailSelect} />
                                        </label>
                                    </div>
                                    */}

                                                {/* 3. Add Video (Upload or Link) */}
                                                <div>
                                                    <label className="block text-sm font-bold text-gray-700 mb-2">Add Video</label>
                                                    <div className="space-y-3">
                                                       {/* FILE UPLOAD */}
{/* Image Upload Box */}
{/* <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl p-6 hover:border-blue-500 hover:bg-blue-50 cursor-pointer transition-all">
    <span className="text-sm font-bold text-blue-600">Choose Images</span>
    <input
        type="file"
        className="hidden"
        accept="image/*"
        multiple
        onChange={(e) => {
            if (e.target.files) {
                const newFiles = Array.from(e.target.files).map(file => ({
                    id: Math.random().toString(36).substr(2, 9),
                    file,
                    url: "",
                    title: file.name.replace(/\.[^/.]+$/, ""),
                    visible: false,
                    previewUrl: URL.createObjectURL(file)
                }));

                setPendingImages(prev => [...prev, ...newFiles]);
            }
        }}
    />
    Enter Image Url
    <input type="url" placeholder="Enter your imGE URL "  />
</label> */}


{/* OR Divider */}
{/* <div className="flex items-center justify-center my-3">
    <div className="h-px bg-gray-300 flex-1" />
    <span className="px-2 text-xs text-gray-400 font-semibold">OR</span>
    <div className="h-px bg-gray-300 flex-1" />
</div> */}

{/* URL Input Section */}
{/* <div className="flex gap-2">
    <input
        type="text"
        value={imageUrlInput}
        onChange={(e) => setImageUrlInput(e.target.value)}
        placeholder="Paste Image URL here..."
        className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
    />

    <button
        type="button"
        onClick={() => {
            if (!imageUrlInput.trim()) return;

            setPendingImages(prev => [
                ...prev,
                {
                    id: Math.random().toString(36).substr(2, 9),
                    file: null,
                    url: imageUrlInput.trim(),
                    title: "Image from URL",
                    visible: false,
                    previewUrl: imageUrlInput.trim()
                }
            ]);

            setImageUrlInput("");
        }}
        className="bg-blue-600 text-white px-4 rounded-lg text-sm font-bold hover:bg-blue-700"
    >
        Add
    </button>
</div> */}


                                                        <div className="flex gap-2">
                                                            <input
                                                                type="text"
                                                                value={videoLinkInput}
                                                                onChange={(e) => setVideoLinkInput(e.target.value)}
                                                                onKeyDown={(e) => {
                                                                    if (e.key === 'Enter' && videoLinkInput.trim()) {
                                                                        setPendingVideos(prev => [...prev, {
                                                                            id: Math.random().toString(36).substr(2, 9),
                                                                            file: null,
                                                                            title: "External Video",
                                                                            visible: false,
                                                                            url: videoLinkInput.trim()
                                                                        }]);
                                                                        setVideoLinkInput("");
                                                                    }
                                                                }}
                                                                placeholder="Paste YouTube or Video Link here..."
                                                                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 bg-white"
                                                            />
                                                            <button
                                                                onClick={() => {
                                                                    if (videoLinkInput.trim()) {
                                                                        setPendingVideos(prev => [...prev, {
                                                                            id: Math.random().toString(36).substr(2, 9),
                                                                            file: null,
                                                                            title: "External Video",
                                                                            visible: false,
                                                                            url: videoLinkInput.trim()
                                                                        }]);
                                                                        setVideoLinkInput("");
                                                                    }
                                                                }}
                                                                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors"
                                                            >
                                                                Add
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Pending & Preview Grid */}
                                                <div className="grid grid-cols-2 gap-3 max-h-[350px] overflow-y-auto pr-1 mt-2">
                                                    {/* 1. Live Link Draft Card (Shows immediately when typing/pasting) */}
                                                    {videoLinkInput && (
                                                        <div
                                                            onClick={() => setPreviewVideoUrl(videoLinkInput)}
                                                            className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden border-2 border-blue-400 shadow-md animate-pulse cursor-pointer group"
                                                        >
                                                            {(() => {
                                                                const ytId = videoLinkInput.match(/^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/)?.[2];
                                                                return ytId ? (
                                                                    <img src={`https://img.youtube.com/vi/${ytId}/0.jpg`} className="w-full h-full object-cover opacity-70" alt="Draft" />
                                                                ) : (
                                                                    <div className="w-full h-full flex items-center justify-center bg-blue-50">
                                                                        <div className="text-2xl opacity-40">🎥</div>
                                                                    </div>
                                                                );
                                                            })()}
                                                            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                                <div className="bg-white/20 backdrop-blur-md p-1.5 rounded-full border border-white/50 text-white text-[10px] font-bold">Click to Preview</div>
                                                            </div>
                                                            <button
                                                                onClick={(e) => { e.stopPropagation(); setVideoLinkInput(""); }}
                                                                className="absolute top-1 right-1 h-5 w-5 bg-white/90 rounded-full flex items-center justify-center shadow-sm hover:bg-red-500 hover:text-white transition-colors z-10"
                                                            >
                                                                <X size={12} />
                                                            </button>
                                                        </div>
                                                    )}

                                                    {/* 2. Added Pending Videos */}
                                                    {pendingVideos.map((video, idx) => (
                                                        <div key={video.id} className="group relative aspect-video bg-white rounded-lg overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-all">
                                                            {/* Thumbnail area */}
                                                            <div
                                                                onClick={() => setPreviewVideoUrl(video.url || video.previewUrl || null)}
                                                                className="w-full h-full bg-black relative flex items-center justify-center cursor-pointer"
                                                            >
                                                                {video.url && (video.url.includes("youtube.com") || video.url.includes("youtu.be")) ? (
                                                                    <img
                                                                        src={`https://img.youtube.com/vi/${video.url.match(/^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/)?.[2] || ""}/0.jpg`}
                                                                        className="w-full h-full object-cover"
                                                                        alt="Pending"
                                                                    />
                                                                ) : video.previewUrl ? (
                                                                    <video src={video.previewUrl} className="w-full h-full object-cover" />
                                                                ) : (
                                                                    <div className="text-2xl text-white/50">▶</div>
                                                                )}

                                                                {/* Hover Overlay */}
                                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                                    <div className="bg-white/20 backdrop-blur-md p-2 rounded-full border border-white/50 text-white">
                                                                        <div className="text-xs font-bold">Preview</div>
                                                                    </div>
                                                                </div>

                                                                {/* Delete Button */}
                                                                <button
                                                                    onClick={(e) => { e.stopPropagation(); setPendingVideos(prev => prev.filter((_, i) => i !== idx)); }}
                                                                    className="absolute top-1 right-1 h-6 w-6 bg-white/90 rounded-full flex items-center justify-center shadow-sm hover:bg-red-600 hover:text-white transition-colors z-10"
                                                                >
                                                                    <Trash2 size={12} />
                                                                </button>
                                                            </div>

                                                            {/* Title Input Footer */}
                                                            <div className="absolute bottom-0 left-0 right-0 bg-white/95 border-t border-gray-100 p-1.5 px-2">
                                                                <input
                                                                    type="text"
                                                                    value={video.title}
                                                                    onChange={(e) => {
                                                                        const newItems = [...pendingVideos];
                                                                        newItems[idx].title = e.target.value;
                                                                        setPendingVideos(newItems);
                                                                    }}
                                                                    className="w-full text-[10px] font-bold text-gray-700 bg-transparent border-none p-0 focus:ring-0 truncate"
                                                                    placeholder="Enter title..."
                                                                />
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>

                                                <button
                                                    onClick={async () => {
                                                        const videosToUpload = [...pendingVideos];

                                                        // Automatically include the link from input if user didn't press enter
                                                        if (videoLinkInput.trim()) {
                                                            videosToUpload.push({
                                                                id: Math.random().toString(36).substr(2, 9),
                                                                file: null,
                                                                title: "External Video",
                                                                visible: false,
                                                                url: videoLinkInput.trim()
                                                            });
                                                        }

                                                        if (videosToUpload.length === 0) {
                                                            alert("Please add at least one video or link first.");
                                                            return;
                                                        }

                                                        try {
                                                            for (const vid of videosToUpload) {
                                                                await addChildCategoryMedia(
                                                                    selectedMainCategoryId!,
                                                                    "videos",
                                                                    {
                                                                        videoTitle: vid.title,
                                                                        url: vid.url,
                                                                        file: vid.file || undefined,
                                                                        visibility: vid.visible
                                                                    },
                                                                    selectedSubCategoryId || undefined
                                                                );
                                                            }

                                                            // Group level metadata
                                                            await updateChildCategoryMediaGroup(
                                                                selectedMainCategoryId!,
                                                                "videos",
                                                                { name: videoGroupTitle, visibility: videoGroupTitleVisible },
                                                                selectedSubCategoryId || undefined
                                                            );

                                                            alert("✅ Success! All videos uploaded.");
                                                            setVideoLinkInput("");
                                                            setPendingVideos([]);
                                                            setShowVideoModal(false);
                                                        } catch (err) {
                                                            console.error("❌ Failed to upload some videos:", err);
                                                            alert("❌ Upload failed. Please check your connection and try again.");
                                                        }
                                                    }}
                                                    className="w-full bg-[#E57355] text-white font-bold py-3.5 rounded-xl shadow-lg mt-2"
                                                >
                                                    Upload
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        )
                    }


                    {/* ADD IMAGE MODAL */}
                    {
//                         showImageModal && (
//                             <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4">
//                                 <div className="w-full max-w-[310px] bg-white rounded-xl shadow-2xl p-4 relative max-h-[90vh] overflow-y-auto">
//                                     <div className="flex justify-between items-center mb-6">
//                                         <h3 className="text-xl font-bold text-blue-950">Add Images</h3>
//                                         <button onClick={() => setShowImageModal(false)} className="text-gray-400 hover:text-gray-600">
//                                             <X size={24} />
//                                         </button>
//                                     </div>

//                                     <div className="space-y-4">
//                                         <div>
//                                             <label className="block text-sm font-bold text-gray-700 mb-1">Section Title</label>
//                                             <div className="flex items-center gap-2">
//                                                 <input
//                                                     type="text"
//                                                     value={imageGroupTitle}
//                                                     onChange={(e) => setImageGroupTitle(e.target.value)}
//                                                     placeholder="e.g., Photos"
//                                                     className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
//                                                 />
//                                             </div>
//                                         </div>

//                                         {/* <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl p-6 hover:border-blue-500 hover:bg-blue-50 cursor-pointer transition-all">
//                                             <span className="text-sm font-bold text-blue-600">Choose Images</span>
//                                             <input type="file" className="hidden" accept="image/*" multiple onChange={(e) => {
//                                                 if (e.target.files) {
//                                                     const newFiles = Array.from(e.target.files).map(file => ({
//                                                         id: Math.random().toString(36).substr(2, 9),
//                                                         file,
//                                                         title: file.name.replace(/\.[^/.]+$/, ""),
//                                                         visible: false, // Default to OFF
//                                                         previewUrl: URL.createObjectURL(file)
//                                                     }));
//                                                     setPendingImages(prev => [...prev, ...newFiles]);
//                                                 }
//                                             }} />
//                                         </label> */}
//                                         {/* FILE UPLOAD */}
// <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl p-6 hover:border-blue-500 hover:bg-blue-50 cursor-pointer transition-all">
//     <span className="text-sm font-bold text-blue-600">
//         Choose Images
//     </span>

//     <input
//         type="file"
//         className="hidden"
//         accept="image/*"
//         multiple
//         onChange={(e) => {
//             if (e.target.files) {
//                 const newFiles = Array.from(e.target.files).map(file => ({
//                     id: Math.random().toString(36).substr(2, 9),
//                     file,
//                     url: "",
//                     title: file.name.replace(/\.[^/.]+$/, ""),
//                     visible: false,
//                     previewUrl: URL.createObjectURL(file)
//                 }));

//                 setPendingImages(prev => [...prev, ...newFiles]);
//             }
//         }}
//     />
// </label>

// {/* OR Divider */}
// <div className="flex items-center justify-center my-3">
//     <div className="h-px bg-gray-300 flex-1" />
//     <span className="px-2 text-xs text-gray-400 font-semibold">OR</span>
//     <div className="h-px bg-gray-300 flex-1" />
// </div>

// {/* URL INPUT */}
// <div className="flex gap-2">
//     <input
//         type="url"
//         value={imageUrlInput}
//         onChange={(e) => setImageUrlInput(e.target.value)}
//         placeholder="Paste Image URL here..."
//         className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
//     />

//     <button
//         type="button"
//         onClick={() => {
//             if (!imageUrlInput.trim()) return;

//             setPendingImages(prev => [
//                 ...prev,
//                 {
//                     id: Math.random().toString(36).substr(2, 9),
//                     file: null,
//                     url: imageUrlInput.trim(),
//                     title: "Image from URL",
//                     visible: false,
//                     previewUrl: imageUrlInput.trim()
//                 }
//             ]);

//             setImageUrlInput("");
//         }}
//         className="bg-blue-600 text-white px-4 rounded-lg text-sm font-bold hover:bg-blue-700"
//     >
//         Add
//     </button>
// </div>


//                                         <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1">
//                                             {pendingImages.map((img, idx) => (
//                                                 <div key={img.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg border border-gray-200">
//                                                     <div className="flex items-center gap-2 min-w-0 flex-1">
//                                                         <img
//                                                             src={img.previewUrl}
//                                                             className="h-8 w-8 object-cover rounded shadow-sm cursor-pointer hover:opacity-80"
//                                                             onClick={() => setPreviewImageUrl(img.previewUrl || null)}
//                                                             alt="preview"
//                                                         />
//                                                         <input
//                                                             type="text"
//                                                             value={img.title}
//                                                             onChange={(e) => {
//                                                                 const newI = [...pendingImages];
//                                                                 newI[idx].title = e.target.value;
//                                                                 setPendingImages(newI);
//                                                             }}
//                                                             className="bg-transparent text-xs font-bold w-full border-none p-0 focus:ring-0"
//                                                         />
//                                                     </div>
//                                                     <div className="flex items-center gap-2">
//                                                         <button onClick={() => setPendingImages(prev => prev.filter((_, i) => i !== idx))} className="text-red-500 p-1 hover:bg-red-50 rounded-full transition-colors">
//                                                             <Trash2 size={16} />
//                                                         </button>
//                                                     </div>
//                                                 </div>
//                                             ))}
//                                         </div>

//                                         <button
//                                             onClick={async () => {
//                                                 for (const img of pendingImages) {
//                                                     await addChildCategoryMedia(
//                                                         selectedMainCategoryId!,
//                                                         "images",
//                                                         {
//                                                             imageTitle: img.title,
//                                                             file: img.file || undefined,
//                                                             visibility: img.visible
//                                                         },
//                                                         selectedSubCategoryId || undefined
//                                                     );
//                                                 }
//                                                 await updateChildCategoryMediaGroup(
//                                                     selectedMainCategoryId!,
//                                                     "images",
//                                                     { name: imageGroupTitle, visibility: imageGroupTitleVisible },
//                                                     selectedSubCategoryId || undefined
//                                                 );
//                                                 setShowImageModal(false);
//                                                 setPendingImages([]);
//                                                 fetchCurrentMedia();
//                                             }}
//                                             className="w-full bg-[#E57355] text-white font-bold py-3.5 rounded-xl shadow-lg mt-2 active:scale-[0.98] transition-all"
//                                         >
//                                             Upload
//                                         </button>
//                                     </div>
//                                 </div>
//                             </div>
//                         )
showImageModal && (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4">
        <div className="w-full max-w-[310px] bg-white rounded-xl shadow-2xl p-4 relative max-h-[90vh] overflow-y-auto">

            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-blue-950">Add Images</h3>
                <button
                    onClick={() => setShowImageModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                >
                    <X size={24} />
                </button>
            </div>

            <div className="space-y-4">

                {/* SECTION TITLE */}
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">
                        Section Title
                    </label>
                    <input
                        type="text"
                        value={imageGroupTitle}
                        onChange={(e) => setImageGroupTitle(e.target.value)}
                        placeholder="e.g., Photos"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* FILE UPLOAD */}
                <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl p-6 hover:border-blue-500 hover:bg-blue-50 cursor-pointer transition-all">
                    <span className="text-sm font-bold text-blue-600">
                        Choose Images
                    </span>

                    <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        multiple
                        onChange={(e) => {
                            if (!e.target.files) return;

                            const newFiles = Array.from(e.target.files).map(file => ({
                                id: Math.random().toString(36).substring(2, 9),
                                file,
                                url: "",
                                title: file.name.replace(/\.[^/.]+$/, ""),
                                visible: false,
                                previewUrl: URL.createObjectURL(file)
                            }));

                            setPendingImages(prev => [...prev, ...newFiles]);
                        }}
                    />
                </label>

                {/* OR */}
                <div className="flex items-center justify-center my-3">
                    <div className="h-px bg-gray-300 flex-1" />
                    <span className="px-2 text-xs text-gray-400 font-semibold">OR</span>
                    <div className="h-px bg-gray-300 flex-1" />
                </div>

                {/* URL INPUT */}
                <div className="flex gap-2">
                    <input
                        type="url"
                        value={imageUrlInput}
                        onChange={(e) => setImageUrlInput(e.target.value)}
                        placeholder="Paste Image URL here..."
                        className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                    />

                    <button
                        type="button"
                        onClick={() => {
                            if (!imageUrlInput.trim()) return;

                            setPendingImages(prev => [
                                ...prev,
                                {
                                    id: Math.random().toString(36).substring(2, 9),
                                    file: null,
                                    url: imageUrlInput.trim(),
                                    title: "Image from URL",
                                    visible: false,
                                    previewUrl: imageUrlInput.trim()
                                }
                            ]);

                            setImageUrlInput("");
                        }}
                        className="bg-blue-600 text-white px-4 rounded-lg text-sm font-bold hover:bg-blue-700"
                    >
                        Add
                    </button>
                </div>

                {/* PREVIEW LIST */}
                <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1">
                    {pendingImages.map((img, idx) => (
                        <div
                            key={img.id}
                            className="flex items-center justify-between p-2 bg-gray-50 rounded-lg border border-gray-200"
                        >
                            <div className="flex items-center gap-2 flex-1 min-w-0">
                                <img
                                    src={img.previewUrl}
                                    className="h-8 w-8 object-cover rounded shadow-sm"
                                    alt="preview"
                                />
                                <input
                                    type="text"
                                    value={img.title}
                                    onChange={(e) => {
                                        const newArr = [...pendingImages];
                                        newArr[idx].title = e.target.value;
                                        setPendingImages(newArr);
                                    }}
                                    className="bg-transparent text-xs font-bold w-full border-none p-0 focus:ring-0"
                                />
                            </div>

                            <button
                                onClick={() =>
                                    setPendingImages(prev =>
                                        prev.filter((_, i) => i !== idx)
                                    )
                                }
                                className="text-red-500 p-1 hover:bg-red-50 rounded-full"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    ))}
                </div>

                {/* ✅ FIXED UPLOAD BUTTON */}
                <button
                    onClick={async () => {

                        if (!selectedMainCategoryId) {
                            alert("Main category missing");
                            return;
                        }

                        const validImages = pendingImages.filter(
                            (img) => img.file || (img.url && img.url.trim() !== "")
                        );

                        if (validImages.length === 0) {
                            alert("Please add at least one image (file or URL)");
                            return;
                        }

                        try {

                            for (const img of validImages) {

                                await addChildCategoryMedia(
                                    selectedMainCategoryId,
                                    "images",
                                    {
                                        imageTitle: img.title || "Untitled Image",
                                        file: img.file ? img.file : undefined,
                                        url: img.file ? undefined : img.url?.trim(),
                                        visibility: img.visible ?? false
                                    },
                                    selectedSubCategoryId || undefined
                                );
                            }

                            await updateChildCategoryMediaGroup(
                                selectedMainCategoryId,
                                "images",
                                {
                                    name: imageGroupTitle || "Images",
                                    visibility: imageGroupTitleVisible
                                },
                                selectedSubCategoryId || undefined
                            );

                            setPendingImages([]);
                            setImageUrlInput("");
                            setShowImageModal(false);

                            await fetchCurrentMedia();

                            alert("✅ Images uploaded successfully!");

                        } catch (error) {
                            console.error("Upload failed:", error);
                            alert("Upload failed. Check console.");
                        }

                    }}
                    className="w-full bg-[#E57355] text-white font-bold py-3.5 rounded-xl shadow-lg mt-2 active:scale-[0.98] transition-all"
                >
                    Upload
                </button>

            </div>
        </div>
    </div>
)

                    }

                    {/* OVERLAYS */}
                    {
                        previewVideoUrl && (
                            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4" onClick={() => setPreviewVideoUrl(null)}>
                                <div className="relative w-full max-w-4xl max-h-screen aspect-video bg-black rounded-lg overflow-hidden" onClick={e => e.stopPropagation()}>
                                    <button onClick={() => setPreviewVideoUrl(null)} className="absolute top-4 right-4 text-white z-50 bg-black/50 rounded-full p-2 hover:bg-red-600">
                                        <X size={24} />
                                    </button>
                                    {(() => {
                                        const cleanUrl = sanitizeUrl(previewVideoUrl);
                                        if (cleanUrl.includes("youtube.com") || cleanUrl.includes("youtu.be")) {
                                            const videoId = cleanUrl.split('v=')[1]?.split('&')[0] || cleanUrl.split('/').pop();
                                            return (
                                                <iframe
                                                    src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&modestbranding=1&rel=0&iv_load_policy=3&controls=1&disablekb=1`}
                                                    className="w-full h-full border-0"
                                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                    allowFullScreen
                                                />
                                            );
                                        } else {
                                            return <video src={cleanUrl} controls autoPlay muted className="w-full h-full object-contain" />;
                                        }
                                    })()}
                                </div>
                            </div>
                        )
                    }

                    {
                        previewImageUrl && (
                            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4" onClick={() => setPreviewImageUrl(null)}>
                                <div className="relative w-full max-w-4xl h-full flex items-center justify-center" onClick={e => e.stopPropagation()}>
                                    <button onClick={() => setPreviewImageUrl(null)} className="absolute top-4 right-4 text-white z-50 bg-black/50 rounded-full p-2 hover:bg-red-600">
                                        <X size={24} />
                                    </button>
                                    <img src={previewImageUrl} alt="Preview" className="max-w-full max-h-full object-contain rounded-lg shadow-2xl" />
                                </div>
                            </div>
                        )
                    }

                    {/* ADD MISSING SERVICES MODAL */}
                    {
                        showAddMissingModal && (
                            <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4">
                                <div className="w-full max-w-sm bg-white rounded-xl shadow-2xl p-6">
                                    <h3 className="text-xl font-bold text-blue-950 mb-4">Add Missing Services</h3>
                                    <div className="space-y-2 max-h-[300px] overflow-y-auto mb-6">
                                        {REQUIRED_SERVICES.filter(svc => !childCategories.some(cat => cat.name.toLowerCase() === svc.toLowerCase())).map(svc => (
                                            <div key={svc} className="p-3 bg-gray-50 rounded-lg border border-gray-100 font-bold text-gray-700">{svc}</div>
                                        ))}
                                    </div>
                                    <div className="flex gap-3">
                                        <button onClick={() => setShowAddMissingModal(false)} className="flex-1 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl">Cancel</button>
                                        <button
                                            onClick={async () => {
                                                const missing = REQUIRED_SERVICES.filter(svc => !childCategories.some(cat => cat.name.toLowerCase() === svc.toLowerCase()));
                                                for (const svc of missing) {
                                                    await addChildCategory({ name: svc, mainCategoryId: selectedMainCategoryId || "", subCategoryId: selectedSubCategoryId || undefined, visible: false });
                                                }
                                                if (selectedMainCategoryId) fetchChildCategories(selectedMainCategoryId, selectedSubCategoryId);
                                                setShowAddMissingModal(false);
                                            }}
                                            className="flex-1 py-3 bg-blue-600 text-white font-bold rounded-xl"
                                        >
                                            Add All
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )
                    }

                    {/* DELETE MEDIA MODAL */}
                    {
                        deleteMediaInfo && (
                            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4">
                                <div className="w-full max-w-xs bg-white rounded-2xl shadow-2xl p-6 text-center">
                                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Trash2 size={32} className="text-red-600" />
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-2">Delete Media?</h3>
                                    <p className="text-sm text-gray-500 mb-6">Are you sure you want to delete <br /><b>{deleteMediaInfo.title}</b>?</p>
                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => setDeleteMediaInfo(null)}
                                            disabled={isDeletingMedia}
                                            className={`flex-1 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl ${isDeletingMedia ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleConfirmDeleteMedia}
                                            disabled={isDeletingMedia}
                                            className={`flex-1 py-3 bg-red-600 text-white font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 ${isDeletingMedia ? 'opacity-70 cursor-not-allowed' : 'hover:bg-red-700'}`}
                                        >
                                            {isDeletingMedia ? (
                                                <>
                                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                    Deleting...
                                                </>
                                            ) : (
                                                'Delete'
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )
                    }
                </>
            )}
        </div>
    );
};

interface MenuButtonProps {
    label: string;
    onClick: () => void;
    active: boolean;
    colorClass: string;
    activeColorClass: string;
}

const MenuButton: React.FC<MenuButtonProps> = ({ label, onClick, active, colorClass, activeColorClass }) => (
    <button
        onClick={onClick}
        className={`flex h-16 w-full items-center justify-center rounded-xl text-lg font-semibold text-white shadow-sm transition-transform hover:scale-105 ${active ? activeColorClass : colorClass}`}
    >
        {label}
    </button>
)

export default InventoryDashboard;
