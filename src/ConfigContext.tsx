import { createContext, Dispatch, SetStateAction } from "react";

interface IConfigContext {
    checkLinhas: boolean,
    setCheckLinhas: Dispatch<SetStateAction<boolean>>
}

export const ConfigContext = createContext<IConfigContext>({
    checkLinhas: false,
    setCheckLinhas: () => { /* nada acontece feijoada */}
})