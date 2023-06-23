import { useContext } from "react";
import { ConfigContext } from "../ConfigContext";

const Config = () => {
    const { checkLinhas, setCheckLinhas } = useContext(ConfigContext);

    const handleChange = () => {
        setCheckLinhas(!checkLinhas)
    }

    return (
        <div className="w-40 pt-20 pl-4">
          <h1>Configurações</h1>
          <input type="checkbox"
            id="checkLinhas"
            name="checkLinhas"
            className="mr-2"
            checked={checkLinhas}
            onChange={handleChange}
          />
          <label htmlFor="checkLinhas">Linhas</label>
        </div>
    );
};

export default Config;