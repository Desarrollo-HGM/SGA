import { useEffect, useRef, useState } from "react";
import {
  Indicator,
  Drawer,
  Group,
  ThemeIcon,
  Text,
  ActionIcon,
  Stack
} from "@mantine/core";

import { IconBell, IconPackages, IconX } from "@tabler/icons-react";

import CampanaSolicitudes from "./CampanaSolicitudes";
import { getSolicitudes } from "../../services/solicitudes";
import type { Solicitud } from "../../services/solicitudes";

export default function CampanaContainer() {

  const [opened, setOpened] = useState(false);
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
  const prevCountRef = useRef(0);

  /* 🔄 FETCH */
  useEffect(() => {
    const fetchData = async () => {
      const data = await getSolicitudes();

      const sorted = data.sort((a, b) =>
        new Date(b.fecha_solicitud).getTime() -
        new Date(a.fecha_solicitud).getTime()
      );

      setSolicitudes(sorted);
    };

    fetchData();
    const interval = setInterval(fetchData, 10000);

    return () => clearInterval(interval);
  }, []);

  /* 🔊 SONIDO */
  useEffect(() => {
    if (solicitudes.length > prevCountRef.current) {
      new Audio("/beep.mp3").play().catch(() => {});
    }
    prevCountRef.current = solicitudes.length;
  }, [solicitudes]);

  return (
    <>
      {/* 🔔 ICONO */}
      <Indicator
        inline
        label={solicitudes.length || undefined}
        size={16}
        color="orange"
      >
        <IconBell
          size={28}
          style={{ cursor: "pointer" }}
          onClick={() => setOpened(true)}
        />
      </Indicator>

      {/* 🔔 DRAWER */}
      <Drawer
        opened={opened}
        onClose={() => setOpened(false)}
        position="bottom"
        size="65%"
        radius="lg"
        overlayProps={{ blur: 3 }}
        withCloseButton={false}
      >
        <Group justify="space-between" mb="md">
          <Group>
            <ThemeIcon size="lg" radius="xl" color="teal" variant="light">
              <IconPackages size={20} />
            </ThemeIcon>
            <Text fw={700} size="lg">Solicitudes</Text>
          </Group>

          <ActionIcon
            variant="light"
            color="red"
            size="lg"
            radius="xl"
            onClick={() => setOpened(false)}
          >
            <IconX size={18} />
          </ActionIcon>
        </Group>

        {solicitudes.length === 0 ? (
          <Stack align="center" justify="center" h={200}>
            <ThemeIcon size={60} radius="xl" variant="light" color="gray">
              <IconBell size={30} />
            </ThemeIcon>
            <Text c="dimmed">No hay solicitudes registradas</Text>
          </Stack>
        ) : (
          <CampanaSolicitudes data={solicitudes} />
        )}
      </Drawer>
    </>
  );
}