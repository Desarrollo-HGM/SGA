import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import type { JSX } from "react/jsx-dev-runtime";

interface Props {
  children: JSX.Element;
  allowedRoles: string[];
}

export const ProtectedRoute = ({ children, allowedRoles }: Props) => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;
  if (!allowedRoles.includes(user.rol)) return <Navigate to="/unauthorized" replace />;

  return children;
};
