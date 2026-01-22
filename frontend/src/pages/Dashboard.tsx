import { useState } from "react";
import { Stepper, Button, Group } from "@mantine/core";
import { useAuth } from "../hooks/useAuth";
import React from "react";
import '@mantine/core/styles.css';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [active, setActive] = useState(0);

  const nextStep = () =>
    setActive((current) => (current < 3 ? current + 1 : current));
  const prevStep = () =>
    setActive((current) => (current > 0 ? current - 1 : current));

  return (
    <div className="dashboard-page">
      <h1>Usuario: {user?.username}</h1>

      <Stepper active={active} onStepClick={setActive}>
        <Stepper.Step label="Primer paso" description="Completar perfil">
          <p>Paso 1: Completa tu perfil</p>
        </Stepper.Step>
        <Stepper.Step label="Segundo paso" description="Verificar correo">
          <p>Paso 2: Verifica tu correo electrónico</p>
        </Stepper.Step>
        <Stepper.Step label="Último paso" description="Acceso completo">
          <p>Paso 3: Obtén acceso completo</p>
        </Stepper.Step>
      </Stepper>

      <Group justify="center" mt="xl">
        <Button variant="default" onClick={prevStep}>
          Atrás
        </Button>
        <Button onClick={nextStep}>Siguiente</Button>
      </Group>
    </div>
  );
};

export default DashboardPage;