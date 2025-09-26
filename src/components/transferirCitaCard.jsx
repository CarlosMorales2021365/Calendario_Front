import { useState, useEffect } from "react";
import { getReclutadoresEmpresa, moverCita } from "../services/api.jsx";
import { toast } from "react-toastify"; // ✅ Toast
import "react-toastify/dist/ReactToastify.css"; // ✅ Estilos de toast
import "../../public/styles/transferirCitaCard.css";

export default function TransferirCita({ citasUsuario, show, onClose }) {
  const [reclutadores, setReclutadores] = useState([]);
  const [citaSeleccionada, setCitaSeleccionada] = useState(null);
  const [reclutadorSeleccionado, setReclutadorSeleccionado] = useState("");

  useEffect(() => {
    const fetchReclutadores = async () => {
      const res = await getReclutadoresEmpresa();
      setReclutadores(res.success ? res.reclutadores : []);
    };
    fetchReclutadores();
  }, []);

  // 🕑 Función para convertir string dd-mm-yyyy a Date válido
  const parseFechaCita = (c) => {
    const [dia, mes, anio] = c.fecha.split("-"); // dd-mm-yyyy
    return new Date(
      `${anio}-${mes.padStart(2, "0")}-${dia.padStart(2, "0")}T${String(
        c.hora
      ).padStart(2, "0")}:${String(c.minuto).padStart(2, "0")}:00`
    );
  };

  // 🔎 Filtrar y ordenar citas futuras
  const citasFuturas = citasUsuario
    .filter((c) => parseFechaCita(c) >= new Date())
    .sort((a, b) => parseFechaCita(a) - parseFechaCita(b));

  const handleTransferir = async () => {
    if (!citaSeleccionada || !reclutadorSeleccionado) {
      toast.warn("⚠️ Debes seleccionar una cita y un reclutador");
      return;
    }

    const [nuevoUsuarioNombre, nuevoUsuarioApellido] =
      reclutadorSeleccionado.split(" ");

    const res = await moverCita({
      candidatoNombre: citaSeleccionada.candidato?.nombre,
      candidatoApellido: citaSeleccionada.candidato?.apellido,
      fecha: citaSeleccionada.fecha,
      hora: citaSeleccionada.hora,
      minuto: citaSeleccionada.minuto,
      nuevoUsuarioNombre,
      nuevoUsuarioApellido,
    });

    if (res.success) {
      toast.success("✅ Cita transferida correctamente");
      onClose();
      setTimeout(() => window.location.reload(), 1500); // recarga la página
    } else {
      toast.error(res.msg || "❌ Error al transferir cita");
    }
  };

  if (!show) return null;

  return (
    <div className="transferir-overlay">
      <div className="transferir-card">
        <button className="close-btn" onClick={onClose}>
          ×
        </button>
        <h2>Transferir Cita</h2>

        <label>Cita:</label>
        <select
          className="transferir-select"
          value={citaSeleccionada?._id || ""}
          onChange={(e) => {
            const cita = citasUsuario.find((c) => c._id === e.target.value);
            setCitaSeleccionada(cita || null);
          }}
        >
          <option value="">--Seleccione una cita--</option>
          {citasFuturas.map((c) => (
            <option key={c._id} value={c._id}>
              {c.fecha} {String(c.hora).padStart(2, "0")}:
              {String(c.minuto).padStart(2, "0")} – {c.candidato?.nombre}{" "}
              {c.candidato?.apellido}
            </option>
          ))}
        </select>

        <label>Reclutador:</label>
        <select
          className="transferir-select"
          value={reclutadorSeleccionado}
          onChange={(e) => setReclutadorSeleccionado(e.target.value)}
        >
          <option value="">--Seleccione un reclutador--</option>
          {reclutadores.map((r) => (
            <option key={r._id} value={`${r.nombre} ${r.apellido}`}>
              {r.nombre} {r.apellido}
            </option>
          ))}
        </select>

        <button className="transferir-btn" onClick={handleTransferir}>
          Transferir
        </button>
      </div>
    </div>
  );
}