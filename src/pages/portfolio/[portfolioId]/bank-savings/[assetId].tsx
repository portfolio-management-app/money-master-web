import { useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import {
  Box,
  Container,
  Typography,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { ReactJSXElement } from '@emotion/react/types/jsx-namespace';
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next';
import { content } from 'i18n';
import { DashboardLayout } from 'containers';
import { BankSavingsDetail } from 'containers/portfolio';
import { bankSavingsDetailStore, rootStore } from 'shared/store';

const fetchData = async (portfolioId: string, assetId: string) => {
  rootStore.startLoading();

  bankSavingsDetailStore.setAssetId(assetId);
  bankSavingsDetailStore.setPortfolioId(portfolioId);
  await bankSavingsDetailStore.fetchBankSavingsDetail({ portfolioId, assetId });

  rootStore.stopLoading();
};

const AssetDetailPage = (
  props: InferGetStaticPropsType<typeof getStaticProps>,
) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const router = useRouter();

  const {
    locales,
    locale,
    defaultLocale,
    params: { portfolioId, assetId },
  } = props;

  useEffect(() => {
    if (typeof assetId === 'undefined') router.push('/404');

    fetchData(portfolioId, assetId);
  }, []);

  const detail = locale === 'vi' ? content['vi'] : content['en'];
  //const { assetVolatilityDetailPage } = detail;
  return (
    <>
      <Head>
        <title>Bank Savings | Money Master</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container
          maxWidth="lg"
          sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}
        >
          <Typography sx={{ mb: 3 }} variant="h4">
            Bank Savings
          </Typography>
        </Container>
        <Container sx={{ padding: isMobile ? '0px' : 'initial' }} maxWidth="lg">
          <BankSavingsDetail portfolioId={portfolioId} assetId={assetId} />
        </Container>
      </Box>
    </>
  );
};

//AssetDetailPage.requireAuth = true;
AssetDetailPage.getLayout = (page: ReactJSXElement) => (
  <DashboardLayout>{page}</DashboardLayout>
);

export const getStaticPaths: GetStaticPaths<{
  portoflioId: string;
  assetId: string;
}> = async () => {
  return {
    paths: [], //indicates that no page needs be created at build time
    fallback: 'blocking', //indicates the type of fallback
  };
};

export const getStaticProps: GetStaticProps = async (context) => {
  const { params, locales, locale, defaultLocale } = context;
  return {
    props: {
      context,
      params,
      locales,
      locale,
      defaultLocale,
    },
  };
};

export default AssetDetailPage;
