export function mapPublicTestimonials(payload) {
  if (!Array.isArray(payload)) return [];

  return payload.map((t) => ({
    id: t.id,
    name: t.author_name ?? "Client",
    company: t.company ?? "",
    role: t.author_role ?? "",
    quote: t.quote ?? "",
    // Champs UI “optionnels” (on laisse vide pour l’instant)
    project: "",   // si tu veux le garder plus tard
    stack: "",     // si tu veux le garder plus tard
    rating: t.rating ?? null,
  }));
}