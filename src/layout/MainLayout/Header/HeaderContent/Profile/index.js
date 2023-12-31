import PropTypes from 'prop-types';
import { Box, Stack, Typography, Button } from '@mui/material';

// assets

import { WalletOutlined } from '@ant-design/icons';

// tab panel wrapper
function TabPanel({ children, value, index, ...other }) {
  return (
    <div role="tabpanel" hidden={value !== index} id={`profile-tabpanel-${index}`} aria-labelledby={`profile-tab-${index}`} {...other}>
      {value === index && children}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired
};

// ==============================|| HEADER CONTENT - PROFILE ||============================== //

const Profile = () => {
  return (
    <Box shape="round" sx={{ flexShrink: 0, ml: 1 }}>
      <Button
        shape="round"
        sx={{
          p: 0.25,
          color: 'white',
          bgcolor: 'green',
          borderRadius: 1,
          '&:hover': { bgcolor: 'secondary.lighter', color: 'black' }
        }}
      >
        <Stack direction="row" spacing={2} alignItems="center" sx={{ p: 2 }}>
          <Typography variant="h5">Connect Wallet</Typography>
          <WalletOutlined sx={{ width: 32, height: 32 }} />
        </Stack>
      </Button>
    </Box>
  );
};

export default Profile;
