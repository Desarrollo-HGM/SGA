// src/components/Sidebar.tsx
import { Link, useLocation } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { menuItems } from "../components/menuItems";
import "../styles/sidebar.scss";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";


export default function Sidebar() {
  const location = useLocation();
  const auth = useContext(AuthContext);
  const { logout } = useAuth();
  const navigate = useNavigate();
  if (!auth?.user) return null;
  const { user } = auth;

  // Filtrar items según rol
  const filteredMenu = menuItems.filter(item => item.roles.includes(user.role));

const handleLogout = () => {
    logout(); 
    navigate("/login"); 
  };

  return (
    <nav id="nav-bar">
      {/* Toggle superior */}
      <input type="checkbox" id="nav-toggle" />

      <div id="nav-header">
        <span id="nav-title">SGA</span>
        <label htmlFor="nav-toggle">
          <span id="nav-toggle-burger"></span>
        </label>
        <hr />
      </div>

      <div id="nav-content">
        {filteredMenu.map((item, index) =>
          item.divider ? (
            <hr key={index} />
          ) : (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-button ${location.pathname === item.path ? "active" : ""}`}
            >
              <i className={item.icon}></i>
              <span>{item.label}</span>
            </Link>
          )
        )}
        <div id="nav-content-highlight"></div>
      </div>

      {/* Toggle inferior */}
      <input type="checkbox" id="nav-footer-toggle" />

      <div id="nav-footer">
        <div id="nav-footer-heading">
          <div id="nav-footer-avatar">
            <img
              src="https://gravatar.com/avatar/4474ca42d303761c2901fa819c4f2547"
              alt="Avatar"
            />
          </div>
          <div id="nav-footer-titlebox">
            <a
              id="nav-footer-title"
              href="https://codepen.io/uahnbu/pens/public"
              target="_blank"
              rel="noopener noreferrer"
            >
              {user.nombreCompleto}
            </a>
            <span id="nav-footer-subtitle">{user.role}</span>
          </div>
          <label htmlFor="nav-footer-toggle">
            <i className="fas fa-caret-up"></i>
          </label>
        </div>
        <div id="nav-footer-content">
          {/* Aquí puedes poner info dinámica del usuario o dejarlo como placeholder */}
          Bienvenido al sistema de gestión.
           <button className="nav-button logout" onClick={handleLogout}>
          <i className="fas fa-sign-out-alt"></i>
          <span>Salir</span>
        </button>
        </div>
      </div>
    </nav>
  );
}
