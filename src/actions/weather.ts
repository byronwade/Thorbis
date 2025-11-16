"use server";

/**
 * Weather Actions
 *
 * Server actions for fetching weather data for company location
 */

import type { WeatherData } from "@/lib/services/weather-service";
import { WeatherService } from "@/lib/services/weather-service";
import { createClient } from "@/lib/supabase/server";

const weatherService = new WeatherService();

export type WeatherActionResult =
  | { success: true; data: WeatherData }
  | { success: false; error: string };

/**
 * Get weather for current company's location
 */
export async function getCompanyWeather(): Promise<WeatherActionResult> {
  try {
    const supabase = await createClient();
    if (!supabase) {
      return { success: false, error: "Database connection failed" };
    }

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return { success: false, error: "Not authenticated" };
    }

    // Get user's company - try multiple approaches
    let companyId: string | null = null;

    // Try 1: Get from team_members with maybeSingle
    const { data: teamMember } = await supabase
      .from("team_members")
      .select("company_id")
      .eq("user_id", user.id)
      .eq("status", "active")
      .order("updated_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (teamMember) {
      companyId = teamMember.company_id;
    }

    // Try 2: Get from companies where user is owner
    if (!companyId) {
      const { data: ownedCompany } = await supabase
        .from("companies")
        .select("id")
        .eq("owner_id", user.id)
        .limit(1)
        .maybeSingle();

      if (ownedCompany) {
        companyId = ownedCompany.id;
      }
    }

    if (!companyId) {
      return { success: false, error: "No active company found" };
    }

    // Get company location
    const { data: company } = await supabase
      .from("companies")
      .select("lat, lon, city, state")
      .eq("id", companyId)
      .single();

    if (!(company?.lat && company.lon)) {
      // Default to San Francisco if no location set (for demo purposes)
      const weatherData = await weatherService.getWeatherData(
        37.7749,
        -122.4194
      );

      if (!weatherData) {
        return { success: false, error: "Failed to fetch weather data" };
      }

      return { success: true, data: weatherData };
    }

    // Fetch weather data for company location
    const weatherData = await weatherService.getWeatherData(
      company.lat,
      company.lon
    );

    if (!weatherData) {
      return { success: false, error: "Failed to fetch weather data" };
    }

    return { success: true, data: weatherData };
  } catch (_error) {
    return { success: false, error: "Failed to fetch weather" };
  }
}
