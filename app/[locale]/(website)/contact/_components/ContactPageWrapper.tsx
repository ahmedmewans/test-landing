"use client";

import { MousePositionProvider } from "@/app/[locale]/(website)/_components/context/MousePositionContext";
import { PortfolioHeader } from "@/app/[locale]/(website)/_components/PortfolioHeader";
import { ContactPageContent } from "./ContactPageContent";

function ContactContent() {
  return (
    <>
      <PortfolioHeader />
      <ContactPageContent />
    </>
  );
}

export default function ContactPageWrapper() {
  return (
    <MousePositionProvider>
      <ContactContent />
    </MousePositionProvider>
  );
}
