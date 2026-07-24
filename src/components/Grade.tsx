import { useEffect, useState } from "react";
import { useStore } from "../store";
import Card from "./Card";
import { RiLayoutGridLine, RiListCheck, RiTimeLine } from "react-icons/ri";

enum Dia {
  dom = 0,
  seg = 1,
  ter = 2,
  qua = 3,
  qui = 4,
  sex = 5,
  sab = 6
}

const Grade = () => {
  const checkLinhas = useStore(state => state.checkLinhas);
  const materiasSelecionadas = useStore(state => state.materiasSelecionadas);
  const todasMaterias = useStore(state => state.todasMaterias);
  const loadTodasMaterias = useStore(state => state.loadTodasMaterias);
  const autoAssignedColors = useStore(state => state.autoAssignedColors);

  const [viewMode, setViewMode] = useState<'matriz' | 'lista'>('matriz');

  useEffect(() => {
    if (!todasMaterias) {
      loadTodasMaterias();
    }
  }, [todasMaterias, loadTodasMaterias]);

  const selecionadasArr = Array.from(materiasSelecionadas.values());

  const hInicio = 6, intervalo = 1;
  let hFinal = 23;
  selecionadasArr.forEach(m => {
    m.horarios.forEach(h => {
      if (h.hInicial !== undefined && h.horas !== undefined && h.hInicial + h.horas > hFinal) {
        hFinal = h.hInicial + h.horas;
      }
    });
  });
  const qtdLinhas = Math.max(1, (hFinal - hInicio) / intervalo);

  // Logic for weekend detection
  let hasDom = false;
  let hasSab = false;

  selecionadasArr.forEach(m => {
    m.horarios.forEach(h => {
      if (h.dia === 'dom') hasDom = true;
      if (h.dia === 'sab') hasSab = true;
    });
  });

  const daysMap = [
    { key: 'dom', label: 'DOM', active: hasDom },
    { key: 'seg', label: 'SEG', active: true },
    { key: 'ter', label: 'TER', active: true },
    { key: 'qua', label: 'QUA', active: true },
    { key: 'qui', label: 'QUI', active: true },
    { key: 'sex', label: 'SEX', active: true },
    { key: 'sab', label: 'SAB', active: hasSab }
  ];
  const activeDays = daysMap.filter(d => d.active);
  const totalCols = activeDays.length;

  // Render linhas vazias
  const linhas: JSX.Element[] = [];
  for (let i = 0; i <= qtdLinhas; i++) {
    for (let j = 0; j < totalCols; j++) {
      linhas.push(<div key={`linha-${i}-${j}`} className="card-invisible"></div>);
    }
  }

  // Render coluna horários
  const colunaHorarios: JSX.Element[] = [];
  for (let i = 0; i <= qtdLinhas; i++) {
    colunaHorarios.push(
      <div key={`hr-${i}`} className="flex items-start justify-center font-bold text-gray-500 text-xs px-2" style={{ gridRow: i + 1 }}>
        <span className="-mt-2">{`${hInicio + i * intervalo}:00`}</span>
      </div>
    );
  }

  // Computando cards e agrupadores
  const cards: JSX.Element[] = [];
  let count = 0;

  const listViewData: Record<string, typeof selecionadasArr> = {};
  activeDays.forEach(d => listViewData[d.key] = []);

  selecionadasArr.forEach((materia1) => {
    const { id, nome, horarios } = materia1;
    horarios.forEach(horario => {
      let sobreposicoes: [string, number][] = [];
      const { dia, hInicial, horas } = horario;

      if (horas === undefined || hInicial === undefined || dia === undefined) return;

      if (listViewData[dia]) {
        listViewData[dia].push(materia1);
      }

      sobreposicoes.push([id, hInicial]);
      let qtdSobreposicao = 0;

      selecionadasArr.forEach((materia2) => {
        materia2.horarios.forEach(horario2 => {
          if (materia2.id === id || horario2.dia !== dia) return;
          const hInicial2 = horario2.hInicial;
          const fimMateria2 = horario2.hInicial + horario2.horas;
          const fimMateria1 = hInicial + horas;

          if (
            (fimMateria1 > hInicial2 && fimMateria1 <= fimMateria2) ||
            (hInicial <= hInicial2 && fimMateria1 >= fimMateria2)
          ) {
            sobreposicoes.push([materia2.id, hInicial2]);
            qtdSobreposicao += 1;
          }
        });
      });

      const activeDiaIndex = activeDays.findIndex(d => d.key === dia);

      if (activeDiaIndex !== -1) {
        cards.push(
          <Card
            key={`${id}-${dia}-${hInicial}-${count}`}
            id={id}
            nome={nome}
            hInicial={hInicial}
            horas={horas}
            colunaIndex={activeDiaIndex}
            qtdSobreposicao={qtdSobreposicao}
            sobreposicoes={sobreposicoes}
          />
        );
      }
      count++;
    });
  });

  return (
    <div className="flex flex-col gap-4 w-[850px] shrink-0 p-4 h-[750px] bg-slate-50 shadow-inner rounded-l-xl">
      <style>{`
          .custom-scrollbar::-webkit-scrollbar { height: 8px; width: 8px; }
          .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
          .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #cbd5e1; border-radius: 10px; }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover { background-color: #94a3b8; }
      `}</style>

      {/* Area Superior / Toggles */}
      <div className="flex justify-between items-center shrink-0">
        <h2 className="text-xl font-black text-gray-800 tracking-tight">Grade de Aulas</h2>
        <div className="flex gap-2">
          <button
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-semibold transition-colors ${viewMode === 'matriz' ? 'bg-gray-800 text-white shadow-sm' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
            onClick={() => setViewMode('matriz')}
          >
            <RiLayoutGridLine size={18} />
            Matriz
          </button>
          <button
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-semibold transition-colors ${viewMode === 'lista' ? 'bg-gray-800 text-white shadow-sm' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
            onClick={() => setViewMode('lista')}
          >
            <RiListCheck size={18} />
            Agenda
          </button>
        </div>
      </div>

      {viewMode === 'matriz' ? (
        <div className="flex flex-col rounded-xl bg-white shadow-sm overflow-hidden border border-gray-200">
          <div className="flex border-b border-gray-200 py-3 bg-gray-50/50 min-w-max">
            <div className="w-16 shrink-0 border-r border-transparent"></div>
            <div className="flex">
              {activeDays.map(d => (
                <div key={d.key} className="flex w-32 items-center justify-center text-[13px] tracking-wide font-bold text-gray-500 uppercase">
                  {d.label}
                </div>
              ))}
            </div>
          </div>

          {/* Scrollable Container */}
          <div className="overflow-auto pb-6 custom-scrollbar max-w-full">
            <div className="flex min-w-max mt-2">
              {/* Escopo da Esquerda */}
              <div
                className="coluna-horarios w-16 bg-white shrink-0 grid"
                style={{ gridTemplateRows: `repeat(${qtdLinhas + 1}, 32px)` }}
              >
                {colunaHorarios}
              </div>

              {/* Grid Matriz Central Injetada Inline (ignora o CSS externo fixo) */}
              <div
                className={`grade relative border-l border-gray-100 ${checkLinhas ? "checkLinhas" : ""}`}
                style={{ gridTemplateColumns: `repeat(${totalCols}, 8rem)`, width: `${totalCols * 8}rem`, gridTemplateRows: `repeat(${qtdLinhas + 1}, 32px)` }}
              >
                <div
                  className={`linhas ${checkLinhas ? "checkLinhas" : ""}`}
                  style={{ gridTemplateColumns: `repeat(${totalCols}, minmax(0, 1fr))`, gridTemplateRows: `repeat(${qtdLinhas + 1}, minmax(0, 1fr))` }}
                >
                  {linhas}
                </div>
                {cards}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-6 overflow-y-auto custom-scrollbar pb-10 flex-1">
          {activeDays.map(d => {
            const sortedMaterias = Array.from(new Set(listViewData[d.key]))
              .sort((a, b) => {
                const ha = a.horarios.find(h => h.dia === d.key)?.hInicial || 0;
                const hb = b.horarios.find(h => h.dia === d.key)?.hInicial || 0;
                return ha - hb;
              });

            return (
              <div key={d.key} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col shrink-0">
                <div className="bg-gray-50 border-b border-gray-200 p-3 font-bold text-gray-700 uppercase tracking-widest text-xs px-5">
                  {d.label}
                </div>
                <div className="p-4 flex flex-col gap-3">
                  {sortedMaterias.length === 0 ? (
                    <p className="text-gray-400 text-sm italic px-2">Sem aulas planejadas.</p>
                  ) : (
                    sortedMaterias.map((m, idx) => {
                      const color = autoAssignedColors[m.id] || '#ef4444';
                      const hMatch = m.horarios.find(h => h.dia === d.key);
                      return (
                        <div key={`${m.id}-${idx}`} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 border border-gray-100 rounded-lg shadow-sm hover:shadow-md transition-shadow bg-white relative overflow-hidden group">
                          <div className="absolute left-0 top-0 bottom-0 w-1.5" style={{ backgroundColor: color }}></div>
                          <div className="pl-3">
                            <b className="text-sm text-gray-800">{m.id}</b>
                            <p className="text-gray-600 font-medium text-[13px]">{m.nome}</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="text-xs font-bold mt-2 sm:mt-0 px-3 py-1.5 rounded bg-gray-100/80 text-gray-600 flex items-center gap-1.5 shrink-0 border border-gray-200">
                              <RiTimeLine size={14} />
                              {hMatch?.hInicial}h - {hMatch!.hInicial + hMatch!.horas}h
                            </div>
                          </div>
                        </div>
                      )
                    })
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  );
};

export default Grade;
