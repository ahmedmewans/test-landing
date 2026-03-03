"use client";

import { useMutation } from "convex/react";
import { ImagePlus, Loader2, X } from "lucide-react";
import Image from "next/image";
import { useRef, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { api } from "../../../../convex/_generated/api";
import type { Id } from "../../../../convex/_generated/dataModel";

interface ImageGalleryProps {
  value?: Id<"_storage">[];
  onChange: (storageIds: Id<"_storage">[]) => void;
  maxImages?: number;
  className?: string;
}

export function ImageGallery({
  value = [],
  onChange,
  maxImages = 10,
  className,
}: ImageGalleryProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isPending, startTransition] = useTransition();

  const generateUploadUrl = useMutation(api.projects.generateUploadUrl);

  const handleClick = () => {
    if (value.length < maxImages) {
      inputRef.current?.click();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const remainingSlots = maxImages - value.length;
    const filesToUpload = files.slice(0, remainingSlots);

    const invalidFiles = filesToUpload.filter(
      (file) => !file.type.startsWith("image/"),
    );
    if (invalidFiles.length > 0) {
      alert("Please select only image files");
      return;
    }

    const oversizedFiles = filesToUpload.filter(
      (file) => file.size > 5 * 1024 * 1024,
    );
    if (oversizedFiles.length > 0) {
      alert("Some images are larger than 5MB");
      return;
    }

    startTransition(async () => {
      try {
        const newStorageIds: Id<"_storage">[] = [];

        for (const file of filesToUpload) {
          const postUrl = await generateUploadUrl();

          const result = await fetch(postUrl, {
            method: "POST",
            headers: { "Content-Type": file.type },
            body: file,
          });

          const { storageId } = await result.json();
          newStorageIds.push(storageId as Id<"_storage">);
        }

        onChange([...value, ...newStorageIds]);
      } catch {
        alert("Failed to upload one or more images");
      } finally {
        if (inputRef.current) {
          inputRef.current.value = "";
        }
      }
    });
  };

  const handleRemove = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  const handleReorder = (fromIndex: number, toIndex: number) => {
    const newValue = [...value];
    const [removed] = newValue.splice(fromIndex, 1);
    newValue.splice(toIndex, 0, removed);
    onChange(newValue);
  };

  return (
    <div className={cn("space-y-4", className)}>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleChange}
        className="hidden"
      />

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {value.map((storageId, index) => (
          <div
            key={storageId}
            className="relative group aspect-video rounded-lg overflow-hidden border border-border bg-muted"
          >
            <Image
              src={`/api/storage/${storageId}`}
              alt={`Gallery image ${index + 1}`}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
              {index > 0 && (
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => handleReorder(index, index - 1)}
                  className="size-8 p-0"
                >
                  ←
                </Button>
              )}
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={() => handleRemove(index)}
                className="size-8 p-0"
              >
                <X className="size-4" />
              </Button>
              {index < value.length - 1 && (
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => handleReorder(index, index + 1)}
                  className="size-8 p-0"
                >
                  →
                </Button>
              )}
            </div>
            <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
              {index + 1}
            </div>
          </div>
        ))}

        {value.length < maxImages && (
          <button
            type="button"
            onClick={handleClick}
            disabled={isPending}
            className={cn(
              "aspect-video rounded-lg border-2 border-dashed border-border hover:border-primary hover:bg-muted/50 transition-colors flex flex-col items-center justify-center gap-1 text-muted-foreground",
              isPending && "opacity-50 cursor-not-allowed",
            )}
          >
            {isPending ? (
              <Loader2 className="size-6 animate-spin" />
            ) : (
              <>
                <ImagePlus className="size-6" />
                <span className="text-xs">Add Image</span>
              </>
            )}
          </button>
        )}
      </div>

      <p className="text-sm text-muted-foreground">
        {value.length} / {maxImages} images
      </p>
    </div>
  );
}
