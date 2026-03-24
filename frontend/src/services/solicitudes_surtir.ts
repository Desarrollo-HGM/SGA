export const getDetalleSolicitud = async (id: number) => {
  const res = await fetch(`/api/solicitudes/${id}/detalle`);

  if (!res.ok) {
    throw new Error("Error al obtener detalle");
  }

  return res.json();
};