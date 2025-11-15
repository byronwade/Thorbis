import { getCompanyInfo } from "@/actions/company";
import type { HoursOfOperation } from "@/lib/company/hours";
import { CompanyProfileClient } from "./company-profile-client";

function mapResultToFormValues(data: {
  name: string;
  legalName: string;
  industry: string;
  email: string;
  phone: string;
  website: string;
  taxId: string;
  licenseNumber: string;
  description: string;
  address: string;
  address2: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  serviceAreaType: "radius" | "locations";
  serviceRadius: number;
  serviceAreas: string[];
  hoursOfOperation: HoursOfOperation;
}) {
  return {
    companyName: data.name ?? "",
    legalName: data.legalName ?? "",
    industry: data.industry ?? "",
    email: data.email ?? "",
    phone: data.phone ?? "",
    website: data.website ?? "",
    taxId: data.taxId ?? "",
    licenseNumber: data.licenseNumber ?? "",
    description: data.description ?? "",
    address: data.address ?? "",
    address2: data.address2 ?? "",
    city: data.city ?? "",
    state: data.state ?? "",
    zipCode: data.zipCode ?? "",
    country: data.country ?? "",
    serviceAreaType: data.serviceAreaType ?? "locations",
    serviceRadius: data.serviceRadius ?? 25,
    serviceAreas: Array.isArray(data.serviceAreas) ? data.serviceAreas : [],
    hoursOfOperation: data.hoursOfOperation,
  };
}

export default async function CompanyProfilePage() {
  const result = await getCompanyInfo();

  if (!result.success) {
    throw new Error(result.error ?? "Failed to load company information");
  }

  if (!result.data) {
    throw new Error("Failed to load company information");
  }

  const initialData = mapResultToFormValues(result.data);

  return <CompanyProfileClient initialData={initialData} />;
}
