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
    if (Number(a.hora) !== Number(b.hora)) return Number(a.hora) - Number(b.hora);
    return Number(a.minuto) - Number(b.minuto);
  });

  // Hora actual para comparar
  const ahora = new Date();

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
            citasOrdenadas.map((c) => {
              // 🔑 Crear fecha/hora de la cita
              const citaDate = new Date(
                year,
                month,
                day,
                Number(c.hora),
                Number(c.minuto)
              );
              const esPasada = citaDate < ahora;

              return (
                <div
                  key={c._id}
                  className={`cita-box ${esPasada ? "cita-pasada" : ""}`}
                >
                  <p>
                    <strong>Hora:</strong>{" "}
                    {String(c.hora).padStart(2, "0")}:
                    {String(c.minuto).padStart(2, "0")}
                  </p>
                  <p>
                    <strong>Lugar:</strong> {c.lugar}
                  </p>
                  <p>
                    <strong>Candidato:</strong> {c.candidato?.nombre} {c.candidato?.apellido} <br/>
                    <strong>Email:</strong> {c.correoCandidato}
                  </p>
                  <p>
                    <strong>Usuario:</strong> {c.usuario?.nombre} {c.usuario?.apellido} <br/>
                    <strong>Email:</strong> {c.correoUsuario}
                  </p>
                </div>
              );
            })
          ) : (
            <p className="sin-citas">No hay citas para este día.</p>
          )}
        </div>
      </div>
    </div>
  );
}