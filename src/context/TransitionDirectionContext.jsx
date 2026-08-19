import { createContext, useContext } from 'react';

const TransitionDirectionContext = createContext(1);

export const TransitionDirectionProvider = TransitionDirectionContext.Provider;

export const useTransitionDirection = () => useContext(TransitionDirectionContext);
