import {
  ArrowLeft,
  Home,
  ClipboardList,
  Map,
  User,
  Plus,
  MapPin,
} from "lucide-react";
import CitizenLayout from "../Layouts/CitizenLayouts";

const reports = [
  {
    id: "VAL-2024-00123",
    title: "Large pothole along National Highway",
    location: "Poblacion, Valencia City",
    updated: "June 8, 2025 · 10:30 AM",
    status: "In Progress",
    category: "Road Damage",
    image:
      "https://images.unsplash.com/photo-1605000797499-95a51c5269ae?q=80&w=400&auto=format&fit=crop",
  },
  {
    id: "VAL-2024-00120",
    title: "Garbage accumulation near the river",
    location: "Bagontaas, Valencia City",
    updated: "June 7, 2025 · 2:15 PM",
    status: "Under Review",
    category: "Garbage and Waste",
    image:
      "https://images.unsplash.com/photo-1604187351574-c75ca79f5807?q=80&w=400&auto=format&fit=crop",
  },
  {
    id: "VAL-2024-00115",
    title: "Broken streetlight in front of school",
    location: "Lumobo, Valencia City",
    updated: "June 6, 2025 · 8:45 AM",
    status: "Resolved",
    category: "Street Lights",
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=400&auto=format&fit=crop", 
  },
];

const filters = ["All", "Pending", "In Progress", "Resolved", "Closed"];

export default function MyReports() {
  return (
    <CitizenLayout>
      {/* Mobile View */}
      <div className="lg:hidden">
        {/* <header className="flex items-center justify-between px-5 pt-5">
          <button className="rounded-lg p-2 hover:bg-gray-100">
            <ArrowLeft size={22} />
          </button>

          <div className="text-center">
            <h1 className="text-lg font-extrabold text-gray-900">My Reports</h1>
            <p className="text-xs text-gray-500">Track Your Reports</p>
          </div>

          <div className="w-10" />
        </header> */}

        <section className="px-5 pt-5">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {filters.map((filter, index) => (
              <button
                key={filter}
                className={`shrink-0 rounded-full px-4 py-2 text-xs font-bold ${
                  index === 0
                    ? "bg-green-700 text-white"
                    : "bg-gray-100 text-gray-500"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </section>

        <main className="space-y-4 px-5 pt-3">
          {reports.map((report) => (
            <ReportCard key={report.id} report={report} />
          ))}
        </main>
      </div>

      {/* Desktop View */}
      <div className="hidden lg:block">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">
              My Reports
            </h1>
            <p className="mt-1 text-gray-500">
              Track the status and updates of your submitted reports.
            </p>
          </div>

          <button className="rounded-2xl bg-green-700 px-5 py-3 text-sm font-semibold text-white hover:bg-green-800">
            Submit New Report
          </button>
        </header>

        <section className="mt-8 grid grid-cols-4 gap-6">
          <SummaryCard title="Total Reports" value="12" color="text-green-700" />
          <SummaryCard title="Under Review" value="3" color="text-blue-600" />
          <SummaryCard title="In Progress" value="4" color="text-yellow-600" />
          <SummaryCard title="Resolved" value="5" color="text-green-700" />
        </section>

        <section className="mt-8 rounded-3xl bg-white p-6 shadow-sm">
          <div className="mb-5 flex flex-wrap gap-2">
            {filters.map((filter, index) => (
              <button
                key={filter}
                className={`rounded-full px-5 py-2 text-sm font-bold ${
                  index === 0
                    ? "bg-green-700 text-white"
                    : "bg-gray-100 text-gray-500 hover:bg-green-50 hover:text-green-700"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          <div className="grid gap-4">
            {reports.map((report) => (
              <DesktopReportCard key={report.id} report={report} />
            ))}
          </div>
        </section>
      </div>
    </CitizenLayout>
  );
}

function ReportCard({ report }) {
  return (
    <button className="w-full rounded-2xl bg-white p-3 text-left shadow-sm transition hover:scale-[1.01]">
      <div className="flex gap-3">
        <img
          src={report.image}
          alt={report.title}
          className="h-24 w-24 rounded-xl object-cover"
        />

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h2 className="line-clamp-2 text-sm font-extrabold leading-snug text-gray-900">
              {report.title}
            </h2>

            <StatusBadge status={report.status} />
          </div>

          <p className="mt-1 text-[11px] font-medium text-gray-400">
            #{report.id}
          </p>

          <div className="mt-1 flex items-center gap-1 text-[11px] font-medium text-gray-500">
            <MapPin size={12} />
            <span className="line-clamp-1">{report.location}</span>
          </div>

          <p className="mt-2 text-[11px] text-gray-400">
            Updated: {report.updated}
          </p>
        </div>
      </div>
    </button>
  );
}

function DesktopReportCard({ report }) {
  return (
    <div className="flex items-center gap-5 rounded-2xl border border-gray-100 bg-white p-4 transition hover:border-green-200 hover:bg-green-50/30">
      <img
        src={report.image}
        alt={report.title}
        className="h-24 w-32 rounded-2xl object-cover"
      />

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-extrabold text-gray-900">
            {report.title}
          </h2>
          <StatusBadge status={report.status} />
        </div>

        <p className="mt-1 text-sm text-gray-400">#{report.id}</p>

        <div className="mt-2 flex items-center gap-1 text-sm text-gray-500">
          <MapPin size={15} />
          <span>{report.location}</span>
        </div>

        <p className="mt-2 text-sm text-gray-400">
          Updated: {report.updated}
        </p>
      </div>

      <div className="text-right">
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
          Category
        </p>
        <p className="mt-1 font-bold text-gray-800">{report.category}</p>

        <button className="mt-4 rounded-xl bg-green-700 px-4 py-2 text-sm font-semibold text-white hover:bg-green-800">
          View Details
        </button>
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const styles = {
    "In Progress": "bg-yellow-100 text-yellow-700",
    "Under Review": "bg-blue-100 text-blue-700",
    Resolved: "bg-green-100 text-green-700",
    Pending: "bg-gray-100 text-gray-600",
    Closed: "bg-gray-200 text-gray-700",
  };

  return (
    <span
      className={`shrink-0 rounded-full px-3 py-1 text-[10px] font-extrabold ${
        styles[status] || "bg-gray-100 text-gray-600"
      }`}
    >
      {status}
    </span>
  );
}

function SummaryCard({ title, value, color }) {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm">
      <p className="text-sm font-medium text-gray-500">{title}</p>
      <h2 className={`mt-3 text-4xl font-extrabold ${color}`}>{value}</h2>
    </div>
  );
}