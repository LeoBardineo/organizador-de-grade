import "./index.css";
import Grade from "./components/Grade";

const App = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-200">
      <h1 className="py-6 text-3xl font-bold text-neutral-800">
        Organizador de grade
      </h1>
      <div className="rounded-md bg-neutral-50 pb-3 shadow-lg">
        <Grade />
      </div>
    </div>
  );
};

export default App;
