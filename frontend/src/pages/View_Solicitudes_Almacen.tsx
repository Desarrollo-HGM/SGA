
import View_solicitudes_almacen from "../components/tables/Table_Solicitudes";
import { Box } from '@mantine/core';

export default function SeccionSolicitudes() {
  return (

  <div className="alta-almacen-container">



    <Box className="tabla-section">
    
      
            <View_solicitudes_almacen />
          </Box>
           

</div>


  );
}