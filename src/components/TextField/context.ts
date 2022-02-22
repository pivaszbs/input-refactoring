import { createContext } from "react";
import { TextFieldContextType } from "@app/components/TextField/types";
import {
	useFocusAfterErrorDefault,
	useSuperFocusAfterDisabledDefault,
	useSuperFocusDefault,
	useSuperFocusOnKeydownDefault
} from "@app/components/TextField/hooks";
import { selectOnEnter, transformToUppercase } from "@app/components/TextField/utils";

export const textFeildDefaultContextValue: TextFieldContextType = {
	useFocusAfterError: useFocusAfterErrorDefault,
	useSuperFocusOnKeydown: useSuperFocusOnKeydownDefault,
	useSuperFocus: useSuperFocusDefault,
	useSuperFocusAfterDisabled: useSuperFocusAfterDisabledDefault,
	handleEnter: selectOnEnter,
	transformValueOnChange: transformToUppercase,
	inputSize: 'l',
};

export const TextFieldDefaultContext = createContext<TextFieldContextType>({
	useFocusAfterError: useFocusAfterErrorDefault,
	useSuperFocusOnKeydown: useSuperFocusOnKeydownDefault,
	useSuperFocus: useSuperFocusDefault,
	useSuperFocusAfterDisabled: useSuperFocusAfterDisabledDefault,
	handleEnter: selectOnEnter,
	transformValueOnChange: transformToUppercase,
	inputSize: 'l',
});
