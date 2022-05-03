import { useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { DesktopDatePicker, LocalizationProvider } from '@mui/lab';
import {
  Box,
  Button,
  FormControl,
  Grid,
  InputLabel,
  Select,
  TextField,
  MenuItem,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { SubmitHandler, useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { colorScheme } from 'utils/color-scheme';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { getSupportedCurrencyList } from 'shared/helpers';

type FormValues = {
  name: string;
  amount: number;
  currencyCode: string;
  description: string;
  brokerFeeInPercent?: number;
  brokerFee?: number;
  brokerFeeForSecurity?: number;
  incomeTax?: number;
};

interface IProps {
  handleFormSubmit: any;
  content: any;
}

export const BuyCashForm = ({ handleFormSubmit, content }: IProps) => {
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down('sm'));

  const [date, setDate] = useState<Date | null>(new Date());

  const validationSchema = Yup.object().shape({
    currencyCode: Yup.string().required().default('USD'),
    name: Yup.string().required('Name is required'),
    amount: Yup.number()
      .required('Amount is required')
      .typeError('Amount must be a number')
      .positive('Amount must be greater than zero'),
    description: Yup.string(),
  });

  const formOptions = { resolver: yupResolver(validationSchema) };
  const { register, reset, handleSubmit, formState, getValues, setError } =
    useForm<FormValues>(formOptions);
  const { errors } = formState;

  const currencyList = getSupportedCurrencyList();

  const handleDateChange = (newValue: Date | null) => {
    setDate(newValue);
  };
  const onSubmit: SubmitHandler<FormValues> = (data: any) => {
    handleFormSubmit({
      inputDay: date,
      currencyCode: data.currencyCode,
      amount: data.amount,
      name: data.name,
      description: data.description,
    });
  };

  return (
    <Box
      sx={{
        height: 'inherit',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch',
      }}
    >
      <Box
        id="buy-cash-form"
        component="form"
        autoComplete="off"
        onSubmit={handleSubmit(onSubmit)}
        sx={{
          width: '100%',
          overflow: 'auto',
          display: 'flex',
          alignItems: 'stretch',
          flexDirection: 'column',
          px: '3rem',
          [theme.breakpoints.down('xs')]: {
            px: '2rem',
          },
        }}
      >
        <Grid container spacing="2">
          <TextField
            type="text"
            fullWidth
            sx={{ mt: 1, display: 'block' }}
            id="outlined-cash-name"
            label={`*${content.name}`}
            {...register('name')}
            variant="outlined"
            error={typeof errors.name?.message !== 'undefined'}
            helperText={errors.name?.message}
          ></TextField>
          <TextField
            type="number"
            fullWidth
            inputProps={{ step: 'any' }}
            sx={{ mt: 1, display: 'block' }}
            id="outlined-cash-amount"
            label={`*${content.amount}`}
            {...register('amount')}
            variant="outlined"
            error={typeof errors.amount?.message !== 'undefined'}
            helperText={errors.amount?.message}
          ></TextField>
          <Grid container spacing={isXs ? 1 : 2}>
            <Grid item xs={12} sm={6} sx={{ mt: 1, display: 'block' }}>
              <FormControl fullWidth>
                <InputLabel id="currency-list">{content.currency}</InputLabel>
                <Select
                  variant="outlined"
                  labelId="currency-list"
                  id="cash-currency-list-select"
                  label={`*${content.currency}`}
                  defaultValue="USD"
                  {...register('currencyCode')}
                >
                  {currencyList.map((item, index) => {
                    return (
                      <MenuItem key={item.code} value={item.code}>
                        {item.code} - {item.name}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} sx={{ mt: 1, display: 'block' }}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DesktopDatePicker
                  label={`*${content.inputDay}`}
                  inputFormat="dd/MM/yyyy"
                  value={date}
                  onChange={handleDateChange}
                  renderInput={(params) => (
                    <TextField sx={{ width: '100%' }} {...params} />
                  )}
                />
              </LocalizationProvider>
            </Grid>
          </Grid>

          <TextField
            type="text"
            fullWidth
            sx={{ my: 1, display: 'block' }}
            id="outlined-cash-description"
            label={content.description}
            {...register('description')}
            variant="outlined"
            error={typeof errors.description?.message !== 'undefined'}
            helperText={errors.description?.message}
          ></TextField>
        </Grid>
      </Box>
      <Box
        sx={{
          mt: 'auto',
          px: '3rem',
          [theme.breakpoints.down('xs')]: {
            px: '2rem',
          },
          width: '100%',
        }}
      >
        <Button
          type="submit"
          form="buy-cash-form"
          variant="contained"
          sx={{
            bg: 'appColor.theme',
            width: '100%',
            fontSize: '1.4rem',
            height: '2.5rem',
          }}
        >
          {content.addNew}
        </Button>
      </Box>
    </Box>
  );
};