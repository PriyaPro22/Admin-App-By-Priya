// "use client";

// import React, { useState } from "react";
// import { useRouter } from "next/navigation";

// import { Lock, User, Eye, EyeOff, LogIn } from "lucide-react";

// export default function LoginPage() {
//     const [username, setUsername] = useState("");
//     const [password, setPassword] = useState("");
//     const [showPassword, setShowPassword] = useState(false);
//     const [error, setError] = useState("");
//     const [isLoading, setIsLoading] = useState(false);
    
//     const router = useRouter();

  
  
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsLoading(true);
//     setError("");

//     try {
//         const response = await fetch(
//             "https://live.bijliwalaaya.in/api/admin/login",
//             {
//                 method: "POST",
//                 headers: {
//                     "Content-Type": "application/json",
//                 },
//                 body: JSON.stringify({
//                     username: username,
//                     password: password,
//                 }),
//             }
//         );

//         const data = await response.json();

//         if (!response.ok) {
//             throw new Error(data.message || "Login failed");
//         }

//         // ✅ Token save
//         localStorage.setItem("adminToken", data.token);

//         console.log("Login Success:", data);

//         // ✅ Redirect to dashboard
//         router.push("/dashboard");

//     } catch (error: any) {
//         setError(error.message || "Something went wrong");
//     } finally {
//         setIsLoading(false);
//     }
// };
  
  
  
//     return (
//         <div className="min-h-screen bg-gradient-to-br from-gray-100 via-white to-gray-200 flex items-center justify-center p-4 relative overflow-hidden">
//             {/* Ambient Background Elements - more vibrant for glass effect */}
//             <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-white/70 dark:bg-slate-800/30 rounded-full blur-[120px] animate-pulse"></div>
//             <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-slate-400/50 dark:bg-slate-900/50 rounded-full blur-[150px] animate-pulse" style={{ animationDelay: '4s' }}></div>
//             <div className="absolute top-[20%] right-[5%] w-[30%] h-[30%] bg-white/60 dark:bg-slate-700/20 rounded-full blur-[100px]"></div>

//             <div className="max-w-md w-full relative z-10">
//                 {/* Brand Area */}
//                 <div className="text-center mb-10">
//                     <div className="inline-flex items-center justify-center p-5 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-[2.5rem] shadow-2xl border border-white dark:border-slate-700 mb-6 group transition-all hover:scale-110">
//                         <LogIn className="h-10 w-10 text-white dark:text-white" />
//                     </div>
//                     <h1 className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter mb-2">Welcome</h1>
//                     <p className="text-slate-500 dark:text-slate-400 font-bold uppercase tracking-[0.2em] text-xs">Admin Secure Portal</p>
//                 </div>

//                 {/* The Ultimate Transparent Glass Card */}
//                 <div className="relative group">
//                     {/* Shadow Layer - softer to keep glass light */}
//                     <div className="absolute -inset-1 bg-gradient-to-r from-slate-200/50 to-white/50 rounded-[3rem] blur-xl opacity-30 group-hover:opacity-50 transition duration-1000"></div>

//                     {/* Main Card with heavy glass effect */}
//                     <div className="relative bg-white/10 backdrop-blur-3xl backdrop-saturate-150 rounded-[3rem] p-10 pb-12 border border-white/30 shadow-xl overflow-hidden">
//                         {/* Glass Reflections */}
//                         <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/60 to-transparent"></div>
//                         <div className="absolute -top-[100%] -left-[100%] w-[300%] h-[300%] bg-gradient-to-tr from-transparent via-white/[0.03] to-transparent rotate-12 pointer-events-none"></div>

//                         <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
//                             {error && (
//                                 <div className="bg-red-500/10 backdrop-blur-md border border-red-500/20 text-red-600 dark:text-red-400 px-6 py-4 rounded-2xl text-sm font-black flex items-center gap-3 animate-shake shadow-lg">
//                                     <div className="h-2 w-2 bg-red-600 rounded-full animate-ping"></div>
//                                     {error}
//                                 </div>
//                             )}

//                             <div className="space-y-4">
//                                 <label className="block text-xs font-black text-slate-500 dark:text-slate-400 ml-4 uppercase tracking-[0.3em]">
//                                     Username
//                                 </label>
//                                 <div className="relative group/input">
//                                     <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
//                                         <User className="h-5 w-5 text-slate-400 group-focus-within/input:text-slate-900 dark:group-focus-within/input:text-white transition-colors" />
//                                     </div>
//                                     <input
//                                         type="text"
//                                         required
//                                         value={username}
//                                         onChange={(e) => setUsername(e.target.value)}
//                                         className="block w-full pl-16 pr-6 py-5 bg-white/5 backdrop-blur-md border border-white/30 rounded-[2rem] text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-slate-500/10 focus:border-white/50 transition-all duration-500 font-bold text-lg"
//                                         placeholder="Admin Name"
//                                     />
//                                 </div>
//                             </div>

//                             <div className="space-y-4">
//                                 <label className="block text-xs font-black text-slate-500 dark:text-slate-400 ml-4 uppercase tracking-[0.3em]">
//                                     Password
//                                 </label>
//                                 <div className="relative group/input">
//                                     <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
//                                         <Lock className="h-5 w-5 text-slate-400 group-focus-within/input:text-slate-900 dark:group-focus-within/input:text-white transition-colors" />
//                                     </div>
//                                     <input
//                                         type={showPassword ? "text" : "password"}
//                                         required
//                                         value={password}
//                                         onChange={(e) => setPassword(e.target.value)}
//                                         className="block w-full pl-16 pr-16 py-5 bg-white/5 backdrop-blur-md border border-white/30 rounded-[2rem] text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-slate-500/10 focus:border-white/50 transition-all duration-500 font-bold text-lg"
//                                         placeholder="••••••••"
//                                     />
//                                     <button
//                                         type="button"
//                                         onClick={() => setShowPassword(!showPassword)}
//                                         className="absolute inset-y-0 right-0 pr-6 flex items-center text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
//                                     >
//                                         {showPassword ? <EyeOff className="h-6 w-6" /> : <Eye className="h-6 w-6" />}
//                                     </button>
//                                 </div>
//                             </div>

//                             <button
//                                 type="submit"
//                                 disabled={isLoading}
//                                 className="w-full flex items-center justify-center gap-4 py-6 px-10 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black text-xl rounded-[2rem] shadow-2xl shadow-slate-900/20 dark:shadow-white/10 hover:shadow-slate-900/40 dark:hover:shadow-white/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed group/btn overflow-hidden"
//                             >
//                                 {isLoading ? (
//                                     <div className="h-8 w-8 border-4 border-slate-400 border-t-slate-900 dark:border-slate-200 dark:border-t-slate-900 rounded-full animate-spin" />
//                                 ) : (
//                                     <>
//                                         <span>Login Securely</span>
//                                         <LogIn className="h-6 w-6 group-hover/btn:translate-x-2 transition-transform duration-300" />
//                                     </>
//                                 )}
//                             </button>
//                         </form>
//                     </div>
//                 </div>

//                 <p className="mt-12 text-center text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-[0.5em]">
//                     &copy; {new Date().getFullYear()} Protected System &bull; All Rights Reserved
//                 </p>
//             </div>
//         </div>
//     );
// }

"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, User, Eye, EyeOff, LogIn } from "lucide-react";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(
        "https://live.bijliwalaaya.in/api/admin/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username,
            password,
          }),
        }
      );

      const data = await response.json();

      // ❌ If login failed
      if (!response.ok) {
        throw new Error(data.message || "Invalid username or password");
      }

      // ✅ Extract token (safe extraction)
      const token = data.token;

      if (!token) {
        throw new Error("Token not received from server");
      }

      // ✅ Store JWT Token
      localStorage.setItem("adminToken", token);

      // ✅ Redirect to Dashboard
      router.push("/");

    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-white to-gray-200 flex items-center justify-center p-4 relative overflow-hidden">

      <div className="max-w-md w-full relative z-10">

        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center p-5 bg-white/80 backdrop-blur-xl rounded-[2.5rem] shadow-xl border border-white mb-6">
            <LogIn className="h-10 w-10 text-slate-900" />
          </div>
          <h1 className="text-5xl font-black text-slate-900 mb-2">Welcome</h1>
          <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-xs">
            Admin Secure Portal
          </p>
        </div>

        <div className="relative bg-white/20 backdrop-blur-3xl rounded-[3rem] p-10 border border-white/40 shadow-xl overflow-hidden">

          <form onSubmit={handleSubmit} className="space-y-8">

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-600 px-6 py-4 rounded-2xl text-sm font-bold">
                {error}
              </div>
            )}

            {/* Username */}
            <div>
              <label className="block text-xs font-bold text-slate-500 ml-4 uppercase tracking-[0.3em] mb-3">
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-16 pr-6 py-5 bg-white/30 backdrop-blur-md border border-white/40 rounded-[2rem] text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300 font-semibold text-lg"
                  placeholder="Admin Name"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-bold text-slate-500 ml-4 uppercase tracking-[0.3em] mb-3">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-16 pr-16 py-5 bg-white/30 backdrop-blur-md border border-white/40 rounded-[2rem] text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300 font-semibold text-lg"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-6 flex items-center text-slate-400"
                >
                  {showPassword ? (
                    <EyeOff className="h-6 w-6" />
                  ) : (
                    <Eye className="h-6 w-6" />
                  )}
                </button>
              </div>
            </div>

            {/* Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-6 bg-slate-900 text-white font-bold text-xl rounded-[2rem] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-70"
            >
              {isLoading ? "Logging in..." : "Login Securely"}
            </button>

          </form>
        </div>

        <p className="mt-12 text-center text-[10px] font-black text-slate-400 uppercase tracking-[0.5em]">
          © {new Date().getFullYear()} Protected System
        </p>
      </div>
    </div>
  );
}