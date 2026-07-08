// src/context/AuthContext.tsx
import { createContext, useContext, useState, useEffect } from "react";
import { login as loginService, validateToken } from "../services/auth";
import type { User } from "../types/User"; // interfaz con id y rol

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (username: string, password: string) => Promise<{ user: User; token: string }>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // Restaurar sesión desde localStorage
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (savedToken) {
      validateToken()
        .then((res) => {
          if (res.valid) {
            setToken(savedToken);
            if (savedUser) setUser(JSON.parse(savedUser));
          } else {
            logout();
          }
        })
        .catch(() => logout());
    }
  }, []);

  // Login usando el servicio
  const login = async (username: string, password: string) => {
    const { accessToken, user } = await loginService(username, password);

    setUser(user);
    setToken(accessToken);

    localStorage.setItem("token", accessToken);
    localStorage.setItem("user", JSON.stringify(user));

    return { user, token: accessToken };
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook para consumir el contexto
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return ctx;
};
