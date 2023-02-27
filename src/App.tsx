import "./index.css";
import Grade from "./components/Grade";

const App = () => {
  return (
    <div className="min-h-screen flex justify-center items-center bg-slate-200">
      <div className="p-12 bg-white rounded-md">
        <h1 className="text-3xl font-bold text-black">Organizador de grade</h1>

        <Grade />
      </div>
    </div>
  );
};

export default App;
