import { InboxTable } from "./_components/InboxTable";

export default function InboxPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Inbox</h1>
        <p className="text-muted-foreground">
          Manage messages from your contacts
        </p>
      </div>
      <InboxTable />
    </div>
  );
}
