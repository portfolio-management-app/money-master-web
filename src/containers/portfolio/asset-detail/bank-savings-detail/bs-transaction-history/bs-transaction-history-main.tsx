import {
  Card,
  Box,
  useTheme,
  useMediaQuery,
  CardHeader,
  Table,
  TableHead,
  TableRow,
  TableBody,
  styled,
  TableCell,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  SelectChangeEvent,
  IconButton,
} from '@mui/material';
import dayjs from 'dayjs';
import { roundAndAddDotAndCommaSeparator } from 'utils/number';
import {
  AssetTypeConstants,
  AssetTypeName,
  TransactionHistoryContants,
  TransactionTypeName,
} from 'shared/constants';
import { getCurrencyByCode } from 'shared/helpers';
import { BankSavingsTransactionList } from 'shared/models';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { TransactionType } from 'shared/types';
import { colorScheme } from 'utils';
import { ImArrowLeft, ImArrowRight } from 'react-icons/im';
import { content as i18n } from 'i18n';
import { useRouter } from 'next/router';
import { Pagination } from 'shared/components';
import { useEffect, useState } from 'react';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { GrPowerReset } from 'react-icons/gr';
import { v4 as uuid } from 'uuid';
import { bankSavingsDetailStore } from 'shared/store';

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
  transactionHistoryData: BankSavingsTransactionList | undefined;
}

const BSTransactionHistory = ({ transactionHistoryData }: IProps) => {
  const router = useRouter();
  const { locale, query } = router;
  const content =
    locale === 'vi'
      ? i18n['vi'].bankSavingDetailPage
      : i18n['en'].bankSavingDetailPage;
  const [pageNumbers, setPageNumbers] = useState<Array<number>>([]);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const headings = [
    content.transactionHistory.date,
    content.transactionHistory.amount,
    content.transactionHistory.type,
    content.transactionHistory.fromTo,
  ];
  const language = locale === 'vi' ? 'vi' : locale === 'en' ? 'en' : 'en';

  const resetTransaction = async () => {
    await bankSavingsDetailStore.resetTransactionSelection();
    resetPageNumbers();
  };

  useEffect(() => {
    resetPageNumbers();
  }, [bankSavingsDetailStore.transactionHistory]);

  const resetPageNumbers = () => {
    if (!bankSavingsDetailStore.transactionHistory) {
      return;
    }
    const currentPage = bankSavingsDetailStore.currentPage;
    const total = bankSavingsDetailStore.transactionHistory.length;
    const plus = total % TransactionHistoryContants.itemsPerPage ? 1 : 0;
    const count =
      Math.floor(total / TransactionHistoryContants.itemsPerPage) + plus;
    let arrPagination: Array<number> = [];

    if (count < 4 || currentPage <= 2) {
      arrPagination = Array.from({ length: count }, (_, i) => i + 1).slice(
        0,
        count,
      );
    } else if (count >= 4 && currentPage === count) {
      arrPagination = Array.from({ length: count }, (_, i) => i + 1).slice(
        count - 3,
        count,
      );
    } else if (count >= 4 && currentPage < count) {
      arrPagination = Array.from({ length: count }, (_, i) => i + 1).slice(
        currentPage - 2,
        currentPage + 1,
      );
    }
    setPageNumbers(arrPagination);
  };

  const handlePageChange = async (pageNumber: number) => {
    const transactionHistory =
      (bankSavingsDetailStore.transactionHistory &&
        bankSavingsDetailStore.transactionHistory.slice()) ||
      [];
    const total = transactionHistory.length;
    const plus = total % TransactionHistoryContants.itemsPerPage ? 1 : 0;
    const count =
      Math.floor(total / TransactionHistoryContants.itemsPerPage) + plus;
    if (pageNumber === bankSavingsDetailStore.currentPage) {
      return;
    }
    if (pageNumber < count && pageNumber > 0) {
      bankSavingsDetailStore.setCurrentPage(pageNumber);
      resetPageNumbers();
    }

    if (pageNumber == count) {
      const startDate = bankSavingsDetailStore.transactionSelection.startDate
        ? dayjs(bankSavingsDetailStore.transactionSelection.startDate)
            .startOf('day')
            .format()
        : null;
      const endDate = bankSavingsDetailStore.transactionSelection.endDate
        ? dayjs(bankSavingsDetailStore.transactionSelection.endDate)
            .endOf('day')
            .format()
        : null;
      const data = await bankSavingsDetailStore.fetchTransactionHistoryData({
        itemsPerPage: TransactionHistoryContants.itemsPerPage,
        nextPage: pageNumber + 1,
        type: bankSavingsDetailStore.transactionSelection.type,
        startDate: startDate,
        endDate: endDate,
      });
      if (data && data.length > 0) {
        transactionHistory.push(...data);
        bankSavingsDetailStore.setTransactionHistory(transactionHistory);
      }
      bankSavingsDetailStore.setCurrentPage(pageNumber);
    }
  };

  const handleStartDateChange = async (
    value: any,
    keyboardInputValue?: string | undefined,
  ) => {
    bankSavingsDetailStore.setSelectedTransaction('startDate', value);
    await bankSavingsDetailStore.refreshTransactionHistory();
  };

  const handleEndDateChange = async (
    value: any,
    keyboardInputValue?: string | undefined,
  ) => {
    bankSavingsDetailStore.setSelectedTransaction('endDate', value);
    await bankSavingsDetailStore.refreshTransactionHistory();
  };

  const handleSelectedTypeChange = async (event: SelectChangeEvent) => {
    bankSavingsDetailStore.setSelectedTransaction(
      'type',
      event.target.value as any,
    );
    await bankSavingsDetailStore.refreshTransactionHistory();
  };

  const renderSingleTransactionIncon = (
    transactionType: TransactionType | null,
  ) => {
    if (
      Array<any>(
        TransactionTypeName.BuyFromCash,
        TransactionTypeName.BuyFromFund,
        TransactionTypeName.BuyFromOutside,
        TransactionTypeName.AddValue,
        TransactionTypeName.NewAsset,
      ).includes(transactionType)
    ) {
      return (
        <Box display="flex" alignItems="center" justifyContent={'center'}>
          <ImArrowLeft fontSize="25" color={colorScheme.green400} />
          &nbsp; {content.transactionHistory.buy}
        </Box>
      );
    } else if (
      Array<any>(
        TransactionTypeName.WithdrawValue,
        TransactionTypeName.WithdrawToCash,
        TransactionTypeName.WithdrawToOutside,
      ).includes(transactionType)
    ) {
      return (
        <Box display="flex" alignItems="center" justifyContent={'center'}>
          <ImArrowRight fontSize="25" color={colorScheme.red400} />
          &nbsp;
          {content.transactionHistory.withdraw}
        </Box>
      );
    } else if (
      Array<any>(TransactionTypeName.MoveToFund).includes(transactionType)
    ) {
      return (
        <Box display="flex" alignItems="center" justifyContent={'center'}>
          <ImArrowRight fontSize="25" color={colorScheme.red400} />
          &nbsp; {content.transactionHistory.move}
        </Box>
      );
    }
    return <></>;
  };

  return (
    <>
      {transactionHistoryData && transactionHistoryData?.length >= 0 ? (
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
              height: '5rem',
              boxShadow: 'none',
            }}
          >
            <CardHeader title={content.transactionHistory.title} sx={{ padding: '0px', marginRight: 'auto' }} />
            <FormControl
              sx={{ minWidth: '6rem', height: '4rem', px: '.2rem', mt: '10px' }}
            >
              <InputLabel id="type-select-label">{content.transactionHistory.type}</InputLabel>
              <Select
                labelId="type-select-label"
                id="type-select"
                value={
                  bankSavingsDetailStore.transactionSelection.type || 'all'
                }
                label={content.transactionHistory.type}
                onChange={handleSelectedTypeChange}
              >
                <MenuItem key={uuid()} value={TransactionHistoryContants.all}>
                  {content.transactionHistory.all}
                </MenuItem>
                <MenuItem key={uuid()} value={TransactionHistoryContants.in}>
                  {content.transactionHistory.in}
                </MenuItem>
                <MenuItem key={uuid()} value={TransactionHistoryContants.out}>
                  {content.transactionHistory.out}
                </MenuItem>
              </Select>
            </FormControl>
            <Box
              sx={{
                mt: '10px',
                height: '4rem',
              }}
            >
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label={content.transactionHistory.startDate}
                  inputFormat="dd/MM/yyyy"
                  value={bankSavingsDetailStore.transactionSelection.startDate}
                  onAccept={() => true}
                  onChange={handleStartDateChange}
                  renderInput={(params) => (
                    <TextField {...params} sx={{ width: '10rem' }} />
                  )}
                />
              </LocalizationProvider>
            </Box>
            <Box
              sx={{
                mt: '10px',
                height: '4rem',
                ml: '5px',
              }}
            >
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label={content.transactionHistory.endDate}
                  inputFormat="dd/MM/yyyy"
                  value={bankSavingsDetailStore.transactionSelection.endDate}
                  onChange={handleEndDateChange}
                  renderInput={(params) => (
                    <TextField {...params} sx={{ width: '10rem' }} />
                  )}
                />
              </LocalizationProvider>
            </Box>
            <IconButton
              onClick={resetTransaction}
              sx={{
                padding: '0px',
                color: '#CBCBCD',
                marginLeft: 'auto',
                width: '3rem',
                height: '3rem',
              }}
            >
              <GrPowerReset />
            </IconButton>
          </Card>
          <Box>
            <Table>
              <TableHead>
                <TableRow>
                  {headings.map((heading, i) => (
                    <TableHeaderCell key={i} sx={{ textAlign: 'center' }}>
                      {heading}
                    </TableHeaderCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {transactionHistoryData
                  .slice(
                    (bankSavingsDetailStore.currentPage - 1) *
                      TransactionHistoryContants.itemsPerPage,
                    bankSavingsDetailStore.currentPage *
                      TransactionHistoryContants.itemsPerPage,
                  )
                  .map((record, i) => {
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
                        <TableBodyCellSymbol align="center">
                          <Box
                            sx={{
                              color: '#4c4c4c',
                              textTransform: 'uppercase',
                            }}
                          >
                            {dayjs(record.createdAt).format('DD/MM/YYYY')}
                          </Box>
                        </TableBodyCellSymbol>
                        <TableBodyCellSymbol align="center">
                          {getCurrencyByCode(record.currencyCode)?.symbol}
                          {roundAndAddDotAndCommaSeparator(record.amount, 4)}
                        </TableBodyCellSymbol>
                        <TableBodyCellSymbol align="center">
                          {renderSingleTransactionIncon(
                            record.singleAssetTransactionType,
                          )}
                        </TableBodyCellSymbol>
                        <TableBodyCellSymbol align="center">
                          {Array<any>(
                            TransactionTypeName.BuyFromCash,
                            TransactionTypeName.BuyFromFund,
                            TransactionTypeName.AddValue,
                            TransactionTypeName.NewAsset,
                          ).includes(record.singleAssetTransactionType)
                            ? AssetTypeConstants[language][
                                record.referentialAssetType ||
                                  AssetTypeName.outside
                              ] || ''
                            : Array<any>(
                                TransactionTypeName.WithdrawValue,
                                TransactionTypeName.MoveToFund,
                                TransactionTypeName.WithdrawToCash,
                              ).includes(record.singleAssetTransactionType)
                            ? AssetTypeConstants[language][
                                record.destinationAssetType ||
                                  AssetTypeName.outside
                              ] || ''
                            : Array<any>(
                                TransactionTypeName.WithdrawToOutside,
                                TransactionTypeName.BuyFromOutside,
                              ).includes(record.singleAssetTransactionType)
                            ? content.transactionHistory.outside
                            : ''}
                        </TableBodyCellSymbol>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
            <Pagination
              pageNumbers={pageNumbers}
              currentPage={bankSavingsDetailStore.currentPage}
              handleCurrentPage={handlePageChange}
            />
          </Box>
        </Card>
      ) : null}
    </>
  );
};

export default BSTransactionHistory;
