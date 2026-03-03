"use client";

import { use } from "react";
import type { Id } from "../../../../../../../convex/_generated/dataModel";
import { ContactDetail } from "../_components/ContactDetail";

export default function ContactPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const contactId = resolvedParams.id as Id<"contacts">;

  return <ContactDetail contactId={contactId} />;
}
