import { NextResponse } from "next/server";
import { authService } from "@/modules/auth/auth.service";
import fs from "fs";
import path from "path";
import crypto from "crypto";

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "video/mp4", "application/pdf"];
const UPLOADS_DIR = path.join(process.cwd(), "public", "uploads");

// Ensure directory exists
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

export async function GET(req: Request) {
  const session = await authService.getSession();
  if (!session || !["SUPER_ADMIN", "ADMIN", "OPERATOR"].includes(session.role)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const isTrash = searchParams.get("status") === "trash";
    
    let targetDir = UPLOADS_DIR;
    if (isTrash) {
      targetDir = path.join(UPLOADS_DIR, "trash");
      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
      }
    }

    const files = fs.readdirSync(targetDir);
    
    const fileData = files
      .filter((file) => !file.startsWith(".") && fs.statSync(path.join(targetDir, file)).isFile())
      .map((file) => {
        const filePath = path.join(targetDir, file);
        const stats = fs.statSync(filePath);
        return {
          name: file,
          url: `/api/uploads/${isTrash ? "trash/" : ""}${file}`,
          size: stats.size,
          createdAt: stats.mtime,
          type: getFileType(file),
        };
      })
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    return NextResponse.json(fileData);
  } catch (error) {
    console.error("Error reading media directory:", error);
    return NextResponse.json({ error: "Error al leer archivos" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await authService.getSession();
  if (!session || !["SUPER_ADMIN", "ADMIN", "OPERATOR"].includes(session.role)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No se proporcionó ningún archivo" }, { status: 400 });
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: `Tipo de archivo no permitido: ${file.type}. Formatos: png, jpeg, webp, mp4, pdf.` },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: "El archivo es demasiado grande (máximo 50MB)" }, { status: 400 });
    }

    const ext = path.extname(file.name) || `.${file.type.split('/')[1]}`;
    const baseName = path.basename(file.name, ext).replace(/[^a-zA-Z0-9]/g, "-").toLowerCase();
    const uniqueName = `${baseName}-${crypto.randomUUID().slice(0, 8)}${ext}`;
    const filePath = path.join(UPLOADS_DIR, uniqueName);

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    fs.writeFileSync(filePath, buffer);

    return NextResponse.json({
      success: true,
      file: {
        name: uniqueName,
        url: `/api/uploads/${uniqueName}`,
        size: file.size,
        type: getFileType(uniqueName),
        createdAt: new Date().toISOString()
      }
    });

  } catch (error: any) {
    console.error("Error uploading file:", error);
    return NextResponse.json({ error: "Error interno al subir el archivo: " + (error.message || String(error)) }, { status: 500 });
  }
}

function getFileType(filename: string): "image" | "video" | "pdf" | "unknown" {
  const ext = path.extname(filename).toLowerCase();
  if ([".jpg", ".jpeg", ".png", ".webp", ".gif"].includes(ext)) return "image";
  if ([".mp4", ".webm"].includes(ext)) return "video";
  if ([".pdf"].includes(ext)) return "pdf";
  return "unknown";
}
