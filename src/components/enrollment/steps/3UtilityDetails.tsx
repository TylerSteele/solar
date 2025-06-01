"use client";

import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { Select } from "@/components/Select";
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
        <Input
          label="Electric Utility"
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
        />

        <Input
          label="Utility Account Number"
          value={data.utility_account_number}
          onChange={(e) =>
            updateData({ utility_account_number: e.target.value })
          }
          placeholder={
            data.utility === "PSEG"
              ? "10 digits"
              : data.utility === "JCPL"
              ? "12 digits"
              : "Enter your account number"
          }
          helperText={
            data.utility === "PSEG"
              ? "PSE&G account numbers are 10 digits"
              : data.utility === "JCPL"
              ? "JCPL account numbers are 12 digits"
              : data.utility === "ACE"
              ? "Enter your account number as shown on your bill"
              : undefined
          }
          error={accountNumberError || undefined}
        />

        <Select
          label="Assistance Program"
          value={data.assistance_program}
          onChange={(e) =>
            updateData({
              assistance_program: e.target.value as AssistanceProgramType,
            })
          }
          helperText="Select if you participate in Medicare or SNAP assistance programs"
        >
          <option value="">None</option>
          <option value="Medicare">Medicare</option>
          <option value="SNAP">SNAP</option>
        </Select>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded p-3">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}
      </div>

      <div className="mt-8 flex justify-between">
        <Button onClick={onPrev} variant="secondary">
          Previous
        </Button>

        <Button
          onClick={onSubmit}
          disabled={loading || !!accountNumberError}
          variant="success"
          loading={loading}
        >
          Complete Enrollment
        </Button>
      </div>
    </div>
  );
}
