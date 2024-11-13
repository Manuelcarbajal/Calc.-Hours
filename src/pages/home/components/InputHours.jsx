import { useEffect, useState } from "react";
import styled from "styled-components";

const InputHours = ({ day, data, setData }) => {
  const [state, setState] = useState({
    hours: 0,
    minutes: 0,
  });

  useEffect(() => {
    setState({
      hours: day.hour.hours || 0,
      minutes: day.hour.minutes || 0,
    });
  }, [data]);

  const regexHours = (element) => {
    let value = parseInt(element);
    value = Math.max(0, Math.min(23, value));

    return value;
  };

  const regexMinuts = (element) => {
    let value = parseInt(element);

    value = Math.max(0, Math.min(59, value));

    if (value >= 60) {
      return NaN;
    }

    return value;
  };

  const onChange = (e, id) => {
    const { value, name } = e.target;

    const newData = data.map((day) => {
      if (day.id === id) {
        return {
          ...day,
          hour: {
            hours: name === "hours" ? regexHours(value) : day.hour.hours,
            minutes: name === "minutes" ? regexMinuts(value) : day.hour.minutes,
          },
        };
      }

      return day;
    });

    localStorage.setItem("table-key", JSON.stringify(newData));

    setData(newData);
  };

  return (
    <InputTimeContainer>
      <InputTime
        name="hours"
        type="number"
        id="hours"
        value={regexHours(state.hours)}
        onChange={(e) => onChange(e, day.id)}
        min={0}
        max={24}
      />
      <Separator>:</Separator>
      <InputTime
        name="minutes"
        type="number"
        id="minutes"
        value={regexMinuts(state.minutes)}
        onChange={(e) => onChange(e, day.id)}
        min={0}
        max={60}
      />
    </InputTimeContainer>
  );
};

export default InputHours;

const InputTimeContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const InputTime = styled.input`
  width: 30%;
  max-width: 50px;
  padding: 2px;
  font-size: 18px;
  text-align: center;
  border: 2px solid #ccc;
  border-radius: 5px;
`;

const Separator = styled.span`
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin: 0 10px;
`;
