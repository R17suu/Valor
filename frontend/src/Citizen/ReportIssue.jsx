// src/Citizen/ReportIssue.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  AlertTriangle,
  Waves,
  Trash2,
  Lightbulb,
  TreePine,
  Droplet,
  ShieldAlert,
  MoreHorizontal,
  ChevronRight,
  Camera,
  LocateFixed,
  Send,
  Check,
  MapPin,
} from "lucide-react";
import CitizenLayout from "../Layouts/CitizenLayouts";

const categories = [
  {
    name: "Pothole / Road Damage",
    icon: <AlertTriangle size={30} />,
    color: "text-yellow-500",
  },
  {
    name: "Drainage / Flooding",
    icon: <Waves size={30} />,
    color: "text-blue-500",
  },
  {
    name: "Illegal Dumping / Garbage",
    icon: <Trash2 size={30} />,
    color: "text-green-600",
  },
  {
    name: "Broken Streetlight",
    icon: <Lightbulb size={30} />,
    color: "text-yellow-400",
  },
  {
    name: "Fallen Tree / Obstruction",
    icon: <TreePine size={30} />,
    color: "text-green-700",
  },
  {
    name: "Water Service Issue",
    icon: <Droplet size={30} />,
    color: "text-blue-500",
  },
  {
    name: "Public Safety Concern",
    icon: <ShieldAlert size={30} />,
    color: "text-red-600",
  },
  {
    name: "Others",
    icon: <MoreHorizontal size={30} />,
    color: "text-gray-500",
  },
];

export default function ReportIssue() {
  const [step, setStep] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState("");
  const navigate = useNavigate();

  const handleNext = () => {
    if (!selectedCategory) return;
    setStep(2);
  };

  const handleSubmit = () => {
    setStep(3);
  };

  return (
    <CitizenLayout>
      {/* Mobile View */}
      <div className="lg:hidden">
        {step === 1 && (
          <ChooseCategory
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            onNext={handleNext}
            onBack={() => navigate("/home")}
          />
        )}

        {step === 2 && (
          <ReportDetails
            selectedCategory={selectedCategory}
            onSubmit={handleSubmit}
            onBack={() => setStep(1)}
          />
        )}

        {step === 3 && <ReportSubmitted />}
      </div>

      {/* Desktop View */}
      <div className="hidden lg:block">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">
              Report an Issue
            </h1>
            <p className="mt-1 text-gray-500">
              Submit a community concern with category, details, photo, and location.
            </p>
          </div>

          <button
            onClick={() => navigate("/home")}
            className="rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50"
          >
            Back to Home
          </button>
        </header>

        <section className="mt-8 grid grid-cols-12 gap-6">
          <aside className="col-span-4 rounded-3xl bg-white p-6 shadow-sm">
            <h2 className="text-xl font-extrabold text-gray-900">
              Choose Category
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Select the issue type that best describes your report.
            </p>

            <div className="mt-6 grid grid-cols-2 gap-4">
              {categories.map((category) => (
                <CategoryCard
                  key={category.name}
                  category={category}
                  selected={selectedCategory === category.name}
                  onClick={() => setSelectedCategory(category.name)}
                  desktop
                />
              ))}
            </div>
          </aside>

          <main className="col-span-8 rounded-3xl bg-white p-6 shadow-sm">
            {step !== 3 ? (
              <DesktopDetailsForm
                selectedCategory={selectedCategory}
                onSubmit={handleSubmit}
              />
            ) : (
              <DesktopSubmitted />
            )}
          </main>
        </section>
      </div>
    </CitizenLayout>
  );
}

function ChooseCategory({
  selectedCategory,
  setSelectedCategory,
  onNext,
  onBack,
}) {
  return (
    <div>
      {/* <header className="flex items-center justify-between px-5 pt-5">
        <button onClick={onBack} className="rounded-lg p-2 hover:bg-gray-100">
          <ArrowLeft size={22} />
        </button>

        <div className="text-center">
          <h1 className="text-lg font-extrabold text-gray-900">
            Report an Issue
          </h1>
          <p className="text-xs text-gray-500">Choose Category</p>
        </div>

        <div className="w-10" />
      </header> */}

      <main className="px-5 pt-6">
        <h2 className="text-lg font-extrabold text-gray-900">
          What kind of issue would you like to report?
        </h2>

        <section className="mt-5 grid grid-cols-2 gap-4">
          {categories.map((category) => (
            <CategoryCard
              key={category.name}
              category={category}
              selected={selectedCategory === category.name}
              onClick={() => setSelectedCategory(category.name)}
            />
          ))}
        </section>

        <button
          onClick={onNext}
          disabled={!selectedCategory}
          className={`mt-6 flex w-full items-center justify-center gap-2 rounded-2xl py-4 text-sm font-extrabold text-white transition ${
            selectedCategory
              ? "bg-green-700 hover:bg-green-800"
              : "bg-gray-300"
          }`}
        >
          Next
          <ChevronRight size={18} />
        </button>
      </main>
    </div>
  );
}

function CategoryCard({ category, selected, onClick, desktop = false }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-2xl border p-4 text-center shadow-sm transition hover:scale-[1.02] ${
        selected
          ? "border-green-700 bg-green-50 ring-2 ring-green-600"
          : "border-gray-100 bg-white"
      } ${desktop ? "min-h-33.75" : "min-h-30"}`}
    >
      <div className={`flex justify-center ${category.color}`}>
        {category.icon}
      </div>

      <p className="mt-3 text-xs font-extrabold leading-tight text-gray-800">
        {category.name}
      </p>
    </button>
  );
}

function ReportDetails({ selectedCategory, onSubmit, onBack }) {
  return (
    <div>
      <header className="flex items-center justify-between px-5 pt-5">
        <button onClick={onBack} className="rounded-lg p-2 hover:bg-gray-100">
          <ArrowLeft size={22} />
        </button>

        <div className="text-center">
          <h1 className="text-lg font-extrabold text-gray-900">
            Report Details
          </h1>
          <p className="text-xs text-gray-500">Add Details, Photo & Location</p>
        </div>

        <div className="w-10" />
      </header>

      <main className="px-5 pt-5">
        <div className="mb-4 rounded-2xl bg-green-50 px-4 py-3">
          <p className="text-xs font-semibold text-green-700">Selected Category</p>
          <p className="text-sm font-extrabold text-green-900">
            {selectedCategory}
          </p>
        </div>

        <ReportForm onSubmit={onSubmit} />
      </main>
    </div>
  );
}

function ReportForm({ onSubmit }) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
      className="space-y-4"
    >
      <div>
        <label className="text-xs font-bold text-gray-600">Title</label>
        <input
          type="text"
          defaultValue="Large pothole along National Highway"
          className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold outline-none focus:border-green-600"
        />
      </div>

      <div>
        <label className="text-xs font-bold text-gray-600">Description</label>
        <textarea
          rows="4"
          defaultValue="There is a large pothole that is causing vehicles to slow down. It’s dangerous, especially at night."
          className="mt-2 w-full resize-none rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold outline-none focus:border-green-600"
        />
      </div>

      <div>
        <label className="text-xs font-bold text-gray-600">Photo Optional</label>

        <div className="mt-2 grid grid-cols-2 gap-3">
          <div className="h-32 overflow-hidden rounded-xl bg-gray-100">
            <img
              src="https://images.unsplash.com/photo-1605000797499-95a51c5269ae?q=80&w=500&auto=format&fit=crop"
              alt="Road damage"
              className="h-full w-full object-cover"
            />
          </div>

          <button
            type="button"
            className="flex h-32 flex-col items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-500"
          >
            <Camera size={28} />
            <span className="mt-2 text-xs font-bold">Add Photo</span>
          </button>
        </div>
      </div>

      <div>
        <label className="text-xs font-bold text-gray-600">Location</label>

        <div className="mt-2 overflow-hidden rounded-xl border border-gray-200">
          <div className="relative h-36 bg-[#EAF2EA]">
            <div className="absolute left-[-10%] top-[30%] h-10 w-[120%] rotate-[-8deg] bg-white/70" />
            <div className="absolute left-[40%] top-[-10%] h-[130%] w-10 rotate-15 bg-white/70" />
            <div className="absolute right-6 top-5 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
              <div className="h-4 w-4 rounded-full bg-blue-500 ring-8 ring-blue-200" />
            </div>
            <MapPin
              size={38}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 fill-red-600 text-red-600"
            />
          </div>

          <div className="flex items-center justify-between bg-white px-4 py-3">
            <p className="text-xs font-extrabold text-gray-800">
              National Highway, Poblacion, Valencia City
            </p>
            <LocateFixed size={18} className="text-gray-600" />
          </div>
        </div>
      </div>

      <button
        type="submit"
        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-green-700 py-4 text-sm font-extrabold text-white hover:bg-green-800"
      >
        <Send size={17} />
        Submit Report
      </button>
    </form>
  );
}

function ReportSubmitted() {
  const navigate = useNavigate();

  return (
    <div className="px-5 pt-6">
      <section className="relative overflow-hidden rounded-3xl bg-green-800 px-5 py-8 text-center text-white shadow-sm">
        <div className="absolute left-8 top-14 h-2 w-2 rounded-full bg-red-400" />
        <div className="absolute right-10 top-24 h-2 w-2 rounded-full bg-yellow-400" />
        <div className="absolute left-20 top-8 h-2 w-2 rounded-full bg-green-400" />
        <div className="absolute right-20 top-12 h-2 w-2 rounded-full bg-blue-400" />

        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-white text-green-700">
          <Check size={44} strokeWidth={4} />
        </div>

        <h1 className="mt-6 text-3xl font-extrabold">Thank you!</h1>
        <p className="mt-4 text-sm font-semibold leading-6 text-green-50">
          Your report has been submitted. <br />
          We’ll notify you once there are updates.
        </p>

        <div className="mt-8 rounded-2xl bg-white p-5 text-left text-gray-900">
          <InfoBlock label="Report ID" value="#VAL-2024-00123" large />
          <InfoBlock label="Submitted" value="June 8, 2025 · 9:41 AM" />
          <InfoBlock label="Location" value="Poblacion, Valencia City" />
        </div>

        <button
          onClick={() => navigate("/reports")}
          className="mt-6 w-full rounded-xl bg-white py-3 text-sm font-extrabold text-green-700"
        >
          View My Reports
        </button>

        <button
          onClick={() => navigate("/home")}
          className="mt-3 w-full rounded-xl bg-green-600 py-3 text-sm font-extrabold text-white"
        >
          Back to Home
        </button>
      </section>
    </div>
  );
}

function InfoBlock({ label, value, large = false }) {
  return (
    <div className="mb-4 last:mb-0">
      <p className="text-xs font-bold text-gray-500">{label}</p>
      <p
        className={`font-extrabold text-gray-900 ${
          large ? "text-xl" : "text-sm"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function DesktopDetailsForm({ selectedCategory, onSubmit }) {
  return (
    <div>
      <h2 className="text-2xl font-extrabold text-gray-900">Report Details</h2>
      <p className="mt-1 text-sm text-gray-500">
        Add the issue title, description, photo, and location.
      </p>

      <div className="mt-5 rounded-2xl bg-green-50 px-5 py-4">
        <p className="text-xs font-semibold text-green-700">
          Selected Category
        </p>
        <p className="text-base font-extrabold text-green-900">
          {selectedCategory || "Please select a category first"}
        </p>
      </div>

      <div className="mt-6 max-w-2xl">
        <ReportForm onSubmit={onSubmit} />
      </div>
    </div>
  );
}

function DesktopSubmitted() {
  return (
    <div className="flex min-h-150 items-center justify-center">
      <div className="w-full max-w-md rounded-3xl bg-green-800 p-8 text-center text-white">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-white text-green-700">
          <Check size={44} strokeWidth={4} />
        </div>

        <h1 className="mt-6 text-3xl font-extrabold">Thank you!</h1>
        <p className="mt-4 text-sm font-semibold leading-6 text-green-50">
          Your report has been submitted. We’ll notify you once there are updates.
        </p>

        <div className="mt-8 rounded-2xl bg-white p-5 text-left text-gray-900">
          <InfoBlock label="Report ID" value="#VAL-2024-00123" large />
          <InfoBlock label="Submitted" value="June 8, 2025 · 9:41 AM" />
          <InfoBlock label="Location" value="Poblacion, Valencia City" />
        </div>
      </div>
    </div>
  );
}