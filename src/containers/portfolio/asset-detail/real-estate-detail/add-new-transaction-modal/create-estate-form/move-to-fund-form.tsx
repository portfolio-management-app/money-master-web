import { useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Box,
  Button,
  useTheme,
} from "@mui/material";
import { SubmitHandler, useForm } from "react-hook-form";
import * as Yup from "yup";
import { colorScheme } from "utils/color-scheme";
import React from "react";
import MenuItem from "@mui/material/MenuItem";
import {
  realEstateDetailStore,
} from "shared/store";
import { getSupportedCurrencyList } from "shared/helpers/currency-info";
import InputLabel from "@mui/material/InputLabel";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { observer } from "mobx-react-lite";

type FormValues = {
  currencyCode: string;
};

interface IProps {
  handleFormSubmit: any;
}

export const MoveToFundForm = observer(({ handleFormSubmit }: IProps) => {
  const theme = useTheme();
  const validationSchema = Yup.object().shape({
    currencyCode: Yup.string().required("Currency code is required"),
  });

  const formOptions = { resolver: yupResolver(validationSchema) };
  const { register, handleSubmit, formState} =
    useForm<FormValues>(formOptions);
  const { errors } = formState;

  const onSubmit: SubmitHandler<FormValues> = (data: any) => {
    handleFormSubmit(data);
    realEstateDetailStore.setOpenAddNewTransactionModal(false);
  };

  const [currencyList, setCurrencyList] = React.useState<any>({});
  React.useEffect(() => {
    getSupportedCurrencyList().forEach((currency) => {
      setCurrencyList((prevState: any) => ({
        ...prevState,
        [currency.code]: currency.name,
      }));
    });
  }, []);

  const [currencyCode, setCurrencyCode] = React.useState("");

  const handleChangeCurrencyCode = (event: SelectChangeEvent) => {
    setCurrencyCode(event.target.value as string);
  };

  return (
    <Box
      component="form"
      autoComplete="off"
      onSubmit={handleSubmit(onSubmit)}
      sx={{
        height: "inherit",
        overflow: "auto",
        justifyContent: "center",
        display: "flex",
        alignItems: "stretch",
        flexDirection: "column",
        mx: "3rem",
        [theme.breakpoints.down("xs")]: {
          mx: "2rem",
        },
      }}
    >
      
      <InputLabel id="currency-code-select">Currency code</InputLabel>
      <Select
        sx={{ mb: 3 }}
        {...register("currencyCode")}
        type="string"
        labelId="currency-code-select"
        id="currency-code-select"
        value={currencyCode}
        label="Currency code"
        onChange={handleChangeCurrencyCode}
        error={typeof errors.currencyCode?.message !== "undefined"}
      >
        {Object.keys(currencyList).map((currency, index) => (
          <MenuItem
            key={index}
            value={currency}
          >{`${currencyList[currency]} (${currency})`}</MenuItem>
        ))}
        )
      </Select>

      <i>* All money from estate asset will be move to fund</i>


      <Button
        type="submit"
        variant="contained"
        sx={{
          mt: "auto",
          bg: colorScheme.theme,
          width: "100%",
          fontSize: "1.4rem",
          height: "2.5rem",
        }}
      >
        SELL
      </Button>
    </Box>
  );
});