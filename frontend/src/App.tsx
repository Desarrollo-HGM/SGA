// src/App.tsx
import { BrowserRouter, useLocation } from "react-router-dom";
import AppRouter from "./routes/AppRouter";
import { TokenAlert } from "./config/TokenAlert";

function AppContent() {
  const accessToken = localStorage.getItem("accessToken");
  const refreshToken = localStorage.getItem("refreshToken");
  const location = useLocation();

  const isLoginPage = location.pathname === "/login";

  return (
    <>
      {/* Alerta de expiración de sesión solo dentro del sistema */}
      {!isLoginPage && accessToken && refreshToken && (
        <TokenAlert accessToken={accessToken} refreshToken={refreshToken} />
      )}

      {/* Rutas principales */}
      <AppRouter />
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
