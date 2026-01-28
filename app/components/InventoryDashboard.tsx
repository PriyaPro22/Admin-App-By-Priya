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

    // Mock Video State (Should eventually be in context or fetched)
    const [videos, setVideos] = useState<string[]>(["Screen Recording...", "Ac jet service.mp4"]);

    const toggleForm = (formName: string) => {
        if (activeForm === formName) {
            // Closing form
            setActiveForm(null);
            // If we have selected IDs, restore the view
            if (selectedSubCategoryId) setActiveView('childList');
            else if (selectedMainCategoryId) setActiveView('subList');
            else setActiveView(null);
        } else {
            // Opening form
            setActiveForm(formName);
            setActiveView(null); // Hide list while form is open
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

    // const {
    //     fetchSubCategories,
    //     fetchChildCategories,
    //     fetchDeepChildCategories,
    //     fetchSubDeepChildCategories
    // } = useCategory();
    const {
        fetchMainCategories,
        fetchSubCategories,
        fetchChildCategories,
        fetchDeepChildCategories,
        fetchSubDeepChildCategories,
        deleteMainCategory,
        deleteSubCategory,
        deleteChildCategory,
        deleteDeepChildCategory,
        deleteSubDeepChildCategory,
        toggleMainVisibility,
        toggleMainIsSub,
        toggleMainImageVisibility, // New
        toggleSubVisibility,
        toggleSubImageVisibility, // New
        toggleSubHasSubCategory,  // New
        toggleChildVisibility,
        toggleDeepChildVisibility,
        toggleSubDeepChildVisibility,
    } = useCategory();

    useEffect(() => {
        fetchMainCategories();
    }, []);

    const handleMainCategoryClick = (item: any) => {
        const mainId = item._id || item.id;
        setSelectedMainCategoryId(mainId);
        setSelectedMainCategoryName(item.name);

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

    const handleChildCategoryClick = (item: any) => {
        const id = item.documentId || item._id || item.id;
        setSelectedChildCategoryId(id);
        setSelectedChildCategoryName(item.name);

        if (selectedMainCategoryId) {
            // Correct order: mainId, childId, subId
            fetchDeepChildCategories(selectedMainCategoryId, id, selectedSubCategoryId);
        }
        setActiveView('deepList');
    };

    const handleDeepChildCategoryClick = (item: any) => {
        const id = item.id || item._id;
        setSelectedDeepChildCategoryId(id);
        setSelectedDeepChildCategoryName(item.name);

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
            setActiveView('subList');
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
    const handleEditMain = (item: any) => { /* TODO: Populate form */ toggleForm('main'); };
    // ... similar for others if needed

    // Helpers for toggle
    const handleToggleMain = (item: any) => toggleMainVisibility(item._id || item.id);
    const handleToggleSub = (item: any) => toggleSubVisibility(item.documentId || item._id || item.id);
    const handleToggleChild = (item: any) => toggleChildVisibility(item.documentId || item._id || item.id);
    const handleToggleDeep = (item: any) => toggleDeepChildVisibility(item.id || item._id);


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
                            } else {
                                toggleSubVisibility(id);
                            }
                        }}
                        onDeleteClick={handleDeleteSub}
                        onEditClick={(item) => toggleForm('sub')}
                        parentNameOverride={selectedMainCategoryName}
                    />
                </div>
            )}

            {/* CHILD LIST VIEW */}
            {activeView === 'childList' && (
                <div className="mb-8 pt-6">
                    <div className="flex items-center gap-4 mb-8">
                        <button onClick={handleBack} className="p-1 rounded-full hover:bg-gray-200">
                            <ArrowLeft size={28} className="text-black" />
                        </button>
                        <h3 className="text-xl font-bold text-blue-950">
                            Child Category
                        </h3>
                    </div>
                    <CategoryList
                        type="child"
                        filterId={selectedSubCategoryId || selectedMainCategoryId}
                        onItemClick={handleChildCategoryClick}
                        onToggleVisibility={handleToggleChild}
                        onDeleteClick={handleDeleteChild}
                        onEditClick={(item) => toggleForm('child')}
                    />

                </div>
            )}

            {/* DEEP CHILD LIST VIEW */}
            {activeView === 'deepList' && (
                <div className="mb-8 pt-6">
                    <div className="flex items-center gap-4 mb-8">
                        <button onClick={handleBack} className="p-1 rounded-full hover:bg-gray-200">
                            <ArrowLeft size={28} className="text-black" />
                        </button>
                        <h3 className="text-xl font-bold text-blue-950">
                            {selectedChildCategoryName}
                        </h3>
                    </div>
                    {(selectedChildCategoryId) && (
                        <CategoryList
                            type="deep"
                            filterId={selectedChildCategoryId}
                            onItemClick={handleDeepChildCategoryClick}
                            onToggleVisibility={handleToggleDeep}
                            onDeleteClick={handleDeleteDeep}
                        />
                    )}
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
                                    onSuccess={() => toggleForm('subDeep')}
                                />
                            )}
                            {activeForm === 'main' && <MainCategoryForm onSuccess={() => toggleForm('main')} />}
                            {activeForm === 'sub' && <SubCategoryForm onSuccess={() => toggleForm('sub')} />}
                            {activeForm === 'child' && <ChildCategoryForm onSuccess={() => toggleForm('child')} />}
                            {activeForm === 'deep' && <DeepChildCategoryForm initialChildCategoryId={undefined} onSuccess={() => toggleForm('deep')} />}
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
