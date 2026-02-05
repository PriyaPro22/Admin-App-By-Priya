// export const BASE_URL = "https://api.bijliwalaaya.in/api/product-listing";
// // In a real app, use process.env.NEXT_PUBLIC_API_TOKEN
// const API_TOKEN = "SERVICE_API_TOKEN"; 

// const getHeaders = () => ({
//     "Content-Type": "application/json",
//     "x-api-token": API_TOKEN,
// });

// export const api = {
//     get: async (url: string) => {
//         const response = await fetch(`${BASE_URL}${url}`, {
//             method: "GET",
//             headers: getHeaders(),
//         });
//         if (!response.ok) throw new Error(`GET API Error: ${response.statusText}`);
//         return response.json();
//     },
//     post: async (url: string, body: any) => {
//         const response = await fetch(`${BASE_URL}${url}`, {
//             method: "POST",
//             headers: getHeaders(),
//             body: JSON.stringify(body),
//         });
//         if (!response.ok) throw new Error(`POST API Error: ${response.statusText}`);
//         return response.json();
//     },
//     put: async (url: string, body: any) => {
//         const response = await fetch(`${BASE_URL}${url}`, {
//             method: "PUT",
//             headers: getHeaders(),
//             body: JSON.stringify(body),
//         });
//         if (!response.ok) throw new Error(`PUT API Error: ${response.statusText}`);
//         return response.json();
//     },
//     delete: async (url: string) => {
//         const response = await fetch(`${BASE_URL}${url}`, {
//             method: "DELETE",
//             headers: getHeaders(),
//         });
//         if (!response.ok) throw new Error(`DELETE API Error: ${response.statusText}`);
//         return response.json(); // Some delete APIs return content, some don't.
//     },
// };


import axios from 'axios';

// API base configuration
export const BASE_URL = process.env.NEXT_PUBLIC_API_DOMAIN ? `${process.env.NEXT_PUBLIC_API_DOMAIN}/api/product-listing` : 'https://api.bijliwalaaya.in/api/product-listing';
export const API_TOKEN = process.env.NEXT_PUBLIC_API_TOKEN || 'super_secure_token';

// Create axios instance with default config
export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'x-api-token': API_TOKEN,
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);