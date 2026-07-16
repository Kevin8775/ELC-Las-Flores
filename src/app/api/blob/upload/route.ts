import { put, type PutBlobResult } from "@vercel/blob";
import { NextResponse } from "next/server";

export async function POST(request: Request): Promise<NextResponse> {
  const form = await request.formData();
  const file = form.get("file") as File | null;
  const folder = (form.get("folder") as string) || "elc";

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  const blob: PutBlobResult = await put(file.name, file, {
    access: "public",
    addRandomSuffix: true,
    cacheControlMaxAge: 365 * 24 * 60 * 60,
  });

  return NextResponse.json({ url: blob.url });
}
