export const getWeekNumber = (date, deductWeek = null) => {
  let d = new Date(date.getTime()); //Creamos un nuevo Date con la fecha de "this".

  if (deductWeek) {
    d.setDate(d.getDate() - deductWeek * 7);
  }

  d.setHours(0, 0, 0, 0); //Nos aseguramos de limpiar la hora.
  d.setDate(d.getDate() + 4 - (d.getDay() || 7)); // Recorremos los días para asegurarnos de estar "dentro de la semana"
  //Finalmente, calculamos redondeando y ajustando por la naturaleza de los números en JS:
  return Math.ceil(((d - new Date(d.getFullYear(), 0, 1)) / 8.64e7 + 1) / 7);
};
