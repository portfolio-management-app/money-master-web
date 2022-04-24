import Head from 'next/head';
import { ReactJSXElement } from '@emotion/react/types/jsx-namespace';
import { GetStaticProps, InferGetStaticPropsType } from 'next';
import { content } from 'i18n';
import { DashboardLayout } from 'containers';
import { Box, Container, Typography } from '@mui/material';

const Plan = (props: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { locale } = props.context;

  const detail = locale === 'vi' ? content['vi'] : content['en'];
  const { planPage } = detail;
  return (
    <>
      <Head>
        <title>{planPage.title} | Money Master</title>
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
            {planPage.title}
          </Typography>
        </Container>
      </Box>
    </>
  );
};

//Plan.requireAuth = true;
Plan.getLayout = (page: ReactJSXElement) => (
  <DashboardLayout>{page}</DashboardLayout>
);

export const getStaticProps: GetStaticProps = async (context) => {
  return {
    props: {
      context,
    },
  };
};

export default Plan;
