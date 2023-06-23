import { useEffect, useState } from "react";
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
  const materiasSelecionadas = [
    {
      id: "A",
      nome: "materia",
      horarios: {
        seg: { hInicial: 8, horas: 2 },
        qua: { hInicial: 8, horas: 2 }
      }
    },
    {
      id: "B",
      nome: "materia 2",
      horarios: {
        seg: { hInicial: 13, horas: 2 },
        qua: { hInicial: 10, horas: 2 }
      }
    }
  ];
  const [materias] = useState<Materia[]>(materiasSelecionadas);

  const hInicio = 6,
    hFinal = 23,
    intervalo = 1;
  const qtdLinhas = (hFinal - hInicio) / intervalo;
  const [colunaHorarios, setColunaHorarios] = useState<JSX.Element[]>([]);
  const [cards, setCards] = useState<JSX.Element[]>([]);
  const linhas: JSX.Element[] = [];

  for (let i = 0; i <= qtdLinhas; i++) {
    for (let j = 0; j < 7; j++) {
      linhas.push(<div className="card-invisible"></div>);
    }
  }

  // seta a coluna de horários na esquerda
  useEffect(() => {
    const arrHorarios = [];

    for (let i = 0; i <= qtdLinhas; i++) {
      arrHorarios.push(
        <div className="flex items-center justify-center py-1">{`${
          hInicio + i * intervalo
        }:00`}</div>
      );
    }

    setColunaHorarios(arrHorarios);
  }, []);

  // coloca os cards na grade
  useEffect(() => {
    const arrCards: JSX.Element[] = [...cards];

    let count = 0;
    materias.forEach((item) => {
      const horarios = item.horarios;
      for (const key in horarios) {
        const hInicial = horarios[key as keyof typeof horarios]?.hInicial;
        const horas = horarios[key as keyof typeof horarios]?.horas;
        const dia = Dia[key as keyof typeof horarios];

        if (horas == undefined) return;
        if (hInicial == undefined) return;

        arrCards[count] = (
          <Card
            key={`${item.id}+${count}`}
            id={item.id}
            nome={item.nome}
            hInicial={hInicial}
            horas={horas}
            dia={dia}
          />
        );
        count++;
      }
    });

    setCards(arrCards);
  }, [materias]);

  return (
    <div className="flex flex-col ">
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
          {colunaHorarios.map((item, i) => (
            <div key={i}>{item}</div>
          ))}
        </div>

        <div className="grade">
          <div className="linhas">{linhas.flat()}</div>
          {cards.flat()}
        </div>
      </div>
    </div>
  );
};

export default Grade;
