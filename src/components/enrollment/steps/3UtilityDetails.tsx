"use client";

import { AssistanceProgramType } from "@/types/enrollment";

interface UtilityDetailsStepProps {
  data: {
    utility: string;
    utility_account_number: string;
    assistance_program: AssistanceProgramType;
  };
  updateData: (newData: any) => void;
  onPrev: () => void;
  onSubmit: () => void;
  loading: boolean;
  error: string | null;
}

export function UtilityDetails({
  data,
  updateData,
  onPrev,
  onSubmit,
  loading,
  error,
}: UtilityDetailsStepProps) {
  const getAccountNumberValidation = () => {
    if (!data.utility_account_number.trim()) return null;

    const cleanNumber = data.utility_account_number.replace(/\D/g, "");

    if (data.utility === "PSEG" && cleanNumber.length !== 10) {
      return "PSE&G account numbers must be 10 digits";
    }
    if (data.utility === "JCPL" && cleanNumber.length !== 12) {
      return "JCPL account numbers must be 12 digits";
    }
    return null;
  };

  const accountNumberError = getAccountNumberValidation();

  return (
    <div>
      <h2 className="text-xl font-bold mb-6">
        Step 3: Utility Account Details
      </h2>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-1">
            Electric Utility
          </label>
          <input
            type="text"
            value={
              data.utility === "PSEG"
                ? "PSE&G"
                : data.utility === "JCPL"
                ? "Jersey Central Power & Light"
                : data.utility === "ACE"
                ? "Atlantic City Electric"
                : data.utility
            }
            readOnly
            className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-50"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Utility Account Number
          </label>
          <input
            type="text"
            value={data.utility_account_number}
            onChange={(e) =>
              updateData({ utility_account_number: e.target.value })
            }
            className="w-full border border-gray-300 rounded px-3 py-2"
            placeholder={
              data.utility === "PSEG"
                ? "10 digits"
                : data.utility === "JCPL"
                ? "12 digits"
                : "Enter your account number"
            }
          />
          <div className="mt-1 text-sm text-gray-600">
            {data.utility === "PSEG" && "PSE&G account numbers are 10 digits"}
            {data.utility === "JCPL" && "JCPL account numbers are 12 digits"}
            {data.utility === "ACE" &&
              "Enter your account number as shown on your bill"}
          </div>
          {accountNumberError && (
            <p className="text-sm text-red-600 mt-1">{accountNumberError}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Assistance Program
          </label>
          <select
            value={data.assistance_program}
            onChange={(e) =>
              updateData({
                assistance_program: e.target.value as AssistanceProgramType,
              })
            }
            className="w-full border border-gray-300 rounded px-3 py-2"
          >
            <option value="">None</option>
            <option value="Medicare">Medicare</option>
            <option value="SNAP">SNAP</option>
          </select>
          <p className="text-sm text-gray-600 mt-1">
            Select if you participate in Medicare or SNAP assistance programs
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded p-3">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}
      </div>

      <div className="mt-8 flex justify-between">
        <button
          onClick={onPrev}
          className="bg-gray-500 text-white px-6 py-2 rounded"
        >
          Previous
        </button>

        <button
          onClick={onSubmit}
          disabled={loading || !!accountNumberError}
          className="bg-green-500 text-white px-6 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Submitting..." : "Complete Enrollment"}
        </button>
      </div>
    </div>
  );
}
