import { useState, useEffect } from "react";
import DiasCard from "../components/diasCard";
import { getCitas } from "../services/api.jsx";
import "../../public/styles/calendar.css";

const Calendar = () => {
  const today = new Date();
  const [month, setMonth] = useState(today.getMonth());
  const [year, setYear] = useState(today.getFullYear());
  const [selectedDay, setSelectedDay] = useState(null);
  const [citasUsuario, setCitasUsuario] = useState([]);

  const months = [
    "Enero","Febrero","Marzo","Abril","Mayo","Junio",
    "Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"
  ];

  // Calcular días del mes
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  let firstDay = new Date(year, month, 1).getDay();

  const daysArray = [];
  for (let i = 0; i < firstDay; i++) daysArray.push(null);
  for (let d = 1; d <= daysInMonth; d++) daysArray.push(d);
  while (daysArray.length % 7 !== 0) daysArray.push(null);

  const prevMonth = () => {
    if (month === 0) { setMonth(11); setYear(year - 1); } 
    else { setMonth(month - 1); }
  };
  const nextMonth = () => {
    if (month === 11) { setMonth(0); setYear(year + 1); } 
    else { setMonth(month + 1); }
  };

  // Traer todas las citas al montar el componente
  useEffect(() => {
    const fetchCitas = async () => {
      const res = await getCitas();
      if (res.success) setCitasUsuario(res.citas);
      else setCitasUsuario([]);
    };
    fetchCitas();
  }, []);

  return (
    <>
      <br />
      <br />
      <div className="calendar-container">
        <div className="calendar-header">
          {months[month].toUpperCase()} {year}
        </div>
        <div className="calendar-controls">
          <button onClick={prevMonth}>←</button>
          <button onClick={nextMonth}>→</button>
        </div>

        <div className="calendar-grid">
          <div className="calendar-day-headers">
            {["DOMINGO","LUNES","MARTES","MIÉRCOLES","JUEVES","VIERNES","SÁBADO"].map(d => (
              <div key={d} className="calendar-day-header">{d}</div>
            ))}
          </div>

          <div className="calendar-days">
            {daysArray.map((day, i) => {
              if (!day) return <div key={i} className="calendar-cell empty"></div>;

              const fechaDisplay = `${day.toString().padStart(2, "0")}-${(month + 1)
                .toString()
                .padStart(2, "0")}-${year}`;

              // Filtrar y ordenar por hora
              const citasDelDia = citasUsuario
                .filter((c) => c.fecha === fechaDisplay)
                .sort((a, b) => a.hora - b.hora || a.minuto - b.minuto);

              return (
                <div
                  key={i}
                  className={`calendar-cell ${citasDelDia.length > 0 ? "tiene-cita" : ""}`}
                  onClick={() => setSelectedDay(day)}
                >
                  <div className="calendar-day-number">{day}</div>
                  <div className="calendar-citas-preview">
  {citasDelDia.slice(0, 1).map((cita, idx) => (
    <div key={idx} className="cita-mini">
      {String(cita.hora).padStart(1, "0")}:
      {String(cita.minuto).padStart(1, "0")} – {cita.candidato}
    </div>
  ))}
  {citasDelDia.length > 1 && (
    <div className="cita-mini mas-citas">
      +{citasDelDia.length - 1} más
    </div>
  )}
</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {selectedDay && (
        <DiasCard
          day={selectedDay}
          month={month}
          year={year}
          onClose={() => setSelectedDay(null)}
          citasUsuario={citasUsuario}
        />
      )}
    </>
  );
};

export default Calendar;