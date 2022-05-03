import { useEffect } from 'react';
import { Box, IconButton, Typography, useTheme } from '@mui/material';
import { observer } from 'mobx-react-lite';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Scrollbars } from 'react-custom-scrollbars';
import { NewCryptoCurrencyAsset } from 'shared/types';
import { portfolioDetailStore, rootStore } from 'shared/store';
import { AssetTypeName } from 'shared/constants';
import { BuyCryptoForm } from './buy-cryto-form';

interface IProps {
  coinCode: string;
  openPreviousForm: (params:any)=>void;
  handleClose: ()=>void;
  selectedCoin: { id: string; name: string; symbol: string };
  content: any;
}

export const AddNewCryptoForm = observer(
  ({
    coinCode,
    openPreviousForm,
    handleClose,
    selectedCoin,
    content,
  }: IProps) => {
    const theme = useTheme();

    useEffect(() => {
      const fetchAssetPrice = async () => {
        portfolioDetailStore.getCryptoInfoById(coinCode.toLowerCase());
      };
      fetchAssetPrice();
    }, []);

    const handleComeback = () => {
      openPreviousForm({
        curFormType: 'transaction',
        selectedType: AssetTypeName.cryptoCurrency,
      });
    };

    const portfolioName = 'Portoflio';
    const assetName = selectedCoin.name.toUpperCase();
    const currentPrice = portfolioDetailStore.searchedCryptoDetail?.usd;

    const handleFormSubmit = async (data: NewCryptoCurrencyAsset) => {
      const res = await portfolioDetailStore.addNewCryptoCurrency(data);
      if (res.isError) {
        rootStore.raiseError(res.data.en);
      } else {
        rootStore.raiseNotification(res.data.en, 'success');
      }
      handleClose();
    };

    return (
      <Box sx={{ height: 'inherit' }}>
        <Box sx={{ mt: '1rem' }}>
          <Typography align="center" id="modal-modal-title" variant="h4">
            {content.title}
          </Typography>
          <IconButton
            sx={{ position: 'absolute', left: '2rem', top: '1rem' }}
            onClick={handleComeback}
          >
            <ArrowBackIcon />
          </IconButton>
        </Box>
        <Box sx={{ ml: '3rem', mt: '1rem' }}>
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
            {assetName}: {currentPrice ? '$' + currentPrice : ''}
          </Typography>
        </Box>
        <Box
          sx={{
            [theme.breakpoints.down('sm')]: { height: '450px' },

            [theme.breakpoints.up('sm')]: {
              height: '530px',
            },
          }}
        >
          <BuyCryptoForm
            content={content}
            handleFormSubmit={handleFormSubmit}
            selectedCoin={selectedCoin}
          />
        </Box>
      </Box>
    );
  },
);