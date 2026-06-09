// src/Admin/Barangays.jsx
import {
  Search,
  Plus,
  Filter,
  ChevronDown,
  MoreHorizontal,
  MapPin,
  Users,
  ClipboardList,
  Clock,
  CheckCircle,
  AlertTriangle,
  Eye,
  Edit,
  Building2,
  Star,
  TrendingUp,
} from "lucide-react";
import AdminLayout from "../layouts/AdminLayouts";

const barangays = [
  {
    id: "BRGY-001",
    name: "Poblacion",
    captain: "Hon. Juan Dela Cruz",
    population: "18,450",
    reports: 156,
    pending: 34,
    inProgress: 48,
    resolved: 74,
    critical: 12,
    avgResponse: "2.1 hrs",
    rating: "4.7",
    performance: 86,
    status: "High Activity",
    color: "bg-red-100 text-red-700",
    bar: "bg-red-500",
  },
  {
    id: "BRGY-002",
    name: "Bagontaas",
    captain: "Hon. Maria Santos",
    population: "14,230",
    reports: 98,
    pending: 19,
    inProgress: 32,
    resolved: 47,
    critical: 6,
    avgResponse: "2.8 hrs",
    rating: "4.5",
    performance: 78,
    status: "Active",
    color: "bg-yellow-100 text-yellow-700",
    bar: "bg-yellow-500",
  },
  {
    id: "BRGY-003",
    name: "Lumbo",
    captain: "Hon. Pedro Reyes",
    population: "10,875",
    reports: 132,
    pending: 25,
    inProgress: 39,
    resolved: 68,
    critical: 8,
    avgResponse: "2.5 hrs",
    rating: "4.6",
    performance: 82,
    status: "Active",
    color: "bg-orange-100 text-orange-700",
    bar: "bg-orange-500",
  },
  {
    id: "BRGY-004",
    name: "Patag",
    captain: "Hon. Ana Garcia",
    population: "9,640",
    reports: 76,
    pending: 12,
    inProgress: 21,
    resolved: 43,
    critical: 4,
    avgResponse: "3.2 hrs",
    rating: "4.3",
    performance: 71,
    status: "Moderate",
    color: "bg-green-100 text-green-700",
    bar: "bg-green-500",
  },
  {
    id: "BRGY-005",
    name: "Maputi",
    captain: "Hon. Carlo Mendoza",
    population: "7,520",
    reports: 54,
    pending: 8,
    inProgress: 16,
    resolved: 30,
    critical: 3,
    avgResponse: "3.5 hrs",
    rating: "4.2",
    performance: 68,
    status: "Moderate",
    color: "bg-blue-100 text-blue-700",
    bar: "bg-blue-500",
  },
  {
    id: "BRGY-006",
    name: "Batangan",
    captain: "Hon. Mark Villanueva",
    population: "8,910",
    reports: 43,
    pending: 7,
    inProgress: 13,
    resolved: 23,
    critical: 2,
    avgResponse: "3.9 hrs",
    rating: "4.1",
    performance: 64,
    status: "Low Activity",
    color: "bg-purple-100 text-purple-700",
    bar: "bg-purple-500",
  },
];

const summary = [
  {
    title: "Total Barangays",
    value: "31",
    icon: Building2,
    color: "bg-green-100 text-green-700",
  },
  {
    title: "Total Reports",
    value: "1,245",
    icon: ClipboardList,
    color: "bg-blue-100 text-blue-700",
  },
  {
    title: "Pending Reports",
    value: "234",
    icon: Clock,
    color: "bg-yellow-100 text-yellow-700",
  },
  {
    title: "Resolved Reports",
    value: "444",
    icon: CheckCircle,
    color: "bg-green-100 text-green-700",
  },
];

export default function Barangays() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900">
              Barangays
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Monitor barangay reports, response performance, hotspots, and resolution progress.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-bold text-gray-700 shadow-sm hover:bg-gray-50">
              <Filter size={17} />
              Filter
            </button>

            <button className="flex items-center gap-2 rounded-xl bg-green-700 px-4 py-3 text-sm font-bold text-white shadow-sm hover:bg-green-800">
              <Plus size={17} />
              Add Barangay
            </button>
          </div>
        </header>

        {/* Summary Cards */}
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {summary.map((item) => (
            <SummaryCard key={item.title} item={item} />
          ))}
        </section>

        {/* Filters */}
        <section className="rounded-2xl bg-white p-5 shadow-sm">
          <div className="grid gap-4 lg:grid-cols-[1fr_auto_auto]">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search barangay, captain, report count, or status..."
                className="h-12 w-full rounded-xl border border-gray-200 bg-gray-50 pl-11 pr-4 text-sm outline-none focus:border-green-700 focus:ring-1 focus:ring-green-700"
              />
            </div>

            <SelectButton label="All Barangays" />
            <SelectButton label="Sort by Reports" />
          </div>
        </section>

        {/* Barangay Cards */}
        <section className="grid gap-6 xl:grid-cols-3">
          {barangays.map((barangay) => (
            <BarangayCard key={barangay.id} barangay={barangay} />
          ))}
        </section>

        {/* Barangay Table */}
        <section className="rounded-2xl bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-extrabold text-gray-900">
                Barangay Performance Overview
              </h2>
              <p className="text-sm text-gray-500">
                Compare report volume, response time, and resolution rate by barangay.
              </p>
            </div>

            <button className="text-sm font-bold text-green-700">
              View All
            </button>
          </div>

          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-[950px] text-left text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-xs text-gray-400">
                  <th className="px-3 py-3 font-bold">Barangay</th>
                  <th className="px-3 py-3 font-bold">Captain</th>
                  <th className="px-3 py-3 font-bold">Population</th>
                  <th className="px-3 py-3 font-bold">Reports</th>
                  <th className="px-3 py-3 font-bold">Pending</th>
                  <th className="px-3 py-3 font-bold">In Progress</th>
                  <th className="px-3 py-3 font-bold">Resolved</th>
                  <th className="px-3 py-3 font-bold">Critical</th>
                  <th className="px-3 py-3 font-bold">Performance</th>
                  <th className="px-3 py-3 font-bold">Action</th>
                </tr>
              </thead>

              <tbody>
                {barangays.map((barangay) => (
                  <BarangayRow key={barangay.id} barangay={barangay} />
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </AdminLayout>
  );
}

function SummaryCard({ item }) {
  const Icon = item.icon;

  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm">
      <div className="flex items-center gap-4">
        <div
          className={`flex h-14 w-14 items-center justify-center rounded-full ${item.color}`}
        >
          <Icon size={24} />
        </div>

        <div>
          <p className="text-sm font-bold text-gray-700">{item.title}</p>
          <h3 className="mt-1 text-3xl font-extrabold text-gray-900">
            {item.value}
          </h3>
        </div>
      </div>
    </div>
  );
}

function SelectButton({ label }) {
  return (
    <button className="flex h-12 min-w-48 items-center justify-between gap-3 rounded-xl border border-gray-200 bg-white px-4 text-sm font-bold text-gray-700 hover:bg-gray-50">
      {label}
      <ChevronDown size={16} />
    </button>
  );
}

function BarangayCard({ barangay }) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${barangay.color}`}>
          <MapPin size={26} />
        </div>

        <button className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700">
          <MoreHorizontal size={18} />
        </button>
      </div>

      <div className="mt-5">
        <p className="text-xs font-bold uppercase tracking-wide text-gray-400">
          {barangay.id}
        </p>

        <h2 className="mt-1 text-xl font-extrabold text-gray-900">
          Barangay {barangay.name}
        </h2>

        <p className="mt-2 text-sm font-semibold text-gray-500">
          {barangay.captain}
        </p>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <MiniInfo icon={<Users size={16} />} label="Population" value={barangay.population} />
        <MiniInfo icon={<ClipboardList size={16} />} label="Reports" value={barangay.reports} />
        <MiniInfo icon={<Clock size={16} />} label="Avg. Response" value={barangay.avgResponse} />
        <MiniInfo icon={<Star size={16} />} label="Rating" value={barangay.rating} />
      </div>

      <div className="mt-5 rounded-2xl bg-gray-50 p-4">
        <div className="mb-2 flex items-center justify-between">
          <p className="text-sm font-bold text-gray-700">Performance Score</p>
          <p className="text-sm font-extrabold text-gray-900">
            {barangay.performance}%
          </p>
        </div>

        <div className="h-2 overflow-hidden rounded-full bg-gray-200">
          <div
            className={`h-full rounded-full ${barangay.bar}`}
            style={{ width: `${barangay.performance}%` }}
          />
        </div>

        <div className="mt-4 grid grid-cols-3 gap-3 text-center">
          <SmallStat label="Pending" value={barangay.pending} color="text-yellow-600" />
          <SmallStat label="Active" value={barangay.inProgress} color="text-blue-600" />
          <SmallStat label="Resolved" value={barangay.resolved} color="text-green-700" />
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between">
        <StatusBadge status={barangay.status} />

        <div className="flex gap-2">
          <button className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-700 text-white hover:bg-green-800">
            <Eye size={16} />
          </button>
          <button className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50">
            <Edit size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

function MiniInfo({ icon, label, value }) {
  return (
    <div className="rounded-2xl bg-gray-50 p-3">
      <div className="flex items-center gap-2 text-green-700">
        {icon}
        <p className="text-xs font-bold text-gray-400">{label}</p>
      </div>
      <p className="mt-2 text-sm font-extrabold text-gray-900">{value}</p>
    </div>
  );
}

function SmallStat({ label, value, color }) {
  return (
    <div>
      <p className={`text-lg font-extrabold ${color}`}>{value}</p>
      <p className="text-[11px] font-bold text-gray-400">{label}</p>
    </div>
  );
}

function StatusBadge({ status }) {
  const styles = {
    "High Activity": "bg-red-100 text-red-700",
    Active: "bg-yellow-100 text-yellow-700",
    Moderate: "bg-green-100 text-green-700",
    "Low Activity": "bg-blue-100 text-blue-700",
  };

  return (
    <span
      className={`inline-flex rounded-lg px-3 py-1 text-xs font-extrabold ${
        styles[status] || "bg-gray-100 text-gray-700"
      }`}
    >
      {status}
    </span>
  );
}

function BarangayRow({ barangay }) {
  return (
    <tr className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50">
      <td className="px-3 py-4">
        <div className="flex items-center gap-3">
          <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${barangay.color}`}>
            <MapPin size={20} />
          </div>

          <div>
            <p className="font-extrabold text-gray-900">
              Barangay {barangay.name}
            </p>
            <p className="text-xs font-semibold text-gray-400">
              {barangay.id}
            </p>
          </div>
        </div>
      </td>

      <td className="px-3 py-4">
        <p className="font-bold text-gray-700">{barangay.captain}</p>
      </td>

      <td className="px-3 py-4 font-bold text-gray-700">
        {barangay.population}
      </td>

      <td className="px-3 py-4 font-extrabold text-gray-900">
        {barangay.reports}
      </td>

      <td className="px-3 py-4 font-extrabold text-yellow-600">
        {barangay.pending}
      </td>

      <td className="px-3 py-4 font-extrabold text-blue-600">
        {barangay.inProgress}
      </td>

      <td className="px-3 py-4 font-extrabold text-green-700">
        {barangay.resolved}
      </td>

      <td className="px-3 py-4">
        <span className="inline-flex items-center gap-1 rounded-lg bg-red-100 px-3 py-1 text-xs font-extrabold text-red-700">
          <AlertTriangle size={13} />
          {barangay.critical}
        </span>
      </td>

      <td className="px-3 py-4">
        <div className="flex items-center gap-3">
          <div className="h-2 w-24 overflow-hidden rounded-full bg-gray-100">
            <div
              className={`h-full rounded-full ${barangay.bar}`}
              style={{ width: `${barangay.performance}%` }}
            />
          </div>

          <span className="text-xs font-extrabold text-gray-700">
            {barangay.performance}%
          </span>
        </div>
      </td>

      <td className="px-3 py-4">
        <button className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700">
          <MoreHorizontal size={18} />
        </button>
      </td>
    </tr>
  );
}