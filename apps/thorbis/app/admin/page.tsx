import { GitHubInfo } from "@/components/GitHubInfo";
import { GitHubRepos } from "@/components/GitHubRepos";

export default function AdminPage() {
	return (
		<div className="container mx-auto p-6 space-y-6">
			<GitHubInfo />
			<GitHubRepos />
		</div>
	);
}
