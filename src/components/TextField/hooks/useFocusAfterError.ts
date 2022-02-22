import React, { useEffect } from "react";
import { InputMaskClass, isInputMaskRef } from "@app/components/TextField/types";
import { useAction, useAtom } from "@reatom/react";
import { inputAtom, setFocusInput, setInputError } from "@app/components/TextField/entities/error";

export function useFocusAfterError(ref: React.MutableRefObject<HTMLInputElement | InputMaskClass | undefined>, withoutImplicitFocus: undefined | boolean) {
	const setError = useAction(setInputError);
	const setFocus = useAction(setFocusInput);
	const { hasError, shouldFocus } = useAtom(inputAtom);

	useEffect(() => {
		if (hasError && ref.current) {
			isInputMaskRef(ref.current)
				? ref.current.inputElement.select()
				: ref.current.select();
			setError(false);
			return;
		}
		if (shouldFocus && !withoutImplicitFocus && ref.current) {
			isInputMaskRef(ref.current)
				? ref.current.inputElement.focus()
				: ref.current.focus();
			setFocus(false);
		}
	}, [shouldFocus, hasError, setError, setFocus, withoutImplicitFocus, ref]);
}
