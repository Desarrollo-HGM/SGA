import api from "../config/api";
import type { CartItem } from "../types/global";
import type { User } from "../types/User";

// tiposSolicitudPorRol ya lo tienes definido

export const enviarSolicitudFinal = async (
  cart: CartItem[],
  user: User

) => {


  
  if (cart.length === 0) {
    throw new Error("El carrito está vacío");
  }



  const payload = {
    tipo_solicitud: "Clinica",
    id_medico: user.id,
    id_servicio: cart[0].id_servicio,
    id_subalmacen: cart[0].id_subalmacen,
    justificacion: cart[0].justificacion || "",
    insumos: cart.map((item) => ({
      id_insumos: item.id,
      cantidad: item.cantidad,
    })),
  };



  const response = await api.post("/api/solicitudes/final", payload);
  return response.data;
};
