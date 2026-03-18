import type { Insumo } from "../../types/global";

/* INVENTARIO DEMO */

export const inventarioMock: Insumo[] = [
  {
    id: 1,
    clave: "INS-001",
    insumo: "Guantes",
    tipo_insumo: "Material de curación",
    unidad_distribucion: "Caja",
    servicio: "Urgencias",
    subalmacen: "NEFROLOGÍA",
    lote: "L01",
    stock: 100,
    minimo: 50,
    maximo: 100
  },
  {
    id: 2,
    clave: "INS-002",
    insumo: "Cubrebocas",
    tipo_insumo: "Equipo de protección",
    unidad_distribucion: "Caja",
    servicio: "Laboratorio",
    subalmacen: "NEFROLOGÍA",
    lote: "L02",
    stock: 80,
    minimo: 60,
    maximo: 120
  },
  {
    id: 3,
    clave: "INS-003",
    insumo: "Jeringas",
    tipo_insumo: "Material médico",
    unidad_distribucion: "Paquete",
    servicio: "Enfermería",
    subalmacen: "NEFROLOGÍA",
    lote: "L03",
    stock: 50,
    minimo: 30,
    maximo: 60
  },
  {
    id: 4,
    clave: "INS-004",
    insumo: "Gasas",
    tipo_insumo: "Material de curación",
    unidad_distribucion: "Paquete",
    servicio: "Hospitalización",
    subalmacen: "NEFROLOGÍA",
    lote: "L04",
    stock: 120,
    minimo: 95,
    maximo: 190
  },
  {
    id: 5,
    clave: "INS-005",
    insumo: "Alcohol",
    tipo_insumo: "Antiséptico",
    unidad_distribucion: "Frasco",
    servicio: "Quirófano",
    subalmacen: "NEFROLOGÍA",
    lote: "L05",
    stock: 60,
    minimo: 70,
    maximo: 140
  }
];