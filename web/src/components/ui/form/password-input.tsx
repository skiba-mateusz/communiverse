import { useState } from "react";
import { Link } from "../link";
import { Input } from "./input";
import { Button } from "../button";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";

interface PasswordInputProps {
  name: string;
  label: string;
  placeholder?: string;
  withForgotLink?: boolean;
}

export const PasswordInput = ({
  name,
  label,
  placeholder,
  withForgotLink = false,
}: PasswordInputProps) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <Input
      name={name}
      label={label}
      type={isVisible ? "text" : "password"}
      placeholder={placeholder}
      action={
        withForgotLink ? (
          <Link to="/auth/forgot-password">Forgot password?</Link>
        ) : null
      }
      andorment={
        <Button
          type="button"
          variant="transparent"
          onClick={() => setIsVisible((visible) => !visible)}
          styles={{ padding: 0 }}
          aria-label="Toggle password visibility"
        >
          {isVisible ? <AiFillEye /> : <AiFillEyeInvisible />}
        </Button>
      }
    />
  );
};
