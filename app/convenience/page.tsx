"use client";

import { useState, useEffect } from "react";

// Types
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
interface CityPolicy {
  city_name: string;
  cityTitle?: string;   // 👈 ADD THIS
  is_active: boolean;
  cityDescription?: string;
  area_type: 'all' | 'urban' | 'rural';
  free_radius_km: number;
  per_km_rate: number;
  availability_threshold: number;
  imageUrl?: string | null;
  videoUrl?: string | null;
}
// ✅ FIXED: Removed `import { Policy } from "@mui/icons-material"` — it conflicted with this interface
interface Policy {
  _id: string;
  stateName: string;
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
  const API_BASE = "https://live.bijliwalaaya.in/api/conveyance-policies";

  const headers = {
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
    image: null as File | null
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
        if (policy.stateName) {
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
      stateName:policy.stateName|| "",
      cityName: "",
      stateTitle: policy.stateTitle || "",
      stateDescription: policy.stateDescription || "",
      cityTitle: "",
      cityDescription: "",
      areaType: policy.area_type || "all",
      freeRadius: policy.free_radius_km?.toString() || "",
      perKmRate: policy.per_km_rate?.toString() || "",
      threshold: policy.availability_threshold?.toString() || "",
    image: null
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
     stateName: policy.stateName || "",
      cityName: city.city_name || "",
      stateTitle: policy.stateTitle || "",
      stateDescription: policy.stateDescription || "",
      cityTitle: city.cityTitle || "",
      cityDescription: city.cityDescription || "",
      areaType: city.area_type || policy.area_type || "all",
      freeRadius: city.free_radius_km?.toString() || policy.free_radius_km?.toString() || "",
      perKmRate: city.per_km_rate?.toString() || policy.per_km_rate?.toString() || "",
      threshold: city.availability_threshold?.toString() || policy.availability_threshold?.toString() || "",
     image: null
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
  // const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = e.target.files?.[0];
  //   if (file) {
  //     const reader = new FileReader();
  //     reader.onloadend = () => {
  //       const imageData = reader.result as string;
  //       setImagePreview(imageData);
  //       setFormData(prev => ({ ...prev, image: imageData }));
  //     };
  //     reader.readAsDataURL(file);
  //   }
  // };
const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;

  setImagePreview(URL.createObjectURL(file));

  setFormData(prev => ({
    ...prev,
    image: file   // 👈 FILE store karo, base64 nahi
  }));
};
  // Toggle State Visibility
  const toggleStateVisibility = async (policyId: string, currentStatus: boolean) => {
    try {
    const res = await fetch(`${API_BASE}/${policyId}`, {
  method: "PATCH",
  headers: {
    "Content-Type": "application/json",
    "x-api-token": "super_secure_token"
  },
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
  const toggleCityVisibility = async (
  stateName: string,
  cityName: string,
  currentStatus: boolean
) => {
  try {
    const res = await fetch(
      `${API_BASE}/${stateName}/cities/visibility`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-api-token": "super_secure_token",
        },
        body: JSON.stringify({
          city_name: cityName,
          is_active: !currentStatus,
        }),
      }
    );

    const data = await res.json();
    if (data.success) {
      fetchPolicies();
    }
  } catch (err) {
    console.error(err);
  }
};
const savePolicy = async () => {
  try {
    if (!formData.freeRadius || !formData.perKmRate || !formData.threshold) {
      alert("Please fill all required fields");
      return;
    }

    let url = API_BASE;
    let method: "POST" | "PATCH" = "POST";
    let body: any = {};

    // =========================
    // STATE EDIT
    // =========================
    if (editingType === "state" && editingPolicy) {
      url = `${API_BASE}/${editingPolicy._id}`;
      method = "PATCH";

      body = {
        stateName: editingPolicy.stateName,
        stateTitle: formData.stateTitle,
        stateDescription: formData.stateDescription,
        area_type: formData.areaType,
        free_radius_km: Number(formData.freeRadius),
        per_km_rate: Number(formData.perKmRate),
        availability_threshold: Number(formData.threshold),
        state_active: editingPolicy.state_active,
      };
    }

    // =========================
    // CITY EDIT
    // =========================
    else if (editingType === "city" && editingPolicy) {
      url = `${API_BASE}/${editingPolicy._id}/cities`;
      method = "PATCH";

      body = {
        stateName: editingPolicy.stateName,
        city_name: formData.cityName,
        cityTitle: formData.cityTitle,
        cityDescription: formData.cityDescription,
        area_type: formData.areaType,
        free_radius_km: Number(formData.freeRadius),
        per_km_rate: Number(formData.perKmRate),
        availability_threshold: Number(formData.threshold),
        is_active: true,
      };
    }

    // =========================
    // CREATE NEW STATE + CITY
    // =========================
    else {
      if (!formData.stateName || !formData.cityName) {
        alert("State and City are required");
        return;
      }

      body = {
        stateName: formData.stateName,
        stateTitle: formData.stateTitle,
        stateDescription: formData.stateDescription,
        area_type: formData.areaType,
        free_radius_km: Number(formData.freeRadius),
        per_km_rate: Number(formData.perKmRate),
        availability_threshold: Number(formData.threshold),
        state_active: true,
        cities: [
          {
            city_name: formData.cityName,
            cityTitle: formData.cityTitle || formData.stateTitle,
            cityDescription:
              formData.cityDescription || formData.stateDescription,
            area_type: formData.areaType,
            free_radius_km: Number(formData.freeRadius),
            per_km_rate: Number(formData.perKmRate),
            availability_threshold: Number(formData.threshold),
            is_active: true,
          },
        ],
      };
    }

    // const res = await fetch(url, {
    //   method,
    //   headers: {
    //     "x-api-token": "super_secure_token",
    //   },
    //   body: JSON.stringify(body),
    // });
const formDataToSend = new FormData();

// append normal fields
// Object.keys(body).forEach((key) => {
//   formDataToSend.append(key, body[key]);
// });
Object.keys(body).forEach((key) => {
  if (Array.isArray(body[key])) {
    formDataToSend.append(key, JSON.stringify(body[key]));
  } else {
    formDataToSend.append(key, body[key]);
  }
});

// append image file
if (formData.image) {
  formDataToSend.append("image", formData.image);
}

const res = await fetch(url, {
  method,
  headers: {
    "x-api-token": "super_secure_token",
    // ❌ DON'T set Content-Type manually
  },
  body: formDataToSend,
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
    alert("Network error");
  }
};
  // Delete state policy
 
  // const deletePolicy = async (policyId: string) => {
  //   const confirmDelete = confirm("Are you sure you want to delete this policy?");

  //   if (!confirmDelete) return;

  //   try {
  //     const res = await fetch(`${API_BASE}/${policyId}`, {
  //       method: "DELETE",
  //       headers,
  //     });

  //     const data = await res.json();

  //     if (data.success) {
  //       alert("Policy Deleted Successfully ✅");
  //       fetchPolicies();
  //     } else {
  //       alert(data.message || "Delete failed");
  //     }

  //   } catch (error) {
  //     console.error("DELETE Error:", error);
  //   }
  // };
const deletePolicy = async (stateName: string) => {
  if (!confirm("Are you sure you want to delete this policy?")) return;

  try {
    const res = await fetch(`${API_BASE}/${stateName}`, {
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
                  {policy.stateTitle || policy.stateName}
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
                      onClick={() => toggleStateVisibility(policy.stateName, policy.state_active)}
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
                📍 {policy.stateName}
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
                    alt={policy.stateName}
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
                    onClick={() => deletePolicy(policy.stateName)}
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

                {/* Cities under this State */}
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
                            onClick={() =>
  toggleCityVisibility(policy.stateName, city.city_name, city.is_active)
}
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
            <p style={{ color: "#666", gridColumn: "span 2" }}>No state policy available.</p>
          )}
        </div>

        {/* ── Modal ─────────────────────────────────────────────────────────── */}
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
                {editingPolicy ? 'Policy Edit' : 'Create New Policy'}
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
                          style={{ width: "16px", height: "16px" }}
                        />
                        <span>🏙️ State</span>
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
                          style={{ width: "16px", height: "16px" }}
                        />
                        <span>📍 City</span>
                      </label>
                    </div>
                  </div>
                )}

                {/* State Select */}
                <div>
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
                {(formData.level === 'city' || editingType === 'city') && (
                  <div>
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
                      disabled={editingType === 'city' || !formData.stateName}
                      style={{
                        width: "100%",
                        padding: "12px",
                        border: "2px solid #e0e0e0",
                        borderRadius: "8px",
                        fontSize: "14px",
                        background: (editingType === 'city' || !formData.stateName) ? "#f5f5f5" : "white",
                        cursor: (editingType === 'city' || !formData.stateName) ? "not-allowed" : "pointer"
                      }}
                    >
                      <option value="">-- Select City --</option>
                      {availableCities.map((city) => (
                        <option key={city} value={city}>{city}</option>
                      ))}
                    </select>
                    {!formData.stateName && (
                      <small style={{ color: "#f57c00" }}>⚠️ Please select a State first</small>
                    )}
                  </div>
                )}

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
                    <option value="all">All</option>
                    <option value="urban">Urban</option>
                    <option value="rural">Rural</option>
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
                    type="text"
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
                    type="text"
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
                    Availability Threshold - Minimum technicians to show confirmed price?
                  </label>
                  <input
                    type="text"
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
                    If that many technicians are available, confirmed price will be shown; otherwise estimated price.
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
                        marginTop: "10px",
                        maxWidth: "200px",
                        maxHeight: "150px",
                        borderRadius: "8px",
                        objectFit: "cover"
                      }}
                    />
                  )}
                </div>

                {/* Buttons */}
                <div style={{
                  display: "flex",
                  gap: "15px",
                  marginTop: "10px"
                }}>
                  <button
                    onClick={savePolicy}
                    style={{
                      flex: 1,
                      padding: "12px",
                      background: "#2e7d32",
                      color: "white",
                      border: "none",
                      borderRadius: "8px",
                      fontSize: "16px",
                      fontWeight: "600",
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
                      borderRadius: "8px",
                      fontSize: "16px",
                      fontWeight: "600",
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
