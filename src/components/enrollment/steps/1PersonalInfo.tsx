"use client";

import { Button } from "@/components/Button";
import { Input } from "@/components/Input";

interface PersonalInfoProps {
  data: {
    first_name: string;
    last_name: string;
    email: string;
    phone?: string;
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  updateData: (newData: any) => void;
  onNext: () => void;
}

export function PersonalInfo({ data, updateData, onNext }: PersonalInfoProps) {
  const isValid = data.first_name.trim() && data.last_name.trim();

  const handleNext = () => {
    if (isValid) {
      onNext();
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-6">Step 1: Personal Information</h2>

      <div className="space-y-4">
        <Input
          label="First Name"
          required
          value={data.first_name}
          onChange={(e) => updateData({ first_name: e.target.value })}
          placeholder="Enter your first name"
        />

        <Input
          label="Last Name"
          required
          value={data.last_name}
          onChange={(e) => updateData({ last_name: e.target.value })}
          placeholder="Enter your last name"
        />

        <Input
          label="Email"
          type="email"
          required
          value={data.email || ""}
          onChange={(e) => updateData({ email: e.target.value })}
          placeholder="Enter your email address"
        />

        <Input
          label="Phone Number (optional)"
          type="tel"
          value={data.phone || ""}
          onChange={(e) => updateData({ phone: e.target.value })}
          placeholder="Enter your phone number (optional)"
        />
      </div>

      <div className="mt-8 flex justify-end">
        <Button onClick={handleNext} disabled={!isValid} variant="primary">
          Next
        </Button>
      </div>
    </div>
  );
}
