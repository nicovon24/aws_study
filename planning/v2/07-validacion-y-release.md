# Fase 6 — Validación, documentación y release V2

Estado: propuesto.

## Objetivo

Demostrar que V2 cumple el roadmap, no rompe V1 y está lista para publicarse como
`v2.0.0`.

Requisitos: `REL-01`, `REL-02`, `UX-01`, `UX-02` y cierre de todos los requisitos anteriores.

## Dependencias

- Fases 0 a 5 implementadas.
- Contenido AIF-C01 revisado.
- Migraciones compatibles desplegables.

## Gates de release

### 1. Integridad del contenido

- Registro de exámenes válido.
- Pesos por examen válidos.
- Cero referencias a items o dominios inexistentes.
- Cobertura AIF-C01 documentada por objetivo.
- Enlaces oficiales muestreados y sin errores conocidos.
- Proveniencia, fecha y estado editorial presentes para contenido MCP.
- Una actualización simulada por AWS Knowledge MCP produce un diff revisable.
- No se publican automáticamente páginas o fragmentos obtenidos por MCP.

### 2. Regresión CLF-C02

- Dashboard y cuatro dominios correctos.
- Mapa, catálogo, detalles y arquitecturas operativos.
- Flashcards equivalentes o mejores que V1.
- Favoritos y notas V1 accesibles.
- URLs antiguas normalizadas sin pantallas vacías.

### 3. Flujo AIF-C01

- Selección, recarga y enlace compartido.
- Cinco dominios navegables.
- Servicios y conceptos buscables.
- Práctica, explicación y resumen.
- Preguntas con distractores plausibles y no aleatorios.
- Simulacro y desglose por dominio.
- Progreso persistente para usuario autenticado.

### 4. Calidad técnica

- Build de producción.
- Lint o comando equivalente vigente para la versión instalada de Next.js.
- Pruebas unitarias de selectores, validadores y generadores.
- Pruebas del motor de distractores: explícitos, `similarTo`, grupos y fallback.
- Pruebas de integración de URL/examen/foco y APIs críticas.
- Sin errores relevantes en consola durante recorridos manuales.

### 5. UX y accesibilidad

- Desktop y mobile en los breakpoints principales.
- Navegación por teclado.
- Foco visible en selector, preguntas y modales.
- Etiquetas accesibles y feedback que no dependa solo del color.
- Estados de carga, vacío, error y contenido incompleto.
- Skeletons alineados con la geometría final y sin loaders artificiales.
- `prefers-reduced-motion` probado.
- Animaciones sin bloqueo de interacción ni degradación perceptible en listas/mapa.

### 6. Seguridad y datos

- Autorización de endpoints revisada.
- Validación y límites de payload.
- Índices de MongoDB documentados.
- Migración y rollback ensayados en un entorno no productivo.
- Sin secretos en repositorio ni artefactos cliente.

## Documentación requerida

1. Actualizar README para presentar AWS Prep multi-certificación.
2. Documentar cómo agregar un tercer examen:
   - registrar metadata;
   - crear dominios;
   - asignar elementos;
   - agregar preguntas;
   - ejecutar validadores.
3. Crear notas de release con cambios, migraciones y limitaciones.
4. Marcar documentos planning implementados y decisiones que cambiaron.
5. Registrar versión de la guía oficial usada para AIF-C01.

## Estrategia de publicación

1. Publicar al menos una beta interna (`2.0.0-beta.1`).
2. Ejecutar smoke test sobre el despliegue real.
3. Corregir bloqueantes sin expandir alcance.
4. Congelar contenido y código para release candidate si hace falta.
5. Cambiar `package.json` a `2.0.0`.
6. Crear commit de release.
7. Crear tag anotado `v2.0.0` con autorización explícita.
8. Verificar despliegue y conservar un camino de rollback a V1.

## Checklist de aceptación final

- [ ] `VER-01`
- [ ] `EXM-01`, `EXM-02`, `EXM-03`
- [ ] `NAV-01`, `NAV-02`, `NAV-03`
- [ ] `CNT-01`, `CNT-02`, `CNT-03`
- [ ] `AWS-01`, `AWS-02`
- [ ] `SRC-01`, `SRC-02`, `SRC-03`
- [ ] `PRC-01`, `PRC-02`, `PRC-03`
- [ ] `PRC-04`, `PRC-05`
- [ ] `EDU-01`
- [ ] `USR-01`, `USR-02`
- [ ] `REL-01`, `REL-02`
- [ ] `UX-01`, `UX-02`
- [ ] No quedan bloqueantes conocidos.
- [ ] El rollback está documentado.
- [ ] V2 está etiquetada desde el commit verificado.

## Criterios de aceptación

- Se puede publicar V2 sin perder el acceso a V1.
- Los dos exámenes completan el flujo aprender → practicar → simular → revisar.
- El banco de preguntas puede crecer sin volver a opciones obvias o mezclas
  aleatorias.
- El repositorio explica cómo extender la plataforma sin repetir esta refactorización.
