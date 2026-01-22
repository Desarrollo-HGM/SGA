
import React from "react";
import { useAuth } from "../hooks/useAuth";
import { useAuth as useAuthHook } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";




const Header: React.FC = () => {
  const { user } = useAuth();
  const { logout } = useAuthHook();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="app-header">
      <div className="app-header-left">
        <h2>SGA</h2>
      </div>
      <div className="app-header-right">
        <span className="user-info">
          {user?.nombreCompleto} ({user?.role})
        </span>
        <button className="logout-btn" onClick={handleLogout}>
          <i className="fas fa-sign-out-alt"></i> Salir
        </button>



        <div>
    </div>

      </div>
    </header>
    










  );
};

export default Header;
