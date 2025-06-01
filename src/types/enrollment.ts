// Address validation types
export interface AddressValidationRequest {
  address: string;
  city: string;
  state: string;
  zip_code: string;
}

export interface AddressValidationResponse {
  valid: boolean;
  formatted_address?: string;
  coordinates?: {
    x: number;
    y: number;
  };
  message?: string;
}

// Utility types
export interface UtilityInfo {
  found: boolean;
  utility?: string;
  city?: string;
  zip_code?: string;
  message?: string;
}

// Subscriber types
export type UtilityType = "PSEG" | "JCPL" | "ACE";
export type AssistanceProgramType = "Medicare" | "SNAP" | "";

export interface SubscriberData {
  first_name: string;
  last_name: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  utility: UtilityType;
  utility_account_number?: string;
  assistance_program?: AssistanceProgramType;
}

export interface Subscriber extends SubscriberData {
  id: number;
  address_validated: boolean;
  formatted_address?: string;
  created_at: string;
}

export interface SubscriberCreateResponse {
  success: boolean;
  subscriber_id?: number;
  message?: string;
  data?: Subscriber;
  errors?: Record<string, string[]>;
}

export interface SubscriberListResponse {
  count: number;
  next?: string;
  previous?: string;
  results: Subscriber[];
}

// API Error type
export interface ApiError {
  detail?: string;
  message?: string;
  errors?: Record<string, string[]>;
}
