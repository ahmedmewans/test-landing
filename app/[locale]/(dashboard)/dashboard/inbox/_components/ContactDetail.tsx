"use client";

import { useMutation, useQuery } from "convex/react";
import { format, formatDistanceToNow } from "date-fns";
import {
  Archive,
  ArrowLeft,
  Loader2,
  Mail,
  MailOpen,
  Send,
} from "lucide-react";
import Link from "next/link";
import { useTransition } from "react";
import { toast } from "sonner";
import { StatusBadge } from "@/components/dashboard/ui/StatusBadge";
import { Button } from "@/components/ui/button";
import { api } from "../../../../../../../convex/_generated/api";
import type { Id } from "../../../../../../../convex/_generated/dataModel";

interface ContactDetailProps {
  contactId: Id<"contacts">;
}

export function ContactDetail({ contactId }: ContactDetailProps) {
  const [isPending, startTransition] = useTransition();

  const contact = useQuery(api.contacts.getContactById, { id: contactId });
  const updateStatus = useMutation(api.contacts.updateContactStatus);

  const handleStatusChange = (newStatus: "read" | "replied" | "archived") => {
    startTransition(async () => {
      try {
        await updateStatus({ id: contactId, status: newStatus });
        toast.success(`Message marked as ${newStatus}`);
      } catch {
        toast.error("Failed to update status");
      }
    });
  };

  if (!contact) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Message not found.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard/inbox"
          className="p-2 rounded-lg hover:bg-muted transition-colors"
        >
          <ArrowLeft className="size-5 text-muted-foreground" />
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-foreground">
            {contact.subject || "No Subject"}
          </h1>
          <p className="text-muted-foreground">
            From {contact.name} ({contact.email})
          </p>
        </div>
        <StatusBadge status={contact.status} />
      </div>

      <div className="flex gap-2">
        {contact.status === "unread" && (
          <Button
            variant="outline"
            onClick={() => handleStatusChange("read")}
            disabled={isPending}
          >
            <MailOpen className="size-4 mr-2" />
            Mark as Read
          </Button>
        )}
        {(contact.status === "unread" || contact.status === "read") && (
          <Button
            variant="outline"
            onClick={() => handleStatusChange("replied")}
            disabled={isPending}
          >
            <Send className="size-4 mr-2" />
            Mark as Replied
          </Button>
        )}
        {contact.status !== "archived" && (
          <Button
            variant="outline"
            onClick={() => handleStatusChange("archived")}
            disabled={isPending}
          >
            <Archive className="size-4 mr-2" />
            Archive
          </Button>
        )}
        {isPending && <Loader2 className="size-4 animate-spin self-center" />}
      </div>

      <div className="rounded-lg border border-border bg-card p-6 space-y-4">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>
            Received{" "}
            {formatDistanceToNow(contact._creationTime, { addSuffix: true })}
          </span>
          <span>{format(contact._creationTime, "PPP 'at' p")}</span>
        </div>

        <div className="border-t border-border pt-4">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-sm text-muted-foreground">From</p>
              <p className="font-medium text-foreground">{contact.name}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <a
                href={`mailto:${contact.email}`}
                className="font-medium text-primary hover:underline"
              >
                {contact.email}
              </a>
            </div>
          </div>

          {contact.subject && (
            <div className="mb-4">
              <p className="text-sm text-muted-foreground">Subject</p>
              <p className="font-medium text-foreground">{contact.subject}</p>
            </div>
          )}

          <div>
            <p className="text-sm text-muted-foreground mb-2">Message</p>
            <div className="bg-muted/50 rounded-lg p-4">
              <p className="text-foreground whitespace-pre-wrap">
                {contact.message}
              </p>
            </div>
          </div>
        </div>

        {contact.repliedAt && (
          <div className="border-t border-border pt-4">
            <p className="text-sm text-muted-foreground">
              Replied on {format(contact.repliedAt, "PPP 'at' p")}
            </p>
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <Button asChild>
          <a
            href={`mailto:${contact.email}?subject=Re: ${contact.subject || "Your message"}`}
          >
            <Mail className="size-4 mr-2" />
            Reply via Email
          </a>
        </Button>
      </div>
    </div>
  );
}
