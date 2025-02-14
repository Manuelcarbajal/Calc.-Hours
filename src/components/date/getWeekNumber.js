export const getWeekNumber = (date, year = null) => {
  let d = new Date(date.getTime()); // Creamos un nuevo Date con la fecha de "this".

  if (year) {
    d.setFullYear(year);
  }

  const firstDayOfYear = new Date(d.getFullYear(), 0, 1);
  const firstThursday = new Date(
    d.getFullYear(),
    0,
    1 + ((4 - firstDayOfYear.getDay() + 7) % 7)
  ); // Primer jueves del año

  console.log(firstThursday);

  // Calculamos la diferencia en días entre la fecha actual y el primer jueves.
  const daysBetween = Math.floor((d - firstThursday) / (1000 * 60 * 60 * 24));

  // La semana comienza en el primer lunes después del primer jueves
  const weekNumber = Math.floor(daysBetween / 7 + 1);

  return weekNumber;
};
