import { useEffect, useState } from "react";
import Card from "./Card";

interface Horario {
  hInicial: number;
  horas: number;
}

interface IMateria {
  id: string;
  nome: string;
  horarios: {
    dom?: Horario;
    seg?: Horario;
    ter?: Horario;
    qua?: Horario;
    qui?: Horario;
    sex?: Horario;
    sab?: Horario;
  };
}

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
  const [materias] = useState<IMateria[]>(materiasSelecionadas);

  const hInicio = 6,
    hFinal = 23,
    intervalo = 1;
  const qtdLinhas = (hFinal - hInicio) / intervalo;
  const [colunaHorarios, setColunaHorarios] = useState<JSX.Element[]>([]);
  const [cards, setCards] = useState<JSX.Element[]>([]);

  // useEffect inicial
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

  // useEffect materias
  useEffect(() => {
    console.log(cards.length);
    // if (!arr2.length) return;

    const arrCards: JSX.Element[] = [...cards];

    let count = 0;
    materias.forEach((item) => {
      const horarios = item.horarios;
      for (const key in horarios) {
        const hInicial = horarios[key as keyof typeof horarios]?.hInicial;
        const horas = horarios[key as keyof typeof horarios]?.horas;

        if (horas == undefined) return;
        if (hInicial == undefined) return;

        const jump = Dia[key as keyof typeof horarios] + 1;
        arrCards[count] = (
          <Card
            key={`${item.id}+${count}`}
            id={item.id}
            nome={item.nome}
            hInicial={hInicial - 5}
            horas={horas}
            jump={jump}
          />
        );
        count++;
      }
    });

    setCards(arrCards);
  }, [materias]);

  return (
    <div className="flex flex-col ">
      <div className="flex gap-5 border-b-2 py-6">
        <div className="w-32"></div>

        <div className="flex gap-x-5">
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

      <div className="flex gap-5">
        <div className="">
          <div className="w-32 text-base font-bold text-neutral-800">
            {colunaHorarios.map((item, i) => (
              <div key={i}>{item}</div>
            ))}
          </div>
        </div>

        <div className="grade">{cards.flat()}</div>
      </div>
    </div>
  );
};

export default Grade;
