// "use client";

// import { useState } from "react";
// import { Pencil, Trash2 } from "lucide-react";

// export default function CancellationRescheduleReasons() {
//   const [cancellationReasons, setCancellationReasons] = useState([
//     "Partner Unavailable",
//     "Equipment Failure",
//     "Customer Requested",
//   ]);

//   const [rescheduleReasons, setRescheduleReasons] = useState([
//     "Delay in Previous Job",
//     "Traffic / Travel Time",
//     "Part Not Available",
//   ]);

//   const [newCancellationReason, setNewCancellationReason] = useState("");
//   const [newRescheduleReason, setNewRescheduleReason] = useState("");

//   const [editingIndex, setEditingIndex] = useState<number | null>(null);
//   const [editingType, setEditingType] = useState<"cancel" | "reschedule" | null>(null);
//   const [editingValue, setEditingValue] = useState("");

//   // ---------------- ADD ----------------
//   const addCancellationReason = () => {
//     if (newCancellationReason.trim()) {
//       setCancellationReasons([...cancellationReasons, newCancellationReason]);
//       setNewCancellationReason("");
//     }
//   };

//   const addRescheduleReason = () => {
//     if (newRescheduleReason.trim()) {
//       setRescheduleReasons([...rescheduleReasons, newRescheduleReason]);
//       setNewRescheduleReason("");
//     }
//   };

//   // ---------------- DELETE ----------------
//   const removeCancellationReason = (index: number) => {
//     setCancellationReasons(cancellationReasons.filter((_, i) => i !== index));
//   };

//   const removeRescheduleReason = (index: number) => {
//     setRescheduleReasons(rescheduleReasons.filter((_, i) => i !== index));
//   };

//   // ---------------- EDIT ----------------
//   const handleEdit = (
//     index: number,
//     type: "cancel" | "reschedule",
//     value: string
//   ) => {
//     setEditingIndex(index);
//     setEditingType(type);
//     setEditingValue(value);
//   };

//   const handleSaveEdit = () => {
//     if (editingIndex === null || !editingType) return;

//     if (editingType === "cancel") {
//       const updated = [...cancellationReasons];
//       updated[editingIndex] = editingValue;
//       setCancellationReasons(updated);
//     } else {
//       const updated = [...rescheduleReasons];
//       updated[editingIndex] = editingValue;
//       setRescheduleReasons(updated);
//     }

//     setEditingIndex(null);
//     setEditingType(null);
//     setEditingValue("");
//   };

//   return (
//     <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
//       <div className="px-6 py-4 border-b border-gray-200">
//         <h2 className="text-xl font-bold text-gray-900">
//           Partner App - Cancellation & Reschedule Reasons
//         </h2>
//         <p className="text-sm text-gray-500 mt-1">
//           Manage predefined reasons for booking cancellations and reschedules.
//         </p>
//       </div>

//       <div className="grid grid-cols-2 divide-x divide-gray-200">
//         {/* LEFT SIDE */}
//         <div className="p-6">
//           <h3 className="text-lg font-bold mb-4">
//             Cancellation Reasons Management
//           </h3>

//           {/* Add */}
//           <div className="flex gap-2 mb-6">
//             <input
//               type="text"
//               value={newCancellationReason}
//               onChange={(e) => setNewCancellationReason(e.target.value)}
//               placeholder="Type reason here..."
//               className="flex-1 border rounded-lg px-4 py-2 text-sm"
//             />
//             <button
//               onClick={addCancellationReason}
//               className="px-4 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 text-sm"
//             >
//               + Add Reason
//             </button>
//           </div>

//           {/* List */}
//           <div className="space-y-3">
//             {cancellationReasons.map((reason, index) => (
//               <div
//                 key={index}
//                 className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border"
//               >
//                 {editingIndex === index && editingType === "cancel" ? (
//                   <input
//                     value={editingValue}
//                     onChange={(e) => setEditingValue(e.target.value)}
//                     onBlur={handleSaveEdit}
//                     autoFocus
//                     className="flex-1 border px-2 py-1 rounded text-sm"
//                   />
//                 ) : (
//                   <span className="text-sm">{reason}</span>
//                 )}

//                 <div className="flex gap-3">
//                   <button
//                     onClick={() =>
//                       handleEdit(index, "cancel", reason)
//                     }
//                     className="text-gray-500 hover:text-blue-600"
//                   >
//                     <Pencil size={16} />
//                   </button>

//                   <button
//                     onClick={() =>
//                       removeCancellationReason(index)
//                     }
//                     className="text-gray-500 hover:text-red-600"
//                   >
//                     <Trash2 size={16} />
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* RIGHT SIDE */}
//         <div className="p-6">
//           <h3 className="text-lg font-bold mb-4">
//             Reschedule Reasons Management
//           </h3>

//           {/* Add */}
//           <div className="flex gap-2 mb-6">
//             <input
//               type="text"
//               value={newRescheduleReason}
//               onChange={(e) => setNewRescheduleReason(e.target.value)}
//               placeholder="Type reason here..."
//               className="flex-1 border rounded-lg px-4 py-2 text-sm"
//             />
//             <button
//               onClick={addRescheduleReason}
//               className="px-4 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 text-sm"
//             >
//               + Add Reason
//             </button>
//           </div>

//           {/* List */}
//           <div className="space-y-3">
//             {rescheduleReasons.map((reason, index) => (
//               <div
//                 key={index}
//                 className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border"
//               >
//                 {editingIndex === index &&
//                 editingType === "reschedule" ? (
//                   <input
//                     value={editingValue}
//                     onChange={(e) => setEditingValue(e.target.value)}
//                     onBlur={handleSaveEdit}
//                     autoFocus
//                     className="flex-1 border px-2 py-1 rounded text-sm"
//                   />
//                 ) : (
//                   <span className="text-sm">{reason}</span>
//                 )}

//                 <div className="flex gap-3">
//                   <button
//                     onClick={() =>
//                       handleEdit(index, "reschedule", reason)
//                     }
//                     className="text-gray-500 hover:text-blue-600"
//                   >
//                     <Pencil size={16} />
//                   </button>

//                   <button
//                     onClick={() =>
//                       removeRescheduleReason(index)
//                     }
//                     className="text-gray-500 hover:text-red-600"
//                   >
//                     <Trash2 size={16} />
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";

const TOKEN = "super_secure_token";

const RESCHEDULE_URL =
  "https://api.bijliwalaaya.in/api/reschedule-reasons";

const CANCELLATION_URL =
  "https://api.bijliwalaaya.in/api/cancellation-reasons"; // 👈 make sure this endpoint exists

export default function CancellationRescheduleReasons() {
  const [rescheduleReasons, setRescheduleReasons] = useState<any[]>([]);
  const [cancellationReasons, setCancellationReasons] = useState<any[]>([]);

  const [rescheduleInput, setRescheduleInput] = useState("");
  const [cancellationInput, setCancellationInput] = useState("");

  const [editingRescheduleId, setEditingRescheduleId] = useState<string | null>(null);
  const [editingCancellationId, setEditingCancellationId] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);

  // ================= COMMON FETCH =================
  const fetchData = async () => {
    try {
      setLoading(true);

      const [res1, res2] = await Promise.all([
        fetch(RESCHEDULE_URL, {
          headers: {
            "Content-Type": "application/json",
            "x-api-token": TOKEN,
          },
        }),
        fetch(CANCELLATION_URL, {
          headers: {
            "Content-Type": "application/json",
            "x-api-token": TOKEN,
          },
        }),
      ]);

      const result1 = await res1.json();
      const result2 = await res2.json();

      if (result1.success) setRescheduleReasons(result1.data);
      if (result2.success) setCancellationReasons(result2.data);

    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ================= ADD / UPDATE =================
  const handleSubmit = async (type: "reschedule" | "cancel") => {
    try {
      const isReschedule = type === "reschedule";
      const input = isReschedule ? rescheduleInput : cancellationInput;
      const editingId = isReschedule
        ? editingRescheduleId
        : editingCancellationId;

      if (!input.trim()) return;

      const baseUrl = isReschedule ? RESCHEDULE_URL : CANCELLATION_URL;

      let url = baseUrl;
      let method = "POST";

      if (editingId) {
        url = `${baseUrl}/${editingId}`;
        method = "PUT";
      }

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "x-api-token": TOKEN,
        },
        body: JSON.stringify({ reason: input }),
      });

      const result = await res.json();

      if (result.success) {
        if (isReschedule) {
          setRescheduleInput("");
          setEditingRescheduleId(null);
        } else {
          setCancellationInput("");
          setEditingCancellationId(null);
        }

        fetchData();
      } else {
        alert(result.message || "Something went wrong");
      }
    } catch (error) {
      console.error("Submit Error:", error);
    }
  };

  // ================= DELETE =================
  const handleDelete = async (
    id: string,
    type: "reschedule" | "cancel"
  ) => {
    if (!confirm("Are you sure you want to delete?")) return;

    try {
      const baseUrl =
        type === "reschedule" ? RESCHEDULE_URL : CANCELLATION_URL;

      const res = await fetch(`${baseUrl}/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "x-api-token": TOKEN,
        },
      });

      const result = await res.json();
      if (result.success) {
        fetchData();
      }
    } catch (err) {
      console.error("Delete Error:", err);
    }
  };

  // ================= EDIT =================
  const handleEdit = (
    item: any,
    type: "reschedule" | "cancel"
  ) => {
    if (type === "reschedule") {
      setEditingRescheduleId(item._id);
      setRescheduleInput(item.reason);
    } else {
      setEditingCancellationId(item._id);
      setCancellationInput(item.reason);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden p-6">

      <div className="bg-white border-b border-gray-200 px-8 py-6">
  <div className="flex items-center justify-between">
    
    <div>
      <h1 className="text-3xl font-black text-gray-900 tracking-tight">
        Partner App
        <span className="text-blue-600"> – Cancellation & Reschedule</span>
      </h1>

      <p className="text-gray-500 text-sm mt-2">
        Manage predefined reasons for booking cancellations and reschedules.
      </p>
    </div>

  </div>
</div>


      <div className="grid grid-cols-2 gap-8">

        {/* ================= CANCELLATION ================= */}
        <div>
          <h3 className="text-lg font-bold mb-4">
            Cancellation Reasons
          </h3>

          <div className="flex gap-2 mb-6">
            <input
              value={cancellationInput}
              onChange={(e) =>
                setCancellationInput(e.target.value)
              }
              placeholder="Type reason here..."
              className="flex-1 border rounded-lg px-4 py-2 text-sm"
            />
            <button
              onClick={() => handleSubmit("cancel")}
              className="px-4 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 text-sm"
            >
              {editingCancellationId ? "Update" : "+ Add"}
            </button>
          </div>

          {loading ? (
            <p>Loading...</p>
          ) : (
            <div className="space-y-3">
              {cancellationReasons.map((item) => (
                <div
                  key={item._id}
                  className="flex justify-between items-center p-3 bg-gray-50 border rounded-lg"
                >
                  <span className="text-sm">
                    {item.reason}
                  </span>

                  <div className="flex gap-3">
                    <button
                      onClick={() =>
                        handleEdit(item, "cancel")
                      }
                      className="text-gray-500 hover:text-blue-600"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() =>
                        handleDelete(item._id, "cancel")
                      }
                      className="text-gray-500 hover:text-red-600"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ================= RESCHEDULE ================= */}
        <div>
          <h3 className="text-lg font-bold mb-4">
            Reschedule Reasons
          </h3>

          <div className="flex gap-2 mb-6">
            <input
              value={rescheduleInput}
              onChange={(e) =>
                setRescheduleInput(e.target.value)
              }
              placeholder="Type reason here..."
              className="flex-1 border rounded-lg px-4 py-2 text-sm"
            />
            <button
              onClick={() => handleSubmit("reschedule")}
              className="px-4 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 text-sm"
            >
              {editingRescheduleId ? "Update" : "+ Add"}
            </button>
          </div>

          {loading ? (
            <p>Loading...</p>
          ) : (
            <div className="space-y-3">
              {rescheduleReasons.map((item) => (
                <div
                  key={item._id}
                  className="flex justify-between items-center p-3 bg-gray-50 border rounded-lg"
                >
                  <span className="text-sm">
                    {item.reason}
                  </span>

                  <div className="flex gap-3">
                    <button
                      onClick={() =>
                        handleEdit(item, "reschedule")
                      }
                      className="text-gray-500 hover:text-blue-600"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() =>
                        handleDelete(item._id, "reschedule")
                      }
                      className="text-gray-500 hover:text-red-600"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
