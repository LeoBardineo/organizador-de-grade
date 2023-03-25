interface Horario {
  hInicial: number;
  horas: number;
}

interface Materia {
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
