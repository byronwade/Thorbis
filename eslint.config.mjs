import nextPlugin from "@next/eslint-plugin-next";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import tseslint from "typescript-eslint";

const ignores = [
  ".next/**",
  "node_modules/**",
  "package/dist/**",
  "dist/**",
  "docs/**",
  "content/**",
  "public/**",
  "supabase/migrations/**",
  "supabase/seeds/**",
  "supabase/manual/**",
  "supabase/seed.sql",
  "supabase/seed-minimal.sql",
];

export default [
  {
    ignores,
  },
  ...tseslint.configs.recommended,
  nextPlugin.configs["core-web-vitals"],
  reactHooksPlugin.configs.recommended,
  {
    name: "custom-rules",
    rules: {
      "no-console": [
        "error",
        {
          allow: ["warn", "error"],
        },
      ],
    },
  },
];
