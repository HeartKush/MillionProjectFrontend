import { redirect } from "next/navigation";

/**
 * Home Page - Redirects to properties page
 */
export default function HomePage() {
  redirect("/propiedades");
  return null; // This line will never be reached, but satisfies TypeScript
}
