
// "use client";

// import React, { useEffect, useMemo, useState } from "react";
// import { Save } from "lucide-react";
// import { useCategory } from "../../context/CategoryContext";

// const ChildCategoryForm = () => {
//   const { addChildCategory, mainCategories, childCategories } = useCategory();

//   /* ================= STATE ================= */
//   const [formData, setFormData] = useState({
//     mainCategoryId: "",
//     subCategoryId: "",
//     repair: false,
//     services: false,
//     installation: false,
//   });

//   const [mainSearch, setMainSearch] = useState("");
//   const [mainOpen, setMainOpen] = useState(false);

//   const [selectedMainCategory, setSelectedMainCategory] = useState<any>(null);

//   const [subCategories, setSubCategories] = useState<any[]>([]);
//   const [subSearch, setSubSearch] = useState("");

//   /* ================= MAIN SELECT ================= */
//   const handleMainSelect = (cat: any) => {
//     console.log("✅ MAIN CATEGORY SELECTED (FULL DATA):", cat);

//     setMainSearch(cat.name);
//     setMainOpen(false);
//     setSelectedMainCategory(cat);

//     setFormData({
//       mainCategoryId: cat._id || cat.documentId,
//       subCategoryId: "",
//       repair: false,
//       services: false,
//       installation: false,
//     });

//     // reset sub data
//     setSubCategories([]);
//     setSubSearch("");
//   };

//   /* ================= SUB CATEGORY API (ON INPUT SHOW) ================= */
//   useEffect(() => {
//     if (!selectedMainCategory) return;

//     if (selectedMainCategory.hasSubCategory !== true) {
//       console.log("ℹ️ No subcategory for this main category");
//       return;
//     }

//     console.log("👀 Subcategory input visible → calling API");

//     const fetchSubCategories = async () => {
//       try {
//         const token = localStorage.getItem("token");

//         const url = `https://api.bijliwalaaya.in/api/product-listing/main/${selectedMainCategory._id}/sub`;
//         console.log("🚀 SUB CATEGORY API URL:", url);

//         const res = await fetch(url, {
//           headers: {
//             Authorization: token ? `Bearer ${token}` : "",
//             "x-api-token": "super_secure_token",
//             "Content-Type": "application/json",
//           },
//         });

//         const json = await res.json();
//         console.log("🔥 RAW SUB CATEGORY RESPONSE:", json);

//         const rawData = json?.data || {};

//         const list = Object.entries(rawData).map(
//           ([_, value]: any) => ({
//             documentId: value.documentId,
//             name: value.name,
//           })
//         );

//         console.log("✅ FINAL SUB CATEGORY LIST:", list);
//         setSubCategories(list);
//       } catch (err) {
//         console.error("❌ Sub category API failed", err);
//         setSubCategories([]);
//       }
//     };

//     fetchSubCategories();
//   }, [selectedMainCategory]);

//   /* ================= TEXT WATCHER ================= */
//   const filteredSubCategories = useMemo(() => {
//     if (!subSearch) return subCategories;

//     return subCategories.filter(sub =>
//       sub.name.toLowerCase().includes(subSearch.toLowerCase())
//     );
//   }, [subSearch, subCategories]);

//   /* ================= HANDLER ================= */
//   const handleChange = (e: any) => {
//     const { name, value, checked, type } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: type === "checkbox" ? checked : value,
//     }));
//   };

//   /* ================= SAVE ================= */
//   const handleSave = async () => {
//     if (!formData.mainCategoryId) {
//       alert("Select main category");
//       return;
//     }

//     if (
//       selectedMainCategory?.hasSubCategory === true &&
//       !formData.subCategoryId
//     ) {
//       alert("Select sub category");
//       return;
//     }

//     const types: string[] = [];
//     if (formData.repair) types.push("Repair");
//     if (formData.services) types.push("Services");
//     if (formData.installation) types.push("Installation");

//     if (!types.length) {
//       alert("Select at least one type");
//       return;
//     }

//     for (const type of types) {
//       await addChildCategory({
//         name: type,
//         mainCategoryId: formData.mainCategoryId,
//         subCategoryId:
//           selectedMainCategory?.hasSubCategory === true
//             ? formData.subCategoryId
//             : null,
//         visible: true,
//       });
//     }

//     alert("Child category added ✅");
//   };

//   /* ================= UI ================= */
//   return (
//     <div className="rounded-lg border border-red-500 bg-gray-200 p-4">
//       <h3 className="mb-4 text-lg font-bold">Manage Child Category</h3>

//       {/* ===== MAIN CATEGORY ===== */}
//       <label className="font-bold ">Select Main Category</label>
//       <input
//         value={mainSearch}
//         placeholder="Search main category..."
//         onChange={(e) => {
//           setMainSearch(e.target.value);
//           setMainOpen(true);
//         }}
//         className="w-full mb-2 border px-3 py-2 mt-2"
//       />

//       {mainOpen && (
//         <div className="bg-white border max-h-40 overflow-y-auto">
//           {mainCategories
//             .filter(cat =>
//               cat.name.toLowerCase().includes(mainSearch.toLowerCase())
//             )
//             .map(cat => (
//               <div
//                 key={cat._id}
//                 className="px-3 py-2 cursor-pointer hover:bg-blue-100"
//                 onClick={() => handleMainSelect(cat)}
//               >
//                 {cat.name}
//               </div>
//             ))}
//         </div>
//       )}

//       {/* ===== SUB CATEGORY (TEXT WATCHER) ===== */}
//       {selectedMainCategory?.hasSubCategory === true && (
//         <>
//           <label className="font-bold mt-3 block">
//             Select Sub Category
//           </label>

//           <input
//             value={subSearch}
//             placeholder="Search sub category..."
//             onChange={(e) => setSubSearch(e.target.value)}
//             className="w-full mb-2 border px-3 py-2"
//           />

//           {filteredSubCategories.length > 0 && (
//             <div className="bg-white border max-h-40 overflow-y-auto">
//               {filteredSubCategories.map(sub => (
//                 <div
//                   key={sub.documentId}
//                   className="px-3 py-2 cursor-pointer hover:bg-blue-100"
//                   onClick={() => {
//                     setSubSearch(sub.name);
//                     setFormData(prev => ({
//                       ...prev,
//                       subCategoryId: sub.documentId,
//                     }));
//                   }}
//                 >
//                   {sub.name}
//                 </div>
//               ))}
//             </div>
//           )}
//         </>
//       )}

//       {/* ===== TYPES ===== */}
//       <div className="mt-3 space-y-1">
//         <label className="flex gap-2">
//           <input type="checkbox" name="repair" checked={formData.repair} onChange={handleChange} />
//           Repair
//         </label>
//         <label className="flex gap-2">
//           <input type="checkbox" name="services" checked={formData.services} onChange={handleChange} />
//           Services
//         </label>
//         <label className="flex gap-2">
//           <input type="checkbox" name="installation" checked={formData.installation} onChange={handleChange} />
//           Installation
//         </label>
//       </div>

//       <button
//         onClick={handleSave}
//         className="mt-4 bg-blue-900 text-white px-4 py-2 flex gap-2"
//       >
//         <Save size={16} /> Save
//       </button>

//       <div className="mt-4">
//         <h4 className="font-bold">Child Categories</h4>
//         {childCategories.map(child => (
//           <div key={child.documentId}>• {child.name}</div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default ChildCategoryForm;


"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Save } from "lucide-react";
import { useCategory } from "../../context/CategoryContext";

const initialFormData = {
  mainCategoryId: "",
  subCategoryId: "",
  repair: false,
  services: false,
  installation: false,
};

const ChildCategoryForm = () => {
  const { addChildCategory, mainCategories, childCategories } = useCategory();

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

  /* ================= SUB CATEGORY API ================= */
  useEffect(() => {
    if (!selectedMainCategory || selectedMainCategory.hasSubCategory !== true) return;

    const fetchSubCategories = async () => {
      try {
        const token = localStorage.getItem("token");
        const url = `https://api.bijliwalaaya.in/api/product-listing/main/${selectedMainCategory._id}/sub`;

        const res = await fetch(url, {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
            "x-api-token": "super_secure_token",
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

  /* ================= CHECKBOX ================= */
  const handleChange = (e: any) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  /* ================= SAVE ================= */
  const handleSave = async () => {
    if (!formData.mainCategoryId) {
      alert("Select main category");
      return;
    }

    if (selectedMainCategory?.hasSubCategory && !formData.subCategoryId) {
      alert("Select sub category");
      return;
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
        subCategoryId: selectedMainCategory?.hasSubCategory
          ? formData.subCategoryId
          : "",
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
  };

  /* ================= UI ================= */
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
      {selectedMainCategory?.hasSubCategory && (
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
