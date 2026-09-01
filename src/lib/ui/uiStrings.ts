import type { Localized } from "@/lib/types";

/** Every hardcoded chrome string in the app (nav, buttons, headings, placeholders), keyed by usage. */
export const UI: Record<string, Localized> = {
  // Header nav
  navHome: { es: "Home", en: "Home" },
  navCatalog: { es: "Catálogo", en: "Catalog" },
  navMap: { es: "Mapa", en: "Map" },
  navArchitectures: { es: "Arquitecturas", en: "Architectures" },
  navPractice: { es: "Practicar", en: "Practice" },
  navProgress: { es: "Progreso", en: "Progress" },
  navFavorites: { es: "Favoritos", en: "Favorites" },
  navGroupStudy: { es: "Estudiar", en: "Study" },
  navGroupMyProgress: { es: "Mi progreso", en: "My progress" },
  openMenu: { es: "abrir menú", en: "open menu" },
  closeMenu: { es: "cerrar menú", en: "close menu" },
  signIn: { es: "Iniciar sesión", en: "Sign in" },
  signOut: { es: "Cerrar sesión", en: "Sign out" },
  examSelector: { es: "Seleccionar certificación", en: "Select certification" },
  examContentPreparing: { es: "Contenido en preparación.", en: "Content in preparation." },
  examContentPreparingDetail: {
    es: "La certificación ya está registrada; sus materiales se incorporarán en la siguiente fase.",
    en: "The certification is registered; its study materials will be added in the next phase.",
  },

  // AppShell footer
  disclaimer: {
    es: "Proyecto personal de estudio, no afiliado ni patrocinado por Amazon Web Services, Inc.",
    en: "Personal study project, not affiliated with or sponsored by Amazon Web Services, Inc.",
  },

  // DashboardView
  dashboardIntro: {
    es: "App de estudio y repaso para la certificación",
    en: "Study and review app for the certification",
  },
  dashboardEyebrow: { es: "tu ruta de estudio", en: "your study path" },
  dashboardTitle: { es: "AWS Certified Cloud Practitioner", en: "AWS Certified Cloud Practitioner" },
  dashboardSubtitle: {
    es: "129 servicios y conceptos organizados en los 4 dominios del examen. Estudiá por dominio y explorá el mapa.",
    en: "129 services and concepts organized across the exam's 4 domains. Study by domain and explore the map.",
  },
  stepLearn: { es: "Aprender", en: "Learn" },
  stepPractice: { es: "Practicar", en: "Practice" },
  stepMock: { es: "Simulacro", en: "Mock exam" },
  stepMockSoon: { es: "Próximamente", en: "Coming soon" },
  domainLabel: { es: "DOMINIO", en: "DOMAIN" },
  ofExam: { es: "del examen", en: "of the exam" },
  servicesCount: { es: "servicios", en: "services" },
  study: { es: "Estudiar", en: "Study" },

  // CategoryFilters / AnimatedFilterSidebar
  categories: { es: "categorías", en: "categories" },
  all: { es: "Todas", en: "All" },
  hideCategories: { es: "ocultar categorías", en: "hide categories" },
  showCategories: { es: "mostrar categorías", en: "show categories" },
  domainTitle: { es: "Dominio", en: "Domain" },

  // CatalogView
  searchServiceOrConcept: { es: "Buscar servicio o concepto…", en: "Search service or concept…" },
  itemsVisible: { es: "items visibles", en: "items visible" },
  priorityHigh: { es: "Alta", en: "High" },
  priorityMedium: { es: "Media", en: "Medium" },
  priorityLow: { es: "Baja", en: "Low" },
  priorityHighTooltip: {
    es: "Servicios fundamentales para el examen.",
    en: "Core services for the exam.",
  },
  priorityMediumTooltip: {
    es: "Servicios que suelen aparecer en el examen, con menor peso.",
    en: "Services that often show up on the exam, with less weight.",
  },
  priorityLowTooltip: {
    es: "Servicios de nicho, baja probabilidad de aparecer.",
    en: "Niche services, low chance of appearing.",
  },

  // MapSearch
  searchService: { es: "Buscar servicio…", en: "Search service…" },
  noResults: { es: "Sin resultados", en: "No results" },

  // MindMapView
  domainChip: { es: "Dominio", en: "Domain" },

  // PracticeView
  practiceEyebrow: { es: "practicar", en: "practice" },
  flashcards: { es: "Flashcards", en: "Flashcards" },
  practiceIntro: {
    es: "Elegí qué querés repasar y en qué sentido: adivinar la descripción a partir del servicio, o el servicio a partir de la descripción.",
    en: "Choose what to review and in which direction: guess the description from the service, or the service from the description.",
  },
  scope: { es: "alcance", en: "scope" },
  allPill: { es: "Todos", en: "All" },
  mode: { es: "modo", en: "mode" },
  questionCount: { es: "cantidad de preguntas", en: "number of questions" },
  allCount: { es: "Todas", en: "All" },
  otherCount: { es: "otra cantidad", en: "other amount" },
  start: { es: "Empezar", en: "Start" },
  card: { es: "tarjeta", en: "card" },
  cards: { es: "tarjetas", en: "cards" },
  back: { es: "Volver", en: "Back" },
  batchDone: { es: "Completaste la tanda", en: "You finished the batch" },
  cardsReviewed: { es: "tarjetas repasadas.", en: "cards reviewed." },
  backToSetup: { es: "Volver a configurar", en: "Back to setup" },
  whatDoesThisDo: { es: "¿Qué hace este servicio?", en: "What does this service do?" },
  whichServiceIsThis: { es: "¿Qué servicio es este?", en: "Which service is this?" },
  next: { es: "Siguiente", en: "Next" },
  guessDescription: { es: "Adivinar descripción", en: "Guess the description" },
  guessService: { es: "Adivinar servicio", en: "Guess the service" },

  // ArchitecturesView
  archEyebrow: { es: "patrones de referencia", en: "reference patterns" },
  archTitle: { es: "Arquitecturas", en: "Architectures" },
  archSubtitle: {
    es: "Diagramas de los patrones más comunes del examen: cómo se conectan los servicios entre sí en una arquitectura real.",
    en: "Diagrams of the exam's most common patterns: how services connect to each other in a real architecture.",
  },
  archZoomIn: { es: "acercar", en: "zoom in" },
  archZoomOut: { es: "alejar", en: "zoom out" },
  archZoomReset: { es: "restablecer zoom", en: "reset zoom" },
  close: { es: "cerrar", en: "close" },

  // DetailPanel
  whenToUse: { es: "Cuándo usarlo", en: "When to use it" },
  whenNot: { es: "Cuándo NO", en: "When NOT to" },
  ownConcepts: { es: "Conceptos propios", en: "Key concepts" },
  relatedTo: { es: "Se relaciona con", en: "Related to" },
  appearsInArchitectures: { es: "Aparece en estas arquitecturas", en: "Appears in these architectures" },
  officialDoc: { es: "↗ doc oficial", en: "↗ official docs" },

  // Favorites & notes
  addToFavorites: { es: "Agregar a favoritos", en: "Add to favorites" },
  removeFromFavorites: { es: "Quitar de favoritos", en: "Remove from favorites" },
  signInToUseFavorites: { es: "Iniciá sesión para guardar favoritos", en: "Sign in to save favorites" },
  myNote: { es: "Mi nota", en: "My note" },
  notePlaceholder: { es: "Escribí tu nota acá…", en: "Write your note here…" },
  signInToUseNotes: { es: "Iniciá sesión para escribir notas", en: "Sign in to write notes" },
  noteSaving: { es: "Guardando…", en: "Saving…" },
  noteSaved: { es: "Guardado", en: "Saved" },
  onlyFavorites: { es: "Solo favoritos", en: "Favorites only" },
  onlyFavoritesTooltip: {
    es: "Mostrar solo los servicios que marcaste como favoritos.",
    en: "Show only the services you marked as favorites.",
  },
  priorityFilterLabel: { es: "Prioridad:", en: "Priority:" },
  favoritesSignInPrompt: {
    es: "Iniciá sesión con Google para guardar y ver tus servicios favoritos.",
    en: "Sign in with Google to save and see your favorite services.",
  },
  favoritesEmpty: {
    es: "Todavía no marcaste ningún favorito. Abrí un servicio en el catálogo y tocá la estrella.",
    en: "You haven't marked any favorites yet. Open a service in the catalog and tap the star.",
  },
  favoritesCount: { es: "favoritos", en: "favorites" },
};
