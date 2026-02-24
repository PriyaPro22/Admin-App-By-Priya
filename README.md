# 🎯 PriyaPro Admin App

**Complete Category Management System for E-Commerce Platform**

---

## ✨ Features

### Category Management (5 Levels)
- **Main Category** - Top-level categories
- **Sub Category** - Categories under main
- **Child Category** - Service types (Repair, Services, Installation)
- **Deep Child Category** - Detailed service offerings
- **SubDeep Child Category** - Most granular level

### Core Functionality
✅ **CRUD Operations** - Create, Read, Update, Delete for all levels  
✅ **Hierarchical Navigation** - Navigate through category tree  
✅ **Visibility Controls** - Field-level visibility toggles  
✅ **Media Management** - Image and video upload support  
✅ **Price Management** - Original price, discount, GST calculations  
✅ **Search & Filter** - Quick category search  
✅ **Edit Mode** - Full editing support across all levels  

---

## 🚀 Quick Start

### Development Mode
```powershell
npm install
npm run dev
```

### Production Build
```powershell
npm run build
npm start
```

**Access:** `http://localhost:3000`

---

## 📚 Documentation

The project follows standard Next.js App Router structure. For API details and state management, refer to the code in `app/context` and `app/components`.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 14
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **State Management**: React Context API
- **HTTP Client**: Fetch API

---

## 📁 Project Structure

```
app/
├── components/
│   ├── forms/              # All category forms
│   ├── CategoryList.tsx    # List view component
│   └── InventoryDashboard.tsx  # Main dashboard
├── context/
│   └── CategoryContext.tsx # Global state management
└── utils/
    └── generateCategoryId.ts  # ID generation utility
```

---

## 🔧 Configuration

### API Endpoints
Base URL: `https://api.bijliwalaaya.in/api/product-listing/`

### Authentication
- Bearer token from localStorage
- Custom header: `x-api-token`

---

## 📝 Recent Updates

### February 3, 2026
- ✅ Added edit functionality for Child Categories
- ✅ Enhanced SubDeep Category editing
- ✅ Fixed all TypeScript errors
- ✅ Improved error handling
- ✅ Production-ready build
- ✅ Complete documentation

---

## 🐛 Known Issues

None - All critical issues resolved!

---

## 👨‍💻 Development

### Available Scripts
```powershell
npm run dev      # Development server
npm run build    # Production build
npm start        # Start production server
npm run lint     # Run linter
```

---

## 📞 Support

For issues or questions:
1. Review error logs in browser console
2. Contact development team

---

## 📄 License

Proprietary - PriyaPro Admin System

---

**Status:** ✅ Production Ready  
**Version:** 1.0.0  
**Last Updated:** February 3, 2026
