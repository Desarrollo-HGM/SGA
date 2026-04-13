import {
  IconClipboardList,
  IconBuildingWarehouse,
  IconArrowsTransferUpDown,
  IconPackages,
  IconCalendarClock,
  IconChartBar,
  IconCalendarEvent,
  IconChevronDown,
  IconLogout,
} from '@tabler/icons-react';
import {
  Box,
  Burger,
  Button,
  Center,
  Collapse,
  Divider,
  Drawer,
  Group,
  HoverCard,
  ScrollArea,
  SimpleGrid,
  Text,
  ThemeIcon,
  UnstyledButton,
  useMantineTheme,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate, Link } from 'react-router-dom';
import classes from '../styles/HeaderMegaMenu.module.css';
import '@mantine/core/styles.css';
import type { TablerIcon } from '@tabler/icons-react';
import CampanaContainer from "../campana/CampanaContainer";
type NavItem = {
  icon: TablerIcon;
  title: string;
  description: string;
  link: string;
};

const mockdata: NavItem[] = [
  {
    icon: IconClipboardList,
    title: 'Solicitudes de Sub Almacén',
    description: 'Visualiza y gestiona las solicitudes',
    link: '/view_solicitudes_almacen',
  },
  {
    icon: IconBuildingWarehouse,
    title: 'Nuevo Subalmacen',
    description: 'Alta y gestión de subalmacenes',
    link: '/Alta_Almacenes',
  },
  {
    icon: IconArrowsTransferUpDown,
    title: 'Surtir Solicitudes',
    description: 'Flujo de entradas y salida de insumos',
    link: '/Movimientos',
  },
  {
    icon: IconPackages,
    title: 'Stock en tiempo real',
    description: 'Insumos existentes en el almacén',
    link: '/Stock_Almacen',
  },
  {
    icon: IconCalendarClock,
    title: 'Lotes y Caducidades',
    description: 'Gestión de lotes y fechas de caducidad',
    link: '/Lotes_Caducidades',
  },
  {
    icon: IconChartBar,
    title: 'Reportes y Análisis',
    description: 'Descarga de reportes detallados',
    link: '/Reportes',
  },
  {
    icon: IconCalendarEvent,
    title: 'Calendario de Reabastecimiento',
    description: 'Calendarización de pedidos de insumos',
    link: '/Reabastecimiento',
  },
];

export function HeaderMegaMenu() {
  const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] = useDisclosure(false);
  const [linksOpened, { toggle: toggleLinks }] = useDisclosure(false);
  const theme = useMantineTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const links = mockdata.map((item) => (
    <UnstyledButton className={classes.subLink} key={item.title} component={Link} to={item.link}>
      <Group wrap="nowrap" align="flex-start">
        <ThemeIcon size={34} variant="light" radius="md" color="blue">
          <item.icon size={22} />
        </ThemeIcon>
        <div>
          <Text size="sm" fw={500}>{item.title}</Text>
          <Text size="xs" c="dimmed">{item.description}</Text>
        </div>
      </Group>
    </UnstyledButton>
  ));

  return (
    <Box pb={20}>
      <header
        className={classes.header}
        style={{
          boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
          position: 'sticky',
          top: 0,
          backgroundColor: '#fff',
          zIndex: 1000,
        }}
      >
        <Group justify="space-between" h="100%" px="md">
          {/* Logo + menú */}
          <Group>
            <img src="/src/assets/hgm.png" alt="Logo HGM" style={{ width: '140px', height: '90px' }} />
            <Group gap={20} visibleFrom="sm">
              <Link to="/Dashboard" className={classes.link}>Dashboard Almacén Central</Link>
              <HoverCard width={600} position="bottom" radius="md" shadow="md" withinPortal>
                <HoverCard.Target>
                  <a href="#" className={classes.link}>
                    <Center inline>
                      <Box component="span" mr={5}>Menú</Box>
                      <IconChevronDown size={16} color={theme.colors.blue[6]} />
                        
                    </Center>
                  </a>
                </HoverCard.Target>
                <HoverCard.Dropdown>
                  <Text fw={500} mb="sm">Módulos</Text>
                  <Divider my="sm" />
                  <SimpleGrid cols={2} spacing={0}>{links}</SimpleGrid>
                  <div className={classes.dropdownFooter}>
                    <h3>Control de Inventarios</h3>
                  </div>
                </HoverCard.Dropdown>
              </HoverCard>
            </Group>
          </Group>

          {/* Usuario + botón */}
          <Group visibleFrom="sm">
            {user ? (
              <>
               <CampanaContainer /> {/* 🔔 CAMPANA (DESACOPLADA) */}
                <Text size="sm" fw={500} c="dimmed">
                  {user.nombreCompleto} ({user.role})
                </Text>
                <Button
                  variant="filled"
                  color="red"
                  onClick={handleLogout}
                  leftSection={<IconLogout size={16} />}
                >
                  Salir
                </Button>
              </>
            ) : (
              <>
                <Button variant="default">Log in</Button>
                <Button variant="filled" color="red">Sign up</Button>
              </>
            )}
          </Group>

          <Burger opened={drawerOpened} onClick={toggleDrawer} hiddenFrom="sm" />
        </Group>
      </header>

      {/* Drawer móvil */}
      <Drawer opened={drawerOpened} onClose={closeDrawer} size="100%" padding="md" title="Menú móvil" hiddenFrom="sm">
        <ScrollArea h="calc(100vh - 80px)" mx="-md">
          <Divider my="sm" />
          <Link to="/Dashboard" className={classes.link}>Dashboard</Link>
          <UnstyledButton className={classes.link} onClick={toggleLinks}>
            <Center inline>
              <Box component="span" mr={5}>Menú</Box>
              <IconChevronDown size={16} color={theme.colors.blue[6]} />
            </Center>
          </UnstyledButton>
          <Collapse in={linksOpened}>{links}</Collapse>
          <Divider my="sm" />
          <Group justify="center" grow pb="xl" px="md">
            {user ? (
              <>
                <Text ta="center" size="sm">{user.nombreCompleto} ({user.role})</Text>
                <Button variant="filled" color="red" onClick={handleLogout}>Salir</Button>
              </>
            ) : (
              <>
                <Button variant="default">Log in</Button>
                <Button variant="filled" color="blue">Sign up</Button>
              </>
            )}
          </Group>
        </ScrollArea>
      </Drawer>
    </Box>
  );
}

export default HeaderMegaMenu;