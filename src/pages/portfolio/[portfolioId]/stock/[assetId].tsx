import { lazy, Suspense, useEffect, useState } from 'react';
import Head from 'next/head';
import {
  Box,
  Container,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { useRouter } from 'next/router';
import { ReactJSXElement } from '@emotion/react/types/jsx-namespace';
import { content } from 'i18n';
import {
  rootStore,
  stockVolatilityDetailStore,
} from 'shared/store';
import {  HypnosisLoading } from 'shared/components';
import { DashboardLayout } from 'containers';
import { PAStockBreadcrumbTabs } from 'shared/constants';

const StockVolatilityDetail = lazy(()=>
  import ('containers/portfolio/asset-detail/stock-detail/pd-stock-detail'),
);

const fetchData = async (portfolioId: string, assetId: string) => {
  
};

const AssetVolatilityDetailPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const router = useRouter();
  const {locale} = router;
  const detail = locale === 'vi' ? content['vi'] : content['en'];
  //const { assetVolatilityDetailPage } = detail;


  return (
    <>
      <Head>
        <title>Stock Detail | Money Master</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth="lg">
          <Suspense fallback={<HypnosisLoading></HypnosisLoading>}>
            <StockVolatilityDetail/>
          </Suspense>
        </Container>
      </Box>
    </>
  );
};

AssetVolatilityDetailPage.requireAuth = true;
AssetVolatilityDetailPage.getLayout = (page: ReactJSXElement) => (
  <DashboardLayout>{page}</DashboardLayout>
);

export default AssetVolatilityDetailPage;
