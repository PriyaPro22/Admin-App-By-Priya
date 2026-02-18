"use client";

import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

// Material Symbols Outlined as inline component
const MaterialIcon = ({ name, className = "" }: { name: string; className?: string }) => (
  <span
    className={`material-symbols-outlined ${className}`}
    style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}
  >
    {name}
  </span>
);

// API configuration
const API_BASE_URL = "https://api.bijliwalaaya.in/api";
const X_API_TOKEN = "super_secure_token";

// Axios instance with default headers
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "x-api-token": X_API_TOKEN,
    "Content-Type": "application/json",
  },
});

// Types
interface Video {
  _id?: string;
  title: string;
  visibility: boolean;
  videoType: "youtube" | "local";
  videoUrl?: string;
  fileName?: string;
  fileSize?: number;
  createdAt?: string;
}

export default function PartnerAppVideoTutorialsPage() {
  // Page state
  const [pageKey, setPageKey] = useState("onboarding");
  const [pageTitle, setPageTitle] = useState("");
  const [pageVisibility, setPageVisibility] = useState(true);
  
  // Video state
  const [videoTitle, setVideoTitle] = useState("");
  const [videoVisibility, setVideoVisibility] = useState(true);
  const [videoType, setVideoType] = useState<"youtube" | "local">("youtube");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [currentVideoUrl, setCurrentVideoUrl] = useState<string>("");
  const [embedError, setEmbedError] = useState(false);
  const [existingPages, setExistingPages] = useState<Set<string>>(new Set());

  // Tutorials list
  const [tutorials, setTutorials] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalTutorials, setTotalTutorials] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  // Page existence check
  const [pageExists, setPageExists] = useState(false);
  const [checkingPage, setCheckingPage] = useState(false);
  
  // File input ref
  const fileInputRef = useRef<HTMLInputElement>(null);

  //filter
  const [searchQuery, setSearchQuery] = useState("");

const filteredTutorials = React.useMemo(() => {
  if (!searchQuery.trim()) return tutorials;

  const q = searchQuery.toLowerCase();

  return [...tutorials].sort((a, b) => {
    const aMatch =
      a.title?.toLowerCase().includes(q) ||
      a.category?.toLowerCase().includes(q);

    const bMatch =
      b.title?.toLowerCase().includes(q) ||
      b.category?.toLowerCase().includes(q);

    // 🔥 matched items come first
    if (aMatch && !bMatch) return -1;
    if (!aMatch && bMatch) return 1;
    return 0; // keep original order
  });
}, [searchQuery, tutorials]);


  // Fetch page data on pageKey change
useEffect(() => {
  fetchAllTutorialVideos();
}, []);


  // Clean up object URLs
  useEffect(() => {
    return () => {
      if (currentVideoUrl) {
        URL.revokeObjectURL(currentVideoUrl);
      }
    };
  }, [currentVideoUrl]);

  // Reset embed error when URL changes
  useEffect(() => {
    setEmbedError(false);
  }, [youtubeUrl]);


  useEffect(() => {
  checkPageExists();
}, [pageKey]);
  // Check if page exists

  const checkPageExists = async () => {
  try {
    setCheckingPage(true);
    setError(null);

    const response = await api.get(`/video/${pageKey}`);

    if (response.data.success) {
      setPageExists(true);
      setPageVisibility(response.data.data?.visibility ?? true);
      setPageTitle(response.data.data?.pageTitle || "");
    }
  } catch (error) {
    setPageExists(false);
    setPageTitle("");
  } finally {
    setCheckingPage(false);
  }
};


const fetchAllTutorialVideos = async () => {
  try {
    setCheckingPage(true);
    setError(null);

    const res = await api.get("/tutorial/videos");
    if (!res.data.success) return;

    const allPages = res.data.data; // object with page keys
    const allVideos: any[] = [];
    const pageSet = new Set<string>();

    // 🔥 FIX: Iterate through each page in the data object
    Object.entries(allPages).forEach(([pageKey, pageData]: [string, any]) => {
      pageSet.add(pageKey);

      // 🔥 FIX: Page ka data object hai, videos array nahi
      // Har video index ke liye iterate karo
      if (pageData.data && typeof pageData.data === 'object') {
        Object.entries(pageData.data).forEach(([index, video]: [string, any]) => {
          allVideos.push({
            pageKey: pageKey,
            category: getPageDisplayName(pageKey),
            title: video.title,
            type: video.videoType === "youtube" ? "YouTube" : "Media",
            typeIcon: video.videoType === "youtube" ? "video_library" : "description",
            typeColor: video.videoType === "youtube" ? "text-red-500" : "text-blue-500",
            status: video.visibility === "true" || video.visibility === true ? "Visible" : "Hidden",
            statusColor: video.visibility === "true" || video.visibility === true
              ? "bg-emerald-100 text-emerald-700"
              : "bg-slate-100 text-slate-500",
            statusDot: video.visibility === "true" || video.visibility === true 
              ? "bg-emerald-500" 
              : "bg-slate-400",
            date: new Date().toLocaleDateString(), // API mein createdAt nahi hai
            videoUrl: video.videoUrl || video.video,
            visibility: video.visibility === "true" || video.visibility === true,
            videoType: video.videoType,
            index: parseInt(index), // 🔥 Important: index store karo delete/edit ke liye
          });
        });
      }
    });

    setExistingPages(pageSet);
    setTutorials(allVideos);
    setTotalTutorials(allVideos.length);

  } catch (err) {
    console.error(err);
    setError("Failed to load tutorials");
  } finally {
    setCheckingPage(false);
  }
};



  // 1. CREATE PAGE - POST /video-page
  const createPage = async () => {
    try {
      setLoading(true);
      setError(null);
      setSuccessMessage(null);
      
      const response = await api.post('/video-page', {
        pageKey: pageKey,
        visibility: pageVisibility
      });
      
      if (response.data.success) {
        setSuccessMessage(`Page "${getPageDisplayName(pageKey)}" created successfully!`);
        setPageExists(true);
       
        return true;
      }
      return false;
    } catch (error: any) {
      console.error("Error creating page:", error);
      if (error.response?.status === 401) {
        setError("Invalid or missing service token");
      } else {
        setError(error.response?.data?.message || "Failed to create page");
      }
      return false;
    } finally {
      setLoading(false);
    }
  };

  // 2. SAVE VIDEO - POST/PUT /video/:pageKey
  // const saveVideo = async () => {
  //   // Validation
  //   if (!videoTitle) {
  //     setError("Please enter video title");
  //     return;
  //   }

  //   if (videoType === "youtube" && !youtubeUrl) {
  //     setError("Please enter YouTube URL");
  //     return;
  //   }

  //   if (videoType === "local" && !selectedFile) {
  //     setError("Please select a video file");
  //     return;
  //   }

  //   try {
  //     setLoading(true);
  //     setError(null);
  //     setSuccessMessage(null);

  //     // FIRST: Check if page exists
  //     if (!pageExists) {
  //       const pageCreated = await createPage();
  //       if (!pageCreated) {
  //         throw new Error("Failed to create page. Cannot add video.");
  //       }
  //     }

  //     // SECOND: Now add/update video
  //     const formData = new FormData();
  //     formData.append("title", videoTitle);
  //     formData.append("visibility", String(videoVisibility));
  //     formData.append("videoType", videoType);
      
  //     if (videoType === "youtube") {
  //       formData.append("videoUrl", youtubeUrl);
  //     } else if (selectedFile) {
  //       formData.append("video", selectedFile);
  //     }

  //     let response;
  //     if (editingIndex !== null) {
  //       // Update existing video
  //       response = await api.put(
  //         `/video/${pageKey}/${editingIndex}`,
  //         formData,
  //         { 
  //           headers: { 
  //             "Content-Type": "multipart/form-data",
  //             "x-api-token": X_API_TOKEN 
  //           } 
  //         }
  //       );
  //     } else {
  //       // Add new video
  //       response = await api.post(
  //         `/video/${pageKey}`,
  //         formData,
  //         { 
  //           headers: { 
  //             "Content-Type": "multipart/form-data",
  //             "x-api-token": X_API_TOKEN 
  //           } 
  //         }
  //       );
  //     }

  //     if (response.data.success) {
  //       setSuccessMessage(
  //         editingIndex !== null 
  //           ? "Video updated successfully!" 
  //           : "Video added successfully!"
  //       );
  //       resetVideoForm();
  //      await fetchAllTutorialVideos();
  //     }
  //   } catch (error: any) {
  //     console.error("Error saving video:", error);
  //     if (error.response?.status === 401) {
  //       setError("Invalid or missing service token");
  //     } else if (error.response?.status === 404) {
  //       setError("Page not found. Please create the page first.");
  //     } else {
  //       setError(error.response?.data?.message || "Failed to save video");
  //     }
  //   } finally {
  //     setLoading(false);
  //   }
  // };
const saveVideo = async () => {
  // Validation
  if (!videoTitle) {
    setError("Please enter video title");
    return;
  }

  if (videoType === "youtube" && !youtubeUrl) {
    setError("Please enter YouTube URL");
    return;
  }

  if (videoType === "local" && !selectedFile) {
    setError("Please select a video file");
    return;
  }

  try {
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    // FIRST: Check if page exists
    if (!pageExists) {
      const pageCreated = await createPage();
      if (!pageCreated) {
        throw new Error("Failed to create page. Cannot add video.");
      }
    }

    // SECOND: Now add/update video
    const formData = new FormData();
    formData.append("title", videoTitle);
    formData.append("visibility", String(videoVisibility));
    formData.append("videoType", videoType);

    // ✅ ADD THESE TWO LINES HERE
    formData.append("isSkippable", String(isSkippable));
    formData.append(
      "skipTime",
      isSkippable ? String(skipTime) : "0"
    );

    if (videoType === "youtube") {
      formData.append("videoUrl", youtubeUrl);
    } else if (selectedFile) {
      formData.append("video", selectedFile);
    }

    let response;
    if (editingIndex !== null) {
      // Update existing video
      response = await api.put(
        `/video/${pageKey}/${editingIndex}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            "x-api-token": X_API_TOKEN,
          },
        }
      );
    } else {
      // Add new video
      response = await api.post(
        `/video/${pageKey}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            "x-api-token": X_API_TOKEN,
          },
        }
      );
    }

    if (response.data.success) {
      setSuccessMessage(
        editingIndex !== null
          ? "Video updated successfully!"
          : "Video added successfully!"
      );
      resetVideoForm();
      await fetchAllTutorialVideos();
    }
  } catch (error: any) {
    console.error("Error saving video:", error);
    if (error.response?.status === 401) {
      setError("Invalid or missing service token");
    } else if (error.response?.status === 404) {
      setError("Page not found. Please create the page first.");
    } else {
      setError(error.response?.data?.message || "Failed to save video");
    }
  } finally {
    setLoading(false);
  }
};

  // 3. DELETE VIDEO - DELETE /video/:pageKey/:index
  const deleteVideo = async (pageKey: string, index: number) => {
    if (!confirm("Are you sure you want to delete this video?")) return;

    try {
      setLoading(true);
      setError(null);
      setSuccessMessage(null);
      
      const response = await api.delete(`/video/${pageKey}/${index}`, {
        headers: {
          "x-api-token": X_API_TOKEN
        }
      });
      
      if (response.data.success) {
        setSuccessMessage("Video deleted successfully!");
         await fetchAllTutorialVideos();
      
      }
    } catch (error: any) {
      console.error("Error deleting video:", error);
      if (error.response?.status === 401) {
        setError("Invalid or missing service token");
      } else {
        setError(error.response?.data?.message || "Failed to delete video");
      }
    } finally {
      setLoading(false);
    }
  };

  // 4. REMOVE VIDEO FROM PREVIEW (Clear form)
  const removeVideoFromPreview = () => {
    if (selectedFile && currentVideoUrl) {
      URL.revokeObjectURL(currentVideoUrl);
    }
    setSelectedFile(null);
    setYoutubeUrl("");
    setCurrentVideoUrl("");
    setVideoTitle("");
    setEmbedError(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // 5. REPLACE VIDEO FILE - Now works for both YouTube and Local
  const replaceVideoFile = () => {
    if (videoType === "local") {
      // For local files, trigger file input
      if (fileInputRef.current) {
        fileInputRef.current.click();
      }
    } else {
      // For YouTube, clear and focus the URL input
      setYoutubeUrl("");
      setTimeout(() => {
        const urlInput = document.querySelector('input[placeholder*="youtube"]') as HTMLInputElement;
        if (urlInput) urlInput.focus();
      }, 100);
    }
  };

  // 6. Edit Video - populate form
const editVideo = (tutorial: any) => {
  setVideoTitle(tutorial.title);
  setVideoVisibility(tutorial.status === "Visible");
  setVideoType(tutorial.videoType); // 🔥 direct backend value

  setEditingIndex(tutorial.index);
  setEmbedError(false);

  // 🔴 reset first
  setYoutubeUrl("");
  setSelectedFile(null);
  setCurrentVideoUrl("");

  if (tutorial.videoType === "youtube") {
    // ✅ YouTube preview
    setYoutubeUrl(tutorial.videoUrl || "");
  } else {
    // ✅ LOCAL video preview (SERVER FILE)
    if (tutorial.videoUrl) {
     setCurrentVideoUrl(
  tutorial.videoUrl.startsWith("http")
    ? tutorial.videoUrl
    : `${API_BASE_URL}${tutorial.videoUrl}`
);
 // 🔥 server video URL
    }
  }

  document
    .getElementById("video-form-section")
    ?.scrollIntoView({ behavior: "smooth" });
};


  // Reset video form
  const resetVideoForm = () => {
    setVideoTitle("");
    setVideoVisibility(true);
    setVideoType("youtube");
    setYoutubeUrl("");
    if (selectedFile && currentVideoUrl) {
      URL.revokeObjectURL(currentVideoUrl);
    }
    setSelectedFile(null);
    setCurrentVideoUrl("");
    setEditingIndex(null);
    setEmbedError(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 50 * 1024 * 1024) { // 50MB limit
        setError("File size exceeds 50MB limit");
        return;
      }
      
      // Clean up previous URL
      if (currentVideoUrl) {
        URL.revokeObjectURL(currentVideoUrl);
      }
      
      setSelectedFile(file);
      setCurrentVideoUrl(URL.createObjectURL(file));
       // Auto-fill title from filename
      setError(null);
    }
  };

  // Handle YouTube URL select (blue color when selected)
  const handleYoutubeUrlSelect = (e: React.MouseEvent<HTMLInputElement>) => {
    (e.target as HTMLInputElement).select();
  };
// skip input
const [skipTime, setSkipTime] = useState<number>(0);
const [isSkippable, setIsSkippable] = useState<boolean>(false);

  // Handle page key change
  const handlePageChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedText = e.target.options[e.target.selectedIndex].text;
    const newPageKey = selectedText.toLowerCase()
      .replace(/[&]/g, 'and')
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');
    
    setPageKey(newPageKey);
    resetVideoForm();
    setError(null);
    setSuccessMessage(null);
  };

  // Handle create page button click
  const handleCreatePage = async () => {
    await createPage();
  };

  // Get display name for page
  const getPageDisplayName = (key: string) => {
    const pages: { [key: string]: string } = {
      'onboarding': 'Onboarding',
      'login': 'login',
      'onBoardingPaymentPage': ' onBoardingPaymentPage',
      'documentVerificationPage': ' documentVerificationPage'
      
    };
    return pages[key] || key.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  // Extract YouTube Video ID from various URL formats
  const extractYouTubeId = (url: string): string | null => {
    if (!url) return null;
    
    // Handle youtu.be format
    if (url.includes('youtu.be/')) {
      const parts = url.split('youtu.be/')[1];
      return parts.split('?')[0].split('&')[0];
    }
    
    // Handle youtube.com format
    if (url.includes('youtube.com/watch')) {
      const urlParams = new URLSearchParams(url.split('?')[1]);
      return urlParams.get('v');
    }
    
    // Handle youtube.com/embed format
    if (url.includes('youtube.com/embed/')) {
      const parts = url.split('youtube.com/embed/')[1];
      return parts.split('?')[0].split('&')[0];
    }
    
    return null;
  };

  // Format YouTube URL for embedding
  const getYouTubeEmbedUrl = (url: string): string | null => {
    const videoId = extractYouTubeId(url);
    return videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0` : null;
  };

  // Handle iframe error
  const handleIframeError = () => {
    setEmbedError(true);
  };

  return (
    <div className="p-8 bg-white min-h-screen font-['Inter']">
      {/* Google Fonts */}
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap"
        rel="stylesheet"
      />
      <link
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
        rel="stylesheet"
      />

      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl flex items-center gap-4 shadow-xl">
            <div className="animate-spin rounded-full h-6 w-6 border-2 border-[#137fec] border-t-transparent"></div>
            <span className="text-slate-700 font-medium">Processing...</span>
          </div>
        </div>
      )}

      {/* Success Alert */}
      {successMessage && (
        <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-lg flex items-start gap-3">
          <span className="material-symbols-outlined text-emerald-500">check_circle</span>
          <div className="flex-1">
            <p className="text-sm font-medium text-emerald-800">{successMessage}</p>
          </div>
          <button 
            onClick={() => setSuccessMessage(null)}
            className="text-emerald-500 hover:text-emerald-700"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
      )}

      {/* Error Alert */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
          <span className="material-symbols-outlined text-red-500">error</span>
          <div className="flex-1">
            <p className="text-sm font-medium text-red-800">{error}</p>
          </div>
          <button 
            onClick={() => setError(null)}
            className="text-red-500 hover:text-red-700"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
      )}

      {/* Page Status Banner */}
      {/* {!checkingPage && (
        <div className={`mb-6 p-4 rounded-lg flex items-center justify-between ${
          pageExists 
            ? 'bg-emerald-50 border border-emerald-200' 
            : 'bg-amber-50 border border-amber-200'
        }`}>
          <div className="flex items-center gap-3">
            <span className={`material-symbols-outlined ${
              pageExists ? 'text-emerald-500' : 'text-amber-500'
            }`}>
              {pageExists ? 'check_circle' : 'info'}
            </span>
            <div>
              <p className={`text-sm font-medium ${
                pageExists ? 'text-emerald-800' : 'text-amber-800'
              }`}>
                {pageExists 
                  ? `Page "${getPageDisplayName(pageKey)}" exists and is ready` 
                  : `Page "${getPageDisplayName(pageKey)}" does not exist yet`}
              </p>
              <p className={`text-xs ${
                pageExists ? 'text-emerald-600' : 'text-amber-600'
              }`}>
                {pageExists 
                  ? 'You can add, edit, or delete videos' 
                  : 'Please create the page first before adding videos'}
              </p>
            </div>
          </div>
          {!pageExists && (
            <button
              onClick={handleCreatePage}
              disabled={loading}
              className="px-4 py-2 bg-[#137fec] text-white text-sm font-semibold rounded-lg hover:bg-[#137fec]/90 transition-all flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-sm">add_circle</span>
              Create Page Now
            </button>
          )}
        </div>
      )} */}


      <div
  className={`mb-6 p-4 rounded-lg flex items-center justify-between ${
    pageExists
      ? "bg-emerald-50 border border-emerald-200"
      : "bg-amber-50 border border-amber-200"
  }`}
>
  <div className="flex items-center gap-3">
    <span
      className={`material-symbols-outlined ${
        pageExists ? "text-emerald-500" : "text-amber-500"
      }`}
    >
      {pageExists ? "check_circle" : "info"}
    </span>
    <div>
      <p
        className={`text-sm font-medium ${
          pageExists ? "text-emerald-800" : "text-amber-800"
        }`}
      >
        {pageExists
          ? `Page "${getPageDisplayName(pageKey)}" exists and is ready`
          : `Page "${getPageDisplayName(pageKey)}" does not exist yet`}
      </p>
      <p
        className={`text-xs ${
          pageExists ? "text-emerald-600" : "text-amber-600"
        }`}
      >
        {pageExists
          ? "You can add, edit, or delete videos"
          : "Please create the page first before adding videos"}
      </p>
    </div>
  </div>

  {!pageExists && (
    <button
      onClick={handleCreatePage}
      disabled={loading}
      className="px-4 py-2 bg-[#137fec] text-white text-sm font-semibold rounded-lg hover:bg-[#137fec]/90 transition-all flex items-center gap-2"
    >
      <span className="material-symbols-outlined text-sm">add_circle</span>
      Create Page Now
    </button>
  )}
</div>


      {/* Header Section - Discard button removed */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-1">
            <span>Partner Management</span>
            <MaterialIcon name="chevron_right" className="text-xs" />
            <span className="text-slate-900 font-medium">
              Video Tutorials
            </span>
          </div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">
            Partner App Video Tutorials
          </h2>
          <p className="text-slate-500 mt-1">
            Configure and manage educational videos for the partner mobile application.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {/* Section 1: Category & Page Selection */}
        <section className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="size-8 rounded-full bg-[#137fec]/10 text-[#137fec] flex items-center justify-center font-bold text-sm italic">
                1
              </span>
              <h3 className="text-lg font-bold text-slate-900">
                Category & Page Selection
              </h3>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-slate-600">
                Page Visibility
              </span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={pageVisibility}
                  onChange={(e) => setPageVisibility(e.target.checked)}
                  disabled={!pageExists}
                />
                <div className={`w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all ${
                  pageExists ? 'peer-checked:bg-[#137fec]' : 'peer-checked:bg-slate-400'
                }`}></div>
              </label>
            </div>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">
                App Page
              </label>
              <div className="relative">
                <select 
                  className="w-full bg-white border border-slate-300 rounded-lg py-2.5 pl-4 pr-10 appearance-none focus:ring-2 focus:ring-[#137fec]/20 focus:border-[#137fec] outline-none text-sm transition-all"
                  onChange={handlePageChange}
                  value={pageKey}
                >
                  <option value="onboarding">Onboarding</option>
                  <option value="login">login</option>
                  <option value="onBoardingPaymentPage">onBoardingPaymentPage</option>
                  <option value="documentVerificationPage">documentVerificationPage</option>
                  
                </select>
                <span className="material-symbols-outlined absolute right-3 top-2.5 text-slate-400 pointer-events-none">
                  expand_more
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Select which main section of the app this video belongs to.
              </p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">
                Page Title
              </label>
              <input
                type="text"
                className="w-full bg-white border border-slate-300 rounded-lg py-2.5 px-4 focus:ring-2 focus:ring-[#137fec]/20 focus:border-[#137fec] outline-none text-sm transition-all"
                placeholder="e.g. How to track your daily earnings"
                value={pageTitle}
                onChange={(e) => setPageTitle(e.target.value)}
              />
              <p className="text-xs text-slate-400">
                The headline displayed to the partner in the app.
              </p>
            </div>
          </div>
        </section>

        {/* Section 2: Video Content */}
        <section id="video-form-section" className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="size-8 rounded-full bg-[#137fec]/10 text-[#137fec] flex items-center justify-center font-bold text-sm italic">
                2
              </span>
              <h3 className="text-lg font-bold text-slate-900">
                Video Content
                {editingIndex !== null && (
                  <span className="ml-2 text-sm font-normal text-[#137fec]">
                    (Editing)
                  </span>
                )}
              </h3>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-slate-600">
                Video Visibility
              </span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={videoVisibility}
                  onChange={(e) => setVideoVisibility(e.target.checked)}
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#137fec]"></div>
              </label>
            </div>
          </div>
          <div className="p-6 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">
                  Video Title
                </label>
                <input
                  type="text"
                  className="w-full bg-white border border-slate-300 rounded-lg py-2.5 px-4 focus:ring-2 focus:ring-[#137fec]/20 focus:border-[#137fec] outline-none text-sm transition-all"
                  placeholder="Enter video title"
                  value={videoTitle}
                  onChange={(e) => setVideoTitle(e.target.value)}
                  disabled={!pageExists}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">
                  Video Type
                </label>
                <div className="flex p-1 bg-slate-100 rounded-lg w-full max-w-xs">
                  <button
                    onClick={() => {
                      setVideoType("youtube");
                      setSelectedFile(null);
                      setCurrentVideoUrl("");
                    }}
                    disabled={!pageExists}
                    className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${
                      videoType === "youtube"
                        ? "bg-white text-[#137fec] shadow-sm"
                        : "text-slate-500 hover:text-slate-700"
                    } ${!pageExists && 'opacity-50 cursor-not-allowed'}`}
                  >
                    YouTube
                  </button>
                  <button
                    onClick={() => {
                      setVideoType("local");
                      setYoutubeUrl("");
                    }}
                    disabled={!pageExists}
                    className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${
                      videoType === "local"
                        ? "bg-white text-[#137fec] shadow-sm"
                        : "text-slate-500 hover:text-slate-700"
                    } ${!pageExists && 'opacity-50 cursor-not-allowed'}`}
                  >
                    Local Media
                  </button>
                </div>
              </div>
            </div>

            {/* Dynamic Input: Based on Video Type */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
              <div className="lg:col-span-3 space-y-4">
                {videoType === "youtube" ? (
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">
                      YouTube URL
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        className="w-full bg-white border border-slate-300 rounded-lg py-2.5 pl-10 pr-4 focus:ring-2 focus:ring-[#137fec]/20 focus:border-[#137fec] outline-none text-sm transition-all selection:bg-[#137fec] selection:text-white"
                        placeholder="https://www.youtube.com/watch?v=... or https://youtu.be/..."
                        value={youtubeUrl}
                        onChange={(e) => setYoutubeUrl(e.target.value)}
                        onMouseUp={handleYoutubeUrlSelect}
                        onFocus={(e) => e.target.select()}
                        disabled={!pageExists}
                        style={{ 
                          backgroundColor: youtubeUrl ? '#f0f7ff' : 'white',
                          borderColor: youtubeUrl ? '#137fec' : '#e2e8f0'
                        }}
                      />
                      <span className="material-symbols-outlined absolute left-3 top-2.5 text-slate-400">
                        link
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">
                      Paste the full YouTube video link here.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">
                      Upload Video (MP4, max 50MB)
                    </label>
                    <div className="relative">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="video/mp4"
                        onChange={handleFileChange}
                        disabled={!pageExists}
                        className="w-full bg-white border border-slate-300 rounded-lg py-2 px-3 focus:ring-2 focus:ring-[#137fec]/20 focus:border-[#137fec] outline-none text-sm transition-all file:mr-4 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-[#137fec] file:text-white hover:file:bg-[#137fec]/90 disabled:opacity-50 disabled:cursor-not-allowed"
                      />
                    </div>
                    {selectedFile && (
                      <p className="text-xs text-green-600">
                        Selected: {selectedFile.name} ({(selectedFile.size / (1024 * 1024)).toFixed(2)} MB)
                      </p>
                    )}
                    <p className="text-xs text-slate-400">
                      Local Media option allows direct MP4 uploads (max 50MB).
                    </p>
                  </div>
                )}

                <div className="p-4 bg-[#137fec]/5 border border-[#137fec]/10 rounded-lg flex items-start gap-4">
                  <span className="material-symbols-outlined text-[#137fec]">
                    info
                  </span>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    YouTube links are recommended for faster app load times. Local videos are uploaded to our server.
                  </p>
                </div>
                                 {/* Skip Settings */}
<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">

  {/* Skip Time */}
  <div className="space-y-2">
    <label className="text-sm font-semibold text-slate-700">
      Skip Time (in seconds)
    </label>
    <input
      type="number"
      min="0"
      value={skipTime}
      onChange={(e) => setSkipTime(Number(e.target.value))}
      className="w-full bg-white border border-slate-300 rounded-lg py-2.5 px-3 focus:ring-2 focus:ring-[#137fec]/20 focus:border-[#137fec] outline-none text-sm"
      placeholder="Enter skip time"
    />
  </div>

  {/* Is Skippable */}
  <div className="space-y-2">
    <label className="text-sm font-semibold text-slate-700">
      Is Skippable?
    </label>
    <select
      value={isSkippable ? "yes" : "no"}
      onChange={(e) => setIsSkippable(e.target.value === "yes")}
      className="w-full bg-white border border-slate-300 rounded-lg py-2.5 px-3 focus:ring-2 focus:ring-[#137fec]/20 focus:border-[#137fec] outline-none text-sm"
    >
      <option value="no">False</option>
      <option value="yes">True</option>
    </select>
  </div>

</div>
              </div>

              {/* Video Preview Box with Replace and Remove Buttons */}
              <div className="lg:col-span-2 space-y-3">
                <label className="text-sm font-semibold text-slate-700 block">
                  Preview
                </label>
                <div className="relative aspect-video bg-slate-900 rounded-xl overflow-hidden group shadow-md">
                  {videoType === "youtube" && youtubeUrl && getYouTubeEmbedUrl(youtubeUrl) ? (
                    <iframe
                      src={getYouTubeEmbedUrl(youtubeUrl) as string}
                      className="w-full h-full"
                      allowFullScreen
                      onError={handleIframeError}
                    />
              ) : videoType === "local" && currentVideoUrl ? (
  <video
    src={currentVideoUrl}
    className="w-full h-full object-contain"
    controls
  />
) : embedError ? (
                    <div className="w-full h-full flex items-center justify-center bg-slate-800 text-white p-4 text-center">
                      <div>
                        <span className="material-symbols-outlined text-4xl mb-2">error</span>
                        <p className="text-sm">Invalid YouTube URL</p>
                        <p className="text-xs text-slate-400 mt-1">Please check the URL and try again</p>
                      </div>
                    </div>
                  ) : (
                    <>
                      <img
                        src="https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=600"
                        className="w-full h-full object-cover"
                        alt="Video thumbnail"
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="material-symbols-outlined text-white text-6xl opacity-80 group-hover:scale-110 transition-transform cursor-pointer">
                          play_circle
                        </span>
                      </div>
                    </>
                  )}
                </div>
                
                {/* Replace and Remove Buttons - Now always visible when video is selected */}
                {(videoType === "youtube" && youtubeUrl) || (videoType === "local" && selectedFile) ? (
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={replaceVideoFile}
                      disabled={!pageExists}
                      className="flex-1 py-2 text-xs font-bold bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span className="material-symbols-outlined text-sm">edit</span> 
                      {videoType === "local" ? "Replace" : "Change URL"}
                    </button>
                    <button 
                      onClick={removeVideoFromPreview}
                      disabled={!pageExists}
                      className="flex-1 py-2 text-xs font-bold text-red-600 bg-red-50 border border-red-100 rounded-lg hover:bg-red-100 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span className="material-symbols-outlined text-sm">delete</span> Remove
                    </button>
                  </div>
                ) : null}

                {/* Cancel Edit Button */}
                {editingIndex !== null && (
                  <button 
                    onClick={resetVideoForm}
                    className="w-full py-2 text-xs font-bold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
                  >
                    <span className="material-symbols-outlined text-sm">close</span> Cancel Edit
                  </button>
                )}

                {/* Save Tutorial Button - Inside Video Section (Broad Clickable Form) */}
                <button 
                  onClick={saveVideo}
                  disabled={loading || !pageExists || (!videoTitle) || (videoType === "youtube" && !youtubeUrl) || (videoType === "local" && !selectedFile)}
                  className={`w-full py-3 font-bold rounded-lg transition-all text-sm shadow-sm flex items-center justify-center gap-2 ${
                    pageExists && videoTitle && ((videoType === "youtube" && youtubeUrl) || (videoType === "local" && selectedFile))
                      ? 'bg-[#137fec] text-white hover:bg-[#137fec]/90' 
                      : 'bg-slate-200 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  <MaterialIcon name="save" className="text-sm" />
                  {editingIndex !== null ? 'Update Tutorial' : 'Save Tutorial'}
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Manage Tutorials Table */}
        <section className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h3 className="text-lg font-bold text-slate-900">Manage Tutorials</h3>
            <div className="flex items-center gap-3">
              <div className="relative">
              <input
  type="text"
  className="bg-slate-50 border border-slate-200 rounded-lg py-2 pl-9 pr-4 text-sm focus:ring-2 focus:ring-[#137fec]/20 outline-none w-64"
  placeholder="Search by page or video title..."
  value={searchQuery}
  onChange={(e) => setSearchQuery(e.target.value)}
/>

                <span className="material-symbols-outlined absolute left-2.5 top-2 text-slate-400">
                  search
                </span>
              </div>
              <button className="p-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50">
                <span className="material-symbols-outlined">filter_list</span>
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            {checkingPage ? (
              <div className="p-8 text-center">
                <div className="inline-flex items-center gap-3 text-slate-500">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-[#137fec] border-t-transparent"></div>
                  Loading tutorials...
                </div>
              </div>
            )  : tutorials.length === 0 ? (
              <div className="p-12 text-center">
                <span className="material-symbols-outlined text-4xl text-slate-300 mb-3">
                  video_library
                </span>
                <p className="text-slate-500 font-medium">No tutorials found</p>
                <p className="text-sm text-slate-400 mt-1">Add your first video using the form above.</p>
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50">
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Page / Category
                    </th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Video Title
                    </th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">
                      Type
                    </th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">
                      Status
                    </th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Date Added
                    </th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                 {filteredTutorials.map((tutorial, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <span className="px-2.5 py-1 bg-slate-100 text-slate-600 text-xs font-medium rounded-full">
                          {tutorial.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-slate-900">
                        {tutorial.title}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-1.5 text-xs text-slate-600">
                          <span className={`material-symbols-outlined text-sm ${tutorial.typeColor}`}>
                            {tutorial.typeIcon}
                          </span>
                          {tutorial.type}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                          tutorial.status === 'Visible' 
                            ? 'bg-emerald-50 text-emerald-700' 
                            : 'bg-slate-100 text-slate-600'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            tutorial.status === 'Visible' ? 'bg-emerald-500' : 'bg-slate-400'
                          }`}></span>
                          {tutorial.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-500">
                        {tutorial.date}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => editVideo(tutorial)}
                            className="p-2 text-slate-400 hover:text-[#137fec] rounded-lg hover:bg-slate-100 transition-colors"
                            title="Edit video"
                          >
                            <span className="material-symbols-outlined text-sm">edit</span>
                          </button>
                          <button
                            onClick={() => deleteVideo(tutorial.pageKey, tutorial.index)
}
                            className="p-2 text-slate-400 hover:text-red-500 rounded-lg hover:bg-slate-100 transition-colors"
                            title="Delete video"
                          >
                            <span className="material-symbols-outlined text-sm">delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
          <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between">
            <p className="text-xs text-slate-500">
              Showing {filteredTutorials.length} of {totalTutorials} tutorials
            </p>
            {/* <div className="flex items-center gap-2">
              <button className="p-1.5 border border-slate-200 rounded-lg text-slate-400 hover:bg-slate-50 disabled:opacity-50" disabled>
                <span className="material-symbols-outlined text-sm">chevron_left</span>
              </button>
              <button className="px-3 py-1.5 bg-[#137fec] text-white text-xs font-medium rounded-lg">1</button>
              <button className="px-3 py-1.5 text-slate-600 text-xs font-medium hover:bg-slate-50 rounded-lg">2</button>
              <button className="p-1.5 border border-slate-200 rounded-lg text-slate-400 hover:bg-slate-50">
                <span className="material-symbols-outlined text-sm">chevron_right</span>
              </button>
            </div> */}
          </div>
        </section>
      </div>
    </div>
  );
}