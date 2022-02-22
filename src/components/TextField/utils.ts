import React from "react";
import { InputMaskClass, isInputMaskRef } from "@app/components/TextField/types";

export const transformToUppercase = (value: string) => String(value).toLocaleUpperCase();

export function selectOnEnter(ref: React.MutableRefObject<HTMLInputElement | InputMaskClass | undefined>, event: React.KeyboardEvent<HTMLInputElement>, hasAutoSelectAfterSubmit: boolean | undefined) {
	if (
		hasAutoSelectAfterSubmit &&
		ref.current
	) {
		isInputMaskRef(ref.current)
			? ref.current.inputElement.select()
			: ref.current.select();
	}
}
