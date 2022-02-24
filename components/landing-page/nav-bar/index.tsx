import { useState } from 'react';
import { useRouter } from 'next/router';
import {
  AppBar,
  Box,
  Button,
  Toolbar,
  Typography,
  Tabs,
  useTheme,
  useMediaQuery,
  IconButton,
  Tab,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Link } from 'components';
import { colorScheme } from 'utils/color-scheme';
import DrawerComponent from './drawer-component';
import styled from './style/header.module.css';

interface IProps {
  content: any;
}

export default function DefaultNavbar({ content }: IProps) {
  const { locale } = useRouter();
  const [value, setValue] = useState<any>('home');
  const [openDrawer, setOpenDrawer] = useState(false);
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const matchAuthPage: boolean = ['/sign-in', '/sign-up', '/'].includes(
    router.pathname,
  );

  const matchSpecificPage: boolean = ['/', 'docs'].includes(router.pathname);
  const handleChange = (event: React.SyntheticEvent, newValue: any) => {
    setValue(newValue);
  };

  const scrollToTopOfPage = async () => {
    if (router.pathname !== '/') router.push('/');
    else {
      document
        .getElementById('top-of-page')
        ?.scrollIntoView({ behavior: 'smooth' });
      router.push('/', undefined, { shallow: true });
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }} className="section">
      <AppBar
        className={styled.navbar}
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: colorScheme.white,
          color: colorScheme.black200,
        }}
      >
        <Toolbar>
          {isMobile ? (
            <>
              <IconButton
                sx={{ mr: 1 }}
                onClick={() => setOpenDrawer(!openDrawer)}
              >
                <MenuIcon />
              </IconButton>
              <DrawerComponent
                content={content}
                openDrawer={openDrawer}
                setOpenDrawer={setOpenDrawer}
              />
            </>
          ) : null}
          <Link href="/" locale={locale}>
            <Box
              display="flex"
              mr="auto"
              justifyContent="start"
              alignItems="end"
            >
              <img
                id="app-icon"
                src="/images/app-icon.png"
                alt="app icon"
                style={{ width: '2rem', height: '2rem' }}
              />
              <Typography
                id="brand-name"
                sx={{
                  ml: 1,
                  color: colorScheme.theme,
                }}
                fontWeight="bold"
                style={{ cursor: 'pointer' }}
                variant="h6"
              >
                Money Master
              </Typography>
            </Box>
          </Link>
          {!isMobile && matchSpecificPage ? (
            <Box
              sx={{ flexGrow: 1, display: { xs: 'none', sm: 'flex' } }}
              justifyContent="center"
              alignItems="center"
            >
              <Tabs
                value={value}
                onChange={handleChange}
                aria-label="nav tabs example"
                centered
              >
                <Tab
                  value="home"
                  label={content.home}
                  onClick={scrollToTopOfPage}
                ></Tab>
                <Tab
                  value="service"
                  label={content.service}
                  href="/#service"
                ></Tab>
                <Tab value="about" label={content.about} href="/#about"></Tab>
                <Tab value="docs" label={content.docs} href="/docs"></Tab>
              </Tabs>
            </Box>
          ) : (
            <Box sx={{ flexGrow: 1 }} />
          )}

          {matchAuthPage && (
            <>
              <Button
                id="login-button"
                variant="contained"
                sx={{ bg: colorScheme.theme, mr: 1, ml: 'auto' }}
              >
                {router.pathname === '/sign-in' ? (
                  <Link href="/sign-up" locale={locale}>
                    {content.register}
                  </Link>
                ) : (
                  <Link href="/sign-in" locale={locale}>
                    {content.signIn}
                  </Link>
                )}
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
}
