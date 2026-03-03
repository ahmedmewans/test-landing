import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { SkillForm } from "../_components/SkillForm";

export default function NewSkillPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard/skills"
          className="p-2 rounded-lg hover:bg-muted transition-colors"
        >
          <ArrowLeft className="size-5 text-muted-foreground" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-foreground">New Skill</h1>
          <p className="text-muted-foreground">Add a new skill</p>
        </div>
      </div>

      <SkillForm mode="create" />
    </div>
  );
}
