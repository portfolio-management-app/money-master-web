import {
  Box,
  Button,
  Card,
  CardHeader,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  useTheme,
  useMediaQuery,
  Tooltip,
  IconButton,
} from '@mui/material';
import { useRouter } from 'next/router';
import PerfectScrollbar from 'react-perfect-scrollbar';
import 'react-perfect-scrollbar/dist/css/styles.css';
import { styled } from '@mui/material/styles';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { precisionRound } from 'utils';
import SettingsMenuButton from './settings-menu-button';

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
  stockDetail: Array<any> | undefined;
}

export const StockInvestments = ({ stockDetail }: IProps) => {
  const router = useRouter();
  const { locale } = useRouter();
  const { portfolioId } = router.query;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const headings = [
    'Price',
    "Today's Change",
    "Today's Gain/Loss",
    'Shares',
    'Total',
    '',
  ];
  const renderPriceWithCommas = (price: number) => {
    return '$' + price?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const renderPriceChange = (number: string) => {
    let val: string = '';
    const num = parseFloat(number);
    if (typeof num !== 'undefined') {
      if (num < 0) {
        val = `-$${number.slice(1)}`;
        return <span style={{ color: '#e01616' }}>{val}</span>;
      } else {
        val = `$${number.slice(1)}`;
        return <span style={{ color: '#0d6f3f' }}>{val}</span>;
      }
    }
    return undefined;
  };

  const renderPercentage = (number: string) => {
    const num = parseFloat(number);
    if (typeof num !== 'undefined') {
      if (num < 0) return <span style={{ color: '#e01616' }}>{number}%</span>;
      else return <span style={{ color: '#0d6f3f' }}>{number}%</span>;
    } else return undefined;
  };

  const renderTotal = (price: number, shares: number) => {
    return precisionRound(price * shares, 4);
  };

  const handleItemClick = (assetId: string) => {
    router.push(
      `/portfolio/${portfolioId}/stock/${assetId.toUpperCase()}`,
      `/portfolio/${portfolioId}/stock/${assetId.toUpperCase()}`,
      { locale: locale },
    );
  };

  return stockDetail?.length ? (
    <Grid item lg={12} md={12} xl={12} xs={12} mt="1rem">
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
          <CardHeader title="Stock" sx={{ padding: '0px' }} />
          <Button sx={{ padding: '0px', color: '#CBCBCD' }}>
            <MoreHorizIcon />
          </Button>
        </Card>
        <PerfectScrollbar>
          <Box>
            <Table>
              <TableHead>
                <TableRow>
                  <TableHeaderCell>Symbol</TableHeaderCell>
                  {headings.map((heading, i) => (
                    <TableHeaderCell key={i} sx={{ textAlign: 'right' }}>
                      {heading}
                    </TableHeaderCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {stockDetail.map((record, i) => {
                  return (
                    <TableRow
                      key={i}
                      sx={{
                        cursor: 'pointer',
                        ':hover': {
                          backgroundColor: '#F7F7F7',
                        },
                      }}
                    >
                      <TableBodyCellSymbol
                        onClick={() => handleItemClick(record.id)}
                      >
                        <Box
                          sx={{ fontWeight: 700, textTransform: 'uppercase' }}
                        >
                          {record.symbol}
                        </Box>
                        <Box
                          sx={{ color: '#4c4c4c', textTransform: 'uppercase' }}
                        >
                          {record.description}
                        </Box>
                      </TableBodyCellSymbol>
                      <TableBodyCell onClick={() => handleItemClick(record.id)}>
                        {renderPriceWithCommas(record.price)}
                      </TableBodyCell>
                      <TableBodyCell onClick={() => handleItemClick(record.id)}>
                        {renderPriceChange(record.priceChange)}{' '}
                        {(renderPercentage(record.percentChange))}
                      </TableBodyCell>
                      <TableBodyCell onClick={() => handleItemClick(record.id)}>
                        {renderPriceChange(record.profitLossAmount)}
                      </TableBodyCell>
                      <TableBodyCell onClick={() => handleItemClick(record.id)}>
                        {record.quantity}
                      </TableBodyCell>
                      <TableBodyCell onClick={() => handleItemClick(record.id)}>
                        {renderTotal(record.price, record.quantity)}
                      </TableBodyCell>
                      <TableBodyCell>
                        <SettingsMenuButton />
                      </TableBodyCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </Box>
        </PerfectScrollbar>
      </Card>
    </Grid>
  ) : (
    <></>
  );
};
