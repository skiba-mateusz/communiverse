import styled from "styled-components";
import { Input } from "./input";

interface PasswordInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label: string;
}

const Wrapper = styled.div`
  position: relative;
`;

const ToggleBtn = styled.button`
  position: absolute;
  inset: 0 0 0 auto;
  background-color: red;
`;

export const PasswordInput = ({
  name,
  label,
  ...restProps
}: PasswordInputProps) => {
  return (
    <Wrapper>
      <Input name={name} label={label} {...restProps} />
      <ToggleBtn>x</ToggleBtn>
    </Wrapper>
  );
};
