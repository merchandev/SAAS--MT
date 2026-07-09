export function localizedPath(path: string, currentLocale: string = "es"): string {
  // Ignorar enlaces externos y anchors
  if (path.startsWith("http") || path.startsWith("mailto:") || path.startsWith("tel:") || path.startsWith("#")) {
    return path;
  }

  // Asegurarse de que el path comience con "/"
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  // Si ya tiene el locale al principio (ej: /es/booking), no añadirlo doble
  if (normalizedPath.startsWith(`/${currentLocale}/`) || normalizedPath === `/${currentLocale}`) {
    return normalizedPath;
  }

  // Añadir el locale
  const finalPath = `/${currentLocale}${normalizedPath}`;
  
  // Limpiar posibles barras dobles (ej: /es//booking -> /es/booking)
  return finalPath.replace(/\/+/g, "/");
}
