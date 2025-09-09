import axios from "axios";
import { toast } from "react-toastify";

const apiCitas = axios.create({
  baseURL: "http://127.0.0.1:3001/gestorDeCitas/v1",
  timeout: 10000,
});

// Interceptor para REQUEST → agrega token
apiCitas.interceptors.request.use(
  (config) => {
    if (!config.url.includes("/auth/login") && !config.url.includes("/auth/register")) {
      const token = localStorage.getItem("token");
      if (!token) return Promise.reject(new Error("No autorizado"));

      try {
        const parts = token.split(".");
        if (parts.length !== 3) throw new Error("Token inválido");

        const payload = JSON.parse(atob(parts[1]));
        const now = Math.floor(Date.now() / 1000);

        if (payload.exp < now) {
          localStorage.removeItem("token");
          toast.error("⚠️ Tu sesión ha expirado");
          // Lanzar evento global
          window.dispatchEvent(new Event("logout"));
          return Promise.reject(new Error("Token expirado"));
        }

        config.headers.Authorization = `Bearer ${token}`;
      } catch (err) {
        localStorage.removeItem("token");
        toast.error("⚠️ Token inválido");
        window.dispatchEvent(new Event("logout"));
        return Promise.reject(new Error("Token inválido"));
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para RESPONSE → maneja expiración
apiCitas.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      toast.error("⚠️ Tu sesión ha expirado");
      window.dispatchEvent(new Event("logout"));
    }
    return Promise.reject(error);
  }
);

// === ENDPOINTS ===

export const login = async (credentials) => {
  const res = await apiCitas.post("/auth/login", credentials);
  return res.data;
};

export const register = async (userData) => {
  const res = await apiCitas.post("/auth/register", userData);
  return res.data;
};

export const getCitas = async () => {
  try {
    const res = await apiCitas.get("/citas/listarCitas", {
      headers: { "Cache-Control": "no-cache" },
    });
    return res.data;
  } catch (err) {
    console.error("Error en getCitas:", err);
    return { success: false, citas: [] };
  }
};

export const getCitasByFecha = async (fecha) => {
  const res = await apiCitas.post("/citas/getCitasByFecha", { fecha });
  return res.data;
};

export const createCita = async (citaData) => {
  const res = await apiCitas.post("/citas/crearCita", citaData);
  return res.data;
};

export default apiCitas;


