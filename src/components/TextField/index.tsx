/* eslint-disable max-lines */
import React, { FocusEventHandler, KeyboardEvent, memo, useCallback, useRef } from "react";
import { noop } from "@reatom/core";
import { useAtom } from "@reatom/react";
import classnames from "classnames/bind";
import { useFocusAfterErrorDefault, useSuperFocusDefault, useSuperFocusAfterDisabledDefault, useSuperFocusOnKeydownDefault } from "@app/components/TextField/hooks";
import { superFocusEnableAtom, superFocusPriorityAtom } from "./entities/focus";
import { InputMaskClass, Props } from "./types";
import { selectOnEnter, transformToUppercase } from "./utils";
import { DEFAULT_SELECTOR } from "./constants";

import styles from "./styles.module.css";

const cn = classnames.bind(styles);

function TextField({
	withoutImplicitFocus,
	disabled,
	onFocus,
	hasLowerCase,
	hasAutoSelectAfterSubmit,
	onChange: onChangeProp,
	hasAutoSelect = true,
	selector = DEFAULT_SELECTOR,
	inputSize = "l",
	priority = 0,
	dataE2e = selector || DEFAULT_SELECTOR,
	dataTestId = selector || DEFAULT_SELECTOR,
	handleEnter = selectOnEnter,
	transformValueOnChange = transformToUppercase,
	onKeyDown = noop,
	useSuperFocus = useSuperFocusDefault,
	useFocusAfterError = useFocusAfterErrorDefault,
	useSuperFocusOnKeydown = useSuperFocusOnKeydownDefault,
	useSuperFocusAfterDisabled = useSuperFocusAfterDisabledDefault,
	someJSX,
	...textFieldProps
}: Props) {
	const ref = useRef<HTMLInputElement | InputMaskClass>();
	const superFocuEnable = useAtom(superFocusEnableAtom);
	const superFocusCondition = useAtom(
		superFocusPriorityAtom,
		(atomValue) =>
			superFocuEnable &&
			atomValue?.selector === selector &&
			selector !== null,
		[selector, superFocuEnable]
	);

	useSuperFocus(selector, priority);
	useSuperFocusOnKeydown(ref, superFocusCondition);
	useSuperFocusAfterDisabled(ref, disabled, superFocusCondition);
	useFocusAfterError(ref, withoutImplicitFocus);

	const onChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			if (onChangeProp) {
				onChangeProp(transformValueOnChange(e.currentTarget.value));
			}
		},
		[onChangeProp, transformValueOnChange]
	);

	const handleKeyDown = useCallback(
		(event: KeyboardEvent<HTMLInputElement>) => {
			if (event.key === 'Enter') {
				handleEnter(ref, event, hasAutoSelectAfterSubmit);
			}
			onKeyDown(event);
		},
		[handleEnter, hasAutoSelectAfterSubmit, onKeyDown]
	);

	const handleFocus: FocusEventHandler<HTMLInputElement> = useCallback(
		(e) => {
			if (hasAutoSelect) {
				e.currentTarget.select();
			}
			if (onFocus) {
				onFocus(e);
			}
		},
		[hasAutoSelect, onFocus]
	);

	return (
		<>
			{someJSX}
			<input
				data-e2e={dataE2e}
				data-testid={dataTestId}
				autoComplete="off"
				onFocus={handleFocus}
				className={cn("text-field", {
					"size-m": inputSize === "m",
					"size-l": inputSize === "l",
				})}
				ref={ref as React.LegacyRef<HTMLInputElement>}
				onChange={onChange}
				disabled={disabled}
				onKeyDown={handleKeyDown}
				{...textFieldProps}
			/>
		</>
	);
}

export default memo(TextField);
