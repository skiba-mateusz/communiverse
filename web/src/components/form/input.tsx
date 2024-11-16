import styled from "styled-components";
import { useFormContext } from "react-hook-form";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";

import { Message } from "@/components/ui/message";
import { useState } from "react";
import { Link } from "@/components/ui/link";

const InputWrapper = styled.div`
  position: relative;
`;

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

const LabelWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: var(--fs-50);
`;

const ToggleBtn = styled.button`
  position: absolute;
  inset: 0 0 0.25rem auto;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: transparent;
  border: none;
  aspect-ratio: 1/1;

  &:hover {
    opacity: 0.8;
  }
`;

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label: string;
  type?: string;
  forgotPasswordLink?: boolean;
}

export const Input = ({
  name,
  label,
  type = "text",
  forgotPasswordLink = false,
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
      <LabelWrapper>
        <label htmlFor={name}>{label}</label>
        {type === "password" && forgotPasswordLink ? (
          <Link to="/auth/forgot-password">Forgot password?</Link>
        ) : null}
      </LabelWrapper>
      <InputWrapper>
        <StyledInput
          id={name}
          type={type !== "password" ? type : isVisible ? "text" : "password"}
          aria-invalid={Boolean(isError)}
          {...register(name)}
          {...restProps}
        />
        {type === "password" ? (
          <ToggleBtn
            type="button"
            onClick={() => setIsVisible((prev) => !prev)}
          >
            {isVisible ? <AiFillEye /> : <AiFillEyeInvisible />}
          </ToggleBtn>
        ) : null}
      </InputWrapper>
      {isError ? (
        <Message variant="alert">{errors[name]?.message as string}</Message>
      ) : null}
    </div>
  );
};
