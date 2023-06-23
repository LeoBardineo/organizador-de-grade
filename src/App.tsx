import "./index.css";
import Grade from "./components/Grade";
import Config from "./components/Config";
import { ConfigContext } from "./ConfigContext";
import { useState } from "react";

const App = () => {
  const [checkLinhas, setCheckLinhas] = useState(false)
  
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-200">
      <h1 className="py-6 text-3xl font-bold text-neutral-800">
        Organizador de grade
      </h1>
      <div className="rounded-md bg-neutral-50 pb-3 shadow-lg flex">
        <ConfigContext.Provider value={{checkLinhas, setCheckLinhas}}>
          <Grade />
          <Config />
        </ConfigContext.Provider>
      </div>
    </div>
  );
};

export default App;
