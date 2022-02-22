/* eslint-disable max-lines */
import React, { FocusEventHandler, KeyboardEvent, memo, useCallback, useRef } from "react";
import { noop } from "@reatom/core";
import { useAtom } from "@reatom/react";
import classnames from "classnames/bind";
import { superFocusEnableAtom, superFocusPriorityAtom } from "./entities/focus";
import { InputMaskClass, Props } from "./types";
import { selectOnEnter, transformToUppercase } from "./utils";
import { DEFAULT_SELECTOR } from "./constants";

import styles from "./styles.module.css";
import { useFocusAfterErrorDefault, useSuperFocusDefault, useSuperFocusAfterDisabledDefault, useSuperFocusOnKeydownDefault } from "@app/components/TextField/hooks";

const cn = classnames.bind(styles);

const TextField = ({
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
	...textFieldProps
}: Props) => {
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
		[hasLowerCase, onChangeProp]
	);

	const handleKeyDown = useCallback(
		(event: KeyboardEvent<HTMLInputElement>) => {
			if (event.key === 'Enter') {
				handleEnter(ref, event, hasAutoSelectAfterSubmit);
			}
			onKeyDown(event);
		},
		[hasAutoSelectAfterSubmit, onKeyDown]
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
		<input
			data-e2e={selector || "text-field"}
			data-testid={selector || "text-field"}
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
	);
};

export default memo(TextField);
