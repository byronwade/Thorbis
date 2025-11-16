/**
 * Telnyx Phone Numbers Service - Number Management
 *
 * Handles all phone number operations including:
 * - Searching available numbers
 * - Purchasing numbers
 * - Porting numbers
 * - Configuring number settings
 * - Releasing numbers
 */

import { telnyxClient } from "./client";

/**
 * Number type for search
 */
export type NumberType =
  | "local"
  | "toll-free"
  | "national"
  | "mobile"
  | "shared_cost";

/**
 * Number features
 */
export type NumberFeature = "sms" | "mms" | "voice" | "fax";

/**
 * Search for available phone numbers
 */
export async function searchAvailableNumbers(params: {
  countryCode?: string;
  areaCode?: string;
  numberType?: NumberType;
  features?: NumberFeature[];
  limit?: number;
  startsWith?: string;
  endsWith?: string;
  contains?: string;
}) {
  try {
    const numbers = await (telnyxClient.availablePhoneNumbers as any).list({
      filter: {
        country_code: params.countryCode || "US",
        national_destination_code: params.areaCode,
        features: params.features,
        limit: params.limit || 10,
        starts_with: params.startsWith,
        ends_with: params.endsWith,
        contains: params.contains,
      } as any,
    });

    return {
      success: true,
      data: numbers.data,
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to search numbers",
    };
  }
}

/**
 * Purchase a phone number
 */
export async function purchaseNumber(params: {
  phoneNumber: string;
  messagingProfileId?: string;
  connectionId?: string;
  billingGroupId?: string;
  customerReference?: string;
}) {
  try {
    const number = await telnyxClient.numberOrders.create({
      phone_numbers: [
        {
          phone_number: params.phoneNumber,
        },
      ],
      messaging_profile_id: params.messagingProfileId,
      connection_id: params.connectionId,
      billing_group_id: params.billingGroupId,
      customer_reference: params.customerReference,
    });

    return {
      success: true,
      orderId: number.data?.id,
      data: number.data,
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to purchase number",
    };
  }
}

/**
 * List all owned phone numbers
 */
export async function listOwnedNumbers(params?: {
  pageSize?: number;
  pageNumber?: number;
  filterTag?: string;
  filterStatus?: "active" | "pending" | "suspended" | "deleted";
}) {
  try {
    const numbers = await (telnyxClient.phoneNumbers as any).list({
      page: {
        size: params?.pageSize || 20,
        number: params?.pageNumber || 1,
      },
      filter: {
        tag: params?.filterTag,
        status: params?.filterStatus,
      } as any,
    });

    return {
      success: true,
      data: numbers.data,
      meta: numbers.meta,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to list numbers",
    };
  }
}

/**
 * Get phone number details
 */
export async function getNumberDetails(phoneNumberId: string) {
  try {
    const number = await (telnyxClient.phoneNumbers as any).retrieve(
      phoneNumberId
    );

    return {
      success: true,
      data: number.data,
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to retrieve number",
    };
  }
}

/**
 * Update phone number configuration
 */
export async function updateNumber(params: {
  phoneNumberId: string;
  connectionId?: string;
  messagingProfileId?: string;
  billingGroupId?: string;
  tags?: string[];
  customerReference?: string;
}) {
  try {
    const number = await (telnyxClient.phoneNumbers as any).update(
      params.phoneNumberId,
      {
        connection_id: params.connectionId,
        messaging_profile_id: params.messagingProfileId,
        billing_group_id: params.billingGroupId,
        tags: params.tags,
        customer_reference: params.customerReference,
      } as any
    );

    return {
      success: true,
      data: number.data,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update number",
    };
  }
}

/**
 * Release (delete) a phone number
 */
export async function releaseNumber(phoneNumberId: string) {
  try {
    await (telnyxClient.phoneNumbers as any).del(phoneNumberId);

    return {
      success: true,
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to release number",
    };
  }
}

/**
 * Initiate number porting request
 */
export async function initiatePorting(params: {
  phoneNumbers: string[];
  billingGroupId?: string;
  fastPortEligible?: boolean;
  // Account information
  accountNumber?: string;
  accountPin?: string;
  authorizedPerson?: string;
  // Service address
  addressLine1?: string;
  city?: string;
  stateOrProvince?: string;
  zipOrPostalCode?: string;
  countryCode?: string;
}) {
  try {
    const portingOrder = await (telnyxClient as any).numberPortouts.create({
      phone_numbers: params.phoneNumbers,
      billing_group_id: params.billingGroupId,
      fast_port_eligible: params.fastPortEligible,
      customer_reference: {
        account_number: params.accountNumber,
        account_pin: params.accountPin,
        authorized_person: params.authorizedPerson,
      },
      service_address: {
        address_line_1: params.addressLine1,
        city: params.city,
        state_or_province: params.stateOrProvince,
        zip_or_postal_code: params.zipOrPostalCode,
        country_code: params.countryCode || "US",
      },
    });

    return {
      success: true,
      portingOrderId: portingOrder.data.id,
      data: portingOrder.data,
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to initiate porting",
    };
  }
}

/**
 * Get porting order status
 */
export async function getPortingStatus(portingOrderId: string) {
  try {
    const order = await (telnyxClient as any).numberPortouts.retrieve(
      portingOrderId
    );

    return {
      success: true,
      status: order.data.status,
      data: order.data,
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to get porting status",
    };
  }
}

/**
 * Estimate number costs
 */
export async function estimateNumberCost(params: {
  countryCode: string;
  numberType: NumberType;
}) {
  // Cost estimates based on Telnyx pricing (as of 2025)
  const costs = {
    US: {
      local: { monthly: 1.0, setup: 0.0 },
      "toll-free": { monthly: 2.0, setup: 0.0 },
      mobile: { monthly: 5.0, setup: 0.0 },
    },
    CA: {
      local: { monthly: 1.5, setup: 0.0 },
      "toll-free": { monthly: 2.5, setup: 0.0 },
    },
    GB: {
      local: { monthly: 2.0, setup: 0.0 },
      "toll-free": { monthly: 3.0, setup: 0.0 },
    },
  };

  const countryCode = params.countryCode.toUpperCase();
  const pricing = costs[countryCode as keyof typeof costs];

  if (!pricing) {
    return {
      success: false,
      error: `Pricing not available for country: ${countryCode}`,
    };
  }

  const typePricing = pricing[params.numberType as keyof typeof pricing];

  if (!typePricing) {
    return {
      success: false,
      error: `Number type ${params.numberType} not available in ${countryCode}`,
    };
  }

  return {
    success: true,
    costs: {
      monthly: typePricing.monthly,
      setup: typePricing.setup,
      currency: "USD",
    },
  };
}

/**
 * Validate if a number can be ported
 */
export async function validatePortability(phoneNumber: string) {
  try {
    // This would typically call Telnyx's LNP (Local Number Portability) check API
    // For now, we'll do basic validation

    const cleanNumber = phoneNumber.replace(/\D/g, "");

    // Must be at least 10 digits
    if (cleanNumber.length < 10) {
      return {
        success: false,
        portable: false,
        reason: "Phone number must be at least 10 digits",
      };
    }

    // In a real implementation, you would check with Telnyx's LNP API
    return {
      success: true,
      portable: true,
      estimatedPortingDays: 7, // Typical porting timeline
      fastPortEligible: false,
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to validate portability",
    };
  }
}
