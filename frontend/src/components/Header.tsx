import {
  IconBook,
  IconChartPie3,
  IconChevronDown,
  IconCode,
  IconCoin,
  IconFingerprint,
  IconNotification,
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
import { useAuth } from '../hooks/useAuth';
import { useAuth as useAuthHook } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import classes from '../styles/HeaderMegaMenu.module.css';
import '@mantine/core/styles.css';
import { Link } from 'react-router-dom';
import type { TablerIcon } from '@tabler/icons-react';


type NavItem = {
  icon: TablerIcon;
  title: string;
  description: string;
  link: string;
};



const mockdata: NavItem[]  = [
  {
    icon: IconCode,
    title: 'Nueva Solicitud',
    description: 'Genera nueva solicitud al almacén',
     link: '/Solicitudes'

  },
  {
    icon: IconCoin,
    title: 'Movimientos',
    description: 'Fljo de entradas y salida de inusmos',
     link: '/Movimientos',
  },
  {
    icon: IconBook,
    title: 'Stock en tiempo real',
    description: 'Insumos existentes en el almacen',
     link: '/Inventario',
  },
  {
    icon: IconFingerprint,
    title: 'Lotes y Caducidades',
    description: 'Gestión de lotes y fechas de caducidad',
     link: '/Lotes_Caducidades',
  },
  {
    icon: IconChartPie3,
    title: 'Reportes y Análisis',
    description: 'Descarga de reportes detallados',
     link: '/Reportes',
  },
  {
    icon: IconNotification,
    title: 'Calendario de Reabastecimiento',
    description: 'Calendarización de pedidos de insumos',
     link: '/Reabastecimiento'
  },
];

export function HeaderMegaMenu() {
  const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] = useDisclosure(false);
  const [linksOpened, { toggle: toggleLinks }] = useDisclosure(false);
  const theme = useMantineTheme();
  const { user } = useAuth();
  const { logout } = useAuthHook();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };


const links = mockdata.map((item) => (
  <UnstyledButton className={classes.subLink} key={item.title} component={Link} to={item.link}>
    <Group wrap="nowrap" align="flex-start">
      <ThemeIcon size={34} variant="default" radius="md">
        <item.icon size={22} color={theme.colors.blue[6]} />
      </ThemeIcon>
      <div>
        <Text size="sm" fw={500}>
          {item.title}
        </Text>
        <Text size="xs" c="dimmed">
          {item.description}
        </Text>
      </div>
    </Group>
  </UnstyledButton>
));






  return (
    <Box pb={120}>
      <header className={classes.header}   style={{ boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}
>
        <Group justify="left" h="100%">
         <img className="logo mb-3" src="/src/assets/hgm.png" alt="Logo HGM"  style={{ width: '150px', height: '100px' }}   />

          <Group h="100%" gap={0} visibleFrom="sm">
          

<Link to="/Dashboard" className={classes.link}>
  Dashboard
</Link>


            <HoverCard width={600} position="bottom" radius="md" shadow="md" withinPortal>
              <HoverCard.Target>
                <a href="#" className={classes.link}>
                  <Center inline>
                    <Box component="span" mr={5}>
                     Menu
                    </Box>
                    <IconChevronDown size={16} color={theme.colors.blue[6]} />
                  </Center>
                </a>
              </HoverCard.Target>

              <HoverCard.Dropdown style={{ overflow: 'hidden' }}>
                <Group justify="space-between" px="md">
                  <Text fw={500}>Módulos</Text>
                
                </Group>

                <Divider my="sm" />
                <SimpleGrid cols={2} spacing={0}>
                  {links}
                </SimpleGrid>

                <div className={classes.dropdownFooter}>
                  <h3>Control de Inventarios</h3>
                </div>
              </HoverCard.Dropdown>
            </HoverCard>
           
          </Group>
 
          <Group visibleFrom="sm" >
            {user ? (
              <>
                <Text size="sm" fw={500}>
                  {user.nombreCompleto} ({user.role})
                </Text>
                <Button  variant="light" color="red" onClick={handleLogout}>
                  Salir
                </Button>
              </>
            ) : (
              <>
                <Button variant="default">Log in</Button>
                <Button>Sign up</Button>
              </>
            )}
          </Group>

          <Burger opened={drawerOpened} onClick={toggleDrawer} hiddenFrom="sm" />
       </Group>


       
      </header>

      <Drawer
        opened={drawerOpened}
        onClose={closeDrawer}
        size="100%"
        padding="md"
        title="Mobil"
        hiddenFrom="sm"
        zIndex={1000000}
      >
        <ScrollArea h="calc(100vh - 80px)" mx="-md">
          <Divider my="sm" />

          <a href="#" className={classes.link}>
      Dashboard
          </a>
          <UnstyledButton className={classes.link} onClick={toggleLinks}>
            <Center inline>
              <Box component="span" mr={5}>
             Menu
              </Box>
              <IconChevronDown size={16} color={theme.colors.blue[6]} />
            </Center>
          </UnstyledButton>
          <Collapse in={linksOpened}>{links}</Collapse>
        

          <Divider my="sm" />

          <Group justify="center" grow pb="xl" px="md">
            {user ? (
              <>
                <Text ta="center" size="sm">
                  {user.nombreCompleto} ({user.role})
                </Text>
                <Button variant="light" color="red" onClick={handleLogout}>
                  Salir
                </Button>
              </>
            ) : (
              <>
                <Button variant="default">Log in</Button>
                <Button>Sign up</Button>
              </>
            )}
          </Group>
        </ScrollArea>
      </Drawer>
    </Box>
  );
}
export default HeaderMegaMenu;