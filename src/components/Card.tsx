interface Materia {
  id: string;
  nome: string;
  hInicial: number;
  horas: number;
  jump: number;
}

const Card = ({ id, nome, hInicial, horas, jump }: Materia) => {
  return (
    <div
      className={`card bg-red-500 row-start-${hInicial} row-end-${
        hInicial + horas
      } col-start-${jump}`}
    >
      <h1>{id}</h1>
      <h2>{nome}</h2>
    </div>
  );
};

export default Card;
