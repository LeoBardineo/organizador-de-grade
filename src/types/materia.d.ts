type DiaDaSemana = "dom" | "seg" | "ter" | "qua" | "qui" | "sex" | "sab";

interface Horario {
  dia: DiaDaSemana;
  hInicial: number;
  horas: number;
}

interface Materia {
  id: string;
  nome: string;
  horarios: Horario[];
  periodo: string;
}
