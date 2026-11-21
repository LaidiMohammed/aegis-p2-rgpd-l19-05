import { NextRequest, NextResponse } from "next/server";
import { checkCompliance } from "@/lib/detector";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const url: string = typeof body.url === "string" ? body.url.trim() : "";
    if (!url) return NextResponse.json({ error: "URL requise" }, { status: 400 });
    const out = await checkCompliance(url);
    return NextResponse.json(out);
  } catch {
    return NextResponse.json({ error: "Requête invalide" }, { status: 400 });
  }
}
