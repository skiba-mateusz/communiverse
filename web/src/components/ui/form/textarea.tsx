import styled, { css } from "styled-components";
import { ErrorMessage, FieldWrapper, LabelWrapper } from "./input";
import { useFormContext } from "react-hook-form";

interface TextareaProps {
  name: string;
  label: string;
  placeholder?: string;
}

const StyledTextarea = styled.textarea`
  ${({ theme }) => css`
    width: 100%;
    padding: ${theme.spacing(2)} ${theme.spacing(4)};
    background-color: ${theme.colors.neutral[50]};
    border: 1px solid ${theme.colors.neutral[300]};
    border-radius: ${theme.border.radius.md};
    outline: none;
    resize: vertical;
    scrollbar-width: thin;
  `}
`;

export const Textarea = ({
  name,
  label,
  placeholder,
  ...restProps
}: TextareaProps) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const isError = errors[name];

  return (
    <div>
      <LabelWrapper>{label}</LabelWrapper>
      <FieldWrapper>
        <StyledTextarea
          rows={12}
          placeholder={placeholder}
          {...register(name)}
          {...restProps}
        ></StyledTextarea>
      </FieldWrapper>
      {isError ? (
        <ErrorMessage>{errors[name]?.message as string}</ErrorMessage>
      ) : null}
    </div>
  );
};
