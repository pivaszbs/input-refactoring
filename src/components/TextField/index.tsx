/* eslint-disable max-lines */
import { noop } from "@reatom/core";
import { useAction, useAtom } from "@reatom/react";
import React, {
  FocusEventHandler,
  KeyboardEvent,
  memo,
  useCallback,
  useEffect,
  useRef,
} from "react";
import { inputAtom, setFocusInput, setInputError } from "./entities/error";
import {
  popFromSuperFocus,
  pushToSuperFocus,
  superFocuEnableAtom,
  superFocusPriorityAtom,
} from "./entities/focus";
import { Nullable } from "./entities/types";
import classnames from "classnames/bind";
import styles from "./styles.module.css";

import { InputMaskClass, isInputMaskRef, Props } from "./types";

const cn = classnames.bind(styles);

const TextField = ({
  withoutImplicitFocus,
  hasLowerCase = false,
  hasAutoSelect = true,
  hasAutoSelectAfterSubmit = false,
  selector = null,
  priority = 0,
  disabled,
  onKeyDown = noop,
  inputSize = "l",
  onFocus,
  onChange: onChangeProp,
  ...textFieldProps
}: Props) => {
  const callbackRef = useRef<() => void>(noop);
  const ref = useRef<Nullable<HTMLInputElement | InputMaskClass>>();
  const { hasError, shouldFocus } = useAtom(inputAtom);
  const superFocuEnable = useAtom(superFocuEnableAtom);
  const superFocusCondition = useAtom(
    superFocusPriorityAtom,
    (atomValue) =>
      superFocuEnable && atomValue?.selector === selector && selector !== null,
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
    return () => document.removeEventListener("keydown", callbackRef.current);
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
    if (shouldFocus && !withoutImplicitFocus && ref.current) {
      isInputMaskRef(ref.current)
        ? ref.current.inputElement.focus()
        : ref.current.focus();
      setFocus(false);
    }
  }, [shouldFocus, hasError, setError, setFocus, withoutImplicitFocus]);

  const onChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (hasLowerCase) {
        onChangeProp(e.currentTarget.value);
        return;
      }
      onChangeProp(String(e.currentTarget.value).toLocaleUpperCase());
    },
    [hasLowerCase, onChangeProp]
  );

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLInputElement>) => {
      if (hasAutoSelectAfterSubmit && event.key === "Enter" && ref.current) {
        isInputMaskRef(ref.current)
          ? ref.current.inputElement.select()
          : ref.current.select();
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
    [hasAutoSelect, onFocus, ref]
  );

  useEffect(() => {
    pushFocus({
      selector,
      priority,
    });

    return () => popFocus(priority);
  }, [pushFocus, popFocus, selector, priority]);

  return (
    <input
      data-e2e={selector || "text-field"}
      data-testid={textFieldProps["data-e2e"] || "text-field"}
      autoComplete="off"
      onFocus={handleFocus}
      className={cn("text-field", {
        "size-m": inputSize === "m",
        "size-l": inputSize === "l",
      })}
      onChange={onChange}
      disabled={disabled}
      onKeyDown={handleKeyDown}
      {...textFieldProps}
    />
  );
};

export default memo(TextField);
