import dayjs from 'dayjs';
import dynamic from 'next/dynamic';
import React from 'react';
const ReactApexChart = dynamic(() => import('react-apexcharts'), {
  ssr: false,
});

interface IProps {
  data: Array<any>;
  timeInterval: number;
}

export const CandleStickChart = ({ timeInterval, data }: IProps) => {
  const candleStickData = data.map((item: Array<number>) => {
    return {
      x: new Date(item[0]),
      y: [item[1], item[2], item[3], item[4]],
    };
  });
  const candleStickSeries = [{ name: 'candestick', data: candleStickData }];
  const candleStickOptions: any = {
    chart: {
      height: 350,
      type: 'candlestick',
      zoom: {
        autoScaleYaxis: true,
      },
    },
    title: {
      text: 'Bitcoin',

      align: 'left',
      margin: 10,
    },
    tooltip: {
      enabled: true,
    },
    xaxis: {
      type: 'datetime',
      tickAmount: 6,
      labels: {
        formatter: function (val: any) {
          if (timeInterval <= 1) return dayjs(val).format('MMM DD HH:mm');
          else if (timeInterval <= 30) return dayjs(val).format('MMM DD HH:00');
          else return dayjs(val).format('MMM DD YYYY');
        },
      },
    },
    yaxis: {
      title: {
        text: 'Price',
      },
      tooltip: {
        enabled: true,
      },
      decimalsInFloat: 4,
    },
  };
  const AnyComponent = ReactApexChart as any;
  return (
    <React.Fragment>
      <AnyComponent
        options={candleStickOptions}
        series={candleStickSeries}
        type={'candlestick'}
        height="350"
        width={'100%'}
      />
    </React.Fragment>
  );
};
