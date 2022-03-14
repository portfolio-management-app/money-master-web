import { getCurrencyByCode } from './../helpers/currency-info';
import { action, makeAutoObservable, observable } from 'mobx';
import { UserInfo } from 'models';
import { PortfolioAllocation, PortfolioItem } from 'types';
import { coinGeckoService } from 'services';

class PortfolioDetailStore {
  portfolioAllocationData: Array<PortfolioAllocation> = [];
  portfolioDetailData: Array<PortfolioItem> = [];
  portfolioValue: number = 0;
  todaysChange: number = 0;
  isOpenAddNewAssetModal: boolean = false;

  constructor() {
    makeAutoObservable(this, {
      portfolioAllocationData: observable,
      portfolioDetailData: observable,
      portfolioValue: observable,
      todaysChange: observable,
      isOpenAddNewAssetModal: observable,
      setOpenAddNewAssetModal: action,
      fetchPortfolioDetailData: action,
    });
  }

  setOpenAddNewAssetModal(isOpen: boolean) {
    this.isOpenAddNewAssetModal = isOpen;
  }

  async fetchPortfolioDetailData() {
    this.portfolioAllocationData = portfolioData.portfolioAllocation;
    this.portfolioDetailData = portfolioData.portfolioData;
    this.portfolioValue = portfolioData.portfolioValue;
    this.todaysChange = portfolioData.todaysChange;
    return true;
  }

  updatePortfolioDetailData() {
    return true;
  }

  async fetchCoinData({ code }: { code: string }) {
    try{
    const response: any = await coinGeckoService.getCoinInfoByCode({
      coinCode: code,
      marketData: true,
      sparkline: true,
    });
    const {market_data} = response;
    return {
      price: market_data?.current_,
      priceChange: ,
      percentChange: 0,
      profitLossAmount: 0,};
    }
    catch(error:any){
      return error;
    }
  }
}

export const portfolioDetailStore = new PortfolioDetailStore();

//template data;
export const portfolioData = {
  portfolioData: {
    cash: [
      {
        id: ' VND',
        currencyCode: 'VND',
        amount: '12000000',
      },
      {
        id: 'USD',
        currencyCode: 'USD',
        amount: '5000',
      },
    ],
    crypto: [
      {
        id: 'bitcoin',
        coinName: 'bitcoin',
        symbol: 'btc',
        amount: 1.43,
        price: 0,
        priceChange: 0,
        percentChange: 0,
        profitLossAmount: 0,
        currencyCode: 'USD',
        totalValue: 0,
      },
      {
        id: 'ethereum',
        coinName: 'ethereum',
        symbol: 'eth',
        amount: 1.55,
        price: 0,
        priceChange: 0,
        percentChange: 0,
        profitLossAmount: 0,
        currencyCode: 'USD',
        totalValue: 0,
      },
    ],
    stocks: [
      {
        id: 'appl',
        symbol: 'AAPL',
        description: 'Apple Inc',
        price: 165.12,
        pricePaid: '99.99',
        priceChange: '0.27',
        percentChange: '0.16',
        profitLossAmount: '4.05',
        quantity: 15,
        marketValue: '2476.80',
        portfolioAllocation: '0.02',
      },
      {
        id: 'crm',
        symbol: 'CRM',
        description: 'Salesforce.com, Inc',
        price: 210.53,
        pricePaid: '222.22',
        priceChange: '2.44',
        percentChange: '1.17',
        profitLossAmount: '85.40',
        quantity: 35,
        marketValue: '7368.55',
        portfolioAllocation: '0.05',
      },
      {
        id: 'dis',
        symbol: 'DIS',
        description: 'The Walt Disney Company',
        price: 148.46,
        pricePaid: '115.00',
        priceChange: '-1.07',
        percentChange: '-0.72',
        profitLossAmount: '-53.50',
        quantity: 50,
        marketValue: '7423.00',
        portfolioAllocation: '0.05',
      },
      {
        id: 'fb',
        symbol: 'FB',
        description: 'Facebook, Inc',
        price: 211.03,
        pricePaid: '185.00',
        priceChange: '0.55',
        percentChange: '0.26',
        profitLossAmount: '8.25',
        quantity: 15,
        marketValue: '3165.45',
        portfolioAllocation: '0.02',
      },
      {
        id: 'googl',
        symbol: 'GOOGL',
        description: 'Alphabet Inc Class A',
        price: 2701.14,
        pricePaid: '1725.00',
        priceChange: '11.95',
        percentChange: '0.44',
        profitLossAmount: '83.65',
        quantity: 7,
        marketValue: '18907.98',
        portfolioAllocation: '0.14',
      },
      {
        id: 'nflx',
        symbol: 'NFLX',
        description: 'Netflix Inc',
        price: 394.52,
        pricePaid: '500.00',
        priceChange: '3.72',
        percentChange: '0.95',
        profitLossAmount: '55.80',
        quantity: 15,
        marketValue: '5917.80',
        portfolioAllocation: '0.04',
      },
      {
        id: 'pypl',
        symbol: 'PYPL',
        description: 'PayPal Holdings, Inc',
        price: 111.93,
        pricePaid: '175.00',
        priceChange: '0.99',
        percentChange: '0.89',
        profitLossAmount: '4.95',
        quantity: 5,
        marketValue: '559.65',
        portfolioAllocation: '0.00',
      },
      {
        id: 'spot',
        symbol: 'SPOT',
        description: 'Spotify Technology S.A.',
        price: 156.19,
        pricePaid: '333.33',
        priceChange: '4.28',
        percentChange: '2.82',
        profitLossAmount: '21.40',
        quantity: 5,
        marketValue: '780.95',
        portfolioAllocation: '0.01',
      },
      {
        id: 'vgt',
        symbol: 'VGT',
        description: 'Vanguard Information Technology',
        price: 403.91,
        pricePaid: '300.00',
        priceChange: '0.09',
        percentChange: '0.02',
        profitLossAmount: '4.50',
        quantity: 50,
        marketValue: '20195.50',
        portfolioAllocation: '0.15',
      },
      {
        id: 'vti',
        symbol: 'VTI',
        description: 'Vanguard Total Stock Market',
        price: 221.17,
        pricePaid: '155.00',
        priceChange: '-0.24',
        percentChange: '-0.11',
        profitLossAmount: '-60.00',
        quantity: 250,
        marketValue: '55292.50',
        portfolioAllocation: '0.41',
      },
    ],
    realEstate: [
      {
        id: 'my_home',
        name: 'My home',
        address: '235 Nguyễn Văn Cừ, P.4, Q.5, Tp.Hồ Chí Minh',
        area: '123 meters',
        currency_code: 'VND',
        valuation: 100000,
      },
      {
        id: 'my_farm',
        name: 'My Farm',
        address: '123, Trần Hưng Đạo, Thị xã Dĩ An, Tỉnh Bình Dương',
        area: '1 hecta',
        currency_code: 'USD',
        valuation: 150000,
      },
    ],
    banking: [
      {
        id: 'saving_1',
        name: 'ACB 3months',
        inputDay: '2022-13-01T00:00:00',
        inputMoneyAmount: 1200.0,
        inputCurrency: 'USD',
        description: 'test custom asset',
        interestRate: 0.045,
        termRange: 3,
      },
      {
        id: 'saving_2',
        name: 'SCB 1year',
        inputDay: '2022-12-01T00:00:00',
        inputMoneyAmount: 4000.0,
        inputCurrency: 'USD',
        description: 'test custom asset',
        interestRate: 0.065,
        termRange: 12,
      },
    ],
  },
  portfolioAllocation: [
    { symbol: 'AAPL', portfolioAllocation: '0.02' },
    { symbol: 'BTC/USD', portfolioAllocation: '0.08' },
    { symbol: 'CRM', portfolioAllocation: '0.05' },
    { symbol: 'DIS', portfolioAllocation: '0.05' },
    { symbol: 'ETH/USD', portfolioAllocation: '0.02' },
    { symbol: 'FB', portfolioAllocation: '0.02' },
    { symbol: 'GOOGL', portfolioAllocation: '0.14' },
    { symbol: 'NFLX', portfolioAllocation: '0.04' },
    { symbol: 'PYPL', portfolioAllocation: '0.00' },
    { symbol: 'SPOT', portfolioAllocation: '0.01' },
    { symbol: 'VGT', portfolioAllocation: '0.15' },
    { symbol: 'VTI', portfolioAllocation: '0.41' },
  ],
  portfolioValue: 135850.9,
  todaysChange: 1.4093907364618126,
};
