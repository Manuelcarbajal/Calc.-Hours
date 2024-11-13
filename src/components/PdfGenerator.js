import jsPDF from "jspdf";
import "jspdf-autotable";
import { format } from "date-fns";

export const PdfGenerator = () => {
  const localStorageData = JSON.parse(localStorage.getItem("table-key"));

  const total = () => {
    let totalHours = 0;
    let totalMinutes = 0;

    localStorageData.map((data) => {
      const { hours, minutes } = data.hour;
      totalHours += parseInt(hours) || 0;
      totalMinutes += parseInt(minutes) || 0;
    });

    totalHours += Math.floor(totalMinutes / 60);
    totalMinutes = totalMinutes % 60;

    const formattedTime = `${totalHours}h ${totalMinutes}m`;
    return formattedTime;
  };

  // Crear una nueva instancia de jsPDF
  const pdf = new jsPDF();

  // Establecer las propiedades del documento
  pdf.setProperties({
    title: "Week Hours",
  });

  // Título de la página
  pdf.setFontSize(20);
  pdf.setFont("custom", "bold");
  pdf.text("Week Hours", 10, 15);
  // Mostrar horas totales
  pdf.setFontSize(13);
  pdf.setFont("Newsreader", "bold");

  //YEAR

  //NUM WEEK
  //   pdf.text("Week# 45", 180, 7);
  //total hours
  pdf.text("Total Hours: ", 149, 15);
  pdf.setFont("Newsreader", "bold");
  pdf.setFontSize(15);
  pdf.text(total(), 176, 15);

  // Línea separadora
  pdf.setLineWidth(0.1);
  pdf.setDrawColor(200, 200, 200);
  pdf.line(10, 18, 200, 18);

  // Espaciado inicial
  let yPosition = 23;
  const pageHeight = pdf.internal.pageSize.height;

  // Iterar sobre los días de la semana
  localStorageData.forEach((dayData) => {
    // Verificar si el contenido cabe en la página actual
    const dayHeight = calculateDayHeight(pdf, dayData);
    if (yPosition + dayHeight > pageHeight - 30) {
      pdf.addPage(); // Añadir nueva página si no cabe
      yPosition = 15; // Reiniciar la posición Y para la nueva página
    }

    pdf.setFontSize(16);
    pdf.setFont("Newsreader", "bold");
    pdf.text(dayData.day, 13, yPosition); // Escribir el nombre del día

    //DATE
    pdf.setFontSize(13);
    pdf.setFont("custom", "normal");
    pdf.text("NOV/11/2024", 50, yPosition);

    // HOURS FOR DAY
    pdf.setFont("Newsreader", "bold");
    pdf.setFontSize(11);
    pdf.text("Hours: ", 130, yPosition);
    pdf.setFontSize(14);
    const hoursText = `${dayData.hour.hours}h:${
      dayData.hour.minutes < 10 ? "0" : ""
    }${dayData.hour.minutes}m`;
    pdf.text(hoursText, 145, yPosition);

    // Descripción
    pdf.setFontSize(15);
    pdf.text("Description:", 13, yPosition + 10);
    pdf.setFontSize(10);
    pdf.setFont("custom", "normal");

    const longText = dayData.description || "No description available."; // Si no hay descripción, poner texto predeterminado

    // Ajustar el texto largo para que encaje en varias líneas
    const textLines = pdf.splitTextToSize(longText, 180); // Ajusta el 180 según el ancho de la página

    // Calcular el alto del texto para la descripción
    const textHeight = pdf.getTextDimensions(textLines).h;
    console.log(textHeight);

    // Imprimir el texto en múltiples líneas
    pdf.text(textLines, 13, yPosition + 15);

    // Actualizar la posición Y después de la descripción
    yPosition += 20 + textHeight; // Ajusta el valor para dar espacio entre días

    // Dibujar la línea final justo después de la descripción
    pdf.line(10, yPosition, 200, yPosition);
    yPosition += 5; // Espacio para la línea
  });

  // Agregar resumen y numeración de página
  const summaryYStart = pageHeight - 50;

  pdf.setFontSize(10);
  pdf.text("For ", 13, summaryYStart + 28);
  pdf.setFont("Newsreader", "bold");
  pdf.text("Calc-Hours", 19, summaryYStart + 28);

  const totalPages = pdf.internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    pdf.line(10, pageHeight - 20, 200, pageHeight - 20); // Línea en la parte inferior de la página
    pdf.setPage(i);
    pdf.setFont("Newsreader");
    pdf.text(`Page ${i} of ${totalPages}`, 185, pageHeight - 10);
  }

  // Guardar el PDF
  pdf.save("Week_Hours.pdf");

  // Abrir el PDF en una nueva pestaña
  const pdfDataUri = pdf.output("datauristring");
  const newTab = window.open();
  newTab?.document.write(
    `<iframe width='100%' height='100%' src='${pdfDataUri}'></iframe>`
  );
};

// Función para calcular el alto total del día, incluyendo la descripción
const calculateDayHeight = (pdf, dayData) => {
  pdf.setFontSize(16);
  const dayHeight = 10; // Aproximadamente la altura del título del día

  pdf.setFontSize(11);
  const hoursHeight = 10; // Aproximadamente la altura para las horas

  pdf.setFontSize(15);
  const descriptionHeight = 9; // Aproximadamente la altura para la etiqueta de descripción

  // Ajustar el texto largo para que encaje en varias líneas
  const longText = dayData.description || "No description available.";
  const textLines = pdf.splitTextToSize(longText, 180);
  const textHeight = pdf.getTextDimensions(textLines).h;

  return dayHeight + hoursHeight + descriptionHeight + textHeight + 20; // Espacio extra para márgenes y separación
};
