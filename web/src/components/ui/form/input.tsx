import React from "react";
import styled, { css } from "styled-components";
import { useFormContext } from "react-hook-form";

const InputWrapper = styled.div`
  position: relative;
`;

const StyledInput = styled.input`
  ${({ theme }) => css`
    width: 100%;
    height: 2.5rem;
    padding: ${theme.spacing(2)} ${theme.spacing(4)};
    background-color: ${theme.colors.neutral[50]};
    border: 1px solid ${theme.colors.neutral[300]};
    border-radius: ${theme.border.radius.md};
    outline: none;

    &:focus {
      border: 1px solid ${theme.colors.neutral[600]};
    }

    &[aria-invalid="true"] {
      border: 1px solid ${theme.colors.red[400]};
    }
  `}
`;

const LabelWrapper = styled.div`
  ${({ theme }) => css`
    display: flex;
    justify-content: space-between;
    font-size: ${theme.font.size.xs};
  `}
`;

const AndormentWrapper = styled.div`
  position: absolute;
  inset: 0 0 0 auto;
  display: grid;
  aspect-ratio: 1/1;
  overflow: hidden;
`;

const ErrorMessage = styled.p`
  ${({ theme }) => css`
    color: ${theme.colors.red[600]};
    font-size: ${theme.font.size.xs};
  `}
`;

interface InputProps {
  name: string;
  label: string;
  placeholder?: string;
  type?: string;
  action?: React.ReactNode;
  andorment?: React.ReactNode;
}

export const Input = ({
  name,
  label,
  placeholder,
  type,
  action,
  andorment,
}: InputProps) => {
  const {
    formState: { errors },
    register,
  } = useFormContext();

  const isError = errors[name];

  return (
    <div>
      <LabelWrapper>
        <label htmlFor={name}>{label}</label>
        {action}
      </LabelWrapper>
      <InputWrapper>
        <StyledInput
          id={name}
          placeholder={placeholder}
          type={type}
          aria-invalid={Boolean(isError)}
          {...register(name)}
        />
        {andorment ? <AndormentWrapper>{andorment}</AndormentWrapper> : null}
      </InputWrapper>
      {isError ? (
        <ErrorMessage role="alert">
          {errors[name]?.message as string}
        </ErrorMessage>
      ) : null}
    </div>
  );
};
