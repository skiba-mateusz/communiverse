import { Styles } from "@/types/styles";
import { parseStyles } from "@/utils/styles";
import React, { useEffect, useId, useRef } from "react";
import styled, { css } from "styled-components";
import { ActionTypes, useRadioGroup } from "./radio-group-context";

interface RadioGroupItemStyles {
  $styles?: Styles;
  $active?: boolean;
}

interface RadioGroupItemProps
  extends React.PropsWithChildren,
    RadioGroupItemStyles {
  value: string;
  onClick?: (value: string) => void;
}

const StyledRadioGroupItem = styled.button<RadioGroupItemStyles>`
  ${({ theme, $styles, $active }) => css`
    height: 2.5rem;
    padding: ${theme.spacing(2)};
    background-color: ${$active ? theme.colors.neutral[950] : "transparent"};
    color: ${$active ? theme.colors.neutral[50] : theme.colors.neutral[950]};
    font-weight: ${theme.font.weight.semi};
    border: 1px solid ${theme.colors.neutral[950]};
    border-radius: ${theme.border.radius.md};
    transition: 300ms;
    ${parseStyles({ ...$styles }, theme)}
  `}
`;

export const RadioGroupItem = ({
  $styles,
  value,
  onClick,
  children,
}: RadioGroupItemProps) => {
  const {
    state: { activeValue },
    dispatch,
  } = useRadioGroup();
  const id = useId();
  const ref = useRef<HTMLButtonElement>(null);

  const active = activeValue === value;

  useEffect(() => {
    dispatch({ type: ActionTypes.REGISTER_ITEM, payload: { id, value, ref } });

    return () => {
      dispatch({ type: ActionTypes.UNREGISTER_ITEM, payload: { id } });
    };
  }, [dispatch, value, id]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const target = e.target as HTMLElement;
    let nextItem: HTMLElement | null = null;

    switch (e.key) {
      case "ArrowRight":
        nextItem = target.nextElementSibling as HTMLElement | null;
        if (!nextItem) {
          nextItem = target.parentElement?.children[0] as HTMLElement | null;
        }
        break;
      case "ArrowLeft":
        nextItem = target.previousElementSibling as HTMLElement | null;
        if (!nextItem) {
          nextItem = target.parentElement?.children[
            target.parentElement?.children.length - 1
          ] as HTMLElement | null;
        }
        break;
    }

    if (!nextItem) return;

    nextItem.focus();

    const nextValue = nextItem.getAttribute("value");
    if (nextValue !== null) {
      dispatch({
        type: ActionTypes.SELECT_ITEM,
        payload: { value: nextValue },
      });
      onClick?.(nextValue);
    }
  };

  const handleClick = () => {
    if (active) return;

    dispatch({ type: ActionTypes.SELECT_ITEM, payload: { value } });
    onClick?.(value);
  };

  return (
    <StyledRadioGroupItem
      $styles={$styles}
      $active={active}
      ref={ref}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role="radio"
      aria-checked={active}
      tabIndex={active ? 0 : -1}
      value={value}
    >
      {children}
    </StyledRadioGroupItem>
  );
};
