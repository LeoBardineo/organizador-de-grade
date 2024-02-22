interface MateriaCard {
  id: string;
  nome: string;
  hInicial: number;
  horas: number;
  dia: number;
  qtdSobreposicao: number;
  sobreposicoes: [string, number][];
}

const Card = ({ id, nome, hInicial, horas, dia, qtdSobreposicao, sobreposicoes }: MateriaCard) => {
  const sobreposicoesSorted = sobreposicoes.sort((materia1, materia2) => {
    if(materia1[1] === materia2[1]) return materia1[0].localeCompare(materia2[0])
    return materia1[1] - materia2[1]
  })
  const numMargin = sobreposicoesSorted.findIndex(materia => (materia[0] === id ))
  const marginL = qtdSobreposicao > 0 && numMargin > 0 ? 128/(qtdSobreposicao+1) * numMargin : 0
  
  return (
    <div
      style={{zIndex: 2,
              gridRowStart: hInicial - 5,
              gridRowEnd: hInicial - 5 + horas,
              gridColumnStart: dia + 1,}}
    >
      <div
      className='card bg-red-500'
      style={{
          width: 128 / (qtdSobreposicao + 1),
          marginLeft: marginL
        }}>
        <h1>{id}</h1>
        {horas > 1 ? <h2>{nome}</h2> : ''}
      </div>
    </div>
  );
};

export default Card;
