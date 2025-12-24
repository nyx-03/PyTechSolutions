import { apiJson } from "@/lib/apiClient";

export async function fetchPublicTestimonials() {
  // Endpoint Django public
  return apiJson("/testimonials/", { method: "GET" });
}