// src/components/StockTable.tsx
import React, { useEffect, useState } from "react";
import type { GridColDef } from "@mui/x-data-grid";
import { DataGrid } from "@mui/x-data-grid";
import { stockService } from "../services/stockService";
import type {StockItem} from "../services/stockService";

const columns: GridColDef[] = [
  { field: "nombre_insumo", headerName: "Insumo", flex: 1 },
  { field: "nombre_subalmacen", headerName: "Subalmacén", flex: 1 },
  { field: "stock_total_insumo", headerName: "Stock Actual", type: "number", flex: 0.5 },
  { field: "minimo", headerName: "Mínimo", type: "number", flex: 0.5 },
  { field: "maximo", headerName: "Máximo", type: "number", flex: 0.5 },
  { field: "estado", headerName: "Estado", flex: 0.7 },
];

const StockTable: React.FC = () => {
  const [rows, setRows] = useState<StockItem[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await stockService.getConsolidado();
        setRows(data);
      } catch (err) {
        console.error("Error cargando stock", err);
      }
    };
    fetchData();
  }, []);

  return (
    <div style={{ height: 500, width: "100%" }}>
      <DataGrid
        rows={rows}
        columns={columns}
        paginationModel={{ pageSize: 10, page: 0 }}
        pageSizeOptions={[10, 20, 50]}
        disableRowSelectionOnClick
      />
    </div>
  );
};

export default StockTable;
