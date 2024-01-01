import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import axios from 'axios';
// material-ui
import { useTheme } from '@mui/material/styles';

// third-party
import ReactApexChart from 'react-apexcharts';

// chart options
const areaChartOptions = {
  chart: {
    height: 450,
    type: 'area',
    toolbar: {
      show: false
    }
  },
  dataLabels: {
    enabled: false
  },
  stroke: {
    curve: 'smooth',
    width: 2
  },
  grid: {
    strokeDashArray: 0
  }
};

// ==============================|| INCOME AREA CHART ||============================== //

const IncomeAreaChart = ({ slot, selectedCoin, setAssetData }) => {
  const theme = useTheme();

  const { primary, secondary } = theme.palette.text;
  const line = theme.palette.divider;

  const [options, setOptions] = useState(areaChartOptions);
  const [assetHistories, setAssetHistories] = useState([]);

  useEffect(() => {
    const getSelectedCoinGraphData = async () => {
      const graphqlEndpoint = 'https://graphql.coincap.io/';

      const graphqlQuery = `
        query ($id: ID!, $interval: Interval!, $start: Date, $end: Date) {
          assetHistories(assetId: $id, interval: $interval, start: $start, end: $end) {
            priceUsd
            timestamp
            date
          }
          asset(id: $id) {
            changePercent24Hr
            name
            symbol
            logo
          }
        }
      `;

      const variables = {
        id: selectedCoin, // Replace with your asset ID
        interval: 'm30',
        start: 1703462119837,
        end: 1704066906218
      };

      try {
        const response = await axios.post(graphqlEndpoint, { query: graphqlQuery, variables });
        const data = response.data.data;

        // Access the data as needed
        setAssetHistories(response.data.data.assetHistories);
        setAssetData(response.data.data.asset);

        // Log the data to the console or perform further actions
        console.log('Asset Histories:', data.assetHistories);
        console.log('Asset Data:', data.asset);
      } catch (error) {
        console.error('Error making GraphQL request:', error);
      }
    };

    getSelectedCoinGraphData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCoin]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');

    return `${hours}:${minutes}`;
  };

  useEffect(() => {
    setOptions((prevState) => ({
      ...prevState,
      colors: [theme.palette.primary.main, theme.palette.primary[700]],
      xaxis: {
        categories:
          slot === 'month'
            ? ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
            : assetHistories.map((history) => formatDate(history.date)),
        labels: {
          style: {
            colors: [
              secondary,
              secondary,
              secondary,
              secondary,
              secondary,
              secondary,
              secondary,
              secondary,
              secondary,
              secondary,
              secondary,
              secondary
            ]
          }
        },
        axisBorder: {
          show: true,
          color: line
        },
        tickAmount: slot === 'month' ? 11 : 7
      },
      yaxis: {
        labels: {
          style: {
            colors: [secondary]
          }
        }
      },
      grid: {
        borderColor: line
      },
      tooltip: {
        theme: 'light'
      }
    }));
  }, [primary, secondary, line, theme, slot, assetHistories]);

  const [series, setSeries] = useState([
    {
      name: 'priceUsd',
      data: []
    }
  ]);

  useEffect(() => {
    setSeries([
      {
        name: 'priceUsd',
        data: assetHistories.map((history) => history.priceUsd)
      }
    ]);
  }, [slot, assetHistories]);

  return <ReactApexChart options={options} series={series} type="area" height={450} />;
};

IncomeAreaChart.propTypes = {
  slot: PropTypes.string,
  selectedCoin: PropTypes.string.isRequired,
  setAssetData: PropTypes.func.isRequired
};

export default IncomeAreaChart;
