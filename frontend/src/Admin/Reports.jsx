// src/Admin/Reports.jsx
import { useState, useMemo } from "react";
import {
  Search,
  ChevronDown,
  MoreHorizontal,
  Eye,
  CheckCircle,
  XCircle,
  UserCheck,
  MapPin,
  Download,
  Plus,
} from "lucide-react";
import AdminLayout from "../layouts/AdminLayouts";
import potholeImg from "../assets/pothole.jpg";
import garbageImg from "../assets/garbage-acc.jpg";
import lightImg from "../assets/light.jpg";
import highwayImg from "../assets/national-highway.jpg";
import p1Img from "../assets/P1.png";

const reports = [
  {
    id: "#VAL-2025-1245",
    title: "Large pothole along National Highway",
    description:
      "Large pothole causing vehicles to slow down and creating safety risk.",
    location: "National Highway, Poblacion",
    barangay: "Poblacion",
    category: "Road / Infrastructure",
    priority: "High",
    status: "In Progress",
    department: "City Engineering Office",
    reporter: "Juan Dela Cruz",
    date: "June 8, 2025",
    time: "9:41 AM",
    image: potholeImg,
  },
  {
    id: "#VAL-2025-1244",
    title: "Garbage accumulation near the river",
    description: "Garbage pile reported near the riverbank area.",
    location: "Riverbank, Bagontaas",
    barangay: "Bagontaas",
    category: "Garbage / Waste",
    priority: "Medium",
    status: "Under Review",
    department: "City Environment Office",
    reporter: "Maria Santos",
    date: "June 8, 2025",
    time: "8:15 AM",
    image: garbageImg,
  },
  {
    id: "#VAL-2025-1243",
    title: "Broken streetlight in front of school",
    description: "Streetlight is not working near Lumbo National High School.",
    location: "Lumbo National High School",
    barangay: "Lumbo",
    category: "Streetlights / Electrical",
    priority: "Low",
    status: "Assigned",
    department: "City Engineer",
    reporter: "Pedro Reyes",
    date: "June 8, 2025",
    time: "7:02 AM",
    image: lightImg,
  },
  {
    id: "#VAL-2025-1242",
    title: "Flooding during heavy rain",
    description: "Flooding happens in Purok 3 during heavy rainfall.",
    location: "Purok 3, Patag",
    barangay: "Patag",
    category: "Flooding / Drainage",
    priority: "Critical",
    status: "In Progress",
    department: "City Disaster Risk Reduction",
    reporter: "Ana Garcia",
    date: "June 7, 2025",
    time: "6:40 PM",
    image: p1Img,
  },
  {
    id: "#VAL-2025-1241",
    title: "Water leakage on main road",
    description: "Water leakage affecting road safety and traffic flow.",
    location: "National Road, Maputi",
    barangay: "Maputi",
    category: "Water Service",
    priority: "Medium",
    status: "Pending",
    department: "Water Service Office",
    reporter: "Mark Villanueva",
    date: "June 7, 2025",
    time: "4:30 PM",
    image: highwayImg,
  },
];

const statuses = [
  "All",
  "Pending",
  "Under Review",
  "Assigned",
  "In Progress",
  "Resolved",
];
const categories = [
  "All Categories",
  "Road / Infrastructure",
  "Flooding / Drainage",
  "Garbage / Waste",
  "Streetlights / Electrical",
  "Water Service",
];

export default function Reports() {
  // State for filters
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All Categories");
  const [sortBy, setSortBy] = useState("Recent"); // Recent or Most Linked
  const [statusDropdown, setStatusDropdown] = useState(false);
  const [categoryDropdown, setCategoryDropdown] = useState(false);
  const [sortDropdown, setSortDropdown] = useState(false);

  // Compute reports from localStorage and merge with static reports
  const reportsList = useMemo(() => {
    const storedReports = JSON.parse(
      localStorage.getItem("valorReports") || "[]",
    );
    // Normalize stored reports to have 'image' field instead of 'photo_url'
    const normalizedStoredReports = storedReports.map((report) => ({
      ...report,
      image: report.photo_url || report.image,
      barangay: report.barangay || "Unknown",
      location:
        report.location ||
        "Valencia City, Poblacion (10.3157°N, 123.7854°E) - Demo",
      date: report.created_at
        ? new Date(report.created_at).toLocaleDateString()
        : "Today",
      time: report.created_at
        ? new Date(report.created_at).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })
        : "Now",
      reporter: report.reporter || "Citizen",
    }));
    // Add mock linked reports count to each report (deterministic based on ID)
    const reportsWithLinked = [...reports, ...normalizedStoredReports].map(
      (report) => {
        // Use report ID to generate a deterministic "random" number
        const seed = report.id
          .split("")
          .reduce((a, b) => a + b.charCodeAt(0), 0);
        const linkedCount = (seed % 8) + 1; // Mock: 1-8 linked reports
        return {
          ...report,
          linked_reports_count: linkedCount,
        };
      },
    );

    // Sort by selection
    return reportsWithLinked.sort((a, b) => {
      if (sortBy === "Most Linked") {
        return b.linked_reports_count - a.linked_reports_count;
      }
      // Default: most recent
      const dateA = new Date(a.created_at || a.date);
      const dateB = new Date(b.created_at || b.date);
      return dateB - dateA;
    });
  }, [sortBy]);

  // Filter reports based on search, status, and category
  const filteredReports = useMemo(() => {
    return reportsList.filter((report) => {
      const matchesSearch =
        searchQuery === "" ||
        report.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        report.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        report.barangay.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === "All" ||
        report.status.toLowerCase() === statusFilter.toLowerCase();

      const matchesCategory =
        categoryFilter === "All Categories" ||
        report.category === categoryFilter;

      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [reportsList, searchQuery, statusFilter, categoryFilter]);

  const [selectedReport, setSelectedReport] = useState(() =>
    filteredReports.length > 0 ? filteredReports[0] : null,
  );

  return (
    <AdminLayout>
      <div className="space-y-4 sm:space-y-6">
        {/* Header */}
        <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900">
              Reports Management
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Review, verify, assign, and monitor citizen-submitted reports.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-bold text-gray-700 shadow-sm hover:bg-gray-50 sm:w-auto">
              <Download size={17} />
              Export
            </button>

            <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-green-700 px-4 py-3 text-sm font-bold text-white shadow-sm hover:bg-green-800 sm:w-auto">
              <Plus size={17} />
              Add Report
            </button>
          </div>
        </header>

        {/* Stats */}
        {/* <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <ReportStat
            title="Total Reports"
            value="1,245"
            icon={<AlertTriangle size={24} />}
            color="bg-green-100 text-green-700"
          />
          <ReportStat
            title="Pending Review"
            value="234"
            icon={<Clock size={24} />}
            color="bg-yellow-100 text-yellow-700"
          />
          <ReportStat
            title="In Progress"
            value="567"
            icon={<Wrench size={24} />}
            color="bg-blue-100 text-blue-700"
          />
          <ReportStat
            title="Resolved"
            value="444"
            icon={<CheckCircle size={24} />}
            color="bg-green-100 text-green-700"
          />
        </section> */}

        {/* Filters */}
        <section className="rounded-2xl bg-white p-4 shadow-sm sm:p-5">
          <div className="grid gap-4 lg:grid-cols-[1fr_auto_auto_auto]">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search report ID, issue, location, barangay..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-12 w-full rounded-xl border border-gray-200 bg-gray-50 pl-11 pr-4 text-sm outline-none focus:border-green-700 focus:ring-1 focus:ring-green-700"
              />
            </div>

            <div className="relative">
              <button
                onClick={() => setStatusDropdown(!statusDropdown)}
                className="flex h-12 w-full items-center justify-between gap-3 rounded-xl border border-gray-200 bg-white px-4 text-sm font-bold text-gray-700 hover:bg-gray-50 sm:min-w-44"
              >
                {statusFilter}
                <ChevronDown size={16} />
              </button>
              {statusDropdown && (
                <div className="absolute right-0 top-12 z-50 w-full min-w-44 rounded-xl border border-gray-200 bg-white shadow-lg">
                  {statuses.map((status) => (
                    <button
                      key={status}
                      onClick={() => {
                        setStatusFilter(status);
                        setStatusDropdown(false);
                      }}
                      className={`w-full px-4 py-2.5 text-left text-sm font-semibold ${
                        statusFilter === status
                          ? "bg-green-50 text-green-700"
                          : "text-gray-700 hover:bg-gray-50"
                      } first:rounded-t-xl last:rounded-b-xl`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="relative">
              <button
                onClick={() => setCategoryDropdown(!categoryDropdown)}
                className="flex h-12 w-full items-center justify-between gap-3 rounded-xl border border-gray-200 bg-white px-4 text-sm font-bold text-gray-700 hover:bg-gray-50 sm:min-w-44"
              >
                {categoryFilter}
                <ChevronDown size={16} />
              </button>
              {categoryDropdown && (
                <div className="absolute right-0 top-12 z-50 w-full min-w-48 rounded-xl border border-gray-200 bg-white shadow-lg">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => {
                        setCategoryFilter(category);
                        setCategoryDropdown(false);
                      }}
                      className={`w-full px-4 py-2.5 text-left text-sm font-semibold ${
                        categoryFilter === category
                          ? "bg-green-50 text-green-700"
                          : "text-gray-700 hover:bg-gray-50"
                      } first:rounded-t-xl last:rounded-b-xl`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="relative">
              <button
                onClick={() => setSortDropdown(!sortDropdown)}
                className="flex h-12 w-full items-center justify-between gap-3 rounded-xl border border-gray-200 bg-white px-4 text-sm font-bold text-gray-700 hover:bg-gray-50 sm:min-w-44"
              >
                {sortBy}
                <ChevronDown size={16} />
              </button>
              {sortDropdown && (
                <div className="absolute right-0 top-12 z-50 w-full min-w-44 rounded-xl border border-gray-200 bg-white shadow-lg">
                  {["Recent", "Most Linked"].map((option) => (
                    <button
                      key={option}
                      onClick={() => {
                        setSortBy(option);
                        setSortDropdown(false);
                      }}
                      className={`w-full px-4 py-2.5 text-left text-sm font-semibold ${
                        sortBy === option
                          ? "bg-green-50 text-green-700"
                          : "text-gray-700 hover:bg-gray-50"
                      } first:rounded-t-xl last:rounded-b-xl`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="grid gap-6 xl:grid-cols-12">
          {/* Reports Table */}
          <div className="rounded-2xl bg-white p-4 shadow-sm sm:p-5 xl:col-span-8">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-extrabold text-gray-900">
                  All Citizen Reports
                </h2>
                <p className="text-sm text-gray-500">
                  Showing {filteredReports.length} of {reportsList.length}{" "}
                  reports.
                </p>
              </div>
            </div>

            <div className="mt-5 overflow-x-auto">
              <table className="w-full min-w-[950px] text-left text-sm">
                <thead>
                  <tr className="border-b border-gray-100 text-xs text-gray-400">
                    <th className="px-3 py-3 font-bold">Report</th>
                    <th className="px-3 py-3 font-bold">Location</th>
                    <th className="px-3 py-3 font-bold">Category</th>
                    <th className="px-3 py-3 font-bold">Priority</th>
                    <th className="px-3 py-3 font-bold">Status</th>
                    <th className="px-3 py-3 font-bold">Department</th>
                    <th className="px-3 py-3 font-bold">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredReports &&
                    filteredReports.map((report) => (
                      <ReportRow
                        key={report.id}
                        report={report}
                        selected={selectedReport?.id === report.id}
                        onClick={() => setSelectedReport(report)}
                      />
                    ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Report Details Panel */}
          <aside className="rounded-2xl bg-white p-4 shadow-sm sm:p-5 xl:col-span-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-extrabold text-gray-900">
                Report Details
              </h2>
              <button className="rounded-lg p-2 hover:bg-gray-100">
                <MoreHorizontal size={18} />
              </button>
            </div>

            {selectedReport && (
              <div className="mt-5">
                <img
                  src={selectedReport.image}
                  alt={selectedReport.title}
                  className="h-44 w-full rounded-2xl object-cover sm:h-48"
                />

                <div className="mt-5 space-y-4">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-gray-400">
                      Report ID
                    </p>
                    <h3 className="mt-1 text-lg font-extrabold text-gray-900">
                      {selectedReport.id}
                    </h3>
                  </div>

                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-gray-400">
                      Issue
                    </p>
                    <h3 className="mt-1 text-base font-extrabold text-gray-900">
                      {selectedReport.title}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-gray-500">
                      {selectedReport.description}
                    </p>
                  </div>

                  <div className="flex items-start gap-3 rounded-2xl bg-gray-50 p-4">
                    <MapPin size={19} className="mt-1 text-green-700" />
                    <div>
                      <p className="text-sm font-bold text-gray-900">
                        {selectedReport.location}
                      </p>
                      <p className="text-xs text-gray-500">
                        {selectedReport.barangay}, Valencia City
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <InfoBox label="Category">
                      <CategoryBadge category={selectedReport.category} />
                    </InfoBox>

                    <InfoBox label="Priority">
                      <PriorityBadge priority={selectedReport.priority} />
                    </InfoBox>

                    <InfoBox label="Status">
                      <StatusBadge status={selectedReport.status} />
                    </InfoBox>

                    <InfoBox label="Reporter">
                      <p className="text-sm font-bold text-gray-800">
                        {selectedReport.reporter}
                      </p>
                    </InfoBox>
                  </div>

                  <InfoBox label="Assigned Department">
                    <p className="text-sm font-bold text-gray-800">
                      {selectedReport.department}
                    </p>
                  </InfoBox>

                  <InfoBox label="Reported On">
                    <p className="text-sm font-bold text-gray-800">
                      {selectedReport.date} · {selectedReport.time}
                    </p>
                  </InfoBox>

                  <div className="rounded-2xl border-2 border-orange-200 bg-orange-50 p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wide text-orange-600">
                          Linked Reports
                        </p>
                        <p className="mt-2 text-2xl font-extrabold text-orange-700">
                          {selectedReport.linked_reports_count}
                        </p>
                      </div>
                      <div className="text-4xl text-orange-300">🔗</div>
                    </div>
                    <p className="mt-2 text-xs text-orange-600">
                      Other citizens reported the same issue
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-3 pt-2 sm:grid-cols-2">
                    <button className="flex items-center justify-center gap-2 rounded-xl bg-green-700 px-4 py-3 text-sm font-bold text-white hover:bg-green-800">
                      <UserCheck size={17} />
                      Assign
                    </button>

                    <button className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-bold text-white hover:bg-blue-700">
                      <Eye size={17} />
                      View
                    </button>

                    <button className="flex items-center justify-center gap-2 rounded-xl bg-green-100 px-4 py-3 text-sm font-bold text-green-700 hover:bg-green-200">
                      <CheckCircle size={17} />
                      Resolve
                    </button>

                    <button className="flex items-center justify-center gap-2 rounded-xl bg-red-100 px-4 py-3 text-sm font-bold text-red-700 hover:bg-red-200">
                      <XCircle size={17} />
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            )}
          </aside>
        </section>
      </div>
    </AdminLayout>
  );
}

function ReportStat({ title, value, icon, color }) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm">
      <div className="flex items-center gap-4">
        <div
          className={`flex h-14 w-14 items-center justify-center rounded-full ${color}`}
        >
          {icon}
        </div>
        <div>
          <p className="text-sm font-bold text-gray-700">{title}</p>
          <h3 className="mt-1 text-3xl font-extrabold text-gray-900">
            {value}
          </h3>
        </div>
      </div>
    </div>
  );
}

function ReportRow({ report, selected, onClick }) {
  return (
    <tr
      onClick={onClick}
      className={`cursor-pointer border-b border-gray-100 last:border-b-0 ${
        selected ? "bg-green-50/70" : "hover:bg-gray-50"
      }`}
    >
      <td className="px-3 py-4">
        <div className="flex items-center gap-3">
          <img
            src={report.image}
            alt={report.title}
            className="h-12 w-12 rounded-lg object-cover"
          />
          <div>
            <p className="text-xs font-bold text-gray-400">{report.id}</p>
            <p className="font-extrabold text-gray-900">{report.title}</p>
            <p className="text-xs text-gray-500">
              {report.date} · {report.time}
            </p>
          </div>
        </div>
      </td>

      <td className="px-3 py-4">
        <p className="font-bold text-gray-700">{report.barangay}</p>
        <p className="text-xs text-gray-500">{report.location}</p>
      </td>

      <td className="px-3 py-4">
        <CategoryBadge category={report.category} />
      </td>

      <td className="px-3 py-4">
        <PriorityBadge priority={report.priority} />
      </td>

      <td className="px-3 py-4">
        <StatusBadge status={report.status} />
      </td>

      <td className="px-3 py-4">
        <p className="text-sm font-bold text-gray-700">{report.department}</p>
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
      className={`inline-flex rounded-lg px-3 py-1 text-xs font-extrabold ${
        styles[category] || "bg-gray-100 text-gray-700"
      }`}
    >
      {category}
    </span>
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
      className={`inline-flex rounded-lg px-3 py-1 text-xs font-extrabold ${
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
      className={`inline-flex rounded-lg px-3 py-1 text-xs font-extrabold ${
        styles[status] || "bg-gray-100 text-gray-700"
      }`}
    >
      {status}
    </span>
  );
}

function InfoBox({ label, children }) {
  return (
    <div className="rounded-2xl bg-gray-50 p-4">
      <p className="mb-2 text-xs font-bold uppercase tracking-wide text-gray-400">
        {label}
      </p>
      {children}
    </div>
  );
}
