import { AppBar, Box, Toolbar } from '@mui/material';
import { styled } from '@mui/material/styles';

const InvestmentSummaryBox = styled(Box)`
  display: flex;
  flex-direction: row;
  align-items: end;
  font-size: 16px;

  @media (max-width: 768px) {
    flex-direction: column;
    font-size: 15px;
  }
`;

const InvestmentItemBox = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: end;
  margin-right: 1rem;

  @media (max-width: 768px) {
    flex-direction: row;
  }
`;

const InvestmentItemLabel = styled(Box)`
  color: #4c4c4c;
  font-weight: 400;
  text-align: right;

  @media (max-width: 768px) {
    margin-right: 0.4rem;
  }
`;

const Title = styled(Box)`
  @media (max-width: 768px) {
    font-size: 1.75rem;
  }
`;

interface IProps {
  portfolioValue: number;
  todaysChange: number;
}

export const Header = ({ portfolioValue, todaysChange }: IProps) => {
  const renderPriceWithCommas = (price: string) => {
    return '$' + price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  return (
    <AppBar
      sx={{
        background: '#FFFFFF',
        boxShadow: '0 0 8px rgba(0,0,0,0.11)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Toolbar
        sx={{
          height: '5rem',
          display: 'flex',
          justifyContent: 'space-between',
          maxWidth: '1280px',
          width: '100%',
        }}
      >
        <Box
          sx={{
            fontFamily: "'Pacifico', cursive",
            fontSize: '2rem',
            color: '#313BF3',
            background:
              'linear-gradient(90deg, rgba(49,59,243,1) 35%, rgba(130,137,255,1) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            MozBackgroundClip: 'text',
            MozTextFillColor: 'transparent',
          }}
        >
          <Title>investfolio</Title>
        </Box>
        <InvestmentSummaryBox>
          <InvestmentItemBox>
            <InvestmentItemLabel>Total Assets:</InvestmentItemLabel>
            <Box sx={{ color: '#313BF3', fontWeight: 700 }}>
              {renderPriceWithCommas(portfolioValue.toFixed(2))}
            </Box>
          </InvestmentItemBox>
          <InvestmentItemBox>
            <InvestmentItemLabel>Today&apos;s Change:</InvestmentItemLabel>
            <Box sx={{ color: '#529FE1', fontWeight: 700 }}>
              {todaysChange.toFixed(2)}%
            </Box>
          </InvestmentItemBox>
        </InvestmentSummaryBox>
      </Toolbar>
    </AppBar>
  );
};
