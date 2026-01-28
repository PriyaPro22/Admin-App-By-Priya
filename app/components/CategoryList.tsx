
// "use client";

// import React from "react";
// import { Trash2, Edit2, Image as ImageIcon } from "lucide-react";
// import { useCategory } from "../context/CategoryContext";

// interface CategoryListProps {
//   type: "main" | "sub" | "child" | "deep" | "subDeep";
//   filterId?: string | null;
//   onItemClick?: (item: any) => void;
//   onEditClick?: (item: any) => void;
//   onDeleteClick?: (item: any) => void;
//   onToggleVisibility?: (item: any) => void;
//   onToggleSubCat?: (item: any) => void;
//   parentNameOverride?: string | null;
// }

// const CategoryList: React.FC<CategoryListProps> = ({
//   type,
//   filterId,
//   onItemClick,
//   onEditClick,
//   onDeleteClick,
//   onToggleVisibility,
//   onToggleSubCat,
//   parentNameOverride,
// }) => {
//   const {
//     mainCategories,
//     subCategories,
//     childCategories,
//     deepChildCategories,
//     subDeepChildCategories,
//   } = useCategory();

//   const dataMap: any = {
//     main: mainCategories,
//     sub: subCategories,
//     child: childCategories,
//     deep: deepChildCategories,
//     subDeep: subDeepChildCategories,
//   };

//   const list = dataMap[type] || [];

//   if (!list.length) {
//     return (
//       <div className="rounded-xl bg-gray-100 py-10 text-center text-gray-500">
//         No categories found
//       </div>
//     );
//   }

//   // Helper for Toggle Switch
//   const Toggle = ({ checked, onChange, readOnly = false }: { checked: boolean; onChange?: () => void; readOnly?: boolean }) => (
//     <label className={`relative inline-flex items-center ${!readOnly ? 'cursor-pointer' : ''}`}>
//       <input
//         type="checkbox"
//         checked={checked}
//         onChange={!readOnly ? onChange : undefined}
//         disabled={readOnly}
//         className="peer sr-only"
//       />
//       <div className={`h-6 w-11 rounded-full bg-gray-300 after:absolute after:left-1 after:top-1 after:h-4 after:w-4 after:rounded-full after:bg-white after:transition-all after:duration-300 peer-checked:bg-red-500 peer-checked:after:translate-x-5 ${readOnly ? 'opacity-70' : ''}`} />
//     </label>
//   );

//   return (
//     <div className="space-y-6">
//       {/* Search Bar - Keeping consistent */}
//       <div className="relative">
//         <input
//           type="text"
//           placeholder="Search.."
//           className="w-full rounded-full bg-gray-100 px-6 py-3 text-gray-700 outline-none focus:ring-2 focus:ring-blue-500"
//         />
//       </div>

//       {list.map((item: any) => {
//         const isVisible = item.visible ?? item.deepCategoryVisible ?? false;
//         const hasSubCategory = item.hasSubCategory ?? false;
//         // Image URL handling
//         const imageUrl = item.image || item.imageUri;

//         // --- UNIFIED CATEGORY DESIGN (Main, Sub, Child) ---
//         return (
//           <div
//             key={item._id || item.documentId}
//             onClick={() => onItemClick?.(item)}
//             className="group relative flex w-full cursor-pointer overflow-hidden rounded-3xl bg-white p-5 shadow-sm border border-slate-100 transition-all hover:shadow-md"
//           >
//             {/* Red Accent Bar */}
//             {/* <div className="absolute left-4 top-2 bottom-2 w-2.5 rounded-full bg-red-500"></div> */}
// <div className="absolute left-0 top-3 bottom-3 w-3 rounded-r-2xl bg-red-500"></div>

//             {/* Content Container */}
//             <div className="ml-8 flex w-full gap-6">

//               {/* Left Column: Image & Actions */}
//               <div className="flex flex-col gap-4 w-32 shrink-0">
//                 <div className="flex items-center justify-between">
//                   <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">IMG</span>
//                   <Toggle checked={true} readOnly /> {/* Visual only as requested */}
//                 </div>

//                 {/* Image Box */}
//                 <div className="flex h-24 w-full items-center justify-center rounded-2xl bg-white p-2 border border-slate-100 shadow-sm">
//                   {imageUrl ? (
//                     <img src={imageUrl} alt={item.name} className="h-full w-full object-contain" />
//                   ) : (
//                     <ImageIcon className="text-gray-300 h-10 w-10" />
//                   )}
//                 </div>

//                 {/* Action Buttons */}
//                 <div className="flex flex-col gap-2 mt-auto">
//                   <button
//                     onClick={(e) => { e.stopPropagation(); onEditClick?.(item); }}
//                     className="flex items-center justify-center gap-2 rounded-xl bg-green-50 px-4 py-2 text-sm font-bold text-green-600 hover:bg-green-100 transition-colors"
//                   >
//                     <Edit2 size={16} /> Edit
//                   </button>
//                   <button
//                     onClick={(e) => { e.stopPropagation(); onDeleteClick?.(item); }}
//                     className="flex items-center justify-center gap-2 rounded-xl bg-red-50 px-4 py-2 text-sm font-bold text-red-500 hover:bg-red-100 transition-colors"
//                   >
//                     <Trash2 size={16} /> Del
//                   </button>
//                 </div>
//               </div>

//               {/* Right Column: Details */}
//               <div className="flex flex-1 flex-col justify-between py-1">

//                 {/* Header Row */}
//                 <div className="flex items-start justify-between">
//                   <div>
//                     <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1">CATEGORY NAME</p>
//                     <h3 className="text-2xl font-bold text-blue-950 leading-tight">{item.name}</h3>
//                   </div>
//                   <div onClick={(e) => e.stopPropagation()}>
//                     <Toggle checked={isVisible} onChange={() => onToggleVisibility?.(item)} />
//                   </div>
//                 </div>

//                 {/* Middle: Visibility Box */}
//                 <div className="mt-4 flex items-center justify-between rounded-xl bg-slate-50 p-4">
//                   <div>
//                     <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1">VISIBILITY</p>
//                     <p className="text-base font-bold text-blue-950">
//                       {type === 'main' ? "Main Cat" : type === 'sub' ? "Sub Cat" : "Child Cat"}
//                     </p>
//                   </div>
//                   <Toggle checked={isVisible} readOnly /> {/* Mirroring the visual from design */}
//                 </div>

//                 {/* Bottom: Info Grid */}
//                 <div className="mt-4 grid grid-cols-2 gap-4">
//                   {/* Parent Box */}
//                   <div className="rounded-xl bg-slate-50 p-4">
//                     <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1">PARENT</p>
//                     <p className="text-base font-bold text-blue-950 truncate">
//                       {parentNameOverride || item.parentName || item.mainCategoryName || "Root"}
//                     </p>
//                   </div>

//                   {/* SubCat Box */}
//                   <div className="flex flex-col md:flex-row md:items-center justify-between gap-1 rounded-xl bg-slate-50 p-4">
//                     <div>
//                       <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1">SUBCAT?</p>
//                       <p className="text-base font-bold text-blue-950">{hasSubCategory ? "True" : "False"}</p>
//                     </div>
//                     <div className="shrink-0 scale-90 origin-right">
//                       <Toggle
//                         checked={hasSubCategory}
//                         onChange={() => onToggleSubCat?.(item)}
//                       />
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         );
//       })}
//     </div>
//   );
// };

// export default CategoryList;
// "use client";

// import React from "react";
// import { Trash2, Edit2, Image as ImageIcon } from "lucide-react";
// import { useCategory } from "../context/CategoryContext";

// interface CategoryListProps {
//   type: "main" | "sub" | "child" | "deep" | "subDeep";
//   onItemClick?: (item: any) => void;
//   onDeleteClick?: (item: any) => void;
//   onEditClick?: (item: any) => void;
//   onToggleVisibility?: (item: any) => void;
// }

// const CategoryList: React.FC<CategoryListProps> = ({
//   type,
//   onItemClick,
//   onDeleteClick,
//   onEditClick,
//   onToggleVisibility,
// }) => {
//   const {
//     mainCategories,
//     subCategories,
//     childCategories,
//     deepChildCategories,
//     subDeepChildCategories,
//   } = useCategory();

//   const dataMap: any = {
//     main: mainCategories,
//     sub: subCategories,
//     child: childCategories,
//     deep: deepChildCategories,
//     subDeep: subDeepChildCategories,
//   };

//   const list = dataMap[type] || [];

//   if (!list.length) {
//     return (
//       <div className="rounded-xl bg-gray-100 py-10 text-center text-gray-500">
//         No categories found
//       </div>
//     );
//   }

//   /* 🔘 Toggle */
//   const Toggle = ({ checked, onChange }: { checked: boolean; onChange?: () => void }) => (
//     <label className="relative inline-flex cursor-pointer items-center">
//       <input type="checkbox" checked={checked} onChange={onChange} className="peer sr-only" />
//       <div className="h-6 w-11 rounded-full bg-gray-300 after:absolute after:left-1 after:top-1 after:h-4 after:w-4 after:rounded-full after:bg-white after:transition peer-checked:bg-red-500 peer-checked:after:translate-x-5" />
//     </label>
//   );
// // 🔑 PARENT NAME RESOLVER
// const getParentName = (item: any) => {
//   // MAIN → Root
//   if (type === "main") return "Root";

//   // SUB → Main Category
//   if (type === "sub") {
//     const parent = mainCategories.find(
//       (m: any) => m.documentId === item.mainCategoryId
//     );
//     return parent?.name || "—";
//   }

//   // CHILD → Sub OR Main
//   if (type === "child") {
//     if (item.subCategoryId) {
//       const sub = subCategories.find(
//         (s: any) => s.documentId === item.subCategoryId
//       );
//       return sub?.name || "—";
//     }

//     if (item.mainCategoryId) {
//       const main = mainCategories.find(
//         (m: any) => m.documentId === item.mainCategoryId
//       );
//       return main?.name || "—";
//     }
//   }

//   // DEEP → Child
//   if (type === "deep") {
//     const child = childCategories.find(
//       (c: any) => c.documentId === item.childCategoryId
//     );
//     return child?.name || "—";
//   }

//   return "—";
// };

//   return (
//     <div className="space-y-4">

//       {/* =====================================================
//           ✅ CHILD CATEGORY – SIMPLE ROW (ALREADY CORRECT)
//       ===================================================== */}
//       {type === "child" &&
//         list.map((item: any) => {
//           const isVisible = item.visible ?? item.Visibility ?? false;

//           return (
//             <div
//               key={item._id || item.documentId}
//               className="flex items-center justify-between rounded-2xl bg-gray-200 px-6 py-5 shadow-sm"
//             >
//               <h3 className="text-2xl font-bold text-gray-900">{item.name}</h3>

//               <div className="flex items-center gap-6">
//                 <div className="flex items-center gap-2">
//                   <span className="text-sm font-semibold text-gray-600">Visibility</span>
//                   <Toggle checked={isVisible} onChange={() => onToggleVisibility?.(item)} />
//                 </div>

//                 <button
//                   onClick={() => onDeleteClick?.(item)}
//                   className="text-red-600 hover:text-red-700"
//                 >
//                   <Trash2 size={22} />
//                 </button>
//               </div>
//             </div>
//           );
//         })}

//       {/* =====================================================
//           🟥 MAIN & SUB CATEGORY – FULL CARD (FINAL FIX)
//       ===================================================== */}
//       {(type === "main" || type === "sub") &&
//         list.map((item: any) => {
//           const isVisible = item.visible ?? false;
//           const hasSubCategory = item.hasSubCategory ?? false;
//           const imageUrl = item.image || item.imageUri;

//           return (
//             <div
//               key={item._id || item.documentId}
//               onClick={() => onItemClick?.(item)}
//               className="relative flex rounded-3xl bg-white p-5 shadow-md border cursor-pointer"
//             >
//               {/* 🔴 Red Strip */}
//               <div className="absolute left-0 top-3 bottom-3 w-3 rounded-r-2xl bg-red-500"></div>

//               <div className="ml-8 flex w-full gap-6">
//                 {/* LEFT */}
//                 <div className="flex w-32 flex-col gap-4">
//                   <div className="flex items-center justify-between">
//                     <span className="text-[10px] font-bold text-gray-400">IMG</span>
//                     <Toggle checked />
//                   </div>

//                   <div className="flex h-24 items-center justify-center rounded-2xl bg-white border">
//                     {imageUrl ? (
//                       <img src={imageUrl} alt={item.name} className="h-full w-full object-contain" />
//                     ) : (
//                       <ImageIcon className="h-10 w-10 text-gray-300" />
//                     )}
//                   </div>

//                   <button
//                     onClick={(e) => { e.stopPropagation(); onEditClick?.(item); }}
//                     className="rounded-xl bg-green-50 py-2 text-sm font-bold text-green-600"
//                   >
//                     <Edit2 size={16} className="inline mr-1" /> Edit
//                   </button>

//                   <button
//                     onClick={(e) => { e.stopPropagation(); onDeleteClick?.(item); }}
//                     className="rounded-xl bg-red-50 py-2 text-sm font-bold text-red-500"
//                   >
//                     <Trash2 size={16} className="inline mr-1" /> Del
//                   </button>
//                 </div>

//                 {/* RIGHT */}
//                 <div className="flex flex-1 flex-col justify-between">
//                   <div className="flex items-start justify-between">
//                     <div>
//                       <p className="text-[10px] font-bold text-gray-400">CATEGORY NAME</p>
//                       <h3 className="text-2xl font-bold text-blue-950 leading-tight">
//                         {item.name}
//                       </h3>
//                     </div>
//                     <Toggle checked={isVisible} onChange={() => onToggleVisibility?.(item)} />
//                   </div>

//                   <div className="mt-4 flex items-center justify-between rounded-xl bg-slate-50 p-4">
//                     <div>
//                       <p className="text-[10px] font-bold text-gray-400">VISIBILITY</p>
//                       <p className="font-bold text-blue-950">
//                         {type === "main" ? "Main Cat" : "Sub Cat"}
//                       </p>
//                     </div>
//                     <Toggle checked={isVisible} />
//                   </div>

//                   <div className="mt-4 grid grid-cols-2 gap-4">

//   {/* PARENT */}
//   <div className="rounded-xl bg-slate-50 p-4">
//     <p className="text-[10px] font-bold text-gray-400 mb-1">
//       PARENT
//     </p>

//     <p className="font-bold text-blue-950 truncate">
//       {getParentName(item)}
//     </p>
//   </div>

//   {/* SUBCAT */}
//   <div className="relative overflow-hidden rounded-xl bg-slate-50 p-4">
//     <p className="text-[10px] font-bold text-gray-400 mb-1">
//       SUBCAT?
//     </p>

//     <p className="mb-3 font-bold text-blue-950">
//       {hasSubCategory ? "Yes" : "No"}
//     </p>

//     <div className="flex justify-start">
//       <Toggle checked={hasSubCategory} />
//     </div>
//   </div>

// </div>

//                 </div>
//               </div>
//             </div>
//           );
//         })}
//     </div>
//   );
// };

// export default CategoryList;


// "use client";

// import React from "react";
// import { Trash2, Edit2, Image as ImageIcon } from "lucide-react";
// import { useCategory } from "../context/CategoryContext";

// interface CategoryListProps {
//   type: "main" | "sub" | "child" | "deep" | "subDeep";
//   onItemClick?: (item: any) => void;
//   onDeleteClick?: (item: any) => void;
//   onEditClick?: (item: any) => void;
//   onToggleVisibility?: (item: any) => void;
// }

// const CategoryList: React.FC<CategoryListProps> = ({
//   type,
//   onItemClick,
//   onDeleteClick,
//   onEditClick,
//   onToggleVisibility,
// }) => {
//   const {
//     mainCategories,
//     subCategories,
//     childCategories,
//     deepChildCategories,
//     subDeepChildCategories,
//   } = useCategory();

//   const dataMap: any = {
//     main: mainCategories,
//     sub: subCategories,
//     child: childCategories,
//     deep: deepChildCategories,
//     subDeep: subDeepChildCategories,
//   };

//   const list = dataMap[type] || [];

//   if (!list.length) {
//     return (
//       <div className="rounded-xl bg-gray-100 py-10 text-center text-gray-500">
//         No categories found
//       </div>
//     );
//   }

//   /* 🔘 Toggle */
//   const Toggle = ({ checked, onChange }: { checked: boolean; onChange?: () => void }) => (
//     <label className="relative inline-flex cursor-pointer items-center">
//       <input
//         type="checkbox"
//         checked={checked}
//         onChange={onChange}
//         className="peer sr-only"
//       />
//       <div className="h-6 w-11 rounded-full bg-gray-300 after:absolute after:left-1 after:top-1 after:h-4 after:w-4 after:rounded-full after:bg-white after:transition peer-checked:bg-red-500 peer-checked:after:translate-x-5" />
//     </label>
//   );

//   /* 🔑 PARENT NAME RESOLVER */
// // 🔑 SAFE ID RESOLVER (VERY IMPORTANT)
// const getId = (obj: any) =>
//   obj?.documentId || obj?._id || obj?.id || null;

// // 🔑 PARENT NAME RESOLVER
// const getParentName = (item: any) => {
//   // MAIN → Root
//   if (type === "main") return "Root";

//   // SUB → MAIN CATEGORY
//   if (type === "sub") {
//     const parentId = item.mainCategoryId || item.parentId;
//     const main = mainCategories.find(
//       (m: any) => getId(m) === parentId
//     );
//     return main?.name || "—";
//   }

//   // CHILD → SUB (preferred) OR MAIN
//   if (type === "child") {
//     const subId = item.subCategoryId;
//     if (subId) {
//       const sub = subCategories.find(
//         (s: any) => getId(s) === subId
//       );
//       if (sub) return sub.name;
//     }

//     const mainId = item.mainCategoryId;
//     const main = mainCategories.find(
//       (m: any) => getId(m) === mainId
//     );
//     return main?.name || "—";
//   }

//   // DEEP → CHILD
//   if (type === "deep") {
//     const childId = item.childCategoryId;
//     const child = childCategories.find(
//       (c: any) => getId(c) === childId
//     );
//     return child?.name || "—";
//   }

//   return "—";
// };



//   /* ===============================
//       CHILD CATEGORY – SIMPLE LIST
//   =============================== */
//   if (type === "child") {
//     return (
//       <div className="space-y-4">
//         {list.map((item: any) => {
//           const isVisible = item.visible ?? false;

//           return (
//             <div
//               key={item.documentId}
//               className="flex items-center justify-between rounded-2xl bg-gray-200 px-6 py-5 shadow-sm"
//             >
//               <h3 className="text-2xl font-bold text-gray-900">
//                 {item.name}
//               </h3>

//               <div className="flex items-center gap-6">
//                 <Toggle
//                   checked={isVisible}
//                   onChange={() => onToggleVisibility?.(item)}
//                 />
//                 <button
//                   onClick={() => onDeleteClick?.(item)}
//                   className="text-red-600"
//                 >
//                   <Trash2 size={22} />
//                 </button>
//               </div>
//             </div>
//           );
//         })}
//       </div>
//     );
//   }

//   /* ===============================
//       MAIN & SUB CATEGORY – CARD
//   =============================== */
//   return (
//     <div className="space-y-4">
//       {list.map((item: any) => {
//         const isVisible = item.visible ?? false;
//         const hasSubCategory = item.hasSubCategory ?? false;
//         const imageUrl = item.image || item.imageUri;

//         return (
//           <div
//             key={item.documentId}
//             onClick={() => onItemClick?.(item)}
//             className="relative flex rounded-3xl bg-white p-5 shadow-md border cursor-pointer"
//           >
//             {/* RED STRIP */}
//             <div className="absolute left-0 top-3 bottom-3 w-3 rounded-r-2xl bg-red-500" />

//             <div className="ml-8 flex w-full gap-6">
//               {/* LEFT */}
//               <div className="flex w-32 flex-col gap-4">
//                 <div className="flex items-center justify-between">
//                   <span className="text-[10px] font-bold text-gray-400">IMG</span>
//                   <Toggle checked />
//                 </div>

//                 <div className="flex h-24 items-center justify-center rounded-2xl bg-white border">
//                   {imageUrl ? (
//                     <img src={imageUrl} alt={item.name} className="h-full w-full object-contain" />
//                   ) : (
//                     <ImageIcon className="h-10 w-10 text-gray-300" />
//                   )}
//                 </div>

//                 <button
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     onEditClick?.(item);
//                   }}
//                   className="rounded-xl bg-green-50 py-2 text-sm font-bold text-green-600"
//                 >
//                   <Edit2 size={16} className="inline mr-1" /> Edit
//                 </button>

//                 <button
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     onDeleteClick?.(item);
//                   }}
//                   className="rounded-xl bg-red-50 py-2 text-sm font-bold text-red-500"
//                 >
//                   <Trash2 size={16} className="inline mr-1" /> Del
//                 </button>
//               </div>

//               {/* RIGHT */}
//               <div className="flex flex-1 flex-col justify-between">
//                 <div className="flex items-start justify-between">
//                   <div>
//                     <p className="text-[10px] font-bold text-gray-400">
//                       CATEGORY NAME
//                     </p>
//                     <h3 className="text-2xl font-bold text-blue-950">
//                       {item.name}
//                     </h3>
//                   </div>
//                   <Toggle
//                     checked={isVisible}
//                     onChange={() => onToggleVisibility?.(item)}
//                   />
//                 </div>

//                 <div className="mt-4 grid grid-cols-2 gap-4">
//                   <div className="rounded-xl bg-slate-50 p-4">
//   <p className="text-[10px] font-bold text-gray-400 mb-1">
//     PARENT
//   </p>
//   <p className="font-bold text-blue-950 truncate">
//     {getParentName(item)}
//   </p>
// </div>


//                   <div className="rounded-xl bg-slate-50 p-4">
//                     <p className="text-[10px] font-bold text-gray-400 mb-1">
//                       SUBCAT?
//                     </p>
//                     <p className="font-bold text-blue-950 mb-3">
//                       {hasSubCategory ? "Yes" : "No"}
//                     </p>
//                     <Toggle checked={hasSubCategory} />
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         );
//       })}
//     </div>
//   );
// };

// export default CategoryList;


// "use client";

// import React from "react";
// import { 
//   Trash2, 
//   Edit2, 
//   Image as ImageIcon, 
//   Folder, 
//   ChevronRight,
//   Eye,
//   EyeOff,
//   Home
// } from "lucide-react";
// import { useCategory } from "../context/CategoryContext";

// interface CategoryListProps {
//   type: "main" | "sub" | "child" | "deep" | "subDeep";
//   onItemClick?: (item: any) => void;
//   onDeleteClick?: (item: any) => void;
//   onEditClick?: (item: any) => void;
//   onToggleVisibility?: (item: any) => void;
// }

// const CategoryList: React.FC<CategoryListProps> = ({
//   type,
//   onItemClick,
//   onDeleteClick,
//   onEditClick,
//   onToggleVisibility,
// }) => {
//   const {
//     mainCategories,
//     subCategories,
//     childCategories,
//     deepChildCategories,
//     subDeepChildCategories,
//   } = useCategory();

//   const dataMap: any = {
//     main: mainCategories,
//     sub: subCategories,
//     child: childCategories,
//     deep: deepChildCategories,
//     subDeep: subDeepChildCategories,
//   };

//   const list = dataMap[type] || [];

//   if (!list.length) {
//     return (
//       <div className="rounded-2xl bg-gradient-to-br from-gray-50 to-white border-2 border-dashed border-gray-300 py-16 text-center">
//         <Folder className="h-16 w-16 text-gray-400 mx-auto mb-4" />
//         <h3 className="text-xl font-bold text-gray-700 mb-2">No categories found</h3>
//         <p className="text-gray-500">Add your first category to get started</p>
//       </div>
//     );
//   }

//   /* ===============================
//       MODERN TOGGLE COMPONENT
//   =============================== */
//   const Toggle = ({ checked, onChange }: { 
//     checked: boolean; 
//     onChange?: () => void;
//   }) => {
//     return (
//       <label className="relative inline-flex cursor-pointer items-center">
//         <input
//           type="checkbox"
//           checked={checked}
//           onChange={onChange}
//           className="peer sr-only"
//         />
//         <div className="h-6 w-11 rounded-full bg-gray-300 peer-checked:bg-blue-600 transition-colors duration-300 after:absolute after:left-1 after:top-1 after:h-4 after:w-4 after:rounded-full after:bg-white after:shadow-md after:transition-all after:duration-300 peer-checked:after:translate-x-5" />
//       </label>
//     );
//   };

//   /* ===============================
//       CHILD CATEGORY – SIMPLE LIST
//   =============================== */
//   if (type === "child") {
//     return (
//       <div className="space-y-3">
//         {list.map((item: any) => {
//           const isVisible = item.visible ?? false;

//           return (
//             <div
//               key={item.documentId || item._id}
//               className="flex items-center justify-between rounded-xl bg-white p-4 shadow-sm border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-300"
//             >
//               <div className="flex items-center gap-4">
//                 <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center border border-blue-200">
//                   <Folder className="h-5 w-5 text-blue-600" />
//                 </div>
//                 <div>
//                   <h3 className="text-lg font-bold text-gray-900">
//                     {item.name}
//                   </h3>
//                   {item.description && (
//                     <p className="text-sm text-gray-600 mt-1 max-w-md truncate">
//                       {item.description}
//                     </p>
//                   )}
//                 </div>
//               </div>

//               <div className="flex items-center gap-4">
//                 <div className="flex flex-col items-end gap-1">
//                   <span className={`text-xs font-semibold px-2 py-1 rounded-full ${isVisible ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
//                     {isVisible ? "VISIBLE" : "HIDDEN"}
//                   </span>
//                   <span className="text-xs text-gray-500 font-mono">
//                     {item.documentId?.slice(0, 8) || "N/A"}
//                   </span>
//                 </div>

//                 <Toggle
//                   checked={isVisible}
//                   onChange={() => onToggleVisibility?.(item)}
//                 />

//                 <button
//                   onClick={() => onDeleteClick?.(item)}
//                   className="h-10 w-10 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 flex items-center justify-center transition-colors duration-200"
//                   title="Delete"
//                 >
//                   <Trash2 size={18} />
//                 </button>
//               </div>
//             </div>
//           );
//         })}
//       </div>
//     );
//   }

//   /* ===============================
//       SUB CATEGORY CARD DESIGN
//   =============================== */
//   if (type === "sub") {
//     return (
//       <div className="space-y-6">
//         {list.map((item: any) => {
//           const isVisible = item.visible ?? false;
//           const hasSubCategory = item.hasSubCategory ?? false;
//           const imageUrl = item.image || item.imageUri;

//           return (
//             <div
//               key={item.documentId}
//               className="relative rounded-2xl bg-white p-6 shadow-md border border-gray-200 hover:border-blue-400 hover:shadow-lg transition-all duration-300 group"
//             >
//               {/* Blue Accent Line - Left Side */}
//               <div className="absolute left-0 top-0 bottom-0 w-1.5 rounded-r-lg bg-gradient-to-b from-blue-500 to-blue-600" />

//               <div className="ml-6 flex gap-8">
//                 {/* IMAGE SECTION - LARGER SIZE */}
//                 <div className="flex-shrink-0">
//                   <div className="mb-4">
//                     <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
//                       Image
//                     </span>
//                   </div>
//                   <div className="h-40 w-40 rounded-xl bg-gradient-to-br from-gray-100 to-white border-2 border-gray-300 overflow-hidden flex items-center justify-center">
//                     {imageUrl ? (
//                       <img 
//                         src={imageUrl} 
//                         alt={item.name} 
//                         className="h-full w-full object-cover"
//                       />
//                     ) : (
//                       <div className="flex flex-col items-center justify-center text-gray-400 p-4">
//                         <ImageIcon className="h-12 w-12 mb-2" />
//                         <span className="text-xs">No Image</span>
//                       </div>
//                     )}
//                   </div>
//                 </div>

//                 {/* CONTENT SECTION */}
//                 <div className="flex-1">
//                   {/* HEADER ROW */}
//                   <div className="flex items-start justify-between mb-6">
//                     <div>
//                       <div className="flex items-center gap-3 mb-2">
//                         <span className="text-xs font-bold text-blue-600 uppercase tracking-wider bg-blue-50 px-3 py-1 rounded-full">
//                           Sub Category
//                         </span>
//                         {item.mainCategoryName && (
//                           <span className="text-xs font-medium text-gray-600 bg-gray-100 px-3 py-1 rounded-full flex items-center gap-1">
//                             <ChevronRight size={12} />
//                             Parent: {item.mainCategoryName}
//                           </span>
//                         )}
//                       </div>
//                       <h3 className="text-2xl font-bold text-gray-900 mb-2">
//                         {item.name}
//                       </h3>
//                       <div className="flex items-center gap-4">
//                         <span className="text-xs font-mono text-gray-500 bg-gray-100 px-2 py-1 rounded">
//                           ID: {item.documentId?.slice(0, 12) || "N/A"}
//                         </span>
//                         <span className={`text-xs font-semibold px-3 py-1 rounded-full ${isVisible ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
//                           {isVisible ? "PUBLIC" : "PRIVATE"}
//                         </span>
//                       </div>
//                     </div>

//                     {/* VISIBILITY TOGGLE - MOVE TO TOP RIGHT */}
//                     <div className="flex flex-col items-end gap-2">
//                       <Toggle
//                         checked={isVisible}
//                         onChange={() => onToggleVisibility?.(item)}
//                       />
//                       <span className="text-xs text-gray-500">
//                         {isVisible ? "Visible" : "Hidden"}
//                       </span>
//                     </div>
//                   </div>

//                   {/* SUB-CATEGORY AND VISIBILITY STATUS IN ONE ROW */}
//                   <div className="grid grid-cols-2 gap-6 mb-8">
//                     {/* SUBCATEGORY STATUS */}
//                     <div className="rounded-xl bg-gradient-to-br from-blue-50 to-white p-5 border border-blue-100">
//                       <div className="flex items-center justify-between mb-3">
//                         <div>
//                           <p className="text-sm font-bold text-blue-800 mb-1">Has Subcategories</p>
//                           <p className="text-xs text-blue-600">Manage child categories</p>
//                         </div>
//                         <Toggle checked={hasSubCategory} />
//                       </div>
//                       <p className={`text-sm font-medium ${hasSubCategory ? 'text-blue-700' : 'text-gray-600'}`}>
//                         {hasSubCategory ? "Contains subcategories" : "No subcategories"}
//                       </p>
//                     </div>

//                     {/* VISIBILITY STATUS */}
//                     <div className="rounded-xl bg-gradient-to-br from-gray-50 to-white p-5 border border-gray-200">
//                       <div className="flex items-center justify-between mb-3">
//                         <div>
//                           <p className="text-sm font-bold text-gray-800 mb-1">Visibility</p>
//                           <p className="text-xs text-gray-600">User access settings</p>
//                         </div>
//                         {isVisible ? (
//                           <Eye className="h-5 w-5 text-green-500" />
//                         ) : (
//                           <EyeOff className="h-5 w-5 text-red-500" />
//                         )}
//                       </div>
//                       <p className={`text-sm font-medium ${isVisible ? 'text-green-700' : 'text-red-700'}`}>
//                         {isVisible ? "Publicly visible" : "Hidden from users"}
//                       </p>
//                     </div>
//                   </div>

//                   {/* ACTION BUTTONS - SPLIT LEFT AND RIGHT */}
//                   <div className="flex gap-4">
//                     <button
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         onEditClick?.(item);
//                       }}
//                       className="flex-1 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-3 px-6 flex items-center justify-center gap-2 transition-all duration-200 shadow-md hover:shadow-lg"
//                     >
//                       <Edit2 size={18} /> Edit Sub Category
//                     </button>

//                     <button
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         onDeleteClick?.(item);
//                       }}
//                       className="flex-1 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold py-3 px-6 flex items-center justify-center gap-2 transition-all duration-200 shadow-md hover:shadow-lg"
//                     >
//                       <Trash2 size={18} /> Delete Category
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           );
//         })}
//       </div>
//     );
//   }

//   /* ===============================
//       MAIN CATEGORY CARD DESIGN - COMPLETELY FIXED
//   =============================== */
//   if (type === "main") {
//     return (
//       <div className="space-y-8">
//         {list.map((item: any) => {
//           const isVisible = item.visible ?? false;
//           const hasSubCategory = item.hasSubCategory ?? false;
//           const imageUrl = item.image || item.imageUri;

//           return (
//             <div
//               key={item._id}
//               className="relative rounded-3xl bg-white p-8 shadow-xl border-2 border-gray-300 hover:border-blue-500 hover:shadow-2xl transition-all duration-300"
//             >
//               {/* MAIN LAYOUT - IMAGE LEFT, CONTENT RIGHT */}
//               <div className="flex gap-10">
//                 {/* LEFT SECTION - LARGE IMAGE CONTAINER */}
//                 <div className="flex-shrink-0 w-2/5">
//                   <div className="mb-6">
//                     <span className="text-lg font-bold text-gray-800 uppercase tracking-wider">
//                       MAIN CATEGORY
//                     </span>
//                   </div>

//                   {/* LARGE IMAGE CONTAINER */}
//                   <div className="h-64 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-50 border-3 border-gray-400 overflow-hidden shadow-inner">
//                     {imageUrl ? (
//                       <img 
//                         src={imageUrl} 
//                         alt={item.name} 
//                         className="h-full w-full object-cover hover:scale-105 transition-transform duration-500"
//                       />
//                     ) : (
//                       <div className="h-full w-full flex flex-col items-center justify-center text-gray-500 p-8">
//                         <ImageIcon className="h-20 w-20 mb-4 opacity-50" />
//                         <span className="text-lg font-medium">No Image</span>
//                         <span className="text-sm text-gray-400 mt-2">100x120 dp recommended</span>
//                       </div>
//                     )}
//                   </div>
//                 </div>

//                 {/* RIGHT SECTION - CONTENT */}
//                 <div className="flex-1">
//                   {/* HEADER WITH CATEGORY INFO */}
//                   <div className="mb-8">
//                     <div className="flex items-center gap-4 mb-4">
//                       <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center border-2 border-blue-300">
//                         <Home className="h-7 w-7 text-blue-600" />
//                       </div>
//                       <div>
//                         <h2 className="text-3xl font-bold text-gray-900">
//                           {item.name}
//                         </h2>
//                         <div className="flex items-center gap-4 mt-2">
//                           <span className="text-sm font-mono text-gray-600 bg-gray-100 px-3 py-1.5 rounded-lg">
//                             ID: {item._id?.slice(0, 16) || "N/A"}
//                           </span>
//                           <span className={`text-sm font-bold px-4 py-1.5 rounded-full ${isVisible ? 'bg-green-100 text-green-800 border border-green-300' : 'bg-red-100 text-red-800 border border-red-300'}`}>
//                             {isVisible ? "PUBLIC" : "PRIVATE"}
//                           </span>
//                         </div>
//                       </div>
//                     </div>

//                     {/* PARENT CATEGORY INFO */}
//                     {item.parentCategory && (
//                       <div className="flex items-center gap-2 mb-4">
//                         <span className="text-sm font-bold text-gray-600">Parent:</span>
//                         <span className="text-sm font-semibold text-blue-700 bg-blue-50 px-3 py-1 rounded-lg">
//                           {item.parentCategory}
//                         </span>
//                       </div>
//                     )}
//                   </div>

//                   {/* SUB-CATEGORY AND VISIBILITY STATUS - SIMPLE HORIZONTAL LAYOUT */}
//                   <div className="mb-10">
//                     <div className="flex items-center justify-between mb-6">
//                       {/* SUB-CATEGORY STATUS */}
//                       <div className="flex items-center gap-4">
//                         <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
//                           <Folder className="h-6 w-6 text-blue-600" />
//                         </div>
//                         <div>
//                           <p className="text-sm font-bold text-gray-700 mb-1">Has Subcategories</p>
//                           <p className={`text-lg font-bold ${hasSubCategory ? 'text-blue-700' : 'text-gray-600'}`}>
//                             {hasSubCategory ? "YES" : "NO"}
//                           </p>
//                         </div>
//                         <Toggle checked={hasSubCategory} />
//                       </div>

//                       {/* VISIBILITY STATUS */}
//                       <div className="flex items-center gap-4">
//                         <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
//                           {isVisible ? (
//                             <Eye className="h-6 w-6 text-green-600" />
//                           ) : (
//                             <EyeOff className="h-6 w-6 text-red-600" />
//                           )}
//                         </div>
//                         <div>
//                           <p className="text-sm font-bold text-gray-700 mb-1">Visibility</p>
//                           <p className={`text-lg font-bold ${isVisible ? 'text-green-700' : 'text-red-700'}`}>
//                             {isVisible ? "PUBLIC" : "PRIVATE"}
//                           </p>
//                         </div>
//                         <Toggle 
//                           checked={isVisible}
//                           onChange={() => onToggleVisibility?.(item)}
//                         />
//                       </div>
//                     </div>
//                   </div>

//                   {/* ACTION BUTTONS - SPLIT LEFT AND RIGHT */}
//                   <div className="flex gap-6">
//                     <button
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         onEditClick?.(item);
//                       }}
//                       className="flex-1 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-4 px-8 flex items-center justify-center gap-3 transition-all duration-200 shadow-lg hover:shadow-xl text-lg"
//                     >
//                       <Edit2 size={20} /> Edit Main Category
//                     </button>

//                     <button
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         onDeleteClick?.(item);
//                       }}
//                       className="flex-1 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold py-4 px-8 flex items-center justify-center gap-3 transition-all duration-200 shadow-lg hover:shadow-xl text-lg"
//                     >
//                       <Trash2 size={20} /> Delete Category
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           );
//         })}
//       </div>
//     );
//   }

//   /* ===============================
//       DEFAULT FOR OTHER TYPES
//   =============================== */
//   return (
//     <div className="space-y-4">
//       {list.map((item: any) => {
//         const isVisible = item.visible ?? false;

//         return (
//           <div
//             key={item.documentId || item._id}
//             className="rounded-xl bg-white p-4 shadow-sm border border-gray-200"
//           >
//             <div className="flex items-center justify-between">
//               <div className="flex items-center gap-4">
//                 <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-gray-100 to-gray-50 flex items-center justify-center border border-gray-300">
//                   <Folder className="h-5 w-5 text-gray-600" />
//                 </div>
//                 <div>
//                   <h3 className="font-bold text-gray-900">
//                     {item.name}
//                   </h3>
//                   <p className="text-sm text-gray-600">
//                     {item.documentId || item._id}
//                   </p>
//                 </div>
//               </div>

//               <div className="flex items-center gap-4">
//                 <Toggle
//                   checked={isVisible}
//                   onChange={() => onToggleVisibility?.(item)}
//                 />
//                 <button
//                   onClick={() => onDeleteClick?.(item)}
//                   className="text-red-600 hover:text-red-800"
//                 >
//                   <Trash2 size={18} />
//                 </button>
//               </div>
//             </div>
//           </div>
//         );
//       })}
//     </div>
//   );
// };

// export default CategoryList;


"use client";

import React from "react";
import {
  Trash2,
  Edit2,
  Image as ImageIcon,
  Folder,
  ChevronRight,
  Eye,
  EyeOff
} from "lucide-react";
import { useCategory } from "../context/CategoryContext";

interface CategoryListProps {
  type: "main" | "sub" | "child" | "deep" | "subDeep";
  onItemClick?: (item: any) => void;
  onDeleteClick?: (item: any) => void;
  onEditClick?: (item: any) => void;
  onToggleVisibility?: (item: any, type?: string) => void;
  // Added optional props to satisfy stricter usage in parents
  filterId?: string | null;
  onToggleSubCat?: (item: any) => void;
  parentNameOverride?: string | null;
}

const CategoryList: React.FC<CategoryListProps> = ({
  type,
  onItemClick,
  onDeleteClick,
  onEditClick,
  onToggleVisibility,
  onToggleSubCat,
  parentNameOverride,
}) => {
  const {
    mainCategories,
    subCategories,
    childCategories,
    deepChildCategories,
    subDeepChildCategories,
  } = useCategory();

  const dataMap: any = {
    main: mainCategories,
    sub: subCategories,
    child: childCategories,
    deep: deepChildCategories,
    subDeep: subDeepChildCategories,
  };
  // ye new h 
  const handleOpenSubCategory = (item: any) => {
    onItemClick?.(item); // ya jo bhi tumhara function hai
  };

  const handleToggleMainVisibility = (item: any) => {
    onToggleVisibility?.(item, "visible");
  };

  const handleToggleImageVisibility = (item: any) => {
    onToggleVisibility?.(item, "imageVisible");
  };

  const handleToggleHasSub = (item: any) => {
    onToggleVisibility?.(item, "hasSubCategory");
  };








  const list = dataMap[type] || [];

  if (!list.length) {
    return (
      <div className="rounded-2xl bg-gradient-to-br from-gray-50 to-white border-2 border-dashed border-gray-300 py-16 text-center">
        <Folder className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-gray-700 mb-2">No categories found</h3>
        <p className="text-gray-500">Add your first category to get started</p>
      </div>
    );
  }

  /* ===============================
  MODERN TOGGLE COMPONENT (SMALLER)
  =============================== */
  const Toggle = ({ checked, onChange }: {
    checked: boolean;
    onChange?: () => void;
  }) => {
    return (
      <label className="relative inline-flex cursor-pointer items-center">
        <input type="checkbox" checked={checked} onChange={onChange} className="peer sr-only" />
        <span className="h-4 w-7 rounded-full bg-gray-300 peer-checked:bg-blue-600 transition-colors duration-300 after:absolute after:left-0.5 after:top-0.5 after:h-3 after:w-3 after:rounded-full after:bg-white after:shadow-md after:transition-all after:duration-300 peer-checked:after:translate-x-3" />
      </label>
    );
  };

  /* ===============================
  CHILD CATEGORY – SIMPLE LIST
  =============================== */
  if (type === "child") {
    return (
      <div className="space-y-3">
        {list.map((item: any, index: number) => {
          const isVisible = item?.visible ?? item?.visibility ?? false; // ✅ Added support for 'visibility'
          // Ensure backticks are used for template literal
          const id = item?.documentId || item?._id || `child-${index}`;

          return (
            <div
              key={id}
              onClick={() => onItemClick?.(item)}
              className="flex items-center justify-between rounded-xl bg-white p-4 shadow-sm border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-300 cursor-pointer"
            >
              {/* LEFT */}
              <div className="flex items-center gap-4">
                {/* Icon removed as per request */}

                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    {item?.name || "Unnamed Child Category"}
                  </h3>

                  {item?.description && (
                    <p className="text-sm text-gray-600 mt-1 max-w-md truncate">
                      {item.description}
                    </p>
                  )}
                </div>
              </div>

              {/* RIGHT */}
              <div className="flex items-center gap-4">
                <div className="flex flex-col items-end gap-1">
                  {/* Badge removed as per request */}

                  {/* ID removed as per request */}
                </div>

                {/* TOGGLE */}
                <div onClick={(e) => e.stopPropagation()}>
                  <Toggle
                    checked={isVisible}
                    onChange={() => onToggleVisibility?.(item)}
                  />
                </div>

                {/* DELETE */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteClick?.(item);
                  }}
                  className="h-10 w-10 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 flex items-center justify-center transition-colors duration-200"
                  title="Delete"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    );
  }


  /* ===============================
  SUB CATEGORY CARD DESIGN
  =============================== */
  if (type === "sub") {
    return (
      <div className="space-y-3">
        {list.map((item: any) => {
          const visible = item?.isSubCategoryVisible ?? item?.visible ?? false;
          const imageVisible = item?.isSubCategoryImageVisible ?? item?.imageVisible ?? false;
          const hasSubCategory = item?.hasSubCategory ?? false;
          const imageUrl = item?.image || item?.imageUri;
          const parentName = item.parentId;

          return (
            <div
              key={item?.documentId ?? item?.id}
              onClick={() => onItemClick?.(item)}
              className="relative flex gap-2 rounded-xl bg-white p-2 shadow-sm border border-gray-200 overflow-hidden cursor-pointer hover:shadow-md transition-all"
            >
              {/* 🔵 LEFT CURVED STRIP */}
              <div className="absolute left-0 top-0 h-full w-1 bg-blue-500 rounded-r-xl" />

              {/* IMAGE SECTION */}
              <div className="w-14 flex-shrink-0 ml-1">
                {/* IMG + IMAGE VISIBILITY */}
                <div className="flex items-center justify-between gap-1 mb-1 px-0.5">
                  <span className="text-[9px] font-bold text-gray-600">
                    IMG
                  </span>
                  <div onClick={(e) => e.stopPropagation()}>
                    <Toggle
                      checked={imageVisible}
                      onChange={() =>
                        onToggleVisibility?.(item, "imageVisible")
                      }
                    />
                  </div>
                </div>

                {/* IMAGE */}
                <div className="h-14 w-14 rounded-xl border bg-gray-100 overflow-hidden flex items-center justify-center">
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={item?.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <ImageIcon className="h-6 w-6 text-gray-400" />
                  )}
                </div>

                {/* EDIT BUTTON */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEditClick?.(item);
                  }}
                  className="mt-2 w-full h-6 rounded-md bg-green-50 text-green-700 text-[10px] font-semibold hover:bg-green-100 flex items-center justify-center"
                >
                  Edit
                </button>
              </div>

              {/* CONTENT SECTION */}
              <div className="flex-1 ml-2 flex flex-col justify-between">
                <div>
                  {/* NAME + VISIBILITY */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex flex-col">
                      <h2 className="text-sm font-bold text-gray-900 leading-tight whitespace-nowrap">
                        {item?.name}
                      </h2>
                      {(item?.parentName || item?.parentId) && (
                        <p className="text-[10px] font-normal text-gray-400 leading-tight">
                          {item.parentName || item.parentId}
                        </p>
                      )}
                    </div>

                    <div onClick={(e) => e.stopPropagation()}>
                      <Toggle
                        checked={visible}
                        onChange={() =>
                          onToggleVisibility?.(item, "visible")
                        }
                      />
                    </div>
                  </div>

                  {/* HAS SUB */}
                  <div className="mt-2 text-[10px] w-full">
                    <div className="rounded-md bg-gray-50 px-2 py-1.5 flex items-center justify-between">
                      <span className="text-[9px] font-semibold text-gray-600">
                        HAS SUB
                      </span>
                      <div onClick={(e) => e.stopPropagation()}>
                        <Toggle
                          checked={hasSubCategory}
                          onChange={() =>
                            onToggleVisibility?.(item, "hasSubCategory")
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* DELETE */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteClick?.(item);
                  }}
                  className="mt-1 w-full h-6 rounded-md bg-red-50 text-red-700 text-[10px] font-semibold hover:bg-red-100 flex items-center justify-center"
                >
                  Delete
                </button>
              </div>
            </div>
          );
        })
        }
      </div>
    );
  }

  // Main Category
  // if (type === "main") {
  //   return (
  //     <div className="space-y-3">
  //       {list.map((item: any) => {
  //         const mainVisible = item?.isMainCategoryVisible ?? item?.visible ?? false;
  //         // IMPORTANT: Check isMainCategoryImageVisible first
  //         const imageVisible = item?.isMainCategoryImageVisible ?? item?.imageVisible ?? false;
  //         const hasSubCategory = item?.hasSubCategory ?? false;
  //         const imageUrl = item?.image || item?.imageUri;

  //         const parentName = item.parentId;

  //         return (
  //           <div
  //             key={item?._id ?? item?.id}
  //             onClick={() => onItemClick?.(item)}
  //             className="relative flex gap-3 rounded-xl bg-white p-2 shadow-sm border border-gray-200 overflow-hidden cursor-pointer hover:shadow-md transition-all"
  //           >
  //             {/* 🔴 LEFT STRIP */}
  //             <div className="absolute left-0 top-0 h-full w-1 bg-red-500 rounded-r-xl" />

  //             {/* IMAGE + EDIT */}
  //             <div className="flex-shrink-0 flex flex-col ml-1 w-14">
  //               <div>
  //                 {/* IMG + IMAGE VISIBILITY */}
  //                 <div className="flex items-center justify-between mb-1 gap-1 px-0.5">
  //                   <span className="text-[9px] font-bold text-gray-600">IMG</span>
  //                   <div onClick={(e) => e.stopPropagation()}>
  //                     <Toggle
  //                       checked={imageVisible}
  //                       onChange={() =>
  //                         onToggleVisibility?.(item, "imageVisible")
  //                       }
  //                     />
  //                   </div>
  //                 </div>

  //                 {/* IMAGE */}
  //                 <div className="h-24 w-14 rounded-xl border bg-gray-100 overflow-hidden flex items-center justify-center">
  //                   {imageUrl ? (
  //                     <img
  //                       src={imageUrl}
  //                       alt={item?.name}
  //                       className="h-full w-full object-cover"
  //                     />
  //                   ) : (
  //                     <ImageIcon className="h-6 w-6 text-gray-400" />
  //                   )}
  //                 </div>
  //               </div>

  //               {/* EDIT BUTTON */}
  //               <button
  //                 onClick={(e) => {
  //                   e.stopPropagation();
  //                   onEditClick?.(item);
  //                 }}
  //                 className="mt-2 w-full h-6 rounded-md bg-green-50 text-green-700 text-[10px] font-semibold hover:bg-green-100 flex items-center justify-center"
  //               >
  //                 Edit
  //               </button>
  //             </div>

  //             {/* CONTENT */}
  //             <div className="flex-1 flex flex-col justify-between ml-1">
  //               <div>
  //                 {/* NAME + MAIN VISIBILITY */}
  //                 <div className="flex items-center justify-between">
  //                   <h2 className="text-sm font-bold text-gray-900 leading-tight">
  //                     {item?.name}
  //                   </h2>
  //                   <div onClick={(e) => e.stopPropagation()}>
  //                     <Toggle
  //                       checked={mainVisible}
  //                       onChange={() =>
  //                         onToggleVisibility?.(item, "visible")
  //                       }
  //                     />
  //                   </div>
  //                 </div>

  //                 {/* PARENT NAME */}
  //                 {parentName && (
  //                   <p className="mt-0.5 text-[10px] text-gray-500">
  //                     {parentName}
  //                   </p>
  //                 )}

  //                 {/* HAS SUB */}
  //                 <div className="mt-2 w-full">
  //                   <div className="rounded-md bg-gray-50 px-2 py-1.5 flex items-center justify-between">
  //                     <span className="text-[9px] font-semibold text-gray-600">
  //                       HAS SUB
  //                     </span>
  //                     <div onClick={(e) => e.stopPropagation()}>
  //                       <Toggle
  //                         checked={hasSubCategory}
  //                         onChange={() =>
  //                           onToggleVisibility?.(item, "hasSubCategory")
  //                         }
  //                       />
  //                     </div>
  //                   </div>
  //                 </div>

  //                 {/* MAIN CAT */}
  //                 <div className="mt-1 w-full">
  //                   <div className="rounded-md bg-gray-50 px-2 py-1.5 flex items-center justify-between">
  //                     <span className="text-[9px] font-semibold text-gray-600">
  //                       MAIN CAT
  //                     </span>
  //                     <div onClick={(e) => e.stopPropagation()}>
  //                       <Toggle
  //                         checked={mainVisible}
  //                         onChange={() =>
  //                           onToggleVisibility?.(item, "visible")
  //                         }
  //                       />
  //                     </div>
  //                   </div>
  //                 </div>
  //               </div>

  //               {/* DELETE */}
  //               <button
  //                 onClick={(e) => {
  //                   e.stopPropagation();
  //                   onDeleteClick?.(item);
  //                 }}
  //                 className="mt-2 w-full h-6 rounded-md bg-red-50 text-red-700 text-[10px] font-semibold hover:bg-red-100 flex items-center justify-center"
  //               >
  //                 Delete
  //               </button>
  //             </div>
  //           </div>
  //         );
  //       })}
  //     </div>
  //   );
  // }
  if (type === "main") {
    return (
      <div className="space-y-3">
        {list.map((item: any) => {
          const mainVisible =
            item?.isMainCategoryVisible ?? item?.visible ?? false;

          const imageVisible =
            item?.isMainCategoryImageVisible ??
            item?.imageVisible ??
            false;

          const hasSubCategory = item?.hasSubCategory ?? false;

          const imageUrl = item?.image || item?.imageUri;

          const parentName = item?.parentId;

          return (
            <div
              key={item?._id ?? item?.id}
              onClick={() => onItemClick?.(item)}
              className="relative rounded-xl bg-white p-2 shadow-sm border border-gray-200 overflow-hidden cursor-pointer hover:shadow-md transition-all"
            >
              {/* 🔴 LEFT STRIP */}
              <div className="absolute left-0 top-0 h-full w-1 bg-red-500 rounded-r-xl" />

              {/* ================= TOP SECTION ================= */}
              <div className="flex gap-3">
                {/* ===== IMAGE SECTION ===== */}
                <div className="flex-shrink-0 flex flex-col ml-1 w-14">
                  {/* IMG TOGGLE */}
                  <div className="flex items-center justify-between mb-1 gap-1 px-0.5">
                    <span className="text-[9px] font-bold text-gray-600">
                      IMG
                    </span>
                    <div onClick={(e) => e.stopPropagation()}>
                      <Toggle
                        checked={imageVisible}
                        onChange={() =>
                          onToggleVisibility?.(item, "imageVisible")
                        }
                      />
                    </div>
                  </div>

                  {/* IMAGE */}
                  <div className="h-16 w-14 rounded-xl border bg-gray-100 overflow-hidden flex items-center justify-center">
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={item?.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <ImageIcon className="h-6 w-6 text-gray-400" />
                    )}
                  </div>
                </div>

                {/* ===== CONTENT SECTION ===== */}
                <div className="flex-1">
                  {/* NAME + MAIN VISIBILITY */}
                  <div className="flex items-center justify-between">
                    <h2 className="text-sm font-bold text-gray-900 leading-tight">
                      {item?.name}
                    </h2>
                    <div onClick={(e) => e.stopPropagation()}>
                      <Toggle
                        checked={mainVisible}
                        onChange={() =>
                          onToggleVisibility?.(item, "visible")
                        }
                      />
                    </div>
                  </div>

                  {/* PARENT NAME */}
                  {parentName && (
                    <p className="mt-0.5 text-[10px] text-gray-500">
                      {parentName}
                    </p>
                  )}

                  {/* HAS SUB */}
                  <div className="mt-2 rounded-md bg-gray-50 px-2 py-1.5 flex items-center justify-between">
                    <span className="text-[9px] font-semibold text-gray-600">
                      HAS SUB
                    </span>
                    <div onClick={(e) => e.stopPropagation()}>
                      <Toggle
                        checked={hasSubCategory}
                        onChange={() =>
                          onToggleVisibility?.(item, "hasSubCategory")
                        }
                      />
                    </div>
                  </div>

                  {/* MAIN CAT */}
                  <div className="mt-1 rounded-md bg-gray-50 px-2 py-1.5 flex items-center justify-between">
                    <span className="text-[9px] font-semibold text-gray-600">
                      MAIN CAT
                    </span>
                    <div onClick={(e) => e.stopPropagation()}>
                      <Toggle
                        checked={mainVisible}
                        onChange={() =>
                          onToggleVisibility?.(item, "visible")
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* ================= ACTION BUTTONS ================= */}
              <div className="mt-2 flex gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEditClick?.(item);
                  }}
                  className="flex-1 h-7 rounded-md bg-green-50 text-green-700 text-[11px] font-semibold hover:bg-green-100 transition"
                >
                  Edit
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteClick?.(item);
                  }}
                  className="flex-1 h-7 rounded-md bg-red-50 text-red-700 text-[11px] font-semibold hover:bg-red-100 transition"
                >
                  Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  /* ===============================
  DEEP & SUB-DEEP CATEGORY DESIGN
  =============================== */
  if (type === "deep" || type === "subDeep") {
    return (
      <div className="space-y-4">
        {list.map((item: any, index: number) => {
          const isVisible = item?.visible ?? false;
          // Ensure robust ID
          const id = item?.documentId || item?._id || item?.id || `${type}-${index}`;
          const title = item.firstTitle || item.name || "Unnamed";
          const subTitle = item.secondTitle;

          return (
            <div
              key={id}
              onClick={() => onItemClick?.(item)}
              className="flex flex-col gap-3 rounded-xl bg-white p-5 shadow-sm border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-300 cursor-pointer"
            >
              <div className="flex items-start justify-between">
                {/* LEFT CONTENT */}
                <div className="flex items-start gap-4">
                  <div className="mt-1 h-10 w-10 shrink-0 rounded-lg bg-indigo-50 flex items-center justify-center border border-indigo-100">
                    <Folder className="h-5 w-5 text-indigo-600" />
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-gray-900 leading-tight">
                      {title}
                    </h3>

                    {subTitle && (
                      <p className="text-sm font-medium text-indigo-600 mt-0.5">
                        {subTitle}
                      </p>
                    )}

                    {item.description && (
                      <p className="text-sm text-gray-500 mt-2 line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>
                    )}
                  </div>
                </div>

                {/* RIGHT ACTIONS */}
                <div className="flex items-center gap-2 ml-4">
                  <div onClick={(e) => e.stopPropagation()}>
                    <Toggle
                      checked={isVisible}
                      onChange={() => onToggleVisibility?.(item)}
                    />
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteClick?.(item);
                    }}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

              {/* FOOTER INFO */}
              <div className="mt-2 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400 font-mono">
                <span>ID: {id.slice(0, 8)}...</span>
                <span className="flex items-center gap-1">
                  {isVisible ? <Eye size={12} className="text-green-500" /> : <EyeOff size={12} className="text-gray-400" />}
                  {isVisible ? "Visible" : "Hidden"}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  /* ===============================
  DEFAULT FALLBACK
  =============================== */
  return (
    <div className="space-y-4">
      {list.map((item: any) => {
        const isVisible = item.visible ?? false;
        return (
          <div
            key={item.documentId || item._id}
            onClick={() => onItemClick?.(item)}
            className="rounded-xl bg-white p-4 shadow-sm border border-gray-200 cursor-pointer hover:shadow-md transition-all"
          >
            {/* Simple Fallback rendering */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center">
                  <Folder className="h-5 w-5 text-gray-500" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">
                    {item.name || "Item"}
                  </h3>
                  <p className="text-xs text-gray-500">{item.documentId || item._id}</p>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
export default CategoryList;

