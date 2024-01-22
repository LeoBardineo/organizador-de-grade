import { useContext } from "react";
import { ConfigContext } from "../ConfigContext";

const Config = () => {
    const { checkLinhas, setCheckLinhas } = useContext(ConfigContext);

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

export default Config;