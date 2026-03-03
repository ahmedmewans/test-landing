import { ProjectsTable } from "./_components/ProjectsTable";

export default function ProjectsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Projects</h1>
        <p className="text-muted-foreground">Manage your portfolio projects</p>
      </div>
      <ProjectsTable />
    </div>
  );
}
