import React from "react";
import styled, { css } from "styled-components";
import { RadioGroupContextProvider } from "./radio-group-context";
import { Styles } from "@/types/styles";
import { parseStyles } from "@/utils/styles";

interface RadioGroupStyles {
  $styles?: Styles;
}

interface RadioGroupProps extends React.PropsWithChildren, RadioGroupStyles {
  defaultValue: string;
}

const StyledRadioGroup = styled.div<RadioGroupStyles>`
  ${({ theme, $styles }) => css`
    display: flex;
    flex-wrap: wrap;
    gap: ${theme.spacing(3)};
    ${parseStyles({ ...$styles }, theme)}
  `}
`;

export const RadioGroup = ({
  $styles,
  defaultValue,
  children,
}: RadioGroupProps) => {
  return (
    <RadioGroupContextProvider defaultValue={defaultValue}>
      <StyledRadioGroup $styles={$styles} role="radiogroup">
        {children}
      </StyledRadioGroup>
    </RadioGroupContextProvider>
  );
};
