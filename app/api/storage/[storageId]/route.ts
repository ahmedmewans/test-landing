import { NextResponse } from "next/server";
import { getConvexClient } from "@/lib/convex-server";
import { api } from "../../../../../convex/_generated/api";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ storageId: string }> },
) {
  try {
    const { storageId } = await params;
    const convex = getConvexClient();

    const url = await convex.query(api.projects.getFileUrl, {
      storageId: storageId as any,
    });

    if (!url) {
      return new NextResponse("File not found", { status: 404 });
    }

    const response = await fetch(url);
    const blob = await response.blob();

    return new NextResponse(blob, {
      headers: {
        "Content-Type": response.headers.get("Content-Type") || "image/jpeg",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new NextResponse("Error fetching file", { status: 500 });
  }
}
