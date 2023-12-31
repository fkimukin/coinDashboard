// assets
import { ShoppingCartOutlined } from '@ant-design/icons';

// icons
const icons = {
  ShoppingCartOutlined
};

// ==============================|| MENU ITEMS - DASHBOARD ||============================== //

const dashboard = {
  id: 'group-dashboard',
  title: '',
  type: 'group',
  children: [
    {
      id: 'dashboard',
      title: 'Market',
      type: 'item',
      url: '/dashboard/default',
      icon: icons.ShoppingCartOutlined,
      breadcrumbs: false
    }
  ]
};

export default dashboard;
