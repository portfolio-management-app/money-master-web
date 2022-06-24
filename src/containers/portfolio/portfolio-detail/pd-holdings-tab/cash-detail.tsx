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
  Tooltip,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { useRouter } from 'next/router';
import { styled } from '@mui/material/styles';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { roundAndAddDotAndCommaSeparator } from 'utils';
import { getCurrencyByCode } from 'shared/helpers';
import { CashItem } from 'shared/models';
import { AssetType } from 'shared/types';
import { AssetTypeName } from 'shared/constants';
import SettingsMenuButton from './settings-menu-button';
import { observer } from 'mobx-react-lite';

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
  cashDetail: Array<CashItem> | undefined;
  content: any;
  deleteAsset: (
    assetType: AssetType,
    assetId: string,
    portfolioId: string,
  ) => void;
  transferAssetToInvestFund: (
    assetType: AssetType,
    assetId: string,
    portfolioId: string,
    valueOfReferentialAssetBeforeCreatingTransaction :number
  ) => void;
}

export const CashInvestments = observer(({
  cashDetail,
  content,
  deleteAsset,
  transferAssetToInvestFund,
}: IProps) => {
  const router = useRouter();
  const { locale } = useRouter();
  const { portfolioId } = router.query;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { collumnsName, settingDropDownMenu } = content;
  const headings = [collumnsName.total, collumnsName.description, ''];

  const renderCurrencyName = (code: string) => {
    if (code) {
      return getCurrencyByCode(code)?.name;
    } else return '';
  };

  const renderTotalCash = (num: number, code: string) => {
    return (
      getCurrencyByCode(code)?.symbol.toString() +
      roundAndAddDotAndCommaSeparator(num, 2)
    );
  };

  const handleItemClick = (assetId: number) => {
    router.push(
      `/portfolio/${portfolioId}/cash/${assetId.toString()}`,
      `/portfolio/${portfolioId}/cash/${assetId.toString()}`,
      { locale: locale },
    );
  };

  const renderDescription = (description: any) => {
    if (description) return description.toString().slice(0, 25) + '...';
    else return "";
  };

  return cashDetail?.length ? (
    <Card
      sx={{
        height: '100%',
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
        <CardHeader title={content.title} sx={{ padding: '0px' }} />

      </Card>
      {/* <Scrollbars autoHeight> */}
      <Box>
        <Table>
          <TableHead>
            <TableRow>
              <TableHeaderCell>{collumnsName.currency}</TableHeaderCell>
              {headings.map((heading, i) => (
                <TableHeaderCell key={i} sx={{ textAlign: 'right' }}>
                  {heading}
                </TableHeaderCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {cashDetail.map((record, i) => {
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
                    <Box sx={{ fontWeight: 700, textTransform: 'uppercase' }}>
                      {record.currencyCode}
                    </Box>
                    <Box sx={{ color: '#4c4c4c', textTransform: 'uppercase' }}>
                      {renderCurrencyName(record.currencyCode)}
                    </Box>
                  </TableBodyCellSymbol>
                  <TableBodyCell onClick={() => handleItemClick(record.id)}>
                    {renderTotalCash(record.amount, record.currencyCode)}
                  </TableBodyCell>
                  <Tooltip title={record.description}>
                    <TableBodyCell onClick={() => handleItemClick(record.id)}>
                      {renderDescription(record.description)}
                    </TableBodyCell>
                  </Tooltip>
                  <TableBodyCell>
                    <SettingsMenuButton
                      assetType={AssetTypeName.cash}
                      assetId={record.id.toString()}
                      valueOfReferentialAssetBeforeCreatingTransaction={record.amount}
                      portfolioId={
                        Array.isArray(portfolioId)
                          ? portfolioId[0]
                          : portfolioId || ''
                      }
                      content={settingDropDownMenu}
                      deleteAsset={deleteAsset}
                      transferAssetToInvestFund={transferAssetToInvestFund}
                    />
                  </TableBodyCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Box>
      {/* </Scrollbars> */}
    </Card>
  ) : (
    <></>
  );
});
