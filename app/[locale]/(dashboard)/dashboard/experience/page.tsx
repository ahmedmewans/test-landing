import { ExperienceTable } from "./_components/ExperienceTable";

export default function ExperiencePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Experience</h1>
        <p className="text-muted-foreground">Manage your work experience</p>
      </div>
      <ExperienceTable />
    </div>
  );
}
