// src/Admin/Overview.jsx
import {
  FileText,
  Clock,
  Wrench,
  CheckCircle,
  Timer,
  ChevronDown,
  MoreHorizontal,
  Leaf,
  ShieldCheck,
  HeartPulse,
  HardHat,
  Plus,
  Minus,
  Eye,
} from "lucide-react";
import AdminLayout from "../layouts/AdminLayouts";

const stats = [
  {
    title: "Total Reports",
    value: "1,245",
    note: "+12% from last week",
    icon: FileText,
    color: "bg-green-100 text-green-700",
  },
  {
    title: "Pending",
    value: "234",
    note: "+8%",
    icon: Clock,
    color: "bg-yellow-100 text-yellow-700",
  },
  {
    title: "In Progress",
    value: "567",
    note: "+15%",
    icon: Wrench,
    color: "bg-blue-100 text-blue-700",
  },
  {
    title: "Resolved",
    value: "444",
    note: "+10%",
    icon: CheckCircle,
    color: "bg-green-100 text-green-700",
  },
  {
    title: "Avg. Response Time",
    value: "2.4 hrs",
    note: "-5% from last week",
    icon: Timer,
    color: "bg-purple-100 text-purple-700",
  },
];

const mapMarkers = [
  { count: 12, top: "18%", left: "26%", color: "bg-red-600" },
  { count: 8, top: "16%", left: "50%", color: "bg-orange-500" },
  { count: 6, top: "50%", left: "30%", color: "bg-green-600" },
  { count: 15, top: "48%", left: "57%", color: "bg-red-600" },
  { count: 4, top: "40%", left: "78%", color: "bg-yellow-500" },
  { count: 3, top: "72%", left: "37%", color: "bg-blue-600" },
  { count: 3, top: "63%", left: "75%", color: "bg-blue-600" },
];

const categories = [
  { name: "Road / Infrastructure", percent: "40% (498)", color: "bg-red-600" },
  { name: "Flooding / Drainage", percent: "20% (249)", color: "bg-blue-600" },
  { name: "Garbage / Waste", percent: "15% (187)", color: "bg-green-600" },
  { name: "Streetlights / Electrical", percent: "10% (125)", color: "bg-orange-500" },
  { name: "Water Service", percent: "8% (100)", color: "bg-purple-500" },
  { name: "Others", percent: "7% (86)", color: "bg-gray-500" },
];

const problemAreas = [
  { rank: 1, area: "Poblacion", reports: "156 reports", color: "bg-red-600", line: "text-red-500" },
  { rank: 2, area: "Lumbo", reports: "132 reports", color: "bg-orange-500", line: "text-orange-500" },
  { rank: 3, area: "Bagontaas", reports: "98 reports", color: "bg-yellow-500", line: "text-yellow-500" },
  { rank: 4, area: "Patag", reports: "76 reports", color: "bg-green-600", line: "text-green-500" },
  { rank: 5, area: "Maputi", reports: "54 reports", color: "bg-blue-600", line: "text-blue-500" },
];

const reports = [
  {
    id: "#VAL-2025-1245",
    issue: "Large pothole along National Highway",
    location: "National Highway, Poblacion",
    barangay: "Valencia City",
    category: "Road / Infrastructure",
    status: "In Progress",
    reported: "June 8, 2025 9:41 AM",
    image:
      "https://images.unsplash.com/photo-1605000797499-95a51c5269ae?q=80&w=300&auto=format&fit=crop",
  },
  {
    id: "#VAL-2025-1244",
    issue: "Garbage accumulation near the river",
    location: "Riverbank, Bagontaas",
    barangay: "Bagontaas",
    category: "Garbage / Waste",
    status: "Under Review",
    reported: "June 8, 2025 8:15 AM",
    image:
      "https://images.unsplash.com/photo-1604187351574-c75ca79f5807?q=80&w=300&auto=format&fit=crop",
  },
  {
    id: "#VAL-2025-1243",
    issue: "Broken streetlight in front of school",
    location: "Lumbo National High School",
    barangay: "Lumbo",
    category: "Streetlights / Electrical",
    status: "Assigned",
    reported: "June 8, 2025 7:02 AM",
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=300&auto=format&fit=crop",
  },
  {
    id: "#VAL-2025-1242",
    issue: "Flooding during heavy rain",
    location: "Purok 3, Patag",
    barangay: "Patag",
    category: "Flooding / Drainage",
    status: "In Progress",
    reported: "June 7, 2025 6:40 PM",
    image:
      "https://images.unsplash.com/photo-1527482797697-8795b05a13fe?q=80&w=300&auto=format&fit=crop",
  },
  {
    id: "#VAL-2025-1241",
    issue: "Water leakage on main road",
    location: "National Road, Maputi",
    barangay: "Maputi",
    category: "Water Service",
    status: "Pending",
    reported: "June 7, 2025 4:30 PM",
    image:
      "https://images.unsplash.com/photo-1541919329513-35f7af297129?q=80&w=300&auto=format&fit=crop",
  },
];

const workloads = [
  {
    name: "City Engineering Office",
    value: 72,
    icon: Wrench,
    bar: "bg-red-500",
  },
  {
    name: "City Environment Office",
    value: 58,
    icon: Leaf,
    bar: "bg-green-500",
  },
  {
    name: "City Disaster Risk Reduction",
    value: 45,
    icon: ShieldCheck,
    bar: "bg-orange-500",
  },
  {
    name: "City Health Office",
    value: 30,
    icon: HeartPulse,
    bar: "bg-blue-500",
  },
  {
    name: "City Public Works",
    value: 68,
    icon: HardHat,
    bar: "bg-purple-500",
  },
];

export default function Overview() {
  return (
    <AdminLayout>
      <div className="space-y-5 sm:space-y-6">
        {/* Header */}
        <header className="flex flex-col gap-2">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              LGU Dashboard
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Real-time overview of citizen reports and city operations
            </p>
          </div>
        </header>

        {/* Stat Cards */}
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          {stats.map((stat) => (
            <StatCard key={stat.title} stat={stat} />
          ))}
        </section>

        {/* Map and Right Panels */}
        <section className="grid gap-6 xl:grid-cols-12">
          <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-5 xl:col-span-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                Incident Map Overview
              </h2>
            </div>

            <div className="mt-4 flex flex-wrap gap-3">
              <FilterButton label="All Barangays" />
              <FilterButton label="All Categories" />
              <FilterButton label="All Statuses" />

              <button className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 text-xs font-medium text-green-700 sm:ml-auto sm:w-auto">
                <Eye size={15} />
                Heatmap View
              </button>
            </div>

            <div className="mt-4">
              <MapOverview />
            </div>
          </div>

          <aside className="space-y-6 xl:col-span-4">
            <ReportsByCategory />
            <TopProblemAreas />
          </aside>
        </section>

        {/* Reports and Workload */}
        <section className="grid gap-6 xl:grid-cols-12">
          <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-5 xl:col-span-8">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                Recent Reports
              </h2>
              <button className="text-sm font-medium text-green-700">
                View All Reports
              </button>
            </div>

            <div className="mt-5 overflow-x-auto">
              <table className="w-full min-w-208 text-left text-sm">
                <thead>
                  <tr className="border-b border-gray-100 text-xs text-gray-500">
                    <th className="px-3 py-3 font-semibold">ID</th>
                    <th className="px-3 py-3 font-semibold">Issue</th>
                    <th className="px-3 py-3 font-semibold">Location</th>
                    <th className="px-3 py-3 font-semibold">Category</th>
                    <th className="px-3 py-3 font-semibold">Status</th>
                    <th className="px-3 py-3 font-semibold">Reported On</th>
                    <th className="px-3 py-3 font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {reports.map((report) => (
                    <ReportRow key={report.id} report={report} />
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <DepartmentWorkload />
        </section>
      </div>
    </AdminLayout>
  );
}

function StatCard({ stat }) {
  const Icon = stat.icon;

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl ${stat.color}`}
        >
          <Icon size={20} />
        </div>

        <div>
          <p className="text-sm font-medium text-gray-600">{stat.title}</p>
          <h3 className="mt-0.5 text-2xl font-semibold text-gray-900">
            {stat.value}
          </h3>
          <p
            className={`mt-1 text-xs font-medium ${
              stat.note.startsWith("-") || stat.note.startsWith("+1")
                ? "text-green-600"
                : "text-orange-500"
            }`}
          >
            {stat.note}
          </p>
        </div>
      </div>
    </div>
  );
}

function FilterButton({ label }) {
  return (
    <button className="flex w-full min-w-0 items-center justify-between gap-3 rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 text-xs font-medium text-gray-700 sm:min-w-40">
      {label}
      <ChevronDown size={15} />
    </button>
  );
}

function MapOverview() {
  return (
    <div className="relative h-80 overflow-hidden rounded-xl border border-green-100 bg-linear-to-br from-emerald-50 via-lime-50 to-cyan-50 sm:h-88">
      <div className="absolute inset-0 opacity-70">
        <div className="absolute left-[10%] top-[12%] h-56 w-56 rounded-full bg-white/70" />
        <div className="absolute right-[8%] top-[18%] h-52 w-52 rounded-full bg-white/70" />
        <div className="absolute bottom-[8%] left-[28%] h-48 w-48 rounded-full bg-cyan-100/40" />
      </div>

      <div className="absolute inset-x-[16%] top-[11%] bottom-[10%] rounded-[45%] border border-emerald-200/80 bg-white/20" />

      <span className="absolute left-[25%] top-[12%] text-xs font-bold text-gray-800 sm:text-sm">
        Lumbo
      </span>
      <span className="absolute left-[46%] top-[35%] text-xs font-bold text-gray-800 sm:text-sm">
        Poblacion City
      </span>
      <span className="absolute right-[16%] top-[20%] text-xs font-bold text-gray-800 sm:text-sm">
        Bagontaas
      </span>
      <span className="absolute right-[16%] bottom-[12%] text-xs font-bold text-gray-800 sm:text-sm">
        Patag
      </span>

      {mapMarkers.map((marker, index) => (
        <button
          key={index}
          className={`absolute flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold text-white shadow-md ring-2 ring-white/50 sm:h-10 sm:w-10 sm:text-base ${marker.color}`}
          style={{ top: marker.top, left: marker.left }}
        >
          {marker.count}
        </button>
      ))}

      <div className="absolute bottom-4 left-4 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
        <button className="flex h-8 w-8 items-center justify-center border-b border-gray-100 sm:h-9 sm:w-9">
          <Plus size={18} />
        </button>
        <button className="flex h-8 w-8 items-center justify-center sm:h-9 sm:w-9">
          <Minus size={18} />
        </button>
      </div>
    </div>
  );
}

function ReportsByCategory() {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-5">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-lg font-semibold text-gray-900">
          Reports by Category
        </h2>
        <button className="text-sm font-medium text-green-700">View All</button>
      </div>

      <div className="mt-5 space-y-3.5">
        {categories.map((category) => (
          <div key={category.name} className="space-y-2">
            <div className="flex items-start justify-between gap-3 text-sm sm:items-center">
              <div className="flex min-w-0 items-center gap-2">
                <span className={`h-3.5 w-3.5 rounded-full ${category.color}`} />
                <span className="font-medium text-gray-700">{category.name}</span>
              </div>
              <span className="font-medium text-gray-700">{category.percent}</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-gray-100">
              <div
                className={`h-full rounded-full ${category.color}`}
                style={{ width: category.percent.split("%")[0] + "%" }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TopProblemAreas() {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-5">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-lg font-semibold text-gray-900">
          Top Problem Areas
        </h2>
        <button className="text-sm font-medium text-green-700">View All</button>
      </div>

      <div className="mt-5 space-y-3">
        {problemAreas.map((item) => (
          <div
            key={item.area}
            className="grid grid-cols-[28px_1fr_auto] items-center gap-2 sm:grid-cols-[32px_1fr_auto] sm:gap-3"
          >
            <span
              className={`flex h-7 w-7 items-center justify-center rounded-md text-xs font-semibold text-white ${item.color}`}
            >
              {item.rank}
            </span>
            <p className="font-medium text-gray-800">{item.area}</p>
            <p className="text-sm font-medium text-gray-500">{item.reports}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function ReportRow({ report }) {
  return (
    <tr className="border-b border-gray-100 last:border-b-0">
      <td className="px-3 py-4 text-xs font-medium text-gray-700">{report.id}</td>
      <td className="px-3 py-4">
        <div className="flex items-center gap-2.5">
          <img
            src={report.image}
            alt={report.issue}
            className="h-10 w-10 rounded-md object-cover"
          />
          <div>
            <p className="font-medium text-gray-900">{report.issue}</p>
            <p className="text-xs text-gray-500">{report.barangay}</p>
          </div>
        </div>
      </td>
      <td className="px-3 py-4 text-sm font-medium text-gray-600">
        {report.location}
      </td>
      <td className="px-3 py-4">
        <CategoryBadge category={report.category} />
      </td>
      <td className="px-3 py-4">
        <StatusBadge status={report.status} />
      </td>
      <td className="px-3 py-4 text-sm font-medium text-gray-600">
        {report.reported}
      </td>
      <td className="px-3 py-4">
        <button className="rounded-lg p-2 hover:bg-gray-100">
          <MoreHorizontal size={18} />
        </button>
      </td>
    </tr>
  );
}

function CategoryBadge({ category }) {
  const styles = {
    "Road / Infrastructure": "bg-red-100 text-red-600",
    "Garbage / Waste": "bg-green-100 text-green-700",
    "Streetlights / Electrical": "bg-orange-100 text-orange-700",
    "Flooding / Drainage": "bg-blue-100 text-blue-700",
    "Water Service": "bg-cyan-100 text-cyan-700",
  };

  return (
    <span
      className={`rounded-md px-2.5 py-1 text-xs font-medium ${
        styles[category] || "bg-gray-100 text-gray-700"
      }`}
    >
      {category}
    </span>
  );
}

function StatusBadge({ status }) {
  const styles = {
    "In Progress": "bg-yellow-100 text-yellow-700",
    "Under Review": "bg-blue-100 text-blue-700",
    Assigned: "bg-purple-100 text-purple-700",
    Pending: "bg-gray-100 text-gray-700",
    Resolved: "bg-green-100 text-green-700",
  };

  return (
    <span
      className={`rounded-md px-2.5 py-1 text-xs font-medium ${
        styles[status] || "bg-gray-100 text-gray-700"
      }`}
    >
      {status}
    </span>
  );
}

function DepartmentWorkload() {
  return (
    <aside className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-5 xl:col-span-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-lg font-semibold text-gray-900">
          Department Workload
        </h2>
        <button className="text-sm font-medium text-green-700">View All</button>
      </div>

      <div className="mt-6 space-y-6">
        {workloads.map((item) => {
          const Icon = item.icon;

          return (
            <div key={item.name} className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-50 text-gray-600">
                <Icon size={21} />
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-gray-800">{item.name}</p>
                  <p className="font-semibold text-gray-900">{item.value}%</p>
                </div>

                <div className="mt-2 h-2 overflow-hidden rounded-full bg-gray-100">
                  <div
                    className={`h-full rounded-full ${item.bar}`}
                    style={{ width: `${item.value}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </aside>
  );
}
