import React, { useEffect } from "react";
import { InputMaskClass, isInputMaskRef } from "@app/components/TextField/types";

export function useSuperFocusAfterDisabled(ref: React.MutableRefObject<HTMLInputElement | InputMaskClass | undefined>, disabled: boolean | undefined, superFocusCondition: boolean) {
	useEffect(() => {
		if (superFocusCondition && !disabled && ref.current) {
			if (isInputMaskRef(ref.current)) {
				ref.current.inputElement.focus();
				ref.current.inputElement.select();
			} else {
				ref.current.focus();
				ref.current.select();
			}
		}
	}, [superFocusCondition, disabled]);
}
