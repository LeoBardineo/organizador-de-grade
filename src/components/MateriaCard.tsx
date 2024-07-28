import { useContext } from "react";
import { ConfigContext } from "../ConfigContext";

const MateriaCard = ({id, nome}: Materia) => {
    const { todasMaterias, materiasSelecionadas, setMateriasSelecionadas } = useContext(ConfigContext)

    const handleMateria = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        const idSelecionado = event.currentTarget.id
        const materiaAchada = materiasSelecionadas?.filter((materia) => materia.id === idSelecionado)
        
        if(todasMaterias != undefined && (materiaAchada === undefined || materiaAchada.length === 0)) {
            let materiaFoiSelecionada = false
            Object.keys(todasMaterias).map(periodo => {
                if(materiaFoiSelecionada) return
                const materiaSelecionada = todasMaterias[periodo]?.filter((materia) => materia.id === idSelecionado)[0]
                console.log(materiaSelecionada)
                if(materiaSelecionada === undefined) return
                materiaFoiSelecionada = true
                setMateriasSelecionadas((prevState) => {
                    const materiasSelecionadasNova:Materia[] = []
    
                    if(prevState === undefined){
                        materiasSelecionadasNova.push(materiaSelecionada)
                    } else {
                        materiasSelecionadasNova.push(...prevState, materiaSelecionada)
                    }
    
                    return materiasSelecionadasNova
                })
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