import { createContext, Dispatch, SetStateAction } from "react";

interface IConfigContext {
    checkLinhas: boolean,
    setCheckLinhas: Dispatch<SetStateAction<boolean>>,
    sidebar: boolean,
    setSidebar: Dispatch<SetStateAction<boolean>>,
    isSidebarMateria: boolean,
    setIsSidebarMateria: Dispatch<SetStateAction<boolean>>,
    todosMateriasCards: JSX.Element[] | undefined,
    setTodosMateriasCards: Dispatch<SetStateAction<JSX.Element[] | undefined>>
}

export const ConfigContext = createContext<IConfigContext>({
    checkLinhas: false,
    setCheckLinhas: () => { /* nada acontece feijoada */},
    sidebar: true,
    setSidebar: () => {  },
    isSidebarMateria: true,
    setIsSidebarMateria: () => {  },
    todosMateriasCards: [],
    setTodosMateriasCards: () => {  }
})