// // // "use client";

// // // import React, { useState, useEffect } from "react";
// // // import {
// // //   Plus,
// // //   Trash2,
// // //   Eye,
// // //   Image as ImageIcon,
// // //   Video as VideoIcon,
// // //   Monitor,
// // //   Activity,
// // //   ChevronRight,
// // //   Terminal,
// // //   Grid,
// // //   Layers,
// // //   Zap,
// // //   Loader2,
// // //   AlertCircle,
// // //   PlayCircle,
// // //   MapPin,
// // //   Cpu,
// // //   Database,
// // //   Search,
// // //   CheckCircle2
// // // } from "lucide-react";
// // // import toast, { Toaster } from "react-hot-toast";

// // // // ==================== Types ====================
// // // interface Category {
// // //   _id: string;
// // //   category: string;
// // //   positions: Position[];
// // // }

// // // interface Position {
// // //   _id: string;
// // //   bannerPosition: string;
// // //   sizes: Size[];
// // // }

// // // interface Size {
// // //   _id: string;
// // //   bannerImageSize: string;
// // //   images: any[];
// // //   videos: any[];
// // // }

// // // // ==================== Studio.X Axis v10 (Final Stable) ====================
// // // export default function BannerStudioV10() {
// // //   const [categories, setCategories] = useState<Category[]>([]);

// // //   // Active selection states (ID driven for Backend Sync)
// // //   const [activeCatId, setActiveCatId] = useState<string>("");
// // //   const [activePosId, setActivePosId] = useState<string>("");
// // //   const [activeSizeId, setActiveSizeId] = useState<string>("");

// // //   const [mediaList, setMediaList] = useState<any>({ images: [], videos: [] });
// // //   const [loading, setLoading] = useState(false);
// // //   const [logs, setLogs] = useState<any>(null);

// // //   const [form, setForm] = useState({
// // //     newCat: "",
// // //     posTitle: "Upper", // For enum: ["Upper", "Middle", "Lower"]
// // //     sizeTitle: "Big Slider",
// // //     assetId: "",
// // //     assetUrl: "",
// // //     assetPromo: ""
// // //   });

// // //   const BASE_URL = "https://live.bijliwalaaya.in/api/banner";
// // //   const TOKEN = "super_secure_token";
 
// // //   const headers = { "x-api-token": TOKEN };

// // //   // --- API ENGINE ---
// // //   const callApi = async (path: string, method: string, body: any, label: string, isFile: boolean = false) => {
// // //     setLoading(true);
// // //     try {
// // //       const fetchOptions: RequestInit = { method, headers: { ...headers } };

// // //       if (isFile) {
// // //         const formData = new FormData();
// // //         Object.keys(body).forEach(key => formData.append(key, body[key]));
// // //         fetchOptions.body = formData;
// // //       } else if (body) {
// // //         (fetchOptions.headers as any)["Content-Type"] = "application/json";
// // //         fetchOptions.body = JSON.stringify(body);
// // //       }

// // //       const res = await fetch(`${BASE_URL}${path}`, fetchOptions);
// // //       const data = await res.json();
// // //       setLogs({ label, path, method, status: res.status, body, response: data });

// // //       if (res.ok && data.success) {
// // //         toast.success(`${label} Success!`, { style: { background: '#0F172A', color: '#fff', border: '1px solid #10B981' } });
// // //         return data;
// // //       } else {
// // //         toast.error(`${label}: ${data.message || data.error}`, { style: { background: '#0F172A', color: '#fff', border: '1px solid #EF4444' } });
// // //         return data;
// // //       }
// // //     } catch (e: any) {
// // //       toast.error("Bridge Connection Failed");
// // //       return null;
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   };

// // //   const loadData = async () => {
// // //     const data = await callApi("/all", "GET", null, "System Init");
// // //     if (data?.data) {
// // //       setCategories(data.data);
// // //       // Auto-set first category if none active
// // //       if (data.data.length > 0 && !activeCatId) {
// // //         setActiveCatId(data.data[0]._id);
// // //       }
// // //     }
// // //   };

// // //   const loadGallery = async () => {
// // //     if (activeCatId && activePosId && activeSizeId) {
// // //       const data = await callApi(`/${activeCatId}/${activePosId}/${activeSizeId}/media?type=all`, "GET", null, "Registry Sync");
// // //       if (data?.data) setMediaList(data.data);
// // //     }
// // //   };

// // //   useEffect(() => { loadData(); }, []);
// // //   useEffect(() => { loadGallery(); }, [activeCatId, activePosId, activeSizeId]);

// // //   // Derived active objects
// // //   const activeCat = categories.find(c => c._id === activeCatId);
// // //   const activePos = activeCat?.positions.find(p => p._id === activePosId);

// // //   // --- ACTIONS ---
// // //   const handleCreateCategory = async () => {
// // //     const res = await callApi("/category", "POST", { category: form.newCat }, "Add Category");
// // //     if (res?.success) { loadData(); setForm(p => ({ ...p, newCat: "" })); }
// // //   };

// // //   const handleAddPosition = async () => {
// // //     const res = await callApi(`/${activeCatId}/position`, "POST", { bannerPosition: form.posTitle }, "Add Position");
// // //     if (res?.success) loadData();
// // //   };

// // // const handleAddSize = async () => {
// // //   if (!activeCat || !activePos) {
// // //     toast.error("Select Category & Position first");
// // //     return;
// // //   }

// // //   const categoryName = activeCat.category;
// // //   const positionName = activePos.bannerPosition;

// // //   const res = await callApi(
// // //     `/${categoryName}/${positionName}/size`,
// // //     "POST",
// // //     { bannerImageSize: form.sizeTitle },
// // //     "Add Size"
// // //   );

// // //   if (res?.success) loadData();
// // // };

// // //   const handleDeployMedia = async (type: 'image' | 'video') => {
// // //     const payload: any = {
// // //       categoryId: activeCatId,
// // //       positionId: activePosId === "upper" ? "upper" : activePosId, // Adjusting mapping
// // //       sizeId: activeSizeId,
// // //       promotionalUrl: form.assetPromo
// // //     };

// // //     if (type === 'image') {
// // //       payload.imageUrl = form.assetUrl;
// // //       payload.id = form.assetId; // Mongoose schema mapping
// // //     } else {
// // //       payload.videoUrl = form.assetUrl;
// // //       payload.id = form.assetId;
// // //     }

// // //     callApi(`/${activeCatId}/${activePosId}/${activeSizeId}/${type}`, "POST", payload, `Deploy ${type}`, true).then(loadGallery);
// // //   };

// // //   return (
// // //     <div className="min-h-screen bg-[#02040A] text-slate-400 font-['Outfit',sans-serif] flex overflow-hidden">
// // //       <Toaster position="top-right" />

// // //       {/* --- SIDEBAR: Axis Navigation --- */}
// // //       <aside className="w-80 bg-[#080B14] border-r border-white/5 flex flex-col z-30 shadow-2xl">
// // //         <div className="p-10 border-b border-white/5 bg-gradient-to-br from-white/[0.03] to-transparent">
// // //           <div className="flex items-center gap-4">
// // //             <div className="w-12 h-12 bg-indigo-600 rounded-[18px] flex items-center justify-center shadow-lg shadow-indigo-600/20">
// // //               <Cpu className="w-7 h-7 text-white" />
// // //             </div>
// // //             <div>
// // //               <h1 className="text-xl font-black text-white tracking-widest">AXIS<span className="text-indigo-500">.X</span></h1>
// // //               <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[3px]">Studio v10</p>
// // //             </div>
// // //           </div>
// // //         </div>

// // //         <div className="flex-1 overflow-y-auto p-6 space-y-10 scrollbar-none">
// // //           <section>
// // //             <h3 className="text-[10px] font-black text-slate-600 uppercase tracking-[3px] mb-6 px-2">Channels</h3>
// // //             <div className="space-y-2">
// // //               {categories.map((c) => (
// // //                 <button
// // //                   key={c._id}
// // //                   onClick={() => { setActiveCatId(c._id); setActivePosId(""); setActiveSizeId(""); }}
// // //                   className={`w-full group flex items-center justify-between p-4 rounded-[20px] transition-all ${activeCatId === c._id ? 'bg-indigo-600 text-white shadow-xl scale-[1.02]' : 'hover:bg-white/[0.03] text-slate-500'}`}
// // //                 >
// // //                   <span className="font-bold capitalize text-sm">{c.category}</span>
// // //                   {activeCatId === c._id && <Zap className="w-4 h-4 text-white fill-current" />}
// // //                 </button>
// // //               ))}
// // //             </div>
// // //           </section>

// // //           <section className="pt-8 border-t border-white/5">
// // //             <div className="p-5 bg-white/[0.02] rounded-[28px] border border-white/5 space-y-4">
// // //               <input
// // //                 placeholder="New Realm..."
// // //                 value={form.newCat}
// // //                 onChange={e => setForm(p => ({ ...p, newCat: e.target.value }))}
// // //                 className="w-full bg-black/40 border border-white/10 px-6 py-4 rounded-xl text-xs font-bold text-white outline-none focus:border-indigo-500 transition-all"
// // //               />
// // //               <button
// // //                 onClick={handleCreateCategory}
// // //                 className="w-full bg-white text-black py-4 rounded-xl font-black text-[10px] uppercase tracking-[2px] hover:bg-indigo-500 hover:text-white transition-all shadow-lg"
// // //               >
// // //                 Create Channel
// // //               </button>
// // //             </div>
// // //           </section>
// // //         </div>
// // //       </aside>

// // //       {/* --- Main Workspace --- */}
// // //       <main className="flex-1 overflow-y-auto relative py-12 px-12 bg-[#02040A] scrollbar-none">
// // //         <div className="fixed top-0 right-0 w-[1200px] h-[1200px] bg-indigo-600/[0.02] blur-[200px] rounded-full pointer-events-none" />

// // //         <div className="flex items-end justify-between mb-16 relative z-10">
// // //           <div className="space-y-4">
// // //             <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[4px] text-slate-500">
// // //               <span className="text-white bg-indigo-500/10 px-3 py-1.5 rounded-xl border border-indigo-500/10 underline decoration-2 underline-offset-4">{activeCat?.category || "SELECT CHANNEL"}</span>
// // //               <ChevronRight className="w-4 h-4" />
// // //               <span>{activePos?.bannerPosition || "POSITION"}</span>
// // //             </div>
// // //             <h2 className="text-6xl font-black text-white tracking-tighter">Deck <span className="text-indigo-600">Core</span></h2>
// // //           </div>

// // //           <div className="flex p-1.5 bg-[#0D1117] rounded-[26px] border border-white/5 shadow-2xl">
// // //             {activeCat?.positions.map((p) => (
// // //               <button
// // //                 key={p._id}
// // //                 onClick={() => { setActivePosId(p._id); setActiveSizeId(""); }}
// // //                 className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activePosId === p._id ? 'bg-white text-black shadow-xl scale-105' : 'text-slate-600 hover:text-white'}`}
// // //               >
// // //                 {p.bannerPosition}
// // //               </button>
// // //             ))}
// // //             {(!activeCat?.positions.length) && <span className="px-6 py-3 text-[10px] opacity-30 italic">No Nodes Found</span>}
// // //           </div>
// // //         </div>

// // //         <div className="grid grid-cols-1 xl:grid-cols-12 gap-12 relative z-10">
// // //           {/* Controllers */}
// // //           <div className="xl:col-span-4 space-y-10">
// // //             <ControlCard title="Position Node" color="#10B981" icon={<MapPin className="w-5 h-5" />} onExec={handleAddPosition}>
// // //               <div className="space-y-3">
// // //                 <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1 opacity-60 italic">Enum Validation</label>
// // //                 <select
// // //                   value={form.posTitle}
// // //                   onChange={e => setForm(p => ({ ...p, posTitle: e.target.value }))}
// // //                   className="w-full bg-black/60 border border-white/5 px-6 py-4 rounded-xl text-xs font-black text-white outline-none focus:border-indigo-500 transition-all"
// // //                 >
// // //                   <option value="Upper">Upper (Top Section)</option>
// // //                   <option value="Middle">Middle (Mid Section)</option>
// // //                   <option value="Lower">Lower (Footer Section)</option>
// // //                 </select>
// // //               </div>
// // //             </ControlCard>

// // //             <ControlCard title="Grid Template" color="#F59E0B" icon={<Layers className="w-5 h-5" />} onExec={handleAddSize}>
// // //               <XInput label="Resolution Title" value={form.sizeTitle} onChange={(v: string) => setForm(p => ({ ...p, sizeTitle: v }))} />
// // //             </ControlCard>

// // //             <div className="bg-[#080B14] border border-white/5 rounded-[40px] p-10 space-y-8 shadow-2xl">
// // //               <div className="flex items-center justify-between">
// // //                 <h3 className="text-[11px] font-black text-white uppercase tracking-[3px]">Asset Engine</h3>
// // //                 <Activity className={`w-5 h-5 ${loading ? 'text-indigo-500 animate-spin' : 'text-slate-800'}`} />
// // //               </div>

// // //               <div className="space-y-5">
// // //                 <XInput label="Asset ID" value={form.assetId} onChange={(v: string) => setForm(p => ({ ...p, assetId: v }))} />
// // //                 <XInput label="Media Source (URL)" value={form.assetUrl} onChange={(v: string) => setForm(p => ({ ...p, assetUrl: v }))} />
// // //                 <XInput label="Action Routing (URL)" value={form.assetPromo} onChange={(v: string) => setForm(p => ({ ...p, assetPromo: v }))} />
// // //               </div>

// // //               <div className="flex gap-4 pt-2">
// // //                 <button onClick={() => handleDeployMedia('image')} className="flex-1 bg-indigo-600 hover:bg-white hover:text-black py-5 rounded-[22px] font-black text-[10px] uppercase tracking-widest transition-all shadow-xl shadow-indigo-600/20">
// // //                   Add Image
// // //                 </button>
// // //                 <button onClick={() => handleDeployMedia('video')} className="flex-1 bg-[#1A1C23] border border-white/10 hover:border-indigo-500 py-5 rounded-[22px] font-black text-[10px] uppercase tracking-widest transition-all">
// // //                   Add Video
// // //                 </button>
// // //               </div>
// // //             </div>
// // //           </div>

// // //           {/* Gallery */}
// // //           <div className="xl:col-span-8 space-y-10">
// // //             <div className="bg-[#080B14] border border-white/5 rounded-[50px] p-12 min-h-[750px] flex flex-col shadow-2xl relative">
// // //               <div className="flex items-center justify-between mb-12">
// // //                 <h3 className="text-3xl font-black text-white flex items-center gap-5 tracking-tighter">
// // //                   <Monitor className="w-8 h-8 text-indigo-500" /> System Feed
// // //                 </h3>
// // //                 <div className="flex gap-2 p-1.5 bg-black/40 rounded-[20px] border border-white/5">
// // //                   {activePos?.sizes.map(s => (
// // //                     <button key={s._id} onClick={() => setActiveSizeId(s._id)} className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all ${activeSizeId === s._id ? 'bg-white text-black shadow-lg scale-105' : 'text-slate-600 hover:text-white'}`}>
// // //                       {s.bannerImageSize}
// // //                     </button>
// // //                   ))}
// // //                 </div>
// // //               </div>

// // //               <div className="grid grid-cols-1 md:grid-cols-2 gap-8 flex-1">
// // //                 {(mediaList?.images || []).map((img: any) => <MediaTile key={img._id} type="image" data={img} />)}
// // //                 {(mediaList?.videos || []).map((vid: any) => <MediaTile key={vid._id} type="video" data={vid} />)}

// // //                 {(!activeSizeId) && (
// // //                   <div className="col-span-full flex flex-col items-center justify-center text-center opacity-30 gap-8 py-40 bg-white/[0.01] rounded-[40px] border border-dashed border-white/5">
// // //                     <ImageIcon className="w-20 h-20" />
// // //                     <p className="text-xl font-black text-white uppercase tracking-[5px]">Select Resolution Node</p>
// // //                   </div>
// // //                 )}
// // //                 {loading && <div className="col-span-full flex items-center justify-center"><Loader2 className="w-16 h-16 animate-spin text-indigo-600 opacity-20" /></div>}
// // //               </div>
// // //             </div>
// // //           </div>
// // //         </div>

// // //         {/* X-Bridge Floating Console */}
// // //         <div className="fixed bottom-10 right-10 w-[480px] z-50">
// // //           <div className="bg-[#0A0D14]/95 backdrop-blur-3xl border border-white/10 rounded-[36px] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.8)] overflow-hidden scale-in-center">
// // //             <div className="p-6 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
// // //               <div className="flex items-center gap-4">
// // //                 <Terminal className="w-4 h-4 text-indigo-400" />
// // //                 <span className="text-[10px] font-black uppercase tracking-[4px] text-slate-500">Live Feedback</span>
// // //               </div>
// // //               <div className="flex gap-2">
// // //                 <div className="w-2.5 h-2.5 rounded-full bg-slate-800" />
// // //                 <div className="w-2.5 h-2.5 rounded-full bg-slate-800" />
// // //                 <div className="w-2.5 h-2.5 rounded-full bg-slate-800" />
// // //               </div>
// // //             </div>

// // //             <div className="p-10 h-[300px] overflow-y-auto font-mono text-[10px] scrollbar-none space-y-8">
// // //               {logs ? (
// // //                 <div className="space-y-8">
// // //                   <div className="flex items-center gap-4">
// // //                     <code className="bg-indigo-500/10 text-indigo-400 px-4 py-1.5 rounded-full font-black uppercase tracking-widest text-[9px]">Event LOG</code>
// // //                     <span className="text-slate-500 font-bold">{logs.method} {logs.path}</span>
// // //                   </div>
// // //                   <div className="bg-black/80 p-8 rounded-[30px] border border-white/5 space-y-6">
// // //                     <p className="text-indigo-400 font-black tracking-widest text-[10px] uppercase">STATUS: {logs.status}</p>
// // //                     <pre className="text-slate-400 whitespace-pre-wrap leading-relaxed">{JSON.stringify(logs.response, null, 2)}</pre>
// // //                   </div>
// // //                 </div>
// // //               ) : (
// // //                 <div className="h-full flex flex-col items-center justify-center opacity-20 gap-8">
// // //                   <Zap className="w-12 h-12 text-indigo-500 animate-pulse" />
// // //                   <p className="font-black uppercase tracking-[6px] text-xs text-center">Monitoring Data<br />Channels Ready</p>
// // //                 </div>
// // //               )}
// // //             </div>
// // //             {logs?.status === 500 && (
// // //               <div className="p-8 bg-red-600/10 border-t border-red-500/20 flex gap-6">
// // //                 <AlertCircle className="w-10 h-10 text-red-500 shrink-0" />
// // //                 <p className="text-[11px] font-bold text-red-400 leading-relaxed uppercase tracking-widest">
// // //                   System Sync Failure (500)<br />
// // //                   <span className="opacity-60">Internal Registry Error. Check Server Logs for Duplicate IDs or Schema Conflicts.</span>
// // //                 </p>
// // //               </div>
// // //             )}
// // //           </div>
// // //         </div>
// // //       </main>

// // //       <style jsx global>{`
// // //         @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&display=swap');
// // //         .scrollbar-none::-webkit-scrollbar { display: none; }
// // //         .scale-in-center { animation: scale-in-center 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940) both; }
// // //         @keyframes scale-in-center { 0% { transform: scale(0.95); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
// // //       `}</style>
// // //     </div>
// // //   );
// // // }

// // // // Visual Blocks
// // // function NavTab({ active, icon, label, onClick }: any) {
// // //   return (
// // //     <button onClick={onClick} className={`px-8 py-3 rounded-2xl flex items-center gap-3 font-black text-[10px] uppercase tracking-widest transition-all ${active ? 'bg-white text-black shadow-xl' : 'text-slate-600 hover:text-white'}`}>
// // //       {icon} {label}
// // //     </button>
// // //   );
// // // }

// // // function ControlCard({ title, icon, color, children, onExec }: any) {
// // //   return (
// // //     <div className="bg-[#080B14] border border-white/5 rounded-[40px] p-10 space-y-10 group hover:border-white/10 transition-all shadow-2xl relative overflow-hidden">
// // //       <div className="absolute top-0 right-0 w-40 h-40 blur-[80px] opacity-10 rounded-full" style={{ backgroundColor: color }} />
// // //       <div className="flex items-center gap-4 relative z-10">
// // //         <div className="p-4 rounded-[22px] text-white shadow-2xl" style={{ backgroundColor: color }}>{icon}</div>
// // //         <h3 className="font-black text-white text-[10px] uppercase tracking-[4px]">{title}</h3>
// // //       </div>
// // //       <div className="space-y-6 relative z-10">{children}</div>
// // //       <button onClick={onExec} className="w-full py-5 rounded-[24px] font-black text-[10px] uppercase tracking-widest transition-all border mt-4 z-10 relative" style={{ borderColor: `${color}40`, color, backgroundColor: `${color}05` }}>
// // //         Apply Node
// // //       </button>
// // //     </div>
// // //   );
// // // }

// // // function XInput({ label, value, onChange }: { label: string, value: string, onChange: (v: string) => void }) {
// // //   return (
// // //     <div className="space-y-3">
// // //       <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-2 italic opacity-60 flex items-center gap-2">
// // //         <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-indigo-500/50" /> {label}
// // //       </label>
// // //       <input value={value} onChange={e => onChange(e.target.value)} className="w-full bg-black/60 border border-white/5 px-8 py-5 rounded-[22px] text-xs font-black text-white outline-none focus:border-indigo-500 transition-all shadow-inner" />
// // //     </div>
// // //   );
// // // }

// // // function MediaTile({ type, data }: any) {
// // //   return (
// // //     <div className="bg-[#05060A] border border-white/5 rounded-[40px] overflow-hidden group hover:border-indigo-500/40 transition-all duration-700 shadow-2xl">
// // //       <div className="p-8 flex items-center justify-between border-b border-white/5 bg-white/[0.01]">
// // //         <span className="text-[10px] font-black text-slate-600 tracking-[3px] uppercase opacity-60">NODE://{data._id?.slice(-6)}</span>
// // //         <div className="flex gap-4">
// // //           <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-2xl cursor-pointer hover:bg-indigo-500 hover:text-white transition-all"><Eye className="w-5 h-5" /></div>
// // //           <div className="p-3 bg-red-500/10 text-red-500 rounded-2xl cursor-pointer hover:bg-red-500 hover:text-white transition-all"><Trash2 className="w-5 h-5" /></div>
// // //         </div>
// // //       </div>
// // //       <div className="aspect-[16/10] relative overflow-hidden bg-black">
// // //         {type === 'image' ? (
// // //           <img src={data.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1.5s]" alt="" />
// // //         ) : (
// // //           <div className="w-full h-full flex flex-col items-center justify-center opacity-30 group-hover:opacity-100 transition-all">
// // //             <PlayCircle className="w-20 h-20 text-white mb-6 stroke-1" />
// // //             <span className="text-[11px] font-black uppercase tracking-[6px] text-white">Axis Stream</span>
// // //           </div>
// // //         )}
// // //         <div className="absolute bottom-8 left-8 flex transition-all duration-700 transform translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100">
// // //           <div className="bg-white/10 backdrop-blur-3xl px-8 py-3 rounded-[22px] text-[10px] font-black text-white uppercase tracking-[4px] border border-white/10 shadow-2xl flex items-center gap-3">
// // //             <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" /> {type} Registry
// // //           </div>
// // //         </div>
// // //       </div>
// // //     </div>
// // //   );
// // // }


// // "use client";

// // import React, { useState, useEffect } from "react";
// // import {
// //   Plus,
// //   Trash2,
// //   Eye,
// //   Image as ImageIcon,
// //   Video as VideoIcon,
// //   Monitor,
// //   Activity,
// //   ChevronRight,
// //   Terminal,
// //   Grid,
// //   Layers,
// //   Zap,
// //   Loader2,
// //   AlertCircle,
// //   PlayCircle,
// //   MapPin,
// //   Cpu,
// //   Database,
// //   Search,
// //   CheckCircle2,
// //   X,
// //   Save,
// //   Edit,
// //   FolderPlus,
// //   LayoutGrid,
// //   List,
// //   PanelRight,
// //   PanelLeft,
// // } from "lucide-react";
// // import toast, { Toaster } from "react-hot-toast";

// // // ==================== Types ====================
// // interface Category {
// //   _id: string;
// //   category: string;
// //   positions: Position[];
// // }

// // interface Position {
// //   _id: string;
// //   bannerPosition: string;
// //   sizes: Size[];
// // }

// // interface Size {
// //   _id: string;
// //   bannerImageSize: string;
// //   images: any[];
// //   videos: any[];
// // }

// // // ==================== BannerStudio – Clean Admin UI ====================
// // export default function BannerStudioV10() {
// //   const [categories, setCategories] = useState<Category[]>([]);

// //   // Active selection
// //   const [activeCatId, setActiveCatId] = useState<string>("");
// //   const [activePosId, setActivePosId] = useState<string>("");
// //   const [activeSizeId, setActiveSizeId] = useState<string>("");

// //   const [mediaList, setMediaList] = useState<any>({ images: [], videos: [] });
// //   const [loading, setLoading] = useState(false);
// //   const [logs, setLogs] = useState<any>(null);

// //   // Form states
// //   const [newCatName, setNewCatName] = useState("");
// //   const [newPosName, setNewPosName] = useState("Upper"); // Upper/Middle/Lower
// //   const [newSizeName, setNewSizeName] = useState("Big Slider");
// //   const [assetId, setAssetId] = useState("");
// //   const [assetUrl, setAssetUrl] = useState("");
// //   const [assetPromo, setAssetPromo] = useState("");

// //   const BASE_URL = "https://live.bijliwalaaya.in/api/banner";
// //   const TOKEN = "super_secure_token";
// //   const headers = { "x-api-token": TOKEN };

// //   // --- API Engine ---
// //   const callApi = async (path: string, method: string, body: any, label: string, isFile: boolean = false) => {
// //     setLoading(true);
// //     try {
// //       const fetchOptions: RequestInit = { method, headers: { ...headers } };

// //       if (isFile) {
// //         const formData = new FormData();
// //         Object.keys(body).forEach(key => formData.append(key, body[key]));
// //         fetchOptions.body = formData;
// //       } else if (body) {
// //         (fetchOptions.headers as any)["Content-Type"] = "application/json";
// //         fetchOptions.body = JSON.stringify(body);
// //       }

// //       const res = await fetch(`${BASE_URL}${path}`, fetchOptions);
// //       const data = await res.json();
// //       setLogs({ label, path, method, status: res.status, body, response: data });

// //       if (res.ok && data.success) {
// //         toast.success(`${label} Success!`);
// //         return data;
// //       } else {
// //         toast.error(`${label}: ${data.message || data.error}`);
// //         return data;
// //       }
// //     } catch (e: any) {
// //       toast.error("Connection Failed");
// //       return null;
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   // Load all categories
// //   const loadData = async () => {
// //     const data = await callApi("/all", "GET", null, "Load Data");
// //     if (data?.data) {
// //       setCategories(data.data);
// //       if (data.data.length > 0 && !activeCatId) {
// //         setActiveCatId(data.data[0]._id);
// //       }
// //     }
// //   };

// //   // Load media for current size
// //   const loadGallery = async () => {
// //     if (activeCatId && activePosId && activeSizeId) {
// //       const data = await callApi(`/${activeCatId}/${activePosId}/${activeSizeId}/media?type=all`, "GET", null, "Load Media");
// //       if (data?.data) setMediaList(data.data);
// //     }
// //   };

// //   useEffect(() => { loadData(); }, []);
// //   useEffect(() => { loadGallery(); }, [activeCatId, activePosId, activeSizeId]);

// //   const activeCat = categories.find(c => c._id === activeCatId);
// //   const activePos = activeCat?.positions.find(p => p._id === activePosId);
// //   const activeSize = activePos?.sizes.find(s => s._id === activeSizeId);

// //   // Auto-select first position when category changes
// //   useEffect(() => {
// //     if (activeCat?.positions.length) {
// //       setActivePosId(activeCat.positions[0]._id);
// //     } else {
// //       setActivePosId("");
// //       setActiveSizeId("");
// //     }
// //   }, [activeCat]);

// //   // Auto-select first size when position changes
// //   useEffect(() => {
// //     if (activePos?.sizes.length) {
// //       setActiveSizeId(activePos.sizes[0]._id);
// //     } else {
// //       setActiveSizeId("");
// //     }
// //   }, [activePos]);

// //   // --- Actions ---
// //   const handleCreateCategory = async () => {
// //     if (!newCatName.trim()) return toast.error("Enter category name");
// //     const res = await callApi("/category", "POST", { category: newCatName }, "Add Category");
// //     if (res?.success) {
// //       loadData();
// //       setNewCatName("");
// //     }
// //   };

// //   const handleAddPosition = async () => {
// //     if (!activeCatId) return toast.error("Select a category first");
// //     const res = await callApi(`/${activeCatId}/position`, "POST", { bannerPosition: newPosName }, "Add Position");
// //     if (res?.success) {
// //       loadData();
// //       // Auto-select new position (last)
// //       const updatedCat = categories.find(c => c._id === activeCatId);
// //       if (updatedCat) {
// //         const newPos = updatedCat.positions[updatedCat.positions.length - 1];
// //         setActivePosId(newPos._id);
// //       }
// //     }
// //   };
// // const handleAddSize = async () => {
// //   if (!activeCat || !activePos)
// //     return toast.error("Select category and position first");

// //   const categoryName = encodeURIComponent(activeCat.category);
// //   const positionName = encodeURIComponent(activePos.bannerPosition);

// //   const res = await callApi(
// //     `/${categoryName}/${positionName}/size`,
// //     "POST",
// //     { bannerImageSize: newSizeName },
// //     "Add Size"
// //   );

// //   if (res?.success) {
// //     await loadData();
// //   }
// // };
// //   const handleDeployMedia = async (type: 'image' | 'video') => {
// //     if (!activeCatId || !activePosId || !activeSizeId) {
// //       return toast.error("Select category, position, and size first");
// //     }
// //     if (!assetUrl) return toast.error("Media URL required");
// //     if (!assetPromo) return toast.error("Promotional URL required");

// //     const payload: any = {
// //       categoryId: activeCatId,
// //       positionId: activePosId,
// //       sizeId: activeSizeId,
// //       promotionalUrl: assetPromo
// //     };

// //     if (type === 'image') {
// //       payload.imageUrl = assetUrl;
// //       if (assetId) payload.id = assetId;
// //     } else {
// //       payload.videoUrl = assetUrl;
// //       if (assetId) payload.id = assetId;
// //     }

// //     const res = await callApi(`/${activeCatId}/${activePosId}/${activeSizeId}/${type}`, "POST", payload, `Deploy ${type}`, false);
// //     if (res?.success) {
// //       loadGallery();
// //       setAssetUrl("");
// //       setAssetPromo("");
// //       setAssetId("");
// //     }
// //   };

// //   const handleDeleteMedia = async (type: 'image' | 'video', mediaId: string) => {
// //     if (!activeCatId || !activePosId || !activeSizeId) return;
// //     const res = await callApi(`/${activeCatId}/${activePosId}/${activeSizeId}/${type}/${mediaId}`, "DELETE", null, `Delete ${type}`, false);
// //     if (res?.success) loadGallery();
// //   };

// //   return (
// //     <div className="min-h-screen bg-slate-950 text-slate-300 font-sans flex">
// //       <Toaster position="top-right" toastOptions={{ style: { background: '#1e293b', color: '#fff' } }} />

// //       {/* Sidebar - Categories */}
// //       <aside className="w-72 bg-slate-900/50 border-r border-slate-800 flex flex-col">
// //         <div className="p-6 border-b border-slate-800">
// //           <h1 className="text-xl font-bold text-white flex items-center gap-2">
// //             <Cpu className="w-5 h-5 text-indigo-400" />
// //             <span>Banner<span className="text-indigo-400">Studio</span></span>
// //           </h1>
// //           <p className="text-xs text-slate-500 mt-1">v10 · Clean Admin</p>
// //         </div>

// //         <div className="flex-1 overflow-y-auto p-4 space-y-6">
// //           <div>
// //             <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
// //               <FolderPlus className="w-4 h-4" /> Categories
// //             </h2>
// //             <div className="space-y-1">
// //               {categories.map(cat => (
// //                 <button
// //                   key={cat._id}
// //                   onClick={() => setActiveCatId(cat._id)}
// //                   className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all ${
// //                     activeCatId === cat._id
// //                       ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
// //                       : 'hover:bg-slate-800/60 text-slate-400'
// //                   }`}
// //                 >
// //                   {cat.category}
// //                 </button>
// //               ))}
// //             </div>
// //           </div>

// //           <div className="pt-4 border-t border-slate-800">
// //             <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">New Category</h3>
// //             <div className="space-y-3">
// //               <input
// //                 type="text"
// //                 placeholder="Category name"
// //                 value={newCatName}
// //                 onChange={e => setNewCatName(e.target.value)}
// //                 className="w-full bg-slate-800/60 border border-slate-700 rounded-lg px-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
// //               />
// //               <button
// //                 onClick={handleCreateCategory}
// //                 className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 rounded-lg text-sm transition-colors flex items-center justify-center gap-2"
// //               >
// //                 <Plus className="w-4 h-4" /> Add Category
// //               </button>
// //             </div>
// //           </div>
// //         </div>
// //       </aside>

// //       {/* Main Content */}
// //       <main className="flex-1 overflow-y-auto p-8">
// //         {/* Header with current selection */}
// //         <div className="mb-8 flex items-center justify-between">
// //           <div>
// //             <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
// //               <span className={activeCat ? 'text-indigo-400' : ''}>{activeCat?.category || 'No Category'}</span>
// //               <ChevronRight className="w-4 h-4" />
// //               <span className={activePos ? 'text-indigo-400' : ''}>{activePos?.bannerPosition || 'No Position'}</span>
// //               <ChevronRight className="w-4 h-4" />
// //               <span className={activeSize ? 'text-indigo-400' : ''}>{activeSize?.bannerImageSize || 'No Size'}</span>
// //             </div>
// //             <h2 className="text-3xl font-bold text-white">Media Manager</h2>
// //           </div>
// //           {loading && <Loader2 className="w-5 h-5 animate-spin text-indigo-500" />}
// //         </div>

// //         {/* Three-column layout */}
// //         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
// //           {/* Positions Column */}
// //           <div className="bg-slate-900/30 border border-slate-800 rounded-2xl p-6">
// //             <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
// //               <MapPin className="w-5 h-5 text-emerald-400" /> Positions
// //               {activeCat && (
// //                 <span className="text-xs bg-slate-800 px-2 py-1 rounded-full text-slate-400 ml-2">
// //                   {activeCat.positions.length}
// //                 </span>
// //               )}
// //             </h3>

// //             {!activeCat ? (
// //               <p className="text-sm text-slate-500 italic">Select a category first</p>
// //             ) : (
// //               <>
// //                 <div className="space-y-2 mb-6 max-h-60 overflow-y-auto pr-2">
// //                   {activeCat.positions.map(pos => (
// //                     <button
// //                       key={pos._id}
// //                       onClick={() => setActivePosId(pos._id)}
// //                       className={`w-full text-left px-4 py-3 rounded-xl text-sm transition-all ${
// //                         activePosId === pos._id
// //                           ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/30'
// //                           : 'hover:bg-slate-800/60 text-slate-400'
// //                       }`}
// //                     >
// //                       {pos.bannerPosition}
// //                     </button>
// //                   ))}
// //                 </div>

// //                 <div className="border-t border-slate-800 pt-4">
// //                   <h4 className="text-xs font-semibold text-slate-400 uppercase mb-3">Add Position</h4>
// //                   <div className="space-y-3">
// //                     <select
// //                       value={newPosName}
// //                       onChange={e => setNewPosName(e.target.value)}
// //                       className="w-full bg-slate-800/60 border border-slate-700 rounded-lg px-4 py-2 text-sm text-white"
// //                     >
// //                       <option value="Upper">Upper</option>
// //                       <option value="Middle">Middle</option>
// //                       <option value="Lower">Lower</option>
// //                     </select>
// //                     <button
// //                       onClick={handleAddPosition}
// //                       className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 rounded-lg text-sm transition-colors flex items-center justify-center gap-2"
// //                     >
// //                       <Plus className="w-4 h-4" /> Add Position
// //                     </button>
// //                   </div>
// //                 </div>
// //               </>
// //             )}
// //           </div>

// //           {/* Sizes Column */}
// //           <div className="bg-slate-900/30 border border-slate-800 rounded-2xl p-6">
// //             <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
// //               <Layers className="w-5 h-5 text-amber-400" /> Sizes
// //               {activePos && (
// //                 <span className="text-xs bg-slate-800 px-2 py-1 rounded-full text-slate-400 ml-2">
// //                   {activePos.sizes.length}
// //                 </span>
// //               )}
// //             </h3>

// //             {!activePos ? (
// //               <p className="text-sm text-slate-500 italic">Select a position first</p>
// //             ) : (
// //               <>
// //                 <div className="space-y-2 mb-6 max-h-60 overflow-y-auto pr-2">
// //                   {activePos.sizes.map(sz => (
// //                     <button
// //                       key={sz._id}
// //                       onClick={() => setActiveSizeId(sz._id)}
// //                       className={`w-full text-left px-4 py-3 rounded-xl text-sm transition-all ${
// //                         activeSizeId === sz._id
// //                           ? 'bg-amber-600/20 text-amber-300 border border-amber-500/30'
// //                           : 'hover:bg-slate-800/60 text-slate-400'
// //                       }`}
// //                     >
// //                       {sz.bannerImageSize}
// //                     </button>
// //                   ))}
// //                 </div>

// //                 <div className="border-t border-slate-800 pt-4">
// //                   <h4 className="text-xs font-semibold text-slate-400 uppercase mb-3">Add Size</h4>
// //                   <div className="space-y-3">
// //                     <input
// //                       type="text"
// //                       placeholder="e.g. Big Slider"
// //                       value={newSizeName}
// //                       onChange={e => setNewSizeName(e.target.value)}
// //                       className="w-full bg-slate-800/60 border border-slate-700 rounded-lg px-4 py-2 text-sm text-white"
// //                     />
// //                     <button
// //                       onClick={handleAddSize}
// //                       className="w-full bg-amber-600 hover:bg-amber-700 text-white font-medium py-2 rounded-lg text-sm transition-colors flex items-center justify-center gap-2"
// //                     >
// //                       <Plus className="w-4 h-4" /> Add Size
// //                     </button>
// //                   </div>
// //                 </div>
// //               </>
// //             )}
// //           </div>

// //           {/* Media Upload Column */}
// //           <div className="bg-slate-900/30 border border-slate-800 rounded-2xl p-6">
// //             <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
// //               <Database className="w-5 h-5 text-indigo-400" /> Media Upload
// //             </h3>

// //             {!activeSize ? (
// //               <p className="text-sm text-slate-500 italic">Select a size first</p>
// //             ) : (
// //               <div className="space-y-4">
// //                 <div>
// //                   <label className="text-xs text-slate-400 block mb-1">Asset ID (optional)</label>
// //                   <input
// //                     type="text"
// //                     value={assetId}
// //                     onChange={e => setAssetId(e.target.value)}
// //                     className="w-full bg-slate-800/60 border border-slate-700 rounded-lg px-4 py-2 text-sm text-white"
// //                     placeholder="Enter ID if updating"
// //                   />
// //                 </div>
// //                 <div>
// //                   <label className="text-xs text-slate-400 block mb-1">Media URL *</label>
// //                   <input
// //                     type="url"
// //                     value={assetUrl}
// //                     onChange={e => setAssetUrl(e.target.value)}
// //                     className="w-full bg-slate-800/60 border border-slate-700 rounded-lg px-4 py-2 text-sm text-white"
// //                     placeholder="https://example.com/image.jpg"
// //                   />
// //                 </div>
// //                 <div>
// //                   <label className="text-xs text-slate-400 block mb-1">Promotional URL *</label>
// //                   <input
// //                     type="url"
// //                     value={assetPromo}
// //                     onChange={e => setAssetPromo(e.target.value)}
// //                     className="w-full bg-slate-800/60 border border-slate-700 rounded-lg px-4 py-2 text-sm text-white"
// //                     placeholder="https://example.com/offer"
// //                   />
// //                 </div>
// //                 <div className="flex gap-3 pt-2">
// //                   <button
// //                     onClick={() => handleDeployMedia('image')}
// //                     className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 rounded-lg text-sm transition-colors flex items-center justify-center gap-2"
// //                   >
// //                     <ImageIcon className="w-4 h-4" /> Add Image
// //                   </button>
// //                   <button
// //                     onClick={() => handleDeployMedia('video')}
// //                     className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 rounded-lg text-sm transition-colors flex items-center justify-center gap-2"
// //                   >
// //                     <VideoIcon className="w-4 h-4" /> Add Video
// //                   </button>
// //                 </div>
// //               </div>
// //             )}
// //           </div>
// //         </div>

// //         {/* Media Gallery */}
// //         <div className="mt-10 bg-slate-900/30 border border-slate-800 rounded-2xl p-6">
// //           <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
// //             <Monitor className="w-5 h-5 text-indigo-400" /> Gallery
// //             {activeSize && (
// //               <span className="text-xs bg-slate-800 px-2 py-1 rounded-full text-slate-400 ml-2">
// //                 {mediaList.images?.length || 0} images, {mediaList.videos?.length || 0} videos
// //               </span>
// //             )}
// //           </h3>

// //           {!activeSize ? (
// //             <p className="text-sm text-slate-500 italic py-8 text-center">Select a size to view media</p>
// //           ) : (
// //             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
// //               {mediaList.images?.map((img: any) => (
// //                 <div key={img._id} className="bg-slate-800/60 border border-slate-700 rounded-xl overflow-hidden group">
// //                   <div className="aspect-video bg-slate-900 relative">
// //                     <img src={img.imageUrl} alt="" className="w-full h-full object-cover" />
// //                     <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
// //                       <a href={img.imageUrl} target="_blank" rel="noopener" className="p-2 bg-slate-700 rounded-full hover:bg-slate-600"><Eye className="w-4 h-4" /></a>
// //                       <button onClick={() => handleDeleteMedia('image', img._id)} className="p-2 bg-red-600/80 rounded-full hover:bg-red-600"><Trash2 className="w-4 h-4" /></button>
// //                     </div>
// //                   </div>
// //                   <div className="p-3 flex justify-between items-center text-xs text-slate-400">
// //                     <span className="truncate">ID: {img._id.slice(-6)}</span>
// //                     <span className="bg-indigo-600/20 text-indigo-300 px-2 py-0.5 rounded-full">image</span>
// //                   </div>
// //                 </div>
// //               ))}
// //               {mediaList.videos?.map((vid: any) => (
// //                 <div key={vid._id} className="bg-slate-800/60 border border-slate-700 rounded-xl overflow-hidden group">
// //                   <div className="aspect-video bg-slate-900 flex items-center justify-center">
// //                     <VideoIcon className="w-10 h-10 text-slate-600" />
// //                     <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
// //                       <a href={vid.videoUrl} target="_blank" rel="noopener" className="p-2 bg-slate-700 rounded-full hover:bg-slate-600"><Eye className="w-4 h-4" /></a>
// //                       <button onClick={() => handleDeleteMedia('video', vid._id)} className="p-2 bg-red-600/80 rounded-full hover:bg-red-600"><Trash2 className="w-4 h-4" /></button>
// //                     </div>
// //                   </div>
// //                   <div className="p-3 flex justify-between items-center text-xs text-slate-400">
// //                     <span className="truncate">ID: {vid._id.slice(-6)}</span>
// //                     <span className="bg-purple-600/20 text-purple-300 px-2 py-0.5 rounded-full">video</span>
// //                   </div>
// //                 </div>
// //               ))}
// //               {mediaList.images?.length === 0 && mediaList.videos?.length === 0 && (
// //                 <p className="col-span-full text-center py-12 text-slate-500 italic">No media found for this size</p>
// //               )}
// //             </div>
// //           )}
// //         </div>

// //         {/* Live Feedback Console (minimal) */}
// //         {logs && (
// //           <div className="mt-8 bg-slate-900/70 border border-slate-800 rounded-xl p-4">
// //             <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
// //               <Terminal className="w-4 h-4" /> Last API Call
// //             </div>
// //             <div className="bg-slate-950 rounded-lg p-3 font-mono text-xs overflow-x-auto">
// //               <div className="text-indigo-400">{logs.method} {logs.path} → {logs.status}</div>
// //               <pre className="text-slate-500 mt-1">{JSON.stringify(logs.response, null, 2)}</pre>
// //             </div>
// //           </div>
// //         )}
// //       </main>
// //     </div>
// //   );
// // }

// "use client";

// import React, { useState, useEffect } from "react";
// import {
//   Plus,
//   Trash2,
//   Eye,
//   Image as ImageIcon,
//   Video as VideoIcon,
//   Monitor,
//   Activity,
//   ChevronRight,
//   Terminal,
//   Grid,
//   Layers,
//   Zap,
//   Loader2,
//   AlertCircle,
//   PlayCircle,
//   MapPin,
//   Cpu,
//   Database,
//   Search,
//   CheckCircle2,
//   X,
//   Save,
//   Edit,
//   FolderPlus,
//   LayoutGrid,
//   List,
//   PanelRight,
//   PanelLeft,
//   Upload,
// } from "lucide-react";
// import toast, { Toaster } from "react-hot-toast";

// // ==================== Types ====================
// interface Category {
//   _id: string;
//   category: string;
//   positions: Position[];
// }

// interface Position {
//   _id: string;
//   bannerPosition: string;
//   sizes: Size[];
// }

// interface Size {
//   _id: string;
//   bannerImageSize: string;
//   images: any[];
//   videos: any[];
// }

// // ==================== BannerStudio – Clean Admin UI ====================
// export default function BannerStudioV10() {
//   const [categories, setCategories] = useState<Category[]>([]);

//   // Active selection
//   const [activeCatId, setActiveCatId] = useState<string>("");
//   const [activePosId, setActivePosId] = useState<string>("");
//   const [activeSizeId, setActiveSizeId] = useState<string>("");

//   const [mediaList, setMediaList] = useState<any>({ images: [], videos: [] });
//   const [loading, setLoading] = useState(false);
//   const [logs, setLogs] = useState<any>(null);

//   // Form states
//   const [newCatName, setNewCatName] = useState("");
//   const [newPosName, setNewPosName] = useState("Upper");
//   const [newSizeName, setNewSizeName] = useState("Big Slider");
//   const [assetId, setAssetId] = useState("");
//   const [assetUrl, setAssetUrl] = useState("");
//   const [assetPromo, setAssetPromo] = useState("");
//   const [selectedFile, setSelectedFile] = useState<File | null>(null);
// const mapPosition = (pos: string) => pos.toLowerCase();

// const mapSize = (size: string) => {
//   return size.toLowerCase().replace(/\s+/g, "_");
// };
//   const BASE_URL = "https://live.bijliwalaaya.in/api/banner";
//   const TOKEN = "super_secure_token";
//   const headers = { "x-api-token": TOKEN };

//   // --- API Engine ---
//   const callApi = async (path: string, method: string, body: any, label: string, isFile: boolean = false) => {
//     setLoading(true);
//     try {
//       const fetchOptions: RequestInit = { method, headers: { ...headers } };


//      if (isFile) {
//   fetchOptions.body = body; // body already FormData
// }else if (body) {
//         (fetchOptions.headers as any)["Content-Type"] = "application/json";
//         fetchOptions.body = JSON.stringify(body);
//       }

//       const res = await fetch(`${BASE_URL}${path}`, fetchOptions);
//       const data = await res.json();
//       setLogs({ label, path, method, status: res.status, body, response: data });

//       if (res.ok && data.success) {
//         toast.success(`${label} Success!`);
//         return data;
//       } else {
//         toast.error(`${label}: ${data.message || data.error}`);
//         return data;
//       }
//     } catch (e: any) {
//       toast.error("Connection Failed");
//       return null;
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Load all categories
//   const loadData = async () => {
//     const data = await callApi("/all", "GET", null, "Load Data");
//     if (data?.data) {
//       setCategories(data.data);
//       if (data.data.length > 0 && !activeCatId) {
//         setActiveCatId(data.data[0]._id);
//       }
//     }
//   };

//   // Load media for current size
//   const loadGallery = async () => {
//     if (activeCatId && activePosId && activeSizeId) {
//       const data = await callApi(`/${activeCatId}/${activePosId}/${activeSizeId}/media?type=all`, "GET", null, "Load Media");
//       if (data?.data) setMediaList(data.data);
//     }
//   };

//   useEffect(() => { loadData(); }, []);
//   useEffect(() => { loadGallery(); }, [activeCatId, activePosId, activeSizeId]);

//   const activeCat = categories.find(c => c._id === activeCatId);
//   const activePos = activeCat?.positions.find(p => p._id === activePosId);
//   const activeSize = activePos?.sizes.find(s => s._id === activeSizeId);

//   // Auto-select first position when category changes
//   useEffect(() => {
//     if (activeCat?.positions.length) {
//       setActivePosId(activeCat.positions[0]._id);
//     } else {
//       setActivePosId("");
//       setActiveSizeId("");
//     }
//   }, [activeCat]);

//   // Auto-select first size when position changes
//   useEffect(() => {
//     if (activePos?.sizes.length) {
//       setActiveSizeId(activePos.sizes[0]._id);
//     } else {
//       setActiveSizeId("");
//     }
//   }, [activePos]);

//   // --- Actions ---
//   const handleCreateCategory = async () => {
//     if (!newCatName.trim()) return toast.error("Enter category name");
//     const res = await callApi("/category", "POST", { category: newCatName }, "Add Category");
//     if (res?.success) {
//       loadData();
//       setNewCatName("");
//     }
//   };

//   const handleAddPosition = async () => {
//     if (!activeCatId) return toast.error("Select a category first");
//     const res = await callApi(`/${activeCatId}/position`, "POST", { bannerPosition: newPosName }, "Add Position");
//     if (res?.success) {
//       loadData();
//       const updatedCat = categories.find(c => c._id === activeCatId);
//       if (updatedCat) {
//         const newPos = updatedCat.positions[updatedCat.positions.length - 1];
//         setActivePosId(newPos._id);
//       }
//     }
//   };

//   const handleAddSize = async () => {
//     if (!activeCat || !activePos) return toast.error("Select category and position first");
//     const categoryName = encodeURIComponent(activeCat.category);
//     const positionName = encodeURIComponent(activePos.bannerPosition);
//     const res = await callApi(
//       `/${categoryName}/${positionName}/size`,
//       "POST",
//       { bannerImageSize: newSizeName },
//       "Add Size"
//     );
//     if (res?.success) {
//       await loadData();
//     }
//   };

//   // const handleDeployMedia = async (type: 'image' | 'video') => {
//   //   if (!activeCatId || !activePosId || !activeSizeId) {
//   //     return toast.error("Select category, position, and size first");
//   //   }

//   //   // If file is selected, use FormData
//   //   if (selectedFile) {
//   //     const formData: any = {
//   //       categoryId: activeCatId,
//   //       positionId: activePosId,
//   //       sizeId: activeSizeId,
//   //       promotionalUrl: assetPromo,
//   //       [type]: selectedFile, // 'image' or 'video' field with file
//   //     };
//   //     if (assetId) formData.id = assetId;

//   //     const res = await callApi(
//   //       `/${activeCatId}/${activePosId}/${activeSizeId}/${type}`,
//   //       "POST",
//   //       formData,
//   //       `Upload ${type}`,
//   //       true // isFile = true
//   //     );
//   //     if (res?.success) {
//   //       loadGallery();
//   //       setSelectedFile(null);
//   //       setAssetUrl("");
//   //       setAssetPromo("");
//   //       setAssetId("");
//   //       // Reset file input via ref if needed (optional)
//   //     }
//   //     return;
//   //   }

//   //   // Otherwise use URL (JSON)
//   //   if (!assetUrl) return toast.error("Provide either a URL or select a file");
//   //   if (!assetPromo) return toast.error("Promotional URL required");

//   //   const payload: any = {
//   //     categoryId: activeCatId,
//   //     positionId: activePosId,
//   //     sizeId: activeSizeId,
//   //     promotionalUrl: assetPromo,
//   //   };

//   //   if (type === 'image') {
//   //     payload.imageUrl = assetUrl;
//   //     if (assetId) payload.id = assetId;
//   //   } else {
//   //     payload.videoUrl = assetUrl;
//   //     if (assetId) payload.id = assetId;
//   //   }

//   //   const res = await callApi(
//   //     `/${activeCatId}/${activePosId}/${activeSizeId}/${type}`,
//   //     "POST",
//   //     payload,
//   //     `Deploy ${type}`,
//   //     false // JSON
//   //   );
//   //   if (res?.success) {
//   //     loadGallery();
//   //     setAssetUrl("");
//   //     setAssetPromo("");
//   //     setAssetId("");
//   //   }
//   // };

// const handleDeployMedia = async (type: "image" | "video") => {
//   if (!activeCat || !activePos || !activeSize)
//     return toast.error("Select category, position, and size first");

//   if (!assetPromo)
//     return toast.error("Promotional URL required");

//   const categoryId = activeCat.category; // backend expects string
//   const positionId = mapPosition(activePos.bannerPosition); // lower case
//   const sizeId = mapSize(activeSize.bannerImageSize); // underscore format

//   const route = `/${encodeURIComponent(activeCat.category)}/${encodeURIComponent(activePos.bannerPosition)}/${encodeURIComponent(activeSize.bannerImageSize)}/${type}`;

//   // FILE UPLOAD
//   if (selectedFile) {
//     const formData = new FormData();
//     formData.append("categoryId", categoryId);
//     formData.append("positionId", positionId);
//     formData.append("sizeId", sizeId);
//     formData.append("promotionalUrl", assetPromo);
//     formData.append(type, selectedFile);

//     const res = await callApi(route, "POST", formData, `Upload ${type}`, true);

//     if (res?.success) {
//       loadGallery();
//       setSelectedFile(null);
//       setAssetPromo("");
//     }
//     return;
//   }

//   // URL UPLOAD
//   if (!assetUrl) return toast.error("Provide URL");

//   const payload: any = {
//     categoryId,
//     positionId,
//     sizeId,
//     promotionalUrl: assetPromo,
//   };

//   if (type === "image") {
//     payload.imageUrl = assetUrl;
//   } else {
//     payload.videoUrl = assetUrl;
//   }

//   const res = await callApi(route, "POST", payload, `Deploy ${type}`, false);

//   if (res?.success) {
//     loadGallery();
//     setAssetUrl("");
//     setAssetPromo("");
//   }
// };

//   const handleDeleteMedia = async (type: 'image' | 'video', mediaId: string) => {
//     if (!activeCatId || !activePosId || !activeSizeId) return;
//     const res = await callApi(`/${activeCatId}/${activePosId}/${activeSizeId}/${type}/${mediaId}`, "DELETE", null, `Delete ${type}`, false);
//     if (res?.success) loadGallery();
//   };

//   return (
//     <div className="min-h-screen bg-slate-950 text-slate-300 font-sans flex">
//       <Toaster position="top-right" toastOptions={{ style: { background: '#1e293b', color: '#fff' } }} />

//       {/* Sidebar - Categories */}
//       <aside className="w-72 bg-slate-900/50 border-r border-slate-800 flex flex-col">
//         <div className="p-6 border-b border-slate-800">
//           <h1 className="text-xl font-bold text-white flex items-center gap-2">
//             <Cpu className="w-5 h-5 text-indigo-400" />
//             <span>Banner<span className="text-indigo-400">Studio</span></span>
//           </h1>
//           <p className="text-xs text-slate-500 mt-1">v10 · Clean Admin</p>
//         </div>

//         <div className="flex-1 overflow-y-auto p-4 space-y-6">
//           <div>
//             <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
//               <FolderPlus className="w-4 h-4" /> Categories
//             </h2>
//             <div className="space-y-1">
//               {categories.map(cat => (
//                 <button
//                   key={cat._id}
//                   onClick={() => setActiveCatId(cat._id)}
//                   className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all ${
//                     activeCatId === cat._id
//                       ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
//                       : 'hover:bg-slate-800/60 text-slate-400'
//                   }`}
//                 >
//                   {cat.category}
//                 </button>
//               ))}
//             </div>
//           </div>

//           <div className="pt-4 border-t border-slate-800">
//             <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">New Category</h3>
//             <div className="space-y-3">
//               <input
//                 type="text"
//                 placeholder="Category name"
//                 value={newCatName}
//                 onChange={e => setNewCatName(e.target.value)}
//                 className="w-full bg-slate-800/60 border border-slate-700 rounded-lg px-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//               />
//               <button
//                 onClick={handleCreateCategory}
//                 className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 rounded-lg text-sm transition-colors flex items-center justify-center gap-2"
//               >
//                 <Plus className="w-4 h-4" /> Add Category
//               </button>
//             </div>
//           </div>
//         </div>
//       </aside>

//       {/* Main Content */}
//       <main className="flex-1 overflow-y-auto p-8">
//         {/* Header with current selection */}
//         <div className="mb-8 flex items-center justify-between">
//           <div>
//             <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
//               <span className={activeCat ? 'text-indigo-400' : ''}>{activeCat?.category || 'No Category'}</span>
//               <ChevronRight className="w-4 h-4" />
//               <span className={activePos ? 'text-indigo-400' : ''}>{activePos?.bannerPosition || 'No Position'}</span>
//               <ChevronRight className="w-4 h-4" />
//               <span className={activeSize ? 'text-indigo-400' : ''}>{activeSize?.bannerImageSize || 'No Size'}</span>
//             </div>
//             <h2 className="text-3xl font-bold text-white">Media Manager</h2>
//           </div>
//           {loading && <Loader2 className="w-5 h-5 animate-spin text-indigo-500" />}
//         </div>

//         {/* Three-column layout */}
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//           {/* Positions Column */}
//           <div className="bg-slate-900/30 border border-slate-800 rounded-2xl p-6">
//             <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
//               <MapPin className="w-5 h-5 text-emerald-400" /> Positions
//               {activeCat && (
//                 <span className="text-xs bg-slate-800 px-2 py-1 rounded-full text-slate-400 ml-2">
//                   {activeCat.positions.length}
//                 </span>
//               )}
//             </h3>

//             {!activeCat ? (
//               <p className="text-sm text-slate-500 italic">Select a category first</p>
//             ) : (
//               <>
//                 <div className="space-y-2 mb-6 max-h-60 overflow-y-auto pr-2">
//                   {activeCat.positions.map(pos => (
//                     <button
//                       key={pos._id}
//                       onClick={() => setActivePosId(pos._id)}
//                       className={`w-full text-left px-4 py-3 rounded-xl text-sm transition-all ${
//                         activePosId === pos._id
//                           ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/30'
//                           : 'hover:bg-slate-800/60 text-slate-400'
//                       }`}
//                     >
//                       {pos.bannerPosition}
//                     </button>
//                   ))}
//                 </div>

//                 <div className="border-t border-slate-800 pt-4">
//                   <h4 className="text-xs font-semibold text-slate-400 uppercase mb-3">Add Position</h4>
//                   <div className="space-y-3">
//                     <select
//                       value={newPosName}
//                       onChange={e => setNewPosName(e.target.value)}
//                       className="w-full bg-slate-800/60 border border-slate-700 rounded-lg px-4 py-2 text-sm text-white"
//                     >
//                       <option value="Upper">Upper</option>
//                       <option value="Middle">Middle</option>
//                       <option value="Lower">Lower</option>
//                     </select>
//                     <button
//                       onClick={handleAddPosition}
//                       className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 rounded-lg text-sm transition-colors flex items-center justify-center gap-2"
//                     >
//                       <Plus className="w-4 h-4" /> Add Position
//                     </button>
//                   </div>
//                 </div>
//               </>
//             )}
//           </div>

//           {/* Sizes Column */}
//           <div className="bg-slate-900/30 border border-slate-800 rounded-2xl p-6">
//             <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
//               <Layers className="w-5 h-5 text-amber-400" /> Sizes
//               {activePos && (
//                 <span className="text-xs bg-slate-800 px-2 py-1 rounded-full text-slate-400 ml-2">
//                   {activePos.sizes.length}
//                 </span>
//               )}
//             </h3>

//             {!activePos ? (
//               <p className="text-sm text-slate-500 italic">Select a position first</p>
//             ) : (
//               <>
//                 <div className="space-y-2 mb-6 max-h-60 overflow-y-auto pr-2">
//                   {activePos.sizes.map(sz => (
//                     <button
//                       key={sz._id}
//                       onClick={() => setActiveSizeId(sz._id)}
//                       className={`w-full text-left px-4 py-3 rounded-xl text-sm transition-all ${
//                         activeSizeId === sz._id
//                           ? 'bg-amber-600/20 text-amber-300 border border-amber-500/30'
//                           : 'hover:bg-slate-800/60 text-slate-400'
//                       }`}
//                     >
//                       {sz.bannerImageSize}
//                     </button>
//                   ))}
//                 </div>

//                 <div className="border-t border-slate-800 pt-4">
//                   <h4 className="text-xs font-semibold text-slate-400 uppercase mb-3">Add Size</h4>
//                   <div className="space-y-3">
//                     <input
//                       type="text"
//                       placeholder="e.g. Big Slider"
//                       value={newSizeName}
//                       onChange={e => setNewSizeName(e.target.value)}
//                       className="w-full bg-slate-800/60 border border-slate-700 rounded-lg px-4 py-2 text-sm text-white"
//                     />
//                     <button
//                       onClick={handleAddSize}
//                       className="w-full bg-amber-600 hover:bg-amber-700 text-white font-medium py-2 rounded-lg text-sm transition-colors flex items-center justify-center gap-2"
//                     >
//                       <Plus className="w-4 h-4" /> Add Size
//                     </button>
//                   </div>
//                 </div>
//               </>
//             )}
//           </div>

//           {/* Media Upload Column */}
//           <div className="bg-slate-900/30 border border-slate-800 rounded-2xl p-6">
//             <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
//               <Database className="w-5 h-5 text-indigo-400" /> Media Upload
//             </h3>

//             {!activeSize ? (
//               <p className="text-sm text-slate-500 italic">Select a size first</p>
//             ) : (
//               <div className="space-y-4">
//                 <div>
//                   <label className="text-xs text-slate-400 block mb-1">Asset ID (optional)</label>
//                   <input
//                     type="text"
//                     value={assetId}
//                     onChange={e => setAssetId(e.target.value)}
//                     className="w-full bg-slate-800/60 border border-slate-700 rounded-lg px-4 py-2 text-sm text-white"
//                     placeholder="Enter ID if updating"
//                   />
//                 </div>

//                 {/* File Upload */}
//                 <div>
//                   <label className="text-xs text-slate-400 block mb-1">Upload File (optional)</label>
//                   <div className="flex items-center gap-2">
//                     <label className="flex-1 cursor-pointer">
//                       <div className="bg-slate-800/60 border border-slate-700 rounded-lg px-4 py-2 text-sm text-slate-400 hover:bg-slate-700/50 transition-colors flex items-center gap-2">
//                         <Upload className="w-4 h-4" />
//                         {selectedFile ? selectedFile.name : "Choose file..."}
//                       </div>
//                       <input
//                         type="file"
//                         accept="image/*,video/*"
//                         onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
//                         className="hidden"
//                       />
//                     </label>
//                     {selectedFile && (
//                       <button
//                         onClick={() => setSelectedFile(null)}
//                         className="p-2 bg-slate-700 rounded-lg hover:bg-red-600/50 transition-colors"
//                       >
//                         <X className="w-4 h-4" />
//                       </button>
//                     )}
//                   </div>
//                 </div>

//                 {/* OR separator */}
//                 <div className="relative">
//                   <div className="absolute inset-0 flex items-center">
//                     <div className="w-full border-t border-slate-700"></div>
//                   </div>
//                   <div className="relative flex justify-center text-xs">
//                     <span className="px-2 bg-slate-900 text-slate-500">OR</span>
//                   </div>
//                 </div>

//                 {/* URL Input (if no file) */}
//                 <div>
//                   <label className="text-xs text-slate-400 block mb-1">Media URL (if no file)</label>
//                   <input
//                     type="url"
//                     value={assetUrl}
//                     onChange={e => setAssetUrl(e.target.value)}
//                     className="w-full bg-slate-800/60 border border-slate-700 rounded-lg px-4 py-2 text-sm text-white"
//                     placeholder="https://example.com/image.jpg"
//                     disabled={!!selectedFile}
//                   />
//                 </div>

//                 <div>
//                   <label className="text-xs text-slate-400 block mb-1">Promotional URL *</label>
//                   <input
//                     type="url"
//                     value={assetPromo}
//                     onChange={e => setAssetPromo(e.target.value)}
//                     className="w-full bg-slate-800/60 border border-slate-700 rounded-lg px-4 py-2 text-sm text-white"
//                     placeholder="https://example.com/offer"
//                   />
//                 </div>

//                 <div className="flex gap-3 pt-2">
//                   <button
//                     onClick={() => handleDeployMedia('image')}
//                     className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 rounded-lg text-sm transition-colors flex items-center justify-center gap-2"
//                   >
//                     <ImageIcon className="w-4 h-4" /> Add Image
//                   </button>
//                   <button
//                     onClick={() => handleDeployMedia('video')}
//                     className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 rounded-lg text-sm transition-colors flex items-center justify-center gap-2"
//                   >
//                     <VideoIcon className="w-4 h-4" /> Add Video
//                   </button>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Media Gallery */}
//         <div className="mt-10 bg-slate-900/30 border border-slate-800 rounded-2xl p-6">
//           <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
//             <Monitor className="w-5 h-5 text-indigo-400" /> Gallery
//             {activeSize && (
//               <span className="text-xs bg-slate-800 px-2 py-1 rounded-full text-slate-400 ml-2">
//                 {mediaList.images?.length || 0} images, {mediaList.videos?.length || 0} videos
//               </span>
//             )}
//           </h3>

//           {!activeSize ? (
//             <p className="text-sm text-slate-500 italic py-8 text-center">Select a size to view media</p>
//           ) : (
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//               {mediaList.images?.map((img: any) => (
//                 <div key={img._id} className="bg-slate-800/60 border border-slate-700 rounded-xl overflow-hidden group">
//                   <div className="aspect-video bg-slate-900 relative">
//                     <img src={img.imageUrl} alt="" className="w-full h-full object-cover" />
//                     <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
//                       <a href={img.imageUrl} target="_blank" rel="noopener" className="p-2 bg-slate-700 rounded-full hover:bg-slate-600"><Eye className="w-4 h-4" /></a>
//                       <button onClick={() => handleDeleteMedia('image', img._id)} className="p-2 bg-red-600/80 rounded-full hover:bg-red-600"><Trash2 className="w-4 h-4" /></button>
//                     </div>
//                   </div>
//                   <div className="p-3 flex justify-between items-center text-xs text-slate-400">
//                     <span className="truncate">ID: {img._id.slice(-6)}</span>
//                     <span className="bg-indigo-600/20 text-indigo-300 px-2 py-0.5 rounded-full">image</span>
//                   </div>
//                 </div>
//               ))}
//               {mediaList.videos?.map((vid: any) => (
//                 <div key={vid._id} className="bg-slate-800/60 border border-slate-700 rounded-xl overflow-hidden group">
//                   <div className="aspect-video bg-slate-900 flex items-center justify-center">
//                     <VideoIcon className="w-10 h-10 text-slate-600" />
//                     <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
//                       <a href={vid.videoUrl} target="_blank" rel="noopener" className="p-2 bg-slate-700 rounded-full hover:bg-slate-600"><Eye className="w-4 h-4" /></a>
//                       <button onClick={() => handleDeleteMedia('video', vid._id)} className="p-2 bg-red-600/80 rounded-full hover:bg-red-600"><Trash2 className="w-4 h-4" /></button>
//                     </div>
//                   </div>
//                   <div className="p-3 flex justify-between items-center text-xs text-slate-400">
//                     <span className="truncate">ID: {vid._id.slice(-6)}</span>
//                     <span className="bg-purple-600/20 text-purple-300 px-2 py-0.5 rounded-full">video</span>
//                   </div>
//                 </div>
//               ))}
//               {mediaList.images?.length === 0 && mediaList.videos?.length === 0 && (
//                 <p className="col-span-full text-center py-12 text-slate-500 italic">No media found for this size</p>
//               )}
//             </div>
//           )}
//         </div>

//         {/* Live Feedback Console (minimal) */}
//         {logs && (
//           <div className="mt-8 bg-slate-900/70 border border-slate-800 rounded-xl p-4">
//             <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
//               <Terminal className="w-4 h-4" /> Last API Call
//             </div>
//             <div className="bg-slate-950 rounded-lg p-3 font-mono text-xs overflow-x-auto">
//               <div className="text-indigo-400">{logs.method} {logs.path} → {logs.status}</div>
//               <pre className="text-slate-500 mt-1">{JSON.stringify(logs.response, null, 2)}</pre>
//             </div>
//           </div>
//         )}
//       </main>
//     </div>
//   );
// }
"use client";

import React, { useState, useEffect } from "react";
import {
  Plus,
  Trash2,
  Eye,
  Image as ImageIcon,
  Video as VideoIcon,
  Monitor,
  Activity,
  ChevronRight,
  Terminal,
  Layers,
  Zap,
  Loader2,
  AlertCircle,
  PlayCircle,
  MapPin,
  Cpu,
  Database,
  FolderPlus,
  Upload,
  X,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

// ==================== Types ====================
interface Category {
  _id: string;
  category: string;
  positions: Position[];
}

interface Position {
  _id: string;
  bannerPosition: string; // "Upper", "Middle", "Lower"
  sizes: Size[];
}

interface Size {
  _id: string;
  bannerImageSize: string; // e.g. "Big Slider", "Card", "Small Slider"
  images: any[];
  videos: any[];
}

// ==================== BannerStudio – Clean Admin UI ====================
export default function BannerStudioV10() {
  const [categories, setCategories] = useState<Category[]>([]);

  // Active selection
  const [activeCatId, setActiveCatId] = useState<string>("");
  const [activePosId, setActivePosId] = useState<string>("");
  const [activeSizeId, setActiveSizeId] = useState<string>("");

  const [mediaList, setMediaList] = useState<any>({ images: [], videos: [] });
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState<any>(null);

  // Form states
  const [newCatName, setNewCatName] = useState("");
  const [newPosName, setNewPosName] = useState("Upper");
  // Size options match the enum values after mapping
  const sizeOptions = ["Big Slider", "Card", "Small Slider"];
  const [newSizeName, setNewSizeName] = useState(sizeOptions[0]);
  const [assetId, setAssetId] = useState("");
  const [assetUrl, setAssetUrl] = useState("");
  const [assetPromo, setAssetPromo] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Mapping functions to match backend enums
  const mapPosition = (pos: string) => pos.toLowerCase(); // "Upper" -> "upper"
  const mapSize = (size: string) => {
    return size.toLowerCase().replace(/\s+/g, "_"); // "Big Slider" -> "big_slider"
  };

  const BASE_URL = "https://live.bijliwalaaya.in/api/banner";
  const TOKEN = "super_secure_token";
  const headers = { "x-api-token": TOKEN };

  // --- API Engine ---
  const callApi = async (path: string, method: string, body: any, label: string, isFile: boolean = false) => {
    setLoading(true);
    try {
      const fetchOptions: RequestInit = { method, headers: { ...headers } };

      if (isFile) {
        fetchOptions.body = body; // body is FormData
      } else if (body) {
        (fetchOptions.headers as any)["Content-Type"] = "application/json";
        fetchOptions.body = JSON.stringify(body);
      }

      const res = await fetch(`${BASE_URL}${path}`, fetchOptions);
      const data = await res.json();
      setLogs({ label, path, method, status: res.status, body, response: data });

      if (res.ok && data.success) {
        toast.success(`${label} Success!`);
        return data;
      } else {
        toast.error(`${label}: ${data.message || data.error}`);
        return data;
      }
    } catch (e: any) {
      toast.error("Connection Failed");
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Load all categories
  const loadData = async () => {
    const data = await callApi("/all", "GET", null, "Load Data");
    if (data?.data) {
      setCategories(data.data);
      if (data.data.length > 0 && !activeCatId) {
        setActiveCatId(data.data[0]._id);
      }
    }
  };

  // Load media for current size
  const loadGallery = async () => {
    if (activeCatId && activePosId && activeSizeId) {
      const data = await callApi(`/${activeCatId}/${activePosId}/${activeSizeId}/media?type=all`, "GET", null, "Load Media");
      if (data?.data) setMediaList(data.data);
    }
  };

  useEffect(() => { loadData(); }, []);
  useEffect(() => { loadGallery(); }, [activeCatId, activePosId, activeSizeId]);

  const activeCat = categories.find(c => c._id === activeCatId);
  const activePos = activeCat?.positions.find(p => p._id === activePosId);
  const activeSize = activePos?.sizes.find(s => s._id === activeSizeId);

  // Auto-select first position when category changes
  useEffect(() => {
    if (activeCat?.positions.length) {
      setActivePosId(activeCat.positions[0]._id);
    } else {
      setActivePosId("");
      setActiveSizeId("");
    }
  }, [activeCat]);

  // Auto-select first size when position changes
  useEffect(() => {
    if (activePos?.sizes.length) {
      setActiveSizeId(activePos.sizes[0]._id);
    } else {
      setActiveSizeId("");
    }
  }, [activePos]);

  // --- Actions ---
  const handleCreateCategory = async () => {
    if (!newCatName.trim()) return toast.error("Enter category name");
    const res = await callApi("/category", "POST", { category: newCatName }, "Add Category");
    if (res?.success) {
      loadData();
      setNewCatName("");
    }
  };

  const handleAddPosition = async () => {
    if (!activeCatId) return toast.error("Select a category first");
    const res = await callApi(`/${activeCatId}/position`, "POST", { bannerPosition: newPosName }, "Add Position");
    if (res?.success) {
      loadData();
      const updatedCat = categories.find(c => c._id === activeCatId);
      if (updatedCat) {
        const newPos = updatedCat.positions[updatedCat.positions.length - 1];
        setActivePosId(newPos._id);
      }
    }
  };

  const handleAddSize = async () => {
    if (!activeCat || !activePos) return toast.error("Select category and position first");
    const categoryName = encodeURIComponent(activeCat.category);
    const positionName = encodeURIComponent(activePos.bannerPosition);
    const res = await callApi(
      `/${categoryName}/${positionName}/size`,
      "POST",
      { bannerImageSize: newSizeName },
      "Add Size"
    );
    if (res?.success) {
      await loadData();
    }
  };

  const handleDeployMedia = async (type: "image" | "video") => {
    if (!activeCat || !activePos || !activeSize)
      return toast.error("Select category, position, and size first");

    if (!assetPromo) return toast.error("Promotional URL required");

    // Use the mapped enum values for positionId and sizeId
    const categoryId = activeCat.category; // string
    const positionId = mapPosition(activePos.bannerPosition); // "upper"/"middle"/"lower"
    const sizeId = mapSize(activeSize.bannerImageSize); // "big_slider"/"card"/"small_slider"

    const route = `/${encodeURIComponent(activeCat.category)}/${encodeURIComponent(activePos.bannerPosition)}/${encodeURIComponent(activeSize.bannerImageSize)}/${type}`;

    // FILE UPLOAD
    if (selectedFile) {
      const formData = new FormData();
      formData.append("categoryId", categoryId);
      formData.append("positionId", positionId);
      formData.append("sizeId", sizeId);
      formData.append("promotionalUrl", assetPromo);
      formData.append(type, selectedFile); // "image" or "video" field

      const res = await callApi(route, "POST", formData, `Upload ${type}`, true);

      if (res?.success) {
        loadGallery();
        setSelectedFile(null);
        setAssetPromo("");
        setAssetId("");
      }
      return;
    }

    // URL UPLOAD
    if (!assetUrl) return toast.error("Provide a URL or select a file");

    const payload: any = {
      categoryId,
      positionId,
      sizeId,
      promotionalUrl: assetPromo,
    };

    if (type === "image") {
      payload.imageUrl = assetUrl;
    } else {
      payload.videoUrl = assetUrl;
    }
    if (assetId) payload.id = assetId; // optional, if backend supports

    const res = await callApi(route, "POST", payload, `Deploy ${type}`, false);

    if (res?.success) {
      loadGallery();
      setAssetUrl("");
      setAssetPromo("");
      setAssetId("");
    }
  };

  const handleDeleteMedia = async (type: 'image' | 'video', mediaId: string) => {
    if (!activeCatId || !activePosId || !activeSizeId) return;
    const res = await callApi(`/${activeCatId}/${activePosId}/${activeSizeId}/${type}/${mediaId}`, "DELETE", null, `Delete ${type}`, false);
    if (res?.success) loadGallery();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 font-sans flex">
      <Toaster position="top-right" toastOptions={{ style: { background: '#1e293b', color: '#fff' } }} />

      {/* Sidebar - Categories */}
      <aside className="w-72 bg-slate-900/50 border-r border-slate-800 flex flex-col">
        <div className="p-6 border-b border-slate-800">
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Cpu className="w-5 h-5 text-indigo-400" />
            <span>Banner<span className="text-indigo-400">Studio</span></span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">v10 · Clean Admin</p>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          <div>
            <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
              <FolderPlus className="w-4 h-4" /> Categories
            </h2>
            <div className="space-y-1">
              {categories.map(cat => (
                <button
                  key={cat._id}
                  onClick={() => setActiveCatId(cat._id)}
                  className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    activeCatId === cat._id
                      ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
                      : 'hover:bg-slate-800/60 text-slate-400'
                  }`}
                >
                  {cat.category}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">New Category</h3>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Category name"
                value={newCatName}
                onChange={e => setNewCatName(e.target.value)}
                className="w-full bg-slate-800/60 border border-slate-700 rounded-lg px-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                onClick={handleCreateCategory}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 rounded-lg text-sm transition-colors flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" /> Add Category
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-8">
        {/* Header with current selection */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
              <span className={activeCat ? 'text-indigo-400' : ''}>{activeCat?.category || 'No Category'}</span>
              <ChevronRight className="w-4 h-4" />
              <span className={activePos ? 'text-indigo-400' : ''}>{activePos?.bannerPosition || 'No Position'}</span>
              <ChevronRight className="w-4 h-4" />
              <span className={activeSize ? 'text-indigo-400' : ''}>{activeSize?.bannerImageSize || 'No Size'}</span>
            </div>
            <h2 className="text-3xl font-bold text-white">Media Manager</h2>
          </div>
          {loading && <Loader2 className="w-5 h-5 animate-spin text-indigo-500" />}
        </div>

        {/* Three-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Positions Column */}
          <div className="bg-slate-900/30 border border-slate-800 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-emerald-400" /> Positions
              {activeCat && (
                <span className="text-xs bg-slate-800 px-2 py-1 rounded-full text-slate-400 ml-2">
                  {activeCat.positions.length}
                </span>
              )}
            </h3>

            {!activeCat ? (
              <p className="text-sm text-slate-500 italic">Select a category first</p>
            ) : (
              <>
                <div className="space-y-2 mb-6 max-h-60 overflow-y-auto pr-2">
                  {activeCat.positions.map(pos => (
                    <button
                      key={pos._id}
                      onClick={() => setActivePosId(pos._id)}
                      className={`w-full text-left px-4 py-3 rounded-xl text-sm transition-all ${
                        activePosId === pos._id
                          ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/30'
                          : 'hover:bg-slate-800/60 text-slate-400'
                      }`}
                    >
                      {pos.bannerPosition}
                    </button>
                  ))}
                </div>

                <div className="border-t border-slate-800 pt-4">
                  <h4 className="text-xs font-semibold text-slate-400 uppercase mb-3">Add Position</h4>
                  <div className="space-y-3">
                    <select
                      value={newPosName}
                      onChange={e => setNewPosName(e.target.value)}
                      className="w-full bg-slate-800/60 border border-slate-700 rounded-lg px-4 py-2 text-sm text-white"
                    >
                      <option value="upper">Upper</option>
                      <option value="middle">Middle</option>
                      <option value="lower">Lower</option>
                    </select>
                    <button
                      onClick={handleAddPosition}
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 rounded-lg text-sm transition-colors flex items-center justify-center gap-2"
                    >
                      <Plus className="w-4 h-4" /> Add Position
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Sizes Column */}
          <div className="bg-slate-900/30 border border-slate-800 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Layers className="w-5 h-5 text-amber-400" /> Sizes
              {activePos && (
                <span className="text-xs bg-slate-800 px-2 py-1 rounded-full text-slate-400 ml-2">
                  {activePos.sizes.length}
                </span>
              )}
            </h3>

            {!activePos ? (
              <p className="text-sm text-slate-500 italic">Select a position first</p>
            ) : (
              <>
                <div className="space-y-2 mb-6 max-h-60 overflow-y-auto pr-2">
                  {activePos.sizes.map(sz => (
                    <button
                      key={sz._id}
                      onClick={() => setActiveSizeId(sz._id)}
                      className={`w-full text-left px-4 py-3 rounded-xl text-sm transition-all ${
                        activeSizeId === sz._id
                          ? 'bg-amber-600/20 text-amber-300 border border-amber-500/30'
                          : 'hover:bg-slate-800/60 text-slate-400'
                      }`}
                    >
                      {sz.bannerImageSize}
                    </button>
                  ))}
                </div>

                <div className="border-t border-slate-800 pt-4">
                  <h4 className="text-xs font-semibold text-slate-400 uppercase mb-3">Add Size</h4>
                  <div className="space-y-3">
                    <select
                      value={newSizeName}
                      onChange={e => setNewSizeName(e.target.value)}
                      className="w-full bg-slate-800/60 border border-slate-700 rounded-lg px-4 py-2 text-sm text-white"
                    >
                      {sizeOptions.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                    <button
                      onClick={handleAddSize}
                      className="w-full bg-amber-600 hover:bg-amber-700 text-white font-medium py-2 rounded-lg text-sm transition-colors flex items-center justify-center gap-2"
                    >
                      <Plus className="w-4 h-4" /> Add Size
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Media Upload Column */}
          <div className="bg-slate-900/30 border border-slate-800 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Database className="w-5 h-5 text-indigo-400" /> Media Upload
            </h3>

            {!activeSize ? (
              <p className="text-sm text-slate-500 italic">Select a size first</p>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Asset ID (optional)</label>
                  <input
                    type="text"
                    value={assetId}
                    onChange={e => setAssetId(e.target.value)}
                    className="w-full bg-slate-800/60 border border-slate-700 rounded-lg px-4 py-2 text-sm text-white"
                    placeholder="Enter ID if updating"
                  />
                </div>

                {/* File Upload */}
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Upload File (optional)</label>
                  <div className="flex items-center gap-2">
                    <label className="flex-1 cursor-pointer">
                      <div className="bg-slate-800/60 border border-slate-700 rounded-lg px-4 py-2 text-sm text-slate-400 hover:bg-slate-700/50 transition-colors flex items-center gap-2">
                        <Upload className="w-4 h-4" />
                        {selectedFile ? selectedFile.name : "Choose file..."}
                      </div>
                      <input
                        type="file"
                        accept="image/*,video/*"
                        onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                        className="hidden"
                      />
                    </label>
                    {selectedFile && (
                      <button
                        onClick={() => setSelectedFile(null)}
                        className="p-2 bg-slate-700 rounded-lg hover:bg-red-600/50 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* OR separator */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-700"></div>
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="px-2 bg-slate-900 text-slate-500">OR</span>
                  </div>
                </div>

                {/* URL Input (if no file) */}
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Media URL (if no file)</label>
                  <input
                    type="url"
                    value={assetUrl}
                    onChange={e => setAssetUrl(e.target.value)}
                    className="w-full bg-slate-800/60 border border-slate-700 rounded-lg px-4 py-2 text-sm text-white"
                    placeholder="https://example.com/image.jpg"
                    disabled={!!selectedFile}
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-400 block mb-1">Promotional URL *</label>
                  <input
                    type="url"
                    value={assetPromo}
                    onChange={e => setAssetPromo(e.target.value)}
                    className="w-full bg-slate-800/60 border border-slate-700 rounded-lg px-4 py-2 text-sm text-white"
                    placeholder="https://example.com/offer"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => handleDeployMedia('image')}
                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 rounded-lg text-sm transition-colors flex items-center justify-center gap-2"
                  >
                    <ImageIcon className="w-4 h-4" /> Add Image
                  </button>
                  <button
                    onClick={() => handleDeployMedia('video')}
                    className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 rounded-lg text-sm transition-colors flex items-center justify-center gap-2"
                  >
                    <VideoIcon className="w-4 h-4" /> Add Video
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Media Gallery */}
        <div className="mt-10 bg-slate-900/30 border border-slate-800 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Monitor className="w-5 h-5 text-indigo-400" /> Gallery
            {activeSize && (
              <span className="text-xs bg-slate-800 px-2 py-1 rounded-full text-slate-400 ml-2">
                {mediaList.images?.length || 0} images, {mediaList.videos?.length || 0} videos
              </span>
            )}
          </h3>

          {!activeSize ? (
            <p className="text-sm text-slate-500 italic py-8 text-center">Select a size to view media</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mediaList.images?.map((img: any) => (
                <div key={img._id} className="bg-slate-800/60 border border-slate-700 rounded-xl overflow-hidden group">
                  <div className="aspect-video bg-slate-900 relative">
                    <img src={img.imageUrl} alt="" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                      <a href={img.imageUrl} target="_blank" rel="noopener" className="p-2 bg-slate-700 rounded-full hover:bg-slate-600"><Eye className="w-4 h-4" /></a>
                      <button onClick={() => handleDeleteMedia('image', img._id)} className="p-2 bg-red-600/80 rounded-full hover:bg-red-600"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                  <div className="p-3 flex justify-between items-center text-xs text-slate-400">
                    <span className="truncate">ID: {img._id.slice(-6)}</span>
                    <span className="bg-indigo-600/20 text-indigo-300 px-2 py-0.5 rounded-full">image</span>
                  </div>
                </div>
              ))}
              {mediaList.videos?.map((vid: any) => (
                <div key={vid._id} className="bg-slate-800/60 border border-slate-700 rounded-xl overflow-hidden group">
                  <div className="aspect-video bg-slate-900 flex items-center justify-center">
                    <VideoIcon className="w-10 h-10 text-slate-600" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                      <a href={vid.videoUrl} target="_blank" rel="noopener" className="p-2 bg-slate-700 rounded-full hover:bg-slate-600"><Eye className="w-4 h-4" /></a>
                      <button onClick={() => handleDeleteMedia('video', vid._id)} className="p-2 bg-red-600/80 rounded-full hover:bg-red-600"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                  <div className="p-3 flex justify-between items-center text-xs text-slate-400">
                    <span className="truncate">ID: {vid._id.slice(-6)}</span>
                    <span className="bg-purple-600/20 text-purple-300 px-2 py-0.5 rounded-full">video</span>
                  </div>
                </div>
              ))}
              {mediaList.images?.length === 0 && mediaList.videos?.length === 0 && (
                <p className="col-span-full text-center py-12 text-slate-500 italic">No media found for this size</p>
              )}
            </div>
          )}
        </div>

        {/* Live Feedback Console (minimal) */}
        {logs && (
          <div className="mt-8 bg-slate-900/70 border border-slate-800 rounded-xl p-4">
            <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
              <Terminal className="w-4 h-4" /> Last API Call
            </div>
            <div className="bg-slate-950 rounded-lg p-3 font-mono text-xs overflow-x-auto">
              <div className="text-indigo-400">{logs.method} {logs.path} → {logs.status}</div>
              <pre className="text-slate-500 mt-1">{JSON.stringify(logs.response, null, 2)}</pre>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
