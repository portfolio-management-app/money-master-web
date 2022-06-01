import { useEffect, useState } from 'react';
import { Box, Button, ButtonGroup, Typography, useTheme } from '@mui/material';
import { observer } from 'mobx-react-lite';
import { CDBuyCryptoForm } from './cd-buy-crypto-form';
import { CDSellCryptoForm } from './cd-sell-crypto-form';
import { ITransactionRequest, TransferToInvestFundType } from 'shared/types';
import CDMoveToFundForm from './cd-move-to-fund-form';
import { cryptoDetailStore } from 'shared/store';

interface IProps { }

export const CDCryptoForm = observer(({ }: IProps) => {
  const theme = useTheme();
  const [focusedButtonKey, setFocusedButtonKey] = useState(0);
  const [selectedForm, setSelectedForm] = useState<any>(null);
  const [assetPrice, setAssetPrice] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    const fetchAssetPrice = async () => { };
    fetchAssetPrice();
    setSelectedForm(
      <CDBuyCryptoForm
        key={focusedButtonKey}
        handleFormSubmit={buyMoreCrypto}
      />,
    );
  }, []);

  const buttonLabels = ['Buy', 'Sell', 'Transfer'];

  const handleSelectionChanged = (key: number) => {
    setFocusedButtonKey(key);
    setErrorMessage('');
    setSelectedForm(formArray[key]);
  };

  const portfolioName = cryptoDetailStore.portfolioInfo?.name;
  const assetName = cryptoDetailStore.cryptoDetail?.cryptoCoinCode;

  const buyMoreCrypto = async (payload: ITransactionRequest) => {
    const res = await cryptoDetailStore.createNewTransaction(payload);
    if (res.isError) {
      setErrorMessage(res.data.data);
    } else {
      cryptoDetailStore.setUpdateOverviewData(true);
      handleClose();
    }
  };

  const moveToFund = async (payload: TransferToInvestFundType) => {
    const res = await cryptoDetailStore.transferAssetToInvestFund(payload);
    if (res.isError) {
      setErrorMessage(res.data.data);
    } else {
      cryptoDetailStore.setUpdateOverviewData(true);
      handleClose();
    }
  };

  const sellCrypto = async (payload: ITransactionRequest) => {
    if (
      cryptoDetailStore.cryptoDetail &&
      payload.amountInDestinationAssetUnit >
      cryptoDetailStore.cryptoDetail?.currentAmountHolding
    ) {
      setErrorMessage('Amount is greater than your own shares');
      return;
    }
    const res = await cryptoDetailStore.createNewTransaction(payload);
    if (res.isError) {
      setErrorMessage(res.data.data);
    } else {
      cryptoDetailStore.setUpdateOverviewData(true);
      handleClose();
    }
  };

  const formArray = [
    <CDBuyCryptoForm key={focusedButtonKey} handleFormSubmit={buyMoreCrypto} />,
    <CDSellCryptoForm key={focusedButtonKey} handleFormSubmit={sellCrypto} />,
    <CDMoveToFundForm key={focusedButtonKey} handleFormSubmit={moveToFund} />,
  ];

  const handleClose = () => {
    cryptoDetailStore.setOpenAddNewTransactionModal(false);
  };

  return (
    <Box sx={{ height: 'inherit' }}>
      <Box sx={{ mt: '1rem' }}>
        <Typography align="center" id="modal-modal-title" variant="h4">
          Transaction
        </Typography>
      </Box>
      <Box sx={{ ml: '3rem', mt: '1rem' }}>
        <ButtonGroup aria-label="outlined primary button group">
          {buttonLabels.map((item: string, key: number) => {
            return (
              <Button
                key={key.toString()}
                variant={key === focusedButtonKey ? 'contained' : 'outlined'}
                onClick={() => handleSelectionChanged(key)}
              >
                {item}
              </Button>
            );
          })}
        </ButtonGroup>
        <Typography
          variant="body1"
          sx={{
            mt: '0.4rem',
            textTransform: 'uppercase',
            fontWeight: 'bold',
          }}
        >
          {portfolioName}
        </Typography>
        <Typography
          variant="body1"
          sx={{ textTransform: 'uppercase', fontWeight: 'bold' }}
        >
          {assetName}: &nbsp; ${cryptoDetailStore.marketData?.c}
        </Typography>
      </Box>
      <Typography variant="body1" color="error" align="center" height="1.5rem">
        {errorMessage}
      </Typography>
      <Box
        sx={{
          [theme.breakpoints.down('sm')]: { height: '390px' },
          [theme.breakpoints.up('sm')]: {
            height: '460px',
          },
        }}
      >
        {selectedForm}
      </Box>
    </Box>
  );
});
