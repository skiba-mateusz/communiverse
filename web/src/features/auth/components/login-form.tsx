import {
  LoginUserPayload,
  loginUserPayloadSchema,
  useLoginUser,
} from "@/features/auth/api/login-user";
import { Form, Input, PasswordInput } from "@/components/ui/form";
import { Button } from "@/components/ui/button";

export const LoginForm = () => {
  const { loginUser, isPending } = useLoginUser();

  return (
    <Form<LoginUserPayload>
      onSubmit={(data) => loginUser(data)}
      schema={loginUserPayloadSchema}
    >
      <Input name="email" label="Email Address" type="email" />
      <PasswordInput name="password" label="Password" withForgotLink />
      <Button isLoading={isPending}>Log In</Button>
    </Form>
  );
};
