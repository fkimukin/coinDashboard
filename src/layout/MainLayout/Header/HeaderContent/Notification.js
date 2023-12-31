import { Box, IconButton } from '@mui/material';

import { BulbOutlined } from '@ant-design/icons';

// sx styles

// ==============================|| HEADER CONTENT - NOTIFICATION ||============================== //

const Notification = () => {
  const iconBackColorOpen = 'grey.300';
  const iconBackColor = 'grey.100';

  return (
    <Box sx={{ flexShrink: 0, ml: 0.75 }}>
      <IconButton
        disableRipple
        color="black"
        sx={{ color: 'text.primary', bgcolor: open ? iconBackColorOpen : iconBackColor }}
        aria-label="open profile"
        aria-controls={open ? 'profile-grow' : undefined}
        aria-haspopup="true"
      >
        <BulbOutlined />
      </IconButton>
    </Box>
  );
};

export default Notification;
