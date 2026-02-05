"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Save } from "lucide-react";
import { useCategory } from "../../context/CategoryContext";
import { BASE_URL, API_TOKEN } from "../../utils/api";

const initialFormData = {
  mainCategoryId: "",
  subCategoryId: "",
  repair: false,
  services: false,
  installation: false,
  name: "",
  visible: true,
};

interface ChildCategoryFormProps {
  onSuccess?: () => void;
  editingCategory?: any;
}

const ChildCategoryForm = ({ onSuccess, editingCategory }: ChildCategoryFormProps) => {
  const {
    addChildCategory,
    updateChildCategory,
    updateChildCategoryWithSub,
    mainCategories,
    childCategories
  } = useCategory();

  /* ================= STATE ================= */
  const [formData, setFormData] = useState(initialFormData);

  const [mainSearch, setMainSearch] = useState("");
  const [mainOpen, setMainOpen] = useState(false);
  const [selectedMainCategory, setSelectedMainCategory] = useState<any>(null);

  const [subCategories, setSubCategories] = useState<any[]>([]);
  const [subSearch, setSubSearch] = useState("");
  const [subOpen, setSubOpen] = useState(false);

  /* ================= MAIN SELECT ================= */
  const handleMainSelect = (cat: any) => {
    setMainSearch(cat.name);
    setMainOpen(false);
    setSelectedMainCategory(cat);

    setFormData({
      ...initialFormData,
      mainCategoryId: cat._id || cat.documentId,
    });

    setSubCategories([]);
    setSubSearch("");
    setSubOpen(false);
  };

  /* ================= POPULATE IN EDIT MODE ================= */
  useEffect(() => {
    if (editingCategory) {
      setFormData({
        ...initialFormData,
        name: editingCategory.name || "",
        visible: editingCategory.visible ?? editingCategory.isChildCategoryVisible ?? true,
        mainCategoryId: editingCategory.mainCategoryId || "",
        subCategoryId: editingCategory.subCategoryId || "",
      });
    }
  }, [editingCategory]);

  /* ================= SUB CATEGORY API ================= */
  useEffect(() => {
    if (!selectedMainCategory) return;

    const fetchSubCategories = async () => {
      try {
        const token = localStorage.getItem("token");
        const url = `${BASE_URL}/main/${selectedMainCategory._id}/sub`;

        const res = await fetch(url, {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
            "x-api-token": API_TOKEN,
            "Content-Type": "application/json",
          },
        });

        const json = await res.json();
        const rawData = json?.data || {};

        const list = Object.entries(rawData).map(
          ([_, value]: any) => ({
            documentId: value.documentId,
            name: value.name,
          })
        );

        setSubCategories(list);
      } catch {
        setSubCategories([]);
      }
    };

    fetchSubCategories();
  }, [selectedMainCategory]);

  /* ================= FILTERED SUB (MATCH FIRST) ================= */
  const filteredSubCategories = useMemo(() => {
    if (!subSearch) return subCategories;

    return [...subCategories].sort((a, b) => {
      const aMatch = a.name.toLowerCase().startsWith(subSearch.toLowerCase());
      const bMatch = b.name.toLowerCase().startsWith(subSearch.toLowerCase());
      return aMatch === bMatch ? 0 : aMatch ? -1 : 1;
    }).filter(sub =>
      sub.name.toLowerCase().includes(subSearch.toLowerCase())
    );
  }, [subSearch, subCategories]);

  /* ================= INPUT CHANGE ================= */
  const handleChange = (e: any) => {
    const { name, checked, type, value } = e.target;
    const val = type === 'checkbox' ? checked : value;
    setFormData(prev => ({ ...prev, [name]: val }));
  };

  /* ================= SAVE ================= */
  const handleSave = async () => {
    // EDIT MODE
    if (editingCategory) {
      try {
        if (!formData.name.trim()) {
          alert("Child category name is required");
          return;
        }

        const updateData = {
          ...editingCategory,
          name: formData.name,
          visible: formData.visible,
        };

        // Call the correct update function based on whether there's a subCategoryId
        if (editingCategory.subCategoryId) {
          await updateChildCategoryWithSub(updateData);
        } else {
          await updateChildCategory(updateData);
        }

        alert("Child category updated successfully ✅");
        onSuccess?.();
      } catch (err) {
        console.error(err);
        alert("Failed to update child category");
      }
      return;
    }

    // ADD MODE
    if (!formData.mainCategoryId) {
      alert("Select main category");
      return;
    }

    let subIdToUse = formData.subCategoryId;

    // ✅ Smart subcategory handling
    if (selectedMainCategory?.hasSubCategory || subCategories.length > 0) {
      console.log("📋 Main category requires subcategory. Checking...");
      console.log("📊 Available subcategories:", subCategories.length);

      // Case 1: Subcategories loaded and user typed something
      if (subCategories.length > 0) {
        // Try to auto-match if user typed exact name
        if (!subIdToUse && subSearch) {
          const match = subCategories.find(
            (s) => s.name.toLowerCase().trim() === subSearch.toLowerCase().trim()
          );
          if (match) {
            subIdToUse = match.documentId;
            console.log("✅ Auto-matched subcategory:", match.name);
          }
        }

        // If still no match, show error
        if (!subIdToUse) {
          alert(
            `⚠️ Please select a valid Sub Category.\n\n` +
            `Available options: ${subCategories.map(s => s.name).join(', ')}\n\n` +
            `You can click on the dropdown to see all options.`
          );
          return;
        }
      }
      // Case 2: No subcategories exist yet
      else {
        // ✅ Auto-proceed without annoying alert
        // If hasSubCategory is true but no subcategories exist, we allow direct child creation.
        console.log("⚠️ Main has hasSubCategory but no subcategories found. Proceeding directly.");
        subIdToUse = "";
      }
    }

    const types: string[] = [];
    if (formData.repair) types.push("Repair");
    if (formData.services) types.push("Services");
    if (formData.installation) types.push("Installation");

    if (!types.length) {
      alert("Select at least one type");
      return;
    }

    for (const type of types) {
      await addChildCategory({
        name: type,
        mainCategoryId: formData.mainCategoryId,
        subCategoryId: (selectedMainCategory?.hasSubCategory || subCategories.length > 0)
          ? (subIdToUse || undefined)
          : undefined,
        visible: true,
      });
    }

    // ✅ FULL RESET AFTER MONGO SAVE
    setFormData(initialFormData);
    setMainSearch("");
    setSubSearch("");
    setSelectedMainCategory(null);
    setSubCategories([]);
    setMainOpen(false);
    setSubOpen(false);

    alert("Child category added successfully ✅");
    onSuccess?.();
  };


  /* ================= UI ================= */

  // EDIT MODE UI
  if (editingCategory) {
    return (
      <div className="rounded-lg border border-blue-500 bg-gray-200 p-4">
        <h3 className="mb-4 text-lg font-bold">Edit Child Category</h3>

        <label className="font-bold">Category Name</label>
        <input
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter category name..."
          className="w-full mb-4 border px-3 py-2 mt-2 rounded"
        />

        <label className="font-bold flex items-center gap-2 mb-4">
          <input
            type="checkbox"
            name="visible"
            checked={formData.visible}
            onChange={handleChange}
          />
          Visible
        </label>

        <button
          onClick={handleSave}
          className="mt-4 bg-blue-900 text-white px-4 py-2 rounded flex gap-2 items-center hover:bg-blue-800"
        >
          <Save size={16} /> Update
        </button>
      </div>
    );
  }

  // ADD MODE UI
  return (
    <div className="rounded-lg border border-red-500 bg-gray-200 p-4">
      <h3 className="mb-4 text-lg font-bold">Manage Child Category</h3>

      {/* MAIN CATEGORY */}
      <label className="font-bold">Select Main Category</label>
      <input
        value={mainSearch}
        placeholder="Search main category..."
        onChange={(e) => {
          setMainSearch(e.target.value);
          setMainOpen(true);
        }}
        className="w-full mb-2 border px-3 py-2 mt-2"
      />

      {mainOpen && (
        <div className="bg-white border max-h-40 overflow-y-auto">
          {mainCategories
            .filter(
              (cat) =>
                cat?.name &&
                cat.name.toLowerCase().includes(mainSearch.toLowerCase())
            )
            .map((cat) => (
              <div
                key={cat._id}
                className="px-3 py-2 cursor-pointer hover:bg-blue-100"
                onClick={() => handleMainSelect(cat)}
              >
                {cat.name}
              </div>
            ))}
        </div>
      )}


      {/* SUB CATEGORY */}
      {(selectedMainCategory?.hasSubCategory || subCategories.length > 0) && (
        <>
          <label className="font-bold mt-3 block">Select Sub Category</label>
          <input
            value={subSearch}
            placeholder="Search sub category..."
            onChange={(e) => {
              setSubSearch(e.target.value);
              setSubOpen(true);
            }}
            className="w-full mb-2 border px-3 py-2"
          />

          {subOpen && filteredSubCategories.length > 0 && (
            <div className="bg-white border max-h-40 overflow-y-auto">
              {filteredSubCategories.map(sub => (
                <div
                  key={sub.documentId}
                  className="px-3 py-2 cursor-pointer hover:bg-blue-100"
                  onClick={() => {
                    setSubSearch(sub.name);
                    setFormData(prev => ({
                      ...prev,
                      subCategoryId: sub.documentId,
                    }));
                    setSubOpen(false); // 🔥 CLOSE DROPDOWN
                  }}
                >
                  {sub.name}
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* TYPES */}
      <div className="mt-3 space-y-1">
        {["repair", "services", "installation"].map(type => (
          <label key={type} className="flex gap-2">
            <input
              type="checkbox"
              name={type}
              checked={(formData as any)[type]}
              onChange={handleChange}
            />
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </label>
        ))}
      </div>

      <button
        onClick={handleSave}
        className="mt-4 bg-blue-900 text-white px-4 py-2 flex gap-2"
      >
        <Save size={16} /> Save
      </button>

      <div className="mt-4">
        <h4 className="font-bold">Child Categories</h4>
        {childCategories.map(child => (
          <div key={child.documentId}>• {child.name}</div>
        ))}
      </div>
    </div>
  );
};

export default ChildCategoryForm;

