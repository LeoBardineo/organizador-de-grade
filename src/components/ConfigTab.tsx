import { useStore } from "../store";

const ConfigTab = () => {
  const checkLinhas = useStore(state => state.checkLinhas);
  const setCheckLinhas = useStore(state => state.setCheckLinhas);

  const handleChange = () => {
    setCheckLinhas(!checkLinhas)
  }

  return (
    <>
      <h1>Configurações</h1>
      <input type="checkbox"
        id="checkLinhas"
        name="checkLinhas"
        className="mr-2"
        checked={checkLinhas}
        onChange={handleChange}
      />
      <label htmlFor="checkLinhas">Linhas</label>
    </>
  );
};

export default ConfigTab;