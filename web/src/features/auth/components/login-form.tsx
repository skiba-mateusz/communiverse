import {
  LoginUserPayload,
  loginUserPayloadSchema,
  useLoginUser,
} from "@/features/auth/api/login-user";
import { Form, Input } from "@/components/form";
import { Button } from "@/components/ui/button";

export const LoginForm = () => {
  const { loginUser, isPending } = useLoginUser();

  return (
    <Form<LoginUserPayload>
      onSubmit={(data) => loginUser(data)}
      schema={loginUserPayloadSchema}
    >
      <Input name="email" label="Email Address" type="email" />
      <Input
        name="password"
        label="Password"
        type="password"
        forgotPasswordLink
      />
      <Button isLoading={isPending} full>
        Log In
      </Button>
    </Form>
  );
};
