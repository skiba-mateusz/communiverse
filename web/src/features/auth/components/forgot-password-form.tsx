import { Button } from "@/components/ui/button";
import { Form, Input } from "@/components/ui/form";
import {
  ForgotPasswordPayload,
  forgotPasswordSchema,
  useForgotPassword,
} from "../api/forgot-password";

export const ForgotPasswordForm = () => {
  const { forgotPassword, isPending } = useForgotPassword();

  return (
    <Form<ForgotPasswordPayload>
      schema={forgotPasswordSchema}
      onSubmit={(data) => forgotPassword(data)}
    >
      <Input name="email" label="Email address" type="email" />
      <Button isLoading={isPending}>Send reset link</Button>
    </Form>
  );
};
