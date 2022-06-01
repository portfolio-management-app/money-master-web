import { Box, Container, Grid, IconButton, Tooltip, useMediaQuery, useTheme } from "@mui/material";
import { observer } from "mobx-react-lite";
import { useRouter } from "next/router";
import { lazy, Suspense, useEffect } from "react";
import { HypnosisLoading } from "shared/components";
import { customAssetsDetailStore } from "shared/store";
import AddCircleIcon from '@mui/icons-material/AddCircle';

const CSDIntroSection = lazy(() => import('./csd-intro-section/csd-intro-section-main'));
const CSDTransactionModal = lazy(() => import('./csd-transaction-modal/csd-transaction-modal-main'));
const CSDTransactionHistory = lazy(() => import('./csd-transaction-history/csd-transaction-history-main'))

export const CSDCustomAssetDetail = observer(() => {

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

        customAssetsDetailStore.setCustomAssetId(assetId);
        customAssetsDetailStore.setPortfolioId(portfolioId);

    }, [assetId, portfolioId, router]);

    return (<Box
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
                <Container sx={{ padding: isMobile ? '0px' : 'initial' }}>
                    <Grid
                        display="flex"
                        justifyContent="center"
                        flexDirection="column"
                    >
                        {typeof customAssetsDetailStore.customAssetDetail !== 'undefined' ? (
                            <Suspense fallback={<HypnosisLoading />}>
                                <CSDIntroSection />
                            </Suspense>
                        ) : null}
                        {typeof customAssetsDetailStore.transactionHistory !== 'undefined' ? (
                            <Suspense fallback={<HypnosisLoading />}>
                                <CSDTransactionHistory />
                            </Suspense>
                        ) : null}
                    </Grid>
                </Container>
            </Box>
            <Box>
                <CSDTransactionModal />
            </Box>
            <Tooltip title="Add new transaction">
                <IconButton
                    onClick={() => {
                        customAssetsDetailStore.setOpenAddNewTransactionModal(
                            !customAssetsDetailStore.isOpenAddNewTransactionModal,
                        );
                    }}
                    color="success"
                    sx={{ position: 'absolute', right: '6vw', bottom: '6vh' }}
                >
                    <AddCircleIcon sx={{ width: '4rem', height: '4rem' }} />
                </IconButton>
            </Tooltip>
        </Box>
    </Box>);
});