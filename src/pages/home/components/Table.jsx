import { useEffect, useState } from "react";
import { dataHours } from "../../../data/weekdays";
import InputHours from "./InputHours";
import { getWeekNumber } from "../../../components/date/getWeekNumber";

import "../styles/Table.css";

const Table = ({ date, numWeek, elementRef }) => {
  const localStorageData = JSON.parse(localStorage.getItem("table-key"));

  const [data, setData] = useState([]);

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
    <>
      <div className="container">
        <div className="header" ref={elementRef}>
          <div className="header-content">
            <div className="total-hours">
              <div className="hours-label">Total Hours: </div>
              <div className="hours-value">{total()}</div>
            </div>
            <div className="week-year">
              <h4 className="week-number">
                Week #
                <span className="highlight">
                  {getWeekNumber(date, numWeek)}
                </span>
              </h4>
              <h4 className="year">
                Year: <span className="highlight">{date.getFullYear()}</span>
              </h4>
            </div>
          </div>

          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr className="table-header">
                  <th className="table-heading">Hours</th>
                  <th className="table-heading">Days</th>
                  <th className="table-heading">Date</th>

                  <th className="table-heading">Short Description</th>
                  <th className="table-heading">Action</th>
                </tr>
              </thead>

              {data.map((day) => (
                <tbody id="attendees-list" key={day.id}>
                  <tr>
                    <td className="table-cell">
                      <InputHours data={data} setData={setData} day={day} />
                    </td>
                    <td className="table-cell">{day.day}</td>
                    <td className="table-cell">NOV/11/2024</td>

                    <td className="table-cell description">
                      <textarea
                        name="description"
                        value={day.description}
                        className="description-input"
                        placeholder="Write your thoughts here..."
                        onChange={(e) => onChange(e, day.id)}
                      />
                    </td>
                    <td className="table-cell action">
                      <button
                        onClick={() => handelRestore(day.day, day.id)}
                        className="delete-button"
                      >
                        <svg
                          className="delete-icon"
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
    </>
  );
};

export default Table;
