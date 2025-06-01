"use client";

import { useState, useCallback } from "react";
import {
  SubscriberData,
  UtilityType,
  AssistanceProgramType,
} from "@/types/enrollment";
import { useSubscriberEnrollment } from "@/lib/hooks/use-enrollment-api";
import ProgressIndicator from "./ProgressIndicator";
import { PersonalInfo } from "./steps/1PersonalInfo";
import { AddressInfo } from "./steps/2AddressInfo";
import { UtilityDetails } from "./steps/3UtilityDetails";
import { Button } from "../Button";

interface FormData {
  // Personal Info
  first_name: string;
  last_name: string;

  // Address Info
  address: string;
  city: string;
  state: string;
  zip_code: string;
  utility: UtilityType | "";

  // Utility Details
  utility_account_number: string;
  assistance_program: AssistanceProgramType;
}

const initialFormData: FormData = {
  first_name: "",
  last_name: "",
  address: "",
  city: "",
  state: "NJ",
  zip_code: "",
  utility: "",
  utility_account_number: "",
  assistance_program: "",
};

export function EnrollmentWizard() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const { enroll, loading, error } = useSubscriberEnrollment();

  const updateFormData = useCallback((newData: Partial<FormData>) => {
    setFormData((prev) => ({ ...prev, ...newData }));
  }, []);

  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    if (!formData.utility) {
      alert("Please complete all required fields");
      return;
    }

    const subscriberData: SubscriberData = {
      first_name: formData.first_name,
      last_name: formData.last_name,
      address: formData.address,
      city: formData.city,
      state: formData.state,
      zip_code: formData.zip_code,
      utility: formData.utility as UtilityType,
      utility_account_number: formData.utility_account_number || undefined,
      assistance_program: formData.assistance_program || undefined,
    };

    const result = await enroll(subscriberData);
    if (result && result.success) {
      setIsSubmitted(true);
    }
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setCurrentStep(1);
    setIsSubmitted(false);
  };

  if (isSubmitted) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-green-600 mb-4">
            Enrollment Successful!
          </h2>
          <p className="mb-6">
            Thank you for enrolling in the Solar Landscape program. We'll be in
            touch with next steps.
          </p>
          <Button onClick={resetForm} variant="primary">
            Submit Another Enrollment
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      {/* Progress indicator */}
      <ProgressIndicator
        currentStep={currentStep}
        steps={["Personal Info", "Address", "Utility Details"]}
      />

      {/* Step content */}
      <div className="mb-8">
        {currentStep === 1 && (
          <PersonalInfo
            data={formData}
            updateData={updateFormData}
            onNext={nextStep}
          />
        )}

        {currentStep === 2 && (
          <AddressInfo
            data={formData}
            updateData={updateFormData}
            onNext={nextStep}
            onPrev={prevStep}
          />
        )}

        {currentStep === 3 && (
          <UtilityDetails
            data={formData}
            updateData={updateFormData}
            onPrev={prevStep}
            onSubmit={handleSubmit}
            loading={loading}
            error={error}
          />
        )}
      </div>
    </div>
  );
}
