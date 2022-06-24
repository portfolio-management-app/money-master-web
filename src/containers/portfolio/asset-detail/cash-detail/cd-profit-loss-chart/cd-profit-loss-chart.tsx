import {
    CardHeader,
    Card,
    FormControl,
    MenuItem,
    Select,
    InputLabel,
    useMediaQuery,
    useTheme,
  } from '@mui/material';
  import { observer } from 'mobx-react-lite';
  import { Suspense } from 'react';
  import { HypnosisLoading } from 'shared/components';
  import { cashDetailStore } from 'shared/store';
  import { v4 as uuid } from 'uuid';
  import CSDLineChart from './cd-line-chart';
  
  const CDProfitLossChart = observer(() => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const handleSelectedTypeChange = async (value: any) => {
      cashDetailStore.fetchCashProfitLoss(value);
    };
  
    return (
      <>
        <Suspense fallback={<HypnosisLoading />}>
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
                justifyContent: 'center',
                alignItems: 'center',
                height: '5rem',
                boxShadow: 'none',
              }}
            >
              <FormControl
                sx={{ minWidth: '6rem', height: '4rem', px: '.2rem', mt: '10px' }}
              >
                <InputLabel id="type-select-label">Type</InputLabel>
                <Select
                  labelId="type-select-label"
                  id="type-select"
                  value={'month'}
                  label={'Type'}
                  onChange={handleSelectedTypeChange}
                >
                  <MenuItem key={uuid()} value={'day'}>
                    Day
                  </MenuItem>
                  <MenuItem key={uuid()} value={'month'}>
                    Month
                  </MenuItem>
                  <MenuItem key={uuid()} value={'year'}>
                    Year
                  </MenuItem>
                </Select>
              </FormControl>
            </Card>
            {cashDetailStore.profitLossList &&
            cashDetailStore.profitLossList.length > 0 ? (
              <CSDLineChart data={cashDetailStore.profitLossList} />
            ) : (
              <></>
            )}
          </Card>
        </Suspense>
      </>
    );
  });
  
  export default CDProfitLossChart;
  