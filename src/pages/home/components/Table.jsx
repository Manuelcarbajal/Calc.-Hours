import { useEffect, useState } from "react";
import { dataHours } from "../../../data/weekdays";
import InputHours from "./InputHours";
import { getWeekNumber } from "../../../components/date/getWeekNumber";
import { formateMDY } from "../../../utils/date/formateMDY.js";

import "../styles/Table.css";

const Table = ({ date }) => {
  const localStorageData = JSON.parse(localStorage.getItem("table-key"));

  const [data, setData] = useState([]);
  const [stateNumWeek, setNumWeek] = useState(
    localStorageData?.numWeek || parseInt(getWeekNumber(date))
  );
  const [stateYear, setYear] = useState(
    localStorageData?.year || parseInt(date.getFullYear())
  );

  const currentNumWeek = getWeekNumber(date, stateYear);
  const weekNumber = getWeekNumber(date, stateYear, stateNumWeek);

  const saveToLocalStorage = (newData) => {
    localStorage.setItem("table-key", JSON.stringify(newData));
  };

  useEffect(() => {
    if (!localStorageData) {
      console.log("no existe");
      const initialData = {
        ...dataHours,
        year: date.getFullYear(),
        numWeek: getWeekNumber(date),
        week: dataHours.week.map((day) => {
          day.date = dateforDay(date, day.id);
          return day;
        }),
      };

      saveToLocalStorage(initialData);
    }
  }, []);

  //update data
  useEffect(() => {
    setData(localStorageData || dataHours);
  }, []);

  useEffect(() => {
    saveToLocalStorage({ ...data });
  }, [data]);

  const onChangeDate = ({ target: { name, value } }) => {
    const isLeapYear = (year) => {
      return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
    };
    const getMaxWeeks = (year) => {
      const firstDayOfYear = new Date(year, 0, 1); // 1 de enero del año

      // Si el año empieza en jueves o es bisiesto y empieza en miércoles, tiene 53 semanas
      return firstDayOfYear.getDay() === 4 ||
        (isLeapYear(year) && firstDayOfYear.getDay() === 3)
        ? 53
        : 52;
    };
    const maxWeek = getMaxWeeks();
    const updatedValue =
      name === "numWeek" && (parseInt(value) > maxWeek || parseInt(value) <= 0)
        ? currentNumWeek
        : parseInt(value);

    const updatedData = {
      ...data,
      [name]: updatedValue,
      week: data?.week.map((day) => {
        day.date = dateforDay(
          date,
          day.id,
          name === "year" ? updatedValue : stateYear,
          name === "numWeek" ? updatedValue : stateNumWeek
        );
        return day;
      }),
    };

    if (name === "numWeek") setNumWeek(updatedValue);

    if (name === "year") setYear(updatedValue);

    setData(updatedData);
  };

  const dateforDay = (date, numDay, year = null, numWeek = weekNumber) => {
    if (!year) {
      year = date.getFullYear();
    }

    function getFromWD(w, d, y) {
      let jan4 = new Date(y, 0, 4); // El 4 de enero siempre está en la primera semana ISO
      let firstMonday = new Date(
        jan4.setDate(jan4.getDate() - (jan4.getDay() || 7) + 1)
      );
      return new Date(
        firstMonday.setDate(firstMonday.getDate() + (w - 1) * 7 + (d - 1))
      );
    }

    const newDate = getFromWD(numWeek, numDay, year);

    return newDate;
  };

  const onChangeDay = (e, id) => {
    const { value, name } = e.target;

    const newData = (data?.week || []).map((day) => {
      if (day.id === id) {
        return { ...day, [name]: value };
      }

      return day;
    });

    setData({ ...data, week: newData });
  };

  const handelRestore = (day, id) => {
    if (confirm(`Do you want to reset the day ${day}? `)) {
      const newData = data?.week.map((day) => {
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

      setData({ ...data, week: newData });
    }
  };

  const total = () => {
    let totalHours = 0;
    let totalMinutes = 0;

    (data?.week || []).map((data) => {
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
        <div className="header">
          <div className="header-content">
            <div className="total-hours">
              <div className="hours-label">Total Hours: </div>
              <div className="hours-value">{total()}</div>
            </div>
            <div className="week-year">
              <h4 className="week-number">
                Week #
                <span className="highlight">
                  <input
                    className="numWeek"
                    type="number"
                    name="numWeek"
                    onChange={onChangeDate}
                    value={stateNumWeek}
                  />
                </span>
              </h4>
              <h4 className="year">
                Year:
                <span className="highlight">
                  <input
                    className="fullYear"
                    type="number"
                    name="year"
                    onChange={onChangeDate}
                    value={stateYear}
                  />
                </span>
              </h4>
            </div>
          </div>

          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr className="table-header">
                  <th className="table-heading">Hours</th>
                  <th className="table-heading">Days</th>
                  <th className="table-heading">Short Description</th>
                  <th className="table-heading">Action</th>
                </tr>
              </thead>

              {(data?.week || []).map((day) => (
                <tbody id="attendees-list" key={day.id}>
                  <tr>
                    <td className="table-cell">
                      <InputHours data={data} setData={setData} day={day} />
                    </td>
                    <td className="table-cell table-date">
                      <div className="day-label">{day.day}</div>
                      <div className="date-label">{formateMDY(day.date)}</div>
                    </td>

                    <td className="table-cell description">
                      <textarea
                        name="description"
                        value={day.description}
                        className="description-input"
                        placeholder="Write your thoughts here..."
                        onChange={(e) => onChangeDay(e, day.id)}
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
