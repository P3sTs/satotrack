
import { createContext } from 'react';
import { CarteiraContextType } from './types';

export const CarteirasContext = createContext<CarteiraContextType | undefined>(undefined);
