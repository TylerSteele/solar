import {
  AddressValidationRequest,
  AddressValidationResponse,
  UtilityInfo,
  SubscriberData,
  SubscriberCreateResponse,
  SubscriberListResponse,
  Subscriber,
  ApiError,
} from "@/types/enrollment";
import { API_CONFIG, buildUrl, defaultHeaders } from "./api-config";

// Generic fetch wrapper with error handling
async function apiRequest<T>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  const config: RequestInit = {
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);

    if (!response.ok) {
      const errorData: ApiError = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || errorData.detail || `HTTP ${response.status}`
      );
    }

    return await response.json();
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("An unexpected error occurred");
  }
}

// Address validation
export async function validateAddress(
  addressData: AddressValidationRequest
): Promise<AddressValidationResponse> {
  const url = buildUrl(API_CONFIG.ENDPOINTS.VALIDATE_ADDRESS);

  return apiRequest<AddressValidationResponse>(url, {
    method: "POST",
    body: JSON.stringify(addressData),
  });
}

// Utility lookup by ZIP code
export async function getUtilityByZip(zipCode: string): Promise<UtilityInfo> {
  const url = buildUrl(API_CONFIG.ENDPOINTS.UTILITIES, `${zipCode}/`);
  return apiRequest<UtilityInfo>(url);
}

// Subscriber management
export async function createSubscriber(
  subscriberData: SubscriberData
): Promise<SubscriberCreateResponse> {
  const url = buildUrl(API_CONFIG.ENDPOINTS.SUBSCRIBERS);

  return apiRequest<SubscriberCreateResponse>(url, {
    method: "POST",
    body: JSON.stringify(subscriberData),
  });
}

export async function getSubscribers(): Promise<SubscriberListResponse> {
  const url = buildUrl(API_CONFIG.ENDPOINTS.SUBSCRIBERS);
  return apiRequest<SubscriberListResponse>(url);
}

export async function getSubscriber(id: number): Promise<Subscriber> {
  const url = buildUrl(API_CONFIG.ENDPOINTS.SUBSCRIBERS, `${id}/`);
  return apiRequest<Subscriber>(url);
}

export async function updateSubscriber(
  id: number,
  subscriberData: Partial<SubscriberData>
): Promise<Subscriber> {
  const url = buildUrl(API_CONFIG.ENDPOINTS.SUBSCRIBERS, `${id}/`);

  return apiRequest<Subscriber>(url, {
    method: "PATCH",
    body: JSON.stringify(subscriberData),
  });
}

export async function deleteSubscriber(id: number): Promise<void> {
  const url = buildUrl(API_CONFIG.ENDPOINTS.SUBSCRIBERS, `${id}/`);

  return apiRequest<void>(url, {
    method: "DELETE",
  });
}
