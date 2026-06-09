// src/Citizen/CityMap.jsx
import {
  ArrowLeft,
  Layers,
  Navigation,
  MapPin,
  AlertTriangle,
  Droplets,
  Trash2,
  Lightbulb,
  TreePine,
  MoreHorizontal,
} from "lucide-react";
import CitizenLayout from "../layouts/CitizenLayouts";

const filters = ["All", "Pothole", "Flooding", "Garbage", "Streetlight"];

const incidents = [
  { id: 1, count: 12, top: "20%", left: "18%", color: "bg-red-600", title: "Road Damage" },
  { id: 2, count: 5, top: "32%", left: "34%", color: "bg-blue-600", title: "Flooding" },
  { id: 3, count: 3, top: "17%", left: "62%", color: "bg-purple-500", title: "Fallen Tree" },
  { id: 4, count: 6, top: "26%", left: "80%", color: "bg-green-600", title: "Garbage" },
  { id: 5, count: 8, top: "47%", left: "24%", color: "bg-blue-600", title: "Drainage" },
  { id: 6, count: 8, top: "41%", left: "43%", color: "bg-orange-500", title: "Streetlight" },
  { id: 7, count: 6, top: "47%", left: "72%", color: "bg-green-600", title: "Illegal Dumping" },
  { id: 8, count: 3, top: "61%", left: "61%", color: "bg-red-600", title: "Pothole" },
  { id: 9, count: 4, top: "71%", left: "77%", color: "bg-yellow-500", title: "Broken Streetlight" },
  { id: 10, count: 5, top: "76%", left: "23%", color: "bg-blue-600", title: "Flooding" },
  { id: 11, count: 8, top: "39%", left: "8%", color: "bg-green-600", title: "Garbage" },
];

const legends = [
  {
    label: "Pothole / Road Damage",
    icon: <AlertTriangle size={13} />,
    color: "bg-red-600",
  },
  {
    label: "Drainage / Flooding",
    icon: <Droplets size={13} />,
    color: "bg-blue-600",
  },
  {
    label: "Illegal Dumping / Garbage",
    icon: <Trash2 size={13} />,
    color: "bg-green-600",
  },
  {
    label: "Broken Streetlight",
    icon: <Lightbulb size={13} />,
    color: "bg-yellow-500",
  },
  {
    label: "Fallen Tree / Obstruction",
    icon: <TreePine size={13} />,
    color: "bg-purple-500",
  },
  {
    label: "Others",
    icon: <MoreHorizontal size={13} />,
    color: "bg-gray-500",
  },
];

export default function CityMap() {
  return (
    <CitizenLayout>
      {/* Mobile View */}
      <div className="lg:hidden">
        {/* <header className="flex items-center justify-between px-5 pt-5">
          <button className="rounded-lg p-2 hover:bg-gray-100">
            <ArrowLeft size={22} />
          </button>

          <div className="text-center">
            <h1 className="text-lg font-extrabold text-gray-900">City Map</h1>
            <p className="text-xs text-gray-500">Explore Issues in Your Area</p>
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
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </section>

        <main className="px-5 pt-3">
          <MapCard />

          <section className="-mt-4 rounded-3xl bg-white p-5 shadow-lg">
            <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-gray-200" />

            <h2 className="text-sm font-extrabold text-gray-900">
              Map Legend
            </h2>

            <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-4">
              {legends.map((legend) => (
                <LegendItem key={legend.label} legend={legend} />
              ))}
            </div>
          </section>
        </main>
      </div>

      {/* Desktop View */}
      <div className="hidden lg:block">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">City Map</h1>
            <p className="mt-1 text-gray-500">
              Monitor active community issues across Valencia City.
            </p>
          </div>

          <button className="rounded-2xl bg-green-700 px-5 py-3 text-sm font-semibold text-white hover:bg-green-800">
            Report New Issue
          </button>
        </header>

        <section className="mt-8 grid grid-cols-4 gap-6">
          <MapStat title="Active Incidents" value="86" color="text-green-700" />
          <MapStat title="High Priority" value="12" color="text-red-600" />
          <MapStat title="Barangays" value="31" color="text-yellow-600" />
          <MapStat title="Resolved Today" value="18" color="text-green-700" />
        </section>

        <section className="mt-8 grid grid-cols-12 gap-6">
          <div className="col-span-8 rounded-3xl bg-white p-5 shadow-sm">
            <div className="mb-5 flex flex-wrap gap-2">
              {filters.map((filter, index) => (
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

            <div className="h-[560px] overflow-hidden rounded-3xl">
              <MapCard desktop />
            </div>
          </div>

          <aside className="col-span-4 space-y-6">
            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <h2 className="text-lg font-extrabold text-gray-900">
                Map Legend
              </h2>

              <div className="mt-5 space-y-4">
                {legends.map((legend) => (
                  <LegendItem key={legend.label} legend={legend} desktop />
                ))}
              </div>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <h2 className="text-lg font-extrabold text-gray-900">
                Hotspot Areas
              </h2>

              <div className="mt-5 space-y-3">
                <HotspotItem area="Poblacion" count="18 reports" />
                <HotspotItem area="Bagontaas" count="12 reports" />
                <HotspotItem area="Lumobo" count="9 reports" />
              </div>
            </div>
          </aside>
        </section>
      </div>
    </CitizenLayout>
  );
}

function MapCard({ desktop = false }) {
  return (
    <div
      className={`relative overflow-hidden bg-[#EAF2EA] ${
        desktop ? "h-full rounded-3xl" : "h-[360px] rounded-3xl shadow-sm"
      }`}
    >
      {/* Fake map background */}
      <div className="absolute inset-0 opacity-80">
        <div className="absolute left-[-10%] top-[15%] h-20 w-[120%] rotate-[-12deg] bg-white/60" />
        <div className="absolute left-[-20%] top-[48%] h-16 w-[140%] rotate-[18deg] bg-white/70" />
        <div className="absolute left-[30%] top-[-10%] h-[120%] w-14 rotate-[10deg] bg-white/60" />
        <div className="absolute left-[70%] top-[-10%] h-[120%] w-12 rotate-[-20deg] bg-white/60" />

        <div className="absolute left-[10%] top-[10%] h-32 w-32 rounded-full bg-green-100/70" />
        <div className="absolute right-[5%] top-[20%] h-40 w-40 rounded-full bg-green-100/70" />
        <div className="absolute bottom-[15%] left-[20%] h-44 w-44 rounded-full bg-blue-100/50" />
        <div className="absolute bottom-[5%] right-[15%] h-32 w-32 rounded-full bg-green-100/70" />
      </div>

      {/* Place labels */}
      <span className="absolute left-[38%] top-[12%] text-xs font-bold text-gray-700">
        Lumbo
      </span>
      <span className="absolute left-[36%] top-[48%] text-xs font-bold text-gray-700">
        Poblacion
      </span>
      <span className="absolute right-[16%] top-[42%] text-xs font-bold text-gray-700">
        Bagontaas
      </span>

      {/* Markers */}
      {incidents.map((incident) => (
        <button
          key={incident.id}
          title={incident.title}
          className={`absolute flex h-9 w-9 items-center justify-center rounded-full text-xs font-extrabold text-white shadow-md ring-4 ring-white/80 ${incident.color}`}
          style={{
            top: incident.top,
            left: incident.left,
          }}
        >
          {incident.count}
        </button>
      ))}

      {/* Floating map controls */}
      <div className="absolute right-4 top-[58%] space-y-3">
        <button className="flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-md">
          <Layers size={19} />
        </button>

        <button className="flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-md">
          <Navigation size={19} />
        </button>
      </div>
    </div>
  );
}

function LegendItem({ legend, desktop = false }) {
  return (
    <div className="flex items-center gap-2">
      <span
        className={`flex items-center justify-center rounded-full text-white ${
          desktop ? "h-8 w-8" : "h-5 w-5"
        } ${legend.color}`}
      >
        {legend.icon}
      </span>

      <span
        className={`font-semibold text-gray-700 ${
          desktop ? "text-sm" : "text-[11px]"
        }`}
      >
        {legend.label}
      </span>
    </div>
  );
}

function MapStat({ title, value, color }) {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm">
      <p className="text-sm font-medium text-gray-500">{title}</p>
      <h2 className={`mt-3 text-4xl font-extrabold ${color}`}>{value}</h2>
    </div>
  );
}

function HotspotItem({ area, count }) {
  return (
    <div className="flex items-center justify-between rounded-2xl bg-gray-50 p-4">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 text-red-600">
          <MapPin size={18} />
        </div>
        <div>
          <p className="font-bold text-gray-900">{area}</p>
          <p className="text-sm text-gray-500">{count}</p>
        </div>
      </div>

      <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-bold text-red-600">
        Hotspot
      </span>
    </div>
  );
}