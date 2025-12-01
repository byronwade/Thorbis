"use client";

import { useState } from "react";
import { Shield, Key, Ban } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { resetUserPassword, setUserStatus } from "@/actions/users";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type UserSecurityTabProps = {
	userId: string;
};

/**
 * User Security Tab
 * 
 * Allows admins to manage user security settings.
 */
export function UserSecurityTab({ userId }: UserSecurityTabProps) {
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(false);

	const handleResetPassword = async () => {
		setIsLoading(true);
		try {
			const result = await resetUserPassword(userId);
			if (result.error) {
				toast.error(result.error);
			} else {
				toast.success("Password reset email sent");
			}
		} catch (error) {
			toast.error("Failed to reset password");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="space-y-6">
			<Card>
				<CardHeader>
					<CardTitle>Password Management</CardTitle>
					<CardDescription>Reset user password</CardDescription>
				</CardHeader>
				<CardContent>
					<Button onClick={handleResetPassword} disabled={isLoading} variant="outline">
						<Key className="mr-2 h-4 w-4" />
						Send Password Reset Email
					</Button>
					<p className="text-muted-foreground mt-2 text-sm">
						This will send a password reset email to the user.
					</p>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>Account Status</CardTitle>
					<CardDescription>Manage user account status</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<p className="text-muted-foreground text-sm">
						Account status is managed per company membership. Use the Settings tab to suspend or activate the user.
					</p>
				</CardContent>
			</Card>
		</div>
	);
}



