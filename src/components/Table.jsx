import { useEffect, useRef, useState } from "react";
import { toPng } from "html-to-image";
import { dataHours } from "../data/weekdays";

const apiSlackBot = import.meta.env.VITE_SLACK_BOT;

const Table = ({ date = "", numWeek = null }) => {
  const elementRef = useRef(null);
  const [data, setData] = useState([]);

  console.log(apiSlackBot);

  const localStorageData = JSON.parse(localStorage.getItem("table-key"));
  // /
  useEffect(() => {
    setData(localStorageData || dataHours);
  }, []);

  const service = async (file, threadId, channelId, initialComment) => {
    console.log(file);
    console.log(threadId);
    console.log(channelId);
    console.log(initialComment);

    const formData = new FormData();
    formData.append(
      "file",
      file,
      `week#${date.getWeekNumber(numWeek)}-${date.getFullYear()}`
    );
    formData.append("threadId", threadId);
    formData.append("channelId", channelId);
    formData.append("initial_comment", initialComment);

    const url = `${apiSlackBot}/api/slackbot/uplaodimage`;
    const options = {
      method: "POST",
      body: formData,
    };
    const response = await fetch(url, options);

    console.log(response);
  };

  Date.prototype.getWeekNumber = function (deductWeek = null) {
    let d = new Date(+this); //Creamos un nuevo Date con la fecha de "this".

    if (deductWeek) {
      d.setDate(d.getDate() - deductWeek * 7);
    }

    d.setHours(0, 0, 0, 0); //Nos aseguramos de limpiar la hora.
    d.setDate(d.getDate() + 4 - (d.getDay() || 7)); // Recorremos los días para asegurarnos de estar "dentro de la semana"
    //Finalmente, calculamos redondeando y ajustando por la naturaleza de los números en JS:
    return Math.ceil(((d - new Date(d.getFullYear(), 0, 1)) / 8.64e7 + 1) / 7);
  };

  const onChange = (e, id) => {
    const { value, name } = e.target;

    const newData = data.map((day) => {
      if (day.id === id) {
        return { ...day, [name]: value };
      }

      return day;
    });

    localStorage.setItem("table-key", JSON.stringify(newData));

    setData(newData);
  };

  const handelRestore = (day, id) => {
    if (confirm(`Do you want to reset the day ${day}? `)) {
      const newData = data.map((day) => {
        if (day.id === id) {
          return { ...day, hour: 0, description: "" };
        }

        return day;
      });

      localStorage.setItem("table-key", JSON.stringify(newData));

      setData(newData);
    }
  };

  const total = () => {
    const map = (localStorageData || data).map((data) => parseInt(data.hour));
    const filter = map.filter(Boolean);
    const reduceSuma = filter.reduce((a, b) => a + b, 0);

    if (reduceSuma) {
      return reduceSuma;
    }

    return 0;
  };

  const htmlToImageConvert = async () => {
    if (
      confirm(
        `Dowload image week-#${date.getWeekNumber(
          numWeek
        )}-${date.getFullYear()}.png?`
      )
    ) {
      const dataUrl = await toPng(elementRef.current, {
        quality: 0.95,
        cacheBust: false,
      });
      console.log("Data URL length:", dataUrl.length);

      console.log(dataUrlToBlob(dataUrl, "hola"));

      const blob = dataUrlToBlob(dataUrl);

      await service(blob, "#varios", "C072LTZKYA2", "Hola");
    }
  };

  //usar preview de iamgen
  // const blobToImage = (blob) => {
  //   return new Promise((resolve) => {
  //     const url = URL.createObjectURL(blob);
  //     let img = new Image();
  //     img.onload = () => {
  //       URL.revokeObjectURL(url);
  //       resolve(img);
  //     };
  //     img.src = url;
  //   });
  // };

  const dataUrlToBlob = (dataUrl) => {
    const byteString = atob(dataUrl.split(",")[1]);
    const mimeString = dataUrl.split(",")[0].split(":")[1].split(";")[0];

    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ab], { type: mimeString });
  };

  return (
    <div className="w-full ">
      <div className="bg-slate-400" ref={elementRef}>
        <div className="flex justify-center m-2">
          <h4 className="text-gray-900 text-2xl font-semibold mr-4">
            Week #
            <span className="text-blue-700">{date.getWeekNumber(numWeek)}</span>
          </h4>
          <h4 className="text-gray-900 text-2xl font-semibold">
            Year: <span className="text-blue-700">{date.getFullYear()}</span>
          </h4>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-100">
            <thead>
              <tr className="bg-gray-100">
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

            {(localStorageData || data).map((data) => (
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
                    <button
                      onClick={() => handelRestore(data.day, data.id)}
                      className="p-2 text-red-600"
                    >
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

        <div className="flex w-2/3 justify-center mx-auto mt-1">
          <div className="flex justify-center">
            <div className="col-span-9 sm:col-span-6 md:col-span-3">
              <div className="flex flex-row bg-slate-50 shadow-sm rounded p-2 m-1">
                <div className="flex flex-col">
                  <div className="text-sm text-black-500">Total Hours</div>
                  <div className="font-bold text-lg">{total()} hrs</div>
                </div>
              </div>
            </div>
          </div>
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
      </div>
    </div>
  );
};

export default Table;
