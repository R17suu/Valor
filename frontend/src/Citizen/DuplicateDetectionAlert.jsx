// src/Citizen/DuplicateDetectionAlert.jsx
import { Users, MapPin, Send, ArrowLeft, Loader, Sparkles } from "lucide-react";
import valorLogo from "../assets/App-Icon.png";

/**
 * Duplicate Detection Alert Component
 * Shows when a similar report is detected within 100 meters
 * Matches VALOR's existing design system (green, rounded-2xl, ext-bold fonts)
 * Optimized for mobile first
 */
export default function DuplicateDetectionAlert({
  duplicateData,
  onProceedWithDuplicate,
  onSubmitAsNew,
  onGoBack,
  isLoading,
}) {
  if (!duplicateData || !duplicateData.duplicate_found) {
    return null;
  }

  const {
    distance_meters = 0,
    existing_incident_count = 1,
    incident_id = "",
  } = duplicateData;

  const isVeryClose = distance_meters < 50;

  return (
    <div className="fixed inset-0 bg-white flex flex-col items-center justify-center p-4 z-50 overflow-y-auto">
      {/* VALOR Logo and Acronym */}
      <div className="mb-4 text-center">
        <img
          src={valorLogo}
          alt="VALOR Logo"
          className="h-16 w-16 mx-auto mb-2"
        />
        <h1 className="text-lg font-black text-gray-900">VALOR</h1>
        <p className="text-xs text-gray-500 tracking-wide">
          Valencia Automated Local Operations & Response
        </p>
      </div>

      <div className="bg-white rounded-3xl shadow-lg w-full overflow-hidden my-4">
        {/* Header with green accent - matches VALOR style */}
        <div className="border-l-4 border-green-700 bg-green-50 px-4 py-3.5">
          <div className="flex items-start gap-3">
            <div className="shrink-0 text-green-700 mt-0.5">
              <Sparkles size={18} />
            </div>
            <div className="min-w-0">
              <h2 className="text-sm font-bold text-gray-900">
                {isVeryClose
                  ? "🎯 Same Issue Found!"
                  : "Similar Issue Detected"}
              </h2>
              <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                {isVeryClose
                  ? "Someone already reported this nearby"
                  : "Similar issue in this area"}
              </p>
            </div>
          </div>
        </div>

        {/* Content - rounded boxes matching form style */}
        <div className="px-4 py-3 space-y-2.5 max-h-96 overflow-y-auto">
          {/* Distance Info Box */}
          <div className="rounded-xl border border-gray-200 bg-white p-3 hover:border-green-200 transition">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-50 text-blue-700 shrink-0 mt-0.5">
                <MapPin size={16} />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-gray-900">
                  {distance_meters}m away
                </p>
                <p className="text-xs text-gray-600 mt-0.5">
                  {distance_meters < 50 && "📍 Same block"}
                  {distance_meters >= 50 &&
                    distance_meters < 100 &&
                    "📍 Same area"}
                  {distance_meters >= 100 && "📍 Nearby"}
                </p>
              </div>
            </div>
          </div>

          {/* People Reports Info Box */}
          <div className="rounded-xl border border-gray-200 bg-white p-3 hover:border-green-200 transition">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-green-50 text-green-700 shrink-0 mt-0.5">
                <Users size={16} />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-gray-900">
                  {existing_incident_count}{" "}
                  {existing_incident_count === 1 ? "person" : "people"}
                </p>
                <p className="text-xs text-gray-600 mt-0.5">
                  ✓ Already reported
                </p>
              </div>
            </div>
          </div>

          {/* Why It Matters - simple info box */}
          <div className="rounded-xl bg-blue-50 border border-blue-100 p-3">
            <p className="text-xs font-semibold text-blue-900 uppercase tracking-wide mb-1.5">
              Why join?
            </p>
            <ul className="space-y-1 text-xs text-blue-800">
              <li>✓ Show the city how many care</li>
              <li>✓ Gets faster attention</li>
            </ul>
          </div>
        </div>

        {/* Action Buttons - matching AIReviewStep button style */}
        <div className="border-t border-gray-200 px-4 py-3 space-y-2">
          {/* Primary: Add to Existing - green like main buttons */}
          <button
            onClick={() => onProceedWithDuplicate(incident_id)}
            disabled={isLoading}
            className={`w-full flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold text-white transition ${
              !isLoading
                ? "bg-green-700 hover:bg-green-800"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            {isLoading ? (
              <>
                <Loader size={16} className="animate-spin" />
                <span>Linking...</span>
              </>
            ) : (
              <>
                <Send size={16} />
                <span>Join This Report</span>
              </>
            )}
          </button>

          {/* Secondary: Submit Anyway - white like sample button */}
          <button
            onClick={onSubmitAsNew}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-white py-3 text-sm font-bold text-green-700 border border-green-200 hover:bg-green-50 transition disabled:opacity-50"
          >
            <Sparkles size={16} />
            <span>Submit as New</span>
          </button>

          {/* Tertiary: Go Back - gray secondary style */}
          <button
            onClick={onGoBack}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-gray-100 py-3 text-sm font-bold text-gray-700 hover:bg-gray-200 transition disabled:opacity-50"
          >
            <ArrowLeft size={16} />
            <span>Edit Details</span>
          </button>
        </div>
      </div>
    </div>
  );
}
