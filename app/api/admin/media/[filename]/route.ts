import { NextResponse } from "next/server";
import { authService } from "@/modules/auth/auth.service";
import fs from "fs";
import path from "path";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ filename: string }> }
) {
  const session = await authService.getSession();
  if (!session || !["SUPER_ADMIN", "ADMIN", "OPERATOR"].includes(session.role)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const { filename } = await params;
    if (!filename) {
      return NextResponse.json({ error: "Nombre de archivo no proporcionado" }, { status: 400 });
    }

    const { searchParams } = new URL(req.url);
    const inTrash = searchParams.get("status") === "trash";
    
    // Prevent directory traversal attacks
    const safeFilename = path.normalize(filename).replace(/^(\.\.(\/|\\|$))+/, "");
    const UPLOADS_DIR = path.join(process.cwd(), "public", "uploads");
    const TRASH_DIR = path.join(UPLOADS_DIR, "trash");
    
    const filePath = inTrash ? path.join(TRASH_DIR, safeFilename) : path.join(UPLOADS_DIR, safeFilename);

    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: "Archivo no encontrado" }, { status: 404 });
    }

    if (inTrash) {
      fs.unlinkSync(filePath);
      return NextResponse.json({ success: true, message: "Archivo eliminado permanentemente" });
    } else {
      if (!fs.existsSync(TRASH_DIR)) fs.mkdirSync(TRASH_DIR, { recursive: true });
      fs.renameSync(filePath, path.join(TRASH_DIR, safeFilename));
      return NextResponse.json({ success: true, message: "Archivo movido a la papelera" });
    }
  } catch (error) {
    console.error("Error deleting file:", error);
    return NextResponse.json({ error: "Error interno al eliminar el archivo" }, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ filename: string }> }
) {
  const session = await authService.getSession();
  if (!session || !["SUPER_ADMIN", "ADMIN", "OPERATOR"].includes(session.role)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const { filename } = await params;
    const { searchParams } = new URL(req.url);
    const action = searchParams.get("action");
    
    if (action === "restore") {
      const safeFilename = path.normalize(filename).replace(/^(\.\.(\/|\\|$))+/, "");
      const UPLOADS_DIR = path.join(process.cwd(), "public", "uploads");
      const TRASH_DIR = path.join(UPLOADS_DIR, "trash");
      
      const trashFilePath = path.join(TRASH_DIR, safeFilename);
      const targetFilePath = path.join(UPLOADS_DIR, safeFilename);
      
      if (!fs.existsSync(trashFilePath)) {
        return NextResponse.json({ error: "Archivo no encontrado en papelera" }, { status: 404 });
      }
      
      fs.renameSync(trashFilePath, targetFilePath);
      return NextResponse.json({ success: true, message: "Archivo restaurado" });
    }
    
    return NextResponse.json({ error: "Acción no válida" }, { status: 400 });
  } catch (error) {
    console.error("Error restoring file:", error);
    return NextResponse.json({ error: "Error interno al restaurar el archivo" }, { status: 500 });
  }
}
