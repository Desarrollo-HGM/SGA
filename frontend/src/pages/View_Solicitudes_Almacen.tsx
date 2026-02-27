
import View_solicitudes_almacen from "../components/tables/Table_Solicitudes";
import Stock from "../components/tables/Table_Stock_Subalmacen_Main";
import { Box, Title, Grid } from '@mantine/core';

export default function SeccionSolicitudes() {
  return (
    <Box className="tabla-section">
      <Title
        order={6}
        style={{
          fontWeight: 900,
          color: '#003366',
          borderBottom: '1px solid #D1D5DB',
          paddingBottom: 4,
          marginBottom: 6,
        }}
      >
        Solicitudes
      </Title>

      <Grid>
        {/* Columna izquierda: solicitudes */}
        <Grid.Col span={6}>
          <Box mt={-50}>
            <View_solicitudes_almacen />
          </Box>
        </Grid.Col>

        {/* Columna derecha: almacenes */}
        <Grid.Col span={6}>
          <Box mt={-50}>
            
          <Stock />
          </Box>
        </Grid.Col>
      </Grid>
    </Box>
  );
}