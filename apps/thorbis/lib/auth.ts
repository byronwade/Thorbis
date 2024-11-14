import { NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import VercelProvider from "@/thorbis/lib/providers/vercel";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/thorbis/lib/prisma";

export const authOptions: NextAuthOptions = {
	adapter: PrismaAdapter(prisma),
	providers: [
		GithubProvider({
			clientId: process.env.GITHUB_ID!,
			clientSecret: process.env.GITHUB_SECRET!,
			scope: "repo admin:repo_hook user user:email read:org write:repo_hook",
		}),
		VercelProvider({
			clientId: "vercel_pat",
			clientSecret: process.env.VERCEL_ACCESS_TOKEN!,
		}),
	],
	callbacks: {
		async signIn({ user, account }) {
			if (!account || !user) return false;

			try {
				const dbUser = await prisma.user.upsert({
					where: { email: user.email! },
					create: {
						email: user.email!,
						name: user.name,
						image: user.image,
					},
					update: {
						name: user.name,
						image: user.image,
					},
				});

				if (account.provider === "vercel") {
					await prisma.integration.upsert({
						where: {
							userId_platform: {
								userId: dbUser.id,
								platform: "vercel",
							},
						},
						create: {
							userId: dbUser.id,
							platform: "vercel",
							accessToken: account.access_token!,
						},
						update: {
							accessToken: account.access_token!,
						},
					});
				}

				return true;
			} catch (error) {
				console.error("Error in signIn callback:", error);
				return false;
			}
		},
		async session({ session, user, token }) {
			if (session.user && token) {
				session.user.id = token.sub;
				session.accessToken = token.accessToken;
			}
			return session;
		},
		async jwt({ token, account, user }) {
			if (account) {
				token.accessToken = account.access_token;
			}
			if (user) {
				token.sub = user.id;
			}
			return token;
		},
	},
	pages: {
		signIn: "/login",
		error: "/login",
	},
	session: {
		strategy: "jwt",
	},
};
