import { useEffect, useState } from "react";
import { dataHours } from "../../../data/weekdays";
import InputHours from "./InputHours";
import { getWeekNumber } from "../../../components/date/getWeekNumber";

const Table = ({ date, numWeek, elementRef }) => {
  const [data, setData] = useState([]);

  const localStorageData = JSON.parse(localStorage.getItem("table-key"));

  useEffect(() => {
    setData(localStorageData || dataHours);
  }, []);

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
          return {
            ...day,
            hour: {
              hours: 0,
              minutes: 0,
            },
            description: "",
          };
        }

        return day;
      });

      localStorage.setItem("table-key", JSON.stringify(newData));

      setData(newData);
    }
  };

  const total = () => {
    let totalHours = 0;
    let totalMinutes = 0;

    data.map((data) => {
      const { hours, minutes } = data.hour;
      totalHours += parseInt(hours) || 0;
      totalMinutes += parseInt(minutes) || 0;
    });

    totalHours += Math.floor(totalMinutes / 60);
    totalMinutes = totalMinutes % 60;

    const formattedTime = `${totalHours}h ${totalMinutes}m`;
    return formattedTime;
  };

  return (
    <div className="w-full ">
      <div className="bg-slate-400" ref={elementRef}>
        <div className="flex flex-col items-center m-4 space-y-4">
          <div className="flex justify-center items-center space-x-6">
            <h4 className="text-gray-900 text-2xl font-semibold">
              Week #
              <span className="text-blue-700">
                {getWeekNumber(date, numWeek)}
              </span>
            </h4>
            <h4 className="text-gray-900 text-2xl font-semibold">
              Year: <span className="text-blue-700">{date.getFullYear()}</span>
            </h4>
          </div>

          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-500">Total Hours</div>
            <div className="font-bold text-lg">{total()}</div>
          </div>
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
                  Shoort description
                </th>

                <th className="border-y border-gray-100 bg-gray-50/50 p-2">
                  Action
                </th>
              </tr>
            </thead>

            {(localStorageData || data).map((day) => (
              <tbody id="attendees-list" key={day.id}>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">
                    {day.day}
                  </td>

                  <td className="border border-gray-300 px-4 py-2">
                    <InputHours data={data} setData={setData} day={day} />
                  </td>

                  <td className="border border-gray-300 px-4 py-2">
                    <textarea
                      name="description"
                      value={day.description}
                      className="p-2 rounded border attendees-count resize-none wi w-full h-32"
                      placeholder="Write your thoughts here..."
                      onChange={(e) => onChange(e, day.id)}
                    />
                  </td>

                  <td className="border border-gray-300 px-4 py-2">
                    <button
                      onClick={() => handelRestore(day.day, day.id)}
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
      </div>
    </div>
  );
};

export default Table;
