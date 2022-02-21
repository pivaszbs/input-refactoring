/* eslint-disable max-lines */
import { noop } from "@reatom/core";
import { useAction, useAtom } from "@reatom/react";
import React, {
	FocusEventHandler,
	KeyboardEvent, LegacyRef,
	memo,
	useCallback,
	useEffect,
	useRef,
} from 'react';
import classnames from "classnames/bind";
import { inputAtom, setFocusInput, setInputError } from "./entities/error";
import {
	popFromSuperFocus,
	pushToSuperFocus,
	superFocuEnableAtom,
	superFocusPriorityAtom,
} from "./entities/focus";
import styles from "./styles.module.css";

import { InputMaskClass, isInputMaskRef, Props } from "./types";

const cn = classnames.bind(styles);

function TextField({
	disabled,
	onFocus,
	onChange: onChangeProp,
	onKeyDown,
	selector,
	dataE2e,
	inputSize,
	priority,
	...textFieldProps
}: Props) {
	const callbackRef = useRef<() => void>(noop);
	const ref = useRef<HTMLInputElement>();
	const { hasError, shouldFocus } = useAtom(inputAtom);
	const superFocuEnable = useAtom(superFocuEnableAtom);
	const superFocusCondition = useAtom(
		superFocusPriorityAtom,
		(atomValue) =>
			superFocuEnable &&
			atomValue?.selector === selector &&
			selector !== null,
		[selector, superFocuEnable]
	);
	const pushFocus = useAction(pushToSuperFocus);
	const popFocus = useAction(popFromSuperFocus);
	const setError = useAction(setInputError);
	const setFocus = useAction(setFocusInput);

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
	}, [superFocusCondition]);

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

	useEffect(() => {
		if (hasError && ref.current) {
			isInputMaskRef(ref.current)
				? ref.current.inputElement.select()
				: ref.current.select();
			setError(false);
			return;
		}
		if (shouldFocus && ref.current) {
			isInputMaskRef(ref.current)
				? ref.current.inputElement.focus()
				: ref.current.focus();
			setFocus(false);
		}
	}, [shouldFocus, hasError, setError, setFocus]);

	const onChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			if (onChangeProp) {
				onChangeProp(String(e.currentTarget.value).toLocaleUpperCase());
			}
		},
		[onChangeProp]
	);

	const handleKeyDown = useCallback(
		(event: KeyboardEvent<HTMLInputElement>) => {
			if (event.key === "Enter" && ref.current) {
				isInputMaskRef(ref.current)
					? ref.current.inputElement.select()
					: ref.current.select();
			}
			if (onKeyDown) {
				onKeyDown(event);
			}
		},
		[onKeyDown]
	);

	const handleFocus: FocusEventHandler<HTMLInputElement> = useCallback(
		(e) => {
			e.currentTarget.select();
			if (onFocus) {
				onFocus(e);
			}
		},
		[onFocus]
	);

	useEffect(() => {
		pushFocus({
			selector,
			priority,
		});

		return () => {
			popFocus(priority);
		};
	}, [pushFocus, popFocus, selector, priority]);

	return (
		<input
			data-e2e={dataE2e}
			data-testid={dataE2e}
			autoComplete="off"
			onFocus={handleFocus}
			className={cn("text-field", {
				"size-m": inputSize === "m",
				"size-l": inputSize === "l",
			})}
			ref={ref as LegacyRef<HTMLInputElement>}
			onChange={onChange}
			disabled={disabled}
			onKeyDown={handleKeyDown}
			{...textFieldProps}
		/>
	);
}

export default memo(TextField);
