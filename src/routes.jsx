import Homepage from "./pages/Homepage.jsx";
import Calendar from "./pages/calendar.jsx";

export const routes = [
    {
        path: "/",
        element: <Homepage />
    },
    {
        path: "/calendario",
        element: <Calendar />
    }
];