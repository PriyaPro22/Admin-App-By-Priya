// "use client";

// import React, { useState } from "react";

// import { api } from "../utils/api";

// export default function ServiceBooking() {
//     const [formData, setFormData] = useState({
//         fullName: "",
//         phone: "",
//         location: "",
//         house: "",
//         street: "",
//         city: "",
//         state: "",
//         pincode: "",
//         mainCategory: "",
//         subCategory: "",
//         deepChildCategory: "",
//         subDeepChildCategory: "",
//         contactMethod: ""
//     });
//     const [loading, setLoading] = useState(false);

//     const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//         const { name, value } = e.target;
//         setFormData(prev => ({ ...prev, [name]: value }));
//     };

//     const handleSubmit = async () => {
//         // Basic validation
//         if (!formData.fullName || !formData.phone || !formData.mainCategory) {
//             alert("Please fill required fields (Name, Phone, Main Category)");
//             return;
//         }

//         try {
//             setLoading(true);
//             await api.post("/booking", formData);
//             alert("Service Booked Successfully!");
//             // Reset form
//             setFormData({
//                 fullName: "",
//                 phone: "",
//                 location: "",
//                 house: "",
//                 street: "",
//                 city: "",
//                 state: "",
//                 pincode: "",
//                 mainCategory: "",
//                 subCategory: "",
//                 deepChildCategory: "",
//                 subDeepChildCategory: "",
//                 contactMethod: ""
//             });
//         } catch (error) {
//             console.error("Booking failed", error);
//             alert("Failed to book service. Please try again.");
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <div className="mx-auto max-w-lg animate-fade-in pb-12">
//             {/* Header */}
//             <div className="mb-6 rounded-lg bg-blue-900 p-6 text-center text-white shadow-md">
//                 <h1 className="text-2xl font-bold">Direct Service Booking</h1>
//                 <p className="mt-2 text-sm text-blue-100">Book service in just few clicks</p>
//             </div>

//             {/* Customer Details Card */}
//             <div className="mb-6 rounded-xl border border-gray-200 bg-indigo-50/50 p-6 shadow-sm">
//                 <h2 className="mb-4 text-lg font-bold text-gray-900">Customer Details</h2>

//                 <div className="space-y-4">
//                     <input
//                         name="fullName"
//                         value={formData.fullName}
//                         onChange={handleChange}
//                         placeholder="Full Name"
//                         className="w-full rounded-md border border-gray-400 bg-transparent px-4 py-3 outline-none focus:border-blue-500 placeholder:text-gray-500"
//                     />

//                     <div className="flex gap-2">
//                         <input
//                             name="phone"
//                             value={formData.phone}
//                             onChange={handleChange}
//                             placeholder="Phone Number"
//                             className="w-full flex-1 rounded-md border border-gray-400 bg-transparent px-4 py-3 outline-none focus:border-blue-500 placeholder:text-gray-500"
//                         />
//                         <button className="whitespace-nowrap rounded-md border border-gray-400 bg-transparent px-4 py-2 font-medium text-blue-900 hover:bg-white transition-colors">
//                             Get Location
//                         </button>
//                     </div>
//                 </div>

//                 <h3 className="mb-3 mt-6 text-sm font-bold text-gray-900">Address Details (Fill if location not shared)</h3>
//                 <div className="space-y-3">
//                     <input
//                         name="house"
//                         value={formData.house}
//                         onChange={handleChange}
//                         placeholder="House/Flat Number, Building Name"
//                         className="w-full rounded-md border border-gray-400 bg-transparent px-4 py-3 outline-none focus:border-blue-500 placeholder:text-gray-500"
//                     />
//                     <input
//                         name="street"
//                         value={formData.street}
//                         onChange={handleChange}
//                         placeholder="Street, Area, Landmark"
//                         className="w-full rounded-md border border-gray-400 bg-transparent px-4 py-3 outline-none focus:border-blue-500 placeholder:text-gray-500"
//                     />
//                     <input
//                         name="city"
//                         value={formData.city}
//                         onChange={handleChange}
//                         placeholder="City"
//                         className="w-full rounded-md border border-gray-400 bg-transparent px-4 py-3 outline-none focus:border-blue-500 placeholder:text-gray-500"
//                     />
//                     <input
//                         name="state"
//                         value={formData.state}
//                         onChange={handleChange}
//                         placeholder="State"
//                         className="w-full rounded-md border border-gray-400 bg-transparent px-4 py-3 outline-none focus:border-blue-500 placeholder:text-gray-500"
//                     />
//                     <input
//                         name="pincode"
//                         value={formData.pincode}
//                         onChange={handleChange}
//                         placeholder="Pincode"
//                         className="w-full rounded-md border border-gray-400 bg-transparent px-4 py-3 outline-none focus:border-blue-500 placeholder:text-gray-500"
//                     />
//                 </div>
//             </div>

//             {/* Service Details Card */}
//             <div className="mb-8 rounded-xl border border-gray-200 bg-indigo-50/50 p-6 shadow-sm">
//                 <h2 className="mb-4 text-lg font-bold text-gray-900">Service Details</h2>

//                 <div className="space-y-4">
//                     <div className="rounded-md border border-gray-400 bg-transparent px-2">
//                         <select
//                             name="mainCategory"
//                             value={formData.mainCategory}
//                             onChange={handleChange}
//                             className="w-full bg-transparent py-3 outline-none text-gray-700"
//                         >
//                             <option value="">Select Main Category</option>
//                             <option value="AC">AC</option>
//                             <option value="Plumbing">Plumbing</option>
//                         </select>
//                     </div>

//                     <div className="rounded-md border border-gray-400 bg-transparent px-2">
//                         <select
//                             name="subCategory"
//                             value={formData.subCategory}
//                             onChange={handleChange}
//                             className="w-full bg-transparent py-3 outline-none text-gray-700"
//                         >
//                             <option value="">Select Sub Category</option>
//                         </select>
//                     </div>

//                     {/* Empty Spacer */}
//                     <div className="h-2"></div>

//                     <div className="rounded-md border border-gray-400 bg-transparent px-2">
//                         <select
//                             name="deepChildCategory"
//                             value={formData.deepChildCategory}
//                             onChange={handleChange}
//                             className="w-full bg-transparent py-3 outline-none text-gray-700"
//                         >
//                             <option value="">Select Deep Child Category</option>
//                         </select>
//                     </div>

//                     <div className="relative rounded-md border border-blue-900 bg-transparent px-2 py-1">
//                         <label className="absolute -top-2 left-2 bg-indigo-50 px-1 text-xs text-blue-800">Select Sub Deep Child Category</label>
//                         <select
//                             name="subDeepChildCategory"
//                             value={formData.subDeepChildCategory}
//                             onChange={handleChange}
//                             className="w-full bg-transparent py-2 outline-none text-gray-700"
//                         >
//                             <option value=""></option>
//                         </select>
//                     </div>

//                     <div className="rounded-md border-b border-gray-400 bg-transparent px-2 pt-2">
//                         <select
//                             name="contactMethod"
//                             value={formData.contactMethod}
//                             onChange={handleChange}
//                             className="w-full bg-transparent py-3 outline-none text-gray-700"
//                         >
//                             <option value="">Select Contact Method</option>
//                             <option value="Phone">Phone</option>
//                             <option value="Email">Email</option>
//                         </select>
//                     </div>

//                 </div>
//             </div>

//             <button
//                 onClick={handleSubmit}
//                 disabled={loading}
//                 className="w-full rounded-full bg-blue-900 py-4 text-lg font-bold text-white shadow-lg transition-transform active:scale-95 hover:bg-blue-800 disabled:bg-gray-400"
//             >
//                 {loading ? "Booking..." : "Book Service Now"}
//             </button>

//         </div>
//     );
// }


"use client";

import React, { useState } from "react";
import { Loader2, MapPin } from "lucide-react"; // Icons ke liye

const api = {
  post: async (url: string, data: any) => {
    // Mock API call
    return new Promise(resolve => setTimeout(resolve, 1000));
  }
};

export default function ServiceBooking() {
    const [formData, setFormData] = useState({
        fullName: "",
        phone: "",
        location: "",
        house: "",
        street: "",
        city: "",
        state: "",
        pincode: "",
        mainCategory: "",
        subCategory: "",
        deepChildCategory: "",
        subDeepChildCategory: "",
        contactMethod: ""
    });
    const [loading, setLoading] = useState(false);
    const [gettingLocation, setGettingLocation] = useState(false);
    const [locationError, setLocationError] = useState<string | null>(null);

    // ✅ GET CURRENT LOCATION FUNCTION
    const getCurrentLocation = () => {
        setGettingLocation(true);
        setLocationError(null);
        
        // Check if browser supports geolocation
        if (!navigator.geolocation) {
            setLocationError("Geolocation is not supported by your browser");
            setGettingLocation(false);
            return;
        }

        // Get current position
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                try {
                    const { latitude, longitude } = position.coords;
                    
                    // Reverse geocoding using Nominatim (OpenStreetMap) - FREE
                    const response = await fetch(
                        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`
                    );
                    
                    if (!response.ok) {
                        throw new Error("Failed to fetch location details");
                    }
                    
                    const data = await response.json();
                    
                    if (data && data.address) {
                        const address = data.address;
                        
                        // Update form data with location details
                        setFormData(prev => ({
                            ...prev,
                            location: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
                            house: address.house_number || address.building || address.house || "",
                            street: address.road || address.street || "",
                            city: address.city || address.town || address.village || address.county || "",
                            state: address.state || "",
                            pincode: address.postcode || ""
                        }));
                        
                        // Show success message
                        alert(`📍 Location fetched successfully!\nCoordinates: ${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
                    } else {
                        setLocationError("Could not decode address from coordinates");
                    }
                } catch (error) {
                    console.error("Location fetch error:", error);
                    setLocationError("Failed to get address details. Please enter manually.");
                    
                    // Still update with coordinates if reverse geocoding fails
                    const { latitude, longitude } = position.coords;
                    setFormData(prev => ({
                        ...prev,
                        location: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`
                    }));
                    alert(`📍 Coordinates fetched: ${latitude.toFixed(6)}, ${longitude.toFixed(6)}\nPlease fill address manually.`);
                } finally {
                    setGettingLocation(false);
                }
            },
            (error) => {
                // Handle geolocation errors
                let errorMessage = "Failed to get location";
                
                switch(error.code) {
                    case error.PERMISSION_DENIED:
                        errorMessage = "Location permission denied. Please enable location services.";
                        break;
                    case error.POSITION_UNAVAILABLE:
                        errorMessage = "Location information unavailable.";
                        break;
                    case error.TIMEOUT:
                        errorMessage = "Location request timed out.";
                        break;
                    default:
                        errorMessage = "An unknown error occurred.";
                }
                
                setLocationError(errorMessage);
                setGettingLocation(false);
                alert(`❌ ${errorMessage}`);
            },
            {
                enableHighAccuracy: true, // Higher accuracy
                timeout: 10000, // 10 seconds timeout
                maximumAge: 0 // Don't use cached position
            }
        );
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear location error when user starts typing
        if (name !== "phone" && locationError) {
            setLocationError(null);
        }
    };

    const handleSubmit = async () => {
        // Basic validation
        if (!formData.fullName || !formData.phone || !formData.mainCategory) {
            alert("Please fill required fields (Name, Phone, Main Category)");
            return;
        }

        try {
            setLoading(true);
            await api.post("/booking", formData);
            alert("Service Booked Successfully!");
            // Reset form
            setFormData({
                fullName: "",
                phone: "",
                location: "",
                house: "",
                street: "",
                city: "",
                state: "",
                pincode: "",
                mainCategory: "",
                subCategory: "",
                deepChildCategory: "",
                subDeepChildCategory: "",
                contactMethod: ""
            });
            setLocationError(null);
        } catch (error) {
            console.error("Booking failed", error);
            alert("Failed to book service. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mx-auto max-w-lg animate-fade-in pb-12">
            {/* Header */}
            <div className="mb-6 rounded-lg bg-blue-900 p-6 text-center text-white shadow-md">
                <h1 className="text-2xl font-bold">Direct Service Booking</h1>
                <p className="mt-2 text-sm text-blue-100">Book service in just few clicks</p>
            </div>

            {/* Customer Details Card */}
            <div className="mb-6 rounded-xl border border-gray-200 bg-indigo-50/50 p-6 shadow-sm">
                <h2 className="mb-4 text-lg font-bold text-gray-900">Customer Details</h2>

                <div className="space-y-4">
                    <input
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        placeholder="Full Name *"
                        className="w-full rounded-md border border-gray-400 bg-transparent px-4 py-3 outline-none focus:border-blue-500 placeholder:text-gray-500"
                    />

                    <div className="flex gap-2">
                        <div className="relative flex-1">
                            <input
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="Phone Number *"
                                className="w-full rounded-md border border-gray-400 bg-transparent px-4 py-3 outline-none focus:border-blue-500 placeholder:text-gray-500"
                                type="tel"
                            />
                            {formData.phone && (
                                <div className="absolute right-3 top-3.5">
                                    <span className="text-xs text-green-600 font-medium">✓</span>
                                </div>
                            )}
                        </div>
                        <button
                            onClick={getCurrentLocation}
                            disabled={gettingLocation}
                            className="flex items-center gap-2 whitespace-nowrap rounded-md border border-blue-600 bg-blue-600 px-4 py-3 font-medium text-white hover:bg-blue-700 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {gettingLocation ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    <span>Getting...</span>
                                </>
                            ) : (
                                <>
                                    <MapPin className="h-4 w-4" />
                                    <span>Get Location</span>
                                </>
                            )}
                        </button>
                    </div>

                    {/* Location Status */}
                    {locationError && (
                        <div className="rounded-md bg-red-50 border border-red-200 p-3">
                            <p className="text-sm text-red-600">{locationError}</p>
                            <p className="mt-1 text-xs text-red-500">
                                Please enter address manually below
                            </p>
                        </div>
                    )}

                    {formData.location && !locationError && (
                        <div className="rounded-md bg-green-50 border border-green-200 p-3">
                            <div className="flex items-start gap-2">
                                <MapPin className="h-4 w-4 text-green-600 mt-0.5" />
                                <div>
                                    <p className="text-sm font-medium text-green-800">
                                        ✓ Location fetched successfully
                                    </p>
                                    <p className="text-xs text-green-600 mt-1">
                                        Coordinates: {formData.location}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="pt-2">
                        <h3 className="mb-3 text-sm font-bold text-gray-900">
                            {formData.location ? "Address Details (Auto-filled)" : "Address Details (Fill if location not shared)"}
                        </h3>
                        <div className="space-y-3">
                            <input
                                name="house"
                                value={formData.house}
                                onChange={handleChange}
                                placeholder="House/Flat Number, Building Name"
                                className="w-full rounded-md border border-gray-400 bg-transparent px-4 py-3 outline-none focus:border-blue-500 placeholder:text-gray-500"
                            />
                            <input
                                name="street"
                                value={formData.street}
                                onChange={handleChange}
                                placeholder="Street, Area, Landmark"
                                className="w-full rounded-md border border-gray-400 bg-transparent px-4 py-3 outline-none focus:border-blue-500 placeholder:text-gray-500"
                            />
                            <div className="grid grid-cols-2 gap-3">
                                <input
                                    name="city"
                                    value={formData.city}
                                    onChange={handleChange}
                                    placeholder="City"
                                    className="w-full rounded-md border border-gray-400 bg-transparent px-4 py-3 outline-none focus:border-blue-500 placeholder:text-gray-500"
                                />
                                <input
                                    name="state"
                                    value={formData.state}
                                    onChange={handleChange}
                                    placeholder="State"
                                    className="w-full rounded-md border border-gray-400 bg-transparent px-4 py-3 outline-none focus:border-blue-500 placeholder:text-gray-500"
                                />
                            </div>
                            <input
                                name="pincode"
                                value={formData.pincode}
                                onChange={handleChange}
                                placeholder="Pincode"
                                className="w-full rounded-md border border-gray-400 bg-transparent px-4 py-3 outline-none focus:border-blue-500 placeholder:text-gray-500"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Service Details Card */}
            <div className="mb-8 rounded-xl border border-gray-200 bg-indigo-50/50 p-6 shadow-sm">
                <h2 className="mb-4 text-lg font-bold text-gray-900">Service Details</h2>

                <div className="space-y-4">
                    <div className="rounded-md border border-gray-400 bg-transparent px-2">
                        <select
                            name="mainCategory"
                            value={formData.mainCategory}
                            onChange={handleChange}
                            className="w-full bg-transparent py-3 outline-none text-gray-700"
                            required
                        >
                            <option value="">Select Main Category *</option>
                            <option value="AC">AC</option>
                            <option value="Plumbing">Plumbing</option>
                            <option value="Electrical">Electrical</option>
                            <option value="Carpentry">Carpentry</option>
                            <option value="Cleaning">Cleaning</option>
                        </select>
                    </div>

                    <div className="rounded-md border border-gray-400 bg-transparent px-2">
                        <select
                            name="subCategory"
                            value={formData.subCategory}
                            onChange={handleChange}
                            className="w-full bg-transparent py-3 outline-none text-gray-700"
                        >
                            <option value="">Select Sub Category</option>
                            {/* Dynamic options would go here */}
                        </select>
                    </div>

                    <div className="h-2"></div>

                    <div className="rounded-md border border-gray-400 bg-transparent px-2">
                        <select
                            name="deepChildCategory"
                            value={formData.deepChildCategory}
                            onChange={handleChange}
                            className="w-full bg-transparent py-3 outline-none text-gray-700"
                        >
                            <option value="">Select Deep Child Category</option>
                        </select>
                    </div>

                    <div className="relative rounded-md border border-blue-900 bg-transparent px-2 py-1">
                        <label className="absolute -top-2 left-2 bg-indigo-50 px-1 text-xs text-blue-800">
                            Select Sub Deep Child Category
                        </label>
                        <select
                            name="subDeepChildCategory"
                            value={formData.subDeepChildCategory}
                            onChange={handleChange}
                            className="w-full bg-transparent py-2 outline-none text-gray-700"
                        >
                            <option value=""></option>
                        </select>
                    </div>

                    <div className="rounded-md border-b border-gray-400 bg-transparent px-2 pt-2">
                        <select
                            name="contactMethod"
                            value={formData.contactMethod}
                            onChange={handleChange}
                            className="w-full bg-transparent py-3 outline-none text-gray-700"
                        >
                            <option value="">Select Contact Method</option>
                            <option value="Phone">Phone</option>
                            <option value="Email">Email</option>
                            <option value="WhatsApp">WhatsApp</option>
                        </select>
                    </div>
                </div>
            </div>

            <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full rounded-full bg-blue-900 py-4 text-lg font-bold text-white shadow-lg transition-transform active:scale-95 hover:bg-blue-800 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
                {loading ? (
                    <span className="flex items-center justify-center gap-2">
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Booking...
                    </span>
                ) : (
                    "Book Service Now"
                )}
            </button>

            {/* Privacy Note */}
            <div className="mt-6 text-center">
                <p className="text-xs text-gray-500">
                    Your location is only used for service delivery and will not be shared with third parties.
                </p>
            </div>
        </div>
    );
}
