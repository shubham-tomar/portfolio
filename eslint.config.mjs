import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([".next/**", "out/**", "mocks/**", "next-env.d.ts"]),
  {
    // Static export has no image optimizer, and card images are remote URLs.
    rules: { "@next/next/no-img-element": "off" },
  },
]);
