import { useEffect, useRef, useState } from "react";
import { toPng } from "html-to-image";
import { dataHours } from "../data/weekdays";

const Table = () => {
  const elementRef = useRef(null);
  const [data, setData] = useState([]);

  useEffect(() => {
    setData(dataHours);
  }, []);

  const onChange = (e, id) => {
    const { value, name } = e.target;

    const newData = data.map((day) => {
      if (day.id === id) {
        return { ...day, [name]: value };
      }

      return day;
    });

    setData(newData);
  };

  const total = () => {
    const map = data.map((data) => parseInt(data.hour));
    const filter = map.filter(Boolean);
    const reduceSuma = filter.reduce((a, b) => a + b, 0);

    if (reduceSuma) {
      return reduceSuma;
    }

    return 0;
  };

  const htmlToImageConvert = () => {
    toPng(elementRef.current, { cacheBust: false })
      .then((dataUrl) => {
        const link = document.createElement("a");
        link.download = "table-hours.png";
        link.href = dataUrl;
        link.click();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="w-full ">
      <div className="bg-slate-400" ref={elementRef}>
        <div className="flex">
          <h1 className="text-3xl font-bold mb-4 w-full">
            Work Hours Calculator
          </h1>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border-y border-gray-100 bg-gray-50/50 p-2">
                  Days
                </th>
                <th className="border-y border-gray-100 bg-gray-50/50 p-2">
                  Hours
                </th>
                <th className="border-y border-gray-100 bg-gray-50/50 p-2">
                  Description
                </th>

                <th className="border-y border-gray-100 bg-gray-50/50 p-2">
                  Action
                </th>
              </tr>
            </thead>

            {data.map((data) => (
              <tbody id="attendees-list" key={data.id}>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">
                    {data.day}
                  </td>

                  <td className="border border-gray-300 px-4 py-2">
                    <input
                      type="number"
                      className="p-2 rounded border hourly-rate"
                      name="hour"
                      value={data.hour}
                      onChange={(e) => onChange(e, data.id)}
                      min={0}
                      max={12}
                      maxLength={2}
                      minLength={1}
                    />
                  </td>

                  <td className="border border-gray-300 px-4 py-2">
                    <textarea
                      name="description"
                      value={data.description}
                      className="p-2 rounded border attendees-count resize-none wi w-full"
                      placeholder="Write your thoughts here..."
                      onChange={(e) => onChange(e, data.id)}
                    />
                  </td>

                  <td className="border border-gray-300 px-4 py-2">
                    <button className="p-2 text-red-600">
                      <svg
                        className="w-6 h-6"
                        stroke="currentColor"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                      >
                        <path d="M 10 2 L 9 3 L 4 3 L 4 5 L 5 5 L 5 20 C 5 20.522222 5.1913289 21.05461 5.5683594 21.431641 C 5.9453899 21.808671 6.4777778 22 7 22 L 17 22 C 17.522222 22 18.05461 21.808671 18.431641 21.431641 C 18.808671 21.05461 19 20.522222 19 20 L 19 5 L 20 5 L 20 3 L 15 3 L 14 2 L 10 2 z M 7 5 L 17 5 L 17 20 L 7 20 L 7 5 z M 9 7 L 9 18 L 11 18 L 11 7 L 9 7 z M 13 7 L 13 18 L 15 18 L 15 7 L 13 7 z"></path>
                      </svg>
                    </button>
                  </td>
                </tr>
              </tbody>
            ))}
          </table>
        </div>
        <div className="flex w-2/3 justify-center mx-auto mt-8">
          <div className="flex w-full justify-center">
            <div className="col-span-9 sm:col-span-6 md:col-span-3">
              <div className="flex flex-row bg-slate-50 shadow-sm rounded p-2 m-1">
                <div className="flex flex-col flex-grow ml-4">
                  <div className="text-sm text-black-500">Total Hours</div>
                  <div className="font-bold text-lg">{total()} hrs</div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex w-full justify-end"></div>
        </div>
      </div>

      <div className="flex w-2/3 justify-center mx-auto mt-8 ">
        <div>
          <button
            className="align-middle select-none font-sans font-bold text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-2 px-4 rounded-lg bg-gray-900 text-white shadow-md shadow-gray-900/10 hover:shadow-lg hover:shadow-gray-900/20 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none flex items-center gap-3 mt-4 m-1"
            type="button"
            onClick={htmlToImageConvert}
          >
            Export Image JPG
          </button>
        </div>

        <div>
          <button
            className="align-middle select-none font-sans font-bold text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-2 px-4 rounded-lg bg-gray-900 text-white shadow-md shadow-gray-900/10 hover:shadow-lg hover:shadow-gray-900/20 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none flex items-center gap-3 mt-4 m-1"
            type="button"
          >
            Export Pdf
          </button>
        </div>
      </div>
    </div>
  );
};

export default Table;
