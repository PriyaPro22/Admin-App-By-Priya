"use client";

import { useState } from "react";
import {
  Settings,
  User,
  Bell,
  Shield,
  Globe,
  Palette,
  Lock,
  Key,
  Mail,
  Smartphone,
  Moon,
  Sun,
  Save,
  RefreshCw,
  AlertTriangle,
  ChevronRight,
  Building2,
  Wallet,
  Database,
  HardDrive,
  Users,
  Clock,
  Eye,
  Link,
  Webhook,
  Award,
  FileText,
  CreditCard,
  Sliders,
  HelpCircle,
  LogOut,
  Menu,
  X
} from "lucide-react";

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState("profile");
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);

  // Settings state
  const [settings, setSettings] = useState({
    // Profile Settings
    fullName: "John Doe",
    email: "john.doe@bwa.com",
    phone: "+91 9876543210",
    designation: "Super Admin",
    department: "Administration",
    profileImage: null,
    
    // Company Settings
    companyName: "BWA Admin",
    companyEmail: "admin@bwa.com",
    companyPhone: "+91 1234567890",
    address: "123 Business Park, Mumbai - 400001",
    gstNumber: "27AAABC1234A1Z5",
    panNumber: "ABCDE1234F",
    
    // General Settings
    siteName: "BWA Admin Dashboard",
    siteDescription: "Manage your business operations efficiently",
    language: "english",
    timezone: "Asia/Kolkata",
    dateFormat: "DD/MM/YYYY",
    timeFormat: "12h",
    currency: "INR",
    
    // Appearance
    theme: "light",
    sidebarCollapsed: false,
    compactView: false,
    animations: true,
    
    // Notifications
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    marketingEmails: false,
    securityAlerts: true,
    bookingAlerts: true,
    paymentAlerts: true,
    
    // Security
    twoFactorAuth: true,
    sessionTimeout: "30",
    passwordExpiry: "90",
    loginNotifications: true,
    ipWhitelisting: false,
    
    // Privacy
    profileVisibility: "private",
    showOnlineStatus: true,
    allowDataCollection: false,
    
    // Financial Settings
    taxRate: "18",
    paymentTerms: "30",
    invoicePrefix: "INV-2024-",
    gstEnabled: true,
    
    // Integration Settings
    razorpayEnabled: true,
    emailService: "smtp",
    smsProvider: "twilio",
    mapProvider: "google",
    
    // Role & Permission Settings
    defaultUserRole: "partner",
    allowSelfRegistration: false,
    requireApproval: true,
    
    // Backup Settings
    autoBackup: true,
    backupFrequency: "daily",
    retentionDays: "30"
  });

  const sidebarSections = [
    {
      id: "profile",
      label: "Profile Settings",
      icon: User,
      subItems: [
        { id: "personal", label: "Personal Information" },
        { id: "company", label: "Company Details" }
      ]
    },
    {
      id: "general",
      label: "General",
      icon: Globe,
      subItems: [
        { id: "site", label: "Site Configuration" },
        { id: "localization", label: "Localization" }
      ]
    },
    {
      id: "appearance",
      label: "Appearance",
      icon: Palette,
      subItems: [
        { id: "theme", label: "Theme & Layout" },
        { id: "customization", label: "Customization" }
      ]
    },
    {
      id: "notifications",
      label: "Notifications",
      icon: Bell,
      subItems: [
        { id: "email", label: "Email Preferences" },
        { id: "push", label: "Push Notifications" },
        { id: "sms", label: "SMS Alerts" }
      ]
    },
    {
      id: "security",
      label: "Security",
      icon: Shield,
      subItems: [
        { id: "authentication", label: "Authentication" },
        { id: "sessions", label: "Session Management" },
        { id: "audit", label: "Audit Logs" }
      ]
    },
    {
      id: "financial",
      label: "Financial",
      icon: Wallet,
      subItems: [
        { id: "taxes", label: "Tax Settings" },
        { id: "invoicing", label: "Invoicing" },
        { id: "payments", label: "Payment Gateways" }
      ]
    },
    {
      id: "integrations",
      label: "Integrations",
      icon: Link,
      subItems: [
        { id: "api", label: "API Configuration" },
        { id: "webhooks", label: "Webhooks" },
        { id: "third-party", label: "Third Party Services" }
      ]
    },
    {
      id: "roles",
      label: "Roles & Permissions",
      icon: Users,
      subItems: [
        { id: "roles", label: "User Roles" },
        { id: "permissions", label: "Permissions" },
        { id: "access", label: "Access Control" }
      ]
    },
    {
      id: "advanced",
      label: "Advanced",
      icon: Database,
      subItems: [
        { id: "backup", label: "Backup & Restore" },
        { id: "maintenance", label: "Maintenance" },
        { id: "logs", label: "System Logs" }
      ]
    }
  ];

  const handleSave = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);
    alert("Settings saved successfully!");
  };

  const handleReset = () => {
    if (confirm("Reset all settings to default?")) {
      // Reset logic
    }
  };

  const handleChange = (field, value) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden">
      {/* Mobile Sidebar Toggle */}
      <button
        onClick={() => setShowMobileSidebar(!showMobileSidebar)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg"
      >
        <Menu className="w-5 h-5 text-gray-600 dark:text-gray-300" />
      </button>

      {/* Sidebar Overlay for Mobile */}
      {showMobileSidebar && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setShowMobileSidebar(false)}
        />
      )}

      {/* Settings Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-50
        transform transition-transform duration-300 ease-in-out
        ${showMobileSidebar ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        w-72 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 overflow-y-auto
      `}>
        <div className="p-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center gap-2">
              <Settings className="w-5 h-5 text-blue-500" />
              Settings
            </h2>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="hidden lg:block p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
            >
              <ChevronRight className={`w-5 h-5 text-gray-500 transform transition-transform ${!sidebarOpen && 'rotate-180'}`} />
            </button>
          </div>

          {/* Sidebar Navigation */}
          <nav className="space-y-1">
            {sidebarSections.map((section) => {
              const Icon = section.icon;
              return (
                <div key={section.id} className="space-y-1">
                  <button
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${
                      activeSection === section.id
                        ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-5 h-5" />
                      <span className="text-sm font-medium">{section.label}</span>
                    </div>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                  
                  {/* Sub-items */}
                  {activeSection === section.id && (
                    <div className="ml-8 space-y-1">
                      {section.subItems.map((subItem) => (
                        <button
                          key={subItem.id}
                          className="w-full text-left px-3 py-1.5 text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 rounded"
                        >
                          {subItem.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Logout Button */}
          <div className="mt-8 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
              <LogOut className="w-5 h-5" />
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 z-30 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="lg:hidden w-10" /> {/* Spacer for mobile menu */}
              <div className="flex-1 lg:flex-none">
                <h1 className="text-xl lg:text-2xl font-semibold text-gray-800 dark:text-white">
                  {sidebarSections.find(s => s.id === activeSection)?.label} Settings
                </h1>
                <p className="text-xs lg:text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Manage your {sidebarSections.find(s => s.id === activeSection)?.label.toLowerCase()} preferences
                </p>
              </div>
              <div className="flex items-center gap-2 lg:gap-3">
                <button
                  onClick={handleReset}
                  className="hidden lg:block px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600"
                >
                  Reset
                </button>
                <button
                  onClick={handleSave}
                  disabled={isLoading}
                  className="px-4 lg:px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span className="hidden lg:inline">Saving...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span className="hidden lg:inline">Save Changes</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Settings Content */}
        <div className="p-4 lg:p-6">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Profile Settings Section */}
            {activeSection === "profile" && (
              <>
                {/* Personal Information */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                  <div className="p-4 lg:p-6 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-base lg:text-lg font-semibold text-gray-800 dark:text-white flex items-center gap-2">
                      <User className="w-5 h-5 text-blue-500" />
                      Personal Information
                    </h2>
                  </div>
                  <div className="p-4 lg:p-6">
                    <div className="flex flex-col lg:flex-row gap-6">
                      {/* Profile Image Upload */}
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-24 h-24 lg:w-32 lg:h-32 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-3xl lg:text-4xl font-bold">
                          {settings.fullName.split(' ').map(n => n[0]).join('')}
                        </div>
                        <button className="text-xs lg:text-sm text-blue-600 dark:text-blue-400 hover:underline">
                          Change Photo
                        </button>
                      </div>

                      {/* Form Fields */}
                      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs lg:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Full Name
                          </label>
                          <input
                            type="text"
                            value={settings.fullName}
                            onChange={(e) => handleChange("fullName", e.target.value)}
                            className="w-full px-3 lg:px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-xs lg:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Email Address
                          </label>
                          <input
                            type="email"
                            value={settings.email}
                            onChange={(e) => handleChange("email", e.target.value)}
                            className="w-full px-3 lg:px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-xs lg:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Phone Number
                          </label>
                          <input
                            type="tel"
                            value={settings.phone}
                            onChange={(e) => handleChange("phone", e.target.value)}
                            className="w-full px-3 lg:px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-xs lg:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Designation
                          </label>
                          <input
                            type="text"
                            value={settings.designation}
                            onChange={(e) => handleChange("designation", e.target.value)}
                            className="w-full px-3 lg:px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Company Details */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                  <div className="p-4 lg:p-6 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-base lg:text-lg font-semibold text-gray-800 dark:text-white flex items-center gap-2">
                      <Building2 className="w-5 h-5 text-purple-500" />
                      Company Details
                    </h2>
                  </div>
                  <div className="p-4 lg:p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs lg:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Company Name
                        </label>
                        <input
                          type="text"
                          value={settings.companyName}
                          onChange={(e) => handleChange("companyName", e.target.value)}
                          className="w-full px-3 lg:px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700"
                        />
                      </div>
                      <div>
                        <label className="block text-xs lg:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Company Email
                        </label>
                        <input
                          type="email"
                          value={settings.companyEmail}
                          onChange={(e) => handleChange("companyEmail", e.target.value)}
                          className="w-full px-3 lg:px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700"
                        />
                      </div>
                      <div>
                        <label className="block text-xs lg:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          GST Number
                        </label>
                        <input
                          type="text"
                          value={settings.gstNumber}
                          onChange={(e) => handleChange("gstNumber", e.target.value)}
                          className="w-full px-3 lg:px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700"
                        />
                      </div>
                      <div>
                        <label className="block text-xs lg:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          PAN Number
                        </label>
                        <input
                          type="text"
                          value={settings.panNumber}
                          onChange={(e) => handleChange("panNumber", e.target.value)}
                          className="w-full px-3 lg:px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700"
                        />
                      </div>
                      <div className="lg:col-span-2">
                        <label className="block text-xs lg:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Address
                        </label>
                        <textarea
                          value={settings.address}
                          onChange={(e) => handleChange("address", e.target.value)}
                          rows={3}
                          className="w-full px-3 lg:px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* General Settings Section */}
            {activeSection === "general" && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="p-4 lg:p-6 border-b border-gray-200 dark:border-gray-700">
                  <h2 className="text-base lg:text-lg font-semibold text-gray-800 dark:text-white flex items-center gap-2">
                    <Globe className="w-5 h-5 text-blue-500" />
                    Site Configuration
                  </h2>
                </div>
                <div className="p-4 lg:p-6 space-y-4">
                  <div>
                    <label className="block text-xs lg:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Site Name
                    </label>
                    <input
                      type="text"
                      value={settings.siteName}
                      onChange={(e) => handleChange("siteName", e.target.value)}
                      className="w-full px-3 lg:px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700"
                    />
                  </div>
                  <div>
                    <label className="block text-xs lg:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Site Description
                    </label>
                    <textarea
                      value={settings.siteDescription}
                      onChange={(e) => handleChange("siteDescription", e.target.value)}
                      rows={3}
                      className="w-full px-3 lg:px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700"
                    />
                  </div>

                  <h3 className="text-sm lg:text-base font-medium text-gray-800 dark:text-white pt-4 border-t border-gray-200 dark:border-gray-700">
                    Localization
                  </h3>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs lg:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Language
                      </label>
                      <select
                        value={settings.language}
                        onChange={(e) => handleChange("language", e.target.value)}
                        className="w-full px-3 lg:px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                      >
                        <option value="english">English</option>
                        <option value="hindi">हिन्दी (Hindi)</option>
                        <option value="gujarati">ગુજરાતી (Gujarati)</option>
                        <option value="marathi">मराठी (Marathi)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs lg:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Timezone
                      </label>
                      <select
                        value={settings.timezone}
                        onChange={(e) => handleChange("timezone", e.target.value)}
                        className="w-full px-3 lg:px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                      >
                        <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                        <option value="Asia/Dubai">Asia/Dubai (GST)</option>
                        <option value="Asia/Singapore">Asia/Singapore (SGT)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs lg:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Currency
                      </label>
                      <select
                        value={settings.currency}
                        onChange={(e) => handleChange("currency", e.target.value)}
                        className="w-full px-3 lg:px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                      >
                        <option value="INR">INR (₹)</option>
                        <option value="USD">USD ($)</option>
                        <option value="EUR">EUR (€)</option>
                        <option value="GBP">GBP (£)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs lg:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Date Format
                      </label>
                      <select
                        value={settings.dateFormat}
                        onChange={(e) => handleChange("dateFormat", e.target.value)}
                        className="w-full px-3 lg:px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                      >
                        <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                        <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                        <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Security Settings Section */}
            {activeSection === "security" && (
              <div className="space-y-6">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                  <div className="p-4 lg:p-6 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-base lg:text-lg font-semibold text-gray-800 dark:text-white flex items-center gap-2">
                      <Shield className="w-5 h-5 text-green-500" />
                      Authentication Settings
                    </h2>
                  </div>
                  <div className="p-4 lg:p-6 space-y-4">
                    <div className="flex items-center justify-between p-3 lg:p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <div>
                        <h3 className="text-sm lg:text-base font-medium text-gray-900 dark:text-white">Two-Factor Authentication</h3>
                        <p className="text-xs lg:text-sm text-gray-500 dark:text-gray-400">Add extra security to your account</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.twoFactorAuth}
                          onChange={(e) => handleChange("twoFactorAuth", e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-10 lg:w-11 h-5 lg:h-6 bg-gray-200 peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 lg:after:h-5 after:w-4 lg:after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-3 lg:p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <div>
                        <h3 className="text-sm lg:text-base font-medium text-gray-900 dark:text-white">Login Notifications</h3>
                        <p className="text-xs lg:text-sm text-gray-500 dark:text-gray-400">Get alerts for new logins</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.loginNotifications}
                          onChange={(e) => handleChange("loginNotifications", e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-10 lg:w-11 h-5 lg:h-6 bg-gray-200 peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 lg:after:h-5 after:w-4 lg:after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                      </label>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs lg:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Session Timeout (minutes)
                        </label>
                        <select
                          value={settings.sessionTimeout}
                          onChange={(e) => handleChange("sessionTimeout", e.target.value)}
                          className="w-full px-3 lg:px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                        >
                          <option value="15">15 minutes</option>
                          <option value="30">30 minutes</option>
                          <option value="60">1 hour</option>
                          <option value="120">2 hours</option>
                          <option value="240">4 hours</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs lg:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Password Expiry (days)
                        </label>
                        <select
                          value={settings.passwordExpiry}
                          onChange={(e) => handleChange("passwordExpiry", e.target.value)}
                          className="w-full px-3 lg:px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                        >
                          <option value="30">30 days</option>
                          <option value="60">60 days</option>
                          <option value="90">90 days</option>
                          <option value="never">Never</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Change Password Section */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                  <div className="p-4 lg:p-6 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-base lg:text-lg font-semibold text-gray-800 dark:text-white flex items-center gap-2">
                      <Key className="w-5 h-5 text-orange-500" />
                      Change Password
                    </h2>
                  </div>
                  <div className="p-4 lg:p-6">
                    <div className="space-y-4 max-w-md">
                      <div>
                        <label className="block text-xs lg:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Current Password
                        </label>
                        <input
                          type="password"
                          className="w-full px-3 lg:px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700"
                          placeholder="Enter current password"
                        />
                      </div>
                      <div>
                        <label className="block text-xs lg:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          New Password
                        </label>
                        <input
                          type="password"
                          className="w-full px-3 lg:px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700"
                          placeholder="Enter new password"
                        />
                      </div>
                      <div>
                        <label className="block text-xs lg:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Confirm New Password
                        </label>
                        <input
                          type="password"
                          className="w-full px-3 lg:px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700"
                          placeholder="Confirm new password"
                        />
                      </div>
                      <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700">
                        Update Password
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Notifications Settings Section */}
            {activeSection === "notifications" && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="p-4 lg:p-6 border-b border-gray-200 dark:border-gray-700">
                  <h2 className="text-base lg:text-lg font-semibold text-gray-800 dark:text-white flex items-center gap-2">
                    <Bell className="w-5 h-5 text-yellow-500" />
                    Notification Preferences
                  </h2>
                </div>
                <div className="p-4 lg:p-6">
                  <div className="space-y-4">
                    {/* Email Notifications */}
                    <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                      <div className="p-4 bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-blue-500" />
                          <h3 className="text-sm lg:text-base font-medium text-gray-900 dark:text-white">Email Notifications</h3>
                        </div>
                      </div>
                      <div className="p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs lg:text-sm text-gray-700 dark:text-gray-300">Marketing Emails</span>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={settings.marketingEmails}
                              onChange={(e) => handleChange("marketingEmails", e.target.checked)}
                              className="sr-only peer"
                            />
                            <div className="w-10 lg:w-11 h-5 lg:h-6 bg-gray-200 rounded-full peer peer-checked:bg-blue-600 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 lg:after:h-5 after:w-4 lg:after:w-5 after:transition-all"></div>
                          </label>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs lg:text-sm text-gray-700 dark:text-gray-300">Security Alerts</span>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={settings.securityAlerts}
                              onChange={(e) => handleChange("securityAlerts", e.target.checked)}
                              className="sr-only peer"
                            />
                            <div className="w-10 lg:w-11 h-5 lg:h-6 bg-gray-200 rounded-full peer peer-checked:bg-blue-600 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 lg:after:h-5 after:w-4 lg:after:w-5 after:transition-all"></div>
                          </label>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs lg:text-sm text-gray-700 dark:text-gray-300">Booking Updates</span>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={settings.bookingAlerts}
                              onChange={(e) => handleChange("bookingAlerts", e.target.checked)}
                              className="sr-only peer"
                            />
                            <div className="w-10 lg:w-11 h-5 lg:h-6 bg-gray-200 rounded-full peer peer-checked:bg-blue-600 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 lg:after:h-5 after:w-4 lg:after:w-5 after:transition-all"></div>
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* Push Notifications */}
                    <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                      <div className="p-4 bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
                        <div className="flex items-center gap-2">
                          <Smartphone className="w-4 h-4 text-green-500" />
                          <h3 className="text-sm lg:text-base font-medium text-gray-900 dark:text-white">Push Notifications</h3>
                        </div>
                      </div>
                      <div className="p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs lg:text-sm text-gray-700 dark:text-gray-300">Enable Push Notifications</span>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={settings.pushNotifications}
                              onChange={(e) => handleChange("pushNotifications", e.target.checked)}
                              className="sr-only peer"
                            />
                            <div className="w-10 lg:w-11 h-5 lg:h-6 bg-gray-200 rounded-full peer peer-checked:bg-blue-600 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 lg:after:h-5 after:w-4 lg:after:w-5 after:transition-all"></div>
                          </label>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs lg:text-sm text-gray-700 dark:text-gray-300">Payment Alerts</span>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={settings.paymentAlerts}
                              onChange={(e) => handleChange("paymentAlerts", e.target.checked)}
                              className="sr-only peer"
                            />
                            <div className="w-10 lg:w-11 h-5 lg:h-6 bg-gray-200 rounded-full peer peer-checked:bg-blue-600 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 lg:after:h-5 after:w-4 lg:after:w-5 after:transition-all"></div>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Appearance Settings Section */}
            {activeSection === "appearance" && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="p-4 lg:p-6 border-b border-gray-200 dark:border-gray-700">
                  <h2 className="text-base lg:text-lg font-semibold text-gray-800 dark:text-white flex items-center gap-2">
                    <Palette className="w-5 h-5 text-purple-500" />
                    Theme & Layout
                  </h2>
                </div>
                <div className="p-4 lg:p-6 space-y-6">
                  <div>
                    <label className="block text-xs lg:text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      Theme Mode
                    </label>
                    <div className="flex flex-col lg:flex-row gap-3">
                      <button
                        onClick={() => handleChange("theme", "light")}
                        className={`flex items-center justify-center gap-2 p-3 lg:p-4 border-2 rounded-lg transition-all ${
                          settings.theme === "light"
                            ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                            : "border-gray-200 dark:border-gray-700 hover:border-gray-300"
                        }`}
                      >
                        <Sun className="w-4 h-4 lg:w-5 lg:h-5 text-yellow-500" />
                        <span className="text-xs lg:text-sm font-medium">Light</span>
                      </button>
                      <button
                        onClick={() => handleChange("theme", "dark")}
                        className={`flex items-center justify-center gap-2 p-3 lg:p-4 border-2 rounded-lg transition-all ${
                          settings.theme === "dark"
                            ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                            : "border-gray-200 dark:border-gray-700 hover:border-gray-300"
                        }`}
                      >
                        <Moon className="w-4 h-4 lg:w-5 lg:h-5 text-blue-500" />
                        <span className="text-xs lg:text-sm font-medium">Dark</span>
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 lg:p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <div>
                        <h3 className="text-xs lg:text-sm font-medium text-gray-900 dark:text-white">Compact Sidebar</h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Minimize sidebar for more space</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.sidebarCollapsed}
                          onChange={(e) => handleChange("sidebarCollapsed", e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-10 lg:w-11 h-5 lg:h-6 bg-gray-200 rounded-full peer peer-checked:bg-blue-600 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 lg:after:h-5 after:w-4 lg:after:w-5 after:transition-all"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-3 lg:p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <div>
                        <h3 className="text-xs lg:text-sm font-medium text-gray-900 dark:text-white">Enable Animations</h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Smooth transitions and effects</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.animations}
                          onChange={(e) => handleChange("animations", e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-10 lg:w-11 h-5 lg:h-6 bg-gray-200 rounded-full peer peer-checked:bg-blue-600 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 lg:after:h-5 after:w-4 lg:after:w-5 after:transition-all"></div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* System Status Card - Shows in all sections */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-4 lg:p-6 text-white">
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <HardDrive className="w-6 h-6 lg:w-8 lg:h-8" />
                  <div>
                    <h3 className="text-sm lg:text-base font-semibold">System Status</h3>
                    <p className="text-xs lg:text-sm opacity-90">All systems operational</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 lg:flex gap-4 lg:gap-6">
                  <div>
                    <div className="text-xs opacity-75">Database</div>
                    <div className="text-sm lg:text-base font-semibold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 lg:w-2 lg:h-2 bg-green-300 rounded-full"></span>
                      Connected
                    </div>
                  </div>
                  <div>
                    <div className="text-xs opacity-75">Storage</div>
                    <div className="text-sm lg:text-base font-semibold">45% Used</div>
                  </div>
                  <div>
                    <div className="text-xs opacity-75">API</div>
                    <div className="text-sm lg:text-base font-semibold">99.9%</div>
                  </div>
                  <div>
                    <div className="text-xs opacity-75">Users</div>
                    <div className="text-sm lg:text-base font-semibold">1.2k Online</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Danger Zone */}
            <div className="p-4 lg:p-6 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-xl">
              <div className="flex flex-col lg:flex-row items-start gap-4">
                <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-lg">
                  <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm lg:text-base font-semibold text-red-800 dark:text-red-400">Danger Zone</h3>
                  <p className="text-xs lg:text-sm text-red-600 dark:text-red-400 mt-1">
                    Irreversible actions that can affect your account and data
                  </p>
                  <div className="mt-4 flex flex-col lg:flex-row gap-3">
                    <button className="px-4 py-2 text-xs lg:text-sm font-medium text-red-600 dark:text-red-400 bg-white dark:bg-gray-800 border border-red-300 dark:border-red-800 rounded-lg hover:bg-red-50">
                      Export All Data
                    </button>
                    <button 
                      onClick={() => setShowDeleteConfirm(true)}
                      className="px-4 py-2 text-xs lg:text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700"
                    >
                      Delete Account
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl max-w-md w-full p-4 lg:p-6">
            <div className="flex items-center gap-3 text-red-600 dark:text-red-400 mb-4">
              <AlertTriangle className="w-5 h-5 lg:w-6 lg:h-6" />
              <h3 className="text-base lg:text-lg font-semibold">Confirm Deletion</h3>
            </div>
            <p className="text-xs lg:text-sm text-gray-600 dark:text-gray-400 mb-6">
              Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently removed.
            </p>
            <div className="flex flex-col lg:flex-row gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-4 py-2 text-xs lg:text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  alert("Account deletion initiated");
                  setShowDeleteConfirm(false);
                }}
                className="flex-1 px-4 py-2 text-xs lg:text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700"
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}