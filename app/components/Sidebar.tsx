"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Handshake,
  Package,
  Settings,
  Banknote,
  ShieldCheck,
  LifeBuoy,
  X,
  Settings2,
  Zap,
  Headphones,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Power,
  Sun,
  Moon,
  Smartphone
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  isHovered: boolean;
  onHoverChange: (hovered: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  isCollapsed,
  onToggleCollapse,
  isHovered,
  onHoverChange
}) => {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();

  const isDark = theme === "dark";

  // Use state to manage which menus are expanded (for sub-items)
  const [expandedMenus, setExpandedMenus] = React.useState<string[]>([]);

  // Auto-expand menus based on current path
  React.useEffect(() => {
    menuItems.forEach(item => {
      if (item.subItems?.some(sub => pathname === sub.href)) {
        setExpandedMenus(prev => prev.includes(item.name) ? prev : [...prev, item.name]);
      }
    });
  }, [pathname]);

  // const menuItems = [
  //   { name: "Dashboard", icon: LayoutDashboard, href: "/" },
  //   { name: "User Management", icon: Users, href: "/user-management" },
  //   {
  //     name: "Partner Management",
  //     icon: Handshake,
  //     href: "/partner-management",
  //     subItems: [
  //       { name: "Partner App", href: "/partner-management/partner-app" },
  //       { name: "Partners", href: "/partner-management/partners" },
  //       { name: "Dealer Panel", href: "/partner-management/dealer-panel" }
  //     ]
  //   },
  //   { name: "Service Management", icon: Power, href: "/service-booking" },
  //   { name: "Inventory Management", icon: Package, href: "/inventory-management" },
  //   { name: "Utilities", icon: Settings, href: "/utilities" },
  //   { name: "Finance", icon: Banknote, href: "/finance" },
  //   { name: "Roles & Permission", icon: ShieldCheck, href: "/add-role" },
  // ];
const menuItems = [
  { name: "Dashboard", icon: LayoutDashboard, href: "/" },
  { name: "User Management", icon: Users, href: "/user-management",
      subItems: [
       { name: "Users", href: "/user-management/users", icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
        { name: "User App", href: "/user-management", icon: Smartphone, color: "text-green-600", bg: "bg-green-50" },
     
    ]
   },


  {
    name: "Partner Management",
    icon: Handshake,
    href: "/partner-management",
    subItems: [
      { name: "Partner App", href: "/partner-management/partner-app" },
      { name: "Partners", href: "/partner-management/partners" },
      { name: "Dealer Panel", href: "/partner-management/dealer-panel" },
     
    ]
  },
  { name: "Service Management", icon: Power, href: "/service-booking" },
  { name: "Inventory Management", icon: Package, href: "/inventory-management" },
  { name: "Utilities", icon: Settings, href: "/utilities" },
  { name: "Finance", icon: Banknote, href: "/finance" },
  { name: "Roles & Permission", icon: ShieldCheck, href: "/add-role" },
];

React.useEffect(() => {
  menuItems.forEach(item => {
    if (item.subItems?.some(sub => pathname === sub.href)) {
      setExpandedMenus(prev =>
        prev.includes(item.name) ? prev : [...prev, item.name]
      );
    }
  });
}, [pathname]);

  const toggleMenu = (name: string) => {
    setExpandedMenus(prev =>
      prev.includes(name) ? prev.filter(m => m !== name) : [...prev, name]
    );
  };

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside 
        className={`fixed  top-0 left-0 z-50 h-screen transition-all duration-300 md:translate-x-0 flex flex-col ${isOpen ? "translate-x-0" : "-translate-x-full"
          } ${isCollapsed && !isHovered ? "w-24" : "w-72"
          } ${isDark ? "bg-[#0b1437] border-r border-gray-800" : "bg-white border-r border-gray-100"
          } ${isHovered && isCollapsed ? 'shadow-2xl ring-1 ring-black/5' : 'shadow-xl'}`}
      >
        {/* Logo Section */}
        <div
  className={`flex items-center ${
    (isCollapsed && !isHovered) ? 'justify-center' : 'px-8'
  } mt-4 relative transition-all duration-300 overflow-visible`}
>
  {/* Logo + Title */}
  <div
    className="flex items-center gap-4 cursor-pointer"
    onClick={() => isCollapsed && onToggleCollapse()}
  >
    <div
      className={`flex items-center justify-center rounded-xl bg-[#0070f3]
      shadow-lg shadow-blue-500/20 transition-all duration-300
      ${(isCollapsed && !isHovered) ? 'h-11 w-11' : 'h-12 w-12'}`}
    >
      <Zap
        className="text-white fill-white"
        size={(isCollapsed && !isHovered) ? 20 : 24}
      />
    </div>

    {!(isCollapsed && !isHovered) && (
      <span
        className={`text-2xl font-bold tracking-tight animate-in fade-in duration-300
        ${isDark ? 'text-white' : 'text-[#2B3674]'}`}
      >
        BWA Admin
      </span>
    )}
  </div>

  {/* Mobile Close Button */}
  {!isCollapsed && (
    <button
      onClick={onClose}
      className="ml-auto md:hidden relative z-50 text-gray-500
      hover:bg-gray-100 p-1 rounded-full transition-colors
      bg-white shadow-sm"
    >
      <X size={24} />
    </button>
  )}

  {/* Desktop Collapse Toggle */}
  <button
    onClick={onToggleCollapse}
    className={`hidden md:flex absolute -right-5 top-1/2 -translate-y-1/2
    h-10 w-10 rounded-full border-2 shadow-xl
    items-center justify-center transition-all z-50
    ${isDark
      ? 'bg-[#111C44] border-gray-800 text-white hover:bg-[#1B2559]'
      : 'bg-white border-gray-100 text-[#2B3674] hover:bg-gray-50'
    }`}
  >
    <ChevronLeft
      size={18}
      strokeWidth={3}
      className={`transition-transform duration-300
      ${isCollapsed ? 'rotate-180' : ''} text-[#0070f3]`}
    />
  </button>
</div>


        {/* Navigation Items */}
        <nav className={`flex-1 ${(isCollapsed && !isHovered) ? 'px-3 overflow-visible' : 'px-4 overflow-y-auto custom-scrollbar'} py-6 transition-all duration-300`}>
          <ul className="space-y-1">
            {menuItems.map((item) => {
              const hasSubItems = !!item.subItems;
              const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));

              // Ensure Partner Management isExpanded if we are on a details page
              const isPartnerDetails = pathname.startsWith('/partner-management/partners/');
              const isMenuExpanded = expandedMenus.includes(item.name) || (item.name === "Partner Management" && isPartnerDetails);
              const isExpanded = isMenuExpanded && !(isCollapsed && !isHovered);

              return (
                <li key={item.name} className="relative group/item">
                  {/* Vertical active bar for main item */}
                  {isActive && !hasSubItems && (
                    <div className="absolute left-0 top-0 bottom-0 w-[5px] bg-[#0070f3] rounded-r-lg z-10" />
                  )}

                  {hasSubItems ? (
                    <div>
                      <button
                        onClick={() => {
                          if (isCollapsed) {
                            onToggleCollapse();
                          } else {
                            toggleMenu(item.name);
                          }
                        }}
                        className={`w-full flex items-center ${(isCollapsed && !isHovered) ? 'justify-center px-0' : 'gap-4 px-5'} rounded-xl py-2.5 text-[15px] font-semibold transition-all ${isActive
                          ? (isDark ? "bg-[#1B254B] text-white" : "bg-[#F4F7FE] text-[#0070f3]")
                          : (isDark ? "text-[#A3AED0] hover:bg-[#1B2559] hover:text-white" : "text-[#707EAE] hover:bg-gray-50 hover:text-[#2B3674]")
                          }`}
                      >
                        <item.icon className={`h-6 w-6 min-w-[24px] ${isActive ? (isDark ? "text-white" : "text-[#0070f3]") : "text-inherit"} transition-all`} />
                        {!(isCollapsed && !isHovered) && (
                          <>
                            <span className="flex-1 text-left animate-in fade-in duration-300">{item.name}</span>
                            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                          </>
                        )}
                      </button>

                      {/* Sub Items */}
                      {isExpanded && !(isCollapsed && !isHovered) && (
                        <ul className="mt-1 ml-14 space-y-2.5 py-2 animate-in slide-in-from-left-2 duration-300">
                          {item.subItems?.map((sub) => {
                            const isSubActive = pathname === sub.href;
                            return (
                              <li key={sub.name}>
                                <Link
                                  href={sub.href}
                                  className={`block text-[15px] font-bold transition-all ${isSubActive
                                    ? "text-[#0070f3]"
                                    : (isDark ? "text-[#A3AED0] hover:text-white" : "text-[#707EAE] hover:text-[#2B3674]")
                                    }`}
                                  onClick={onClose}
                                >
                                  {sub.name}
                                </Link>
                              </li>
                            );
                          })}
                        </ul>
                      )}
                    </div>
                  ) : (
                    <Link
                      href={item.href}
                      className={`flex items-center ${(isCollapsed && !isHovered) ? 'justify-center px-0' : 'gap-4 px-5'} rounded-xl py-2.5 text-[15px] font-semibold transition-all ${isActive
                        ? (isDark ? "bg-[#1B254B] text-white" : "bg-[#F4F7FE] text-[#2B3674]")
                        : (isDark ? "text-[#A3AED0] hover:bg-[#1B2559] hover:text-white" : "text-[#707EAE] hover:bg-gray-50 hover:text-[#2B3674]")
                        }`}
                      onClick={(e) => {
                        if (isCollapsed) {
                          e.preventDefault();
                          onToggleCollapse();
                        } else {
                          onClose();
                        }
                      }}
                    >
                      <item.icon className={`h-6 w-6 min-w-[24px] ${isActive ? (isDark ? "text-white" : "text-[#0070f3]") : "text-inherit"} transition-all`} />
                      {!(isCollapsed && !isHovered) && <span className="flex-1 animate-in fade-in duration-300">{item.name}</span>}
                    </Link>
                  )}


                  {/* Tooltip for Collapsed State */}
                  {isCollapsed && !isHovered && (
                    <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 z-[50] hidden group-hover/item:block">
                      <div className={`${isDark ? 'bg-white text-[#1B2559]' : 'bg-[#1B2559] text-white'} px-3 py-1.5 rounded-lg shadow-xl text-sm font-medium whitespace-nowrap animate-in fade-in slide-in-from-left-2 duration-200 relative`}>
                        {item.name}
                        <div className={`absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-2 rotate-45 ${isDark ? 'bg-white' : 'bg-[#1B2559]'}`}></div>
                      </div>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>

          {!(isCollapsed && !isHovered) && (
            <div className="mt-10 px-2 pb-6 animate-in fade-in duration-500">
              <button className="w-full bg-[#0070f3] hover:bg-blue-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-500/20 flex items-center justify-center gap-3 transition-all active:scale-95 group">
                <div className="bg-white/20 p-1.5 rounded-full group-hover:bg-white/30 transition-colors">
                  <LifeBuoy className="h-4 w-4" />
                </div>
                Support
              </button>
            </div>
          )}
        </nav>

        {/* Profile Footer */}
        <div className={`p-6 border-t transition-all duration-300 ${isDark ? 'border-gray-800 bg-[#0B1437]' : 'border-gray-100 bg-white'} ${(isCollapsed && !isHovered) ? 'flex justify-center' : ''}`}>
          <div className={`flex items-center ${(isCollapsed && !isHovered) ? 'flex-col gap-4' : 'justify-between w-full'}`}>
            <div className={`flex items-center gap-3 cursor-pointer relative group/profile`} onClick={() => isCollapsed && onToggleCollapse()}>
              <div className={`rounded-2xl overflow-hidden border-2 border-transparent hover:border-blue-500 transition-all ${(isCollapsed && !isHovered) ? 'h-10 w-10' : 'h-12 w-12'}`}>
                <img
                  src="https://img.freepik.com/free-photo/portrait-white-man-isolated_53876-40306.jpg"
                  alt="Admin"
                  className="h-full w-full object-cover"
                />
              </div>

              {/* Profile Tooltip */}
              {isCollapsed && !isHovered && (
                <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 z-[50] hidden group-hover/profile:block">
                  <div className={`${isDark ? 'bg-white text-[#1B2559]' : 'bg-[#1B2559] text-white'} px-3 py-1.5 rounded-lg shadow-xl text-sm font-medium whitespace-nowrap animate-in fade-in slide-in-from-left-2 duration-200 relative`}>
                    John Doe
                    <div className={`absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-2 rotate-45 ${isDark ? 'bg-white' : 'bg-[#1B2559]'}`}></div>
                  </div>
                </div>
              )}

              {!(isCollapsed && !isHovered) && (
                <div className="animate-in fade-in duration-300">
                  <div className={`text-sm font-bold tracking-tight ${isDark ? 'text-white' : 'text-[#2B3674]'}`}>John Doe</div>
                  <div className="text-[11px] text-[#707EAE] font-semibold">Super Admin</div>
                </div>
              )}
            </div>
            {!(isCollapsed && !isHovered) && (
              <div className="flex items-center gap-1 animate-in fade-in duration-300">
                <button
                  onClick={toggleTheme}
                  className={`p-2 rounded-xl transition-all ${isDark ? 'text-yellow-400 hover:bg-[#1B2559]' : 'text-gray-400 hover:bg-gray-50 hover:text-blue-600'}`}
                >
                  {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                </button>
                <button className={`p-2 rounded-xl transition-colors ${isDark ? 'text-[#A3AED0] hover:bg-[#1B2559] hover:text-white' : 'text-[#A3AED0] hover:bg-gray-50 hover:text-[#2B3674]'}`}>
                  <Settings2 className="h-5 w-5" />
                </button>
              </div>
            )}
            {(isCollapsed && !isHovered) && (
              <button
                onClick={onToggleCollapse}
                className="p-2 text-[#A3AED0] hover:text-[#0070f3] transition-colors"
                title="Expand Sidebar"
              >
                <ChevronRight size={20} strokeWidth={2.5} />
              </button>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
