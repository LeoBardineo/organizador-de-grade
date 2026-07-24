import "./index.css";
import Grade from "./components/Grade";
import ConfigTab from "./components/ConfigTab";
import MateriasTab from "./components/MateriasTab";
import { useStore } from "./store";
import Sidebar from "./components/Sidebar";
import { RiArrowLeftDoubleLine, RiArrowRightDoubleLine } from 'react-icons/ri'

const App = () => {
  const sidebar = useStore(state => state.sidebar);
  const setSidebar = useStore(state => state.setSidebar);
  const isSidebarMateria = useStore(state => state.isSidebarMateria);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-200">
      <h1 className="py-6 text-3xl font-bold text-neutral-800">
        Organizador de grade
      </h1>
      <div className="flex">
        <Grade />
        {sidebar ? (
          <Sidebar>
            {isSidebarMateria ? <MateriasTab /> : <ConfigTab />}
          </Sidebar>
        ) : null}
        <button className="button-sidebar" onClick={() => setSidebar(!sidebar)}>
          {sidebar ? <RiArrowLeftDoubleLine /> : <RiArrowRightDoubleLine />}
        </button>
      </div>
    </div>
  );
};

export default App;
