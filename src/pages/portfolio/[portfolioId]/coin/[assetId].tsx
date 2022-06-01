import { lazy, Suspense } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Box, Container, useTheme } from '@mui/material';
import { ReactJSXElement } from '@emotion/react/types/jsx-namespace';
import { content } from 'i18n';
import { HypnosisLoading } from 'shared/components';
import { DashboardLayout } from 'containers';

const CDCryptoDetail = lazy(
  () =>
    import(
      'containers/portfolio/asset-detail/crypto-detail/cd-crypto-detail-main'
    ),
);

const AssetVolatilityDetailPage = () => {
  const router = useRouter();
  const { locale } = router;
  const detail = locale === 'vi' ? content['vi'] : content['en'];
  //const { assetVolatilityDetailPage } = detail;
  return (
    <>
      <Head>
        <title>Crypto Currency | Money Master</title>
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
            <CDCryptoDetail />
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
