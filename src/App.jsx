import './App.css';
import { useRoutes, useNavigate } from "react-router-dom";
import { routes } from "./routes";
import { ToastContainer } from "react-toastify";
import useRecordatorios from "./hooks/useRecordatorios";
import "react-toastify/dist/ReactToastify.css";
import { useEffect } from "react";

function App() {
  useRecordatorios(15); 

  let element = useRoutes(routes);
  const navigate = useNavigate();

  useEffect(() => {
    const handleLogout = () => {
      navigate("/", { replace: true }); // redirige al login
    };

    window.addEventListener("logout", handleLogout);
    return () => window.removeEventListener("logout", handleLogout);
  }, [navigate]);

  return (
    <>
      {element}
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}

export default App;
