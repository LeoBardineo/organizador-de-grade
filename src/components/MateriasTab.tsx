import { useState, useEffect, useMemo } from "react";
import { useStore } from "../store";
import MateriaCard from "./MateriaCard";
import { RiArrowDownSLine, RiArrowRightSLine } from "react-icons/ri";

interface IDropdown {
    [key: string]: boolean
}

const MateriasTab = () => {
    const todasMaterias = useStore(state => state.todasMaterias);
    const loadTodasMaterias = useStore(state => state.loadTodasMaterias);

    const [dropdown, setDropdown] = useState<IDropdown>({});

    // State local dos filtros
    const [searchName, setSearchName] = useState("");
    const [searchId, setSearchId] = useState("");
    const [searchDay, setSearchDay] = useState("");
    const [searchStart, setSearchStart] = useState("");
    const [searchEnd, setSearchEnd] = useState("");

    useEffect(() => {
        if (!todasMaterias) {
            loadTodasMaterias();
        } else {
            const dropdownInicial: IDropdown = {}
            Object.keys(todasMaterias).forEach((periodo) => {
                dropdownInicial[periodo] = false
            })
            setDropdown(dropdownInicial)
        }
    }, [todasMaterias, loadTodasMaterias])

    const handleDropdown = (periodo: string) => {
        setDropdown((prevDropdown) => {
            return { ...prevDropdown, [periodo]: !prevDropdown[periodo] };
        });
    }

    // Filtragem Multi-dimensional Reativa
    const filtradas = useMemo(() => {
        if (!todasMaterias) return {};

        const result: typeof todasMaterias = {};

        Object.keys(todasMaterias).forEach(periodo => {
            const materias = todasMaterias[periodo].filter(m => {
                if (searchName && !m.nome.toLowerCase().includes(searchName.toLowerCase())) return false;
                if (searchId && !m.id.toLowerCase().includes(searchId.toLowerCase())) return false;

                if (searchDay || searchStart || searchEnd) {
                    const matchHorario = m.horarios.some(h => {
                        if (searchDay && h.dia !== searchDay) return false;

                        const sStart = searchStart ? parseInt(searchStart.split(":")[0]) : null;
                        const sEnd = searchEnd ? parseInt(searchEnd.split(":")[0]) : null;
                        const mStart = h.hInicial;
                        const mEnd = h.hInicial + h.horas;

                        if (sStart !== null && mStart !== sStart) return false;
                        if (sEnd !== null && mEnd !== sEnd) return false;

                        return true;
                    });
                    if (!matchHorario) return false;
                }

                return true;
            });

            if (materias.length > 0) {
                result[periodo] = materias;
            }
        });

        return result;
    }, [todasMaterias, searchName, searchId, searchDay, searchStart, searchEnd]);

    return (
        <div className="flex flex-col gap-4 h-full pb-10 relative">
            <style>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background-color: #cbd5e1;
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background-color: #94a3b8;
                }
            `}</style>

            {/* PAINEL DE FILTROS: UI */}
            <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg flex flex-col gap-2 shadow-sm border border-gray-200">
                <h4 className="font-semibold text-sm mb-1 text-gray-700 dark:text-gray-200">Filtros de Pesquisa</h4>
                <input
                    type="text"
                    placeholder="Buscar por Nome..."
                    className="p-1.5 text-sm border bg-white dark:bg-gray-700 dark:text-white dark:border-gray-600 rounded outline-none focus:border-blue-400 w-full"
                    value={searchName}
                    onChange={e => setSearchName(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Buscar por Código/ID..."
                    className="p-1.5 text-sm border bg-white dark:bg-gray-700 dark:text-white dark:border-gray-600 rounded outline-none focus:border-blue-400 w-full"
                    value={searchId}
                    onChange={e => setSearchId(e.target.value)}
                />

                <div className="grid grid-cols-3 gap-2">
                    <select
                        className="p-1.5 text-sm border bg-white dark:bg-gray-700 dark:text-white dark:border-gray-600 rounded outline-none focus:border-blue-400 w-full"
                        value={searchDay}
                        onChange={e => setSearchDay(e.target.value)}
                    >
                        <option value="">Dia</option>
                        <option value="seg">Seg</option>
                        <option value="ter">Ter</option>
                        <option value="qua">Qua</option>
                        <option value="qui">Qui</option>
                        <option value="sex">Sex</option>
                        <option value="sab">Sab</option>
                    </select>
                    <input
                        type="time"
                        className="p-1.5 text-sm border bg-white dark:bg-gray-700 dark:text-white dark:border-gray-600 rounded outline-none focus:border-blue-400 w-full text-center"
                        value={searchStart}
                        title="Horário Início"
                        onChange={e => setSearchStart(e.target.value)}
                    />
                    <input
                        type="time"
                        className="p-1.5 text-sm border bg-white dark:bg-gray-700 dark:text-white dark:border-gray-600 rounded outline-none focus:border-blue-400 w-full text-center"
                        value={searchEnd}
                        title="Horário Fim"
                        onChange={e => setSearchEnd(e.target.value)}
                    />
                </div>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 custom-scrollbar pl-1 pr-2">
                {Object.keys(filtradas).map((periodo) => {
                    // Auto extend dropdown if user is currently filtering actively
                    const isFiltering = searchName || searchId || searchDay || searchStart || searchEnd;
                    const isDropdownOpen = dropdown[periodo] || isFiltering;

                    const materiasDoPeriodo = filtradas[periodo].map(({ id, nome, horarios }) => (
                        <MateriaCard key={id} id={id} nome={nome} horarios={horarios} />
                    ));

                    return (
                        <div key={periodo} className="border border-gray-100 rounded bg-white dark:bg-gray-800">
                            <div
                                className='flex items-center justify-between cursor-pointer p-2 hover:bg-gray-50 transition-colors rounded select-none'
                                onClick={() => handleDropdown(periodo)}
                            >
                                <h3 className="font-bold text-sm text-gray-700 dark:text-gray-200">{periodo}</h3>
                                <div className="text-gray-500">
                                    {isDropdownOpen ? <RiArrowDownSLine size={20} /> : <RiArrowRightSLine size={20} />}
                                </div>
                            </div>
                            {isDropdownOpen && (
                                <div className="flex flex-col gap-2 p-2">
                                    {materiasDoPeriodo}
                                </div>
                            )}
                        </div>
                    );
                })}
                {Object.keys(filtradas).length === 0 && (
                    <div className="text-center p-4 text-sm text-gray-400 font-medium">Nenhuma matéria satisfaz o filtro.</div>
                )}
            </div>
        </div>
    )
}

export default MateriasTab;