import { MapPin, Clock3, ArrowUpRight } from "lucide-react";
import CitizenLayout from "../Layouts/CitizenLayouts";

const filters = ["All", "New", "Pending", "In Progress", "Resolved"];

const communityUpdates = [
  {
    id: "COMM-001",
    title: "Pothole reported near the main road",
    location: "Barangay 5, near the main road",
    status: "Pending Review",
    badge: "New",
    badgeColor: "bg-green-100 text-green-700",
    dotColor: "bg-orange-500",
    category: "Road Damage",
    reportedAt: "Today, 9:20 AM",
    image:
      "https://images.unsplash.com/photo-1594230614807-2f2791c1bb7b?q=80&w=400&auto=format&fit=crop",
  },
  {
    id: "COMM-002",
    title: "Streetlight outage near Magsaysay Avenue",
    location: "Magsaysay Ave, Zone 3",
    status: "Technician Dispatched",
    badge: "2h ago",
    badgeColor: "bg-gray-100 text-gray-600",
    dotColor: "bg-green-600",
    category: "Streetlights",
    reportedAt: "Today, 7:05 AM",
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=400&auto=format&fit=crop",
  },
  {
    id: "COMM-003",
    title: "Drainage blockage beside the public market",
    location: "Poblacion Public Market",
    status: "Under Review",
    badge: "4h ago",
    badgeColor: "bg-blue-100 text-blue-700",
    dotColor: "bg-blue-500",
    category: "Drainage",
    reportedAt: "Today, 5:40 AM",
    image:
      "https://images.unsplash.com/photo-1527482797697-8795b05a13fe?q=80&w=400&auto=format&fit=crop",
  },
  {
    id: "COMM-004",
    title: "Garbage accumulation near the riverbank",
    location: "Bagontaas Riverside",
    status: "Cleanup Scheduled",
    badge: "Yesterday",
    badgeColor: "bg-yellow-100 text-yellow-700",
    dotColor: "bg-yellow-500",
    category: "Garbage",
    reportedAt: "June 8, 2026",
    image:
      "https://images.unsplash.com/photo-1604187351574-c75ca79f5807?q=80&w=400&auto=format&fit=crop",
  },
  {
    id: "COMM-005",
    title: "Water leakage along the national road",
    location: "National Road, Maputi",
    status: "Resolved",
    badge: "Resolved",
    badgeColor: "bg-green-100 text-green-700",
    dotColor: "bg-green-600",
    category: "Water Service",
    reportedAt: "June 7, 2026",
    image:
      "https://images.unsplash.com/photo-1541919329513-35f7af297129?q=80&w=400&auto=format&fit=crop",
  },
];

export default function CommunityUpdates() {
  return (
    <CitizenLayout>
      <div className="lg:hidden">
        <section className="px-5 pt-5">
          <h1 className="text-2xl font-extrabold text-gray-900">
            Community Updates
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            See public reports and the latest city response activity.
          </p>
        </section>

        <section className="px-5 pt-4">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {filters.map((filter, index) => (
              <button
                key={filter}
                className={`shrink-0 rounded-full px-4 py-2 text-xs font-bold ${
                  index === 0
                    ? "bg-green-700 text-white"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </section>

        <section className="space-y-4 px-5 pb-24 pt-2">
          {communityUpdates.map((update) => (
            <MobileCommunityUpdateCard key={update.id} update={update} />
          ))}
        </section>
      </div>

      <div className="hidden lg:block">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">
              Community Updates
            </h1>
            <p className="mt-1 text-gray-500">
              Public citizen reports and visible response updates across
              Valencia City.
            </p>
          </div>

          <div className="flex gap-2">
            {filters.slice(0, 4).map((filter, index) => (
              <button
                key={filter}
                className={`rounded-full px-5 py-2 text-sm font-bold ${
                  index === 0
                    ? "bg-green-700 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-green-50 hover:text-green-700"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </header>

        <section className="mt-8 grid grid-cols-4 gap-6">
          <SummaryCard title="Public Reports" value="128" color="text-green-700" />
          <SummaryCard title="New Today" value="14" color="text-blue-600" />
          <SummaryCard title="In Review" value="29" color="text-yellow-600" />
          <SummaryCard title="Resolved" value="85" color="text-green-700" />
        </section>

        <section className="mt-8 rounded-3xl bg-white p-6 shadow-sm">
          <div className="grid gap-4">
            {communityUpdates.map((update) => (
              <DesktopCommunityUpdateCard key={update.id} update={update} />
            ))}
          </div>
        </section>
      </div>
    </CitizenLayout>
  );
}

function MobileCommunityUpdateCard({ update }) {
  return (
    <button className="w-full rounded-2xl bg-white p-3 text-left shadow-sm transition hover:scale-[1.01]">
      <div className="flex items-center gap-3">
        <img
          src={update.image}
          alt={update.title}
          className="h-20 w-20 shrink-0 rounded-xl object-cover"
        />

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h2 className="line-clamp-2 text-base font-extrabold leading-snug text-gray-900">
              {update.title}
            </h2>

            <span
              className={`shrink-0 rounded-full px-3 py-1 text-[10px] font-bold ${update.badgeColor}`}
            >
              {update.badge}
            </span>
          </div>

          <p className="mt-1 line-clamp-1 text-sm font-medium text-gray-600">
            {update.location}
          </p>

          <div className="mt-2 flex items-center gap-2">
            <span className={`h-2 w-2 rounded-full ${update.dotColor}`} />
            <p className="text-[11px] font-medium text-gray-600">
              {update.status}
            </p>
          </div>
        </div>
      </div>
    </button>
  );
}

function DesktopCommunityUpdateCard({ update }) {
  return (
    <div className="flex items-center gap-5 rounded-2xl border border-gray-100 bg-white p-4 transition hover:border-green-200 hover:bg-green-50/30">
      <img
        src={update.image}
        alt={update.title}
        className="h-24 w-32 rounded-2xl object-cover"
      />

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-3">
              <h2 className="line-clamp-1 text-lg font-extrabold text-gray-900">
                {update.title}
              </h2>
              <span
                className={`shrink-0 rounded-full px-3 py-1 text-[10px] font-bold ${update.badgeColor}`}
              >
                {update.badge}
              </span>
            </div>

            <div className="mt-2 flex items-center gap-2 text-sm text-gray-500">
              <MapPin size={15} />
              <span>{update.location}</span>
            </div>

            <div className="mt-2 flex items-center gap-2 text-sm text-gray-500">
              <Clock3 size={15} />
              <span>{update.reportedAt}</span>
            </div>
          </div>

          <div className="text-right">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
              Category
            </p>
            <p className="mt-1 font-bold text-gray-800">{update.category}</p>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className={`h-2.5 w-2.5 rounded-full ${update.dotColor}`} />
            <p className="text-sm font-semibold text-gray-700">{update.status}</p>
          </div>

          <button className="flex items-center gap-2 rounded-xl bg-green-700 px-4 py-2 text-sm font-semibold text-white hover:bg-green-800">
            View Update
            <ArrowUpRight size={16} />
          </button>
        </div>
      </div>
    </div>
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
