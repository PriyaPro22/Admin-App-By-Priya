// "use client";

// import React, { useState } from "react";
// import { Image as ImageIcon, Save } from "lucide-react";
// import ToggleSwitch from "../ui/ToggleSwitch";
// import { ImageBoxUploader } from "../ui/ImageUploader";
// import { useCategory } from "../../context/CategoryContext";
// import { generateCategoryId } from "../../utils/generateCategoryId";

// const SubCategoryForm = ({ editingCategory, onSuccess }: { editingCategory?: any, onSuccess?: () => void }) => {
//   const { addSubCategory, updateSubCategory, mainCategories } = useCategory();
//   const [search, setSearch] = useState("");
//   const [open, setOpen] = useState(false);

//   const [isSaving, setIsSaving] = useState(false);

//   const initialFormData = {
//     mainCategoryId: "",
//     subCategoryName: "",
//     mainVisibility: false,
//     inputVisibility: true,
//     imageVisibility: true,
//     image: null as File | null,
//   };

//   const [formData, setFormData] = useState(initialFormData);

//   // Populate form for edit
//   React.useEffect(() => {
//     if (editingCategory) {
//       setFormData({
//         mainCategoryId: editingCategory.mainCategoryId || "",
//         subCategoryName: editingCategory.name || "",
//         mainVisibility: false, // Not typically edited here
//         inputVisibility: editingCategory.isSubCategoryVisible ?? true,
//         imageVisibility: editingCategory.isSubCategoryImageVisible ?? true,
//         image: null,
//       });
//     }
//   }, [editingCategory]);

//   const filteredCategories = (() => {
//     const q = search.trim().toLowerCase();
//     const list = mainCategories.filter(
//       cat => typeof cat.name === "string" && cat.name.trim() !== ""
//     );

//     if (!q) {
//       return [...list].sort((a, b) => a.name.localeCompare(b.name));
//     }

//     const startsWith = list.filter(cat => cat.name.toLowerCase().startsWith(q));
//     const contains = list.filter(cat => !cat.name.toLowerCase().startsWith(q) && cat.name.toLowerCase().includes(q));

//     return [
//       ...startsWith.sort((a, b) => a.name.localeCompare(b.name)),
//       ...contains.sort((a, b) => a.name.localeCompare(b.name)),
//     ];
//   })();

//   const handleImageSelect = (file: File) => {
//     setFormData((prev) => ({ ...prev, image: file }));
//   };

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//     const { name, value, type } = e.target;
//     const checked = (e.target as HTMLInputElement).checked; // Safe access

//     setFormData((prev) => ({
//       ...prev,
//       [name]: type === "checkbox" ? checked : value,
//     }));
//   };

//   const handleToggle = (key: keyof typeof formData) => {
//     setFormData((prev) => ({ ...prev, [key]: !prev[key] as boolean }));
//   };

//   const handleSave = async () => {
//     setIsSaving(true);
//     try {
//       if (editingCategory) {
//         // UPDATE MODE
//         await updateSubCategory({
//           ...editingCategory, // Keep original IDs
//           name: formData.subCategoryName,
//           isSubCategoryVisible: formData.inputVisibility,
//           isSubCategoryImageVisible: formData.imageVisibility,
//           imageFile: formData.image
//         });
//         alert("SubCategory updated successfully ✅");
//       } else {
//         // ADD MODE
//         if (!formData.mainCategoryId) {
//           alert("Please select Main Category");
//           setIsSaving(false);
//           return;
//         }

//         if (!formData.subCategoryName.trim()) {
//           alert("SubCategory name required");
//           setIsSaving(false);
//           return;
//         }

//         await addSubCategory({
//           name: formData.subCategoryName,
//           mainCategoryId: formData.mainCategoryId,
//           visible: formData.inputVisibility,
//           imageFile: formData.image,
//         } as any);

//         alert("SubCategory added successfully ✅");
//       }

//       onSuccess?.();

//       // Reset
//       setFormData(initialFormData);
//       setSearch("");
//       setOpen(false);

//     } catch (e) {
//       console.error(e);
//       alert("An error occurred");
//     } finally {
//       setIsSaving(false);
//     }
//   };

//   // ==========================
//   // 🎨 RENDER: UPDATE MODE
//   // ==========================
//   if (editingCategory) {
//     return (
//       <div className="flex flex-col gap-6 bg-white p-2">
//         <div className="flex items-center justify-center gap-2">
//           <h2 className="text-xl font-bold text-gray-900">Update Sub Category</h2>
//         </div>

//         <div className="flex flex-col gap-4">
//           {/* Name */}
//           <input
//             type="text"
//             name="subCategoryName"
//             value={formData.subCategoryName}
//             onChange={handleChange}
//             placeholder="Sub Category Name"
//             className="w-full rounded-lg border-2 border-blue-900 px-4 py-3 text-lg font-medium text-gray-900 focus:border-blue-700 focus:outline-none"
//           />

//           {/* Image Update */}
//           <div className="mt-2">
//             <label className="mb-2 block text-sm font-bold text-gray-700">Update Image</label>
//             <ImageBoxUploader
//               onImageSelected={handleImageSelect}
//               previewUrl={
//                 formData.image
//                   ? URL.createObjectURL(formData.image)
//                   : editingCategory.imageUri || undefined
//               }
//             />
//           </div>
//         </div>

//         <button
//           onClick={handleSave}
//           disabled={isSaving}
//           className="mt-2 w-full rounded-full bg-blue-900 py-3 text-lg font-bold text-white shadow-lg transition-transform hover:scale-[1.02] hover:bg-blue-800 disabled:opacity-70"
//         >
//           {isSaving ? "Updating..." : "Update"}
//         </button>
//       </div>
//     );
//   }

//   // ==========================
//   // ➕ RENDER: ADD MODE
//   // ==========================
//   return (
//     <div className="rounded-lg border border-green-500 bg-gray-200 p-4 shadow-md">
//       {/* Existing Add Logic... (Simplified/Preserved) */}
//       <div className="mb-4 flex items-center justify-between rounded-md border-2 border-blue-900 bg-white px-4 py-2">
//         <span className="font-bold text-gray-900">Manage Sub Category</span>
//         <div className="flex items-center gap-2">
//           <span className="text-sm font-semibold text-gray-700">Visibility</span>
//           <ToggleSwitch
//             isOn={formData.mainVisibility}
//             onToggle={() => handleToggle("mainVisibility")}
//           />
//         </div>
//       </div>

//       <h1 className="text-black font-bold">Select Main Category Name</h1>
//       <div className="relative mb-2 mt-2">
//         {/* Main Category Selector Implementation */}
//         <input
//           type="text"
//           placeholder="Select Main Category"
//           value={formData.mainCategoryId ? mainCategories.find(c => c._id === formData.mainCategoryId)?.name || "" : search}
//           onChange={(e) => {
//             setSearch(e.target.value);
//             setOpen(true);
//             setFormData(prev => ({ ...prev, mainCategoryId: "" }));
//           }}
//           onFocus={() => setOpen(true)}
//           className="w-full rounded-md border-2 border-blue-900 px-3 py-2 text-black"
//         />
//         {open && (
//           <div className="absolute z-50 mt-1 max-h-48 w-full overflow-y-auto rounded-md border bg-white shadow-lg">
//             {filteredCategories.length > 0 ? (
//               filteredCategories.map(cat => (
//                 <div
//                   key={cat._id}
//                   onClick={() => {
//                     setFormData(prev => ({ ...prev, mainCategoryId: cat._id }));
//                     setSearch(cat.name);
//                     setOpen(false);
//                   }}
//                   className="cursor-pointer px-3 py-2 hover:bg-blue-100 text-black"
//                 >
//                   {cat.name}
//                 </div>
//               ))
//             ) : (
//               <div className="px-3 py-2 text-gray-500">No result found</div>
//             )}
//           </div>
//         )}
//       </div>

//       <div className="mb-4">
//         <div className="flex items-center justify-between mb-1">
//           <label className="block font-semibold text-gray-900">Enter Sub Category Name</label>
//           <div className="flex items-center gap-2 mt-2">
//             <span className="text-xs font-semibold text-gray-700">Visibility</span>
//             <ToggleSwitch isOn={formData.inputVisibility} onToggle={() => handleToggle("inputVisibility")} />
//           </div>
//         </div>
//         <input
//           type="text"
//           name="subCategoryName"
//           value={formData.subCategoryName}
//           onChange={handleChange}
//           placeholder="Enter Sub Category"
//           className="w-full rounded-md border-2 border-blue-900 px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
//         />
//       </div>

//       <div className="mb-4">
//         <div className="flex items-center gap-4">
//           <ImageBoxUploader
//             onImageSelected={handleImageSelect}
//             previewUrl={
//               formData.image
//                 ? URL.createObjectURL(formData.image)
//                 : undefined
//             }
//           />
//           <div className="flex items-center gap-2">
//             <span className="text-sm font-semibold text-gray-700">Visibility</span>
//             <ToggleSwitch isOn={formData.imageVisibility} onToggle={() => handleToggle("imageVisibility")} />
//           </div>
//         </div>
//       </div>

//       <div className="flex justify-end">
//         <button
//           onClick={handleSave}
//           disabled={isSaving}
//           className="flex items-center gap-2 rounded-lg bg-blue-900 px-6 py-2 font-bold text-white transition-transform hover:scale-105 active:scale-95"
//         >
//           <Save size={20} />
//           {isSaving ? "Saving..." : "Save"}
//         </button>
//       </div>
//     </div>
//   );
// };

// export default SubCategoryForm;

//naman

"use client";

import React, { useState, useEffect } from "react";
import { Save, Eye, EyeOff, ImageIcon } from "lucide-react";
import ToggleSwitch from "../ui/ToggleSwitch";
import { ImageBoxUploader } from "../ui/ImageUploader";
import { useCategory } from "../../context/CategoryContext";
import { generateCategoryId } from "../../utils/generateCategoryId";

// ✅ Sub Category Live Preview Card
const SubLivePreviewCard = ({
  subCategoryName,
  mainCategoryName,
  imagePreviewUrl,
  visibility,
  nameVisibility,
  imageVisibility,
}: {
  subCategoryName: string;
  mainCategoryName: string;
  imagePreviewUrl?: string;
  visibility: boolean;
  nameVisibility: boolean;
  imageVisibility: boolean;
}) => (
  <div style={{ background: "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)", border: "2px solid #86efac", borderRadius: "12px", padding: "14px", marginBottom: "14px" }}>
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#22c55e", boxShadow: "0 0 6px #22c55e" }} />
        <span style={{ fontSize: "11px", fontWeight: "700", color: "#16a34a", textTransform: "uppercase", letterSpacing: "0.8px" }}>Live Preview</span>
      </div>
      <span style={{ fontSize: "10px", padding: "2px 8px", borderRadius: "20px", background: visibility ? "#dcfce7" : "#fee2e2", color: visibility ? "#16a34a" : "#dc2626", fontWeight: "600" }}>
        {visibility ? "Visible" : "Hidden"}
      </span>
    </div>
    <div style={{ display: "flex", alignItems: "center", gap: "12px", background: "white", borderRadius: "10px", padding: "10px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
      <div style={{ width: "56px", height: "56px", borderRadius: "8px", flexShrink: 0, background: imagePreviewUrl ? "transparent" : "#f1f5f9", border: "2px dashed #cbd5e1", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", opacity: imageVisibility ? 1 : 0.4 }}>
        {imagePreviewUrl ? (
          <img src={imagePreviewUrl} alt="preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          <ImageIcon size={20} color="#94a3b8" />
        )}
      </div>
      <div style={{ flex: 1 }}>
        {nameVisibility ? (
          <p style={{ margin: 0, fontWeight: "700", fontSize: "14px", color: subCategoryName ? "#1e293b" : "#94a3b8" }}>
            {subCategoryName || "Sub Category Name..."}
          </p>
        ) : (
          <div style={{ display: "flex", alignItems: "center", gap: "4px", color: "#94a3b8" }}>
            <EyeOff size={12} /><span style={{ fontSize: "12px" }}>Name hidden</span>
          </div>
        )}
        {mainCategoryName && (
          <span style={{ fontSize: "11px", marginTop: "4px", display: "block", padding: "1px 8px", borderRadius: "20px", background: "#ede9fe", color: "#7c3aed", fontWeight: "600", width: "fit-content" }}>
            Under: {mainCategoryName}
          </span>
        )}
      </div>
    </div>
  </div>
);

const SubCategoryForm = ({ editingCategory, onSuccess }: { editingCategory?: any; onSuccess?: () => void }) => {
  const { addSubCategory, updateSubCategory, mainCategories } = useCategory();
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const initialFormData = {
    mainCategoryId: "",
    subCategoryName: "",
    visibility: true,
    nameVisibility: true,
    imageVisibility: true,
    image: null as File | null,
  };

  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    if (editingCategory) {
      setFormData({
        mainCategoryId: editingCategory.mainCategoryId || "",
        subCategoryName: editingCategory.name || "",
        visibility: editingCategory.isSubCategoryVisible ?? true,
        nameVisibility: editingCategory.isSubCategoryNameVisible ?? true,
        imageVisibility: editingCategory.isSubCategoryImageVisible ?? true,
        image: null,
      });
    }
  }, [editingCategory]);

  const filteredCategories = mainCategories
    .filter(cat => cat.name?.trim())
    .filter(cat => {
      const q = search.trim().toLowerCase();
      if (!q) return true;
      return cat.name.toLowerCase().includes(q);
    })
    .sort((a, b) => a.name.localeCompare(b.name));

  const handleImageSelect = (file: File) => {
    setFormData((prev) => ({ ...prev, image: file }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleToggle = (key: keyof typeof formData) => {
    setFormData((prev) => ({ ...prev, [key]: !prev[key] as boolean }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      if (editingCategory) {
        await updateSubCategory({
          ...editingCategory,
          name: formData.subCategoryName,
          isSubCategoryVisible: formData.visibility,
          isSubCategoryNameVisible: formData.nameVisibility,
          isSubCategoryImageVisible: formData.imageVisibility,
          imageFile: formData.image,
        });
        alert("SubCategory updated successfully ✅");
      } else {
        if (!formData.mainCategoryId) {
          alert("Please select Main Category");
          setIsSaving(false);
          return;
        }
        if (!formData.subCategoryName.trim()) {
          alert("SubCategory name required");
          setIsSaving(false);
          return;
        }

        await addSubCategory({
          _id: generateCategoryId(formData.subCategoryName),
          name: formData.subCategoryName,
          mainCategoryId: formData.mainCategoryId,
          visible: formData.visibility,
          isSubCategoryNameVisible: formData.nameVisibility,
          isSubCategoryImageVisible: formData.imageVisibility,
          imageFile: formData.image,
        });

        alert("SubCategory added successfully ✅");
      }

      onSuccess?.();
      setFormData(initialFormData);
      setSearch("");
      setOpen(false);
    } catch (e) {
      console.error(e);
      alert("An error occurred");
    } finally {
      setIsSaving(false);
    }
  };

  if (editingCategory) {
    return (
      <div className="flex flex-col gap-6 bg-white p-2">
        <div className="flex items-center justify-center gap-2">
          <h2 className="text-xl font-bold text-gray-900">Update Sub Category</h2>
        </div>

        {/* ✅ Live Preview */}
        <SubLivePreviewCard
          subCategoryName={formData.subCategoryName}
          mainCategoryName={editingCategory.mainCategoryName || ""}
          imagePreviewUrl={formData.image ? URL.createObjectURL(formData.image) : editingCategory.imageUri || undefined}
          visibility={formData.visibility}
          nameVisibility={formData.nameVisibility}
          imageVisibility={formData.imageVisibility}
        />

        <div className="flex flex-col gap-4">
          <input
            type="text"
            name="subCategoryName"
            value={formData.subCategoryName}
            onChange={handleChange}
            placeholder="Sub Category Name"
            className="w-full rounded-lg border-2 border-blue-900 px-4 py-3 text-lg font-medium text-gray-900 focus:border-blue-700 focus:outline-none"
          />

          <div className="mt-2">
            <label className="mb-2 block text-sm font-bold text-gray-700">Update Image</label>
            <ImageBoxUploader
              onImageSelected={handleImageSelect}
              previewUrl={
                formData.image
                  ? URL.createObjectURL(formData.image)
                  : editingCategory.imageUri || undefined
              }
            />
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={isSaving}
          className="mt-2 w-full rounded-full bg-blue-900 py-3 text-lg font-bold text-white shadow-lg transition-transform hover:scale-[1.02] hover:bg-blue-800 disabled:opacity-70"
        >
          {isSaving ? "Updating..." : "Update"}
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-green-500 bg-gray-200 p-4 shadow-md">
      <div className="mb-4 flex items-center justify-between rounded-md border-2 border-blue-900 bg-white px-4 py-2">
        <span className="font-bold text-gray-900">Manage Sub Category</span>
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-gray-700">Visibility</span>
          <ToggleSwitch
            isOn={formData.visibility}
            onToggle={() => handleToggle("visibility")}
          />
        </div>
      </div>

      {/* ✅ Live Preview */}
      <SubLivePreviewCard
        subCategoryName={formData.subCategoryName}
        mainCategoryName={formData.mainCategoryId ? (mainCategories.find(c => c._id === formData.mainCategoryId)?.name || search) : search}
        imagePreviewUrl={formData.image ? URL.createObjectURL(formData.image) : undefined}
        visibility={formData.visibility}
        nameVisibility={formData.nameVisibility}
        imageVisibility={formData.imageVisibility}
      />

      <h1 className="text-black font-bold mb-2">Select Main Category Name</h1>
      <div className="relative mb-4">
        <input
          type="text"
          placeholder="Select Main Category"
          value={formData.mainCategoryId ? mainCategories.find(c => c._id === formData.mainCategoryId)?.name || "" : search}
          onChange={(e) => {
            setSearch(e.target.value);
            setOpen(true);
            setFormData(prev => ({ ...prev, mainCategoryId: "" }));
          }}
          onFocus={() => setOpen(true)}
          className="w-full rounded-md border-2 border-blue-900 px-3 py-2 text-black"
        />
        {open && (
          <div className="absolute z-50 mt-1 max-h-48 w-full overflow-y-auto rounded-md border bg-white shadow-lg">
            {filteredCategories.length > 0 ? (
              filteredCategories.map(cat => (
                <div
                  key={cat._id}
                  onClick={() => {
                    setFormData(prev => ({ ...prev, mainCategoryId: cat._id }));
                    setSearch(cat.name);
                    setOpen(false);
                  }}
                  className="cursor-pointer px-3 py-2 hover:bg-blue-100 text-black"
                >
                  {cat.name}
                </div>
              ))
            ) : (
              <div className="px-3 py-2 text-gray-500">No result found</div>
            )}
          </div>
        )}
      </div>

      <div className="mb-4">
        <div className="flex items-center justify-between mb-1">
          <label className="block font-semibold text-gray-900">Enter Sub Category Name</label>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-gray-700">Name Visible</span>
            <ToggleSwitch
              isOn={formData.nameVisibility}
              onToggle={() => handleToggle("nameVisibility")}
            />
          </div>
        </div>
        <input
          type="text"
          name="subCategoryName"
          value={formData.subCategoryName}
          onChange={handleChange}
          placeholder="Enter Sub Category"
          className="w-full rounded-md border-2 border-blue-900 px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="mb-4">
        <div className="flex items-center gap-4">
          <ImageBoxUploader
            onImageSelected={handleImageSelect}
            previewUrl={
              formData.image
                ? URL.createObjectURL(formData.image)
                : undefined
            }
          />
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-gray-700">Image Visible</span>
            <ToggleSwitch
              isOn={formData.imageVisibility}
              onToggle={() => handleToggle("imageVisibility")}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 rounded-lg bg-blue-900 px-6 py-2 font-bold text-white transition-transform hover:scale-105 active:scale-95"
        >
          <Save size={20} />
          {isSaving ? "Saving..." : "Save"}
        </button>
      </div>
    </div>
  );
};

export default SubCategoryForm;