import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { ProjectForm } from "../_components/ProjectForm";

export default function NewProjectPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard/projects"
          className="p-2 rounded-lg hover:bg-muted transition-colors"
        >
          <ArrowLeft className="size-5 text-muted-foreground" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-foreground">New Project</h1>
          <p className="text-muted-foreground">
            Create a new portfolio project
          </p>
        </div>
      </div>

      <ProjectForm mode="create" />
    </div>
  );
}
