// src/pages/Home.jsx
import {
  Plus,
  FileText,
  BarChart3,
  Info,
  Search,
  Bell,
  MapPin,
  CheckCircle,
} from "lucide-react";
import { Link } from "react-router-dom";
import CitizenLayout from "../Layouts/CitizenLayouts";
import ApplicationLogo from "../Components/ApplicationLogo";

export default function Home() {
  return (
    <CitizenLayout>
      {/* Mobile Home Page */}
      <div className="lg:hidden">
        {/* Greeting Card */}
        <section className="px-5 pt-6">
          <div className="relative overflow-hidden rounded-2xl bg-green-100 p-5">
            <div className="relative z-10 max-w-[60%]">
              <h2 className="text-lg font-bold text-green-900">
                Good morning, Valenciano! 👋
              </h2>
              <p className="mt-2 text-xs font-medium text-green-800">
                Together, let’s build a better Valencia City.
              </p>
            </div>

            {/* Simple City Illustration */}
            <div className="absolute bottom-0 right-0 h-28 w-40">
              <div className="absolute bottom-0 right-0 h-16 w-36 rounded-t-full bg-green-300" />
              <div className="absolute bottom-0 right-6 h-20 w-28 rounded-t-full bg-green-400" />
              <div className="absolute bottom-0 right-12 h-12 w-8 rounded-t-md bg-yellow-400" />
              <div className="absolute bottom-0 right-4 h-16 w-8 rounded-t-md bg-green-700" />
              <div className="absolute right-16 top-4 h-4 w-8 rounded-full bg-white" />
              <div className="absolute right-5 top-9 h-3 w-3 rounded-full bg-yellow-400" />
            </div>
          </div>
        </section>

        {/* Feature Cards */}
        <section className="grid grid-cols-2 gap-4 px-5 pt-5">
          <MobileFeatureCard
            title="REPORT AN ISSUE"
            desc="Submit a concern in your area"
            color="bg-green-700 text-white"
            icon={<Plus size={24} />}
            iconBox="bg-white text-green-700"
            to="/report-issue"
          />

          <MobileFeatureCard
            title="MY REPORTS"
            desc="Track the status of your reports"
            color="bg-orange-50 text-orange-700"
            icon={<FileText size={24} />}
            iconBox="bg-orange-400 text-white"
          />

          <MobileFeatureCard
            title="CITY DASHBOARD"
            desc="See what’s happening in Valencia City"
            color="bg-blue-50 text-blue-700"
            icon={<BarChart3 size={24} />}
            iconBox="bg-blue-500 text-white"
          />

          <MobileFeatureCard
            title="ABOUT VALOR"
            desc="Learn more about the platform"
            color="bg-purple-50 text-purple-700"
            icon={<Info size={24} />}
            iconBox="bg-purple-500 text-white"
          />
        </section>
      </div>

      {/* Desktop Home Page */}
      <div className="hidden lg:block">
        {/* Desktop Header */}
        <header className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-extrabold text-gray-900">
              Home Dashboard
            </h2>
            <p className="mt-1 text-gray-500">
              Welcome back, Valenciano. Here’s your quick overview.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type="text"
                placeholder="Search reports..."
                className="w-72 rounded-2xl border border-gray-200 bg-white py-3 pl-11 pr-4 text-sm outline-none focus:border-green-600"
              />
            </div>

            <button className="rounded-2xl bg-white p-3 shadow-sm">
              <Bell size={20} />
            </button>
          </div>
        </header>

        {/* Hero Section */}
        <section className="mt-8 grid grid-cols-3 gap-6">
          <div className="col-span-2 overflow-hidden rounded-3xl bg-green-100 p-8">
            <div className="max-w-xl">
              <h3 className="text-3xl font-extrabold text-green-950">
                Good morning, Valenciano! 👋
              </h3>
              <p className="mt-3 text-green-800">
                Report community issues, track LGU response, and help build a
                smarter Valencia City.
              </p>

              <div className="mt-6 flex gap-3">
                <Link
                  to="/report-issue"
                  className="rounded-xl bg-green-700 px-5 py-3 text-sm font-semibold text-white hover:bg-green-800"
                >
                  Report an Issue
                </Link>
                <button className="rounded-xl bg-white px-5 py-3 text-sm font-semibold text-green-700 hover:bg-green-50">
                  View Public Dashboard
                </button>
              </div>
            </div>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <h4 className="font-bold text-gray-900">Today’s Priority</h4>
            <p className="mt-2 text-sm text-gray-500">
              Critical reports that need quick LGU attention.
            </p>

            <div className="mt-5 space-y-3">
              <PriorityItem title="Flooding reported" area="Poblacion" />
              <PriorityItem title="Broken streetlight" area="Bagontaas" />
              <PriorityItem title="Road damage" area="Batangan" />
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="mt-6 grid grid-cols-4 gap-6">
          <StatCard title="Total Reports" value="1,248" color="text-green-700" />
          <StatCard title="Active Incidents" value="86" color="text-yellow-600" />
          <StatCard title="Resolved" value="972" color="text-green-700" />
          <StatCard title="Critical" value="12" color="text-red-600" />
        </section>

        {/* Quick Actions */}
        <section className="mt-6 grid grid-cols-4 gap-6">
          <DesktopFeatureCard
            title="Report an Issue"
            desc="Submit a concern with photo and location."
            icon={<Plus size={26} />}
            color="bg-green-700 text-white"
            to="/report-issue"
          />

          <DesktopFeatureCard
            title="My Reports"
            desc="Track your submitted community reports."
            icon={<FileText size={26} />}
            color="bg-orange-50 text-orange-700"
          />

          <DesktopFeatureCard
            title="Incident Map"
            desc="View active reports across Valencia."
            icon={<MapPin size={26} />}
            color="bg-blue-50 text-blue-700"
          />

          <DesktopFeatureCard
            title="Resolved Issues"
            desc="See proof of completed LGU actions."
            icon={<CheckCircle size={26} />}
            color="bg-purple-50 text-purple-700"
          />
        </section>

        {/* Recent Reports */}
        <section className="mt-6 rounded-3xl bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold">Recent Community Reports</h3>
              <p className="text-sm text-gray-500">
                Latest issues submitted by citizens.
              </p>
            </div>

            <button className="text-sm font-semibold text-green-700">
              View all
            </button>
          </div>

          <div className="mt-5 overflow-hidden rounded-2xl border border-gray-100">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-500">
                <tr>
                  <th className="px-5 py-4">Issue</th>
                  <th className="px-5 py-4">Barangay</th>
                  <th className="px-5 py-4">Priority</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4">Date</th>
                </tr>
              </thead>

              <tbody>
                <ReportRow
                  issue="Road damage near public market"
                  barangay="Poblacion"
                  priority="High"
                  status="In Progress"
                  date="Today"
                />
                <ReportRow
                  issue="Garbage accumulation"
                  barangay="Bagontaas"
                  priority="Medium"
                  status="Under Review"
                  date="Today"
                />
                <ReportRow
                  issue="Broken streetlight"
                  barangay="Batangan"
                  priority="Low"
                  status="Assigned"
                  date="Yesterday"
                />
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </CitizenLayout>
  );
}

function MobileFeatureCard({ title, desc, color, icon, iconBox, to }) {
  const wrapperClasses = `min-h-[135px] rounded-2xl p-4 text-left shadow-sm transition hover:scale-[1.02] ${color}`;

  const content = (
    <div className="flex h-full flex-col justify-between">
      <div>
        <h3 className="text-sm font-extrabold leading-tight">{title}</h3>
        <p className="mt-2 text-xs font-medium opacity-80">{desc}</p>
      </div>

      <div className="flex justify-end">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-full ${iconBox}`}
        >
          {icon}
        </div>
      </div>
    </div>
  );

  if (to) {
    return (
      <Link to={to} className={wrapperClasses}>
        {content}
      </Link>
    );
  }

  return <button className={wrapperClasses}>{content}</button>;
}

function StatCard({ title, value, color }) {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm">
      <p className="text-sm font-medium text-gray-500">{title}</p>
      <h3 className={`mt-3 text-3xl font-extrabold ${color}`}>{value}</h3>
    </div>
  );
}

function DesktopFeatureCard({ title, desc, icon, color, to }) {
  const cardClasses = `rounded-3xl p-6 text-left shadow-sm transition hover:scale-[1.02] ${color}`;

  const cardContent = (
    <>
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/40">
        {icon}
      </div>

      <h3 className="mt-5 text-lg font-bold">{title}</h3>
      <p className="mt-2 text-sm opacity-80">{desc}</p>
    </>
  );

  return to ? (
    <Link to={to} className={cardClasses}>
      {cardContent}
    </Link>
  ) : (
    <button className={cardClasses}>{cardContent}</button>
  );
}

function PriorityItem({ title, area }) {
  return (
    <div className="flex items-center justify-between rounded-2xl bg-gray-50 p-3">
      <div>
        <p className="text-sm font-bold">{title}</p>
        <p className="text-xs text-gray-500">{area}</p>
      </div>

      <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-bold text-red-600">
        High
      </span>
    </div>
  );
}

function ReportRow({ issue, barangay, priority, status, date }) {
  return (
    <tr className="border-t border-gray-100">
      <td className="px-5 py-4 font-semibold text-gray-800">{issue}</td>
      <td className="px-5 py-4 text-gray-500">{barangay}</td>
      <td className="px-5 py-4">
        <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-bold text-yellow-700">
          {priority}
        </span>
      </td>
      <td className="px-5 py-4">
        <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
          {status}
        </span>
      </td>
      <td className="px-5 py-4 text-gray-500">{date}</td>
    </tr>
  );
}