import type { Database } from "@/types/supabase";

type BookingSettingsRow =
  | Database["public"]["Tables"]["booking_settings"]["Row"]
  | null;

export type BookingSettingsState = {
  onlineBookingEnabled: boolean;
  requireAccount: boolean;
  requireServiceSelection: boolean;
  showPricing: boolean;
  allowTimePreferences: boolean;
  requireImmediatePayment: boolean;
  sendConfirmationEmail: boolean;
  sendConfirmationSms: boolean;
  minBookingNoticeHours: number;
  maxBookingsPerDay: number | null;
};

export const BOOKING_NOTICE_MIN = 1;
export const BOOKING_NOTICE_MAX = 168;
export const BOOKING_PER_DAY_MIN = 1;

export const DEFAULT_BOOKING_SETTINGS: BookingSettingsState = {
  onlineBookingEnabled: false,
  requireAccount: false,
  requireServiceSelection: true,
  showPricing: true,
  allowTimePreferences: true,
  requireImmediatePayment: false,
  sendConfirmationEmail: true,
  sendConfirmationSms: false,
  minBookingNoticeHours: 24,
  maxBookingsPerDay: null,
};

export function mapBookingSettings(
  row: BookingSettingsRow
): Partial<BookingSettingsState> {
  if (!row) {
    return {};
  }

  return {
    onlineBookingEnabled: row.online_booking_enabled ?? false,
    requireAccount: row.require_account ?? false,
    requireServiceSelection: row.require_service_selection ?? true,
    showPricing: row.show_pricing ?? true,
    allowTimePreferences: row.allow_time_preferences ?? true,
    requireImmediatePayment: row.require_immediate_payment ?? false,
    sendConfirmationEmail: row.send_confirmation_email ?? true,
    sendConfirmationSms: row.send_confirmation_sms ?? false,
    minBookingNoticeHours: row.min_booking_notice_hours ?? 24,
    maxBookingsPerDay: row.max_bookings_per_day ?? null,
  };
}
