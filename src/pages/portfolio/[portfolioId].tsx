import Head from 'next/head';
import { useEffect } from 'react';
import {
  Box,
  Container,
  useTheme,
  useMediaQuery,
  Typography,
} from '@mui/material';
import { ReactJSXElement } from '@emotion/react/types/jsx-namespace';
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next';
import { content } from 'i18n';
import { rootStore, portfolioDetailStore } from 'shared/store';
import { BreadcrumbsLink } from 'shared/components';
import { DashboardLayout } from 'containers';
import { PortfolioDetail } from 'containers/portfolio/portfolio-detail';

const fetchData = async (portfolioId: string) => {
  rootStore.startLoading();

  portfolioDetailStore.setPortfolioId(portfolioId);
  await portfolioDetailStore.fetchInitialData();

  rootStore.stopLoading();
};

const PortfolioDetailPage = (
  props: InferGetStaticPropsType<typeof getStaticProps>,
) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const {
    locale,
    params: { portfolioId },
  } = props;

  useEffect(() => {
    if (typeof locale !== 'undefined') rootStore.setLocale(locale);
    fetchData(portfolioId);
  }, []);

  const detail = locale === 'vi' ? content['vi'] : content['en'];
  const { portfolioDetailPage } = detail;

  return (
    <>
      <Head>
        <title>{portfolioDetailPage.title} | Money Master</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth="lg">
          <BreadcrumbsLink
            urlArr={['/portfolio', `/portfolio/${portfolioId}`]}
            displayNameArr={['Portfolio', portfolioId]}
          />
          <Typography sx={{ mb: 3 }} variant="h4">
          {portfolioDetailPage.header}
          </Typography>
        </Container>
        <Container sx={{ padding: isMobile ? '0px' : 'initial' }} maxWidth="lg">
          <PortfolioDetail content = {portfolioDetailPage} portfolioId={portfolioId}></PortfolioDetail>
        </Container>
      </Box>
    </>
  );
};

PortfolioDetailPage.requireAuth = true;
PortfolioDetailPage.getLayout = (page: ReactJSXElement) => (
  <DashboardLayout>{page}</DashboardLayout>
);

export const getStaticPaths: GetStaticPaths<{
  portoflioId: string;
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

// export const getServerSideProps: GetServerSideProps = async (context) => {
//   const { query, params, locales, locale, defaultLocale, resolvedUrl } =
//     context;
//   return {
//     props: {
//       query,
//       params,
//       locales,
//       locale,
//       defaultLocale,
//       resolvedUrl,
//     },
//   };
// };

export default PortfolioDetailPage;
