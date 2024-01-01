import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';

// material-ui
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from '@mui/material';

// third-party
import { Search as SearchIcon } from '@mui/icons-material';
// project import
import { Avatar, InputAdornment, TableSortLabel, TextField } from '../../../node_modules/@mui/material/index';
import Green from './green.svg';
import Red from './red.svg';
function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc' ? (a, b) => descendingComparator(a, b, orderBy) : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

// ==============================|| ORDER TABLE - HEADER CELL ||============================== //

const headCells = [
  {
    id: 'name',
    align: 'left',
    disablePadding: false,
    label: 'Name'
  },
  {
    id: 'marketCapUsd',
    align: 'left',
    disablePadding: true,
    label: 'Market Cap (USD)'
  },
  {
    id: 'volumeUsd24Hr',
    align: 'right',
    disablePadding: false,
    label: 'Volume (USD - 24Hr)'
  },
  {
    id: 'priceUsd',
    align: 'left',
    disablePadding: false,
    label: 'Price (USD)'
  },
  {
    id: 'changePercent24Hr',
    align: 'right',
    disablePadding: false,
    label: 'Change Percent (24Hr)'
  },
  {
    id: 'vwap24Hr',
    align: 'right',
    disablePadding: false,
    label: 'VWAP (24Hr)'
  },
  {
    id: 'status',
    align: 'right',
    disablePadding: false,
    label: 'Status'
  }
];

// ==============================|| ORDER TABLE - HEADER ||============================== //

function OrderTableHead({ order, orderBy, onRequestSort }) {
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.align}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? <Box component="span">{order === 'desc' ? 'sorted descending' : 'sorted ascending'}</Box> : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

OrderTableHead.propTypes = {
  order: PropTypes.string,
  orderBy: PropTypes.string,
  onRequestSort: PropTypes.func
};

// ==============================|| ORDER TABLE - STATUS ||============================== //

const OrderStatus = ({ status }) => {
  let color = '';

  if (status.includes('-')) {
    color = Red;
  } else {
    color = Green;
  }

  return (
    
      <img src={color} alt="Status" style={{ width: '50px', height: '50' }} />
    
  );
};

OrderStatus.propTypes = {
  status: PropTypes.string
};

// ==============================|| ORDER TABLE ||============================== //
OrdersTable.propTypes = {
  setSelectedCoin: PropTypes.func.isRequired
};
export default function OrdersTable({ setSelectedCoin }) {
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('rank');
  const [selected] = useState([]);
  const [cryptoData, setCryptoData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchData = async () => {
    try {
      const response = await fetch('https://api.coincap.io/v2/assets');
      const data = await response.json();
      setCryptoData(data.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const isSelected = (id) => selected.indexOf(id) !== -1;

  const filteredCryptoData = cryptoData.filter((row) => {
    const searchTerms = searchTerm.toLowerCase().split(' ');
    return searchTerms.every((term) => Object.values(row).some((value) => String(value).toLowerCase().includes(term)));
  });
  const handleSelectCoin = (selectedCoin) => {
    setSelectedCoin(selectedCoin);
    console.log(selectedCoin);
  };
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
  return (
    <Box>
      <TextField
        fullWidth
        margin="normal"
        variant="outlined"
        placeholder="Search..."
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          )
        }}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <TableContainer
        sx={{
          width: '100%',
          overflowX: 'auto',
          position: 'relative',
          display: 'block',
          maxWidth: '100%',
          '& td, & th': { whiteSpace: 'nowrap' }
        }}
      >
        <Table
          aria-labelledby="tableTitle"
          sx={{
            '& .MuiTableCell-root:first-of-type': {
              pl: 2
            },
            '& .MuiTableCell-root:last-of-type': {
              pr: 3
            }
          }}
        >
          <OrderTableHead order={order} orderBy={orderBy} onRequestSort={handleRequestSort} />
          <TableBody>
            {stableSort(filteredCryptoData, getComparator(order, orderBy)).map((row) => {
              const isItemSelected = isSelected(row.id);
              return (
                <TableRow
                  hover
                  role="checkbox"
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  aria-checked={isItemSelected}
                  tabIndex={-1}
                  key={row.id}
                  selected={isItemSelected}
                >
                  <TableCell
                    onClick={() => {
                      handleSelectCoin(row.id);
                    }}
                    align="left"
                  >
                    <Avatar src={`${process.env.PUBLIC_URL}/icons/${row.symbol.toLowerCase()}@2x.png`} />
                    <span>{row.name} </span>
                  </TableCell>
                  <TableCell
                    onClick={() => {
                      handleSelectCoin(row.id);
                    }}
                    align="left"
                  >
                    {formatNumberWithSuffix(row.marketCapUsd)}
                  </TableCell>
                  <TableCell
                    onClick={() => {
                      handleSelectCoin(row.id);
                    }}
                    align="center"
                  >
                    {formatNumberWithSuffix(row.volumeUsd24Hr)}
                  </TableCell>
                  <TableCell
                    onClick={() => {
                      handleSelectCoin(row.id);
                    }}
                    align="left"
                  >
                    ${formatNumberWithSuffix(row.priceUsd)}
                  </TableCell>
                  <TableCell
                    onClick={() => {
                      handleSelectCoin(row.id);
                    }}
                    align="center"
                  >
                    {formatPercentage(row.changePercent24Hr)}
                  </TableCell>
                  <TableCell
                    onClick={() => {
                      handleSelectCoin(row.id);
                    }}
                    align="right"
                  >
                    {row.vwap24Hr}
                  </TableCell>
                  <TableCell
                    onClick={() => {
                      handleSelectCoin(row.id);
                    }}
                    align="right"
                  >
                    <OrderStatus status={row.changePercent24Hr} />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
