// src/App.tsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Layout from "./components/Layout";
import ProtectedRoute from "./routes/PrivateRoute";
import Dashboard from "./pages/Dashboard";
import Solicitudes from "./pages/Solicitudes";
import Movimientos from "./pages/Movimientos";
import Reportes from "./pages/Reportes";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Ruta pública */}
        <Route path="/login" element={<Login />} />

        {/* Layout protegido */}
        <Route
          path="/"
          element={
            <ProtectedRoute allowedRoles={["Administrador", "Usuario"]}>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route
            path="dashboard"
            element={
              <ProtectedRoute allowedRoles={["Administrador", "Usuario"]}>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="solicitudes"
            element={
              <ProtectedRoute allowedRoles={["Administrador", "Usuario"]}>
                <Solicitudes />
              </ProtectedRoute>
            }
          />
          <Route
            path="movimientos"
            element={
              <ProtectedRoute allowedRoles={["Administrador"]}>
                <Movimientos />
              </ProtectedRoute>
            }
          />
          <Route
            path="reportes"
            element={
              <ProtectedRoute allowedRoles={["Administrador"]}>
                <Reportes />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
