# Flujo editorial de fuentes AWS

La aplicación no consulta MCPs ni documentación remota durante el uso normal.
Este directorio registra las fuentes que alimentan snapshots locales revisados.

## Actualización reproducible

1. Ejecutar en AWS Knowledge MCP la consulta guardada en `manifest.json` y
   limitar la búsqueda a los `topics` declarados.
2. Actualizar `fetchedAt` y, cuando el proveedor exponga una versión o contenido
   estable, registrar su hash en `checksum`.
3. Guardar todo hallazgo nuevo como `staged` y revisar el diff del repositorio.
4. Ejecutar `npm run content:report` sin conexión para validar el manifiesto.
5. Tras revisión humana, completar `reviewedAt` y cambiar a `reviewed`.
6. Solo un commit editorial explícito puede promover una fuente a `published`.

Una repetición de la consulta nunca sobrescribe contenido publicado: primero
actualiza el manifiesto o un snapshot staged y deja un diff revisable.
