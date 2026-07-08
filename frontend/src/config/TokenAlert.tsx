// src/components/TokenAlert.tsx
import { useEffect, useState } from "react";
import { Modal, Button, Text, Progress, Group } from "@mantine/core";
import { jwtDecode } from "jwt-decode";
import Swal from "sweetalert2";
import { refreshToken as refreshTokenService } from "../services/auth";

interface TokenAlertProps {
  accessToken: string;
  refreshToken: string;
}

export function TokenAlert({ accessToken, refreshToken }: TokenAlertProps) {
  const [opened, setOpened] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [totalTime] = useState(30);

  useEffect(() => {
    if (!accessToken) return;

    const decoded: any = jwtDecode(accessToken);
    const exp = decoded.exp * 1000;
    const now = Date.now();

    const msRemaining = exp - now;
    const triggerTime = msRemaining - 30000;

    if (triggerTime <= 0) {
      setOpened(true);
      setTimeLeft(30);
    } else {
      setTimeout(() => {
        setOpened(true);
        setTimeLeft(30);
      }, triggerTime);
    }
  }, [accessToken]);

  useEffect(() => {
    if (!opened) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          cerrarSesion();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [opened]);

  const continuarSesion = async () => {
    try {
      const { accessToken: newToken } = await refreshTokenService(refreshToken);


      localStorage.setItem("accessToken", newToken);
      setOpened(false);

      Swal.fire({
        icon: "success",
        title: "Sesión renovada",
        text: "Tu sesión ha sido extendida correctamente",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch {
      cerrarSesion();
    }
  };

  const cerrarSesion = () => {
    Swal.fire({
      icon: "error",
      title: "Sesión expirada",
      text: "Debes iniciar sesión nuevamente",
      confirmButtonText: "Aceptar",
    }).then(() => {
      localStorage.clear();
      window.location.href = "/login";
    });
  };

  return (
    <Modal
      opened={opened}
      onClose={() => {}}
      withCloseButton={false}
      centered
      overlayProps={{ opacity: 0.4, blur: 2 }}
      title={
        <Text fw={700} size="lg" c="#0D47A1">
          Tu sesión está por expirar
        </Text>
      }
    >
      <Text mb="sm">
        Para continuar usando el sistema, confirma que deseas mantener tu sesión activa.
      </Text>

      <Group justify="space-between" mb="xs">
        <Text fw={600}>Tiempo restante:</Text>
        <Text fw={700} c="red">
          {timeLeft} segundos
        </Text>
      </Group>

      <Progress value={(timeLeft / totalTime) * 100} color="blue" size="lg" mb="lg" />

      <Button fullWidth color="blue" onClick={continuarSesion}>
        Continuar sesión
      </Button>
    </Modal>
  );
}
