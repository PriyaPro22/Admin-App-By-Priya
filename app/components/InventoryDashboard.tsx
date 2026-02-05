"use client";

import React, { useState, useEffect } from "react";

import { Plus, List, ArrowLeft, Trash2, Edit2, Search } from 'lucide-react';
import MainCategoryForm from "./forms/MainCategoryForm";
import SubCategoryForm from "./forms/SubCategoryForm";
import ChildCategoryForm from "./forms/ChildCategoryForm";
import DeepChildCategoryForm from "./forms/DeepChildCategoryForm";
import SubDeepChildCategoryForm from "./forms/SubDeepChildCategoryForm";
import { useCategory, CategoryProvider } from "../context/CategoryContext";
import CategoryList from "./CategoryList";

const InventoryDashboard = () => {
    const [activeForm, setActiveForm] = useState<string | null>(null);
    const [activeView, setActiveView] = useState<string | null>(null); // 'mainList', 'subList', 'childList'

    // Navigation State
    const [selectedMainCategoryId, setSelectedMainCategoryId] = useState<string | null>(null);
    const [selectedMainCategoryName, setSelectedMainCategoryName] = useState<string | null>(null);

    const [selectedSubCategoryId, setSelectedSubCategoryId] = useState<string | null>(null);
    const [selectedSubCategoryName, setSelectedSubCategoryName] = useState<string | null>(null);

    const [selectedChildCategoryId, setSelectedChildCategoryId] = useState<string | null>(null);
    const [selectedChildCategoryName, setSelectedChildCategoryName] = useState<string | null>(null);

    const [selectedDeepChildCategoryId, setSelectedDeepChildCategoryId] = useState<string | null>(null);
    const [selectedDeepChildCategoryName, setSelectedDeepChildCategoryName] = useState<string | null>(null);

    const [editingMainCategory, setEditingMainCategory] = useState<any | null>(null);
    const [editingSubCategory, setEditingSubCategory] = useState<any | null>(null);
    const [editingChildCategory, setEditingChildCategory] = useState<any | null>(null);
    const [editingDeepChildCategory, setEditingDeepChildCategory] = useState<any | null>(null);
    const [editingSubDeepChildCategory, setEditingSubDeepChildCategory] = useState<any | null>(null);

    const [showAddMissingModal, setShowAddMissingModal] = useState(false);
    const [showVideoModal, setShowVideoModal] = useState(false);
    const REQUIRED_SERVICES = ["Installation", "Repair", "Services", "childCatVideos"];


    // Mock Video State (Should eventually be in context or fetched)
    // Mock Video State (Should eventually be in context or fetched)
    const [videos, setVideos] = useState<string[]>(["Screen Recording...", "Ac jet service.mp4"]);

    // ✅ PENDING VIDEO UPLOAD STATE
    interface PendingVideo {
        id: string;
        file: File;
        title: string;
        visible: boolean;
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

    // ✅ Updated Images State to store full object
    const [images, setImages] = useState<PendingVideo[]>([]);

    // ✅ Updated Links State to include visibility
    const [links, setLinks] = useState<{ title: string, url: string, visible: boolean }[]>([]);

    const handleVideoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files);
            const newPending: PendingVideo[] = newFiles.map(file => ({
                id: Math.random().toString(36).substr(2, 9),
                file,
                title: file.name.replace(/\.[^/.]+$/, ""), // Default title from filename
                visible: true
            }));

            // Limit to 5 or append? User said "ek bar me 5 bhi store kr skte h". 
            // We'll append but likely backend has limits. For UI, let's just append.
            setPendingVideos(prev => [...prev, ...newPending]);
        }
    };

    const removePendingVideo = (id: string) => {
        setPendingVideos(prev => prev.filter(v => v.id !== id));
    };

    const updatePendingVideo = (id: string, field: 'title' | 'visible', value: any) => {
        setPendingVideos(prev => prev.map(v =>
            v.id === id ? { ...v, [field]: value } : v
        ));
    };

    const handleVideoSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // Here we would normally upload the files. 
        // We now have videoGroupTitle, videoGroupTitleVisible, and pendingVideos

        const newVideoNames = pendingVideos.map(v => v.title);
        setVideos(prev => [...prev, ...newVideoNames]);

        console.log("📤 Uploading Videos:", {
            groupTitle: videoGroupTitle,
            groupTitleVisible: videoGroupTitleVisible,
            videos: pendingVideos
        });

        setShowVideoModal(false);
        setPendingVideos([]); // Reset
        setVideoGroupTitle(""); // Reset
        setVideoGroupTitleVisible(true); // Reset
    };

    // ✅ IMAGE HANDLERS
    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files);
            const newPending: PendingVideo[] = newFiles.map(file => ({
                id: Math.random().toString(36).substr(2, 9),
                file,
                title: file.name.replace(/\.[^/.]+$/, ""),
                visible: true
            }));
            setPendingImages(prev => [...prev, ...newPending]);
        }
    }

    const removePendingImage = (id: string) => {
        setPendingImages(prev => prev.filter(v => v.id !== id));
    };

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
        setSelectedDeepChildCategoryName(null);
    }

    const {
        fetchMainCategories,
        fetchSubCategories,
        fetchChildCategories,
        fetchDeepChildCategories,
        fetchSubDeepChildCategories,
        addChildCategory,
        addDeepChildCategory,
        deleteMainCategory,
        deleteSubCategory,
        deleteChildCategory,
        deleteDeepChildCategory,
        deleteSubDeepChildCategory,
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
        mainCategories,
        subCategories,
        childCategories,
        deepChildCategories,
        subDeepChildCategories
    } = useCategory();

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

    const handleMainCategoryClick = (item: any) => {
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
        }
    };

    const handleSubCategoryClick = (item: any) => {
        const id = item.documentId || item._id || item.id;
        setSelectedSubCategoryId(id);
        setSelectedSubCategoryName(item.name);
        if (selectedMainCategoryId) {
            fetchChildCategories(selectedMainCategoryId, id);
        }
        setActiveView('childList');
    };

    const handleChildCategoryClick = async (item: any) => {
        if (item.isMissing) {
            // Auto-create category before navigation
            await addChildCategory({
                name: item.name,
                mainCategoryId: selectedMainCategoryId || "",
                subCategoryId: selectedSubCategoryId || undefined,
                visible: true
            });
            // Ideally we need the new ID to navigate. 
            // Since we don't have it easily without refetch, we might just fetch and stay?
            // Or assume the user will click again?
            // For now, let's create and refresh.
            if (selectedMainCategoryId) fetchChildCategories(selectedMainCategoryId, selectedSubCategoryId);
            return;
        }

        const id = item.documentId || item._id || item.id;
        setSelectedChildCategoryId(id);
        setSelectedChildCategoryName(item.firstTitle || item.name);

        if (selectedMainCategoryId) {
            // Correctly fetch Deep Child Categories (Level 4) instead of SubDeep
            fetchDeepChildCategories(
                selectedMainCategoryId,
                id, // childId
                selectedSubCategoryId
            );
        }
        setActiveView('deepList');
    };

    const handleDeepChildCategoryClick = (item: any) => {
        const id = item.documentId || item.id || item._id;
        setSelectedDeepChildCategoryId(id);
        setSelectedDeepChildCategoryName(item.firstTitle || item.name || "Deep Category");

        if (selectedMainCategoryId && selectedChildCategoryId) {
            // Correct order: mainId, childKey, deepKey, subId
            fetchSubDeepChildCategories(
                selectedMainCategoryId,
                selectedChildCategoryId,
                id,
                selectedSubCategoryId
            );
        }
        setActiveView('subDeepList');
    };

    const handleBack = () => {
        if (activeView === 'subDeepList') {
            setActiveView('deepList');
            setSelectedDeepChildCategoryId(null);
            setSelectedDeepChildCategoryName(null);
        } else if (activeView === 'deepList') {
            setActiveView('childList');
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
        setShowVideoModal(true);
    };

    // ✅ ADD IMAGE & LINK HANDLERS

    // ✅ ADD IMAGE & LINK HANDLERS
    const [showImageModal, setShowImageModal] = useState(false);
    const [showLinkModal, setShowLinkModal] = useState(false);

    const handleImageSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Prepare images with Group Title if provided
        const finalImages = pendingImages.map((img, idx) => ({
            ...img,
            title: imageGroupTitle
                ? (pendingImages.length > 1 ? `${imageGroupTitle} ${idx + 1}` : imageGroupTitle)
                : img.title
        }));

        // Append new images to existing list
        setImages(prev => [...prev, ...finalImages]);

        console.log("📤 Uploading Images:", {
            groupTitle: imageGroupTitle,
            groupTitleVisible: imageGroupTitleVisible,
            images: pendingImages
        });

        setPendingImages([]);
        setImageGroupTitle("");
        setImageGroupTitleVisible(true);
        setShowImageModal(false);
    };

    const handleLinkSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const title = formData.get('linkTitle') as string;
        const url = formData.get('linkUrl') as string;

        if (title && url) {
            setLinks([...links, { title, url, visible: newLinkVisible }]);
        }

        console.log("🔗 Adding Link:", {
            groupTitle: linkGroupTitle,
            groupTitleVisible: linkGroupTitleVisible,
            link: { title, url, visible: newLinkVisible }
        });

        setNewLinkVisible(true); // Reset to true
        setShowLinkModal(false);
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
        <div className="mx-auto max-w-4xl pb-20 bg-gray-50 min-h-screen px-4 md:px-0">
            {/* DASHBOARD HOME VIEW ... (omitted for brevity, keeping existing) */}

            {!activeView && (
                <>
                    {/* ... (existing sections) ... */}
                    {/* Keep existing sections as is */}
                    <h1 className="mb-4 text-center text-xl font-bold text-gray-900 md:text-left pt-6">Inventory Management</h1>

                    {/* ... Update/Delete Section ... */}
                    <section className="mb-6">

                        <div className="w-full">
                            <button
                                onClick={() => toggleView("mainList")}
                                className="flex h-20 w-full items-center justify-center rounded-xl 
               text-lg font-medium text-gray-700 shadow-sm 
               transition-transform hover:scale-[1.01]
               bg-gray-200 hover:bg-gray-300"
                            >
                                Category Management
                            </button>
                        </div>

                    </section>

                    {/* ... Insert Section ... (Keep as is) */}
                    <section>
                        <h2 className="mb-4 text-center text-lg font-bold text-gray-900 md:text-left">Insert new categorys</h2>
                        <div className="space-y-4">
                            {/* ... (buttons for forms) ... */}
                            <div>
                                <button onClick={() => toggleForm('main')} className={`w-full py-3 rounded-lg text-white font-bold text-lg shadow-md transition-all ${activeForm === 'main' ? 'bg-red-600' : 'bg-gray-400 hover:bg-gray-500'}`}>Manage Main Category</button>
                                {activeForm === 'main' && <div className="mt-4"><MainCategoryForm onSuccess={() => { }} /></div>}
                            </div>
                            <div>
                                <button onClick={() => toggleForm('sub')} className={`w-full py-3 rounded-lg text-white font-bold text-lg shadow-md transition-all ${activeForm === 'sub' ? 'bg-green-500' : 'bg-gray-400 hover:bg-gray-500'}`}>Manage Sub Category</button>
                                {activeForm === 'sub' && <div className="mt-4"><SubCategoryForm onSuccess={() => { }} /></div>}
                            </div>
                            <div>
                                <button onClick={() => toggleForm('child')} className={`w-full py-3 rounded-lg text-white font-bold text-lg shadow-md transition-all ${activeForm === 'child' ? 'bg-red-600' : 'bg-gray-400 hover:bg-gray-500'}`}>Manage Child Category</button>
                                {activeForm === 'child' && <div className="mt-4"><ChildCategoryForm onSuccess={() => { }} /></div>}
                            </div>
                            <div>
                                <button onClick={() => toggleForm('deep')} className={`w-full py-3 rounded-lg text-white font-bold text-lg shadow-md transition-all ${activeForm === 'deep' ? 'bg-green-500' : 'bg-gray-400 hover:bg-gray-500'}`}>Manage Deep child category</button>
                                {activeForm === 'deep' && <div className="mt-4"><DeepChildCategoryForm initialChildCategoryId={undefined} onSuccess={() => { }} /></div>}
                            </div>
                            <div>
                                <button onClick={() => toggleForm('subDeep')} className={`w-full py-3 rounded-lg text-white font-bold text-lg shadow-md transition-all ${activeForm === 'subDeep' ? 'bg-purple-600' : 'bg-gray-400 hover:bg-gray-500'}`}>Manage Sub Deep child category</button>
                                {activeForm === 'subDeep' && <div className="mt-4"><SubDeepChildCategoryForm initialDeepChildCategoryId={undefined} onSuccess={() => { }} /></div>}
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
                        <button onClick={handleBack} className="p-2 rounded-full hover:bg-gray-200 transition-colors">
                            <ArrowLeft size={24} className="text-gray-800" />
                        </button>
                        <h3 className="text-xl font-bold text-gray-900">Main Category Management</h3>
                    </div>

                    {/* Search Bar */}
                    <div className="relative mb-6">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-5 pointer-events-none">
                            <Search className="h-6 w-6 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search.."
                            className="w-full rounded-3xl bg-gray-200 py-4 pl-14 pr-6 text-lg text-gray-700 placeholder-gray-500 outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-inner"
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
                    <div className="pb-3 border-b border-gray-300 mb-6">
                        <div className="flex items-center gap-4">
                            <button onClick={handleBack} className="p-1 rounded-full hover:bg-gray-100">
                                <ArrowLeft size={24} className="text-black" />
                            </button>
                            <h3 className="text-lg font-bold text-blue-950">
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
                                className="bg-[#E0E0E0] text-[#D00000] font-bold py-3 rounded-xl shadow-sm hover:bg-gray-300 transition-colors text-sm"
                            >
                                Add Video
                            </button>
                            <button
                                onClick={() => setShowAddMissingModal(true)}
                                className="bg-[#E0E0E0] text-[#D00000] font-bold py-3 rounded-xl shadow-sm hover:bg-gray-300 transition-colors text-sm"
                            >
                                Add Category
                            </button>
                            <button
                                onClick={() => setShowImageModal(true)}
                                className="bg-[#E0E0E0] text-[#D00000] font-bold py-3 rounded-xl shadow-sm hover:bg-gray-300 transition-colors text-sm"
                            >
                                Add Image
                            </button>
                            <button
                                onClick={() => setShowLinkModal(true)}
                                className="bg-[#E0E0E0] text-[#D00000] font-bold py-3 rounded-xl shadow-sm hover:bg-gray-300 transition-colors text-sm"
                            >
                                Add Links
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
                                    onChange={() => setVideoGroupTitleVisible(!videoGroupTitleVisible)}
                                />
                            </div>
                        </div>
                    </div>

                    {/* VIDEO LIST - REFINED CARDS (HORIZONTAL SCROLL) */}
                    <div className="flex gap-4 overflow-x-auto px-2 pb-4 mt-2">
                        {videos.map((vid, idx) => (
                            <div key={idx} className="min-w-[140px] h-[200px] bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden relative flex flex-col flex-shrink-0">
                                <div className="flex-1 w-full bg-white relative p-2">
                                    <button className="absolute top-2 right-2 h-7 w-7 bg-white flex items-center justify-center border-2 border-blue-900 rounded-[4px] z-10"
                                        onClick={() => {
                                            const newV = [...videos];
                                            newV.splice(idx, 1);
                                            setVideos(newV);
                                        }}
                                    >
                                        <span className="text-sm font-bold text-red-600">X</span>
                                    </button>
                                </div>
                                <div className="w-full bg-[#666666] text-white text-[10px] py-1.5 px-2 truncate font-mono">
                                    {vid}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* IMAGES SECTION (HORIZONTAL SCROLL) */}
                    {images.length > 0 && (
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
                                        onChange={() => setImageGroupTitleVisible(!imageGroupTitleVisible)}
                                    />
                                </div>
                            </div>
                            <div className="flex gap-4 overflow-x-auto pb-4">
                                {images.map((img, idx) => (
                                    <div key={idx} className="min-w-[140px] w-[140px] h-[200px] bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden relative flex flex-col flex-shrink-0">
                                        <div className="flex-1 w-full bg-white relative p-2 flex items-center justify-center">
                                            {/* Placeholder/Actual Image */}
                                            <div className="text-4xl text-gray-200">🖼️</div>
                                            <button className="absolute top-2 right-2 h-7 w-7 bg-white flex items-center justify-center border-2 border-blue-900 rounded-[4px] z-10"
                                                onClick={() => {
                                                    const newI = [...images];
                                                    newI.splice(idx, 1);
                                                    setImages(newI);
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
                                                    onChange={() => {
                                                        const newImages = [...images];
                                                        newImages[idx] = { ...newImages[idx], visible: !newImages[idx].visible };
                                                        setImages(newImages);
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* LINKS SECTION (HORIZONTAL SCROLL) */}
                    {links.length > 0 && (
                        <div className="mt-4 px-2">
                            <div className="w-full mb-2 flex items-center gap-4">
                                <button className="w-[100px] bg-white text-blue-950 font-bold py-2 rounded-lg border-2 border-blue-900 text-center text-sm shadow-sm">
                                    Links
                                </button>
                                {/* Group Visibility Toggle */}
                                <div className="flex flex-col items-center">
                                    <span className="text-[8px] font-bold text-gray-500 uppercase">Visible</span>
                                    <OrangeToggle
                                        checked={linkGroupTitleVisible}
                                        onChange={() => setLinkGroupTitleVisible(!linkGroupTitleVisible)}
                                    />
                                </div>
                            </div>
                            <div className="flex gap-4 overflow-x-auto pb-4">
                                {links.map((lnk, idx) => (
                                    <div key={idx} className="min-w-[140px] w-[140px] h-[200px] bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden relative flex flex-col flex-shrink-0">
                                        <div className="flex-1 w-full bg-white relative p-2 flex items-center justify-center">
                                            {/* Placeholder for Link Thumbnail (Video/GIF/Image) */}
                                            <div className="text-4xl text-gray-200">🔗</div>

                                            <button className="absolute top-2 right-2 h-7 w-7 bg-white flex items-center justify-center border-2 border-blue-900 rounded-[4px] z-10"
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
                                                        onChange={() => {
                                                            const newLinks = [...links];
                                                            newLinks[idx] = { ...newLinks[idx], visible: !newLinks[idx].visible };
                                                            setLinks(newLinks);
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                            <div className="text-[8px] truncate opacity-80 mt-0.5">{lnk.url}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* DEEP CHILD LIST VIEW */}
            {/* DEEP CHILD LIST VIEW - MATCHING EXACT SCREENSHOT */}
            {activeView === 'deepList' && (
                <div className="mb-8 pt-6">
                    {/* Header with Divide Line */}
                    <div className="pb-3 border-b border-gray-300 mb-6">
                        <div className="flex items-center gap-4">
                            <button onClick={handleBack} className="p-1 rounded-full hover:bg-gray-100">
                                <ArrowLeft size={24} className="text-black" />
                            </button>
                            <h3 className="text-lg font-bold text-blue-950">
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
                            onItemClick={handleDeepChildCategoryClick}
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
                            <button className="w-[100px] bg-white text-blue-950 font-bold py-2 rounded-lg border-2 border-blue-900 text-center text-sm shadow-sm">
                                Videos
                            </button>
                        </div>
                    </div>

                    {/* VIDEO LIST - REFINED CARDS */}
                    <div className="flex gap-4 overflow-x-auto px-2 pb-4 mt-2">
                        {/* Mock Video 1 */}
                        <div className="min-w-[140px] h-[200px] bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden relative flex flex-col">
                            <div className="flex-1 w-full bg-white relative p-2">
                                {/* X Button with Blue Border */}
                                <button className="absolute top-2 right-2 h-7 w-7 bg-white flex items-center justify-center border-2 border-blue-900 rounded-[4px] z-10">
                                    <span className="text-sm font-bold text-red-600">X</span>
                                </button>
                            </div>
                            {/* Dark Footer */}
                            <div className="w-full bg-[#666666] text-white text-[10px] py-1.5 px-2 truncate font-mono">
                                VID2026012017064...
                            </div>
                        </div>
                        {/* Mock Video 2 */}
                        <div className="min-w-[140px] h-[200px] bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden relative flex flex-col">
                            <div className="flex-1 w-full bg-white relative p-2">
                                <button className="absolute top-2 right-2 h-7 w-7 bg-white flex items-center justify-center border-2 border-blue-900 rounded-[4px] z-10">
                                    <span className="text-sm font-bold text-red-600">X</span>
                                </button>
                            </div>
                            <div className="w-full bg-[#666666] text-white text-[10px] py-1.5 px-2 truncate font-mono">
                                bss inke bharose c...
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* SUB DEEP CHILD LIST VIEW */}
            {activeView === 'subDeepList' && (
                <div className="mb-8 pt-6">
                    <div className="flex items-center gap-4 mb-8">
                        <button onClick={handleBack} className="p-1 rounded-full hover:bg-gray-200">
                            <ArrowLeft size={28} className="text-black" />
                        </button>
                        <h3 className="text-xl font-bold text-blue-950">
                            {selectedDeepChildCategoryName}
                        </h3>
                    </div>
                    {selectedDeepChildCategoryId && (
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
                            <CategoryList
                                type="subDeep"
                                filterId={selectedDeepChildCategoryId}
                                onDeleteClick={handleDeleteSubDeep}
                                onToggleVisibility={handleToggleSubDeep}
                                onEditClick={handleEditSubDeep}
                            />
                        </div>
                    )}
                </div>
            )}


            {(activeView && activeForm) && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-xl">
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
            )}

            {/* ADD VIDEO MODAL */}
            {showVideoModal && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4">
                    <div className="w-full max-w-sm bg-white rounded-xl shadow-2xl p-6 relative max-h-[90vh] overflow-y-auto">
                        <h3 className="text-xl font-bold text-center text-gray-900 mb-6">Add Video</h3>
                        <form onSubmit={handleVideoSubmit} className="space-y-4">

                            {/* Group Title Field */}
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <label className="block text-sm font-bold text-gray-700">Title</label>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs text-gray-500 font-medium">Visible</span>
                                        <OrangeToggle
                                            checked={videoGroupTitleVisible}
                                            onChange={() => setVideoGroupTitleVisible(!videoGroupTitleVisible)}
                                        />
                                    </div>
                                </div>
                                <input
                                    type="text"
                                    value={videoGroupTitle}
                                    onChange={(e) => setVideoGroupTitle(e.target.value)}
                                    placeholder="Enter section title"
                                    className="w-full border rounded p-2 text-sm focus:outline-none focus:border-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Upload Video (Max 5)</label>
                                <div className="relative">
                                    <input
                                        type="file"
                                        multiple
                                        accept="video/*"
                                        onChange={handleVideoSelect}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    />
                                    <div className="w-full border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:bg-gray-50 transition-colors">
                                        <div className="text-blue-600 font-bold">Choose Videos</div>
                                        <p className="text-xs text-gray-400 mt-1">Select multiple videos to upload</p>
                                    </div>
                                </div>
                            </div>

                            {/* PREVIEW LIST (Like WhatsApp) */}
                            {pendingVideos.length > 0 && (
                                <div className="space-y-3 mt-4 border-t pt-2">
                                    {pendingVideos.map((video, index) => (
                                        <div key={video.id} className="flex items-center gap-2 bg-gray-50 p-2 rounded-lg border border-gray-200">
                                            {/* Thumbnail / Icon */}
                                            <div className="h-10 w-10 flex-shrink-0 bg-black rounded flex items-center justify-center text-white text-[10px]">
                                                ▶
                                            </div>

                                            {/* Details Input */}
                                            <div className="flex-1 min-w-0">
                                                <input
                                                    type="text"
                                                    value={video.title}
                                                    onChange={(e) => updatePendingVideo(video.id, 'title', e.target.value)}
                                                    placeholder="Video Title"
                                                    className="w-full text-sm border-b border-gray-300 bg-transparent focus:outline-none focus:border-blue-500 px-1"
                                                />
                                                <p className="text-[10px] text-gray-400 truncate mt-0.5">{video.file.name}</p>
                                            </div>

                                            {/* Visibility Toggle */}
                                            <div className="flex flex-col items-center gap-0.5">
                                                <span className="text-[8px] font-bold text-gray-500">VISIBLE</span>
                                                <OrangeToggle
                                                    checked={video.visible}
                                                    onChange={() => updatePendingVideo(video.id, 'visible', !video.visible)}
                                                />
                                            </div>

                                            {/* Delete */}
                                            <button
                                                type="button"
                                                onClick={() => removePendingVideo(video.id)}
                                                className="text-gray-400 hover:text-red-500"
                                            >
                                                &times;
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <button type="submit" className="w-full bg-[#E57355] text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2">
                                <span>Upload {pendingVideos.length > 0 ? `(${pendingVideos.length})` : ''}</span>
                            </button>
                            <button type="button" onClick={() => { setShowVideoModal(false); setPendingVideos([]); }} className="w-full text-gray-500 py-2">
                                Cancel
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* ADD IMAGE MODAL */}
            {showImageModal && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4">
                    <div className="w-full max-w-sm bg-white rounded-xl shadow-2xl p-6 relative max-h-[90vh] overflow-y-auto">
                        <h3 className="text-xl font-bold text-center text-gray-900 mb-6">Add Image</h3>
                        <form onSubmit={handleImageSubmit} className="space-y-4">

                            {/* Group Title Field */}
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <label className="block text-sm font-bold text-gray-700">Title</label>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs text-gray-500 font-medium">Visible</span>
                                        <OrangeToggle
                                            checked={imageGroupTitleVisible}
                                            onChange={() => setImageGroupTitleVisible(!imageGroupTitleVisible)}
                                        />
                                    </div>
                                </div>
                                <input
                                    type="text"
                                    value={imageGroupTitle}
                                    onChange={(e) => setImageGroupTitle(e.target.value)}
                                    placeholder="Enter section title"
                                    className="w-full border rounded p-2 text-sm focus:outline-none focus:border-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Upload Image (Max 5)</label>
                                <div className="relative">
                                    <input
                                        type="file"
                                        multiple
                                        accept="image/*"
                                        onChange={handleImageSelect}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    />
                                    <div className="w-full border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:bg-gray-50 transition-colors">
                                        <div className="text-blue-600 font-bold">Choose Images</div>
                                        <p className="text-xs text-gray-400 mt-1">Select multiple images to upload</p>
                                    </div>
                                </div>
                            </div>

                            {/* PREVIEW LIST (Compact Grid) */}
                            {pendingImages.length > 0 && (
                                <div className="grid grid-cols-3 gap-2 mt-4 border-t pt-2 max-h-[200px] overflow-y-auto">
                                    {pendingImages.map((img, index) => (
                                        <div key={img.id} className="relative bg-gray-50 p-2 rounded-lg border border-gray-200 flex flex-col items-center text-center">
                                            {/* Thumbnail / Icon */}
                                            <div className="h-10 w-10 bg-gray-200 rounded flex items-center justify-center text-gray-500 text-lg mb-1">
                                                🖼️
                                            </div>

                                            {/* Details Input */}
                                            <div className="w-full min-w-0">
                                                <div className="text-xs font-medium text-gray-900 truncate">{img.title}</div>
                                                <p className="text-[8px] text-gray-400 truncate">{img.file.name}</p>
                                            </div>

                                            {/* Delete */}
                                            <button
                                                type="button"
                                                onClick={() => removePendingImage(img.id)}
                                                className="absolute top-1 right-1 text-gray-400 hover:text-red-500 bg-white rounded-full h-4 w-4 flex items-center justify-center border border-gray-200 shadow-sm"
                                            >
                                                <span className="text-xs leading-none">&times;</span>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <button type="submit" className="w-full bg-[#E57355] text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2">
                                <span>Upload {pendingImages.length > 0 ? `(${pendingImages.length})` : ''}</span>
                            </button>
                            <button type="button" onClick={() => { setShowImageModal(false); setPendingImages([]); }} className="w-full text-gray-500 py-2">
                                Cancel
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* ADD LINK MODAL */}
            {showLinkModal && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4">
                    <div className="w-full max-w-sm bg-white rounded-xl shadow-2xl p-6">
                        <h3 className="text-xl font-bold text-center text-gray-900 mb-6">Add Link</h3>
                        <form onSubmit={handleLinkSubmit} className="space-y-4">

                            {/* Link Fields */}
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <label className="block text-sm font-bold text-gray-700">Link Title</label>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs text-gray-500 font-medium">Visible</span>
                                        <OrangeToggle
                                            checked={newLinkVisible}
                                            onChange={() => setNewLinkVisible(!newLinkVisible)}
                                        />
                                    </div>
                                </div>
                                <input type="text" name="linkTitle" placeholder="e.g. Website" className="w-full border rounded p-2" required />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">URL</label>
                                <input type="url" name="linkUrl" placeholder="https://..." className="w-full border rounded p-2" required />
                            </div>
                            <button type="submit" className="w-full bg-[#E57355] text-white font-bold py-3 rounded-lg">
                                Add
                            </button>
                            <button type="button" onClick={() => setShowLinkModal(false)} className="w-full text-gray-500 py-2">
                                Cancel
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* ADD MISSING SERVICES MODAL */}
            {showAddMissingModal && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4">
                    <div className="w-full max-w-sm bg-white rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="p-6">
                            <h3 className="text-xl font-bold text-center text-gray-900 mb-6">Add Missing Services</h3>

                            <div className="space-y-6">
                                {/* ALREADY SAVED */}
                                <div>
                                    <h4 className="text-gray-500 font-bold mb-3 text-lg">Already Saved:</h4>
                                    <div className="space-y-2">
                                        {REQUIRED_SERVICES.filter(svc =>
                                            childCategories.some(cat => cat.name === svc)
                                        ).map(svc => (
                                            <div key={svc} className="flex items-center gap-2 text-green-500 font-medium text-lg">
                                                <span>✓</span> {svc}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* ADD MISSING */}
                                <div>
                                    <h4 className="text-gray-500 font-bold mb-3 text-lg">Add Missing:</h4>
                                    <div className="space-y-3">
                                        {REQUIRED_SERVICES.filter(svc =>
                                            !childCategories.some(cat => cat.name === svc)
                                        ).length === 0 ? (
                                            <p className="text-gray-400 italic">All services added</p>
                                        ) : (
                                            <>
                                                {REQUIRED_SERVICES.filter(svc =>
                                                    !childCategories.some(cat => cat.name === svc)
                                                ).map(svc => (
                                                    <div key={svc} className="text-gray-700 font-medium ml-2">• {svc}</div>
                                                ))}
                                                <button
                                                    onClick={handleAddAllMissingServices}
                                                    className="w-full mt-4 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-3 rounded-lg transition-colors uppercase"
                                                >
                                                    ADD SERVICES
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={() => setShowAddMissingModal(false)}
                                className="mt-8 w-full bg-[#E57355] text-white font-bold py-3.5 rounded-full text-lg shadow-lg hover:bg-[#d6654a] transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
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
