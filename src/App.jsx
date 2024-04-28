import { useState } from "react";
import "./App.css";
import Table from "./components/Table";

function App() {
  const date = new Date();
  const [numWeek, setNumWeek] = useState(null);

  const nextWeek = () => {
    if (!numWeek) return setNumWeek(1);
    if (numWeek === 1) return setNumWeek(null);
  };
  return (
    <>
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Work Hours Calculator
        </h1>
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          onClick={nextWeek}
        >
          {!numWeek ? "This Week" : "Previous Week"}
        </button>
      </div>
      <Table date={date} numWeek={numWeek} />{" "}
    </>
  );
}

export default App;
