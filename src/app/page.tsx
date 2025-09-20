import { redirect } from "next/navigation";

/**
 * Home Page - Redirects to properties page
 */
export default function HomePage() {
  redirect("/propiedades");
}
