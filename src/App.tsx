import "./index.css";
import Grade from "./components/Grade";
import Config from "./components/Config";
import { ConfigContext } from "./ConfigContext";
import { useState } from "react";
import Sidebar from "./components/Sidebar";
import { RiArrowLeftDoubleLine, RiArrowRightDoubleLine } from 'react-icons/ri'

const App = () => {
  const [checkLinhas, setCheckLinhas] = useState(false)
  const [sidebar, setSidebar] = useState(true)
  
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-200">
      <h1 className="py-6 text-3xl font-bold text-neutral-800">
        Organizador de grade
      </h1>
      <div className="flex">
        <ConfigContext.Provider value={{
            checkLinhas, setCheckLinhas,
            sidebar, setSidebar
          }}>
          <Grade />
          {sidebar ?
            <Sidebar>
              <Config/>
            </Sidebar>
          : <></>
          }
        </ConfigContext.Provider>
        <button className="button-sidebar" onClick={() => setSidebar(!sidebar)}>
          {sidebar ? <RiArrowLeftDoubleLine /> : <RiArrowRightDoubleLine />}
        </button>
      </div>
    </div>
  );
};

export default App;
