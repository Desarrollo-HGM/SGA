import {
  IconClipboardList,
  IconBuildingWarehouse,

  IconCalendarClock,
  IconChartBar,

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
import classes from '../../styles/HeaderMegaMenu.module.css';
import '@mantine/core/styles.css';
import type { TablerIcon } from '@tabler/icons-react';
import type { User } from '@/types/User';

type NavItem = {
  icon: TablerIcon;
  title: string;
  description: string;
  link: string;
  rolesPermitidos: User["rol"][];   
};

const mockdata: NavItem[] = [
  {
    icon: IconClipboardList,
    title: 'Solicitudes',
    description: 'Visualiza y gestiona las solicitudes de las guardas',
    link: '/view_solicitudes_almacen',
    rolesPermitidos: ["admin", "guarda", "solicitante"],
  },
  {
    icon: IconBuildingWarehouse,
    title: 'Guardas',
    description: 'Alta y gestión de guardas',
    link: '/Alta_Almacenes',
    rolesPermitidos: ["admin"],
  },
  {
    icon: IconCalendarClock,
    title: 'Lotes y Caducidades',
    description: 'Gestión de lotes y fechas de caducidad',
    link: '/Lotes_Caducidades',
    rolesPermitidos: ["guarda", "admin"],
  },
  {
    icon: IconChartBar,
    title: 'Reportes y Análisis',
    description: 'Descarga de reportes detallados',
    link: '/Reportes',
    rolesPermitidos: ["admin", "almacen"],
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

const links = mockdata
  .filter((item) => user && item.rolesPermitidos.includes(user.rol)) // 👈 filtro por rol
  .map((item) => (
    <UnstyledButton
      className={classes.subLink}
      key={item.title}
      component={Link}
      to={item.link}
    >
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
              <Link to="/Dashboard" className={classes.link}>Dashboard</Link>
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
                 
                  <Divider my="sm" />
                  <SimpleGrid cols={2} spacing={0}>{links}</SimpleGrid>
                {user && (
                  <div className={classes.dropdownFooter}>

  <h3 style={{ color: "gray" }}>Guarda de <span style={{ color: "gray", fontWeight: 600 }}>{user.subalmacen}</span></h3>

    <Text size="sm" fw={500} c="dimmed" mt="xs">
      Rol: <span style={{ color: "#1c7ed6", fontWeight: 600 }}>{user.rol}</span>
      
    </Text>
 
</div>
 )}
                </HoverCard.Dropdown>
              </HoverCard>
            </Group>
          </Group>

          {/* Usuario + botón */}
<Group visibleFrom="sm">
  {user ? (
    <>
      <Text size="sm" fw={500} c="dimmed">
        Usuario: <span style={{ color: "#1c7ed6", fontWeight: 600 }}>{user.nombreCompleto}</span>
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
                <Text ta="center" size="sm">{user.nombreCompleto} ({user.rol})</Text>
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