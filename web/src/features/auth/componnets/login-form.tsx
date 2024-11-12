import {
  loginUserPayload,
  loginUserPayloadSchema,
  useLoginUser,
} from "@/features/auth/api/login-user";
import { Form, Input } from "@/components/form";
import { Button } from "@/components/ui/button";

export const LoginForm = () => {
  const { loginUser, isPending } = useLoginUser();

  return (
    <Form<loginUserPayload>
      onSubmit={(data) => loginUser(data)}
      schema={loginUserPayloadSchema}
    >
      <Input name="email" label="Email Address" type="email" />
      <Input name="password" label="Password" type="password" />
      <Button isLoading={isPending}>Log In</Button>
    </Form>
  );
};
