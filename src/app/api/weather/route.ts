import { NextResponse } from "next/server";
import { getCompanyWeather } from "@/actions/weather";

export async function GET() {
  const result = await getCompanyWeather();

  if (result.success) {
    return NextResponse.json(result.data);
  }

  return NextResponse.json(
    { error: result.error ?? "Unable to fetch weather" },
    { status: 400 }
  );
}
