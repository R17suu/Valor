// src/Admin/Reports.jsx
import { useState } from "react";
import {
  Search,
  Filter,
  ChevronDown,
  MoreHorizontal,
  Eye,
  CheckCircle,
  XCircle,
  UserCheck,
  Clock,
  Wrench,
  AlertTriangle,
  MapPin,
  Download,
  Plus,
} from "lucide-react";
import AdminLayout from "../layouts/AdminLayouts";

const reports = [
  {
    id: "#VAL-2025-1245",
    title: "Large pothole along National Highway",
    description: "Large pothole causing vehicles to slow down and creating safety risk.",
    location: "National Highway, Poblacion",
    barangay: "Poblacion",
    category: "Road / Infrastructure",
    priority: "High",
    status: "In Progress",
    department: "City Engineering Office",
    reporter: "Juan Dela Cruz",
    date: "June 8, 2025",
    time: "9:41 AM",
    image:
      "https://images.unsplash.com/photo-1605000797499-95a51c5269ae?q=80&w=300&auto=format&fit=crop",
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
    image:
      "https://images.unsplash.com/photo-1604187351574-c75ca79f5807?q=80&w=300&auto=format&fit=crop",
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
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=300&auto=format&fit=crop",
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
    image:
      "https://images.unsplash.com/photo-1527482797697-8795b05a13fe?q=80&w=300&auto=format&fit=crop",
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
    image:
      "https://images.unsplash.com/photo-1541919329513-35f7af297129?q=80&w=300&auto=format&fit=crop",
  },
];

const statuses = ["All", "Pending", "Under Review", "Assigned", "In Progress", "Resolved"];
const categories = [
  "All Categories",
  "Road / Infrastructure",
  "Flooding / Drainage",
  "Garbage / Waste",
  "Streetlights / Electrical",
  "Water Service",
];

export default function Reports() {
  const [selectedReport, setSelectedReport] = useState(reports[0]);

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
                className="h-12 w-full rounded-xl border border-gray-200 bg-gray-50 pl-11 pr-4 text-sm outline-none focus:border-green-700 focus:ring-1 focus:ring-green-700"
              />
            </div>

            <SelectFilter label="Status" options={statuses} />
            <SelectFilter label="Category" options={categories} />
            <button className="flex h-12 items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-5 text-sm font-bold text-gray-700 hover:bg-gray-50">
              <Filter size={17} />
              More Filters
            </button>
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
                  Showing latest reports submitted by residents.
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
                  {reports.map((report) => (
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
        <div className={`flex h-14 w-14 items-center justify-center rounded-full ${color}`}>
          {icon}
        </div>
        <div>
          <p className="text-sm font-bold text-gray-700">{title}</p>
          <h3 className="mt-1 text-3xl font-extrabold text-gray-900">{value}</h3>
        </div>
      </div>
    </div>
  );
}

function SelectFilter({ label, options }) {
  return (
    <button className="flex h-12 w-full min-w-0 items-center justify-between gap-3 rounded-xl border border-gray-200 bg-white px-4 text-sm font-bold text-gray-700 sm:min-w-44">
      {label}
      <ChevronDown size={16} />
    </button>
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
