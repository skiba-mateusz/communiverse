import { Form, Input } from "@/components/form";
import {
  useRegisterUser,
  RegisterUserPayload,
  registerUserPayloadSchema,
} from "../api/register-user";
import { Button } from "@/components/ui/button";
import { Flow } from "@/components/ui/flow";

export const RegisterForm = () => {
  const { registerUser, isPending } = useRegisterUser();

  console.log("dsa");

  return (
    <Form<RegisterUserPayload>
      onSubmit={(data) => registerUser(data)}
      schema={registerUserPayloadSchema}
    >
      <Input name="name" label="Name" />
      <Input name="username" label="Username" />
      <Input name="email" label="Email" type="email" />
      <Input
        name="password"
        label="Password"
        type="password"
        forgotPasswordLink
      />
      <Input
        name="passwordConfirmation"
        label="Password confirmation"
        type="password"
      />

      <Button isLoading={isPending} full>
        Register
      </Button>
    </Form>
  );
};
