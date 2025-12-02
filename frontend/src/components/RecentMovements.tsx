import React from "react";

interface Movement {
  id_movimiento: number;
  tipo_movimiento: string;
  cantidad: number;
  fecha_movimiento: string;
}

interface Props {
  movimientos: Movement[];
}

const RecentMovements: React.FC<Props> = ({ movimientos }) => (
  <div className="recent-movements">
    <h2>Últimos movimientos</h2>
    <table>
      <thead>
        <tr>
          <th>Tipo</th>
          <th>Cantidad</th>
          <th>Fecha</th>
        </tr>
      </thead>
      <tbody>
        {movimientos.map(m => (
          <tr key={m.id_movimiento}>
            <td>{m.tipo_movimiento}</td>
            <td>{m.cantidad}</td>
            <td>{m.fecha_movimiento}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default RecentMovements;
