import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function UnauthorizedPage() {
	return (
		<div className="flex min-h-screen items-center justify-center">
			<div className="text-center space-y-4">
				<h1 className="text-3xl font-bold">Unauthorized Access</h1>
				<p className="text-gray-500">You don&apos;t have permission to access this page.</p>
				<Button asChild>
					<Link href="/">Return Home</Link>
				</Button>
			</div>
		</div>
	);
}
