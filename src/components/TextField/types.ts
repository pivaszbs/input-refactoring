import React, { KeyboardEvent, MutableRefObject } from 'react';
import { Nullable } from './entities/types';

export type InputMaskClass = {
    inputElement: HTMLInputElement;
    textMaskInputElement: {
        update: (value: string) => void;
    };
    props: {
        onChange: (event: Event) => void;
    };
};

export type InputRef = MutableRefObject<Nullable<InputMaskClass | HTMLInputElement>>;

export function isInputMaskRef(ref: InputMaskClass | HTMLInputElement): ref is InputMaskClass {
    return (ref as InputMaskClass).inputElement !== undefined;
}

export interface Props extends Omit<React.HTMLProps<HTMLInputElement>, 'onChange'> {
    withoutImplicitFocus?: boolean;
    hasAutoSelect?: boolean;
    hasLowerCase?: boolean;
    hasAutoSelectAfterSubmit?: boolean;
    selector?: string | null;
    priority?: number;
    onKeyDown?: (event: KeyboardEvent<HTMLInputElement>) => void;
    onChange?: (value: string) => void;
    inputSize: 'm' | 'l';
    dataE2e?: string;
    dataTestId?: string;
}
