import { useContext } from "react";
import { ConfigContext } from "../ConfigContext";

const MateriaCard = ({id, nome }: Materia) => {
    const { todasMaterias, materiasSelecionadas, setMateriasSelecionadas } = useContext(ConfigContext)

    const handleMateria = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        const idSelecionado = event.currentTarget.id
        const materiaAchada = materiasSelecionadas?.filter((materia) => materia.id === idSelecionado)
        
        if(materiaAchada === undefined || materiaAchada.length === 0) {
            const materiaSelecionada = todasMaterias?.filter((materia) => materia.id === idSelecionado)[0]
            if(materiaSelecionada === undefined) return
            setMateriasSelecionadas((prevState) => {
                const materiasSelecionadasNova:Materia[] = []

                if(prevState === undefined){
                    materiasSelecionadasNova.push(materiaSelecionada)
                } else {
                    materiasSelecionadasNova.push(...prevState, materiaSelecionada)
                }

                return materiasSelecionadasNova
            })
            return
        }

        setMateriasSelecionadas((prevState) => {
            const materiasSelecionadasNova = prevState?.filter((materia) => materia.id !== idSelecionado)
            return materiasSelecionadasNova
        })
    }
    
    return (
        <div className='materia-card-tab' key={id} id={id} onClick={(event) => handleMateria(event)}>
            <b>{id}</b>
            <p>{nome}</p>
        </div>
    )
}


export default MateriaCard;