import { Box, Modal } from "@mui/material";
import { styled } from '@mui/material/styles';
import { observer } from "mobx-react-lite";
import { customAssetsDetailStore } from "shared/store";
import CSDMainForm from "./csd-main-form";

const StyledModal = styled(Box)(({ theme }: any) => ({
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 'auto',
    minWidth: '320px',
    height: '650px',
    maxHeight: '100vh',
    backgroundColor: '#FFFFFF',
    borderRadius: '12px',
    overflow: 'hidden',
    //boxShadow: '0 0 0 50vmax rgba(0,0,0,.5);',
    [theme.breakpoints.up('md')]: {
        minWidth: '450px',
        width: '450px',
    },
    [theme.breakpoints.down('md')]: {
        width: '70vw',
    },
    [theme.breakpoints.down('sm')]: {
        width: '90vw',
        height: '570px',
        '@media (maxHeight: 570px)': {
            height: '100vh',
        },
    },
    '@media(maxHeight: 650px) and (minWidth:600px)': {
        height: '100vh',
    },
}));

const CSDTransactionModal = observer(() => {
    const { isOpenAddNewTransactionModal } = customAssetsDetailStore;

    const handleClose = () => {
        customAssetsDetailStore.setOpenAddNewTransactionModal(false);
    };

    return (
        <Box>
            <Modal
                open={isOpenAddNewTransactionModal}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <StyledModal>
                    <CSDMainForm />
                </StyledModal>
            </Modal>
        </Box>);
});

export default CSDTransactionModal;