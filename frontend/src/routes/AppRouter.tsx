// src/router/AppRouter.tsx
import { Routes, Route, Navigate } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";

import DashboardPage from "../pages/Dashboard";
import Alta_AlmacenesPage from "../pages/Alta_Almacenes";

import LoginPage from "../pages/Login";
import ReportesPage from "../pages/Reportes";
import Lotes_CaducidadesPage from "../pages/Lotes_Caducidades";







import { useAuth } from "../hooks/useAuth";
import type { JSX } from "react";
import View_Solicitudes_Almacen from "../pages/View_Solicitudes_Almacen";
import { ProtectedRoute } from "./ProtectedRoute";

function PrivateRoute({ children }: { children: JSX.Element }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
}

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route
        path="/"
        element={

 <ProtectedRoute allowedRoles={["almacen","admin","solicitante","guarda"]}>
          <PrivateRoute>
            <DashboardLayout>
              <DashboardPage />
            </DashboardLayout>
          </PrivateRoute>
</ProtectedRoute>

        }
      />

 <Route
        path="/view_solicitudes_almacen"
        element={
         <ProtectedRoute allowedRoles={["admin","guarda","solicitante"]}>
          <PrivateRoute>
            <DashboardLayout>
              <View_Solicitudes_Almacen />
            </DashboardLayout>
          </PrivateRoute>
          </ProtectedRoute>
        }
      />




      <Route
        path="/alta_almacenes"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <PrivateRoute>
              <DashboardLayout>
                <Alta_AlmacenesPage />
              </DashboardLayout>
            </PrivateRoute>
          </ProtectedRoute>
        }
      />


  
       <Route
        path="/reportes"
        element={
          <ProtectedRoute allowedRoles={["almacen","admin"]}>
            <PrivateRoute>
              <DashboardLayout>
                <ReportesPage />
              </DashboardLayout>
            </PrivateRoute>
          </ProtectedRoute>
        }
      />

      <Route
        path="/lotes_caducidades"
        element={
          <ProtectedRoute allowedRoles={["guarda","admin"]}>
            <PrivateRoute>
              <DashboardLayout>
                <Lotes_CaducidadesPage />
              </DashboardLayout>
            </PrivateRoute>
          </ProtectedRoute>
        }
      />
       
         
      
       
         


      {/* Redirección por defecto */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}
