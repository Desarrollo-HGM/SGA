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
  Title,
  Alert,
  Stack,
  Image
} from "@mantine/core";

import {
  IconUser,
  IconLock,
  IconAlertCircle,
  IconCheck
} from "@tabler/icons-react";

export default function Login() {

  const { login, user, token } = useAuth();
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
      setError("Ingrese su usuario");
      return;
    }

    if (!password.trim()) {
      setError("Ingrese su contraseña");
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

        <Stack>

          <Image
            src="/src/assets/hgm.png"
            alt="Logo HGM"
            height={110}
            fit="contain"
          />

         
          {error && (
            <Alert icon={<IconAlertCircle size={18} />} color="red">
              {error}
            </Alert>
          )}

          {success && (
            <Alert icon={<IconCheck size={18} />} color="green">
              {success}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>

            <Stack>

              <TextInput
                label="Usuario"
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
                color="blue"
              >
                Ingresar al sistema
              </Button>

            </Stack>

          </form>

        </Stack>

      </Paper>

    </Container>

  );
}