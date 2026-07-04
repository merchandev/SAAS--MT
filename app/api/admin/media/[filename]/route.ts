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

    // Prevent directory traversal attacks
    const safeFilename = path.normalize(filename).replace(/^(\.\.(\/|\\|$))+/, "");
    const UPLOADS_DIR = path.join(process.cwd(), "public", "uploads");
    const filePath = path.join(UPLOADS_DIR, safeFilename);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return NextResponse.json({ success: true, message: "Archivo eliminado" });
    } else {
      return NextResponse.json({ error: "Archivo no encontrado" }, { status: 404 });
    }
  } catch (error) {
    console.error("Error deleting file:", error);
    return NextResponse.json({ error: "Error interno al eliminar el archivo" }, { status: 500 });
  }
}
