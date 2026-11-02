import { useEffect, useState } from 'react';
import Context from './Context';
import { requestAuth } from '../config/UserRequest';

import cookie from 'js-cookie';
import { requestGetCart } from '../config/CartRequest';

export function Provider({ children }) {
    const [dataUser, setDataUser] = useState(null);
    const [cart, setCart] = useState({});

    const logged = cookie.get('logged');

    const fetchAuth = async () => {
        const res = await requestAuth();
        setDataUser(res.metadata);
    };

    const getCart = async () => {
        const res = await requestGetCart();
        setCart(res.metadata);
    };

    useEffect(() => {
        if (logged) {
            fetchAuth();
            getCart();
        }
    }, [logged]);

    return <Context.Provider value={{ dataUser, cart, getCart }}>{children}</Context.Provider>;
}
