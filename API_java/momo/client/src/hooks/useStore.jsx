import { useContext } from 'react';
import Context from '../store/Context';

export const useStore = () => {
    const context = useContext(Context);
    return context;
};
