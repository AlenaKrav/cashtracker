/**
 * Required for TypeScript 6+ to allow side-effect CSS imports
 * (e.g. import "./globals.css" in Next.js app/layout.tsx).
 */
declare module "*.css";

declare module "*.module.css" {
  const classes: Record<string, string>;
  export default classes;
}