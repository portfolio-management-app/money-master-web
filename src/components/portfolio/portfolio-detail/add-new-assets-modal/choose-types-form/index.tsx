import { useState } from 'react';
import {
  Avatar,
  Box,
  Collapse,
  List,
  ListItemText,
  ListItemButton,
  ListItemIcon,
  useTheme,
} from '@mui/material';
import { Scrollbars } from 'react-custom-scrollbars';
import { v4 as uuid } from 'uuid';
import CurrencyBitcoinIcon from '@mui/icons-material/CurrencyBitcoin';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import MapsHomeWorkIcon from '@mui/icons-material/MapsHomeWork';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { BsCashCoin } from 'react-icons/bs';
import { RiPsychotherapyFill } from 'react-icons/ri';
import { AiFillGolden } from 'react-icons/ai';

interface IProps {
  openNextForm: any;
}

export const ChooseTypesForm = ({ openNextForm }: IProps) => {
  const [isOtherCollapse, setOtherCollapse] = useState(false);

  const handleOpenOthersList = () => {
    setOtherCollapse(!isOtherCollapse);
  };

  const handleSelectionClick = (type: string) => {
    openNextForm({ curFormType: 'type', selectedType: type });
  };

  return (
    <div id="searching-form-modal" style={{ height: 'inherit' }}>
      <div id="header-searching-form">
        <h2 id="modal-modal-title" style={{ textAlign:'center', marginTop: '1rem' }}>
          Choose Type
        </h2>
      </div>
      <Scrollbars>
        <List
          sx={{
            width: 'auto',
          }}
        >
          {CategoryList.map((item, index) => {
            return (
              <ListItemButton
                key={item.id}
                onClick={() => handleSelectionClick(item.type)}
              >
                <ListItemIcon>
                  <Avatar sx={{ bgcolor: 'appColor.blue' }}>{item.icon}</Avatar>
                </ListItemIcon>
                <ListItemText primary={item.label} />
                <ChevronRightIcon />
              </ListItemButton>
            );
          })}

          <ListItemButton key="others-type" onClick={handleOpenOthersList}>
            <ListItemIcon>
              <Avatar sx={{ bgcolor: 'appColor.blue' }}>
                <RiPsychotherapyFill />
              </Avatar>
            </ListItemIcon>
            <ListItemText primary="Others+" />
            {isOtherCollapse ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          <Collapse in={isOtherCollapse} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItemButton sx={{ pl: 8 }}>
                <ListItemIcon>
                  <Avatar sx={{ bgcolor: 'appColor.blue' }}>
                    <AiFillGolden />
                  </Avatar>
                </ListItemIcon>
                <ListItemText primary="Gold" />
                <ChevronRightIcon />
              </ListItemButton>
            </List>
          </Collapse>
        </List>
      </Scrollbars>
    </div>
  );
};

const CategoryList = [
  {
    id: uuid(),
    type: 'cryptoCurrency',
    label: 'Crypto Currency',
    icon: <CurrencyBitcoinIcon />,
  },
  { id: uuid(), type: 'stocks', label: 'Stocks', icon: <ShowChartIcon /> },
  {
    id: uuid(),
    type: 'realEstate',
    label: 'Real Estate',
    icon: <MapsHomeWorkIcon />,
  },
  { id: uuid(), type: 'cash', label: 'Cash', icon: <BsCashCoin /> },
  {
    id: uuid(),
    type: 'bankSavings',
    label: 'Bank Savings',
    icon: <AccountBalanceIcon />,
  },
];
