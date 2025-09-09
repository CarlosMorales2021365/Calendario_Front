import { useEffect } from "react";
import { toast } from "react-toastify";
import { getCitas } from "../services/api"; // apunta a tu api.jsx

/**
 * Hook para mostrar recordatorios de citas.
 * @param {number} minutosAntes - cuántos minutos antes se quiere notificar (default 15)
 */
const useRecordatorios = (minutosAntes = 15) => {
  useEffect(() => {
    let intervalId;

    const checkCitas = async () => {
      try {
        const res = await getCitas();
        if (!res.success) return;

        const now = new Date();

        res.citas.forEach((cita) => {
          // Asumimos que cita.fecha = "DD-MM-YYYY" y cita.hora, cita.minuto
          const [dia, mes, anio] = cita.fecha.split("-").map(Number);
          const citaDate = new Date(anio, mes - 1, dia, Number(cita.hora), Number(cita.minuto));

          // Tiempo en milisegundos antes de la cita
          const diff = citaDate - now;
          const diffMinutos = diff / 1000 / 60;

          // Si la cita es dentro de 'minutosAntes' minutos
          if (diffMinutos > 0 && diffMinutos <= minutosAntes) {
            toast.info(`Tienes una cita a las ${cita.hora}:${cita.minuto}  en ${cita.lugar}`, {
              position: "top-right",
              autoClose: 5000,
            });
          }
        });
      } catch (err) {
        console.error("Error al verificar citas para recordatorios:", err);
      }
    };

    // Revisar cada minuto
    intervalId = setInterval(checkCitas, 60 * 1000);
    checkCitas(); // revisar inmediatamente al montar

    return () => clearInterval(intervalId);
  }, [minutosAntes]);
};

export default useRecordatorios;