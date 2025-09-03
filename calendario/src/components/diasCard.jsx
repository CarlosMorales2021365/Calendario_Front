import React from "react";
import '../../public/styles/diasCard.css';

const hours = Array.from({ length: 24 }, (_, i) =>
  `${i.toString().padStart(2, "0")}`
);

export default function DiasCard({ day, month, year, onClose, citasUsuario }) {
  if (!day) return null;

  const fechaDisplay = `${day.toString().padStart(2, "0")}-${(month + 1).toString().padStart(2, "0")}-${year}`;

  // Filtrar citas del día actual
  const citasDelDia = citasUsuario.filter(c => c.fecha === fechaDisplay);

  return (
<div className="dias-card-overlay">
  <div className="dias-card">
    <button className="close-btn" onClick={onClose}>×</button>
    <div className="dias-card-header">
      <h2>{fechaDisplay}</h2>
    </div>
    
    <ul>
      {hours.map(h => {
        const citasEnHora = citasDelDia.filter(c => c.hora === h);
        return (
          <li key={h}>
            <strong>{h}:00</strong>
            <div className="citas-hora">
              {citasEnHora.map(c => (
                <div key={c._id} className="cita-box">
                  <p><strong>Lugar:</strong> {c.lugar}</p>
                  <p><strong>Hora:</strong> {c.hora}:{c.minuto}</p>
                  <p><strong>Usuario:</strong> {c.usuario.nombre} {c.usuario.apellido}</p>
                </div>
              ))}
            </div>
          </li>
        );
      })}
    </ul>
  </div>
</div>
  );
}