import { useState, useEffect } from "react";
import Calendar from "../components/calendar.jsx";
import Modal from "../components/modal.jsx";
import { getCitas } from "../services/api.jsx";
import CitaCard from "../components/citaCard.jsx";
import "../../public/styles/citasPage.css";

export default function Dashboard() {
  const [showCalendar, setShowCalendar] = useState(false);
  const [citas, setCitas] = useState([]);
  const usuarioActual = JSON.parse(localStorage.getItem("usuarioActual") || "{}");

  useEffect(() => {
    const fetchCitas = async () => {
      const res = await getCitas();
      if (res.success) {
        setCitas(res.citas);
      }
    };
    fetchCitas();
  }, []);

  return (
    <div className="citas-page">
      <h1 className="bienvenido">Bienvenido</h1>

      <div className="citas-layout">
        {/* Lista de citas */}
        <div className="citas-list">
          <h2>Mis Citas</h2>
          {citas.length === 0 && <p>No tienes citas registradas.</p>}
          {citas.map((cita) => (
            <CitaCard key={cita._id} cita={cita} usuarioActual={usuarioActual} />
          ))}
        </div>

        {/* Botón calendario */}
        <div className="citas-calendar-btn">
          <button onClick={() => setShowCalendar(true)}>📅 Ver Calendario</button>
        </div>
      </div>

      {/* Modal con el calendario */}
      <Modal show={showCalendar} onClose={() => setShowCalendar(false)}>
        <Calendar />
      </Modal>
    </div>
  );
}