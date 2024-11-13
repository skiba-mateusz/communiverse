import styled from "styled-components";
import { useFormContext } from "react-hook-form";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";

import { Message } from "@/components/ui/message";
import { useState } from "react";

const StyledInput = styled.input`
  width: 100%;
  padding: var(--size-100) var(--size-200);
  margin-bottom: var(--size-50);
  border: 2px solid var(--clr-neutral-300);
  border-radius: var(--size-100);
  outline: none;

  &:focus {
    border: 2px solid var(--clr-neutral-600);
  }

  &[aria-invalid="true"] {
    border: 2px solid var(--clr-red-400);
  }
`;

const Label = styled.label`
  font-size: var(--fs-50);
`;

const PasswordWrapper = styled.div`
  position: relative;
`;

const ToggleBtn = styled.button`
  position: absolute;
  inset: 0 1rem 0.25rem auto;
  background-color: transparent;
  border: none;

  &:hover {
    opacity: 0.8;
  }
`;

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label: string;
  type?: string;
}

export const Input = ({
  name,
  label,
  type = "text",
  ...restProps
}: FormInputProps) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();
  const [isVisible, setIsVisible] = useState(false);

  const isError = errors[name];

  return (
    <div>
      <Label htmlFor={name}>{label}</Label>
      {type !== "password" ? (
        <StyledInput
          id={name}
          type={type}
          aria-invalid={Boolean(isError)}
          {...register(name)}
          {...restProps}
        />
      ) : (
        <PasswordWrapper>
          <StyledInput
            id={name}
            type={isVisible ? "text" : "password"}
            aria-invalid={Boolean(isError)}
            {...register(name)}
            {...restProps}
          />
          <ToggleBtn
            type="button"
            onClick={() => setIsVisible((prev) => !prev)}
          >
            {isVisible ? <AiFillEye /> : <AiFillEyeInvisible />}
          </ToggleBtn>
        </PasswordWrapper>
      )}

      {isError && (
        <Message variant="alert">{errors[name]?.message as string}</Message>
      )}
    </div>
  );
};
