import { Box, Container, Grid, IconButton, Tooltip } from '@mui/material';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { observer } from 'mobx-react-lite';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { stockVolatilityDetailStore } from 'store';
import { AddNewTransactionModal } from './add-new-transaction-modal';

export const StockVolatilityDetail = observer(() => {
  useEffect(() => {
    stockVolatilityDetailStore.fetchTransactionHistoryData();
  }, []);

  const { isOpenAddNewTransactionModal } = stockVolatilityDetailStore;

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
        <Box sx={{ overflow: 'auto' }}>
          <Container>
            <Grid
              container
              spacing={3}
              display="fex"
              justifyContent="center"
            >


              
            </Grid>
          </Container>
        </Box>
      </Box>
      <AddNewTransactionModal />
      <Tooltip title="Add new transaction">
        <IconButton
          onClick={() => {
            stockVolatilityDetailStore.setOpenAddNewTransactionModal(
              !isOpenAddNewTransactionModal,
            );
          }}
          color="success"
          sx={{ position: 'absolute', right: '6vw', bottom: '6vh' }}
        >
          <AddCircleIcon sx={{ width: '4rem', height: '4rem' }} />
        </IconButton>
      </Tooltip>
    </Box>
  );
});
