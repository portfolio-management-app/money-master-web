import { content } from "i18n";
import {
  action,
  computed,
  makeAutoObservable,
  observable,
  runInAction,
} from "mobx";
import { httpService } from "services";
import { CustomAssetItem, TransactionItem } from "shared/models";
import { Portfolio } from "shared/types";
import { rootStore } from "../root.store";

class CustomAssetDetailStore {
  portfolioId: number = 0;
  customAssetId: number = 0;
  portfolioInfo: Portfolio | undefined = undefined;
  currencyCode: string = "usd";
  customAssetDetail: CustomAssetItem | undefined = undefined;
  isOpenAddNewTransactionModal: boolean = false;
  transactionHistory: Array<TransactionItem> | undefined = [];

  constructor() {
    makeAutoObservable(this, {
      portfolioId: observable,
      customAssetId: observable,
      portfolioInfo: observable,
      customAssetDetail: observable,
      currencyCode: observable,
      isOpenAddNewTransactionModal: observable,
      transactionHistory: observable,

      setOpenAddNewTransactionModal: action,
      setPortfolioId: action,
      setCustomAssetId: action,
      setCurrency: action,

      fetchCustomAssetDetail: action,
      fetchPortfolioInfo: action,
      fetchTransactionHistory: action,
    });
  }

  setOpenAddNewTransactionModal(isOpen: boolean) {
    this.isOpenAddNewTransactionModal = isOpen;
  }

  setPortfolioId(portfolioId: string) {
    this.portfolioId = Number.parseFloat(portfolioId);
  }

  setCurrency(currencyCode: string) {
    this.currencyCode = currencyCode;
  }

  setCustomAssetId(assetId: string) {
    this.customAssetId = Number.parseFloat(assetId);
  }

  async fetchPortfolioInfo() {
    if (!this.portfolioId) {
      return;
    }

    const url = `/portfolio`;
    const res: { isError: boolean; data: any } = await httpService.get(url);

    if (!res.isError) {
      const currentPortfolio = res.data.find(
        (item: Portfolio) => item.id === this.portfolioId
      );
      runInAction(() => {
        this.currencyCode = this.portfolioInfo?.initialCurrency || "usd";
        this.portfolioInfo = currentPortfolio;
      });
    } else {
      runInAction(() => {
        this.portfolioInfo = undefined;
      });
    }
  }

  async fetchCustomAssetDetail() {
    const url = `/portfolio/${this.portfolioId}/custom`;
    const res: { isError: boolean; data: any } = await httpService.get(url);
    if (!res.isError) {
      runInAction(() => {
        this.customAssetDetail = res.data;
      });
    } else {
      rootStore.raiseError(
        content[rootStore.locale].error.failedToLoadInitialData
      );
      runInAction(() => {
        this.customAssetDetail = undefined;
      });
    }
  }

  async fetchTransactionHistory() {
    if (!this.portfolioId || !this.customAssetId) {
      return;
    }
    const url = `/portfolio/${this.portfolioId}/custom/${this.customAssetId}/transactions`;
    const res: { isError: boolean; data: any } = await httpService.get(url);
    if (!res.isError) {
      runInAction(() => {
        this.transactionHistory = res.data;
      });
    } else {
      rootStore.raiseError(
        content[rootStore.locale].error.failedToLoadInitialData
      );
    }
    return res;
  }
}

export const customAssetsDetailStore = new CustomAssetDetailStore();
