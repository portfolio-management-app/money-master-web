import Head from 'next/head';
import { Box, Container, Typography } from '@mui/material';
import { ReactJSXElement } from '@emotion/react/types/jsx-namespace';
import { DashboardLayout } from 'components/dashboard-layout';
import { SettingsNotifications,SettingsPassword } from 'components/settings';

const Settings = () => (
  <>
    <Head>
      <title>Settings | Money Master</title>
    </Head>
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        py: 8,
      }}
    >
      <Container maxWidth="lg">
        <Typography sx={{ mb: 3 }} variant="h4">
          Settings
        </Typography>
        <SettingsNotifications />
        <Box sx={{ pt: 3 }}>
          <SettingsPassword />
        </Box>
      </Container>
    </Box>
  </>
);

//Setting.requireAuth = true;
Settings.getLayout = (page: ReactJSXElement) => (
  <DashboardLayout>{page}</DashboardLayout>
);

export default Settings;
