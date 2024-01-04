interface MateriaCard {
  id: string;
  nome: string;
  hInicial: number;
  horas: number;
  dia: number;
}

const Card = ({ id, nome, hInicial, horas, dia }: MateriaCard) => {
  return (
    <div
      className={`card bg-red-500 row-start-${hInicial - 5}
      row-end-${hInicial - 5 + horas} col-start-${dia + 1}`}
    >
      <h1>{id}</h1>
      {horas > 1 ? <h2>{nome}</h2> : ''}
    </div>
  );
};

export default Card;
