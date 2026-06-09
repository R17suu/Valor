// src/pages/Home.jsx
import { useEffect, useState } from "react";
import {
  Search,
  Bell,
  Map,
} from "lucide-react";
import { Link } from "react-router-dom";
import CitizenLayout from "../Layouts/CitizenLayouts";
import cityOverview from "../assets/P2.jpg";
import digitalReport from "../assets/P3.jpg";
import lguResponse from "../assets/P5.jpg";

const heroSlides = [
  {
    image: cityOverview,
    alt: "Aerial view of Valencia City",
    eyebrow: "Live city overview",
    title: "See what is happening across Valencia.",
    description:
      "Monitor reports, barangays, and response activity from a single dashboard.",
  },
  {
    image: digitalReport,
    alt: "Citizen using a mobile phone to report a community issue",
    eyebrow: "Digital reporting",
    title: "One place to submit and track concerns.",
    description:
      "Citizens can send reports with location details and follow progress in real time.",
  },
  {
    image: lguResponse,
    alt: "Local government response team working on a city concern",
    eyebrow: "Built for the LGU",
    title: "Connected to local government response.",
    description:
      "Designed to support faster coordination between residents and the city.",
  },
];

const loopedHeroSlides = [
  heroSlides[heroSlides.length - 1],
  ...heroSlides,
  heroSlides[0],
];

export default function Home() {
  return (
    <CitizenLayout>
      {/* Mobile Home Page */}
      <div className="lg:hidden">
        <section className="px-5 pt-6">
          <MobileHeroCarousel />
        </section>

        <section className="px-5 pt-6">
          <NearbyIncidentsCard />
        </section>

        <section className="px-5 pt-6 pb-24">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-extrabold text-gray-900">
              Community Updates
            </h3>

            <Link
              to="/community-reports"
              className="text-sm font-bold text-green-700"
            >
              View all
            </Link>
          </div>

          <div className="mt-4 space-y-4">
            <CommunityReportCard
              image="https://images.unsplash.com/photo-1594230614807-2f2791c1bb7b?q=80&w=300&auto=format&fit=crop"
              title="Pothole reported"
              location="Barangay 5, near the main road"
              status="Pending Review"
              badge="New"
              badgeColor="bg-green-100 text-green-700"
              dotColor="bg-orange-500"
            />

            <CommunityReportCard
              image="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=300&auto=format&fit=crop"
              title="Streetlight Outage"
              location="Magsaysay Ave, Zone 3"
              status="Technician Dispatched"
              badge="2h ago"
              badgeColor="bg-gray-100 text-gray-600"
              dotColor="bg-green-600"
            />
          </div>
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
          <StatCard
            title="Total Reports"
            value="1,248"
            color="text-green-700"
          />
          <StatCard
            title="Active Incidents"
            value="86"
            color="text-yellow-600"
          />
          <StatCard title="Resolved" value="972" color="text-green-700" />
          <StatCard title="Critical" value="12" color="text-red-600" />
        </section>

        <section className="mt-6 grid grid-cols-12 gap-6">
          <div className="col-span-5">
            <NearbyIncidentsCard desktop />
          </div>

          <div className="col-span-7 rounded-3xl bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold">Community Reports</h3>
                <p className="text-sm text-gray-500">
                  Anonymous public reports submitted by citizens.
                </p>
              </div>

              <Link
                to="/community-reports"
                className="text-sm font-semibold text-green-700"
              >
                View all
              </Link>
            </div>

            <div className="mt-5 grid gap-4">
              <CommunityReportCard
                image="https://images.unsplash.com/photo-1594230614807-2f2791c1bb7b?q=80&w=300&auto=format&fit=crop"
                title="Pothole reported"
                location="Barangay 5, near the main road"
                status="Pending Review"
                badge="New"
                badgeColor="bg-green-100 text-green-700"
                dotColor="bg-orange-500"
              />

              <CommunityReportCard
                image="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=300&auto=format&fit=crop"
                title="Streetlight Outage"
                location="Magsaysay Ave, Zone 3"
                status="Technician Dispatched"
                badge="2h ago"
                badgeColor="bg-gray-100 text-gray-600"
                dotColor="bg-green-600"
              />
            </div>
          </div>
        </section>
      </div>
    </CitizenLayout>
  );
}

function useLoopingHeroCarousel() {
  const [activeSlide, setActiveSlide] = useState(1);
  const [isTransitionEnabled, setIsTransitionEnabled] = useState(true);

  useEffect(() => {
    const slideInterval = window.setInterval(() => {
      setIsTransitionEnabled(true);
      setActiveSlide((currentSlide) => currentSlide + 1);
    }, 4500);

    return () => window.clearInterval(slideInterval);
  }, []);

  useEffect(() => {
    if (isTransitionEnabled) {
      return undefined;
    }

    let firstFrame = 0;
    let secondFrame = 0;

    firstFrame = window.requestAnimationFrame(() => {
      secondFrame = window.requestAnimationFrame(() => {
        setIsTransitionEnabled(true);
      });
    });

    return () => {
      window.cancelAnimationFrame(firstFrame);
      window.cancelAnimationFrame(secondFrame);
    };
  }, [isTransitionEnabled]);

  const handleTransitionEnd = () => {
    if (activeSlide === loopedHeroSlides.length - 1) {
      setIsTransitionEnabled(false);
      setActiveSlide(1);
      return;
    }

    if (activeSlide === 0) {
      setIsTransitionEnabled(false);
      setActiveSlide(loopedHeroSlides.length - 2);
    }
  };

  const currentSlide =
    activeSlide === loopedHeroSlides.length - 1
      ? 0
      : activeSlide === 0
        ? heroSlides.length - 1
        : activeSlide - 1;

  const goToSlide = (index) => {
    setIsTransitionEnabled(true);
    setActiveSlide(index + 1);
  };

  return {
    activeSlide,
    currentSlide,
    goToSlide,
    handleTransitionEnd,
    isTransitionEnabled,
  };
}

function HeroCarousel() {
  const {
    activeSlide,
    currentSlide,
    goToSlide,
    handleTransitionEnd,
    isTransitionEnabled,
  } = useLoopingHeroCarousel();

  return (
    <div className="relative min-h-[360px] overflow-hidden rounded-[2rem] shadow-[0_24px_60px_rgba(22,101,52,0.18)]">
      <div
        className={`flex h-full min-h-[360px] ${
          isTransitionEnabled
            ? "transition-transform duration-700 ease-out"
            : "transition-none"
        }`}
        style={{ transform: `translateX(-${activeSlide * 100}%)` }}
        onTransitionEnd={handleTransitionEnd}
      >
        {loopedHeroSlides.map((slide, index) => (
          <article
            key={`${slide.title}-${index}`}
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
              </div>
            </div>
          </article>
        ))}
      </div>

      <CarouselDots
        activeSlide={currentSlide}
        setActiveSlide={goToSlide}
        desktop
      />
    </div>
  );
}

function MobileHeroCarousel() {
  const {
    activeSlide,
    currentSlide,
    goToSlide,
    handleTransitionEnd,
    isTransitionEnabled,
  } = useLoopingHeroCarousel();

  return (
    <div className="relative min-h-[230px] overflow-hidden rounded-3xl shadow-[0_18px_45px_rgba(22,101,52,0.18)]">
      <div
        className={`flex h-full min-h-[230px] ${
          isTransitionEnabled
            ? "transition-transform duration-700 ease-out"
            : "transition-none"
        }`}
        style={{ transform: `translateX(-${activeSlide * 100}%)` }}
        onTransitionEnd={handleTransitionEnd}
      >
        {loopedHeroSlides.map((slide, index) => (
          <article
            key={`${slide.title}-${index}`}
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

      <CarouselDots activeSlide={currentSlide} setActiveSlide={goToSlide} />
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
          className={`rounded-full transition ${desktop ? "h-2.5" : "h-2"} ${
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

function NearbyIncidentsCard({ desktop = false }) {
  return (
    <div>
      <h3
        className={`font-extrabold text-gray-900 ${
          desktop ? "text-xl" : "text-lg"
        }`}
      >
        Nearby Incidents
      </h3>

      <div
        className={`relative mt-4 overflow-hidden rounded-2xl bg-[#DDE7E3] shadow-sm ${
          desktop ? "h-[248px]" : "h-36"
        }`}
      >
        <div className="absolute inset-0 opacity-60">
          <div className="absolute left-[-10%] top-[45%] h-16 w-[120%] rounded-full border-t border-gray-400/30" />
          <div className="absolute left-[20%] top-[-20%] h-[160%] w-px bg-gray-400/20" />
          <div className="absolute left-[73%] top-[-20%] h-[160%] w-px bg-gray-400/20" />
          <div className="absolute left-[-20%] top-[68%] h-20 w-[140%] -rotate-12 rounded-full border-t border-gray-400/30" />
        </div>

        <div className="absolute left-4 top-4 rounded-xl bg-white px-4 py-3 shadow-sm">
          <p className="text-sm font-extrabold text-gray-700">
            3 Active Reports
          </p>
          <p className="mt-1 text-[11px] font-semibold text-gray-500">
            Within 2km radius
          </p>
        </div>

        <span className="absolute left-[34%] top-[52%] h-3 w-3 rounded-full bg-orange-500 ring-4 ring-orange-500/10" />
        <span className="absolute right-[15%] top-[32%] h-3 w-3 rounded-full bg-green-800 ring-4 ring-green-800/10" />

        <Link
          to="/map"
          className="absolute bottom-5 right-4 flex items-center gap-2 rounded-2xl bg-green-800 px-5 py-3 text-sm font-extrabold text-white shadow-md"
        >
          <Map size={16} />
          View Map
        </Link>
      </div>
    </div>
  );
}

function CommunityReportCard({
  image,
  title,
  location,
  status,
  badge,
  badgeColor,
  dotColor,
}) {
  return (
    <Link
      to="/community-reports"
      className="flex items-center gap-4 rounded-2xl bg-white p-4 shadow-sm transition hover:scale-[1.01]"
    >
      <img
        src={image}
        alt={title}
        className="h-20 w-20 shrink-0 rounded-xl object-cover"
      />

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <h4 className="line-clamp-1 text-base font-extrabold text-gray-900">
            {title}
          </h4>

          <span
            className={`shrink-0 rounded-full px-3 py-1 text-[10px] font-bold ${badgeColor}`}
          >
            {badge}
          </span>
        </div>

        <p className="mt-1 line-clamp-1 text-sm font-medium text-gray-700">
          {location}
        </p>

        <div className="mt-2 flex items-center gap-2">
          <span className={`h-2 w-2 rounded-full ${dotColor}`} />
          <p className="text-[11px] font-medium text-gray-600">{status}</p>
        </div>
      </div>
    </Link>
  );
}

function StatCard({ title, value, color }) {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm">
      <p className="text-sm font-medium text-gray-500">{title}</p>
      <h3 className={`mt-3 text-3xl font-extrabold ${color}`}>{value}</h3>
    </div>
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
