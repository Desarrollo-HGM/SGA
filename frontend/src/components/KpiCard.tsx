import React from "react";
import { Link } from "react-router-dom";

interface KpiCardProps {
  title: string;
  value: number;
  link: string;
}

const KpiCard: React.FC<KpiCardProps> = ({ title, value, link }) => (
  <div className="kpi-card">
    <h3>{title}</h3>
    <p>{value}</p>
    <Link to={link}>Ver más</Link>
  </div>
);

export default KpiCard;
