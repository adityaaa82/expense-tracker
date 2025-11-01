import { Routes } from "react-router-dom";
import { Route } from "react-router-dom";
import Dashboard from "./core/Dashboard";

function AppRoutes() {
    return (
    <Routes>
        <Route path="/" element={<Dashboard />} />
    </Routes>
    )
}

export default AppRoutes;