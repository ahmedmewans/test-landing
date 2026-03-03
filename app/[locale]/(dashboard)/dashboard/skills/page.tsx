import { SkillsGrid } from "./_components/SkillsGrid";

export default function SkillsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Skills</h1>
        <p className="text-muted-foreground">
          Manage your skills and expertise
        </p>
      </div>
      <SkillsGrid />
    </div>
  );
}
