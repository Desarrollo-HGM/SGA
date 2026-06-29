import api from "../config/api";
import type { CartItem } from "../types/global";
import type { User } from "../types/User";

export const enviarSolicitudFinal = async (
  cart: CartItem[],
  user: User,
  tipoSolicitud: string, // <-- 1. Cachamos el tipo de solicitud dinámico
  justificacion: string  // <-- 2. Cachamos la justificación general del componente
) => {
  
  if (cart.length === 0) {
    throw new Error("El carrito está vacío");
  }

  // 3. Construimos el payload con las variables dinámicas
  const payload = {
    tipo_solicitud: tipoSolicitud, // <-- Reemplaza el string fijo "Clinica"
    id_medico: user.id,
    id_servicio: cart[0].id_servicio,
    id_subalmacen: cart[0].id_subalmacen,
    // Usa la justificación general del componente, o el respaldo del primer ítem
    justificacion: justificacion || cart[0].justificacion || "", 
    insumos: cart.map((item) => ({
      id_insumos: item.id,
      cantidad: item.cantidad,
    })),
  };

  const response = await api.post("/api/solicitudes/final", payload);
  return response.data;
};
