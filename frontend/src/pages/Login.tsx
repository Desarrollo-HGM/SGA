// src/pages/Login.tsx

import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

import {
  Container,
  Paper,
  TextInput,
  PasswordInput,
  Button,
  Alert,
  Image,
  Flex,
  Divider,
  Text
} from "@mantine/core";

import {
  IconUser,
  IconLock,
  IconAlertCircle,
  IconCheck
} from "@tabler/icons-react";

export default function Login() {
  const { user, token, login } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!username.trim()) {
      setError("Ingrese su usuario institucional");
      return;
    }

    if (!password.trim()) {
      setError("Ingrese su contraseña institucional");
      return;
    }

    try {
      setLoading(true);
      const { user, token } = await login(username, password);

      console.log("✅ Login correcto:", { user, token });
      setSuccess("Acceso correcto, redirigiendo...");

      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);
    } catch (err: any) {
      console.error("❌ Error en login:", err);

      if (err.response) {
        setError(err.response.data.message || "Credenciales inválidas");
      } else if (err.request) {
        setError("No se pudo conectar al servidor");
      } else {
        setError("Error inesperado en login");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && token) {
      navigate("/dashboard");
    }
  }, [user, token, navigate]);

  return (
    <Container size={420} my={120}>
      <Paper shadow="xl" radius="md" p="xl" withBorder>
        <Flex direction="column" align="center" gap="lg">
          <Image
            src="/src/assets/hgm.png"
            alt="Logo institucional"
            height={100}
            fit="contain"
          />

          {error && (
            <Alert
              icon={<IconAlertCircle size={28} />}
              color="red"
              variant="light"
              radius="md"
            >
              {error}
            </Alert>
          )}

          {success && (
            <Alert
              icon={<IconCheck size={18} />}
              color="green"
              variant="light"
              radius="md"
              title="Acceso concedido"
            >
              {success}
            </Alert>
          )}

          <form onSubmit={handleSubmit} style={{ width: "100%" }}>
            <Flex direction="column" gap="md">
              <TextInput
                label="Usuario institucional"
                placeholder="Ingrese su usuario"
                leftSection={<IconUser size={16} />}
                value={username}
                onChange={(e) => setUsername(e.currentTarget.value)}
                required
              />

              <PasswordInput
                label="Contraseña"
                placeholder="Ingrese su contraseña"
                leftSection={<IconLock size={16} />}
                value={password}
                onChange={(e) => setPassword(e.currentTarget.value)}
                required
              />

              <Button
                type="submit"
                fullWidth
                loading={loading}
                size="md"
                variant="light"
                color="blue"
                radius="md"
              >
                Ingresar al sistema
              </Button>
            </Flex>
          </form>

          <Divider my="sm" />

          <Text size="sm" c="dimmed" ta="center">
            Hospital General de México "Dr. Eduardo Liceaga" © 2026
          </Text>
        </Flex>
      </Paper>
    </Container>
  );
}
