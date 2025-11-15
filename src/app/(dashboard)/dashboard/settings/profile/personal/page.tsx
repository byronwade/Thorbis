import { getPersonalInfo } from "@/actions/settings";
import {
  PersonalInformationClient,
  type PersonalInformationClientProps,
} from "./personal-information-client";

type PersonalInfoRow = {
  name: string | null;
  email: string | null;
  phone: string | null;
  avatar?: string | null;
};

function mapPersonalInfo(
  data: PersonalInfoRow
): PersonalInformationClientProps["initialData"] {
  const name = data.name?.trim() ?? "";
  const [firstName = "", ...rest] = name.split(" ").filter(Boolean);
  const lastName = rest.join(" ");

  return {
    firstName,
    lastName,
    email: data.email ?? "",
    phone: data.phone ?? "",
    jobTitle: "",
    company: "",
    bio: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    avatar: data.avatar ?? null,
  };
}

export default async function PersonalInformationPage() {
  const result = await getPersonalInfo();

  if (!result.success) {
    throw new Error(result.error ?? "Failed to load personal information");
  }

  if (!result.data) {
    throw new Error("Failed to load personal information");
  }

  const initialData = mapPersonalInfo(result.data);

  return <PersonalInformationClient initialData={initialData} />;
}
