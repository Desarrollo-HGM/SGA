import {
  Drawer,
  Card,
  Group,
  Text,
  Badge,
  ScrollArea,
  NumberInput,
  Loader,
  Center,
  Textarea,
  ThemeIcon,
  ActionIcon
} from "@mantine/core";

import { DataTable } from "mantine-datatable";
import { useEffect, useState,useMemo  } from "react";

import {
  
  IconX,
  IconAlertTriangle,
  IconPackages
} from "@tabler/icons-react";

import { getDetalleSolicitud } from "../../services/solicitudes";
import { generarPDF } from "../../utils/generarPDF_surtir";
import type { DetalleSolicitudResponse } from "../../services/solicitudes";
import DrawerCancelarSolicitud from "./DrawerCancelarSolicitud";
import AccionesSolicitud from "../botones/BotonesAccionesSolicitudSurtir";

interface Props {
  opened: boolean;
  onClose: () => void;
  idSolicitud: number | null;
}

export default function ModalDetalleSolicitud({
  opened,
  onClose,
  idSolicitud
}: Props) {

  const [loading, setLoading] = useState(false);
  const [solicitudCabecera, setSolicitudCabecera] = useState<DetalleSolicitudResponse | null>(null);
  const [detalle, setDetalle] = useState<any[]>([]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [openCancel, setOpenCancel] = useState(false);
  const [motivo, setMotivo] = useState("");

  /* ================= FETCH DATA ================= */
  useEffect(() => {
    if (!idSolicitud || !opened) return;

    const fetchDetalle = async () => {
      setLoading(true);
      try {
        const data = await getDetalleSolicitud(idSolicitud);
        setSolicitudCabecera(data);

        const listaInsumos = data.insumos || [];
        
        setDetalle(
          listaInsumos.map((insumo) => ({
            ...insumo,
            // Inicializamos la cantidad a surtir sugiriendo por defecto la cantidad pedida
            solicitado: insumo.cantidad || 0 
          }))
        );
        setIsSubmitted(false); 
      } catch (error) {
        console.error("Error al obtener el detalle:", error);
      } finally {
        setLoading(false);
      }
    }; 
    fetchDetalle();
  }, [idSolicitud, opened]);

  



  /* ================= ACCIÓN SURTIR ================= */
  const handleSurtir = async () => {
    const items = detalle.filter(i => i.solicitado > 0);

    if (!items.length) {
      alert("No hay insumos seleccionados para surtir.");
      return;
    }

    try {
      setIsSubmitting(true);
      await generarPDF({
        cart: items,
        quienSurte: solicitudCabecera?.nombre_subalmacen || "Farmacia Principal",
        quienRecibe: solicitudCabecera?.nombre_servicio || "Servicio",
        justificacion_parcial: esSurtidoParcial ? justificacionParcial : null
      });
      setIsSubmitted(true);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };



  
  /* ================= ACCIÓN CANCELAR ================= */
  const handleCancelar = () => {
    if (!motivo.trim()) {
      alert("Debes escribir un motivo de cancelación.");
      return;
    }
    console.log("Cancelar solicitud:", idSolicitud, motivo);
    setOpenCancel(false);
    setMotivo("");
    onClose();
  };
  // ================= ESTADOS PARA SELECCIÓN Y PARCIALIDAD =================
  const [registrosSeleccionados, setRegistrosSeleccionados] = useState<any[]>([]);
  const [justificacionParcial, setJustificacionParcial] = useState("");

    /* ================= REGLA DIRECTA EN EL INPUT (MÁS O MENOS) ================= */
  const handleCantidadChange = (idDetalle: number, value: number) => {
    // Forzamos a que la cantidad sea como mínimo 1
    const cantidadValidada = value < 1 ? 1 : value;

    setDetalle(prev => {
      const nuevoDetalle = prev.map(item => {
        if (item.id_detalle === idDetalle) {
          // 🔥 REGLA: Si lo solicitado en el input es DIFERENTE a la Cant. Pedida, requiere justificar
          const esDiferente = Number(cantidadValidada) !== Number(item.cantidad);
          
          return { 
            ...item, 
            solicitado: cantidadValidada,
            es_parcial_fila: esDiferente // Enciende la bandera si se capturó de más o de menos
          };
        }
        return item;
      });

      // Sincroniza en tiempo real con los registros seleccionados por el checkbox
      setRegistrosSeleccionados(prevSelected =>
        prevSelected.map(selItem => {
          const itemActualizado = nuevoDetalle.find(d => d.id_detalle === selItem.id_detalle);
          return itemActualizado ? itemActualizado : selItem;
        })
      );

      return nuevoDetalle;
    });
  };




    /* ================= EVALUACIÓN DE PARCIALIDAD O DESVÍO DE CANTIDADES ================= */
  const esSurtidoParcial = useMemo(() => {
    if (detalle.length === 0 || registrosSeleccionados.length === 0) return false;
    
    // CONDICIÓN A: Quedaron insumos de la solicitud original sin seleccionar con el Checkbox
    if (registrosSeleccionados.length < detalle.length) return true;
    
    // CONDICIÓN B: Filtra los insumos que el operador tiene activos con la casilla
    const idsSeleccionados = registrosSeleccionados.map(r => r.id_detalle);
    const insumosActivos = detalle.filter(item => idsSeleccionados.includes(item.id_detalle));
    
    // Si alguna celda activa determinó que se surte de más o de menos, muestra el Textarea
    return insumosActivos.some(item => item.es_parcial_fila === true);
  }, [detalle, registrosSeleccionados]);




  /* ================= FILTRAR CARACTERES ESPECIALES ================= */
  const handleJustificacionChange = (text: string) => {
    // Acepta solo letras, números, espacios y acentos/diéresis comunes en español
    const limpio = text.replace(/[^a-zA-Z0-9áéíóúÁÉÍÓÚñÑüÜ\s]/g, "");
    setJustificacionParcial(limpio);
  };

  /* ================= REGLA DE ACTIVACIÓN DEL BOTÓN ================= */
  const botonSurtirDeshabilitado = useMemo(() => {
    // Deshabilitado si está enviando, ya se envió, o no hay ningún renglón seleccionado
    if (isSubmitting || isSubmitted || registrosSeleccionados.length === 0) return true;
    
    // Deshabilitado si el surtido es parcial/incompleto pero la justificación está vacía
    if (esSurtidoParcial && !justificacionParcial.trim()) return true;
    
    return false;
  }, [isSubmitting, isSubmitted, registrosSeleccionados, esSurtidoParcial, justificacionParcial]);

  /* ================= RESETEAR ESTADOS AL CERRAR O CAMBIAR SOLICITUD ================= */
  useEffect(() => {
    if (!opened) {
      setRegistrosSeleccionados([]);
      setJustificacionParcial("");
    }
  }, [opened]);

  return (
    <>
         <Drawer
        opened={opened}
        onClose={onClose}
        position="bottom"
        size="85%" // Incrementado ligeramente para dar espacio al área de justificación si aparece
        radius="lg"
        overlayProps={{ blur: 3 }}
        withCloseButton={false}
      >
        {/* HEADER */}
        <Group justify="space-between" mb="md">
          <Group>
            <ThemeIcon size="lg" radius="xl" color="teal" variant="light">
              <IconPackages size={20} />
            </ThemeIcon>
            <Text fw={700} size="lg">
              Detalle solicitud #{idSolicitud}
            </Text>

            {esSurtidoParcial && (
              <Badge color="orange" variant="light">
                Surtido Incompleto Detectado (Permanecerá Abierta)
              </Badge>
            )}


          </Group>

          <ActionIcon variant="light" color="red" size="lg" radius="xl" onClick={onClose}>
            <IconX size={18} />
          </ActionIcon>
        </Group>

        {/* TABLA DE ARTÍCULOS */}
        <Card
          withBorder
          radius="md"
          shadow="sm"
          style={{
            borderLeft: "6px solid #0b6fa4",
            background: "#f8fbfd"
          }}
        >
          <Group justify="space-between" mb="sm">
            <Text fw={700} size="lg" c="#0b6fa4">
              Insumos de la Solicitud
            </Text>
            <Badge color="blue" variant="light">
              {detalle.length} registros
            </Badge>
          </Group>

          <ScrollArea h={300}>
            {loading ? (
              <Center h={200}>
                <Loader />
              </Center>
            ) : (
              <DataTable
                striped
                highlightOnHover
                records={detalle}
                idAccessor="id_detalle"
                
                // 🔥 SELECCIÓN EN CASCADA (Permite elegir uno o todos con checkboxes automáticos)
                selectedRecords={registrosSeleccionados}
                onSelectedRecordsChange={setRegistrosSeleccionados}
                
                noRecordsText="No hay insumos en esta solicitud."
                columns={[
                  { accessor: "id_detalle", title: "#", textAlign: "center", width: 100 },
                 { accessor: "nombre_almacen", title: "Almacen", textAlign: "center", width: 100 },
                  { accessor: "descripcion", title: "Descripción del Insumo" },
                  { 
                    accessor: "cantidad", 
                    title: "Cant. Pedida", 
                    textAlign: "center",
                    render: (r) => <Text fw={700}>{r.cantidad}</Text>
                  },
                  { accessor: "id_lote", title: "Lote", textAlign: "center" },
                  {
                    accessor: "estado",
                    title: "Estado Artículo",
                    textAlign: "center",
                    render: (r) => (
                      <Badge color={r.estado === "Pendiente" ? "orange" : "green"} variant="light">
                        {r.estado}
                      </Badge>
                    )
                  },
                                      {
                    accessor: "solicitado",
                    title: "Cantidad a Surtir",
                    textAlign: "center",
                    render: (r) => (
                      <NumberInput
                        value={r.solicitado}
                        min={1} 
                        // 🔥 max={r.cantidad} <-- REMOVIDO para permitir surtir de más
                        allowNegative={false}
                        allowDecimal={false}
                        onChange={(val) => handleCantidadChange(r.id_detalle, Number(val))}
                        style={{ width: 90, margin: "auto" }}
                      />
                    )
                  }


                ]}
              />
            )}
          </ScrollArea>

          {/* 🔥 ÁREA DE JUSTIFICACIÓN SI EL SURTIDO ES PARCIAL O QUEDAN INSUMOS SIN SELECCIONAR */}
          {esSurtidoParcial && (
            <Card withBorder radius="md" mt="md" bg="#fff9db" style={{ borderColor: "#fcc419" }}>
              <Group gap="xs" mb="xs">
                <IconAlertTriangle size={18} color="#f59f00" />
                <Text size="sm" fw={600} c="#f59f00">
                  Justificación de Surtido Parcial Requerida (La solicitud permanecerá abierta)
                </Text>
              </Group>
              <Textarea
                placeholder="Explique el motivo del surtido incompleto o insumos faltantes (solo letras y números)..."
                value={justificacionParcial}
                // Llama al método de limpieza regex que no admite caracteres especiales
                onChange={(e) => handleJustificacionChange(e.currentTarget.value)}
                minRows={2}
                required
              />
            </Card>
          )}

   <AccionesSolicitud
    isSubmitting={isSubmitting}
    isSubmitted={isSubmitted}
    botonSurtirDeshabilitado={botonSurtirDeshabilitado}
    handleSurtir={handleSurtir}
    handleCancelar={() => setOpenCancel(true)}
/>


        </Card>
      </Drawer>

<DrawerCancelarSolicitud
    opened={openCancel}
    onClose={() => setOpenCancel(false)}
    idSolicitud={idSolicitud}
    motivo={motivo}
    setMotivo={setMotivo}
    onConfirm={handleCancelar}
/>
      
    </>
  );
}
