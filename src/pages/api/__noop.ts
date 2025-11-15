import type { NextApiRequest, NextApiResponse } from "next";

/**
 * Placeholder API route to ensure Next.js generates the legacy
 * pages-manifest when building entirely with the App Router.
 */
export default function handler(_req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json({ status: "ok" });
}
