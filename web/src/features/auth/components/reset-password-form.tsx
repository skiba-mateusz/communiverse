import {
  ResetPasswordPayload,
  resetPasswordSchema,
  useResetPassword,
} from "../api/reset-password";
import { Form, Input } from "@/components/ui/form";
import { Button } from "@/components/ui/button";

export const ResetPasswordForm = () => {
  const { resetPassword, isPending } = useResetPassword();

  return (
    <Form<ResetPasswordPayload>
      schema={resetPasswordSchema}
      onSubmit={(data) => resetPassword(data)}
    >
      <Input name="password" label="New password" type="password" />
      <Input
        name="passwordConfirmation"
        label="Confirm new password"
        type="password"
      />
      <Button isLoading={isPending}>Reset password</Button>
    </Form>
  );
};
