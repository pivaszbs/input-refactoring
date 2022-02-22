import React, { useEffect, useRef } from "react";
import { InputMaskClass, isInputMaskRef } from "@app/components/TextField/types";
import { noop } from "@reatom/core";

export function useSuperFocusOnKeydown(ref: React.MutableRefObject<HTMLInputElement | InputMaskClass | undefined>, superFocusCondition: boolean) {
	const callbackRef = useRef<() => void>(noop);

	useEffect(() => {
		document.removeEventListener("keydown", callbackRef.current);
		callbackRef.current = () => {
			if (superFocusCondition && ref.current) {
				isInputMaskRef(ref.current)
					? ref.current.inputElement.focus()
					: ref.current.focus();
			}
		};
		document.addEventListener("keydown", callbackRef.current);
		return () =>
			document.removeEventListener("keydown", callbackRef.current);
	}, [superFocusCondition, ref]);
}
