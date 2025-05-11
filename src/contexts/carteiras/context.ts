
import { createContext } from 'react';
import { CarteirasContextType } from './types';

export const CarteirasContext = createContext<CarteirasContextType | undefined>(undefined);
