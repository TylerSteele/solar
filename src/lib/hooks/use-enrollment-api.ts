import { useState, useCallback } from "react";
import {
  AddressValidationRequest,
  AddressValidationResponse,
  UtilityInfo,
  SubscriberData,
  SubscriberCreateResponse,
} from "@/types/enrollment";
import {
  validateAddress,
  getUtilityByZip,
  createSubscriber,
} from "@/lib/api-client";

// Generic hook for API calls with loading state
function useApiCall<TRequest, TResponse>() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(
    async (
      apiFunction: (data: TRequest) => Promise<TResponse>,
      data: TRequest
    ): Promise<TResponse | null> => {
      setLoading(true);
      setError(null);

      try {
        const result = await apiFunction(data);
        return result;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "An error occurred";
        setError(errorMessage);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { execute, loading, error };
}

// Hook for address validation
export function useAddressValidation() {
  const { execute, loading, error } = useApiCall<
    AddressValidationRequest,
    AddressValidationResponse
  >();

  const validate = useCallback(
    (addressData: AddressValidationRequest) =>
      execute(validateAddress, addressData),
    [execute]
  );

  return { validate, loading, error };
}

// Hook for utility lookup
export function useUtilityLookup() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const lookupUtility = useCallback(
    async (zipCode: string): Promise<UtilityInfo | null> => {
      setLoading(true);
      setError(null);

      try {
        const result = await getUtilityByZip(zipCode);
        return result;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "An error occurred";
        setError(errorMessage);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { lookupUtility, loading, error };
}

// Hook for subscriber enrollment
export function useSubscriberEnrollment() {
  const { execute, loading, error } = useApiCall<
    SubscriberData,
    SubscriberCreateResponse
  >();

  const enroll = useCallback(
    (subscriberData: SubscriberData) =>
      execute(createSubscriber, subscriberData),
    [execute]
  );

  return { enroll, loading, error };
}
