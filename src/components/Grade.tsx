import { useEffect, useState, useContext } from "react";
import { ConfigContext } from "../ConfigContext";
import Card from "./Card";
import axios from "axios";

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
  const { checkLinhas } = useContext(ConfigContext);
  const materiasSelecionadas: Materia[] = [
    // {
    //   id: "A",
    //   nome: "materia asdasdasdasdasdasd",
    //   horarios: [
    //     { dia: "seg", hInicial: 8, horas: 2 },
    //     { dia: "qua", hInicial: 8, horas: 2 }
    //   ]
    // },
    // {
    //   id: "B",
    //   nome: "materia 2",
    //   horarios: [
    //     { dia: "seg", hInicial: 13, horas: 2 },
    //     { dia: "seg", hInicial: 22, horas: 1 },
    //     { dia: "qua", hInicial: 10, horas: 2 }
    //   ]
    // }
    // {id:"ICP145",nome:"Habilidades Sociais p Trabalho",horarios:[{dia:"ter",hInicial:10,horas:2},{dia:"qua",hInicial:9,horas:3}]},
    {"id":"ICP246","nome":"Arquitet Comput e Sist Operac","horarios":[{"dia":"ter","hInicial":8,"horas":4},{"dia":"qua","hInicial":8,"horas":4},{"dia":"qui","hInicial":8,"horas":4}]}
  ];
  const [materias, setMaterias] = useState<Materia[]>(materiasSelecionadas);
  const [todasMaterias, setTodasMaterias] = useState<Materia[]>();

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
    const fetchMaterias = async () => {
      const result = await axios('http://localhost:5173/.cache/materias.json')
      setTodasMaterias(result.data)
      console.log(todasMaterias)
    }

    const arrHorarios = [];

    for (let i = 0; i <= qtdLinhas; i++) {
      arrHorarios.push(
        <div className="flex items-center justify-center">{`${
          hInicio + i * intervalo
        }:00`}</div>
      );
    }

    setColunaHorarios(arrHorarios);
    fetchMaterias();
  }, []);

  // coloca os cards na grade
  useEffect(() => {
    const arrCards: JSX.Element[] = [...cards];

    let count = 0;
    materias.forEach((item) => {
      const horarios = item.horarios;
      horarios.forEach(horario => {
        const dia = horario.dia
        const hInicial = horario.hInicial
        const horas = horario.horas
        
        if(horas === undefined || hInicial === undefined || dia === undefined) return

        arrCards[count] = (
          <Card
            key={`${item.id}+${count}`}
            id={item.id}
            nome={item.nome}
            hInicial={hInicial}
            horas={horas}
            dia={Dia[dia]}
          />
        );
        count++;
      })
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
