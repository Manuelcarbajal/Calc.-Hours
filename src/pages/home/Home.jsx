import Table from "./components/Table";
// import { toPng } from "html-to-image";
import { PdfGenerator } from "../../components/PdfGenerator";
import { getWeekNumber } from "../../components/date/getWeekNumber";

const Home = () => {
  const date = new Date();

  const generatePdf = () => {
    PdfGenerator();
  };

  const month = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  return (
    <>
      <div className="flex justify-between items-centern mt-2">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Work Hours Calculator
        </h1>

        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-2 mb-2">
          <p className="text-sm">
            Please review the calculation of hours carefully as it is still
            under testing.
          </p>
        </div>

        <div className="flex space-x-4">
          <button
            className="align-middle select-none font-sans font-bold text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs  px-4 rounded-lg bg-gray-900 text-white shadow-md shadow-gray-900/10 hover:shadow-lg hover:shadow-gray-900/20 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none flex items-center gap-3 mt-4 m-1"
            type="button"
          >
            current Num Week: {getWeekNumber(date)}
          </button>
          <button
            className="align-middle select-none font-sans font-bold text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs  px-4 rounded-lg bg-gray-900 text-white shadow-md shadow-gray-900/10 hover:shadow-lg hover:shadow-gray-900/20 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none flex items-center gap-3 mt-4 m-1"
            type="button"
          >
            current Month: {month[date.getMonth()]}
          </button>
          <button
            className="align-middle select-none font-sans font-bold text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs  px-4 rounded-lg bg-gray-900 text-white shadow-md shadow-gray-900/10 hover:shadow-lg hover:shadow-gray-900/20 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none flex items-center gap-3 mt-4 m-1"
            type="button"
          >
            current Year: {date.getFullYear()}
          </button>
          <button
            className="align-middle select-none font-sans font-bold text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-2 px-4 rounded-lg bg-gray-900 text-white shadow-md shadow-gray-900/10 hover:shadow-lg hover:shadow-gray-900/20 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none flex items-center gap-3 mt-4 m-1"
            type="button"
            onClick={generatePdf}
          >
            Generate PDF
          </button>
        </div>
      </div>
      <Table date={date} />
    </>
  );
};

export default Home;
