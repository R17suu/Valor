import { useState, useEffect } from "react";
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
import pothole from "../assets/national-highway.jpg";
import outage from "../assets/outage.jpg";
import light from "../assets/light.jpg";

const mockReports = [
  {
    id: "VAL-2024-00123",
    title: "Large pothole along National Highway",
    location: "Poblacion, Valencia City",
    updated: "June 8, 2025 · 10:30 AM",
    status: "In Progress",
    category: "Road Damage",
    image: pothole,
  },
  {
    id: "VAL-2024-00120",
    title: "Garbage accumulation near the river",
    location: "Bagontaas, Valencia City",
    updated: "June 7, 2025 · 2:15 PM",
    status: "Under Review",
    category: "Garbage and Waste",
    image: outage,
  },
  {
    id: "VAL-2024-00115",
    title: "Broken streetlight in front of school",
    location: "Lumobo, Valencia City",
    updated: "June 6, 2025 · 8:45 AM",
    status: "Resolved",
    category: "Street Lights",
    image: light,
  },
];

const filters = ["All", "Pending", "In Progress", "Resolved", "Closed"];

export default function MyReports() {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    // Load reports from localStorage
    const storedReports = JSON.parse(
      localStorage.getItem("valorReports") || "[]",
    );

    // Combine stored reports with mock reports
    const allReports = [
      ...storedReports.map((report) => ({
        ...report,
        image: report.photo_url || pothole,
        location: `${report.latitude?.toFixed(4)}, ${report.longitude?.toFixed(4)}`,
        updated: new Date(report.created_at).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        status: "Under Review",
      })),
      ...mockReports,
    ];

    setReports(allReports);
  }, []);

  return (
    <CitizenLayout>
      {/* Mobile View */}
      <div className="lg:hidden">
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
          {reports.length === 0 ? (
            <div className="rounded-2xl bg-white p-6 text-center py-12">
              <p className="text-gray-500">
                No reports yet. Submit one to get started!
              </p>
            </div>
          ) : (
            reports.map((report) => (
              <ReportCard key={report.id} report={report} />
            ))
          )}
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
            {reports.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">
                  No reports yet. Submit one to get started!
                </p>
              </div>
            ) : (
              reports.map((report) => (
                <DesktopReportCard key={report.id} report={report} />
              ))
            )}
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

        <p className="mt-2 text-sm text-gray-400">Updated: {report.updated}</p>
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
