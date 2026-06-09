// src/layouts/AdminLayout.jsx
import { useState } from "react";
import { NavLink, Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  ClipboardList,
  Map,
  Building2,
  BarChart3,
  Users,
  Settings,
  MapPin,
  LogOut,
  Menu,
  ChevronDown,
  Search,
  Calendar,
  Bell,
  User,
  Info,
} from "lucide-react";
import ApplicationLogo from "../Components/ApplicationLogo";
import ValorLogo from "@/assets/valor.png";
import CitySeal from "@/assets/seal.png";

const navigation = [
  {
    name: "Overview",
    href: "/admin/overview",
    icon: LayoutDashboard,
  },
  {
    name: "Resident Complaints",
    href: "/admin/reports",
    icon: ClipboardList,
  },
  {
    name: "Heat Map",
    href: "/admin/map",
    icon: Map,
  },
  {
    name: "Barangays",
    href: "/admin/barangays",
    icon: MapPin,
  },
  {
    name: "Departments",
    href: "/admin/departments",
    icon: Building2,
  },
  // {
  //   name: "Analytics",
  //   href: "/admin/analytics",
  //   icon: BarChart3,
  // },
  // {
  //   name: "Users",
  //   href: "/admin/users",
  //   icon: Users,
  // },
  {
    name: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
];

const auth = {
  user: {
    name: "Juan Dela Cruz",
    email: "admin@valencia.gov.ph",
  },
  role: "LGU Admin",
};

export default function AdminLayout({ children, header }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);

  const location = useLocation();
  const pathname = location.pathname;

  const notifications = [
    {
      id: 1,
      message: "New road damage report submitted",
      time: "5 min ago",
      unread: true,
    },
    {
      id: 2,
      message: "Flooding incident updated to In Progress",
      time: "1 hour ago",
      unread: true,
    },
    {
      id: 3,
      message: "Streetlight report assigned to City Engineer",
      time: "2 hours ago",
      unread: false,
    },
  ];

  return (
    <div className="min-h-screen bg-zinc-50">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          className="fixed inset-0 z-40 bg-zinc-900/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen w-[min(17.5rem,calc(100vw-1rem))] flex-col bg-white px-5 py-5 shadow-sm transform transition-transform duration-300 ease-in-out lg:w-68 lg:px-6 lg:py-6 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col overflow-y-auto">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <ApplicationLogo size={56} />

            <div>
              {/* <h1 className="text-2xl font-extrabold text-green-800">
                VAL<span className="text-red-600">O</span>R
              </h1> */}
              <img src={ValorLogo} alt="Valor Logo" className="h-6 w-auto" />
              <p className="text-xs text-gray-500 mt-1">LGU Dashboard</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="mt-10 space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = pathname.startsWith(item.href);

              return (
                <NavLink
                  key={item.name}
                  to={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                    isActive
                      ? "bg-green-700 text-white"
                      : "text-gray-600 hover:bg-green-50 hover:text-green-700"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  {item.name}
                </NavLink>
              );
            })}
          </nav>

          {/* Sidebar Footer */}
          <div className="mt-auto">
            <div className="flex items-center gap-3 rounded-[1.4rem] bg-gradient-to-r from-green-900 via-green-800 to-green-700 px-3.5 py-3 text-white shadow-[0_16px_30px_rgba(20,83,45,0.22)]">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/15">
                <img
                  src={CitySeal}
                  alt="City of Valencia seal"
                  className="h-8.5 w-8.5 rounded-full object-cover"
                />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-semibold leading-tight text-green-100">
                  City of Valencia
                </p>
                <p className="mt-0.5 text-sm font-bold leading-tight text-white">
                  Administrator
                </p>
              </div>

              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/15">
                <Info className="h-4 w-4 text-green-50" />
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="min-w-0 lg:ml-68">
        {/* Top bar */}
        <header className="sticky top-0 z-30 border-b border-zinc-200 bg-white shadow-sm">
          <div className="flex h-16 items-center gap-2.5 px-4 sm:gap-4 sm:px-6">
            {/* Mobile menu button */}
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="text-zinc-500 hover:text-zinc-900 lg:hidden"
            >
              <Menu className="h-6 w-6" />
            </button>

            {/* Page title */}
            {header && (
              <div>
                <h1 className="text-xl font-bold text-zinc-900">{header}</h1>
              </div>
            )}

            {/* Search bar */}
            <div className="ml-auto hidden w-full max-w-md md:block">
                {/* <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                  <input
                    type="text"
                    placeholder="Search reports, incidents, barangays..."
                    className="h-10 w-full rounded-xl border border-zinc-200 bg-zinc-50 pl-10 pr-4 text-sm focus:border-green-700 focus:outline-none focus:ring-1 focus:ring-green-700"
                  />
                </div> */}
            </div>

            {/* Right section */}
            <div className="flex items-center gap-1.5 sm:gap-3">
              {/* Date range picker (moved from Overview) */}
              <div className="hidden sm:block">
                <button className="flex items-center gap-2 rounded-xl border border-gray-100 bg-white px-4 py-3 text-sm font-semibold text-gray-700 shadow-sm">
                  <Calendar size={17} />
                  June 1 - June 8, 2025
                  <ChevronDown size={16} />
                </button>
              </div>

              {/* Notifications with count */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setNotificationOpen(!notificationOpen)}
                  className="relative rounded-xl p-3 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900"
                >
                  <Bell className="h-5 w-5" />
                  <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white">
                    {notifications.length}
                  </span>
                </button>

                {notificationOpen && (
                  <div className="absolute right-0 mt-2 w-[min(20rem,calc(100vw-2rem))] overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-lg">
                    <div className="border-b border-zinc-200 px-4 py-3">
                      <h3 className="font-semibold text-zinc-900">
                        Notifications
                      </h3>
                    </div>

                    <div className="max-h-96 overflow-y-auto">
                      {notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`border-b border-zinc-100 px-4 py-3 hover:bg-zinc-50 ${
                            notification.unread ? "bg-green-50/70" : ""
                          }`}
                        >
                          <p className="text-sm font-medium text-zinc-900">
                            {notification.message}
                          </p>
                          <p className="mt-1 text-xs text-zinc-500">
                            {notification.time}
                          </p>
                        </div>
                      ))}
                    </div>

                    <div className="border-t border-zinc-200 px-4 py-3 text-center">
                      <button className="text-sm font-semibold text-green-700 hover:text-green-800">
                        View all notifications
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* View Public Site Link */}
              <Link
                to="/home"
                className="hidden text-sm font-semibold text-zinc-600 hover:text-green-700 lg:block"
              >
                View Site
              </Link>

              {/* Profile dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 rounded-xl px-2 py-2 sm:gap-3 sm:px-3 hover:bg-zinc-100"
                >
                  {auth.user.avatar ? (
                    <img
                      src={auth.user.avatar}
                      alt={auth.user.name}
                      className="h-8 w-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-700 text-white">
                      <span className="text-sm font-semibold">
                        {auth.user.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}

                  <div className="hidden text-left lg:block">
                    <div className="text-sm font-semibold text-zinc-900">
                      {auth.user.name}
                    </div>
                    <div className="text-xs text-zinc-500">{auth.role}</div>
                  </div>

                  <ChevronDown className="hidden h-4 w-4 text-zinc-500 lg:block" />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-[min(13rem,calc(100vw-2rem))] overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-lg">
                    <div className="border-b border-zinc-200 px-4 py-3">
                      <div className="text-sm font-semibold text-zinc-900">
                        {auth.user.name}
                      </div>
                      <div className="truncate text-xs text-zinc-500">
                        {auth.user.email}
                      </div>
                    </div>

                    <div className="py-2">
                      <Link
                        to="/profile"
                        className="flex items-center gap-3 px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-100"
                      >
                        <User className="h-4 w-4" />
                        Profile
                      </Link>

                      <Link
                        to="/admin/settings"
                        className="flex items-center gap-3 px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-100"
                      >
                        <Settings className="h-4 w-4" />
                        Settings
                      </Link>
                    </div>

                    <div className="border-t border-zinc-200 py-2">
                      <button
                        type="button"
                        className="flex w-full items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        <LogOut className="h-4 w-4" />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="min-h-screen px-4 py-4 sm:px-6 sm:py-5 lg:px-8 lg:py-6">
          {children}
        </main>
      </div>
    </div>
  );
}
