// src/config/menuItems.ts
export interface MenuItem {
  path: string;
  icon: string;
  label: string;
  roles: string[];
  divider?: boolean; // opcional para insertar <hr />
}

export const menuItems: MenuItem[] = [
  { path: "/dashboard", icon: "fas fa-box", label: "Inventario", roles: ["Administrador", "Usuario"] },
  { path: "/solicitudes", icon: "fas fa-file-alt", label: "Solicitudes", roles: ["Administrador", "Usuario"] },
  { path: "/movimientos", icon: "fas fa-exchange-alt", label: "Movimientos", roles: ["Administrador"] },
  { path: "/reportes", icon: "fas fa-chart-line", label: "Reportes", roles: ["Administrador"] },
];
