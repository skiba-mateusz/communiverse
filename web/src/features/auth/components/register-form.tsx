import { Form, Input, PasswordInput } from "@/components/ui/form";
import {
  useRegisterUser,
  RegisterUserPayload,
  registerUserPayloadSchema,
} from "../api/register-user";
import { Button } from "@/components/ui/button";

export const RegisterForm = () => {
  const { registerUser, isPending } = useRegisterUser();

  return (
    <Form<RegisterUserPayload>
      onSubmit={(data) => registerUser(data)}
      schema={registerUserPayloadSchema}
    >
      <Input name="name" label="Name" />
      <Input name="username" label="Username" />
      <Input name="email" label="Email" type="email" />
      <PasswordInput name="password" label="Password" withForgotLink />
      <PasswordInput
        name="passwordConfirmation"
        label="Password confirmation"
      />
      <Button $full isLoading={isPending}>
        Register
      </Button>
    </Form>
  );
};
