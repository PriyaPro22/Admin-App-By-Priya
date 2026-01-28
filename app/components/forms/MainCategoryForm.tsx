

"use client";

import React, { useState, useEffect } from "react";
import { Save } from "lucide-react";
import ToggleSwitch from "../ui/ToggleSwitch";
import { ImageBoxUploader } from "../ui/ImageUploader";
import { useCategory } from "../../context/CategoryContext";
import { generateCategoryId } from "../../utils/generateCategoryId";
import toast from "react-hot-toast";

const MainCategoryForm = () => {
  const { addMainCategory, mainCategories, fetchMainCategories } = useCategory();
  
  // State for form fields
  // const [formData, setFormData] = useState({
  //   categoryName: "",
  //   selectCategory: "Home Appliances",
  //   visibility: false,
  //   imageVisibility: false,
  //   isSubCategory: false,
  //   imageUri: "", 
  // });
  const [formData, setFormData] = useState({
  categoryName: "",
  selectCategory: "Home Appliances", // 🔥 ONLY SOURCE OF TRUTH
  visibility: false,
  imageVisibility: false,
  isSubCategory: false,
  imageUri: "",
});




  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [loadingCategories] = useState(true);
  const [successMessage, setSuccessMessage] = useState("");
const [errorMessage, setErrorMessage] = useState("");

const initialFormData = {
  categoryName: "",
  selectCategory: "",
  visibility: false,
  imageVisibility: false,
  isSubCategory: false,
  imageUri: "",
};



  // Fixed parent categories - Always show these three
//  const fixedParentCategories = [
//   { name: "Home Appliances" },
//   { name: "Computer" },
//   { name: "Mobile" }
// ];
const fixedParentCategories = [
  { id: "Home Appliances", name: "Home Appliances" },
  { id: "Computer", name: "Computer" },
  { id: "Mobile", name: "Mobile" },
];

// ✅ YAHI PASTE KARNA HAI
useEffect(() => {
  const homeCategory = fixedParentCategories.find(
    (cat) => cat.name === "Home Appliances"
  );

  if (homeCategory) {
    setFormData((prev) => ({
      ...prev,
      selectCategory: homeCategory.id,
    }));
  }
}, []);




  // Handle image upload - COMPRESSED VERSION
  const handleImageUpload = async (file: File) => {
    try {
      setIsUploading(true);
      setUploadError("");
      
      // Check file size (max 2MB to avoid payload too large)
      if (file.size > 2 * 1024 * 1024) {
        throw new Error("Image size should be less than 2MB");
      }

      // Convert to base64 directly (no compression for now)
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setFormData(prev => ({ ...prev, imageUri: base64String }));
        setIsUploading(false);
      };
      reader.onerror = () => {
        throw new Error("Failed to read image file");
      };
      reader.readAsDataURL(file);
      
    } catch (error: any) {
      console.error("Image upload error:", error);
      setUploadError(error.message || "Failed to upload image");
      setIsUploading(false);
    }
  };

  // Handle text input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle toggle changes
  const handleToggle = (key: keyof typeof formData) => {
    setFormData((prev) => ({ ...prev, [key]: !prev[key] as boolean }));
  }

  // Handle Checkbox
  const handleCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked;
    setFormData(prev => ({ 
      ...prev, 
      isSubCategory: isChecked,
      // Reset parent category if unchecked
      selectCategory: isChecked ? prev.selectCategory : ""
    }));
  }

//  const handleSave = async () => {
//   if (!formData.categoryName.trim()) {
//     alert("Category name is required");
//     return;
//   }

//   const generatedId = generateCategoryId(formData.categoryName);

//   console.log("Generated ID:", generatedId);

//   await addMainCategory({
//     _id: generatedId, // 🔥 REQUIRED
//     name: formData.categoryName.trim(),
//     visible: formData.visibility,
//     imageVisibility: formData.imageVisibility,
//     isSubCategory: formData.isSubCategory,
//     parentCategory: formData.isSubCategory ? formData.selectCategory : null,
//     imageUri: formData.imageUri || null,
//   });
// };
const handleSave = async () => {
  if (!formData.categoryName.trim()) {
    setErrorMessage("Category name is required");
    return;
  }

  try {
    setIsSaving(true);
    setErrorMessage("");

    const generatedId = generateCategoryId(formData.categoryName);

    await addMainCategory({
      _id: generatedId,
      name: formData.categoryName.trim(),
      visible: formData.visibility,
      imageVisibility: formData.imageVisibility,
      isSubCategory: formData.isSubCategory,
      
      parentId: formData.selectCategory,
      imageUri: formData.imageUri || null,
    });

    // ✅ SUCCESS MESSAGE
    setSuccessMessage("✅ Category saved successfully!");

    // ✅ FORM RESET
    setFormData(initialFormData);

    // 🔥 Auto-hide message after 3 sec
    setTimeout(() => {
      setSuccessMessage("");
    }, 3000);

  } catch (error) {
    console.error(error);
    setErrorMessage("❌ Failed to save category");
  } finally {
    setIsSaving(false);
  }
};



  const getParentOptions = () => {
    // First show fixed categories
    const options = fixedParentCategories.map((cat) => (
      <option key={cat._id} value={cat._id}>
        {cat.name}
      </option>
    ));

    // Then add actual categories from API (if any)
    const actualCategories = mainCategories.filter(cat => !cat.isSubCategory);
    if (actualCategories.length > 0) {
      console.log("Adding actual categories to dropdown:", actualCategories);
      actualCategories.forEach(cat => {
        options.push(
          <option key={cat._id} value={cat._id}>
            {cat.name} (from DB)
          </option>
        );
      });
    }

    return options;
  };

  return (
    
    <div className="rounded-lg border border-red-500 bg-gray-200 p-4 shadow-md">
      <div className="mb-4 flex items-center justify-between rounded-md border-2 border-blue-900 bg-white px-4 py-2">
        <span className="font-bold text-gray-900">Manage Main Category</span>
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-gray-700">Visibility</span>
          <ToggleSwitch
            isOn={formData.visibility}
            onToggle={() => handleToggle("visibility")}
          />
        </div>
      </div>

      {/* Parent Category Dropdown (only shown for subcategories) */}
 <div className="mb-4">
  <label className="mb-1 block font-semibold text-gray-900">
    Select Parent Category
  </label>

  <select
    name="selectCategory"
    value={formData.selectCategory}
    onChange={handleChange}
    className="w-full h-[44px] rounded-md border-2 border-blue-900 px-3 cursor-pointer"
  >
    {fixedParentCategories.map((cat) => (
      <option key={cat.id} value={cat.id}>
        {cat.name}
      </option>
    ))}
  </select>
</div>


     {/* MAIN CATEGORY – ALWAYS VISIBLE */}
<div className="mb-4">
  <label className="block font-semibold text-gray-900 mb-1">
    Enter Main Category
  </label>

  <input
    type="text"
    name="categoryName"
    value={formData.categoryName}
    onChange={handleChange}
    placeholder="Enter Main Category"
    className="w-full rounded-md border-2 border-blue-900 px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
    required
  />
</div>
      {/* SubCategory Checkbox */}
<div className="mb-4 flex items-center gap-2">
  <input
    type="checkbox"
    id="isSubCategory"
    checked={formData.isSubCategory}
    onChange={(e) =>
      setFormData((prev) => ({
        ...prev,
        isSubCategory: e.target.checked,
      }))
    }
    className="h-5 w-5 rounded border-gray-300 text-blue-900 cursor-pointer"
  />
  <label
    htmlFor="isSubCategory"
    className="font-bold text-gray-900 cursor-pointer"
  >
    Is SubCategory??
  </label>
</div>



      {/* Image Upload Section */}
      <div className="mb-4">
        
        <div className="flex items-center gap-4">
          <ImageBoxUploader 
            onImageSelected={handleImageUpload} 
            previewUrl={formData.imageUri}
            disabled={isUploading || isSaving}
          />
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-gray-700">Image Visibility</span>
            <ToggleSwitch
              isOn={formData.imageVisibility}
              onToggle={() => handleToggle("imageVisibility")}
              disabled={!formData.imageUri || isSaving}
            />
          </div>
        </div>
        
        {/* Image Upload Status */}
        {isUploading && (
          <p className="mt-2 text-sm text-blue-600">Uploading image...</p>
        )}
        {uploadError && (
          <p className="mt-2 text-sm text-red-600">{uploadError}</p>
        )}
        {formData.imageUri && !isUploading && !uploadError && (
          <p className="mt-2 text-sm text-green-600">
            ✓ Image uploaded successfully
          </p>
        )}
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={isUploading || isSaving}
          className={`flex items-center gap-2 rounded-lg px-6 py-2 font-bold text-white transition-transform ${
            isUploading || isSaving
              ? "bg-gray-400 cursor-not-allowed" 
              : "bg-blue-900 hover:scale-105 active:scale-95"
          }`}
        >
          <Save size={20} />
          {isSaving ? "Saving..." : "Save"}
        </button>
      </div>

      {/* Debug Info - Remove in production */}
      
    </div>
  );
};

export default MainCategoryForm;
