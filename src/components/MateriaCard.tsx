const MateriaCard = ({id, nome, horarios}: Materia) => {
    return (
        <div>
            <p>{id}</p> <br/>
            <p>{nome}</p>
        </div>
    )
}

export default MateriaCard;