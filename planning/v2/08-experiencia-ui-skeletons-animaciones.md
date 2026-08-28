# Contrato transversal — Skeletons y animaciones V2

Estado: implementado para el alcance V2 y verificado el 2026-08-28.

Este documento atraviesa las Fases 2 a 6. No es una fase independiente: define
reglas de experiencia que deben aplicarse cuando cada vista sea modificada.

Requisitos: `UX-01`, `UX-02`.

## Objetivo

Hacer que la app se sienta fluida y comprensible durante carga, cambio de examen,
filtrado, navegación y práctica, sin esconder problemas de rendimiento detrás de
animaciones ni convertir el movimiento en ruido visual.

## Inventario inicial

La app ya contiene `Loader`, `CatalogSkeleton`, `MindMapSkeleton` y usa
Framer Motion en algunas interacciones. La V2 debe reutilizar y consolidar esos
patrones antes de agregar nuevos componentes.

## Reglas de skeletons

1. Skeleton solo para espera real de datos, sesión, hidratación o módulo pesado.
2. Debe aproximar la geometría final para minimizar layout shift.
3. Cada vista importante debe definir estado `loading`, `empty`, `error` y
   `ready`; no usar skeleton para un estado vacío.
4. No reemplazar contenido ya renderizable por un delay artificial.
5. Mantener contraste suficiente sin simular texto legible.
6. Para listas grandes, mostrar una cantidad acotada de placeholders.
7. El mapa reserva su viewport y controles mientras carga layout/datos.
8. El cambio de examen puede mostrar transición local por sección, no un splash
   global que reinicie toda la aplicación.

## Matriz por vista

| Vista | Skeleton/estado esperado |
|---|---|
| Dashboard | Encabezado, pasos y tarjetas de dominio con tamaño estable. |
| Catálogo | Barra de búsqueda, filtros y columnas/tarjetas representativas. |
| Mapa | Sidebar, toolbar y canvas reservado; no nodos falsos interactivos. |
| Arquitecturas | Grid de tarjetas y área de diagrama al abrir detalle. |
| Favoritos | Espera de sesión/datos separada del estado “sin favoritos”. |
| Práctica | Configuración, carga de mazo y transición entre pregunta/resumen. |
| Progreso | KPIs y tarjetas por dominio, sin inventar valores durante carga. |

## Reglas de animación

- Definir tokens compartidos de duración y easing.
- Transiciones rápidas para hover/foco; moderadas para paneles y cambio de vista.
- Animar preferentemente `opacity` y `transform`.
- Evitar animar propiedades que disparen layout en listas o mapas grandes.
- El cambio de examen puede usar crossfade y stagger leve en tarjetas, una sola
  vez, sin reproducirse ante cada render.
- El feedback correcto/incorrecto combina color, icono/texto y movimiento sutil.
- Modales y drawers conservan Escape, focus trap y devolución de foco.
- `prefers-reduced-motion: reduce` elimina desplazamientos, escalados, stagger y
  parallax; conserva cambios inmediatos de estado.
- Ninguna animación impide hacer clic o navegar antes de terminar.

## Rendimiento

- No agregar una segunda librería de animación sin necesidad demostrada.
- Reutilizar Framer Motion donde ya aporta valor y CSS para microinteracciones.
- Medir vistas con datasets representativos de “todo AWS”, no solo 80 servicios.
- Virtualización o paginación se evalúa si el catálogo general crece lo suficiente.
- Las animaciones del mapa se limitan para evitar trabajo proporcional a todos
  los nodos en cada cambio de filtro.

## Verificación

- Pruebas manuales con red lenta y sesión autenticada/no autenticada.
- Comprobación de layout shift durante carga.
- Recorrido completo solo con teclado.
- Recorrido con movimiento reducido activado.
- Cambio repetido CLF-C02 ↔ AIF-C01 sin flashes, bloqueos ni estado mezclado.
- Catálogo y mapa probados con un volumen superior al dataset V1.

## Criterios de aceptación

- El usuario entiende si la app está cargando, vacía o falló.
- El contenido no salta de manera importante al reemplazar skeletons.
- Las animaciones mejoran orientación y feedback.
- La experiencia sigue siendo completa sin movimiento.
- El crecimiento del catálogo AWS no vuelve impracticables mapa y catálogo.
