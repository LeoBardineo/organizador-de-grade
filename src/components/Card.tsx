import { useStore } from "../store";
import { RiCloseCircleLine } from "react-icons/ri";

interface MateriaCard {
  id: string;
  nome: string;
  hInicial: number;
  horas: number;
  colunaIndex: number;
  qtdSobreposicao: number;
  sobreposicoes: [string, number][];
}

const Card = ({ id, nome, hInicial, horas, colunaIndex, qtdSobreposicao, sobreposicoes }: MateriaCard) => {
  const removeCourse = useStore(state => state.removeCourse);
  const autoAssignedColors = useStore(state => state.autoAssignedColors);

  const color = autoAssignedColors[id] || '#ef4444'; // default to red fallback

  const sobreposicoesSorted = sobreposicoes.sort((materia1, materia2) => {
    if (materia1[1] === materia2[1]) return materia1[0].localeCompare(materia2[0])
    return materia1[1] - materia2[1]
  })

  const numMargin = sobreposicoesSorted.findIndex(materia => (materia[0] === id))
  const marginL = qtdSobreposicao > 0 && numMargin > 0 ? 128 / (qtdSobreposicao + 1) * numMargin : 0

  return (
    <div
      className="group relative"
      style={{
        zIndex: 2,
        gridRowStart: hInicial - 5,
        gridRowEnd: hInicial - 5 + horas,
        gridColumnStart: colunaIndex + 1,
        pointerEvents: 'none'
      }}
    >
      <div
        className='card transition-all group-hover:brightness-90 relative overflow-hidden flex flex-col justify-between cursor-pointer shadow-md'
        title="Remover turma"
        onClick={() => removeCourse(id)}
        style={{
          backgroundColor: color,
          width: 128 / (qtdSobreposicao + 1),
          height: '100%',
          marginLeft: marginL,
          color: '#ffffff',
          pointerEvents: 'auto'
        }}>
        <div className="z-10 relative">
          <h1 className="font-bold text-[13px]">{id}</h1>
          {horas > 1 ? <h2 className="text-[11px] leading-tight font-medium opacity-90">{nome}</h2> : ''}
        </div>

        {/* Overlay Hover Icon for UX */}
        <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20">
          <RiCloseCircleLine className="text-white text-3xl opacity-80 drop-shadow-md" />
        </div>
      </div>
    </div>
  );
};

export default Card;
