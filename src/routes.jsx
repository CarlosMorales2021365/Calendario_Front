import Homepage from "./pages/Homepage.jsx";
import Calendar from "./components/calendar.jsx";
import Citas from "./pages/citasPage.jsx";

export const routes = [
    {
        path: "/",
        element: <Homepage />
    },
    {
        path: "/calendario",
        element: <Calendar />
    },
    {
        path: "/citas",
        element: <Citas />
    }
];