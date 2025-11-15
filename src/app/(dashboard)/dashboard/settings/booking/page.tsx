import { getBookingSettings } from "@/actions/settings";
import BookingSettingsClient from "./booking-client";
import { DEFAULT_BOOKING_SETTINGS, mapBookingSettings } from "./booking-config";

export default async function BookingSettingsPage() {
  const result = await getBookingSettings();

  if (!result.success) {
    throw new Error(result.error ?? "Failed to load booking settings");
  }

  const initialSettings = {
    ...DEFAULT_BOOKING_SETTINGS,
    ...mapBookingSettings(result.data ?? null),
  };

  return <BookingSettingsClient initialSettings={initialSettings} />;
}
