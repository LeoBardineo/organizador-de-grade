import { useEffect, useState } from "react";

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
        seg: { hInicial: 10, horas: 2 },
        qua: { hInicial: 10, horas: 2 }
      }
    }
  ];
  const [materias] = useState<IMateria[]>(materiasSelecionadas);

  const hInicio = 6,
    hFinal = 23,
    intervalo = 1;
  const qtdLinhas = (hFinal - hInicio) / intervalo;
  const [arr, setArr] = useState<JSX.Element[]>([]);
  const [arr2, setArr2] = useState<JSX.Element[][]>([]);

  // useEffect inicial
  useEffect(() => {
    const tarr = [];
    const tarr2 = [];

    for (let i = 0; i <= qtdLinhas; i++) {
      tarr.push(<div className="">{hInicio + i * intervalo}</div>);
    }

    let count = 0;
    for (let i = 0; i <= qtdLinhas; i++) {
      const newArr = [];
      for (let j = 0; j < 7; j++) {
        newArr.push(<div className="">{++count}</div>);
      }

      tarr2.push(newArr);
    }
    setArr(tarr);
    setArr2(tarr2);
  }, []);

  // useEffect materias
  useEffect(() => {
    console.log(arr2.length);
    if (!arr2.length) return;

    const newArr = [...arr2];

    materias.forEach((item) => {
      const horarios = item.horarios;
      for (const key in horarios) {
        const horas = horarios[key as keyof typeof horarios]?.horas;

        if (horas == undefined) return;

        const jump = Dia[key as keyof typeof horarios];
        for (let i = 0; i <= horas; i++)
          newArr[horas + i][jump] = <div className="bg-red-500">0</div>;
      }
    });

    setArr2(newArr);
  }, [materias]);

  return (
    <div className="flex flex-col">
      <div className="flex gap-5">
        <div className=""></div>

        <div className="flex gap-x-5">
          <div>dom</div>
          <div>seg</div>
          <div>ter</div>
          <div>qua</div>
          <div>qui</div>
          <div>sex</div>
          <div>sab</div>
        </div>
      </div>

      <div className="flex gap-5">
        <div className="">
          <div className="horarios">
            {arr.map((item, i) => (
              <div key={i}>{item}</div>
            ))}
          </div>
        </div>

        <div className="grid-rows-11 grid w-full grid-cols-7">
          {arr2.flat()}
        </div>
      </div>
    </div>
  );
};

export default Grade;
