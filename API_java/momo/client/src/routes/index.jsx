import App from '../App';
import CartUser from '../pages/CartUser';
import Checkout from '../pages/Checkout';
import DetailProduct from '../pages/DetailProduct';
import LoginUser from '../pages/LoginUser';
import PaymentSuccess from '../pages/PaymentSuccess';
import RegisterUser from '../pages/RegisterUser';

const routes = [
    {
        path: '/',
        component: <App />,
    },
    {
        path: 'product/:id',
        component: <DetailProduct />,
    },
    {
        path: '/login',
        component: <LoginUser />,
    },
    {
        path: '/register',
        component: <RegisterUser />,
    },
    {
        path: '/cart',
        component: <CartUser />,
    },
    {
        path: '/checkout',
        component: <Checkout />,
    },
    {
        path: '/payment-success/:orderId',
        component: <PaymentSuccess />,
    },
];

export default routes;
