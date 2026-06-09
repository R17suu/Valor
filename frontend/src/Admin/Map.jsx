// src/Admin/Map.jsx
import {
  Search,
  Filter,
  ChevronDown,
  Layers,
  Navigation,
  Plus,
  Minus,
  MapPin,
  AlertTriangle,
  Droplets,
  Trash2,
  Lightbulb,
  TreePine,
  MoreHorizontal,
  Eye,
} from "lucide-react";
import AdminLayout from "../layouts/AdminLayouts";

const filters = ["All", "Road", "Flooding", "Garbage", "Streetlight", "Public Safety"];

const incidents = [
  {
    id: "#VAL-2025-1245",
    title: "Large pothole along National Highway",
    category: "Road / Infrastructure",
    barangay: "Poblacion",
    status: "In Progress",
    priority: "High",
    count: 15,
    top: "46%",
    left: "56%",
    color: "bg-red-600",
  },
  {
    id: "#VAL-2025-1244",
    title: "Garbage accumulation near the river",
    category: "Garbage / Waste",
    barangay: "Bagontaas",
    status: "Under Review",
    priority: "Medium",
    count: 6,
    top: "34%",
    left: "78%",
    color: "bg-green-600",
  },
  {
    id: "#VAL-2025-1243",
    title: "Broken streetlight in front of school",
    category: "Streetlights / Electrical",
    barangay: "Lumbo",
    status: "Assigned",
    priority: "Low",
    count: 8,
    top: "23%",
    left: "51%",
    color: "bg-orange-500",
  },
  {
    id: "#VAL-2025-1242",
    title: "Flooding during heavy rain",
    category: "Flooding / Drainage",
    barangay: "Patag",
    status: "In Progress",
    priority: "Critical",
    count: 12,
    top: "24%",
    left: "25%",
    color: "bg-blue-600",
  },
  {
    id: "#VAL-2025-1241",
    title: "Illegal dumping near vacant lot",
    category: "Garbage / Waste",
    barangay: "Maputi",
    status: "Pending",
    priority: "Medium",
    count: 5,
    top: "70%",
    left: "34%",
    color: "bg-green-600",
  },
  {
    id: "#VAL-2025-1240",
    title: "Road obstruction caused by fallen tree",
    category: "Obstruction",
    barangay: "Lumbo",
    status: "Under Review",
    priority: "High",
    count: 3,
    top: "18%",
    left: "66%",
    color: "bg-purple-600",
  },
];

const legends = [
  {
    label: "Road / Infrastructure",
    icon: AlertTriangle,
    color: "bg-red-600",
  },
  {
    label: "Flooding / Drainage",
    icon: Droplets,
    color: "bg-blue-600",
  },
  {
    label: "Garbage / Waste",
    icon: Trash2,
    color: "bg-green-600",
  },
  {
    label: "Streetlights / Electrical",
    icon: Lightbulb,
    color: "bg-orange-500",
  },
  {
    label: "Fallen Tree / Obstruction",
    icon: TreePine,
    color: "bg-purple-600",
  },
  {
    label: "Others",
    icon: MoreHorizontal,
    color: "bg-gray-500",
  },
];

export default function AdminMap() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900">
              Incident Map
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Monitor active reports, hotspots, and issue locations across Valencia City.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-bold text-gray-700 shadow-sm hover:bg-gray-50">
              <Layers size={17} />
              Map Layers
            </button>

            <button className="flex items-center gap-2 rounded-xl bg-green-700 px-4 py-3 text-sm font-bold text-white shadow-sm hover:bg-green-800">
              <Eye size={17} />
              Heatmap View
            </button>
          </div>
        </header>

        {/* Quick Stats */}
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MapStat title="Active Incidents" value="86" color="text-green-700" />
          <MapStat title="Critical Areas" value="12" color="text-red-600" />
          <MapStat title="Barangays Covered" value="31" color="text-yellow-600" />
          <MapStat title="Resolved Today" value="18" color="text-blue-600" />
        </section>

        {/* Filters */}
        <section className="rounded-2xl bg-white p-5 shadow-sm">
          <div className="grid gap-4 lg:grid-cols-[1fr_auto_auto_auto]">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search barangay, location, report ID..."
                className="h-12 w-full rounded-xl border border-gray-200 bg-gray-50 pl-11 pr-4 text-sm outline-none focus:border-green-700 focus:ring-1 focus:ring-green-700"
              />
            </div>

            <FilterButton label="All Barangays" />
            <FilterButton label="All Statuses" />
            <button className="flex h-12 items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-5 text-sm font-bold text-gray-700 hover:bg-gray-50">
              <Filter size={17} />
              More Filters
            </button>
          </div>

          <div className="mt-4 flex gap-2 overflow-x-auto">
            {filters.map((filter, index) => (
              <button
                key={filter}
                className={`shrink-0 rounded-full px-4 py-2 text-xs font-bold ${
                  index === 0
                    ? "bg-green-700 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-green-50 hover:text-green-700"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </section>

        {/* Main Map Layout */}
        <section className="grid gap-6 xl:grid-cols-12">
          {/* Map */}
          <div className="rounded-2xl bg-white p-5 shadow-sm xl:col-span-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-extrabold text-gray-900">
                  Valencia City Map Overview
                </h2>
                <p className="text-sm text-gray-500">
                  Click a marker to view related incident details.
                </p>
              </div>

              <button className="flex items-center gap-2 rounded-xl bg-green-50 px-4 py-2 text-sm font-bold text-green-700">
                <Navigation size={16} />
                Locate
              </button>
            </div>

            <div className="mt-5">
              <MapView />
            </div>
          </div>

          {/* Right Panel */}
          <aside className="space-y-6 xl:col-span-4">
            <MapLegend />

            <div className="rounded-2xl bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-extrabold text-gray-900">
                  Active Incidents
                </h2>
                <button className="text-sm font-bold text-green-700">
                  View All
                </button>
              </div>

              <div className="mt-5 space-y-3">
                {incidents.slice(0, 5).map((incident) => (
                  <IncidentCard key={incident.id} incident={incident} />
                ))}
              </div>
            </div>
          </aside>
        </section>
      </div>
    </AdminLayout>
  );
}

function MapView() {
  return (
    <div className="relative h-[600px] overflow-hidden rounded-2xl bg-[#EAF2EA]">
      {/* Fake map background */}
      <div className="absolute inset-0 opacity-80">
        <div className="absolute left-[-10%] top-[16%] h-20 w-[120%] rotate-[-12deg] bg-white/70" />
        <div className="absolute left-[-20%] top-[50%] h-16 w-[140%] rotate-[18deg] bg-white/70" />
        <div className="absolute left-[30%] top-[-10%] h-[120%] w-14 rotate-[10deg] bg-white/70" />
        <div className="absolute left-[70%] top-[-10%] h-[120%] w-12 rotate-[-20deg] bg-white/70" />

        <div className="absolute left-[10%] top-[10%] h-64 w-64 rounded-full bg-green-100/80" />
        <div className="absolute right-[8%] top-[20%] h-72 w-72 rounded-full bg-green-100/80" />
        <div className="absolute bottom-[12%] left-[22%] h-60 w-60 rounded-full bg-blue-100/50" />
        <div className="absolute bottom-[8%] right-[15%] h-52 w-52 rounded-full bg-green-100/70" />
      </div>

      {/* City boundary */}
      <div className="absolute inset-x-[14%] top-[9%] bottom-[9%] rounded-[45%] border-2 border-dashed border-green-400/70 bg-green-100/20" />

      {/* Barangay labels */}
      <MapLabel text="Lumbo" className="left-[24%] top-[13%]" />
      <MapLabel text="Poblacion City" className="left-[43%] top-[36%]" />
      <MapLabel text="Bagontaas" className="right-[14%] top-[22%]" />
      <MapLabel text="Patag" className="right-[16%] bottom-[18%]" />
      <MapLabel text="Maputi" className="left-[31%] bottom-[16%]" />

      {/* Small dots */}
      <Dot top="34%" left="41%" color="bg-red-500" />
      <Dot top="61%" left="51%" color="bg-orange-500" />
      <Dot top="73%" left="58%" color="bg-green-600" />
      <Dot top="52%" left="70%" color="bg-purple-500" />
      <Dot top="57%" left="77%" color="bg-pink-500" />
      <Dot top="37%" left="34%" color="bg-blue-500" />
      <Dot top="38%" left="62%" color="bg-gray-500" />

      {/* Incident markers */}
      {incidents.map((incident) => (
        <button
          key={incident.id}
          title={incident.title}
          className={`absolute flex h-14 w-14 items-center justify-center rounded-full text-lg font-extrabold text-white shadow-lg ring-8 ring-white/50 transition hover:scale-110 ${incident.color}`}
          style={{
            top: incident.top,
            left: incident.left,
          }}
        >
          {incident.count}
        </button>
      ))}

      {/* Zoom controls */}
      <div className="absolute bottom-5 left-5 overflow-hidden rounded-xl bg-white shadow-md">
        <button className="flex h-11 w-11 items-center justify-center border-b border-gray-100 hover:bg-gray-50">
          <Plus size={18} />
        </button>
        <button className="flex h-11 w-11 items-center justify-center hover:bg-gray-50">
          <Minus size={18} />
        </button>
      </div>

      {/* Floating controls */}
      <div className="absolute right-5 top-5 space-y-3">
        <button className="flex h-11 w-11 items-center justify-center rounded-xl bg-white shadow-md hover:bg-gray-50">
          <Layers size={18} />
        </button>
        <button className="flex h-11 w-11 items-center justify-center rounded-xl bg-white shadow-md hover:bg-gray-50">
          <Navigation size={18} />
        </button>
      </div>
    </div>
  );
}

function MapLabel({ text, className }) {
  return (
    <span className={`absolute text-sm font-extrabold text-gray-800 ${className}`}>
      {text}
    </span>
  );
}

function Dot({ top, left, color }) {
  return (
    <span
      className={`absolute h-3 w-3 rounded-full ${color}`}
      style={{ top, left }}
    />
  );
}

function MapLegend() {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm">
      <h2 className="text-lg font-extrabold text-gray-900">Map Legend</h2>

      <div className="mt-5 grid gap-4">
        {legends.map((legend) => {
          const Icon = legend.icon;

          return (
            <div key={legend.label} className="flex items-center gap-3">
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-full text-white ${legend.color}`}
              >
                <Icon size={17} />
              </div>
              <p className="text-sm font-bold text-gray-700">{legend.label}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function IncidentCard({ incident }) {
  return (
    <button className="w-full rounded-2xl border border-gray-100 p-4 text-left transition hover:border-green-200 hover:bg-green-50">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-bold text-gray-400">{incident.id}</p>
          <h3 className="mt-1 line-clamp-2 text-sm font-extrabold text-gray-900">
            {incident.title}
          </h3>
        </div>

        <span
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-extrabold text-white ${incident.color}`}
        >
          {incident.count}
        </span>
      </div>

      <div className="mt-3 flex items-center gap-2 text-xs font-semibold text-gray-500">
        <MapPin size={14} />
        {incident.barangay}, Valencia City
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <PriorityBadge priority={incident.priority} />
        <StatusBadge status={incident.status} />
      </div>
    </button>
  );
}

function MapStat({ title, value, color }) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm">
      <p className="text-sm font-bold text-gray-500">{title}</p>
      <h2 className={`mt-2 text-4xl font-extrabold ${color}`}>{value}</h2>
    </div>
  );
}

function FilterButton({ label }) {
  return (
    <button className="flex h-12 min-w-44 items-center justify-between gap-3 rounded-xl border border-gray-200 bg-white px-4 text-sm font-bold text-gray-700">
      {label}
      <ChevronDown size={16} />
    </button>
  );
}

function PriorityBadge({ priority }) {
  const styles = {
    Critical: "bg-red-100 text-red-700",
    High: "bg-orange-100 text-orange-700",
    Medium: "bg-yellow-100 text-yellow-700",
    Low: "bg-green-100 text-green-700",
  };

  return (
    <span
      className={`rounded-lg px-3 py-1 text-xs font-extrabold ${
        styles[priority] || "bg-gray-100 text-gray-700"
      }`}
    >
      {priority}
    </span>
  );
}

function StatusBadge({ status }) {
  const styles = {
    Pending: "bg-gray-100 text-gray-700",
    "Under Review": "bg-blue-100 text-blue-700",
    Assigned: "bg-purple-100 text-purple-700",
    "In Progress": "bg-yellow-100 text-yellow-700",
    Resolved: "bg-green-100 text-green-700",
    Rejected: "bg-red-100 text-red-700",
  };

  return (
    <span
      className={`rounded-lg px-3 py-1 text-xs font-extrabold ${
        styles[status] || "bg-gray-100 text-gray-700"
      }`}
    >
      {status}
    </span>
  );
}