# Fase 2 — Selector, navegación y estados visuales

Estado: propuesto.

## Objetivo

Permitir elegir la certificación activa y hacer que esa elección controle la
experiencia completa de forma persistente, compartible y responsive.

Requisitos: `NAV-01`, `NAV-02`, `NAV-03`, `UX-01`, `UX-02`.

## Dependencias

- Registro multi-examen de la Fase 1.
- Metadata mínima de CLF-C02 y AIF-C01.

## Decisiones de navegación

- Estrategia inicial: query param canónico `?exam=clf-c02` o `?exam=aif-c01`.
- Un examen inválido cae en el examen por defecto y limpia/normaliza el estado.
- `localStorage` recuerda la última selección solo cuando la URL no especifica
  un examen.
- La URL tiene precedencia sobre `localStorage`.
- Los parámetros de foco deben validarse contra el examen activo; un dominio de
  otro examen no puede dejar la pantalla vacía.
- Las rutas actuales (`/mapa`, `/catalogo`, etc.) se conservan en esta fase para
  limitar el alcance. Rutas anidadas por examen quedan como decisión futura.

## Tareas

1. Crear un `ExamProvider`/hook o mecanismo equivalente como única fuente de
   verdad cliente para el examen activo.
2. Centralizar parseo, serialización y normalización de `exam` en URL.
3. Integrar el examen con `useUrlFocus` para evitar estados incompatibles.
4. Construir un selector accesible junto a la marca en desktop y dentro del
   drawer mobile.
5. Sustituir código y nombre fijos `CLF-C02` del Header por metadata del examen.
6. Hacer dinámicos título, introducción, dominios y cantidades del Dashboard.
7. Preservar `exam` al navegar entre todas las vistas.
8. Filtrar mapa, catálogo, arquitecturas y práctica por examen activo.
9. Hacer dinámicos metadata HTML, título de página y descripción cuando la
   arquitectura de Next.js lo permita sin degradar la navegación cliente.
10. Agregar estados claros para un examen registrado pero todavía sin contenido.
11. Probar teclado, foco, Escape y lectores de pantalla en el selector.
12. Incorporar skeletons que repliquen la geometría de Dashboard, Catálogo,
    Mapa, Arquitecturas, Favoritos y Práctica durante cargas reales.
13. Centralizar duraciones, curvas y variantes de movimiento para evitar que
    cada vista invente su propia animación.
14. Añadir transiciones breves al cambiar examen, filtros, paneles y sesiones,
    sin animar indiscriminadamente listas grandes o nodos del mapa.
15. Respetar `prefers-reduced-motion` y mantener feedback accesible sin depender
    de la animación.
16. Evitar saltos de layout: los skeletons deben reservar el espacio final y no
    ocultar contenido ya disponible detrás de loaders artificiales.

## Matriz de comportamiento

| Entrada | Resultado |
|---|---|
| URL con examen válido | Usa ese examen. |
| URL sin examen + preferencia guardada | Usa la preferencia. |
| URL sin examen ni preferencia | Usa CLF-C02. |
| URL con examen inválido | Normaliza a CLF-C02. |
| Dominio inválido para el examen | Restablece foco a `all`. |
| Cambio de examen durante una sesión | Sale de estados incompatibles y abre una vista válida. |

## Verificación

- Seleccionar AIF-C01 actualiza Header y Dashboard.
- Recargar conserva el examen.
- Copiar la URL y abrirla en una sesión limpia conserva el examen.
- Navegar por todas las tabs no pierde el parámetro.
- Back/forward restaura correctamente examen y foco.
- El selector funciona en mobile y desktop.
- No hay flash visible de un examen incorrecto durante hidratación.
- Los skeletons aparecen solo durante estados de carga genuinos.
- Con movimiento reducido, la navegación conserva significado y feedback.
- Las transiciones no bloquean interacción ni provocan scroll inesperado.

## Criterios de aceptación

- La selección es global, predecible y compartible.
- La UI no contiene referencias fijas a cuatro dominios o a CLF-C02 donde debe
  mostrar datos del examen activo.
- AIF-C01 puede mostrar un estado de contenido parcial sin romper ninguna vista.
- La carga y el cambio de contexto se sienten consistentes en mobile y desktop.

Ver contrato transversal en `08-experiencia-ui-skeletons-animaciones.md`.
