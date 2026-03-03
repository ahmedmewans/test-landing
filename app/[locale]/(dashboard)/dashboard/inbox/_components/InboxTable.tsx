"use client";

import { useMutation, useQuery } from "convex/react";
import { formatDistanceToNow } from "date-fns";
import {
  Archive,
  CheckSquare,
  MailOpen,
  Search,
  Square,
  Trash2,
  X,
} from "lucide-react";
import { useMemo, useState, useTransition } from "react";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/dashboard/ui/ConfirmDialog";
import { EmptyState } from "@/components/dashboard/ui/EmptyState";
import { StatusBadge } from "@/components/dashboard/ui/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { api } from "../../../../../../../convex/_generated/api";
import type { Id } from "../../../../../../../convex/_generated/dataModel";

type Contact = {
  _id: Id<"contacts">;
  _creationTime: number;
  name: string;
  email: string;
  subject?: string;
  message: string;
  status: "unread" | "read" | "replied" | "archived";
  repliedAt?: number;
};

export function InboxTable() {
  const router = useRouter();
  const [status, setStatus] = useState<
    "unread" | "read" | "replied" | "archived" | undefined
  >(undefined);
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    contact: Contact | null;
    isBulk: boolean;
  }>({ open: false, contact: null, isBulk: false });
  const [isPending, startTransition] = useTransition();

  const contacts = useQuery(api.contacts.getContacts, { status });
  const deleteContact = useMutation(api.contacts.deleteContact);
  const updateContactStatus = useMutation(api.contacts.updateContactStatus);

  const filteredContacts = useMemo(() => {
    if (!contacts) return [];
    if (!search) return contacts;
    const searchLower = search.toLowerCase();
    return contacts.filter(
      (c) =>
        c.name.toLowerCase().includes(searchLower) ||
        c.email.toLowerCase().includes(searchLower) ||
        c.subject?.toLowerCase().includes(searchLower),
    );
  }, [contacts, search]);

  const isAllSelected =
    filteredContacts.length > 0 && selectedIds.size === filteredContacts.length;
  const isSomeSelected = selectedIds.size > 0;

  const handleDelete = async () => {
    startTransition(async () => {
      try {
        if (deleteDialog.isBulk) {
          await Promise.all(
            Array.from(selectedIds).map((id) =>
              deleteContact({ id: id as Id<"contacts"> }),
            ),
          );
          toast.success(`${selectedIds.size} messages deleted`);
          setSelectedIds(new Set());
        } else if (deleteDialog.contact) {
          await deleteContact({ id: deleteDialog.contact._id });
          toast.success("Message deleted successfully");
        }
        setDeleteDialog({ open: false, contact: null, isBulk: false });
      } catch {
        toast.error("Failed to delete message(s)");
      }
    });
  };

  const handleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredContacts.map((c) => c._id)));
    }
  };

  const handleSelectOne = (id: string) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setSelectedIds(newSet);
  };

  const handleBulkStatusChange = (newStatus: "read" | "archived") => {
    startTransition(async () => {
      try {
        await Promise.all(
          Array.from(selectedIds).map((id) =>
            updateContactStatus({
              id: id as Id<"contacts">,
              status: newStatus,
            }),
          ),
        );
        toast.success(`${selectedIds.size} messages marked as ${newStatus}`);
        setSelectedIds(new Set());
      } catch {
        toast.error("Failed to update status");
      }
    });
  };

  if (contacts?.length === 0 && !status && !search) {
    return (
      <EmptyState
        title="No messages yet"
        description="When people contact you, their messages will appear here."
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search messages..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-background border-input"
            />
          </div>

          <Select
            value={status ?? "all"}
            onValueChange={(value) =>
              setStatus(value === "all" ? undefined : (value as typeof status))
            }
          >
            <SelectTrigger className="w-40 bg-background border-input">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="unread">Unread</SelectItem>
              <SelectItem value="read">Read</SelectItem>
              <SelectItem value="replied">Replied</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {isSomeSelected && (
        <div className="flex items-center justify-between gap-4 p-3 bg-muted/50 rounded-lg">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">
              {selectedIds.size} selected
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedIds(new Set())}
            >
              <X className="size-4 mr-1" />
              Clear
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleBulkStatusChange("read")}
              disabled={isPending}
            >
              <MailOpen className="size-4 mr-1" />
              Mark Read
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleBulkStatusChange("archived")}
              disabled={isPending}
            >
              <Archive className="size-4 mr-1" />
              Archive
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() =>
                setDeleteDialog({ open: true, contact: null, isBulk: true })
              }
              disabled={isPending}
            >
              <Trash2 className="size-4 mr-1" />
              Delete
            </Button>
          </div>
        </div>
      )}

      <div className="flex items-center gap-2 p-2 bg-muted/50 rounded-lg">
        <button
          type="button"
          onClick={handleSelectAll}
          className="p-1 hover:bg-muted rounded transition-colors"
        >
          {isAllSelected ? (
            <CheckSquare className="size-5 text-primary" />
          ) : (
            <Square className="size-5 text-muted-foreground" />
          )}
        </button>
        <span className="text-sm text-muted-foreground">Select all</span>
      </div>

      <div className="space-y-2">
        {filteredContacts.map((contact) => (
          <div
            key={contact._id}
            onClick={() => router.push(`/dashboard/inbox/${contact._id}`)}
            className={cn(
              "rounded-lg border border-border bg-card p-4 hover:bg-muted/50 transition-colors cursor-pointer",
              contact.status === "unread" && "border-l-4 border-l-primary",
            )}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3 flex-1 min-w-0">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectOne(contact._id);
                  }}
                  className="p-1 hover:bg-muted rounded transition-colors shrink-0 mt-1"
                >
                  {selectedIds.has(contact._id) ? (
                    <CheckSquare className="size-5 text-primary" />
                  ) : (
                    <Square className="size-5 text-muted-foreground" />
                  )}
                </button>
                <div
                  className={cn(
                    "size-10 rounded-full flex items-center justify-center text-white font-medium shrink-0",
                    contact.status === "unread"
                      ? "bg-primary"
                      : "bg-muted-foreground",
                  )}
                >
                  {contact.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium text-foreground">
                      {contact.name}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {contact.email}
                    </span>
                    <StatusBadge status={contact.status} />
                  </div>
                  {contact.subject && (
                    <p className="font-medium text-foreground mt-1 truncate">
                      {contact.subject}
                    </p>
                  )}
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
                    {contact.message}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs text-muted-foreground">
                  {formatDistanceToNow(contact._creationTime, {
                    addSuffix: true,
                  })}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-8"
                  onClick={(e) => {
                    e.stopPropagation();
                    setDeleteDialog({
                      open: true,
                      contact: contact,
                      isBulk: false,
                    });
                  }}
                >
                  <Trash2 className="size-4 text-muted-foreground hover:text-destructive" />
                </Button>
              </div>
            </div>
          </div>
        ))}

        {filteredContacts.length === 0 && (search || status) && (
          <div className="text-center py-8 text-muted-foreground">
            No messages found matching your filters.
          </div>
        )}
      </div>

      <ConfirmDialog
        open={deleteDialog.open}
        onOpenChange={(open) =>
          setDeleteDialog({ open, contact: null, isBulk: false })
        }
        title={
          deleteDialog.isBulk ? "Delete Selected Messages" : "Delete Message"
        }
        description={
          deleteDialog.isBulk
            ? `Are you sure you want to delete ${selectedIds.size} selected messages? This action cannot be undone.`
            : `Are you sure you want to delete the message from "${deleteDialog.contact?.name}"? This action cannot be undone.`
        }
        onConfirm={handleDelete}
        confirmLabel="Delete"
        variant="danger"
      />
    </div>
  );
}
