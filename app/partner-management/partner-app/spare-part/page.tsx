"use client";

import { useState,useEffect } from "react";
import { Pencil, Trash2, CalendarDays, Search,Plus, Save } from "lucide-react";



export default function InventoryPage() {
  const [showForm, setShowForm] = useState(false);
  // const [editingPart, setEditingPart] = useState(null);
const [editingPart, setEditingPart] = useState<any>(null);

//   Dynamic Data
const [categories, setCategories] = useState([]);
const [loadingCategories, setLoadingCategories] = useState(false);
const departmentList = [
  "Home Appliances",
  "Computer",
  "Mobile"
];

// Watcher Function
  
const [selectedCategory, setSelectedCategory] = useState("");


const [filteredCategories, setFilteredCategories] = useState([]); // filtered data
// Delete Modal
// const [deleteItem, setDeleteItem] = useState(null);
const [deleteItem, setDeleteItem] = useState<any>(null);
const [deleting, setDeleting] = useState(false);
// handle edit
const [editLoading, setEditLoading] = useState(false);



// HandleSave
const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {

  e.preventDefault();

  try {
    const docId = localStorage.getItem("selectedDocId");
    const docName = localStorage.getItem("selectedDocName");

    if (!docId || !docName) {
      alert("Please select category first");
      return;
    }


    const basePrice = parseFloat(formData.basePrice) || 0;
    const gstRate = parseFloat(formData.gstRate) || 0;

    let finalPrice = basePrice;

    if (formData.gstStatus === "Excluded") {
      finalPrice = basePrice + (basePrice * gstRate) / 100;
    }

    const partKey = formData.partName
      .replace(/\s+/g, "_")
      .toLowerCase();

//  const requestBody = {

//   docId: docId,
//   docName: docName,
//   department: selectedDepartment, // 👈 ADD THIS
//   spareParts: {
//     [partKey]: {
//       partName: formData.partName,   // 👈 ADD THIS
//       partPrice: finalPrice,
//       gstPercent: gstRate,
//       gstType: formData.gstStatus,
//       finalPrice: finalPrice,
//       hasWarranty: formData.warrantyAvailable,
//       warrantyDays: formData.warrantyAvailable
//         ? parseInt(formData.warrantyPeriod)
//         : 0,
//     },
//   },
// };

const requestBody = {
  _id: docId,          // 👈 yahi selectedDocId bhejna hai
  docId: docId,
  docName: docName,
  spareParts: {
    [partKey]: {
      partName: formData.partName,
      partPrice: basePrice,
      gstPercent: gstRate,
      gstType: formData.gstStatus,
      finalPrice: finalPrice,
      hasWarranty: formData.warrantyAvailable,
      warrantyDays: formData.warrantyAvailable
        ? parseInt(formData.warrantyPeriod)
        : 0,
    }
  }
};


    // 🔥 ADD / EDIT Logic
    let url = "https://api.bijliwalaaya.in/api/partner-rate-card";
    let method = "POST";

    if (editingPart) {
      url = `https://api.bijliwalaaya.in/api/partner-rate-card/${editingPart.id}`;
      method = "PUT";
    }

    const res = await fetch(url, {
      method: method,
      headers: {
        "Content-Type": "application/json",
        "x-api-token": "super_secure_token",
      },
      body: JSON.stringify(requestBody),
    });

    const result = await res.json();

    if (result.success) {
      alert(
        editingPart
          ? "✅ Rate card updated successfully"
          : "✅ Rate card saved successfully"
      );

      fetchRateCard();
      handleCloseForm();
      setEditingPart(null);
    } else {
      alert("❌ Failed to save");
    }

  } catch (error) {
    console.error("Save Error:", error);
    alert("Server error");
  }
};

const handleCategoryInput = (
  e: React.ChangeEvent<HTMLInputElement>
) => {
  const value = e.target.value;
  setSelectedCategory(value);

  if (!value) {
    setFilteredCategories(categories);
    return;
  }

  const lowerValue = value.toLowerCase();

  const sorted = [...categories].sort((a: any, b: any) => {
    const aStarts = a.name.toLowerCase().startsWith(lowerValue);
    const bStarts = b.name.toLowerCase().startsWith(lowerValue);

    if (aStarts && !bStarts) return -1;
    if (!aStarts && bStarts) return 1;
    return a.name.localeCompare(b.name);
  });

  setFilteredCategories(sorted);
};

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
  setFilteredCategories(result.data); // 🔥 important
} else {
  setCategories([]);
  setFilteredCategories([]);
}

  } catch (err) {
    console.error(err);
    setCategories([]);
  } finally {
    setLoadingCategories(false);
  }
};

const [selectedDepartment, setSelectedDepartment] = useState("");
// const [categoryOptions, setCategoryOptions] = useState([]);
// const [searchTerm, setSearchTerm] = useState("");
// const [selectedCategory, setSelectedCategory] = useState("");

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
// const handleEdit = async (part) => {
//   try {
//     setEditingPart(part);

//     const res = await fetch(
//       `https://api.bijliwalaaya.in/api/partner-rate-card/${part.id}`,
//       {
//         method: "GET",
//         headers: {
//           "Content-Type": "application/json",
//           "x-api-token": "super_secure_token",
//         },
//       }
//     );

//     const result = await res.json();

//     if (result.success && result.data) {
//       const data = result.data;

//       setFormData({
//         mainCategory: data.docName || "",
//         subCategory: data.docName || "",
//         partName: data.partName || "",
//         basePrice: data.partPrice || "",
//         gstRate: data.gstPercent || "",
//         gstStatus: data.gstType || "",
//         warrantyAvailable: data.hasWarranty || false,
//         warrantyPeriod: data.warrantyDays || "",
//       });

//       setSelectedCategory(data.docName);
//       setShowForm(true);
//     }

//   } catch (error) {
//     console.error("Edit Fetch Error:", error);
//   }
// };



// const filteredOptions = categoryOptions
//   .filter((item) =>
//     `${item.main} ${item.sub}`
//       .toLowerCase()
//       .includes(searchTerm.toLowerCase())
//   )
//   .sort((a, b) => {
//     const aMatch = `${a.main} ${a.sub}`
//       .toLowerCase()
//       .startsWith(searchTerm.toLowerCase());
//     const bMatch = `${b.main} ${b.sub}`
//       .toLowerCase()
//       .startsWith(searchTerm.toLowerCase());

//     return bMatch - aMatch; // match wala upar
//   });

  // Inventory Data
//  const [inventory, setInventory] = useState([]);
const [inventory, setInventory] = useState<any[]>([]);
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

const handleEdit = async (item) => {
  try {
    setShowForm(true);
    setEditLoading(true);

    const res = await fetch(
      `https://api.bijliwalaaya.in/api/partner-rate-card/${item.id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-api-token": "super_secure_token",
        },
      }
    );

    const result = await res.json();

    if (!res.ok || !result.success) {
      alert("Failed to fetch data from server");
      return;
    }

    const categoryData = result.data;

    // 🔥 Important — correct spare part extract
    const part = categoryData.spareParts?.[item.partKey];

    if (!part) {
      alert("Spare part not found");
      return;
    }

    setFormData({
      mainCategory: categoryData.docName || "",
      subCategory: categoryData.docName || "",
      partName: part.partName || "",
      basePrice: part.partPrice?.toString() || "",
      gstRate: part.gstPercent?.toString() || "0",
      gstStatus: part.gstType || "Excluded",
      warrantyAvailable: part.hasWarranty ?? false,
      warrantyPeriod: part.warrantyDays?.toString() || "",
    });

    setSelectedDepartment(categoryData.department || "");
    setEditingPart(item);

  } catch (error) {
    console.error("Edit Fetch Error:", error);
    alert("Server error while loading edit data");
  } finally {
    setEditLoading(false);
  }
};

// Data Get
const formatApiData = (apiData) => {
  let partsArray = [];

  apiData.forEach((category) => {
    // Case 1: Direct spareParts
    if (category.spareParts) {
  Object.entries(category.spareParts).forEach(([key, part]) => {
    partsArray.push({
      id: category.docId,      // document id
      partKey: key,            // 👈 DELETE ke liye important
      name: part.partName,
      subCategory: category.docName,
      category: category.docName,
      department: category.department || "N/A",
      categoryColor: "blue",
      basePrice: part.partPrice,
      gst: part.gstPercent,
      finalPrice: part.finalPrice,
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
    mainCategory: "",
    subCategory: "",
    partName: "",
    basePrice: "",
    gstRate: "",
    gstStatus: "", // default agar chaho
    warrantyAvailable: false,
    warrantyPeriod: "",
  });

  setSelectedDepartment("");
  setSelectedCategory("");
  setFilteredCategories([]);
  setCategories([]);

  setShowForm(true);
};

  

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingPart(null);
  };

  

 

 const confirmDelete = async () => {
  if (!deleteItem) return;

  setDeleting(true);

  try {
    const res = await fetch(
      `https://api.bijliwalaaya.in/api/partner-rate-card/${deleteItem.id}/spare-parts/${deleteItem.partKey}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "x-api-token": "super_secure_token",
        },
      }
    );

    const result = await res.json();

    if (res.ok && result.success) {
      alert("✅ Spare part deleted successfully");
      fetchRateCard();
    } else {
      alert(result.message || "❌ Failed to delete");
    }

  } catch (error) {
    console.error("Delete Error:", error);
    alert("Server error while deleting");
  } finally {
    setDeleting(false);
    setDeleteItem(null); // modal close
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
          Spare Parts Management
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
      <div className="relative">
  <input
    type="text"
    value={selectedCategory}
    onChange={handleCategoryInput}
    placeholder="Search Category..."
    className="w-full rounded-xl border border-gray-300 px-4 py-3"
  />

  {filteredCategories.length > 0 && (
    <div className="absolute z-10 bg-white border w-full rounded-xl shadow-lg max-h-60 overflow-y-auto">
     {filteredCategories.map((item) => (
  <div
    key={item.documentId}
    onClick={() => {
      setSelectedCategory(item.name);
      setFilteredCategories([]);

      // ✅ store docId & docName in localStorage
      localStorage.setItem("selectedDocId", item.documentId);
      localStorage.setItem("selectedDocName", item.name);

      setFormData((prev) => ({
        ...prev,
        subCategory: item.name,
      }));
    }}
    className="px-4 py-3 hover:bg-blue-50 cursor-pointer"
  >
    {item.name}
  </div>
))}

    </div>
  )}
</div>

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
              Base Price (₹)
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
                <option value="0">0%</option>
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
                <option>No Gst</option>
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
                ₹{gstValue.toFixed(2)}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-blue-600 font-bold uppercase">
                Final Price
              </span>
              <span className="text-3xl font-bold text-blue-600">
                ₹{finalPrice.toFixed(2)}
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
        ₹{item.basePrice}
      </td>

      <td className="px-6 py-4 text-sm text-center text-gray-700">
        {item.gst}%
      </td>

      <td className="px-6 py-4 text-sm text-right font-bold text-blue-600">
        ₹{item.finalPrice}
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
  onClick={() => setDeleteItem(item)}

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
      {deleteItem && (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
    <div className="bg-white rounded-2xl p-8 w-96 shadow-xl">
      <h3 className="text-xl font-bold text-gray-900 mb-4">
        Confirm Delete
      </h3>

      <p className="text-gray-600 mb-6">
        Are you sure you want to delete{" "}
        <span className="font-semibold text-red-600">
          {deleteItem.name}
        </span>
        ?
      </p>

      <div className="flex justify-end gap-4">
        <button
          onClick={() => setDeleteItem(null)}
          className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 font-medium"
        >
          Cancel
        </button>

        <button
          onClick={confirmDelete}
          className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium"
        >
          Delete
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  );
}