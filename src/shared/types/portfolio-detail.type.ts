export type NewPortfolioItem = {
  name: string;
  initialCash: number;
  initialCurrency: string;
};

export type NewPersonalAssetType = {
  name: string;
};

export type NewBanksSavingAsset = {
  name: string;
  bankCode: string;
  inputDay: string;
  inputMoneyAmount: number;
  inputCurrency: string;
  isGoingToReinState: boolean;
  description: string;
  interestRate: number;
  termRange: number;
  isUsingInvestFund: boolean;
  isUsingCash: boolean;
  usingCashId: number;
  fee: number;
  tax: number;
};

export type NewRealEstateAsset = {
  name: string;
  inputDay: string;
  inputMoneyAmount: number;
  inputCurrency: string;
  buyPrice: number;
  currentPrice: number;
  description: string;
  isUsingInvestFund: boolean;
  isUsingCash: boolean;
  usingCashId: number;
  fee: number;
  tax: number;
};

export type NewStockAsset = {
  name: string;
  inputDay: string;
  description: string;
  currentAmountHolding: number;
  stockCode: string;
  marketCode: string;
  purchasePrice: 0;
  currencyCode: string;
  isUsingInvestFund: boolean;
  isUsingCash: boolean;
  usingCashId: number;
  fee: number;
  tax: number;
};

export type NewCryptoCurrencyAsset = {
  name: string;
  inputDay: string;
  description: string;
  currentAmountHolding: number;
  buyPrice: number;
  cryptoCoinCode: string;
  isUsingInvestFund: boolean;
  isUsingCash: boolean;
  usingCashId: number;
  fee: number;
  tax: number;
};

export type NewCashAsset = {
  name: string;
  amount: string;
  description: string;
  currencyCode: number;
  inputDay: string;
  isUsingInvestFund: boolean;
  isUsingCash: boolean;
  usingCashId: number;
  fee: number;
  tax: number;
};

export type NewPortfolioCustomAsset = {
  name: string;
  inputDay: string;
  inputMoneyAmount: number;
  inputCurrency: string;
  description: string;
  interestRate: number;
  termRange: number;
  isUsingInvestFund: boolean;
  isUsingCash: boolean;
  usingCashId: number;
  fee: number;
  tax: number;
};

export type UpdatedRealEstateItem = {
  name: string;
  inputDay: string;
  inputMoneyAmount: number;
  inputCurrency: string;
  buyPrice: number;
  currentPrice: number;
  description: string;
};

export type UpdatedBankSavingItem = {
  name: string;
  bankCode: string;
  inputDay: string;
  inputMoneyAmount: number;
  inputCurrency: string;
  isGoingToReinState: boolean;
  description: string;
  interestRate: number;
  changeInterestRateType: string;
  termRange: number;
};

export type SearchingDataItem = {
  id: string;
  symbol: string;
  name: string;
};

export type AssetType =
  | "crypto"
  | "stock"
  | "cash"
  | "bankSaving"
  | "realEstate"
  | "custom"
  | "fund"
  | "";

export interface IAddedAsset {
  assetType?: string;
  moneySource?: string;
  customAssetId?: number;
  stockCode?: string;
  cryptoCoinCode?: string;
  formType?: string;
  cryptoInfo?: SearchingDataItem;
  stockInfo?: SearchingDataItem;
}

export interface CurrencyItem {
  name: string;
  symbol: string;
  symbolNative: string;
  decimalDigits: any;
  rounding: number;
  code: string;
  namePlural: string;
}
