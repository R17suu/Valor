// src/pages/Home.jsx
import { useEffect, useState } from "react";
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
import heroImage from "../assets/P1.png";
import cityLinkLogo from "../assets/logo.png";
import citySeal from "../assets/seal.png";

const heroSlides = [
  {
    image: heroImage,
    alt: "Aerial view of Valencia City",
    eyebrow: "Live city overview",
    title: "See what is happening across Valencia.",
    description:
      "Monitor reports, barangays, and response activity from a single dashboard.",
  },
  {
    image: cityLinkLogo,
    alt: "CityLink smart community reporting logo",
    eyebrow: "Digital reporting",
    title: "One place to submit and track concerns.",
    description:
      "Citizens can send reports with location details and follow progress in real time.",
  },
  {
    image: citySeal,
    alt: "Official seal of Valencia City",
    eyebrow: "Built for the LGU",
    title: "Connected to local government response.",
    description:
      "Designed to support faster coordination between residents and the city.",
  },
];

export default function Home() {
  return (
    <CitizenLayout>
      {/* Mobile Home Page */}
      <div className="lg:hidden">
        <section className="px-5 pt-6">
          <MobileHeroCarousel />
        </section>

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
            desc="See what's happening in Valencia City"
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
        <header className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-extrabold text-gray-900">
              Home Dashboard
            </h2>
            <p className="mt-1 text-gray-500">
              Welcome back, Valenciano. Here's your quick overview.
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

        <section className="mt-8 grid grid-cols-3 gap-6">
          <div className="col-span-2">
            <HeroCarousel />
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <h4 className="font-bold text-gray-900">Today's Priority</h4>
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

        <section className="mt-6 grid grid-cols-4 gap-6">
          <StatCard title="Total Reports" value="1,248" color="text-green-700" />
          <StatCard title="Active Incidents" value="86" color="text-yellow-600" />
          <StatCard title="Resolved" value="972" color="text-green-700" />
          <StatCard title="Critical" value="12" color="text-red-600" />
        </section>

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

function HeroCarousel() {
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const slideInterval = window.setInterval(() => {
      setActiveSlide((currentSlide) => (currentSlide + 1) % heroSlides.length);
    }, 4500);

    return () => window.clearInterval(slideInterval);
  }, []);

  return (
    <div className="relative min-h-[360px] overflow-hidden rounded-[2rem] shadow-[0_24px_60px_rgba(22,101,52,0.18)]">
      <div
        className="flex h-full min-h-[360px] transition-transform duration-700 ease-out"
        style={{ transform: `translateX(-${activeSlide * 100}%)` }}
      >
        {heroSlides.map((slide) => (
          <article
            key={slide.title}
            className="relative min-w-full overflow-hidden bg-cover bg-center"
            style={{ backgroundImage: `url(${slide.image})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-green-950/90 via-green-900/55 to-green-900/20" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.28),transparent_35%)]" />

            <div className="relative z-10 flex h-full min-h-[360px] flex-col justify-end p-8 text-white">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-green-100">
                {slide.eyebrow}
              </p>

              <h4 className="mt-3 max-w-md text-3xl font-extrabold leading-tight">
                {slide.title}
              </h4>

              <p className="mt-3 max-w-md text-sm leading-6 text-green-50/90">
                {slide.description}
              </p>

              <div className="mt-6 flex gap-3">
                <Link
                  to="/report-issue"
                  className="rounded-xl bg-white px-5 py-3 text-sm font-bold text-green-700 hover:bg-green-50"
                >
                  Report an Issue
                </Link>

                {/* <button className="rounded-xl bg-green-700/80 px-5 py-3 text-sm font-bold text-white backdrop-blur hover:bg-green-700">
                  View Dashboard
                </button> */}
              </div>
            </div>
          </article>
        ))}
      </div>

      <CarouselDots
        activeSlide={activeSlide}
        setActiveSlide={setActiveSlide}
        desktop
      />
    </div>
  );
}

function MobileHeroCarousel() {
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const slideInterval = window.setInterval(() => {
      setActiveSlide((currentSlide) => (currentSlide + 1) % heroSlides.length);
    }, 4500);

    return () => window.clearInterval(slideInterval);
  }, []);

  return (
    <div className="relative min-h-[230px] overflow-hidden rounded-3xl shadow-[0_18px_45px_rgba(22,101,52,0.18)]">
      <div
        className="flex h-full min-h-[230px] transition-transform duration-700 ease-out"
        style={{ transform: `translateX(-${activeSlide * 100}%)` }}
      >
        {heroSlides.map((slide) => (
          <article
            key={slide.title}
            className="relative min-w-full overflow-hidden bg-cover bg-center"
            style={{ backgroundImage: `url(${slide.image})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-green-950/90 via-green-900/60 to-green-900/20" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.25),transparent_35%)]" />

            <div className="relative z-10 flex min-h-[230px] flex-col justify-end p-5 text-white">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-green-100">
                {slide.eyebrow}
              </p>

              <h2 className="mt-2 text-xl font-extrabold leading-tight">
                {slide.title}
              </h2>

              <p className="mt-2 line-clamp-2 text-xs font-medium leading-5 text-green-50/90">
                {slide.description}
              </p>

              <Link
                to="/report-issue"
                className="mt-4 w-fit rounded-xl bg-white px-4 py-2.5 text-xs font-extrabold text-green-700"
              >
                Report Issue
              </Link>
            </div>
          </article>
        ))}
      </div>

      <CarouselDots
        activeSlide={activeSlide}
        setActiveSlide={setActiveSlide}
      />
    </div>
  );
}

function CarouselDots({ activeSlide, setActiveSlide, desktop = false }) {
  return (
    <div
      className={`absolute z-20 flex gap-2 ${
        desktop ? "bottom-6 right-6" : "bottom-4 right-4"
      }`}
    >
      {heroSlides.map((slide, index) => (
        <button
          key={slide.title}
          type="button"
          aria-label={`Show slide ${index + 1}`}
          onClick={() => setActiveSlide(index)}
          className={`rounded-full transition ${
            desktop ? "h-2.5" : "h-2"
          } ${
            index === activeSlide
              ? desktop
                ? "w-8 bg-white"
                : "w-6 bg-white"
              : desktop
              ? "w-2.5 bg-white/50 hover:bg-white/80"
              : "w-2 bg-white/50 hover:bg-white/80"
          }`}
        />
      ))}
    </div>
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