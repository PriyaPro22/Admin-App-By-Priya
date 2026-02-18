// "use client";

// import { useState, useEffect } from "react";
// import Image from "next/image";

// // Types
// interface Policy {
//   id: string;
//   level: 'global' | 'state' | 'city';
//   title: string;
//   description: string;
//   areaType: 'all' | 'urban' | 'rural';
//   freeRadius: number;
//   perKmRate: number;
//   threshold: number;
//   isActive: boolean;
//   image: string | null;
//   stateName?: string;
//   cityName?: string;
// }

// export default function ConveyancePolicyPage() {
//   // Dynamic Data Get
//  const [policies, setPolicies] = useState<any[]>([]);
// const API_BASE = "https://api.bijliwalaaya.in/api/conveyance-policies";

// const headers = {
//   "Content-Type": "application/json",
//   "x-api-token": "super_secure_token",
// };

// const fetchPolicies = async () => {
//   try {
//     const res = await fetch(API_BASE, {
//       method: "GET",
//       headers,
//     });

//     const data = await res.json();

//     console.log("API Response:", data);

//     if (data.success) {
//       setPolicies(data.data);
//     }
//   } catch (error) {
//     console.error("Error fetching policies:", error);
//   }
// };
// useEffect(() => {
//   fetchPolicies();
// }, []);
// // Dynamic data Post

// // const savePolicy = async () => {
// //   try {

// //     if (!formData.title || !formData.freeRadius || !formData.perKmRate || !formData.threshold) {
// //       alert("Please fill all required fields");
// //       return;
// //     }

// //     const body = {
// //       title: formData.title,
// //       description: formData.description,
// //       area_type: formData.areaType,
// //       specific_area: formData.areaType,
// //       free_radius_km: Number(formData.freeRadius),
// //       per_km_rate: Number(formData.perKmRate),
// //       availability_threshold: Number(formData.threshold),
// //       imageUrl: formData.image,
// //       videoUrl: null,
// //       global_active: true,
// //       cities:
// //         formData.level === "city" && formData.cityName
// //           ? [
// //               {
// //                 city_name: formData.cityName,
// //                 is_active: true,
// //                 title: formData.title,
// //                 description: formData.description,
// //                 area_type: formData.areaType,
// //                 free_radius_km: Number(formData.freeRadius),
// //                 per_km_rate: Number(formData.perKmRate),
// //                 availability_threshold: Number(formData.threshold),
// //                 imageUrl: formData.image,
// //                 videoUrl: null,
// //               },
// //             ]
// //           : [],
// //     };

// //     const res = await fetch(API_BASE, {
// //       method: "POST",
// //       headers,
// //       body: JSON.stringify(body),
// //     });

// //     const data = await res.json();

// //     console.log("POST Response:", data);

// //     if (data.success) {
// //       alert("Policy Created Successfully ✅");
// //       fetchPolicies(); // refresh GET
// //       closeModal();
// //     } else {
// //       alert(data.message || "Something went wrong");
// //     }

// //   } catch (error) {
// //     console.error("POST Error:", error);
// //   }
// // };
// // const savePolicy = async () => {
// //   try {

// //     if (!formData.title || !formData.freeRadius || !formData.perKmRate || !formData.threshold) {
// //       alert("Please fill all required fields");
// //       return;
// //     }

// //     const body = {
// //       title: formData.title,
// //       description: formData.description,
// //       area_type: formData.areaType,
// //       specific_area: formData.areaType,
// //       free_radius_km: Number(formData.freeRadius),
// //       per_km_rate: Number(formData.perKmRate),
// //       availability_threshold: Number(formData.threshold),
// //       imageUrl: formData.image,
// //       videoUrl: null,
// //       global_active: true,
// //     };

// //     let url = API_BASE;
// //     let method = "POST";

// //     // 🔥 If editing → PATCH
// //     if (editingPolicy && editingPolicy._id) {
// //       url = `${API_BASE}/${editingPolicy._id}`;
// //       method = "PATCH";
// //     }

// //     const res = await fetch(url, {
// //       method,
// //       headers,
// //       body: JSON.stringify(body),
// //     });

// //     const data = await res.json();

// //     console.log("SAVE Response:", data);

// //     if (data.success) {
// //       alert(editingPolicy ? "Policy Updated ✅" : "Policy Created ✅");
// //       fetchPolicies();
// //       closeModal();
// //     } else {
// //       alert(data.message || "Something went wrong");
// //     }

// //   } catch (error) {
// //     console.error("SAVE Error:", error);
// //   }
// // };
// const savePolicy = async () => {
//   try {
//     if (
//       !formData.title ||
//       !formData.freeRadius ||
//       !formData.perKmRate ||
//       !formData.threshold
//     ) {
//       alert("Please fill all required fields");
//       return;
//     }

//     const baseBody = {
//       title: formData.title,
//       description: formData.description,
//       area_type: formData.areaType,
//       specific_area: formData.areaType,
//       free_radius_km: Number(formData.freeRadius),
//       per_km_rate: Number(formData.perKmRate),
//       availability_threshold: Number(formData.threshold),
//       imageUrl: formData.image,
//       videoUrl: null,
//     };

//     let url = API_BASE;
//     let method = "POST";
//     let body: any = {};

//     // =========================
//     // 🔥 CITY EDIT
//     // =========================
//     if (editingPolicy && editingPolicy.city_name) {
//       url = `${API_BASE}/${editingPolicy._id}/cities`;
//       method = "PATCH";

//       body = {
//         city_name: editingPolicy.city_name,
//         ...baseBody,
//       };
//     }

//     // =========================
//     // 🔥 STATE EDIT
//     // =========================
//     else if (editingPolicy && editingPolicy.state_name) {
//       url = `${API_BASE}/${editingPolicy._id}/states`;
//       method = "PATCH";

//       body = {
//         state_name: editingPolicy.state_name,
//         ...baseBody,
//       };
//     }

//     // =========================
//     // 🔥 GLOBAL EDIT
//     // =========================
//     else if (editingPolicy && editingPolicy._id) {
//       url = `${API_BASE}/${editingPolicy._id}`;
//       method = "PATCH";

//       body = {
//         ...baseBody,
//         global_active: true,
//       };
//     }

//     // =========================
//     // 🔥 CREATE NEW
//     // =========================
//     else {
//       body = {
//         ...baseBody,
//         global_active: true,
//       };

//       // City Create
//       if (formData.level === "city") {
//         body.cities = [
//           {
//             city_name: formData.cityName,
//             is_active: true,
//             ...baseBody,
//           },
//         ];
//       }

//       // State Create
//       if (formData.level === "state") {
//         body.states = [
//           {
//             state_name: formData.stateName,
//             is_active: true,
//             ...baseBody,
//           },
//         ];
//       }
//     }

//     const res = await fetch(url, {
//       method,
//       headers,
//       body: JSON.stringify(body),
//     });

//     const data = await res.json();

//     console.log("SAVE Response:", data);

//     if (data.success) {
//       alert(editingPolicy ? "Updated Successfully ✅" : "Created Successfully ✅");
//       fetchPolicies();
//       closeModal();
//     } else {
//       alert(data.message || "Something went wrong");
//     }

//   } catch (error) {
//     console.error("SAVE Error:", error);
//   }
// };

//   // Modal state
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [editingPolicy, setEditingPolicy] = useState<Policy | null>(null);
  
//   // Form state
//   const [formData, setFormData] = useState({
//     level: 'global' as 'global' | 'state' | 'city',
//     stateName: '',
//     cityName: '',
//     title: '',
//     description: '',
//     areaType: 'all' as 'all' | 'urban' | 'rural',
//     freeRadius: '',
//     perKmRate: '',
//     threshold: '',
//     image: null as string | null
//   });

//   const [imagePreview, setImagePreview] = useState<string | null>(null);

//   // Statistics
//   const [stats, setStats] = useState({
//     global: 0,
//     state: 0,
//     city: 0
//   });

//   // Update statistics
// useEffect(() => {
//   let globalCount = 0;
//   let stateCount = 0;
//   let cityCount = 0;

//   policies.forEach((policy: any) => {
//     // Global
//     if (policy.global_active) {
//       globalCount++;
//     }

//     // States
//     if (policy.states && policy.states.length > 0) {
//       stateCount += policy.states.length;
//     }

//     // Cities
//     if (policy.cities && policy.cities.length > 0) {
//       cityCount += policy.cities.length;
//     }
//   });

//   setStats({
//     global: globalCount,
//     state: stateCount,
//     city: cityCount,
//   });
// }, [policies]);


//   // Reset form
//   const resetForm = () => {
//     setFormData({
//       level: 'global',
//       stateName: '',
//       cityName: '',
//       title: '',
//       description: '',
//       areaType: 'all',
//       freeRadius: '',
//       perKmRate: '',
//       threshold: '',
//       image: null
//     });
//     setImagePreview(null);
//     setEditingPolicy(null);
//   };

//   // Open modal for create
//   const openCreateModal = () => {
//     resetForm();
//     setIsModalOpen(true);
//   };

//   // Open modal for edit
//  const openEditModal = (policy: any) => {
//   setEditingPolicy(policy);

//   setFormData({
//     level: "global",
//     stateName: "",
//     cityName: "",
//     title: policy.title || "",
//     description: policy.description || "",
//     areaType: policy.area_type || "all",
//     freeRadius: policy.free_radius_km?.toString() || "",
//     perKmRate: policy.per_km_rate?.toString() || "",
//     threshold: policy.availability_threshold?.toString() || "",
//     image: policy.imageUrl || null
//   });

//   setImagePreview(policy.imageUrl || null);
//   setIsModalOpen(true);
// };


//   // Close modal
//   const closeModal = () => {
//     setIsModalOpen(false);
//     resetForm();
//   };
 
// //   City Edit Modal
// const openCityEditModal = (policy: any, city: any) => {
//   setEditingPolicy({
//     ...policy,
//     _id: policy._id,
//     city_name: city.city_name
//   });

//   setFormData({
//     level: "city",
//     stateName: "",
//     cityName: city.city_name || "",
//     title: city.title || policy.title || "",
//     description: city.description || "",
//     areaType: city.area_type || "all",
//     freeRadius: city.free_radius_km?.toString() || "",
//     perKmRate: city.per_km_rate?.toString() || "",
//     threshold: city.availability_threshold?.toString() || "",
//     image: city.imageUrl || null
//   });

//   setImagePreview(city.imageUrl || null);
//   setIsModalOpen(true);
// };
// // State Edit Modal
// const openStateEditModal = (policy: any, state: any) => {
//   setEditingPolicy({
//     ...policy,
//     _id: policy._id,
//     state_name: state.state_name
//   });

//   setFormData({
//     level: "state",
//     stateName: state.state_name || "",
//     cityName: "",
//     title: state.title || policy.title || "",
//     description: state.description || "",
//     areaType: state.area_type || "all",
//     freeRadius: state.free_radius_km?.toString() || "",
//     perKmRate: state.per_km_rate?.toString() || "",
//     threshold: state.availability_threshold?.toString() || "",
//     image: state.imageUrl || null
//   });

//   setImagePreview(state.imageUrl || null);
//   setIsModalOpen(true);
// };

//   // Handle input change
//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   // Handle radio change
//   const handleLevelChange = (level: 'global' | 'state' | 'city') => {
//     setFormData(prev => ({ ...prev, level }));
//   };

//   // Handle image upload
//   const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         const imageData = reader.result as string;
//         setImagePreview(imageData);
//         setFormData(prev => ({ ...prev, image: imageData }));
//       };
//       reader.readAsDataURL(file);
//     }
//   };

  

//   // Toggle policy status
//   const toggleStatus = (policyId: string) => {
//     setPolicies(prev => prev.map(p => 
//       p.id === policyId ? { ...p, isActive: !p.isActive } : p
//     ));
//   };

//   // Delete policy
// const deletePolicy = async (policyId: string) => {
//   const confirmDelete = confirm("Are you sure you want to delete this policy?");

//   if (!confirmDelete) return;

//   try {
//     const res = await fetch(`${API_BASE}/${policyId}`, {
//       method: "DELETE",
//       headers,
//     });

//     const data = await res.json();

//     console.log("DELETE Response:", data);

//     if (data.success) {
//       alert("Policy Deleted Successfully ✅");
//       fetchPolicies(); // refresh GET
//     } else {
//       alert(data.message || "Delete failed");
//     }

//   } catch (error) {
//     console.error("DELETE Error:", error);
//   }
// };
// // City Edit & DElete
// const deleteCity = async (policyId: string, cityName: string) => {
//   const confirmDelete = confirm("Are you sure you want to delete this city?");

//   if (!confirmDelete) return;

//   try {
//     const res = await fetch(`${API_BASE}/${policyId}/cities`, {
//       method: "DELETE",
//       headers,
//       body: JSON.stringify({ city_name: cityName }),
//     });

//     const data = await res.json();

//     console.log("City Delete Response:", data);

//     if (data.success) {
//       alert("City Deleted Successfully ✅");
//       fetchPolicies();
//     } else {
//       alert(data.message || "Delete failed");
//     }

//   } catch (error) {
//     console.error("City Delete Error:", error);
//   }
// };
// const editCity = async (policyId: string, city: any) => {
//   try {
//     const res = await fetch(`${API_BASE}/${policyId}/cities`, {
//       method: "POST",
//       headers,
//       body: JSON.stringify({
//         city_name: city.city_name,
//         is_active: city.is_active,
//         title: city.title,
//         description: city.description,
//         area_type: city.area_type,
//         free_radius_km: city.free_radius_km,
//         per_km_rate: city.per_km_rate,
//         availability_threshold: city.availability_threshold,
//         imageUrl: city.imageUrl,
//         videoUrl: city.videoUrl,
//       }),
//     });

//     const data = await res.json();

//     console.log("City Update Response:", data);

//     if (data.success) {
//       alert("City Updated ✅");
//       fetchPolicies();
//     } else {
//       alert(data.message || "Update failed");
//     }

//   } catch (error) {
//     console.error("City Update Error:", error);
//   }
// };


//   // Render policy card
//   const renderPolicyCard = (policy: Policy) => {
//     const levelColors = {
//       global: 'border-blue-900 bg-blue-50',
//       state: 'border-green-700 bg-green-50',
//       city: 'border-orange-500 bg-orange-50'
//     };

//     const levelNames = {
//       global: '🌍 Global',
//       state: '🏙️ State',
//       city: '📍 City'
//     };

//     const locationName = policy.level === 'state' ? policy.stateName :
//                         policy.level === 'city' ? policy.cityName : 'All India';

//     return (
//       <div 
//         key={policy.id} 
//         className={`bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all border-l-4 ${levelColors[policy.level]}`}
//       >
//         <div className="flex justify-between items-start mb-4">
//           <div className="flex items-center gap-2">
//             <h3 className="text-lg font-bold text-gray-800">{policy.title}</h3>
//             <span className={`text-xs px-2 py-1 rounded-full ${
//               policy.level === 'global' ? 'bg-blue-900 text-white' :
//               policy.level === 'state' ? 'bg-green-700 text-white' :
//               'bg-orange-500 text-white'
//             }`}>
//               {levelNames[policy.level]}
//             </span>
//           </div>
//           <div className="flex items-center gap-3">
//             <span className="text-sm font-medium">{policy.isActive ? '🟢 Active' : '🔴 Inactive'}</span>
//             <button
//               onClick={() => toggleStatus(policy.id)}
//               className={`relative w-14 h-7 rounded-full transition-colors ${
//                 policy.isActive ? 'bg-green-500' : 'bg-gray-300'
//               }`}
//             >
//               <span className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform ${
//                 policy.isActive ? 'translate-x-7' : 'translate-x-0'
//               }`} />
//             </button>
//           </div>
//         </div>

//         <div className="text-sm text-gray-600 mb-3">
//           📍 {locationName}
//         </div>

//         <div className="bg-white/70 rounded-lg p-4 space-y-2 mb-4">
//           <div className="flex justify-between text-sm">
//             <span className="font-medium text-gray-600">Description:</span>
//             <span className="text-gray-800">{policy.description}</span>
//           </div>
//           <div className="flex justify-between text-sm">
//             <span className="font-medium text-gray-600">Area Type:</span>
//             <span className="text-gray-800">
//               {policy.areaType === 'all' ? 'All' : 
//                policy.areaType === 'urban' ? 'Urban' : 'Rural'}
//             </span>
//           </div>
//           <div className="flex justify-between text-sm">
//             <span className="font-medium text-gray-600">Free Radius:</span>
//             <span className="text-gray-800">{policy.freeRadius} km</span>
//           </div>
//           <div className="flex justify-between text-sm">
//             <span className="font-medium text-gray-600">Per Km Rate:</span>
//             <span className="text-gray-800">₹{policy.perKmRate}</span>
//           </div>
//           <div className="flex justify-between text-sm">
//             <span className="font-medium text-gray-600">Threshold:</span>
//             <span className="text-gray-800">{policy.threshold} technicians</span>
//           </div>
//         </div>

//         {policy.image && (
//           <div className="mb-4">
//             <img src={policy.image} alt={policy.title} className="max-w-full h-32 rounded-lg object-cover" />
//           </div>
//         )}

//         <div className="flex gap-3">
//           <button
//             onClick={() => openEditModal(policy)}
//             className="flex-1 px-4 py-2 text-sm font-medium text-orange-700 bg-orange-100 rounded-lg hover:bg-orange-200 transition-colors"
//           >
//             ✏️ Edit
//           </button>
//           <button
//             onClick={() => deletePolicy(policy.id)}
//             className="flex-1 px-4 py-2 text-sm font-medium text-red-700 bg-red-100 rounded-lg hover:bg-red-200 transition-colors"
//           >
//             🗑️ Delete
//           </button>
//         </div>
//       </div>
//     );
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 p-5">
//       <div className="max-w-7xl mx-auto">
//         <h1 className="text-4xl font-bold text-blue-900 mb-8">
//           🚚 Multi-Level Conveyance Policy Admin
//         </h1>

//         {/* Statistics */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
//           <div className="bg-white rounded-xl p-6 text-center shadow-md">
//             <div className="text-4xl font-bold text-blue-600">{stats.global}</div>
//             <div className="text-gray-600 mt-2">Global Policies</div>
//           </div>
//           <div className="bg-white rounded-xl p-6 text-center shadow-md">
//             <div className="text-4xl font-bold text-green-600">{stats.state}</div>
//             <div className="text-gray-600 mt-2">State Policies</div>
//           </div>
//           <div className="bg-white rounded-xl p-6 text-center shadow-md">
//             <div className="text-4xl font-bold text-orange-600">{stats.city}</div>
//             <div className="text-gray-600 mt-2">City Policies</div>
//           </div>
//         </div>

//         {/* Create Button */}
//         <button
//           onClick={openCreateModal}
//           className="mb-8 px-8 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors text-lg font-semibold shadow-lg"
//         >
//           ➕ Create New Conveyance Policy
//         </button>

//         {/* Global Policies */}
//         <h2 className="text-2xl font-bold text-blue-900 mb-4 mt-8">🌍 Global Policies (All India)</h2>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
//  {policies.map((policy: any) => (
//   <div key={policy._id} className="bg-white rounded-xl p-6 shadow-lg mb-4">

//     <div className="flex justify-between items-start">
//       <div>
//         <h3 className="text-lg font-bold text-gray-800">
//           {policy.title}
//         </h3>
//         <p className="text-gray-600 mt-1">
//           {policy.description}
//         </p>
//       </div>

//       <span className={`px-3 py-1 rounded-full text-sm ${
//         policy.global_active
//           ? "bg-green-100 text-green-700"
//           : "bg-red-100 text-red-700"
//       }`}>
//         {policy.global_active ? "Active" : "Inactive"}
//       </span>
//     </div>

//     <div className="mt-3 space-y-1 text-sm">
//       <p><strong>Area Type:</strong> {policy.area_type}</p>
//       <p><strong>Free Radius:</strong> {policy.free_radius_km} km</p>
//       <p><strong>Per Km Rate:</strong> ₹{policy.per_km_rate}</p>
//       <p><strong>Availability Threshold:</strong> {policy.availability_threshold}</p>
//     </div>

//     {/* 🔥 Edit / Delete Buttons */}
//     <div className="flex gap-3 mt-4">
//       <button
//         onClick={() => openEditModal(policy)}
//         className="flex-1 px-4 py-2 text-sm font-medium text-orange-700 bg-orange-100 rounded-lg hover:bg-orange-200 transition-colors"
//       >
//         ✏️ Edit
//       </button>

//       <button
//         onClick={() => deletePolicy(policy._id)}
//         className="flex-1 px-4 py-2 text-sm font-medium text-red-700 bg-red-100 rounded-lg hover:bg-red-200 transition-colors"
//       >
//         🗑️ Delete
//       </button>
//     </div>

//   </div>
// ))}


//         </div>

//         {/* State Policies */}
//         <h2 className="text-2xl font-bold text-green-700 mb-4">🏙️ State Policies</h2>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
//           {/* State Policies */}
// {policies.map((policy: any) =>
//   policy.states?.map((state: any, index: number) => (
//     <div key={index} className="bg-white rounded-xl p-6 shadow-lg mb-4">

//       <div className="flex justify-between">
//         <h3 className="text-lg font-bold text-gray-800">
//           {state.title || policy.title}
//         </h3>

//         <span className={`px-3 py-1 rounded-full text-sm ${
//           state.is_active
//             ? "bg-green-100 text-green-700"
//             : "bg-red-100 text-red-700"
//         }`}>
//           {state.is_active ? "Active" : "Inactive"}
//         </span>
//       </div>

//       <p className="text-gray-600 mt-2">
//         {state.description || policy.description}
//       </p>

//       <div className="mt-3 space-y-1 text-sm">
//         <p><strong>State:</strong> {state.state_name}</p>
//         <p><strong>Area Type:</strong> {state.area_type}</p>
//         <p><strong>Free Radius:</strong> {state.free_radius_km} km</p>
//         <p><strong>Per Km Rate:</strong> ₹{state.per_km_rate}</p>
//         <p><strong>Availability Threshold:</strong> {state.availability_threshold}</p>
//       </div>

//       {/* Edit + Delete */}
//       <div className="flex gap-3 mt-4">
//         <button
//           onClick={() => openStateEditModal(policy, state)}
//           className="flex-1 px-4 py-2 text-sm font-medium text-orange-700 bg-orange-100 rounded-lg hover:bg-orange-200 transition-colors"
//         >
//           ✏️ Edit
//         </button>

//         <button
//           onClick={() => deleteState(policy._id, state.state_name)}
//           className="flex-1 px-4 py-2 text-sm font-medium text-red-700 bg-red-100 rounded-lg hover:bg-red-200 transition-colors"
//         >
//           🗑️ Delete
//         </button>
//       </div>

//     </div>
//   ))
// )}


//         </div>

//         {/* City Policies */}
//        {/* City Policies */}
// <h2 className="text-2xl font-bold text-orange-600 mb-4">📍 City Policies</h2>
// <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
//   {policies.map((policy: any) =>
//     policy.cities?.map((city: any, index: number) => (
//       <div key={index} className="bg-white rounded-xl p-6 shadow-lg mb-4">

//         <div className="flex justify-between">
//           <h3 className="text-lg font-bold text-gray-800">
//             {city.title || policy.title}
//           </h3>

//           <span className={`px-3 py-1 rounded-full text-sm ${
//             city.is_active
//               ? "bg-green-100 text-green-700"
//               : "bg-red-100 text-red-700"
//           }`}>
//             {city.is_active ? "Active" : "Inactive"}
//           </span>
//         </div>

//         <p className="text-gray-600 mt-2">
//           {city.description || policy.description}
//         </p>

//         <div className="mt-3 space-y-1 text-sm">
//           <p><strong>City:</strong> {city.city_name}</p>
//           <p><strong>Area Type:</strong> {city.area_type}</p>
//           <p><strong>Free Radius:</strong> {city.free_radius_km} km</p>
//           <p><strong>Per Km Rate:</strong> ₹{city.per_km_rate}</p>
//           <p><strong>Availability Threshold:</strong> {city.availability_threshold}</p>
//         </div>

//         {/* 🔥 EDIT + DELETE BUTTONS */}
//         <div className="flex gap-3 mt-4">
//           <button
//             onClick={() => editCity(policy._id, city)}
//             className="flex-1 px-4 py-2 text-sm font-medium text-orange-700 bg-orange-100 rounded-lg hover:bg-orange-200 transition-colors"
//           >
//             ✏️ Edit
//           </button>

//           <button
//             onClick={() => deleteCity(policy._id, city.city_name)}
//             className="flex-1 px-4 py-2 text-sm font-medium text-red-700 bg-red-100 rounded-lg hover:bg-red-200 transition-colors"
//           >
//             🗑️ Delete
//           </button>
//         </div>

//       </div>
//     ))
//   )}
// </div>


//         {/* Modal */}
//         {isModalOpen && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
//             <div className="bg-white rounded-2xl max-w-2xl w-full p-8 relative">
//               <button
//                 onClick={closeModal}
//                 className="absolute right-6 top-4 text-3xl text-gray-500 hover:text-gray-700"
//               >
//                 &times;
//               </button>

//               <h2 className="text-2xl font-bold text-gray-800 mb-6">
//                 {editingPolicy ? 'Edit Policy' : 'Create New Policy'}
//               </h2>

//               <div className="space-y-5">
//                 {/* Level Selection */}
//                 <div>
//                   <label className="block text-sm font-semibold text-gray-700 mb-2">
//                     Policy Level
//                   </label>
//                   <div className="flex gap-6">
//                     <label className="flex items-center gap-2">
//                       <input
//                         type="radio"
//                         name="level"
//                         checked={formData.level === 'global'}
//                         onChange={() => handleLevelChange('global')}
//                         className="w-4 h-4 text-blue-600"
//                       />
//                       <span>🌍 Global (All India)</span>
//                     </label>
//                     <label className="flex items-center gap-2">
//                       <input
//                         type="radio"
//                         name="level"
//                         checked={formData.level === 'state'}
//                         onChange={() => handleLevelChange('state')}
//                         className="w-4 h-4 text-blue-600"
//                       />
//                       <span>🏙️ State</span>
//                     </label>
//                     <label className="flex items-center gap-2">
//                       <input
//                         type="radio"
//                         name="level"
//                         checked={formData.level === 'city'}
//                         onChange={() => handleLevelChange('city')}
//                         className="w-4 h-4 text-blue-600"
//                       />
//                       <span>📍 City</span>
//                     </label>
//                   </div>
//                 </div>

//                 {/* State Select */}
//                 {formData.level === 'state' && (
//                   <div>
//                     <label className="block text-sm font-semibold text-gray-700 mb-2">
//                       Select State
//                     </label>
//                     <select
//                       name="stateName"
//                       value={formData.stateName}
//                       onChange={handleInputChange}
//                       className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                     >
//                       <option value="">-- Select State --</option>
//                       <option value="Uttar Pradesh">Uttar Pradesh</option>
//                       <option value="Maharashtra">Maharashtra</option>
//                       <option value="Delhi">Delhi</option>
//                       <option value="Karnataka">Karnataka</option>
//                       <option value="Tamil Nadu">Tamil Nadu</option>
//                     </select>
//                   </div>
//                 )}

//                 {/* City Select */}
//                 {formData.level === 'city' && (
//                   <div>
//                     <label className="block text-sm font-semibold text-gray-700 mb-2">
//                       Select City
//                     </label>
//                     <select
//                       name="cityName"
//                       value={formData.cityName}
//                       onChange={handleInputChange}
//                       className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                     >
//                       <option value="">-- Select City --</option>
//                       <option value="Lucknow">Lucknow</option>
//                       <option value="Ayodhya">Ayodhya</option>
//                       <option value="Varanasi">Varanasi</option>
//                       <option value="Kanpur">Kanpur</option>
//                       <option value="Agra">Agra</option>
//                     </select>
//                   </div>
//                 )}

//                 {/* Title */}
//                 <div>
//                   <label className="block text-sm font-semibold text-gray-700 mb-2">
//                     Policy Title
//                   </label>
//                   <input
//                     type="text"
//                     name="title"
//                     value={formData.title}
//                     onChange={handleInputChange}
//                     placeholder="e.g., Lucknow Special Policy"
//                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                   />
//                 </div>

//                 {/* Description */}
//                 <div>
//                   <label className="block text-sm font-semibold text-gray-700 mb-2">
//                     Description
//                   </label>
//                   <textarea
//                     name="description"
//                     value={formData.description}
//                     onChange={handleInputChange}
//                     rows={3}
//                     placeholder="Policy description"
//                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                   />
//                 </div>

//                 {/* Area Type */}
//                 <div>
//                   <label className="block text-sm font-semibold text-gray-700 mb-2">
//                     Area Type
//                   </label>
//                   <select
//                     name="areaType"
//                     value={formData.areaType}
//                     onChange={handleInputChange}
//                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                   >
//                     <option value="all">All</option>
//                     <option value="urban">Urban</option>
//                     <option value="rural">Rural</option>
//                   </select>
//                 </div>

//                 {/* Free Radius */}
//                 <div>
//                   <label className="block text-sm font-semibold text-gray-700 mb-2">
//                     Free Radius (km)
//                   </label>
//                   <input
//                     type="number"
//                     name="freeRadius"
//                     value={formData.freeRadius}
//                     onChange={handleInputChange}
//                     placeholder="e.g., 5"
//                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                   />
//                 </div>

//                 {/* Per Km Rate */}
//                 <div>
//                   <label className="block text-sm font-semibold text-gray-700 mb-2">
//                     Per Km Rate (₹)
//                   </label>
//                   <input
//                     type="number"
//                     name="perKmRate"
//                     value={formData.perKmRate}
//                     onChange={handleInputChange}
//                     placeholder="e.g., 10"
//                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                   />
//                 </div>

//                 {/* Threshold */}
//                 <div>
//                   <label className="block text-sm font-semibold text-gray-700 mb-2">
//                     Availability Threshold
//                   </label>
//                   <input
//                     type="number"
//                     name="threshold"
//                     value={formData.threshold}
//                     onChange={handleInputChange}
//                     placeholder="e.g., 5"
//                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                   />
//                   <p className="text-xs text-gray-500 mt-1">
//                     If this many technicians are available, show confirmed price
//                   </p>
//                 </div>

//                 {/* Image Upload */}
//                 <div>
//                   <label className="block text-sm font-semibold text-gray-700 mb-2">
//                     Policy Image
//                   </label>
//                   <input
//                     type="file"
//                     accept="image/*"
//                     onChange={handleImageUpload}
//                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                   />
//                   {imagePreview && (
//                     <img
//                       src={imagePreview}
//                       alt="Preview"
//                       className="mt-3 max-w-full h-32 rounded-lg object-cover"
//                     />
//                   )}
//                 </div>

//                 {/* Buttons */}
//                 <div className="flex gap-4 pt-4">
//                   <button
//                     onClick={savePolicy}
//                     className="flex-1 px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
//                   >
//                     ✅ Save
//                   </button>
//                   <button
//                     onClick={closeModal}
//                     className="flex-1 px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors"
//                   >
//                     ✖ Cancel
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }


// "use client";

// import { useState, useEffect } from "react";

// // Types
// interface CityPolicy {
//   city_name: string;
//   is_active: boolean;
//   cityTitle: string;
//   cityDescription?: string;
//   area_type: 'all' | 'urban' | 'rural';
//   free_radius_km: number;
//   per_km_rate: number;
//   availability_threshold: number;
//   imageUrl?: string | null;
//   videoUrl?: string | null;
// }

// interface Policy {
//   _id: string;
//   state_name: string;
//   stateTitle: string;
//   stateDescription?: string;
//   area_type: 'all' | 'urban' | 'rural';
//   free_radius_km: number;
//   per_km_rate: number;
//   availability_threshold: number;
//   state_active: boolean;
//   imageUrl?: string | null;
//   videoUrl?: string | null;
//   cities: CityPolicy[];
// }

// export default function ConveyancePolicyPage() {
//   // Dynamic Data Get
//   const [policies, setPolicies] = useState<Policy[]>([]);
//   const API_BASE = "https://api.bijliwalaaya.in/api/conveyance-policies";

//   const headers = {
//     "Content-Type": "application/json",
//     "x-api-token": "super_secure_token",
//   };

//   const fetchPolicies = async () => {
//     try {
//       const res = await fetch(API_BASE, {
//         method: "GET",
//         headers,
//       });

//       const data = await res.json();
//       console.log("GET Response:", data);

//       // Check if data is array, if not, check for data.data or set empty array
//       if (Array.isArray(data)) {
//         setPolicies(data);
//       } else if (data && Array.isArray(data.data)) {
//         setPolicies(data.data);
//       } else {
//         console.error("Unexpected data format:", data);
//         setPolicies([]); // Set empty array to prevent map error
//       }
//     } catch (error) {
//       console.error("Error fetching policies:", error);
//       setPolicies([]); // Set empty array on error
//     }
//   };

//   useEffect(() => {
//     fetchPolicies();
//   }, []);

//   // Modal state
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [editingPolicy, setEditingPolicy] = useState<any>(null);
//   const [editingType, setEditingType] = useState<'state' | 'city' | null>(null);
  
//   // Form state
//   const [formData, setFormData] = useState({
//     level: 'state' as 'state' | 'city',
//     stateName: '',
//     cityName: '',
//     stateTitle: '',
//     stateDescription: '',
//     cityTitle: '',
//     cityDescription: '',
//     areaType: 'all' as 'all' | 'urban' | 'rural',
//     freeRadius: '',
//     perKmRate: '',
//     threshold: '',
//     image: null as string | null
//   });

//   const [imagePreview, setImagePreview] = useState<string | null>(null);

//   // Statistics
//   const [stats, setStats] = useState({
//     state: 0,
//     city: 0
//   });

//   // Update statistics
//   useEffect(() => {
//     let stateCount = 0;
//     let cityCount = 0;

//     if (Array.isArray(policies)) {
//       policies.forEach((policy: Policy) => {
//         // States
//         if (policy.state_name) {
//           stateCount++;
//         }

//         // Cities
//         if (policy.cities && Array.isArray(policy.cities) && policy.cities.length > 0) {
//           cityCount += policy.cities.length;
//         }
//       });
//     }

//     setStats({
//       state: stateCount,
//       city: cityCount,
//     });
//   }, [policies]);

//   // Reset form
//   const resetForm = () => {
//     setFormData({
//       level: 'state',
//       stateName: '',
//       cityName: '',
//       stateTitle: '',
//       stateDescription: '',
//       cityTitle: '',
//       cityDescription: '',
//       areaType: 'all',
//       freeRadius: '',
//       perKmRate: '',
//       threshold: '',
//       image: null
//     });
//     setImagePreview(null);
//     setEditingPolicy(null);
//     setEditingType(null);
//   };

//   // Open modal for create
//   const openCreateModal = () => {
//     resetForm();
//     setIsModalOpen(true);
//   };

//   // Open modal for state edit
//   const openStateEditModal = (policy: Policy) => {
//     setEditingPolicy(policy);
//     setEditingType('state');
    
//     setFormData({
//       level: 'state',
//       stateName: policy.state_name || "",
//       cityName: "",
//       stateTitle: policy.stateTitle || "",
//       stateDescription: policy.stateDescription || "",
//       cityTitle: "",
//       cityDescription: "",
//       areaType: policy.area_type || "all",
//       freeRadius: policy.free_radius_km?.toString() || "",
//       perKmRate: policy.per_km_rate?.toString() || "",
//       threshold: policy.availability_threshold?.toString() || "",
//       image: policy.imageUrl || null
//     });

//     setImagePreview(policy.imageUrl || null);
//     setIsModalOpen(true);
//   };

//   // Open modal for city edit
//   const openCityEditModal = (policy: Policy, city: CityPolicy) => {
//     setEditingPolicy({
//       ...policy,
//       city_name: city.city_name
//     });
//     setEditingType('city');
    
//     setFormData({
//       level: 'city',
//       stateName: policy.state_name || "",
//       cityName: city.city_name || "",
//       stateTitle: policy.stateTitle || "",
//       stateDescription: policy.stateDescription || "",
//       cityTitle: city.cityTitle || "",
//       cityDescription: city.cityDescription || "",
//       areaType: city.area_type || policy.area_type || "all",
//       freeRadius: city.free_radius_km?.toString() || policy.free_radius_km?.toString() || "",
//       perKmRate: city.per_km_rate?.toString() || policy.per_km_rate?.toString() || "",
//       threshold: city.availability_threshold?.toString() || policy.availability_threshold?.toString() || "",
//       image: city.imageUrl || policy.imageUrl || null
//     });

//     setImagePreview(city.imageUrl || policy.imageUrl || null);
//     setIsModalOpen(true);
//   };

//   // Close modal
//   const closeModal = () => {
//     setIsModalOpen(false);
//     resetForm();
//   };

//   // Handle input change
//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   // Handle radio change
//   const handleLevelChange = (level: 'state' | 'city') => {
//     setFormData(prev => ({ ...prev, level }));
//   };

//   // Handle image upload
//   const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         const imageData = reader.result as string;
//         setImagePreview(imageData);
//         setFormData(prev => ({ ...prev, image: imageData }));
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   // Toggle State Visibility
//   const toggleStateVisibility = async (policyId: string, currentStatus: boolean) => {
//     try {
//       console.log("Toggling state:", policyId, "Current:", currentStatus, "New:", !currentStatus);
      
//       const res = await fetch(`${API_BASE}/${policyId}`, {
//         method: "PATCH",
//         headers,
//         body: JSON.stringify({
//           state_active: !currentStatus
//         }),
//       });

//       const data = await res.json();
//       console.log("Toggle State Response:", data);
      
//       if (data.success) {
//         alert(`State ${!currentStatus ? 'Activated' : 'Deactivated'} Successfully ✅`);
//         // Immediate local update
//         setPolicies(prevPolicies => 
//           prevPolicies.map(policy => 
//             policy._id === policyId 
//               ? { ...policy, state_active: !currentStatus }
//               : policy
//           )
//         );
//         fetchPolicies();
//       } else {
//         alert(data.message || "Failed to update visibility");
//       }
//     } catch (error) {
//       console.error("Toggle State Error:", error);
//       alert("Network error. Please try again.");
//     }
//   };

//   // Toggle City Visibility
//   const toggleCityVisibility = async (policyId: string, cityName: string, currentStatus: boolean) => {
//     try {
//       console.log("Toggling city:", policyId, cityName, "Current:", currentStatus, "New:", !currentStatus);
      
//       const res = await fetch(`${API_BASE}/${policyId}/cities`, {
//         method: "PATCH",
//         headers,
//         body: JSON.stringify({
//           city_name: cityName,
//           is_active: !currentStatus
//         }),
//       });

//       const data = await res.json();
//       console.log("Toggle City Response:", data);
      
//       if (data.success) {
//         alert(`City ${!currentStatus ? 'Activated' : 'Deactivated'} Successfully ✅`);
//         // Immediate local update
//         setPolicies(prevPolicies => 
//           prevPolicies.map(policy => {
//             if (policy._id === policyId && policy.cities) {
//               return {
//                 ...policy,
//                 cities: policy.cities.map(city => 
//                   city.city_name === cityName 
//                     ? { ...city, is_active: !currentStatus }
//                     : city
//                 )
//               };
//             }
//             return policy;
//           })
//         );
//         fetchPolicies();
//       } else {
//         alert(data.message || "Failed to update visibility");
//       }
//     } catch (error) {
//       console.error("Toggle City Error:", error);
//       alert("Network error. Please try again.");
//     }
//   };

//   // Save policy
//   const savePolicy = async () => {
//     try {
//       if (
//         !formData.freeRadius ||
//         !formData.perKmRate ||
//         !formData.threshold
//       ) {
//         alert("Please fill all required fields");
//         return;
//       }

//       let url = API_BASE;
//       let method = "POST";
//       let body: any = {};

//       // =========================
//       // 🔥 STATE EDIT
//       // =========================
//       if (editingType === 'state' && editingPolicy) {
//         url = `${API_BASE}/${editingPolicy._id}`;
//         method = "PATCH";

//         body = {
//           state_name: formData.stateName,
//           stateTitle: formData.stateTitle,
//           stateDescription: formData.stateDescription,
//           area_type: formData.areaType,
//           free_radius_km: Number(formData.freeRadius),
//           per_km_rate: Number(formData.perKmRate),
//           availability_threshold: Number(formData.threshold),
//           imageUrl: formData.image,
//           state_active: true
//         };
//       }

//       // =========================
//       // 🔥 CITY EDIT
//       // =========================
//       else if (editingType === 'city' && editingPolicy) {
//         url = `${API_BASE}/${editingPolicy._id}/cities`;
//         method = "PATCH";

//         body = {
//           city_name: formData.cityName,
//           cityTitle: formData.cityTitle,
//           cityDescription: formData.cityDescription,
//           area_type: formData.areaType,
//           free_radius_km: Number(formData.freeRadius),
//           per_km_rate: Number(formData.perKmRate),
//           availability_threshold: Number(formData.threshold),
//           imageUrl: formData.image,
//           is_active: true
//         };
//       }

//       // =========================
//       // 🔥 CREATE NEW STATE WITH CITY
//       // =========================
//       else {
//         body = {
//           state_name: formData.stateName,
//           stateTitle: formData.stateTitle,
//           stateDescription: formData.stateDescription,
//           area_type: formData.areaType,
//           free_radius_km: Number(formData.freeRadius),
//           per_km_rate: Number(formData.perKmRate),
//           availability_threshold: Number(formData.threshold),
//           imageUrl: formData.image,
//           state_active: true,
//           cities: formData.cityName ? [
//             {
//               city_name: formData.cityName,
//               cityTitle: formData.cityTitle || formData.stateTitle,
//               cityDescription: formData.cityDescription || formData.stateDescription,
//               area_type: formData.areaType,
//               free_radius_km: Number(formData.freeRadius),
//               per_km_rate: Number(formData.perKmRate),
//               availability_threshold: Number(formData.threshold),
//               imageUrl: formData.image,
//               is_active: true
//             }
//           ] : []
//         };
//       }

//       const res = await fetch(url, {
//         method,
//         headers,
//         body: JSON.stringify(body),
//       });

//       const data = await res.json();
//       console.log("SAVE Response:", data);

//       if (data.success) {
//         alert(editingPolicy ? "Updated Successfully ✅" : "Created Successfully ✅");
//         fetchPolicies();
//         closeModal();
//       } else {
//         alert(data.message || "Something went wrong");
//       }

//     } catch (error) {
//       console.error("SAVE Error:", error);
//     }
//   };

//   // Delete state policy
//   const deletePolicy = async (policyId: string) => {
//     const confirmDelete = confirm("Are you sure you want to delete this policy?");

//     if (!confirmDelete) return;

//     try {
//       const res = await fetch(`${API_BASE}/${policyId}`, {
//         method: "DELETE",
//         headers,
//       });

//       const data = await res.json();
//       console.log("DELETE Response:", data);

//       if (data.success) {
//         alert("Policy Deleted Successfully ✅");
//         fetchPolicies();
//       } else {
//         alert(data.message || "Delete failed");
//       }

//     } catch (error) {
//       console.error("DELETE Error:", error);
//     }
//   };

//   // Delete city
//   const deleteCity = async (policyId: string, cityName: string) => {
//     const confirmDelete = confirm("Are you sure you want to delete this city?");

//     if (!confirmDelete) return;

//     try {
//       const res = await fetch(`${API_BASE}/${policyId}/cities`, {
//         method: "DELETE",
//         headers,
//         body: JSON.stringify({ city_name: cityName }),
//       });

//       const data = await res.json();
//       console.log("City Delete Response:", data);

//       if (data.success) {
//         alert("City Deleted Successfully ✅");
//         fetchPolicies();
//       } else {
//         alert(data.message || "Delete failed");
//       }

//     } catch (error) {
//       console.error("City Delete Error:", error);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 p-5">
//       <div className="max-w-7xl mx-auto">
//         <h1 className="text-4xl font-bold text-blue-900 mb-8">
//           🚚 Multi-Level Conveyance Policy Admin
//         </h1>

//         {/* Statistics */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8 max-w-2xl">
//           <div className="bg-white rounded-xl p-6 text-center shadow-md">
//             <div className="text-4xl font-bold text-green-600">{stats.state}</div>
//             <div className="text-gray-600 mt-2">State Policies</div>
//           </div>
//           <div className="bg-white rounded-xl p-6 text-center shadow-md">
//             <div className="text-4xl font-bold text-orange-600">{stats.city}</div>
//             <div className="text-gray-600 mt-2">City Policies</div>
//           </div>
//         </div>

//         {/* Create Button */}
//         <button
//           onClick={openCreateModal}
//           className="mb-8 px-8 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors text-lg font-semibold shadow-lg"
//         >
//           ➕ Create New Conveyance Policy
//         </button>

//         {/* State Policies */}
//         <h2 className="text-2xl font-bold text-green-700 mb-4">🏙️ State Policies</h2>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
//           {Array.isArray(policies) && policies.length > 0 ? (
//             policies.map((policy: Policy) => (
//               <div key={policy._id} className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-green-700 hover:shadow-xl transition-all">
//                 <div className="flex justify-between items-start mb-4">
//                   <div>
//                     <h3 className="text-xl font-bold text-gray-800">
//                        State:- {
//                             policy._id
//                         }
//                     </h3>
//                     <h3 className="text-xl font-bold text-gray-800">
//                       State Title:-{policy.stateTitle || policy.state_name}
//                     </h3>
//                     <span className="inline-block mt-1 text-xs px-2 py-1 rounded-full bg-green-700 text-white">
//                       🏙️ State
//                     </span>
//                   </div>
//                   <div className="flex items-center gap-3">
//                     <div className="flex items-center gap-2">
//                       <button
//                         type="button"
//                         onClick={(e) => {
//                           e.preventDefault();
//                           e.stopPropagation();
//                           toggleStateVisibility(policy._id, policy.state_active);
//                         }}
//                         className={`relative w-12 h-6 rounded-full transition-colors focus:outline-none cursor-pointer ${
//                           policy.state_active ? 'bg-green-500' : 'bg-gray-300'
//                         }`}
//                       >
//                         <span
//                           className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
//                             policy.state_active ? 'translate-x-6' : 'translate-x-0'
//                           }`}
//                         />
//                       </button>
//                       <span className={`text-sm font-medium ${
//                         policy.state_active ? 'text-green-600' : 'text-gray-500'
//                       }`}>
//                         {policy.state_active ? 'Visible' : 'Hidden'}
//                       </span>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="mb-2 text-gray-700">
//                   <span className="font-medium">📍 {policy.state_name}</span>
//                 </div>

//                 <p className="text-gray-600 mb-4">
//                 stateDescription:-  {policy.stateDescription || ''}
//                 </p>

//                 <div className="space-y-2 mb-4">
//                   <div className="flex">
//                     <span className="font-medium text-gray-600 w-36">Area Type:</span>
//                     <span className="text-gray-800 capitalize">{policy.area_type}</span>
//                   </div>
//                   <div className="flex">
//                     <span className="font-medium text-gray-600 w-36">Free Radius:</span>
//                     <span className="text-gray-800">{policy.free_radius_km} km</span>
//                   </div>
//                   <div className="flex">
//                     <span className="font-medium text-gray-600 w-36">Per Km Rate:</span>
//                     <span className="text-gray-800">₹{policy.per_km_rate}</span>
//                   </div>
//                   <div className="flex">
//                     <span className="font-medium text-gray-600 w-36">Availability Threshold:</span>
//                     <span className="text-gray-800">{policy.availability_threshold} technicians</span>
//                   </div>
//                 </div>

//                 {policy.imageUrl && (
//                   <div className="mb-4">
//                     <img src={policy.imageUrl} alt={policy.state_name} className="max-w-full h-32 rounded-lg object-cover" />
//                   </div>
//                 )}

//                 <div className="flex gap-3 mt-4">
//                   <button
//                     onClick={() => openStateEditModal(policy)}
//                     className="flex-1 px-4 py-2 text-sm font-medium text-orange-700 bg-orange-100 rounded-lg hover:bg-orange-200 transition-colors"
//                   >
//                     ✏️ Edit
//                   </button>
//                   <button
//                     onClick={() => deletePolicy(policy._id)}
//                     className="flex-1 px-4 py-2 text-sm font-medium text-red-700 bg-red-100 rounded-lg hover:bg-red-200 transition-colors"
//                   >
//                     🗑️ Delete
//                   </button>
//                 </div>

//                 {/* Display Cities under this State */}
//                 {policy.cities && Array.isArray(policy.cities) && policy.cities.length > 0 && (
//                   <div className="mt-6 pt-4 border-t border-gray-200">
//                     <h4 className="text-sm font-semibold text-gray-600 mb-3">Cities under this state:</h4>
//                     <div className="space-y-3">
//                       {policy.cities.map((city, idx) => (
//                         <div key={idx} className="bg-orange-50 p-3 rounded-lg">
//                           <div className="flex justify-between items-start">
//                             <div>
//                                   <p className="text-xs text-gray-600">📍City:-   {city.city_name}</p>
//                               <h5 className="font-medium text-gray-800">cityTitle:- {city.cityTitle || city.city_name}</h5>
                              
//                             </div>
//                             <div className="flex items-center gap-2">
//                               <button
//                                 type="button"
//                                 onClick={(e) => {
//                                   e.preventDefault();
//                                   e.stopPropagation();
//                                   toggleCityVisibility(policy._id, city.city_name, city.is_active);
//                                 }}
//                                 className={`relative w-10 h-5 rounded-full transition-colors ${
//                                   city.is_active ? 'bg-green-500' : 'bg-gray-300'
//                                 }`}
//                               >
//                                 <span
//                                   className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
//                                     city.is_active ? 'translate-x-5' : 'translate-x-0'
//                                   }`}
//                                 />
//                               </button>
//                               <button
//                                 onClick={() => openCityEditModal(policy, city)}
//                                 className="text-xs text-orange-600 hover:text-orange-800"
//                               >
//                                 ✏️
//                               </button>
//                               <button
//                                 onClick={() => deleteCity(policy._id, city.city_name)}
//                                 className="text-xs text-red-600 hover:text-red-800"
//                               >
//                                 🗑️
//                               </button>
//                             </div>
//                           </div>
//                           <div className="grid grid-cols-2 gap-2 mt-2 text-xs">
//                             <div>Area: {city.area_type}</div>
//                             <div>Free: {city.free_radius_km}km</div>
//                             <div>Rate: ₹{city.per_km_rate}</div>
//                             <div>Threshold: {city.availability_threshold}</div>
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 )}
//               </div>
//             ))
//           ) : (
//             <p className="text-gray-500 col-span-2">No state policies available</p>
//           )}
//         </div>

//         {/* Modal */}
//         {isModalOpen && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
//             <div className="bg-white rounded-2xl max-w-2xl w-full p-8 relative">
//               <button
//                 onClick={closeModal}
//                 className="absolute right-6 top-4 text-3xl text-gray-500 hover:text-gray-700"
//               >
//                 &times;
//               </button>

//               <h2 className="text-2xl font-bold text-gray-800 mb-6">
//                 {editingPolicy ? 'Edit Policy' : 'Create New Policy'}
//               </h2>

//               <div className="space-y-5">
//                 {/* Level Selection - Hide when editing */}
//                 {!editingPolicy && (
//                   <div>
//                     <label className="block text-sm font-semibold text-gray-700 mb-2">
//                       Policy Level
//                     </label>
//                     <div className="flex gap-6">
//                       <label className="flex items-center gap-2">
//                         <input
//                           type="radio"
//                           name="level"
//                           checked={formData.level === 'state'}
//                           onChange={() => handleLevelChange('state')}
//                           className="w-4 h-4 text-blue-600"
//                         />
//                         <span>🏙️ State (Create State with City)</span>
//                       </label>
//                       <label className="flex items-center gap-2">
//                         <input
//                           type="radio"
//                           name="level"
//                           checked={formData.level === 'city'}
//                           onChange={() => handleLevelChange('city')}
//                           className="w-4 h-4 text-blue-600"
//                         />
//                         <span>📍 City Only</span>
//                       </label>
//                     </div>
//                   </div>
//                 )}

//                 {/* State Select */}
//                 <div>
//                   <label className="block text-sm font-semibold text-gray-700 mb-2">
//                     Select State
//                   </label>
//                   <select
//                     name="stateName"
//                     value={formData.stateName}
//                     onChange={handleInputChange}
//                     disabled={editingType === 'state' || editingType === 'city'}
//                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
//                   >
//                    <option value="">-- Select State --</option>
//                   <option value="Andhra Pradesh">INDIA</option> 
// <option value="Andhra Pradesh">Andhra Pradesh</option>
// <option value="Arunachal Pradesh">Arunachal Pradesh</option>
// <option value="Assam">Assam</option>
// <option value="Bihar">Bihar</option>
// <option value="Chhattisgarh">Chhattisgarh</option>
// <option value="Goa">Goa</option>
// <option value="Gujarat">Gujarat</option>
// <option value="Haryana">Haryana</option>
// <option value="Himachal Pradesh">Himachal Pradesh</option>
// <option value="Jharkhand">Jharkhand</option>
// <option value="Karnataka">Karnataka</option>
// <option value="Kerala">Kerala</option>
// <option value="Madhya Pradesh">Madhya Pradesh</option>
// <option value="Maharashtra">Maharashtra</option>
// <option value="Manipur">Manipur</option>
// <option value="Meghalaya">Meghalaya</option>
// <option value="Mizoram">Mizoram</option>
// <option value="Nagaland">Nagaland</option>
// <option value="Odisha">Odisha</option>
// <option value="Punjab">Punjab</option>
// <option value="Rajasthan">Rajasthan</option>
// <option value="Sikkim">Sikkim</option>
// <option value="Tamil Nadu">Tamil Nadu</option>
// <option value="Telangana">Telangana</option>
// <option value="Tripura">Tripura</option>
// <option value="Uttar Pradesh">Uttar Pradesh</option>
// <option value="Uttarakhand">Uttarakhand</option>
// <option value="West Bengal">West Bengal</option>
//                   </select>
//                 </div>

//                 {/* City Select - Show for city level or when creating new */}
//                 {(formData.level === 'city' || editingType === 'city' || !editingPolicy) && (
//                   <div>
//                     <label className="block text-sm font-semibold text-gray-700 mb-2">
//                       Select City
//                     </label>
//                     <select
//                       name="cityName"
//                       value={formData.cityName}
//                       onChange={handleInputChange}
//                       disabled={editingType === 'city'}
//                       className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
//                     >
//                       <option value="">-- Select City --</option>
//                       <option value="Lucknow">Lucknow</option>
//                       <option value="Ayodhya">Ayodhya</option>
//                       <option value="Varanasi">Varanasi</option>
//                       <option value="Kanpur">Kanpur</option>
//                       <option value="Agra">Agra</option>
//                     </select>
//                   </div>
//                 )}

//                 {/* State Title - Show for state level */}
//                 {(formData.level === 'state' || editingType === 'state') && (
//                   <div>
//                     <label className="block text-sm font-semibold text-gray-700 mb-2">
//                       State Policy Title
//                     </label>
//                     <input
//                       type="text"
//                       name="stateTitle"
//                       value={formData.stateTitle}
//                       onChange={handleInputChange}
//                       placeholder="e.g., UP Conveyance Policy"
//                       className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                     />
//                   </div>
//                 )}

//                 {/* State Description - Show for state level */}
//                 {(formData.level === 'state' || editingType === 'state') && (
//                   <div>
//                     <label className="block text-sm font-semibold text-gray-700 mb-2">
//                       State Policy Description
//                     </label>
//                     <textarea
//                       name="stateDescription"
//                       value={formData.stateDescription}
//                       onChange={handleInputChange}
//                       rows={2}
//                       placeholder="State policy description"
//                       className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                     />
//                   </div>
//                 )}

//                 {/* City Title - Show for city level or when editing city */}
//                 {(formData.level === 'city' || editingType === 'city') && (
//                   <div>
//                     <label className="block text-sm font-semibold text-gray-700 mb-2">
//                       City Policy Title
//                     </label>
//                     <input
//                       type="text"
//                       name="cityTitle"
//                       value={formData.cityTitle}
//                       onChange={handleInputChange}
//                       placeholder="e.g., Lucknow City Policy"
//                       className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                     />
//                   </div>
//                 )}

//                 {/* City Description - Show for city level or when editing city */}
//                 {(formData.level === 'city' || editingType === 'city') && (
//                   <div>
//                     <label className="block text-sm font-semibold text-gray-700 mb-2">
//                       City Policy Description
//                     </label>
//                     <textarea
//                       name="cityDescription"
//                       value={formData.cityDescription}
//                       onChange={handleInputChange}
//                       rows={2}
//                       placeholder="City policy description"
//                       className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                     />
//                   </div>
//                 )}

//                 {/* Area Type */}
//                 <div>
//                   <label className="block text-sm font-semibold text-gray-700 mb-2">
//                     Area Type
//                   </label>
//                   <select
//                     name="areaType"
//                     value={formData.areaType}
//                     onChange={handleInputChange}
//                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                   >
//                     <option value="all">All</option>
//                     <option value="urban">Urban</option>
//                     <option value="rural">Rural</option>
//                   </select>
//                 </div>

//                 {/* Free Radius */}
//                 <div>
//                   <label className="block text-sm font-semibold text-gray-700 mb-2">
//                     Free Radius (km)
//                   </label>
//                   <input
//                     type="number"
//                     name="freeRadius"
//                     value={formData.freeRadius}
//                     onChange={handleInputChange}
//                     placeholder="e.g., 5"
//                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                   />
//                 </div>

//                 {/* Per Km Rate */}
//                 <div>
//                   <label className="block text-sm font-semibold text-gray-700 mb-2">
//                     Per Km Rate (₹)
//                   </label>
//                   <input
//                     type="number"
//                     name="perKmRate"
//                     value={formData.perKmRate}
//                     onChange={handleInputChange}
//                     placeholder="e.g., 10"
//                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                   />
//                 </div>

//                 {/* Threshold */}
//                 <div>
//                   <label className="block text-sm font-semibold text-gray-700 mb-2">
//                     Availability Threshold
//                   </label>
//                   <input
//                     type="number"
//                     name="threshold"
//                     value={formData.threshold}
//                     onChange={handleInputChange}
//                     placeholder="e.g., 5"
//                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                   />
//                   <p className="text-xs text-gray-500 mt-1">
//                     If this many technicians are available, show confirmed price
//                   </p>
//                 </div>

//                 {/* Image Upload */}
//                 <div>
//                   <label className="block text-sm font-semibold text-gray-700 mb-2">
//                     Policy Image
//                   </label>
//                   <input
//                     type="file"
//                     accept="image/*"
//                     onChange={handleImageUpload}
//                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                   />
//                   {imagePreview && (
//                     <img
//                       src={imagePreview}
//                       alt="Preview"
//                       className="mt-3 max-w-full h-32 rounded-lg object-cover"
//                     />
//                   )}
//                 </div>

//                 {/* Buttons */}
//                 <div className="flex gap-4 pt-4">
//                   <button
//                     onClick={savePolicy}
//                     className="flex-1 px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
//                   >
//                     ✅ Save
//                   </button>
//                   <button
//                     onClick={closeModal}
//                     className="flex-1 px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors"
//                   >
//                     ✖ Cancel
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

"use client";

import { Policy } from "@mui/icons-material";
import { useState, useEffect } from "react";

// Types
interface CityPolicy {
  city_name: string;
  is_active: boolean;
  cityTitle: string;
  cityDescription?: string;
  area_type: 'all' | 'urban' | 'rural';
  free_radius_km: number;
  per_km_rate: number;
  availability_threshold: number;
  imageUrl?: string | null;
  videoUrl?: string | null;
}

interface Policy {
  _id: string;
  state_name: string;
  stateTitle: string;
  stateDescription?: string;
  area_type: 'all' | 'urban' | 'rural';
  free_radius_km: number;
  per_km_rate: number;
  availability_threshold: number;
  state_active: boolean;
  imageUrl?: string | null;
  videoUrl?: string | null;
  cities: CityPolicy[];
}

export default function ConveyancePolicyPage() {
  // Dynamic Data Get
  const [policies, setPolicies] = useState<Policy[]>([]);
  const API_BASE = "https://api.bijliwalaaya.in/api/conveyance-policies";

  const headers = {
    "Content-Type": "application/json",
    "x-api-token": "super_secure_token",
  };

  const fetchPolicies = async () => {
    try {
      const res = await fetch(API_BASE, {
        method: "GET",
        headers,
      });

      const data = await res.json();
      console.log("GET Response:", data);

      if (Array.isArray(data)) {
        setPolicies(data);
      } else if (data && Array.isArray(data.data)) {
        setPolicies(data.data);
      } else {
        console.error("Unexpected data format:", data);
        setPolicies([]);
      }
    } catch (error) {
      console.error("Error fetching policies:", error);
      setPolicies([]);
    }
  };

  useEffect(() => {
    fetchPolicies();
  }, []);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPolicy, setEditingPolicy] = useState<any>(null);
  const [editingType, setEditingType] = useState<'state' | 'city' | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    level: 'state' as 'state' | 'city',
    stateName: '',
    cityName: '',
    stateTitle: '',
    stateDescription: '',
    cityTitle: '',
    cityDescription: '',
    areaType: 'all' as 'all' | 'urban' | 'rural',
    freeRadius: '',
    perKmRate: '',
    threshold: '',
    image: null as string | null
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Statistics
  const [stats, setStats] = useState({
    state: 0,
    city: 0
  });

  // Update statistics
  useEffect(() => {
    let stateCount = 0;
    let cityCount = 0;

    if (Array.isArray(policies)) {
      policies.forEach((policy: Policy) => {
        if (policy.state_name) {
          stateCount++;
        }
        if (policy.cities && Array.isArray(policy.cities) && policy.cities.length > 0) {
          cityCount += policy.cities.length;
        }
      });
    }

    setStats({
      state: stateCount,
      city: cityCount,
    });
  }, [policies]);

  // Reset form
  const resetForm = () => {
    setFormData({
      level: 'state',
      stateName: '',
      cityName: '',
      stateTitle: '',
      stateDescription: '',
      cityTitle: '',
      cityDescription: '',
      areaType: 'all',
      freeRadius: '',
      perKmRate: '',
      threshold: '',
      image: null
    });
    setImagePreview(null);
    setEditingPolicy(null);
    setEditingType(null);
  };

  // Open modal for create
  const openCreateModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  // Open modal for state edit
  const openStateEditModal = (policy: Policy) => {
    setEditingPolicy(policy);
    setEditingType('state');
    
    setFormData({
      level: 'state',
      stateName: policy.state_name || "",
      cityName: "",
      stateTitle: policy.stateTitle || "",
      stateDescription: policy.stateDescription || "",
      cityTitle: "",
      cityDescription: "",
      areaType: policy.area_type || "all",
      freeRadius: policy.free_radius_km?.toString() || "",
      perKmRate: policy.per_km_rate?.toString() || "",
      threshold: policy.availability_threshold?.toString() || "",
      image: policy.imageUrl || null
    });

    setImagePreview(policy.imageUrl || null);
    setIsModalOpen(true);
  };

  // Open modal for city edit
  const openCityEditModal = (policy: Policy, city: CityPolicy) => {
    setEditingPolicy({
      ...policy,
      city_name: city.city_name
    });
    setEditingType('city');
    
    setFormData({
      level: 'city',
      stateName: policy.state_name || "",
      cityName: city.city_name || "",
      stateTitle: policy.stateTitle || "",
      stateDescription: policy.stateDescription || "",
      cityTitle: city.cityTitle || "",
      cityDescription: city.cityDescription || "",
      areaType: city.area_type || policy.area_type || "all",
      freeRadius: city.free_radius_km?.toString() || policy.free_radius_km?.toString() || "",
      perKmRate: city.per_km_rate?.toString() || policy.per_km_rate?.toString() || "",
      threshold: city.availability_threshold?.toString() || policy.availability_threshold?.toString() || "",
      image: city.imageUrl || policy.imageUrl || null
    });

    setImagePreview(city.imageUrl || policy.imageUrl || null);
    setIsModalOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  // Handle input change
 const handleInputChange = (
  e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
) => {
  const { name, value } = e.target;

  if (name === "stateName") {
    setFormData(prev => ({
      ...prev,
      stateName: value,
      cityName: ""   // reset city when state changes
    }));
  } else {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  }
};


  // Handle radio change
  const handleLevelChange = (level: 'state' | 'city') => {
    setFormData(prev => ({ ...prev, level }));
  };

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageData = reader.result as string;
        setImagePreview(imageData);
        setFormData(prev => ({ ...prev, image: imageData }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Toggle State Visibility
  const toggleStateVisibility = async (policyId: string, currentStatus: boolean) => {
    try {
      const res = await fetch(`${API_BASE}/${policyId}`, {
        method: "PATCH",
        headers,
        body: JSON.stringify({
          state_active: !currentStatus
        }),
      });

      const data = await res.json();
      
      if (data.success) {
        alert(`State ${!currentStatus ? 'Activated' : 'Deactivated'} Successfully ✅`);
        setPolicies(prevPolicies => 
          prevPolicies.map(policy => 
            policy._id === policyId 
              ? { ...policy, state_active: !currentStatus }
              : policy
          )
        );
        fetchPolicies();
      } else {
        alert(data.message || "Failed to update visibility");
      }
    } catch (error) {
      console.error("Toggle State Error:", error);
      alert("Network error. Please try again.");
    }
  };

  // Toggle City Visibility
  const toggleCityVisibility = async (policyId: string, cityName: string, currentStatus: boolean) => {
    try {
      const res = await fetch(`${API_BASE}/${policyId}/cities`, {
        method: "PATCH",
        headers,
        body: JSON.stringify({
          city_name: cityName,
          is_active: !currentStatus
        }),
      });

      const data = await res.json();
      
      if (data.success) {
        alert(`City ${!currentStatus ? 'Activated' : 'Deactivated'} Successfully ✅`);
        setPolicies(prevPolicies => 
          prevPolicies.map(policy => {
            if (policy._id === policyId && policy.cities) {
              return {
                ...policy,
                cities: policy.cities.map(city => 
                  city.city_name === cityName 
                    ? { ...city, is_active: !currentStatus }
                    : city
                )
              };
            }
            return policy;
          })
        );
        fetchPolicies();
      } else {
        alert(data.message || "Failed to update visibility");
      }
    } catch (error) {
      console.error("Toggle City Error:", error);
      alert("Network error. Please try again.");
    }
  };

  // Save policy
  const savePolicy = async () => {
    try {
      if (
        !formData.freeRadius ||
        !formData.perKmRate ||
        !formData.threshold
      ) {
        alert("Please fill all required fields");
        return;
      }

      let url = API_BASE;
      let method = "POST";
      let body: any = {};

      // =========================
      // 🔥 STATE EDIT
      // =========================
     if (editingType === 'state' && editingPolicy) {
  url = `${API_BASE}`;
  method = "Post";

  body = {
      state_name: editingPolicy._id, 
    stateTitle: formData.stateTitle,
    stateDescription: formData.stateDescription,
    area_type: formData.areaType,
    free_radius_km: Number(formData.freeRadius),
    per_km_rate: Number(formData.perKmRate),
    availability_threshold: Number(formData.threshold),
    imageUrl: formData.image,
    state_active: editingPolicy.state_active
  };
}


      // =========================
      // 🔥 CITY EDIT
      // =========================
      else if (editingType === 'city' && editingPolicy) {
        url = `${API_BASE}/${editingPolicy._id}/cities`;
        method = "PATCH";

        body = {
          city_name: formData.cityName,
          cityTitle: formData.cityTitle,
          cityDescription: formData.cityDescription,
          area_type: formData.areaType,
          free_radius_km: Number(formData.freeRadius),
          per_km_rate: Number(formData.perKmRate),
          availability_threshold: Number(formData.threshold),
          imageUrl: formData.image,
          is_active: true
        };
      }

      // =========================
      // 🔥 CREATE NEW STATE WITH CITY
      // =========================
      else {
        body = {
          state_name: formData.stateName,
          stateTitle: formData.stateTitle,
          stateDescription: formData.stateDescription,
          area_type: formData.areaType,
          free_radius_km: Number(formData.freeRadius),
          per_km_rate: Number(formData.perKmRate),
          availability_threshold: Number(formData.threshold),
          imageUrl: formData.image,
          state_active: true,
          cities: formData.cityName ? [
            {
              city_name: formData.cityName,
              cityTitle: formData.cityTitle || formData.stateTitle,
              cityDescription: formData.cityDescription || formData.stateDescription,
              area_type: formData.areaType,
              free_radius_km: Number(formData.freeRadius),
              per_km_rate: Number(formData.perKmRate),
              availability_threshold: Number(formData.threshold),
              imageUrl: formData.image,
              is_active: true
            }
          ] : []
        };
      }

      const res = await fetch(url, {
        method,
        headers,
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (data.success) {
        alert(editingPolicy ? "Updated Successfully ✅" : "Created Successfully ✅");
        fetchPolicies();
        closeModal();
      } else {
        alert(data.message || "Something went wrong");
      }

    } catch (error) {
      console.error("SAVE Error:", error);
    }
  };

  // Delete state policy
  const deletePolicy = async (policyId: string) => {
    const confirmDelete = confirm("Are you sure you want to delete this policy?");

    if (!confirmDelete) return;

    try {
      const res = await fetch(`${API_BASE}/${policyId}`, {
        method: "DELETE",
        headers,
      });

      const data = await res.json();

      if (data.success) {
        alert("Policy Deleted Successfully ✅");
        fetchPolicies();
      } else {
        alert(data.message || "Delete failed");
      }

    } catch (error) {
      console.error("DELETE Error:", error);
    }
  };

  // Delete city
  const deleteCity = async (policyId: string, cityName: string) => {
    const confirmDelete = confirm("Are you sure you want to delete this city?");

    if (!confirmDelete) return;

    try {
      const res = await fetch(`${API_BASE}/${policyId}/cities`, {
        method: "DELETE",
        headers,
        body: JSON.stringify({ city_name: cityName }),
      });

      const data = await res.json();

      if (data.success) {
        alert("City Deleted Successfully ✅");
        fetchPolicies();
      } else {
        alert(data.message || "Delete failed");
      }

    } catch (error) {
      console.error("City Delete Error:", error);
    }
  };
  // City Dropdown
  const stateCityMap: { [key: string]: string[] } = {
  "Andhra Pradesh": ["Visakhapatnam", "Vijayawada", "Guntur", "Nellore", "Kurnool", "Rajahmundry"],
  "Arunachal Pradesh": ["Itanagar", "Tawang", "Pasighat", "Ziro", "Bomdila"],
  "Assam": ["Guwahati", "Silchar", "Dibrugarh", "Jorhat", "Tezpur"],
  "Bihar": ["Patna", "Gaya", "Muzaffarpur", "Bhagalpur", "Darbhanga", "Purnia", "Ara", "Begusarai"],
  "Chhattisgarh": ["Raipur", "Bhilai", "Durg", "Bilaspur", "Korba"],
  "Goa": ["Panaji", "Margao", "Vasco da Gama", "Mapusa"],
  "Gujarat": ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Bhavnagar"],
  "Haryana": ["Gurugram", "Faridabad", "Panipat", "Ambala", "Hisar"],
  "Himachal Pradesh": ["Shimla", "Manali", "Dharamshala", "Solan", "Mandi"],
  "Jharkhand": ["Ranchi", "Jamshedpur", "Dhanbad", "Bokaro", "Deoghar"],
  "Karnataka": ["Bengaluru", "Mysuru", "Mangaluru", "Hubli", "Belagavi"],
  "Kerala": ["Thiruvananthapuram", "Kochi", "Kozhikode", "Thrissur", "Kollam"],
  "Madhya Pradesh": ["Bhopal", "Indore", "Gwalior", "Jabalpur", "Ujjain"],
  "Maharashtra": ["Mumbai", "Pune", "Nagpur", "Nashik", "Thane", "Aurangabad"],
  "Manipur": ["Imphal", "Thoubal", "Bishnupur", "Churachandpur"],
  "Meghalaya": ["Shillong", "Tura", "Nongpoh", "Jowai"],
  "Mizoram": ["Aizawl", "Lunglei", "Champhai"],
  "Nagaland": ["Kohima", "Dimapur", "Mokokchung"],
  "Odisha": ["Bhubaneswar", "Cuttack", "Rourkela", "Puri", "Sambalpur"],
  "Punjab": ["Ludhiana", "Amritsar", "Jalandhar", "Patiala", "Bathinda"],
  "Rajasthan": ["Jaipur", "Jodhpur", "Udaipur", "Kota", "Bikaner"],
  "Sikkim": ["Gangtok", "Namchi", "Gyalshing"],
  "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Salem", "Tiruchirappalli"],
  "Telangana": ["Hyderabad", "Warangal", "Nizamabad", "Karimnagar"],
  "Tripura": ["Agartala", "Udaipur", "Dharmanagar"],
  "Uttar Pradesh": ["Lucknow", "Kanpur", "Varanasi", "Agra", "Prayagraj", "Noida", "Ghaziabad"],
  "Uttarakhand": ["Dehradun", "Haridwar", "Roorkee", "Haldwani"],
  "West Bengal": ["Kolkata", "Howrah", "Durgapur", "Siliguri", "Asansol"]
};
  const availableCities = stateCityMap[formData.stateName] || [];




  return (
    <div style={{
      fontFamily: "'Segoe UI', Arial, sans-serif",
      background: "#f0f2f5",
      minHeight: "100vh",
      padding: "20px"
    }}>
      <div style={{
        maxWidth: "1400px",
        margin: "0 auto"
      }}>
        <h1 style={{
          color: "#1a237e",
          marginBottom: "30px",
          fontSize: "2.5em"
        }}>
          🚚 Multi-Level Conveyance Policy Admin
        </h1>

        {/* Statistics */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: "20px",
          margin: "30px 0",
          maxWidth: "800px"
        }}>
          <div style={{
            background: "white",
            padding: "20px",
            borderRadius: "10px",
            textAlign: "center",
            boxShadow: "0 2px 10px rgba(0,0,0,0.1)"
          }}>
            <div style={{
              fontSize: "2.5em",
              fontWeight: "bold",
              color: "#2e7d32"
            }}>
              {stats.state}
            </div>
            <div style={{
              color: "#666",
              marginTop: "5px"
            }}>
              🏙️ State Policies
            </div>
          </div>
          <div style={{
            background: "white",
            padding: "20px",
            borderRadius: "10px",
            textAlign: "center",
            boxShadow: "0 2px 10px rgba(0,0,0,0.1)"
          }}>
            <div style={{
              fontSize: "2.5em",
              fontWeight: "bold",
              color: "#f57c00"
            }}>
              {stats.city}
            </div>
            <div style={{
              color: "#666",
              marginTop: "5px"
            }}>
              📍 City Policies
            </div>
          </div>
        </div>

        {/* Create Button */}
        <button
          onClick={openCreateModal}
          style={{
            background: "#1976d2",
            color: "white",
            border: "none",
            borderRadius: "6px",
            padding: "15px 30px",
            fontSize: "16px",
            fontWeight: "500",
            cursor: "pointer",
            margin: "20px 0",
            transition: "all 0.3s"
          }}
          onMouseOver={(e) => e.currentTarget.style.background = "#1565c0"}
          onMouseOut={(e) => e.currentTarget.style.background = "#1976d2"}
        >
          ➕ Create New Conveyance Policy 
        </button>

        {/* State Policies */}
        <h2 style={{
          color: "#0d47a1",
          margin: "20px 0",
          borderBottom: "2px solid #bbdefb",
          paddingBottom: "10px"
        }}>
          🏙️ State Policies 
        </h2>
        
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
          gap: "20px",
          marginTop: "20px"
        }}>
          {Array.isArray(policies) && policies.length > 0 ? (
            policies.map((policy: Policy) => (
              <div key={policy._id} style={{
                background: "#e8f5e9",
                borderRadius: "12px",
                padding: "20px",
                boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                borderLeft: "6px solid #2e7d32",
                transition: "transform 0.2s"
              }}
              onMouseOver={(e) => e.currentTarget.style.transform = "translateY(-5px)"}
              onMouseOut={(e) => e.currentTarget.style.transform = "translateY(0)"}
              >
                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "15px"
                }}>
                  <div style={{
                    fontSize: "1.3em",
                    fontWeight: "bold",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px"
                  }}>
                    {policy.stateTitle || policy.state_name}
                    <span style={{
                      fontSize: "12px",
                      padding: "4px 8px",
                      borderRadius: "20px",
                      background: "#2e7d32",
                      color: "white"
                    }}>
                      🏙️ State
                    </span>
                  </div>
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px"
                  }}>
                    <span style={{
                      color: policy.state_active ? "#2e7d32" : "#c62828",
                      fontWeight: "500"
                    }}>
                      {policy.state_active ? '🟢 Active' : '🔴 Close'}
                    </span>
                    <div
                      onClick={() => toggleStateVisibility(policy._id, policy.state_active)}
                      style={{
                        position: "relative",
                        width: "60px",
                        height: "30px",
                        background: policy.state_active ? "#4caf50" : "#b0bec5",
                        borderRadius: "30px",
                        cursor: "pointer",
                        transition: "0.3s"
                      }}
                    >
                      <div style={{
                        position: "absolute",
                        width: "26px",
                        height: "26px",
                        background: "white",
                        borderRadius: "50%",
                        top: "2px",
                        left: policy.state_active ? "32px" : "2px",
                        transition: "0.3s"
                      }} />
                    </div>
                  </div>
                </div>

                <div style={{
                  fontSize: "0.9em",
                  color: "#666",
                  marginBottom: "10px"
                }}>
                  📍 {policy.state_name}
                </div>

                <div style={{
                  margin: "15px 0",
                  padding: "10px",
                  background: "rgba(255,255,255,0.7)",
                  borderRadius: "8px"
                }}>
                  <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    margin: "8px 0",
                    padding: "5px 0",
                    borderBottom: "1px dashed #ccc"
                  }}>
                    <span style={{ fontWeight: 600, color: "#455a64" }}>📝 Description:</span>
                    <span style={{ color: "#263238" }}>{policy.stateDescription || ''}</span>
                  </div>
                  <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    margin: "8px 0",
                    padding: "5px 0",
                    borderBottom: "1px dashed #ccc"
                  }}>
                    <span style={{ fontWeight: 600, color: "#455a64" }}>🏘️ Area:</span>
                    <span style={{ color: "#263238" }}>
                     {policy.area_type === 'all' ? 'All' : policy.area_type === 'urban' ? 'Urban' : 'Rural'}

                    </span>
                  </div>
                  <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    margin: "8px 0",
                    padding: "5px 0",
                    borderBottom: "1px dashed #ccc"
                  }}>
                    <span style={{ fontWeight: 600, color: "#455a64" }}>🆓 Free KM:</span>
                    <span style={{ color: "#263238" }}>{policy.free_radius_km} km</span>
                  </div>
                  <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    margin: "8px 0",
                    padding: "5px 0",
                    borderBottom: "1px dashed #ccc"
                  }}>
                    <span style={{ fontWeight: 600, color: "#455a64" }}>💰 Per KM Rate:</span>
                    <span style={{ color: "#263238" }}>₹{policy.per_km_rate}</span>
                  </div>
                  <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    margin: "8px 0",
                    padding: "5px 0"
                  }}>
                    <span style={{ fontWeight: 600, color: "#455a64" }}>👥 Availability Threshold:</span>
                    <span style={{ color: "#263238" }}>{policy.availability_threshold} Technician</span>
                  </div>
                </div>

                {policy.imageUrl && (
                  <img 
                    src={policy.imageUrl} 
                    alt={policy.state_name} 
                    style={{
                      maxWidth: "200px",
                      maxHeight: "150px",
                      margin: "10px 0",
                      borderRadius: "8px",
                      objectFit: "cover"
                    }}
                  />
                )}

                <div style={{
                  display: "flex",
                  gap: "10px",
                  marginTop: "15px"
                }}>
                  <button
                    onClick={() => openStateEditModal(policy)}
                    style={{
                      flex: 1,
                      padding: "8px 15px",
                      background: "#f57c00",
                      color: "white",
                      border: "none",
                      borderRadius: "6px",
                      fontSize: "12px",
                      fontWeight: "500",
                      cursor: "pointer"
                    }}
                    onMouseOver={(e) => e.currentTarget.style.background = "#ef6c00"}
                    onMouseOut={(e) => e.currentTarget.style.background = "#f57c00"}
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => deletePolicy(policy._id)}
                    style={{
                      flex: 1,
                      padding: "8px 15px",
                      background: "#c62828",
                      color: "white",
                      border: "none",
                      borderRadius: "6px",
                      fontSize: "12px",
                      fontWeight: "500",
                      cursor: "pointer"
                    }}
                    onMouseOver={(e) => e.currentTarget.style.background = "#b71c1c"}
                    onMouseOut={(e) => e.currentTarget.style.background = "#c62828"}
                  >
                    🗑️ Delete
                  </button>
                </div>

                {/* Display Cities under this State */}
                {policy.cities && Array.isArray(policy.cities) && policy.cities.length > 0 && (
                  <div style={{
                    marginTop: "20px",
                    paddingTop: "15px",
                    borderTop: "1px solid #ccc"
                  }}>
                    <h4 style={{
                      fontSize: "14px",
                      fontWeight: 600,
                      color: "#666",
                      marginBottom: "10px"
                    }}>
                      📍 Cities in this State:

                    </h4>
                    <div style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "10px"
                    }}>
                      {policy.cities.map((city, idx) => (
                        <div key={idx} style={{
                          background: "#fff3e0",
                          padding: "12px",
                          borderRadius: "8px"
                        }}>
                          <div style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "flex-start"
                          }}>
                            <div>
                              <h5 style={{
                                fontWeight: 600,
                                color: "#333",
                                marginBottom: "4px"
                              }}>
                                {city.cityTitle || city.city_name}
                              </h5>
                              <p style={{
                                fontSize: "12px",
                                color: "#666"
                              }}>
                                📍 {city.city_name}
                              </p>
                            </div>
                            <div style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "10px"
                            }}>
                              <div
                                onClick={() => toggleCityVisibility(policy._id, city.city_name, city.is_active)}
                                style={{
                                  position: "relative",
                                  width: "40px",
                                  height: "20px",
                                  background: city.is_active ? "#4caf50" : "#b0bec5",
                                  borderRadius: "20px",
                                  cursor: "pointer"
                                }}
                              >
                                <div style={{
                                  position: "absolute",
                                  width: "16px",
                                  height: "16px",
                                  background: "white",
                                  borderRadius: "50%",
                                  top: "2px",
                                  left: city.is_active ? "22px" : "2px",
                                  transition: "0.3s"
                                }} />
                              </div>
                              <button
                                onClick={() => openCityEditModal(policy, city)}
                                style={{
                                  background: "none",
                                  border: "none",
                                  color: "#f57c00",
                                  fontSize: "14px",
                                  cursor: "pointer"
                                }}
                              >
                                ✏️
                              </button>
                              <button
                                onClick={() => deleteCity(policy._id, city.city_name)}
                                style={{
                                  background: "none",
                                  border: "none",
                                  color: "#c62828",
                                  fontSize: "14px",
                                  cursor: "pointer"
                                }}
                              >
                                🗑️
                              </button>
                            </div>
                          </div>
                          <div style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(2, 1fr)",
                            gap: "8px",
                            marginTop: "8px",
                            fontSize: "12px"
                          }}>
                            <div>🏘️ {city.area_type === 'all' ? 'All' : city.area_type === 'urban' ? 'Urban' : 'Rural'}</div>
                            <div>🆓 {city.free_radius_km}km</div>
                            <div>💰 ₹{city.per_km_rate}</div>
                            <div>👥 {city.availability_threshold}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <p style={{ color: "#666", gridColumn: "span 2" }}>No state policy available.
</p>
          )}
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.5)",
            zIndex: 1000,
            overflowY: "auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}>
            <div style={{
              background: "white",
              width: "90%",
              maxWidth: "600px",
              margin: "20px auto",
              padding: "30px",
              borderRadius: "15px",
              position: "relative"
            }}>
              <span
                onClick={closeModal}
                style={{
                  position: "absolute",
                  right: "20px",
                  top: "15px",
                  fontSize: "28px",
                  cursor: "pointer",
                  color: "#666"
                }}
              >
                &times;
              </span>

              <h2 style={{
                fontSize: "1.8em",
                color: "#333",
                marginBottom: "20px"
              }}>
                {editingPolicy ? 'Policy Edit' : 'Create New Policy '}
              </h2>

              <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                {/* Level Selection - Hide when editing */}
                {!editingPolicy && (
                  <div>
                    <label style={{
                      display: "block",
                      marginBottom: "5px",
                      fontWeight: 600,
                      color: "#333"
                    }}>
                      Policy Level 
                    </label>
                    <div style={{
                      display: "flex",
                      gap: "20px",
                      marginTop: "10px"
                    }}>
                      <label style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "5px"
                      }}>
                        <input
                          type="radio"
                          name="level"
                          checked={formData.level === 'state'}
                          onChange={() => handleLevelChange('state')}
                          style={{
                            width: "16px",
                            height: "16px"
                          }}
                        />
                        <span>🏙️ State </span>
                      </label>
                      <label style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "5px"
                      }}>
                        <input
                          type="radio"
                          name="level"
                          checked={formData.level === 'city'}
                          onChange={() => handleLevelChange('city')}
                          style={{
                            width: "16px",
                            height: "16px"
                          }}
                        />
                        <span>📍 City </span>
                      </label>
                    </div>
                  </div>
                )}

                {/* State Select */}
                <div style={{
                  display: (formData.level === 'state' || editingType === 'state' || editingType === 'city') ? "block" : "none"
                }}>
                  <label style={{
                    display: "block",
                    marginBottom: "5px",
                    fontWeight: 600,
                    color: "#333"
                  }}>
                   Choose State 
                  </label>
                  <select
                    name="stateName"
                    value={formData.stateName}
                    onChange={handleInputChange}
                    disabled={editingType === 'state' || editingType === 'city'}
                    style={{
                      width: "100%",
                      padding: "12px",
                      border: "2px solid #e0e0e0",
                      borderRadius: "8px",
                      fontSize: "14px",
                      background: (editingType === 'state' || editingType === 'city') ? "#f5f5f5" : "white",
                      cursor: (editingType === 'state' || editingType === 'city') ? "not-allowed" : "pointer"
                    }}
                  >
                  <option value="India">India</option>
                 <option value="">-- Select State --</option>
<option value="Andhra Pradesh">Andhra Pradesh</option>
<option value="Arunachal Pradesh">Arunachal Pradesh</option>
<option value="Assam">Assam</option>
<option value="Bihar">Bihar</option>
<option value="Chhattisgarh">Chhattisgarh</option>
<option value="Goa">Goa</option>
<option value="Gujarat">Gujarat</option>
<option value="Haryana">Haryana</option>
<option value="Himachal Pradesh">Himachal Pradesh</option>
<option value="Jharkhand">Jharkhand</option>
<option value="Karnataka">Karnataka</option>
<option value="Kerala">Kerala</option>
<option value="Madhya Pradesh">Madhya Pradesh</option>
<option value="Maharashtra">Maharashtra</option>
<option value="Manipur">Manipur</option>
<option value="Meghalaya">Meghalaya</option>
<option value="Mizoram">Mizoram</option>
<option value="Nagaland">Nagaland</option>
<option value="Odisha">Odisha</option>
<option value="Punjab">Punjab</option>
<option value="Rajasthan">Rajasthan</option>
<option value="Sikkim">Sikkim</option>
<option value="Tamil Nadu">Tamil Nadu</option>
<option value="Telangana">Telangana</option>
<option value="Tripura">Tripura</option>
<option value="Uttar Pradesh">Uttar Pradesh</option>
<option value="Uttarakhand">Uttarakhand</option>
<option value="West Bengal">West Bengal</option>

                  </select>
                </div>

                {/* City Select */}
                <div style={{
                  display: (formData.level === 'city' || editingType === 'city') ? "block" : "none"
                }}>
                  <label style={{
                    display: "block",
                    marginBottom: "5px",
                    fontWeight: 600,
                    color: "#333"
                  }}>
                    Choose City
                  </label>
                 <select
  name="cityName"
  value={formData.cityName}
  onChange={handleInputChange}
  disabled={!formData.stateName}
  style={{
    width: "100%",
    padding: "12px",
    border: "2px solid #e0e0e0",
    borderRadius: "8px",
    fontSize: "14px",
    background: "white",
    cursor: "pointer"
  }}
>
  <option value="">-- Select City --</option>

  {availableCities.map((city) => (
    <option key={city} value={city}>
      {city}
    </option>
  ))}
</select>


 

                </div>

                {/* State Title */}
                {(formData.level === 'state' || editingType === 'state') && (
                  <div>
                    <label style={{
                      display: "block",
                      marginBottom: "5px",
                      fontWeight: 600,
                      color: "#333"
                    }}>
                      Policy Title
                    </label>
                    <input
                      type="text"
                      name="stateTitle"
                      value={formData.stateTitle}
                      onChange={handleInputChange}
                      placeholder="Ex: UP Special Policies"
                      style={{
                        width: "100%",
                        padding: "12px",
                        border: "2px solid #e0e0e0",
                        borderRadius: "8px",
                        fontSize: "14px"
                      }}
                    />
                  </div>
                )}

                {/* State Description */}
                {(formData.level === 'state' || editingType === 'state') && (
                  <div>
                    <label style={{
                      display: "block",
                      marginBottom: "5px",
                      fontWeight: 600,
                      color: "#333"
                    }}>
                      Description
                    </label>
                    <textarea
                      name="stateDescription"
                      value={formData.stateDescription}
                      onChange={handleInputChange}
                      rows={3}
                      placeholder="Policy description."
                      style={{
                        width: "100%",
                        padding: "12px",
                        border: "2px solid #e0e0e0",
                        borderRadius: "8px",
                        fontSize: "14px",
                        resize: "vertical"
                      }}
                    />
                  </div>
                )}

                {/* City Title */}
                {(formData.level === 'city' || editingType === 'city') && (
                  <div>
                    <label style={{
                      display: "block",
                      marginBottom: "5px",
                      fontWeight: 600,
                      color: "#333"
                    }}>
                      Policy Title
                    </label>
                    <input
                      type="text"
                      name="cityTitle"
                      value={formData.cityTitle}
                      onChange={handleInputChange}
                      placeholder="Ex: Lucknow Special Policy."
                      style={{
                        width: "100%",
                        padding: "12px",
                        border: "2px solid #e0e0e0",
                        borderRadius: "8px",
                        fontSize: "14px"
                      }}
                    />
                  </div>
                )}

                {/* City Description */}
                {(formData.level === 'city' || editingType === 'city') && (
                  <div>
                    <label style={{
                      display: "block",
                      marginBottom: "5px",
                      fontWeight: 600,
                      color: "#333"
                    }}>
                      Description
                    </label>
                    <textarea
                      name="cityDescription"
                      value={formData.cityDescription}
                      onChange={handleInputChange}
                      rows={3}
                      placeholder="Policy details."
                      style={{
                        width: "100%",
                        padding: "12px",
                        border: "2px solid #e0e0e0",
                        borderRadius: "8px",
                        fontSize: "14px",
                        resize: "vertical"
                      }}
                    />
                  </div>
                )}

                {/* Area Type */}
                <div>
                  <label style={{
                    display: "block",
                    marginBottom: "5px",
                    fontWeight: 600,
                    color: "#333"
                  }}>
                    Area Type
                  </label>
                  <select
                    name="areaType"
                    value={formData.areaType}
                    onChange={handleInputChange}
                    style={{
                      width: "100%",
                      padding: "12px",
                      border: "2px solid #e0e0e0",
                      borderRadius: "8px",
                      fontSize: "14px"
                    }}
                  >
                    <option value="all">(All)</option>
                    <option value="urban"> (Urban)</option>
                    <option value="rural"> (Rural)</option>
                  </select>
                </div>

                {/* Free Radius */}
                <div>
                  <label style={{
                    display: "block",
                    marginBottom: "5px",
                    fontWeight: 600,
                    color: "#333"
                  }}>
                    Free Radius (km) - How many kilometers are free?
                  </label>
                  <input
                    type="number"
                    name="freeRadius"
                    value={formData.freeRadius}
                    onChange={handleInputChange}
                    placeholder="Ex: 5"
                    style={{
                      width: "100%",
                      padding: "12px",
                      border: "2px solid #e0e0e0",
                      borderRadius: "8px",
                      fontSize: "14px"
                    }}
                  />
                </div>

                {/* Per Km Rate */}
                <div>
                  <label style={{
                    display: "block",
                    marginBottom: "5px",
                    fontWeight: 600,
                    color: "#333"
                  }}>
                    Per Km Rate (₹) - Rate per kilometer.
                  </label>
                  <input
                    type="number"
                    name="perKmRate"
                    value={formData.perKmRate}
                    onChange={handleInputChange}
                    placeholder="Ex: 10"
                    style={{
                      width: "100%",
                      padding: "12px",
                      border: "2px solid #e0e0e0",
                      borderRadius: "8px",
                      fontSize: "14px"
                    }}
                  />
                </div>

                {/* Threshold */}
                <div>
                  <label style={{
                    display: "block",
                    marginBottom: "5px",
                    fontWeight: 600,
                    color: "#333"
                  }}>
                    Availability Threshold - How many technicians should be available to show the confirmed price?
                  </label>
                  <input
                    type="number"
                    name="threshold"
                    value={formData.threshold}
                    onChange={handleInputChange}
                    placeholder="like: 5"
                    style={{
                      width: "100%",
                      padding: "12px",
                      border: "2px solid #e0e0e0",
                      borderRadius: "8px",
                      fontSize: "14px"
                    }}
                  />
                  <small style={{ color: "#666" }}>
                    If that many technicians are available, the confirmed price will be shown; otherwise, the estimated price will be displayed.
                  </small>
                </div>

                {/* Image Upload */}
                <div>
                  <label style={{
                    display: "block",
                    marginBottom: "5px",
                    fontWeight: 600,
                    color: "#333"
                  }}>
                    Policy Image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    style={{
                      width: "100%",
                      padding: "12px",
                      border: "2px solid #e0e0e0",
                      borderRadius: "8px",
                      fontSize: "14px"
                    }}
                  />
                  {imagePreview && (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      style={{
                        maxWidth: "200px",
                        maxHeight: "150px",
                        marginTop: "10px",
                        borderRadius: "8px",
                        objectFit: "cover"
                      }}
                    />
                  )}
                </div>

                {/* Buttons */}
                <div style={{
                  display: "flex",
                  gap: "10px",
                  marginTop: "20px"
                }}>
                  <button
                    onClick={savePolicy}
                    style={{
                      flex: 1,
                      padding: "12px",
                      background: "#2e7d32",
                      color: "white",
                      border: "none",
                      borderRadius: "6px",
                      fontSize: "14px",
                      fontWeight: 500,
                      cursor: "pointer"
                    }}
                    onMouseOver={(e) => e.currentTarget.style.background = "#1b5e20"}
                    onMouseOut={(e) => e.currentTarget.style.background = "#2e7d32"}
                  >
                    ✅ Save
                  </button>
                  <button
                    onClick={closeModal}
                    style={{
                      flex: 1,
                      padding: "12px",
                      background: "#c62828",
                      color: "white",
                      border: "none",
                      borderRadius: "6px",
                      fontSize: "14px",
                      fontWeight: 500,
                      cursor: "pointer"
                    }}
                    onMouseOver={(e) => e.currentTarget.style.background = "#b71c1c"}
                    onMouseOut={(e) => e.currentTarget.style.background = "#c62828"}
                  >
                    ✖ Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}








