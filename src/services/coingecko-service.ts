import axios from 'axios';

export const coinGeckoService = {
  getCoinInfoByCode,
  searchForCoin,
  getMarketChartData,
};

const BASE_URL = 'https://api.coingecko.com/api/v3';

async function getCoinInfoByCode(params: any) {
  const url = `/coins/${params.coinCode}?${
    params?.localization ? 'localization=true' : null
  }&${params?.tickers ? 'tickers=true' : null}&${
    params?.marketData ? 'market_data=true' : null
  }&${params?.communityData ? 'community_data=true' : null}&${
    params?.developerData ? 'developer_data=true' : null
  }&${params?.sparkLine ? 'sparkline=false' : null}`;
  try {
    const response = await axios.get(`${BASE_URL}${url}`, {
      headers: { 'Content-Type': 'application/json' },
    });

    return {
      isError: false,
      data: response.data,
    };
  } catch (error: any) {
    return {
      isError: true,
      data: error.response,
    };
  }
}

async function searchForCoin() {}

async function getMarketChartData() {}
