import { createContext, Dispatch, SetStateAction } from "react";

interface IConfigContext {
    checkLinhas: boolean,
    setCheckLinhas: Dispatch<SetStateAction<boolean>>,

    sidebar: boolean,
    setSidebar: Dispatch<SetStateAction<boolean>>,

    isSidebarMateria: boolean,
    setIsSidebarMateria: Dispatch<SetStateAction<boolean>>,

    todasMaterias: Periodo | undefined,
    setTodasMaterias: Dispatch<SetStateAction<Periodo | undefined>>,

    materiasSelecionadas: Materia[] | undefined,
    setMateriasSelecionadas: Dispatch<SetStateAction<Materia[] | undefined>>,
}

export const ConfigContext = createContext<IConfigContext>({
    checkLinhas: false,
    setCheckLinhas: () => { /* nada acontece feijoada */},
    sidebar: true,
    setSidebar: () => {  },
    isSidebarMateria: true,
    setIsSidebarMateria: () => {  },
    todasMaterias: {},
    setTodasMaterias: () => {  },
    materiasSelecionadas: [],
    setMateriasSelecionadas: () => {  },
})