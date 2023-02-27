import "./index.css";
import Grade from "./components/Grade";

const App = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-200">
      <div className="rounded-md bg-white p-12">
        <h1 className="text-3xl font-bold text-black">Organizador de grade</h1>

        <Grade />
      </div>
    </div>
  );
};

export default App;
