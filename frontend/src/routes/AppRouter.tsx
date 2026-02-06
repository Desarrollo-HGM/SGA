// src/router/AppRouter.tsx
import { Routes, Route, Navigate } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";

import DashboardPage from "../pages/Dashboard";
import Alta_AlmacenesPage from "../pages/Alta_Almacenes";
import MovimientosPage from "../pages/Movimientos";
import LoginPage from "../pages/Login";
import ReportesPage from "../pages/Reportes";
import Lotes_CaducidadesPage from "../pages/Lotes_Caducidades";
import ReabastecimientoPage from "../pages/Reabastecimiento";
import InventarioPage from "../pages/Inventario";
import Stock_AlmacenPage from "../pages/Stock_Almacen";




import { useAuth } from "../hooks/useAuth";
import type { JSX } from "react";
import View_Solicitudes_Almacen from "../pages/View_Solicitudes_Almacen";

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
          <PrivateRoute>
            <DashboardLayout>
              <DashboardPage />
            </DashboardLayout>
          </PrivateRoute>
        }
      />

 <Route
        path="/view_solicitudes_almacen"
        element={
          <PrivateRoute>
            <DashboardLayout>
              <View_Solicitudes_Almacen />
            </DashboardLayout>
          </PrivateRoute>
        }
      />


 <Route
        path="/Stock_Almacen"
        element={
          <PrivateRoute>
            <DashboardLayout>
              <Stock_AlmacenPage />
            </DashboardLayout>
          </PrivateRoute>
        }
      />


      <Route
        path="/alta_almacenes"
        element={
          <PrivateRoute>
            <DashboardLayout>
              <Alta_AlmacenesPage />
            </DashboardLayout>
          </PrivateRoute>
        }
      />


      <Route
        path="/movimientos"
        element={
          <PrivateRoute>
            <DashboardLayout>
              <MovimientosPage />
            </DashboardLayout>
          </PrivateRoute>
        }
      />
       <Route
        path="/reportes"
        element={
          <PrivateRoute>
            <DashboardLayout>
              <ReportesPage />
            </DashboardLayout>
          </PrivateRoute>
        }
      />

      <Route
        path="/lotes_caducidades"
        element={
          <PrivateRoute>
            <DashboardLayout>
              <Lotes_CaducidadesPage />
            </DashboardLayout>
          </PrivateRoute>
        }
      />
       
           <Route
        path="/reabastecimiento"
        element={
          <PrivateRoute>
            <DashboardLayout>
              <ReabastecimientoPage />
            </DashboardLayout>
          </PrivateRoute>
        }
      />

 <Route
        path="/inventario"
        element={
          <PrivateRoute>
            <DashboardLayout>
              <InventarioPage />
            </DashboardLayout>
          </PrivateRoute>
        }
      />


      {/* Redirección por defecto */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}
