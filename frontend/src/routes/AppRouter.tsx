// src/routes/AppRouter.tsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import DashboardLayout from "../components/DashboardLayout";
import Inventario from "../pages/Inventario";
import Solicitudes from "../pages/Solicitudes";
import Movimientos from "../pages/Movimientos";
import Reportes from "../pages/Reportes";
import ProtectedRoute from "./PrivateRoute";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={["Administrador", "Usuario"]}>
              <DashboardLayout>
                <Inventario />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/solicitudes"
          element={
            <ProtectedRoute allowedRoles={["Administrador", "Usuario"]}>
              <DashboardLayout>
                <Solicitudes />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/movimientos"
          element={
            <ProtectedRoute allowedRoles={["Administrador"]}>
              <DashboardLayout>
                <Movimientos />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/reportes"
          element={
            <ProtectedRoute allowedRoles={["Administrador"]}>
              <DashboardLayout>
                <Reportes />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
