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
  LogOut,
  Menu,
  ChevronDown,
  Search,
  Calendar,
  Bell,
  User,
} from "lucide-react";
import ApplicationLogo from "../Components/ApplicationLogo";

const navigation = [
  {
    name: "Overview",
    href: "/admin/overview",
    icon: LayoutDashboard,
  },
  {
    name: "Reports",
    href: "/admin/reports",
    icon: ClipboardList,
  },
  {
    name: "Map",
    href: "/admin/map",
    icon: Map,
  },
  {
    name: "Departments",
    href: "/admin/departments",
    icon: Building2,
  },
  {
    name: "Analytics",
    href: "/admin/analytics",
    icon: BarChart3,
  },
  {
    name: "Users",
    href: "/admin/users",
    icon: Users,
  },
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
        className={`fixed inset-y-0 left-0 z-50 w-64 transform bg-linear-to-b from-green-900 via-green-800 to-green-950 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-24 items-center gap-3 px-6 py-6">
           <ApplicationLogo size={46}/>

            <div className="flex flex-col leading-tight">
              <span className="text-xl font-extrabold tracking-wide text-white">
                VALOR
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-wide text-green-100">
                LGU Dashboard
              </span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = pathname.startsWith(item.href);

              return (
                <NavLink
                  key={item.name}
                  to={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition ${
                    isActive
                      ? "bg-green-600 text-white shadow-sm"
                      : "text-green-100 hover:bg-green-800 hover:text-white"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  {item.name}
                </NavLink>
              );
            })}
          </nav>

          {/* Sidebar Footer */}
          <div className="border-t border-green-700/60 px-5 py-5">
            <div className="flex items-center gap-3 rounded-2xl bg-green-800/70 p-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-400 text-sm font-extrabold text-green-950">
                V
              </div>

              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-white">
                  City of Valencia
                </p>
                <p className="text-xs text-green-100">Administrator</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <header className="sticky top-0 z-30 border-b border-zinc-200 bg-white shadow-sm">
          <div className="flex h-16 items-center gap-4 px-4 sm:px-6">
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
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                <input
                  type="text"
                  placeholder="Search reports, incidents, barangays..."
                  className="h-10 w-full rounded-xl border border-zinc-200 bg-zinc-50 pl-10 pr-4 text-sm focus:border-green-700 focus:outline-none focus:ring-1 focus:ring-green-700"
                />
              </div>
            </div>

            {/* Right section */}
            <div className="flex items-center gap-3">
              {/* Date range picker (moved from Overview) */}
              <div className="hidden sm:block">
                <button className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 shadow-sm">
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
                  <div className="absolute right-0 mt-2 w-80 overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-lg">
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
                  className="flex items-center gap-3 rounded-xl px-3 py-2 hover:bg-zinc-100"
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
                  <div className="absolute right-0 mt-2 w-52 overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-lg">
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
        <main className="p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}