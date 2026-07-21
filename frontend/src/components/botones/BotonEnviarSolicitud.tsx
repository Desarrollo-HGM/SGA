import { Button } from "@mantine/core";
import { IconFileInvoice, IconCheck } from "@tabler/icons-react";
import type { CartItem } from "../../types/global";

interface Props {
  isSubmitting: boolean;
  isSubmitted: boolean;
  cart: CartItem[];
  tipoSolicitud: string;
  justificacionGeneral: string;
  onEnviarSolicitud: (tipoSolicitud: string, justificacion: string) => void;
}

export default function BotonEnviarSolicitud({
  isSubmitting,
  isSubmitted,
  cart,
  tipoSolicitud,
  justificacionGeneral,
  onEnviarSolicitud,
}: Props) {
  return (
 
     <div style={{ marginTop: 16, marginBottom: 16 }}>
  <Button
    radius="xl"
    size="md"
    loading={isSubmitting}
    disabled={isSubmitting || isSubmitted || cart.length === 0}
    color={isSubmitted ? "teal" : "green"}
    variant={isSubmitted ? "filled" : "light"}
    leftSection={
      isSubmitted ? <IconCheck size={18} /> : <IconFileInvoice size={18} />
    }
    onClick={() => onEnviarSolicitud(tipoSolicitud, justificacionGeneral)}
    style={{ width: "100%" }} // 👈 ocupa todo el ancho disponible
  >
    {isSubmitted ? "Solicitud enviada" : "Generar solicitud"}
  </Button>
</div>


    
  );
}
