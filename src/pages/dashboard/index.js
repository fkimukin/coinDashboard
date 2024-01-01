import { useEffect, useState } from 'react';

// material-ui
import { Box, Button, Grid, List, ListItemButton, ListItemSecondaryAction, ListItemText, Stack, Typography } from '@mui/material';

// project import
import OrdersTable from './OrdersTable';
import IncomeAreaChart from './IncomeAreaChart';
import MainCard from 'components/MainCard';
import AnalyticEcommerce from 'components/cards/statistics/AnalyticEcommerce';
import axios from 'axios';

// avatar style
const avatarSX = {
  width: 36,
  height: 36,
  fontSize: '1rem'
};

// action style
const actionSX = {
  mt: 0.75,
  ml: 1,
  top: 'auto',
  right: 'auto',
  alignSelf: 'flex-start',
  transform: 'none'
};

// ==============================|| DASHBOARD - DEFAULT ||============================== //

const DashboardDefault = () => {
  const [slot, setSlot] = useState('week');
  const [selectedCoin, setSelectedCoin] = useState('bitcoin');
  const [selectedCoinData, setselectedCoinData] = useState([]);
  const [assetData, setAssetData] = useState([]);
  function formatPercentage(number) {
    const parsedNumber = parseFloat(number);

    if (isNaN(parsedNumber) || typeof parsedNumber !== 'number') {
      return 'Invalid number';
    }

    const formattedNumber = parsedNumber.toFixed(1);
    return `${formattedNumber}%`;
  }

  function formatNumberWithSuffix(value) {
    const number = parseFloat(value);
    if (isNaN(number) || typeof number !== 'number') {
      return 'Invalid number';
    }

    if (number >= 1e12) {
      return (number / 1e12).toFixed(2) + 'T';
    } else if (number >= 1e9) {
      return (number / 1e9).toFixed(2) + 'B';
    } else if (number >= 1e6) {
      return (number / 1e6).toFixed(2) + 'M';
    } else if (number >= 1e3) {
      return (number / 1e3).toFixed(2) + 'K';
    } else {
      return number.toFixed(2);
    }
  }
  const fetchCoinData = async () => {
    const graphqlEndpoint = 'https://graphql.coincap.io/';
    const graphqlQuery = `
      query ($id: ID!) {
        asset(id: $id) {
          name
          changePercent24Hr
          priceUsd
          marketCapUsd
          supply
          symbol
          rank
          volumeUsd24Hr
          website
          explorer
          __typename
        }
      }
    `;

    const variables = {
      id: selectedCoin // Replace with the actual asset ID
    };

    axios
      .post(graphqlEndpoint, { query: graphqlQuery, variables })
      .then((response) => {
        const data = response.data.data.asset;
        setselectedCoinData(data);

        // Access the data as needed
        console.log('Asset Information:', data);
      })
      .catch((error) => {
        console.error('Error making GraphQL request:', error);
      });
  };

  // Call the function to fetch data
  useEffect(() => {
    fetchCoinData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCoin]);
  let [marketTotalData, setMarketTotalData] = useState([]);

  useEffect(() => {
    const fetchMarketData = async () => {
      const graphqlQuery = `
    {
      marketTotal {
        marketCapUsd
        exchangeVolumeUsd24Hr
        assets
        exchanges
        markets
      }
      asset(id: "bitcoin") {
        priceUsd
        marketCapUsd
        volumeUsd24Hr
      }
    }
  `;

      // GraphQL endpoint
      const graphqlEndpoint = 'https://graphql.coincap.io/';

      // Make the GraphQL request
      axios
        .post(graphqlEndpoint, { query: graphqlQuery })
        .then((response) => {
          const data = response.data.data;

          // Access the data as needed
          setMarketTotalData(data.marketTotal);
          const assetData = data.asset;

          // Log the data to the console
          console.log('Market Total Data:', data.marketTotal);
          console.log('Asset Data:', assetData);
        })
        .catch((error) => {
          console.error('Error making GraphQL request:', error);
        });
      // get data
    };
    fetchMarketData();
  }, []);

  return (
    <Grid container rowSpacing={3} columnSpacing={1}>
      {/* row 1 */}
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <AnalyticEcommerce title="marketCap(Usd)" count={formatNumberWithSuffix(marketTotalData.marketCapUsd)} />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <AnalyticEcommerce
          title="Exchange Volume Usd24Hr"
          count={formatNumberWithSuffix(marketTotalData.exchangeVolumeUsd24Hr)}
          percentage={formatPercentage(assetData.changePercent24Hr)}
          isLoss
          color="success"
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <AnalyticEcommerce
          title="Markets"
          count={formatNumberWithSuffix(marketTotalData.markets)}
          percentage={-2.1}
          isLoss
          color="warning"
          extra="1,943"
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <AnalyticEcommerce
          title="Assets"
          count={formatNumberWithSuffix(marketTotalData.assets)}
          percentage={7.4}
          isLoss
          color="success"
          extra="$20,395"
        />
      </Grid>

      <Grid item md={8} sx={{ display: { sm: 'none', md: 'block', lg: 'none' } }} />

      {/* row 2 */}
      <Grid item xs={12} md={7} lg={9}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <Typography variant="h5">{selectedCoin.toLocaleUpperCase()}</Typography>
          </Grid>
          <Grid item>
            <Stack direction="row" alignItems="center" spacing={0}>
              <Button
                size="small"
                onClick={() => setSlot('month')}
                color={slot === 'month' ? 'primary' : 'secondary'}
                variant={slot === 'month' ? 'outlined' : 'text'}
              >
                Month
              </Button>
              <Button
                size="small"
                onClick={() => setSlot('week')}
                color={slot === 'week' ? 'primary' : 'secondary'}
                variant={slot === 'week' ? 'outlined' : 'text'}
              >
                Week
              </Button>
            </Stack>
          </Grid>
        </Grid>
        <MainCard content={false} sx={{ mt: 1.5 }}>
          <Box sx={{ pt: 1, pr: 2 }}>
            <IncomeAreaChart slot={slot} selectedCoin={selectedCoin} setAssetData={setAssetData} />
          </Box>
        </MainCard>
      </Grid>
      <Grid item xs={12} md={5} lg={3}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <Typography variant="h5">{selectedCoin.toLocaleUpperCase()}</Typography>
          </Grid>
          <Grid item />
        </Grid>
        <MainCard sx={{ mt: 2 }} content={false}>
          <List
            component="nav"
            sx={{
              px: 0,
              py: 0,
              '& .MuiListItemButton-root': {
                py: 1.5,
                '& .MuiAvatar-root': avatarSX,
                '& .MuiListItemSecondaryAction-root': { ...actionSX, position: 'relative' }
              }
            }}
          >
            <ListItemButton divider>
              <ListItemText primary={<Typography variant="subtitle1">priceUsd</Typography>} secondary="" />
              <ListItemSecondaryAction>
                <Stack alignItems="flex-end">
                  <Typography variant="subtitle1" noWrap>
                    {formatNumberWithSuffix(selectedCoinData.priceUsd)}
                  </Typography>
                  <Typography variant="h6" color="secondary" noWrap>
                    3%
                  </Typography>
                </Stack>
              </ListItemSecondaryAction>
            </ListItemButton>
            <ListItemButton divider>
              <ListItemText primary={<Typography variant="subtitle1">changePercent24Hr</Typography>} secondary="5 August, 1:45 PM" />
              <ListItemSecondaryAction>
                <Stack alignItems="flex-end">
                  <Typography variant="subtitle1" noWrap>
                    {formatPercentage(selectedCoinData.changePercent24Hr)}
                  </Typography>
                  <Typography variant="h6" color="secondary" noWrap></Typography>
                </Stack>
              </ListItemSecondaryAction>
            </ListItemButton>
            <ListItemButton>
              <ListItemText primary={<Typography variant="subtitle1">marketCapUsd</Typography>} secondary="7 hours ago" />
              <ListItemSecondaryAction>
                <Stack alignItems="flex-end">
                  <Typography variant="subtitle1" noWrap>
                    {formatNumberWithSuffix(selectedCoinData.marketCapUsd)}
                  </Typography>
                  <Typography variant="h6" color="secondary" noWrap>
                    16%
                  </Typography>
                </Stack>
              </ListItemSecondaryAction>
            </ListItemButton>
            <ListItemButton>
              <ListItemText primary={<Typography variant="subtitle1">supply</Typography>} secondary="7 hours ago" />
              <ListItemSecondaryAction>
                <Stack alignItems="flex-end">
                  <Typography variant="subtitle1" noWrap>
                    {formatNumberWithSuffix(selectedCoinData.supply)}
                  </Typography>
                  <Typography variant="h6" color="secondary" noWrap></Typography>
                </Stack>
              </ListItemSecondaryAction>
            </ListItemButton>
          </List>
        </MainCard>
      </Grid>

      {/* row 3 */}
      <Grid item xs={12} md={7} lg={12}>
        <Grid container alignItems="center" justifyContent="space-between"></Grid>
        <MainCard sx={{ mt: 2 }} content={false}>
          <OrdersTable setSelectedCoin={setSelectedCoin} />
        </MainCard>
      </Grid>
    </Grid>
  );
};

export default DashboardDefault;
