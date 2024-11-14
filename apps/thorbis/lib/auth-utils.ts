import { getServerSession } from "next-auth";
import { authOptions } from "./auth";

export async function checkRole(allowedRoles: string[]) {
	const session = await getServerSession(authOptions);
	if (!session?.user) return false;
	return allowedRoles.includes((session.user as unknown as { role: string }).role);
}

export async function requireAdmin() {
	const hasPermission = await checkRole(["ADMIN", "OWNER"]);
	if (!hasPermission) {
		throw new Error("Unauthorized");
	}
}
