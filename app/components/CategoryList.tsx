"use client";

import React from "react";
import {
  Trash2,
  Edit2,
  Image as ImageIcon,
  Folder,
  ChevronRight,
  Eye,
  EyeOff,
  ChevronDown,
  ChevronUp
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
  dataOverride?: any[];
}

/* ===============================
   MODERN TOGGLE COMPONENT (SMALLER - BLUE)
   =============================== */
const QuickToggle = ({ checked, onChange }: {
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
   ORANGE TOGGLE COMPONENT (MATCHING 2ND IMAGE)
   =============================== */
const OrangeToggle = ({ checked, onChange }: { checked: boolean; onChange?: () => void }) => (
  <label className="relative inline-flex cursor-pointer items-center">
    <input
      type="checkbox"
      checked={checked}
      onChange={onChange}
      className="peer sr-only"
    />
    <div className="h-7 w-12 rounded-full bg-gray-300 after:absolute after:left-1 after:top-1 after:h-5 after:w-5 after:rounded-full after:bg-gray-500 after:transition-all peer-checked:bg-[#FCD3BC] peer-checked:after:bg-[#E88F46] peer-checked:after:translate-x-5" />
  </label>
);

const InfoField = ({
  value,
  prefix = "",
  visibilityField,
  visibilityValue,
  item,
  onToggleVisibility
}: any) => (
  <div className="flex items-center justify-between rounded border-2 border-blue-900 bg-white px-2 py-2">
    <div className="truncate text-sm flex-1 mr-2">
      {prefix && <span className="font-semibold text-gray-500">{prefix}: </span>}
      <span className="font-bold text-gray-800">{value || ""}</span>
    </div>
    {visibilityField && (
      <div className="flex items-center gap-2 flex-shrink-0">
        <span className="text-[10px] font-bold text-gray-900">Visibility</span>
        <div onClick={(e) => e.stopPropagation()}>
          <OrangeToggle
            checked={visibilityValue}
            onChange={() => onToggleVisibility?.(item, visibilityField)}
          />
        </div>
      </div>
    )}
  </div>
);

const CategoryList: React.FC<CategoryListProps> = ({
  type,
  onItemClick,
  onDeleteClick,
  onEditClick,
  onToggleVisibility,
  onToggleSubCat,
  parentNameOverride,
  dataOverride,
}) => {
  const {
    mainCategories,
    subCategories,
    childCategories,
    deepChildCategories,
    subDeepChildCategories,
    isLoadingSubDeep,
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


  // Filter out "childCatVideos" if present
  const rawList = dataOverride || dataMap[type] || [];
  const list = rawList.filter((item: any) => item.name !== "childCatVideos");

  const [expandedItems, setExpandedItems] = React.useState<Record<string, boolean>>({});

  // Reset expanded items when type changes, but Auto-Expand for subDeep
  React.useEffect(() => {
    if (type === "subDeep") {
      const allExpanded: Record<string, boolean> = {};
      list.forEach((item: any, index: number) => {
        // Match ID logic from render loop (Line ~511)
        const id =
          item?.documentId ||
          item?._id ||
          item?.id ||
          item?.subDeepKey ||
          `subdeep-${index}`;
        allExpanded[id] = true;
      });
      setExpandedItems(allExpanded);
    } else {
      setExpandedItems({});
    }
    // Re-run if type changes or list length changes (data fetch)
  }, [type, list.length]);

  const toggleExpand = (id: string) => {
    setExpandedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  if (!list.length && type !== "subDeep" && type !== "deep") {
    return (
      <div className="rounded-2xl bg-gradient-to-br from-gray-50 to-white border-2 border-dashed border-gray-300 py-16 text-center">
        <Folder className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-gray-700 mb-2">No categories found</h3>
        <p className="text-gray-500">Add your first category to get started</p>
      </div>
    );
  }



  /* ===============================
  CHILD CATEGORY – SIMPLE LIST
  =============================== */
  if (type === "child") {
    return (
      <div className="space-y-3 w-[95%] max-w-md mx-auto">
        {list.map((item: any, index: number) => {
          const isVisible = item?.visible ?? item?.visibility ?? item?.Visibility ?? item?.isChildCategoryVisible ?? false;
          // Ensure backticks are used for template literal
          const id = item?.documentId || item?._id || `child-${index}`;

          return (
            <div
              key={id}
              onClick={() => onItemClick?.(item)}
              className="flex items-center justify-between rounded-2xl bg-gray-200 px-5 py-4 shadow-sm min-h-[90px] cursor-pointer hover:bg-gray-300 transition-colors"
            >
              <h3 className="text-2xl font-bold text-blue-950 ml-2">
                {item?.name || "Unnamed Child Category"}
              </h3>

              <div className="flex items-center gap-6 mr-2">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-gray-900">Visibility</span>
                  <div onClick={(e) => e.stopPropagation()}>
                    <OrangeToggle
                      checked={isVisible}
                      onChange={() => onToggleVisibility?.(item)}
                    />
                  </div>
                </div>

                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteClick?.(item);
                  }}
                  className="cursor-pointer flex h-10 w-10 items-center justify-center transition-opacity hover:opacity-80"
                  title="Delete"
                >
                  <Trash2 size={24} className="text-red-700" fill="#cc0000" />
                </div>
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
              className="relative flex gap-2 rounded-xl bg-white p-2 shadow-sm border border-gray-200 overflow-hidden cursor-pointer hover:shadow-md transition-all w-[240px]"
            >
              {/* 🔵 LEFT CURVED STRIP */}
              <div className="absolute left-0 top-0 h-full w-1 bg-blue-500 rounded-r-xl" />

              {/* IMAGE SECTION - LEFT COLUMN */}
              <div className="w-14 flex-shrink-0 ml-1 flex flex-col justify-between">
                <div>
                  {/* IMG + IMAGE VISIBILITY */}
                  <div className="flex items-center justify-between gap-1 mb-1 px-0.5">
                    <span className="text-[9px] font-bold text-gray-600">
                      IMG
                    </span>
                    <div onClick={(e) => e.stopPropagation()}>
                      <QuickToggle
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
                </div>

                {/* EDIT BUTTON */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEditClick?.(item);
                  }}
                  className="mt-1 w-full h-6 rounded-md bg-green-50 text-green-700 text-[10px] font-semibold hover:bg-green-100 flex items-center justify-center"
                >
                  Edit
                </button>
              </div>

              {/* CONTENT SECTION - RIGHT COLUMN */}
              <div className="flex-1 ml-2 flex flex-col h-full">
                {/* Header Row: Name + Toggle + Parent */}
                <div>
                  <div className="flex items-start justify-between gap-1 h-8">
                    <div className="flex flex-col min-w-0 justify-center">
                      <div className="flex items-center gap-2">
                        <h2 className="text-sm font-bold text-gray-900 leading-tight whitespace-nowrap overflow-hidden text-ellipsis">
                          {item?.name}
                        </h2>
                        {/* Visibility Toggle (Controls isSubCategoryNameVisible) */}
                        <div onClick={(e) => e.stopPropagation()}>
                          <QuickToggle
                            checked={item?.isSubCategoryNameVisible ?? true}
                            onChange={() =>
                              onToggleVisibility?.(item, "nameVisible")
                            }
                          />
                        </div>
                      </div>

                      {(item?.parentName || item?.parentId) && (
                        <p className="text-[10px] font-normal text-gray-400 leading-tight overflow-hidden text-ellipsis">
                          {item.parentName || item.parentId}
                        </p>
                      )}
                    </div>
                  </div>
                </div>



                {/* VISIBILITY BLOCK */}
                <div className="h-6 rounded-md bg-gray-50 px-2 flex items-center justify-between mt-1">
                  <span className="text-[9px] font-bold text-gray-500 uppercase tracking-wider">
                    VISIBLE
                  </span>
                  <div onClick={(e) => e.stopPropagation()}>
                    <QuickToggle
                      checked={item?.isSubCategoryVisible ?? item?.visible ?? true}
                      onChange={() =>
                        onToggleVisibility?.(item, "visible")
                      }
                    />
                  </div>
                </div>

                {/* SPACER to push content down */}
                <div className="flex-1" />

                {/* DELETE BUTTON */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteClick?.(item);
                  }}
                  className="w-14 h-6 ml-auto rounded-md bg-red-50 text-red-700 text-[10px] font-bold hover:bg-red-100 flex items-center justify-center whitespace-nowrap mt-2"
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
                      <QuickToggle
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
                      <QuickToggle
                        checked={item?.isMainCategoryNameVisible ?? true}
                        onChange={() =>
                          onToggleVisibility?.(item, "nameVisible")
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
                      <QuickToggle
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
                      <QuickToggle
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
      SUB DEEP CHILD CATEGORY DESIGN
  =============================== */
  if (type === "subDeep" || type === "deep") {
    const isDeep = type === "deep";
    const title = isDeep ? "Deep Child Category" : "Sub Deep Category";
    const visibilityKey = isDeep ? "visible" : "subDeepCategoryVisible";

    if (isDeep ? false : isLoadingSubDeep) {
      return (
        <div className="flex flex-col items-center justify-center p-8 text-center border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 animate-pulse">
          <Folder className="h-10 w-10 text-gray-300 mb-2 animate-bounce" />
          <p className="text-gray-500 font-medium">Loading Sub Deep Categories...</p>
        </div>
      );
    }

    if (!list || list.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center p-8 text-center border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
          <p className="text-gray-500 font-medium mb-2">No Sub Deep Categories Found</p>
          <p className="text-xs text-gray-400 max-w-xs">
            Add a new category using the form above to see it listed here. Ensure the correct parent categories are selected.
          </p>
        </div>
      );
    }



    return (
      <div className="space-y-6">
        {list.map((item: any, index: number) => {
          const isVisible = item?.[visibilityKey] ?? item?.visible ?? false;
          // Robust ID generation
          const id =
            item?.documentId ||
            item?._id ||
            item?.id ||
            item?.subDeepKey ||
            `subdeep-${index}`;

          // ===============================
          //  SUB DEEP CHILD SPECIFIC DESIGN
          // ===============================
          if (!isDeep) {
            return (
              <div
                key={id}
                onClick={() => toggleExpand(id)} // Clicking card toggles expand
                className="rounded-lg bg-gray-100 p-2 border border-gray-300 hover:border-blue-400 transition-all cursor-pointer"
              >
                {/* HEADER ROW: Index | Title | Toggle | View Button */}
                {/* Matching Screenshot:
                      [Index] [Title .................. Toggle] [View Less]
                  */}
                <div className="flex items-center mb-3">
                  {/* Index */}
                  <div className="h-10 w-10 flex-shrink-0 flex items-center justify-center rounded border-2 border-blue-900 bg-white text-blue-900 font-bold">
                    {index + 1}
                  </div>

                  {/* Title & Toggle Box */}
                  <div className="flex-1 ml-2 flex items-center justify-between rounded border-2 border-blue-900 bg-white px-3 h-10 overflow-hidden">
                    <span className="font-bold text-blue-950 truncate mr-2 text-sm md:text-base">
                      {item.name || item.firstTitle || "Sub Deep Child Cat Visible"}
                    </span>
                    <div onClick={(e) => e.stopPropagation()}>
                      <OrangeToggle
                        checked={isVisible}
                        onChange={() =>
                          onToggleVisibility?.(item, visibilityKey)
                        }
                      />
                    </div>
                  </div>

                  {/* View Button - Red Text */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleExpand(id);
                    }}
                    className="ml-2 h-10 px-3 rounded bg-gray-200 text-red-600 font-bold text-xs whitespace-nowrap hover:bg-gray-300 transition-colors border border-gray-300"
                  >
                    {expandedItems[id] ? "View Less" : "View More"}
                  </button>
                </div>

                {/* ACTIONS ROW */}
                <div className="flex gap-4 mb-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onEditClick?.(item);
                    }}
                    className="flex-1 bg-white border py-2 text-green-600 font-bold rounded-md shadow-sm hover:bg-green-50 transition"
                  >
                    Edit Category
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteClick?.(item);
                    }}
                    className="flex-1 bg-white border py-2 text-red-600 font-bold rounded-md shadow-sm hover:bg-red-50 transition"
                  >
                    Delete Category
                  </button>
                </div>

                {/* EXPANDABLE DATA */}
                {expandedItems[id] && (
                  <div className="space-y-2">
                    {/* Titles & Desc */}
                    <div className="border-2 border-blue-900 rounded px-2 py-2 text-sm italic font-bold text-gray-800 bg-white">
                      First Title: {item.firstTitle || "N/A"}
                    </div>
                    <div className="border-2 border-blue-900 rounded px-2 py-2 text-sm italic font-bold text-gray-800 bg-white">
                      Second Title: {item.secondTitle || "N/A"}
                    </div>
                    <div className="border-2 border-blue-900 rounded px-2 py-2 text-sm italic font-bold text-gray-800 bg-white">
                      Description: {item.description || "N/A"}
                    </div>

                    <div className="mt-2 space-y-2">
                      <InfoField
                        value={item.webviewUrl}
                        prefix="WebView URL"
                        visibilityField="webviewUrlVisible"
                        visibilityValue={item.webviewUrlVisible}
                        item={item}
                        onToggleVisibility={onToggleVisibility}
                      />
                      <InfoField
                        value={`₹${item.originalPrice || "0.00"}`}
                        prefix="Original Price"
                        visibilityField="originalPriceVisible"
                        visibilityValue={item.originalPriceVisible}
                        item={item}
                        onToggleVisibility={onToggleVisibility}
                      />

                      {/* GST & Price - Custom Layout */}
                      <div className="flex gap-2">
                        <div className="flex-1 border-2 border-blue-900 rounded px-2 py-2 text-sm bg-white text-gray-700">
                          Gst Percent: {item.gst || "0"}%
                        </div>
                        <div className="flex-1 border-2 border-blue-900 rounded px-2 py-2 text-sm bg-white text-gray-700">
                          Gst Type: {item.gstType || "Include"}
                        </div>
                      </div>
                      <div className="border-2 border-blue-900 rounded px-2 py-2 text-sm bg-white text-gray-700">
                        Price After GST: ₹{item.priceAfterGst || "0.00"}
                      </div>

                      {/* Discount */}
                      <div className="flex gap-2">
                        <div className="flex-1 border-2 border-blue-900 rounded px-2 py-2 text-sm bg-white text-gray-700">
                          Discount Value: {item.discountValue || "0.0"}
                        </div>
                        <div className="flex-1 border-2 border-blue-900 rounded px-2 py-2 text-sm bg-white text-gray-700">
                          Discount Type: {item.discountType || "%"}
                        </div>
                      </div>

                      <InfoField
                        value={`₹${item.currentPrice || "0.00"}`}
                        prefix="Current Price"
                        visibilityField="currentPriceVisible"
                        visibilityValue={item.currentPriceVisible}
                        item={item}
                        onToggleVisibility={onToggleVisibility}
                      />
                      <InfoField
                        value={item.minTime}
                        prefix="Min Time"
                        visibilityField="minTimeVisible"
                        visibilityValue={item.minTimeVisible}
                        item={item}
                        onToggleVisibility={onToggleVisibility}
                      />
                      <InfoField
                        value={item.maxTime}
                        prefix="Max Time"
                        visibilityField="maxTimeVisible"
                        visibilityValue={item.maxTimeVisible}
                        item={item}
                        onToggleVisibility={onToggleVisibility}
                      />

                      {/* Visibility Toggles Block */}
                      <div className="mt-4 bg-white rounded-xl">
                        <div className="flex justify-between items-start">
                          <div className="space-y-2 w-[60%]">
                            <div className="flex items-center justify-between rounded border-2 border-blue-900 px-2 py-1.5 bg-white">
                              <span className="text-sm font-bold text-blue-950">
                                First Title Visibility
                              </span>
                              <div onClick={(e) => e.stopPropagation()}>
                                <OrangeToggle
                                  checked={item.firstTitleVisible}
                                  onChange={() =>
                                    onToggleVisibility?.(
                                      item,
                                      "firstTitleVisible"
                                    )
                                  }
                                />
                              </div>
                            </div>
                            <div className="flex items-center justify-between rounded border-2 border-blue-900 px-2 py-1.5 bg-white">
                              <span className="text-sm font-bold text-blue-950">
                                Second Title Visibility
                              </span>
                              <div onClick={(e) => e.stopPropagation()}>
                                <OrangeToggle
                                  checked={item.secondTitleVisible}
                                  onChange={() =>
                                    onToggleVisibility?.(
                                      item,
                                      "secondTitleVisible"
                                    )
                                  }
                                />
                              </div>
                            </div>
                            <div className="flex items-center justify-between rounded border-2 border-blue-900 px-2 py-1.5 bg-white">
                              <span className="text-sm font-bold text-blue-950">
                                Description Visibility
                              </span>
                              <div onClick={(e) => e.stopPropagation()}>
                                <OrangeToggle
                                  checked={item.descriptionVisible}
                                  onChange={() =>
                                    onToggleVisibility?.(
                                      item,
                                      "descriptionVisible"
                                    )
                                  }
                                />
                              </div>
                            </div>
                          </div>

                          {/* Image Section */}
                          <div className="w-[35%] flex flex-col items-end">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs font-bold text-gray-700">
                                Image Visible
                              </span>
                              <div onClick={(e) => e.stopPropagation()}>
                                <OrangeToggle
                                  checked={item.photoVisible}
                                  onChange={() =>
                                    onToggleVisibility?.(item, "photoVisible")
                                  }
                                />
                              </div>
                            </div>
                            <div className="h-24 w-full bg-gray-100 border border-gray-300 rounded-lg overflow-hidden flex items-center justify-center relative">
                              {item.imageUri || item.image ? (
                                <img
                                  src={item.imageUri || item.image}
                                  alt="Preview"
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <span className="text-xs text-gray-400">
                                  No Img
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* VIDEOS SECTION */}
                      <div className="flex items-center justify-between mt-4 border-t pt-2">
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-bold text-gray-800">
                            Videos Visible
                          </span>
                          <div onClick={(e) => e.stopPropagation()}>
                            <OrangeToggle
                              checked={item.childCatVideosVisible}
                              onChange={() =>
                                onToggleVisibility?.(
                                  item,
                                  "childCatVideosVisible"
                                )
                              }
                            />
                          </div>
                        </div>
                        <button className="px-6 py-1 border-2 border-blue-900 text-red-600 font-bold bg-white rounded shadow-sm hover:bg-gray-50 text-sm">
                          View videos
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          }

          // ===============================
          //  DEEP CHILD SPECIFIC DESIGN (PRESERVED)
          // ===============================
          return (
            <div
              key={id}
              onClick={() => isDeep ? onItemClick?.(item) : toggleExpand(id)}
              className="rounded-lg bg-gray-100 p-2 border border-gray-300 hover:border-purple-400 transition-all cursor-pointer"
            >
              {/* HEADER */}
              <div
                onClick={() => isDeep && onItemClick?.(item)}
                className={`flex items-center justify-between bg-white rounded-md p-2 border mb-3 hover:bg-gray-50 transition-colors ${isDeep ? 'cursor-pointer' : ''}`}
              >
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 flex items-center justify-center rounded border border-purple-900 text-purple-900 font-bold">
                    {index + 1}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-purple-950">
                      {item.firstTitle || item.name || "Untitled"}
                    </span>
                    <span className="text-[10px] text-gray-500">
                      {title}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div onClick={(e) => e.stopPropagation()}>
                    <OrangeToggle
                      checked={isVisible}
                      onChange={() =>
                        onToggleVisibility?.(item, visibilityKey)
                      }
                    />
                  </div>
                  <div className="text-red-600 p-1">
                    {expandedItems[id] ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </div>
                </div>
              </div>

              {/* ACTIONS */}
              <div className="flex gap-4 mb-3">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEditClick?.(item);
                  }}
                  className="flex-1 bg-white border py-2 text-green-600 font-bold rounded-md shadow-sm hover:bg-green-50 transition"
                >
                  Edit Category
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteClick?.(item);
                  }}
                  className="flex-1 bg-white border py-2 text-red-600 font-bold rounded-md shadow-sm hover:bg-red-50 transition"
                >
                  Delete Category
                </button>
              </div>

              {/* VIEW MORE BUTTON */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleExpand(id);
                }}
                className="w-full py-2 my-2 bg-purple-100 text-purple-800 text-sm font-bold rounded-md hover:bg-purple-200 transition-colors"
              >
                {expandedItems[id] ? "View Less" : "View More"}
              </button>

              {/* EXPANDABLE DATA */}
              {expandedItems[id] && (
                <div className="space-y-4">
                  {/* SUMMARY */}
                  <div className="bg-white rounded-md space-y-2">
                    <div className="border-2 border-blue-900 rounded px-2 py-1 text-sm italic font-semibold text-gray-800 bg-white">
                      First Title: {item.firstTitle || "N/A"}
                    </div>
                    <div className="border-2 border-blue-900 rounded px-2 py-1 text-sm italic font-semibold text-gray-800 bg-white">
                      Second Title: {item.secondTitle || "N/A"}
                    </div>
                    <div className="border-2 border-blue-900 rounded px-2 py-1 text-sm italic font-semibold text-gray-800 bg-white">
                      Description: {item.description || "N/A"}
                    </div>
                  </div>

                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="pt-2 border-t space-y-2 cursor-default"
                  >
                    <InfoField
                      value={item.webviewUrl}
                      visibilityField="webviewUrlVisible"
                      visibilityValue={item.webviewUrlVisible}
                      item={item}
                      onToggleVisibility={onToggleVisibility}
                    />

                    <InfoField
                      value={`₹${item.originalPrice ? Number(item.originalPrice).toFixed(2) : "0.00"}`}
                      prefix="Original Price"
                      visibilityField="originalPriceVisible"
                      visibilityValue={item.originalPriceVisible}
                      item={item}
                      onToggleVisibility={onToggleVisibility}
                    />

                    {/* GST SECTION */}
                    <div className="flex gap-2">
                      <div className="flex-1 border-2 border-blue-900 rounded px-2 py-2 text-sm bg-white text-gray-700">
                        Gst Percent: {item.gst || "0"}%
                      </div>
                      <div className="flex-1 border-2 border-blue-900 rounded px-2 py-2 text-sm bg-white text-gray-700">
                        Gst Type: {item.gstType || "Include GST"}
                      </div>
                    </div>

                    <div className="border-2 border-blue-900 rounded px-2 py-2 text-sm bg-white text-gray-700">
                      Price After GST: ₹{item.priceAfterGst}
                    </div>

                    {/* DISCOUNT SECTION */}
                    <div className="flex gap-2">
                      <div className="flex-1 border-2 border-blue-900 rounded px-2 py-2 text-sm bg-white text-gray-700">
                        Discount Value: {item.discountValue || "0.0"}
                      </div>
                      <div className="flex-1 border-2 border-blue-900 rounded px-2 py-2 text-sm bg-white text-gray-700">
                        Discount Type: {item.discountType || "%"}
                      </div>
                    </div>


                    <InfoField
                      value={`₹${item.currentPrice ? Number(item.currentPrice).toFixed(2) : "0.00"}`}
                      prefix="Current Price"
                      visibilityField="currentPriceVisible"
                      visibilityValue={item.currentPriceVisible}
                      item={item}
                      onToggleVisibility={onToggleVisibility}
                    />

                    <InfoField
                      value={item.minTime}
                      prefix="Min Time"
                      visibilityField="minTimeVisible"
                      visibilityValue={item.minTimeVisible}
                      item={item}
                      onToggleVisibility={onToggleVisibility}
                    />

                    <InfoField
                      value={item.maxTime}
                      prefix="Max Time"
                      visibilityField="maxTimeVisible"
                      visibilityValue={item.maxTimeVisible}
                      item={item}
                      onToggleVisibility={onToggleVisibility}
                    />

                    {/* === IMAGE & TITLES VISIBILITY SECTION === */}
                    <div className="mt-4 bg-white rounded-xl p-0 border-0">
                      <div className="flex justify-between items-start">
                        {/* Title Visibilities */}
                        <div className="space-y-4 w-[60%]">
                          <div className="flex items-center justify-between rounded border-2 border-blue-900 px-2 py-1.5 bg-white">
                            <span className="text-sm font-bold text-blue-950">First Title Visibility</span>
                            <div onClick={(e) => e.stopPropagation()}>
                              <OrangeToggle checked={item.firstTitleVisible} onChange={() => onToggleVisibility?.(item, "firstTitleVisible")} />
                            </div>
                          </div>
                          <div className="flex items-center justify-between rounded border-2 border-blue-900 px-2 py-1.5 bg-white">
                            <span className="text-sm font-bold text-blue-950">Second Title Visibility</span>
                            <div onClick={(e) => e.stopPropagation()}>
                              <OrangeToggle checked={item.secondTitleVisible} onChange={() => onToggleVisibility?.(item, "secondTitleVisible")} />
                            </div>
                          </div>
                          <div className="flex items-center justify-between rounded border-2 border-blue-900 px-2 py-1.5 bg-white">
                            <span className="text-sm font-bold text-blue-950">Description Visibility</span>
                            <div onClick={(e) => e.stopPropagation()}>
                              <OrangeToggle checked={item.descriptionVisible} onChange={() => onToggleVisibility?.(item, "descriptionVisible")} />
                            </div>
                          </div>
                        </div>

                        {/* Image Preview & Visibility */}
                        <div className="w-[35%] flex flex-col items-end">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-bold text-gray-700">Image Visible</span>
                            <div onClick={(e) => e.stopPropagation()}>
                              <OrangeToggle checked={item.photoVisible} onChange={() => onToggleVisibility?.(item, "photoVisible")} />
                            </div>
                          </div>

                          <div className="h-24 w-full bg-black rounded-lg overflow-hidden flex items-center justify-center relative">
                            {item.image || item.imageUrl ? (
                              <img src={item.image || item.imageUrl} alt="Preview" className="h-full w-full object-cover" />
                            ) : (
                              <img
                                src="https://static.vecteezy.com/system/resources/previews/000/583/678/original/vector-sound-wave-background.jpg"
                                alt="Visualizer"
                                className="opacity-50 object-cover h-full w-full"
                              />
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* VIDEOS SECTION */}
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-bold text-gray-800">Videos Visible</span>
                        <div onClick={(e) => e.stopPropagation()}>
                          <OrangeToggle checked={item.childCatVideosVisible} onChange={() => onToggleVisibility?.(item, "childCatVideosVisible")} />
                        </div>
                      </div>
                      <button className="px-6 py-1 border-2 border-blue-900 text-red-600 font-bold bg-white rounded shadow-sm hover:bg-gray-50 text-sm">
                        View videos
                      </button>
                    </div>

                  </div>
                </div>
              )}
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
