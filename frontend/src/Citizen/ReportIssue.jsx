// src/Citizen/ReportIssue.jsx
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Camera,
  ImagePlus,
  LocateFixed,
  Navigation,
  Send,
  Check,
  MapPin,
  Sparkles,
  FileText,
  Building2,
  Zap,
  AlertTriangle,
  Loader,
} from "lucide-react";
import CitizenLayout from "../Layouts/CitizenLayouts";
import DuplicateDetectionAlert from "./DuplicateDetectionAlert";
import { uploadToCloudinary } from "../services/cloudinaryApi";
import { callDraftReport, createReport } from "../services/reportApi";
import { getMockGPSLocation } from "../services/gps";
import garbageSampleImg from "../assets/garbage-sample.jpg";

// Department display names to database names mapping
const DEPARTMENT_MAP = {
  "Engineering Office": "Engineering Office",
  "City ENRO": "CENRO (City Environment and Natural Resources Office)",
  "Disaster Risk Reduction Office": "Disaster Risk Reduction Office",
  "Water District": "Water District",
  "Public Safety Office": "Public Safety Office",
};

const DISPLAY_DEPARTMENTS = Object.keys(DEPARTMENT_MAP);

// Convert DB department name to display name
const getDepartmentDisplay = (dbName) => {
  if (!dbName) return DISPLAY_DEPARTMENTS[0];
  return (
    Object.keys(DEPARTMENT_MAP).find(
      (key) => DEPARTMENT_MAP[key].toLowerCase() === dbName.toLowerCase(),
    ) || DISPLAY_DEPARTMENTS[0]
  );
};

// Convert display name to DB department name
const getDepartmentDb = (displayName) => {
  return DEPARTMENT_MAP[displayName] || DEPARTMENT_MAP[DISPLAY_DEPARTMENTS[0]];
};

export default function ReportIssue() {
  const [step, setStep] = useState(1);
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [aiResult, setAiResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [reportId, setReportId] = useState(null);
  const [gpsLocation, setGpsLocation] = useState(null);
  const [formData, setFormData] = useState({});
  const [duplicateData, setDuplicateData] = useState(null);
  const [showDuplicateAlert, setShowDuplicateAlert] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handlePhotoSelect = (file) => {
    setPhotoFile(file);
    const reader = new FileReader();
    reader.onload = (e) => setPhotoPreview(e.target.result);
    reader.readAsDataURL(file);
  };

  const handleUseMockSample = async () => {
    setIsLoading(true);
    try {
      // Fetch the garbage sample image
      const response = await fetch(garbageSampleImg);
      const blob = await response.blob();
      const file = new File([blob], "garbage-sample.jpg", {
        type: "image/jpeg",
      });
      handlePhotoSelect(file);
      setIsLoading(false);

      // Show image for 3 seconds before advancing to review
      await new Promise((resolve) => setTimeout(resolve, 3000));
      setIsLoading(true);

      // Use mock data directly without calling API
      const location = getMockGPSLocation();
      setGpsLocation(location);

      // Mock AI response for demo
      const mockAiResult = {
        photoUrl: garbageSampleImg,
        title: "Garbage accumulation on the road",
        description:
          "Large pile of garbage scattered across the roadside, causing environmental concern and potential health hazards.",
        category: "Garbage / Waste",
        priority: "high",
        department: "City ENRO",
        confidence: 0.92,
        location: `${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}`,
      };

      setAiResult(mockAiResult);
      setFormData({
        title: mockAiResult.title,
        description: mockAiResult.description,
        category: mockAiResult.category,
        priority: mockAiResult.priority,
        department: mockAiResult.department,
      });
      setIsLoading(false);
      setStep(2);
    } catch (error) {
      console.error("Error loading sample:", error);
      alert("Failed to load sample");
      setIsLoading(false);
    }
  };

  const handlePhotoNext = async () => {
    if (!photoFile) return;

    setIsLoading(true);
    try {
      const location = getMockGPSLocation();
      setGpsLocation(location);

      const uploadResult = await uploadToCloudinary(photoFile);
      if (!uploadResult.success) {
        alert("Failed to upload image: " + uploadResult.error);
        setIsLoading(false);
        return;
      }

      const photoUrl = uploadResult.url;
      const aiResponse = await callDraftReport(
        photoUrl,
        location.latitude,
        location.longitude,
      );

      if (!aiResponse.success) {
        alert("Failed to analyze photo: " + aiResponse.error);
        setIsLoading(false);
        return;
      }

      // Convert database department name to display name for frontend
      const displayDepartment = getDepartmentDisplay(
        aiResponse.data.department,
      );
      const formattedAiResult = {
        photoUrl,
        title: aiResponse.data.suggested_title,
        description: aiResponse.data.description,
        category: aiResponse.data.category,
        priority: aiResponse.data.priority,
        department: displayDepartment,
        confidence: aiResponse.data.confidence,
        location: `${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}`,
      };

      setAiResult(formattedAiResult);
      setFormData({
        title: formattedAiResult.title,
        description: formattedAiResult.description,
        category: formattedAiResult.category,
        priority: formattedAiResult.priority,
        department: formattedAiResult.department,
      });
      setStep(2);
    } catch (error) {
      console.error("Error processing photo:", error);
      alert("An error occurred: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Simulate duplicate detection (mock)
  const checkForDuplicates = async () => {
    // Simulate a 100% chance of finding a duplicate (demo mode)
    const shouldFindDuplicate = Math.random() < 1;

    if (shouldFindDuplicate) {
      // Mock data with realistic scenarios
      // Most commonly: 2-4 people reporting the same issue
      const reporterCounts = [2, 2, 3, 3, 4, 5]; // Weighted towards 2-3 people
      const randomCount =
        reporterCounts[Math.floor(Math.random() * reporterCounts.length)];

      const mockDuplicate = {
        duplicate_found: true,
        incident_id: `inc-${Math.random().toString(36).substr(2, 9)}`,
        distance_meters: Math.floor(Math.random() * 80) + 5, // 5-85 meters
        existing_incident_count: randomCount,
      };
      setDuplicateData(mockDuplicate);
      setShowDuplicateAlert(true);
      return mockDuplicate;
    }
    return null;
  };

  const handleProceedWithDuplicate = async (incidentId) => {
    // User chose to add to existing incident
    setShowDuplicateAlert(false);
    await submitReport(true, incidentId);
  };

  const handleSubmitAsNew = async () => {
    // User chose to submit as new report anyway
    setShowDuplicateAlert(false);
    await submitReport(false);
  };

  const handleGoBackFromDuplicate = () => {
    setShowDuplicateAlert(false);
    setDuplicateData(null);
    setStep(2); // Go back to AI review step
  };

  const submitReport = async (isDuplicate = false, incidentId = null) => {
    if (!aiResult || !gpsLocation) return;

    setIsLoading(true);
    try {
      const displayDept = formData.department || aiResult.department;

      // Mock report for hackathon/demo
      const mockReportId = `#VAL-${Date.now()}`;
      const mockReport = {
        id: mockReportId,
        title: formData.title || aiResult.title,
        description: formData.description || aiResult.description,
        category: formData.category || aiResult.category,
        priority: (formData.priority || aiResult.priority).toLowerCase(),
        department: displayDept,
        photo_url: aiResult.photoUrl,
        latitude: gpsLocation.latitude,
        longitude: gpsLocation.longitude,
        status: isDuplicate ? "linked_to_incident" : "submitted",
        created_at: new Date().toISOString(),
        incident_id: incidentId || undefined,
      };

      // Store report in localStorage for persistence
      const existingReports = JSON.parse(
        localStorage.getItem("valorReports") || "[]",
      );
      existingReports.push(mockReport);
      localStorage.setItem("valorReports", JSON.stringify(existingReports));

      setReportId(mockReportId);
      setAiResult((prev) => ({
        ...prev,
        submittedReport: mockReport,
        linkedToIncident: isDuplicate,
      }));
      setStep(3);
    } catch (error) {
      console.error("Error submitting report:", error);
      alert("An error occurred: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!aiResult || !gpsLocation) return;

    setIsLoading(true);
    try {
      // Show loader for 2 seconds for demo purposes
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // First, check for duplicates
      const duplicate = await checkForDuplicates();
      setIsLoading(false);
      // The duplicate alert will handle the next steps
    } catch (error) {
      console.error("Error checking duplicates:", error);
      setIsLoading(false);
      // If duplicate check fails, proceed with normal submission
      await submitReport(false);
    }
  };

  return (
    <CitizenLayout>
      {isLoading && <LoadingScreen />}

      {/* Duplicate Detection Alert Modal */}
      {showDuplicateAlert && (
        <DuplicateDetectionAlert
          duplicateData={duplicateData}
          onProceedWithDuplicate={handleProceedWithDuplicate}
          onSubmitAsNew={handleSubmitAsNew}
          onGoBack={handleGoBackFromDuplicate}
          isLoading={isLoading}
        />
      )}

      {/* Mobile View */}
      <div className="lg:hidden">
        {step === 1 && (
          <UploadPhotoStep
            photoFile={photoFile}
            photoPreview={photoPreview}
            onPhotoSelect={handlePhotoSelect}
            onPhotoNext={handlePhotoNext}
            onUseMockSample={handleUseMockSample}
            fileInputRef={fileInputRef}
            onBack={() => navigate("/home")}
            isLoading={isLoading}
          />
        )}

        {step === 2 && (
          <AIReviewStep
            aiResult={aiResult}
            formData={formData}
            setFormData={setFormData}
            onSubmit={handleSubmit}
            onBack={() => setStep(1)}
            isLoading={isLoading}
          />
        )}

        {step === 3 && (
          <ReportSubmitted
            reportId={reportId}
            department={
              aiResult?.submittedReport?.department || aiResult?.department
            }
            title={aiResult?.submittedReport?.title || aiResult?.title}
          />
        )}
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
                title="Edit Details"
                desc="Review and edit the AI suggested fields if needed."
                active={step === 2}
              />
              <FlowItem
                number="3"
                title="Submit Report"
                desc="Send your report to the LGU."
                active={step === 3}
              />
            </div>
          </aside>

          <main className="col-span-8 rounded-3xl bg-white p-6 shadow-sm">
            {step === 1 && (
              <UploadPhotoStep
                photoFile={photoFile}
                photoPreview={photoPreview}
                onPhotoSelect={handlePhotoSelect}
                onPhotoNext={handlePhotoNext}
                onUseMockSample={handleUseMockSample}
                fileInputRef={fileInputRef}
                onBack={() => navigate("/home")}
                desktop
                isLoading={isLoading}
              />
            )}

            {step === 2 && (
              <AIReviewStep
                aiResult={aiResult}
                formData={formData}
                setFormData={setFormData}
                onSubmit={handleSubmit}
                onBack={() => setStep(1)}
                desktop
                isLoading={isLoading}
              />
            )}

            {step === 3 && (
              <DesktopSubmitted
                reportId={reportId}
                department={
                  aiResult?.submittedReport?.department || aiResult?.department
                }
                title={aiResult?.submittedReport?.title || aiResult?.title}
              />
            )}
          </main>
        </section>
      </div>
    </CitizenLayout>
  );
}

function UploadPhotoStep({
  photoFile,
  photoPreview,
  onPhotoSelect,
  onPhotoNext,
  onUseMockSample,
  fileInputRef,
  onBack,
  desktop = false,
  isLoading = false,
}) {
  const handleFileInput = (e) => {
    const file = e.target.files?.[0];
    if (file) onPhotoSelect(file);
  };

  return (
    <div>
      <main className={desktop ? "" : "px-5 pt-6"}>
        <div className="flex items-center gap-2 mb-4">
          <button
            onClick={onBack}
            className="text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft size={20} />
          </button>
          <h2 className="text-xl font-extrabold text-gray-900">
            Take or upload a picture
          </h2>
        </div>
        <p className="mt-2 text-sm text-gray-500">
          VALOR AI will analyze the photo and automatically fill the report
          details.
        </p>

        <div className="mt-6 rounded-3xl border-2 border-dashed border-green-200 bg-green-50 p-5 text-center">
          {photoPreview ? (
            <div className="overflow-hidden rounded-2xl">
              <img
                src={photoPreview}
                alt="Selected issue"
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

          <div className="mt-5 grid grid-cols-1 gap-3">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isLoading}
              className="flex items-center justify-center gap-2 rounded-2xl bg-green-700 py-4 text-sm font-extrabold text-white hover:bg-green-800 disabled:bg-gray-400"
            >
              <Camera size={18} />
              Choose Photo
            </button>

            <button
              type="button"
              onClick={onUseMockSample}
              disabled={isLoading}
              className="text-xs font-medium text-gray-400 hover:text-gray-500 py-2 transition-colors"
            >
              Try sample
            </button>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileInput}
            className="hidden"
          />
        </div>

        <button
          onClick={onPhotoNext}
          disabled={!photoFile || isLoading}
          className={`mt-6 flex w-full items-center justify-center gap-2 rounded-2xl py-4 text-sm font-extrabold text-white transition ${
            photoFile && !isLoading
              ? "bg-green-700 hover:bg-green-800"
              : "bg-gray-300 cursor-not-allowed"
          }`}
        >
          {isLoading ? (
            <>
              <Loader size={18} className="animate-spin" />
              Processing...
            </>
          ) : (
            <>
              Analyze Photo with AI
              <Sparkles size={18} />
            </>
          )}
        </button>
      </main>
    </div>
  );
}

function AIReviewStep({
  aiResult,
  formData,
  setFormData,
  onSubmit,
  onBack,
  desktop = false,
  isLoading = false,
}) {
  if (!aiResult) {
    return (
      <div className={desktop ? "" : "px-5 pt-5"}>Loading AI analysis...</div>
    );
  }

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div>
      <main className={desktop ? "" : "px-5 pt-5"}>
        <div className="flex items-center gap-2 mb-4">
          <button
            onClick={onBack}
            className="text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft size={20} />
          </button>
          <h2 className="text-xl font-extrabold text-gray-900">
            Review Report Details
          </h2>
        </div>

        {aiResult.photoUrl && (
          <div className="mb-4 overflow-hidden rounded-2xl">
            <img
              src={aiResult.photoUrl}
              alt="Report issue"
              className="h-48 w-full object-cover"
            />
          </div>
        )}

        <section className="rounded-2xl bg-green-50 p-3 mb-5 border-l-4 border-green-700">
          <div className="flex items-center gap-2 text-green-700">
            <Sparkles size={14} />
            <p className="text-xs font-semibold">
              AI suggested these details. Edit any field before submitting.
            </p>
          </div>
        </section>

        <form className="space-y-3">
          <EditableField
            icon={<FileText size={18} />}
            label="Title"
            value={formData.title || aiResult.title}
            onChange={(val) => handleChange("title", val)}
          />

          <EditableField
            icon={<AlertTriangle size={18} />}
            label="Description"
            value={formData.description || aiResult.description}
            onChange={(val) => handleChange("description", val)}
            textarea
          />

          <div className="flex flex-col gap-3 md:grid md:grid-cols-2">
            <EditableField
              icon={<FileText size={18} />}
              label="Category"
              value={formData.category || aiResult.category}
              onChange={(val) => handleChange("category", val)}
              isSelect
              options={[
                "Potholes",
                "Road Damage",
                "Flooding",
                "Illegal Dumping",
                "Garbage Accumulation",
                "Broken Streetlights",
                "Fallen Trees",
                "Water Service Issues",
                "Public Safety Concerns",
              ]}
            />

            <EditableField
              icon={<Zap size={18} />}
              label="Priority"
              value={formData.priority || aiResult.priority}
              onChange={(val) => handleChange("priority", val)}
              isSelect
              options={["critical", "high", "medium", "low"]}
            />
          </div>

          <EditableField
            icon={<Building2 size={18} />}
            label="Department"
            value={
              formData.department !== undefined
                ? formData.department
                : aiResult.department
            }
            onChange={(val) => handleChange("department", val)}
            isSelect
            options={DISPLAY_DEPARTMENTS}
          />
        </form>

        <section className="mt-5">
          <label className="text-xs font-bold text-gray-600">
            Location (GPS Mock)
          </label>
          <MockLocationCard coordinates={aiResult.location} />
        </section>

        <button
          type="button"
          onClick={onSubmit}
          disabled={isLoading}
          className={`mt-6 flex w-full items-center justify-center gap-2 rounded-2xl py-4 text-sm font-extrabold text-white transition ${
            !isLoading
              ? "bg-green-700 hover:bg-green-800"
              : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          {isLoading ? (
            <>
              <Loader size={18} className="animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              <Send size={17} />
              Submit Report
            </>
          )}
        </button>
      </main>
    </div>
  );
}

function EditableField({
  icon,
  label,
  value,
  onChange,
  textarea = false,
  isSelect = false,
  options = [],
}) {
  const getPriorityColors = (val) => {
    if (label === "Priority") {
      if (val === "critical" || val === "high") {
        return {
          border: "border-red-300",
          text: "text-red-700",
          bg: "bg-red-50",
        };
      }
      if (val === "medium") {
        return {
          border: "border-yellow-300",
          text: "text-yellow-700",
          bg: "bg-yellow-50",
        };
      }
      if (val === "low") {
        return {
          border: "border-green-300",
          text: "text-green-700",
          bg: "bg-green-50",
        };
      }
    }
    return { border: "border-gray-300", text: "text-gray-900", bg: "bg-white" };
  };

  const priorityColors = getPriorityColors(value);

  return (
    <div className="rounded-lg bg-white border border-gray-200 p-3">
      <div className="flex items-center gap-2 text-gray-700 mb-2">
        {icon}
        <label className="text-xs font-bold uppercase tracking-wide text-gray-700">
          {label}
        </label>
      </div>
      {isSelect ? (
        <div className="relative">
          <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={`w-full text-sm font-semibold rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none pr-10 ${
              label === "Priority"
                ? `${priorityColors.bg} ${priorityColors.border} ${priorityColors.text}`
                : "bg-white border-gray-300 text-gray-900"
            }`}
          >
            {options.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-600">
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </div>
        </div>
      ) : textarea ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={3}
          className="w-full text-sm font-semibold text-gray-900 rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full text-sm font-semibold text-gray-900 rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      )}
    </div>
  );
}

function FlowItem({ number, title, desc, active }) {
  return (
    <div
      className={`rounded-2xl p-4 ${
        active ? "bg-green-700 text-white" : "bg-gray-100 text-gray-700"
      }`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-extrabold ${
            active ? "bg-white text-green-700" : "bg-gray-300 text-gray-700"
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
function MockLocationCard({ coordinates }) {
  const majorRoads = [
    "left-[-6%] top-[18%] h-4 w-[120%] rotate-[-10deg]",
    "left-[-4%] top-[36%] h-4 w-[116%] rotate-[7deg]",
    "left-[8%] top-[54%] h-4 w-[108%] rotate-[-12deg]",
    "left-[18%] top-[74%] h-4 w-[96%] rotate-[5deg]",
    "left-[14%] top-[-6%] h-[118%] w-4 rotate-[13deg]",
    "left-[36%] top-[-8%] h-[124%] w-4 rotate-[-7deg]",
    "left-[58%] top-[-10%] h-[128%] w-4 rotate-[10deg]",
    "left-[80%] top-[-4%] h-[114%] w-4 rotate-[-11deg]",
  ];

  const minorRoads = [
    "left-[4%] top-[10%] h-2 w-[104%] rotate-[3deg]",
    "left-[0%] top-[28%] h-2 w-[108%] rotate-[-4deg]",
    "left-[14%] top-[46%] h-2 w-[96%] rotate-[2deg]",
    "left-[8%] top-[64%] h-2 w-[102%] rotate-[-5deg]",
    "left-[26%] top-[82%] h-2 w-[72%] rotate-[3deg]",
    "left-[24%] top-[-6%] h-[112%] w-2 rotate-[7deg]",
    "left-[48%] top-[-8%] h-[118%] w-2 rotate-[-9deg]",
    "left-[68%] top-[-6%] h-[114%] w-2 rotate-[6deg]",
  ];

  const parks = [
    "left-[10%] top-[16%] h-10 w-10",
    "left-[72%] top-[12%] h-8 w-8",
    "left-[60%] top-[48%] h-8 w-9",
    "left-[22%] top-[70%] h-10 w-12",
  ];

  const contextPins = [
    { top: "16%", left: "18%", color: "text-red-500", size: 28 },
    { top: "18%", left: "26%", color: "text-amber-400", size: 24 },
    { top: "30%", left: "48%", color: "text-red-500", size: 30 },
    { top: "14%", left: "82%", color: "text-green-500", size: 30 },
    { top: "46%", left: "74%", color: "text-green-500", size: 30 },
    { top: "70%", left: "66%", color: "text-amber-400", size: 28 },
    { top: "74%", left: "12%", color: "text-amber-400", size: 26 },
    { top: "78%", left: "30%", color: "text-red-500", size: 28 },
  ];

  return (
    <div className="mt-2 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="relative h-56 bg-[#edf2f5]">
        <div className="absolute left-[6%] top-[8%] h-16 w-14 rounded-md bg-[#d8efcc]" />
        <div className="absolute right-[14%] top-[18%] h-12 w-12 rounded-md bg-[#d8efcc]" />
        <div className="absolute left-[54%] top-[46%] h-10 w-10 rounded-md bg-[#d8efcc]" />
        <div className="absolute left-[18%] bottom-[16%] h-14 w-16 rounded-md bg-[#d8efcc]" />

        {majorRoads.map((street) => (
          <div
            key={street}
            className={`absolute rounded-full bg-white/95 shadow-[0_0_0_1px_rgba(203,213,225,0.35)] ${street}`}
          />
        ))}

        {minorRoads.map((street) => (
          <div
            key={street}
            className={`absolute rounded-full bg-white/90 shadow-[0_0_0_1px_rgba(226,232,240,0.45)] ${street}`}
          />
        ))}

        {parks.map((park) => (
          <div
            key={park}
            className={`absolute rounded-sm bg-[#d8efcc] ${park}`}
          />
        ))}

        {contextPins.map((pin) => (
          <div
            key={`${pin.top}-${pin.left}`}
            className="absolute -translate-x-1/2 -translate-y-full"
            style={{ top: pin.top, left: pin.left }}
          >
            <MapPin
              size={pin.size}
              className={`${pin.color} fill-current drop-shadow-[0_8px_14px_rgba(15,23,42,0.16)]`}
            />
          </div>
        ))}

        <div className="absolute left-[54%] top-[64%] -translate-x-1/2 -translate-y-1/2">
          <div className="absolute left-1/2 top-1/2 h-14 w-14 -translate-x-1/2 -translate-y-1/2 rounded-full bg-sky-400/20 blur-md" />
          <Navigation
            size={38}
            fill="currentColor"
            strokeWidth={1.8}
            className="relative rotate-[16deg] text-sky-500 drop-shadow-[0_10px_16px_rgba(59,130,246,0.28)]"
          />
        </div>

        <div className="absolute left-[72%] top-[58%] -translate-x-1/2 -translate-y-full">
          <MapPin
            size={34}
            className="fill-current text-green-500 drop-shadow-[0_10px_18px_rgba(34,197,94,0.22)]"
          />
        </div>

        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between rounded-2xl bg-white/96 px-4 py-3 shadow-sm">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-gray-400">
              Coordinates
            </p>
            <p className="mt-1 text-sm font-extrabold text-gray-900">
              {coordinates}
            </p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-full border border-green-100 bg-green-700 text-white">
            <LocateFixed size={16} />
          </div>
        </div>
      </div>
    </div>
  );
}

function ReportSubmitted({ reportId, department, title }) {
  const navigate = useNavigate();
  const now = new Date();
  const formattedDate = now.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  const formattedTime = now.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  return (
    <div className="px-5 pt-6">
      <div className="rounded-2xl bg-green-800 px-4 py-6 text-center text-white shadow-sm">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white text-green-800">
          <Check size={32} strokeWidth={3} />
        </div>

        <h1 className="mt-4 text-2xl font-extrabold">Thank you!</h1>
        <p className="mt-2 text-xs font-semibold leading-5 text-green-100">
          Your report has been submitted. <br />
          We'll notify you once there are updates.
        </p>

        <div className="mt-5 rounded-2xl bg-green-50 p-4 text-left text-gray-900 shadow-sm">
          {title && <InfoBlock label="Title" value={title} />}
          <InfoBlock
            label="Report ID"
            value={reportId || "#VAL-2024-00001"}
            large
          />
          <InfoBlock
            label="Department"
            value={department || "Engineering Office"}
          />
          <InfoBlock
            label="Submitted"
            value={`${formattedDate} · ${formattedTime}`}
          />
          <InfoBlock label="Status" value="Under Review" />
        </div>

        <button
          onClick={() => navigate("/reports")}
          className="mt-5 w-full rounded-xl bg-white py-3 text-xs font-extrabold text-green-800 hover:bg-green-50 transition"
        >
          View My Reports
        </button>

        <button
          onClick={() => navigate("/home")}
          className="mt-2 w-full rounded-xl bg-green-700 py-3 text-xs font-extrabold text-white hover:bg-green-900 transition"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}

function InfoBlock({ label, value, large = false }) {
  return (
    <div className="mb-3 last:mb-0">
      <p className="text-[10px] font-bold uppercase tracking-wide text-gray-600">
        {label}
      </p>
      <p
        className={`mt-1 font-extrabold text-gray-900 ${
          large ? "text-sm" : "text-xs"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function DesktopSubmitted({ reportId, department, title }) {
  const navigate = useNavigate();
  const now = new Date();
  const formattedDate = now.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  const formattedTime = now.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  return (
    <div className="flex min-h-150 items-center justify-center">
      <div className="w-full max-w-sm rounded-2xl bg-green-800 p-6 text-center text-white shadow-md">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white text-green-800">
          <Check size={32} strokeWidth={3} />
        </div>

        <h1 className="mt-4 text-2xl font-extrabold">Thank you!</h1>
        <p className="mt-2 text-xs font-semibold leading-5 text-green-100">
          Your report has been submitted. We'll notify you once there are
          updates.
        </p>

        <div className="mt-5 rounded-2xl bg-green-50 p-4 text-left text-gray-900 shadow-sm">
          {title && <InfoBlock label="Title" value={title} />}
          <InfoBlock
            label="Report ID"
            value={reportId || "#VAL-2024-00001"}
            large
          />
          <InfoBlock
            label="Department"
            value={department || "Engineering Office"}
          />
          <InfoBlock
            label="Submitted"
            value={`${formattedDate} · ${formattedTime}`}
          />
          <InfoBlock label="Status" value="Under Review" />
        </div>

        <button
          onClick={() => navigate("/home")}
          className="mt-5 w-full rounded-xl bg-white py-3 text-xs font-extrabold text-green-800 hover:bg-green-50"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}

function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="rounded-3xl bg-white p-8 text-center">
        <Loader
          size={48}
          className="mx-auto mb-4 animate-spin text-green-700"
        />
        <h2 className="text-xl font-extrabold text-gray-900">Hold on...</h2>
        <p className="mt-2 text-sm text-gray-500">
          Checking for similar reports in your area
        </p>
      </div>
    </div>
  );
}
