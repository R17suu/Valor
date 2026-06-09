// src/layouts/CitizenLayout.jsx
import { NavLink } from "react-router-dom";
import { Home, ClipboardList, Map, User, Plus, Menu, Bell } from "lucide-react";
import ApplicationLogo from "../Components/ApplicationLogo";
import ValorLogo from "@/assets/valor.png";

export default function CitizenLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#F4F7F5] text-gray-900">
      {/* Mobile Layout Wrapper */}
      <div className="mx-auto min-h-screen max-w-md bg-white shadow-xl lg:hidden">
        {/* Mobile Header */}
        <header className="flex items-center justify-between px-5 pt-5">
          <button className="rounded-lg p-2 hover:bg-gray-100">
            <Menu size={22} />
          </button>

          <div className="flex items-center gap-1">
            <div>
              <ApplicationLogo />
            </div>

            <div>
              {/* <h1 className="text-xl font-extrabold tracking-wide text-green-800">
                VAL<span className="text-red-600">O</span>R
              </h1> */}
               <img src={ValorLogo} alt="Valor Logo" className="h-5 w-auto" />
              <p className="text-[10px] font-medium leading-tight text-gray-500">
                Valencia Automated <br /> Local Operations & Response
              </p>
            </div>
          </div>

          <button className="rounded-lg p-2 hover:bg-gray-100">
            <Bell size={22} />
          </button>
        </header>

        {/* Page Content */}
        <main className="pb-28">{children}</main>

        {/* Mobile Bottom Navigation */}
        <nav className="fixed bottom-0 left-1/2 z-50 w-full max-w-md -translate-x-1/2 rounded-t-3xl bg-white px-6 py-3 shadow-[0_-8px_30px_rgba(0,0,0,0.08)]">
          <div className="grid grid-cols-5 items-center text-xs">
            <MobileNavItem to="/home" icon={<Home size={20} />} label="Home" />
            <MobileNavItem
              to="/reports"
              icon={<ClipboardList size={20} />}
              label="Reports"
            />

            <div className="flex justify-center">
              <NavLink
                to="/report-issue"
                className={({ isActive }) =>
                  `-mt-8 flex h-14 w-14 items-center justify-center rounded-full shadow-lg ring-4 ring-white transition ${
                    isActive
                      ? "bg-green-700 text-white"
                      : "bg-white text-green-700"
                  }`
                }
              >
                <Plus size={28} />
              </NavLink>
            </div>

            <MobileNavItem to="/map" icon={<Map size={20} />} label="Map" />
            <MobileNavItem
              to="/profile"
              icon={<User size={20} />}
              label="Profile"
            />
          </div>
        </nav>
      </div>

      {/* Desktop Layout Wrapper */}
      <div className="hidden min-h-screen lg:flex">
        {/* Sidebar */}
        <aside className="fixed left-0 top-0 flex h-screen w-68 flex-col bg-white px-6 py-6 shadow-sm">
          <div className="flex items-center gap-3">
            <ApplicationLogo size={56} />

            <div>
              {/* <h1 className="text-2xl font-extrabold text-green-800">
                VAL<span className="text-red-600">O</span>R
              </h1> */}
               <img src={ValorLogo} alt="Valor Logo" className="h-6 w-auto" />
              <p className="text-xs text-gray-500 mt-1">Smart Community Reporting</p>
            </div>
          </div>

          <nav className="mt-10 space-y-2">
            <DesktopNavItem
              to="/home"
              icon={<Home size={20} />}
              label="Home Dashboard"
            />
            <DesktopNavItem
              to="/reports"
              icon={<ClipboardList size={20} />}
              label="My Reports"
            />
            <DesktopNavItem
              to="/map"
              icon={<Map size={20} />}
              label="Incident Map"
            />
            <DesktopNavItem
              to="/profile"
              icon={<User size={20} />}
              label="Profile"
            />
          </nav>

          <div className="mt-auto rounded-2xl bg-green-50 p-4">
            <p className="text-sm font-semibold text-green-900">
              See an issue in your area?
            </p>
            <p className="mt-1 text-xs text-green-700">
              Report it directly to the LGU.
            </p>
            <NavLink to="/report-issue" className="mt-3 block rounded-xl bg-green-700 py-3 text-center text-sm font-semibold text-white hover:bg-green-800">
              Submit Report
            </NavLink>
          </div>
        </aside>

        {/* Desktop Content */}
        <main className="ml-68 min-h-screen flex-1 px-8 py-6">{children}</main>
      </div>
    </div>
  );
}

function MobileNavItem({ to, icon, label }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex flex-col items-center gap-1 ${
          isActive ? "text-green-700" : "text-gray-400"
        }`
      }
    >
      {icon}
      <span className="text-[11px] font-semibold">{label}</span>
    </NavLink>
  );
}

function DesktopNavItem({ to, icon, label }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition ${
          isActive
            ? "bg-green-700 text-white"
            : "text-gray-600 hover:bg-green-50 hover:text-green-700"
        }`
      }
    >
      {icon}
      {label}
    </NavLink>
  );
}
