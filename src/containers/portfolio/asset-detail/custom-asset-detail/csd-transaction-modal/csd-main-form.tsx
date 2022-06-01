import { Box, Button, ButtonGroup, Typography, useTheme } from "@mui/material";
import { observer } from "mobx-react-lite";
import { useState, useEffect } from "react";
import { customAssetsDetailStore } from "shared/store";
import CSDMoveToFundForm from "./csd-move-to-fund";
import CSDSellForm from "./csd-sell-form";

const CSDMainForm = observer(() => {
    const theme = useTheme();
    const [focusedButtonKey, setFocusedButtonKey] = useState(0);
    const [selectedForm, setSelectedForm] = useState<any>(null);
    const [errorMessage, setErrorMessage] = useState<string>('');

    useEffect(() => {
        const fetchAssetPrice = async () => { };
        fetchAssetPrice();
        setSelectedForm(
            <CSDSellForm
                key={focusedButtonKey}
                handleFormSubmit={sellAsset}
            />);
    }, []);

    const buttonLabels = ['Sell', 'Transfer'];

    const handleSelectionChanged = (key: number) => {
        setFocusedButtonKey(key);
        setErrorMessage('');
        setSelectedForm(formArray[key]);
    };

    const portfolioName = customAssetsDetailStore.portfolioInfo?.name;


    const sellAsset = () => {
        handleClose();
    }

    const moveToFund = () => {
        handleClose();
    }

    const formArray = [
        <CSDMoveToFundForm key={focusedButtonKey} handleFormSubmit={moveToFund} />,
        <CSDSellForm key={focusedButtonKey} handleFormSubmit={sellAsset} />,
    ];

    const handleClose = () => {
        customAssetsDetailStore.setOpenAddNewTransactionModal(false);
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
        </Box>);
});

export default CSDMainForm;