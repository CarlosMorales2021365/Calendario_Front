import { useState, useEffect } from "react";
import DiasCard from "./diasCard";
import TransferirCita from "./transferirCitaCard.jsx";
import { getCitas } from "../services/api.jsx";
import "../../public/styles/calendar.css";

const Calendar = () => {
  const today = new Date();
  const [month, setMonth] = useState(today.getMonth());
  const [year, setYear] = useState(today.getFullYear());
  const [selectedDay, setSelectedDay] = useState(null);
  const [citasUsuario, setCitasUsuario] = useState([]);
  const [showTransferir, setShowTransferir] = useState(false);

  // 👇 Detectar si es dispositivo pequeño
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 480);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 480);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const months = ["Enero","Febrero","Marzo","Abril","Mayo","Junio",
                  "Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];

  const daysInMonth = new Date(year, month+1, 0).getDate();
  let firstDay = new Date(year, month, 1).getDay();

  const daysArray = [];
  for (let i=0;i<firstDay;i++) daysArray.push(null);
  for (let d=1;d<=daysInMonth;d++) daysArray.push(d);
  while (daysArray.length%7!==0) daysArray.push(null);

  const prevMonth = () => month===0?(setMonth(11), setYear(year-1)):setMonth(month-1);
  const nextMonth = () => month===11?(setMonth(0), setYear(year+1)):setMonth(month+1);

  const usuarioActual = JSON.parse(localStorage.getItem("usuarioActual")||"{}");

  const esCitaVencida = (cita)=>{
    const [dia,mes,anio]=cita.fecha.split("-");
    return new Date(anio,mes-1,dia,cita.hora,cita.minuto)<new Date();
  };

  useEffect(()=>{
    const fetchCitas = async () => {
      const res = await getCitas();
      setCitasUsuario(res.success?res.citas:[]);
    };
    fetchCitas();
  },[]);

  if(!usuarioActual.role) return <div>Debes iniciar sesión para ver el calendario.</div>;

  return (
    <>
      <br/><br/>
      {usuarioActual.role==="RECLUTADOR_ROLE" && (
        <TransferirCita 
          show={showTransferir} 
          onClose={()=>setShowTransferir(false)}
          citasUsuario={citasUsuario} 
        />
      )}

      <div className="calendar-container">
        <div className="calendar-header">{months[month].toUpperCase()} {year}</div>
        <div className="calendar-controls">
          <button onClick={prevMonth}>←</button>
          <button onClick={nextMonth}>→</button>
          {usuarioActual.role==="RECLUTADOR_ROLE" &&
           <button onClick={()=>setShowTransferir(true)}>Transferir Cita</button>
          }
        </div>

        <div className="calendar-grid">
          <div className="calendar-day-headers">
            {["DOMINGO","LUNES","MARTES","MIÉRCOLES","JUEVES","VIERNES","SÁBADO"].map((d,idx)=><div key={idx} className="calendar-day-header">{d}</div>)}
          </div>

          <div className="calendar-days">
            {daysArray.map((day,i)=>{
              if(!day) return <div key={i} className="calendar-cell empty"></div>;

              const fechaDisplay=`${day.toString().padStart(2,"0")}-${(month+1).toString().padStart(2,"0")}-${year}`;
              const citasDelDia=citasUsuario.filter(c=>c.fecha===fechaDisplay)
                .sort((a,b)=>a.hora-b.hora || a.minuto-b.minuto);

              return (
                <div key={i} className={`calendar-cell ${citasDelDia.length>0?"tiene-cita":""}`} onClick={()=>setSelectedDay(day)}>
                  <div className="calendar-day-number">{day}</div>

                  <div className="calendar-citas-preview">
                    {citasDelDia.length > 0 && (
                      <>
                        {isMobile ? (
                          // 👇 En móviles, solo el total
                          <div className="cita-mini mas-citas">
                            {citasDelDia.length} {citasDelDia.length>1?"citas":"cita"}
                          </div>
                        ) : (
                          // 👇 En escritorio/tablet, mostrar citas + burbuja si hay más
                          <>
                            {citasDelDia.slice(0,1).map((cita,idx)=>(
                              <div key={idx} className={`cita-mini${esCitaVencida(cita)?" cita-vencida":""}`}>
                                {`${cita.hora.toString().padStart(1,"0")}:${cita.minuto.toString().padStart(1,"0")} – ${
                                  usuarioActual.role==="RECLUTADOR_ROLE"
                                    ? [cita.candidato?.nombre,cita.candidato?.apellido].filter(Boolean).join(" ")
                                    : [cita.usuario?.nombre,cita.usuario?.apellido].filter(Boolean).join(" ")
                                }`}
                              </div>
                            ))}
                            {citasDelDia.length > 1 && (
                              <div className="cita-mini mas-citas">
                                +{citasDelDia.length - 1} más
                              </div>
                            )}
                          </>
                        )}
                      </>
                    )}
                  </div>

                </div>
              );
            })}
          </div>
        </div>
      </div>

      {selectedDay && <DiasCard day={selectedDay} month={month} year={year} onClose={()=>setSelectedDay(null)} citasUsuario={citasUsuario} />}
    </>
  );
};

export default Calendar;