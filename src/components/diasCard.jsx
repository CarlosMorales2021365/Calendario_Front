import React from "react";
import "../../public/styles/diasCard.css";

export default function DiasCard({ day, month, year, onClose, citasUsuario }) {
  if (!day) return null;

  const fechaDisplay = `${day.toString().padStart(2, "0")}-${(month + 1)
    .toString()
    .padStart(2, "0")}-${year}`;

  // Filtrar solo las citas del día
  const citasDelDia = citasUsuario.filter((c) => c.fecha === fechaDisplay);

  // Ordenarlas por hora y minuto
  const citasOrdenadas = [...citasDelDia].sort((a, b) => {
    if (a.hora !== b.hora) return a.hora - b.hora;
    return a.minuto - b.minuto;
  });

  return (
    <div className="dias-card-overlay">
      <div className="dias-card">
        <button className="close-btn" onClick={onClose}>
          ×
        </button>
        <div className="dias-card-header">
          <h2>{fechaDisplay}</h2>
        </div>

        <div className="dias-card-body">
          {citasOrdenadas.length > 0 ? (
            citasOrdenadas.map((c) => (
              <div key={c._id} className="cita-box">
                <p>
                  <strong>Lugar:</strong> {c.lugar}
                </p>
                <p>
                  <strong>Hora:</strong> {c.hora.toString().padStart(2, "0")}:
                  {c.minuto.toString().padStart(2, "0")}
                </p>
                <p>
                  <strong>Usuario:</strong> {c.usuario.nombre}{" "}
                  {c.usuario.apellido}
                </p>
              </div>
            ))
          ) : (
            <p className="sin-citas">No hay citas para este día.</p>
          )}
        </div>
      </div>
    </div>
  );
}