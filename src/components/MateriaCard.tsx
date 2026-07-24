import { useStore } from "../store";
import { RiCheckLine, RiTimeLine } from "react-icons/ri";

const MateriaCard = ({ id, nome, horarios }: Materia) => {
    const toggleMateria = useStore(state => state.toggleMateria);
    const materiasSelecionadas = useStore(state => state.materiasSelecionadas);
    const autoAssignedColors = useStore(state => state.autoAssignedColors);

    const isSelected = materiasSelecionadas.has(id);
    const color = autoAssignedColors[id] || '#ef4444';

    const handleMateria = () => {
        toggleMateria({ id, nome, horarios });
    }

    return (
        <div
            className={`materia-card-tab cursor-pointer relative p-3 rounded-md transition-all border ${isSelected ? 'opacity-40 grayscale border-white scale-[0.98]' : 'border-transparent shadow-sm hover:brightness-110 shadow-md'}`}
            style={{ backgroundColor: color, color: '#ffffff' }}
            onClick={handleMateria}
        >
            <div className="flex justify-between items-start">
                <b className="text-[13px] flex-1 font-bold">{id}</b>
                {isSelected && (
                    <span className="flex text-white mix-blend-overlay ml-2 flex-shrink-0 animate-pulse">
                        <RiCheckLine className="text-xl font-bold drop-shadow-md" title="Presente na grade principal" />
                    </span>
                )}
            </div>
            <p className="text-xs mt-1 leading-tight font-medium opacity-90">{nome}</p>

            {/* Horários */}
            {horarios && horarios.length > 0 && (
                <div className="mt-2 text-[11px] opacity-75 flex flex-col gap-0.5">
                    {horarios.map((h, idx) => {
                        const hFim = h.hInicial + h.horas;
                        const dia = h.dia.charAt(0).toUpperCase() + h.dia.slice(1);
                        return (
                            <div key={idx} className="flex items-center gap-1 leading-none">
                                <RiTimeLine />
                                <span>{dia} {h.hInicial}h-{hFim}h</span>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}

export default MateriaCard;