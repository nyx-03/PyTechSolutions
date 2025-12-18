import { redirect } from "next/navigation";

export default function Cv() {
  // The CV section is intentionally disabled for now.
  // Redirect any direct visits to the homepage to avoid a blank page.
  redirect("/");
}