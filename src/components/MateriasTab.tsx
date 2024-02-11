import { useContext, useEffect, useState } from "react";
import { ConfigContext } from "../ConfigContext";
import MateriaCard from "./MateriaCard";

const MateriasTab = () => {
    const { todasMaterias } = useContext(ConfigContext);

    return (
        <div>
            {todasMaterias?.map(({id, nome, horarios}) => <MateriaCard key={id} id={id} nome={nome} horarios={horarios} />)}
        </div>
    )
}

export default MateriasTab;