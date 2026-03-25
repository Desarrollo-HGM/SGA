import { useState, useEffect, useRef } from "react";
import { getInventario } from "../services/inventario";
import type { Insumo } from "../types/global";

export const useInventario = () => {
  const [data, setData] = useState<Insumo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [changedIds, setChangedIds] = useState<number[]>([]);

  const prevDataRef = useRef<Insumo[]>([]);

  const fetchInventario = async () => {
    try {
      const result = await getInventario();

      // Detectar cambios
      const changed: number[] = [];
      result.forEach((item, i) => {
        const prevItem = prevDataRef.current[i];
        if (
          !prevItem ||
          prevItem.stock !== item.stock ||
          prevItem.minimo !== item.minimo ||
          prevItem.maximo !== item.maximo
        ) {
          changed.push(item.id);
        }
      });

      setData(result);
      setChangedIds(changed);

      prevDataRef.current = result;
      setError(null);
    } catch (err: any) {
      setError(err?.message || "Error al cargar inventario");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventario();
    const interval = setInterval(fetchInventario, 3000); // 🔥 actualiza cada 3 segundos
    return () => clearInterval(interval);
  }, []);

  return { data, loading, error, changedIds };
};