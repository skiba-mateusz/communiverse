import {
  LoginUserPayload,
  loginUserPayloadSchema,
  useLoginUser,
} from "@/features/auth/api/login-user";
import { Form, Input } from "@/components/form";
import { Button } from "@/components/ui/button";
import { Flow } from "@/components/ui/flow";

export const LoginForm = () => {
  const { loginUser, isPending } = useLoginUser();

  return (
    <Form<LoginUserPayload>
      onSubmit={(data) => loginUser(data)}
      schema={loginUserPayloadSchema}
    >
      <Flow spacing="1rem">
        <div>
          <Input name="email" label="Email Address" type="email" />
          <Input name="password" label="Password" type="password" />
        </div>
        <Button isLoading={isPending} full>
          Log In
        </Button>
      </Flow>
    </Form>
  );
};
