import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// ---------------------------------------------------------
// Phase 1: Core Type Definitions
// ---------------------------------------------------------
export type CourseId = string;
export type TabId = string;
export type PaletteId = string;

export interface CourseInGrid {
  id: CourseId;
  forceAdded: boolean;
  customColor?: string;
}

export interface GridTab {
  id: TabId;
  name: string;
  courses: Record<CourseId, CourseInGrid>;
}

export interface ColorPalette {
  id: PaletteId;
  name: string;
  colors: string[];
}

export interface HistorySnapshot {
  tabs: Record<TabId, GridTab>;
  tabOrder: TabId[];
  activeTabId: TabId;
}

export interface ClashAlertData {
  newCourse: Materia;
  conflictingCourses: Materia[];
}

// Default generic palettes
const defaultPalettes: Record<PaletteId, ColorPalette> = {
  default: {
    id: "default",
    name: "Cores Padrão",
    colors: [
      "#ef4444", "#f97316", "#f59e0b", "#84cc16", "#22c55e",
      "#10b981", "#06b6d4", "#0ea5e9", "#3b82f6", "#6366f1",
      "#8b5cf6", "#a855f7", "#d946ef", "#ec4899", "#f43f5e"
    ]
  }
};

// Math helper to auto-assign colors consistently
const hashStringToIndex = (str: string, max: number) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash) % max;
};

// Time Clash Detection Utility
const checkClashes = (newCourse: Materia, existingCourses: Materia[]): Materia[] => {
  const clashes: Materia[] = [];

  for (const novoHorario of newCourse.horarios) {
    for (const existing of existingCourses) {
      for (const exHorario of existing.horarios) {
        if (novoHorario.dia === exHorario.dia) {
          // Check for overlap
          const start1 = novoHorario.hInicial;
          const end1 = start1 + novoHorario.horas;
          const start2 = exHorario.hInicial;
          const end2 = start2 + exHorario.horas;

          if (start1 < end2 && start2 < end1) {
            clashes.push(existing);
          }
        }
      }
    }
  }

  // Deduplicate array based on course ID
  return Array.from(new Map(clashes.map(c => [c.id, c])).values());
};

// ---------------------------------------------------------
// UI & Data State Types
// ---------------------------------------------------------
interface UIState {
  checkLinhas: boolean;
  sidebar: boolean;
  isSidebarMateria: boolean;
  setCheckLinhas: (val: boolean) => void;
  setSidebar: (val: boolean) => void;
  setIsSidebarMateria: (val: boolean) => void;
}

interface DataState {
  todasMaterias: Periodo | undefined;
  loadTodasMaterias: () => Promise<void>;

  // Backwards compatibility layer (Phase 1)
  materiasSelecionadas: Map<string, Materia>;
  toggleMateria: (materia: Materia) => void;

  // --- Phase 1: Core Engine ---
  tabs: Record<TabId, GridTab>;
  tabOrder: TabId[];
  activeTabId: TabId;

  palettes: Record<PaletteId, ColorPalette>;
  activePaletteId: PaletteId;
  autoAssignedColors: Record<CourseId, string>;

  past: HistorySnapshot[];
  future: HistorySnapshot[];
  clashAlert: ClashAlertData | null;

  // Actions - Grid & Tabs
  addTab: (name: string) => void;
  removeTab: (id: TabId) => void;
  setActiveTab: (id: TabId) => void;

  addCourse: (course: Materia) => void;
  forceAddCourse: (course: Materia, isForced?: boolean) => void;
  removeCourse: (courseId: CourseId) => void;
  clearTab: (tabId: TabId) => void;

  // Actions - Undo/Redo & Utility
  undo: () => void;
  redo: () => void;
  saveHistory: () => void;
  dismissClashAlert: () => void;
  setCustomCourseColor: (tabId: TabId, courseId: CourseId, color: string) => void;

  // Extracted internal helpers
  _assignColorsIfLoaded: (materiasGlobais: Materia[]) => void;
}

type StoreState = UIState & DataState;

// Define initial empty tab setup
const initialTabId = "tab-1";
const initialTabs: Record<TabId, GridTab> = {
  [initialTabId]: { id: initialTabId, name: "Grade Principal", courses: {} }
};

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      // --- UI State ---
      checkLinhas: false,
      sidebar: true,
      isSidebarMateria: true,
      setCheckLinhas: (val) => set({ checkLinhas: val }),
      setSidebar: (val) => set({ sidebar: val }),
      setIsSidebarMateria: (val) => set({ isSidebarMateria: val }),

      // --- Legacy Data State ---
      todasMaterias: undefined,
      materiasSelecionadas: new Map(),

      loadTodasMaterias: async () => {
        try {
          const baseUrl = window.location.href.split('?')[0].replace(/\/$/, "");
          const fetchUrl = baseUrl.includes(".cache")
            ? window.location.href
            : `${baseUrl}/.cache/materias.json`;

          const result = await fetch(fetchUrl);
          const json = await result.json();
          set({ todasMaterias: json });

          // Auto-assign colors sequentially across all courses globally
          const allCoursesList: Materia[] = [];
          if (json) {
            for (const key in json) {
              allCoursesList.push(...json[key]);
            }
          }
          get()._assignColorsIfLoaded(allCoursesList);

          // Rehydrate legacy format for compatibility
          const activeTabId = get().activeTabId;
          const currentTab = get().tabs[activeTabId];
          if (currentTab) {
            set({ materiasSelecionadas: getLegacyMapFromTabs(currentTab, json) });
          }

        } catch (error) {
          console.error("Failed to load materias", error);
        }
      },

      toggleMateria: (materia: Materia) => {
        // We adapt toggleMateria to map into the new architecture, 
        // ensuring backward compatibility for UI clicks without refactoring UI yet.
        const state = get();
        const tabId = state.activeTabId;
        const currentTab = state.tabs[tabId];

        if (currentTab.courses[materia.id]) {
          get().removeCourse(materia.id);
        } else {
          get().addCourse(materia);
        }
      },

      // --- Engine Data ---
      tabs: { ...initialTabs },
      tabOrder: [initialTabId],
      activeTabId: initialTabId,

      palettes: defaultPalettes,
      activePaletteId: "default",
      autoAssignedColors: {},

      past: [],
      future: [],
      clashAlert: null,

      // --- Internal Helper ---
      _assignColorsIfLoaded: (courses) => {
        set((state) => {
          const newColors = { ...state.autoAssignedColors };
          const activePalette = state.palettes[state.activePaletteId];
          const colors = activePalette.colors;

          courses.forEach((c) => {
            if (!newColors[c.id]) {
              newColors[c.id] = colors[hashStringToIndex(c.id, colors.length)];
            }
          });
          return { autoAssignedColors: newColors };
        });
      },

      // --- Undo / Redo Engine ---
      saveHistory: () => {
        set((state) => {
          const snapshot: HistorySnapshot = {
            tabs: JSON.parse(JSON.stringify(state.tabs)),
            tabOrder: [...state.tabOrder],
            activeTabId: state.activeTabId
          };
          return {
            past: [...state.past, snapshot],
            future: []
          };
        });
      },

      undo: () => {
        set((state) => {
          if (state.past.length === 0) return state;

          const newPast = [...state.past];
          const previous = newPast.pop()!;
          const currentSnapshot: HistorySnapshot = {
            tabs: JSON.parse(JSON.stringify(state.tabs)),
            tabOrder: [...state.tabOrder],
            activeTabId: state.activeTabId
          };

          return {
            past: newPast,
            future: [currentSnapshot, ...state.future],
            tabs: previous.tabs,
            tabOrder: previous.tabOrder,
            activeTabId: previous.activeTabId,
            materiasSelecionadas: getLegacyMapFromTabs(previous.tabs[previous.activeTabId], state.todasMaterias)
          };
        });
      },

      redo: () => {
        set((state) => {
          if (state.future.length === 0) return state;

          const newFuture = [...state.future];
          const next = newFuture.shift()!;
          const currentSnapshot: HistorySnapshot = {
            tabs: JSON.parse(JSON.stringify(state.tabs)),
            tabOrder: [...state.tabOrder],
            activeTabId: state.activeTabId
          };

          return {
            past: [...state.past, currentSnapshot],
            future: newFuture,
            tabs: next.tabs,
            tabOrder: next.tabOrder,
            activeTabId: next.activeTabId,
            materiasSelecionadas: getLegacyMapFromTabs(next.tabs[next.activeTabId], state.todasMaterias)
          };
        });
      },

      // --- Tab Management ---
      addTab: (name) => {
        get().saveHistory();
        set((state) => {
          const newId = `tab-${Date.now()}`;
          return {
            tabs: { ...state.tabs, [newId]: { id: newId, name, courses: {} } },
            tabOrder: [...state.tabOrder, newId],
            activeTabId: newId,
            materiasSelecionadas: new Map()
          };
        });
      },

      removeTab: (id) => {
        get().saveHistory();
        set((state) => {
          const newTabs = { ...state.tabs };
          delete newTabs[id];
          const newOrder = state.tabOrder.filter(tId => tId !== id);
          const newActive = state.activeTabId === id && newOrder.length > 0 ? newOrder[0] : (state.activeTabId === id ? "" : state.activeTabId);

          return {
            tabs: newTabs,
            tabOrder: newOrder,
            activeTabId: newActive,
            materiasSelecionadas: newActive ? getLegacyMapFromTabs(newTabs[newActive], state.todasMaterias) : new Map()
          };
        });
      },

      setActiveTab: (id) => {
        set((state) => ({
          activeTabId: id,
          materiasSelecionadas: getLegacyMapFromTabs(state.tabs[id], state.todasMaterias)
        }));
      },

      // --- Course Actions ---
      addCourse: (course) => {
        get().forceAddCourse(course, false);
      },

      forceAddCourse: (course, isForced = true) => {
        get().saveHistory();
        set((state) => {
          const tabId = state.activeTabId;
          const currentTab = state.tabs[tabId];
          const newTabs = {
            ...state.tabs,
            [tabId]: {
              ...currentTab,
              courses: {
                ...currentTab.courses,
                [course.id]: {
                  id: course.id,
                  forceAdded: true
                }
              }
            }
          };

          const legacyMap = new Map(state.materiasSelecionadas);
          legacyMap.set(course.id, course);

          return {
            tabs: newTabs,
            clashAlert: null,
            materiasSelecionadas: legacyMap
          };
        });
      },

      removeCourse: (courseId) => {
        get().saveHistory();
        set((state) => {
          const tabId = state.activeTabId;
          const currentTab = state.tabs[tabId];

          if (!currentTab.courses[courseId]) return state;
          const newCourses = { ...currentTab.courses };
          delete newCourses[courseId];

          const newTabs = {
            ...state.tabs,
            [tabId]: { ...currentTab, courses: newCourses }
          };

          const legacyMap = new Map(state.materiasSelecionadas);
          legacyMap.delete(courseId);

          return {
            tabs: newTabs,
            materiasSelecionadas: legacyMap
          };
        });
      },

      clearTab: (tabId) => {
        get().saveHistory();
        set((state) => {
          const currentTab = state.tabs[tabId];
          if (!currentTab) return state;

          const newTabs = {
            ...state.tabs,
            [tabId]: { ...currentTab, courses: {} }
          };

          return {
            tabs: newTabs,
            materiasSelecionadas: state.activeTabId === tabId ? new Map() : state.materiasSelecionadas
          };
        });
      },

      dismissClashAlert: () => set({ clashAlert: null }),

      setCustomCourseColor: (tabId, courseId, color) => {
        set((state) => {
          const currentTab = state.tabs[tabId];
          if (!currentTab || !currentTab.courses[courseId]) return state;

          return {
            tabs: {
              ...state.tabs,
              [tabId]: {
                ...currentTab,
                courses: {
                  ...currentTab.courses,
                  [courseId]: { ...currentTab.courses[courseId], customColor: color }
                }
              }
            }
          };
        });
      }
    }),
    {
      name: 'organizador-grade-storage',
      partialize: (state) => ({
        tabs: state.tabs,
        tabOrder: state.tabOrder,
        activeTabId: state.activeTabId,
        palettes: state.palettes,
        activePaletteId: state.activePaletteId,
        autoAssignedColors: state.autoAssignedColors
      })
    }
  )
);

// --- Small Helpers for Legacy Integration ---

function findMateriaById(id: string, periodos?: Periodo): Materia | undefined {
  if (!periodos) return undefined;
  for (const pKey in periodos) {
    const list = periodos[pKey];
    const match = list.find(m => m.id === id);
    if (match) return match;
  }
  return undefined;
}

function getLegacyMapFromTabs(tab: GridTab | undefined, periodos?: Periodo): Map<string, Materia> {
  const map = new Map<string, Materia>();
  if (!tab || !periodos) return map;

  for (const cid in tab.courses) {
    const found = findMateriaById(cid, periodos);
    if (found) {
      map.set(cid, found);
    }
  }
  return map;
}
