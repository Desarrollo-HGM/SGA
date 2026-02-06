import { useState } from 'react';
import { Box, Modal, Button } from '@mantine/core';
import Formulario_Subalmacenes from "../components/forms/Formulario_Alta_Subalmacenes";
import Tabla_Subalmacenes from "../components/tables/Table_Subalmacenes";
import '../styles/Alta_Almacen.css';

const Alta_Almacen = () => {
  const [opened, setOpened] = useState(false);

  return (
    <div className="alta-almacen-container">
      {/* Botón superior izquierdo */}
     

      {/* Modal con formulario */}
      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title="Alta de Subalmacén"
        size="lg"
        className="modal-almacen"
      >
        <Formulario_Subalmacenes />
      </Modal>

     
      {/* Tabla */}
      <Box className="tabla-section">
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