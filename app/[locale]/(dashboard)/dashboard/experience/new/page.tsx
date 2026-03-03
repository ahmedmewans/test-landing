import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { ExperienceForm } from "../_components/ExperienceForm";

export default function NewExperiencePage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard/experience"
          className="p-2 rounded-lg hover:bg-muted transition-colors"
        >
          <ArrowLeft className="size-5 text-muted-foreground" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-foreground">New Experience</h1>
          <p className="text-muted-foreground">Add a new work experience</p>
        </div>
      </div>

      <ExperienceForm mode="create" />
    </div>
  );
}
