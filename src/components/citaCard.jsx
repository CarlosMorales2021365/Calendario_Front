import "../../public/styles/citaCard.css";

export default function CitaCard({ cita, usuarioActual }) {
  return (
    <div className="cita-card">
      <div className="cita-header">
        📅 {cita.fecha} – ⏰ {String(cita.hora).padStart(2, "0")}:
        {String(cita.minuto).padStart(2, "0")}
      </div>
      <div className="cita-body">
        <p><strong>Candidato:</strong> {cita.candidato?.nombre} {cita.candidato?.apellido}</p>
        {usuarioActual.role === "RECLUTADOR_ROLE" && (
          <p><strong>Asignada a:</strong> {cita.usuario?.nombre} {cita.usuario?.apellido}</p>
        )}
      </div>
    </div>
  );
}