import { Suspense } from 'react';
import Head from 'next/head';
import {
    Box,
    Container,
} from '@mui/material';
import { useRouter } from 'next/router';
import { ReactJSXElement } from '@emotion/react/types/jsx-namespace';
import { content } from 'i18n';
import { customAssetsDetailStore, } from 'shared/store';
import { HypnosisLoading } from 'shared/components';
import { DashboardLayout } from 'containers';
import { CSDCustomAssetDetail } from 'containers/portfolio';

const AssetDetailPage = () => {
    const router = useRouter();
    const { locale } = router;
    const detail = locale === 'vi' ? content['vi'] : content['en'];
    //const { assetVolatilityDetailPage } = detail;
    return (
        <>
            <Head>
                <title>Custom Asset | Money Master</title>
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
                        <CSDCustomAssetDetail />
                    </Suspense>
                </Container>
            </Box>
        </>
    );
};

AssetDetailPage.requireAuth = true;
AssetDetailPage.getLayout = (page: ReactJSXElement) => (
    <DashboardLayout>{page}</DashboardLayout>
);

export default AssetDetailPage;
