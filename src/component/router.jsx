import ErrorPage from '../ErrorPage';
import Main from '../Maincomponent';
import Home from './Homepage';
import Shop from './Shoppage';
import Cart from './Cartpage';
import Single from './Single';
import StructureDeck from './Strukturedeck';
import SealedProduct from './SealedProduck';
import Accessories from './Accessories';
import MyDeck from './MyDeck';
import Login from './Login';
import Register from './Register';
import Dashboard from '../dashboard/Dashboard';

const routes = [
  {
    path: '/',
    element: <Main />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Home /> },
      {
        path: 'shop',
        element: <Shop />,
        children: [
          { path: '/shop', element: <Single /> },
          { path: '/shop/struckture', element: <StructureDeck /> },
          { path: '/shop/sealed', element: <SealedProduct /> },
          { path: '/shop/accessories', element: <Accessories /> },
          { path: '/shop/mydeck', element: <MyDeck /> },
        ],
      },
      { path: 'cart', element: <Cart /> },
      { path: 'login', element: <Login /> },
      { path: 'register', element: <Register /> },
      { path: 'dashboard' ,
        element:<Dashboard/>,
        }
    ],
  },
];

export default routes;