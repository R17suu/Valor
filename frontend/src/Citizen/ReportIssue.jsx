// src/Citizen/ReportIssue.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Camera,
  Upload,
  ImagePlus,
  LocateFixed,
  Send,
  Check,
  MapPin,
  Sparkles,
  FileText,
  Building2,
  Zap,
  AlertTriangle,
  ChevronRight,
} from "lucide-react";
import CitizenLayout from "../Layouts/CitizenLayouts";

const aiResult = {
  title: "Large pothole detected along National Highway",
  description:
    "The uploaded photo appears to show a large pothole on the road. This may cause safety risks for vehicles, motorcycles, and pedestrians, especially during night time or rainy weather.",
  category: "Pothole / Road Damage",
  priority: "High",
  department: "City Engineering Office",
  location: "National Highway, Poblacion, Valencia City",
};

export default function ReportIssue() {
  const [step, setStep] = useState(1);
  const [hasPhoto, setHasPhoto] = useState(false);
  const navigate = useNavigate();

  const handlePhotoNext = () => {
    if (!hasPhoto) return;
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
          <UploadPhotoStep
            hasPhoto={hasPhoto}
            setHasPhoto={setHasPhoto}
            onNext={handlePhotoNext}
            onBack={() => navigate("/home")}
          />
        )}

        {step === 2 && (
          <AIReviewStep
            onSubmit={handleSubmit}
            onBack={() => setStep(1)}
          />
        )}

        {step === 3 && <ReportSubmitted />}
      </div>

      {/* Desktop View */}
      <div className="hidden lg:block">
        <section className="mt-8 grid grid-cols-12 gap-6">
          <aside className="col-span-4 rounded-3xl bg-white p-6 shadow-sm">
            <h2 className="text-xl font-extrabold text-gray-900">
              Report Flow
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Upload a photo and VALOR AI will generate the report details.
            </p>

            <div className="mt-6 space-y-4">
              <FlowItem
                number="1"
                title="Upload Photo"
                desc="Take or upload a picture of the issue."
                active={step === 1}
              />
              <FlowItem
                number="2"
                title="AI Generated Report"
                desc="AI fills the title, category, description, priority, and department."
                active={step === 2}
              />
              <FlowItem
                number="3"
                title="Submit Report"
                desc="Review the generated report and send it to the LGU."
                active={step === 3}
              />
            </div>
          </aside>

          <main className="col-span-8 rounded-3xl bg-white p-6 shadow-sm">
            {step === 1 && (
              <UploadPhotoStep
                hasPhoto={hasPhoto}
                setHasPhoto={setHasPhoto}
                onNext={handlePhotoNext}
                onBack={() => navigate("/home")}
                desktop
              />
            )}

            {step === 2 && (
              <AIReviewStep
                onSubmit={handleSubmit}
                onBack={() => setStep(1)}
                desktop
              />
            )}

            {step === 3 && <DesktopSubmitted />}
          </main>
        </section>
      </div>
    </CitizenLayout>
  );
}

function UploadPhotoStep({ hasPhoto, setHasPhoto, onNext, onBack, desktop = false }) {
  return (
    <div>
      <main className={desktop ? "" : "px-5 pt-6"}>
        <h2 className="text-xl font-extrabold text-gray-900">
          Take or upload a picture
        </h2>
        <p className="mt-2 text-sm text-gray-500">
          VALOR AI will analyze the photo and automatically fill the report details.
        </p>

        <div className="mt-6 rounded-3xl border-2 border-dashed border-green-200 bg-green-50 p-5 text-center">
          {hasPhoto ? (
            <div className="overflow-hidden rounded-2xl">
              <img
                src="https://images.unsplash.com/photo-1605000797499-95a51c5269ae?q=80&w=700&auto=format&fit=crop"
                alt="Uploaded issue"
                className="h-64 w-full object-cover"
              />
            </div>
          ) : (
            <div className="flex min-h-64 flex-col items-center justify-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white text-green-700 shadow-sm">
                <ImagePlus size={38} />
              </div>
              <h3 className="mt-5 text-lg font-extrabold text-gray-900">
                No photo selected
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                Take a photo or upload from your device.
              </p>
            </div>
          )}

          <div className="mt-5 grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setHasPhoto(true)}
              className="flex items-center justify-center gap-2 rounded-2xl bg-green-700 py-4 text-sm font-extrabold text-white hover:bg-green-800"
            >
              <Camera size={18} />
              Take Photo
            </button>

            <button
              type="button"
              onClick={() => setHasPhoto(true)}
              className="flex items-center justify-center gap-2 rounded-2xl bg-white py-4 text-sm font-extrabold text-green-700 shadow-sm hover:bg-green-50"
            >
              <Upload size={18} />
              Upload
            </button>
          </div>
        </div>

        <button
          onClick={onNext}
          disabled={!hasPhoto}
          className={`mt-6 flex w-full items-center justify-center gap-2 rounded-2xl py-4 text-sm font-extrabold text-white transition ${
            hasPhoto ? "bg-green-700 hover:bg-green-800" : "bg-gray-300"
          }`}
        >
          Analyze Photo with AI
          <Sparkles size={18} />
        </button>
      </main>
    </div>
  );
}

function AIReviewStep({ onSubmit, desktop = false }) {
  return (
    <div>
      <main className={desktop ? "" : "px-5 pt-5"}>
        <section className="rounded-3xl bg-green-50 p-5">
          <div className="flex items-center gap-2 text-green-700">
            <Sparkles size={18} />
            <h3 className="text-sm font-extrabold">
              AI automatically analyzed your photo
            </h3>
          </div>

          <p className="mt-2 text-sm text-green-800">
            The fields below were generated based on the uploaded image. You can review them before submitting.
          </p>

          <div className="mt-5 space-y-4">
            <AIField
              icon={<FileText size={18} />}
              label="Generated Title"
              value={aiResult.title}
            />

            <AIField
              icon={<AlertTriangle size={18} />}
              label="Generated Description"
              value={aiResult.description}
            />

            <div className="grid grid-cols-2 gap-3">
              <AIField
                icon={<FileText size={18} />}
                label="Category"
                value={aiResult.category}
              />

              <AIField
                icon={<Zap size={18} />}
                label="Priority"
                value={aiResult.priority}
              />
            </div>

            <AIField
              icon={<Building2 size={18} />}
              label="Assigned Department"
              value={aiResult.department}
            />
          </div>
        </section>

        <section className="mt-5">
          <label className="text-xs font-bold text-gray-600">Location</label>

          <div className="mt-2 overflow-hidden rounded-xl border border-gray-200">
            <div className="relative h-36 bg-[#EAF2EA]">
              <div className="absolute left-[-10%] top-[30%] h-10 w-[120%] rotate-[-8deg] bg-white/70" />
              <div className="absolute left-[40%] top-[-10%] h-[130%] w-10 rotate-[15deg] bg-white/70" />
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
                {aiResult.location}
              </p>
              <LocateFixed size={18} className="text-gray-600" />
            </div>
          </div>
        </section>

        <button
          type="button"
          onClick={onSubmit}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-green-700 py-4 text-sm font-extrabold text-white hover:bg-green-800"
        >
          <Send size={17} />
          Submit Report
        </button>
      </main>
    </div>
  );
}

function AIField({ icon, label, value }) {
  return (
    <div className="rounded-2xl bg-white p-4">
      <div className="flex items-center gap-2 text-green-700">
        {icon}
        <p className="text-xs font-bold uppercase tracking-wide">{label}</p>
      </div>
      <p className="mt-2 text-sm font-extrabold leading-6 text-gray-900">
        {value}
      </p>
    </div>
  );
}

function FlowItem({ number, title, desc, active }) {
  return (
    <div
      className={`rounded-2xl p-4 ${
        active ? "bg-green-600 text-white" : "bg-green-800/70 text-green-50"
      }`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-extrabold ${
            active ? "bg-white text-green-700" : "bg-green-700 text-white"
          }`}
        >
          {number}
        </div>
        <div>
          <p className="font-extrabold">{title}</p>
          <p className="mt-1 text-xs opacity-80">{desc}</p>
        </div>
      </div>
    </div>
  );
}

function ReportSubmitted() {
  const navigate = useNavigate();

  return (
    <div className="px-5 pt-6">
      <section className="relative overflow-hidden rounded-3xl bg-green-800 px-5 py-8 text-center text-white shadow-sm">
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
          <InfoBlock label="Location" value={aiResult.location} />
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
          <InfoBlock label="Location" value={aiResult.location} />
        </div>
      </div>
    </div>
  );
}