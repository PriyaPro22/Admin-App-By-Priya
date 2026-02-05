
// "use client";

// import React, { useState, useEffect } from "react";
// import { Save } from "lucide-react";
// import ToggleSwitch from "../ui/ToggleSwitch";
// import { ImageBoxUploader } from "../ui/ImageUploader";
// import { useCategory } from "../../context/CategoryContext";
// import { generateCategoryId } from "../../utils/generateCategoryId";
// import toast from "react-hot-toast";

// const fixedParentCategories = [
//   { id: "Home Appliances", name: "Home Appliances" },
//   { id: "Computer", name: "Computer" },
//   { id: "Mobile", name: "Mobile" },
// ];

// const MainCategoryForm = () => {
//   const { addMainCategory } = useCategory();
// const [editingCategory, setEditingCategory] = useState<any | null>(null);

//   const [formData, setFormData] = useState({
//     categoryName: "",
//     selectCategory: "Home Appliances",
//     visibility: true,
//     imageVisibility: true,
//     isSubCategory: false,
//     imageFile: null as File | null, // 🔥 FILE ONLY
//   });

//   const [isSaving, setIsSaving] = useState(false);

//   // Default parent
//   useEffect(() => {
//     setFormData((prev) => ({
//       ...prev,
//       selectCategory: "Home Appliances",
//     }));
//   }, []);

//   // 🔥 IMAGE CHANGE (NO BASE64)
//   const handleImageChange = (file: File) => {
//     setFormData((prev) => ({
//       ...prev,
//       imageFile: file,
//     }));
//   };

//   const handleSave = async () => {
//     if (!formData.categoryName.trim()) {
//       toast.error("Category name is required");
//       return;
//     }

//     try {
//       setIsSaving(true);

//       const generatedId = generateCategoryId(formData.categoryName);

//       // 🔥 SEND FILE + DATA
//       await addMainCategory({
//         _id: generatedId,
//         name: formData.categoryName.trim(),
//         visible: formData.visibility,
//         imageVisibility: formData.imageVisibility,
//         isSubCategory: formData.isSubCategory,
//         parentId: formData.selectCategory,
//         imageFile: formData.imageFile, // 🔥 FILE
//       });

//       toast.success("Category saved successfully");

//       // RESET
//       setFormData({
//         categoryName: "",
//         selectCategory: "Home Appliances",
//         visibility: true,
//         imageVisibility: true,
//         isSubCategory: false,
//         imageFile: null,
//       });
//     } catch (err) {
//       toast.error("Failed to save category");
//     } finally {
//       setIsSaving(false);
//     }
//   };

//   return (
//     <div className="rounded-lg border border-blue-900 bg-gray-100 p-4 shadow-md">
//       {/* HEADER */}
//       <div className="mb-4 flex justify-between items-center bg-white p-3 border rounded">
//         <span className="font-bold">Manage Main Category</span>
//         <ToggleSwitch
//           isOn={formData.visibility}
//           onToggle={() =>
//             setFormData((p) => ({ ...p, visibility: !p.visibility }))
//           }
//         />
//       </div>

//       {/* PARENT CATEGORY */}
//       <div className="mb-4">
//         <label className="font-semibold">Select Parent Category</label>
//         <select
//           value={formData.selectCategory}
//           onChange={(e) =>
//             setFormData((p) => ({ ...p, selectCategory: e.target.value }))
//           }
//           className="w-full border p-2 rounded"
//         >
//           {fixedParentCategories.map((cat) => (
//             <option key={cat.id} value={cat.id}>
//               {cat.name}
//             </option>
//           ))}
//         </select>
//       </div>

//       {/* CATEGORY NAME */}
//       <div className="mb-4">
//         <label className="font-semibold">Main Category Name</label>
//         <input
//           type="text"
//           value={formData.categoryName}
//           onChange={(e) =>
//             setFormData((p) => ({ ...p, categoryName: e.target.value }))
//           }
//           className="w-full border p-2 rounded"
//           placeholder="Enter category name"
//         />
//       </div>

//       {/* IMAGE UPLOAD */}
//       <div className="mb-4">
//         <ImageBoxUploader
//           onImageSelected={handleImageChange} // 🔥 FILE
//           previewUrl={
//             formData.imageFile
//               ? URL.createObjectURL(formData.imageFile)
//               : undefined
//           }
//         />
//       </div>

//       {/* IMAGE VISIBILITY */}
//       <div className="mb-4 flex items-center gap-2">
//         <span className="font-semibold">Image Visibility</span>
//         <ToggleSwitch
//           isOn={formData.imageVisibility}
//           onToggle={() =>
//             setFormData((p) => ({
//               ...p,
//               imageVisibility: !p.imageVisibility,
//             }))
//           }
//         />
//       </div>

//       {/* SAVE */}
//       <div className="flex justify-end">
//         <button
//           onClick={handleSave}
//           disabled={isSaving}
//           className="flex items-center gap-2 bg-blue-900 text-white px-6 py-2 rounded hover:scale-105 transition"
//         >
//           <Save size={18} />
//           {isSaving ? "Saving..." : "Save"}
//         </button>
//       </div>
//     </div>
//   );
// };

// export default MainCategoryForm;


"use client";

import React, { useState, useEffect } from "react";
import { Save } from "lucide-react";
import ToggleSwitch from "../ui/ToggleSwitch";
import { ImageBoxUploader } from "../ui/ImageUploader";
import { useCategory } from "../../context/CategoryContext";
import { generateCategoryId } from "../../utils/generateCategoryId";
import toast from "react-hot-toast";

const fixedParentCategories = [
  { id: "Home Appliances", name: "Home Appliances" },
  { id: "Computer", name: "Computer" },
  { id: "Mobile", name: "Mobile" },
];

interface Props {
  editingCategory?: any | null;
  onSuccess?: () => void;
}

const MainCategoryForm: React.FC<Props> = ({
  editingCategory,
  onSuccess,
}) => {
  const { addMainCategory, updateMainCategory } = useCategory();

  const [formData, setFormData] = useState({
    categoryName: "",
    selectCategory: "Home Appliances",
    visibility: true,
    imageVisibility: true,
    isSubCategory: false,
    imageFile: null as File | null,
  });

  const [isSaving, setIsSaving] = useState(false);

  // 🔥 PREFILL FORM ON EDIT
  useEffect(() => {
    if (editingCategory) {
      setFormData({
        categoryName: editingCategory.name || "",
        selectCategory: editingCategory.parentId || "Home Appliances",
        visibility: editingCategory.isMainCategoryVisible ?? true,
        imageVisibility: editingCategory.isMainCategoryImageVisible ?? true,
        isSubCategory: editingCategory.hasSubCategory ?? false,
        imageFile: null, // optional
      });
    }
  }, [editingCategory]);

  const handleImageChange = (file: File) => {
    setFormData((prev) => ({ ...prev, imageFile: file }));
  };

  const handleSave = async () => {
    if (!formData.categoryName.trim()) {
      toast.error("Category name is required");
      return;
    }

    try {
      setIsSaving(true);

      // =====================
      // ✏️ EDIT MODE
      // =====================
      if (editingCategory) {
        await updateMainCategory({
          _id: editingCategory._id,
          name: formData.categoryName.trim(),
          isMainCategoryVisible: formData.visibility,
          isMainCategoryImageVisible: formData.imageVisibility,
          hasSubCategory: formData.isSubCategory,
          parentId: formData.selectCategory,
          imageFile: formData.imageFile,
        });

        toast.success("Category updated successfully");
        onSuccess?.();
      }

      // =====================
      // ➕ ADD MODE
      // =====================
      else {
        const generatedId = generateCategoryId(formData.categoryName);

        await addMainCategory({
          _id: generatedId,
          name: formData.categoryName.trim(),
          isMainCategoryVisible: formData.visibility,
          isMainCategoryNameVisible: true,
          isMainCategoryImageVisible: formData.imageVisibility,
          hasSubCategory: formData.isSubCategory,
          parentId: formData.selectCategory,
          imageFile: formData.imageFile,
        });

        toast.success("Category added successfully");
        onSuccess?.();
      }

      // 🔁 RESET FORM
      setFormData({
        categoryName: "",
        selectCategory: "Home Appliances",
        visibility: true,
        imageVisibility: true,
        isSubCategory: false,
        imageFile: null,
      });
    } catch (err) {
      toast.error("Failed to save category");
    } finally {
      setIsSaving(false);
    }
  };

  // ==========================
  // 🎨 RENDER: UPDATE MODE
  // ==========================
  if (editingCategory) {
    return (
      <div className="flex flex-col gap-6 bg-white p-2">
        {/* Title */}
        <div className="flex items-center justify-center gap-2">
          <h2 className="text-xl font-bold text-gray-900">Update Main Category 🖼️</h2>
        </div>

        {/* Inputs Stack */}
        <div className="flex flex-col gap-4">

          {/* Name */}
          <input
            type="text"
            value={formData.categoryName}
            onChange={(e) => setFormData(p => ({ ...p, categoryName: e.target.value }))}
            className="w-full rounded-lg border-2 border-blue-900 px-4 py-3 text-lg font-medium text-gray-900 focus:border-blue-700 focus:outline-none"
            placeholder="Category Name"
          />

          {/* Parent (ReadOnly for visual match or Select) */}
          <div className="relative">
            <select
              value={formData.selectCategory}
              onChange={(e) => setFormData(p => ({ ...p, selectCategory: e.target.value }))}
              className="w-full appearance-none rounded-lg border-2 border-blue-900 bg-white px-4 py-3 text-lg font-medium text-gray-900 focus:border-blue-700 focus:outline-none"
            >
              {fixedParentCategories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Image Uploader (Requested) */}
          <div className="mt-2">
            <label className="mb-2 block text-sm font-bold text-gray-700">Update Image</label>
            <ImageBoxUploader
              onImageSelected={handleImageChange}
              previewUrl={
                formData.imageFile
                  ? URL.createObjectURL(formData.imageFile as File)
                  : editingCategory.imageUri || undefined
              }
            />
          </div>

        </div>

        {/* Update Button */}
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

  // ==========================
  // ➕ RENDER: ADD MODE
  // ==========================
  return (
    <div className="rounded-lg border border-blue-900 bg-gray-100 p-4 shadow-md">
      {/* HEADER */}
      <div className="mb-4 flex justify-between items-center bg-white p-3 border rounded">
        <span className="font-bold">Add Main Category</span>

        <ToggleSwitch
          isOn={formData.visibility}
          onToggle={() =>
            setFormData((p) => ({ ...p, visibility: !p.visibility }))
          }
        />
      </div>

      {/* PARENT CATEGORY */}
      <div className="mb-4">
        <label className="font-semibold">Select Parent Category</label>
        <select
          value={formData.selectCategory}
          onChange={(e) =>
            setFormData((p) => ({ ...p, selectCategory: e.target.value }))
          }
          className="w-full border p-2 rounded"
        >
          {fixedParentCategories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* CATEGORY NAME */}
      <div className="mb-4">
        <label className="font-semibold">Main Category Name</label>
        <input
          type="text"
          value={formData.categoryName}
          onChange={(e) =>
            setFormData((p) => ({ ...p, categoryName: e.target.value }))
          }
          className="w-full border p-2 rounded"
          placeholder="Enter category name"
        />
      </div>

      {/* IMAGE UPLOAD */}
      <div className="mb-4">
        <ImageBoxUploader
          onImageSelected={handleImageChange}
          previewUrl={
            formData.imageFile
              ? URL.createObjectURL(formData.imageFile as File)
              : undefined
          }
        />
      </div>

      {/* IMAGE VISIBILITY */}
      <div className="mb-4 flex items-center gap-2">
        <span className="font-semibold">Image Visibility</span>
        <ToggleSwitch
          isOn={formData.imageVisibility}
          onToggle={() =>
            setFormData((p) => ({
              ...p,
              imageVisibility: !p.imageVisibility,
            }))
          }
        />
      </div>

      {/* SAVE */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 bg-blue-900 text-white px-6 py-2 rounded hover:scale-105 transition"
        >
          <Save size={18} />
          {isSaving ? "Saving..." : "Save"}
        </button>
      </div>
    </div>
  );
};


export default MainCategoryForm;
