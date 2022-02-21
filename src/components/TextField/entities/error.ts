import { declareAction, declareAtom } from '@reatom/core';

export const setInputError = declareAction<boolean>('setInputError');
export const setFocusInput = declareAction<boolean>('setFocusInput');

export const inputAtom = declareAtom('inputErrorAtom', { hasError: false, shouldFocus: false }, (on) => [
    on(setInputError, (state, hasError) => ({ ...state, hasError })),
    on(setFocusInput, (state, shouldFocus) => ({ ...state, shouldFocus })),
]);
