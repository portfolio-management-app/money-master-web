import { Suspense, useCallback, useEffect } from 'react';
import { useRouter } from 'next/router';
import {
  Box,
  Container,
  Grid,
  IconButton,
  Tooltip,
  useTheme,
  useMediaQuery,
  Typography,
  Tab,
} from '@mui/material';
import { observer } from 'mobx-react-lite';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { stockDetailStore } from 'shared/store';
import { BreadcrumbsLink, HypnosisLoading } from 'shared/components';
import { PAStockBreadcrumbTabs } from 'shared/constants/portfolio-asset';
import { TabContext, TabList } from '@mui/lab';
import SDOverviewTab from './sd-overview-tab/sd-overview-main';
import SDMarketDataTab from './sd-market-data-chart/sd-market-data-tab';
import { SDCreateTransactionModal } from './sd-transaction-modal/sd-create-transaction-modal';

interface IProps {}

const SDStockDetail = observer(({}: IProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const router = useRouter();

  const { locale, query } = router;
  const portfolioId = Array.isArray(query['portfolioId'])
    ? query['portfolioId'][0]
    : query['portfolioId'] || '';
  const assetId = Array.isArray(query['assetId'])
    ? query['assetId'][0]
    : query['assetId'] || '';

  useEffect(() => {
    if (typeof assetId === 'undefined') router.push('/404');
    stockDetailStore.setStockId(assetId);
    stockDetailStore.setPortfolioId(portfolioId);
  }, [router, stockDetailStore, portfolioId, assetId]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    stockDetailStore.setSelectedTab(newValue);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        height: '100%',
        overflow: 'hidden',
        width: '100%',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          flex: '1 1 auto',
          overflow: 'hidden',
        }}
      >
        <Box sx={{ overflow: 'auto', width: '100%' }}>
          <Container>
            <BreadcrumbsLink
              urlArr={[
                '/portfolio',
                `/portfolio/${stockDetailStore.portfolioId}`,
                `/portfolio/${stockDetailStore.portfolioId}/stock/${stockDetailStore.stockId}`,
              ]}
              displayNameArr={[
                'Portfolio',
                stockDetailStore.portfolioInfo?.name ||
                  stockDetailStore.portfolioId.toString(),
                stockDetailStore.stockDetail?.stockCode ||
                  stockDetailStore.stockId.toString(),
              ]}
            />
            <Typography sx={{ mb: 3 }} variant="h4">
              {stockDetailStore.stockDetail?.stockCode || ''}
            </Typography>
          </Container>

          <Container
            sx={{ padding: isMobile ? '0px' : 'initial' }}
            maxWidth="lg"
          >
            <TabContext value={stockDetailStore.selectedTab}>
              <Box sx={{ mb: 3, borderBottom: 1, borderColor: 'divider' }}>
                <TabList
                  onChange={handleTabChange}
                  aria-label="basic tabs example"
                  textColor="primary"
                  indicatorColor="primary"
                >
                  <Tab
                    label={PAStockBreadcrumbTabs.overview}
                    value={PAStockBreadcrumbTabs.overview}
                  />
                  <Tab
                    label={PAStockBreadcrumbTabs.marketData}
                    value={PAStockBreadcrumbTabs.marketData}
                  />
                  <Tab
                    label={PAStockBreadcrumbTabs.settings}
                    value={PAStockBreadcrumbTabs.settings}
                  />
                </TabList>
              </Box>
            </TabContext>
          </Container>
          <Box sx={{ overflow: 'hidden' }}>
            <Container sx={{ padding: isMobile ? '0px' : 'initial' }}>
              <Grid
                display="flex"
                justifyContent="center"
                flexDirection="column"
              >
                {stockDetailStore.selectedTab ===
                PAStockBreadcrumbTabs.overview ? (
                  <Suspense fallback={<HypnosisLoading />}>
                    <SDOverviewTab />
                  </Suspense>
                ) : null}
                {stockDetailStore.selectedTab ===
                PAStockBreadcrumbTabs.marketData ? (
                  <Suspense fallback={<HypnosisLoading />}>
                    <SDMarketDataTab />
                  </Suspense>
                ) : null}
                {stockDetailStore.selectedTab ===
                PAStockBreadcrumbTabs.settings ? (
                  <Suspense fallback={<HypnosisLoading />}>
                    <h1>You are in setting tab</h1>
                  </Suspense>
                ) : null}
              </Grid>
            </Container>
          </Box>
        </Box>
        <Box>
          <SDCreateTransactionModal />
        </Box>
        <Tooltip title="Add new transaction">
          <IconButton
            onClick={() => {
              stockDetailStore.setOpenAddNewTransactionModal(
                !stockDetailStore.isOpenAddNewTransactionModal,
              );
            }}
            color="success"
            sx={{ position: 'absolute', right: '6vw', bottom: '6vh' }}
          >
            <AddCircleIcon sx={{ width: '4rem', height: '4rem' }} />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );
});

export default SDStockDetail;
