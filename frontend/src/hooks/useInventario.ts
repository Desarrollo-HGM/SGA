import { useEffect, useState } from "react";
import { getInventario } from "../services/inventario";
import type { Insumo } from "../types/global";

export const useInventario = () => {
  const [data, setData] = useState<Insumo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchInventario = async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await getInventario();
      setData(result);

    } catch (err: any) {
      setError(err?.message || "Error al cargar inventario");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventario();
  }, []);

  return {
    data,
    loading,
    error,
    refetch: fetchInventario,
  };
};