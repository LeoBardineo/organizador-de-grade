import axios from "axios";
import { useEffect, useState } from "react";
import MateriaCard from "./MateriaCard";

const MateriasTab = () => {
    const [todasMaterias, setTodasMaterias] = useState<Materia[]>();
    const [todosMateriasCards, setTodosMateriasCards] = useState<JSX.Element[]>();

    useEffect(() => {
        const fetchMaterias = async () => {
            const result = await axios(`${window.location.href}.cache/materias.json`)
            setTodasMaterias(result.data)
            
            const todosCards:JSX.Element[] = []
            todasMaterias?.forEach(({id, nome, horarios}) => {
                todosCards.push(<MateriaCard id={id} nome={nome} horarios={horarios} />)
            })
            setTodosMateriasCards(todosCards)
        }

        fetchMaterias();
    }, [])

    return (
        <>
            {todosMateriasCards?.flat()}
        </>
    )
}

export default MateriasTab;