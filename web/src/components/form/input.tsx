import styled from "styled-components";
import { useFormContext } from "react-hook-form";
import { Message } from "@/components/ui/message";

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

interface FormInputProps {
  name: string;
  label: string;
  type?: string;
}

export const Input = ({ name, label, type = "text" }: FormInputProps) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const isError = errors[name];

  return (
    <div>
      <Label htmlFor={name}>{label}</Label>
      <StyledInput
        id={name}
        type={type}
        aria-invalid={Boolean(isError)}
        {...register(name)}
      />
      {isError && (
        <Message variant="alert">{errors[name]?.message as string}</Message>
      )}
    </div>
  );
};
