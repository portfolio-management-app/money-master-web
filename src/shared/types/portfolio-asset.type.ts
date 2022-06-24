export type TransactionType =
  | 'newAsset'
  | 'addValue'
  | 'withdrawValue'
  | 'withdrawToCash'
  | 'withdrawToOutside'
  | 'buyFromOutside'
  | 'buyFromFund'
  | 'buyFromCash'
  | 'sellAsset'
  | 'moveToFund';

export type TransactionRequestType =
  | 'newAsset'
  | 'addValue'
  | 'withdrawValue'
  | 'withdrawToCash'
  | 'withdrawToOutside'
  | 'buyFromOutside'
  | 'buyFromFund'
  | 'buyFromCash'
  | 'sellAsset'
  | 'moveToFund';

export interface ITransactionRequest {
  amount: number;
  amountInDestinationAssetUnit: number | null;
  currencyCode: string;
  transactionType: TransactionType;
  referentialAssetType: string | null;
  referentialAssetId: number | null;
  destinationAssetId: number | null;
  destinationAssetType: string | null;
  isTransferringAll: boolean;
  isUsingFundAsSource: boolean;
  fee: number;
  tax: number;
}

export interface ITransactionListRequest {
  itemsPerPage: number;
  nextPage: number;
  startDate: Date | null;
  endDate: Date | null;
  type: 'all' | 'in' | 'out';
}
