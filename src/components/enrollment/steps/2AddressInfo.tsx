"use client";

import { useState, useEffect } from "react";
import {
  useAddressValidation,
  useUtilityLookup,
} from "@/lib/hooks/use-enrollment-api";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { Select } from "@/components/Select";

interface AddressInfoStepProps {
  data: {
    address: string;
    city: string;
    state: string;
    zip_code: string;
    utility: string;
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  updateData: (newData: any) => void;
  onNext: () => void;
  onPrev: () => void;
}

export function AddressInfo({
  data,
  updateData,
  onNext,
  onPrev,
}: AddressInfoStepProps) {
  const [addressValidated, setAddressValidated] = useState(false);
  const [utilityFound, setUtilityFound] = useState(false);
  const [lookedUpUtility, setLookedUpUtility] = useState<string>("");

  const { validate, loading: validating } = useAddressValidation();
  const { lookupUtility, loading: lookingUp } = useUtilityLookup();

  const isValid =
    data.address.trim() &&
    data.city.trim() &&
    data.zip_code.trim() &&
    data.utility.trim();

  // Auto-lookup utility when ZIP code changes
  useEffect(() => {
    const lookupUtilityForZip = async () => {
      if (data.zip_code.length === 5) {
        const result = await lookupUtility(data.zip_code);
        if (result && result.found && result.utility) {
          setUtilityFound(true);
          setLookedUpUtility(result.utility);
        } else {
          setUtilityFound(false);
          setLookedUpUtility("");
        }
      } else {
        setUtilityFound(false);
        setLookedUpUtility("");
      }
    };

    lookupUtilityForZip();
  }, [data.zip_code, lookupUtility]);

  // Update parent data when utility lookup result changes
  useEffect(() => {
    updateData({ utility: lookedUpUtility });
  }, [lookedUpUtility, updateData]);

  const handleAddressValidation = async () => {
    if (data.address && data.city && data.state && data.zip_code) {
      const result = await validate({
        address: data.address,
        city: data.city,
        state: data.state,
        zip_code: data.zip_code,
      });

      if (result && result.valid) {
        setAddressValidated(true);
      } else {
        setAddressValidated(false);
        alert("Address could not be validated. Please check your address.");
      }
    }
  };

  const handleNext = () => {
    if (isValid) {
      onNext();
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-6">Step 2: Address Information</h2>

      <div className="space-y-4">
        <Input
          label="Street Address"
          required
          value={data.address}
          onChange={(e) => updateData({ address: e.target.value })}
          placeholder="123 Main Street"
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="City"
            required
            value={data.city}
            onChange={(e) => updateData({ city: e.target.value })}
            placeholder="Newark"
          />

          <Select
            label="State"
            required
            value={data.state}
            onChange={(e) => updateData({ state: e.target.value })}
          >
            <option value="NJ">New Jersey</option>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">ZIP Code *</label>
          <div className="flex gap-2">
            <Input
              value={data.zip_code}
              onChange={(e) => updateData({ zip_code: e.target.value })}
              placeholder="07102"
              maxLength={5}
              className="flex-1"
            />
            {lookingUp && (
              <span className="text-sm text-gray-500 py-2">
                Looking up utility...
              </span>
            )}
          </div>
        </div>

        <Input
          label="Electric Utility"
          required
          value={
            data.utility === "PSEG"
              ? "PSE&G"
              : data.utility === "JCPL"
              ? "Jersey Central Power & Light"
              : data.utility === "ACE"
              ? "Atlantic City Electric"
              : data.utility === "ROCKLAND"
              ? "Rockland Electric Co."
              : data.utility || "Enter ZIP code to auto-detect utility"
          }
          readOnly
          helperText={
            utilityFound
              ? "✓ Utility found for your ZIP code"
              : data.zip_code.length === 5 && !lookingUp
              ? "No utility information available for this ZIP code"
              : undefined
          }
          error={
            data.zip_code.length === 5 && !utilityFound && !lookingUp
              ? "No utility information available for this ZIP code"
              : undefined
          }
        />

        <div className="pt-4">
          <Button
            onClick={handleAddressValidation}
            disabled={
              validating || !data.address || !data.city || !data.zip_code
            }
            variant="success"
          >
            {validating ? "Validating..." : "Validate Address"}
          </Button>
          {addressValidated && (
            <span className="ml-2 text-green-600">✓ Address validated</span>
          )}
        </div>
      </div>

      <div className="mt-8 flex justify-between">
        <Button onClick={onPrev} variant="secondary">
          Previous
        </Button>

        <Button onClick={handleNext} disabled={!isValid} variant="primary">
          Next
        </Button>
      </div>
    </div>
  );
}
