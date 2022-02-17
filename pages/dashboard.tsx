import Head from 'next/head';
import { ReactJSXElement } from '@emotion/react/types/jsx-namespace';
import { Box, Container, Grid, Typography } from '@mui/material';
import { DashboardLayout } from 'components/dashboard-layout';
import {
  TotalAssets,
  TotalProfit,
  InvestmentChannel,
  PlanProgress,
  RecentlyAdded,
  YourWallet,
} from 'components/dashboard';

const Dashboard = () => (
  <>
    <Head>
      <title>Dashboard | Money Mater</title>
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
          Your Wallet
        </Typography>
      </Container>
      <Container maxWidth={false}>
        <Grid container spacing={3}>
          <Grid item lg={3} sm={6} xl={3} xs={12}>
            <YourWallet sx={{ height: '100%' }}/>
          </Grid>
          <Grid item xl={3} lg={3} sm={6} xs={12}>
            <TotalProfit sx={{ height: '100%' }}/>
          </Grid>
          <Grid item xl={3} lg={3} sm={6} xs={12}>
            <PlanProgress sx={{ height: '100%' }}/>
          </Grid>
          <Grid item xl={3} lg={3} sm={6} xs={12}>
            <TotalAssets sx={{ height: '100%' }} />
          </Grid>
          {/* <Grid item lg={8} md={12} xl={9} xs={12}>
            <Sales />
          </Grid>
          <Grid item lg={4} md={6} xl={3} xs={12}>
            <TrafficByDevice sx={{ height: '100%' }} />
          </Grid> */}
          <Grid item lg={8} md={12} xl={9} xs={12}>
            <RecentlyAdded sx={{ height: '100%' }}/>
          </Grid>
          <Grid item lg={4} md={6} xl={3} xs={12}>
            <InvestmentChannel sx={{ height: '100%' }} />
          </Grid>
        </Grid>
      </Container>
    </Box>
  </>
);

Dashboard.getLayout = (page: ReactJSXElement) => (
  <DashboardLayout>{page}</DashboardLayout>
);
//Dashboard.requireAuth = true;

export default Dashboard;