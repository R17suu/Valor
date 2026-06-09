// src/Citizen/Profile.jsx
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  MapPin,
  ShieldCheck,
  FileText,
  CheckCircle,
  Clock,
  AlertTriangle,
  Settings,
  Bell,
  LogOut,
  Edit3,
} from "lucide-react";
import CitizenLayout from "../layouts/CitizenLayouts";

export default function Profile() {
  return (
    <CitizenLayout>
      {/* Mobile View */}
      <div className="lg:hidden">
        {/* <header className="flex items-center justify-between px-5 pt-5">
          <button className="rounded-lg p-2 hover:bg-gray-100">
            <ArrowLeft size={22} />
          </button>

          <div className="text-center">
            <h1 className="text-lg font-extrabold text-gray-900">
              Resident Profile
            </h1>
            <p className="text-xs text-gray-500">Manage Your Information</p>
          </div>

          <button className="rounded-lg p-2 hover:bg-gray-100">
            <Edit3 size={20} />
          </button>
        </header> */}

        <main className="px-5 pt-6">
          {/* Profile Card */}
          <section className="rounded-3xl bg-green-700 p-5 text-white shadow-sm">
            <div className="flex items-center gap-4">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white text-green-700">
                <User size={36} />
              </div>

              <div>
                <h2 className="text-xl font-extrabold">Juan Dela Cruz</h2>
                <p className="text-sm text-green-100">Resident Account</p>

                <div className="mt-2 inline-flex items-center gap-1 rounded-full bg-white/20 px-3 py-1 text-xs font-bold">
                  <ShieldCheck size={14} />
                  Verified Resident
                </div>
              </div>
            </div>
          </section>

          {/* Contact Info */}
          <section className="mt-5 rounded-3xl bg-white p-5 shadow-sm">
            <h3 className="text-sm font-extrabold text-gray-900">
              Personal Information
            </h3>

            <div className="mt-4 space-y-4">
              <InfoItem icon={<Mail size={18} />} label="Email" value="juan@example.com" />
              <InfoItem icon={<Phone size={18} />} label="Phone" value="0912 345 6789" />
              <InfoItem icon={<MapPin size={18} />} label="Address" value="Poblacion, Valencia City" />
            </div>
          </section>

          {/* Report Summary */}
          <section className="mt-5 grid grid-cols-2 gap-4">
            <ProfileStat
              icon={<FileText size={22} />}
              title="Total Reports"
              value="12"
              color="bg-green-50 text-green-700"
            />
            <ProfileStat
              icon={<Clock size={22} />}
              title="In Progress"
              value="4"
              color="bg-yellow-50 text-yellow-700"
            />
            <ProfileStat
              icon={<CheckCircle size={22} />}
              title="Resolved"
              value="7"
              color="bg-blue-50 text-blue-700"
            />
            <ProfileStat
              icon={<AlertTriangle size={22} />}
              title="Critical"
              value="1"
              color="bg-red-50 text-red-700"
            />
          </section>

          {/* Settings */}
          <section className="mt-5 rounded-3xl bg-white p-3 shadow-sm">
            <ProfileMenuItem icon={<Bell size={20} />} label="Notifications" />
            <ProfileMenuItem icon={<Settings size={20} />} label="Account Settings" />
            <ProfileMenuItem icon={<ShieldCheck size={20} />} label="Privacy & Verification" />
            <ProfileMenuItem icon={<LogOut size={20} />} label="Logout" danger />
          </section>
        </main>
      </div>

      {/* Desktop View */}
      <div className="hidden lg:block">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">
              Resident Profile
            </h1>
            <p className="mt-1 text-gray-500">
              View and manage your citizen profile and report activity.
            </p>
          </div>

          <button className="rounded-2xl bg-green-700 px-5 py-3 text-sm font-semibold text-white hover:bg-green-800">
            Edit Profile
          </button>
        </header>

        <section className="mt-8 grid grid-cols-12 gap-6">
          {/* Left Profile Panel */}
          <aside className="col-span-4 rounded-3xl bg-white p-6 shadow-sm">
            <div className="flex flex-col items-center text-center">
              <div className="flex h-28 w-28 items-center justify-center rounded-full bg-green-100 text-green-700">
                <User size={52} />
              </div>

              <h2 className="mt-4 text-2xl font-extrabold text-gray-900">
                Juan Dela Cruz
              </h2>
              <p className="text-sm text-gray-500">Resident Account</p>

              <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-green-50 px-4 py-2 text-sm font-bold text-green-700">
                <ShieldCheck size={16} />
                Verified Resident
              </div>
            </div>

            <div className="mt-8 space-y-4">
              <InfoItem icon={<Mail size={18} />} label="Email" value="juan@example.com" />
              <InfoItem icon={<Phone size={18} />} label="Phone" value="0912 345 6789" />
              <InfoItem icon={<MapPin size={18} />} label="Barangay" value="Poblacion" />
              <InfoItem icon={<MapPin size={18} />} label="City" value="Valencia City, Bukidnon" />
            </div>
          </aside>

          {/* Right Content */}
          <main className="col-span-8 space-y-6">
            <section className="grid grid-cols-4 gap-6">
              <DesktopStat title="Total Reports" value="12" color="text-green-700" />
              <DesktopStat title="Pending" value="2" color="text-gray-600" />
              <DesktopStat title="In Progress" value="4" color="text-yellow-600" />
              <DesktopStat title="Resolved" value="7" color="text-green-700" />
            </section>

            <section className="rounded-3xl bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-extrabold text-gray-900">
                    Recent Report Activity
                  </h3>
                  <p className="text-sm text-gray-500">
                    Latest updates from your submitted reports.
                  </p>
                </div>

                <button className="text-sm font-bold text-green-700">
                  View all
                </button>
              </div>

              <div className="mt-5 space-y-4">
                <ActivityItem
                  title="Road damage near public market"
                  status="In Progress"
                  date="Updated today"
                />
                <ActivityItem
                  title="Garbage accumulation near river"
                  status="Under Review"
                  date="Updated yesterday"
                />
                <ActivityItem
                  title="Broken streetlight in front of school"
                  status="Resolved"
                  date="Updated June 6, 2025"
                />
              </div>
            </section>

            <section className="rounded-3xl bg-white p-6 shadow-sm">
              <h3 className="text-xl font-extrabold text-gray-900">
                Account Options
              </h3>

              <div className="mt-5 grid grid-cols-2 gap-4">
                <DesktopOption icon={<Bell size={22} />} title="Notifications" />
                <DesktopOption icon={<Settings size={22} />} title="Account Settings" />
                <DesktopOption icon={<ShieldCheck size={22} />} title="Privacy & Verification" />
                <DesktopOption icon={<LogOut size={22} />} title="Logout" danger />
              </div>
            </section>
          </main>
        </section>
      </div>
    </CitizenLayout>
  );
}

function InfoItem({ icon, label, value }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 text-green-700">
        {icon}
      </div>

      <div className="min-w-0">
        <p className="text-xs font-semibold text-gray-400">{label}</p>
        <p className="truncate text-sm font-bold text-gray-800">{value}</p>
      </div>
    </div>
  );
}

function ProfileStat({ icon, title, value, color }) {
  return (
    <div className={`rounded-3xl p-4 shadow-sm ${color}`}>
      <div className="flex items-center justify-between">
        {icon}
        <h3 className="text-2xl font-extrabold">{value}</h3>
      </div>
      <p className="mt-3 text-xs font-bold">{title}</p>
    </div>
  );
}

function ProfileMenuItem({ icon, label, danger = false }) {
  return (
    <button
      className={`flex w-full items-center gap-3 rounded-2xl px-4 py-4 text-left text-sm font-bold transition hover:bg-gray-50 ${
        danger ? "text-red-600" : "text-gray-800"
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

function DesktopStat({ title, value, color }) {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm">
      <p className="text-sm font-medium text-gray-500">{title}</p>
      <h2 className={`mt-3 text-4xl font-extrabold ${color}`}>{value}</h2>
    </div>
  );
}

function ActivityItem({ title, status, date }) {
  const statusColor =
    status === "Resolved"
      ? "bg-green-100 text-green-700"
      : status === "In Progress"
      ? "bg-yellow-100 text-yellow-700"
      : "bg-blue-100 text-blue-700";

  return (
    <div className="flex items-center justify-between rounded-2xl border border-gray-100 p-4">
      <div>
        <h4 className="font-bold text-gray-900">{title}</h4>
        <p className="mt-1 text-sm text-gray-500">{date}</p>
      </div>

      <span className={`rounded-full px-3 py-1 text-xs font-bold ${statusColor}`}>
        {status}
      </span>
    </div>
  );
}

function DesktopOption({ icon, title, danger = false }) {
  return (
    <button
      className={`flex items-center gap-4 rounded-2xl border border-gray-100 p-5 text-left transition hover:bg-gray-50 ${
        danger ? "text-red-600" : "text-gray-800"
      }`}
    >
      <div
        className={`flex h-12 w-12 items-center justify-center rounded-2xl ${
          danger ? "bg-red-50" : "bg-green-50"
        }`}
      >
        {icon}
      </div>

      <span className="font-bold">{title}</span>
    </button>
  );
}