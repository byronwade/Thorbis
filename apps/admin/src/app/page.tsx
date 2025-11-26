import { redirect } from "next/navigation";

export default function AdminHome() {
	// Redirect to login page
	redirect("/login");
}
