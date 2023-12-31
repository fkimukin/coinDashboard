import Search from './Search';
import Profile from './Profile';
import Notification from './Notification';

// ==============================|| HEADER - CONTENT ||============================== //

const HeaderContent = () => {
  return (
    <>
      <Search />

      <Notification />
      <Profile />
    </>
  );
};

export default HeaderContent;
