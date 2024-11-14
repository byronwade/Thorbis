import type { OAuthConfig, OAuthUserConfig } from "next-auth/providers";

export interface VercelProfile {
	id: string;
	email: string;
	name: string;
	username: string;
	avatar: string;
}

export default function VercelProvider<P extends VercelProfile>(config: OAuthUserConfig<P>): OAuthConfig<P> {
	return {
		id: "vercel",
		name: "Vercel",
		type: "oauth",
		authorization: {
			url: "https://api.vercel.com/v2/oauth/token",
			params: {
				grant_type: "personal_access_token",
				token: config.clientSecret,
			},
		},
		token: {
			url: "https://api.vercel.com/v2/oauth/token",
			async request({ client }) {
				return {
					tokens: {
						access_token: client.client_secret,
						token_type: "Bearer",
					},
				};
			},
		},
		userinfo: {
			url: "https://api.vercel.com/v2/user",
			async request({ tokens }) {
				const response = await fetch("https://api.vercel.com/v2/user", {
					headers: {
						Authorization: `Bearer ${tokens.access_token}`,
					},
				});

				if (!response.ok) {
					throw new Error("Failed to get user info");
				}

				return await response.json();
			},
		},
		profile(profile) {
			return {
				id: profile.id,
				name: profile.name,
				email: profile.email,
				image: profile.avatar,
			};
		},
	};
}
