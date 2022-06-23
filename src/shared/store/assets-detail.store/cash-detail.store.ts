import {
  ITransactionListRequest,
  ITransactionRequest,
} from './../../types/portfolio-asset.type';
import { TransactionItem } from './../../models/transaction.model';
import { PACashBreadcrumbTabs } from './../../constants/portfolio-asset';
import { fcsapiService, httpService } from 'services';
import { action, makeAutoObservable, observable, runInAction } from 'mobx';
import { portfolioData } from 'shared/store/portfolio/portfolio-data';
import { CashItem } from 'shared/models';
import { rootStore } from 'shared/store';
import { content } from 'i18n';
import { AssetTypeName, TransactionTypeName } from 'shared/constants';
import {
  CurrencyItem,
  Portfolio,
  TransferToInvestFundType,
} from 'shared/types';
import { getCurrencyByCode } from 'shared/helpers';

export interface IMoveToFundPayload {
  referentialAssetId: number;
  referentialAssetType: string;
  amount: number;
  currencyCode: string;
  isTransferringAll: boolean;
}

class CashDetailStore {
  portfolioId: number = 0;
  portfolioInfo: Portfolio | undefined = undefined;

  cashId: number = 0;
  cashDetail: CashItem | undefined = undefined;
  cashList: CashItem[] | undefined = [];
  currencyList: Array<CurrencyItem> | undefined = undefined;
  destCurrencyCode: string = '';
  sourceCurrencyCode: string = '';

  transactionHistory: Array<TransactionItem> | undefined = undefined;
  selectedType: 'all'|'in'|'out' = 'all';

  OHLC_data: Array<any> = [];
  forexMarketData: any = undefined;
  forexDetail: any = undefined;
  timeInterval: number = 1;
  timeFrame: string = '1w';

  selectedTab: string = PACashBreadcrumbTabs.overview;
  isOpenAddNewTransactionModal: boolean = false;
  needUpdateOverviewData: boolean = false;

  currentPage: number = 1;
  


  constructor() {
    makeAutoObservable(this, {
      portfolioInfo: observable,
      portfolioId: observable,

      cashId: observable,
      cashDetail: observable,
      cashList: observable,
      currencyList: observable,
      transactionHistory: observable,
      destCurrencyCode: observable,
      sourceCurrencyCode: observable,
      currentPage: observable,
      OHLC_data: observable,
      forexDetail: observable,
      forexMarketData: observable,
      timeInterval: observable,
      timeFrame: observable,

      selectedTab: observable,
      isOpenAddNewTransactionModal: observable,
      needUpdateOverviewData: observable,

      fetchOHLC_Data: action,
      fetchForexInfoByCode: action,
      fetchTransactionHistoryData: action,
      fetchForexDetail: action,

      setOpenAddNewTransactionModal: action,
      setCashId: action,
      setPortfolioId: action,
      setTimeInterval: action,
      setSourceCurrency: action,
      setDestCurrency: action,
      setSelectedTab: action,
      setUpdateOverviewData: action,
      setTransactionHistory: action,
      setSelectedTransactionType:action,
      
      resetInitialState: action,

      makeTransaction: action,
      moveToFund: action,
    });
  }

  setCurrentPage(pageNumber: number) {
    this.currentPage = pageNumber;
  }

  setOpenAddNewTransactionModal(isOpen: boolean) {
    this.isOpenAddNewTransactionModal = isOpen;
  }

  setCashId(id: string) {
    this.cashId = Number.parseInt(id);
  }

  setPortfolioId(id: string) {
    this.portfolioId = Number.parseInt(id);
  }

  setTimeInterval(interval: number) {
    this.timeInterval = interval;
    if (interval >= 1 && interval <= 2) this.timeFrame = '30m';
    if (interval >= 3 && interval <= 30) this.timeFrame = '4h';
    if (interval >= 31 && interval <= 180) this.timeFrame = '1d';
    if (interval > 180) this.timeFrame = '1w';
  }

  setSourceCurrency(source: string) {
    this.sourceCurrencyCode = source;
  }

  setDestCurrency(dest: string) {
    this.destCurrencyCode = dest;
  }

  setSelectedTransactionType(type:'all'|'in'|'out'){
    this.selectedType = type;
  }

  setSelectedTab(tab: string) {
    this.selectedTab = tab;
  }

  setUpdateOverviewData(isUpdate: boolean) {
    this.needUpdateOverviewData = isUpdate;
  }

  setTransactionHistory(history: TransactionItem[]) {
    this.transactionHistory = history;
  }

  async fetchOverviewData() {
    Promise.all([this.fetchPortfolioInfo(), this.fetchCashDetail()]);
  }

  async fetchPortfolioInfo() {
    if (!this.portfolioId || !this.cashId) {
      return;
    }
    const url = `/portfolio`;
    const res: { isError: boolean; data: any } = await httpService.get(url);

    if (!res.isError) {
      const currentPortfolio = res.data.find(
        (item: Portfolio) => item.id === this.portfolioId,
      );
      runInAction(() => {
        this.portfolioInfo = currentPortfolio;
        this.destCurrencyCode = currentPortfolio.initialCurrency;
      });
    } else {
      runInAction(() => {
        this.portfolioInfo = undefined;
        this.destCurrencyCode = '';
      });
    }
  }

  async fetchCashDetail() {
    const url = `/portfolio/${this.portfolioId}/cash`;
    const res: { isError: boolean; data: any } = await httpService.get(url);
    if (!res.isError) {
      runInAction(() => {
        this.cashList = res.data;
        this.currencyList = res.data.map((item: CashItem) =>
          getCurrencyByCode(item.currencyCode),
        );
        this.cashDetail = res.data.find(
          (item: CashItem) => item.id === this.cashId,
        );
        this.sourceCurrencyCode = this.cashDetail?.currencyCode || 'USD';
      });
    } else {
      rootStore.raiseError(
        content[rootStore.locale].error.failedToLoadInitialData,
      );
      runInAction(() => {
        this.cashDetail = undefined;
        this.currencyList = undefined;
        this.sourceCurrencyCode = '';
      });
    }
  }

  async fetchTransactionHistoryData({
    itemsPerPage,
    nextPage,
    startDate,
    endDate,
    type,
  }: ITransactionListRequest) {
    if (!this.portfolioId || !this.cashId) {
      return;
    }
    const params = {
                      PageSize:itemsPerPage,
                      PageNumber:nextPage,
                      Type:type,
                    };
    if(startDate&& endDate){
      params.StartDate=startDate;
      params.EndDate = endDate;
    }
    const url = `/portfolio/${this.portfolioId}/cash/${this.cashId}/transactions`;
    const res: { isError: boolean; data: any } = await httpService.get(url,params);
    if (!res.isError) {
      return res.data;
    } else {
      return [];
    }
  }

  async fetchMarketData() {
    if (!this.portfolioId || !this.cashId) {
      return;
    }
    Promise.all([this.fetchForexInfoByCode(), this.fetchOHLC_Data()]);
    return true;
  }

  async fetchOHLC_Data() {
    if (this.sourceCurrencyCode === this.destCurrencyCode) {
      return;
    }
    const symbol =
      this.sourceCurrencyCode?.toUpperCase() +
      '/' +
      this.destCurrencyCode?.toUpperCase();
    const res: any = await fcsapiService.getForexOHCL({
      symbol,
      timeFrame: this.timeFrame,
      level: 1,
    });
    if (!res.isError) {
      runInAction(() => {
        this.OHLC_data = res.data;
      });
    }
    return res;
  }

  async fetchForexInfoByCode() {
    if (
      !this.sourceCurrencyCode ||
      !this.destCurrencyCode ||
      this.sourceCurrencyCode === this.destCurrencyCode
    ) {
      return;
    }
    const symbol =
      this.sourceCurrencyCode?.toUpperCase() +
      '/' +
      this.destCurrencyCode?.toUpperCase();

    const res: any = await fcsapiService.getForexInfoByCode({
      symbol,
    });
    if (!res.isError) {
      runInAction(() => {
        this.forexMarketData = res.data;
      });
    }
    return res;
  }

  async fetchForexDetail() {
    if (!this.sourceCurrencyCode) {
      return;
    }
    const res: any = await fcsapiService.getForexProfileDetail(
      this.sourceCurrencyCode,
    );
    if (!res.isError) {
      runInAction(() => {
        this.forexDetail = res.data;
      });
    } else {
      runInAction(() => {
        this.forexDetail = undefined;
      });
    }
    return res;
  }

  async makeTransaction(params: ITransactionRequest) {
    rootStore.startLoading();
    const url = `/portfolio/${this.portfolioId}/transactions`;
    const res: { isError: boolean; data: any } = await httpService.post(
      url,
      params,
    );
    rootStore.stopLoading();
    if (!res.isError) {
      rootStore.raiseNotification(
        content[rootStore.locale].success.default,
        'success',
      );
      return res;
    } else {
      rootStore.raiseError(content[rootStore.locale].error.default);
      return res;
    }
  }

  async moveToFund(payload: TransferToInvestFundType) {
    const url = `/portfolio/${this.portfolioId}/transactions`;
    const res: { isError: boolean; data: any } = await httpService.post(
      url,
      payload,
    );
    if (!res.isError) {
      rootStore.raiseNotification(
        content[rootStore.locale].success.default,
        'success',
      );
    } else {
      rootStore.raiseError(content[rootStore.locale].error.default);
    }
    return res;
  }

  async resetTransaction(){
    const data = await cashDetailStore.fetchTransactionHistoryData({itemsPerPage:3 * TransactionHistoryContants.itemsPerPage, nextPage:1, type:'all'});
    cashDetailStore.setTransactionHistory(data);
    cashDetailStore.setCurrentPage(1);
  }

  resetInitialState() {
    this.cashDetail = undefined;
    this.portfolioInfo = undefined;
    this.currencyList = undefined;
    this.transactionHistory = [];

    this.sourceCurrencyCode = '';
    this.destCurrencyCode = '';

    this.forexMarketData = undefined;
    this.forexDetail = undefined;

    this.OHLC_data = [];
    this.timeFrame = '1w';

    this.needUpdateOverviewData = true;
    this.selectedTab = PACashBreadcrumbTabs.overview;

    this.currentPage = 1;
  }
}

export const cashDetailStore = new CashDetailStore();
