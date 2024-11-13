import { useRef, useState } from "react";
import Table from "./components/Table";
// import { toPng } from "html-to-image";
import { PdfGenerator } from "../../components/PdfGenerator";

const Home = () => {
  const date = new Date();
  const [numWeek, setNumWeek] = useState(null);

  const elementRef = useRef(null);

  const nextWeek = () => {
    if (!numWeek) return setNumWeek(1);
    if (numWeek === 1) return setNumWeek(null);
  };

  // const htmlToImageConvert = () => {
  //   toPng(elementRef.current, { cacheBust: false })
  //     .then((dataUrl) => {
  //       const link = document.createElement("a");
  //       link.download = `week-${numWeek}.png`;
  //       link.href = dataUrl;
  //       link.click();
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // };

  const generatePdf = () => {
    PdfGenerator();
  };

  return (
    <>
      <div className="flex justify-between items-centern mt-2">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Work Hours Calculator
        </h1>

        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4">
          <p className="text-sm">
            Please review the calculation of hours carefully as it is still
            under testing.
          </p>
        </div>

        <div className="flex space-x-4">
          {/* <button
            className="align-middle select-none font-sans font-bold text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-2 px-4 rounded-lg bg-gray-900 text-white shadow-md shadow-gray-900/10 hover:shadow-lg hover:shadow-gray-900/20 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none flex items-center gap-3 mt-4 m-1"
            type="button"
            onClick={htmlToImageConvert}
          >
            Export Image JPG
          </button> */}

          <button
            className="align-middle select-none font-sans font-bold text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-2 px-4 rounded-lg bg-gray-900 text-white shadow-md shadow-gray-900/10 hover:shadow-lg hover:shadow-gray-900/20 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none flex items-center gap-3 mt-4 m-1"
            type="button"
            onClick={generatePdf}
          >
            Generate PDF
          </button>

          <button
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            onClick={nextWeek}
          >
            {!numWeek ? "This Week" : "Previous Week"}
          </button>
        </div>
      </div>
      <Table date={date} numWeek={numWeek} elementRef={elementRef} />{" "}
    </>
  );
};

export default Home;
