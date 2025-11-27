// src/context/AuthContext.tsx
import { createContext, useState, useEffect } from "react";
import { login as loginService, validateToken } from "../services/auth";
import type { User } from "../types/User"; // define la interfaz con role

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (username: string, password: string) => Promise<{ user: User; token: string }>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
  const savedToken = localStorage.getItem("token");
  const savedUser = localStorage.getItem("user");
  console.log("🔄 AuthContext.useEffect inicial:", { savedToken, savedUser });

  if (savedToken) {
    validateToken()
      .then((res) => {
        console.log("🔍 validateToken resultado:", res);
        if (res.valid) {
          setToken(savedToken);
          if (savedUser) setUser(JSON.parse(savedUser));
          console.log("✅ Token válido, usuario restaurado:", JSON.parse(savedUser || "{}"));
        } else {
          logout();
        }
      })
      .catch((err) => {
        console.error("❌ Error en validateToken:", err);
        logout();
      });
  }
}, []);


  const login = async (username: string, password: string) => {
  const { token, user } = await loginService(username, password);
  console.log("📥 AuthContext.login recibido:", { user, token }); // 👈 log recibido del servicio
  setUser(user);
  setToken(token);
  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user));
  console.log("💾 AuthContext.login guardado en estado:", { user, token }); // 👈 log guardado
  return { user, token };
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
}
