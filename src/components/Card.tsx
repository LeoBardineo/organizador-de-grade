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
      className='card bg-red-500'
      style={{gridRowStart: hInicial - 5,
              gridRowEnd: hInicial - 5 + horas,
              gridColumnStart: dia + 1}}
    >
      <h1>{id}</h1>
      {horas > 1 ? <h2>{nome}</h2> : ''}
    </div>
  );
};

export default Card;
