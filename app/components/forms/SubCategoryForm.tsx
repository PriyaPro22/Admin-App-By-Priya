"use client";

import React, { useState } from "react";
import { Image as ImageIcon, Save } from "lucide-react";
import ToggleSwitch from "../ui/ToggleSwitch";
import { ImageBoxUploader } from "../ui/ImageUploader";
import { useCategory } from "../../context/CategoryContext";
import { generateCategoryId } from "../../utils/generateCategoryId";

const SubCategoryForm = () => {
  const { addSubCategory, mainCategories } = useCategory();
const [search, setSearch] = useState("");
const [open, setOpen] = useState(false);
  
  
const initialFormData = {
  mainCategoryId: "",
  subCategoryName: "",
  mainVisibility: false,
  inputVisibility: true,
  imageVisibility: true,
  image: null,
};

const [formData, setFormData] = useState(initialFormData);


// ye new function h 
// const filteredCategories = mainCategories
//   .filter(cat => typeof cat.name === "string" && cat.name.trim() !== "")
//   .filter(cat =>
//     search.trim() === ""
//       ? true
//       : cat.name.toLowerCase().includes(search.toLowerCase())
//   );
const filteredCategories = (() => {
  const q = search.trim().toLowerCase();

  // ✅ only categories with valid name
  const list = mainCategories.filter(
    cat =>
      typeof cat.name === "string" &&
      cat.name.trim() !== ""
  );

  // 🔹 search empty → show all (A–Z)
  if (!q) {
    return [...list].sort((a, b) =>
      a.name.localeCompare(b.name)
    );
  }

  // 🔥 STARTS WITH (priority 1)
  const startsWith = list.filter(cat =>
    cat.name.toLowerCase().startsWith(q)
  );

  // 🔥 CONTAINS (priority 2)
  const contains = list.filter(cat =>
    !cat.name.toLowerCase().startsWith(q) &&
    cat.name.toLowerCase().includes(q)
  );

  return [
    ...startsWith.sort((a, b) => a.name.localeCompare(b.name)),
    ...contains.sort((a, b) => a.name.localeCompare(b.name)),
  ];
})();




  const handleImageSelect = (file: File) => {
    setFormData((prev) => ({ ...prev, image: file }));
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleToggle = (key: keyof typeof formData) => {
    setFormData((prev) => ({ ...prev, [key]: !prev[key] as boolean }));
  };

//   const handleSave = async () => {
//   if (!formData.mainCategoryId) {
//     alert("Please select Main Category");
//     return;
//   }

//   if (!formData.subCategoryName.trim()) {
//     alert("SubCategory name required");
//     return;
//   }

//   const generatedId = generateCategoryId(formData.subCategoryName);

//   await addSubCategory({
//     _id: generatedId,                // 🔥 REQUIRED
//     name: formData.subCategoryName,
//     mainCategoryId: formData.mainCategoryId, // 🔥 parent MAIN category _id
//     visible: formData.inputVisibility,
//   });

//   alert("SubCategory added successfully ✅");

//   setFormData({
//     mainCategoryId: "",
//     subCategoryName: "",
//     mainVisibility: false,
//     inputVisibility: false,
//     imageVisibility: false,
//     image: null,
//   });
// };
const handleSave = async () => {
  if (!formData.mainCategoryId) {
    alert("Please select Main Category");
    return;
  }

  if (!formData.subCategoryName.trim()) {
    alert("SubCategory name required");
    return;
  }

  const generatedId = generateCategoryId(formData.subCategoryName);

  await addSubCategory({
    _id: generatedId,                // 🔥 REQUIRED
    name: formData.subCategoryName,
    mainCategoryId: formData.mainCategoryId, // 🔥 parent MAIN category _id
    visible: formData.inputVisibility,
  });

  alert("SubCategory added successfully ✅");

  // ✅ FULL RESET (VERY IMPORTANT)
  setFormData({
    mainCategoryId: "",
    subCategoryName: "",
    mainVisibility: false,
    inputVisibility: false,
    imageVisibility: false,
    image: null,
  });

  // ✅ EXTRA UX FIXES
  setSearch("");     // main category input clear
  setOpen(false);    // dropdown close
};

  return (
    <div className="rounded-lg border border-green-500 bg-gray-200 p-4 shadow-md">
      <div className="mb-4 flex items-center justify-between rounded-md border-2 border-blue-900 bg-white px-4 py-2">
        <span className="font-bold text-gray-900">Manage Sub Category</span>
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-gray-700">
            Visibility
          </span>
          <ToggleSwitch
            isOn={formData.mainVisibility}
            onToggle={() => handleToggle("mainVisibility")}
          />
        </div>
      </div>
      {/* isko hta skte h  */}
   <h1 className="text-black font-bold">
  Select Main Category Name
</h1>
      <div className="relative mb-2 mt-2">
  {/* INPUT */}
  <input
    type="text"
    placeholder="Select Main Category"
    value={
      formData.mainCategoryId
        ? mainCategories.find(c => c._id === formData.mainCategoryId)?.name || ""
        : search
    }
    onChange={(e) => {
      setSearch(e.target.value);
      setOpen(true);
      setFormData(prev => ({ ...prev, mainCategoryId: "" }));
    }}
    onFocus={() => setOpen(true)}
    className="w-full rounded-md border-2 border-blue-900 px-3 py-2 text-black"
  />

  {/* DROPDOWN */}
  {open && (
    <div className="absolute z-50 mt-1 max-h-48 w-full overflow-y-auto rounded-md border bg-white shadow-lg">
      {filteredCategories.length > 0 ? (
        filteredCategories.map(cat => (
          <div
            key={cat._id}
            onClick={() => {
              setFormData(prev => ({
                ...prev,
                mainCategoryId: cat._id
              }));
              setSearch(cat.name);
              setOpen(false);
            }}
            className="cursor-pointer px-3 py-2 hover:bg-blue-100 text-black"
          >
            {cat.name}
          </div>
        ))
      ) : (
        <div className="px-3 py-2 text-gray-500">
          No result found
        </div>
      )}
    </div>
  )}
</div>


      <div className="mb-4">
        <div className="flex items-center justify-between mb-1">
          <label className="block font-semibold text-gray-900">
            Enter Sub Category Name
          </label>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-xs font-semibold text-gray-700">
              Visibility
            </span>
            <ToggleSwitch
              isOn={formData.inputVisibility}
              onToggle={() => handleToggle("inputVisibility")}
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
            previewUrl={null}
          />
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-gray-700">
              Visibility
            </span>
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
          className="flex items-center gap-2 rounded-lg bg-blue-900 px-6 py-2 font-bold text-white transition-transform hover:scale-105 active:scale-95"
        >
          <Save size={20} />
          Save
        </button>
      </div>
    </div>
  );
};

export default SubCategoryForm;
