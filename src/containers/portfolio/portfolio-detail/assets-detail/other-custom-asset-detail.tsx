import {
  Box,
  Button,
  Card,
  CardHeader,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  useTheme,
  useMediaQuery,
  Tooltip,
} from '@mui/material';
import dayjs from 'dayjs';
import { useRouter } from 'next/router';
import { Scrollbars } from 'react-custom-scrollbars';
import { styled } from '@mui/material/styles';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { getCurrencyByCode } from 'shared/helpers';
import { CustomAssetItemByCategory } from 'shared/models';
import SettingsMenuButton from './settings-menu-button';
import { roundAndAddDotAndCommaSeparator } from 'utils';
import { TreeItem } from '@mui/lab';

const TableHeaderCell = styled(TableCell)`
  padding: 10px;
  color: #cbcbcd;
  font-weight: bold;
  text-transform: uppercase;
  border-top: 1px solid #e0e0e0;
  background-color: #fefdff;
`;

const TableBodyCellSymbol = styled(TableCell)`
  padding: 5px;
`;

const TableBodyCell = styled(TableCell)`
  padding: 5px;
  text-align: right;
`;

interface IProps {
  customAssetDetail: Array<CustomAssetItemByCategory> | undefined;
  content: any;
}

export const OtherCustomAssetInvestments = ({
  customAssetDetail,
  content,
}: IProps) => {
  const router = useRouter();
  const { locale } = useRouter();
  const { portfolioId } = router.query;

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { collumnsName, settingDropDownMenu } = content;
  const headings = [
    'Asset Name',
    'Amount',
    'Interest Rate',
    'Term Range',
    'Description',
    '',
  ];

  const renderInputMoneyAmount = (num: number, code: string) => {
    const currencySymbol = getCurrencyByCode(
      code.toUpperCase(),
    )?.symbol.toString();
    const qualifiedNum = roundAndAddDotAndCommaSeparator(num, 4);
    return typeof currencySymbol !== 'undefined'
      ? currencySymbol + qualifiedNum
      : qualifiedNum;
  };

  const renderInterestRate = (interestRate: number) => {
    const rate = roundAndAddDotAndCommaSeparator(interestRate, 4);
    return <span style={{ color: '#0d6f3f' }}>&#43;{rate + '%'}</span>;
  };

  const renderTermRange = (termRange: number, unit: string) => {
    const years = Math.floor(termRange / 12);
    const months = termRange % 12;
    const displayText = `${
      years > 1 ? years + ' years ' : years === 1 ? years + ' year ' : ''
    }${years > 0 && months !== 0 ? '& ' : ''}${
      months > 1 ? months + ' months' : months === 1 ? '1 month' : ''
    }`;
    return displayText;
  };

  const renderDescription = (description: any) => {
    return description.toString().slice(0, 25) + '...';
  };

  const handleItemClick = (assetId: number | string) => {
    // router.push(
    //   `/portfolio/${portfolioId}/bank-savings/${assetId.toString()}`,
    //   `/portfolio/${portfolioId}/bank-savings/${assetId.toString()}`,
    //   { locale: locale },
    // );
  };

  return customAssetDetail?.length ? (
    <Card
      sx={{
        borderRadius: '12px',
        padding: isMobile ? '5px 0px 0px 10px' : '5px 20px 20px 20px',
        boxShadow: '0 0 8px rgba(0,0,0,0.11)',
      }}
    >
      <Card
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          height: '3rem',
          boxShadow: 'none',
        }}
      >
        <CardHeader title="Others" sx={{ padding: '0px' }} />
        <Button sx={{ padding: '0px', color: '#CBCBCD' }}>
          <MoreHorizIcon />
        </Button>
      </Card>
      {/* <Scrollbars autoHide style = {{cursor:'pointer', minWidth: "100%"}}> */}
      <Box>
        <Table>
          <TableHead>
            <TableRow>
              <TableHeaderCell>Category</TableHeaderCell>
              {headings.map((heading, i) => (
                <TableHeaderCell key={i} sx={{ textAlign: 'right' }}>
                  {heading}
                </TableHeaderCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {customAssetDetail.map((record, recordIdx) => {
              const { assets } = record;
              return assets.map((item, itemIdx) => {
                return (
                  <TableRow
                    key={`category-${record.categoryId}-asset-${itemIdx}`}
                    sx={{
                      cursor: 'pointer',
                      ':hover': {
                        backgroundColor: '#F7F7F7',
                      },
                    }}
                  >
                    <TableBodyCellSymbol
                      onClick={() => handleItemClick(item.name)}
                    >
                      <Box sx={{ fontWeight: 700, textTransform: 'uppercase' }}>
                        {itemIdx === 0 ? record.categoryName : ''}{' '}
                      </Box>
                    </TableBodyCellSymbol>
                    <TableBodyCell onClick={() => handleItemClick(item.name)}>
                      <Box sx={{ fontWeight: 700, textTransform: 'uppercase' }}>
                        {item.name}
                      </Box>
                      <Box
                        sx={{ color: '#4c4c4c', textTransform: 'uppercase' }}
                      >
                        {dayjs(item.inputDay).format('DD-MM-YYYY')}
                      </Box>
                    </TableBodyCell>
                    <TableBodyCell onClick={() => handleItemClick(item.name)}>
                      {renderInputMoneyAmount(
                        item.inputMoneyAmount,
                        item.inputCurrency,
                      )}
                    </TableBodyCell>
                    <TableBodyCell onClick={() => handleItemClick(item.name)}>
                      {renderInterestRate(item.interestRate)}
                    </TableBodyCell>
                    <TableBodyCell onClick={() => handleItemClick(item.name)}>
                      {renderTermRange(item.termRange, 'months')}
                    </TableBodyCell>
                    <Tooltip title={item.description}>
                      <TableBodyCell onClick={() => handleItemClick(item.name)}>
                        {renderDescription(item.description)}
                      </TableBodyCell>
                    </Tooltip>
                    <TableBodyCell>
                      <SettingsMenuButton content={settingDropDownMenu} />
                    </TableBodyCell>
                  </TableRow>
                );
              });
            })}
          </TableBody>
        </Table>
      </Box>
      {/* </Scrollbars> */}
    </Card>
  ) : (
    <></>
  );
};
