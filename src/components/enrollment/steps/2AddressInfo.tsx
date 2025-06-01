"use client";

import { useState, useEffect } from "react";
import {
  useAddressValidation,
  useUtilityLookup,
} from "@/lib/hooks/use-enrollment-api";

interface AddressInfoStepProps {
  data: {
    address: string;
    city: string;
    state: string;
    zip_code: string;
    utility: string;
  };
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
        <div>
          <label className="block text-sm font-medium mb-1">
            Street Address *
          </label>
          <input
            type="text"
            value={data.address}
            onChange={(e) => updateData({ address: e.target.value })}
            className="w-full border border-gray-300 rounded px-3 py-2"
            placeholder="123 Main Street"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">City *</label>
            <input
              type="text"
              value={data.city}
              onChange={(e) => updateData({ city: e.target.value })}
              className="w-full border border-gray-300 rounded px-3 py-2"
              placeholder="Newark"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">State *</label>
            <select
              value={data.state}
              onChange={(e) => updateData({ state: e.target.value })}
              className="w-full border border-gray-300 rounded px-3 py-2"
            >
              <option value="NJ">New Jersey</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">ZIP Code *</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={data.zip_code}
              onChange={(e) => updateData({ zip_code: e.target.value })}
              className="flex-1 border border-gray-300 rounded px-3 py-2"
              placeholder="07102"
              maxLength={5}
            />
            {lookingUp && (
              <span className="text-sm text-gray-500 py-2">
                Looking up utility...
              </span>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Electric Utility *
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
                : data.utility === "ROCKLAND"
                ? "Rockland Electric Co."
                : data.utility || "Enter ZIP code to auto-detect utility"
            }
            readOnly
            className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-50"
            placeholder="Enter ZIP code to auto-detect utility"
          />
          {utilityFound && (
            <p className="text-sm text-green-600 mt-1">
              ✓ Utility found for your ZIP code
            </p>
          )}
          {data.zip_code.length === 5 && !utilityFound && !lookingUp && (
            <p className="text-sm text-red-600 mt-1">
              No utility information available for this ZIP code
            </p>
          )}
        </div>

        <div className="pt-4">
          <button
            onClick={handleAddressValidation}
            disabled={
              validating || !data.address || !data.city || !data.zip_code
            }
            className="bg-green-500 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            {validating ? "Validating..." : "Validate Address"}
          </button>
          {addressValidated && (
            <span className="ml-2 text-green-600">✓ Address validated</span>
          )}
        </div>
      </div>

      <div className="mt-8 flex justify-between">
        <button
          onClick={onPrev}
          className="bg-gray-500 text-white px-6 py-2 rounded"
        >
          Previous
        </button>

        <button
          onClick={handleNext}
          disabled={!isValid}
          className="bg-blue-500 text-white px-6 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </div>
  );
}
