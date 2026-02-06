
import { Box,Title } from '@mantine/core';
import View_solicitudes_almacen from "../components/tables/Table_Solicitudes";

const View_Solicitudes_Almacen = () => {
 
  return (
    <div className="alta-almacen-container"> 
    
  
  <Box className="tabla-section">
  <Title order={6} style={{ fontWeight: 900, color: '#003366', borderBottom: '1px solid #D1D5DB', paddingBottom: 4, marginBottom: 6 }}>
    Solicitudes
  </Title>
  <Box mt={-50}>
    <View_solicitudes_almacen />
  </Box>
</Box>
    </div>
  );
};

export default View_Solicitudes_Almacen;