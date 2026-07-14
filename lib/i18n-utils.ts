export function localizedPath(path: string, currentLocale: string = "es"): string {
  // Ignorar enlaces externos y anchors
  if (path.startsWith("http") || path.startsWith("mailto:") || path.startsWith("tel:") || path.startsWith("#")) {
    return path;
  }

  // Asegurarse de que el path comience con "/"
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  // Ignorar rutas que no están bajo [locale] en la estructura de Next.js
  const globalPrefixes = ["/admin", "/customer", "/driver", "/hotel", "/api", "/login", "/register"];
  if (globalPrefixes.some(prefix => normalizedPath.startsWith(prefix) || normalizedPath === prefix)) {
    return normalizedPath;
  }

  // Si ya tiene el locale al principio (ej: /es/booking), no añadirlo doble
  if (normalizedPath.startsWith(`/${currentLocale}/`) || normalizedPath === `/${currentLocale}`) {
    return normalizedPath;
  }

  // Añadir el locale
  const finalPath = `/${currentLocale}${normalizedPath}`;
  
  // Limpiar posibles barras dobles (ej: /es//booking -> /es/booking)
  return finalPath.replace(/\/+/g, "/");
}

/**
 * Obtiene el valor traducido de un campo dentro del objeto JSON translations,
 * o hace fallback al valor original si no hay traducción disponible para el locale.
 */
export function getTranslatedField(
  entity: { translations?: any } | null,
  fieldName: string,
  currentLocale: string,
  fallbackValue: string | null = null
): string {
  if (!entity) return fallbackValue || "";
  
  if (currentLocale !== "es" && entity.translations) {
    try {
      const translationsObj = typeof entity.translations === "string" 
        ? JSON.parse(entity.translations) 
        : entity.translations;
        
      if (translationsObj && translationsObj[currentLocale] && translationsObj[currentLocale][fieldName]) {
        return translationsObj[currentLocale][fieldName];
      }
    } catch (e) {
      console.error("Error parsing translations:", e);
    }
  }

  // Si es "es" o no hay traducción, usamos el fallback origin
  return fallbackValue || "";
}
