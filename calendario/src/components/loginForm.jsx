import React, { useState } from "react";
import "../../public/styles/login.css";
import { login } from "../services/api.jsx";
import { useNavigate } from "react-router-dom";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const res = await login({ email, password });

      // ✅ guardar token y usuario en localStorage
      localStorage.setItem("token", res.token);
      localStorage.setItem("user", JSON.stringify(res.user));

      console.log("Login exitoso ✅", res);

      navigate("/calendario"); // redirige a tu ruta
    } catch (err) {
      console.error("Error al iniciar sesión:", err);
      setError("Correo o contraseña incorrectos");
    }
  };

  return (
    <form className="login-form" onSubmit={handleSubmit}>
      <label>Email</label>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="correo@ejemplo.com"
        required
      />

      <label>Contraseña</label>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="********"
        required
      />

      {error && <p style={{ color: "red" }}>{error}</p>}

      <button type="submit">Ingresar</button>
    </form>
  );
};

export default LoginForm;