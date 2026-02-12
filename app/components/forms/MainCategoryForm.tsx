
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

const MainCategoryForm: React.FC<Props> = ({ editingCategory, onSuccess }) => {
  const { addMainCategory, updateMainCategory } = useCategory();

  const [formData, setFormData] = useState({
    categoryName: "",
    selectCategory: "Home Appliances",
    visibility: true,
    imageVisibility: true,
    nameVisibility: true,
    isSubCategory: false,
    imageFile: null as File | null,
  });

  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (editingCategory) {
      setFormData({
        categoryName: editingCategory.name || "",
        selectCategory: editingCategory.parentId || "Home Appliances",
        visibility: editingCategory.isMainCategoryVisible ?? true,
        imageVisibility: editingCategory.isMainCategoryImageVisible ?? true,
        nameVisibility: editingCategory.isMainCategoryNameVisible ?? true,
        isSubCategory: editingCategory.hasSubCategory ?? false,
        imageFile: null,
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

      if (editingCategory) {
        await updateMainCategory({
          _id: editingCategory._id,
          name: formData.categoryName.trim(),
          isMainCategoryVisible: formData.visibility,
          isMainCategoryNameVisible: formData.nameVisibility,
          isMainCategoryImageVisible: formData.imageVisibility,
          hasSubCategory: formData.isSubCategory,
          parentId: formData.selectCategory,
          imageFile: formData.imageFile,
        });

        toast.success("Category updated successfully");
        onSuccess?.();
      } else {
        const generatedId = generateCategoryId(formData.categoryName);

        await addMainCategory({
          _id: generatedId,
          name: formData.categoryName.trim(),
          isMainCategoryVisible: formData.visibility,
          isMainCategoryNameVisible: formData.nameVisibility,
          isMainCategoryImageVisible: formData.imageVisibility,
          hasSubCategory: formData.isSubCategory,
          parentId: formData.selectCategory,
          imageFile: formData.imageFile,
        });

        toast.success("Category added successfully");
        onSuccess?.();
      }

      setFormData({
        categoryName: "",
        selectCategory: "Home Appliances",
        visibility: true,
        imageVisibility: true,
        nameVisibility: true,
        isSubCategory: false,
        imageFile: null,
      });
    } catch (err) {
      toast.error("Failed to save category");
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  if (editingCategory) {
    return (
      <div className="flex flex-col gap-6 bg-white p-2">
        <div className="flex items-center justify-center gap-2">
          <h2 className="text-xl font-bold text-gray-900">Update Main Category</h2>
        </div>

        <div className="flex flex-col gap-4">
          <input
            type="text"
            value={formData.categoryName}
            onChange={(e) => setFormData(p => ({ ...p, categoryName: e.target.value }))}
            className="w-full rounded-lg border-2 border-blue-900 px-4 py-3 text-lg font-medium text-gray-900 focus:border-blue-700 focus:outline-none"
            placeholder="Category Name"
          />

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

          <div className="flex items-center gap-4">
            <span className="font-semibold text-gray-700">Has Sub Category:</span>
            <ToggleSwitch
              isOn={formData.isSubCategory}
              onToggle={() => setFormData(p => ({ ...p, isSubCategory: !p.isSubCategory }))}
            />
          </div>

          <div className="mt-2">
            <label className="mb-2 block text-sm font-bold text-gray-700">Update Image</label>
            <ImageBoxUploader
              onImageSelected={handleImageChange}
              previewUrl={
                formData.imageFile
                  ? URL.createObjectURL(formData.imageFile)
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
    <div className="rounded-lg border border-blue-900 bg-gray-100 p-4 shadow-md">
      <div className="mb-4 flex items-center justify-between bg-white p-3 border rounded">
        <span className="font-bold">Add Main Category</span>
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-gray-700">Visibility</span>
          <ToggleSwitch
            isOn={formData.visibility}
            onToggle={() => setFormData(p => ({ ...p, visibility: !p.visibility }))}
          />
        </div>
      </div>

      <div className="mb-4">
        <label className="font-semibold">Select Parent Category</label>
        <select
          value={formData.selectCategory}
          onChange={(e) => setFormData(p => ({ ...p, selectCategory: e.target.value }))}
          className="w-full border p-2 rounded"
        >
          {fixedParentCategories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label className="font-semibold">Main Category Name</label>
        <div className="flex items-center gap-2 mt-1">
          <input
            type="text"
            value={formData.categoryName}
            onChange={(e) => setFormData(p => ({ ...p, categoryName: e.target.value }))}
            className="flex-1 border p-2 rounded"
            placeholder="Enter category name"
          />
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-gray-700">Name Visible</span>
            <ToggleSwitch
              isOn={formData.nameVisibility}
              onToggle={() => setFormData(p => ({ ...p, nameVisibility: !p.nameVisibility }))}
            />
          </div>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex items-center gap-4">
          <ImageBoxUploader
            onImageSelected={handleImageChange}
            previewUrl={
              formData.imageFile
                ? URL.createObjectURL(formData.imageFile)
                : undefined
            }
          />
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-gray-700">Image Visible</span>
            <ToggleSwitch
              isOn={formData.imageVisibility}
              onToggle={() => setFormData(p => ({ ...p, imageVisibility: !p.imageVisibility }))}
            />
          </div>
        </div>
      </div>

      <div className="mb-4 flex items-center gap-2">
        <span className="font-semibold">Has Sub Category</span>
        <ToggleSwitch
          isOn={formData.isSubCategory}
          onToggle={() => setFormData(p => ({ ...p, isSubCategory: !p.isSubCategory }))}
        />
      </div>

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