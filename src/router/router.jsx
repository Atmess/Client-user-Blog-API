import ErrorPage from '../ErrorPage';
import Main from '../Maincomponent';
import Home from '../component/Homepage';
import Shop from '../component/Shoppage';
import Cart from '../component/Cartpage';
import Single from '../component/Single';
import StructureDeck from '../component/Strukturedeck';
import SealedProduct from '../component/SealedProduck';
import Accessories from '../component/Accessories';
import MyDeck from '../component/MyDeck';
import Login from '../UserAcces/Login';
import Register from '../UserAcces/Register';
import Dashboard from '../dashboard/Dashboard';
import SinglePostView from '../component/Singlepost';
import PublishedPostsPage from '../component/PublishPostList';
import ProfilePage from '../UserAcces/UserProfile';

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
      { path: 'dashboard' ,element:<Dashboard/> },
      { path:'posts',element:< PublishedPostsPage /> },
      {path: 'posts/:id', element:<SinglePostView/>},
      {path: 'UserProfile',element:<ProfilePage/>}
    ],
  },
];

export default routes;