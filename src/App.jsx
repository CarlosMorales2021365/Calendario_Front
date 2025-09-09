import './App.css';
import { useRoutes } from "react-router-dom";
import { routes } from "./routes";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  let element = useRoutes(routes);

  return (
    <>
      {element}
      {/* contenedor de notificaciones global */}
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}

export default App;
