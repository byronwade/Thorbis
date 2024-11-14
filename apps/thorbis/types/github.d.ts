declare module "next-auth" {
	interface Session {
		accessToken?: string;
		githubId?: number;
		user: {
			id?: string;
			name?: string;
			email?: string;
			image?: string;
		};
	}

	interface JWT {
		accessToken?: string;
		githubId?: number;
	}
}

export interface GitHubRepo {
	id: number;
	name: string;
	full_name: string;
	private: boolean;
	html_url: string;
	description: string | null;
	fork: boolean;
	created_at: string;
	updated_at: string;
	pushed_at: string;
	git_url: string;
	ssh_url: string;
	clone_url: string;
	default_branch: string;
}
