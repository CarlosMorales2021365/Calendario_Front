import axios from "axios";

const apiCitas = axios.create({
  baseURL: "http://127.0.0.1:3001/gestorDeCitas/v1",
  timeout: 10000,
});

apiCitas.interceptors.request.use(
  (config) => {
    if (
      !config.url.includes("/auth/login") &&
      !config.url.includes("/auth/register")
    ) {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const login = async (credentials) => {
  const res = await apiCitas.post("/auth/login", credentials);
  return res.data;
};

// register
export const register = async (userData) => {
  const res = await apiCitas.post("/auth/register", userData);
  return res.data;
};

export const getCitas = async () => {
  try {
    const res = await apiCitas.get("/citas/listarCitas", {
      headers: { 'Cache-Control': 'no-cache' } // evita 304
    });
    return res.data; // contiene { success: true, citas: [...] }
  } catch (err) {
    console.error("Error en getCitas:", err);
    return { success: false, citas: [] };
  }
};

// buscar citas por fecha
export const getCitasByFecha = async (fecha) => {
  const res = await apiCitas.post("/citas/getCitasByFecha", { fecha });
  return res.data;
};

// crear cita
export const createCita = async (citaData) => {
  const res = await apiCitas.post("/citas/crearCita", citaData);
  return res.data;
};


