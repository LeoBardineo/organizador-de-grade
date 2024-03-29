import { useEffect, useState, useContext } from "react";
import { ConfigContext } from "../ConfigContext";
import Card from "./Card";

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
  const { checkLinhas, materiasSelecionadas } = useContext(ConfigContext);
  const { setTodasMaterias } = useContext(ConfigContext)
  const [colunaHorarios, setColunaHorarios] = useState<JSX.Element[]>([]);
  const [cards, setCards] = useState<JSX.Element[]>([]);

  const hInicio = 6, hFinal = 23, intervalo = 1;
  const qtdLinhas = (hFinal - hInicio) / intervalo;

  const linhas: JSX.Element[] = [];
  for (let i = 0; i <= qtdLinhas; i++) {
    for (let j = 0; j < 7; j++) {
      linhas.push(<div className="card-invisible"></div>);
    }
  }

  // seta a coluna de horários na esquerda e dá fetch em todas as matérias
  useEffect(() => {
    const arrHorarios = [];

    for (let i = 0; i <= qtdLinhas; i++) {
      arrHorarios.push(
        <div className="flex items-center justify-center">{`${
          hInicio + i * intervalo
        }:00`}</div>
      );
    }

    setColunaHorarios(arrHorarios);

    const fetchMaterias = async () => {
        const result = await fetch(`${window.location.href}.cache/materias.json`)
        const json = await result.json()
        setTodasMaterias(json)
    }

    fetchMaterias();
  }, []);

  // coloca os cards na grade
  useEffect(() => {
    const arrCards: JSX.Element[] = [];

    let count = 0;
    if(materiasSelecionadas === undefined) return
    materiasSelecionadas.forEach((materia1) => {
      const { id, nome, horarios } = materia1
      horarios.forEach(horario => {
        let sobreposicoes: [string, number][] = []
        const { dia, hInicial, horas } = horario
        
        if(horas === undefined || hInicial === undefined || dia === undefined) return
        sobreposicoes.push([id, hInicial])
        let qtdSobreposicao = 0
        materiasSelecionadas.forEach((materia2) => {
          materia2.horarios.forEach(horario2 => {
            if(materia2.id === id || horario2.dia !== dia) return

            const hInicial2 = horario2.hInicial
            const fimMateria2 = horario2.hInicial + horario2.horas
            const fimMateria1 = hInicial + horas

            if(
              (fimMateria1 > hInicial2 && fimMateria1 <= fimMateria2) ||
              (hInicial <= hInicial2 && fimMateria1 >= fimMateria2))
            {
              sobreposicoes.push([materia2.id, hInicial2])
              qtdSobreposicao += 1
            }
          })
        })

        arrCards[count] = (
          <Card
            key={`${id}+${count}`}
            id={id}
            nome={nome}
            hInicial={hInicial}
            horas={horas}
            dia={Dia[dia]}
            qtdSobreposicao={qtdSobreposicao}
            sobreposicoes={sobreposicoes}
          />
        );
        count++;
      })
    });
    
    setCards(arrCards);
  }, [materiasSelecionadas]);

  return (
    <div className="flex flex-col rounded-md bg-neutral-50 shadow-lg ">
      <div className="flex border-b-2 py-6">
        <div className="w-32"></div>

        <div className="flex">
          <div className="flex w-32 items-center justify-center text-base font-bold text-neutral-800">
            DOM
          </div>
          <div className="flex w-32 items-center justify-center text-base font-bold text-neutral-800">
            SEG
          </div>
          <div className="flex w-32 items-center justify-center text-base font-bold text-neutral-800">
            TER
          </div>
          <div className="flex w-32 items-center justify-center text-base font-bold text-neutral-800">
            QUA
          </div>
          <div className="flex w-32 items-center justify-center text-base font-bold text-neutral-800">
            QUI
          </div>
          <div className="flex w-32 items-center justify-center text-base font-bold text-neutral-800">
            SEX
          </div>
          <div className="flex w-32 items-center justify-center text-base font-bold text-neutral-800">
            SAB
          </div>
        </div>
      </div>

      <div className="flex">
        <div className="coluna-horarios w-32 text-base font-bold text-neutral-800">
          {colunaHorarios.map((item) => (
            item
          ))}
        </div>

        <div className={checkLinhas ? "grade checkLinhas" : "grade"}>
          <div className={checkLinhas ? "linhas checkLinhas" : "linhas"}>{linhas.flat()}</div>
          {cards.flat()}
        </div>
      </div>
    </div>
  );
};

export default Grade;
