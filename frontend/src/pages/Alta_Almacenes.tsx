import { useState } from 'react';
import { Box, Modal, Button,Group, Title } from '@mantine/core';
import Formulario_Subalmacenes from "../components/forms/Formulario_Alta_Subalmacenes";
import Tabla_Subalmacenes from "../components/tables/Table_Subalmacenes";
import '../styles/Alta_Almacen.css';
import { IconX } from "@tabler/icons-react";

const Alta_Almacen = () => {
  const [opened, setOpened] = useState(false);

  return (
    <div className="alta-almacen-container">

     

      {/* Modal con formulario */}
     <Modal
  opened={opened}
  onClose={() => setOpened(false)}
  title="Alta de Sub Almacén"
  centered
  size="lg"
  overlayProps={{ opacity: 0.55, blur: 3 }}
  closeOnClickOutside={false}
  zIndex={3000}
  styles={{
    header: {
      position: "sticky",
      top: 0,
      backgroundColor: "#003366", // azul institucional
      color: "white",
      fontWeight: "bold",
      zIndex: 1,
    },
    title: { color: "white" },
    body: { maxHeight: "70vh", overflowY: "auto" },
  }}
>
  <Formulario_Subalmacenes />

  {/* Botón de cierre adicional */}
  <Group mt="md" justify="flex-end">
    <Button
      variant="outline"
      color="gray"
      onClick={() => setOpened(false)}
      leftSection={<IconX size={16} />}
    >
      Cerrar
    </Button>
  </Group>
</Modal>

 
     
      {/* Tabla */}
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
         <div className="header-actions">



          
        <Button onClick={() => setOpened(true)} className="open-modal-btn">
          + Nuevo Subalmacén
        </Button>
      </div>
        <Tabla_Subalmacenes />
      </Box>
    </div>
  );
};

export default Alta_Almacen;