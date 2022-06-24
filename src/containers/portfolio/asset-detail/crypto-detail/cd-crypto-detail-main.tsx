import {
  Box,
  Container,
  Grid,
  IconButton,
  Tooltip,
  useTheme,
  useMediaQuery,
  Tab,
  Typography,
} from '@mui/material';
import { Suspense, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { cryptoDetailStore } from 'shared/store';
import { TabContext, TabList } from '@mui/lab';
import { BreadcrumbsLink, HypnosisLoading } from 'shared/components';
import { PACryptoBreadcrumbTabs } from 'shared/constants';
import CDOverviewTab from './cd-overview-tab/cd-overview-main';
import CDMarketDataTab from './cd-market-data-chart/cd-market-data-tab';
import { CDCreateTransactionModal } from './cd-transaction-modal/cd-create-transaction-modal';
import { useRouter } from 'next/router';
import { content as i18n } from 'i18n';

interface IProps { };

const CDCryptoDetail = observer(({ }: IProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const router = useRouter();
  const { locale, query } = router;
  const content = locale === 'vi' ? i18n['vi'].cryptoDetailPage : i18n['en'].cryptoDetailPage;

  const portfolioId = Array.isArray(query['portfolioId'])
    ? query['portfolioId'][0]
    : query['portfolioId'] || '';
  const assetId = Array.isArray(query['assetId'])
    ? query['assetId'][0]
    : query['assetId'] || '';

  useEffect(() => {
    cryptoDetailStore.resetInitialState();
  }, []);


  useEffect(() => {
    async function fetchData() {
      if (cryptoDetailStore.cryptoDetail && cryptoDetailStore.marketData === undefined) {
        await cryptoDetailStore.fetchCryptoInfoByCode();
      }
    }
    fetchData();
  }, [cryptoDetailStore.marketData, cryptoDetailStore.cryptoDetail])


  useEffect(() => {
    if (typeof assetId === 'undefined') router.push('/404');
    cryptoDetailStore.setCryptoId(assetId);
    cryptoDetailStore.setPortfolioId(portfolioId);
  }, [router, cryptoDetailStore, portfolioId, assetId]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    cryptoDetailStore.setSelectedTab(newValue);
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
                `/portfolio/${cryptoDetailStore.portfolioId}`,
                `/portfolio/${cryptoDetailStore.portfolioId}/crypto/${cryptoDetailStore.cryptoId}`,
              ]}
              displayNameArr={[
                content.breadCurmbs.portfolio,
                cryptoDetailStore.portfolioInfo?.name ||
                cryptoDetailStore.portfolioId.toString(),
                cryptoDetailStore.cryptoDetail?.cryptoCoinCode.toUpperCase() ||
                cryptoDetailStore.cryptoId.toString(),
              ]}
            />
            <Typography sx={{ mb: 3 }} variant="h4">
              {cryptoDetailStore.cryptoDetail?.cryptoCoinCode || ''}
            </Typography>
          </Container>
          <Container
            sx={{ padding: isMobile ? '0px' : 'initial' }}
            maxWidth="lg"
          >
            <TabContext value={cryptoDetailStore.selectedTab}>
              <Box sx={{ mb: 3, borderBottom: 1, borderColor: 'divider' }}>
                <TabList
                  onChange={handleTabChange}
                  aria-label="basic tabs example"
                  textColor="primary"
                  indicatorColor="primary"
                >
                  <Tab
                    label={content.overview}
                    value={PACryptoBreadcrumbTabs.overview}
                  />
                  <Tab
                    label={content.marketData}
                    value={PACryptoBreadcrumbTabs.marketData}
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
                {cryptoDetailStore.selectedTab ===
                  PACryptoBreadcrumbTabs.overview ? (
                  <Suspense fallback={<HypnosisLoading />}>
                    <CDOverviewTab />
                  </Suspense>
                ) : null}
                {cryptoDetailStore.selectedTab ===
                  PACryptoBreadcrumbTabs.marketData ? (
                  <Suspense fallback={<HypnosisLoading />}>
                    <CDMarketDataTab />
                  </Suspense>
                ) : null}
              </Grid>
            </Container>
          </Box>
        </Box>
        <Box>
          <CDCreateTransactionModal />
        </Box>
        <Tooltip title={content.addNewTransaction}>
          <IconButton
            onClick={() => {
              cryptoDetailStore.setOpenAddNewTransactionModal(
                !cryptoDetailStore.isOpenAddNewTransactionModal,
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

export default CDCryptoDetail;
