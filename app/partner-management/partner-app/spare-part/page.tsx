"use client";

import { useState,useEffect } from "react";
import { Pencil, Trash2, CalendarDays, Search,Plus, Save } from "lucide-react";



export default function InventoryPage() {
  const [showForm, setShowForm] = useState(false);
  const [editingPart, setEditingPart] = useState(null);

//   Dynamic Data
const [categories, setCategories] = useState([]);
const [loadingCategories, setLoadingCategories] = useState(false);
const departmentList = [
  "Home Appliances",
  "Computer",
  "Mobile"
];

const fetchCategoriesByDepartment = async (department) => {
  try {
    setLoadingCategories(true);

    const encodedDepartment = encodeURIComponent(department);

    const res = await fetch(
      `https://api.bijliwalaaya.in/api/product-listing/category/by-parent/${encodedDepartment}`,
      {
        headers: {
          "Content-Type": "application/json",
          "x-api-token": "super_secure_token",
        },
      }
    );

    const result = await res.json();
    console.log("API Response:", result);

    if (result.success && result.data) {
      setCategories(result.data);
    } else {
      setCategories([]);
    }
  } catch (err) {
    console.error(err);
    setCategories([]);
  } finally {
    setLoadingCategories(false);
  }
};

const [selectedDepartment, setSelectedDepartment] = useState("");
const [categoryOptions, setCategoryOptions] = useState([]);
const [searchTerm, setSearchTerm] = useState("");
const [selectedCategory, setSelectedCategory] = useState("");

const handleDepartmentChange = (e) => {
  const value = e.target.value;

  setSelectedDepartment(value);
  setSelectedCategory("");
  
  // formData bhi reset karo
  setFormData((prev) => ({
    ...prev,
    mainCategory: value,
    subCategory: "",
  }));

  if (value) {
    fetchCategoriesByDepartment(value);
  } else {
    setCategories([]);
  }
};



const filteredOptions = categoryOptions
  .filter((item) =>
    `${item.main} ${item.sub}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  )
  .sort((a, b) => {
    const aMatch = `${a.main} ${a.sub}`
      .toLowerCase()
      .startsWith(searchTerm.toLowerCase());
    const bMatch = `${b.main} ${b.sub}`
      .toLowerCase()
      .startsWith(searchTerm.toLowerCase());

    return bMatch - aMatch; // match wala upar
  });

  // Inventory Data
 const [inventory, setInventory] = useState([]);
// Productlistin spare part get
const [mainCategories, setMainCategories] = useState([]);
const [loadingMainCategory, setLoadingMainCategory] = useState(false);

// const fetchMainCategories = async () => {
//   try {
//     setLoadingMainCategory(true);

//     const res = await fetch(
//       "https://api.bijliwalaaya.in/api/product-listing/main",
//       {
//         method: "GET",
//         headers: {
//           "Content-Type": "application/json",
//           "x-api-token": "super_secure_token",
//         },
//       }
//     );

//     const result = await res.json();
//     console.log("Main Category API:", result);

//     if (result.success) {
//       const filtered = result.data.filter((item) => {
//         const isVisible =
//           item.isMainCategoryVisible === true ||
//           item.isMainCategoryVisible === "true";

//         return item.name && isVisible;
//       });

//       console.log("Filtered Categories:", filtered);

//       setMainCategories(filtered);
//     }
//   } catch (error) {
//     console.error("Main Category API Error:", error);
//   } finally {
//     setLoadingMainCategory(false);
//   }
// };


// const fetchSubCategories = async (mainCategoryId) => {
//   try {
//     setLoadingSubCategory(true);

//     const res = await fetch(
//       `https://api.bijliwalaaya.in/api/product-listing/main/${mainCategoryId}/sub`,
//       {
//         method: "GET",
//         headers: {
//           "Content-Type": "application/json",
//           "x-api-token": "super_secure_token",
//         },
//       }
//     );

//     const result = await res.json();
//     console.log("Sub Category API:", result);

//     if (result.success && result.data) {
//       const subArray = Object.values(result.data)
//         .filter(
//           (item) =>
//             item.isSubCategoryVisible === true ||
//             item.isSubCategoryVisible === "true"
//         )
//         .map((item) => ({
//           id: item.documentId,
//           name: item.name,
//         }));

//       setAvailableSubCategories(subArray);
//     } else {
//       setAvailableSubCategories([]);
//     }
//   } catch (error) {
//     console.error("SubCategory API Error:", error);
//     setAvailableSubCategories([]);
//   } finally {
//     setLoadingSubCategory(false);
//   }
// };


  // Form State
 const [formData, setFormData] = useState({
  mainCategory: "",
  subCategory: "",
  partName: "",
  basePrice: "",
  gstRate: "",
  gstStatus: "Excluded",
  warrantyAvailable: false,
  warrantyPeriod: "",
});

// handle change
const handleChange = (e) => {
  const { name, value, type, checked } = e.target;

  setFormData((prev) => ({
    ...prev,
    [name]: type === "checkbox" ? checked : value,
  }));
};



//   Category Map
const categoryMap = {
  "Engine Components": ["Pistons & Rings", "Gaskets"],
  "Braking System": ["Brake Pads", "Brake Discs"],
  "Electrical Parts": ["Sensors", "Fuel Injectors"],
  "Suspension": [] // ❌ No subcategories
};

const [availableSubCategories, setAvailableSubCategories] = useState(
  categoryMap[formData.mainCategory] || []
);

const [loadingSubCategory, setLoadingSubCategory] = useState(false);
// const handleChange = (e) => {
//   const { name, value, type, checked } = e.target;
// if (name === "mainCategory") {
//   const selectedCategory = mainCategories.find(
//     (cat) => cat.name === value
//   );

//   setFormData((prev) => ({
//     ...prev,
//     mainCategory: value,
//     subCategory: "",
//   }));

//   if (selectedCategory?._id) {
//     fetchSubCategories(selectedCategory._id);
//   } else {
//     setAvailableSubCategories([]);
//   }

//   return;
// }



//   setFormData((prev) => ({
//     ...prev,
//     [name]: type === "checkbox" ? checked : value,
//   }));
// };


// Data Get
const formatApiData = (apiData) => {
  let partsArray = [];

  apiData.forEach((category) => {
    // Case 1: Direct spareParts
    if (category.spareParts) {
      Object.values(category.spareParts).forEach((part) => {
        partsArray.push({
          id: part.docId,
          name: part.partName,
          subCategory: category.docName,
          category: category.docName,
          categoryColor: "blue",
          basePrice: part.partPrice,
          gst: part.gstPercent,
          finalPrice: part.finalPrice,
          mainCategory: category.docName,
          gstRate: part.gstPercent,
          gstStatus: part.gstType,
          warrantyAvailable: part.hasWarranty,
          warrantyPeriod: part.warrantyDays,
        });
      });
    }

    // Case 2: Subcategory ke andar spareParts
    if (category.subcategory) {
      Object.values(category.subcategory).forEach((subCat) => {
        Object.values(subCat.spareParts).forEach((part) => {
          partsArray.push({
            id: part.docId,
            name: part.partName,
            subCategory: subCat.docName,
            category: category.docName,
            categoryColor: "blue",
            basePrice: part.partPrice,
            gst: part.gstPercent,
            finalPrice: part.finalPrice,
            mainCategory: category.docName,
            gstRate: part.gstPercent,
            gstStatus: part.gstType,
            warrantyAvailable: part.hasWarranty,
            warrantyPeriod: part.warrantyDays,
          });
        });
      });
    }
  });

  return partsArray;
};

// Api Call
useEffect(() => {
  fetchRateCard();
//   fetchMainCategories();   
}, []);

const fetchRateCard = async () => {
  try {
    const res = await fetch(
      "https://api.bijliwalaaya.in/api/partner-rate-card",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-api-token": "super_secure_token",
        },
      }
    );

    console.log("Response status:", res.status);

    const result = await res.json();
    console.log("Full API Response:", result);

    if (result.success) {
      const formattedData = formatApiData(result.data);
      setInventory(formattedData);
    }
  } catch (error) {
    console.error("API Error:", error);
  }
};




  const handleAddNew = () => {
    setEditingPart(null);
    setFormData({
      mainCategory: "Engine Components",
      subCategory: "Pistons & Rings",
      partName: "",
      basePrice: "450.00",
      gstRate: "18",
      gstStatus: "Included",
      warrantyAvailable: true,
      warrantyPeriod: "365",
    });
    setShowForm(true);
  };

  const handleEdit = (part) => {
    setEditingPart(part);
    setFormData({
      mainCategory: part.mainCategory || "Engine Components",
      subCategory: part.subCategory || "Pistons & Rings",
      partName: part.name || part.partName || "",
      basePrice: part.basePrice || "450.00",
      gstRate: part.gst || part.gstRate || "18",
      gstStatus: part.gstStatus || "Included",
      warrantyAvailable: part.warrantyAvailable !== undefined ? part.warrantyAvailable : true,
      warrantyPeriod: part.warrantyPeriod || "365",
    });
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingPart(null);
  };

  const handleSave = (e) => {
    e.preventDefault();
    
    // Calculate final price
    const basePrice = parseFloat(formData.basePrice) || 0;
    const gstRate = parseFloat(formData.gstRate) || 0;
    
    let finalPrice = basePrice;
    if (formData.gstStatus === "Excluded") {
      finalPrice = basePrice + (basePrice * gstRate / 100);
    } else {
      finalPrice = basePrice;
    }

    const newPart = {
      id: editingPart ? editingPart.id : `#SP-${Math.floor(4000 + Math.random() * 1000)}`,
      name: formData.partName,
      partName: formData.partName,
      subCategory: formData.subCategory,
      mainCategory: formData.mainCategory,
      category: formData.subCategory === "Pistons & Rings" ? "Internal" : 
                formData.subCategory === "Gaskets" ? "Internal" :
                formData.subCategory === "Fuel Injectors" ? "Electrical" : "General",
      categoryColor: "blue",
      basePrice: formData.basePrice,
      gst: formData.gstRate,
      finalPrice: finalPrice.toFixed(2),
      gstRate: formData.gstRate,
      gstStatus: formData.gstStatus,
      warrantyAvailable: formData.warrantyAvailable,
      warrantyPeriod: formData.warrantyPeriod,
    };

    if (editingPart) {
      // Update existing part
      setInventory(inventory.map(item => 
        item.id === editingPart.id ? newPart : item
      ));
    } else {
      // Add new part
      setInventory([...inventory, newPart]);
    }

    handleCloseForm();
  };

 

  const handleDelete = (id) => {
    if (confirm("Are you sure you want to delete this item?")) {
      setInventory(inventory.filter(item => item.id !== id));
    }
  };

  // Calculate GST and final price for display in form
  const basePrice = parseFloat(formData.basePrice) || 0;
  const gstRate = parseFloat(formData.gstRate) || 0;
  
  let gstValue = 0;
  let finalPrice = basePrice;

  if (formData.gstStatus === "Included") {
    gstValue = (basePrice * gstRate) / (100 + gstRate);
    finalPrice = basePrice;
  } else {
    gstValue = (basePrice * gstRate) / 100;
    finalPrice = basePrice + gstValue;
  }

  return (
    <div className="min-h-screen bg-white p-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">
          Inventory Management
        </h1>
        <p className="text-gray-500 mt-1">
          Add, track and manage your spare parts stock and pricing.
        </p>
      </div>

      {/* Actions Strip - Total Items and Add Button */}
    {/* Top Action Section */}
{/* Top Action Section */}
<div className="flex items-center gap-6 mb-10">

  {/* Total Items Card */}
  <div className="bg-gray-50 px-8 py-5 rounded-2xl border border-gray-200 shadow-sm">
    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">
      TOTAL ITEMS
    </p>
    <h2 className="text-3xl font-black text-blue-600 mt-2 leading-none">
      {inventory.length}
    </h2>
  </div>

  {/* Add New Spare Part Button */}
 <button
  onClick={handleAddNew}
  className="flex items-center gap-3 bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-4 rounded-2xl shadow-lg shadow-blue-200 transition-all duration-200"
>
  <Plus size={22} />
  <span className="text-base">
    Add New Spare Part
  </span>
</button>


</div>



      {/* Form Section - Only visible when showForm is true */}
   {showForm && (
  <div className="bg-white rounded-2xl border border-gray-200 shadow-sm mb-8">

    {/* Header */}
    <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Pencil className="w-6 h-6 text-blue-600" />
        <h3 className="text-2xl font-bold text-gray-900">
          Spare Part Specifications
        </h3>
      </div>

      <button
        onClick={handleCloseForm}
        className="text-gray-500 hover:text-gray-700 font-medium"
      >
        Close
      </button>
    </div>

   
    <form onSubmit={handleSave} className="p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">

       
       <div className="space-y-6">

  {/* 🔹 Select Department */}
  <div>
    <label className="block font-semibold text-gray-700 mb-2">
      Select Department
    </label>
<select
  value={selectedDepartment}
  onChange={handleDepartmentChange}
  className="w-full rounded-xl border border-gray-300 px-4 py-3"
>
  <option value="">Select Department</option>

  {departmentList.map((dept) => (
    <option key={dept} value={dept}>
      {dept}
    </option>
  ))}
</select>


  </div>

  {/* 🔹 Select Category */}
 {selectedDepartment && (
  <div>
    <label className="block font-semibold text-gray-700 mb-2">
      Select Category
    </label>

    {loadingCategories ? (
      <div className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-500">
        Loading...
      </div>
    ) : (
      <select
        value={selectedCategory}
       onChange={(e) => {
  const value = e.target.value;

  setSelectedCategory(value);

  setFormData((prev) => ({
    ...prev,
    subCategory: value,
  }));
}}

        className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">Select Category</option>

        {categories.map((item) => (
          <option key={item.documentId} value={item.name}>
            {item.name}
          </option>
        ))}
      </select>
    )}
  </div>
)}


  {/* 🔹 Spare Part Name */}
  <div>
    <label className="block font-semibold text-gray-700 mb-2">
      Spare Part Name
    </label>
    <input
      type="text"
      name="partName"
      value={formData.partName}
      onChange={handleChange}
      placeholder="e.g. V8 Performance Piston Kit"
      className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
      required
    />
  </div>

</div>


        {/* Middle Section */}
        <div className="space-y-6">
          <div>
            <label className="block font-semibold text-gray-700 mb-2">
              Base Price ($)
            </label>
            <input
              type="number"
              name="basePrice"
              value={formData.basePrice}
              onChange={handleChange}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"

            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-gray-700 mb-2">
                GST Rate
              </label>
              <select
                name="gstRate"
                value={formData.gstRate}
                onChange={handleChange}
               className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"

              >
                <option value="5">5%</option>
                <option value="12">12%</option>
                <option value="18">18%</option>
                <option value="28">28%</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-2">
                GST Status
              </label>
              <select
                name="gstStatus"
                value={formData.gstStatus}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"

              >
                <option>Excluded</option>
                <option>Included</option>
              </select>
            </div>
          </div>

          {/* Calculation Card */}
          <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
            <div className="flex justify-between mb-3">
              <span className="text-gray-600 font-medium">
                Calculated GST Value
              </span>
              <span className="font-bold text-gray-900">
                ${gstValue.toFixed(2)}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-blue-600 font-bold uppercase">
                Final Price
              </span>
              <span className="text-3xl font-bold text-blue-600">
                ${finalPrice.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="space-y-6">

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              name="warrantyAvailable"
              checked={formData.warrantyAvailable}
              onChange={handleChange}
              className="w-5 h-5 text-blue-600"
            />
            <span className="font-semibold text-gray-700">
              Warranty Available
            </span>
          </div>

          {formData.warrantyAvailable && (
            <div>
              <label className="block font-semibold text-gray-700 mb-2">
                Warranty Period (Days)
              </label>
              <div className="relative">
                <CalendarDays className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="number"
                  name="warrantyPeriod"
                  value={formData.warrantyPeriod}
                  onChange={handleChange}
                  className="w-full rounded-xl border-gray-300 px-4 py-3 pl-10"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 rounded-2xl shadow-lg flex items-center justify-center gap-3 transition"
          >
            <Save className="w-5 h-5" />
            Save Spare Part
          </button>

          <button
            type="button"
            onClick={handleCloseForm}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-4 rounded-2xl transition"
          >
            Clear Form
          </button>

        </div>
      </div>
    </form>
  </div>
)}

      {/* Inventory Table Section */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Table Header with Search */}
       <div className="p-6 border-b border-gray-100 flex justify-between items-center">
  <h3 className="text-lg font-bold text-gray-900">Inventory List</h3>

  <div className="relative">
    <Search
      size={18}
      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
    />

   <input
  type="text"
  placeholder="Search parts..."
  className="w-64 rounded-lg border border-gray-300 text-sm pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
/>

  </div>
</div>


        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">PART NAME</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">CATEGORY</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">BASE PRICE</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">GST %</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">FINAL PRICE</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">ACTIONS</th>
              </tr>
            </thead>
 <tbody className="divide-y divide-gray-100">
  {inventory.map((item) => (
    <tr key={item.id} className="hover:bg-gray-50 transition-colors">

      <td className="px-6 py-4 text-sm text-gray-500 font-medium">
        {item.id}
      </td>

      <td className="px-6 py-4">
        <div className="flex flex-col">
          <span className="text-sm font-bold text-gray-900">
            {item.name}
          </span>
          <span className="text-xs text-gray-500">
            {item.subCategory}
          </span>
        </div>
      </td>

      <td className="px-6 py-4">
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            item.categoryColor === "blue"
              ? "bg-blue-100 text-blue-800"
              : item.categoryColor === "amber"
              ? "bg-amber-100 text-amber-800"
              : "bg-emerald-100 text-emerald-800"
          }`}
        >
          {item.category}
        </span>
      </td>

      <td className="px-6 py-4 text-sm text-right font-medium text-gray-700">
        ${item.basePrice}
      </td>

      <td className="px-6 py-4 text-sm text-center text-gray-700">
        {item.gst}%
      </td>

      <td className="px-6 py-4 text-sm text-right font-bold text-blue-600">
        ${item.finalPrice}
      </td>

      {/* ✅ Actions Column */}
    <td className="px-6 py-4">
  <div className="flex items-center justify-center gap-6">

    {/* Edit */}
    <button
      onClick={() => handleEdit(item)}
      className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-semibold transition"
    >
      <Pencil size={16} />
      Edit
    </button>

    {/* Delete */}
    <button
      onClick={() => handleDelete(item.id)}
      className="flex items-center gap-2 text-red-600 hover:text-red-800 font-semibold transition"
    >
      <Trash2 size={16} />
      Delete
    </button>

  </div>
</td>


    </tr>
  ))}
</tbody>


          </table>
        </div>

        {/* Pagination */}
        <div className="p-6 border-t border-gray-100 flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Showing {inventory.length} of {inventory.length} entries
          </p>
          <div className="flex gap-2">
            <button className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-bold text-gray-500 hover:bg-gray-50 disabled:opacity-50" disabled>
              Previous
            </button>
            <button className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-bold text-gray-700 hover:bg-gray-50">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}