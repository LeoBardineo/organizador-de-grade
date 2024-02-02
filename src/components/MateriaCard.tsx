const MateriaCard = ({id, nome, horarios}: Materia) => {
    const handleAddMateria = () => {
        
    }

    return (
        <div className='materia-card-tab' onClick={handleAddMateria}>
            <b>{id}</b>
            <p>{nome}</p>
        </div>
    )
}


export default MateriaCard;